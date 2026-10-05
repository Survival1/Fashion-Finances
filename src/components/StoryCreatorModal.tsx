import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Video, 
  Upload, 
  X, 
  Sparkles, 
  Clock, 
  Check, 
  AlertCircle, 
  RotateCcw, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Smartphone, 
  Layers, 
  CheckCircle2, 
  Send, 
  RefreshCw,
  Info,
  Star,
  Archive,
  Film,
  Eye,
  EyeOff
} from 'lucide-react';

interface StoryCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: any;
  onStoriesCreated?: (stories: any[]) => void;
}

export default function StoryCreatorModal({
  isOpen,
  onClose,
  userProfile,
  onStoriesCreated
}: StoryCreatorModalProps) {
  // Main tabs: 'record' | 'upload' | 'specs'
  const [activeTab, setActiveTab] = useState<'record' | 'upload' | 'specs'>('record');

  // Record mode: 'video' | 'photo'
  const [recordMode, setRecordMode] = useState<'video' | 'photo'>('video');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  
  // Camera Stream State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('user');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [cameraFilter, setCameraFilter] = useState<'normal' | 'glamour' | 'vintage' | 'noir' | 'neon'>('normal');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // File Upload State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [isUploadedVideo, setIsUploadedVideo] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoChunksCount, setVideoChunksCount] = useState<number>(1);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Meta & Publishing State
  const [storyCaption, setStoryCaption] = useState('');
  const [saveToHighlights, setSaveToHighlights] = useState(false);
  const [saveToArchive, setSaveToArchive] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isPeekingBackground, setIsPeekingBackground] = useState(false);

  // Presets
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // Media references
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const liveStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fashion Story Presets
  const STORY_PRESETS = [
    { name: '🌟 Runway París (Vídeo 25s)', url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4', isVideo: true, duration: 25 },
    { name: '🔥 Milán Backstage (Foto)', url: 'https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?auto=format&fit=crop&q=80&w=1080', isVideo: false, duration: 6 },
    { name: '✨ Vogue Editorial (Foto)', url: 'https://images.unsplash.com/photo-1549439602-43faec43ae8a?auto=format&fit=crop&q=80&w=1080', isVideo: false, duration: 6 },
    { name: '📸 Neon Studio (Foto)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1080', isVideo: false, duration: 6 }
  ];

  // Initialize camera when opening 'record' tab
  useEffect(() => {
    if (isOpen && activeTab === 'record' && !recordedVideoUrl && !capturedPhotoUrl) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isOpen, activeTab, cameraFacingMode, recordedVideoUrl, capturedPhotoUrl]);

  // Clean up stream helper
  const stopCamera = () => {
    if (liveStreamRef.current) {
      liveStreamRef.current.getTracks().forEach(track => track.stop());
      liveStreamRef.current = null;
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Start Camera Stream
  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacingMode,
          width: { ideal: 1080 },
          height: { ideal: 1920 }
        },
        audio: !isMicMuted
      });
      liveStreamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play().catch(() => {});
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn("Could not open high-res camera with facingMode, falling back to standard constraints:", err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        liveStreamRef.current = fallbackStream;
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = fallbackStream;
          videoPreviewRef.current.play().catch(() => {});
        }
        setIsCameraActive(true);
      } catch (err2: any) {
        setCameraError("No se pudo acceder a la cámara o micrófono. Asegúrate de otorgar los permisos en el navegador.");
      }
    }
  };

  // Toggle front/back camera
  const handleToggleFacingMode = () => {
    setCameraFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  // Start live video recording (up to 60s)
  const handleStartRecording = () => {
    if (!liveStreamRef.current) return;
    recordedChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const mimeTypes = ['video/webm;codecs=vp9,opus', 'video/webm', 'video/mp4'];
      let selectedMime = '';
      for (const m of mimeTypes) {
        if (MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      const recorder = new MediaRecorder(liveStreamRef.current, selectedMime ? { mimeType: selectedMime } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: selectedMime || 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideoUrl(videoUrl);
        setIsRecording(false);
        stopCamera();
      };

      recorder.start(1000); // 1s slice
      setIsRecording(true);

      // Countdown up to 60 seconds (1 minute maximum continuous clip)
      let sec = 0;
      recordingTimerRef.current = setInterval(() => {
        sec += 1;
        setRecordingSeconds(sec);
        if (sec >= 60) {
          handleStopRecording();
        }
      }, 1000);

    } catch (e: any) {
      alert("Error al iniciar la grabación: " + e.message);
    }
  };

  // Stop video recording
  const handleStopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Capture instant photo
  const handleCapturePhoto = () => {
    if (!videoPreviewRef.current || !canvasRef.current) return;
    const video = videoPreviewRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1080;
    canvas.height = video.videoHeight || 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply mirror if front camera
    if (cameraFacingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedPhotoUrl(dataUrl);
    stopCamera();
  };

  // Reset live recording/photo to try again
  const handleResetRecord = () => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
      setRecordedVideoUrl(null);
    }
    setCapturedPhotoUrl(null);
    setRecordingSeconds(0);
    setIsRecording(false);
    startCamera();
  };

  // Handle file upload selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processSelectedFile(file);
  };

  const processSelectedFile = (file: File) => {
    setUploadError(null);
    setSelectedPreset(null);

    const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.mov');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      setUploadError("Formato no compatible. Por favor sube un archivo de vídeo (.mp4, .mov) o imagen (.jpg, .png).");
      return;
    }

    // Weight validation: Max 4 GB for video, max 30 MB for photo
    const maxVideoSize = 4 * 1024 * 1024 * 1024; // 4 GB
    const maxPhotoSize = 30 * 1024 * 1024; // 30 MB

    if (isVideo && file.size > maxVideoSize) {
      setUploadError(`El vídeo supera el peso máximo permitido de 4 GB (${(file.size / (1024 * 1024 * 1024)).toFixed(1)} GB detectados).`);
      return;
    }

    if (isImage && file.size > maxPhotoSize) {
      setUploadError(`La imagen supera el peso máximo permitido de 30 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB detectados).`);
      return;
    }

    setUploadedFile(file);
    setIsUploadedVideo(isVideo);
    const url = URL.createObjectURL(file);
    setUploadedFileUrl(url);

    // If video, read duration to compute automatic 60s splits
    if (isVideo) {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = url;
      tempVideo.onloadedmetadata = () => {
        const dur = Math.round(tempVideo.duration) || 1;
        setVideoDuration(dur);
        // Automatic chunking: up to 60s continuous clips
        const chunks = Math.ceil(dur / 60);
        setVideoChunksCount(chunks > 0 ? chunks : 1);
      };
    } else {
      setVideoDuration(6); // 5 to 7s default for photo (6s)
      setVideoChunksCount(1);
    }
  };

  // Publish Story
  const handlePublish = async () => {
    if (!userProfile) return;
    setIsPublishing(true);

    try {
      const now = Date.now();
      const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours visibility
      const createdStories: any[] = [];

      let mediaSource = '';
      let isVideoMedia = false;
      let durationSeconds = 6;

      if (activeTab === 'record') {
        if (recordMode === 'video' && recordedVideoUrl) {
          mediaSource = recordedVideoUrl;
          isVideoMedia = true;
          durationSeconds = recordingSeconds || 60;
        } else if (capturedPhotoUrl) {
          mediaSource = capturedPhotoUrl;
          isVideoMedia = false;
          durationSeconds = 6;
        }
      } else {
        // Upload or Preset tab
        if (uploadedFileUrl) {
          mediaSource = uploadedFileUrl;
          isVideoMedia = isUploadedVideo;
          durationSeconds = videoDuration || (isUploadedVideo ? 60 : 6);
        } else if (selectedPreset) {
          const presetObj = STORY_PRESETS.find(p => p.url === selectedPreset);
          mediaSource = selectedPreset;
          isVideoMedia = presetObj?.isVideo || false;
          durationSeconds = presetObj?.duration || 6;
        }
      }

      if (!mediaSource) {
        alert("Por favor graba o selecciona una foto o vídeo antes de publicar.");
        setIsPublishing(false);
        return;
      }

      const baseTitle = storyCaption.trim() || (isVideoMedia ? 'Clip en directo' : 'Instantánea Fashion');

      // If video duration is greater than 60s, automatically split into consecutive 60s stories!
      const chunks = isVideoMedia && durationSeconds > 60 ? Math.ceil(durationSeconds / 60) : 1;

      for (let i = 0; i < chunks; i++) {
        const chunkTitle = chunks > 1 ? `${baseTitle} (Parte ${i + 1}/${chunks})` : baseTitle;
        const chunkDuration = chunks > 1 
          ? (i === chunks - 1 ? (durationSeconds % 60 || 60) : 60)
          : durationSeconds;

        const storyObj = {
          id: `story-${now}-${i}`,
          userId: userProfile.id,
          username: userProfile.username,
          name: userProfile.name,
          avatar: userProfile.avatar,
          image: mediaSource,
          title: chunkTitle,
          createdAt: now + i * 10,
          expiresAt: expiresAt,
          isVideo: isVideoMedia,
          duration: chunkDuration,
          partIndex: i + 1,
          totalParts: chunks,
          isHighlight: saveToHighlights,
          isArchived: saveToArchive
        };

        createdStories.push(storyObj);
      }

      // Save to active_stories in localStorage
      const rawActive = localStorage.getItem('active_stories');
      let activeList = [];
      if (rawActive) {
        try {
          activeList = JSON.parse(rawActive);
        } catch (e) {}
      }
      activeList = activeList.filter((s: any) => s.expiresAt > now);
      activeList.push(...createdStories);
      localStorage.setItem('active_stories', JSON.stringify(activeList));

      // Save to Archive if enabled
      if (saveToArchive) {
        const rawArchived = localStorage.getItem(`archived_stories_${userProfile.id}`);
        let archivedList = [];
        if (rawArchived) {
          try {
            archivedList = JSON.parse(rawArchived);
          } catch (e) {}
        }
        archivedList.unshift(...createdStories);
        localStorage.setItem(`archived_stories_${userProfile.id}`, JSON.stringify(archivedList));
      }

      // Save to Highlights (permanence in profile beyond 24h)
      if (saveToHighlights) {
        const rawHighlights = localStorage.getItem(`highlights_${userProfile.id}`);
        let highlightsList = [];
        if (rawHighlights) {
          try {
            highlightsList = JSON.parse(rawHighlights);
          } catch (e) {}
        }
        const newHi = {
          id: 'highlight-' + now,
          title: baseTitle.toLowerCase().replace(/\s+/g, '_').substring(0, 15),
          image: mediaSource,
          isVideo: isVideoMedia
        };
        highlightsList.unshift(newHi);
        localStorage.setItem(`highlights_${userProfile.id}`, JSON.stringify(highlightsList));
      }

      // Dispatch global stories-updated event so other views refresh instantly
      window.dispatchEvent(new CustomEvent('stories-updated'));

      if (onStoriesCreated) {
        onStoriesCreated(createdStories);
      }

      setPublishSuccess(true);
      setTimeout(() => {
        setPublishSuccess(false);
        onClose();
      }, 1600);

    } catch (e: any) {
      alert("Error al procesar la historia: " + e.message);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2500] w-full h-full flex flex-col justify-between overflow-hidden bg-transparent select-none animate-fade-in pointer-events-auto">
      {/* Background layer click to see page / dismiss */}
      <div 
        className="absolute inset-0 w-full h-full bg-transparent cursor-pointer"
        onClick={onClose}
        title="Haz clic en cualquier parte fuera de la ventana para ver la página de fondo"
      />

      <div className="w-full h-full flex flex-col justify-between overflow-hidden bg-transparent relative pointer-events-none">
        
        {/* Hidden Canvas for Photo capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Peek background floating indicator */}
        {isPeekingBackground && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[2600] flex items-center gap-2.5 bg-slate-900/90 text-white px-5 py-2.5 rounded-full shadow-2xl border border-white/20 animate-fade-in backdrop-blur-md pointer-events-auto">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold">Viendo página completa de fondo</span>
            <button
              type="button"
              onClick={() => setIsPeekingBackground(false)}
              className="ml-2 px-3 py-1 rounded-full bg-[#fe2c55] hover:bg-rose-600 text-white text-xs font-black transition cursor-pointer"
            >
              Volver a la Historia
            </button>
          </div>
        )}

        {/* Top Header - Translucent Clean Light Glassmorphism */}
        <div className={`px-4 sm:px-8 py-3 sm:py-3.5 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-white/95 backdrop-blur-md shadow-xs text-slate-800 relative z-10 pointer-events-auto transition-opacity duration-300 ${isPeekingBackground ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-xl shadow-md shrink-0 text-white">
              📸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-sm sm:text-base tracking-tight">
                  Subir una Historia
                </h3>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  ⏱️ 24h
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wider hidden md:inline-block">
                  ✨ Fondo Visible
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden xs:block">
                Contenido efímero vertical (9:16) visible en la barra superior y perfil durante 24 horas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPeekingBackground(true)}
              className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition flex items-center gap-1.5 border border-slate-200 cursor-pointer shadow-xs"
              title="Ocultar paneles temporalmente para ver la página completa de fondo"
            >
              <Eye className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Ver fondo</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition cursor-pointer border border-slate-200 shadow-xs"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Light Frosted Glassmorphism */}
        <div className={`px-4 sm:px-8 pt-2 flex items-center gap-2 sm:gap-4 border-b border-slate-200/80 bg-white/90 backdrop-blur-md text-xs font-bold shrink-0 relative z-10 pointer-events-auto transition-opacity duration-300 ${isPeekingBackground ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button
            type="button"
            onClick={() => setActiveTab('record')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'record'
                ? 'border-[#fe2c55] text-[#fe2c55] font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4 text-rose-500" />
            <span>Grabarse en Directo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'upload'
                ? 'border-[#fe2c55] text-[#fe2c55] font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4 text-amber-500" />
            <span>Subir Archivo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-2.5 px-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'specs'
                ? 'border-[#fe2c55] text-[#fe2c55] font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4 text-sky-500" />
            <span>Requisitos Técnicos</span>
          </button>
        </div>

        {/* Main Body Content - Page clearly visible in the background */}
        <div className={`p-3 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center w-full transition-opacity duration-300 relative z-10 pointer-events-auto ${isPeekingBackground ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          
          {/* ======================================================== */}
          {/* TAB 1: GRABARSE EN DIRECTO (LIVE CAMERA & RECORDING)     */}
          {/* ======================================================== */}
          {activeTab === 'record' && (
            <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 py-2">
              
              {/* Viewfinder Frame (9:16 Portrait Ratio) Centered with Background Visible Around */}
              <div className="relative h-[56vh] xs:h-[60vh] sm:h-[65vh] md:h-[68vh] max-h-[660px] aspect-[9/16] rounded-3xl overflow-hidden bg-black border-2 border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center group shrink-0">
                
                {/* 1. Recorded Video Preview */}
                {recordedVideoUrl ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <video
                      src={recordedVideoUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                      ✅ Vídeo Listo ({recordingSeconds}s)
                    </div>
                  </div>
                ) : capturedPhotoUrl ? (
                  /* 2. Captured Photo Preview */
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <img
                      src={capturedPhotoUrl}
                      alt="Captured story"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                      ✅ Foto Lista (5-7s)
                    </div>
                  </div>
                ) : (
                  /* 3. Active Camera Stream Viewfinder */
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video
                      ref={videoPreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${cameraFacingMode === 'user' ? 'transform -scale-x-100' : ''} ${
                        cameraFilter === 'noir' ? 'grayscale contrast-125' :
                        cameraFilter === 'vintage' ? 'sepia contrast-110 brightness-95' :
                        cameraFilter === 'glamour' ? 'contrast-105 saturate-125 brightness-105' :
                        cameraFilter === 'neon' ? 'saturate-200 hue-rotate-15 contrast-110' : ''
                      }`}
                    />

                    {/* Camera Overlay Indicators */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-20">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider text-white border border-white/10">
                        {isRecording ? 'GRABANDO LIVE' : 'CÁMARA LIVE'}
                      </span>
                    </div>

                    {/* 9:16 Aspect Guide Badge */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-[9px] font-mono text-slate-300 border border-white/10">
                      9:16 HD
                    </div>

                    {/* Live Recording Countdown Timer (up to 60s) */}
                    {isRecording && (
                      <div className="absolute bottom-20 inset-x-0 flex flex-col items-center gap-1 z-20">
                        <div className="bg-rose-600/90 text-white px-3 py-1 rounded-full text-xs font-mono font-black shadow-lg flex items-center gap-1.5 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-white" />
                          <span>00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds} / 01:00</span>
                        </div>
                        {/* Progress Bar of 60 seconds */}
                        <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-rose-500 transition-all duration-300"
                            style={{ width: `${(recordingSeconds / 60) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Error prompt if camera access failed */}
                    {cameraError && (
                      <div className="absolute inset-0 bg-slate-950/90 p-4 flex flex-col items-center justify-center text-center space-y-2 z-30 text-white">
                        <AlertCircle className="w-8 h-8 text-rose-500" />
                        <p className="text-xs text-rose-300 leading-tight">{cameraError}</p>
                        <button
                          type="button"
                          onClick={startCamera}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          Reintentar conexión
                        </button>
                      </div>
                    )}

                    {/* Shutter / Record Control Overlay at Bottom */}
                    <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4 z-20">
                      {recordMode === 'video' ? (
                        /* Video Record Toggle Button */
                        <button
                          type="button"
                          onClick={isRecording ? handleStopRecording : handleStartRecording}
                          className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center transition-all cursor-pointer shadow-2xl active:scale-95 ${
                            isRecording 
                              ? 'bg-rose-600 scale-105 animate-pulse' 
                              : 'bg-rose-500 hover:bg-rose-600'
                          }`}
                          title={isRecording ? "Detener Grabación" : "Grabar Historia (hasta 60s)"}
                        >
                          {isRecording ? (
                            <div className="w-6 h-6 rounded-md bg-white" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-white" />
                          )}
                        </button>
                      ) : (
                        /* Photo Shutter Button */
                        <button
                          type="button"
                          onClick={handleCapturePhoto}
                          className="w-16 h-16 rounded-full border-4 border-white bg-white/80 hover:bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xl active:scale-95"
                          title="Tomar Foto Instantánea"
                        >
                          <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-white" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Controls, Captions & Settings in Clean Light Glassmorphism */}
              <div className="w-full lg:w-96 bg-white/95 backdrop-blur-md p-5 rounded-3xl border border-slate-200/90 shadow-xl space-y-4 text-left text-slate-800 shrink-0">
                {/* Mode switch & Camera Controls */}
                {!recordedVideoUrl && !capturedPhotoUrl && (
                  <div className="space-y-2.5">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Modo de Grabación
                    </label>
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
                      <button
                        type="button"
                        onClick={() => setRecordMode('video')}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          recordMode === 'video' ? 'bg-[#fe2c55] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Vídeo (60s)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecordMode('photo')}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          recordMode === 'photo' ? 'bg-[#fe2c55] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Foto</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleToggleFacingMode}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer border border-slate-200 flex items-center gap-1.5 shadow-2xs"
                        title="Girar cámara (Frontal / Trasera)"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Girar cámara</span>
                      </button>

                      <select
                        value={cameraFilter}
                        onChange={(e) => setCameraFilter(e.target.value as any)}
                        className="bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs py-1.5 px-2.5 cursor-pointer focus:outline-none font-bold"
                      >
                        <option value="normal">✨ Normal</option>
                        <option value="glamour">💎 Glamour</option>
                        <option value="vintage">🎞️ Vintage</option>
                        <option value="noir">🎬 Noir B&N</option>
                        <option value="neon">⚡ Neón</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Reset button if already recorded */}
                {(recordedVideoUrl || capturedPhotoUrl) && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleResetRecord}
                      className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-200 shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Descartar y Grabar de nuevo</span>
                    </button>
                  </div>
                )}

                {/* Caption input */}
                <div className="space-y-1 pt-1 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700">
                    Título o texto descriptivo de la historia:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Grabación en directo exclusiva ✨"
                    value={storyCaption}
                    onChange={(e) => setStoryCaption(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-[#fe2c55] focus:bg-white transition"
                  />
                </div>

                {/* Checkbox Options */}
                <div className="grid grid-cols-1 gap-2 text-xs pt-1">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={saveToHighlights}
                      onChange={(e) => setSaveToHighlights(e.target.checked)}
                      className="w-4 h-4 accent-[#fe2c55] rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block text-[11px]">⭐ Guardar en Destacadas</span>
                      <span className="text-[9.5px] text-slate-500 block leading-tight">Permanece en tu perfil más de 24h</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={saveToArchive}
                      onChange={(e) => setSaveToArchive(e.target.checked)}
                      className="w-4 h-4 accent-[#fe2c55] rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block text-[11px]">📁 Guardar en Archivo</span>
                      <span className="text-[9.5px] text-slate-500 block leading-tight">Copia privada indefinida</span>
                    </div>
                  </label>
                </div>

                {/* Technical info note badge */}
                <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 text-[10.5px] text-rose-950 space-y-0.5 leading-snug">
                  <p className="font-bold m-0 flex items-center gap-1 text-[#fe2c55]">
                    <span>ℹ️ Especificaciones técnicas:</span>
                  </p>
                  <p className="m-0 text-slate-600">
                    Vídeos continuos hasta <strong>60 segundos</strong> · Fotos fijas <strong>5-7s</strong> · Permanencia <strong>24 horas</strong>.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: SUBIR ARCHIVO (FILE UPLOAD FOR PHOTO OR VIDEO)    */}
          {/* ======================================================== */}
          {activeTab === 'upload' && (
            <div className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xl space-y-5 text-left text-slate-800">
              
              {/* Drag & Drop Input Zone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#fe2c55] bg-slate-50/80 hover:bg-rose-50/30 p-8 rounded-3xl text-center space-y-3 transition cursor-pointer group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/quicktime,video/mov,image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white text-2xl mx-auto shadow-lg group-hover:scale-110 transition duration-300">
                  📁
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Haz clic o arrastra tu vídeo o foto aquí
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                    Formato vertical recomendado <strong>1080 × 1920 (9:16)</strong>.
                    Vídeos hasta <strong>4 GB</strong> (.mp4, .mov) · Fotos hasta <strong>30 MB</strong> (.jpg, .png).
                  </p>
                </div>

                <button
                  type="button"
                  className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition border border-slate-200 inline-block pointer-events-none shadow-2xs"
                >
                  Examinar archivos
                </button>
              </div>

              {/* Upload Error Message */}
              {uploadError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Uploaded File Preview & Auto-Chunking Notice */}
              {uploadedFileUrl && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5 truncate max-w-[240px]">
                      {isUploadedVideo ? '🎥 Vídeo:' : '🖼️ Foto:'} {uploadedFile?.name}
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      {(uploadedFile!.size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>

                  {/* Automatic 60s Splitting Notice for long videos */}
                  {isUploadedVideo && (
                    <div className={`p-3 rounded-xl border text-xs leading-relaxed space-y-1 ${
                      videoDuration > 60 
                        ? 'bg-amber-50 border-amber-200 text-amber-900' 
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}>
                      <div className="font-extrabold flex items-center gap-1.5">
                        {videoDuration > 60 ? '✂️ División Automática en historias de 60s' : '✅ Duración Continua Correcta'}
                      </div>
                      <p className="text-[11px] opacity-90 m-0">
                        {videoDuration > 60 ? (
                          <>
                            Tu vídeo dura <strong>{videoDuration} segundos</strong>. La app lo dividirá automáticamente en <strong>{videoChunksCount} fragmentos continuos de hasta 60 segundos cada uno</strong> (sin cortarse) para que se reproduzcan de forma fluida y consecutiva.
                          </>
                        ) : (
                          <>
                            Clip de <strong>{videoDuration} segundos</strong>. Se publicará como una historia continua sin cortarse (máx. 60 segundos permitidos).
                          </>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Media Preview Box */}
                  <div className="w-32 aspect-[9/16] rounded-2xl overflow-hidden mx-auto bg-black border border-slate-300 shadow-md">
                    {isUploadedVideo ? (
                      <video src={uploadedFileUrl} controls className="w-full h-full object-cover" />
                    ) : (
                      <img src={uploadedFileUrl} alt="Upload preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
              )}

              {/* Title & Toggles for Upload */}
              <div className="space-y-2.5 text-left pt-2 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Título o texto descriptivo:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Look de temporada en vídeo ✨"
                    value={storyCaption}
                    onChange={(e) => setStoryCaption(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-[#fe2c55] focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={saveToHighlights}
                      onChange={(e) => setSaveToHighlights(e.target.checked)}
                      className="w-4 h-4 accent-[#fe2c55] rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block text-[11px]">⭐ Guardar en Destacadas</span>
                      <span className="text-[9.5px] text-slate-500 block leading-tight">Permanece en tu perfil más de 24h</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={saveToArchive}
                      onChange={(e) => setSaveToArchive(e.target.checked)}
                      className="w-4 h-4 accent-[#fe2c55] rounded cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block text-[11px]">📁 Guardar en Archivo</span>
                      <span className="text-[9.5px] text-slate-500 block leading-tight">Copia privada indefinida</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Quick Inspiration Presets */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-left">
                <span className="text-[11px] font-bold text-slate-600 block">
                  O elige un contenido rápido de pasarela:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STORY_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(preset.url);
                        setUploadedFileUrl(preset.url);
                        setIsUploadedVideo(preset.isVideo);
                        setVideoDuration(preset.duration);
                        setVideoChunksCount(1);
                        setUploadedFile({ name: preset.name, size: 5 * 1024 * 1024 } as any);
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                        selectedPreset === preset.url 
                          ? 'border-[#fe2c55] bg-rose-50 text-[#fe2c55]' 
                          : 'border-slate-200 bg-slate-50/80 hover:bg-white text-slate-800 shadow-2xs'
                      }`}
                    >
                      {preset.isVideo ? (
                        <video src={preset.url} className="w-10 h-10 object-cover rounded-lg shrink-0" muted />
                      ) : (
                        <img src={preset.url} alt={preset.name} className="w-10 h-10 object-cover rounded-lg shrink-0" referrerPolicy="no-referrer" />
                      )}
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold block truncate">{preset.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {preset.isVideo ? `Vídeo ${preset.duration}s` : `Foto ${preset.duration}s`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: ESPECIFICACIONES TÉCNICAS (TECHNICAL SPECS VIEW)  */}
          {/* ======================================================== */}
          {activeTab === 'specs' && (
            <div className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xl space-y-5 text-left text-slate-800">
              
              <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-rose-600 font-black text-xs uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  <span>1. Duración en Tiempo</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                  <p>
                    🎥 <strong className="text-slate-900">Vídeos:</strong> Un clip de vídeo puede durar hasta <strong>60 segundos (1 minuto)</strong> de forma continua en una sola historia sin cortarse. <em>(Si subes un vídeo más largo de 60 segundos, la app lo dividirá automáticamente en fragmentos de hasta 60 segundos cada uno).</em>
                  </p>
                  <p>
                    🖼️ <strong className="text-slate-900">Fotos fijas:</strong> Se muestran en pantalla durante unos <strong>5 a 7 segundos</strong> de forma predeterminada antes de pasar a la siguiente historia.
                  </p>
                  <p>
                    ⏳ <strong className="text-slate-900">Permanencia en el perfil:</strong> La historia permanece visible durante <strong>24 horas</strong> (a menos que la guardes en Historias destacadas).
                  </p>
                </div>
              </div>

              <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-600 font-black text-xs uppercase tracking-wider">
                  <Smartphone className="w-4 h-4" />
                  <span>2. Dimensiones y Peso de Archivo (Tamaño Técnico)</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                  <p>
                    📐 <strong className="text-slate-900">Resolución recomendada:</strong> <strong>1080 × 1920 píxeles</strong> (proporción vertical 9:16).
                  </p>
                  <p>
                    ⚖️ <strong className="text-slate-900">Vídeos:</strong> Se recomienda que no superen los <strong>4 GB</strong> (formatos recomendados: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">.mp4</code> o <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">.mov</code> codificados en H.264).
                  </p>
                  <p>
                    📷 <strong className="text-slate-900">Imágenes / Fotos:</strong> Máximo <strong>30 MB</strong> (formatos <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">.jpg</code> o <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px]">.png</code>).
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions - Translucent Glassmorphism */}
        <div className={`px-4 sm:px-8 py-3 sm:py-3.5 border-t border-slate-200/80 flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md shrink-0 shadow-lg text-slate-800 relative z-10 pointer-events-auto transition-opacity duration-300 ${isPeekingBackground ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition cursor-pointer border border-slate-200 shadow-xs"
          >
            Cancelar
          </button>

          {activeTab !== 'specs' ? (
            <button
              type="button"
              disabled={isPublishing || (!recordedVideoUrl && !capturedPhotoUrl && !uploadedFileUrl && !selectedPreset)}
              onClick={handlePublish}
              className={`px-6 py-2.5 rounded-xl font-serif font-black text-xs flex items-center gap-2 transition cursor-pointer shadow-lg ${
                isPublishing || (!recordedVideoUrl && !capturedPhotoUrl && !uploadedFileUrl && !selectedPreset)
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-gradient-to-r from-[#fe2c55] to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white hover:scale-[1.02] active:scale-95 shadow-rose-500/25 border border-rose-400/30'
              }`}
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Publicando...</span>
                </>
              ) : publishSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>¡Historia Publicada!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {videoChunksCount > 1 
                      ? `Publicar ${videoChunksCount} Fragmentos de Historia (60s)` 
                      : 'Publicar Historia Directamente'}
                  </span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveTab('record')}
              className="px-5 py-2.5 rounded-xl bg-[#fe2c55] hover:bg-rose-600 text-white text-xs font-black transition cursor-pointer shadow-md"
            >
              ¡Comenzar a Crear Historia!
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
