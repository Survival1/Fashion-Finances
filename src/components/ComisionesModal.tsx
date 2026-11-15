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
      name: 'Round Glamour ✨',
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
      name: 'Round Elegant & Classic 🤍',
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
      name: 'Round High Fashion 👠',
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
      name: 'Round de millonarios 👑',
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
      className="fixed inset-0 z-[200] flex items-center justify-center p-[2px] sm:p-2 bg-slate-900/40 backdrop-blur-md animate-fade-in"
      id="modal-comisiones"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-gradient-to-b from-[#fffdfe] via-[#fff7fa] to-[#fdf1f6] rounded-2xl sm:rounded-[30px] w-full max-w-[calc(100vw-4px)] sm:max-w-5xl h-[calc(100dvh-4px)] sm:h-[calc(100dvh-16px)] max-h-[calc(100dvh-4px)] flex flex-col shadow-2xl border-[1.5px] border-[#d6b26f] overflow-hidden text-[#1f161b] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Luxury Blush-Pink & Gold Header */}
        <div className="p-3 sm:p-4 pb-2 shrink-0 bg-gradient-to-b from-[#fffdfd] to-transparent">
          <div className="px-4 py-3 sm:px-5 sm:py-3.5 rounded-[22px] border-[1.5px] border-[#cfa862] bg-gradient-to-r from-[#fff8fa] via-[#fffcfd] to-[#fbe4ee] flex items-center justify-between gap-4 shadow-[0_3px_14px_rgba(207,168,98,0.16)] relative overflow-hidden">
            <div className="pointer-events-none absolute -right-10 -top-10 w-44 h-44 rounded-full bg-gradient-to-bl from-[#e91e63]/20 via-[#f8bbd0]/25 to-transparent blur-xl" />

            <div className="flex items-center gap-3.5 min-w-0 relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#ff8bb8] via-[#ffb4d2] to-[#ffe1ed] text-[#2a1520] flex items-center justify-center shrink-0 border-[1.5px] border-[#d4af68] shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]">
                <Percent className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <div className="text-left min-w-0">
                <span className="text-[9.5px] sm:text-[11px] font-bold tracking-widest text-[#b80d57] uppercase block truncate">
                  POLÍTICA FINANCIERA • MÁXIMA ELEGANCIA & TRANSPARENCIA
                </span>
                <h2 className="text-lg sm:text-2xl font-serif font-bold text-[#1f161b] tracking-tight leading-tight m-0">
                  Comisiones y Reparto de Fondos
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="custom-bg relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-[#fff0f6] active:scale-95 text-[#1f161b] flex items-center justify-center transition cursor-pointer border-[1.5px] border-[#cfa862] shadow-xs shrink-0"
              title="Cerrar Comisiones"
              aria-label="Cerrar Comisiones"
              id="btn-close-comisiones-modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 pt-2 sm:px-5 sm:pb-6 sm:pt-3 space-y-5 text-left custom-scrollbar no-scrollbar scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

          {/* Hero Callout: Reparto de cada euro en una Ronda de Financiación */}
          <div className="bg-gradient-to-br from-[#fffdfd] via-[#fff4f8] to-[#f8cfe0] text-[#1f161b] rounded-[26px] p-5 sm:p-7 shadow-[0_6px_24px_rgba(207,168,98,0.14)] border-[1.5px] border-[#d6b26f] relative overflow-hidden">
            <div className="pointer-events-none absolute -top-12 -right-12 w-56 h-56 rounded-full bg-gradient-to-bl from-[#e91e63]/28 via-[#f48fb1]/20 to-transparent blur-xl" />
            <div className="pointer-events-none absolute -bottom-16 left-1/3 w-64 h-64 rounded-full bg-pink-200/25 blur-3xl" />
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 items-center gap-6">
              <div className="md:col-span-7 space-y-3 text-left">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#ffe6f0] to-[#fff5f9] text-[#a80c4c] text-[10px] font-bold uppercase tracking-wider border border-[#eb8eb5] shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#b80d57] shrink-0" />
                  <span>Sin Costes Ocultos - Custodia Escrow Certificada</span>
                </span>
                <h3 className="text-xl sm:text-[26px] font-serif font-bold tracking-tight text-[#1f161b] leading-[1.18] m-0">
                  ¿Cómo se reparte cada euro en una Ronda de Financiación?
                </h3>
                <p className="text-xs sm:text-sm text-[#2d2128] leading-relaxed">
                  El <strong className="text-[#e11d74] font-extrabold">100%</strong> de las aportaciones de los 10 miembros se deposita en una cuenta de custodia automatizada. El <strong className="text-[#e11d74] font-extrabold">80%</strong> se transfiere directamente al ganador o ganadores de la ronda y el <strong className="text-[#e11d74] font-extrabold">10%</strong> se transfiere directamente al patrocinador o patrocinadores/as de los ganadores de la ronda. La plataforma recibe el <strong className="text-[#e11d74] font-extrabold">10%</strong> de cada ronda por mantener los servicios de esta plataforma.
                </p>
              </div>

              {/* Distribution Pill Cards */}
              <div className="md:col-span-5 flex flex-col gap-3 w-full">
                <div className="px-4 sm:px-5 py-3 rounded-full bg-[#fffdfb] border-[1.5px] border-[#d8b778] shadow-[0_2px_10px_rgba(214,178,111,0.16)] flex items-center justify-between gap-3">
                  <span className="text-xs sm:text-[13px] font-bold text-[#1f161b] flex items-center gap-2.5">
                    <span className="text-base leading-none">🥇</span>
                    <span>Proyecto Ganador / Ganadores</span>
                  </span>
                  <strong className="text-[#e11d74] font-black text-sm sm:text-base shrink-0">80%</strong>
                </div>

                <div className="px-4 sm:px-5 py-3 rounded-full bg-[#fffdfb] border-[1.5px] border-[#d8b778] shadow-[0_2px_10px_rgba(214,178,111,0.16)] flex items-center justify-between gap-3">
                  <span className="text-xs sm:text-[13px] font-bold text-[#1f161b] flex items-center gap-2.5">
                    <span className="text-base leading-none">💛</span>
                    <span>Patrocinador / Patrocinadores</span>
                  </span>
                  <strong className="text-[#e11d74] font-black text-sm sm:text-base shrink-0">10%</strong>
                </div>

                <div className="px-4 sm:px-5 py-3 rounded-full bg-[#fffdfb] border-[1.5px] border-[#d8b778] shadow-[0_2px_10px_rgba(214,178,111,0.16)] flex items-center justify-between gap-3">
                  <span className="text-xs sm:text-[13px] font-bold text-[#1f161b] flex items-center gap-2.5">
                    <span className="text-base leading-none">🌸</span>
                    <span>Servicios Plataforma</span>
                  </span>
                  <strong className="text-[#e11d74] font-black text-sm sm:text-base shrink-0">10%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Calculator Section */}
          <div className="bg-gradient-to-br from-[#fffdfd] via-[#fff6fa] to-[#fae1ec] border-[1.5px] border-[#d6b26f] rounded-[26px] p-5 sm:p-7 space-y-5 shadow-[0_6px_24px_rgba(207,168,98,0.14)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-[#e5cb9a] pb-3.5">
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#b80d57] block">
                  SIMULADOR EN TIEMPO REAL
                </span>
                <h4 className="text-lg sm:text-[22px] font-serif font-bold text-[#1f161b] m-0 leading-tight">
                  Calculadora de Retorno y Comisiones por Mesa
                </h4>
              </div>
              <span className="text-xs text-[#2d2128] font-medium">Selecciona una categoría:</span>
            </div>

            {/* Category Select Buttons: 3x2 luxury grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ROUND_CATEGORIES.map((cat, idx) => {
                const isSelected = selectedCalcCategory === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedCalcCategory(idx)}
                    className={`custom-bg py-3 px-4 rounded-2xl text-center transition cursor-pointer active:scale-[0.98] flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#a80b4f] via-[#df1c72] to-[#c71565] border-[1.5px] border-[#f0cc84] text-white shadow-[0_6px_18px_rgba(209,23,104,0.28)]'
                        : 'bg-gradient-to-b from-[#fffefc] to-[#fbf7f2] hover:bg-[#fff4f8] border-[1.2px] border-[#dec28c] hover:border-[#cfa862] text-[#1f161b] shadow-2xs'
                    }`}
                  >
                    <span className={`text-xs sm:text-[13px] font-serif font-bold leading-tight truncate w-full ${isSelected ? 'text-white' : 'text-[#2d2128]'}`}>
                      {cat.name.split(' ')[1] || cat.name}
                    </span>
                    <span className={`text-base sm:text-lg font-extrabold tracking-tight ${isSelected ? 'text-white' : 'text-[#1f161b]'}`}>
                      {cat.fee.toLocaleString('es-ES')} €
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Calculation Result Cards: 3 Primary Columns matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-center">
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#fffefc] to-[#fbf7f2] border-[1.2px] border-[#dec28c] shadow-2xs flex flex-col items-center justify-center gap-1">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#2d2128] block">
                  CUOTA INDIVIDUAL
                </span>
                <strong className="text-2xl sm:text-[28px] font-black text-[#1f161b] leading-none my-0.5">
                  {currentCalc.fee.toLocaleString('es-ES')} €
                </strong>
                <span className="text-[11px] text-[#3d2d36] font-medium block">10 miembros</span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#fffefc] to-[#fbf7f2] border-[1.2px] border-[#dec28c] shadow-2xs flex flex-col items-center justify-center gap-1">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#2d2128] block">
                  FONDO TOTAL (POOL)
                </span>
                <strong className="text-2xl sm:text-[28px] font-black text-[#1f161b] leading-none my-0.5">
                  {currentCalc.pool.toLocaleString('es-ES')} €
                </strong>
                <span className="text-[11px] text-[#15803d] font-bold block">100% recaudado</span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#fff4f8] via-[#ffe2ee] to-[#ffd2e4] border-[1.5px] border-[#cfa355] shadow-[0_4px_16px_rgba(225,29,116,0.14)] flex flex-col items-center justify-center gap-1">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#4a1830] block">
                  PREMIO GANADOR/ES
                </span>
                <strong className="text-2xl sm:text-[30px] font-black text-[#e11d74] leading-none my-0.5">
                  {currentCalc.winnerPrize.toLocaleString('es-ES')} €
                </strong>
                <span className="text-[11px] text-[#880e4f] font-bold block">
                  80% del Pool • ¡x8!
                </span>
              </div>
            </div>

            {/* Secondary breakdown strip for Sponsor & Platform */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
              <div className="px-4 py-2.5 rounded-2xl bg-[#fffdfb]/90 border border-[#e3c894] flex items-center justify-between gap-3 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4a1830]">
                  💛 Patrocinador/es (10% del Pool)
                </span>
                <strong className="text-sm sm:text-base font-black text-[#e11d74]">
                  {currentCalc.sponsorPrize.toLocaleString('es-ES')} €
                </strong>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-[#fffdfb]/90 border border-[#e3c894] flex items-center justify-between gap-3 shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4a1830]">
                  🌸 Comisión Plataforma (10% servicios)
                </span>
                <strong className="text-sm sm:text-base font-black text-[#e11d74]">
                  {currentCalc.platformFee.toLocaleString('es-ES')} €
                </strong>
              </div>
            </div>
          </div>

          {/* Table of Benefits by Referral Volume across all Investment Rounds */}
          <div className="bg-gradient-to-br from-[#fffdfd] via-[#fff7fa] to-[#fce7f0] border-[1.5px] border-[#d6b26f] rounded-[26px] p-5 sm:p-6 space-y-4 text-left shadow-[0_4px_18px_rgba(207,168,98,0.12)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e5cb9a] pb-3.5">
              <div className="max-w-sm sm:max-w-[440px] text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#b80d57] block">
                  MODELO DE PATROCINIO & INGRESOS PASIVOS
                </span>
                <h4 className="text-base sm:text-lg font-serif font-bold text-[#1f161b] m-0 flex items-center gap-2 flex-wrap">
                  <span>📈 Beneficios por Volumen de Referidos</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ffe6f0] text-[#b80d57] text-[10px] font-bold border border-[#eb8eb5]">
                    10% del Pool
                  </span>
                </h4>
                <p className="text-xs text-[#3d2d36] mt-1 leading-relaxed">
                  Cálculo basado en <strong>5 participaciones diarias por referido</strong> en las distintas mesas de inversión (con un promedio de <strong>5 victorias diarias</strong> por cada 10 referidos en mesas de 10 participantes).
                </p>
              </div>

              {/* Selector Tabs */}
              <div className="flex flex-col gap-1.5 p-2 bg-[#fff9fb] rounded-2xl border border-[#dec28c] w-full sm:w-56 shrink-0 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#b80d57] px-2 pt-0.5 pb-0.5">
                  Seleccionar Volumen:
                </span>
                
                {[
                  { tier: 10 as const, label: '10 Referidos', plays: '50/día' },
                  { tier: 100 as const, label: '100 Referidos', plays: '500/día' },
                  { tier: 1000 as const, label: '1.000 Referidos', plays: '5.000/día' }
                ].map((item) => {
                  const active = selectedReferralTier === item.tier;
                  return (
                    <button
                      key={item.tier}
                      type="button"
                      onClick={() => setSelectedReferralTier(item.tier)}
                      className={`custom-bg w-full px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between gap-2 text-left ${
                        active
                          ? 'bg-gradient-to-r from-[#b80c57] to-[#e11d74] text-white shadow-xs border border-[#f0cc84]'
                          : 'text-[#2d2128] hover:text-[#b80d57] hover:bg-pink-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Users className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-white' : 'text-[#b80d57]'}`} />
                        <span>{item.label}</span>
                      </div>
                      <span className={`text-[10px] font-bold ${active ? 'text-pink-100' : 'text-slate-400'}`}>{item.plays}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Render tables based on selection */}
            <div className="space-y-4">
              {REFERRAL_SCENARIOS
                .filter(scen => selectedReferralTier === scen.referralsCount)
                .map((scen) => (
                  <div key={scen.referralsCount} className="space-y-3 bg-[#fffdfb] p-4 rounded-2xl border border-[#e3c894] shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#f3e1ec]">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-3 py-1 rounded-xl text-xs font-bold border border-[#eb8eb5] bg-[#ffe6f0] text-[#a80c4c]">
                          👥 {scen.label}
                        </span>
                        <span className="text-xs font-semibold text-[#2d2128]">
                          • {scen.totalDailyPlays.toLocaleString('es-ES')} participaciones diarias ({scen.dailyPlaysPerRef} al día por usuario)
                        </span>
                      </div>
                      <div className="text-[11px] text-[#3d2d36]">
                        Victorias promedio: <strong className="text-[#e11d74] font-black">{scen.dailyWinsEstimated.toLocaleString('es-ES')} al día</strong>
                      </div>
                    </div>

                    <div className="border border-[#dec28c] rounded-2xl overflow-hidden shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-gradient-to-r from-[#fff4f8] via-[#fffafc] to-[#fbe4ee] border-b border-[#dec28c] text-[#4a1830] uppercase text-[10px] tracking-wider">
                            <tr>
                              <th className="py-3.5 px-3 sm:px-4 font-bold">Ronda de Inversión</th>
                              <th className="py-3.5 px-3 sm:px-4 font-bold text-right">Cuota Mesa</th>
                              <th className="py-3.5 px-3 sm:px-4 font-bold text-right text-[#b80d57]">Comisión / Victoria (10%)</th>
                              <th className="py-3.5 px-3 sm:px-4 font-bold text-right bg-pink-50/60">Beneficio Diario</th>
                              <th className="py-3.5 px-3 sm:px-4 font-bold text-right bg-pink-100/50 text-[#a80c4c]">Beneficio Mensual (30d)</th>
                              <th className="py-3.5 px-3 sm:px-4 font-bold text-right text-[#e11d74]">Beneficio Anual (12m)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#f5e6ef] bg-white">
                            {ROUND_CATEGORIES.map((row, i) => {
                              const dailyProfit = scen.dailyWinsEstimated * row.sponsorPrize;
                              const monthlyProfit = dailyProfit * 30;
                              const annualProfit = monthlyProfit * 12;
                              return (
                                <tr key={i} className="hover:bg-[#fff5f9] transition">
                                  <td className="py-3 px-3 sm:px-4 font-bold text-[#1f161b]">
                                    {row.name}
                                  </td>
                                  <td className="py-3 px-3 sm:px-4 font-bold text-right text-[#2d2128]">
                                    {row.fee.toLocaleString('es-ES')} €
                                  </td>
                                  <td className="py-3 px-3 sm:px-4 font-bold text-right text-[#b80d57] bg-pink-50/20">
                                    {row.sponsorPrize.toLocaleString('es-ES')} €
                                  </td>
                                  <td className="py-3 px-3 sm:px-4 font-black text-right text-[#1f161b] bg-pink-50/35">
                                    {dailyProfit.toLocaleString('es-ES')} €
                                  </td>
                                  <td className="py-3 px-3 sm:px-4 font-black text-right text-[#b80d57] bg-pink-50/60">
                                    {monthlyProfit.toLocaleString('es-ES')} €
                                  </td>
                                  <td className="py-3 px-3 sm:px-4 font-black text-right text-[#e11d74] bg-pink-100/30">
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
            <div className="bg-gradient-to-r from-[#fff4f8] via-[#fffafc] to-[#fbe4ee] p-3.5 rounded-2xl border border-[#dec28c] text-[#2d2128] text-xs flex items-start gap-2.5 shadow-2xs">
              <span className="text-base shrink-0 mt-0.5">💡</span>
              <p className="leading-relaxed">
                <strong>¿Cómo se calcula este beneficio?</strong> Cada mesa de inversión está compuesta por exactamente 10 miembros. Con un promedio de <strong>5 participaciones diarias por referido</strong> (50 jugadas al día con 10 referidos), se obtienen <strong>5 victorias estimadas al día</strong> (1 de cada 10 miembros gana la mesa). Al recibir el patrocinador el <strong>10% del pool por cada victoria</strong> (importe equivalente al 100% de la cuota de la ronda), el patrocinador percibe 5 cuotas completas de comisión al día por cada 10 referidos activos.
              </p>
            </div>
          </div>

          {/* What does the platform fee cover? */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs font-bold text-[#b80d57] uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#cfa862]" />
              <span>¿Qué incluye la comisión de la plataforma?</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl border border-[#dec28c] bg-[#fffdfb] hover:border-[#cfa862] transition-all duration-200 space-y-2 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-[#ffe6f0] text-[#b80d57] border border-[#eb8eb5] flex items-center justify-center mb-1">
                  <Server className="w-4 h-4" />
                </div>
                <strong className="text-xs font-bold text-[#1f161b] block">Streaming y Voz en Vivo</strong>
                <p className="text-[11px] text-[#3d2d36] leading-relaxed">
                  Infraestructura de alta velocidad para transmisión de voz, vídeo y sincronización en tiempo real de los 10 participantes sin retardo.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#dec28c] bg-[#fffdfb] hover:border-[#cfa862] transition-all duration-200 space-y-2 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-[#ffe6f0] text-[#b80d57] border border-[#eb8eb5] flex items-center justify-center mb-1">
                  <Wallet className="w-4 h-4" />
                </div>
                <strong className="text-xs font-bold text-[#1f161b] block">Pasarela y Custodia Segura</strong>
                <p className="text-[11px] text-[#3d2d36] leading-relaxed">
                  Pagos cifrados y custodia en cuenta escrow auditada. No cobramos comisiones por retirada ni por traspaso a tu cuenta bancaria o wallet.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#dec28c] bg-[#fffdfb] hover:border-[#cfa862] transition-all duration-200 space-y-2 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-[#ffe6f0] text-[#b80d57] border border-[#eb8eb5] flex items-center justify-center mb-1">
                  <Building2 className="w-4 h-4" />
                </div>
                <strong className="text-xs font-bold text-[#1f161b] block">Auditoría y Soporte Legal</strong>
                <p className="text-[11px] text-[#3d2d36] leading-relaxed">
                  Escrutinio descentralizado certificado, archivo inmutable de la ronda y facturación oficial para la justificación de fondos y premios.
                </p>
              </div>
            </div>
          </div>

          {/* Refund guarantee notice */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#fff4f8] via-[#fffafc] to-[#fbe4ee] text-[#1f161b] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-[1.5px] border-[#d6b26f] shadow-xs">
            <div className="flex items-center gap-3.5 text-left">
              <span className="text-2xl">🤝</span>
              <div>
                <strong className="text-xs sm:text-sm font-bold block text-[#1f161b]">Garantía de Devolución del 100%</strong>
                <p className="text-[11px] text-[#3d2d36] mt-0.5">
                  Si una mesa no reúne a sus 10 participantes o se cancela la convocatoria, se reembolsa el 100% de la cuota de forma inmediata y automática, sin ninguna deducción ni comisión.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#ffe6f0] text-[#a80c4c] border border-[#eb8eb5] text-[10px] font-bold shrink-0 self-start sm:self-center">
              0% COMISIÓN EN CANCELACIÓN
            </span>
          </div>

        </div>

        {/* Luxury Footer */}
        <div className="p-4 sm:px-6 sm:py-4 bg-gradient-to-r from-[#fff6fa] via-[#fffdfd] to-[#fbe7f0] border-t border-[#e5cb9a] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-[#2d2128]">
          <div className="flex items-center gap-2 text-xs font-medium">
            <Sparkles className="w-4 h-4 text-[#e11d74] shrink-0" />
            <span>Condiciones financieras de máxima elegancia y transparencia, sin tarifas ocultas ni costes por retiro.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="custom-bg w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#a80b4f] via-[#df1c72] to-[#c71565] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer border border-[#f0cc84] shadow-md"
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
