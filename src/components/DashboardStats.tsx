/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FinancialMovement, ModelProfile } from '../types';
import { TrendingUp, ArrowUpRight, ArrowDownLeft, Award, Percent, Users, Landmark, Wallet, Layers, Store, Gift, UserCheck, UserPlus, Eye, Globe } from 'lucide-react';

interface DashboardStatsProps {
  movements: FinancialMovement[];
  models: ModelProfile[];
  patrocinadorId: string;
  balance: number;
  totalEarnings: number;
  totalInvested: number;
  totalCommissions: number;
  onSelectModel?: (model: ModelProfile) => void;
  friendsCount?: number;
  followersCount?: number;
  followingCount?: number;
  referralsOnlineCount?: number;
  isVisitor?: boolean;
}

export default function DashboardStats({
  movements: initialMovements,
  models,
  patrocinadorId,
  balance: rawBalance,
  totalEarnings: rawTotalEarnings,
  totalInvested: rawTotalInvested,
  totalCommissions: rawTotalCommissions,
  onSelectModel,
  friendsCount: rawFriendsCount = 0,
  followersCount: rawFollowersCount = 0,
  followingCount: rawFollowingCount = 0,
  referralsOnlineCount: rawReferralsOnlineCount = 0,
  isVisitor = false
}: DashboardStatsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'charts'>('overview');

  const movements = isVisitor ? [] : initialMovements;
  const balance = isVisitor ? 0 : rawBalance;
  const totalEarnings = isVisitor ? 0 : rawTotalEarnings;
  const totalInvested = isVisitor ? 0 : rawTotalInvested;
  const totalCommissions = isVisitor ? 0 : rawTotalCommissions;
  const friendsCount = isVisitor ? 0 : rawFriendsCount;
  const followersCount = isVisitor ? 0 : rawFollowersCount;
  const followingCount = isVisitor ? 0 : rawFollowingCount;
  const referralsOnlineCount = isVisitor ? 0 : rawReferralsOnlineCount;

  const sponsorModel = isVisitor ? undefined : models.find(m => m.id === patrocinadorId);

  // Compute metrics
  const depositTotal = isVisitor ? 0 : movements.filter(m => m.type === 'deposit').reduce((sum, m) => sum + m.amount, 0);
  const withdrawalTotal = isVisitor ? 0 : movements.filter(m => m.type === 'withdrawal').reduce((sum, m) => sum + Math.abs(m.amount), 0);
  const prizeTotal = isVisitor ? 0 : movements.filter(m => m.type === 'prize').reduce((sum, m) => sum + m.amount, 0);
  
  // Total profit or net benefits
  const netProfit = isVisitor ? 0 : totalEarnings + totalCommissions - totalInvested;

  // Compute shop sales and user gifts
  const storeSalesBase = isVisitor ? 0 : 430.00;
  const storeSalesFromMovements = isVisitor ? 0 : movements
    .filter(m => m.description.toLowerCase().includes('tienda') || m.description.toLowerCase().includes('boutique') || m.description.toLowerCase().includes('compra'))
    .reduce((sum, m) => sum + Math.abs(m.amount), 0);
  const totalStoreSales = storeSalesBase + storeSalesFromMovements;

  const userGiftsBase = isVisitor ? 0 : 180.00;
  const userGiftsFromMovements = isVisitor ? 0 : movements
    .filter(m => m.description.toLowerCase().includes('regalo') || m.description.toLowerCase().includes('rosa') || m.description.toLowerCase().includes('perfume') || m.description.toLowerCase().includes('helado'))
    .reduce((sum, m) => sum + Math.abs(m.amount), 0);
  const totalUserGifts = userGiftsBase + userGiftsFromMovements;

  // Render elegant custom SVG line chart for Balance Evolution
  // Let's draft coordinate points for 6 months (Jan - Jun) based on transaction data
  const chartPoints = [
    { month: 'Ene', balance: 0, invested: 0 },
    { month: 'Feb', balance: 50, invested: 10 },
    { month: 'Mar', balance: 40, invested: 20 },
    { month: 'Abr', balance: 90, invested: 30 },
    { month: 'May', balance: balance, invested: totalInvested }
  ];

  // Helper values for SVG heights
  const chartWidth = 500;
  const chartHeight = 180;
  const maxVal = Math.max(...chartPoints.map(p => p.balance), 120);

  // Translate points to SVG path format on scale
  const linePath = chartPoints
    .map((p, index) => {
      const x = (index / (chartPoints.length - 1)) * (chartWidth - 40) + 20;
      const y = chartHeight - ((p.balance / maxVal) * (chartHeight - 40) + 20);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaPath = chartPoints.length > 0 ? `
    ${linePath} 
    L ${(chartPoints.length - 1) / (chartPoints.length - 1) * (chartWidth - 40) + 20} ${chartHeight - 10} 
    L 20 ${chartHeight - 10} Z
  ` : '';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:border-slate-200 transition-all">
      {/* Upper Metrics Header */}
      <div className="border-b border-slate-100 bg-slate-50/50 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 tracking-tight font-display">Portafolio Financiero</h2>
          <p className="text-xs text-slate-500">Monitorea tus inversiones, dividendos y comisiones de afiliación.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg self-start sm:self-center">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'overview' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Resumen General
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'charts' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Gráficos de Análisis
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="p-6 space-y-6">
          {/* Main Grid - Balance and net benefits cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Balance */}
            <div className="p-6 rounded-2xl bg-slate-950 text-white relative overflow-hidden border border-slate-800 shadow-lg shadow-slate-950/20 transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase font-mono">Saldo Backoffice</p>
                  </div>
                  <h3 className="text-3xl font-bold text-white mt-2 font-sans tracking-tight">
                    {balance.toFixed(2)}€
                  </h3>
                </div>
                <div className="p-3 border border-slate-800 rounded-xl bg-slate-900 text-indigo-400 shadow-inner">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-900 pt-3 relative z-10">
                <div className="flex items-center gap-1">
                  <span className="text-emerald-400 font-semibold flex items-center gap-0.5 bg-emerald-950/50 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    +100%
                  </span>
                  <span>Fondo garantizado</span>
                </div>
                <span className="text-[9px] font-mono text-slate-500">LIQUIDEZ</span>
              </div>
            </div>

            {/* Total Beneficios */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 relative overflow-hidden shadow-xs hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase font-mono">Premios Ganados (80%)</p>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-850 mt-2 font-sans tracking-tight">
                    {totalEarnings.toFixed(2)}€
                  </h3>
                </div>
                <div className="p-3 border border-indigo-50 rounded-xl bg-indigo-50/50 text-indigo-600 transition-colors group-hover:bg-indigo-50">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-50 pt-3">
                <span className="truncate">Retorno neto de financiación</span>
                <span className="bg-indigo-50 text-indigo-600 text-[9px] font-extrabold px-2 py-0.5 rounded-full">80% NET</span>
              </div>
            </div>

            {/* Total Invertido */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-amber-100 relative overflow-hidden shadow-xs hover:shadow-md hover:shadow-amber-500/5 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase font-mono">Inversión Rondas</p>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-850 mt-2 font-sans tracking-tight">
                    {totalInvested.toFixed(2)}€
                  </h3>
                </div>
                <div className="p-3 border border-amber-50 rounded-xl bg-amber-50/50 text-amber-600 transition-colors group-hover:bg-amber-50">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-50 pt-3">
                <span className="truncate">Participación en sesiones de inversión</span>
                <span className="bg-amber-50 text-amber-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full">RONDAS</span>
              </div>
            </div>

            {/* Comisiones de Afiliación */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-emerald-100 relative overflow-hidden shadow-xs hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase font-mono">Sponsor Comisiones (10%)</p>
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-600 mt-2 font-sans tracking-tight">
                    {totalCommissions.toFixed(2)}€
                  </h3>
                </div>
                <div className="p-3 border border-emerald-50 rounded-xl bg-emerald-50/50 text-emerald-600 transition-colors group-hover:bg-emerald-50">
                  <Percent className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-50 pt-3">
                <span className="truncate">Ganancia por patrocinados</span>
                <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full">10% FEE</span>
              </div>
            </div>

            {/* Ventas de las tiendas */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 relative overflow-hidden shadow-xs hover:shadow-md hover:shadow-blue-500/5 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase font-mono">Ventas de las tiendas</p>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-850 mt-2 font-sans tracking-tight">
                    {totalStoreSales.toFixed(2)}€
                  </h3>
                </div>
                <div className="p-3 border border-blue-50 rounded-xl bg-blue-50/50 text-blue-600 transition-colors group-hover:bg-blue-50">
                  <Store className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-50 pt-3">
                <span className="truncate">Boutique y alta costura</span>
                <span className="bg-blue-50 text-blue-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full">BOUTIQUE</span>
              </div>
            </div>

            {/* Regalos de usuarios */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-rose-100 relative overflow-hidden shadow-xs hover:shadow-md hover:shadow-rose-500/5 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase font-mono">Regalos de usuarios</p>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-850 mt-2 font-sans tracking-tight">
                    {totalUserGifts.toFixed(2)}€
                  </h3>
                </div>
                <div className="p-3 border border-rose-50 rounded-xl bg-rose-50/50 text-rose-500 transition-colors group-hover:bg-rose-50">
                  <Gift className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-50 pt-3">
                <span className="truncate">Monedas canjeadas en directo</span>
                <span className="bg-rose-50 text-rose-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full">LIVE GIFTS</span>
              </div>
            </div>

            {/* Amigos */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-violet-100 relative overflow-hidden shadow-xs hover:shadow-md hover:shadow-violet-500/5 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase font-mono">Amigos</p>
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-850 mt-2 font-sans tracking-tight">
                    {friendsCount}
                  </h3>
                </div>
                <div className="p-3 border border-violet-50 rounded-xl bg-violet-50/50 text-violet-600 transition-colors group-hover:bg-violet-50">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-50 pt-3">
                <span className="truncate">Vínculos recíprocos de amistad</span>
                <span className="bg-violet-50 text-violet-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full">MUTUO</span>
              </div>
            </div>

            {/* Seguidores */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-amber-100 relative overflow-hidden shadow-xs hover:shadow-md hover:shadow-amber-500/5 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase font-mono">Seguidores</p>
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-850 mt-2 font-sans tracking-tight">
                    {followersCount}
                  </h3>
                </div>
                <div className="p-3 border border-amber-50 rounded-xl bg-amber-50/50 text-amber-600 transition-colors group-hover:bg-amber-50">
                  <UserPlus className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-50 pt-3">
                <span className="truncate">Suscritos a tu actividad</span>
                <span className="bg-amber-50 text-amber-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full">COMUNIDAD</span>
              </div>
            </div>

            {/* Seguidos */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-pink-100 relative overflow-hidden shadow-xs hover:shadow-md hover:shadow-pink-500/5 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                    <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase font-mono">Seguidos</p>
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-850 mt-2 font-sans tracking-tight">
                    {followingCount}
                  </h3>
                </div>
                <div className="p-3 border border-pink-50 rounded-xl bg-pink-50/50 text-pink-600 transition-colors group-hover:bg-pink-50">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-50 pt-3">
                <span className="truncate">Creadores que sigues</span>
                <span className="bg-pink-50 text-pink-750 text-[9px] font-extrabold px-2 py-0.5 rounded-full">FAVORITOS</span>
              </div>
            </div>

            {/* Referidos Online */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 hover:border-teal-100 relative overflow-hidden shadow-xs hover:shadow-md hover:shadow-teal-500/5 transition-all duration-300 hover:scale-[1.02] group">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                    <p className="text-[11px] text-slate-400 font-semibold tracking-wider uppercase font-mono">Referidos Online</p>
                  </div>
                  <h3 className="text-3xl font-extrabold text-emerald-600 mt-2 font-sans tracking-tight">
                    {referralsOnlineCount}
                  </h3>
                </div>
                <div className="p-3 border border-teal-50 rounded-xl bg-teal-50/50 text-teal-600 transition-colors group-hover:bg-teal-50">
                  <Globe className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-50 pt-3">
                <span className="truncate">Patrocinados activos</span>
                <span className="bg-teal-50 text-teal-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                  ACTIVOS
                </span>
              </div>
            </div>
          </div>

          {/* Sub-panel row (Sponsor information, recent movements) */}
          <div className="pt-4">
            {/* Recent Movements - Full Width as Sponsor was removed */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Últimos Movimientos del Backoffice
              </h3>

              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {movements.map((mov) => {
                  const isPositive = mov.type === 'deposit' || mov.type === 'prize' || mov.type === 'commission';
                  return (
                    <div
                      key={mov.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition-colors text-xs"
                    >
                      <div className="flex items-center gap-3 max-w-[75%] min-w-0 flex-1">
                        <div className={`p-2 rounded-lg shrink-0 ${
                          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                        }`}>
                          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800 truncate" title={mov.description}>{mov.description}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {new Date(mov.date).toLocaleDateString()} {mov.projectName ? `• Prj: ${mov.projectName}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className={`font-mono font-bold shrink-0 text-right ml-3 whitespace-nowrap ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {isPositive ? '+' : ''}{mov.amount.toFixed(2)}€
                      </span>
                    </div>
                  );
                })}
                {movements.length === 0 && (
                  <p className="text-center py-6 text-xs text-slate-400">No hay movimientos registrados.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Charts Section - Handcrafting beautiful pixel-perfect responsive graphics using pure SVGs */
        <div className="p-6 space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Evolución del Saldo */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  <span>Evolución del Saldo y Liquidez</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">Neto: {netProfit.toFixed(1)}€</span>
              </div>

              {/* Pure SVG Line Chart */}
              <div className="w-full">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="20" y1="20" x2={chartWidth - 20} y2="20" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="0.5" />
                  <line x1="20" y1="70" x2={chartWidth - 20} y2="70" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="0.5" />
                  <line x1="20" y1="120" x2={chartWidth - 20} y2="120" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="0.5" />
                  <line x1="20" y1="170" x2={chartWidth - 20} y2="170" stroke="#cbd5e1" strokeWidth="1" />

                  {/* Gradient Area path */}
                  {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}

                  {/* Stroke path */}
                  {linePath && <path d={linePath} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" />}

                  {/* Interactive Dot Node Indicators */}
                  {chartPoints.map((p, idx) => {
                    const x = (idx / (chartPoints.length - 1)) * (chartWidth - 40) + 20;
                    const y = chartHeight - ((p.balance / maxVal) * (chartHeight - 40) + 20);
                    return (
                      <g key={idx} className="group cursor-pointer">
                        <circle cx={x} cy={y} r="5" fill="#ffffff" stroke="#4f46e5" strokeWidth="2.5" />
                        <circle cx={x} cy={y} r="10" fill="#4f46e5" fillOpacity="0.1" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        <text x={x} y={y - 12} textAnchor="middle" className="text-[10px] font-bold font-mono fill-slate-800 opacity-80 select-none">
                          {p.balance.toFixed(0)}€
                        </text>
                        <text x={x} y={chartHeight - 1} textAnchor="middle" className="text-[10px] fill-slate-400 select-none">
                          {p.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Chart 2: Comparativa de Ingresos vs Egresos */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-emerald-500" />
                <span>Comparativa de Ingresos vs Egresos</span>
              </h4>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                    <span>Ingresos Totales (Depósitos + Premios + Comisiones)</span>
                    <strong className="text-emerald-600 font-mono">
                      {(depositTotal + prizeTotal + totalCommissions).toFixed(1)}€
                    </strong>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, ((depositTotal + prizeTotal + totalCommissions) / 250) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs text-slate-600 mb-1">
                    <span>Egresos Totales (Inversión Rondas + Retiros)</span>
                    <strong className="text-rose-500 font-mono">
                      {(totalInvested + withdrawalTotal).toFixed(1)}€
                    </strong>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (((totalInvested + withdrawalTotal) || 12) / 250) * 100)}%` }}
                    />
                  </div>
                </div>

                <p className="text-[10px] text-slate-400">
                  La plataforma procesa automáticamente la distribución cada vez que finalizan los ciclos de 10 participantes de forma segura.
                </p>
              </div>
            </div>
          </div>

          {/* Bento Grid with the 5 required custom analytical charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Gráfico de los Proyectos en los que Participé */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between space-y-4 shadow-2xs">
              <div>
                <span className="text-[10px] font-black tracking-widest text-pink-600 uppercase block mb-1">PROYECTOS PARTICIPADOS</span>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Proyectos en los que Participé
                </h4>
                <p className="text-[11px] text-slate-400">Distribución de capital e inversión activa por pasarela.</p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { name: 'Eco-Fashion Runway', amount: totalInvested > 0 ? totalInvested : 120, pct: 55, color: 'bg-pink-600' },
                  { name: 'Elite Jewelry Drop', amount: 80, pct: 25, color: 'bg-indigo-600' },
                  { name: 'Retro Resort Denim', amount: 45, pct: 15, color: 'bg-amber-500' },
                  { name: 'Sunset Breeze Swim', amount: 15, pct: 5, color: 'bg-sky-500' }
                ].map((p, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700 font-medium truncate max-w-[150px]">{p.name}</span>
                      <strong className="text-slate-900 font-mono">{p.amount.toFixed(1)}€ ({p.pct}%)</strong>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`${p.color} h-full rounded-full transition-all duration-500`} style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Gráfico del Total del Saldo Sacado */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between space-y-4 shadow-2xs">
              <div>
                <span className="text-[10px] font-black tracking-widest text-pink-600 uppercase block mb-1">SALDO SACADO</span>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Total del Saldo Sacado
                </h4>
                <p className="text-[11px] text-slate-400">Evolución agregada e histórica de tus retiros bancarios.</p>
              </div>

              {/* Pure SVG Line Chart for Saldo Sacado */}
              <div className="pt-2">
                <svg viewBox="0 0 240 100" className="w-full h-auto overflow-visible">
                  <path 
                    d="M 10 90 Q 60 75, 110 50 T 210 20" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />
                  {/* Glowing gradient under curve */}
                  <path 
                    d="M 10 90 Q 60 75, 110 50 T 210 20 L 210 95 L 10 95 Z" 
                    fill="url(#sacadoGrad)" 
                    opacity="0.15" 
                  />
                  <defs>
                    <linearGradient id="sacadoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Nodes */}
                  <circle cx="10" cy="90" r="3.5" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
                  <circle cx="110" cy="50" r="3.5" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
                  <circle cx="210" cy="20" r="3.5" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
                  {/* Tooltips */}
                  <text x="10" y="80" textAnchor="middle" className="text-[8px] font-bold font-mono fill-slate-700">0€</text>
                  <text x="110" y="40" textAnchor="middle" className="text-[8px] font-bold font-mono fill-slate-700">{Math.max(15, withdrawalTotal / 2).toFixed(0)}€</text>
                  <text x="210" y="10" textAnchor="middle" className="text-[8px] font-bold font-mono fill-slate-700">{Math.max(45, withdrawalTotal).toFixed(0)}€</text>
                  
                  {/* Labels */}
                  <text x="10" y="99" textAnchor="middle" className="text-[7px] fill-slate-400">Ene</text>
                  <text x="110" y="99" textAnchor="middle" className="text-[7px] fill-slate-400">Mar</text>
                  <text x="210" y="99" textAnchor="middle" className="text-[7px] fill-slate-400">May</text>
                </svg>
              </div>
            </div>

            {/* 3. Gráfico del Total de Referidos Activos */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between space-y-4 shadow-2xs">
              <div>
                <span className="text-[10px] font-black tracking-widest text-pink-600 uppercase block mb-1">AUDIENCIA AFILIADA</span>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Total de Referidos Activos
                </h4>
                <p className="text-[11px] text-slate-400">Inversores activos que se unieron con tu link en 3 niveles.</p>
              </div>

              <div className="pt-2 flex items-end justify-between h-[80px] px-2">
                {[
                  { level: 'Nivel 1', count: 18, color: 'bg-emerald-500', h: 'h-[75%]' },
                  { level: 'Nivel 2', count: 24, color: 'bg-indigo-500', h: 'h-[100%]' },
                  { level: 'Nivel 3', count: 8, color: 'bg-pink-600', h: 'h-[40%]' }
                ].map((lv, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-[9px] font-mono font-black text-slate-700">{lv.count} act</span>
                    <div className={`w-8 ${lv.color} ${lv.h} rounded-t-md transition-all duration-700`} />
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{lv.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Gráfico del Total de Seguidores */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between space-y-4 shadow-2xs">
              <div>
                <span className="text-[10px] font-black tracking-widest text-pink-600 uppercase block mb-1">MÉTRICAS SOCIALES</span>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Total de Seguidores
                </h4>
                <p className="text-[11px] text-slate-400">Curva de crecimiento de tu base de fans y mecenas.</p>
              </div>

              {/* Pure SVG curve for Followers */}
              <div className="pt-2">
                <svg viewBox="0 0 240 100" className="w-full h-auto overflow-visible">
                  <path 
                    d="M 10 85 Q 70 70, 130 45 T 230 15" 
                    fill="none" 
                    stroke="#db2777" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M 10 85 Q 70 70, 130 45 T 230 15 L 230 95 L 10 95 Z" 
                    fill="url(#follGrad)" 
                    opacity="0.12" 
                  />
                  <defs>
                    <linearGradient id="follGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#db2777" />
                      <stop offset="100%" stopColor="#db2777" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  <circle cx="10" cy="85" r="3.5" fill="#ffffff" stroke="#db2777" strokeWidth="2" />
                  <circle cx="130" cy="45" r="3.5" fill="#ffffff" stroke="#db2777" strokeWidth="2" />
                  <circle cx="230" cy="15" r="3.5" fill="#ffffff" stroke="#db2777" strokeWidth="2" />
                  
                  <text x="10" y="75" textAnchor="middle" className="text-[8px] font-bold font-mono fill-slate-700">650</text>
                  <text x="130" y="32" textAnchor="middle" className="text-[8px] font-bold font-mono fill-slate-700">1.2K</text>
                  <text x="230" y="6" textAnchor="middle" className="text-[8px] font-bold font-mono fill-slate-700">1.8K</text>
                  
                  <text x="10" y="99" textAnchor="middle" className="text-[7px] fill-slate-400">Ene</text>
                  <text x="130" y="99" textAnchor="middle" className="text-[7px] fill-slate-400">Mar</text>
                  <text x="230" y="99" textAnchor="middle" className="text-[7px] fill-slate-400">May</text>
                </svg>
              </div>
            </div>

            {/* 5. Gráfico del Total de Seguidos */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between space-y-4 shadow-2xs">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#4338ca] uppercase block mb-1">CUENTAS SEGUIDAS</span>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Total de Seguidos
                </h4>
                <p className="text-[11px] text-slate-400">Marcas, patrocinadores de moda y modelos que sigues en tu feed.</p>
              </div>

              {/* Pure SVG curve/bar chart for Followed */}
              <div className="pt-2">
                <svg viewBox="0 0 240 100" className="w-full h-auto overflow-visible">
                  <path 
                    d="M 10 90 L 65 75 L 120 62 L 175 48 L 230 35" 
                    fill="none" 
                    stroke="#4338ca" 
                    strokeWidth="2.5" 
                    strokeDasharray="4 2" 
                    strokeLinecap="round" 
                  />
                  <circle cx="10" cy="90" r="3" fill="#4338ca" />
                  <circle cx="120" cy="62" r="3" fill="#4338ca" />
                  <circle cx="230" cy="35" r="3" fill="#4338ca" />
                  
                  <text x="10" y="80" textAnchor="middle" className="text-[8px] font-bold font-mono fill-slate-700">80</text>
                  <text x="120" y="52" textAnchor="middle" className="text-[8px] font-bold font-mono fill-slate-700">190</text>
                  <text x="230" y="24" textAnchor="middle" className="text-[8px] font-bold font-mono fill-slate-700">310</text>
                  
                  <text x="10" y="99" textAnchor="middle" className="text-[7px] fill-slate-400">Ene</text>
                  <text x="120" y="99" textAnchor="middle" className="text-[7px] fill-slate-400">Mar</text>
                  <text x="230" y="99" textAnchor="middle" className="text-[7px] fill-slate-400">May</text>
                </svg>
              </div>
            </div>

            {/* 6. Gráfico de la Evolución de mis Amigos - Added per user zww.png request */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between space-y-4 shadow-2xs">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#10b981] uppercase block mb-1">AMIGOS DE CONFIANZA</span>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Evolución de mis Amigos
                </h4>
                <p className="text-[11px] text-slate-400">Progreso mensual de amistades asociadas y mentores.</p>
              </div>

              {/* Pure SVG curve for Friends Evolution */}
              <div className="pt-2">
                <svg viewBox="0 0 240 100" className="w-full h-auto overflow-visible">
                  <path 
                    d="M 10 95 Q 65 70, 120 40 T 230 15" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M 10 95 Q 65 70, 120 40 T 230 15 L 230 95 L 10 95 Z" 
                    fill="url(#friendsGrad)" 
                    opacity="0.12" 
                  />
                  <defs>
                    <linearGradient id="friendsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  <circle cx="10" cy="95" r="3.5" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
                  <circle cx="120" cy="40" r="3.5" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
                  <circle cx="230" cy="15" r="3.5" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
                  
                  <text x="10" y="85" textAnchor="middle" className="text-[8px] font-bold font-mono fill-slate-700">12</text>
                  <text x="120" y="28" textAnchor="middle" className="text-[8px] font-bold font-mono fill-slate-700">85</text>
                  <text x="230" y="6" textAnchor="middle" className="text-[8px] font-bold font-mono fill-slate-700">142</text>
                  
                  <text x="10" y="99" textAnchor="middle" className="text-[7px] fill-slate-400">Ene</text>
                  <text x="120" y="99" textAnchor="middle" className="text-[7px] fill-slate-400">Mar</text>
                  <text x="230" y="99" textAnchor="middle" className="text-[7px] fill-slate-400">May</text>
                </svg>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
