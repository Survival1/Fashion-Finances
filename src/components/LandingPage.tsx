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
  LogIn, 
  Eye,
  Camera,
  Layers,
  Heart,
  Instagram
} from 'lucide-react';
import { ModelProfile } from '../types';
import FashionsFinanceLogo from './FashionsFinanceLogo';
import FashionRankingSlider from './FashionRankingSlider';
import HeroPresentationVideo from './HeroPresentationVideo';

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

  const [coverVideoUrl, setCoverVideoUrl] = useState<string>(() => {
    return localStorage.getItem('landing_page_cover_video_url') || '';
  });

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
    <div ref={topRef} id="landing-page-root" className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col antialiased selection:bg-indigo-500 selection:text-white w-full relative">
      {/* Editorial Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 py-3.5 px-4 sm:px-6 sticky top-0 z-50 transition-all duration-300 shadow-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            onClick={scrollToTop}
            title="Ir arriba / Inicio"
            className="flex items-center gap-3 cursor-pointer group select-none hover:opacity-85 transition"
          >
            <FashionsFinanceLogo mode="light" className="w-9 h-9 sm:w-10 sm:h-10 group-hover:scale-105 transition-transform" />
            <div>
              <h1 className="font-display font-semibold text-base sm:text-lg text-slate-950 leading-tight flex items-center gap-1.5">
                Fashion Finances
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 tracking-widest uppercase font-mono">Investors & Models</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => scrollToSection(simulaRef)}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-lg transition"
            >
              Simulador
            </button>
            <button
              type="button"
              onClick={onLoginClick}
              className="text-xs font-semibold text-slate-800 hover:text-slate-950 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Iniciar Sesión</span>
            </button>
            <button
              type="button"
              onClick={onRegisterClick}
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition flex items-center gap-1.5 active:translate-y-px"
            >
              <UserPlus2 className="w-3.5 h-3.5" />
              <span>Registrarse</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-slate-50 py-20 lg:py-28 px-6">
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
            {/* Overlay gradient to keep high readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-slate-50" />
          </div>
        )}
        {/* Background decorative blurry circles for elegant layout */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-36 right-10 w-[300px] h-[300px] bg-pink-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-semibold uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>La Fusión Definitiva de Moda y Finanzas Colectivas</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-slate-950 tracking-tight leading-[1.1] max-w-3xl mx-auto">
            Descubre <span className="bg-gradient-to-r from-red-600 via-rose-600 to-red-800 bg-clip-text text-transparent font-semibold">Fashion Finances</span>: la plataforma innovadora donde las finanzas se fusionan con la moda.
          </h2>

          {/* Vídeo Oficial de Presentación colocado directamente debajo de "la moda." */}
          <HeroPresentationVideo onExploreClick={() => scrollToSection(rankingRef)} />

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
      <section ref={rankingRef} className="py-20 bg-[#FAF7F6] border-y border-slate-100 px-4 sm:px-6 scroll-mt-20 overflow-hidden relative">
        {/* Subtle decorative shadows like real studio studio photography environment */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#FAF7F6]/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -right-40 top-1/3 w-[350px] h-[350px] bg-pink-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-40 bottom-1/3 w-[350px] h-[350px] bg-indigo-100/20 rounded-full blur-3xl pointer-events-none" />

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-5 flex flex-col justify-between hover:border-slate-400 transition-all duration-200">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-2xl">
                  👓
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-slate-900">Modo Invitado (Visitor)</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Navegación sin cuenta activa</p>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Navega como un visitante externo no registrado. Ideal para visualizar las secciones públicas antes de tomar una decisión.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSwitchPersona('visitor')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition uppercase tracking-wide cursor-pointer shadow-xs active:scale-98"
              >
                Simular Invitado
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero CTA Block: Regístrate y Empieza */}
      <section className="bg-white border-t border-slate-200 py-20 px-6 relative overflow-hidden text-slate-900">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-slate-50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <h3 className="text-2xl sm:text-4xl font-display font-semibold tracking-tight text-slate-950">
            ¿Preparado para transformar tus aspiraciones?
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Consigue patrocinadores reales para tus obras o genera comisiones estables apoyando colectivamente alternativas exclusivas inspiradas en la economía digital.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 select-none">
            <button
              type="button"
              onClick={onRegisterClick}
              className="w-full sm:w-auto px-10 py-4 bg-slate-950 hover:bg-slate-850 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-slate-900/15 hover:shadow-xl transition active:translate-y-px cursor-pointer"
            >
              REGÍSTRATE Y EMPIEZA
            </button>
            <button
              type="button"
              onClick={onLoginClick}
              className="w-full sm:w-auto px-10 py-4 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xs transition active:translate-y-px cursor-pointer"
            >
              YA TENGO CUENTA
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
