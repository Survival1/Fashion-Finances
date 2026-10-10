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
 * Displays the high-luxury King Royal Crown from capture z.png
 * with 24K gold filigree, royal fleurs-de-lis, natural diamonds, and deep blue sapphires.
 * Rendered purely and cleanly without artificial modifications.
 */
export default function RoyalMaleCrown({
  className = '',
  imgClassName = 'w-24 sm:w-30 h-auto'
}: RoyalMaleCrownProps) {
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      {/* Corona Real de la captura z.png pura, sin tocarla ni modificarla */}
      <img 
        src={maleCrownImg} 
        alt="Corona Real de Oro con Zafiros Azules y Diamantes" 
        referrerPolicy="no-referrer"
        className={`${imgClassName} object-contain transition-transform duration-300 drop-shadow-[0_4px_10px_rgba(0,0,0,0.35)]`}
      />
    </div>
  );
}

