/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

export interface AdminUserRecord {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'investor' | 'model' | 'visitor';
  status: 'active' | 'suspended' | 'pending';
  balance: number;
  totalEarnings: number;
  totalInvested: number;
  totalCommissions: number;
  avatar: string;
  verified: boolean;
  registeredAt: string;
  lastLogin: string;
  patrocinadorId: string;
  phone?: string;
  city?: string;
  notes?: string;
}

export interface AdminProjectRecord {
  id: string;
  title: string;
  userId: string;
  authorName: string;
  category: string;
  budget: number;
  fundingGoal: number;
  objective: string;
  status: 'draft' | 'pending' | 'active' | 'rejected' | 'completed';
  votesReceived: number;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  reviewedBy?: string;
}

export interface AdminSessionRecord {
  id: string;
  title: string;
  entryFee: number;
  participantsCount: number;
  maxParticipants: number;
  status: 'active' | 'voting' | 'completed' | 'scheduled';
  startDate: string;
  endDate: string;
  votingPhaseActive: boolean;
  totalPoolGathered: number;
  commissionRate: number; // 5%
}

export interface AdminTicketRecord {
  id: string;
  type: 'incidencia' | 'denuncia' | 'reclamacion' | 'soporte';
  title: string;
  description: string;
  reportedBy: string;
  reportedItem?: string;
  priority: 'alta' | 'media' | 'baja';
  status: 'abierta' | 'en_progreso' | 'resuelta';
  createdAt: string;
  resolvedAt?: string;
  responseNote?: string;
}

export interface AdminNotificationRecord {
  id: string;
  title: string;
  message: string;
  targetRole: 'all' | 'investor' | 'model' | 'visitor';
  type: 'info' | 'alerta' | 'exito' | 'urgente';
  active: boolean;
  createdAt: string;
}

export interface AdminPlatformConfig {
  platformName: string;
  slogan: string;
  contactEmail: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  minEntryFee: number;
  votingDurationMinutes: number;
  platformCommissionPercent: number;
  escrowCustodyEnabled: boolean;
  activeAnnouncementBanner: string;
  showAnnouncementBanner: boolean;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  adminUser: string;
  action: string;
  module: 'usuarios' | 'proyectos' | 'financiacion' | 'modelos' | 'contenido' | 'configuracion' | 'seguridad';
  targetId: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

const DB_PATH = path.join(process.cwd(), 'admin_database.json');
const AUDIT_PATH = path.join(process.cwd(), 'admin_audit_logs.json');

// Initial seed data based on Fashion Finances actual ecosystem
function getInitialDatabase() {
  const users: AdminUserRecord[] = [
    {
      id: 'usr-admin-001',
      name: 'Super Admin',
      username: 'admin',
      email: 'admin@fashionfinances.com',
      role: 'admin',
      status: 'active',
      balance: 50000.00,
      totalEarnings: 15200.00,
      totalInvested: 10000.00,
      totalCommissions: 4500.00,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      verified: true,
      registeredAt: '2025-01-10T08:00:00Z',
      lastLogin: new Date().toISOString(),
      patrocinadorId: 'model-1',
      notes: 'Administrador central de la plataforma Fashion Finances con acceso a auditoría y balances.'
    },
    {
      id: 'usr-investor-001',
      name: 'Ernesto V. S.',
      username: 'ernesto',
      email: 'ernesto@fashionfinances.com',
      role: 'investor',
      status: 'active',
      balance: 1250.00,
      totalEarnings: 840.00,
      totalInvested: 2400.00,
      totalCommissions: 120.00,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      verified: true,
      registeredAt: '2026-02-15T12:00:00Z',
      lastLogin: new Date().toISOString(),
      patrocinadorId: 'model-1',
      city: 'Madrid, España'
    },
    {
      id: 'usr-model-001',
      name: 'Adriana Lima',
      username: 'adrianalima',
      email: 'adriana@victoriassecret.com',
      role: 'model',
      status: 'active',
      balance: 14500.00,
      totalEarnings: 68500.00,
      totalInvested: 5000.00,
      totalCommissions: 3400.00,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
      verified: true,
      registeredAt: '2025-03-01T10:00:00Z',
      lastLogin: new Date().toISOString(),
      patrocinadorId: 'model-2',
      notes: 'Top Model Oficial y Patrocinadora de Honor en Fashion Finances.'
    },
    {
      id: 'usr-model-002',
      name: 'Sophia Loren',
      username: 'sophialoren',
      email: 'sophia@fashionfinances.com',
      role: 'model',
      status: 'active',
      balance: 3200.00,
      totalEarnings: 12400.00,
      totalInvested: 1200.00,
      totalCommissions: 890.00,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
      verified: true,
      registeredAt: '2025-06-12T14:30:00Z',
      lastLogin: new Date().toISOString(),
      patrocinadorId: 'model-1'
    },
    {
      id: 'usr-investor-002',
      name: 'Marcos Inversor',
      username: 'marcos_inv',
      email: 'marcos@venturesfashion.es',
      role: 'investor',
      status: 'active',
      balance: 4800.00,
      totalEarnings: 2100.00,
      totalInvested: 7500.00,
      totalCommissions: 310.00,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      verified: true,
      registeredAt: '2026-03-20T16:00:00Z',
      lastLogin: new Date().toISOString(),
      patrocinadorId: 'model-1'
    },
    {
      id: 'usr-investor-003',
      name: 'Clara Domínguez',
      username: 'clara_d',
      email: 'clara@domingueztextil.com',
      role: 'investor',
      status: 'active',
      balance: 850.00,
      totalEarnings: 420.00,
      totalInvested: 1600.00,
      totalCommissions: 80.00,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      verified: true,
      registeredAt: '2026-04-05T09:15:00Z',
      lastLogin: new Date().toISOString(),
      patrocinadorId: 'model-1'
    },
    {
      id: 'usr-investor-004',
      name: 'Usuario Sospechoso (Cuenta de Prueba)',
      username: 'bot_test_23',
      email: 'spammer@tempmail.org',
      role: 'visitor',
      status: 'suspended',
      balance: 0.00,
      totalEarnings: 0.00,
      totalInvested: 0.00,
      totalCommissions: 0.00,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      verified: false,
      registeredAt: '2026-05-01T22:10:00Z',
      lastLogin: '2026-05-01T22:15:00Z',
      patrocinadorId: 'model-1',
      notes: 'Suspendido automáticamente por intento de duplicación de peticiones.'
    }
  ];

  const projects: AdminProjectRecord[] = [
    {
      id: 'proj-1',
      title: 'Milano Vintage Denim',
      userId: 'usr-investor-001',
      authorName: 'Ernesto V. S.',
      category: 'Streetwear & Denim',
      budget: 15000,
      fundingGoal: 25000,
      objective: 'Colección cápsula de denim reciclado de alta costura confeccionado éticamente.',
      status: 'active',
      votesReceived: 18,
      createdAt: '2026-04-10T11:00:00Z',
      updatedAt: '2026-05-18T14:00:00Z',
      reviewedBy: 'Super Admin'
    },
    {
      id: 'proj-2',
      title: 'Silk & Shadows Runway',
      userId: 'usr-model-001',
      authorName: 'Adriana Lima',
      category: 'Haute Couture',
      budget: 85000,
      fundingGoal: 100000,
      objective: 'Pasarela exclusiva de vestidos de seda italiana con proyección inmersiva 3D.',
      status: 'active',
      votesReceived: 42,
      createdAt: '2026-04-15T16:20:00Z',
      updatedAt: '2026-05-19T10:15:00Z',
      reviewedBy: 'Super Admin'
    },
    {
      id: 'proj-3',
      title: 'Neo-Tokyo Techwear Capsule',
      userId: 'usr-investor-002',
      authorName: 'Marcos Inversor',
      category: 'Casual & Lifestyle',
      budget: 18000,
      fundingGoal: 30000,
      objective: 'Prendas impermeables con tejidos termosensibles y corte modular para entornos urbanos.',
      status: 'pending',
      votesReceived: 6,
      createdAt: '2026-05-14T09:30:00Z',
      updatedAt: '2026-05-14T09:30:00Z'
    },
    {
      id: 'proj-4',
      title: 'Ecoluxe Botanical Leather',
      userId: 'usr-investor-003',
      authorName: 'Clara Domínguez',
      category: 'Calzado & Marroquinería',
      budget: 12000,
      fundingGoal: 20000,
      objective: 'Marroquinería vegana a base de residuos de manzana y cáñamo con acabados de lujo.',
      status: 'pending',
      votesReceived: 11,
      createdAt: '2026-05-16T12:00:00Z',
      updatedAt: '2026-05-16T12:00:00Z'
    },
    {
      id: 'proj-5',
      title: 'Campaña Ilícita Sin Licencia',
      userId: 'usr-investor-004',
      authorName: 'bot_test_23',
      category: 'Varios',
      budget: 50000,
      fundingGoal: 50000,
      objective: 'Campaña no autorizada con marcas registradas de terceros.',
      status: 'rejected',
      votesReceived: 0,
      createdAt: '2026-05-01T22:12:00Z',
      updatedAt: '2026-05-01T22:14:00Z',
      rejectionReason: 'Violación flagrante de derechos de autor y términos de marca de Fashion Finances.',
      reviewedBy: 'Super Admin'
    }
  ];

  const sessions: AdminSessionRecord[] = [
    {
      id: 'sess-workers-1',
      title: 'Round STREETWEAR & URBAN',
      entryFee: 10,
      participantsCount: 10,
      maxParticipants: 10,
      status: 'active',
      startDate: '2026-05-20T08:00:00Z',
      endDate: '2026-05-20T20:00:00Z',
      votingPhaseActive: false,
      totalPoolGathered: 100,
      commissionRate: 0.05
    },
    {
      id: 'sess-entrepreneurs-1',
      title: 'Round CASUAL & LIFESTYLE',
      entryFee: 100,
      participantsCount: 10,
      maxParticipants: 10,
      status: 'active',
      startDate: '2026-05-20T09:00:00Z',
      endDate: '2026-05-20T21:00:00Z',
      votingPhaseActive: true,
      totalPoolGathered: 1000,
      commissionRate: 0.05
    },
    {
      id: 'sess-businessmen-1',
      title: 'Ronda Glamour ✨',
      entryFee: 1000,
      participantsCount: 8,
      maxParticipants: 10,
      status: 'scheduled',
      startDate: '2026-05-21T10:00:00Z',
      endDate: '2026-05-21T22:00:00Z',
      votingPhaseActive: false,
      totalPoolGathered: 8000,
      commissionRate: 0.05
    },
    {
      id: 'sess-topmodels-1',
      title: 'Ronda Elegant & Classic 🤍',
      entryFee: 10000,
      participantsCount: 6,
      maxParticipants: 10,
      status: 'scheduled',
      startDate: '2026-05-22T10:00:00Z',
      endDate: '2026-05-22T22:00:00Z',
      votingPhaseActive: false,
      totalPoolGathered: 60000,
      commissionRate: 0.05
    },
    {
      id: 'sess-investors-1',
      title: 'Ronda High Fashion 👠 (100k)',
      entryFee: 100000,
      participantsCount: 4,
      maxParticipants: 10,
      status: 'scheduled',
      startDate: '2026-05-25T12:00:00Z',
      endDate: '2026-05-25T23:59:00Z',
      votingPhaseActive: false,
      totalPoolGathered: 400000,
      commissionRate: 0.05
    },
    {
      id: 'sess-millionaires-1',
      title: 'Ronda Elite Millionaires 💎 (1M)',
      entryFee: 1000000,
      participantsCount: 2,
      maxParticipants: 10,
      status: 'scheduled',
      startDate: '2026-06-01T12:00:00Z',
      endDate: '2026-06-01T23:59:00Z',
      votingPhaseActive: false,
      totalPoolGathered: 2000000,
      commissionRate: 0.05
    }
  ];

  const tickets: AdminTicketRecord[] = [
    {
      id: 'tkt-101',
      type: 'incidencia',
      title: 'Retraso en acreditación de saldo por pasarela SEPA',
      description: 'El inversor Marcos indicó que una transferencia bancaria tardó más de 24h en reflejarse en Backoffice.',
      reportedBy: 'marcos_inv',
      priority: 'media',
      status: 'resuelta',
      createdAt: '2026-05-18T10:30:00Z',
      resolvedAt: '2026-05-18T14:20:00Z',
      responseNote: 'Saldo verificado y acreditado manualmente en balance seguro.'
    },
    {
      id: 'tkt-102',
      type: 'denuncia',
      title: 'Reporte de bot publicitario en comentarios de Casting Live',
      description: 'Detección de mensajes repetidos con enlaces externos no autorizados.',
      reportedBy: 'adrianalima',
      reportedItem: 'Comentarios de transmisión en vivo',
      priority: 'alta',
      status: 'resuelta',
      createdAt: '2026-05-19T18:00:00Z',
      resolvedAt: '2026-05-19T18:15:00Z',
      responseNote: 'Cuenta de origen bloqueada y comentarios purgados.'
    },
    {
      id: 'tkt-103',
      type: 'reclamacion',
      title: 'Reclamación de fecha de exclusividad de patrocinio',
      description: 'Marca solicitó confirmación de si el cupo exclusivo de 10 marcas para la gala final está completado.',
      reportedBy: 'clara_d',
      priority: 'baja',
      status: 'en_progreso',
      createdAt: '2026-05-20T07:45:00Z'
    }
  ];

  const notifications: AdminNotificationRecord[] = [
    {
      id: 'notif-1',
      title: 'Apertura de la Ronda CASUAL & LIFESTYLE (100€)',
      message: 'La mesa de votación financiera se encuentra activa durante los próximos 10 minutos. Revisa las propuestas.',
      targetRole: 'all',
      type: 'info',
      active: true,
      createdAt: '2026-05-20T08:00:00Z'
    },
    {
      id: 'notif-2',
      title: 'Verificación de Saldo en Custodia Escrow',
      message: 'Todos los pagos de cuotas de inscripción han sido asegurados bajo custodia contractual de Backoffice.',
      targetRole: 'investor',
      type: 'exito',
      active: true,
      createdAt: '2026-05-19T15:00:00Z'
    }
  ];

  const config: AdminPlatformConfig = {
    platformName: 'Fashion Finances',
    slogan: 'Casting Live & Fashion Models Crowdfunding Ecosystem',
    contactEmail: 'soporte@fashionfinances.com',
    maintenanceMode: false,
    allowRegistrations: true,
    minEntryFee: 10,
    votingDurationMinutes: 10,
    platformCommissionPercent: 5.0,
    escrowCustodyEnabled: true,
    activeAnnouncementBanner: '✨ ¡Bienvenido a Fashion Finances! Rondas de financiación de moda abiertas con garantía Escrow.',
    showAnnouncementBanner: true
  };

  return { users, projects, sessions, tickets, notifications, config };
}

function getInitialAuditLogs(): AdminAuditLog[] {
  return [
    {
      id: 'log-seed-1',
      timestamp: '2026-05-19T14:00:00Z',
      adminUser: 'Super Admin',
      action: 'Aprobación de Proyecto',
      module: 'proyectos',
      targetId: 'proj-2',
      details: 'Proyecto "Silk & Shadows Runway" aprobado y publicado para rondas de inversión.',
      severity: 'info'
    },
    {
      id: 'log-seed-2',
      timestamp: '2026-05-19T18:15:00Z',
      adminUser: 'Super Admin',
      action: 'Suspensión de Cuenta',
      module: 'usuarios',
      targetId: 'usr-investor-004',
      details: 'Suspensión preventiva del usuario bot_test_23 por spam en feed.',
      severity: 'warning'
    },
    {
      id: 'log-seed-3',
      timestamp: '2026-05-20T08:00:00Z',
      adminUser: 'Super Admin',
      action: 'Activación de Ronda',
      module: 'financiacion',
      targetId: 'sess-entrepreneurs-1',
      details: 'Inicio oficial de la ronda CASUAL & LIFESTYLE 100€ con 10 participantes.',
      severity: 'info'
    }
  ];
}

export function loadAdminDatabase() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading admin_database.json:', err);
  }
  const initDb = getInitialDatabase();
  saveAdminDatabase(initDb);
  return initDb;
}

export function saveAdminDatabase(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving admin_database.json:', err);
  }
}

export function loadAdminAuditLogs(): AdminAuditLog[] {
  try {
    if (fs.existsSync(AUDIT_PATH)) {
      const content = fs.readFileSync(AUDIT_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading admin_audit_logs.json:', err);
  }
  const initLogs = getInitialAuditLogs();
  saveAdminAuditLogs(initLogs);
  return initLogs;
}

export function saveAdminAuditLogs(logs: AdminAuditLog[]) {
  try {
    fs.writeFileSync(AUDIT_PATH, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving admin_audit_logs.json:', err);
  }
}

export function recordAuditLog(log: Omit<AdminAuditLog, 'id' | 'timestamp'>) {
  const logs = loadAdminAuditLogs();
  const entry: AdminAuditLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    ...log
  };
  logs.unshift(entry);
  // Keep last 500 logs to prevent file explosion
  if (logs.length > 500) logs.pop();
  saveAdminAuditLogs(logs);
  return entry;
}
