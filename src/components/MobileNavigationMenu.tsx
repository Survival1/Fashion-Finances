import React from 'react';
import { 
  Wallet, 
  Award, 
  PlusCircle, 
  Layers, 
  MessageCircle, 
  Video, 
  Users, 
  LogOut 
} from 'lucide-react';

interface MobileNavigationMenuProps {
  activeTab: string;
  userRole?: string;
  onNavigateToTab: (tab: string) => void;
  onLogout: () => void;
  selectedModelForView?: any;
  onResetSelectedModel?: () => void;
}

export default function MobileNavigationMenu({
  activeTab,
  userRole = 'model',
  onNavigateToTab,
  onLogout,
  selectedModelForView,
  onResetSelectedModel
}: MobileNavigationMenuProps) {
  const isProfileActive = (activeTab === 'home' && !selectedModelForView) || activeTab === 'profile';

  return (
    <div className="md:hidden w-full max-w-[360px] xs:max-w-[400px] sm:max-w-[460px] md:max-w-[560px] lg:max-w-[640px] mx-auto px-1.5 xs:px-2 sm:px-3 space-y-2.5 pt-1 pb-2 animate-fade-in box-border" id="mobile-navigation-image-menu">
      {/* 1. MI PERFIL */}
      <button
        type="button"
        onClick={() => {
          if (onResetSelectedModel) {
            onResetSelectedModel();
          }
          onNavigateToTab(userRole === 'model' ? 'home' : 'profile');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`w-full flex items-center justify-between px-4 py-3.5 bg-white hover:bg-slate-50 border rounded-2xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer text-left ${
          isProfileActive ? 'border-slate-900 ring-1 ring-slate-900/10 shadow-xs' : 'border-slate-200/90'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-base select-none">👠</span>
          <span className="text-[11.5px] font-black text-slate-850 uppercase tracking-wider font-mono">MI PERFIL</span>
        </div>
      </button>

      {/* 2. MIS FINANZAS */}
      <button
        type="button"
        onClick={() => {
          onNavigateToTab('finance');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`w-full flex items-center justify-between px-4 py-3.5 bg-white hover:bg-slate-50 border rounded-2xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer text-left ${
          activeTab === 'finance' ? 'border-slate-900 ring-1 ring-slate-900/10 shadow-xs' : 'border-slate-200/90'
        }`}
      >
        <div className="flex items-center gap-3">
          <Wallet className="w-4 h-4 text-slate-750" />
          <span className="text-[11.5px] font-black text-slate-850 uppercase tracking-wider font-mono">MIS FINANZAS</span>
        </div>
      </button>

      {/* 3. SESIONES */}
      <button
        type="button"
        onClick={() => {
          onNavigateToTab('sessions');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`w-full flex items-center justify-between px-4 py-3.5 bg-white hover:bg-slate-50 border rounded-2xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer text-left ${
          activeTab === 'sessions' ? 'border-slate-900 ring-1 ring-slate-900/10 shadow-xs' : 'border-slate-200/90'
        }`}
      >
        <div className="flex items-center gap-3">
          <Award className="w-4 h-4 text-slate-750" />
          <span className="text-[11.5px] font-black text-slate-850 uppercase tracking-wider font-mono">SESIONES</span>
        </div>
      </button>

      {/* 4. REGISTRAR PROYECTO */}
      <button
        type="button"
        onClick={() => {
          onNavigateToTab('create_project');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`w-full flex items-center justify-between px-4 py-3.5 bg-white hover:bg-slate-50 border rounded-2xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer text-left ${
          activeTab === 'create_project' ? 'border-slate-900 ring-1 ring-slate-900/10 shadow-xs' : 'border-slate-200/90'
        }`}
      >
        <div className="flex items-center gap-3">
          <PlusCircle className="w-4 h-4 text-slate-750" />
          <span className="text-[11.5px] font-black text-slate-850 uppercase tracking-wider font-mono">REGISTRAR PROYECTO</span>
        </div>
      </button>

      {/* 5. PROYECTOS GUARDADOS */}
      <button
        type="button"
        onClick={() => {
          onNavigateToTab('saved_projects');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`w-full flex items-center justify-between px-4 py-3.5 bg-white hover:bg-slate-50 border rounded-2xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer text-left ${
          activeTab === 'saved_projects' ? 'border-slate-900 ring-1 ring-slate-900/10 shadow-xs' : 'border-slate-200/90'
        }`}
      >
        <div className="flex items-center gap-3">
          <Layers className="w-4 h-4 text-slate-750" />
          <span className="text-[11.5px] font-black text-slate-850 uppercase tracking-wider font-mono">PROYECTOS GUARDADOS</span>
        </div>
      </button>

      {/* 6. MENSAJES */}
      <button
        type="button"
        onClick={() => {
          onNavigateToTab('chat');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`w-full flex items-center justify-between px-4 py-3.5 bg-white hover:bg-slate-50 border rounded-2xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer text-left ${
          activeTab === 'chat' ? 'border-slate-900 ring-1 ring-slate-900/10 shadow-xs' : 'border-slate-200/90'
        }`}
      >
        <div className="flex items-center gap-3">
          <MessageCircle className="w-4 h-4 text-slate-750" />
          <span className="text-[11.5px] font-black text-slate-850 uppercase tracking-wider font-mono">MENSAJES</span>
        </div>
      </button>

      {/* 7. CASTING LIVE */}
      <button
        type="button"
        onClick={() => {
          localStorage.removeItem('selectedLiveModelId');
          localStorage.setItem('casting_live_active_subtab', 'para-ti');
          onNavigateToTab('casting_live');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`w-full flex items-center justify-between px-4 py-3.5 bg-white hover:bg-slate-50 border rounded-2xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer text-left ${
          activeTab === 'casting_live' ? 'border-slate-900 ring-1 ring-slate-900/10 shadow-xs' : 'border-slate-200/90'
        }`}
      >
        <div className="flex items-center gap-3">
          <Video className="w-4 h-4 text-rose-500" />
          <span className="text-[11.5px] font-black text-slate-850 uppercase tracking-wider font-mono">CASTING LIVE</span>
        </div>
        <span className="bg-slate-950 text-white text-[9px] font-black font-sans px-2.5 py-0.5 rounded-full tracking-wider select-none">NUEVO</span>
      </button>

      {/* 8. PATROCINADOS */}
      <button
        type="button"
        onClick={() => {
          onNavigateToTab('patrocinados');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`w-full flex items-center justify-between px-4 py-3.5 bg-white hover:bg-slate-50 border rounded-2xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer text-left ${
          activeTab === 'patrocinados' ? 'border-slate-900 ring-1 ring-slate-900/10 shadow-xs' : 'border-slate-200/90'
        }`}
      >
        <div className="flex items-center gap-3">
          <Users className="w-4 h-4 text-slate-750" />
          <span className="text-[11.5px] font-black text-slate-850 uppercase tracking-wider font-mono">PATROCINADOS</span>
        </div>
      </button>

      {/* 9. CERRAR SESIÓN */}
      <button
        type="button"
        onClick={onLogout}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-white hover:bg-rose-50/50 border border-slate-200/90 hover:border-rose-300 rounded-2xl shadow-2xs transition-all active:scale-[0.98] cursor-pointer text-left text-rose-600 group"
      >
        <div className="flex items-center gap-3">
          <LogOut className="w-4 h-4 text-rose-500" />
          <span className="text-[11.5px] font-black uppercase tracking-wider font-mono">CERRAR SESIÓN</span>
        </div>
      </button>
    </div>
  );
}
