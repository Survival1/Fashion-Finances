/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Users, 
  FolderKanban, 
  Layers, 
  Award, 
  TrendingUp, 
  DollarSign, 
  Bell, 
  Settings, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft, 
  Edit3, 
  UserX, 
  UserCheck, 
  Trash2, 
  Plus, 
  Eye, 
  Lock, 
  RefreshCw, 
  Sparkles, 
  Check, 
  X, 
  Briefcase, 
  Crown, 
  Video, 
  Heart, 
  ExternalLink,
  Info,
  Clock,
  HelpCircle,
  Megaphone,
  Radio,
  Sliders,
  Database,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { UserSessionProfile, InvestmentSession, ProjectData, ModelProfile } from '../types';
import FashionsFinanceLogo from './FashionsFinanceLogo';

interface AdminPortalProps {
  currentUser: UserSessionProfile;
  onExitAdmin: () => void;
  onNavigateToTab?: (tab: any) => void;
  sessions?: InvestmentSession[];
  models?: ModelProfile[];
  projects?: ProjectData[];
}

export const ADMIN_TOKEN = 'ff-admin-master-token-v2026';

export default function AdminPortal({ 
  currentUser, 
  onExitAdmin, 
  onNavigateToTab,
  sessions: initialSessions = [],
  models: initialModels = [],
  projects: initialProjects = []
}: AdminPortalProps) {
  // Navigation Modules
  const [activeModule, setActiveModule] = useState<'dashboard' | 'users' | 'projects' | 'models' | 'content' | 'config' | 'audit'>('dashboard');

  // Loading & sync state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Real Database state from backend
  const [overviewData, setOverviewData] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [ticketsList, setTicketsList] = useState<any[]>([]);
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<any[]>([]);
  const [platformConfig, setPlatformConfig] = useState<any>({
    platformName: 'Fashion Finances',
    slogan: 'Casting Live & Fashion Models Crowdfunding Ecosystem',
    contactEmail: 'soporte@fashionfinances.com',
    maintenanceMode: false,
    allowRegistrations: true,
    minEntryFee: 10,
    votingDurationMinutes: 10,
    platformCommissionPercent: 5.0,
    escrowCustodyEnabled: true,
    activeAnnouncementBanner: '✨ ¡Bienvenido a Fashion Finances! Rondas de financiación de moda abiertas con garantía Escrow.',
    showAnnouncementBanner: true
  });

  // Global filters
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days'>('all');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Module specific filters
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('all');
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>('all');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState<string>('all');
  const [auditModuleFilter, setAuditModuleFilter] = useState<string>('all');

  // Modals & Drawers
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<any | null>(null);
  const [selectedUserForAction, setSelectedUserForAction] = useState<{ user: any; action: 'suspend' | 'reactivate' } | null>(null);
  const [actionReason, setActionReason] = useState<string>('');
  
  const [selectedProjectForReview, setSelectedProjectForReview] = useState<any | null>(null);
  const [projectActionModal, setProjectActionModal] = useState<{ project: any; action: 'approve' | 'reject' | 'delete' } | null>(null);
  const [projectRejectionReason, setProjectRejectionReason] = useState<string>('');

  const [showCreateProjectModal, setShowCreateProjectModal] = useState<boolean>(false);
  const [newProjectForm, setNewProjectForm] = useState({
    title: '',
    category: 'Casual & Lifestyle',
    budget: 15000,
    fundingGoal: 25000,
    objective: '',
    authorName: 'Ernesto V. S.'
  });

  const [showCreateNotificationModal, setShowCreateNotificationModal] = useState<boolean>(false);
  const [newNotificationForm, setNewNotificationForm] = useState({
    title: '',
    message: '',
    targetRole: 'all',
    type: 'info'
  });

  const [selectedTicketForResolution, setSelectedTicketForResolution] = useState<any | null>(null);
  const [ticketResolutionNote, setTicketResolutionNote] = useState<string>('');

  // Helper for API calls with real headers
  const adminFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'x-admin-token': ADMIN_TOKEN,
      'x-user-role': 'admin',
      'x-admin-user': currentUser.name || 'Super Admin',
      ...(options.headers || {})
    };
    const res = await fetch(endpoint, { ...options, headers });
    return res;
  };

  // Fetch real data on mount or refresh
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch overview
        const ovRes = await adminFetch('/api/admin/overview');
        if (ovRes.ok) {
          const ovData = await ovRes.json();
          if (isMounted) {
            setOverviewData(ovData.stats);
            if (ovData.config) setPlatformConfig(ovData.config);
          }
        }

        // Fetch users
        const uRes = await adminFetch('/api/admin/users');
        if (uRes.ok) {
          const uData = await uRes.json();
          if (isMounted) setUsersList(uData);
        }

        // Fetch projects
        const pRes = await adminFetch('/api/admin/projects');
        if (pRes.ok) {
          const pData = await pRes.json();
          if (isMounted) setProjectsList(pData);
        }

        // Fetch sessions / rounds
        const sRes = await adminFetch('/api/admin/sessions');
        if (sRes.ok) {
          const sData = await sRes.json();
          if (isMounted) setSessionsList(sData);
        }

        // Fetch tickets / issues
        const tRes = await adminFetch('/api/admin/tickets');
        if (tRes.ok) {
          const tData = await tRes.json();
          if (isMounted) setTicketsList(tData);
        }

        // Fetch notifications
        const nRes = await adminFetch('/api/admin/notifications');
        if (nRes.ok) {
          const nData = await nRes.json();
          if (isMounted) setNotificationsList(nData);
        }

        // Fetch audit logs
        const aRes = await adminFetch('/api/admin/audit-logs');
        if (aRes.ok) {
          const aData = await aRes.json();
          if (isMounted) setAuditLogsList(aData);
        }
      } catch (err) {
        console.error('Error loading admin portal data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();
    return () => { isMounted = false; };
  }, [refreshKey]);

  // Toast status auto-dismiss
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => setStatusMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  // Handler: Suspend or Reactivate user with server audit
  const handleConfirmUserStatusChange = async () => {
    if (!selectedUserForAction) return;
    const { user, action } = selectedUserForAction;
    const newStatus = action === 'suspend' ? 'suspended' : 'active';

    try {
      const res = await adminFetch(`/api/admin/users/${user.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: newStatus,
          reason: actionReason || (action === 'suspend' ? 'Suspensión administrativa por infracción de normas' : 'Reactivación tras revisión de apelación')
        })
      });

      if (res.ok) {
        const result = await res.json();
        setUsersList(prev => prev.map(u => u.id === user.id ? result.user : u));
        setStatusMessage({
          text: `Usuario @${user.username} ha sido ${newStatus === 'suspended' ? 'suspendido' : 'reactivado'} con éxito. Acción registrada en auditoría.`,
          type: newStatus === 'suspended' ? 'info' : 'success'
        });
        setSelectedUserForAction(null);
        setActionReason('');
        setRefreshKey(k => k + 1);
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || 'No se pudo actualizar el usuario.'}`);
      }
    } catch (e) {
      alert('Error de conexión al servidor administrativo.');
    }
  };

  // Handler: Edit user fields
  const handleSaveUserEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;

    try {
      const res = await adminFetch(`/api/admin/users/${selectedUserForEdit.id}`, {
        method: 'PUT',
        body: JSON.stringify(selectedUserForEdit)
      });

      if (res.ok) {
        const result = await res.json();
        setUsersList(prev => prev.map(u => u.id === selectedUserForEdit.id ? result.user : u));
        setStatusMessage({ text: `Perfil de @${selectedUserForEdit.username} actualizado correctamente.`, type: 'success' });
        setSelectedUserForEdit(null);
        setRefreshKey(k => k + 1);
      } else {
        alert('Error al actualizar datos del usuario.');
      }
    } catch (e) {
      alert('Error de red al actualizar usuario.');
    }
  };

  // Handler: Change Project Status (Approve / Reject)
  const handleConfirmProjectStatus = async () => {
    if (!projectActionModal) return;
    const { project, action } = projectActionModal;

    try {
      if (action === 'delete') {
        const res = await adminFetch(`/api/admin/projects/${project.id}`, { method: 'DELETE' });
        if (res.ok) {
          setProjectsList(prev => prev.filter(p => p.id !== project.id));
          setStatusMessage({ text: `Proyecto "${project.title}" retirado permanentemente.`, type: 'info' });
          setProjectActionModal(null);
          setRefreshKey(k => k + 1);
        }
        return;
      }

      const targetStatus = action === 'approve' ? 'active' : 'rejected';
      const res = await adminFetch(`/api/admin/projects/${project.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: targetStatus,
          reason: projectRejectionReason
        })
      });

      if (res.ok) {
        const result = await res.json();
        setProjectsList(prev => prev.map(p => p.id === project.id ? result.project : p));
        setStatusMessage({
          text: `Proyecto "${project.title}" marcado como ${targetStatus === 'active' ? 'APROBADO & PUBLICADO' : 'RECHAZADO'}.`,
          type: targetStatus === 'active' ? 'success' : 'info'
        });
        setProjectActionModal(null);
        setProjectRejectionReason('');
        setRefreshKey(k => k + 1);
      }
    } catch (e) {
      alert('Error al actualizar el estado del proyecto.');
    }
  };

  // Handler: Create New Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/projects', {
        method: 'POST',
        body: JSON.stringify(newProjectForm)
      });
      if (res.ok) {
        const result = await res.json();
        setProjectsList(prev => [result.project, ...prev]);
        setStatusMessage({ text: `Proyecto "${newProjectForm.title}" creado con éxito.`, type: 'success' });
        setShowCreateProjectModal(false);
        setNewProjectForm({ title: '', category: 'Casual & Lifestyle', budget: 15000, fundingGoal: 25000, objective: '', authorName: 'Ernesto V. S.' });
        setRefreshKey(k => k + 1);
      }
    } catch (e) {
      alert('Error al registrar nuevo proyecto.');
    }
  };

  // Handler: Create Broadcast Notification
  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/notifications', {
        method: 'POST',
        body: JSON.stringify(newNotificationForm)
      });
      if (res.ok) {
        const result = await res.json();
        setNotificationsList(prev => [result.notification, ...prev]);
        setStatusMessage({ text: 'Notificación masiva emitida con éxito a los usuarios.', type: 'success' });
        setShowCreateNotificationModal(false);
        setNewNotificationForm({ title: '', message: '', targetRole: 'all', type: 'info' });
        setRefreshKey(k => k + 1);
      }
    } catch (e) {
      alert('Error al emitir notificación.');
    }
  };

  // Handler: Delete Broadcast Notification
  const handleDeleteNotification = async (notifId: string) => {
    if (!confirm('¿Eliminar esta notificación del panel de avisos?')) return;
    try {
      const res = await adminFetch(`/api/admin/notifications/${notifId}`, { method: 'DELETE' });
      if (res.ok) {
        setNotificationsList(prev => prev.filter(n => n.id !== notifId));
        setStatusMessage({ text: 'Notificación eliminada.', type: 'info' });
      }
    } catch (e) {}
  };

  // Handler: Resolve Support Ticket
  const handleResolveTicket = async () => {
    if (!selectedTicketForResolution) return;
    try {
      const res = await adminFetch(`/api/admin/tickets/${selectedTicketForResolution.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'resuelta',
          responseNote: ticketResolutionNote || 'Incidencia resuelta satisfactoriamente por el equipo administrativo.'
        })
      });
      if (res.ok) {
        const result = await res.json();
        setTicketsList(prev => prev.map(t => t.id === selectedTicketForResolution.id ? result.ticket : t));
        setStatusMessage({ text: `Incidencia "${selectedTicketForResolution.title}" marcada como resuelta.`, type: 'success' });
        setSelectedTicketForResolution(null);
        setTicketResolutionNote('');
        setRefreshKey(k => k + 1);
      }
    } catch (e) {
      alert('Error al actualizar la incidencia.');
    }
  };

  // Handler: Save General Platform Configuration
  const handleSavePlatformConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await adminFetch('/api/admin/config', {
        method: 'PUT',
        body: JSON.stringify(platformConfig)
      });
      if (res.ok) {
        setStatusMessage({ text: 'Configuración general de Fashion Finances guardada con éxito.', type: 'success' });
        setRefreshKey(k => k + 1);
      }
    } catch (e) {
      alert('Error al guardar configuración.');
    }
  };

  // Real KPI calculations
  const totalBalanceInEscrow = useMemo(() => {
    return sessionsList.reduce((acc, s) => acc + (s.totalPoolGathered || 0), 0);
  }, [sessionsList]);

  const totalCommissions = useMemo(() => {
    return sessionsList.reduce((acc, s) => acc + ((s.totalPoolGathered || 0) * (s.commissionRate || 0.05)), 0);
  }, [sessionsList]);

  const totalVotesAcrossAll = useMemo(() => {
    return projectsList.reduce((acc, p) => acc + (p.votesReceived || 0), 0);
  }, [projectsList]);

  return (
    <div className="min-h-screen bg-[#FFF9FB] text-slate-900 font-sans flex flex-col antialiased select-none" id="admin-portal-suite">
      
      {/* 👑 TOP HEADER BAR - FASHION FINANCES ADMIN SUITE */}
      <header className="bg-white border-b border-pink-100/90 py-3 px-4 sm:px-6 sticky top-0 z-[120] shadow-xs">
        <div className="max-w-[1780px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Brand & Badge */}
          <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="relative">
                <FashionsFinanceLogo mode="light" className="w-9 h-9" />
                <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-rose-500 to-[#fe2c55] text-white p-0.5 rounded-full shadow-xs">
                  <ShieldCheck className="w-3 h-3" />
                </span>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base sm:text-lg text-slate-950 tracking-tight leading-tight">
                    Fashion Finances
                  </h1>
                  <span className="bg-rose-50 text-rose-600 border border-rose-200/80 px-2 py-0.5 rounded-md text-[10px] font-black uppercase font-mono tracking-wider">
                    CENTRO ADMINISTRATIVO
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-400 font-medium">
                  Supervisión de Inversiones, Rondas de Financiación, Modelos y Auditoría
                </p>
              </div>
            </div>

            {/* Quick exit to app on mobile */}
            <button
              onClick={onExitAdmin}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver</span>
            </button>
          </div>

          {/* Quick Actions & Admin Profile */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            
            {/* Live refresh */}
            <button
              type="button"
              onClick={() => setRefreshKey(k => k + 1)}
              className="p-2 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
              title="Sincronizar datos reales del servidor"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? 'animate-spin text-[#fe2c55]' : ''}`} />
              <span className="hidden xl:inline">Sincronizar</span>
            </button>

            {/* Incident Alert Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveModule('content')}
                className="p-2 rounded-xl border border-pink-200 bg-pink-50/50 hover:bg-pink-100 text-rose-600 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="Incidencias pendientes"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span>{ticketsList.filter(t => t.status !== 'resuelta').length}</span>
                <span className="hidden xl:inline font-normal text-rose-700">Incidencias</span>
              </button>
            </div>

            {/* Admin identity pill */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 flex items-center gap-2.5">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-200"
              />
              <div className="text-left hidden sm:block">
                <span className="text-[9px] uppercase font-mono font-black text-rose-600 block leading-tight">
                  SUPER ADMINISTRADOR
                </span>
                <strong className="text-xs text-slate-900 font-bold block leading-tight">
                  {currentUser.name}
                </strong>
              </div>
            </div>

            {/* Back to App button */}
            <button
              type="button"
              onClick={onExitAdmin}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-white font-bold text-xs tracking-wide transition shadow-sm hover:shadow-md cursor-pointer active:scale-95"
              id="btn-admin-exit-to-app"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-rose-400" />
              <span>Volver a la App</span>
            </button>
          </div>

        </div>
      </header>

      {/* STATUS TOAST NOTIFICATION */}
      {statusMessage && (
        <div className={`fixed top-18 right-6 z-[200] max-w-md p-4 rounded-2xl shadow-xl flex items-start gap-3 animate-fade-in border ${
          statusMessage.type === 'success' 
            ? 'bg-slate-900 border-emerald-500/80 text-white' 
            : statusMessage.type === 'error'
            ? 'bg-slate-900 border-rose-500/80 text-white'
            : 'bg-slate-900 border-indigo-500/80 text-white'
        }`}>
          <div className="pt-0.5">
            {statusMessage.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Info className="w-5 h-5 text-rose-400" />}
          </div>
          <div className="flex-1 text-left text-xs font-medium leading-relaxed">
            {statusMessage.text}
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 🚀 MAIN SUITE BODY: SIDEBAR + CONTENT AREA */}
      <div className="max-w-[1780px] w-full mx-auto flex-1 flex flex-col lg:flex-row p-3 sm:p-6 gap-6 min-h-0">
        
        {/* 🧭 LEFT ADMIN NAVIGATION MENU */}
        <aside className="lg:w-68 shrink-0 flex flex-col gap-3">
          
          <div className="bg-white rounded-3xl border border-pink-100/80 p-3 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider px-3 py-1 block text-left">
              Módulos del Sistema
            </span>

            {/* 1. Panel Principal (Dashboard) */}
            <button
              type="button"
              onClick={() => setActiveModule('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-extrabold tracking-wide transition cursor-pointer text-left ${
                activeModule === 'dashboard'
                  ? 'bg-gradient-to-r from-rose-500 to-[#fe2c55] text-white shadow-md shadow-rose-200/60'
                  : 'text-slate-700 hover:bg-rose-50/40 hover:text-rose-600'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Panel Principal</span>
            </button>

            {/* 2. Gestión de Usuarios */}
            <button
              type="button"
              onClick={() => setActiveModule('users')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-extrabold tracking-wide transition cursor-pointer text-left ${
                activeModule === 'users'
                  ? 'bg-gradient-to-r from-rose-500 to-[#fe2c55] text-white shadow-md shadow-rose-200/60'
                  : 'text-slate-700 hover:bg-rose-50/40 hover:text-rose-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Gestión de Usuarios</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeModule === 'users' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {usersList.length}
              </span>
            </button>

            {/* 3. Proyectos & Financiación */}
            <button
              type="button"
              onClick={() => setActiveModule('projects')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-extrabold tracking-wide transition cursor-pointer text-left ${
                activeModule === 'projects'
                  ? 'bg-gradient-to-r from-rose-500 to-[#fe2c55] text-white shadow-md shadow-rose-200/60'
                  : 'text-slate-700 hover:bg-rose-50/40 hover:text-rose-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderKanban className="w-4 h-4" />
                <span>Proyectos & Rondas</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeModule === 'projects' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {projectsList.length}
              </span>
            </button>

            {/* 4. Modelos & Patrocinadores */}
            <button
              type="button"
              onClick={() => setActiveModule('models')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-extrabold tracking-wide transition cursor-pointer text-left ${
                activeModule === 'models'
                  ? 'bg-gradient-to-r from-rose-500 to-[#fe2c55] text-white shadow-md shadow-rose-200/60'
                  : 'text-slate-700 hover:bg-rose-50/40 hover:text-rose-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Modelos & Sponsors</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeModule === 'models' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {initialModels.length || 20}
              </span>
            </button>

            {/* 5. Contenido & Comunicación */}
            <button
              type="button"
              onClick={() => setActiveModule('content')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-extrabold tracking-wide transition cursor-pointer text-left ${
                activeModule === 'content'
                  ? 'bg-gradient-to-r from-rose-500 to-[#fe2c55] text-white shadow-md shadow-rose-200/60'
                  : 'text-slate-700 hover:bg-rose-50/40 hover:text-rose-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Megaphone className="w-4 h-4" />
                <span>Contenido & Avisos</span>
              </div>
              {ticketsList.filter(t => t.status !== 'resuelta').length > 0 && (
                <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                  {ticketsList.filter(t => t.status !== 'resuelta').length}
                </span>
              )}
            </button>

            {/* 6. Configuración General */}
            <button
              type="button"
              onClick={() => setActiveModule('config')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-extrabold tracking-wide transition cursor-pointer text-left ${
                activeModule === 'config'
                  ? 'bg-gradient-to-r from-rose-500 to-[#fe2c55] text-white shadow-md shadow-rose-200/60'
                  : 'text-slate-700 hover:bg-rose-50/40 hover:text-rose-600'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </button>

            {/* 7. Registro de Auditoría */}
            <button
              type="button"
              onClick={() => setActiveModule('audit')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-extrabold tracking-wide transition cursor-pointer text-left ${
                activeModule === 'audit'
                  ? 'bg-gradient-to-r from-rose-500 to-[#fe2c55] text-white shadow-md shadow-rose-200/60'
                  : 'text-slate-700 hover:bg-rose-50/40 hover:text-rose-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>Auditoría (Logs)</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeModule === 'audit' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {auditLogsList.length}
              </span>
            </button>

          </div>

          {/* Quick System Integrity Card */}
          <div className="bg-white rounded-3xl border border-pink-100/80 p-4 shadow-xs text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">
                SEGURIDAD BACKEND
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Custodia Escrow:</span>
                <strong className="text-slate-900 font-mono">Activa (5%)</strong>
              </div>
              <div className="flex justify-between">
                <span>Restricción Roles:</span>
                <strong className="text-slate-900 font-mono">Estricta</strong>
              </div>
              <div className="flex justify-between">
                <span>Persistencia JSON:</span>
                <strong className="text-slate-900 font-mono">Sincronizada</strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 leading-tight">
              Todas las operaciones críticas se auditan con firma de administrador.
            </div>
          </div>

        </aside>

        {/* 💻 MAIN CONTENT VIEWPORT */}
        <section className="flex-1 min-w-0 flex flex-col gap-6">

          {/* ═════════════════════════════════════════════════════════════════════════ */}
          {/* 1. MÓDULO: PANEL PRINCIPAL (DASHBOARD) */}
          {/* ═════════════════════════════════════════════════════════════════════════ */}
          {activeModule === 'dashboard' && (
            <div className="space-y-6 text-left animate-fade-in" id="admin-module-dashboard">
              
              {/* Top Banner and Filter Bar */}
              <div className="bg-white rounded-3xl border border-pink-100/90 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#fe2c55] font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    PANEL DE CONTROL GENERAL
                  </span>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-1">
                    Métricas Globales de Fashion Finances
                  </h2>
                  <p className="text-xs text-slate-500 max-w-2xl mt-0.5 leading-relaxed">
                    Visualización en tiempo real de usuarios registrados, proyectos de moda en pasarela, estado de las rondas de financiación y fondos en custodia contractual.
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 p-1.5 rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-bold px-2 uppercase font-mono">Filtro:</span>
                  <button
                    type="button"
                    onClick={() => setDateFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      dateFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Histórico Total
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateFilter('30days')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      dateFilter === '30days' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Este Mes
                  </button>
                  <button
                    type="button"
                    onClick={() => setDateFilter('7days')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      dateFilter === '7days' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Últimos 7 Días
                  </button>
                </div>
              </div>

              {/* 8 Primary Real KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Usuarios */}
                <div className="bg-white rounded-3xl border border-pink-100/80 p-5 shadow-xs space-y-3 relative overflow-hidden group hover:border-pink-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider">
                      USUARIOS REGISTRADOS
                    </span>
                    <span className="p-2 rounded-xl bg-pink-50 text-rose-500">
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-950 font-mono">
                      {usersList.length}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-slate-500">
                      <span className="text-emerald-600">● {usersList.filter(u => u.status === 'active').length} Activos</span>
                      <span>•</span>
                      <span className="text-rose-600">● {usersList.filter(u => u.status === 'suspended').length} Suspendidos</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
                    <span>Nuevos esta semana:</span>
                    <strong className="text-slate-800 font-mono">+{usersList.filter(u => Date.now() - new Date(u.registeredAt).getTime() < 7 * 86400000).length}</strong>
                  </div>
                </div>

                {/* 2. Proyectos */}
                <div className="bg-white rounded-3xl border border-pink-100/80 p-5 shadow-xs space-y-3 relative overflow-hidden group hover:border-pink-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider">
                      PROYECTOS & PROPUESTAS
                    </span>
                    <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                      <FolderKanban className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-950 font-mono">
                      {projectsList.length}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-slate-500">
                      <span className="text-emerald-600">● {projectsList.filter(p => p.status === 'active').length} Aprobados</span>
                      <span>•</span>
                      <span className="text-amber-600">● {projectsList.filter(p => p.status === 'pending').length} En Revisión</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
                    <span>Rechazados:</span>
                    <strong className="text-rose-600 font-mono">{projectsList.filter(p => p.status === 'rejected').length}</strong>
                  </div>
                </div>

                {/* 3. Rondas de Financiación */}
                <div className="bg-white rounded-3xl border border-pink-100/80 p-5 shadow-xs space-y-3 relative overflow-hidden group hover:border-pink-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider">
                      RONDAS ACTIVAS
                    </span>
                    <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                      <Award className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-950 font-mono">
                      {sessionsList.filter(s => s.status === 'active').length} / {sessionsList.length}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-slate-500">
                      <span className="text-indigo-600">● {sessionsList.filter(s => s.votingPhaseActive).length} En Votación (10 min)</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
                    <span>Rondas programadas:</span>
                    <strong className="text-slate-800 font-mono">{sessionsList.filter(s => s.status === 'scheduled').length}</strong>
                  </div>
                </div>

                {/* 4. Votos y Participación */}
                <div className="bg-white rounded-3xl border border-pink-100/80 p-5 shadow-xs space-y-3 relative overflow-hidden group hover:border-pink-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider">
                      VOTOS REGISTRADOS
                    </span>
                    <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
                      <Heart className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-950 font-mono">
                      {totalVotesAcrossAll}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-slate-500">
                      <span className="text-emerald-600 font-mono">100% Sin colusión verificada</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
                    <span>Promedio por proyecto:</span>
                    <strong className="text-slate-800 font-mono">{(totalVotesAcrossAll / (projectsList.length || 1)).toFixed(1)}</strong>
                  </div>
                </div>

                {/* 5. Modelos Registradas */}
                <div className="bg-white rounded-3xl border border-pink-100/80 p-5 shadow-xs space-y-3 relative overflow-hidden group hover:border-pink-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider">
                      MODELOS EN PODIO
                    </span>
                    <span className="p-2 rounded-xl bg-pink-50 text-pink-600">
                      <Crown className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-950 font-mono">
                      {initialModels.length || 20}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-slate-500">
                      <span className="text-pink-600">● Top 100 Internacionales</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
                    <span>Transmisiones en vivo:</span>
                    <strong className="text-emerald-600 font-mono">Activas en Casting Live</strong>
                  </div>
                </div>

                {/* 6. Fondos en Custodia Escrow */}
                <div className="bg-white rounded-3xl border border-pink-100/80 p-5 shadow-xs space-y-3 relative overflow-hidden group hover:border-pink-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider">
                      CUSTODIA ESCROW
                    </span>
                    <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                      <DollarSign className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-950 font-mono">
                      {totalBalanceInEscrow.toLocaleString()}€
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-slate-500">
                      <span className="text-emerald-700 font-mono">Retención segura hasta votación</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
                    <span>Garantía:</span>
                    <strong className="text-slate-800 font-mono">100% Saldo Backoffice</strong>
                  </div>
                </div>

                {/* 7. Comisiones Ganadas (5%) */}
                <div className="bg-white rounded-3xl border border-pink-100/80 p-5 shadow-xs space-y-3 relative overflow-hidden group hover:border-pink-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider">
                      COMISIONES FASHION FINANCES
                    </span>
                    <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                      <TrendingUp className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-950 font-mono">
                      {totalCommissions.toLocaleString()}€
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-slate-500">
                      <span className="text-purple-700 font-mono">5.0% fijado en contrato</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
                    <span>Liquidación:</span>
                    <strong className="text-slate-800 font-mono">Instantánea al cierre</strong>
                  </div>
                </div>

                {/* 8. Incidencias & Soporte */}
                <div className="bg-white rounded-3xl border border-pink-100/80 p-5 shadow-xs space-y-3 relative overflow-hidden group hover:border-pink-300 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider">
                      INCIDENCIAS Y REPORTES
                    </span>
                    <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-950 font-mono">
                      {ticketsList.filter(t => t.status !== 'resuelta').length}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-slate-500">
                      <span className="text-amber-600 font-mono">Pendientes de resolución</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
                    <span>Resueltas históricas:</span>
                    <strong className="text-emerald-600 font-mono">{ticketsList.filter(t => t.status === 'resuelta').length}</strong>
                  </div>
                </div>

              </div>

              {/* Graphic Analytics & Real distribution breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Chart: Distribución de Rondas y Fondos */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-pink-100/90 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-950 uppercase tracking-wide font-display">
                        Estructura de Rondas de Financiación
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Cuota de entrada, quorum de participantes y volumen de bolsa acumulada
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl">
                      Total Bolsa: {totalBalanceInEscrow.toLocaleString()}€
                    </span>
                  </div>

                  {/* Horizontal Bar Visualizer */}
                  <div className="space-y-3 pt-2">
                    {sessionsList.map((session, idx) => {
                      const percentage = Math.min(100, Math.max(10, (session.participantsCount / session.maxParticipants) * 100));
                      return (
                        <div key={session.id || idx} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-800 flex items-center gap-2">
                              <span>{session.title}</span>
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                                Cuota: {session.entryFee}€
                              </span>
                            </span>
                            <span className="font-mono text-slate-600 text-[11px]">
                              {session.participantsCount} / {session.maxParticipants} participantes • <strong className="text-slate-900">{session.totalPoolGathered.toLocaleString()}€</strong>
                            </span>
                          </div>
                          
                          {/* Progress bar */}
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                idx === 0 ? 'bg-gradient-to-r from-orange-400 to-amber-500' :
                                idx === 1 ? 'bg-gradient-to-r from-rose-500 to-[#fe2c55]' :
                                idx === 2 ? 'bg-gradient-to-r from-indigo-500 to-purple-600' :
                                idx === 3 ? 'bg-gradient-to-r from-emerald-500 to-teal-600' :
                                'bg-gradient-to-r from-slate-800 to-slate-950'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Activity Feed Widget */}
                <div className="bg-white rounded-3xl border border-pink-100/90 p-6 shadow-xs space-y-4 flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-slate-950 uppercase tracking-wide font-display">
                      Actividad Administrativa Reciente
                    </h3>
                    <button
                      onClick={() => setActiveModule('audit')}
                      className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                    >
                      Ver todo
                    </button>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
                    {auditLogsList.slice(0, 6).map((log) => (
                      <div key={log.id} className="p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-1 text-left text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 font-bold">{log.action}</strong>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-tight">
                          {log.details}
                        </p>
                        <div className="text-[9.5px] text-slate-400 font-mono">
                          Por: <strong className="text-slate-700">{log.adminUser}</strong> • Módulo: {log.module}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════════ */}
          {/* 2. MÓDULO: GESTIÓN DE USUARIOS */}
          {/* ═════════════════════════════════════════════════════════════════════════ */}
          {activeModule === 'users' && (
            <div className="space-y-6 text-left animate-fade-in" id="admin-module-users">
              
              {/* Header & Controls */}
              <div className="bg-white rounded-3xl border border-pink-100/90 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#fe2c55] font-mono">
                    CONTROL DE IDENTIDADES Y PERMISOS
                  </span>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-1">
                    Gestión Integral de Usuarios ({usersList.length})
                  </h2>
                  <p className="text-xs text-slate-500 max-w-xl mt-0.5 leading-relaxed">
                    Búsqueda, auditoría de balances, edición de campos de perfil, asignación de roles y suspensión / reactivación segura de cuentas.
                  </p>
                </div>

                {/* Filter and search controls */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre, @username o email..."
                      value={globalSearch}
                      onChange={(e) => setGlobalSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-rose-500 font-sans"
                    />
                  </div>

                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="all">Todos los Roles</option>
                    <option value="admin">Administrador</option>
                    <option value="investor">Inversor</option>
                    <option value="model">Modelo</option>
                    <option value="visitor">Visitante</option>
                  </select>

                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  >
                    <option value="all">Todos los Estados</option>
                    <option value="active">Activo</option>
                    <option value="suspended">Suspendido</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-3xl border border-pink-100/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60 font-mono text-[10px] uppercase font-bold text-slate-500">
                        <th className="py-3.5 px-4">Usuario</th>
                        <th className="py-3.5 px-4">Email</th>
                        <th className="py-3.5 px-4">Rol</th>
                        <th className="py-3.5 px-4">Estado</th>
                        <th className="py-3.5 px-4">Saldo Backoffice</th>
                        <th className="py-3.5 px-4">Registro</th>
                        <th className="py-3.5 px-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {usersList
                        .filter(u => {
                          if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
                          if (userStatusFilter !== 'all' && u.status !== userStatusFilter) return false;
                          if (globalSearch) {
                            const q = globalSearch.toLowerCase();
                            return u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || (u.email && u.email.toLowerCase().includes(q));
                          }
                          return true;
                        })
                        .map(user => (
                          <tr key={user.id} className="hover:bg-rose-50/20 transition group">
                            
                            {/* User & Avatar */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-xl object-cover border border-slate-200"
                                />
                                <div>
                                  <strong className="text-slate-900 font-bold block">{user.name}</strong>
                                  <span className="text-[10px] text-slate-400 font-mono">@{user.username}</span>
                                </div>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                              {user.email || 'No especificado'}
                            </td>

                            {/* Role Badge */}
                            <td className="py-3 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase font-mono tracking-wider ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                                user.role === 'model' ? 'bg-pink-100 text-pink-700 border border-pink-200' :
                                user.role === 'investor' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {user.role}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                user.status === 'active' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                {user.status === 'active' ? 'Activo' : 'Suspendido'}
                              </span>
                            </td>

                            {/* Balance */}
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">
                              {(user.balance || 0).toFixed(2)}€
                            </td>

                            {/* Registered date */}
                            <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                              {new Date(user.registeredAt).toLocaleDateString()}
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Edit */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedUserForEdit({ ...user })}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                  title="Editar perfil"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>

                                {/* Suspend / Reactivate */}
                                {user.status === 'active' ? (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedUserForAction({ user, action: 'suspend' })}
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                                    title="Suspender cuenta"
                                  >
                                    <UserX className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedUserForAction({ user, action: 'reactivate' })}
                                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition cursor-pointer"
                                    title="Reactivar cuenta"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>

                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════════ */}
          {/* 3. MÓDULO: GESTIÓN DE PROYECTOS & FINANCIACIÓN */}
          {/* ═════════════════════════════════════════════════════════════════════════ */}
          {activeModule === 'projects' && (
            <div className="space-y-6 text-left animate-fade-in" id="admin-module-projects">
              
              {/* Header and New Project trigger */}
              <div className="bg-white rounded-3xl border border-pink-100/90 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#fe2c55] font-mono">
                    SUPERVISIÓN DE PROPUESTAS & MESAS
                  </span>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-1">
                    Gestión Integral de Proyectos y Financiación
                  </h2>
                  <p className="text-xs text-slate-500 max-w-xl mt-0.5 leading-relaxed">
                    Aprobación y publicación de propuestas de moda, revisión de objetivos presupuestarios, control de rondas y distribución de comisiones según las reglas oficiales de Fashion Finances.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateProjectModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-[#fe2c55] hover:brightness-105 text-white font-bold text-xs tracking-wide transition shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Registrar Nuevo Proyecto</span>
                  </button>
                </div>
              </div>

              {/* Financing Rounds Grid (6 Oficiales) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider">
                    🏛️ Mesas de Financiación Oficiales ({sessionsList.length})
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Comisión Oficial de Plataforma: <strong>5% Escrow</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sessionsList.map((session) => (
                    <div 
                      key={session.id} 
                      className={`rounded-3xl border p-5 bg-white shadow-xs space-y-3 relative overflow-hidden transition ${
                        session.votingPhaseActive ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-pink-100/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">
                          CUOTA: {session.entryFee}€
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase font-mono ${
                          session.votingPhaseActive ? 'bg-indigo-600 text-white animate-pulse' :
                          session.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {session.votingPhaseActive ? 'Votando (10 min)' : session.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
                          {session.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">
                          Participantes: <strong className="text-slate-800">{session.participantsCount}</strong> / {session.maxParticipants}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block font-mono">Bolsa Reunida:</span>
                          <strong className="text-slate-900 font-mono text-sm">{session.totalPoolGathered.toLocaleString()}€</strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase block font-mono">Comisión (5%):</span>
                          <strong className="text-purple-700 font-mono text-sm">{(session.totalPoolGathered * 0.05).toLocaleString()}€</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects Table */}
              <div className="bg-white rounded-3xl border border-pink-100/90 shadow-xs overflow-hidden space-y-3 p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider">
                    Catálogo de Propuestas Registradas
                  </h3>
                  
                  {/* Status filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Estado:</span>
                    <select
                      value={projectStatusFilter}
                      onChange={(e) => setProjectStatusFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-semibold focus:outline-none"
                    >
                      <option value="all">Todos</option>
                      <option value="active">Aprobados / Activos</option>
                      <option value="pending">Pendientes de Revisión</option>
                      <option value="rejected">Rechazados</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60 font-mono text-[10px] uppercase font-bold text-slate-500">
                        <th className="py-3 px-3">Proyecto</th>
                        <th className="py-3 px-3">Autor</th>
                        <th className="py-3 px-3">Categoría</th>
                        <th className="py-3 px-3">Presupuesto</th>
                        <th className="py-3 px-3">Votos</th>
                        <th className="py-3 px-3">Estado</th>
                        <th className="py-3 px-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {projectsList
                        .filter(p => projectStatusFilter === 'all' || p.status === projectStatusFilter)
                        .map(proj => (
                          <tr key={proj.id} className="hover:bg-rose-50/20 transition">
                            <td className="py-3 px-3 font-bold text-slate-900">
                              {proj.title}
                            </td>
                            <td className="py-3 px-3 text-slate-600 font-medium">
                              {proj.authorName || 'Autor'}
                            </td>
                            <td className="py-3 px-3">
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-mono">
                                {proj.category}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-900">
                              {(proj.budget || 0).toLocaleString()}€
                            </td>
                            <td className="py-3 px-3 font-mono font-bold text-rose-600">
                              {proj.votesReceived || 0}
                            </td>
                            <td className="py-3 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                proj.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                proj.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {proj.status === 'active' ? 'Aprobado' : proj.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {proj.status !== 'active' && (
                                  <button
                                    type="button"
                                    onClick={() => setProjectActionModal({ project: proj, action: 'approve' })}
                                    className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
                                    title="Aprobar y publicar en pasarela"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {proj.status !== 'rejected' && (
                                  <button
                                    type="button"
                                    onClick={() => setProjectActionModal({ project: proj, action: 'reject' })}
                                    className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition cursor-pointer"
                                    title="Rechazar propuesta"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setProjectActionModal({ project: proj, action: 'delete' })}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                                  title="Retirar definitivamente"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════════ */}
          {/* 4. MÓDULO: GESTIÓN DE MODELOS Y PATROCINADORES */}
          {/* ═════════════════════════════════════════════════════════════════════════ */}
          {activeModule === 'models' && (
            <div className="space-y-6 text-left animate-fade-in" id="admin-module-models">
              
              <div className="bg-white rounded-3xl border border-pink-100/90 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#fe2c55] font-mono">
                    RANKINGS, PATROCINADORES Y LIKES
                  </span>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-1">
                    Gestión de Modelos y Acuerdos de Marca
                  </h2>
                  <p className="text-xs text-slate-500 max-w-xl mt-0.5 leading-relaxed">
                    Administra el podio de modelos internacionales, verificación de insignias oficiales, contratos B2B con marcas sponsors y supervisión de directos en Casting Live.
                  </p>
                </div>
              </div>

              {/* Models Catalog Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {initialModels.slice(0, 12).map((model, idx) => (
                  <div key={model.id || idx} className="bg-white rounded-3xl border border-pink-100/80 p-4 shadow-xs space-y-3 relative group hover:border-pink-300 transition">
                    <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100">
                      <img
                        src={model.avatar}
                        alt={model.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-slate-900/80 text-white backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                        #{idx + 1} Podio
                      </span>
                      {model.verified && (
                        <span className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full shadow-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">{model.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">@{model.username} • {model.fashionAgency || 'Victoria\'s Secret'}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <strong className="text-slate-800">{model.totalLikes || 1420}</strong>
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {model.gender === 'male' ? 'Masculino' : 'Femenino'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════════ */}
          {/* 5. MÓDULO: CONTENIDO Y COMUNICACIÓN */}
          {/* ═════════════════════════════════════════════════════════════════════════ */}
          {activeModule === 'content' && (
            <div className="space-y-6 text-left animate-fade-in" id="admin-module-content">
              
              <div className="bg-white rounded-3xl border border-pink-100/90 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#fe2c55] font-mono">
                    CANALES, BANNERS E INCIDENCIAS
                  </span>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-1">
                    Contenido, Avisos y Moderación
                  </h2>
                  <p className="text-xs text-slate-500 max-w-xl mt-0.5 leading-relaxed">
                    Emisión de notificaciones push broadcast a usuarios, resolución de denuncias de contenido y gestión de avisos legales.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCreateNotificationModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-[#fe2c55] text-white font-bold text-xs tracking-wide transition shadow-sm cursor-pointer"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Emitir Notificación Masiva</span>
                </button>
              </div>

              {/* Incidencias & Denuncias Queue */}
              <div className="bg-white rounded-3xl border border-pink-100/90 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-extrabold text-slate-950 uppercase tracking-wide font-display">
                    Cola de Reclamaciones, Denuncias & Soporte ({ticketsList.length})
                  </h3>
                  <span className="text-xs text-rose-600 font-bold">
                    {ticketsList.filter(t => t.status !== 'resuelta').length} Pendientes
                  </span>
                </div>

                <div className="space-y-3">
                  {ticketsList.map(ticket => (
                    <div key={ticket.id} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase font-mono ${
                            ticket.type === 'denuncia' ? 'bg-rose-100 text-rose-700' :
                            ticket.type === 'reclamacion' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {ticket.type}
                          </span>
                          <strong className="text-slate-900 text-sm font-bold">{ticket.title}</strong>
                        </div>
                        <p className="text-slate-600 leading-relaxed max-w-2xl">
                          {ticket.description}
                        </p>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Reportado por: <strong>@{ticket.reportedBy}</strong> • {new Date(ticket.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {ticket.status !== 'resuelta' ? (
                          <button
                            type="button"
                            onClick={() => setSelectedTicketForResolution(ticket)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                          >
                            Resolver Incidencia
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                            <Check className="w-3.5 h-3.5" />
                            Resuelta
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Broadcast Notifications List */}
              <div className="bg-white rounded-3xl border border-pink-100/90 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-950 uppercase tracking-wide font-display border-b border-slate-100 pb-3">
                  Notificaciones Emitidas a Usuarios ({notificationsList.length})
                </h3>

                <div className="space-y-3">
                  {notificationsList.map(notif => (
                    <div key={notif.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/50 flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="bg-rose-50 text-rose-600 font-mono text-[9px] font-bold px-2 py-0.5 rounded-md uppercase">
                            Para: {notif.targetRole}
                          </span>
                          <strong className="text-slate-900 text-xs font-bold">{notif.title}</strong>
                        </div>
                        <p className="text-xs text-slate-600">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteNotification(notif.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                        title="Eliminar notificación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════════ */}
          {/* 6. MÓDULO: CONFIGURACIÓN GENERAL & SEGURIDAD */}
          {/* ═════════════════════════════════════════════════════════════════════════ */}
          {activeModule === 'config' && (
            <div className="space-y-6 text-left animate-fade-in" id="admin-module-config">
              
              <div className="bg-white rounded-3xl border border-pink-100/90 p-6 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#fe2c55] font-mono">
                  PARÁMETROS DEL SISTEMA & SEGURIDAD
                </span>
                <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-1">
                  Configuración General de Fashion Finances
                </h2>
                <p className="text-xs text-slate-500 max-w-xl mt-0.5 leading-relaxed">
                  Ajustes de marca, parámetros de rondas de inversión, custodia contractual y directivas de seguridad backend.
                </p>
              </div>

              <form onSubmit={handleSavePlatformConfig} className="space-y-6">
                
                {/* Visual Identity */}
                <div className="bg-white rounded-3xl border border-pink-100/90 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2">
                    Identidad & Marca
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
                        Nombre de la Plataforma:
                      </label>
                      <input
                        type="text"
                        value={platformConfig.platformName}
                        onChange={(e) => setPlatformConfig({ ...platformConfig, platformName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
                        Email de Contacto Oficial:
                      </label>
                      <input
                        type="email"
                        value={platformConfig.contactEmail}
                        onChange={(e) => setPlatformConfig({ ...platformConfig, contactEmail: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
                      Texto del Banner de Aviso Público:
                    </label>
                    <input
                      type="text"
                      value={platformConfig.activeAnnouncementBanner}
                      onChange={(e) => setPlatformConfig({ ...platformConfig, activeAnnouncementBanner: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Economic & Voting Rules */}
                <div className="bg-white rounded-3xl border border-pink-100/90 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-100 pb-2">
                    Reglas Económicas y Rondas
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
                        Comisión de Plataforma (%):
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={platformConfig.platformCommissionPercent}
                        onChange={(e) => setPlatformConfig({ ...platformConfig, platformCommissionPercent: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
                        Duración de Votación (Minutos):
                      </label>
                      <input
                        type="number"
                        value={platformConfig.votingDurationMinutes}
                        onChange={(e) => setPlatformConfig({ ...platformConfig, votingDurationMinutes: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
                        Cuota Mínima de Entrada (€):
                      </label>
                      <input
                        type="number"
                        value={platformConfig.minEntryFee}
                        onChange={(e) => setPlatformConfig({ ...platformConfig, minEntryFee: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={platformConfig.allowRegistrations}
                        onChange={(e) => setPlatformConfig({ ...platformConfig, allowRegistrations: e.target.checked })}
                        className="w-4 h-4 text-rose-600 rounded"
                      />
                      <span>Permitir nuevos registros de inversores y modelos</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={platformConfig.escrowCustodyEnabled}
                        onChange={(e) => setPlatformConfig({ ...platformConfig, escrowCustodyEnabled: e.target.checked })}
                        className="w-4 h-4 text-rose-600 rounded"
                      />
                      <span>Garantía Escrow de Saldo obligatoria en rondas</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-[#fe2c55] hover:brightness-105 text-white font-extrabold text-xs tracking-wider transition shadow-md cursor-pointer"
                  >
                    Guardar Configuración Oficial
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════════════ */}
          {/* 7. MÓDULO: REGISTRO DE AUDITORÍA (AUDIT LOGS) */}
          {/* ═════════════════════════════════════════════════════════════════════════ */}
          {activeModule === 'audit' && (
            <div className="space-y-6 text-left animate-fade-in" id="admin-module-audit">
              
              <div className="bg-white rounded-3xl border border-pink-100/90 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#fe2c55] font-mono">
                    REGISTRO INMUTABLE DE EVENTOS
                  </span>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-1">
                    Pista de Auditoría Forense ({auditLogsList.length})
                  </h2>
                  <p className="text-xs text-slate-500 max-w-xl mt-0.5 leading-relaxed">
                    Historial exhaustivo de cada cambio administrativo, suspensiones de cuentas, aprobaciones de presupuestos y accesos al panel con firma del operador.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Filtrar Módulo:</span>
                  <select
                    value={auditModuleFilter}
                    onChange={(e) => setAuditModuleFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
                  >
                    <option value="all">Todos los Módulos</option>
                    <option value="usuarios">Usuarios</option>
                    <option value="proyectos">Proyectos</option>
                    <option value="financiacion">Financiación</option>
                    <option value="contenido">Contenido</option>
                    <option value="configuracion">Configuración</option>
                    <option value="seguridad">Seguridad</option>
                  </select>
                </div>
              </div>

              {/* Audit Table */}
              <div className="bg-white rounded-3xl border border-pink-100/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60 font-mono text-[10px] uppercase font-bold text-slate-500">
                        <th className="py-3.5 px-4">Fecha / Hora</th>
                        <th className="py-3.5 px-4">Operador</th>
                        <th className="py-3.5 px-4">Acción</th>
                        <th className="py-3.5 px-4">Módulo</th>
                        <th className="py-3.5 px-4">Detalles</th>
                        <th className="py-3.5 px-4">Severidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditLogsList
                        .filter(l => auditModuleFilter === 'all' || l.module === auditModuleFilter)
                        .map(log => (
                          <tr key={log.id} className="hover:bg-rose-50/20 transition">
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900">
                              {log.adminUser}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-800">
                              {log.action}
                            </td>
                            <td className="py-3 px-4">
                              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-mono">
                                {log.module}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 max-w-md text-[11px] leading-relaxed">
                              {log.details}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                                log.severity === 'critical' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                                log.severity === 'warning' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {log.severity}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </section>

      </div>

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* MODALES ADMINISTRATIVOS DE ACCIONES SENSIBLES */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}

      {/* Modal: Confirmar Suspensión / Reactivación */}
      {selectedUserForAction && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-pink-100 max-w-lg w-full p-6 text-left space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <span className={`p-2.5 rounded-2xl ${
                selectedUserForAction.action === 'suspend' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                {selectedUserForAction.action === 'suspend' ? <AlertTriangle className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
              </span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {selectedUserForAction.action === 'suspend' ? 'Confirmar Suspensión de Cuenta' : 'Confirmar Reactivación de Cuenta'}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Usuario: @{selectedUserForAction.user.username} ({selectedUserForAction.user.name})
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedUserForAction.action === 'suspend' 
                ? 'Esta acción impedirá que el usuario inicie sesión, vote proyectos o mueva fondos en Fashion Finances. Se registrará en la auditoría con tu firma.'
                : 'Esta acción restaurará el acceso completo del usuario a la plataforma.'
              }
            </p>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
                Motivo / Justificación Administrativa *
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Especifica el motivo de la acción para el registro de auditoría..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setSelectedUserForAction(null); setActionReason(''); }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmUserStatusChange}
                className={`flex-1 py-2.5 text-white font-bold text-xs rounded-xl transition cursor-pointer ${
                  selectedUserForAction.action === 'suspend'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {selectedUserForAction.action === 'suspend' ? 'Suspender Definitivamente' : 'Reactivar Cuenta'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Usuario */}
      {selectedUserForEdit && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-pink-100 max-w-lg w-full p-6 text-left space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Editar Datos de Usuario @{selectedUserForEdit.username}
              </h3>
              <button onClick={() => setSelectedUserForEdit(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Nombre Completo:</label>
                <input
                  type="text"
                  value={selectedUserForEdit.name}
                  onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Correo Electrónico:</label>
                <input
                  type="email"
                  value={selectedUserForEdit.email || ''}
                  onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Rol Asignado:</label>
                  <select
                    value={selectedUserForEdit.role}
                    onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold"
                  >
                    <option value="investor">Inversor</option>
                    <option value="model">Modelo</option>
                    <option value="admin">Administrador</option>
                    <option value="visitor">Visitante</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Saldo Backoffice (€):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedUserForEdit.balance}
                    onChange={(e) => setSelectedUserForEdit({ ...selectedUserForEdit, balance: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedUserForEdit(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Acción sobre Proyecto (Aprobar / Rechazar / Eliminar) */}
      {projectActionModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-pink-100 max-w-lg w-full p-6 text-left space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900">
              {projectActionModal.action === 'approve' ? 'Aprobar y Publicar Proyecto' : 
               projectActionModal.action === 'reject' ? 'Rechazar Propuesta de Proyecto' : 'Retirar Proyecto de la Plataforma'}
            </h3>
            <p className="text-xs text-slate-600">
              Proyecto: <strong>"{projectActionModal.project.title}"</strong> ({projectActionModal.project.budget.toLocaleString()}€)
            </p>

            {projectActionModal.action === 'reject' && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Motivo del Rechazo:</label>
                <textarea
                  value={projectRejectionReason}
                  onChange={(e) => setProjectRejectionReason(e.target.value)}
                  placeholder="Explica al autor el motivo de la no aprobación..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProjectActionModal(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmProjectStatus}
                className={`flex-1 py-2.5 text-white font-bold text-xs rounded-xl ${
                  projectActionModal.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Registrar Nuevo Proyecto */}
      {showCreateProjectModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-pink-100 max-w-lg w-full p-6 text-left space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Registrar Proyecto de Moda</h3>
              <button onClick={() => setShowCreateProjectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Título del Proyecto *</label>
                <input
                  type="text"
                  required
                  value={newProjectForm.title}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Categoría *</label>
                  <select
                    value={newProjectForm.category}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  >
                    <option value="Casual & Lifestyle">Casual & Lifestyle</option>
                    <option value="Streetwear & Urban">Streetwear & Urban</option>
                    <option value="Haute Couture">Haute Couture</option>
                    <option value="Calzado & Accesorios">Calzado & Accesorios</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Presupuesto (€) *</label>
                  <input
                    type="number"
                    required
                    value={newProjectForm.budget}
                    onChange={(e) => setNewProjectForm({ ...newProjectForm, budget: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Objetivo y Descripción Breve</label>
                <textarea
                  rows={3}
                  value={newProjectForm.objective}
                  onChange={(e) => setNewProjectForm({ ...newProjectForm, objective: e.target.value })}
                  placeholder="Detalla la propuesta de valor para la pasarela y las mesas de votación..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateProjectModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-[#fe2c55] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Publicar Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Emitir Notificación Masiva */}
      {showCreateNotificationModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-pink-100 max-w-lg w-full p-6 text-left space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Emitir Aviso Masivo a Usuarios</h3>
              <button onClick={() => setShowCreateNotificationModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotification} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Título del Aviso *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Apertura de nueva ronda de inversión"
                  value={newNotificationForm.title}
                  onChange={(e) => setNewNotificationForm({ ...newNotificationForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Destinatarios *</label>
                <select
                  value={newNotificationForm.targetRole}
                  onChange={(e) => setNewNotificationForm({ ...newNotificationForm, targetRole: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold"
                >
                  <option value="all">Todos los Usuarios Registrados</option>
                  <option value="investor">Sólo Inversores</option>
                  <option value="model">Sólo Modelos</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Mensaje Completo *</label>
                <textarea
                  required
                  rows={3}
                  value={newNotificationForm.message}
                  onChange={(e) => setNewNotificationForm({ ...newNotificationForm, message: e.target.value })}
                  placeholder="Escribe el texto de la notificación..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateNotificationModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-rose-500 to-[#fe2c55] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Emitir Aviso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Resolver Incidencia */}
      {selectedTicketForResolution && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-pink-100 max-w-lg w-full p-6 text-left space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900">
              Resolver Incidencia #{selectedTicketForResolution.id}
            </h3>
            <p className="text-xs text-slate-600">
              "{selectedTicketForResolution.title}" reportado por @{selectedTicketForResolution.reportedBy}.
            </p>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Nota de Resolución *</label>
              <textarea
                rows={3}
                value={ticketResolutionNote}
                onChange={(e) => setTicketResolutionNote(e.target.value)}
                placeholder="Indica la solución aplicada para archivar la incidencia..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTicketForResolution(null)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleResolveTicket}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Marcar como Resuelta
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
