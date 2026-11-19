import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Gifts3DCoverflowSliderProps<T extends { id: string }> {
  items: T[];
  selectedId: string | null;
  onSelectId: (id: string) => void;
  resetKey?: string;
  renderCard: (item: T, index: number, total: number, isCenter: boolean) => React.ReactNode;
  prevTitle?: string;
  nextTitle?: string;
}

function useSliderViewportWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

export default function Gifts3DCoverflowSlider<T extends { id: string }>({
  items,
  selectedId,
  onSelectId,
  resetKey,
  renderCard,
  prevTitle = 'Anterior',
  nextTitle = 'Siguiente',
}: Gifts3DCoverflowSliderProps<T>) {
  const width = useSliderViewportWidth();
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const mouseStartX = useRef<number | null>(null);

  // Reset to first slide when filters or sorting change
  useEffect(() => {
    setActiveIndex(0);
  }, [resetKey]);

  // Clamp activeIndex if items shrink (e.g. deletion)
  useEffect(() => {
    if (items.length === 0) {
      setActiveIndex(0);
    } else if (activeIndex >= items.length) {
      setActiveIndex(items.length - 1);
    }
  }, [items.length, activeIndex]);

  // Keep activeIndex synced if selectedId changes externally
  useEffect(() => {
    if (!selectedId || items.length === 0) return;
    const idx = items.findIndex((item) => item.id === selectedId);
    if (idx !== -1 && idx !== activeIndex) {
      setActiveIndex(idx);
    }
  }, [selectedId]);

  if (!items || items.length === 0) return null;

  const safeIndex = Math.min(Math.max(0, activeIndex), items.length - 1);

  const goToIndex = (nextIdx: number) => {
    const clamped = ((nextIdx % items.length) + items.length) % items.length;
    setActiveIndex(clamped);
    const targetItem = items[clamped];
    if (targetItem) {
      onSelectId(targetItem.id);
    }
  };

  const handlePrev = () => {
    if (items.length <= 1) return;
    goToIndex(safeIndex === 0 ? items.length - 1 : safeIndex - 1);
  };

  const handleNext = () => {
    if (items.length <= 1) return;
    goToIndex(safeIndex === items.length - 1 ? 0 : safeIndex + 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartX.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX.current === null) return;
    const diff = mouseStartX.current - e.clientX;
    if (Math.abs(diff) > 55) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    mouseStartX.current = null;
  };

  let cardWidth = 420;
  let stageHeight = 330;
  let spacing = 215;
  let rotateYVal = 30;

  if (width < 640) {
    cardWidth = 276;
    stageHeight = 325;
    spacing = 105;
    rotateYVal = 24;
  } else if (width < 1024) {
    cardWidth = 370;
    stageHeight = 325;
    spacing = 175;
    rotateYVal = 28;
  }

  return (
    <div className="relative w-full py-3 sm:py-5 select-none overflow-x-clip overflow-y-visible flex flex-col items-center">
      {/* 3D Perspective Stage matching FashionRankingSlider coverflow */}
      <div
        className="relative w-full flex items-center justify-center overflow-visible"
        style={{
          height: `${stageHeight}px`,
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Left Arrow Button */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            title={prevTitle}
            aria-label={prevTitle}
            className="custom-bg absolute left-1 sm:left-4 lg:left-8 z-[55] w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-200 bg-white/95 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-90"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 pointer-events-none" />
          </button>
        )}

        {/* 3D Stacked Gift Cards */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {items.map((item, index) => {
            const offset = index - safeIndex;
            const absOffset = Math.abs(offset);
            if (absOffset > 4) return null;

            const isCenter = offset === 0;
            const scale = isCenter ? 1.04 : Math.max(0.58, 0.82 - (absOffset - 1) * 0.09);
            const translateX = offset * spacing;
            const translateZ = isCenter ? 60 : -115 - (absOffset - 1) * 60;
            const rotateY = isCenter ? 0 : offset < 0 ? rotateYVal : -rotateYVal;
            const opacity = isCenter ? 1 : Math.max(0.16, 0.62 - (absOffset - 1) * 0.18);
            const zIndex = 50 - absOffset;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isCenter) {
                    goToIndex(index);
                  } else {
                    onSelectId(item.id);
                  }
                }}
                className={`absolute transition-all duration-500 ease-out cursor-pointer ${
                  isCenter ? 'brightness-100' : 'saturate-[0.85]'
                }`}
                style={{
                  width: `${cardWidth}px`,
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  transition: 'transform 550ms cubic-bezier(0.25, 1, 0.5, 1), opacity 550ms ease',
                }}
              >
                <div className={!isCenter ? 'pointer-events-none' : undefined}>
                  {renderCard(item, index, items.length, isCenter)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            title={nextTitle}
            aria-label={nextTitle}
            className="custom-bg absolute right-1 sm:right-4 lg:right-8 z-55 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-200 bg-white/95 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-90"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 pointer-events-none" />
          </button>
        )}
      </div>

      {/* Compact Indicator Dots */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2 max-w-full px-6 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {items.slice(0, 24).map((item, dotIdx) => {
            const isDotActive = dotIdx === safeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goToIndex(dotIdx)}
                aria-label={`Ir al regalo ${dotIdx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 shrink-0 cursor-pointer ${
                  isDotActive
                    ? 'w-6 bg-pink-600'
                    : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            );
          })}
          {items.length > 24 && (
            <span className="text-[10px] font-mono font-bold text-slate-500 pl-1.5 tabular-nums">
              {safeIndex + 1} / {items.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
