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
  roundRef?: string;
  entryFee?: number;
  participantsList?: GatheringParticipant[];
  currentUserProfile?: any;
  userSlotIndex?: number;
  onComplete: (participants?: GatheringParticipant[]) => void;
  onClose?: () => void;
}

const DEFAULT_TRABAJADORES: GatheringParticipant[] = [
  { id: 'trab-1', name: 'Lucas Torres', username: 'lucas_torres_design', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=650', role: 'Diseñador Gráfico', projectTitle: 'Urban Streetwear Collection' },
  { id: 'trab-2', name: 'Clara Vega', username: 'clara_patronaje', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650', role: 'Patronista Textil', projectTitle: 'Eco-Textile Patterning' },
  { id: 'trab-3', name: 'Mateo Ruiz', username: 'mateo_fotografo', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=650', role: 'Fotógrafo de Moda', projectTitle: 'Digital Lookbook Studio' },
  { id: 'trab-4', name: 'Paula Gómez', username: 'paula_estilista', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650', role: 'Estilista Senior', projectTitle: 'Sustainable Styling AI' },
  { id: 'trab-5', name: 'Hugo Silva', username: 'hugo_luces', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650', role: 'Técnico Iluminación', projectTitle: 'Smart Runway Lighting' },
  { id: 'trab-6', name: 'Natalia Cruz', username: 'natalia_costura', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650', role: 'Costurera Alta Costura', projectTitle: 'Zero-Waste Garment Craft' },
  { id: 'trab-7', name: 'Álvaro Díaz', username: 'alvaro_makeup', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=650', role: 'Maquillador Profesional', projectTitle: 'Organic Glow Cosmetics' },
  { id: 'trab-8', name: 'Lucía Navarro', username: 'lucia_produccion', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Asistente Producción', projectTitle: 'Fashion Event Engine' },
  { id: 'trab-9', name: 'Daniel Morales', username: 'daniel_3d_moda', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=650', role: 'Modelista Digital', projectTitle: 'Metaverse 3D Avatar Fashion' },
  { id: 'trab-10', name: 'Marina Soler', username: 'marinasoler', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=650', role: 'Community Manager', projectTitle: 'Fashion Community Hub' }
];

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
  sessionTitle = 'Round STREETWEAR & URBAN',
  roundRef,
  entryFee = 10,
  participantsList,
  currentUserProfile,
  userSlotIndex,
  onComplete,
  onClose
}) => {
  const is10EuroSession = Boolean(entryFee === 10 || sessionTitle.toUpperCase().includes('STREETWEAR'));
  const effectiveRoundRef = roundRef || (is10EuroSession ? 'Ref:1' : entryFee === 100 ? 'Ref:2' : entryFee === 1000 ? 'Ref:3' : entryFee === 10000 ? 'Ref:4' : entryFee === 100000 ? 'Ref:5' : 'Ref:6');
  const [joinedCount, setJoinedCount] = useState<number>(userSlotIndex !== undefined ? userSlotIndex : (is10EuroSession ? 7 : 1));
  const [activityLogs, setActivityLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isTransparentMode, setIsTransparentMode] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const intervalRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Determine active logged-in user (defaulting to Adriana Lima)
  const activeUser = currentUserProfile || (() => {
    try {
      const stored = localStorage.getItem('user_profile') || localStorage.getItem('current_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name) return parsed;
      }
    } catch (e) {}
    return {
      id: 'user-adriana',
      name: 'Adriana Lima',
      username: 'adrianalima',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
      role: 'Usuario Inversor (Tú)'
    };
  })();

  const activeUserId = activeUser?.id || 'user-adriana';
  const activeUserName = activeUser?.name || 'Adriana Lima';
  const activeUserAvatar = activeUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650';

  // Check if active user already exists in participantsList
  const existingUserIndex = participantsList
    ? participantsList.findIndex(p =>
        p.id === activeUserId ||
        p.id === 'user-adriana' ||
        p.name.toLowerCase() === activeUserName.toLowerCase() ||
        p.name.toLowerCase().includes('adriana') ||
        (p.role && p.role.includes('(Tú)'))
      )
    : -1;

  // Stored or provided arrival slot (for 10€ session, slot is 7 which corresponds to Puesto #8 as shown in z.png)
  const storedSlot = typeof window !== 'undefined' ? localStorage.getItem('finanzas_user_slot_index') : null;
  const targetSlotIndex = existingUserIndex !== -1
    ? existingUserIndex
    : (userSlotIndex !== undefined
        ? Math.max(0, Math.min(9, userSlotIndex))
        : (storedSlot !== null && !isNaN(Number(storedSlot))
            ? Math.max(0, Math.min(9, Number(storedSlot)))
            : (is10EuroSession ? 7 : 9)));

  const userParticipant: any = {
    id: activeUserId,
    name: `${activeUserName} (Tú)`,
    username: activeUser.username || 'adrianalima',
    avatar: activeUserAvatar,
    role: `Usuario Inversor (Tú • Puesto #${targetSlotIndex + 1})`,
    projectTitle: 'Eco-Fashion Runway',
    isSelf: true
  };

  // Base pool of peers (Trabajadores for 10€ Streetwear round, Empresarios otherwise)
  const defaultCategoryList = is10EuroSession ? DEFAULT_TRABAJADORES : DEFAULT_EMPRESARIOS;
  const basePool = (participantsList && participantsList.length > 0)
    ? participantsList
    : defaultCategoryList;

  // Filter peers so user is not duplicated
  const cleanPeers = basePool.filter(p =>
    p.id !== activeUserId &&
    p.id !== 'user-adriana' &&
    p.name.toLowerCase() !== activeUserName.toLowerCase() &&
    !p.name.toLowerCase().includes('adriana') &&
    !(p.role && p.role.includes('(Tú)'))
  );

  // Fallback peers if cleanPeers is too short
  const fallbackPeers = defaultCategoryList.filter(p =>
    p.id !== activeUserId &&
    p.id !== 'user-adriana' &&
    p.name.toLowerCase() !== activeUserName.toLowerCase() &&
    !p.name.toLowerCase().includes('adriana')
  );

  const fullPeers = [...cleanPeers];
  for (const fp of fallbackPeers) {
    if (fullPeers.length >= 9) break;
    if (!fullPeers.some(p => p.name === fp.name)) {
      fullPeers.push(fp);
    }
  }

  // Insert active user strictly at targetSlotIndex
  const peersBefore = fullPeers.slice(0, targetSlotIndex);
  const peersAfter = fullPeers.slice(targetSlotIndex, 9);
  const finalParticipants: GatheringParticipant[] = [
    ...peersBefore,
    userParticipant,
    ...peersAfter
  ].slice(0, 10);

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

  // Start simulation of joining entrepreneurs following arrival order
  useEffect(() => {
    if (!isOpen) {
      setJoinedCount(targetSlotIndex !== undefined ? targetSlotIndex : 1);
      setActivityLogs([]);
      setIsCompleted(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Determine initial participants who arrived before the user
    const initialCount = Math.max(0, Math.min(9, targetSlotIndex));
    setJoinedCount(initialCount);

    const initialLogs: string[] = [];
    for (let i = initialCount; i >= 1 && initialLogs.length < 4; i--) {
      const p = finalParticipants[i - 1];
      const isCurrentPUser = p && (
        p.id === activeUserId || 
        p.id === 'user-adriana' || 
        p.name.toLowerCase().includes('adriana') || 
        p.name.toLowerCase() === activeUserName.toLowerCase() ||
        (p.role && p.role.includes('(Tú)'))
      );
      const pName = isCurrentPUser 
        ? (p.name.includes('(Tú)') ? p.name : `${p.name} (Tú)`) 
        : (p ? p.name : `Emprendedor #${i}`);
      initialLogs.push(`🌸 #${i} ${pName} ha abonado ${entryFee},00€ y se ha unido a la mesa.`);
    }

    if (initialLogs.length > 0) {
      setActivityLogs(initialLogs);
      playJoinChime(initialCount);
    } else {
      setActivityLogs([]);
    }

    let current = initialCount;
    intervalRef.current = setInterval(() => {
      current += 1;
      if (current <= 10) {
        const p = finalParticipants[current - 1];
        const isCurrentPUser = p && (
          p.id === activeUserId || 
          p.id === 'user-adriana' || 
          p.name.toLowerCase().includes('adriana') || 
          p.name.toLowerCase() === activeUserName.toLowerCase() ||
          (p.role && p.role.includes('(Tú)'))
        );
        const pName = isCurrentPUser 
          ? (p.name.includes('(Tú)') ? p.name : `${p.name} (Tú)`) 
          : (p ? p.name : `Emprendedor #${current}`);
        setJoinedCount(current);
        setActivityLogs(prev => [
          isCurrentPUser
            ? `🎉 #${current} ${pName} ha disparado el pago de ${entryFee},00€ y se ha unido a la ronda.`
            : `🌸 #${current} ${pName} ha abonado ${entryFee},00€ y se ha unido a la mesa.`,
          ...prev.slice(0, 4)
        ]);
        playJoinChime(current);

        if (current === 10) {
          setIsCompleted(true);
          playFanfare();
          clearInterval(intervalRef.current);
          setTimeout(() => {
            onComplete(finalParticipants);
          }, 1400);
        }
      }
    }, 1500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, targetSlotIndex, entryFee, sessionTitle]);

  if (!isOpen) return null;

  const totalGathered = joinedCount * entryFee;
  const targetTotal = 10 * entryFee;
  const progressPercent = (joinedCount / 10) * 100;

  // Render Minimized Floating Widget in bottom right so background is 100% visible & accessible
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-[99999] animate-fade-in font-sans select-none pointer-events-auto">
        <div className="bg-white border-2 border-[#F4A8B9] rounded-2xl p-3 shadow-[0_10px_30px_rgba(244,168,185,0.4)] flex items-center gap-3 text-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fe2c55] animate-pulse shrink-0" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black uppercase text-[#C23B65] block tracking-wider">
                  SALA DE ESPERA ({joinedCount}/10)
                </span>
                <span className="text-[8px] font-mono font-bold bg-[#FFE4E8] text-[#9E2A4B] border border-[#F4A8B9] px-1 py-0.2 rounded-md">
                  {effectiveRoundRef}
                </span>
              </div>
              <span className="text-xs font-black text-slate-900 block truncate max-w-[160px]">
                {sessionTitle}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#FFF0F3] to-[#FFE4E8] border border-[#F4A8B9] text-[#9E2A4B] font-mono font-black text-xs px-2 py-1 rounded-lg">
            {totalGathered.toFixed(0)}€ / {targetTotal.toFixed(0)}€
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              className="p-1.5 bg-slate-100 hover:bg-rose-100 text-[#9E2A4B] rounded-lg transition cursor-pointer border border-slate-200"
              title="Expandir Sala de Espera"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-[#9E2A4B] rounded-lg transition cursor-pointer border border-slate-200"
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
          : 'bg-slate-900/40 backdrop-blur-[3px] pointer-events-auto'
      }`}
      id="modal-participants-gathering-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          // Backdrop click
        }
      }}
    >
      <div
        className="w-full max-w-[540px] border-2 border-[#F4A8B9]/80 rounded-3xl p-4 sm:p-6 shadow-[0_25px_70px_rgba(0,0,0,0.18),0_0_40px_rgba(244,168,185,0.3)] flex flex-col gap-4 text-slate-800 animate-scale-in relative overflow-hidden pointer-events-auto transition-all duration-300 bg-white"
        id="modal-participants-gathering-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow (Rosa Perla) */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-24 bg-[#FFD1DC]/40 blur-3xl pointer-events-none rounded-full" />

        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-2 border-b border-rose-100 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fe2c55] animate-pulse shrink-0" />
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-[#D85A7F] tracking-wider">
                  SALA DE ESPERA EN DIRECTO
                </span>
                <span className="text-[9px] font-mono font-bold bg-[#FFE4E8] text-[#9E2A4B] border border-[#F4A8B9] px-1.5 py-0.2 rounded-md">
                  {effectiveRoundRef}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-slate-900 m-0 tracking-wide">
                {sessionTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="bg-gradient-to-r from-[#FFF0F3] to-[#FFE4E8] border border-[#F4A8B9] text-[#9E2A4B] font-mono font-black text-xs sm:text-sm px-2.5 py-1 rounded-xl shadow-xs">
              {totalGathered.toFixed(2).replace('.', ',')} € / {targetTotal.toFixed(2).replace('.', ',')} €
            </span>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-100 hover:bg-rose-100/70 text-slate-400 hover:text-[#9E2A4B] flex items-center justify-center transition border border-slate-200 cursor-pointer"
                title="Cerrar y ver página"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status Callout & Progress Bar (Rosa Perla & Fondo Blanco) */}
        <div className="bg-[#FFF8FA] border border-[#F8D2DC] rounded-2xl p-3 sm:p-4 space-y-2.5 relative z-10 text-left shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2 text-[#C23B65]">
              <Users className="w-4 h-4 text-[#D85A7F] animate-bounce" />
              <span className="font-extrabold uppercase tracking-wider text-[11px] sm:text-xs text-[#C23B65]">
                {isCompleted
                  ? '🎉 ¡10/10 PARTICIPANTES COMPLETADOS!'
                  : `SUMANDO PARTICIPANTES (${joinedCount}/10)`}
              </span>
            </div>
            <span className="font-mono text-xs sm:text-sm font-black text-[#9E2A4B]">
              {Math.round(progressPercent)}%
            </span>
          </div>

          {/* Animated Glowing Progress Bar (Rosa Perla) */}
          <div className="w-full bg-[#FFE9EE] rounded-full h-2.5 overflow-hidden border border-[#F8D2DC] p-0.5 relative">
            <div
              className="bg-gradient-to-r from-[#FFD1DC] via-[#FCC2D0] to-[#F8B4C4] h-full rounded-full transition-all duration-300 relative shadow-[0_0_12px_rgba(244,168,185,0.9)]"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-white/40 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span>Cuota por participante: {entryFee},00 €</span>
            <span className="text-[#C23B65] font-bold">
              {isCompleted ? 'Mesa Completa • Abriendo Canal' : `Faltan ${10 - joinedCount} por entrar`}
            </span>
          </div>
        </div>

        {/* 10-Participants Visual Grid (2 Rows of 5) */}
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              ESTADO DE LOS 10 EMPRENDEDORES:
            </span>
            <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              <span>Verificación de Pago Instantánea</span>
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 max-w-[280px] xs:max-w-[320px] sm:max-w-[360px] mx-auto">
            {finalParticipants.map((p, idx) => {
              const slotNumber = idx + 1;
              const isJoined = slotNumber <= joinedCount;
              const isJustJoined = slotNumber === joinedCount;
              const isUser = p && (
                p.id === activeUserId ||
                p.id === 'user-adriana' ||
                p.name.toLowerCase().includes('adriana') ||
                p.name.toLowerCase() === activeUserName.toLowerCase() ||
                (p.role && p.role.includes('(Tú)'))
              );

              return (
                <div
                  key={p.id || idx}
                  className={`relative aspect-square min-h-[32px] sm:min-h-[44px] rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all duration-300 flex flex-col justify-between p-0.5 sm:p-1 shadow-sm ${
                    isJoined
                      ? isUser
                        ? 'border-[#D85A7F] ring-2 ring-[#F4A8B9] scale-105 bg-white shadow-[0_0_15px_rgba(244,168,185,0.7)] z-10'
                        : isJustJoined
                          ? 'border-[#F4A8B9] ring-2 ring-[#FCC2D0] scale-105 bg-white shadow-[0_0_10px_rgba(244,168,185,0.5)]'
                          : 'border-[#F4A8B9] bg-white'
                      : 'border-slate-200 bg-slate-100/70 opacity-40'
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
                        <span className={`text-[6.5px] sm:text-[8px] font-black px-1 py-0.2 rounded font-mono shadow-xs ${
                          isUser
                            ? 'bg-gradient-to-r from-[#FFD1DC] via-[#FCC2D0] to-[#F8B4C4] text-[#4A1525] ring-1 ring-[#F4A8B9] font-black flex items-center gap-0.5'
                            : 'bg-black/80 backdrop-blur-xs text-white'
                        }`}>
                          #{slotNumber}{isUser ? ' TÚ' : ''}
                        </span>
                        <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-white/60 shadow-xs ${
                          isUser ? 'bg-[#D85A7F] animate-ping' : 'bg-[#fe2c55] animate-pulse'
                        }`} />
                      </div>

                      {/* Name pill */}
                      <div className="relative z-10 w-full flex justify-center pb-0.5">
                        <span className={`font-black text-[6.5px] sm:text-[8px] px-1 py-0.2 rounded truncate max-w-full text-center ${
                          isUser
                            ? 'bg-white/95 border border-[#F4A8B9] text-[#9E2A4B] shadow-xs font-bold'
                            : 'bg-black/85 backdrop-blur-xs text-white'
                        }`}>
                          {p.name.split(' ')[0]}{isUser ? ' (Tú)' : ''}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-0.5 text-center">
                      <span className="text-[9px] font-mono font-black text-slate-400">#{slotNumber}</span>
                      <span className="text-[6.5px] font-bold text-slate-400 uppercase">Libre</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Feed Ticker (Rosa Perla & Fondo Claro) */}
        <div className="bg-[#FFF8FA] border border-[#F8D2DC] rounded-xl px-3 py-2 text-left relative z-10 overflow-hidden shadow-xs">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D85A7F] animate-ping shrink-0" />
            <span className="text-[9px] font-black uppercase text-[#C23B65] tracking-wider">
              REGISTRO EN TIEMPO REAL
            </span>
          </div>
          <div className="space-y-0.5 text-[10px] sm:text-[11px] font-semibold text-slate-700 max-h-12 overflow-y-auto">
            {activityLogs.map((log, lIdx) => (
              <p key={lIdx} className="m-0 truncate leading-tight text-slate-700">
                {log}
              </p>
            ))}
          </div>
        </div>

        {/* Footer Action (Sin botón accediendo) */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-rose-100 relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-[#D85A7F]" />
            <span className="text-[10px] sm:text-[11px] font-medium">Bolsa de {Math.round(10 * entryFee).toLocaleString('es-ES')}€ protegida en escrow</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsGatheringModal;
