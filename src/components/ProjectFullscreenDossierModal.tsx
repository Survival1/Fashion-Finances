import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, CheckCircle2 } from 'lucide-react';
import { openImageLightbox } from './GlobalMobileImageLightbox';

interface ProjectFullscreenDossierModalProps {
  detailProjectUser?: any;
  showProjectDetailsInPopup?: boolean;
  activeFinanzasPopupUser?: any;
  selectedFinanzasUser?: any;
  currentFinanzasSession?: any;
  getFinanzasProjectDetails?: (userId: string) => any;
  customProjectMedia?: Record<string, Array<{ id: string; type: 'image' | 'video'; url: string; title: string }>>;
  setCustomProjectMedia?: React.Dispatch<React.SetStateAction<Record<string, Array<{ id: string; type: 'image' | 'video'; url: string; title: string }>>>>;
  newMediaImageUrl?: string;
  setNewMediaImageUrl?: React.Dispatch<React.SetStateAction<string>>;
  newMediaVideoUrl?: string;
  setNewMediaVideoUrl?: React.Dispatch<React.SetStateAction<string>>;
  detailModalStep?: 'all' | 'basic' | 'finance' | 'team';
  setDetailModalStep?: React.Dispatch<React.SetStateAction<'all' | 'basic' | 'finance' | 'team'>>;
  onClose: () => void;
  onVoteProject?: (user: any) => void;
}

export const ProjectFullscreenDossierModal: React.FC<ProjectFullscreenDossierModalProps> = ({
  detailProjectUser,
  activeFinanzasPopupUser,
  selectedFinanzasUser,
  currentFinanzasSession,
  getFinanzasProjectDetails,
  customProjectMedia = {},
  onClose,
}) => {
  // Resolve participant and details
  const activeProjUser = detailProjectUser || activeFinanzasPopupUser || selectedFinanzasUser || currentFinanzasSession?.presenter || currentFinanzasSession?.participants?.[0] || {
    id: 'user-adriana',
    name: 'Adriana Lima (Tú)',
    username: 'adrianalima',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
    role: 'Participante Activa (Tú)'
  };

  const userId = (activeProjUser.username || activeProjUser.id || '').toLowerCase();
  const isAdriana = userId.includes('adriana') || activeProjUser.name?.toLowerCase().includes('adriana') || activeProjUser.isSelf || activeProjUser.isHost;

  const proj = getFinanzasProjectDetails ? getFinanzasProjectDetails(isAdriana ? 'user-adriana' : activeProjUser.id) : {
    title: "Victoria's Secret Runway & Eco-Couture Sostenible",
    category: "Alta Costura & Lencería de Lujo"
  };

  // Find images
  const userMedia = customProjectMedia[activeProjUser.id] || 
    (activeProjUser.username && customProjectMedia[activeProjUser.username]) ||
    customProjectMedia['user-adriana'] || 
    customProjectMedia['adrianalima'] || 
    customProjectMedia['default'] || [];

  const imgMedia = userMedia.filter((m: any) => m.type === 'image');
  const defaultImages = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=85&w=1400',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=85&w=1400',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=85&w=1400'
  ];

  const photosList: string[] = imgMedia.length > 0 
    ? imgMedia.map((m: any) => m.url) 
    : (isAdriana ? defaultImages : [activeProjUser.avatar || defaultImages[0]]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Redirigir directamente al lightbox en pantalla completa
  useEffect(() => {
    const galleryItems = photosList.map((url, idx) => ({
      src: url,
      alt: `${proj.title || activeProjUser.name} - ${idx + 1}`,
      title: proj.title || activeProjUser.name || 'Proyecto Oficial',
      subtitle: `${activeProjUser.name || 'Líder del Proyecto'} • ${proj.category || 'Alta Costura'}`,
      badge: 'PROYECTO AUDITADO Y VERIFICADO'
    }));

    openImageLightbox({
      src: photosList[0],
      alt: proj.title || activeProjUser.name,
      title: proj.title || activeProjUser.name || 'Proyecto Oficial',
      subtitle: `${activeProjUser.name || 'Líder del Proyecto'} • ${proj.category || 'Alta Costura'}`,
      badge: 'PROYECTO AUDITADO Y VERIFICADO',
      images: galleryItems,
      currentIndex: 0
    });
  }, []);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? photosList.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === photosList.length - 1 ? 0 : prev + 1));
  };

  const handleOpenLightbox = () => {
    const galleryItems = photosList.map((url, idx) => ({
      src: url,
      alt: `${proj.title || activeProjUser.name} - ${idx + 1}`,
      title: proj.title || activeProjUser.name || 'Proyecto Oficial',
      subtitle: `${activeProjUser.name || 'Líder del Proyecto'} • ${proj.category || 'Alta Costura'}`,
      badge: 'PROYECTO AUDITADO Y VERIFICADO'
    }));

    openImageLightbox({
      src: photosList[currentIndex],
      alt: proj.title || activeProjUser.name,
      title: proj.title || activeProjUser.name || 'Proyecto Oficial',
      subtitle: `${activeProjUser.name || 'Líder del Proyecto'} • ${proj.category || 'Alta Costura'}`,
      badge: 'PROYECTO AUDITADO Y VERIFICADO',
      images: galleryItems,
      currentIndex
    });
  };

  return (
    <div 
      id="channel-project-fullscreen-image-view"
      className="fixed inset-0 z-[9999] w-full h-full bg-[#070b14]/98 text-white flex flex-col font-sans select-none animate-fade-in overflow-hidden backdrop-blur-md"
    >
      {/* 🌟 BARRA SUPERIOR ELEGANTE */}
      <header className="w-full bg-[#0e1628]/95 border-b border-slate-800/80 px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 text-white shrink-0 z-30 shadow-2xl">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3 sm:px-4 py-2 rounded-xl bg-[#131c31] hover:bg-[#1a2542] text-white font-extrabold text-xs flex items-center gap-2 transition border border-slate-700 cursor-pointer shrink-0 active:scale-95 shadow-md"
            title="Volver a la retransmisión"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span className="font-extrabold text-xs tracking-wider uppercase">Volver al Directo</span>
          </button>

          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-700/80 min-w-0">
            <span className="text-xs sm:text-sm font-black text-white truncate font-display">
              {proj.title}
            </span>
            <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Verificado
            </span>
          </div>
        </div>

        {/* Presenter Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleOpenLightbox}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs"
            title="Zoom pantalla completa"
          >
            <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Ampliar</span>
          </button>

          <div className="flex items-center gap-2 bg-[#070b14]/90 border border-slate-700/80 px-3 py-1.5 rounded-full shadow-inner">
            <img
              src={activeProjUser.avatar}
              alt={activeProjUser.name}
              className="w-6 h-6 rounded-full object-cover border border-emerald-400 shrink-0"
              referrerPolicy="no-referrer"
            />
            <span className="text-xs font-black text-white truncate max-w-[120px] sm:max-w-none">
              {activeProjUser.name}
            </span>
          </div>
        </div>
      </header>

      {/* 🖼️ VISUALIZADOR DE IMAGEN EN PANTALLA COMPLETA */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center p-3 sm:p-6 overflow-hidden bg-radial from-slate-900/60 via-[#070b14] to-[#04060b]">
        {/* Imagen principal */}
        <div className="relative max-w-full max-h-full flex items-center justify-center group">
          <img
            key={currentIndex}
            src={photosList[currentIndex]}
            alt={`${proj.title} - ${currentIndex + 1}`}
            referrerPolicy="no-referrer"
            onClick={handleOpenLightbox}
            className="max-h-[80vh] sm:max-h-[84vh] w-auto max-w-full object-contain rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700/80 transition-all duration-300 cursor-pointer select-none"
            title="Clic para ampliar imagen"
          />

          {/* Insignia sobre la foto */}
          <div className="absolute top-3.5 left-3.5 z-20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 border bg-slate-950/80 text-white border-white/20 select-none shadow-xl pointer-events-none">
            <span>📷 {currentIndex + 1} / {photosList.length} FOTOS</span>
          </div>
        </div>

        {/* Flecha anterior */}
        {photosList.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 flex items-center justify-center transition hover:scale-110 active:scale-95 cursor-pointer shadow-2xl backdrop-blur-md"
            title="Foto anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Flecha siguiente */}
        {photosList.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-white/20 flex items-center justify-center transition hover:scale-110 active:scale-95 cursor-pointer shadow-2xl backdrop-blur-md"
            title="Siguiente foto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Puntos de paginación inferiores */}
        {photosList.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-full bg-slate-900/80 border border-white/20 shadow-xl">
            {photosList.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 bg-rose-500 shadow-xs'
                    : 'w-2 bg-white/40 hover:bg-white/80'
                }`}
                title={`Ver imagen ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
