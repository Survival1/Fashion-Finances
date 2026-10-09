import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  MicOff,
  Database,
  ChevronUp,
  ChevronDown,
  Play,
  Pause,
  Film,
  Music,
  Check,
  CheckCircle2,
  Video,
  Globe
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

export const FITNES_USERS = [
  { id: 'fit-1', name: 'Carlos Fit', username: 'carlos_fit_coach', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Entrenador Personal Pro' },
  { id: 'fit-2', name: 'Sofia Wellness', username: 'sofia_yoga_pilates', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Instructora Yoga & Pilates' },
  { id: 'fit-3', name: 'David Cross', username: 'david_cross_fit', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=650', role: 'Coach Alta Intensidad' },
  { id: 'fit-4', name: 'Laura Runner', username: 'laura_nutricion_run', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650', role: 'Nutricionista Deportiva' },
  { id: 'fit-5', name: 'Elena Core', username: 'elena_biomecanica', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650', role: 'Especialista Biomecánica' },
  { id: 'fit-6', name: 'Marcos Gym', username: 'marcos_preparador', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650', role: 'Preparador Físico' },
  { id: 'fit-7', name: 'Valeria Power', username: 'valeria_crossfit', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650', role: 'Atleta Crossfit' },
  { id: 'fit-8', name: 'Alex Kettle', username: 'alex_funcional', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=650', role: 'Entrenador Funcional' },
  { id: 'fit-9', name: 'Carmen Zen', username: 'carmen_mindfulness', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=650', role: 'Instructora Mindfulness' },
  { id: 'fit-10', name: 'Roberto Force', username: 'roberto_fuerza', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=650', role: 'Coach Fuerza' }
];

export const BEAUTY_USERS = [
  { id: 'bty-1', name: 'Chloe Glam', username: 'chloe_makeup_artist', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Maquilladora Internacional' },
  { id: 'bty-2', name: 'Mateo Glow', username: 'mateo_color_image', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=650', role: 'Estilista de Imagen & Color' },
  { id: 'bty-3', name: 'Valentina Skin', username: 'valentina_dermatologia', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Especialista Skincare' },
  { id: 'bty-4', name: 'Sergio Barber', username: 'sergio_estilista_capilar', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650', role: 'Estilista Capilar VIP' },
  { id: 'bty-5', name: 'Natalia Brow', username: 'natalia_microblading', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650', role: 'Especialista Microblading' },
  { id: 'bty-6', name: 'Lucas Perfum', username: 'lucas_alta_perfumeria', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=650', role: 'Diseñador Perfumes Alta Gama' },
  { id: 'bty-7', name: 'Camilla Blush', username: 'camilla_runway_makeup', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650', role: 'Make-up Artist Pasarela' },
  { id: 'bty-8', name: 'Hugo Lashes', username: 'hugo_pestañas_cejas', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=650', role: 'Técnico Pestañas & Cejas' },
  { id: 'bty-9', name: 'Paula Spa', username: 'paula_facial_wellness', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650', role: 'Terapeuta Facial' },
  { id: 'bty-10', name: 'Andrés Cosmet', username: 'andres_cosmetica_pro', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=650', role: 'Formador Cosmética Premium' }
];

export const INFLUENCER_USERS = [
  { id: 'inf-1', name: 'Leo Viral', username: 'leo_viral_creator', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=650', role: 'Creador Contenido & Tendencias' },
  { id: 'inf-2', name: 'Mia Trend', username: 'mia_trend_lifestyle', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Tiktoker Lifestyle & Moda' },
  { id: 'inf-3', name: 'Santi Stream', username: 'santi_live_streamer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650', role: 'Streamer Top Tendencias' },
  { id: 'inf-4', name: 'Zoe Vlogs', username: 'zoe_vlogs_reels', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650', role: 'Creadora YouTube & Reels' },
  { id: 'inf-5', name: 'Daniel Buzz', username: 'daniel_buzz_growth', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=650', role: 'Estratega Crecimiento Digital' },
  { id: 'inf-6', name: 'Claudia Reels', username: 'claudia_digital_reels', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650', role: 'Diseñadora Digital & Reels' },
  { id: 'inf-7', name: 'Nico Stories', username: 'nico_stories_visual', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=650', role: 'Fotógrafo Móvil Creativo' },
  { id: 'inf-8', name: 'Emma Challenge', username: 'emma_viral_challenges', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650', role: 'Creadora Retos Virales' },
  { id: 'inf-9', name: 'Pablo Community', username: 'pablo_community_lead', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=650', role: 'Gestor Comunidades Digitales' },
  { id: 'inf-10', name: 'Sara Pop', username: 'sara_pop_podcast', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Podcaster & Entrevistadora' }
];

export const FASHION_USERS = [
  { id: 'fsh-1', name: 'Kendall Jenner', username: 'kendall_jenner_vip', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Top Model Internacional' },
  { id: 'fsh-2', name: 'Gigi Hadid', username: 'gigi_hadid_official', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650', role: 'Embajadora Global' },
  { id: 'fsh-3', name: 'Bella Hadid', username: 'bella_hadid_runway', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Icono Pasarela' },
  { id: 'fsh-4', name: 'Alexander Wright', username: 'alex_wright_ceo', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=650', role: 'CEO Haute Couture' },
  { id: 'fsh-5', name: 'Victoria Sterling', username: 'victoria_sterling', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Dir. Expansión Global' },
  { id: 'fsh-6', name: 'Bruno Rossi', username: 'bruno_rossi_milan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650', role: 'Presidente Textil Milano' },
  { id: 'fsh-7', name: 'Isabella Fontana', username: 'isabella_creative', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Directora Creativa' },
  { id: 'fsh-8', name: 'Clara Vega', username: 'clara_patronaje', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650', role: 'Patronista Textil' },
  { id: 'fsh-9', name: 'Cara Delevingne', username: 'cara_delevingne_live', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650', role: 'Actriz & Top Model' },
  { id: 'fsh-10', name: 'Irina Shayk', username: 'irina_shayk_couture', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=650', role: 'Alta Costura Model' }
];

export const MODELOS_USERS = [
  { id: 'mod-1', name: 'Bella Hadid', username: 'bella_hadid_runway', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Icono Pasarela' },
  { id: 'mod-2', name: 'Kendall Jenner', username: 'kendall_jenner_vip', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Top Model Internacional' },
  { id: 'mod-3', name: 'Gigi Hadid', username: 'gigi_hadid_official', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650', role: 'Embajadora Global' },
  { id: 'mod-4', name: 'Irina Shayk', username: 'irina_shayk_couture', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=650', role: 'Alta Costura Model' },
  { id: 'mod-5', name: 'Cara Delevingne', username: 'cara_delevingne_live', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650', role: 'Actriz & Top Model' },
  { id: 'mod-6', name: 'Naomi Campbell', username: 'naomi_campbell_mentor', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650', role: 'Supermodelo & Mentora' },
  { id: 'mod-7', name: 'Candice Swanepoel', username: 'candice_swim', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=650', role: 'Directora de Marca' },
  { id: 'mod-8', name: 'Karlie Kloss', username: 'karlie_kloss_tech', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=650', role: 'Empresaria & Modelo' },
  { id: 'mod-9', name: 'Joan Smalls', username: 'joan_smalls_runway', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=650', role: 'Líder de Pasarelas' },
  { id: 'mod-10', name: 'Alessandra Ambrosio', username: 'alessandra_ambrosio', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Top Model Ejecutiva' }
];

export const CATWALK_USERS = [
  { id: 'cat-1', name: 'Naomi Campbell', username: 'naomi_campbell_mentor', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650', role: 'Supermodelo & Mentora' },
  { id: 'cat-2', name: 'Cara Delevingne', username: 'cara_delevingne_live', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650', role: 'Actriz & Top Model' },
  { id: 'cat-3', name: 'Irina Shayk', username: 'irina_shayk_couture', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=650', role: 'Alta Costura Model' },
  { id: 'cat-4', name: 'Candice Swanepoel', username: 'candice_swim', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=650', role: 'Directora de Marca' },
  { id: 'cat-5', name: 'Karlie Kloss', username: 'karlie_kloss_tech', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=650', role: 'Empresaria & Modelo' },
  { id: 'cat-6', name: 'Joan Smalls', username: 'joan_smalls_runway', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=650', role: 'Líder de Pasarelas' },
  { id: 'cat-7', name: 'Alessandra Ambrosio', username: 'alessandra_ambrosio', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Top Model Ejecutiva' },
  { id: 'cat-8', name: 'Kendall Jenner', username: 'kendall_jenner_vip', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Top Model Internacional' },
  { id: 'cat-9', name: 'Gigi Hadid', username: 'gigi_hadid_official', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650', role: 'Embajadora Global' },
  { id: 'cat-10', name: 'Bella Hadid', username: 'bella_hadid_runway', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Icono Pasarela' }
];

export const TODOS_USERS = [
  { id: 'tod-1', name: 'Lucas Torres', username: 'lucas_torres_design', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=650', role: 'Diseñador Gráfico' },
  { id: 'tod-2', name: 'Kendall Jenner', username: 'kendall_jenner_vip', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Top Model Internacional' },
  { id: 'tod-3', name: 'Warren Buffett', username: 'warren_berkshire', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=650', role: 'Pres. Fondo Berkshire' },
  { id: 'tod-4', name: 'Alessia Vance', username: 'alessia_vance_w1', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=650', role: 'Modelo Directora' },
  { id: 'tod-5', name: 'Carlos Fit', username: 'carlos_fit_coach', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Entrenador Personal Pro' },
  { id: 'tod-6', name: 'Chloe Glam', username: 'chloe_makeup_artist', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Maquilladora Internacional' },
  { id: 'tod-7', name: 'Leo Viral', username: 'leo_viral_creator', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=650', role: 'Creador Contenido & Tendencias' },
  { id: 'tod-8', name: 'Naomi Campbell', username: 'naomi_campbell_mentor', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650', role: 'Supermodelo & Mentora' },
  { id: 'tod-9', name: 'Alexander Wright', username: 'alex_wright_ceo', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=650', role: 'CEO Haute Couture' },
  { id: 'tod-10', name: 'Gisele Bündchen', username: 'gisele_invest', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Inversora Principal' }
];

// Componente memoizado para renderizar de forma segura el stream de cámara en vivo sin bucles de re-render
const LiveUserStreamVideo = React.memo(({ 
  stream, 
  facingMode = 'user', 
  className = '' 
}: { 
  stream: MediaStream | null; 
  facingMode?: string; 
  className?: string; 
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (el && stream) {
      if (el.srcObject !== stream) {
        el.srcObject = stream;
        el.play().catch(() => {});
      }
    }
  }, [stream]);

  if (!stream) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''} ${className}`}
    />
  );
});

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
  setVotingProjectSlideIndex?: (idx: number) => void;
  setShowParticipantsGatheringModal?: (show: boolean) => void;
  onExecutePaymentAndJoinSession?: (session: any) => void;
  setDetailProjectUser: (user: any) => void;
  setActiveFinanzasPopupUser: (user: any) => void;
  setShowProjectDetailsInPopup: (show: boolean) => void;
  detailProjectUser?: any;
  showProjectDetailsInPopup?: boolean;
  renderProjectDetailsContent?: () => React.ReactNode;
  completedSessionToDisplay?: any;
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
  onOpenRoundDatabaseModal?: (roundId?: string) => void;
  onNavigateTo10WindowsLive?: () => void;
  screenSplitLayout?: 'single' | '50-50' | 'pip' | 'grid-3' | 'grid-4' | 'presentation' | 'grid' | 'grid-10';
  invitedUsersMap?: Record<string, boolean>;
  onNavigateToTab?: (tab: string) => void;
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
  onOpenRoundDatabaseModal,
  onNavigateTo10WindowsLive,
  onNavigateToTab,
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
  setVotingProjectSlideIndex,
  setShowParticipantsGatheringModal,
  onExecutePaymentAndJoinSession,
  setDetailProjectUser,
  setActiveFinanzasPopupUser,
  setShowProjectDetailsInPopup,
  detailProjectUser = null,
  showProjectDetailsInPopup = false,
  renderProjectDetailsContent,
  completedSessionToDisplay = null,
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
  renderEnlargedParticipantWindow,
  screenSplitLayout = 'single',
  invitedUsersMap = {}
}) => {
  const feedContainerRef = useRef<HTMLDivElement>(null);
  // 🎛️ Channels menu hover & toggle state
  const [activeChannelsMenuSessionId, setActiveChannelsMenuSessionId] = useState<string | null>(null);
  const channelsMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showCameraParticipantsGrid, setShowCameraParticipantsGrid] = useState<Record<string, boolean>>({});

  // 📺 Canal seleccionado internamente para conmutar al instante dentro de esta misma pantalla
  const [currentChannel, setCurrentChannel] = useState<string>(selectedCategoryFilter || 'Finanzas');
  const [channelToastMessage, setChannelToastMessage] = useState<string | null>(null);

  // 🌐 Traductor de descripciones a Inglés (solicitado sobre captura image.png)
  const [translatedVideosMap, setTranslatedVideosMap] = useState<Record<string, boolean>>({});

  const toggleVideoTranslation = (videoId: string) => {
    setTranslatedVideosMap(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  const getEnglishTranslation = (text: string) => {
    if (!text) return '';
    const trimmed = text.trim();
    if (trimmed.includes('alta costura futurista') || trimmed.includes('Glitter Makeup')) {
      return 'Futuristic haute couture session. Presenting Glitter Makeup for the Barcelona show! ✨ #highfashion #mexicanfashion';
    }
    if (trimmed.includes('Pasarela exclusiva') || trimmed.includes('Colección de Primavera')) {
      return 'Exclusive haute couture runway in Paris - Spring Collection 👗 #runway #fashionweek';
    }
    if (trimmed.includes('Backstage') || trimmed.includes('desfilar')) {
      return 'Backstage and model preparation before stepping onto the runway ✨ #backstage #models';
    }
    if (trimmed.includes('Colección Urbana') || trimmed.includes('Streetwear')) {
      return 'Urban Streetwear Collection 2026 - Outdoor photoshoot 🛹 #streetwear';
    }
    if (trimmed.includes('Casting') || trimmed.includes('noveles')) {
      return 'Casting and interviews with aspiring models for international agencies 🌟 #casting';
    }
    return text
      .replace(/Sesión de alta costura futurista/gi, 'Futuristic haute couture session')
      .replace(/Sesión de alta costura/gi, 'Haute couture session')
      .replace(/alta costura/gi, 'haute couture')
      .replace(/Presentando Glitter Makeup para el show de Barcelona/gi, 'Presenting Glitter Makeup for the Barcelona show')
      .replace(/Presentando/gi, 'Presenting')
      .replace(/para el show de/gi, 'for the show in')
      .replace(/Colección Urbana Streetwear/gi, 'Urban Streetwear Collection')
      .replace(/Colección de Primavera/gi, 'Spring Collection')
      .replace(/Pasarela exclusiva/gi, 'Exclusive runway')
      .replace(/Pasarela/gi, 'Runway')
      .replace(/desfile/gi, 'fashion show')
      .replace(/preparación de modelos antes de salir a desfilar/gi, 'model preparation before stepping onto the runway')
      .replace(/Sesión fotográfica en exteriores/gi, 'Outdoor photoshoot')
      .replace(/Casting y entrevistas con modelos noveles/gi, 'Casting and interviews with aspiring models')
      .replace(/para agencias internacionales/gi, 'for international agencies')
      .replace(/#modamexicana/gi, '#mexicanfashion')
      .replace(/#modaespanola/gi, '#spanishfashion');
  };

  useEffect(() => {
    if (channelToastMessage) {
      const t = setTimeout(() => setChannelToastMessage(null), 2500);
      return () => clearTimeout(t);
    }
  }, [channelToastMessage]);

  useEffect(() => {
    if (selectedCategoryFilter) {
      setCurrentChannel(selectedCategoryFilter);
      setSessionSelectedPresenterMap({});
    }
  }, [selectedCategoryFilter]);

  const getChannelCleanName = (channelId?: string) => {
    if (channelId === 'Modelos') return 'Runway';
    if (channelId === 'Investors') return 'Jewellery';
    return channelId || 'Finanzas';
  };

  // 🎥 Interface for channel multimedia videos (uploaded from z.png)
  interface ChannelUploadedVideoItem {
    id: string;
    username: string;
    name: string;
    avatar: string;
    videoUrl: string;
    likes: number;
    comments: { id: string; user: string; text: string; date: string; avatar: string }[];
    shares: number;
    favorites: number;
    description: string;
    music: string;
    videoCategory?: string;
    uploaderId?: string;
    isLiked?: boolean;
    isFavorited?: boolean;
    isUserUploaded?: boolean;
  }

  // Preset videos for Fashion channel & other categories so the channel is always gorgeous
  const DEFAULT_FASHION_PRESETS: ChannelUploadedVideoItem[] = [
    {
      id: 'fsh-preset-1',
      username: 'kendall_jenner_vip',
      name: 'Kendall Jenner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4',
      likes: 12450,
      comments: [
        { id: 'c-fsh-1', user: 'Vogue_Runway', text: '¡Increíble look de alta costura! ✨👠', date: 'Hace 5m', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
        { id: 'c-fsh-2', user: 'MarcJacobs_Pro', text: 'Look futurista impecable para la semana de la moda de París 🗼', date: 'Hace 18m', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' }
      ],
      shares: 820,
      favorites: 1940,
      description: 'Nueva temporada Streetwear & Haute Couture 🗼✨ Glitter makeup y siluetas contemporáneas desfilando en exclusiva. #fashion #streetwear #parisfashion #castinglive',
      music: 'Fashion Runway Anthem - Electronic Vibes',
      videoCategory: 'Fashion'
    },
    {
      id: 'fsh-preset-2',
      username: 'gigi_hadid_official',
      name: 'Gigi Hadid',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-posing-with-a-red-light-40486-large.mp4',
      likes: 18920,
      comments: [
        { id: 'c-fsh-3', user: 'Bella', text: '¡Esa luz roja en estudio resalta la colección brutalmente! ❤️🔥', date: 'Hace 1h', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' }
      ],
      shares: 1450,
      favorites: 3100,
      description: 'Sesión editorial Red Lights Studio 🔴⚡ Tendencias urbanas de vanguardia. #streetwear #fashionweek #lighting',
      music: 'Urban Synthwave Beats - LoFi Collective',
      videoCategory: 'Fashion'
    },
    {
      id: 'fsh-preset-3',
      username: 'bella_hadid_runway',
      name: 'Bella Hadid',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-in-a-studio-with-flashing-lights-40485-large.mp4',
      likes: 15300,
      comments: [
        { id: 'c-fsh-4', user: 'Alexander', text: 'Elegancia y porte internacional total.', date: 'Hace 2h', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' }
      ],
      shares: 980,
      favorites: 2400,
      description: 'Catwalk & Studio flash moments 📸 Luces estroboscópicas y alta moda en París. #haute_couture #flash #runway',
      music: 'Catwalk Bass Experience - Studio 9',
      videoCategory: 'Fashion'
    },
    {
      id: 'fsh-preset-4',
      username: 'mia_kincaid',
      name: 'Mia Kincaid',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=650',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-rainy-night-40539-large.mp4',
      likes: 9840,
      comments: [
        { id: 'c-fsh-5', user: 'Charlie', text: 'El ambiente nocturno con neón es espectacular 🌧️💜', date: 'Hace 3h', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' }
      ],
      shares: 610,
      favorites: 1520,
      description: 'Cyberpunk rain fashion en las noches de Madrid 🌧️💜 Luces de neón y estética futurista. #cyberpunk #neon #fashion',
      music: 'Street Lights (Slowed) - Lofi Beats',
      videoCategory: 'Fashion'
    }
  ];

  // Helper to load videos from localStorage coll_casting_live_videos (from page z.png)
  const loadChannelVideosFromStorage = (channelName: string): ChannelUploadedVideoItem[] => {
    let stored: any[] = [];
    try {
      const raw = localStorage.getItem('coll_casting_live_videos');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          stored = parsed;
        }
      }
    } catch (e) {}

    const chanLower = (channelName || 'Fashion').toLowerCase();

    // Match videos with this category
    const matched = stored.filter(v => {
      if (!v) return false;
      const cat = (v.videoCategory || v.category || '').toLowerCase();
      if (chanLower === 'todos') return true;
      if (chanLower === 'fashion') {
        return cat === 'fashion' || cat === 'moda' || cat.includes('fashion') || cat.includes('streetwear');
      }
      if (chanLower === 'modelos' || chanLower === 'runway') {
        return cat === 'modelos' || cat === 'runway';
      }
      if (chanLower === 'backstage') {
        return cat === 'backstage';
      }
      if (chanLower === 'investors' || chanLower === 'jewellery') {
        return cat === 'investors' || cat === 'jewellery';
      }
      if (chanLower === 'catwalk') {
        return cat === 'catwalk';
      }
      if (chanLower === 'fitnes') {
        return cat === 'fitnes' || cat === 'fitness';
      }
      if (chanLower === 'beauty') {
        return cat === 'beauty';
      }
      if (chanLower === 'influencer') {
        return cat === 'influencer';
      }
      return cat === chanLower;
    }).map(v => ({
      ...v,
      isUserUploaded: true
    }));

    // Other user uploads (e.g. uploaded clips that might not specify exact category)
    const otherUserUploads = stored.filter(v => {
      if (!v) return false;
      const isUpload = v.id && (String(v.id).includes('uploaded') || String(v.id).includes('user'));
      return isUpload && !matched.some(m => m.id === v.id);
    }).map(v => ({
      ...v,
      isUserUploaded: true
    }));

    const presets = DEFAULT_FASHION_PRESETS.map(p => ({
      ...p,
      videoCategory: channelName
    }));

    // Prioritize user uploads from z.png right at the top
    const combined = [...matched, ...otherUserUploads, ...presets];
    const unique: ChannelUploadedVideoItem[] = [];
    const seen = new Set<string>();

    for (const item of combined) {
      if (!item || !item.videoUrl) continue;
      const key = item.id || item.videoUrl;
      if (!seen.has(key) && !seen.has(item.videoUrl)) {
        seen.add(key);
        seen.add(item.videoUrl);
        unique.push(item);
      }
    }

    return unique.length > 0 ? unique : presets;
  };

  // State for multimedia channel video player (Fashion, Runway, BackStage, etc.)
  const [channelUploadedVideos, setChannelUploadedVideos] = useState<ChannelUploadedVideoItem[]>(() => {
    return loadChannelVideosFromStorage(currentChannel);
  });
  const [activeChannelVideoIdx, setActiveChannelVideoIdx] = useState<number>(0);
  const [isChannelVideoPlaying, setIsChannelVideoPlaying] = useState<boolean>(true);
  const [isChannelVideoAudioMuted, setIsChannelVideoAudioMuted] = useState<boolean>(false);
  const [channelVideoProgress, setChannelVideoProgress] = useState<number>(0);
  const [channelVideoLikesMap, setChannelVideoLikesMap] = useState<Record<string, { count: number; userLiked: boolean }>>({});
  const [channelVideoCommentsOpen, setChannelVideoCommentsOpen] = useState<boolean>(false);
  const [channelVideoNewComment, setChannelVideoNewComment] = useState<string>('');
  const [channelVideoCommentsMap, setChannelVideoCommentsMap] = useState<Record<string, any[]>>({});
  const [channelFollowedCreatorsMap, setChannelFollowedCreatorsMap] = useState<Record<string, boolean>>({});
  const [channelVideoShareToast, setChannelVideoShareToast] = useState<string | null>(null);

  const channelVideoRef = useRef<HTMLVideoElement | null>(null);
  const channelVideoCardRef = useRef<HTMLDivElement | null>(null);
  const lastChannelWheelTimeRef = useRef<number>(0);

  // Auto-sync uploaded videos from z.png via event and storage
  useEffect(() => {
    const handleSyncChannelVideos = () => {
      const vids = loadChannelVideosFromStorage(currentChannel);
      setChannelUploadedVideos(vids);
    };

    handleSyncChannelVideos();

    window.addEventListener('coll_casting_live_videos_updated', handleSyncChannelVideos);
    window.addEventListener('storage', handleSyncChannelVideos);
    window.addEventListener('saved_videos_updated', handleSyncChannelVideos);

    return () => {
      window.removeEventListener('coll_casting_live_videos_updated', handleSyncChannelVideos);
      window.removeEventListener('storage', handleSyncChannelVideos);
      window.removeEventListener('saved_videos_updated', handleSyncChannelVideos);
    };
  }, [currentChannel]);

  // Video playback sync on active index or channel change
  useEffect(() => {
    if (channelVideoRef.current) {
      channelVideoRef.current.currentTime = 0;
      if (isChannelVideoPlaying) {
        const p = channelVideoRef.current.play();
        if (p !== undefined) {
          p.catch(() => {
            if (channelVideoRef.current) {
              channelVideoRef.current.muted = true;
              channelVideoRef.current.play().catch(() => {});
            }
          });
        }
      }
    }
  }, [activeChannelVideoIdx, currentChannel]);

  const handleToggleChannelVideoLike = (video: ChannelUploadedVideoItem) => {
    const cur = channelVideoLikesMap[video.id] || { count: video.likes || 120, userLiked: Boolean(video.isLiked) };
    const nextLiked = !cur.userLiked;
    const nextCount = nextLiked ? cur.count + 1 : Math.max(0, cur.count - 1);
    setChannelVideoLikesMap(prev => ({ ...prev, [video.id]: { count: nextCount, userLiked: nextLiked } }));

    if (nextLiked) {
      window.dispatchEvent(new CustomEvent('trigger-hearts-shower'));
    }
  };

  const handleAddChannelVideoComment = (video: ChannelUploadedVideoItem) => {
    if (!channelVideoNewComment.trim()) return;
    const newCommentObj = {
      id: `comm-${Date.now()}`,
      user: userProfile?.name || 'Usuario Fashion',
      text: channelVideoNewComment.trim(),
      date: 'Ahora mismo',
      avatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    };

    const existingComments = channelVideoCommentsMap[video.id] || video.comments || [];
    const updated = [newCommentObj, ...existingComments];
    setChannelVideoCommentsMap(prev => ({ ...prev, [video.id]: updated }));
    setChannelVideoNewComment('');

    try {
      const raw = localStorage.getItem('coll_casting_live_videos');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const vIdx = parsed.findIndex(v => v.id === video.id);
          if (vIdx !== -1) {
            parsed[vIdx].comments = updated;
            localStorage.setItem('coll_casting_live_videos', JSON.stringify(parsed));
          }
        }
      }
    } catch (e) {}
  };

  const handleNextChannelVideo = () => {
    if (activeChannelVideoIdx < channelUploadedVideos.length - 1) {
      setActiveChannelVideoIdx(prev => prev + 1);
      setChannelVideoProgress(0);
      setIsChannelVideoPlaying(true);
    }
  };

  const handlePrevChannelVideo = () => {
    if (activeChannelVideoIdx > 0) {
      setActiveChannelVideoIdx(prev => prev - 1);
      setChannelVideoProgress(0);
      setIsChannelVideoPlaying(true);
    }
  };

  const handleShareChannelVideo = (video: ChannelUploadedVideoItem) => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(video.videoUrl || window.location.href);
      }
    } catch (e) {}

    const v = video as any;
    // Increment share counter
    v.shares = (v.shares || 48) + 1;

    // Save to shared videos in localStorage so it appears in the new "Compartir" tab on the profile page (z1.png)
    const sharedItem = {
      id: v.id || `shared-${Date.now()}`,
      title: v.title || `Vídeo de @${v.username || 'sofia_sensations'}`,
      description: v.description || '',
      videoUrl: v.videoUrl,
      poster: v.thumbnail || v.avatar,
      thumbnail: v.thumbnail || v.avatar,
      avatar: v.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      username: v.username || 'sofia_sensations',
      name: v.name || v.username || 'Sofía Sensations',
      music: v.music || 'Aesthetic Synthwave - LoFi Collective',
      views: (v.views || 1420) + 1,
      shares: v.shares || 49,
      likes: v.likes || 1200,
      sharedAt: new Date().toISOString(),
      category: currentChannel || 'Fashion'
    };

    try {
      const existingRaw = localStorage.getItem('user_shared_videos');
      const existingList = existingRaw ? JSON.parse(existingRaw) : [];
      const filtered = existingList.filter((item: any) => item.id !== sharedItem.id);
      const updated = [sharedItem, ...filtered];
      localStorage.setItem('user_shared_videos', JSON.stringify(updated));
    } catch (_) {}

    window.dispatchEvent(new CustomEvent('channel-video-shared', { detail: sharedItem }));
    window.dispatchEvent(new CustomEvent('open-profile-shared-tab', { detail: sharedItem }));
    window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'profile' }));

    setChannelVideoShareToast('¡Vídeo compartido! Abriendo tu pestaña Compartir en tu perfil 🔗');
    setTimeout(() => {
      setChannelVideoShareToast(null);
      window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'profile' }));
      window.dispatchEvent(new CustomEvent('open-profile-shared-tab', { detail: sharedItem }));
    }, 500);
  };

  const lastWheelTimeRef = useRef<number>(0);
  // ⚠️ Aviso cuando el usuario intenta inscribirse en otra ronda estando ya participando en una
  const [alreadyParticipatingNotice, setAlreadyParticipatingNotice] = useState<{
    show: boolean;
    currentRoundTitle: string;
    attemptedRoundTitle: string;
    enrolledIndex: number;
    targetSessionId?: string;
  } | null>(null);

  const isProgrammaticScrollRef = useRef<boolean>(false);
  const isMouseDownRef = useRef<boolean>(false);
  const mouseStartYRef = useRef<number | null>(null);

  // Mouse drag support for desktop/trackpad (Swipe like on mobile/TikTok)
  const handleMouseDownFeed = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (
      showVotingProjectsModal ||
      showFinanzasResults ||
      showFinanzasRecount ||
      target.closest('button, input, textarea, a, select, [role="button"], form') ||
      target.closest('.overflow-y-auto:not(#tiktok-rounds-vertical-feed)') ||
      target.closest('#voting-projects-scrollable-container') ||
      target.closest('[id^="voting-projects-in-channel"]') ||
      target.closest('[id^="finanzas-results-in-channel"]') ||
      target.closest('#podium-scrollable-content-wrapper') ||
      target.closest('#podium-results-screen') ||
      target.closest('#ten-windows-live-modal') ||
      target.closest('#participants-round-table-panel') ||
      target.closest('#in-channel-comments-window')
    ) {
      return;
    }
    isMouseDownRef.current = true;
    mouseStartYRef.current = e.clientY;
  };

  const handleMouseMoveFeed = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || mouseStartYRef.current === null) return;
    const diff = mouseStartYRef.current - e.clientY;
    if (Math.abs(diff) > 50) {
      isMouseDownRef.current = false;
      mouseStartYRef.current = null;
      if (diff > 0) {
        scrollToRound(activeFinanzasSessionIndex + 1);
      } else {
        scrollToRound(activeFinanzasSessionIndex - 1);
      }
    }
  };

  const handleMouseUpFeed = () => {
    isMouseDownRef.current = false;
    mouseStartYRef.current = null;
  };

  const handleWheelFeed = (e: React.WheelEvent) => {
    const target = e.target as HTMLElement;

    // 🛑 Si estamos dentro del contenedor del podio de resultados finales o escrutinio:
    // La página permanece FIJA en pantalla. NO salir de la pantalla ni cambiar de ronda por scroll.
    // Permitir desplazarse cómodamente con el ratón hasta abajo del todo.
    if (showFinanzasResults || showFinanzasRecount || target.closest('#podium-scrollable-content-wrapper') || target.closest('#podium-results-screen') || target.closest('#finanzas-results-in-channel') || target.closest('[id^="finanzas-results-in-channel"]')) {
      const wrapper = document.getElementById('podium-scrollable-content-wrapper');
      if (wrapper && !target.closest('#podium-scrollable-content-wrapper')) {
        wrapper.scrollBy({ top: e.deltaY, behavior: 'auto' });
      }
      return;
    }

    if (
      showVotingProjectsModal ||
      target.closest('.overflow-y-auto:not(#tiktok-rounds-vertical-feed)') ||
      target.closest('#voting-projects-scrollable-container') ||
      target.closest('[id^="voting-projects-in-channel"]') ||
      target.closest('#ten-windows-live-modal') ||
      target.closest('#in-channel-comments-window')
    ) {
      return;
    }

    const now = Date.now();
    if (now - lastWheelTimeRef.current < 300) return;
    if (Math.abs(e.deltaY) > 15) {
      lastWheelTimeRef.current = now;
      // 🛑 Al hacer scroll con el ratón por las rondas (z1.png):
      // NO deben salir las páginas de Escrutinio (image.png) ni Resultados Finales (z.png).
      // Solo deben salir rondas.
      if (setShowFinanzasResults) setShowFinanzasResults(false);
      if (setShowFinanzasRecount) setShowFinanzasRecount(false);
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
    const target = e.target as HTMLElement;
    if (
      showVotingProjectsModal ||
      showFinanzasResults ||
      showFinanzasRecount ||
      target.closest('.overflow-y-auto:not(#tiktok-rounds-vertical-feed)') ||
      target.closest('#voting-projects-scrollable-container') ||
      target.closest('[id^="voting-projects-in-channel"]') ||
      target.closest('[id^="finanzas-results-in-channel"]') ||
      target.closest('#podium-scrollable-content-wrapper') ||
      target.closest('#podium-results-screen') ||
      target.closest('#ten-windows-live-modal') ||
      target.closest('#in-channel-comments-window')
    ) {
      touchStartYRef.current = null;
      return;
    }
    touchStartYRef.current = e.touches[0].clientY;
  };
  const handleTouchEndFeed = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const diff = touchStartYRef.current - e.changedTouches[0].clientY;
    touchStartYRef.current = null;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        scrollToRound(activeFinanzasSessionIndex + 1);
      } else {
        scrollToRound(activeFinanzasSessionIndex - 1);
      }
    }
  };

  // Comfortable keyboard arrow navigation between rounds
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) return;
      if (showVotingProjectsModal || showFinanzasResults || showFinanzasRecount) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToRound(activeFinanzasSessionIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToRound(activeFinanzasSessionIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFinanzasSessionIndex, showVotingProjectsModal, showFinanzasResults, showFinanzasRecount, activeSessionsOnly.length]);

  // Listen to global feed scroll events from child views (such as z.png results screen)
  useEffect(() => {
    const handleCustomFeedScroll = (e: any) => {
      // 🛡️ Si estamos en la pantalla de resultados finales (z.png), permanecer fija en pantalla
      if (showFinanzasResults) return;
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
  }, [activeFinanzasSessionIndex, activeSessionsOnly.length, showFinanzasResults]);

  // 🎯 Redirigir directamente a la página de la captura imagen.png (donde los participantes están en la cuenta atrás de los 10 minutos para votar) al pulsar X
  useEffect(() => {
    const handleExitVotingToImagePage = (e: any) => {
      setShowVotingProjectsModal(false);
      setShowProjectDetailsInPopup(false);
      setDetailProjectUser(null);
      setActiveFinanzasPopupUser(null);
      setShowFinanzasInscriptionInChannel(false);
      if (setShowFinanzasResults) setShowFinanzasResults(false);
      if (setShowFinanzasRecount) setShowFinanzasRecount(false);

      const targetSession = activeSessionsOnly[activeFinanzasSessionIndex] || activeSessionsOnly[0];
      const targetSessionId = e.detail?.sessionId || targetSession?.id || 'sess-trabajadores-1';

      // Mantener la fase de votación de 10 minutos activa (captura image.png con la cuenta atrás)
      setSessionVotingPhaseMap(prev => {
        const next = { ...prev, [targetSessionId]: true };
        try {
          localStorage.setItem('finanzas_session_voting_phase_map', JSON.stringify(next));
          localStorage.setItem(`finanzas_is_voting_phase_active_${targetSessionId}`, 'true');
          localStorage.setItem('finanzas_is_voting_phase_active', 'true');
        } catch (err) {}
        return next;
      });
    };

    window.addEventListener('exit-voting-to-image-page', handleExitVotingToImagePage);
    window.addEventListener('exit-voting-to-z-page', handleExitVotingToImagePage);
    window.addEventListener('exit-voting-to-exposition', handleExitVotingToImagePage);
    return () => {
      window.removeEventListener('exit-voting-to-image-page', handleExitVotingToImagePage);
      window.removeEventListener('exit-voting-to-z-page', handleExitVotingToImagePage);
      window.removeEventListener('exit-voting-to-exposition', handleExitVotingToImagePage);
    };
  }, [activeSessionsOnly, activeFinanzasSessionIndex]);

  // 🛑 Al pulsar "Cerrar Concurso": resetear la ronda que terminó a la fase de exposición de 5 minutos, manteniendo la independencia de las demás
  useEffect(() => {
    const handleCloseContestReset = (e: any) => {
      const closedId = e.detail?.closedSessionId;
      const nextId = e.detail?.nextRoundId;
      setSessionVotingPhaseMap(prev => {
        const next = { ...prev };
        if (closedId) next[closedId] = false;
        if (nextId) next[nextId] = false;
        try {
          localStorage.setItem('finanzas_session_voting_phase_map', JSON.stringify(next));
        } catch (err) {}
        return next;
      });

      if (closedId) {
        setSessionVotingTimerMap(prev => ({ ...prev, [closedId]: 600 }));
        setSessionExpositionTimerMap(prev => ({ ...prev, [closedId]: 300 }));
        const sess = activeSessionsOnly.find(s => s.id === closedId);
        if (sess) {
          const parts = getSessionParticipants(sess);
          if (parts.length > 0) {
            setSessionSelectedPresenterMap(prev => ({ ...prev, [closedId]: parts[0] }));
          }
        }
      }
      if (nextId) {
        setSessionVotingTimerMap(prev => ({ ...prev, [nextId]: 600 }));
        setSessionExpositionTimerMap(prev => ({ ...prev, [nextId]: 300 }));
      }
    };

    window.addEventListener('finanzas-close-contest-reset-round', handleCloseContestReset);
    return () => {
      window.removeEventListener('finanzas-close-contest-reset-round', handleCloseContestReset);
    };
  }, [activeSessionsOnly]);

  // Sync feed scroll position whenever activeFinanzasSessionIndex changes from outside
  useEffect(() => {
    if (isProgrammaticScrollRef.current) return;
    if (activeSessionsOnly[activeFinanzasSessionIndex]) {
      const targetSession = activeSessionsOnly[activeFinanzasSessionIndex];
      const container = feedContainerRef.current;
      const el = document.getElementById(`tiktok-round-card-${targetSession.id}`);
      if (container && el) {
        const targetTop = el.offsetTop - (container.clientHeight - el.clientHeight) / 2;
        if (Math.abs(container.scrollTop - targetTop) > 60) {
          isProgrammaticScrollRef.current = true;
          container.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
          setTimeout(() => {
            isProgrammaticScrollRef.current = false;
          }, 550);
        }
      }
    }
  }, [activeFinanzasSessionIndex, activeSessionsOnly.length]);

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

  // 💖 Glosario de 30 emojis (6 columnas x 5 filas) idéntico a la captura image.png
  const TIKTOK_HEART_HOVER_EMOJIS = [
    '❤️', '💖', '🔥', '👏', '🤩', '🎉',
    '👍', '⭐', '🥰', '😘', '💕', '💘',
    '💗', '💓', '💞', '😍', '🥳', '😎',
    '🤣', '😂', '😜', '🤤', '🤯', '🥵',
    '😻', '🙌', '🙏', '💪', '👀', '✨'
  ];

  // 🌐 Nombres de los emojis en inglés para el traductor solicitado sobre captura image.png
  const EMOJI_ENGLISH_NAMES: Record<string, string> = {
    '❤️': 'Red Heart',
    '💖': 'Sparkling Heart',
    '🔥': 'Fire',
    '👏': 'Clapping Hands',
    '🤩': 'Star-Struck',
    '🎉': 'Party Popper',
    '👍': 'Thumbs Up',
    '⭐': 'Star',
    '🥰': 'Smiling Face with Hearts',
    '😘': 'Face Blowing a Kiss',
    '💕': 'Two Hearts',
    '💘': 'Heart with Arrow',
    '💗': 'Growing Heart',
    '💓': 'Beating Heart',
    '💞': 'Revolving Hearts',
    '😍': 'Heart Eyes',
    '🥳': 'Partying Face',
    '😎': 'Smiling Face with Sunglasses',
    '🤣': 'Rolling on Floor Laughing',
    '😂': 'Face with Tears of Joy',
    '😜': 'Winking Face with Tongue',
    '🤤': 'Drooling Face',
    '🤯': 'Exploding Head',
    '🥵': 'Hot Face',
    '😻': 'Smiling Cat with Heart-Eyes',
    '🙌': 'Raising Hands',
    '🙏': 'Folded Hands',
    '💪': 'Flexed Biceps',
    '👀': 'Eyes',
    '✨': 'Sparkles'
  };

  const [isEmojiEnglish, setIsEmojiEnglish] = useState<boolean>(false);
  const [hoveredEmojiName, setHoveredEmojiName] = useState<string | null>(null);

  const [isChannelHeartHovered, setIsChannelHeartHovered] = useState<boolean>(false);
  const channelHeartHoverTimeoutRef = useRef<any>(null);

  const handleChannelHeartMouseEnter = () => {
    if (channelHeartHoverTimeoutRef.current) {
      clearTimeout(channelHeartHoverTimeoutRef.current);
      channelHeartHoverTimeoutRef.current = null;
    }
    setIsChannelHeartHovered(true);
  };

  const handleChannelHeartMouseLeave = () => {
    channelHeartHoverTimeoutRef.current = setTimeout(() => {
      setIsChannelHeartHovered(false);
    }, 280);
  };

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
  const [isEnlargedCommentsVisible, setIsEnlargedCommentsVisible] = useState<boolean>(true);

  useEffect(() => {
    const handleToggle = () => setIsEnlargedCommentsVisible(prev => !prev);
    const handleHide = () => setIsEnlargedCommentsVisible(false);
    const handleShow = () => setIsEnlargedCommentsVisible(true);
    window.addEventListener('toggle-live-comments', handleToggle);
    window.addEventListener('hide-live-comments', handleHide);
    window.addEventListener('show-live-comments', handleShow);
    return () => {
      window.removeEventListener('toggle-live-comments', handleToggle);
      window.removeEventListener('hide-live-comments', handleHide);
      window.removeEventListener('show-live-comments', handleShow);
    };
  }, []);
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
  const [hoveredActionsSessionId, setHoveredActionsSessionId] = useState<string | null>(null);
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

  // 🎥 Asegurar que el vídeo de la cámara del escenario principal cargue y reproduzca inmediatamente al conmutar canal dentro de esta misma pantalla
  useEffect(() => {
    if (liveVideoRef.current) {
      try {
        liveVideoRef.current.load();
        const p = liveVideoRef.current.play();
        if (p !== undefined) {
          p.catch(() => {
            if (liveVideoRef.current) {
              liveVideoRef.current.muted = true;
              liveVideoRef.current.play().catch(() => {});
            }
          });
        }
      } catch (e) {}
    }
  }, [currentChannel]);

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

  // 🎙️ GUION DE EXPOSICIÓN EN VIVO DE ALESSIA VANCE (MODELO DIRECTORA • CASUAL & LIFESTYLE)
  const ALESSIA_VANCE_SPEECH_SEGMENTS = [
    "Hola a todos los inversores y compañeros de la mesa de Fashion Finances. Soy Alessia Vance, Modelo Directora del proyecto Casual Chic Essentials.",
    "Durante estos cinco minutos de retransmisión en directo, os presento nuestra propuesta de moda contemporánea sostenible y de confección europea ética.",
    "Hemos validado una fuerte demanda en el mercado casual de alta gama, alcanzando una tasa de recurrencia del setenta y cinco por ciento.",
    "Nuestro modelo combina catálogo interactivo digital con colaboraciones exclusivas de modelos y embajadoras verificadas.",
    "Con la financiación de esta ronda, ampliaremos la red de distribución logística y optimizaremos la producción de la nueva temporada.",
    "Agradezco enormemente vuestra presencia y apoyo en estos 5 minutos. Quedo a vuestra disposición para responder a todas vuestras preguntas."
  ];

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

    // El participante sólo se escucha si el micrófono está encendido
    const isMicOn = Boolean(
      isPresenterLiveMicActive &&
      isBroadcastMicOn &&
      !isMuted &&
      !isPresenterCameraAudioMuted &&
      channelVolume > 0
    );
    if (!isMicOn) {
      stopLucasTorresSpeech();
      return;
    }

    const curSession = activeSessionsOnly[activeFinanzasSessionIndex];
    if (!curSession) return;
    const isVoting = Boolean(sessionVotingPhaseMap[curSession.id]);
    if (isVoting || showFinanzasResults || showFinanzasRecount) {
      stopLucasTorresSpeech();
      return;
    }

    const currentPresenter = getSessionPresenter(curSession, activeFinanzasSessionIndex);
    const isAlessia = currentPresenter?.name?.includes('Alessia') || currentPresenter?.id === 'f-1';
    const isLucas = currentPresenter?.name?.includes('Lucas') || currentPresenter?.id === 'trab-1';
    if (!isAlessia && !isLucas) {
      stopLucasTorresSpeech();
      return;
    }

    isSpeechActiveRef.current = true;

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const segments = isAlessia ? ALESSIA_VANCE_SPEECH_SEGMENTS : LUCAS_TORRES_SPEECH_SEGMENTS;
      const text = segments[speechSegmentIndexRef.current % segments.length];
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = isAlessia ? 1.05 : 1.0;
      // Volumen pleno cuando el micro está encendido
      utterance.volume = Math.max(0.7, (channelVolume || 80) / 100);

      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = isAlessia
        ? (voices.find(v => v.lang.startsWith('es') && (v.name.includes('Monica') || v.name.includes('Laura') || v.name.includes('Helena') || v.name.includes('Lucia') || v.name.includes('Paulina') || v.name.includes('Female') || v.name.includes('Google español') || v.name.includes('Natural'))) || voices.find(v => v.lang.startsWith('es')) || voices[0])
        : (voices.find(v => v.lang.startsWith('es') && (v.name.includes('Jorge') || v.name.includes('Pablo') || v.name.includes('Diego') || v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Spain') || v.name.includes('Castilian') || v.name.includes('Monica') || v.name.includes('Carlos'))) || voices.find(v => v.lang.startsWith('es')) || voices[0]);
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      utterance.onstart = () => {
        setIsLucasTorresSpeaking(true);
      };

      utterance.onend = () => {
        speechSegmentIndexRef.current = (speechSegmentIndexRef.current + 1) % segments.length;
        const stillMicOn = Boolean(
          isPresenterLiveMicActive &&
          isBroadcastMicOn &&
          !isMuted &&
          !isPresenterCameraAudioMuted &&
          channelVolume > 0
        );
        if (isSpeechActiveRef.current && stillMicOn) {
          speechTimeoutRef.current = setTimeout(() => {
            const currentMicOn = Boolean(
              isPresenterLiveMicActive &&
              isBroadcastMicOn &&
              !isMuted &&
              !isPresenterCameraAudioMuted &&
              channelVolume > 0
            );
            if (isSpeechActiveRef.current && currentMicOn) {
              speakLucasTorresSegment();
            } else {
              stopLucasTorresSpeech();
            }
          }, 1200);
        } else {
          stopLucasTorresSpeech();
        }
      };

      utterance.onerror = (e) => {
        console.warn("Speech synthesis notice:", e);
        const stillMicOn = Boolean(
          isPresenterLiveMicActive &&
          isBroadcastMicOn &&
          !isMuted &&
          !isPresenterCameraAudioMuted &&
          channelVolume > 0
        );
        if (isSpeechActiveRef.current && stillMicOn) {
          speechSegmentIndexRef.current = (speechSegmentIndexRef.current + 1) % segments.length;
          speechTimeoutRef.current = setTimeout(() => {
            const currentMicOn = Boolean(
              isPresenterLiveMicActive &&
              isBroadcastMicOn &&
              !isMuted &&
              !isPresenterCameraAudioMuted &&
              channelVolume > 0
            );
            if (isSpeechActiveRef.current && currentMicOn) {
              speakLucasTorresSegment();
            } else {
              stopLucasTorresSpeech();
            }
          }, 1400);
        } else {
          stopLucasTorresSpeech();
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
    }
  };

  const resumeOrStartLucasSpeech = () => {
    const isMicOn = Boolean(
      isPresenterLiveMicActive &&
      isBroadcastMicOn &&
      !isMuted &&
      !isPresenterCameraAudioMuted &&
      channelVolume > 0
    );
    if (!isMicOn) {
      stopLucasTorresSpeech();
      return;
    }
    isSpeechActiveRef.current = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      speakLucasTorresSegment();
    }
  };

  // 🎙️ Estado y manejador del micrófono en directo para la vista de cámara del presentador
  const [isPresenterLiveMicActive, setIsPresenterLiveMicActive] = useState<boolean>(true);

  useEffect(() => {
    const isMutedEffective = Boolean(isPresenterCameraAudioMuted || isMuted || !isBroadcastMicOn);
    setIsPresenterLiveMicActive(!isMutedEffective);
    if (isMutedEffective) {
      stopLucasTorresSpeech();
      if (liveVideoRef.current) {
        liveVideoRef.current.muted = true;
        liveVideoRef.current.volume = 0;
      }
    }
  }, [isPresenterCameraAudioMuted, isMuted, isBroadcastMicOn]);

  const handleTogglePresenterLiveMic = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const nextState = !isPresenterLiveMicActive;
    setIsPresenterLiveMicActive(nextState);

    if (nextState) {
      // Activar audio, vídeo y síntesis de voz (MICRO ON)
      if (setIsPresenterCameraAudioMuted) {
        setIsPresenterCameraAudioMuted(false);
      }
      if (toggleBroadcastMic && (!isBroadcastMicOn || isMuted)) {
        toggleBroadcastMic();
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
      // Silenciar audio, vídeo y cancelar voz POR COMPLETO (MICRO OFF)
      stopLucasTorresSpeech();
      if (setIsPresenterCameraAudioMuted) {
        setIsPresenterCameraAudioMuted(true);
      }
      if (toggleBroadcastMic && (isBroadcastMicOn && !isMuted)) {
        toggleBroadcastMic();
      }
      if (liveVideoRef.current) {
        liveVideoRef.current.muted = true;
        liveVideoRef.current.volume = 0;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
      if (userLiveMediaStream) {
        userLiveMediaStream.getAudioTracks().forEach(t => {
          t.enabled = false;
        });
      }

      if (setSystemVoiceNotification) {
        setSystemVoiceNotification({
          show: true,
          message: '🔇 Micrófono en OFF: participante silenciado'
        });
      }
    }
  };

  // 🎥 Control local del modo pantalla completa de la cámara del presentador (z.png)
  const [localCameraFullscreenOverride, setLocalCameraFullscreenOverride] = useState<boolean | null>(null);

  useEffect(() => {
    setLocalCameraFullscreenOverride(isPresenterCameraFullscreen);
  }, [isPresenterCameraFullscreen]);

  // Si la pantalla compartida se activa con 1 o 2 usuarios, asegurar que la vista en directo completa se abra
  useEffect(() => {
    if (isScreenSharingActive && (screenSplitLayout === '50-50' || screenSplitLayout === 'grid-3')) {
      setLocalCameraFullscreenOverride(true);
    }
  }, [isScreenSharingActive, screenSplitLayout]);

  useEffect(() => {
    const handleOpenSharedScreen = () => {
      setLocalCameraFullscreenOverride(true);
    };
    window.addEventListener('open-shared-screen-live', handleOpenSharedScreen);
    return () => window.removeEventListener('open-shared-screen-live', handleOpenSharedScreen);
  }, []);

  useEffect(() => {
    const handleCloseLiveCamera = () => {
      setLocalCameraFullscreenOverride(false);
      if (setIsPresenterCameraFullscreen) setIsPresenterCameraFullscreen(false);
      if (setIsWatchingPresenterCamera) setIsWatchingPresenterCamera(false);
    };
    window.addEventListener('close-presenter-live-camera', handleCloseLiveCamera);
    return () => window.removeEventListener('close-presenter-live-camera', handleCloseLiveCamera);
  }, [setIsPresenterCameraFullscreen, setIsWatchingPresenterCamera]);

  const prevEnlargedUserRef = useRef(enlargedWindowUser);
  useEffect(() => {
    if (prevEnlargedUserRef.current && !enlargedWindowUser) {
      setLocalCameraFullscreenOverride(false);
      if (setIsPresenterCameraFullscreen) setIsPresenterCameraFullscreen(false);
      if (setIsWatchingPresenterCamera) setIsWatchingPresenterCamera(false);
    }
    prevEnlargedUserRef.current = enlargedWindowUser;
  }, [enlargedWindowUser, setIsPresenterCameraFullscreen, setIsWatchingPresenterCamera]);

  const effectiveCameraFullscreen = (isScreenSharingActive && (screenSplitLayout === '50-50' || screenSplitLayout === 'grid-3'))
    ? (localCameraFullscreenOverride !== false)
    : (localCameraFullscreenOverride !== null ? localCameraFullscreenOverride : Boolean(isPresenterCameraFullscreen));

  // 🎯 Cerrar la cámara en directo (z.png) y redirigir inmediatamente a la página de exposición (image.png)
  const handleStopPresenterLiveCam = () => {
    setLocalCameraFullscreenOverride(false);
    if (setIsPresenterCameraFullscreen) {
      setIsPresenterCameraFullscreen(false);
    }
    if (setIsWatchingPresenterCamera) {
      setIsWatchingPresenterCamera(false);
    }
    window.dispatchEvent(new CustomEvent('close-presenter-live-camera'));
  };

  // 👥 Vista de 10 ventanas de participantes en vivo durante la fase de votación (captura z.png)
  const [showTenWindowsVotingLive, setShowTenWindowsVotingLive] = useState<boolean>(false);

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

  const continuousRainIntervalRef = useRef<any>(null);

  const triggerContinuousRain = (customEmoji?: string) => {
    playHeartSound();
    if (continuousRainIntervalRef.current) {
      clearInterval(continuousRainIntervalRef.current);
      continuousRainIntervalRef.current = null;
    }

    const selectedEmoji = customEmoji || '❤️';
    // 85% selected emoji, 15% high-shine sparkles ✨ to accentuate brightness and HD glow
    const emojiPool = [selectedEmoji, selectedEmoji, selectedEmoji, selectedEmoji, '✨'];

    const spawnContinuousWave = (waveIdx: number) => {
      const count = 28;
      const baseTime = Date.now();
      const waveHearts: typeof showerHearts = [];

      for (let i = 0; i < count; i++) {
        const isRain = Math.random() < 0.88; // 88% continuous waterfall cascade from top
        const size = Math.floor(Math.random() * 32) + 34; // 34px - 66px (Large, crisp, ultra HD definition)
        const duration = +(1.9 + Math.random() * 1.5).toFixed(2);
        const delay = +(Math.random() * 0.45).toFixed(2);
        const left = Math.floor(Math.random() * 94) + 3; // 3% to 97% width

        waveHearts.push({
          id: baseTime + waveIdx * 10000 + i + Math.floor(Math.random() * 100000),
          left,
          size,
          duration,
          delay,
          drift1: Math.floor(Math.random() * 40) - 20,
          drift2: Math.floor(Math.random() * 60) - 30,
          drift3: Math.floor(Math.random() * 50) - 25,
          drift4: Math.floor(Math.random() * 70) - 35,
          rot1: Math.floor(Math.random() * 40) - 20,
          rot2: Math.floor(Math.random() * 50) - 25,
          rot3: Math.floor(Math.random() * 60) - 30,
          rot4: Math.floor(Math.random() * 70) - 35,
          emoji: emojiPool[Math.floor(Math.random() * emojiPool.length)],
          type: isRain ? 'rain' : 'rise'
        });
      }

      setShowerHearts(prev => [...prev.slice(-140), ...waveHearts]);

      setTimeout(() => {
        setShowerHearts(prev => prev.filter(h => !waveHearts.some(nh => nh.id === h.id)));
      }, 4800);
    };

    // Instant initial burst
    spawnContinuousWave(0);

    // Continuous waves spawned every 480ms for 14 continuous waves = over 7 seconds of dense, steady rain
    let wave = 1;
    continuousRainIntervalRef.current = setInterval(() => {
      spawnContinuousWave(wave);
      wave++;
      if (wave >= 14) {
        clearInterval(continuousRainIntervalRef.current);
        continuousRainIntervalRef.current = null;
      }
    }, 480);
  };

  const triggerHeartsShower = (customEmoji?: string) => {
    triggerContinuousRain(customEmoji);
  };

  useEffect(() => {
    const handleTriggerShower = () => {
      triggerHeartsShower();
    };
    window.addEventListener('trigger-hearts-shower', handleTriggerShower);
    return () => {
      window.removeEventListener('trigger-hearts-shower', handleTriggerShower);
    };
  }, []);

  const [activeHoveredParticipantsSession, setActiveHoveredParticipantsSession] = useState<string | null>(null);
  // 🎛️ Synchronized selected presenter per session for direct turn switching (Marina Serrano by default for Streetwear & Urban matching z.png)
  const [sessionSelectedPresenterMap, setSessionSelectedPresenterMap] = useState<Record<string, any>>(() => {
    return {
      'sess-trabajadores-1': { id: 'trab-10', name: 'Marina Serrano', role: 'PATRONISTA SOSTENIBLE', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', username: 'marina_serrano_mod' }
    };
  });

  // 🗳️ State for 10-minute voting phase per session (matching zq.png)
  // 🛑 CADA RONDA ES ESTRICTAMENTE INDEPENDIENTE DE LA OTRA: guardado por sessionId
  const [sessionVotingPhaseMap, setSessionVotingPhaseMap] = useState<Record<string, boolean>>(() => {
    // Configuración independiente por Ronda:
    // Cada ronda tiene su propia fase: o bien fase de exposición de 5 minutos, o bien fase de descuento final de 10 minutos para votar.
    const defaultPhaseMap: Record<string, boolean> = {
      'sess-trabajadores-1': false, // Ronda 1 (10€): 5 min exposición de proyectos (Lucas Torres)
      'sess-emprendedores-1': true,  // Ronda 2 (100€): 10 min de cuenta atrás / descuento final para votar
      'sess-empresarios-1': false,   // Ronda 3 (1.000€): 5 min exposición de proyectos
      'sess-topmodels-1': true,      // Ronda 4 (10.000€): 10 min de cuenta atrás / descuento final para votar
      'sess-inversores-1': false,    // Ronda 5 (100.000€): 5 min exposición de proyectos
      'sess-millonarios-1': false,   // Ronda 6 (1.000.000€): 5 min exposición de proyectos
    };

    try {
      localStorage.removeItem('finanzas_is_voting_phase_active');
      const saved = localStorage.getItem('finanzas_session_voting_phase_map');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === 'object' && parsed !== null) {
          const result = { ...defaultPhaseMap };
          Object.keys(parsed).forEach(k => {
            const lsVal = localStorage.getItem(`finanzas_is_voting_phase_active_${k}`);
            if (lsVal === 'true') {
              result[k] = true;
            } else if (lsVal === 'false') {
              result[k] = false;
            } else if (typeof parsed[k] === 'boolean') {
              result[k] = parsed[k];
            }
          });
          return result;
        }
      }
    } catch (e) {}
    return defaultPhaseMap;
  });

  // 🛑 Cada ronda es estrictamente independiente de la otra: comprobación por sessionId
  const isSessionInVotingPhase = (sessionId: string) => {
    return Boolean(sessionVotingPhaseMap[sessionId]);
  };

  const handleMouseEnterRonda = (sessionId: string) => {
    // 🚫 Solo en la ventana en grande del participante o durante el tiempo de votación final de 10 minutos (captura z.png), NO abrir la ventana de los canales (captura image.png)
    if (enlargedWindowUser || isSessionInVotingPhase(sessionId)) return;
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

  // 🛡️ Al abrir la ventana en grande o durante la fase de votación de 10 minutos de la ronda actual, cerrar inmediatamente el menú de canales
  useEffect(() => {
    const curSession = activeSessionsOnly[activeFinanzasSessionIndex];
    if (enlargedWindowUser || (curSession && isSessionInVotingPhase(curSession.id))) {
      setActiveChannelsMenuSessionId(null);
    }
  }, [enlargedWindowUser, activeFinanzasSessionIndex, sessionVotingPhaseMap]);

  const toggleChannelsMenu = (sessionId: string) => {
    // 🚫 Durante el tiempo de votación final de 10 minutos, no permitir abrir el menú de canales
    if (isSessionInVotingPhase(sessionId)) {
      setActiveChannelsMenuSessionId(null);
      return;
    }
    if (activeChannelsMenuSessionId === sessionId) {
      setActiveChannelsMenuSessionId(null);
    } else {
      setActiveChannelsMenuSessionId(sessionId);
    }
  };
  useEffect(() => {
    try {
      localStorage.removeItem('finanzas_is_voting_phase_active');
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(k => {
        if (k.startsWith('finanzas_active_session_start_')) {
          const sessId = k.replace('finanzas_active_session_start_', '');
          const isVotingForThisSess = localStorage.getItem(`finanzas_is_voting_phase_active_${sessId}`) === 'true';
          const startTimeVal = parseInt(localStorage.getItem(k) || '0', 10);
          const elapsed = Math.floor((Date.now() - startTimeVal) / 1000);
          if (!isVotingForThisSess && elapsed >= 3000) {
            localStorage.setItem(k, String(Date.now() - 50 * 1000));
          }
        }
      });
    } catch (e) {}
  }, []);

  // ⏱️ Exposition 5-minute timer (300s = 5:00 minutes each participant)
  const [sessionExpositionTimerMap, setSessionExpositionTimerMap] = useState<Record<string, number>>(() => ({
    'sess-trabajadores-1': 300,
    'sess-emprendedores-1': 300,
    'sess-empresarios-1': 300,
    'sess-topmodels-1': 300,
    'sess-inversores-1': 300,
    'sess-millonarios-1': 300,
  }));

  const sessionExpositionTimerMapRef = useRef(sessionExpositionTimerMap);
  useEffect(() => {
    sessionExpositionTimerMapRef.current = sessionExpositionTimerMap;
  }, [sessionExpositionTimerMap]);

  const votingPhaseTimerRef = useRef(votingPhaseTimer);
  useEffect(() => {
    votingPhaseTimerRef.current = votingPhaseTimer;
  }, [votingPhaseTimer]);

  // 🗳️ Función robusta para calcular los segundos restantes persistentes de la cuenta atrás según timestamps reales
  const getPersistentVotingRemainingSeconds = (sessionId: string): number => {
    try {
      const endKey = `finanzas_voting_end_time_${sessionId}`;
      const endVal = localStorage.getItem(endKey);
      if (endVal) {
        const endMs = parseInt(endVal, 10);
        if (!isNaN(endMs) && endMs > Date.now() && endMs <= Date.now() + 660 * 1000) {
          return Math.max(1, Math.floor((endMs - Date.now()) / 1000));
        }
      }

      const savedTimer = localStorage.getItem(`finanzas_voting_phase_timer_${sessionId}`);
      if (savedTimer) {
        const s = parseInt(savedTimer, 10);
        if (!isNaN(s) && s > 0 && s <= 600) {
          localStorage.setItem(endKey, String(Date.now() + s * 1000));
          return s;
        }
      }

      // Default fresh 10-minute countdown (600s)
      const defaultSecs = 600;
      localStorage.setItem(endKey, String(Date.now() + defaultSecs * 1000));
      localStorage.setItem(`finanzas_voting_phase_timer_${sessionId}`, String(defaultSecs));
      return defaultSecs;
    } catch (e) {}
    return 600;
  };

  // 🗳️ Voting phase 10-minute countdown (persistente a través de cambios de página y recargas)
  const [sessionVotingTimerMap, setSessionVotingTimerMap] = useState<Record<string, number>>(() => {
    const sessionIds = [
      'sess-trabajadores-1',
      'sess-emprendedores-1',
      'sess-empresarios-1',
      'sess-topmodels-1',
      'sess-inversores-1',
      'sess-millonarios-1',
    ];
    const initialMap: Record<string, number> = {};
    sessionIds.forEach(id => {
      initialMap[id] = getPersistentVotingRemainingSeconds(id);
    });
    return initialMap;
  });

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
    try {
      const now = Date.now();
      localStorage.setItem(`finanzas_is_voting_phase_active_${sessionId}`, 'true');
      localStorage.removeItem('finanzas_is_voting_phase_active');
      localStorage.setItem(`finanzas_voting_end_time_${sessionId}`, String(now + 600 * 1000));
      localStorage.setItem(`finanzas_active_session_start_${sessionId}`, String(now - (3000 * 1000)));
      localStorage.setItem(`finanzas_voting_phase_timer_${sessionId}`, '600');
    } catch (e) {}
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

      const isVoting = Boolean(sessionVotingPhaseMap[sId]);

      if (isVoting) {
        // Keep voting countdown ticking in real-time based on persistent wall-clock timestamp
        const nextSecs = getPersistentVotingRemainingSeconds(sId);
        setSessionVotingTimerMap(prev => ({ ...prev, [sId]: nextSecs }));
        
        try {
          localStorage.setItem(`finanzas_voting_phase_timer_${sId}`, String(nextSecs));
        } catch (e) {}

        if (setVotingPhaseTimer && votingPhaseTimerRef.current !== nextSecs) {
          votingPhaseTimerRef.current = nextSecs;
          setVotingPhaseTimer(nextSecs);
        }

        if (nextSecs === 0 && (sessionVotingTimerMap[sId] !== undefined && sessionVotingTimerMap[sId] > 0)) {
          if (triggerScrutinyAndRecount) {
            triggerScrutinyAndRecount();
          }
        }
      } else {
        // In 5-minute exposition phase:
        const currentSecs = sessionExpositionTimerMapRef.current[sId] !== undefined ? sessionExpositionTimerMapRef.current[sId] : 300;
        const nextSecs = Math.max(0, currentSecs - 1);
        setSessionExpositionTimerMap(prev => ({ ...prev, [sId]: nextSecs }));

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
            handleStartVotingPhase(sId);
          } else {
            // Advance to next participant automatically!
            stopLucasTorresSpeech();
            const nextIdx = currentIdx + 1;
            const nextPresenter = participants[nextIdx];
            if (nextPresenter) {
              setSessionSelectedPresenterMap(p => ({ ...p, [sId]: nextPresenter }));
              if (setSelectedFinanzasUser) setSelectedFinanzasUser(nextPresenter);
            }
            setSessionExpositionTimerMap(prev => ({ ...prev, [sId]: 300 }));
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSessionsOnly, activeFinanzasSessionIndex, sessionVotingPhaseMap, isVotingPhaseActive]);

  // 🎙️ Effect to start presenter (Alessia Vance / Lucas Torres) live exposition speech as soon as page opens and countdown begins (Micro ON)
  useEffect(() => {
    const curSession = activeSessionsOnly[activeFinanzasSessionIndex];
    const isVoting = Boolean(curSession && sessionVotingPhaseMap[curSession.id]);
    const currentPresenter = curSession ? getSessionPresenter(curSession, activeFinanzasSessionIndex) : null;
    const isLucas = currentPresenter?.name?.includes('Lucas') || currentPresenter?.id === 'trab-1';
    const isAlessia = currentPresenter?.name?.includes('Alessia') || currentPresenter?.id === 'f-1';
    const isMicOn = Boolean(
      isPresenterLiveMicActive &&
      isBroadcastMicOn &&
      !isMuted &&
      !isPresenterCameraAudioMuted &&
      channelVolume > 0
    );

    if (!isVoting && !showFinanzasResults && !showFinanzasRecount && (isLucas || isAlessia) && isMicOn) {
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
  }, [activeFinanzasSessionIndex, isVotingPhaseActive, showFinanzasResults, showFinanzasRecount, sessionVotingPhaseMap, activeSessionsOnly, isBroadcastMicOn, isMuted, isPresenterLiveMicActive, isPresenterCameraAudioMuted, channelVolume]);

  // Synchronize speech synthesis volume when channelVolume or microphone changes
  useEffect(() => {
    const isMicOn = Boolean(
      isPresenterLiveMicActive &&
      isBroadcastMicOn &&
      !isMuted &&
      !isPresenterCameraAudioMuted &&
      channelVolume > 0
    );
    if (!isMicOn) {
      stopLucasTorresSpeech();
      if (liveVideoRef.current) {
        liveVideoRef.current.muted = true;
        liveVideoRef.current.volume = 0;
      }
    } else {
      if (isSpeechActiveRef.current && !window.speechSynthesis?.speaking) {
        speakLucasTorresSegment();
      }
    }
  }, [channelVolume, isBroadcastMicOn, isMuted, isPresenterLiveMicActive, isPresenterCameraAudioMuted]);

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

    // Abre o conmuta la ventana de reacciones por delante de cualquier ventana
    setShowEmojiPickerSessionId(prev => (prev === sessionId ? null : sessionId));

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
    const activeChan = currentChannel || selectedCategoryFilter || 'Finanzas';

    if (activeChan === 'Fashion') {
      if (fee === 10) return 'ROUND FASHION STREETWEAR ✨';
      if (fee === 100) return 'ROUND CASUAL & COUTURE ✨';
      if (fee === 1000) return 'ROUND HAUTE COUTURE LUXE ✨';
      if (fee === 10000) return 'ROUND PARIS FASHION WEEK 🗼';
      return 'ROUND FASHION & LIFESTYLE ✨';
    }
    if (activeChan === 'Modelos') {
      if (fee === 10) return 'ROUND RUNWAY NEW FACES 👑';
      if (fee === 100) return 'ROUND RUNWAY EDITORIAL 👑';
      if (fee === 1000) return 'ROUND TOP MODELS RUNWAY 👑';
      if (fee === 10000) return 'ROUND SUPERMODELS VIP 👑';
      return 'ROUND RUNWAY & TOP MODELS 👑';
    }
    if (activeChan === 'BackStage') {
      if (fee === 10) return 'ROUND BACKSTAGE CREW 🎬';
      if (fee === 100) return 'ROUND STYLING & MAKEUP 🎬';
      if (fee === 1000) return 'ROUND PRODUCTION MASTER 🎬';
      return 'ROUND BACKSTAGE & PRODUCCIÓN 🎬';
    }
    if (activeChan === 'Investors') {
      if (fee === 10) return 'ROUND JEWELLERY STARTER 💎';
      if (fee === 100) return 'ROUND LUXURY GEMSTONES 💎';
      if (fee === 1000) return 'ROUND HIGH JEWELLERY CLUB 💎';
      if (fee === 10000) return 'ROUND PRIVATE EQUITY JEWELS 💎';
      return 'ROUND JEWELLERY & LUXURY ASSETS 💎';
    }
    if (activeChan === 'Catwalk') {
      if (fee === 10) return 'ROUND CATWALK PASARELA 👠';
      if (fee === 100) return 'ROUND MILAN CATWALK 👠';
      if (fee === 1000) return 'ROUND HAUTE CATWALK 👠';
      return 'ROUND CATWALK & PASARELA 👠';
    }
    if (activeChan === 'Fitnes') {
      return 'ROUND FITNES & ACTIVEWEAR 💪';
    }
    if (activeChan === 'Beauty') {
      return 'ROUND BEAUTY & COSMETICS 💄';
    }
    if (activeChan === 'Influencer') {
      return 'ROUND INFLUENCER & VIRAL 📱';
    }
    if (activeChan === 'Todos') {
      return 'ROUND GLOBAL MULTI-CANAL 🌍';
    }

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
    const activeChan = currentChannel || selectedCategoryFilter || 'Finanzas';
    let list: any[] = [];

    if (activeChan === 'Fashion') {
      list = [...FASHION_USERS];
    } else if (activeChan === 'Modelos') {
      list = [...MODELOS_USERS];
    } else if (activeChan === 'Catwalk') {
      list = [...CATWALK_USERS];
    } else if (activeChan === 'Investors') {
      list = [...INVERSORES_USERS.slice(0, 10)];
    } else if (activeChan === 'BackStage') {
      list = [...TRABAJADORES_USERS.slice(0, 10)];
    } else if (activeChan === 'Fitnes') {
      list = [...FITNES_USERS];
    } else if (activeChan === 'Beauty') {
      list = [...BEAUTY_USERS];
    } else if (activeChan === 'Influencer') {
      list = [...INFLUENCER_USERS];
    } else if (activeChan === 'Todos') {
      list = [...TODOS_USERS];
    } else if (activeChan === 'Finanzas') {
      list = [...FINANZAS_USERS.slice(0, 10)];
    } else if (Array.isArray(session?.participants) && session.participants.length >= 10) {
      list = [...session.participants.slice(0, 10)];
    } else if (sId.includes('trabajadores') || fee === 10) list = [...TRABAJADORES_USERS.slice(0, 10)];
    else if (sId.includes('emprendedores') || fee === 100) list = [...FINANZAS_USERS.slice(0, 10)];
    else if (sId.includes('empresarios') || fee === 1000) list = [...EMPRESARIOS_USERS.slice(0, 10)];
    else if (sId.includes('topmodels') || fee === 10000) list = [...TOPMODELS_USERS.slice(0, 10)];
    else if (sId.includes('inversores') || fee === 100000) list = [...INVERSORES_USERS.slice(0, 10)];
    else if (sId.includes('millonarios') || fee === 1000000) list = [...MILLONARIOS_USERS.slice(0, 10)];
    else list = [...FINANZAS_USERS.slice(0, 10)];

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

  // 👥 Función para obtener la lista de 10 participantes para la vista de 10 ventanas en vivo (captura z.png)
  const getTenVotingLiveParticipants = (currentSess: any) => {
    const isEnrolled = Boolean(
      (currentSess?.id && userPaidSessions[currentSess.id]) ||
      (typeof window !== 'undefined' && (
        localStorage.getItem(`user_paid_session_${currentSess?.id}`) === 'true' ||
        localStorage.getItem('finanzas_user_participating') === 'true'
      ))
    );

    // 🚫 Si el usuario todavía NO está inscrito en la ronda:
    // NO participa en la página de 10 ventanas (captura z.png).
    // Se muestran estrictamente los 10 participantes del canal/ronda (Alessia, Gisele, Marcus, etc.) sin Adriana Lima (Tú).
    if (!isEnrolled) {
      return [
        {
          id: 'f-1',
          name: 'Alessia Vance',
          role: 'Modelo Directora',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=650',
          isSelf: false
        },
        {
          id: 'f-2',
          name: 'Gisele Bündchen',
          role: 'Inversora Principal',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650',
          isSelf: false
        },
        {
          id: 'f-3',
          name: 'Marcus Vance',
          role: 'Asesor Fintech',
          avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=650',
          isSelf: false
        },
        {
          id: 'f-4',
          name: 'Sienna Cole',
          role: 'Diseñadora Streetwear',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650',
          isSelf: false
        },
        {
          id: 'f-5',
          name: 'Liam Cooper',
          role: 'Socio Inversor',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650',
          isSelf: false
        },
        {
          id: 'f-6',
          name: 'Elena Rostova',
          role: 'Emprendedora Textil',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650',
          isSelf: false
        },
        {
          id: 'f-7',
          name: 'David Gandy',
          role: 'Inversor de Moda',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=650',
          isSelf: false
        },
        {
          id: 'f-8',
          name: 'Sofia Vergara',
          role: 'Productora Ejecutiva',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
          isSelf: false
        },
        {
          id: 'f-9',
          name: 'Yasmine Bleeth',
          role: 'Directora Creativa',
          avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650',
          isSelf: false
        },
        {
          id: 'f-10',
          name: 'Carlos Sainz',
          role: 'Piloto & Mecenas',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=650',
          isSelf: false
        }
      ];
    }

    // ✅ Si el usuario SÍ está inscrito en la ronda, aparece como participante activo
    return [
      {
        id: userProfile?.id || 'f-adriana-lima',
        name: `${userProfile?.name || 'Adriana Lima'} (Tú)`,
        role: 'Participante Activa (Tú)',
        avatar: (userProfile?.avatar && userProfile.avatar.startsWith('http'))
          ? userProfile.avatar
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
        isSelf: true
      },
      {
        id: 'f-1',
        name: 'Alessia Vance',
        role: 'Modelo Directora',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=650',
        isSelf: false
      },
      {
        id: 'f-2',
        name: 'Gisele Bündchen',
        role: 'Inversora Principal',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650',
        isSelf: false
      },
      {
        id: 'f-3',
        name: 'Marcus Vance',
        role: 'Asesor Fintech',
        avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=650',
        isSelf: false
      },
      {
        id: 'f-4',
        name: 'Sienna Cole',
        role: 'Diseñadora Streetwear',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650',
        isSelf: false
      },
      {
        id: 'f-5',
        name: 'Liam Cooper',
        role: 'Socio Inversor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650',
        isSelf: false
      },
      {
        id: 'f-6',
        name: 'Elena Rostova',
        role: 'Emprendedora Textil',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650',
        isSelf: false
      },
      {
        id: 'f-7',
        name: 'David Gandy',
        role: 'Inversor de Moda',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=650',
        isSelf: false
      },
      {
        id: 'f-8',
        name: 'Sofia Vergara',
        role: 'Productora Ejecutiva',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
        isSelf: false
      },
      {
        id: 'f-9',
        name: 'Yasmine Bleeth',
        role: 'Directora Creativa',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650',
        isSelf: false
      }
    ];
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
    const container = feedContainerRef.current;
    const el = document.getElementById(`tiktok-round-card-${targetSession.id}`);
    setActiveFinanzasSessionIndex(targetIndex);
    if (container && el) {
      isProgrammaticScrollRef.current = true;
      // 🎯 Scroll preciso para que la siguiente pantalla quede fija y perfectamente centrada
      const targetTop = el.offsetTop - Math.max(0, (container.clientHeight - el.clientHeight) / 2);
      container.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (err) {}
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
        if (container && el) {
          const finalTop = el.offsetTop - Math.max(0, (container.clientHeight - el.clientHeight) / 2);
          container.scrollTo({ top: Math.max(0, finalTop), behavior: 'auto' });
        }
      }, 550);
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Keyboard navigation up / down
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && effectiveCameraFullscreen) {
        handleStopPresenterLiveCam();
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
  }, [activeFinanzasSessionIndex, activeSessionsOnly, effectiveCameraFullscreen]);

  // 🎛️ Helper to render the channels & broadcast controls menu window (strictly matching z.png & image.png)
  const renderChannelsOverlay = (session?: any) => {
    const sId = session?.id || 'fashion-overlay';
    // 🚫 Durante el tiempo de votación final de 10 minutos (captura z.png), NO abrir la ventana de menú de canales (captura image.png)
    if (session?.id && isSessionInVotingPhase(session.id)) return null;
    // 🚫 Solo en la ventana en grande del participante (image.png), NO abrir la ventana de canales (z.png)
    if (enlargedWindowUser) return null;
    const isTargetOverlay = (
      activeChannelsMenuSessionId === sId ||
      (session?.id && activeChannelsMenuSessionId === session.id) ||
      activeChannelsMenuSessionId === 'fashion-menu' ||
      activeChannelsMenuSessionId === 'fashion-overlay' ||
      activeChannelsMenuSessionId === 'multimedia-channel-menu'
    );
    if (!isTargetOverlay) return null;
    const presenter = session ? getSessionPresenter(session, activeFinanzasSessionIndex) : { id: 'user-fashion', name: 'Canal ' + getChannelCleanName(currentChannel), avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' };
    const overlayRoundRef = (session && getFinanzasRoundRef) ? getFinanzasRoundRef(session) : (session?.reference || 'REF: 1');
    return (
      <div 
        className="absolute top-0 inset-x-0 z-[170] p-2.5 sm:p-3 pointer-events-auto animate-slide-down-tiktok"
        onMouseEnter={() => {
          handleMouseEnterRonda(session?.id || 'fashion-overlay');
        }}
        onMouseLeave={handleMouseLeaveRonda}
        onClick={(e) => e.stopPropagation()}
        id={`embedded-channels-menu-overlay-${sId}`}
      >
        {/* Subtle top indicator bar */}
        <div className="w-16 h-1 bg-white/40 rounded-full mx-auto mb-1.5 opacity-80" />

        <div 
          className="w-full bg-[#0B0F19]/98 backdrop-blur-xl text-white p-3 sm:p-3.5 rounded-3xl border border-slate-700/90 shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col gap-2.5 select-none"
          onMouseEnter={() => handleMouseEnterRonda(session?.id || 'fashion-overlay')}
          onMouseLeave={handleMouseLeaveRonda}
        >
          {/* Top Row: Volver, current channel badge, and Close */}
          <div className="flex items-center justify-between gap-1.5 w-full">
            <button
              type="button"
              onClick={() => {
                setActiveChannelsMenuSessionId(null);
                if (onNavigateToTab) {
                  onNavigateToTab('menu');
                }
                window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'menu' }));
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#181d2a] hover:bg-[#22293b] text-white text-[11px] font-black rounded-full transition cursor-pointer border border-slate-700/60 active:scale-95 shadow-md shrink-0"
              title="Volver"
              id="btn-channels-menu-volver"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#fe2c55] stroke-[3]" />
              <span className="font-black">Volver</span>
            </button>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-slate-400 font-medium">Canal:</span>
              <span className="text-rose-400 font-black">{getChannelCleanName(currentChannel)}</span>
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
                const isPresenter = Boolean(
                  presenter.id === userProfile?.id ||
                  presenter.name?.includes('Adriana') ||
                  presenter.isSelf ||
                  presenter.id === 'user-adriana'
                );
                const isExpositionPhase = !isSessionInVotingPhase(session.id);
                if (!isPresenter || !isExpositionPhase) {
                  if (setSystemVoiceNotification) {
                    setSystemVoiceNotification({
                      show: true,
                      message: '⚠️ El botón Cámara ON solo funciona cuando sea Adriana Lima quien esté dando la explicación.'
                    });
                  }
                  return;
                }
                handleToggleUserCameraLiveBroadcast();
                if (toggleBroadcastCam) {
                  toggleBroadcastCam();
                }
                setIsWatchingPresenterCamera(true);
                setIsPresenterCameraFullscreen(true);
              }}
              className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition cursor-pointer active:scale-95 shadow-md ${
                (!Boolean(presenter.id === userProfile?.id || presenter.name?.includes('Adriana') || presenter.isSelf || presenter.id === 'user-adriana') || isSessionInVotingPhase(session.id))
                  ? 'bg-[#181d2a]/50 text-slate-500 border-slate-800/80 cursor-not-allowed opacity-60'
                  : (isBroadcastCamOn || isUserLiveStreamingWithCamera)
                    ? 'bg-[#0B1E19] text-[#10b981] border-2 border-[#10b981] font-black shadow-emerald-950/40 ring-1 ring-[#10b981]/30'
                    : 'bg-[#181d2a] text-slate-300 border border-slate-700/70 hover:bg-[#22293b] font-bold'
              }`}
              title={
                (!Boolean(presenter.id === userProfile?.id || presenter.name?.includes('Adriana') || presenter.isSelf || presenter.id === 'user-adriana') || isSessionInVotingPhase(session.id))
                  ? '⚠️ La Cámara ON solo funciona cuando sea Adriana Lima quien esté dando la explicación'
                  : (isBroadcastCamOn || isUserLiveStreamingWithCamera) ? 'Desconectar Cámara' : 'Conectar Cámara ON'
              }
              id="btn-camara-on-channels-menu"
            >
              <Camera className={`w-4 h-4 shrink-0 ${
                (!Boolean(presenter.id === userProfile?.id || presenter.name?.includes('Adriana') || presenter.isSelf || presenter.id === 'user-adriana') || isSessionInVotingPhase(session.id))
                  ? 'text-slate-500'
                  : 'text-[#10b981]'
              }`} />
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
                const isPresenter = Boolean(
                  presenter.id === userProfile?.id ||
                  presenter.name?.includes('Adriana') ||
                  presenter.isSelf ||
                  presenter.id === 'user-adriana'
                );
                const isExpositionPhase = !isSessionInVotingPhase(session.id);
                if (!isPresenter || !isExpositionPhase) {
                  if (setSystemVoiceNotification) {
                    setSystemVoiceNotification({
                      show: true,
                      message: '⚠️ La opción del botón dividir pantalla solo funciona y puede decidirlo la persona que está dando su exposición de 5 minutos en el momento.'
                    });
                  }
                  return;
                }
                setActiveChannelsMenuSessionId(null);
                if (setShowScreenShareMenu) {
                  setShowScreenShareMenu(true);
                }
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
              id="btn-pantalla-on-channels-menu"
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

          {/* Bottom Row: 10 Live Channels */}
          <div className="pt-2 border-t border-slate-800/80 w-full">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[10.5px] sm:text-[11px] font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <span>📺</span> CANALES EN DIRECTO
              </span>
              <span className="text-[9px] sm:text-[9.5px] text-[#fe2c55] font-black bg-[#fe2c55]/10 px-2.5 py-0.5 rounded-full border border-[#fe2c55]/60">
                {getChannelCleanName(currentChannel)}
              </span>
            </div>

            {/* Selector de categorías en carrusel horizontal (idéntico al selector de categorías de captura z.png) */}
            <div className="w-full overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-1.5 pb-2 mb-1.5 px-0.5 select-none">
              {[
                { id: 'Fashion', label: 'Fashion ✨', bg: 'bg-[#fff0f3] text-[#be185d]', activeBg: 'bg-gradient-to-r from-pink-500 to-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30' },
                { id: 'Finanzas', label: 'Finanzas 📈', bg: 'bg-[#ecfdf5] text-[#047857]', activeBg: 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30' },
                { id: 'Modelos', label: 'Runway 👑', bg: 'bg-[#fffbeb] text-[#b45309]', activeBg: 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-600/30' },
                { id: 'BackStage', label: 'Backstage 🎬', bg: 'bg-[#ecfeff] text-[#0891b2]', activeBg: 'bg-[#06b6d4] text-white border-[#06b6d4] shadow-md' },
                { id: 'Investors', label: 'Jewellery 💎', bg: 'bg-[#fdf4ff] text-[#a21caf]', activeBg: 'bg-purple-600 text-white border-purple-500 shadow-md' },
                { id: 'Catwalk', label: 'Catwalk 👠', bg: 'bg-[#f5f3ff] text-[#7c3aed]', activeBg: 'bg-[#7c3aed] text-white border-[#7c3aed] shadow-md' },
                { id: 'Fitnes', label: 'Fitnes 💪', bg: 'bg-[#ecfdf5] text-[#059669]', activeBg: 'bg-emerald-600 text-white border-emerald-500 shadow-md' },
                { id: 'Beauty', label: 'Beauty 💄', bg: 'bg-[#fff1f2] text-[#e11d48]', activeBg: 'bg-rose-600 text-white border-rose-500 shadow-md' },
                { id: 'Influencer', label: 'Influencer 📱', bg: 'bg-[#fefce8] text-[#ca8a04]', activeBg: 'bg-amber-500 text-white border-amber-500 shadow-md' },
                { id: 'Todos', label: 'Todos 🌍', bg: 'bg-slate-800 text-slate-300', activeBg: 'bg-slate-700 text-white border-slate-500 shadow-md' }
              ].map(cat => {
                const isActive = (currentChannel || 'Finanzas') === cat.id;
                return (
                  <button
                    key={`pill-cat-${cat.id}`}
                    type="button"
                    onClick={() => {
                      setCurrentChannel(cat.id);
                      setSessionSelectedPresenterMap({});
                      setSessionExpositionTimerMap(prev => ({ ...prev, [session?.id || 'default']: 300 }));
                      setActiveChannelsMenuSessionId(null);
                      setChannelToastMessage(`Canal ${cat.label} activado`);
                      if (onCategoryFilterChange) {
                        onCategoryFilterChange(cat.id);
                      }
                    }}
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[9.5px] font-black transition-all cursor-pointer border active:scale-95 ${
                      isActive 
                        ? `${cat.activeBg} scale-105 font-black ring-1 ring-white/40` 
                        : 'bg-[#181d2a] hover:bg-[#22293b] text-slate-300 border-slate-700/80 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-1.5 w-full max-h-[40vh] overflow-y-auto p-1 rounded-2xl bg-[#090D15]/90 border border-slate-800 shadow-inner scrollbar-none">
              {CHANNELS_LIST.map(cat => {
                const isActive = (currentChannel || 'Finanzas') === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCurrentChannel(cat.id);
                      setSessionSelectedPresenterMap({});
                      setSessionExpositionTimerMap(prev => ({ ...prev, [session?.id || 'default']: 300 }));
                      setActiveChannelsMenuSessionId(null);
                      setChannelToastMessage(`Canal ${cat.label} activado`);
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

  // 🎬 Renderizador del Feed de Vídeos del Canal (Fashion, Runway, BackStage, etc.)
  // Cero rondas, únicamente vídeos subidos por los usuarios desde la página z.png con reproductor vertical TikTok/Reels
  const renderMultimediaChannelVideoFeed = () => {
    const videos = channelUploadedVideos;
    const currentVid = videos[activeChannelVideoIdx] || videos[0] || DEFAULT_FASHION_PRESETS[0];
    const likesData = channelVideoLikesMap[currentVid.id] || { count: currentVid.likes || 120, userLiked: Boolean(currentVid.isLiked) };
    const commentsList = channelVideoCommentsMap[currentVid.id] || currentVid.comments || [];
    const isFollowed = channelFollowedCreatorsMap[currentVid.username] || currentVid.isLiked;

    return (
      <div
        key={`multimedia-feed-wrapper-${currentChannel}`}
        id={`tiktok-round-card-multimedia-${currentChannel}`}
        className="snap-center snap-always shrink-0 flex items-center justify-center w-full max-w-full sm:max-w-[580px] my-0 py-0 sm:py-0.5 relative px-0 sm:px-2 overflow-x-hidden h-full max-md:h-[100dvh] min-h-[calc(100dvh-20px)]"
      >
        {/* 📦 Relative anchor for the channel card and its external navigator */}
        <div className="relative flex items-center justify-center w-full max-w-[430px] md:max-w-[440px] overflow-x-hidden lg:overflow-x-visible h-full max-md:h-[100dvh]">
          {/* 📱 Smartphone video frame container styled matching z.png & image.png */}
          <div
            ref={channelVideoCardRef}
            onWheel={(e) => {
              const now = Date.now();
              if (now - lastChannelWheelTimeRef.current < 280) return;
              if (Math.abs(e.deltaY) > 15) {
                lastChannelWheelTimeRef.current = now;
                if (e.deltaY > 0) {
                  handleNextChannelVideo();
                } else {
                  handlePrevChannelVideo();
                }
              }
            }}
            className="w-full max-w-full sm:max-w-[420px] md:max-w-[430px] h-full max-md:h-[100dvh] sm:h-[calc(100dvh-20px)] sm:max-h-[820px] bg-[#070b14] border-0 sm:border border-black rounded-none sm:rounded-[36px] md:rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden relative flex flex-col justify-between box-border select-none"
            id="multimedia-video-feed-card"
          >
            {/* 📱 Subtle top speaker notch */}
            <div className="w-16 h-1 bg-white/30 rounded-full mx-auto mt-1.5 mb-0.5 opacity-70 shrink-0 pointer-events-none z-40" />

            {/* 🎛️ SENSOR DEL MARGEN SUPERIOR DEL CANAL (Despliega las opciones de los canales de la captura z.png al pasar el puntero) */}
            <div 
              className="absolute top-0 inset-x-0 h-24 sm:h-28 z-40 pointer-events-auto cursor-pointer flex justify-center items-start pt-2 group/top-margin-sensor select-none"
              id="multimedia-top-margin-hover-sensor"
              onMouseEnter={() => handleMouseEnterRonda('fashion-overlay')}
              onMouseLeave={handleMouseLeaveRonda}
              onClick={(e) => {
                e.stopPropagation();
                setActiveChannelsMenuSessionId(prev => prev === 'fashion-overlay' ? null : 'fashion-overlay');
              }}
              title="Pasa el puntero por la parte superior para desplegar las opciones de los canales"
            >
              {/* Subtle top indicator bar */}
              <div className="w-16 sm:w-20 h-1.5 bg-white/40 group-hover/top-margin-sensor:bg-white/80 group-hover/top-margin-sensor:scale-105 rounded-full transition-all duration-300 pointer-events-none opacity-80" />
            </div>

            {/* 🎛️ EMBEDDED BROADCAST CONTROL & CHANNELS OVERLAY MENU (Strictly matching image.png & z.png) */}
            {renderChannelsOverlay({ id: 'fashion-overlay' })}

            {/* 📹 Main Fullscreen Vertical Video Element */}
            <div
              className="absolute inset-0 w-full h-full cursor-pointer overflow-hidden bg-black flex items-center justify-center"
              onClick={() => {
                if (channelVideoRef.current) {
                  if (isChannelVideoPlaying) {
                    channelVideoRef.current.pause();
                    setIsChannelVideoPlaying(false);
                  } else {
                    channelVideoRef.current.play().catch(() => {});
                    setIsChannelVideoPlaying(true);
                  }
                }
              }}
            >
              <video
                ref={channelVideoRef}
                src={currentVid.videoUrl}
                autoPlay
                loop
                playsInline
                muted={isChannelVideoAudioMuted}
                onTimeUpdate={() => {
                  if (channelVideoRef.current) {
                    const cur = channelVideoRef.current.currentTime;
                    const dur = channelVideoRef.current.duration || 1;
                    setChannelVideoProgress((cur / dur) * 100);
                  }
                }}
                className="w-full h-full object-cover select-none"
              />

              {/* Pause icon overlay */}
              {!isChannelVideoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none animate-fade-in z-20">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-2xl">
                    <Play className="w-8 h-8 fill-white text-white translate-x-0.5" />
                  </div>
                </div>
              )}

              {/* Top & Bottom dark subtle gradients for readability */}
              <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none z-10" />
            </div>

            {/* 🔝 CABECERA SUPERIOR: CANAL Y BOTONES DE ACCIÓN (Matching image.png - Hover abre opciones de canales z.png) */}
            <div 
              className="relative z-30 w-full pt-2 pb-1.5 px-3 flex items-center justify-between gap-1.5 select-none pointer-events-auto"
              onMouseEnter={() => handleMouseEnterRonda('fashion-overlay')}
              onMouseLeave={handleMouseLeaveRonda}
            >
              {/* Channel Selector Pill Button (Clicking opens channels menu overlay from image.png) */}
              <button
                type="button"
                onMouseEnter={() => handleMouseEnterRonda('fashion-overlay')}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveChannelsMenuSessionId('fashion-overlay');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B0F19]/90 hover:bg-[#181d2a] border border-rose-500/70 text-white shadow-lg active:scale-95 transition cursor-pointer backdrop-blur-md"
                title="Cambiar de canal en directo (captura image.png y z.png)"
                id="btn-open-channels-menu-multimedia"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                <span className="text-[11px] font-black uppercase tracking-wider text-rose-300">
                  Canal: {getChannelCleanName(currentChannel)}
                </span>
                <span className="text-[9px] text-rose-400">▼</span>
              </button>
            </div>

            {/* 📱 BARRA LATERAL DERECHA ESTILO TIKTOK: Me gusta, Comentarios, Compartir - Centrada a la mitad de la página */}
            <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-3 select-none pointer-events-auto">
              {/* Creator Avatar with follow (+) badge */}
              <div className="relative group cursor-pointer mb-1">
                <img
                  src={currentVid.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                  alt={currentVid.name}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-white shadow-xl transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setChannelFollowedCreatorsMap(prev => ({ ...prev, [currentVid.username]: !isFollowed }));
                  }}
                  className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-black border border-slate-900 shadow-md transition-all ${
                    isFollowed ? 'bg-emerald-500 scale-90' : 'bg-[#fe2c55] hover:scale-110 active:scale-90'
                  }`}
                  title={isFollowed ? "Siguiendo" : "Seguir a este creador"}
                >
                  {isFollowed ? '✓' : '+'}
                </button>
              </div>

              {/* Like / Corazón con Glosario de Emojis al pasar el puntero (captura image.png sobre z.png) */}
              <div 
                className="flex flex-col items-center relative group/channel-heart-zone"
                onMouseEnter={handleChannelHeartMouseEnter}
                onMouseLeave={handleChannelHeartMouseLeave}
              >
                {/* 💖 Glosario de 30 Emojis que se abre al pasar el puntero por encima del corazón (captura image.png) */}
                <div 
                  className={`absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-[500] w-[284px] min-w-[284px] max-w-[284px] box-border bg-[#090d16]/98 backdrop-blur-2xl border border-slate-700/80 p-2.5 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.98)] ring-1 ring-white/10 select-none after:content-[''] after:absolute after:-right-4 after:inset-y-0 after:w-5 transition-all duration-200 pointer-events-auto ${
                    isChannelHeartHovered
                      ? 'opacity-100 scale-100 pointer-events-auto flex flex-col'
                      : 'opacity-0 scale-95 pointer-events-none hidden group-hover/channel-heart-zone:flex group-hover/channel-heart-zone:flex-col group-hover/channel-heart-zone:opacity-100 group-hover/channel-heart-zone:scale-100 group-hover/channel-heart-zone:pointer-events-auto'
                  }`}
                  id="tiktok-heart-hover-emoji-glossary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* 🌐 Traductor a Inglés en el Glosario de Emojis (solicitado sobre captura image.png) */}
                  <div className="flex items-center justify-between px-1 pb-2 mb-1.5 border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="text-[10px] font-black uppercase text-slate-200 tracking-wider">
                        {isEmojiEnglish ? 'ENGLISH TRANSLATOR' : 'TRADUCTOR A INGLÉS'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEmojiEnglish(prev => !prev);
                      }}
                      className="px-2 py-0.5 rounded-full text-[9px] font-black border transition active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/40"
                      title="Activar o desactivar traductor a inglés"
                    >
                      <span className="text-[10px]">🌐</span>
                      <span>{isEmojiEnglish ? 'EN ✓' : 'Inglés'}</span>
                    </button>
                  </div>

                  {/* Rejilla de 30 emojis (6 columnas x 5 filas) idéntica a la captura image.png */}
                  <div className="grid grid-cols-6 gap-1 w-full justify-items-center">
                    {TIKTOK_HEART_HOVER_EMOJIS.map((emoji) => {
                      const englishName = EMOJI_ENGLISH_NAMES[emoji] || emoji;
                      return (
                        <button
                          key={emoji}
                          type="button"
                          onMouseEnter={() => setHoveredEmojiName(englishName)}
                          onMouseLeave={() => setHoveredEmojiName(null)}
                          onClick={(e) => {
                            e.stopPropagation();
                            currentVid.isLiked = true;
                            setChannelVideoLikesMap(prev => {
                              const cur = prev[currentVid.id] || { count: currentVid.likes || 120, userLiked: false };
                              return {
                                ...prev,
                                [currentVid.id]: {
                                  count: cur.userLiked ? cur.count : cur.count + 1,
                                  userLiked: true
                                }
                              };
                            });
                            window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                              detail: { emoji, icon: emoji, pureEmoji: true, x: e.clientX, y: e.clientY }
                            }));
                            triggerContinuousRain(emoji);
                            setIsChannelHeartHovered(false);
                          }}
                          className="w-9 h-9 min-w-9 min-h-9 text-[22px] sm:text-[24px] flex items-center justify-center hover:scale-125 active:scale-90 hover:bg-white/15 rounded-xl transition-all transform cursor-pointer bg-transparent border-0 select-none shrink-0"
                          title={isEmojiEnglish ? `${emoji} ${englishName} (English)` : `Reaccionar con ${emoji}`}
                        >
                          {emoji}
                        </button>
                      );
                    })}
                  </div>

                  {/* Pie informativo de traducción activa */}
                  <div className="mt-1.5 pt-1.5 border-t border-white/10 px-1 flex items-center justify-between text-[9px] text-slate-300 font-mono">
                    <span className="truncate text-rose-300 font-bold">
                      {hoveredEmojiName ? `English: ${hoveredEmojiName}` : isEmojiEnglish ? 'Traducido a Inglés ✓' : 'Traductor disponible'}
                    </span>
                    <span className="text-[8px] text-slate-400 uppercase font-black">30 Emojis</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleChannelVideoLike(currentVid);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-75 cursor-pointer backdrop-blur-md ${
                    likesData.userLiked
                      ? 'bg-[#0b101d]/90 ring-2 ring-[#fe2c55] border-2 border-rose-500 shadow-[0_0_20px_rgba(254,44,85,0.85)] scale-105'
                      : 'bg-black/50 hover:bg-black/70 text-white border border-white/20'
                  }`}
                  title={likesData.userLiked ? "¡Marcado con Me Gusta!" : "Me gusta"}
                >
                  <Heart className={`w-5 h-5 ${likesData.userLiked ? 'fill-white text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] animate-heart-beat' : 'text-white'}`} />
                </button>
                <span className={`text-[10.5px] sm:text-xs font-black mt-1 drop-shadow-md ${likesData.userLiked ? 'text-[#fe2c55] font-black' : 'text-white'}`}>
                  {likesData.count > 999 ? `${(likesData.count / 1000).toFixed(1)}K` : likesData.count}
                </span>
              </div>

              {/* Comentarios */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setChannelVideoCommentsOpen(!channelVideoCommentsOpen);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition active:scale-90 cursor-pointer backdrop-blur-md ${
                    channelVideoCommentsOpen
                      ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                      : 'bg-black/50 hover:bg-black/70 text-white border border-white/20'
                  }`}
                  title="Comentarios"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </button>
                <span className="text-[10px] font-black text-white mt-1 drop-shadow-md">
                  {commentsList.length}
                </span>
              </div>

              {/* Compartir */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareChannelVideo(currentVid);
                  }}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center shadow-lg transition active:scale-90 cursor-pointer backdrop-blur-md"
                  title="Compartir enlace de vídeo"
                >
                  <Share2 className="w-4 h-4 text-white" />
                </button>
                <span className="text-[10px] font-bold text-white mt-1 drop-shadow-md">
                  {currentVid.shares || 48}
                </span>
              </div>

              {/* Guardar / Bookmark */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const curFav = !currentVid.isFavorited;
                    currentVid.isFavorited = curFav;
                    setChannelVideoShareToast(curFav ? 'Guardado en tus favoritos 🔖' : 'Eliminado de favoritos');
                    setTimeout(() => setChannelVideoShareToast(null), 2000);
                  }}
                  className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center shadow-lg transition active:scale-90 cursor-pointer backdrop-blur-md"
                  title="Guardar vídeo"
                >
                  <Bookmark className={`w-4 h-4 ${currentVid.isFavorited ? 'fill-amber-400 text-amber-400' : 'text-white'}`} />
                </button>
                <span className="text-[10px] font-bold text-white mt-1 drop-shadow-md">
                  {currentVid.favorites || 112}
                </span>
              </div>

              {/* Spinning Music Disc */}
              <div className="w-9 h-9 rounded-full bg-black/80 border-2 border-slate-700/80 p-1 flex items-center justify-center shadow-xl animate-spin duration-[4000ms] pointer-events-none mt-1">
                <Music className="w-4 h-4 text-[#fe2c55]" />
              </div>
            </div>

            {/* 📝 PANEL DE INFORMACIÓN INFERIOR DEL VÍDEO (Datos del Creador y Descripción) */}
            <div className="relative z-20 w-full mt-auto p-3 sm:p-4 text-white select-none pointer-events-auto pr-16">
              {/* Creator username & verification badge */}
              <div className="flex items-center gap-1.5 mb-1">
                <h4 className="text-xs sm:text-[13px] font-black text-white tracking-tight drop-shadow-md flex items-center gap-1">
                  <span>@{currentVid.username}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#20d5ec] fill-[#20d5ec]/20" />
                </h4>
                <span className="text-[8px] bg-white/20 backdrop-blur-md text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  {getChannelCleanName(currentChannel)}
                </span>
              </div>

              {/* User upload badge if uploaded from z.png */}
              {currentVid.isUserUploaded && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-500/80 to-pink-500/80 text-[8.5px] font-mono font-black uppercase tracking-wider mb-1 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                  <span>Subido desde Casting Live</span>
                </div>
              )}

              {/* Video Caption & Hashtags */}
              <p className="text-[11px] sm:text-xs text-slate-100 font-medium leading-relaxed drop-shadow-md line-clamp-2 mb-1">
                {translatedVideosMap[currentVid.id] 
                  ? getEnglishTranslation(currentVid.description) 
                  : currentVid.description}
              </p>

              {/* 🌐 Traductor a Inglés (solicitado sobre captura image.png) */}
              <div className="flex items-center gap-2 mb-2 select-none">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVideoTranslation(currentVid.id);
                  }}
                  className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-bold text-rose-300 hover:text-white bg-black/50 hover:bg-black/70 px-2.5 py-0.5 rounded-full border border-rose-500/40 hover:border-rose-400 shadow-sm transition-all active:scale-95 cursor-pointer backdrop-blur-md"
                  title="Traducir descripción a inglés"
                >
                  <Globe className="w-3 h-3 text-rose-400" />
                  <span>{translatedVideosMap[currentVid.id] ? 'Ver original (Español)' : 'Traducir a Inglés'}</span>
                </button>
                {translatedVideosMap[currentVid.id] && (
                  <span className="text-[8.5px] text-emerald-400 font-mono font-bold flex items-center gap-1 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    <span>✓</span> En inglés
                  </span>
                )}
              </div>

              {/* Music Marquee */}
              <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-slate-300 drop-shadow-md">
                <Music className="w-3 h-3 text-rose-400 shrink-0" />
                <span className="truncate max-w-[200px]">{currentVid.music || 'Música Original - Fashion Finances Studio'}</span>
              </div>
            </div>

            {/* 🔴 Horizontal Progress scrubber line at bottom */}
            <div className="w-full bg-white/20 h-1 overflow-hidden relative z-30 shrink-0 cursor-pointer">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-[#fe2c55] transition-all duration-150"
                style={{ width: `${Math.min(100, Math.max(0, channelVideoProgress))}%` }}
              />
            </div>

            {/* 💬 Slide-up Comments Drawer (Fondo blanco y comentarios comenzando por abajo) */}
            {channelVideoCommentsOpen && (
              <div
                className="absolute inset-x-0 bottom-0 top-1/3 z-50 bg-white rounded-t-3xl border-t border-slate-200/90 shadow-[0_-15px_45px_rgba(0,0,0,0.35)] flex flex-col p-3.5 text-slate-900 animate-slide-up-tiktok pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header con título COMENTARIOS y botón cerrar */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                      COMENTARIOS ({commentsList.length})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setChannelVideoCommentsOpen(false)}
                    className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition cursor-pointer active:scale-95"
                    title="Cerrar comentarios"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                {/* List of comments - Comienzan por abajo del recuadro */}
                <div className="flex-1 overflow-y-auto py-2 scrollbar-none pr-1 flex flex-col select-text">
                  {commentsList.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs mt-auto">
                      Sé el primero en comentar este vídeo de {getChannelCleanName(currentChannel)}.
                    </div>
                  ) : (
                    <div className="mt-auto space-y-2.5">
                      {commentsList.map((c: any) => (
                        <div key={c.id} className="flex items-start gap-2.5 text-left">
                          <img
                            src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                            alt={c.user}
                            className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 shadow-2xs mt-0.5"
                          />
                          <div className="flex-1 min-w-0 bg-slate-50 hover:bg-slate-100/90 p-2.5 rounded-2xl border border-slate-200/80 shadow-3xs transition">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-[11px] font-black text-rose-600 truncate">{c.user}</span>
                              <span className="text-[9px] text-slate-400 font-mono shrink-0">{c.date}</span>
                            </div>
                            <p className="text-[11px] text-slate-800 break-words leading-snug font-medium">{c.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Input box */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2 shrink-0">
                  <input
                    type="text"
                    value={channelVideoNewComment}
                    onChange={(e) => setChannelVideoNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChannelVideoComment(currentVid);
                      }
                    }}
                    placeholder="Añadir comentario..."
                    className="flex-1 bg-slate-100 border border-slate-200 text-slate-900 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-500/20 placeholder:text-slate-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddChannelVideoComment(currentVid)}
                    disabled={!channelVideoNewComment.trim()}
                    className="p-2.5 bg-gradient-to-r from-rose-600 to-[#fe2c55] hover:from-rose-500 hover:to-pink-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white font-bold transition active:scale-95 cursor-pointer shadow-md shrink-0 flex items-center justify-center"
                    title="Publicar comentario"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Toast feedback for copying link */}
            {channelVideoShareToast && (
              <div className="absolute top-16 inset-x-4 z-50 bg-[#0d121f]/95 text-white px-3 py-2 rounded-xl border border-rose-500/80 shadow-2xl flex items-center justify-center gap-2 animate-fade-in text-xs font-bold pointer-events-none">
                <span>{channelVideoShareToast}</span>
              </div>
            )}
          </div>

          {/* 🧭 NAVEGADOR VERTICAL DE VÍDEOS EN PANTALLAS GRANDES (Oculto en móvil y tablet) */}
          <div
            className="hidden lg:flex absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-[180] flex-col items-center gap-2 bg-[#0e1628]/95 backdrop-blur-xl border border-slate-700/80 p-1.5 py-3 rounded-[24px] shadow-2xl select-none animate-fade-in pointer-events-auto shrink-0"
            id="floating-channel-videos-navigator"
          >
            <button
              type="button"
              disabled={activeChannelVideoIdx <= 0}
              onClick={(e) => {
                e.stopPropagation();
                handlePrevChannelVideo();
              }}
              className="w-8 h-8 rounded-full bg-[#1b2537] hover:bg-[#253248] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition active:scale-90 cursor-pointer shadow-sm border border-slate-700/60 shrink-0"
              title="Vídeo anterior (desplazar arriba)"
            >
              <ChevronUp className="w-4 h-4 text-white stroke-[2.5]" />
            </button>

            <div className="flex flex-col items-center py-1 text-center select-none shrink-0">
              <span className="text-[7.5px] font-black uppercase text-slate-300 tracking-wider">VÍDEO</span>
              <span className="text-xs sm:text-[13px] font-black font-mono text-[#fe2c55]">
                {activeChannelVideoIdx + 1}/{videos.length}
              </span>
            </div>

            <button
              type="button"
              disabled={activeChannelVideoIdx >= videos.length - 1}
              onClick={(e) => {
                e.stopPropagation();
                handleNextChannelVideo();
              }}
              className="w-8 h-8 rounded-full bg-[#1b2537] hover:bg-[#253248] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition active:scale-90 cursor-pointer shadow-sm border border-slate-700/60 shrink-0"
              title="Siguiente vídeo (desplazar abajo)"
            >
              <ChevronDown className="w-4 h-4 text-white stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* 📺 Toast flotante que confirma el cambio de canal en el centro del canal */}
      {channelToastMessage && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none p-4 select-none">
          <div className="bg-[#0d121f]/95 backdrop-blur-xl text-white px-5 py-3 rounded-2xl border-2 border-rose-500 shadow-2xl shadow-rose-950/60 flex items-center justify-center gap-2.5 pointer-events-none animate-fade-in font-sans max-w-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span className="text-xs sm:text-sm font-black tracking-wide">{channelToastMessage}</span>
          </div>
        </div>
      )}

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
                filter: 'drop-shadow(0 0 16px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 28px rgba(254, 44, 85, 0.9)) brightness(1.25) contrast(1.15)',
                textShadow: '0 0 18px rgba(255, 255, 255, 0.9), 0 0 32px rgba(254, 44, 85, 0.85)',
                WebkitFontSmoothing: 'antialiased',
                transform: 'translateZ(0)',
              }}
            >
              {heart.emoji}
            </div>
          ))}
        </div>
      )}

      {/* 📱 TIKTOK VERTICAL SNAP SCROLL FEED (Desplazamiento vertical entre Rondas de Financiación como en z.png) */}
      <div
        ref={feedContainerRef}
        onScroll={handleScroll}
        onWheel={handleWheelFeed}
        onTouchStart={handleTouchStartFeed}
        onTouchEnd={handleTouchEndFeed}
        onMouseDown={handleMouseDownFeed}
        onMouseMove={handleMouseMoveFeed}
        onMouseUp={handleMouseUpFeed}
        onMouseLeave={handleMouseUpFeed}
        id="tiktok-rounds-vertical-feed"
        className="w-full max-w-full h-full max-md:h-[100dvh] sm:h-[calc(100dvh-20px)] overflow-x-hidden overflow-y-hidden md:overflow-y-auto md:snap-y md:snap-mandatory scroll-smooth py-0 sm:py-0.5 flex flex-col items-center select-none overscroll-contain touch-pan-y cursor-grab active:cursor-grabbing scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative"
      >
        {currentChannel !== 'Finanzas' ? (
          renderMultimediaChannelVideoFeed()
        ) : (
          activeSessionsOnly.map((session, index) => {
          const roundRef = getFinanzasRoundRef(session, index);
          const roundTitle = getRoundTitle(session, index);
          const feeInfo = getSessionFeeInfo(session);
          const presenter = getSessionPresenter(session, index);
          const participants = getSessionParticipants(session);
          const isUserEnrolledInThisRound = Boolean(
            userPaidSessions[session.id] ||
            (typeof window !== 'undefined' && localStorage.getItem(`user_paid_session_${session.id}`) === 'true')
          );
          // Comprobar si el usuario está participando en esta ronda o en cualquier otra ronda/sesión
          const isUserParticipating = Boolean(
            isUserEnrolledInThisRound ||
            userPaidSessions[session.id] ||
            (typeof window !== 'undefined' && (
              localStorage.getItem(`user_paid_session_${session.id}`) === 'true' ||
              localStorage.getItem('finanzas_user_is_participating') === 'true' ||
              Object.keys(localStorage).some(k => k.startsWith('user_paid_session_') && localStorage.getItem(k) === 'true')
            )) ||
            Object.values(userPaidSessions).some(Boolean) ||
            participants.some(p => p.isSelf || p.id === 'user-adriana' || p.id === 'user' || p.name?.toLowerCase().includes('adriana'))
          );
          const isCurrentlyActiveRound = index === activeFinanzasSessionIndex;
          const likesData = likesMap[session.id] || { count: 43200, userLiked: false };
          const savesData = savesMap[session.id] || { count: 592, userSaved: false };
          const isCommentsOpenForThisSession = activeCommentsSessionId === session.id;
          const sessionComments = sessionCommentsMap[session.id] || INITIAL_COMMENTS_MAP['sess-trabajadores-1'] || [];
          const commentsCount = Math.max(1, (commentsCountMap[session.id] || 17) + (sessionComments.length - (INITIAL_COMMENTS_MAP[session.id]?.length || 4)));
          const sharesCount = sharesCountMap[session.id] || 726;

          // Timer calculation (5 min exposition vs 10 min voting)
          // 🛑 CADA RONDA ES ESTRICTAMENTE INDEPENDIENTE DE LA OTRA
          const isSessionInVoting = isSessionInVotingPhase(session.id);
          const currentVotingSecs = isSessionInVoting
            ? (sessionVotingTimerMap[session.id] !== undefined
                ? sessionVotingTimerMap[session.id]
                : getPersistentVotingRemainingSeconds(session.id))
            : (sessionVotingTimerMap[session.id] ?? 600);
          const vMin = Math.floor(Math.max(0, currentVotingSecs) / 60).toString().padStart(2, '0');
          const vSec = (Math.max(0, currentVotingSecs) % 60).toString().padStart(2, '0');
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
              className="snap-center snap-always shrink-0 flex items-center justify-center w-full max-w-full sm:max-w-[580px] my-0 py-0 sm:py-0.5 relative px-0 sm:px-2 overflow-x-hidden h-full max-md:h-[100dvh] min-h-[calc(100dvh-20px)]"
            >
              {/* 📦 Relative anchor for the channel card and its external right-side navigator */}
              <div className="relative flex items-center justify-center w-full max-w-[430px] md:max-w-[440px] overflow-x-hidden lg:overflow-x-visible h-full max-md:h-[100dvh]">
                {/* 🎴 THE MAIN ROUND CONTAINER CARD (Strictly matching z.png) */}
                <div 
                  className="w-full max-w-full sm:max-w-[420px] md:max-w-[430px] h-full max-md:h-[100dvh] sm:h-[calc(100dvh-20px)] sm:max-h-[820px] bg-[#070b14] border-0 sm:border border-black rounded-none sm:rounded-[36px] md:rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden relative flex flex-col justify-between px-1.5 xs:px-2 sm:px-3 pt-1 xs:pt-1.5 sm:pt-2 pb-1.5 xs:pb-2 sm:pb-2.5 box-border select-none"
                  id={`round-container-box-${session.id}`}
                >
                {/* 📱 Subtle top speaker notch matching z.png */}
                <div className="w-16 h-1 bg-white/20 rounded-full mx-auto mb-0.5 opacity-60 shrink-0 pointer-events-none" />
                {/* 🎯 ZONA SUPERIOR DE ACTIVACIÓN POR HOVER (Por arriba del todo de esta página y por encima de Ronda en Curso) - DESACTIVADA DURANTE LA VOTACIÓN FINAL */}
                {!isSessionInVoting && (
                  <div 
                    className="absolute top-0 inset-x-0 h-24 sm:h-28 z-40 pointer-events-auto cursor-pointer flex justify-center items-start pt-2 group/top-margin-sensor select-none"
                    onMouseEnter={() => handleMouseEnterRonda(session.id)}
                    onMouseLeave={handleMouseLeaveRonda}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveChannelsMenuSessionId(prev => prev === session.id ? null : session.id);
                    }}
                    id={`top-hover-trigger-zone-${session.id}`}
                    title="Pasa el puntero por la parte superior para desplegar las opciones de los canales"
                  >
                    <div className="w-16 sm:w-20 h-1.5 bg-white/40 group-hover/top-margin-sensor:bg-white/80 group-hover/top-margin-sensor:scale-105 rounded-full transition-all duration-300 pointer-events-none opacity-80" />
                  </div>
                )}
                {/* 🗳️ VENTANA DE VOTACIÓN DENTRO DEL CANAL EN PANTALLA COMPLETA (captura image.png) */}
                {showVotingProjectsModal && isCurrentlyActiveRound && (
                  <div 
                    className="absolute inset-0 z-[200] bg-white w-full h-full rounded-[40px] sm:rounded-[48px] overflow-hidden flex flex-col shadow-2xl animate-fade-in text-slate-800 font-sans pointer-events-auto"
                    id={`voting-projects-in-channel-fullscreen-${session.id}`}
                    onWheel={(e) => {
                      e.stopPropagation();
                      const container = document.getElementById('voting-projects-scrollable-container');
                      if (container) {
                        container.scrollTop += e.deltaY;
                      }
                    }}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                  >
                    {renderVotingProjectsContent ? (
                      renderVotingProjectsContent()
                    ) : null}
                  </div>
                )}

                {/* 📊 ESCRUTINIO DESCENTRALIZADO (captura imagen.png) EN EL MISMO DISEÑO Y FORMATO DE za.png */}
                {showFinanzasRecount && isCurrentlyActiveRound && (!completedSessionToDisplay?.id || completedSessionToDisplay.id === session.id) && (
                  <div 
                    className="absolute inset-0 z-[130] bg-[#070b14] w-full h-full rounded-[40px] sm:rounded-[48px] overflow-hidden flex flex-col shadow-2xl animate-fade-in text-white font-sans pointer-events-auto"
                    id={`finanzas-recount-in-channel-${session.id}`}
                    onWheel={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {renderFinanzasRecountContent ? (
                      renderFinanzasRecountContent()
                    ) : null}
                  </div>
                )}

                {/* 🏆 RESULTADOS FINALES (captura zr.png) EN EL MISMO DISEÑO Y FORMATO DE za.png */}
                {showFinanzasResults && isCurrentlyActiveRound && (!completedSessionToDisplay?.id || completedSessionToDisplay.id === session.id) && (
                  <div 
                    className="absolute inset-0 z-[140] bg-[#070b14] w-full h-full max-h-full rounded-[40px] sm:rounded-[48px] overflow-hidden flex flex-col min-h-0 shadow-2xl animate-fade-in text-white font-sans pointer-events-auto"
                    id={`finanzas-results-in-channel-${session.id}`}
                    onWheel={(e) => {
                      e.stopPropagation();
                      const wrapper = document.getElementById('podium-scrollable-content-wrapper');
                      if (wrapper && !e.target.closest('#podium-scrollable-content-wrapper')) {
                        wrapper.scrollBy({ top: e.deltaY, behavior: 'auto' });
                      }
                    }}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {renderFinanzasResultsContent ? (
                      renderFinanzasResultsContent()
                    ) : null}
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

                {/* 👥 10 VENTANAS DE LOS PARTICIPANTES EN VIVO (Strictly matching captura z.png) */}
                {showTenWindowsVotingLive && isCurrentlyActiveRound && (
                  <div 
                    className="absolute inset-0 z-[230] bg-[#070b14] w-full h-full rounded-[40px] sm:rounded-[48px] overflow-hidden flex flex-col shadow-2xl animate-fade-in text-white font-sans pointer-events-auto select-none"
                    id={`ten-windows-live-modal-${session.id}`}
                  >
                    {/* 🔝 CABECERA SUPERIOR DE 10 VENTANAS (con botón X para volver a image.png) */}
                    <div className="relative z-30 w-full pt-3.5 pb-2.5 px-3 sm:px-4 flex items-center justify-between border-b border-slate-800/90 bg-[#070b14] shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="bg-red-600 text-white text-[9px] sm:text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          10 VENTANAS EN VIVO
                        </span>
                        <span className="bg-slate-900 border border-slate-700/80 text-emerald-400 font-mono text-[9.5px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg shadow-inner">
                          ⏱️ {displayVotingTimer}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowTenWindowsVotingLive(false)}
                        className="w-8 h-8 rounded-full bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-white flex items-center justify-center transition cursor-pointer border border-slate-700 shadow-md shrink-0"
                        title="Cerrar y volver a la página de votación (image.png)"
                        id={`btn-close-ten-windows-${session.id}`}
                      >
                        <X className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* 👥 GRID DE 10 VENTANAS EN 2 COLUMNAS (Aspecto y tamaño mejorados idéntico a z.png) */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-2.5 grid grid-cols-2 gap-2 sm:gap-2.5 w-full pb-6">
                      {getTenVotingLiveParticipants(session).map((u, i) => {
                        const isSelfUser = Boolean(isUserEnrolledInThisRound && (u.isSelf || u.id === userProfile?.id || u.name?.includes('(Tú)')));
                        return (
                          <div
                            key={u.id || i}
                            onClick={() => {
                              const clickedUser = {
                                id: u.id,
                                name: u.name,
                                username: (u as any).username || u.name?.toLowerCase().replace(/\s+/g, '_'),
                                avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
                                role: u.role || 'Participante',
                                isSelf: isSelfUser,
                                isHost: i === 0 && isUserEnrolledInThisRound
                              };
                              if (setEnlargedWindowUser) {
                                setEnlargedWindowUser(clickedUser);
                              }
                              if (setSelectedFinanzasUser) setSelectedFinanzasUser(clickedUser);
                              if (setActiveFinanzasPopupUser) setActiveFinanzasPopupUser(clickedUser);
                              if (setDetailProjectUser) setDetailProjectUser(clickedUser);

                              // Si se pulsa en la ventana de Alessia Vance, abrir directamente su retransmisión de 5 minutos en directo
                              if (clickedUser.name?.includes('Alessia') || i === 0) {
                                setShowTenWindowsVotingLive(false);
                                setLocalCameraFullscreenOverride(true);
                                if (setIsWatchingPresenterCamera) setIsWatchingPresenterCamera(true);
                                if (setIsPresenterCameraFullscreen) setIsPresenterCameraFullscreen(true);
                                resumeOrStartLucasSpeech();
                              }
                            }}
                            className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-purple-400/80 bg-slate-900 shadow-2xl group transition cursor-pointer aspect-[9/13.5] min-h-[250px] sm:min-h-[285px] flex flex-col justify-between"
                            id={`voting-user-window-${i + 1}`}
                          >
                            {/* Live Media Content */}
                            <div className="relative w-full h-full bg-slate-950 overflow-hidden">
                              {isSelfUser && userLiveMediaStream ? (
                                <LiveUserStreamVideo 
                                  stream={userLiveMediaStream} 
                                  facingMode={liveCameraFacingMode} 
                                />
                              ) : (
                                <>
                                  {(i === 0 || u.name?.includes('Alessia')) && (
                                    <video
                                      src={getParticipantLiveCameraVideo(u)}
                                      autoPlay
                                      loop
                                      playsInline
                                      muted
                                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                  )}
                                  <img
                                    src={u.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=650'}
                                    alt={u.name}
                                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${(i === 0 || u.name?.includes('Alessia')) ? '-z-1 opacity-0' : ''}`}
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      e.currentTarget.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=650';
                                    }}
                                  />
                                </>
                              )}

                              {/* Badge EN VIVO (Strictly matching z.png) */}
                              <div className="absolute top-2.5 left-2.5 z-20">
                                <span className="bg-[#0b101c]/85 backdrop-blur-md text-[7.5px] sm:text-[8px] font-black text-emerald-400 px-2 py-0.5 rounded-md flex items-center gap-1.5 border border-emerald-500/40 leading-none shadow-md">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                                  EN VIVO
                                </span>
                              </div>

                              {/* Bottom Info Bar (Strictly matching z.png) */}
                              <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-10 pb-2.5 px-2.5 sm:px-3 flex flex-col justify-end">
                                <p className="text-xs sm:text-[13px] font-black text-white truncate leading-tight drop-shadow-sm">{u.name}</p>
                                <p className="text-[8.5px] sm:text-[9.5px] text-purple-300 font-semibold truncate leading-none mt-1 flex items-center gap-1.5 drop-shadow-xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block shrink-0" />
                                  <span>{u.role}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 🪟 VENTANA EN GRANDE DEL PARTICIPANTE CON COMENTARIOS Y REGALOS EN VIVO */}
                {enlargedWindowUser && isCurrentlyActiveRound && renderEnlargedParticipantWindow && (
                  <div 
                    className="absolute inset-0 z-[260] bg-[#070b14] w-full h-full rounded-[40px] sm:rounded-[48px] overflow-hidden flex flex-col shadow-2xl animate-fade-in text-white font-sans pointer-events-auto"
                    id={`enlarged-window-in-channel-${session.id}`}
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setActiveChannelsMenuSessionId(null);
                    }}
                  >
                    {renderEnlargedParticipantWindow()}
                  </div>
                )}

                {/* 🎥 LIVE EXPOSITION OVERLAY DENTRO DEL CANAL (captura image.png) */}
                {effectiveCameraFullscreen && isCurrentlyActiveRound && (
                  <div 
                    className="absolute inset-0 z-[150] bg-black w-full h-full rounded-[40px] sm:rounded-[48px] overflow-hidden flex flex-col justify-between select-none animate-fade-in pointer-events-auto"
                    id={`live-exposition-in-channel-${session.id}`}
                  >
                    {/* 🎯 ZONA SUPERIOR DE ACTIVACIÓN POR HOVER (Por arriba del todo de esta página) */}
                    {!enlargedWindowUser && (
                      <div 
                        className="absolute top-0 inset-x-0 h-24 sm:h-28 z-40 pointer-events-auto cursor-pointer flex justify-center items-start pt-2 group/top-margin-sensor select-none"
                        onMouseEnter={() => handleMouseEnterRonda(session.id)}
                        onMouseLeave={handleMouseLeaveRonda}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveChannelsMenuSessionId(prev => prev === session.id ? null : session.id);
                        }}
                        title="Pasa el puntero por la parte superior para desplegar las opciones de los canales"
                      >
                        <div className="w-16 sm:w-20 h-1.5 bg-white/40 group-hover/top-margin-sensor:bg-white/80 group-hover/top-margin-sensor:scale-105 rounded-full transition-all duration-300 pointer-events-none opacity-80" />
                      </div>
                    )}

                    {/* Background Live Media: Single vs Split with 1 Guest (50/50) vs Split with 2 Guests (Trío) */}
                    {(() => {
                      const allAvailableGuests = [
                        ...FINANZAS_USERS,
                        ...TRABAJADORES_USERS.filter(tu => !FINANZAS_USERS.some(fu => fu.id === tu.id || fu.name === tu.name))
                      ];
                      const activeInvitedList = allAvailableGuests.filter(u => invitedUsersMap[u.id]);
                      const isSplit3Active = isScreenSharingActive && (screenSplitLayout === 'grid-3' || activeInvitedList.length >= 2);
                      const isSplit2Active = isScreenSharingActive && !isSplit3Active && (screenSplitLayout === '50-50' || activeInvitedList.length === 1);
                      const guest1 = activeInvitedList[0] || FINANZAS_USERS[0];
                      const guest2 = activeInvitedList[1] || FINANZAS_USERS[1];

                      if (isSplit2Active) {
                        return (
                          <div className="absolute inset-0 w-full h-full grid grid-cols-2 gap-2 p-2 pt-16 pb-36 z-0 bg-[#070b14] overflow-hidden animate-fade-in">
                            {/* Stream 1: Presentador / Anfitrión */}
                            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-rose-500/80 bg-slate-950 flex flex-col justify-between p-2 shadow-2xl">
                              <video
                                ref={liveVideoRef}
                                src={getParticipantLiveCameraVideo(presenter)}
                                onError={(e) => { e.currentTarget.src = '/hero_video.mp4'; }}
                                autoPlay
                                loop
                                playsInline
                                muted={!isPresenterLiveMicActive || isPresenterCameraAudioMuted || !isBroadcastMicOn || isMuted || channelVolume === 0}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="relative z-10 flex items-center justify-between">
                                <span className="bg-rose-600 text-white font-black text-[8px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  <span>ANFITRIÓN</span>
                                </span>
                                <span className="bg-black/70 backdrop-blur-md text-slate-200 text-[8px] font-mono px-1.5 py-0.5 rounded">
                                  En vivo
                                </span>
                              </div>
                              <div className="relative z-10 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[9.5px] sm:text-[10px] font-black text-rose-300 uppercase tracking-wider w-max border border-rose-500/40 truncate max-w-full">
                                👤 {presenter.name}
                              </div>
                            </div>

                            {/* Stream 2: Invitado 1 */}
                            <div 
                              onClick={() => {
                                if (setEnlargedWindowUser) setEnlargedWindowUser({ ...guest1, role: guest1.role || 'Invitado 1' });
                              }}
                              className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-emerald-500/80 bg-slate-950 flex flex-col justify-between p-2 shadow-2xl cursor-pointer group hover:border-emerald-400 transition"
                              title="Clic para ver en grande"
                            >
                              <video
                                src={getParticipantLiveCameraVideo(guest1)}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                autoPlay
                                loop
                                playsInline
                                muted
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <img
                                src={guest1.avatar}
                                alt={guest1.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650';
                                }}
                              />
                              <div className="relative z-10 flex items-center justify-between">
                                <span className="bg-emerald-600 text-white font-black text-[8px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  <span>🟢 INVITADO 1</span>
                                </span>
                                <span className="bg-black/70 backdrop-blur-md text-emerald-300 text-[8px] font-bold px-1.5 py-0.5 rounded">
                                  Conectado
                                </span>
                              </div>
                              <div className="relative z-10 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[9.5px] sm:text-[10px] font-black text-emerald-300 uppercase tracking-wider w-max border border-emerald-500/40 truncate max-w-full">
                                👥 {guest1.name}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      if (isSplit3Active) {
                        return (
                          <div className="absolute inset-0 w-full h-full grid grid-cols-2 grid-rows-2 gap-2 p-2 pt-16 pb-36 z-0 bg-[#070b14] overflow-hidden animate-fade-in">
                            {/* Stream 1: Presentador / Anfitrión (Arriba, ancho completo) */}
                            <div className="col-span-2 relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-rose-500/80 bg-slate-950 flex flex-col justify-between p-2 shadow-2xl">
                              <video
                                ref={liveVideoRef}
                                src={getParticipantLiveCameraVideo(presenter)}
                                onError={(e) => { e.currentTarget.src = '/hero_video.mp4'; }}
                                autoPlay
                                loop
                                playsInline
                                muted={!isPresenterLiveMicActive || isPresenterCameraAudioMuted || !isBroadcastMicOn || isMuted || channelVolume === 0}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="relative z-10 flex items-center justify-between">
                                <span className="bg-rose-600 text-white font-black text-[8px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  <span>ANFITRIÓN</span>
                                </span>
                                <span className="bg-black/70 backdrop-blur-md text-slate-200 text-[8px] font-mono px-1.5 py-0.5 rounded">
                                  En vivo
                                </span>
                              </div>
                              <div className="relative z-10 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[9.5px] sm:text-[10px] font-black text-rose-300 uppercase tracking-wider w-max border border-rose-500/40 truncate max-w-full">
                                👤 {presenter.name}
                              </div>
                            </div>

                            {/* Stream 2: Invitado 1 */}
                            <div 
                              onClick={() => {
                                if (setEnlargedWindowUser) setEnlargedWindowUser({ ...guest1, role: guest1.role || 'Invitado 1' });
                              }}
                              className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-emerald-500/80 bg-slate-950 flex flex-col justify-between p-2 shadow-2xl cursor-pointer group hover:border-emerald-400 transition"
                              title="Clic para ver en grande"
                            >
                              <video
                                src={getParticipantLiveCameraVideo(guest1)}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                autoPlay
                                loop
                                playsInline
                                muted
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <img
                                src={guest1.avatar}
                                alt={guest1.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650';
                                }}
                              />
                              <div className="relative z-10 flex items-center justify-between">
                                <span className="bg-emerald-600 text-white font-black text-[8px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  <span>🟢 INVITADO 1</span>
                                </span>
                              </div>
                              <div className="relative z-10 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] sm:text-[9.5px] font-black text-emerald-300 uppercase tracking-wider w-max border border-emerald-500/40 truncate max-w-full">
                                👥 {guest1.name}
                              </div>
                            </div>

                            {/* Stream 3: Invitado 2 */}
                            <div 
                              onClick={() => {
                                if (setEnlargedWindowUser) setEnlargedWindowUser({ ...guest2, role: guest2.role || 'Invitado 2' });
                              }}
                              className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-cyan-500/80 bg-slate-950 flex flex-col justify-between p-2 shadow-2xl cursor-pointer group hover:border-cyan-400 transition"
                              title="Clic para ver en grande"
                            >
                              <video
                                src={getParticipantLiveCameraVideo(guest2)}
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                autoPlay
                                loop
                                playsInline
                                muted
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <img
                                src={guest2.avatar}
                                alt={guest2.name}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=650';
                                }}
                              />
                              <div className="relative z-10 flex items-center justify-between">
                                <span className="bg-cyan-600 text-white font-black text-[8px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  <span>🟣 INVITADO 2</span>
                                </span>
                              </div>
                              <div className="relative z-10 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] sm:text-[9.5px] font-black text-cyan-300 uppercase tracking-wider w-max border border-cyan-500/40 truncate max-w-full">
                                👥 {guest2.name}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <>
                          {isPresenter && userLiveMediaStream ? (
                            <LiveUserStreamVideo
                              stream={userLiveMediaStream}
                              facingMode={liveCameraFacingMode}
                              className="absolute inset-0 w-full h-full object-cover z-0"
                            />
                          ) : (
                            <video
                              key={`live-stage-video-${currentChannel}-${presenter.id}`}
                              ref={liveVideoRef}
                              src={getParticipantLiveCameraVideo(presenter)}
                              onError={(e) => { e.currentTarget.src = '/hero_video.mp4'; }}
                              autoPlay
                              loop
                              playsInline
                              muted={!isPresenterLiveMicActive || isPresenterCameraAudioMuted || !isBroadcastMicOn || isMuted || channelVolume === 0}
                              className="absolute inset-0 w-full h-full object-cover z-0"
                            />
                          )}
                          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
                          <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none z-10" />
                        </>
                      );
                    })()}

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

                      {/* Right: Viewers */}
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="flex items-center gap-0.5 bg-black/80 backdrop-blur-md border border-slate-700/80 text-slate-200 px-1.5 py-1 rounded-full text-[8.5px] sm:text-[9.5px] font-black">
                          <Users className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                          <span>1.4K</span>
                        </div>
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
                            onClick={handleStopPresenterLiveCam}
                            className="bg-red-600 hover:bg-red-500 text-white font-black text-[10px] sm:text-[11px] py-2 px-2.5 rounded-xl shadow-lg uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 border border-red-400"
                            id={`btn-stop-presenter-cam-${session.id}`}
                            title="Detener Live y volver a la página de exposición"
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
                        className="absolute inset-x-0 bottom-0 z-50 w-full bg-white rounded-t-3xl border-t border-slate-200/90 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] p-3 sm:p-4 pb-3.5 flex flex-col gap-2 animate-slide-up text-left pointer-events-auto"
                        id={`live-exposition-comments-${session.id}`}
                      >
                        {/* Header con botón para cerrar */}
                        <div className="flex items-center justify-between pb-1 shrink-0 px-1 border-b border-slate-100">
                          <div className="flex items-center gap-1.5 text-left">
                            <MessageCircle className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-[10px] sm:text-[11px] font-black uppercase text-slate-900 tracking-wider">
                              COMENTARIOS ({commentsCount})
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveCommentsSessionId(null);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition active:scale-90"
                            title="Cerrar comentarios"
                            aria-label="Cerrar comentarios"
                          >
                            <X className="w-4 h-4 text-slate-700 stroke-[2.5]" />
                          </button>
                        </div>

                        {/* Scrollable Comments List */}
                        <div className="w-full max-h-[140px] sm:max-h-[160px] overflow-y-auto pr-1 text-left select-text scrollbar-thin scrollbar-thumb-slate-300 flex flex-col">
                          <div className="mt-auto space-y-1.5">
                            {sessionComments.map((comm) => (
                              <div key={comm.id} className="flex items-start gap-2 bg-slate-50 hover:bg-slate-100/80 p-2 rounded-xl border border-slate-200/80 shadow-xs transition">
                                <img
                                  src={comm.userAvatar}
                                  alt={comm.userName}
                                  className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-300 mt-0.5"
                                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'; }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-[10px] font-black text-rose-600 truncate">{comm.userName}</span>
                                    <span className="text-[8px] text-slate-400 shrink-0 font-mono">{comm.timeAgo}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-800 mt-0.5 leading-snug break-words font-medium">
                                    {comm.text}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleToggleCommentLike(session.id, comm.id)}
                                  className={`flex flex-col items-center gap-0.5 p-1 transition cursor-pointer shrink-0 ${
                                    comm.userLiked ? 'text-rose-600 scale-110' : 'text-slate-400 hover:text-rose-500'
                                  }`}
                                  title="Me gusta"
                                >
                                  <Heart className={`w-3 h-3 ${comm.userLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                                  <span className="text-[8px] font-mono text-slate-500 font-bold">{comm.likes}</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Emojis strip - Tap to send directly! */}
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-1.5 shrink-0 bg-slate-100 rounded-full border border-slate-200/90 shadow-xs">
                          <span className="text-[8px] text-amber-600 font-black uppercase tracking-wider pl-1 pr-0.5 shrink-0 flex items-center gap-1">
                            <span>⚡</span>
                            <span>ENVIAR EMOJI:</span>
                          </span>
                          {['💖', '🔥', '👏', '🚀', '💯', '😂', '🤩', '🙌', '💡', '💰', '✨', '👍', '💎', '🎉', '🥂', '👑'].map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => {
                                handleAddSessionComment(session.id, emoji);
                                window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                                  detail: { emoji, icon: emoji, pureEmoji: true }
                                }));
                              }}
                              className="p-1 hover:bg-white hover:shadow-xs rounded-lg transition active:scale-130 hover:scale-110 cursor-pointer text-xs shrink-0 select-none text-slate-800"
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
                          className="relative flex items-center gap-1.5 pt-0.5 shrink-0 w-full"
                        >
                          {/* 📚 Glosario de Emojis que se abre al pulsar en el emoji del bloque */}
                          {renderEmojiGlossary(session.id)}

                          {/* Bloque para escribir con el emoji dentro */}
                          <div className="flex-1 flex items-center bg-slate-100 border border-slate-300 rounded-full pl-2 pr-2.5 py-1 focus-within:border-rose-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-500/20 transition shadow-inner min-w-0">
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
                              className="flex-1 bg-transparent text-[10px] sm:text-[11px] text-slate-900 placeholder-slate-400 focus:outline-none min-w-0 px-1 py-0.5"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={!(commentInputMap[session.id] || '').trim()}
                            className={`p-2 rounded-full transition cursor-pointer shrink-0 flex items-center justify-center ${
                              (commentInputMap[session.id] || '').trim()
                                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md active:scale-95'
                                : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
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
                {/* 🎥 Embedded Live Stream Video Background inside Channel Container */}
                {(() => {
                  const allAvailableGuests = [
                    ...FINANZAS_USERS,
                    ...TRABAJADORES_USERS.filter(tu => !FINANZAS_USERS.some(fu => fu.id === tu.id || fu.name === tu.name))
                  ];
                  const activeInvitedList = allAvailableGuests.filter(u => invitedUsersMap[u.id]);
                  const isSplit3Active = isScreenSharingActive && (screenSplitLayout === 'grid-3' || activeInvitedList.length >= 2);
                  const isSplit2Active = isScreenSharingActive && !isSplit3Active && (screenSplitLayout === '50-50' || activeInvitedList.length === 1);
                  const guest1 = activeInvitedList[0] || FINANZAS_USERS[0];
                  const guest2 = activeInvitedList[1] || FINANZAS_USERS[1];

                  if (isSplit2Active) {
                    return (
                      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[40px] sm:rounded-[48px] grid grid-cols-2 gap-1.5 p-2 pt-14 pb-20 bg-[#070b14] opacity-85">
                        <div className="relative rounded-2xl overflow-hidden border-2 border-rose-500/70 bg-black flex flex-col justify-between p-1.5">
                          <video
                            src={getParticipantLiveCameraVideo(presenter)}
                            onError={(e) => { e.currentTarget.src = '/hero_video.mp4'; }}
                            autoPlay loop playsInline muted
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <span className="relative z-10 bg-rose-600/90 text-white text-[7.5px] font-black uppercase px-1.5 py-0.2 rounded w-max">
                            🔴 Anfitrión
                          </span>
                          <span className="relative z-10 bg-black/80 text-rose-300 text-[8px] font-bold px-1 py-0.2 rounded w-max truncate max-w-full">
                            👤 {presenter.name}
                          </span>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/70 bg-black flex flex-col justify-between p-1.5">
                          <video
                            src={getParticipantLiveCameraVideo(guest1)}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            autoPlay loop playsInline muted
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <img
                            src={guest1.avatar}
                            alt={guest1.name}
                            className="absolute inset-0 w-full h-full object-cover -z-1"
                          />
                          <span className="relative z-10 bg-emerald-600/90 text-white text-[7.5px] font-black uppercase px-1.5 py-0.2 rounded w-max">
                            🟢 Invitado 1
                          </span>
                          <span className="relative z-10 bg-black/80 text-emerald-300 text-[8px] font-bold px-1 py-0.2 rounded w-max truncate max-w-full">
                            👥 {guest1.name}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/70 via-transparent to-[#070b14]/85 pointer-events-none" />
                      </div>
                    );
                  }

                  if (isSplit3Active) {
                    return (
                      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[40px] sm:rounded-[48px] grid grid-cols-2 grid-rows-2 gap-1.5 p-2 pt-14 pb-20 bg-[#070b14] opacity-85">
                        <div className="col-span-2 relative rounded-2xl overflow-hidden border-2 border-rose-500/70 bg-black flex flex-col justify-between p-1.5">
                          <video
                            src={getParticipantLiveCameraVideo(presenter)}
                            onError={(e) => { e.currentTarget.src = '/hero_video.mp4'; }}
                            autoPlay loop playsInline muted
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <span className="relative z-10 bg-rose-600/90 text-white text-[7.5px] font-black uppercase px-1.5 py-0.2 rounded w-max">
                            🔴 Anfitrión
                          </span>
                          <span className="relative z-10 bg-black/80 text-rose-300 text-[8px] font-bold px-1 py-0.2 rounded w-max truncate max-w-full">
                            👤 {presenter.name}
                          </span>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/70 bg-black flex flex-col justify-between p-1.5">
                          <video
                            src={getParticipantLiveCameraVideo(guest1)}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            autoPlay loop playsInline muted
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <img
                            src={guest1.avatar}
                            alt={guest1.name}
                            className="absolute inset-0 w-full h-full object-cover -z-1"
                          />
                          <span className="relative z-10 bg-emerald-600/90 text-white text-[7.5px] font-black uppercase px-1.5 py-0.2 rounded w-max">
                            🟢 Invitado 1
                          </span>
                          <span className="relative z-10 bg-black/80 text-emerald-300 text-[8px] font-bold px-1 py-0.2 rounded w-max truncate max-w-full">
                            👥 {guest1.name}
                          </span>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/70 bg-black flex flex-col justify-between p-1.5">
                          <video
                            src={getParticipantLiveCameraVideo(guest2)}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            autoPlay loop playsInline muted
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <img
                            src={guest2.avatar}
                            alt={guest2.name}
                            className="absolute inset-0 w-full h-full object-cover -z-1"
                          />
                          <span className="relative z-10 bg-cyan-600/90 text-white text-[7.5px] font-black uppercase px-1.5 py-0.2 rounded w-max">
                            🟣 Invitado 2
                          </span>
                          <span className="relative z-10 bg-black/80 text-cyan-300 text-[8px] font-bold px-1 py-0.2 rounded w-max truncate max-w-full">
                            👥 {guest2.name}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/70 via-transparent to-[#070b14]/85 pointer-events-none" />
                      </div>
                    );
                  }

                  return isLiveActive ? (
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-[40px] sm:rounded-[48px]">
                      {isPresenter && userLiveMediaStream ? (
                        <LiveUserStreamVideo
                          stream={userLiveMediaStream}
                          facingMode={liveCameraFacingMode}
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : (
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover opacity-50 transition-opacity duration-700"
                          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#070b14]/80 via-[#070b14]/50 to-[#070b14]/90" />
                    </div>
                  ) : null;
                })()}
                {/* 🔴 TOP BANNER (z.png): RONDA EN CURSO • REF:X */}
                <div 
                  className="w-full flex flex-col items-center justify-center text-center pt-0.5 sm:pt-1 relative z-30 pointer-events-auto shrink-0"
                  onMouseEnter={!isSessionInVoting ? () => handleMouseEnterRonda(session.id) : undefined}
                  onMouseLeave={!isSessionInVoting ? handleMouseLeaveRonda : undefined}
                >
                  {/* Red badge with pulsing dot - hover to open channels menu (desactivado durante votación) */}
                  <button
                    type="button"
                    onMouseEnter={!isSessionInVoting ? () => handleMouseEnterRonda(session.id) : undefined}
                    onMouseLeave={!isSessionInVoting ? handleMouseLeaveRonda : undefined}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSessionInVoting) {
                        toggleChannelsMenu(session.id);
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/50 text-rose-300 px-2.5 py-0.5 rounded-full text-[8px] sm:text-[8.5px] font-black uppercase tracking-wider mb-1 shadow-xs transition-all ${
                      !isSessionInVoting
                        ? 'hover:bg-rose-500/35 hover:border-rose-400 cursor-pointer hover:scale-105 active:scale-95 group/ronda-pill'
                        : 'cursor-default opacity-90'
                    }`}
                    title={!isSessionInVoting ? "Pasa el ratón o pulsa para abrir el menú de opciones" : undefined}
                    id={`ronda-en-curso-pill-${session.id}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                    <span>{isUserEnrolledInThisRound ? 'Ronda en la que estás participando' : `Canal ${getChannelCleanName(currentChannel)} • Ronda en Curso`}</span>
                    {!isSessionInVoting && (
                      <span className="text-[7.5px] text-rose-400 opacity-70 group-hover/ronda-pill:opacity-100 transition-transform group-hover/ronda-pill:translate-y-0.5">▼</span>
                    )}
                  </button>

                  {/* Main Round Title */}
                  <h3 className="text-xs sm:text-[13px] md:text-sm font-black text-white uppercase tracking-wider font-sans drop-shadow-md leading-tight m-0 flex items-center justify-center gap-1.5 flex-wrap">
                    <span>{roundTitle}</span>
                  </h3>

                  {/* Subtitle with accent lines: 10€ Inscripción • 10 Participantes */}
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className="h-0.5 w-5 sm:w-6 bg-gradient-to-r from-transparent via-rose-500 to-[#fe2c55] rounded-full" />
                    <span className="text-[8px] sm:text-[9px] font-bold text-slate-300 font-mono tracking-wider uppercase flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800">
                      <span>{feeInfo.feeShort} Inscripción</span>
                      <span className="text-slate-500">•</span>
                      <span>10 Participantes</span>
                    </span>
                    <span className="h-0.5 w-6 sm:w-8 bg-gradient-to-l from-transparent via-rose-500 to-[#fe2c55] rounded-full" />
                  </div>
                </div>

                {/* 🟢 CENTRAL STAGE CARD (Strictly matching image.png during 5m exposition, and zq.png during 10m voting) */}
                <div 
                  className="w-full bg-[#0e1628]/95 border border-emerald-500/60 rounded-xl sm:rounded-2xl p-1.5 xs:p-2 sm:p-2.5 shadow-[0_16px_48px_rgba(0,0,0,0.85)] flex flex-col items-center text-center my-0.5 xs:my-1 transition-all shrink min-h-0"
                  id={`central-stage-card-${session.id}`}
                >
                  {isSessionInVoting ? (
                    /* 🗳️ 10-MINUTE VOTING STAGE CARD (Strictly matching zq.png) */
                    <div className="w-full flex flex-col items-center animate-fade-in" id={`voting-phase-view-${session.id}`}>
                      {/* Top Pill Badge: • 🗳️ CUENTA ATRÁS • 10 MINUTOS PARA VOTAR */}
                      <div
                        className="inline-flex items-center gap-1.5 bg-[#170e28] border border-rose-500/50 text-rose-200 px-3 py-0.5 rounded-full text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider mb-1.5 shadow-xs select-none"
                        id={`voting-pill-badge-${session.id}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                        <span>🗳️ CUENTA ATRÁS • 10 MINUTOS PARA VOTAR</span>
                      </div>

                      {/* 🔴 RED GLOWING CONTAINER BOX (Strictly matching zq.png) */}
                      <div className="w-full bg-[#0d0714] border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.35)] rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 flex flex-col gap-2 mb-2">
                        {/* Top Row: Left 10 min votación, Center 09:31, Right Ronda 10/10 (10m) */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-left">
                            <span className="text-sm sm:text-base">⏱️</span>
                            <div>
                              <span className="text-[7px] sm:text-[7.5px] text-slate-300 font-black uppercase tracking-wider block">CUENTA ATRÁS</span>
                              <span className="text-[11px] sm:text-[12px] text-white font-black block leading-none">10 min</span>
                              <span className="text-[8px] text-slate-400 block leading-tight">votación</span>
                            </div>
                          </div>

                          {/* White digital pill timer with bold black font (matching zq.png 09:31) */}
                          <button
                            type="button"
                            onClick={() => {
                              // Fast-forward to 3 seconds for test convenience
                              const activeSessionId = session.id;
                              const now = Date.now();
                              localStorage.setItem(`finanzas_voting_end_time_${activeSessionId}`, String(now + 3 * 1000));
                              localStorage.setItem(`finanzas_active_session_start_${activeSessionId}`, String(now - (3597 * 1000)));
                              localStorage.setItem(`finanzas_voting_phase_timer_${activeSessionId}`, '3');
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
                            className="bg-white hover:bg-slate-100 text-slate-950 font-mono text-xl sm:text-2xl font-black px-4 sm:px-5 py-0.5 sm:py-1 rounded-xl sm:rounded-2xl shadow-md tracking-wider border-0 cursor-pointer select-none transition active:scale-95"
                          >
                            {displayVotingTimer}
                          </button>

                          <div className="text-right shrink-0">
                            <span className="text-[7px] sm:text-[7.5px] text-slate-400 block font-black uppercase tracking-wider">RONDA</span>
                            <span className="font-mono text-emerald-400 font-black text-xs sm:text-sm block leading-tight">10/10</span>
                            <span className="font-mono text-emerald-400 font-bold text-[8.5px] sm:text-[9px] block leading-tight">(10m)</span>
                          </div>
                        </div>

                        {/* Middle Banner: TIENEN 10 MINUTOS PARA VOTAR. */}
                        <div className="w-full bg-[#1e0a14] border border-red-600/80 rounded-full py-1.5 px-3 text-center shadow-inner">
                          <span className="text-white font-black text-xs sm:text-[13px] tracking-wider uppercase drop-shadow-xs">
                            TIENEN 10 MINUTOS PARA VOTAR.
                          </span>
                        </div>

                        {/* Multi-color gradient progress bar (green -> yellow -> red) */}
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(100, Math.max(3, (currentVotingSecs / 600) * 100))}%` }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons: White "📁 VOTAR PROYECTOS" and White "📷 LIVE" (Strictly matching z.png) */}
                      <div className="w-full flex flex-col gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const lucasIdx = participants.findIndex(p => 
                              p.name?.toLowerCase().includes('lucas') || 
                              p.id === 'trab-1' || 
                              p.id === 'lucas' || 
                              p.username?.toLowerCase().includes('lucas')
                            );
                            const targetIdx = lucasIdx !== -1 ? lucasIdx : 0;
                            if (setVotingProjectSlideIndex) {
                              setVotingProjectSlideIndex(targetIdx);
                            }
                            const lucasUser = participants[targetIdx] || participants[0];
                            if (setSelectedFinanzasUser && lucasUser) {
                              setSelectedFinanzasUser(lucasUser);
                            }
                            setSessionSelectedPresenterMap(prev => ({ ...prev, [session.id]: lucasUser }));
                            setShowVotingProjectsModal(true);
                            if (setSystemVoiceNotification) {
                              setSystemVoiceNotification({
                                show: true,
                                message: '🗳️ Abriendo panel de votación: selecciona tu proyecto favorito entre los 10 participantes.'
                              });
                            }
                          }}
                          className="w-full bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-[13px] py-2 sm:py-2.5 px-4 rounded-xl sm:rounded-2xl uppercase tracking-wider transition active:scale-95 shadow-md border border-slate-200 flex items-center justify-center gap-2 cursor-pointer font-sans"
                          id={`btn-votar-proyectos-${session.id}`}
                        >
                          <span className="text-sm">📁</span>
                          <span>VOTAR PROYECTOS</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveFinanzasSessionIndex(index);
                            setShowTenWindowsVotingLive(true);
                            setIsWatchingPresenterCamera(false);
                            setIsPresenterCameraFullscreen(false);
                            setLocalCameraFullscreenOverride(false);
                            stopLucasTorresSpeech();
                            if (onNavigateTo10WindowsLive) {
                              onNavigateTo10WindowsLive();
                            }
                          }}
                          className={`w-full font-black text-xs sm:text-[13px] py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl uppercase tracking-wider transition active:scale-95 shadow-md border flex items-center justify-center gap-2 cursor-pointer ${
                            showTenWindowsVotingLive
                              ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white border-red-400 shadow-[0_0_14px_rgba(239,68,68,0.5)] animate-pulse'
                              : 'bg-white hover:bg-slate-100 text-slate-950 border-slate-200'
                          }`}
                          id={`btn-live-voting-${session.id}`}
                          title="LIVE: Ver las 10 ventanas en vivo de los participantes"
                        >
                          <Camera className="w-3.5 h-3.5 shrink-0 text-current" />
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
                        className="inline-flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/35 active:scale-95 border border-emerald-500/60 text-emerald-300 px-2.5 py-0.5 rounded-full text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider mb-1.5 shadow-xs cursor-pointer transition select-none"
                        id={`btn-turno-badge-${session.id}`}
                      >
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>🔴 TURNO {turnNumber} DE 10 • EN EXPOSICIÓN</span>
                      </button>

                      {/* Presenter Profile Spotlight */}
                      <div className="flex flex-col items-center gap-0.5 mb-0.5 xs:mb-1">
                        <div className="relative">
                          <img
                            src={presenter.avatar}
                            alt={presenter.name}
                            className="w-9 h-9 xs:w-10 xs:h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-emerald-400 shadow-md"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[6.5px] xs:text-[7px] sm:text-[7.5px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider whitespace-nowrap shadow-sm">
                            EN VIVO
                          </span>
                        </div>

                        <h4 className="text-white font-black text-[11.5px] xs:text-xs sm:text-[13px] mt-0.5 tracking-tight leading-tight">
                          {presenter.name}
                        </h4>
                        <span className="text-[8px] xs:text-[8.5px] sm:text-[9px] text-emerald-300 font-bold uppercase tracking-wider">
                          {presenter.role || 'PATRONISTA TEXTIL'}
                        </span>
                        <span className="text-[7px] xs:text-[7.5px] sm:text-[8px] text-slate-400 italic">
                          Exposición de 5 minutos en directo
                        </span>
                        {/* Audio exposition live indicator (Clic para escuchar o reactivar la voz de Alessia Vance / Lucas Torres) */}
                        {(() => {
                          const isAlessiaVoice = presenter.name?.includes('Alessia') || presenter.id === 'f-1';
                          const voicePresenterName = isAlessiaVoice ? 'Alessia Vance' : (presenter.name?.includes('Lucas') ? 'Lucas Torres' : presenter.name);
                          return (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                resumeOrStartLucasSpeech();
                              }}
                              title={`Voz en directo de ${voicePresenterName} activa. Pulsa para escuchar la presentación.`}
                              className={`flex items-center gap-1.5 mt-0.5 px-2.5 py-0.5 rounded-full border text-[7.5px] sm:text-[8px] font-bold shadow-xs transition active:scale-95 cursor-pointer select-none ${
                                isLucasTorresSpeaking
                                  ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                                  : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 ${isLucasTorresSpeaking ? 'animate-ping' : ''}`} />
                              <span className="font-extrabold">{isLucasTorresSpeaking ? `${voicePresenterName} hablando en directo...` : 'Voz en directo conectada'}</span>
                              <span className="flex items-end gap-0.5 h-2 ml-0.5">
                                <span className={`w-0.5 bg-emerald-400 transition-all ${isLucasTorresSpeaking ? 'h-2.5 animate-pulse' : 'h-1'}`} />
                                <span className={`w-0.5 bg-emerald-400 transition-all ${isLucasTorresSpeaking ? 'h-3 animate-pulse delay-75' : 'h-1.5'}`} />
                                <span className={`w-0.5 bg-emerald-400 transition-all ${isLucasTorresSpeaking ? 'h-2 animate-pulse delay-150' : 'h-1'}`} />
                              </span>
                            </button>
                          );
                        })()}
                      </div>
{/* ⏱️ COUNTDOWN TIMER WIDGET (Matching image.png: white digital pill timer) */}
                        <div className="w-full bg-[#070b14] border border-emerald-500/40 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 flex flex-col gap-1 shadow-inner mb-1.5">
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1 text-left">
                              <span className="text-xs sm:text-sm">⏱️</span>
                              <div>
                                <span className="text-[7px] sm:text-[7.5px] text-slate-400 font-black uppercase tracking-wider block">CUENTA ATRÁS</span>
                                <span className="text-[9.5px] sm:text-[10.5px] text-white font-black block leading-none">5 min exposición</span>
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
                              className="bg-white hover:bg-slate-100 text-slate-950 font-mono text-lg sm:text-xl font-black px-3.5 sm:px-4 py-0.5 rounded-xl shadow-md border-0 cursor-pointer transition active:scale-95 select-none"
                            >
                              {formattedTimer}
                            </button>

                            <div className="text-right shrink-0">
                              <span className="text-[6.5px] sm:text-[7px] text-slate-400 block font-black uppercase tracking-wider">RONDA</span>
                              <span className="font-mono text-emerald-400 font-black text-[8.5px] sm:text-[9.5px] block leading-tight">
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
                      <div className="w-full flex flex-col gap-1.5">
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const willBeOn = !isBroadcastMicOn || isMuted;
                              if (toggleBroadcastMic) {
                                toggleBroadcastMic();
                              }
                              if (willBeOn) {
                                resumeOrStartLucasSpeech();
                              } else {
                                stopLucasTorresSpeech();
                              }
                            }}
                            className={`w-full py-1.5 px-2 rounded-xl font-black text-[9.5px] sm:text-[10px] uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center justify-center gap-1 border shadow-md ${
                              isBroadcastMicOn && !isMuted
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            }`}
                            title={isBroadcastMicOn && !isMuted ? "Micrófono encendido: Lucas Torres está hablando. Pulsa para silenciar" : "Micrófono apagado. Pulsa para encender y escuchar a Lucas Torres"}
                          >
                            <Mic className="w-3 h-3 shrink-0 text-white" />
                            <span className="truncate">{isBroadcastMicOn && !isMuted ? 'MICRO ON' : 'MICRO OFF'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handlePresenterFinalize(session, index);
                            }}
                            className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-[9.5px] sm:text-[10px] py-1.5 px-2 rounded-xl shadow-md uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center justify-center gap-1 border border-rose-400/80"
                            id={`btn-finalizar-turno-${session.id}`}
                          >
                            <Square className="w-2.5 h-2.5 fill-white text-white shrink-0" />
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
                                const currentPresenterUser = presenter || FINANZAS_USERS[0];
                                if (setSelectedFinanzasUser) {
                                  setSelectedFinanzasUser(currentPresenterUser);
                                }
                                if (isPresenter) {
                                  handleToggleUserCameraLiveBroadcast();
                                } else {
                                  if (isPresenterCameraFullscreen || isWatchingPresenterCamera) {
                                    setIsPresenterCameraFullscreen(false);
                                    setIsWatchingPresenterCamera(false);
                                    setLocalCameraFullscreenOverride(false);
                                    stopLucasTorresSpeech();
                                  } else {
                                    setLocalCameraFullscreenOverride(true);
                                    setIsWatchingPresenterCamera(true);
                                    setIsPresenterCameraFullscreen(true);
                                    resumeOrStartLucasSpeech();
                                  }
                                }
                              }}
                              className={`w-full py-1.5 px-2.5 rounded-xl font-black text-[9.5px] sm:text-[10px] uppercase tracking-wider transition active:scale-95 cursor-pointer flex items-center justify-center gap-1 border shadow-md ${
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
                                  <Camera className="w-3 h-3 shrink-0 text-white" />
                                  <span>Detener Live</span>
                                </>
                              ) : (
                                <>
                                  <Camera className="w-3 h-3 shrink-0 text-slate-950" />
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
                  className="w-full bg-[#0B0F19]/95 backdrop-blur-md border border-black rounded-xl sm:rounded-3xl p-1.5 xs:p-2 shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col gap-1 sm:gap-1.5 box-border mt-auto shrink-0 pb-1.5 xs:pb-2"
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
                  <div className="grid grid-cols-5 gap-1 sm:gap-1.5 select-none w-full max-w-full mx-auto box-border" id={`finanzas-grid-2x5-${session.id}`}>
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
                          className={`aspect-square min-h-[26px] xs:min-h-[30px] sm:min-h-[44px] rounded-lg xs:rounded-xl sm:rounded-2xl overflow-hidden relative border transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md flex flex-col justify-start p-0.5 sm:p-1 box-border cursor-pointer ${
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

                  {/* Inscription Button: ✍️ Inscribirse en una sesión de (10 Euros) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFinanzasSessionIndex(index);

                      // 1. Guardar en localStorage que el usuario está inscrito
                      try {
                        localStorage.setItem(`user_paid_session_${session.id}`, 'true');
                        localStorage.setItem('finanzas_user_participating', 'true');
                        localStorage.setItem('finanzas_user_is_participating', 'true');
                        localStorage.setItem('finanzas_target_session_id', session.id);
                        localStorage.setItem(`finanzas_is_voting_phase_active_${session.id}`, 'false');
                        localStorage.removeItem('finanzas_is_voting_phase_active');
                      } catch (err) {}

                      // 2. Redirigir inmediatamente a la ventana image.png (fase de exposición de 5 min)
                      setSessionVotingPhaseMap(prev => ({
                        ...prev,
                        [session.id]: false
                      }));
                      setShowTenWindowsVotingLive(false);
                      setLocalCameraFullscreenOverride(false);
                      if (setIsWatchingPresenterCamera) setIsWatchingPresenterCamera(false);
                      if (setIsPresenterCameraFullscreen) setIsPresenterCameraFullscreen(false);

                      // 3. Establecer a Alessia Vance (o primer participante de la lista) como ponente del Turno 1 de 10
                      const firstPresenter = participants[0] || FINANZAS_USERS[0];
                      setSessionSelectedPresenterMap(prev => ({
                        ...prev,
                        [session.id]: firstPresenter
                      }));
                      if (setSelectedFinanzasUser) setSelectedFinanzasUser(firstPresenter);
                      if (setActiveFinanzasPopupUser) setActiveFinanzasPopupUser(firstPresenter);

                      // 4. Temporizador de 5 minutos para la exposición (iniciando en 4:49 / 289s como en image.png)
                      setSessionExpositionTimerMap(prev => ({
                        ...prev,
                        [session.id]: 289
                      }));

                      // 5. Activar voz en directo del ponente
                      if (setIsPresenterCameraAudioMuted) setIsPresenterCameraAudioMuted(false);
                      resumeOrStartLucasSpeech();

                      // 6. Cerrar modales y paneles superpuestos para mostrar directamente image.png
                      setShowVotingProjectsModal(false);
                      setShowFinanzasInscriptionInChannel(false);
                      setShowProjectDetailsInPopup(false);
                      setDetailProjectUser(null);
                      if (setShowFinanzasResults) setShowFinanzasResults(false);
                      if (setShowFinanzasRecount) setShowFinanzasRecount(false);
                      if (setShowParticipantsGatheringModal) setShowParticipantsGatheringModal(false);

                      // 7. Notificar al componente padre para procesar inscripción y pago
                      if (onExecutePaymentAndJoinSession) {
                        onExecutePaymentAndJoinSession(session);
                      }

                      if (setSystemVoiceNotification) {
                        setSystemVoiceNotification({
                          show: true,
                          message: '🎉 ¡Inscripción confirmada (10€)! Estás dentro de la ronda. Turno 1 de 10: Alessia Vance (5 min de exposición).'
                        });
                      }
                    }}
                    className={`w-full font-black text-[10.5px] xs:text-[11px] sm:text-[12px] py-1.5 sm:py-2 px-3 sm:px-4 rounded-full border shadow-md flex items-center justify-center gap-1.5 sm:gap-2 font-sans transition shrink-0 ${
                      isUserParticipating
                        ? 'cursor-default active:scale-100 select-none'
                        : 'cursor-pointer active:scale-95'
                    } ${
                      isUserEnrolledInThisRound
                        ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:via-rose-500 hover:to-red-500 text-white border-red-400 shadow-[0_0_22px_rgba(239,68,68,0.7)] ring-2 ring-red-400/80 ring-offset-2 ring-offset-[#070b14]'
                        : 'bg-gradient-to-r from-[#FFD1DC] via-[#FCC2D0] to-[#F8B4C4] hover:from-[#FCC2D0] hover:to-[#F5A3B7] text-[#3D1422] border-[#F4A8B9]'
                    }`}
                    id={`btn-inscribirse-ronda-${session.id}`}
                    title={isUserParticipating ? "Ya estás participando en una ronda o sesión activa" : `Inscribirse en una sesión de (${feeInfo.feeInWords})`}
                    aria-disabled={isUserParticipating}
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
                      const lucasIdx = participants.findIndex(p => 
                        p.name?.toLowerCase().includes('lucas') || 
                        p.id === 'trab-1' || 
                        p.id === 'lucas' || 
                        p.username?.toLowerCase().includes('lucas')
                      );
                      const targetIdx = lucasIdx !== -1 ? lucasIdx : 0;
                      if (setVotingProjectSlideIndex) {
                        setVotingProjectSlideIndex(targetIdx);
                      }
                      const lucasUser = participants[targetIdx] || participants[0];
                      if (setSelectedFinanzasUser && lucasUser) {
                        setSelectedFinanzasUser(lucasUser);
                      }
                      if (session.id === 'sess-trabajadores-1' || session.reference === 'REF: 1') {
                        setSessionSelectedPresenterMap(prev => ({
                          ...prev,
                          [session.id]: {
                            id: 'trab-10',
                            name: 'Marina Serrano',
                            role: 'PATRONISTA SOSTENIBLE',
                            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
                            username: 'marina_serrano_mod'
                          }
                        }));
                      } else {
                        setSessionSelectedPresenterMap(prev => ({ ...prev, [session.id]: lucasUser }));
                      }
                      setShowFinanzasInscriptionInChannel(false);
                      setShowProjectDetailsInPopup(false);
                      setDetailProjectUser(null);
                      setActiveFinanzasPopupUser(null);
                      if (setShowFinanzasResults) setShowFinanzasResults(false);
                      if (setShowFinanzasRecount) setShowFinanzasRecount(false);
                      setShowVotingProjectsModal(true);
                    }}
                    className="w-full bg-white hover:bg-slate-100 text-slate-950 font-black text-[10.5px] xs:text-[11px] sm:text-[12px] py-1.5 sm:py-2 px-3 sm:px-4 rounded-full border border-slate-200 shadow-md flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer uppercase tracking-wider font-sans transition active:scale-95 shrink-0 mb-0.5 sm:mb-1"
                    id={`btn-ver-proyectos-ronda-${session.id}`}
                  >
                    <span className="text-base shrink-0">📋</span>
                    <span className="font-black">VER PROYECTOS</span>
                  </button>
                </div>
              
                {/* 💬 COMENTARIOS DE USUARIOS Y POSIBILIDAD DE COMENTAR - OCUPA TODO EL ANCHO DEL CANAL CON FONDO BLANCO */}
                {isCommentsOpenForThisSession && (
                  <div 
                    className="absolute inset-x-0 bottom-0 z-50 w-full bg-white rounded-t-3xl border-t border-slate-200/90 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] p-3 sm:p-4 pb-3.5 flex flex-col gap-2 animate-slide-up pointer-events-auto text-left"
                    id={`normal-card-comments-${session.id}`}
                  >
                    <div className="flex items-center justify-between pb-1 shrink-0 px-1 border-b border-slate-100">
                      <div className="flex items-center gap-1.5 text-left">
                        <MessageCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-[10px] sm:text-[11px] font-black uppercase text-slate-900 tracking-wider">
                          COMENTARIOS ({commentsCount})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveCommentsSessionId(null);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition active:scale-90"
                        title="Cerrar comentarios"
                        aria-label="Cerrar comentarios"
                      >
                        <X className="w-4 h-4 text-slate-700 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Comments List */}
                    <div className="w-full max-h-[140px] sm:max-h-[160px] overflow-y-auto pr-1 text-left select-text scrollbar-thin scrollbar-thumb-slate-300 flex flex-col">
                      <div className="mt-auto space-y-1.5">
                        {sessionComments.map((comm) => (
                          <div key={comm.id} className="flex items-start gap-2 bg-slate-50 hover:bg-slate-100/80 p-2 rounded-xl border border-slate-200/80 shadow-xs transition">
                            <img
                              src={comm.userAvatar}
                              alt={comm.userName}
                              className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-300 mt-0.5"
                              onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'; }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] font-black text-rose-600 truncate">{comm.userName}</span>
                                <span className="text-[8px] text-slate-400 shrink-0 font-mono">{comm.timeAgo}</span>
                              </div>
                              <p className="text-[10px] text-slate-800 mt-0.5 leading-snug break-words font-medium">
                                {comm.text}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleToggleCommentLike(session.id, comm.id)}
                              className={`flex flex-col items-center gap-0.5 p-1 transition cursor-pointer shrink-0 ${
                                comm.userLiked ? 'text-rose-600 scale-110' : 'text-slate-400 hover:text-rose-500'
                              }`}
                              title="Me gusta"
                            >
                              <Heart className={`w-3 h-3 ${comm.userLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                              <span className="text-[8px] font-mono text-slate-500 font-bold">{comm.likes}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Emojis strip - Tap to send directly! */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-1.5 shrink-0 bg-slate-100 rounded-full border border-slate-200/90 shadow-xs">
                      <span className="text-[8px] text-amber-600 font-black uppercase tracking-wider pl-1 pr-0.5 shrink-0 flex items-center gap-1">
                        <span>⚡</span>
                        <span>ENVIAR EMOJI:</span>
                      </span>
                      {['💖', '🔥', '👏', '🚀', '💯', '😂', '🤩', '🙌', '💡', '💰', '✨', '👍', '💎', '🎉', '🥂', '👑'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            handleAddSessionComment(session.id, emoji);
                            window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                              detail: { emoji, icon: emoji, pureEmoji: true }
                            }));
                          }}
                          className="p-1 hover:bg-white hover:shadow-xs rounded-lg transition active:scale-130 hover:scale-110 cursor-pointer text-xs shrink-0 select-none text-slate-800"
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
                      className="relative flex items-center gap-1.5 pt-0.5 shrink-0 w-full"
                    >
                      {/* 📚 Glosario de Emojis que se abre al pulsar en el emoji del bloque */}
                      {renderEmojiGlossary(session.id)}

                      {/* Bloque para escribir comentarios con el emoji dentro */}
                      <div className="flex-1 flex items-center bg-slate-100 border border-slate-300 rounded-full pl-2 pr-2.5 py-1 focus-within:border-rose-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-500/20 transition shadow-inner min-w-0">
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
                          className="flex-1 bg-transparent text-[10px] sm:text-[11px] text-slate-900 placeholder-slate-400 focus:outline-none min-w-0 px-1 py-0.5"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!(commentInputMap[session.id] || '').trim()}
                        className={`p-2 rounded-full transition cursor-pointer shrink-0 flex items-center justify-center ${
                          (commentInputMap[session.id] || '').trim()
                            ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md active:scale-95'
                            : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
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

                {/* 📱 ZONA CENTRAL DERECHA SENSIBLE AL RATÓN Y BOTONES DE ACCIÓN (Centrada a la mitad de la página) */}
                <div 
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-[340px] sm:h-[380px] w-20 sm:w-24 z-[350] flex items-center justify-end pr-2 sm:pr-3.5 group/actionszone pointer-events-auto select-none"
                  id={`actions-hover-zone-${session.id}`}
                  onMouseEnter={() => setHoveredActionsSessionId(session.id)}
                  onMouseLeave={() => setHoveredActionsSessionId(null)}
                >
                  {/* 📱 TIKTOK ACTION COLUMN ON THE RIGHT */}
                  <div 
                    className={`flex flex-col items-center gap-2.5 sm:gap-3 select-none shrink-0 transition-all duration-300 transform ${
                      hoveredActionsSessionId === session.id
                        ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto'
                        : 'opacity-0 translate-x-4 scale-95 pointer-events-none group-hover/actionszone:opacity-100 group-hover/actionszone:translate-x-0 group-hover/actionszone:scale-100 group-hover/actionszone:pointer-events-auto'
                    }`}
                    id={`tiktok-actions-sidebar-${session.id}`}
                  >
                    {/* Like button with count (e.g. 43.2K) - Queda marcado y lanza lluvia de corazones */}
                    <div className="flex flex-col items-center relative group/channel-heart-zone">
                      {/* Recuadro de emojis dentro del canal - Centrado y con vista cómoda SIEMPRE por delante */}
                      <div className={`absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-[400] w-[272px] min-w-[272px] max-w-[272px] box-border flex-col items-center bg-[#0a0e1a]/95 backdrop-blur-2xl border border-slate-700/80 p-2.5 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] ring-1 ring-white/10 animate-fade-in select-none after:content-[''] after:absolute after:-right-4 after:inset-y-0 after:w-6 ${
                        showEmojiPickerSessionId === session.id ? 'flex' : 'hidden group-hover/channel-heart-zone:flex'
                      }`}>
                        {/* Cabecera del recuadro */}
                        <div className="w-full flex items-center justify-between pb-2 mb-1.5 border-b border-white/10 px-1">
                          <div className="flex items-center gap-1.5 text-xs font-black text-white uppercase tracking-wider">
                            <span>✨</span>
                            <span>Reacciones</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-bold">Toca para enviar</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowEmojiPickerSessionId(null);
                              }}
                              className="w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition cursor-pointer"
                              title="Cerrar ventana de reacciones"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Rejilla de emojis centrada y cómoda (captura image.png) */}
                        <div className="grid grid-cols-6 gap-1 w-full justify-items-center">
                          {TIKTOK_HEART_HOVER_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleLike(session.id);
                                window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                                  detail: { emoji, icon: emoji, pureEmoji: true }
                                }));
                                triggerContinuousRain(emoji);
                                setShowEmojiPickerSessionId(null);
                              }}
                              className="w-9 h-9 min-w-9 min-h-9 text-[22px] sm:text-[24px] flex items-center justify-center hover:scale-125 active:scale-90 hover:bg-white/15 rounded-xl transition-all transform cursor-pointer bg-transparent border-0 select-none shrink-0"
                              title={`Enviar ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleLike(session.id)}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-90 cursor-pointer ${
                          likesData.userLiked
                            ? 'bg-[#0b101d]/90 ring-2 ring-[#fe2c55] border-2 border-rose-500 shadow-[0_0_20px_rgba(254,44,85,0.85)] scale-105'
                            : 'bg-slate-800/80 hover:bg-slate-700/90 text-white'
                        }`}
                        title={likesData.userLiked ? "¡Marcado con Me Gusta!" : "Me gusta"}
                        id={`btn-like-heart-${session.id}`}
                      >
                        <Heart 
                          className={`w-5 h-5 transition-transform duration-200 ${
                            likesData.userLiked 
                              ? 'fill-white text-white scale-110 drop-shadow-[0_0_6px_rgba(255,255,255,0.9)] animate-heart-beat' 
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
                          if (enlargedWindowUser) {
                            window.dispatchEvent(new CustomEvent('toggle-live-comments'));
                            setIsEnlargedCommentsVisible(prev => !prev);
                          } else {
                            setActiveCommentsSessionId(prev => (prev === session.id ? null : session.id));
                          }
                          if (onOpenComments) onOpenComments();
                        }}
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-lg transition active:scale-90 cursor-pointer ${
                          (enlargedWindowUser ? isEnlargedCommentsVisible : isCommentsOpenForThisSession)
                            ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-rose-600/50 scale-105'
                            : 'bg-slate-800/80 hover:bg-slate-700/90 text-white'
                        }`}
                        title={
                          enlargedWindowUser
                            ? (isEnlargedCommentsVisible ? "Ocultar comentarios" : "Ver comentarios")
                            : (isCommentsOpenForThisSession ? "Ocultar comentarios" : "Ver comentarios")
                        }
                      >
                        <MessageCircle className="w-5 h-5 text-white" />
                      </button>
                      <span className={`text-[10px] sm:text-[11px] font-bold mt-0.5 ${(enlargedWindowUser ? isEnlargedCommentsVisible : isCommentsOpenForThisSession) ? 'text-rose-400 font-black' : 'text-slate-700 dark:text-slate-200'}`}>
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
                  </div>
                </div>

                </div>

                {/* 🧭 NAVEGADOR VERTICAL DE RONDAS (Solo en pantallas grandes para evitar desborde en móvil y tablet) */}
                <div 
                  className="hidden lg:flex absolute left-[calc(100%+10px)] sm:left-[calc(100%+14px)] lg:left-[calc(100%+18px)] top-1/2 -translate-y-1/2 z-[180] flex-col items-center gap-1.5 bg-[#0e1628]/95 backdrop-blur-xl border border-slate-700/80 p-1.5 py-2.5 rounded-[24px] shadow-2xl select-none animate-fade-in pointer-events-auto shrink-0"
                  id={`floating-finanzas-rounds-navigator-${session.id}`}
                >
                  <button
                    type="button"
                    disabled={activeFinanzasSessionIndex <= 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToRound(activeFinanzasSessionIndex - 1);
                    }}
                    className="w-8 h-8 rounded-full bg-[#1b2537] hover:bg-[#253248] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition active:scale-90 cursor-pointer shadow-sm border border-slate-700/60 shrink-0"
                    title="Ronda anterior (desplazar arriba)"
                  >
                    <ChevronUp className="w-4 h-4 text-white stroke-[2.5]" />
                  </button>

                  <div className="flex flex-col items-center py-1 text-center select-none shrink-0">
                    <span className="text-[7.5px] font-black uppercase text-slate-300 tracking-wider">RONDA</span>
                    <span className="text-xs sm:text-[13px] font-black font-mono text-[#00e676]">
                      {activeFinanzasSessionIndex + 1}/{activeSessionsOnly.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={activeFinanzasSessionIndex >= activeSessionsOnly.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToRound(activeFinanzasSessionIndex + 1);
                    }}
                    className="w-8 h-8 rounded-full bg-[#1b2537] hover:bg-[#253248] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition active:scale-90 cursor-pointer shadow-sm border border-slate-700/60 shrink-0"
                    title="Siguiente ronda (desplazar abajo)"
                  >
                    <ChevronDown className="w-4 h-4 text-white stroke-[2.5]" />
                  </button>
                </div>

              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
};
