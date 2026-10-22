import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Hash, TrendingUp, Users, Video, Eye, Heart, Share2, 
  Sparkles, CheckCircle2, Bookmark, BarChart3, Globe2, Play, 
  Award, Search, ChevronRight, ChevronLeft, ChevronDown, Check, X, Clock, Layers, Flame, ArrowUpRight
} from 'lucide-react';
import { ModelProfile, ProjectData, UserSessionProfile } from '../types';
import { 
  getHashtag, getHashtagMetrics, getHashtagTrend, 
  getHashtagVideos, getRelatedCreators, getRelatedProjects, 
  isUserFollowingHashtag, toggleFollowHashtag, getAllHashtags, 
  normalizeTag, AVAILABLE_MARKET_COUNTRIES, getCountryFlag 
} from '../utils/hashtagService';

interface HashtagDetailPageProps {
  hashtag: string;
  onBack: () => void;
  onSelectHashtag: (tag: string) => void;
  onGoToModelProfile?: (modelId: string) => void;
  onGoToProject?: (projectId: string) => void;
  allVideos?: any[];
  models?: ModelProfile[];
  projects?: ProjectData[];
  currentUser?: UserSessionProfile;
}

export default function HashtagDetailPage({
  hashtag,
  onBack,
  onSelectHashtag,
  onGoToModelProfile,
  onGoToProject,
  allVideos = [],
  models = [],
  projects = [],
  currentUser
}: HashtagDetailPageProps) {
  const normTag = normalizeTag(hashtag);
  const hashtagInfo = useMemo(() => getHashtag(normTag), [normTag]);
  
  // Tabs internas de la página de hashtag
  const [activeTab, setActiveTab] = useState<'videos' | 'creators' | 'trends' | 'projects'>('videos');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('Todas');
  const [showCountrySearch, setShowCountrySearch] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const countrySearchRef = useRef<HTMLDivElement>(null);
  const [searchHashtagQuery, setSearchHashtagQuery] = useState('');
  
  // Estado para reproducir vídeo seleccionado
  const [playingVideo, setPlayingVideo] = useState<any | null>(null);

  // User follow state
  const userId = currentUser?.id || 'anonymous';
  const [isFollowing, setIsFollowing] = useState<boolean>(() => isUserFollowingHashtag(userId, normTag));

  // Datos calculados
  const metrics = useMemo(() => getHashtagMetrics(normTag, allVideos), [normTag, allVideos]);
  const trend = useMemo(() => getHashtagTrend(normTag, selectedPeriod), [normTag, selectedPeriod]);
  const videos = useMemo(() => getHashtagVideos(normTag, allVideos), [normTag, allVideos]);
  const creators = useMemo(() => getRelatedCreators(normTag, allVideos, models), [normTag, allVideos, models]);
  const relatedProjects = useMemo(() => getRelatedProjects(normTag, projects), [normTag, projects]);
  const allAvailableHashtags = useMemo(() => getAllHashtags(), []);

  // Slider de tendencias con flechas interactivas
  const trendingSliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollTrending = () => {
    if (trendingSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trendingSliderRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
  };

  useEffect(() => {
    checkScrollTrending();
    const el = trendingSliderRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollTrending);
      window.addEventListener('resize', checkScrollTrending);
      return () => {
        el.removeEventListener('scroll', checkScrollTrending);
        window.removeEventListener('resize', checkScrollTrending);
      };
    }
  }, [allAvailableHashtags]);

  const scrollTrending = (direction: 'left' | 'right') => {
    if (trendingSliderRef.current) {
      const scrollAmount = 240;
      trendingSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollTrending, 350);
    }
  };

  // Filtrado de otros hashtags en el buscador
  const filteredHashtags = useMemo(() => {
    if (!searchHashtagQuery.trim()) return allAvailableHashtags.filter(h => h.tag !== normTag).slice(0, 8);
    const q = searchHashtagQuery.toLowerCase().replace('#', '');
    return allAvailableHashtags.filter(h => h.tag.includes(q) || h.theme.toLowerCase().includes(q));
  }, [searchHashtagQuery, allAvailableHashtags, normTag]);

  // Cerrar popover de países al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countrySearchRef.current && !countrySearchRef.current.contains(e.target as Node)) {
        setShowCountrySearch(false);
      }
    };
    if (showCountrySearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCountrySearch]);

  // Lista filtrada de países según la búsqueda
  const filteredCountries = useMemo(() => {
    const q = countrySearchQuery.trim().toLowerCase();
    if (!q) return AVAILABLE_MARKET_COUNTRIES;
    return AVAILABLE_MARKET_COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q)
    );
  }, [countrySearchQuery]);

  // Filtrado y carga dinámica de vídeos según el mercado seleccionado
  const displayVideos = useMemo(() => {
    return getHashtagVideos(normTag, allVideos, selectedRegionFilter);
  }, [normTag, allVideos, selectedRegionFilter]);

  const handleToggleFollow = () => {
    const nextState = toggleFollowHashtag(userId, normTag);
    setIsFollowing(nextState);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFBF7] text-slate-900 pb-20 animate-fade-in" id="hashtag-hub-page">
      {/* 🧭 TOP BAR NAVIGATION & QUICK SEARCH */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 sm:py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          {/* 🔙 Flecha de volver arriba del todo (solicitado sobre z.png) */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold active:scale-95 shadow-2xs"
              id="btn-back-from-hashtag"
              title="Volver atrás"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold">Volver</span>
            </button>
            <span className="text-[10.5px] font-mono text-slate-400 font-semibold hidden sm:inline">
              Hub / Explorador de Temas por #Hashtag
            </span>
          </div>

          {/* Fila principal con #Hashtag, icono, estado, buscador y Seguir */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">{hashtagInfo.icon || '🏷️'}</span>
              <div>
                <h1 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1 tracking-tight">
                  <span className="text-[#fe2c55] font-mono">{hashtagInfo.displayName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-extrabold uppercase border border-rose-200/60 ml-1">
                    {hashtagInfo.status === 'trending' ? 'Tendencia 🔥' : hashtagInfo.status === 'rising' ? 'En Auge ⚡' : 'Activo'}
                  </span>
                </h1>
                <p className="text-[11px] text-slate-500 font-medium hidden xs:block truncate max-w-[260px] sm:max-w-md">
                  {hashtagInfo.theme}
                </p>
              </div>
            </div>

            {/* Quick Hashtag Switcher */}
            <div className="flex items-center gap-2">
              <div className="relative hidden md:block w-48 lg:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchHashtagQuery}
                  onChange={(e) => setSearchHashtagQuery(e.target.value)}
                  placeholder="Buscar otro #hashtag..."
                  className="w-full bg-slate-100 border border-slate-200/80 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#fe2c55] focus:bg-white transition"
                />
              </div>
              
              <button
                type="button"
                onClick={handleToggleFollow}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95 ${
                  isFollowing 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'bg-gradient-to-r from-rose-500 to-[#fe2c55] text-white hover:opacity-90'
                }`}
                id="btn-follow-hashtag"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isFollowing ? 'fill-current' : ''}`} />
                <span>{isFollowing ? 'Siguiendo' : 'Seguir #Tema'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Results Dropdown if open */}
        {searchHashtagQuery.trim() !== '' && (
          <div className="max-w-7xl mx-auto mt-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-wrap gap-2 z-50">
            {filteredHashtags.map(h => (
              <button
                key={h.id}
                type="button"
                onClick={() => {
                  onSelectHashtag(h.tag);
                  setSearchHashtagQuery('');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 hover:bg-rose-50 text-slate-800 hover:text-rose-600 border border-slate-200/70 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>{h.icon || '🏷️'}</span>
                <span className="font-mono text-[#fe2c55]">{h.displayName}</span>
                <span className="text-[10px] text-slate-400 font-normal">({h.category})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-4">
        
        {/* 🏷️ CONTENEDORES DE METADATOS: Arriba por fuera del contenedor de la imagen */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-900 text-white font-mono text-[11px] font-black tracking-wider uppercase border border-slate-800 shadow-2xs">
            {hashtagInfo.category}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 font-mono text-[10.5px] font-bold flex items-center gap-1.5 border border-rose-200/80 shadow-2xs">
            <Globe2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Región: {hashtagInfo.region}</span>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10.5px] font-bold flex items-center gap-1.5 border border-emerald-200/80 shadow-2xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>+{trend.growthPercentage}% popularidad</span>
          </span>
        </div>

        {/* 🌟 HERO BANNER & THEME IDENTIFIER */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-100 text-white min-h-[220px] sm:min-h-[260px] flex flex-col justify-end p-5 sm:p-7">
          <img
            src={hashtagInfo.bannerImage}
            alt={hashtagInfo.displayName}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-100 scale-100 transition duration-700 hover:scale-105"
          />
          {/* Luminous soft gradient overlay: clear on right, subtle readable wash on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 space-y-2.5 max-w-3xl">
            <div>
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-sans tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {hashtagInfo.displayName}
                </h1>
                <span className="text-xs sm:text-sm text-rose-300 font-serif italic drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                  {hashtagInfo.theme}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed max-w-2xl mt-1.5 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                {hashtagInfo.description}
              </p>
            </div>

            {/* Quick metrics badges on banner */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-xs font-semibold text-slate-100">
              <span className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-sm">
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <strong className="text-white font-mono">{formatNumber(metrics.totalPosts)}</strong> publicaciones
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-sm">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <strong className="text-white font-mono">{formatNumber(metrics.totalViews)}</strong> reproducciones
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-sm">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                <strong className="text-white font-mono">{formatNumber(metrics.totalLikes)}</strong> likes
              </span>
              <span className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <strong className="text-white font-mono">{metrics.engagementRate}%</strong> engagement
              </span>
            </div>
          </div>
        </div>

        {/* 📊 4 SUMMARY STATS CARDS: Medición de Contenido y Rendimiento */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Número de Publicaciones</span>
              <Video className="w-4 h-4 text-rose-500" />
            </div>
            <strong className="text-xl sm:text-2xl font-black text-slate-900 font-mono block">
              {formatNumber(metrics.totalPosts)}
            </strong>
            <p className="text-[10.5px] text-slate-500 font-medium">
              Contenido activo con etiqueta <span className="font-mono text-rose-600 font-bold">{hashtagInfo.displayName}</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Visualizaciones Totales</span>
              <Eye className="w-4 h-4 text-cyan-500" />
            </div>
            <strong className="text-xl sm:text-2xl font-black text-slate-900 font-mono block">
              {formatNumber(metrics.totalViews)}
            </strong>
            <div className="flex items-center gap-1 text-[10.5px] text-emerald-600 font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>+{trend.growthPercentage}% vs. semana anterior</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Interacción & Likes</span>
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500/20" />
            </div>
            <strong className="text-xl sm:text-2xl font-black text-slate-900 font-mono block">
              {formatNumber(metrics.totalLikes)}
            </strong>
            <p className="text-[10.5px] text-slate-500 font-medium">
              Tasa de respuesta: <span className="text-pink-600 font-bold">{metrics.engagementRate}%</span>
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] uppercase font-bold tracking-wider">Retención & Visualización</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <strong className="text-xl sm:text-2xl font-black text-slate-900 font-mono block">
              {metrics.averageWatchTimeSec}s
            </strong>
            <p className="text-[10.5px] text-slate-500 font-medium">
              Tiempo promedio de reproducción sostenido
            </p>
          </div>
        </div>

        {/* 🏷️ SLIDER DE TENDENCIAS: Con flechas interactivas de desplazamiento */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200/80 shadow-2xs flex items-center gap-2 relative">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 shrink-0 pl-1 select-none">
            <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Tendencias:</span>
          </span>

          {/* Botón Flecha Izquierda */}
          <button
            type="button"
            onClick={() => scrollTrending('left')}
            disabled={!canScrollLeft}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 border cursor-pointer ${
              canScrollLeft
                ? 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200 hover:border-rose-300 shadow-2xs active:scale-90'
                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-35'
            }`}
            title="Desplazar tendencias a la izquierda"
            aria-label="Tendencias anteriores"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Carrusel Desplazable de Tendencias */}
          <div 
            ref={trendingSliderRef}
            className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none scroll-smooth min-w-0 py-0.5 select-none"
          >
            {allAvailableHashtags.map(h => (
              <button
                key={h.id}
                type="button"
                onClick={() => onSelectHashtag(h.tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  h.tag === normTag
                    ? 'bg-slate-900 text-white shadow-xs font-black ring-2 ring-slate-800'
                    : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-transparent hover:border-rose-100'
                }`}
              >
                <span>{h.icon || '🏷️'}</span>
                <span className="font-mono">{h.displayName}</span>
              </button>
            ))}
          </div>

          {/* Botón Flecha Derecha */}
          <button
            type="button"
            onClick={() => scrollTrending('right')}
            disabled={!canScrollRight}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 border cursor-pointer ${
              canScrollRight
                ? 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-200 hover:border-rose-300 shadow-2xs active:scale-90'
                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-35'
            }`}
            title="Desplazar tendencias a la derecha"
            aria-label="Siguientes tendencias"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* 🧭 NAVIGATION TABS BETWEEN MODULES */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            {[
              { id: 'videos', label: 'Vídeos Relacionados', icon: Video, count: displayVideos.length },
              { id: 'creators', label: 'Modelos & Creadores', icon: Users, count: creators.length },
              { id: 'trends', label: 'Evolución & Tendencias', icon: TrendingUp },
              { id: 'projects', label: 'Proyectos & Rondas', icon: Layers, count: relatedProjects.length }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  id={`tab-hashtag-${tab.id}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {typeof tab.count === 'number' && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Regional Selector Filter with Search */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10.5px] font-bold text-slate-400 uppercase hidden sm:inline">Mercado:</span>
            
            {/* Quick country pills matching image_d0ecc717.png */}
            {['Todas', 'España', 'México', 'Francia', 'Global'].map(reg => (
              <button
                key={reg}
                type="button"
                onClick={() => {
                  setSelectedRegionFilter(reg);
                  setActiveTab('videos');
                  setShowCountrySearch(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition cursor-pointer flex items-center gap-1 ${
                  selectedRegionFilter === reg
                    ? 'bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs font-black'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{getCountryFlag(reg)}</span>
                <span>{reg}</span>
              </button>
            ))}

            {/* Custom selected country chip (if user picked a country outside the default 5) */}
            {!['Todas', 'España', 'México', 'Francia', 'Global'].includes(selectedRegionFilter) && (
              <div className="flex items-center gap-1 bg-rose-600 text-white px-2.5 py-1 rounded-lg text-[10.5px] font-bold shadow-xs">
                <span>{getCountryFlag(selectedRegionFilter)}</span>
                <span>{selectedRegionFilter}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRegionFilter('Todas');
                    setActiveTab('videos');
                  }}
                  className="hover:bg-rose-700 p-0.5 rounded-full transition cursor-pointer ml-0.5"
                  title="Quitar filtro de país y volver a Todas"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            )}

            {/* 🔍 Buscador de Otros Países (solicitado sobre captura image.png) */}
            <div className="relative" ref={countrySearchRef}>
              <button
                type="button"
                onClick={() => setShowCountrySearch(prev => !prev)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition cursor-pointer border ${
                  showCountrySearch || !['Todas', 'España', 'México', 'Francia', 'Global'].includes(selectedRegionFilter)
                    ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-2xs font-extrabold'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="Buscar otros países y mercados globales"
                id="btn-search-country-filter"
              >
                <Search className="w-3 h-3 text-rose-500 shrink-0" />
                <span className="hidden xs:inline">Buscar país...</span>
                <span className="xs:hidden">País</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showCountrySearch ? 'rotate-180 text-rose-600' : 'text-slate-400'}`} />
              </button>

              {/* Popover con Buscador interactivo de Países */}
              {showCountrySearch && (
                <div className="absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-2.5 text-left animate-fade-in ring-1 ring-black/5">
                  <div className="flex items-center justify-between pb-1.5 mb-1 px-1 border-b border-slate-100">
                    <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Mercados & Países</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCountrySearch(false)}
                      className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Campo de búsqueda con icono */}
                  <div className="relative flex items-center bg-slate-50 rounded-xl px-2.5 py-2 border border-slate-200 focus-within:border-rose-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-100 transition mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
                    <input
                      type="text"
                      autoFocus
                      value={countrySearchQuery}
                      onChange={(e) => setCountrySearchQuery(e.target.value)}
                      placeholder="Escribe el nombre o código del país..."
                      className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
                    />
                    {countrySearchQuery && (
                      <button
                        type="button"
                        onClick={() => setCountrySearchQuery('')}
                        className="text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Lista de Países disponibles para filtrar */}
                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 pr-0.5 space-y-0.5 no-scrollbar scrollbar-none">
                    {/* Opción Todas / Global */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRegionFilter('Todas');
                        setActiveTab('videos');
                        setShowCountrySearch(false);
                        setCountrySearchQuery('');
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 text-xs text-slate-800 transition cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">🌍</span>
                        <span className="font-bold">Todas las regiones (Global)</span>
                      </span>
                      {selectedRegionFilter === 'Todas' && <Check className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />}
                    </button>

                    {filteredCountries.map(c => {
                      const isSelected = selectedRegionFilter === c.name;
                      return (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => {
                            setSelectedRegionFilter(c.name);
                            setActiveTab('videos');
                            setShowCountrySearch(false);
                            setCountrySearchQuery('');
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer text-left ${
                            isSelected
                              ? 'bg-rose-50 text-rose-700 font-extrabold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base">{c.flag}</span>
                            <span className="font-semibold">{c.name}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono text-slate-400 uppercase bg-slate-100 px-1.5 py-0.5 rounded-md font-bold">
                              {c.region}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />}
                          </span>
                        </button>
                      );
                    })}

                    {filteredCountries.length === 0 && (
                      <div className="p-4 text-center text-xs text-slate-400 italic">
                        No se encontró ningún país con "{countrySearchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 📹 TAB 1: VÍDEOS RELACIONADOS (Ranked by Multi-factor recommendation algorithm) */}
        {activeTab === 'videos' && (
          <div className="space-y-4">
            <div className="bg-rose-50/70 border border-rose-200/70 p-3 rounded-2xl flex items-center justify-between text-xs text-rose-950">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  <strong>Mercado {selectedRegionFilter === 'Todas' ? 'Global' : selectedRegionFilter} {getCountryFlag(selectedRegionFilter)}:</strong> Vídeos destacados ordenados por visualización, retención e impacto bajo #{hashtagInfo.tag}.
                </span>
              </span>
              <span className="text-[10px] font-mono text-rose-700 font-bold shrink-0 hidden sm:inline">
                {displayVideos.length} vídeos activos
              </span>
            </div>

            {displayVideos.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 space-y-2">
                <Video className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-black text-slate-800 text-sm">Aún no hay vídeos con #{hashtagInfo.tag} en este mercado</h3>
                <p className="text-xs text-slate-400">Selecciona otro país o mercado arriba para explorar más contenido.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayVideos.map((video, idx) => (
                  <div
                    key={video.id || `${selectedRegionFilter}-${idx}`}
                    onClick={() => setPlayingVideo(video)}
                    className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col relative aspect-[9/16] animate-fade-in"
                  >
                    <video
                      src={video.videoUrl}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      muted
                      loop
                      playsInline
                      onMouseEnter={(e) => {
                        const target = e.currentTarget;
                        target.play().catch(() => {});
                      }}
                      onMouseLeave={(e) => {
                        const target = e.currentTarget;
                        target.pause();
                        target.currentTime = 0;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                    {/* Top overlay badge: Rank + Market Location Flag + Category */}
                    <div className="relative z-10 p-3 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-white/20">
                          Top #{idx + 1}
                        </span>
                        <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-white/20 flex items-center gap-1 shadow-xs">
                          <span>{video.countryFlag || getCountryFlag(video.region || selectedRegionFilter)}</span>
                          <span className="max-w-[80px] truncate">{video.locationName || video.region || selectedRegionFilter}</span>
                        </span>
                      </div>
                      <span className="bg-rose-500/90 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0">
                        {video.videoCategory || 'Fashion'}
                      </span>
                    </div>

                    {/* Play button hover indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md border border-white/60 flex items-center justify-center text-white shadow-xl scale-90 group-hover:scale-100 transition-all">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom overlay: Author, description & stats */}
                    <div className="relative z-10 mt-auto p-3.5 space-y-1.5 text-left text-white">
                      <div className="flex items-center gap-2">
                        <img
                          src={video.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                          alt={video.username}
                          className="w-6 h-6 rounded-full object-cover border border-white/60"
                        />
                        <span className="text-xs font-black truncate drop-shadow-sm">
                          @{video.username || 'creador'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-200 line-clamp-2 leading-snug drop-shadow-sm">
                        {video.description || video.title}
                      </p>

                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-300 font-mono">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-400 fill-rose-400/30" />
                          <span>{formatNumber(video.likes || 120)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-cyan-400" />
                          <span>{formatNumber((video.likes || 120) * 14)}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-3 h-3 text-slate-300" />
                          <span>{video.shares || 8}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 👥 TAB 2: MODELOS & CREADORES RELACIONADOS */}
        {activeTab === 'creators' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Perfiles Participantes</h3>
                <p className="text-xs text-slate-500">Cuentas que crean y lideran el contenido bajo #{hashtagInfo.tag}.</p>
              </div>
              <span className="text-xs text-slate-400 font-mono font-bold">{creators.length} perfiles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {creators.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <h4 className="font-extrabold text-slate-900 text-sm truncate">{c.name}</h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 fill-cyan-500/10 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-400 font-mono truncate">@{c.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9.5px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold font-mono">
                          {c.postCountWithTag || 3} vídeos con #{hashtagInfo.tag}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {c.bio || `Modelo profesional activa en pasarelas y campañas de #{hashtagInfo.tag}.`}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-mono text-slate-500">
                      <strong className="text-slate-900">{formatNumber(c.followersCount || 12000)}</strong> seguidores
                    </div>
                    {onGoToModelProfile && (
                      <button
                        type="button"
                        onClick={() => onGoToModelProfile(c.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <span>Ver Perfil</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 📈 TAB 3: EVOLUCIÓN & TENDENCIAS TEMPORALES */}
        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-rose-500" />
                    <span>Evolución Temporal de Popularidad: #{hashtagInfo.tag}</span>
                  </h3>
                  <p className="text-xs text-slate-500">Métricas históricas de reproducciones y publicaciones según periodo.</p>
                </div>

                {/* Period Selector */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                  {(['7d', '30d', '90d'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedPeriod(p)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        selectedPeriod === p ? 'bg-white text-slate-900 shadow-xs font-black' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {p === '7d' ? '7 Días' : p === '30d' ? '30 Días' : '90 Días'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Trend Bars Chart */}
              <div className="space-y-2 pt-2">
                <div className="h-44 sm:h-52 flex items-end gap-1.5 sm:gap-3 pt-6 pb-2 border-b border-slate-100">
                  {trend.history.map((pt, i) => {
                    const maxViews = Math.max(...trend.history.map(h => h.views)) || 1;
                    const heightPercent = Math.max(15, Math.round((pt.views / maxViews) * 100));
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                        {/* Tooltip on hover */}
                        <div className="absolute -top-12 bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-20">
                          {formatNumber(pt.views)} views · {pt.posts} posts
                        </div>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full rounded-t-lg bg-gradient-to-t from-rose-600 to-pink-400 group-hover:from-rose-500 group-hover:to-pink-300 transition-all duration-200 shadow-xs"
                        />
                        <span className="text-[8.5px] sm:text-[9.5px] text-slate-400 font-mono truncate w-full text-center">
                          {pt.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Regional Market Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-2.5">
                  <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Distribución Geográfica de Tendencia</span>
                  </h4>
                  <div className="space-y-2 text-xs">
                    {Object.entries(trend.regionalDistribution).map(([reg, pct]) => (
                      <div key={reg} className="space-y-1">
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-700 flex items-center gap-1.5">
                            <span>{getCountryFlag(reg)}</span>
                            <span>{reg}</span>
                          </span>
                          <span className="font-mono font-bold text-slate-900">{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className="bg-rose-500 h-full rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Evaluación de Competitividad & Ranking</span>
                  </h4>
                  <div className="space-y-2 text-xs text-slate-600">
                    <p>
                      <strong>Puntuación de Tendencia:</strong>{' '}
                      <span className="text-rose-600 font-mono font-black text-sm">{trend.trendScore}/100</span>
                    </p>
                    <p>
                      <strong>Clasificación en Fashion Finances:</strong>{' '}
                      <span className="text-slate-900 font-bold">Top #{trend.rank} más interactuado</span>
                    </p>
                    <p>
                      <strong>Comportamiento del Público:</strong> Alto ratio de guardados en perfiles y participación en rondas de inversión directa asociadas al hashtag.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📦 TAB 4: PROYECTOS & RONDAS DE FINANCIACIÓN ASOCIADAS */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Rondas de Inversión y Proyectos</h3>
                <p className="text-xs text-slate-500">Iniciativas de moda y pasarelas colectivas vinculadas a #{hashtagInfo.tag}.</p>
              </div>
              <span className="text-xs text-slate-400 font-mono font-bold">{relatedProjects.length} proyectos</span>
            </div>

            {relatedProjects.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 space-y-2">
                <Layers className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-black text-slate-800 text-sm">No hay proyectos activos vinculados en este momento</h3>
                <p className="text-xs text-slate-400">Puedes registrar un proyecto en la plataforma y asociarle #{hashtagInfo.tag}.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedProjects.map(proj => (
                  <div
                    key={proj.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 uppercase">
                          {proj.category || 'Moda'}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-600 font-bold">
                          {proj.currentAmount?.toFixed(2)}€ recaudados
                        </span>
                      </div>
                      <h4 className="font-black text-slate-900 text-base">{proj.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{proj.description}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(100, ((proj.currentAmount || 0) / (proj.targetAmount || 1)) * 100)}%` }}
                          className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-mono">Meta: {proj.targetAmount?.toFixed(2)}€</span>
                        {onGoToProject && (
                          <button
                            type="button"
                            onClick={() => onGoToProject(proj.id)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Ver Ronda</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* 🎬 MODAL DE REPRODUCCIÓN INTERACTIVA DE VÍDEO */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col justify-between">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setPlayingVideo(null)}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <video
              src={playingVideo.videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              controls
              autoPlay
              playsInline
            />

            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none z-20 text-white space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-black text-sm text-white">@{playingVideo.username}</h4>
                {(playingVideo.countryFlag || playingVideo.locationName || playingVideo.region) && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-md">
                    {playingVideo.countryFlag || getCountryFlag(playingVideo.region)} {playingVideo.locationName || playingVideo.region}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-200 line-clamp-2">{playingVideo.description || playingVideo.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
