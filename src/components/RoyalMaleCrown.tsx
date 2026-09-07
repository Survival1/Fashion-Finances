import React from 'react';
import maleCrownImg from '../assets/images/crown_king_male.png';

interface RoyalMaleCrownProps {
  className?: string;
  imgClassName?: string;
  showSparkles?: boolean;
}

/**
 * 👑 RoyalMaleCrown Component
 * 
 * Displays the high-luxury King Royal Crown with 24K gold filigree,
 * royal fleurs-de-lis, natural diamonds, and deep blue sapphires.
 * Features subtle specular sparkles (destellos) and a shimmering gleam.
 */
export default function RoyalMaleCrown({
  className = '',
  imgClassName = 'w-24 sm:w-30 h-auto',
  showSparkles = true
}: RoyalMaleCrownProps) {
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      {/* Golden & Sapphire Backlight Aura */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-blue-500/10 to-transparent blur-md rounded-full pointer-events-none" 
        style={{ transform: 'scale(0.85)' }}
      />

      {/* Main High-Resolution Crown Image */}
      <div className="relative overflow-visible">
        <img 
          src={maleCrownImg} 
          alt="Corona Real de Oro con Zafiros Azules y Diamantes" 
          referrerPolicy="no-referrer"
          className={`${imgClassName} object-contain filter brightness-[1.08] contrast-[1.05] saturate-[1.08] drop-shadow-[0_4px_16px_rgba(234,179,8,0.8)] drop-shadow-[0_0_24px_rgba(250,204,21,0.55)] drop-shadow-[0_8px_28px_rgba(37,99,235,0.4)] transition-transform duration-500`}
        />

        {/* Shimmering Gleam / Light Sweep Effect across the crown */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-t-full opacity-60 mix-blend-overlay">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent animate-royal-shine-sweep" />
        </div>

        {/* 🌟 Luxury Diamond & Gold Sparkle Glints (Destellos) */}
        {showSparkles && (
          <>
            {/* Sparkle 1: Top Central Sapphire Pinnacle */}
            <div 
              className="absolute animate-royal-sparkle-1 pointer-events-none"
              style={{ top: '6%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <svg className="w-3.5 h-3.5 text-amber-200 fill-current" viewBox="0 0 24 24">
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5z" />
              </svg>
            </div>

            {/* Sparkle 2: Left Pinnacle Golden Pearl */}
            <div 
              className="absolute animate-royal-sparkle-2 pointer-events-none"
              style={{ top: '28%', left: '19%', transform: 'translate(-50%, -50%)' }}
            >
              <svg className="w-2.5 h-2.5 text-yellow-100 fill-current" viewBox="0 0 24 24">
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5z" />
              </svg>
            </div>

            {/* Sparkle 3: Right Pinnacle Golden Pearl */}
            <div 
              className="absolute animate-royal-sparkle-3 pointer-events-none"
              style={{ top: '28%', left: '81%', transform: 'translate(-50%, -50%)' }}
            >
              <svg className="w-2.5 h-2.5 text-yellow-100 fill-current" viewBox="0 0 24 24">
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5z" />
              </svg>
            </div>

            {/* Sparkle 4: Central Pavé Diamond Band */}
            <div 
              className="absolute animate-royal-sparkle-4 pointer-events-none"
              style={{ top: '72%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
              <svg className="w-3 h-3 text-cyan-100 fill-current drop-shadow-[0_0_4px_rgba(56,189,248,0.8)]" viewBox="0 0 24 24">
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5z" />
              </svg>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
