import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  MoreHorizontal, 
  Mic, 
  Square, 
  Camera, 
  Users, 
  Sparkles,
  ArrowLeft,
  Monitor,
  X
} from 'lucide-react';
import { 
  TRABAJADORES_USERS, 
  FINANZAS_USERS, 
  EMPRESARIOS_USERS, 
  TOPMODELS_USERS, 
  INVERSORES_USERS, 
  MILLONARIOS_USERS 
} from './CastingLiveSection';

const CHANNELS_LIST = [
  { id: 'Todos', label: 'Todos 🌍' },
  { id: 'Fashion', label: 'Fashion ✨' },
  { id: 'Finanzas', label: 'Finanzas 📈' },
  { id: 'Modelos', label: 'Runway 👑' },
  { id: 'BackStage', label: 'BackStage 🎬' },
  { id: 'Investors', label: 'Jewellery 💎' },
  { id: 'Catwalk', label: 'Catwalk 👠' },
  { id: 'Fitnes', label: 'Fitnes 💪' },
  { id: 'Beauty', label: 'Beauty 💄' },
  { id: 'Influencer', label: 'Influencer 📱' }
];

interface TikTokFinanzasFeedProps {
  activeSessionsOnly: any[];
  activeFinanzasSessionIndex: number;
  setActiveFinanzasSessionIndex: (index: number) => void;
  userPaidSessions: Record<string, boolean>;
  finanzasTimers: Record<string, number>;
  isSpeakingPresenterIntro: boolean;
  isVotingPhaseActive: boolean;
  votingPhaseTimer: number;
  formattedVotingTimer: string;
  triggerScrutinyAndRecount: () => void;
  setVotingPhaseTimer: (val: number | ((prev: number) => number)) => void;
  setSystemVoiceNotification: (notif: { show: boolean; message: string }) => void;
  getFinanzasRoundRef: (session?: any, index?: number) => string;
  handleFinishRetransmissionAndPassToNextParticipant: () => void;
  isBroadcastMicOn: boolean;
  isMuted: boolean;
  toggleBroadcastMic?: () => void;
  isUserLiveStreamingWithCamera: boolean;
  isWatchingPresenterCamera: boolean;
  handleToggleUserCameraLiveBroadcast: () => void;
  setIsWatchingPresenterCamera: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPresenterCameraFullscreen: (val: boolean) => void;
  userProfile: any;
  selectedFinanzasUser?: any;
  setSelectedFinanzasUser?: (user: any) => void;
  setShowFinanzasInscriptionInChannel: (show: boolean) => void;
  showVotingProjectsModal?: boolean;
  renderVotingProjectsContent?: () => React.ReactNode;
  setShowVotingProjectsModal: (show: boolean) => void;
  setShowParticipantsGatheringModal?: (show: boolean) => void;
  onExecutePaymentAndJoinSession?: (session: any) => void;
  setDetailProjectUser: (user: any) => void;
  setActiveFinanzasPopupUser: (user: any) => void;
  setShowProjectDetailsInPopup: (show: boolean) => void;
  setShowFinanzasResults?: (show: boolean) => void;
  setShowFinanzasRecount?: (show: boolean) => void;
  onOpenComments?: () => void;
  onShare?: () => void;
  activePresenterUser?: any;
  onCategoryFilterChange?: (cat: any) => void;
  selectedCategoryFilter?: string;
  isBroadcastCamOn?: boolean;
  toggleBroadcastCam?: () => void;
  onToggleScreenShare?: () => void;
  isScreenSharingActive?: boolean;
  broadcastGuestsCount?: number;
  onOpenGuestsModal?: () => void;
}

export const TikTokFinanzasFeed: React.FC<TikTokFinanzasFeedProps> = ({
  activeSessionsOnly,
  activeFinanzasSessionIndex,
  setActiveFinanzasSessionIndex,
  userPaidSessions,
  finanzasTimers,
  isSpeakingPresenterIntro,
  isVotingPhaseActive,
  votingPhaseTimer,
  formattedVotingTimer,
  triggerScrutinyAndRecount,
  setVotingPhaseTimer,
  setSystemVoiceNotification,
  getFinanzasRoundRef,
  handleFinishRetransmissionAndPassToNextParticipant,
  isBroadcastMicOn,
  isMuted,
  toggleBroadcastMic,
  isUserLiveStreamingWithCamera,
  isWatchingPresenterCamera,
  handleToggleUserCameraLiveBroadcast,
  setIsWatchingPresenterCamera,
  setIsPresenterCameraFullscreen,
  userProfile,
  selectedFinanzasUser,
  setSelectedFinanzasUser,
  setShowFinanzasInscriptionInChannel,
  showVotingProjectsModal = false,
  renderVotingProjectsContent,
  setShowVotingProjectsModal,
  setShowParticipantsGatheringModal,
  onExecutePaymentAndJoinSession,
  setDetailProjectUser,
  setActiveFinanzasPopupUser,
  setShowProjectDetailsInPopup,
  setShowFinanzasResults,
  setShowFinanzasRecount,
  onOpenComments,
  onShare,
  activePresenterUser,
  onCategoryFilterChange,
  selectedCategoryFilter = 'Finanzas',
  isBroadcastCamOn = true,
  toggleBroadcastCam,
  onToggleScreenShare,
  isScreenSharingActive = false,
  broadcastGuestsCount = 3,
  onOpenGuestsModal
}) => {
  const feedContainerRef = useRef<HTMLDivElement>(null);
  // 🎛️ Channels menu hover & toggle state
  const [activeChannelsMenuSessionId, setActiveChannelsMenuSessionId] = useState<string | null>(null);
  const channelsMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterRonda = (sessionId: string) => {
    if (channelsMenuTimeoutRef.current) {
      clearTimeout(channelsMenuTimeoutRef.current);
      channelsMenuTimeoutRef.current = null;
    }
    setActiveChannelsMenuSessionId(sessionId);
  };

  const handleMouseLeaveRonda = () => {
    if (channelsMenuTimeoutRef.current) {
      clearTimeout(channelsMenuTimeoutRef.current);
    }
    channelsMenuTimeoutRef.current = setTimeout(() => {
      setActiveChannelsMenuSessionId(null);
    }, 320);
  };

  const toggleChannelsMenu = (sessionId: string) => {
    if (activeChannelsMenuSessionId === sessionId) {
      setActiveChannelsMenuSessionId(null);
    } else {
      setActiveChannelsMenuSessionId(sessionId);
    }
  };

  useEffect(() => {
    return () => {
      if (channelsMenuTimeoutRef.current) {
        clearTimeout(channelsMenuTimeoutRef.current);
      }
    };
  }, []);
  const [likesMap, setLikesMap] = useState<Record<string, { count: number; userLiked: boolean }>>({
    'sess-trabajadores-1': { count: 43200, userLiked: false },
    'sess-emprendedores-1': { count: 89400, userLiked: false },
    'sess-empresarios-1': { count: 156800, userLiked: false },
    'sess-topmodels-1': { count: 245100, userLiked: false },
    'sess-inversores-1': { count: 412000, userLiked: false },
    'sess-millonarios-1': { count: 890500, userLiked: false }
  });

  const [savesMap, setSavesMap] = useState<Record<string, { count: number; userSaved: boolean }>>({
    'sess-trabajadores-1': { count: 592, userSaved: false },
    'sess-emprendedores-1': { count: 1420, userSaved: false },
    'sess-empresarios-1': { count: 4210, userSaved: false },
    'sess-topmodels-1': { count: 6850, userSaved: false },
    'sess-inversores-1': { count: 11500, userSaved: false },
    'sess-millonarios-1': { count: 24300, userSaved: false }
  });

  const commentsCountMap: Record<string, number> = {
    'sess-trabajadores-1': 17,
    'sess-emprendedores-1': 124,
    'sess-empresarios-1': 382,
    'sess-topmodels-1': 518,
    'sess-inversores-1': 890,
    'sess-millonarios-1': 1840
  };

  const sharesCountMap: Record<string, number> = {
    'sess-trabajadores-1': 726,
    'sess-emprendedores-1': 982,
    'sess-empresarios-1': 2140,
    'sess-topmodels-1': 3420,
    'sess-inversores-1': 5710,
    'sess-millonarios-1': 12600
  };

  const [activeHoveredParticipantsSession, setActiveHoveredParticipantsSession] = useState<string | null>(null);
  // 🎛️ Synchronized selected presenter per session for direct turn switching
  const [sessionSelectedPresenterMap, setSessionSelectedPresenterMap] = useState<Record<string, any>>({});

  // 🗳️ State for 10-minute voting phase per session (matching zq.png)
  const [sessionVotingPhaseMap, setSessionVotingPhaseMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('finanzas_session_voting_phase_map');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // ⏱️ Exposition 5-minute timer (300s, starts at 297s = 4:57 to match image.png)
  const [sessionExpositionTimerMap, setSessionExpositionTimerMap] = useState<Record<string, number>>(() => ({
    'sess-trabajadores-1': 297,
    'sess-emprendedores-1': 297,
    'sess-empresarios-1': 297,
    'sess-topmodels-1': 297,
    'sess-inversores-1': 297,
    'sess-millonarios-1': 297,
  }));

  // 🗳️ Voting phase 10-minute countdown (600s, i.e. 10:00 -> 09:31)
  const [sessionVotingTimerMap, setSessionVotingTimerMap] = useState<Record<string, number>>(() => ({
    'sess-trabajadores-1': 600,
    'sess-emprendedores-1': 600,
    'sess-empresarios-1': 600,
    'sess-topmodels-1': 600,
    'sess-inversores-1': 600,
    'sess-millonarios-1': 600,
  }));

  // Play transition chime when 5m ends and 10m voting begins
  const playVotingPhaseChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.3); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.45); // C6
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.start(now);
      osc.stop(now + 0.7);
    } catch (e) {}
  };

  // Transition to 10-minute voting phase (z.png) - strictly after the 10th/last participant finishes
  const handleStartVotingPhase = (sessionId: string) => {
    // Asegurar que NO se abra la mesa de votación de proyectos (image.png) de forma automática
    setShowVotingProjectsModal(false);
    setSessionVotingPhaseMap(prev => {
      const next = { ...prev, [sessionId]: true };
      try {
        localStorage.setItem('finanzas_session_voting_phase_map', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setSessionVotingTimerMap(prev => ({ ...prev, [sessionId]: 600 }));
    if (setVotingPhaseTimer) setVotingPhaseTimer(600);
    playVotingPhaseChime();
    if (setSystemVoiceNotification) {
      setSystemVoiceNotification({
        show: true,
        message: '🗳️ Exposición del último participante concluida. Comienzan los 10 minutos de cuenta atrás para votar.'
      });
    }
  };

  // Handler for FINALIZAR button in 5-minute exposition phase (Strictly respects user intent)
  const handlePresenterFinalize = (session: any, index: number) => {
    const participants = getSessionParticipants(session);
    const presenter = getSessionPresenter(session, index);
    const presenterIdx = participants.findIndex(p =>
      p.id === presenter.id ||
      p.name === presenter.name ||
      (presenter.name?.includes('Adriana') && (p.name?.includes('Adriana') || p.id === 'user-adriana' || p.isSelf))
    );
    const currentIdx = presenterIdx !== -1 ? presenterIdx : 0;
    const isLast = currentIdx >= participants.length - 1 || currentIdx >= 9 || presenter.name?.includes('Adriana') || presenter.id === 'user-adriana';

    if (isLast) {
      // 🛑 Tras la exposición del ÚLTIMO PARTICIPANTE (Turno 10 de 10):
      // NO abrir la página de proyectos (image.png).
      // Solo mostrar la ventana de la cuenta atrás de 10 min de votación (captura z.png).
      setShowVotingProjectsModal(false);
      handleStartVotingPhase(session.id);
    } else {
      // ➡️ Si NO es el último participante (turnos 1 al 9, p. ej. Álvaro Díaz en Turno 7 de 10):
      // Pasa al siguiente participante (Turno 8 de 10: Lucía Navarro).
      // NO abrir image.png ni mostrar z.png.
      setShowVotingProjectsModal(false);
      const nextIdx = currentIdx + 1;
      const nextPresenter = participants[nextIdx];
      if (nextPresenter) {
        setSessionSelectedPresenterMap(prev => ({ ...prev, [session.id]: nextPresenter }));
        setSessionExpositionTimerMap(prev => ({ ...prev, [session.id]: 300 }));
        if (setSelectedFinanzasUser) setSelectedFinanzasUser(nextPresenter);

        // Chime sonoro de cambio de turno
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          if (audioCtx.state === 'suspended') audioCtx.resume();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.setValueAtTime(659.25, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.16, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.35);
        } catch (e) {}

        if (setSystemVoiceNotification) {
          setSystemVoiceNotification({
            show: true,
            message: `⏱️ Turno ${nextIdx + 1} de 10: ${nextPresenter.name} (5 min de exposición en directo)`
          });
          setTimeout(() => {
            setSystemVoiceNotification({ show: false, message: '' });
          }, 4000);
        }
      }
      handleFinishRetransmissionAndPassToNextParticipant();
    }
  };

  // Active 1-second timer interval
  useEffect(() => {
    const interval = setInterval(() => {
      const currentSession = activeSessionsOnly[activeFinanzasSessionIndex];
      if (!currentSession) return;
      const sId = currentSession.id;

      const isVoting = Boolean(sessionVotingPhaseMap[sId] || isVotingPhaseActive);

      if (isVoting) {
        // Ticking down 10-minute voting timer
        setSessionVotingTimerMap(prev => {
          const currentSecs = prev[sId] !== undefined ? prev[sId] : 600;
          const nextSecs = Math.max(0, currentSecs - 1);
          if (nextSecs === 0 && currentSecs > 0) {
            triggerScrutinyAndRecount();
          }
          return { ...prev, [sId]: nextSecs };
        });
        if (setVotingPhaseTimer) {
          setVotingPhaseTimer(prev => Math.max(0, prev - 1));
        }
      } else {
        // In 5-minute exposition phase:
        setSessionExpositionTimerMap(prev => {
          const currentSecs = prev[sId] !== undefined ? prev[sId] : 300;
          const nextSecs = Math.max(0, currentSecs - 1);
          if (nextSecs === 0 && currentSecs > 0) {
            // 5 minutes ended:
            const participants = getSessionParticipants(currentSession);
            const presenter = getSessionPresenter(currentSession, activeFinanzasSessionIndex);
            const presenterIdx = participants.findIndex(p =>
              p.id === presenter.id ||
              p.name === presenter.name ||
              (presenter.name?.includes('Adriana') && (p.name?.includes('Adriana') || p.id === 'user-adriana' || p.isSelf))
            );
            const currentIdx = presenterIdx !== -1 ? presenterIdx : 0;
            const isLast = currentIdx >= participants.length - 1 || currentIdx >= 9;

            if (isLast) {
              // ⏰ Only transition to 10-minute voting window after the LAST participant!
              setTimeout(() => handleStartVotingPhase(sId), 10);
            } else {
              // Advance to next participant automatically!
              const nextIdx = currentIdx + 1;
              const nextPresenter = participants[nextIdx];
              if (nextPresenter) {
                setSessionSelectedPresenterMap(p => ({ ...p, [sId]: nextPresenter }));
                if (setSelectedFinanzasUser) setSelectedFinanzasUser(nextPresenter);
              }
              return { ...prev, [sId]: 300 };
            }
          }
          return { ...prev, [sId]: nextSecs };
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSessionsOnly, activeFinanzasSessionIndex, sessionVotingPhaseMap, isVotingPhaseActive, sessionSelectedPresenterMap, selectedFinanzasUser]);

  // Helper for formatting numbers like TikTok (e.g. 43.2K)
  const formatCount = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  // Toggle like
  const handleToggleLike = (sessionId: string) => {
    setLikesMap(prev => {
      const current = prev[sessionId] || { count: 1000, userLiked: false };
      const nextLiked = !current.userLiked;
      return {
        ...prev,
        [sessionId]: {
          count: nextLiked ? current.count + 1 : Math.max(0, current.count - 1),
          userLiked: nextLiked
        }
      };
    });
  };

  // Toggle save / bookmark
  const handleToggleSave = (sessionId: string) => {
    setSavesMap(prev => {
      const current = prev[sessionId] || { count: 50, userSaved: false };
      const nextSaved = !current.userSaved;
      return {
        ...prev,
        [sessionId]: {
          count: nextSaved ? current.count + 1 : Math.max(0, current.count - 1),
          userSaved: nextSaved
        }
      };
    });
  };

  // Helper to determine title of each round
  const getRoundTitle = (session: any, index: number) => {
    const fee = session?.entryFee;
    const cat = (session?.category || session?.title || '').toUpperCase();
    if (cat.includes('STREETWEAR') || cat.includes('TRABAJADORES') || fee === 10) return 'ROUND STREETWEAR & URBAN';
    if (cat.includes('CASUAL') || cat.includes('EMPRENDEDOR') || fee === 100) return 'ROUND CASUAL & LIFESTYLE';
    if (cat.includes('GLAMOUR') || cat.includes('EMPRESARIOS') || fee === 1000) return 'RONDA GLAMOUR ✨';
    if (cat.includes('ELEGANT') || cat.includes('CLASSIC') || cat.includes('MODELS') || fee === 10000) return 'RONDA ELEGANT & CLASSIC 🤍';
    if (cat.includes('HIGH FASHION') || cat.includes('INVERSI') || fee === 100000) return 'RONDA HIGH FASHION 👠';
    if (cat.includes('MILLONAR') || fee === 1000000) return 'RONDA HIGH FASHION 👠';
    return (session?.title || 'ROUND STREETWEAR & URBAN').toUpperCase();
  };

  // Helper to get fee descriptions
  const getSessionFeeInfo = (session: any) => {
    const fee = session?.entryFee || 10;
    if (fee === 10) return { feeShort: '10€', feeInWords: '10 Euros' };
    if (fee === 100) return { feeShort: '100€', feeInWords: '100 Euros' };
    if (fee === 1000) return { feeShort: '1.000€', feeInWords: '1.000 Euros' };
    if (fee === 10000) return { feeShort: '10.000€', feeInWords: '10.000 Euros' };
    if (fee === 100000) return { feeShort: '100.000€', feeInWords: '100.000 Euros' };
    if (fee === 1000000) return { feeShort: '1.000.000€', feeInWords: '1.000.000 Euros' };
    return { feeShort: `${fee}€`, feeInWords: `${fee} Euros` };
  };

  // Helper to get participants for each session
  const getSessionParticipants = (session: any) => {
    const sId = session?.id || '';
    const fee = session?.entryFee;
    let list: any[] = [];
    if (sId.includes('trabajadores') || fee === 10) list = [...TRABAJADORES_USERS.slice(0, 10)];
    else if (sId.includes('emprendedores') || fee === 100) list = [...FINANZAS_USERS.slice(0, 10)];
    else if (sId.includes('empresarios') || fee === 1000) list = [...EMPRESARIOS_USERS.slice(0, 10)];
    else if (sId.includes('topmodels') || fee === 10000) list = [...TOPMODELS_USERS.slice(0, 10)];
    else if (sId.includes('inversores') || fee === 100000) list = [...INVERSORES_USERS.slice(0, 10)];
    else if (sId.includes('millonarios') || fee === 1000000) list = [...MILLONARIOS_USERS.slice(0, 10)];
    else list = [...TRABAJADORES_USERS.slice(0, 10)];

    // Ensure Adriana Lima is prominently marked as participant (Tú) for the 10€ round
    if (sId.includes('trabajadores') || fee === 10) {
      const hasAdriana = list.some(p => p.name?.includes('Adriana') || p.id === 'user-adriana');
      if (!hasAdriana) {
        list[9] = {
          id: userProfile?.id || 'user-adriana',
          name: `${userProfile?.name || 'Adriana Lima'} (Tú)`,
          username: userProfile?.username || 'adrianalima',
          avatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
          role: 'Participante Activa (Tú)',
          isSelf: true
        };
      } else {
        list = list.map(p => {
          if (p.name?.includes('Adriana') || p.id === 'user-adriana') {
            return {
              ...p,
              name: `${userProfile?.name || 'Adriana Lima'} (Tú)`,
              avatar: userProfile?.avatar || p.avatar,
              role: 'Participante Activa (Tú)',
              isSelf: true
            };
          }
          return p;
        });
      }
    }

    return list;
  };

  // Helper to get presenter for each session
  const getSessionPresenter = (session: any, index: number) => {
    const participants = getSessionParticipants(session);

    // 1. If user explicitly clicked a participant for this session:
    if (sessionSelectedPresenterMap[session.id]) {
      const selected = sessionSelectedPresenterMap[session.id];
      const matched = participants.find(p => p.id === selected.id || p.name === selected.name);
      if (matched) return matched;
    }

    // 2. If parent has selectedFinanzasUser that belongs to this session's participants:
    if (selectedFinanzasUser) {
      const matched = participants.find(p => p.id === selectedFinanzasUser.id || p.name === selectedFinanzasUser.name);
      if (matched) return matched;
    }

    // 3. If currently focused session and activePresenterUser is provided:
    if (index === activeFinanzasSessionIndex && activePresenterUser) {
      const matched = participants.find(p => p.id === activePresenterUser.id || p.name === activePresenterUser.name);
      if (matched) return matched;
    }

    const sId = session?.id || '';
    const fee = session?.entryFee;

    // In trabajadores / 10€ round, Adriana Lima is the active presenter in Turn 10 of 10
    if (sId.includes('trabajadores') || fee === 10) {
      const adriana = participants.find(p => 
        p.id === 'user-adriana' || 
        p.id === userProfile?.id || 
        p.name?.includes('Adriana') || 
        p.isSelf
      );
      if (adriana) return adriana;
      return participants[9] || participants[participants.length - 1] || participants[0];
    }
    return participants[0];
  };

  // Detect which container is in center view during scroll
  const handleScroll = () => {
    if (!feedContainerRef.current) return;
    const container = feedContainerRef.current;
    const containerCenter = container.scrollTop + container.clientHeight / 2;

    activeSessionsOnly.forEach((sess, idx) => {
      const cardEl = document.getElementById(`tiktok-round-card-${sess.id}`);
      if (cardEl) {
        const top = cardEl.offsetTop;
        const bottom = top + cardEl.offsetHeight;
        if (containerCenter >= top && containerCenter <= bottom) {
          if (activeFinanzasSessionIndex !== idx) {
            setActiveFinanzasSessionIndex(idx);
          }
        }
      }
    });
  };

  // Programmatic scroll to next / prev round
  const scrollToRound = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= activeSessionsOnly.length) return;
    const targetSession = activeSessionsOnly[targetIndex];
    if (!targetSession) return;
    const el = document.getElementById(`tiktok-round-card-${targetSession.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveFinanzasSessionIndex(targetIndex);
    }
  };

  // Keyboard navigation up / down
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToRound(activeFinanzasSessionIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToRound(activeFinanzasSessionIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFinanzasSessionIndex, activeSessionsOnly]);

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* 📱 TIKTOK VERTICAL SNAP SCROLL FEED */}
      <div
        ref={feedContainerRef}
        onScroll={handleScroll}
        id="tiktok-rounds-vertical-feed"
        className="w-full max-w-full h-[calc(100dvh-130px)] min-h-[740px] max-h-[920px] overflow-y-auto snap-y snap-mandatory scroll-smooth py-6 flex flex-col items-center gap-10 sm:gap-14 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {activeSessionsOnly.map((session, index) => {
          const roundRef = getFinanzasRoundRef(session, index);
          const roundTitle = getRoundTitle(session, index);
          const feeInfo = getSessionFeeInfo(session);
          const presenter = getSessionPresenter(session, index);
          const participants = getSessionParticipants(session);
          const isUserEnrolledInThisRound = Boolean(
            userPaidSessions[session.id] ||
            (session.id === 'sess-trabajadores-1' || session.entryFee === 10) ||
            (typeof window !== 'undefined' && localStorage.getItem(`user_paid_session_${session.id}`) === 'true')
          );
          const isCurrentlyActiveRound = index === activeFinanzasSessionIndex;
          const likesData = likesMap[session.id] || { count: 43200, userLiked: false };
          const savesData = savesMap[session.id] || { count: 592, userSaved: false };
          const commentsCount = commentsCountMap[session.id] || 17;
          const sharesCount = sharesCountMap[session.id] || 726;

          // Timer calculation (5 min exposition vs 10 min voting)
          const isSessionInVoting = Boolean(sessionVotingPhaseMap[session.id] || (isVotingPhaseActive && isCurrentlyActiveRound));
          const currentVotingSecs = sessionVotingTimerMap[session.id] !== undefined
            ? sessionVotingTimerMap[session.id]
            : (votingPhaseTimer || 600);
          const vMin = Math.floor(currentVotingSecs / 60).toString().padStart(2, '0');
          const vSec = (currentVotingSecs % 60).toString().padStart(2, '0');
          const displayVotingTimer = `${vMin}:${vSec}`;

          const timerVal = isCurrentlyActiveRound
            ? (isSpeakingPresenterIntro 
                ? 300 
                : (sessionExpositionTimerMap[session.id] !== undefined 
                    ? sessionExpositionTimerMap[session.id] 
                    : (finanzasTimers[presenter.id] !== undefined ? finanzasTimers[presenter.id] : 297)))
            : 297;
          const timerMinutes = Math.floor(timerVal / 60);
          const timerSeconds = (timerVal % 60).toString().padStart(2, '0');
          const formattedTimer = `${timerMinutes}:${timerSeconds}`;

          // Calculate turn number strictly from presenter's position among participants (1-based index)
          const presenterIdx = participants.findIndex(p => 
            p.id === presenter.id || 
            p.name === presenter.name ||
            (presenter.name?.includes('Adriana') && (p.name?.includes('Adriana') || p.id === 'user-adriana' || p.isSelf))
          );
          const turnNumber = presenterIdx !== -1 ? (presenterIdx + 1) : 10;
          const isPresenterAdriana = Boolean(
            presenter.id === 'user-adriana' ||
            presenter.id === userProfile?.id ||
            presenter.name?.includes('Adriana') ||
            presenter.isSelf
          );
          const isPresenter = presenter.id === userProfile?.id || presenter.name?.includes('Adriana');
          const isLiveActive = isCurrentlyActiveRound && Boolean(isPresenter ? isUserLiveStreamingWithCamera : isWatchingPresenterCamera);

          return (
            <div
              key={session.id}
              id={`tiktok-round-card-${session.id}`}
              className="snap-center shrink-0 flex items-center justify-center gap-2.5 sm:gap-4.5 w-full max-w-[560px] my-auto relative px-1 sm:px-2"
            >
              {/* 🎴 THE MAIN ROUND CONTAINER CARD (Strictly matching z.png) */}
              <div 
                className="w-full max-w-[390px] xs:max-w-[420px] sm:max-w-[450px] md:max-w-[460px] h-[810px] sm:h-[860px] bg-[#070b14] border-[3.5px] border-slate-800 rounded-[44px] sm:rounded-[52px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden relative flex flex-col justify-between p-3.5 sm:p-5 box-border select-none"
                id={`round-container-box-${session.id}`}
              >
                {/* 🗳️ VENTANA DE VOTACIÓN DENTRO DEL CANAL EN PANTALLA COMPLETA (captura image.png) */}
                {showVotingProjectsModal && isCurrentlyActiveRound && (
                  <div 
                    className="absolute inset-0 z-[120] bg-white w-full h-full rounded-[40px] sm:rounded-[48px] overflow-hidden flex flex-col shadow-2xl animate-fade-in text-slate-800 font-sans pointer-events-auto"
                    id={`voting-projects-in-channel-fullscreen-${session.id}`}
                  >
                    {renderVotingProjectsContent ? (
                      renderVotingProjectsContent()
                    ) : null}
                  </div>
                )}
                {/* 🎥 Embedded Live Stream Video Background inside Channel Container */}
                {isLiveActive && (
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[40px] sm:rounded-[48px]">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover opacity-50 transition-opacity duration-700"
                      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/80 via-[#070b14]/50 to-[#070b14]/90" />
                  </div>
                )}
                {/* 🔴 TOP BANNER (z.png): RONDA EN CURSO • REF:X */}
                <div 
                  className="w-full flex flex-col items-center justify-center text-center pt-2 sm:pt-3 relative cursor-pointer"
                  onMouseEnter={() => handleMouseEnterRonda(session.id)}
                  onMouseLeave={handleMouseLeaveRonda}
                >
                  {/* Red badge with pulsing dot - hover to open channels menu */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChannelsMenu(session.id);
                    }}
                    className="inline-flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/50 hover:border-rose-400 text-rose-300 px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider mb-1.5 shadow-xs cursor-pointer transition-all hover:scale-105 active:scale-95 group/ronda-pill"
                    title="Pasa el ratón o pulsa para abrir el menú de canales en directo"
                    id={`ronda-en-curso-pill-${session.id}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                    <span>{isUserEnrolledInThisRound ? 'Ronda en la que estás participando' : 'Ronda en Curso'}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-amber-300 font-mono font-black tracking-wider">{roundRef}</span>
                    <span className="text-[7.5px] text-rose-400 opacity-70 group-hover/ronda-pill:opacity-100 transition-transform group-hover/ronda-pill:translate-y-0.5">▼</span>
                  </button>

                  {/* Main Round Title with Ref Badge */}
                  <h3 className="text-xs sm:text-sm md:text-base font-black text-white uppercase tracking-wider font-sans drop-shadow-md leading-tight m-0 flex items-center justify-center gap-1.5 flex-wrap">
                    <span>{roundTitle}</span>
                    <span className="text-[9.5px] sm:text-[10.5px] text-amber-300 bg-amber-400/15 border border-amber-400/50 px-2 py-0.5 rounded-full font-mono font-bold tracking-normal normal-case shrink-0">
                      {roundRef}
                    </span>
                  </h3>

                  {/* Subtitle with accent lines: 10€ Inscripción • 10 Participantes • Ref:1 */}
                  <div className="flex items-center justify-center gap-2 mt-1.5">
                    <span className="h-0.5 w-6 sm:w-8 bg-gradient-to-r from-transparent via-rose-500 to-[#fe2c55] rounded-full" />
                    <span className="text-[8.5px] sm:text-[9.5px] font-bold text-slate-300 font-mono tracking-wider uppercase flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-800">
                      <span>{feeInfo.feeShort} Inscripción</span>
                      <span className="text-slate-500">•</span>
                      <span>10 Participantes</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-amber-300 font-black">{roundRef}</span>
                    </span>
                    <span className="h-0.5 w-6 sm:w-8 bg-gradient-to-l from-transparent via-rose-500 to-[#fe2c55] rounded-full" />
                  </div>
                </div>

                {/* 🎛️ EMBEDDED BROADCAST CONTROL & CHANNELS OVERLAY MENU (Se abre al pasar el ratón por Ronda en Curso) */}
                {activeChannelsMenuSessionId === session.id && (
                  <div 
                    className="absolute top-0 inset-x-0 z-[120] p-2.5 sm:p-3 pointer-events-auto animate-slide-down-tiktok"
                    onMouseEnter={() => handleMouseEnterRonda(session.id)}
                    onMouseLeave={handleMouseLeaveRonda}
                    onClick={(e) => e.stopPropagation()}
                    id={`embedded-channels-menu-overlay-${session.id}`}
                  >
                    {/* Subtle top indicator bar */}
                    <div className="w-16 h-1 bg-white/40 rounded-full mx-auto mb-1.5 opacity-80" />

                    <div className="w-full bg-[#0B0F19]/98 backdrop-blur-xl text-white p-3 sm:p-3.5 rounded-3xl border border-slate-700/90 shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col gap-2.5 select-none">
                      {/* Top Row: Volver, current channel badge, and Close */}
                      <div className="flex items-center justify-between gap-1.5 w-full">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveChannelsMenuSessionId(null);
                            if (onCategoryFilterChange) onCategoryFilterChange('Todos');
                          }}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#181d2a] hover:bg-[#22293b] text-white text-[11px] font-black rounded-full transition cursor-pointer border border-slate-700/60 active:scale-95 shadow-md shrink-0"
                          title="Volver a Todos"
                        >
                          <ArrowLeft className="w-3.5 h-3.5 text-[#fe2c55] stroke-[3]" />
                          <span className="font-black">Volver</span>
                        </button>

                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          <span className="text-slate-400 font-medium">Canal:</span>
                          <span className="text-rose-400 font-black">{selectedCategoryFilter || 'Finanzas'}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveChannelsMenuSessionId(null)}
                          className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer border border-slate-700 active:scale-95 shrink-0"
                          title="Cerrar menú"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Middle Row: Quick Action Buttons (Cámara ON, Mic ON, Pantalla, Invitados) */}
                      <div className="grid grid-cols-4 gap-1.5 pt-0.5 text-center w-full">
                        {/* Cámara ON */}
                        <button
                          type="button"
                          onClick={() => {
                            if (toggleBroadcastCam) {
                              toggleBroadcastCam();
                            }
                          }}
                          className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer active:scale-95 shadow-md ${
                            isBroadcastCamOn
                              ? 'bg-[#0B1E19] text-[#10b981] border-2 border-[#10b981] font-black shadow-emerald-950/40 ring-1 ring-[#10b981]/30'
                              : 'bg-[#181d2a] text-slate-300 border border-slate-700/70 hover:bg-[#22293b] font-bold'
                          }`}
                          title="Configurar Cámara"
                        >
                          <Camera className="w-4 h-4 text-[#10b981] shrink-0" />
                          <span className="truncate w-full text-[9px] sm:text-[9.5px] font-black tracking-tight">{isBroadcastCamOn ? 'Cámara ON' : 'Cámara OFF'}</span>
                        </button>

                        {/* Mic ON */}
                        <button
                          type="button"
                          onClick={() => {
                            if (toggleBroadcastMic) {
                              toggleBroadcastMic();
                            }
                          }}
                          className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer active:scale-95 shadow-md ${
                            isBroadcastMicOn && !isMuted
                              ? 'bg-[#0B1E19] text-[#10b981] border-2 border-[#10b981] font-black shadow-emerald-950/40 ring-1 ring-[#10b981]/30'
                              : 'bg-[#181d2a] text-slate-300 border border-slate-700/70 hover:bg-[#22293b] font-bold'
                          }`}
                          title="Configurar Micrófono"
                        >
                          <Mic className="w-4 h-4 text-[#10b981] shrink-0" />
                          <span className="truncate w-full text-[9px] sm:text-[9.5px] font-black tracking-tight">{isBroadcastMicOn && !isMuted ? 'Mic ON' : 'Mute'}</span>
                        </button>

                        {/* Pantalla */}
                        <button
                          type="button"
                          onClick={() => {
                            if (onToggleScreenShare) {
                              onToggleScreenShare();
                            }
                          }}
                          className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer active:scale-95 shadow-md ${
                            isScreenSharingActive
                              ? 'bg-indigo-950/70 text-indigo-300 border-2 border-indigo-500 font-black ring-1 ring-indigo-400'
                              : 'bg-[#181d2a] text-slate-200 border border-slate-700/70 hover:bg-[#22293b] font-bold'
                          }`}
                          title="Compartir Pantalla"
                        >
                          <Monitor className="w-4 h-4 text-slate-200 shrink-0" />
                          <span className="truncate w-full text-[9px] sm:text-[9.5px] font-black tracking-tight">{isScreenSharingActive ? 'Pantalla ON' : 'Pantalla'}</span>
                        </button>

                        {/* Invitados */}
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenGuestsModal) {
                              onOpenGuestsModal();
                            }
                          }}
                          className="py-2 px-1 bg-[#181d2a] hover:bg-[#22293b] text-slate-200 border border-slate-700/70 rounded-xl flex flex-col items-center justify-center gap-1 transition cursor-pointer font-bold active:scale-95 shadow-md"
                          title="Invitar Invitados"
                        >
                          <Users className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="truncate w-full text-[9px] sm:text-[9.5px] font-black tracking-tight">Invitados ({broadcastGuestsCount || 3})</span>
                        </button>
                      </div>

                      {/* Bottom Row: 10 Live Channels in 2 Columns */}
                      <div className="pt-2 border-t border-slate-800/80 w-full">
                        <div className="flex items-center justify-between px-1 mb-1.5">
                          <span className="text-[10.5px] sm:text-[11px] font-black uppercase tracking-wider text-white">
                            CANALES EN DIRECTO
                          </span>
                          <span className="text-[9px] sm:text-[9.5px] text-[#fe2c55] font-black bg-[#fe2c55]/10 px-2.5 py-0.5 rounded-full border border-[#fe2c55]/60">
                            {selectedCategoryFilter || 'Finanzas'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 w-full max-h-[46vh] overflow-y-auto p-1 rounded-2xl bg-[#090D15]/90 border border-slate-800 shadow-inner scrollbar-none">
                          {CHANNELS_LIST.map(cat => {
                            const isActive = (selectedCategoryFilter || 'Finanzas') === cat.id;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  setActiveChannelsMenuSessionId(null);
                                  if (onCategoryFilterChange) {
                                    onCategoryFilterChange(cat.id);
                                  }
                                }}
                                className={`py-2 sm:py-2.5 px-2 rounded-xl text-[10.5px] sm:text-[11px] font-black transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-1 shadow-sm ${
                                  isActive 
                                    ? 'bg-gradient-to-r from-rose-600 via-[#fe2c55] to-pink-600 text-white font-black shadow-lg shadow-rose-600/40 border-2 border-pink-400 ring-2 ring-rose-400/40' 
                                    : 'bg-[#181d2a] hover:bg-[#22293b] text-white border border-slate-700/70 hover:border-slate-500'
                                }`}
                                id={`finanzas-feed-channel-btn-${cat.id}`}
                              >
                                <span className="truncate">{cat.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 🟢 CENTRAL STAGE CARD (Strictly matching image.png during 5m exposition, and zq.png during 10m voting) */}
                <div 
                  className="w-full bg-[#0e1628]/95 border border-emerald-500/60 rounded-2xl p-3 sm:p-4 shadow-[0_16px_48px_rgba(0,0,0,0.85)] flex flex-col items-center text-center my-auto transition-all"
                  id={`central-stage-card-${session.id}`}
                >
                  {isSessionInVoting ? (
                    /* 🗳️ 10-MINUTE VOTING STAGE CARD (Strictly matching zq.png) */
                    <div className="w-full flex flex-col items-center animate-fade-in" id={`voting-phase-view-${session.id}`}>
                      {/* Top Pill Badge: • 🗳️ CUENTA ATRÁS • 10 MINUTOS PARA VOTAR */}
                      <div
                        className="inline-flex items-center gap-1.5 bg-[#170e28] border border-rose-500/50 text-rose-200 px-3.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider mb-2.5 shadow-xs select-none"
                        id={`voting-pill-badge-${session.id}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                        <span>🗳️ CUENTA ATRÁS • 10 MINUTOS PARA VOTAR</span>
                      </div>

                      {/* 🔴 RED GLOWING CONTAINER BOX (Strictly matching zq.png) */}
                      <div className="w-full bg-[#0d0714] border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.35)] rounded-3xl p-3 sm:p-3.5 flex flex-col gap-2.5 sm:gap-3 mb-3">
                        {/* Top Row: Left 10 min votación, Center 09:31, Right Ronda 10/10 (10m) */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-left">
                            <span className="text-base sm:text-lg">⏱️</span>
                            <div>
                              <span className="text-[7.5px] sm:text-[8px] text-slate-300 font-black uppercase tracking-wider block">CUENTA ATRÁS</span>
                              <span className="text-[12px] sm:text-[13px] text-white font-black block leading-none">10 min</span>
                              <span className="text-[8.5px] sm:text-[9px] text-slate-400 block leading-tight">votación</span>
                            </div>
                          </div>

                          {/* White digital pill timer with bold black font (matching zq.png 09:31) */}
                          <button
                            type="button"
                            onClick={() => {
                              // Fast-forward to 3 seconds for test convenience
                              setSessionVotingTimerMap(prev => ({ ...prev, [session.id]: 3 }));
                              if (setVotingPhaseTimer) setVotingPhaseTimer(3);
                              if (setSystemVoiceNotification) {
                                setSystemVoiceNotification({
                                  show: true,
                                  message: '⚡ Cuenta atrás de votación acelerada a 3s para prueba de escrutinio.'
                                });
                              }
                            }}
                            title="Cuenta atrás de 10 minutos (Clic para acelerar a 3s)"
                            className="bg-white hover:bg-slate-100 text-slate-950 font-mono text-2xl sm:text-3xl font-black px-5 sm:px-6 py-1 sm:py-1.5 rounded-2xl shadow-md tracking-wider border-0 cursor-pointer select-none transition active:scale-95"
                          >
                            {displayVotingTimer}
                          </button>

                          <div className="text-right shrink-0">
                            <span className="text-[7.5px] sm:text-[8px] text-slate-400 block font-black uppercase tracking-wider">RONDA</span>
                            <span className="font-mono text-emerald-400 font-black text-xs sm:text-sm block leading-tight">10/10</span>
                            <span className="font-mono text-emerald-400 font-bold text-[9px] sm:text-[10px] block leading-tight">(10m)</span>
                          </div>
                        </div>

                        {/* Middle Banner: TIENEN 10 MINUTOS PARA VOTAR. */}
                        <div className="w-full bg-[#1e0a14] border border-red-600/80 rounded-full py-2 px-3 text-center shadow-inner">
                          <span className="text-white font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-xs">
                            TIENEN 10 MINUTOS PARA VOTAR.
                          </span>
                        </div>

                        {/* Multi-color gradient progress bar (green -> yellow -> red) */}
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(100, Math.max(3, (currentVotingSecs / 600) * 100))}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons: White "📁 VOTAR PROYECTOS" and White "📷 LIVE" (Strictly matching z.png) */}
                      <div className="w-full flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowVotingProjectsModal(true);
                            if (setSystemVoiceNotification) {
                              setSystemVoiceNotification({
                                show: true,
                                message: '🗳️ Abriendo panel de votación: selecciona tu proyecto favorito entre los 10 participantes.'
                              });
                            }
                          }}
                          className="w-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm py-2.5 sm:py-3 px-4 rounded-2xl uppercase tracking-wider transition active:scale-95 shadow-md border border-slate-200 flex items-center justify-center gap-2 cursor-pointer font-sans"
                          id={`btn-votar-proyectos-${session.id}`}
                        >
                          <span className="text-base">📁</span>
                          <span>VOTAR PROYECTOS</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveFinanzasSessionIndex(index);
                            if (setSelectedFinanzasUser) setSelectedFinanzasUser(presenter);
                            handleToggleUserCameraLiveBroadcast();
                          }}
                          className="w-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm py-2.5 sm:py-3 px-4 rounded-2xl uppercase tracking-wider transition active:scale-95 shadow-md border border-slate-200 flex items-center justify-center gap-2 cursor-pointer"
                          id={`btn-live-voting-${session.id}`}
                        >
                          <Camera className="w-4 h-4 text-slate-950 shrink-0" />
                          <span>LIVE</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* 🔴 5-MINUTE EXPOSITION CARD (Strictly matching image.png) */
                    <div className="w-full flex flex-col items-center animate-fade-in" id={`exposition-phase-view-${session.id}`}>
                      {/* Top Badge: TURNO X DE 10 • EN EXPOSICIÓN */}
                      <button
                        type="button"
                        onClick={() => {
                          const nextTurnIdx = (turnNumber % participants.length);
                          const nextPresenter = participants[nextTurnIdx];
                          if (nextPresenter) {
                            setSessionSelectedPresenterMap(prev => ({ ...prev, [session.id]: nextPresenter }));
                            if (setSelectedFinanzasUser) setSelectedFinanzasUser(nextPresenter);
                            if (setSystemVoiceNotification) {
                              setSystemVoiceNotification({
                                show: true,
                                message: `🎤 Turno ${nextTurnIdx + 1} de 10: ${nextPresenter.name} en exposición.`
                              });
                            }
                          }
                        }}
                        title="Haz clic para avanzar al siguiente turno de exposición de la ronda"
                        className="inline-flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/35 active:scale-95 border border-emerald-500/60 text-emerald-300 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider mb-2.5 shadow-xs cursor-pointer transition select-none"
                        id={`btn-turno-badge-${session.id}`}
                      >
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>🔴 TURNO {turnNumber} DE 10 • EN EXPOSICIÓN</span>
                      </button>

                      {/* Presenter Profile Spotlight */}
                      <div className="flex flex-col items-center gap-1 mb-2">
                        <div className="relative">
                          <img
                            src={presenter.avatar}
                            alt={presenter.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-emerald-400 shadow-md"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[7.5px] sm:text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm">
                            EN VIVO
                          </span>
                        </div>

                        <h4 className="text-white font-black text-sm sm:text-base mt-1 tracking-tight leading-tight">
                          {presenter.name}
                        </h4>
                        <span className="text-[9.5px] sm:text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                          {presenter.role || 'PATRONISTA TEXTIL'}
                        </span>
                        <span className="text-[8.5px] sm:text-[9px] text-slate-400 italic">
                          Exposición de 5 minutos en directo
                        </span>
                      </div>

                      {/* ⏱️ COUNTDOWN TIMER WIDGET (Matching image.png: white digital pill timer) */}
                      <div className="w-full bg-[#070b14] border border-emerald-500/40 rounded-2xl p-2.5 sm:p-3 flex flex-col gap-2 shadow-inner mb-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-left">
                            <span className="text-sm sm:text-base">⏱️</span>
                            <div>
                              <span className="text-[7.5px] sm:text-[8px] text-slate-400 font-black uppercase tracking-wider block">CUENTA ATRÁS</span>
                              <span className="text-[10px] sm:text-[11px] text-white font-black block leading-none">5 min exposición</span>
                            </div>
                          </div>

                          {/* White digital pill timer with bold black font (Strictly matching image.png 4:57) */}
                          <button
                            type="button"
                            onClick={() => {
                              if (isCurrentlyActiveRound) {
                                handlePresenterFinalize(session, index);
                              } else {
                                scrollToRound(index);
                              }
                            }}
                            title="Cuenta atrás (5 min de exposición)"
                            className="bg-white hover:bg-slate-100 text-slate-950 font-mono text-xl sm:text-2xl font-black px-4 sm:px-5 py-1 rounded-2xl shadow-md border-0 cursor-pointer transition active:scale-95 select-none"
                          >
                            {formattedTimer}
                          </button>

                          <div className="text-right shrink-0">
                            <span className="text-[7px] sm:text-[7.5px] text-slate-400 block font-black uppercase tracking-wider">RONDA</span>
                            <span className="font-mono text-emerald-400 font-black text-[9px] sm:text-[10px] block leading-tight">
                              {turnNumber}/10 (50m)
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar (emerald -> amber -> rose) */}
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(100, Math.max(10, (timerVal / 300) * 100))}%` }}
                          />
                        </div>
                      </div>

                      {/* ACTION BUTTONS (Matching image.png: MICRO ON, FINALIZAR, LIVE) */}
                      <div className="w-full flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (toggleBroadcastMic) {
                                toggleBroadcastMic();
                              }
                            }}
                            className={`w-full py-2 px-2.5 rounded-xl font-black text-[10px] sm:text-[11px] uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border shadow-md ${
                              isBroadcastMicOn && !isMuted
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            }`}
                          >
                            <Mic className="w-3.5 h-3.5 shrink-0 text-white" />
                            <span className="truncate">{isBroadcastMicOn && !isMuted ? 'MICRO ON' : 'MICRO OFF'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handlePresenterFinalize(session, index);
                            }}
                            className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-[10px] sm:text-[11px] py-2 px-2.5 rounded-xl shadow-md uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border border-rose-400/80"
                            id={`btn-finalizar-turno-${session.id}`}
                          >
                            <Square className="w-3 h-3 fill-white text-white shrink-0" />
                            <span className="truncate">FINALIZAR</span>
                          </button>
                        </div>

                        {/* LIVE CAMERA BUTTON */}
                        {(() => {
                          const isPresenter = presenter.id === userProfile?.id || presenter.name?.includes('Adriana');
                          const isLiveActive = Boolean(isPresenter ? isUserLiveStreamingWithCamera : isWatchingPresenterCamera);

                          return (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveFinanzasSessionIndex(index);
                                if (setSelectedFinanzasUser) {
                                  setSelectedFinanzasUser(presenter);
                                }
                                if (isPresenter) {
                                  handleToggleUserCameraLiveBroadcast();
                                } else {
                                  setIsWatchingPresenterCamera(prev => {
                                    const next = !prev;
                                    setIsPresenterCameraFullscreen(false);
                                    return next;
                                  });
                                }
                              }}
                              className={`w-full py-2 px-3 rounded-xl font-black text-[10px] sm:text-[11px] uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border shadow-md ${
                                isLiveActive
                                  ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white border-red-400 shadow-[0_0_14px_rgba(239,68,68,0.5)] animate-pulse'
                                  : 'bg-white hover:bg-slate-100 text-slate-950 border-slate-200'
                              }`}
                              id={`btn-live-camera-${session.id}`}
                              title={
                                isPresenter
                                  ? (isUserLiveStreamingWithCamera ? "Desactivar cámara en directo" : "Conectar cámara en directo")
                                  : (isWatchingPresenterCamera ? `Detener visualización de cámara de ${presenter.name}` : `Ver cámara en directo de ${presenter.name}`)
                              }
                            >
                              {isLiveActive ? (
                                <>
                                  <Camera className="w-3.5 h-3.5 shrink-0 text-white" />
                                  <span>Detener Live</span>
                                </>
                              ) : (
                                <>
                                  <Camera className="w-3.5 h-3.5 shrink-0 text-slate-950" />
                                  <span>Live</span>
                                </>
                              )}
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>

                {/* 👥 BOTTOM BADGE & INSCRIPTION (z.png & image.png) */}
                <div className="w-full flex flex-col items-center gap-2 pb-2">
                  {/* Inscription Action Button */}
                  <div className="w-full flex flex-col items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveFinanzasSessionIndex(index);
                        setShowVotingProjectsModal(false);
                        setShowProjectDetailsInPopup(false);
                        setDetailProjectUser(null);
                        setActiveFinanzasPopupUser(null);
                        if (setShowFinanzasResults) setShowFinanzasResults(false);
                        if (setShowFinanzasRecount) setShowFinanzasRecount(false);

                        if (isUserEnrolledInThisRound) {
                          if (setShowParticipantsGatheringModal) {
                            setShowParticipantsGatheringModal(true);
                          }
                        } else if (onExecutePaymentAndJoinSession) {
                          onExecutePaymentAndJoinSession(session);
                        } else {
                          setShowFinanzasInscriptionInChannel(true);
                        }
                      }}
                      className={`w-full font-black text-[12px] sm:text-[13px] px-5 py-2.5 sm:py-3 rounded-full transition duration-200 border flex items-center justify-center gap-2 cursor-pointer font-sans shadow-lg box-border active:scale-95 ${
                        isUserEnrolledInThisRound
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white border-emerald-400 shadow-emerald-900/30'
                          : 'bg-gradient-to-r from-[#FFD1DC] via-[#FCC2D0] to-[#F8B4C4] hover:from-[#FCC2D0] hover:to-[#F5A3B7] text-[#3D1422] border-[#F4A8B9] shadow-pink-900/25'
                      }`}
                      id={`btn-inscribirse-ronda-${session.id}`}
                    >
                      <span>{isUserEnrolledInThisRound ? '✅' : '⚡'}</span>
                      <span className="truncate min-w-0">
                        {isUserEnrolledInThisRound
                          ? `Estás inscrita como participante (${feeInfo.feeShort})`
                          : `Disparar Pago de ${feeInfo.feeShort}`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveFinanzasSessionIndex(index);
                        setShowFinanzasInscriptionInChannel(false);
                        setShowProjectDetailsInPopup(false);
                        setDetailProjectUser(null);
                        setActiveFinanzasPopupUser(null);
                        if (setShowFinanzasResults) setShowFinanzasResults(false);
                        if (setShowFinanzasRecount) setShowFinanzasRecount(false);
                        setShowVotingProjectsModal(true);
                      }}
                      className="w-full bg-[#0f172a] hover:bg-slate-800 active:scale-95 text-white font-black text-[11px] sm:text-[12px] py-2.5 px-6 rounded-full transition duration-200 border border-slate-700/80 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider font-sans shadow-md"
                      id={`btn-ver-proyectos-ronda-${session.id}`}
                    >
                      <span>📋</span>
                      <span>VER PROYECTOS</span>
                    </button>
                  </div>

                  {/* 👥 10 PARTICIPANTES - ABAJO DEL TODO (Hover en grande) */}
                  <div 
                    className="relative w-full flex justify-center pt-0.5"
                    onMouseEnter={() => setActiveHoveredParticipantsSession(session.id)}
                    onMouseLeave={() => setActiveHoveredParticipantsSession(null)}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (setShowParticipantsGatheringModal) {
                          setShowParticipantsGatheringModal(true);
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 hover:from-slate-800 hover:to-slate-700 text-white border border-emerald-500/70 hover:border-emerald-400 px-3 py-1 sm:py-1.5 rounded-full text-[9.5px] sm:text-[10px] font-black tracking-normal cursor-pointer transition-all duration-200 shadow-md hover:scale-102 active:scale-95 mx-auto"
                      id={`btn-10-participantes-ronda-${session.id}`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399] shrink-0" />
                      <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="whitespace-nowrap">10 PARTICIPANTES • Pasa el ratón aquí</span>
                    </button>

                    {/* Floating Participants Popover - Encaja perfectamente dentro de la tarjeta sin desbordar */}
                    {activeHoveredParticipantsSession === session.id && (
                      <div className="absolute inset-x-2 sm:inset-x-3 bottom-12 z-50 bg-[#0A0E1A]/98 backdrop-blur-2xl border-2 border-emerald-500/70 p-3 sm:p-3.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_25px_rgba(16,185,129,0.25)] flex flex-col text-left animate-in fade-in zoom-in-95 duration-200 pointer-events-auto max-h-[460px] overflow-hidden">
                        {/* Header with Title and Status */}
                        <div className="flex items-center justify-between gap-1.5 border-b border-slate-800/80 pb-2 mb-2 shrink-0">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399] shrink-0" />
                            <span className="text-[10px] sm:text-[10.5px] font-black uppercase text-emerald-400 tracking-wider truncate">
                              Participantes de {roundTitle}:
                            </span>
                          </div>
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[8.5px] sm:text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 tracking-wider">
                            10 / 10 ONLINE
                          </span>
                        </div>

                        {/* Large 2-column grid of 10 participants - perfect containment & synchronized with top turn */}
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 max-h-[310px] overflow-y-auto pr-0.5 scrollbar-thin">
                          {participants.map((p, pIdx) => {
                            const pTurn = pIdx + 1;
                            const isCurrentExposing = Boolean(
                              p.id === presenter.id ||
                              p.name === presenter.name ||
                              (presenter.name?.includes('Adriana') && (p.name?.includes('Adriana') || p.id === 'user-adriana' || p.isSelf))
                            );

                            return (
                              <button 
                                key={p.id || pIdx} 
                                type="button"
                                onClick={() => {
                                  setSessionSelectedPresenterMap(prev => ({ ...prev, [session.id]: p }));
                                  if (setSelectedFinanzasUser) setSelectedFinanzasUser(p);
                                  if (setSystemVoiceNotification) {
                                    setSystemVoiceNotification({
                                      show: true,
                                      message: `🎤 Turno ${pTurn} de 10: ${p.name} pasa a dar su exposición.`
                                    });
                                  }
                                }}
                                title={`Turno ${pTurn} de 10: ${p.name}. Haz clic para sincronizar su exposición.`}
                                className={`flex items-center gap-1.5 p-1.5 sm:p-2 rounded-xl transition duration-150 shadow-sm min-w-0 overflow-hidden text-left w-full cursor-pointer ${
                                  isCurrentExposing
                                    ? 'bg-gradient-to-r from-pink-950/90 via-rose-950/80 to-pink-900/70 border-2 border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.45)] ring-2 ring-pink-400/60 scale-[1.02]'
                                    : 'bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-500'
                                }`}
                              >
                                <div className="relative shrink-0">
                                  <img 
                                    src={p.avatar} 
                                    alt={p.name} 
                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1.5 ${
                                      isCurrentExposing ? 'ring-pink-400 ring-offset-1 ring-offset-pink-950' : 'ring-slate-700'
                                    }`}
                                    referrerPolicy="no-referrer" 
                                  />
                                  {/* Badge with Turn Number */}
                                  <span className={`absolute -top-1 -left-1 text-[7px] font-black px-1 py-0.2 rounded-full border leading-tight ${
                                    isCurrentExposing 
                                      ? 'bg-pink-500 text-white border-pink-300 shadow-xs' 
                                      : 'bg-slate-800 text-slate-300 border-slate-600'
                                  }`}>
                                    #{pTurn}
                                  </span>
                                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-900 ${
                                    isCurrentExposing ? 'bg-pink-400 animate-pulse' : 'bg-emerald-400'
                                  }`} />
                                </div>
                                <div className="min-w-0 flex-1 overflow-hidden">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className={`text-[10px] sm:text-[10.5px] font-bold truncate block leading-tight ${
                                      isCurrentExposing ? 'text-pink-100 font-black' : 'text-slate-100'
                                    }`}>
                                      {p.name}
                                    </span>
                                    {isCurrentExposing && (
                                      <span className="bg-pink-500/40 text-pink-200 border border-pink-400 text-[6.5px] font-black px-1 rounded uppercase tracking-wider shrink-0">
                                        EN VIVO
                                      </span>
                                    )}
                                  </div>
                                  <span className={`text-[8.5px] sm:text-[9px] truncate block leading-tight mt-0.5 ${
                                    isCurrentExposing ? 'text-pink-300 font-bold' : 'text-slate-400'
                                  }`}>
                                    {isCurrentExposing 
                                      ? `🔴 Turno ${pTurn} de 10 • En Exposición`
                                      : (p.role || `@${p.username || 'user'}`)}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Footer status notice */}
                        <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px] sm:text-[9.5px] text-slate-400 shrink-0">
                          <span className="flex items-center gap-1.5 text-pink-300 font-bold truncate min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0 animate-ping" />
                            <span className="truncate">{presenter.name} en exposición (Turno {turnNumber} de 10)</span>
                          </span>
                          <span className="text-emerald-400 font-black shrink-0 ml-2">
                            Sala Lista
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 📱 TIKTOK ACTION COLUMN ON THE RIGHT */}
              <div 
                className="flex flex-col items-center gap-2.5 sm:gap-3 select-none shrink-0 self-center my-auto"
                id={`tiktok-actions-sidebar-${session.id}`}
              >
                {/* Like button with count (e.g. 43.2K) */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleToggleLike(session.id)}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-white flex items-center justify-center shadow-lg transition active:scale-90 cursor-pointer"
                    title="Me gusta"
                  >
                    <Heart className={`w-5 h-5 ${likesData.userLiked ? 'fill-[#fe2c55] text-[#fe2c55]' : 'text-white'}`} />
                  </button>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                    {formatCount(likesData.count)}
                  </span>
                </div>

                {/* Comment icon with count (e.g. 17) */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenComments) onOpenComments();
                    }}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-white flex items-center justify-center shadow-lg transition active:scale-90 cursor-pointer"
                    title="Comentarios"
                  >
                    <MessageCircle className="w-5 h-5 text-white" />
                  </button>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                    {commentsCount}
                  </span>
                </div>

                {/* Bookmark / Save icon with count (e.g. 592) */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleToggleSave(session.id)}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-white flex items-center justify-center shadow-lg transition active:scale-90 cursor-pointer"
                    title="Guardar"
                  >
                    <Bookmark className={`w-5 h-5 ${savesData.userSaved ? 'fill-amber-400 text-amber-400' : 'text-white'}`} />
                  </button>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                    {formatCount(savesData.count)}
                  </span>
                </div>

                {/* Share icon with count (e.g. 726) */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (onShare) onShare();
                    }}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-white flex items-center justify-center shadow-lg transition active:scale-90 cursor-pointer"
                    title="Compartir"
                  >
                    <Share2 className="w-5 h-5 text-white" />
                  </button>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                    {formatCount(sharesCount)}
                  </span>
                </div>

                {/* Options (...) */}
                <button
                  type="button"
                  onClick={() => {
                    scrollToRound((index + 1) % activeSessionsOnly.length);
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-white flex items-center justify-center shadow-lg transition active:scale-90 cursor-pointer"
                  title="Siguiente Ronda"
                >
                  <MoreHorizontal className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
