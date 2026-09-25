import React from 'react';
import { ModelProfile } from '../types';
import { 
  ArrowLeft, 
  UserPlus2, 
  Instagram, 
  Crown, 
  Sparkles,
  Award,
  Users
} from 'lucide-react';

interface ModelFullscreenExpandedViewProps {
  model: ModelProfile;
  onClose: () => void;
  onSelectSponsor: (model: ModelProfile) => void;
  sliderComponent: React.ReactNode;
}

export const ModelFullscreenExpandedView: React.FC<ModelFullscreenExpandedViewProps> = ({
  model,
  onClose,
  onSelectSponsor,
  sliderComponent
}) => {
  const welcomes: Record<string, string> = {
    'valentinarossi0': '¡Hola! Es un placer saludarte. Formar parte de mi red en Fashion Finances significa sumergirse en lo mejor de la alta costura sostenible. Te acompañará paso a paso para que logremos consolidar tus proyectos de moda más ambiciosos. ¡Trabajemos en equipo!',
    'alexandervance1': '¡Hola! Bienvenido. Soy Alexander y me apasiona la fusión del diseño urbano creativo y las finanzas descentralizadas. Al elegirme como tu patrocinador, contarás con toda mi experiencia de marca y el apoyo de mi comunidad para impulsar tus proyectos en las mesas. ¡Hagamos historia juntos!',
  };

  const welcomeMessage = welcomes[model.username?.toLowerCase() || ''] || 
    `¡Hola! Bienvenido a mi espacio oficial en Fashion Finances. Como tu patrocinadora de moda, mi objetivo es empoderar tu creatividad, ayudándote a financiar y difundir tus propuestas en el ecosistema. ¡Únete hoy a mi equipo de referidos y alcancemos el éxito juntos!`;

  const instagramFollowers = (model.socials?.instagramFollowers) || Math.floor(model.followersCount * 0.58 + 450);
  const tiktokFollowers = (model.socials?.tiktokFollowers) || Math.floor(model.followersCount * 0.72 + 820);

  return (
    <div 
      id="model-expanded-fullscreen-modal"
      className="fixed inset-0 z-[250] w-screen h-screen bg-slate-50 text-slate-900 flex flex-col animate-fade-in select-none overflow-hidden"
    >
      {/* 🌟 BARRA SUPERIOR EN PANTALLA COMPLETA */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2.5 text-slate-900 shrink-0 z-30 shadow-xs">
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 sm:px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 hover:text-slate-900 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition border border-slate-300 cursor-pointer shrink-0 shadow-2xs"
            title="Cerrar y volver a la página"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Volver</span>
          </button>

          <div className="h-5 w-px bg-slate-200 shrink-0 hidden sm:block" />

          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={model.avatar}
              alt={model.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-rose-500 shrink-0 shadow-xs"
            />
            <div className="min-w-0 text-left">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-display font-black text-slate-900 text-sm sm:text-base leading-tight truncate">
                  {model.name}
                </h2>
                <span className="bg-rose-500/10 text-rose-600 border border-rose-500/30 text-[8.5px] sm:text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  Patrocinador Oficial
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono block truncate">
                @{model.username}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones derecha: Elegir como Patrocinador */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onSelectSponsor(model)}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 hover:from-rose-500 hover:to-pink-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-1.5 sm:gap-2 cursor-pointer border border-rose-400"
          >
            <UserPlus2 className="w-4 h-4 text-white shrink-0" />
            <span className="hidden md:inline">Elegir como Patrocinador</span>
            <span className="md:hidden">Elegir</span>
          </button>
        </div>
      </header>

      {/* 🌟 CUERPO PRINCIPAL EN PANTALLA COMPLETA */}
      <div className="flex-1 w-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden bg-slate-50">
        
        {/* COLUMNA IZQUIERDA: Galería Fotográfica a Pantalla Completa */}
        <div className="lg:w-[56%] xl:w-[60%] h-full flex flex-col justify-center items-center p-3.5 sm:p-5 lg:p-7 bg-slate-50 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200">
          {/* Componente del slider de fotos */}
          <div className="w-full h-full flex-1 flex flex-col justify-center items-center min-h-[360px] sm:min-h-[440px] lg:min-h-[500px]">
            {sliderComponent}
          </div>
        </div>

        {/* COLUMNA DERECHA: Ficha de Perfil, Redes Sociales Oficiales, Mensaje de Bienvenida, Sobre mí y Métricas */}
        <div className="lg:w-[44%] xl:w-[40%] h-full flex flex-col justify-between bg-white overflow-y-auto">
          <div className="p-5 sm:p-7 space-y-5 text-left">
            
            {/* Cabecera del Perfil */}
            <div className="flex items-center gap-3.5 p-3.5 sm:p-4 bg-slate-50 border border-slate-200/90 rounded-2xl shadow-2xs">
              <img 
                src={model.avatar} 
                alt={model.name} 
                referrerPolicy="no-referrer"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-rose-500 shadow-md shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-black text-slate-900 text-base sm:text-lg leading-tight truncate">
                    {model.name}
                  </h3>
                  <Crown className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                </div>
                <span className="text-xs text-slate-500 font-mono block truncate">
                  @{model.username}
                </span>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block mt-0.5">
                  {model.gender === 'male' || model.username?.toLowerCase().includes('alexander') ? 'Patrocinador Oficial Masc.' : 'Patrocinador Oficial'}
                </span>
              </div>
            </div>

            {/* Redes Sociales Oficiales (Ubicadas fuera del contenedor de la foto) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-sans">
                  Redes Sociales Oficiales
                </span>
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Cuentas Verificadas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Botón Instagram */}
                <a
                  href={`https://instagram.com/${(model.socials?.instagram || model.username || '').replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-50 hover:bg-rose-50/70 border border-slate-200 hover:border-rose-300 p-2.5 rounded-xl sm:rounded-2xl flex items-center justify-between gap-2 shadow-2xs transition-all duration-200 group cursor-pointer"
                  title={`Abrir Instagram de ${model.name}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 p-2 rounded-xl text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <Instagram className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left min-w-0">
                      <span className="block text-xs font-black text-slate-900 leading-tight group-hover:text-rose-600 transition-colors">Instagram</span>
                      <span className="block text-[9.5px] text-slate-500 font-mono leading-tight truncate">
                        {model.socials?.instagram || `@${model.username}`}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-xs sm:text-sm font-black text-rose-600 font-mono">
                      {instagramFollowers.toLocaleString()}
                    </span>
                    <span className="block text-[7.5px] font-bold uppercase text-slate-500 tracking-wider">Amigos</span>
                  </div>
                </a>

                {/* Botón TikTok */}
                <a
                  href={`https://tiktok.com/@${(model.socials?.tiktok || model.username || '').replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-50 hover:bg-cyan-50/70 border border-slate-200 hover:border-cyan-300 p-2.5 rounded-xl sm:rounded-2xl flex items-center justify-between gap-2 shadow-2xs transition-all duration-200 group cursor-pointer"
                  title={`Abrir TikTok de ${model.name}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="bg-slate-900 p-2 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <svg className="w-4 h-4 text-cyan-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.62 4.14.94 1.07 2.22 1.81 3.59 2.15v3.91c-1.34-.07-2.65-.58-3.72-1.39-.77-.58-1.38-1.38-1.78-2.29-.01 1.94-.01 3.88-.01 5.8 0 1.02-.19 2.05-.59 3.01-.76 1.83-2.39 3.23-4.32 3.69-1.51.37-3.14.21-4.54-.46-2.02-.95-3.35-3.08-3.41-5.33-.08-2.56 1.76-4.95 4.25-5.51.68-.16 1.38-.21 2.08-.14v3.9c-.89-.15-1.84.13-2.48.78-.65.65-.89 1.63-.6 2.5.34.93 1.25 1.57 2.24 1.56 1.15.02 2.12-.91 2.14-2.06.01-4.22.01-8.44.01-12.66-.02-.32-.01-.65-.01-.97z" />
                      </svg>
                    </div>
                    <div className="text-left min-w-0">
                      <span className="block text-xs font-black text-slate-900 leading-tight group-hover:text-cyan-600 transition-colors">TikTok</span>
                      <span className="block text-[9.5px] text-slate-500 font-mono leading-tight truncate">
                        {model.socials?.tiktok || `@${model.username}_tok`}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-xs sm:text-sm font-black text-cyan-600 font-mono">
                      {tiktokFollowers.toLocaleString()}
                    </span>
                    <span className="block text-[7.5px] font-bold uppercase text-slate-500 tracking-wider">Amigos</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Mensaje de Bienvenida */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-bold text-indigo-600 uppercase tracking-widest block font-sans">
                  Mensaje de Bienvenida
                </span>
                <span className="text-[8.5px] font-semibold text-slate-400 uppercase tracking-wider">
                  Espacio Oficial
                </span>
              </div>
              <div className="bg-indigo-50/60 border border-indigo-100/60 rounded-2xl p-4 sm:p-5 relative font-sans shadow-xs">
                <span className="absolute top-2.5 right-3.5 text-indigo-200 font-serif text-4xl select-none leading-none">“</span>
                <p className="text-slate-700 text-xs sm:text-sm font-medium leading-relaxed font-sans italic pr-3">
                  {welcomeMessage}
                </p>
              </div>
            </div>

            {/* Sobre Mí */}
            <div className="space-y-1.5">
              <span className="text-[9.5px] font-bold text-pink-600 uppercase tracking-widest block font-sans">
                Sobre mí
              </span>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-sans font-medium pl-1 bg-slate-50/70 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80">
                {model.bio || 'Top 1 Modelo Femenina Global. Creadora oficial registrada, enfocada en conectar inversores con proyectos potentes.'}
              </p>
            </div>

            {/* Métricas e Indicadores de Patrocinio */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl text-center shadow-xs">
                <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span className="text-[8.5px] uppercase tracking-wider font-bold font-sans">Patrocinios</span>
                </div>
                <span className="block text-sm sm:text-base font-black text-slate-900 font-mono">
                  {model.referidosCount} activos
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl text-center shadow-xs">
                <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                  <Award className="w-3 h-3 text-rose-400" />
                  <span className="text-[8.5px] uppercase tracking-wider font-bold font-sans">Popularidad</span>
                </div>
                <span className="block text-sm sm:text-base font-black text-rose-600 font-mono">
                  {(model.totalLikes).toLocaleString()} votos
                </span>
              </div>
            </div>

            {/* Tarjeta Destacada Informativa: Vincúlate con el Patrocinador */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-rose-50 via-white to-pink-50 border-2 border-rose-200 rounded-2xl sm:rounded-3xl space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-rose-600 font-black text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Vincúlate con {model.name}</span>
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Al seleccionar a <strong>{model.name}</strong> desde el botón superior, su código de patrocinador quedará pre-asignado automáticamente en tu registro para respaldar y financiar tus propuestas en las mesas de inversión.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
