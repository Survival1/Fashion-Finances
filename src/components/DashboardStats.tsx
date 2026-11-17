/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FinancialMovement, ModelProfile } from '../types';
import { TrendingUp, ArrowUpRight, ArrowDownLeft, Award, Users, Wallet, Layers, Gift, UserCheck, UserPlus, Eye, Globe } from 'lucide-react';
import {
  LuxuryPurseGraphic,
  GoldenMannequinGraphic,
  GoldenSpoolPearlsGraphic,
  GoldRibbonSGraphic,
  GoldPerfumeGraphic,
  FashionFriendsGraphic,
  PaparazziCrowdGraphic,
  GoldenFashionEyeGraphic,
  GoldenArmillaryNetworkGraphic,
  GoldenLuxuryHeartGraphic,
  GoldenRunwayProjectsGraphic,
  GoldenVaultWithdrawalGraphic
} from './FinanceIcons';
import { computeTotalRankingAndVideoLikes } from '../utils/likesCounter';
import { useSyncedParticipatedProjects } from '../utils/participatedProjects';

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
  onOpenFriendsModal?: () => void;
  onOpenFollowingModal?: () => void;
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
  onOpenFriendsModal,
  onOpenFollowingModal,
  friendsCount: rawFriendsCount = 11,
  followersCount: rawFollowersCount = 8,
  followingCount: rawFollowingCount = 14,
  referralsOnlineCount: rawReferralsOnlineCount = 7,
  isVisitor = false
}: DashboardStatsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'charts'>('overview');
  const [highlightedChart, setHighlightedChart] = useState<'projects' | 'withdrawn' | null>(null);
  const [likesSyncTick, setLikesSyncTick] = useState(0);

  useEffect(() => {
    const refreshLikes = () => setLikesSyncTick((t) => t + 1);
    window.addEventListener('ranking_likes_updated', refreshLikes);
    window.addEventListener('saved_videos_updated', refreshLikes);
    window.addEventListener('coll_casting_live_videos_updated', refreshLikes);
    window.addEventListener('storage', refreshLikes);
    return () => {
      window.removeEventListener('ranking_likes_updated', refreshLikes);
      window.removeEventListener('saved_videos_updated', refreshLikes);
      window.removeEventListener('coll_casting_live_videos_updated', refreshLikes);
      window.removeEventListener('storage', refreshLikes);
    };
  }, []);

  const totalSyncedLikes = React.useMemo(() => {
    return computeTotalRankingAndVideoLikes(models);
  }, [models, likesSyncTick]);

  const {
    effectiveTotalInvested: syncedTotalInvested,
    participatedProjects,
    participatedProjectsTotal
  } = useSyncedParticipatedProjects(rawTotalInvested, isVisitor);

  const movements = isVisitor ? [] : initialMovements;
  const balance = isVisitor ? 0 : rawBalance;
  const totalEarnings = isVisitor ? 0 : rawTotalEarnings;
  const totalInvested = isVisitor ? 0 : syncedTotalInvested;
  const totalCommissions = isVisitor ? 0 : rawTotalCommissions;
  const friendsCount = isVisitor ? 0 : (rawFriendsCount > 0 ? rawFriendsCount : 11);
  const followersCount = isVisitor ? 0 : (rawFollowersCount > 0 ? rawFollowersCount : 8);
  const followingCount = isVisitor ? 0 : rawFollowingCount;
  const referralsOnlineCount = isVisitor ? 0 : (rawReferralsOnlineCount > 0 ? rawReferralsOnlineCount : 7);

  const sponsorModel = isVisitor ? undefined : models.find(m => m.id === patrocinadorId);

  // Compute metrics
  const withdrawalTotal = isVisitor ? 0 : movements.filter(m => m.type === 'withdrawal').reduce((sum, m) => sum + Math.abs(m.amount), 0);
  
  // Total profit or net benefits
  const netProfit = isVisitor ? 0 : totalEarnings + totalCommissions - totalInvested;

  // Compute user gifts
  const userGiftsBase = isVisitor ? 0 : 180.00;
  const userGiftsFromMovements = isVisitor ? 0 : movements
    .filter(m => m.description.toLowerCase().includes('regalo') || m.description.toLowerCase().includes('rosa') || m.description.toLowerCase().includes('perfume') || m.description.toLowerCase().includes('helado'))
    .reduce((sum, m) => sum + Math.abs(m.amount), 0);
  const totalUserGifts = userGiftsBase + userGiftsFromMovements;

  const midSaldoSacado = React.useMemo(
    () => (isVisitor ? 0 : Math.max(15, withdrawalTotal / 2)),
    [isVisitor, withdrawalTotal]
  );

  const totalSaldoSacado = React.useMemo(
    () => (isVisitor ? 0 : Math.max(45, withdrawalTotal)),
    [isVisitor, withdrawalTotal]
  );

  const handleOpenLinkedChart = (target: 'projects' | 'withdrawn') => {
    setActiveTab('charts');
    setHighlightedChart(target);
    setTimeout(() => {
      const elId = target === 'projects' ? 'chart-proyectos-participados' : 'chart-saldo-sacado';
      document.getElementById(elId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 90);
    setTimeout(() => {
      setHighlightedChart((curr) => (curr === target ? null : curr));
    }, 2400);
  };

  const displayedBalance = isVisitor
    ? 0
    : ((movements.length > 0 || totalInvested > 0 || totalEarnings > 0)
        ? balance
        : (balance > 0 ? (balance === 45.5 ? 1500 : balance) : 1500));

  // Render elegant custom SVG line chart for Balance Evolution
  // Let's draft coordinate points for 6 months (Jan - Jun) based on transaction data
  const chartPoints = [
    { month: 'Ene', balance: 0, invested: 0 },
    { month: 'Feb', balance: 50, invested: 10 },
    { month: 'Mar', balance: 40, invested: 20 },
    { month: 'Abr', balance: 90, invested: 30 },
    { month: 'May', balance: displayedBalance, invested: totalInvested }
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

  const prizeChartPoints = totalEarnings > 0
    ? [
        { month: 'Ene', amount: 0 },
        { month: 'Feb', amount: Number((totalEarnings * 0.2).toFixed(0)) },
        { month: 'Mar', amount: Number((totalEarnings * 0.45).toFixed(0)) },
        { month: 'Abr', amount: Number((totalEarnings * 0.72).toFixed(0)) },
        { month: 'May', amount: totalEarnings },
      ]
    : [
        { month: 'Ene', amount: 0 },
        { month: 'Feb', amount: 0 },
        { month: 'Mar', amount: 0 },
        { month: 'Abr', amount: 0 },
        { month: 'May', amount: 0 },
      ];

  const prizeChartWidth = 460;
  const prizeChartHeight = 140;
  const prizeBaselineY = 116;
  const prizePlotSpan = 90;
  const prizeMaxVal = Math.max(...prizeChartPoints.map((p) => p.amount), 100);

  const prizeCoords = prizeChartPoints.map((p, index) => {
    const x = (index / (prizeChartPoints.length - 1)) * (prizeChartWidth - 44) + 22;
    const y = prizeBaselineY - (p.amount / prizeMaxVal) * prizePlotSpan;
    return { ...p, x, y };
  });

  const prizeLinePath = prizeCoords
    .map((pt, index) => `${index === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
    .join(' ');

  const prizeAreaPath =
    prizeCoords.length > 0
      ? `${prizeLinePath} L ${prizeCoords[prizeCoords.length - 1].x} ${prizeBaselineY} L ${prizeCoords[0].x} ${prizeBaselineY} Z`
      : '';

  const investChartPoints = totalInvested > 0
    ? [
        { month: 'Ene', amount: 0 },
        { month: 'Feb', amount: Number((totalInvested * 0.25).toFixed(0)) },
        { month: 'Mar', amount: Number((totalInvested * 0.5).toFixed(0)) },
        { month: 'Abr', amount: Number((totalInvested * 0.78).toFixed(0)) },
        { month: 'May', amount: totalInvested },
      ]
    : [
        { month: 'Ene', amount: 0 },
        { month: 'Feb', amount: 0 },
        { month: 'Mar', amount: 0 },
        { month: 'Abr', amount: 0 },
        { month: 'May', amount: 0 },
      ];

  const investMaxVal = Math.max(...investChartPoints.map((p) => p.amount), 100);
  const investCoords = investChartPoints.map((p, index) => {
    const x = (index / (investChartPoints.length - 1)) * (prizeChartWidth - 44) + 22;
    const y = prizeBaselineY - (p.amount / investMaxVal) * prizePlotSpan;
    return { ...p, x, y };
  });
  const investLinePath = investCoords
    .map((pt, index) => `${index === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
    .join(' ');
  const investAreaPath =
    investCoords.length > 0
      ? `${investLinePath} L ${investCoords[investCoords.length - 1].x} ${prizeBaselineY} L ${investCoords[0].x} ${prizeBaselineY} Z`
      : '';

  const commissionChartPoints = totalCommissions > 0
    ? [
        { month: 'Ene', amount: 0 },
        { month: 'Feb', amount: Number((totalCommissions * 0.18).toFixed(0)) },
        { month: 'Mar', amount: Number((totalCommissions * 0.42).toFixed(0)) },
        { month: 'Abr', amount: Number((totalCommissions * 0.7).toFixed(0)) },
        { month: 'May', amount: totalCommissions },
      ]
    : [
        { month: 'Ene', amount: 0 },
        { month: 'Feb', amount: 0 },
        { month: 'Mar', amount: 0 },
        { month: 'Abr', amount: 0 },
        { month: 'May', amount: 0 },
      ];

  const commissionMaxVal = Math.max(...commissionChartPoints.map((p) => p.amount), 100);
  const commissionCoords = commissionChartPoints.map((p, index) => {
    const x = (index / (commissionChartPoints.length - 1)) * (prizeChartWidth - 44) + 22;
    const y = prizeBaselineY - (p.amount / commissionMaxVal) * prizePlotSpan;
    return { ...p, x, y };
  });
  const commissionLinePath = commissionCoords
    .map((pt, index) => `${index === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
    .join(' ');
  const commissionAreaPath =
    commissionCoords.length > 0
      ? `${commissionLinePath} L ${commissionCoords[commissionCoords.length - 1].x} ${prizeBaselineY} L ${commissionCoords[0].x} ${prizeBaselineY} Z`
      : '';

  const projectsChartMax = Math.max(...participatedProjects.map((p) => p.amount), 100);
  const projectBarItems = participatedProjects.map((p, idx) => {
    const shortLabels = ['Eco-Fashion', 'Elite Drop', 'Retro Denim', 'Sunset Swim'];
    const barFills = ['url(#projBarGrad0)', 'url(#projBarGrad1)', 'url(#projBarGrad2)', 'url(#projBarGrad3)'];
    const barH = Math.max(12, Math.round((p.amount / projectsChartMax) * 84));
    const x = 66 + idx * 108;
    return {
      label: shortLabels[idx] || p.name.split(' ')[0],
      amount: p.amount,
      pct: p.pct,
      x,
      barH,
      fill: barFills[idx] || 'url(#projBarGrad0)',
    };
  });

  const formatCompactLikes = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return `${val}`;
  };

  const likesChartPoints = totalSyncedLikes > 0
    ? [
        { month: 'Ene', likes: Math.round(totalSyncedLikes * 0.62) },
        { month: 'Feb', likes: Math.round(totalSyncedLikes * 0.72) },
        { month: 'Mar', likes: Math.round(totalSyncedLikes * 0.83) },
        { month: 'Abr', likes: Math.round(totalSyncedLikes * 0.92) },
        { month: 'May', likes: totalSyncedLikes },
      ]
    : [
        { month: 'Ene', likes: 0 },
        { month: 'Feb', likes: 0 },
        { month: 'Mar', likes: 0 },
        { month: 'Abr', likes: 0 },
        { month: 'May', likes: 0 },
      ];

  const likesMaxVal = Math.max(...likesChartPoints.map((p) => p.likes), 100);
  const likesCoords = likesChartPoints.map((p, index) => {
    const x = (index / (likesChartPoints.length - 1)) * (prizeChartWidth - 68) + 34;
    const y = prizeBaselineY - (p.likes / likesMaxVal) * prizePlotSpan;
    return { ...p, x, y };
  });
  const likesLinePath = likesCoords
    .map((pt, index) => `${index === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`)
    .join(' ');
  const likesAreaPath =
    likesCoords.length > 0
      ? `${likesLinePath} L ${likesCoords[likesCoords.length - 1].x} ${prizeBaselineY} L ${likesCoords[0].x} ${prizeBaselineY} Z`
      : '';

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
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none tabular-nums">
                    {displayedBalance.toFixed(2)}€
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
              id="card-inversion-rondas"
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
              id="card-sponsor-comisiones"
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
              onClick={() => {
                if (onOpenFriendsModal) {
                  onOpenFriendsModal();
                } else if (onNavigateToTab) {
                  onNavigateToTab('profile');
                  window.dispatchEvent(new CustomEvent('open-friends-modal-tab', { detail: { subTab: 'friends' } }));
                } else {
                  window.dispatchEvent(new CustomEvent('open-friends-modal-tab', { detail: { subTab: 'friends' } }));
                }
              }}
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px] cursor-pointer"
              title="Ver y gestionar amigos sincronizados"
              id="card-amigos-mis-finanzas"
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
                    {friendsCount > 0 ? friendsCount : 11}
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
              onClick={() => onOpenFollowingModal?.()}
              className={`p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px] ${onOpenFollowingModal ? 'cursor-pointer' : ''}`}
              title="Ver todos los perfiles seguidos"
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
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none tabular-nums">
                    {followingCount}
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

            {/* Card 10: CONTADOR DE LIKES (Sincronizado en tiempo real con Ranking / Reglas de Likes) */}
            <div
              onClick={() => onNavigateToTab?.('ranking')}
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px] cursor-pointer"
              title="Ver contador global en el Ranking"
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
                      TOTAL DE LIKES
                    </p>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none tabular-nums">
                    {totalSyncedLikes.toLocaleString()}
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldenLuxuryHeartGraphic className="w-16 h-16 sm:w-18 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  Sincronizado con el ranking
                </span>
                <span className="bg-pink-100/90 text-[#BE185D] border border-pink-300/90 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  RANKING
                </span>
              </div>
            </div>

            {/* Card 11: PROYECTOS PARTICIPADOS (Vinculado con el contenedor "Proyectos en los que Participé") */}
            <div
              onClick={() => handleOpenLinkedChart('projects')}
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px] cursor-pointer"
              title="Ver gráfico de Proyectos en los que Participé"
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
                      PROYECTOS PARTICIPADOS
                    </p>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <h3 className="text-xl sm:text-2xl font-black text-rose-950 font-serif tracking-tight leading-none tabular-nums">
                      {participatedProjects.length}
                    </h3>
                    <span className="text-xs sm:text-sm font-mono font-extrabold text-pink-600">
                      ({participatedProjectsTotal.toFixed(1)}€)
                    </span>
                  </div>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldenRunwayProjectsGraphic className="w-16 h-16 sm:w-18 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  En los que participé
                </span>
                <span className="bg-pink-100/90 text-[#BE185D] border border-pink-300/90 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  PASARELAS
                </span>
              </div>
            </div>

            {/* Card 12: TOTAL DEL SALDO SACADO (Vinculado con el contenedor "Total del Saldo Sacado") */}
            <div
              onClick={() => handleOpenLinkedChart('withdrawn')}
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px] cursor-pointer"
              title="Ver gráfico de Total del Saldo Sacado"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F8 35%, #FDF2F8 68%, #FCE7F3 100%)',
                boxShadow: '0 10px 25px -5px rgba(225, 29, 72, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(244, 114, 182, 0.18)'
              }}
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-200/50 to-transparent rounded-full blur-xl pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_6px_#10b981]" />
                    <p className="text-[11px] sm:text-[11.5px] text-rose-900/75 font-bold tracking-[0.14em] uppercase font-mono">
                      TOTAL DEL SALDO SACADO
                    </p>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none tabular-nums">
                    {totalSaldoSacado.toFixed(2)}€
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldenVaultWithdrawalGraphic className="w-16 h-16 sm:w-18 sm:h-18" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  Retiros bancarios acumulados
                </span>
                <span className="bg-emerald-50/90 text-emerald-700 border border-emerald-300/80 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  SALDO SACADO
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

              {/* Sincronizado con el contenedor SALDO BACKOFFICE */}
              <div
                onClick={() => setActiveTab('overview')}
                className="mt-4 flex items-center justify-between gap-3 bg-gradient-to-r from-[#FFF5F8] via-[#FDF2F8] to-[#FCE7F3] px-3.5 py-2.5 rounded-xl border border-pink-200/80 cursor-pointer hover:border-pink-300 transition-all"
                title="Sincronizado con Saldo Backoffice"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#FF2D85] shrink-0 shadow-[0_0_6px_#ff2d85]" />
                  <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.14em] uppercase font-mono text-rose-900/80 truncate">
                    SALDO BACKOFFICE
                  </span>
                </div>
                <span className="text-base sm:text-lg font-black text-rose-950 font-serif tracking-tight leading-none tabular-nums shrink-0">
                  {displayedBalance.toFixed(2)}€
                </span>
              </div>
            </div>

            {/* PREMIOS GANADOS (80%) sincronizado (sin comparativa de ingresos vs egresos) */}
            <div
              onClick={() => setActiveTab('overview')}
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px] cursor-pointer"
              title="Sincronizado con Premios Ganados (80%)"
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
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none tabular-nums">
                    {totalEarnings.toFixed(2)}€
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldenMannequinGraphic className="w-14 h-16 sm:w-16 sm:h-18" />
                </div>
              </div>

              {/* Gráfica de evolución de Premios Ganados (80%) */}
              <div className="w-full my-3 relative z-10 bg-white/75 rounded-2xl border border-pink-200/70 px-3 pt-2.5 pb-1.5 shadow-inner">
                <svg viewBox={`0 0 ${prizeChartWidth} ${prizeChartHeight}`} className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="prizeChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E11D48" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="#FF2D85" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  <line x1="22" y1="26" x2={prizeChartWidth - 22} y2="26" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.6" />
                  <line x1="22" y1="56" x2={prizeChartWidth - 22} y2="56" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.6" />
                  <line x1="22" y1="86" x2={prizeChartWidth - 22} y2="86" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.6" />
                  <line x1="22" y1={prizeBaselineY} x2={prizeChartWidth - 22} y2={prizeBaselineY} stroke="#f472b6" strokeWidth="1" />

                  {prizeAreaPath && <path d={prizeAreaPath} fill="url(#prizeChartGrad)" />}
                  {prizeLinePath && <path d={prizeLinePath} fill="none" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

                  {prizeCoords.map((pt, idx) => (
                    <g key={idx} className="group">
                      <circle cx={pt.x} cy={pt.y} r="4.5" fill="#ffffff" stroke="#E11D48" strokeWidth="2.4" />
                      <circle cx={pt.x} cy={pt.y} r="9" fill="#FF2D85" fillOpacity="0.14" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      <text x={pt.x} y={pt.y - 11} textAnchor="middle" className="text-[10px] font-bold font-mono fill-rose-950 opacity-90 select-none">
                        {pt.amount.toFixed(0)}€
                      </text>
                      <text x={pt.x} y={prizeChartHeight - 3} textAnchor="middle" className="text-[10px] fill-rose-600 select-none font-medium">
                        {pt.month}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="mt-2 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  Retorno neto de financiación
                </span>
                <span className="bg-pink-100/90 text-[#BE185D] border border-pink-300/90 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  80% NET
                </span>
              </div>
            </div>
          </div>

          {/* Segunda fila sincronizada: INVERSIÓN RONDAS y SPONSOR COMISIONES (10%) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfica sincronizada: INVERSIÓN RONDAS */}
            <div
              onClick={() => {
                setActiveTab('overview');
                setTimeout(() => {
                  document.getElementById('card-inversion-rondas')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 90);
              }}
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px] cursor-pointer"
              title="Sincronizado con Inversión Rondas"
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
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none tabular-nums">
                    {totalInvested.toFixed(2)}€
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldenSpoolPearlsGraphic className="w-14 h-16 sm:w-16 sm:h-18" />
                </div>
              </div>

              <div className="w-full my-3 relative z-10 bg-white/75 rounded-2xl border border-pink-200/70 px-3 pt-2.5 pb-1.5 shadow-inner">
                <svg viewBox={`0 0 ${prizeChartWidth} ${prizeChartHeight}`} className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="investChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF2D85" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="#FF2D85" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  <line x1="22" y1="26" x2={prizeChartWidth - 22} y2="26" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.6" />
                  <line x1="22" y1="56" x2={prizeChartWidth - 22} y2="56" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.6" />
                  <line x1="22" y1="86" x2={prizeChartWidth - 22} y2="86" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.6" />
                  <line x1="22" y1={prizeBaselineY} x2={prizeChartWidth - 22} y2={prizeBaselineY} stroke="#f472b6" strokeWidth="1" />

                  {investAreaPath && <path d={investAreaPath} fill="url(#investChartGrad)" />}
                  {investLinePath && <path d={investLinePath} fill="none" stroke="#FF2D85" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

                  {investCoords.map((pt, idx) => (
                    <g key={idx} className="group">
                      <circle cx={pt.x} cy={pt.y} r="4.5" fill="#ffffff" stroke="#FF2D85" strokeWidth="2.4" />
                      <circle cx={pt.x} cy={pt.y} r="9" fill="#FF2D85" fillOpacity="0.14" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      <text x={pt.x} y={pt.y - 11} textAnchor="middle" className="text-[10px] font-bold font-mono fill-rose-950 opacity-90 select-none">
                        {pt.amount.toFixed(0)}€
                      </text>
                      <text x={pt.x} y={prizeChartHeight - 3} textAnchor="middle" className="text-[10px] fill-rose-600 select-none font-medium">
                        {pt.month}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="mt-2 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  Participación en sesiones de inversión
                </span>
                <span className="bg-pink-100/90 text-[#BE185D] border border-pink-300/90 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  RONDAS
                </span>
              </div>
            </div>

            {/* Gráfica sincronizada: SPONSOR COMISIONES (10%) */}
            <div
              onClick={() => {
                setActiveTab('overview');
                setTimeout(() => {
                  document.getElementById('card-sponsor-comisiones')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 90);
              }}
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px] cursor-pointer"
              title="Sincronizado con Sponsor Comisiones (10%)"
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
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none tabular-nums">
                    {totalCommissions.toFixed(2)}€
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldRibbonSGraphic className="w-14 h-16 sm:w-16 sm:h-18" />
                </div>
              </div>

              <div className="w-full my-3 relative z-10 bg-white/75 rounded-2xl border border-pink-200/70 px-3 pt-2.5 pb-1.5 shadow-inner">
                <svg viewBox={`0 0 ${prizeChartWidth} ${prizeChartHeight}`} className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="commissionChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  <line x1="22" y1="26" x2={prizeChartWidth - 22} y2="26" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.6" />
                  <line x1="22" y1="56" x2={prizeChartWidth - 22} y2="56" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.6" />
                  <line x1="22" y1="86" x2={prizeChartWidth - 22} y2="86" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.6" />
                  <line x1="22" y1={prizeBaselineY} x2={prizeChartWidth - 22} y2={prizeBaselineY} stroke="#6ee7b7" strokeWidth="1" />

                  {commissionAreaPath && <path d={commissionAreaPath} fill="url(#commissionChartGrad)" />}
                  {commissionLinePath && <path d={commissionLinePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

                  {commissionCoords.map((pt, idx) => (
                    <g key={idx} className="group">
                      <circle cx={pt.x} cy={pt.y} r="4.5" fill="#ffffff" stroke="#10b981" strokeWidth="2.4" />
                      <circle cx={pt.x} cy={pt.y} r="9" fill="#10b981" fillOpacity="0.14" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      <text x={pt.x} y={pt.y - 11} textAnchor="middle" className="text-[10px] font-bold font-mono fill-rose-950 opacity-90 select-none">
                        {pt.amount.toFixed(0)}€
                      </text>
                      <text x={pt.x} y={prizeChartHeight - 3} textAnchor="middle" className="text-[10px] fill-rose-600 select-none font-medium">
                        {pt.month}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="mt-2 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  Ganancia por patrocinados
                </span>
                <span className="bg-emerald-50/90 text-emerald-800 border border-emerald-300/80 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  10% FEE
                </span>
              </div>
            </div>
          </div>

          {/* Bento Grid with the 5 required custom analytical charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Gráfico de los Proyectos en los que Participé */}
            <div
              id="chart-proyectos-participados"
              onClick={() => setActiveTab('overview')}
              className={`bg-white/85 rounded-2xl p-5 border flex flex-col justify-between space-y-4 shadow-xs transition-all cursor-pointer ${
                highlightedChart === 'projects'
                  ? 'border-[#ff2d85] ring-2 ring-[#ff2d85]/40 shadow-md scale-[1.01]'
                  : 'border-pink-200/80 hover:border-pink-300'
              }`}
              title="Volver a Resumen General"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-black tracking-widest text-pink-600 uppercase block">PROYECTOS PARTICIPADOS</span>
                  <span className="text-[10px] font-mono font-bold text-pink-600 bg-pink-50 border border-pink-200/80 px-2 py-0.5 rounded-md">
                    {participatedProjects.length} · {participatedProjectsTotal.toFixed(1)}€
                  </span>
                </div>
                <h4 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                  Proyectos en los que Participé
                </h4>
                <p className="text-[11px] text-rose-700/60">Distribución de capital e inversión activa por pasarela.</p>
              </div>

              <div className="space-y-3 pt-2">
                {participatedProjects.map((p, idx) => (
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

              {/* Sincronizado con el contenedor INVERSIÓN RONDAS */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('overview');
                  setTimeout(() => {
                    document.getElementById('card-inversion-rondas')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 90);
                }}
                className="mt-4 flex items-center justify-between gap-3 bg-gradient-to-r from-[#FFF5F8] via-[#FDF2F8] to-[#FCE7F3] px-3.5 py-2.5 rounded-xl border border-pink-200/80 cursor-pointer hover:border-pink-300 transition-all"
                title="Sincronizado con Inversión Rondas"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#FF2D85] shrink-0 shadow-[0_0_6px_#ff2d85]" />
                  <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.14em] uppercase font-mono text-rose-900/80 truncate">
                    INVERSIÓN RONDAS
                  </span>
                </div>
                <span className="text-base sm:text-lg font-black text-rose-950 font-serif tracking-tight leading-none tabular-nums shrink-0">
                  {totalInvested.toFixed(2)}€
                </span>
              </div>
            </div>

            {/* 2. Gráfico del Total del Saldo Sacado */}
            <div
              id="chart-saldo-sacado"
              onClick={() => setActiveTab('overview')}
              className={`bg-white/85 rounded-2xl p-5 border flex flex-col justify-between space-y-4 shadow-xs transition-all cursor-pointer ${
                highlightedChart === 'withdrawn'
                  ? 'border-emerald-500 ring-2 ring-emerald-400/40 shadow-md scale-[1.01]'
                  : 'border-pink-200/80 hover:border-pink-300'
              }`}
              title="Volver a Resumen General"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-black tracking-widest text-pink-600 uppercase block">SALDO SACADO</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                    {totalSaldoSacado.toFixed(2)}€
                  </span>
                </div>
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
                  <text x="110" y="40" textAnchor="middle" className="text-[8px] font-bold font-mono fill-rose-950">{midSaldoSacado.toFixed(0)}€</text>
                  <text x="210" y="10" textAnchor="middle" className="text-[8px] font-bold font-mono fill-rose-950">{totalSaldoSacado.toFixed(0)}€</text>
                  
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

              <div className="pt-2">
                <svg viewBox="0 0 240 105" className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="refBar1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" stopOpacity="0.75" />
                    </linearGradient>
                    <linearGradient id="refBar2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF2D85" />
                      <stop offset="100%" stopColor="#f472b6" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="refBar3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E11D48" />
                      <stop offset="100%" stopColor="#fb7185" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Grid & baseline */}
                  <line x1="16" y1="22" x2="224" y2="22" stroke="#fbcfe8" strokeDasharray="3 3" strokeWidth="0.6" />
                  <line x1="16" y1="54" x2="224" y2="54" stroke="#fbcfe8" strokeDasharray="3 3" strokeWidth="0.6" />
                  <line x1="16" y1="86" x2="224" y2="86" stroke="#f9a8d4" strokeWidth="1" />

                  {[
                    { level: 'NIVEL 1', count: 18, x: 48, barH: 48, fill: 'url(#refBar1)' },
                    { level: 'NIVEL 2', count: 24, x: 120, barH: 64, fill: 'url(#refBar2)' },
                    { level: 'NIVEL 3', count: 8, x: 192, barH: 24, fill: 'url(#refBar3)' }
                  ].map((lv, idx) => {
                    const barW = 34;
                    const barX = lv.x - barW / 2;
                    const barY = 86 - lv.barH;
                    return (
                      <g key={idx}>
                        <rect
                          x={barX}
                          y={barY}
                          width={barW}
                          height={lv.barH}
                          rx="6"
                          fill={lv.fill}
                        />
                        <text
                          x={lv.x}
                          y={barY - 6}
                          textAnchor="middle"
                          className="text-[9px] font-bold font-mono fill-rose-950 select-none"
                        >
                          {lv.count} act
                        </text>
                        <text
                          x={lv.x}
                          y="100"
                          textAnchor="middle"
                          className="text-[8px] font-bold fill-rose-500 tracking-wider select-none"
                        >
                          {lv.level}
                        </text>
                      </g>
                    );
                  })}
                </svg>
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

          {/* Fila inferior sincronizada: PROYECTOS PARTICIPADOS y TOTAL DE LIKES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PROYECTOS PARTICIPADOS (mismo diseño y datos sincronizados que en Resumen General) */}
            <div
              onClick={() => {
                setHighlightedChart('projects');
                document.getElementById('chart-proyectos-participados')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                  setHighlightedChart((curr) => (curr === 'projects' ? null : curr));
                }, 2400);
              }}
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px] cursor-pointer"
              title="Ir al gráfico de Proyectos en los que Participé"
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
                      PROYECTOS PARTICIPADOS
                    </p>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <h3 className="text-xl sm:text-2xl font-black text-rose-950 font-serif tracking-tight leading-none tabular-nums">
                      {participatedProjects.length}
                    </h3>
                    <span className="text-xs sm:text-sm font-mono font-extrabold text-pink-600">
                      ({participatedProjectsTotal.toFixed(1)}€)
                    </span>
                  </div>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldenRunwayProjectsGraphic className="w-16 h-16 sm:w-18 sm:h-18" />
                </div>
              </div>

              <div className="w-full my-3 relative z-10 bg-white/75 rounded-2xl border border-pink-200/70 px-3 pt-2.5 pb-1.5 shadow-inner">
                <svg viewBox={`0 0 ${prizeChartWidth} ${prizeChartHeight}`} className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="projBarGrad0" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF2D85" />
                      <stop offset="100%" stopColor="#f472b6" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="projBarGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E11D48" />
                      <stop offset="100%" stopColor="#fb7185" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="projBarGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="projBarGrad3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  <line x1="22" y1="26" x2={prizeChartWidth - 22} y2="26" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.6" />
                  <line x1="22" y1="56" x2={prizeChartWidth - 22} y2="56" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.6" />
                  <line x1="22" y1="86" x2={prizeChartWidth - 22} y2="86" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.6" />
                  <line x1="22" y1={prizeBaselineY} x2={prizeChartWidth - 22} y2={prizeBaselineY} stroke="#f472b6" strokeWidth="1" />

                  {projectBarItems.map((item, idx) => {
                    const barW = 46;
                    const barX = item.x - barW / 2;
                    const barY = prizeBaselineY - item.barH;
                    return (
                      <g key={idx}>
                        <rect
                          x={barX}
                          y={barY}
                          width={barW}
                          height={item.barH}
                          rx="7"
                          fill={item.fill}
                        />
                        <text
                          x={item.x}
                          y={barY - 8}
                          textAnchor="middle"
                          className="text-[10px] font-bold font-mono fill-rose-950 select-none"
                        >
                          {item.amount.toFixed(0)}€
                        </text>
                        <text
                          x={item.x}
                          y={prizeChartHeight - 3}
                          textAnchor="middle"
                          className="text-[9.5px] fill-rose-700 select-none font-semibold"
                        >
                          {item.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="mt-2 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  En los que participé
                </span>
                <span className="bg-pink-100/90 text-[#BE185D] border border-pink-300/90 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  PASARELAS
                </span>
              </div>
            </div>

            {/* TOTAL DE LIKES (mismo diseño y datos sincronizados que en Resumen General) */}
            <div
              onClick={() => onNavigateToTab?.('ranking')}
              className="p-5 sm:p-6 rounded-[24px] border border-pink-200/90 hover:border-pink-300/90 hover:scale-[1.01] transition-all relative overflow-hidden flex flex-col justify-between min-h-[170px] cursor-pointer"
              title="Ver contador global en el Ranking"
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
                      TOTAL DE LIKES
                    </p>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-950 mt-1.5 font-serif tracking-tight leading-none tabular-nums">
                    {totalSyncedLikes.toLocaleString()}
                  </h3>
                </div>
                <div className="shrink-0 pl-2">
                  <GoldenLuxuryHeartGraphic className="w-16 h-16 sm:w-18 sm:h-18" />
                </div>
              </div>

              <div className="w-full my-3 relative z-10 bg-white/75 rounded-2xl border border-pink-200/70 px-3 pt-2.5 pb-1.5 shadow-inner">
                <svg viewBox={`0 0 ${prizeChartWidth} ${prizeChartHeight}`} className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="likesChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF2D85" stopOpacity="0.26" />
                      <stop offset="100%" stopColor="#FF2D85" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>

                  <line x1="22" y1="26" x2={prizeChartWidth - 22} y2="26" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.6" />
                  <line x1="22" y1="56" x2={prizeChartWidth - 22} y2="56" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.6" />
                  <line x1="22" y1="86" x2={prizeChartWidth - 22} y2="86" stroke="#fbcfe8" strokeDasharray="4 4" strokeWidth="0.6" />
                  <line x1="22" y1={prizeBaselineY} x2={prizeChartWidth - 22} y2={prizeBaselineY} stroke="#f472b6" strokeWidth="1" />

                  {likesAreaPath && <path d={likesAreaPath} fill="url(#likesChartGrad)" />}
                  {likesLinePath && <path d={likesLinePath} fill="none" stroke="#FF2D85" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

                  {likesCoords.map((pt, idx) => (
                    <g key={idx} className="group">
                      <circle cx={pt.x} cy={pt.y} r="4.5" fill="#ffffff" stroke="#FF2D85" strokeWidth="2.4" />
                      <circle cx={pt.x} cy={pt.y} r="9" fill="#FF2D85" fillOpacity="0.14" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      <text x={pt.x} y={pt.y - 11} textAnchor="middle" className="text-[10px] font-bold font-mono fill-rose-950 opacity-90 select-none">
                        {formatCompactLikes(pt.likes)}
                      </text>
                      <text x={pt.x} y={prizeChartHeight - 3} textAnchor="middle" className="text-[10px] fill-rose-600 select-none font-medium">
                        {pt.month}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="mt-2 pt-3 border-t border-pink-200/80 flex items-center justify-between relative z-10">
                <span className="text-[11px] sm:text-[11.5px] text-rose-800/70 font-medium truncate">
                  Sincronizado con el ranking
                </span>
                <span className="bg-pink-100/90 text-[#BE185D] border border-pink-300/90 text-[10px] sm:text-[10.5px] font-black px-2.5 py-1 rounded-[5px] tracking-wider font-mono shadow-3xs shrink-0 uppercase">
                  RANKING
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
