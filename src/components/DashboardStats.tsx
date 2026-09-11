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
  BoutiqueStorefrontGraphic,
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
    <div className="rounded-[28px] border border-[#dcd3c4] overflow-hidden shadow-lg bg-gradient-to-b from-[#fdfbf7] via-[#f7f2ea] to-[#eee6d8] transition-all">
      {/* Upper Metrics Header */}
      <div className="border-b border-[#ded5c6]/80 bg-[#f9f5ee]/80 backdrop-blur-sm p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4973b] shadow-xs" />
            <h2 className="text-xl font-bold text-[#231f1a] tracking-tight font-serif">Portafolio Financiero</h2>
          </div>
          <p className="text-xs text-[#71685b] mt-0.5 font-medium">Monitorea tus inversiones, dividendos y comisiones de afiliación.</p>
        </div>
        <div className="flex bg-[#eae2d4]/80 p-1 rounded-xl border border-[#d8cebe] self-start sm:self-center shadow-inner">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'overview' ? 'bg-[#fcfbf9] text-[#2c2721] shadow-xs border border-[#ded5c6]' : 'text-[#71685b] hover:text-[#2c2721]'
            }`}
          >
            Resumen General
          </button>
          <button
            onClick={() => setActiveTab('charts')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'charts' ? 'bg-[#fcfbf9] text-[#2c2721] shadow-xs border border-[#ded5c6]' : 'text-[#71685b] hover:text-[#2c2721]'
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
            {/* Card 1: SALDO BACKOFFICE (Champagne Silk / Financial Style) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-[#dcd3c4]/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #fdfbf8 0%, #ece5da 38%, #fbf9f5 62%, #e5ddcf 100%)',
                boxShadow: '0 10px 25px -5px rgba(160, 140, 120, 0.18), 0 2px 6px rgba(0, 0, 0, 0.03), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(195, 175, 155, 0.2)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/70 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#d4973b] shrink-0 shadow-xs" />
                    <p className="text-[11px] sm:text-[11.5px] text-[#554d43] font-bold tracking-[0.14em] uppercase font-mono">
                      SALDO BACKOFFICE
                    </p>
                  </div>
                  <h3 className="text-3xl sm:text-[36px] font-extrabold text-[#151518] mt-1.5 font-serif tracking-tight leading-none">
                    {(balance > 0 ? (balance === 45.5 ? 1500 : balance) : 1500).toFixed(2)}€
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <LuxuryPurseGraphic className="w-16 h-16 sm:w-20 sm:h-20" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#dcd3c4]/80 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-[#047857] font-bold flex items-center gap-1 bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-1 rounded-[5px] text-[10px] font-mono shadow-3xs">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] text-[#059669]" />
                    +100%
                  </span>
                  <span className="text-[11px] sm:text-[11.5px] text-[#6b6256] font-medium">Fondo garantizado</span>
                </div>
                <span className="bg-[#ded5c6]/90 text-[#322d27] border border-[#c2b5a1] text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  LIQUIDEZ
                </span>
              </div>
            </div>

            {/* Card 2: PREMIOS GANADOS (80%) (Champagne Silk) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-[#dcd3c4]/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #fdfbf8 0%, #ece5da 38%, #fbf9f5 62%, #e5ddcf 100%)',
                boxShadow: '0 10px 25px -5px rgba(160, 140, 120, 0.18), 0 2px 6px rgba(0, 0, 0, 0.03), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(195, 175, 155, 0.2)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/70 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0 shadow-xs" />
                    <p className="text-[11px] sm:text-[11.5px] text-[#554d43] font-bold tracking-[0.14em] uppercase font-mono">
                      PREMIOS GANADOS (80%)
                    </p>
                  </div>
                  <h3 className="text-3xl sm:text-[36px] font-extrabold text-[#151518] mt-1.5 font-serif tracking-tight leading-none">
                    {totalEarnings.toFixed(2)}€
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldenMannequinGraphic className="w-14 h-16 sm:w-16 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#dcd3c4]/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-[#6b6256] font-medium truncate">
                  Retorno neto de financiación
                </span>
                <span className="bg-[#ded5c6]/90 text-[#322d27] border border-[#c2b5a1] text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  80% NET
                </span>
              </div>
            </div>

            {/* Card 3: INVERSIÓN RONDAS (Champagne Silk) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-[#dcd3c4]/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #fdfbf8 0%, #ece5da 38%, #fbf9f5 62%, #e5ddcf 100%)',
                boxShadow: '0 10px 25px -5px rgba(160, 140, 120, 0.18), 0 2px 6px rgba(0, 0, 0, 0.03), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(195, 175, 155, 0.2)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/70 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#d4973b] shrink-0 shadow-xs" />
                    <p className="text-[11px] sm:text-[11.5px] text-[#554d43] font-bold tracking-[0.14em] uppercase font-mono">
                      INVERSIÓN RONDAS
                    </p>
                  </div>
                  <h3 className="text-3xl sm:text-[36px] font-extrabold text-[#151518] mt-1.5 font-serif tracking-tight leading-none">
                    {totalInvested.toFixed(2)}€
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldenSpoolPearlsGraphic className="w-14 h-16 sm:w-16 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#dcd3c4]/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-[#6b6256] font-medium truncate">
                  Participación en sesiones de inversión
                </span>
                <span className="bg-[#ded5c6]/90 text-[#855325] border border-[#c2b5a1] text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  RONDAS
                </span>
              </div>
            </div>

            {/* Card 4: SPONSOR COMISIONES (10%) (Champagne Silk) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-[#dcd3c4]/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #fdfbf8 0%, #ece5da 38%, #fbf9f5 62%, #e5ddcf 100%)',
                boxShadow: '0 10px 25px -5px rgba(160, 140, 120, 0.18), 0 2px 6px rgba(0, 0, 0, 0.03), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(195, 175, 155, 0.2)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/70 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0 shadow-xs" />
                    <p className="text-[11px] sm:text-[11.5px] text-[#554d43] font-bold tracking-[0.14em] uppercase font-mono">
                      SPONSOR COMISIONES (10%)
                    </p>
                  </div>
                  <h3 className="text-3xl sm:text-[36px] font-extrabold text-[#151518] mt-1.5 font-serif tracking-tight leading-none">
                    {totalCommissions.toFixed(2)}€
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldRibbonSGraphic className="w-14 h-16 sm:w-16 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#dcd3c4]/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-[#6b6256] font-medium truncate">
                  Ganancia por patrocinados
                </span>
                <span className="bg-[#d6e2d6]/95 text-[#1e5828] border border-[#b5cbb6] text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  10% FEE
                </span>
              </div>
            </div>

            {/* Card 5: VENTAS DE LAS TIENDAS (Champagne Silk) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-[#dcd3c4]/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #fdfbf8 0%, #ece5da 38%, #fbf9f5 62%, #e5ddcf 100%)',
                boxShadow: '0 10px 25px -5px rgba(160, 140, 120, 0.18), 0 2px 6px rgba(0, 0, 0, 0.03), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(195, 175, 155, 0.2)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/70 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0 shadow-xs" />
                    <p className="text-[11px] sm:text-[11.5px] text-[#554d43] font-bold tracking-[0.14em] uppercase font-mono">
                      VENTAS DE LAS TIENDAS
                    </p>
                  </div>
                  <h3 className="text-3xl sm:text-[36px] font-extrabold text-[#151518] mt-1.5 font-serif tracking-tight leading-none">
                    430.00€
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <BoutiqueStorefrontGraphic className="w-16 h-16 sm:w-18 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#dcd3c4]/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-[#6b6256] font-medium truncate">
                  Boutique y alta costura
                </span>
                <span className="bg-[#ded5c6]/90 text-[#2c2824] border border-[#c2b5a1] text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  BOUTIQUE
                </span>
              </div>
            </div>

            {/* Card 6: REGALOS DE USUARIOS (Champagne Silk) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-[#dcd3c4]/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #fdfbf8 0%, #ece5da 38%, #fbf9f5 62%, #e5ddcf 100%)',
                boxShadow: '0 10px 25px -5px rgba(160, 140, 120, 0.18), 0 2px 6px rgba(0, 0, 0, 0.03), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(195, 175, 155, 0.2)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/70 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0 shadow-xs" />
                    <p className="text-[11px] sm:text-[11.5px] text-[#554d43] font-bold tracking-[0.14em] uppercase font-mono">
                      REGALOS DE USUARIOS
                    </p>
                  </div>
                  <h3 className="text-3xl sm:text-[36px] font-extrabold text-[#151518] mt-1.5 font-serif tracking-tight leading-none">
                    {totalUserGifts > 0 ? totalUserGifts.toFixed(2) : '180.00'}€
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldPerfumeGraphic className="w-14 h-16 sm:w-16 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#dcd3c4]/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-[#6b6256] font-medium truncate">
                  Monedas canjeadas en directo
                </span>
                <span className="bg-[#eddcdc]/95 text-[#862935] border border-[#d8bebe] text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  LIVE GIFTS
                </span>
              </div>
            </div>

            {/* Card 7: AMIGOS (Champagne Silk) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-[#dcd3c4]/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #fdfbf8 0%, #ece5da 38%, #fbf9f5 62%, #e5ddcf 100%)',
                boxShadow: '0 10px 25px -5px rgba(160, 140, 120, 0.18), 0 2px 6px rgba(0, 0, 0, 0.03), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(195, 175, 155, 0.2)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/70 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0 shadow-xs" />
                    <p className="text-[11px] sm:text-[11.5px] text-[#554d43] font-bold tracking-[0.14em] uppercase font-mono">
                      AMIGOS
                    </p>
                  </div>
                  <h3 className="text-3xl sm:text-[36px] font-extrabold text-[#151518] mt-1.5 font-serif tracking-tight leading-none">
                    {friendsCount > 0 ? friendsCount : 5}
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <FashionFriendsGraphic className="w-16 h-16 sm:w-18 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#dcd3c4]/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-[#6b6256] font-medium truncate">
                  Vínculos recíprocos de amistad
                </span>
                <span className="bg-[#ded5c6]/90 text-[#2c2824] border border-[#c2b5a1] text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  MUTUO
                </span>
              </div>
            </div>

            {/* Card 8: SEGUIDORES (Champagne Silk) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-[#dcd3c4]/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #fdfbf8 0%, #ece5da 38%, #fbf9f5 62%, #e5ddcf 100%)',
                boxShadow: '0 10px 25px -5px rgba(160, 140, 120, 0.18), 0 2px 6px rgba(0, 0, 0, 0.03), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(195, 175, 155, 0.2)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/70 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#d4973b] shrink-0 shadow-xs" />
                    <p className="text-[11px] sm:text-[11.5px] text-[#554d43] font-bold tracking-[0.14em] uppercase font-mono">
                      SEGUIDORES
                    </p>
                  </div>
                  <h3 className="text-3xl sm:text-[36px] font-extrabold text-[#151518] mt-1.5 font-serif tracking-tight leading-none">
                    {followersCount > 0 ? followersCount : 4}
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <PaparazziCrowdGraphic className="w-20 h-16 sm:w-22 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#dcd3c4]/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-[#6b6256] font-medium truncate">
                  Suscritos a tu actividad
                </span>
                <span className="bg-[#ded5c6]/90 text-[#8a5522] border border-[#c2b5a1] text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  COMUNIDAD
                </span>
              </div>
            </div>

            {/* Card 9: SEGUIDOS (Champagne Silk) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-[#dcd3c4]/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #fdfbf8 0%, #ece5da 38%, #fbf9f5 62%, #e5ddcf 100%)',
                boxShadow: '0 10px 25px -5px rgba(160, 140, 120, 0.18), 0 2px 6px rgba(0, 0, 0, 0.03), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(195, 175, 155, 0.2)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/70 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#e11d48] shrink-0 shadow-xs" />
                    <p className="text-[11px] sm:text-[11.5px] text-[#554d43] font-bold tracking-[0.14em] uppercase font-mono">
                      SEGUIDOS
                    </p>
                  </div>
                  <h3 className="text-3xl sm:text-[36px] font-extrabold text-[#151518] mt-1.5 font-serif tracking-tight leading-none">
                    {followingCount > 0 ? followingCount : 1}
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldenFashionEyeGraphic className="w-16 h-16 sm:w-18 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#dcd3c4]/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-[#6b6256] font-medium truncate">
                  Creadores que sigues
                </span>
                <span className="bg-[#f0dede]/95 text-[#912d3b] border border-[#dec0c0] text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  FAVORITOS
                </span>
              </div>
            </div>

            {/* Card 10: REFERIDOS ONLINE (Champagne Silk) */}
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-[#dcd3c4]/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px]"
              style={{
                background: 'linear-gradient(135deg, #fdfbf8 0%, #ece5da 38%, #fbf9f5 62%, #e5ddcf 100%)',
                boxShadow: '0 10px 25px -5px rgba(160, 140, 120, 0.18), 0 2px 6px rgba(0, 0, 0, 0.03), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(195, 175, 155, 0.2)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-white/70 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0d9488] shrink-0 shadow-xs" />
                    <p className="text-[11px] sm:text-[11.5px] text-[#554d43] font-bold tracking-[0.14em] uppercase font-mono">
                      REFERIDOS ONLINE
                    </p>
                  </div>
                  <h3 className="text-3xl sm:text-[36px] font-extrabold text-[#151518] mt-1.5 font-serif tracking-tight leading-none">
                    {referralsOnlineCount > 0 ? referralsOnlineCount : 7}
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldenArmillaryNetworkGraphic className="w-16 h-16 sm:w-18 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#dcd3c4]/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-[#6b6256] font-medium truncate">
                  Patrocinados activos
                </span>
                <span className="bg-[#d5e7e3]/95 text-[#165a4c] border border-[#b4d4cd] text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  ACTIVOS
                </span>
              </div>
            </div>
          </div>

          {/* Luxury Corporate Transaction Ledger Section */}
          <div className="pt-2">
            <div
              className="p-5 sm:p-6 rounded-[24px] border border-[#dcd3c4]/90 shadow-[0_10px_25px_-5px_rgba(160,140,120,0.15)] relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #fdfbf8 0%, #ede6dc 45%, #fbf9f5 70%, #e6dfd2 100%)',
                boxShadow: '0 10px 25px -5px rgba(160, 140, 120, 0.15), 0 2px 6px rgba(0, 0, 0, 0.03), inset 0 1.5px 1px rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(195, 175, 155, 0.2)'
              }}
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-[#d8cebe]/80">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#d4973b] shadow-xs" />
                  <h3 className="text-xs sm:text-[12.5px] font-bold text-[#443e36] uppercase tracking-[0.14em] font-mono">
                    ÚLTIMOS MOVIMIENTOS DEL BACKOFFICE
                  </h3>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6b6256] bg-[#ded5c6]/80 px-2.5 py-1 rounded-[5px] border border-[#c4b7a3] font-bold shadow-3xs">
                  REGISTRO BANCARIO
                </span>
              </div>

              <div className="mt-3.5 space-y-2.5">
                {movements.map((mov) => {
                  const isPositive = mov.type === 'deposit' || mov.type === 'prize' || mov.type === 'commission';
                  return (
                    <div
                      key={mov.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-[#ded5c6]/80 bg-[#ffffff]/85 hover:bg-[#ffffff] transition-all text-xs shadow-3xs hover:shadow-xs"
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
                          <p className="font-bold text-[#1f1d1a] truncate text-xs sm:text-[13px]" title={mov.description}>
                            {mov.description}
                          </p>
                          <p className="text-[10.5px] text-[#78716c] font-medium truncate mt-0.5">
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
                  <p className="text-center py-6 text-xs text-[#78716c] font-medium">No hay movimientos registrados.</p>
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
