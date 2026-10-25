import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  ShieldCheck, 
  Clock, 
  Users, 
  Award, 
  CheckCircle2, 
  FileText, 
  Vote, 
  Mic, 
  Sparkles, 
  AlertTriangle,
  Database,
  ArrowRight,
  TrendingUp,
  Layers,
  Coins,
  PieChart
} from 'lucide-react';

interface ReglasParticipacionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReglasParticipacionModal: React.FC<ReglasParticipacionModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'dinamica' | 'categorias' | 'requisitos' | 'etica' | 'ganancias' | 'distribucion'>('dinamica');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-[#fdf2f8]/85 backdrop-blur-xl animate-fade-in font-sans"
      id="modal-reglas-participacion"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="rounded-[32px] w-full max-w-[calc(100vw-8px)] lg:max-w-5xl h-[calc(100dvh-12px)] max-h-[96vh] flex flex-col shadow-[0_25px_80px_rgba(219,39,119,0.22)] border-2 border-pink-200/90 overflow-hidden text-slate-800 animate-slide-up bg-gradient-to-br from-[#FFF5F8] via-[#FFFFFF] to-[#FFF0F5]"
        style={{
          background: 'linear-gradient(135deg, #FFF5F8 0%, #FFFFFF 50%, #FFF0F5 100%)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Victoria's Secret Pearl Pink & Gold Luxury Style) */}
        <div className="p-4 sm:p-6 border-b border-pink-200/80 flex items-center justify-between gap-4 bg-gradient-to-r from-[#FFF0F5] via-[#FFFFFF] to-[#FFF0F5] text-slate-900 shrink-0 shadow-2xs">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#ec4899] via-[#f43f5e] to-[#ec4899] text-white flex items-center justify-center shrink-0 border border-white/80 shadow-md shadow-pink-500/20">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-left">
              <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-[#be185d] uppercase font-mono block">
                NORMATIVA OFICIAL • MESA DE SESIONES
              </span>
              <h2 className="text-lg sm:text-2xl font-serif font-black text-slate-900 tracking-tight leading-tight m-0">
                Reglas de Participación
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-pink-100 active:scale-95 text-slate-500 hover:text-pink-600 flex items-center justify-center transition cursor-pointer border border-pink-200 shrink-0 shadow-xs"
            title="Cerrar Reglas"
            aria-label="Cerrar Reglas"
            id="btn-close-reglas-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2 p-2 sm:px-4 bg-[#FFF9FB]/90 backdrop-blur-md border-b border-pink-100 shrink-0 w-full">
          <button
            type="button"
            onClick={() => setActiveTab('dinamica')}
            className={`w-full flex items-center justify-center gap-1.5 px-2 sm:px-2.5 py-2.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer text-center ${
              activeTab === 'dinamica'
                ? 'bg-gradient-to-r from-[#ec4899] via-[#e11d48] to-[#f43f5e] text-white shadow-md shadow-pink-500/25'
                : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/80'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'dinamica' ? 'text-white' : 'text-pink-500'}`} />
            <span className="truncate">Dinámica Paso a Paso</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categorias')}
            className={`w-full flex items-center justify-center gap-1.5 px-2 sm:px-2.5 py-2.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer text-center ${
              activeTab === 'categorias'
                ? 'bg-gradient-to-r from-[#ec4899] via-[#e11d48] to-[#f43f5e] text-white shadow-md shadow-pink-500/25'
                : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/80'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'categorias' ? 'text-white' : 'text-amber-500'}`} />
            <span className="truncate">Mesas y Categorías</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('requisitos')}
            className={`w-full flex items-center justify-center gap-1.5 px-2 sm:px-2.5 py-2.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer text-center ${
              activeTab === 'requisitos'
                ? 'bg-gradient-to-r from-[#ec4899] via-[#e11d48] to-[#f43f5e] text-white shadow-md shadow-pink-500/25'
                : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/80'
            }`}
          >
            <FileText className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'requisitos' ? 'text-white' : 'text-rose-500'}`} />
            <span className="truncate">Requisitos del Proyecto</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('etica')}
            className={`w-full flex items-center justify-center gap-1.5 px-2 sm:px-2.5 py-2.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer text-center ${
              activeTab === 'etica'
                ? 'bg-gradient-to-r from-[#ec4899] via-[#e11d48] to-[#f43f5e] text-white shadow-md shadow-pink-500/25'
                : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/80'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'etica' ? 'text-white' : 'text-pink-500'}`} />
            <span className="truncate">Código de Votación</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ganancias')}
            className={`w-full flex items-center justify-center gap-1.5 px-2 sm:px-2.5 py-2.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer text-center ${
              activeTab === 'ganancias'
                ? 'bg-gradient-to-r from-[#ec4899] via-[#e11d48] to-[#f43f5e] text-white shadow-md shadow-pink-500/25'
                : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/80'
            }`}
          >
            <TrendingUp className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'ganancias' ? 'text-white' : 'text-emerald-500'}`} />
            <span className="truncate">Ganancias por Rondas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('distribucion')}
            className={`w-full flex items-center justify-center gap-1.5 px-2 sm:px-2.5 py-2.5 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer text-center ${
              activeTab === 'distribucion'
                ? 'bg-gradient-to-r from-[#ec4899] via-[#e11d48] to-[#f43f5e] text-white shadow-md shadow-pink-500/25'
                : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/80'
            }`}
          >
            <Award className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'distribucion' ? 'text-white' : 'text-amber-500'}`} />
            <span className="truncate">Distribución de los Premios</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left custom-scrollbar no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          
          {/* TAB 1: DINÁMICA PASO A PASO */}
          {activeTab === 'dinamica' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-pink-50/90 via-white to-pink-50/80 border-2 border-pink-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
                <span className="text-2xl shrink-0">🎯</span>
                <div>
                  <h4 className="font-serif font-black text-slate-900 text-sm sm:text-base">Mecánica de 10 Participantes por Mesa</h4>
                  <p className="text-xs sm:text-[13px] text-slate-600 mt-1 leading-relaxed">
                    Cada ronda de financiación se celebra con exactamente <strong>10 miembros inscritos</strong>. Todos los participantes exponen su pitch en igualdad de condiciones y evalúan mutuamente los proyectos para determinar al ganador del fondo colectivo.
                  </p>
                </div>
              </div>

              {/* 4 Steps timeline in Victoria's Secret luxury styling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                
                {/* Paso 1 */}
                <div className="p-4 rounded-2xl border-2 border-pink-100/90 bg-white hover:border-pink-300 transition shadow-xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#d946ef] to-[#ec4899] text-white text-xs font-mono font-black flex items-center justify-center shadow-xs">1</span>
                    <span className="text-xs font-serif font-black text-slate-900 uppercase tracking-wide">Inscripción y Acceso</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    El usuario abona la cuota de la categoría elegida (10€, 100€, etc.). Se le asigna un asiento numerado del 1 al 10 en la mesa colectiva. La sesión inicia automáticamente al completarse los 10 puestos.
                  </p>
                </div>

                {/* Paso 2 */}
                <div className="p-4 rounded-2xl border-2 border-pink-100/90 bg-white hover:border-pink-300 transition shadow-xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#ec4899] to-[#f43f5e] text-white text-xs font-mono font-black flex items-center justify-center shadow-xs">2</span>
                    <span className="text-xs font-serif font-black text-slate-900 uppercase tracking-wide">5 Minutos de Exposición en Vivo</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cada participante cuenta con <strong>5 minutos cronometrados</strong> para defender su proyecto mediante voz en directo, cámara activa o avatar. Los demás miembros visualizan el pitch y ficha técnica.
                  </p>
                </div>

                {/* Paso 3 */}
                <div className="p-4 rounded-2xl border-2 border-pink-100/90 bg-white hover:border-pink-300 transition shadow-xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#f59e0b] to-[#d97706] text-white text-xs font-mono font-black flex items-center justify-center shadow-xs">3</span>
                    <span className="text-xs font-serif font-black text-slate-900 uppercase tracking-wide">10 Minutos para Votar</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Finalizadas las 10 exposiciones, se activa la <strong>cuenta atrás final de 10 minutos</strong>. Los participantes navegan entre los proyectos y emiten 1 voto no revocable hacia el mejor proyecto (no auto-voto).
                  </p>
                </div>

                {/* Paso 4 */}
                <div className="p-4 rounded-2xl border-2 border-pink-100/90 bg-white hover:border-pink-300 transition shadow-xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#be185d] to-[#db2777] text-white text-xs font-mono font-black flex items-center justify-center shadow-xs">4</span>
                    <span className="text-xs font-serif font-black text-slate-900 uppercase tracking-wide">Escrutinio y Entrega de Fondos</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Al completarse los 10 votos o agotarse los 10 minutos, se ejecuta el <strong>escrutinio público</strong> en pantalla. El pódium proclama al 1º, 2º y 3er puesto, transfiriendo de inmediato el fondo a la wallet ganadora.
                  </p>
                </div>

              </div>

              {/* Trazabilidad inmutable en estilo de alta costura Victoria's Secret */}
              <div className="bg-gradient-to-r from-[#1c0c16] via-[#281320] to-[#1a0a14] text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 border-2 border-pink-400/40 shadow-lg">
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-pink-400 shrink-0" />
                  <div className="text-left">
                    <strong className="text-xs sm:text-sm font-black font-serif block text-white tracking-wide">Base de Datos Independiente (REF: 1, REF: 2...)</strong>
                    <span className="text-[11px] sm:text-xs text-pink-200/80">Cada ronda genera un registro criptográfico independiente e inalterable.</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/50 text-pink-300 text-[10px] font-mono font-black shrink-0 tracking-wider shadow-xs">
                  INMUTABLE
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: MESAS Y CATEGORÍAS */}
          {activeTab === 'categorias' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs sm:text-[13px] text-slate-600">
                Las rondas están segmentadas por montos de entrada para facilitar el acceso a todo tipo de creadores, desde diseñadores emergentes hasta marcas de alta costura consolidadas:
              </p>

              <div className="space-y-2.5">
                {[
                  {
                    name: 'Round Streetwear & Urban',
                    ref: 'REF: 1',
                    fee: '10,00 €',
                    pool: '100,00 €',
                    desc: 'Sneakers, denim sostenible, upcycling y marcas emergentes de moda urbana.',
                    color: 'border-rose-300 bg-rose-50/40 text-rose-700'
                  },
                  {
                    name: 'Round Casual & Lifestyle',
                    ref: 'REF: 1',
                    fee: '100,00 €',
                    pool: '1.000,00 €',
                    desc: 'Prendas cotidianas, moda prêt-à-porter, marroquinería y e-commerce en expansión.',
                    color: 'border-blue-300 bg-blue-50/40 text-blue-700'
                  },
                  {
                    name: 'Ronda Glamour ✨',
                    ref: 'REF: 1',
                    fee: '1.000,00 €',
                    pool: '10.000,00 €',
                    desc: 'Vestidos de gala, estética alfombra roja, alta peletería y diseño de autor.',
                    color: 'border-purple-300 bg-purple-50/40 text-purple-700'
                  },
                  {
                    name: 'Ronda Elegant & Classic 🤍',
                    ref: 'REF: 1',
                    fee: '10.000,00 €',
                    pool: '100.000,00 €',
                    desc: 'Sastrería artesanal a medida, joyería fina, calzado prémium y colecciones de lujo.',
                    color: 'border-amber-300 bg-amber-50/40 text-amber-700'
                  },
                  {
                    name: 'Ronda High Fashion 👠',
                    ref: 'REF: 1',
                    fee: '100.000,00 €',
                    pool: '1.000.000,00 €',
                    desc: 'Grandes pasarelas internacionales, tecnología textil avanzada y marcas globales.',
                    color: 'border-emerald-300 bg-emerald-50/40 text-emerald-700'
                  },
                  {
                    name: 'Ronda Haute Couture 👑',
                    ref: 'REF: 1',
                    fee: '1.000.000,00 €',
                    pool: '10.000.000,00 €',
                    desc: 'Fondo exclusivo de inversión masiva para holdings internacionales de alta costura.',
                    color: 'border-yellow-400 bg-yellow-50/50 text-yellow-800'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-slate-900 text-xs sm:text-sm font-black">{item.name}</strong>
                        <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-mono font-black border ${item.color}`}>
                          {item.ref}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed max-w-lg">{item.desc}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Entrada</span>
                        <strong className="text-xs sm:text-sm font-black text-slate-800">{item.fee}</strong>
                      </div>
                      <div className="w-px h-6 bg-slate-200" />
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-rose-500 block font-mono">Pool Total</span>
                        <strong className="text-xs sm:text-sm font-black text-[#fe2c55]">{item.pool}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REQUISITOS DEL PROYECTO */}
          {activeTab === 'requisitos' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-emerald-950 text-xs sm:text-sm">Estándares de Calidad y Transparencia</h4>
                  <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                    Para asegurar que los fondos se destinen a creaciones legítimas con impacto real, cada proyecto debe cumplir con los siguientes requerimientos obligatorios antes de exponer:
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📋</span>
                    <strong className="text-xs sm:text-sm font-black text-slate-900">1. Dossier y Título de Colección</strong>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Todo proyecto debe registrar un nombre comercial claro, descripción conceptual (mínimo 100 caracteres), material textil principal y categoría de moda asignada.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📊</span>
                    <strong className="text-xs sm:text-sm font-black text-slate-900">2. Desglose Presupuestario de Fondos</strong>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Es indispensable detallar en la ficha técnica el uso proyectado del capital (p. ej., 50% materia prima y corte ecológico, 30% confección artesanal, 20% marketing y distribución digital).
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📈</span>
                    <strong className="text-xs sm:text-sm font-black text-slate-900">3. Retorno Estimado (ROI) y Beneficio para Inversores</strong>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cada ficha de proyecto debe definir una propuesta de valor tangible para la comunidad inversora, ya sea mediante participación porcentual, descuentos preferentes o preventa de la colección.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">©️</span>
                    <strong className="text-xs sm:text-sm font-black text-slate-900">4. Propiedad Intelectual 100% del Creador</strong>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    La plataforma no retiene ningún derecho sobre las marcas, bocetos, patrones ni diseños presentados. La propiedad intelectual pertenece en su totalidad al creador participante.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CÓDIGO ÉTICO Y VOTACIÓN */}
          {activeTab === 'etica' && (
            <div className="space-y-4 animate-fade-in text-left">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-amber-950 text-xs sm:text-sm">Sistema Anticorrupción y Transparencia Electoral</h4>
                  <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                    El sistema electoral de las rondas está diseñado mediante algoritmos criptográficos que garantizan votos libres, transparentes y justos.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <strong className="text-xs sm:text-sm font-black text-slate-900 block">Prohibición de Auto-Voto</strong>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ningún participante puede votar por su propio proyecto. El botón de voto se bloquea automáticamente en la ficha del participante en sesión.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <strong className="text-xs sm:text-sm font-black text-slate-900 block">Voto Único e Irrevocable</strong>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cada miembro emite exactamente 1 voto dentro de los 10 minutos de cuenta atrás. Una vez confirmado en la blockchain simulada, no puede modificarse.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <strong className="text-xs sm:text-sm font-black text-slate-900 block">Regla en caso de Empate</strong>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Si dos proyectos o más obtienen el mismo número de votos, el 80% del pool es el premio y será dividido entre los proyectos ganadores.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                  <strong className="text-xs sm:text-sm font-black text-slate-900 block">Voto Automático por Inactividad</strong>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Si un participante no emite su voto antes de que expire el cronómetro de 10 minutos, el sistema computa el escrutinio con los votos emitidos válidos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: GANANCIAS POR RONDAS */}
          {activeTab === 'ganancias' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                <span className="text-2xl shrink-0">📈</span>
                <div>
                  <h4 className="font-black text-slate-900 text-sm sm:text-base">Ganancias y Multiplicadores por Ronda</h4>
                  <p className="text-xs sm:text-[13px] text-slate-600 mt-1 leading-relaxed">
                    El <strong>80%</strong> se transfiere directamente al ganador o ganadores de la ronda (multiplicador <strong>8x</strong> de la cuota de entrada), el <strong>10%</strong> al patrocinador/es del ganador y el <strong>10%</strong> a la plataforma.
                  </p>
                </div>
              </div>

              {/* Cards for each round's profit structure */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {[
                  {
                    name: 'Streetwear & Urban',
                    fee: '10,00 €',
                    prize: '80,00 €',
                    profit: '80% (80,00 €)',
                    multiplier: '8x Retorno',
                    sponsorReward: '10,00 € (10%)',
                    color: 'border-rose-200 bg-rose-50/30 text-rose-700',
                    tag: 'Iniciación'
                  },
                  {
                    name: 'Casual & Lifestyle',
                    fee: '100,00 €',
                    prize: '800,00 €',
                    profit: '80% (800,00 €)',
                    multiplier: '8x Retorno',
                    sponsorReward: '100,00 € (10%)',
                    color: 'border-blue-200 bg-blue-50/30 text-blue-700',
                    tag: 'Crecimiento'
                  },
                  {
                    name: 'Ronda Glamour ✨',
                    fee: '1.000,00 €',
                    prize: '8.000,00 €',
                    profit: '80% (8.000,00 €)',
                    multiplier: '8x Retorno',
                    sponsorReward: '1.000,00 € (10%)',
                    color: 'border-purple-200 bg-purple-50/30 text-purple-700',
                    tag: 'Consolidación'
                  },
                  {
                    name: 'Elegant & Classic 🤍',
                    fee: '10.000,00 €',
                    prize: '80.000,00 €',
                    profit: '80% (80.000,00 €)',
                    multiplier: '8x Retorno',
                    sponsorReward: '10.000,00 € (10%)',
                    color: 'border-amber-200 bg-amber-50/30 text-amber-700',
                    tag: 'Alta Gama'
                  },
                  {
                    name: 'High Fashion 👠',
                    fee: '100.000,00 €',
                    prize: '800.000,00 €',
                    profit: '80% (800.000,00 €)',
                    multiplier: '8x Retorno',
                    sponsorReward: '100.000,00 € (10%)',
                    color: 'border-emerald-200 bg-emerald-50/30 text-emerald-700',
                    tag: 'Prestigio Global'
                  },
                  {
                    name: 'Haute Couture 👑',
                    fee: '1.000.000,00 €',
                    prize: '8.000.000,00 €',
                    profit: '80% (8.000.000,00 €)',
                    multiplier: '8x Retorno',
                    sponsorReward: '1.000.000,00 € (10%)',
                    color: 'border-yellow-300 bg-yellow-50/40 text-yellow-800',
                    tag: 'Holdings de Lujo'
                  }
                ].map((tier, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <strong className="text-xs sm:text-sm font-black text-slate-900">{tier.name}</strong>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black border ${tier.color}`}>
                        {tier.tag}
                      </span>
                    </div>

                    <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-[11px]">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Cuota entrada:</span>
                        <span className="font-bold text-slate-800">{tier.fee}</span>
                      </div>
                      <div className="flex justify-between items-center text-emerald-700 font-bold border-t border-slate-200/60 pt-1">
                        <span>Premio ganador:</span>
                        <span className="text-xs font-black text-emerald-600">{tier.prize}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-600 text-[10px]">
                        <span>Beneficio neto:</span>
                        <span className="font-black text-slate-900">{tier.profit}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span className="font-mono font-black text-[#fe2c55] bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
                        {tier.multiplier}
                      </span>
                      <span>Patrocinador: {tier.sponsorReward}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Liquidación directa callout en estilo Victoria's Secret */}
              <div className="bg-gradient-to-r from-[#1c0c16] via-[#281320] to-[#1a0a14] text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-2 border-pink-400/40 shadow-lg">
                <div className="flex items-center gap-3">
                  <Coins className="w-6 h-6 text-pink-400 shrink-0" />
                  <div className="text-left">
                    <strong className="text-xs sm:text-sm font-black font-serif block text-white tracking-wide">Abono Instantáneo a la Wallet</strong>
                    <span className="text-[11px] sm:text-xs text-pink-200/80">Las ganancias se transfieren automáticamente al finalizar la ronda sin periodos de espera ni comisiones de retiro.</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/50 text-pink-300 text-[10px] font-mono font-black shrink-0 tracking-wider shadow-xs">
                  LIQUIDACIÓN 0s
                </span>
              </div>
            </div>
          )}

          {/* TAB 6: DISTRIBUCIÓN DE LOS PREMIOS */}
          {activeTab === 'distribucion' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                <span className="text-2xl shrink-0">🏆</span>
                <div>
                  <h4 className="font-black text-slate-900 text-sm sm:text-base">Distribución del 100% del Fondo Colectivo (Pool)</h4>
                  <p className="text-xs sm:text-[13px] text-slate-600 mt-1 leading-relaxed">
                    El 100% de las aportaciones de los 10 miembros se deposita en una cuenta de custodia automatizada. El <strong>80%</strong> se transfiere directamente al ganador o ganadores de la ronda y el <strong>10%</strong> se transfiere directamente al patrocinador o patrocinadores/as de los ganadores de la ronda. La plataforma recibe el <strong>10%</strong> de cada ronda por mantener los servicios de esta plataforma.
                  </p>
                </div>
              </div>

              {/* Distribution Percentages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border-2 border-emerald-400/80 bg-emerald-50/30 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-emerald-700 tracking-wider">Ganador / Ganadores</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-black">
                      80%
                    </span>
                  </div>
                  <h5 className="text-lg font-black text-slate-900 font-mono">Fondo Ganador</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    El 80% se transfiere directamente al ganador o ganadores de la ronda para financiar la confección, producción y lanzamiento de su colección.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-blue-700 tracking-wider">Patrocinador/as</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-black border border-blue-200">
                      10%
                    </span>
                  </div>
                  <h5 className="text-lg font-black text-slate-900 font-mono">Recompensa Patrocinio</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    El 10% se transfiere directamente al patrocinador o patrocinadores/as de los ganadores de la ronda por su apoyo y compromiso directo.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-700 tracking-wider">Servicios Plataforma</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-mono text-[10px] font-black border border-amber-200">
                      10%
                    </span>
                  </div>
                  <h5 className="text-lg font-black text-slate-900 font-mono">Infraestructura & Custodia</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    La plataforma recibe el 10% de cada ronda por mantener los servicios de esta plataforma, servidores de streaming y custodia automatizada.
                  </p>
                </div>
              </div>

              {/* Special Tie-Breaker Rule Highlighted as requested */}
              <div className="p-5 rounded-2xl border-2 border-[#fe2c55]/30 bg-rose-50/50 space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#fe2c55] text-white flex items-center justify-center font-black text-xs shrink-0">⚖️</span>
                  <strong className="text-sm font-black text-slate-900">Norma Especial en Caso de Empate</strong>
                </div>
                <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                  <strong>Si dos proyectos o más obtienen el mismo número de votos</strong>, el <strong>80% del pool es el premio</strong> y será dividido entre los proyectos ganadores a partes iguales de forma completamente automatizada.
                </p>
                <div className="bg-white/80 p-3 rounded-xl border border-rose-200/60 font-mono text-[11px] text-slate-600 flex flex-col sm:flex-row justify-between gap-2">
                  <span><strong>Ejemplo Mesa 1.000 €:</strong> Pool = 10.000 €</span>
                  <span><strong>Premio 80%:</strong> 8.000 €</span>
                  <span className="text-[#fe2c55] font-black">2 empatados = 4.000 € c/u | 4 empatados = 2.000 € c/u</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer (Victoria's Secret Luxury Pearl Pink & Satin White) */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#FFF7F9] via-white to-[#FFF7F9] border-t border-pink-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-slate-700 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-pink-600" />
            <span>Normativa vigente auditada y conforme al protocolo descentralizado.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-7 py-2.5 rounded-full bg-gradient-to-r from-[#ec4899] via-[#e11d48] to-[#f43f5e] hover:brightness-105 active:scale-95 text-white font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md shadow-pink-500/30 border border-white/40"
            id="btn-confirm-reglas-modal"
          >
            Entendido, volver a las Rondas
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReglasParticipacionModal;
