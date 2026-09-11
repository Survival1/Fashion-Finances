import React from 'react';

/**
 * High-fidelity luxury vector illustrations matching the Gemini financial dashboard design.
 */

// 1. Vintage Black Leather Purse with Polished Gold Clasp (Card 1: Saldo Backoffice)
export const LuxuryPurseGraphic: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="purseGold" x1="20" y1="20" x2="80" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="25%" stopColor="#eab308" />
        <stop offset="50%" stopColor="#ca8a04" />
        <stop offset="75%" stopColor="#fef9c3" />
        <stop offset="100%" stopColor="#a16207" />
      </linearGradient>
      <linearGradient id="purseLeather" x1="20" y1="35" x2="80" y2="85" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4f525d" />
        <stop offset="35%" stopColor="#363942" />
        <stop offset="70%" stopColor="#2a2c33" />
        <stop offset="100%" stopColor="#222329" />
      </linearGradient>
      <radialGradient id="claspBallGold1" cx="44" cy="22" r="7" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#fde047" />
        <stop offset="70%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#854d0e" />
      </radialGradient>
      <radialGradient id="claspBallGold2" cx="56" cy="22" r="7" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="35%" stopColor="#fde047" />
        <stop offset="70%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#854d0e" />
      </radialGradient>
      <filter id="purseShadow" x="10" y="20" width="80" height="75" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#786f63" floodOpacity="0.28" />
      </filter>
    </defs>
    <g filter="url(#purseShadow)">
      {/* Purse leather body */}
      <path
        d="M24 38 C24 38, 12 55, 15 76 C17 84, 25 88, 50 88 C75 88, 83 84, 85 76 C88 55, 76 38, 76 38 Z"
        fill="url(#purseLeather)"
      />
      {/* Subtle leather sheen & financial quilting accent */}
      <path d="M28 42 C32 60, 36 78, 38 85" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M72 42 C68 60, 64 78, 62 85" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M48 40 C49 58, 49 76, 50 86" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
      
      {/* Central Gold Emblem / Financial Monogram Plate */}
      <rect x="46" y="56" width="8" height="6" rx="1.5" fill="url(#purseGold)" stroke="#92400e" strokeWidth="0.5" />
      <circle cx="50" cy="59" r="1" fill="#78350f" />
      
      {/* Gold kiss-lock frame arc */}
      <path
        d="M23 38 C23 34, 30 31, 50 31 C70 31, 77 34, 77 38 L75 42 C74 38, 68 35, 50 35 C32 35, 26 38, 25 42 Z"
        fill="url(#purseGold)"
      />
      {/* Double Kiss-lock balls */}
      <circle cx="45" cy="24" r="5" fill="url(#claspBallGold1)" />
      <circle cx="55" cy="24" r="5" fill="url(#claspBallGold2)" />
    </g>
  </svg>
);

// 2. Haute Couture Golden Tailor Mannequin Bust (Card 2: Premios Ganados)
export const GoldenMannequinGraphic: React.FC<{ className?: string }> = ({ className = "w-14 h-16" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="mannequinGold" x1="30" y1="15" x2="75" y2="70" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="25%" stopColor="#eab308" />
        <stop offset="50%" stopColor="#ca8a04" />
        <stop offset="75%" stopColor="#fef9c3" />
        <stop offset="100%" stopColor="#92400e" />
      </linearGradient>
      <radialGradient id="mannequinShine" cx="45" cy="35" r="25" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
        <stop offset="60%" stopColor="#eab308" stopOpacity="0" />
      </radialGradient>
      <filter id="goldShadow" x="20" y="5" width="60" height="92" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#854d0e" floodOpacity="0.25" />
      </filter>
    </defs>
    <g filter="url(#goldShadow)">
      {/* Finial / Neck knob */}
      <ellipse cx="50" cy="11" rx="4" ry="3.5" fill="url(#mannequinGold)" />
      <path d="M48 14 L52 14 L53 19 L47 19 Z" fill="url(#mannequinGold)" />

      {/* Torso Form */}
      <path
        d="M38 21 C39 20, 43 19, 50 19 C57 19, 61 20, 62 21 C66 23, 68 28, 66 34 C64 39, 60 43, 59 47 C57 52, 59 56, 61 60 C62 62, 60 65, 50 65 C40 65, 38 62, 39 60 C41 56, 43 52, 41 47 C40 43, 36 39, 34 34 C32 28, 34 23, 38 21 Z"
        fill="url(#mannequinGold)"
      />
      {/* Specular sheen over torso */}
      <path
        d="M38 21 C39 20, 43 19, 50 19 C57 19, 61 20, 62 21 C66 23, 68 28, 66 34 C64 39, 60 43, 59 47 C57 52, 59 56, 61 60 C62 62, 60 65, 50 65 C40 65, 38 62, 39 60 C41 56, 43 52, 41 47 C40 43, 36 39, 34 34 C32 28, 34 23, 38 21 Z"
        fill="url(#mannequinShine)"
      />
      
      {/* Tailor Seam Lines */}
      <path d="M50 20 L50 65" stroke="#78350f" strokeOpacity="0.3" strokeWidth="0.8" />
      <path d="M42 36 C46 38, 54 38, 58 36" stroke="#78350f" strokeOpacity="0.25" strokeWidth="0.8" />
      <path d="M41 51 C45 52, 55 52, 59 51" stroke="#78350f" strokeOpacity="0.25" strokeWidth="0.8" />

      {/* Stand Pole */}
      <rect x="48.5" y="65" width="3" height="23" fill="url(#mannequinGold)" />
      {/* Tripod Base */}
      <path d="M42 88 L50 84 L58 88" stroke="url(#mannequinGold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="50" cy="84" rx="5" ry="2.5" fill="url(#mannequinGold)" />
    </g>
  </svg>
);

// 3. Golden Spool with Silk Thread & Pearl Beads (Card 3: Inversión Rondas)
export const GoldenSpoolPearlsGraphic: React.FC<{ className?: string }> = ({ className = "w-14 h-16" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="spoolGold" x1="25" y1="15" x2="75" y2="85" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="30%" stopColor="#eab308" />
        <stop offset="70%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
      <linearGradient id="silkThread" x1="30" y1="35" x2="70" y2="65" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#fbf6ee" />
        <stop offset="80%" stopColor="#e8dfce" />
        <stop offset="100%" stopColor="#d4c7b2" />
      </linearGradient>
      <radialGradient id="pearlShine" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#fbf7f0" />
        <stop offset="80%" stopColor="#e9dfd0" />
        <stop offset="100%" stopColor="#baa992" />
      </radialGradient>
      <filter id="spoolShadow" x="15" y="10" width="70" height="80" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#854d0e" floodOpacity="0.2" />
      </filter>
    </defs>
    <g filter="url(#spoolShadow)">
      {/* Spool Top Flange */}
      <ellipse cx="50" cy="22" rx="20" ry="7" fill="url(#spoolGold)" />
      <ellipse cx="50" cy="21" rx="9" ry="3.5" fill="#78350f" fillOpacity="0.3" />
      
      {/* Central Silk Thread Core */}
      <rect x="32" y="27" width="36" height="42" rx="4" fill="url(#silkThread)" />
      {/* Thread lines */}
      <path d="M33 34 C44 33, 56 33, 67 34" stroke="#d5c8b5" strokeWidth="1" />
      <path d="M33 42 C44 41, 56 41, 67 42" stroke="#d5c8b5" strokeWidth="1" />
      <path d="M33 50 C44 49, 56 49, 67 50" stroke="#d5c8b5" strokeWidth="1" />
      <path d="M33 58 C44 57, 56 57, 67 58" stroke="#d5c8b5" strokeWidth="1" />
      <path d="M33 64 C44 63, 56 63, 67 64" stroke="#d5c8b5" strokeWidth="1" />

      {/* Spool Bottom Flange */}
      <ellipse cx="50" cy="74" rx="21" ry="7" fill="url(#spoolGold)" />

      {/* Draped Pearl Strand */}
      {/* Pearl 1 */}
      <circle cx="36" cy="38" r="3.2" fill="url(#pearlShine)" stroke="#d5c9b7" strokeWidth="0.4" />
      {/* Pearl 2 */}
      <circle cx="43" cy="42" r="3.4" fill="url(#pearlShine)" stroke="#d5c9b7" strokeWidth="0.4" />
      {/* Pearl 3 */}
      <circle cx="51" cy="44" r="3.5" fill="url(#pearlShine)" stroke="#d5c9b7" strokeWidth="0.4" />
      {/* Pearl 4 */}
      <circle cx="59" cy="46" r="3.4" fill="url(#pearlShine)" stroke="#d5c9b7" strokeWidth="0.4" />
      {/* Pearl 5 */}
      <circle cx="66" cy="50" r="3.2" fill="url(#pearlShine)" stroke="#d5c9b7" strokeWidth="0.4" />
      {/* Pearl 6 */}
      <circle cx="63" cy="58" r="3.4" fill="url(#pearlShine)" stroke="#d5c9b7" strokeWidth="0.4" />
      {/* Pearl 7 */}
      <circle cx="55" cy="62" r="3.5" fill="url(#pearlShine)" stroke="#d5c9b7" strokeWidth="0.4" />
      {/* Pearl 8 */}
      <circle cx="46" cy="64" r="3.5" fill="url(#pearlShine)" stroke="#d5c9b7" strokeWidth="0.4" />
      {/* Pearl 9 */}
      <circle cx="38" cy="67" r="3.3" fill="url(#pearlShine)" stroke="#d5c9b7" strokeWidth="0.4" />
      {/* Dropped Pearl with small gold tip */}
      <circle cx="73" cy="75" r="4" fill="url(#pearlShine)" stroke="#d5c9b7" strokeWidth="0.5" />
      <circle cx="73" cy="79" r="1.5" fill="url(#spoolGold)" />
    </g>
  </svg>
);

// 4. Sculpted 3D Golden Woven Ribbon "S" (Card 4: Sponsor Comisiones)
export const GoldRibbonSGraphic: React.FC<{ className?: string }> = ({ className = "w-14 h-16" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="goldRibbon" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="25%" stopColor="#eab308" />
        <stop offset="55%" stopColor="#ca8a04" />
        <stop offset="80%" stopColor="#fde047" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
      <pattern id="wovenPattern" width="4" height="4" patternUnits="userSpaceOnUse">
        <path d="M0 2 L2 0 L4 2 L2 4 Z" fill="#78350f" fillOpacity="0.12" />
      </pattern>
      <filter id="ribbonShadow" x="20" y="10" width="60" height="80" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#854d0e" floodOpacity="0.25" />
      </filter>
    </defs>
    <g filter="url(#ribbonShadow)">
      {/* Elegant 3D Ribbon S Shape */}
      <path
        d="M68 24 C68 24, 62 16, 48 16 C34 16, 26 25, 26 34 C26 44, 35 49, 49 53 C64 57, 72 63, 72 73 C72 84, 61 88, 48 88 C32 88, 25 78, 25 78 L31 71 C31 71, 37 79, 48 79 C57 79, 63 76, 63 72 C63 65, 54 61, 41 57 C27 52, 18 45, 18 34 C18 21, 30 10, 48 10 C65 10, 75 20, 75 20 Z"
        fill="url(#goldRibbon)"
      />
      {/* Overlay woven texture */}
      <path
        d="M68 24 C68 24, 62 16, 48 16 C34 16, 26 25, 26 34 C26 44, 35 49, 49 53 C64 57, 72 63, 72 73 C72 84, 61 88, 48 88 C32 88, 25 78, 25 78 L31 71 C31 71, 37 79, 48 79 C57 79, 63 76, 63 72 C63 65, 54 61, 41 57 C27 52, 18 45, 18 34 C18 21, 30 10, 48 10 C65 10, 75 20, 75 20 Z"
        fill="url(#wovenPattern)"
      />
      {/* Specular central highlight bevel */}
      <path
        d="M66 22 C61 17, 49 14, 48 14 C35 14, 28 22, 28 33 C28 42, 36 47, 48 51 C63 55, 70 61, 70 71 C70 81, 60 85, 48 85 C34 85, 28 77, 28 77"
        stroke="#ffffff"
        strokeOpacity="0.45"
        strokeWidth="1.2"
        fill="none"
      />
    </g>
  </svg>
);

// 5. Luxury Parisian Boutique Storefront (Card 5: Ventas de las Tiendas)
export const BoutiqueStorefrontGraphic: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="boutiqueWall" x1="15" y1="20" x2="85" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fdfcf9" />
        <stop offset="50%" stopColor="#f5efe6" />
        <stop offset="100%" stopColor="#e6ddcf" />
      </linearGradient>
      <linearGradient id="boutiqueAwningWhite" x1="20" y1="36" x2="80" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#ede7dc" />
      </linearGradient>
      <linearGradient id="boutiqueAwningDark" x1="20" y1="36" x2="80" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#403c39" />
        <stop offset="100%" stopColor="#1f1d1c" />
      </linearGradient>
      <filter id="boutiqueShadow" x="12" y="16" width="76" height="76" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.18" />
      </filter>
    </defs>
    <g filter="url(#boutiqueShadow)">
      {/* Stone Pediment Building Header */}
      <rect x="20" y="20" width="60" height="15" rx="1.5" fill="url(#boutiqueWall)" stroke="#cfc5b4" strokeWidth="1" />
      <rect x="23" y="23" width="54" height="9" rx="1" fill="#ede5d8" stroke="#d5cbba" strokeWidth="0.6" />
      <text x="50" y="30" fill="#4a4237" fontSize="5.5" fontWeight="900" textAnchor="middle" letterSpacing="0.8" fontFamily="serif">
        Boutique
      </text>

      {/* Striped Canopy / Awning */}
      <g>
        <path d="M18 35 L26 48 L22 49 L16 36 Z" fill="url(#boutiqueAwningWhite)" />
        <path d="M26 35 L34 48 L30 49 L24 35 Z" fill="url(#boutiqueAwningDark)" />
        <path d="M34 35 L42 48 L38 49 L32 35 Z" fill="url(#boutiqueAwningWhite)" />
        <path d="M42 35 L50 48 L46 49 L40 35 Z" fill="url(#boutiqueAwningDark)" />
        <path d="M50 35 L58 48 L54 49 L48 35 Z" fill="url(#boutiqueAwningWhite)" />
        <path d="M58 35 L66 48 L62 49 L56 35 Z" fill="url(#boutiqueAwningDark)" />
        <path d="M66 35 L74 48 L70 49 L64 35 Z" fill="url(#boutiqueAwningWhite)" />
        <path d="M74 35 L82 48 L78 49 L72 35 Z" fill="url(#boutiqueAwningDark)" />
        <path d="M82 35 L85 48 L82 49 L80 35 Z" fill="url(#boutiqueAwningWhite)" />
      </g>

      {/* Lower storefront body */}
      <rect x="22" y="48" width="56" height="38" fill="url(#boutiqueWall)" stroke="#cfc5b4" strokeWidth="1" />
      {/* Display Windows with warm ambient glow & mannequins inside */}
      <rect x="26" y="52" width="20" height="28" fill="#fdfaf3" stroke="#bfae97" strokeWidth="1.2" />
      {/* Fashion silhouette in left window */}
      <path d="M36 57 C36 55, 34 57, 36 61 L33 74 L39 74 L36 61 Z" fill="#a48c71" />
      
      {/* Boutique Door & Entrance in Center/Right */}
      <rect x="50" y="52" width="24" height="34" fill="#faf6ee" stroke="#bfae97" strokeWidth="1.2" />
      <rect x="53" y="55" width="18" height="15" fill="#ffffff" stroke="#d5cbba" strokeWidth="0.8" />
      <circle cx="55" cy="72" r="1.5" fill="#ca8a04" />
      {/* Boutique Base Plinth */}
      <rect x="20" y="86" width="60" height="4" fill="#cfc5b4" />
    </g>
  </svg>
);

// 6. Luxury Crystal Perfume Flacon with Pearl Stopper (Card 6: Regalos de Usuarios)
export const GoldPerfumeGraphic: React.FC<{ className?: string }> = ({ className = "w-14 h-16" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="perfumeLiquid" x1="28" y1="42" x2="72" y2="82" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#eab308" />
        <stop offset="70%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="perfumeGlass" x1="22" y1="36" x2="78" y2="88" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
        <stop offset="30%" stopColor="#fef9c3" stopOpacity="0.3" />
        <stop offset="70%" stopColor="#ffffff" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#fde047" stopOpacity="0.4" />
      </linearGradient>
      <radialGradient id="perfumePearl" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="45%" stopColor="#fefce8" />
        <stop offset="75%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#ca8a04" />
      </radialGradient>
      <filter id="perfumeShadow" x="18" y="10" width="64" height="82" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#854d0e" floodOpacity="0.25" />
      </filter>
    </defs>
    <g filter="url(#perfumeShadow)">
      {/* Iridescent Pearl Cap Stopper */}
      <circle cx="50" cy="20" r="8" fill="url(#perfumePearl)" stroke="#ca8a04" strokeWidth="0.8" />
      
      {/* Polished Gold Atomizer Collar */}
      <rect x="42" y="27" width="16" height="7" rx="1.5" fill="#ca8a04" />
      <rect x="44" y="29" width="12" height="3" rx="0.5" fill="#fef08a" />

      {/* Crystal Glass Bottle Outer Boundary */}
      <rect x="26" y="34" width="48" height="52" rx="6" fill="url(#perfumeGlass)" stroke="#eab308" strokeWidth="1.2" />

      {/* Fragrance Liquid Reservoir */}
      <rect x="31" y="44" width="38" height="37" rx="3.5" fill="url(#perfumeLiquid)" />
      <ellipse cx="50" cy="44" rx="19" ry="3" fill="#fef9c3" fillOpacity="0.8" />

      {/* Facet Sheen Highlights */}
      <path d="M29 38 L29 82" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.75" />
      <path d="M33 40 L33 78" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M71 38 L71 82" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.4" />
    </g>
  </svg>
);

// 7. Fashion Urban Friends / Models Duo (Card 7: Amigos)
export const FashionFriendsGraphic: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="jacketGold" x1="50" y1="35" x2="80" y2="70" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="40%" stopColor="#d97706" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="jacketDark" x1="20" y1="35" x2="45" y2="70" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
    </defs>
    {/* Left Model: Dark Urban Techwear */}
    <g>
      {/* Cap / Beanie */}
      <ellipse cx="34" cy="18" rx="5.5" ry="3.5" fill="#1e293b" />
      {/* Face */}
      <ellipse cx="34" cy="23" rx="4.5" ry="5.5" fill="#d4a373" />
      {/* Jacket / Hoodie */}
      <path d="M25 31 C27 28, 32 27, 34 27 C36 27, 41 28, 43 31 L46 54 L22 54 Z" fill="url(#jacketDark)" />
      {/* Gold details */}
      <path d="M34 29 L34 54" stroke="#eab308" strokeWidth="1.2" />
      {/* Cargo Pants */}
      <path d="M24 54 L32 82 L35 82 L34 56 L35 56 L34 82 L37 82 L44 54 Z" fill="#1e293b" />
      {/* Sneakers */}
      <rect x="29" y="82" width="7" height="4" rx="2" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
      <rect x="36" y="82" width="7" height="4" rx="2" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
    </g>

    {/* Right Model: Monogram Puffer & Streetwear */}
    <g>
      {/* Cap */}
      <path d="M60 17 C62 14, 68 14, 70 17 L74 19 L60 19 Z" fill="#92400e" />
      {/* Face */}
      <ellipse cx="65" cy="23" rx="4.5" ry="5.5" fill="#e0a96d" />
      {/* Puffer Jacket in Golden Tan */}
      <path d="M56 31 C58 28, 63 27, 65 27 C67 27, 72 28, 74 31 L78 54 L52 54 Z" fill="url(#jacketGold)" />
      {/* Puffer Quilts */}
      <path d="M54 38 C60 40, 70 40, 76 38" stroke="#78350f" strokeWidth="0.8" />
      <path d="M53 46 C60 48, 70 48, 77 46" stroke="#78350f" strokeWidth="0.8" />
      {/* Cargo Pants */}
      <path d="M54 54 L62 82 L65 82 L65 56 L66 56 L65 82 L68 82 L76 54 Z" fill="#334155" />
      {/* Sneakers */}
      <rect x="59" y="82" width="7" height="4" rx="2" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
      <rect x="67" y="82" width="7" height="4" rx="2" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
    </g>
  </svg>
);

// 8. Fashion Paparazzi & Photographers Crowd (Card 8: Seguidores)
export const PaparazziCrowdGraphic: React.FC<{ className?: string }> = ({ className = "w-20 h-16" }) => (
  <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="cameraFlash" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#fef08a" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Standing Back Row Photographers */}
    {/* Person 1 Left */}
    <g>
      <circle cx="24" cy="18" r="4.5" fill="#334155" />
      <path d="M17 25 L31 25 L32 45 L16 45 Z" fill="#1e293b" />
      <rect x="23" y="24" width="8" height="5" rx="1" fill="#0f172a" />
      <circle cx="27" cy="26.5" r="2.2" fill="#64748b" />
    </g>
    {/* Person 2 Center-Left */}
    <g>
      <circle cx="48" cy="14" r="5" fill="#475569" />
      <path d="M40 21 L56 21 L58 45 L38 45 Z" fill="#0f172a" />
      {/* Telephoto lens aiming */}
      <rect x="48" y="20" width="16" height="7" rx="1.5" fill="#1e293b" />
      <rect x="62" y="19" width="3" height="9" fill="#0f172a" />
      <circle cx="50" cy="22" r="6" fill="url(#cameraFlash)" />
    </g>
    {/* Person 3 Center-Right */}
    <g>
      <circle cx="76" cy="15" r="4.8" fill="#334155" />
      <path d="M68 22 L84 22 L85 45 L67 45 Z" fill="#1e293b" />
      <rect x="70" y="22" width="10" height="6" rx="1" fill="#0f172a" />
    </g>
    {/* Person 4 Right */}
    <g>
      <circle cx="98" cy="19" r="4.5" fill="#475569" />
      <path d="M91 26 L105 26 L106 48 L90 48 Z" fill="#0f172a" />
      <rect x="88" y="25" width="10" height="6" rx="1" fill="#1e293b" />
    </g>

    {/* Kneeling / Front Row Photographers with Flashes */}
    {/* Kneeling Left */}
    <g>
      <circle cx="34" cy="35" r="4" fill="#334155" />
      <path d="M26 41 L42 41 L43 65 L25 65 Z" fill="#0f172a" />
      <rect x="33" y="38" width="14" height="6" rx="1.5" fill="#1e293b" />
      <circle cx="44" cy="40" r="5" fill="url(#cameraFlash)" />
    </g>
    {/* Kneeling Center */}
    <g>
      <circle cx="62" cy="34" r="4.5" fill="#475569" />
      <path d="M53 40 L71 40 L72 68 L52 68 Z" fill="#1e293b" />
      {/* Big lens */}
      <rect x="60" y="37" width="18" height="8" rx="2" fill="#020617" />
      <rect x="76" y="36" width="3" height="10" fill="#475569" />
      <circle cx="64" cy="38" r="8" fill="url(#cameraFlash)" />
    </g>
    {/* Kneeling Right */}
    <g>
      <circle cx="88" cy="36" r="4.2" fill="#334155" />
      <path d="M80 42 L96 42 L97 66 L79 66 Z" fill="#0f172a" />
      <rect x="84" y="40" width="13" height="6" rx="1.5" fill="#020617" />
    </g>
  </svg>
);

// 9. Haute Couture Golden Eye & Monocle VIP Emblazon (Card 9: Seguidos)
export const GoldenFashionEyeGraphic: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="eyeGold" x1="15" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="25%" stopColor="#eab308" />
        <stop offset="60%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
      <radialGradient id="irisGrad" cx="50" cy="50" r="14" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="45%" stopColor="#1e3a8a" />
        <stop offset="85%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </radialGradient>
      <filter id="eyeShadow" x="12" y="18" width="76" height="64" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#854d0e" floodOpacity="0.25" />
      </filter>
    </defs>
    <g filter="url(#eyeShadow)">
      {/* Outer Golden Monocle Ring */}
      <circle cx="50" cy="50" r="32" stroke="url(#eyeGold)" strokeWidth="2.5" fill="none" strokeDasharray="3 1.5" />
      <circle cx="50" cy="50" r="28" stroke="url(#eyeGold)" strokeWidth="1.2" fill="#fffdfa" fillOpacity="0.8" />
      
      {/* Stylized Almond Eye Contour */}
      <path
        d="M26 50 C33 37, 67 37, 74 50 C67 63, 33 63, 26 50 Z"
        fill="#fbfaf7"
        stroke="url(#eyeGold)"
        strokeWidth="2"
      />
      {/* Iris */}
      <circle cx="50" cy="50" r="11" fill="url(#irisGrad)" stroke="#ca8a04" strokeWidth="1.2" />
      {/* Pupil */}
      <circle cx="50" cy="50" r="5" fill="#000000" />
      {/* Specular Sparkle */}
      <circle cx="47" cy="47" r="2.2" fill="#ffffff" />
      <circle cx="53" cy="52" r="1" fill="#ffffff" fillOpacity="0.7" />
      
      {/* Golden Eyelashes & Brow Accent */}
      <path d="M35 37 C44 32, 56 32, 65 37" stroke="url(#eyeGold)" strokeWidth="1.8" strokeLinecap="round" />
      {/* Monocle chain loop */}
      <circle cx="78" cy="50" r="2.5" fill="url(#eyeGold)" />
      <path d="M80.5 50 C86 52, 88 64, 82 72" stroke="url(#eyeGold)" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

// 10. Golden Celestial Network & Armillary Sphere (Card 10: Referidos Online)
export const GoldenArmillaryNetworkGraphic: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="sphereGold" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="25%" stopColor="#eab308" />
        <stop offset="65%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
      <radialGradient id="centralGlow" cx="50" cy="50" r="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="60%" stopColor="#047857" />
        <stop offset="100%" stopColor="#064e3b" />
      </radialGradient>
      <filter id="sphereShadow" x="12" y="12" width="76" height="76" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="4" stdDeviation="3.5" floodColor="#854d0e" floodOpacity="0.25" />
      </filter>
    </defs>
    <g filter="url(#sphereShadow)">
      {/* Outer Armillary Ring */}
      <circle cx="50" cy="50" r="32" stroke="url(#sphereGold)" strokeWidth="2" strokeOpacity="0.85" />
      
      {/* Equator & Meridians Ellipses */}
      <ellipse cx="50" cy="50" rx="32" ry="12" stroke="url(#sphereGold)" strokeWidth="1.5" transform="rotate(-25 50 50)" />
      <ellipse cx="50" cy="50" rx="12" ry="32" stroke="url(#sphereGold)" strokeWidth="1.5" transform="rotate(-25 50 50)" />
      <ellipse cx="50" cy="50" rx="26" ry="26" stroke="url(#sphereGold)" strokeWidth="0.8" strokeDasharray="2 2" />

      {/* Interconnected Active Nodes */}
      <circle cx="50" cy="50" r="7" fill="url(#centralGlow)" stroke="url(#sphereGold)" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="2.5" fill="#ffffff" />
      
      {/* Orbital Network Nodes */}
      <circle cx="34" cy="32" r="3" fill="#10b981" stroke="url(#sphereGold)" strokeWidth="1" />
      <circle cx="68" cy="36" r="3.2" fill="#10b981" stroke="url(#sphereGold)" strokeWidth="1" />
      <circle cx="62" cy="66" r="3" fill="#10b981" stroke="url(#sphereGold)" strokeWidth="1" />
      <circle cx="28" cy="58" r="2.8" fill="#10b981" stroke="url(#sphereGold)" strokeWidth="1" />

      {/* Connecting Laser Network Lines */}
      <path d="M50 50 L34 32" stroke="#34d399" strokeWidth="0.8" strokeOpacity="0.7" />
      <path d="M50 50 L68 36" stroke="#34d399" strokeWidth="0.8" strokeOpacity="0.7" />
      <path d="M50 50 L62 66" stroke="#34d399" strokeWidth="0.8" strokeOpacity="0.7" />
      <path d="M50 50 L28 58" stroke="#34d399" strokeWidth="0.8" strokeOpacity="0.7" />
    </g>
  </svg>
);

