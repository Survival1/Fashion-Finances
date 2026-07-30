import React, { useState } from 'react';
import { BALMAIN_LOGO_DATA_URL } from '../utils/brandLogos';
import { 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Crown, 
  Trophy, 
  Users, 
  Terminal, 
  Wallet, 
  ShieldCheck,
  FileText,
  Layers,
  Coins,
  Briefcase,
  Mail,
  Phone,
  ExternalLink,
  Calendar,
  TrendingUp,
  UploadCloud,
  User,
  Info
} from 'lucide-react';

interface Participant {
  userId: string;
  name: string;
  avatar: string;
  hasVoted: boolean;
  votesReceived: number;
  projectId: string;
}

interface UserProject {
  id: string;
  userId: string;
  images: string[];
}

interface ModelProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  patrocinadorId?: string;
  photos?: string[];
  selectedWinnerPhotos?: string[];
}

interface SessionResultsPodiumProps {
  completedSessionToDisplay: {
    id: string;
    title: string;
    participants: Participant[];
  };
  userProfile: {
    id: string;
    name: string;
    patrocinadorId?: string;
    balance: number;
  };
  userProjects: UserProject[];
  models: ModelProfile[];
  onSelectModel?: (model: ModelProfile) => void;
  onNavigateToTab?: (tabId: string, storeId?: string) => void;
  setCompletedSessionToDisplay: (session: any | null) => void;
  setSimulationLogs: (logs: any[]) => void;
  setIsCastingPublished: (pub: boolean) => void;
  isCastingPublished: boolean;
  pool: number;
  prizePerWinner: number;
  isTie: boolean;
  winnersToDisplay: Participant[];
  maxVotes: number;
}

const WinnerProjectSlider = ({ images }: { images: string[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Automatically reset the active index when the images array changes (i.e. different winner selected)
  React.useEffect(() => {
    setActiveIndex(0);
  }, [images]);

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
            Colección de Alta Costura del Proyecto Ganador
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
    </div>
  );
};

const presetProjects: Record<string, any> = {
  'isabella dubois': {
    title: "Atelier Dubois: Haute Couture Éco-Responsable",
    category: "Alta Costura & Diseño",
    descriptionShort: "Colección de vestidos de gala biodegradables confeccionados a partir de hilos de seda orgánica y tinturas botánicas.",
    descriptionLong: "Atelier Dubois redefine el lujo textil mediante un modelo de alta costura circular certificado bajo estándares GOTS. Cada vestido se esculpe y tiñe a mano utilizando compuestos florales silvestres locales y un empaque de biopolímero 100% hidro-soluble, reduciendo de forma drástica la contaminación textil e impulsando la artesanía local francesa.",
    budget: 15000,
    fundingGoal: 20000,
    objective: "Confeccionar y presentar la primera línea cápsula en la semana de la alta costura de París, promoviendo vestidos de gala ecológicos de impacto cero de carbono.",
    fundUsage: "70% compra de insumos textiles orgánicos certificados y remuneración del personal de taller local, 20% relaciones públicas y marketing digital, 10% distribución sostenible de empaque.",
    timeline: "Fase 1: Curaduría de fibras y tintado ecológico. Fase 2: Patronaje y sastrería de gala a mano. Fase 3: Desfile oficial y pre-ventas editoriales.",
    contactEmail: "atelier.ambrosio@fashionfinances.net",
    contactPhone: "+33 6 4531 2901",
    budgetBreakdown: "Materiales Orgánicos Certificados (Seda GOTS): 5.500€\nTaller de Confección & Remuneración Ética: 5.000€\nFotografías Editoriales y Casting: 2.500€\nPrensa y Posicionamiento Digital: 2.000€",
    videos: ["https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4"],
    documentationName: "Plan-de-Viabilidad-Sostenible.pdf",
    documentationUrl: "https://collectives.network/docs/premium-viability-v1.pdf",
    team: [{ name: "Alessandra Ambrosio", role: "Diseñadora Principal y Fundadora", experience: "8 años en alta costura", bio: "Graduada de la Chambre Syndicale de la Couture Parisienne. Apasionada del residuo cero." }]
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
    budgetBreakdown: "Inventario Vaquero de Archivo Seleccionado: 3.500€\nManufactura en Sastrería de Milán: 3.000€\nPlataforma de E-commerce & Pasarela Segura: 2.000€",
    videos: ["https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4"],
    documentationName: "Proyecto_Upcycling_Indigo.pdf",
    documentationUrl: "#",
    team: [{ name: "Sophia Loren", role: "Directora Creativa", experience: "6 años especializada en mezclilla", bio: "Pionera del supra-reciclaje italiano y preservación textil." }]
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
    budgetBreakdown: "Adquisición de Patentes de Tela Bioclimática: 15.005€\nIngeniería de Tallaje Computarizado en 3D: 6.000€\nCampañas de Prensa & RRPP Ejecutivas: 4.000€",
    videos: ["https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4"],
    documentationName: "Sartorial_Aero_Proposal_v3.pdf",
    documentationUrl: "#",
    team: [{ name: "Marcus Sterling", role: "CEO & Ingeniero", experience: "10 años en tecnología textil", bio: "Investigador ex-MIT especialista en nanotecnologías aplicadas a hilaturas sostenibles." }]
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
    budgetBreakdown: "Maquinaria de Extrusión 3D Industrial: 6.000€\nEnsayos de Laboratorio & Certificaciones: 3.500€\nMarketing Viral Multicanal: 2.500€",
    videos: ["https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4"],
    documentationName: "Myco_Tech_Evaluation.pdf",
    documentationUrl: "#",
    team: [{ name: "Liam Alvarez", role: "Diseñador de Calzado", experience: "7 años en calzado deportivo", bio: "Especialista en impresión aditiva en calzado ergonómico biodegradable." }]
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
    timeline: "Periodo 1: Adquisición ética de lana de alpaca y extracción de cáñamo. Periodo 2: Confección de muestras híbridas. Periodo 3: Ferias y ventas.",
    contactEmail: "mia.kincaid@nordicfrost.se",
    contactPhone: "+46 8 123 4567",
    budgetBreakdown: "Fibras de Alpaca & Logística Ética: 9.000€\nSimulación Climática & Pruebas en Cámara: 5.000€\nCreación de Marca Internacional: 4.000€",
    videos: ["https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4"],
    documentationName: "Dossier_NordicFrost_Alpaca.pdf",
    documentationUrl: "#",
    team: [{ name: "Mia Kincaid", role: "Fundadora", experience: "5 años confección nórdica", bio: "Apasionada del desarrollo rural andino y recolección de fibras orgánicas." }]
  },
  'oliver finch': {
    title: "Echo Circular: Modas Desmontables",
    category: "Moda Modular & Circular",
    descriptionShort: "Colección urbana modular de paneles intercambiables con broches de aluminio reciclado.",
    descriptionLong: "Combatimos la sobreproducción textil ofreciendo una única chaqueta estructural convertible en chaleco ligero o gabardina ejecutiva según se añadan o remuevan sus módulos. Confeccionada con lino orgánico europeo y herrajes reciclables de precisión.",
    budget: 14000,
    fundingGoal: 16500,
    objective: "Consolidar el desarrollo de broche modular patentado y automatizar el muestrario digital.",
    fundUsage: "55% hilatura ética y de abastecimiento andino, 30% pruebas hídricas con cámara de frío, 15% publicidad sostenible en redes de diseño.",
    timeline: "Fase 1: Matricería de broches. Fase 2: Confección de muestras híbridas. Fase 3: Lanzamiento comercial.",
    contactEmail: "oliver.finch@echocircular.co.uk",
    contactPhone: "+44 7700 900077",
    budgetBreakdown: "Diseño & Matricería de Cierres de Precisión: 7.000€\nMateriales Termo-Sellados e Hilos de Alta Tenacidad: 4.550€\nDesarrollo Web de Realidad Virtual Muestrario: 2.500€",
    videos: ["https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4"],
    documentationName: "Echo_Circular_Modular_Dossier.pdf",
    documentationUrl: "#",
    team: [{ name: "Oliver Finch", role: "Arquitecto Textil", experience: "9 años de diseño industrial", bio: "Ingeniero convertido a la moda buscando reducir la huella de descarte." }]
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
    contactPhone: "+234 1 234 5678",
    budgetBreakdown: "Logística y Compensación Directa Cooperativa: 9.500€\nPatronaje & Armado de Siluetas de Gala: 4.500€\nCampañas y Eventos Editoriales de Presentación: 2.000€",
    videos: ["https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4"],
    documentationName: "Impact_Afro_Heritage_GOTS.pdf",
    documentationUrl: "#",
    team: [{ name: "Amara Okafor", role: "Diseñadora en Jefe", experience: "8 años de couture étnico", bio: "Graduada de Central Saint Martins dedicada al renacimiento de saberes tradicionales." }]
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
    budgetBreakdown: "Adquisición de Rollos de Cuero de Uva Orgánica: 4.500€\nManufactura Artesanal & Costura Especializada: 3.500€\nHerrajes de Precisión e Hilos Eco-Sostenibles: 3.000€",
    videos: ["https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4"],
    documentationName: "Viabilidad_VinoLeather.pdf",
    documentationUrl: "#",
    team: [{ name: "Julian Brooks", role: "Diseñador Industrial & Fundador", experience: "4 años de artes de calzado", bio: "Artesano de curtición botánica comprometido con la reorientación del sector vinícola." }]
  }
};

export default function SessionResultsPodium({
  completedSessionToDisplay,
  userProfile,
  userProjects,
  models,
  onSelectModel,
  onNavigateToTab,
  setCompletedSessionToDisplay,
  setSimulationLogs,
  setIsCastingPublished,
  isCastingPublished,
  pool,
  prizePerWinner,
  isTie,
  winnersToDisplay,
  maxVotes
}: SessionResultsPodiumProps) {
  const [showFullTally, setShowFullTally] = useState(false);
  const [activeWinnerIndex, setActiveWinnerIndex] = useState(0);
  const [isSimulatedFiveWinners, setIsSimulatedFiveWinners] = useState(false);

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
  const [viewMode, setViewMode] = useState<'individual' | 'mosaic'>('individual');
  const [sponsorViewMode, setSponsorViewMode] = useState<'individual' | 'mosaic'>('individual');

  const simulatedWinners: Participant[] = [
    {
      userId: 'topf-2',
      name: 'Alessandra Ambrosio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      projectId: 'proj-isabella',
      hasVoted: true,
      votesReceived: 5
    },
    {
      userId: 'topf-4',
      name: 'Candice Swanepoel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
      projectId: 'proj-sophia',
      hasVoted: true,
      votesReceived: 5
    },
    {
      userId: 'model-marcus',
      name: 'Marcus Sterling',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      projectId: 'proj-marcus',
      hasVoted: true,
      votesReceived: 5
    },
    {
      userId: 'model-clara',
      name: 'Clara Mendez',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
      projectId: 'proj-clara',
      hasVoted: true,
      votesReceived: 5
    },
    {
      userId: 'model-mia',
      name: 'Mia Kincaid',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256',
      projectId: 'proj-mia',
      hasVoted: true,
      votesReceived: 5
    }
  ];

  const [selectedFullProject, setSelectedFullProject] = useState<any | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'info' | 'financial' | 'team'>('info');
  const [sponsorSliderIndex, setSponsorSliderIndex] = useState(0);
  const [selectedPodiumSponsorDetail, setSelectedPodiumSponsorDetail] = useState<any | null>(null);
  const prizeTotal80 = pool * 0.80;

  // Helper to reliably find and navigate to a model's profile when clicked
  const handleNavigateToModelProfile = (person: any) => {
    if (!person) return;
    const personId = person.userId || person.id;
    const personName = (person.name || '').trim();

    let matched = models ? models.find(m => 
      (personId && m.id === personId) || 
      (personName && m.name.toLowerCase().trim() === personName.toLowerCase().trim())
    ) : null;

    if (!matched && personName) {
      const firstName = personName.toLowerCase().split(' ')[0];
      if (firstName.length >= 3) {
        matched = models ? models.find(m => m.name.toLowerCase().includes(firstName)) : null;
      }
    }

    if (matched && onSelectModel) {
      onSelectModel(matched);
    } else if (onSelectModel) {
      onSelectModel({
        id: personId || (personName ? personName.toLowerCase().replace(/\s+/g, '-') : 'model-profile'),
        name: personName || 'Modelo',
        username: person.username || (personName ? personName.toLowerCase().replace(/\s+/g, '_') : 'model_user'),
        avatar: person.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
        bio: 'Modelo participante en la sesión de financiación de alta costura.',
        role: 'model',
        rating: 5.0,
        followersCount: 125000,
        verified: true
      } as ModelProfile);
    }
  };

  // Load custom model sponsors from localStorage, chosen by the model with custom uploaded logos
  const resultsSponsors = (() => {
    try {
      const saved = localStorage.getItem(`model_sponsors_${userProfile.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const selected = parsed.filter(s => {
            if (!s.isSelectedForResults) return false;
            // Check if contract is in force (active today)
            const today = new Date().toISOString().split('T')[0];
            const start = s.startDate || s.hiredDate || '2026-01-01';
            const end = s.endDate || '2029-12-31';
            return today >= start && today <= end;
          });
          const balmainSponsor = selected.find(s => (s.name || '').toLowerCase().includes('balmain') || s.storeId === 'balmain_paris_paloma');
          if (balmainSponsor) {
            return [{
              ...balmainSponsor,
              name: 'BALMAIN PARIS',
              amount: 15000,
              logoUrl: BALMAIN_LOGO_DATA_URL,
              storeId: 'balmain_paris_paloma',
              hasExclusivity: true,
              sector: 'CALZADO DE PASARELA Y LUJO 👠'
            }];
          }
        }
      }
    } catch (e) {
      console.error("Error reading model sponsors on podium:", e);
    }
    // Fallback default single portfolio sponsor (Balmain Paris)
    return [
      {
        id: 's-balmain',
        name: 'BALMAIN PARIS',
        amount: 15000,
        logoInitials: 'BP',
        logoStyle: 'bg-white text-black font-serif font-bold border border-amber-300',
        sector: 'CALZADO DE PASARELA Y LUJO 👠',
        hasExclusivity: true,
        logoUrl: BALMAIN_LOGO_DATA_URL,
        storeId: 'balmain_paris_paloma',
        proposalDescription: 'Contrato de exclusividad para patrocinio de calzado de pasarela y lujo en la gala de resultados finales.'
      }
    ];
  })();

  const handleSponsorClick = (sponsor: any) => {
    localStorage.setItem('came_from_results_podium', 'true');
    if (completedSessionToDisplay) {
      try {
        localStorage.setItem('podium_session_backup', JSON.stringify(completedSessionToDisplay));
      } catch (e) {
        console.error(e);
      }
    }
    if (setCompletedSessionToDisplay) {
      setCompletedSessionToDisplay(null);
    }
    const targetStore = sponsor?.storeId || 'balmain_paris_paloma';
    if (onNavigateToTab) {
      onNavigateToTab('casting_live');
    }
  };

  // Assign specific spots on the Podium based on chosen list length (fills automatically with fallbacks)
  const goldSponsor = resultsSponsors[0] || {
    name: 'LVMH Group',
    logoInitials: 'LVMH',
    logoStyle: 'bg-[#2a1b18] text-amber-200 border border-amber-400 font-serif font-black',
    sector: 'Alta Costura Élite 🇫🇷',
    amount: 45000,
    logoUrl: null
  };

  const silverSponsor = resultsSponsors[1] || {
    name: 'Kering Group',
    logoInitials: 'KER',
    logoStyle: 'bg-[#1e2c1e] text-[#e3ded4] font-bold border border-[#e3ded4]/20',
    sector: 'Costura Suprema 🇮🇹',
    amount: 50000,
    logoUrl: null
  };

  const bronzeSponsor = resultsSponsors[2] || {
    name: 'Richemont',
    logoInitials: 'RICH',
    logoStyle: 'bg-zinc-900 text-white border border-zinc-800 font-serif font-bold',
    sector: 'Relojería de Lujo 🇨🇭',
    amount: 35000,
    logoUrl: null
  };

  // Helper to dynamically look up the human sponsor profile of a specific participant
  const getSponsorForWinner = (winner: Participant) => {
    if (!winner) return null;
    // 1. First check user Profile's sponsor if present
    if (userProfile?.patrocinadorId) {
      const userSponsor = models.find(m => m.id === userProfile.patrocinadorId);
      if (userSponsor) return userSponsor;
    }
    // 2. Default to Alexander Vance as the primary official sponsor
    const alexander = models.find(m => m.name.toLowerCase().includes('alexander') || m.username.includes('alexander') || m.id === 'topm-1');
    if (alexander) return alexander;

    // 3. Otherwise try to check the matching winner profile in models and find their sponsor
    const matchedModel = models.find(m => m.id === winner.userId || m.name.toLowerCase() === winner.name.toLowerCase());
    if (matchedModel && matchedModel.patrocinadorId) {
      const sponsor = models.find(m => m.id === matchedModel.patrocinadorId);
      if (sponsor) return sponsor;
    }
    return models[0] || null;
  };

  // Helper to find the complete project detail for the winner
  const getWinnerFullProject = (part: Participant) => {
    const isWinnerSelf = part.userId === userProfile.id || part.name.toLowerCase() === userProfile.name.toLowerCase();
    
    const userProj: any = (isWinnerSelf ? userProjects.find(p => p.userId === userProfile.id) : null)
      || userProjects.find(p => p.userId === part.userId || p.id === part.projectId)
      || userProjects[0];
      
    const userKey = part.name.toLowerCase().trim();
    const matchedPreset = presetProjects[userKey] || Object.values(presetProjects).find((p: any) => p.title?.toLowerCase().includes(userKey)) || {};
    
    return {
      id: userProj?.id || `proj-sim-${part.userId}`,
      userId: part.userId,
      title: (isWinnerSelf ? userProj?.title : matchedPreset.title) || `Colección Sustentable - ${part.name}`,
      category: (isWinnerSelf ? userProj?.category : matchedPreset.category) || 'Modas Circulares',
      descriptionShort: (isWinnerSelf ? userProj?.descriptionShort : matchedPreset.descriptionShort) || `Fórmula de diseño ecológico, optimización textil y proyección cruzada de marca.`,
      descriptionLong: (isWinnerSelf ? userProj?.descriptionLong : matchedPreset.descriptionLong) || `Este proyecto estratégico busca mitigar la generación de desechos textiles mediante metodologías de confección de residuo cero con siluetas versátiles y minimalistas.`,
      budget: (isWinnerSelf ? userProj?.budget : matchedPreset.budget) || 5000,
      fundingGoal: (isWinnerSelf ? userProj?.fundingGoal : matchedPreset.fundingGoal) || 12000,
      objective: (isWinnerSelf ? userProj?.objective : matchedPreset.objective) || `Maximizar el atractivo comercial e impacto social de la colección en mesas de inversión.`,
      fundUsage: (isWinnerSelf ? userProj?.fundUsage : matchedPreset.fundUsage) || '75% abastecimiento ético de tejidos locales, 25% promoción interactiva e-commerce.',
      timeline: (isWinnerSelf ? userProj?.timeline : matchedPreset.timeline) || 'Consagrado en 3 fases críticas: abastecimiento, corte experimental de patrón, y desfiles e-commerce.',
      team: (isWinnerSelf ? userProj?.team : matchedPreset.team) || [{ name: part.name, role: 'Líder Creativo', experience: '5 años de trayectoria', bio: 'Apasionado de la sastrería circular sostenible.' }],
      termsAccepted: true,
      images: userProj?.images || [part.avatar],
      status: 'active',
      contactEmail: (isWinnerSelf ? userProj?.contactEmail : matchedPreset.contactEmail) || `${part.name.toLowerCase().replace(/\s+/g, '.')}@fashionfinances.net`,
      contactPhone: (isWinnerSelf ? userProj?.contactPhone : matchedPreset.contactPhone) || '+34 600 555 123',
      budgetBreakdown: (isWinnerSelf ? userProj?.budgetBreakdown : matchedPreset.budgetBreakdown) || 'Adquisición de Insumos: 2.000€\nTaller de Confección: 1.500€\nPublicidad & Promoción: 1.500€',
      videos: isWinnerSelf ? userProj?.videos : (matchedPreset.videos || ["https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4"]),
      documentationName: isWinnerSelf ? userProj?.documentationName : (matchedPreset.documentationName || 'Plan-de-Viabilidad-Sostenible.pdf'),
      documentationUrl: isWinnerSelf ? userProj?.documentationUrl : (matchedPreset.documentationUrl || 'https://collectives.network/docs/premium-viability-v1.pdf')
    };
  };

  // Find store brand information
  const getWinnerBrand = (name: string) => {
    const brandMap: Record<string, { brandName: string; emoji: string }> = {
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

  const activeWinnersList = isSimulatedFiveWinners ? simulatedWinners : winnersToDisplay;
  const activeIsTie = isSimulatedFiveWinners ? true : isTie;

  const winnersWithBrands = activeWinnersList.map(w => {
    return {
      winner: w,
      brand: getWinnerBrand(w.name)
    };
  });

  const allWinnersRepresentBrands = activeIsTie && winnersWithBrands.every(item => item.brand !== null);

  const sortedParticipantsForRanking = [...completedSessionToDisplay.participants]
    .sort((a, b) => b.votesReceived - a.votesReceived);

  const isMultiWinner = activeIsTie && activeWinnersList.length > 1;

  const firstPlace = activeWinnersList[activeWinnerIndex] || activeWinnersList[0] || sortedParticipantsForRanking[0];

  // Helper to ensure exactly 3 distinct images for the slider
  const ensureThreeImages = (images: string[] | undefined) => {
    const defaultImages = [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600'
    ];
    const list = [...(images || [])].filter(Boolean);
    if (list.length === 0) {
      return [defaultImages[0], defaultImages[1], defaultImages[2]];
    }
    while (list.length < 3) {
      const nextImg = defaultImages.find(img => !list.includes(img)) || defaultImages[list.length % defaultImages.length];
      list.push(nextImg);
    }
    return list.slice(0, 3);
  };

  // Helper to find project images for winner
  const getWinnerProjectImages = (part: Participant) => {
    const isWinnerSelf = part.userId === userProfile.id || part.name.toLowerCase() === userProfile.name.toLowerCase();
    const winnerProj = (isWinnerSelf ? userProjects.find(p => p.userId === userProfile.id) : null)
      || userProjects.find(p => p.userId === part.userId || p.id === part.projectId)
      || userProjects[0];
    
    return ensureThreeImages(winnerProj?.images);
  };

  return (
    <div className="bg-white text-slate-800 rounded-3xl border border-pink-200 p-6 sm:p-10 space-y-10 shadow-xl animate-fade-in text-left relative overflow-hidden" id="podium-results-screen" style={{ backgroundImage: 'linear-gradient(to bottom, #fff8f9 0%, #ffffff 100%)' }}>
      
      {/* Immersive stadium visual background effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-50/30 rounded-full blur-3xl pointer-events-none" />

      {/* SECTION 1: HEADER BRAND TITLE */}
      <div className="text-center pt-8 pb-5 border-b border-pink-100 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
          {resultsSponsors && resultsSponsors.length > 0 ? (
            resultsSponsors.map((spon, idx) => (
              <span 
                key={spon.id || idx} 
                className={`inline-flex items-center gap-1 text-[11px] font-sans font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-4xs ${
                  spon.hasExclusivity 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border border-amber-300 animate-pulse'
                    : 'bg-rose-50 text-rose-600 border border-pink-100'
                }`}
              >
                <span>♛</span> {spon.name} <span>♛</span>
              </span>
            ))
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-sans font-black tracking-widest text-rose-500 uppercase px-3 py-1 bg-rose-50 border border-pink-100 rounded-full shadow-4xs">
              ♛ VICTORIA'S SECRET ♛
            </span>
          )}
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-rose-900 tracking-wider mt-4 mb-2 animate-fade-in uppercase">
          Resultados Finales
        </h2>
        <div className="h-3" /> {/* Small space created here! */}
        <p className="text-[11px] sm:text-xs font-black font-mono tracking-widest text-slate-400 uppercase max-w-xl mx-auto leading-normal">
          SISTEMA DE BLOQUES POR PUNTUACIÓN: AGRUPACIÓN DINÁMICA POR VOTOS DETECTADA
        </p>
      </div>

      {/* CASTING LIVE PUBLISH NOTIFICATION SUCCESS */}
      {isCastingPublished && (
        <div className="p-4 rounded-2xl bg-white border border-rose-300 flex items-start justify-between gap-3 animate-bounce shadow-md relative z-10" id="toast-casting-success">
          <div className="flex items-start gap-2.5">
            <span className="text-lg bg-pink-50 p-1.5 rounded-lg border border-pink-100">🚀</span>
            <div className="text-left">
              <strong className="text-rose-600 font-extrabold text-xs block">PUBLICADO EN CASTING LIVE</strong>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed mt-0.5 font-semibold">
                ¡Resultados oficiales de la mesa '{completedSessionToDisplay.title}' transmitidos con éxito y anclados de forma descentralizada para el público general!
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setIsCastingPublished(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 🧪 TESTING CONTROLLER FOR MULTI-WINNER SCENARIOS */}
      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-amber-500/10 border border-amber-300/40 p-5 rounded-3xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-fade-in">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-black text-amber-800 tracking-wider">
            <span className="animate-pulse">✨</span> <span>SIMULADOR DE GANADORES MÚLTIPLES</span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed max-w-xl font-medium">
            Prueba cómo responde la interfaz interactiva en tiempo real al haber un empate de <strong>5 ganadores</strong>. Cambia el escenario a continuación para explorar cada uno de sus proyectos de forma cómoda e intuitiva.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setIsSimulatedFiveWinners(false);
              setViewMode('individual');
              setSponsorViewMode('individual');
              setActiveWinnerIndex(0);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition duration-150 cursor-pointer ${
              !isSimulatedFiveWinners
                ? 'bg-slate-900 text-white shadow-md font-black'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-3xs'
            }`}
          >
            Escenario Original
          </button>
          <button
            onClick={() => {
              setIsSimulatedFiveWinners(true);
              setViewMode('mosaic');
              setSponsorViewMode('individual');
              setActiveWinnerIndex(0);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-150 flex items-center gap-1 cursor-pointer ${
              isSimulatedFiveWinners
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black ring-2 ring-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
          >
            🔥 Simular 5 Ganadores Empatados
          </button>
        </div>
      </div>

      {/* MAIN BODY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-start">
        {/* LEFT COLUMN (8/12 OF SCREEN WIDTH) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* THE ANGELS RANKING PODIUM DE NUESTROS GANADORES */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm relative overflow-hidden flex flex-col justify-center text-center space-y-8">
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-pink-50/30 to-transparent pointer-events-none" />
            
            {/* Decorative title */}
            <div className="text-center space-y-1.5 relative z-10">
              <div className="inline-flex items-center gap-1.5 bg-[#fe2c55]/10 border border-[#fe2c55]/20 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#fe2c55] mx-auto">
                ✨ MESA FINALIZADA ✨
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-rose-950 tracking-tight uppercase">THE ANGELS RANKING</h3>
              <p className="text-[9.5px] sm:text-[11px] text-slate-500 uppercase tracking-widest font-bold max-w-md mx-auto">LA MODELO MÁS ADMIRADA DE LA EDICIÓN DE HOY Y SU FINANCIACIÓN RECAUDADA</p>
            </div>

            {/* Podium pedestal columns or Multi-winner Slider */}
            {isMultiWinner ? (
              <div className="space-y-6 relative z-10 w-full animate-fade-in">
                {/* Tie Headline Badge */}
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border border-amber-300/40 px-4 py-1.5 rounded-full text-xs font-bold text-amber-800 tracking-wide uppercase shadow-sm">
                  <span className="text-sm">✨</span> ¡EMPATE HISTÓRICO: {activeWinnersList.length} GANADORAS! <span className="text-sm">✨</span>
                </div>

                {/* Main Spotlight Panel for Selected Winner */}
                <div className="max-w-md mx-auto bg-gradient-to-b from-[#fffbeb] via-white to-amber-50/10 border-2 border-amber-300 rounded-3xl p-6 shadow-xl relative overflow-hidden transition-all duration-300 group/spotlight">
                  
                  {/* Majestic Diamond Crown overlapping the spotlight frame */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20 w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md select-none pointer-events-none transition-transform duration-300 scale-105 group-hover/spotlight:scale-110">
                    <img 
                      src="https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Crowns-PNG/Diamond_Tiara_with_Rubies_PNG_Clipart.png" 
                      alt="Diamond Crown" 
                      className="w-full h-full object-contain filter drop-shadow-[0_4px_14px_rgba(239,68,68,0.5)]"
                    />
                  </div>

                  {/* Winner avatar with gold rotating-like radial glow */}
                  <div className="relative mt-8 mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-rose-300 to-amber-300 blur-md scale-105 animate-pulse opacity-75" />
                    <img 
                      src={firstPlace.avatar} 
                      alt={firstPlace.name} 
                      onClick={() => handleNavigateToModelProfile(firstPlace)}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mx-auto border-4 border-amber-400 shadow-xl cursor-pointer hover:scale-105 transition-transform duration-200 relative z-10 animate-fade-in"
                      title={`Ver perfil de ${firstPlace.name}`}
                    />
                    <div 
                      onClick={() => handleNavigateToModelProfile(firstPlace)}
                      className="absolute bottom-0 right-1/2 translate-x-1/2 z-20 bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-md border border-amber-300 tracking-wider cursor-pointer hover:scale-105 transition-transform"
                      title={`Ver perfil de ${firstPlace.name}`}
                    >
                      CO-DIAMOND ANGEL
                    </div>
                  </div>

                  {/* Name and votes */}
                  <div className="space-y-1">
                    <h4 className="text-lg sm:text-xl font-serif font-black text-slate-900 cursor-pointer hover:text-rose-600 hover:underline transition-colors flex items-center justify-center gap-1.5"
                        onClick={() => handleNavigateToModelProfile(firstPlace)}
                        title={`Ver perfil de ${firstPlace.name}`}
                    >
                      <span>{firstPlace.name}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-rose-600 font-extrabold flex items-center justify-center gap-1">
                      <span className="text-rose-500">❤️</span> {firstPlace.votesReceived} votos recibidos
                    </p>
                  </div>

                  {/* Slider controls embedded in the card */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-amber-100">
                    <button 
                      onClick={() => setActiveWinnerIndex(prev => prev === 0 ? activeWinnersList.length - 1 : prev - 1)}
                      className="p-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 transition cursor-pointer active:scale-90 border border-amber-200"
                      title="Anterior ganadora"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-mono tracking-widest text-amber-850 font-bold uppercase">
                      CO-GANADORA {activeWinnerIndex + 1} DE {activeWinnersList.length}
                    </span>
                    <button 
                      onClick={() => setActiveWinnerIndex(prev => prev === activeWinnersList.length - 1 ? 0 : prev + 1)}
                      className="p-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 transition cursor-pointer active:scale-90 border border-amber-200"
                      title="Siguiente ganadora"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Co-Winners List Selector Grid/Row below */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase font-mono">SELECCIONA PARA EXPLORAR SU PROYECTO</p>
                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
                    {activeWinnersList.map((winner, idx) => {
                      const isSelected = idx === activeWinnerIndex;
                      return (
                        <button
                          key={winner.userId || idx}
                          onClick={() => setActiveWinnerIndex(idx)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-400 text-slate-900 border-amber-400 font-extrabold shadow-sm scale-105' 
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <img 
                            src={winner.avatar} 
                            alt={winner.name} 
                            className="w-4.5 h-4.5 rounded-full object-cover border border-slate-300"
                          />
                          <span className="truncate max-w-[100px]">{winner.name}</span>
                          <span className="text-[10px] opacity-75">({winner.votesReceived} votos)</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-4 max-w-sm mx-auto w-full relative z-10 animate-fade-in">
                {firstPlace && (() => {
                  const matchedModel = models.find(m => m.id === firstPlace.userId || m.name.toLowerCase() === firstPlace.name.toLowerCase());
                  return (
                    <div className="w-full bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative border-2 border-amber-400/40 overflow-hidden text-center transition-all duration-300 hover:border-amber-400">
                      {/* Ambient background glow inside the black card */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                      
                      {/* Header label with star (no crowns!) */}
                      <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 rounded-full text-[10px] font-mono tracking-widest text-amber-400 font-black uppercase mx-auto mb-5">
                        ✨ INVERSOR LÍDER DE LA EDICIÓN ✨
                      </div>

                      {/* Clean High-Fashion circular profile frame */}
                      <div className="relative mb-5 inline-block">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-rose-500 blur-sm scale-105 pointer-events-none animate-pulse" />
                        <img 
                          src={firstPlace.avatar} 
                          alt={firstPlace.name} 
                          onClick={() => handleNavigateToModelProfile(firstPlace)}
                          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover mx-auto border-3 border-amber-400 shadow-xl cursor-pointer hover:scale-105 transition duration-200 relative z-10"
                          title={`Ver perfil de ${firstPlace.name}`}
                        />
                      </div>

                      {/* Name of winner */}
                      <h4 
                        onClick={() => handleNavigateToModelProfile(firstPlace)}
                        className="text-white font-sans font-black text-xl sm:text-2xl tracking-tight hover:text-amber-400 hover:underline cursor-pointer transition-colors block"
                        title={`Ver perfil de ${firstPlace.name}`}
                      >
                        {firstPlace.name}
                      </h4>

                      {/* Votes info */}
                      <div className="text-xs text-slate-300 font-extrabold flex items-center justify-center gap-1.5 mt-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                        <span>❤️ {firstPlace.votesReceived} votos acumulados</span>
                      </div>

                      {/* Luxury modern Funding box */}
                      <div className="mt-6 p-4 sm:p-5 bg-gradient-to-br from-amber-400/10 via-amber-400/5 to-transparent border border-amber-400/25 rounded-2xl">
                        <span className="text-[10px] font-mono tracking-widest text-amber-400 font-black uppercase block">
                          FINANCIACIÓN OBTENIDA
                        </span>
                        <div className="text-xl sm:text-2xl font-sans font-black text-white block mt-1 tracking-tight">
                          80,00 €
                        </div>
                        <p className="text-[9.5px] text-slate-400 block mt-1 uppercase tracking-wide font-semibold leading-relaxed">
                          Adjudicación única (80% del premio total de la ronda)
                        </p>
                      </div>

                      {/* Tiny elegant subtitle label */}
                      <div className="mt-4 text-[9px] font-mono tracking-widest text-slate-500 uppercase font-bold">
                        DIAMOND ANGEL SELECCIONADA
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Congratulatory message */}
            <p className="text-xs text-rose-950 font-medium max-w-lg mx-auto leading-relaxed bg-pink-50/50 px-5 py-3 rounded-2xl border border-pink-100">
              ¡Enhorabuena! Tu esfuerzo y dedicación de alta costura han dado frutos memorables, y este posicionamiento es totalmente merecido. ¡Mucho éxito en el siguiente desfile!
            </p>
          </div>

          {/* DYNAMIC WINNER SLIDER OR MOSAIC VIEW */}
          {firstPlace && (() => {
            if (viewMode === 'mosaic' && isMultiWinner) {
              return (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-amber-50/5 to-amber-500/5 p-4 rounded-2xl border border-amber-300/30">
                    <div className="text-left space-y-1">
                      <h4 className="text-xs font-black text-amber-900 tracking-wider font-mono flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        VISTA COMPARATIVA: MOSAICO DE PROYECTOS EMPATADOS
                      </h4>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        Explora simultáneamente las 5 iniciativas empresariales creativas que han empatado en primer lugar.
                      </p>
                    </div>
                    <button
                      onClick={() => setViewMode('individual')}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 text-[10.5px] font-bold rounded-xl border border-slate-200 shadow-3xs cursor-pointer transition active:scale-95 shrink-0"
                    >
                      Ver en Carrusel Individual
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeWinnersList.map((winner, idx) => {
                      const proj = getWinnerFullProject(winner);
                      const images = getWinnerProjectImages(winner);
                      const coverImage = images[0] || winner.avatar;
                      return (
                        <div 
                          key={winner.userId || idx}
                          className="bg-white rounded-3xl border border-pink-100/85 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 flex flex-col overflow-hidden text-left relative group"
                        >
                          {/* Decorative Cover image */}
                          <div className="h-36 relative overflow-hidden">
                            <img 
                              src={coverImage} 
                              alt={proj.title} 
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                            
                            {/* Model Profile Badge overlapping the cover */}
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigateToModelProfile(winner);
                              }}
                              className="absolute bottom-3 left-3 flex items-center gap-2 cursor-pointer group/model"
                              title={`Ver perfil de ${winner.name}`}
                            >
                              <img 
                                src={winner.avatar} 
                                alt={winner.name} 
                                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md group-hover/model:scale-105 transition-transform"
                              />
                              <div>
                                <h4 className="text-xs font-black text-white leading-tight drop-shadow-sm group-hover/model:underline">{winner.name}</h4>
                                <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950/40 px-1.5 py-0.5 rounded-md">
                                  👑 CO-GANADORA ({winner.votesReceived} votos)
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Info section */}
                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <div>
                                <span className="inline-block text-[8px] font-black tracking-widest text-[#be185d] bg-pink-100/60 px-2 py-0.5 rounded-full">
                                  CATEGORÍA: {proj.category.toUpperCase()}
                                </span>
                                <h5 className="text-sm sm:text-base font-serif font-black text-slate-900 mt-1 line-clamp-1 group-hover:text-amber-700 transition">
                                  {proj.title}
                                </h5>
                              </div>
                              
                              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 italic">
                                "{proj.descriptionShort}"
                              </p>

                              {/* Mini budget stats */}
                              <div className="grid grid-cols-2 gap-2 pt-1.5">
                                <div className="bg-slate-50/70 rounded-xl p-2 border border-slate-100">
                                  <p className="text-[7.5px] text-slate-400 font-bold uppercase tracking-wider">PRESUPUESTO</p>
                                  <p className="text-xs font-black text-slate-800">{proj.budget.toLocaleString()}€</p>
                                </div>
                                <div className="bg-slate-50/70 rounded-xl p-2 border border-slate-100">
                                  <p className="text-[7.5px] text-slate-400 font-bold uppercase tracking-wider">META FINANCIACIÓN</p>
                                  <p className="text-xs font-black text-[#be185d]">{proj.fundingGoal ? proj.fundingGoal.toLocaleString() : (proj.budget * 1.3).toLocaleString()}€</p>
                                </div>
                              </div>
                            </div>

                            {/* Action Button to Open Full Modal Detail */}
                            <button
                              type="button"
                              onClick={() => setSelectedFullProject(proj)}
                              className="w-full py-2.5 bg-slate-50 hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-500 text-slate-700 hover:text-slate-950 border border-slate-200 hover:border-amber-400 font-black text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
                            >
                              <span>📂 Ver Detalles Completos</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // Normal Slider Single Winner View
            const winnerProjectImages = getWinnerProjectImages(firstPlace);
            const winnerProject = getWinnerFullProject(firstPlace);
            return (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-pink-100/50 pb-2">
                  <h3 className="text-xs sm:text-sm font-black tracking-widest uppercase text-slate-800 font-sans flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fe2c55] animate-pulse" />
                    {isMultiWinner ? 'GALLERY OF IMAGES FROM THE WINNING PROJECTS' : 'GALLERY OF IMAGES FROM THE WINNING PROJECT'}
                  </h3>
                  {isMultiWinner && (
                    <button
                      onClick={() => setViewMode('mosaic')}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition active:scale-95 shadow-3xs flex items-center gap-1.5 shrink-0"
                    >
                      <span>📁 VISTA MOSAICO COMPARTIDO</span>
                    </button>
                  )}
                </div>

                {/* INTERACTIVE CAROUSEL SLIDER OF THE 5 WINNING PROJECTS */}
                {isMultiWinner && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase font-mono">
                        CARRUSEL DE PROYECTOS GANADORES (SELECCIONA UNO):
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const container = document.getElementById('winning-projects-scroller');
                            if (container) container.scrollBy({ left: -260, behavior: 'smooth' });
                          }}
                          className="w-6 h-6 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-[#fe2c55] border border-slate-200 flex items-center justify-center cursor-pointer transition-all active:scale-90 shadow-4xs"
                          title="Desplazar a la izquierda"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const container = document.getElementById('winning-projects-scroller');
                            if (container) container.scrollBy({ left: 260, behavior: 'smooth' });
                          }}
                          className="w-6 h-6 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-[#fe2c55] border border-slate-200 flex items-center justify-center cursor-pointer transition-all active:scale-90 shadow-4xs"
                          title="Desplazar a la derecha"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <div 
                        id="winning-projects-scroller"
                        className="flex gap-4 overflow-x-auto snap-x scrollbar-none pb-3 pt-1 px-1 scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {activeWinnersList.map((winner, idx) => {
                          const isSelected = idx === activeWinnerIndex;
                          const proj = getWinnerFullProject(winner);
                          const images = getWinnerProjectImages(winner);
                          const coverImage = images[0] || winner.avatar;
                          return (
                            <div
                              key={winner.userId || idx}
                              onClick={() => {
                                setActiveWinnerIndex(idx);
                              }}
                              className={`flex-none w-64 sm:w-72 snap-start rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-300 relative group flex flex-col justify-end text-left h-40 ${
                                isSelected
                                  ? 'border-[#fe2c55] ring-4 ring-rose-500/15 scale-[1.01] shadow-md shadow-rose-500/10'
                                  : 'border-slate-200/80 hover:border-slate-350 opacity-90 hover:opacity-100'
                              }`}
                            >
                              {/* Background project cover image */}
                              <img 
                                src={coverImage} 
                                alt={proj.title} 
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 pointer-events-none"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />

                              {/* Creator badge on top */}
                              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                                <div 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNavigateToModelProfile(winner);
                                  }}
                                  className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 hover:bg-rose-900/80 cursor-pointer transition"
                                  title={`Ver perfil de ${winner.name}`}
                                >
                                  <img 
                                    src={winner.avatar} 
                                    alt={winner.name} 
                                    className="w-4 h-4 rounded-full object-cover border border-white/20"
                                  />
                                  <span className="text-[9px] text-white font-bold truncate max-w-[120px] hover:underline">{winner.name}</span>
                                </div>
                                {isSelected ? (
                                  <span className="text-[8px] bg-[#fe2c55] text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse shadow-xs">
                                    🏆 SELECCIONADO
                                  </span>
                                ) : (
                                  <span className="text-[8px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    GANADORA
                                  </span>
                                )}
                              </div>

                              {/* Project info overlay at bottom */}
                              <div className="p-3 relative z-10 space-y-1 mt-auto pointer-events-none">
                                <span className="inline-block text-[7px] font-black text-rose-300 bg-rose-950/60 backdrop-blur-xs px-1.5 py-0.2 rounded uppercase font-mono">
                                  {proj.category}
                                </span>
                                <h4 className="text-xs font-black text-white leading-tight line-clamp-1 group-hover:text-amber-200 transition-colors">
                                  {proj.title}
                                </h4>
                                <div className="flex items-center justify-between text-[8.5px] text-slate-300 font-bold pt-1 border-t border-white/10 mt-1">
                                  <span>Presupuesto: <strong className="text-white">{proj.budget.toLocaleString()}€</strong></span>
                                  <span>{winner.votesReceived} Votos</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Reuse the custom high-fashion WinnerProjectSlider with dynamic automatic index resetting */}
                  <WinnerProjectSlider images={winnerProjectImages} />
                </div>

                {/* PROJECT SUMMARY AND DETAIL VIEW ACTION (MATCHING imagen.png STYLE) */}
                <div className="bg-gradient-to-r from-white via-pink-50/20 to-[#fff8f9] border border-pink-200/80 p-5 sm:p-6 rounded-3xl shadow-sm space-y-4 hover:border-pink-300 transition-all text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-100 pb-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-block text-[8.5px] font-black tracking-widest text-[#be185d] bg-pink-100/70 px-2.5 py-0.5 rounded-full">
                          🏆 DETALLES DEL PROYECTO SELECCIONADO
                        </span>
                        <button
                          type="button"
                          onClick={() => handleNavigateToModelProfile(firstPlace)}
                          className="inline-flex items-center gap-1 text-[9px] font-black text-rose-700 hover:text-rose-900 bg-rose-100/80 hover:bg-rose-200 px-2.5 py-0.5 rounded-full transition cursor-pointer"
                          title={`Ver perfil de ${firstPlace?.name}`}
                        >
                          <span>👤 Creadora: <strong>{firstPlace?.name}</strong></span>
                        </button>
                      </div>
                      <h4 
                        onClick={() => handleNavigateToModelProfile(firstPlace)}
                        className="text-base sm:text-lg font-serif font-bold text-slate-900 mt-1 cursor-pointer hover:text-rose-600 transition-colors"
                        title={`Ver perfil de ${firstPlace?.name}`}
                      >
                        {winnerProject.title}
                      </h4>
                      <p className="text-[11px] font-semibold text-rose-600 font-mono">
                        CATEGORÍA: {winnerProject.category.toUpperCase()}
                      </p>
                    </div>
                    <div className="bg-[#fffbfc] border border-pink-150 px-3.5 py-2 rounded-xl font-mono text-center shrink-0 self-start sm:self-center">
                      <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider">PRESUPUESTO</p>
                      <p className="text-xs sm:text-sm font-black text-slate-800">{winnerProject.budget.toLocaleString()}€</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">RESUMEN EJECUTIVO</p>
                    <p className="text-xs text-slate-650 leading-relaxed italic font-medium">
                      "{winnerProject.descriptionShort}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs py-1">
                    <div className="space-y-1 bg-[#fffcfd]/40 rounded-xl p-3 border border-pink-100/40">
                      <p className="font-extrabold text-[#be185d] flex items-center gap-1.5">
                        <span className="text-xs">🎯</span> Objetivo Estratégico
                      </p>
                      <p className="text-[11px] text-slate-550 leading-relaxed line-clamp-3">
                        {winnerProject.objective}
                      </p>
                    </div>
                    <div className="space-y-1 bg-[#fffcfd]/40 rounded-xl p-3 border border-pink-100/40">
                      <p className="font-extrabold text-[#be185d] flex items-center gap-1.5">
                        <span className="text-xs">📈</span> Plan de Gasto Recomendado
                      </p>
                      <p className="text-[11px] text-slate-550 leading-relaxed line-clamp-3">
                        {winnerProject.fundUsage}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setSelectedFullProject(winnerProject)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-white via-pink-100 to-pink-500 hover:brightness-105 hover:shadow-md text-[#1a1516] border border-pink-300 font-black text-[11px] uppercase tracking-wider rounded-xl transition active:scale-95 cursor-pointer shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>📂 Ver Proyecto Completo</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* COMPONENT: REPARTO DE PREMIOS OFICIAL - VICTORIA ICON STYLE MATCHING zz.png */}
          <div className="bg-gradient-to-r from-pink-50/70 via-white to-pink-50/70 rounded-3xl border border-pink-200 p-5 shadow-sm relative overflow-hidden" id="financial-share-angels">
            <div className="absolute top-0 right-0 py-1 px-3 bg-amber-400 text-slate-950 font-sans tracking-widest font-black text-[9px] uppercase rounded-bl-xl shadow-xs">
              REPARTO ESTRATÉGICO
            </div>

            <div className="flex flex-col gap-4 text-left pt-2">
              {/* Winner Share Box (80%) */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center shrink-0 relative shadow-sm border border-pink-100">
                  <img
                    src={firstPlace?.avatar || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=256"}
                    alt={firstPlace?.name}
                    onClick={() => handleNavigateToModelProfile(firstPlace)}
                    className="w-14 h-14 rounded-full object-cover cursor-pointer hover:scale-105 duration-100 transition border-2 border-rose-400"
                    title={`Ver perfil de ${firstPlace?.name}`}
                  />
                  {/* Copa por fuera del área de la imagen */}
                  <span className="absolute -top-1.5 -left-1.5 bg-amber-400 border border-amber-300 text-xs w-6 h-6 flex items-center justify-center rounded-full shadow-md z-10 animate-pulse">
                    🏆
                  </span>
                  <span className="absolute -bottom-1 -right-1 bg-rose-600 text-white font-mono font-black text-[9px] px-1.5 py-0.2 rounded-full leading-none z-10">
                    80%
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-rose-900 font-sans">
                    BENEFICIO DEL GANADOR (80%)
                  </h4>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-0.5">
                    El ganador <strong 
                      onClick={() => handleNavigateToModelProfile(firstPlace)}
                      className="text-rose-700 hover:text-rose-500 hover:underline cursor-pointer font-bold inline-flex items-center gap-0.5"
                      title={`Ver perfil de ${firstPlace?.name}`}
                    >
                      {firstPlace?.name} ↗
                    </strong> obtiene el <strong>80% de los votos efectivos/pozo de la mesa</strong>, embolsando <strong className="text-rose-700">{prizePerWinner.toFixed(2)}€</strong> de recompensa directa en sus finanzas.
                  </p>
                </div>
              </div>

              <div className="h-px w-full bg-pink-200/80" />

              {/* Sponsor Share Box (10%) - Placed at the bottom of this box */}
              {(() => {
                let sponsorModel = (userProfile?.patrocinadorId && models.find(m => m.id === userProfile.patrocinadorId)) ||
                  models.find(m => m.name.toLowerCase().includes('alexander') || m.username.includes('alexander')) ||
                  models.find(m => m.id === 'topm-1') ||
                  getSponsorForWinner(firstPlace) ||
                  models[0];
                const sponsorName = sponsorModel?.name || 'Alexander Vance';

                return (
                  <div className="flex items-center gap-4 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 shadow-xs">
                    <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center shrink-0 relative shadow-sm border border-amber-250">
                      <img
                        src={sponsorModel?.avatar || "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=256"}
                        alt={sponsorName}
                        onClick={() => {
                          if (sponsorModel && onSelectModel) {
                            onSelectModel(sponsorModel);
                          }
                        }}
                        className="w-14 h-14 rounded-full object-cover cursor-pointer hover:scale-105 duration-100 transition"
                      />
                      {/* Apretón de manos por fuera del área de la imagen */}
                      <span className="absolute -top-1.5 -left-1.5 bg-amber-400 border border-amber-300 text-xs w-6 h-6 flex items-center justify-center rounded-full shadow-md z-10">
                        🤝
                      </span>
                      <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 font-mono font-black text-[9px] px-1.5 py-0.2 rounded-full leading-none z-10">
                        10%
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-900 font-sans">
                        BENEFICIO DE PATROCINADOR (10%)
                      </h4>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-0.5">
                        Su Patrocinador oficial, <strong 
                          onClick={() => {
                            if (sponsorModel && onSelectModel) {
                              onSelectModel(sponsorModel);
                            }
                          }}
                          className="text-amber-800 hover:text-amber-600 hover:underline cursor-pointer font-bold"
                        >
                          {sponsorName}
                        </strong>, recibe el <strong>10% por éxito del patrocinio</strong>, equivalente a <strong className="text-amber-800 font-mono">+{(pool * 0.1).toFixed(2)}€</strong>.
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>




          {/* 🤝 🎖️ NUEVO PÓDIUM COMPLEMENTARIO: SPONSORS DE PATROCINADORES (INVERSORES) */}
          <div className="bg-gradient-to-b from-stone-50 via-white to-[#fff9fb] p-6 sm:p-10 rounded-3.5xl border border-pink-100 shadow-xl relative overflow-hidden flex flex-col justify-center text-center space-y-8">
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
            
            <div className="text-center space-y-2 relative z-10 w-full animate-fade-in">
              <span className="px-3.5 py-1 bg-pink-100/70 border border-pink-200 text-rose-700 text-[8.5px] uppercase font-black tracking-[0.2em] rounded-full inline-block">
                🤝 INVERSORES ESTRATÉGICOS 💎
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-wide uppercase">
                PODIO DE MARCAS PATROCINADORAS
              </h3>
              <p className="text-[10px] sm:text-[11px] text-amber-600 uppercase tracking-[0.16em] font-black leading-tight max-w-lg mx-auto">
                EL SPONSOR PRINCIPAL DE LA GALA DE RESULTADOS
              </p>
              <p className="text-[10px] text-slate-500 max-w-md mx-auto pt-1 leading-normal font-sans font-medium">
                Conglomerado y firma asociada que patrocina oficialmente el capital de inversión de la ronda de hoy.
              </p>
            </div>

            {/* Podium layout for corporate sponsors backing top investors */}
            {resultsSponsors.length === 1 ? (
              <div className="flex flex-col items-center max-w-sm mx-auto w-full relative z-10 pt-4 group">
                <div 
                  onClick={() => handleSponsorClick(resultsSponsors[0])}
                  className={`border rounded-t-3xl bg-gradient-to-t via-amber-50/10 to-white p-6 pb-5 text-center shadow-md w-full relative transition-all duration-300 hover:shadow-lg cursor-pointer ${resultsSponsors[0].hasExclusivity ? 'border-amber-300 ring-2 ring-amber-300' : 'border-slate-200'}`}
                >
                  {resultsSponsors[0].hasExclusivity && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 py-1 px-3 rounded-full border border-amber-400 shadow-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                      <span>🌟</span> CONTRATO DE EXCLUSIVIDAD <span>🌟</span>
                    </div>
                  )}
                  
                  {/* Initials circle or custom brand logo */}
                  {resultsSponsors[0].logoUrl ? (
                    <img 
                      src={resultsSponsors[0].logoUrl} 
                      alt={resultsSponsors[0].name} 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-contain bg-white border-2 border-amber-400 shadow-xl mx-auto transform group-hover:scale-105 transition duration-300 cursor-pointer hover:ring-2 hover:ring-amber-500 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSponsorClick(resultsSponsors[0]);
                      }}
                      title="Ver Tienda de Balmain Paris"
                    />
                  ) : (
                    <div 
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center tracking-widest shadow-2xl mx-auto transform group-hover:scale-105 transition duration-300 cursor-pointer hover:ring-2 hover:ring-amber-500 ${resultsSponsors[0].logoStyle || 'bg-[#2a1b18] text-amber-200 border-2 border-amber-400 font-serif font-black text-sm sm:text-base'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSponsorClick(resultsSponsors[0]);
                      }}
                      title="Ver Tienda de Balmain Paris"
                    >
                      {resultsSponsors[0].logoInitials || 'EXCL'}
                    </div>
                  )}
                  <span 
                    className="text-slate-900 font-black text-sm sm:text-base block mt-4 truncate uppercase tracking-widest font-sans cursor-pointer hover:text-amber-600 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSponsorClick(resultsSponsors[0]);
                    }}
                  >
                    {resultsSponsors[0].name}
                  </span>
                  <span className="text-[8.5px] text-amber-600 font-mono font-bold block mt-1 leading-none uppercase">
                    {resultsSponsors[0].sector || 'Sponsor Exclusivo'}
                  </span>
                  <span className="text-xs text-rose-500 font-black block mt-1.5 font-mono">
                    € {Number(resultsSponsors[0].amount).toLocaleString()}
                  </span>
                </div>
                {/* Pedestal */}
                <div 
                  onClick={() => handleSponsorClick(resultsSponsors[0])}
                  className="w-full bg-gradient-to-b from-amber-50 to-amber-100 border-x border-b border-amber-200 shadow-inner py-3.5 text-center rounded-b-2xl flex flex-col items-center justify-center min-h-[60px] cursor-pointer hover:bg-amber-100 transition"
                >
                  <span className="text-sm font-black text-amber-700">PATROCINADOR EXCLUSIVO GALA 👑</span>
                </div>
              </div>
            ) : resultsSponsors.length === 2 ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 items-end justify-center pt-4 max-w-md mx-auto w-full relative z-10">
                {/* Left: 2º Sponsor */}
                <div className="flex flex-col items-center group">
                  <div className="border border-slate-200 rounded-t-2xl bg-gradient-to-t via-stone-50/50 to-white p-4 pb-3.5 text-center shadow-sm w-full transition-all duration-300 hover:shadow-md">
                    {resultsSponsors[1].logoUrl ? (
                      <img 
                        src={resultsSponsors[1].logoUrl} 
                        alt={resultsSponsors[1].name} 
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-slate-200 shadow-md mx-auto transform group-hover:scale-105 transition cursor-pointer hover:ring-2 hover:ring-pink-500"
                        onClick={() => handleSponsorClick(resultsSponsors[1])}
                        title="Ver Datos de Contratación"
                      />
                    ) : (
                      <div 
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-sans tracking-[0.15em] shadow-lg mx-auto transform group-hover:scale-105 transition cursor-pointer hover:ring-2 hover:ring-pink-500 ${resultsSponsors[1].logoStyle || 'bg-[#1e2c1e] text-[#e3ded4] border font-bold text-xs sm:text-sm'}`}
                        onClick={() => handleSponsorClick(resultsSponsors[1])}
                        title="Ver Datos de Contratación"
                      >
                        {resultsSponsors[1].logoInitials || 'SP2'}
                      </div>
                    )}
                    <span 
                      className="text-slate-800 font-black text-[10.5px] sm:text-xs block mt-3 truncate uppercase tracking-widest font-sans cursor-pointer hover:text-[#fe2c55] transition"
                      onClick={() => handleSponsorClick(resultsSponsors[1])}
                    >
                      {resultsSponsors[1].name}
                    </span>
                    <span className="text-[7.8px] text-slate-400 font-mono font-bold block mt-0.5 leading-none uppercase">
                      {resultsSponsors[1].sector || 'Patrocinador Oficial'}
                    </span>
                    <span className="text-[9.5px] text-[#fe2c55] font-extrabold block mt-1 font-mono">
                      € {Number(resultsSponsors[1].amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gradient-to-b from-[#eaeaea] to-[#dddddd] border-x border-b border-slate-300 shadow-inner py-1.5 text-center rounded-b-xl flex flex-col items-center justify-center min-h-[45px]">
                    <span className="text-sm font-black text-slate-600">2º</span>
                  </div>
                </div>

                {/* Right: 1º Sponsor */}
                <div className="flex flex-col items-center scale-105 z-10 group">
                  <div className="border border-amber-300 rounded-t-2xl bg-gradient-to-t via-amber-50/20 to-white p-5 pb-4 text-center shadow-md w-full relative transition-all duration-300 hover:shadow-lg">
                    {resultsSponsors[0].logoUrl ? (
                      <img 
                        src={resultsSponsors[0].logoUrl} 
                        alt={resultsSponsors[0].name} 
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover border-2 border-amber-400 shadow-xl mx-auto transform group-hover:scale-105 transition cursor-pointer hover:ring-2 hover:ring-amber-500"
                        onClick={() => handleSponsorClick(resultsSponsors[0])}
                        title="Ver Datos de Contratación"
                      />
                    ) : (
                      <div 
                        className={`w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center tracking-widest shadow-2xl mx-auto transform group-hover:scale-105 transition cursor-pointer hover:ring-2 hover:ring-amber-500 ${resultsSponsors[0].logoStyle || 'bg-[#2a1b18] text-amber-200 border-2 border-amber-400 font-serif font-black text-xs sm:text-sm'}`}
                        onClick={() => handleSponsorClick(resultsSponsors[0])}
                        title="Ver Datos de Contratación"
                      >
                        {resultsSponsors[0].logoInitials || 'SP1'}
                      </div>
                    )}
                    <span 
                      className="text-slate-900 font-black text-[11px] sm:text-xs block mt-3 truncate uppercase tracking-widest font-sans cursor-pointer hover:text-amber-600 transition"
                      onClick={() => handleSponsorClick(resultsSponsors[0])}
                    >
                      {resultsSponsors[0].name}
                    </span>
                    <span className="text-[7.8px] text-amber-600 font-mono font-bold block mt-0.5 leading-none uppercase">
                      {resultsSponsors[0].sector || 'Sponsor Principal'}
                    </span>
                    <span className="text-[10px] text-rose-500 font-black block mt-1 font-mono">
                      € {Number(resultsSponsors[0].amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gradient-to-b from-amber-50 to-amber-100/60 border-x border-b border-amber-200 shadow-inner py-2 text-center rounded-b-xl flex flex-col items-center justify-center min-h-[50px]">
                    <span className="text-sm font-black text-amber-700">1º</span>
                  </div>
                </div>
              </div>
            ) : resultsSponsors.length === 3 ? (
              <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end justify-center pt-4 max-w-lg mx-auto w-full relative z-10">
                {/* 2º PLACE (LEFT): SILVER SPONSOR */}
                <div className="flex flex-col items-center group">
                  <div className="border border-pink-100 rounded-t-2xl bg-gradient-to-t via-stone-50 to-white p-4 pb-3.5 text-center shadow-sm w-full transition-all duration-300 hover:shadow-md">
                    {resultsSponsors[1].logoUrl ? (
                      <img 
                        src={resultsSponsors[1].logoUrl} 
                        alt={resultsSponsors[1].name} 
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-slate-200 shadow-md mx-auto transform group-hover:scale-105 transition cursor-pointer hover:ring-2 hover:ring-pink-500"
                        onClick={() => handleSponsorClick(resultsSponsors[1])}
                        title="Ver Datos de Contratación"
                      />
                    ) : (
                      <div 
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-sans tracking-[0.15em] shadow-lg mx-auto transform group-hover:scale-105 transition cursor-pointer hover:ring-2 hover:ring-pink-500 ${resultsSponsors[1].logoStyle || 'bg-[#1e2c1e] text-[#e3ded4] border border-[#e3ded4]/20 font-bold text-xs sm:text-sm'}`}
                        onClick={() => handleSponsorClick(resultsSponsors[1])}
                        title="Ver Datos de Contratación"
                      >
                        {resultsSponsors[1].logoInitials || 'KER'}
                      </div>
                    )}
                    <span 
                      className="text-slate-800 font-black text-[10.5px] sm:text-xs block mt-3 truncate uppercase tracking-widest font-sans cursor-pointer hover:text-[#fe2c55] transition"
                      onClick={() => handleSponsorClick(resultsSponsors[1])}
                    >
                      {resultsSponsors[1].name}
                    </span>
                    <span className="text-[7.8px] text-slate-400 font-mono font-bold block mt-0.5 leading-none uppercase">
                      {resultsSponsors[1].sector || 'Sponsor de Moda'}
                    </span>
                    <span className="text-[9.5px] text-[#fe2c55] font-extrabold block mt-1 font-mono">
                      € {Number(resultsSponsors[1].amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gradient-to-b from-[#eaeaea] to-[#dddddd] border-x border-b border-slate-300 shadow-inner py-1.5 text-center rounded-b-xl flex flex-col items-center justify-center min-h-[45px]">
                    <span className="text-sm font-black text-slate-600">2º</span>
                  </div>
                </div>

                {/* 1º PLACE (CENTER - GOLD): GOLD SPONSOR */}
                <div className="flex flex-col items-center z-10 scale-105 group">
                  <div className="border border-amber-300 rounded-t-2xl bg-gradient-to-t via-amber-50/20 to-white p-5 pb-4 text-center shadow-md w-full relative transition-all duration-300 hover:shadow-lg">
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 py-0.5 px-2 rounded-full border border-amber-300 shadow-sm text-[8px] font-black uppercase tracking-wider">
                      SÓLIDO
                    </div>
                    {resultsSponsors[0].logoUrl ? (
                      <img 
                        src={resultsSponsors[0].logoUrl} 
                        alt={resultsSponsors[0].name} 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-amber-400 shadow-xl mx-auto transform group-hover:scale-110 transition duration-300 animate-[pulse_4s_infinite] cursor-pointer hover:ring-2 hover:ring-amber-500"
                        onClick={() => handleSponsorClick(resultsSponsors[0])}
                        title="Ver Datos de Contratación"
                      />
                    ) : (
                      <div 
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center tracking-widest shadow-2xl mx-auto transform group-hover:scale-110 transition duration-300 animate-[pulse_3s_infinite] cursor-pointer hover:ring-2 hover:ring-amber-500 ${resultsSponsors[0].logoStyle || 'bg-[#2a1b18] text-amber-200 border-2 border-amber-400 font-serif font-black text-xs sm:text-sm'}`}
                        onClick={() => handleSponsorClick(resultsSponsors[0])}
                        title="Ver Datos de Contratación"
                      >
                        {resultsSponsors[0].logoInitials || 'LVMH'}
                      </div>
                    )}
                    <span 
                      className="text-slate-900 font-black text-[11.1px] sm:text-xs block mt-3 truncate uppercase tracking-widest font-sans cursor-pointer hover:text-amber-600 transition"
                      onClick={() => handleSponsorClick(resultsSponsors[0])}
                    >
                      {resultsSponsors[0].name}
                    </span>
                    <span className="text-[7.8px] text-amber-600 font-mono font-bold block mt-0.5 leading-none uppercase">
                      {resultsSponsors[0].sector || 'Patrocinio Titán'}
                    </span>
                    <span className="text-[10px] text-rose-500 font-black block mt-1 font-mono">
                      € {Number(resultsSponsors[0].amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gradient-to-b from-amber-50 to-amber-100/60 border-x border-b border-amber-200 shadow-inner py-2 text-center rounded-b-xl flex flex-col items-center justify-center min-h-[55px]">
                    <span className="text-base font-black text-amber-700">1º</span>
                  </div>
                </div>

                {/* 3º PLACE (RIGHT): BRONZE SPONSOR */}
                <div className="flex flex-col items-center group">
                  <div className="border border-pink-100 rounded-t-2xl bg-gradient-to-t via-stone-50 to-white p-4 pb-3.5 text-center shadow-sm w-full transition-all duration-300 hover:shadow-md">
                    {resultsSponsors[2].logoUrl ? (
                      <img 
                        src={resultsSponsors[2].logoUrl} 
                        alt={resultsSponsors[2].name} 
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-slate-200 shadow-md mx-auto transform group-hover:scale-105 transition cursor-pointer hover:ring-2 hover:ring-pink-500"
                        onClick={() => handleSponsorClick(resultsSponsors[2])}
                        title="Ver Datos de Contratación"
                      />
                    ) : (
                      <div 
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center tracking-widest shadow-lg mx-auto transform group-hover:scale-105 transition cursor-pointer hover:ring-2 hover:ring-pink-500 ${resultsSponsors[2].logoStyle || 'bg-zinc-900 border border-zinc-800 text-white font-serif font-bold text-[10px] sm:text-xs'}`}
                        onClick={() => handleSponsorClick(resultsSponsors[2])}
                        title="Ver Datos de Contratación"
                      >
                        {resultsSponsors[2].logoInitials || 'RICH'}
                      </div>
                    )}
                    <span 
                      className="text-slate-800 font-black text-[10.5px] sm:text-xs block mt-3 truncate uppercase tracking-widest font-sans cursor-pointer hover:text-[#fe2c55] transition"
                      onClick={() => handleSponsorClick(resultsSponsors[2])}
                    >
                      {resultsSponsors[2].name}
                    </span>
                    <span className="text-[7.8px] text-slate-400 font-mono font-bold block mt-0.5 leading-none uppercase">
                      {resultsSponsors[2].sector || 'Sponsor de Lujo'}
                    </span>
                    <span className="text-[9.5px] text-[#fe2c55] font-extrabold block mt-1 font-mono">
                      € {Number(resultsSponsors[2].amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gradient-to-b from-[#eaeaea] to-[#dddddd] border-x border-b border-slate-300 shadow-inner py-1.5 text-center rounded-b-xl flex flex-col items-center justify-center min-h-[45px]">
                    <span className="text-sm font-black text-slate-600">3º</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-stretch justify-center pt-4 max-w-4xl mx-auto w-full relative z-10">
                {resultsSponsors.map((spon, idx) => {
                  const place = idx + 1;
                  const isGold = idx === 0;
                  
                  return (
                    <div key={spon.id} className="flex flex-col items-center group">
                      <div className={`border rounded-t-2xl bg-gradient-to-t via-stone-50 to-white p-4 pb-3.5 text-center shadow-xs w-full transition-all duration-300 hover:shadow-md ${isGold ? 'border-amber-300' : 'border-slate-100'}`}>
                        {spon.logoUrl ? (
                          <img 
                            src={spon.logoUrl} 
                            alt={spon.name} 
                            className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-md mx-auto transform group-hover:scale-105 transition cursor-pointer"
                            onClick={() => handleSponsorClick(spon)}
                            title="Ver Datos de Contratación"
                          />
                        ) : (
                          <div 
                            className={`w-14 h-14 rounded-full flex items-center justify-center font-sans tracking-[0.1em] shadow-xs mx-auto transform group-hover:scale-105 transition cursor-pointer ${spon.logoStyle || 'bg-slate-800 text-white font-bold text-xs'}`}
                            onClick={() => handleSponsorClick(spon)}
                            title="Ver Datos de Contratación"
                          >
                            {spon.logoInitials || spon.name.substring(0, 3)}
                          </div>
                        )}
                        <span 
                          className="text-slate-800 font-extrabold text-[11px] block mt-3 truncate uppercase tracking-wider font-sans cursor-pointer hover:text-[#fe2c55] transition"
                          onClick={() => handleSponsorClick(spon)}
                        >
                          {spon.name}
                        </span>
                        <span className="text-[7.5px] text-slate-400 font-mono font-bold block mt-0.5 leading-none uppercase">
                          {spon.sector || 'Sponsor de Moda'}
                        </span>
                        <span className="text-[9px] text-[#fe2c55] font-extrabold block mt-1 font-mono">
                          € {Number(spon.amount).toLocaleString()}
                        </span>
                      </div>
                      <div className={`w-full border-x border-b shadow-inner py-1 text-center rounded-b-xl flex flex-col items-center justify-center min-h-[35px] ${isGold ? 'bg-gradient-to-b from-amber-50 to-amber-100/60 border-amber-200 text-amber-700' : 'bg-gradient-to-b from-[#eaeaea] to-[#dddddd] border-slate-200 text-slate-600'}`}>
                        <span className="text-xs font-black">{place}º</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>



        </div>

        {/* RIGHT COLUMN (4/12 OF SCREEN WIDTH) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-3">
            <h3 className="text-[10.5px] font-black tracking-widest uppercase text-slate-500 font-mono flex items-center justify-between">
              <span>10 PARTICIPANTES TOTALES</span>
              <span className="text-emerald-500">100% Votos</span>
            </h3>

            <div className="bg-white border border-pink-100 rounded-3xl p-5 space-y-4 shadow-2xs">
              <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto no-scrollbar">
                {[...completedSessionToDisplay.participants]
                  .sort((a, b) => b.votesReceived - a.votesReceived)
                  .map((part) => {
                  const isSelf = part.userId === userProfile.id;
                  const matchedModel = models.find(m => m.id === part.userId || m.name.toLowerCase() === part.name.toLowerCase());
                  return (
                    <div 
                      key={part.userId} 
                      onClick={() => handleNavigateToModelProfile(part)}
                      className="bg-pink-50/20 rounded-xl p-3 border border-pink-100/50 flex flex-col justify-between items-start space-y-1.5 transition hover:border-pink-300 hover:bg-pink-50/50 hover:scale-[1.01] active:scale-98 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2 truncate w-full text-left">
                        <img 
                          src={part.avatar} 
                          alt={part.name} 
                          onError={(e) => handleAvatarError(e, part.name)}
                          className="w-10 h-10 rounded-full object-cover border border-pink-100 shrink-0 cursor-pointer" 
                        />
                        <span className="text-slate-800 font-extrabold text-xs truncate">
                          {part.name}
                        </span>
                      </div>
                      
                      <div className="w-full text-left flex items-center justify-between mt-1 pt-1 border-t border-pink-100/30">
                        {isSelf ? (
                          <span className="text-[8.5px] font-bold text-red-500 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded uppercase tracking-tight">
                            Mesa
                          </span>
                        ) : (
                          <span className="text-[8.5px] font-bold text-rose-455 text-rose-500 bg-pink-50 border border-pink-205 px-1.5 py-0.2 rounded uppercase tracking-tight">
                            Votado
                          </span>
                        )}
                        <span className="text-[10px] font-black text-rose-600 font-mono">
                          {part.votesReceived} votos
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white border border-pink-100 rounded-3xl p-5 space-y-3 shadow-2xs text-center">
            <h4 className="text-xs font-black text-rose-900 uppercase tracking-widest flex items-center justify-center gap-1.5 font-mono">
              <Wallet className="w-4 h-4 text-pink-500" />
              <span>Mi Portafolio Creativo</span>
            </h4>
            <p className="text-[10.5px] text-slate-400 font-medium leading-relaxed">
              Consulte sus retornos acumulados, movimientos de fondos u operaciones inmediatas.
            </p>
            <button
              onClick={() => {
                setCompletedSessionToDisplay(null);
                setSimulationLogs([]);
                if (onNavigateToTab) onNavigateToTab('finance');
              }}
              className="w-full px-4 py-2 bg-gradient-to-r from-white via-pink-100 to-pink-500 hover:brightness-105 text-[#1a1516] border border-pink-250 font-black rounded-lg text-[10.5px] uppercase tracking-wide transition active:scale-95 cursor-pointer shadow-xs"
            >
              Ir a Mi Portafolio
            </button>
          </div>

        </div>
      </div>

      {/* BOTTOM CONTROL ACTIONS */}
      <div className="text-center pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-pink-100 relative z-10">
        <div className="flex items-center gap-2 text-slate-400 text-[10px] text-left font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Asignación del 10% de afiliación y 10% de comisión de plataforma ejecutado con éxito.</span>
        </div>
        
        <button
           onClick={() => {
             setCompletedSessionToDisplay(null);
             setSimulationLogs([]);
             setIsCastingPublished(false);
           }}
           className="px-5 py-2.5 bg-gradient-to-r from-white via-pink-100 to-pink-500 hover:brightness-105 text-black border border-pink-250 font-black text-[11px] uppercase tracking-wider rounded-xl transition active:scale-95 cursor-pointer shadow-md"
        >
          Cerrar Concurso
        </button>
      </div>

      {/* FULL WINNING PROJECT DOSSIER MODAL */}
      {selectedFullProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-md bg-slate-950/50" id="full-project-dossier-modal">
          <div className="bg-white border border-pink-200 rounded-3xl w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden animate-scale-up text-left">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-pink-100 bg-[#fffbfc] relative shrink-0">
              <button 
                type="button" 
                onClick={() => setSelectedFullProject(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full w-8 h-8 flex items-center justify-center focus:outline-none transition cursor-pointer"
                title="Cerrar Dossier"
                id="close-dossier-button"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1.5 text-[8.5px] font-black uppercase text-[#be185d]">
                <FileText className="w-3.5 h-3.5 text-pink-500" />
                <span>DOSSIER DE REGISTRO OFICIAL - PORTAL DE PROYECTOS</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-900 mt-2 tracking-wide leading-tight">
                {selectedFullProject.title}
              </h3>
              <p className="text-xs font-semibold text-pink-600 font-mono mt-1">
                CATEGORÍA REGISTRADA: {selectedFullProject.category.toUpperCase()}
              </p>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="bg-slate-50 border-b border-pink-100 px-4 sm:px-6 py-2 flex gap-1 sm:gap-2 overflow-x-auto shrink-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveModalTab('info')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeModalTab === 'info' 
                    ? 'bg-gradient-to-r from-white via-pink-150 to-pink-500 text-slate-950 border border-pink-300 shadow-sm font-black' 
                    : 'text-slate-500 hover:text-slate-850 bg-transparent hover:bg-slate-100 border border-transparent'
                }`}
                id="tab-label-info"
              >
                <Info className="w-3.5 h-3.5 shrink-0" />
                Paso 1: Información Básica
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('financial')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeModalTab === 'financial' 
                    ? 'bg-gradient-to-r from-white via-pink-150 to-pink-500 text-slate-950 border border-pink-300 shadow-sm font-black' 
                    : 'text-slate-500 hover:text-slate-850 bg-transparent hover:bg-slate-100 border border-transparent'
                }`}
                id="tab-label-financial"
              >
                <Coins className="w-3.5 h-3.5 shrink-0" />
                Paso 2: Estructura Financiera
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('team')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeModalTab === 'team' 
                    ? 'bg-gradient-to-r from-white via-pink-150 to-pink-500 text-slate-950 border border-pink-300 shadow-sm font-black' 
                    : 'text-slate-500 hover:text-slate-850 bg-transparent hover:bg-slate-100 border border-transparent'
                }`}
                id="tab-label-team"
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                Paso 3: Equipo Creativo
              </button>
            </div>

            {/* Modal Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              
              {/* TAB 1: INFORMACIÓN BÁSICA */}
              {activeModalTab === 'info' && (
                <div className="space-y-6 animate-fade-in text-slate-700">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-pink-500" />
                      <span>Resumen de la Propuesta / Estilo</span>
                    </h4>
                    <p className="text-xs text-slate-800 leading-relaxed font-semibold bg-pink-50/20 p-4 border border-pink-100/30 rounded-2xl italic">
                      "{selectedFullProject.descriptionShort}"
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-wider">
                      DESCRIPCIÓN EXTENDIDA (DOSSIER COMPLETO DE MARCA)
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {selectedFullProject.descriptionLong}
                    </p>
                  </div>

                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-white border border-slate-150 rounded-2xl space-y-1">
                      <p className="text-[9px] font-black text-slate-400 font-mono uppercase tracking-wider">CORREO ELECTRÓNICO OFICIAL</p>
                      <p className="text-xs font-bold text-slate-750 flex items-center gap-1.5 leading-normal">
                        <Mail className="w-3.5 h-3.5 text-pink-500" />
                        <a href={`mailto:${selectedFullProject.contactEmail}`} className="hover:underline hover:text-pink-600">
                          {selectedFullProject.contactEmail}
                        </a>
                      </p>
                    </div>
                    <div className="p-3 bg-white border border-slate-150 rounded-2xl space-y-1">
                      <p className="text-[9px] font-black text-slate-400 font-mono uppercase tracking-wider">TELÉFONO DE CONTACTO OFICIAL</p>
                      <p className="text-xs font-bold text-slate-750 flex items-center gap-1.5 leading-normal">
                        <Phone className="w-3.5 h-3.5 text-pink-500" />
                        <span>{selectedFullProject.contactPhone}</span>
                      </p>
                    </div>
                  </div>

                  {/* Multimedia Attachments lists */}
                  {selectedFullProject.videos && selectedFullProject.videos.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-wider">
                        VÍDEO PROMOCIONAL ADJUNTO
                      </h4>
                      <div className="aspect-video w-full max-w-lg mx-auto bg-slate-950 rounded-2xl overflow-hidden shadow-md border border-slate-100">
                        {/* Elegant interactive video element */}
                        <video 
                          src={selectedFullProject.videos[0]} 
                          controls 
                          muted 
                          className="w-full h-full object-cover" 
                          poster="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ESTRUCTURA FINANCIERA */}
              {activeModalTab === 'financial' && (
                <div className="space-y-6 animate-fade-in text-slate-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-[#fffdfd] to-[#fffbfc] border border-pink-200 p-4 rounded-2xl space-y-1">
                      <span className="text-[9px] font-black text-slate-400 font-mono uppercase tracking-widest block font-sans">PRESUPUESTO ESTIMADO GENERAL</span>
                      <span className="text-xl font-bold font-serif text-slate-900 block mt-1">
                        {selectedFullProject.budget.toLocaleString()}€
                      </span>
                      <p className="text-[10px] text-slate-400 leading-normal">Total calculado preliminar para costeo operativo del desfile.</p>
                    </div>

                    <div className="bg-gradient-to-br from-[#fffdfd] to-[#fffbfc] border border-pink-200 p-4 rounded-2xl space-y-1">
                      <span className="text-[9px] font-black text-[#be185d] font-mono uppercase tracking-widest block font-sans">META DE FINANCIAMIENTO COMPLETO</span>
                      <span className="text-xl font-bold font-serif text-[#be185d] block mt-1">
                        {selectedFullProject.fundingGoal ? selectedFullProject.fundingGoal.toLocaleString() : (selectedFullProject.budget * 1.3).toLocaleString()}€
                      </span>
                      <p className="text-[10px] text-slate-500 leading-normal">Mínimo sugerido para desarrollo industrial secundario.</p>
                    </div>
                  </div>

                  <div className="space-y-2 bg-[#fffcfc] p-4 border border-pink-100/50 rounded-2xl">
                    <h4 className="text-[10px] font-extrabold text-[#be185d] font-sans uppercase tracking-wider flex items-center gap-1.5">
                      <span>🎯</span> OBJETIVO ESTRATÉGICO GENERAL
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {selectedFullProject.objective}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-wider">
                      PLAN DESTINADO DEL USO DE FONDOS OBTENIDOS
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {selectedFullProject.fundUsage}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-wider">
                      CRONOGRAMA DE IMPLANTACIÓN Y HITOS CRÍTICOS
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
                      {selectedFullProject.timeline}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-wider">
                      DESGLOSE DETALLADO DE GASTOS ASOCIADOS
                    </h4>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 font-mono text-xs">
                      {selectedFullProject.budgetBreakdown ? (
                        <p className="text-slate-650 whitespace-pre-line leading-relaxed">
                          {selectedFullProject.budgetBreakdown}
                        </p>
                      ) : (
                        <p className="text-slate-400 italic">No se registró desglose pormenorizado.</p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-pink-50/30 border border-pink-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-pink-500 flex-shrink-0" />
                      <div>
                        <p className="font-extrabold text-slate-800">Dossier de Viabilidad y Auditoría Adjunto</p>
                        <p className="text-[10px] text-slate-400 font-medium">Firma electrónica de pasarela de alta costura validada.</p>
                      </div>
                    </div>
                    {selectedFullProject.documentationName ? (
                      <a 
                        href={selectedFullProject.documentationUrl || "#"} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] rounded-lg tracking-wide shrink-0 border border-slate-150 transition inline-flex items-center gap-1 uppercase"
                      >
                        <span>📂 Descargar: {selectedFullProject.documentationName}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono italic">No se adjuntaron anexos.</span>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: EQUIPO CREATIVO */}
              {activeModalTab === 'team' && (
                <div className="space-y-6 animate-fade-in text-slate-700">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-wider">
                      INTEGRANTES DEL PROYECTO GANADOR
                    </h4>
                    <p className="text-[11px] text-slate-450 font-medium">Lista de talentos responsables del diseño y la sustentabilidad oficial.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedFullProject.team && selectedFullProject.team.map((member: any, i: number) => (
                      <div key={i} className="bg-[#fffcfd]/40 rounded-2xl p-4 border border-pink-100/50 space-y-3 relative hover:border-pink-200 transition">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-pink-100 border border-pink-150 flex items-center justify-center font-serif text-pink-700 font-bold text-sm uppercase shrink-0">
                            {member.name.slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-serif font-black text-slate-900 text-sm truncate">{member.name}</p>
                            <p className="text-[10px] font-bold text-pink-600 font-mono uppercase tracking-tight">{member.role}</p>
                          </div>
                        </div>

                        <div className="text-xs space-y-1 bg-white/80 p-3 rounded-xl border border-slate-100">
                          <p className="text-slate-500">
                            <strong className="font-bold text-slate-750">Experiencia:</strong> {member.experience || 'No detallada'}
                          </p>
                          <p className="text-slate-550 leading-relaxed text-[11px] pt-1">
                            {member.bio || 'Diseñador integral de alta costura.'}
                          </p>
                        </div>

                        {member.profileLink && member.profileLink !== '#' && (
                          <div className="pt-1">
                            <a 
                              href={member.profileLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-[10px] font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1 hover:underline inline-flex"
                            >
                              <span>🔗 Visitar Perfil Profesional (Instagram / Web)</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-pink-100 bg-[#fffbfc] text-center flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="text-[10px] text-slate-400 font-bold font-mono">
                REGISTRADO SECRETAMENTE EN PASARELAS DE ALTA COSTURA
              </span>
              <button
                type="button"
                onClick={() => setSelectedFullProject(null)}
                className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-[11px] uppercase tracking-wider rounded-xl transition active:scale-95 cursor-pointer shadow-sm"
              >
                Volver a Resultados
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 📜 B2B SPONSORSHIP CONTRACT DETAIL MODAL FOR PODIUM VIEW */}
      {selectedPodiumSponsorDetail && (
        <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-slate-950/90 p-2 sm:p-4 animate-fade-in font-sans backdrop-blur-md overflow-y-auto">
          <div className="bg-white border-2 border-emerald-300 rounded-3xl w-full max-w-lg p-6 sm:p-8 text-slate-900 space-y-6 shadow-2xl relative my-auto transform scale-100 transition duration-300">
            
            {/* Absolute close button */}
            <button 
              onClick={() => setSelectedPodiumSponsorDetail(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition cursor-pointer border-0 shadow-3xs hover:scale-105 active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header & Logo */}
            <div className="text-center space-y-3 pb-4 border-b border-dashed border-slate-200">
              {selectedPodiumSponsorDetail.logoUrl ? (
                <img 
                  src={selectedPodiumSponsorDetail.logoUrl} 
                  alt={selectedPodiumSponsorDetail.name} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-emerald-400 shadow-lg mx-auto" 
                />
              ) : (
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-xl uppercase tracking-widest font-black shadow-lg mx-auto ${selectedPodiumSponsorDetail.logoStyle || 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
                  {selectedPodiumSponsorDetail.logoInitials || selectedPodiumSponsorDetail.name.substring(0, 3)}
                </div>
              )}
              
              <div>
                <span className="bg-emerald-100 text-emerald-850 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full inline-block">
                  ✓ Contrato B2B Homologado
                </span>
                <h4 className="text-xl font-black text-slate-950 mt-1.5 uppercase font-display tracking-tight">
                  {selectedPodiumSponsorDetail.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium italic mt-0.5">
                  {selectedPodiumSponsorDetail.sector || 'Patrocinio Comercial'}
                </p>
              </div>
            </div>

            {/* Contract Specific Details */}
            <div className="space-y-4 text-xs">
              
              {/* Presupuesto */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-150 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">FONDOS COMPROMETIDOS</span>
                  <span className="text-lg font-black text-emerald-850 mt-0.5 block font-mono">
                    € {Number(selectedPodiumSponsorDetail.amount || 35000).toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">REPRESENTANTE</span>
                  <span className="text-xs font-bold text-slate-700 mt-0.5 block">
                    {userProfile.name}
                  </span>
                </div>
              </div>

              {/* Fechas de Alianza B2B */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">FECHA DE INICIO</span>
                  <span className="text-xs font-black text-slate-800 block mt-0.5 font-mono">
                    {selectedPodiumSponsorDetail.startDate || '2026-06-21'}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">FIN DE ACTIVACIÓN</span>
                  <span className="text-xs font-black text-slate-800 block mt-0.5 font-mono">
                    {selectedPodiumSponsorDetail.endDate || '2026-12-31'}
                  </span>
                </div>
              </div>

              {/* Descripción de la Propuesta (Bloque de texto) */}
              <div className="space-y-1.5 text-left font-sans">
                <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono font-bold">DESCRIPCIÓN DE LA PROPUESTA (DEAL TERMS)</span>
                <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100 text-slate-750 italic leading-relaxed text-xs relative">
                  <span className="absolute -top-3 left-3 bg-amber-200 text-amber-950 text-[8px] px-1.5 py-0.5 rounded font-black font-mono">PROPUESTA OFICIAL</span>
                  "{selectedPodiumSponsorDetail.proposalDescription || 'Alianza de branding estratégico para el impulso de marcas del sector en los resultados finales del certamen de alta costura, garantizando visibilidad en podium y materiales interactivos.'}"
                </div>
              </div>

              {/* Terminos legales adicionales */}
              <div className="text-[9.5px] text-slate-400 text-center leading-relaxed pt-2 border-t border-slate-100 font-mono">
                Este dossier de contratación certifica legalmente los términos oficiales bajo el marco del simulador de resultados finales.
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  localStorage.setItem('came_from_results_podium', 'true');
                  if (completedSessionToDisplay) {
                    try {
                      localStorage.setItem('podium_session_backup', JSON.stringify(completedSessionToDisplay));
                    } catch (e) {
                      console.error(e);
                    }
                  }
                  if (setCompletedSessionToDisplay) {
                    setCompletedSessionToDisplay(null);
                  }
                  setSelectedPodiumSponsorDetail(null);
                  if (onNavigateToTab) {
                    onNavigateToTab('casting_live');
                  }
                }}
                className="px-6 py-2.5 bg-slate-950 hover:bg-black text-amber-300 font-black text-xs rounded-xl shadow-md transition cursor-pointer border border-amber-400/40 hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <span>🛍️ Visitar Tienda Balmain Paris</span>
              </button>
              <button
                onClick={() => setSelectedPodiumSponsorDetail(null)}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl shadow-xs transition cursor-pointer border border-slate-200"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
