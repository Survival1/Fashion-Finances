import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  Upload, 
  Sparkles, 
  Subtitles, 
  Check, 
  Film,
  AlertCircle
} from 'lucide-react';
import heroPoster from '../assets/images/fashion_finances_hero_poster_1788599142206.jpg';

interface HeroPresentationVideoProps {
  onExploreClick?: () => void;
}

const DEFAULT_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-39868-large.mp4";

export default function HeroPresentationVideo({ onExploreClick }: HeroPresentationVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [videoSrc, setVideoSrc] = useState<string>(() => {
    return localStorage.getItem('fashion_finances_hero_video_url') || '/hero_video.mp4';
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.85);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Verify server video status on mount
  useEffect(() => {
    fetch('/api/hero-video-status')
      .then(res => res.json())
      .then(data => {
        if (data.exists && data.url) {
          setVideoSrc(data.url);
          localStorage.setItem('fashion_finances_hero_video_url', data.url);
        } else {
          // If neither server nor localStorage has a custom video, use high-def presentation fallback
          const cached = localStorage.getItem('fashion_finances_hero_video_url');
          if (!cached || cached === '/hero_video.mp4') {
            setVideoSrc(DEFAULT_VIDEO_URL);
          }
        }
      })
      .catch(() => {
        const cached = localStorage.getItem('fashion_finances_hero_video_url');
        if (!cached || cached === '/hero_video.mp4') {
          setVideoSrc(DEFAULT_VIDEO_URL);
        }
      });
  }, []);

  // Format time mm:ss
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(err => console.error("Playback error:", err));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && videoRef.current.volume === 0) {
      videoRef.current.volume = 0.85;
      setVolume(0.85);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 31);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
    } else {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };

  // Upload or replace video with user's video file (.mp4, .webm, .mov)
  const processVideoFile = async (file: File) => {
    if (!file || !file.type.startsWith('video/')) {
      alert('Por favor selecciona un archivo de vídeo válido (.mp4, .webm, .mov)');
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      // 1. Create a local object URL immediately for instant zero-latency playback
      const localUrl = URL.createObjectURL(file);
      setVideoSrc(localUrl);
      localStorage.setItem('fashion_finances_hero_video_url', localUrl);

      // 2. Upload file to server in background
      const res = await fetch('/api/upload-hero-video', {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'video/mp4'
        },
        body: file
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setVideoSrc(data.url);
          localStorage.setItem('fashion_finances_hero_video_url', data.url);
        }
      }

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);

      // Trigger video play
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Error uploading video:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processVideoFile(file);
    }
  };

  // Dynamic subtitle based on playback progress
  const getCurrentTranscript = () => {
    if (currentTime < 9.5) {
      return "Bienvenido a Fashion Finances: Donde las finanzas de élite se fusionan con la alta moda.";
    } else if (currentTime < 16.5) {
      return "Welcome to Fashion Finances, the place where investors, entrepreneurs, and models come together.";
    } else if (currentTime < 22.5) {
      return "In a unique ecosystem: Finanzas, shopping, vídeos en directo, premios y mucho más te esperan.";
    } else {
      return "Sube todos los productos de tu tienda, compite en el ranking de modelos y accede a rondas de inversión exclusivas.";
    }
  };

  return (
    <div 
      id="hero-presentation-video-container"
      ref={containerRef}
      className="w-full max-w-4xl mx-auto my-8 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Hidden file input for uploading the user's video file */}
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="video/mp4,video/webm,video/quicktime" 
        className="hidden" 
        onChange={handleFileInputChange}
      />

      <div className={`relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border transition-all duration-300 ${
        isDragOver ? 'border-indigo-500 ring-4 ring-indigo-500/20' : 'border-slate-800/80 shadow-slate-950/30'
      }`}>
        {/* Main Video Element */}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={heroPoster}
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlay}
          className="w-full h-full object-cover cursor-pointer"
        />

        {/* Video Drag Overlay Notice */}
        {isDragOver && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-white space-y-3 pointer-events-none">
            <Upload className="w-12 h-12 text-indigo-400 animate-bounce" />
            <span className="text-sm font-bold uppercase tracking-wider">Suelta aquí tu vídeo de Fashion Finances</span>
            <span className="text-xs text-slate-300">Formato MP4, WebM o MOV</span>
          </div>
        )}

        {/* Subtle top branding banner */}
        <div className={`absolute top-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-transparent flex items-center justify-between z-20 transition-opacity duration-300 ${
          isHovered || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold tracking-wider uppercase font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Fashion Finances • Oficial
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/10 backdrop-blur-md text-[9px] font-mono text-slate-300">
              HD 1080P
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Upload Video Trigger */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/15 hover:bg-white/25 active:scale-95 text-white rounded-xl backdrop-blur-md border border-white/10 text-[10px] sm:text-[11px] font-medium flex items-center gap-1.5 transition cursor-pointer"
              title="Cargar o cambiar el archivo de vídeo"
            >
              {isUploading ? (
                <>
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Subiendo...</span>
                </>
              ) : uploadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>¡Vídeo cargado!</span>
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 text-slate-200" />
                  <span className="hidden xs:inline">Cargar vídeo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Center Big Play Button (when paused or initial) */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center cursor-pointer bg-slate-950/30 backdrop-blur-[2px] transition-all hover:bg-slate-950/20 group"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 hover:bg-white text-slate-950 flex items-center justify-center shadow-2xl transition-transform transform group-hover:scale-110 active:scale-95">
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-slate-950 ml-1 text-slate-950" />
            </div>
            {!hasStarted && (
              <div className="mt-4 px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-white text-xs font-medium tracking-wide flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Haz clic para reproducir la presentación oficial</span>
              </div>
            )}
          </div>
        )}

        {/* Live Subtitle Overlay */}
        {showSubtitles && isPlaying && (
          <div className="absolute bottom-16 sm:bottom-18 left-4 right-4 z-20 flex justify-center pointer-events-none">
            <p className="bg-slate-950/85 backdrop-blur-md text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-xl border border-white/10 max-w-xl text-center shadow-lg transition-all animate-fade-in">
              {getCurrentTranscript()}
            </p>
          </div>
        )}

        {/* Bottom Custom Playback Bar */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent z-20 transition-opacity duration-300 space-y-2 ${
          isHovered || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Progress Slider */}
          <div className="w-full flex items-center gap-2">
            <input
              type="range"
              min="0"
              max={duration || 31}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 sm:h-1.5 bg-white/25 hover:bg-white/40 rounded-lg appearance-none cursor-pointer accent-rose-500 transition-all"
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={togglePlay}
                className="hover:text-rose-400 transition cursor-pointer p-1"
                title={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>

              {/* Volume & Mute */}
              <div className="flex items-center gap-1.5 group/vol">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="hover:text-rose-400 transition cursor-pointer p-1"
                  title={isMuted ? "Activar sonido" : "Silenciar"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-14 sm:w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                />
              </div>

              {/* Time display */}
              <span className="font-mono text-[10px] sm:text-xs text-slate-300">
                {formatTime(currentTime)} / {formatTime(duration || 31)}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Subtitles (CC) Toggle */}
              <button
                type="button"
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border transition cursor-pointer ${
                  showSubtitles 
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                    : 'bg-white/10 text-slate-300 border-white/10 hover:text-white'
                }`}
                title="Subtítulos en directo"
              >
                CC
              </button>

              {/* Reset to Start */}
              <button
                type="button"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    setCurrentTime(0);
                  }
                }}
                className="hover:text-rose-400 transition cursor-pointer p-1 text-slate-300"
                title="Reiniciar vídeo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={handleFullscreen}
                className="hover:text-rose-400 transition cursor-pointer p-1 text-slate-300"
                title="Pantalla completa"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant minimalist caption underneath the player */}
      <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 px-1 text-left">
        <div className="flex items-center gap-2 text-slate-500 text-xs">
          <Film className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="font-medium text-slate-700">Presentación Oficial de Fashion Finances</span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="hidden sm:inline text-slate-500">Inversores, emprendedores y modelos en un único ecosistema</span>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-[11px] text-slate-500 hover:text-indigo-600 transition flex items-center gap-1 font-medium cursor-pointer"
        >
          <Upload className="w-3 h-3" />
          <span>Arrastra o selecciona otro clip</span>
        </button>
      </div>
    </div>
  );
}
