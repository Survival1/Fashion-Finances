import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  Upload, 
  Subtitles, 
  Check, 
  AlertCircle
} from 'lucide-react';
import heroPoster from '../assets/images/fashion_finances_hero_official_video_cover_1788855440382.jpg';

interface HeroPresentationVideoProps {
  onExploreClick?: () => void;
}

const DEFAULT_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-39868-large.mp4";

export default function HeroPresentationVideo({ onExploreClick }: HeroPresentationVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [videoSrc, setVideoSrc] = useState<string>(() => {
    const cached = localStorage.getItem('fashion_finances_hero_video_url');
    if (cached && !cached.includes('mixkit')) {
      return cached;
    }
    return '/hero_video.mp4';
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(31);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

  // Clear legacy broken URLs and ensure /hero_video.mp4 is active
  useEffect(() => {
    const cached = localStorage.getItem('fashion_finances_hero_video_url');
    if (cached && cached.includes('mixkit')) {
      localStorage.removeItem('fashion_finances_hero_video_url');
      setVideoSrc('/hero_video.mp4');
    }

    fetch('/api/hero-video-status')
      .then(res => res.json())
      .then(data => {
        if (data.exists && data.url) {
          setVideoSrc(data.url);
          localStorage.setItem('fashion_finances_hero_video_url', data.url);
        } else {
          setVideoSrc('/hero_video.mp4');
        }
      })
      .catch(() => {
        setVideoSrc('/hero_video.mp4');
      });
  }, []);

  // Format time mm:ss
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasStarted(true);
          })
          .catch(err => {
            console.warn("Autoplay with sound restricted, playing muted fallback:", err);
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => {
                setIsPlaying(true);
                setHasStarted(true);
              }).catch(e => console.error("Playback error:", e));
            }
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !videoRef.current.muted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      const targetVol = volume > 0 ? volume : 0.85;
      videoRef.current.volume = targetVol;
      setVolume(targetVol);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
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
      if (videoRef.current.duration && !isNaN(videoRef.current.duration) && videoRef.current.duration > 0) {
        setDuration(videoRef.current.duration);
      }
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  const handleRestart = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(() => {});
    }
  };

  const handleFullscreen = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!containerRef.current) return;
    const doc = document as any;
    const el = containerRef.current as any;

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.mozFullScreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch((err: any) => console.warn(err));
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch((err: any) => console.warn(err));
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      }
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
          preload="auto"
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onDurationChange={handleLoadedMetadata}
          onCanPlayThrough={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onVolumeChange={() => {
            if (videoRef.current) {
              setIsMuted(videoRef.current.muted);
              setVolume(videoRef.current.volume);
            }
          }}
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
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={isUploading}
              className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl backdrop-blur-md border border-white/10 flex items-center justify-center transition cursor-pointer shadow-sm"
              title="Cargar o seleccionar el vídeo de Fashion Finances (.mp4)"
            >
              {isUploading ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : uploadSuccess ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Upload className="w-4 h-4 text-slate-100" />
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
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-transparent z-20 transition-opacity duration-300 space-y-2 ${
            isHovered || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Progress Slider */}
          <div className="w-full flex items-center gap-2">
            <input
              type="range"
              min="0"
              max={duration || 31}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              style={{
                background: `linear-gradient(to right, #f43f5e 0%, #f43f5e ${(currentTime / (duration || 31)) * 100}%, rgba(255,255,255,0.25) ${(currentTime / (duration || 31)) * 100}%, rgba(255,255,255,0.25) 100%)`
              }}
              className="w-full h-1 sm:h-1.5 rounded-lg appearance-none cursor-pointer accent-rose-500 transition-all"
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
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  style={{
                    background: `linear-gradient(to right, #ffffff 0%, #ffffff ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`
                  }}
                  className="w-14 sm:w-20 h-1 rounded-lg appearance-none cursor-pointer accent-white"
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
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSubtitles(!showSubtitles);
                }}
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
                onClick={handleRestart}
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
    </div>
  );
}
