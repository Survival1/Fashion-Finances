import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Trophy,
  Euro,
  Gift,
  ShieldAlert,
  MessageSquare,
  MessageCircle,
  ExternalLink,
  Sparkles,
  Clock,
  Filter,
  Users,
  UserPlus
} from 'lucide-react';

export type NotificationCategory =
  | 'all'
  | 'amigos'
  | 'rondas'
  | 'comisiones'
  | 'regalos'
  | 'administradores'
  | 'comentarios'
  | 'mensajes';

export interface AppNotification {
  id: string;
  category: 'amigos' | 'rondas' | 'comisiones' | 'regalos' | 'administradores' | 'comentarios' | 'mensajes';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  icon?: string;
  amount?: number;
  actionLabel?: string;
  targetTab?: string;
  actionRanking?: boolean;
  avatar?: string;
  friendRequestId?: string;
  friendRequestType?: 'received' | 'accepted';
  friendData?: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    bio: string;
    sentAt: string;
    mutualFriends?: number;
    isOnline?: boolean;
  };
}

const STORAGE_KEY = 'coll_notifications';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-friend-req-irina',
    category: 'amigos',
    title: '👥 Solicitud de amistad recibida',
    message: 'Irina Shayk (@irinashayk_w6) te ha enviado una solicitud de amistad. Top 6 Modelo Femenina Global.',
    timestamp: Date.now() - 1000 * 60 * 15, // 15 mins ago
    read: false,
    icon: '👥',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
    friendRequestId: 'req-irina',
    friendRequestType: 'received',
    friendData: {
      id: 'req-irina',
      name: 'Irina Shayk',
      username: 'irinashayk_w6',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
      bio: 'Top 6 Modelo Femenina Global. Diseñadora de alta costura y embajadora de pasarela.',
      sentAt: 'Hace 2 horas',
      mutualFriends: 3,
      isOnline: true
    }
  },
  {
    id: 'notif-ronda-1',
    category: 'rondas',
    title: '🏆 ¡Victoria en Ronda Millonarios París!',
    message: 'Tu proyecto "Milano Vintage Denim" obtuvo la mayor votación de inversores y ha ganado un fondo acumulado de 80.00€.',
    timestamp: Date.now() - 1000 * 60 * 25, // 25 mins ago
    read: false,
    icon: '🏆',
    amount: 80.0,
    actionLabel: 'Ver Sesión',
    targetTab: 'sessions'
  },
  {
    id: 'notif-friend-req-david',
    category: 'amigos',
    title: '👥 Solicitud de amistad recibida',
    message: 'David Gandy (@davidgandy_m3) te ha enviado una solicitud de amistad. Top 3 Modelo Masculino Global.',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    read: false,
    icon: '👥',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    friendRequestId: 'req-david',
    friendRequestType: 'received',
    friendData: {
      id: 'req-david',
      name: 'David Gandy',
      username: 'davidgandy_m3',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      bio: 'Top 3 Modelo Masculino Global. Especialista en campañas de sastrería premium y crowdfunding.',
      sentAt: 'Ayer a las 18:30',
      mutualFriends: 5,
      isOnline: false
    }
  },
  {
    id: 'notif-friend-acc-sean',
    category: 'amigos',
    title: "🎉 ¡Sean O'Pry ha aceptado tu solicitud de amistad!",
    message: "Sean O'Pry (@seanopry_m2) ha aceptado tu solicitud de amistad. Ahora sois amigos y podéis intercambiar mensajes y colaborar.",
    timestamp: Date.now() - 1000 * 60 * 55, // 55 mins ago
    read: false,
    icon: '🎉',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    friendRequestType: 'accepted',
    actionLabel: 'Ver en Amigos'
  },
  {
    id: 'notif-friend-req-sara',
    category: 'amigos',
    title: '👥 Solicitud de amistad recibida',
    message: 'Sara Sampaio (@sarasampaio_w9) te ha enviado una solicitud de amistad. Ángel internacional y promotora de moda ecológica.',
    timestamp: Date.now() - 1000 * 60 * 70, // 70 mins ago
    read: true,
    icon: '👥',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    friendRequestId: 'req-sara',
    friendRequestType: 'received',
    friendData: {
      id: 'req-sara',
      name: 'Sara Sampaio',
      username: 'sarasampaio_w9',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      bio: 'Ángel internacional y promotora de fondos de moda ecológica en Milán y París.',
      sentAt: 'Hace 2 días',
      mutualFriends: 2,
      isOnline: true
    }
  },
  {
    id: 'notif-friend-acc-gigi',
    category: 'amigos',
    title: '🎉 ¡Gigi Hadid ha aceptado tu solicitud de amistad!',
    message: 'Gigi Hadid (@gigihadid_w7) ha aceptado tu solicitud de amistad. Ya forma parte de tu círculo de contactos directos.',
    timestamp: Date.now() - 1000 * 60 * 90,
    read: true,
    icon: '🎉',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    friendRequestType: 'accepted',
    actionLabel: 'Ver en Amigos'
  },
  {
    id: 'notif-comis-1',
    category: 'comisiones',
    title: '💶 Comisión Acreditada: 75.00€',
    message: 'Has recibido una comisión directa por el patrocinio oficial de Balenciaga en la pasarela de Casting Live.',
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
    read: true,
    icon: '💶',
    amount: 75.0,
    actionLabel: 'Ver Finanzas',
    targetTab: 'finance'
  },
  {
    id: 'notif-regalo-1',
    category: 'regalos',
    title: '🎁 ¡Has recibido un Reloj Tourbillon Suizo!',
    message: 'Ernesto vs te ha enviado el "Reloj Tourbillon Suizo" (🪙 2.500) con la dedicatoria: "Brilla en cada pasarela". Guardado en tu bóveda.',
    timestamp: Date.now() - 1000 * 60 * 150, // 2.5 hours ago
    read: true,
    icon: '🎁',
    amount: 2500,
    actionLabel: 'Abrir Bóveda',
    actionRanking: true
  },
  {
    id: 'notif-admin-1',
    category: 'administradores',
    title: '🛡️ Aviso Oficial de Administración',
    message: 'Auditoría mensual de contratos y transferencias completada. Tu cuenta se encuentra 100% verificada para retiros y pagos oficiales.',
    timestamp: Date.now() - 1000 * 60 * 200,
    read: true,
    icon: '🛡️'
  },
  {
    id: 'notif-coment-1',
    category: 'comentarios',
    title: '💬 Nuevo comentario en Instagram',
    message: '@marcus_sterling_real ha comentado en tu vídeo: "¡Increíble presencia escénica y estilismo de pasarela impecable! 💖👠"',
    timestamp: Date.now() - 1000 * 60 * 300,
    read: true,
    icon: '💬',
    actionLabel: 'Ver Redes',
    targetTab: 'home'
  },
  {
    id: 'notif-msg-1',
    category: 'mensajes',
    title: '✉️ Nuevo Mensaje de Alexander Vance',
    message: 'Alexander Vance: "¿Tienes disponibilidad para coordinar el shooting de alta costura en Milán la próxima semana?"',
    timestamp: Date.now() - 1000 * 60 * 400,
    read: true,
    icon: '✉️',
    actionLabel: 'Ir a Mensajes',
    targetTab: 'chat'
  }
];

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenRanking?: () => void;
  onOpenFriendsTab?: (subTab: 'friends' | 'pending' | 'sent') => void;
  onUnreadCountChange?: (count: number) => void;
}

export default function NotificationCenterModal({
  isOpen,
  onClose,
  onNavigateToTab,
  onOpenRanking,
  onOpenFriendsTab,
  onUnreadCountChange
}: NotificationCenterModalProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
    const unread = notifications.filter(n => !n.read).length;
    if (onUnreadCountChange) {
      onUnreadCountChange(unread);
    }
  }, [notifications, onUnreadCountChange]);

  // Listen for storage, custom notifications, or friend request synchronization events
  useEffect(() => {
    const handleAddNotification = (event: Event) => {
      const customEvent = event as CustomEvent<AppNotification>;
      if (customEvent.detail) {
        setNotifications(prev => [
          {
            ...customEvent.detail,
            id: customEvent.detail.id || `notif-${Date.now()}`,
            timestamp: customEvent.detail.timestamp || Date.now(),
            read: false
          },
          ...prev
        ]);
      }
    };

    const handleSyncFriends = () => {
      try {
        const savedPending = localStorage.getItem('ff_pending_received_requests');
        const pendingList = savedPending ? JSON.parse(savedPending) : [];
        const pendingIds = new Set(pendingList.map((p: any) => p.id));

        setNotifications(prev => {
          let hasChange = false;
          const next = prev.map(n => {
            if (n.category === 'amigos' && n.friendRequestType === 'received' && n.friendRequestId) {
              if (!pendingIds.has(n.friendRequestId)) {
                hasChange = true;
                return {
                  ...n,
                  title: `🎉 ¡Ahora tú y ${n.friendData?.name || 'este creador'} sois amigos!`,
                  message: `Has aceptado la solicitud de amistad de ${n.friendData?.name || ''}. Ya aparece en tu lista oficial de Amigos.`,
                  friendRequestType: 'accepted' as const,
                  read: true
                };
              }
            }
            return n;
          });
          return hasChange ? next : prev;
        });
      } catch (_) {}
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setNotifications(parsed);
        } catch {}
      }
      if (e.key === 'ff_pending_received_requests') {
        handleSyncFriends();
      }
    };

    window.addEventListener('add-app-notification', handleAddNotification);
    window.addEventListener('sync-friend-requests', handleSyncFriends);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('add-app-notification', handleAddNotification);
      window.removeEventListener('sync-friend-requests', handleSyncFriends);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'all') return notifications;
    return notifications.filter(n => n.category === activeCategory);
  }, [notifications, activeCategory]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('¿Deseas vaciar todas las notificaciones?')) {
      setNotifications([]);
    }
  };

  // 🤝 Aceptar solicitud de amistad desde el Centro de Notificaciones
  const handleAcceptFriendInModal = (item: AppNotification, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.friendData) return;

    try {
      // 1. Eliminar de pendientes en localStorage
      const savedPending = localStorage.getItem('ff_pending_received_requests');
      const pendingList = savedPending ? JSON.parse(savedPending) : [];
      const updatedPending = pendingList.filter((p: any) => p.id !== item.friendRequestId && p.username !== item.friendData?.username);
      localStorage.setItem('ff_pending_received_requests', JSON.stringify(updatedPending));

      // 2. Añadir a amigos aceptados con isNew: true para la insignia ✨ NUEVO AMIGO
      const savedAccepted = localStorage.getItem('ff_accepted_extra_friends');
      const acceptedList = savedAccepted ? JSON.parse(savedAccepted) : [];
      const newFriend = {
        id: item.friendData.id,
        name: item.friendData.name,
        username: item.friendData.username,
        avatar: item.friendData.avatar,
        bio: item.friendData.bio,
        isNew: true
      };
      const updatedAccepted = [newFriend, ...acceptedList.filter((f: any) => f.id !== newFriend.id && f.username !== newFriend.username)];
      localStorage.setItem('ff_accepted_extra_friends', JSON.stringify(updatedAccepted));
    } catch (_) {}

    // 3. Actualizar la notificación en el estado local
    setNotifications(prev => prev.map(n => {
      if (n.id === item.id) {
        return {
          ...n,
          title: `🎉 ¡Ahora tú y ${item.friendData!.name} sois amigos!`,
          message: `Has aceptado la solicitud de amistad de ${item.friendData!.name} (@${item.friendData!.username}). Ahora aparece en tu lista oficial de Amigos con la insignia "✨ NUEVO AMIGO".`,
          friendRequestType: 'accepted',
          read: true
        };
      }
      return n;
    }));

    showToast(`¡Solicitud aceptada! Ahora ${item.friendData.name} y tú sois amigos.`);

    // 4. Notificar a ModelFacebookProfile y demás componentes
    window.dispatchEvent(new CustomEvent('sync-friend-requests'));
  };

  // ✋ Rechazar solicitud de amistad desde el Centro de Notificaciones
  const handleRejectFriendInModal = (item: AppNotification, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.friendData) return;

    try {
      const savedPending = localStorage.getItem('ff_pending_received_requests');
      const pendingList = savedPending ? JSON.parse(savedPending) : [];
      const updatedPending = pendingList.filter((p: any) => p.id !== item.friendRequestId && p.username !== item.friendData?.username);
      localStorage.setItem('ff_pending_received_requests', JSON.stringify(updatedPending));
    } catch (_) {}

    setNotifications(prev => prev.filter(n => n.id !== item.id));
    showToast(`Solicitud de amistad de ${item.friendData.name} rechazada.`);
    window.dispatchEvent(new CustomEvent('sync-friend-requests'));
  };

  // 🚀 Redirigir directamente al panel Mis Amigos y seleccionar la subpestaña adecuada
  const handleGoToFriendsTab = (subTab: 'friends' | 'pending' | 'sent', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onOpenFriendsTab) {
      onOpenFriendsTab(subTab);
    }
    window.dispatchEvent(new CustomEvent('open-friends-modal-tab', { detail: { subTab } }));
    onClose();
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Ahora mismo';
    if (mins < 60) return `Hace ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Hace ${hours} h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days} d`;
  };

  const getCategoryMeta = (cat: AppNotification['category']) => {
    switch (cat) {
      case 'amigos':
        return {
          label: 'Amistad',
          badgeClass: 'bg-pink-100 text-[#fe2c55] border-pink-300',
          dotColor: 'bg-[#fe2c55]'
        };
      case 'rondas':
        return {
          label: 'Resultado de Ronda',
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
          dotColor: 'bg-amber-500'
        };
      case 'comisiones':
        return {
          label: 'Comisión',
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dotColor: 'bg-emerald-500'
        };
      case 'regalos':
        return {
          label: 'Regalo',
          badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
          dotColor: 'bg-rose-500'
        };
      case 'administradores':
        return {
          label: 'Aviso Admin',
          badgeClass: 'bg-purple-100 text-purple-900 border-purple-300',
          dotColor: 'bg-purple-600'
        };
      case 'comentarios':
        return {
          label: 'Comentario en Redes',
          badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
          dotColor: 'bg-sky-500'
        };
      case 'mensajes':
        return {
          label: 'Mensaje de Usuario',
          badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          dotColor: 'bg-indigo-500'
        };
      default:
        return {
          label: 'General',
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
          dotColor: 'bg-slate-500'
        };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-end p-2 sm:p-4 bg-slate-950/40 backdrop-blur-xs animate-fade-in">
      {/* Backdrop overlay dismiss */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Main Container */}
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh] sm:mt-16 animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Floating Toast inside modal */}
        {toastMessage && (
          <div className="bg-slate-900 text-white text-xs font-bold px-4 py-2 text-center border-b border-slate-800 flex items-center justify-center gap-2 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-rose-300 shadow-inner">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-base sm:text-lg tracking-wide text-white">
                  Notificaciones
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-[#fe2c55] text-white animate-pulse">
                    {unreadCount} nuevas
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 font-sans">
                Amigos, Rondas, Comisiones, Regalos, Admins, Redes y Mensajes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                title="Marcar todas como leídas"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span className="hidden sm:inline">Leer todas</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              title="Cerrar notificaciones"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="bg-slate-50 border-b border-slate-200/80 p-2 sm:p-2.5 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Todas ({notifications.length})
          </button>

          {/* 👥 Nueva categoría Amigos sincronizada */}
          <button
            type="button"
            onClick={() => setActiveCategory('amigos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'amigos'
                ? 'bg-[#fe2c55] text-white shadow-xs'
                : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>👥</span>
            <span>Amigos</span>
            {notifications.filter(n => n.category === 'amigos' && !n.read).length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                activeCategory === 'amigos' ? 'bg-white text-[#fe2c55]' : 'bg-[#fe2c55] text-white'
              }`}>
                {notifications.filter(n => n.category === 'amigos' && !n.read).length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('rondas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'rondas'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🏆</span>
            <span>Rondas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('comisiones')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'comisiones'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>💶</span>
            <span>Comisiones</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('regalos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'regalos'
                ? 'bg-[#e11d48] text-white shadow-xs'
                : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🎁</span>
            <span>Regalos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('administradores')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'administradores'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>🛡️</span>
            <span>Admins</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('comentarios')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'comentarios'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>💬</span>
            <span>Redes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('mensajes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'mensajes'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-650 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>✉️</span>
            <span>Mensajes</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 sm:p-3 space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-2xl text-slate-400">
                📭
              </div>
              <p className="text-sm font-bold text-slate-700">No hay notificaciones en esta categoría</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Las alertas sobre solicitudes de amistad, rondas, comisiones y regalos aparecerán aquí.
              </p>
            </div>
          ) : (
            filteredNotifications.map(item => {
              const meta = getCategoryMeta(item.category);

              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleRead(item.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl transition-all relative cursor-pointer group border ${
                    !item.read
                      ? 'bg-gradient-to-r from-pink-50/50 via-white to-slate-50 border-pink-200/70 shadow-xs'
                      : 'bg-white hover:bg-slate-50/80 border-slate-150'
                  }`}
                >
                  {/* Category Pill and Unread indicator */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9.5px] uppercase font-mono font-black px-2 py-0.5 rounded-full border ${meta.badgeClass}`}
                      >
                        {meta.label}
                      </span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#fe2c55] animate-ping" />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10.5px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-300" />
                        {formatTime(item.timestamp)}
                      </span>

                      <button
                        type="button"
                        onClick={e => handleDeleteNotification(item.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                        title="Eliminar notificación"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex items-start gap-3">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt="Avatar"
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 shadow-2xs bg-slate-50"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0 shadow-2xs border border-slate-200">
                        {item.icon || '🔔'}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.message}
                      </p>

                      {/* 🤝 ACCIONES ESPECÍFICAS PARA SOLICITUDES DE AMISTAD RECIBIDAS */}
                      {item.category === 'amigos' && item.friendRequestType === 'received' && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={e => handleAcceptFriendInModal(item, e)}
                            className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-[#fe2c55] hover:from-pink-600 hover:to-rose-600 text-white rounded-lg font-black text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Aceptar</span>
                          </button>

                          <button
                            type="button"
                            onClick={e => handleRejectFriendInModal(item, e)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs flex items-center gap-1 transition cursor-pointer active:scale-95"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Rechazar</span>
                          </button>

                          <button
                            type="button"
                            onClick={e => handleGoToFriendsTab('pending', e)}
                            className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                          >
                            <span>Ver en Mis Amigos</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </button>
                        </div>
                      )}

                      {/* 🎉 ACCIONES PARA SOLICITUDES DE AMISTAD ACEPTADAS */}
                      {item.category === 'amigos' && item.friendRequestType === 'accepted' && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={e => handleGoToFriendsTab('friends', e)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-black text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
                          >
                            <Users className="w-3.5 h-3.5 text-pink-300" />
                            <span>Ver en Mis Amigos</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>

                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              if (onNavigateToTab) onNavigateToTab('chat');
                              onClose();
                            }}
                            className="px-2.5 py-1.5 border border-pink-200 hover:bg-pink-50 text-[#fe2c55] rounded-lg font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Enviar Mensaje</span>
                          </button>
                        </div>
                      )}

                      {/* Acciones estándar para otras categorías */}
                      {item.category !== 'amigos' && (item.actionLabel || item.targetTab || item.actionRanking) && (
                        <div className="mt-2.5 flex items-center gap-2">
                          {item.actionRanking ? (
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                if (onOpenRanking) onOpenRanking();
                                onClose();
                              }}
                              className="px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg font-bold text-[10.5px] uppercase tracking-wider flex items-center gap-1 shadow-xs hover:scale-102 transition cursor-pointer"
                            >
                              <span>{item.actionLabel || 'Ver Bóveda'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          ) : item.targetTab && onNavigateToTab ? (
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                onNavigateToTab(item.targetTab!);
                                onClose();
                              }}
                              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[10.5px] uppercase tracking-wider flex items-center gap-1 shadow-xs hover:scale-102 transition cursor-pointer"
                            >
                              <span>{item.actionLabel || 'Ir a la sección'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          ) : null}

                          <span className="text-[10px] text-slate-400 italic">
                            {item.read ? '• Leída' : '• Haz clic para marcar como leída'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>{notifications.length} notificaciones registradas</span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-rose-600 hover:text-rose-700 font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar todas</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
