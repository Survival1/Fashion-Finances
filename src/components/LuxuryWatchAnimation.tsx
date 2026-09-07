import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Clock, Award, Gift, Eye, Volume2, VolumeX, CheckCircle, Heart, X } from 'lucide-react';

export interface LuxuryWatchGift {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  giftName: string; // "Reloj de oro" | "Reloj"
  giftIcon: string; // "⌚" | "⏰"
  cost: number;
  euroCost: number;
  message?: string;
  timestamp: number;
  modelPhotoUrl?: string;
}

const LUXURY_WATCH_STORAGE_KEY = 'casting_luxury_watch_gifts_v1';
const WATCH_CLAIMED_KEY_PREFIX = 'casting_luxury_watch_claimed_';
const WATCH_OPENED_GIFTS_KEY = 'casting_luxury_watch_opened_gifts_v1';
const FF_RECEIVED_GIFTS_KEY = 'ff_received_gifts_v3';

// Check if a luxury watch animation has already been opened/claimed from profile
export function isLuxuryWatchOpened(giftId?: string, profileUserId?: string): boolean {
  try {
    if (giftId && localStorage.getItem(`${WATCH_CLAIMED_KEY_PREFIX}${giftId}`) === 'true') {
      return true;
    }
    if (profileUserId) {
      if (localStorage.getItem(`casting_luxury_watch_claimed_profile_${profileUserId}`) === 'true') {
        return true;
      }
      if (localStorage.getItem(`casting_luxury_watch_profile_dismissed_${profileUserId}`) === 'true') {
        return true;
      }
    }
    const raw = localStorage.getItem(WATCH_OPENED_GIFTS_KEY);
    if (raw && giftId) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.includes(giftId)) return true;
    }
  } catch (e) {
    console.error("Error checking watch opened status:", e);
  }
  return false;
}

// Mark watch as opened: removes it permanently from the profile and saves it into the ACTUALES section of received gifts
export function markLuxuryWatchAsOpened(gift: LuxuryWatchGift, profileUserId?: string) {
  try {
    // 1. Mark as opened/claimed so it never appears again on the profile
    if (gift.id) {
      localStorage.setItem(`${WATCH_CLAIMED_KEY_PREFIX}${gift.id}`, 'true');
    }
    if (profileUserId) {
      localStorage.setItem(`casting_luxury_watch_claimed_profile_${profileUserId}`, 'true');
      localStorage.setItem(`casting_luxury_watch_profile_dismissed_${profileUserId}`, 'true');
    }
    if (gift.receiverId) {
      localStorage.setItem(`casting_luxury_watch_claimed_profile_${gift.receiverId}`, 'true');
      localStorage.setItem(`casting_luxury_watch_profile_dismissed_${gift.receiverId}`, 'true');
    }

    let openedList: string[] = [];
    try {
      const raw = localStorage.getItem(WATCH_OPENED_GIFTS_KEY);
      if (raw) openedList = JSON.parse(raw) || [];
    } catch (_) {}
    if (gift.id && !openedList.includes(gift.id)) {
      openedList.push(gift.id);
      localStorage.setItem(WATCH_OPENED_GIFTS_KEY, JSON.stringify(openedList));
    }

    // 2. Persist into the received gifts storage (ff_received_gifts_v3) in the "ACTUALES" period (timestamp = now)
    let existingReceived: any[] = [];
    try {
      const rawRec = localStorage.getItem(FF_RECEIVED_GIFTS_KEY);
      if (rawRec) {
        const parsedRec = JSON.parse(rawRec);
        if (Array.isArray(parsedRec) && parsedRec.length > 0) {
          existingReceived = parsedRec;
        }
      }
    } catch (_) {}

    const nowTimestamp = Date.now();
    const formattedDate = new Date(nowTimestamp).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) + ' • ' + new Date(nowTimestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const newGiftItem = {
      id: gift.id || `rec-watch-${nowTimestamp}`,
      senderName: gift.senderName || 'Ernesto vs',
      senderUsername: (gift.senderName && gift.senderName.toLowerCase().includes('ernesto')) ? 'ernestovs' : 'adrianalima_w1',
      senderAvatar: gift.senderAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      receiverName: gift.receiverName || 'Adriana Lima',
      receiverUsername: 'adrianalima_w1',
      receiverAvatar: gift.receiverAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
      giftName: gift.giftName || 'Reloj de oro',
      giftIcon: gift.giftIcon || '⌚',
      price: gift.cost || 5000,
      euroCost: gift.euroCost || 5000,
      message: gift.message || '¡Para la mejor modelo y embajadora de la pasarela internacional! Disfruta de este reloj de oro exclusivo. ✨👑',
      dateFormatted: formattedDate,
      timestamp: nowTimestamp, // Guaranteed in "Actuales" (<= 7 days)
      status: 'confirmed',
      isExclusive: true,
      category: 'lujo'
    };

    // Place at the top of the list so it appears first in "Actuales"
    const updatedReceived = [
      newGiftItem,
      ...existingReceived.filter(g => g.id !== newGiftItem.id && !(g.giftName && g.giftName.toLowerCase().includes('reloj') && g.senderName === newGiftItem.senderName))
    ];

    localStorage.setItem(FF_RECEIVED_GIFTS_KEY, JSON.stringify(updatedReceived));

    // 3. Dispatch reactive events to update all listening components in real time
    window.dispatchEvent(new CustomEvent('luxury-watch-opened', { detail: { gift, profileUserId } }));
    window.dispatchEvent(new CustomEvent('luxury-watch-gift-updated', { detail: gift }));
    window.dispatchEvent(new CustomEvent('ff-received-gifts-updated', { detail: updatedReceived }));
  } catch (e) {
    console.error("Error marking luxury watch as opened:", e);
  }
}

// Seed default watch gift if empty so the user can experience the animations immediately on Adriana Lima and Ernesto vs
export function getStoredLuxuryWatchGifts(): LuxuryWatchGift[] {
  try {
    const raw = localStorage.getItem(LUXURY_WATCH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error loading luxury watch gifts:", e);
  }

  // Initial seed: A gold watch sent from Ernesto vs to Adriana Lima
  const defaultSeeds: LuxuryWatchGift[] = [
    {
      id: 'watch-gift-seed-1',
      senderId: 'user-ernesto',
      senderName: 'Ernesto vs',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
      receiverId: 'topf-1', // Adriana Lima
      receiverName: 'Adriana Lima',
      receiverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
      giftName: 'Reloj de oro',
      giftIcon: '⌚',
      cost: 5000,
      euroCost: 5000,
      message: '¡Para la mejor modelo y embajadora de la pasarela internacional! Disfruta de este reloj de oro exclusivo. ✨👑',
      timestamp: Date.now() - 1000 * 60 * 35
    }
  ];

  try {
    localStorage.setItem(LUXURY_WATCH_STORAGE_KEY, JSON.stringify(defaultSeeds));
  } catch (_) {}

  return defaultSeeds;
}

export function saveLuxuryWatchGift(gift: LuxuryWatchGift) {
  try {
    const current = getStoredLuxuryWatchGifts();
    const updated = [gift, ...current.filter(g => g.id !== gift.id)];
    localStorage.setItem(LUXURY_WATCH_STORAGE_KEY, JSON.stringify(updated));
    
    // Dispatch custom event for reactive real-time updates across open components
    window.dispatchEvent(new CustomEvent('luxury-watch-gift-updated', { detail: gift }));
    window.dispatchEvent(new CustomEvent('trigger-luxury-watch-celebration', { detail: gift }));
  } catch (e) {
    console.error("Error saving luxury watch gift:", e);
  }
}

// Web Audio API synthesizer for luxury watch mechanical ticking + golden chime
export function playLuxuryWatchSoundEffect(includeChime = true) {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // 1. Crystal Harmonic Chimes (Golden presence)
    if (includeChime) {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        
        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.2);
      });
    }

    // 2. Crisp Mechanical Tick-Tock (High-end watch escapement)
    for (let i = 0; i < 4; i++) {
      const tickTime = now + 0.6 + i * 0.25;
      const oscTick = ctx.createOscillator();
      const gainTick = ctx.createGain();
      
      oscTick.type = 'triangle';
      oscTick.frequency.setValueAtTime(i % 2 === 0 ? 3200 : 2800, tickTime);
      
      gainTick.gain.setValueAtTime(0.08, tickTime);
      gainTick.gain.exponentialRampToValueAtTime(0.001, tickTime + 0.035);
      
      oscTick.connect(gainTick);
      gainTick.connect(ctx.destination);
      oscTick.start(tickTime);
      oscTick.stop(tickTime + 0.04);
    }
  } catch (e) {
    console.log("Audio not supported or interaction needed:", e);
  }
}

// High-fidelity interactive animated SVG/CSS Luxury Gold Watch
export const AnimatedGoldWatch: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onClick?: () => void;
  showSparkles?: boolean;
}> = ({ size = 'md', interactive = true, onClick, showSparkles = true }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => (prev + 1) % 60);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dimMap = {
    sm: { width: 100, height: 100, scale: 0.5 },
    md: { width: 160, height: 160, scale: 0.8 },
    lg: { width: 220, height: 220, scale: 1.1 },
    xl: { width: 280, height: 280, scale: 1.4 }
  };

  const currentDim = dimMap[size] || dimMap.md;

  // Rotating degrees
  const secDeg = (seconds * 6) % 360;
  const minDeg = ((seconds / 10 + 18) * 6) % 360;
  const hourDeg = (10 * 30 + 10) % 360; // Set to 10:10 classic luxury display

  return (
    <div 
      className={`relative flex items-center justify-center select-none ${interactive ? 'cursor-pointer group/watch' : ''}`}
      style={{ width: currentDim.width, height: currentDim.height }}
      onClick={onClick}
      title="Reloj de Oro de Alta Gama (18k Gold)"
    >
      {/* Outer Golden Aura & Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/25 via-yellow-400/35 to-amber-600/20 blur-xl animate-pulse-subtle pointer-events-none" />
      
      {/* Floating Rotating Sparkles */}
      {showSparkles && (
        <>
          <div className="absolute -top-1.5 -right-1.5 text-yellow-350 text-xs sm:text-sm animate-bounce filter drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" style={{ animationDuration: '2.2s' }}>
            ✨
          </div>
          <div className="absolute -bottom-1 -left-1.5 text-amber-300 text-xs animate-pulse filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" style={{ animationDuration: '1.8s' }}>
            ⭐
          </div>
          <div className="absolute top-1/2 -right-3 text-amber-200 text-[10px] animate-ping opacity-75" style={{ animationDuration: '3s' }}>
            ✦
          </div>
        </>
      )}

      {/* SVG Luxury Watch Structure */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] transition-transform duration-500 group-hover/watch:scale-105 group-hover/watch:rotate-1"
      >
        <defs>
          {/* Gold gradients */}
          <linearGradient id="goldCaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="25%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F3E5AB" />
            <stop offset="75%" stopColor="#AA771C" />
            <stop offset="100%" stopColor="#FFDF73" />
          </linearGradient>

          <linearGradient id="goldBezelFluted" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="30%" stopColor="#B38728" />
            <stop offset="60%" stopColor="#FBF5B7" />
            <stop offset="85%" stopColor="#9E721D" />
            <stop offset="100%" stopColor="#FFF3A8" />
          </linearGradient>

          <radialGradient id="sunburstDial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2A241A" />
            <stop offset="55%" stopColor="#15120E" />
            <stop offset="90%" stopColor="#0B0907" />
            <stop offset="100%" stopColor="#050403" />
          </radialGradient>

          <linearGradient id="goldStrapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8860B" />
            <stop offset="20%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFF8DC" />
            <stop offset="80%" stopColor="#DAA520" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>

          {/* Shimmer light bar effect */}
          <linearGradient id="crystalShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="30%" stopColor="white" stopOpacity="0.1" />
            <stop offset="70%" stopColor="white" stopOpacity="0" />
            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Watch Top Strap Links (Oyster Luxury Gold) */}
        <path d="M72 10 L128 10 L122 36 L78 36 Z" fill="url(#goldStrapGrad)" stroke="#7A530F" strokeWidth="1" />
        <line x1="88" y1="10" x2="88" y2="36" stroke="#AA771C" strokeWidth="1.5" />
        <line x1="112" y1="10" x2="112" y2="36" stroke="#AA771C" strokeWidth="1.5" />
        <line x1="74" y1="22" x2="126" y2="22" stroke="#AA771C" strokeWidth="1.5" opacity="0.7" />

        {/* Watch Bottom Strap Links */}
        <path d="M78 164 L122 164 L128 190 L72 190 Z" fill="url(#goldStrapGrad)" stroke="#7A530F" strokeWidth="1" />
        <line x1="88" y1="164" x2="88" y2="190" stroke="#AA771C" strokeWidth="1.5" />
        <line x1="112" y1="164" x2="112" y2="190" stroke="#AA771C" strokeWidth="1.5" />
        <line x1="74" y1="178" x2="126" y2="178" stroke="#AA771C" strokeWidth="1.5" opacity="0.7" />

        {/* Outer Fluted Gold Bezel */}
        <circle cx="100" cy="100" r="70" fill="url(#goldCaseGrad)" stroke="#805608" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="66" fill="url(#goldBezelFluted)" stroke="#FFF2A3" strokeWidth="1" strokeDasharray="3,2" />

        {/* Crown on Right Side */}
        <rect x="169" y="93" width="7" height="14" rx="2" fill="url(#goldCaseGrad)" stroke="#7A530F" strokeWidth="1" />
        <line x1="172" y1="94" x2="172" y2="106" stroke="#7A530F" strokeWidth="0.8" />

        {/* Inner Dial (Sunburst Onyx / Gold) */}
        <circle cx="100" cy="100" r="58" fill="url(#sunburstDial)" stroke="#D4AF37" strokeWidth="1.5" />

        {/* Minute Track Dots / Markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const x1 = 100 + Math.sin(angle) * 50;
          const y1 = 100 - Math.cos(angle) * 50;
          const x2 = 100 + Math.sin(angle) * (i % 3 === 0 ? 42 : 45);
          const y2 = 100 - Math.cos(angle) * (i % 3 === 0 ? 42 : 45);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i % 3 === 0 ? "#FFD700" : "#D4AF37"}
              strokeWidth={i % 3 === 0 ? 2.5 : 1.2}
              strokeLinecap="round"
            />
          );
        })}

        {/* Luxury Brand Inscription */}
        <text x="100" y="75" textAnchor="middle" fill="#FFDF73" fontSize="6.5" fontWeight="900" letterSpacing="1.8" fontFamily="sans-serif">
          CASTING LIVE
        </text>
        <text x="100" y="82" textAnchor="middle" fill="#D4AF37" fontSize="4" fontWeight="bold" letterSpacing="1" fontFamily="sans-serif">
          18K GOLD • CHRONOMETER
        </text>

        {/* Tourbillon / Small Seconds Subdial at 6 o'clock */}
        <circle cx="100" cy="126" r="14" fill="#1C1813" stroke="#D4AF37" strokeWidth="1" />
        <circle cx="100" cy="126" r="14" fill="none" stroke="#FFD700" strokeWidth="0.5" strokeDasharray="1.5,1.5" />
        {/* Spinning Tourbillon indicator */}
        <line
          x1="100"
          y1="126"
          x2={100 + Math.sin(secDeg * (Math.PI / 180)) * 10}
          y2={126 - Math.cos(secDeg * (Math.PI / 180)) * 10}
          stroke="#FF5555"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="100" cy="126" r="2" fill="#FFD700" />
        <text x="100" y="145" textAnchor="middle" fill="#B8860B" fontSize="3.5" fontWeight="bold" letterSpacing="0.8">
          GENÈVE
        </text>

        {/* Hour Hand (Gold Sword Hand) */}
        <g transform={`rotate(${hourDeg}, 100, 100)`}>
          <path d="M98 100 L99 68 L100 62 L101 68 L102 100 Z" fill="url(#goldCaseGrad)" stroke="#7A530F" strokeWidth="0.8" />
          <line x1="100" y1="95" x2="100" y2="68" stroke="#FFE066" strokeWidth="0.8" />
        </g>

        {/* Minute Hand (Longer Gold Sword Hand) */}
        <g transform={`rotate(${minDeg}, 100, 100)`}>
          <path d="M98.5 100 L99.2 52 L100 46 L100.8 52 L101.5 100 Z" fill="url(#goldCaseGrad)" stroke="#7A530F" strokeWidth="0.8" />
          <line x1="100" y1="95" x2="100" y2="52" stroke="#FFF2A3" strokeWidth="0.8" />
        </g>

        {/* Sweeping Seconds Hand (Rose / Red tipped golden hand) */}
        <g transform={`rotate(${secDeg}, 100, 100)`}>
          <line x1="100" y1="114" x2="100" y2="44" stroke="#FE2C55" strokeWidth="1" strokeLinecap="round" />
          <circle cx="100" cy="52" r="2.2" fill="#FE2C55" />
          <circle cx="100" cy="100" r="3.5" fill="#FFD700" stroke="#7A530F" strokeWidth="0.8" />
        </g>

        {/* Sapphire Crystal Glare & Reflection */}
        <path d="M52 75 C70 52, 130 52, 148 75 C120 62, 80 62, 52 75 Z" fill="url(#crystalShine)" pointerEvents="none" />
      </svg>
    </div>
  );
};

// Component: Luxury Watch Profile Showcase Banner & Card
export const LuxuryWatchShowcase: React.FC<{
  userId: string;
  userName: string;
  isOwnProfile: boolean;
  onOpenCelebrationModal?: (gift: LuxuryWatchGift) => void;
}> = ({ userId, userName, isOwnProfile, onOpenCelebrationModal }) => {
  const [gifts, setGifts] = useState<LuxuryWatchGift[]>([]);
  const [selectedGiftForDetails, setSelectedGiftForDetails] = useState<LuxuryWatchGift | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => isLuxuryWatchOpened(undefined, userId));

  const loadGifts = () => {
    // If already dismissed/opened for this user profile, don't show
    if (isLuxuryWatchOpened(undefined, userId)) {
      setGifts([]);
      setIsDismissed(true);
      return;
    }

    const all = getStoredLuxuryWatchGifts();
    // Filter gifts relevant to this profile and exclude those that have already been opened/claimed
    const filtered = all.filter(g => {
      if (isLuxuryWatchOpened(g.id, userId)) return false;
      return g.receiverId === userId || g.senderId === userId || (isOwnProfile && (g.senderId === 'user-ernesto' || g.senderId === userId));
    });
    setGifts(filtered);
    if (filtered.length === 0) {
      setIsDismissed(true);
    }
  };

  useEffect(() => {
    loadGifts();

    const handleUpdate = () => loadGifts();
    const handleOpened = (e: any) => {
      const targetUserId = e?.detail?.profileUserId || e?.detail?.gift?.receiverId;
      if (!targetUserId || targetUserId === userId || isOwnProfile) {
        setIsDismissed(true);
        setGifts([]);
      }
    };

    window.addEventListener('luxury-watch-gift-updated', handleUpdate);
    window.addEventListener('luxury-watch-opened', handleOpened);
    return () => {
      window.removeEventListener('luxury-watch-gift-updated', handleUpdate);
      window.removeEventListener('luxury-watch-opened', handleOpened);
    };
  }, [userId, isOwnProfile]);

  if (isDismissed || gifts.length === 0) return null;

  const latestGift = gifts[0];
  const isReceived = latestGift.receiverId === userId;

  const handleOpenAnimation = (targetGift: LuxuryWatchGift) => {
    // 1. Mark as opened immediately and save gift to ACTUALES of received gifts
    markLuxuryWatchAsOpened(targetGift, userId);
    setIsDismissed(true);
    setGifts([]);

    // 2. Play audio & trigger the celebration modal
    playLuxuryWatchSoundEffect(true);
    if (onOpenCelebrationModal) {
      onOpenCelebrationModal(targetGift);
    }
  };

  return (
    <div className="w-full my-4 animate-fade-in select-none">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-amber-950/90 via-slate-900 to-black p-4 sm:p-5 border-2 border-amber-500/50 shadow-2xl">
        {/* Background glow and decorative beams */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Top Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-amber-500/30">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-sm shadow-inner">
              ⌚
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 font-sans">
                  {isReceived ? '🎁 REGALO RECIBIDO EXCLUSIVO' : '✨ REGALO ENVIADO DE ALTA GAMA'}
                </span>
                <span className="bg-amber-500 text-black font-extrabold text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
                  18K GOLD • 5.000€
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-white leading-tight font-display">
                {latestGift.giftName} {latestGift.giftIcon}
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenAnimation(latestGift)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Ver Animación de Lujo</span>
          </button>
        </div>

        {/* Content: Animated Watch on the Left + Info on the Right */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Animated Gold Watch Stage */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center bg-black/40 rounded-2xl p-2 border border-amber-500/20 shadow-inner group">
            <AnimatedGoldWatch
              size="md"
              interactive={true}
              onClick={() => handleOpenAnimation(latestGift)}
            />
            <span className="text-[9px] font-mono font-bold text-amber-300/80 mt-1 uppercase tracking-wider">
              ✦ Toca para inspeccionar ✦
            </span>
          </div>

          {/* Details & Dedication text */}
          <div className="sm:col-span-8 flex flex-col justify-between space-y-3 text-left">
            {/* Sender / Receiver Banner */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={isReceived ? latestGift.senderAvatar : latestGift.receiverAvatar}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400/80 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider block">
                    {isReceived ? 'Regalado por:' : 'Enviado para:'}
                  </span>
                  <span className="text-sm font-black text-white truncate block">
                    {isReceived ? latestGift.senderName : latestGift.receiverName}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block font-mono">Valoración</span>
                <span className="text-sm font-black text-amber-400 font-mono">🪙 {latestGift.cost.toLocaleString()} monedas</span>
                <span className="text-[9px] text-emerald-400 font-semibold block">({latestGift.euroCost.toFixed(2)}€)</span>
              </div>
            </div>

            {/* Dedication Message */}
            {latestGift.message ? (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-xs text-amber-100 italic leading-relaxed">
                <span className="text-amber-400 font-bold not-italic mr-1">“</span>
                {latestGift.message}
                <span className="text-amber-400 font-bold not-italic ml-1">”</span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">
                Regalo de alta gama entregado con certificación oficial de Casting Live.
              </div>
            )}

            {/* Footer timestamp & status */}
            <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pt-1">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle className="w-3 h-3 text-emerald-400" /> Entrega confirmada en perfil
              </span>
              <span>{new Date(latestGift.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* History carousel if more than 1 watch */}
        {gifts.length > 1 && (
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Colección ({gifts.length}):
            </span>
            {gifts.map((g, idx) => (
              <button
                key={g.id}
                type="button"
                onClick={() => handleOpenAnimation(g)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9.5px] font-black border transition cursor-pointer shrink-0 ${
                  g.id === latestGift.id
                    ? 'bg-amber-500/30 text-amber-300 border-amber-400/50'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                }`}
              >
                <span>⌚</span>
                <span>{g.receiverName}</span>
                <span className="text-amber-400 font-mono">🪙{g.cost}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Fullscreen / Popover Luxury Watch Celebration Animation Modal
export const LuxuryWatchCelebrationModal: React.FC<{
  gift: LuxuryWatchGift | null;
  onClose: () => void;
}> = ({ gift, onClose }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (gift) {
      playLuxuryWatchSoundEffect(true);
    }
  }, [gift]);

  if (!gift) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 animate-fade-in backdrop-blur-xl select-none font-sans overflow-y-auto">
      {/* Background Particle Stars & Rays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-600/20 rounded-full blur-3xl animate-pulse-subtle" />
        
        {/* Animated sparkling particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 text-xs sm:text-base animate-ping opacity-60 pointer-events-none"
            style={{
              top: `${Math.random() * 95}%`,
              left: `${Math.random() * 95}%`,
              animationDuration: `${1.5 + Math.random() * 2.5}s`,
              animationDelay: `${Math.random() * 1.5}s`
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Main Presentation Card */}
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#1c160e] via-[#120f0a] to-[#0a0806] rounded-3xl border-2 border-amber-400/60 shadow-[0_0_50px_rgba(217,119,6,0.35)] p-6 text-center text-white overflow-hidden my-auto animate-scale-up">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer border border-white/10 z-20"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (next) playLuxuryWatchSoundEffect(true);
          }}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-amber-400 flex items-center justify-center transition cursor-pointer border border-white/10 z-20 text-xs"
          title={soundEnabled ? "Silenciar sonido" : "Reproducir sonido"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Glowing Ribbon Header */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-500/20 border border-amber-400/50 px-4 py-1.5 rounded-full mb-3 shadow-inner">
          <span className="text-amber-300 text-xs animate-spin" style={{ animationDuration: '4s' }}>✨</span>
          <span className="text-xs font-black uppercase tracking-widest text-amber-300 font-sans">
            ¡REGALO DE LUJO ENTREGADO!
          </span>
          <span className="text-amber-300 text-xs animate-spin" style={{ animationDuration: '4s' }}>✨</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 font-display leading-tight mb-1">
          {gift.giftName} {gift.giftIcon}
        </h2>
        <p className="text-xs text-amber-200/80 font-medium">
          Edición de Oro 18K • Certificación de Alta Relojería Suiza
        </p>

        {/* Centerpiece: Large Animated Watch with Rays */}
        <div className="my-5 flex flex-col items-center justify-center relative py-2">
          <div className="absolute w-64 h-64 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <AnimatedGoldWatch size="lg" interactive={false} showSparkles={true} />
        </div>

        {/* Profiles Exchange Banner */}
        <div className="bg-black/60 border border-amber-500/30 rounded-2xl p-3.5 mb-4 max-w-md mx-auto shadow-inner">
          <div className="flex items-center justify-around gap-2">
            {/* Sender */}
            <div className="flex flex-col items-center text-center">
              <img
                src={gift.senderAvatar}
                alt={gift.senderName}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md mb-1"
              />
              <span className="text-[10px] text-amber-300 font-bold uppercase">De</span>
              <span className="text-xs font-black text-white">{gift.senderName}</span>
            </div>

            {/* Gift arrow icon */}
            <div className="flex flex-col items-center justify-center px-2">
              <span className="text-xl text-amber-400 animate-pulse">➔</span>
              <span className="text-[9px] font-mono font-bold text-amber-400 mt-0.5">
                🪙 {gift.cost}
              </span>
            </div>

            {/* Receiver */}
            <div className="flex flex-col items-center text-center">
              <img
                src={gift.receiverAvatar}
                alt={gift.receiverName}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md mb-1"
              />
              <span className="text-[10px] text-amber-300 font-bold uppercase">Para</span>
              <span className="text-xs font-black text-white">{gift.receiverName}</span>
            </div>
          </div>

          {/* Personal Message */}
          {gift.message && (
            <div className="mt-3 pt-2.5 border-t border-amber-500/20 text-xs text-amber-100 italic">
              “{gift.message}”
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              playLuxuryWatchSoundEffect(true);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Repetir Sonido y Brillo</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-105 active:scale-95 transition cursor-pointer"
          >
            <span>Aceptar y Continuar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
