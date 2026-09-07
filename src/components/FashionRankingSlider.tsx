/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Award, Eye, Radio, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { ModelProfile } from '../types';

import descargaImg from '../assets/images/descarga.jpg';
import RoyalMaleCrown from './RoyalMaleCrown';

interface FashionRankingSliderProps {
  models: ModelProfile[];
  gender: 'female' | 'male';
  onModelClick: (model: ModelProfile) => void;
}

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return width;
}

export default function FashionRankingSlider({
  models,
  gender,
  onModelClick
}: FashionRankingSliderProps) {
  const width = useWindowWidth();
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Auto-center when models array changes or is loaded
  useEffect(() => {
    if (models.length > 0) {
      const customVidIdx = models.findIndex(m => m.videoUrl && (m.videoUrl.startsWith('blob:') || !m.videoUrl.includes('mixkit.co')));
      if (customVidIdx !== -1) {
        setActiveIndex(customVidIdx);
      } else {
        setActiveIndex(0);
      }
    }
  }, [models]);

  if (!models || models.length === 0) {
    return (
      <div className="py-12 text-center bg-white/40 border border-slate-100 rounded-2xl">
        <p className="text-xs text-slate-400 font-mono tracking-wider">No hay modelos de este género en el Top 100 actual</p>
      </div>
    );
  }

  // Handle slide transitions safely
  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? models.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === models.length - 1 ? 0 : prev + 1));
  };

  // Touch handlers for swipe gesturability in iframe environments
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) { // Swipe threshold
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  // Dimensions based on screen width
  let cardWidth = 320;
  let cardHeight = 520;
  let spacing = 210;
  let rotateYVal = 32;

  if (width < 640) {
    cardWidth = 210;
    cardHeight = 350;
    spacing = 110;
    rotateYVal = 26;
  } else if (width < 1024) {
    cardWidth = 270;
    cardHeight = 440;
    spacing = 170;
    rotateYVal = 30;
  }

  return (
    <div className="relative w-full pt-20 sm:pt-24 pb-8 select-none overflow-x-clip overflow-y-visible flex flex-col items-center">
      {/* 3D Stage Container */}
      <div 
        className="relative w-full flex items-center justify-center overflow-visible"
        style={{ 
          height: `${cardHeight + 175}px`,
          perspective: '1200px',
          perspectiveOrigin: '50% 50%'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 lg:left-12 z-40 w-12 h-12 rounded-full border border-slate-200 bg-white/90 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-115 active:scale-90"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-6 h-6 text-slate-800 pointer-events-none" />
        </button>

        {/* 3D Cards Map */}
        <div 
          className="absolute w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {models.map((model, index) => {
            const offset = index - activeIndex;
            const absOffset = Math.abs(offset);
            
            // Render only cards near the viewport center for high graphics performance
            const isVisible = absOffset <= 4;
            if (!isVisible) return null;

            // Positioning & Rotation structure
            const scale = offset === 0 ? 1.12 : 0.78 - (absOffset - 1) * 0.08;
            const translateX = offset * spacing;
            const translateZ = offset === 0 ? 60 : -120 - (absOffset - 1) * 60;
            const rotateY = offset === 0 ? 0 : (offset < 0 ? rotateYVal : -rotateYVal);
            const opacity = offset === 0 ? 1 : Math.max(0.12, 0.55 - (absOffset - 1) * 0.22);
            const zIndex = 50 - absOffset;

            // Split name nicely to achieve the luxury editorial look
            const nameParts = (model?.name || '').split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            return (
              <ModelRankingCard
                key={model.id}
                model={model}
                index={index}
                offset={offset}
                gender={gender}
                onModelClick={onModelClick}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                translateX={translateX}
                translateZ={translateZ}
                rotateY={rotateY}
                scale={scale}
                opacity={opacity}
                zIndex={zIndex}
                firstName={firstName}
                lastName={lastName}
              />
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 lg:right-12 z-40 w-12 h-12 rounded-full border border-slate-200 bg-white/90 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-115 active:scale-90"
          aria-label="Siguiente"
        >
          <ChevronRight className="w-6 h-6 text-slate-800 pointer-events-none" />
        </button>
      </div>

      {/* Slide Index indicator Dots */}
      <div className="flex gap-1.5 items-center justify-center pt-2 max-w-full px-4 overflow-x-auto selection:bg-transparent scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {models.map((_, dotIdx) => (
          <button
            key={dotIdx}
            type="button"
            onClick={() => setActiveIndex(dotIdx)}
            className={`h-1.5 rounded-full transition-all duration-300 shrink-0 ${
              dotIdx === activeIndex 
                ? 'w-6 bg-indigo-600' 
                : 'w-1.5 bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Ir al modelo ${dotIdx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

interface ModelRankingCardProps {
  key?: any;
  model: ModelProfile;
  index: number;
  offset: number;
  gender: 'female' | 'male';
  onModelClick: (model: ModelProfile) => void;
  cardWidth: number;
  cardHeight: number;
  translateX: number;
  translateZ: number;
  rotateY: number;
  scale: number;
  opacity: number;
  zIndex: number;
  firstName: string;
  lastName: string;
}

function ModelRankingCard({
  model,
  index,
  offset,
  gender,
  onModelClick,
  cardWidth,
  cardHeight,
  translateX,
  translateZ,
  rotateY,
  scale,
  opacity,
  zIndex,
  firstName,
  lastName
}: ModelRankingCardProps) {
  const isMale = gender === 'male' || (model && model.gender === 'male');
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
    setIsMuted(newVol === 0);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted && volume === 0) {
        setVolume(0.8);
        videoRef.current.volume = 0.8;
      }
    } else {
      setIsMuted(!isMuted);
    }
  };

  // Select a preset high-luxury video loop if no custom video is uploaded yet
  const presetFemaleVideos = [
    'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-posing-with-a-red-light-40486-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-a-red-light-40158-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-rainy-night-40539-large.mp4'
  ];

  const presetMaleVideos = [
    'https://assets.mixkit.co/videos/preview/mixkit-man-posing-in-trendy-fashion-clothes-40491-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-man-with-neon-makeup-posing-with-red-light-40490-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-black-and-posing-40495-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-man-with-sunglasses-posing-in-creative-light-40496-large.mp4'
  ];

  const modelVideo = model?.videoUrl || (isMale ? presetMaleVideos : presetFemaleVideos)[index % 4];

  useEffect(() => {
    setVideoError(false);
  }, [modelVideo]);

  // Primary model image/photo: fallback to model.avatar or descargaImg
  const displayImage = model?.avatar || descargaImg || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';

  // Dynamic styling variants based on gender
  const frameBg = isMale ? 'bg-[#EBF8FF]' : 'bg-[#FCE7F3]';
  const gradientClasses = isMale 
    ? 'bg-gradient-to-b from-[#bae6fd] via-[#6366f1]/70 to-[#4f46e5]/85' 
    : 'bg-gradient-to-b from-[#fbcfe8] via-[#ec4899]/70 to-[#db2777]/85';
  const glowShadow = isMale
    ? 'drop-shadow-[0_0_22px_rgba(79,70,229,0.9)]'
    : 'drop-shadow-[0_0_22px_rgba(244,63,94,0.9)]';
  const spotLightColor = isMale ? 'from-indigo-400/40' : 'from-pink-400/40';
  const diamondGradient = isMale ? 'from-[#312E81] to-[#4F46E5]' : 'from-[#B93259] to-[#E12A75]';
  const cardBorderColor = isMale ? 'border-indigo-150' : 'border-pink-100';
  const textColor = isMale ? 'text-[#1e1b4b]' : 'text-[#4a2e22]';
  const votesColor = isMale ? 'text-[#312e81]' : 'text-[#ae1c4a]';
  const heartFillColor = isMale ? 'fill-indigo-500 text-indigo-500' : 'fill-rose-500 text-rose-500';
  const ringAccentColor = isMale ? 'rgba(79,70,229,0.22)' : 'rgba(219,39,119,0.22)';

  return (
    <div
      onClick={() => {
        onModelClick(model);
      }}
      className={`absolute overflow-visible group cursor-pointer transition-all duration-500 ease-out flex flex-col justify-between ${
        offset === 0 
          ? `scale-110 brightness-105 z-50 filter drop-shadow-[0_20px_45px_${ringAccentColor}]` 
          : 'opacity-65 saturate-[0.85]'
      }`}
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity: opacity,
        zIndex: zIndex,
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        transition: 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1), opacity 600ms'
      }}
    >
      {/* 1. Crown positioned atop the frame (Royal Gold Crown for male models, Tiara for female models) - positioned right against the image without touching */}
      <div 
        style={{ bottom: 'calc(100% + 2px)' }}
        className="absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-transform duration-500 group-hover:scale-105"
      >
        {isMale ? (
          <RoyalMaleCrown 
            imgClassName="w-24 sm:w-28 h-auto"
            showSparkles={true}
          />
        ) : (
          <img 
            src="https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Crowns-PNG/Diamond_Tiara_with_Rubies_PNG_Clipart.png" 
            alt="Corona de Diamantes y Rubíes" 
            referrerPolicy="no-referrer"
            className="w-20 sm:w-24 h-auto object-contain drop-shadow-[0_4px_14px_rgba(239,68,68,0.5)]"
          />
        )}
      </div>

      {/* 2. Modern Portrait Frame - Fills with model photo or video */}
      <div className={`relative w-full h-[80%] rounded-[24px] border-[5px] border-white bg-slate-900 shadow-lg flex items-center justify-center overflow-hidden z-10`}>
        
        {/* Model Image or Video - Fills the entire portrait container */}
        {offset === 0 && modelVideo && !videoError ? (
          <video
            ref={videoRef}
            src={modelVideo || undefined}
            poster={displayImage}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover relative z-5 transition-all duration-500"
          />
        ) : (
          <img
            src={displayImage}
            alt={model?.name || 'Modelo'}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.getAttribute('data-error-tried') === 'true') return;
              target.setAttribute('data-error-tried', 'true');
              target.src = descargaImg;
            }}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover relative z-5 transition-all duration-500 group-hover:scale-103"
          />
        )}

        {/* Floating Active EN LÍNEA Badge overlay */}
        {model?.isOnline && (
          <span className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-emerald-600 text-white font-sans font-bold text-[8.5px] px-2.5 py-0.5 rounded-md tracking-wider animate-pulse shadow-md whitespace-nowrap flex items-center gap-1 border border-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            EN LÍNEA
          </span>
        )}

        {/* Volume Bar Overlay on Active Video - Appears on hover over left side of card */}
        {offset === 0 && modelVideo && !videoError && (
          <div className="absolute inset-y-0 left-0 w-1/2 z-20 group/volume-left pointer-events-auto flex items-end p-3">
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="opacity-0 group-hover/volume-left:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-white shadow-xl hover:bg-black"
              title="Ajustar volumen"
            >
              <button
                type="button"
                onClick={toggleMute}
                className="text-white hover:text-rose-400 cursor-pointer p-0.5"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-white" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-12 sm:w-16 h-1 accent-rose-500 cursor-pointer rounded-lg bg-white/40"
              />
            </div>
          </div>
        )}

      </div>

      {/* 3. Base details card with premium layout matching the mockup zx.png */}
      <div className={`w-full bg-white border-2 ${cardBorderColor} rounded-[20px] p-2.5 pt-3 text-center select-none shadow-md mt-1 flex flex-col items-center justify-center relative`}>
        {/* Small "Elígeme" button positioned above the model's name */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onModelClick(model);
          }}
          className="mb-1 text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 active:scale-95 text-white px-3 py-0.5 rounded-full shadow-md border border-white/40 flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
          id={`btn-eligeme-${model?.id || index}`}
        >
          <Sparkles className="w-2.5 h-2.5 text-yellow-200 fill-current animate-pulse" />
          <span>Elígeme</span>
        </button>

        <h4 className={`text-[12px] sm:text-[13px] font-black font-serif ${textColor} tracking-tight leading-tight line-clamp-1 uppercase`}>
          {model?.name || 'Modelo'}
        </h4>
        <div className={`flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-bold ${votesColor} mt-1 uppercase tracking-wider`}>
          <Heart className={`w-3 h-3 ${heartFillColor}`} />
          <span className="font-sans font-black">
            {(model?.totalLikes || 0).toLocaleString()} votos
          </span>
        </div>
      </div>

    </div>
  );
}
