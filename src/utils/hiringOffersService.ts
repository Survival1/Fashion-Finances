export type HiringOfferStatus = 'pendiente' | 'aceptada' | 'rechazada' | 'contraoferta';

export interface HiringOfferReply {
  id: string;
  authorName: string;
  authorUsername?: string;
  authorRole: 'model' | 'sender';
  text: string;
  counterAmount?: number;
  statusTag?: string;
  createdAt: string;
}

export interface HiringOffer {
  id: string;
  targetUserId: string;
  targetUsername: string;
  targetName: string;
  senderId: string;
  senderName: string;
  senderUsername?: string;
  senderAvatar: string;
  senderCompany: string;
  senderEmail: string;
  serviceLabel: string;
  serviceBadge?: string;
  offeredAmount: number;
  counterAmount?: number;
  eventDate: string;
  exclusive: boolean;
  details: string;
  logoName?: string;
  status: HiringOfferStatus;
  createdAt: string;
  respondedAt?: string;
  replies: HiringOfferReply[];
}

const STORAGE_KEY = 'ff_hiring_offers';
export const HIRING_OFFERS_EVENT = 'ff-hiring-offers-updated';

export interface HiringUserIdentity {
  id?: string;
  username?: string;
  name?: string;
  role?: string;
}

export const isAdrianaLimaIdentity = (user?: HiringUserIdentity | null): boolean => {
  if (!user || user.role === 'visitor') return false;
  const name = (user.name || '').toLowerCase().trim();
  const username = (user.username || '').toLowerCase().trim().replace(/^@/, '');
  const id = (user.id || '').toLowerCase().trim();
  return (
    name === 'adriana lima' ||
    name.includes('adriana lima') ||
    username === 'adrianalima' ||
    username === 'adrianalima_w1' ||
    id === 'user-investor' ||
    id === 'topf-1' ||
    id === 'model-1' ||
    id === 'friend-1'
  );
};

export const doesOfferTargetUser = (
  offer: HiringOffer,
  target: HiringUserIdentity
): boolean => {
  const tId = (target.id || '').toLowerCase().trim();
  const tUser = (target.username || '').toLowerCase().trim().replace(/^@/, '');
  const oId = (offer.targetUserId || '').toLowerCase().trim();
  const oUser = (offer.targetUsername || '').toLowerCase().trim().replace(/^@/, '');

  if ((tId && oId === tId) || (tUser && oUser === tUser)) {
    return true;
  }

  if (isAdrianaLimaIdentity({ ...target, role: undefined })) {
    return isAdrianaLimaIdentity({
      id: offer.targetUserId,
      username: offer.targetUsername,
      name: offer.targetName,
    });
  }

  return false;
};

export const getHiringOffersFromStorage = (): HiringOffer[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading hiring offers:', e);
  }
  return [];
};

export const saveHiringOffersToStorage = (offers: HiringOffer[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
  } catch (e) {
    console.error('Error saving hiring offers:', e);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(HIRING_OFFERS_EVENT, { detail: offers }));
  }
};

export const addHiringOfferToStorage = (
  offerInput: Omit<HiringOffer, 'id' | 'status' | 'createdAt' | 'replies'>
): HiringOffer => {
  const newOffer: HiringOffer = {
    ...offerInput,
    id: `offer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    status: 'pendiente',
    createdAt: new Date().toISOString(),
    replies: [],
  };

  const current = getHiringOffersFromStorage();
  const next = [newOffer, ...current];
  saveHiringOffersToStorage(next);

  // Sync also into coll_tiktok_shop_leads so CastingLive / direct leads stay consistent
  try {
    const cachedLeadsStr = localStorage.getItem('coll_tiktok_shop_leads');
    const leadsArr = cachedLeadsStr ? JSON.parse(cachedLeadsStr) : [];
    const safeLeads = Array.isArray(leadsArr) ? leadsArr : [];
    safeLeads.unshift({
      id: newOffer.id,
      itemId: 'hiring-portal',
      itemName: newOffer.serviceLabel,
      buyerName: newOffer.senderCompany || newOffer.senderName,
      buyerRole: `${newOffer.senderName}${newOffer.senderUsername ? ` (@${newOffer.senderUsername})` : ''}`,
      buyerAvatar: newOffer.senderAvatar,
      offerType: 'Sponsor',
      offeredAmount: newOffer.offeredAmount,
      message: newOffer.details,
      status: 'pendiente',
      date: 'Hace un momento',
      isDirectProfileOffer: true,
    });
    localStorage.setItem('coll_tiktok_shop_leads', JSON.stringify(safeLeads));
    window.dispatchEvent(new CustomEvent('coll_tiktok_leads_updated'));
  } catch (_) {}

  return newOffer;
};

export const respondToHiringOfferInStorage = (params: {
  offerId: string;
  status: HiringOfferStatus;
  replyText: string;
  authorName: string;
  authorUsername?: string;
  authorRole: 'model' | 'sender';
  counterAmount?: number;
}): HiringOffer[] => {
  const current = getHiringOffersFromStorage();
  const now = new Date().toISOString();

  const statusTagMap: Record<HiringOfferStatus, string> = {
    aceptada: 'Oferta Aceptada',
    rechazada: 'Oferta Rechazada',
    contraoferta: 'Contraoferta / Respuesta',
    pendiente: 'Respuesta',
  };

  const next = current.map((offer) => {
    if (offer.id !== params.offerId) return offer;
    const trimmed = params.replyText.trim();
    const replyEntry: HiringOfferReply | null =
      trimmed || params.counterAmount || params.status !== offer.status
        ? {
            id: `reply-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            authorName: params.authorName,
            authorUsername: params.authorUsername,
            authorRole: params.authorRole,
            text:
              trimmed ||
              (params.status === 'aceptada'
                ? 'He aceptado tu oferta de contratación. Procedemos con los detalles.'
                : params.status === 'rechazada'
                ? 'Gracias por tu propuesta, en esta ocasión no puedo aceptarla.'
                : 'He enviado una respuesta a tu oferta.'),
            counterAmount: params.counterAmount,
            statusTag: statusTagMap[params.status],
            createdAt: now,
          }
        : null;

    return {
      ...offer,
      status: params.status,
      counterAmount: params.counterAmount ?? offer.counterAmount,
      respondedAt: now,
      replies: replyEntry ? [...offer.replies, replyEntry] : offer.replies,
    };
  });

  saveHiringOffersToStorage(next);

  // Reflect status in coll_tiktok_shop_leads if matching lead exists
  try {
    const cachedLeadsStr = localStorage.getItem('coll_tiktok_shop_leads');
    if (cachedLeadsStr) {
      const leadsArr = JSON.parse(cachedLeadsStr);
      if (Array.isArray(leadsArr)) {
        const mappedStatus =
          params.status === 'aceptada'
            ? 'aceptada'
            : params.status === 'rechazada'
            ? 'rechazada'
            : 'pendiente';
        const updatedLeads = leadsArr.map((l: any) =>
          l.id === params.offerId ? { ...l, status: mappedStatus } : l
        );
        localStorage.setItem('coll_tiktok_shop_leads', JSON.stringify(updatedLeads));
        window.dispatchEvent(new CustomEvent('coll_tiktok_leads_updated'));
      }
    }
  } catch (_) {}

  return next;
};
