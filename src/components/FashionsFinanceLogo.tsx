import React from 'react';

interface FashionsFinanceLogoProps {
  className?: string; // Sizing of the icon wrapper (e.g., "w-10 h-10")
  mode?: 'light' | 'dark';
  withText?: boolean;
  inlineText?: boolean;
  textClassName?: string;
  subTextClassName?: string;
}

export default function FashionsFinanceLogo({
  className = "w-10 h-10",
  mode = "light",
  withText = false,
  inlineText = false,
  textClassName = "text-slate-900",
  subTextClassName = "text-rose-600"
}: FashionsFinanceLogoProps) {
  
  // Icon SVG
  const logoIcon = (
    <div className={`shrink-0 rounded-xl p-1 flex items-center justify-center border transition-all ${className} ${
      mode === 'dark' 
        ? 'bg-slate-950/40 border-slate-800 shadow-inner' 
        : 'bg-slate-50 border-slate-150/40 shadow-xs'
    }`}>
      <svg viewBox="0 0 100 135" className="w-full h-full" aria-label="Fashion Finances Logo">
        <defs>
          <linearGradient id="sRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#db2777" /> {/* Deep Rose */}
            <stop offset="50%" stopColor="#ec4899" /> {/* Pink */}
            <stop offset="100%" stopColor="#7c2d12" /> {/* Warm Terracotta/Rust */}
          </linearGradient>
        </defs>
        {/* Elegant S Curve background shadow ribbon */}
        <path
          d="M 50,10 C 25,10 15,30 25,50 C 35,70 75,58 75,85 C 75,112 38,118 24,102 C 16,94 22,112 36,118 C 56,126 82,112 82,85 C 82,58 45,62 38,46 C 31,30 46,14 62,18 C 70,20 58,10 50,10 Z"
          fill="url(#sRibbonGrad)"
          opacity="0.9"
        />
        {/* Soft pink highlight */}
        <path
          d="M 48,22 C 34,26 23,38 29,48 C 35,58 55,56 61,71 C 67,86 52,106 38,108 C 50,111 72,102 72,85 C 72,64 45,63 38,45 C 31,27 48,15 48,22 Z"
          fill="#f472b6"
          opacity="0.3"
        />
        {/* High Heel Walking Model Silhouette */}
        <path
          d="M 50.5,23.5 C 52.5,23.5 54,22 54,20 C 54,18 52.5,16.5 50.5,16.5 C 48.5,16.5 47,18 47,20 C 47,22 48.5,23.5 50.5,23.5 Z 
             M 48.5,25.5 C 45,27.5 44,30.5 44.5,36 C 44.5,36 45.5,36 45.5,35 M 52.5,25.5 C 56,27.5 56.5,30.5 56,36 
             M 50.5,24.5 L 47.5,39.5 L 45.5,56.5 L 41.5,81.5 L 38.5,88.5 C 37.5,90.5 40,91.5 41,91.5 L 42.5,91.5 L 47,73.5 L 51.5,56.5 L 53.5,76.5 L 51.5,92.5 C 51,95 53.5,95.5 54.5,95.5 L 56.5,95.5 C 56,89.5 53.5,73.5 52.5,53.5 L 53.5,36.5 C 53.5,30.5 52,26.5 50.5,24.5 Z"
          fill={mode === 'dark' ? '#ffffff' : '#030712'}
          className="transition-colors duration-200"
        />
      </svg>
    </div>
  );

  if (!withText) {
    return logoIcon;
  }

  if (inlineText) {
    return (
      <div className="flex items-center gap-2.5">
        {logoIcon}
        <div className="flex flex-col min-w-0">
          <span className={`font-display font-black text-sm tracking-widest leading-none ${textClassName}`}>
            FASHIONS
          </span>
          <span className={`font-display font-medium text-[9px] tracking-widest font-sans leading-none uppercase mt-0.5 ${subTextClassName}`}>
            FINANCE
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center flex flex-col items-center justify-center">
      {logoIcon}
      <div className="mt-2.5">
        <h1 className={`font-display font-black text-base tracking-widest leading-none ${textClassName}`}>
          FASHIONS
        </h1>
        <h2 className={`font-display font-medium text-[10px] tracking-widest font-sans leading-none uppercase mt-1 ${subTextClassName}`}>
          FINANCE
        </h2>
      </div>
    </div>
  );
}
