import React, { useState, useEffect } from 'react';
import RoyalMaleCrown from './RoyalMaleCrown';
import RoyalFemaleCrown from './RoyalFemaleCrown';
import { 
  Crown, 
  Sparkles, 
  Gift, 
  DollarSign, 
  Send, 
  Heart, 
  Star, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink,
  Flame,
  Coins,
  Wallet,
  Globe,
  Users,
  TrendingUp,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ModelProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  totalLikes?: number;
  followersCount?: number;
  referidosCount?: number;
  gender?: 'female' | 'male';
  socials?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  photos?: string[];
  selectedWinnerPhotos?: string[];
}

interface Top1ModelDonationCardProps {
  models: ModelProfile[];
  userProfile?: {
    id: string;
    name: string;
    patrocinadorId?: string;
    balance: number;
  };
  onSelectModel?: (model: ModelProfile) => void;
  onNavigateToTab?: (tabId: string, storeId?: string) => void;
}

interface ChannelGiftItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  category: 'basico' | 'intermedio' | 'lujo';
  isExclusive?: boolean;
}

const CHANNEL_EXTRA_GIFTS: ChannelGiftItem[] = [
  { id: 'g-1', name: 'Certificado prof.', price: 500, icon: '📜', category: 'intermedio' },
  { id: 'g-2', name: 'Una estrella', price: 50, icon: '⭐', category: 'basico' },
  { id: 'g-3', name: 'Varias estrellas', price: 100, icon: '🌟', category: 'basico' },
  { id: 'g-4', name: 'Billetes dólares', price: 300, icon: '💵', category: 'intermedio' },
  { id: 'g-5', name: 'Reloj de oro', price: 5000, icon: '⌚', category: 'lujo', isExclusive: true },
  { id: 'g-6', name: 'Pulsera brillante', price: 800, icon: '💫', category: 'intermedio' },
  { id: 'g-7', name: 'Token exclusivo', price: 1000, icon: '🪙', category: 'intermedio' },
  { id: 'g-8', name: 'Rosa roja', price: 10, icon: '🌹', category: 'basico' },
  { id: 'g-9', name: 'Beso', price: 5, icon: '💋', category: 'basico' },
  { id: 'g-10', name: 'Besos', price: 15, icon: '😘', category: 'basico' },
  { id: 'g-11', name: 'Te adoro', price: 5, icon: '🥰', category: 'basico' },
  { id: 'g-12', name: 'Osito cariñoso', price: 1, icon: '🧸', category: 'basico' },
  { id: 'g-13', name: 'Corazón con lazo', price: 5, icon: '💝', category: 'basico' },
  { id: 'g-14', name: 'Rosa blanca', price: 10, icon: '🤍', category: 'basico' },
  { id: 'g-15', name: 'Corona Real', price: 10000, icon: '👑', category: 'lujo', isExclusive: true },
  { id: 'g-16', name: 'Bolso Haute Couture', price: 3000, icon: '👜', category: 'lujo' },
  { id: 'g-17', name: 'Diamante Real', price: 15000, icon: '💎', category: 'lujo', isExclusive: true },
  { id: 'g-18', name: 'Coche deportivo', price: 50000, icon: '🚗', category: 'lujo', isExclusive: true }
];

export default function Top1ModelDonationCard({
  models = [],
  userProfile,
  onSelectModel,
  onNavigateToTab
}: Top1ModelDonationCardProps) {
  // State for the dynamically detected #1 ranked model
  const [top1Model, setTop1Model] = useState<ModelProfile | null>(null);

  // Synchronized profile state for immediate balance and back-office reactive feedback
  const [currentInvestorProfile, setCurrentInvestorProfile] = useState<any>(() => {
    try {
      const rawUser = localStorage.getItem('coll_userProfile');
      if (rawUser) return JSON.parse(rawUser);
    } catch (e) {}
    return userProfile || { id: 'user-investor', name: 'Ernesto vs', username: 'ernestovs', balance: 1500, totalInvested: 0 };
  });

  useEffect(() => {
    const handleProfileSync = () => {
      try {
        const rawUser = localStorage.getItem('coll_userProfile');
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          if (parsed) setCurrentInvestorProfile(parsed);
        }
      } catch (e) {}
    };

    window.addEventListener('user-profile-updated', handleProfileSync);
    window.addEventListener('wallet-updated', handleProfileSync);
    window.addEventListener('storage', handleProfileSync);

    return () => {
      window.removeEventListener('user-profile-updated', handleProfileSync);
      window.removeEventListener('wallet-updated', handleProfileSync);
      window.removeEventListener('storage', handleProfileSync);
    };
  }, []);

  // Top 1 published video or cover video
  const [top1Video, setTop1Video] = useState<string>(() => {
    try {
      return (
        localStorage.getItem('vs_ranking_podium_video_1') ||
        localStorage.getItem('custom_model_video_adrianalima') ||
        localStorage.getItem('custom_model_video_adrianalima_w1') ||
        localStorage.getItem('custom_model_video_topf-1') ||
        localStorage.getItem('coll_custom_ranking_video_female') ||
        localStorage.getItem('coll_custom_ranking_video') ||
        localStorage.getItem('landing_page_cover_video_url') ||
        ''
      );
    } catch (_) {
      return '';
    }
  });

  useEffect(() => {
    const handleVideoSync = () => {
      try {
        const v = 
          localStorage.getItem('vs_ranking_podium_video_1') ||
          localStorage.getItem('custom_model_video_adrianalima') ||
          localStorage.getItem('custom_model_video_adrianalima_w1') ||
          localStorage.getItem('custom_model_video_topf-1') ||
          localStorage.getItem('coll_custom_ranking_video_female') ||
          localStorage.getItem('coll_custom_ranking_video') ||
          localStorage.getItem('landing_page_cover_video_url') ||
          '';
        if (v) setTop1Video(v);
      } catch (_) {}
    };

    window.addEventListener('ranking_videos_updated', handleVideoSync);
    window.addEventListener('storage', handleVideoSync);
    return () => {
      window.removeEventListener('ranking_videos_updated', handleVideoSync);
      window.removeEventListener('storage', handleVideoSync);
    };
  }, []);

  // Active donation mode tab
  const [donationMode, setDonationMode] = useState<'economic' | 'gifts'>('economic');

  // Economic donation inputs
  const [customEuroAmount, setCustomEuroAmount] = useState<number | string>(25);
  const [donationMessage, setDonationMessage] = useState<string>('');

  // Channel gifts inputs
  const [giftCategory, setGiftCategory] = useState<'todos' | 'basico' | 'intermedio' | 'lujo'>('todos');
  const [selectedGift, setSelectedGift] = useState<ChannelGiftItem>(CHANNEL_EXTRA_GIFTS[7]); // Rosa roja default
  const [giftMessage, setGiftMessage] = useState<string>('');

  // Toast / Confirmation feedback
  const [feedbackToast, setFeedbackToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    icon: string;
  } | null>(null);

  // Function to detect and resolve the true #1 model in the ranking
  const detectTop1Model = () => {
    try {
      // 1. Try to read from top 100 ranking cache
      const rawCache = localStorage.getItem('coll_top_100_ranking');
      if (rawCache) {
        const parsed = JSON.parse(rawCache);
        if (parsed && Array.isArray(parsed.females) && parsed.females.length > 0) {
          const sortedFemales = [...parsed.females].sort((a, b) => (b.totalLikes || 0) - (a.totalLikes || 0));
          const leader = sortedFemales[0];
          if (leader) {
            setTop1Model(leader);
            return;
          }
        }
      }
    } catch (e) {}

    // 2. Fallback: check models passed in props
    if (models && models.length > 0) {
      const sorted = [...models].sort((a, b) => (b.totalLikes || 0) - (a.totalLikes || 0));
      setTop1Model(sorted[0]);
    }
  };

  // Sync on mount, on props change, and listen for ranking updates
  useEffect(() => {
    detectTop1Model();

    const handleRankingUpdate = () => {
      detectTop1Model();
    };

    window.addEventListener('storage', handleRankingUpdate);
    window.addEventListener('ranking-updated', handleRankingUpdate);
    window.addEventListener('coll_top_100_ranking', handleRankingUpdate);
    window.addEventListener('models-updated', handleRankingUpdate);

    // Continuous polling check every 1.5s to ensure instant reactivity if another model becomes #1
    const interval = setInterval(detectTop1Model, 1500);

    return () => {
      window.removeEventListener('storage', handleRankingUpdate);
      window.removeEventListener('ranking-updated', handleRankingUpdate);
      window.removeEventListener('coll_top_100_ranking', handleRankingUpdate);
      window.removeEventListener('models-updated', handleRankingUpdate);
      clearInterval(interval);
    };
  }, [models]);

  if (!top1Model) return null;

  // Format model display name and first name for arch tag
  const modelFullName = top1Model.name || 'Adriana Lima';
  const modelFirstName = modelFullName.split(' ')[0];
  const modelHandle = top1Model.username ? `@${top1Model.username.replace('@', '')}` : `@${modelFullName.toLowerCase().replace(/\s+/g, '')}_w1`;
  const votesCount = (top1Model.totalLikes || 14972).toLocaleString('es-ES');

  // Helper for quick euro preset buttons
  const euroPresets = [5, 10, 25, 50, 100, 250];

  // Filtered gifts list
  const filteredGifts = CHANNEL_EXTRA_GIFTS.filter(g => {
    if (giftCategory === 'todos') return true;
    return g.category === giftCategory;
  });

  // Handle Economic Donation (€)
  const handleSendEconomicDonation = () => {
    const amount = typeof customEuroAmount === 'string' ? parseFloat(customEuroAmount) : customEuroAmount;
    if (isNaN(amount) || amount <= 0) {
      alert('Por favor, introduce un importe de donación válido.');
      return;
    }

    // Check user balance if profile exists
    const currentBalance = currentInvestorProfile?.balance ?? (userProfile?.balance || 1500);
    if (currentBalance < amount) {
      alert(`⚠️ Saldo insuficiente (${currentBalance.toFixed(2)}€). Por favor recarga fondos para completar la donación de ${amount.toFixed(2)}€.`);
      return;
    }

    let updatedUser: any = null;
    let updatedMovements: any[] = [];
    let updatedSentGifts: any[] = [];
    let updatedReceivedGifts: any[] = [];

    // 1. Deduct from balance
    try {
      const rawUser = localStorage.getItem('coll_userProfile');
      const user = rawUser ? JSON.parse(rawUser) : (userProfile || { id: 'user-investor', name: 'Ernesto vs', username: 'ernestovs', balance: 1500, totalInvested: 0 });
      user.balance = Math.max(0, Number(((user.balance || 0) - amount).toFixed(2)));
      user.totalInvested = Number(((user.totalInvested || 0) + amount).toFixed(2));
      localStorage.setItem('coll_userProfile', JSON.stringify(user));
      updatedUser = user;
      setCurrentInvestorProfile(user);

      // 2. Register in movements
      const rawMovements = localStorage.getItem('coll_movements');
      const movements = rawMovements ? JSON.parse(rawMovements) : [];
      movements.unshift({
        id: `mov-don-${Date.now()}`,
        userId: user?.id || 'user-investor',
        type: 'investment',
        amount: -amount,
        date: new Date().toISOString(),
        description: `Donación directa de apoyo a ${modelFullName} (Ranking #1 - Modelo Diamante)`
      });
      localStorage.setItem('coll_movements', JSON.stringify(movements));
      updatedMovements = movements;

      // 3. Register in sent gifts / donations storage
      const rawSentGifts = localStorage.getItem('ff_sent_gifts_v3');
      const sentGifts = rawSentGifts ? JSON.parse(rawSentGifts) : [];
      const sentItem = {
        id: `don-${Date.now()}`,
        senderName: user?.name || 'Ernesto vs',
        senderUsername: user?.username || 'ernestovs',
        senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        receiverName: modelFullName,
        receiverUsername: top1Model.username || 'adrianalima_w1',
        giftName: `Donación de ${amount.toFixed(2)}€`,
        giftIcon: '💶',
        price: amount,
        euroCost: amount,
        message: donationMessage.trim() || `¡Gran pasarela! Te envío mi donación para impulsar tu posición como número 1 en el ranking ✨`,
        dateFormatted: 'Ahora mismo',
        timestamp: Date.now(),
        status: 'confirmed',
        category: 'intermedio'
      };
      sentGifts.unshift(sentItem);
      localStorage.setItem('ff_sent_gifts_v3', JSON.stringify(sentGifts));
      updatedSentGifts = sentGifts;

      // 4. Register in received gifts for the recipient model
      const rawReceivedGifts = localStorage.getItem('ff_received_gifts_v3');
      const receivedGifts = rawReceivedGifts ? JSON.parse(rawReceivedGifts) : [];
      const receivedItem = {
        id: `rec-don-${Date.now()}`,
        senderName: user?.name || 'Ernesto vs',
        senderUsername: user?.username || 'ernestovs',
        senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        receiverName: modelFullName,
        receiverUsername: top1Model.username || 'adrianalima_w1',
        receiverAvatar: top1Model.avatar || (top1Model as any).photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
        giftName: `Donación de ${amount.toFixed(2)}€`,
        giftIcon: '💶',
        price: amount,
        euroCost: amount,
        message: donationMessage.trim() || `¡Donación recibida para impulsar tu carrera! ✨`,
        dateFormatted: 'Ahora mismo',
        timestamp: Date.now(),
        status: 'delivered',
        category: 'intermedio'
      };
      receivedGifts.unshift(receivedItem);
      localStorage.setItem('ff_received_gifts_v3', JSON.stringify(receivedGifts));
      updatedReceivedGifts = receivedGifts;

      // 5. Update recipient model earnings in coll_models and coll_top_100_ranking
      const rawModels = localStorage.getItem('coll_models');
      if (rawModels) {
        const modelsList = JSON.parse(rawModels);
        if (Array.isArray(modelsList)) {
          const mIdx = modelsList.findIndex((m: any) => m.id === top1Model.id || m.name === top1Model.name);
          if (mIdx !== -1) {
            modelsList[mIdx].totalEarnings = Number(((modelsList[mIdx].totalEarnings || 0) + amount).toFixed(2));
            modelsList[mIdx].earnings = Number(((modelsList[mIdx].earnings || 0) + amount).toFixed(2));
            modelsList[mIdx].donationsReceived = (modelsList[mIdx].donationsReceived || 0) + 1;
            localStorage.setItem('coll_models', JSON.stringify(modelsList));
          }
        }
      }
      const rawRanking = localStorage.getItem('coll_top_100_ranking');
      if (rawRanking) {
        const ranking = JSON.parse(rawRanking);
        if (ranking && Array.isArray(ranking.females)) {
          const fIdx = ranking.females.findIndex((f: any) => f.id === top1Model.id || f.name === top1Model.name);
          if (fIdx !== -1) {
            ranking.females[fIdx].totalEarnings = Number(((ranking.females[fIdx].totalEarnings || 0) + amount).toFixed(2));
            ranking.females[fIdx].earnings = Number(((ranking.females[fIdx].earnings || 0) + amount).toFixed(2));
            localStorage.setItem('coll_top_100_ranking', JSON.stringify(ranking));
          }
        }
      }

      // 6. Add notification for the model
      const rawNotifs = localStorage.getItem('coll_notifications');
      const notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
      notifs.unshift({
        id: `notif-${Date.now()}`,
        type: 'donation',
        title: `¡Has recibido una donación de ${user?.name || 'Ernesto vs'}!`,
        message: `${user?.name || 'Ernesto vs'} te ha donado ${amount.toFixed(2)}€.`,
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        timestamp: Date.now(),
        read: false,
        data: { amount }
      });
      localStorage.setItem('coll_notifications', JSON.stringify(notifs));
    } catch (e) {
      console.error(e);
    }

    // 7. Dispatch events across entire application
    if (updatedUser) {
      window.dispatchEvent(new CustomEvent('user-profile-updated', { detail: updatedUser }));
      window.dispatchEvent(new CustomEvent('wallet-updated', { detail: { newBalance: updatedUser.balance } }));
    }
    window.dispatchEvent(new CustomEvent('movements-updated', { detail: updatedMovements }));
    window.dispatchEvent(new CustomEvent('ff-sent-gifts-updated', { detail: updatedSentGifts }));
    window.dispatchEvent(new CustomEvent('ff-received-gifts-updated', { detail: updatedReceivedGifts }));
    window.dispatchEvent(new CustomEvent('models-updated'));
    window.dispatchEvent(new CustomEvent('ranking_videos_updated'));
    window.dispatchEvent(new Event('storage'));

    // 8. Trigger celebratory animation with full detail
    window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
      detail: {
        icon: '💶',
        name: `Donación de ${amount.toFixed(2)}€`,
        cost: amount,
        recipientName: modelFullName,
        senderName: currentInvestorProfile?.name || 'Ernesto vs',
        channelSelector: '#top-1-ranking-model-container'
      }
    }));

    // 9. Show toast
    setFeedbackToast({
      show: true,
      title: '¡Donación Enviada con Éxito!',
      message: `Has donado ${amount.toFixed(2)}€ a ${modelFullName}. Deducido de tu saldo y acreditado en la cuenta de ${modelFullName}.`,
      icon: '💶'
    });

    setDonationMessage('');
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4500);
  };

  // Handle Channel Extra Gift Send
  const handleSendChannelGift = () => {
    if (!selectedGift) return;
    const cost = selectedGift.price;

    const currentBalance = currentInvestorProfile?.balance ?? (userProfile?.balance || 1500);
    if (currentBalance < cost) {
      alert(`⚠️ Saldo insuficiente (${currentBalance.toFixed(2)}€) para enviar "${selectedGift.name}" (${cost}€).`);
      return;
    }

    let updatedUser: any = null;
    let updatedMovements: any[] = [];
    let updatedSentGifts: any[] = [];
    let updatedReceivedGifts: any[] = [];

    try {
      // 1. Deduct balance from back office
      const rawUser = localStorage.getItem('coll_userProfile');
      const user = rawUser ? JSON.parse(rawUser) : (userProfile || { id: 'user-investor', name: 'Ernesto vs', username: 'ernestovs', balance: 1500, totalInvested: 0 });
      user.balance = Math.max(0, Number(((user.balance || 0) - cost).toFixed(2)));
      user.totalInvested = Number(((user.totalInvested || 0) + cost).toFixed(2));
      localStorage.setItem('coll_userProfile', JSON.stringify(user));
      updatedUser = user;
      setCurrentInvestorProfile(user);

      // 2. Register movement
      const rawMovements = localStorage.getItem('coll_movements');
      const movements = rawMovements ? JSON.parse(rawMovements) : [];
      movements.unshift({
        id: `mov-gift-${Date.now()}`,
        userId: user?.id || 'user-investor',
        type: 'investment',
        amount: -cost,
        date: new Date().toISOString(),
        description: `Regalo de canal "${selectedGift.name}" enviado a ${modelFullName}`
      });
      localStorage.setItem('coll_movements', JSON.stringify(movements));
      updatedMovements = movements;

      // 3. Register sent gift
      const rawSentGifts = localStorage.getItem('ff_sent_gifts_v3');
      const sentGifts = rawSentGifts ? JSON.parse(rawSentGifts) : [];
      const sentItem = {
        id: `gift-${Date.now()}`,
        senderName: user?.name || 'Ernesto vs',
        senderUsername: user?.username || 'ernestovs',
        senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        receiverName: modelFullName,
        receiverUsername: top1Model.username || 'adrianalima_w1',
        giftName: selectedGift.name,
        giftIcon: selectedGift.icon,
        price: selectedGift.price,
        euroCost: selectedGift.price,
        message: giftMessage.trim() || `Regalo de canal especial entregado a ${modelFullName} por su liderazgo en el ranking 👑`,
        dateFormatted: 'Ahora mismo',
        timestamp: Date.now(),
        status: 'confirmed',
        category: selectedGift.category,
        isExclusive: selectedGift.isExclusive
      };
      sentGifts.unshift(sentItem);
      localStorage.setItem('ff_sent_gifts_v3', JSON.stringify(sentGifts));
      updatedSentGifts = sentGifts;

      // 4. Register in received gifts for the recipient model
      const rawReceivedGifts = localStorage.getItem('ff_received_gifts_v3');
      const receivedGifts = rawReceivedGifts ? JSON.parse(rawReceivedGifts) : [];
      const receivedItem = {
        id: `rec-gift-${Date.now()}`,
        senderName: user?.name || 'Ernesto vs',
        senderUsername: user?.username || 'ernestovs',
        senderAvatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        receiverName: modelFullName,
        receiverUsername: top1Model.username || 'adrianalima_w1',
        receiverAvatar: top1Model.avatar || (top1Model as any).photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
        giftName: selectedGift.name,
        giftIcon: selectedGift.icon,
        price: selectedGift.price,
        euroCost: selectedGift.price,
        message: giftMessage.trim() || `¡Regalo especial "${selectedGift.name}" recibido! 🎉💖`,
        dateFormatted: 'Ahora mismo',
        timestamp: Date.now(),
        status: 'delivered',
        category: selectedGift.category,
        isExclusive: selectedGift.isExclusive
      };
      receivedGifts.unshift(receivedItem);
      localStorage.setItem('ff_received_gifts_v3', JSON.stringify(receivedGifts));
      updatedReceivedGifts = receivedGifts;

      // 5. Update recipient model earnings in coll_models and coll_top_100_ranking
      const rawModels = localStorage.getItem('coll_models');
      if (rawModels) {
        const modelsList = JSON.parse(rawModels);
        if (Array.isArray(modelsList)) {
          const mIdx = modelsList.findIndex((m: any) => m.id === top1Model.id || m.name === top1Model.name);
          if (mIdx !== -1) {
            modelsList[mIdx].totalEarnings = Number(((modelsList[mIdx].totalEarnings || 0) + cost).toFixed(2));
            modelsList[mIdx].earnings = Number(((modelsList[mIdx].earnings || 0) + cost).toFixed(2));
            modelsList[mIdx].donationsReceived = (modelsList[mIdx].donationsReceived || 0) + 1;
            localStorage.setItem('coll_models', JSON.stringify(modelsList));
          }
        }
      }
      const rawRanking = localStorage.getItem('coll_top_100_ranking');
      if (rawRanking) {
        const ranking = JSON.parse(rawRanking);
        if (ranking && Array.isArray(ranking.females)) {
          const fIdx = ranking.females.findIndex((f: any) => f.id === top1Model.id || f.name === top1Model.name);
          if (fIdx !== -1) {
            ranking.females[fIdx].totalEarnings = Number(((ranking.females[fIdx].totalEarnings || 0) + cost).toFixed(2));
            ranking.females[fIdx].earnings = Number(((ranking.females[fIdx].earnings || 0) + cost).toFixed(2));
            localStorage.setItem('coll_top_100_ranking', JSON.stringify(ranking));
          }
        }
      }

      // 6. Add notification for the recipient model
      const rawNotifs = localStorage.getItem('coll_notifications');
      const notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
      notifs.unshift({
        id: `notif-${Date.now()}`,
        type: 'gift',
        title: `¡Has recibido un regalo de ${user?.name || 'Ernesto vs'}!`,
        message: `${user?.name || 'Ernesto vs'} te ha enviado "${selectedGift.name}" (${cost}€). ${giftMessage ? `Mensaje: "${giftMessage}"` : ''}`,
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        timestamp: Date.now(),
        read: false,
        data: { gift: selectedGift, amount: cost }
      });
      localStorage.setItem('coll_notifications', JSON.stringify(notifs));
    } catch (e) {
      console.error(e);
    }

    // 7. Dispatch events across entire application
    if (updatedUser) {
      window.dispatchEvent(new CustomEvent('user-profile-updated', { detail: updatedUser }));
      window.dispatchEvent(new CustomEvent('wallet-updated', { detail: { newBalance: updatedUser.balance } }));
    }
    window.dispatchEvent(new CustomEvent('movements-updated', { detail: updatedMovements }));
    window.dispatchEvent(new CustomEvent('ff-sent-gifts-updated', { detail: updatedSentGifts }));
    window.dispatchEvent(new CustomEvent('ff-received-gifts-updated', { detail: updatedReceivedGifts }));
    window.dispatchEvent(new CustomEvent('models-updated'));
    window.dispatchEvent(new CustomEvent('ranking_videos_updated'));
    window.dispatchEvent(new Event('storage'));

    // 8. Trigger custom gift particle rain and center animated celebration banner
    window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
      detail: {
        icon: selectedGift.icon,
        name: selectedGift.name,
        cost: selectedGift.price,
        recipientName: modelFullName,
        senderName: currentInvestorProfile?.name || 'Ernesto vs',
        channelSelector: '#top-1-ranking-model-container'
      }
    }));

    // 9. Show toast
    setFeedbackToast({
      show: true,
      title: `¡Regalo "${selectedGift.name}" Enviado!`,
      message: `Has enviado ${selectedGift.icon} ${selectedGift.name} (${cost}€) a ${modelFullName}. Deducido de tu saldo y recibido por ${modelFullName}.`,
      icon: selectedGift.icon
    });

    setGiftMessage('');
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4500);
  };

  return (
    <div 
      id="top-1-ranking-model-container" 
      data-channel-container="true"
      className="w-full max-w-full box-border bg-gradient-to-b from-[#fff2f6] via-[#fff9fb] to-[#fff3f7] rounded-[36px] border-2 border-rose-200/90 p-5 sm:p-8 shadow-2xl relative overflow-hidden text-left animate-fade-in space-y-8"
    >
      {/* Luxury Background Silk Drapery & Atmospheric Gold Sparkles Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-200/35 via-rose-100/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* 👑 TOP HEADER: THE ANGELS RANKING (Mirroring the grand style of zz.png) */}
      <div className="text-center space-y-2 relative z-10 w-full animate-fade-in border-b border-rose-200/70 pb-6">
        {/* Brand Subtitle */}
        <span className="text-[10.5px] sm:text-xs font-serif tracking-[0.25em] text-rose-950 font-black uppercase block">
          THE ANGELS
        </span>

        {/* Grand Title with Stylized Golden Angel Wings */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 my-1">
          {/* Left Wing */}
          <span className="text-2xl sm:text-3xl text-amber-500 filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.35)] select-none pointer-events-none transform -scale-x-100">
            🪽
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-900 via-rose-700 to-rose-950 uppercase m-0 leading-none">
            RANKING
          </h2>

          {/* Right Wing */}
          <span className="text-2xl sm:text-3xl text-amber-500 filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.35)] select-none pointer-events-none">
            🪽
          </span>
        </div>

        <p className="text-[10px] sm:text-xs text-rose-900/80 uppercase tracking-[0.2em] font-bold max-w-md mx-auto">
          LA MODELO MÁS ADMIRADA DEL MUNDO EN TIEMPO REAL
        </p>

        {/* Live 60s Update Pill */}
        <div className="pt-1.5 flex justify-center">
          <div className="inline-flex items-center gap-2 bg-white/90 border border-rose-200/80 px-4 py-1 rounded-full text-[9px] sm:text-[10px] font-mono tracking-widest text-rose-800 font-bold uppercase shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>ACTUALIZADO CADA 60 SEGUNDOS</span>
          </div>
        </div>
      </div>

      {/* 🌟 CENTERPIECE: THE #1 MONUMENTAL DIAMOND ANGEL PODIUM & INTERACTION CENTER */}
      <div className="flex flex-col items-center gap-8 relative z-10 w-full max-w-2xl mx-auto">
        
        {/* ========================================================================= */}
        {/* UPPER SECTION: THE #1 PODIUM CARD (MATCHING Z.PNG) */}
        {/* ========================================================================= */}
        <div className="w-full flex flex-col items-center justify-center text-center relative pt-16 sm:pt-20 pb-2">
          
          {/* Main Card Container with Suspended Crown */}
          <div className="relative flex flex-col items-center">
            
            {/* Cyan Ambient Aura behind Crown */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-56 h-28 bg-[#00f0ff]/35 rounded-full blur-2xl pointer-events-none" />

            {/* 1. Opulent Royal Crown atop the Card (matching z.png) */}
            <div 
              style={{ bottom: top1Model?.gender === 'male' ? 'calc(100% - 2px)' : 'calc(100% + 8px)' }}
              className="absolute left-1/2 -translate-x-1/2 z-40 transition-transform duration-500 hover:scale-105 pointer-events-none drop-shadow-[0_12px_28px_rgba(225,29,72,0.35)]"
            >
              {top1Model?.gender === 'male' ? (
                <RoyalMaleCrown 
                  imgClassName="w-36 sm:w-44 md:w-48 h-auto"
                  showSparkles={true}
                />
              ) : (
                <RoyalFemaleCrown 
                  imgClassName="w-36 sm:w-44 md:w-48 h-auto"
                  showSparkles={true}
                />
              )}
            </div>

            {/* 2. Ice-Blue Radiant Metallic Neon Container (matching z.png) */}
            <div 
              onClick={() => onSelectModel && onSelectModel(top1Model)}
              className="w-72 sm:w-80 md:w-[315px] h-[390px] sm:h-[430px] rounded-[34px] overflow-hidden border-[3.5px] border-[#00f0ff] shadow-[0_0_45px_rgba(0,240,255,0.75),0_0_80px_rgba(56,189,248,0.5)] hover:shadow-[0_0_65px_rgba(0,240,255,0.95),0_0_95px_rgba(56,189,248,0.75)] transition-all duration-300 relative z-30 cursor-pointer group bg-slate-950"
              title={`Ver perfil completo de ${modelFullName}`}
            >
              <div className="w-full h-full relative overflow-hidden rounded-[30px] bg-black">
                {/* Media: Video or High-Resolution Portrait Photo */}
                {top1Video ? (
                  <video 
                    key={top1Video}
                    src={top1Video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <img 
                    src={top1Model?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650"}
                    alt={modelFullName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                )}

                {/* Top-left pill: EN LÍNEA from z.png */}
                <div className="absolute top-3.5 left-3.5 z-40 bg-[#fe2c55] text-white font-bold text-[9px] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md uppercase tracking-wider pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs" />
                  <span>EN LÍNEA</span>
                </div>

                {/* Top-right interactive clickable heart button */}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                      detail: {
                        pureEmoji: true,
                        emoji: '💖',
                        icon: '💖',
                        x: e.clientX,
                        y: e.clientY
                      }
                    }));
                  }}
                  className="absolute top-3.5 right-3.5 z-40 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition cursor-pointer border border-white/20 backdrop-blur-xs shadow-md"
                  title="Me gusta"
                >
                  <Heart className="w-4 h-4 fill-white/20 stroke-white" />
                </button>

                {/* Bottom overlay with Adriana Lima ★ and 100.009 votos matching z.png */}
                <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-14 pb-4 px-4 text-center flex flex-col items-center pointer-events-none">
                  <h4 className="text-white font-serif font-black text-base sm:text-lg leading-tight flex items-center justify-center gap-1.5 drop-shadow-md">
                    <span>{modelFullName}</span>
                    <span className="text-amber-400 text-sm">★</span>
                  </h4>
                  <div className="text-white/90 font-medium text-[11px] sm:text-xs flex items-center justify-center gap-1 mt-1 font-mono">
                    <span className="text-[#ec4899]">💖</span> {Number(top1Model?.totalLikes || 100009).toLocaleString('es-ES')} votos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LOWER SECTION: APORTACIÓN ECONÓMICA DIRECTA (DEBAJO DEL DOSSIER) */}
        {/* ========================================================================= */}
        <div className="w-full flex flex-col space-y-5">
          


          {/* 🌟 2. TRIBUTE & SPONSORSHIP ENGINE (DONATIONS & HAUTE COUTURE VIP GIFTS) */}
          <div className="bg-white rounded-3xl border-2 border-rose-200/90 p-5 sm:p-6 shadow-lg space-y-4">
            
            {/* Mode Switcher Tabs */}
            <div className="w-full grid grid-cols-2 gap-1.5 rounded-2xl bg-rose-100/70 p-1.5 border border-rose-200 box-border">
              <button
                type="button"
                onClick={() => setDonationMode('economic')}
                className={`w-full min-w-0 py-2.5 px-2 sm:px-3 rounded-xl font-black text-[11px] sm:text-xs transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer text-center select-none ${
                  donationMode === 'economic'
                    ? 'bg-white text-rose-950 shadow-sm border border-rose-200'
                    : 'text-slate-600 hover:text-slate-900 border border-transparent'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate sm:whitespace-normal">Donación Económica (€)</span>
              </button>

              <button
                type="button"
                onClick={() => setDonationMode('gifts')}
                className={`w-full min-w-0 py-2.5 px-2 sm:px-3 rounded-xl font-black text-[11px] sm:text-xs transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer text-center select-none ${
                  donationMode === 'gifts'
                    ? 'bg-white text-rose-950 shadow-sm border border-rose-200'
                    : 'text-slate-600 hover:text-slate-900 border border-transparent'
                }`}
              >
                <Gift className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate sm:whitespace-normal">Regalos de Alta Costura</span>
              </button>
            </div>

            {/* TAB 1: ECONOMIC DONATIONS */}
            {donationMode === 'economic' && (
              <div className="space-y-4 animate-scale-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide m-0">
                      Aportación Económica Directa
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      Impulsa a {modelFullName} como la número 1 del ranking mundial de alta costura.
                    </p>
                  </div>
                  <div className="text-right shrink-0 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    <span className="text-[8.5px] text-emerald-700 uppercase tracking-wider block font-bold">Tu Saldo</span>
                    <span className="text-xs sm:text-sm font-black text-emerald-700 font-mono">
                      {(currentInvestorProfile?.balance ?? (userProfile?.balance || 1500)).toFixed(2)}€
                    </span>
                  </div>
                </div>

                {/* Preset Euro Buttons */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Selecciona importe:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {euroPresets.map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCustomEuroAmount(preset)}
                        className={`py-2 rounded-xl font-black text-xs transition font-mono border cursor-pointer ${
                          Number(customEuroAmount) === preset
                            ? 'bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-300 scale-105'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-rose-50 hover:border-pink-300'
                        }`}
                      >
                        {preset}€
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Input & Dedication Message */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Importe (€)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">€</span>
                      <input 
                        type="number"
                        min="1"
                        step="1"
                        value={customEuroAmount}
                        onChange={(e) => setCustomEuroAmount(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-rose-500 font-mono"
                        placeholder="Importe"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-8">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Dedicatoria (Opcional)
                    </label>
                    <input 
                      type="text"
                      value={donationMessage}
                      onChange={(e) => setDonationMessage(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-rose-500"
                      placeholder="¡Felicidades por ser la número 1 indiscutible! ✨"
                    />
                  </div>
                </div>

                {/* Submit Donation Button */}
                <button
                  type="button"
                  onClick={handleSendEconomicDonation}
                  className="w-full bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-150 flex items-center justify-center uppercase tracking-wider hover:scale-[1.01] active:scale-95 cursor-pointer border border-rose-400/40 gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Donar {typeof customEuroAmount === 'number' ? customEuroAmount : (parseFloat(customEuroAmount) || 0)}€ a {modelFirstName}</span>
                </button>
              </div>
            )}

            {/* TAB 2: HAUTE COUTURE VIP GIFTS */}
            {donationMode === 'gifts' && (
              <div className="space-y-4 animate-scale-in">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h5 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide m-0">
                      Catálogo de Regalos de Alta Costura
                    </h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      Envía regalos exclusivos y celebra el liderazgo de {modelFullName}.
                    </p>
                  </div>

                  {/* Filter chips */}
                  <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg text-[10px]">
                    {(['todos', 'basico', 'intermedio', 'lujo'] as const).map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setGiftCategory(cat)}
                        className={`px-2 py-0.5 rounded-md font-bold uppercase transition cursor-pointer ${
                          giftCategory === cat
                            ? 'bg-white text-rose-700 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {cat === 'todos' ? 'Todos' : cat === 'basico' ? 'Básicos' : cat === 'intermedio' ? 'Medios' : 'Lujo'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gifts Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-56 overflow-y-auto w-full pr-1">
                  {filteredGifts.map(gift => {
                    const isSelected = selectedGift?.id === gift.id;
                    return (
                      <div
                        key={gift.id}
                        onClick={() => setSelectedGift(gift)}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition duration-150 relative select-none ${
                          isSelected
                            ? 'bg-pink-50 border-rose-500 ring-2 ring-rose-400 shadow-sm scale-105'
                            : 'bg-slate-50 border-slate-200 hover:bg-rose-50/50 hover:border-pink-300'
                        }`}
                      >
                        {gift.isExclusive && (
                          <span className="absolute top-1 right-1 text-[8px]" title="Exclusivo de Lujo">👑</span>
                        )}
                        <span className="text-2xl mb-0.5">{gift.icon}</span>
                        <span className="text-[9px] font-bold text-slate-800 truncate w-full px-0.5 leading-tight">{gift.name}</span>
                        <span className="text-[9px] font-mono font-black text-rose-600 mt-0.5">{gift.price}€</span>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Gift Summary & Message input */}
                {selectedGift && (
                  <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-3.5 flex flex-col gap-2.5 shadow-xs">
                    <div className="flex items-center justify-between gap-3 w-full">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl drop-shadow-xs">{selectedGift.icon}</span>
                        <div className="text-left">
                          <span className="text-xs font-black text-slate-900 block leading-tight">{selectedGift.name}</span>
                          <span className="text-[11px] font-black text-rose-600 font-mono">Coste: {selectedGift.price}€</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleSendChannelGift}
                        className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95 border border-pink-300/40"
                      >
                        <span>Enviar Regalo</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input 
                      type="text"
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-rose-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 shadow-xs transition"
                      placeholder={`Escribe una dedicatoria para ${modelFullName}...`}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Feedback Toast Notification */}
      {feedbackToast?.show && (
        <div className="mt-4 bg-emerald-950 text-white border-2 border-emerald-400 rounded-2xl p-3.5 shadow-xl flex items-center gap-3 animate-scale-in">
          <span className="text-2xl shrink-0">{feedbackToast.icon}</span>
          <div className="flex-1 min-w-0">
            <h6 className="text-xs font-black text-emerald-300 uppercase tracking-wide m-0">
              {feedbackToast.title}
            </h6>
            <p className="text-[11px] text-emerald-100 font-medium m-0 leading-tight">
              {feedbackToast.message}
            </p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        </div>
      )}
    </div>
  );
}

