import React from 'react';
import { ArrowLeft, FileText, CheckCircle2, Upload, Play, Sparkles, Download, DollarSign } from 'lucide-react';

interface ProjectFullscreenDossierModalProps {
  detailProjectUser: any;
  showProjectDetailsInPopup: boolean;
  activeFinanzasPopupUser: any;
  selectedFinanzasUser: any;
  currentFinanzasSession: any;
  getFinanzasProjectDetails: (userId: string) => any;
  customProjectMedia: Record<string, Array<{ id: string; type: 'image' | 'video'; url: string; title: string }>>;
  setCustomProjectMedia: React.Dispatch<React.SetStateAction<Record<string, Array<{ id: string; type: 'image' | 'video'; url: string; title: string }>>>>;
  newMediaImageUrl: string;
  setNewMediaImageUrl: React.Dispatch<React.SetStateAction<string>>;
  newMediaVideoUrl: string;
  setNewMediaVideoUrl: React.Dispatch<React.SetStateAction<string>>;
  detailModalStep: 'all' | 'basic' | 'finance' | 'team';
  setDetailModalStep: React.Dispatch<React.SetStateAction<'all' | 'basic' | 'finance' | 'team'>>;
  onClose: () => void;
  onVoteProject?: (user: any) => void;
}

export const ProjectFullscreenDossierModal: React.FC<ProjectFullscreenDossierModalProps> = ({
  detailProjectUser,
  activeFinanzasPopupUser,
  selectedFinanzasUser,
  currentFinanzasSession,
  getFinanzasProjectDetails,
  customProjectMedia,
  setCustomProjectMedia,
  newMediaImageUrl,
  setNewMediaImageUrl,
  newMediaVideoUrl,
  setNewMediaVideoUrl,
  detailModalStep,
  setDetailModalStep,
  onClose,
  onVoteProject,
}) => {
  // Resolve participant, prioritizing currently active presenter or selected participant
  const rawTarget = detailProjectUser || activeFinanzasPopupUser || selectedFinanzasUser || currentFinanzasSession?.presenter || currentFinanzasSession?.participants?.[0] || {
    id: 'f-0',
    name: 'Lucas Torres',
    username: 'lucas_torres_design',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=650',
    role: 'Diseñador Gráfico'
  };

  const activeProjUser = rawTarget;

  const proj = getFinanzasProjectDetails(activeProjUser.id || activeProjUser.name || 'f-0');
  const mediaList = customProjectMedia[activeProjUser.id] || customProjectMedia['default'] || [];

  return (
    <div 
      id="channel-project-fullscreen-view"
      className="relative w-full h-full bg-[#070b14] text-white flex flex-col font-sans select-none animate-fade-in overflow-hidden"
    >
      {/* 🌟 TOP CONTROL BAR INSIDE CHANNEL (Dark Luxury matching za.png) */}
      <header className="w-full bg-[#0e1628]/95 border-b border-slate-800/80 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 text-white shrink-0 z-20 shadow-xl">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#131c31] hover:bg-[#1a2542] text-white font-extrabold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer shrink-0 active:scale-95 shadow-md"
            title="Volver a la retransmisión"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span className="font-extrabold text-[11px] sm:text-xs tracking-wide">Volver al Directo</span>
          </button>
        </div>

        {/* Presenter info pill */}
        <div className="flex items-center gap-1.5 shrink-0 min-w-0">
          <div className="flex items-center gap-1.5 bg-[#070b14]/90 border border-slate-700/80 px-2.5 py-1 rounded-full max-w-[150px] sm:max-w-none shadow-inner">
            <img
              src={activeProjUser.avatar}
              alt={activeProjUser.name}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-emerald-400 shrink-0"
              referrerPolicy="no-referrer"
            />
            <span className="text-xs font-black text-white truncate">{activeProjUser.name}</span>
          </div>
        </div>
      </header>

      {/* 📄 MAIN SCROLLABLE DOSSIER BODY (Dark Luxury Theme) */}
      <div 
        className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-[#070b14] p-2.5 sm:p-4 pb-20 scrollbar-none box-border"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="w-full max-w-full mx-auto bg-[#0e1628]/95 rounded-3xl shadow-2xl border border-slate-800/80 overflow-hidden flex flex-col p-3.5 sm:p-5 space-y-4 box-border">
          
          {/* Header: Title, Category, Tagline & Author Card */}
          <div className="flex flex-col gap-3.5 border-b border-slate-800/80 pb-3.5 text-left w-full min-w-0 box-border">
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] sm:text-[10.5px] font-black uppercase text-rose-400 tracking-wider bg-rose-950/80 px-2.5 py-0.5 rounded-lg border border-rose-500/40">
                  {proj.category || 'Alta Costura & Pasarela Sostenible'}
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-black uppercase text-emerald-400 tracking-wider bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  PROYECTO AUDITADO Y VERIFICADO
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-display text-white tracking-tight m-0 leading-tight break-words drop-shadow-sm">
                {proj.title}
              </h1>

              {proj.tagline && (
                <p className="text-xs sm:text-sm text-amber-200 font-serif italic bg-amber-950/30 p-2.5 sm:p-3 rounded-xl border border-amber-500/30 m-0 leading-relaxed shadow-inner break-words">
                  "{proj.tagline}"
                </p>
              )}
            </div>

            {/* Presenter Profile Box */}
            <div className="bg-[#070b14]/90 text-white p-3 sm:p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3 shadow-md text-left w-full min-w-0 box-border">
              <div className="relative shrink-0">
                <img
                  src={activeProjUser.avatar}
                  alt={activeProjUser.name}
                  className="w-13 h-13 sm:w-15 sm:h-15 rounded-xl object-cover border-2 border-emerald-400 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 text-[8.5px] font-black px-1.5 py-0.2 rounded-full border border-slate-950">
                  LIVE
                </span>
              </div>
              <div className="flex flex-col text-left min-w-0 flex-1">
                <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400">Líder del Proyecto</span>
                <h3 className="text-sm sm:text-base font-black text-white m-0 leading-tight truncate">{activeProjUser.name}</h3>
                <span className="text-xs text-slate-400 font-medium truncate">@{activeProjUser.username || 'kendall_jenner_vip'}</span>
                <span className="text-[10.5px] text-amber-400 font-bold mt-0.5 truncate">{activeProjUser.role}</span>
              </div>
            </div>
          </div>

          {/* Step Navigation Pills */}
          <div className="bg-[#070b14]/90 border border-slate-800/80 rounded-2xl p-1.5 grid grid-cols-3 gap-1 text-center text-[10px] sm:text-xs font-black shrink-0 w-full box-border">
            <button
              type="button"
              onClick={() => setDetailModalStep(detailModalStep === 'basic' ? 'all' : 'basic')}
              className={`py-2 px-1 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer font-sans ${
                detailModalStep === 'basic'
                  ? 'bg-gradient-to-r from-rose-600 via-[#fe2c55] to-rose-700 text-white border-rose-500/50 shadow-md scale-[1.01]'
                  : 'bg-[#0e1628]/80 text-slate-300 border-slate-800 hover:bg-[#131c31]'
              }`}
            >
              <span>📄</span>
              <span className="truncate font-extrabold text-[9.5px] sm:text-xs">1. Identidad</span>
            </button>

            <button
              type="button"
              onClick={() => setDetailModalStep(detailModalStep === 'finance' ? 'all' : 'finance')}
              className={`py-2 px-1 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer font-sans ${
                detailModalStep === 'finance'
                  ? 'bg-gradient-to-r from-rose-600 via-[#fe2c55] to-rose-700 text-white border-rose-500/50 shadow-md scale-[1.01]'
                  : 'bg-[#0e1628]/80 text-slate-300 border-slate-800 hover:bg-[#131c31]'
              }`}
            >
              <span>📈</span>
              <span className="truncate font-extrabold text-[9.5px] sm:text-xs">2. Economía</span>
            </button>

            <button
              type="button"
              onClick={() => setDetailModalStep(detailModalStep === 'team' ? 'all' : 'team')}
              className={`py-2 px-1 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer font-sans ${
                detailModalStep === 'team'
                  ? 'bg-gradient-to-r from-rose-600 via-[#fe2c55] to-rose-700 text-white border-rose-500/50 shadow-md scale-[1.01]'
                  : 'bg-[#0e1628]/80 text-slate-300 border-slate-800 hover:bg-[#131c31]'
              }`}
            >
              <span>👥</span>
              <span className="truncate font-extrabold text-[9.5px] sm:text-xs">3. Equipo</span>
            </button>
          </div>

          {/* Subtitle & Step toggle */}
          <div className="flex flex-wrap justify-between items-center gap-2 px-1 text-xs font-bold text-slate-400 shrink-0 border-b border-slate-800/80 pb-2 w-full">
            <span className="text-[11px] sm:text-xs truncate text-amber-300 font-mono">
              {detailModalStep === 'basic' && 'Paso 1: Identidad Creativa & Dossier'}
              {detailModalStep === 'finance' && 'Paso 2: Estructura Financiera'}
              {detailModalStep === 'team' && 'Paso 3: Equipo Humano'}
              {detailModalStep === 'all' && 'Dossier Completo de Proyecto'}
            </span>
            <button
              type="button"
              onClick={() => setDetailModalStep(detailModalStep === 'all' ? 'basic' : 'all')}
              className="text-[10px] sm:text-[11px] font-black text-white bg-[#131c31] hover:bg-[#1a2542] px-2.5 py-1.5 rounded-lg transition border border-slate-700 cursor-pointer uppercase flex items-center gap-1 shrink-0"
            >
              👁️ {detailModalStep === 'all' ? 'FILTRAR PASO' : 'VER TODOS'}
            </button>
          </div>

          {/* SECTION 1: IDENTIDAD CREATIVA */}
          {(detailModalStep === 'all' || detailModalStep === 'basic') && (
            <div className="bg-[#070b14]/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 text-left animate-fade-in shadow-inner w-full min-w-0 box-border">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800/80 pb-2.5">
                <span className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>1. Identidad Creativa del Proyecto</span>
                </span>
                <span className="text-[10.5px] text-emerald-400 font-extrabold bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-500/40 shrink-0">
                  ✓ Verificado Oficial
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Descripción Detallada de la Propuesta</span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium m-0 break-words">
                  {proj.description}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-1 w-full">
                <div className="bg-[#0e1628]/95 p-3 rounded-xl border border-slate-800 text-xs sm:text-sm shadow-xs w-full min-w-0 box-border">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email de Contacto Oficial</span>
                  <span className="font-extrabold text-white truncate block mt-0.5 flex items-center gap-1.5">
                    <span className="text-rose-400 shrink-0">✉</span> <span className="truncate">{proj.contactEmail || 'kendall@818couture.com'}</span>
                  </span>
                </div>
                <div className="bg-[#0e1628]/95 p-3 rounded-xl border border-slate-800 text-xs sm:text-sm shadow-xs w-full min-w-0 box-border">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Teléfono Directo de Producción</span>
                  <span className="font-extrabold text-white truncate block mt-0.5 flex items-center gap-1.5">
                    <span className="text-emerald-400 shrink-0">📞</span> <span className="truncate">{proj.contactPhone || '+1 (310) 818-2026'}</span>
                  </span>
                </div>
              </div>

              {/* IMÁGENES O VIDEOS DE REFERENCIA */}
              <div className="mt-1 bg-[#0e1628]/95 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3 shadow-md w-full min-w-0 box-border">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">📷</span>
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      IMÁGENES Y VÍDEOS
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-500/40 shrink-0">
                    {mediaList.length} Archivos
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-normal m-0 font-medium break-words">
                  Fotografías y vídeos del proyecto para los inversores y patrocinadores de la sesión.
                </p>

                {/* Media Thumbnails Grid */}
                {mediaList.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 pt-1 w-full">
                    {mediaList.map((item) => (
                      <div key={item.id} className="relative group rounded-2xl overflow-hidden border-2 border-slate-700 hover:border-amber-400/80 bg-slate-900 w-28 h-28 sm:w-36 sm:h-36 shrink-0 aspect-square shadow-lg">
                        {item.type === 'video' ? (
                          <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                            <video src={item.url} className="w-full h-full object-cover opacity-85" muted loop autoPlay playsInline />
                            <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center gap-1">
                              <span className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow-md">
                                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                              </span>
                              <span className="text-[9px] font-black text-white bg-black/70 px-2 py-0.5 rounded uppercase">{item.title}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="relative w-full h-full">
                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
                              <span className="text-[9.5px] font-black text-white truncate block">{item.title}</span>
                            </div>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            const curKey = customProjectMedia[activeProjUser.id] ? activeProjUser.id : 'default';
                            setCustomProjectMedia(prev => ({
                              ...prev,
                              [curKey]: (prev[curKey] || []).filter(m => m.id !== item.id)
                            }));
                          }}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/80 hover:bg-rose-600 text-white flex items-center justify-center text-xs transition cursor-pointer z-10"
                          title="Eliminar"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Botón de subir archivo desde el equipo debajo de las fotos con diseño cuadrado */}
                <div className="pt-2">
                  <label className="border-2 border-dashed border-slate-700 hover:border-amber-400 bg-[#070b14] hover:bg-[#0e1628] rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition w-28 h-28 sm:w-36 sm:h-36 aspect-square group shadow-inner">
                    <input 
                      type="file" 
                      accept="image/*,video/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          const isVid = file.type.startsWith('video');
                          const curKey = customProjectMedia[activeProjUser.id] ? activeProjUser.id : (activeProjUser.id || 'default');
                          setCustomProjectMedia(prev => ({
                            ...prev,
                            [curKey]: [
                              ...(prev[curKey] || []),
                              { id: `up-${Date.now()}`, type: isVid ? 'video' : 'image', url, title: file.name.slice(0, 16) }
                            ]
                          }));
                        }
                      }}
                    />
                    <span className="w-8 h-8 rounded-full bg-[#131c31] group-hover:bg-amber-400/20 text-amber-300 flex items-center justify-center text-sm mb-1 transition shadow-xs">
                      <Upload className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-black text-white leading-tight">
                      Subir archivo desde el equipo
                    </span>
                    <span className="text-[8px] text-slate-400 mt-0.5 leading-tight">
                      Fotos o vídeos
                    </span>
                  </label>
                </div>

                {/* URL Input Row */}
                <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row gap-2 w-full min-w-0">
                  <div className="flex-1 flex items-center gap-1.5 bg-[#070b14] border border-slate-700 rounded-xl px-2.5 py-1.5 min-w-0">
                    <input
                      type="text"
                      placeholder="Enlace de foto (.jpg, .png)"
                      value={newMediaImageUrl}
                      onChange={(e) => setNewMediaImageUrl(e.target.value)}
                      className="w-full text-[10px] outline-none text-white bg-transparent min-w-0 placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newMediaImageUrl.trim()) {
                          const curKey = customProjectMedia[activeProjUser.id] ? activeProjUser.id : (activeProjUser.id || 'default');
                          setCustomProjectMedia(prev => ({
                            ...prev,
                            [curKey]: [
                              ...(prev[curKey] || []),
                              { id: `img-${Date.now()}`, type: 'image', url: newMediaImageUrl, title: 'Foto Runway' }
                            ]
                          }));
                          setNewMediaImageUrl('');
                        }
                      }}
                      className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-slate-950 font-black text-[9px] rounded-lg cursor-pointer uppercase shrink-0"
                    >
                      +FOTO
                    </button>
                  </div>

                  <div className="flex-1 flex items-center gap-1.5 bg-[#070b14] border border-slate-700 rounded-xl px-2.5 py-1.5 min-w-0">
                    <input
                      type="text"
                      placeholder="Enlace de vídeo (.mp4)"
                      value={newMediaVideoUrl}
                      onChange={(e) => setNewMediaVideoUrl(e.target.value)}
                      className="w-full text-[10px] outline-none text-white bg-transparent min-w-0 placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newMediaVideoUrl.trim()) {
                          const curKey = customProjectMedia[activeProjUser.id] ? activeProjUser.id : (activeProjUser.id || 'default');
                          setCustomProjectMedia(prev => ({
                            ...prev,
                            [curKey]: [
                              ...(prev[curKey] || []),
                              { id: `vid-${Date.now()}`, type: 'video', url: newMediaVideoUrl, title: 'Vídeo Runway' }
                            ]
                          }));
                          setNewMediaVideoUrl('');
                        }
                      }}
                      className="px-2.5 py-1 bg-gradient-to-r from-rose-600 to-[#fe2c55] hover:opacity-95 text-white font-black text-[9px] rounded-lg cursor-pointer uppercase shrink-0"
                    >
                      +VÍDEO
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: ECONOMÍA Y FONDOS */}
          {(detailModalStep === 'all' || detailModalStep === 'finance') && (
            <div className="bg-[#070b14]/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 text-left animate-fade-in shadow-inner w-full min-w-0 box-border">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800/80 pb-2.5">
                <span className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>2. Economía y Fondos (Plan de Viabilidad)</span>
                </span>
                <span className="text-[10.5px] text-emerald-400 font-extrabold bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-500/40 shrink-0">
                  ✓ Auditado por Fashions Finances
                </span>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <div className="bg-[#0e1628]/95 p-3.5 sm:p-4 rounded-2xl border border-slate-800 flex flex-col gap-1 shadow-md w-full min-w-0 box-border">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta de Financiación / Presupuesto</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                    {proj.fundingGoal || '500.000 €'}
                  </span>
                  <span className="text-xs text-slate-300 mt-1 font-medium break-words">
                    {proj.metrics}
                  </span>
                </div>

                <div className="bg-[#0e1628]/95 p-3.5 sm:p-4 rounded-2xl border border-slate-800 flex flex-col gap-1 shadow-md w-full min-w-0 box-border">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Retorno Estimado (ROI)</span>
                  <span className="text-sm sm:text-base font-black text-emerald-400 leading-snug break-words font-mono">
                    {proj.roi}
                  </span>
                </div>
              </div>

              <div className="bg-[#0e1628]/95 p-3.5 sm:p-4 rounded-2xl border border-slate-800 text-sm space-y-1.5 shadow-md w-full min-w-0 box-border">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Desglose de Gastos & Uso de Fondos</span>
                <p className="font-semibold text-slate-300 leading-relaxed m-0 text-xs sm:text-sm break-words">
                  {proj.fundUsage || '50% Confección Alta Costura & Tejidos Sostenibles • 30% Producción Runway Fashion Week • 20% Marketing & Distribución Global'}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 w-full">
                <div className="bg-[#0e1628]/95 p-3.5 rounded-2xl border border-slate-800 text-xs shadow-md w-full min-w-0 box-border">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Plazo de Ejecución</span>
                  <span className="font-black text-white text-sm block mt-0.5 break-words">
                    {proj.timeline || '6 meses (Lanzamiento oficial Fashion Week 2026)'}
                  </span>
                </div>
                <div className="bg-[#0e1628]/95 p-3.5 rounded-2xl border border-slate-800 text-xs flex items-center justify-between gap-3 shadow-md w-full min-w-0 box-border">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Documento Oficial</span>
                    <span className="font-extrabold text-white text-xs truncate block mt-0.5" title={proj.documentation || 'Dossier-Kendall-Jenner-Haute-Couture-2026.pdf'}>
                      {proj.documentation || 'Dossier-Kendall-Jenner-Haute-Couture-2026.pdf'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`📥 Descargando documento oficial: ${proj.documentation || 'Dossier-Proyecto.pdf'}`)}
                    className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-black rounded-xl border border-rose-500/40 transition cursor-pointer text-xs flex items-center gap-1 shrink-0 active:scale-95 shadow-sm"
                  >
                    <span>PDF</span>
                    <span>📄</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: EQUIPO HUMANO */}
          {(detailModalStep === 'all' || detailModalStep === 'team') && (
            <div className="bg-[#070b14]/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 text-left animate-fade-in shadow-inner w-full min-w-0 box-border">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800/80 pb-2.5">
                <span className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>3. Equipo Humano & Presentador</span>
                </span>
                <span className="text-[10.5px] text-emerald-400 font-extrabold bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-500/40 shrink-0">
                  ✓ Verificado Internacional
                </span>
              </div>

              <div className="bg-[#0e1628]/95 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col gap-3 shadow-md w-full min-w-0 box-border">
                {/* Header row: Avatar + Identidad + Badge Líder Creativa VIP */}
                <div className="flex items-center justify-between gap-2.5 w-full min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img 
                      src={activeProjUser.avatar} 
                      alt={activeProjUser.name} 
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-md shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col text-left min-w-0 flex-1">
                      <span className="text-[9.5px] font-black uppercase text-rose-400 tracking-wider truncate">
                        Creadora y Directora de Pasarela
                      </span>
                      <span className="text-base sm:text-lg font-black text-white truncate leading-tight">
                        {activeProjUser.name}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 truncate">
                        @{activeProjUser.username || 'kendall_jenner_vip'} · {activeProjUser.role}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black px-2.5 py-1.5 rounded-xl shrink-0 shadow-sm whitespace-nowrap">
                    Líder Creativa VIP
                  </span>
                </div>

                {/* Bio text below - full width, wraps cleanly, never clipped */}
                <p className="text-xs text-slate-300 leading-relaxed m-0 font-medium break-words border-t border-slate-800 pt-2.5">
                  Supermodelo internacional de alta costura, empresaria y referente global en semanas de la moda de Milán, París y Nueva York.
                </p>
              </div>
            </div>
          )}

          {/* 💼 FOOTER ACTION BAR INSIDE DOSSIER */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800/80 w-full min-w-0 box-border">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
              {onVoteProject && (
                <button
                  type="button"
                  onClick={() => onVoteProject(activeProjUser)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-[#fe2c55] to-rose-700 hover:opacity-95 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/60 active:scale-95 border border-rose-500/40"
                >
                  <span className="text-sm">🗳️</span>
                  <span>Votar por este Proyecto</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => alert(`📄 Descargando dossier oficial de ${proj.title}...`)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#131c31] hover:bg-[#1a2542] text-white font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700 shadow-md active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Descargar PDF</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
