import React, { useState, useEffect } from 'react';
import { Mic, MicOff, CameraOff, Users, X, Sparkles } from 'lucide-react';

interface LivePresentationImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  presenter?: {
    id?: string;
    name?: string;
    role?: string;
    avatar?: string;
  };
  turnNumber?: number;
  initialTimerSecs?: number;
  isBroadcastMicOn?: boolean;
  toggleBroadcastMic?: () => void;
  onStopLive?: () => void;
}

export const LivePresentationImageModal: React.FC<LivePresentationImageModalProps> = ({
  isOpen,
  onClose,
  presenter = {
    name: 'Alessia Vance',
    role: 'MODELO DIRECTORA',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=650'
  },
  turnNumber = 1,
  initialTimerSecs = 287, // 4:47 strictly matching imagen.png
  isBroadcastMicOn = true,
  toggleBroadcastMic,
  onStopLive
}) => {
  const [timerSecs, setTimerSecs] = useState<number>(initialTimerSecs || 287);
  const [isMicActive, setIsMicActive] = useState<boolean>(isBroadcastMicOn);

  // Sync internal mic state if prop changes
  useEffect(() => {
    setIsMicActive(isBroadcastMicOn);
  }, [isBroadcastMicOn]);

  // Synchronize or initialize timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimerSecs(initialTimerSecs > 0 ? initialTimerSecs : 287);
    }
  }, [isOpen, initialTimerSecs]);

  // Countdown timer (ticking every second)
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimerSecs((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Keyboard escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timerSecs / 60);
  const seconds = timerSecs % 60;
  const formattedTimer = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const progressPercent = Math.min(100, Math.max(5, (timerSecs / 300) * 100));

  const handleToggleMic = () => {
    if (toggleBroadcastMic) {
      toggleBroadcastMic();
    }
    setIsMicActive((prev) => !prev);
  };

  const handleClose = () => {
    if (onStopLive) {
      onStopLive();
    }
    onClose();
  };

  // Presenter display names matching imagen.png ("Alessia ...", "MODELO DIRE...")
  const presenterName = presenter.name || 'Alessia Vance';
  const shortName = presenterName.length > 8 ? `${presenterName.slice(0, 7)}...` : presenterName;
  const presenterAvatar = presenter.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=650';

  return (
    <div 
      className="fixed inset-0 z-[600] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-fade-in font-sans"
      onClick={handleClose}
      id="live-presentation-modal-backdrop"
    >
      {/* Mobile Frame Container (Strictly matching phone viewport in imagen.png) */}
      <div 
        className="relative w-full max-w-[420px] h-[92vh] max-h-[840px] rounded-[44px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.95)] border-2 border-slate-700/80 bg-[#070b14] flex flex-col justify-between text-white"
        onClick={(e) => e.stopPropagation()}
        id="live-presentation-modal-window"
      >
        {/* Phone Top Speaker Notch */}
        <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mt-2.5 mb-1 shrink-0 z-30" />

        {/* Elegant Close Button (X) */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-4 z-40 bg-black/60 hover:bg-black/90 text-white/80 hover:text-white p-1 rounded-full border border-white/20 transition cursor-pointer active:scale-95 shadow-md"
          title="Cerrar y volver a la ronda (captura z.png)"
          id="btn-close-live-modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 🔝 CABECERA SUPERIOR (Idéntica a captura imagen.png) */}
        <div className="relative z-30 w-full px-3 pt-1 flex items-center justify-between gap-1 sm:gap-1.5 pointer-events-auto shrink-0">
          {/* Left: Avatar + "Alessia ..." + "EN VIVO" + "MODELO DIRE..." + Audio Bars */}
          <div className="flex items-center gap-1.5 bg-[#0a0f1d]/90 backdrop-blur-md border border-slate-700/80 py-1 px-2 rounded-full shadow-lg shrink min-w-0">
            <div className="relative shrink-0">
              <img 
                src={presenterAvatar} 
                alt={presenterName} 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-rose-500 shadow-sm"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=650';
                }}
              />
              {/* Vibrant green online dot on border */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-black shadow-[0_0_6px_#34d399]" />
            </div>

            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-1 leading-none">
                <span className="text-[10px] sm:text-[11px] font-black text-white leading-tight truncate">
                  {shortName}
                </span>
                <span className="bg-[#0b2426] text-[#00e5ff] text-[7px] font-black uppercase px-1 py-0.2 rounded-full border border-[#00e5ff]/40 tracking-wider shrink-0">
                  EN VIVO
                </span>
              </div>

              <div className="flex items-center gap-1 mt-0.5 leading-none">
                <span className="text-[7.5px] sm:text-[8px] text-[#00e5ff] font-bold uppercase tracking-wider truncate">
                  MODELO DIRE...
                </span>
                {/* 3 Animated green equalizer bars */}
                <span className="inline-flex items-end gap-0.5 h-2 shrink-0">
                  <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse" />
                  <span className="w-0.5 h-2.5 bg-emerald-400 animate-pulse delay-75" />
                  <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse delay-150" />
                </span>
              </div>
            </div>
          </div>

          {/* Center: Burgundy pill badge • TURNO 1 DE 10 • EN EXPOSICIÓN */}
          <div className="inline-flex items-center gap-1 bg-[#3f0b16]/95 backdrop-blur-md border border-rose-500/60 text-white px-2.5 py-1 rounded-full text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider shadow-md shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span className="truncate">TURNO {turnNumber} DE 10 • EN EXPOSICIÓN</span>
          </div>

          {/* Right: Viewers badge • 👥 1.4K */}
          <div className="flex items-center gap-1 shrink-0">
            <div className="flex items-center gap-1 bg-[#0a0f1d]/90 backdrop-blur-md border border-slate-700/80 text-slate-200 px-2 py-1 rounded-full text-[8.5px] sm:text-[9.5px] font-black shadow-md">
              <Users className="w-2.5 h-2.5 text-rose-400 shrink-0" />
              <span>1.4K</span>
            </div>
          </div>
        </div>

        {/* 💃 ESCENARIO CENTRAL / LIVE PRESENTATION STAGE (Strictly matching imagen.png) */}
        <div className="absolute inset-0 z-10 w-full h-full overflow-hidden flex items-center justify-center pointer-events-none">
          {/* Studio Clean Gradient Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#212738] via-[#858e9e] to-[#2b3345] opacity-95" />

          {/* Glowing Pink Ribbon Infinity Circle Behind Model */}
          <div className="absolute w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full border-[8px] sm:border-[10px] border-[#fe2c55]/70 shadow-[0_0_60px_rgba(254,44,85,0.65),inset_0_0_40px_rgba(254,44,85,0.4)] opacity-90 transform -rotate-12 translate-y-6" />

          {/* Metallic Pink Bold Typographic Logo: HION FINA */}
          <div className="absolute inset-x-0 top-[40%] -translate-y-1/2 flex items-center justify-center opacity-75 select-none pointer-events-none">
            <span className="text-4xl sm:text-5xl md:text-6xl font-black font-serif tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-200 to-rose-400 drop-shadow-[0_4px_16px_rgba(254,44,85,0.7)] uppercase">
              HION FINA
            </span>
          </div>

          {/* Ballerina Model in Sleek Black Evening Dress with Raised Arms Pose */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {/* Model Cutout Image with Fallback and SVG Silhouette */}
            <img
              src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=900"
              alt="Modelo Alessia Vance Alta Costura"
              className="absolute inset-0 w-full h-full object-cover object-center mix-blend-luminosity opacity-40 filter contrast-125 brightness-110"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />

            {/* High-Fidelity Ballerina Silhouette in Deep Plunging Black Evening Gown (Exact match to imagen.png) */}
            <svg
              viewBox="0 0 400 700"
              className="w-full h-full max-h-[640px] drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)] z-20 pointer-events-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="dressBlackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1a1c22" />
                  <stop offset="35%" stopColor="#0c0e14" />
                  <stop offset="70%" stopColor="#1e2028" />
                  <stop offset="100%" stopColor="#050608" />
                </linearGradient>

                <linearGradient id="skinToneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f3d1c1" />
                  <stop offset="50%" stopColor="#e8bfae" />
                  <stop offset="100%" stopColor="#dca896" />
                </linearGradient>

                <radialGradient id="diamondShine" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="40%" stopColor="#bbf2f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Head & Elegant Bun Hairstyle with Bangs */}
              {/* Hair bun */}
              <circle cx="236" cy="174" r="14" fill="#181519" />
              {/* Head */}
              <ellipse cx="214" cy="180" rx="14" ry="18" fill="url(#skinToneGrad)" />
              {/* Dark chic hair with bangs */}
              <path d="M 200 174 C 200 162, 228 162, 228 174 C 228 184, 218 180, 200 178 Z" fill="#181519" />
              {/* Face profile and sleek neck */}
              <path d="M 218 194 L 216 218 L 206 218 L 208 194 Z" fill="url(#skinToneGrad)" />

              {/* Graceful Arms Raised in Classical Ballerina Pose */}
              {/* Left arm arched overhead */}
              <path
                d="M 186 226 C 160 190, 140 120, 210 74 C 230 60, 246 80, 230 92 C 180 120, 186 180, 196 226 Z"
                fill="url(#skinToneGrad)"
              />
              {/* Right arm graceful stretch */}
              <path
                d="M 226 226 C 260 170, 310 130, 320 144 C 326 154, 290 190, 240 236 Z"
                fill="url(#skinToneGrad)"
              />

              {/* Plunging V-Neckline & Torso */}
              <path
                d="M 194 226 L 228 226 L 230 310 L 190 310 Z"
                fill="url(#dressBlackGrad)"
              />
              {/* Exposed chest V skin */}
              <polygon points="204,226 218,226 211,280" fill="url(#skinToneGrad)" />

              {/* Long Elegant Black Dress with Split Leg */}
              <path
                d="M 190 310 C 180 380, 160 480, 110 580 C 100 600, 140 600, 170 590 C 200 580, 210 460, 216 380 L 220 310 Z"
                fill="url(#dressBlackGrad)"
              />
              {/* Exposed Leg with High Slit */}
              <path
                d="M 212 360 C 218 420, 224 490, 230 550 C 234 580, 240 590, 242 585 C 248 570, 238 480, 232 400 Z"
                fill="url(#skinToneGrad)"
              />
              {/* Right Side of Black Skirt flowing down */}
              <path
                d="M 226 310 C 240 370, 260 460, 300 570 C 310 590, 260 590, 236 575 C 230 510, 226 420, 222 310 Z"
                fill="url(#dressBlackGrad)"
              />
            </svg>
          </div>

          {/* 💎 FLOATING SPARKLING CUT DIAMONDS (Strictly matching diamonds floating in imagen.png) */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Diamond 1: Top Left */}
            <div className="absolute top-[18%] left-[10%] animate-pulse">
              <svg width="44" height="44" viewBox="0 0 100 100" className="drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
                <polygon points="30,20 70,20 90,45 50,85 10,45" fill="#f8fafc" stroke="#38bdf8" strokeWidth="2" opacity="0.95" />
                <polygon points="30,20 50,45 70,20" fill="#e0f2fe" opacity="0.8" />
                <polygon points="10,45 50,45 30,20" fill="#bae6fd" opacity="0.85" />
                <polygon points="90,45 50,45 70,20" fill="#7dd3fc" opacity="0.8" />
                <polygon points="10,45 50,45 50,85" fill="#38bdf8" opacity="0.75" />
                <polygon points="90,45 50,45 50,85" fill="#0284c7" opacity="0.7" />
              </svg>
            </div>

            {/* Diamond 2: Top Right */}
            <div className="absolute top-[14%] right-[12%] animate-bounce [animation-duration:4s]">
              <svg width="36" height="36" viewBox="0 0 100 100" className="drop-shadow-[0_0_10px_rgba(255,255,255,0.85)]">
                <polygon points="30,20 70,20 90,45 50,85 10,45" fill="#ffffff" stroke="#7dd3fc" strokeWidth="2" opacity="0.95" />
                <polygon points="30,20 50,45 70,20" fill="#e0f2fe" opacity="0.85" />
                <polygon points="10,45 50,45 50,85" fill="#38bdf8" opacity="0.8" />
                <polygon points="90,45 50,45 50,85" fill="#0284c7" opacity="0.75" />
              </svg>
            </div>

            {/* Diamond 3: Mid Right */}
            <div className="absolute top-[32%] right-[8%] animate-pulse [animation-duration:3s]">
              <svg width="48" height="48" viewBox="0 0 100 100" className="drop-shadow-[0_0_14px_rgba(255,255,255,0.95)]">
                <polygon points="30,20 70,20 90,45 50,85 10,45" fill="#f8fafc" stroke="#38bdf8" strokeWidth="2" opacity="0.95" />
                <polygon points="30,20 50,45 70,20" fill="#e0f2fe" opacity="0.8" />
                <polygon points="10,45 50,45 30,20" fill="#bae6fd" opacity="0.85" />
                <polygon points="90,45 50,45 70,20" fill="#7dd3fc" opacity="0.8" />
                <polygon points="10,45 50,45 50,85" fill="#38bdf8" opacity="0.75" />
                <polygon points="90,45 50,45 50,85" fill="#0284c7" opacity="0.7" />
              </svg>
            </div>

            {/* Diamond 4: Mid Left */}
            <div className="absolute top-[42%] left-[6%] animate-bounce [animation-duration:5s]">
              <svg width="38" height="38" viewBox="0 0 100 100" className="drop-shadow-[0_0_10px_rgba(255,255,255,0.85)]">
                <polygon points="30,20 70,20 90,45 50,85 10,45" fill="#ffffff" stroke="#7dd3fc" strokeWidth="2" opacity="0.95" />
                <polygon points="30,20 50,45 70,20" fill="#e0f2fe" opacity="0.85" />
                <polygon points="10,45 50,45 50,85" fill="#38bdf8" opacity="0.8" />
                <polygon points="90,45 50,45 50,85" fill="#0284c7" opacity="0.75" />
              </svg>
            </div>

            {/* Diamond 5: Bottom Left Near Hem */}
            <div className="absolute bottom-[24%] left-[8%] animate-pulse [animation-duration:2.5s]">
              <svg width="52" height="52" viewBox="0 0 100 100" className="drop-shadow-[0_0_16px_rgba(255,255,255,1)]">
                <polygon points="30,20 70,20 90,45 50,85 10,45" fill="#f8fafc" stroke="#38bdf8" strokeWidth="2" opacity="0.95" />
                <polygon points="30,20 50,45 70,20" fill="#e0f2fe" opacity="0.8" />
                <polygon points="10,45 50,45 30,20" fill="#bae6fd" opacity="0.85" />
                <polygon points="90,45 50,45 70,20" fill="#7dd3fc" opacity="0.8" />
                <polygon points="10,45 50,45 50,85" fill="#38bdf8" opacity="0.75" />
                <polygon points="90,45 50,45 50,85" fill="#0284c7" opacity="0.7" />
              </svg>
            </div>

            {/* Diamond 6: Bottom Right Near Hem */}
            <div className="absolute bottom-[28%] right-[10%] animate-pulse [animation-duration:3.5s]">
              <svg width="46" height="46" viewBox="0 0 100 100" className="drop-shadow-[0_0_14px_rgba(255,255,255,0.9)]">
                <polygon points="30,20 70,20 90,45 50,85 10,45" fill="#f8fafc" stroke="#38bdf8" strokeWidth="2" opacity="0.95" />
                <polygon points="30,20 50,45 70,20" fill="#e0f2fe" opacity="0.8" />
                <polygon points="10,45 50,45 30,20" fill="#bae6fd" opacity="0.85" />
                <polygon points="90,45 50,45 70,20" fill="#7dd3fc" opacity="0.8" />
                <polygon points="10,45 50,45 50,85" fill="#38bdf8" opacity="0.75" />
                <polygon points="90,45 50,45 50,85" fill="#0284c7" opacity="0.7" />
              </svg>
            </div>
          </div>

          {/* Rainbow Prism Lens Flare at Bottom of Stage (Matching capture imagen.png) */}
          <div className="absolute bottom-[18%] inset-x-0 h-24 bg-gradient-to-r from-transparent via-cyan-400/30 via-pink-400/35 via-amber-300/30 to-transparent blur-md pointer-events-none" />
        </div>

        {/* 🔻 PANEL DE CONTROL INFERIOR (Idéntico a captura imagen.png) */}
        <div className="relative z-30 w-full px-3 pb-3 sm:pb-3.5 pt-2 flex flex-col items-center pointer-events-auto shrink-0">
          <div className="w-full bg-[#080d19]/95 backdrop-blur-xl border-2 border-cyan-500/80 rounded-[28px] p-2.5 sm:p-3 flex flex-col gap-2 shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
            {/* Top Row: CUENTA ATRÁS 5 min exposición | 4:47 | RONDA 1/10 (50m) */}
            <div className="flex items-center justify-between gap-1.5 px-0.5">
              <div className="text-left shrink-0">
                <span className="text-[7.5px] sm:text-[8px] text-slate-400 font-black uppercase tracking-wider block leading-tight">
                  CUENTA ATRÁS
                </span>
                <span className="text-[10px] sm:text-[11px] text-white font-black block leading-tight">
                  5 min exposición
                </span>
              </div>

              {/* White digital timer pill with bold black digits (Matching imagen.png: 4:47) */}
              <div 
                className="bg-white text-slate-950 font-mono text-xl sm:text-2xl font-black px-4 sm:px-5 py-0.5 rounded-2xl shadow-xl border-0 select-none tracking-tight leading-none"
                id="live-modal-timer-display"
              >
                {formattedTimer}
              </div>

              <div className="text-right shrink-0">
                <span className="text-[7px] sm:text-[7.5px] text-slate-400 block font-black uppercase tracking-wider leading-tight">
                  RONDA
                </span>
                <span className="font-mono text-emerald-400 font-black text-[9px] sm:text-[10px] block leading-tight">
                  {turnNumber}/10 (50m)
                </span>
              </div>
            </div>

            {/* Thin Horizontal Progress Bar Line (Matching imagen.png) */}
            <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Bottom Row: Green [ 🎤 MICRO ON ] and Red [ 🚫 DETENER ] */}
            <div className="grid grid-cols-2 gap-2 mt-0.5">
              {/* Green Microphone Button */}
              <button
                type="button"
                onClick={handleToggleMic}
                className={`py-2 px-3 rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border shadow-lg ${
                  isMicActive
                    ? 'bg-[#00e676] hover:bg-[#00c853] text-slate-950 border-[#00e676] shadow-[0_0_16px_rgba(0,230,118,0.5)]'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                id="btn-live-modal-mic"
                title={isMicActive ? "Silenciar micrófono" : "Activar micrófono"}
              >
                {isMicActive ? (
                  <Mic className="w-3.5 h-3.5 shrink-0 text-slate-950" />
                ) : (
                  <MicOff className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                )}
                <span className="truncate font-black">{isMicActive ? 'MICRO ON' : 'MICRO OFF'}</span>
              </button>

              {/* Red DETENER Button (Matching imagen.png) - Returns to z.png */}
              <button
                type="button"
                onClick={handleClose}
                className="bg-[#ff0022] hover:bg-[#e0001e] text-white font-black text-[10px] sm:text-[11px] py-2 px-3 rounded-2xl shadow-lg uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border border-red-400 shadow-[0_0_16px_rgba(255,0,34,0.45)]"
                id="btn-live-modal-detener"
                title="Detener y volver a la página de exposición (captura z.png)"
              >
                <CameraOff className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate font-black">DETENER</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePresentationImageModal;
