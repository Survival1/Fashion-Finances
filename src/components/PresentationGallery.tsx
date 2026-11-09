import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  Upload, 
  Plus, 
  Trash2, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Link as LinkIcon, 
  Sparkles,
  Maximize2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { compressAndResizeImage } from '../utils/imageCompressor';

interface PresentationGalleryProps {
  modelId: string;
  modelUsername?: string;
  modelName?: string;
  defaultPhotos?: string[];
  isEditingParent?: boolean;
}

// High-fashion fallback portfolio photoshoot images
const DEFAULT_EDITORIAL_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=900',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=900'
];

export default function PresentationGallery({
  modelId,
  modelUsername,
  modelName = 'Modelo',
  defaultPhotos,
  isEditingParent = false
}: PresentationGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storageKey = `custom_presentation_gallery_${modelId || modelUsername || 'default'}`;

  // State
  const [images, setImages] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.slice(0, 10);
          }
        }
      } catch (e) {
        console.error('Error loading gallery from localStorage:', e);
      }
    }
    // Fallback to provided photos or editorial defaults
    if (defaultPhotos && defaultPhotos.length > 0) {
      return defaultPhotos.slice(0, 10);
    }
    return DEFAULT_EDITORIAL_PHOTOS;
  });

  const [activeViewerIndex, setActiveViewerIndex] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'warning' | 'error' } | null>(null);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Sync to localStorage
  const saveImages = useCallback((newImages: string[]) => {
    const capped = newImages.slice(0, 10);
    setImages(capped);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(capped));
        if (modelId) {
          localStorage.setItem(`custom_presentation_gallery_${modelId}`, JSON.stringify(capped));
        }
        if (modelUsername) {
          localStorage.setItem(`custom_presentation_gallery_${modelUsername.toLowerCase()}`, JSON.stringify(capped));
        }
        // Always mirror for top model Adriana Lima and default
        if (!modelId || modelId === 'topf-1' || modelUsername?.toLowerCase().includes('adriana')) {
          localStorage.setItem('custom_presentation_gallery_adrianalima', JSON.stringify(capped));
          localStorage.setItem('custom_presentation_gallery_adrianalima_w1', JSON.stringify(capped));
          localStorage.setItem('custom_presentation_gallery_topf-1', JSON.stringify(capped));
        }
        localStorage.setItem('custom_presentation_gallery_default', JSON.stringify(capped));

        // Dispatch window sync event
        window.dispatchEvent(new CustomEvent('custom_gallery_updated', { 
          detail: { images: capped, modelId, modelUsername } 
        }));
      } catch (err) {
        console.error('Error saving presentation gallery:', err);
      }
    }
  }, [storageKey, modelId, modelUsername]);

  // Ensure initial images are saved to localStorage so z.png can always access them immediately
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(storageKey);
      if (!existing && images.length > 0) {
        saveImages(images);
      }
    }
  }, [storageKey, images, saveImages]);

  const showToast = (text: string, type: 'success' | 'warning' | 'error' = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  // Handle file uploads (up to 10 max)
  const handleFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) {
      showToast('Por favor selecciona archivos de imagen válidos (JPG, PNG, WEBP).', 'error');
      return;
    }

    const availableSlots = 10 - images.length;
    if (availableSlots <= 0) {
      showToast('Ya has alcanzado el límite máximo de 10 imágenes.', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      const filesToProcess = files.slice(0, availableSlots);
      const compressedUrls: string[] = [];

      for (const file of filesToProcess) {
        try {
          const compressed = await compressAndResizeImage(file, 1200, 1200, 0.85);
          compressedUrls.push(compressed);
        } catch (err) {
          console.error('Error compressing image:', err);
        }
      }

      if (compressedUrls.length > 0) {
        const nextImages = [...images, ...compressedUrls].slice(0, 10);
        saveImages(nextImages);

        if (files.length > availableSlots) {
          showToast(`Se subieron ${compressedUrls.length} imágenes (máximo 10 permitidas).`, 'warning');
        } else {
          showToast(`¡${compressedUrls.length} imagen${compressedUrls.length > 1 ? 'es subidas' : ' subida'} con éxito!`, 'success');
        }
      }
    } catch (error) {
      console.error('Error processing uploads:', error);
      showToast('Hubo un problema al procesar las imágenes.', 'error');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Add image by URL
  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) return;

    if (images.length >= 10) {
      showToast('Ya has alcanzado el límite máximo de 10 imágenes.', 'warning');
      return;
    }

    const nextImages = [...images, cleanUrl].slice(0, 10);
    saveImages(nextImages);
    setUrlInput('');
    setShowUrlDialog(false);
    showToast('Imagen añadida a la galería con éxito.', 'success');
  };

  // Delete image
  const handleDeleteImage = (indexToRemove: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextImages = images.filter((_, idx) => idx !== indexToRemove);
    saveImages(nextImages);

    // If currently viewing deleted image
    if (activeViewerIndex !== null) {
      if (nextImages.length === 0) {
        setActiveViewerIndex(null);
      } else if (activeViewerIndex >= nextImages.length) {
        setActiveViewerIndex(nextImages.length - 1);
      }
    }
    showToast('Imagen eliminada de la galería.', 'success');
  };

  // Keyboard navigation for viewer
  useEffect(() => {
    if (activeViewerIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveViewerIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveViewerIndex(prev => (prev !== null ? (prev + 1) % images.length : null));
      } else if (e.key === 'ArrowLeft') {
        setActiveViewerIndex(prev => (prev !== null ? (prev - 1 + images.length) % images.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeViewerIndex, images.length]);

  return (
    <div className="space-y-3 pt-2">
      {/* Header bar with title, counter & actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-bold text-[#e11d48] uppercase tracking-wider font-sans flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-rose-500" />
            Book Oficial y Fotos ({images.length}/10)
          </span>
          <span className="text-[10px] sm:text-[10.5px] font-semibold text-slate-400 font-sans">
            Hasta 10 imágenes
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          {images.length < 10 && (
            <>
              {/* File upload button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition active:scale-95 cursor-pointer bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 shadow-2xs hover:border-rose-300 disabled:opacity-50"
                title="Subir imágenes desde tu dispositivo"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Subiendo...' : 'Subir Fotos'}</span>
              </button>

              {/* URL button */}
              <button
                type="button"
                onClick={() => setShowUrlDialog(true)}
                className="p-1 sm:px-2 sm:py-1 rounded-xl text-[11px] sm:text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 transition cursor-pointer"
                title="Añadir imagen por enlace web"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline ml-1">URL</span>
              </button>
            </>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
              }
            }}
          />
        </div>
      </div>

      {/* URL Input Modal/Popover */}
      {showUrlDialog && (
        <form onSubmit={handleAddUrl} className="bg-white border border-rose-200 rounded-2xl p-3 shadow-md space-y-2 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800">Añadir imagen por enlace directo:</span>
            <button
              type="button"
              onClick={() => setShowUrlDialog(false)}
              className="text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://ejemplo.com/foto-alta-resolucion.jpg"
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Añadir
            </button>
          </div>
        </form>
      )}

      {/* Drag & Drop Zone or Photos Grid */}
      <div 
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
          }
        }}
        className={`relative rounded-[22px] p-2.5 sm:p-3 transition-all ${
          isDragging 
            ? 'bg-rose-50/80 border-2 border-dashed border-rose-400' 
            : 'bg-white border border-slate-200/80 shadow-xs'
        }`}
      >
        {/* Images Grid (2 cols mobile, 3 cols tablet, 5 cols desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
          {images.map((imgUrl, index) => (
            <div
              key={`${imgUrl.slice(0, 32)}-${index}`}
              onClick={() => setActiveViewerIndex(index)}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-slate-900 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
            >
              {/* Image element */}
              <img
                src={imgUrl}
                alt={`Book ${modelName} - Foto ${index + 1}`}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Number Badge */}
              <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold font-mono tracking-wider border border-white/20">
                #{index + 1}
              </div>

              {/* Hover Overlay with View & Delete Actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2">
                {/* Delete button (top right) */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={(e) => handleDeleteImage(index, e)}
                    className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white shadow-sm transition active:scale-90 cursor-pointer"
                    title="Eliminar esta foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* View button in center/bottom */}
                <div className="flex items-center justify-center gap-1.5 text-white text-[11px] font-bold bg-white/20 backdrop-blur-md py-1.5 px-2 rounded-lg border border-white/30">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Ver foto</span>
                </div>
              </div>
            </div>
          ))}

          {/* Inline Upload Tile when under 10 images */}
          {images.length < 10 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="aspect-[4/5] rounded-xl border-2 border-dashed border-stone-300 hover:border-rose-400 bg-stone-50 hover:bg-rose-50/50 flex flex-col items-center justify-center p-3 text-center transition-all duration-200 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-stone-200 group-hover:bg-rose-100 flex items-center justify-center text-stone-600 group-hover:text-rose-600 transition-colors mb-1.5">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold text-stone-700 group-hover:text-rose-600 transition-colors">
                Añadir Foto
              </span>
              <span className="text-[9px] text-stone-400 font-medium mt-0.5">
                {10 - images.length} restante{10 - images.length > 1 ? 's' : ''}
              </span>
            </button>
          )}
        </div>

        {/* Empty state if user deleted all photos */}
        {images.length === 0 && (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-stone-700">Aún no hay fotos en este book</p>
            <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
              Sube hasta 10 fotos oficiales en alta resolución para que tus seguidores e inversores puedan ver tu book.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Subir primera foto
            </button>
          </div>
        )}
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className={`p-2 rounded-xl text-xs font-medium flex items-center gap-2 animate-fade-in ${
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
            : feedbackMessage.type === 'warning'
            ? 'bg-amber-50 text-amber-700 border border-amber-200'
            : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          {feedbackMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* =========================================================================
          HIGH-DEFINITION LIGHTBOX / VISOR INTERACTIVO DE FOTOS
      ========================================================================= */}
      {activeViewerIndex !== null && images[activeViewerIndex] && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col justify-between animate-fade-in select-none"
          onClick={() => setActiveViewerIndex(null)}
        >
          {/* Top Bar of Viewer */}
          <div 
            className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-black/50 border-b border-white/10 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title & Counter */}
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-xs sm:text-sm font-sans tracking-wide">
                Book Oficial de {modelName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-mono font-semibold">
                {activeViewerIndex + 1} de {images.length}
              </span>
            </div>

            {/* Top Right Viewer Actions */}
            <div className="flex items-center gap-2">
              {/* Delete button in viewer */}
              <button
                type="button"
                onClick={() => handleDeleteImage(activeViewerIndex)}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition cursor-pointer"
                title="Eliminar esta foto del book"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Download / Open direct image button */}
              <a
                href={images[activeViewerIndex]}
                target="_blank"
                rel="noreferrer"
                download={`foto-book-${activeViewerIndex + 1}.jpg`}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                title="Descargar o abrir imagen completa"
              >
                <Download className="w-4 h-4" />
              </a>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveViewerIndex(null)}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
                title="Cerrar visor (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Photo Center Container */}
          <div 
            className="flex-1 relative flex items-center justify-center p-4 sm:p-8 overflow-hidden"
            onClick={() => setActiveViewerIndex(null)}
          >
            {/* Previous Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveViewerIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : 0));
                }}
                className="absolute left-3 sm:left-6 z-20 p-3 sm:p-3.5 rounded-full bg-black/60 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 transition active:scale-95 cursor-pointer shadow-xl"
                title="Foto anterior (Flecha izquierda)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Current Active Image */}
            <div 
              className="max-w-[92vw] max-h-[75vh] flex items-center justify-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[activeViewerIndex]}
                alt={`Foto ${activeViewerIndex + 1}`}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10"
              />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveViewerIndex((prev) => (prev !== null ? (prev + 1) % images.length : 0));
                }}
                className="absolute right-3 sm:right-6 z-20 p-3 sm:p-3.5 rounded-full bg-black/60 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 transition active:scale-95 cursor-pointer shadow-xl"
                title="Foto siguiente (Flecha derecha)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnail Strip */}
          <div 
            className="p-3 sm:p-4 bg-black/60 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, thumbIdx) => (
              <button
                key={`thumb-${thumbIdx}`}
                type="button"
                onClick={() => setActiveViewerIndex(thumbIdx)}
                className={`relative w-12 h-14 sm:w-14 sm:h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  activeViewerIndex === thumbIdx 
                    ? 'border-rose-500 scale-105 shadow-md shadow-rose-500/30' 
                    : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                }`}
              >
                <img
                  src={img}
                  alt={`Miniatura ${thumbIdx + 1}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0.5 right-0.5 px-1 rounded bg-black/70 text-[9px] text-white font-mono">
                  {thumbIdx + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
