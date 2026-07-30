import React, { useState, useEffect } from 'react';
import { InvestmentSession, ParticipantState, ModelProfile, ProjectData, UserSessionProfile, FinancialMovement } from '../types';
import { seedInitialData } from '../utils/seedData';
import SessionResultsPodium from './SessionResultsPodium';
import { 
  Play, 
  Sparkles, 
  Award, 
  FileText, 
  Check, 
  AlertCircle, 
  Clock, 
  Coins, 
  X, 
  Users, 
  Star, 
  ArrowRight, 
  CheckCircle2,
  Trophy,
  Terminal,
  Cpu,
  ShieldCheck,
  Hourglass,
  ChevronRight,
  ChevronLeft,
  Wallet,
  Lock,
  Crown,
  ThumbsUp,
  Calendar,
  RefreshCw,
  Trash2
} from 'lucide-react';

interface SessionSimulatorProps {
  key?: string;
  sessions: InvestmentSession[];
  userProjects: ProjectData[];
  userProfile: UserSessionProfile;
  models: ModelProfile[];
  historyWonLog?: { id: string; title: string; prize: number; date: string; projectId?: string; projectName?: string }[];
  onUpdateSessions: (sessions: InvestmentSession[]) => void;
  onUpdateProfile: (profile: UserSessionProfile) => void;
  onAddMovement: (movement: FinancialMovement) => void;
  onAddSystemHistory: (session: InvestmentSession, won: boolean, totalPrize: number) => void;
  onNavigateToTab?: (tab: 'home' | 'finance' | 'sessions' | 'create_project' | 'chat' | 'profile' | 'patrocinados' | 'saved_projects' | 'casting_live') => void;
  onSelectModel?: (model: ModelProfile) => void;
}

interface SessionTheme {
  background: string;
  badge: string;
  accentText: string;
  progressBarColor: string;
  tierSlogan: string;
  cardShadow: string;
}

const getSessionTheme = (entryFee: number, isSelected: boolean): SessionTheme => {
  if (isSelected) {
    if (entryFee === 10) {
      return {
        background: 'bg-slate-900 border-slate-300 ring-2 ring-slate-400/30 text-white',
        badge: 'bg-slate-800 text-slate-100 border-slate-600',
        accentText: 'text-slate-300',
        progressBarColor: 'bg-slate-300',
        tierSlogan: 'Ronda de Plata • Trabajadores',
        cardShadow: 'shadow-md lg:shadow-indigo-500/10 scale-[1.025]',
      };
    } else if (entryFee === 100) {
      return {
        background: 'bg-slate-900 border-amber-600/80 ring-2 ring-amber-600/30 text-white',
        badge: 'bg-amber-950/40 text-amber-300 border-amber-800/50',
        accentText: 'text-amber-400 font-bold',
        progressBarColor: 'bg-amber-550',
        tierSlogan: 'Ronda de Bronce • Emprendedores',
        cardShadow: 'shadow-md lg:shadow-amber-500/10 scale-[1.025]',
      };
    } else if (entryFee === 1000) {
      return {
        background: 'bg-slate-900 border-slate-400 ring-2 ring-slate-400/30 text-white',
        badge: 'bg-slate-800 text-slate-100 border-slate-700',
        accentText: 'text-slate-200 font-bold',
        progressBarColor: 'bg-slate-400',
        tierSlogan: 'Ronda de Acero • Empresarios',
        cardShadow: 'shadow-md lg:shadow-slate-500/10 scale-[1.025]',
      };
    } else if (entryFee === 10000) {
      return {
        background: 'bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950 border-amber-400 ring-2 ring-amber-400/40 text-white',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        accentText: 'text-amber-300 font-black',
        progressBarColor: 'bg-amber-400',
        tierSlogan: '✨ Ronda de Oro • Top Models',
        cardShadow: 'shadow-xl shadow-amber-500/10 scale-[1.03]',
      };
    } else if (entryFee === 100000) {
      return {
        background: 'bg-gradient-to-br from-slate-950 via-rose-950/20 to-slate-950 border-rose-400 ring-2 ring-rose-400/40 text-white',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        accentText: 'text-rose-300 font-black',
        progressBarColor: 'bg-rose-400',
        tierSlogan: '🌸 Ronda Oro Rosa • Inversores',
        cardShadow: 'shadow-xl shadow-rose-500/10 scale-[1.03]',
      };
    } else {
      return {
        background: 'bg-gradient-to-br from-black via-slate-900 to-black border-amber-300 ring-2 ring-amber-300/45 text-white',
        badge: 'bg-gradient-to-r from-amber-500/15 to-teal-500/15 text-amber-300 border-amber-400/30',
        accentText: 'text-amber-400 font-black bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent',
        progressBarColor: 'bg-gradient-to-r from-amber-400 to-amber-200',
        tierSlogan: '👑 Ronda Platino • Millonarios',
        cardShadow: 'shadow-2xl shadow-amber-500/20 scale-[1.035]',
      };
    }
  } else {
    if (entryFee === 10) {
      return {
        background: 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-800',
        badge: 'bg-slate-200 text-slate-600 border-transparent',
        accentText: 'text-slate-600',
        progressBarColor: 'bg-slate-400',
        tierSlogan: 'Ronda de Plata',
        cardShadow: 'shadow-sm hover:shadow-md hover:-translate-y-0.5',
      };
    } else if (entryFee === 100) {
      return {
        background: 'bg-[#faf6f0] hover:bg-[#f5ece0] border-amber-200 hover:border-amber-300 text-slate-800',
        badge: 'bg-amber-100/60 text-amber-800 border-amber-200/50',
        accentText: 'text-amber-700',
        progressBarColor: 'bg-amber-600',
        tierSlogan: 'Ronda de Bronce',
        cardShadow: 'shadow-sm hover:shadow-md hover:-translate-y-0.5',
      };
    } else if (entryFee === 1000) {
      return {
        background: 'bg-slate-100/70 hover:bg-slate-150 border-slate-300 hover:border-slate-400 text-slate-800',
        badge: 'bg-slate-200 text-slate-700 border-transparent',
        accentText: 'text-slate-700',
        progressBarColor: 'bg-slate-500',
        tierSlogan: 'Ronda de Acero',
        cardShadow: 'shadow-sm hover:shadow-md hover:-translate-y-0.5',
      };
    } else if (entryFee === 10000) {
      return {
        background: 'bg-[#fdf9f4] hover:bg-[#fbf3e7] border-amber-200 hover:border-[#edd0aa] text-slate-800',
        badge: 'bg-[#fcf1df] text-amber-800 border-amber-200/50',
        accentText: 'text-amber-700 font-semibold',
        progressBarColor: 'bg-amber-500',
        tierSlogan: 'Mesa de Top Models',
        cardShadow: 'shadow-[0_4px_12px_-2px_rgba(217,119,6,0.05)] hover:shadow-[0_8px_20px_-3px_rgba(217,119,6,0.12)] hover:-translate-y-0.5',
      };
    } else if (entryFee === 100000) {
      return {
        background: 'bg-[#fdf6f6] hover:bg-[#fbeaea] border-[#fcdadb] hover:border-[#f5b8ba] text-slate-800',
        badge: 'bg-[#fae3e4] text-rose-800 border-[#f8c9cb]/50',
        accentText: 'text-rose-700 font-semibold',
        progressBarColor: 'bg-rose-500',
        tierSlogan: 'Mesa de Inversores',
        cardShadow: 'shadow-[0_4px_12px_-2px_rgba(244,63,94,0.05)] hover:shadow-[0_8px_20px_-3px_rgba(244,63,94,0.12)] hover:-translate-y-0.5',
      };
    } else {
      return {
        background: 'bg-gradient-to-b from-[#faf9f6]/95 to-[#f7f4ee]/95 border-amber-300 hover:border-amber-400 text-slate-900',
        badge: 'bg-[#fef8eb] text-amber-800 border-amber-200',
        accentText: 'text-amber-800 font-heavy bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent',
        progressBarColor: 'bg-amber-500',
        tierSlogan: 'Mesa de Millonarios',
        cardShadow: 'shadow-[0_6px_15px_-3px_rgba(217,119,6,0.06)] hover:shadow-[0_12px_28px_-4px_rgba(217,119,6,0.15)] hover:-translate-y-0.5',
      };
    }
  }
};

const SponsorSlider = ({ images, modelName }: { images: string[]; modelName?: string }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-slate-700 shrink-0 shadow-xl bg-slate-950 group">
      <img 
        src={images[activeIndex]} 
        alt={modelName ? `Fotos seleccionadas de ${modelName}` : `Foto de patrocinio ${activeIndex + 1}`} 
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      
      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900/90 text-white hover:bg-slate-850 hover:scale-110 active:scale-95 transition cursor-pointer border border-slate-700/80 flex items-center justify-center shadow-lg z-20"
            title="Foto anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-amber-400" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900/90 text-white hover:bg-slate-850 hover:scale-110 active:scale-95 transition cursor-pointer border border-slate-700/80 flex items-center justify-center shadow-lg z-20"
            title="Próxima foto"
          >
            <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </>
      )}
      
      {/* Counter indicator */}
      <div className="absolute bottom-1.5 right-1.5 bg-slate-950/80 border border-slate-800/80 px-1.5 py-0.5 rounded text-[8px] font-mono text-amber-400 font-bold tracking-wider z-20 leading-none">
        {activeIndex + 1}/{images.length}
      </div>
    </div>
  );
};

const WinnerProjectSlider = ({ images }: { images: string[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full max-w-xl sm:max-w-2xl mx-auto bg-white border border-pink-200 rounded-2xl p-4 flex flex-col space-y-3 relative shadow-md">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase text-slate-800 font-sans tracking-tight">
            Gallery of images from the winning project
          </span>
        </div>
        <span className="text-[9px] font-mono text-slate-500 font-black bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
          Carrusel de 3 vistas
        </span>
      </div>
      
      {/* 3 Images Viewport side-by-side with arrows */}
      <div className="relative w-full">
        <div className="grid grid-cols-3 gap-2 w-full">
          {[0, 1, 2].map((offset) => {
            const imgIndex = (activeIndex + offset) % images.length;
            const imgUrl = images[imgIndex];
            return (
              <div 
                key={offset} 
                className="relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-100 bg-slate-50 group shadow-2xs transition-all duration-300 hover:shadow-md cursor-pointer"
                onClick={() => setActiveIndex(imgIndex)}
              >
                <img 
                  src={imgUrl} 
                  alt={`Proyecto Imagen de Alta Costura ${imgIndex + 1}`} 
                  className="w-full h-full object-cover transition-all duration-350 transform hover:scale-[1.03]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-2 py-0.5 rounded-full font-bold select-none pointer-events-none">
                  {imgIndex + 1}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Navigation Arrows */}
        {images.length > 3 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-800 opacity-95 hover:opacity-100 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-pink-150 flex items-center justify-center shadow-md z-20"
              title="Imagen de alta costura anterior"
            >
              <ChevronLeft className="w-4 h-4 text-rose-600" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-800 opacity-95 hover:opacity-100 hover:scale-105 active:scale-95 transition-all cursor-pointer border border-pink-150 flex items-center justify-center shadow-md z-20"
              title="Siguiente imagen de alta costura"
            >
              <ChevronRight className="w-4 h-4 text-rose-600" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails list below */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 py-0.5 overflow-x-auto">
          {images.map((img, idx) => {
            const isVisible = [0, 1, 2].some(offset => (activeIndex + offset) % images.length === idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`w-11 h-8 rounded overflow-hidden border transition-all ${
                  isVisible ? 'border-rose-500 scale-102 ring-1 ring-rose-500/30' : 'border-slate-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default function SessionSimulator({
  sessions,
  userProjects,
  userProfile,
  models,
  historyWonLog = [],
  onUpdateSessions,
  onUpdateProfile,
  onAddMovement,
  onAddSystemHistory,
  onNavigateToTab,
  onSelectModel
}: SessionSimulatorProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [enrollProjectId, setEnrollProjectId] = useState<string>('');

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>, name: string) => {
    const target = e.currentTarget;
    const nameLower = name.toLowerCase();
    
    // Guard against infinite loops if the fallback image also fails to load
    if (target.getAttribute('data-error-tried') === 'true') {
      // Final resilient inline SVG fallback representing a generic profile avatar
      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ec4899'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
      return;
    }
    target.setAttribute('data-error-tried', 'true');

    if (nameLower.includes('amara')) {
      target.src = 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=300';
    } else if (nameLower.includes('mia')) {
      target.src = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150';
    } else if (nameLower.includes('oliver')) {
      target.src = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150';
    } else if (nameLower.includes('sophia')) {
      target.src = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150';
    } else if (nameLower.includes('dante')) {
      target.src = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150';
    } else if (nameLower.includes('kenji')) {
      target.src = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150';
    } else if (nameLower.includes('isabella')) {
      target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150';
    } else if (nameLower.includes('marcus')) {
      target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150';
    } else if (nameLower.includes('liam')) {
      target.src = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150';
    } else {
      target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
    }
  };
  const [votingProjectIndex, setVotingProjectIndex] = useState<number>(0);

  // --- Automated Scheduler State Machinery ---
  const [scheduledOrders, setScheduledOrders] = useState<any[]>([]);
  const [showSchedulerPanel, setShowSchedulerPanel] = useState<boolean>(false);
  const [schedEntryFee, setSchedEntryFee] = useState<number>(1000);
  const [schedRecurrence, setSchedRecurrence] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [schedProjectId, setSchedProjectId] = useState<string>('');
  const [schedTime, setSchedTime] = useState<string>(() => {
    const future = new Date(Date.now() + 5 * 60 * 1000); // 5 mins ahead by default
    const tzoffset = future.getTimezoneOffset() * 60000;
    return new Date(future.getTime() - tzoffset).toISOString().slice(0, 16);
  });
  const [isSyncingOrders, setIsSyncingOrders] = useState<boolean>(false);
  const [orderNotification, setOrderNotification] = useState<string | null>(null);

  const getParticipantProjectMeta = (part: ParticipantState): ProjectData => {
    const isUserSelf = part.userId === userProfile.id;
    const presetProjects: Record<string, Partial<ProjectData>> = {
      'isabella dubois': {
        title: "Atelier Dubois: Haute Couture Éco-Responsable",
        category: "Alta Costura & Diseño",
        descriptionShort: "Colección exclusiva de vestidos de gala biodegradables confeccionados a partir de hilos de seda orgánica y tintures botánicas.",
        descriptionLong: "Atelier Dubois redefine el lujo textil mediante un modelo de alta costura circular certificado bajo estándares GOTS. Cada vestido se esculpe y tiñe a mano utilizando compuestos florales silvestres locales y un empaque de biopolímero 100% hidro-soluble, reduciendo de forma drástica la contaminación textil e impulsando la artesanía local francesa.",
        budget: 15000,
        fundingGoal: 20000,
        objective: "Confeccionar y presentar la primera línea cápsula en la semana de la alta costura de París, promoviendo vestidos de gala ecológicos de impacto cero de carbono.",
        fundUsage: "70% compra de insumos textiles orgánicos certificados y remuneración del personal de taller local, 20% relaciones públicas y marketing digital, 10% distribución sostenible de empaque.",
        timeline: "Fase 1: Curaduría de fibras y tintado ecológico. Fase 2: Patronaje y sastrería de gala a mano. Fase 3: Desfile oficial y pre-ventas editoriales.",
        contactEmail: "atelier.dubois@fashionfinances.net",
        contactPhone: "+33 6 4531 2901",
        budgetBreakdown: "Materiales Orgánicos Certificados (Seda GOTS): 5.500€\nTaller de Confección & Remuneración Ética: 5.000€\nFotografías Editoriales y Casting: 2.500€\nPrensa y Posicionamiento Digital: 2.000€"
      },
      'sophia loren': {
        title: "Milano Vintage Denim: Upcycling de Lujo",
        category: "Upcycling & Sostenibilidad",
        descriptionShort: "Reestructuración artesanal y customización de mezclilla retro clásica de archivo en la región de Lombardía.",
        descriptionLong: "Bajo la consigna de residuo cero, Milano Vintage Denim adquiere vaqueros de archivo clásicos de algodón puro y los desensambla a mano en la capital de la moda para construir chaquetas elegantes y corsés vanguardistas de edición ultra-limitada. Uniendo la historia de la mezclilla con la estética de pasarela.",
        budget: 8500,
        fundingGoal: 11000,
        objective: "Montar un taller modelo de upcycling colaborativo en Milán y lanzar la plataforma de comercio electrónico internacional.",
        fundUsage: "45% abastecimiento y curaduría de inventario denim clásico de alta calidad, 40% sastrería artesanal fina, 15% producción de portafolio conceptual e-commerce.",
        timeline: "Paso 1: Adquisición selectiva de mezclilla GOTS clásica. Paso 2: Diseño estructural en panel. Paso 3: Lanzamiento piloto online.",
        contactEmail: "sophia.loren.vintage@fashionfinances.net",
        contactPhone: "+39 02 4432 9901",
        budgetBreakdown: "Inventario Vaquero de Archivo Seleccionado: 3.500€\nManufactura en Sastrería de Milán: 3.000€\nPlataforma de E-commerce & Pasarela Segura: 2.000€"
      },
      'marcus sterling': {
        title: "Sartorial Aero-Weave: Trajes Inteligentes",
        category: "Sastrería Tecnológica",
        descriptionShort: "Trajes premium termo-regulados y repelentes a manchas confeccionados con compuestos de cáñamo.",
        descriptionLong: "Elegancia masculina sin precedentes adaptada al clima urbano. Aero-Weave desarrolla sastrería formal de lujo utilizando una trama ecológica que difunde la temperatura corporal óptima y resiste vertidos hídricos sin emplear agentes plásticos. Trajes para viajar cómodamente.",
        budget: 25000,
        fundingGoal: 30000,
        objective: "Perfeccionar el algoritmo de escaneo digital 3D móvil a medida para entregas automatizadas en 72 horas.",
        fundUsage: "60% adquisición de textiles inteligentes eco-responsables, 25% desarrollo y calibración del software móvil de confección, 15% transporte.",
        timeline: "Lanzamiento 1: Ensayo en taller y entrega a probadores beta. Lanzamiento 2: Integración en app móvil. Lanzamiento 3: Campaña de fidelización.",
        contactEmail: "marcus.sterling@aeroweave.com",
        contactPhone: "+44 20 7946 0192",
        budgetBreakdown: "Adquisición de Patentes de Tela Bioclimática: 15.000€\nIngeniería de Tallaje Computarizado en 3D: 6.000€\nCampañas de Prensa & RRPP Ejecutivas: 4.000€"
      },
      'liam alvarez': {
        title: "Myco-Sneakers: Calzado 3D Orgánico",
        category: "Calzado de Vanguardia",
        descriptionShort: "Zapatillas deportivas impresas en 3D con poliuretano de base fúngica flexible y compostable.",
        descriptionLong: "La iniciativa Myco-Sneakers diseña calzado deportivo de vanguardia a partir de hilos elásticos de micelio de hongo lignificado. Garantiza una amortiguación física ergonómica fantástica, y al final de su vida útil se composta en tierra vegetal de jardín en solo seis meses libres de plástico.",
        budget: 12000,
        fundingGoal: 15000,
        objective: "Completar los ensayos mecánicos de impacto en planta y comercializar el primer lote de 500 pares beta.",
        fundUsage: "50% optimización y acondicionamiento mecánico de impresoras 3D industriales, 30% ensayos de laboratorio sobre biodegradabilidad, 20% posicionamiento digital.",
        timeline: "Fase A: Ajuste de flexión elástica fúngica. Fase B: Fabricación de moldes 3D. Fase C: Campaña viral y envíos iniciales.",
        contactEmail: "liam.alvarez@mycosneakers.io",
        contactPhone: "+34 601 234 567",
        budgetBreakdown: "Maquinaria de Extrusión 3D Industrial: 6.000€\nEnsayos de Laboratorio & Certificaciones: 3.500€\nMarketing Viral Multicanal: 2.500€"
      },
      'mia kincaid': {
        title: "Nordic Frost: Abrigos de Cáñamo y Alpaca",
        category: "Ropa de Abrigo Premium",
        descriptionShort: "Gabardinas y prendas de invierno termo-aislantes rellenas de cáñamo silvestre procesado libre de plásticos.",
        descriptionLong: "Abrigos de invierno de alto rendimiento diseñados para mitigar temperaturas bajo cero sin requerir rellenos plásticos ni poliéster sintético. Capa interna compuesta por lana de alpaca de comercio justo que conserva las propiedades transpirables e impermeables.",
        budget: 18000,
        fundingGoal: 22000,
        objective: "Exponer la línea cápsula invernal en las ferias comerciales internacionales de Copenhague y Estocolmo.",
        fundUsage: "55% hilatura ética y de abastecimiento andino, 30% pruebas hídricas con cámara de frío, 15% publicidad sostenible en redes de diseño.",
        timeline: "Periodo 1: Adquisición ética de lana de alpaca y extracción de cáñamo. Periodo 2: Producción cápsula. Periodo 3: Ferias y ventas.",
        contactEmail: "mia.kincaid@nordicfrost.se",
        contactPhone: "+46 8 123 4567",
        budgetBreakdown: "Fibras de Alpaca & Logística Ética: 9.000€\nSimulación Climática & Pruebas en Cámara: 5.000€\nCreación de Marca Internacional: 4.000€"
      },
      'oliver finch': {
        title: "Echo Circular: Modas Desmontables",
        category: "Moda Modular & Circular",
        descriptionShort: "Colección urbana modular de paneles intercambiables con broches de aluminio reciclado.",
        descriptionLong: "Combatimos la sobreproducción textil ofreciendo una única chaqueta estructural convertible en chaleco ligero o gabardina ejecutiva según se añadan o remuevan sus módulos. Confeccionada con lino orgánico europeo y herrajes reciclables de precisión.",
        budget: 14000,
        fundingGoal: 16500,
        objective: "Consolidar el desarrollo de broche modular patentado y automatizar el muestrario digital.",
        fundUsage: "50% fabricación de cierres de metal y sastrería de lino reforzado, 30% desarrollo técnico de visualización 3D, 20% embalaje compostable.",
        timeline: "Fase 1: Matricería de broches. Fase 2: Confección de muestras híbridas. Fase 3: Lanzamiento comercial.",
        contactEmail: "oliver.finch@echocircular.co.uk",
        budgetBreakdown: "Diseño & Matricería de Cierres de Precisión: 7.000€\nMateriales Termo-Sellados e Hilos de Alta Tenacidad: 4.500€\nDesarrollo Web de Realidad Virtual Muestrario: 2.500€"
      },
      'amara okafor': {
        title: "Afro-Heritage AvantGarde",
        category: "Couture Cultural de Impacto",
        descriptionShort: "Alta costura de gala elaborada con textiles tradicionales Adire creados por artesanas nigerianas.",
        descriptionLong: "Fomentamos la economía local de cooperativas de artesanas de tintura índigo en Nigeria rindiendo tributo a sus técnicas históricas. Reconvertimos tejidos Adire en trajes majestuosos asimétricos diseñados para impactar en las pasarelas globales de lujo.",
        budget: 16000,
        fundingGoal: 18000,
        objective: "Financiar el pago directo y transporte de 45 costureras locales nigerianas y lanzar la marca en la bienal de Milán.",
        fundUsage: "65% retribución justa y logística cooperativa directa, 25% acabados de alta costura a mano en taller asociado de Madrid, 10% campaña institucional.",
        timeline: "Fase A: Producción comunitaria en Lagos. Fase B: Confección de siluetas asimétricas. Fase C: Presentación oficial.",
        contactEmail: "amara.okafor@afroheritage.org",
        budgetBreakdown: "Logística y Compensación Directa Cooperativa: 9.500€\nPatronaje & Armado de Siluetas de Gala: 4.500€\nCampañas y Eventos Editoriales de Presentación: 2.000€"
      },
      'julian brooks': {
        title: "Vino-Leather: Marroquinería de Uva",
        category: "Marroquinería Premium Vegana",
        descriptionShort: "Bolsos de mano ejecutivos y monederos premium creados a partir de descarte de uvas de viñedos ecológicos.",
        descriptionLong: "Alternativa premium de alta definición libre de piel animal, fabricada a partir de cáscaras y semillas de uva u orujo obtenido de bodegas biodinámicas en España. Un material impermeable de textura clásica espectacular que rivaliza con el mejor cuero vacuno.",
        budget: 11000,
        fundingGoal: 13500,
        objective: "Consolidar el primer taller piloto de corte digital láser y costura de bolsos premium de piel vegetal.",
        fundUsage: "45% abastecimiento y refinamiento del cuero vegetal español, 40% manufactura artesana en Elche, 15% empaquetado de madera noble recuperada.",
        timeline: "Fase 1: Curtido ecológico de uva. Fase 2: Costura artesana de precisión. Fase 3: Comercialización directa.",
        contactEmail: "julian.brooks@vinoleather.es",
        contactPhone: "+34 912 345 678",
        budgetBreakdown: "Adquisición de Rollos de Cuero de Uva Orgánica: 4.500€\nManufactura Artesanal & Costura Especializada: 3.500€\nHerrajes de Precisión e Hilos Eco-Sostenibles: 3.000€"
      }
    };

    const userKey = part.name.toLowerCase();
    const matchedPreset = presetProjects[userKey] || Object.values(presetProjects).find(p => p.title?.toLowerCase().includes(userKey)) || {};

    return isUserSelf && userProjects.length > 0
      ? (userProjects.find(p => p.id === part.projectId) || userProjects[0])
      : {
          id: part.projectId || `proj-sim-${part.userId}`,
          userId: part.userId,
          title: matchedPreset.title || `Colección Sustentable - ${part.name}`,
          category: matchedPreset.category || 'Moda Circular Avanzada',
          descriptionShort: matchedPreset.descriptionShort || `Fórmula de diseño ecológico, optimización textil y proyección cruzada de marca.`,
          descriptionLong: matchedPreset.descriptionLong || `Este proyecto estratégico busca mitigar la generación de desechos textiles mediante metodologías de confección de residuo cero con siluetas versátiles y minimalistas.`,
          budget: matchedPreset.budget || 5000,
          fundingGoal: matchedPreset.fundingGoal,
          objective: matchedPreset.objective || `Maximizar el atractivo comercial e impacto social de la colección en mesas de inversión.`,
          fundUsage: matchedPreset.fundUsage || '75% abastecimiento ético de tejidos locales, 25% promoción interactiva e-commerce.',
          timeline: matchedPreset.timeline || 'Consagrado en 3 fases: Abastecimiento y diseño ecológico de patrones; Montaje de la colección cápsula; Lanzamiento global.',
          team: [{ name: part.name, role: 'Líder del Proyecto', experience: '5 años de trayectoria' }],
          termsAccepted: true,
          images: [part.avatar],
          status: 'active',
          contactEmail: matchedPreset.contactEmail || `${part.name.toLowerCase().replace(/\s+/g, '.')}@fashionfinances.net`,
          contactPhone: matchedPreset.contactPhone || '+34 600 555 123',
          budgetBreakdown: matchedPreset.budgetBreakdown || 'Compra de Fibras Naturales: 2.000€\nTaller de Sastrería Sostenible: 2.000€\nMarketing & Posicionamiento: 1.000€'
        };
  };

  // Poll scheduled orders from the backend every 5 seconds
  useEffect(() => {
    if (!userProfile || userProfile.role === 'visitor') return;

    const fetchScheduledOrders = async () => {
      try {
        const res = await fetch('/api/scheduled-orders');
        if (!res.ok) throw new Error('Failed to fetch scheduled orders');
        const data = await res.json();
        setScheduledOrders(data);

        // Filter orders that are marked as 'executed' and belong to this user
        const pendingApplications = data.filter((order: any) => 
          order.status === 'executed' && 
          order.userId === userProfile.id
        );

        if (pendingApplications.length > 0) {
          await handleApplyExecutedOrders(pendingApplications);
        }
      } catch (err) {
        console.error('Error in schedules background poll:', err);
      }
    };

    fetchScheduledOrders();
    const interval = setInterval(fetchScheduledOrders, 5000);
    return () => clearInterval(interval);
  }, [userProfile, sessions, userProjects]);

  // Synchronize backend execution state with local user portfolio state
  const handleApplyExecutedOrders = async (executedOrders: any[]) => {
    let updatedSessions = [...sessions];
    let nextBalance = userProfile.balance;
    let nextInvested = userProfile.totalInvested;
    let appliedCount = 0;
    
    for (const order of executedOrders) {
      if (nextBalance < order.entryFee) {
        console.warn(`[Auto-Investor] Order ${order.id} skipped due to insufficient balance.`);
        setOrderNotification(`⚠️ Inversión Automática Fallida: Saldo insuficiente (${nextBalance.toFixed(2)}€) para ejecutar tu ronda de ${order.entryFee}€.`);
        try {
          await fetch(`/api/scheduled-orders/${order.id}`, { method: 'DELETE' });
        } catch (e) {}
        continue;
      }

      const sessionCategory = order.entryFee === 10 
        ? 'Trabajadores' 
        : order.entryFee === 100 
          ? 'Emprendedores' 
          : order.entryFee === 1000 
            ? 'Empresarios'
            : order.entryFee === 10000
              ? 'Top Models'
              : order.entryFee === 100000
                ? 'Inversores'
                : 'Millonarios';

      // Check if this project is already participating in any active session (filling or voting)
      const isProjectAlreadyInActiveSession = updatedSessions.some(s => 
        (s.status === 'filling' || s.status === 'voting') && 
        s.participants.some(p => p.projectId === order.projectId)
      );

      if (isProjectAlreadyInActiveSession) {
        console.warn(`[Auto-Investor] Order ${order.id} skipped because project ${order.projectName} is already active in a session.`);
        if (!notifiedSkippedOrders.includes(order.id)) {
          setNotifiedSkippedOrders(prev => [...prev, order.id]);
          setOrderNotification(`⏳ Inversión Programada en Espera: Tu proyecto "${order.projectName}" ya está participando activamente en una mesa. Se ingresará en la mesa de ${sessionCategory} una vez liberado.`);
        }
        continue;
      }

      let matchedSession = updatedSessions.find(s => s.entryFee === order.entryFee && s.status === 'filling');
      
      if (!matchedSession || matchedSession.participants.length >= 10) {
        const uniqueNewId = `sess-auto-${Date.now()}-${Math.floor(Math.random() * 1002)}`;
        matchedSession = {
          id: uniqueNewId,
          title: `Sesión de Inversión de ${sessionCategory} - R-${Math.floor(Date.now() % 1005)}`,
          entryFee: order.entryFee,
          status: 'filling',
          participants: [],
          timeLeft: 1200,
          createdAt: new Date().toISOString(),
          poolTotal: 0
        };
        updatedSessions.push(matchedSession);
      }

      const alreadyJoined = matchedSession.participants.some(p => p.userId === userProfile.id);
      if (!alreadyJoined) {
        const newPart: ParticipantState = {
          userId: userProfile.id,
          name: userProfile.name,
          avatar: userProfile.avatar,
          projectId: order.projectId,
          votesReceived: 0,
          hasVoted: false
        };
        matchedSession.participants = [...matchedSession.participants, newPart];
        matchedSession.poolTotal = matchedSession.participants.length * matchedSession.entryFee;
        
        if (matchedSession.participants.length >= 10) {
          matchedSession.status = 'voting';
          matchedSession.timeLeft = 1200;
        }
      }

      nextBalance -= order.entryFee;
      nextInvested += order.entryFee;

      try {
        const applyRes = await fetch(`/api/scheduled-orders/${order.id}/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (applyRes.ok) {
          onAddMovement({
            id: `mov-auto-join-${Date.now()}-${order.id}`,
            userId: userProfile.id,
            type: 'investment',
            amount: -order.entryFee,
            date: new Date().toISOString(),
            description: `🤖 Inversión Automatizada - Entrada programada en Mesa ${sessionCategory}`,
            projectName: order.projectName
          });
          appliedCount++;
          setOrderNotification(`🚨 ¡Autoinversión Activada! Se han invertido ${order.entryFee}€ en la Mesa de ${sessionCategory} con tu proyecto "${order.projectName}" automáticamente en segundo plano.`);
        }
      } catch (err) {
        console.error(`Error marking order ${order.id} as applied:`, err);
      }
    }

    if (appliedCount > 0) {
      onUpdateSessions(updatedSessions);
      onUpdateProfile({
        ...userProfile,
        balance: nextBalance,
        totalInvested: nextInvested
      });
    }
  };

  const handleCreateScheduledOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile.role === 'visitor') {
      alert('⚠️ No puedes programar inversiones como visitante. Regístrate o inicia sesión.');
      return;
    }

    if (!schedProjectId) {
      alert('⚠️ Por favor, selecciona un proyecto para esta inversión programada.');
      return;
    }

    const matchedProject = userProjects.find(p => p.id === schedProjectId);
    if (!matchedProject) {
      alert('⚠️ Proyecto seleccionado inválido o ausente.');
      return;
    }

    const chosenFee = Number(schedEntryFee);
    setIsSyncingOrders(true);
    try {
      const response = await fetch('/api/scheduled-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userProfile.id,
          userName: userProfile.name,
          userAvatar: userProfile.avatar,
          entryFee: chosenFee,
          dateTime: schedTime,
          recurrence: schedRecurrence,
          projectId: matchedProject.id,
          projectName: matchedProject.title
        })
      });

      if (!response.ok) {
        throw new Error('Error al programar orden de inversión.');
      }

      const resData = await response.json();
      if (resData.success) {
        const listRes = await fetch('/api/scheduled-orders');
        const listData = await listRes.json();
        setScheduledOrders(listData);
        alert(`🤖 ¡Orden de Autoinversión Programada! Se asignará un pago de ${chosenFee}€ el ${new Date(schedTime).toLocaleString('es-ES')} con el proyecto "${matchedProject.title}" de forma recurrente/automática.`);
      }
    } catch (e) {
      console.error(e);
      alert('❌ Error al intentar registrar la programación del pedido.');
    } finally {
      setIsSyncingOrders(false);
    }
  };

  const handleCancelScheduledOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/scheduled-orders/${orderId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setScheduledOrders(prev => prev.filter(o => o.id !== orderId));
        alert('🗑️ Orden cancelada con éxito.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleForceManualTrigger = async (orderId: string) => {
    try {
      const response = await fetch(`/api/scheduled-orders/${orderId}/trigger`, {
        method: 'POST'
      });
      if (response.ok) {
        const resData = await response.json();
        const listRes = await fetch('/api/scheduled-orders');
        const listData = await listRes.json();
        setScheduledOrders(listData);

        const executedOrder = listData.find((o: any) => o.id === orderId || (resData.order && o.id === resData.order.id));
        if (executedOrder) {
          await handleApplyExecutedOrders([executedOrder]);
        }
      } else {
        alert('La orden ya ha sido ejecutada o no se encuentra disponible.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (userProjects.length > 0 && !schedProjectId) {
      setSchedProjectId(userProjects[0].id);
    }
  }, [userProjects, schedProjectId]);

  // Custom states for cryptographic voting progress & results podium
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [completedSessionToDisplay, setCompletedSessionToDisplay] = useState<InvestmentSession | null>(null);
  const [showFullTally, setShowFullTally] = useState<boolean>(false);
  const [isCastingPublished, setIsCastingPublished] = useState<boolean>(false);
  const [notifiedSkippedOrders, setNotifiedSkippedOrders] = useState<string[]>([]);
  const [insufficientBalanceError, setInsufficientBalanceError] = useState<{ required: number; actual: number } | null>(null);

  const [countdownSession, setCountdownSession] = useState<InvestmentSession | null>(null);
  const [countdownTimerValue, setCountdownTimerValue] = useState<number>(10);

  const getProjectFundingWon = (projectId: string, projectTitle: string) => {
    return historyWonLog
      .filter(log => log.projectId === projectId || log.projectName === projectTitle || log.title === projectTitle)
      .reduce((sum, log) => sum + log.prize, 0);
  };

  useEffect(() => {
    if (countdownSession !== null) {
      if (countdownTimerValue > 0) {
        const timer = setTimeout(() => {
          setCountdownTimerValue(prev => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setCompletedSessionToDisplay(countdownSession);
        setCountdownSession(null);
      }
    }
  }, [countdownSession, countdownTimerValue]);

  const showCompletedSessionWithCountdown = (session: InvestmentSession) => {
    setCountdownSession(session);
    setCountdownTimerValue(10);
  };

  useEffect(() => {
    if (userProjects.length > 0 && !enrollProjectId) {
      setEnrollProjectId(userProjects[0].id);
    }
  }, [userProjects, enrollProjectId]);

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getVisibleSessions = (): InvestmentSession[] => {
    const fees = [10, 100, 1000, 10000, 100000, 1000000];
    return fees.map(fee => {
      // 1. Find a session at this entryFee in which the user is actively participating (filling or voting state)
      const userJoinedSess = sessions.find(s => 
        s.entryFee === fee && 
        (s.status === 'filling' || s.status === 'voting') &&
        s.participants.some(p => p.userId === userProfile.id)
      );
      if (userJoinedSess) return userJoinedSess;

      // 2. Find the first 'filling' session at this entryFee
      const fillingSess = sessions.find(s => s.entryFee === fee && s.status === 'filling');
      if (fillingSess) return fillingSess;

      // 3. Find the first 'voting' session at this entryFee
      const votingSess = sessions.find(s => s.entryFee === fee && s.status === 'voting');
      if (votingSess) return votingSess;

      // 4. Fallback: recreate a dummy initial session for this fee
      const sessionCategory = fee === 10
        ? 'Trabajadores' 
        : fee === 100 
          ? 'Emprendedores' 
          : fee === 1000 
            ? 'Empresarios'
            : fee === 10000
              ? 'Top Models'
              : fee === 100000
                ? 'Inversores'
                : 'Millonarios';
      return {
        id: `sess-fallback-${fee}-${Date.now()}`,
        title: `Mesa de Inversión de ${sessionCategory}`,
        entryFee: fee,
        status: 'filling' as const,
        timeLeft: 1200,
        createdAt: new Date().toISOString(),
        poolTotal: 0,
        participants: []
      };
    });
  };

  // Preselect active session automatically on mount
  useEffect(() => {
    const visSessions = getVisibleSessions();
    if (visSessions.length > 0) {
      const isCurrentActiveVisible = visSessions.some(s => s.id === activeSessionId);
      if (!isCurrentActiveVisible) {
        const active = visSessions.find(s => s.id === 'sess-entrepreneurs') || visSessions.find(s => s.status === 'voting') || visSessions[0];
        if (active) {
          setActiveSessionId(active.id);
        }
      }
    }
  }, [sessions, activeSessionId]);

  const currentSession = getVisibleSessions().find(s => s.id === activeSessionId);

  // Initialize and run the automated step-by-step consensus process once user votes
  useEffect(() => {
    if (!currentSession || currentSession.status !== 'voting') {
      return;
    }

    const userInSession = currentSession.participants.find(p => p.userId === userProfile.id);
    if (!userInSession || !userInSession.hasVoted) {
      if (simulationLogs.length > 0) {
        setSimulationLogs([]);
      }
      return;
    }

    // Initialize logs if they are completely empty
    if (simulationLogs.length === 0) {
      setSimulationLogs([
        `🔑 Protocolo de custodia encriptado activado con éxito.`,
        `🖥️ Nodo Central: Contrastando carteras y firmando votos síncronos...`,
        `✓ Firma digital de @${userProfile.name} verificada. Voto seguro emitido.`,
      ]);
      return;
    }

    // Get any participants who have not voted yet
    const pendingVoters = currentSession.participants.filter(p => !p.hasVoted);
    if (pendingVoters.length === 0) {
      return;
    }

    // Timed simulated dispatch of AI votes one by one
    const timer = setTimeout(() => {
      const nextVoter = pendingVoters[0];
      const candidates = currentSession.participants.filter(p => p.userId !== nextVoter.userId);
      if (candidates.length === 0) return;

      const randomTarget = candidates[Math.floor(Math.random() * candidates.length)];
      
      const updatedSessions = sessions.map((sess) => {
        if (sess.id === currentSession.id) {
          const nextParticipants = sess.participants.map((p) => {
            if (p.userId === nextVoter.userId) {
              return { ...p, hasVoted: true, votedFor: randomTarget.userId };
            }
            if (p.userId === randomTarget.userId) {
              return { ...p, votesReceived: p.votesReceived + 1 };
            }
            return p;
          });

          return {
            ...sess,
            participants: nextParticipants
          };
        }
        return sess;
      });

      const nextSessUpdated = updatedSessions.find(s => s.id === currentSession.id);
      
      const timestamp = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const nextLogs = [
        `[${timestamp}] 🗳️ @${nextVoter.name} ha emitido un voto síncrolo por la propuesta de @${randomTarget.name}.`,
        ...simulationLogs
      ];
      setSimulationLogs(nextLogs);

      onUpdateSessions(updatedSessions);

      // Final closure when all members have cast their ballots
      if (nextSessUpdated) {
        const finishedAll = nextSessUpdated.participants.every(p => p.hasVoted);
        if (finishedAll) {
          setTimeout(() => {
            handleCloseAndProcessPayouts(nextSessUpdated, updatedSessions);
          }, 7000);
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentSession, sessions, userProfile.id, simulationLogs]);

  // 1. Join a filling session
  const handleJoinSession = (sessionId: string) => {
    if (userProfile.role === 'visitor') {
      alert('⚠️ No puedes unirte a mesas de inversión como visitante no registrado. Por favor, crea una cuenta o inicia sesión.');
      return;
    }
    const sessObj = sessions.find(s => s.id === sessionId);
    if (!sessObj) return;

    if (sessObj.participants.length >= 10) {
      alert('⚠️ Esta sesión ya tiene el límite máximo de 10 participantes.');
      return;
    }

    if (userProfile.balance < sessObj.entryFee) {
      setInsufficientBalanceError({ required: sessObj.entryFee, actual: userProfile.balance });
      return;
    }

    if (!enrollProjectId) {
      alert('Debes seleccionar uno de tus proyectos creados antes de poder pagar para entrar en la sesión.');
      return;
    }
    const activeProject = userProjects.find(p => p.id === enrollProjectId);
    if (!activeProject) {
      alert('El proyecto seleccionado no es válido o no existe.');
      return;
    }

    // Check if this project is already participating in another active session
    const isProjectActiveInAnyRun = sessions.some(s => 
      (s.status === 'filling' || s.status === 'voting') && 
      s.participants.some(p => p.projectId === activeProject.id)
    );
    if (isProjectActiveInAnyRun) {
      alert(`⚠️ El proyecto "${activeProject.title}" ya está participando activamente en otra Mesa de Inversión en curso. Espera a que termine esa ronda para poder inscribirlo de nuevo.`);
      return;
    }

    // Funding goal constraint
    const fundingWon = getProjectFundingWon(activeProject.id, activeProject.title);
    if (fundingWon >= activeProject.budget) {
      alert(`❌ Este proyecto ya ha conseguido el tope de financiación establecido en su Presupuesto de Referencia de ${activeProject.budget}€ (Financiación conseguida: ${fundingWon.toFixed(2)}€) y no puede volver a participar.`);
      return;
    }

    const updatedSessions = sessions.map((sess) => {
      if (sess.id === sessionId) {
        const cleanParticipants = sess.participants.filter(p => p.userId !== userProfile.id);

        const newParticipant: ParticipantState = {
          userId: userProfile.id,
          name: userProfile.name,
          avatar: userProfile.avatar,
          projectId: activeProject.id,
          votesReceived: 0,
          hasVoted: false
        };

        let updatedParticipants: ParticipantState[] = [];
        if (sessionId === 'sess-workers') {
          const findModel = (name: string, fallbackAvatar: string) => {
            const found = models.find(m => m.name.toLowerCase() === name.toLowerCase());
            return {
              userId: found?.id || `part-${name.toLowerCase().replace(/[^a-z]/g, '')}`,
              name: found?.name || name,
              avatar: found?.avatar || fallbackAvatar
            };
          };

          const pSophia = findModel('Sophia Loren', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150');
          const pMia = findModel('Mia Kincaid', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150');
          const pOliver = findModel('Oliver Finch', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150');
          const pAmara = findModel('Amara Okafor', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=300');
          const pDante = findModel('Dante Moretti', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150');
          const pKenji = findModel('Kenji Sato', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150');
          const pIsabella = findModel('Isabella Dubois', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150');
          const pMarcus = findModel('Marcus Sterling', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150');
          const pLiam = findModel('Liam Alvarez', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150');

          updatedParticipants = [
            { ...pSophia, projectId: 'proj-sim-sophia', votesReceived: 0.0, hasVoted: false },
            { ...pMia, projectId: 'proj-sim-mia', votesReceived: 0.0, hasVoted: false },
            { ...pOliver, projectId: 'proj-sim-oliver', votesReceived: 0.0, hasVoted: false },
            { ...pAmara, projectId: 'proj-sim-amara', votesReceived: 0.0, hasVoted: false },
            { ...pDante, projectId: 'proj-sim-dante', votesReceived: 0.0, hasVoted: false },
            { ...pKenji, projectId: 'proj-sim-kenji', votesReceived: 0.0, hasVoted: false },
            newParticipant,
            { ...pIsabella, projectId: 'proj-sim-isabella', votesReceived: 0.0, hasVoted: false },
            { ...pMarcus, projectId: 'proj-sim-marcus', votesReceived: 0.0, hasVoted: false },
            { ...pLiam, projectId: 'proj-sim-liam', votesReceived: 0.0, hasVoted: false }
          ];
        } else {
          updatedParticipants = [...cleanParticipants, newParticipant];
          
          // Instantly populate the remaining participants up to 10
          const usedUserIds = new Set(updatedParticipants.map(p => p.userId));
          const availableModels = models.filter(m => !usedUserIds.has(m.id));
          let modelIdx = 0;
          while (updatedParticipants.length < 10) {
            const m = availableModels[modelIdx] || models[modelIdx % models.length];
            updatedParticipants.push({
              userId: m.id,
              name: m.name,
              avatar: m.avatar,
              projectId: `proj-sim-${m.id}`,
              votesReceived: 0,
              hasVoted: false
            });
            modelIdx++;
          }
        }

        const isNowFull = true;

        return {
          ...sess,
          participants: updatedParticipants,
          poolTotal: 10 * sess.entryFee,
          status: 'voting' as const,
          timeLeft: 1200
        };
      }
      return sess;
    });

    const nextBalance = userProfile.balance - sessObj.entryFee;
    onUpdateProfile({
      ...userProfile,
      balance: nextBalance,
      totalInvested: userProfile.totalInvested + sessObj.entryFee
    });

    onAddMovement({
      id: `mov-join-${Date.now()}`,
      userId: userProfile.id,
      type: 'investment',
      amount: -sessObj.entryFee,
      date: new Date().toISOString(),
      description: `Inversión - Inscripción de entrada en sesión ${sessObj.title}`,
      projectName: activeProject.title
    });

    const wasSessionFullAfterThis = updatedSessions.find(s => s.id === sessionId)?.status === 'voting';
    let finalSessions = updatedSessions;

    if (wasSessionFullAfterThis) {
      const uniqueNewId = `sess-auto-${Date.now()}`;
      const sessionCategory = sessObj.entryFee === 10 
        ? 'Trabajadores' 
        : sessObj.entryFee === 100 
          ? 'Emprendedores' 
          : sessObj.entryFee === 1000 
            ? 'Empresarios'
            : sessObj.entryFee === 10000
              ? 'Top Models'
              : sessObj.entryFee === 100000
                ? 'Inversores'
                : 'Millonarios';

      const newEmptySession: InvestmentSession = {
        id: uniqueNewId,
        title: `Sesión de Inversión de ${sessionCategory} - R-${Math.floor(Date.now() % 1000)}`,
        entryFee: sessObj.entryFee,
        status: 'filling',
        timeLeft: 1200,
        createdAt: new Date().toISOString(),
        poolTotal: 0,
        participants: []
      };
      finalSessions = [...updatedSessions, newEmptySession];
      setActiveSessionId(sessionId);
    } else {
      setActiveSessionId(sessionId);
    }

    onUpdateSessions(finalSessions);

    // Set custom presentation queue placing the user first, reset connection states, and set paid flag
    if (sessObj.entryFee > 0) {
      localStorage.setItem('user_paid_finanzas_session', 'true');
      localStorage.removeItem('finanzas_session_speech_played');
      
      // Place logged-in user in first place in the queue (starts as waiting since table is not complete yet)
      const formattedTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newUserItem = {
        id: 'user',
        name: userProfile?.name || 'TÚ (Inversor)',
        avatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150',
        role: 'TÚ (Inversor)',
        requestTime: formattedTime,
        status: 'waiting' as const
      };
      
      const initialQueue = [
        { id: 'f-1', name: 'Adriana Lima', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', role: 'Modelo Directora', requestTime: '10:31:15', status: 'waiting' as const },
        { id: 'f-2', name: 'Gisele Bündchen', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', role: 'Inversora Principal', requestTime: '10:36:00', status: 'waiting' as const },
        { id: 'f-3', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=650', role: 'Asesor Fintech', requestTime: '10:38:45', status: 'waiting' as const },
        { id: 'f-4', name: 'Sienna Cole', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650', role: 'Modelo Patrocinada', requestTime: '10:40:02', status: 'waiting' as const },
        { id: 'f-5', name: 'Liam Cooper', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650', role: 'Socio Inversor', requestTime: '10:41:00', status: 'waiting' as const },
        newUserItem
      ];
      
      localStorage.setItem('finanzas_presentation_queue', JSON.stringify(initialQueue));
      // Initially set 5 presenters online, others will connect sequentially
      localStorage.setItem('finanzas_joined_presenter_ids', JSON.stringify(['f-1', 'f-2', 'f-3', 'f-4', 'f-5']));
      localStorage.setItem('finanzas_scenario', 'not_present');
    }

    // Set default category filter to 'Finanzas' for CastingLive and redirect directly to casting_live tab
    localStorage.setItem('casting_live_default_category_filter', 'Finanzas');
    if (onNavigateToTab) {
      onNavigateToTab('casting_live');
    }
  };

  const handleDirectUnlockPayment = (session: InvestmentSession) => {
    if (userProfile.role === 'visitor') {
      alert('⚠️ Por favor, crea una cuenta o inicia sesión.');
      return;
    }
    if (session.participants.length >= 10) {
      alert('⚠️ Esta sesión ya tiene el límite máximo de 10 participantes.');
      return;
    }
    if (userProfile.balance < session.entryFee) {
      alert(`❌ Saldo insuficiente. Tu saldo es de ${userProfile.balance.toFixed(2)}€, pero requieres ${session.entryFee}.00€.`);
      return;
    }
    if (!enrollProjectId) {
      alert('Por favor selecciona un proyecto.');
      return;
    }
    const chosenProject = userProjects.find(p => p.id === enrollProjectId);
    if (!chosenProject) return;

    // Deduct balance
    const nextBalance = userProfile.balance - session.entryFee;
    onUpdateProfile({
      ...userProfile,
      balance: nextBalance,
      totalInvested: userProfile.totalInvested + session.entryFee
    });

    // We add the user as a participant! If they are added, hasUserPaid is true, and they are shown in the list.
    const updatedSessions = sessions.map((s) => {
      if (s.id === session.id) {
        const alreadyJoined = s.participants.some(p => p.userId === userProfile.id);
        if (alreadyJoined) return s;

        const newPart: ParticipantState = {
          userId: userProfile.id,
          name: userProfile.name,
          avatar: userProfile.avatar,
          projectId: chosenProject.id,
          votesReceived: 0,
          hasVoted: false
        };
        const nextParticipants = [...s.participants, newPart];
        return {
          ...s,
          participants: nextParticipants,
          poolTotal: nextParticipants.length * s.entryFee
        };
      }
      return s;
    });

    onUpdateSessions(updatedSessions);

    // Add financial movement
    onAddMovement({
      id: `mov-audit-${Date.now()}`,
      userId: userProfile.id,
      type: 'investment',
      amount: -session.entryFee,
      date: new Date().toISOString(),
      description: `Inversión - Inscripción de entrada en sesión ${session.title}`,
      projectName: chosenProject.title
    });

    alert(`🎉 ¡Pago de ${session.entryFee}€ procesado con éxito! Mesa desbloqueada. Ahora puedes ver las propuestas de todos los miembros.`);

    // Smoothly scroll down to the lobby of participants immediately
    setTimeout(() => {
      const el = document.getElementById('participants-lobby-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  // 2. Cast Vote
  const handleCastVote = (targetUserId: string) => {
    if (userProfile.role === 'visitor') {
      alert('⚠️ No puedes votar como visitante no registrado. Por favor, crea una cuenta o inicia sesión.');
      return;
    }
    if (!currentSession) return;
    if (currentSession.status !== 'voting') return;
    if (currentSession.participants.length < 10) {
      alert('La votación está bloqueada hasta tener un total de 10 participantes inscritos.');
      return;
    }

    const userInSession = currentSession.participants.find(p => p.userId === userProfile.id);
    if (!userInSession) {
      alert('Debes formar parte de esta mesa para poder votar.');
      return;
    }

    if (userInSession.hasVoted) {
      alert('Ya has emitido tu voto.');
      return;
    }

    if (targetUserId === userProfile.id) {
      alert('No puedes votar por tu propio proyecto. Elige un compañero.');
      return;
    }

    let targetSessUpdated: InvestmentSession | null = null;
    const updatedSessions = sessions.map((sess) => {
      if (sess.id === currentSession.id) {
        // Set user's vote first
        let pList = sess.participants.map((p) => {
          if (p.userId === userProfile.id) {
            return { ...p, hasVoted: true, votedFor: targetUserId };
          }
          return p;
        });

        // Now, automatically simulate the other 9 AI participants' votes
        // so that everyone has voted, fulfilling "Cómputo instantáneo al votar todos"
        pList = pList.map((p) => {
          if (p.userId === userProfile.id) return p;
          if (p.hasVoted) return p;

          const candidates = pList.filter(cand => cand.userId !== p.userId);
          
          // Weighted random choice for extra fun/fairness:
          // Give higher weight to some top ones like Isabella, Sophia, and the user
          const weights = candidates.map(cand => {
            if (cand.userId === userProfile.id) return 3; // higher weight for user!
            if (cand.name.includes('Isabella')) return 4;
            if (cand.name.includes('Sophia')) return 3;
            return 1;
          });

          const totalWeight = weights.reduce((a, b) => a + b, 0);
          let rand = Math.random() * totalWeight;
          let pickedUserId = '';
          for (let i = 0; i < candidates.length; i++) {
            rand -= weights[i];
            if (rand <= 0) {
              pickedUserId = candidates[i].userId;
              break;
            }
          }
          if (!pickedUserId) pickedUserId = candidates[Math.floor(Math.random() * candidates.length)].userId;

          return {
            ...p,
            hasVoted: true,
            votedFor: pickedUserId
          };
        });

        // Re-calculate the total votesReceived for everyone based on all votes cast
        pList = pList.map(cand_p => {
          const received = pList.filter(p => p.votedFor === cand_p.userId).length;
          return {
            ...cand_p,
            votesReceived: received
          };
        });

        targetSessUpdated = {
          ...sess,
          participants: pList
        };
        return targetSessUpdated;
      }
      return sess;
    });

    onUpdateSessions(updatedSessions);

    // AUTOMATIC EVALUATION: When the last user votes, immediately declare results after 7 seconds
    if (targetSessUpdated) {
      const allVoted = (targetSessUpdated as InvestmentSession).participants.every(p => p.hasVoted);
      if (allVoted) {
        setTimeout(() => {
          handleCloseAndProcessPayouts(targetSessUpdated!, updatedSessions);
        }, 7000);
      }
    }
  };

  // 3. Simulated Votes Generator (Fill remaining AI votes automatically)
  const handleSimulateAIVotes = () => {
    if (!currentSession || currentSession.status !== 'voting') return;

    let targetSessUpdated: InvestmentSession | null = null;
    const updatedSessions = sessions.map((sess) => {
      if (sess.id === currentSession.id) {
        let pList = [...sess.participants];
        
        pList = pList.map((p) => {
          if (p.userId === userProfile.id) return p;
          if (p.hasVoted) return p;

          const candidates = pList.filter(cand => cand.userId !== p.userId);
          const picked = candidates[Math.floor(Math.random() * candidates.length)];

          return {
            ...p,
            hasVoted: true,
            votedFor: picked.userId
          };
        });

        pList = pList.map(cand_p => {
          const received = pList.filter(p => p.votedFor === cand_p.userId).length;
          return {
            ...cand_p,
            votesReceived: received
          };
        });

        targetSessUpdated = {
          ...sess,
          participants: pList
        };
        return targetSessUpdated;
      }
      return sess;
    });

    onUpdateSessions(updatedSessions);

    // AUTOMATIC EVALUATION: When last user votes (AI completed votes here)
    if (targetSessUpdated) {
      const allVoted = (targetSessUpdated as InvestmentSession).participants.every(p => p.hasVoted);
      if (allVoted) {
        setTimeout(() => {
          handleCloseAndProcessPayouts(targetSessUpdated!, updatedSessions);
        }, 7000);
      }
    }
  };

  const triggerMockCompletedSession = (project: ProjectData) => {
    // Generate a beautiful mock completed session where this project has a competitive results card
    const otherParticipants: ParticipantState[] = models.slice(0, 9).map((m, idx) => ({
      userId: m.id,
      name: m.name,
      avatar: m.avatar,
      projectId: `proj-sim-${m.id}`,
      votesReceived: idx === 0 ? 4 : Math.floor(Math.random() * 3),
      hasVoted: true,
      votedFor: `vote-to-${idx}`
    }));

    // Add selected project owner as a participant with high votes
    const targetParticipant: ParticipantState = {
      userId: project.userId,
      name: project.team[0]?.name || 'Creador Seleccionado',
      avatar: project.images[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      projectId: project.id,
      votesReceived: 5, // high votes so they are the winner/runner-up
      hasVoted: true,
      votedFor: 'user-id-vote'
    };

    const finalParticipants = [targetParticipant, ...otherParticipants];
    
    // Sort and find winner
    const maxVotes = Math.max(...finalParticipants.map(p => p.votesReceived));
    const winners = finalParticipants.filter(p => p.votesReceived >= maxVotes);

    const mockCompletedSess: InvestmentSession = {
      id: `session-mock-direct-${Date.now()}`,
      title: `Mesa de Inversión • Especial ${project.category}`,
      entryFee: 100,
      poolTotal: 1000,
      status: 'completed',
      winners: winners.map(w => w.name),
      patrocinadoresPaid: [],
      participants: finalParticipants,
      timeLeft: 0,
      createdAt: new Date().toISOString()
    };

    showCompletedSessionWithCountdown(mockCompletedSess);
  };

  const handleVoteForProject = (project: ProjectData) => {
    if (userProfile.role === 'visitor') {
      alert('⚠️ No puedes votar como visitante no registrado. Por favor, crea una cuenta o inicia sesión.');
      return;
    }

    if (currentSession && currentSession.participants.length < 10) {
      alert('La votación está bloqueada hasta tener un total de 10 participantes inscritos.');
      return;
    }

    // Close the details modal first
    setSelectedProject(null);

    // Let's check if there is an active session currently running
    if (currentSession) {
      const isParticipant = currentSession.participants.some(p => p.userId === userProfile.id);
      
      if (currentSession.status === 'voting') {
        const userInSession = currentSession.participants.find(p => p.userId === userProfile.id);
        
        if (isParticipant && userInSession) {
          if (userInSession.hasVoted) {
            alert('Ya has emitido tu voto en esta mesa. Mostrando el progreso de las votaciones...');
            return;
          }

          if (project.userId === userProfile.id) {
            alert('⚠️ No puedes votar por tu propio proyecto. Por favor, selecciona la propuesta de otro participante para emitir tu voto.');
            return;
          }

          // Case where user can vote for the project. Let's cast user's vote and let the step-by-step voting progress run
          const updatedParticipants = currentSession.participants.map((p) => {
            if (p.userId === userProfile.id) {
              return { ...p, hasVoted: true, votedFor: project.userId };
            }
            if (p.userId === project.userId) {
              return { ...p, votesReceived: p.votesReceived + 1 };
            }
            return p;
          });

          const midSession: InvestmentSession = {
            ...currentSession,
            participants: updatedParticipants
          };

          const nextSessionsWithUserVote = sessions.map(s => s.id === currentSession.id ? midSession : s);
          onUpdateSessions(nextSessionsWithUserVote);

          const allVoted = midSession.participants.every(p => p.hasVoted);
          if (allVoted) {
            setTimeout(() => {
              handleCloseAndProcessPayouts(midSession, nextSessionsWithUserVote);
            }, 7000);
          }
          return;
        } else {
          alert(`Te has unido como miembro consultivo para votar por el proyecto. El sistema completará la mesa para que veas el resultado.`);
          triggerMockCompletedSession(project);
        }
      } else {
        // Current session is in 'lobby' state
        alert(`Iniciando votación inmediata y consenso digital para la mesa: ${currentSession.title}...`);
        
        let pList = [...currentSession.participants];
        if (!isParticipant) {
          const activeProjId = enrollProjectId || (userProjects[0]?.id || `proj-user-fake`);
          pList.push({
            userId: userProfile.id,
            name: userProfile.name,
            avatar: userProfile.avatar,
            projectId: activeProjId,
            votesReceived: 0,
            hasVoted: false
          });
        }

        const usedUserIds = new Set(pList.map(p => p.userId));
        const availableModels = models.filter(m => !usedUserIds.has(m.id));
        let modelIdx = 0;
        while (pList.length < 10) {
          const m = availableModels[modelIdx] || models[modelIdx % models.length];
          pList.push({
            userId: m.id,
            name: m.name,
            avatar: m.avatar,
            projectId: `proj-sim-${m.id}`,
            votesReceived: 0,
            hasVoted: false
          });
          modelIdx++;
        }

        pList = pList.map((p) => {
          if (p.userId === userProfile.id) {
            return { ...p, hasVoted: true, votedFor: project.userId };
          }
          const candidates = pList.filter(cand => cand.userId !== p.userId);
          const picked = candidates[Math.floor(Math.random() * candidates.length)];
          return {
            ...p,
            hasVoted: true,
            votedFor: picked.userId
          };
        });

        pList = pList.map(cand_p => {
          const received = pList.filter(p => p.votedFor === cand_p.userId).length;
          return {
            ...cand_p,
            votesReceived: received
          };
        });

        const completedSession: InvestmentSession = {
          ...currentSession,
          status: 'voting',
          participants: pList,
          poolTotal: pList.length * currentSession.entryFee
        };

        const finalSessionsList = sessions.map(s => s.id === currentSession.id ? completedSession : s);
        onUpdateSessions(finalSessionsList);

        setTimeout(() => {
          handleCloseAndProcessPayouts(completedSession, finalSessionsList);
        }, 7000);
      }
    } else {
      triggerMockCompletedSession(project);
    }
  };

  // 4. Force temporal Leap and process results sychronously (Calculates allocations and awards user)
  const handleCloseAndProcessPayouts = (targetSession: InvestmentSession, allSessionsList: InvestmentSession[]) => {
    if (!targetSession || targetSession.status !== 'voting') return;

    let finalParticipants = [...targetSession.participants];

    const maxVotesBeforeUnvoted = Math.max(...finalParticipants.map(p => p.votesReceived), 0);
    let potentialWinnersBefore = finalParticipants.filter(p => p.votesReceived === maxVotesBeforeUnvoted && maxVotesBeforeUnvoted > 0);

    const idleVoters = finalParticipants.filter(p => !p.hasVoted);
    
    if (idleVoters.length > 0) {
      if (potentialWinnersBefore.length > 0) {
        idleVoters.forEach((idle) => {
          potentialWinnersBefore.forEach((ldr) => {
            const idx = finalParticipants.findIndex(p => p.userId === ldr.userId);
            if (idx !== -1) {
              finalParticipants[idx].votesReceived += (1 / potentialWinnersBefore.length);
            }
          });
          const idleIdx = finalParticipants.findIndex(p => p.userId === idle.userId);
          if (idleIdx !== -1) {
            finalParticipants[idleIdx].hasVoted = true;
            finalParticipants[idleIdx].votedFor = 'AUTO_WINNERS';
          }
        });
      } else {
        const pool = targetSession.poolTotal;
        const reward80 = pool * 0.80;
        const reward10 = pool * 0.10;

        const prizePerParticipant = reward80 / 10;
        const isParticipant = targetSession.participants.some(p => p.userId === userProfile.id);

        let nextBalance = userProfile.balance;
        let earnedPrize = 0;

        if (isParticipant) {
          nextBalance += prizePerParticipant;
          earnedPrize = prizePerParticipant;
          onAddMovement({
            id: `mov-novote-refund-${Date.now()}`,
            userId: userProfile.id,
            type: 'prize',
            amount: prizePerParticipant,
            date: new Date().toISOString(),
            description: `Distribución Síncrona No-Votos: 80% repartido entre participantes de ${targetSession.title}`
          });
        }

        onAddSystemHistory({ ...targetSession, status: 'completed', winners: finalParticipants.map(p => p.userId) }, isParticipant, prizePerParticipant);

        onUpdateProfile({
          ...userProfile,
          balance: nextBalance,
          totalEarnings: userProfile.totalEarnings + earnedPrize
        });

        const cleanSessions = allSessionsList.map(s => {
          if (s.id === targetSession.id) {
            if (['sess-workers', 'sess-entrepreneurs', 'sess-businessmen', 'sess-topmodels', 'sess-investors', 'sess-millionaires'].includes(s.id)) {
              const seedData = seedInitialData();
              const freshSess = seedData.sessions.find(fs => fs.id === s.id);
              if (freshSess) return freshSess;
            }
          }
          return s;
        }).filter(s => {
          if (s.id === targetSession.id && !['sess-workers', 'sess-entrepreneurs', 'sess-businessmen', 'sess-topmodels', 'sess-investors', 'sess-millionaires'].includes(s.id)) {
            return false;
          }
          return true;
        });
        onUpdateSessions(cleanSessions);
        
        if (cleanSessions.length > 0) {
          setActiveSessionId(cleanSessions[0].id);
        } else {
          setActiveSessionId('');
        }

        alert(`⚠️ ¡Ningún participante emitió un voto! Veredicto síncrono en ${targetSession.title}: El 80% del fondo (${reward80}€) se ha dividido entre los 10 usuarios (${prizePerParticipant.toFixed(2)}€ c/u).`);
        return;
      }
    }

    const finalMaxVotes = Math.max(...finalParticipants.map(p => p.votesReceived));
    const winners = finalParticipants.filter(p => p.votesReceived >= finalMaxVotes && finalMaxVotes > 0);

    const pool = targetSession.poolTotal;
    const prizeTotal80 = pool * 0.80;
    const sponsorTotal10 = pool * 0.10;

    const prizePerWinner = prizeTotal80 / winners.length;

    let updatedBalance = userProfile.balance;
    let registeredEarnings = userProfile.totalEarnings;
    let registeredCommissions = userProfile.totalCommissions;
    let userWon = false;
    let infoMessage = '';

    const userWinnerInstance = winners.find(w => w.userId === userProfile.id);
    if (userWinnerInstance) {
      userWon = true;
      updatedBalance += prizePerWinner;
      registeredEarnings += prizePerWinner;

      onAddMovement({
        id: `mov-prize-${Date.now()}`,
        userId: userProfile.id,
        type: 'prize',
        amount: prizePerWinner,
        date: new Date().toISOString(),
        description: `🏆 ¡Ganador absoluto de la ${targetSession.title}! (${winners.length > 1 ? `Empate de ${winners.length}` : 'Primer Puesto'})`
      });
    }

    const sponsorPayouts: { [sponsorId: string]: number } = {};
    winners.forEach((win) => {
      const sponsorKeys = models.map(m => m.id);
      const randSponsorId = sponsorKeys.length > 0 ? sponsorKeys[Math.floor(Math.random() * Math.min(sponsorKeys.length, 10))] : 'topf-1';
      const winSponsorId = win.userId === userProfile.id ? userProfile.patrocinadorId : randSponsorId;
      const commissionSharePerWinnerSponsor = sponsorTotal10 / winners.length;
      sponsorPayouts[winSponsorId] = (sponsorPayouts[winSponsorId] || 0) + commissionSharePerWinnerSponsor;
    });

    if (userProfile.role === 'model') {
      const commissionForUserAsModel = sponsorPayouts[userProfile.id];
      if (commissionForUserAsModel > 0) {
        updatedBalance += commissionForUserAsModel;
        registeredCommissions += commissionForUserAsModel;

        onAddMovement({
          id: `mov-comm-${Date.now()}`,
          userId: userProfile.id,
          type: 'commission',
          amount: commissionForUserAsModel,
          date: new Date().toISOString(),
          description: `🔗 Comisión de Afiliado - Tu patrocinado ha ganado una ronda de inversión`
        });
      }
    } else {
      const userSponsorP = models.find(m => m.id === userProfile.patrocinadorId);
      if (userWon && userSponsorP) {
        const sponsorCommission = sponsorTotal10 / winners.length;
        infoMessage += ` Tu patrocinador @${userSponsorP.username} (${userSponsorP.name}) ha recibido el 10% (${sponsorCommission.toFixed(2)}€) como recompensa de afiliación estratégica.`;
      }
    }

    const mockCompletedSession: InvestmentSession = {
      ...targetSession,
      status: 'completed',
      winners: winners.map(w => w.name),
      patrocinadoresPaid: Object.keys(sponsorPayouts).map(id => models.find(mo => mo.id === id)?.name || id),
      participants: finalParticipants
    };

    onAddSystemHistory(mockCompletedSession, userWon, userWon ? prizePerWinner : 0);

    // Save final details to render a gorgeous interactive victory podium
    showCompletedSessionWithCountdown(mockCompletedSession);

    onUpdateProfile({
      ...userProfile,
      balance: updatedBalance,
      totalEarnings: registeredEarnings,
      totalCommissions: registeredCommissions
    });

    const nextSessions = allSessionsList.map(s => {
      if (s.id === targetSession.id) {
        if (['sess-workers', 'sess-entrepreneurs', 'sess-businessmen', 'sess-topmodels', 'sess-investors', 'sess-millionaires'].includes(s.id)) {
          const seedData = seedInitialData();
          const freshSess = seedData.sessions.find(fs => fs.id === s.id);
          if (freshSess) return freshSess;
        }
      }
      return s;
    }).filter(s => {
      if (s.id === targetSession.id && !['sess-workers', 'sess-entrepreneurs', 'sess-businessmen', 'sess-topmodels', 'sess-investors', 'sess-millionaires'].includes(s.id)) {
        return false;
      }
      return true;
    });
    onUpdateSessions(nextSessions);

    if (nextSessions.length > 0) {
      setActiveSessionId(nextSessions[0].id);
    } else {
      setActiveSessionId('');
    }
  };

  // Render completed session display (Results / Winners Podium)
  if (false && countdownSession) {
    const statusMessages = [
      "🎉 ¡Escrutinio completado!",                                    // 0s
      "✨ Preparando podio oficial de ganadores...",                  // 1s
      "📊 Consolidando base de datos y auditoría de red...",          // 2s
      "🔒 Sellando bloque en la base de datos distribuida...",        // 3s
      "🏦 Generando transacciones e incentivos síncronos...",         // 4s
      "🪙 Calculando distribución del pool de recompensa (80%)...",   // 5s
      "🛡️ Validando integridad de contratos de inversión...",         // 6s
      "🗳️ Analizando distribución de votos síncronos...",             // 7s
      "🔑 Comprobando llaves públicas y consenso en cola...",         // 8s
      "📥 Recopilando firmas criptográficas...",                       // 9s
      "⚡ Iniciando protocolo de escrutinio final..."                 // 10s
    ];

    const currentMessage = statusMessages[countdownTimerValue] || "Procesando escrutinio oficial...";

    return (
      <div className="bg-[#fff3f4] border border-pink-100 text-slate-900 rounded-3xl p-8 sm:p-12 space-y-8 shadow-xl relative overflow-hidden text-center animate-fade-in min-h-[480px] flex flex-col justify-center items-center" id="session-scrutiny-countdown">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* High Tech Header badge */}
        <div className="inline-flex items-center gap-2 bg-pink-100/60 border border-pink-200 px-4 py-1.5 rounded-full text-[10px] font-bold text-[#fe2c55] uppercase tracking-widest font-mono">
          <span className="w-2 h-2 rounded-full bg-[#fe2c55] animate-ping shrink-0" />
          <span>Fase de Consenso de Votos Activa</span>
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900">
            Calculando Escrutinio Final
          </h2>
          <p className="text-xs text-slate-600">
            Mesa: <strong className="text-slate-900">{countdownSession.title}</strong>
          </p>
        </div>

        {/* Big Countdown Number Circle */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Animated Background Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-pink-200 border-dashed animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute inset-2 rounded-full border-2 border-pink-300/40" />
          
          {/* Internal Glowing Pulse */}
          <div className="absolute inset-4 rounded-full bg-pink-400/5 blur-md" />
          
          {/* Big Number */}
          <div className="z-10 text-center select-none">
            <span className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tighter bg-gradient-to-br from-[#fe2c55] via-[#ff5a79] to-rose-700 bg-clip-text text-transparent block animate-pulse">
              {countdownTimerValue}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#fe2c55]/80 block mt-1">segundos</span>
          </div>
        </div>

        {/* Countdown Progress Bar */}
        <div className="w-full max-w-sm mx-auto space-y-3">
          <div className="h-1.5 w-full bg-pink-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#fe2c55] to-rose-600 transition-all duration-1000 ease-out"
              style={{ width: `${(countdownTimerValue / 10) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
            <span>Inicio</span>
            <span>Revelando Resultados</span>
          </div>
        </div>

        {/* Simulated status logger ticker */}
        <div className="p-4 bg-white/80 border border-pink-100 rounded-2xl w-full max-w-md mx-auto flex items-center justify-center gap-2 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#fe2c55] animate-pulse shrink-0" />
          <p className="text-xs text-[#fe2c55] font-mono tracking-wide font-medium">
            {currentMessage}
          </p>
        </div>
      </div>
    );
  }

  // Render completed session display (Results / Winners Podium)
  if (false && completedSessionToDisplay) {
    const winnersNames = completedSessionToDisplay.winners || [];
    const pool = completedSessionToDisplay.poolTotal;
    const prizeTotal80 = pool * 0.80;
    const prizePerWinner = winnersNames.length > 0 ? prizeTotal80 / winnersNames.length : 0;
    const userWon = completedSessionToDisplay.participants.some(
      p => p.userId === userProfile.id && winnersNames.includes(p.name)
    );

    // Compute maximum votes and find winners dynamically
    const maxVotes = Math.max(...completedSessionToDisplay.participants.map(p => p.votesReceived), 0);
    const topWinners = completedSessionToDisplay.participants.filter(p => p.votesReceived === maxVotes && maxVotes > 0);
    const winnersToDisplay = topWinners.length > 0 ? topWinners : completedSessionToDisplay.participants.slice(0, 3);
    const isTie = winnersToDisplay.length > 1;

    return (
      <SessionResultsPodium
        completedSessionToDisplay={completedSessionToDisplay}
        userProfile={userProfile}
        userProjects={userProjects}
        models={models}
        onSelectModel={onSelectModel}
        onNavigateToTab={onNavigateToTab}
        setCompletedSessionToDisplay={setCompletedSessionToDisplay}
        setSimulationLogs={setSimulationLogs}
        setIsCastingPublished={setIsCastingPublished}
        isCastingPublished={isCastingPublished}
        pool={pool}
        prizePerWinner={prizePerWinner}
        isTie={isTie}
        winnersToDisplay={winnersToDisplay}
        maxVotes={maxVotes}
      />
    );

    // Helper brand mapper for sponsor representatives
    const getWinnerBrand = (name: string) => {
      const brandMap: Record<string, { brandName: string, emoji: string }> = {
        'valentina rossi': { brandName: 'Rossi Leather', emoji: '👜' },
        'alexander vance': { brandName: 'Vance Streetwear', emoji: '👟' },
        'isabella dubois': { brandName: 'Dubois Perfumes', emoji: '✨' },
        'sophia loren': { brandName: 'Loren Sunglasses', emoji: '🕶️' },
        'mia kincaid': { brandName: 'Kincaid Cosmetics', emoji: '💄' },
        'elena rostova': { brandName: 'Rostov Schmuck', emoji: '💎' },
        'marcus sterling': { brandName: 'Sterling Watches', emoji: '⌚' },
        'clara mendez': { brandName: 'Mendez Couture', emoji: '👗' },
      };
      const key = name.toLowerCase().trim();
      return brandMap[key] || null;
    };

    const winnersWithBrands = winnersToDisplay.map(w => {
      return {
        winner: w,
        brand: getWinnerBrand(w.name)
      };
    });

    const allWinnersRepresentBrands = isTie && winnersWithBrands.every(item => item.brand !== null);

    // Sort participants by votes received to display ranking
    const sortedParticipantsForRanking = [...completedSessionToDisplay.participants]
      .sort((a, b) => b.votesReceived - a.votesReceived);

    return (
      <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-8 shadow-2xl animate-fade-in text-left relative overflow-hidden" id="podium-results-screen">
        {/* Immersive stadium visual background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.5)_0%,_rgba(15,23,42,0.95)_70%)] opacity-95 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* SECTION 1: HEADER BRAND TITLE */}
        <div className="text-center space-y-1.5 pb-5 border-b border-slate-900/60 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide text-slate-100 flex items-center justify-center gap-1.5">
            <span className="font-sans font-black">RESULTADOS FINALES</span>
          </h2>
          <p className="text-[10px] sm:text-xs font-black font-mono tracking-widest text-[#9aa8c6] uppercase">
            SISTEMA DE BLOQUES POR PUNTUACIÓN: AGRUPACIÓN DINÁMICA POR VOTOS
          </p>
        </div>

        {/* CASTING LIVE PUBLISH NOTIFICATION SUCCESS */}
        {isCastingPublished && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/80 flex items-start justify-between gap-3 animate-bounce shadow-lg shadow-amber-500/10 relative z-10" id="toast-casting-success">
            <div className="flex items-start gap-2.5">
              <span className="text-lg bg-slate-950 p-1 rounded-lg border border-slate-800">🚀</span>
              <div className="text-left">
                <strong className="text-amber-400 font-extrabold text-xs block">PUBLICADO EN CASTING LIVE</strong>
                <p className="text-[11px] text-slate-300 font-medium leading-relaxed mt-0.5">
                  ¡Resultados oficiales e históricos de la mesa '{completedSessionToDisplay.title}' transmitidos con éxito y anclados de forma descentralizada para el público general!
                </p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => setIsCastingPublished(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* MAIN BODY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-start">
          {/* LEFT COLUMN (8/12 OF SCREEN WIDTH): THE MAIN BLOCKS */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* BLOQUE MÁXIMO (LOS GANADORES) */}
            <div className="space-y-3">
              <h3 className="text-[10.5px] font-black tracking-widest uppercase text-slate-450 font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                BLOQUE MÁXIMO (LOS GANADORES)
              </h3>

              <div className="relative">
                {/* Arrow sign "Diseño Equitativo para Ganadores Empatados" styled beautifully */}
                {isTie && (
                  <div className="absolute -left-[148px] top-1/2 -translate-y-1/2 w-32 hidden xl:flex flex-col items-end text-right gap-0 text-slate-400 font-sans">
                    <span className="text-[10px] leading-snug font-extrabold text-slate-300 uppercase tracking-wider">
                      Diseño Equitativo
                    </span>
                    <span className="text-[9px] leading-none text-slate-400 font-medium">
                      para Ganadores
                    </span>
                    <span className="text-[9px] leading-tight text-slate-400 font-medium mb-1">
                      Empatados
                    </span>
                    <span className="text-amber-450 text-xl font-bold animate-pulse">➔</span>
                  </div>
                )}

                <div className="bg-gradient-to-b from-amber-600/10 via-slate-900 to-slate-950 rounded-3xl border-2 border-amber-500/60 p-6 shadow-xl shadow-amber-500/5 relative overflow-hidden flex flex-col justify-center text-center space-y-6">
                  {/* Glowing core background */}
                  <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent pointer-events-none" />

                  {/* Header Badge */}
                  <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 px-5 py-1.5 rounded-xl font-black text-xs sm:text-xs uppercase tracking-wide shadow-md shadow-amber-500/10 w-fit mx-auto flex items-center gap-1.5 border border-amber-300/30">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>MÁXIMOS VOTADOS ({maxVotes} VOTOS)</span>
                  </div>

                  {/* Congratulatory Message */}
                  <p className="text-xs sm:text-[13px] text-amber-100/95 font-medium max-w-lg mx-auto leading-relaxed bg-amber-500/5 px-4.5 py-3 rounded-2xl border border-amber-500/15 shadow-sm">
                    ¡Enhorabuena! Tu esfuerzo y dedicación han dado frutos, y este logro es totalmente merecido. ¡Te deseamos muchos más éxitos en el futuro!
                  </p>

                  {/* Top bar title */}
                  <div className="max-w-md mx-auto w-full border-b border-amber-500/20 pb-2">
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#f59e0b] font-mono">
                      {isTie ? `TOP 1: EMPATE (${winnersToDisplay.length} GANADORES)` : 'TOP 1: GANADOR ÚNICO'}
                    </span>
                  </div>

                  {/* Winners flex podium with "=" separation signs if tied */}
                  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 relative z-10 py-1">
                    {winnersToDisplay.map((part, index) => {
                      const matchedModel = models.find(m => m.id === part.userId || m.name.toLowerCase() === part.name.toLowerCase());
                      const isWinnerSelf = part.userId === userProfile.id || part.name.toLowerCase() === userProfile.name.toLowerCase();
                      const winnerProj = (isWinnerSelf ? userProjects.find(p => p.userId === userProfile.id) : null)
                        || userProjects.find(p => p.userId === part.userId || p.id === part.projectId)
                        || userProjects[0];
                      const rawImages = winnerProj && winnerProj.images && winnerProj.images.length > 0 ? winnerProj.images : [];
                      const defaultImages = [
                        'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600',
                        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600',
                        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600',
                        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600',
                        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600'
                      ];
                      const list = [...rawImages].filter(Boolean);
                      if (list.length === 0) {
                        list.push(defaultImages[0], defaultImages[1], defaultImages[2]);
                      } else {
                        while (list.length < 3) {
                          const nextImg = defaultImages.find(img => !list.includes(img)) || defaultImages[list.length % defaultImages.length];
                          list.push(nextImg);
                        }
                      }
                      const winnerProjectImages = list.slice(0, 3);

                      return (
                        <React.Fragment key={part.userId}>
                          {/* Vertical wrapper containing the card, the project slider, and then the gold quantity directly beneath it */}
                          <div className="flex flex-col items-center gap-3">
                            {/* Individual Winner Profile Panel */}
                            <div className="flex flex-col items-center bg-slate-900/60 border border-amber-500/30 rounded-2xl p-4 min-w-[130px] sm:min-w-[150px] shadow-lg relative group transition hover:scale-105 hover:border-amber-500/75">
                              {/* Golden Crown overlap in the upper right angle */}
                              <div className="absolute -top-3.5 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full border border-slate-950 shadow-md">
                                <Crown className="w-3.5 h-3.5 text-slate-950 fill-current" />
                              </div>

                              <div className="relative mb-2.5">
                                <img
                                  src={part.avatar}
                                  alt={part.name}
                                  onClick={() => {
                                    if (matchedModel && onSelectModel) {
                                      onSelectModel(matchedModel);
                                    }
                                  }}
                                  onError={(e) => handleAvatarError(e, part.name)}
                                  referrerPolicy="no-referrer"
                                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-400 shadow-inner cursor-pointer transition hover:brightness-110"
                                />
                              </div>

                              <span 
                                onClick={() => {
                                  if (matchedModel && onSelectModel) {
                                    onSelectModel(matchedModel);
                                  }
                                }}
                                className="text-white font-extrabold text-xs block truncate cursor-pointer hover:text-amber-300 hover:underline max-w-[125px]"
                              >
                                {part.name}
                              </span>

                              {/* Standardized orange vote progress bar line representing 100% of maximum */}
                              <div className="mt-2 w-full space-y-1 text-center">
                                <span className="text-[9.5px] text-slate-400 font-mono block">Votos: {part.votesReceived}</span>
                                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-500 transition-all duration-700" style={{ width: '100%' }} />
                                </div>
                              </div>
                            </div>

                            {/* PROJECT IMAGES SLIDER - Directly on top of GANANCIA card */}
                            <WinnerProjectSlider images={winnerProjectImages} />

                            {/* QUANTITY WON - Centered directly beneath the box in bright gold */}
                            <div className="bg-slate-950/90 border border-amber-500/50 rounded-xl px-3.5 py-1 text-center shadow-lg shadow-amber-500/10 animate-pulse w-full max-w-[240px]">
                              <span className="text-[9px] text-[#f59e0b] block uppercase tracking-widest font-black font-sans leading-none mb-0.5">GANANCIA</span>
                              <strong className="text-sm font-black text-amber-400 font-mono tracking-wider block">
                                +{prizePerWinner.toFixed(2)} €
                              </strong>
                            </div>
                          </div>

                          {/* Tie Separation Indicator */}
                          {index < winnersToDisplay.length - 1 && (
                            <div className="text-3xl font-black text-amber-500 px-1 font-mono select-none self-center">
                              =
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* BENEFICIO GANADOR ÚNICO O REPARTO MULTI-GANADOR */}
                  <div className="mt-4 pt-4 border-t border-slate-900/60 text-left space-y-3">
                    {!isTie ? (
                      <div className="bg-indigo-550/10 border border-indigo-500/20 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1 flex-1 text-left">
                          <span className="text-[9.5px] font-black text-amber-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
                            Beneficio Extraordinario - ÚNICO GANADOR
                          </span>
                          <p className="text-slate-300 text-xs leading-relaxed max-w-xl font-sans">
                            ¡Máxima rentabilidad! Al ser <strong className="text-white">{winnersToDisplay[0]?.name}</strong> el único ganador de la mesa, se adjudica el <strong>100% de la bolsa de reparto de inversores</strong> sin división alguna.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl space-y-1">
                        <span className="text-[9.5px] font-black text-amber-400 uppercase tracking-widest font-mono">
                          Bolsa Repartida por Empate Multi-Ganador
                        </span>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          Al haber un empate de {winnersToDisplay.length} modelos, la bolsa se reparte equitativamente entre ellos: cada uno recibe un beneficio de <strong>{prizePerWinner.toFixed(2)} €</strong> (sobre el total de {prizeTotal80.toFixed(2)} €).
                        </p>
                      </div>
                    )}

                    {/* Regla educativa de los 10 ganadores */}
                    <div className="bg-slate-950/60 p-3.5 border border-slate-900 rounded-xl text-[11px] text-slate-400 leading-relaxed">
                      💡 <strong>Regla del Pool de Ganadores:</strong> Recordemos que en la mesa de votación pueden resultar ganadores simultáneos de <strong>hasta 10 ganadores</strong>. Esto sucedería de forma equitativa en el escenario de que cada uno de los 10 usuarios presentes de la mesa asigne su voto a un proyecto diferente.
                    </div>
                  </div>

                  {/* Mobil equitive banner */}
                  {isTie && (
                    <p className="text-[10px] text-slate-400 font-bold block xl:hidden bg-slate-950/40 py-1.5 px-3 rounded-lg border border-slate-850 w-fit mx-auto">
                      💡 Diseña Equitativo para Ganadores Empatados
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* BLOQUE DE RECONOCIMIENTO (HONORES, PATROCINADORES Y MARCAS) */}
            <div className="space-y-3">
              <h3 className="text-[10.5px] font-black tracking-widest uppercase text-slate-450 font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                BLOQUE DE RECONOCIMIENTO (HONORES, PATROCINADORES Y MARCAS)
              </h3>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 relative overflow-hidden">
                {/* Visual Header Pill Banner inside */}
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl py-2.5 px-4 shadow-inner text-center">
                  <span className="text-[10.5px] sm:text-xs font-black text-[#f59e0b] uppercase tracking-widest block font-sans">
                    ¡Felicidades a los patrocinadores ganadores!
                  </span>
                  <span className="text-[9px] text-[#9aa8c6] uppercase tracking-wider block mt-0.5 font-mono">
                    Menciones de honor a los patrocinadores y marcas
                  </span>
                </div>

                {/* ROW 1: DIAMOND SPONSORS - Sponsor of Alessandra Ambrosio */}
                <div className="pb-4">
                  <div className={`grid gap-4 ${isTie ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                     {/* Dynamic Sponsor calculation */}
                     {(() => {
                       const mainWinnerName = winnersToDisplay[0]?.name || 'Alessandra Ambrosio';
                       const mainWinnerId = winnersToDisplay[0]?.userId;
                       
                       let sponsorModel = (userProfile?.patrocinadorId && models.find(m => m.id === userProfile.patrocinadorId)) || models.find(m => m.name.toLowerCase().includes("alexander") || m.username.includes("alexander")) || models.find(m => m.id === "topm-1") || models[0];
                       
                       if (mainWinnerId) {
                         if (mainWinnerId === userProfile.id) {
                           // User won. Locate their real sponsor from profile
                           const userSponsor = models.find(m => m.id === userProfile.patrocinadorId);
                           if (userSponsor) sponsorModel = userSponsor;
                         } else {
                           // If winner is Sophia Loren or Isabella, etc. Let's find if we can identify their sponsor
                           if (mainWinnerName.toLowerCase().includes('alessandra')) {
                             const rs = models.find(m => m.id === 'topf-1' || m.id === 'model-1');
                             if (rs) sponsorModel = rs;
                           }
                         }
                       }

                       const sponsorName = sponsorModel?.name || "Alexander Vance";
                       const sponsorBio = sponsorModel?.bio || 'Modelo internacional y apasionado/a del fitness. Enfocado/a en expandir mi red de afiliados.';

                       // Extract selected photos
                       const sponsorImages = (() => {
                         if (sponsorModel) {
                           if (sponsorModel.selectedWinnerPhotos && sponsorModel.selectedWinnerPhotos.length > 0) {
                             return sponsorModel.selectedWinnerPhotos;
                           }
                           if (sponsorModel.photos && sponsorModel.photos.length > 0) {
                             return sponsorModel.photos;
                           }
                           if (sponsorModel.avatar) {
                             return [sponsorModel.avatar];
                           }
                         }
                         return ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'];
                       })();

                       return (
                         <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center gap-4.5 p-4.5 transition hover:border-amber-500/40 shadow-lg w-full">
                           {/* Image Slider of selected photos by sponsor */}
                           <SponsorSlider images={sponsorImages} modelName={sponsorName} />
                           
                           <div className="text-left font-sans flex-1 min-w-0">
                             <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest block font-mono">
                               Patrocinador de {mainWinnerName}
                             </span>
                             <strong className="text-sm sm:text-base md:text-lg font-black text-white block mt-0.5 truncate">
                               {sponsorName}
                             </strong>
                             <span className="text-[9px] text-[#9aa8c6] uppercase block tracking-wider font-mono mt-0.5">
                               Estatus: Sponsor Diamante Destacado
                             </span>
                              {/* Beneficio de Patrocinio de la Sesión Box */}
                              <div className="mt-3 mb-2 bg-amber-500/10 border border-amber-500/25 rounded-md p-3.5 flex items-center justify-between gap-4 max-w-sm">
                                <div className="text-left font-sans">
                                  <span className="text-[8.5px] text-[#f59e0b] block uppercase tracking-widest font-black leading-none mb-1">
                                    BENEFICIO DE PATROCINADOR (10%)
                                  </span>
                                  <span className="text-[10.5px] text-slate-400 block leading-tight">
                                    Por éxito en la mesa de votaciones
                                  </span>
                                </div>
                                <div className="bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-black font-mono tracking-wider shadow-md shrink-0">
                                  +{(pool * 0.1).toFixed(2)} €
                                </div>
                              </div>

                             <p className="text-xs text-slate-350 mt-1 max-w-xl leading-normal line-clamp-3">
                               {sponsorBio}
                             </p>
                           </div>
                         </div>
                       );
                     })()}

                    {/* Aria Couture */}
                    {isTie && (
                      <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center gap-4.5 p-4.5 transition hover:border-amber-500/40 animate-fade-in">
                        <img 
                          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&auto=format&fit=crop&q=80" 
                          alt="Aria Couture" 
                          className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border border-slate-700 shrink-0"
                        />
                        <div className="text-left font-sans">
                          <strong className="text-sm sm:text-base font-extrabold text-white block">Aria Couture</strong>
                          <span className="text-[10px] text-[#9aa8c6] uppercase block tracking-wider font-mono mt-0.5">(Diamond Sponsor)</span>
                          <p className="text-[11px] text-slate-400 mt-1 max-w-xs leading-normal hidden sm:block">
                            Moda vanguardista y pasarelas conceptuales de alta gama.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Felicidades/Enhorabuena notice directly below the Diamond Sponsor card row */}
                <div className="py-3 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-t border-b border-slate-800/80 text-center animate-fade-in">
                  <p className="text-xs sm:text-sm font-bold text-amber-400 tracking-wide font-sans flex items-center justify-center gap-2">
                    <span>✨</span>
                    <span>Enhorabuena a las empresas de patrocinio.</span>
                    <span>✨</span>
                  </p>
                </div>

                {/* ROW 2: CORPORATE SPONSOR COMPANIES (Full Span Grid, Platinum removed as requested) */}
                <div className="pt-3">
                  {/* Right hand elegant platinum grid button blocks now in absolute full-width span */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {allWinnersRepresentBrands ? (
                      /* When multiple winners represent brands, render them as beautiful sponsor cards in full space */
                      winnersWithBrands.map((item, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-indigo-950/50 to-slate-950 rounded-xl border-2 border-indigo-505 p-3.5 text-center flex flex-col items-center justify-center gap-1.5 transition hover:border-indigo-400 animate-fade-in shadow-md">
                          <span className="text-indigo-400 text-2xl">{item.brand?.emoji || '👑'}</span>
                          <strong className="text-xs font-black text-white block truncate w-full">
                            {item.brand?.brandName}
                          </strong>
                          <span className="text-[8px] text-amber-400 block uppercase font-mono tracking-widest mt-0.5">MARCA GANADORA</span>
                        </div>
                      ))
                    ) : (
                      /* Default general platinum sponsors list - Expanded with many more boxes to occupy the reclaimed space */
                      <>
                        {/* Company 1 */}
                        <div className="bg-slate-950/90 rounded-xl border border-slate-800/80 p-3.5 text-center flex flex-col items-center justify-center gap-1.5 transition hover:border-slate-600 hover:bg-slate-950">
                          <span className="text-slate-300 text-xl">🏢</span>
                          <strong className="text-[11.5px] font-bold text-slate-200 block truncate w-full">Eco Builders</strong>
                          <span className="text-[8px] text-slate-400 block uppercase font-mono tracking-widest">Sponsor Oficial</span>
                        </div>

                        {/* Company 2 */}
                        <div className="bg-slate-950/90 rounded-xl border border-slate-800/80 p-3.5 text-center flex flex-col items-center justify-center gap-1.5 transition hover:border-slate-600 hover:bg-slate-950">
                          <span className="text-slate-300 text-xl font-emoji">📡</span>
                          <strong className="text-[11.5px] font-bold text-slate-200 block truncate w-full">Connect Telecom</strong>
                          <span className="text-[8px] text-slate-400 block uppercase font-mono tracking-widest">Sponsor Oficial</span>
                        </div>

                        {/* Company 3 */}
                        <div className="bg-slate-950/90 rounded-xl border border-slate-800/80 p-3.5 text-center flex flex-col items-center justify-center gap-1.5 transition hover:border-slate-600 hover:bg-slate-950">
                          <span className="text-slate-300 text-xl font-emoji">📈</span>
                          <strong className="text-[11.5px] font-bold text-slate-200 block truncate w-full">Future Finance</strong>
                          <span className="text-[8px] text-slate-400 block uppercase font-mono tracking-widest">Sponsor Oficial</span>
                        </div>

                        {/* Company 4 */}
                        <div className="bg-slate-950/90 rounded-xl border border-slate-800/80 p-3.5 text-center flex flex-col items-center justify-center gap-1.5 transition hover:border-slate-600 hover:bg-slate-950">
                          <span className="text-slate-300 text-xl font-emoji">👕</span>
                          <strong className="text-[11.5px] font-bold text-slate-200 block truncate w-full">NextGen Apparel</strong>
                          <span className="text-[8px] text-slate-400 block uppercase font-mono tracking-widest">Sponsor Oficial</span>
                        </div>

                        {/* Company 5 */}
                        <div className="bg-slate-950/90 rounded-xl border border-slate-800/80 p-3.5 text-center flex flex-col items-center justify-center gap-1.5 transition hover:border-slate-600 hover:bg-slate-950">
                          <span className="text-slate-300 text-xl font-emoji">🎬</span>
                          <strong className="text-[11.5px] font-bold text-slate-200 block truncate w-full">Creative Media</strong>
                          <span className="text-[8px] text-slate-400 block uppercase font-mono tracking-widest">Sponsor Oficial</span>
                        </div>

                        {/* Company 6 */}
                        <div className="bg-slate-950/90 rounded-xl border border-slate-800/80 p-3.5 text-center flex flex-col items-center justify-center gap-1.5 transition hover:border-slate-600 hover:bg-slate-950">
                          <span className="text-slate-300 text-xl font-emoji">🚚</span>
                          <strong className="text-[11.5px] font-bold text-slate-200 block truncate w-full">Prime Logistics</strong>
                          <span className="text-[8px] text-slate-400 block uppercase font-mono tracking-widest">Sponsor Oficial</span>
                        </div>

                        {/* Company 7 */}
                        <div className="bg-slate-950/90 rounded-xl border border-slate-800/80 p-3.5 text-center flex flex-col items-center justify-center gap-1.5 transition hover:border-slate-600 hover:bg-slate-950">
                          <span className="text-slate-300 text-xl font-emoji">💎</span>
                          <strong className="text-[11.5px] font-bold text-slate-200 block truncate w-full">Luxury Esthetics</strong>
                          <span className="text-[8px] text-slate-400 block uppercase font-mono tracking-widest">Sponsor Oficial</span>
                        </div>

                        {/* Company 8 */}
                        <div className="bg-slate-950/90 rounded-xl border border-slate-800/80 p-3.5 text-center flex flex-col items-center justify-center gap-1.5 transition hover:border-slate-600 hover:bg-slate-950">
                          <span className="text-slate-300 text-xl font-emoji">🏗️</span>
                          <strong className="text-[11.5px] font-bold text-slate-200 block truncate w-full">Nova Developers</strong>
                          <span className="text-[8px] text-slate-400 block uppercase font-mono tracking-widest">Sponsor Oficial</span>
                        </div>

                        {/* Company 9 */}
                        <div className="bg-slate-950/90 rounded-xl border border-slate-800/80 p-3.5 text-center flex flex-col items-center justify-center gap-1.5 transition hover:border-slate-600 hover:bg-slate-950">
                          <span className="text-slate-300 text-xl font-emoji">⚡</span>
                          <strong className="text-[11.5px] font-bold text-slate-200 block truncate w-full">Vanguard Textiles</strong>
                          <span className="text-[8px] text-slate-400 block uppercase font-mono tracking-widest">Sponsor Oficial</span>
                        </div>

                        {/* Company 10 */}
                        <div className="bg-slate-950/90 rounded-xl border border-slate-800/80 p-3.5 text-center flex flex-col items-center justify-center gap-1.5 transition hover:border-slate-600 hover:bg-slate-950">
                          <span className="text-slate-300 text-xl font-emoji">🍉</span>
                          <strong className="text-[11.5px] font-bold text-slate-200 block truncate w-full">Apex Foods</strong>
                          <span className="text-[8px] text-slate-400 block uppercase font-mono tracking-widest">Sponsor Oficial</span>
                        </div>

                        {/* Company 11 */}
                        <div className="bg-slate-950/90 rounded-xl border border-slate-800/80 p-3.5 text-center flex flex-col items-center justify-center gap-1.5 transition hover:border-slate-600 hover:bg-slate-950">
                          <span className="text-slate-300 text-xl font-emoji">✈️</span>
                          <strong className="text-[11.5px] font-bold text-slate-200 block truncate w-full">Stellar Aviation</strong>
                          <span className="text-[8px] text-slate-400 block uppercase font-mono tracking-widest">Sponsor Oficial</span>
                        </div>

                        {/* Company 12 */}
                        <div className="bg-slate-950/90 rounded-xl border border-slate-800/80 p-3.5 text-center flex flex-col items-center justify-center gap-1.5 transition hover:border-slate-600 hover:bg-slate-950">
                          <span className="text-slate-400 text-xl font-emoji">💆</span>
                          <strong className="text-[11.5px] font-bold text-slate-200 block truncate w-full">Aura Wellness</strong>
                          <span className="text-[8px] text-slate-400 block uppercase font-mono tracking-widest">Sponsor Oficial</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Platinum signature subtitle */}
                <div className="text-center pt-2.5 border-t border-slate-850 w-full">
                  <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">Marcas y Empresas Socias del Ecosistema</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (4/12 OF SCREEN WIDTH): PARTICIPANTS list & ACTIONS */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 10 PARTICIPANTES TOTALES */}
            <div className="space-y-3">
              <h3 className="text-[10.5px] font-black tracking-widest uppercase text-slate-450 font-mono flex items-center justify-between">
                <span>10 PARTICIPANTES TOTALES</span>
                <span className="text-emerald-400">100% Votos</span>
              </h3>

              <div className="bg-slate-900 border border-slate-850 rounded-3xl p-5 space-y-4">
                {/* 2-column grid inside the participant card with no-scrollbar class */}
                <div className="grid grid-cols-2 gap-4 max-h-[440px] overflow-y-auto no-scrollbar">
                  {completedSessionToDisplay.participants.map((part) => {
                    const isSelf = part.userId === userProfile.id;
                    const matchedModel = models.find(m => m.id === part.userId || m.name.toLowerCase() === part.name.toLowerCase());
                    const participantProject = userProjects.find(p => p.userId === part.userId || p.id === part.projectId) || userProjects[0];
                    const hasPaidCompleted = completedSessionToDisplay.participants.some(p => p.userId === userProfile.id);

                    return (
                      <div 
                        key={part.userId} 
                        onClick={() => {
                          if (!hasPaidCompleted && !isSelf) {
                            alert(`⚠️ Para poder ver los proyectos de los participantes de esta sesión debes haber realizado el pago de inscripción.`);
                            return;
                          }
                          if (participantProject) {
                            setSelectedProject(participantProject);
                          }
                        }}
                        title={hasPaidCompleted || isSelf ? `Haz clic para abrir el proyecto de ${part.name}` : `🔒 Proyecto oculto (requiere pago)`}
                        className={`bg-slate-950/60 rounded-2xl p-4 border flex flex-col justify-between items-start space-y-2.5 transition hover:scale-[1.02] active:scale-98 cursor-pointer select-none ${
                          hasPaidCompleted || isSelf ? 'border-slate-850/85 hover:border-indigo-500 hover:bg-slate-950/95' : 'border-amber-900/40 opacity-80'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate w-full text-left">
                          <img 
                            src={part.avatar} 
                            alt={part.name} 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!hasPaidCompleted && !isSelf) {
                                alert(`⚠️ Para poder ver los proyectos de los participantes de esta sesión debes haber realizado el pago de inscripción.`);
                                return;
                              }
                              if (participantProject) {
                                setSelectedProject(participantProject);
                              }
                            }}
                            onError={(e) => handleAvatarError(e, part.name)}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-full object-cover border-2 border-slate-800/80 shrink-0 cursor-pointer hover:scale-105 transition-transform duration-150" 
                            title={hasPaidCompleted || isSelf ? `Ver proyecto de @${part.name}` : `🔒 Proyecto oculto`}
                          />
                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!hasPaidCompleted && !isSelf) {
                                alert(`⚠️ Para poder ver los proyectos de los participantes de esta sesión debes haber realizado el pago de inscripción.`);
                                return;
                              }
                              if (participantProject) {
                                setSelectedProject(participantProject);
                              }
                            }}
                            className="text-white font-extrabold text-xs sm:text-sm truncate cursor-pointer hover:text-indigo-400"
                            title={hasPaidCompleted || isSelf ? `Ver proyecto de @${part.name}` : `🔒 Proyecto oculto`}
                          >
                            {part.name}
                          </span>
                        </div>
                        
                        <div className="w-full text-left flex items-center justify-between mt-1">
                          {isSelf ? (
                            <span className="text-[9.5px] font-bold text-red-400 bg-red-500/10 border border-red-500/25 px-2 py-0.5 rounded uppercase tracking-tight flex items-center gap-1">
                              <X className="w-2.5 h-2.5 shrink-0" />
                              <span>Mesa</span>
                            </span>
                          ) : (
                            <span className="text-[9.5px] font-bold text-indigo-400 bg-indigo-505/10 border border-indigo-505/20 px-2 py-0.5 rounded uppercase tracking-tight flex items-center gap-1">
                              <Check className="w-2.5 h-2.5 shrink-0" />
                              <span>Votado</span>
                            </span>
                          )}
                          <span className="text-[11px] font-black text-amber-400 font-mono tracking-tight bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {part.votesReceived} {part.votesReceived === 1 ? 'voto' : 'votos'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* FLUJO DE VOTACIÓN (PASOS FINALES) */}
            <div className="space-y-3">
              <h3 className="text-[10.5px] font-black tracking-widest uppercase text-slate-450 font-mono">
                FLUJO DE VOTACIÓN (PASOS FINALES)
              </h3>

              <div className="bg-slate-900 border border-slate-850 rounded-3xl p-4 space-y-4">
                {/* Horizontal Stepper Row precisely representing node connectors */}
                <div className="flex items-center justify-between gap-1 py-1 px-2 relative">
                  {/* Decorative guide line */}
                  <div className="absolute top-[21px] left-[35px] right-[35px] h-0.5 bg-slate-800 pointer-events-none z-0" />

                  {/* Step 1 Node */}
                  <div className="flex flex-col items-center text-center gap-1.5 relative z-10">
                    <div className="w-9 h-9 bg-slate-950 border border-slate-700 text-slate-400 rounded-full flex items-center justify-center text-sm shadow-sm" title="Votación de 10 participantes">
                      <Users className="w-4 h-4 text-slate-350" />
                    </div>
                    <span className="text-[8.5px] font-bold text-slate-400 tracking-tight leading-none block">
                      10 Jugadores Votan
                    </span>
                  </div>

                  {/* Connector Arrow */}
                  <span className="text-slate-600 font-mono text-xs z-10">➔</span>

                  {/* Step 2 Node */}
                  <div className="flex flex-col items-center text-center gap-1.5 relative z-10">
                    <div className="w-9 h-9 bg-slate-950 border border-slate-700 text-slate-400 rounded-full flex items-center justify-center text-sm shadow-sm" title="Escrutinio síncrono">
                      <Terminal className="w-4 h-4 text-slate-350" />
                    </div>
                    <span className="text-[8.5px] font-bold text-slate-400 tracking-tight leading-none block">
                      Conteo
                    </span>
                  </div>

                  {/* Connector Arrow */}
                  <span className="text-slate-600 font-mono text-xs z-10">➔</span>

                  {/* Step 3 Node - Glowing active Results phase */}
                  <div className="flex flex-col items-center text-center gap-1.5 relative z-10">
                    <div className="w-9 h-9 bg-amber-500/10 border-2 border-amber-500 text-amber-500 rounded-full flex items-center justify-center text-sm shadow-md shadow-amber-500/10 animate-pulse" title="Lobby de Escrutinio Abierto">
                      <Trophy className="w-4 h-4 text-amber-500 fill-current" />
                    </div>
                    <span className="text-[8.5px] font-black text-amber-400 tracking-tight leading-none block">
                      Resultados
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* DETAILS TALLY SHEET DRAWER DROPDOWN PANEL (Controlled dynamically) */}
        {showFullTally && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden p-6 space-y-4 animate-fade-in text-left relative z-10" id="details-tally-sheet">
            <h3 className="text-xs font-bold text-slate-300 font-mono tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>Escalafón y Tally de Resultados Completos</span>
            </h3>

            <div className="divide-y divide-slate-800/80 font-mono text-[11px] max-h-[300px] overflow-y-auto pr-1">
              {sortedParticipantsForRanking.map((part, rankingIndex) => {
                const isAwardWinner = rankingIndex === 0;
                const matchedModel = models.find(m => m.id === part.userId || m.name.toLowerCase() === part.name.toLowerCase());
                return (
                  <div key={part.userId} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-2.5 text-left">
                      <span className={`w-5 text-right font-extrabold text-[10px] ${isAwardWinner ? 'text-amber-400' : 'text-slate-500'}`}>
                        {rankingIndex + 1}
                      </span>
                      <img 
                        src={part.avatar} 
                        alt={part.name} 
                        onClick={() => {
                          if (matchedModel && onSelectModel) {
                            onSelectModel(matchedModel);
                          }
                        }}
                        onError={(e) => handleAvatarError(e, part.name)}
                        referrerPolicy="no-referrer"
                        className={`w-5 h-5 rounded-full object-cover border border-slate-700 transition cursor-pointer ${
                          isAwardWinner ? 'border-amber-400' : ''
                        }`}
                      />
                      <span 
                        onClick={() => {
                          if (matchedModel && onSelectModel) {
                            onSelectModel(matchedModel);
                          }
                        }}
                        className={`${
                          isAwardWinner ? 'text-amber-300 font-bold' : 'text-slate-300'
                        } cursor-pointer hover:text-indigo-400`}
                      >
                        @{part.name} {part.userId === userProfile.id && '(Tú)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1 rounded-full bg-slate-800 overflow-hidden hidden sm:block">
                        <div 
                          className={`h-full ${isAwardWinner ? 'bg-amber-400' : 'bg-slate-650'}`}
                          style={{ width: `${(part.votesReceived / Math.max(maxVotes, 1)) * 100}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold ${isAwardWinner ? 'text-amber-400' : 'text-slate-400'}`}>
                        {part.votesReceived} votos
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FINANCIAL SUMMARY HIGHLIGHT CARDS FOR AWARD RECOGNITION */}
        <div className="bg-slate-900/60 border border-slate-850 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-left relative z-10">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5 font-mono">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Mi Portafolio Creativo de Finanzas</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed block">
              Examina tus retornos acumulados, movimientos de fondos, saldo de patrocinador y los históricos de rendimientos de forma inmediata.
            </p>
          </div>
          <button
            onClick={() => {
              if (onNavigateToTab) {
                setCompletedSessionToDisplay(null);
                setSimulationLogs([]);
                onNavigateToTab('finance');
              }
            }}
            className="w-full sm:w-auto shrink-0 px-5 py-2.5 bg-gradient-to-r from-white via-pink-100 to-pink-500 hover:brightness-110 text-[#1a1516] border border-pink-200/50 font-black rounded-xl text-[11px] uppercase tracking-wide transition active:scale-95 cursor-pointer shadow-md flex items-center justify-center gap-1.5"
          >
            <span>Ir a Mi Portafolio</span>
            <ChevronRight className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* BOTTOM CTA CONTROL WRAPPER */}
        <div className="text-center pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-900/85 relative z-10">
          <div className="flex items-center gap-2 text-slate-450 text-[10px] text-left">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Asignación del 10% de afiliación y 10% de comisión de plataforma ejecutado con éxito.</span>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Cerrar Concurso Button */}
            <button
               onClick={() => {
                 setCompletedSessionToDisplay(null);
                 setSimulationLogs([]);
                 setIsCastingPublished(false);
               }}
               className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-white via-pink-100 to-pink-500 hover:brightness-105 text-black border border-pink-250 font-black text-[11px] uppercase tracking-wider rounded-xl transition active:scale-95 cursor-pointer shadow-md"
            >
              <span>Cerrar Concurso</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show active graphical waiting room if the user has voted but others are deciding
  const userInSessionObj = currentSession?.participants.find(p => p.userId === userProfile.id);
  const showWaitingRoom = currentSession && currentSession.status === 'voting' && userInSessionObj?.hasVoted;

  if (showWaitingRoom) {
    const totalVotesInSession = currentSession.participants.filter(p => p.hasVoted).length;
    const progressPercent = (totalVotesInSession / 10) * 100;

    // Next voter in queue who has not voted
    const pendingVotersList = currentSession.participants.filter(p => !p.hasVoted);
    const activeVotingVoter = pendingVotersList.length > 0 ? pendingVotersList[0] : null;

    return (
      <div className="bg-[#fff3f4] border border-pink-100 text-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden text-left animate-fade-in" id="waiting-consensus-screen">
        {/* Pulsing visual decoration overlay mimicking real cryptographic voting queue */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-200/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-200/10 rounded-full blur-3xl pointer-events-none" />

        {/* HEADER BRAND */}
        <div className="border-b border-pink-100 pb-5 space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-extrabold uppercase text-[#fe2c55] tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#fe2c55] animate-ping shrink-0" />
            <span className="font-mono flex items-center gap-1.5 bg-pink-100/70 border border-pink-200 px-2.5 py-0.5 rounded-md text-[#fe2c55]">
              <Cpu className="w-3.5 h-3.5 text-[#fe2c55]" />
              <span>CUSTODIA SEGURA ACTIVA • CONTRATOS INTELIGENTES</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-900 flex items-center gap-2">
                <Clock className="w-6 h-6 text-rose-500 animate-pulse animate-spin shrink-0" />
                <span>Mesa de Escrutinio en Tiempo Real</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Lobby: <strong className="text-slate-900">{currentSession.title}</strong> — Por favor, mantente a la espera mientras se recopilan y verifican las firmas de los demás miembros de la mesa.
              </p>
            </div>

            {/* Simulated simulation accelerator trigger fallback */}
            <button
              onClick={handleSimulateAIVotes}
              className="px-3.5 py-2 bg-white hover:bg-pink-50 text-xs font-semibold rounded-xl text-[#fe2c55] border border-pink-200 transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fe2c55] animate-pulse" />
              <span>Acelerar con Votos IA</span>
            </button>
          </div>
        </div>

        {/* GRAPHICAL RADAR AND OVERALL VOTE COUNTER PROGRESS PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-white/70 p-5 sm:p-6 rounded-2xl border border-pink-100/60">
          
          {/* Column 1: Graphical gauge scanning consensus metrics */}
          <div className="lg:col-span-5 flex flex-col items-center text-center py-2 space-y-3 relative">
            {/* Pulsing ring radial effect */}
            <div className="w-32 h-32 rounded-full border-4 border-pink-100 flex items-center justify-center relative bg-white border-dashed animate-pulse">
              <div className="absolute inset-0.5 rounded-full border border-[#fe2c55]/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-pink-100" />
              
              <div className="space-y-0.5 z-10 text-center">
                <span className="text-3xl font-extrabold font-mono text-[#fe2c55] block">{totalVotesInSession}</span>
                <span className="text-[9px] text-slate-550 block uppercase font-mono tracking-wider">de 10 votos</span>
              </div>
            </div>

            <div className="space-y-1">
              <strong className="text-xs font-bold text-slate-800 block">Escrutinio Descentralizado</strong>
              <span className="text-[10px] text-slate-500 block font-sans">Computando resultados instantáneos al completar las firmas.</span>
            </div>
          </div>

          {/* Column 2: Progress bar filled gradient & Next voter info */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-mono font-bold">
                <span className="text-slate-600">Progreso de la Votación</span>
                <span className="text-[#fe2c55] font-extrabold">{progressPercent}% completado</span>
              </div>

              {/* Progress track */}
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-pink-150 p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 via-[#fe2c55] to-rose-700 transition-all duration-700 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/10 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-pink-100 flex items-center justify-between gap-3 text-xs leading-normal shadow-xs">
              <div className="flex items-center gap-3">
                {activeVotingVoter ? (
                  <>
                    <img 
                      src={activeVotingVoter.avatar} 
                      alt={activeVotingVoter.name} 
                      onError={(e) => handleAvatarError(e, activeVotingVoter.name)}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-lg object-cover border border-pink-100 animate-pulse ring-2 ring-[#fe2c55]/10"
                    />
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold font-mono text-[#fe2c55] block animate-pulse">
                        ● Evaluando Propuestas
                      </span>
                      <strong className="text-slate-800 block text-xs">
                        {activeVotingVoter.name} está asignando su voto...
                      </strong>
                    </div>
                  </>
                ) : (
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-extrabold font-mono text-emerald-600 block">
                      ● Cierre
                    </span>
                    <strong className="text-slate-800 block text-xs">
                      Todos los participantes han emitido su voto. Tabulando resultados...
                    </strong>
                  </div>
                )}
              </div>
              
              <div className="hidden sm:block text-right">
                <span className="text-[10px] text-slate-500 block font-mono font-bold">Consenso</span>
                <strong className="text-[#fe2c55] font-mono text-xs">{10 - totalVotesInSession} en cola</strong>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED ACTIVE PARTICIPANTS VOTING GRID */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
            Estado de Participantes ({totalVotesInSession}/10 Votaron)
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {currentSession.participants.map((part) => {
              const isSelf = part.userId === userProfile.id;
              const isActiveNext = activeVotingVoter && activeVotingVoter.userId === part.userId;

              let cardBg = 'bg-white border-pink-100 text-slate-500';
              let badgeText = '⏳ Esperando...';
              let badgeStyle = 'text-slate-500 bg-slate-100 border border-slate-200';

              if (part.hasVoted) {
                cardBg = 'bg-pink-100/30 border-pink-200 text-rose-800 ring-1 ring-pink-100/5';
                badgeText = '✓ Voto Cargado';
                badgeStyle = 'text-emerald-600 bg-emerald-50 border border-emerald-100';
              } else if (isActiveNext) {
                cardBg = 'bg-white border-[#fe2c55] text-slate-800 ring-2 ring-pink-500/10';
                badgeText = '🌀 Decidiendo...';
                badgeStyle = 'text-pink-650 bg-pink-50 border border-pink-200 animate-pulse';
              }

              const matchedModel = models.find(m => m.id === part.userId || m.name.toLowerCase() === part.name.toLowerCase());
              return (
                <div 
                  key={part.userId}
                  className={`p-3.5 rounded-xl border flex flex-col items-center text-center justify-between space-y-2.5 transition-all text-xs ${cardBg}`}
                >
                  <div className="relative">
                    <img
                      src={part.avatar}
                      alt={part.name}
                      onClick={() => {
                        if (matchedModel && onSelectModel) {
                          onSelectModel(matchedModel);
                        }
                      }}
                      onError={(e) => handleAvatarError(e, part.name)}
                      referrerPolicy="no-referrer"
                      className={`w-10 h-10 rounded-xl object-cover border transition-transform ${
                        part.hasVoted 
                          ? 'border-emerald-200' 
                          : isActiveNext 
                            ? 'border-[#fe2c55] ring-2 ring-pink-550/20 animate-pulse' 
                            : 'border-pink-100'
                      } ${matchedModel ? 'cursor-pointer hover:scale-105 hover:border-[#fe2c55]' : ''}`}
                      title={matchedModel ? `Ver perfil completo de ${part.name}` : undefined}
                    />
                    {isSelf && (
                      <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-[8px] font-extrabold px-1 py-0.2 rounded border border-slate-700 text-white font-mono scale-95 uppercase">
                        TÚ
                      </span>
                    )}
                  </div>

                  <div className="space-y-0.5 w-full">
                    <strong 
                      onClick={() => {
                        if (matchedModel && onSelectModel) {
                          onSelectModel(matchedModel);
                        }
                      }}
                      className={`text-slate-800 block truncate text-xs font-sans ${
                        matchedModel ? 'cursor-pointer hover:text-[#fe2c55] hover:underline' : ''
                      }`}
                      title={matchedModel ? `Ver perfil completo de ${part.name}` : undefined}
                    >
                      {part.name}
                    </strong>
                    <span className="text-[9px] text-slate-500 block truncate font-mono">
                      {isSelf ? 'Inversor Principal' : 'Miembro IA'}
                    </span>
                  </div>

                  <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${badgeStyle}`}>
                    {badgeText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TERMINAL ACTIVITY TICKET LOG LIST */}
        <div className="bg-white border border-pink-100 rounded-2xl p-5 space-y-3.5 font-mono shadow-xs">
          <div className="flex justify-between items-center text-xs">
            <h3 className="text-slate-700 font-bold tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-[#fe2c55]" />
              <span>Bitácora de Consenso y Auditoría Distribuida</span>
            </h3>
            <span className="text-pink-650 text-[10px] bg-pink-50 px-2 py-0.5 rounded flex items-center gap-1 border border-pink-100">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fe2c55] animate-ping" />
              <span>NODO_CONECTADO</span>
            </span>
          </div>

          <div className="bg-pink-50/50 rounded-xl p-4 max-h-40 overflow-y-auto font-mono text-[10px] text-slate-700 border border-pink-100/40 space-y-2 divide-y divide-pink-100/30 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {simulationLogs.map((log, idx) => (
              <p key={idx} className="pt-2 first:pt-0 leading-relaxed text-left">
                {log}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-150 p-6 space-y-6 shadow-sm relative overflow-hidden" id="automated-sessions-section">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-indigo-650 uppercase tracking-widest flex items-center gap-1">
            <Coins className="w-4 h-4" />
            <span>Mesa de Sesiones Colectivas</span>
          </span>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1 animate-fade-in text-left">Simulación de Rondas Colectivas</h2>
          <p className="text-xs text-slate-500 text-left">
            Únete a mesas de inversión y votación. Al completarse los 10 miembros todos votan, calculándose los ganadores de forma automática.
          </p>
        </div>

        {/* Dynamic Scheduler Pilot Button */}
        <button
          type="button"
          onClick={() => setShowSchedulerPanel(!showSchedulerPanel)}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer border ${
            showSchedulerPanel
              ? 'bg-amber-500 hover:bg-amber-600 border-amber-600 text-slate-950 shadow-md ring-2 ring-amber-500/20 shadow-amber-500/15'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-amber-400 hover:text-amber-300 shadow-sm'
          }`}
          title="Abrir programador de inversión automatizada"
          id="btn-toggle-auto-invest-panel"
        >
          <Cpu className={`w-4 h-4 ${showSchedulerPanel ? 'animate-spin' : 'animate-pulse'}`} style={{ animationDuration: '4s' }} />
          <span>{showSchedulerPanel ? 'Cerrar Piloto Automático' : '🤖 Programador Autónomo'}</span>
          {scheduledOrders.filter(o => o.status === 'pending' && o.userId === userProfile.id).length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
          )}
        </button>
      </div>

      {/* SUCCESS TOAST FOR AUTOMATED ORDER ACTIVATION */}
      {orderNotification && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/80 flex items-start justify-between gap-3 animate-bounce shadow-lg shadow-emerald-500/10" id="toast-order-execution-success">
          <div className="flex items-start gap-2.5">
            <span className="text-xl bg-slate-950 p-1.5 rounded-xl border border-slate-800">🤖</span>
            <div className="text-left">
              <strong className="text-emerald-400 font-extrabold text-xs block">PROCESO AUTÓNOMO EJECUTADO</strong>
              <p className="text-[11px] text-slate-205 font-medium leading-relaxed mt-0.5">{orderNotification}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setOrderNotification(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* EXTREMELY POLISHED AUTOMATED SCHEDULER PANEL */}
      {showSchedulerPanel && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/25 shadow-xl text-left animate-fade-in space-y-6 relative overflow-hidden" id="dashboard-auto-investor">
          {/* Neon mesh background effect */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest font-mono flex items-center gap-1">
                <span>SYSTEM PILOT ACTIVE</span>
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-white mt-1 flex items-center gap-1.5">
                <span>Programador de Inversiones Autónomas</span>
                <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 text-[9px] rounded-full uppercase tracking-wider font-mono animate-pulse">Servicio de Cola Activado</span>
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed block mt-0.5">
                Define reglas de inversión, activa la recurrencia y los fondos de entrada se asignarán automáticamente. El piloto automático evitará participaciones simultáneas para un mismo proyecto para tu seguridad (un mismo proyecto no puede participar en dos sesiones a la vez, pero varios proyectos diferentes sí podrán invertir de manera simultánea).
              </p>
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto">
              <span className="text-[10px] text-slate-550 font-mono tracking-wider">REFRESCO:</span>
              <button 
                type="button"
                onClick={async () => {
                  setIsSyncingOrders(true);
                  try {
                    const res = await fetch('/api/scheduled-orders');
                    if (res.ok) setScheduledOrders(await res.json());
                  } catch (e) {}
                  setIsSyncingOrders(false);
                }}
                disabled={isSyncingOrders}
                className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition cursor-pointer active:scale-95"
                title="Sincronizar cola de ejecución ahora"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOrders ? 'animate-spin text-amber-450' : 'text-slate-400'}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: DEFINE AUTOMATION RULE */}
            <form onSubmit={handleCreateScheduledOrder} className="lg:col-span-5 space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-850">
              <h4 className="text-[10px] font-extrabold text-amber-450 uppercase tracking-widest">Configurar Nueva Orden</h4>

              {/* 1. Select Round Tier */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold font-mono text-slate-400 uppercase tracking-wider flex justify-between">
                  <span>Monto de Inscripción (Mesa)</span>
                  <span className="text-amber-500 font-bold font-sans text-[9px]">6 Rondas Disponibles</span>
                </label>
                <select
                  value={schedEntryFee}
                  onChange={(e) => setSchedEntryFee(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white font-bold tracking-wide focus:outline-none"
                >
                  <option value={10}>10.00€ — Ronda de Plata (Trabajadores)</option>
                  <option value={100}>100.00€ — Ronda de Bronce (Emprendedores)</option>
                  <option value={1000}>1,000.00€ — Ronda de Acero (Empresarios)</option>
                  <option value={10000}>10,000.00€ — Ronda de Oro (Top Models)</option>
                  <option value={100000}>100,000.00€ — Ronda de Oro Rosa (Inversores)</option>
                  <option value={1000000}>1,000,000.00€ — Ronda de Platino (Millonarios)</option>
                </select>
              </div>

              {/* 2. Select Project to auto associate */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold font-mono text-slate-400 uppercase tracking-wider block">Proyecto o Sello Elegido</label>
                {userProjects.length === 0 ? (
                  <div className="text-[10px] text-amber-500 bg-amber-500/10 p-2.5 rounded-xl border border-amber-550/20 font-bold">
                    ⚠️ Primero debes registrar un proyecto comercial para poder seleccionarlo en las órdenes de inversión.
                  </div>
                ) : (
                  <select
                    value={schedProjectId}
                    onChange={(e) => setSchedProjectId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none"
                  >
                    {userProjects.map((p) => (
                      <option key={p.id} value={p.id}>💼 {p.title} (Presupuesto de Ref {p.budget}€)</option>
                    ))}
                  </select>
                )}
              </div>

              {/* 3. DateTime picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold font-mono text-slate-400 uppercase tracking-wider block">Horario de Ejecución Planificado</label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={schedTime}
                    required
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* 4. Recurrence selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold font-mono text-slate-400 uppercase tracking-wider block">Intervalo / Patrón Recurrente</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['none', 'daily', 'weekly', 'monthly'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSchedRecurrence(r)}
                      className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border cursor-pointer transition ${
                        schedRecurrence === r
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      {r === 'none' ? 'No' : r === 'daily' ? 'Diario' : r === 'weekly' ? 'Semana' : 'Mes'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={userProjects.length === 0 || isSyncingOrders}
                className={`w-full py-2.5 rounded-xl font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 border ${
                  userProjects.length > 0
                    ? 'bg-amber-500 border-amber-600 text-slate-950 hover:bg-amber-450 shadow-md shadow-amber-500/10'
                    : 'bg-slate-850 border-slate-850 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Guardar y Programar en Cola</span>
              </button>
            </form>

            {/* RIGHT COLUMN: QUEUES MONITOR LOBBY */}
            <div className="lg:col-span-7 space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between items-center bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-850">
                <span>Cola de Ejecución del Sistema ({scheduledOrders.filter(o => o.userId === userProfile.id).length})</span>
                <span className="text-[9px] text-amber-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  Ejecutor en Directo
                </span>
              </h4>

              <div className="max-h-[305px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin text-left">
                {scheduledOrders.filter(o => o.userId === userProfile.id).length === 0 ? (
                  <div className="py-12 border border-dashed border-slate-800 rounded-xl text-center space-y-3">
                    <p className="text-xs text-slate-500 font-medium">No hay reglas de autoinversión programadas para tu cuenta.</p>
                    <p className="text-[10px] text-slate-600 leading-normal max-w-sm mx-auto">
                      Define reglas en el formulario de la izquierda. El robot de la cola se encargará de realizar el pago por ti y asociar la propuesta de forma automática.
                    </p>
                  </div>
                ) : (
                  scheduledOrders
                    .filter(o => o.userId === userProfile.id)
                    .slice()
                    .reverse()
                    .map((item) => {
                      const isPending = item.status === 'pending';
                      const isExecuted = item.status === 'executed';
                      const isApplied = item.status === 'applied';
                      const isCancelled = item.status === 'cancelled';
                      const itemDate = new Date(item.dateTime);

                      let badgeStyle = "bg-slate-900 text-slate-505 border-slate-800";
                      let statusText = "Desconocido";
                      if (isPending) {
                        badgeStyle = "bg-amber-500/10 text-amber-450 border-amber-550/20";
                        statusText = "Programado";
                      } else if (isExecuted) {
                        badgeStyle = "bg-indigo-500/15 text-indigo-300 border-indigo-500/30 animate-pulse";
                        statusText = "Ejecutado";
                      } else if (isApplied) {
                        badgeStyle = "bg-emerald-500/10 text-emerald-450 border-emerald-500/25";
                        statusText = "Cobrado / Listo";
                      } else if (isCancelled) {
                        badgeStyle = "bg-rose-500/10 text-rose-450 border-rose-500/20";
                        statusText = "Cancelado";
                      }

                      return (
                        <div key={item.id} className="p-3 bg-slate-900 border border-slate-850 hover:border-slate-800 transition rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative">
                          <div className="space-y-1 block max-w-sm text-left">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${badgeStyle}`}>
                                {statusText}
                              </span>
                              <span className="text-[10px] text-amber-300 font-mono font-bold">
                                {item.entryFee.toLocaleString('es-ES')}€
                              </span>
                              {item.recurrence !== 'none' && (
                                <span className="bg-indigo-950/40 text-indigo-400 border border-indigo-900/40 text-[8px] font-bold px-1.5 py-0.2 rounded font-mono uppercase">
                                  🔁 {item.recurrence === 'daily' ? 'Diario' : item.recurrence === 'weekly' ? 'Semanal' : 'Mensual'}
                                </span>
                              )}
                            </div>

                            <p className="text-white text-xs font-bold line-clamp-1 mt-1 block">
                              💼 {item.projectName}
                            </p>
                            <p className="text-[10.5px] text-slate-400 font-mono block">
                              Target: <strong className="text-slate-350">{itemDate.toLocaleString('es-ES')}</strong>
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            {/* Force immediate execution trigger (Inmensely useful testing tool) */}
                            {isPending && (
                              <button
                                type="button"
                                onClick={() => handleForceManualTrigger(item.id)}
                                className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[9px] uppercase tracking-wide rounded-lg transition active:scale-95 cursor-pointer shadow-sm hover:shadow-indigo-500/20 flex items-center gap-1"
                                title="Forzar ejecución ahora mismo (saltarse espera)"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>Disparar Ya</span>
                              </button>
                            )}

                            {/* CANCEL ORDER / REMOVE LOG */}
                            <button
                              type="button"
                              onClick={() => handleCancelScheduledOrder(item.id)}
                              className="p-1.5 bg-slate-950 hover:bg-slate-800 hover:text-rose-400 text-slate-500 rounded-lg border border-slate-800 hover:border-slate-750 transition cursor-pointer active:scale-95"
                              title={isPending ? "Cancelar regla de autoinversión" : "Eliminar registro de la cola"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDER NAVIGATION FOR SESSIONS (ELEGANT 3D CAROUSEL DESIGN MATCHING ZZ.PNG) */}
      {(() => {
        let cardWidth = 300;
        let cardHeight = 220;
        let spacing = 190;
        let rotateYVal = 24;

        if (windowWidth < 640) {
          cardWidth = 230;
          cardHeight = 210;
          spacing = 90;
          rotateYVal = 18;
        } else if (windowWidth < 1024) {
          cardWidth = 270;
          cardHeight = 220;
          spacing = 150;
          rotateYVal = 22;
        }

        const visibleSessions = getVisibleSessions();
        const activeIndex = Math.max(0, visibleSessions.findIndex(s => s.id === activeSessionId));

        const handlePrevSession = () => {
          const prevIdx = (activeIndex - 1 + visibleSessions.length) % visibleSessions.length;
          setActiveSessionId(visibleSessions[prevIdx].id);
        };

        const handleNextSession = () => {
          const nextIdx = (activeIndex + 1) % visibleSessions.length;
          setActiveSessionId(visibleSessions[nextIdx].id);
        };

        return (
          <div className="relative w-full py-8 select-none flex flex-col items-center overflow-hidden" id="collective-sessions-slider-viewport">
            {/* 3D Stage Container */}
            <div 
              className="relative w-full flex items-center justify-center"
              style={{ 
                height: `${cardHeight + 40}px`,
                perspective: '1200px',
                perspectiveOrigin: '50% 50%'
              }}
            >
              {/* Left Arrow Button */}
              <button
                type="button"
                onClick={handlePrevSession}
                className="absolute left-2 sm:left-6 lg:left-12 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-200 bg-white/95 hover:bg-white text-slate-800 shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
                title="Ver mesa anterior"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800 pointer-events-none" />
              </button>

              {/* 3D Cards Stage */}
              <div 
                className="absolute w-full h-full flex items-center justify-center pointer-events-none"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {visibleSessions.map((sess, index) => {
                  const isSelected = sess.id === activeSessionId;
                  const offset = index - activeIndex;
                  const absOffset = Math.abs(offset);
                  
                  // Only render nearby cards for performance
                  const isVisible = absOffset <= 3;
                  if (!isVisible) return null;

                  const theme = getSessionTheme(sess.entryFee, isSelected);
                  const percent = Math.min(100, (sess.participants.length / 10) * 100);

                  const formattedFee = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(sess.entryFee) + '€';
                  const formattedPool = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(sess.poolTotal) + '€';

                  // Positioning & Rotation
                  const scale = offset === 0 ? 1.08 : 0.82 - (absOffset - 1) * 0.08;
                  const translateX = offset * spacing;
                  const translateZ = offset === 0 ? 50 : -100 - (absOffset - 1) * 50;
                  const rotateY = offset === 0 ? 0 : (offset < 0 ? rotateYVal : -rotateYVal);
                  const opacity = offset === 0 ? 1 : Math.max(0.15, 0.65 - (absOffset - 1) * 0.25);
                  const zIndex = 50 - absOffset;

                  return (
                    <div
                      key={sess.id}
                      onClick={() => {
                        setActiveSessionId(sess.id);
                      }}
                      className={`pointer-events-auto absolute rounded-2xl p-5 border text-left transition-all duration-350 cursor-pointer flex flex-col justify-between shadow-md ${theme.background} ${theme.cardShadow}`}
                      style={{
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                        opacity: opacity,
                        zIndex: zIndex,
                        transition: 'transform 0.4s ease-out, opacity 0.4s ease-out',
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      {/* Header Decoration */}
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border leading-none ${theme.badge}`}>
                          {theme.tierSlogan}
                        </span>

                        {isSelected ? (
                          <span className="p-1 bg-amber-500 text-slate-950 rounded-lg shadow-sm animate-pulse" title="Mesa activa">
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-350/40" />
                        )}
                      </div>

                      {/* Card Title & Value Specs */}
                      <div className="space-y-1">
                        <h3 className={`font-bold text-xs sm:text-sm tracking-tight truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {sess.title.replace('Sesión de Inversión de ', 'Mesa ')}
                        </h3>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-[10px] font-medium font-sans ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                            Monto de Entrada:
                          </span>
                          <strong className={`font-mono text-xs sm:text-sm leading-none ${theme.accentText}`}>
                            {formattedFee}
                          </strong>
                        </div>
                      </div>

                      {/* Recruitment state bar indicator */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] font-extrabold font-mono tracking-wide">
                          <span className={isSelected ? 'text-slate-350' : 'text-slate-400'}>CONVULSIÓN</span>
                          <span className={isSelected ? 'text-slate-200' : 'text-slate-650 font-semibold'}>
                            {sess.participants.length}/10 Miembros
                          </span>
                        </div>

                        <div className={`w-full h-1.5 rounded-full overflow-hidden border ${isSelected ? 'bg-white/10 border-white/5' : 'bg-slate-200/55 border-slate-100'}`}>
                          <div
                            className={`h-full rounded-full transition-all duration-550 ${theme.progressBarColor}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Bottom Stats Footer */}
                      <div className={`pt-3 border-t flex justify-between items-center ${isSelected ? 'border-white/10' : 'border-slate-100'}`}>
                        <span className={`text-[9px] font-extrabold uppercase tracking-widest inline-flex items-center gap-1.5 ${
                          sess.status === 'voting' ? 'text-rose-500' : isSelected ? 'text-slate-300' : 'text-slate-450'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full inline-block ${sess.status === 'voting' ? 'bg-rose-500 animate-ping' : isSelected ? 'bg-indigo-300' : 'bg-slate-400'}`} />
                          <span>{sess.status === 'voting' ? 'Escrutinio' : 'Reclutando'}</span>
                        </span>

                        <span className="text-[9px] font-bold flex items-baseline gap-1">
                          <span className={isSelected ? 'text-slate-300 font-medium' : 'text-slate-400 font-normal'}>Pool:</span>
                          <span className={`font-mono font-bold text-xs ${isSelected ? 'text-amber-300' : 'text-indigo-650'}`}>
                            {formattedPool}
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Arrow Button */}
              <button
                type="button"
                onClick={handleNextSession}
                className="absolute right-2 sm:right-6 lg:right-12 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-200 bg-white/95 hover:bg-white text-slate-800 shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
                title="Ver mesa siguiente"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-850 pointer-events-none" />
              </button>
            </div>

            {/* Slide Index indicator Dots */}
            <div className="flex gap-1.5 items-center justify-center pt-4 max-w-full px-4 overflow-x-auto selection:bg-transparent scrollbar-none">
              {visibleSessions.map((sess, dotIdx) => (
                <button
                  key={sess.id}
                  type="button"
                  onClick={() => {
                    setActiveSessionId(sess.id);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 shrink-0 ${
                    dotIdx === activeIndex 
                      ? 'w-6 bg-indigo-600' 
                      : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Ir al modelo ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>
        );
      })()}

      {currentSession ? (
        <div className="space-y-6">
          
          {/* Detailed Info Ribbon for the current active selection */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden shadow-sm" id="detail-active-ribbon">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl" />
            <div className="space-y-1 max-w-xl">
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md ${
                currentSession.status === 'voting' ? 'bg-rose-500 text-white shadow-sm' : 'bg-indigo-500 text-white shadow-sm'
              }`}>
                {currentSession.status === 'voting' ? '🗳️ Rda Votación Abierta' : '⏳ Reclutando Miembros (Faltan ' + (10 - currentSession.participants.length) + ' más para abrir votación)'}
              </span>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2 mt-1">
                <span>{currentSession.title}</span>
              </h3>
              <p className="text-xs text-slate-400">
                Fondo Acumulado: <strong className="text-amber-400 font-mono text-sm">{currentSession.poolTotal}€</strong> — Una vez se alcancen los 10 participantes, se votará por los mejores proyectos. El ganador se lleva el **80% del premio**.
              </p>
            </div>

            {currentSession.status === 'voting' ? (
              <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
                {/* Simulated AI casting vote button */}
                <button
                  onClick={handleSimulateAIVotes}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5 shadow-3xs cursor-pointer active:scale-95"
                  title="Simula que el resto de los participantes emiten su voto de forma instantánea"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span>Simular Votaciones IA</span>
                </button>
              </div>
            ) : (
              <span className="text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-4 py-2 rounded-xl flex flex-col items-center justify-center text-center leading-tight">
                <span>⏳ Esperando</span>
                <span>Inscripciones</span>
              </span>
            )}
          </div>

          {/* USER ACTION CARD: CHOOSE & JOIN ROUND (Always shown when session is filling to let user simulate/test payment) */}
          {currentSession.status === 'filling' && (
            <div className="p-5 bg-gradient-to-r from-indigo-50 to-indigo-100/30 rounded-2xl border border-indigo-200/60 space-y-4 shadow-3xs animate-fade-in" id="card-join-lobby">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm flex items-center justify-center">
                  <Award className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-800 block">Pagar Inscripción de Propuesta</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                    Para ingresar en la <strong>{currentSession.title}</strong>, es obligatorio asignar uno de tus proyectos creados. Una vez asignado pulse en <strong>Disparar Pago de {currentSession.entryFee}€ y Acceder a Votaciones</strong>.
                  </p>
                </div>
              </div>

              {userProjects.length === 0 ? (
                <div className="bg-white border border-amber-300/80 p-4 rounded-xl text-center space-y-2">
                  <p className="text-xs text-amber-800 font-bold flex items-center justify-center gap-1">
                    <span>⚠️ No tienes ningún proyecto creado todavía</span>
                  </p>
                  <p className="text-[10px] text-slate-450 leading-relaxed">
                    Primero debes registrar una propuesta en tu menú para poder inscribirte en la mesa de inversión de {currentSession.entryFee}€.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200 shadow-3xs">
                  <div>
                    <label className="block text-[10px] font-bold text-indigo-650 uppercase tracking-wider mb-1.5">
                      Selecciona Cuál de tus proyectos vas a inscribir:
                    </label>
                    <select
                      value={enrollProjectId}
                      onChange={(e) => setEnrollProjectId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-550 font-bold cursor-pointer"
                    >
                      <option value="">-- Elige un proyecto de la lista --</option>
                      {userProjects.map((proj) => (
                        <option key={proj.id} value={proj.id}>
                          {proj.title} ({proj.category}) — Presupuesto: {proj.budget}€
                        </option>
                      ))}
                    </select>
                  </div>

                  {enrollProjectId && userProjects.find(p => p.id === enrollProjectId) && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-150 text-[11px] text-slate-600 space-y-1 font-sans">
                      <p><strong>🎯 Objetivo:</strong> {userProjects.find(p => p.id === enrollProjectId)?.objective}</p>
                      <p><strong>📈 Plan de Gasto:</strong> {userProjects.find(p => p.id === enrollProjectId)?.fundUsage}</p>
                    </div>
                  )}

                  {userProfile.balance < currentSession.entryFee && (
                    <div className="bg-rose-50 border border-rose-200/50 p-3 rounded-xl flex items-start gap-2.5 animate-fade-in text-left">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-bold text-rose-800">
                          Saldo actual insuficiente para esta mesa
                        </p>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          Tienes {userProfile.balance.toFixed(2)}€ de saldo y necesitas {currentSession.entryFee}.00€ para participar en las Rondas Colectivas.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <span className="text-xs text-slate-500 font-medium">
                      Precio de inscripción: <strong className="text-indigo-600 font-mono text-sm">{currentSession.entryFee}.00€</strong>
                    </span>
                    <button
                      type="button"
                      disabled={!enrollProjectId}
                      onClick={() => handleJoinSession(currentSession.id)}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                        enrollProjectId 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md border border-indigo-700' 
                          : 'bg-slate-100 border border-slate-250 text-slate-400 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <Play className={`w-4 h-4 fill-current ${enrollProjectId ? 'text-white' : 'text-slate-400'}`} />
                      <span>{enrollProjectId ? `Disparar Pago de ${currentSession.entryFee}€ y Acceder a Votaciones` : 'Selecciona tu proyecto arriba'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lobby participants listing */}
          <div className="space-y-3" id="participants-lobby-section">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Lobby de Participantes en Mesa ({currentSession.status === 'voting' ? '10/10' : `${currentSession.participants.length}/10`})
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                <Clock className="w-3.5 h-3.5" />
                <span>Cómputo instantáneo al votar todos</span>
              </div>
            </div>

            {!currentSession.participants.some(p => p.userId === userProfile.id) || currentSession.status === 'filling' ? (
              <div className="bg-slate-50/55 rounded-2xl p-8 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[220px] border border-slate-200 shadow-3xs animate-fade-in">
                {/* Silhouette dummy lists */}
                <div className="absolute inset-0 grid grid-cols-2 gap-4 p-4 opacity-5 select-none pointer-events-none blur-xs">
                  <div className="bg-white border rounded-xl p-3 flex gap-2">
                    <div className="w-8 h-8 rounded bg-slate-400" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-2 bg-slate-400 rounded w-1/2"></div>
                      <div className="h-2 bg-slate-400 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="bg-white border rounded-xl p-3 flex gap-2">
                    <div className="w-8 h-8 rounded bg-slate-400" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-2 bg-slate-400 rounded w-1/2"></div>
                      <div className="h-2 bg-slate-400 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>

                {/* Locked info panel */}
                <div className="relative z-10 max-w-sm space-y-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-650 flex items-center justify-center mx-auto shadow-xs border border-indigo-100 mb-2 animate-bounce">
                    <Lock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="space-y-1">
                    {!currentSession.participants.some(p => p.userId === userProfile.id) ? (
                      <>
                        <h5 className="font-bold text-slate-800 text-xs">
                          🔒 Listado Protegido de la Mesa
                        </h5>
                        <p className="text-[11px] text-slate-500 leading-normal max-w-xs mx-auto">
                          Para visualizar las propuestas de los demás participantes y poder votar por la ganadora, debes realizar primero la inscripción de tu proyecto y disparar el pago de inscripción de {currentSession.entryFee}€.
                        </p>
                      </>
                    ) : (
                      <>
                        <h5 className="font-bold text-slate-800 text-xs">
                          🔒 Listado Protegido - Esperando Participantes
                        </h5>
                        <p className="text-[11px] text-slate-500 leading-normal max-w-xs mx-auto">
                          Ya estás inscrito en cola. Las propuestas de los demás participantes y los botones de votación se desbloquearán y se abrirán automáticamente una vez se complete la mesa (10/10) para dar inicio al cómputo y votación oficial.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in" id="participants-voting-lobby">
                {(() => {
                  const displayParticipants = [...currentSession.participants];
                  const usedUserIds = new Set(displayParticipants.map(p => p.userId));
                  const availableModels = models.filter(m => !usedUserIds.has(m.id) && m.id !== userProfile.id);
                  let modelIdx = 0;
                  while (displayParticipants.length < 10) {
                    const m = availableModels[modelIdx] || models[modelIdx % models.length];
                    displayParticipants.push({
                      userId: m.id,
                      name: m.name,
                      avatar: m.avatar,
                      projectId: `proj-sim-${m.id}`,
                      votesReceived: 0,
                      hasVoted: false
                    });
                    modelIdx++;
                  }

                  return displayParticipants.map((part) => {
                    const isUserSelf = part.userId === userProfile.id;
                    const matchedModel = models.find(m => m.id === part.userId || m.name.toLowerCase() === part.name.toLowerCase());
                    const projectMeta = getParticipantProjectMeta(part);

                    return (
                      <div
                        key={part.userId}
                        className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                          isUserSelf
                            ? 'bg-indigo-50/40 border-indigo-200'
                            : 'bg-white border-slate-150 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={part.avatar}
                              alt={part.name}
                              onClick={() => {
                                if (matchedModel && onSelectModel) {
                                  onSelectModel(matchedModel);
                                }
                              }}
                              onError={(e) => handleAvatarError(e, part.name)}
                              referrerPolicy="no-referrer"
                              className={`w-10 h-10 rounded-xl object-cover border border-slate-150 shadow-3xs transition-transform ${
                                matchedModel ? 'cursor-pointer hover:scale-105 hover:border-indigo-400' : ''
                              }`}
                              title={matchedModel ? `Ver perfil completo de ${part.name}` : undefined}
                            />
                            <div className="text-left">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span 
                                  onClick={() => {
                                    if (matchedModel && onSelectModel) {
                                      onSelectModel(matchedModel);
                                    }
                                  }}
                                  className={`font-bold text-slate-800 text-xs sm:text-xs ${
                                    matchedModel ? 'cursor-pointer hover:text-indigo-600 hover:underline' : ''
                                  }`}
                                  title={matchedModel ? `Ver perfil completo de ${part.name}` : undefined}
                                >
                                  {part.name}
                                </span>
                                {isUserSelf && (
                                  <span className="text-[8px] bg-slate-900 text-white font-bold px-1.5 py-0.2 rounded font-mono">
                                    TÚ
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-indigo-650 font-semibold block mt-0.5 truncate max-w-[200px]" title={projectMeta.title}>
                                📁 {projectMeta.title}
                              </span>
                              <span className="text-[10px] text-slate-450 block font-mono">Votos conseguidos: <strong className="text-slate-700">{part.votesReceived.toFixed(1)}</strong></span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedProject(projectMeta);
                            }}
                            className="p-1.5 text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors"
                            title="Leer detalles del Proyecto"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                          {/* Status identifier */}
                          <div className="text-[10px]">
                            {part.hasVoted ? (
                              <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>Voto oficial emitido</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 font-medium italic">Esperando voto...</span>
                            )}
                          </div>

                          {/* Direct Button for User to vote */}
                          {isUserSelf ? (
                            <span className="text-[10px] text-slate-400 italic">No puedes autovotarte</span>
                          ) : (
                            <button
                              onClick={() => {
                                const hasPaid = currentSession.participants.some(p => p.userId === userProfile.id);
                                if (!hasPaid) {
                                  alert('⚠️ Para poder votar debes inscribirte primero en esta sesión pagando la cuota de entrada.');
                                  return;
                                }
                                handleCastVote(part.userId);
                              }}
                              disabled={currentSession.participants.find(p => p.userId === userProfile.id)?.hasVoted}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer active:scale-95 ${
                                currentSession.participants.find(p => p.userId === userProfile.id)?.hasVoted
                                  ? 'bg-slate-50 text-slate-400 cursor-default border border-slate-100'
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-3xs'
                              }`}
                            >
                              DAR MI VOTO
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          Actualmente no hay ninguna sesión de inversión seleccionada o registrada.
        </div>
      )}

      {/* Embedded Project Details Dialog Popup */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 text-slate-800 relative shadow-2xl">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 p-2 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block">
              {selectedProject.category}
            </span>

            <h3 className="text-xl sm:text-2xl font-black font-display mt-2 text-slate-900 leading-tight">{selectedProject.title}</h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500 font-sans">
              <p>Presupuesto requerido: <strong className="text-emerald-600 font-extrabold font-mono text-sm">{selectedProject.budget}€</strong></p>
              {selectedProject.fundingGoal && (
                <p>• Meta de Recaudación: <strong className="text-indigo-600 font-extrabold font-mono text-sm">{selectedProject.fundingGoal}€</strong></p>
              )}
            </div>

            {(selectedProject.contactEmail || selectedProject.contactPhone) && (
              <div className="mt-3 text-[11px] text-slate-500 flex flex-wrap gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 font-sans">
                <span className="font-extrabold text-slate-700">Contacto Directo:</span>
                {selectedProject.contactEmail && <span className="text-slate-600">📧 {selectedProject.contactEmail}</span>}
                {selectedProject.contactPhone && <span className="text-slate-600">📱 {selectedProject.contactPhone}</span>}
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 space-y-6 text-xs sm:text-xs text-slate-600 font-sans">
              {/* PASO 1 DE 3: IDENTIDAD CREATIVA */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs text-left">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest font-mono">Paso 1 de 3</span>
                  <span className="text-[11px] font-bold text-slate-800">Identidad Creativa del Proyecto</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Título del Proyecto</span>
                    <p className="text-slate-800 font-bold text-xs mt-0.5">{selectedProject.title}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Categoría Comercial</span>
                    <p className="text-slate-800 font-bold text-xs mt-0.5">{selectedProject.category}</p>
                  </div>
                </div>

                {/* Lema Corto que faltaba en el modal */}
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Lema o Descripción Breve</span>
                  <p className="text-slate-700 italic font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-150 mt-1">
                    "{selectedProject.descriptionShort || 'Fusión de estética premium, cortes a medida y principios de sostenibilidad aplicada.'}"
                  </p>
                </div>

                {/* Descripción Completa */}
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block font-sans">Descripción Detallada o Abstract</span>
                  <p className="text-slate-700 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-150 mt-1 whitespace-pre-wrap font-sans">
                    {selectedProject.descriptionLong}
                  </p>
                </div>

                {/* GALERÍA / MULTIMEDIA */}
                {((selectedProject.images && selectedProject.images.length > 0) || (selectedProject.videos && selectedProject.videos.length > 0)) && (
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-2 font-mono">Galería & Portafolio Multimedia</span>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.images?.map((imgUrl, i) => (
                        <a 
                          href={imgUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          key={i} 
                          className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden border border-slate-200 hover:border-indigo-400 hover:shadow-md hover:scale-102 transition-all duration-250 block bg-slate-50 shadow-2xs flex items-center justify-center shrink-0"
                        >
                          <img 
                            src={imgUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              // If sample URL is outdated, load high-quality placeholder garment design
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=300';
                            }}
                          />
                        </a>
                      ))}
                      {selectedProject.videos?.map((vidUrl, i) => (
                        <a 
                          href={vidUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          key={i} 
                          className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 text-slate-650 hover:bg-slate-100 hover:border-indigo-400 hover:shadow-md hover:scale-102 transition-all duration-250 flex flex-col items-center justify-center p-2 text-[9px] font-semibold tracking-tight shrink-0"
                        >
                          <span className="text-xl mb-1.5">📹</span>
                          <span className="truncate w-full text-center">Video Interactivo</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* PASO 2 DE 3: ASPECTOS ECONÓMICOS E IMPACTO */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs text-left">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest font-mono">Paso 2 de 3</span>
                  <span className="text-[11px] font-bold text-slate-800">Aspectos Económicos de Calificación</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Presupuesto de Referencia (Mesa)</span>
                    <p className="text-emerald-600 font-black font-mono text-sm mt-0.5">{selectedProject.budget}.00€</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Objetivo de Recaudación Comercial</span>
                    <p className="text-indigo-650 font-black font-mono text-sm mt-0.5">{selectedProject.fundingGoal || 5000}.00€</p>
                  </div>
                </div>

                {/* Plan de uso de fondos (fundUsage) */}
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Uso Detallado de Fondos (Distribución)</span>
                  <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-150 mt-1 font-medium leading-relaxed">
                    {selectedProject.fundUsage}
                  </p>
                </div>

                {/* Objetivo del financiamiento (objective) */}
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Objetivo del Financiamiento de la Propuesta</span>
                  <p className="text-slate-700 bg-slate-50/50 p-2.5 rounded-xl border border-slate-150 mt-1 leading-relaxed italic">
                    "{selectedProject.objective}"
                  </p>
                </div>

                {/* PRESUPUESTO DESGLOSADO Y CERTIFICADO */}
                {selectedProject.budgetBreakdown && (
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Presupuesto Desglosado y Certificado</span>
                    <div className="divide-y divide-slate-100 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden font-mono text-[10.5px]">
                      {selectedProject.budgetBreakdown.split('\n').map((item, id) => (
                        <div key={id} className="p-2.5 px-3 flex justify-between items-center transition hover:bg-slate-100/50">
                          <span className="truncate flex-1 text-slate-600">{item.split(':')[0]}</span>
                          <span className="font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100/30">{item.split(':')[1]?.trim() || ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cronograma breve / Fases (timeline) */}
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Cronograma de Ejecución o Lanzamiento</span>
                  <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-150 mt-1 leading-relaxed">
                    {selectedProject.timeline}
                  </p>
                </div>

                {/* DOCUMENTACIÓN OFICIAL */}
                {selectedProject.documentationName && (
                  <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-between shadow-3xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base text-indigo-600">📋</span>
                      <div>
                        <p className="font-bold text-slate-800">{selectedProject.documentationName}</p>
                        <span className="text-[9px] text-slate-500 block">Dossier oficial de viabilidad de marca validado</span>
                      </div>
                    </div>
                    {selectedProject.documentationUrl && (
                      <a 
                        href={selectedProject.documentationUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-indigo-600 font-bold text-[10.5px] transition shadow-3xs"
                      >
                        Ver Dossier
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* PASO 3 DE 3: EQUIPO PROFESIONAL */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs text-left">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest font-mono">Paso 3 de 3</span>
                  <span className="text-[11px] font-bold text-slate-800">Equipo Profesional del Proyecto</span>
                </div>

                <div className="space-y-2.5">
                  {selectedProject.team.map((m, idx) => (
                    <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <strong className="text-slate-800 text-xs">{m.name}</strong>
                          <p className="text-[10px] text-slate-500">{m.role}</p>
                        </div>
                        <span className="text-[10px] text-indigo-600 italic self-start bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{m.experience}</span>
                      </div>
                      {m.bio && <p className="text-[10px] text-slate-600 bg-white p-2 rounded border border-slate-100 leading-relaxed italic">"{m.bio}"</p>}
                      {m.profileLink && (
                        <a href={m.profileLink} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 hover:underline inline-block mt-0.5 font-medium">
                          🔗 Portfolio / Contacto: {m.profileLink}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {(() => {
              const isMyOwnProject = selectedProject && (
                selectedProject.userId === userProfile.id ||
                selectedProject.team.some(m => m.name === userProfile.name)
              );
              const isLobbyFullAndVoting = currentSession && currentSession.participants.length >= 10 && currentSession.status === 'voting';
              const showVoteButton = !isMyOwnProject && isLobbyFullAndVoting;
              return (
                <div className={showVoteButton ? "grid grid-cols-2 gap-4 mt-6" : "mt-6"}>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-750 font-extrabold py-2.5 rounded-xl text-xs transition cursor-pointer border border-slate-200 shadow-3xs"
                  >
                    Cerrar Detalles del Proyecto
                  </button>
                  {showVoteButton && (
                    <button
                      onClick={() => handleVoteForProject(selectedProject)}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1.5"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Votar Proyecto
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* MODAL ERROR DE SALDO INSUFICIENTE */}
      {insufficientBalanceError && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in text-slate-800">
          <div className="bg-white rounded-[32px] border border-slate-100/80 w-full max-w-[420px] p-8 relative shadow-2xl space-y-6 text-slate-800 text-left">
            
            {/* Close Button */}
            <button
              onClick={() => setInsufficientBalanceError(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Icon */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                <AlertCircle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xl font-bold font-display text-slate-900 tracking-tight">
                  Saldo Insuficiente
                </h4>
                <p className="text-[10px] uppercase font-bold text-rose-600 tracking-widest font-mono">
                  Mesa de Rondas Colectivas
                </p>
              </div>
            </div>

            {/* Error Message Details */}
            <div className="border border-slate-200/85 rounded-[24px] p-6 space-y-5 bg-white">
              <p className="text-[13px] sm:text-sm text-slate-650 leading-relaxed font-semibold">
                No tienes fondos suficientes en tu cuenta para inscribir este proyecto en la mesa de inversión seleccionada.
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Entrada Requerida</span>
                  <span className="text-lg font-extrabold text-rose-600 mt-1 font-mono">{insufficientBalanceError.required.toFixed(2)}€</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Tu Saldo</span>
                  <span className="text-lg font-extrabold text-amber-600 mt-1 font-mono">{insufficientBalanceError.actual.toFixed(2)}€</span>
                </div>
              </div>
            </div>

            {/* Hint Box matching mm.png tips */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-[20px] p-5 text-[11px] leading-relaxed text-slate-500">
              <div className="flex gap-2">
                <span className="text-sm shrink-0">💡</span>
                <div>
                  <p className="font-semibold text-slate-700 mb-0.5">Perfil de simulación & Fondos</p>
                  <p>
                    Puedes dirigirte a la sección de <strong className="text-slate-800">Finanzas</strong> para gestionar tus depósitos o bien ingresar a una mesa con una cuota de inscripción menor.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              {onNavigateToTab && (
                <button
                  type="button"
                  onClick={() => {
                    setInsufficientBalanceError(null);
                    onNavigateToTab('finance');
                  }}
                  className="flex-1 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs shadow-lg shadow-indigo-600/10 cursor-pointer text-center select-none active:scale-95 transition flex items-center justify-center gap-1.5 order-first"
                >
                  <Wallet className="w-4 h-4 text-white" />
                  <span>Ir a Finanzas</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setInsufficientBalanceError(null)}
                className="flex-1 py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer text-center select-none active:scale-95 transition"
              >
                Cerrar Aviso
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
