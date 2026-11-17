import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Music,
  Play,
  Pause,
  X,
  ShieldCheck,
  Lock,
  Film,
  Heart,
  Sparkles,
  CheckCircle2,
  Volume2,
  Plus,
} from 'lucide-react';

export interface SoundVideoReference {
  id: string;
  username: string;
  name?: string;
  avatar?: string;
  videoUrl: string;
  likes?: number;
  description?: string;
  music?: string;
  videoCategory?: string;
  musicRights?: 'licensed' | 'restricted';
  allowAudioReuse?: boolean;
}

export interface SoundRightsInfo {
  canUseForNewVideo: boolean;
  licenseBadge: string;
  licenseSummary: string;
  holder: string;
  trackName: string;
  artistName: string;
  fullTitle: string;
  duration: string;
  audioUrl: string;
  coverUrl: string;
}

interface SoundTrackSheetModalProps {
  isOpen: boolean;
  sourceVideo: SoundVideoReference | null;
  allVideos: SoundVideoReference[];
  onClose: () => void;
  onSelectVideo?: (video: SoundVideoReference) => void;
  onUseAudioForNewVideo: (trackFullTitle: string, audioUrl: string) => void;
}

const SAMPLE_AUDIO_URLS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
];

const COMPANION_VIDEO_POOL: Array<{
  videoUrl: string;
  username: string;
  name: string;
  avatar: string;
  description: string;
  likes: number;
  videoCategory: string;
}> = [
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4',
    username: 'candiceswanepoel_w3',
    name: 'Candice Swanepoel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    description: 'Pasarela editorial nocturna y luces metálicas en París ✨',
    likes: 18420,
    videoCategory: 'Fashion',
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-a-red-light-40158-large.mp4',
    username: 'alessandraambrosio_w2',
    name: 'Alessandra Ambrosio',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300',
    description: 'Sesión estudio Carmesí con esta pista oficial 🔥',
    likes: 24100,
    videoCategory: 'Modelos',
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-in-a-studio-with-flashing-lights-40485-large.mp4',
    username: 'adrianalima_w1',
    name: 'Adriana Lima',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    description: 'Momentos de flash en estudio antes del desfile VIP 📸',
    likes: 31900,
    videoCategory: 'Fashion',
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-rainy-night-40539-large.mp4',
    username: 'sophialoren_w3',
    name: 'Sophia Loren',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    description: 'Noche de neón y alta costura urbana bajo la lluvia 🌧️✨',
    likes: 14750,
    videoCategory: 'Fashion',
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-model-walking-on-a-runway-41715-large.mp4',
    username: 'miakincaid',
    name: 'Mia Kincaid',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300',
    description: 'Pasarela internacional · Ritmo sincronizado 👑',
    likes: 19680,
    videoCategory: 'Modelos',
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-dancing-under-studio-light-40157-large.mp4',
    username: 'jasminetookes_w4',
    name: 'Jasmine Tookes',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    description: 'Ensayo backstage con la música del show 🎬💃',
    likes: 16290,
    videoCategory: 'BackStage',
  },
];

const RESTRICTED_COPYRIGHT_KEYWORDS = [
  'abba',
  'madonna',
  'taylor swift',
  'doja cat',
  'david bowie',
  'dua lipa',
  'sophie ellis-bextor',
  'beyoncé',
  'beyonce',
  'tate mcrae',
  'sabrina carpenter',
  'kenya grace',
  'solo escucha',
  'restringido',
  'copyright',
  'derechos reservados',
];

const normalizeMusicKey = (music?: string): string => {
  return (music || 'Música Original - Fashion Finances Studio')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
};

const getMusicTrackBaseTitle = (music?: string): string => {
  const full = (music || 'Música Original - Fashion Finances Studio').trim();
  const dashIdx = full.indexOf(' - ');
  return (dashIdx > 0 ? full.slice(0, dashIdx) : full).toLowerCase().trim();
};

export const resolveSoundRights = (video: SoundVideoReference | null): SoundRightsInfo => {
  const fullTitle = (video?.music || 'Música Original - Fashion Finances Studio').trim();
  const dashIdx = fullTitle.indexOf(' - ');
  const trackName = dashIdx > 0 ? fullTitle.slice(0, dashIdx).trim() : fullTitle;
  const artistName =
    dashIdx > 0
      ? fullTitle.slice(dashIdx + 3).trim()
      : video?.name || `@${video?.username || 'studio'}`;

  const lower = fullTitle.toLowerCase();
  const isExplicitlyRestricted =
    video?.allowAudioReuse === false ||
    video?.musicRights === 'restricted' ||
    RESTRICTED_COPYRIGHT_KEYWORDS.some((kw) => lower.includes(kw));

  // Deterministic audio & cover hash from fullTitle
  let hash = 0;
  for (let i = 0; i < fullTitle.length; i++) {
    hash = (hash * 31 + fullTitle.charCodeAt(i)) >>> 0;
  }
  const audioUrl = SAMPLE_AUDIO_URLS[hash % SAMPLE_AUDIO_URLS.length];
  const durations = ['0:24', '0:30', '0:35', '0:28', '0:40', '0:32'];
  const duration = durations[hash % durations.length];

  const coverUrl =
    video?.avatar ||
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300';

  if (isExplicitlyRestricted) {
    return {
      canUseForNewVideo: false,
      licenseBadge: 'Derechos reservados · Uso restringido',
      licenseSummary:
        'Esta pista pertenece a un catálogo comercial protegido. Puedes escucharla y ver otros vídeos aquí, pero el titular no autoriza reutilizarla al crear nuevos vídeos.',
      holder: artistName,
      trackName,
      artistName,
      fullTitle,
      duration,
      audioUrl,
      coverUrl,
    };
  }

  return {
    canUseForNewVideo: true,
    licenseBadge: 'Licencia autorizada · Libre para crear',
    licenseSummary:
      'Los derechos de esta pista permiten reutilizar este audio gratuitamente para grabar o publicar un nuevo vídeo en Fashion Finances.',
    holder: artistName,
    trackName,
    artistName,
    fullTitle,
    duration,
    audioUrl,
    coverUrl,
  };
};

export const SoundTrackSheetModal: React.FC<SoundTrackSheetModalProps> = ({
  isOpen,
  sourceVideo,
  allVideos,
  onClose,
  onSelectVideo,
  onUseAudioForNewVideo,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<SoundVideoReference | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const trackInfo = useMemo(() => resolveSoundRights(sourceVideo), [sourceVideo]);

  // Reset playback state when closing or switching source track
  useEffect(() => {
    setIsPlayingAudio(false);
    setPreviewVideo(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isOpen, sourceVideo?.id, sourceVideo?.music]);

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    if (isPlayingAudio && isOpen) {
      audioEl.play().catch(() => {});
    } else {
      audioEl.pause();
    }
  }, [isPlayingAudio, isOpen, trackInfo.audioUrl]);

  // Collect OTHER videos using the same music track
  const otherVideosWithSameSound = useMemo(() => {
    if (!sourceVideo) return [];
    const targetFullKey = normalizeMusicKey(trackInfo.fullTitle);
    const targetBaseTitle = getMusicTrackBaseTitle(trackInfo.fullTitle);

    const matched: SoundVideoReference[] = [];
    const seenIds = new Set<string>();
    const seenVideoCreatorPairs = new Set<string>();

    for (const vid of allVideos) {
      if (!vid || !vid.videoUrl) continue;
      if (vid.id === sourceVideo.id) continue;

      const vidFullKey = normalizeMusicKey(vid.music);
      const vidBaseTitle = getMusicTrackBaseTitle(vid.music);

      const isSameMusic =
        vidFullKey === targetFullKey ||
        (targetBaseTitle.length >= 4 && vidBaseTitle === targetBaseTitle);

      if (!isSameMusic) continue;

      const pairKey = `${vid.username}::${vid.videoUrl}`;
      if (seenIds.has(vid.id) || seenVideoCreatorPairs.has(pairKey)) continue;

      seenIds.add(vid.id);
      seenVideoCreatorPairs.add(pairKey);
      matched.push(vid);
    }

    // Ensure the sound sheet always showcases companion creator videos using the same music
    let poolOffset = 0;
    for (let i = 0; i < trackInfo.fullTitle.length; i++) {
      poolOffset += trackInfo.fullTitle.charCodeAt(i);
    }

    for (let step = 0; step < COMPANION_VIDEO_POOL.length && matched.length < 4; step++) {
      const candidate = COMPANION_VIDEO_POOL[(poolOffset + step) % COMPANION_VIDEO_POOL.length];
      if (candidate.videoUrl === sourceVideo.videoUrl && candidate.username === sourceVideo.username) {
        continue;
      }
      const pairKey = `${candidate.username}::${candidate.videoUrl}`;
      if (seenVideoCreatorPairs.has(pairKey)) continue;
      seenVideoCreatorPairs.add(pairKey);

      matched.push({
        id: `sound-match-${poolOffset}-${step}`,
        username: candidate.username,
        name: candidate.name,
        avatar: candidate.avatar,
        videoUrl: candidate.videoUrl,
        likes: candidate.likes + step * 340,
        description: candidate.description,
        music: trackInfo.fullTitle,
        videoCategory: candidate.videoCategory,
        musicRights: sourceVideo.musicRights,
        allowAudioReuse: sourceVideo.allowAudioReuse,
      });
    }

    return matched;
  }, [allVideos, sourceVideo, trackInfo.fullTitle]);

  if (!isOpen || !sourceVideo || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-start sm:items-center justify-center p-2 sm:p-4 pt-2 sm:pt-4 overflow-y-auto overflow-x-hidden backdrop-blur-md bg-slate-950/80 animate-fade-in"
      id="sound-track-sheet-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      onWheel={(e) => e.stopPropagation()}
    >
      <audio
        ref={audioRef}
        src={trackInfo.audioUrl}
        loop
        onEnded={() => setIsPlayingAudio(false)}
      />

      <div className="bg-[#0d111a] text-white border border-white/15 rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] relative flex flex-col max-h-[calc(100dvh-16px)] sm:max-h-[calc(100dvh-32px)] overflow-hidden animate-scale-up text-left">
        {/* Header */}
        <div className="p-4 sm:p-5 pr-12 border-b border-white/10 bg-gradient-to-r from-[#121826] via-[#191224] to-[#121826] relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="custom-bg absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center justify-center transition cursor-pointer"
            title="Cerrar ficha del sonido"
            id="btn-close-sound-sheet"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3.5 sm:gap-4">
            {/* Spinning Album / Disc Preview */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#fe2c55]/70 shadow-[0_0_24px_rgba(254,44,85,0.35)] bg-slate-900 relative">
                <img
                  src={trackInfo.coverUrl}
                  alt={trackInfo.trackName}
                  className="w-full h-full object-cover opacity-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setIsPlayingAudio((prev) => !prev)}
                    className="custom-bg w-9 h-9 rounded-full bg-[#fe2c55] hover:bg-[#ff3d65] text-white flex items-center justify-center shadow-lg transition transform active:scale-90 cursor-pointer border-0"
                    title={isPlayingAudio ? 'Pausar vista previa de audio' : 'Escuchar vista previa de la pista'}
                    id="btn-toggle-sound-preview"
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-4 h-4 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
              <div
                className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-black border border-white/25 flex items-center justify-center shadow-md ${
                  isPlayingAudio ? 'animate-spin' : ''
                }`}
                style={isPlayingAudio ? { animationDuration: '3s' } : undefined}
              >
                <Music className="w-3 h-3 text-[#fe2c55]" />
              </div>
            </div>

            {/* Track Info */}
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-1.5 text-[9.5px] font-black uppercase tracking-wider text-rose-400">
                <Volume2 className="w-3.5 h-3.5 shrink-0" />
                <span>Ficha del Sonido</span>
              </div>
              <h3 className="text-base sm:text-xl font-black text-white leading-tight break-words">
                {trackInfo.trackName}
              </h3>
              <p className="text-xs font-semibold text-slate-300 truncate">
                {trackInfo.artistName}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px] font-bold text-slate-400">
                <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-slate-200">
                  <Film className="w-3 h-3 text-rose-400" />
                  <span>{otherVideosWithSameSound.length + 1} vídeos con este audio</span>
                </span>
                <span className="font-mono text-slate-300">{trackInfo.duration}</span>
                {isPlayingAudio && (
                  <span className="inline-flex items-center gap-1 text-[#fe2c55] font-extrabold animate-pulse">
                    ● Reproduciendo muestra
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-5">
          {/* Rights & License Status Card */}
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border space-y-2 ${
              trackInfo.canUseForNewVideo
                ? 'bg-emerald-950/35 border-emerald-500/35'
                : 'bg-amber-950/35 border-amber-500/35'
            }`}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wide ${
                  trackInfo.canUseForNewVideo ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
                {trackInfo.canUseForNewVideo ? (
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 shrink-0 text-amber-400" />
                )}
                <span>{trackInfo.licenseBadge}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-300">
                Titular: {trackInfo.holder}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed m-0">
              {trackInfo.licenseSummary}
            </p>
          </div>

          {/* Inline Video Preview if user clicked one of the matching videos */}
          {previewVideo && (
            <div className="bg-black/70 border border-rose-500/40 rounded-2xl p-3 space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={previewVideo.avatar || trackInfo.coverUrl}
                    alt={previewVideo.username}
                    className="w-7 h-7 rounded-full object-cover border border-white/30 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate m-0">
                      @{previewVideo.username}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate m-0">
                      {previewVideo.description || 'Vídeo usando esta pista'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewVideo(null)}
                  className="custom-bg px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold cursor-pointer border-0 shrink-0"
                >
                  Cerrar vista
                </button>
              </div>
              <div className="w-full max-h-[260px] rounded-xl overflow-hidden bg-black flex items-center justify-center">
                <video
                  src={previewVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full max-h-[260px] object-contain"
                />
              </div>
            </div>
          )}

          {/* Other Videos Using This Same Music */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5 m-0">
                <Sparkles className="w-3.5 h-3.5 text-[#fe2c55]" />
                <span>Otros vídeos con esta música ({otherVideosWithSameSound.length})</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-semibold">
                Pulsa para reproducir
              </span>
            </div>

            {otherVideosWithSameSound.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400">
                Todavía no hay otros vídeos publicados con esta pista.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {otherVideosWithSameSound.map((vid) => {
                  const isCurrentlyPreviewed = previewVideo?.id === vid.id;
                  return (
                    <button
                      key={vid.id}
                      type="button"
                      onClick={() => {
                        setPreviewVideo(vid);
                        if (onSelectVideo) {
                          onSelectVideo(vid);
                        }
                      }}
                      className={`custom-bg group relative aspect-[9/14] rounded-2xl overflow-hidden bg-slate-900 border text-left transition cursor-pointer p-0 ${
                        isCurrentlyPreviewed
                          ? 'border-[#fe2c55] ring-2 ring-[#fe2c55]/50'
                          : 'border-white/15 hover:border-rose-400/70'
                      }`}
                    >
                      <video
                        src={vid.videoUrl}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      {/* Top Play indicator */}
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white group-hover:bg-[#fe2c55] transition-colors">
                        <Play className="w-3 h-3 fill-white ml-0.5" />
                      </div>

                      {/* Bottom creator info */}
                      <div className="absolute inset-x-2 bottom-2 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={vid.avatar || trackInfo.coverUrl}
                            alt={vid.username}
                            className="w-5 h-5 rounded-full object-cover border border-white/70 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[10px] font-black text-white truncate flex items-center gap-0.5">
                            @{vid.username}
                            <CheckCircle2 className="w-2.5 h-2.5 text-[#20d5ec] shrink-0" />
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9.5px] font-bold text-slate-300">
                          <span className="inline-flex items-center gap-1">
                            <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
                            {vid.likes
                              ? vid.likes > 999
                                ? `${(vid.likes / 1000).toFixed(1)}K`
                                : vid.likes
                              : '1.4K'}
                          </span>
                          {vid.videoCategory && (
                            <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-white/10 text-slate-200 truncate max-w-[75px]">
                              {vid.videoCategory}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Action: Create New Video with this Audio (if rights allow) */}
        <div className="p-3.5 sm:p-4 border-t border-white/10 bg-[#0b0e16] flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          {trackInfo.canUseForNewVideo ? (
            <>
              <div className="text-[11px] text-slate-300 font-semibold text-center sm:text-left">
                Audio autorizado para crear nuevos vídeos
              </div>
              <button
                type="button"
                onClick={() => onUseAudioForNewVideo(trackInfo.fullTitle, trackInfo.audioUrl)}
                className="custom-bg w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#fe2c55] to-rose-600 hover:from-[#ff3b63] hover:to-rose-500 text-white font-black text-xs uppercase tracking-wider shadow-lg transition active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2 border-0"
                id="btn-use-sound-create-video"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Usar este audio para crear un vídeo</span>
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Derechos de autor protegidos: no se permite usar este audio en nuevos vídeos.</span>
              </div>
              <button
                type="button"
                disabled
                className="custom-bg w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800/80 text-slate-400 border border-slate-700 text-xs font-bold cursor-not-allowed opacity-75 shrink-0"
                id="btn-use-sound-disabled"
              >
                Uso no autorizado
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
