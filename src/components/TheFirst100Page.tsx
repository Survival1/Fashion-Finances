/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Clock,
  Crown,
  ExternalLink,
  Gem,
  Globe,
  Info,
  Lock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCheck,
  XCircle
} from 'lucide-react';
import {
  FounderPosition,
  FoundersProgramConfig,
  FoundersConversionStats,
  FoundersAdminResponse
} from '../types/founders';
import { ModelProfile, ProjectData, UserSessionProfile } from '../types';
import FoundingModelBadge from './FoundingModelBadge';
import FashionsFinanceLogo from './FashionsFinanceLogo';
import LanguageTranslatorDropdown from './LanguageTranslatorDropdown';
import heroEditorialImg from '../assets/images/founders_editorial_hero_1795011767618.jpg';
import runwaySalonImg from '../assets/images/founders_runway_debut_1795011749707.jpg';

const ADMIN_TOKEN = 'ff-admin-master-token-v2026';

const FOUNDERS_BENEFITS: string[] = [
  'Número de fundador asignado del 001 al 100.',
  'Perfil profesional destacado.',
  'Acceso anticipado a determinadas herramientas de la plataforma.',
  'Preparación del perfil para el lanzamiento internacional.',
  'Acceso a las actividades de lanzamiento para los miembros fundadores.',
  'Identificación especial como Modelo Fundadora.',
  'Insignia permanente de miembro fundador.',
  'Acceso anticipado a determinadas funcionalidades.',
  'Ventajas especiales en Casting Live.',
  'Acceso VIP a eventos internacionales seleccionados.',
  'Créditos promocionales o beneficios de uso, conforme a las condiciones del programa.',
  'Reconocimiento dentro de la comunidad internacional de Fashion Finances.'
];

interface TheFirst100PageProps {
  userProfile: UserSessionProfile;
  models: ModelProfile[];
  projects: ProjectData[];
  isAdmin?: boolean;
  onBack: () => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onNavigateToTab: (tab: 'home' | 'finance' | 'sessions' | 'create_project' | 'chat' | 'profile' | 'patrocinados' | 'saved_projects' | 'casting_live' | 'menu' | 'admin' | 'first_100') => void;
  onOpenRanking: () => void;
  onFoundersStateUpdated?: (positions: FounderPosition[], config: FoundersProgramConfig) => void;
}

interface CountdownParts {
  launched: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeCountdown(launchIso: string): CountdownParts {
  const target = new Date(launchIso).getTime();
  const now = Date.now();
  if (isNaN(target) || now >= target) {
    return { launched: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const diffSec = Math.floor((target - now) / 1000);
  const days = Math.floor(diffSec / 86400);
  const hours = Math.floor((diffSec % 86400) / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;
  return { launched: false, days, hours, minutes, seconds };
}

function formatShortDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function toDatetimeLocalValue(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

export default function TheFirst100Page({
  userProfile,
  models,
  projects,
  isAdmin = false,
  onBack,
  onOpenRegister,
  onOpenLogin,
  onNavigateToTab,
  onOpenRanking,
  onFoundersStateUpdated
}: TheFirst100PageProps) {
  const packageSectionRef = useRef<HTMLDivElement>(null);
  const positionsSectionRef = useRef<HTMLDivElement>(null);
  const journeySectionRef = useRef<HTMLDivElement>(null);
  const foundersAreaRef = useRef<HTMLDivElement>(null);
  const adminSectionRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<FoundersProgramConfig>(() => {
    const now = new Date();
    const launch = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    return {
      openingDate: now.toISOString(),
      launchDate: launch.toISOString(),
      programClosed: false,
      packagePriceEur: 100000,
      currency: 'EUR'
    };
  });
  const [stripeConfigured, setStripeConfigured] = useState(false);
  const [positions, setPositions] = useState<FounderPosition[]>([]);
  const [stats, setStats] = useState<FoundersConversionStats>({
    pageViews: 0,
    reserveStarts: 0,
    reservedCount: 0,
    confirmedCount: 0,
    availableCount: 100,
    cancelledOrRefundedCount: 0,
    totalConfirmedRevenueEur: 0,
    conversionRatePercent: 0
  });
  const [myPosition, setMyPosition] = useState<FounderPosition | null>(null);

  const [countdown, setCountdown] = useState<CountdownParts>(() =>
    computeCountdown(config.launchDate)
  );

  // Interactive UI controls
  const [allowPublicDisplay, setAllowPublicDisplay] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [cancellingHold, setCancellingHold] = useState(false);
  const [gridFilter, setGridFilter] = useState<'ALL' | 'AVAILABLE' | 'RESERVED' | 'CONFIRMED'>('ALL');
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'info' | 'error';
    title: string;
    message: string;
  } | null>(null);
  const [heroImgError, setHeroImgError] = useState(false);
  const [salonImgError, setSalonImgError] = useState(false);

  // Inline Admin panel state when admin views page directly
  const [adminOverview, setAdminOverview] = useState<FoundersAdminResponse | null>(null);
  const [openingInput, setOpeningInput] = useState('');
  const [launchInput, setLaunchInput] = useState('');
  const [programClosedInput, setProgramClosedInput] = useState(false);
  const [closedReasonInput, setClosedReasonInput] = useState('');
  const [savingAdminConfig, setSavingAdminConfig] = useState(false);

  const fetchFoundersState = useCallback(
    async (trackView = false) => {
      try {
        const q = new URLSearchParams();
        if (userProfile?.id) q.set('userId', userProfile.id);
        if (trackView) q.set('trackView', 'true');
        const res = await fetch(`/api/founders/state?${q.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.config) {
          setConfig(data.config);
          setOpeningInput(toDatetimeLocalValue(data.config.openingDate));
          setLaunchInput(toDatetimeLocalValue(data.config.launchDate));
          setProgramClosedInput(Boolean(data.config.programClosed));
          setClosedReasonInput(data.config.closedReason || '');
        }
        setStripeConfigured(Boolean(data.stripeConfigured));
        if (Array.isArray(data.positions)) {
          setPositions(data.positions);
          onFoundersStateUpdated?.(data.positions, data.config);
        }
        if (data.stats) setStats(data.stats);
        setMyPosition(data.myPosition || null);
      } catch (err) {
        console.error('[First100] Error cargando estado:', err);
      } finally {
        setLoading(false);
      }
    },
    [userProfile?.id, onFoundersStateUpdated]
  );

  const canAccessExecutiveAdmin = useMemo(() => {
    if (!isAdmin || !userProfile) return false;
    const uname = (userProfile.username || '').toLowerCase().trim().replace(/^@/, '');
    const fullName = (userProfile.name || '').toLowerCase().trim();
    const uid = (userProfile.id || '').toLowerCase().trim();
    return (
      uname === 'adrianalima_w1' ||
      uname === 'adrianalima' ||
      fullName === 'adriana lima' ||
      uid === 'topf-1' ||
      uid === 'model-1'
    );
  }, [isAdmin, userProfile]);

  const fetchAdminOverview = useCallback(async () => {
    if (!canAccessExecutiveAdmin) return;
    try {
      const res = await fetch('/api/founders/admin/overview', {
        headers: {
          'x-admin-token': ADMIN_TOKEN,
          'x-user-role': 'admin',
          'x-admin-user': userProfile?.name || 'Admin'
        }
      });
      if (res.ok) {
        const data: FoundersAdminResponse = await res.json();
        setAdminOverview(data);
      }
    } catch {}
  }, [canAccessExecutiveAdmin, userProfile?.name]);

  useEffect(() => {
    fetchFoundersState(true);
  }, [fetchFoundersState]);

  useEffect(() => {
    fetchAdminOverview();
  }, [fetchAdminOverview]);

  // Real live 1s countdown tick
  useEffect(() => {
    setCountdown(computeCountdown(config.launchDate));
    const id = window.setInterval(() => {
      setCountdown(computeCountdown(config.launchDate));
    }, 1000);
    return () => window.clearInterval(id);
  }, [config.launchDate]);

  // Real evaluation of 8 founder readiness tasks from Fashion Finances app data
  const profileEvaluation = useMemo(() => {
    const uid = userProfile?.id || '';
    const uname = (userProfile?.username || '').toLowerCase();
    const matchedModel = models.find(
      (m) => m.id === uid || m.username?.toLowerCase() === uname
    );

    const hasAvatar = Boolean(
      userProfile?.avatar &&
        !userProfile.avatar.includes('default') &&
        userProfile.avatar.trim().length > 10
    );

    let storedBio = userProfile?.bio || matchedModel?.bio || '';
    try {
      const customBio =
        localStorage.getItem(`custom_model_bio_${uid}`) ||
        (uname ? localStorage.getItem(`custom_model_bio_${uname}`) : '');
      if (customBio) storedBio = customBio;
    } catch {}
    const hasBio = Boolean(storedBio && storedBio.trim().length >= 20);

    let hasSocial = Boolean(
      userProfile?.instagram || userProfile?.tiktok || userProfile?.twitter
    );
    try {
      const ig =
        localStorage.getItem(`custom_instagram_${uid}`) ||
        (uname ? localStorage.getItem(`custom_instagram_${uname}`) : '');
      const tt =
        localStorage.getItem(`custom_tiktok_${uid}`) ||
        (uname ? localStorage.getItem(`custom_tiktok_${uname}`) : '');
      const tw =
        localStorage.getItem(`custom_twitter_${uid}`) ||
        (uname ? localStorage.getItem(`custom_twitter_${uname}`) : '');
      if (ig || tt || tw) hasSocial = true;
    } catch {}

    let storedCity = '';
    let storedAgency = userProfile?.fashionAgency || '';
    try {
      storedCity = localStorage.getItem(`prof_city_${uid}`) || '';
      if (!storedAgency) {
        storedAgency =
          localStorage.getItem(`custom_fashion_agency_${uid}`) ||
          (uname ? localStorage.getItem(`custom_fashion_agency_${uname}`) : '') ||
          '';
      }
    } catch {}
    const hasAgencyOrCity = Boolean(storedAgency || storedCity);

    let hasVideo = Boolean(matchedModel?.videoUrl);
    try {
      const savedVids = localStorage.getItem(`saved_videos_${uid}`);
      if (savedVids) {
        const parsed = JSON.parse(savedVids);
        if (Array.isArray(parsed) && parsed.length > 0) hasVideo = true;
      }
    } catch {}

    let hasPhotos = Boolean(matchedModel?.photos && matchedModel.photos.length > 0);
    try {
      const presGallery =
        localStorage.getItem(`custom_presentation_gallery_${uid}`) ||
        (uname ? localStorage.getItem(`custom_presentation_gallery_${uname}`) : '') ||
        localStorage.getItem(`investor_photos_${uid}`);
      if (presGallery) {
        const parsed = JSON.parse(presGallery);
        if (Array.isArray(parsed) && parsed.length > 0) hasPhotos = true;
      }
    } catch {}

    let hasPostsOrProjects = projects.some((p) => p.userId === uid);
    try {
      const rawPosts = localStorage.getItem(`fb_posts_v3_${uid}`);
      if (rawPosts) {
        const parsed = JSON.parse(rawPosts);
        if (Array.isArray(parsed) && parsed.length > 0) hasPostsOrProjects = true;
      }
    } catch {}

    let isVerified = Boolean(userProfile?.verified || matchedModel?.verified);
    try {
      if (
        localStorage.getItem(`model_verified_by_video_upload_${uid}`) === 'true' ||
        (uname && localStorage.getItem(`model_verified_by_video_upload_${uname}`) === 'true')
      ) {
        isVerified = true;
      }
    } catch {}

    const tasks = [
      {
        id: 'avatar',
        label: 'Fotografía principal editorial cargada en el perfil',
        done: hasAvatar,
        actionLabel: 'Editar perfil',
        onAction: () => onNavigateToTab('profile')
      },
      {
        id: 'bio',
        label: 'Biografía profesional y presentación internacional (mín. 20 caracteres)',
        done: hasBio,
        actionLabel: 'Completar biografía',
        onAction: () => onNavigateToTab('profile')
      },
      {
        id: 'socials',
        label: 'Redes sociales oficiales vinculadas (Instagram, TikTok o X)',
        done: hasSocial,
        actionLabel: 'Vincular redes',
        onAction: () => onNavigateToTab('profile')
      },
      {
        id: 'location',
        label: 'Ciudad base o agencia de representación registrada',
        done: hasAgencyOrCity,
        actionLabel: 'Actualizar ubicación',
        onAction: () => onNavigateToTab('profile')
      },
      {
        id: 'gallery',
        label: 'Galería fotográfica editorial activa en perfil',
        done: hasPhotos,
        actionLabel: 'Subir fotografías',
        onAction: () => onNavigateToTab('profile')
      },
      {
        id: 'video',
        label: 'Reel o vídeo de pasarela publicado para Casting Live',
        done: hasVideo,
        actionLabel: 'Ir a Casting Live',
        onAction: () => onNavigateToTab('casting_live')
      },
      {
        id: 'project',
        label: 'Proyecto de moda o publicación oficial activa en el muro',
        done: hasPostsOrProjects,
        actionLabel: 'Crear proyecto',
        onAction: () => onNavigateToTab('create_project')
      },
      {
        id: 'verified',
        label: 'Identidad de perfil verificada en Fashion Finances',
        done: isVerified,
        actionLabel: 'Verificar perfil',
        onAction: () => onNavigateToTab('create_project')
      }
    ];

    const completedCount = tasks.filter((t) => t.done).length;
    const totalCount = tasks.length;
    const percent = Math.round((completedCount / totalCount) * 100);
    return {
      tasks,
      completedCount,
      totalCount,
      percent,
      completedIds: tasks.filter((t) => t.done).map((t) => t.id)
    };
  }, [userProfile, models, projects, onNavigateToTab]);

  // Automatically sync completion percentage to backend when confirmed founder visits
  useEffect(() => {
    if (!myPosition || myPosition.status !== 'CONFIRMED' || !userProfile?.id) return;
    if (
      myPosition.completionPercent === profileEvaluation.percent &&
      myPosition.completedTasksCount === profileEvaluation.completedCount
    ) {
      return;
    }

    fetch('/api/founders/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userProfile.id,
        completionPercent: profileEvaluation.percent,
        completedTasksCount: profileEvaluation.completedCount,
        totalTasksCount: profileEvaluation.totalCount,
        completedTaskIds: profileEvaluation.completedIds
      })
    }).catch(() => {});
  }, [
    myPosition,
    userProfile?.id,
    profileEvaluation.percent,
    profileEvaluation.completedCount,
    profileEvaluation.totalCount,
    profileEvaluation.completedIds
  ]);

  // 90-day timeline automatic date calculation
  const timelineInfo = useMemo(() => {
    const startMs = new Date(config.openingDate).getTime();
    const endMs = new Date(config.launchDate).getTime();
    const nowMs = Date.now();
    const safeStart = isNaN(startMs) ? nowMs : startMs;
    const safeEnd = isNaN(endMs) ? safeStart + 90 * 24 * 60 * 60 * 1000 : endMs;
    const totalSpan = Math.max(1, safeEnd - safeStart);

    const stage1End = safeStart + Math.round(totalSpan * (30 / 90));
    const stage2End = safeStart + Math.round(totalSpan * (60 / 90));

    const elapsedDays = Math.max(1, Math.min(90, Math.ceil((nowMs - safeStart) / 86400000)));
    const daysRemaining = Math.max(0, Math.ceil((safeEnd - nowMs) / 86400000));
    const currentStage =
      nowMs <= stage1End ? 1 : nowMs <= stage2End ? 2 : 3;

    return {
      startIso: new Date(safeStart).toISOString(),
      stage1EndIso: new Date(stage1End).toISOString(),
      stage2EndIso: new Date(stage2End).toISOString(),
      endIso: new Date(safeEnd).toISOString(),
      elapsedDays,
      daysRemaining,
      currentStage
    };
  }, [config.openingDate, config.launchDate]);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleReserveClick = async () => {
    if (!userProfile || userProfile.role === 'visitor') {
      setStatusBanner({
        type: 'info',
        title: 'Registro o inicio de sesión requerido',
        message:
          'Para asociar una posición oficial del 001 al 100 a tu cuenta, inicia sesión o crea tu perfil de miembro.'
      });
      onOpenRegister();
      return;
    }

    setReserving(true);
    setStatusBanner(null);
    try {
      const res = await fetch('/api/founders/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userProfile.id,
          username: userProfile.username,
          professionalName: userProfile.name,
          avatar: userProfile.avatar,
          email: userProfile.email,
          role: userProfile.role,
          allowPublicDisplay
        })
      });
      const data = await res.json();

      if (!res.ok) {
        setStatusBanner({
          type: 'error',
          title: 'No se pudo iniciar la reserva',
          message: data.error || 'Error al procesar la solicitud de posición.'
        });
        await fetchFoundersState(false);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      // Honest RESERVADA pending state when payment gateway webhook hasn't confirmed yet
      setStatusBanner({
        type: 'info',
        title: `Posición #${data.position?.code || '---'} en estado RESERVADA`,
        message:
          data.message ||
          'Tu solicitud quedó registrada en estado RESERVADA. La plaza nunca se confirma ni se asigna como definitiva sin confirmación real de pago del proveedor.'
      });
      await fetchFoundersState(false);
      if (canAccessExecutiveAdmin) await fetchAdminOverview();
    } catch (err) {
      setStatusBanner({
        type: 'error',
        title: 'Error de conexión',
        message: 'No se pudo conectar con el servidor para registrar tu reserva.'
      });
    } finally {
      setReserving(false);
    }
  };

  const handleCancelReservation = async () => {
    if (!myPosition || myPosition.status !== 'RESERVED') return;
    setCancellingHold(true);
    try {
      const res = await fetch('/api/founders/cancel-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userProfile.id,
          reservationId: myPosition.reservationId
        })
      });
      const data = await res.json();
      if (res.ok) {
        setStatusBanner({
          type: 'success',
          title: `Reserva #${data.releasedCode} liberada`,
          message: 'La plaza ha regresado al estado DISPONIBLE.'
        });
        await fetchFoundersState(false);
        if (canAccessExecutiveAdmin) await fetchAdminOverview();
      }
    } finally {
      setCancellingHold(false);
    }
  };

  const handleSaveAdminConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAdminConfig(true);
    try {
      const res = await fetch('/api/founders/admin/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': ADMIN_TOKEN,
          'x-user-role': 'admin',
          'x-admin-user': userProfile?.name || 'Admin'
        },
        body: JSON.stringify({
          openingDate: openingInput ? new Date(openingInput).toISOString() : undefined,
          launchDate: launchInput ? new Date(launchInput).toISOString() : undefined,
          programClosed: programClosedInput,
          closedReason: closedReasonInput
        })
      });
      if (res.ok) {
        setStatusBanner({
          type: 'success',
          title: 'Configuración de fechas y programa actualizada',
          message: 'La cuenta atrás y las etapas de 90 días se han recalculado automáticamente.'
        });
        await fetchFoundersState(false);
        await fetchAdminOverview();
      }
    } finally {
      setSavingAdminConfig(false);
    }
  };

  const handleAdminReleaseOrRefund = async (positionCode: string, actionType: 'cancel' | 'refund') => {
    const res = await fetch('/api/founders/admin/release-or-refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_TOKEN,
        'x-user-role': 'admin',
        'x-admin-user': userProfile?.name || 'Admin'
      },
      body: JSON.stringify({
        positionCode,
        actionType,
        reason:
          actionType === 'refund'
            ? 'Devolución aprobada y liberación de plaza a DISPONIBLE'
            : 'Cancelación administrativa de reserva y liberación a DISPONIBLE'
      })
    });
    if (res.ok) {
      setStatusBanner({
        type: 'success',
        title: `Posición #${positionCode} liberada`,
        message: 'La plaza ha pasado a estado DISPONIBLE y se ha registrado en auditoría.'
      });
      await fetchFoundersState(false);
      await fetchAdminOverview();
    }
  };

  const handleAdminToggleBadge = async (positionCode: string, nextActive: boolean) => {
    const res = await fetch('/api/founders/admin/badge', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_TOKEN,
        'x-user-role': 'admin',
        'x-admin-user': userProfile?.name || 'Admin'
      },
      body: JSON.stringify({ positionCode, badgeActive: nextActive })
    });
    if (res.ok) {
      await fetchFoundersState(false);
      await fetchAdminOverview();
    }
  };

  const confirmedCount = stats.confirmedCount || positions.filter((p) => p.status === 'CONFIRMED').length;
  const reservedCount = stats.reservedCount || positions.filter((p) => p.status === 'RESERVED').length;
  const availableCount = stats.availableCount || positions.filter((p) => p.status === 'AVAILABLE').length;

  const filteredPositions = useMemo(() => {
    if (gridFilter === 'ALL') return positions;
    return positions.filter((p) => p.status === gridFilter);
  }, [positions, gridFilter]);

  const publicGalleryFounders = useMemo(
    () =>
      positions.filter(
        (p) => p.status === 'CONFIRMED' && p.badgeActive !== false && p.allowPublicDisplay && p.professionalName
      ),
    [positions]
  );

  return (
    <div className="min-h-screen bg-[#FFFBFC] text-slate-900 font-sans selection:bg-[#fce7f3] selection:text-[#9d174d]">
      {/* TOP BAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#f9a8d4]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700 hover:text-[#be185d] transition cursor-pointer bg-transparent whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
            <span className="h-4 w-px bg-pink-200 hidden sm:inline-block" aria-hidden="true" />
            <div className="hidden sm:flex items-center gap-2.5">
              <FashionsFinanceLogo mode="light" className="w-7 h-7" />
              <span className="font-serif text-sm font-bold tracking-wide text-slate-900 whitespace-nowrap">
                FASHION FINANCES
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <LanguageTranslatorDropdown compact />
            <button
              type="button"
              onClick={() => scrollToRef(packageSectionRef)}
              className="pearl-pink-btn px-3 sm:px-4 py-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] transition cursor-pointer whitespace-nowrap"
            >
              Conviértete en Modelo Fundadora
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pb-24">
        {/* Sub-navigation bar centered below the bottom border line */}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-6 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600 text-center">
          <button
            type="button"
            onClick={() => scrollToRef(packageSectionRef)}
            className="hover:text-[#be185d] transition bg-transparent cursor-pointer whitespace-nowrap"
          >
            Paquete Fundadores
          </button>
          <button
            type="button"
            onClick={() => scrollToRef(positionsSectionRef)}
            className="hover:text-[#be185d] transition bg-transparent cursor-pointer whitespace-nowrap"
          >
            100 Plazas
          </button>
          <button
            type="button"
            onClick={() => scrollToRef(journeySectionRef)}
            className="hover:text-[#be185d] transition bg-transparent cursor-pointer whitespace-nowrap"
          >
            90 Días
          </button>
          <button
            type="button"
            onClick={() => scrollToRef(foundersAreaRef)}
            className="hover:text-[#be185d] transition bg-transparent cursor-pointer whitespace-nowrap"
          >
            Mi Área de Fundadores
          </button>
          {canAccessExecutiveAdmin && (
            <button
              type="button"
              onClick={() => scrollToRef(adminSectionRef)}
              className="text-[#be185d] hover:text-[#831843] transition bg-transparent cursor-pointer whitespace-nowrap"
            >
              Administración
            </button>
          )}
        </nav>
        {/* Global Status Notice */}
        {statusBanner && (
          <div
            className={`mt-6 border p-4 sm:p-5 flex items-start justify-between gap-4 ${
              statusBanner.type === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : statusBanner.type === 'success'
                ? 'bg-[#fff1f5] border-[#f472b6] text-slate-900'
                : 'bg-[#fdf2f8] border-[#f9a8d4] text-slate-900'
            }`}
          >
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#be185d] shrink-0 mt-0.5" />
              <div className="space-y-1 text-left">
                <p className="text-sm font-bold text-slate-900">{statusBanner.title}</p>
                <p className="text-xs text-slate-700 leading-relaxed">{statusBanner.message}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStatusBanner(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 bg-transparent cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* 1. HERO PRINCIPAL */}
        <section className="pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-[#f9a8d4]/40">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-10">
            <div className="w-full space-y-6 flex flex-col items-center text-center">
              <div className="space-y-2.5 flex flex-col items-center text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#be185d]">
                  FASHION FINANCES
                </p>
                <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-slate-950 leading-[1.04] text-center">
                  LOS PRIMEROS 100
                </h1>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-slate-600 pt-1">
                  LOS 100 FUNDADORES — LANZAMIENTO INTERNACIONAL
                </p>
              </div>

              <p className="font-serif text-xl sm:text-2xl text-slate-800 leading-relaxed max-w-2xl mx-auto text-center">
                Sé una de las primeras 100. Asegura tu posición. Haz tu debut en el escenario global.
              </p>

              <p className="text-sm text-slate-600 leading-relaxed max-w-xl mx-auto text-center">
                Programa internacional exclusivo para los primeros 100 modelos en incorporarse a Fashion Finances mediante la precompra oficial de un Paquete Fundadores. El lanzamiento internacional tendrá lugar 90 días después de la apertura del programa.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => scrollToRef(packageSectionRef)}
                  className="pearl-pink-btn px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] transition inline-flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <span>CONVIÉRTETE EN MODELO FUNDADORA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToRef(positionsSectionRef)}
                  className="pearl-pink-btn px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] transition inline-flex items-center justify-center cursor-pointer"
                >
                  EXPLORAR POSICIONES 001–100
                </button>
              </div>

              {/* Clean horizontal stat strip */}
              <div className="grid grid-cols-3 gap-6 sm:gap-10 pt-6 border-t border-pink-100 w-full max-w-xl mx-auto text-center">
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
                    Confirmados
                  </span>
                  <span className="font-serif text-2xl font-bold text-slate-950 tabular-nums">
                    {String(confirmedCount).padStart(2, '0')} / 100
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
                    Lanzamiento
                  </span>
                  <span className="font-serif text-2xl font-bold text-slate-950 tabular-nums">
                    90 DÍAS
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
                    Precompra
                  </span>
                  <span className="font-serif text-2xl font-bold text-slate-950 tabular-nums">
                    {(config.packagePriceEur || 100000).toLocaleString('es-ES')} €
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md mx-auto">
              <div className="relative border border-[#f9a8d4]/60 bg-[#fdf2f8] p-3">
                {!heroImgError ? (
                  <img
                    src={heroEditorialImg}
                    alt="Modelo Editorial Internacional — Fashion Finances Los Primeros 100"
                    onError={() => setHeroImgError(true)}
                    className="w-full aspect-[3/4] object-cover block"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] bg-gradient-to-b from-[#fdf2f8] to-[#fce7f3] flex flex-col items-center justify-center p-8 text-center">
                    <Crown className="w-10 h-10 text-[#be185d] mb-3 stroke-[1.25]" />
                    <span className="font-serif text-xl font-bold text-slate-900">LOS PRIMEROS 100</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-600 mt-1">
                      FASHION FINANCES
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-3 px-1 text-[10px] uppercase tracking-[0.18em] text-slate-600 font-semibold">
                  <span>EDICIÓN INTERNACIONAL</span>
                  <span className="text-[#be185d] tabular-nums">001 — 100</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CUENTA ATRÁS PARA EL LANZAMIENTO INTERNACIONAL */}
        <section className="py-14 border-b border-[#f9a8d4]/40">
          <div className="bg-gradient-to-r from-white via-[#fdf2f8] to-white border border-[#f9a8d4]/60 px-6 py-10 sm:px-12 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#be185d] mb-2">
              <span>CUENTA ATRÁS DEBUT GLOBAL</span>
              <span> · </span>
              <span>{formatShortDate(config.launchDate).toUpperCase()}</span>
            </p>

            {countdown.launched ? (
              <div className="py-4 space-y-3">
                <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-slate-950">
                  EL MUNDO ES AHORA TU PASARELA.
                </h2>
                <p className="text-xs uppercase tracking-[0.2em] text-[#be185d] font-semibold">
                  Lanzamiento internacional activo · Programa Los Primeros 100
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-950">
                  Lanzamiento internacional en curso hacia el debut global
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  {[
                    { label: 'DÍAS', value: countdown.days },
                    { label: 'HORAS', value: countdown.hours },
                    { label: 'MINUTOS', value: countdown.minutes },
                    { label: 'SEGUNDOS', value: countdown.seconds }
                  ].map((unit) => (
                    <div
                      key={unit.label}
                      className="bg-white border border-[#f9a8d4]/70 py-5 px-4 text-center"
                    >
                      <span className="font-serif text-4xl sm:text-5xl font-bold text-slate-950 tabular-nums leading-none block">
                        {String(unit.value).padStart(2, '0')}
                      </span>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-[#be185d] mt-2">
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. PAQUETE FUNDADORES (100.000 €) */}
        <section ref={packageSectionRef} className="py-16 border-b border-[#f9a8d4]/40 scroll-mt-20">
          <div className="max-w-5xl mx-auto bg-white border border-[#f472b6]/60 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Luxury Price & Summary Column */}
              <div className="lg:col-span-5 bg-gradient-to-b from-[#fdf2f8] via-[#fce7f3]/60 to-white p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#f9a8d4]/50 flex flex-col justify-between text-left space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#be185d]">
                    <Gem className="w-4 h-4 stroke-[1.5]" />
                    <span>MEMBRESÍA FUNDACIONAL EXCLUSIVA</span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 leading-tight">
                    PAQUETE FUNDADORES
                  </h2>
                  <div className="pt-2">
                    <span className="font-serif text-5xl font-bold text-slate-950 tabular-nums">
                      {(config.packagePriceEur || 100000).toLocaleString('es-ES')} €
                    </span>
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9d174d] mt-2">
                      PRECOMPRA · ACCESO A UNA DE LAS 100 PLAZAS
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-2">
                    La confirmación de tu número oficial entre 001 y 100 queda vinculada de forma única e inmutable a tu cuenta tras la confirmación real del pago.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={allowPublicDisplay}
                      onChange={(e) => setAllowPublicDisplay(e.target.checked)}
                      className="mt-0.5 accent-[#be185d] w-4 h-4 cursor-pointer"
                    />
                    <span>
                      Autorizo mostrar mi nombre profesional y fotografía en la galería pública y mapa de posiciones de Modelos Fundadoras.
                    </span>
                  </label>

                  {config.programClosed ? (
                    <div className="border border-slate-300 bg-slate-50 p-4 text-xs font-semibold text-slate-700 text-center">
                      {config.closedReason || 'El programa LOS PRIMEROS 100 ha alcanzado su cierre oficial.'}
                    </div>
                  ) : myPosition?.status === 'CONFIRMED' ? (
                    <div className="space-y-3">
                      <FoundingModelBadge founderNumber={myPosition.code} variant="card" />
                      <button
                        type="button"
                        onClick={() => scrollToRef(foundersAreaRef)}
                        className="custom-bg w-full bg-slate-950 hover:bg-slate-800 text-white py-3.5 px-5 text-xs font-bold uppercase tracking-[0.16em] transition cursor-pointer"
                      >
                        Ir a Mi Área de Fundadores
                      </button>
                    </div>
                  ) : myPosition?.status === 'RESERVED' ? (
                    <div className="border border-[#f472b6] bg-white p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#be185d]">
                          ESTADO: RESERVADA (PENDIENTE DE PAGO)
                        </span>
                        <span className="font-serif text-lg font-bold text-slate-900 tabular-nums">
                          #{myPosition.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        <span>Tu plaza está retenida temporalmente hasta el </span>
                        <strong>{formatShortDate(myPosition.expiresAt)}</strong>
                        <span>. </span>
                        {stripeConfigured
                          ? 'Completa el pago en Stripe Checkout para confirmar tu posición.'
                          : 'A la espera de verificación real del proveedor de pagos (pasarela Stripe no configurada en este entorno; nunca se emite confirmación simulada).'}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {stripeConfigured && (
                          <button
                            type="button"
                            disabled={reserving}
                            onClick={handleReserveClick}
                            className="custom-bg flex-1 bg-[#be185d] hover:bg-[#9d174d] text-white py-2.5 px-4 text-[11px] font-bold uppercase tracking-[0.14em] transition cursor-pointer"
                          >
                            {reserving ? 'Conectando...' : 'Reanudar pago'}
                          </button>
                        )}
                        <button
                          type="button"
                          disabled={cancellingHold}
                          onClick={handleCancelReservation}
                          className="flex-1 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 py-2.5 px-4 text-[11px] font-bold uppercase tracking-[0.14em] transition cursor-pointer"
                        >
                          {cancellingHold ? 'Liberando...' : 'Liberar reserva'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={reserving}
                      onClick={handleReserveClick}
                      className="custom-bg w-full bg-[#be185d] hover:bg-[#9d174d] disabled:opacity-60 text-white py-4 px-6 text-xs font-bold uppercase tracking-[0.18em] transition cursor-pointer shadow-sm"
                    >
                      {reserving ? 'PROCESANDO RESERVA...' : 'RESERVAR TU POSICIÓN DE FUNDADOR'}
                    </button>
                  )}

                  {userProfile?.role === 'visitor' && (
                    <p className="text-[11px] text-slate-500 text-center">
                      <span>¿Ya tienes cuenta? </span>
                      <button
                        type="button"
                        onClick={onOpenLogin}
                        className="text-[#be185d] font-semibold underline bg-transparent cursor-pointer"
                      >
                        Inicia sesión aquí
                      </button>
                    </p>
                  )}
                </div>
              </div>

              {/* Right 12 Prestaciones Column */}
              <div className="lg:col-span-7 p-8 sm:p-10 text-left space-y-6">
                <div className="flex items-center justify-between border-b border-pink-100 pb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    PRESTACIONES DEL PROGRAMA
                  </span>
                  <span className="text-xs font-serif font-bold text-[#be185d] tabular-nums">
                    12 Beneficios Exclusivos
                  </span>
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
                  {FOUNDERS_BENEFITS.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#be185d] shrink-0 mt-0.5 stroke-[1.75]" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-pink-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Insignia permanente vinculada a cuenta</span>
                  <span className="font-semibold text-slate-800 uppercase tracking-wider">
                    MODELO FUNDADORA · 001–100
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CUADRÍCULA DE LAS 100 PLAZAS (001–100) */}
        <section ref={positionsSectionRef} className="py-16 border-b border-[#f9a8d4]/40 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 text-left">
            <div className="space-y-2 min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#be185d]">
                REGISTRO OFICIAL DE POSICIONES
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950">
                SOLO 100 POSICIONES DE FUNDADORES
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                Cada plaza del 001 al 100 solo pasa a estado confirmado tras verificación real del pago. Las plazas en estado RESERVADA mantienen una retención temporal sin contar como vendidas.
              </p>
            </div>

            <div className="bg-[#fdf2f8] border border-[#f472b6] px-5 py-4 text-left w-full sm:w-auto max-w-full flex flex-col items-start gap-1.5 min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9d174d] break-words">
                MODELOS FUNDADORAS CONFIRMADAS
              </span>
              <span className="block font-serif text-lg sm:text-xl font-bold text-slate-950 leading-tight">
                MODELOS FUNDADORAS:
              </span>
              <span className="block font-serif text-3xl font-bold text-[#be185d] tabular-nums leading-none">
                {String(confirmedCount).padStart(2, '0')} / 100
              </span>
            </div>
          </div>

          {/* Filter & Legend Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-pink-100">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: 'ALL', label: `Todas (100)` },
                { key: 'AVAILABLE', label: `Disponibles (${availableCount})` },
                { key: 'RESERVED', label: `Reservadas (${reservedCount})` },
                { key: 'CONFIRMED', label: `Confirmadas (${confirmedCount})` }
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setGridFilter(tab.key as any)}
                  className={`px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] border transition cursor-pointer ${
                    gridFilter === tab.key
                      ? 'custom-bg bg-[#be185d] text-white border-[#be185d]'
                      : 'bg-white text-slate-700 border-pink-200 hover:border-[#f472b6]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-5 text-[11px] font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 border border-pink-200 bg-white inline-block" />
                <span>DISPONIBLE</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>RESERVADA (Pendiente de pago)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#be185d]" />
                <span>CONFIRMADA</span>
              </span>
            </div>
          </div>

          {/* 100 Positions Matrix */}
          {loading ? (
            <div className="py-16 text-center text-xs uppercase tracking-[0.2em] text-slate-500">
              Sincronizando posiciones oficiales...
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-2.5">
              {filteredPositions.map((pos) => {
                const isMine = Boolean(userProfile?.id && pos.userId === userProfile.id);
                const isConfirmed = pos.status === 'CONFIRMED';
                const isReserved = pos.status === 'RESERVED';

                return (
                  <div
                    key={pos.code}
                    title={
                      isConfirmed
                        ? pos.allowPublicDisplay && pos.professionalName
                          ? `#${pos.code} · ${pos.professionalName} (Confirmada)`
                          : `#${pos.code} · Modelo Fundadora Confirmada (Privada)`
                        : isReserved
                        ? `#${pos.code} · Reservada temporalmente (pendiente de pago)`
                        : `#${pos.code} · Disponible`
                    }
                    className={`border px-1.5 py-2.5 sm:px-2 flex flex-col justify-between min-h-[78px] transition min-w-0 ${
                      isConfirmed
                        ? 'border-[#f472b6] bg-gradient-to-b from-[#fff1f5] to-[#fce7f3]/70'
                        : isReserved
                        ? 'border-amber-300 bg-amber-50/40'
                        : 'border-pink-100 bg-white hover:border-[#f472b6]'
                    } ${isMine ? 'ring-2 ring-[#be185d]' : ''}`}
                  >
                    <div className="flex items-center justify-between px-0.5">
                      <span className="font-serif text-sm font-bold text-slate-900 tabular-nums">
                        {pos.code}
                      </span>
                      {isConfirmed ? (
                        <Award className="w-3.5 h-3.5 text-[#be185d]" />
                      ) : isReserved ? (
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                      ) : (
                        <span className="text-[10px] text-slate-300">·</span>
                      )}
                    </div>

                    <div className="pt-2 w-full flex items-center justify-center text-center min-w-0">
                      {isConfirmed ? (
                        pos.allowPublicDisplay && pos.professionalName ? (
                          <div className="flex items-center justify-center gap-1.5 min-w-0 w-full">
                            {pos.avatar && (
                              <img
                                src={pos.avatar}
                                alt={pos.professionalName}
                                className="w-5 h-5 rounded-full object-cover border border-pink-200 shrink-0"
                              />
                            )}
                            <span className="text-[9.5px] font-semibold text-slate-900 truncate">
                              {pos.professionalName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[8.5px] font-semibold uppercase tracking-wider text-[#9d174d] block w-full text-center">
                            FUNDADORA
                          </span>
                        )
                      ) : isReserved ? (
                        <span className="text-[8px] font-semibold uppercase tracking-[0.04em] text-amber-800 block w-full text-center">
                          RESERVADA
                        </span>
                      ) : (
                        <span className="text-[8px] font-medium uppercase tracking-[0.04em] text-slate-400 block w-full text-center">
                          DISPONIBLE
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Confirmed Public Founders Gallery */}
          {publicGalleryFounders.length > 0 && (
            <div className="mt-14 pt-10 border-t border-pink-100 space-y-6 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#be185d]">
                    GALERÍA DE MIEMBROS FUNDADORES
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-slate-950 mt-1">
                    Modelos Fundadoras Confirmadas
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-600 tabular-nums">
                  {publicGalleryFounders.length} perfiles públicos
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {publicGalleryFounders.map((founder) => (
                  <div
                    key={founder.code}
                    className="bg-white border border-[#f9a8d4]/60 p-4 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          founder.avatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
                        }
                        alt={founder.professionalName || 'Modelo Fundadora'}
                        className="w-12 h-12 rounded-full object-cover border border-pink-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif text-base font-bold text-slate-950 truncate">
                          {founder.professionalName}
                        </h4>
                        {founder.username && (
                          <span className="text-[11px] font-mono text-slate-500 block truncate">
                            @{founder.username}
                          </span>
                        )}
                      </div>
                    </div>
                    <FoundingModelBadge founderNumber={founder.code} variant="inline" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 5. RUTA DE 90 DÍAS */}
        <section ref={journeySectionRef} className="py-16 border-b border-[#f9a8d4]/40 scroll-mt-20">
          <div className="space-y-3 text-left max-w-3xl mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#be185d]">
              PROGRAMA DE PREPARACIÓN INTERNACIONAL
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950">
              TU CAMINO COMIENZA AQUÍ — 90 DÍAS
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Apertura:</span>
              <strong>{formatShortDate(timelineInfo.startIso)}</strong>
              <span>·</span>
              <span>Lanzamiento internacional:</span>
              <strong>{formatShortDate(timelineInfo.endIso)}</strong>
            </p>
          </div>

          {/* 3 Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { code: '90 DÍAS', subtitle: 'DÍAS DE PREPARACIÓN' },
              { code: '100 FUNDADORES', subtitle: 'MIEMBROS FUNDADORES' },
              { code: '001–100', subtitle: 'POSICIONES EXCLUSIVAS' }
            ].map((item) => (
              <div
                key={item.code}
                className="bg-gradient-to-br from-white via-[#fdf2f8]/70 to-white border border-[#f9a8d4]/60 p-6 text-left"
              >
                <span className="font-serif text-3xl font-bold text-slate-950 tabular-nums block">
                  {item.code}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#be185d] mt-1.5 block">
                  {item.subtitle}
                </span>
              </div>
            ))}
          </div>

          {/* Editorial Runway Debut Visual + 3 Stages */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 border border-[#f9a8d4]/60 bg-[#fdf2f8] p-2.5">
              {!salonImgError ? (
                <img
                  src={runwaySalonImg}
                  alt="Salón de Alta Costura — 90 Días hacia la Pasarela Global"
                  onError={() => setSalonImgError(true)}
                  className="w-full aspect-video object-cover block"
                />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-tr from-[#fdf2f8] to-white flex items-center justify-center p-6">
                  <span className="font-serif text-lg font-bold text-slate-900">
                    PREPARACIÓN PARA LA PASARELA GLOBAL
                  </span>
                </div>
              )}
              <div className="pt-3 px-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                <span>ETAPA ACTUAL: FASE 0{timelineInfo.currentStage}</span>
                <span className="text-[#be185d] tabular-nums">
                  {timelineInfo.daysRemaining} DÍAS RESTANTES
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  stage: 1,
                  title: 'FASE 01 — CONSTRUYE TU PERFIL (DÍAS 1–30)',
                  range: `${formatShortDate(timelineInfo.startIso)} — ${formatShortDate(timelineInfo.stage1EndIso)}`,
                  desc: 'Estructuración de portafolio internacional, biografía editorial, verificación de identidad y vinculación de canales oficiales.'
                },
                {
                  stage: 2,
                  title: 'FASE 02 — CONSTRUYE TU PRESENCIA (DÍAS 31–60)',
                  range: `${formatShortDate(timelineInfo.stage1EndIso)} — ${formatShortDate(timelineInfo.stage2EndIso)}`,
                  desc: 'Publicación de material audiovisual para Casting Live, activación de presencia destacada y preparación de proyectos.'
                },
                {
                  stage: 3,
                  title: 'FASE 03 — PREPÁRATE PARA EL LANZAMIENTO (DÍAS 61–90)',
                  range: `${formatShortDate(timelineInfo.stage2EndIso)} — ${formatShortDate(timelineInfo.endIso)}`,
                  desc: 'Acceso anticipado a herramientas del lanzamiento, validación VIP para actividades de fundadores y debut internacional.'
                }
              ].map((st) => {
                const isActive = timelineInfo.currentStage === st.stage && !countdown.launched;
                return (
                  <div
                    key={st.stage}
                    className={`border p-6 text-left transition ${
                      isActive
                        ? 'border-[#f472b6] bg-[#fdf2f8]/60'
                        : 'border-pink-100 bg-white'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className="font-serif text-lg font-bold text-slate-950">
                        {st.title}
                      </h3>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#be185d] tabular-nums">
                        {st.range}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. PANEL PRIVADO PARA FUNDADORES (MI ÁREA DE FUNDADORES) */}
        <section ref={foundersAreaRef} className="py-16 border-b border-[#f9a8d4]/40 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 text-left">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#be185d]">
                ÁREA PRIVADA DE PREPARACIÓN
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-950 mt-1">
                MI ÁREA DE FUNDADORES
              </h2>
            </div>

            {myPosition?.status === 'CONFIRMED' && (
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#9d174d]">
                <Lock className="w-3.5 h-3.5" />
                <span>Número oficial no editable asignado: #{myPosition.code}</span>
              </div>
            )}
          </div>

          {userProfile?.role === 'visitor' ? (
            <div className="bg-white border border-[#f9a8d4]/60 p-8 text-center space-y-4">
              <p className="font-serif text-xl font-bold text-slate-900">
                Accede a tu área privada de preparación internacional
              </p>
              <p className="text-xs text-slate-600 max-w-lg mx-auto">
                Inicia sesión o registra tu cuenta en Fashion Finances para consultar el porcentaje real de preparación de tu perfil y tu plaza oficial.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="custom-bg bg-[#be185d] hover:bg-[#9d174d] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] cursor-pointer"
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={onOpenRegister}
                  className="pearl-pink-btn px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] cursor-pointer"
                >
                  Crear Cuenta
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#f472b6]/60 p-6 sm:p-8 space-y-8 text-left">
              {/* Top Profile Summary inside My Founders Area */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pb-6 border-b border-pink-100">
                <div className="lg:col-span-6 flex items-center gap-4">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#f472b6] shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <h3 className="font-serif text-2xl font-bold text-slate-950 truncate">
                      {userProfile.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-500">@{userProfile.username}</p>
                    {myPosition?.status === 'CONFIRMED' ? (
                      <div className="pt-1">
                        <FoundingModelBadge founderNumber={myPosition.code} variant="inline" />
                      </div>
                    ) : myPosition?.status === 'RESERVED' ? (
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-0.5">
                        RESERVA #{myPosition.code} PENDIENTE DE CONFIRMACIÓN DE PAGO
                      </span>
                    ) : (
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Sin plaza asignada aún · Puedes completar tareas previas desde aquí
                      </span>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <span className="block text-[9.5px] uppercase tracking-[0.16em] text-slate-500 font-semibold">
                      Nº Fundador
                    </span>
                    <span className="font-serif text-lg font-bold text-slate-950 tabular-nums">
                      {myPosition ? `#${myPosition.code}` : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9.5px] uppercase tracking-[0.16em] text-slate-500 font-semibold">
                      Incorporación
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {formatShortDate(myPosition?.joinDate || myPosition?.reservedAt)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9.5px] uppercase tracking-[0.16em] text-slate-500 font-semibold">
                      Lanzamiento
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {formatShortDate(config.launchDate)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9.5px] uppercase tracking-[0.16em] text-slate-500 font-semibold">
                      Días Restantes
                    </span>
                    <span className="font-serif text-lg font-bold text-[#be185d] tabular-nums">
                      {timelineInfo.daysRemaining}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Completion Progress Bar */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-900">
                    COMPLETADO DEL PERFIL: {profileEvaluation.percent}%
                  </span>
                  <span className="text-xs font-semibold text-[#be185d] tabular-nums">
                    {profileEvaluation.completedCount} DE {profileEvaluation.totalCount} TAREAS COMPLETADAS
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#fdf2f8] border border-pink-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f472b6] to-[#be185d] transition-all duration-500"
                    style={{ width: `${profileEvaluation.percent}%` }}
                  />
                </div>
              </div>

              {/* Real Actionable Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {profileEvaluation.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`border p-3.5 flex items-center justify-between gap-3 ${
                      task.done
                        ? 'border-pink-200 bg-[#fdf2f8]/50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      {task.done ? (
                        <CheckCircle2 className="w-4 h-4 text-[#be185d] shrink-0 mt-0.5" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0 mt-0.5 inline-block" />
                      )}
                      <span
                        className={`text-xs leading-snug ${
                          task.done ? 'text-slate-900 font-medium' : 'text-slate-600'
                        }`}
                      >
                        {task.label}
                      </span>
                    </div>
                    {!task.done && (
                      <button
                        type="button"
                        onClick={task.onAction}
                        className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#be185d] hover:underline bg-transparent shrink-0 cursor-pointer"
                      >
                        {task.actionLabel}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Direct Platform Shortcuts */}
              <div className="pt-4 border-t border-pink-100 flex flex-col items-center justify-center gap-3 w-full">
                <div className="flex flex-wrap items-center justify-center gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => onNavigateToTab('profile')}
                    className="pearl-pink-btn px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] cursor-pointer"
                  >
                    Editar mi perfil
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToTab('create_project')}
                    className="pearl-pink-btn px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] cursor-pointer"
                  >
                    Publicar proyecto
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToTab('casting_live')}
                    className="pearl-pink-btn px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] cursor-pointer"
                  >
                    Ir a Casting Live
                  </button>
                </div>
                <div className="flex justify-center w-full">
                  <button
                    type="button"
                    onClick={onOpenRanking}
                    className="pearl-pink-btn px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <span>Ver Ranking Oficial</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 7. PANEL DE ADMINISTRACIÓN INTEGRAL DE LOS PRIMEROS 100 (solo perfil de Adriana Lima) */}
        {canAccessExecutiveAdmin && (
          <section ref={adminSectionRef} className="pt-16 scroll-mt-20 text-left space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#be185d]">
                  ADMINISTRACIÓN DEL PROGRAMA
                </p>
                <h2 className="font-serif text-3xl font-bold text-slate-950 mt-1">
                  Gestión Ejecutiva — Los Primeros 100
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  fetchFoundersState(false);
                  fetchAdminOverview();
                }}
                className="pearl-pink-btn px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] inline-flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualizar Datos</span>
              </button>
            </div>

            {/* Conversion KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Confirmadas', value: `${confirmedCount} / 100` },
                { label: 'En espera (RESERVADA)', value: `${reservedCount}` },
                {
                  label: 'Ingresos confirmados',
                  value: `${(stats.totalConfirmedRevenueEur || 0).toLocaleString('es-ES')} €`
                },
                {
                  label: 'Conversión reservas',
                  value: `${stats.conversionRatePercent || 0}%`
                }
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white border border-pink-200 p-5">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {kpi.label}
                  </span>
                  <span className="font-serif text-2xl font-bold text-slate-950 tabular-nums mt-1 block">
                    {kpi.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Date & Program Controls */}
            <form
              onSubmit={handleSaveAdminConfig}
              className="bg-white border border-pink-200 p-6 space-y-5"
            >
              <h3 className="font-serif text-xl font-bold text-slate-950">
                Configuración de Apertura, Lanzamiento y Cierre
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                <div className="md:col-span-4 min-w-0">
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                    Fecha de Apertura
                  </label>
                  <input
                    type="datetime-local"
                    value={openingInput}
                    onChange={(e) => setOpeningInput(e.target.value)}
                    className="w-full min-w-0 border border-pink-200 px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#be185d]"
                  />
                </div>
                <div className="md:col-span-5 min-w-0">
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                    Fecha de Lanzamiento Internacional
                  </label>
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="datetime-local"
                      value={launchInput}
                      onChange={(e) => setLaunchInput(e.target.value)}
                      className="flex-1 min-w-0 border border-pink-200 px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#be185d]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const base = openingInput ? new Date(openingInput) : new Date();
                        setLaunchInput(
                          toDatetimeLocalValue(
                            new Date(base.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString()
                          )
                        );
                      }}
                      className="pearl-pink-btn px-3 py-2 text-[10px] font-bold uppercase shrink-0 cursor-pointer"
                    >
                      +90d
                    </button>
                  </div>
                </div>
                <div className="md:col-span-3 min-w-0">
                  <label className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600 mb-1.5">
                    Estado del Programa
                  </label>
                  <label className="flex items-center gap-2.5 border border-pink-200 bg-[#fdf2f8]/50 px-3 py-2 text-xs font-medium text-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={programClosedInput}
                      onChange={(e) => setProgramClosedInput(e.target.checked)}
                      className="accent-[#be185d] w-4 h-4 shrink-0"
                    />
                    <span className="leading-snug">Cerrar programa manualmente</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <input
                  type="text"
                  placeholder="Motivo de cierre opcional (si se cierra manualmente)..."
                  value={closedReasonInput}
                  onChange={(e) => setClosedReasonInput(e.target.value)}
                  className="flex-1 min-w-[240px] border border-pink-200 px-3 py-2 text-xs text-slate-900 bg-white focus:outline-none focus:border-[#be185d]"
                />
                <button
                  type="submit"
                  disabled={savingAdminConfig}
                  className="custom-bg bg-[#be185d] hover:bg-[#9d174d] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] cursor-pointer"
                >
                  {savingAdminConfig ? 'Guardando...' : 'Guardar Configuración'}
                </button>
              </div>
            </form>

            {/* Occupied Positions & Payment Incidents */}
            {adminOverview && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-white border border-pink-200 p-6 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-slate-950">
                    Posiciones Ocupadas o en Reserva
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-pink-100 text-[10px] uppercase tracking-[0.14em] text-slate-500">
                          <th className="py-2 pr-3">Plaza</th>
                          <th className="py-2 pr-3">Modelo</th>
                          <th className="py-2 pr-3">Estado</th>
                          <th className="py-2 pr-3">Progreso</th>
                          <th className="py-2">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-pink-50">
                        {adminOverview.positions
                          .filter((p) => p.status !== 'AVAILABLE')
                          .map((p) => (
                            <tr key={p.code}>
                              <td className="py-2.5 pr-3 font-serif font-bold tabular-nums">
                                #{p.code}
                              </td>
                              <td className="py-2.5 pr-3">
                                <span className="font-semibold text-slate-900 block">
                                  {p.professionalName || '—'}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500">
                                  @{p.username}
                                </span>
                              </td>
                              <td className="py-2.5 pr-3">
                                <span
                                  className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                                    p.status === 'CONFIRMED'
                                      ? 'bg-[#fce7f3] text-[#9d174d]'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {p.status === 'CONFIRMED' ? 'CONFIRMADA' : p.status === 'RESERVED' ? 'RESERVADA' : 'DISPONIBLE'}
                                </span>
                              </td>
                              <td className="py-2.5 pr-3 tabular-nums">
                                {p.status === 'CONFIRMED' ? `${p.completionPercent ?? 0}%` : '—'}
                              </td>
                              <td className="py-2.5 flex flex-wrap gap-2">
                                {p.status === 'CONFIRMED' && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAdminToggleBadge(p.code, p.badgeActive === false)
                                    }
                                    className="text-[10px] font-semibold underline text-[#be185d] bg-transparent cursor-pointer"
                                  >
                                    {p.badgeActive === false ? 'Activar insignia' : 'Suspender insignia'}
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleAdminReleaseOrRefund(
                                      p.code,
                                      p.status === 'CONFIRMED' ? 'refund' : 'cancel'
                                    )
                                  }
                                  className="text-[10px] font-semibold underline text-slate-600 hover:text-rose-700 bg-transparent cursor-pointer"
                                >
                                  {p.status === 'CONFIRMED' ? 'Devolver & Liberar' : 'Cancelar & Liberar'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        {adminOverview.positions.every((p) => p.status === 'AVAILABLE') && (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-slate-400">
                              Aún no hay reservas ni compras confirmadas.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-white border border-pink-200 p-6 space-y-4">
                  <h3 className="font-serif text-lg font-bold text-slate-950">
                    Incidencias de Pago y Registro
                  </h3>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto">
                    {adminOverview.incidents.length === 0 ? (
                      <p className="text-xs text-slate-400 py-4 text-center">
                        Sin incidencias registradas.
                      </p>
                    ) : (
                      adminOverview.incidents.map((inc) => (
                        <div key={inc.id} className="border border-pink-100 p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-[#be185d]">
                              {inc.type} · #{inc.positionCode || '---'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {inc.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-700 leading-relaxed">
                            {inc.description}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
