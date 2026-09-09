import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectData, ProjectTeamMember } from '../types';
import { 
  FileText, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  ShieldCheck, 
  Database, 
  Calendar, 
  UploadCloud, 
  Fingerprint, 
  CreditCard, 
  Camera, 
  Building2, 
  Sparkles, 
  Lock, 
  Check, 
  Mail, 
  Phone, 
  MapPin, 
  Eye, 
  Info,
  ChevronRight,
  User,
  AlertCircle,
  Download
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
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
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

    // Convert structured list into text description for backwards compatibility
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
      
      // Extended fields
      fundingGoal: fundingGoal || (budget * 50),
      budgetBreakdown: itemizedText,
      videos: videosList,
      contactEmail: contactEmail || 'contacto@fashionfinances.net',
      contactPhone: contactPhone || '+34 600 000 000',
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
      setContactEmail('');
      setContactPhone('');
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
    <div className="bg-white rounded-3xl border border-slate-150 p-6 sm:p-8 space-y-8 shadow-sm text-left relative overflow-hidden" id="premium-project-form-container">
      
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50/20 rounded-full blur-3xl -z-10" />

      {/* Elegant Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-indigo-650 text-white rounded-2xl shadow-sm">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">Portal de Registro de Proyectos</h2>
          </div>
        </div>

        {/* Info label and Navigation Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {onNavigateToTab && (
            <button
              type="button"
              onClick={() => onNavigateToTab('saved_projects')}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 border border-indigo-200 rounded-xl font-bold transition-all active:scale-95 cursor-pointer font-sans text-xs shadow-3xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Proyectos Guardados</span>
            </button>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Cifrado de Seguridad SSL</span>
          </div>
        </div>
      </div>

      {/* Success View */}
      {isSuccess ? (
        <div className="bg-slate-900 text-white rounded-3xl p-8 text-center space-y-4 max-w-xl mx-auto shadow-lg border border-slate-800 animate-fade-in">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-3xl">
            ✓
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-100">¡Proyecto Registrado Oficialmente!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Tu proyecto <strong className="text-indigo-400">"{title}"</strong> ya califica en el simulador y ha sido registrado correctamente. Ya puedes participar en sesiones activas de inversión.
            </p>
          </div>
          <div className="pt-2">
            <span className="inline-block px-3.5 py-1.5 bg-slate-800 text-slate-350 border border-slate-700 rounded-full text-[10px] font-mono animate-pulse">
              Volviendo a la mesa de control...
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* STEPPER NAVIGATION SIDEBAR */}
          <div className="lg:col-span-3 space-y-2 lg:border-r lg:border-slate-100 lg:pr-6" id="form-stepper-sidebar">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block mb-4">
              Progreso de Calificación
            </span>

            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setActiveStep('basic')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                activeStep === 'basic'
                  ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-sm font-bold scale-[1.02]'
                  : 'bg-transparent text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs">Identidad Creativa</span>
              </div>
              {title && <Check className="w-3.5 h-3.5 text-emerald-500" />}
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => setActiveStep('finance')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                activeStep === 'finance'
                  ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-sm font-bold scale-[1.02]'
                  : 'bg-transparent text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs">Economía y Fondos</span>
              </div>
              {fundUsage && objective && <Check className="w-3.5 h-3.5 text-emerald-500" />}
            </button>

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => setActiveStep('team')}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                activeStep === 'team'
                  ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-sm font-bold scale-[1.02]'
                  : 'bg-transparent text-slate-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs">Equipo Humano</span>
              </div>
              {teamMembers.length > 0 && <Check className="w-3.5 h-3.5 text-emerald-500" />}
            </button>

            {/* Active Project Card if loaded */}
            {userProjects.length > 0 && (
              <div className="mt-8 p-4 bg-emerald-50 border border-emerald-150 rounded-2xl space-y-2">
                <span className="text-[8px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                  {userProjects.length === 1 ? '✓ Registrado' : `✓ ${userProjects.length} Registrados`}
                </span>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {userProjects.map((p) => (
                    <p key={p.id} className="text-xs font-bold text-slate-800 line-clamp-1 flex items-center gap-1.5" title={p.title}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">{p.title}</span>
                    </p>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed block">
                  {userProjects.length === 1 
                    ? 'Ya has subido un proyecto calificado para ingresar en las rondas.' 
                    : 'Ya has subido proyectos calificados para ingresar en las rondas.'
                  }
                </p>
              </div>
            )}
          </div>

          {/* ACTIVE STEP CONTENT CONTAINER */}
          <div className="lg:col-span-9 bg-slate-50/50 rounded-2xl border border-slate-150 p-5 sm:p-7 space-y-6">
            
            {/* Horizontal Step Pills matching image.png */}
            <div className="bg-slate-100/90 border border-slate-200/80 rounded-2xl p-2 flex flex-wrap sm:grid sm:grid-cols-3 gap-2 text-center text-[10px] sm:text-[11px] font-black">
              <button
                type="button"
                onClick={() => setActiveStep('basic')}
                className={`py-2 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer font-sans ${
                  activeStep === 'basic'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                    : 'bg-white text-slate-800 border-slate-200/90 hover:bg-slate-50'
                }`}
                title="Paso 1: Identidad Creativa"
              >
                <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-mono ${
                  activeStep === 'basic' ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-white'
                }`}>1</span>
                <span className="truncate">IDENTIDAD CREATIVA</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStep('finance')}
                className={`py-2 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer font-sans ${
                  activeStep === 'finance'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                    : 'bg-white text-slate-800 border-slate-200/90 hover:bg-slate-50'
                }`}
                title="Paso 2: Economía y Fondos"
              >
                <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-mono ${
                  activeStep === 'finance' ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-white'
                }`}>2</span>
                <span className="truncate">ECONOMÍA Y FONDOS</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveStep('team')}
                className={`py-2 px-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer font-sans ${
                  activeStep === 'team'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100'
                }`}
                title="Paso 3: Equipo Humano"
              >
                <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-mono ${
                  activeStep === 'team' ? 'bg-white text-emerald-800' : 'bg-emerald-600 text-white'
                }`}>3</span>
                <span className="truncate">EQUIPO HUMANO ✓</span>
              </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              
              {/* STEP 1: IDENTIDAD CREATIVA */}
              {activeStep === 'basic' && (
                <div className="space-y-5 animate-fade-in text-left">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">Paso 1 de 3</span>
                    <h3 className="text-lg font-bold text-slate-900">Identidad Creativa del Proyecto</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Define los pilares centrales de tu proyecto creativo de indumentaria, modelaje o producción de moda.
                    </p>
                  </div>

                  <hr className="border-slate-150" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">Título del Proyecto *</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ej. Eco-Lux Runway Primavera"
                        className="bg-white border border-slate-205 rounded-xl w-full px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">Categoría Comercial *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-white border border-slate-205 rounded-xl w-full px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium cursor-pointer"
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
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Lema o Descripción Breve (Máx. 120 caracteres) *</label>
                    <input
                      type="text"
                      required
                      value={descShort}
                      onChange={(e) => setDescShort(e.target.value)}
                      placeholder="Ej. Fusión de lino biodegrable de Galicia con cortes futuristas y alta costura."
                      maxLength={120}
                      className="bg-white border border-slate-205 rounded-xl w-full px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Descripción Detallada o Abstract *</label>
                    <textarea
                      required
                      rows={5}
                      value={descLong}
                      onChange={(e) => setDescLong(e.target.value)}
                      placeholder="¿Cuál es la visión comercial del proyecto? ¿Cómo vas a promocionar sus diseños en pasarelas compartidas con influencers? Explica aquí la estética, cortes de tela, inspiraciones artísticas y materialidad..."
                      className="bg-white border border-slate-205 rounded-xl w-full px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-sans resize-none"
                    />
                  </div>

                  {/* DATOS DE CONTACTO */}
                  <div className="bg-slate-100/50 rounded-2xl p-4 border border-slate-200/60 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      Datos de Contacto del Proyecto
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-500">Correo Electrónico *</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="Ej. mi.proyecto@diseno.com"
                          className="bg-white border border-slate-205 rounded-xl w-full px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-500">Teléfono Móvil *</label>
                        <input
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="Ej. +34 654 321 098"
                          className="bg-white border border-slate-205 rounded-xl w-full px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* IMÁGENES O VIDEOS */}
                  <div className="bg-slate-100/50 rounded-2xl p-4 border border-slate-200/60 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-indigo-100 bg-indigo-600 p-0.5 rounded" />
                      Imágenes o Videos de Referencia
                    </h4>
                    
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Sube o enlaza imágenes inspiracionales, bocetos, vídeos de desfiles anteriores o books para que los inversionistas analicen la estética visual.
                    </p>

                    {/* Image list previews */}
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-3">
                        {imagesList.map((url, index) => (
                          <div 
                            key={index} 
                            onMouseEnter={() => setHoveredMedia({ url, type: 'image' })}
                            onMouseLeave={() => setHoveredMedia(null)}
                            className="relative group w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs shrink-0 transition-all duration-300 hover:scale-[1.04] hover:border-indigo-400 hover:shadow-md cursor-zoom-in bg-slate-50"
                          >
                            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                              <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImagesList(imagesList.filter((_, i) => i !== index));
                                if (hoveredMedia?.url === url) setHoveredMedia(null);
                              }}
                              className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-5.5 h-5.5 flex items-center justify-center p-0 shadow-md hover:scale-110 active:scale-95 transition text-[10px] font-extrabold leading-none select-none cursor-pointer z-10"
                              title="Eliminar imagen"
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
                            className="relative group w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 flex flex-col items-center justify-center shrink-0 text-[10px] text-white font-sans p-2 text-center transition-all duration-300 hover:scale-[1.04] hover:border-indigo-400 hover:shadow-md cursor-zoom-in"
                          >
                            <span className="font-bold text-xs">📹 Vídeo</span>
                            <span className="text-[9px] text-slate-400 truncate w-full mt-1 px-1">{url.split('/').pop()?.substring(0,12) || 'video.mp4'}</span>
                            <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                              <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setVideosList(videosList.filter((_, i) => i !== index));
                                if (hoveredMedia?.url === url) setHoveredMedia(null);
                              }}
                              className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-5.5 h-5.5 flex items-center justify-center p-0 shadow-md hover:scale-110 active:scale-95 transition text-[10px] font-extrabold leading-none select-none cursor-pointer z-10"
                              title="Eliminar video"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Desktop File Upload Area */}
                      <div className="border border-dashed border-slate-350 hover:border-indigo-500 bg-white hover:bg-indigo-50/10 rounded-2xl p-5 transition-all duration-300 text-center relative group shadow-3xs">
                        <input
                          type="file"
                          id="desktop-media-upload"
                          multiple
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={handleDesktopFilesUpload}
                        />
                        <label 
                          htmlFor="desktop-media-upload" 
                          className="flex flex-col items-center justify-center cursor-pointer space-y-2.5 py-1.5"
                        >
                          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-105 transition-transform duration-300 shadow-3xs border border-indigo-100/40">
                            <UploadCloud className="w-5.5 h-5.5" />
                          </div>
                          <div className="space-y-1">
                            <span className="block text-xs font-bold text-slate-800">
                              Subir archivo desde el escritorio
                            </span>
                            <span className="block text-[10px] text-slate-450 font-semibold">
                              Soporta imágenes (.jpg, .png, .webp) y videos (.mp4)
                            </span>
                          </div>
                        </label>
                      </div>

                      {/* Add Image URL or Video URL */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex gap-1.5">
                          <input
                            type="url"
                            placeholder="Enlace de imagen (.jpg, .png)"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            className="bg-white border border-slate-205 rounded-xl flex-1 px-3 py-2 text-xs text-slate-800 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newImageUrl.trim()) {
                                setImagesList([...imagesList, newImageUrl.trim()]);
                                setNewImageUrl('');
                              }
                            }}
                            className="bg-indigo-600 hover:bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                          >
                            +Img
                          </button>
                        </div>

                        <div className="flex gap-1.5">
                          <input
                            type="url"
                            placeholder="Enlace de video (.mp4)"
                            value={newVideoUrl}
                            onChange={(e) => setNewVideoUrl(e.target.value)}
                            className="bg-white border border-slate-205 rounded-xl flex-1 px-3 py-2 text-xs text-slate-800 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newVideoUrl.trim()) {
                                setVideosList([...videosList, newVideoUrl.trim()]);
                                setNewVideoUrl('');
                              }
                            }}
                            className="bg-indigo-600 hover:bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
                          >
                            +Vid
                          </button>
                        </div>
                      </div>

                      {/* Presets shortcut buttons to make simulation extremely simple and gorgeous */}
                      <div className="flex flex-wrap gap-1 items-center">
                        <span className="text-[9px] text-slate-400 font-bold block">Presets rápidos:</span>
                        <button
                          type="button"
                          onClick={() => setImagesList([...imagesList, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=400'])}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[9px] px-2 py-0.5 rounded-md font-bold transition cursor-pointer"
                        >
                          + Vestidos Atardecer
                        </button>
                        <button
                          type="button"
                          onClick={() => setImagesList([...imagesList, 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=400'])}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[9px] px-2 py-0.5 rounded-md font-bold transition cursor-pointer"
                        >
                          + Pasarela Vanguardista
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideosList([...videosList, 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-makeup-posing-under-neon-light-40478-large.mp4'])}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[9px] px-2 py-0.5 rounded-md font-bold transition cursor-pointer"
                        >
                          + Vídeo Neon
                        </button>
                      </div>

                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={!title || !descLong || !contactEmail || !contactPhone}
                      onClick={() => setActiveStep('finance')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all ${
                        title && descLong && contactEmail && contactPhone
                          ? 'bg-slate-900 text-white hover:bg-slate-800' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span>Siguiente: Finanzas e Impulso</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: FINANZAS E IMPACTO */}
              {activeStep === 'finance' && (
                <div className="space-y-5 animate-fade-in text-left">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">Paso 2 de 3</span>
                    <h3 className="text-lg font-bold text-slate-900">Aspectos Económicos e Impacto</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      El presupuesto se define en base a la mesa de inversión que deseas calificar.
                    </p>
                  </div>

                  <hr className="border-slate-150" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">Presupuesto Referencia de Mesa (EUR) *</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-xs text-indigo-650 font-bold font-mono">€</span>
                        <input
                          type="number"
                          required
                          value={budget}
                          onChange={(e) => setBudget(Number(e.target.value))}
                          className="bg-white border border-slate-205 rounded-xl w-full pl-8 pr-3.5 py-2.5 text-xs text-slate-800 font-bold font-mono focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                      <span className="text-[10px] text-slate-450 block mt-1 leading-normal">
                        Rango: <strong>10€</strong> (Streetwear & Urban), <strong>100€</strong> (Casual & Lifestyle) o <strong>1.000€</strong> (Empresarios).
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">Objetivo de Recaudación del Proyecto (EUR) *</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-xs text-emerald-650 font-bold font-mono">€</span>
                        <input
                          type="number"
                          required
                          value={fundingGoal}
                          onChange={(e) => setFundingGoal(Number(e.target.value))}
                          placeholder="Ej. 5000"
                          className="bg-white border border-slate-205 rounded-xl w-full pl-8 pr-3.5 py-2.5 text-xs text-slate-800 font-bold font-mono focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                      <span className="text-[10px] text-slate-450 block mt-1 leading-normal">
                        Monto total objetivo a recaudar para financiar el proyecto completo.
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Uso Detallado de Fondos (Distribución) *</label>
                    <input
                      type="text"
                      required
                      value={fundUsage}
                      onChange={(e) => setFundUsage(e.target.value)}
                      placeholder="Ej. 60% Confección telas, 30% Fotografía, 10% Accesorios"
                      className="bg-white border border-slate-205 rounded-xl w-full px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Objetivo del Financiamiento *</label>
                    <textarea
                      required
                      rows={3}
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      placeholder="Ej. Financiar la compra de hilos reciclados de alta resistencia y organizar un micro desfile filmado con dron para las redes de afiliados de nuestras modelos sponsors."
                      className="bg-white border border-slate-205 rounded-xl w-full px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600 font-sans resize-none"
                    />
                  </div>

                  {/* PRESUPUESTO DESGLOSADO */}
                  <div className="bg-slate-100/50 rounded-2xl p-4 border border-slate-200/60 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                        Presupuesto Desglosado (Partidas de Gasto)
                      </span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-mono font-bold">
                        Total Sumado: {budgetItems.reduce((acc, current) => acc + current.amount, 0)}€
                      </span>
                    </h4>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Desglosa el destino de cada euro de forma transparente para generar máxima confianza con los patrocinadores.
                    </p>

                    {/* Expenses Table */}
                    <div className="bg-white rounded-xl border border-slate-250 overflow-hidden divide-y divide-slate-100 shadow-sm max-h-48 overflow-y-auto">
                      {budgetItems.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 text-xs">
                          No tienes componentes de gasto. Añade al menos uno abajo.
                        </div>
                      ) : (
                        budgetItems.map(item => (
                          <div key={item.id} className="p-2.5 flex items-center justify-between gap-3 text-xs">
                            <span className="font-semibold text-slate-700 flex-1">{item.item}</span>
                            <span className="font-mono font-bold text-indigo-600 bg-indigo-50/50 px-2.5 py-0.5 rounded border border-indigo-100">{item.amount} €</span>
                            <button
                              type="button"
                              onClick={() => removeBudgetItem(item.id)}
                              className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1 rounded-lg transition"
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* New Gasto Input Row */}
                    <div className="flex gap-2 pt-1 items-center">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Fórmula de Gasto (Ej. Compra Algodón Orgánico, Licencia CLO3D)"
                          value={newBudgetItem}
                          onChange={(e) => setNewBudgetItem(e.target.value)}
                          className="bg-white border border-slate-205 rounded-xl w-full px-3 py-2 text-xs text-slate-800 focus:outline-none"
                        />
                      </div>
                      <div className="w-24 relative">
                        <span className="absolute left-2.5 top-2 text-xs text-slate-450 font-mono">€</span>
                        <input
                          type="number"
                          placeholder="Monto"
                          value={newBudgetAmount}
                          onChange={(e) => setNewBudgetAmount(e.target.value)}
                          className="bg-white border border-slate-205 rounded-xl w-full pl-6 pr-2 py-2 text-xs text-slate-800 focus:outline-none font-mono font-bold"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addBudgetItem}
                        className="bg-slate-900 hover:bg-indigo-600 text-white px-3 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer"
                      >
                        + Añadir
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Cronograma Breve de Lanzamiento</label>
                    <input
                      type="text"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      placeholder="Ej. Semana 1: Patronaje y corte. Semana 2: Ensamblado y sesión de fotos oficial."
                      className="bg-white border border-slate-205 rounded-xl w-full px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  {/* DOCUMENTACIÓN A SUBIR */}
                  <div className="bg-slate-100/50 rounded-2xl p-4 border border-slate-200/60 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <UploadCloud className="w-4 h-4 text-indigo-650" />
                      Documentación Oficial o Dossier Corporativo
                    </h4>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Sube un dossier del proyecto, balance de cuentas pasadas, copia lícita de CIF o plan de viabilidad de negocio para auditar la solvencia en rondas de nivel ejecutivo.
                    </p>

                    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-5 text-center space-y-3 relative overflow-hidden">
                      {isUploadingDoc ? (
                        <div className="space-y-2 py-2">
                          <span className="text-xs text-indigo-600 font-bold block animate-pulse">Sincronizando archivo de forma segura...</span>
                          <div className="w-all bg-slate-150 rounded-full h-2 overflow-hidden mx-auto max-w-xs">
                            <div className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block">{uploadProgress}% Completado</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="mx-auto w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
                            <FileText className="w-5 h-5" />
                          </div>

                          <div>
                            <span className="text-xs text-slate-600 font-bold block">
                              Arrastra tu PDF aquí o haz clic para buscar en tu dispositivo
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Soporta archivos .pdf, .docx, .zip hasta 15MB
                            </span>
                          </div>

                          {/* Quick mock file triggers */}
                          <div className="flex flex-wrap gap-1.5 items-center justify-center pt-2">
                            <button
                              type="button"
                              onClick={() => triggerSimulatedDocUpload('Plan_Comercial_ModaSostenible_V3.pdf')}
                              className="bg-indigo-50 hover:bg-slate-100 text-indigo-700 border border-indigo-150 text-[10px] px-2.5 py-1 rounded-lg font-bold transition cursor-pointer"
                            >
                              📄 Simulador: Plan de Negocio.pdf
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerSimulatedDocUpload('Dossier_Maquetas_Pasarela.pdf')}
                              className="bg-indigo-50 hover:bg-slate-100 text-indigo-700 border border-indigo-150 text-[10px] px-2.5 py-1 rounded-lg font-bold transition cursor-pointer"
                            >
                              📄 Simulador: Dossier Diseñador.pdf
                            </button>
                          </div>
                        </div>
                      )}

                      {uploadedDocName && !isUploadingDoc && (
                        <div className="mt-2 p-2.5 bg-emerald-500/5 text-emerald-800 border border-emerald-150 rounded-xl flex items-center justify-between text-xs font-medium">
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-emerald-100 text-emerald-700 rounded-lg">
                              ✓
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-slate-800 text-xs truncate max-w-[200px]">{uploadedDocName}</p>
                              <a href={uploadedDocUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-600 hover:underline">Ver archivo en la red</a>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedDocName('');
                              setUploadedDocUrl('');
                            }}
                            className="text-xs text-slate-400 hover:text-red-500 px-2 py-1 bg-white hover:bg-slate-50 border rounded-lg transition"
                          >
                            Quitar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveStep('basic')}
                      className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Volver al Paso 1</span>
                    </button>

                    <button
                      type="button"
                      disabled={!fundUsage || !objective}
                      onClick={() => setActiveStep('team')}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all ${
                        fundUsage && objective
                          ? 'bg-slate-900 text-white hover:bg-slate-800'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <span>Siguiente: Equipo Creativo</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: EQUIPO HUMANO */}
              {activeStep === 'team' && (
                <div className="space-y-5 animate-fade-in text-left">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">Paso 3 de 3</span>
                    <h3 className="text-lg font-bold text-slate-900">Equipo detrás del Backstage</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      La solvencia de una propuesta recae en su talento humano. Registra los roles clave del proyecto.
                    </p>
                  </div>

                  <hr className="border-slate-150" />

                  {/* Registered team list */}
                  <div className="space-y-2.5">
                    {teamMembers.map((m, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col gap-2 transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-900/5 text-slate-700 flex items-center justify-center font-bold text-xs">
                              {m.name.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-xs">{m.name}</p>
                              <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                <span>Rol: <strong>{m.role}</strong></span>
                                <span>•</span>
                                <span>Exp: {m.experience}</span>
                              </p>
                            </div>
                          </div>

                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => removeTeamMember(idx)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition shrink-0 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {(m.bio || m.profileLink) && (
                          <div className="bg-slate-50/50 rounded-lg p-2.5 text-[10px] text-slate-600 space-y-1 border border-slate-100">
                            {m.bio && <p className="leading-relaxed"><strong className="text-slate-700 font-medium">Bio/Perfil:</strong> {m.bio}</p>}
                            {m.profileLink && (
                              <p>
                                <strong className="text-slate-700 font-medium">Enlace / Portfolio:</strong>{' '}
                                <a href={m.profileLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline inline-block truncate max-w-full">
                                  {m.profileLink}
                                </a>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add team member card */}
                  <div className="p-4 bg-slate-100/60 rounded-xl border border-dashed border-slate-300 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">
                      + Registrar Miembro (con Perfil Profesional)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Nombre Completo *</label>
                        <input
                          type="text"
                          placeholder="Ej. Clara Gómez"
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          className="bg-white border border-slate-205 rounded-lg w-full px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Función / Rol *</label>
                        <input
                          type="text"
                          placeholder="Ej. Modista, Fotógrafo..."
                          value={newMemberRole}
                          onChange={(e) => setNewMemberRole(e.target.value)}
                          className="bg-white border border-slate-205 rounded-lg w-full px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Experiencia</label>
                        <input
                          type="text"
                          placeholder="Ej. 3 años en costura"
                          value={newMemberExp}
                          onChange={(e) => setNewMemberExp(e.target.value)}
                          className="bg-white border border-slate-205 rounded-lg w-full px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Enlace al Perfil / Portfolio</label>
                        <input
                          type="url"
                          placeholder="Ej. https://instagram.com/clara_diseno"
                          value={newMemberProfile}
                          onChange={(e) => setNewMemberProfile(e.target.value)}
                          className="bg-white border border-slate-205 rounded-lg w-full px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block">Biografía Corta del Perfil</label>
                        <input
                          type="text"
                          placeholder="Ej. Especializada en confección y tintes de origen natural..."
                          value={newMemberBio}
                          onChange={(e) => setNewMemberBio(e.target.value)}
                          className="bg-white border border-slate-205 rounded-lg w-full px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-indigo-650 transition cursor-pointer"
                    >
                      Añadir Miembro con su Perfil
                    </button>
                  </div>

                  {/* DECLARACIÓN JURADA Y VERACIDAD DE DATOS */}
                  <div className="p-5 bg-amber-500/5 border border-amber-200 rounded-2xl space-y-4 mt-6">
                    <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-1 rounded uppercase tracking-wider inline-flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Declaración Jurada de Veracidad</span>
                    </span>

                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="w-4 h-4 text-indigo-650 mt-1 focus:ring-0 cursor-pointer shrink-0 rounded border-slate-300"
                        />
                        <div className="text-[11px] text-slate-700 leading-relaxed font-sans">
                          Manifiesto bajo juramento que los roles del equipo creativo y el plan de viabilidad comercial del proyecto son **100% verídicos y reales**. Consiento que cualquier información falsa resultará en la exclusión inmediata de las mesas de inversión.
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* BOTTOM SUBMIT BAR */}
                  <div className="pt-4 border-t border-slate-150 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveStep('finance')}
                      className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 cursor-pointer transition-all w-full sm:w-auto text-center justify-center"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Volver al Paso 2</span>
                    </button>

                    <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleDownloadPDF}
                        style={{
                          backgroundColor: '#fce7f3',
                          backgroundImage: 'linear-gradient(135deg, #fff1f5 0%, #fce7f3 50%, #fbcfe8 100%)',
                          borderColor: '#f472b6',
                          color: '#831843'
                        }}
                        className="pearl-pink-btn custom-bg px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer active:scale-95 w-full sm:w-auto"
                        title="Descargar dossier del proyecto en formato PDF"
                      >
                        <Download className="w-4 h-4 text-pink-700" />
                        <span>Descargar Proyecto</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!termsAccepted}
                        style={
                          termsAccepted
                            ? {
                                backgroundColor: '#fce7f3',
                                backgroundImage: 'linear-gradient(135deg, #fff1f5 0%, #fce7f3 50%, #fbcfe8 100%)',
                                borderColor: '#f472b6',
                                color: '#831843'
                              }
                            : {
                                backgroundColor: '#fdf2f8',
                                borderColor: '#fce7f3',
                                color: '#9ca3af'
                              }
                        }
                        className={`custom-bg px-8 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm whitespace-nowrap active:scale-95 w-full sm:w-auto ${
                          termsAccepted 
                            ? 'pearl-pink-btn cursor-pointer' 
                            : 'pearl-pink-btn-disabled cursor-not-allowed'
                        }`}
                      >
                        <span>Registrar proyecto</span>
                        <ArrowRight className={`w-4 h-4 ${termsAccepted ? 'text-pink-700' : 'text-slate-400'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="text-center font-mono text-[9px] text-slate-400 flex items-center justify-center gap-2 py-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Conexión cifrada de alta seguridad SSL</span>
                  </div>

                </div>
              )}

            </form>

          </div>

        </div>
      )}

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
