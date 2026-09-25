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
  X,
  Volume2,
  VolumeX,
  Minimize2,
  CameraOff,
  Send,
  Smile,
  MicOff
} from 'lucide-react';
import { 
  TRABAJADORES_USERS, 
  FINANZAS_USERS, 
  EMPRESARIOS_USERS, 
  TOPMODELS_USERS, 
  INVERSORES_USERS, 
  MILLONARIOS_USERS,
  getParticipantLiveCameraVideo
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
  userLiveMediaStream?: MediaStream | null;
  liveStreamTimerSeconds?: number;
  formatLiveStreamDuration?: (secs: number) => string;
  liveCameraFacingMode?: 'user' | 'environment';
  isWatchingPresenterCamera: boolean;
  handleToggleUserCameraLiveBroadcast: () => void;
  setIsWatchingPresenterCamera: React.Dispatch<React.SetStateAction<boolean>>;
  isPresenterCameraFullscreen?: boolean;
  setIsPresenterCameraFullscreen: (val: boolean) => void;
  isPresenterCameraAudioMuted?: boolean;
  setIsPresenterCameraAudioMuted?: (val: boolean) => void;
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
  detailProjectUser?: any;
  showProjectDetailsInPopup?: boolean;
  renderProjectDetailsContent?: () => React.ReactNode;
  showFinanzasRecount?: boolean;
  renderFinanzasRecountContent?: () => React.ReactNode;
  showFinanzasResults?: boolean;
  renderFinanzasResultsContent?: () => React.ReactNode;
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
  showScreenShareMenu?: boolean;
  setShowScreenShareMenu?: (show: boolean) => void;
  renderScreenShareContent?: () => React.ReactNode;
  enlargedWindowUser?: any;
  setEnlargedWindowUser?: (user: any) => void;
  renderEnlargedParticipantWindow?: () => React.ReactNode;
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
  userLiveMediaStream = null,
  liveStreamTimerSeconds = 14,
  formatLiveStreamDuration = (sec: number) => `${Math.floor(sec / 60).toString().padStart(2, '0')}:${(sec % 60).toString().padStart(2, '0')}`,
  liveCameraFacingMode = 'user',
  isWatchingPresenterCamera,
  handleToggleUserCameraLiveBroadcast,
  setIsWatchingPresenterCamera,
  isPresenterCameraFullscreen = false,
  setIsPresenterCameraFullscreen,
  isPresenterCameraAudioMuted = false,
  setIsPresenterCameraAudioMuted,
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
  detailProjectUser = null,
  showProjectDetailsInPopup = false,
  renderProjectDetailsContent,
  showFinanzasRecount = false,
  renderFinanzasRecountContent,
  showFinanzasResults = false,
  renderFinanzasResultsContent,
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
  onOpenGuestsModal,
  showScreenShareMenu = false,
  setShowScreenShareMenu,
  renderScreenShareContent,
  enlargedWindowUser,
  setEnlargedWindowUser,
  renderEnlargedParticipantWindow
}) => {
  const feedContainerRef = useRef<HTMLDivElement>(null);
  // 🎛️ Channels menu hover & toggle state
  const [activeChannelsMenuSessionId, setActiveChannelsMenuSessionId] = useState<string | null>(null);
  const channelsMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showCameraParticipantsGrid, setShowCameraParticipantsGrid] = useState<Record<string, boolean>>({});

  const lastWheelTimeRef = useRef<number>(0);
  // ⚠️ Aviso cuando el usuario intenta inscribirse en otra ronda estando ya participando en una
  const [alreadyParticipatingNotice, setAlreadyParticipatingNotice] = useState<{
    show: boolean;
    currentRoundTitle: string;
    attemptedRoundTitle: string;
    enrolledIndex: number;
    targetSessionId?: string;
  } | null>(null);

  const handleWheelFeed = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTimeRef.current < 300) return;
    if (Math.abs(e.deltaY) > 10) {
      lastWheelTimeRef.current = now;
      if (e.deltaY > 0) {
        scrollToRound(activeFinanzasSessionIndex + 1);
      } else {
        scrollToRound(activeFinanzasSessionIndex - 1);
      }
    }
  };

  // Touch swipe support for mobile and trackpad gestures (Matching image.png snap scrolling)
  const touchStartYRef = useRef<number | null>(null);
  const handleTouchStartFeed = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };
  const handleTouchEndFeed = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const diff = touchStartYRef.current - e.changedTouches[0].clientY;
    touchStartYRef.current = null;
    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        scrollToRound(activeFinanzasSessionIndex + 1);
      } else {
        scrollToRound(activeFinanzasSessionIndex - 1);
      }
    }
  };

  // Listen to global feed scroll events from child views (such as z.png results screen)
  useEffect(() => {
    const handleCustomFeedScroll = (e: any) => {
      const now = Date.now();
      if (now - lastWheelTimeRef.current < 300) return;
      lastWheelTimeRef.current = now;
      if (e.detail?.direction === 'next') {
        scrollToRound(activeFinanzasSessionIndex + 1);
      } else if (e.detail?.direction === 'prev') {
        scrollToRound(activeFinanzasSessionIndex - 1);
      }
    };
    window.addEventListener('tiktok-feed-scroll-round', handleCustomFeedScroll);
    return () => window.removeEventListener('tiktok-feed-scroll-round', handleCustomFeedScroll);
  }, [activeFinanzasSessionIndex, activeSessionsOnly.length]);

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
    }, 450);
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

  const INITIAL_COMMENTS_MAP: Record<string, Array<{
    id: string;
    userName: string;
    userAvatar: string;
    text: string;
    timeAgo: string;
    likes: number;
    userLiked?: boolean;
  }>> = {
    'sess-trabajadores-1': [
      {
        id: 'c1',
        userName: 'Elena Ramos',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        text: '¡Excelente propuesta de diseño para la identidad de marca! Muy limpia.',
        timeAgo: 'hace 1 min',
        likes: 12
      },
      {
        id: 'c2',
        userName: 'Carlos Mendoza',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        text: 'La viabilidad del proyecto está muy bien fundamentada. Tienes mi voto 🙌',
        timeAgo: 'hace 2 min',
        likes: 8
      },
      {
        id: 'c3',
        userName: 'Sofía Valdés',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        text: 'El timing de exposición va perfecto, muy claro todo 👏',
        timeAgo: 'hace 3 min',
        likes: 19
      },
      {
        id: 'c4',
        userName: 'Mateo Silva',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        text: 'Gran trabajo Lucas, la maqueta y los colores destacan muchísimo.',
        timeAgo: 'hace 4 min',
        likes: 5
      }
    ]
  };

  const EMOJI_LIST = ['❤️', '🔥', '👏', '🚀', '💯', '😂', '😍', '🙌', '💡', '💰', '🏆', '✨', '👍', '🌟', '🤩', '💎', '📈', '🎯', '💪', '🎉', '😎', '🥳', '👑', '💸'];

  const EMOJI_GLOSSARY: Array<{ category: string; icon: string; emojis: string[] }> = [
    {
      category: 'Populares',
      icon: '🔥',
      emojis: ['❤️', '🔥', '👏', '🚀', '💯', '✨', '💎', '👑', '🏆', '⚡', '🍿', '🤩', '🥂', '🌟', '💥', '🔝', '🎯', '🦾', '🥳', '🙌', '😍', '😂']
    },
    {
      category: 'Caras y Emociones',
      icon: '😀',
      emojis: [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '🥹', '😊', '😇',
        '🙂', '😉', '😌', '😍', '🥰', '😘', '😋', '😛', '😜', '🤪', '😝', '🤑',
        '🤗', '🤫', '🤔', '🫡', '🤐', '🤨', '😐', '😏', '😒', '🙄', '😬', '🤥',
        '😴', '😷', '🤒', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '😎', '🤓', '🧐'
      ]
    },
    {
      category: 'Finanzas y Negocios',
      icon: '💰',
      emojis: [
        '💰', '💵', '💶', '💷', '🪙', '💸', '💳', '📈', '📉', '📊', '🏦', '🏢',
        '💼', '📁', '🤝', '💡', '⚖️', '🎯', '📱', '💻', '🖥️', '📞', '🏷️', '📌',
        '🔑', '🔒', '🗂️', '🧾', '📦', '🛒', '🛍️', '🎁'
      ]
    },
    {
      category: 'Gestos y Manos',
      icon: '🙌',
      emojis: [
        '👍', '👎', '👏', '🙌', '👐', '🤲', '🤝', '🤜', '🤛', '✊', '👊', '🖐️',
        '✋', '🤚', '👋', '🤙', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '👈',
        '👉', '👆', '👇', '☝️', '✍️', '🙏', '🫶', '💪'
      ]
    },
    {
      category: 'Amor y Corazones',
      icon: '❤️',
      emojis: [
        '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹',
        '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'
      ]
    },
    {
      category: 'Celebración',
      icon: '🎉',
      emojis: [
        '🎉', '🎊', '🎈', '🎁', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '👑', '🥳',
        '🍾', '🥂', '🍻', '🎂', '🍰', '🎆', '🎇', '🔔', '📣', '📢'
      ]
    }
  ];

  const [sessionCommentsMap, setSessionCommentsMap] = useState(INITIAL_COMMENTS_MAP);
  const [activeCommentsSessionId, setActiveCommentsSessionId] = useState<string | null>(null);
  const [commentInputMap, setCommentInputMap] = useState<Record<string, string>>({});
  const [showEmojiPickerSessionId, setShowEmojiPickerSessionId] = useState<string | null>(null);
  const [glossaryCategory, setGlossaryCategory] = useState<string>('Populares');

  const handleAddSessionComment = (sessionId: string, customText?: string) => {
    const text = (customText !== undefined ? customText : (commentInputMap[sessionId] || '')).trim();
    if (!text) return;
    const newComment = {
      id: `comm-${Date.now()}`,
      userName: userProfile?.name || 'Adriana Lima',
      userAvatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      text,
      timeAgo: 'Ahora mismo',
      likes: 0
    };
    setSessionCommentsMap(prev => ({
      ...prev,
      [sessionId]: [newComment, ...(prev[sessionId] || INITIAL_COMMENTS_MAP['sess-trabajadores-1'] || [])]
    }));
    if (customText === undefined) {
      setCommentInputMap(prev => ({ ...prev, [sessionId]: '' }));
    }
    setShowEmojiPickerSessionId(null);
  };

  const handleInsertEmoji = (sessionId: string, emoji: string) => {
    setCommentInputMap(prev => ({
      ...prev,
      [sessionId]: (prev[sessionId] || '') + emoji
    }));
  };

  // 📚 Glosario de Emojis que se abre al pulsar en el emoji del bloque para escribir comentarios
  const renderEmojiGlossary = (sessionId: string) => {
    if (showEmojiPickerSessionId !== sessionId) return null;
    const activeCatObj = EMOJI_GLOSSARY.find(c => c.category === glossaryCategory) || EMOJI_GLOSSARY[0];
    return (
      <div 
        className="absolute bottom-[calc(100%+8px)] left-0 right-0 z-50 bg-[#070b14]/98 backdrop-blur-2xl border-2 border-rose-500/70 rounded-2xl p-2.5 sm:p-3 shadow-[0_-16px_50px_rgba(0,0,0,0.98)] animate-slide-up text-left select-none pointer-events-auto"
        id={`emoji-glossary-popover-${sessionId}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con título y botón de cierre */}
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">📚</span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase text-white tracking-wider">
              Glosario de Emojis
            </span>
            <span className="text-[8px] text-amber-300 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded-full border border-amber-400/20">
              Toca para añadir
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowEmojiPickerSessionId(null)}
            className="text-slate-400 hover:text-white p-1 rounded-full text-xs font-bold transition hover:bg-slate-800 cursor-pointer"
            title="Cerrar glosario"
          >
            ✕
          </button>
        </div>

        {/* Pestañas de categorías del glosario */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1.5 mb-1.5 border-b border-white/5">
          {EMOJI_GLOSSARY.map(cat => (
            <button
              key={cat.category}
              type="button"
              onClick={() => setGlossaryCategory(cat.category)}
              className={`px-2 py-0.5 rounded-full text-[8.5px] sm:text-[9px] font-bold whitespace-nowrap transition cursor-pointer shrink-0 flex items-center gap-1 ${
                glossaryCategory === cat.category
                  ? 'bg-rose-600 text-white shadow-sm ring-1 ring-rose-400'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.category}</span>
            </button>
          ))}
        </div>

        {/* Cuadrícula de emojis interactiva */}
        <div className="grid grid-cols-7 sm:grid-cols-8 gap-1.5 max-h-36 sm:max-h-44 overflow-y-auto custom-scrollbar p-1">
          {activeCatObj.emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={(e) => {
                handleInsertEmoji(sessionId, emoji);
                window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                  detail: { emoji, icon: emoji, pureEmoji: true, x: e.clientX, y: e.clientY }
                }));
              }}
              className="w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center text-lg sm:text-xl rounded-xl hover:bg-white/15 active:scale-130 hover:scale-115 transition cursor-pointer select-none border-0 bg-transparent"
              title={`Añadir ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Barra inferior: instrucción y botón para enviar */}
        <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-white/10 text-[8.5px] text-slate-400">
          <span>Toca emojis para añadirlos</span>
          <button
            type="button"
            onClick={() => {
              handleAddSessionComment(sessionId);
            }}
            disabled={!(commentInputMap[sessionId] || '').trim()}
            className="text-emerald-400 font-bold hover:underline disabled:opacity-30 cursor-pointer bg-transparent border-0"
          >
            Enviar ahora ↵
          </button>
        </div>
      </div>
    );
  };

  const handleToggleCommentLike = (sessionId: string, commentId: string) => {
    setSessionCommentsMap(prev => {
      const list = prev[sessionId] || INITIAL_COMMENTS_MAP['sess-trabajadores-1'] || [];
      return {
        ...prev,
        [sessionId]: list.map(c => {
          if (c.id === commentId) {
            const wasLiked = c.userLiked;
            return {
              ...c,
              likes: wasLiked ? c.likes - 1 : c.likes + 1,
              userLiked: !wasLiked
            };
          }
          return c;
        })
      };
    });
  };

  // 🔊 Channel volume control state & handlers
  const [channelVolume, setChannelVolume] = useState<number>(80);
  const [prevVolume, setPrevVolume] = useState<number>(80);
  const [isDraggingVolume, setIsDraggingVolume] = useState<boolean>(false);
  const [isVolumeHovered, setIsVolumeHovered] = useState<boolean>(false);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const activeVolumeTrackRef = useRef<HTMLElement | null>(null);

  // Audio chirp feedback when adjusting volume
  const playVolumeBeep = (volPct: number) => {
    try {
      if (volPct <= 0 || isPresenterCameraAudioMuted) return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400 + (volPct * 3.5), ctx.currentTime);
      const volumeGain = Math.max(0.005, (volPct / 100) * 0.08);
      gain.gain.setValueAtTime(volumeGain, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  };

  const updateVolumeFromClientY = (clientY: number, trackEl?: HTMLElement | null) => {
    const el = trackEl || activeVolumeTrackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const height = rect.height;
    if (height <= 0) return;
    const offsetY = rect.bottom - clientY;
    const rawPct = (offsetY / height) * 100;
    const percentage = Math.round(Math.max(0, Math.min(100, rawPct)));
    
    setChannelVolume(percentage);
    if (percentage === 0) {
      if (setIsPresenterCameraAudioMuted) setIsPresenterCameraAudioMuted(true);
    } else {
      if (setIsPresenterCameraAudioMuted && isPresenterCameraAudioMuted) {
        setIsPresenterCameraAudioMuted(false);
      }
      setPrevVolume(percentage);
    }
  };

  const handleVolumePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const trackEl = (e.currentTarget.querySelector('[data-volume-track]') as HTMLElement) || e.currentTarget;
    activeVolumeTrackRef.current = trackEl;
    setIsDraggingVolume(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    updateVolumeFromClientY(e.clientY, trackEl);
  };

  const handleVolumePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingVolume || e.buttons === 1) {
      e.preventDefault();
      e.stopPropagation();
      updateVolumeFromClientY(e.clientY);
    }
  };

  const handleVolumePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingVolume) {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingVolume(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      playVolumeBeep(channelVolume);
    }
  };

  const handleVolumeWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const delta = e.deltaY < 0 ? 5 : -5;
    setChannelVolume(prev => {
      const next = Math.max(0, Math.min(100, prev + delta));
      if (next === 0) {
        if (setIsPresenterCameraAudioMuted) setIsPresenterCameraAudioMuted(true);
      } else {
        if (setIsPresenterCameraAudioMuted && isPresenterCameraAudioMuted) {
          setIsPresenterCameraAudioMuted(false);
        }
        setPrevVolume(next);
      }
      playVolumeBeep(next);
      return next;
    });
  };

  const handleToggleMute = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isPresenterCameraAudioMuted || channelVolume === 0) {
      const restore = prevVolume > 0 ? prevVolume : 80;
      setChannelVolume(restore);
      if (setIsPresenterCameraAudioMuted) setIsPresenterCameraAudioMuted(false);
      playVolumeBeep(restore);
    } else {
      setPrevVolume(channelVolume);
      setChannelVolume(0);
      if (setIsPresenterCameraAudioMuted) setIsPresenterCameraAudioMuted(true);
    }
  };

  // Synchronize master video audio & element volumes
  useEffect(() => {
    const isMuted = Boolean(isPresenterCameraAudioMuted || channelVolume === 0);
    const vol = isMuted ? 0 : Math.max(0, Math.min(1, channelVolume / 100));

    if (liveVideoRef.current) {
      liveVideoRef.current.muted = isMuted;
      liveVideoRef.current.volume = vol;
    }

    try {
      const cur = activeSessionsOnly[activeFinanzasSessionIndex];
      if (cur) {
        const container = document.getElementById(`round-container-box-${cur.id}`);
        if (container) {
          const videos = container.querySelectorAll('video');
          videos.forEach((v) => {
            if (v.getAttribute('data-is-self-camera') === 'true') return;
            v.muted = isMuted;
            v.volume = vol;
          });
        }
      }
    } catch {}
  }, [channelVolume, isPresenterCameraAudioMuted, activeSessionsOnly, activeFinanzasSessionIndex]);

  const sharesCountMap: Record<string, number> = {
    'sess-trabajadores-1': 726,
    'sess-emprendedores-1': 982,
    'sess-empresarios-1': 2140,
    'sess-topmodels-1': 3420,
    'sess-inversores-1': 5710,
    'sess-millonarios-1': 12600
  };

  // 🎙️ GUION DE EXPOSICIÓN EN VIVO DE LUCAS TORRES (DISEÑADOR GRÁFICO • STREETWEAR & URBAN)
  const LUCAS_TORRES_SPEECH_SEGMENTS = [
    "Hola a todos los presentes y a los miembros e inversores de la sala. Soy Lucas Torres, diseñador gráfico y director creativo del proyecto KORVEX Urban Studio.",
    "En estos cinco minutos de exposición en directo quiero compartir con vosotros nuestra propuesta: una colección cápsula de streetwear técnico sostenible producida con algodón orgánico de alta densidad.",
    "Hemos desarrollado una identidad visual única con patrones oversize y tipografías de autor, pensadas específicamente para la cultura urbana actual.",
    "Nuestro modelo de venta directa al consumidor a través de drops exclusivos nos permite operar con un margen de beneficio superior al sesenta por ciento sin intermediarios.",
    "Con la financiación de esta primera ronda, pondremos en marcha la primera tirada de producción en talleres locales de Barcelona y la tienda online interactiva.",
    "Quedan pocos minutos de mi exposición y os invito a conocer las piezas. ¡Agradezco vuestro apoyo y cuento con vuestro voto al finalizar la ronda!"
  ];

  const speechSegmentIndexRef = useRef(0);
  const isSpeechActiveRef = useRef(true);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLucasTorresSpeaking, setIsLucasTorresSpeaking] = useState(false);

  const stopLucasTorresSpeech = () => {
    isSpeechActiveRef.current = false;
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setIsLucasTorresSpeaking(false);
  };

  const speakLucasTorresSegment = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (!isSpeechActiveRef.current) return;

    const curSession = activeSessionsOnly[activeFinanzasSessionIndex];
    if (!curSession) return;
    const isVoting = Boolean(sessionVotingPhaseMap[curSession.id] || (isVotingPhaseActive && activeFinanzasSessionIndex === 0));
    if (isVoting || showFinanzasResults || showFinanzasRecount) {
      stopLucasTorresSpeech();
      return;
    }

    const currentPresenter = getSessionPresenter(curSession, activeFinanzasSessionIndex);
    if (!currentPresenter?.name?.includes('Lucas') && currentPresenter?.id !== 'trab-1') {
      stopLucasTorresSpeech();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const segments = LUCAS_TORRES_SPEECH_SEGMENTS;
      const text = segments[speechSegmentIndexRef.current % segments.length];
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.02;
      utterance.pitch = 1.0;

      const isMuted = isPresenterCameraAudioMuted || channelVolume === 0;
      utterance.volume = isMuted ? 0 : Math.max(0.1, channelVolume / 100);

      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Jorge') || v.name.includes('Pablo') || v.name.includes('Diego') || v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Spain')))
        || voices.find(v => v.lang.startsWith('es'));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      utterance.onstart = () => {
        setIsLucasTorresSpeaking(true);
      };

      utterance.onend = () => {
        speechSegmentIndexRef.current = (speechSegmentIndexRef.current + 1) % segments.length;
        if (isSpeechActiveRef.current) {
          speechTimeoutRef.current = setTimeout(() => {
            if (isSpeechActiveRef.current) {
              speakLucasTorresSegment();
            }
          }, 1400);
        }
      };

      utterance.onerror = () => {
        if (isSpeechActiveRef.current) {
          speechSegmentIndexRef.current = (speechSegmentIndexRef.current + 1) % segments.length;
          speechTimeoutRef.current = setTimeout(() => {
            if (isSpeechActiveRef.current) {
              speakLucasTorresSegment();
            }
          }, 1500);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
    }
  };

  const resumeOrStartLucasSpeech = () => {
    isSpeechActiveRef.current = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else if (!window.speechSynthesis.speaking) {
        speakLucasTorresSegment();
      }
    }
  };

  // 🎙️ Estado y manejador del micrófono en directo para la vista de cámara del presentador
  const [isPresenterLiveMicActive, setIsPresenterLiveMicActive] = useState<boolean>(true);

  useEffect(() => {
    const isMutedEffective = Boolean(isPresenterCameraAudioMuted || isMuted || !isBroadcastMicOn);
    setIsPresenterLiveMicActive(!isMutedEffective);
  }, [isPresenterCameraAudioMuted, isMuted, isBroadcastMicOn]);

  const handleTogglePresenterLiveMic = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const nextState = !isPresenterLiveMicActive;
    setIsPresenterLiveMicActive(nextState);

    // Sincronizar con el estado global de micro de la transmisión
    if (toggleBroadcastMic) {
      toggleBroadcastMic();
    }

    if (nextState) {
      // Activar audio, vídeo y síntesis de voz
      if (setIsPresenterCameraAudioMuted) {
        setIsPresenterCameraAudioMuted(false);
      }
      if (channelVolume === 0) {
        setChannelVolume(80);
        setPrevVolume(80);
      }
      if (liveVideoRef.current) {
        liveVideoRef.current.muted = false;
        liveVideoRef.current.volume = Math.max(0.2, (channelVolume || 80) / 100);
        liveVideoRef.current.play().catch(() => {});
      }
      resumeOrStartLucasSpeech();

      if (userLiveMediaStream) {
        userLiveMediaStream.getAudioTracks().forEach(t => {
          t.enabled = true;
        });
      }

      if (setSystemVoiceNotification) {
        setSystemVoiceNotification({
          show: true,
          message: '🎙️ Micrófono activado: audio en directo conectado'
        });
      }
    } else {
      // Silenciar audio, vídeo y cancelar voz
      if (setIsPresenterCameraAudioMuted) {
        setIsPresenterCameraAudioMuted(true);
      }
      if (liveVideoRef.current) {
        liveVideoRef.current.muted = true;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (userLiveMediaStream) {
        userLiveMediaStream.getAudioTracks().forEach(t => {
          t.enabled = false;
        });
      }

      if (setSystemVoiceNotification) {
        setSystemVoiceNotification({
          show: true,
          message: '🔇 Micrófono silenciado'
        });
      }
    }
  };

  // 💖 LLUVIA DE CORAZONES EN TODA LA PANTALLA
  const [showerHearts, setShowerHearts] = useState<Array<{
    id: number;
    left: number;
    size: number;
    duration: number;
    delay: number;
    drift1: number;
    drift2: number;
    drift3: number;
    drift4: number;
    rot1: number;
    rot2: number;
    rot3: number;
    rot4: number;
    emoji: string;
    type: 'rain' | 'rise';
  }>>([]);

  const playHeartSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;
      const freqs = [659.25, 880, 1174.66, 1318.51];
      freqs.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.08 / (idx + 1), now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.32);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.35);
      });
    } catch (e) {}
  };

  const triggerHeartsShower = () => {
    playHeartSound();
    const count = 42;
    const baseTime = Date.now();
    const emojis = ['❤️', '💖', '💕', '💓', '💗', '💘', '💝', '✨', '🌹'];
    const newHearts: typeof showerHearts = [];

    for (let i = 0; i < count; i++) {
      const isRain = Math.random() < 0.75; // 75% cae desde arriba como lluvia, 25% asciende
      const size = Math.floor(Math.random() * 32) + 24; // 24px - 56px
      const duration = +(1.8 + Math.random() * 1.3).toFixed(2);
      const delay = +(Math.random() * 0.35).toFixed(2);
      const left = Math.floor(Math.random() * 92) + 4; // 4% a 96% de la pantalla

      newHearts.push({
        id: baseTime + i + Math.floor(Math.random() * 1000000),
        left,
        size,
        duration,
        delay,
        drift1: Math.floor(Math.random() * 30) - 15,
        drift2: Math.floor(Math.random() * 50) - 25,
        drift3: Math.floor(Math.random() * 40) - 20,
        drift4: Math.floor(Math.random() * 60) - 30,
        rot1: Math.floor(Math.random() * 40) - 20,
        rot2: Math.floor(Math.random() * 50) - 25,
        rot3: Math.floor(Math.random() * 60) - 30,
        rot4: Math.floor(Math.random() * 70) - 35,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        type: isRain ? 'rain' : 'rise'
      });
    }

    setShowerHearts(prev => [...prev.slice(-90), ...newHearts]);

    setTimeout(() => {
      setShowerHearts(prev => prev.filter(h => !newHearts.some(nh => nh.id === h.id)));
    }, 3800);
  };

  const [activeHoveredParticipantsSession, setActiveHoveredParticipantsSession] = useState<string | null>(null);
  // 🎛️ Synchronized selected presenter per session for direct turn switching
  const [sessionSelectedPresenterMap, setSessionSelectedPresenterMap] = useState<Record<string, any>>({});

  // 🗳️ State for 10-minute voting phase per session (matching zq.png)
  // Always starts empty/false by default so 5-minute participant expositions come first!
  const [sessionVotingPhaseMap, setSessionVotingPhaseMap] = useState<Record<string, boolean>>({});

  // ⏱️ Exposition 5-minute timer (300s = 5:00 minutes each participant)
  const [sessionExpositionTimerMap, setSessionExpositionTimerMap] = useState<Record<string, number>>(() => ({
    'sess-trabajadores-1': 300,
    'sess-emprendedores-1': 300,
    'sess-empresarios-1': 300,
    'sess-topmodels-1': 300,
    'sess-inversores-1': 300,
    'sess-millonarios-1': 300,
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
    stopLucasTorresSpeech();
    const participants = getSessionParticipants(session);
    const presenter = getSessionPresenter(session, index);
    const presenterIdx = participants.findIndex(p =>
      p.id === presenter.id ||
      p.name === presenter.name ||
      (presenter.name?.includes('Adriana') && (p.name?.includes('Adriana') || p.id === 'user-adriana' || p.isSelf))
    );
    const currentIdx = presenterIdx !== -1 ? presenterIdx : 0;
    const isLast = currentIdx >= 9 || currentIdx >= participants.length - 1;

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
              stopLucasTorresSpeech();
              setTimeout(() => handleStartVotingPhase(sId), 10);
            } else {
              // Advance to next participant automatically!
              stopLucasTorresSpeech();
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

  // 🎙️ Effect to start Lucas Torres live exposition speech as soon as page opens and countdown begins
  useEffect(() => {
    const curSession = activeSessionsOnly[activeFinanzasSessionIndex];
    const isVoting = Boolean(curSession && (sessionVotingPhaseMap[curSession.id] || (isVotingPhaseActive && activeFinanzasSessionIndex === 0)));
    const currentPresenter = curSession ? getSessionPresenter(curSession, activeFinanzasSessionIndex) : null;
    const isLucas = currentPresenter?.name?.includes('Lucas') || currentPresenter?.id === 'trab-1';

    if (!isVoting && !showFinanzasResults && !showFinanzasRecount && isLucas) {
      isSpeechActiveRef.current = true;
      speakLucasTorresSegment();

      // In case browser requires a gesture to unlock speech synthesis on cold start:
      const handleUserGesture = () => {
        resumeOrStartLucasSpeech();
      };

      window.addEventListener('click', handleUserGesture, { once: true });
      window.addEventListener('pointerdown', handleUserGesture, { once: true });
      window.addEventListener('touchstart', handleUserGesture, { once: true });
      window.addEventListener('keydown', handleUserGesture, { once: true });

      return () => {
        window.removeEventListener('click', handleUserGesture);
        window.removeEventListener('pointerdown', handleUserGesture);
        window.removeEventListener('touchstart', handleUserGesture);
        window.removeEventListener('keydown', handleUserGesture);
      };
    } else {
      stopLucasTorresSpeech();
    }

    return () => {
      stopLucasTorresSpeech();
    };
  }, [activeFinanzasSessionIndex, isVotingPhaseActive, showFinanzasResults, showFinanzasRecount, sessionVotingPhaseMap, activeSessionsOnly]);

  // Synchronize speech synthesis volume when channelVolume or isPresenterCameraAudioMuted changes
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPresenterCameraAudioMuted || channelVolume === 0) {
        window.speechSynthesis.cancel();
        if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
        setIsLucasTorresSpeaking(false);
      } else {
        if (isSpeechActiveRef.current && !window.speechSynthesis.speaking) {
          speakLucasTorresSegment();
        }
      }
    }
  }, [channelVolume, isPresenterCameraAudioMuted]);

  // Helper for formatting numbers like TikTok (e.g. 43.2K)
  const formatCount = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  // Toggle like: queda marcado y lanza una lluvia de corazones en toda la pantalla cada vez que se hace clic
  const handleToggleLike = (sessionId: string) => {
    setLikesMap(prev => {
      const current = prev[sessionId] || { count: 43200, userLiked: false };
      return {
        ...prev,
        [sessionId]: {
          count: current.count + 1,
          userLiked: true // Queda marcado siempre
        }
      };
    });

    // Lluvia de corazones en toda la pantalla cada vez que se pulsa
    triggerHeartsShower();
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

    const isEnrolled = Boolean(
      userPaidSessions[session.id] ||
      (typeof window !== 'undefined' && localStorage.getItem(`user_paid_session_${session.id}`) === 'true')
    );

    // If NOT enrolled in this round: Adriana Lima must NEVER appear in the list!
    if (!isEnrolled) {
      return list.map((p, idx) => {
        if (p.name?.toLowerCase().includes('adriana') || p.id === 'user-adriana' || p.id === userProfile?.id || p.isSelf || p.role?.includes('(Tú)')) {
          return {
            id: `trab-alt-${idx}`,
            name: 'Marina Serrano',
            username: 'marina_serrano_mod',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
            role: 'Patronista Sostenible'
          };
        }
        return p;
      });
    }

    // ONLY IF ENROLLED: Adriana Lima replaces slot 10
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

    // Default to the first participant in the round (Turn 1 of 10, e.g. Lucas Torres in Round 1)
    return participants[0] || TRABAJADORES_USERS[0];
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
    setActiveChannelsMenuSessionId(null);
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
      if (e.key === 'Escape' && isPresenterCameraFullscreen) {
        setIsPresenterCameraFullscreen(false);
        setIsWatchingPresenterCamera(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToRound(activeFinanzasSessionIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToRound(activeFinanzasSessionIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFinanzasSessionIndex, activeSessionsOnly, isPresenterCameraFullscreen, setIsPresenterCameraFullscreen, setIsWatchingPresenterCamera]);

  // 🎛️ Helper to render the channels & broadcast controls menu window (strictly matching z.png)
  const renderChannelsOverlay = (session: any) => {
    if (activeChannelsMenuSessionId !== session.id) return null;
    return (
      <div 
        className="absolute top-0 inset-x-0 z-[170] p-2.5 sm:p-3 pointer-events-auto animate-slide-down-tiktok"
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
                if (isUserLiveStreamingWithCamera) {
                  handleToggleUserCameraLiveBroadcast();
                } else if (toggleBroadcastCam) {
                  toggleBroadcastCam();
                }
              }}
              className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer active:scale-95 shadow-md ${
                (isBroadcastCamOn || isUserLiveStreamingWithCamera)
                  ? 'bg-[#0B1E19] text-[#10b981] border-2 border-[#10b981] font-black shadow-emerald-950/40 ring-1 ring-[#10b981]/30'
                  : 'bg-[#181d2a] text-slate-300 border border-slate-700/70 hover:bg-[#22293b] font-bold'
              }`}
              title="Configurar Cámara"
            >
              <Camera className="w-4 h-4 text-[#10b981] shrink-0" />
              <span className="truncate w-full text-[9px] sm:text-[9.5px] font-black tracking-tight">
                {(isBroadcastCamOn || isUserLiveStreamingWithCamera) ? 'Cámara ON' : 'Cámara OFF'}
              </span>
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
                setActiveChannelsMenuSessionId(null);
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
    );
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* 💖 LLUVIA DE CORAZONES EN TODA LA PANTALLA */}
      {showerHearts.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none">
          {showerHearts.map((heart) => (
            <div
              key={heart.id}
              className={`absolute select-none will-change-transform ${
                heart.type === 'rain' ? 'animate-heart-rain-fall' : 'animate-heart-rain-rise'
              }`}
              style={{
                left: `${heart.left}%`,
                top: heart.type === 'rain' ? '-50px' : 'auto',
                bottom: heart.type === 'rise' ? '-50px' : 'auto',
                fontSize: `${heart.size}px`,
                lineHeight: 1,
                animationDelay: `${heart.delay}s`,
                ['--dur' as any]: `${heart.duration}s`,
                ['--drift-1' as any]: `${heart.drift1}px`,
                ['--drift-2' as any]: `${heart.drift2}px`,
                ['--drift-3' as any]: `${heart.drift3}px`,
                ['--drift-4' as any]: `${heart.drift4}px`,
                ['--rot-1' as any]: `${heart.rot1}deg`,
                ['--rot-2' as any]: `${heart.rot2}deg`,
                ['--rot-3' as any]: `${heart.rot3}deg`,
                ['--rot-4' as any]: `${heart.rot4}deg`,
                filter: 'drop-shadow(0 0 12px rgba(254, 44, 85, 0.8))',
              }}
            >
              {heart.emoji}
            </div>
          ))}
        </div>
      )}

      {/* 📱 TIKTOK VERTICAL SNAP SCROLL FEED */}
      <div
        ref={feedContainerRef}
        onScroll={handleScroll}
        onWheel={handleWheelFeed}
        onTouchStart={handleTouchStartFeed}
        onTouchEnd={handleTouchEndFeed}
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
            (typeof window !== 'undefined' && localStorage.getItem(`user_paid_session_${session.id}`) === 'true')
          );
          const isCurrentlyActiveRound = index === activeFinanzasSessionIndex;
          const likesData = likesMap[session.id] || { count: 43200, userLiked: false };
          const savesData = savesMap[session.id] || { count: 592, userSaved: false };
          const isCommentsOpenForThisSession = activeCommentsSessionId === session.id;
          const sessionComments = sessionCommentsMap[session.id] || INITIAL_COMMENTS_MAP['sess-trabajadores-1'] || [];
          const commentsCount = Math.max(1, (commentsCountMap[session.id] || 17) + (sessionComments.length - (INITIAL_COMMENTS_MAP[session.id]?.length || 4)));
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
                {/* 🎯 ZONA SUPERIOR DE ACTIVACIÓN POR HOVER (Por arriba del todo de esta página y por encima de Ronda en Curso) */}
                <div 
                  className="absolute top-0 inset-x-0 h-16 sm:h-20 z-40 pointer-events-auto cursor-pointer"
                  onMouseEnter={() => handleMouseEnterRonda(session.id)}
                  onMouseLeave={handleMouseLeaveRonda}
                  id={`top-hover-trigger-zone-${session.id}`}
                  title="Pasa el ratón para abrir el menú de opciones"
                />
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

                {/* 📊 ESCRUTINIO DESCENTRALIZADO (captura imagen.png) EN EL MISMO DISEÑO Y FORMATO DE za.png */}
                {showFinanzasRecount && isCurrentlyActiveRound && (
                  <div 
                    className="absolute inset-0 z-[130] bg-[#070b14] w-full h-full rounded-[40px] sm:rounded-[48px] overflow-hidden flex flex-col shadow-2xl animate-fade-in text-white font-sans pointer-events-auto"
                    id={`finanzas-recount-in-channel-${session.id}`}
                  >
                    {renderFinanzasRecountContent ? (
                      renderFinanzasRecountContent()
                    ) : null}
                  </div>
                )}

                {/* 🏆 RESULTADOS FINALES (captura zr.png) EN EL MISMO DISEÑO Y FORMATO DE za.png */}
                {showFinanzasResults && isCurrentlyActiveRound && (
                  <div 
                    className="absolute inset-0 z-[140] bg-[#070b14] w-full h-full rounded-[40px] sm:rounded-[48px] overflow-hidden flex flex-col shadow-2xl animate-fade-in text-white font-sans pointer-events-auto"
                    id={`finanzas-results-in-channel-${session.id}`}
                  >
                    {renderFinanzasResultsContent ? (
                      renderFinanzasResultsContent()
                    ) : null}
                  </div>
                )}

                {/* 📋 DOSSIER DEL PROYECTO DENTRO DEL CANAL EN PANTALLA COMPLETA */}
                {(detailProjectUser || showProjectDetailsInPopup) && isCurrentlyActiveRound && renderProjectDetailsContent && (
                  <div 
                    className="absolute inset-0 z-[150] bg-slate-950 w-full h-full rounded-[40px] sm:rounded-[48px] overflow-hidden flex flex-col shadow-2xl animate-fade-in text-slate-800 font-sans pointer-events-auto"
                    id={`project-details-in-channel-fullscreen-${session.id}`}
                  >
                    {renderProjectDetailsContent()}
                  </div>
                )}

                {/* 🪟 VENTANA EN GRANDE DEL PARTICIPANTE (captura image.png) */}
                {enlargedWindowUser && isCurrentlyActiveRound && renderEnlargedParticipantWindow && (
                  <div 
                    className="absolute inset-0 z-[155] bg-[#070b14] w-full h-full rounded-[40px] sm:rounded-[48px] overflow-hidden flex flex-col shadow-2xl animate-fade-in text-white font-sans pointer-events-auto"
                    id={`enlarged-window-in-channel-${session.id}`}
                  >
                    {renderEnlargedParticipantWindow()}
                  </div>
                )}

                {/* 🎛️ EMBEDDED BROADCAST CONTROL & CHANNELS OVERLAY MENU (captura z.png) */}
                {renderChannelsOverlay(session)}

                {/* 🖥️ POPUP MODAL: DISTRIBUCIÓN DE PANTALLA (COMPARTIR PANTALLA) EN TAMAÑO COMPLETO */}
                {showScreenShareMenu && renderScreenShareContent && (
                  <div 
                    className="absolute inset-0 w-full h-full z-[220] pointer-events-auto rounded-[40px] sm:rounded-[48px] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                    id="fullscreen-screen-distribution-wrapper"
                  >
                    {renderScreenShareContent()}
                  </div>
                )}

                {/* 🎥 LIVE EXPOSITION OVERLAY DENTRO DEL CANAL (captura image.png) */}
                {isPresenterCameraFullscreen && isCurrentlyActiveRound && (
                  <div 
                    className="absolute inset-0 z-[150] bg-black w-full h-full rounded-[40px] sm:rounded-[48px] overflow-hidden flex flex-col justify-between select-none animate-fade-in pointer-events-auto"
                    id={`live-exposition-in-channel-${session.id}`}
                  >
                    {/* 🎯 ZONA SUPERIOR DE ACTIVACIÓN POR HOVER (Por arriba del todo de esta página) */}
                    <div 
                      className="absolute top-0 inset-x-0 h-16 sm:h-20 z-30 pointer-events-auto cursor-pointer"
                      onMouseEnter={() => handleMouseEnterRonda(session.id)}
                      onMouseLeave={handleMouseLeaveRonda}
                      title="Pasa el ratón para abrir el menú de opciones"
                    />

                    {/* Background Live Video of Lucas Torres / Presenter */}
                    <video
                      ref={liveVideoRef}
                      src={getParticipantLiveCameraVideo(presenter)}
                      onError={(e) => { e.currentTarget.src = '/hero_video.mp4'; }}
                      autoPlay
                      loop
                      playsInline
                      muted={isPresenterCameraAudioMuted || channelVolume === 0}
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />

                    {/* Gradient Vignettes */}
                    <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
                    <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none z-10" />

                    {/* 🔝 CABECERA SUPERIOR DENTRO DEL CANAL (idéntica a captura image.png) */}
                    <div className="relative z-20 w-full pt-3 sm:pt-4 px-2.5 sm:px-3.5 flex items-center justify-between gap-1 sm:gap-1.5 pointer-events-auto">
                      {/* Left: Avatar + Nombre + Rol */}
                      <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-slate-700/80 py-1 px-2 rounded-full shadow-lg shrink min-w-0">
                        <div className="relative shrink-0">
                          <img 
                            src={presenter.avatar} 
                            alt={presenter.name} 
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-rose-500 shadow-sm"
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'; }}
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-black" />
                        </div>
                        <div className="flex flex-col text-left min-w-0 truncate">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] sm:text-[11px] font-black text-white leading-tight truncate">{presenter.name}</span>
                            <span className="bg-rose-600 text-white text-[6.5px] font-black uppercase px-1 py-0.2 rounded-full tracking-wider animate-pulse shrink-0">EN VIVO</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[7.5px] sm:text-[8px] text-emerald-400 font-bold uppercase tracking-wider truncate">
                              {presenter.role || 'DISEÑADOR GRÁFICO'}
                            </span>
                            <span className="inline-flex items-center gap-0.5 text-[7px] text-emerald-300 bg-emerald-950/80 px-1 py-0.2 rounded font-mono">
                              <span>🎙️</span>
                              <span className="flex items-end gap-0.5 h-2">
                                <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse" />
                                <span className="w-0.5 h-2.5 bg-emerald-400 animate-pulse delay-75" />
                                <span className="w-0.5 h-1 bg-emerald-400 animate-pulse delay-150" />
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Center: Turn badge pill (captura image.png) */}
                      <div className="inline-flex items-center gap-1 bg-[#421018]/90 border border-rose-500/50 text-white px-2 py-1 rounded-full text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider shadow-md backdrop-blur-md shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                        <span className="truncate">TURNO {turnNumber} DE 10 • EN EXPOSICIÓN</span>
                      </div>

                      {/* Right: Viewers & Close (audio icon removed) */}
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="flex items-center gap-0.5 bg-black/80 backdrop-blur-md border border-slate-700/80 text-slate-200 px-1.5 py-1 rounded-full text-[8.5px] sm:text-[9.5px] font-black">
                          <Users className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                          <span>1.4K</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsPresenterCameraFullscreen(false);
                            setIsWatchingPresenterCamera(false);
                          }}
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition active:scale-95 cursor-pointer shadow-md border border-rose-400 shrink-0"
                          title="Cerrar Live"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* 🔻 BOTTOM CONTROLS & SYNCHRONIZED COUNTDOWN DENTRO DEL CANAL */}
                    <div className="relative z-20 w-full pb-3.5 sm:pb-4 px-2.5 sm:px-3 flex flex-col items-center gap-2 pointer-events-auto">
{/* ⏱️ SYNCHRONIZED COUNTDOWN CARD & ACTION BUTTONS */}
                      <div className="w-full bg-[#0a0e1a]/95 backdrop-blur-xl border border-emerald-500/60 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 flex flex-col gap-2 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="text-left shrink-0">
                            <span className="text-[7px] sm:text-[7.5px] text-slate-400 font-black uppercase tracking-wider block">CUENTA ATRÁS</span>
                            <span className="text-[10px] sm:text-[11px] text-white font-black block leading-none">5 min exposición</span>
                          </div>

                          <div className="bg-white text-slate-950 font-mono text-xl sm:text-2xl font-black px-4 sm:px-5 py-0.5 rounded-xl shadow-xl border-0 select-none tracking-tight">
                            {formattedTimer}
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[7px] sm:text-[7.5px] text-slate-400 block font-black uppercase tracking-wider">RONDA</span>
                            <span className="font-mono text-emerald-400 font-black text-[9px] sm:text-[10px] block leading-tight">
                              {turnNumber}/10 (50m)
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar (emerald -> amber -> rose) */}
                        <div className="w-full bg-slate-900/90 h-1.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full transition-all duration-1000 ease-linear"
                            style={{ width: `${Math.min(100, Math.max(0, (timerVal / 300) * 100))}%` }}
                          />
                        </div>

                        {/* Action Buttons: Micro y Detener Live (FINALIZAR eliminado de esta página únicamente) */}
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button
                            type="button"
                            onClick={handleTogglePresenterLiveMic}
                            className={`py-2 px-2.5 rounded-xl font-black text-[10px] sm:text-[11px] uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border shadow-lg ${
                              isPresenterLiveMicActive
                                ? 'bg-[#00e676] hover:bg-[#00c853] text-slate-950 border-[#00e676] shadow-[0_0_14px_rgba(0,230,118,0.5)]'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                            }`}
                            id={`btn-toggle-presenter-mic-${session.id}`}
                          >
                            {isPresenterLiveMicActive ? (
                              <Mic className="w-3.5 h-3.5 shrink-0 text-slate-950" />
                            ) : (
                              <MicOff className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                            )}
                            <span className="truncate font-black">{isPresenterLiveMicActive ? 'MICRO ON' : 'MICRO OFF'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsPresenterCameraFullscreen(false);
                              setIsWatchingPresenterCamera(false);
                            }}
                            className="bg-red-600 hover:bg-red-500 text-white font-black text-[10px] sm:text-[11px] py-2 px-2.5 rounded-xl shadow-lg uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border border-red-400"
                            id={`btn-stop-presenter-cam-${session.id}`}
                          >
                            <CameraOff className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate font-black">DETENER</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  
                    {/* 💬 COMENTARIOS DE USUARIOS EN LA PARTE INFERIOR - OCUPA TODO EL ANCHO DEL CANAL */}
                    {isCommentsOpenForThisSession && (
                      <div 
                        className="absolute inset-x-0 bottom-0 z-50 w-full bg-[#0a0e1a]/98 backdrop-blur-2xl border-t-2 border-rose-500/70 rounded-b-[40px] sm:rounded-b-[48px] rounded-t-3xl p-3.5 sm:p-4.5 flex flex-col gap-2.5 shadow-[0_-20px_60px_rgba(0,0,0,0.98)] animate-slide-up text-left pointer-events-auto"
                        id={`live-exposition-comments-${session.id}`}
                      >
                        {/* Header con botón para cerrar */}
                        <div className="flex items-center justify-between pb-1.5 border-b border-white/10 shrink-0">
                          <div className="flex items-center gap-1.5 text-left">
                            <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-[10px] sm:text-[11px] font-black uppercase text-white tracking-wider">
                              Comentarios en vivo
                            </span>
                            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                              {commentsCount}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveCommentsSessionId(null)}
                            className="text-slate-400 hover:text-white p-1 rounded-full text-[9px] font-bold flex items-center gap-1 cursor-pointer transition hover:bg-slate-800"
                            title="Cerrar comentarios"
                          >
                            <span className="text-[8px] font-mono text-slate-400">Pulsa 💬 para cerrar</span>
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Scrollable Comments List */}
                        <div className="w-full max-h-[130px] sm:max-h-[150px] overflow-y-auto space-y-1.5 pr-1 text-left select-text scrollbar-thin scrollbar-thumb-white/20">
                          {sessionComments.map((comm) => (
                            <div key={comm.id} className="flex items-start gap-2 bg-slate-900/70 p-1.5 rounded-xl border border-slate-800/80">
                              <img
                                src={comm.userAvatar}
                                alt={comm.userName}
                                className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-700 mt-0.5"
                                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'; }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[10px] font-black text-rose-300 truncate">{comm.userName}</span>
                                  <span className="text-[8px] text-slate-400 shrink-0 font-mono">{comm.timeAgo}</span>
                                </div>
                                <p className="text-[10px] text-slate-200 mt-0.5 leading-snug break-words">
                                  {comm.text}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleToggleCommentLike(session.id, comm.id)}
                                className={`flex flex-col items-center gap-0.5 p-1 transition cursor-pointer shrink-0 ${
                                  comm.userLiked ? 'text-rose-500 scale-110' : 'text-slate-400 hover:text-rose-400'
                                }`}
                                title="Me gusta"
                              >
                                <Heart className={`w-3 h-3 ${comm.userLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                                <span className="text-[8px] font-mono">{comm.likes}</span>
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Quick Emojis strip - Tap to send directly! */}
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-1 shrink-0 bg-slate-950/70 rounded-full border border-slate-800/80">
                          <span className="text-[8px] text-amber-300 font-bold uppercase tracking-wider pl-1.5 pr-0.5 shrink-0 flex items-center gap-1">
                            <span>⚡</span>
                            <span>Enviar emoji:</span>
                          </span>
                          {['❤️', '🔥', '👏', '🚀', '💯', '😂', '😍', '🙌', '💡', '💰', '✨', '👍', '💎', '🎉', '🥂', '👑'].map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                handleAddSessionComment(session.id, emoji);
                                window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                                  detail: { emoji, icon: emoji, pureEmoji: true }
                                }));
                              }}
                              className="p-1 hover:bg-slate-800 rounded-lg transition active:scale-130 hover:scale-110 cursor-pointer text-xs shrink-0 select-none"
                              title={`Enviar ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>

                        {/* New comment input & send form */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleAddSessionComment(session.id);
                          }}
                          className="relative flex items-center gap-1.5 pt-1 border-t border-white/10 shrink-0 w-full"
                        >
                          {/* 📚 Glosario de Emojis que se abre al pulsar en el emoji del bloque */}
                          {renderEmojiGlossary(session.id)}

                          {/* Bloque para escribir con el emoji dentro */}
                          <div className="flex-1 flex items-center bg-slate-900/90 border border-slate-700/80 rounded-full pl-2 pr-2.5 py-1 focus-within:border-rose-500 transition shadow-inner min-w-0">
                            {/* Emoji en el bloque para escribir: al pinchar sobre él abre el glosario de emojis */}
                            <button
                              type="button"
                              onClick={() => setShowEmojiPickerSessionId(prev => prev === session.id ? null : session.id)}
                              className="p-1 text-base sm:text-lg hover:scale-125 transition active:scale-95 cursor-pointer bg-transparent border-0 shrink-0 leading-none select-none"
                              title="Abrir glosario de emojis"
                              id={`btn-open-emoji-glossary-expo-${session.id}`}
                            >
                              😊
                            </button>

                            <input
                              type="text"
                              value={commentInputMap[session.id] || ''}
                              onChange={(e) => setCommentInputMap(prev => ({ ...prev, [session.id]: e.target.value }))}
                              placeholder="Escribe un comentario o emoji..."
                              className="flex-1 bg-transparent text-[10px] sm:text-[11px] text-white placeholder-slate-400 focus:outline-none min-w-0 px-1 py-0.5"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={!(commentInputMap[session.id] || '').trim()}
                            className={`p-2 rounded-full transition cursor-pointer shrink-0 flex items-center justify-center ${
                              (commentInputMap[session.id] || '').trim()
                                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md active:scale-95'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                            title="Publicar comentario"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    )}

                  </div>
                )}
                {/* 🔴 VISTA EN VIVO CON CÁMARA GRABÁNDOTE EN DIRECTO (Strictly matching image.png) */}
                {isUserLiveStreamingWithCamera && isCurrentlyActiveRound ? (
                  <div 
                    className="absolute inset-0 z-10 w-full h-full rounded-[40px] sm:rounded-[48px] overflow-hidden flex flex-col justify-between select-none pointer-events-auto bg-black"
                    id={`live-camera-broadcast-fullscreen-${session.id}`}
                  >
                    {/* Background live camera stream */}
                    {userLiveMediaStream ? (
                      <video
                        ref={(el) => {
                          if (el && userLiveMediaStream) {
                            if (el.srcObject !== userLiveMediaStream) {
                              el.srcObject = userLiveMediaStream;
                            }
                            el.play().catch(() => {});
                          }
                        }}
                        autoPlay
                        playsInline
                        muted
                        className={`absolute inset-0 w-full h-full object-cover z-0 ${
                          liveCameraFacingMode === 'user' ? 'scale-x-[-1]' : ''
                        }`}
                      />
                    ) : (
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                      />
                    )}

                    {/* Gradient vignettes at top and bottom */}
                    <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none z-10" />
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none z-10" />

                    {/* 🔝 ZONA SUPERIOR: Barra y controles del canal */}
                    <div 
                      className="relative z-20 w-full flex flex-col items-center pt-3.5 sm:pt-4 px-3.5 sm:px-4 pb-6 select-none"
                    >
                      {/* Top Phone Speaker Notch */}
                      <div className="w-14 h-1 bg-slate-700/60 rounded-full mx-auto mb-1 shrink-0 pointer-events-none" />
                    </div>

                    {/* 👥 4 PARTICIPANTES EN VIVO (Strictly matching captura z.png) */}
                    {showCameraParticipantsGrid[session.id] && (
                      <div className="absolute inset-0 z-25 w-full h-full p-2.5 sm:p-3 pb-20 grid grid-cols-2 grid-rows-2 gap-2 sm:gap-2.5 bg-[#0a0d17] animate-fade-in pointer-events-auto">
                        {/* 1. Adriana Lima (Tú) con Cámara en Directo */}
                        <div 
                          onClick={() => setShowCameraParticipantsGrid(prev => ({ ...prev, [session.id]: false }))}
                          className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-black flex flex-col justify-between shadow-2xl cursor-pointer group"
                          title="Clic para volver a pantalla completa de tu cámara"
                        >
                          {userLiveMediaStream ? (
                            <video
                              ref={(el) => {
                                if (el && userLiveMediaStream && el.srcObject !== userLiveMediaStream) {
                                  el.srcObject = userLiveMediaStream;
                                  el.play().catch(() => {});
                                }
                              }}
                              autoPlay
                              playsInline
                              muted
                              className={`w-full h-full object-cover ${liveCameraFacingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                            />
                          ) : (
                            <img
                              src={userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650'}
                              alt="Adriana Lima"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute top-2 left-2 z-10">
                            <span className="bg-black/80 backdrop-blur-xs text-[7px] sm:text-[7.5px] font-black text-emerald-400 px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-500/40 leading-none shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                              EN VIVO
                            </span>
                          </div>
                          <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-2 sm:p-2.5 flex flex-col justify-end">
                            <p className="text-[10px] sm:text-xs font-black text-white truncate leading-tight m-0">{userProfile?.name || 'Adriana Lima'} (Tú)</p>
                            <p className="text-[8px] sm:text-[9px] text-purple-300 font-bold truncate leading-none mt-1 flex items-center gap-1 m-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block shrink-0" />
                              <span>Participante Activa (Tú)</span>
                            </p>
                          </div>
                        </div>

                        {/* 2. Alessia Vance */}
                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-slate-900 flex flex-col justify-between shadow-2xl">
                          <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=650"
                            alt="Alessia Vance"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2 z-10">
                            <span className="bg-black/80 backdrop-blur-xs text-[7px] sm:text-[7.5px] font-black text-emerald-400 px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-500/40 leading-none shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                              EN VIVO
                            </span>
                          </div>
                          <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-2 sm:p-2.5 flex flex-col justify-end">
                            <p className="text-[10px] sm:text-xs font-black text-white truncate leading-tight m-0">Alessia Vance</p>
                            <p className="text-[8px] sm:text-[9px] text-purple-300 font-bold truncate leading-none mt-1 flex items-center gap-1 m-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block shrink-0" />
                              <span>Modelo Directora</span>
                            </p>
                          </div>
                        </div>

                        {/* 3. Gisele Bündchen */}
                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-slate-900 flex flex-col justify-between shadow-2xl">
                          <img
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650"
                            alt="Gisele Bündchen"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2 z-10">
                            <span className="bg-black/80 backdrop-blur-xs text-[7px] sm:text-[7.5px] font-black text-emerald-400 px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-500/40 leading-none shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                              EN VIVO
                            </span>
                          </div>
                          <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-2 sm:p-2.5 flex flex-col justify-end">
                            <p className="text-[10px] sm:text-xs font-black text-white truncate leading-tight m-0">Gisele Bündchen</p>
                            <p className="text-[8px] sm:text-[9px] text-purple-300 font-bold truncate leading-none mt-1 flex items-center gap-1 m-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block shrink-0" />
                              <span>Inversora Principal</span>
                            </p>
                          </div>
                        </div>

                        {/* 4. Marcus Vance */}
                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-slate-900 flex flex-col justify-between shadow-2xl">
                          <img
                            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=650"
                            alt="Marcus Vance"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2 z-10">
                            <span className="bg-black/80 backdrop-blur-xs text-[7px] sm:text-[7.5px] font-black text-emerald-400 px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-500/40 leading-none shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                              EN VIVO
                            </span>
                          </div>
                          <div className="absolute bottom-0 inset-x-0 z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-2 sm:p-2.5 flex flex-col justify-end">
                            <p className="text-[10px] sm:text-xs font-black text-white truncate leading-tight m-0">Marcus Vance</p>
                            <p className="text-[8px] sm:text-[9px] text-purple-300 font-bold truncate leading-none mt-1 flex items-center gap-1 m-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block shrink-0" />
                              <span>Asesor Fintech</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 🔻 PARTE INFERIOR: CONTROLES DE MICRO, COMENTARIOS Y NAVEGACIÓN (Matching image.png) */}
                    <div className="relative z-30 w-full flex flex-col gap-2 p-3 sm:p-4 pb-4 sm:pb-5 pointer-events-auto">
                      <div className="flex items-center justify-between gap-2 bg-[#0c1424]/90 backdrop-blur-md px-3 py-2 rounded-3xl border border-slate-700/60 shadow-2xl max-w-sm sm:max-w-md mx-auto w-full">
                        {/* 🎙️ MICRO ON */}
                        <button
                          type="button"
                          onClick={toggleBroadcastMic}
                          className={`py-2 px-3.5 rounded-full font-black text-[10px] sm:text-[11px] uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-md ${
                            isBroadcastMicOn && !isMuted
                              ? 'bg-[#00e676] hover:bg-[#00c853] text-slate-950 shadow-[0_0_12px_rgba(0,230,118,0.5)]'
                              : 'bg-slate-800 text-slate-200 border border-slate-700'
                          }`}
                          id="btn-live-cam-micro"
                        >
                          <Mic className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                          <span>{isBroadcastMicOn && !isMuted ? 'MICRO ON' : 'MICRO OFF'}</span>
                        </button>

                        {/* 👥 PARTICIPANTES (Lleva a la página de la captura z.png) */}
                        <button
                          type="button"
                          onClick={() => {
                            setShowCameraParticipantsGrid(prev => ({ ...prev, [session.id]: !prev[session.id] }));
                          }}
                          className={`font-black text-[10px] sm:text-[11px] py-2 px-3.5 rounded-full shadow-md uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                            showCameraParticipantsGrid[session.id]
                              ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                              : 'bg-white hover:bg-slate-100 text-slate-950'
                          }`}
                          id="btn-live-cam-participantes"
                          title="Ver participantes de la captura z.png"
                        >
                          <Users className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                          <span>PARTICIPANTES</span>
                        </button>

                        {/* FINALIZAR (Lleva a la página de la captura zz.png) */}
                        <button
                          type="button"
                          onClick={() => {
                            // Redirigir directamente a la página de votación de proyectos (captura zz.png)
                            setSessionVotingPhaseMap(prev => {
                              const next = { ...prev, [session.id]: true };
                              try {
                                localStorage.setItem('finanzas_session_voting_phase_map', JSON.stringify(next));
                              } catch (e) {}
                              return next;
                            });
                            setSessionVotingTimerMap(prev => ({ ...prev, [session.id]: 600 }));
                            if (setVotingPhaseTimer) setVotingPhaseTimer(600);
                            setShowVotingProjectsModal(true);
                          }}
                          className="bg-white hover:bg-slate-100 text-slate-950 font-black text-[10px] sm:text-[11px] py-2 px-4 rounded-full shadow-md uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center justify-center border-0"
                          id="btn-live-cam-finalizar"
                          title="Finalizar e ir a mesa de votación zz.png"
                        >
                          <span>FINALIZAR</span>
                        </button>
                      </div>
                    </div>
                  
                    {/* 💬 COMENTARIOS EN VIVO EN LA PARTE INFERIOR - OCUPA TODO EL ANCHO DEL CANAL */}
                    {isCommentsOpenForThisSession && (
                      <div 
                        className="absolute inset-x-0 bottom-0 z-50 w-full bg-[#0a0e1a]/98 backdrop-blur-2xl border-t-2 border-rose-500/70 rounded-b-[40px] sm:rounded-b-[48px] rounded-t-3xl p-3.5 sm:p-4.5 flex flex-col gap-2.5 shadow-[0_-20px_60px_rgba(0,0,0,0.98)] animate-slide-up text-left pointer-events-auto"
                        id={`live-camera-comments-${session.id}`}
                      >
                        {/* Header con botón para cerrar */}
                        <div className="flex items-center justify-between pb-1.5 border-b border-white/10 shrink-0">
                          <div className="flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-[10px] sm:text-[11px] font-black uppercase text-white tracking-wider">
                              Comentarios en directo
                            </span>
                            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded-full">
                              {commentsCount}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setActiveCommentsSessionId(null)}
                            className="text-slate-400 hover:text-white p-1 rounded-full text-[9px] font-bold flex items-center gap-1 cursor-pointer transition hover:bg-slate-800"
                            title="Cerrar comentarios"
                          >
                            <span className="text-[8px] font-mono text-slate-400">Pulsa 💬 para cerrar</span>
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Scrollable Comments List */}
                        <div className="w-full max-h-[130px] sm:max-h-[150px] overflow-y-auto space-y-1.5 pr-1 select-text scrollbar-thin scrollbar-thumb-white/20">
                          {sessionComments.map((comm) => (
                            <div key={comm.id} className="flex items-start gap-2 bg-slate-900/70 p-1.5 rounded-xl border border-slate-800/80">
                              <img
                                src={comm.userAvatar}
                                alt={comm.userName}
                                className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-700 mt-0.5"
                                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'; }}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[10px] font-black text-rose-300 truncate">{comm.userName}</span>
                                  <span className="text-[8px] text-slate-400 shrink-0 font-mono">{comm.timeAgo}</span>
                                </div>
                                <p className="text-[10px] text-slate-200 mt-0.5 leading-snug break-words">
                                  {comm.text}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleToggleCommentLike(session.id, comm.id)}
                                className={`flex flex-col items-center gap-0.5 p-1 transition cursor-pointer shrink-0 ${
                                  comm.userLiked ? 'text-rose-500 scale-110' : 'text-slate-400 hover:text-rose-400'
                                }`}
                                title="Me gusta"
                              >
                                <Heart className={`w-3 h-3 ${comm.userLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                                <span className="text-[7.5px]">{comm.likes}</span>
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Quick emojis - Tap to send directly! */}
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-1 shrink-0 bg-slate-950/70 rounded-full border border-slate-800/80">
                          <span className="text-[8px] text-amber-300 font-bold uppercase tracking-wider pl-1.5 pr-0.5 shrink-0 flex items-center gap-1">
                            <span>⚡</span>
                            <span>Enviar emoji:</span>
                          </span>
                          {['❤️', '🔥', '👏', '🚀', '💯', '💎', '✨', '😍', '😂', '🙌', '💡', '💰', '👍', '🎉', '🥂', '👑'].map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => {
                                handleAddSessionComment(session.id, em);
                                window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                                  detail: { emoji: em, icon: em, pureEmoji: true }
                                }));
                              }}
                              className="p-1 hover:bg-slate-800 rounded-lg transition active:scale-130 hover:scale-110 cursor-pointer text-xs shrink-0 select-none"
                              title={`Enviar ${em}`}
                            >
                              {em}
                            </button>
                          ))}
                        </div>

                        {/* Comment input form with emoji trigger inside writing block */}
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleAddSessionComment(session.id);
                          }}
                          className="relative flex items-center gap-1.5 pt-1 border-t border-white/10 shrink-0 w-full"
                        >
                          {/* 📚 Glosario de Emojis que se abre al pulsar en el emoji del bloque */}
                          {renderEmojiGlossary(session.id)}

                          {/* Bloque para escribir comentarios con el emoji dentro */}
                          <div className="flex-1 flex items-center bg-slate-900/90 border border-slate-700/80 rounded-full pl-2 pr-2.5 py-1 focus-within:border-rose-500 transition shadow-inner min-w-0">
                            {/* Emoji en el bloque para escribir: al pinchar sobre él abre el glosario de emojis */}
                            <button
                              type="button"
                              onClick={() => setShowEmojiPickerSessionId(prev => prev === session.id ? null : session.id)}
                              className="p-1 text-base sm:text-lg hover:scale-125 transition active:scale-95 cursor-pointer bg-transparent border-0 shrink-0 leading-none select-none"
                              title="Abrir glosario de emojis"
                              id={`btn-open-emoji-glossary-cam-${session.id}`}
                            >
                              😊
                            </button>

                            <input
                              type="text"
                              value={commentInputMap[session.id] || ''}
                              onChange={(e) => setCommentInputMap(prev => ({ ...prev, [session.id]: e.target.value }))}
                              placeholder="Escribe un comentario o emoji..."
                              className="flex-1 bg-transparent text-[10px] sm:text-[11px] text-white placeholder-slate-400 focus:outline-none min-w-0 px-1 py-0.5"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={!(commentInputMap[session.id] || '').trim()}
                            className={`p-2 rounded-full transition cursor-pointer shrink-0 flex items-center justify-center ${
                              (commentInputMap[session.id] || '').trim()
                                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md active:scale-95'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                            title="Publicar comentario"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    )}

                  </div>
                ) : (
                  <>
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
                  className="w-full flex flex-col items-center justify-center text-center pt-2 sm:pt-3 relative z-30 pointer-events-auto"
                  onMouseEnter={() => handleMouseEnterRonda(session.id)}
                  onMouseLeave={handleMouseLeaveRonda}
                >
                  {/* Red badge with pulsing dot - hover to open channels menu */}
                  <button
                    type="button"
                    onMouseEnter={() => handleMouseEnterRonda(session.id)}
                    onMouseLeave={handleMouseLeaveRonda}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChannelsMenu(session.id);
                    }}
                    className="inline-flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/50 hover:border-rose-400 text-rose-300 px-3 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider mb-1.5 shadow-xs cursor-pointer transition-all hover:scale-105 active:scale-95 group/ronda-pill"
                    title="Pasa el ratón o pulsa para abrir el menú de opciones"
                    id={`ronda-en-curso-pill-${session.id}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                    <span>{isUserEnrolledInThisRound ? 'Ronda en la que estás participando' : 'Ronda en Curso'}</span>
                    <span className="text-[7.5px] text-rose-400 opacity-70 group-hover/ronda-pill:opacity-100 transition-transform group-hover/ronda-pill:translate-y-0.5">▼</span>
                  </button>

                  {/* Main Round Title */}
                  <h3 className="text-xs sm:text-sm md:text-base font-black text-white uppercase tracking-wider font-sans drop-shadow-md leading-tight m-0 flex items-center justify-center gap-1.5 flex-wrap">
                    <span>{roundTitle}</span>
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
                        {/* Audio exposition live indicator */}
                        <div className="flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[8px] sm:text-[8.5px] font-bold shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                          <span>Voz en directo conectada</span>
                          <span className="flex items-end gap-0.5 h-2.5 ml-0.5">
                            <span className="w-0.5 h-2 bg-emerald-400 animate-pulse" />
                            <span className="w-0.5 h-3 bg-emerald-400 animate-pulse delay-75" />
                            <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse delay-150" />
                          </span>
                        </div>
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
                                  if (isPresenterCameraFullscreen) {
                                    setIsPresenterCameraFullscreen(false);
                                    setIsWatchingPresenterCamera(false);
                                  } else {
                                    setIsWatchingPresenterCamera(true);
                                    setIsPresenterCameraFullscreen(true);
                                    resumeOrStartLucasSpeech();
                                  }
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

                {/* 👥 10 PARTICIPANTES PANEL DIRECTAMENTE VISIBLE (Strictly matching zz.png) */}
                <div 
                  className="w-full bg-[#0B0F19]/95 backdrop-blur-md border border-slate-800/90 rounded-3xl p-3 sm:p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col gap-2.5 box-border mt-auto shrink-0"
                  id={`finanzas-live-participants-panel-${session.id}`}
                >
                  {/* Header: Red pulsing dot + Round Title (left) & 10 ONLINE (right) */}
                  <div className="flex items-center justify-between px-1 w-full gap-2">
                    <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500/50 shrink-0" />
                      <span className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-white truncate font-sans">
                        {roundTitle}
                      </span>
                    </div>
                    <span className="bg-[#fe2c55] text-white text-[8.5px] sm:text-[9.5px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm animate-pulse shrink-0">
                      10 ONLINE
                    </span>
                  </div>

                  {/* 2x5 Grid of 10 participants */}
                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2 select-none w-full max-w-full mx-auto box-border" id={`finanzas-grid-2x5-${session.id}`}>
                    {participants.slice(0, 10).map((userObj, idx) => {
                      const isChosenInSpotlight = (
                        userObj.id === presenter.id ||
                        userObj.name === presenter.name ||
                        idx === (turnNumber - 1)
                      );

                      const rawName = userObj.name.split(' ')[0];
                      const displayName = rawName.length > 5 ? rawName.slice(0, 4) + '...' : rawName;

                      return (
                        <button
                          key={userObj.id || idx}
                          type="button"
                          onClick={() => {
                            const turnIdx = idx;
                            setSessionSelectedPresenterMap(prev => ({ ...prev, [session.id]: userObj }));
                            setSessionExpositionTimerMap(prev => ({ ...prev, [session.id]: 300 }));
                            if (setSelectedFinanzasUser) setSelectedFinanzasUser(userObj);

                            // Audio chime for turn switch
                            try {
                              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                              if (audioCtx.state === 'suspended') audioCtx.resume();
                              const osc = audioCtx.createOscillator();
                              const gain = audioCtx.createGain();
                              osc.connect(gain);
                              gain.connect(audioCtx.destination);
                              osc.frequency.setValueAtTime(659.25, audioCtx.currentTime);
                              gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                              gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
                              osc.start();
                              osc.stop(audioCtx.currentTime + 0.35);
                            } catch (e) {}

                            if (setSystemVoiceNotification) {
                              setSystemVoiceNotification({
                                show: true,
                                message: `⏱️ Turno ${turnIdx + 1} de 10: ${userObj.name} (5 min de exposición)`
                              });
                            }
                          }}
                          className={`aspect-square min-h-[50px] xs:min-h-[56px] sm:min-h-[62px] rounded-2xl overflow-hidden relative border transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md flex flex-col justify-start p-1 box-border cursor-pointer ${
                            isChosenInSpotlight
                              ? 'border-2 border-[#fe2c55] ring-2 ring-[#fe2c55]/90 shadow-[0_0_14px_rgba(254,44,85,0.9)] scale-[1.02]'
                              : 'border border-slate-700/80 hover:border-white/80 bg-slate-900'
                          }`}
                          title={`Turno ${idx + 1} de 10: ${userObj.name}`}
                        >
                          <img
                            src={userObj.avatar}
                            alt={userObj.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-black/50 shadow-sm animate-pulse z-10 bg-[#fe2c55]" />

                          <div className="relative z-10 self-center backdrop-blur-xs text-center py-0.5 px-1.5 min-w-0 max-w-[92%] overflow-hidden rounded-md box-border shadow-md bg-black/85 mt-auto">
                            <span className="text-[8px] xs:text-[9px] sm:text-[9.5px] font-black block truncate leading-tight text-white">
                              {displayName}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* ⚠️ AVISO: YA ESTÁS PARTICIPANDO EN OTRA RONDA (Dentro de la pantalla del canal, justo encima del botón que se pulsa, fondo sin opacidad y transparente) */}
                  {alreadyParticipatingNotice?.show && (alreadyParticipatingNotice.targetSessionId === session.id || !alreadyParticipatingNotice.targetSessionId) && (
                    <div 
                      className="w-full relative z-40 mb-2 p-3.5 sm:p-4 rounded-3xl border-2 border-amber-400 text-white animate-slide-up flex flex-col items-center text-center space-y-2 select-none shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
                      style={{
                        backgroundColor: 'transparent',
                        background: 'transparent'
                      }}
                      id={`aviso-ya-participando-${session.id}`}
                    >
                      {/* Close button X */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAlreadyParticipatingNotice(null);
                        }}
                        className="absolute top-2.5 right-2.5 text-amber-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
                        title="Cerrar aviso"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Icono de advertencia */}
                      <div className="w-10 h-10 rounded-full border-2 border-amber-400 flex items-center justify-center text-xl shadow-md" style={{ backgroundColor: 'transparent' }}>
                        ⚠️
                      </div>

                      {/* Badge */}
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-amber-400 text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider text-amber-300 font-mono" style={{ backgroundColor: 'transparent' }}>
                        <span>●</span>
                        <span>PARTICIPACIÓN SIMULTÁNEA NO PERMITIDA</span>
                      </div>

                      {/* Título */}
                      <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight m-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        Ya estás participando en otra Ronda
                      </h3>

                      {/* Descripción detallada */}
                      <div className="border border-amber-400/50 p-2.5 rounded-2xl text-[11px] sm:text-[11.5px] text-white leading-snug text-left space-y-1.5 w-full" style={{ backgroundColor: 'transparent' }}>
                        <p className="m-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                          Tu usuario <strong className="text-amber-300 font-black">{userProfile?.name || 'Adriana Lima'}</strong> ya está inscrito activamente en la ronda:
                        </p>
                        <div className="border border-amber-400 rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-amber-300 font-black text-xs drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]" style={{ backgroundColor: 'transparent' }}>
                          <span>📍</span>
                          <span className="truncate">{alreadyParticipatingNotice.currentRoundTitle}</span>
                        </div>
                        <p className="text-[10px] text-amber-200/90 m-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                          Las normas de la mesa financiera estipulan que debes finalizar tu participación en la ronda en curso antes de poder inscribirte en una nueva.
                        </p>
                      </div>

                      {/* Botones de acción */}
                      <div className="w-full flex flex-col gap-1.5 pt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            scrollToRound(alreadyParticipatingNotice.enrolledIndex);
                            setAlreadyParticipatingNotice(null);
                          }}
                          className="w-full py-2.5 px-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5 border border-amber-200"
                        >
                          <span>🔄</span>
                          <span>Ir a mi Ronda Activa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAlreadyParticipatingNotice(null)}
                          className="w-full py-2 px-3 rounded-2xl text-white hover:text-amber-200 font-bold text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer border border-white/50 hover:border-amber-400"
                          style={{ backgroundColor: 'transparent' }}
                        >
                          <span>Entendido</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Inscription Button: ✍️ Inscribirse en una sesión de (10 Euros) */}
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
                      } else {
                        // 🛑 Comprobar si el usuario ya está participando en otra ronda
                        const otherEnrolledRound = activeSessionsOnly.find(s => {
                          if (s.id === session.id) return false;
                          return Boolean(
                            userPaidSessions[s.id] ||
                            (typeof window !== 'undefined' && localStorage.getItem(`user_paid_session_${s.id}`) === 'true')
                          );
                        });

                        if (otherEnrolledRound) {
                          const otherIdx = activeSessionsOnly.findIndex(s => s.id === otherEnrolledRound.id);
                          setAlreadyParticipatingNotice({
                            show: true,
                            currentRoundTitle: otherEnrolledRound.title || 'Round STREETWEAR & URBAN',
                            attemptedRoundTitle: roundTitle,
                            enrolledIndex: otherIdx !== -1 ? otherIdx : 0,
                            targetSessionId: session.id
                          });

                          if (setSystemVoiceNotification) {
                            setSystemVoiceNotification({
                              show: true,
                              message: `⚠️ Ya estás participando en ${otherEnrolledRound.title || 'otra Ronda'}. No puedes inscribirte en múltiples rondas simultáneamente.`
                            });
                          }
                          return;
                        }

                        if (onExecutePaymentAndJoinSession) {
                          onExecutePaymentAndJoinSession(session);
                        } else {
                          setShowFinanzasInscriptionInChannel(true);
                        }
                      }
                    }}
                    className="w-full bg-gradient-to-r from-[#FFD1DC] via-[#FCC2D0] to-[#F8B4C4] hover:from-[#FCC2D0] hover:to-[#F5A3B7] text-[#3D1422] font-black text-xs sm:text-[13px] py-2.5 sm:py-3 px-5 rounded-full border border-[#F4A8B9] shadow-md flex items-center justify-center gap-2 cursor-pointer font-sans transition active:scale-95"
                    id={`btn-inscribirse-ronda-${session.id}`}
                  >
                    <span className="text-base shrink-0">✍️</span>
                    <span className="truncate min-w-0 font-black">
                      {isUserEnrolledInThisRound
                        ? `Estás inscrita como participante (${feeInfo.feeInWords})`
                        : `Inscribirse en una sesión de (${feeInfo.feeInWords})`}
                    </span>
                  </button>

                  {/* Button: 📋 VER PROYECTOS (White background matching zz.png) */}
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
                    className="w-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-[13px] py-2.5 sm:py-3 px-6 rounded-full border border-slate-200 shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider font-sans transition active:scale-95"
                    id={`btn-ver-proyectos-ronda-${session.id}`}
                  >
                    <span className="text-base shrink-0">📋</span>
                    <span className="font-black">VER PROYECTOS</span>
                  </button>
                </div>
                  </>
                )}
              
                {/* 💬 COMENTARIOS DE USUARIOS Y POSIBILIDAD DE COMENTAR - OCUPA TODO EL ANCHO DEL CANAL */}
                {isCommentsOpenForThisSession && (
                  <div 
                    className="absolute inset-x-0 bottom-0 z-50 w-full bg-[#0a0e1a]/98 backdrop-blur-2xl border-t-2 border-rose-500/70 rounded-b-[40px] sm:rounded-b-[48px] rounded-t-3xl p-3.5 sm:p-4.5 flex flex-col gap-2.5 shadow-[0_-20px_60px_rgba(0,0,0,0.98)] animate-slide-up pointer-events-auto text-left"
                    id={`normal-card-comments-${session.id}`}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10 shrink-0">
                      <div className="flex items-center gap-1.5 text-left">
                        <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-[10px] sm:text-[11px] font-black uppercase text-white tracking-wider">
                          Comentarios ({commentsCount})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveCommentsSessionId(null)}
                        className="text-slate-400 hover:text-white p-1 rounded-full text-[9px] font-bold flex items-center gap-1 cursor-pointer transition hover:bg-slate-800"
                        title="Cerrar comentarios"
                      >
                        <span className="text-[8px] font-mono text-slate-400">Pulsa 💬 para cerrar</span>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="w-full max-h-[130px] sm:max-h-[150px] overflow-y-auto space-y-1.5 pr-1 text-left select-text scrollbar-thin scrollbar-thumb-white/20">
                      {sessionComments.map((comm) => (
                        <div key={comm.id} className="flex items-start gap-2 bg-slate-900/70 p-1.5 rounded-xl border border-slate-800/80">
                          <img
                            src={comm.userAvatar}
                            alt={comm.userName}
                            className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-700 mt-0.5"
                            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'; }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-black text-rose-300 truncate">{comm.userName}</span>
                              <span className="text-[8px] text-slate-400 shrink-0 font-mono">{comm.timeAgo}</span>
                            </div>
                            <p className="text-[10px] text-slate-200 mt-0.5 leading-snug break-words">
                              {comm.text}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleCommentLike(session.id, comm.id)}
                            className={`flex flex-col items-center gap-0.5 p-1 transition cursor-pointer shrink-0 ${
                              comm.userLiked ? 'text-rose-500 scale-110' : 'text-slate-400 hover:text-rose-400'
                            }`}
                            title="Me gusta"
                          >
                            <Heart className={`w-3 h-3 ${comm.userLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span className="text-[8px] font-mono">{comm.likes}</span>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Quick Emojis strip - Tap to send directly! */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-1 shrink-0 bg-slate-950/70 rounded-full border border-slate-800/80">
                      <span className="text-[8px] text-amber-300 font-bold uppercase tracking-wider pl-1.5 pr-0.5 shrink-0 flex items-center gap-1">
                        <span>⚡</span>
                        <span>Enviar emoji:</span>
                      </span>
                      {['❤️', '🔥', '👏', '🚀', '💯', '😂', '😍', '🙌', '💡', '💰', '✨', '👍', '💎', '🎉', '🥂', '👑'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            handleAddSessionComment(session.id, emoji);
                            window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                              detail: { emoji, icon: emoji, pureEmoji: true }
                            }));
                          }}
                          className="p-1 hover:bg-slate-800 rounded-lg transition active:scale-130 hover:scale-110 cursor-pointer text-xs shrink-0 select-none"
                          title={`Enviar ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>

                    {/* Bloque para escribir con emoji dentro que abre glosario */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddSessionComment(session.id);
                      }}
                      className="relative flex items-center gap-1.5 pt-1 border-t border-white/10 shrink-0 w-full"
                    >
                      {/* 📚 Glosario de Emojis que se abre al pulsar en el emoji del bloque */}
                      {renderEmojiGlossary(session.id)}

                      {/* Bloque para escribir comentarios con el emoji dentro */}
                      <div className="flex-1 flex items-center bg-slate-900/90 border border-slate-700/80 rounded-full pl-2 pr-2.5 py-1 focus-within:border-rose-500 transition shadow-inner min-w-0">
                        {/* Emoji en el bloque para escribir: al pinchar sobre él abre el glosario de emojis */}
                        <button
                          type="button"
                          onClick={() => setShowEmojiPickerSessionId(prev => prev === session.id ? null : session.id)}
                          className="p-1 text-base sm:text-lg hover:scale-125 transition active:scale-95 cursor-pointer bg-transparent border-0 shrink-0 leading-none select-none"
                          title="Abrir glosario de emojis"
                          id={`btn-open-emoji-glossary-normal-${session.id}`}
                        >
                          😊
                        </button>

                        <input
                          type="text"
                          value={commentInputMap[session.id] || ''}
                          onChange={(e) => setCommentInputMap(prev => ({ ...prev, [session.id]: e.target.value }))}
                          placeholder="Escribe un comentario o emoji..."
                          className="flex-1 bg-transparent text-[10px] sm:text-[11px] text-white placeholder-slate-400 focus:outline-none min-w-0 px-1 py-0.5"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!(commentInputMap[session.id] || '').trim()}
                        className={`p-2 rounded-full transition cursor-pointer shrink-0 flex items-center justify-center ${
                          (commentInputMap[session.id] || '').trim()
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md active:scale-95'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                        title="Publicar comentario"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}

              
                {/* 🔊 ZONA CENTRAL IZQUIERDA SENSIBLE AL RATÓN Y BARRA DE VOLUMEN (APARECE SOLO AL PASAR EL PUNTERO POR EL CENTRO-IZQUIERDA) */}
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-[340px] sm:h-[380px] w-24 sm:w-28 z-[170] flex items-center pl-2.5 sm:pl-3 group/volumezone pointer-events-auto select-none"
                  id={`volume-hover-zone-${session.id}`}
                  onMouseEnter={() => setIsVolumeHovered(true)}
                  onMouseLeave={() => {
                    if (!isDraggingVolume) setIsVolumeHovered(false);
                  }}
                  onWheel={handleVolumeWheel}
                >
                  {/* Cápsula de volumen vertical (idéntica a captura image.png) */}
                  <div 
                    className={`flex flex-col items-center bg-[#070b14]/95 backdrop-blur-2xl border border-white/20 rounded-full py-3 px-1.5 sm:px-2 shadow-[0_15px_45px_rgba(0,0,0,0.95)] transition-all duration-300 transform ${
                      isDraggingVolume || isVolumeHovered
                        ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto ring-1 ring-[#00f2fe]/40'
                        : 'opacity-0 -translate-x-4 scale-95 pointer-events-none group-hover/volumezone:opacity-100 group-hover/volumezone:translate-x-0 group-hover/volumezone:scale-100 group-hover/volumezone:pointer-events-auto'
                    } hover:border-[#00f2fe]/50 hover:bg-[#070b14]/98`}
                    id={`channel-volume-bar-${session.id}`}
                    onPointerDown={handleVolumePointerDown}
                    onPointerMove={handleVolumePointerMove}
                    onPointerUp={handleVolumePointerUp}
                  >
                    {/* Botón Mute / Unmute con altavoz de color cian / esmeralda (estilo captura) */}
                    <button
                      type="button"
                      onClick={handleToggleMute}
                      className="p-1 text-white hover:scale-110 transition cursor-pointer active:scale-90"
                      title={isPresenterCameraAudioMuted || channelVolume === 0 ? "Activar audio" : "Silenciar audio"}
                    >
                      {isPresenterCameraAudioMuted || channelVolume === 0 ? (
                        <VolumeX className="w-4 h-4 text-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#00f2fe] drop-shadow-[0_0_6px_rgba(0,242,254,0.6)]" />
                      )}
                    </button>

                    {/* Barra deslizante vertical de volumen (Track) */}
                    <div 
                      data-volume-track="true"
                      className="relative w-2 sm:w-2.5 h-28 sm:h-32 bg-slate-900/95 border border-slate-700/80 rounded-full cursor-pointer overflow-hidden my-1 flex flex-col justify-end shadow-inner touch-none select-none"
                      title={`Volumen: ${isPresenterCameraAudioMuted ? 0 : channelVolume}%`}
                    >
                      {/* Relleno cian/verde neón brillante desde la base hacia arriba */}
                      <div 
                        className={`w-full rounded-full transition-all duration-75 ${
                          isPresenterCameraAudioMuted || channelVolume === 0 
                            ? 'bg-rose-500/40' 
                            : 'bg-gradient-to-t from-emerald-500 via-teal-400 to-[#00f2fe] shadow-[0_0_12px_rgba(0,242,254,0.8)]'
                        }`}
                        style={{ height: `${isPresenterCameraAudioMuted ? 0 : channelVolume}%` }}
                      />
                    </div>

                    {/* Porcentaje en texto: 100%, 80%, 0% */}
                    <span className="text-[7.5px] sm:text-[8px] font-mono font-black text-white tracking-tighter select-none mt-0.5">
                      {isPresenterCameraAudioMuted ? '0%' : `${channelVolume}%`}
                    </span>
                  </div>
                </div>

              </div>

              {/* 📱 TIKTOK ACTION COLUMN ON THE RIGHT */}
              <div 
                className="flex flex-col items-center gap-2.5 sm:gap-3 select-none shrink-0 self-center my-auto"
                id={`tiktok-actions-sidebar-${session.id}`}
              >
                {/* Like button with count (e.g. 43.2K) - Queda marcado y lanza lluvia de corazones */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleToggleLike(session.id)}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-90 cursor-pointer ${
                      likesData.userLiked
                        ? 'bg-[#fe2c55]/20 ring-2 ring-[#fe2c55] shadow-[0_0_16px_rgba(254,44,85,0.6)] text-[#fe2c55] scale-105'
                        : 'bg-slate-800/80 hover:bg-slate-700/90 text-white'
                    }`}
                    title={likesData.userLiked ? "¡Marcado! Pulsa para enviar más corazones" : "Me gusta"}
                    id={`btn-like-heart-${session.id}`}
                  >
                    <Heart 
                      className={`w-5 h-5 transition-transform duration-200 ${
                        likesData.userLiked 
                          ? 'fill-[#fe2c55] text-[#fe2c55] scale-110 drop-shadow-[0_0_8px_rgba(254,44,85,0.9)]' 
                          : 'text-white'
                      }`} 
                    />
                  </button>
                  <span className={`text-[10px] sm:text-[11px] font-bold mt-0.5 transition-colors ${
                    likesData.userLiked ? 'text-[#fe2c55] font-black' : 'text-slate-700 dark:text-slate-200'
                  }`}>
                    {formatCount(likesData.count)}
                  </span>
                </div>

                {/* Comment icon with count (e.g. 17) */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCommentsSessionId(prev => (prev === session.id ? null : session.id));
                    }}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg transition active:scale-90 cursor-pointer ${
                      isCommentsOpenForThisSession
                        ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-rose-600/50 scale-105'
                        : 'bg-slate-800/80 hover:bg-slate-700/90 text-white'
                    }`}
                    title={isCommentsOpenForThisSession ? "Ocultar comentarios y volver a la cuenta atrás" : "Ver comentarios"}
                  >
                    <MessageCircle className="w-5 h-5 text-white" />
                  </button>
                  <span className={`text-[10px] sm:text-[11px] font-bold mt-0.5 ${isCommentsOpenForThisSession ? 'text-rose-400 font-black' : 'text-slate-700 dark:text-slate-200'}`}>
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
