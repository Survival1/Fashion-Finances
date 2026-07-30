/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserSessionProfile } from '../types';
import { 
  Tv, 
  Trash2, 
  Sparkles, 
  Check, 
  X, 
  Play, 
  Pause,
  Clock, 
  MessageSquare, 
  Heart, 
  Music, 
  ExternalLink,
  Film,
  AlertCircle,
  HelpCircle,
  Video
} from 'lucide-react';

interface CastingLiveComment {
  id: string;
  user: string;
  text: string;
  date: string;
  avatar: string;
}

interface CastingLiveVideo {
  id: string;
  modelId?: string; // Connected model profile ID
  username: string;
  name: string;
  avatar: string;
  videoUrl: string;
  coverUrl?: string;
  poster?: string;
  thumbnailUrl?: string;
  likes: number;
  comments: CastingLiveComment[];
  shares: number;
  favorites: number;
  description: string;
  isLiked?: boolean;
  isFavorited?: boolean;
  isFollowing?: boolean;
  music: string;
  category: string;
  uploaderId?: string; // ID of the user who uploaded the video
  trimStart?: number;
  trimEnd?: number;
}

interface UserUploadedVideosProps {
  userProfile: UserSessionProfile;
  onVideoDeleted?: () => void;
}

export default function UserUploadedVideos({ 
  userProfile,
  onVideoDeleted 
}: UserUploadedVideosProps) {
  const [uploadedVideos, setUploadedVideos] = useState<CastingLiveVideo[]>([]);
  const [activePlayId, setActivePlayId] = useState<string | null>(null);
  const [selectedVideoDetails, setSelectedVideoDetails] = useState<CastingLiveVideo | null>(null);

  // Load videos from localStorage
  const loadUserVideos = () => {
    try {
      const cached = localStorage.getItem('coll_casting_live_videos');
      if (cached) {
        const parsed: CastingLiveVideo[] = JSON.parse(cached);
        // Filter those where uploaderId matches the current user
        const userClips = parsed.filter(v => v.uploaderId === userProfile.id);
        const deduplicated: CastingLiveVideo[] = [];
        const seenIds = new Set<string>();
        const seenKeys = new Set<string>();
        for (const item of userClips) {
          if (!item || !item.id) continue;
          const key = item.videoUrl ? `${item.videoUrl}_${item.description || ''}` : item.id;
          if (!seenIds.has(item.id) && !seenKeys.has(key)) {
            deduplicated.push(item);
            seenIds.add(item.id);
            seenKeys.add(key);
          }
        }
        setUploadedVideos(deduplicated);
      } else {
        setUploadedVideos([]);
      }
    } catch (e) {
      console.error('Error loading uploaded videos:', e);
    }
  };

  useEffect(() => {
    loadUserVideos();
    
    // Listen for storage changes (e.g. if uploaded in Casting Live tab in background)
    const handleStorageChange = () => {
      loadUserVideos();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userProfile.id]);

  // Handle deletion of a video
  const handleDeleteVideo = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm('⚠️ ¿Estás seguro de que deseas eliminar este vídeo de tu historial y del feed público de Casting Live?');
    if (!confirmed) return;

    try {
      const cached = localStorage.getItem('coll_casting_live_videos');
      if (cached) {
        const parsed: CastingLiveVideo[] = JSON.parse(cached);
        const filtered = parsed.filter(v => v.id !== videoId);
        localStorage.setItem('coll_casting_live_videos', JSON.stringify(filtered));
        
        // Update local state
        setUploadedVideos(prev => prev.filter(v => v.id !== videoId));
        if (activePlayId === videoId) setActivePlayId(null);
        if (selectedVideoDetails?.id === videoId) setSelectedVideoDetails(null);
        
        if (onVideoDeleted) {
          onVideoDeleted();
        }
        
        // Also remove from saved_videos of all profiles in localStorage to ensure full sync on profiles
        try {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('saved_videos_')) {
              const savedStr = localStorage.getItem(key);
              if (savedStr) {
                try {
                  const parsedSaved = JSON.parse(savedStr);
                  if (Array.isArray(parsedSaved)) {
                    const updatedSaved = parsedSaved.filter((v: any) => v.id !== videoId);
                    localStorage.setItem(key, JSON.stringify(updatedSaved));
                  }
                } catch (err) {
                  console.error(`Error parsing key ${key}:`, err);
                }
              }
            }
          }
        } catch (err) {
          console.error('Error removing from saved_videos list during video delete', err);
        }

        // Emit storage and sync events to keep other tabs synchronized
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('saved_videos_updated'));
      }
    } catch (e) {
      console.error('Error deleting video:', e);
    }
  };

  return (
    <div id="user-uploaded-videos-module" className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden font-sans text-left animate-fade-in">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-100 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
            <Film className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">Mis Vídeos Subidos (Historial)</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Controla, reproduce y analiza las métricas de tus clips creados en la plataforma</p>
          </div>
        </div>

        <div className="bg-slate-50 px-3.5 py-1 text-xs text-slate-500 font-bold rounded-lg border border-slate-100 self-start md:self-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Perfil: @{userProfile.username}</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6">
        {uploadedVideos.length === 0 ? (
          <div className="text-center py-14 max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-350 mx-auto">
              <Video className="w-6 h-6" />
            </div>
            
            <div className="space-y-1.5">
              <h4 className="text-slate-700 font-bold text-xs">No has subido ningún clip de vídeo todavía</h4>
              <p className="text-slate-405 text-[11px] leading-relaxed">
                Para subir contenidos en formato vertical, presiona el botón <strong>"Casting Live"</strong> en la barra de navegación de arriba y pulsa en <strong>"Cargar" 📤</strong>. Podrás vincularlos a tu propia cuenta o a cualquier modelo de patrocinio.
              </p>
            </div>

            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 text-left text-[10.5px] text-indigo-700 flex items-start gap-2 max-w-sm mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0 text-indigo-500 mt-0.5" />
              <span>
                <strong>Privacidad de creación:</strong> Esta sección solo almacena tus clips autorregulados para que mantengas tu historial de branding al día.
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uploadedVideos.map((video) => {
              const isPlaying = activePlayId === video.id;

              return (
                <div 
                  key={video.id} 
                  id={`uploaded-video-card-${video.id}`}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden shadow-3xs flex flex-col justify-between transition-all"
                >
                  {/* Video Player Preview and Floating Actions */}
                  <div className="relative aspect-[9/16] bg-slate-950 overflow-hidden group">
                    <video
                      src={video.videoUrl} 
                      className="w-full h-full object-cover"
                      loop
                      muted
                      playsInline
                      ref={(el) => {
                        if (el) {
                          if (isPlaying) {
                            el.play().catch(() => {});
                          } else {
                            el.pause();
                          }
                        }
                      }}
                    />

                    {/* Overlay controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex flex-col justify-between p-4 opacity-100 transition duration-150">
                      
                      {/* Top Header Row */}
                      <div className="flex justify-between items-center bg-slate-900/45 backdrop-blur-xs p-1.5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-1.5 text-white">
                          <img 
                            src={video.avatar} 
                            alt={video.name} 
                            className="w-5 h-5 rounded-full object-cover border border-white/10"
                          />
                          <span className="text-[10px] font-bold truncate max-w-[100px]">@{video.username}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] uppercase tracking-widest font-extrabold bg-red-500 text-white px-1.5 py-0.5 rounded font-mono">
                            {video.category.replace('-', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Middle Big Play Indicator */}
                      <button
                        onClick={() => setActivePlayId(isPlaying ? null : video.id)}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm p-4 rounded-full transition cursor-pointer"
                        title={isPlaying ? "Pausar vídeo" : "Reproducir vídeo"}
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                        )}
                      </button>

                      {/* Bottom Quick Row */}
                      <div className="text-white space-y-1 mt-auto">
                        <p className="text-[11px] font-medium leading-relaxed drop-shadow-md line-clamp-2">
                          {video.description}
                        </p>
                        
                        <div className="flex items-center gap-1.5 text-[9px] text-slate-300 font-bold select-none">
                          <Music className="w-3 h-3 text-red-400 shrink-0" />
                          <span className="truncate">{video.music}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational Data Bar & Actions */}
                  <div className="p-4 bg-white border-t border-slate-100 flex flex-col justify-between space-y-3">
                    
                    {/* Visual Analytics / Feed Counts */}
                    <div className="grid grid-cols-3 gap-1 grid-flow-row text-center text-slate-500 select-none">
                      <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-center justify-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                        <span className="text-[10px] font-black text-slate-700 font-mono">{video.likes}</span>
                      </div>

                      <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-center justify-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="text-[10px] font-black text-slate-700 font-mono">{video.comments.length}</span>
                      </div>

                      <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-center justify-center gap-1">
                        <span className="text-[10px] text-slate-400">Favs</span>
                        <span className="text-[10px] font-black text-slate-700 font-mono">{video.favorites}</span>
                      </div>
                    </div>

                    {/* Operational Trigger */}
                    <div className="flex justify-between items-center gap-2 pt-1 border-t border-slate-55">
                      <button
                        onClick={() => setSelectedVideoDetails(video)}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold hover:bg-indigo-50 px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3 text-indigo-550" />
                        <span>Ver Detalles</span>
                      </button>

                      <button
                        onClick={(e) => handleDeleteVideo(video.id, e)}
                        className="text-[10px] text-rose-500 hover:text-rose-700 font-bold hover:bg-rose-50 px-2.5 py-1 rounded-md transition flex items-center gap-1 cursor-pointer"
                        title="Eliminar este vídeo permanentemente"
                      >
                        <Trash2 className="w-3 h-3 text-rose-550" />
                        <span>Eliminar</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 📘 POPUP VIDEO DETAIL INSPECTOR */}
        {selectedVideoDetails && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[2500] flex items-center justify-center p-4 select-none">
            <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 overflow-hidden shadow-2xl relative animate-scale-up">
              
              <button
                onClick={() => setSelectedVideoDetails(null)}
                className="absolute top-4 right-4 bg-slate-900/50 hover:bg-slate-900/70 text-white hover:text-slate-100 z-10 cursor-pointer p-1.5 rounded-full backdrop-blur-xs transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="aspect-[9/16] max-h-[480px] bg-black relative">
                <video 
                  src={selectedVideoDetails.videoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 space-y-4 text-left font-sans">
                <div className="flex items-center gap-2">
                  <img 
                    src={selectedVideoDetails.avatar} 
                    alt={selectedVideoDetails.name} 
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{selectedVideoDetails.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">@{selectedVideoDetails.username}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {selectedVideoDetails.description}
                  </p>
                  <p className="text-[10px] text-slate-450 italic font-medium flex items-center gap-1">
                    <Music className="w-3.5 h-3.5 text-indigo-500 inline shrink-0" />
                    <span>{selectedVideoDetails.music}</span>
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="font-mono text-[9px] bg-indigo-50 text-indigo-700 p-1 px-2 rounded-lg">ID: {selectedVideoDetails.id}</span>
                  <div className="flex gap-3">
                    <span className="text-slate-700">❤️ {selectedVideoDetails.likes}</span>
                    <span className="text-slate-700">💬 {selectedVideoDetails.comments.length}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
