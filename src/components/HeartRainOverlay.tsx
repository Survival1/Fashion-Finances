import React, { useState, useEffect, useRef } from 'react';

interface FloatingElement {
  id: number;
  type: 'fall' | 'pop';
  sequenceMode: number; // 0: Hearts, 1: Diamonds, 2: Roses, 3: Blue Pearls, 4: Custom Gift
  x?: number; // percentage from left (for falling rain)
  y?: number; // starting top position percentage
  originX?: number; // pixel values (for pop)
  originY?: number; // pixel values (for pop)
  size: number; // size in px
  delay: number; // ms delay
  duration: number; // animation duration in s
  color: string; // color string accent
  rotation: number; // angle of element
  tx?: number; // target translation x (for pop)
  ty?: number; // target translation y (for pop)
  emojiChar: string; // selected emoji representation if applicable
}

interface ActiveGiftBanner {
  id: string;
  icon: string;
  name: string;
  cost?: number;
  recipientName: string;
  senderName?: string;
  message?: string;
  channelSelector?: string;
}

export default function HeartRainOverlay() {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [activeGiftBanner, setActiveGiftBanner] = useState<ActiveGiftBanner | null>(null);
  const [bannerCoords, setBannerCoords] = useState<{ x: number; y: number } | null>(null);
  const clickCounterRef = useRef<number>(0);

  // Helper to accurately locate the active channel center on screen
  const getChannelCenterPosition = (preferredSelector?: string): { x: number; y: number } => {
    try {
      let targetEl: HTMLElement | null = null;
      if (preferredSelector) {
        targetEl = document.querySelector(preferredSelector) as HTMLElement;
      }

      if (!targetEl) {
        const candidateSelectors = [
          '#top-1-ranking-model-container',
          '[data-channel-container="true"]',
          '#casting_live-combined-device',
          '#casting_live-center-panel',
          '#casting_live-live-container',
          '#live-casting-channel-container',
          '#casting-live-main-phone',
          '#live-stream-viewport',
          '#live-streaming-feed',
          '#channel-container',
          '.channel-container'
        ];

        for (const selector of candidateSelectors) {
          const els = document.querySelectorAll(selector);
          for (let i = 0; i < els.length; i++) {
            const el = els[i] as HTMLElement;
            const r = el.getBoundingClientRect();
            // Verify element is active, visible, and has area within viewport
            if (r.width > 50 && r.height > 50 && r.bottom > 20 && r.top < window.innerHeight - 20) {
              targetEl = el;
              break;
            }
          }
          if (targetEl) break;
        }
      }

      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        
        // Calculate the visible intersection of the channel with the viewport
        const visibleLeft = Math.max(0, rect.left);
        const visibleRight = Math.min(window.innerWidth, rect.right);
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(window.innerHeight, rect.bottom);

        // When the channel is visible on screen, center precisely in the visible portion
        if (visibleRight > visibleLeft && visibleBottom > visibleTop) {
          const centerX = Math.round((visibleLeft + visibleRight) / 2);
          const centerY = Math.round((visibleTop + visibleBottom) / 2);
          return { x: centerX, y: centerY };
        }
      }
    } catch (e) {}

    // Graceful fallback to screen center
    return {
      x: Math.round(window.innerWidth / 2),
      y: Math.round(window.innerHeight / 2)
    };
  };

  // Re-calculate banner position smoothly on scroll or resize while banner is active
  useEffect(() => {
    if (!activeGiftBanner) return;

    const updatePosition = () => {
      const coords = getChannelCenterPosition(activeGiftBanner.channelSelector);
      setBannerCoords(coords);
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition, { passive: true });

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [activeGiftBanner]);

  const playCelebrationSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Soft melodic arpeggio (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.55);
      });
    } catch (e) {
      // Audio context might be restricted before user interaction
    }
  };

  useEffect(() => {
    const heartColors = [
      '#ef4444', // red-500
      '#f43f5e', // rose-500
      '#ec4899', // pink-500
      '#d946ef', // fuchsia-500
      '#a855f7', // purple-500
      '#f472b6', // pink-400
    ];

    const diamondColors = [
      '#38bdf8', // sky-400
      '#0ea5e9', // sky-500
      '#06b6d4', // cyan-500
      '#bae6fd', // sky-200
      '#22d3ee', // cyan-400
    ];

    const roseColors = [
      '#e11d48', // rose-600
      '#be123c', // rose-700
      '#9f1239', // rose-800
      '#f43f5e', // rose-500
      '#fda4af', // rose-300
    ];

    const pearlColors = [
      '#0284c7', // sky-600
      '#0369a1', // sky-700
      '#075985', // sky-800
      '#bae6fd', // sky-200
      '#38bdf8', // sky-400
    ];

    const handleHeartTrigger = (event?: Event) => {
      const customEvent = event as CustomEvent;
      const clickX = customEvent?.detail?.x;
      const clickY = customEvent?.detail?.y;
      const customIcon = customEvent?.detail?.icon;
      const giftName = customEvent?.detail?.name;
      const giftCost = customEvent?.detail?.cost;
      const recipientName = customEvent?.detail?.recipientName;
      const senderName = customEvent?.detail?.senderName;
      const channelSelector = customEvent?.detail?.channelSelector;

      // If full gift details provided, show animated banner and chime
      if (giftName || recipientName || customIcon) {
        playCelebrationSound();
        if (giftName || recipientName) {
          const initialCoords = getChannelCenterPosition(channelSelector);
          setBannerCoords(initialCoords);

          setActiveGiftBanner({
            id: `banner-${Date.now()}`,
            icon: customIcon || '🎁',
            name: giftName || 'Regalo Exclusivo',
            cost: giftCost,
            recipientName: recipientName || 'la modelo',
            senderName: senderName || 'Ernesto vs',
            channelSelector
          });

          setTimeout(() => {
            setActiveGiftBanner(null);
          }, 4200);
        }
      }

      const newElements: FloatingElement[] = [];
      const baseId = Date.now() + Math.random();

      // Retrieve current click sequence index (0: Hearts, 1: Diamonds, 2: Roses, 3: Blue Pearls, 4: Custom Gift)
      const forceHearts = customEvent?.detail?.forceHearts || customEvent?.detail?.forceMode === 'hearts';
      const currentSequence = clickCounterRef.current;
      let sequenceMode = forceHearts ? 0 : (currentSequence % 4);
      
      if (!forceHearts) {
        // Advance click sequence for the next tap
        clickCounterRef.current += 1;
      }

      // Select emoji pool & color pool based on sequence mode
      let emojiPool = ['❤️', '💖', '💕', '💓', '💗'];
      let colorPool = heartColors;

      if (customIcon) {
        sequenceMode = 4;
        emojiPool = [customIcon, '✨', customIcon, '💖', customIcon, '🌟'];
        colorPool = ['#f43f5e', '#ec4899', '#f59e0b', '#fbbf24', '#a855f7'];
      } else if (sequenceMode === 1) {
        emojiPool = ['💎', '✨', '💎', '🔸'];
        colorPool = diamondColors;
      } else if (sequenceMode === 2) {
        emojiPool = ['🌹', '🌸', '🌷', '🌺', '🌹'];
        colorPool = roseColors;
      } else if (sequenceMode === 3) {
        emojiPool = ['🔵', '💙', '💠', '🔮'];
        colorPool = pearlColors;
      }

      // 1. ALWAYS spawn standard falling rain elements from the top
      const rainCount = customIcon ? 24 : 18;
      for (let i = 0; i < rainCount; i++) {
        const x = Math.random() * 100; // 0% to 100% width
        const size = Math.floor(Math.random() * 24) + 18; // 18px to 42px
        const delay = Math.random() * 600; // stagger starting time
        const duration = Math.random() * 3.0 + 4.5; 
        const color = colorPool[Math.floor(Math.random() * colorPool.length)];
        const rotation = Math.floor(Math.random() * 60) - 30; // -30deg to 30deg
        const emojiChar = emojiPool[Math.floor(Math.random() * emojiPool.length)];

        newElements.push({
          id: baseId + i,
          type: 'fall',
          sequenceMode,
          x,
          y: -10,
          size,
          delay,
          duration,
          color,
          rotation,
          emojiChar
        });
      }

      // 2. Spawn beautiful popping elements directly from the icon clicked!
      if (clickX !== undefined && clickY !== undefined) {
        const popCount = 16;
        for (let i = 0; i < popCount; i++) {
          const size = Math.floor(Math.random() * 16) + 18;
          const delay = Math.random() * 200;
          const duration = Math.random() * 0.9 + 1.2;
          const color = colorPool[Math.floor(Math.random() * colorPool.length)];
          const rotation = Math.floor(Math.random() * 80) - 40;
          const emojiChar = emojiPool[Math.floor(Math.random() * emojiPool.length)];
          
          const tx = Math.floor(Math.random() * 180) - 90;
          const ty = -(Math.floor(Math.random() * 200) + 120);

          newElements.push({
            id: baseId + rainCount + i,
            type: 'pop',
            sequenceMode,
            originX: clickX,
            originY: clickY,
            size,
            delay,
            duration,
            color,
            rotation,
            tx,
            ty,
            emojiChar
          });
        }
      }

      setElements(prev => [...prev, ...newElements]);

      // Prune after they finish animating
      setTimeout(() => {
        setElements(prev => prev.filter(el => el.id < baseId || el.id >= baseId + rainCount + 25));
      }, 8500);
    };

    window.addEventListener('trigger-heart-rain', handleHeartTrigger);
    
    return () => {
      window.removeEventListener('trigger-heart-rain', handleHeartTrigger);
    };
  }, []);

  return (
    <>
      {/* Animated Center Gift Delivery Celebration Banner Positioned Directly on the Channel */}
      {activeGiftBanner && (
        <div 
          className="fixed pointer-events-none z-[999999] px-3 transition-all duration-150 ease-out"
          style={{
            left: bannerCoords ? `${bannerCoords.x}px` : '50%',
            top: bannerCoords ? `${bannerCoords.y}px` : '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: 'min(92vw, 360px)',
            width: '100%'
          }}
        >
          <div className="animate-in fade-in zoom-in-75 duration-300 ease-out flex flex-col items-center text-center w-full bg-slate-950/95 backdrop-blur-xl border-2 border-pink-500/80 rounded-3xl p-5 sm:p-6 shadow-[0_0_50px_rgba(244,63,94,0.45)] text-white relative overflow-hidden">
            {/* Ambient glowing backdrop aura */}
            <div className="absolute -top-16 -left-16 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-rose-500/30 rounded-full blur-3xl pointer-events-none" />

            {/* Pulsing 3D Gift Icon with glowing halo */}
            <div className="relative mb-3 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 to-amber-300 opacity-60 blur-xl animate-pulse" />
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-pink-500/20 to-rose-950/40 border border-pink-400/50 flex items-center justify-center text-4xl sm:text-5xl shadow-inner relative z-10 animate-bounce">
                {activeGiftBanner.icon}
              </div>
            </div>

            {/* Title */}
            <span className="text-[10.5px] font-black uppercase tracking-widest text-pink-400 mb-1 flex items-center gap-1.5 justify-center">
              <span>✨</span> ¡Regalo Entregado con Éxito! <span>✨</span>
            </span>

            {/* Gift Name and Recipient */}
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-1">
              {activeGiftBanner.name}
            </h3>
            
            <p className="text-xs text-pink-100/90 font-medium mb-3">
              Enviado a <span className="text-pink-300 font-bold underline decoration-pink-500/60">{activeGiftBanner.recipientName}</span>
            </p>

            {/* Backoffice deduction tag */}
            <div className="w-full bg-pink-950/50 border border-pink-500/30 rounded-xl px-3.5 py-2 flex items-center justify-between gap-2 text-[11px] font-mono">
              <span className="text-pink-300 font-semibold">Oficina Virtual:</span>
              <span className="text-rose-400 font-bold font-mono">
                {activeGiftBanner.cost ? `-${activeGiftBanner.cost}€ Deducidos` : 'Transferido'}
              </span>
            </div>

            {/* Live delivery confirmation indicator */}
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Acreditado en la cuenta de {activeGiftBanner.recipientName}</span>
            </div>
          </div>
        </div>
      )}

      {elements.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
          <style>{`
            @keyframes customElementFall {
              0% {
                transform: translateY(-20px) rotate(var(--rot)) scale(0.6);
                opacity: 0;
              }
              5% {
                opacity: 0.95;
                transform: translateY(5vh) rotate(var(--rot)) scale(1.1);
              }
              90% {
                opacity: 0.85;
              }
              100% {
                transform: translateY(112vh) rotate(calc(var(--rot) * 1.6)) scale(0.8);
                opacity: 0;
              }
            }

            @keyframes customElementPopUp {
              0% {
                transform: translate(0, 0) scale(0.3) rotate(0deg);
                opacity: 0;
              }
              15% {
                opacity: 1;
                transform: translate(calc(var(--tx) * 0.25), calc(var(--ty) * 0.25)) scale(1.35) rotate(var(--rot));
              }
              100% {
                transform: translate(var(--tx), var(--ty)) scale(0.85) rotate(calc(var(--rot) * 2.0));
                opacity: 0;
              }
            }

            .falling-item {
              position: absolute;
              animation-name: customElementFall;
              animation-timing-function: linear;
              animation-fill-mode: forwards;
            }

            .popping-item {
              position: absolute;
              animation-name: customElementPopUp;
              animation-timing-function: ease-out;
              animation-fill-mode: forwards;
            }
          `}</style>
          {elements.map(el => {
            let filterStyle = 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))';
            let customContent: React.ReactNode = el.emojiChar;

            if (el.sequenceMode === 0 || el.sequenceMode === 4) {
              filterStyle = 'drop-shadow(0 0 8px rgba(244,63,94,0.75)) saturate(1.3)';
            } else if (el.sequenceMode === 1) {
              filterStyle = 'drop-shadow(0 0 10px rgba(56,189,248,0.9)) brightness(1.2) contrast(1.1); font-weight: 900';
            } else if (el.sequenceMode === 2) {
              filterStyle = 'drop-shadow(0 3px 6px rgba(225,29,72,0.5)) saturate(1.4)';
            } else if (el.sequenceMode === 3) {
              customContent = (
                <div 
                  className="rounded-full relative border border-sky-300/30 flex items-center justify-center overflow-hidden"
                  style={{
                    width: `${el.size}px`,
                    height: `${el.size}px`,
                    background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #a5f3fc 15%, #0284c7 60%, #0369a1 95%, #0b5375 100%)',
                    boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.65), 0 3px 6px rgba(3,105,161,0.3)',
                  }}
                >
                  <div 
                    className="absolute w-2 h-2 rounded-full bg-white opacity-80"
                    style={{
                      top: '15%',
                      left: '15%',
                      background: 'radial-gradient(circle, #ffffff 0%, rgba(255,255,255,0) 80%)'
                    }}
                  />
                </div>
              );
            }

            if (el.type === 'fall') {
              return (
                <span
                  key={el.id}
                  className="falling-item select-none flex items-center justify-center font-sans"
                  style={{
                    left: `${el.x}%`,
                    top: `${el.y}%`,
                    fontSize: `${el.size}px`,
                    color: el.color,
                    animationDelay: `${el.delay}ms`,
                    animationDuration: `${el.duration}s`,
                    filter: filterStyle,
                    '--rot': `${el.rotation}deg`,
                  } as React.CSSProperties}
                >
                  {customContent}
                </span>
              );
            } else {
              return (
                <span
                  key={el.id}
                  className="popping-item select-none font-sans flex items-center justify-center"
                  style={{
                    left: `${el.originX}px`,
                    top: `${el.originY}px`,
                    marginLeft: `-${el.size / 2}px`,
                    marginTop: `-${el.size / 2}px`,
                    fontSize: `${el.size}px`,
                    color: el.color,
                    animationDelay: `${el.delay}ms`,
                    animationDuration: `${el.duration}s`,
                    filter: filterStyle,
                    '--rot': `${el.rotation}deg`,
                    '--tx': `${el.tx}px`,
                    '--ty': `${el.ty}px`,
                  } as React.CSSProperties}
                >
                  {customContent}
                </span>
              );
            }
          })}
        </div>
      )}
    </>
  );
}
