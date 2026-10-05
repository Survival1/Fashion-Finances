import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Crown, 
  Settings, 
  Database, 
  Users, 
  Video, 
  Wallet, 
  Gift, 
  Camera, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Download, 
  Trash2, 
  Plus, 
  Sparkles, 
  Award, 
  Layers, 
  Clock, 
  ArrowUpRight,
  Sliders,
  Check,
  X,
  ExternalLink,
  Flame,
  Radio,
  Lock,
  Unlock,
  Coins
} from 'lucide-react';
import { ModelProfile, ProjectData, InvestmentSession } from '../types';

interface AdminMasterDashboardProps {
  models: ModelProfile[];
  projects: ProjectData[];
  sessions: InvestmentSession[];
  userProfile: any;
  onUpdateModels: (models: ModelProfile[]) => void;
  onUpdateProjects: (projects: ProjectData[]) => void;
  onUpdateUserProfile: (profile: any) => void;
  onNavigateToTab: (tab: string) => void;
  onResetDatabase: () => void;
}

export default function AdminMasterDashboard({
  models,
  projects,
  sessions,
  userProfile,
  onUpdateModels,
  onUpdateProjects,
  onUpdateUserProfile,
  onNavigateToTab,
  onResetDatabase
}: AdminMasterDashboardProps) {
  // Service management tabs
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'models' | 'casting' | 'finance' | 'stories' | 'gifts' | 'users' | 'system'>('overview');

  // Search & Filters
  const [modelSearch, setModelSearch] = useState('');
  const [modelGenderFilter, setModelGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  
  // Real-time Stories state from localStorage
  const [activeStories, setActiveStories] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem('active_stories');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  });

  // System maintenance mode state
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(() => {
    return localStorage.getItem('system_maintenance_mode') === 'true';
  });

  // Selected round in Casting Live
  const [activeRoundName, setActiveRoundName] = useState<string>(() => {
    return localStorage.getItem('admin_selected_casting_round') || 'Streetwear & Urban';
  });

  // Admin toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Reload stories on event
  useEffect(() => {
    const handleStoriesUpdate = () => {
      try {
        const raw = localStorage.getItem('active_stories');
        if (raw) setActiveStories(JSON.parse(raw));
      } catch (e) {}
    };
    window.addEventListener('stories-updated', handleStoriesUpdate);
    return () => window.removeEventListener('stories-updated', handleStoriesUpdate);
  }, []);

  // Toggle Model Verification Badge
  const handleToggleVerified = (modelId: string) => {
    const updated = models.map(m => {
      if (m.id === modelId) {
        const newStatus = !m.verified;
        showToast(`Modelo ${m.name}: Verificación ${newStatus ? 'ACTIVADA' : 'DESACTIVADA'}`);
        return { ...m, verified: newStatus };
      }
      return m;
    });
    onUpdateModels(updated);
  };

  // Boost Model Votes/Likes
  const handleBoostVotes = (modelId: string, amount: number) => {
    const updated = models.map(m => {
      if (m.id === modelId) {
        const newLikes = (m.totalLikes || 0) + amount;
        showToast(`+${amount} votos añadidos a ${m.name}`);
        return { ...m, totalLikes: newLikes, followersCount: (m.followersCount || 0) + Math.floor(amount / 2) };
      }
      return m;
    });
    onUpdateModels(updated);
  };

  // Change Active Casting Round
  const handleChangeActiveRound = (roundName: string) => {
    setActiveRoundName(roundName);
    localStorage.setItem('admin_selected_casting_round', roundName);
    localStorage.setItem('casting_live_active_round_key', roundName);
    window.dispatchEvent(new CustomEvent('admin_round_changed', { detail: { roundName } }));
    showToast(`Ronda de Pasarela cambiada a: ${roundName}`);
  };

  // Delete a Story
  const handleDeleteStory = (storyId: string) => {
    const updated = activeStories.filter(s => s.id !== storyId);
    setActiveStories(updated);
    localStorage.setItem('active_stories', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('stories-updated'));
    showToast('Historia eliminada por la Administración');
  };

  // Inject Test Funds into Admin Backoffice
  const handleInjectFunds = (amount: number) => {
    const updated = {
      ...userProfile,
      balance: userProfile.balance + amount
    };
    onUpdateUserProfile(updated);
    showToast(`+${amount.toLocaleString()}€ inyectados en la cuenta de Administración`);
  };

  // Toggle Maintenance Mode
  const handleToggleMaintenance = () => {
    const nextVal = !isMaintenanceMode;
    setIsMaintenanceMode(nextVal);
    localStorage.setItem('system_maintenance_mode', String(nextVal));
    showToast(`Modo Mantenimiento ${nextVal ? 'ACTIVADO' : 'DESACTIVADO'}`);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      modelsCount: models.length,
      models,
      projects,
      sessions,
      stories: activeStories,
      adminProfile: userProfile
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fashion_finances_backup_${Date.now()}.json`;
    a.click();
    showToast('Copia de seguridad JSON descargada');
  };

  // Filter models
  const filteredModels = models.filter(m => {
    if (modelGenderFilter !== 'all' && m.gender !== modelGenderFilter) return false;
    if (modelSearch) {
      const q = modelSearch.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.username.toLowerCase().includes(q) || m.fashionAgency?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in text-slate-900 pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 border border-amber-500/80 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-bold font-mono">{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Master Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>Modo Administrador Master · Control 100%</span>
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${
                isMaintenanceMode 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isMaintenanceMode ? 'bg-rose-400' : 'bg-emerald-400 animate-ping'}`} />
                <span>{isMaintenanceMode ? 'Mantenimiento' : 'Servicios Online'}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white flex items-center gap-2">
              <span>Panel de Control de Todos los Servicios</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Supervisión completa y en tiempo real: Ranking de Modelos, Casting Live, Historias 24h, Mesas de Inversión, Regalos VIP y Base de Datos.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => handleInjectFunds(10000)}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-amber-500/20"
              title="Añadir 10.000€ simulados"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>+10.000€ Fondos</span>
            </button>

            <button
              onClick={handleExportBackup}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-white/10"
              title="Descargar copia JSON completa"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup JSON</span>
            </button>

            <button
              onClick={handleToggleMaintenance}
              className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border ${
                isMaintenanceMode 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500' 
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/10'
              }`}
            >
              {isMaintenanceMode ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{isMaintenanceMode ? 'Salir Mantenimiento' : 'Modo Mantenimiento'}</span>
            </button>
          </div>
        </div>

        {/* Global Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10 relative z-10">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Modelos Registrados</span>
            <span className="text-xl font-black font-mono text-white mt-0.5 block">{models.length}</span>
            <span className="text-[10px] text-emerald-400 font-semibold">{models.filter(m => m.verified).length} verificadas</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Mesas de Inversión</span>
            <span className="text-xl font-black font-mono text-amber-400 mt-0.5 block">{projects.length}</span>
            <span className="text-[10px] text-slate-300">Crowdfunding activo</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Historias 24h Activas</span>
            <span className="text-xl font-black font-mono text-rose-400 mt-0.5 block">{activeStories.length}</span>
            <span className="text-[10px] text-rose-300">Contenido efímero</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Casting Live</span>
            <span className="text-xl font-black font-mono text-red-500 mt-0.5 block flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>LIVE</span>
            </span>
            <span className="text-[10px] text-slate-300 truncate block">{activeRoundName}</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Saldo Admin</span>
            <span className="text-xl font-black font-mono text-emerald-400 mt-0.5 block">
              {userProfile.balance.toLocaleString()}€
            </span>
            <span className="text-[10px] text-emerald-300">Fondos maestros</span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Votos Acumulados</span>
            <span className="text-xl font-black font-mono text-purple-400 mt-0.5 block">
              {models.reduce((acc, m) => acc + (m.totalLikes || 0), 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-purple-300">Participación global</span>
          </div>
        </div>
      </div>

      {/* Services Navigation Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 text-xs font-bold">
        {[
          { id: 'overview', label: '📊 Visión General', icon: Layers },
          { id: 'models', label: `👠 Ranking Modelos (${models.length})`, icon: Award },
          { id: 'casting', label: '🔴 Casting Live & Rondas', icon: Video },
          { id: 'finance', label: `💰 Finanzas & Proyectos (${projects.length})`, icon: Wallet },
          { id: 'stories', label: `📸 Historias 24h (${activeStories.length})`, icon: Camera },
          { id: 'gifts', label: '🎁 Regalos VIP & Joyería', icon: Gift },
          { id: 'users', label: '👥 Usuarios & Roles', icon: Users },
          { id: 'system', label: '⚙️ Base de Datos & Mantenimiento', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl border transition-all duration-200 shrink-0 flex items-center gap-2 cursor-pointer select-none ${
                isActive 
                  ? 'bg-slate-950 text-white border-slate-950 shadow-sm' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. VISIÓN GENERAL (OVERVIEW)                                              */}
      {/* ========================================================================= */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Quick Service Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Service 1: Ranking */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-xl font-bold">
                  👠
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold font-mono">
                  ACTIVO
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Ranking Top Modelos</h4>
                <p className="text-xs text-slate-500 mt-0.5">50 modelos con comisiones automáticas del 10% y votos.</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveAdminTab('models')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer flex items-center gap-1"
                >
                  <span>Controlar Modelos</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onNavigateToTab('home')}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  Abrir vista
                </button>
              </div>
            </div>

            {/* Service 2: Casting Live */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl font-bold">
                  🔴
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold font-mono">
                  STREAMING
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Casting Live & Pasarelas</h4>
                <p className="text-xs text-slate-500 mt-0.5">Ronda: <strong>{activeRoundName}</strong> en emisión.</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveAdminTab('casting')}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 transition cursor-pointer flex items-center gap-1"
                >
                  <span>Gestionar Rondas</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onNavigateToTab('casting_live')}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  Abrir Live
                </button>
              </div>
            </div>

            {/* Service 3: Finance */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
                  💰
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold font-mono">
                  OPERATIVO
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Finanzas & Crowdfunding</h4>
                <p className="text-xs text-slate-500 mt-0.5">{projects.length} mesas de inversión y balance circulante.</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveAdminTab('finance')}
                  className="text-xs font-bold text-amber-600 hover:text-amber-800 transition cursor-pointer flex items-center gap-1"
                >
                  <span>Controlar Mesas</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onNavigateToTab('finance')}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  Ver Cartera
                </button>
              </div>
            </div>

            {/* Service 4: Stories */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
                  📸
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold font-mono">
                  24 HORAS
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Historias Efímeras & Reels</h4>
                <p className="text-xs text-slate-500 mt-0.5">{activeStories.length} historias activas (clips de máx. 60s).</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveAdminTab('stories')}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 transition cursor-pointer flex items-center gap-1"
                >
                  <span>Moderar Historias</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* Quick Master Actions Banner */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="font-bold text-base flex items-center justify-center md:justify-start gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Consola Administrativa de la Aplicación</span>
              </h3>
              <p className="text-xs text-slate-400">
                Puedes alternar configuraciones de cualquier servicio en tiempo real. Todas las modificaciones se sincronizan de inmediato en la sesión.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={onResetDatabase}
                className="px-4 py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restablecer Todo a Cero</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. RANKING DE MODELOS                                                     */}
      {/* ========================================================================= */}
      {activeAdminTab === 'models' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-2xs animate-fade-in">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-display">Control del Ranking de Modelos</h3>
              <p className="text-xs text-slate-500">Gestiona verificaciones, votos, likes y asignación de agencias.</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Buscar modelo o agencia..."
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-slate-400"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <select
                value={modelGenderFilter}
                onChange={(e) => setModelGenderFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl text-xs py-2 px-3 focus:outline-none"
              >
                <option value="all">Todos los géneros</option>
                <option value="female">Femenino</option>
                <option value="male">Masculino</option>
              </select>
            </div>
          </div>

          {/* Models Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Modelo</th>
                  <th className="py-3 px-4">Agencia</th>
                  <th className="py-3 px-4">Likes / Votos</th>
                  <th className="py-3 px-4">Mecenas</th>
                  <th className="py-3 px-4">Estado Verificación</th>
                  <th className="py-3 px-4 text-right">Acciones Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredModels.slice(0, 15).map((model) => (
                  <tr key={model.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={model.avatar}
                        alt={model.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate flex items-center gap-1">
                          {model.name}
                          {model.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">@{model.username}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-600">
                      {model.fashionAgency || "Victoria's Secret"}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      🪙 {(model.totalLikes || 0).toLocaleString()}
                    </td>

                    <td className="py-3 px-4 font-mono text-emerald-600 font-bold">
                      {model.referidosCount} referidos
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleVerified(model.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer border ${
                          model.verified 
                            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {model.verified ? '✓ Verificada' : '○ Sin verificar'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleBoostVotes(model.id, 500)}
                        className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold cursor-pointer transition"
                        title="Inyectar 500 votos"
                      >
                        +500 Votos
                      </button>
                      <button
                        onClick={() => onNavigateToTab('home')}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold cursor-pointer transition"
                      >
                        Ver Perfil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-[11px] text-slate-400 font-mono text-right">
            Mostrando 15 de {filteredModels.length} modelos disponibles en el ranking.
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CASTING LIVE & RONDAS DE PASARELA                                      */}
      {/* ========================================================================= */}
      {activeAdminTab === 'casting' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-2xs animate-fade-in">
          <div>
            <h3 className="text-lg font-black text-slate-900 font-display">Control Central de Casting Live</h3>
            <p className="text-xs text-slate-500">Supervisa las transmisiones en directo, rondas temáticas de pasarela y chat.</p>
          </div>

          {/* Active Round Selector */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-xs font-black uppercase font-mono text-slate-500 tracking-wider block">
              1. Seleccionar Ronda Temática de Pasarela Activa:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: 'Streetwear & Urban', tag: 'ROUND 1', color: 'from-amber-500 to-orange-600' },
                { name: 'Alta Costura & Glamour', tag: 'ROUND 2', color: 'from-purple-500 to-pink-600' },
                { name: 'Traje de Baño & Resort', tag: 'ROUND 3', color: 'from-cyan-500 to-blue-600' },
                { name: 'Balmain & Gala Exclusive', tag: 'ROUND 4', color: 'from-rose-500 to-red-600' }
              ].map((round) => {
                const isSelected = activeRoundName === round.name;
                return (
                  <button
                    key={round.name}
                    onClick={() => handleChangeActiveRound(round.name)}
                    className={`p-4 rounded-2xl border-2 text-left transition cursor-pointer relative overflow-hidden ${
                      isSelected 
                        ? 'border-slate-900 bg-white shadow-md' 
                        : 'border-slate-200 bg-white/70 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-[9px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 inline-block mb-1">
                      {round.tag}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm block">{round.name}</h4>
                    {isSelected && (
                      <span className="absolute top-3 right-3 text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>EN EMISIÓN</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live Action Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-xs text-slate-900">Modo de Transmisión</h4>
              <p className="text-[11px] text-slate-500 leading-snug">Alternar entre pasarela en directo y fase de votación de proyectos.</p>
              <button
                onClick={() => {
                  showToast('Modo de pasarela forzado en vivo');
                  onNavigateToTab('casting_live');
                }}
                className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                Abrir Casting Live
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-xs text-slate-900">Limpieza de Chat en Vivo</h4>
              <p className="text-[11px] text-slate-500 leading-snug">Restablecer historial de comentarios y spam en la emisión en directo.</p>
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('casting_live_comments');
                    showToast('Comentarios del chat restablecidos');
                  } catch (e) {}
                }}
                className="w-full py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100 transition cursor-pointer"
              >
                Limpiar Chat
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-xs text-slate-900">Emisión de Anuncio Global</h4>
              <p className="text-[11px] text-slate-500 leading-snug">Enviar un mensaje administrativo a todos los espectadores de la pasarela.</p>
              <button
                onClick={() => {
                  alert('📢 Anuncio enviado: "La Dirección de Fashion Finances ha abierto la siguiente ronda con premios dobles en regalos VIP."');
                  showToast('Anuncio global emitido con éxito');
                }}
                className="w-full py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold hover:bg-indigo-100 transition cursor-pointer"
              >
                Emitir Anuncio
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. FINANZAS & MESAS DE INVERSIÓN                                          */}
      {/* ========================================================================= */}
      {activeAdminTab === 'finance' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-2xs animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-display">Control de Finanzas & Crowdfunding</h3>
              <p className="text-xs text-slate-500">Supervisión de proyectos de alta costura, rondas de inversión y fondos.</p>
            </div>

            <button
              onClick={() => handleInjectFunds(50000)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Inyectar Liquidez (+50.000€)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((proj) => {
              const targetGoal = proj.fundingGoal || proj.budget || 10000;
              const currentBudget = proj.budget || 0;
              return (
                <div key={proj.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                      {proj.category || 'Alta Costura'}
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {currentBudget.toLocaleString()}€ / {targetGoal.toLocaleString()}€
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm truncate">{proj.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{proj.descriptionShort || proj.descriptionLong || ''}</p>

                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${Math.min(100, (currentBudget / targetGoal) * 100)}%` }}
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        const updated = projects.map(p => p.id === proj.id ? { ...p, budget: (p.budget || 0) + 1000 } : p);
                        onUpdateProjects(updated);
                        showToast(`+1.000€ añadidos al proyecto "${proj.title}"`);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg font-bold text-[10px] transition cursor-pointer"
                    >
                      +1.000€ Fondos
                    </button>
                    <button
                      onClick={() => onNavigateToTab('finance')}
                      className="text-indigo-600 font-bold hover:underline text-[11px]"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. HISTORIAS 24H & REELS                                                  */}
      {/* ========================================================================= */}
      {activeAdminTab === 'stories' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-2xs animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 font-display">Moderar Historias Efímeras 24H</h3>
              <p className="text-xs text-slate-500">Supervisa las historias publicadas, caducidad de 24 horas y clips de vídeo de 60s.</p>
            </div>

            <button
              onClick={() => {
                setActiveStories([]);
                localStorage.removeItem('active_stories');
                window.dispatchEvent(new CustomEvent('stories-updated'));
                showToast('Todas las historias han sido limpiadas');
              }}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar Todas las Historias</span>
            </button>
          </div>

          {activeStories.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
              <Camera className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No hay historias efímeras activas en este momento.</p>
              <p className="text-[10px] text-slate-400">Puedes crear una desde la barra superior o desde el modal de historias.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeStories.map((story) => {
                const timeLeftHours = Math.max(0, Math.round((story.expiresAt - Date.now()) / (1000 * 60 * 60)));
                return (
                  <div key={story.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <img
                        src={story.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                        alt={story.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-xs text-slate-900 block truncate">{story.name || story.username}</span>
                        <span className="text-[9px] text-slate-400 font-mono block">Caduca en: {timeLeftHours}h</span>
                      </div>
                    </div>

                    <div className="aspect-[9/16] rounded-xl overflow-hidden bg-black border border-slate-200">
                      {story.isVideo ? (
                        <video src={story.image} controls className="w-full h-full object-cover" />
                      ) : (
                        <img src={story.image} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[10px] text-slate-600 truncate max-w-[130px] font-medium">
                        {story.title || "Historia"}
                      </span>
                      <button
                        onClick={() => handleDeleteStory(story.id)}
                        className="text-rose-600 hover:text-rose-800 text-[10px] font-bold p-1 transition cursor-pointer"
                        title="Eliminar Historia"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. REGALOS VIP & JOYERÍA                                                  */}
      {/* ========================================================================= */}
      {activeAdminTab === 'gifts' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-2xs animate-fade-in">
          <div>
            <h3 className="text-lg font-black text-slate-900 font-display">Control de Regalos VIP & Economía</h3>
            <p className="text-xs text-slate-500">Supervisa el catálogo de regalos, valores de monedas 🪙 y ratios de conversión a Euros (€).</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Certificado VIP Oficial', icon: '📜', coins: 500, euros: 500, category: 'Joyería & Membresía' },
              { name: 'Reloj de Lujo 3D Luxury', icon: '⌚', coins: 2500, euros: 2500, category: 'Alta Gama' },
              { name: 'Corona de Diamantes', icon: '👑', coins: 1000, euros: 1000, category: 'Lujo VIP' },
              { name: 'Ramo de Rosas de Pasarela', icon: '💐', coins: 150, euros: 150, category: 'Detalle' }
            ].map((g, i) => (
              <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{g.icon}</span>
                  <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    {g.category}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">{g.name}</h4>
                <div className="flex items-center justify-between font-mono text-xs pt-2 border-t border-slate-200">
                  <span className="text-amber-600 font-bold">🪙 {g.coins}</span>
                  <span className="text-emerald-600 font-bold">({g.euros}€)</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. USUARIOS & ROLES                                                       */}
      {/* ========================================================================= */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-2xs animate-fade-in">
          <div>
            <h3 className="text-lg font-black text-slate-900 font-display">Gestión de Usuarios y Roles (RBAC)</h3>
            <p className="text-xs text-slate-500">Supervisa las cuentas activas de la plataforma, roles y privilegios.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Cuenta de Administrador</span>
              <h4 className="font-bold text-sm text-slate-900">{userProfile.name}</h4>
              <p className="text-xs text-slate-500 font-mono">@{userProfile.username} · Rol: {userProfile.role}</p>
              <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                PRIVILEGIOS MAESTROS
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Inversor Principal</span>
              <h4 className="font-bold text-sm text-slate-900">Ernesto vs</h4>
              <p className="text-xs text-slate-500 font-mono">@ernestovs · Rol: investor</p>
              <span className="inline-block px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                MECENAS ACTIVO
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">Modelo Destacada</span>
              <h4 className="font-bold text-sm text-slate-900">Adriana Lima</h4>
              <p className="text-xs text-slate-500 font-mono">@adrianalima · Rol: model</p>
              <span className="inline-block px-2 py-0.5 rounded bg-pink-100 text-pink-800 text-[10px] font-bold">
                TOP RANKING #1
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. BASE DE DATOS & MANTENIMIENTO                                          */}
      {/* ========================================================================= */}
      {activeAdminTab === 'system' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-2xs animate-fade-in">
          <div>
            <h3 className="text-lg font-black text-slate-900 font-display">Operaciones del Sistema & Base de Datos</h3>
            <p className="text-xs text-slate-500">Mantenimiento general, reseteo de entorno y exportación de datos.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                💾
              </div>
              <h4 className="font-bold text-sm text-slate-900">Copia de Seguridad de la App</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Descarga un archivo JSON con todos los modelos, historias, proyectos y datos de sesión en tu equipo.
              </p>
              <button
                onClick={handleExportBackup}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Datos JSON</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl">
                ⚠️
              </div>
              <h4 className="font-bold text-sm text-rose-900">Restablecer Estado Inicial de Fábrica</h4>
              <p className="text-xs text-rose-700/80 leading-relaxed">
                Reinicia la base de datos a los valores iniciales estándar: 50 modelos, mesas de inversión limpias y balance estándar.
              </p>
              <button
                onClick={() => {
                  if (confirm('¿Estás seguro de que deseas restablecer todos los datos de la app a los valores de fábrica?')) {
                    onResetDatabase();
                  }
                }}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restablecer Base de Datos</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
