import React, { useRef, useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Coins, 
  Users, 
  ArrowRight, 
  ArrowUp,
  ShieldCheck, 
  Award, 
  Zap, 
  ChevronRight, 
  UserPlus2,
  Eye,
  Camera,
  Layers,
  Heart,
  Instagram,
  User
} from 'lucide-react';
import { ModelProfile } from '../types';
import FashionRankingSlider from './FashionRankingSlider';
import HeroPresentationVideo from './HeroPresentationVideo';
import LanguageTranslatorDropdown from './LanguageTranslatorDropdown';
import heroGlamourWhiteEn from '../assets/images/hero_glamour_white_en_1794573754880.jpg';
import ctaCrownOrnament from '../assets/images/cta_crown_isolated_1794577537132.jpg';
import ctaDiamondOrnament from '../assets/images/cta_diamond_isolated_1794577536243.jpg';
import {
  SupportedLanguage,
  LANGUAGE_CHANGE_EVENT,
  getStoredLanguage,
} from '../utils/pageTranslator';

interface LandingPageProps {
  models: ModelProfile[];
  topFemales: ModelProfile[];
  topMales: ModelProfile[];
  onSwitchPersona: (role: 'investor' | 'model' | 'visitor') => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onModelClick?: (model: ModelProfile) => void;
}

export default function LandingPage({
  models,
  topFemales,
  topMales,
  onSwitchPersona,
  onLoginClick,
  onRegisterClick,
  onModelClick
}: LandingPageProps) {
  const topRef = useRef<HTMLDivElement>(null);
  const rankingRef = useRef<HTMLDivElement>(null);
  const simulaRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [appLanguage, setAppLanguage] = useState<SupportedLanguage>(() => getStoredLanguage());

  const [coverVideoUrl, setCoverVideoUrl] = useState<string>(() => {
    return localStorage.getItem('landing_page_cover_video_url') || '';
  });

  useEffect(() => {
    const handleLangSync = (e: Event) => {
      const next = (e as CustomEvent<{ lang?: SupportedLanguage }>).detail?.lang;
      if (next) setAppLanguage(next);
      else setAppLanguage(getStoredLanguage());
    };
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleLangSync);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleLangSync);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setCoverVideoUrl(localStorage.getItem('landing_page_cover_video_url') || '');
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (scrollY > 150) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Also attach to document/root in case of inner container scrolling
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rootElement) {
        rootElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Take top 4 models from the system for the Fashion Ranking Preview
  const topModels = [...models].slice(0, 4);

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={topRef} id="landing-page-root" className="min-h-screen bg-white font-sans text-slate-900 flex flex-col antialiased selection:bg-indigo-500 selection:text-white w-full relative">
      {/* Editorial Header matching Moda, Finanzas y Glamour Rosa.png */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 py-3 px-3 sm:px-6 sticky top-0 z-50 transition-all duration-300 shadow-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div 
            onClick={scrollToTop}
            title="Ir arriba / Inicio"
            className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group select-none hover:opacity-90 transition shrink-0"
          >
            {/* Geometric Pink Diamond Brand Mark */}
            <svg viewBox="0 0 48 42" className="w-8 h-7 sm:w-10 sm:h-9 shrink-0 group-hover:scale-105 transition-transform drop-shadow-2xs" fill="none" aria-hidden="true">
              <polygon points="10,4 38,4 45,15 24,39 3,15" stroke="#E6007A" strokeWidth="2.4" fill="#FFF0F7" />
              <polyline points="3,15 45,15" stroke="#E6007A" strokeWidth="1.8" />
              <polyline points="10,4 16,15 24,39 32,15 38,4" stroke="#E6007A" strokeWidth="1.6" />
              <polyline points="16,15 24,4 32,15" stroke="#F472B6" strokeWidth="1.5" />
            </svg>
            <span className="h-7 w-px bg-slate-300 hidden xs:block" />
            <div className="leading-none">
              <h1 className="font-display font-bold text-base sm:text-xl tracking-wide uppercase flex items-center gap-1.5">
                <span className="text-slate-950">FASHION</span>
                <span className="text-[#E6007A]">FINANCES</span>
              </h1>
              <p className="text-[7.5px] sm:text-[9px] text-slate-600 tracking-[0.26em] uppercase font-sans font-medium mt-1 hidden sm:block">
                FASHION • FINANCE • INFLUENCE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <LanguageTranslatorDropdown compact />
            <button
              type="button"
              onClick={() => scrollToSection(simulaRef)}
              className="custom-bg rounded-full bg-white hover:bg-pink-50/70 border border-pink-400/90 hover:border-pink-600 text-slate-900 font-semibold text-[11px] sm:text-xs px-2.5 sm:px-4 py-1.5 sm:py-2 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E6007A] hidden sm:block" />
              <span>Simulador</span>
            </button>
            <button
              type="button"
              onClick={onLoginClick}
              className="custom-bg rounded-full bg-white hover:bg-pink-50/70 border border-pink-400/90 hover:border-pink-600 text-slate-900 font-semibold text-[11px] sm:text-xs px-2.5 sm:px-4 py-1.5 sm:py-2 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
            >
              <User className="w-3.5 h-3.5 text-[#E6007A]" />
              <span className="hidden sm:inline">Iniciar Sesión</span>
            </button>
            <button
              type="button"
              onClick={onRegisterClick}
              className="custom-bg rounded-full bg-gradient-to-r from-[#d9006c] via-[#e6007a] to-[#ff2d85] hover:brightness-105 text-white font-bold text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 border border-pink-500 shadow-md shadow-pink-500/25 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
            >
              <UserPlus2 className="w-3.5 h-3.5 text-white" />
              <span>Registrarse</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section featuring Moda, Finanzas y Glamour Rosa visual showcase */}
      <section className="relative overflow-hidden bg-white pb-16 lg:pb-24">
        {coverVideoUrl && (
          <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden select-none pointer-events-none">
            <video 
              src={coverVideoUrl || undefined} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-white/90" />
          </div>
        )}

        {/* Seamless Borderless Hero Artwork blended into white background */}
        <div className="w-full bg-white pt-4 sm:pt-6 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto relative w-full overflow-hidden bg-white">
            <img
              src={heroGlamourWhiteEn}
              alt="We are a community of models united to sponsor elite companies, investors, and entrepreneurs."
              referrerPolicy="no-referrer"
              className="w-full h-auto block select-none pointer-events-none"
              draggable={false}
            />

            {/* Soft white edge feathers so the artwork melts cleanly into the white page without any frame */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-14 bg-gradient-to-r from-white via-white/35 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-14 bg-gradient-to-l from-white via-white/35 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-5 sm:h-8 bg-gradient-to-b from-white via-white/30 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 sm:h-10 bg-gradient-to-t from-white via-white/40 to-transparent" />

            {/* Translated editorial headline overlay only when user switches to FR / DE */}
            {(appLanguage === 'fr' || appLanguage === 'de') && (
              <div
                data-no-translate="true"
                className="absolute left-[26%] right-[26%] top-[23%] bottom-[26%] bg-white/95 rounded-full flex items-center justify-center px-3 sm:px-6 text-center"
              >
                <h2 className="font-serif font-medium text-slate-950 text-[11px] xs:text-sm sm:text-xl md:text-2xl lg:text-[28px] leading-[1.2] tracking-tight">
                  {appLanguage === 'fr' && (
                    <>
                      Nous sommes une communauté de <span className="text-[#E6007A] font-bold">mannequins</span> unies pour sponsoriser les{' '}
                      <span className="text-[#E6007A] font-bold">entreprises</span>,{' '}
                      <span className="text-[#E6007A] font-bold">investisseurs</span> et{' '}
                      <span className="text-[#E6007A] font-bold">entrepreneurs</span> d’élite.
                    </>
                  )}
                  {appLanguage === 'de' && (
                    <>
                      Wir sind eine Community von <span className="text-[#E6007A] font-bold">Models</span>, die vereint Elite-
                      <span className="text-[#E6007A] font-bold">Unternehmen</span>,{' '}
                      <span className="text-[#E6007A] font-bold">Investoren</span> und{' '}
                      <span className="text-[#E6007A] font-bold">Gründer</span> sponsert.
                    </>
                  )}
                </h2>
              </div>
            )}
          </div>
        </div>

        {/* Background decorative blurry circles for lower hero block */}
        <div className="max-w-4xl mx-auto text-center space-y-8 pt-8 sm:pt-12 px-6 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-semibold uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>La Fusión Definitiva de Moda y Finanzas Colectivas</span>
          </div>

          {/* Vídeo Oficial de Presentación con generoso espacio en blanco superior */}
          <div className="pt-2 sm:pt-4">
            <HeroPresentationVideo onExploreClick={() => scrollToSection(rankingRef)} />
          </div>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-sans">
            Únete a una comunidad global de modelos e inversores, construyendo juntas un futuro más brillante. Regístrate ahora y lleva tus sueños al siguiente nivel.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 select-none">
            <button
              type="button"
              onClick={() => scrollToSection(rankingRef)}
              className="w-full sm:w-auto px-8 py-4 bg-slate-950 hover:bg-slate-850 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-slate-950/10 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group hover:-translate-y-0.5"
            >
              <span>Explora el Ranking de Moda</span>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection(simulaRef)}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-sm rounded-2xl hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Prueba el Simulador de Perfiles</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10 text-center">
            <div className="bg-white/60 border border-slate-100 p-4 rounded-2xl backdrop-blur-xs">
              <span className="block text-xl sm:text-2xl font-bold text-slate-950 font-mono">50+</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Modelos del Ranking</span>
            </div>
            <div className="bg-white/60 border border-slate-100 p-4 rounded-2xl backdrop-blur-xs">
              <span className="block text-xl sm:text-2xl font-bold text-indigo-600 font-mono">1.2k+</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Inversores Activos</span>
            </div>
            <div className="bg-white/60 border border-slate-100 p-4 rounded-2xl backdrop-blur-xs">
              <span className="block text-xl sm:text-2xl font-bold text-pink-500 font-mono">94%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-sans">Éxito en Campañas</span>
            </div>
            <div className="bg-white/60 border border-slate-100 p-4 rounded-2xl backdrop-blur-xs">
              <span className="block text-xl sm:text-2xl font-bold text-slate-950 font-mono">10,450€</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Fondo Acumulado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition / Features Section */}
      <section className="py-16 bg-white border-y border-slate-100 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-indigo-600 font-mono tracking-widest uppercase font-bold">Un Ecosistema Simbiótico</span>
            <h3 className="text-2xl sm:text-3xl font-display font-semibold text-slate-950">
              ¿Por qué Fashion Finances es diferente?
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              Unimos inversores creativos con personas influyentes del modelaje mediante contratos digitales de apadrinamiento mutuo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-100/70 p-6 rounded-2xl space-y-4 hover:shadow-sm transition">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-display font-semibold text-sm text-slate-900">1. Patrocinio Oficial</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cada inversor elige una modelo activa como su mentora/patrocinadora. El 10% de todos los premios ganados en las mesas financia estratégicamente el crecimiento de su sponsor.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100/70 p-6 rounded-2xl space-y-4 hover:shadow-sm transition">
              <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600">
                <Coins className="w-5 h-5" />
              </div>
              <h4 className="font-display font-semibold text-sm text-slate-900">2. Crowdfunding de Propuestas</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Los inversores crean proyectos innovadores sobre moda y lifestyle. Pagan un entry fee para ingresar a las mesas y, al completarse el quórum, se eligen las mejores propuestas por votación.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100/70 p-6 rounded-2xl space-y-4 hover:shadow-sm transition">
              <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-display font-semibold text-sm text-slate-900">3. Transparencia Absoluta</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sin intermediarios. Los beneficios se distribuyen automáticamente siguiendo reglas matemáticas claras: 80% al creador ganador, 10% a su sponsor de afiliación, y 10% retenido bajo el fondo del sistema.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Fashion Ranking Section with real simulated models */}
      <section ref={rankingRef} className="py-20 bg-white border-y border-slate-100 px-4 sm:px-6 scroll-mt-20 overflow-hidden relative">
        {/* Subtle decorative shadows */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -right-40 top-1/3 w-[350px] h-[350px] bg-pink-50/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-40 bottom-1/3 w-[350px] h-[350px] bg-indigo-50/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10 select-none">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              <Award className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>COLECCIÓN TOP 100 RANKING</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-serif text-slate-900 font-light tracking-tight max-w-xl mx-auto">
              Nuestras Estrellas del <span className="font-extrabold italic text-indigo-700">Ranking Oficial</span>
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed font-sans">
              Apadrina y patrocina estratégicamente a los talentos de vanguardia con mayor proyección de crecimiento en el mercado global.
            </p>
          </div>

          <div className="space-y-16">
            {/* Female Models Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-rose-100 pb-3">
                <div className="text-left">
                  <h4 className="font-serif text-2xl text-slate-900 font-medium tracking-tight flex items-center gap-2">
                    <span className="text-rose-500 font-sans text-xl">💃</span>
                    <span>Top Modelos Femeninas</span>
                  </h4>
                  <p className="text-xs text-slate-400 font-sans">Las creadoras e influencers líderes en el Top 100 con más votos</p>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-650 bg-indigo-50/80 px-3 py-1.5 rounded-xl border border-indigo-100 mt-2 sm:mt-0 max-w-fit">
                  {topFemales.length} Modelos Activas
                </span>
              </div>
              <FashionRankingSlider 
                models={topFemales}
                gender="female"
                onModelClick={(model) => onModelClick?.(model)}
              />
            </div>

            {/* Male Models Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-indigo-100 pb-3">
                <div className="text-left">
                  <h4 className="font-serif text-2xl text-slate-900 font-medium tracking-tight flex items-center gap-2">
                    <span className="text-indigo-500 font-sans text-xl">⚡</span>
                    <span>Top Modelos Masculinos</span>
                  </h4>
                  <p className="text-xs text-slate-400 font-sans">Los creadores y representantes de marca en el Top 100 con más votos</p>
                </div>
                <span className="text-xs font-mono font-bold text-pink-650 bg-pink-50/80 px-3 py-1.5 rounded-xl border border-pink-100 mt-2 sm:mt-0 max-w-fit">
                  {topMales.length} Modelos Activos
                </span>
              </div>
              <FashionRankingSlider 
                models={topMales}
                gender="male"
                onModelClick={(model) => onModelClick?.(model)}
              />
            </div>
          </div>

          <div className="bg-white/85 border border-[#F2ECE9] p-6 text-center max-w-xl mx-auto relative rounded-3xl shadow-md backdrop-blur-md">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-[8px] tracking-[0.2em] font-black uppercase rounded-lg px-3 py-1">
              Dinámica de Votación Global
            </span>
            <p className="text-xs text-slate-600 italic font-serif leading-relaxed pt-2">
              "El Quórum se recalcula constantemente. Los inversores apuestan por los proyectos innovadores. Un 10% de los beneficios ganados en cada sesión se consolida automáticamente para el modelo patrocinador. Este se repartirá a partes iguales si son varios los patrocinadores ganadores."
            </p>
          </div>
        </div>
      </section>

      {/* Simulator / Login personas Segment */}
      <section ref={simulaRef} className="py-20 bg-white border-t border-slate-100 px-6 scroll-mt-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-indigo-600 font-mono tracking-widest uppercase font-bold">Consola del Diseñador</span>
            <h3 className="text-2xl sm:text-3xl font-display font-semibold text-slate-950">
              Simulador de Roles de Usuario
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              Selecciona uno de los siguientes perfiles preparados para probar todas las capacidades del sistema en tiempo real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-5 flex flex-col justify-between hover:border-indigo-300 transition-all duration-200">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-2xl">
                  🕵️
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-slate-900">Inversor: Ernesto vs</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Simulando Inversor Temprano</p>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Accede con 100.00€ ficticios, patrocina, crea proyectos innovadores, de alta costura, y participa en mesas de crowdfunding.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSwitchPersona('investor')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition uppercase tracking-wide cursor-pointer shadow-xs shadow-indigo-500/10 active:scale-98"
              >
                Simular Inversor
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-5 flex flex-col justify-between hover:border-pink-300 transition-all duration-200">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 text-2xl">
                  💃
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-slate-900">Modelo: Adriana Lima</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Modelo Profesional en Ranking</p>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Visualiza el panel de la modelo, cobra comisiones del 10% automático de tus referidos, publica contenido y modera tu lista de fans.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSwitchPersona('model')}
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs transition uppercase tracking-wide cursor-pointer shadow-xs shadow-pink-500/10 active:scale-98"
              >
                Simular Modelo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero CTA Block: Pure white canvas with isolated ornaments and real translatable text layer */}
      <section className="bg-white py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Top Jeweled Crown with subtle gold horizontal dividers */}
          <div className="w-full max-w-[520px] flex items-center justify-center gap-3 sm:gap-5 mb-2 sm:mb-3 select-none">
            <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#c9a468]/75 to-[#b0833d]" />
            <img
              src={ctaCrownOrnament}
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="h-14 sm:h-20 w-auto object-contain mix-blend-multiply pointer-events-none shrink-0"
              draggable={false}
            />
            <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#c9a468]/75 to-[#b0833d]" />
          </div>

          {/* Separate Translatable Text Layer matching exact editorial serif + calligraphy style */}
          <h3 className="font-display font-semibold text-[#000000] text-2xl sm:text-4xl md:text-[42px] leading-[1.12] tracking-tight">
            ¿Preparado para transformar tus
          </h3>

          <div className="relative inline-flex flex-col items-center mt-0.5 sm:mt-1 mb-3 sm:mb-4">
            <span
              className="text-[#ff2d85] text-5xl sm:text-7xl md:text-[80px] leading-[0.95] font-normal px-2"
              style={{ fontFamily: "'Alex Brush', cursive" }}
            >
              aspiraciones?
            </span>
            <svg
              viewBox="0 0 360 18"
              className="w-[220px] sm:w-[330px] md:w-[380px] h-3.5 sm:h-4 -mt-1 text-[#ff2d85] pointer-events-none"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 12C88 3 230 2 354 8"
                stroke="currentColor"
                strokeWidth="4.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="font-sans text-[#000000] text-xs sm:text-sm md:text-[15px] leading-relaxed max-w-xl mx-auto font-medium">
            <span>Conviértete en parte de nuestra exclusiva comunidad y descubre un mundo de oportunidades en </span>
            <span className="font-bold text-[#ff2d85]">moda, finanzas y estilo de vida.</span>
          </p>

          {/* Lower Pink Diamond with subtle gold horizontal dividers */}
          <div className="w-full max-w-[440px] flex items-center justify-center gap-3 my-5 sm:my-6 select-none">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c9a468]/75 to-[#b0833d]" />
            <img
              src={ctaDiamondOrnament}
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain mix-blend-multiply saturate-150 pointer-events-none shrink-0"
              draggable={false}
            />
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#c9a468]/75 to-[#b0833d]" />
          </div>

          {/* Interactive Translatable CTA Pill Buttons */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1">
            <button
              type="button"
              onClick={onRegisterClick}
              className="custom-bg w-full sm:w-auto min-w-[235px] py-3 sm:py-3.5 px-6 rounded-full bg-gradient-to-r from-[#ff2d85] via-[#ff1f7a] to-[#ff4da6] hover:brightness-105 text-white font-bold text-xs uppercase tracking-wider border-2 border-[#ffb3d4] shadow-[0_6px_18px_rgba(255,45,133,0.35)] flex items-center justify-center gap-3 cursor-pointer transition-all active:scale-95"
            >
              <span className="w-5 h-5 rounded-full bg-white text-[#ff2d85] flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 fill-current" />
              </span>
              <span>Regístrate y empieza</span>
              <ChevronRight className="w-4 h-4 text-white shrink-0" />
            </button>

            <button
              type="button"
              onClick={onLoginClick}
              className="custom-bg w-full sm:w-auto min-w-[235px] py-3 sm:py-3.5 px-6 rounded-full bg-gradient-to-b from-white to-[#fff0f7] hover:from-[#fff7fb] hover:to-[#ffe4f0] text-[#ff2d85] font-bold text-xs uppercase tracking-wider border-[1.5px] border-[#ff85b8] shadow-[0_4px_14px_rgba(255,45,133,0.14)] flex items-center justify-center gap-3 cursor-pointer transition-all active:scale-95"
            >
              <Eye className="w-4 h-4 text-[#ff2d85] shrink-0" />
              <span>Ya tengo cuenta</span>
              <ChevronRight className="w-4 h-4 text-[#ff2d85] shrink-0" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-10 px-6 text-center text-[11px] text-slate-500 relative z-10">
        <p className="max-w-md mx-auto leading-relaxed">
          © 2026 Fashion Finances Platform. Licencia Pública de Distribución Tecnológica. Una incubadora creativa internacional.
        </p>
      </footer>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-slate-950/90 hover:bg-slate-900 text-white rounded-full shadow-2xl border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer group"
          title="Desplazar hacia arriba"
        >
          <ArrowUp className="w-5 h-5 text-indigo-400 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
