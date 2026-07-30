import React, { useState, useEffect, useRef } from 'react';

interface FloatingElement {
  id: number;
  type: 'fall' | 'pop';
  sequenceMode: number; // 0: Hearts, 1: Diamonds, 2: Roses, 3: Blue Pearls
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

export default function HeartRainOverlay() {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const clickCounterRef = useRef<number>(0);

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

      const newElements: FloatingElement[] = [];
      const baseId = Date.now() + Math.random();

      // Retrieve current click sequence index (0: Hearts, 1: Diamonds, 2: Roses, 3: Blue Pearls)
      const forceHearts = customEvent?.detail?.forceHearts || customEvent?.detail?.forceMode === 'hearts';
      const currentSequence = clickCounterRef.current;
      const sequenceMode = forceHearts ? 0 : (currentSequence % 4);
      
      if (!forceHearts) {
        // Advance click sequence for the next tap
        clickCounterRef.current += 1;
      }

      // Select emoji pool & color pool based on sequence mode
      let emojiPool = ['❤️', '💖', '💕', '💓', '💗'];
      let colorPool = heartColors;

      if (sequenceMode === 1) {
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
      const rainCount = 18;
      for (let i = 0; i < rainCount; i++) {
        const x = Math.random() * 100; // 0% to 100% width
        const size = Math.floor(Math.random() * 20) + 16; // 16px to 36px
        const delay = Math.random() * 600; // stagger starting time
        // Majestic slow fall to match user's requested slow speed: 6.0 to 9.5 seconds
        const duration = Math.random() * 3.5 + 6.0; 
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
        const popCount = 14;
        for (let i = 0; i < popCount; i++) {
          const size = Math.floor(Math.random() * 12) + 16; // 16px to 28px
          const delay = Math.random() * 200; // swift pop stagger
          const duration = Math.random() * 0.9 + 1.3; // flight duration
          const color = colorPool[Math.floor(Math.random() * colorPool.length)];
          const rotation = Math.floor(Math.random() * 80) - 40; // -40deg to 40deg
          const emojiChar = emojiPool[Math.floor(Math.random() * emojiPool.length)];
          
          // Outer burst drift targets
          const tx = Math.floor(Math.random() * 180) - 90; // drift left/right -90px to +90px
          const ty = -(Math.floor(Math.random() * 200) + 120); // drift upwards -120px to -320px

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
        setElements(prev => prev.filter(el => el.id < baseId || el.id >= baseId + rainCount + 20));
      }, 10500);
    };

    window.addEventListener('trigger-heart-rain', handleHeartTrigger);
    
    return () => {
      window.removeEventListener('trigger-heart-rain', handleHeartTrigger);
    };
  }, []);

  if (elements.length === 0) return null;

  return (
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
          animation-timing-function: linear; /* steady uniform descent */
          animation-fill-mode: forwards;
        }

        .popping-item {
          position: absolute;
          animation-name: customElementPopUp;
          animation-timing-function: ease-out; /* physical float-up burst */
          animation-fill-mode: forwards;
        }
      `}</style>
      {elements.map(el => {
        // High fidelity styling based on sequenceMode
        let filterStyle = 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))';
        let customContent: React.ReactNode = el.emojiChar;

        if (el.sequenceMode === 0) {
          // Hearts: glowing soft pink shadow
          filterStyle = 'drop-shadow(0 0 6px rgba(244,63,94,0.65)) saturate(1.2)';
        } else if (el.sequenceMode === 1) {
          // Diamonds: bright cyan crystal glow
          filterStyle = 'drop-shadow(0 0 10px rgba(56,189,248,0.9)) brightness(1.2) contrast(1.1); font-weight: 900';
        } else if (el.sequenceMode === 2) {
          // Roses: high saturation drop shadow
          filterStyle = 'drop-shadow(0 3px 6px rgba(225,29,72,0.5)) saturate(1.4)';
        } else if (el.sequenceMode === 3) {
          // Blue Pearls: Render actual physical round glossy pearl sphere with a glossy specular reflection! (Super real!)
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
              {/* Highlight reflection */}
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
          // Type pop
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
  );
}
