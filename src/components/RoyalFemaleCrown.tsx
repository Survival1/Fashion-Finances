import React from 'react';
import femaleCrownImg from '../assets/images/female_crown_tiara.png';

interface RoyalFemaleCrownProps {
  className?: string;
  imgClassName?: string;
  showSparkles?: boolean;
}

/**
 * 👑 RoyalFemaleCrown Component
 * 
 * Muestra la corona/tiara femenina original de plata, rodio, diamantes y rubíes
 * que estaba puesta en el ranking femenino de modelos de la plataforma.
 */
export default function RoyalFemaleCrown({
  className = '',
  imgClassName = 'w-28 sm:w-36 h-auto'
}: RoyalFemaleCrownProps) {
  return (
    <div className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}>
      <img 
        src={femaleCrownImg} 
        alt="Corona Femenina de Diamantes y Rubíes" 
        referrerPolicy="no-referrer"
        className={`${imgClassName} object-contain transition-transform duration-300 drop-shadow-[0_6px_14px_rgba(0,0,0,0.35)]`}
      />
    </div>
  );
}
