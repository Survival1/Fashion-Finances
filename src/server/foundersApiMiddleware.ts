/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { IncomingMessage, ServerResponse } from 'http';
import {
  FounderPosition,
  FounderPaymentIncident,
  FoundersProgramConfig,
  FoundersConversionStats
} from '../types/founders';
import { ADMIN_SECRET_TOKEN } from './adminApiMiddleware';
import { recordAuditLog } from './adminBackend';

interface ReservationHistoryItem {
  reservationId: string;
  userId: string;
  username: string;
  professionalName: string;
  positionCode: string;
  status: 'AVAILABLE' | 'RESERVED' | 'CONFIRMED';
  paymentStatus: 'unpaid' | 'pending_provider_confirmation' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  paymentProvider?: string;
  amountEur: number;
  createdAt: string;
  updatedAt: string;
  stripeSessionId?: string;
}

interface FoundersDatabase {
  config: FoundersProgramConfig;
  positions: FounderPosition[];
  incidents: FounderPaymentIncident[];
  reservationsHistory: ReservationHistoryItem[];
  analytics: {
    pageViews: number;
    reserveStarts: number;
    cancelledOrRefundedCount: number;
  };
}

const FOUNDERS_DB_PATH = path.join(process.cwd(), 'founders_program.json');

// Async mutex queue to guarantee atomic slot allocation and prevent race conditions / duplicate numbers
let mutationChain: Promise<void> = Promise.resolve();
function withFoundersLock<T>(fn: () => Promise<T> | T): Promise<T> {
  const next = mutationChain.then(() => fn());
  mutationChain = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function padFounderCode(num: number): string {
  return String(num).padStart(3, '0');
}

function createInitialFoundersDatabase(): FoundersDatabase {
  const now = new Date();
  const launch = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  const positions: FounderPosition[] = Array.from({ length: 100 }, (_, idx) => {
    const number = idx + 1;
    return {
      number,
      code: padFounderCode(number),
      status: 'AVAILABLE'
    };
  });

  return {
    config: {
      openingDate: now.toISOString(),
      launchDate: launch.toISOString(),
      programClosed: false,
      packagePriceEur: 100000,
      currency: 'EUR'
    },
    positions,
    incidents: [],
    reservationsHistory: [],
    analytics: {
      pageViews: 0,
      reserveStarts: 0,
      cancelledOrRefundedCount: 0
    }
  };
}

function loadFoundersDatabase(): FoundersDatabase {
  try {
    if (fs.existsSync(FOUNDERS_DB_PATH)) {
      const raw = fs.readFileSync(FOUNDERS_DB_PATH, 'utf-8');
      const parsed = JSON.parse(raw) as FoundersDatabase;
      if (parsed && Array.isArray(parsed.positions) && parsed.positions.length === 100) {
        if (parsed.config && parsed.config.packagePriceEur === 10000) {
          parsed.config.packagePriceEur = 100000;
          saveFoundersDatabase(parsed);
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('[Founders DB Read Error]', err);
  }
  const initial = createInitialFoundersDatabase();
  saveFoundersDatabase(initial);
  return initial;
}

function saveFoundersDatabase(db: FoundersDatabase): void {
  try {
    fs.writeFileSync(FOUNDERS_DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Founders DB Write Error]', err);
  }
}

// Release expired RESERVED holds (> 24h without payment provider confirmation)
function cleanupExpiredReservations(db: FoundersDatabase): boolean {
  const nowMs = Date.now();
  let changed = false;

  db.positions = db.positions.map((pos) => {
    if (pos.status === 'RESERVED' && pos.expiresAt) {
      const expMs = new Date(pos.expiresAt).getTime();
      if (!isNaN(expMs) && expMs <= nowMs) {
        changed = true;
        if (pos.reservationId) {
          const hist = db.reservationsHistory.find((h) => h.reservationId === pos.reservationId);
          if (hist) {
            hist.status = 'AVAILABLE';
            hist.paymentStatus = 'cancelled';
            hist.updatedAt = new Date().toISOString();
          }
          db.analytics.cancelledOrRefundedCount += 1;
        }
        return {
          number: pos.number,
          code: pos.code,
          status: 'AVAILABLE'
        };
      }
    }
    return pos;
  });

  return changed;
}

function computeStats(db: FoundersDatabase): FoundersConversionStats {
  const confirmedCount = db.positions.filter((p) => p.status === 'CONFIRMED').length;
  const reservedCount = db.positions.filter((p) => p.status === 'RESERVED').length;
  const availableCount = db.positions.filter((p) => p.status === 'AVAILABLE').length;
  const totalConfirmedRevenueEur = confirmedCount * (db.config.packagePriceEur || 100000);
  const conversionRatePercent =
    db.analytics.reserveStarts > 0
      ? Number(((confirmedCount / db.analytics.reserveStarts) * 100).toFixed(1))
      : 0;

  return {
    pageViews: db.analytics.pageViews,
    reserveStarts: db.analytics.reserveStarts,
    reservedCount,
    confirmedCount,
    availableCount,
    cancelledOrRefundedCount: db.analytics.cancelledOrRefundedCount,
    totalConfirmedRevenueEur,
    conversionRatePercent
  };
}

function sanitizePositionForPublic(pos: FounderPosition, viewerUserId?: string): FounderPosition {
  const isOwner = Boolean(viewerUserId && pos.userId === viewerUserId);

  if (pos.status === 'AVAILABLE') {
    return {
      number: pos.number,
      code: pos.code,
      status: 'AVAILABLE'
    };
  }

  if (pos.status === 'RESERVED') {
    if (isOwner) {
      return { ...pos };
    }
    return {
      number: pos.number,
      code: pos.code,
      status: 'RESERVED',
      reservedAt: pos.reservedAt,
      expiresAt: pos.expiresAt,
      paymentStatus: 'pending_provider_confirmation'
    };
  }

  // CONFIRMED
  if (isOwner) {
    return { ...pos };
  }

  const publicOptIn = Boolean(pos.allowPublicDisplay);
  return {
    number: pos.number,
    code: pos.code,
    status: 'CONFIRMED',
    confirmedAt: pos.confirmedAt,
    joinDate: pos.joinDate,
    badgeActive: pos.badgeActive !== false,
    allowPublicDisplay: publicOptIn,
    professionalName: publicOptIn ? pos.professionalName : undefined,
    username: publicOptIn ? pos.username : undefined,
    avatar: publicOptIn ? pos.avatar : undefined
  };
}

function readRawAndJsonBody(req: IncomingMessage): Promise<{ raw: string; json: any }> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      let json = {};
      if (raw) {
        try {
          json = JSON.parse(raw);
        } catch {
          json = {};
        }
      }
      resolve({ raw, json });
    });
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function isAdminAuthorized(req: IncomingMessage): boolean {
  const authHeader = req.headers['x-admin-token'] || req.headers['authorization'];
  const userRoleHeader = req.headers['x-user-role'];
  return (
    authHeader === ADMIN_SECRET_TOKEN ||
    authHeader === `Bearer ${ADMIN_SECRET_TOKEN}` ||
    userRoleHeader === 'admin'
  );
}

// Verify Stripe Webhook v1 HMAC-SHA256 signature without needing external SDK installation
function verifyStripeSignature(rawBody: string, sigHeader: string | undefined, secret: string): boolean {
  if (!sigHeader || !secret) return false;
  try {
    const parts = sigHeader.split(',').reduce<Record<string, string[]>>((acc, item) => {
      const [k, v] = item.split('=');
      if (k && v) {
        const key = k.trim();
        acc[key] = acc[key] || [];
        acc[key].push(v.trim());
      }
      return acc;
    }, {});

    const timestamp = parts['t']?.[0];
    const signatures = parts['v1'] || [];
    if (!timestamp || signatures.length === 0) return false;

    const payload = `${timestamp}.${rawBody}`;
    const expected = crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');

    return signatures.some((sig) => {
      const sigBuf = Buffer.from(sig, 'hex');
      const expBuf = Buffer.from(expected, 'hex');
      return sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);
    });
  } catch {
    return false;
  }
}

async function createRealStripeCheckoutSession(params: {
  reservationId: string;
  userId: string;
  username: string;
  professionalName: string;
  positionCode: string;
  email?: string;
  originUrl: string;
  priceEur: number;
}): Promise<{ id: string; url: string }> {
  const stripeSecret = process.env.STRIPE_SECRET_KEY!;
  const body = new URLSearchParams();
  body.set('mode', 'payment');
  body.set('payment_method_types[0]', 'card');
  body.set('line_items[0][price_data][currency]', 'eur');
  body.set('line_items[0][price_data][product_data][name]', 'Fashion Finances — The First 100 Founders Package');
  body.set(
    'line_items[0][price_data][product_data][description]',
    `Precompra exclusiva · Reserva de posición oficial #${params.positionCode} (001–100)`
  );
  body.set('line_items[0][price_data][unit_amount]', String(Math.round(params.priceEur * 100)));
  body.set('line_items[0][quantity]', '1');
  body.set('client_reference_id', params.reservationId);
  if (params.email) {
    body.set('customer_email', params.email);
  }
  body.set('metadata[reservationId]', params.reservationId);
  body.set('metadata[userId]', params.userId);
  body.set('metadata[username]', params.username);
  body.set('metadata[positionCode]', params.positionCode);
  body.set('success_url', `${params.originUrl}/?first100_session_id={CHECKOUT_SESSION_ID}`);
  body.set('cancel_url', `${params.originUrl}/?first100_cancelled=${encodeURIComponent(params.reservationId)}`);

  const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeSecret}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  });

  const data: any = await resp.json();
  if (!resp.ok || !data?.id || !data?.url) {
    throw new Error(data?.error?.message || 'Stripe Checkout session creation failed.');
  }

  return { id: data.id, url: data.url };
}

async function fetchStripeCheckoutSession(sessionId: string): Promise<any> {
  const stripeSecret = process.env.STRIPE_SECRET_KEY!;
  const resp = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${stripeSecret}`
    }
  });
  const data: any = await resp.json();
  if (!resp.ok) {
    throw new Error(data?.error?.message || 'Unable to verify Stripe Checkout session.');
  }
  return data;
}

function finalizePositionFromVerifiedProvider(
  db: FoundersDatabase,
  args: {
    reservationId?: string;
    stripeSessionId?: string;
    stripePaymentIntentId?: string;
    paymentProvider: 'stripe' | 'bank_transfer';
  }
): FounderPosition | null {
  const nowIso = new Date().toISOString();

  // Locate the RESERVED slot belonging to this reservation
  let slotIdx = db.positions.findIndex(
    (p) =>
      (args.reservationId && p.reservationId === args.reservationId) ||
      (args.stripeSessionId && p.stripeSessionId === args.stripeSessionId)
  );

  // If slot was somehow released/not attached, atomically pick the lowest AVAILABLE slot
  const historyMatch = db.reservationsHistory.find(
    (h) =>
      (args.reservationId && h.reservationId === args.reservationId) ||
      (args.stripeSessionId && h.stripeSessionId === args.stripeSessionId)
  );

  if (slotIdx === -1 && historyMatch) {
    // Check if user already confirmed another slot (prevent duplicates per user)
    const existingUserConfirmed = db.positions.find(
      (p) => p.status === 'CONFIRMED' && p.userId === historyMatch.userId
    );
    if (existingUserConfirmed) {
      return existingUserConfirmed;
    }
    slotIdx = db.positions.findIndex((p) => p.status === 'AVAILABLE');
  }

  if (slotIdx === -1) return null;

  const target = db.positions[slotIdx];
  if (target.status === 'CONFIRMED') {
    return target;
  }

  // Ensure the confirmed slot gets the first/lowest free founder position if target is higher than an AVAILABLE slot
  // Notice: positions are allocated from 001 upward when reserved, or if an earlier slot freed up before confirmation,
  // re-assign to lowest AVAILABLE index so no earlier gap stays empty while preserving guaranteed uniqueness.
  const lowestAvailableIdx = db.positions.findIndex((p) => p.status === 'AVAILABLE');
  let finalIdx = slotIdx;
  if (lowestAvailableIdx !== -1 && lowestAvailableIdx < slotIdx) {
    const reservedSnapshot = { ...target };
    db.positions[slotIdx] = {
      number: target.number,
      code: target.code,
      status: 'AVAILABLE'
    };
    finalIdx = lowestAvailableIdx;
    const lowestTarget = db.positions[finalIdx];
    db.positions[finalIdx] = {
      ...reservedSnapshot,
      number: lowestTarget.number,
      code: lowestTarget.code
    };
  }

  const slot = db.positions[finalIdx];
  const confirmed: FounderPosition = {
    ...slot,
    status: 'CONFIRMED',
    confirmedAt: nowIso,
    joinDate: nowIso,
    expiresAt: undefined,
    paymentProvider: args.paymentProvider,
    paymentStatus: 'paid',
    stripeSessionId: args.stripeSessionId || slot.stripeSessionId,
    stripePaymentIntentId: args.stripePaymentIntentId || slot.stripePaymentIntentId,
    badgeActive: true,
    completionPercent: slot.completionPercent ?? 0,
    completedTasksCount: slot.completedTasksCount ?? 0,
    totalTasksCount: slot.totalTasksCount ?? 8,
    completedTaskIds: slot.completedTaskIds ?? []
  };

  db.positions[finalIdx] = confirmed;

  if (historyMatch) {
    historyMatch.positionCode = confirmed.code;
    historyMatch.status = 'CONFIRMED';
    historyMatch.paymentStatus = 'paid';
    historyMatch.paymentProvider = args.paymentProvider;
    historyMatch.stripeSessionId = confirmed.stripeSessionId;
    historyMatch.updatedAt = nowIso;
  }

  // Automatically close program if all 100 positions are CONFIRMED
  const totalConfirmed = db.positions.filter((p) => p.status === 'CONFIRMED').length;
  if (totalConfirmed >= 100) {
    db.config.programClosed = true;
    db.config.closedReason = 'Las 100 plazas de Founding Model han sido confirmadas.';
  }

  return confirmed;
}

export async function handleFoundersApi(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = req.url || '';
  if (!url.startsWith('/api/founders')) {
    return false;
  }

  const [pathname, search] = url.split('?');
  const params = new URLSearchParams(search || '');
  const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);

  // 1. GET /api/founders/state — Public & user-scoped live status
  if (pathname === '/api/founders/state' && req.method === 'GET') {
    const userId = params.get('userId') || undefined;
    const trackView = params.get('trackView') === 'true';

    const payload = await withFoundersLock(() => {
      const db = loadFoundersDatabase();
      const cleaned = cleanupExpiredReservations(db);
      if (trackView) {
        db.analytics.pageViews += 1;
      }
      if (cleaned || trackView) {
        saveFoundersDatabase(db);
      }

      const myRaw = userId
        ? db.positions.find(
            (p) => p.userId === userId && (p.status === 'CONFIRMED' || p.status === 'RESERVED')
          ) || null
        : null;

      return {
        config: db.config,
        stripeConfigured,
        positions: db.positions.map((p) => sanitizePositionForPublic(p, userId)),
        stats: computeStats(db),
        myPosition: myRaw ? { ...myRaw } : null
      };
    });

    sendJson(res, 200, payload);
    return true;
  }

  // 2. POST /api/founders/reserve — Create a RESERVED hold & initiate real Stripe checkout (no fake payment!)
  if (pathname === '/api/founders/reserve' && req.method === 'POST') {
    const { json: body } = await readRawAndJsonBody(req);
    const { userId, username, professionalName, avatar, email, role, allowPublicDisplay } = body || {};

    if (!userId || !username || role === 'visitor') {
      sendJson(res, 401, {
        error: 'Debes iniciar sesión o registrarte como miembro de Fashion Finances para reservar una plaza.'
      });
      return true;
    }

    const result = await withFoundersLock(async () => {
      const db = loadFoundersDatabase();
      cleanupExpiredReservations(db);

      if (db.config.programClosed) {
        return {
          status: 409,
          body: { error: db.config.closedReason || 'El programa THE FIRST 100 está cerrado actualmente.' }
        };
      }

      // Check if user already holds a position
      const existing = db.positions.find(
        (p) => p.userId === userId && (p.status === 'CONFIRMED' || p.status === 'RESERVED')
      );
      if (existing) {
        if (existing.status === 'CONFIRMED') {
          return {
            status: 409,
            body: {
              error: `Ya cuentas con la posición confirmada #${existing.code} asociada a tu cuenta.`,
              position: existing
            }
          };
        }
        // Return existing pending reservation so they can resume/cancel without creating duplicates
        if (stripeConfigured) {
          try {
            const origin =
              (req.headers.origin as string) ||
              `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;
            const session = await createRealStripeCheckoutSession({
              reservationId: existing.reservationId!,
              userId,
              username,
              professionalName: professionalName || existing.professionalName || username,
              positionCode: existing.code,
              email,
              originUrl: origin,
              priceEur: db.config.packagePriceEur || 100000
            });
            existing.stripeSessionId = session.id;
            saveFoundersDatabase(db);
            return {
              status: 200,
              body: {
                success: true,
                position: existing,
                checkoutUrl: session.url,
                stripeSessionId: session.id,
                requiresProviderConfig: false
              }
            };
          } catch (stripeErr: any) {
            return {
              status: 502,
              body: { error: stripeErr?.message || 'Error al iniciar sesión con Stripe.' }
            };
          }
        }

        return {
          status: 200,
          body: {
            success: true,
            position: existing,
            requiresProviderConfig: true,
            message:
              'Ya tienes una reserva pendiente de confirmación de pago (RESERVED). No se confirma ninguna plaza hasta recibir verificación real del proveedor de pagos.'
          }
        };
      }

      // Assign first AVAILABLE position atomically for pending reservation
      const availableIdx = db.positions.findIndex((p) => p.status === 'AVAILABLE');
      if (availableIdx === -1) {
        return {
          status: 409,
          body: {
            error:
              'Todas las plazas del 001 al 100 se encuentran actualmente confirmadas o reservadas pendientes de pago.'
          }
        };
      }

      const targetSlot = db.positions[availableIdx];
      const nowIso = new Date().toISOString();
      const expiresAtIso = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const reservationId = `f100-res-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

      const reservedSlot: FounderPosition = {
        number: targetSlot.number,
        code: targetSlot.code,
        status: 'RESERVED',
        reservationId,
        userId,
        username,
        professionalName: professionalName || username,
        avatar: avatar || '',
        allowPublicDisplay: Boolean(allowPublicDisplay),
        reservedAt: nowIso,
        expiresAt: expiresAtIso,
        paymentProvider: stripeConfigured ? 'stripe' : 'pending_gateway',
        paymentStatus: 'pending_provider_confirmation'
      };

      db.positions[availableIdx] = reservedSlot;
      db.analytics.reserveStarts += 1;
      db.reservationsHistory.unshift({
        reservationId,
        userId,
        username,
        professionalName: professionalName || username,
        positionCode: targetSlot.code,
        status: 'RESERVED',
        paymentStatus: 'pending_provider_confirmation',
        paymentProvider: stripeConfigured ? 'stripe' : 'pending_gateway',
        amountEur: db.config.packagePriceEur || 100000,
        createdAt: nowIso,
        updatedAt: nowIso
      });

      if (stripeConfigured) {
        try {
          const origin =
            (req.headers.origin as string) ||
            `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;
          const session = await createRealStripeCheckoutSession({
            reservationId,
            userId,
            username,
            professionalName: professionalName || username,
            positionCode: targetSlot.code,
            email,
            originUrl: origin,
            priceEur: db.config.packagePriceEur || 100000
          });
          reservedSlot.stripeSessionId = session.id;
          db.positions[availableIdx] = reservedSlot;
          if (db.reservationsHistory[0]) {
            db.reservationsHistory[0].stripeSessionId = session.id;
          }
          saveFoundersDatabase(db);
          return {
            status: 200,
            body: {
              success: true,
              position: reservedSlot,
              checkoutUrl: session.url,
              stripeSessionId: session.id,
              requiresProviderConfig: false
            }
          };
        } catch (stripeErr: any) {
          db.incidents.unshift({
            id: `inc-${Date.now()}`,
            reservationId,
            positionCode: targetSlot.code,
            userId,
            username,
            type: 'payment_failed',
            status: 'open',
            description: `Fallo al crear sesión Stripe Checkout: ${stripeErr?.message || 'Error desconocido'}`,
            createdAt: nowIso
          });
          saveFoundersDatabase(db);
          return {
            status: 502,
            body: {
              error:
                stripeErr?.message ||
                'No se pudo conectar con Stripe Checkout. La plaza permanece en estado RESERVED pendiente de confirmación.'
            }
          };
        }
      }

      // Gateway not configured in runtime environment -> record honest RESERVED hold & open payment-pending incident, NEVER confirm!
      db.incidents.unshift({
        id: `inc-${Date.now()}`,
        reservationId,
        positionCode: targetSlot.code,
        userId,
        username,
        type: 'gateway_not_configured',
        status: 'open',
        description: `Reserva #${targetSlot.code} (${reservationId}) creada por @${username} en estado RESERVED. Pendiente de confirmación real por proveedor de pagos (STRIPE_SECRET_KEY no configurada en el servidor).`,
        createdAt: nowIso
      });
      saveFoundersDatabase(db);

      return {
        status: 200,
        body: {
          success: true,
          position: reservedSlot,
          requiresProviderConfig: true,
          message:
            'Tu solicitud ha quedado en estado RESERVED (pendiente de confirmación real del pago). La plaza nunca se confirma sin validación del proveedor de pagos.'
        }
      };
    });

    sendJson(res, result.status, result.body);
    return true;
  }

  // 3. POST /api/founders/stripe-webhook — Verified server-side webhook confirmation
  if (pathname === '/api/founders/stripe-webhook' && req.method === 'POST') {
    const { raw, json } = await readRawAndJsonBody(req);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const signatureHeader = req.headers['stripe-signature'] as string | undefined;

    if (!webhookSecret) {
      sendJson(res, 503, { error: 'STRIPE_WEBHOOK_SECRET no está configurado en el servidor.' });
      return true;
    }

    if (!verifyStripeSignature(raw, signatureHeader, webhookSecret)) {
      sendJson(res, 400, { error: 'Firma de webhook Stripe inválida.' });
      return true;
    }

    const eventType = json?.type;
    const sessionObj = json?.data?.object;

    if (eventType === 'checkout.session.completed' && sessionObj?.payment_status === 'paid') {
      const confirmed = await withFoundersLock(() => {
        const db = loadFoundersDatabase();
        const result = finalizePositionFromVerifiedProvider(db, {
          reservationId: sessionObj.metadata?.reservationId || sessionObj.client_reference_id,
          stripeSessionId: sessionObj.id,
          stripePaymentIntentId: sessionObj.payment_intent,
          paymentProvider: 'stripe'
        });
        saveFoundersDatabase(db);
        return result;
      });

      sendJson(res, 200, { received: true, confirmedPositionCode: confirmed?.code || null });
      return true;
    }

    sendJson(res, 200, { received: true });
    return true;
  }

  // 4. POST /api/founders/verify-stripe-session — Verify return from real Stripe Checkout
  if (pathname === '/api/founders/verify-stripe-session' && req.method === 'POST') {
    if (!stripeConfigured) {
      sendJson(res, 503, { error: 'Stripe no está configurado en el servidor.' });
      return true;
    }
    const { json: body } = await readRawAndJsonBody(req);
    const sessionId = body?.sessionId;
    if (!sessionId) {
      sendJson(res, 400, { error: 'Falta sessionId.' });
      return true;
    }

    try {
      const session = await fetchStripeCheckoutSession(sessionId);
      if (session.payment_status !== 'paid') {
        sendJson(res, 402, {
          paid: false,
          paymentStatus: session.payment_status,
          message: 'El pago aún no figura como completado en Stripe.'
        });
        return true;
      }

      const confirmed = await withFoundersLock(() => {
        const db = loadFoundersDatabase();
        const result = finalizePositionFromVerifiedProvider(db, {
          reservationId: session.metadata?.reservationId || session.client_reference_id,
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent,
          paymentProvider: 'stripe'
        });
        saveFoundersDatabase(db);
        return result;
      });

      sendJson(res, 200, { paid: true, position: confirmed });
      return true;
    } catch (err: any) {
      sendJson(res, 502, { error: err?.message || 'Error al verificar sesión con Stripe.' });
      return true;
    }
  }

  // 5. POST /api/founders/cancel-reservation — Cancel user's pending RESERVED slot & release to AVAILABLE
  if (pathname === '/api/founders/cancel-reservation' && req.method === 'POST') {
    const { json: body } = await readRawAndJsonBody(req);
    const { userId, reservationId } = body || {};
    if (!userId) {
      sendJson(res, 400, { error: 'Falta userId.' });
      return true;
    }

    const released = await withFoundersLock(() => {
      const db = loadFoundersDatabase();
      const idx = db.positions.findIndex(
        (p) =>
          p.userId === userId &&
          p.status === 'RESERVED' &&
          (!reservationId || p.reservationId === reservationId)
      );
      if (idx === -1) return null;

      const slot = db.positions[idx];
      const nowIso = new Date().toISOString();
      const hist = db.reservationsHistory.find((h) => h.reservationId === slot.reservationId);
      if (hist) {
        hist.status = 'AVAILABLE';
        hist.paymentStatus = 'cancelled';
        hist.updatedAt = nowIso;
      }
      db.analytics.cancelledOrRefundedCount += 1;
      db.positions[idx] = {
        number: slot.number,
        code: slot.code,
        status: 'AVAILABLE'
      };
      saveFoundersDatabase(db);
      return slot.code;
    });

    if (!released) {
      sendJson(res, 404, { error: 'No se encontró una reserva pendiente para liberar.' });
      return true;
    }

    sendJson(res, 200, { success: true, releasedCode: released });
    return true;
  }

  // 6. POST /api/founders/progress — Persist real founder preparation progress
  if (pathname === '/api/founders/progress' && req.method === 'POST') {
    const { json: body } = await readRawAndJsonBody(req);
    const { userId, completionPercent, completedTasksCount, totalTasksCount, completedTaskIds, allowPublicDisplay } =
      body || {};
    if (!userId) {
      sendJson(res, 400, { error: 'Falta userId.' });
      return true;
    }

    const updated = await withFoundersLock(() => {
      const db = loadFoundersDatabase();
      const idx = db.positions.findIndex((p) => p.userId === userId && p.status === 'CONFIRMED');
      if (idx === -1) return null;

      db.positions[idx] = {
        ...db.positions[idx],
        completionPercent:
          typeof completionPercent === 'number' ? completionPercent : db.positions[idx].completionPercent,
        completedTasksCount:
          typeof completedTasksCount === 'number' ? completedTasksCount : db.positions[idx].completedTasksCount,
        totalTasksCount:
          typeof totalTasksCount === 'number' ? totalTasksCount : db.positions[idx].totalTasksCount,
        completedTaskIds: Array.isArray(completedTaskIds)
          ? completedTaskIds
          : db.positions[idx].completedTaskIds,
        allowPublicDisplay:
          typeof allowPublicDisplay === 'boolean' ? allowPublicDisplay : db.positions[idx].allowPublicDisplay,
        lastProgressUpdatedAt: new Date().toISOString()
      };
      saveFoundersDatabase(db);
      return db.positions[idx];
    });

    sendJson(res, 200, { success: Boolean(updated), position: updated });
    return true;
  }

  // === ADMIN-ONLY ENDPOINTS ===
  if (pathname.startsWith('/api/founders/admin')) {
    if (!isAdminAuthorized(req)) {
      sendJson(res, 403, { error: 'Acceso restringido al equipo administrador.' });
      return true;
    }

    // GET /api/founders/admin/overview
    if (pathname === '/api/founders/admin/overview' && req.method === 'GET') {
      const payload = await withFoundersLock(() => {
        const db = loadFoundersDatabase();
        const cleaned = cleanupExpiredReservations(db);
        if (cleaned) saveFoundersDatabase(db);
        return {
          config: db.config,
          stripeConfigured,
          positions: db.positions,
          stats: computeStats(db),
          incidents: db.incidents,
          allReservationsHistory: db.reservationsHistory
        };
      });
      sendJson(res, 200, payload);
      return true;
    }

    // PUT /api/founders/admin/config
    if (pathname === '/api/founders/admin/config' && req.method === 'PUT') {
      const { json: body } = await readRawAndJsonBody(req);
      const updated = await withFoundersLock(() => {
        const db = loadFoundersDatabase();
        const nextOpening = body.openingDate
          ? new Date(body.openingDate).toISOString()
          : db.config.openingDate;
        const nextLaunch = body.launchDate
          ? new Date(body.launchDate).toISOString()
          : db.config.launchDate;

        db.config = {
          ...db.config,
          openingDate: nextOpening,
          launchDate: nextLaunch,
          programClosed:
            typeof body.programClosed === 'boolean' ? body.programClosed : db.config.programClosed,
          closedReason:
            body.closedReason !== undefined ? body.closedReason : db.config.closedReason
        };
        saveFoundersDatabase(db);
        recordAuditLog({
          adminUser: (req.headers['x-admin-user'] as string) || 'Admin',
          action: 'Actualización Programa The First 100',
          module: 'configuracion',
          targetId: 'first-100',
          details: `Fechas/Estado actualizados. Apertura: ${db.config.openingDate}, Lanzamiento: ${db.config.launchDate}, Cerrado: ${db.config.programClosed}.`,
          severity: 'warning'
        });
        return db.config;
      });
      sendJson(res, 200, { success: true, config: updated });
      return true;
    }

    // PATCH /api/founders/admin/badge — Toggle badgeActive for a confirmed founder
    if (pathname === '/api/founders/admin/badge' && req.method === 'PATCH') {
      const { json: body } = await readRawAndJsonBody(req);
      const { positionCode, badgeActive } = body || {};
      const updated = await withFoundersLock(() => {
        const db = loadFoundersDatabase();
        const idx = db.positions.findIndex((p) => p.code === positionCode && p.status === 'CONFIRMED');
        if (idx === -1) return null;
        db.positions[idx].badgeActive = Boolean(badgeActive);
        saveFoundersDatabase(db);
        recordAuditLog({
          adminUser: (req.headers['x-admin-user'] as string) || 'Admin',
          action: badgeActive ? 'Activación Insignia Founding Model' : 'Suspensión Insignia Founding Model',
          module: 'modelos',
          targetId: `pos-${positionCode}`,
          details: `Insignia Founding Model #${positionCode} (@${db.positions[idx].username}) establecida en ${badgeActive ? 'ACTIVA' : 'INACTIVA'}.`,
          severity: 'info'
        });
        return db.positions[idx];
      });
      if (!updated) {
        sendJson(res, 404, { error: 'Posición confirmada no encontrada.' });
        return true;
      }
      sendJson(res, 200, { success: true, position: updated });
      return true;
    }

    // POST /api/founders/admin/release-or-refund — Cancel/refund/release a position
    if (pathname === '/api/founders/admin/release-or-refund' && req.method === 'POST') {
      const { json: body } = await readRawAndJsonBody(req);
      const { positionCode, actionType, reason } = body || {};
      if (!positionCode || !['cancel', 'refund'].includes(actionType)) {
        sendJson(res, 400, { error: 'Parámetros inválidos.' });
        return true;
      }

      const released = await withFoundersLock(() => {
        const db = loadFoundersDatabase();
        const idx = db.positions.findIndex((p) => p.code === positionCode);
        if (idx === -1 || db.positions[idx].status === 'AVAILABLE') return null;

        const target = db.positions[idx];
        const nowIso = new Date().toISOString();
        const hist = db.reservationsHistory.find((h) => h.reservationId === target.reservationId);
        if (hist) {
          hist.status = 'AVAILABLE';
          hist.paymentStatus = actionType === 'refund' ? 'refunded' : 'cancelled';
          hist.updatedAt = nowIso;
        }
        db.analytics.cancelledOrRefundedCount += 1;
        db.incidents.unshift({
          id: `inc-rel-${Date.now()}`,
          reservationId: target.reservationId,
          positionCode: target.code,
          userId: target.userId,
          username: target.username,
          type: actionType === 'refund' ? 'refund_request' : 'cancellation',
          status: 'resolved',
          description: `Posición #${target.code} (@${target.username}) liberada por ${actionType === 'refund' ? 'devolución' : 'cancelación'}.`,
          resolutionNotes: reason || 'Liberación administrativa conforme a condiciones del programa.',
          createdAt: nowIso,
          resolvedAt: nowIso
        });
        db.positions[idx] = {
          number: target.number,
          code: target.code,
          status: 'AVAILABLE'
        };
        if (db.config.programClosed && db.positions.filter((p) => p.status === 'CONFIRMED').length < 100) {
          db.config.programClosed = false;
        }
        saveFoundersDatabase(db);
        recordAuditLog({
          adminUser: (req.headers['x-admin-user'] as string) || 'Admin',
          action: actionType === 'refund' ? 'Devolución y Liberación Founders' : 'Cancelación y Liberación Founders',
          module: 'financiacion',
          targetId: `pos-${positionCode}`,
          details: `Posición #${positionCode} liberada a AVAILABLE. Motivo: ${reason || 'Administrativo'}.`,
          severity: 'warning'
        });
        return target.code;
      });

      if (!released) {
        sendJson(res, 404, { error: 'Posición no ocupada o no encontrada.' });
        return true;
      }

      sendJson(res, 200, { success: true, releasedCode: released });
      return true;
    }

    // PATCH /api/founders/admin/incidents/:id — Resolve/dismiss payment incident
    const incMatch = pathname.match(/^\/api\/founders\/admin\/incidents\/([a-zA-Z0-9_-]+)$/);
    if (incMatch && req.method === 'PATCH') {
      const incId = incMatch[1];
      const { json: body } = await readRawAndJsonBody(req);
      const updated = await withFoundersLock(() => {
        const db = loadFoundersDatabase();
        const inc = db.incidents.find((i) => i.id === incId);
        if (!inc) return null;
        inc.status = body.status || 'resolved';
        inc.resolutionNotes = body.resolutionNotes || inc.resolutionNotes;
        inc.resolvedAt = new Date().toISOString();
        saveFoundersDatabase(db);
        return inc;
      });
      if (!updated) {
        sendJson(res, 404, { error: 'Incidencia no encontrada.' });
        return true;
      }
      sendJson(res, 200, { success: true, incident: updated });
      return true;
    }
  }

  sendJson(res, 404, { error: 'Endpoint Founders no encontrado.' });
  return true;
}
