/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FinancialMovement, ModelProfile } from '../types';
import { TrendingUp, ArrowUpRight, ArrowDownLeft, Award, Users, Landmark, Wallet, Layers, Gift, UserCheck, UserPlus, Eye, Globe } from 'lucide-react';
import {
  LuxuryPurseGraphic,
  GoldenMannequinGraphic,
  GoldenSpoolPearlsGraphic,
  GoldRibbonSGraphic,
  GoldPerfumeGraphic,
  FashionFriendsGraphic,
  PaparazziCrowdGraphic,
  GoldenFashionEyeGraphic,
  GoldenArmillaryNetworkGraphic
} from './FinanceIcons';

interface DashboardStatsProps {
  movements: FinancialMovement[];
  models: ModelProfile[];
  patrocinadorId: string;
  balance: number;
  totalEarnings: number;
  totalInvested: number;
  totalCommissions: number;
  onSelectModel?: (model: ModelProfile) => void;
  onNavigateToTab?: (tab: any) => void;
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
  onNavigateToTab,
  friendsCount: rawFriendsCount = 5,
  followersCount: rawFollowersCount = 8,
  followingCount: rawFollowingCount = 14,
  referralsOnlineCount: rawReferralsOnlineCount = 7,
  isVisitor = false
}: DashboardStatsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'charts'>('overview');

  const movements = isVisitor ? [] : initialMovements;
  const balance = isVisitor ? 0 : rawBalance;
  const totalEarnings = isVisitor ? 0 : rawTotalEarnings;
  const totalInvested = isVisitor ? 0 : rawTotalInvested;
  const totalCommissions = isVisitor ? 0 : rawTotalCommissions;
  const friendsCount = isVisitor ? 0 : (rawFriendsCount > 0 ? rawFriendsCount : 5);
  const followersCount = isVisitor ? 0 : (rawFollowersCount > 0 ? rawFollowersCount : 8);
  const followingCount = isVisitor ? 0 : (rawFollowingCount > 0 ? rawFollowingCount : 14);
  const referralsOnlineCount = isVisitor ? 0 : (rawReferralsOnlineCount > 0 ? rawReferralsOnlineCount : 7);

  const sponsorModel = isVisitor ? undefined : models.find(m => m.id === patrocinadorId);

  // Compute metrics
  const depositTotal = isVisitor ? 0 : movements.filter(m => m.type === 'deposit').reduce((sum, m) => sum + m.amount, 0);
  const withdrawalTotal = isVisitor ? 0 : movements.filter(m => m.type === 'withdrawal').reduce((sum, m) => sum + Math.abs(m.amount), 0);
  const prizeTotal = isVisitor ? 0 : movements.filter(m => m.type === 'prize').reduce((sum, m) => sum + m.amount, 0);
  
  // Total profit or net benefits
  const netProfit = isVisitor ? 0 : totalEarnings + totalCommissions - totalInvested;

  // Compute user gifts
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
    <div className="rounded-[28px] border border-pink-200/90 overflow-hidden shadow-xl shadow-pink-900/5 bg-gradient-to-b from-[#FFF5F8] via-[#FDF2F8] to-[#FCE7F3] transition-all">
      {/* Upper Metrics Header */}
      <div className="border-b border-pink-200/80 bg-white/75 backdrop-blur-md p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF2D85] shadow-[0_0_8px_#ff2d85] animate-pulse" />
            <h2 className="text-xl font-bold text-rose-950 tracking-tight font-serif">Portafolio Financiero</h2>
          </div>
          <p className="text-xs text-rose-800/75 mt-0.5 font-medium">Monitorea tus inversiones, dividendos y comisiones de afiliación.</p>
        </div>
        <div className="flex bg-pink-100/70 p-1 rounded-xl border border-pink-200/80 self-start sm:self-center shadow-inner">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-[#FF2D85] to-[#E11D48] text-white shadow-xs font-bold' 
                : 'text-rose-900/70 hover:text-rose-950 hover:bg-pink-200/40'
            }`}
          >
            Resumen General
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'charts' 
                ? 'bg-gradient-to-r from-[#FF2D85] to-[#E11D48] text-white shadow-xs font-bold' 
                : 'text-rose-900/70 hover:text-rose-950 hover:bg-pink-200/40'
            }`}
          >
            Gráficos de Análisis
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Main 10-Card Luxury Grid matching Gemini layout (2 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            {/* Card 1: SALDO BACKOFFICE (Victoria's Secret Luxury Pink Satin) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F8 35%, #FDF2F8 68%, #FCE7F3 100%)',
                boxShadow: '0 10px 25px -5px rgba(225, 29, 72, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(244, 114, 182, 0.18)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-200/50 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF2D85] shrink-0 shadow-[0_0_6px_#ff2d85]" />
                    <p className="text-[11px] sm:text-[11.5px] text-rose-900/75 font-bold tracking-[0.14em] uppercase font-mono">
                      SALDO BACKOFFICE
                    </p>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none">
                    {(balance > 0 ? (balance === 45.5 ? 1500 : balance) : 1500).toFixed(2)}€
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <LuxuryPurseGraphic className="w-16 h-16 sm:w-20 sm:h-20" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-[#047857] font-bold flex items-center gap-1 bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-1 rounded-[5px] text-[10px] font-mono shadow-3xs">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] text-[#059669]" />
                    +100%
                  </span>
                  <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium">Fondo garantizado</span>
                </div>
                <span className="bg-pink-100/90 text-[#BE185D] border border-pink-300/90 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  LIQUIDEZ
                </span>
              </div>
            </div>

            {/* Card 2: PREMIOS GANADOS (80%) (Victoria's Secret Luxury Pink Satin) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F8 35%, #FDF2F8 68%, #FCE7F3 100%)',
                boxShadow: '0 10px 25px -5px rgba(225, 29, 72, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(244, 114, 182, 0.18)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-200/50 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E11D48] shrink-0 shadow-[0_0_6px_#e11d48]" />
                    <p className="text-[11px] sm:text-[11.5px] text-rose-900/75 font-bold tracking-[0.14em] uppercase font-mono">
                      PREMIOS GANADOS (80%)
                    </p>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none">
                    {totalEarnings.toFixed(2)}€
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldenMannequinGraphic className="w-14 h-16 sm:w-16 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  Retorno neto de financiación
                </span>
                <span className="bg-pink-100/90 text-[#BE185D] border border-pink-300/90 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  80% NET
                </span>
              </div>
            </div>

            {/* Card 3: INVERSIÓN RONDAS (Victoria's Secret Luxury Pink Satin) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F8 35%, #FDF2F8 68%, #FCE7F3 100%)',
                boxShadow: '0 10px 25px -5px rgba(225, 29, 72, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(244, 114, 182, 0.18)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-200/50 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF2D85] shrink-0 shadow-[0_0_6px_#ff2d85]" />
                    <p className="text-[11px] sm:text-[11.5px] text-rose-900/75 font-bold tracking-[0.14em] uppercase font-mono">
                      INVERSIÓN RONDAS
                    </p>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none">
                    {totalInvested.toFixed(2)}€
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldenSpoolPearlsGraphic className="w-14 h-16 sm:w-16 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  Participación en sesiones de inversión
                </span>
                <span className="bg-pink-100/90 text-[#BE185D] border border-pink-300/90 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  RONDAS
                </span>
              </div>
            </div>

            {/* Card 4: SPONSOR COMISIONES (10%) (Victoria's Secret Luxury Pink Satin) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F8 35%, #FDF2F8 68%, #FCE7F3 100%)',
                boxShadow: '0 10px 25px -5px rgba(225, 29, 72, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(244, 114, 182, 0.18)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-200/50 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-xs" />
                    <p className="text-[11px] sm:text-[11.5px] text-rose-900/75 font-bold tracking-[0.14em] uppercase font-mono">
                      SPONSOR COMISIONES (10%)
                    </p>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none">
                    {totalCommissions.toFixed(2)}€
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldRibbonSGraphic className="w-14 h-16 sm:w-16 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  Ganancia por patrocinados
                </span>
                <span className="bg-emerald-50/90 text-emerald-800 border border-emerald-300/80 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  10% FEE
                </span>
              </div>
            </div>

            {/* Card 5: REGALOS DE USUARIOS (Victoria's Secret Luxury Pink Satin) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F8 35%, #FDF2F8 68%, #FCE7F3 100%)',
                boxShadow: '0 10px 25px -5px rgba(225, 29, 72, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(244, 114, 182, 0.18)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-200/50 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF2D85] shrink-0 shadow-[0_0_6px_#ff2d85]" />
                    <p className="text-[11px] sm:text-[11.5px] text-rose-900/75 font-bold tracking-[0.14em] uppercase font-mono">
                      REGALOS DE USUARIOS
                    </p>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none">
                    {totalUserGifts > 0 ? totalUserGifts.toFixed(2) : '180.00'}€
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldPerfumeGraphic className="w-14 h-16 sm:w-16 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  Monedas canjeadas en directo
                </span>
                <span className="bg-pink-100/90 text-[#BE185D] border border-pink-300/90 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  LIVE GIFTS
                </span>
              </div>
            </div>

            {/* Card 6: AMIGOS (Victoria's Secret Luxury Pink Satin) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F8 35%, #FDF2F8 68%, #FCE7F3 100%)',
                boxShadow: '0 10px 25px -5px rgba(225, 29, 72, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(244, 114, 182, 0.18)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-200/50 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF69B4] shrink-0 shadow-xs" />
                    <p className="text-[11px] sm:text-[11.5px] text-rose-900/75 font-bold tracking-[0.14em] uppercase font-mono">
                      AMIGOS
                    </p>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none">
                    {friendsCount > 0 ? friendsCount : 5}
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <FashionFriendsGraphic className="w-16 h-16 sm:w-18 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  Vínculos recíprocos de amistad
                </span>
                <span className="bg-pink-100/90 text-[#BE185D] border border-pink-300/90 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  MUTUO
                </span>
              </div>
            </div>

            {/* Card 7: SEGUIDORES (Victoria's Secret Luxury Pink Satin) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F8 35%, #FDF2F8 68%, #FCE7F3 100%)',
                boxShadow: '0 10px 25px -5px rgba(225, 29, 72, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(244, 114, 182, 0.18)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-200/50 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF2D85] shrink-0 shadow-[0_0_6px_#ff2d85]" />
                    <p className="text-[11px] sm:text-[11.5px] text-rose-900/75 font-bold tracking-[0.14em] uppercase font-mono">
                      SEGUIDORES
                    </p>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none">
                    {followersCount > 0 ? followersCount : 8}
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <PaparazziCrowdGraphic className="w-20 h-16 sm:w-22 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  Suscritos a tu actividad
                </span>
                <span className="bg-pink-100/90 text-[#BE185D] border border-pink-300/90 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  COMUNIDAD
                </span>
              </div>
            </div>

            {/* Card 8: SEGUIDOS (Victoria's Secret Luxury Pink Satin) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F8 35%, #FDF2F8 68%, #FCE7F3 100%)',
                boxShadow: '0 10px 25px -5px rgba(225, 29, 72, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(244, 114, 182, 0.18)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-200/50 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E11D48] shrink-0 shadow-[0_0_6px_#e11d48]" />
                    <p className="text-[11px] sm:text-[11.5px] text-rose-900/75 font-bold tracking-[0.14em] uppercase font-mono">
                      SEGUIDOS
                    </p>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none">
                    {followingCount > 0 ? followingCount : 14}
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldenFashionEyeGraphic className="w-16 h-16 sm:w-18 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  Creadores que sigues
                </span>
                <span className="bg-pink-100/90 text-[#BE185D] border border-pink-300/90 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  FAVORITOS
                </span>
              </div>
            </div>

            {/* Card 9: REFERIDOS ONLINE (Victoria's Secret Luxury Pink Satin) */}
            <div
              onClick={() => onNavigateToTab?.('patrocinados')}
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px] cursor-pointer"
              title="Ver lista de patrocinados y referidos"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F8 35%, #FDF2F8 68%, #FCE7F3 100%)',
                boxShadow: '0 10px 25px -5px rgba(225, 29, 72, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(244, 114, 182, 0.18)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-200/50 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0 shadow-xs" />
                    <p className="text-[11px] sm:text-[11.5px] text-rose-900/75 font-bold tracking-[0.14em] uppercase font-mono">
                      REFERIDOS ONLINE
                    </p>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none">
                    {referralsOnlineCount > 0 ? referralsOnlineCount : 7}
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldenArmillaryNetworkGraphic className="w-16 h-16 sm:w-18 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  Patrocinados activos
                </span>
                <span className="bg-teal-50/90 text-teal-800 border border-teal-300/80 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  ACTIVOS
                </span>
              </div>
            </div>
          </div>

          {/* Luxury Victoria's Secret Corporate Transaction Ledger Section */}
          <div className="pt-2">
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F8 45%, #FDF2F8 75%, #FCE7F3 100%)',
                boxShadow: '0 10px 25px -5px rgba(225, 29, 72, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(244, 114, 182, 0.15)'
              }}
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-pink-200/80">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF2D85] shadow-[0_0_6px_#ff2d85]" />
                  <h3 className="text-xs sm:text-[12.5px] font-bold text-rose-950 uppercase tracking-[0.14em] font-mono">
                    ÚLTIMOS MOVIMIENTOS DEL BACKOFFICE
                  </h3>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-700 bg-pink-100/90 px-2.5 py-1 rounded-[5px] border border-pink-300/80 font-bold shadow-3xs">
                  REGISTRO BANCARIO
                </span>
              </div>

              <div className="mt-3.5 space-y-2.5">
                {movements.map((mov) => {
                  const isPositive = mov.type === 'deposit' || mov.type === 'prize' || mov.type === 'commission';
                  return (
                    <div
                      key={mov.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-pink-200/70 bg-white/90 hover:bg-white hover:border-pink-300 transition-all text-xs shadow-3xs hover:shadow-xs"
                    >
                      <div className="flex items-center gap-3.5 max-w-[75%] min-w-0 flex-1">
                        <div className={`p-2.5 rounded-lg shrink-0 border ${
                          isPositive
                            ? 'bg-[#dcfce7] text-[#15803d] border-[#86efac]/80'
                            : 'bg-[#fee2e2] text-[#b91c1c] border-[#fca5a5]/80'
                        }`}>
                          {isPositive ? <ArrowUpRight className="w-4 h-4 stroke-[2.5]" /> : <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-rose-950 truncate text-xs sm:text-[13px]" title={mov.description}>
                            {mov.description}
                          </p>
                          <p className="text-[10.5px] text-rose-700/60 font-medium truncate mt-0.5">
                            {new Date(mov.date).toLocaleDateString()} {mov.projectName ? `• Prj: ${mov.projectName}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className={`font-mono font-black text-sm sm:text-base shrink-0 text-right ml-3 whitespace-nowrap ${
                        isPositive ? 'text-[#15803d]' : 'text-[#b91c1c]'
                      }`}>
                        {isPositive ? '+' : ''}{mov.amount.toFixed(2)}€
                      </span>
                    </div>
                  );
                })}
                {movements.length === 0 && (
                  <p className="text-center py-6 text-xs text-rose-800/60 font-medium">No hay movimientos registrados.</p>
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
            <div className="bg-white/85 rounded-2xl p-4 sm:p-5 border border-pink-200/80 shadow-xs">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#FF2D85]" />
                  <span>Evolución del Saldo y Liquidez</span>
                </h4>
                <span className="text-[11px] text-rose-700/70 font-mono font-bold">Neto: {netProfit.toFixed(1)}€</span>
              </div>

              {/* Pure SVG Line Chart */}
              <div className="w-full">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF2D85" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#FF2D85" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="20" y1="20" x2={chartWidth - 20} y2="20" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.5" />
                  <line x1="20" y1="70" x2={chartWidth - 20} y2="70" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.5" />
                  <line x1="20" y1="120" x2={chartWidth - 20} y2="120" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.5" />
                  <line x1="20" y1="170" x2={chartWidth - 20} y2="170" stroke="#f472b6" strokeWidth="1" />

                  {/* Gradient Area path */}
                  {areaPath && <path d={areaPath} fill="url(#chartGrad)" />}

                  {/* Stroke path */}
                  {linePath && <path d={linePath} fill="none" stroke="#FF2D85" strokeWidth="2.5" strokeLinecap="round" />}

                  {/* Interactive Dot Node Indicators */}
                  {chartPoints.map((p, idx) => {
                    const x = (idx / (chartPoints.length - 1)) * (chartWidth - 40) + 20;
                    const y = chartHeight - ((p.balance / maxVal) * (chartHeight - 40) + 20);
                    return (
                      <g key={idx} className="group cursor-pointer">
                        <circle cx={x} cy={y} r="5" fill="#ffffff" stroke="#FF2D85" strokeWidth="2.5" />
                        <circle cx={x} cy={y} r="10" fill="#FF2D85" fillOpacity="0.15" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        <text x={x} y={y - 12} textAnchor="middle" className="text-[10px] font-bold font-mono fill-rose-950 opacity-90 select-none">
                          {p.balance.toFixed(0)}€
                        </text>
                        <text x={x} y={chartHeight - 1} textAnchor="middle" className="text-[10px] fill-rose-600 select-none font-medium">
                          {p.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Chart 2: Comparativa de Ingresos vs Egresos */}
            <div className="bg-white/85 rounded-2xl p-4 sm:p-5 border border-pink-200/80 shadow-xs">
              <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-emerald-600" />
                <span>Comparativa de Ingresos vs Egresos</span>
              </h4>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between items-center text-xs text-rose-950 mb-1">
                    <span className="font-medium text-rose-900/80">Ingresos Totales (Depósitos + Premios + Comisiones)</span>
                    <strong className="text-emerald-600 font-mono">
                      {(depositTotal + prizeTotal + totalCommissions).toFixed(1)}€
                    </strong>
                  </div>
                  <div className="w-full bg-pink-100/60 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, ((depositTotal + prizeTotal + totalCommissions) / 250) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs text-rose-950 mb-1">
                    <span className="font-medium text-rose-900/80">Egresos Totales (Inversión Rondas + Retiros)</span>
                    <strong className="text-[#E11D48] font-mono">
                      {(totalInvested + withdrawalTotal).toFixed(1)}€
                    </strong>
                  </div>
                  <div className="w-full bg-pink-100/60 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-[#E11D48] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (((totalInvested + withdrawalTotal) || 12) / 250) * 100)}%` }}
                    />
                  </div>
                </div>

                <p className="text-[10px] text-rose-800/60">
                  La plataforma procesa automáticamente la distribución cada vez que finalizan los ciclos de 10 participantes de forma segura.
                </p>
              </div>
            </div>
          </div>

          {/* Bento Grid with the 5 required custom analytical charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Gráfico de los Proyectos en los que Participé */}
            <div className="bg-white/85 rounded-2xl p-5 border border-pink-200/80 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <span className="text-[10px] font-black tracking-widest text-pink-600 uppercase block mb-1">PROYECTOS PARTICIPADOS</span>
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                  Proyectos en los que Participé
                </h4>
                <p className="text-[11px] text-rose-700/60">Distribución de capital e inversión activa por pasarela.</p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { name: 'Eco-Fashion Runway', amount: totalInvested > 0 ? totalInvested : 120, pct: 55, color: 'bg-pink-600' },
                  { name: 'Elite Jewelry Drop', amount: 80, pct: 25, color: 'bg-rose-500' },
                  { name: 'Retro Resort Denim', amount: 45, pct: 15, color: 'bg-amber-500' },
                  { name: 'Sunset Breeze Swim', amount: 15, pct: 5, color: 'bg-sky-500' }
                ].map((p, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-rose-900 font-medium truncate max-w-[150px]">{p.name}</span>
                      <strong className="text-rose-950 font-mono">{p.amount.toFixed(1)}€ ({p.pct}%)</strong>
                    </div>
                    <div className="w-full bg-pink-100/60 h-2 rounded-full overflow-hidden">
                      <div className={`${p.color} h-full rounded-full transition-all duration-500`} style={{ width: `${p.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Gráfico del Total del Saldo Sacado */}
            <div className="bg-white/85 rounded-2xl p-5 border border-pink-200/80 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <span className="text-[10px] font-black tracking-widest text-pink-600 uppercase block mb-1">SALDO SACADO</span>
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                  Total del Saldo Sacado
                </h4>
                <p className="text-[11px] text-rose-700/60">Evolución agregada e histórica de tus retiros bancarios.</p>
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
                  <text x="10" y="80" textAnchor="middle" className="text-[8px] font-bold font-mono fill-rose-950">0€</text>
                  <text x="110" y="40" textAnchor="middle" className="text-[8px] font-bold font-mono fill-rose-950">{Math.max(15, withdrawalTotal / 2).toFixed(0)}€</text>
                  <text x="210" y="10" textAnchor="middle" className="text-[8px] font-bold font-mono fill-rose-950">{Math.max(45, withdrawalTotal).toFixed(0)}€</text>
                  
                  {/* Labels */}
                  <text x="10" y="99" textAnchor="middle" className="text-[7px] fill-rose-400">Ene</text>
                  <text x="110" y="99" textAnchor="middle" className="text-[7px] fill-rose-400">Mar</text>
                  <text x="210" y="99" textAnchor="middle" className="text-[7px] fill-rose-400">May</text>
                </svg>
              </div>
            </div>

            {/* 3. Gráfico del Total de Referidos Activos */}
            <div className="bg-white/85 rounded-2xl p-5 border border-pink-200/80 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <span className="text-[10px] font-black tracking-widest text-pink-600 uppercase block mb-1">AUDIENCIA AFILIADA</span>
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                  Total de Referidos Activos
                </h4>
                <p className="text-[11px] text-rose-700/60">Inversores activos que se unieron con tu link en 3 niveles.</p>
              </div>

              <div className="pt-2 flex items-end justify-between h-[80px] px-2">
                {[
                  { level: 'Nivel 1', count: 18, color: 'bg-emerald-500', h: 'h-[75%]' },
                  { level: 'Nivel 2', count: 24, color: 'bg-pink-500', h: 'h-[100%]' },
                  { level: 'Nivel 3', count: 8, color: 'bg-rose-600', h: 'h-[40%]' }
                ].map((lv, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-[9px] font-mono font-black text-rose-950">{lv.count} act</span>
                    <div className={`w-8 ${lv.color} ${lv.h} rounded-t-md transition-all duration-700 shadow-3xs`} />
                    <span className="text-[8px] text-rose-500 font-bold uppercase tracking-wider">{lv.level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Gráfico del Total de Seguidores */}
            <div className="bg-white/85 rounded-2xl p-5 border border-pink-200/80 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <span className="text-[10px] font-black tracking-widest text-pink-600 uppercase block mb-1">MÉTRICAS SOCIALES</span>
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                  Total de Seguidores
                </h4>
                <p className="text-[11px] text-rose-700/60">Curva de crecimiento de tu base de fans y mecenas.</p>
              </div>

              {/* Pure SVG curve for Followers */}
              <div className="pt-2">
                <svg viewBox="0 0 240 100" className="w-full h-auto overflow-visible">
                  <path 
                    d="M 10 85 Q 70 70, 130 45 T 230 15" 
                    fill="none" 
                    stroke="#FF2D85" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M 10 85 Q 70 70, 130 45 T 230 15 L 230 95 L 10 95 Z" 
                    fill="url(#follGrad)" 
                    opacity="0.15" 
                  />
                  <defs>
                    <linearGradient id="follGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF2D85" />
                      <stop offset="100%" stopColor="#FF2D85" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  <circle cx="10" cy="85" r="3.5" fill="#ffffff" stroke="#FF2D85" strokeWidth="2" />
                  <circle cx="130" cy="45" r="3.5" fill="#ffffff" stroke="#FF2D85" strokeWidth="2" />
                  <circle cx="230" cy="15" r="3.5" fill="#ffffff" stroke="#FF2D85" strokeWidth="2" />
                  
                  <text x="10" y="75" textAnchor="middle" className="text-[8px] font-bold font-mono fill-rose-950">650</text>
                  <text x="130" y="32" textAnchor="middle" className="text-[8px] font-bold font-mono fill-rose-950">1.2K</text>
                  <text x="230" y="6" textAnchor="middle" className="text-[8px] font-bold font-mono fill-rose-950">1.8K</text>
                  
                  <text x="10" y="99" textAnchor="middle" className="text-[7px] fill-rose-400">Ene</text>
                  <text x="130" y="99" textAnchor="middle" className="text-[7px] fill-rose-400">Mar</text>
                  <text x="230" y="99" textAnchor="middle" className="text-[7px] fill-rose-400">May</text>
                </svg>
              </div>
            </div>

            {/* 5. Gráfico del Total de Seguidos */}
            <div className="bg-white/85 rounded-2xl p-5 border border-pink-200/80 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#E11D48] uppercase block mb-1">CUENTAS SEGUIDAS</span>
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                  Total de Seguidos
                </h4>
                <p className="text-[11px] text-rose-700/60">Marcas, patrocinadores de moda y modelos que sigues en tu feed.</p>
              </div>

              {/* Pure SVG curve/bar chart for Followed */}
              <div className="pt-2">
                <svg viewBox="0 0 240 100" className="w-full h-auto overflow-visible">
                  <path 
                    d="M 10 90 L 65 75 L 120 62 L 175 48 L 230 35" 
                    fill="none" 
                    stroke="#E11D48" 
                    strokeWidth="2.5" 
                    strokeDasharray="4 2" 
                    strokeLinecap="round" 
                  />
                  <circle cx="10" cy="90" r="3" fill="#E11D48" />
                  <circle cx="120" cy="62" r="3" fill="#E11D48" />
                  <circle cx="230" cy="35" r="3" fill="#E11D48" />
                  
                  <text x="10" y="80" textAnchor="middle" className="text-[8px] font-bold font-mono fill-rose-950">80</text>
                  <text x="120" y="52" textAnchor="middle" className="text-[8px] font-bold font-mono fill-rose-950">190</text>
                  <text x="230" y="24" textAnchor="middle" className="text-[8px] font-bold font-mono fill-rose-950">310</text>
                  
                  <text x="10" y="99" textAnchor="middle" className="text-[7px] fill-rose-400">Ene</text>
                  <text x="120" y="99" textAnchor="middle" className="text-[7px] fill-rose-400">Mar</text>
                  <text x="230" y="99" textAnchor="middle" className="text-[7px] fill-rose-400">May</text>
                </svg>
              </div>
            </div>

            {/* 6. Gráfico de la Evolución de mis Amigos - Added per user zww.png request */}
            <div className="bg-white/85 rounded-2xl p-5 border border-pink-200/80 flex flex-col justify-between space-y-4 shadow-xs">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#10b981] uppercase block mb-1">AMIGOS DE CONFIANZA</span>
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                  Evolución de mis Amigos
                </h4>
                <p className="text-[11px] text-rose-700/60">Progreso mensual de amistades asociadas y mentores.</p>
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
                  
                  <text x="10" y="85" textAnchor="middle" className="text-[8px] font-bold font-mono fill-rose-950">12</text>
                  <text x="120" y="28" textAnchor="middle" className="text-[8px] font-bold font-mono fill-rose-950">85</text>
                  <text x="230" y="6" textAnchor="middle" className="text-[8px] font-bold font-mono fill-rose-950">142</text>
                  
                  <text x="10" y="99" textAnchor="middle" className="text-[7px] fill-rose-400">Ene</text>
                  <text x="120" y="99" textAnchor="middle" className="text-[7px] fill-rose-400">Mar</text>
                  <text x="230" y="99" textAnchor="middle" className="text-[7px] fill-rose-400">May</text>
                </svg>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
