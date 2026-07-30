import React, { useState } from 'react';
import { ModelProfile } from '../types';
import { 
  Sparkles, 
  Crown, 
  Trophy, 
  Heart, 
  X, 
  Star, 
  Globe, 
  Users, 
  HeartHandshake, 
  Award, 
  ShieldCheck, 
  Gift, 
  Calendar, 
  TrendingUp, 
  Medal, 
  Zap, 
  ArrowRight 
} from 'lucide-react';
import FashionsFinanceLogo from './FashionsFinanceLogo';

interface VictoriaSecretRankingProps {
  isOpen: boolean;
  onClose: () => void;
  models: ModelProfile[];
  onSelectModel?: (model: ModelProfile) => void;
}

export default function VictoriaSecretRanking({
  isOpen,
  onClose,
  models,
  onSelectModel,
}: VictoriaSecretRankingProps) {
  const [activeTab, setActiveTab] = useState<'ranking' | 'premios' | 'hall_of_fame'>('ranking');
  const [rankingSearchQuery, setRankingSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [sponsorCount, setSponsorCount] = useState<1 | 2 | 3>(3);

  if (!isOpen) return null;

  // Retrieve and sort top 3 models by likes/popularity descending
  const sortedModels = [...models]
    .sort((a, b) => (b.totalLikes || 0) - (a.totalLikes || 0))
    .slice(0, 3);

  // Map them into standard podium positions: [2nd, 1st, 3rd]
  const secondPlace = sortedModels[1] || sortedModels[0];
  const firstPlace = sortedModels[0];
  const thirdPlace = sortedModels[2] || sortedModels[1] || sortedModels[0];

  // Pick a legendary model: search for Adriana Lima (who is #1) or fallback to first place
  const legendModel = models.find(m => m.name.toLowerCase().includes('lima')) || firstPlace;

  // Master sorted list of exactly 100 items
  const masterSortedRanking = React.useMemo(() => {
    const list = [...models].sort((a, b) => (b.totalLikes || 0) - (a.totalLikes || 0));
    
    // If we have less than 100, fill it up to exactly 100
    while (list.length < 100) {
      const i = list.length;
      const isFemale = i % 2 === 0;
      const id = `extra-model-${i}`;
      const name = isFemale 
        ? [`Lucía Fernández`, `Martina Silva`, `Sofía Martínez`, `Elena Gómez`, `Valeria Vega`, `Carla Ruiz`, `Julia Díaz`, `Natalia Sanz`, `Alba Castro`, `Paula Gil`][i % 10] + ` ${i}`
        : [`Diego Torres`, `Mateo Ruiz`, `Lucas Castro`, `Tomás Ortiz`, `Bruno Silva`, `Leo Navarro`, `Hugo Ramos`, `Marcos Sanz`, `Álvaro Cruz`, `Mario León`][i % 10] + ` ${i}`;
      const username = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const likes = Math.max(100, Math.floor((list[list.length - 1]?.totalLikes || 500) * 0.985) - (i % 5));
      list.push({
        id,
        name,
        username,
        avatar: `https://images.unsplash.com/photo-${[
          '1534528741775-53994a69daeb', '1507003211169-0a1dd7228f2d', '1494790108377-be9c29b29330', 
          '1506794778202-cad84cf45f1d', '1517841905240-472988babdf9', '1539571696357-5a69c17a67c6',
          '1524504388940-b1c1722653e1', '1488161628813-04466f872be2', '1501196354995-cbb51c65aaea',
          '1529139574466-a303027c1d8b'
        ][i % 10]}?auto=format&fit=crop&q=80&w=150`,
        bio: 'Creador/a de contenido y entusiasta de la moda de alta costura.',
        totalLikes: likes,
        followersCount: likes * 3,
        referidosCount: Math.floor(likes / 50),
        socials: { instagram: `@${username}` },
        isOnline: i % 4 === 0,
        photos: [],
        gender: isFemale ? 'female' : 'male'
      } as any);
    }

    // Keep it fully sorted
    return list.sort((a, b) => (b.totalLikes || 0) - (a.totalLikes || 0));
  }, [models]);

  // Set of female names for precise gender filtering
  const FEMALE_NAMES = React.useMemo(() => new Set([
    'Adriana Lima', 'Alessandra Ambrosio', 'Candice Swanepoel', 'Jasmine Tookes', 'Miranda Kerr',
    'Gisele Bündchen', 'Behati Prinsloo', 'Lily Aldridge', 'Elsa Hosk', 'Romee Strijd',
    'Sara Sampaio', 'Taylor Hill', 'Josephine Skriver', 'Lais Ribeiro', 'Stella Maxwell',
    'Martha Hunt', 'Barbara Palvin', 'Grace Elizabeth', 'Leomie Anderson', 'Alexina Graham',
    'Tyra Banks', 'Heidi Klum', 'Karolína Kurková', 'Doutzen Kroes', 'Marisa Miller',
    'Rosie Huntington-Whiteley', 'Izabel Goulart', 'Selita Ebanks', 'Daniela Peštová', 'Helena Christensen',
    'Laetitia Casta', 'Karen Mulder', 'Stephanie Seymour', 'Inés Rivero', 'Chanel Iman',
    'Erin Heatherton', 'Lindsay Ellingson', 'Jac Jagaciak', 'Kate Grigorieva', 'Bella Hadid',
    'Gigi Hadid', 'Joan Smalls', 'Anok Yai', 'Paloma Elsesser', 'Alex Consani',
    'Yumi Nu', 'Irina Shayk', 'Sui He', 'Toni Garrn', 'Constance Jablonski'
  ]), []);

  // Filtered list based on search and gender
  const filteredRankings = React.useMemo(() => {
    return masterSortedRanking.filter(model => {
      // 1. Search Query
      const matchesSearch = 
        model.name.toLowerCase().includes(rankingSearchQuery.toLowerCase()) ||
        model.username.toLowerCase().includes(rankingSearchQuery.toLowerCase()) ||
        (model.alias && model.alias.toLowerCase().includes(rankingSearchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // 2. Gender Filter
      if (genderFilter === 'all') return true;
      
      const isFemale = 
        (model as any).gender === 'female' || 
        model.id.startsWith('topf-') || 
        FEMALE_NAMES.has(model.name) || 
        (model.id.startsWith('extra-model-') && (parseInt(model.id.split('-')[2]) % 2 === 0));
      
      if (genderFilter === 'female') {
        return isFemale;
      } else {
        return !isFemale;
      }
    });
  }, [masterSortedRanking, rankingSearchQuery, genderFilter, FEMALE_NAMES]);

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center bg-[#fdf2f8]/70 backdrop-blur-xl overflow-y-auto p-1.5 sm:p-4 md:p-6 animate-fade-in font-sans">
      
      {/* Glamorous High-Fashion Backdrop Simulation with Soft Pink Curtains and Spotlight */}
      <div className="absolute inset-0 bg-radial-gradient(circle_at_center,rgba(253,242,248,0.73)_0%,rgba(252,231,243,0.92)_100%) pointer-events-none" />
      
      {/* Decorative vertical theater drapery columns on sides - matching zx.png perfectly */}
      <div className="absolute top-0 bottom-0 left-0 w-4 sm:w-10 md:w-16 lg:w-20 bg-gradient-to-r from-[#880e4f] via-[#ec4899] to-[#fbcfe8] border-r-2 border-[#f472b6] opacity-95 shadow-[8px_0_20px_rgba(0,0,0,0.18)] pointer-events-none z-0">
        <div className="w-full h-full opacity-30 bg-[linear-gradient(90deg,transparent_40%,rgba(255,255,255,0.3)_50%,transparent_60%)] bg-[size:16px_100%] animate-pulse" style={{ animationDuration: '8s' }} />
      </div>
      <div className="absolute top-0 bottom-0 right-0 w-4 sm:w-10 md:w-16 lg:w-20 bg-gradient-to-l from-[#880e4f] via-[#ec4899] to-[#fbcfe8] border-l-2 border-[#f472b6] opacity-95 shadow-[-8px_0_20px_rgba(0,0,0,0.18)] pointer-events-none z-0">
        <div className="w-full h-full opacity-30 bg-[linear-gradient(90deg,transparent_40%,rgba(255,255,255,0.3)_50%,transparent_60%)] bg-[size:16px_100%] animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      {/* Main Glassmorphic Panel (Extremely Clear, Premium, Glossy and Clean Design) */}
      <div className="bg-white/95 border border-white/60 rounded-[32px] w-full max-w-5xl overflow-hidden shadow-[0_20px_60px_rgba(219,39,119,0.15)] relative text-slate-800 my-4 md:my-8 flex flex-col max-h-none md:max-h-[94vh] animate-scale-up">
        
        {/* Soft luxury top runway light stripe */}
        <div className="h-1.5 bg-gradient-to-r from-pink-300 via-rose-400 to-pink-350 w-full" />

        {/* 🎀 TOP HEADER IN THE EXACT LAYOUT FROM THE ATTACHED DESIGN MOCKUP */}
        <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center bg-white/70 border-b border-pink-100/50 relative z-10 gap-4 sm:gap-2">
          
          {/* Brand Logo Replacement: Fashion Finances instead of Victoria's Secret */}
          <div className="flex items-center gap-2 select-none hover:opacity-90 transition">
            <FashionsFinanceLogo className="w-8 h-8" mode="light" withText={true} inlineText={true} textClassName="text-pink-900" subTextClassName="text-pink-500" />
          </div>

          {/* Middle Navigation options exactly as listed in the mockup (Removed CÓMO FUNCIONA and enabled tabs) */}
          <div className="flex items-center gap-4 sm:gap-6 text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            <button 
              onClick={() => setActiveTab('ranking')}
              className={`pb-1 transition-all duration-300 cursor-pointer ${activeTab === 'ranking' ? 'text-pink-600 border-b-2 border-pink-600' : 'hover:text-pink-500 text-slate-400'}`}
              id="tab-ranking-nav"
            >
              RANKING
            </button>
            <button 
              onClick={() => setActiveTab('premios')}
              className={`pb-1 transition-all duration-300 cursor-pointer ${activeTab === 'premios' ? 'text-pink-600 border-b-2 border-pink-600' : 'hover:text-pink-500 text-slate-400'}`}
              id="tab-premios-nav"
            >
              PREMIOS
            </button>
            <button 
              onClick={() => setActiveTab('hall_of_fame')}
              className={`pb-1 transition-all duration-300 cursor-pointer ${activeTab === 'hall_of_fame' ? 'text-pink-600 border-b-2 border-pink-600' : 'hover:text-pink-500 text-slate-400'}`}
              id="tab-hall-nav"
            >
              HALL OF FAME
            </button>
          </div>

          {/* Classic luxury Back pill button on the right */}
          <button
            onClick={onClose}
            className="bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-600 font-extrabold text-[10px] md:text-xs px-5 py-2.5 rounded-full transition-all duration-300 border border-pink-100 shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>‹</span> VOLVER
          </button>
        </div>

        {/* Scrollable Center Runway Container */}
        <div className="p-4 sm:p-8 md:p-10 space-y-8 relative z-10 overflow-y-auto">
          
          {/* Render Active Tab Content */}

          {activeTab === 'ranking' && (
            <>
              {/* ✨ MAIN PRESTIGE TITLE CONTAINER WITH HIGH-FASHION TYPOGRAPHY */}
              <div className="text-center space-y-2 relative">
                
                {/* Crown Motif ontop of the title - Serious and Elegant High-Fashion Vector Crown */}
                <div className="flex justify-center mb-1">
                  <svg 
                    className="w-10 h-7 text-amber-500 fill-amber-400 drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)]" 
                    viewBox="0 0 100 50" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M15,40 L20,16 L42,26 L50,9 L58,26 L80,16 L85,40 Z" 
                      stroke="#B45309" 
                      strokeWidth="1.8" 
                      strokeLinejoin="round" 
                      fill="currentColor"
                      fillOpacity="0.85"
                    />
                    <rect x="12" y="40" width="76" height="3" fill="#B45309" rx="1" />
                    <circle cx="20" cy="16" r="2.2" fill="#FFF" />
                    <circle cx="50" cy="9" r="2.2" fill="#FFF" />
                    <circle cx="80" cy="16" r="2.2" fill="#FFF" />
                  </svg>
                </div>

                <h2 className="text-2xl font-light tracking-[0.35em] text-pink-900/90 uppercase font-serif">
                  THE ANGELS
                </h2>
                <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-amber-700 font-serif filter drop-shadow-xs">
                  RANKING
                </h1>
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.32em] font-mono">
                  LAS MODELOS MÁS ADMIRADAS EN TIEMPO REAL
                </p>
                
                {/* Little pink updated badge */}
                <div className="inline-block mt-3 bg-pink-100/60 border border-pink-200/40 text-[9px] font-bold text-pink-600 uppercase tracking-widest px-3 py-1 rounded-full">
                  ✨ ACTUALIZADO CADA 60 SEGUNDOS
                </div>
              </div>

              {/* 📢 PRESTIGE CONTEST RULES EXPLANATION */}
              <div className="bg-gradient-to-r from-pink-50/80 to-amber-50/40 border-2 border-pink-100/60 rounded-2xl p-4 sm:p-5 text-slate-700 text-xs md:text-sm leading-relaxed shadow-xs max-w-3xl mx-auto flex items-start gap-3.5 text-left">
                <div className="bg-pink-100 p-2.5 rounded-xl shrink-0 text-pink-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <strong className="text-pink-950 font-black block text-xs md:text-sm uppercase tracking-wider font-display">💡 ¿En qué consiste este prestigioso concurso?</strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    El modelo que más <strong>Likes</strong> acumule en las fotos de su perfil y en sus vídeos será coronado como la número 1. Si logras posicionarte entre las 100 afortunadas de esta pasarela estelar, podrás <strong>ganar el patrocinio de un gran grupo de inversores</strong> en nuestras mesas.
                  </p>
                </div>
              </div>

              {/* 🏆 THE COUTURE PODIUM GRID (Exact 2, 1, 3 visual architecture from mockup) */}
              {firstPlace ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-end max-w-3xl mx-auto pt-6 px-2">
                  
                  {/* RANKING #2 : MODELO ORO (ELITE ORO) - LEFT BAR */}
                  {secondPlace && (
                    <div className="flex flex-col items-center order-2 md:order-1 group transition-transform duration-500 hover:-translate-y-1 relative">
                      
                      {/* Decorative Arch Portrait representation */}
                      <div className="relative mb-4 flex flex-col items-center">
                        
                        {/* Smooth pink studio semicircles peeking from behind the arch */}
                        <div className="absolute w-28 h-16 -left-2 top-[32%] bg-[#FD7CBB]/75 rounded-full pointer-events-none z-0 shadow-sm" />
                        <div className="absolute w-28 h-16 -right-2 top-[32%] bg-[#FD7CBB]/75 rounded-full pointer-events-none z-0 shadow-sm" />

                        {/* Highly Polished Arched Frame Overlay */}
                        <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-t-full overflow-hidden border-4 border-[#FBBFCE] shadow-md bg-white p-1 relative z-10">
                          <div className="w-full h-full rounded-t-full overflow-hidden relative">
                            <img
                              src={secondPlace.avatar}
                              alt={secondPlace.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Shimmer overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          </div>
                        </div>

                        {/* White Name badge overlaying bottom boundary exactly as in zx.png */}
                        <div className="absolute bottom-1 z-20 bg-white border border-slate-200 rounded-md px-3.5 py-1.5 shadow-md text-center min-w-[75%]">
                          <span className="text-[10px] font-mono font-black text-slate-800 tracking-widest uppercase block leading-none">
                            {secondPlace.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Votos and Name block */}
                      <div className="text-center space-y-0.5 w-full z-15 pt-0.5 px-1 mb-2">
                        <h4 className="text-[12px] sm:text-sm font-bold text-slate-900 tracking-wide truncate">
                          {secondPlace.name}
                        </h4>
                        <div className="inline-flex items-center gap-0.5 text-[#E12A75] text-[11px] font-bold">
                          <strong>♥ {(secondPlace.totalLikes || 14717).toLocaleString()} votos</strong>
                        </div>
                      </div>

                      {/* White Pedestal Column 2 - matching zx.png perfectly */}
                      <div className="w-full bg-white border border-pink-100 rounded-xl shadow-xs p-4 flex flex-col items-center justify-center relative min-h-[140px]">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-400 to-rose-450 rounded-t-xl" />
                        
                        {/* Upper label of Pedestal */}
                        <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#B93259] mb-1 font-sans">
                          MODELO ORO
                        </span>
                        
                        <span className="font-serif font-bold text-4xl text-[#E12A75] my-1 leading-none">
                          2
                        </span>
                        
                        <div className="text-[9px] text-[#E12A75] font-semibold uppercase tracking-[0.14em] mt-1.5">
                          ✦ ANGEL ELITE ✦
                        </div>

                        <button
                          onClick={() => onSelectModel && onSelectModel(secondPlace)}
                          className="text-[10px] text-[#E12A75] hover:text-pink-800 font-bold underline bg-transparent cursor-pointer border-0 mt-3.5 z-20"
                        >
                          Ver Ficha
                        </button>
                      </div>

                      {/* Brand Sponsors Row for 2nd place */}
                      <div className="mt-3 w-full bg-gradient-to-tr from-stone-50/50 to-white/95 border border-pink-100/60 rounded-2xl p-2.5 shadow-xs space-y-1.5 text-center">
                        <span className="text-[8px] font-black tracking-[0.16em] uppercase text-pink-700/90 block">
                          💎 SPONSORS DE ÉLITE 💎
                        </span>
                        <div className="flex items-center justify-around gap-1.5 pt-1.5 border-t border-pink-100/50">
                          {/* Gucci */}
                          <div className="flex flex-col items-center justify-center group/brand hover:scale-105 transition-transform">
                            <div className="w-7 h-7 rounded-full bg-[#1b3c22] border border-[#811f26] flex items-center justify-center text-[#d5af66] font-semibold text-[8px] shadow-xs">
                              GG
                            </div>
                            <span className="text-[7.5px] font-sans font-bold tracking-[0.12em] text-slate-700 mt-1 uppercase">Gucci</span>
                          </div>
                          {/* Versace */}
                          <div className="flex flex-col items-center justify-center group/brand hover:scale-105 transition-transform">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 p-0.5 shadow-xs">
                              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-[#d5af66] font-serif text-[7.5px] font-bold">
                                V
                              </div>
                            </div>
                            <span className="text-[7.5px] font-serif font-bold tracking-wider text-slate-700 mt-1 uppercase">Versace</span>
                          </div>
                          {/* Balenciaga */}
                          <div className="flex flex-col items-center justify-center group/brand hover:scale-105 transition-transform">
                            <div className="w-7 h-7 bg-zinc-900 border border-slate-750 flex items-center justify-center text-white font-sans font-black text-[7.5px] tracking-wide rounded shadow-xs">
                              BB
                            </div>
                            <span className="text-[7.5px] font-mono font-bold tracking-wider text-slate-700 mt-1 uppercase">Balen</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* RANKING #1 : MODELO DIAMANTE (DIAMOND ANGEL) - TALL CENTER COLUMN */}
                  {firstPlace && (
                    <div className="flex flex-col items-center order-1 md:order-2 group z-20 transition-transform duration-500 hover:-translate-y-2 relative">
                      
                      {/* Glowing halo behind champion */}
                      <div className="absolute inset-0 -top-12 bg-pink-300/10 rounded-full blur-3xl scale-125 animate-pulse" />

                      {/* Decorative Arch Portrait representation */}
                      <div className="relative mb-4 flex flex-col items-center">
                        
                        {/* Elegant Crown hovered above image frame */}
                        <div className="absolute -top-15 z-30 transition duration-500 group-hover:scale-115 drop-shadow-[0_4px_14px_rgba(239,68,68,0.5)]">
                          <img 
                            src="https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Crowns-PNG/Diamond_Tiara_with_Rubies_PNG_Clipart.png" 
                            alt="Corona de Diamantes y Rubíes" 
                            referrerPolicy="no-referrer"
                            className="w-20 h-auto object-contain"
                          />
                        </div>

                        {/* Large pink butterfly studio wings peeking from behind the arch */}
                        <div className="absolute w-36 h-22 -left-3 top-[26%] bg-[#FD4CA2]/85 rounded-full pointer-events-none z-0 shadow-md animate-pulse" style={{ animationDuration: '4s' }} />
                        <div className="absolute w-36 h-22 -right-3 top-[26%] bg-[#FD4CA2]/85 rounded-full pointer-events-none z-0 shadow-md animate-pulse" style={{ animationDuration: '4s' }} />

                        {/* Highly Polished Arched Frame Overlay with fine dark trim */}
                        <div className="w-28 h-36 sm:w-32 sm:h-44 rounded-t-full overflow-hidden border-4 border-[#3c1d1a] shadow-lg bg-pink-50 p-1 relative z-10">
                          <div className="w-full h-full rounded-t-full overflow-hidden relative">
                            <img
                              src={firstPlace.avatar}
                              alt={firstPlace.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Champion golden highlight glow */}
                            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/10 via-transparent to-transparent" />
                          </div>
                        </div>

                        {/* Golden yellow name tag badge exactly as in zx.png */}
                        <div className="absolute bottom-1 z-20 bg-[#FCB115] border border-amber-500 rounded-md px-5 py-2 shadow-md text-center min-w-[75%]">
                          <span className="text-[11px] font-mono font-black text-slate-950 tracking-wider uppercase block leading-none">
                            {firstPlace.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Votos and Name block */}
                      <div className="text-center space-y-0.5 w-full z-15 pt-0.5 px-1 mb-2">
                        <div className="flex justify-center items-center gap-1">
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-wide">
                            {firstPlace.name}
                          </h4>
                          <span className="text-base leading-none text-amber-500">★</span>
                        </div>
                        <div className="inline-flex items-center gap-0.5 text-[#E12A75] text-[11px] font-mono font-bold">
                          <strong>♥ {(firstPlace.totalLikes || 14926).toLocaleString()} votos</strong>
                        </div>
                      </div>

                      {/* White Pedestal Column 1 (Taller step) */}
                      <div className="w-full bg-white border border-pink-200/80 rounded-xl shadow-sm p-5 flex flex-col items-center justify-center relative min-h-[165px]">
                        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-t-xl" />
                        
                        {/* Upper label of Pedestal */}
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#B93259] mb-1.5 font-sans">
                          MODELO DIAMANTE
                        </span>
                        
                        <span className="font-serif font-black text-5xl text-[#E12A75] my-1 leading-none">
                          1
                        </span>
                        
                        <div className="text-[9.5px] text-[#B93259] font-semibold uppercase tracking-[0.16em] mt-1.5">
                          ✦ DIAMOND ANGEL ✦
                        </div>

                        <button
                          onClick={() => onSelectModel && onSelectModel(firstPlace)}
                          className="text-[11px] text-white bg-[#E1005E] hover:bg-[#C10050] font-black uppercase tracking-wider px-6 py-2 rounded-lg cursor-pointer border-0 mt-4 transition-all hover:scale-105 shadow-md"
                        >
                          SUPERESTRELLA
                        </button>
                      </div>

                      {/* Brand Sponsors Row for 1st place */}
                      <div className="mt-3 w-full bg-gradient-to-tr from-amber-50/40 via-white to-pink-50/30 border border-amber-200/70 rounded-2xl p-2.5 shadow-md space-y-1.5 text-center relative overflow-hidden">
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-400/20 rounded-full blur-md" />
                        <span className="text-[8px] font-black tracking-[0.16em] uppercase text-amber-850 block">
                          👑 SPONSORS DE ÉLITE 👑
                        </span>
                        <div className="flex items-center justify-around gap-1.5 pt-1.5 border-t border-amber-200/50">
                          {/* Chanel */}
                          <div className="flex flex-col items-center justify-center group/brand hover:scale-105 transition-transform">
                            <div className="w-7 h-7 rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-[8px] tracking-tighter shadow-xs">
                              CC
                            </div>
                            <span className="text-[7.5px] font-sans font-bold tracking-[0.12em] text-slate-700 mt-1 uppercase">Chanel</span>
                          </div>
                          {/* Dior */}
                          <div className="flex flex-col items-center justify-center group/brand hover:scale-105 transition-transform">
                            <div className="w-7 h-7 rounded-full bg-[#fdf2f8] border border-pink-100 flex items-center justify-center text-rose-800 font-serif italic text-[10px] font-extrabold shadow-sm">
                              D
                            </div>
                            <span className="text-[7.5px] font-serif font-bold italic text-slate-700 mt-1">Dior</span>
                          </div>
                          {/* Prada */}
                          <div className="flex flex-col items-center justify-center group/brand hover:scale-105 transition-transform">
                            <div className="w-7 h-7 bg-zinc-950 flex items-center justify-center text-white shadow-xs relative rounded-sm" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}>
                              <span className="text-[5.5px] font-serif font-black tracking-widest text-[#d5af66] -mt-1.5">P</span>
                            </div>
                            <span className="text-[7.5px] font-sans font-bold tracking-widest text-slate-700 mt-1 uppercase">Prada</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* RANKING #3 : MODELO PLATINO (RUNWAY QUEEN) - RIGHT BAR */}
                  {thirdPlace && (
                    <div className="flex flex-col items-center order-3 group transition-transform duration-500 hover:-translate-y-1 relative">
                       
                      {/* Decorative Arch Portrait representation */}
                      <div className="relative mb-4 flex flex-col items-center">
                        
                        {/* Soft gray-pink smooth studio semicircles peeking from behind the arch */}
                        <div className="absolute w-26 h-14 -left-1.5 top-[32%] bg-[#C3C2C7]/80 rounded-full pointer-events-none z-0 shadow-sm" />
                        <div className="absolute w-26 h-14 -right-1.5 top-[32%] bg-[#C3C2C7]/80 rounded-full pointer-events-none z-0 shadow-sm" />

                        {/* Highly Polished Arched Frame Overlay */}
                        <div className="w-22 h-28 sm:w-26 sm:h-32 rounded-t-full overflow-hidden border-4 border-[#B93259] shadow-md bg-white p-1 relative z-10">
                          <div className="w-full h-full rounded-t-full overflow-hidden relative">
                            <img
                              src={thirdPlace.avatar}
                              alt={thirdPlace.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Shimmer overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          </div>
                        </div>

                        {/* White Name badge overlaying bottom boundary exactly as in zx.png */}
                        <div className="absolute bottom-1 z-20 bg-white border border-slate-200 rounded-md px-3.5 py-1.5 shadow-md text-center min-w-[75%]">
                          <span className="text-[10px] font-mono font-black text-slate-800 tracking-widest uppercase block leading-none">
                            {thirdPlace.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Votos and Name block */}
                      <div className="text-center space-y-0.5 w-full z-15 pt-0.5 px-1 mb-2">
                        <h4 className="text-[12px] sm:text-sm font-bold text-slate-900 tracking-wide truncate">
                          {thirdPlace.name}
                        </h4>
                        <div className="inline-flex items-center gap-0.5 text-[#E12A75] text-[11px] font-bold">
                          <strong>♥ {(thirdPlace.totalLikes || 14415).toLocaleString()} votos</strong>
                        </div>
                      </div>

                      {/* White Pedestal Column 3 */}
                      <div className="w-full bg-white border border-pink-100 rounded-xl shadow-xs p-4 flex flex-col items-center justify-center relative min-h-[140px]">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-t-xl" />
                        
                        {/* Upper label of Pedestal */}
                        <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#B93259] mb-1 font-sans">
                          MODELO PLATINO
                        </span>
                        
                        <span className="font-serif font-bold text-4xl text-[#E12A75] my-1 leading-none">
                          3
                        </span>
                        
                        <div className="text-[9px] text-[#E12A75] font-semibold uppercase tracking-[0.14em] mt-1.5">
                          ✦ RUNWAY QUEEN ✦
                        </div>

                        <button
                          onClick={() => onSelectModel && onSelectModel(thirdPlace)}
                          className="text-[10px] text-[#E12A75] hover:text-pink-800 font-bold underline bg-transparent cursor-pointer border-0 mt-3.5 z-20"
                        >
                          Ver Ficha
                        </button>
                      </div>

                      {/* Brand Sponsors Row for 3rd place */}
                      <div className="mt-3 w-full bg-gradient-to-tr from-stone-50/50 to-white/95 border border-pink-100/60 rounded-2xl p-2.5 shadow-xs space-y-1.5 text-center">
                        <span className="text-[8px] font-black tracking-[0.16em] uppercase text-pink-700/90 block">
                          ⭐ SPONSORS DE ÉLITE ⭐
                        </span>
                        <div className="flex items-center justify-around gap-1.5 pt-1.5 border-t border-pink-100/50">
                          {/* Louis Vuitton */}
                          <div className="flex flex-col items-center justify-center group/brand hover:scale-105 transition-transform">
                            <div className="w-7 h-7 rounded-full bg-[#3e2723] border border-[#a1887f]/50 flex items-center justify-center text-[#d7ccc8] font-bold text-[8px] shadow-xs">
                              LV
                            </div>
                            <span className="text-[7.5px] font-sans font-bold tracking-widest text-slate-700 mt-1 uppercase">L.V.</span>
                          </div>
                          {/* YSL */}
                          <div className="flex flex-col items-center justify-center group/brand hover:scale-105 transition-transform">
                            <div className="w-7 h-7 bg-zinc-900 flex items-center justify-center text-[#d5af66] font-serif font-semibold text-[8px] tracking-tighter leading-none rounded-full shadow-xs">
                              YSL
                            </div>
                            <span className="text-[7.5px] font-sans font-bold tracking-wider text-slate-700 mt-1 uppercase">YSL</span>
                          </div>
                          {/* Hermès */}
                          <div className="flex flex-col items-center justify-center group/brand hover:scale-105 transition-transform">
                            <div className="w-7 h-7 bg-[#f4511e] rounded flex items-center justify-center text-white font-serif font-bold text-[9px] shadow-xs border border-amber-600/10">
                              H
                            </div>
                            <span className="text-[7.5px] font-serif font-bold tracking-widest text-slate-700 mt-1 uppercase">Hermès</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              ) : (
                <p className="text-center text-slate-450">No hay modelos registradas disponibles para el ranking.</p>
              )}

              {/* 👑 RECUADRO APARTE - MODELO LEYENDA (Laurel design with exact stats from mockup image) */}
              <div 
                onClick={() => onSelectModel && onSelectModel(legendModel)}
                className="max-w-xl mx-auto border-2 border-pink-200/50 bg-gradient-to-r from-pink-50/70 via-white to-pink-50/60 rounded-[28px] p-5 relative overflow-hidden transition-all duration-300 shadow-sm flex flex-col sm:flex-row items-center gap-6 text-left cursor-pointer hover:border-pink-400 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] group/legend"
                title={`Haga click para ver el escaparate de la tienda de ${legendModel?.name || 'Adriana Lima'}`}
              >
                
                {/* Soft ambient glow behind portrait */}
                <div className="absolute left-6 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

                {/* Left Circular Frame with Golden Halo and Wings */}
                {legendModel && (
                  <div className="relative shrink-0 select-none">
                    {/* Double Golden concentric border halo */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 via-pink-300 to-amber-500 rounded-full animate-spin" style={{ animationDuration: '24s' }} />
                    <div className="absolute inset-[3px] bg-white rounded-full" />
                    
                    {/* Image element */}
                    <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-pink-200 m-1">
                      <img
                        src={legendModel.avatar}
                        alt={legendModel.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {/* Rose gloss layer */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-transparent" />
                    </div>

                    {/* Golden star badge overlay */}
                    <div className="absolute bottom-0 right-1 bg-amber-400 border border-white p-1.5 rounded-full shadow-md z-20">
                      <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
                    </div>
                  </div>
                )}

                {/* Right details corresponding to "VICTORIA ICON" layout representing "FASHION FINANCES ICON" */}
                <div className="flex-1 space-y-2.5 text-center sm:text-left z-10 w-full">
                  
                  <div className="flex items-center justify-center sm:justify-start gap-1 pb-1">
                    <span className="text-slate-300 font-bold text-[9px] tracking-widest block font-mono">✦ ✦ ✦</span>
                    <span className="text-pink-600 font-black text-xs uppercase tracking-[0.25em] font-serif px-1.5">
                      FASHION FINANCES ICON
                    </span>
                    <span className="text-slate-300 font-bold text-[9px] tracking-widest block font-mono">✦ ✦ ✦</span>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                      MAYOR TIEMPO DE PERMANENCIA EN EL PUESTO #1
                    </p>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <h3 className="text-xl font-serif font-black text-rose-950 group-hover/legend:text-pink-600 transition-colors leading-none">
                        {legendModel?.name || 'Adriana Lima'}
                      </h3>
                      <span className="text-[9px] font-black uppercase text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100 opacity-80 group-hover/legend:opacity-100 transition-all">
                        Ver Tienda ↗
                      </span>
                    </div>
                    <p className="text-[11px] text-pink-500 font-bold font-mono">
                      @{legendModel?.username || 'adrianalima_w1'}
                    </p>
                  </div>

                  {/* Récord gold-brown chic pill button */}
                  <div className="inline-flex items-center gap-1.5 bg-[linear-gradient(45deg,#d97706,#b45309)] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xs">
                    🏆 RÉCORD HISTÓRICO
                  </div>

                  {/* Huge Stats Frame: "38 DÍAS EN EL PUESTO #1" styled exactly as the image layout */}
                  <div className="flex items-center justify-center sm:justify-start gap-3.5 pt-1.5 border-t border-pink-100/50">
                    <span className="text-4xl md:text-5xl font-serif font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600 leading-none">
                      38
                    </span>
                    <div className="flex flex-col text-[10px] text-pink-850 font-bold uppercase tracking-wider leading-tight">
                      <span>DÍAS</span>
                      <span>EN EL PUESTO #1</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* 🥈🥉 RECUADRO DE DETALLES DEL SEGUNDO Y TERCER CLASIFICADO */}
              <div className="max-w-xl mx-auto border border-pink-100 bg-white rounded-[24px] p-5 shadow-xs space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-pink-50 pb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-pink-600" />
                    <span className="text-pink-950 font-black text-[10px] uppercase tracking-[0.15em] font-serif">
                      PODIO DE HONOR: CLASIFICACIÓN ESTELAR
                    </span>
                  </div>
                  <span className="bg-pink-50 text-pink-600 text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-pink-100">
                    Modelos de Élite
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* SEGUNDO CLASIFICADO (Plata / Oro) */}
                  {secondPlace && (
                    <div 
                      onClick={() => onSelectModel && onSelectModel(secondPlace)}
                      className="group/second border border-slate-100 hover:border-pink-300 bg-slate-50/55 hover:bg-slate-50 rounded-2xl p-4 transition-all duration-300 cursor-pointer shadow-3xs flex flex-col justify-between space-y-3"
                      title={`Ver escaparate de ${secondPlace.name}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0 select-none">
                          {/* Concentric silver-pink border halo */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-slate-300 via-pink-200 to-slate-400 rounded-full group-hover/second:animate-pulse" />
                          <div className="absolute inset-[2px] bg-white rounded-full" />
                          
                          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 m-0.5">
                            <img
                              src={secondPlace.avatar}
                              alt={secondPlace.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover/second:scale-110 transition-transform duration-500"
                            />
                          </div>

                          {/* Silver medal badge */}
                          <div className="absolute -bottom-1 -right-1 bg-slate-100 border border-slate-300 w-5 h-5 rounded-full flex items-center justify-center shadow-xs z-10">
                            <span className="text-[10px] font-serif font-black text-slate-700">2</span>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <span className="text-[8px] font-black uppercase text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
                            MODELO ORO
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 group-hover/second:text-pink-600 transition-colors truncate mt-1 leading-tight">
                            {secondPlace.name}
                          </h4>
                          <span className="text-[9.5px] text-slate-400 block font-mono">
                            @{secondPlace.username}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-200/60 pt-2.5 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[8px] text-slate-400 font-bold uppercase block font-mono">VOTOS ACUMULADOS</span>
                          <span className="text-xs font-serif font-black text-rose-950">
                            {(secondPlace.totalLikes || 14717).toLocaleString()}
                          </span>
                          <span className="text-[9px] text-pink-500 ml-0.5">♥</span>
                        </div>
                        
                        <span className="text-[8.5px] font-black uppercase text-pink-600 bg-pink-50 px-2 py-1 rounded-lg border border-pink-100/70 opacity-80 group-hover/second:opacity-100 transition-all">
                          Ver Tienda ↗
                        </span>
                      </div>
                    </div>
                  )}

                  {/* TERCER CLASIFICADO (Platino / Cobre) */}
                  {thirdPlace && (
                    <div 
                      onClick={() => onSelectModel && onSelectModel(thirdPlace)}
                      className="group/third border border-slate-100 hover:border-pink-300 bg-slate-50/55 hover:bg-slate-50 rounded-2xl p-4 transition-all duration-300 cursor-pointer shadow-3xs flex flex-col justify-between space-y-3"
                      title={`Ver escaparate de ${thirdPlace.name}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0 select-none">
                          {/* Concentric platinum border halo */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-pink-300 via-slate-200 to-pink-400 rounded-full group-hover/third:animate-pulse" />
                          <div className="absolute inset-[2px] bg-white rounded-full" />
                          
                          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 m-0.5">
                            <img
                              src={thirdPlace.avatar}
                              alt={thirdPlace.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover/third:scale-110 transition-transform duration-500"
                            />
                          </div>

                          {/* Bronze/Platinum medal badge */}
                          <div className="absolute -bottom-1 -right-1 bg-pink-50 border border-pink-200 w-5 h-5 rounded-full flex items-center justify-center shadow-xs z-10">
                            <span className="text-[10px] font-serif font-black text-pink-700">3</span>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <span className="text-[8px] font-black uppercase text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100">
                            MODELO PLATINO
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 group-hover/third:text-pink-600 transition-colors truncate mt-1 leading-tight">
                            {thirdPlace.name}
                          </h4>
                          <span className="text-[9.5px] text-slate-400 block font-mono">
                            @{thirdPlace.username}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-200/60 pt-2.5 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[8px] text-slate-400 font-bold uppercase block font-mono">VOTOS ACUMULADOS</span>
                          <span className="text-xs font-serif font-black text-rose-950">
                            {(thirdPlace.totalLikes || 14441).toLocaleString()}
                          </span>
                          <span className="text-[9px] text-pink-500 ml-0.5">♥</span>
                        </div>
                        
                        <span className="text-[8.5px] font-black uppercase text-pink-600 bg-pink-50 px-2 py-1 rounded-lg border border-pink-100/70 opacity-80 group-hover/third:opacity-100 transition-all">
                          Ver Tienda ↗
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 📋 CLASIFICACIÓN COMPLETA DE LOS 100 MODELOS DE ÉLITE */}
              <div className="max-w-3xl mx-auto bg-white border-2 border-pink-100 rounded-3xl p-5 shadow-sm space-y-4 text-slate-800">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-50 pb-3">
                  <div className="space-y-0.5 text-left">
                    <h3 className="text-sm font-black uppercase text-pink-950 tracking-wider flex items-center gap-1.5 font-display">
                      <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
                      Clasificación de los 100 Modelos de Élite (Hombres y Mujeres)
                    </h3>
                    <p className="text-[10px] text-slate-450 font-bold uppercase tracking-widest font-mono">
                      Ordenados por el total de "Me Gusta" acumulados en las imágenes de su perfil
                    </p>
                  </div>
                  
                  {/* Filters */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 p-1 rounded-full shrink-0">
                    <button
                      type="button"
                      onClick={() => setGenderFilter('all')}
                      className={`px-3 py-1 text-[9.5px] font-extrabold rounded-full transition-all uppercase tracking-wider cursor-pointer border-0 bg-transparent ${genderFilter === 'all' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Todos
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenderFilter('female')}
                      className={`px-3 py-1 text-[9.5px] font-extrabold rounded-full transition-all uppercase tracking-wider cursor-pointer border-0 bg-transparent ${genderFilter === 'female' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Femenino
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenderFilter('male')}
                      className={`px-3 py-1 text-[9.5px] font-extrabold rounded-full transition-all uppercase tracking-wider cursor-pointer border-0 bg-transparent ${genderFilter === 'male' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Masculino
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar modelo por nombre, usuario o alias..."
                    value={rankingSearchQuery}
                    onChange={(e) => setRankingSearchQuery(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-pink-100 hover:border-pink-200 focus:border-pink-400 p-2.5 pl-9 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100 transition"
                  />
                  <div className="absolute left-3.5 top-3 text-slate-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  {rankingSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setRankingSearchQuery('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 font-extrabold text-xs cursor-pointer border-0 bg-transparent"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Scrollable List container */}
                <div className="border border-pink-50 rounded-2xl overflow-hidden bg-slate-50/20 max-h-[440px] overflow-y-auto scrollbar-thin divide-y divide-pink-50/50 text-slate-800">
                  {/* Header Row */}
                  <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-pink-55/30 text-[8.5px] font-black uppercase text-slate-400 tracking-widest sticky top-0 z-20 backdrop-blur-xs border-b border-pink-50">
                    <div className="col-span-2 text-center">PUESTO</div>
                    <div className="col-span-6 text-left">CREADOR/A / CREATOR</div>
                    <div className="col-span-2 text-center">VOTOS</div>
                    <div className="col-span-2 text-center">ACCIÓN</div>
                  </div>

                  {/* Body rows */}
                  {filteredRankings.length > 0 ? (
                    filteredRankings.map((model) => {
                      // Find actual rank in the master list
                      const actualRank = masterSortedRanking.findIndex(m => m.id === model.id) + 1;
                      
                      return (
                        <div 
                          key={model.id}
                          className="grid grid-cols-12 gap-2 px-4 py-3 items-center text-left hover:bg-pink-50/15 transition-all group/row border-b border-pink-50/30"
                        >
                          {/* Rank column */}
                          <div className="col-span-2 flex items-center justify-center">
                            {actualRank === 1 ? (
                              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-black text-xs border border-amber-300 relative shadow-xs" title="1º Puesto: Ángel Supremo">
                                👑
                                <span className="absolute -bottom-1 text-[7px] bg-amber-600 text-white px-1 rounded-full scale-90 font-mono">1</span>
                              </span>
                            ) : actualRank === 2 ? (
                              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-black text-xs border border-slate-300 relative shadow-xs" title="2º Puesto: Elite Oro">
                                ⭐
                                <span className="absolute -bottom-1 text-[7px] bg-slate-500 text-white px-1 rounded-full scale-90 font-mono">2</span>
                              </span>
                            ) : actualRank === 3 ? (
                              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-100 text-rose-800 font-black text-xs border border-rose-200 relative shadow-xs" title="3º Puesto: Runway Queen">
                                ✨
                                <span className="absolute -bottom-1 text-[7px] bg-rose-600 text-white px-1 rounded-full scale-90 font-mono">3</span>
                              </span>
                            ) : (
                              <span className="font-mono font-extrabold text-xs text-slate-400 bg-slate-100/60 px-2 py-0.5 rounded-md min-w-[24px] text-center">
                                #{actualRank}
                              </span>
                            )}
                          </div>

                          {/* Profile Column */}
                          <div className="col-span-6 flex items-center gap-2.5">
                            <div className="relative shrink-0">
                              <div className="w-9 h-9 rounded-full overflow-hidden border border-pink-100 bg-white">
                                <img
                                  src={model.avatar}
                                  alt={model.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover/row:scale-110 transition duration-300"
                                />
                              </div>
                              {model.isCastingLive && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-ping" />
                              )}
                              {model.isOnline && !model.isCastingLive && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                              )}
                            </div>
                            <div className="truncate text-left leading-tight">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="font-bold text-xs text-slate-800 truncate hover:text-pink-600 transition">
                                  {model.name}
                                </span>
                                {actualRank <= 10 && (
                                  <span className="text-[7.5px] font-black tracking-wider bg-pink-50 text-[#E12A75] border border-pink-200 px-1 py-0.2 rounded-sm select-none uppercase shrink-0 scale-90">
                                    TOP 10
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium font-mono block truncate">
                                @{model.username}
                              </span>
                            </div>
                          </div>

                          {/* Votes Column */}
                          <div className="col-span-2 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <span className="font-mono font-bold text-xs text-pink-600 flex items-center gap-0.5">
                                <span className="scale-90 text-pink-500">♥</span>
                                {(model.totalLikes || 0).toLocaleString()}
                              </span>
                              <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider font-mono">Votos</span>
                            </div>
                          </div>

                          {/* Action Column */}
                          <div className="col-span-2 flex justify-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectModel) {
                                  onSelectModel(model);
                                  onClose();
                                }
                              }}
                              className="text-[10px] font-black text-pink-600 bg-pink-50 hover:bg-pink-600 hover:text-white px-2.5 py-1.5 rounded-lg transition duration-200 cursor-pointer border-0 select-none uppercase tracking-wider text-center"
                            >
                              Ver
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No se encontraron modelos con los filtros seleccionados.
                    </div>
                  )}
                </div>

                {/* Footer status line inside list */}
                <div className="text-[9px] text-slate-400 font-mono uppercase tracking-widest text-center pt-1 flex items-center justify-center gap-1.5">
                  <span>Visualizando {filteredRankings.length} de {masterSortedRanking.length} modelos de la pasarela</span>
                </div>
              </div>

              {/* 📊 TRIPLE STATS DECORATIVE CAPSULE AT THE BOTTOM (Exactly from mockup) */}
              <div className="max-w-3xl mx-auto bg-gradient-to-r from-pink-50/80 via-white to-pink-50/80 border border-pink-100/60 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-pink-100">
                
                <div className="flex items-center justify-center gap-3.5 px-3 py-2 md:py-1">
                  <div className="bg-pink-100 p-2.5 rounded-full text-pink-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] md:text-xs font-black text-pink-950 block uppercase tracking-wide font-display">
                      TOP 0.1% MUNDIAL
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block leading-none">
                      De las modelos más admiradas
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3.5 px-3 pt-4 md:pt-1 pb-2 md:pb-1">
                  <div className="bg-pink-100 p-2.5 rounded-full text-pink-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] md:text-xs font-black text-pink-950 block uppercase tracking-wide font-display">
                      +2.4M VOTOS
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block leading-none">
                      Registrados este mes
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3.5 px-3 pt-4 md:pt-1 pb-2 md:pb-1">
                  <div className="bg-pink-100 p-2.5 rounded-full text-pink-600">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] md:text-xs font-black text-pink-950 block uppercase tracking-wide font-display">
                      100 MODELOS
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block leading-none">
                      Compitiendo en tiempo real
                    </span>
                  </div>
                </div>

              </div>
            </>
          )}

          {activeTab === 'premios' && (
            <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
              
              {/* Header section */}
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-1">
                  <Gift className="w-8 h-8 text-pink-600" />
                </div>
                <h1 className="text-3xl font-serif font-black tracking-wider text-pink-905 uppercase">
                  PREMIOS FASHION FINANCES
                </h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                  🎁 Recompensas de la Pasarela Elite de Alta Costura 🎁
                </p>
                <div className="w-16 h-0.5 mx-auto bg-pink-300 rounded-full" />
              </div>

              {/* Informative introductory callout */}
              <div className="bg-gradient-to-r from-pink-50 to-amber-50 border border-pink-200/50 rounded-2xl p-5 text-slate-705 text-xs sm:text-sm text-center max-w-2xl mx-auto">
                <p>
                  Nuestros mecenas, patrocinadores de marca y socios de fondos corporativos premian a las 100 creadoras de Fashion Finances con base en sus niveles de interacción global. ¡La excelencia estética tiene valores financieros reales!
                </p>
              </div>

              {/* Award Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                
                {/* 1st Tier */}
                <div className="bg-white border-2 border-pink-200 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 bg-pink-100 text-pink-700 text-[10px] font-black tracking-widest px-3 py-1 rounded-bl-xl font-mono">
                    NIVEL DIAMANTE
                  </div>
                  <div className="space-y-4 pt-2">
                    <span className="text-xs font-extrabold text-pink-600 font-mono tracking-widest block">1º PUESTO</span>
                    <h3 className="text-pink-903 font-serif font-extrabold text-2xl">
                      Campaña Global Premium
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      El modelo número 1 recibe un patrocinio directo del fondo de Fashion Finances S.A. para financiar sus proyectos creativos y una portada exclusiva.
                    </p>
                    <ul className="text-slate-700 text-xs space-y-2 border-t border-slate-100 pt-3">
                      <li className="flex items-center gap-2 font-medium">✨ <strong>€100.000</strong> en fondos directos</li>
                      <li className="flex items-center gap-2">📸 Reportaje de Portada Internacional</li>
                      <li className="flex items-center gap-2">⭐️ 100% prioridad en castings en vivo</li>
                    </ul>
                  </div>
                </div>

                {/* 2nd Tier */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-[10px] font-black tracking-widest px-3 py-1 rounded-bl-xl font-mono">
                    NIVEL ORO
                  </div>
                  <div className="space-y-4 pt-2">
                    <span className="text-xs font-extrabold text-slate-500 font-mono tracking-widest block">2º PUESTO</span>
                    <h3 className="text-slate-900 font-serif font-extrabold text-xl">
                      Mecenazgo Coporativo
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Ofrecemos un impulso estelar impulsando su portafolio a los inversores más confiables y recomendando su canal para castings express.
                    </p>
                    <ul className="text-slate-700 text-xs space-y-2 border-t border-slate-100 pt-3">
                      <li className="flex items-center gap-2 font-medium">✨ <strong>€50.000</strong> en fondos directos</li>
                      <li className="flex items-center gap-2">🎬 Sesión fotográfica en Milán o París</li>
                      <li className="flex items-center gap-2">⭐️ Insignia verificada "Elite Oro"</li>
                    </ul>
                  </div>
                </div>

                {/* 3rd Tier */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 bg-indigo-50 text-indigo-700 text-[10px] font-black tracking-widest px-3 py-1 rounded-bl-xl font-mono">
                    NIVEL PLATINO
                  </div>
                  <div className="space-y-4 pt-2">
                    <span className="text-xs font-extrabold text-slate-500 font-mono tracking-widest block">3º PUESTO</span>
                    <h3 className="text-slate-900 font-serif font-extrabold text-xl">
                      Runway Queen Elite
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      La tercera corona destaca las interacciones dinámicas de los seguidores, promoviendo el acceso directo de los directores creativos VIP de la plataforma.
                    </p>
                    <ul className="text-slate-700 text-xs space-y-2 border-t border-slate-100 pt-3">
                      <li className="flex items-center gap-2 font-medium">✨ <strong>€25.000</strong> de capital semilla</li>
                      <li className="flex items-center gap-2">💌 Prioridad de emparejamiento con ángeles</li>
                      <li className="flex items-center gap-2">⭐️ Insignia verificada "Runway Choice"</li>
                    </ul>
                  </div>
                </div>

              </div>

              {/* Rules and guidelines of rewards */}
              <div className="bg-white border border-pink-100 rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-black uppercase text-pink-650 tracking-wider flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-4 h-4" /> Cómo se otorgan y desbloquean
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed text-left">
                  <p>
                    <strong>1. Verificación del Jurado de Moda:</strong> Al final de cada ciclo mensual, los likes combinados (tanto de perfil como de vídeos) son auditados y se anuncia públicamente la asignación del fondo de patrocinio.
                  </p>
                  <p>
                    <strong>2. Relación de Socios Inversores:</strong> Las comisiones ganadas de patrocinadores por castings son 15% más elevadas para todos los creadores que mantengan su estatus dentro de los top 10 del mes.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setActiveTab('ranking')}
                  className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs px-6 py-3 rounded-full shadow transition-all duration-300 transform hover:scale-102"
                >
                  <span>Ver Clasificación Actual de Creadores</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {activeTab === 'hall_of_fame' && (
            <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
              
              {/* Header section */}
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-1">
                  <Trophy className="w-8 h-8 text-amber-500" />
                </div>
                <h1 className="text-3xl font-serif font-black tracking-wider text-pink-905 uppercase">
                  HALL OF FAME
                </h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                  🏆 Creadores Legendarios con Mayor Historial de Éxitos 🏆
                </p>
                <div className="w-16 h-0.5 mx-auto bg-amber-400 rounded-full" />
              </div>

              {/* Informative introductory callout */}
              <div className="bg-gradient-to-r from-pink-50 to-amber-50/60 border border-pink-200/50 rounded-2xl p-5 text-slate-705 text-xs sm:text-sm text-center max-w-2xl mx-auto">
                <p>
                  El prestigioso Hall de la Fama de <strong>Fashion Finances</strong> celebra a los creadores de contenido que no solo alcanzaron el número 1, sino que establecieron récords históricos y redefinieron lo que significa el glamour digital de alta costura.
                </p>
              </div>

              {/* Elegant List of Hall of Famers */}
              <div className="space-y-4">
                
                {/* Legend 1 */}
                <div className="bg-white border-2 border-amber-300 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-5 relative hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black tracking-widest px-3 py-1 rounded-bl-xl font-mono">
                    👑 GRAN REINA VIGENTE
                  </div>

                  {legendModel ? (
                    <>
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                        <img 
                          src={legendModel.avatar} 
                          alt={legendModel.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 text-center md:text-left space-y-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-1.5">
                          <h3 className="text-lg font-serif font-black text-rose-950">
                            {legendModel.name}
                          </h3>
                          <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-block max-w-max mx-auto md:mx-0">
                            38 días en el puesto #1
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Consistencia excepcional, acumulando un récord global de votos simultáneos de inversores y con la mayor tasa de patrocinio de toda la plataforma.
                        </p>
                      </div>
                      <div className="text-center shrink-0 min-w-[120px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-mono">VOTOS MÁXIMOS</span>
                        <span className="text-lg font-bold font-mono text-pink-600">{(legendModel.totalLikes || 14926).toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-slate-400 px-3">{legendModel?.name || 'Adriana Lima'} - Estrella Suprema de Alta Costura</p>
                  )}
                </div>

                {/* Legend 2 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-5 relative hover:shadow-sm transition-all">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80" 
                      alt="Alessandra Ambrosio" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-1.5">
                      <h3 className="text-lg font-serif font-black text-slate-800">
                        Alessandra Ambrosio
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-pink-600 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full inline-block max-w-max mx-auto md:mx-0">
                        Precursora Runway Oro
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Reconocida internacionalmente por la calidad de las interacciones en sus fotos de alta costura y videos vanguardistas.
                    </p>
                  </div>
                  <div className="text-center shrink-0 min-w-[120px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-mono">VOTOS REGISTRADOS</span>
                    <span className="text-lg font-bold font-mono text-pink-600">14.717</span>
                  </div>
                </div>

                {/* Legend 3 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-5 relative hover:shadow-sm transition-all">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80" 
                      alt="Candice Swanepoel" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-1.5">
                      <h3 className="text-lg font-serif font-black text-slate-800">
                        Candice Swanepoel
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full inline-block max-w-max mx-auto md:mx-0">
                        Favorita del Público
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Inspirada por el mecenazgo estético, Candice Swanepoel ha sido coronada consecutivamente como "Runway Queen" de la sección Casting Live.
                    </p>
                  </div>
                  <div className="text-center shrink-0 min-w-[120px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-mono">VOTOS REGISTRADOS</span>
                    <span className="text-lg font-bold font-mono text-pink-600">14.415</span>
                  </div>
                </div>

              </div>

              {/* Slogan details */}
              <div className="text-center pt-2">
                <button
                  onClick={() => setActiveTab('ranking')}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-3 rounded-full shadow transition-all duration-300"
                >
                  <span>Volver al Ranking Activo</span>
                </button>
              </div>

            </div>
          )}

          {/* Slogan details line */}
          <div className="text-center text-[10px] text-slate-400 font-mono tracking-[0.3em] pt-4 border-t border-pink-100/30 flex items-center justify-center gap-1.5">
            <span>UN SUEÑO. UNA PASARELA. ERES TÚ.</span>
            <span>💖</span>
            <span className="font-bold text-pink-600 uppercase">FASHIONS FINANCE</span>
          </div>

        </div>

        {/* Footer lockup bar */}
        <div className="bg-white/95 p-4 text-center border-t border-pink-100/50 text-[10px] tracking-wider text-slate-400 uppercase font-mono z-10 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="font-bold text-pink-600">💖 Promocionado oficialmente por Fashion Finances Runway S.A.</span>
          <span>Actualizado hace unos instantes</span>
        </div>

      </div>
    </div>
  );
}
