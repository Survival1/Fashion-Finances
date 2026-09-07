import React, { useEffect, useState, useRef } from 'react';
import { Users, CheckCircle2, ShieldCheck, Zap, Sparkles, ArrowRight, X, Eye, EyeOff, Minimize2, Maximize2 } from 'lucide-react';

export interface GatheringParticipant {
  id: string;
  name: string;
  username?: string;
  avatar: string;
  role?: string;
  projectTitle?: string;
}

interface ParticipantsGatheringModalProps {
  isOpen: boolean;
  sessionTitle?: string;
  entryFee?: number;
  participantsList?: GatheringParticipant[];
  onComplete: () => void;
  onClose?: () => void;
}

const DEFAULT_EMPRESARIOS: GatheringParticipant[] = [
  { id: 'emp-1', name: 'Alexander Wright', username: 'alex_wright_ceo', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=650', role: 'CEO Haute Couture', projectTitle: 'EcoCouture Sustainable Runway' },
  { id: 'emp-2', name: 'Victoria Sterling', username: 'victoria_sterling', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Dir. Expansión Global', projectTitle: 'AI Fashion Sizing Platform' },
  { id: 'emp-3', name: 'Bruno Rossi', username: 'bruno_rossi_milan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650', role: 'Presidente Textil Milano', projectTitle: 'NextGen Smart Fabrics' },
  { id: 'emp-4', name: 'Isabella Fontana', username: 'isabella_creative', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Directora Creativa', projectTitle: 'Luxury Digital Atelier' },
  { id: 'emp-5', name: 'Maximilian Weber', username: 'max_weber_ops', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=650', role: 'Dir. Operaciones', projectTitle: 'Supply Chain Zero Waste' },
  { id: 'emp-6', name: 'Claudia Mendez', username: 'claudia_tech', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650', role: 'Fundadora FashionTech', projectTitle: '3D Virtual Fitting Rooms' },
  { id: 'emp-7', name: 'Roberto Conti', username: 'roberto_consejero', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=650', role: 'Consejero Delegado', projectTitle: 'Pre-Loved Luxury Blockchain' },
  { id: 'emp-8', name: 'Valerie Dupont', username: 'valerie_dupont_paris', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650', role: 'Dir. Franquicias', projectTitle: 'Pop-Up Fashion Hubs' },
  { id: 'emp-9', name: 'Fernando Alarcón', username: 'fernando_corp', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=650', role: 'Inversor Corporativo', projectTitle: 'Bio-leather Innovation Lab' },
  { id: 'emp-10', name: 'Olivia Bennett', username: 'olivia_strategy', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650', role: 'Consultora Estratégica', projectTitle: 'Circular Fashion Token' }
];

export const ParticipantsGatheringModal: React.FC<ParticipantsGatheringModalProps> = ({
  isOpen,
  sessionTitle = 'MESA DE EMPRESARIOS #1',
  entryFee = 100,
  participantsList,
  onComplete,
  onClose
}) => {
  const [joinedCount, setJoinedCount] = useState<number>(1);
  const [activityLogs, setActivityLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isTransparentMode, setIsTransparentMode] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const intervalRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const finalParticipants = (participantsList && participantsList.length >= 10)
    ? participantsList.slice(0, 10)
    : DEFAULT_EMPRESARIOS;

  // Sound generator helper
  const playJoinChime = (count: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Pitch goes higher with each participant
      const baseFreq = 440 + count * 55;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {
      // Audio fallback
    }
  };

  const playFanfare = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.18, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc.start();
          osc.stop(ctx.currentTime + 0.35);
        }, idx * 100);
      });
    } catch (e) {
      // Audio fallback
    }
  };

  // Start simulation of joining entrepreneurs
  useEffect(() => {
    if (!isOpen) {
      setJoinedCount(1);
      setActivityLogs([]);
      setIsCompleted(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Initial participant #1
    const p1 = finalParticipants[0];
    setJoinedCount(1);
    setActivityLogs([
      `✅ #${p1 ? p1.name : 'Alexander'} ha abonado ${entryFee},00€ y se ha unido a la mesa.`
    ]);
    playJoinChime(1);

    let current = 1;
    intervalRef.current = setInterval(() => {
      current += 1;
      if (current <= 10) {
        const p = finalParticipants[current - 1];
        const pName = p ? p.name : `Emprendedor #${current}`;
        setJoinedCount(current);
        setActivityLogs(prev => [
          `✅ #${current} ${pName} ha abonado ${entryFee},00€ y se ha unido a la mesa.`,
          ...prev.slice(0, 4)
        ]);
        playJoinChime(current);

        if (current === 10) {
          setIsCompleted(true);
          playFanfare();
          clearInterval(intervalRef.current);
          setTimeout(() => {
            onComplete();
          }, 1400);
        }
      }
    }, 1800);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalGathered = joinedCount * entryFee;
  const targetTotal = 10 * entryFee;
  const progressPercent = (joinedCount / 10) * 100;

  // Render Minimized Floating Widget in bottom right so background is 100% visible & accessible
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-[99999] animate-fade-in font-sans select-none pointer-events-auto">
        <div className="bg-[#0c1322]/95 backdrop-blur-xl border-2 border-emerald-500/90 rounded-2xl p-3 shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-3 text-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fe2c55] animate-pulse shrink-0" />
            <div>
              <span className="text-[9px] font-black uppercase text-emerald-400 block tracking-wider">
                SALA DE ESPERA ({joinedCount}/10)
              </span>
              <span className="text-xs font-black text-white block truncate max-w-[160px]">
                {sessionTitle}
              </span>
            </div>
          </div>

          <div className="bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-mono font-black text-xs px-2 py-1 rounded-lg">
            {totalGathered.toFixed(0)}€ / {targetTotal.toFixed(0)}€
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white rounded-lg transition cursor-pointer"
              title="Expandir Sala de Espera"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 transition-all duration-300 font-sans select-none ${
        isTransparentMode
          ? 'bg-black/15 backdrop-blur-[1px] pointer-events-none'
          : 'bg-black/40 backdrop-blur-[2px] pointer-events-auto'
      }`}
      id="modal-participants-gathering-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          // Backdrop click
        }
      }}
    >
      <div
        className={`w-full max-w-[540px] border-2 rounded-3xl p-4 sm:p-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] flex flex-col gap-4 text-white animate-scale-in relative overflow-hidden pointer-events-auto transition-all duration-300 ${
          isTransparentMode
            ? 'bg-[#0c1322]/75 backdrop-blur-md border-emerald-400/90 ring-2 ring-emerald-400/40 shadow-2xl'
            : 'bg-[#0c1322]/95 backdrop-blur-2xl border-emerald-500/80'
        }`}
        id="modal-participants-gathering-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-24 bg-emerald-500/20 blur-3xl pointer-events-none rounded-full" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fe2c55] animate-pulse shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                SALA DE ESPERA EN DIRECTO
              </span>
              <h3 className="text-sm sm:text-base font-black text-white m-0 tracking-wide">
                {sessionTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 font-mono font-black text-xs sm:text-sm px-2.5 py-1 rounded-xl shadow-inner">
              {totalGathered.toFixed(2).replace('.', ',')} € / {targetTotal.toFixed(2).replace('.', ',')} €
            </span>

            {/* Ver Fondo / Fondo Transparente Button */}
            <button
              type="button"
              onClick={() => setIsTransparentMode(!isTransparentMode)}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl border flex items-center gap-1 text-[11px] font-extrabold transition cursor-pointer active:scale-95 ${
                isTransparentMode
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-500'
              }`}
              title={isTransparentMode ? "Restaurar fondo opaco" : "Ver el fondo de la página en directo"}
            >
              {isTransparentMode ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">Opaco</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Ver Fondo</span>
                </>
              )}
            </button>

            {/* Minimize button */}
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition border border-slate-700 cursor-pointer"
              title="Minimizar a esquina para ver toda la página"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800/90 hover:bg-rose-950 text-slate-400 hover:text-rose-400 flex items-center justify-center transition border border-slate-700 cursor-pointer"
                title="Cerrar y ver página"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status Callout & Progress Bar */}
        <div className="bg-[#070b14]/85 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-2.5 relative z-10 text-left backdrop-blur-xs">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2 text-emerald-400">
              <Users className="w-4 h-4 animate-bounce" />
              <span className="font-extrabold uppercase tracking-wider text-[11px] sm:text-xs">
                {isCompleted
                  ? '🎉 ¡10/10 PARTICIPANTES COMPLETADOS!'
                  : `SUMANDO PARTICIPANTES (${joinedCount}/10)`}
              </span>
            </div>
            <span className="font-mono text-xs sm:text-sm font-black text-emerald-300">
              {Math.round(progressPercent)}%
            </span>
          </div>

          {/* Animated Glowing Progress Bar */}
          <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800 p-0.5 relative">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-full rounded-full transition-all duration-300 relative shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
            <span>Cuota por participante: {entryFee},00 €</span>
            <span className="text-emerald-400 font-bold">
              {isCompleted ? 'Mesa Completa • Abriendo Canal' : `Faltan ${10 - joinedCount} por entrar`}
            </span>
          </div>
        </div>

        {/* 10-Participants Visual Grid (2 Rows of 5) */}
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              ESTADO DE LOS 10 EMPRENDEDORES:
            </span>
            <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              <span>Verificación de Pago Instantánea</span>
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
            {finalParticipants.map((p, idx) => {
              const slotNumber = idx + 1;
              const isJoined = slotNumber <= joinedCount;
              const isJustJoined = slotNumber === joinedCount;

              return (
                <div
                  key={p.id || idx}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 flex flex-col justify-between p-1 shadow-md ${
                    isJoined
                      ? isJustJoined
                        ? 'border-emerald-400 ring-2 ring-emerald-400/80 scale-105 bg-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                        : 'border-emerald-500/70 bg-slate-900'
                      : 'border-slate-800 bg-slate-950/80 opacity-40'
                  }`}
                >
                  {isJoined ? (
                    <>
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* Slot number badge */}
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span className="bg-black/80 backdrop-blur-xs text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded font-mono">
                          #{slotNumber}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[#fe2c55] border border-black shadow-xs" />
                      </div>

                      {/* Name pill */}
                      <div className="relative z-10 w-full flex justify-center pb-0.5">
                        <span className="bg-black/90 backdrop-blur-xs text-white font-black text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-md truncate max-w-full text-center">
                          {p.name.split(' ')[0]}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-1 text-center">
                      <span className="text-[10px] font-mono font-bold text-slate-500">#{slotNumber}</span>
                      <span className="text-[7.5px] font-bold text-slate-600 uppercase">Libre</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Feed Ticker */}
        <div className="bg-[#070b14]/85 border border-slate-800 rounded-xl px-3 py-2 text-left relative z-10 overflow-hidden backdrop-blur-xs">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">
              REGISTRO EN TIEMPO REAL
            </span>
          </div>
          <div className="space-y-0.5 text-[10px] sm:text-[11px] font-semibold text-slate-300 max-h-12 overflow-y-auto">
            {activityLogs.map((log, lIdx) => (
              <p key={lIdx} className="m-0 truncate leading-tight text-slate-300">
                {log}
              </p>
            ))}
          </div>
        </div>

        {/* Footer Action */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-800/80 relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] sm:text-[11px]">Bolsa de 1.000€ protegida en escrow</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setJoinedCount(10);
              setIsCompleted(true);
              playFanfare();
              setTimeout(() => {
                onComplete();
              }, 400);
            }}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/30 border border-emerald-400"
          >
            <span>{isCompleted ? 'Accediendo...' : 'Acelerar / Entrar ya'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsGatheringModal;
