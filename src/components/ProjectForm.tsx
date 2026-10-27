import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectData, ProjectTeamMember } from '../types';
import { 
  FileText, 
  Trash2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  UploadCloud, 
  CreditCard, 
  Camera, 
  Lock, 
  Check, 
  Mail, 
  Phone, 
  Eye, 
  Tag,
  Sparkles,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { generateProjectPDF } from '../utils/pdfGenerator';

interface ProjectFormProps {
  userProjects: ProjectData[];
  userId: string;
  onAddProject: (project: ProjectData) => void;
  userVerified: boolean;
  onVerifyUserToggle: () => void;
  onNavigateToTab?: (tab: 'home' | 'finance' | 'sessions' | 'create_project' | 'chat' | 'profile' | 'patrocinados' | 'saved_projects' | 'casting_live') => void;
}

// Faceted luxury diamond SVG icon
const DiamondIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="6,3 18,3 22,8 12,21 2,8" />
    <line x1="2" y1="8" x2="22" y2="8" />
    <polyline points="6,3 10,8 12,21 14,8 18,3" />
    <line x1="10" y1="8" x2="14" y2="8" />
  </svg>
);

export default function ProjectForm({
  userProjects,
  userId,
  onAddProject,
  userVerified,
  onVerifyUserToggle,
  onNavigateToTab
}: ProjectFormProps) {
  // Stepper flow configuration
  const [activeStep, setActiveStep] = useState<'basic' | 'finance' | 'team'>('basic');

  // Step 1: Basic Info state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Inteligencia artificial y automatización');
  const [descShort, setDescShort] = useState('');
  const [descLong, setDescLong] = useState('');
  const [contactEmail, setContactEmail] = useState('contacto@fashionfinances.net');
  const [contactPhone, setContactPhone] = useState('+34 654 321 098');
  const [showAdvancedMedia, setShowAdvancedMedia] = useState(false);

  const [imagesList, setImagesList] = useState<string[]>([
    'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=600'
  ]);
  const [videosList, setVideosList] = useState<string[]>([
    'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4'
  ]);
  const [hoveredMedia, setHoveredMedia] = useState<{ url: string; type: 'image' | 'video' } | null>(null);
  
  // Input for adding urls dynamically
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // Step 2: Financials Info state
  const [budget, setBudget] = useState(100);
  const [fundingGoal, setFundingGoal] = useState<number>(5000);
  const [objective, setObjective] = useState('');
  const [fundUsage, setFundUsage] = useState('');
  const [timeline, setTimeline] = useState('');
  
  // Interactive Expense Breakdown
  const [budgetItems, setBudgetItems] = useState<{ id: string; item: string; amount: number }[]>([
    { id: 'b-1', item: 'Telas Origen Orgánico Certificado', amount: 3000 },
    { id: 'b-2', item: 'Servicios de Patronaje y Taller', amount: 1200 },
    { id: 'b-3', item: 'Book Fotográfico y Filmación Dron', amount: 800 }
  ]);
  const [newBudgetItem, setNewBudgetItem] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');

  // Simulated documentation upload state
  const [uploadedDocName, setUploadedDocName] = useState('Plan-de-Viabilidad-Sostenible.pdf');
  const [uploadedDocUrl, setUploadedDocUrl] = useState('https://collectives.network/docs/premium-viability-v1.pdf');
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Step 3: Team state
  const [teamMembers, setTeamMembers] = useState<ProjectTeamMember[]>([
    { 
      name: 'Ernesto V. S.', 
      role: 'Fundador y Diseñador', 
      experience: '5 años en el sector creativo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      profileLink: 'https://instagram.com/ernestovs',
      bio: 'Apasionado de la sastrería minimalista y textiles orgánicos compostables.'
    }
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberExp, setNewMemberExp] = useState('');
  const [newMemberProfile, setNewMemberProfile] = useState('');
  const [newMemberBio, setNewMemberBio] = useState('');

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Helper to add budget items
  const addBudgetItem = () => {
    if (!newBudgetItem || !newBudgetAmount) return;
    const amountVal = Number(newBudgetAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    setBudgetItems([...budgetItems, {
      id: `bi-${Date.now()}`,
      item: newBudgetItem.trim(),
      amount: amountVal
    }]);
    setNewBudgetItem('');
    setNewBudgetAmount('');
  };

  const removeBudgetItem = (itemId: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== itemId));
  };

  // Simulated upload triggers
  const triggerSimulatedDocUpload = (fileName: string) => {
    setIsUploadingDoc(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploadingDoc(false);
          setUploadedDocName(fileName || 'Documentacion-Adjunta.pdf');
          setUploadedDocUrl(`https://collectives.network/user-content/${fileName || 'Documentacion-Adjunta.pdf'}`);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const handleDesktopFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      if (!isImage && !isVideo) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        if (resultUrl) {
          if (isImage) {
            setImagesList((prev) => [...prev, resultUrl]);
          } else if (isVideo) {
            setVideosList((prev) => [...prev, resultUrl]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addTeamMember = () => {
    if (!newMemberName || !newMemberRole) return;
    setTeamMembers([...teamMembers, { 
      name: newMemberName, 
      role: newMemberRole, 
      experience: newMemberExp || 'Experiencia acreditada en el sector.',
      profileLink: newMemberProfile || undefined,
      bio: newMemberBio || undefined
    }]);
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberExp('');
    setNewMemberProfile('');
    setNewMemberBio('');
  };

  const removeTeamMember = (index: number) => {
    if (index === 0) return; // Founder protected
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !descLong || !objective || !fundUsage) {
      alert('Por favor, rellena todos los campos obligatorios del proyecto.');
      return;
    }

    if (!termsAccepted) {
      alert('Debe leer y aceptar los términos de veracidad legal del proyecto.');
      return;
    }

    const itemizedText = budgetItems.map(item => `${item.item}: ${item.amount}€`).join('\n');

    const newProject: ProjectData = {
      id: `proj-${Date.now()}`,
      userId,
      title,
      category,
      descriptionShort: descShort || title,
      descriptionLong: descLong,
      budget,
      objective,
      fundUsage,
      timeline: timeline || 'Fase única de implantación en el ecosistema Fashion Finances.',
      team: teamMembers,
      termsAccepted,
      images: imagesList,
      status: 'submitted',
      fundingGoal: fundingGoal || (budget * 50),
      budgetBreakdown: itemizedText,
      videos: videosList,
      contactEmail: contactEmail || 'contacto@fashionfinances.net',
      contactPhone: contactPhone || '+34 654 321 098',
      documentationName: uploadedDocName,
      documentationUrl: uploadedDocUrl
    };

    onAddProject(newProject);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setTitle('');
      setDescShort('');
      setDescLong('');
      setObjective('');
      setFundUsage('');
      setTimeline('');
      setActiveStep('basic');
      if (onNavigateToTab) {
        onNavigateToTab('saved_projects');
      }
    }, 2000);
  };

  const handleDownloadPDF = () => {
    generateProjectPDF({
      project: {
        title: title || 'Borrador de Proyecto',
        category,
        budget,
        fundingGoal: fundingGoal || (budget * 50),
        descriptionShort: descShort,
        descriptionLong: descLong,
        objective,
        fundUsage,
        timeline,
        team: teamMembers,
        budgetItems: budgetItems.map(b => ({ item: b.item, amount: b.amount })),
        contactEmail,
        contactPhone,
      },
      authorName: teamMembers[0]?.name || 'Ernesto V. S.'
    });
  };

  return (
    <div 
      className="w-full min-h-screen bg-gradient-to-br from-[#FEF5F6] via-[#FDF2F4] to-[#FCE7F3] rounded-[32px] sm:rounded-[40px] border border-pink-200/80 p-5 sm:p-8 lg:p-12 relative overflow-hidden text-left shadow-2xl shadow-pink-950/10 font-sans"
      id="luxury-fashion-finances-portal"
    >
      {/* GLAMOROUS MODEL BACKGROUND ACCENT AT TOP-RIGHT */}
      <div className="absolute top-0 right-0 w-[460px] max-w-[50vw] h-[400px] pointer-events-none z-0 overflow-hidden">
        <img 
          src="/assets/aistudio/luxury_model_clean.png" 
          alt="Fashion Model" 
          className="w-full h-full object-cover object-top opacity-90 mix-blend-multiply mask-radial-fade"
          style={{
            maskImage: 'radial-gradient(circle at 75% 30%, black 55%, transparent 95%)',
            WebkitMaskImage: 'radial-gradient(circle at 75% 30%, black 55%, transparent 95%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#FDF2F4]/40 to-[#FDF2F4]" />
      </div>

      {/* LUXURY TOP HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 relative z-10 border-b border-pink-200/60">
        
        {/* Brand FF Crown Logo & Title */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <img 
            src="/assets/aistudio/luxury_ff_logo.png" 
            alt="FF Crown Logo" 
            className="h-14 sm:h-16 w-auto object-contain drop-shadow-sm shrink-0" 
          />
          <div className="flex flex-col">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight leading-none text-slate-950 flex items-center gap-2">
              <span className="font-black text-slate-900">FASHION</span>
              <span className="font-normal bg-gradient-to-r from-[#be185d] via-[#db2777] to-[#9d174d] bg-clip-text text-transparent">FINANCES</span>
            </h2>
            <div className="text-[9px] sm:text-[10.5px] font-extrabold text-slate-700 tracking-[0.28em] uppercase mt-1.5 font-sans">
              FASHION • MODELS • INVESTMENT
            </div>
          </div>
        </div>

        {/* Action Buttons: "Volver a Proyectos Guardados" + "CIFRADO DE SEGURIDAD SSL" */}
        <div className="flex flex-wrap items-center gap-3 relative z-20">
          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab('saved_projects')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-xs sm:text-sm font-bold shadow-lg shadow-pink-600/30 transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-[#e11d48] via-[#db2777] to-[#be185d] border border-pink-300/40 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Proyectos Guardados</span>
            </button>
          )}

          <div className="flex items-center gap-2 px-5 py-2.5 bg-white/95 rounded-full border border-amber-200/90 shadow-sm text-slate-800">
            <Lock className="w-4 h-4 text-[#991b1b] fill-[#991b1b]/20" />
            <span className="text-[10px] font-extrabold text-slate-800 tracking-[0.16em] uppercase font-mono">
              CIFRADO DE SEGURIDAD SSL
            </span>
          </div>
        </div>

      </div>

      {/* HERO SLOGAN: "Tu idea, EL SIGUIENTE NIVEL" */}
      <div className="mt-8 mb-8 text-left relative z-10 max-w-2xl">
        <span className="block text-3xl sm:text-4xl lg:text-[42px] text-[#db2777] font-['Alex_Brush',cursive] leading-none mb-1 -rotate-2 transform origin-left">
          Tu idea,
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black font-serif tracking-tight text-slate-900 leading-[1.05] uppercase">
          EL SIGUIENTE NIVEL
        </h1>
        <div className="text-xs sm:text-sm font-extrabold text-slate-700 tracking-[0.38em] uppercase mt-2.5">
          FINANCIA • CRECE • BRILLA
        </div>
      </div>

      {/* MAIN CONTAINER: SIDEBAR + FORM CARD */}
      {isSuccess ? (
        <div className="bg-slate-900 text-white rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto shadow-2xl border border-pink-500/30 animate-fade-in relative z-10 my-12">
          <div className="w-16 h-16 bg-pink-500/10 text-pink-400 border border-pink-500/40 rounded-2xl flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-serif font-bold text-white">¡Proyecto Registrado Oficialmente!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Tu proyecto <strong className="text-pink-400">"{title}"</strong> ya califica en el ecosistema Fashion Finances y ha quedado registrado de manera exitosa.
            </p>
          </div>
          <div className="pt-2">
            <span className="inline-block px-4 py-1.5 bg-slate-800 text-pink-300 border border-pink-500/30 rounded-full text-[10px] font-mono animate-pulse">
              Redirigiendo a tus proyectos guardados...
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start relative z-10">

          {/* LEFT LUXURY COLUMN: CREATIVIDAD QUE GENERA VALOR */}
          <div className="hidden lg:block lg:col-span-3 xl:col-span-3 shrink-0">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-pink-300/60 sticky top-6 transition-all duration-300 hover:shadow-pink-900/15">
              <img 
                src="/assets/aistudio/luxury_left_column_clean.png" 
                alt="Creatividad que genera valor - Moda, Finanzas, Oportunidades Globales" 
                className="w-full h-auto object-cover block"
              />
            </div>
          </div>

          {/* MAIN LUXURY WHITE FORM CARD */}
          <div className="lg:col-span-9 xl:col-span-9 bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-10 shadow-2xl shadow-pink-950/5 border border-[#fce7f3] relative space-y-8">
            
            {/* 3-STEP DIAMOND PROGRESS BAR */}
            <div className="relative pb-6 border-b border-stone-200/80">
              {/* Connecting line between the 3 steps */}
              <div className="absolute top-6 left-12 right-12 h-0.5 bg-gradient-to-r from-pink-500 via-pink-300 to-pink-200 -z-0" />

              <div className="flex justify-between items-start relative z-10">

                {/* Step 1: IDENTIDAD CREATIVA */}
                <button
                  type="button"
                  onClick={() => setActiveStep('basic')}
                  className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
                >
                  <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeStep === 'basic'
                      ? 'bg-gradient-to-tr from-[#db2777] to-[#e11d48] text-white shadow-lg shadow-pink-500/40 scale-105 ring-4 ring-pink-100'
                      : 'bg-white border-2 border-pink-300 text-pink-600 hover:border-pink-500'
                  }`}>
                    <DiamondIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 bg-pink-100/70 px-2 py-0.5 rounded-full font-mono">1</span>
                  <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider transition-colors ${
                    activeStep === 'basic' ? 'text-[#db2777]' : 'text-slate-600 group-hover:text-pink-600'
                  }`}>
                    IDENTIDAD CREATIVA
                  </span>
                </button>

                {/* Step 2: ECONOMÍA Y FONDOS */}
                <button
                  type="button"
                  onClick={() => setActiveStep('finance')}
                  className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
                >
                  <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeStep === 'finance'
                      ? 'bg-gradient-to-tr from-[#db2777] to-[#e11d48] text-white shadow-lg shadow-pink-500/40 scale-105 ring-4 ring-pink-100'
                      : 'bg-white border-2 border-pink-300 text-pink-600 hover:border-pink-500'
                  }`}>
                    <DiamondIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 bg-pink-100/70 px-2 py-0.5 rounded-full font-mono">2</span>
                  <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider transition-colors ${
                    activeStep === 'finance' ? 'text-[#db2777]' : 'text-slate-600 group-hover:text-pink-600'
                  }`}>
                    ECONOMÍA Y FONDOS
                  </span>
                </button>

                {/* Step 3: EQUIPO HUMANO */}
                <button
                  type="button"
                  onClick={() => setActiveStep('team')}
                  className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
                >
                  <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeStep === 'team'
                      ? 'bg-gradient-to-tr from-[#db2777] to-[#e11d48] text-white shadow-lg shadow-pink-500/40 scale-105 ring-4 ring-pink-100'
                      : 'bg-white border-2 border-pink-300 text-pink-600 hover:border-pink-500'
                  }`}>
                    <DiamondIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 bg-pink-100/70 px-2 py-0.5 rounded-full font-mono">3</span>
                  <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider transition-colors ${
                    activeStep === 'team' ? 'text-[#db2777]' : 'text-slate-600 group-hover:text-pink-600'
                  }`}>
                    EQUIPO HUMANO
                  </span>
                </button>

              </div>
            </div>

            {/* FORM CONTAINER */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">

              {/* STEP 1: IDENTIDAD CREATIVA */}
              {activeStep === 'basic' && (
                <div className="space-y-6 animate-fade-in text-left">
                  
                  {/* Step Title Header */}
                  <div>
                    <span className="text-[11px] font-extrabold text-amber-800/90 uppercase tracking-[0.2em] block mb-1">
                      PASO 1 DE 3
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-900 tracking-tight leading-tight">
                      Identidad Creativa del Proyecto
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mt-1.5">
                      Define los pilares centrales de tu proyecto creativo de indumentaria, modelaje o producción de moda.
                    </p>
                  </div>

                  <hr className="border-stone-200" />

                  {/* Form Fields matching Registro_de_Moda_y_Finanzas_de_Lujo */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* TÍTULO DEL PROYECTO */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                        <DiamondIcon className="w-4 h-4 text-amber-600" />
                        <span>TÍTULO DEL PROYECTO *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ej. Eco-Lux Runway Primavera"
                        className="w-full bg-[#fcfbfa] border border-stone-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-stone-400 font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
                      />
                    </div>

                    {/* CATEGORÍA COMERCIAL */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                        <Tag className="w-4 h-4 text-rose-600" />
                        <span>CATEGORÍA COMERCIAL *</span>
                      </label>
                      <div className="relative">
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-[#fcfbfa] border border-stone-300 rounded-xl px-4 py-3 text-sm text-slate-900 font-medium appearance-none focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition cursor-pointer pr-10"
                        >
                          <option value="Inteligencia artificial y automatización">Inteligencia artificial y automatización</option>
                          <option value="Agricultura y alimentos">Agricultura y alimentos</option>
                          <option value="Realidad virtual y aumentada">Realidad virtual y aumentada</option>
                          <option value="Energía y recursos">Energía y recursos</option>
                          <option value="Transporte y movilidad">Transporte y movilidad</option>
                          <option value="Gaming y e-sports">Gaming y e-sports</option>
                          <option value="Ciberseguridad">Ciberseguridad</option>
                          <option value="Marketplace">Marketplace</option>
                          <option value="Moda y belleza">Moda y belleza</option>
                          <option value="Bienes raíces o proptech">Bienes raíces o proptech</option>
                          <option value="Tecnología y software">Tecnología y software</option>
                          <option value="Salud y biotecnología">Salud y biotecnología</option>
                          <option value="Educación y formación">Educación y formación</option>
                          <option value="Finanzas y fintech">Finanzas y fintech</option>
                          <option value="Sostenibilidad o impacto ambiental">Sostenibilidad o impacto ambiental</option>
                          <option value="Comercio y retail">Comercio y retail</option>
                          <option value="Servicios profesionales">Servicios profesionales</option>
                          <option value="Operaciones o logística">Operaciones o logística</option>
                          <option value="Turismo y viajes">Turismo y viajes</option>
                          <option value="Hostelería y restauración">Hostelería y restauración</option>
                          <option value="Construcción e infraestructura">Construcción e infraestructura</option>
                          <option value="Industria y manufactura">Industria y manufactura</option>
                          <option value="Telecomunicaciones">Telecomunicaciones</option>
                          <option value="Medios de comunicación">Medios de comunicación</option>
                          <option value="Marketing y publicidad">Marketing y publicidad</option>
                          <option value="Recursos humanos y empleo">Recursos humanos y empleo</option>
                          <option value="Legal o legaltech">Legal o legaltech</option>
                          <option value="Seguros o insurtech">Seguros o insurtech</option>
                          <option value="Economía colaborativa">Economía colaborativa</option>
                          <option value="Arte y cultura">Arte y cultura</option>
                          <option value="Música y audio">Música y audio</option>
                          <option value="Deportes y fitness">Deportes y fitness</option>
                          <option value="Mascotas">Mascotas</option>
                          <option value="Hogar y decoración">Hogar y decoración</option>
                          <option value="Electrónica de consumo">Electrónica de consumo</option>
                          <option value="Automoción">Automoción</option>
                          <option value="Aeroespacial y defensa">Aeroespacial y defensa</option>
                          <option value="Blockchain y Web3">Blockchain y Web3</option>
                          <option value="Criptomonedas">Criptomonedas</option>
                          <option value="IoT (Internet de las Cosas)">IoT (Internet de las Cosas)</option>
                          <option value="Robótica">Robótica</option>
                          <option value="Smart Cities">Smart Cities</option>
                          <option value="Gobierno o GovTech">Gobierno o GovTech</option>
                          <option value="ONG e impacto social">ONG e impacto social</option>
                          <option value="Eventos">Eventos</option>
                          <option value="Lujo">Lujo</option>
                          <option value="Infantil y familia">Infantil y familia</option>
                          <option value="Recursos naturales y minería">Recursos naturales y minería</option>
                          <option value="Ciencia e investigación">Ciencia e investigación</option>
                          <option value="Otros">Otros</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-4 pointer-events-none" />
                      </div>
                    </div>

                  </div>

                  {/* LEMA O DESCRIPCIÓN BREVE */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span>LEMA O DESCRIPCIÓN BREVE (MÁX. 120 CARACTERES) *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={descShort}
                      onChange={(e) => setDescShort(e.target.value)}
                      placeholder="Ej. Fusión de lino biodegradable de Galicia con cortes futuristas y alta costura."
                      maxLength={120}
                      className="w-full bg-[#fcfbfa] border border-stone-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-stone-400 font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
                    />
                  </div>

                  {/* DESCRIPCIÓN DETALLADA O ABSTRACT */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-rose-600" />
                      <span>DESCRIPCIÓN DETALLADA O ABSTRACT *</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={descLong}
                      onChange={(e) => setDescLong(e.target.value)}
                      placeholder="¿Cuál es la visión comercial del proyecto? ¿Cómo vas a promocionar sus diseños en pasarelas compartidas con influencers? Explica aquí la estética, cortes de tela, inspiraciones artísticas y materialidad..."
                      className="w-full bg-[#fcfbfa] border border-stone-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-stone-400 font-medium focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition resize-none leading-relaxed"
                    />
                  </div>

                  {/* COLLAPSIBLE ADVANCED MEDIA & CONTACT DETAILS */}
                  <div className="border border-pink-200/80 rounded-2xl overflow-hidden bg-pink-50/20">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedMedia(!showAdvancedMedia)}
                      className="w-full px-5 py-3.5 flex items-center justify-between text-left bg-pink-100/40 hover:bg-pink-100/60 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-pink-600" />
                        <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                          Datos de Contacto y Multimedia del Proyecto
                        </span>
                        <span className="text-[10px] text-pink-700 font-bold bg-pink-200/60 px-2 py-0.5 rounded-full">
                          {imagesList.length + videosList.length} archivos
                        </span>
                      </div>
                      {showAdvancedMedia ? <ChevronUp className="w-4 h-4 text-slate-600" /> : <ChevronDown className="w-4 h-4 text-slate-600" />}
                    </button>

                    {showAdvancedMedia && (
                      <div className="p-5 space-y-5 bg-white">
                        {/* Contact info inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-pink-600" />
                              Correo Electrónico *
                            </label>
                            <input
                              type="email"
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              className="w-full bg-[#fcfbfa] border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-pink-600" />
                              Teléfono Móvil *
                            </label>
                            <input
                              type="tel"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              className="w-full bg-[#fcfbfa] border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                            />
                          </div>
                        </div>

                        {/* Media previews */}
                        <div className="space-y-3">
                          <label className="text-[11px] font-bold text-slate-700 uppercase flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-pink-600" />
                            Archivos Multimedia y Books
                          </label>

                          <div className="flex flex-wrap gap-3">
                            {imagesList.map((url, index) => (
                              <div 
                                key={index} 
                                onMouseEnter={() => setHoveredMedia({ url, type: 'image' })}
                                onMouseLeave={() => setHoveredMedia(null)}
                                className="relative group w-24 h-24 rounded-2xl overflow-hidden border border-pink-200 shadow-sm shrink-0 hover:scale-105 transition bg-stone-100"
                              >
                                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                  <Eye className="w-4 h-4 text-white" />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setImagesList(imagesList.filter((_, i) => i !== index))}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            {videosList.map((url, index) => (
                              <div 
                                key={index} 
                                onMouseEnter={() => setHoveredMedia({ url, type: 'video' })}
                                onMouseLeave={() => setHoveredMedia(null)}
                                className="relative group w-24 h-24 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 flex flex-col items-center justify-center shrink-0 p-2 text-white"
                              >
                                <span className="font-bold text-[10px]">📹 Video</span>
                                <button
                                  type="button"
                                  onClick={() => setVideosList(videosList.filter((_, i) => i !== index))}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-bold"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Desktop file upload */}
                          <div className="border border-dashed border-stone-300 rounded-xl p-4 text-center bg-[#faf8f7] hover:bg-pink-50/30 transition">
                            <input
                              type="file"
                              id="desktop-media-upload"
                              multiple
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={handleDesktopFilesUpload}
                            />
                            <label htmlFor="desktop-media-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                              <UploadCloud className="w-5 h-5 text-pink-600" />
                              <span className="text-xs font-bold text-slate-800">Subir imágenes o vídeos desde el dispositivo</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PRIMARY ACTION BUTTON: [ 💎 Siguiente paso → ] */}
                  <div className="pt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setActiveStep('finance')}
                      className="px-10 py-3.5 rounded-full text-white font-bold text-sm bg-gradient-to-r from-[#e11d48] via-[#db2777] to-[#be185d] shadow-lg shadow-pink-600/35 hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 border border-pink-300/40 cursor-pointer"
                    >
                      <DiamondIcon className="w-4 h-4" />
                      <span>Siguiente paso</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* STEP 2: FINANZAS E IMPACTO */}
              {activeStep === 'finance' && (
                <div className="space-y-6 animate-fade-in text-left">
                  
                  {/* Step Title Header */}
                  <div>
                    <span className="text-[11px] font-extrabold text-amber-800/90 uppercase tracking-[0.2em] block mb-1">
                      PASO 2 DE 3
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-900 tracking-tight leading-tight">
                      Aspectos Económicos e Impacto
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mt-1.5">
                      El presupuesto se define en base a la mesa de inversión que deseas calificar.
                    </p>
                  </div>

                  <hr className="border-stone-200" />

                  {/* Budget and goal */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Presupuesto Referencia de Mesa (EUR) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-sm text-pink-600 font-bold font-mono">€</span>
                        <input
                          type="number"
                          required
                          value={budget}
                          onChange={(e) => setBudget(Number(e.target.value))}
                          className="w-full bg-[#fcfbfa] border border-stone-300 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-900 font-bold font-mono focus:outline-none focus:border-pink-500"
                        />
                      </div>
                      <span className="text-[10px] text-stone-400 block">
                        Rango: <strong>10€</strong> (Streetwear), <strong>100€</strong> (Casual) o <strong>1.000€</strong> (Alta Gama).
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Objetivo de Recaudación (EUR) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-sm text-emerald-600 font-bold font-mono">€</span>
                        <input
                          type="number"
                          required
                          value={fundingGoal}
                          onChange={(e) => setFundingGoal(Number(e.target.value))}
                          placeholder="Ej. 5000"
                          className="w-full bg-[#fcfbfa] border border-stone-300 rounded-xl pl-8 pr-4 py-3 text-sm text-slate-900 font-bold font-mono focus:outline-none focus:border-pink-500"
                        />
                      </div>
                      <span className="text-[10px] text-stone-400 block">
                        Meta total de financiación requerida para el desarrollo del proyecto.
                      </span>
                    </div>
                  </div>

                  {/* Fund usage and objective */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Uso Detallado de Fondos (Distribución) *
                    </label>
                    <input
                      type="text"
                      required
                      value={fundUsage}
                      onChange={(e) => setFundUsage(e.target.value)}
                      placeholder="Ej. 60% Confección telas, 30% Fotografía y video, 10% Accesorios"
                      className="w-full bg-[#fcfbfa] border border-stone-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-stone-400 font-medium focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Objetivo del Financiamiento *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      placeholder="Ej. Financiar la compra de hilos reciclados de alta resistencia y organizar una pasarela filmada para las redes de afiliados de nuestras modelos sponsors."
                      className="w-full bg-[#fcfbfa] border border-stone-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-stone-400 font-medium focus:outline-none focus:border-pink-500 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Expense Breakdown */}
                  <div className="bg-[#faf8f7] rounded-2xl p-5 border border-pink-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-pink-600" />
                        Partidas de Gasto Desglosadas
                      </span>
                      <span className="text-xs bg-pink-100 text-pink-800 border border-pink-200 px-3 py-1 rounded-full font-mono font-bold">
                        Total Sumado: {budgetItems.reduce((acc, current) => acc + current.amount, 0)}€
                      </span>
                    </div>

                    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-100 max-h-48 overflow-y-auto">
                      {budgetItems.map(item => (
                        <div key={item.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                          <span className="font-semibold text-slate-800 flex-1">{item.item}</span>
                          <span className="font-mono font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded border border-pink-100">{item.amount} €</span>
                          <button
                            type="button"
                            onClick={() => removeBudgetItem(item.id)}
                            className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-lg transition cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Concepto de gasto (Ej. Telas seda, Patronaje)"
                        value={newBudgetItem}
                        onChange={(e) => setNewBudgetItem(e.target.value)}
                        className="bg-white border border-stone-300 rounded-xl flex-1 px-3.5 py-2 text-xs text-slate-800 focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Monto €"
                        value={newBudgetAmount}
                        onChange={(e) => setNewBudgetAmount(e.target.value)}
                        className="w-24 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono font-bold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addBudgetItem}
                        className="bg-slate-900 hover:bg-pink-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        + Añadir
                      </button>
                    </div>
                  </div>

                  {/* Document upload simulation */}
                  <div className="bg-[#faf8f7] rounded-2xl p-5 border border-pink-100 space-y-3">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-pink-600" />
                      Documentación Oficial o Dossier Corporativo
                    </label>

                    <div className="bg-white rounded-xl border border-dashed border-stone-300 p-5 text-center space-y-3">
                      {isUploadingDoc ? (
                        <div className="space-y-2 py-2">
                          <span className="text-xs text-pink-600 font-bold block animate-pulse">Sincronizando archivo de forma segura...</span>
                          <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden mx-auto max-w-xs">
                            <div className="bg-gradient-to-r from-pink-500 to-rose-400 h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono block">{uploadProgress}% Completado</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="mx-auto w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-600">
                            <FileText className="w-5 h-5" />
                          </div>
                          <span className="text-xs text-slate-700 font-bold block">
                            {uploadedDocName || 'Arrastra tu PDF de viabilidad aquí'}
                          </span>
                          <div className="flex flex-wrap gap-2 justify-center pt-1">
                            <button
                              type="button"
                              onClick={() => triggerSimulatedDocUpload('Plan_Comercial_ModaSostenible_V3.pdf')}
                              className="bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 text-[10px] px-3 py-1 rounded-lg font-bold transition cursor-pointer"
                            >
                              📄 Cargar Plan de Negocio.pdf
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerSimulatedDocUpload('Dossier_Maquetas_Pasarela.pdf')}
                              className="bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-200 text-[10px] px-3 py-1 rounded-lg font-bold transition cursor-pointer"
                            >
                              📄 Cargar Dossier Alta Costura.pdf
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="pt-6 flex justify-between items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveStep('basic')}
                      className="px-6 py-3 rounded-full border border-stone-300 text-slate-700 font-bold text-xs hover:bg-stone-100 transition cursor-pointer flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Volver al Paso 1</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveStep('team')}
                      className="px-10 py-3.5 rounded-full text-white font-bold text-sm bg-gradient-to-r from-[#e11d48] via-[#db2777] to-[#be185d] shadow-lg shadow-pink-600/35 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <DiamondIcon className="w-4 h-4" />
                      <span>Siguiente: Equipo Humano</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {/* STEP 3: EQUIPO HUMANO */}
              {activeStep === 'team' && (
                <div className="space-y-6 animate-fade-in text-left">
                  
                  {/* Step Title Header */}
                  <div>
                    <span className="text-[11px] font-extrabold text-amber-800/90 uppercase tracking-[0.2em] block mb-1">
                      PASO 3 DE 3
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-900 tracking-tight leading-tight">
                      Equipo detrás del Backstage
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mt-1.5">
                      La solvencia de una propuesta recae en su talento humano. Registra los roles clave del proyecto.
                    </p>
                  </div>

                  <hr className="border-stone-200" />

                  {/* Registered team list */}
                  <div className="space-y-3">
                    {teamMembers.map((m, idx) => (
                      <div 
                        key={idx} 
                        className="bg-[#faf8f7] border border-pink-100 rounded-2xl p-4 flex flex-col gap-2 transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-rose-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                              {m.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm">{m.name}</p>
                              <p className="text-xs text-stone-500">
                                <span>Rol: <strong className="text-pink-700">{m.role}</strong></span> • <span>Exp: {m.experience}</span>
                              </p>
                            </div>
                          </div>

                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => removeTeamMember(idx)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 bg-white rounded-lg border border-rose-200 transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {m.bio && (
                          <p className="text-xs text-stone-600 pl-13 italic">"{m.bio}"</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add member box */}
                  <div className="p-5 bg-white rounded-2xl border border-dashed border-pink-300 space-y-4">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                      + Añadir Miembro del Equipo
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Nombre completo *"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        className="bg-[#fcfbfa] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                      />
                      <input
                        type="text"
                        placeholder="Función / Rol *"
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        className="bg-[#fcfbfa] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                      />
                      <input
                        type="text"
                        placeholder="Experiencia"
                        value={newMemberExp}
                        onChange={(e) => setNewMemberExp(e.target.value)}
                        className="bg-[#fcfbfa] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="w-full py-2.5 bg-slate-900 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Añadir Miembro
                    </button>
                  </div>

                  {/* Legal terms check */}
                  <div className="p-5 bg-amber-500/5 border border-amber-300/80 rounded-2xl space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-5 h-5 text-pink-600 mt-0.5 focus:ring-0 cursor-pointer shrink-0 rounded border-amber-300 accent-pink-600"
                      />
                      <div className="text-xs text-slate-700 leading-relaxed">
                        Manifiesto bajo juramento que los datos del proyecto y la viabilidad de financiamiento son <strong>100% verídicos y reales</strong>. Consiento que cualquier información falsa resultará en la exclusión inmediata del ecosistema Fashion Finances.
                      </div>
                    </label>
                  </div>

                  {/* Submission and PDF */}
                  <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveStep('finance')}
                      className="px-6 py-3 rounded-full border border-stone-300 text-slate-700 font-bold text-xs hover:bg-stone-100 transition cursor-pointer flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Volver al Paso 2</span>
                    </button>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleDownloadPDF}
                        className="px-6 py-3 rounded-full bg-white hover:bg-pink-50 text-pink-800 border border-pink-300 text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-pink-600" />
                        <span>Descargar Dossier PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!termsAccepted}
                        className={`px-8 py-3.5 rounded-full text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all shadow-lg ${
                          termsAccepted
                            ? 'bg-gradient-to-r from-[#e11d48] via-[#db2777] to-[#be185d] shadow-pink-600/35 hover:scale-105 active:scale-95 cursor-pointer'
                            : 'bg-stone-300 cursor-not-allowed text-stone-500'
                        }`}
                      >
                        <DiamondIcon className="w-4 h-4" />
                        <span>Registrar Proyecto Oficialmente</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </form>

          </div>

        </div>
      )}

      {/* LUXURY FOOTER MATCHING SCREENSHOT */}
      <div className="mt-14 pt-8 border-t border-amber-300/50 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex-1 flex flex-col items-center">
          <div className="flex items-center gap-4 text-amber-900/90 text-xs font-black tracking-[0.35em] uppercase font-serif">
            <span className="w-12 sm:w-20 h-px bg-amber-400"></span>
            <span>FASHION FINANCES</span>
            <span className="w-12 sm:w-20 h-px bg-amber-400"></span>
          </div>
          <span className="text-[10px] text-slate-600 font-bold tracking-[0.25em] uppercase mt-1.5 font-sans">
            DONDE LA MODA SE ENCUENTRA CON EL FUTURO
          </span>
        </div>

        <div className="text-center sm:text-right shrink-0">
          <span className="font-['Alex_Brush',cursive] text-3xl sm:text-4xl text-[#db2777] block leading-tight drop-shadow-xs">
            Dream Invest Grow ♡
          </span>
        </div>
      </div>

      {/* LIGHTBOX PREVIEW MODAL FOR MEDIA HOVER */}
      <AnimatePresence>
        {hoveredMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative bg-transparent p-0 rounded-2xl shadow-2xl border-0 max-w-[280px] sm:max-w-xs max-h-[45vh] flex flex-col items-center justify-center z-10 overflow-hidden pointer-events-none"
            >
              {hoveredMedia.type === 'image' ? (
                <img
                  src={hoveredMedia.url}
                  alt="Vista Previa"
                  className="max-w-full max-h-[40vh] object-contain rounded-2xl shadow-xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <video
                  src={hoveredMedia.url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="max-w-full max-h-[40vh] object-contain rounded-2xl shadow-xl"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
