import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Briefcase,
  Check,
  Clock,
  MessageSquare,
  Send,
  Sparkles,
  UserCheck,
  X,
  ArrowLeft,
  Bell,
  Gift,
  Search,
  ChevronRight,
  Info,
  Camera,
  Megaphone,
  Star,
  Play,
  Crown,
  User,
} from 'lucide-react';
import {
  HiringOffer,
  HiringOfferStatus,
  HIRING_OFFERS_EVENT,
  addHiringOfferToStorage,
  doesOfferTargetUser,
  getHiringOffersFromStorage,
  isAdrianaLimaIdentity,
  respondToHiringOfferInStorage,
} from '../utils/hiringOffersService';

export interface ContractServiceItem {
  label: string;
  badge: string;
  image: string;
  contract: string;
  counterparty: string;
}

export const CORPORATE_CONTRACT_SERVICES: ContractServiceItem[] = [
  {
    label: 'Sesión de fotos',
    badge: 'Fotografía Editorial',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400',
    contract: 'Contrato de prestación de servicios + cesión/licencia de imagen profesional.',
    counterparty: 'Marca / Fotógrafo ↔ Modelo',
  },
  {
    label: 'Publicidad',
    badge: 'Campaña Comercial',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400',
    contract: 'Contrato de model y actor publicitario para difusión en medios masivos.',
    counterparty: 'Marca / Agencia publicitaria ↔ Modelo',
  },
  {
    label: 'Desfile de moda',
    badge: 'Pasarela & Fashion Week',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=400',
    contract: 'Contrato de participación en desfile de haute couture y pasarela live.',
    counterparty: 'Diseñador / Organizador ↔ Modelo',
  },
  {
    label: 'Redes sociales',
    badge: 'Creación de Contenidos',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
    contract: 'Contrato de influencer, publicaciones patrocinadas y branding digital.',
    counterparty: 'Marca ↔ Creador / Modelo',
  },
  {
    label: 'Vídeo / Reel / TikTok',
    badge: 'Producción Audiovisual 4K',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=400',
    contract: 'Contrato de creación y actuación en formato vídeo vertical de alto impacto.',
    counterparty: 'Marca ↔ Modelo',
  },
  {
    label: 'Embajador de marca',
    badge: 'Brand Ambassador VIP',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    contract: 'Contrato de embajador exclusivo de marca y representación.',
    counterparty: 'Marca ↔ Modelo',
  },
  {
    label: 'Evento & Gala',
    badge: 'Aparición Presencial VIP',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400',
    contract: 'Contrato de actuación, alfombra roja y presencia en eventos corporativos.',
    counterparty: 'Organizador / Empresa ↔ Modelo',
  },
  {
    label: 'Videoclip musical',
    badge: 'Rodaje Artístico',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400',
    contract: 'Contrato de protagonismo o participación artística en videoclip musical.',
    counterparty: 'Productora musical ↔ Modelo',
  },
  {
    label: 'Cine & Televisión',
    badge: 'Ficción & Serie TV',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400',
    contract: 'Contrato artístico de interpretación para largometraje, corto o televisión.',
    counterparty: 'Productora cinematográfica ↔ Modelo',
  },
  {
    label: 'E-commerce & Tienda',
    badge: 'Catálogo Digital',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=400',
    contract: 'Contrato de modelo para sesión de tienda online, lookbook y ficha de producto.',
    counterparty: 'Marca / Tienda Online ↔ Modelo',
  },
  {
    label: 'Catálogo & Lookbook',
    badge: 'Editorial Impreso & Web',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=400',
    contract: 'Contrato de sesión fotográfica de colección completa y derechos de catálogo.',
    counterparty: 'Marca de moda ↔ Modelo',
  },
  {
    label: 'Campaña internacional',
    badge: 'Campaña Global',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400',
    contract: 'Contrato de campaña publicitaria con derechos de uso y difusión internacional.',
    counterparty: 'Marca multinacional ↔ Modelo',
  },
  {
    label: 'Exclusividad de imagen',
    badge: 'Acuerdo Exclusivo',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    contract: 'Contrato de exclusividad sectorial y fidelidad de marca por periodo pactado.',
    counterparty: 'Marca / Holding ↔ Modelo',
  },
  {
    label: 'Representación de agencia',
    badge: 'Management Oficial',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    contract: 'Contrato de representación profesional, gestión de bookings y management.',
    counterparty: 'Agencia de modelos ↔ Modelo',
  },
  {
    label: 'Casting & Audición',
    badge: 'Selección & Prueba',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400',
    contract: 'Acuerdo de participación en casting selectivo y prueba de cámara para proyecto.',
    counterparty: 'Directora de casting / Agencia ↔ Modelo',
  },
];

interface CorporateHiringPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'catalog' | 'send' | 'inbox';
  targetUser: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  currentUser?: {
    id?: string;
    name?: string;
    username?: string;
    avatar?: string;
    email?: string;
    role?: string;
  } | null;
  isOwnProfile: boolean;
  canManageOffers?: boolean;
}

const renderServiceBadgeIcon = (label: string) => {
  switch (label) {
    case 'Sesión de fotos':
    case 'Catálogo & Lookbook':
      return <Camera className="w-3 h-3 text-[#C2185B] shrink-0" />;
    case 'Publicidad':
      return <Megaphone className="w-3 h-3 text-[#C2185B] shrink-0" />;
    case 'Desfile de moda':
    case 'Embajador de marca':
      return <Star className="w-3 h-3 text-[#C2185B] fill-[#C2185B] shrink-0" />;
    case 'Redes sociales':
    case 'Vídeo / Reel / TikTok':
    case 'Videoclip musical':
    case 'Cine & Televisión':
      return <Play className="w-3 h-3 text-[#C2185B] fill-[#C2185B] shrink-0" />;
    default:
      return <Crown className="w-3 h-3 text-[#C2185B] shrink-0" />;
  }
};

const renderServiceThumbnail = (item: ContractServiceItem) => {
  if (item.label === 'Sesión de fotos') {
    return (
      <div className="relative w-[72px] h-[54px] rounded-xl overflow-hidden shrink-0 border border-[#E5C287]/80 bg-gradient-to-br from-[#FFF4F8] to-[#FAD3E3] shadow-xs">
        <img
          src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300"
          alt={item.label}
          className="w-full h-full object-cover object-top"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  if (item.label === 'Publicidad') {
    return (
      <div className="relative w-[72px] h-[54px] rounded-xl overflow-hidden shrink-0 border border-[#E5C287]/80 bg-gradient-to-br from-[#FFF6FA] via-[#FCE4EE] to-[#F7CADB] shadow-xs flex items-center justify-center">
        <svg viewBox="0 0 80 56" className="w-14 h-11 drop-shadow-sm" aria-hidden="true">
          <defs>
            <linearGradient id="megaBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FCE4EC" />
              <stop offset="55%" stopColor="#F06292" />
              <stop offset="100%" stopColor="#C2185B" />
            </linearGradient>
            <linearGradient id="megaGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF0B8" />
              <stop offset="50%" stopColor="#DFB467" />
              <stop offset="100%" stopColor="#A67A2E" />
            </linearGradient>
          </defs>
          <path d="M18 25 L50 11 L50 41 L18 32 Z" fill="url(#megaBody)" stroke="url(#megaGold)" strokeWidth="1.5" />
          <ellipse cx="50" cy="26" rx="5.5" ry="15" fill="url(#megaGold)" />
          <ellipse cx="50" cy="26" rx="3.8" ry="11.5" fill="#9E0B4B" />
          <rect x="12" y="24" width="7" height="9" rx="2.5" fill="url(#megaGold)" />
          <path d="M23 33 L28 45 L33 43 L28 32 Z" fill="url(#megaGold)" />
          <path d="M59 19 Q64 26 59 33" fill="none" stroke="#D81B60" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M64 15 Q71 26 64 37" fill="none" stroke="#DFB467" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (item.label === 'Desfile de moda') {
    return (
      <div className="relative w-[72px] h-[54px] rounded-xl overflow-hidden shrink-0 border border-[#E5C287]/80 bg-gradient-to-br from-[#FFF6FA] via-[#FCE4EE] to-[#F7CADB] shadow-xs flex items-center justify-center">
        <svg viewBox="0 0 80 56" className="w-14 h-12 drop-shadow-sm" aria-hidden="true">
          <defs>
            <linearGradient id="gownGrad" x1="0" y1="0" x2="0.6" y2="1">
              <stop offset="0%" stopColor="#F06292" />
              <stop offset="50%" stopColor="#C2185B" />
              <stop offset="100%" stopColor="#7B0838" />
            </linearGradient>
          </defs>
          <rect x="38.5" y="4" width="3" height="6" rx="1.5" fill="#C99E4E" />
          <path d="M33 11 L47 11 L44 21 L36 21 Z" fill="url(#gownGrad)" />
          <path d="M36 21 C29 30 23 41 20 51 L60 51 C57 41 51 30 44 21 Z" fill="url(#gownGrad)" />
          <path d="M36 21 L44 21" stroke="#F6D58E" strokeWidth="1.5" />
          <path d="M38 22 C35 33 32 42 30 51" stroke="#F8BBD0" strokeOpacity="0.45" strokeWidth="1.2" fill="none" />
          <path d="M42 22 C45 33 48 42 50 51" stroke="#F8BBD0" strokeOpacity="0.45" strokeWidth="1.2" fill="none" />
        </svg>
      </div>
    );
  }

  if (item.label === 'Redes sociales') {
    return (
      <div className="relative w-[72px] h-[54px] rounded-xl overflow-hidden shrink-0 border border-[#E5C287]/80 bg-gradient-to-br from-[#FFF5F9] via-[#FDE6F0] to-[#F8D0E1] shadow-xs flex items-center justify-center gap-1 px-1.5">
        <div className="w-[18px] h-[18px] rounded-[5px] bg-[#181216] border border-[#E5C287]/70 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-[3px] border border-white flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-white" />
          </div>
        </div>
        <div className="w-[18px] h-[18px] rounded-[5px] bg-[#181216] border border-[#E5C287]/70 flex items-center justify-center text-white font-black text-[9px] leading-none">
          ♪
        </div>
        <div className="w-[18px] h-[18px] rounded-[5px] bg-[#181216] border border-[#E5C287]/70 flex items-center justify-center">
          <div className="w-0 h-0 border-t-[3.5px] border-t-transparent border-b-[3.5px] border-b-transparent border-l-[6px] border-l-white ml-0.5" />
        </div>
      </div>
    );
  }

  if (item.label === 'Vídeo / Reel / TikTok') {
    return (
      <div className="relative w-[72px] h-[54px] rounded-xl overflow-hidden shrink-0 border border-[#E5C287]/80 bg-gradient-to-br from-[#FFF5F9] via-[#FDE6F0] to-[#F8D0E1] shadow-xs flex items-center justify-center">
        <svg viewBox="0 0 80 56" className="w-12 h-11 drop-shadow-sm" aria-hidden="true">
          <g transform="rotate(-10 40 16)">
            <rect x="20" y="10" width="40" height="8" rx="1.5" fill="#1F171B" stroke="#E5C287" strokeWidth="0.9" />
            <path d="M24 10 L29 18 M34 10 L39 18 M44 10 L49 18 M54 10 L59 18" stroke="#FFFFFF" strokeWidth="2.5" />
          </g>
          <rect x="20" y="21" width="40" height="26" rx="2.5" fill="#1F171B" stroke="#E5C287" strokeWidth="1" />
          <line x1="25" y1="29" x2="55" y2="29" stroke="#F8BBD0" strokeOpacity="0.4" strokeWidth="1.2" />
          <line x1="25" y1="36" x2="55" y2="36" stroke="#F8BBD0" strokeOpacity="0.4" strokeWidth="1.2" />
          <line x1="25" y1="42" x2="45" y2="42" stroke="#F8BBD0" strokeOpacity="0.4" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  if (item.label === 'Embajador de marca') {
    return (
      <div className="relative w-[72px] h-[54px] rounded-xl overflow-hidden shrink-0 border border-[#E5C287]/80 bg-gradient-to-br from-[#FFF5F9] via-[#FDE6F0] to-[#F8D0E1] shadow-xs flex items-center justify-center">
        <svg viewBox="0 0 80 56" className="w-12 h-11 drop-shadow-sm" aria-hidden="true">
          <defs>
            <linearGradient id="goldStar" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF5C0" />
              <stop offset="45%" stopColor="#E6B85C" />
              <stop offset="100%" stopColor="#9C6B1D" />
            </linearGradient>
          </defs>
          <polygon
            points="40,7 45.2,18.2 57.5,19.7 48.4,28.1 50.8,40.3 40,34.2 29.2,40.3 31.6,28.1 22.5,19.7 34.8,18.2"
            fill="url(#goldStar)"
            stroke="#8B5A12"
            strokeWidth="0.8"
          />
          <rect x="33" y="42" width="14" height="3" rx="1" fill="url(#goldStar)" />
          <rect x="29" y="45" width="22" height="5" rx="1.5" fill="#4A2535" stroke="#E5C287" strokeWidth="0.9" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-[72px] h-[54px] rounded-xl overflow-hidden shrink-0 border border-[#E5C287]/80 bg-pink-100/50 shadow-xs">
      <img
        src={item.image}
        alt={item.label}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
        }}
      />
    </div>
  );
};

export default function CorporateHiringPortalModal({
  isOpen,
  onClose,
  initialTab = 'catalog',
  targetUser,
  currentUser,
  isOwnProfile,
  canManageOffers: canManageOffersProp,
}: CorporateHiringPortalModalProps) {
  const canManageOffers =
    typeof canManageOffersProp === 'boolean'
      ? canManageOffersProp
      : isOwnProfile && isAdrianaLimaIdentity(currentUser);
  const [activeView, setActiveView] = useState<'catalog' | 'send' | 'inbox'>(
    initialTab === 'inbox' && !canManageOffers ? 'catalog' : initialTab
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [offers, setOffers] = useState<HiringOffer[]>(() => getHiringOffersFromStorage());

  // Send offer form state
  const [selectedServiceItem, setSelectedServiceItem] = useState<ContractServiceItem>(
    CORPORATE_CONTRACT_SERVICES[0]
  );
  const [senderName, setSenderName] = useState(currentUser?.name || '');
  const [senderCompany, setSenderCompany] = useState(currentUser?.name ? `${currentUser.name} Studio` : '');
  const [senderEmail, setSenderEmail] = useState(currentUser?.email || '');
  const [offeredAmount, setOfferedAmount] = useState('5000');
  const [eventDate, setEventDate] = useState('2026-07-15');
  const [exclusive, setExclusive] = useState(false);
  const [details, setDetails] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedOffer, setSubmittedOffer] = useState<HiringOffer | null>(null);

  // Inbox filter & per-offer reply state
  const [inboxStatusFilter, setInboxStatusFilter] = useState<'todas' | HiringOfferStatus>('todas');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [counterDrafts, setCounterDrafts] = useState<Record<string, string>>({});
  const [replyFeedbackId, setReplyFeedbackId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveView(initialTab === 'inbox' && !canManageOffers ? 'catalog' : initialTab);
      setOffers(getHiringOffersFromStorage());
      setFormError(null);
      setSubmittedOffer(null);
    }
  }, [isOpen, initialTab, canManageOffers]);

  useEffect(() => {
    const refreshOffers = (e?: any) => {
      if (Array.isArray(e?.detail)) {
        setOffers(e.detail);
      } else {
        setOffers(getHiringOffersFromStorage());
      }
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ff_hiring_offers') {
        setOffers(getHiringOffersFromStorage());
      }
    };
    window.addEventListener(HIRING_OFFERS_EVENT, refreshOffers);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(HIRING_OFFERS_EVENT, refreshOffers);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const targetOffers = useMemo(() => {
    return offers.filter((o) => {
      const matchTarget = doesOfferTargetUser(o, targetUser);
      if (!matchTarget) return false;
      if (canManageOffers) return true;
      if (!currentUser?.id || currentUser.role === 'visitor') return false;
      return (
        o.senderId === currentUser.id ||
        (Boolean(currentUser.username) &&
          o.senderUsername?.toLowerCase() === currentUser.username?.toLowerCase())
      );
    });
  }, [offers, targetUser, canManageOffers, currentUser?.id, currentUser?.username, currentUser?.role]);

  const pendingCount = useMemo(
    () => targetOffers.filter((o) => o.status === 'pendiente').length,
    [targetOffers]
  );

  const filteredContracts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return CORPORATE_CONTRACT_SERVICES;
    return CORPORATE_CONTRACT_SERVICES.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.contract.toLowerCase().includes(query) ||
        item.counterparty.toLowerCase().includes(query) ||
        item.badge.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const filteredOffers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return targetOffers.filter((offer) => {
      if (inboxStatusFilter !== 'todas' && offer.status !== inboxStatusFilter) return false;
      if (!q) return true;
      return (
        offer.serviceLabel.toLowerCase().includes(q) ||
        offer.senderName.toLowerCase().includes(q) ||
        offer.senderCompany.toLowerCase().includes(q) ||
        (offer.senderUsername || '').toLowerCase().includes(q) ||
        offer.details.toLowerCase().includes(q)
      );
    });
  }, [targetOffers, inboxStatusFilter, searchQuery]);

  if (!isOpen) return null;

  const handleOpenSendForm = (service: ContractServiceItem) => {
    setSelectedServiceItem(service);
    setFormError(null);
    setSubmittedOffer(null);
    setActiveView('send');
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = senderName.trim();
    const cleanCompany = senderCompany.trim() || cleanName;
    const cleanEmail = senderEmail.trim();
    const numericAmount = Number(offeredAmount);

    if (!cleanName) {
      setFormError('Indica tu nombre o el de la persona que realiza la oferta.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setFormError('Indica un correo de contacto válido para recibir la respuesta.');
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setFormError('El importe de la oferta debe ser mayor que 0 €.');
      return;
    }
    if (!eventDate) {
      setFormError('Selecciona una fecha estimada para la contratación.');
      return;
    }

    const created = addHiringOfferToStorage({
      targetUserId: targetUser.id || 'user',
      targetUsername: targetUser.username || 'modelo',
      targetName: targetUser.name || 'Modelo',
      senderId: currentUser?.id || `guest-${Date.now()}`,
      senderName: cleanName,
      senderUsername: currentUser?.username,
      senderAvatar:
        currentUser?.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      senderCompany: cleanCompany,
      senderEmail: cleanEmail,
      serviceLabel: selectedServiceItem.label,
      serviceBadge: selectedServiceItem.badge,
      offeredAmount: numericAmount,
      eventDate,
      exclusive,
      details:
        details.trim() ||
        `Propuesta de contratación para "${selectedServiceItem.label}" presentada por ${cleanCompany}.`,
    });

    setFormError(null);
    setSubmittedOffer(created);
    setDetails('');
  };

  const handleRespondToOffer = (
    offer: HiringOffer,
    status: HiringOfferStatus,
    roleOverride?: 'model' | 'sender'
  ) => {
    const replyText = replyDrafts[offer.id] || '';
    const counterRaw = counterDrafts[offer.id];
    const counterNumeric =
      counterRaw && Number(counterRaw) > 0 ? Number(counterRaw) : undefined;

    if (status === 'contraoferta' && !replyText.trim() && !counterNumeric) {
      return;
    }

    const updated = respondToHiringOfferInStorage({
      offerId: offer.id,
      status,
      replyText,
      authorName: roleOverride === 'sender' ? currentUser?.name || offer.senderName : targetUser.name,
      authorUsername: roleOverride === 'sender' ? currentUser?.username || offer.senderUsername : targetUser.username,
      authorRole: roleOverride || (canManageOffers ? 'model' : 'sender'),
      counterAmount: counterNumeric,
    });

    setOffers(updated);
    setReplyDrafts((prev) => ({ ...prev, [offer.id]: '' }));
    setCounterDrafts((prev) => ({ ...prev, [offer.id]: '' }));
    setReplyFeedbackId(offer.id);
    setTimeout(() => {
      setReplyFeedbackId((curr) => (curr === offer.id ? null : curr));
    }, 2200);
  };

  const getStatusBadge = (status: HiringOfferStatus) => {
    switch (status) {
      case 'aceptada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3" /> Aceptada
          </span>
        );
      case 'rechazada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-600 border border-slate-200">
            <X className="w-3 h-3" /> Rechazada
          </span>
        );
      case 'contraoferta':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-sky-50 text-sky-700 border border-sky-200">
            <MessageSquare className="w-3 h-3" /> Respondida / Contraoferta
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Pendiente de respuesta
          </span>
        );
    }
  };

  const closePortal = () => {
    setSearchQuery('');
    onClose();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-fade-in text-slate-900 select-none"
      onClick={closePortal}
    >
      <div
        className="w-full h-full max-w-[1440px] max-h-[100dvh] sm:h-[calc(100dvh-20px)] sm:w-[calc(100vw-24px)] sm:rounded-3xl relative flex flex-col overflow-hidden border border-[#E5C287]/80 shadow-[0_24px_80px_rgba(88,12,45,0.35)]"
        style={{
          background:
            'radial-gradient(circle at 12% 10%, #FFFFFF 0%, #FDF2F7 38%, #FBE6EF 72%, #F9DCE8 100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Silk Waves & Gold Ribbons Background */}
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-90"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="silkTopWave" x1="0" y1="0" x2="1" y2="0.4">
              <stop offset="0%" stopColor="#F8C8DC" stopOpacity="0.45" />
              <stop offset="45%" stopColor="#FCE7F1" stopOpacity="0.25" />
              <stop offset="78%" stopColor="#F094B8" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#E16596" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id="silkBottomWave" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E16596" stopOpacity="0.6" />
              <stop offset="35%" stopColor="#F3A6C4" stopOpacity="0.5" />
              <stop offset="72%" stopColor="#FCE9F2" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#F5BBD2" stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="goldRibbonStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#B88938" />
              <stop offset="35%" stopColor="#F3DC9B" />
              <stop offset="68%" stopColor="#C89843" />
              <stop offset="100%" stopColor="#F5E1A4" />
            </linearGradient>
          </defs>

          {/* Top silk waves */}
          <path
            d="M0,128 C280,188 610,64 960,128 C1170,164 1310,104 1440,86 L1440,210 C1230,175 1030,226 760,175 C490,124 220,215 0,165 Z"
            fill="url(#silkTopWave)"
          />
          <path
            d="M0,126 C280,188 610,64 960,128 C1170,164 1310,104 1440,86"
            fill="none"
            stroke="url(#goldRibbonStroke)"
            strokeWidth="2.2"
          />
          <path
            d="M0,165 C220,215 490,124 760,175 C1030,226 1230,175 1440,210"
            fill="none"
            stroke="url(#goldRibbonStroke)"
            strokeWidth="1.4"
            opacity="0.85"
          />

          {/* Bottom silk waves */}
          <path
            d="M0,780 C240,828 490,895 810,852 C1080,816 1270,865 1440,815 L1440,900 L0,900 Z"
            fill="url(#silkBottomWave)"
          />
          <path
            d="M0,780 C240,828 490,895 810,852 C1080,816 1270,865 1440,815"
            fill="none"
            stroke="url(#goldRibbonStroke)"
            strokeWidth="2.2"
          />
          <path
            d="M0,842 C300,888 590,812 910,868 C1150,906 1310,854 1440,872"
            fill="none"
            stroke="url(#goldRibbonStroke)"
            strokeWidth="1.5"
            opacity="0.85"
          />
        </svg>

        {/* TOP LUXURY NAVIGATION HEADER */}
        <header className="relative z-20 bg-white/88 backdrop-blur-md border-b border-[#E5C287]/70 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 shadow-[0_4px_20px_rgba(194,24,91,0.06)] shrink-0">
          {/* Left Brand Mark */}
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/aistudio/pink_diamond_brilliant.png"
              alt="Fashion Finances"
              className="w-10 h-8 object-contain drop-shadow-[0_3px_8px_rgba(216,27,96,0.3)] shrink-0"
            />
            <div className="h-8 w-[1px] bg-slate-300/90 hidden sm:block" />
            <div className="text-left leading-none">
              <div className="font-serif text-base sm:text-xl tracking-wide font-semibold">
                <span className="text-[#23171B]">FASHION </span>
                <span className="text-[#C2185B]">FINANCES</span>
              </div>
              <p className="text-[8.5px] sm:text-[9px] tracking-[0.26em] text-slate-600 font-semibold uppercase mt-1">
                DIGITAL • FASHION • FINANCE
              </p>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => {
                setSubmittedOffer(null);
                setActiveView('catalog');
              }}
              className={`custom-bg inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                activeView === 'catalog'
                  ? 'bg-gradient-to-b from-[#EC1F6B] via-[#D4145A] to-[#9E0943] text-white shadow-[0_4px_14px_rgba(212,20,90,0.36),inset_0_1px_1px_rgba(255,255,255,0.45)] border border-[#FF94BA]/45'
                  : 'bg-transparent text-[#2B1D22] hover:bg-pink-50 border border-transparent'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Catálogo</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  activeView === 'catalog'
                    ? 'bg-white/25 text-white border border-white/40'
                    : 'bg-pink-100 text-[#C2185B] border border-pink-200'
                }`}
              >
                {CORPORATE_CONTRACT_SERVICES.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSubmittedOffer(null);
                setActiveView('send');
              }}
              className={`custom-bg inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                activeView === 'send'
                  ? 'bg-gradient-to-b from-[#EC1F6B] via-[#D4145A] to-[#9E0943] text-white shadow-[0_4px_14px_rgba(212,20,90,0.36),inset_0_1px_1px_rgba(255,255,255,0.45)] border border-[#FF94BA]/45'
                  : 'bg-transparent text-[#2B1D22] hover:bg-pink-50 border border-transparent'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Enviar Oferta</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-300/80 hidden sm:block" />

            <button
              type="button"
              onClick={() => {
                setSubmittedOffer(null);
                setActiveView('inbox');
              }}
              className={`custom-bg inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                activeView === 'inbox'
                  ? 'bg-gradient-to-b from-[#EC1F6B] via-[#D4145A] to-[#9E0943] text-white shadow-[0_4px_14px_rgba(212,20,90,0.36),inset_0_1px_1px_rgba(255,255,255,0.45)] border border-[#FF94BA]/45'
                  : 'bg-transparent text-[#2B1D22] hover:bg-pink-50 border border-transparent'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{canManageOffers ? 'Ofertas Recibidas' : 'Mis Ofertas'}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  activeView === 'inbox'
                    ? 'bg-white text-[#C2185B]'
                    : pendingCount > 0
                    ? 'bg-[#FFEAF2] text-[#C2185B] border border-[#F29DC0]'
                    : 'bg-[#FFF3F7] text-[#C2185B] border border-[#F4C4D7]'
                }`}
              >
                {targetOffers.length}
              </span>
            </button>
          </nav>

          {/* Right Search + Profile / Close */}
          <div className="flex items-center gap-2.5 ml-auto lg:ml-0">
            {activeView !== 'send' && (
              <div className="relative w-44 sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    activeView === 'catalog'
                      ? 'Buscar servicio o contrato...'
                      : 'Buscar oferta o remitente...'
                  }
                  className="w-full bg-white/95 border border-[#E5C287]/80 focus:border-[#D4145A] focus:ring-1 focus:ring-[#F49AC1] rounded-full py-2 pl-4 pr-9 text-xs focus:outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400 shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-[#3B262E] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}

            <button
              type="button"
              onClick={closePortal}
              title={`Cerrar portal (@${targetUser.username})`}
              className="custom-bg w-9 h-9 rounded-full border border-[#E5C287] bg-gradient-to-b from-white to-[#FCE7F1] hover:from-[#FFF0F6] hover:to-[#FAD4E4] text-[#7A3550] flex items-center justify-center shadow-xs transition cursor-pointer shrink-0 active:scale-95"
            >
              {targetUser.avatar ? (
                <img
                  src={targetUser.avatar}
                  alt={targetUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#DFB467]"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        {/* HERO RIBBON SECTION */}
        <div className="relative z-10 px-5 sm:px-10 pt-5 pb-3.5 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#FFF8E8] via-[#FDE6EF] to-[#F6CFDA] border-[1.5px] border-[#C99E4E] shadow-sm flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#9D7027]" />
            </div>
            <div className="h-7 w-[1.5px] bg-[#C99E4E]/75 shrink-0" />
            <div>
              <h2 className="font-serif text-xl sm:text-[27px] font-normal text-[#211519] leading-tight tracking-tight">
                Opciones de Contratación Corporativa
              </h2>
              <p className="text-[10.5px] font-mono uppercase tracking-widest text-[#9E2B5B] font-bold mt-0.5">
                Portal de Acuerdos Regulados · @{targetUser.username}
              </p>
            </div>
          </div>

          {/* Right Faceted Pink Diamond Accent on Silk Ribbon */}
          <div className="hidden md:flex items-center pr-4 pointer-events-none select-none">
            <img
              src="/assets/aistudio/pink_diamond_brilliant.png"
              alt=""
              className="w-24 h-auto object-contain drop-shadow-[0_10px_18px_rgba(216,27,96,0.32)] -mb-6"
            />
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="relative z-10 flex-1 overflow-hidden px-4 sm:px-10 pb-3 flex flex-col">
          {/* VIEW 1: CATALOGO DE SERVICIOS */}
          {activeView === 'catalog' && (
            <div className="flex-1 overflow-y-auto rounded-2xl border-[1.5px] border-[#DFB977] bg-white/94 backdrop-blur-sm shadow-[0_14px_40px_rgba(173,20,87,0.10)] scrollbar-thin scrollbar-thumb-pink-200">
              <table className="w-full text-left border-collapse min-w-full sm:min-w-[680px]">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gradient-to-r from-[#FCE4EE] via-[#FDF0F5] to-[#FCE4EE] border-b border-[#E7C691]/70 text-[#2A1D22] text-[11px] uppercase font-bold tracking-[0.12em]">
                    <th className="py-3.5 px-5 sm:px-6 w-[43%]">Servicio</th>
                    <th className="py-3.5 px-4 w-[37%]">Contrato habitual</th>
                    <th className="py-3.5 px-5 sm:px-6 w-[20%] min-w-[165px] text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3D5E1]/90 text-[#23171B]">
                  {filteredContracts.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-slate-400 font-medium font-mono text-sm">
                        Ningún servicio coincide con &quot;{searchQuery}&quot;
                      </td>
                    </tr>
                  ) : (
                    filteredContracts.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-[#FFF5F9]/85 transition-colors duration-150 group/row"
                      >
                        <td className="py-3 px-5 sm:px-6">
                          <div className="flex items-center gap-4">
                            <div className="group-hover/row:scale-[1.03] transition-transform duration-200">
                              {renderServiceThumbnail(item)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-[15px] font-bold text-[#1B1115] group-hover/row:text-[#C2185B] transition-colors leading-tight">
                                {item.label}
                              </h4>
                              <span className="inline-flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold text-[#B81457] bg-[#FFEAF2] px-2.5 py-0.5 rounded-full border border-[#F29DC0]">
                                {renderServiceBadgeIcon(item.label)}
                                <span>{item.badge}</span>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium text-[#2A1D22] text-[13px] leading-snug">
                          {item.contract}
                        </td>
                        <td className="py-3 px-5 sm:px-6 text-center min-w-[165px] whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenSendForm(item)}
                            className="custom-bg inline-flex items-center justify-center gap-1.5 bg-gradient-to-b from-[#EC1F6B] via-[#D4145A] to-[#9E0943] hover:brightness-110 text-white px-6 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition cursor-pointer border border-[#FF94BA]/45 shadow-[0_4px_12px_rgba(212,20,90,0.35),inset_0_1px_1px_rgba(255,255,255,0.45)] active:scale-95 whitespace-nowrap"
                          >
                            <span>Contratar</span>
                            <ChevronRight className="w-3.5 h-3.5 stroke-[2.6]" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW 2: ENVIAR OFERTA DE CONTRATACION */}
          {activeView === 'send' && (
            <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-pink-200">
              <div className="max-w-3xl mx-auto bg-white/95 border-[1.5px] border-[#DFB977] rounded-2xl p-5 sm:p-7 shadow-[0_14px_40px_rgba(173,20,87,0.10)] space-y-5 text-left">
                <div className="flex items-center justify-between border-b border-[#F3D5E1] pb-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedOffer(null);
                      setActiveView('catalog');
                    }}
                    className="custom-bg inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#C2185B] transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver al catálogo</span>
                  </button>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B81457] bg-[#FFEAF2] border border-[#F29DC0] px-2.5 py-1 rounded-full">
                    Para @{targetUser.username}
                  </span>
                </div>

                {submittedOffer ? (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 animate-fade-in">
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-emerald-950 uppercase font-serif">
                        ¡Oferta de Contratación Enviada!
                      </h4>
                      <p className="text-xs text-emerald-900/80 max-w-md mx-auto leading-relaxed">
                        Tu propuesta de <strong>{submittedOffer.offeredAmount.toLocaleString()} €</strong> para{' '}
                        <strong>{submittedOffer.serviceLabel}</strong> ha sido enviada a{' '}
                        <strong>@{submittedOffer.targetUsername}</strong> y ya figura en su buzón para que pueda verla y responderte.
                      </p>
                    </div>

                    <div className="bg-white border border-emerald-200/80 rounded-xl p-4 text-left text-xs space-y-1.5 max-w-md mx-auto">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Remitente / Empresa:</span>
                        <span className="font-bold text-slate-900">{submittedOffer.senderCompany}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Servicio:</span>
                        <span className="font-bold text-[#C2185B]">{submittedOffer.serviceLabel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Presupuesto:</span>
                        <span className="font-black font-mono text-emerald-700">
                          {submittedOffer.offeredAmount.toLocaleString()} €
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Fecha del evento:</span>
                        <span className="font-mono text-slate-800">{submittedOffer.eventDate}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmittedOffer(null);
                          setActiveView('inbox');
                        }}
                        className="custom-bg px-5 py-2.5 bg-gradient-to-b from-[#EC1F6B] via-[#D4145A] to-[#9E0943] text-white rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-xs inline-flex items-center justify-center gap-1.5"
                      >
                        <Bell className="w-4 h-4" />
                        <span>{canManageOffers ? 'Ver en Ofertas Recibidas' : 'Ver Estado de mi Oferta'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmittedOffer(null);
                          setActiveView('catalog');
                        }}
                        className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-[#DFB977] rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                      >
                        Volver al Catálogo
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitOffer} className="space-y-4">
                    <div className="flex items-center gap-3.5 bg-gradient-to-r from-[#FFF3F8] via-white to-[#FFF8EE] p-3.5 rounded-2xl border border-[#E7C691]/80">
                      {renderServiceThumbnail(selectedServiceItem)}
                      <div className="flex-1 min-w-0 space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase text-[#C2185B] block">
                          Modalidad de Servicio
                        </label>
                        <select
                          value={selectedServiceItem.label}
                          onChange={(e) => {
                            const found = CORPORATE_CONTRACT_SERVICES.find(
                              (s) => s.label === e.target.value
                            );
                            if (found) setSelectedServiceItem(found);
                          }}
                          className="w-full bg-white border border-[#E5C287] rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#D4145A] cursor-pointer"
                        >
                          {CORPORATE_CONTRACT_SERVICES.map((srv) => (
                            <option key={srv.label} value={srv.label}>
                              {srv.label} — {srv.badge}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {formError && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl px-3.5 py-2.5 text-xs font-bold">
                        {formError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase text-slate-600 block">
                          Tu Nombre Completo *
                        </label>
                        <input
                          type="text"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="Ej: Sofía Alarcón o tu nombre"
                          className="w-full bg-white border border-[#E5C287]/70 focus:border-[#D4145A] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase text-slate-600 block">
                          Empresa / Marca / Proyecto
                        </label>
                        <input
                          type="text"
                          value={senderCompany}
                          onChange={(e) => setSenderCompany(e.target.value)}
                          placeholder="Ej: Studio Lumière, particular o marca"
                          className="w-full bg-white border border-[#E5C287]/70 focus:border-[#D4145A] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase text-slate-600 block">
                          Correo de Contacto *
                        </label>
                        <input
                          type="email"
                          value={senderEmail}
                          onChange={(e) => setSenderEmail(e.target.value)}
                          placeholder="tu@correo.com"
                          className="w-full bg-white border border-[#E5C287]/70 focus:border-[#D4145A] rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono font-bold uppercase text-slate-600 block">
                          Fecha del Evento / Proyecto *
                        </label>
                        <input
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="w-full bg-white border border-[#E5C287]/70 focus:border-[#D4145A] rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 bg-[#FFF5F9] border border-[#F2C6D8] p-3.5 rounded-2xl">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="text-[10px] font-mono font-bold uppercase text-[#9E0943]">
                          Oferta Económica Propuesta (€) *
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {[1000, 5000, 15000, 25000].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setOfferedAmount(String(preset))}
                              className={`custom-bg px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition cursor-pointer ${
                                offeredAmount === String(preset)
                                  ? 'bg-[#D4145A] text-white border-[#D4145A]'
                                  : 'bg-white text-slate-700 border-[#F29DC0] hover:bg-pink-50'
                              }`}
                            >
                              {preset.toLocaleString()}€
                            </button>
                          ))}
                        </div>
                      </div>
                      <input
                        type="number"
                        min={1}
                        value={offeredAmount}
                        onChange={(e) => setOfferedAmount(e.target.value)}
                        placeholder="Introduce el importe en euros"
                        className="w-full bg-white border border-[#F29DC0] focus:border-[#D4145A] rounded-xl px-3 py-2 text-sm font-black font-mono text-slate-900 focus:outline-none"
                      />
                      <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={exclusive}
                          onChange={(e) => setExclusive(e.target.checked)}
                          className="w-4 h-4 rounded border-pink-300 text-[#D4145A] accent-[#D4145A]"
                        />
                        <span className="font-semibold text-[11px]">
                          Incluir cláusula de exclusividad comercial durante la campaña
                        </span>
                      </label>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-600 block">
                        Detalles de tu Oferta y Condiciones
                      </label>
                      <textarea
                        rows={3}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Describe el proyecto, horario, ciudad, entregables o condiciones de contratación..."
                        className="w-full bg-white border border-[#E5C287]/70 focus:border-[#D4145A] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveView('catalog')}
                        className="sm:w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full transition cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="custom-bg sm:w-2/3 py-2.5 bg-gradient-to-b from-[#EC1F6B] via-[#D4145A] to-[#9E0943] hover:brightness-110 text-white font-black text-xs uppercase tracking-wider rounded-full transition cursor-pointer shadow-[0_4px_12px_rgba(212,20,90,0.35)] inline-flex items-center justify-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar Oferta a @{targetUser.username}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* VIEW 3: BUZON DE OFERTAS RECIBIDAS Y RESPUESTAS */}
          {activeView === 'inbox' && (
            <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-pink-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white/92 border-[1.5px] border-[#DFB977] rounded-2xl px-4 py-3 shadow-xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { id: 'todas', label: 'Todas' },
                      { id: 'pendiente', label: 'Pendientes' },
                      { id: 'contraoferta', label: 'Respondidas' },
                      { id: 'aceptada', label: 'Aceptadas' },
                      { id: 'rechazada', label: 'Rechazadas' },
                    ] as const
                  ).map((pill) => {
                    const count =
                      pill.id === 'todas'
                        ? targetOffers.length
                        : targetOffers.filter((o) => o.status === pill.id).length;
                    return (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => setInboxStatusFilter(pill.id)}
                        className={`custom-bg px-3.5 py-1.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider border transition cursor-pointer ${
                          inboxStatusFilter === pill.id
                            ? 'bg-gradient-to-b from-[#EC1F6B] via-[#D4145A] to-[#9E0943] text-white border-[#D4145A]'
                            : 'bg-white text-slate-700 border-[#E5C287]/80 hover:bg-pink-50'
                        }`}
                      >
                        {pill.label} ({count})
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveView('send')}
                  className="custom-bg px-4 py-1.5 rounded-full bg-gradient-to-b from-[#EC1F6B] via-[#D4145A] to-[#9E0943] text-white text-[11px] font-black uppercase tracking-wider cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Nueva Oferta</span>
                </button>
              </div>

              {filteredOffers.length === 0 ? (
                <div className="bg-white/94 border-[1.5px] border-[#DFB977] rounded-2xl p-10 text-center space-y-3 shadow-xs">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#FFEAF2] border border-[#E5C287] flex items-center justify-center text-[#C2185B]">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900 uppercase">
                      {canManageOffers
                        ? 'Todavía no has recibido ofertas en esta vista'
                        : `No has enviado ofertas a @${targetUser.username} todavía`}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Cualquier usuario puede elegir una modalidad del catálogo y enviarte una propuesta económica. Aparecerá aquí al instante para que puedas aceptarla, rechazarla o responder con una contrapropuesta.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveView('send')}
                    className="custom-bg px-5 py-2 bg-gradient-to-b from-[#EC1F6B] via-[#D4145A] to-[#9E0943] text-white rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Crear una Oferta</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="bg-white/95 border-[1.5px] border-[#DFB977] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 text-left"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#F3D5E1] pb-3.5">
                        <div className="flex items-start gap-3 min-w-0">
                          <img
                            src={offer.senderAvatar}
                            alt={offer.senderName}
                            className="w-11 h-11 rounded-xl object-cover border border-[#E5C287] shrink-0"
                          />
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-black text-slate-950 truncate">
                                {offer.senderCompany}
                              </h4>
                              <span className="text-[11px] font-semibold text-[#C2185B]">
                                · {offer.senderName}
                                {offer.senderUsername ? ` (@${offer.senderUsername})` : ''}
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-slate-500 truncate">
                              {offer.senderEmail} · Evento: {offer.eventDate}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFEAF2] text-[#B81457] border border-[#F29DC0]">
                                {offer.serviceLabel}
                              </span>
                              {offer.exclusive && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                  Exclusividad Comercial
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 shrink-0">
                          {getStatusBadge(offer.status)}
                          <div className="text-right">
                            <span className="text-lg sm:text-xl font-black font-serif text-rose-950 tabular-nums block leading-tight">
                              {offer.offeredAmount.toLocaleString()} €
                            </span>
                            {offer.counterAmount && (
                              <span className="text-[10px] font-mono font-bold text-sky-700 block">
                                Contrapropuesta: {offer.counterAmount.toLocaleString()} €
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#FFF5F9] border border-[#F3D5E1] rounded-xl p-3 text-xs text-slate-700 leading-relaxed">
                        <span className="text-[10px] font-mono font-bold uppercase text-[#C2185B] block mb-1">
                          Propuesta del remitente:
                        </span>
                        <p>{offer.details}</p>
                      </div>

                      {offer.replies && offer.replies.length > 0 && (
                        <div className="space-y-2 pl-3 border-l-2 border-[#D4145A]">
                          <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">
                            Historial de Respuestas ({offer.replies.length})
                          </span>
                          {offer.replies.map((rep) => (
                            <div
                              key={rep.id}
                              className={`rounded-xl p-2.5 text-xs border ${
                                rep.authorRole === 'model'
                                  ? 'bg-gradient-to-r from-[#FFF5F9] to-white border-[#F29DC0]'
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                <span className="font-bold text-slate-900">
                                  {rep.authorName}
                                  {rep.authorUsername ? ` (@${rep.authorUsername})` : ''}
                                </span>
                                <div className="flex items-center gap-2">
                                  {rep.statusTag && (
                                    <span className="text-[9.5px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white border border-pink-200 text-[#C2185B]">
                                      {rep.statusTag}
                                    </span>
                                  )}
                                  {rep.counterAmount && (
                                    <span className="text-[10px] font-mono font-black text-sky-700">
                                      {rep.counterAmount.toLocaleString()} €
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-slate-700 leading-relaxed">{rep.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 space-y-2.5">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <textarea
                            rows={2}
                            value={replyDrafts[offer.id] || ''}
                            onChange={(e) =>
                              setReplyDrafts((prev) => ({ ...prev, [offer.id]: e.target.value }))
                            }
                            placeholder={
                              canManageOffers
                                ? 'Escribe tu respuesta para esta oferta (condiciones, disponibilidad, aceptación o motivo)...'
                                : 'Añade un mensaje de seguimiento a tu oferta...'
                            }
                            className="flex-1 bg-white border border-slate-200 focus:border-[#D4145A] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none resize-none"
                          />
                          {canManageOffers && (
                            <div className="sm:w-44 space-y-1">
                              <label className="text-[9.5px] font-mono font-bold uppercase text-slate-500 block">
                                Contraoferta € (opc.)
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={counterDrafts[offer.id] || ''}
                                onChange={(e) =>
                                  setCounterDrafts((prev) => ({ ...prev, [offer.id]: e.target.value }))
                                }
                                placeholder="Ej: 18000"
                                className="w-full bg-white border border-slate-200 focus:border-sky-400 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          {replyFeedbackId === offer.id ? (
                            <span className="text-[11px] font-bold text-emerald-700 inline-flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" /> Respuesta guardada y enviada
                            </span>
                          ) : (
                            <span className="text-[10.5px] text-slate-500">
                              La respuesta quedará registrada al instante para el remitente.
                            </span>
                          )}

                          {canManageOffers ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleRespondToOffer(offer, 'rechazada', 'model')}
                                className="custom-bg px-3.5 py-1.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 rounded-full text-[11px] font-bold transition cursor-pointer"
                              >
                                Rechazar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRespondToOffer(offer, 'contraoferta', 'model')}
                                disabled={
                                  !(replyDrafts[offer.id] || '').trim() &&
                                  !(counterDrafts[offer.id] && Number(counterDrafts[offer.id]) > 0)
                                }
                                className="custom-bg px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-45 text-white rounded-full text-[11px] font-bold transition cursor-pointer inline-flex items-center gap-1"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>Responder / Contraoferta</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRespondToOffer(offer, 'aceptada', 'model')}
                                className="custom-bg px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[11px] font-black transition cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>Aceptar Oferta</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRespondToOffer(offer, offer.status, 'sender')}
                              disabled={!(replyDrafts[offer.id] || '').trim()}
                              className="custom-bg px-4 py-1.5 bg-gradient-to-b from-[#EC1F6B] via-[#D4145A] to-[#9E0943] disabled:opacity-45 text-white rounded-full text-[11px] font-bold transition cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Enviar Mensaje</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* LUXURY SILK FOOTER BAR */}
        <footer className="relative z-20 px-4 sm:px-10 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Bottom-left subtle faceted pink diamond accent */}
          <img
            src="/assets/aistudio/pink_diamond_brilliant.png"
            alt=""
            className="hidden sm:block absolute left-8 bottom-0 w-24 h-auto object-contain pointer-events-none select-none opacity-95 drop-shadow-[0_6px_14px_rgba(216,27,96,0.3)]"
          />

          <div className="relative z-10 sm:ml-24 inline-flex items-center gap-2.5 bg-white/92 backdrop-blur-sm border border-[#DFB977]/90 rounded-full px-4 py-2 shadow-xs text-left">
            <span className="w-5 h-5 rounded-full bg-gradient-to-b from-[#E5BA64] to-[#B07E28] text-white flex items-center justify-center shrink-0">
              <Info className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] sm:text-xs italic text-[#2B1D22] font-medium">
              Cualquier usuario puede lanzar una oferta directa; puedes revisarla y responder al instante.
            </span>
          </div>

          <button
            type="button"
            onClick={closePortal}
            className="custom-bg relative z-10 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-b from-[#EC1F6B] via-[#D4145A] to-[#9E0943] hover:brightness-110 text-white text-xs font-bold tracking-wide transition cursor-pointer border border-[#FF94BA]/45 shadow-[0_5px_16px_rgba(212,20,90,0.38),inset_0_1px_1px_rgba(255,255,255,0.45)] active:scale-95 w-full sm:w-auto"
          >
            <X className="w-3.5 h-3.5 stroke-[2.6]" />
            <span>Cerrar Catálogo</span>
          </button>
        </footer>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
