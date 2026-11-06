import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Camera, Square, Volume2, VolumeX, X, Users, Sparkles, ExternalLink, CheckCircle2 } from 'lucide-react';

interface ParticipantItem {
  id: string;
  name: string;
  shortName: string;
  role: string;
  avatar: string;
  isSelf?: boolean;
  projectTitle?: string;
  projectBudget?: string;
}

interface LiveParticipatingRoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionTitle?: string;
  entryFee?: number;
  userProject?: {
    id?: string;
    title?: string;
    category?: string;
    budget?: number | string;
    objective?: string;
    fundUsage?: string;
    coverImage?: string;
  };
  currentUserProfile?: any;
  onNavigateToLiveFeed?: () => void;
}

export const LiveParticipatingRoundModal: React.FC<LiveParticipatingRoundModalProps> = ({
  isOpen,
  onClose,
  sessionTitle = 'ROUND STREETWEAR & URBAN',
  entryFee = 10,
  userProject,
  currentUserProfile,
  onNavigateToLiveFeed
}) => {
  // 10 Participants strictly matching image.png
  const defaultParticipants: ParticipantItem[] = [
    {
      id: 'f-1',
      name: 'Alessia Vance',
      shortName: 'Ales...',
      role: 'MODELO DIRECTORA',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=650',
      projectTitle: 'Luxury Streetwear Runway 2026',
      projectBudget: '25.000€'
    },
    {
      id: 'f-2',
      name: 'Gisele Bündchen',
      shortName: 'Gise...',
      role: 'INVERSORA PRINCIPAL',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650',
      projectTitle: 'Eco-Denim Couture Capsule',
      projectBudget: '15.000€'
    },
    {
      id: 'f-3',
      name: 'Marcus Vance',
      shortName: 'Marc...',
      role: 'ASESOR FINTECH',
      avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=650',
      projectTitle: 'Smart Fabric Sneakers & Wearables',
      projectBudget: '30.000€'
    },
    {
      id: 'f-4',
      name: 'Sienna Cole',
      shortName: 'Sien...',
      role: 'MODELO PATROCINADA',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650',
      projectTitle: 'Urban Vintage Reborn Denim',
      projectBudget: '12.000€'
    },
    {
      id: 'f-5',
      name: 'Liam Cooper',
      shortName: 'Liam',
      role: 'SOCIO INVERSOR',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650',
      projectTitle: 'Modular Streetwear Techwear',
      projectBudget: '20.000€'
    },
    {
      id: 'f-6',
      name: 'Elena Rostova',
      shortName: 'Elena',
      role: 'GESTORA DE CUENTAS',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650',
      projectTitle: 'Cyberpunk Athleisure Collection',
      projectBudget: '18.000€'
    },
    {
      id: 'f-7',
      name: 'David K.',
      shortName: 'David',
      role: 'PATROCINADOR PREMIUM',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=650',
      projectTitle: 'Zero-Waste Hoodie Creative Lab',
      projectBudget: '14.000€'
    },
    {
      id: 'f-8',
      name: 'Sofia Martinez',
      shortName: 'Sofia',
      role: 'PLANIFICADORA FINANCIERA',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=650',
      projectTitle: 'Graffiti Silk Capsule Line',
      projectBudget: '16.000€'
    },
    {
      id: 'f-9',
      name: 'Yasmin Santos',
      shortName: 'Yasm...',
      role: 'LÍDER DE COLECTIVA',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650',
      projectTitle: 'Neon Street Glam Fashion',
      projectBudget: '22.000€'
    },
    {
      id: 'user-10',
      name: currentUserProfile?.name || 'Adriana Lima',
      shortName: 'Adri...',
      role: 'PARTICIPANTE (TÚ)',
      avatar: currentUserProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
      isSelf: true,
      projectTitle: userProject?.title || 'Eco-Fashion Runway',
      projectBudget: `${userProject?.budget || '10.000'}€`
    }
  ];

  const [activeTurnIdx, setActiveTurnIdx] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(205); // 3:25 strictly matching image.png (3*60 + 25 = 205s)
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(false);
  const [volumePercent, setVolumePercent] = useState<number>(88); // 88% matching image.png
  const [isVolumeMuted, setIsVolumeMuted] = useState<boolean>(false);
  const [showProjectsModal, setShowProjectsModal] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string>('🎙️ Voz en directo conectada con Alessia Vance');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(true);

  // Audio effect for clicks and chimes
  const playChime = (freq = 660, duration = 0.25) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  };

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Speech synthesis welcoming
  useEffect(() => {
    if (isOpen) {
      playChime(523, 0.4);
      setTimeout(() => playChime(659, 0.4), 120);
      setTimeout(() => playChime(784, 0.5), 240);
    }
  }, [isOpen]);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentPresenter = defaultParticipants[activeTurnIdx] || defaultParticipants[0];
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formattedTimer = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const progressPercent = Math.min(100, Math.max(5, (timerSeconds / 300) * 100));

  const handleNextTurn = () => {
    playChime(784, 0.3);
    const nextIdx = (activeTurnIdx + 1) % defaultParticipants.length;
    setActiveTurnIdx(nextIdx);
    setTimerSeconds(300);
    const nextPresenter = defaultParticipants[nextIdx];
    setNotificationMsg(`⏱️ Turno ${nextIdx + 1} de 10: ${nextPresenter.name} (5 min de exposición)`);
  };

  const handleSelectParticipant = (idx: number) => {
    playChime(659, 0.25);
    setActiveTurnIdx(idx);
    setTimerSeconds(300);
    const p = defaultParticipants[idx];
    setNotificationMsg(`🎤 Turno ${idx + 1} de 10: ${p.name}`);
  };

  const handleToggleMic = () => {
    playChime(isMicOn ? 440 : 880, 0.2);
    setIsMicOn(prev => !prev);
  };

  const handleToggleVolume = () => {
    setIsVolumeMuted(prev => !prev);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetY = rect.bottom - e.clientY;
    const height = rect.height;
    const newVol = Math.round(Math.max(10, Math.min(100, (offsetY / height) * 100)));
    setVolumePercent(newVol);
    setIsVolumeMuted(false);
    playChime(300 + newVol * 5, 0.15);
  };

  return (
    <div
      className="fixed inset-0 z-[800] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-fade-in font-sans"
      onClick={onClose}
      id="live-participating-round-backdrop"
    >
      {/* 📱 PHONE CONTAINER STRICTLY MATCHING image.png */}
      <div
        className="relative w-full max-w-[420px] max-h-[96vh] sm:max-h-[890px] rounded-[36px] sm:rounded-[44px] overflow-hidden bg-[#070b14] border-2 border-slate-700/80 text-white flex flex-col justify-between shadow-[0_25px_80px_rgba(0,0,0,0.95)] p-3 xs:p-3.5 box-border"
        onClick={(e) => e.stopPropagation()}
        id="live-participating-round-window"
      >
        {/* Top Speaker Notch & Close Button */}
        <div className="w-16 h-1 bg-white/25 rounded-full mx-auto mb-1 shrink-0" />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-4 z-50 bg-black/70 hover:bg-black text-white/80 hover:text-white p-1.5 rounded-full border border-white/20 transition cursor-pointer active:scale-95 shadow-md"
          title="Cerrar ventana"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 1. TOP HEADER NOTCH: 10€ INSCRIPCION • 10 PARTICIPANTES */}
        <div className="w-full flex items-center justify-center text-center pt-0.5 shrink-0">
          <div className="flex items-center justify-center gap-2">
            <span className="h-0.5 w-6 bg-gradient-to-r from-transparent to-[#fe2c55] rounded-full" />
            <div className="bg-[#0b1220]/95 border border-[#fe2c55]/60 text-white px-4 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-[0_0_12px_rgba(254,44,85,0.35)] flex items-center gap-1.5 font-mono">
              <span>10€ INSCRIPCION</span>
              <span className="text-[#fe2c55]">•</span>
              <span>10 PARTICIPANTES</span>
            </div>
            <span className="h-0.5 w-6 bg-gradient-to-l from-transparent to-[#fe2c55] rounded-full" />
          </div>
        </div>

        {/* 2. MAIN CENTER STAGE */}
        <div className="relative w-full flex-1 flex flex-col items-center justify-start my-1.5 min-h-0 overflow-hidden">
          
          {/* 🎛️ VERTICAL VOLUME BAR ON LEFT (Strictly matching image.png 88%) */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center select-none pointer-events-auto">
            <div className="bg-[#08111d]/90 backdrop-blur-md border border-[#00f2fe]/40 rounded-full p-1.5 flex flex-col items-center gap-1 shadow-[0_0_20px_rgba(0,242,254,0.35)]">
              {/* Speaker icon */}
              <button
                type="button"
                onClick={handleToggleVolume}
                className="p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
                title={isVolumeMuted ? "Activar sonido" : "Silenciar"}
              >
                {isVolumeMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#00f2fe] drop-shadow-[0_0_6px_rgba(0,242,254,0.8)]" />
                )}
              </button>

              {/* Cyan slider track */}
              <div
                onClick={handleVolumeClick}
                className="relative w-1.5 h-40 sm:h-48 bg-[#091524] border border-slate-700/80 rounded-full cursor-pointer overflow-hidden flex flex-col justify-end shadow-inner"
                title={`Volumen: ${isVolumeMuted ? 0 : volumePercent}% (clic para cambiar)`}
              >
                <div
                  className="w-full rounded-full transition-all duration-100 bg-gradient-to-t from-emerald-400 via-teal-300 to-[#00f2fe] shadow-[0_0_12px_rgba(0,242,254,0.9)]"
                  style={{ height: `${isVolumeMuted ? 0 : volumePercent}%` }}
                />
              </div>

              {/* Text percent label: 88% */}
              <span className="text-[7.5px] font-mono font-black text-white tracking-tighter drop-shadow-md">
                {isVolumeMuted ? '0%' : `${volumePercent}%`}
              </span>
            </div>
          </div>

          {/* TURN BADGE: 🟢 🔴 TURNO 1 DE 10 • EN EXPOSICIÓN */}
          <button
            type="button"
            onClick={handleNextTurn}
            className="inline-flex items-center gap-1.5 bg-[#0a2019]/90 border border-emerald-400/80 text-emerald-300 hover:text-white px-3.5 py-1 rounded-full text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider mb-2 shadow-[0_0_14px_rgba(52,211,153,0.3)] transition active:scale-95 cursor-pointer"
            title="Clic para avanzar de turno"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
            <span className="w-2 h-2 rounded-full bg-[#fe2c55] animate-ping" />
            <span>TURNO {activeTurnIdx + 1} DE 10 • EN EXPOSICIÓN</span>
          </button>

          {/* PRESENTER SPOTLIGHT: Avatar, Alessia Vance, MODELO DIRECTORA, etc. */}
          <div className="flex flex-col items-center text-center gap-0.5 mb-2">
            {/* Circle Avatar with green border & EN VIVO badge */}
            <div className="relative">
              <img
                src={currentPresenter.avatar}
                alt={currentPresenter.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.5)]"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#fe2c55] text-white text-[7.5px] sm:text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-md">
                EN VIVO
              </span>
            </div>

            {/* Presenter Name */}
            <h3 className="text-white font-black text-sm sm:text-base mt-2 tracking-tight leading-tight">
              {currentPresenter.name}
            </h3>

            {/* Role */}
            <span className="text-[9px] sm:text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider">
              {currentPresenter.role}
            </span>

            {/* Subtitle */}
            <span className="text-[8px] text-slate-400 italic">
              Exposición de 5 minutos en directo
            </span>

            {/* Voice Connection Pill Button: 🟢 Voz en directo conectada ||| */}
            <button
              type="button"
              onClick={() => {
                setIsSpeaking(prev => !prev);
                playChime(isSpeaking ? 500 : 750, 0.3);
              }}
              className="inline-flex items-center gap-1.5 mt-1 bg-[#09221b]/90 border border-emerald-500/70 text-emerald-300 px-3 py-0.5 rounded-full text-[8.5px] font-extrabold shadow-sm hover:border-emerald-400 transition cursor-pointer active:scale-95"
            >
              <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 ${isSpeaking ? 'animate-ping' : ''}`} />
              <span>Voz en directo conectada</span>
              <span className="inline-flex items-end gap-0.5 h-2.5 ml-0.5">
                <span className={`w-0.5 bg-emerald-400 ${isSpeaking ? 'h-2 animate-pulse' : 'h-1'}`} />
                <span className={`w-0.5 bg-emerald-400 ${isSpeaking ? 'h-3 animate-pulse delay-75' : 'h-1.5'}`} />
                <span className={`w-0.5 bg-emerald-400 ${isSpeaking ? 'h-2.5 animate-pulse delay-150' : 'h-1'}`} />
              </span>
            </button>
          </div>

          {/* COUNTDOWN TIMER WIDGET (Matching image.png: 3:25, CUENTA ATRÁS 5 min exposición, RONDA 1/10 (50m)) */}
          <div className="w-full max-w-[340px] bg-[#0c1424] border border-cyan-500/50 rounded-2xl p-2 sm:p-2.5 flex flex-col gap-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.8)] mb-2">
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-1.5 text-left shrink-0">
                <span className="text-sm">⏰</span>
                <div>
                  <span className="text-[7.5px] text-slate-400 font-black uppercase tracking-wider block leading-tight">
                    CUENTA ATRÁS
                  </span>
                  <span className="text-[10px] text-white font-extrabold block leading-tight">
                    5 min exposición
                  </span>
                </div>
              </div>

              {/* White digital pill timer: 3:25 */}
              <button
                type="button"
                onClick={() => {
                  playChime(880, 0.2);
                  setTimerSeconds(prev => (prev > 10 ? prev - 30 : 300));
                }}
                className="bg-white hover:bg-slate-100 text-[#070b14] font-mono text-xl sm:text-2xl font-black px-4 sm:px-5 py-0.5 sm:py-1 rounded-2xl shadow-xl border-0 select-none tracking-tight cursor-pointer active:scale-95 transition"
                title="Clic para avanzar la cuenta atrás"
              >
                {formattedTimer}
              </button>

              <div className="text-right shrink-0">
                <span className="text-[7px] text-slate-400 block font-black uppercase tracking-wider leading-tight">
                  RONDA
                </span>
                <span className="font-mono text-emerald-400 font-black text-[9.5px] sm:text-[10.5px] block leading-tight">
                  {activeTurnIdx + 1}/10 (50m)
                </span>
              </div>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-[#fe2c55] rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* ACTION BUTTONS (Row 1: MICRO ON / FINALIZAR; Row 2: LIVE) */}
          <div className="w-full max-w-[340px] flex flex-col gap-1.5 mb-2">
            <div className="grid grid-cols-2 gap-2">
              {/* Green MICRO ON */}
              <button
                type="button"
                onClick={handleToggleMic}
                className={`py-2 px-3 rounded-xl font-black text-[10px] sm:text-[11px] uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border shadow-lg ${
                  isMicOn
                    ? 'bg-[#00c853] hover:bg-[#00b248] text-white border-[#00c853] shadow-[0_0_14px_rgba(0,200,83,0.5)]'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {isMicOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                <span>{isMicOn ? 'MICRO ON' : 'MICRO OFF'}</span>
              </button>

              {/* Red FINALIZAR */}
              <button
                type="button"
                onClick={handleNextTurn}
                className="bg-[#fe2c55] hover:bg-[#e02447] text-white font-black text-[10px] sm:text-[11px] py-2 px-3 rounded-xl shadow-lg uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border border-rose-400"
              >
                <Square className="w-3 h-3 fill-white" />
                <span>FINALIZAR</span>
              </button>
            </div>

            {/* White LIVE button */}
            <button
              type="button"
              onClick={() => {
                playChime(660, 0.2);
                setIsLiveActive(prev => !prev);
              }}
              className="w-full bg-white hover:bg-slate-100 text-slate-950 font-black text-[10.5px] sm:text-[11px] py-2 px-3 rounded-xl uppercase tracking-wider transition active:scale-95 shadow-md border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isLiveActive ? 'DETENER LIVE' : 'LIVE'}</span>
            </button>
          </div>
        </div>

        {/* 3. LOWER SECTION: ROUND STREETWEAR & URBAN + 10 PARTICIPANTS GRID */}
        <div className="w-full bg-[#0B0F19]/95 backdrop-blur-md border border-slate-800 rounded-3xl p-2.5 sm:p-3 shadow-[0_12px_40px_rgba(0,0,0,0.95)] flex flex-col gap-2 shrink-0">
          
          {/* Header: Title left, 10 ONLINE right */}
          <div className="flex items-center justify-between px-1 w-full gap-2">
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500/50 shrink-0" />
              <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-wider text-white truncate font-sans">
                {sessionTitle}
              </span>
            </div>
            <span className="bg-[#fe2c55] text-white text-[8px] sm:text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm animate-pulse shrink-0">
              10 ONLINE
            </span>
          </div>

          {/* 2x5 Grid of 10 participants */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 select-none w-full max-w-full mx-auto box-border">
            {defaultParticipants.map((userObj, idx) => {
              const isSelected = idx === activeTurnIdx;
              const isSelf = userObj.isSelf || idx === 9;

              return (
                <button
                  key={userObj.id}
                  type="button"
                  onClick={() => handleSelectParticipant(idx)}
                  className={`aspect-square rounded-xl sm:rounded-2xl overflow-hidden relative border transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md flex flex-col justify-start p-1 box-border cursor-pointer ${
                    isSelected
                      ? 'border-2 border-[#fe2c55] ring-2 ring-[#fe2c55]/90 shadow-[0_0_14px_rgba(254,44,85,0.9)] scale-[1.03]'
                      : isSelf
                        ? 'border-2 border-emerald-400 ring-1 ring-emerald-400/80'
                        : 'border border-slate-700/80 hover:border-white/80 bg-slate-900'
                  }`}
                  title={`${userObj.name} (${userObj.role})`}
                >
                  <img
                    src={userObj.avatar}
                    alt={userObj.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Top-right red dot matching image.png */}
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-black/50 shadow-sm animate-pulse z-10 bg-[#fe2c55]" />

                  {/* Name pill at bottom */}
                  <div className="relative z-10 self-center backdrop-blur-xs text-center py-0.5 px-1 min-w-0 max-w-[92%] overflow-hidden rounded-md box-border shadow-md bg-black/85 mt-auto">
                    <span className="text-[7.5px] sm:text-[8.5px] font-black block truncate leading-tight text-white">
                      {userObj.shortName}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Button 1: ✍️ Estás inscrita como participante (10 euros) */}
          <button
            type="button"
            onClick={() => {
              playChime(880, 0.3);
              setNotificationMsg(`✅ Estás inscrita en la ${sessionTitle} con tu proyecto: ${userProject?.title || 'Eco-Fashion Runway'}`);
            }}
            className="w-full py-2 px-3 rounded-full font-black text-[10.5px] sm:text-[11.5px] uppercase tracking-wide transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 border bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:via-rose-500 text-white border-red-400 shadow-[0_0_22px_rgba(239,68,68,0.7)] ring-2 ring-red-400/80 animate-pulse font-sans"
            title="Tu inscripción de 10 euros está confirmada"
          >
            <span className="text-sm">✍️</span>
            <span className="truncate">Estás inscrita como participante ({entryFee} euros)</span>
          </button>

          {/* Button 2: 📋 TOTAL PROYECTOS */}
          <button
            type="button"
            onClick={() => {
              playChime(660, 0.25);
              setShowProjectsModal(true);
            }}
            className="w-full bg-white hover:bg-slate-100 text-slate-950 active:scale-95 font-black text-[10.5px] sm:text-[11.5px] py-2 px-4 rounded-full transition border border-slate-200 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider font-sans shadow-md"
            title="Ver los 10 proyectos de los participantes"
          >
            <span className="text-sm">📋</span>
            <span>TOTAL PROYECTOS</span>
          </button>
        </div>

        {/* Bottom Shortcut to full-screen live feed */}
        {onNavigateToLiveFeed && (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigateToLiveFeed();
              }}
              className="text-[10px] text-slate-400 hover:text-emerald-400 transition inline-flex items-center gap-1 cursor-pointer font-bold"
            >
              <span>Ver en canal completo de emisiones</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* 📋 MODAL DE TOTAL PROYECTOS DE LA RONDA */}
      {showProjectsModal && (
        <div
          className="fixed inset-0 z-[900] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-fade-in"
          onClick={() => setShowProjectsModal(false)}
        >
          <div
            className="bg-[#0f172a] border border-pink-400/60 rounded-3xl w-full max-w-lg p-5 sm:p-6 text-white relative shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">📋</span>
                <h3 className="text-sm sm:text-base font-black uppercase text-pink-300">
                  Total Proyectos • {sessionTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProjectsModal(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {defaultParticipants.map((p, idx) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                    p.isSelf
                      ? 'bg-rose-950/40 border-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-10 h-10 rounded-full object-cover border border-pink-400 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white truncate">{p.name}</span>
                        {p.isSelf && (
                          <span className="bg-rose-600 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full">
                            Tú
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-pink-300 font-bold truncate">{p.projectTitle}</p>
                      <span className="text-[9px] text-slate-400">{p.role}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono">
                    <span className="text-[10px] text-slate-400 block">Presupuesto</span>
                    <span className="text-xs font-black text-emerald-400">{p.projectBudget}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowProjectsModal(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Cerrar Lista de Proyectos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveParticipatingRoundModal;
