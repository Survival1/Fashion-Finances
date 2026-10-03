import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  Percent, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Wallet, 
  Building2, 
  Server, 
  ArrowRight,
  HelpCircle,
  Sparkles,
  PieChart,
  DollarSign,
  Users
} from 'lucide-react';

interface ComisionesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComisionesModal: React.FC<ComisionesModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedCalcCategory, setSelectedCalcCategory] = useState<number>(0);
  const [selectedReferralTier, setSelectedReferralTier] = useState<10 | 100 | 1000>(10);

  const REFERRAL_SCENARIOS = [
    {
      referralsCount: 10,
      dailyPlaysPerRef: 5,
      totalDailyPlays: 50,
      dailyWinsEstimated: 5,
      label: '10 Referidos',
      sublabel: '50 participaciones / día',
      badgeColor: 'border-rose-200 bg-rose-50 text-rose-700'
    },
    {
      referralsCount: 100,
      dailyPlaysPerRef: 5,
      totalDailyPlays: 500,
      dailyWinsEstimated: 50,
      label: '100 Referidos',
      sublabel: '500 participaciones / día',
      badgeColor: 'border-blue-200 bg-blue-50 text-blue-700'
    },
    {
      referralsCount: 1000,
      dailyPlaysPerRef: 5,
      totalDailyPlays: 5000,
      dailyWinsEstimated: 500,
      label: '1.000 Referidos',
      sublabel: '5.000 participaciones / día',
      badgeColor: 'border-emerald-200 bg-emerald-50 text-emerald-700'
    }
  ];

  const ROUND_CATEGORIES = [
    {
      name: 'Round Streetwear & Urban',
      fee: 10,
      members: 10,
      pool: 100,
      winnerSharePct: 80,
      winnerPrize: 80,
      sponsorPrize: 10,
      secondPlacePrize: 10,
      platformFee: 10,
      platformPct: 10,
      color: 'rose'
    },
    {
      name: 'Round Casual & Lifestyle',
      fee: 100,
      members: 10,
      pool: 1000,
      winnerSharePct: 80,
      winnerPrize: 800,
      sponsorPrize: 100,
      secondPlacePrize: 100,
      platformFee: 100,
      platformPct: 10,
      color: 'blue'
    },
    {
      name: 'Ronda Glamour ✨',
      fee: 1000,
      members: 10,
      pool: 10000,
      winnerSharePct: 80,
      winnerPrize: 8000,
      sponsorPrize: 1000,
      secondPlacePrize: 1000,
      platformFee: 1000,
      platformPct: 10,
      color: 'purple'
    },
    {
      name: 'Ronda Elegant & Classic 🤍',
      fee: 10000,
      members: 10,
      pool: 100000,
      winnerSharePct: 80,
      winnerPrize: 80000,
      sponsorPrize: 10000,
      secondPlacePrize: 10000,
      platformFee: 10000,
      platformPct: 10,
      color: 'amber'
    },
    {
      name: 'Ronda High Fashion 👠',
      fee: 100000,
      members: 10,
      pool: 1000000,
      winnerSharePct: 80,
      winnerPrize: 800000,
      sponsorPrize: 100000,
      secondPlacePrize: 100000,
      platformFee: 100000,
      platformPct: 10,
      color: 'emerald'
    },
    {
      name: 'Ronda Haute Couture 👑',
      fee: 1000000,
      members: 10,
      pool: 10000000,
      winnerSharePct: 80,
      winnerPrize: 8000000,
      sponsorPrize: 1000000,
      secondPlacePrize: 1000000,
      platformFee: 1000000,
      platformPct: 10,
      color: 'yellow'
    }
  ];

  const currentCalc = ROUND_CATEGORIES[selectedCalcCategory] || ROUND_CATEGORIES[0];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-[1px] bg-slate-950/80 backdrop-blur-md animate-fade-in"
      id="modal-comisiones"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[calc(100vw-2px)] h-[calc(100dvh-2px)] max-h-[calc(100dvh-2px)] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 flex items-center justify-between gap-4 bg-gradient-to-r from-slate-950 via-[#0f172a] to-slate-950 text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/25 shadow-sm">
              <Percent className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-left">
              <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-amber-400 uppercase font-mono block">
                POLÍTICA FINANCIERA • MÁXIMA ELEGANCIA & TRANSPARENCIA
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight m-0">
                Comisiones y Reparto de Fondos
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer border border-slate-700/80 shrink-0"
            title="Cerrar Comisiones"
            aria-label="Cerrar Comisiones"
            id="btn-close-comisiones-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-left custom-scrollbar no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-[#fbfbfa]">

          {/* Hero Callout: 100% Transparent Pool */}
          <div className="bg-gradient-to-br from-[#0c1222] via-[#0f172a] to-[#0a0e1a] text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-amber-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-xl text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 font-mono text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sin Costes Ocultos • Custodia Escrow Certificada</span>
                </span>
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-white m-0">
                  ¿Cómo se reparte cada euro en una Ronda de Financiación?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  El 100% de las aportaciones de los 10 miembros se deposita en una cuenta de custodia automatizada. El <strong className="text-emerald-400 font-black">80%</strong> se transfiere directamente al ganador o ganadores de la ronda y el <strong className="text-indigo-300 font-black">10%</strong> se transfiere directamente al patrocinador o patrocinadores/as de los ganadores de la ronda. La plataforma recibe el <strong className="text-amber-400 font-black">10%</strong> de cada ronda por mantener los servicios de esta plataforma.
                </p>
              </div>

              {/* Mini distribution pill cards */}
              <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                <div className="px-4 py-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-emerald-500/30 shadow-xs flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="text-sm">🥇</span> Proyecto Ganador / Ganadores
                  </span>
                  <strong className="text-emerald-400 font-mono font-black text-sm">80%</strong>
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-indigo-500/30 shadow-xs flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="text-sm">🤝</span> Patrocinador / Patrocinadores
                  </span>
                  <strong className="text-indigo-400 font-mono font-black text-sm">10%</strong>
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-amber-500/30 shadow-xs flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="text-sm">⚙️</span> Servicios Plataforma
                  </span>
                  <strong className="text-amber-400 font-mono font-black text-sm">10%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Section */}
          <div className="bg-gradient-to-b from-[#faf9f6] via-white to-[#f8f9fc] border border-slate-200/90 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 font-mono block">SIMULADOR EN TIEMPO REAL</span>
                <h4 className="text-base font-black text-slate-900 m-0">Calculadora de Retorno y Comisiones por Mesa</h4>
              </div>
              <span className="text-xs text-slate-500 font-medium">Selecciona una categoría:</span>
            </div>

            {/* Category Select Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {ROUND_CATEGORIES.map((cat, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedCalcCategory(idx)}
                  className={`p-2.5 rounded-2xl border text-center transition cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-1 shadow-2xs ${
                    selectedCalcCategory === idx
                      ? 'bg-slate-950 border-amber-400 text-amber-300 shadow-md ring-2 ring-amber-400/30 font-black'
                      : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700 font-bold hover:text-slate-900'
                  }`}
                >
                  <span className="text-[10px] sm:text-[11px] leading-tight truncate w-full font-black">
                    {cat.name.split(' ')[1] || cat.name}
                  </span>
                  <span className={`text-xs sm:text-sm font-mono font-black ${selectedCalcCategory === idx ? 'text-amber-300' : 'text-slate-900'}`}>
                    {cat.fee.toLocaleString('es-ES')} €
                  </span>
                </button>
              ))}
            </div>

            {/* Live Calculation Result Grid */}
            <div className="bg-gradient-to-r from-slate-100/90 via-white to-amber-50/40 rounded-2xl p-4 border border-slate-200/90 shadow-xs grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono">Cuota Individual</span>
                <strong className="text-base sm:text-lg font-black text-slate-900 font-mono">
                  {currentCalc.fee.toLocaleString('es-ES')} €
                </strong>
                <span className="text-[10px] text-slate-400 block font-medium">10 miembros</span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block font-mono">Fondo Total (Pool)</span>
                <strong className="text-base sm:text-lg font-black text-slate-900 font-mono">
                  {currentCalc.pool.toLocaleString('es-ES')} €
                </strong>
                <span className="text-[10px] text-emerald-600 font-bold block">100% recaudado</span>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-b from-emerald-50/90 to-emerald-100/40 border border-emerald-300/80 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block font-mono">Premio Ganador/es</span>
                <strong className="text-base sm:text-xl font-black text-emerald-600 font-mono">
                  {currentCalc.winnerPrize.toLocaleString('es-ES')} €
                </strong>
                <span className="text-[10px] text-emerald-700 font-black block font-mono">
                  80% del Pool • ¡x8!
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-b from-indigo-50/90 to-indigo-100/40 border border-indigo-300/80 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 block font-mono">Patrocinador/es</span>
                <strong className="text-base sm:text-lg font-black text-indigo-600 font-mono">
                  {currentCalc.sponsorPrize.toLocaleString('es-ES')} €
                </strong>
                <span className="text-[10px] text-indigo-700 font-bold block font-mono">
                  10% del Pool
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-b from-amber-50/90 to-amber-100/40 border border-amber-300/80 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block font-mono">Comisión Plataforma</span>
                <strong className="text-base sm:text-lg font-black text-amber-600 font-mono">
                  {currentCalc.platformFee.toLocaleString('es-ES')} €
                </strong>
                <span className="text-[10px] text-amber-700 font-bold block font-mono">
                  10% por servicios
                </span>
              </div>
            </div>
          </div>

          {/* Table of Benefits by Referral Volume across all Investment Rounds */}
          <div className="space-y-4 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
              <div className="max-w-sm sm:max-w-[420px] text-left">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 font-mono block">
                  MODELO DE PATROCINIO & INGRESOS PASIVOS
                </span>
                <h4 className="text-base font-black text-slate-900 m-0 flex items-center gap-2 flex-wrap">
                  <span>📈 Beneficios por Volumen de Referidos</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[10px] font-mono font-black border border-indigo-200/80">
                    10% del Pool
                  </span>
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Cálculo basado en <strong>5 participaciones diarias por referido</strong> en las distintas mesas de inversión (con un promedio de <strong>5 victorias diarias</strong> por cada 10 referidos en mesas de 10 participantes).
                </p>
              </div>

              {/* Selector Tabs in a Vertical Column */}
              <div className="flex flex-col gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/90 w-full sm:w-56 shrink-0 shadow-2xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono px-2 pt-1 pb-0.5">
                  Seleccionar Volumen:
                </span>
                
                <button
                  type="button"
                  onClick={() => setSelectedReferralTier(10)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-between gap-2 text-left ${
                    selectedReferralTier === 10
                      ? 'bg-slate-900 text-white shadow-xs border border-slate-800 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className={`w-3.5 h-3.5 shrink-0 ${selectedReferralTier === 10 ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>10 Referidos</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${selectedReferralTier === 10 ? 'text-amber-300' : 'text-slate-400'}`}>50/día</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReferralTier(100)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-between gap-2 text-left ${
                    selectedReferralTier === 100
                      ? 'bg-slate-900 text-white shadow-xs border border-slate-800 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className={`w-3.5 h-3.5 shrink-0 ${selectedReferralTier === 100 ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>100 Referidos</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${selectedReferralTier === 100 ? 'text-amber-300' : 'text-slate-400'}`}>500/día</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReferralTier(1000)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-between gap-2 text-left ${
                    selectedReferralTier === 1000
                      ? 'bg-slate-900 text-white shadow-xs border border-slate-800 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className={`w-3.5 h-3.5 shrink-0 ${selectedReferralTier === 1000 ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>1.000 Referidos</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${selectedReferralTier === 1000 ? 'text-amber-300' : 'text-slate-400'}`}>5.000/día</span>
                </button>
              </div>
            </div>

            {/* Render tables based on selection */}
            <div className="space-y-6">
              {REFERRAL_SCENARIOS
                .filter(scen => selectedReferralTier === scen.referralsCount)
                .map((scen) => (
                  <div key={scen.referralsCount} className="space-y-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-3 py-1 rounded-xl text-xs font-black font-mono border border-slate-900 bg-slate-900 text-amber-300 shadow-xs">
                          👥 {scen.label}
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          • {scen.totalDailyPlays.toLocaleString('es-ES')} participaciones diarias ({scen.dailyPlaysPerRef} al día por usuario)
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Victorias promedio: <strong className="text-emerald-600 font-black">{scen.dailyWinsEstimated.toLocaleString('es-ES')} al día</strong>
                      </div>
                    </div>

                    <div className="border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-900 border-b border-slate-800 text-slate-200 uppercase font-mono text-[10px] tracking-wider">
                            <tr>
                              <th className="py-3.5 px-3 sm:px-4 font-black">Ronda de Inversión</th>
                              <th className="py-3.5 px-3 sm:px-4 font-black text-right">Cuota Mesa</th>
                              <th className="py-3.5 px-3 sm:px-4 font-black text-right text-indigo-300">Comisión / Victoria (10%)</th>
                              <th className="py-3.5 px-3 sm:px-4 font-black text-right text-emerald-400 bg-slate-800/60">Beneficio Diario</th>
                              <th className="py-3.5 px-3 sm:px-4 font-black text-right text-emerald-300 bg-slate-800/90 font-black">Beneficio Mensual (30d)</th>
                              <th className="py-3.5 px-3 sm:px-4 font-black text-right text-amber-300">Beneficio Anual (12m)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white">
                            {ROUND_CATEGORIES.map((row, i) => {
                              const dailyProfit = scen.dailyWinsEstimated * row.sponsorPrize;
                              const monthlyProfit = dailyProfit * 30;
                              const annualProfit = monthlyProfit * 12;
                              return (
                                <tr key={i} className="hover:bg-amber-50/20 transition">
                                  <td className="py-3 px-3 sm:px-4 font-bold text-slate-900">
                                    {row.name}
                                  </td>
                                  <td className="py-3 px-3 sm:px-4 font-mono font-bold text-right text-slate-700">
                                    {row.fee.toLocaleString('es-ES')} €
                                  </td>
                                  <td className="py-3 px-3 sm:px-4 font-mono font-bold text-right text-indigo-700 bg-indigo-50/25">
                                    {row.sponsorPrize.toLocaleString('es-ES')} €
                                  </td>
                                  <td className="py-3 px-3 sm:px-4 font-mono font-black text-right text-emerald-700 bg-emerald-50/30">
                                    {dailyProfit.toLocaleString('es-ES')} €
                                  </td>
                                  <td className="py-3 px-3 sm:px-4 font-mono font-black text-right text-emerald-800 bg-emerald-50/60 font-black">
                                    {monthlyProfit.toLocaleString('es-ES')} €
                                  </td>
                                  <td className="py-3 px-3 sm:px-4 font-mono font-black text-right text-amber-700 bg-amber-50/20">
                                    {annualProfit.toLocaleString('es-ES')} €
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Formula Explanatory Box */}
            <div className="bg-gradient-to-r from-amber-50/50 via-slate-50 to-indigo-50/40 p-3.5 rounded-2xl border border-amber-200/60 text-slate-700 text-xs flex items-start gap-2.5 shadow-2xs">
              <span className="text-base shrink-0 mt-0.5">💡</span>
              <p className="leading-relaxed">
                <strong>¿Cómo se calcula este beneficio?</strong> Cada mesa de inversión está compuesta por exactamente 10 miembros. Con un promedio de <strong>5 participaciones diarias por referido</strong> (50 jugadas al día con 10 referidos), se obtienen <strong>5 victorias estimadas al día</strong> (1 de cada 10 miembros gana la mesa). Al recibir el patrocinador el <strong>10% del pool por cada victoria</strong> (importe equivalente al 100% de la cuota de la ronda), el patrocinador percibe 5 cuotas completas de comisión al día por cada 10 referidos activos.
              </p>
            </div>
          </div>

          {/* What does the platform fee cover? */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest font-mono flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>¿Qué incluye la comisión de la plataforma?</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-amber-400/50 transition-all duration-200 space-y-2 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center mb-1">
                  <Server className="w-4 h-4" />
                </div>
                <strong className="text-xs font-black text-slate-900 block">Streaming y Voz en Vivo</strong>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Infraestructura de alta velocidad para transmisión de voz, vídeo y sincronización en tiempo real de los 10 participantes sin retardo.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-amber-400/50 transition-all duration-200 space-y-2 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center mb-1">
                  <Wallet className="w-4 h-4" />
                </div>
                <strong className="text-xs font-black text-slate-900 block">Pasarela y Custodia Segura</strong>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Pagos cifrados y custodia en cuenta escrow auditada. No cobramos comisiones por retirada ni por traspaso a tu cuenta bancaria o wallet.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-amber-400/50 transition-all duration-200 space-y-2 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center mb-1">
                  <Building2 className="w-4 h-4" />
                </div>
                <strong className="text-xs font-black text-slate-900 block">Auditoría y Soporte Legal</strong>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Escrutinio descentralizado certificado, archivo inmutable de la ronda y facturación oficial para la justificación de fondos y premios.
                </p>
              </div>
            </div>
          </div>

          {/* Refund guarantee notice */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-between gap-4 border border-amber-500/30 shadow-md">
            <div className="flex items-center gap-3.5 text-left">
              <span className="text-2xl">🤝</span>
              <div>
                <strong className="text-xs sm:text-sm font-black block text-amber-300">Garantía de Devolución del 100%</strong>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Si una mesa no reúne a sus 10 participantes o se cancela la convocatoria, se reembolsa el 100% de la cuota de forma inmediata y automática, sin ninguna deducción ni comisión.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-black shrink-0">
              0% COMISIÓN EN CANCELACIÓN
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-slate-300">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Condiciones financieras de máxima elegancia y transparencia, sin tarifas ocultas ni costes por retiro.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-md hover:shadow-lg"
            id="btn-confirm-comisiones-modal"
          >
            Entendido, volver a las Rondas
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComisionesModal;
