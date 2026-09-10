/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ModelProfile, UserSessionProfile, InvestmentSession, ProjectData, ChatMessage, FinancialMovement, HistoryWonRecord } from './types';
import { seedInitialData, generateTop100Ranking, RankingModel } from './utils/seedData';
import { compressAndResizeImage } from './utils/imageCompressor';
import ModelGrid from './components/ModelGrid';
import DashboardStats from './components/DashboardStats';
import SessionSimulator from './components/SessionSimulator';
import ProjectForm from './components/ProjectForm';
import DirectMessageChat from './components/DirectMessageChat';
import ContactForm from './components/ContactForm';
import ModelFacebookProfile, { ProfileIntroAndSponsors } from './components/ModelFacebookProfile';
import HeartRainOverlay from './components/HeartRainOverlay';
import PatrocinadosView, { Patrocinado } from './components/PatrocinadosView';
import SavedProjectsManager from './components/SavedProjectsManager';
import CastingLiveSection from './components/CastingLiveSection';
import LandingPage from './components/LandingPage';
import VictoriaSecretRanking from './components/VictoriaSecretRanking';
import FashionsFinanceLogo from './components/FashionsFinanceLogo';
import FashionRankingSlider from './components/FashionRankingSlider';
import GlobalMobileImageLightbox from './components/GlobalMobileImageLightbox';
import MobileNavigationMenu from './components/MobileNavigationMenu';
import { 
  Sparkles, 
  Home, 
  Wallet, 
  Award, 
  MessageCircle, 
  PlusCircle, 
  User, 
  Users, 
  Plus, 
  Flame, 
  Info, 
  Lock, 
  ArrowRight, 
  UserPlus2, 
  Heart, 
  Landmark, 
  ShieldCheck, 
  Shield, 
  CheckCircle, 
  Clock, 
  HelpCircle,
  LogOut,
  Camera,
  Layers,
  Video,
  ChevronLeft,
  ChevronRight,
  X,
  UserCheck,
  Instagram,
  Crown
} from 'lucide-react';

const generateNextUserId = (): string => {
  const currentSeqStr = localStorage.getItem('ff_user_id_seq') || '1';
  let currentSeqVal = parseInt(currentSeqStr, 10);
  if (isNaN(currentSeqVal) || currentSeqVal < 1) {
    currentSeqVal = 1;
  }
  const formattedId = String(currentSeqVal).padStart(11, '0');
  localStorage.setItem('ff_user_id_seq', String(currentSeqVal + 1));
  return formattedId;
};

const DEFAULT_TOP_10_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600',
];

function ExpandedModelPhotoSlider({ model }: { model: ModelProfile }) {
  const photosList = useMemo(() => {
    const list: string[] = [];
    if (model.avatar) list.push(model.avatar);
    if (model.photos && Array.isArray(model.photos)) {
      model.photos.forEach(p => {
        if (p && !list.includes(p)) list.push(p);
      });
    }
    DEFAULT_TOP_10_PHOTOS.forEach(p => {
      if (list.length < 10 && !list.includes(p)) {
        list.push(p);
      }
    });
    return list.slice(0, 10);
  }, [model]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? photosList.length - 1 : prev - 1));
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === photosList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full flex-1 bg-slate-950 rounded-2xl flex items-center justify-center p-3 sm:p-4 relative min-h-[220px] sm:min-h-[260px] md:min-h-[300px] overflow-hidden shadow-inner group">
      {/* Photo counter badge */}
      <div className="absolute top-3 left-3 z-20 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-mono font-bold flex items-center gap-1.5 border border-white/15 shadow-md select-none">
        <Camera className="w-3 h-3 text-rose-400" />
        <span>{currentIndex + 1} / {photosList.length}</span>
      </div>

      {/* Main image */}
      <img
        key={currentIndex}
        src={photosList[currentIndex]}
        alt={`${model.name} photo ${currentIndex + 1}`}
        referrerPolicy="no-referrer"
        onClick={nextPhoto}
        className="max-w-full max-h-[26vh] sm:max-h-[30vh] md:max-h-[34vh] lg:max-h-[38vh] object-contain rounded-xl shadow-2xl border border-slate-900/60 transition-all duration-300 animate-fade-in cursor-pointer select-none"
        title="Haz clic para siguiente foto"
      />

      {/* Left chevron button */}
      {photosList.length > 1 && (
        <button
          type="button"
          onClick={prevPhoto}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8.5 h-8.5 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white flex items-center justify-center transition-all duration-200 border border-white/20 shadow-lg cursor-pointer hover:scale-110 active:scale-95"
          title="Foto anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Right chevron button */}
      {photosList.length > 1 && (
        <button
          type="button"
          onClick={nextPhoto}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8.5 h-8.5 rounded-full bg-slate-900/75 hover:bg-slate-900 text-white flex items-center justify-center transition-all duration-200 border border-white/20 shadow-lg cursor-pointer hover:scale-110 active:scale-95"
          title="Siguiente foto"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Bottom pagination dots */}
      {photosList.length > 1 && (
        <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/15">
          {photosList.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                idx === currentIndex ? 'w-4 bg-rose-500' : 'w-1.5 bg-white/40 hover:bg-white/80'
              }`}
              title={`Ver foto ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  // --- Persistent State Hooks ---
  const [models, setModels] = useState<ModelProfile[]>(() => {
    try {
      const raw = localStorage.getItem('coll_models');
      const version = localStorage.getItem('db_version_v12');
      if (raw && version === 'true') {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length >= 100) return parsed;
      }
    } catch (e) {}
    const seed = seedInitialData();
    localStorage.setItem('coll_models', JSON.stringify(seed.models));
    localStorage.setItem('db_version_v12', 'true');
    return seed.models;
  });

  const [userProfile, setUserProfile] = useState<UserSessionProfile | null>(() => {
    try {
      const raw = localStorage.getItem('coll_userProfile');
      const version = localStorage.getItem('db_version_v9');
      if (raw && version === 'true') {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.id && parsed.role) {
          const avatarUrl = (!parsed.avatar || parsed.avatar.includes('photo-1507003211169-0a1dd7228f2d'))
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650'
            : parsed.avatar;
          return {
            ...parsed,
            name: parsed.name === 'Ernesto vs' || parsed.name === 'Ernesto VS' ? 'Adriana Lima' : parsed.name,
            avatar: avatarUrl,
            balance: typeof parsed.balance === 'number' && !isNaN(parsed.balance) ? parsed.balance : (parsed.role === 'investor' ? 100.00 : 0.00),
            totalEarnings: typeof parsed.totalEarnings === 'number' && !isNaN(parsed.totalEarnings) ? parsed.totalEarnings : 0.00,
            totalInvested: typeof parsed.totalInvested === 'number' && !isNaN(parsed.totalInvested) ? parsed.totalInvested : 0.00,
            totalCommissions: typeof parsed.totalCommissions === 'number' && !isNaN(parsed.totalCommissions) ? parsed.totalCommissions : 0.00,
            patrocinadorId: parsed.patrocinadorId || 'model-1'
          };
        }
      }
    } catch (e) {}
    const seed = seedInitialData();
    localStorage.setItem('coll_userProfile', JSON.stringify(seed.userProfile));
    localStorage.setItem('db_version_v9', 'true');
    return seed.userProfile;
  });

  const [isLoaded, setIsLoaded] = useState(true);

  const [projects, setProjects] = useState<ProjectData[]>(() => {
    try {
      const raw = localStorage.getItem('coll_projects');
      const version = localStorage.getItem('db_version_v8');
      if (raw && version === 'true') {
        const parsed: ProjectData[] = JSON.parse(raw) || [];
        return parsed.map(p => ({
          ...p,
          team: (p.team || []).map(m => {
            const lower = (m.name || '').toLowerCase();
            if (lower.includes('ernesto')) {
              return {
                ...m,
                name: 'Ernesto V. S.',
                avatar: m.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
              };
            }
            if (lower.includes('adriana')) {
              return {
                ...m,
                name: 'Adriana Lima',
                avatar: m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
              };
            }
            return m;
          })
        }));
      }
    } catch (e) {}
    const seed = seedInitialData();
    localStorage.setItem('coll_projects', JSON.stringify(seed.projects));
    return seed.projects;
  });

  const [sessions, setSessions] = useState<InvestmentSession[]>(() => {
    try {
      const raw = localStorage.getItem('coll_sessions');
      const version = localStorage.getItem('db_version_v8');
      if (raw && version === 'true') {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasWorkers = parsed.some((s: InvestmentSession) => s.id === 'sess-workers');
          const hasEntrepreneurs = parsed.some((s: InvestmentSession) => s.id === 'sess-entrepreneurs');
          const hasBusinessmen = parsed.some((s: InvestmentSession) => s.id === 'sess-businessmen');
          const hasTopModels = parsed.some((s: InvestmentSession) => s.id === 'sess-topmodels');
          const hasInvestors = parsed.some((s: InvestmentSession) => s.id === 'sess-investors');
          const hasMillionaires = parsed.some((s: InvestmentSession) => s.id === 'sess-millionaires');
          if (hasWorkers && hasEntrepreneurs && hasBusinessmen && hasTopModels && hasInvestors && hasMillionaires) {
            const updated = parsed.map((s: InvestmentSession) => {
              if (s.id === 'sess-workers' || s.entryFee === 10 || (s.title && s.title.toLowerCase().includes('trabajad'))) {
                return { ...s, title: 'Round STREETWEAR & URBAN' };
              }
              if (s.id === 'sess-entrepreneurs' || s.entryFee === 100 || (s.title && (s.title.toLowerCase().includes('bronce') || s.title.toLowerCase().includes('emprend')))) {
                return { ...s, title: 'Round CASUAL & LIFESTYLE' };
              }
              if (s.id === 'sess-businessmen' || s.entryFee === 1000 || (s.title && (s.title.toLowerCase().includes('acero') || s.title.toLowerCase().includes('empresar')))) {
                return { ...s, title: 'Ronda Glamour ✨' };
              }
              if (s.id === 'sess-topmodels' || s.entryFee === 10000 || (s.title && (s.title.toLowerCase().includes('model') || s.title.toLowerCase().includes('oro') || s.title.toLowerCase().includes('classic') || s.title.toLowerCase().includes('elegant')))) {
                return { ...s, title: 'Ronda Elegant & Classic 🤍' };
              }
              if (s.id === 'sess-investors' || s.entryFee === 100000 || (s.title && (s.title.toLowerCase().includes('invers') || s.title.toLowerCase().includes('rosa')))) {
                return { ...s, title: 'Ronda High Fashion 👠' };
              }
              if (s.id === 'sess-millionaires' || s.entryFee === 1000000 || (s.title && (s.title.toLowerCase().includes('millonar') || s.title.toLowerCase().includes('platino')))) {
                return { ...s, title: 'Ronda High Fashion 👠' };
              }
              return s;
            });
            localStorage.setItem('coll_sessions', JSON.stringify(updated));
            return updated;
          }
        }
      }
    } catch (e) {}
    const seed = seedInitialData();
    localStorage.setItem('coll_sessions', JSON.stringify(seed.sessions));
    return seed.sessions;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = localStorage.getItem('coll_messages');
      const version = localStorage.getItem('db_version_v8');
      if (raw && version === 'true') {
        return JSON.parse(raw) || [];
      }
    } catch (e) {}
    const seed = seedInitialData();
    localStorage.setItem('coll_messages', JSON.stringify(seed.messages));
    return seed.messages;
  });

  const [movements, setMovements] = useState<FinancialMovement[]>(() => {
    try {
      const raw = localStorage.getItem('coll_movements');
      const version = localStorage.getItem('db_version_v8');
      if (raw && version === 'true') {
        return JSON.parse(raw) || [];
      }
    } catch (e) {}
    const seed = seedInitialData();
    localStorage.setItem('coll_movements', JSON.stringify(seed.movements));
    return seed.movements;
  });

  const [historyWonLog, setHistoryWonLog] = useState<{ id: string; title: string; prize: number; date: string; projectId?: string; projectName?: string }[]>(() => {
    try {
      const raw = localStorage.getItem('coll_historyLog');
      const version = localStorage.getItem('db_version_v8');
      if (raw && version === 'true') {
        return JSON.parse(raw) || [];
      }
    } catch (e) {}
    const initialLog = [
      { id: 'sess-old-1', title: 'Sesión Emprendedores - Genesis R1', prize: 80.00, date: '2026-05-30T16:00:00Z', projectId: 'proj-1', projectName: 'Eco-Fashion Runway' }
    ];
    localStorage.setItem('coll_historyLog', JSON.stringify(initialLog));
    return initialLog;
  });

  const [showVictoriaSecretRanking, setShowVictoriaSecretRanking] = useState(false);

  const [top100Rankings, setTop100Rankings] = useState<{ females: RankingModel[], males: RankingModel[] }>(() => {
    const cache = localStorage.getItem('coll_top_100_ranking');
    const currentDbVersion = localStorage.getItem('db_version_v12');
    if (cache && currentDbVersion === 'true') {
      try {
        const parsed = JSON.parse(cache);
        if (parsed && Array.isArray(parsed.females) && Array.isArray(parsed.males) && (parsed.females.length + parsed.males.length >= 100)) {
          return parsed;
        }
      } catch (e) {
        // Fallback to auto-generator
      }
    }
    const generated = generateTop100Ranking();
    localStorage.setItem('coll_top_100_ranking', JSON.stringify(generated));
    return generated;
  });

  const womenSliderRef = useRef<HTMLDivElement>(null);
  const menSliderRef = useRef<HTMLDivElement>(null);

  // --- UI/Navigation State Hooks ---
  const [activeTab, setActiveTabTab] = useState<'home' | 'finance' | 'sessions' | 'create_project' | 'chat' | 'profile' | 'patrocinados' | 'saved_projects' | 'casting_live'>('profile');
  const [initialSelectedStoreId, setInitialSelectedStoreId] = useState<string | null>(null);
  const [selectedLiveModelId, setSelectedLiveModelId] = useState<string | undefined>(undefined);
  const [selectedModelForView, setSelectedModelForView] = useState<ModelProfile | null>(null);
  const [modelViewSourceTab, setModelViewSourceTab] = useState<string | null>(null);
  const [selectedModelForExpandedView, setSelectedModelForExpandedView] = useState<ModelProfile | null>(null);
  const [rankingVideoPlayUrl, setRankingVideoPlayUrl] = useState<string | null>(null);
  const [rankingVideoModelName, setRankingVideoModelName] = useState<string | null>(null);
  const [patrocinadosList, setPatrocinadosList] = useState<Patrocinado[]>(() => {
    try {
      const raw = localStorage.getItem('coll_patrocinados');
      if (raw) {
        const parsed: Patrocinado[] = JSON.parse(raw);
        return parsed.map(p => {
          if (p.avatar && p.avatar.includes('1524504388940-b1c1722553e1')) {
            return { ...p, avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150' };
          }
          return p;
        });
      }
    } catch (e) {}
    const defaultPatrocinados: Patrocinado[] = [
      {
        id: 'pat-0',
        name: 'juan',
        username: 'pedro',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        role: 'model',
        registeredAt: '1 jun 2026',
        earningsGenerated: 47.00,
        status: 'active'
      },
      {
        id: 'pat-1',
        name: 'Sofía Martínez',
        username: 'sofia_mtz',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
        role: 'investor',
        registeredAt: '15 de ene. 2026',
        earningsGenerated: 125.50,
        status: 'active'
      },
      {
        id: 'pat-2',
        name: 'Carlos Mendoza',
        username: 'carlos_mendu',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
        role: 'investor',
        registeredAt: '2 de feb. 2026',
        earningsGenerated: 42.00,
        status: 'active'
      },
      {
        id: 'pat-3',
        name: 'Lucía Olivera',
        username: 'lu_olivera',
        avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150',
        role: 'model',
        registeredAt: '18 de mar. 2026',
        earningsGenerated: 310.20,
        status: 'active'
      },
      {
        id: 'pat-4',
        name: 'Alejandro Ortiz',
        username: 'ale_ortiz',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        role: 'investor',
        registeredAt: '30 de abr. 2026',
        earningsGenerated: 18.00,
        status: 'inactive'
      },
      {
        id: 'pat-5',
        name: 'Valeria Russo',
        username: 'val_russo',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150',
        role: 'model',
        registeredAt: '5 de jun. 2026',
        earningsGenerated: 0.00,
        status: 'active'
      }
    ];
    localStorage.setItem('coll_patrocinados', JSON.stringify(defaultPatrocinados));
    return defaultPatrocinados;
  });
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [addFundsAmount, setAddFundsAmount] = useState('50');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration form inputs
  const [regName, setRegName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regInstagram, setRegInstagram] = useState('');
  const [regTikTok, setRegTikTok] = useState('');
  const [regRole, setRegRole] = useState<'investor' | 'model'>('investor');
  const [regGender, setRegGender] = useState<'female' | 'male'>('female');
  const [regSponsorId, setRegSponsorId] = useState('');
  const [sponsorSearchQuery, setSponsorSearchQuery] = useState('');
  const [regDireccion, setRegDireccion] = useState('');
  const [regCiudad, setRegCiudad] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCodigoPostal, setRegCodigoPostal] = useState('');
  const [regPais, setRegPais] = useState('');
  const [regTelefono, setRegTelefono] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // Welcome Email simulation and Password recovery states
  const [showWelcomeEmailModal, setShowWelcomeEmailModal] = useState(false);
  const [pendingWelcomeProfile, setPendingWelcomeProfile] = useState<UserSessionProfile | null>(null);
  const [pendingWelcomeModels, setPendingWelcomeModels] = useState<ModelProfile[] | null>(null);
  const [pendingWelcomeProjects, setPendingWelcomeProjects] = useState<ProjectData[] | null>(null);
  const [pendingWelcomeRankings, setPendingWelcomeRankings] = useState<{ females: RankingModel[], males: RankingModel[] } | null>(null);

  const [showForgotPasswordView, setShowForgotPasswordView] = useState(false);
  const [recoveryEmailInput, setRecoveryEmailInput] = useState('');
  const [showRecoveryEmailModal, setShowRecoveryEmailModal] = useState(false);
  const [recoveredUsername, setRecoveredUsername] = useState('');
  const [recoveredEmail, setRecoveredEmail] = useState('');

  // Image Upload form inputs for Models
  const [newModelPhotoURL, setNewModelPhotoURL] = useState('');
  const [activeChatTargetId, setActiveChatTargetId] = useState<string>('');
  const [sharedDraftImage, setSharedDraftImage] = useState<string | null>(null);
  const [profileSocialModalState, setProfileSocialModalState] = useState<'followers' | 'following' | 'friends' | null>(null);
  const [lastProfileTab, setLastProfileTab] = useState<'home' | 'profile'>('profile');
  const [previousTab, setPreviousTab] = useState<string>('casting_live');

  // Edit Profile form inputs
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editAvatar, setEditAvatar] = useState('');
  const [editBanner, setEditBanner] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editTikTok, setEditTikTok] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editDireccion, setEditDireccion] = useState('');
  const [editTelefono, setEditTelefono] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editShareDireccion, setEditShareDireccion] = useState(true);
  const [editShareTelefono, setEditShareTelefono] = useState(true);
  const [editShareEmail, setEditShareEmail] = useState(true);
  
  useEffect(() => {
    if (userProfile?.role === 'model') {
      setLastProfileTab('home');
    } else {
      setLastProfileTab('profile');
    }
  }, [userProfile?.role]);
  
  // Friends list persistent state
  const [friendsList, setFriendsList] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem('coll_friends');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    const defaultFriends = [
      {
        id: 'friend-1',
        name: 'Adriana Lima',
        username: 'adrianalima_w1',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'model',
        bio: 'Modelo internacional y apasionado/a del fitness.',
        online: true,
        addedMe: true
      },
      {
        id: 'friend-2',
        name: 'Alexander Vance',
        username: 'alexandervance1',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
        role: 'model',
        bio: 'Creador/a de trends y embajador/a de marcas de alta.',
        online: true,
        addedMe: true
      },
      {
        id: 'friend-3',
        name: 'Isabella Dubois',
        username: 'isabelladubois2',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
        role: 'model',
        bio: 'Enfocado/a en el empoderamiento y nuevos negocios creativos.',
        online: true,
        addedMe: false
      },
      {
        id: 'friend-4',
        name: 'Mia Kincaid',
        username: 'miakincaid',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        role: 'model',
        bio: 'Influencer de estilo de vida, mentor de creadores emergentes.',
        online: true,
        addedMe: true
      },
      {
        id: 'friend-5',
        name: 'Elena Rostova',
        username: 'elenarostova',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
        role: 'model',
        bio: 'Estilo de vida, moda urbana e innovación sostenible.',
        online: false,
        addedMe: true
      }
    ];
    localStorage.setItem('coll_friends', JSON.stringify(defaultFriends));
    return defaultFriends;
  });

  const [followersList, setFollowersList] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem('coll_followers');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    const defaultFollowers = [
      {
        id: 'fol-1',
        name: 'Adriana Lima',
        username: 'adrianalima_w1',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'model',
        bio: 'Modelo internacional y apasionado/a del fitness.',
        online: true,
        followedBack: true
      },
      {
        id: 'fol-2',
        name: 'Alexander Vance',
        username: 'alexandervance1',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
        role: 'model',
        bio: 'Creador/a de trends y embajador/a de marcas de alta.',
        online: true,
        followedBack: false
      },
      {
        id: 'fol-3',
        name: 'Isabella Dubois',
        username: 'isabelladubois2',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
        role: 'model',
        bio: 'Enfocado/a en el empoderamiento y nuevos negocios creativos.',
        online: true,
        followedBack: false
      },
      {
        id: 'fol-4',
        name: 'Elena Rostova',
        username: 'elenarostova',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
        role: 'model',
        bio: 'Estilo de vida, moda urbana e innovación sostenible.',
        online: false,
        followedBack: true
      }
    ];
    localStorage.setItem('coll_followers', JSON.stringify(defaultFollowers));
    return defaultFollowers;
  });

  const [followingList, setFollowingList] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem('coll_following');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    const defaultFollowing = [
      {
        id: 'fol-1',
        name: 'Adriana Lima',
        username: 'adrianalima_w1',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        role: 'model',
        bio: 'Modelo internacional y apasionado/a del fitness.',
        online: true
      }
    ];
    localStorage.setItem('coll_following', JSON.stringify(defaultFollowing));
    return defaultFollowing;
  });
  const [friendsActiveTab, setFriendsActiveTab] = useState<'friends' | 'followers' | 'following'>('friends');
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [activeSocialModalInvestor, setActiveSocialModalInvestor] = useState<'followers' | 'following' | 'friends' | null>(null);

  // Filter social lists to never include the logged-in user
  const displayedFriends = useMemo(() => {
    return friendsList.filter(item => {
      if (!item) return false;
      const isSelf = 
        (userProfile?.id && item.id && userProfile.id.toLowerCase() === item.id.toLowerCase()) ||
        (userProfile?.name && item.name && userProfile.name.toLowerCase() === item.name.toLowerCase()) ||
        (userProfile?.username && item.username && userProfile.username.toLowerCase() === item.username.toLowerCase()) ||
        ((userProfile?.name?.toLowerCase().includes('adriana') || userProfile?.username?.toLowerCase().includes('adrianalima')) && 
         (item.name?.toLowerCase().includes('adriana') || item.username?.toLowerCase().includes('adrianalima') || item.id === 'friend-1'));
      return !isSelf;
    });
  }, [friendsList, userProfile?.id, userProfile?.name, userProfile?.username]);

  const displayedFollowers = useMemo(() => {
    return followersList.filter(item => {
      if (!item) return false;
      const isSelf = 
        (userProfile?.id && item.id && userProfile.id.toLowerCase() === item.id.toLowerCase()) ||
        (userProfile?.name && item.name && userProfile.name.toLowerCase() === item.name.toLowerCase()) ||
        (userProfile?.username && item.username && userProfile.username.toLowerCase() === item.username.toLowerCase()) ||
        ((userProfile?.name?.toLowerCase().includes('adriana') || userProfile?.username?.toLowerCase().includes('adrianalima')) && 
         (item.name?.toLowerCase().includes('adriana') || item.username?.toLowerCase().includes('adrianalima') || item.id === 'fol-1'));
      return !isSelf;
    });
  }, [followersList, userProfile?.id, userProfile?.name, userProfile?.username]);

  const displayedFollowing = useMemo(() => {
    return followingList.filter(item => {
      if (!item) return false;
      const isSelf = 
        (userProfile?.id && item.id && userProfile.id.toLowerCase() === item.id.toLowerCase()) ||
        (userProfile?.name && item.name && userProfile.name.toLowerCase() === item.name.toLowerCase()) ||
        (userProfile?.username && item.username && userProfile.username.toLowerCase() === item.username.toLowerCase()) ||
        ((userProfile?.name?.toLowerCase().includes('adriana') || userProfile?.username?.toLowerCase().includes('adrianalima')) && 
         (item.name?.toLowerCase().includes('adriana') || item.username?.toLowerCase().includes('adrianalima') || item.id === 'fol-1'));
      return !isSelf;
    });
  }, [followingList, userProfile?.id, userProfile?.name, userProfile?.username]);

  // Load / Setup state on mounted
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sync rankings when custom videos are uploaded or published in CastingLiveSection
  useEffect(() => {
    const handleSyncRankings = () => {
      const cache = localStorage.getItem('coll_top_100_ranking');
      if (cache) {
        try {
          const parsed = JSON.parse(cache);
          if (parsed && Array.isArray(parsed.females) && Array.isArray(parsed.males)) {
            setTop100Rankings(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
      const rawModels = localStorage.getItem('coll_models');
      if (rawModels) {
        try {
          const parsedModels = JSON.parse(rawModels);
          if (Array.isArray(parsedModels)) {
            setModels(parsedModels);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    window.addEventListener('ranking_videos_updated', handleSyncRankings);
    return () => {
      window.removeEventListener('ranking_videos_updated', handleSyncRankings);
    };
  }, []);

  // Sync user profile, movements and wallet balance from external events (e.g. gifts and donations sent from ranking/cards/live)
  useEffect(() => {
    const handleProfileSync = () => {
      try {
        const rawUser = localStorage.getItem('coll_userProfile');
        if (rawUser) {
          const parsed = JSON.parse(rawUser);
          if (parsed && parsed.id) {
            setUserProfile(prev => ({
              ...(prev || parsed),
              ...parsed
            }));
          }
        }
        const rawMovements = localStorage.getItem('coll_movements');
        if (rawMovements) {
          const parsedMov = JSON.parse(rawMovements);
          if (Array.isArray(parsedMov)) {
            setMovements(parsedMov);
          }
        }
      } catch (e) {
        console.error("Error syncing profile & movements in App:", e);
      }
    };

    window.addEventListener('user-profile-updated', handleProfileSync);
    window.addEventListener('wallet-updated', handleProfileSync);
    window.addEventListener('movements-updated', handleProfileSync);
    window.addEventListener('storage', handleProfileSync);

    return () => {
      window.removeEventListener('user-profile-updated', handleProfileSync);
      window.removeEventListener('wallet-updated', handleProfileSync);
      window.removeEventListener('movements-updated', handleProfileSync);
      window.removeEventListener('storage', handleProfileSync);
    };
  }, []);

  // Save changes to localStorage helper
  const saveStateToLocalStorage = (
    nextModels: ModelProfile[],
    nextProfile: UserSessionProfile,
    nextProjects: ProjectData[],
    nextSessions: InvestmentSession[],
    nextMessages: ChatMessage[],
    nextMovements: FinancialMovement[],
    nextHistory = historyWonLog,
    nextFriends = friendsList,
    nextPatrocinados = patrocinadosList,
    nextFollowers = followersList,
    nextFollowing = followingList
  ) => {
    try {
      localStorage.setItem('coll_models', JSON.stringify(nextModels));
      localStorage.setItem('coll_userProfile', JSON.stringify(nextProfile));
      localStorage.setItem('coll_projects', JSON.stringify(nextProjects));
      localStorage.setItem('coll_sessions', JSON.stringify(nextSessions));
      localStorage.setItem('coll_messages', JSON.stringify(nextMessages));
      localStorage.setItem('coll_movements', JSON.stringify(nextMovements));
      localStorage.setItem('coll_historyLog', JSON.stringify(nextHistory));
      localStorage.setItem('coll_friends', JSON.stringify(nextFriends));
      localStorage.setItem('coll_patrocinados', JSON.stringify(nextPatrocinados));
      localStorage.setItem('coll_followers', JSON.stringify(nextFollowers));
      localStorage.setItem('coll_following', JSON.stringify(nextFollowing));
    } catch (e) {
      console.error('Failed to save to localStorage due to size limit or browser configuration:', e);
    }
  };

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem('coll_userProfile');
    setSelectedModelForExpandedView(null);
    setSelectedModelForView(null);
    setActiveTabTab('home');
    alert('🔒 Has cerrado sesión y has sido redirigido a la página de inicio.');
  };

  const handleActivateAccountFromWelcomeEmail = () => {
    if (!pendingWelcomeProfile) return;
    const profile = pendingWelcomeProfile;
    
    setUserProfile(profile);
    setEditAvatar(profile.avatar || '');
    setEditBio(profile.bio || '');
    setEditDireccion(profile.direccion || '');
    setEditTelefono(profile.telefono || '');
    setEditEmail(profile.email || '');
    setEditLastName(profile.lastName || '');
    setEditInstagram(profile.instagram || '');
    setEditTikTok(profile.tiktok || '');
    setEditShareDireccion(profile.shareDireccion !== false);
    setEditShareTelefono(profile.shareTelefono !== false);
    setEditShareEmail(profile.shareEmail !== false);
    
    if (pendingWelcomeModels) {
      setModels(pendingWelcomeModels);
    }
    if (pendingWelcomeProjects) {
      setProjects(pendingWelcomeProjects);
    }
    if (pendingWelcomeRankings) {
      setTop100Rankings(pendingWelcomeRankings);
      localStorage.setItem('coll_top_100_ranking', JSON.stringify(pendingWelcomeRankings));
    }
    
    saveStateToLocalStorage(
      pendingWelcomeModels || models,
      profile,
      pendingWelcomeProjects || [],
      sessions,
      messages,
      movements
    );

    setShowWelcomeEmailModal(false);
    setPendingWelcomeProfile(null);
    setPendingWelcomeModels(null);
    setPendingWelcomeProjects(null);
    
    setActiveTabTab('profile');
    alert(`🔑 ¡Acceso concedido! Bienvenido/a a Fashion Finances como ${profile.role === 'model' ? 'Modelo' : 'Inversor Estratégico'}.`);
  };

  const handleRequestPasswordByEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmailInput) {
      alert("Por favor, introduce tu correo electrónico.");
      return;
    }
    const cleanEmail = recoveryEmailInput.trim().toLowerCase();
    
    // Check if we can find a matching model or local cached user account
    let foundProfile = models.find(m => m.email && m.email.toLowerCase() === cleanEmail);
    let targetUsername = foundProfile ? foundProfile.username : '';
    
    if (!targetUsername) {
      const localCached = localStorage.getItem('coll_userProfile');
      if (localCached) {
        try {
          const parsed = JSON.parse(localCached);
          if (parsed && parsed.email && parsed.email.toLowerCase() === cleanEmail) {
            targetUsername = parsed.username;
          }
        } catch (err) {}
      }
    }
    
    if (!targetUsername) {
      // Pick a random username from models to simulate recovery
      const randomModel = models[Math.floor(Math.random() * models.length)];
      targetUsername = randomModel ? randomModel.username : 'sophialoren';
    }
    
    setRecoveredUsername(targetUsername);
    setRecoveredEmail(cleanEmail);
    setShowRecoveryEmailModal(true);
    setShowForgotPasswordView(false);
    setShowLoginModal(false);
    setRecoveryEmailInput('');
  };

  const handleLoginAsRecoveredUser = () => {
    if (!recoveredUsername) return;
    
    const cleanUsername = recoveredUsername.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    if (cleanUsername === 'ernesto' || cleanUsername === 'ernestovs') {
      switchDefaultPersona('investor');
      setLoginUsername('');
      setLoginPassword('');
      setShowRecoveryEmailModal(false);
      alert(`🔑 Sesión iniciada con éxito como @ernesto tras la recuperación de contraseña.`);
      return;
    }

    const foundModel = models.find(m => m.username.toLowerCase() === cleanUsername);
    if (foundModel) {
      const modelUser: UserSessionProfile = {
        id: foundModel.id,
        name: foundModel.name.split(' ')[0] || foundModel.name,
        lastName: foundModel.name.split(' ').slice(1).join(' ') || '',
        username: foundModel.username,
        role: 'model',
        patrocinadorId: 'model-1',
        balance: foundModel.referidosCount * 15.00,
        totalEarnings: foundModel.referidosCount * 15.00,
        totalInvested: 0,
        totalCommissions: foundModel.referidosCount * 15.00,
        avatar: foundModel.avatar,
        shareDireccion: true,
        shareTelefono: true,
        shareEmail: true,
        direccion: 'Calle de la Moda 123, Madrid',
        telefono: '+34 600 123 456',
        email: foundModel.email || `${foundModel.username}@fashionfinances.com`,
        instagram: foundModel.socials?.instagram || '',
        tiktok: foundModel.socials?.tiktok || '',
        bankInfoProvided: false,
        registeredAt: new Date().toISOString(),
        bio: foundModel.bio,
        verified: true
      };
      
      setUserProfile(modelUser);
      setEditAvatar(modelUser.avatar || '');
      setEditBio(modelUser.bio || '');
      setEditDireccion(modelUser.direccion || '');
      setEditTelefono(modelUser.telefono || '');
      setEditEmail(modelUser.email || '');
      setEditLastName(modelUser.lastName || '');
      setEditInstagram(modelUser.instagram || '');
      setEditTikTok(modelUser.tiktok || '');
      
      saveStateToLocalStorage(models, modelUser, projects, sessions, messages, movements);
      setActiveTabTab('profile');
      setShowRecoveryEmailModal(false);
      alert(`🔑 Sesión iniciada con éxito como @${foundModel.username} tras la recuperación de datos.`);
    } else {
      const fallbackProfile: UserSessionProfile = {
        id: generateNextUserId(),
        name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
        lastName: '',
        username: cleanUsername,
        role: 'investor',
        patrocinadorId: models[0]?.id || 'model-1',
        balance: 100.00,
        totalEarnings: 0,
        totalInvested: 0,
        totalCommissions: 0,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        shareDireccion: true,
        shareTelefono: true,
        shareEmail: true,
        direccion: 'Simulación Online',
        telefono: '+34 600 000 000',
        email: `${cleanUsername}@example.com`,
        instagram: `@${cleanUsername}_ig`,
        tiktok: `@${cleanUsername}_tok`,
        bankInfoProvided: false,
        registeredAt: new Date().toISOString(),
        bio: `Inversor registrado en la red Fashion Finances con usuario de simulación @${cleanUsername}.`,
        verified: true
      };

      setUserProfile(fallbackProfile);
      setEditAvatar(fallbackProfile.avatar || '');
      setEditBio(fallbackProfile.bio || '');
      setEditDireccion(fallbackProfile.direccion || '');
      setEditTelefono(fallbackProfile.telefono || '');
      setEditEmail(fallbackProfile.email || '');
      setEditLastName(fallbackProfile.lastName || '');
      setEditInstagram(fallbackProfile.instagram || '');
      setEditTikTok(fallbackProfile.tiktok || '');

      saveStateToLocalStorage(models, fallbackProfile, projects, sessions, messages, movements);
      setActiveTabTab('profile');
      setShowRecoveryEmailModal(false);
      alert(`🔑 Sesión iniciada con éxito como @${cleanUsername} tras la recuperación de datos.`);
    }
  };

  // --- Core State Mutators ---

  const handleUpdateSessions = (nextSessions: InvestmentSession[]) => {
    if (!userProfile) return;
    setSessions(nextSessions);
    saveStateToLocalStorage(models, userProfile, projects, nextSessions, messages, movements);
  };

  const handleUpdateProfile = (nextProfile: UserSessionProfile) => {
    setUserProfile(nextProfile);
    
    // If our profile username matches an existing Model, also synchronize model's profile info!
    let nextModels = models;
    if (nextProfile.role === 'model') {
      nextModels = models.map(m => {
        if (m.id === nextProfile.id) {
          return {
            ...m,
            name: nextProfile.name,
            username: nextProfile.username,
            avatar: nextProfile.avatar,
            banner: nextProfile.banner || m.banner,
            bio: nextProfile.bio || m.bio
          };
        }
        return m;
      });
      setModels(nextModels);
    }

    saveStateToLocalStorage(nextModels, nextProfile, projects, sessions, messages, movements);
  };

  const handleGiftTransaction = (giftCostInCoins: number, recipientName: string, recipientIdOrUsername: string) => {
    if (!userProfile) return;

    // Calculate Euro equivalent (1 Coin = 0.10€)
    const euroCost = Number((giftCostInCoins * 0.10).toFixed(2));

    // 1. Deduct cost from current user's profile balance (Euros) if they have enough balance, otherwise clamp
    let actualUserProfile = userProfile;
    if (userProfile.balance >= euroCost) {
      actualUserProfile = {
        ...userProfile,
        balance: Number((userProfile.balance - euroCost).toFixed(2)),
        totalInvested: Number((userProfile.totalInvested + euroCost).toFixed(2))
      };
    } else {
      const maxEuroCost = userProfile.balance;
      actualUserProfile = {
        ...userProfile,
        balance: 0,
        totalInvested: Number((userProfile.totalInvested + maxEuroCost).toFixed(2))
      };
    }
    setUserProfile(actualUserProfile);

    // 2. Increment the recipient's portfolio/earnings in patrocinadosList
    let nextPatrocinados = patrocinadosList.map(pat => {
      const isMatch = pat.id === recipientIdOrUsername || 
                      pat.username?.toLowerCase() === recipientIdOrUsername.toLowerCase() ||
                      pat.name?.toLowerCase() === recipientName.toLowerCase();
      if (isMatch) {
         return {
           ...pat,
           earningsGenerated: Number((pat.earningsGenerated + euroCost).toFixed(2))
         };
      }
      return pat;
    });

    const foundInPatrocinados = patrocinadosList.some(pat => 
      pat.id === recipientIdOrUsername || 
      pat.username?.toLowerCase() === recipientIdOrUsername.toLowerCase() ||
      pat.name?.toLowerCase() === recipientName.toLowerCase()
    );

    if (!foundInPatrocinados) {
      const matchedModel = models.find(m => 
        m.id === recipientIdOrUsername || 
        m.username?.toLowerCase() === recipientIdOrUsername.toLowerCase() ||
        m.name?.toLowerCase() === recipientName.toLowerCase()
      );
      if (matchedModel) {
        const newPat: Patrocinado = {
          id: `pat-${Date.now()}`,
          name: matchedModel.name,
          username: matchedModel.username,
          avatar: matchedModel.avatar,
          role: 'model',
          registeredAt: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
          earningsGenerated: euroCost,
          status: 'active'
        };
        nextPatrocinados = [newPat, ...nextPatrocinados];
      }
    }

    setPatrocinadosList(nextPatrocinados);

    // 3. Specifically if recipient matches Isabella Dubois
    if (
      recipientName.toLowerCase().includes('isabella') || 
      recipientIdOrUsername.toLowerCase().includes('isabella') || 
      recipientIdOrUsername.toLowerCase().includes('dubois')
    ) {
      const savedIsabella = localStorage.getItem('isabella_dubois_portfolio_finanzas');
      const currentVal = savedIsabella ? parseFloat(savedIsabella) : 58900.00;
      const nextVal = Number((currentVal + euroCost).toFixed(2));
      localStorage.setItem('isabella_dubois_portfolio_finanzas', nextVal.toString());
    }

    // 4. Save changes to localStorage immediately to persist state
    saveStateToLocalStorage(
      models, 
      actualUserProfile, 
      projects, 
      sessions, 
      messages, 
      movements, 
      historyWonLog, 
      friendsList, 
      nextPatrocinados
    );

    // Dispatch storage event to alert other listening hooks
    window.dispatchEvent(new Event('storage'));
  };

  const handleSaveProfileChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    if (!editLastName || !editInstagram || !editTikTok || !editDireccion || !editTelefono || !editEmail) {
      alert("Por favor, rellene todos los campos. Todos son obligatorios.");
      return;
    }
    
    const updatedProfile: UserSessionProfile = {
      ...userProfile,
      avatar: editAvatar || userProfile.avatar,
      banner: editBanner || userProfile.banner,
      lastName: editLastName,
      instagram: editInstagram,
      tiktok: editTikTok,
      bio: editBio,
      direccion: editDireccion,
      telefono: editTelefono,
      email: editEmail,
      shareDireccion: editShareDireccion,
      shareTelefono: editShareTelefono,
      shareEmail: editShareEmail
    };
    
    setUserProfile(updatedProfile);
    setIsEditingProfile(false);
    
    let nextModels = models;
    if (userProfile.role === 'model') {
      nextModels = models.map(m => {
        if (m.id === userProfile.id) {
          return {
            ...m,
            name: `${userProfile.name} ${editLastName}`.trim(),
            avatar: editAvatar || m.avatar,
            banner: editBanner || m.banner,
            bio: editBio || m.bio,
            socials: {
              ...m.socials,
              instagram: editInstagram,
              tiktok: editTikTok
            }
          };
        }
        return m;
      });
      setModels(nextModels);
    }
    
    saveStateToLocalStorage(nextModels, updatedProfile, projects, sessions, messages, movements);
    alert('✨ ¡Perfil actualizado con éxito!');
  };

  const handleGiftFriend = (friendId: string, name: string) => {
    if (!userProfile) return;
    if (userProfile.balance < 10) {
      alert('❌ Saldo insuficiente para enviar un regalo de €10.');
      return;
    }
    
    const updatedProfile: UserSessionProfile = {
      ...userProfile,
      balance: userProfile.balance - 10,
      totalInvested: userProfile.totalInvested + 10
    };
    setUserProfile(updatedProfile);
    
    const newMov: FinancialMovement = {
      id: `mov-gift-${Date.now()}`,
      userId: userProfile.id,
      type: 'withdrawal',
      amount: 10,
      date: new Date().toISOString(),
      description: `Regalo enviado a amigo: ${name}`
    };
    const nextMovements = [newMov, ...movements];
    setMovements(nextMovements);
    
    alert(`🎁 ¡Regalo de €10.00 enviado con éxito a ${name}! Se ha descontado de tu balance.`);
    
    saveStateToLocalStorage(models, updatedProfile, projects, sessions, messages, nextMovements);
  };

  const handleDeleteFriend = (friendId: string, name: string) => {
    const nextFriends = friendsList.filter(f => f.id !== friendId);
    setFriendsList(nextFriends);
    saveStateToLocalStorage(models, userProfile!, projects, sessions, messages, movements, historyWonLog, nextFriends);
    alert(`🗑️ Has eliminado a ${name} de tus amigos.`);
  };

  const handleCreateFriend = (model: ModelProfile) => {
    if (friendsList.some(f => f.username === model.username)) {
      alert('ℹ️ Este modelo ya es tu amigo.');
      return;
    }
    const newFriend = {
      id: `friend-${Date.now()}`,
      name: model.name,
      username: model.username,
      avatar: model.avatar,
      role: 'model',
      bio: model.bio || 'Modelo en Fashion Finances',
      online: Math.random() > 0.4,
      addedMe: false
    };
    const nextFriends = [...friendsList, newFriend];
    setFriendsList(nextFriends);
    saveStateToLocalStorage(models, userProfile!, projects, sessions, messages, movements, historyWonLog, nextFriends);
    alert(`🤝 ¡Has agregado a ${model.name} como amigo! El se añadirá a tu círculo de amigos.`);
  };

  const handleToggleFollow = (model: ModelProfile) => {
    const isFollowing = followingList.some(f => f.username === model.username);
    if (isFollowing) {
      const nextFollowing = followingList.filter(f => f.username !== model.username);
      setFollowingList(nextFollowing);
      saveStateToLocalStorage(models, userProfile!, projects, sessions, messages, movements, historyWonLog, friendsList, patrocinadosList, followersList, nextFollowing);
      alert(`❌ Has dejado de seguir a ${model.name}.`);
    } else {
      const newFollowing = {
        id: model.id,
        name: model.name,
        username: model.username,
        avatar: model.avatar,
        role: 'model',
        bio: model.bio || '',
        online: model.isOnline !== false
      };
      const nextFollowing = [...followingList, newFollowing];
      setFollowingList(nextFollowing);
      saveStateToLocalStorage(models, userProfile!, projects, sessions, messages, movements, historyWonLog, friendsList, patrocinadosList, followersList, nextFollowing);
      alert(`👀 ¡Ahora sigues a ${model.name}!`);
    }
  };

  const handleFollowFromFollowers = (follower: any) => {
    if (followingList.some(f => f.username === follower.username)) {
      alert(`ℹ️ Ya sigues a @${follower.username}`);
      return;
    }
    const newFollowing = {
      id: follower.id,
      name: follower.name,
      username: follower.username,
      avatar: follower.avatar,
      role: follower.role || 'model',
      bio: follower.bio || '',
      online: follower.online !== false
    };
    const nextFollowing = [...followingList, newFollowing];
    setFollowingList(nextFollowing);
    saveStateToLocalStorage(models, userProfile!, projects, sessions, messages, movements, historyWonLog, friendsList, patrocinadosList, followersList, nextFollowing);
    alert(`👀 ¡Ahora sigues a ${follower.name}! Se ha añadido a tu lista de Seguidos.`);
  };

  const handleUnfollow = (followedId: string, name: string) => {
    const nextFollowing = followingList.filter(f => f.id !== followedId);
    setFollowingList(nextFollowing);
    saveStateToLocalStorage(models, userProfile!, projects, sessions, messages, movements, historyWonLog, friendsList, patrocinadosList, followersList, nextFollowing);
    alert(`❌ Has dejado de seguir a ${name}.`);
  };

  const handleMessageFriend = (friendUsername: string) => {
    const foundModel = models.find(m => m.username === friendUsername);
    if (foundModel) {
      setActiveChatTargetId(foundModel.id);
      setActiveTabTab('chat');
      setShowFriendsModal(false);
    } else {
      alert(`💬 Abriendo chat con @${friendUsername}... (puedes enviar mensajes desde la sección de Chat)`);
      setActiveTabTab('chat');
      setShowFriendsModal(false);
    }
  };

  const handleUpdateModelsGlobal = (nextModels: ModelProfile[]) => {
    if (!userProfile) return;
    setModels(nextModels);
    saveStateToLocalStorage(nextModels, userProfile, projects, sessions, messages, movements);
  };

  const handleAddMovement = (newMov: FinancialMovement) => {
    if (!userProfile) return;
    const nextMovs = [newMov, ...movements];
    setMovements(nextMovs);
    saveStateToLocalStorage(models, userProfile, projects, sessions, messages, nextMovs);
  };

  const handleAddSystemHistory = (completedSess: InvestmentSession, won: boolean, totalPrize: number) => {
    if (!userProfile) return;
    let nextHistory = historyWonLog;
    if (won) {
      const userPart = completedSess.participants?.find(p => p.userId === userProfile.id || p.name === userProfile.name);
      const matchedProj = userPart?.projectId ? projects.find(pr => pr.id === userPart.projectId) : projects[0];
      nextHistory = [
        {
          id: completedSess.id,
          title: completedSess.title,
          prize: totalPrize,
          date: new Date().toISOString(),
          projectId: matchedProj?.id || 'proj-1',
          projectName: matchedProj?.title || 'Eco-Fashion Runway'
        },
        ...historyWonLog
      ];
      setHistoryWonLog(nextHistory);
    }
    saveStateToLocalStorage(models, userProfile, projects, sessions, messages, movements, nextHistory);
  };

  // 1-1 Chat Sender Engine
  const handleSendMessage = (newMsg: ChatMessage) => {
    if (!userProfile) return;
    if (userProfile.role === 'visitor') {
      alert('⚠️ No puedes enviar mensajes como visitante no registrado. Por favor, crea una cuenta o inicia sesión.');
      return;
    }
    setMessages((prevMsgs) => {
      const nextMsgs = [...prevMsgs, newMsg];
      saveStateToLocalStorage(models, userProfile, projects, sessions, nextMsgs, movements);
      return nextMsgs;
    });
  };

  // Like a Model photo - Increments overall totalLikes and shifts leaderboard
  const handleLikePhoto = (modelId: string, e?: React.MouseEvent) => {
    if (!userProfile) return;
    const nextModels = models.map((m) => {
      if (m.id === modelId) {
        return {
          ...m,
          totalLikes: m.totalLikes + 1,
          followersCount: m.followersCount + 1
        };
      }
      return m;
    });

    // Re-sort models by totalLikes descending to maintain live leaderboard correctness
    const sortedModels = nextModels.sort((a, b) => b.totalLikes - a.totalLikes);
    setModels(sortedModels);
    saveStateToLocalStorage(sortedModels, userProfile, projects, sessions, messages, movements);

    // Trigger visual heart rain effect!
    window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
      detail: { x: e?.clientX, y: e?.clientY }
    }));
  };

  // Choose / Change Sponsor written overlay
  const handleSelectSponsorDirect = (modelId: string) => {
    if (!userProfile) return;
    if (userProfile.role === 'visitor') {
      alert('⚠️ No puedes cambiar de patrocinador como visitante no registrado. Por favor, regístrate o inicia sesión.');
      return;
    }
    if (userProfile.id === modelId) {
      alert('No puedes auto-patrocinarte si eres el mismo modelo.');
      return;
    }

    // Decrement from old
    const prevSponsorId = userProfile.patrocinadorId;

    const nextModels = models.map((m) => {
      if (m.id === modelId) {
        return { ...m, referidosCount: m.referidosCount + 1 };
      }
      if (m.id === prevSponsorId) {
        return { ...m, referidosCount: Math.max(0, m.referidosCount - 1) };
      }
      return m;
    });

    const nextProfile = {
      ...userProfile,
      patrocinadorId: modelId
    };

    setUserProfile(nextProfile);
    setModels(nextModels);
    saveStateToLocalStorage(nextModels, nextProfile, projects, sessions, messages, movements);
    alert('🎉 ¡Patrocinador cambiado correctamente! Tu nuevo sponsor recibirá las ventajas por tu actividad comercial.');
  };

  // Sponsor modification request form callback
  const handleSponsorChangeRequested = (reason: string, targetSponsorId: string) => {
    handleSelectSponsorDirect(targetSponsorId);
  };

  const handlePatrocinateClickFromChat = (modelId: string) => {
    const matched = models.find(m => m.id === modelId);
    if (!matched) return;

    if (userProfile && userProfile.id && userProfile.role !== 'visitor') {
      if (userProfile.role === 'model') {
        alert('Eres una modelo. No puedes cambiar tu patrocinio.');
        return;
      }
      const confirmChange = window.confirm(`¿Quieres cambiar tu patrocinador oficial a ${matched.name}?`);
      if (confirmChange) {
        handleSelectSponsorDirect(modelId);
      }
    } else {
      setRegSponsorId(modelId);
      setSponsorSearchQuery(matched.name);
      setShowRegisterModal(true);
      alert(`Redirigiéndote al formulario de registro patrocinado por ${matched.name}. ¡Sponsor vinculado correctamente!`);
    }
  };

  // Add Project
  const handleAddProject = (newProject: ProjectData) => {
    if (!userProfile) return;
    if (userProfile.role === 'visitor') {
      alert('⚠️ No puedes registrar propuestas de proyecto como visitante no registrado. Por favor, crea una cuenta o inicia sesión.');
      return;
    }
    const nextProj = [newProject, ...projects];
    setProjects(nextProj);
    saveStateToLocalStorage(models, userProfile, nextProj, sessions, messages, movements);
  };

  const handleUpdateProjects = (nextProjects: ProjectData[]) => {
    setProjects(nextProjects);
    saveStateToLocalStorage(models, userProfile, nextProjects, sessions, messages, movements);
  };

  // Verify User identity toggler on profile/project section
  const handleVerifyUserToggle = () => {
    if (!userProfile) return;
    const nextProfile = {
      ...userProfile,
      verified: !userProfile.verified
    };
    setUserProfile(nextProfile);
    saveStateToLocalStorage(models, nextProfile, projects, sessions, messages, movements);
  };

  // Manage patrocinados helpers
  const handleAddPatrocinado = (newPat: Omit<Patrocinado, 'id'>) => {
    const freshPat: Patrocinado = {
      ...newPat,
      id: 'pat-' + Date.now()
    };
    const nextPatrocinados = [freshPat, ...patrocinadosList];
    setPatrocinadosList(nextPatrocinados);
    saveStateToLocalStorage(models, userProfile!, projects, sessions, messages, movements, historyWonLog, friendsList, nextPatrocinados);
  };

  const handleDeletePatrocinado = (id: string) => {
    const nextPatrocinados = patrocinadosList.filter(p => p.id !== id);
    setPatrocinadosList(nextPatrocinados);
    saveStateToLocalStorage(models, userProfile!, projects, sessions, messages, movements, historyWonLog, friendsList, nextPatrocinados);
  };

  // Helper deposit funds simulator
  const handleAddFundsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    const parsed = parseFloat(addFundsAmount);
    if (isNaN(parsed) || parsed <= 0) return;

    const nextProfile = {
      ...userProfile,
      balance: userProfile.balance + parsed
    };

    setUserProfile(nextProfile);
    
    handleAddMovement({
      id: `mov-dep-${Date.now()}`,
      userId: userProfile.id,
      type: 'deposit',
      amount: parsed,
      date: new Date().toISOString(),
      description: `📥 Fondos agregados mediante Backoffice simulado`
    });

    setShowAddFundsModal(false);
    setAddFundsAmount('50');
  };

  // Switching profiles to allow testing Investor, Model, or Visitor dashboards!
  const switchDefaultPersona = (role: 'investor' | 'model' | 'visitor') => {
    setSelectedModelForExpandedView(null);
    setSelectedModelForView(null);
    if (role === 'investor') {
      // Re-trigger standard Ernesto investor state
      const seed = seedInitialData();
      setUserProfile(seed.userProfile);
      setModels(seed.models);
      setProjects(seed.projects);
      setSessions(seed.sessions);
      setMessages(seed.messages);
      setMovements(seed.movements);
      
      setEditAvatar(seed.userProfile.avatar || '');
      setEditBio(seed.userProfile.bio || '');
      setEditDireccion(seed.userProfile.direccion || '');
      setEditTelefono(seed.userProfile.telefono || '');
      setEditEmail(seed.userProfile.email || '');
      setEditShareDireccion(seed.userProfile.shareDireccion !== false);
      setEditShareTelefono(seed.userProfile.shareTelefono !== false);
      setEditShareEmail(seed.userProfile.shareEmail !== false);

      saveStateToLocalStorage(seed.models, seed.userProfile, seed.projects, seed.sessions, seed.messages, seed.movements);
      setActiveTabTab('profile');
      alert('Iniciada la cuenta de Ernesto vs (Inversor). Tienes 100€ de saldo para unirte a mesas de inversión y subir proyectos.');
    } else if (role === 'visitor') {
      // Create a guest / unregistered visitor profile that can browse everything without a registered account
      const visitorUser: UserSessionProfile = {
        id: 'user-visitor',
        name: 'Cliente Invitado (No Registrado)',
        username: 'anonymous_visitor',
        role: 'visitor',
        patrocinadorId: '', // No official sponsor yet
        balance: 0.00,
        totalEarnings: 0,
        totalInvested: 0,
        totalCommissions: 0,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        shareDireccion: false,
        shareTelefono: false,
        shareEmail: false,
        verified: false,
        bankInfoProvided: false,
        registeredAt: '2026-06-02'
      };

      setUserProfile(visitorUser);
      setEditAvatar(visitorUser.avatar);
      setEditBio('Navegando de forma anónima');
      setEditDireccion('');
      setEditTelefono('');
      setEditEmail('');
      setEditShareDireccion(false);
      setEditShareTelefono(false);
      setEditShareEmail(false);

      saveStateToLocalStorage(models, visitorUser, projects, sessions, messages, movements);
      setActiveTabTab('home');
      alert('⚠️ Navegando como Visitante No Registrado. Puedes ver el ranking de modelos, las campañas de financiación y los vídeos en Casting Live, pero necesitarás registrarte para chatear, patrocinar o invertir.');
    } else {
      // Login as Model #1 (Adriana Lima)
      const targetModel = models.find(m => m.id === 'topf-1' || m.id === 'model-1') || models[0];
      const modelUser: UserSessionProfile = {
        id: targetModel.id,
        name: targetModel.name,
        username: targetModel.username,
        role: 'model',
        patrocinadorId: 'topm-1', // Top male model sponsors her!
        balance: 45.50,
        totalEarnings: 0,
        totalInvested: 0,
        totalCommissions: 120.00,
        avatar: targetModel.avatar,
        shareDireccion: true,
        shareTelefono: true,
        shareEmail: true,
        verified: true,
        bankInfoProvided: true,
        registeredAt: '2026-05-20',
        gender: (targetModel as any).gender || 'female'
      };
      
      setUserProfile(modelUser);
      setEditAvatar(modelUser.avatar || '');
      setEditBio(modelUser.bio || '');
      setEditDireccion(modelUser.direccion || '');
      setEditTelefono(modelUser.telefono || '');
      setEditEmail(modelUser.email || '');
      setEditShareDireccion(modelUser.shareDireccion !== false);
      setEditShareTelefono(modelUser.shareTelefono !== false);
      setEditShareEmail(modelUser.shareEmail !== false);

      saveStateToLocalStorage(models, modelUser, projects, sessions, messages, movements);
      setActiveTabTab('profile');
      alert(`Sesión iniciada como ${targetModel.name} (Modelo #1). Accede a tu Perfil para subir fotos al feed o al Chat para comunicarte con tus patrocinados.`);
    }
  };

  // Switch context directly to the clicked model profile
  const handleSwitchToModelProfile = (model: ModelProfile) => {
    const matched = models.find(m => m.id === model.id) || 
                    models.find(m => m.username === model.username) || 
                    model;
    
    setSelectedModelForView(matched);
    setActiveTabTab('home');
  };

  // Handle click on model cards on BOTH ranking pages
  const handleRankingModelClick = (model: any) => {
    // Find the actual model in the models array
    const matched = models.find(m => m.id === model.id) || 
                    models.find(m => m.name === model.name) || 
                    models.find(m => m.username === model.username) || 
                    model;

    // Redirect to their user profile by setting selectedModelForView and switching tab to 'home'
    setSelectedModelForView(matched);
    setActiveTabTab('home');
  };

  // Submition register account trigger
  const handleRegisterNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regLastName || !regUsername || !regInstagram || !regTikTok || !regDireccion || !regCiudad || !regPassword || !regCodigoPostal || !regPais || !regTelefono || !regEmail) {
      alert("Por favor, rellene todos los campos. Todos son obligatorios (incluyendo Ciudad, Contraseña, Código Postal y País).");
      return;
    }

    // Gmail Security Check: Ensure only valid Gmail architecture and ending with @gmail.com or @gmail is permitted
    const emailClean = regEmail.trim().toLowerCase();
    
    // Check if domain is gmail.com or gmail
    const endsWithGmail = emailClean.endsWith('@gmail.com') || emailClean.endsWith('@gmail');
    
    // Check characters: Gmail usernames only allow lowercase/uppercase alphanumeric chars (a-z, 0-9), periods (.), and can have '+'
    // Let's validate the username part of the Gmail address
    const emailParts = emailClean.split('@');
    const emailUser = emailParts[0];
    const isGmailUserValid = /^[a-z0-9.+]+$/.test(emailUser);

    if (!endsWithGmail) {
      alert("Error de seguridad: Solamente se permiten correos electrónicos con la extensión oficial de @gmail (ej. usuario@gmail.com o usuario@gmail).");
      return;
    }

    if (!isGmailUserValid) {
      alert("Error de seguridad: El nombre del correo electrónico contiene caracteres no válidos para la arquitectura de Gmail. Solo se permiten letras (a-z), números (0-9), puntos (.) y signos más (+).");
      return;
    }

    const chosenSponsorId = regSponsorId || models[0]?.id || 'model-1';

    const newId = generateNextUserId();
    const newProfile: UserSessionProfile = {
      id: newId,
      name: regName,
      lastName: regLastName,
      username: regUsername.toLowerCase().replace(/[^a-z]/g, ''),
      role: regRole,
      patrocinadorId: chosenSponsorId,
      balance: regRole === 'investor' ? 100.00 : 0.00, // Seed 100€ key to allow instant investment joins!
      totalEarnings: 0,
      totalInvested: 0,
      totalCommissions: 0,
      avatar: regRole === 'model' 
        ? (regGender === 'male' ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200')
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      direccion: regDireccion,
      ciudad: regCiudad,
      contrasena: regPassword,
      codigoPostal: regCodigoPostal,
      pais: regPais,
      telefono: regTelefono,
      email: regEmail,
      instagram: regInstagram,
      tiktok: regTikTok,
      shareDireccion: true,
      shareTelefono: true,
      shareEmail: true,
      verified: true,
      bankInfoProvided: false,
      registeredAt: new Date().toISOString(),
      gender: regRole === 'model' ? regGender : undefined
    };

    // If new model is created, append them to models array to let them compete!
    let nextModels = models;
    let nextRankings = { ...top100Rankings };

    if (regRole === 'model') {
      const freshModel: ModelProfile = {
        id: newId,
        name: `${regName} ${regLastName}`,
        username: regUsername.toLowerCase(),
        avatar: regGender === 'male' 
          ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
        bio: 'Nuevo/a modelo en Fashion Finances. ¡Sponsor de afiliación estratégico disponible!',
        totalLikes: 10,
        followersCount: 5,
        photos: [
          regGender === 'male' 
            ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600'
        ],
        referidosCount: 0,
        socials: { 
          instagram: regInstagram.startsWith('@') ? regInstagram : `@${regInstagram}`,
          tiktok: regTikTok.startsWith('@') ? regTikTok : `@${regTikTok}`,
          instagramFollowers: 750,
          tiktokFollowers: 1250
        },
        gender: regGender
      };
      nextModels = [...models, freshModel].sort((a,b) => b.totalLikes - a.totalLikes);

      // Create a RankingModel variant
      const freshRankingModel: RankingModel = {
        ...freshModel,
        gender: regGender,
        statusText: 'Activo'
      };

      if (regGender === 'male') {
        nextRankings.males = [freshRankingModel, ...nextRankings.males].sort((a,b) => b.totalLikes - a.totalLikes);
      } else {
        nextRankings.females = [freshRankingModel, ...nextRankings.females].sort((a,b) => b.totalLikes - a.totalLikes);
      }
    }

    // Update old sponsor's referidosCount state
    nextModels = nextModels.map(m => {
      if (m.id === chosenSponsorId) {
        return { ...m, referidosCount: m.referidosCount + 1 };
      }
      return m;
    });

    const nextProjects: ProjectData[] = [];

    // Store into pending states to show the welcome email with magic access button
    setPendingWelcomeProfile(newProfile);
    setPendingWelcomeModels(nextModels);
    setPendingWelcomeProjects(nextProjects);
    setPendingWelcomeRankings(nextRankings);

    setRegName('');
    setRegLastName('');
    setRegUsername('');
    setRegInstagram('');
    setRegTikTok('');
    setRegSponsorId('');
    setRegGender('female');
    setRegDireccion('');
    setRegCiudad('');
    setRegPassword('');
    setRegCodigoPostal('');
    setRegPais('');
    setRegTelefono('');
    setRegEmail('');

    setShowRegisterModal(false);
    setShowWelcomeEmailModal(true);
    
    alert(`📥 ¡Enhorabuena! Tu cuenta ha sido gestionada. Acabas de recibir tu correo electrónico de bienvenida en la plataforma con el enlace de acceso logueado.`);
  };

  // Login handler submitting username search or simulation login profile builder
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername) return;
    const cleanUsername = loginUsername.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    // Check default Ernesto investor
    if (cleanUsername === 'ernesto' || cleanUsername === 'ernestovs') {
      switchDefaultPersona('investor');
      setShowLoginModal(false);
      setLoginUsername('');
      setLoginPassword('');
      return;
    }

    // Check models list
    const foundModel = models.find(m => m.username.toLowerCase() === cleanUsername);
    if (foundModel) {
      const modelUser: UserSessionProfile = {
        id: foundModel.id,
        name: foundModel.name,
        username: foundModel.username,
        role: 'model',
        patrocinadorId: 'model-2',
        balance: 45.50,
        totalEarnings: 0,
        totalInvested: 0,
        totalCommissions: 120.00,
        avatar: foundModel.avatar,
        shareDireccion: true,
        shareTelefono: true,
        shareEmail: true,
        verified: true,
        bankInfoProvided: true,
        registeredAt: '2026-05-20',
        bio: foundModel.bio || ''
      };
      
      setUserProfile(modelUser);
      setEditAvatar(modelUser.avatar || '');
      setEditBio(modelUser.bio || '');
      setEditDireccion(modelUser.direccion || '');
      setEditTelefono(modelUser.telefono || '');
      setEditEmail(modelUser.email || '');
      setEditShareDireccion(modelUser.shareDireccion !== false);
      setEditShareTelefono(modelUser.shareTelefono !== false);
      setEditShareEmail(modelUser.shareEmail !== false);
      saveStateToLocalStorage(models, modelUser, projects, sessions, messages, movements);
      setActiveTabTab('profile');
      setShowLoginModal(false);
      setLoginUsername('');
      setLoginPassword('');
      alert(`🔑 Sesión iniciada con éxito como @${foundModel.username} (${foundModel.name})`);
      return;
    }

    // Otherwise create/simulate a customized Investor profile with this custom username
    const fallbackProfile: UserSessionProfile = {
      id: generateNextUserId(),
      name: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
      username: cleanUsername,
      role: 'investor',
      patrocinadorId: models[0]?.id || 'model-1',
      balance: 100.00,
      totalEarnings: 0,
      totalInvested: 0,
      totalCommissions: 0,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      shareDireccion: true,
      shareTelefono: true,
      shareEmail: true,
      verified: true,
      bankInfoProvided: false,
      registeredAt: new Date().toISOString(),
      bio: `Inversor registrado en la red Fashion Finances con usuario de simulación @${cleanUsername}.`
    };

    setUserProfile(fallbackProfile);
    setEditAvatar(fallbackProfile.avatar || '');
    setEditBio(fallbackProfile.bio || '');
    setEditDireccion(fallbackProfile.direccion || '');
    setEditTelefono(fallbackProfile.telefono || '');
    setEditEmail(fallbackProfile.email || '');
    setEditShareDireccion(fallbackProfile.shareDireccion !== false);
    setEditShareTelefono(fallbackProfile.shareTelefono !== false);
    setEditShareEmail(fallbackProfile.shareEmail !== false);
    saveStateToLocalStorage(models, fallbackProfile, projects, sessions, messages, movements);
    setActiveTabTab('profile');
    setShowLoginModal(false);
    setLoginUsername('');
    setLoginPassword('');
    alert(`🔑 Sesión iniciada con éxito como Inversor nuevo bajo el usuario @${cleanUsername}`);
  };

  const handleUploadPhotoModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || userProfile.role !== 'model' || !newModelPhotoURL) return;

    const nextModels = models.map((m) => {
      if (m.id === userProfile.id) {
        return {
          ...m,
          photos: [newModelPhotoURL, ...m.photos],
          totalLikes: m.totalLikes + 10 // Give bonus likes for uploading new content!
        };
      }
      return m;
    });

    setModels(nextModels);
    saveStateToLocalStorage(nextModels, userProfile, projects, sessions, messages, movements);
    setNewModelPhotoURL('');
    alert('📸 ¡Fotografía publicada en el muro nacional! Tu exposición ha aumentado y ganaste 10 likes adicionales en el ranking.');
  };

  const handleLaunchChatWithModel = (modelId: string, draftImg?: string) => {
    setPreviousTab(activeTab);
    setLastProfileTab(activeTab === 'home' || activeTab === 'profile' ? activeTab as 'home' | 'profile' : (userProfile?.role === 'model' ? 'home' : 'profile'));
    setActiveChatTargetId(modelId);
    setActiveTabTab('chat');
    if (draftImg) {
      setSharedDraftImage(draftImg);
    }
  };

  const handleLikeRankingModel = (id: string, gender: 'female' | 'male') => {
    setTop100Rankings(prev => {
      const updated = { ...prev };
      if (gender === 'female') {
        updated.females = updated.females.map(m => {
          if (m.id === id) {
            return { ...m, totalLikes: m.totalLikes + 1 };
          }
          return m;
        });
      } else {
        updated.males = updated.males.map(m => {
          if (m.id === id) {
            return { ...m, totalLikes: m.totalLikes + 1 };
          }
          return m;
        });
      }
      localStorage.setItem('coll_top_100_ranking', JSON.stringify(updated));
      return updated;
    });
  };

  // Check if initialization has finished
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center space-y-2">
          <Clock className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <p className="text-sm font-mono tracking-widest text-slate-400">CARGANDO COLECTIVOS...</p>
        </div>
      </div>
    );
  }

  // If fully loaded but session is empty/cleared (Logged out)
  if (!userProfile) {
    const combinedRankedModels = [
      ...top100Rankings.females,
      ...top100Rankings.males
    ]
    .sort((a, b) => b.totalLikes - a.totalLikes)
    .slice(0, 100);

    const landingPageFemales = combinedRankedModels.filter(m => m.gender === 'female');
    const landingPageMales = combinedRankedModels.filter(m => m.gender === 'male');

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between w-full max-w-full overflow-x-hidden overflow-y-auto">
        <LandingPage
          models={models}
          topFemales={landingPageFemales}
          topMales={landingPageMales}
          onSwitchPersona={switchDefaultPersona}
          onLoginClick={() => setShowLoginModal(true)}
          onRegisterClick={() => setShowRegisterModal(true)}
          onModelClick={(model) => setSelectedModelForExpandedView(model)}
        />

        {/* Render register modal if requested inside landing page */}
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 animate-fade-in overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 sm:p-8 text-slate-900 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh] my-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold font-display text-slate-950 flex items-center gap-2">
                    <UserPlus2 className="w-5 h-5 text-indigo-650" />
                    <span>Crear Cuenta en Fashion Finances</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Regístrate eligiendo a uno de los 50 modelos del ranking o a tu patrocinador personal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1 rounded-lg transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleRegisterNewAccount} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nombre *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carmen"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Alvarez"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nombre de Usuario (Username) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. carmenval"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Instagram (@usuario) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. @carmen_diseno"
                    value={regInstagram}
                    onChange={(e) => setRegInstagram(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tik Tok (@usuario) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. @carmen_tok"
                    value={regTikTok}
                    onChange={(e) => setRegTikTok(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Dirección *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Calle Gran Vía 45, Madrid"
                    value={regDireccion}
                    onChange={(e) => setRegDireccion(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Ciudad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Madrid"
                    value={regCiudad}
                    onChange={(e) => setRegCiudad(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Código Postal *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 28013"
                    value={regCodigoPostal}
                    onChange={(e) => setRegCodigoPostal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">País *</label>
                  <select
                    required
                    value={regPais}
                    onChange={(e) => setRegPais(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-950 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                  >
                    <option value="">-- Selecciona tu País --</option>
                    <option value="España">España</option>
                    <option value="México">México</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Chile">Chile</option>
                    <option value="Perú">Perú</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Panamá">Panamá</option>
                    <option value="República Dominicana">República Dominicana</option>
                    <option value="Estados Unidos">Estados Unidos</option>
                    <option value="Abjasia">Abjasia</option>
                    <option value="Afganistán">Afganistán</option>
                    <option value="Albania">Albania</option>
                    <option value="Alemania">Alemania</option>
                    <option value="Andorra">Andorra</option>
                    <option value="Angola">Angola</option>
                    <option value="Antigua y Barbuda">Antigua y Barbuda</option>
                    <option value="Arabia Saudita">Arabia Saudita</option>
                    <option value="Argelia">Argelia</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaiyán">Azerbaiyán</option>
                    <option value="Bahamas">Bahamas</option>
                    <option value="Bangladés">Bangladés</option>
                    <option value="Barbados">Barbados</option>
                    <option value="Baréin">Baréin</option>
                    <option value="Bélgica">Bélgica</option>
                    <option value="Belice">Belice</option>
                    <option value="Benín">Benín</option>
                    <option value="Bielorrusia">Bielorrusia</option>
                    <option value="Birmania / Myanmar">Birmania / Myanmar</option>
                    <option value="Bosnia y Herzegovina">Bosnia y Herzegovina</option>
                    <option value="Botsuana">Botsuana</option>
                    <option value="Brasil">Brasil</option>
                    <option value="Brunéi">Brunéi</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Burundi">Burundi</option>
                    <option value="Bután">Bután</option>
                    <option value="Cabo Verde">Cabo Verde</option>
                    <option value="Camboya">Camboya</option>
                    <option value="Camerún">Camerún</option>
                    <option value="Canadá">Canadá</option>
                    <option value="Catar">Catar</option>
                    <option value="República Centroafricana">República Centroafricana</option>
                    <option value="Chad">Chad</option>
                    <option value="China">China</option>
                    <option value="Chipre">Chipre</option>
                    <option value="Corea del Norte">Corea del Norte</option>
                    <option value="Corea del Sur">Corea del Sur</option>
                    <option value="Costa de Marfil">Costa de Marfil</option>
                    <option value="Croacia">Croacia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Dinamarca">Dinamarca</option>
                    <option value="Dominica">Dominica</option>
                    <option value="Egipto">Egipto</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Emiratos Árabes Unidos">Emiratos Árabes Unidos</option>
                    <option value="Eritrea">Eritrea</option>
                    <option value="Eslovaquia">Eslovaquia</option>
                    <option value="Eslovenia">Eslovenia</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Etiopía">Etiopía</option>
                    <option value="Filipinas">Filipinas</option>
                    <option value="Finlandia">Finlandia</option>
                    <option value="Fiyi">Fiyi</option>
                    <option value="Francia">Francia</option>
                    <option value="Gabón">Gabón</option>
                    <option value="Gambia">Gambia</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Granada">Granada</option>
                    <option value="Grecia">Grecia</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Guinea">Guinea</option>
                    <option value="Guinea-Bisáu">Guinea-Bisáu</option>
                    <option value="Guinea Ecuatorial">Guinea Ecuatorial</option>
                    <option value="Guyana">Guyana</option>
                    <option value="Haití">Haití</option>
                    <option value="Honduras">Honduras</option>
                    <option value="Hungría">Hungría</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Irak">Irak</option>
                    <option value="Irán">Irán</option>
                    <option value="Irlanda">Irlanda</option>
                    <option value="Islandia">Islandia</option>
                    <option value="Israel">Israel</option>
                    <option value="Italia">Italia</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Japón">Japón</option>
                    <option value="Jordania">Jordania</option>
                    <option value="Kazajistán">Kazajistán</option>
                    <option value="Kenia">Kenia</option>
                    <option value="Kirguistán">Kirguistán</option>
                    <option value="Kiribati">Kiribati</option>
                    <option value="Kosovo">Kosovo</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Laos">Laos</option>
                    <option value="Lesoto">Lesoto</option>
                    <option value="Letonia">Letonia</option>
                    <option value="Líbano">Líbano</option>
                    <option value="Liberia">Liberia</option>
                    <option value="Libia">Libia</option>
                    <option value="Liechtenstein">Liechtenstein</option>
                    <option value="Lituania">Lituania</option>
                    <option value="Luxemburgo">Luxemburgo</option>
                    <option value="Macedonia del Norte">Macedonia del Norte</option>
                    <option value="Madagascar">Madagascar</option>
                    <option value="Malasia">Malasia</option>
                    <option value="Malaui">Malaui</option>
                    <option value="Maldivas">Maldivas</option>
                    <option value="Malí">Malí</option>
                    <option value="Malta">Malta</option>
                    <option value="Marruecos">Marruecos</option>
                    <option value="Mauricio">Mauricio</option>
                    <option value="Mauritania">Mauritania</option>
                    <option value="Micronesia">Micronesia</option>
                    <option value="Moldavia">Moldavia</option>
                    <option value="Mónaco">Mónaco</option>
                    <option value="Mongolia">Mongolia</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Nauru">Nauru</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Níger">Níger</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Noruega">Noruega</option>
                    <option value="Nueva Zelanda">Nueva Zelanda</option>
                    <option value="Omán">Omán</option>
                    <option value="Países Bajos">Países Bajos</option>
                    <option value="Pakistán">Pakistán</option>
                    <option value="Palaos">Palaos</option>
                    <option value="Palestina">Palestina</option>
                    <option value="Papúa Nueva Guinea">Papúa Nueva Guinea</option>
                    <option value="Polonia">Polonia</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Reino Unido">Reino Unido</option>
                    <option value="Ruanda">Ruanda</option>
                    <option value="Rumania">Rumania</option>
                    <option value="Rusia">Rusia</option>
                    <option value="Samoa">Samoa</option>
                    <option value="San Cristóbal y Nieves">San Cristóbal y Nieves</option>
                    <option value="San Marino">San Marino</option>
                    <option value="Santa Lucía">Santa Lucía</option>
                    <option value="Santo Tomé y Príncipe">Santo Tomé y Príncipe</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Seychelles">Seychelles</option>
                    <option value="Sierra Leona">Sierra Leona</option>
                    <option value="Singapur">Singapur</option>
                    <option value="Siria">Siria</option>
                    <option value="Somalia">Somalia</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Suazilandia">Suazilandia</option>
                    <option value="Sudáfrica">Sudáfrica</option>
                    <option value="Sudán">Sudán</option>
                    <option value="Sudán del Sur">Sudán del Sur</option>
                    <option value="Suecia">Suecia</option>
                    <option value="Suiza">Suiza</option>
                    <option value="Surinam">Surinam</option>
                    <option value="Tailandia">Tailandia</option>
                    <option value="Taiwán">Taiwán</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Tayikistán">Tayikistán</option>
                    <option value="Timor Oriental">Timor Oriental</option>
                    <option value="Togo">Togo</option>
                    <option value="Tonga">Tonga</option>
                    <option value="Trinidad y Tobago">Trinidad y Tobago</option>
                    <option value="Túnez">Túnez</option>
                    <option value="Turkmenistán">Turkmenistán</option>
                    <option value="Turquía">Turquía</option>
                    <option value="Tuvalu">Tuvalu</option>
                    <option value="Ucrania">Ucrania</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Uzbekistán">Uzbekistán</option>
                    <option value="Vanuatu">Vanuatu</option>
                    <option value="Ciudad del Vaticano">Ciudad del Vaticano</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Yibuti">Yibuti</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabue">Zimbabue</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. +34 612 345 678"
                    value={regTelefono}
                    onChange={(e) => setRegTelefono(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Correo Electrónico (Email) *</label>
                  <input
                    type="email"
                    required
                    placeholder="Ej. usuario@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                  />
                  <p className="text-[10px] text-indigo-700 mt-1 font-semibold leading-relaxed">
                    🎯 Medida de seguridad: Solo cuentas de la arquitectura de Gmail (letras, números, puntos, signo más y extensión @gmail.com o @gmail)
                  </p>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contraseña *</label>
                  <input
                    type="password"
                    required
                    placeholder="Crea una contraseña segura"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Elige Rol Principal *</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setRegRole('investor')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                        regRole === 'investor'
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Registro de Inversor
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('model')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                        regRole === 'model'
                          ? 'bg-pink-600 border-pink-600 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Soy Modelo
                    </button>
                  </div>
                </div>

                {regRole === 'model' && (
                  <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 space-y-2 animate-fade-in">
                    <label className="block text-pink-950 font-bold">Selecciona tu Género *</label>
                    <p className="text-[10px] text-pink-700/80">Selecciona si eres modelo masculino o femenino para asignarte al ranking correspondiente.</p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setRegGender('female')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                          regGender === 'female'
                            ? 'bg-pink-600 border-pink-600 text-white shadow-md shadow-pink-200'
                            : 'bg-white border-pink-200 text-pink-700 hover:bg-pink-50'
                        }`}
                      >
                        👩 Mujer / Femenino
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegGender('male')}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                          regGender === 'male'
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                            : 'bg-white border-indigo-100 text-indigo-700 hover:bg-indigo-50'
                        }`}
                      >
                        👨 Hombre / Masculino
                      </button>
                    </div>
                  </div>
                )}

                {/* Obligatory sponsor choice for new registrations with direct Sponsor ID selection */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <div className="space-y-1">
                    <label className="block text-slate-800 font-semibold">Patrocinador (Sponsor) *</label>
                    <p className="text-[10px] text-slate-500">Elige un patrocinador de la lista o introduce directamente su ID único de afiliación para vincularte.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-[9px] text-slate-500 font-mono block mb-1">Opción A: Elige un Patrocinador del Ranking</span>
                      
                      {/* Buscador de Patrocinadores */}
                      <div className="relative mb-2">
                        <input
                          type="text"
                          placeholder="🔍 Escribe para buscar patrocinador..."
                          value={sponsorSearchQuery}
                          onChange={(e) => setSponsorSearchQuery(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 font-sans"
                        />
                        {sponsorSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setSponsorSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer bg-transparent border-0"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      <select
                        value={regSponsorId}
                        onChange={(e) => setRegSponsorId(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs focus:outline-none focus:border-indigo-550"
                        id="reg-sponsor-select-dropdown"
                      >
                        <option value="">-- Elige un Patrocinador --</option>
                        {models
                          .filter((model) => {
                            const query = sponsorSearchQuery.trim().toLowerCase();
                            if (!query) return true;
                            return (
                              model.name.toLowerCase().includes(query) ||
                              model.id.toLowerCase().includes(query) ||
                              (model.username && model.username.toLowerCase().includes(query))
                            );
                          })
                          .map((model) => (
                            <option key={model.id} value={model.id}>
                              {model.name} (ID: {model.id} - {model.totalLikes} Likes)
                            </option>
                          ))}
                      </select>
                      {sponsorSearchQuery && (
                        <p className="text-[10px] text-indigo-700 mt-1 font-sans">
                          Filtrados {
                            models.filter((m) => {
                              const query = sponsorSearchQuery.trim().toLowerCase();
                              return (
                                m.name.toLowerCase().includes(query) ||
                                m.id.toLowerCase().includes(query) ||
                                (m.username && m.username.toLowerCase().includes(query))
                              );
                            }).length
                          } de {models.length} patrocinadores
                        </p>
                      )}
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-500 font-mono block mb-1">Opción B: Introduce el ID de tu Sponsor</span>
                      <input
                        type="text"
                        required
                        placeholder="Introduce el ID de tu sponsor (ej: model-1)"
                        value={regSponsorId}
                        onChange={(e) => setRegSponsorId(e.target.value.trim())}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-850 placeholder:text-slate-400 focus:outline-none focus:border-indigo-505 font-mono text-xs"
                        id="reg-sponsor-id-direct-input"
                      />
                    </div>

                    {/* Dynamic Verification of typed ID */}
                    {regSponsorId ? (() => {
                      const matchedModel = models.find(m => m.id.toLowerCase() === regSponsorId.toLowerCase().trim());
                      if (matchedModel) {
                        return (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] animate-fade-in">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>¡Sponsor Válido! <strong>{matchedModel.name}</strong></span>
                            {matchedModel.avatar && (
                              <div className="relative ml-auto shrink-0 mr-1">
                                <img
                                  src={matchedModel.avatar}
                                  alt={matchedModel.name}
                                  referrerPolicy="no-referrer"
                                  className="w-7 h-7 rounded-full object-cover border border-emerald-250/60"
                                />
                                <button
                                  type="button"
                                  onClick={() => setRegSponsorId('')}
                                  className="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] font-black border border-white cursor-pointer select-none shadow-xs transition-colors"
                                  title="Eliminar patrocinador"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 border border-red-100 text-red-700 text-[11px] font-mono animate-fade-in">
                            <span className="text-red-600">❌</span>
                            <span>ID de Sponsor no registrado (escribe ej. topm-8, topf-1, o un ID numérico de 11 dígitos como 00000000001)</span>
                          </div>
                        );
                      }
                    })() : null}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal font-sans">Vínculo verificado de forma segura. En Fashion Finances todos los usuarios se registran bajo un referidor calificado.</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer text-center"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition cursor-pointer text-center"
                  >
                    Registrarse
                  </button>
                </div>
                <div className="text-center pt-2 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500">
                    ¿Ya tienes una cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setShowRegisterModal(false);
                        setShowLoginModal(true);
                      }}
                      className="text-indigo-600 font-bold hover:underline cursor-pointer bg-transparent border-0 p-0 inline font-sans"
                    >
                      Inicia sesión directamente
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 🔑 Choose / Search Simulation Username Login Modal for Guest Users */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 animate-fade-in overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 sm:p-8 text-slate-900 space-y-5 shadow-2xl transition-all duration-300">
              {showForgotPasswordView ? (
                <>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 text-left">
                      <h3 className="text-base font-bold font-display text-slate-950 flex items-center gap-2">
                        <span className="p-1 px-2 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-sm">🔑</span>
                        <span>Recuperar Contraseña</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Te enviaremos tus datos de acceso al instante por correo electrónico de simulación.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPasswordView(false);
                        setShowLoginModal(false);
                      }}
                      className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-lg transition text-xs font-bold font-sans cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleRequestPasswordByEmail} className="space-y-4 text-left text-xs">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">
                        Correo Electrónico (Email) *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="Introduce tu correo electrónico registrado"
                        value={recoveryEmailInput}
                        onChange={(e) => setRecoveryEmailInput(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl w-full px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition cursor-pointer text-center"
                      >
                        Enviar Credenciales
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForgotPasswordView(false)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer text-center"
                      >
                        Volver al Login
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 text-left">
                      <h3 className="text-base font-bold font-display text-slate-950 flex items-center gap-2">
                        <span className="p-1 px-2 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-sm">🔑</span>
                        <span>Iniciar Sesión en Fashion Finances</span>
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Ingresa tu nombre de usuario y tu contraseña segura para acceder a tu panel.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLoginModal(false);
                        setLoginPassword('');
                      }}
                      className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-lg transition cursor-pointer font-bold text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">
                        Nombre de Usuario (Username)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-xs select-none">@</span>
                        <input
                          type="text"
                          required
                          placeholder="ej. sophialoren, ernesto, o tu usuario"
                          value={loginUsername}
                          onChange={(e) => setLoginUsername(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl w-full pl-8 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">
                        Contraseña (Password)
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl w-full p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                      />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-[10px] text-slate-500 space-y-1.5 text-left leading-relaxed">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        💡 Perfiles de simulación disponibles:
                      </span>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>
                          <strong className="text-indigo-600">ernesto</strong> (Inversor Temprano, password: <code className="bg-slate-200 px-1 rounded text-red-655">1234</code>)
                        </li>
                        <li>
                          <strong className="text-pink-600">sophialoren</strong> / <strong className="text-pink-600">valentina</strong> (password: <code className="bg-slate-200 px-1 rounded text-red-655">1234</code>)
                        </li>
                      </ul>
                      <p className="border-t border-slate-200/80 pt-1 text-[9.5px]">
                        O introduce <strong className="text-slate-800 underline">cualquier otro</strong> usuario y contraseña para auto-crear un inversor simulado con 100€ de saldo de inmediato.
                      </p>
                    </div>

                    <div className="flex gap-2 pt-1 font-sans">
                      <button
                        type="submit"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer text-center"
                      >
                        Entrar al Panel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowLoginModal(false);
                          setLoginPassword('');
                        }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer text-center"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="text-center pt-2 border-t border-slate-100 font-sans">
                      <button
                        type="button"
                        onClick={() => setShowForgotPasswordView(true)}
                        className="text-[11px] text-indigo-600 hover:underline cursor-pointer bg-transparent border-0 p-0 inline font-semibold"
                      >
                        ¿Olvidaste tu contraseña? Solicítala por email
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* 🖼️ INTERACTIVE PHOTO LIGHTBOX MODEL FOR GUEST USERS */}
        {selectedModelForExpandedView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-2 sm:p-4 animate-fade-in">
            {/* Click backdrop to close */}
            <div 
              className="absolute inset-0 cursor-zoom-out" 
              onClick={() => setSelectedModelForExpandedView(null)} 
            />

            {/* Lightbox Container */}
            <div className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] md:max-h-[80vh] shadow-2xl border border-slate-200 relative z-10 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-150">
              
              {/* Close Button on Mobile */}
              <button 
                onClick={() => setSelectedModelForExpandedView(null)}
                className="absolute top-4 right-4 md:hidden z-25 bg-slate-950/60 hover:bg-slate-950/80 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition duration-150 shadow-md cursor-pointer"
              >
                ✕
              </button>

              {/* LEFT: Image Stage (Vignette container) */}
              <div className="md:w-[55%] bg-slate-50 flex flex-col justify-between items-center p-5 relative min-h-[300px] sm:min-h-[360px] md:h-[450px] lg:h-[550px] overflow-y-auto">
                <ExpandedModelPhotoSlider model={selectedModelForExpandedView} />

                {/* Redes Sociales outside the image area (in the light area) */}
                <div className="w-full mt-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm z-10">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-sans text-left mb-2">Redes Sociales Oficiales</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Instagram Light Card */}
                    <div className="bg-slate-50 border border-slate-150 p-2 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-500 p-1.5 rounded-lg text-white shrink-0">
                          <Instagram className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="text-left min-w-0">
                          <span className="block text-[10px] font-bold text-slate-800 leading-tight">Instagram</span>
                          <span className="block text-[8px] text-slate-500 font-mono leading-none truncate">
                            {selectedModelForExpandedView.socials?.instagram || `@${selectedModelForExpandedView.username}`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block text-xs font-black text-rose-600 font-mono">
                          {((selectedModelForExpandedView.socials?.instagramFollowers) || Math.floor(selectedModelForExpandedView.followersCount * 0.58 + 450)).toLocaleString()}
                        </span>
                        <span className="block text-[7px] font-bold uppercase text-slate-400 tracking-wider">Amigos</span>
                      </div>
                    </div>

                    {/* TikTok Light Card */}
                    <div className="bg-slate-50 border border-slate-150 p-2 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="bg-slate-800 p-1.5 rounded-lg text-white flex items-center justify-center shrink-0">
                          <svg className="w-3.5 h-3.5 text-cyan-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.62 4.14.94 1.07 2.22 1.81 3.59 2.15v3.91c-1.34-.07-2.65-.58-3.72-1.39-.77-.58-1.38-1.38-1.78-2.29-.01 1.94-.01 3.88-.01 5.8 0 1.02-.19 2.05-.59 3.01-.76 1.83-2.39 3.23-4.32 3.69-1.51.37-3.14.21-4.54-.46-2.02-.95-3.35-3.08-3.41-5.33-.08-2.56 1.76-4.95 4.25-5.51.68-.16 1.38-.21 2.08-.14v3.9c-.89-.15-1.84.13-2.48.78-.65.65-.89 1.63-.6 2.5.34.93 1.25 1.57 2.24 1.56 1.15.02 2.12-.91 2.14-2.06.01-4.22.01-8.44.01-12.66-.02-.32-.01-.65-.01-.97z" />
                          </svg>
                        </div>
                        <div className="text-left min-w-0">
                          <span className="block text-[10px] font-bold text-slate-800 leading-tight">TikTok</span>
                          <span className="block text-[8px] text-slate-500 font-mono leading-none truncate">
                            {selectedModelForExpandedView.socials?.tiktok || `@${selectedModelForExpandedView.username}_tok`}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block text-xs font-black text-cyan-600 font-mono">
                          {((selectedModelForExpandedView.socials?.tiktokFollowers) || Math.floor(selectedModelForExpandedView.followersCount * 0.72 + 820)).toLocaleString()}
                        </span>
                        <span className="block text-[7px] font-bold uppercase text-slate-400 tracking-wider">Amigos</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to action: Elegir como Patrocinador (Located below Official Social Media) */}
                <div className="w-full mt-4 flex flex-col items-center gap-2 z-10 pt-3 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      setRegSponsorId(selectedModelForExpandedView.id);
                      setSelectedModelForExpandedView(null);
                      setShowRegisterModal(true);
                    }}
                    className="w-full max-w-md py-2.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserPlus2 className="w-4 h-4 text-rose-500" />
                    <span>Elegir como Patrocinador</span>
                  </button>
                  <p className="text-[9.5px] text-slate-400 text-center font-sans max-w-sm leading-tight">
                    Al elegir a {selectedModelForExpandedView.name}, se pre-seleccionará automáticamente en tu formulario de registro.
                  </p>
                </div>
              </div>

              {/* RIGHT: Info and Sponsor Selection */}
              <div className="md:w-[45%] flex flex-col h-[48vh] md:h-full justify-between bg-white">
                
                {/* Header (Model profile badge) */}
                <div className="p-4 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={selectedModelForExpandedView.avatar} 
                      alt={selectedModelForExpandedView.name} 
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div className="text-left">
                      <span className="font-bold text-slate-800 text-xs block leading-tight">{selectedModelForExpandedView.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">@{selectedModelForExpandedView.username}</span>
                    </div>
                  </div>

                  {/* Desktop close button */}
                  <button 
                    onClick={() => setSelectedModelForExpandedView(null)}
                    className="hidden md:flex text-slate-400 hover:text-slate-800 p-1.5 hover:bg-slate-100 rounded-lg transition duration-155 font-bold text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Scrollable Welcome + Description Panel */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 text-left">
                  {/* Welcome Message Card */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest block font-sans">Mensaje de Bienvenida</span>
                    <div className="bg-indigo-50/50 border border-indigo-100/30 rounded-2xl p-4 relative font-sans">
                      <span className="absolute top-2 right-3 text-indigo-200 font-serif text-3xl select-none leading-none">“</span>
                      <p className="text-slate-700 text-xs font-semibold leading-relaxed font-sans italic pr-2">
                        {(() => {
                          const welcomes: Record<string, string> = {
                            'valentinarossi0': '¡Hola! Es un placer saludarte. Formar parte de mi red en Fashion Finances significa sumergirse en lo mejor de la alta costura sostenible. Te acompañará paso a paso para que logremos consolidar tus proyectos de moda más ambiciosos. ¡Trabajemos en equipo!',
                            'alexandervance1': '¡Hola! Bienvenido. Soy Alexander y me apasiona la fusión del diseño urbano creativo y las finanzas descentralizadas. Al elegirme como tu patrocinador, contarás con toda mi experiencia de marca y el apoyo de mi comunidad para impulsar tus proyectos en las mesas. ¡Hagamos historia juntos!',
                          };
                          return welcomes[selectedModelForExpandedView.username.toLowerCase()] || `¡Hola! Bienvenido a mi espacio oficial en Fashion Finances. Como tu patrocinadora de moda, mi objetivo es empoderar tu creatividad, ayudándote a financiar y difundir tus propuestas en el ecosistema. ¡Únete hoy a mi equipo de referidos y alcancemos el éxito juntos!`;
                        })()}
                      </p>
                    </div>
                  </div>

                  {/* Biography */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-pink-600 uppercase tracking-widest block font-sans">Sobre mí</span>
                    <p className="text-slate-600 text-xs leading-relaxed font-sans font-medium pl-1">
                      {selectedModelForExpandedView.bio}
                    </p>
                  </div>

                  {/* Stats indicators (like Likes, Referidos) */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                      <span className="block text-[8px] uppercase tracking-wider font-bold text-slate-400 font-sans">Patrocinios</span>
                      <span className="block text-xs font-bold text-slate-800 font-mono mt-0.5">{selectedModelForExpandedView.referidosCount} activos</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                      <span className="block text-[8px] uppercase tracking-wider font-bold text-slate-400 font-sans">Popularidad</span>
                      <span className="block text-xs font-bold text-slate-800 font-mono mt-0.5">{(selectedModelForExpandedView.totalLikes).toLocaleString()} votos</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Find user's active sponsor info for display
  const userSponsor = models.find(m => m.id === userProfile.patrocinadorId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col justify-between max-w-full overflow-x-hidden overflow-y-auto select-none">
      <HeartRainOverlay />
      
      {showVictoriaSecretRanking && (
        <VictoriaSecretRanking
          isOpen={showVictoriaSecretRanking}
          onClose={() => setShowVictoriaSecretRanking(false)}
          models={models}
          onSelectModel={(model) => {
            setSelectedModelForView(model);
            setModelViewSourceTab('ranking');
            setActiveTabTab('home');
            setShowVictoriaSecretRanking(false);
          }}
          onNavigateToStore={(storeId) => {
            setShowVictoriaSecretRanking(false);
            localStorage.setItem('came_from_profile_sponsor', 'true');
            localStorage.setItem('previous_tab_before_sponsor', activeTab);
            setInitialSelectedStoreId(storeId);
            setPreviousTab(activeTab);
            setActiveTabTab('casting_live');
          }}
        />
      )}


      {/* PRIMARY HEADER BRANDING */}
      <header className="bg-white border-b border-slate-100 py-2 sm:py-4 px-3 sm:px-6 sticky top-0 z-[100] shrink-0 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FashionsFinanceLogo mode="light" className="w-10 h-10" />
            <div>
              <h1 className="font-display font-semibold text-lg text-slate-950 leading-tight">Fashion Finances</h1>
              <p className="text-[10px] text-slate-400 tracking-widest uppercase">Casting Live & Fashion Models</p>
            </div>
          </div>

          {/* Wallet and user status trigger */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Rol: {userProfile.role === 'model' ? 'Modelo' : userProfile.role === 'visitor' ? 'Visitante No Registrado' : 'Inversor'}</span>
              <strong className="text-slate-800 text-sm font-semibold">{userProfile.name}</strong>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-1.5 flex items-center gap-3">
              <div className="px-2.5">
                <span className="text-[9px] text-slate-400 uppercase font-mono block">Backoffice</span>
                <strong className="font-mono text-xs text-slate-900 font-bold">{userProfile.balance.toFixed(2)}€</strong>
              </div>
              <button
                onClick={() => setShowAddFundsModal(true)}
                className="bg-slate-950 hover:bg-slate-800 text-white rounded-lg p-2 transition-all cursor-pointer flex items-center justify-center"
                title="Añadir fondos simulados"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>


          </div>
        </div>
      </header>

      {/* Visitor warning banner */}
      {userProfile.role === 'visitor' && (
        <div className="bg-amber-50 border-b border-amber-200/80 px-6 py-3 text-center animate-fade-in">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-950 font-sans font-medium">
            <span className="flex items-center gap-2">
              <span className="text-sm">🕶️</span>
              <span><strong>Estás navegando como Visitante No Registrado.</strong> Puedes explorar libremente las modelos, ranking de rentabilidad y feeds recreativos de Casting Live, pero necesitarás registrarte para chatear, patrocinar o invertir.</span>
            </span>
            <div className="flex gap-2 shrink-0 select-none">
              <button
                type="button"
                onClick={() => setShowRegisterModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wide transition cursor-pointer shadow-xs"
              >
                Registrar Cuenta
              </button>
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="bg-slate-900 hover:bg-slate-850 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wide transition cursor-pointer shadow-xs"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER TABS WRAPPER */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 max-md:p-3 flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* LEFT NAV PANEL - Styled with high contrast and desktop responsiveness */}
        <aside className="lg:w-64 shrink-0 flex flex-col gap-4 max-md:hidden">
          {/* User profile segment */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-slate-100"
              />
              <div className="truncate">
                <span className="bg-slate-100 text-slate-600 font-bold font-mono px-1.5 py-0.2 rounded-md text-[9px] uppercase">
                  {userProfile.role}
                </span>
                <h4 className="font-semibold text-slate-800 text-xs truncate mt-0.5">{userProfile.name}</h4>
                <p className="text-[10px] text-slate-400 font-mono truncate">@{userProfile.username}</p>
              </div>
            </div>
          </div>

           {/* Navigation Menu */}
          <nav className="bg-white rounded-2xl border border-slate-100 p-2 shadow-xs space-y-1" id="nav-menu">
            {userProfile.role !== 'model' ? (
              <>
                <button
                  onClick={() => setActiveTabTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    activeTab === 'profile'
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="text-sm select-none">🏠</span>
                  <span>Mi Perfil</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTabTab('home')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'home'
                    ? 'bg-slate-950 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="text-sm select-none">👢</span>
                <span>Mi perfil</span>
              </button>
            )}

            <button
              onClick={() => setActiveTabTab('finance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'finance'
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Mis Finanzas</span>
            </button>

            {userProfile.role !== 'visitor' && (
              <button
                onClick={() => setActiveTabTab('sessions')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'sessions'
                    ? 'bg-slate-950 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Sesiones</span>
              </button>
            )}

            {(userProfile.role === 'investor' || userProfile.role === 'model') && (
              <>
                <button
                  onClick={() => setActiveTabTab('create_project')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    activeTab === 'create_project'
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Registrar Proyecto</span>
                </button>

                <button
                  onClick={() => setActiveTabTab('saved_projects')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    activeTab === 'saved_projects'
                      ? 'bg-slate-950 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Proyectos Guardados</span>
                </button>
              </>
            )}

            {userProfile.role !== 'visitor' && (
              <button
                onClick={() => setActiveTabTab('chat')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'chat'
                    ? 'bg-slate-950 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Mensajes</span>
              </button>
            )}

            {userProfile.role !== 'visitor' && (
              <button
                onClick={() => {
                  localStorage.removeItem('selectedLiveModelId');
                  setSelectedLiveModelId(undefined);
                  localStorage.setItem('casting_live_active_subtab', 'para-ti');
                  setActiveTabTab('casting_live');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'casting_live'
                    ? 'bg-slate-950 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="btn-nav-casting_live"
              >
                <Video className="w-4 h-4 text-red-500 animate-pulse" />
                <span>Casting Live</span>
                <span className="ml-auto bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full animate-bounce">NUEVO</span>
              </button>
            )}

            {userProfile.role !== 'visitor' && (
              <button
                onClick={() => setActiveTabTab('patrocinados')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'patrocinados'
                    ? 'bg-slate-950 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                id="btn-nav-patrocinados"
              >
                <Users className="w-4 h-4" />
                <span>Patrocinados</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Cerrar Sesión</span>
            </button>
          </nav>

          {/* Container of Information Intro and Companies I Sponsor - Desktop view directly below Cerrar Sesión button */}
          <div className="hidden lg:block">
            <ProfileIntroAndSponsors
              userProfile={selectedModelForView ? {
                id: selectedModelForView.id,
                name: selectedModelForView.name,
                username: selectedModelForView.username,
                role: 'model',
                bio: selectedModelForView.bio,
                avatar: selectedModelForView.avatar
              } : userProfile}
              onNavigateToTab={(tab, targetStoreId) => {
                if (targetStoreId) {
                  localStorage.setItem('came_from_profile_sponsor', 'true');
                  localStorage.setItem('previous_tab_before_sponsor', activeTab);
                  setInitialSelectedStoreId(targetStoreId);
                }
                setPreviousTab(activeTab);
                setActiveTabTab(tab);
              }}
              onOpenRanking={() => setShowVictoriaSecretRanking(true)}
              models={models}
              onSelectModel={(mod) => {
                setSelectedModelForView(mod);
                setModelViewSourceTab('ranking');
                setActiveTabTab('home');
              }}
              friendsCount={displayedFriends.length}
            />
          </div>


        </aside>

        {/* RIGHT MASTER DETAIL CONTENT VIEWPORT */}
        <section className="flex-1 flex flex-col gap-6 min-w-0 max-w-full overflow-x-hidden" id="master-viewport">
          {/* 📱 MOBILE NAVIGATION MENU (image.png) - Visible across all tabs on mobile view */}
          <MobileNavigationMenu
            activeTab={activeTab}
            userRole={userProfile.role}
            onNavigateToTab={(tab) => {
              if (tab === 'home') {
                setSelectedModelForView(null);
                setModelViewSourceTab(null);
              }
              setActiveTabTab(tab as any);
            }}
            onLogout={handleLogout}
            selectedModelForView={selectedModelForView}
            onResetSelectedModel={() => {
              setSelectedModelForView(null);
              setModelViewSourceTab(null);
            }}
          />

          {activeTab === 'home' && (
            selectedModelForView ? (
              <div className="space-y-4 animate-fade-in">
                {/* Volver Navigation Bar */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-3xs flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (modelViewSourceTab === 'ranking') {
                        setShowVictoriaSecretRanking(true);
                      } else if (modelViewSourceTab === 'casting_live') {
                        setActiveTabTab('casting_live');
                      } else if (selectedModelForView?.username === 'alexandervance_m1' || modelViewSourceTab === 'patrocinados') {
                        setActiveTabTab('patrocinados');
                      }
                      setSelectedModelForView(null);
                      setModelViewSourceTab(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-205 rounded-xl transition cursor-pointer"
                  >
                    <span>← Volver</span>
                  </button>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Viendo Perfil de Modelo</span>
                    <span className="text-xs font-black text-slate-800 font-display">{selectedModelForView.name}</span>
                  </div>
                </div>

                <ModelFacebookProfile
                  userProfile={{
                    id: selectedModelForView.id,
                    name: selectedModelForView.name,
                    username: selectedModelForView.username,
                    role: 'model',
                    patrocinadorId: selectedModelForView.id === 'topf-1' ? 'topm-1' : 'topf-1',
                    balance: 1500.00,
                    totalEarnings: selectedModelForView.followersCount * 0.12,
                    totalInvested: 0,
                    totalCommissions: selectedModelForView.referidosCount * 25,
                    avatar: selectedModelForView.avatar,
                    banner: selectedModelForView.banner || "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1200",
                    verified: true,
                    bankInfoProvided: true,
                    registeredAt: '2026-05-31',
                    bio: selectedModelForView.bio,
                    gender: selectedModelForView.gender || 'female'
                  }}
                  models={models}
                  onUpdateProfile={handleUpdateProfile}
                  onUpdateModels={handleUpdateModelsGlobal}
                  onSendMessage={handleSendMessage}
                  realLoggedInUser={userProfile || undefined}
                  onOpenRanking={() => setShowVictoriaSecretRanking(true)}
                  onNavigateToTab={(tab, targetStoreId) => {
                    if (targetStoreId) {
                      localStorage.setItem('came_from_profile_sponsor', 'true');
                      localStorage.setItem('previous_tab_before_sponsor', activeTab);
                      setInitialSelectedStoreId(targetStoreId);
                    }
                    setPreviousTab(activeTab);
                    setActiveTabTab(tab);
                  }}
                  onLaunchChat={handleLaunchChatWithModel}
                  onGoToModelProfile={(modelId, modelObj) => {
                    if (modelObj) {
                      setSelectedModelForView(modelObj);
                      setActiveTabTab('home');
                      return;
                    }
                    const target = models.find(m => m.id === modelId || m.name.toLowerCase().includes(modelId.toLowerCase()));
                    if (target) {
                      setSelectedModelForView(target);
                      setActiveTabTab('home');
                    } else if (modelId) {
                      const fallbackModel: ModelProfile = {
                        id: modelId,
                        name: modelId,
                        username: modelId.toLowerCase().replace(/\s+/g, '_'),
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
                        bio: 'Modelo participante en la sesión de financiación de alta costura.',
                        role: 'model',
                        rating: 5.0,
                        followersCount: 125000,
                        verified: true
                      };
                      setSelectedModelForView(fallbackModel);
                      setActiveTabTab('home');
                    }
                  }}
                  initialSocialModal={profileSocialModalState}
                  onSocialModalChange={setProfileSocialModalState}
                  onLogout={handleLogout}
                />
              </div>
            ) : userProfile && userProfile.role === 'model' ? (
              <div className="space-y-6">
                <ModelFacebookProfile
                  userProfile={userProfile}
                  models={models}
                  onUpdateProfile={handleUpdateProfile}
                  onUpdateModels={handleUpdateModelsGlobal}
                  onSendMessage={handleSendMessage}
                  realLoggedInUser={userProfile}
                  onOpenRanking={() => setShowVictoriaSecretRanking(true)}
                  onNavigateToTab={(tab, targetStoreId) => {
                    setActiveTabTab(tab);
                    if (targetStoreId) {
                      setInitialSelectedStoreId(targetStoreId);
                    }
                  }}
                  onLaunchChat={handleLaunchChatWithModel}
                  onGoToModelProfile={(modelId, modelObj) => {
                    if (modelObj) {
                      setSelectedModelForView(modelObj);
                      setActiveTabTab('home');
                      return;
                    }
                    const target = models.find(m => m.id === modelId || m.name.toLowerCase().includes(modelId.toLowerCase()));
                    if (target) {
                      setSelectedModelForView(target);
                      setActiveTabTab('home');
                    } else if (modelId) {
                      const fallbackModel: ModelProfile = {
                        id: modelId,
                        name: modelId,
                        username: modelId.toLowerCase().replace(/\s+/g, '_'),
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
                        bio: 'Modelo participante en la sesión de financiación de alta costura.',
                        role: 'model',
                        rating: 5.0,
                        followersCount: 125000,
                        verified: true
                      };
                      setSelectedModelForView(fallbackModel);
                      setActiveTabTab('home');
                    }
                  }}
                  initialSocialModal={profileSocialModalState}
                  onSocialModalChange={setProfileSocialModalState}
                  onLogout={handleLogout}
                />
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <ModelFacebookProfile
                  userProfile={userProfile}
                  models={models}
                  onUpdateProfile={handleUpdateProfile}
                  onUpdateModels={handleUpdateModelsGlobal}
                  onSendMessage={handleSendMessage}
                  realLoggedInUser={userProfile}
                  onOpenRanking={() => setShowVictoriaSecretRanking(true)}
                  onNavigateToTab={(tab, targetStoreId) => {
                    setActiveTabTab(tab);
                    if (targetStoreId) {
                      setInitialSelectedStoreId(targetStoreId);
                    }
                  }}
                  onLaunchChat={handleLaunchChatWithModel}
                  onGoToModelProfile={(modelId) => {
                    let target = models.find(m => m.id === modelId);
                    if (!target && modelId) {
                      const lower = modelId.toLowerCase().trim();
                      target = models.find(m => m.id.toLowerCase() === lower || m.name.toLowerCase().trim() === lower || m.name.toLowerCase().includes(lower) || (m.username && m.username.toLowerCase().includes(lower)));
                    }
                    if (!target && modelId) {
                      const firstName = modelId.toLowerCase().split(' ')[0];
                      if (firstName.length >= 3) {
                        target = models.find(m => m.name.toLowerCase().includes(firstName));
                      }
                    }
                    if (target) {
                      setSelectedModelForView(target);
                      setActiveTabTab('home');
                    }
                  }}
                  initialSocialModal={profileSocialModalState}
                  onSocialModalChange={setProfileSocialModalState}
                  onLogout={handleLogout}
                />
              </div>
            )
          )}

          {activeTab === 'finance' && (
            <div className="space-y-6 animate-fade-in">
              <DashboardStats
                movements={movements}
                models={models}
                patrocinadorId={userProfile.patrocinadorId}
                balance={userProfile.balance}
                totalEarnings={userProfile.totalEarnings}
                totalInvested={userProfile.totalInvested}
                totalCommissions={userProfile.totalCommissions}
                friendsCount={friendsList.length}
                followersCount={followersList.length}
                followingCount={followingList.length}
                referralsOnlineCount={patrocinadosList.filter(p => p.status === 'active').length}
                isVisitor={userProfile.role === 'visitor'}
                onSelectModel={(model) => {
                  handleSwitchToModelProfile(model);
                }}
              />
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-6 animate-fade-in">
              {/* Alert prompt if user hasn't uploaded a project yet in standard investment cycles */}
              {(userProfile.role === 'investor' || userProfile.role === 'model') && projects.length === 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-3">
                  <Info className="w-5 h-5 text-amber-500 shrink-0" />
                  <div className="text-xs text-amber-800">
                    <strong>¡Atención!</strong> De acuerdo a las reglas de Fashion Finances, primero debes registrar tu proyecto antes de poder pagar para entrar en las sesiones activas de inversión. ✍️
                    <button onClick={() => setActiveTabTab('create_project')} className="text-indigo-600 font-bold ml-1 hover:underline">
                      Registra tu proyecto aquí
                    </button>
                  </div>
                </div>
              )}

              <SessionSimulator
                key={userProfile.id}
                sessions={sessions}
                userProjects={projects}
                userProfile={userProfile}
                models={models}
                historyWonLog={historyWonLog}
                onUpdateSessions={handleUpdateSessions}
                onUpdateProfile={handleUpdateProfile}
                onAddMovement={handleAddMovement}
                onAddSystemHistory={handleAddSystemHistory}
                onNavigateToTab={setActiveTabTab}
                onSelectModel={(model) => {
                  setSelectedModelForView(model);
                  setActiveTabTab('home');
                }}
              />
            </div>
          )}

          {activeTab === 'create_project' && (
            <div className="space-y-6 animate-fade-in">
              <ProjectForm
                userProjects={projects}
                userId={userProfile.id}
                onAddProject={handleAddProject}
                userVerified={userProfile.verified}
                onVerifyUserToggle={handleVerifyUserToggle}
                onNavigateToTab={setActiveTabTab}
              />
            </div>
          )}

          {activeTab === 'saved_projects' && (
            <div className="space-y-6 animate-fade-in">
              <SavedProjectsManager
                userProjects={projects}
                historyWonLog={historyWonLog}
                sessions={sessions}
                userProfile={userProfile}
                onUpdateSessions={handleUpdateSessions}
                onUpdateProfile={handleUpdateProfile}
                onAddMovement={handleAddMovement}
                onNavigateToTab={setActiveTabTab}
                onUpdateProjects={handleUpdateProjects}
              />
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-6 animate-fade-in">
              <DirectMessageChat
                models={models}
                patrocinados={patrocinadosList}
                initialMessages={messages}
                currentUserId={userProfile.id}
                currentUserRole={userProfile.role}
                currentUserName={userProfile.name}
                currentUserUsername={userProfile.username}
                onSendMessage={handleSendMessage}
                selectedContactId={activeChatTargetId}
                sharedDraftImage={sharedDraftImage}
                onClearSharedDraftImage={() => setSharedDraftImage(null)}
                onSelectModel={(model) => {
                  setSelectedModelForView(model);
                  setActiveTabTab('home');
                }}
                onPatrocinateClick={handlePatrocinateClickFromChat}
                onGiftTransaction={handleGiftTransaction}
                onBack={() => {
                  if (previousTab) {
                    setActiveTabTab(previousTab as any);
                  } else {
                    setActiveTabTab('casting_live');
                  }
                }}
              />
            </div>
          )}

          {activeTab === 'profile' && userProfile && (
            <div className="space-y-6 animate-fade-in">
              <ModelFacebookProfile
                userProfile={userProfile}
                models={models}
                onUpdateProfile={handleUpdateProfile}
                onUpdateModels={handleUpdateModelsGlobal}
                onSendMessage={handleSendMessage}
                realLoggedInUser={userProfile}
                onOpenRanking={() => setShowVictoriaSecretRanking(true)}
                onNavigateToTab={(tab, targetStoreId) => {
                  if (targetStoreId) {
                    localStorage.setItem('came_from_profile_sponsor', 'true');
                    localStorage.setItem('previous_tab_before_sponsor', activeTab);
                    setInitialSelectedStoreId(targetStoreId);
                  }
                  setPreviousTab(activeTab);
                  setActiveTabTab(tab);
                }}
                onLaunchChat={handleLaunchChatWithModel}
                onGoToModelProfile={(modelId) => {
                  let target = models.find(m => m.id === modelId);
                  if (!target && modelId) {
                    const lower = modelId.toLowerCase().trim();
                    target = models.find(m => m.id.toLowerCase() === lower || m.name.toLowerCase().trim() === lower || m.name.toLowerCase().includes(lower) || (m.username && m.username.toLowerCase().includes(lower)));
                  }
                  if (!target && modelId) {
                    const firstName = modelId.toLowerCase().split(' ')[0];
                    if (firstName.length >= 3) {
                      target = models.find(m => m.name.toLowerCase().includes(firstName));
                    }
                  }
                  if (target) {
                    setSelectedModelForView(target);
                    setActiveTabTab('home');
                  }
                }}
                initialSocialModal={profileSocialModalState}
                onSocialModalChange={setProfileSocialModalState}
                onLogout={handleLogout}
              />
            </div>
          )}

          {false && activeTab === 'profile' && userProfile.role !== 'model' && (
            <div className="space-y-6 animate-fade-in">
              {/* User Profile Page with TOP 10 Models Ranking visible directly in page */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Profile Card & Model Dashboard features */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs flex flex-col">
                  {/* Background Banner */}
                  <div className="h-36 sm:h-48 bg-slate-100 relative overflow-hidden shrink-0">
                    <img 
                      src={userProfile.banner || "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=1200"} 
                      alt="Profile Banner" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                    
                    {/* Change Banner Overlay Trigger */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-20">
                      <input
                        type="file"
                        accept="image/*"
                        id="user-profile-banner-direct-upload"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const dataUrl = await compressAndResizeImage(file);
                              const updatedProfile = {
                                ...userProfile,
                                banner: dataUrl
                              };
                              setUserProfile(updatedProfile);
                              setEditBanner(dataUrl);
                              
                              // Propagate changes if model
                              let nextModels = models;
                              if (userProfile.role === 'model') {
                                nextModels = models.map(m => {
                                  if (m.id === userProfile.id) {
                                    return {
                                      ...m,
                                      banner: dataUrl
                                    };
                                  }
                                  return m;
                                });
                                setModels(nextModels);
                              }
                              
                              saveStateToLocalStorage(nextModels, updatedProfile, projects, sessions, messages, movements);
                              alert('✨ ¡Imagen de fondo de perfil actualizada con éxito!');
                            } catch (err) {
                              console.error('Error compressing banner:', err);
                              alert('⚠️ Error al procesar la imagen.');
                            }
                          }
                        }}
                      />
                      <label
                        htmlFor="user-profile-banner-direct-upload"
                        className="bg-black/60 hover:bg-black/85 text-white rounded-lg px-2.5 py-1.5 text-[10px] font-semibold flex items-center gap-1.5 cursor-pointer backdrop-blur-xs select-none transition border border-white/20"
                      >
                        <Camera className="w-3" />
                        <span>Cambiar Imagen de Fondo</span>
                      </label>
                    </div>
                  </div>

                  {/* Overlapping Content Box */}
                  <div className="p-6 pt-0 space-y-6 relative z-10">
                    <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-end text-center sm:text-left select-none">
                      <div className="-mt-12 sm:-mt-16 relative z-20 shrink-0">
                        <img
                          src={userProfile.avatar}
                          alt={userProfile.name}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white bg-slate-100 shadow-md"
                        />
                      </div>
                      <div className="space-y-1 pb-1 flex-1">
                        <span className="bg-slate-100 text-slate-800 font-bold font-mono px-2 py-0.5 rounded-md text-[10px] uppercase">
                          {userProfile.role}
                        </span>
                        <h3 className="text-xl font-bold font-display text-slate-800 leading-none flex items-center pr-2 flex-wrap">
                          <span>{userProfile.name} {userProfile.lastName || ''}</span>
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] pt-1">
                          <p className="text-indigo-500 font-mono">@{userProfile.username}</p>
                          {userProfile.instagram && (
                            <p className="text-pink-600 font-medium select-text">📷 {userProfile.instagram}</p>
                          )}
                          {userProfile.tiktok && (
                            <p className="text-slate-700 font-medium font-mono select-text">🎵 {userProfile.tiktok}</p>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-semibold leading-normal pt-1">
                          Miembro oficial registrado desde {userProfile.registeredAt ? userProfile.registeredAt.split('T')[0] : '2026-05-31'}.
                        </p>
                      </div>
                    </div>

                    {/* Bio/Description Display & Edit Box */}
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Sobre mí</span>
                        <button 
                          onClick={() => {
                            setEditAvatar(userProfile.avatar || '');
                            setEditBanner(userProfile.banner || '');
                            setEditLastName(userProfile.lastName || '');
                            setEditInstagram(userProfile.instagram || '');
                            setEditTikTok(userProfile.tiktok || '');
                            setEditBio(userProfile.bio || '');
                            setEditDireccion(userProfile.direccion || '');
                            setEditTelefono(userProfile.telefono || '');
                            setEditEmail(userProfile.email || '');
                            setEditShareDireccion(userProfile.shareDireccion !== false);
                            setEditShareTelefono(userProfile.shareTelefono !== false);
                            setEditShareEmail(userProfile.shareEmail !== false);
                            setIsEditingProfile(!isEditingProfile);
                          }} 
                          className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs cursor-pointer flex items-center gap-1"
                        >
                          ✏️ {isEditingProfile ? 'Cancelar' : 'Editar Perfil'}
                        </button>
                      </div>
                      {isEditingProfile ? (
                        <form onSubmit={handleSaveProfileChanges} className="space-y-3 pt-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                                Cargar Foto de Perfil
                              </label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        const compressed = await compressAndResizeImage(file);
                                        setEditAvatar(compressed);
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }
                                  }}
                                  className="hidden"
                                  id="profile-avatar-upload-desktop"
                                />
                                <label
                                  htmlFor="profile-avatar-upload-desktop"
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] px-3 py-1.5 rounded-lg shrink-0 transition cursor-pointer flex items-center gap-1.5"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  <span>Elegir Foto</span>
                                </label>
                                {editAvatar ? (
                                  <img src={editAvatar || undefined} alt="Profile preview" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                                ) : (
                                  <span className="text-slate-400 text-xs">Sin foto</span>
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                                Cargar Imagen de Fondo (Banner)
                              </label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      try {
                                        const compressed = await compressAndResizeImage(file);
                                        setEditBanner(compressed);
                                      } catch (err) {
                                        console.error(err);
                                      }
                                    }
                                  }}
                                  className="hidden"
                                  id="profile-banner-upload-desktop"
                                />
                                <label
                                  htmlFor="profile-banner-upload-desktop"
                                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[11px] px-3 py-1.5 rounded-lg shrink-0 transition cursor-pointer flex items-center gap-1.5"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  <span>Elegir Imagen</span>
                                </label>
                                {editBanner ? (
                                  <img src={editBanner || undefined} alt="Banner preview" className="w-12 h-8 rounded object-cover border border-slate-200" />
                                ) : (
                                  <span className="text-slate-400 text-xs">Sin imagen</span>
                                )}
                              </div>
                            </div>
                          </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                              Apellidos
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Ej. Alvarez"
                              value={editLastName}
                              onChange={(e) => setEditLastName(e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg w-full px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-550"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                              Instagram
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Ej. @carmen"
                              value={editInstagram}
                              onChange={(e) => setEditInstagram(e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg w-full px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-550"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                              Tik Tok
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Ej. @carmen_tiktok"
                              value={editTikTok}
                              onChange={(e) => setEditTikTok(e.target.value)}
                              className="bg-white border border-slate-200 rounded-lg w-full px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-550"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                            Descripción de Mí (Bio)
                          </label>
                          <textarea
                            maxLength={300}
                            rows={3}
                            placeholder="Escribe algo sobre ti para que los patrocinadores y amigos te conozcan..."
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg w-full px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-550 resize-none"
                          />
                          <span className="text-[9px] text-slate-400 block text-right mt-0.5 font-mono">
                            {editBio.length}/300 caracteres
                          </span>
                        </div>

                        {userProfile.role !== 'model' && (
                          <>
                         <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                            Dirección
                          </label>
                          <input
                            type="text"
                            placeholder="Ej. Calle Gran Vía 45, Madrid"
                            value={editDireccion}
                            onChange={(e) => setEditDireccion(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg w-full px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-550"
                          />
                          <div className="mt-1.5 flex items-center gap-2 bg-slate-100/50 p-2 rounded-md border border-slate-200/50">
                            <input
                              type="checkbox"
                              id="share-direccion-checkbox"
                              checked={editShareDireccion}
                              onChange={(e) => setEditShareDireccion(e.target.checked)}
                              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                            />
                            <label htmlFor="share-direccion-checkbox" className="text-[10px] text-slate-600 font-medium cursor-pointer select-none flex items-center gap-1">
                              <span>Compartir dirección de contacto</span>
                              <span className="text-[9px] text-slate-400">({editShareDireccion ? 'Público 🌐' : 'Privado 🔒'})</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                            Teléfono
                          </label>
                          <input
                            type="text"
                            placeholder="Ej. +34 612 345 678"
                            value={editTelefono}
                            onChange={(e) => setEditTelefono(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg w-full px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-550"
                          />
                          <div className="mt-1.5 flex items-center gap-2 bg-slate-100/50 p-2 rounded-md border border-slate-200/50">
                            <input
                              type="checkbox"
                              id="share-telefono-checkbox"
                              checked={editShareTelefono}
                              onChange={(e) => setEditShareTelefono(e.target.checked)}
                              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                            />
                            <label htmlFor="share-telefono-checkbox" className="text-[10px] text-slate-600 font-medium cursor-pointer select-none flex items-center gap-1">
                              <span>Compartir teléfono de contacto</span>
                              <span className="text-[9px] text-slate-400">({editShareTelefono ? 'Público 🌐' : 'Privado 🔒'})</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">
                            Correo Electrónico (Email)
                          </label>
                          <input
                            type="email"
                            placeholder="Ej. carmen@example.com"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg w-full px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-550"
                          />
                          <div className="mt-1.5 flex items-center gap-2 bg-slate-100/50 p-2 rounded-md border border-slate-200/50">
                            <input
                              type="checkbox"
                              id="share-email-checkbox"
                              checked={editShareEmail}
                              onChange={(e) => setEditShareEmail(e.target.checked)}
                              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
                            />
                            <label htmlFor="share-email-checkbox" className="text-[10px] text-slate-600 font-medium cursor-pointer select-none flex items-center gap-1">
                              <span>Compartir correo electrónico</span>
                              <span className="text-[9px] text-slate-400">({editShareEmail ? 'Público 🌐' : 'Privado 🔒'})</span>
                            </label>
                          </div>
                        </div>
                          </>
                        )}


                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition"
                          >
                            Guardar Cambios
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingProfile(false)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold py-1.5 px-3 rounded-lg transition"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-xs text-slate-655 leading-relaxed italic">
                        {userProfile.bio || 'Sin descripción redactada de momento. Haz clic en "Editar Perfil" para añadir tu biografía.'}
                      </p>
                    )}
                  </div>

                  {/* Contact Info Card showing Address, Phone, Email */}
                  {userProfile.role !== 'model' && (
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pb-1 border-b border-slate-200/50">
                        Información de Contacto
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Dirección</span>
                            {userProfile.shareDireccion === false ? (
                              <span className="text-[8px] bg-red-50 text-red-600 border border-red-200/50 px-1 rounded font-bold uppercase tracking-wider">Privado 🔒</span>
                            ) : (
                              <span className="text-[8px] bg-emerald-50 text-emerald-600 border border-emerald-200/50 px-1 rounded font-bold uppercase tracking-wider">Público 🌐</span>
                            )}
                          </div>
                          <p className={`font-semibold break-words ${userProfile.shareDireccion === false ? 'text-slate-400 italic text-[11px]' : 'text-slate-850'}`}>
                            {userProfile.shareDireccion === false 
                              ? 'Oculto por privacidad' 
                              : (userProfile.direccion || 'No especificada')}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Teléfono</span>
                            {userProfile.shareTelefono === false ? (
                              <span className="text-[8px] bg-red-50 text-red-600 border border-red-200/50 px-1 rounded font-bold uppercase tracking-wider">Privado 🔒</span>
                            ) : (
                              <span className="text-[8px] bg-emerald-50 text-emerald-600 border border-emerald-200/50 px-1 rounded font-bold uppercase tracking-wider">Público 🌐</span>
                            )}
                          </div>
                          <p className={`font-semibold ${userProfile.shareTelefono === false ? 'text-slate-400 italic text-[11px]' : 'text-slate-850'}`}>
                            {userProfile.shareTelefono === false 
                              ? 'Oculto por privacidad' 
                              : (userProfile.telefono || 'No especificado')}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Correo Electrónico (Email)</span>
                            {userProfile.shareEmail === false ? (
                              <span className="text-[8px] bg-red-50 text-red-600 border border-red-200/50 px-1 rounded font-bold uppercase tracking-wider">Privado 🔒</span>
                            ) : (
                              <span className="text-[8px] bg-emerald-50 text-emerald-600 border border-emerald-200/50 px-1 rounded font-bold uppercase tracking-wider">Público 🌐</span>
                            )}
                          </div>
                          <p className={`font-semibold ${userProfile.shareEmail === false ? 'text-slate-400 italic text-[11px]' : 'text-indigo-600 break-all'}`}>
                            {userProfile.shareEmail === false 
                              ? 'Oculto por privacidad' 
                              : (userProfile.email || 'No especificado')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* General settings stats inside Profile page */}
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                    <div className="bg-slate-50/50 rounded-xl p-3 text-center border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Estado de Cuenta</span>
                      <strong className="text-slate-800 text-sm font-semibold">{userProfile.verified ? 'Verificado ✓' : 'Pendiente'}</strong>
                    </div>

                    <div className="bg-slate-50/50 rounded-xl p-3 text-center border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Rondas Ganadas</span>
                      <strong className="text-slate-800 text-sm font-semibold">{historyWonLog.length} Completadas</strong>
                    </div>
                  </div>

                  {/* AMIGOS, SEGUIDORES & SEGUIDOS BUTTONS FOR INVESTOR (HORIZONTAL & COMPACT) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveSocialModalInvestor('friends')}
                      className="flex items-center justify-between px-3 py-2 rounded-xl border border-pink-200 bg-gradient-to-r from-white to-pink-50/40 hover:from-pink-50 hover:to-pink-100/40 transition duration-150 cursor-pointer text-left select-none text-slate-800"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <UserPlus2 className="w-4 h-4 text-pink-550 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[8.5px] uppercase font-bold text-pink-500 tracking-wider font-mono block truncate">Amigos</span>
                          <span className="text-xs font-black text-slate-800 font-mono">{displayedFriends.length}</span>
                        </div>
                      </div>
                      <span className="text-[9.5px] font-bold text-pink-600 flex items-center gap-0.5 shrink-0">Ver todos <span className="text-[7.5px]">→</span></span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSocialModalInvestor('followers')}
                      className="flex items-center justify-between px-3 py-2 rounded-xl border border-pink-200 bg-gradient-to-r from-white to-pink-50/40 hover:from-pink-50 hover:to-pink-100/40 transition duration-150 cursor-pointer text-left select-none text-slate-800"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Users className="w-4 h-4 text-pink-550 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[8.5px] uppercase font-bold text-pink-500 tracking-wider font-mono block truncate">Seguidores</span>
                          <span className="text-xs font-black text-slate-800 font-mono">{displayedFollowers.length}</span>
                        </div>
                      </div>
                      <span className="text-[9.5px] font-bold text-pink-600 flex items-center gap-0.5 shrink-0">Ver todos <span className="text-[7.5px]">→</span></span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSocialModalInvestor('following')}
                      className="flex items-center justify-between px-3 py-2 rounded-xl border border-pink-200 bg-gradient-to-r from-white to-pink-50/40 hover:from-pink-50 hover:to-pink-100/40 transition duration-150 cursor-pointer text-left select-none text-slate-800"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <UserCheck className="w-4 h-4 text-pink-550 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-[8.5px] uppercase font-bold text-pink-500 tracking-wider font-mono block truncate">Seguidos</span>
                          <span className="text-xs font-black text-slate-800 font-mono">{displayedFollowing.length}</span>
                        </div>
                      </div>
                      <span className="text-[9.5px] font-bold text-pink-600 flex items-center gap-0.5 shrink-0">Ver todos <span className="text-[7.5px]">→</span></span>
                    </button>
                  </div>

                  {/* Historic Won Sessions list */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Historial de Ganancias del Usuario (Guardadas tras Cierre)
                    </h4>
                    {historyWonLog.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No tienes rondas guardadas en tu backoffice todavía.</p>
                    ) : (
                      <div className="space-y-2">
                        {historyWonLog.map((log) => (
                          <div key={log.id} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                            <div>
                              <strong className="text-slate-800">{log.title}</strong>
                              <p className="text-[10px] text-slate-400">{new Date(log.date).toLocaleDateString()}</p>
                            </div>
                            <span className="text-emerald-600 font-bold font-mono">+{log.prize.toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

                {/* Right side: Top 10 models rank inside user profiles as direct inducement */}
                <div className="lg:col-span-4 bg-slate-950 text-white rounded-2xl p-5 space-y-4 shadow-sm border border-slate-900">
                  <div>
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Ranking Top 10 Modelos</span>
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      La competencia incentiva a los modelos a conseguir más mecenas en Fashion Finances.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {models.slice(0, 10).map((m, idx) => {
                      let podiumColor = 'text-slate-400';
                      if (idx === 0) podiumColor = 'text-amber-400';
                      else if (idx === 1) podiumColor = 'text-slate-300';
                      else if (idx === 2) podiumColor = 'text-amber-600';

                      return (
                        <div
                          key={m.id}
                          onClick={() => {
                            setSelectedModelForView(m);
                            setActiveTabTab('home');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-xs hover:bg-slate-800 hover:border-slate-700 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center gap-2 max-w-[70%] text-left">
                            <span className={`font-bold font-mono text-xs w-4 text-center ${podiumColor}`}>
                              #{idx + 1}
                            </span>
                            <img src={m.avatar} alt={m.name} referrerPolicy="no-referrer" className="w-6 h-6 rounded-md object-cover transition-transform group-hover:scale-105" />
                            <span className="font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">{m.name}</span>
                          </div>
                          <div className="flex items-center gap-1 font-semibold text-rose-400">
                            <Heart className="w-3 h-3 fill-current" />
                            <span>{m.totalLikes}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'patrocinados' && (
            <div className="space-y-6 animate-fade-in">
              <PatrocinadosView
                patrocinados={patrocinadosList}
                models={models}
                patrocinadorId={userProfile.patrocinadorId}
                onAddPatrocinado={handleAddPatrocinado}
                onDeletePatrocinado={handleDeletePatrocinado}
                onOpenRegisterForm={() => setShowRegisterModal(true)}
                onSelectModel={(model) => {
                  setSelectedModelForView(model);
                  setModelViewSourceTab('patrocinados');
                  setActiveTabTab('home');
                }}
              />
            </div>
          )}

          <div className={activeTab === 'casting_live' ? 'space-y-4 max-md:space-y-0 animate-fade-in pt-0 w-full max-w-full overflow-x-hidden min-w-0 max-md:h-full flex-1 flex flex-col' : 'hidden'}>
            <CastingLiveSection
              models={models}
              userProfile={userProfile}
              selectedLiveModelId={selectedLiveModelId}
              initialSelectedStoreId={initialSelectedStoreId}
              onClearSelectedStoreId={() => setInitialSelectedStoreId(null)}
              onOpenChatWithModel={(modelId) => {
                const target = models.find(m => m.id === modelId || m.username.toLowerCase() === modelId.toLowerCase()) ||
                               patrocinadosList.find(p => p.id === modelId || p.username.toLowerCase() === modelId.toLowerCase());
                const targetId = target ? target.id : modelId;
                setPreviousTab('casting_live');
                setActiveChatTargetId(targetId);
                setActiveTabTab('chat');
              }}
              onGoToModelProfile={(modelId, modelObj) => {
                setModelViewSourceTab('casting_live');
                if (modelObj) {
                  setSelectedModelForView(modelObj);
                  setActiveTabTab('home');
                  return;
                }
                let target = models.find(m => m.id === modelId);
                if (!target && modelId) {
                  const lower = modelId.toLowerCase().trim();
                  target = models.find(m => m.id.toLowerCase() === lower || m.name.toLowerCase().trim() === lower || m.name.toLowerCase().includes(lower) || (m.username && m.username.toLowerCase().includes(lower)));
                }
                if (!target && modelId) {
                  const firstName = modelId.toLowerCase().split(' ')[0];
                  if (firstName.length >= 3) {
                    target = models.find(m => m.name.toLowerCase().includes(firstName));
                  }
                }
                if (target) {
                  setSelectedModelForView(target);
                  setActiveTabTab('home');
                } else if (modelId) {
                  const isAdriana = modelId.toLowerCase().includes('adriana');
                  const isAlessandra = modelId.toLowerCase().includes('alessandra');
                  const isSophia = modelId.toLowerCase().includes('sophia');
                  const isAlexander = modelId.toLowerCase().includes('alexander');

                  const fallbackName = isAdriana ? 'Adriana Lima' : isAlessandra ? 'Alessandra Ambrosio' : isSophia ? 'Sophia Loren' : isAlexander ? 'Alexander Vance' : (modelId.startsWith('f-') ? (modelId === 'f-1' ? 'Adriana Lima' : modelId === 'f-2' ? 'Gisele Bündchen' : modelId === 'f-3' ? 'Marcus Vance' : modelId === 'f-4' ? 'Sienna Cole' : modelId === 'f-5' ? 'Liam Cooper' : modelId === 'f-6' ? 'Elena Rostova' : 'Modelo') : modelId);

                  const fallbackUsername = isAdriana ? 'adrianalima_w1' : isAlessandra ? 'alessandraambrosio_w2' : isSophia ? 'sophialoren_w3' : isAlexander ? 'alexandervance_m1' : modelId.toLowerCase().replace(/\s+/g, '_');

                  const fallbackAvatar = isAdriana ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650' : isAlessandra ? 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650' : isSophia ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650' : isAlexander ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=650' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650';

                  const fallbackModel: ModelProfile = {
                    id: modelId,
                    name: fallbackName,
                    username: fallbackUsername,
                    avatar: fallbackAvatar,
                    bio: 'Top 1 Modelo Femenina Global. Creadora oficial registrada, enfocada en conectar inversores con proyectos potentes.',
                    role: 'model',
                    rating: 5.0,
                    followersCount: 210400,
                    totalLikes: 14960,
                    verified: true
                  };
                  setSelectedModelForView(fallbackModel);
                  setActiveTabTab('home');
                }
              }}
              onNavigateToTab={(tab, targetStoreId) => {
                setPreviousTab(activeTab);
                if (targetStoreId) {
                  localStorage.setItem('came_from_profile_sponsor', 'true');
                  localStorage.setItem('previous_tab_before_sponsor', activeTab);
                  setInitialSelectedStoreId(targetStoreId);
                }
                setActiveTabTab(tab);
              }}
              onUpdateUserProfile={handleUpdateProfile}
              onGiftTransaction={handleGiftTransaction}
            />
          </div>
        </section>
      </main>

      {/* --- MODAL DIALOGS --- */}

      {/* 1. Add simulated Funds modal */}
      {showAddFundsModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px] p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddFundsModal(false);
          }}
        >
          <div className="bg-[#0c1322]/95 border border-slate-700/80 rounded-2xl w-full max-w-sm p-6 text-white text-xs space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-400" />
              <span>Añadir Fondos Simulación (Backoffice)</span>
            </h3>
            <p className="text-slate-300">
              Carga saldo líquido para probar la inversión de entrada en mesas y registrar proyectos.
            </p>

            <form onSubmit={handleAddFundsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Monto en Euros (EUR)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={addFundsAmount}
                  onChange={(e) => setAddFundsAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFundsModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold transition"
                >
                  Confirmar Depósito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🎬 1.5. Interactivo Ranking Video Player Modal (As requested: clicking landing page images launches the video on image.png page) */}
      {rankingVideoPlayUrl && (
        <div className="fixed inset-0 z-55 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative bg-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-white">
            
            {/* Header overlay */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
              <span className="bg-[#fe2c55] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                🔴 EN CASTING
              </span>
              <button
                type="button"
                onClick={() => {
                  setRankingVideoPlayUrl(null);
                  setRankingVideoModelName(null);
                }}
                className="pointer-events-auto bg-black/40 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center transition border border-white/20 cursor-pointer"
                title="Cerrar pasarela de vídeo"
              >
                ✕
              </button>
            </div>

            {/* Premium Video Container */}
            <div className="relative aspect-[9/16] bg-black flex items-center justify-center overflow-hidden flex-1 select-none">
              <video
                key={rankingVideoPlayUrl}
                src={rankingVideoPlayUrl || undefined}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                controls
              />
              
              {/* Bottom linear color block gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
              
              {/* Floating Heart Button / Likes Decoration */}
              <button
                type="button"
                onClick={() => {
                  alert("💖 ¡Te gusta este vídeo! Se ha añadido un voto al ranking de este artista.");
                }}
                className="absolute right-4 bottom-20 bg-black/55 hover:bg-[#fe2c55]/80 text-white p-3 rounded-full transition border border-white/10 flex flex-col items-center justify-center gap-1 cursor-pointer scale-100 hover:scale-110 active:scale-95"
              >
                <Heart className="w-5 h-5 fill-current text-rose-500" />
                <span className="text-[9px] font-mono font-bold">VOTAR</span>
              </button>
            </div>

            {/* Model Profile Info & Interactive Actions */}
            <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-tr from-pink-500 to-amber-400 p-0.5 rounded-full shadow-inner">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center font-extrabold text-xs uppercase overflow-hidden">
                    {rankingVideoModelName?.charAt(0) || '⭐'}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight">{rankingVideoModelName}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">ID de la Estrella de Moda</p>
                </div>
                <span className="ml-auto bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold uppercase border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>ONLINE</span>
                </span>
              </div>

              <p className="text-[11px] text-slate-350 leading-relaxed">
                Este vídeo fue cargado mediante el concurso de selección de patrocinio oficial en Fashion Finances. Si eres sponsor, puedes obtener comisiones de su red de afiliados.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const matched = models.find(m => m.name === rankingVideoModelName);
                    if (matched) {
                      setSelectedModelForView(matched);
                      setActiveTabTab('home');
                    } else {
                      alert("Has seleccionado patrocinar a esta estrella virtual del ranking.");
                    }
                    setRankingVideoPlayUrl(null);
                    setRankingVideoModelName(null);
                  }}
                  className="py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl uppercase tracking-wider transition active:scale-97 text-center border-0 cursor-pointer"
                >
                  Patrocinar Estrella
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRankingVideoPlayUrl(null);
                    setRankingVideoModelName(null);
                  }}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-extrabold text-xs rounded-xl uppercase tracking-wider transition border-0 cursor-pointer"
                >
                  Regresar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. Registration account Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 sm:p-8 text-slate-900 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh] my-8">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold font-display text-slate-950 flex items-center gap-2">
                  <UserPlus2 className="w-5 h-5 text-indigo-600" />
                  <span>Crear Cuenta en Fashion Finances</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Regístrate eligiendo a uno de los 50 modelos del ranking o a tu patrocinador personal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterNewAccount} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carmen"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Apellidos *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Alvarez"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nombre de Usuario (Username) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. carmenval"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Instagram (@usuario) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. @carmen_diseno"
                  value={regInstagram}
                  onChange={(e) => setRegInstagram(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tik Tok (@usuario) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. @carmen_tok"
                  value={regTikTok}
                  onChange={(e) => setRegTikTok(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Dirección *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Calle Gran Vía 45, Madrid"
                  value={regDireccion}
                  onChange={(e) => setRegDireccion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ciudad *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Madrid"
                  value={regCiudad}
                  onChange={(e) => setRegCiudad(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Código Postal *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 28013"
                  value={regCodigoPostal}
                  onChange={(e) => setRegCodigoPostal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">País *</label>
                <select
                  required
                  value={regPais}
                  onChange={(e) => setRegPais(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-950 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                >
                  <option value="">-- Selecciona tu País --</option>
                  <option value="España">España</option>
                  <option value="México">México</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Chile">Chile</option>
                  <option value="Perú">Perú</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Panamá">Panamá</option>
                  <option value="República Dominicana">República Dominicana</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Abjasia">Abjasia</option>
                  <option value="Afganistán">Afganistán</option>
                  <option value="Albania">Albania</option>
                  <option value="Alemania">Alemania</option>
                  <option value="Andorra">Andorra</option>
                  <option value="Angola">Angola</option>
                  <option value="Antigua y Barbuda">Antigua y Barbuda</option>
                  <option value="Arabia Saudita">Arabia Saudita</option>
                  <option value="Argelia">Argelia</option>
                  <option value="Armenia">Armenia</option>
                  <option value="Australia">Australia</option>
                  <option value="Austria">Austria</option>
                  <option value="Azerbaiyán">Azerbaiyán</option>
                  <option value="Bahamas">Bahamas</option>
                  <option value="Bangladés">Bangladés</option>
                  <option value="Barbados">Barbados</option>
                  <option value="Baréin">Baréin</option>
                  <option value="Bélgica">Bélgica</option>
                  <option value="Belice">Belice</option>
                  <option value="Benín">Benín</option>
                  <option value="Bielorrusia">Bielorrusia</option>
                  <option value="Birmania / Myanmar">Birmania / Myanmar</option>
                  <option value="Bosnia y Herzegovina">Bosnia y Herzegovina</option>
                  <option value="Botsuana">Botsuana</option>
                  <option value="Brasil">Brasil</option>
                  <option value="Brunéi">Brunéi</option>
                  <option value="Bulgaria">Bulgaria</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Burundi">Burundi</option>
                  <option value="Bután">Bután</option>
                  <option value="Cabo Verde">Cabo Verde</option>
                  <option value="Camboya">Camboya</option>
                  <option value="Camerún">Camerún</option>
                  <option value="Canadá">Canadá</option>
                  <option value="Catar">Catar</option>
                  <option value="República Centroafricana">República Centroafricana</option>
                  <option value="Chad">Chad</option>
                  <option value="China">China</option>
                  <option value="Chipre">Chipre</option>
                  <option value="Corea del Norte">Corea del Norte</option>
                  <option value="Corea del Sur">Corea del Sur</option>
                  <option value="Costa de Marfil">Costa de Marfil</option>
                  <option value="Croacia">Croacia</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Dinamarca">Dinamarca</option>
                  <option value="Dominica">Dominica</option>
                  <option value="Egipto">Egipto</option>
                  <option value="El Salvador">El Salvador</option>
                  <option value="Emiratos Árabes Unidos">Emiratos Árabes Unidos</option>
                  <option value="Eritrea">Eritrea</option>
                  <option value="Eslovaquia">Eslovaquia</option>
                  <option value="Eslovenia">Eslovenia</option>
                  <option value="Estonia">Estonia</option>
                  <option value="Etiopía">Etiopía</option>
                  <option value="Filipinas">Filipinas</option>
                  <option value="Finlandia">Finlandia</option>
                  <option value="Fiyi">Fiyi</option>
                  <option value="Francia">Francia</option>
                  <option value="Gabón">Gabón</option>
                  <option value="Gambia">Gambia</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Granada">Granada</option>
                  <option value="Grecia">Grecia</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Guinea">Guinea</option>
                  <option value="Guinea-Bisáu">Guinea-Bisáu</option>
                  <option value="Guinea Ecuatorial">Guinea Ecuatorial</option>
                  <option value="Guyana">Guyana</option>
                  <option value="Haití">Haití</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Hungría">Hungría</option>
                  <option value="India">India</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Irak">Irak</option>
                  <option value="Irán">Irán</option>
                  <option value="Irlanda">Irlanda</option>
                  <option value="Islandia">Islandia</option>
                  <option value="Israel">Israel</option>
                  <option value="Italia">Italia</option>
                  <option value="Jamaica">Jamaica</option>
                  <option value="Japón">Japón</option>
                  <option value="Jordania">Jordania</option>
                  <option value="Kazajistán">Kazajistán</option>
                  <option value="Kenia">Kenia</option>
                  <option value="Kirguistán">Kirguistán</option>
                  <option value="Kiribati">Kiribati</option>
                  <option value="Kosovo">Kosovo</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Laos">Laos</option>
                  <option value="Lesoto">Lesoto</option>
                  <option value="Letonia">Letonia</option>
                  <option value="Líbano">Líbano</option>
                  <option value="Liberia">Liberia</option>
                  <option value="Libia">Libia</option>
                  <option value="Liechtenstein">Liechtenstein</option>
                  <option value="Lituania">Lituania</option>
                  <option value="Luxemburgo">Luxemburgo</option>
                  <option value="Macedonia del Norte">Macedonia del Norte</option>
                  <option value="Madagascar">Madagascar</option>
                  <option value="Malasia">Malasia</option>
                  <option value="Malaui">Malaui</option>
                  <option value="Maldivas">Maldivas</option>
                  <option value="Malí">Malí</option>
                  <option value="Malta">Malta</option>
                  <option value="Marruecos">Marruecos</option>
                  <option value="Mauricio">Mauricio</option>
                  <option value="Mauritania">Mauritania</option>
                  <option value="Micronesia">Micronesia</option>
                  <option value="Moldavia">Moldavia</option>
                  <option value="Mónaco">Mónaco</option>
                  <option value="Mongolia">Mongolia</option>
                  <option value="Montenegro">Montenegro</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Namibia">Namibia</option>
                  <option value="Nauru">Nauru</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Níger">Níger</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Noruega">Noruega</option>
                  <option value="Nueva Zelanda">Nueva Zelanda</option>
                  <option value="Omán">Omán</option>
                  <option value="Países Bajos">Países Bajos</option>
                  <option value="Pakistán">Pakistán</option>
                  <option value="Palaos">Palaos</option>
                  <option value="Palestina">Palestina</option>
                  <option value="Papúa Nueva Guinea">Papúa Nueva Guinea</option>
                  <option value="Polonia">Polonia</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Reino Unido">Reino Unido</option>
                  <option value="Ruanda">Ruanda</option>
                  <option value="Rumania">Rumania</option>
                  <option value="Rusia">Rusia</option>
                  <option value="Samoa">Samoa</option>
                  <option value="San Cristóbal y Nieves">San Cristóbal y Nieves</option>
                  <option value="San Marino">San Marino</option>
                  <option value="Santa Lucía">Santa Lucía</option>
                  <option value="Santo Tomé y Príncipe">Santo Tomé y Príncipe</option>
                  <option value="Senegal">Senegal</option>
                  <option value="Serbia">Serbia</option>
                  <option value="Seychelles">Seychelles</option>
                  <option value="Sierra Leona">Sierra Leona</option>
                  <option value="Singapur">Singapur</option>
                  <option value="Siria">Siria</option>
                  <option value="Somalia">Somalia</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Suazilandia">Suazilandia</option>
                  <option value="Sudáfrica">Sudáfrica</option>
                  <option value="Sudán">Sudán</option>
                  <option value="Sudán del Sur">Sudán del Sur</option>
                  <option value="Suecia">Suecia</option>
                  <option value="Suiza">Suiza</option>
                  <option value="Surinam">Surinam</option>
                  <option value="Tailandia">Tailandia</option>
                  <option value="Taiwán">Taiwán</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Tayikistán">Tayikistán</option>
                  <option value="Timor Oriental">Timor Oriental</option>
                  <option value="Togo">Togo</option>
                  <option value="Tonga">Tonga</option>
                  <option value="Trinidad y Tobago">Trinidad y Tobago</option>
                  <option value="Túnez">Túnez</option>
                  <option value="Turkmenistán">Turkmenistán</option>
                  <option value="Turquía">Turquía</option>
                  <option value="Tuvalu">Tuvalu</option>
                  <option value="Ucrania">Ucrania</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Uzbekistán">Uzbekistán</option>
                  <option value="Vanuatu">Vanuatu</option>
                  <option value="Ciudad del Vaticano">Ciudad del Vaticano</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Yemen">Yemen</option>
                  <option value="Yibuti">Yibuti</option>
                  <option value="Zambia">Zambia</option>
                  <option value="Zimbabue">Zimbabue</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Teléfono *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. +34 612 345 678"
                  value={regTelefono}
                  onChange={(e) => setRegTelefono(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Correo Electrónico (Email) *</label>
                <input
                  type="email"
                  required
                  placeholder="Ej. usuario@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                />
                <p className="text-[10px] text-indigo-700 mt-1 font-semibold leading-relaxed">
                  🎯 Medida de seguridad: Solo cuentas de la arquitectura de Gmail (letras, números, puntos, signo más y extensión @gmail.com o @gmail)
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Contraseña *</label>
                <input
                  type="password"
                  required
                  placeholder="Crea una contraseña segura"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Elige Rol Principal *</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setRegRole('investor')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                      regRole === 'investor'
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Registro de Inversor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('model')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                      regRole === 'model'
                        ? 'bg-pink-600 border-pink-600 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Soy Modelo
                  </button>
                </div>
              </div>

              {regRole === 'model' && (
                <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 space-y-2 animate-fade-in">
                  <label className="block text-pink-950 font-bold">Selecciona tu Género *</label>
                  <p className="text-[10px] text-pink-700/80">Selecciona si eres modelo masculino o femenino para asignarte al ranking correspondiente.</p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setRegGender('female')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                        regGender === 'female'
                          ? 'bg-pink-600 border-pink-600 text-white shadow-md shadow-pink-200'
                          : 'bg-white border-pink-200 text-pink-700 hover:bg-pink-50'
                      }`}
                    >
                      👩 Mujer / Femenino
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegGender('male')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                        regGender === 'male'
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'bg-white border-indigo-100 text-indigo-700 hover:bg-indigo-50'
                      }`}
                    >
                      👨 Hombre / Masculino
                    </button>
                  </div>
                </div>
              )}

              {/* Obligatory sponsor choice for new registrations with direct Sponsor ID selection */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <div className="space-y-1">
                  <label className="block text-slate-800 font-semibold">Patrocinador (Sponsor) *</label>
                  <p className="text-[10px] text-slate-500">Elige un patrocinador de la lista o introduce directamente su ID único de afiliación para vincularte.</p>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono block mb-1">Opción A: Elige un Patrocinador del Ranking</span>
                    
                    {/* Buscador de Patrocinadores */}
                    <div className="relative mb-2">
                      <input
                        type="text"
                        placeholder="🔍 Escribe para buscar patrocinador..."
                        value={sponsorSearchQuery}
                        onChange={(e) => setSponsorSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 font-sans"
                      />
                      {sponsorSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setSponsorSearchQuery('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer bg-transparent border-0"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <select
                      value={regSponsorId}
                      onChange={(e) => setRegSponsorId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs focus:outline-none focus:border-indigo-550"
                      id="reg-sponsor-select-dropdown-logged"
                    >
                      <option value="">-- Elige un Patrocinador --</option>
                      {models
                        .filter((model) => {
                          const query = sponsorSearchQuery.trim().toLowerCase();
                          if (!query) return true;
                          return (
                            model.name.toLowerCase().includes(query) ||
                            model.id.toLowerCase().includes(query) ||
                            (model.username && model.username.toLowerCase().includes(query))
                          );
                        })
                        .map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name} (ID: {model.id} - {model.totalLikes} Likes)
                          </option>
                        ))}
                    </select>
                    {sponsorSearchQuery && (
                      <p className="text-[10px] text-indigo-700 mt-1 font-sans">
                        Filtrados {
                          models.filter((m) => {
                            const query = sponsorSearchQuery.trim().toLowerCase();
                            return (
                              m.name.toLowerCase().includes(query) ||
                              m.id.toLowerCase().includes(query) ||
                              (m.username && m.username.toLowerCase().includes(query))
                            );
                          }).length
                        } de {models.length} patrocinadores
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-500 font-mono block mb-1">Opción B: Introduce el ID de tu Sponsor</span>
                    <input
                      type="text"
                      required
                      placeholder="Introduce el ID de tu sponsor (ej: model-1)"
                      value={regSponsorId}
                      onChange={(e) => setRegSponsorId(e.target.value.trim())}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-850 placeholder:text-slate-400 focus:outline-none focus:border-indigo-505 font-mono text-xs"
                      id="reg-sponsor-id-direct-input-logged"
                    />
                  </div>

                  {/* Dynamic Verification of typed ID */}
                  {regSponsorId ? (() => {
                    const matchedModel = models.find(m => m.id.toLowerCase() === regSponsorId.toLowerCase().trim());
                    if (matchedModel) {
                      return (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] animate-fade-in">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>¡Sponsor Válido! <strong>{matchedModel.name}</strong></span>
                          {matchedModel.avatar && (
                            <div className="relative ml-auto shrink-0 mr-1">
                              <img
                                src={matchedModel.avatar}
                                alt={matchedModel.name}
                                referrerPolicy="no-referrer"
                                className="w-7 h-7 rounded-full object-cover border border-emerald-250/60"
                              />
                              <button
                                type="button"
                                onClick={() => setRegSponsorId('')}
                                className="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px] font-black border border-white cursor-pointer select-none shadow-xs transition-colors"
                                title="Eliminar patrocinador"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 border border-red-100 text-red-700 text-[11px] font-mono animate-fade-in">
                          <span className="text-red-600">❌</span>
                          <span>ID de Sponsor no registrado (escribe ej. topm-8, topf-1, o un ID numérico de 11 dígitos como 00000000001)</span>
                        </div>
                      );
                    }
                  })() : null}
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal font-sans">Vínculo verificado de forma segura. En Fashion Finances todos los usuarios se registran bajo un referidor calificado.</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition cursor-pointer text-center"
                >
                  Registrarse
                </button>
              </div>
              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-[11px] text-slate-500">
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setShowRegisterModal(false);
                      setShowLoginModal(true);
                    }}
                    className="text-indigo-600 font-bold hover:underline cursor-pointer bg-transparent border-0 p-0 inline font-sans"
                  >
                    Inicia sesión directamente
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Friends Circle Modal */}
      {showFriendsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 animate-fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 text-white space-y-6 my-8 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Users className="w-5 h-5" />
                  </span>
                  <span>Mi Círculo Social ({friendsList.length + followersList.length + followingList.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Gestiona tus vínculos de amistad, seguidores y modelos que sigues en Fashion Finances.
                </p>
              </div>
              <button
                onClick={() => setShowFriendsModal(false)}
                className="text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 p-2 rounded-xl transition cursor-pointer font-bold text-xs"
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Tabs Selector inside Modal */}
            <div className="flex border-b border-slate-800 p-0.5 bg-slate-950/45 rounded-xl shrink-0">
              <button
                onClick={() => setFriendsActiveTab('friends')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  friendsActiveTab === 'friends'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🤝 Amigos ({friendsList.length})
              </button>
              <button
                onClick={() => setFriendsActiveTab('followers')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  friendsActiveTab === 'followers'
                    ? 'bg-amber-600/90 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📣 Seguidores ({followersList.length})
              </button>
              <button
                onClick={() => setFriendsActiveTab('following')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  friendsActiveTab === 'following'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                👀 Seguidos ({followingList.length})
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="space-y-6 overflow-y-auto pr-1 flex-1">
              
              {/* Part 1: Friends list */}
              {friendsActiveTab === 'friends' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mt-1">
                    Amigos conectados recíprocamente
                  </h4>

                  {friendsList.length === 0 ? (
                    <div className="p-6 text-center bg-slate-950/50 rounded-2xl border border-slate-800 text-xs text-slate-500 italic space-y-1">
                      <p>No tienes amigos en tu círculo todavía.</p>
                      <p className="text-[10px]">Agrega algunos de tus modelos preferidos del catálogo.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {friendsList.map((friend) => (
                        <div
                          key={friend.id}
                          className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between gap-4 transition hover:border-slate-705 shadow-md"
                        >
                          <div 
                            onClick={() => {
                              const modelData = models.find(m => m.username === friend.username || m.id === friend.id);
                              if (modelData) {
                                handleSwitchToModelProfile(modelData);
                                setShowFriendsModal(false);
                              }
                            }}
                            className="flex gap-3 cursor-pointer hover:bg-slate-900/45 p-1 rounded-xl transition duration-150"
                            title="Ver y simular perfil de este usuario"
                          >
                            <div className="relative shrink-0 font-sans">
                              <img
                                src={friend.avatar}
                                alt={friend.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-xl object-cover border border-slate-850"
                              />
                              <span 
                                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                                  friend.online ? 'bg-emerald-500' : 'bg-slate-600'
                                }`} 
                                title={friend.online ? 'En línea' : 'Desconectado'}
                              />
                            </div>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-xs text-slate-100 truncate block hover:text-indigo-400">
                                  {friend.name}
                                </span>
                                <span className="bg-slate-800/85 text-[9px] font-semibold text-indigo-300 font-mono px-1.5 py-0.2 rounded uppercase">
                                  {friend.role}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-450 font-mono">@{friend.username}</span>
                              <p className="text-[10px] text-slate-350 leading-relaxed font-sans line-clamp-2 italic">
                                "{friend.bio}"
                              </p>
                            </div>
                          </div>

                          {/* Interactive Buttons */}
                          <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-slate-800/50 text-[10px]">
                            <button
                              onClick={() => handleMessageFriend(friend.username)}
                              className="bg-slate-800 hover:bg-indigo-600 hover:text-white transition py-1.5 rounded-lg font-semibold cursor-pointer text-center text-slate-200"
                            >
                              💬 Mensaje
                            </button>
                            
                            <button
                              onClick={() => handleGiftFriend(friend.id, friend.name)}
                              className="bg-emerald-600/20 hover:bg-emerald-600 hover:text-white text-emerald-400 transition py-1.5 rounded-lg font-semibold cursor-pointer text-center"
                              title="Enviar regalo de €10.00 ficticios"
                            >
                              🎁 Regalar €10
                            </button>

                            <button
                              onClick={() => handleDeleteFriend(friend.id, friend.name)}
                              className="bg-slate-900 hover:bg-rose-600/35 hover:text-rose-400 text-slate-400 transition py-1.5 rounded-lg font-semibold cursor-pointer text-center"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Part 2: Followers list */}
              {friendsActiveTab === 'followers' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mt-1">
                    Personas que te siguen
                  </h4>

                  {followersList.length === 0 ? (
                    <div className="p-6 text-center bg-slate-950/50 rounded-2xl border border-slate-800 text-xs text-slate-500 italic">
                      No tienes seguidores todavía.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {followersList.map((follower) => {
                        const isFollowingBack = followingList.some(f => f.username === follower.username);
                        return (
                          <div
                            key={follower.id}
                            className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between gap-4 transition hover:border-slate-705 shadow-md"
                          >
                            <div 
                              onClick={() => {
                                const modelData = models.find(m => m.username === follower.username || m.id === follower.id);
                                if (modelData) {
                                  handleSwitchToModelProfile(modelData);
                                  setShowFriendsModal(false);
                                }
                              }}
                              className="flex gap-3 cursor-pointer hover:bg-slate-900/45 p-1 rounded-xl transition duration-155"
                              title="Ver y simular perfil de este usuario"
                            >
                              <div className="relative shrink-0">
                                <img
                                  src={follower.avatar}
                                  alt={follower.name}
                                  referrerPolicy="no-referrer"
                                  className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                                />
                                <span 
                                  className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                                    follower.online ? 'bg-emerald-500' : 'bg-slate-600'
                                  }`} 
                                  title={follower.online ? 'En línea' : 'Desconectado'}
                                />
                              </div>
                              <div className="min-w-0 flex-1 space-y-0.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-xs text-slate-100 truncate block hover:text-indigo-400">
                                    {follower.name}
                                  </span>
                                  <span className="bg-slate-800 text-[9px] font-semibold text-indigo-300 font-mono px-1.5 py-0.2 rounded uppercase">
                                    {follower.role}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">@{follower.username}</span>
                                <p className="text-[10px] text-slate-400 leading-relaxed font-sans line-clamp-2 italic">
                                  "{follower.bio}"
                                </p>
                              </div>
                            </div>

                            {/* Interactive Buttons */}
                            <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-slate-800/50 text-[10px]">
                              <button
                                onClick={() => handleMessageFriend(follower.username)}
                                className="bg-slate-800 hover:bg-indigo-600 hover:text-white transition py-1.5 rounded-lg font-semibold cursor-pointer text-center text-slate-200"
                              >
                                💬 Mensaje
                              </button>
                              
                              <button
                                onClick={() => handleFollowFromFollowers(follower)}
                                className={`transition py-1.5 rounded-lg font-semibold cursor-pointer text-center ${
                                  isFollowingBack 
                                    ? 'bg-slate-900 text-slate-400 hover:text-rose-400' 
                                    : 'bg-amber-600/20 hover:bg-amber-600 hover:text-white text-amber-400'
                                }`}
                              >
                                {isFollowingBack ? '✓ Sigues' : '✨ Seguir'}
                              </button>

                              <button
                                onClick={() => handleGiftFriend(follower.id, follower.name)}
                                className="bg-emerald-600/20 hover:bg-emerald-600 hover:text-white text-emerald-400 transition py-1.5 rounded-lg font-semibold cursor-pointer text-center"
                              >
                                🎁 Regalar €10
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Part 3: Following list */}
              {friendsActiveTab === 'following' && (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono font-bold text-rose-450 uppercase tracking-widest mt-1">
                    Modelos e influencers que tú sigues
                  </h4>

                  {followingList.length === 0 ? (
                    <div className="p-6 text-center bg-slate-950/50 rounded-2xl border border-slate-800 text-xs text-slate-500 italic">
                      No sigues a nadie todavía. ¡Explora el ranking de abajo y haz clic en Seguir!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {followingList.map((followed) => (
                        <div
                          key={followed.id}
                          className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl flex flex-col justify-between gap-4 transition hover:border-slate-705 shadow-md"
                        >
                          <div 
                            onClick={() => {
                              const modelData = models.find(m => m.username === followed.username || m.id === followed.id);
                              if (modelData) {
                                handleSwitchToModelProfile(modelData);
                                setShowFriendsModal(false);
                              }
                            }}
                            className="flex gap-3 cursor-pointer hover:bg-slate-900/45 p-1 rounded-xl transition duration-155"
                            title="Ver y simular perfil de este usuario"
                          >
                            <div className="relative shrink-0">
                              <img
                                src={followed.avatar}
                                alt={followed.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                              />
                              <span 
                                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                                  followed.online ? 'bg-emerald-500' : 'bg-slate-600'
                                }`} 
                                title={followed.online ? 'En línea' : 'Desconectado'}
                              />
                            </div>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-xs text-slate-100 truncate block">
                                  {followed.name}
                                </span>
                                <span className="bg-slate-800 text-[9px] font-semibold text-indigo-300 font-mono px-1.5 py-0.2 rounded uppercase">
                                  {followed.role || 'model'}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-450 font-mono">@{followed.username}</span>
                              <p className="text-[10px] text-slate-350 leading-relaxed font-sans line-clamp-2 italic">
                                "{followed.bio}"
                              </p>
                            </div>
                          </div>

                          {/* Interactive Buttons */}
                          <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-800/50 text-[10px]">
                            <button
                              onClick={() => handleMessageFriend(followed.username)}
                              className="bg-slate-800 hover:bg-slate-700 transition py-1.5 rounded-lg font-semibold cursor-pointer text-center text-slate-200"
                            >
                              💬 Enviar Mensaje
                            </button>
                            
                            <button
                              onClick={() => handleUnfollow(followed.id, followed.name)}
                              className="bg-slate-900 hover:bg-rose-600 hover:text-white text-rose-400 transition py-1.5 rounded-lg font-semibold cursor-pointer text-center"
                            >
                              ❌ Dejar de seguir
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Suggestions to add/simulate adding */}
              <div className="space-y-3 pt-3 border-t border-slate-850">
                <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <span className="animate-pulse text-amber-400">✨</span>
                  <span>Sugerencias: Encuentra más creadores en Fashion Finances</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {models
                    .filter(m => !friendsList.some(f => f.username === m.username))
                    .slice(0, 4)
                    .map((suggested) => {
                      const isSugFollowing = followingList.some(f => f.username === suggested.username);
                      return (
                        <div
                          key={suggested.id}
                          className="bg-slate-950/30 border border-slate-850 p-3.5 rounded-2xl flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={suggested.avatar}
                              alt={suggested.name}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-xl object-cover border border-slate-800"
                            />
                            <div className="min-w-0">
                              <span className="font-semibold text-xs text-slate-200 truncate block">
                                {suggested.name}
                              </span>
                              <span className="text-[9px] text-indigo-400 font-mono">@{suggested.username}</span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleCreateFriend(suggested)}
                              className="px-2.5 py-1.5 rounded-xl bg-indigo-600/25 hover:bg-indigo-600 hover:text-white text-indigo-300 font-semibold text-[10px] transition cursor-pointer shrink-0"
                              title="Agregar como Amigo"
                            >
                              🤝 Amigo
                            </button>
                            <button
                              onClick={() => handleToggleFollow(suggested)}
                              className={`px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition cursor-pointer shrink-0 ${
                                isSugFollowing 
                                  ? 'bg-rose-600 text-white' 
                                  : 'bg-rose-600/20 text-rose-350 hover:bg-rose-600 hover:text-white'
                              }`}
                              title={isSugFollowing ? 'Dejar de seguir' : 'Seguir modelo'}
                            >
                              {isSugFollowing ? '✓ Sigues' : '👀 Seguir'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 text-center flex items-center justify-between">
              <span>Tu Balance actual: <strong className="text-white font-mono">{userProfile ? userProfile.balance.toFixed(2) : '0.00'}€</strong></span>
              <span>La red de relaciones se mantiene guardada localmente.</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Choose / Search Simulation Username Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 sm:p-8 text-slate-900 space-y-5 shadow-2xl transition-all duration-300">
            {showForgotPasswordView ? (
              <>
                <div className="flex justify-between items-start">
                  <div className="space-y-1 text-left">
                    <h3 className="text-base font-bold font-display text-slate-950 flex items-center gap-2">
                      <span className="p-1 px-2 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-sm">🔑</span>
                      <span>Recuperar Contraseña</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Te enviaremos tus datos de acceso al instante por correo electrónico de simulación.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPasswordView(false);
                      setShowLoginModal(false);
                    }}
                    className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-lg transition text-xs font-bold font-sans cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleRequestPasswordByEmail} className="space-y-4 text-left text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">
                      Correo Electrónico (Email) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Introduce tu correo electrónico registrado"
                      value={recoveryEmailInput}
                      onChange={(e) => setRecoveryEmailInput(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl w-full px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs hover:shadow-md transition cursor-pointer text-center"
                    >
                      Enviar Credenciales
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordView(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer text-center"
                    >
                      Volver
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold font-display text-slate-950 flex items-center gap-2">
                      <span className="p-1 px-2 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-sm">🔑</span>
                      <span>Iniciar Sesión en Fashion Finances</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Ingresa tu nombre de usuario y tu contraseña segura para acceder a tu panel.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setLoginPassword('');
                    }}
                    className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-lg transition cursor-pointer font-bold text-xs"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">
                      Nombre de Usuario (Username)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-xs select-none">@</span>
                      <input
                        type="text"
                        required
                        placeholder="ej. sophialoren, ernesto, o tu usuario"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl w-full pl-8 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 tracking-wider">
                      Contraseña (Password)
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl w-full px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition"
                    />
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-[10px] text-slate-600 leading-relaxed font-sans space-y-1.5">
                    <span className="font-semibold text-slate-700 block">💡 Perfiles de simulación disponibles:</span>
                    <div className="space-y-1 font-mono text-[9.5px]">
                      <p>• <strong className="text-indigo-600 font-sans text-xs">ernesto</strong> (Inversor Temprano, password: <strong className="text-slate-700">1234</strong>)</p>
                      <p>• <strong className="text-pink-600 font-sans text-xs">sophialoren</strong> / <strong className="text-pink-600 font-sans text-xs">valentina</strong> (password: <strong className="text-slate-700">1234</strong>)</p>
                      <p>• O introduce <span className="underline">cualquier otro</span> usuario y contraseña para auto-crear un inversor simulado con 100€ de saldo de inmediato.</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition cursor-pointer text-center"
                    >
                      Entrar al Panel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLoginModal(false);
                        setLoginPassword('');
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer text-center"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="text-center pt-2 border-t border-slate-100 font-sans">
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordView(true)}
                      className="text-[11px] text-indigo-600 hover:underline cursor-pointer bg-transparent border-0 p-0 inline font-semibold"
                    >
                      ¿Olvidaste tu contraseña? Solicítala por email
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}      {/* 👥 PÁGINA COMPLETA DE SEGUIDORES / SEGUIDOS / AMIGOS PARA INVERSORES */}
      {activeSocialModalInvestor && (
        <div className="fixed inset-0 bg-[#FDFBF7] z-[120] flex flex-col text-slate-900 animate-fade-in overflow-hidden">
          {/* Header Bar */}
          <div className="bg-white border-b border-slate-150 px-4 py-4 sm:px-6 flex items-center justify-between shadow-xs shrink-0">
            <button
              onClick={() => setActiveSocialModalInvestor(null)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Volver al Perfil</span>
            </button>
            
            <div className="text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Página Social de Cuenta</span>
              <h3 className="text-sm sm:text-base font-black text-slate-950 font-display flex items-center gap-1.5 justify-center">
                {activeSocialModalInvestor === 'friends' ? `Mis Amigos (Cerrado - ${displayedFriends.length})` :
                 activeSocialModalInvestor === 'followers' ? `Mis Seguidores (Inversor - ${displayedFollowers.length})` : 
                 `Perfiles que Sigo (Inversor - ${displayedFollowing.length})`}
              </h3>
            </div>

            <div className="w-24 hidden sm:block text-right">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Usuario</span>
              <span className="text-xs font-bold text-slate-850 truncate block max-w-[100px]">{userProfile?.name || 'Inversor'}</span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto bg-slate-50/50">
            <div className="max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6">
              {/* Cover Info Box */}
              <div className="bg-white p-6 rounded-2xl border border-slate-150/80 shadow-3xs flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left justify-between">
                <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 ${
                    activeSocialModalInvestor === 'friends' ? 'bg-pink-50 border-pink-100 text-pink-600' :
                    activeSocialModalInvestor === 'followers' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 
                    'bg-emerald-50 border-emerald-100 text-emerald-600'
                  }`}>
                    {activeSocialModalInvestor === 'friends' ? <UserPlus2 className="w-7 h-7" /> :
                     activeSocialModalInvestor === 'followers' ? <Users className="w-7 h-7" /> : 
                     <UserCheck className="w-7 h-7" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 leading-tight">
                      {activeSocialModalInvestor === 'friends' ? `Mis Amigos Recíprocos (Inversor - ${displayedFriends.length})` :
                       activeSocialModalInvestor === 'followers' ? `Seguidores en mi Colectivo (${displayedFollowers.length})` : 
                       `Portafolio de creadores que sigo (${displayedFollowing.length})`}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Gestiona tus conexiones, apoya directamente las pasarelas o lanza un canal premium dentro de Fashion Finances.
                    </p>
                  </div>
                </div>
              </div>

              {/* Search input inside full page */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Buscar por nombre, usuario o rol de ${
                    activeSocialModalInvestor === 'friends' ? 'amigo' :
                    activeSocialModalInvestor === 'followers' ? 'seguidor' : 
                    'seguido'
                  }...`}
                  className="w-full bg-white border border-slate-200 shadow-3xs rounded-2xl px-5 py-3.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-500 text-slate-800 placeholder-slate-400 font-medium transition"
                  onChange={(e) => {
                    const val = e.target.value.toLowerCase();
                    const els = document.querySelectorAll('.social-investor-item-row');
                    els.forEach((el: any) => {
                      const txt = el.innerText.toLowerCase();
                      if (txt.includes(val)) {
                        el.style.display = 'flex';
                      } else {
                        el.style.display = 'none';
                      }
                    });
                  }}
                />
              </div>

              {/* Friends/Followers Rows Container */}
              <div className="bg-white rounded-2xl border border-slate-150 shadow-sm divide-y divide-slate-100 overflow-hidden">
                {(() => {
                  const currentList = 
                    activeSocialModalInvestor === 'friends' ? displayedFriends :
                    activeSocialModalInvestor === 'followers' ? displayedFollowers : 
                    displayedFollowing;

                  if (currentList.length === 0) {
                    return (
                      <div className="p-12 text-center text-slate-400 font-medium">
                        No hay perfiles en esta lista todavía.
                      </div>
                    );
                  }

                  return currentList.map(item => (
                    <div key={item.id || item.username} className="social-investor-item-row flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-slate-50/50 transition text-left">
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-slate-150 shrink-0 bg-slate-50"
                        />
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm sm:text-base font-black text-slate-900 truncate leading-tight">{item.name}</h4>
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-lg bg-pink-50/50 border border-pink-100 text-[#fe2c55] tracking-wider shrink-0">
                              {item.role === 'model' ? 'Modelo' : 'Inversor'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-semibold font-mono">@{item.username}</p>
                          <p className="text-xs text-slate-500 font-medium mt-1 leading-snug line-clamp-2 pr-4">{item.bio || 'Mecanismo de afiliación activo.'}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 shrink-0 self-end sm:self-auto">
                        {activeSocialModalInvestor === 'following' && item.role === 'model' && (
                          <button
                            type="button"
                            onClick={() => {
                              const originalModel = models.find(m => m.username === item.username);
                              if (originalModel) {
                                handleToggleFollow(originalModel);
                              } else {
                                const fallbackModel: ModelProfile = {
                                  id: item.id || '',
                                  name: item.name,
                                  username: item.username,
                                  avatar: item.avatar,
                                  bio: item.bio || '',
                                  totalLikes: 0,
                                  followersCount: 0,
                                  referidosCount: 0,
                                  photos: [],
                                  socials: {},
                                  isOnline: true
                                };
                                handleToggleFollow(fallbackModel);
                              }
                            }}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-100 text-rose-600 bg-rose-50/10 hover:bg-rose-50 cursor-pointer transition duration-150"
                          >
                            Dejar de seguir
                          </button>
                        )}
                        
                        {activeSocialModalInvestor === 'followers' && item.role === 'model' && (
                          <button
                            type="button"
                            onClick={() => {
                              const originalModel = models.find(m => m.username === item.username);
                              const actModel: ModelProfile = originalModel || {
                                id: item.id || '',
                                name: item.name,
                                username: item.username,
                                avatar: item.avatar,
                                bio: item.bio || '',
                                totalLikes: 0,
                                followersCount: 0,
                                referidosCount: 0,
                                photos: [],
                                socials: {},
                                isOnline: true
                              };
                              handleToggleFollow(actModel);
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition duration-150 cursor-pointer ${
                              followingList.some(f => f.username === item.username)
                                ? 'bg-slate-100 border-slate-200 text-slate-500'
                                : 'bg-indigo-600 border-indigo-605 text-white hover:bg-indigo-700'
                            }`}
                          >
                            {followingList.some(f => f.username === item.username) ? 'Siguiendo ✓' : 'Seguir de vuelta'}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            alert(`Interacción social completada con éxito. Se ha enviado un saludo virtual a ${item.name}.`);
                            setActiveSocialModalInvestor(null);
                          }}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white transition cursor-pointer"
                        >
                          Saludar
                        </button>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6 text-slate-500 mt-12 max-md:hidden shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-150 p-1 rounded-2xl shadow-3xs flex items-center justify-center transition-transform hover:scale-105">
              <FashionsFinanceLogo mode="light" className="w-12 h-12 bg-white" />
            </div>
            <span className="font-extrabold text-xs tracking-wider uppercase text-black font-display">Fashion Finances Inc.</span>
          </div>
          <p className="text-slate-450 font-medium">© 2026 Fashion Finances Platform. Licencia Pública de Distribución Tecnológica.</p>
        </div>
      </footer>

      {/* 📱 VENTANA AMPLIADA GLOBAL PARA IMÁGENES EN VISTA MÓVIL */}
      <GlobalMobileImageLightbox />
    </div>
  );
}
