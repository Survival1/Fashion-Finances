import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw 
} from 'lucide-react';

export interface LightboxImageItem {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  price?: string;
  badge?: string;
}

export interface LightboxImagePayload extends LightboxImageItem {
  images?: LightboxImageItem[];
  currentIndex?: number;
}

// Global helper to trigger the lightbox programmatically from any component
export function openImageLightbox(payload: LightboxImagePayload) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-image-lightbox', { detail: payload }));
  }
}

export const GlobalMobileImageLightbox: React.FC = () => {
  const [activeImage, setActiveImage] = useState<LightboxImagePayload | null>(null);
  const [galleryList, setGalleryList] = useState<LightboxImageItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  
  // Visual transformations: zoom, rotation & panning
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Drag / pan states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasDraggedRef = useRef<boolean>(false);
  
  // Touch swipe & pinch states
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);

  // Aspect ratio detection for optimal viewport utilization
  const [aspectMode, setAspectMode] = useState<'vertical' | 'horizontal' | 'square'>('vertical');

  const imgRef = useRef<HTMLImageElement | null>(null);

  // Close lightbox handler
  const handleClose = useCallback(() => {
    setActiveImage(null);
    setGalleryList([]);
    setCurrentIndex(0);
    setZoomLevel(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (galleryList.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % galleryList.length);
    setZoomLevel(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, [galleryList.length]);

  const goToPrev = useCallback(() => {
    if (galleryList.length <= 1) return;
    setCurrentIndex(prev => (prev - 1 + galleryList.length) % galleryList.length);
    setZoomLevel(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, [galleryList.length]);

  // Progressive zoom cycling: 100% -> 150% -> 200% -> 300% -> 100%
  const handleCycleZoom = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomLevel(prev => {
      if (prev < 1.4) return 1.5;
      if (prev < 1.9) return 2.0;
      if (prev < 2.9) return 3.0;
      setPosition({ x: 0, y: 0 });
      return 1.0;
    });
  }, []);

  const handleZoomIn = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomLevel(prev => {
      if (prev < 1.4) return 1.5;
      if (prev < 1.9) return 2.0;
      return 3.0;
    });
  };

  const handleZoomOut = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomLevel(prev => {
      if (prev > 2.2) return 2.0;
      if (prev > 1.6) return 1.5;
      setPosition({ x: 0, y: 0 });
      return 1.0;
    });
  };

  const handleResetZoom = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomLevel(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleRotate = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDoubleTapOrClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (zoomLevel > 1) {
      handleResetZoom();
    } else {
      setZoomLevel(2);
    }
  };

  // Keyboard navigation listener
  useEffect(() => {
    if (!activeImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      } else if (e.key.toLowerCase() === 'r') {
        handleRotate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage, handleClose, goToNext, goToPrev]);

  // Prevent background scroll when lightbox is open
  useEffect(() => {
    if (activeImage) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeImage]);

  // Event listener for opening lightbox
  useEffect(() => {
    const handleOpenEvent = (e: any) => {
      if (e?.detail?.src) {
        const payload: LightboxImagePayload = e.detail;
        setActiveImage(payload);
        if (payload.images && Array.isArray(payload.images) && payload.images.length > 0) {
          setGalleryList(payload.images);
          setCurrentIndex(payload.currentIndex ?? 0);
        } else {
          setGalleryList([payload]);
          setCurrentIndex(0);
        }
        setZoomLevel(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('open-image-lightbox', handleOpenEvent);
    return () => window.removeEventListener('open-image-lightbox', handleOpenEvent);
  }, []);

  // Global document click listener for images
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Do not intercept if clicked inside our own lightbox or inside stories tracks/menus
      if (
        target.closest('#global-mobile-image-lightbox') ||
        target.closest('#stories-track-slider') ||
        target.closest('.group\\/stories') ||
        target.closest('[data-story-avatar]') ||
        target.closest('.story-circle') ||
        target.closest('#main-feed-column-container')
      ) {
        return;
      }

      // Do not intercept interactive elements
      if (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('textarea') || target.closest('select')) {
        return;
      }

      // Check if target is an image or container
      let imgElement: HTMLImageElement | null = null;
      if (target.tagName.toLowerCase() === 'img') {
        imgElement = target as HTMLImageElement;
      } else {
        const parentWithImg = target.closest('.aspect-square, [data-zoomable-image], .product-image-container, .gallery-item');
        if (parentWithImg) {
          imgElement = parentWithImg.querySelector('img');
        }
      }

      if (!imgElement || !imgElement.src) return;

      // Filter small icon images (avatars under 36px, emojis, icons)
      const rect = imgElement.getBoundingClientRect();
      if (rect.width < 40 || rect.height < 40) return;

      let title = imgElement.alt || imgElement.title || '';
      let badge: string | undefined = undefined;
      let price: string | undefined = undefined;

      const card = imgElement.closest('.group, [data-product-card], .bg-white, .rounded-2xl');
      if (card) {
        const badgeEl = card.querySelector('.bg-slate-500\\/80, .bg-slate-900\\/90, [data-badge]');
        if (badgeEl && badgeEl.textContent) badge = badgeEl.textContent.trim();

        const priceEl = card.querySelector('.font-mono, [data-price]');
        if (priceEl && priceEl.textContent && priceEl.textContent.includes('€')) {
          price = priceEl.textContent.trim();
        }

        if (!title) {
          const headingEl = card.querySelector('h3, h4, h5, .font-black');
          if (headingEl && headingEl.textContent) title = headingEl.textContent.trim();
        }
      }

      const item: LightboxImageItem = {
        src: imgElement.src,
        alt: imgElement.alt || 'Imagen ampliada',
        title: title || 'Imagen ampliada',
        price,
        badge
      };

      setActiveImage(item);
      setGalleryList([item]);
      setCurrentIndex(0);
      setZoomLevel(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => document.removeEventListener('click', handleDocumentClick, { capture: true });
  }, []);

  // Image load handler to classify natural aspect ratio
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (!naturalWidth || !naturalHeight) return;

    if (naturalHeight > naturalWidth * 1.08) {
      setAspectMode('vertical');
    } else if (naturalWidth > naturalHeight * 1.08) {
      setAspectMode('horizontal');
    } else {
      setAspectMode('square');
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      if (zoomLevel > 1) {
        setIsDragging(true);
        hasDraggedRef.current = false;
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y
        });
      } else {
        touchStartXRef.current = e.touches[0].clientX;
        touchStartYRef.current = e.touches[0].clientY;
        touchStartTimeRef.current = Date.now();
      }
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStartDist(dist);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1 && zoomLevel > 1) {
      hasDraggedRef.current = true;
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    } else if (e.touches.length === 2 && touchStartDist !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / touchStartDist;
      setZoomLevel(prev => Math.min(Math.max(prev * (ratio > 1 ? 1.04 : 0.96), 1), 3.0));
      setTouchStartDist(currentDist);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsDragging(false);
    setTouchStartDist(null);

    // Mobile swipe detection when zoom is 100%
    if (zoomLevel === 1 && touchStartXRef.current !== null && touchStartYRef.current !== null) {
      const endTouch = e.changedTouches[0];
      const deltaX = endTouch.clientX - touchStartXRef.current;
      const deltaY = endTouch.clientY - touchStartYRef.current;
      const duration = Date.now() - touchStartTimeRef.current;

      touchStartXRef.current = null;
      touchStartYRef.current = null;

      // Horizontal swipe gesture: length > 45px, vertical delta < 75px, speed < 450ms
      if (Math.abs(deltaX) > 45 && Math.abs(deltaY) < 75 && duration < 450) {
        if (deltaX < 0) {
          goToNext();
        } else {
          goToPrev();
        }
      }
    }
  };

  // Mouse drag handlers for desktop pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      e.preventDefault();
      setIsDragging(true);
      hasDraggedRef.current = false;
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      e.preventDefault();
      const moveDist = Math.hypot(e.clientX - dragStart.x - position.x, e.clientY - dragStart.y - position.y);
      if (moveDist > 5) {
        hasDraggedRef.current = true;
      }
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    handleCycleZoom();
  };

  if (!activeImage) return null;

  const currentItem: LightboxImageItem = galleryList[currentIndex] || activeImage;

  // Viewport-maximizing sizing style (75% - 90% of available viewport)
  // Maintains 100% true natural aspect ratio without distortion or cropping
  const getImageSizingStyle = (): React.CSSProperties => {
    if (aspectMode === 'vertical') {
      return {
        width: 'auto',
        height: '88vh',
        maxWidth: '90vw',
        maxHeight: '88vh',
        objectFit: 'contain'
      };
    }
    if (aspectMode === 'horizontal') {
      return {
        width: '90vw',
        height: 'auto',
        maxWidth: '90vw',
        maxHeight: '88vh',
        objectFit: 'contain'
      };
    }
    // Square or balanced
    return {
      width: 'auto',
      height: 'auto',
      maxWidth: 'min(90vw, 88vh)',
      maxHeight: 'min(90vw, 88vh)',
      objectFit: 'contain'
    };
  };

  return (
    <div 
      id="global-mobile-image-lightbox"
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all duration-300 select-none overflow-hidden"
      onClick={handleClose}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Left: Optional Gallery Counter (e.g. 1 / 12) */}
      {galleryList.length > 1 && (
        <div 
          className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[1000000] px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] sm:text-xs font-semibold tracking-wider flex items-center gap-1.5 shadow-xl select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-white font-bold">{currentIndex + 1}</span>
          <span className="text-white/40">/</span>
          <span className="text-white/70">{galleryList.length}</span>
        </div>
      )}

      {/* Top Right: Minimalist, Luxury Close "X" Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[1000000] w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/60 active:scale-95 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer"
        title="Cerrar (Esc)"
        aria-label="Cerrar visor"
      >
        <X className="w-5 h-5 text-white stroke-[2.2]" />
      </button>

      {/* Gallery Previous Arrow */}
      {galleryList.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-[1000000] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/65 active:scale-95 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer"
          title="Imagen anterior (Flecha izquierda)"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6 text-white stroke-[2.5]" />
        </button>
      )}

      {/* Gallery Next Arrow */}
      {galleryList.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[1000000] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/65 active:scale-95 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer"
          title="Imagen siguiente (Flecha derecha)"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6 text-white stroke-[2.5]" />
        </button>
      )}

      {/* CENTER IMAGE CONTAINER:
          - Eliminados todos los max-width pequeños (sin 460px)
          - Borde fino blanco de 1px
          - Border-radius aproximado de 1px
          - Sombra suave y premium
          - Animación de entrada suave: scale 0.96 -> 1, opacity 0 -> 1 en 260ms
      */}
      <div 
        className="relative inline-flex items-center justify-center p-[1px] bg-white border border-white/95 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] animate-lightbox-enter transition-shadow duration-300 pointer-events-auto"
        style={{
          borderRadius: '1px',
          maxWidth: '90vw',
          maxHeight: '88vh',
          cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
        }}
        onClick={handleImageClick}
        onDoubleClick={handleDoubleTapOrClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          ref={imgRef}
          src={currentItem.src}
          alt={currentItem.alt || 'Vista ampliada'}
          onLoad={handleImageLoad}
          referrerPolicy="no-referrer"
          draggable={false}
          style={{
            display: 'block',
            ...getImageSizingStyle(),
            borderRadius: '1px',
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 240ms cubic-bezier(0.2, 0.9, 0.3, 1)',
            userSelect: 'none'
          }}
        />
      </div>

      {/* Floating Minimalist Zoom & Rotate Toolbar */}
      <div 
        className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[1000000] flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full bg-black/45 hover:bg-black/60 backdrop-blur-md border border-white/20 shadow-2xl text-white select-none transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Zoom Out */}
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={zoomLevel <= 1}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-white/20 active:scale-90 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition cursor-pointer"
          title="Reducir zoom (-)"
          aria-label="Reducir zoom"
        >
          <ZoomOut className="w-3.5 h-3.5 text-white" />
        </button>

        {/* Current Zoom state pill / progressive cycle */}
        <button
          type="button"
          onClick={() => handleCycleZoom()}
          className="px-2.5 py-1 rounded-full hover:bg-white/20 active:scale-95 font-mono text-[10.5px] sm:text-[11.5px] font-bold tracking-wider transition cursor-pointer text-white/95"
          title="Cambiar zoom (100%, 150%, 200%, 300%)"
        >
          {Math.round(zoomLevel * 100)}%
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={zoomLevel >= 3}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-white/20 active:scale-90 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition cursor-pointer"
          title="Aumentar zoom (+)"
          aria-label="Aumentar zoom"
        >
          <ZoomIn className="w-3.5 h-3.5 text-white" />
        </button>

        <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

        {/* Rotate */}
        <button
          type="button"
          onClick={handleRotate}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-white/20 active:scale-90 flex items-center justify-center transition cursor-pointer"
          title="Rotar imagen 90° (R)"
          aria-label="Rotar imagen"
        >
          <RotateCw className="w-3.5 h-3.5 text-white" />
        </button>

        {/* Reset button if image is zoomed, panned or rotated */}
        {(zoomLevel !== 1 || rotation !== 0 || position.x !== 0 || position.y !== 0) && (
          <button
            type="button"
            onClick={handleResetZoom}
            className="px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-[10px] font-semibold uppercase tracking-wider transition cursor-pointer ml-0.5 text-white"
            title="Restablecer (0)"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default GlobalMobileImageLightbox;
