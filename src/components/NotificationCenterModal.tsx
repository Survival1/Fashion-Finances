import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  UserPlus,
  ChevronLeft,
  ChevronRight
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
  upsert?: boolean;
  actionLabel?: string;
  targetTab?: string;
  actionRanking?: boolean;
  avatar?: string;
  senderId?: string;
  senderName?: string;
  senderUsername?: string;
  recipientId?: string;
  recipientName?: string;
  recipientUsername?: string;
  data?: {
    senderId?: string;
    senderName?: string;
    senderUsername?: string;
    recipientId?: string;
    recipientName?: string;
    recipientUsername?: string;
    [key: string]: unknown;
  };
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

export interface NotificationUserIdentity {
  id?: string;
  name?: string;
  username?: string;
}

const normalizeIdentityText = (value?: string | null): string =>
  (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^@+/, '')
    .replace(/\s+/g, ' ')
    .trim();

export function isSelfSenderNotification(
  notification: Partial<AppNotification> | null | undefined,
  currentUser?: NotificationUserIdentity | null
): boolean {
  if (!notification || !currentUser) return false;

  const userNameNorm = normalizeIdentityText(currentUser.name);
  const userUsernameNorm = normalizeIdentityText(currentUser.username);
  const userIdNorm = (currentUser.id || '').trim();

  const explicitIds = [notification.senderId, notification.data?.senderId, notification.friendData?.id]
    .map(v => (typeof v === 'string' ? v.trim() : ''))
    .filter(Boolean);
  if (userIdNorm && explicitIds.some(id => id === userIdNorm)) {
    return true;
  }

  const explicitNames = [
    notification.senderName,
    notification.data?.senderName,
    notification.friendData?.name
  ]
    .map(v => normalizeIdentityText(typeof v === 'string' ? v : ''))
    .filter(Boolean);

  const explicitUsernames = [
    notification.senderUsername,
    notification.data?.senderUsername,
    notification.friendData?.username
  ]
    .map(v => normalizeIdentityText(typeof v === 'string' ? v : ''))
    .filter(Boolean);

  if (userNameNorm && explicitNames.some(n => n === userNameNorm)) {
    return true;
  }
  if (userUsernameNorm && explicitUsernames.some(u => u === userUsernameNorm)) {
    return true;
  }

  const titleNorm = normalizeIdentityText(notification.title);
  const messageNorm = normalizeIdentityText(notification.message);
  const combinedNorm = `${titleNorm} ${messageNorm}`;

  const identitiesToCheck = [userNameNorm, userUsernameNorm].filter(v => v.length >= 3);
  for (const ident of identitiesToCheck) {
    if (
      titleNorm.includes(` de ${ident}`) ||
      titleNorm.endsWith(` de ${ident}!`) ||
      titleNorm.includes(`¡${ident} `) ||
      titleNorm.startsWith(`${ident} `)
    ) {
      return true;
    }

    if (
      messageNorm.includes(`${ident} te ha `) ||
      messageNorm.includes(`@${ident} te ha `) ||
      messageNorm.includes(`${ident} ha aceptado`) ||
      messageNorm.includes(`@${ident} ha comentado`) ||
      messageNorm.includes(`${ident} ha comentado`) ||
      messageNorm.startsWith(`${ident}:`) ||
      messageNorm.startsWith(`${ident} (@`) ||
      combinedNorm.includes(`recibido un regalo de ${ident}`) ||
      combinedNorm.includes(`recibido una donacion de ${ident}`)
    ) {
      return true;
    }
  }

  return false;
}

const normalizeUsernameBase = (value?: string | null): string =>
  normalizeIdentityText(value).replace(/_[wm]\d+$/i, '');

const doUserIdentitiesMatch = (
  a?: NotificationUserIdentity | null,
  b?: NotificationUserIdentity | null
): boolean => {
  if (!a || !b) return false;
  const aId = (a.id || '').trim();
  const bId = (b.id || '').trim();
  if (aId && bId && aId === bId) return true;

  const aName = normalizeIdentityText(a.name);
  const bName = normalizeIdentityText(b.name);
  if (aName && bName && aName === bName) return true;

  const aUser = normalizeIdentityText(a.username);
  const bUser = normalizeIdentityText(b.username);
  if (aUser && bUser) {
    if (aUser === bUser) return true;
    const aBase = normalizeUsernameBase(aUser);
    const bBase = normalizeUsernameBase(bUser);
    if (aBase.length >= 5 && bBase.length >= 5 && aBase === bBase) return true;
  }

  const isAdriana = (u: NotificationUserIdentity) => {
    const n = normalizeIdentityText(u.name);
    const un = normalizeIdentityText(u.username);
    return (
      u.id === 'topf-1' ||
      un === 'adrianalima' ||
      un === 'adrianalima_w1' ||
      n === 'adriana lima' ||
      n === 'adriana lim'
    );
  };
  if (isAdriana(a) && isAdriana(b)) return true;

  return false;
};

export function isNotificationForDifferentRecipient(
  notification: Partial<AppNotification> | null | undefined,
  currentUser?: NotificationUserIdentity | null
): boolean {
  if (!notification) return false;

  const recipientId = (
    notification.recipientId ||
    (typeof notification.data?.recipientId === 'string' ? notification.data.recipientId : '')
  ).trim();
  const recipientName = (
    notification.recipientName ||
    (typeof notification.data?.recipientName === 'string' ? notification.data.recipientName : '')
  ).trim();
  const recipientUsername = (
    notification.recipientUsername ||
    (typeof notification.data?.recipientUsername === 'string' ? notification.data.recipientUsername : '')
  ).trim();

  if (!recipientId && !recipientName && !recipientUsername) {
    return false;
  }

  if (!currentUser) return true;

  return !doUserIdentitiesMatch(
    { id: recipientId, name: recipientName, username: recipientUsername },
    currentUser
  );
}

export function isSameSenderAndRecipient(
  notification: Partial<AppNotification> | null | undefined
): boolean {
  if (!notification) return false;

  const recipientId = (
    notification.recipientId ||
    (typeof notification.data?.recipientId === 'string' ? notification.data.recipientId : '')
  ).trim();
  const recipientName = (
    notification.recipientName ||
    (typeof notification.data?.recipientName === 'string' ? notification.data.recipientName : '')
  ).trim();
  const recipientUsername = (
    notification.recipientUsername ||
    (typeof notification.data?.recipientUsername === 'string' ? notification.data.recipientUsername : '')
  ).trim();

  if (!recipientId && !recipientName && !recipientUsername) {
    return false;
  }

  const senderIdentity: NotificationUserIdentity = {
    id: notification.senderId || (typeof notification.data?.senderId === 'string' ? notification.data.senderId : ''),
    name: notification.senderName || (typeof notification.data?.senderName === 'string' ? notification.data.senderName : ''),
    username: notification.senderUsername || (typeof notification.data?.senderUsername === 'string' ? notification.data.senderUsername : '')
  };

  if (!senderIdentity.id && !senderIdentity.name && !senderIdentity.username) {
    return false;
  }

  return doUserIdentitiesMatch(senderIdentity, {
    id: recipientId,
    name: recipientName,
    username: recipientUsername
  });
}

export function isDisallowedBrandCommissionNotification(
  notification: Partial<AppNotification> | null | undefined
): boolean {
  if (!notification) return false;
  if (notification.id === 'notif-comis-1') return true;
  const titleNorm = normalizeIdentityText(notification.title);
  const msgNorm = normalizeIdentityText(notification.message);
  if (
    msgNorm.includes('patrocinio oficial de balenciaga') ||
    msgNorm.includes('patrocinar a marcas') ||
    (notification.category === 'comisiones' && msgNorm.includes('balenciaga'))
  ) {
    return true;
  }
  if (titleNorm.includes('comision acreditada: 75.00') && msgNorm.includes('patrocinio oficial')) {
    return true;
  }
  return false;
}

const STORAGE_KEY = 'coll_notifications';

export function pushAppNotification(notification: AppNotification): void {
  try {
    if (
      isDisallowedBrandCommissionNotification(notification) ||
      isSameSenderAndRecipient(notification)
    ) {
      return;
    }

    const hasExplicitRecipient = Boolean(
      notification.recipientId ||
      notification.recipientName ||
      notification.recipientUsername ||
      notification.data?.recipientId ||
      notification.data?.recipientName ||
      notification.data?.recipientUsername
    );

    if (!hasExplicitRecipient) {
      const rawUser = localStorage.getItem('coll_userProfile');
      const currentUser = rawUser ? JSON.parse(rawUser) : null;
      if (isSelfSenderNotification(notification, currentUser)) {
        return;
      }
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    let existing: AppNotification[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        existing = parsed;
      }
    } else {
      existing = INITIAL_NOTIFICATIONS;
    }

    const isUpsert = Boolean(notification.upsert);
    const alreadyExists = existing.some(n => n.id === notification.id);
    if (alreadyExists && !isUpsert) {
      return;
    }

    const { upsert: _omitUpsert, ...cleanInput } = notification;
    const nextNotif: AppNotification = {
      ...cleanInput,
      id: cleanInput.id || `notif-${Date.now()}`,
      timestamp: cleanInput.timestamp || Date.now(),
      read: Boolean(cleanInput.read)
    };

    const updatedList = alreadyExists
      ? existing.map(n => (n.id === nextNotif.id ? { ...n, ...nextNotif } : n))
      : [nextNotif, ...existing];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new CustomEvent('add-app-notification', { detail: { ...nextNotif, upsert: isUpsert } }));
  } catch (e) {
    console.error(e);
  }
}

export function removeAppNotificationsByPrefix(prefix: string): void {
  try {
    if (!prefix) return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const filtered = parsed.filter((n: AppNotification) => !(typeof n?.id === 'string' && n.id.startsWith(prefix)));
        if (filtered.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        }
      }
    }
    window.dispatchEvent(new CustomEvent('remove-app-notifications-prefix', { detail: { prefix } }));
  } catch (e) {
    console.error(e);
  }
}

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
    message: 'Tu proyecto "Milano Vintage Denim" obtuvo la mayor votación de inversores y ha ganado un fondo acumulado de 800.00€.',
    timestamp: Date.now() - 1000 * 60 * 25, // 25 mins ago
    read: false,
    icon: '🏆',
    amount: 800.0,
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
  userProfile?: NotificationUserIdentity | null;
  onNavigateToTab?: (tab: string) => void;
  onOpenRanking?: () => void;
  onOpenFriendsTab?: (subTab: 'friends' | 'pending' | 'sent') => void;
  onUnreadCountChange?: (count: number) => void;
}

const readStoredUserProfile = (): NotificationUserIdentity | null => {
  try {
    const raw = localStorage.getItem('coll_userProfile');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return null;
};

export default function NotificationCenterModal({
  isOpen,
  onClose,
  userProfile,
  onNavigateToTab,
  onOpenRanking,
  onOpenFriendsTab,
  onUnreadCountChange
}: NotificationCenterModalProps) {
  const [activeUser, setActiveUser] = useState<NotificationUserIdentity | null>(
    () => userProfile || readStoredUserProfile()
  );

  useEffect(() => {
    if (userProfile) {
      setActiveUser(userProfile);
    } else {
      setActiveUser(readStoredUserProfile());
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setNotifications(parsed.filter((n: AppNotification) => !isDisallowedBrandCommissionNotification(n)));
        }
      }
    } catch {}
  }, [userProfile, isOpen]);

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((n: AppNotification) => !isDisallowedBrandCommissionNotification(n));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeCategory, setActiveCategory] = useState<NotificationCategory>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  const visibleNotifications = useMemo(() => {
    return notifications.filter(
      n =>
        !isSelfSenderNotification(n, activeUser) &&
        !isNotificationForDifferentRecipient(n, activeUser) &&
        !isDisallowedBrandCommissionNotification(n)
    );
  }, [notifications, activeUser]);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (!categoriesScrollRef.current) return;
    categoriesScrollRef.current.scrollBy({
      left: direction === 'left' ? -220 : 220,
      behavior: 'smooth'
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to local storage and propagate filtered unread count
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
    const unread = visibleNotifications.filter(n => !n.read).length;
    if (onUnreadCountChange) {
      onUnreadCountChange(unread);
    }
  }, [notifications, visibleNotifications, onUnreadCountChange]);

  // Listen for storage, custom notifications, user profile changes, or friend request synchronization events
  useEffect(() => {
    const handleAddNotification = (event: Event) => {
      const customEvent = event as CustomEvent<AppNotification>;
      if (customEvent.detail) {
        if (
          isDisallowedBrandCommissionNotification(customEvent.detail) ||
          isSameSenderAndRecipient(customEvent.detail)
        ) {
          return;
        }
        const hasExplicitRecipient = Boolean(
          customEvent.detail.recipientId ||
          customEvent.detail.recipientName ||
          customEvent.detail.recipientUsername ||
          customEvent.detail.data?.recipientId ||
          customEvent.detail.data?.recipientName ||
          customEvent.detail.data?.recipientUsername
        );
        if (!hasExplicitRecipient) {
          const currentIdentity = userProfile || readStoredUserProfile();
          if (isSelfSenderNotification(customEvent.detail, currentIdentity)) {
            return;
          }
        }
        const nextId = customEvent.detail.id || `notif-${Date.now()}`;
        const isUpsert = Boolean(customEvent.detail.upsert);
        const { upsert: _omitUpsert, ...cleanDetail } = customEvent.detail;
        setNotifications(prev => {
          const exists = prev.some(n => n.id === nextId);
          if (exists && !isUpsert) {
            return prev;
          }
          const normalizedNotif: AppNotification = {
            ...cleanDetail,
            id: nextId,
            timestamp: cleanDetail.timestamp || Date.now(),
            read: Boolean(cleanDetail.read)
          };
          if (exists) {
            return prev.map(n => (n.id === nextId ? { ...n, ...normalizedNotif } : n));
          }
          return [normalizedNotif, ...prev];
        });
      }
    };

    const handleRemoveByPrefix = (event: Event) => {
      const customEvent = event as CustomEvent<{ prefix?: string }>;
      const prefix = customEvent.detail?.prefix;
      if (!prefix) return;
      setNotifications(prev => prev.filter(n => !(typeof n.id === 'string' && n.id.startsWith(prefix))));
    };

    const handleUserProfileUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<NotificationUserIdentity>;
      if (customEvent.detail) {
        setActiveUser(customEvent.detail);
      } else {
        setActiveUser(readStoredUserProfile());
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
      if (e.key === STORAGE_KEY || !e.key) {
        try {
          const raw = e.newValue ?? localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setNotifications(parsed);
          }
        } catch {}
      }
      if (e.key === 'coll_userProfile' || !e.key) {
        setActiveUser(readStoredUserProfile());
      }
      if (e.key === 'ff_pending_received_requests') {
        handleSyncFriends();
      }
    };

    window.addEventListener('add-app-notification', handleAddNotification);
    window.addEventListener('remove-app-notifications-prefix', handleRemoveByPrefix);
    window.addEventListener('user-profile-updated', handleUserProfileUpdated);
    window.addEventListener('sync-friend-requests', handleSyncFriends);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('add-app-notification', handleAddNotification);
      window.removeEventListener('remove-app-notifications-prefix', handleRemoveByPrefix);
      window.removeEventListener('user-profile-updated', handleUserProfileUpdated);
      window.removeEventListener('sync-friend-requests', handleSyncFriends);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userProfile]);

  const unreadCount = useMemo(() => {
    return visibleNotifications.filter(n => !n.read).length;
  }, [visibleNotifications]);

  const filteredNotifications = useMemo(() => {
    if (activeCategory === 'all') return visibleNotifications;
    return visibleNotifications.filter(n => n.category === activeCategory);
  }, [visibleNotifications, activeCategory]);

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

      // 3. Actualizar estado de amistad persistido para el perfil del destinatario
      const senderKey = normalizeIdentityText(item.senderUsername || item.friendData.username);
      const targetId = (item.recipientId || activeUser?.id || '').trim();
      if (senderKey && targetId) {
        localStorage.setItem(`friend_status_${senderKey}_${targetId}`, 'friends');
      }
      if (targetId) {
        localStorage.setItem(`friend_status_${targetId}`, 'friends');
      }

      // 4. Eliminar de solicitudes enviadas pendientes
      const savedSent = localStorage.getItem('ff_sent_friend_requests');
      if (savedSent) {
        const sentList = JSON.parse(savedSent);
        if (Array.isArray(sentList)) {
          const recipientKey = normalizeIdentityText(item.recipientUsername || activeUser?.username);
          const filteredSent = sentList.filter(
            (s: any) => s.friendRequestId !== item.friendRequestId && normalizeIdentityText(s.username) !== recipientKey
          );
          localStorage.setItem('ff_sent_friend_requests', JSON.stringify(filteredSent));
        }
      }
    } catch (_) {}

    // 5. Actualizar la notificación en el estado local
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

    // 6. Enviar notificación de aceptación al remitente original
    const senderUsername = (item.senderUsername || item.friendData.username || '').replace(/^@+/, '');
    if (senderUsername && activeUser?.name) {
      const accepterKey = normalizeIdentityText(activeUser.username || activeUser.id || 'user');
      pushAppNotification({
        id: `notif-friend-acc-${accepterKey}-to-${normalizeIdentityText(senderUsername)}`,
        upsert: true,
        category: 'amigos',
        title: `🎉 ¡${activeUser.name} ha aceptado tu solicitud de amistad!`,
        message: `${activeUser.name}${activeUser.username ? ` (@${activeUser.username.replace(/^@+/, '')})` : ''} ha aceptado tu solicitud de amistad. Ahora sois amigos y podéis intercambiar mensajes y colaborar.`,
        timestamp: Date.now(),
        read: false,
        icon: '🎉',
        senderId: activeUser.id,
        senderName: activeUser.name,
        senderUsername: activeUser.username,
        recipientId: item.senderId,
        recipientName: item.senderName || item.friendData.name,
        recipientUsername: senderUsername,
        friendRequestType: 'accepted',
        actionLabel: 'Ver en Amigos'
      });
    }

    showToast(`¡Solicitud aceptada! Ahora ${item.friendData.name} y tú sois amigos.`);

    // 7. Notificar a ModelFacebookProfile y demás componentes
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

      const senderKey = normalizeIdentityText(item.senderUsername || item.friendData.username);
      const targetId = (item.recipientId || activeUser?.id || '').trim();
      if (senderKey && targetId) {
        localStorage.setItem(`friend_status_${senderKey}_${targetId}`, 'none');
      }
      if (targetId) {
        localStorage.setItem(`friend_status_${targetId}`, 'none');
      }

      const savedSent = localStorage.getItem('ff_sent_friend_requests');
      if (savedSent) {
        const sentList = JSON.parse(savedSent);
        if (Array.isArray(sentList)) {
          const recipientKey = normalizeIdentityText(item.recipientUsername || activeUser?.username);
          const filteredSent = sentList.filter(
            (s: any) => s.friendRequestId !== item.friendRequestId && normalizeIdentityText(s.username) !== recipientKey
          );
          localStorage.setItem('ff_sent_friend_requests', JSON.stringify(filteredSent));
        }
      }
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

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/45 backdrop-blur-xs animate-fade-in">
      {/* Backdrop overlay dismiss */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      {/* Main Container Centered */}
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#f9a8d4]/80 overflow-hidden flex flex-col max-h-[88vh] animate-scale-up my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Floating Toast inside modal */}
        {toastMessage && (
          <div className="bg-slate-900 text-white text-xs font-bold px-4 py-2 text-center border-b border-slate-800 flex items-center justify-center gap-2 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header — Rosa Perla */}
        <div className="p-4 sm:p-5 border-b border-[#f9a8d4]/80 bg-gradient-to-tr from-[#fdf2f8] via-[#fce7f3] to-[#fbcfe8] text-[#831843] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/85 border border-[#f9a8d4] flex items-center justify-center text-[#be185d] shadow-xs shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-base sm:text-lg tracking-wide text-[#831843]">
                  Notificaciones
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-[#fe2c55] text-white animate-pulse shadow-2xs">
                    {unreadCount} nuevas
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#9d174d]/85 font-sans font-semibold">
                Amigos, Rondas, Comisiones, Regalos, Admins, Redes y Mensajes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="custom-bg px-2.5 py-1.5 rounded-xl bg-white/85 hover:bg-white border border-[#f9a8d4] text-[#831843] text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                title="Marcar todas como leídas"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Leer todas</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="custom-bg w-8 h-8 rounded-full bg-white/85 hover:bg-white border border-[#f9a8d4] text-[#831843] flex items-center justify-center transition cursor-pointer shadow-2xs"
              title="Cerrar notificaciones"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories Slider Bar with Left / Right Arrows */}
        <div className="bg-gradient-to-r from-[#fff8fb] via-slate-50 to-[#fff8fb] border-b border-[#f9a8d4]/50 px-2.5 sm:px-3.5 py-3 flex items-center gap-2">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scrollCategories('left')}
            aria-label="Desplazar categorías a la izquierda"
            className="custom-bg w-9 h-9 rounded-full bg-white hover:bg-[#fdf2f8] border border-[#f9a8d4] text-[#831843] flex items-center justify-center shadow-xs cursor-pointer transition hover:scale-105 active:scale-95 shrink-0"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Scrollable Filter Buttons Container */}
          <div
            ref={categoriesScrollRef}
            className="flex-1 overflow-x-auto no-scrollbar scrollbar-none scroll-smooth flex items-center gap-2.5 py-0.5 px-1"
          >
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`custom-bg px-4 py-2.5 rounded-2xl text-[13px] sm:text-sm font-extrabold transition whitespace-nowrap cursor-pointer shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-sm border border-slate-900'
                  : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200 shadow-2xs'
              }`}
            >
              Todas ({visibleNotifications.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('amigos')}
              className={`custom-bg px-4 py-2.5 rounded-2xl text-[13px] sm:text-sm font-extrabold transition whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
                activeCategory === 'amigos'
                  ? 'bg-[#fe2c55] text-white shadow-sm border border-[#fe2c55]'
                  : 'bg-white text-slate-800 hover:bg-rose-50/70 border border-slate-200 shadow-2xs'
              }`}
            >
              <span className="text-base leading-none">👥</span>
              <span>Amigos</span>
              {visibleNotifications.filter(n => n.category === 'amigos' && !n.read).length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeCategory === 'amigos' ? 'bg-white text-[#fe2c55]' : 'bg-[#fe2c55] text-white'
                }`}>
                  {visibleNotifications.filter(n => n.category === 'amigos' && !n.read).length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('rondas')}
              className={`custom-bg px-4 py-2.5 rounded-2xl text-[13px] sm:text-sm font-extrabold transition whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
                activeCategory === 'rondas'
                  ? 'bg-amber-600 text-white shadow-sm border border-amber-600'
                  : 'bg-white text-slate-800 hover:bg-amber-50/70 border border-slate-200 shadow-2xs'
              }`}
            >
              <span className="text-base leading-none">🏆</span>
              <span>Rondas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('comisiones')}
              className={`custom-bg px-4 py-2.5 rounded-2xl text-[13px] sm:text-sm font-extrabold transition whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
                activeCategory === 'comisiones'
                  ? 'bg-emerald-600 text-white shadow-sm border border-emerald-600'
                  : 'bg-white text-slate-800 hover:bg-emerald-50/70 border border-slate-200 shadow-2xs'
              }`}
            >
              <span className="text-base leading-none">💶</span>
              <span>Comisiones</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('regalos')}
              className={`custom-bg px-4 py-2.5 rounded-2xl text-[13px] sm:text-sm font-extrabold transition whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
                activeCategory === 'regalos'
                  ? 'bg-[#e11d48] text-white shadow-sm border border-[#e11d48]'
                  : 'bg-white text-slate-800 hover:bg-rose-50/70 border border-slate-200 shadow-2xs'
              }`}
            >
              <span className="text-base leading-none">🎁</span>
              <span>Regalos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('administradores')}
              className={`custom-bg px-4 py-2.5 rounded-2xl text-[13px] sm:text-sm font-extrabold transition whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
                activeCategory === 'administradores'
                  ? 'bg-purple-700 text-white shadow-sm border border-purple-700'
                  : 'bg-white text-slate-800 hover:bg-purple-50/70 border border-slate-200 shadow-2xs'
              }`}
            >
              <span className="text-base leading-none">🛡️</span>
              <span>Admins</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('comentarios')}
              className={`custom-bg px-4 py-2.5 rounded-2xl text-[13px] sm:text-sm font-extrabold transition whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
                activeCategory === 'comentarios'
                  ? 'bg-sky-600 text-white shadow-sm border border-sky-600'
                  : 'bg-white text-slate-800 hover:bg-sky-50/70 border border-slate-200 shadow-2xs'
              }`}
            >
              <span className="text-base leading-none">💬</span>
              <span>Redes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory('mensajes')}
              className={`custom-bg px-4 py-2.5 rounded-2xl text-[13px] sm:text-sm font-extrabold transition whitespace-nowrap flex items-center gap-2 cursor-pointer shrink-0 ${
                activeCategory === 'mensajes'
                  ? 'bg-indigo-600 text-white shadow-sm border border-indigo-600'
                  : 'bg-white text-slate-800 hover:bg-indigo-50/70 border border-slate-200 shadow-2xs'
              }`}
            >
              <span className="text-base leading-none">✉️</span>
              <span>Mensajes</span>
            </button>
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scrollCategories('right')}
            aria-label="Desplazar categorías a la derecha"
            className="custom-bg w-9 h-9 rounded-full bg-white hover:bg-[#fdf2f8] border border-[#f9a8d4] text-[#831843] flex items-center justify-center shadow-xs cursor-pointer transition hover:scale-105 active:scale-95 shrink-0"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
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
        {visibleNotifications.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>{visibleNotifications.length} notificaciones registradas</span>
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
    </div>,
    document.body
  );
}
