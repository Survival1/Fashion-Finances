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
      className="relative w-full h-full bg-slate-950 flex flex-col font-sans select-none animate-fade-in overflow-hidden"
    >
      {/* 🌟 TOP CONTROL BAR INSIDE CHANNEL */}
      <header className="w-full bg-slate-900 border-b border-slate-800 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 text-white shrink-0 z-20 shadow-xl">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer shrink-0 active:scale-95 shadow-xs"
            title="Volver a la retransmisión"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-extrabold text-[11px] sm:text-xs">Volver al Directo</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden xs:block" />

          <div className="flex items-center gap-1.5 min-w-0">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              EN CANAL
            </span>
            <span className="text-xs font-black text-slate-200 truncate hidden md:inline">
              {proj.title}
            </span>
          </div>
        </div>

        {/* Presenter info pill */}
        <div className="flex items-center gap-1.5 shrink-0 min-w-0">
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded-full max-w-[140px] sm:max-w-none">
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

      {/* 📄 MAIN SCROLLABLE DOSSIER BODY */}
      <div 
        className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-slate-100 p-2.5 sm:p-4 pb-20 scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="w-full max-w-full mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col p-3.5 sm:p-5 space-y-4">
          
          {/* Header: Title, Category, Tagline & Author Card */}
          <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-4 text-left">
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] sm:text-[10.5px] font-black uppercase text-rose-600 tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                  {proj.category || 'Alta Costura & Pasarela Sostenible'}
                </span>
                <span className="text-[9.5px] sm:text-[10px] font-black uppercase text-emerald-700 tracking-wider bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  PROYECTO AUDITADO Y VERIFICADO
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-display text-slate-950 tracking-tight m-0 leading-tight">
                {proj.title}
              </h1>

              {proj.tagline && (
                <p className="text-xs sm:text-sm text-amber-900 font-serif italic bg-amber-50/80 p-2.5 sm:p-3 rounded-xl border border-amber-200/80 m-0 leading-relaxed shadow-2xs">
                  "{proj.tagline}"
                </p>
              )}
            </div>

            {/* Presenter Profile Box */}
            <div className="bg-slate-900 text-white p-3 sm:p-4 rounded-xl border border-slate-800 flex items-center gap-3 shrink-0 shadow-md text-left">
              <div className="relative shrink-0">
                <img
                  src={activeProjUser.avatar}
                  alt={activeProjUser.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-emerald-400 shadow-md"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-black text-[8.5px] font-black px-1.5 py-0.2 rounded-full border border-white">
                  LIVE
                </span>
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400">Líder del Proyecto</span>
                <h3 className="text-sm sm:text-base font-black text-white m-0 leading-tight truncate">{activeProjUser.name}</h3>
                <span className="text-xs text-slate-300 font-medium truncate">@{activeProjUser.username || 'kendall_jenner_vip'}</span>
                <span className="text-[10.5px] text-slate-400 font-bold mt-0.5 truncate">{activeProjUser.role}</span>
              </div>
            </div>
          </div>

          {/* Step Navigation Pills */}
          <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-1.5 grid grid-cols-3 gap-1 text-center text-[10px] sm:text-xs font-black shrink-0 w-full">
            <button
              type="button"
              onClick={() => setDetailModalStep(detailModalStep === 'basic' ? 'all' : 'basic')}
              className={`py-2 px-1.5 rounded-lg border flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer font-sans ${
                detailModalStep === 'basic'
                  ? 'bg-slate-950 text-white border-slate-950 shadow-md scale-[1.01]'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>📄</span>
              <span className="truncate font-extrabold">1. Identidad</span>
            </button>

            <button
              type="button"
              onClick={() => setDetailModalStep(detailModalStep === 'finance' ? 'all' : 'finance')}
              className={`py-2 px-1.5 rounded-lg border flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer font-sans ${
                detailModalStep === 'finance'
                  ? 'bg-slate-950 text-white border-slate-950 shadow-md scale-[1.01]'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>📈</span>
              <span className="truncate font-extrabold">2. Economía</span>
            </button>

            <button
              type="button"
              onClick={() => setDetailModalStep(detailModalStep === 'team' ? 'all' : 'team')}
              className={`py-2 px-1.5 rounded-lg border flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer font-sans ${
                detailModalStep === 'team'
                  ? 'bg-slate-950 text-white border-slate-950 shadow-md scale-[1.01]'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>👥</span>
              <span className="truncate font-extrabold">3. Equipo</span>
            </button>
          </div>

          {/* Subtitle & Step toggle */}
          <div className="flex flex-wrap justify-between items-center gap-2 px-1 text-xs font-bold text-slate-500 shrink-0 border-b border-slate-100 pb-2">
            <span>
              {detailModalStep === 'basic' && 'Mostrando Paso 1: Identidad Creativa & Dossier de Moda'}
              {detailModalStep === 'finance' && 'Mostrando Paso 2: Estructura Financiera & Plan de Inversión'}
              {detailModalStep === 'team' && 'Mostrando Paso 3: Equipo Humano & Presentador'}
              {detailModalStep === 'all' && 'Mostrando Todos los Pasos del Dossier Completo'}
            </span>
            <button
              type="button"
              onClick={() => setDetailModalStep(detailModalStep === 'all' ? 'basic' : 'all')}
              className="text-[11px] font-black text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition border border-slate-200 cursor-pointer uppercase flex items-center gap-1.5"
            >
              👁️ {detailModalStep === 'all' ? 'FILTRAR POR PASO' : 'MOSTRAR TODOS LOS PASOS'}
            </button>
          </div>

          {/* SECTION 1: IDENTIDAD CREATIVA */}
          {(detailModalStep === 'all' || detailModalStep === 'basic') && (
            <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 text-left animate-fade-in shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-rose-600" />
                  1. Identidad Creativa del Proyecto
                </span>
                <span className="text-[11px] text-emerald-800 font-extrabold bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200">
                  ✓ Verificado Oficial
                </span>
              </div>

              <div>
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Descripción Detallada de la Propuesta</span>
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium m-0">
                  {proj.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-sm shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email de Contacto Oficial</span>
                  <span className="font-extrabold text-slate-900 truncate block mt-0.5 flex items-center gap-1.5">
                    <span className="text-rose-600">✉</span> {proj.contactEmail || 'kendall@818couture.com'}
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-sm shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Teléfono Directo de Producción</span>
                  <span className="font-extrabold text-slate-900 truncate block mt-0.5 flex items-center gap-1.5">
                    <span className="text-emerald-600">📞</span> {proj.contactPhone || '+1 (310) 818-2026'}
                  </span>
                </div>
              </div>

              {/* IMÁGENES O VIDEOS DE REFERENCIA */}
              <div className="mt-2 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📷</span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
                      IMÁGENES Y VIDEOS DE PASARELA / LOOKBOOK
                    </span>
                  </div>
                  <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {mediaList.length} Archivos
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-normal m-0 font-medium">
                  Fotografías exclusivas, siluetas de alta costura, bocetos de pasarela y lookbook para los inversores y patrocinadores de la sesión.
                </p>

                {/* Media Thumbnails Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                  {mediaList.map((item) => (
                    <div key={item.id} className="relative group rounded-xl overflow-hidden border border-slate-300 bg-slate-900 aspect-square shadow-sm">
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
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/75 hover:bg-rose-600 text-white flex items-center justify-center text-xs transition cursor-pointer z-10"
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* File Upload Dropzone */}
                  <label className="border-2 border-dashed border-slate-300 hover:border-rose-500 bg-slate-50 hover:bg-rose-50/40 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition aspect-square group">
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
                    <span className="w-8 h-8 rounded-full bg-white group-hover:bg-rose-100 text-slate-700 group-hover:text-rose-600 flex items-center justify-center text-sm mb-1.5 transition shadow-2xs">
                      <Upload className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-black text-slate-900 leading-tight">
                      Subir archivo desde el equipo
                    </span>
                    <span className="text-[8.5px] text-slate-400 mt-0.5">
                      Fotos (.jpg, .png) o vídeos (.mp4)
                    </span>
                  </label>
                </div>

                {/* URL Input Row */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                  <div className="flex-1 min-w-[160px] flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                    <input
                      type="text"
                      placeholder="Enlace de foto (.jpg, .png)"
                      value={newMediaImageUrl}
                      onChange={(e) => setNewMediaImageUrl(e.target.value)}
                      className="w-full text-[10.5px] outline-none text-slate-800 bg-transparent"
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
                      className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-white font-black text-[9px] rounded-lg cursor-pointer uppercase"
                    >
                      +FOTO
                    </button>
                  </div>

                  <div className="flex-1 min-w-[160px] flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                    <input
                      type="text"
                      placeholder="Enlace de vídeo (.mp4)"
                      value={newMediaVideoUrl}
                      onChange={(e) => setNewMediaVideoUrl(e.target.value)}
                      className="w-full text-[10.5px] outline-none text-slate-800 bg-transparent"
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
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-black text-[9px] rounded-lg cursor-pointer uppercase"
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
            <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 text-left animate-fade-in shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  2. Economía y Fondos (Plan de Inversión y Viabilidad)
                </span>
                <span className="text-[11px] text-emerald-800 font-extrabold bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200">
                  ✓ Auditado por Fashions Finances
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col gap-1 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Meta de Financiación / Presupuesto</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-950">
                    {proj.fundingGoal || '500.000 €'}
                  </span>
                  <span className="text-xs text-slate-600 mt-1 font-medium">
                    {proj.metrics}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-col gap-1 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Retorno Estimado (ROI)</span>
                  <span className="text-sm sm:text-base font-black text-emerald-700 leading-snug">
                    {proj.roi}
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 text-sm space-y-1.5 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Desglose de Gastos & Uso de Fondos</span>
                <p className="font-semibold text-slate-800 leading-relaxed m-0 text-xs sm:text-sm">
                  {proj.fundUsage || '50% Confección Alta Costura & Tejidos Sostenibles • 30% Producción Runway Fashion Week • 20% Marketing & Distribución Global'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 text-xs shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Plazo de Ejecución</span>
                  <span className="font-black text-slate-900 text-sm block mt-0.5">
                    {proj.timeline || '6 meses (Lanzamiento oficial Fashion Week 2026)'}
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 text-xs flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Documento Oficial</span>
                    <span className="font-extrabold text-slate-900 text-xs truncate block max-w-[180px] mt-0.5">
                      {proj.documentation || 'Dossier-Kendall-Jenner-Haute-Couture-2026.pdf'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`📥 Descargando documento oficial: ${proj.documentation || 'Dossier-Proyecto.pdf'}`)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black rounded-xl border border-rose-200 transition cursor-pointer text-xs flex items-center gap-1"
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
            <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-5 sm:p-6 flex flex-col gap-4 text-left animate-fade-in shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  3. Equipo Humano & Presentador
                </span>
                <span className="text-[11px] text-emerald-800 font-extrabold bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200">
                  ✓ Verificado Internacional
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                <div className="flex items-center gap-4">
                  <img 
                    src={activeProjUser.avatar} 
                    alt={activeProjUser.name} 
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-black uppercase text-rose-600 tracking-wider">Creadora y Directora de Pasarela</span>
                    <span className="text-lg font-black text-slate-950">{activeProjUser.name}</span>
                    <span className="text-xs font-semibold text-slate-500">@{activeProjUser.username || 'kendall_jenner_vip'} · {activeProjUser.role}</span>
                    <p className="text-xs text-slate-600 mt-1 m-0 font-medium">
                      Supermodelo internacional de alta costura, empresaria y referente global en semanas de la moda de Milán, París y Nueva York.
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-slate-950 text-white font-black px-3.5 py-2 rounded-xl shrink-0 shadow-sm">
                  Líder Creativa VIP
                </span>
              </div>
            </div>
          )}

          {/* 💼 FOOTER ACTION BAR INSIDE DOSSIER */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => alert(`📄 Descargando dossier oficial de ${proj.title}...`)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar PDF</span>
              </button>

              <button
                type="button"
                onClick={() => alert(`💼 Solicitud de patrocinio enviada para el proyecto "${proj.title}". El equipo de ${activeProjUser.name} se pondrá en contacto.`)}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <span>Patrocinar Proyecto</span>
                <span>💎</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
