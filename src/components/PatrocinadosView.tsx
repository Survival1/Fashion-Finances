import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  Calendar, 
  DollarSign, 
  Award, 
  Users, 
  AlertCircle, 
  Trash2, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Share2, 
  QrCode, 
  Check, 
  TrendingUp, 
  Wallet, 
  RefreshCw,
  Send,
  UserCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { ModelProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export interface Patrocinado {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: 'model' | 'investor';
  registeredAt: string; // "Fecha desde que es referido"
  earningsGenerated: number;
  status: 'active' | 'pending' | 'inactive';
  address?: string;
  phone?: string;
  email?: string;
  sponsorId?: string;
}

interface PatrocinadosViewProps {
  patrocinados: Patrocinado[];
  models?: ModelProfile[];
  patrocinadorId?: string;
  onAddPatrocinado: (newPat: Omit<Patrocinado, 'id'>) => void;
  onDeletePatrocinado: (id: string) => void;
  onSelectModel?: (model: ModelProfile) => void;
  onOpenRegisterForm?: () => void;
}

export default function PatrocinadosView({
  patrocinados,
  models = [],
  patrocinadorId,
  onAddPatrocinado,
  onDeletePatrocinado,
  onSelectModel,
  onOpenRegisterForm,
}: PatrocinadosViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [activeTab, setActiveTab] = useState<'all' | 'investor' | 'model' | 'pending'>('all');
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showInstagramKit, setShowInstagramKit] = useState(true);
  const [copiedInstagramMsg, setCopiedInstagramMsg] = useState(false);

  const getValidAvatar = (p: Patrocinado) => {
    if (!p?.avatar || p.avatar.includes('1524504388940-b1c1722553e1') || p.name?.toLowerCase().includes('valeria russo')) {
      return 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150';
    }
    return p.avatar;
  };

  const sponsorModel = models.find(m => m.id === patrocinadorId) || models.find(m => m.id === 'topf-1' || m.id === 'model-1') || models[0];

  // Simulated transaction states for top animations
  const [simulatedEarnings, setSimulatedEarnings] = useState(0);
  const [simulatedBonuses, setSimulatedBonuses] = useState<Record<string, number>>({});
  const [recentCommissions, setRecentCommissions] = useState<{ id: number; amount: number; name: string; avatar: string }[]>([]);
  const [notification, setNotification] = useState({ show: false, text: '' });

  // Form states
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'model' | 'investor'>('investor');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [status, setStatus] = useState<'active' | 'pending' | 'inactive'>('active');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSponsor, setSelectedSponsor] = useState('');
  const [sponsorSelectQuery, setSponsorSelectQuery] = useState('');

  // Sample high quality Unsplash avatars for profile creation
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=150',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;

    // Build the date string for "fecha desde que es referido"
    const today = new Date();
    const formattedDate = today.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    onAddPatrocinado({
      name: name.trim(),
      username: username.trim().toLowerCase().replace(/\s+/g, ''),
      avatar: avatarPresets[avatarIndex],
      role,
      registeredAt: formattedDate,
      earningsGenerated: status === 'active' ? 15.00 : 0.00, // starting balance if active
      status,
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      sponsorId: selectedSponsor
    });

    // Reset form
    setName('');
    setUsername('');
    setRole('investor');
    setAddress('');
    setPhone('');
    setEmail('');
    setSelectedSponsor('');
    setSponsorSelectQuery('');
    setStatus('active');
    setShowAddForm(false);
    
    setNotification({
      show: true,
      text: `🎉 ¡Nuevo referido registrado con éxito en estado ${status === 'active' ? 'Activo' : status === 'pending' ? 'Pendiente' : 'Inactivo'}!`
    });
    setTimeout(() => setNotification({ show: false, text: '' }), 4000);
  };

  const handleSimulateCommission = () => {
    // Pick an active or pending patrocinado to generate the earnings
    const activeList = patrocinados.filter(p => p.status === 'active');
    if (activeList.length === 0) {
      alert('⚠️ Necesitas al menos un patrocinado Activo para simular ganancias de pasarela.');
      return;
    }
    
    const randomPat = activeList[Math.floor(Math.random() * activeList.length)];
    const randomAmount = Math.round((Math.random() * 35 + 15) * 10) / 10; // e.g. 15.00 to 50.00
    
    // Add to simulated bonuses
    setSimulatedBonuses(prev => ({
      ...prev,
      [randomPat.id]: (prev[randomPat.id] || 0) + randomAmount
    }));
    
    // Increment total simulated earnings
    setSimulatedEarnings(prev => prev + randomAmount);
    
    // Add to floating particles
    const newId = Date.now();
    setRecentCommissions(prev => [...prev, {
      id: newId,
      amount: randomAmount,
      name: randomPat.name,
      avatar: randomPat.avatar
    }]);
    
    // Show a small success toast
    setNotification({
      show: true,
      text: `✨ ¡Comisión cobrada! @${randomPat.username} generó un premio de pasarela, acumulando +${randomAmount.toFixed(2)}€ (10% de comisión) en tu cuenta.`
    });

    // Speak "new commission" spoken voice alert and build-in synth audio chime
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5 play chime
        
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      }
    } catch (e) {
      console.warn("Chime error:", e);
    }

    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('new commission');
        utterance.lang = 'en-US';
        utterance.volume = 1.0;
        utterance.rate = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
    
    // Auto-dim notification after 4s
    setTimeout(() => {
      setNotification(prev => prev.text.includes(randomPat.username) ? { show: false, text: '' } : prev);
    }, 4500);
  };

  // Filter lists based on tab + query
  const filteredList = patrocinados.filter(item => {
    // Search Query Filter
    const query = searchQuery.trim().toLowerCase();
    const queryMatches = !query || 
      item.name.toLowerCase().includes(query) ||
      item.username.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query);
      
    if (!queryMatches) return false;
    
    // Tab Filter
    if (activeTab === 'investor') return item.role === 'investor';
    if (activeTab === 'model') return item.role === 'model';
    if (activeTab === 'pending') return item.status === 'pending';
    
    return true;
  });

  const totalEarnings = patrocinados.reduce((sum, curr) => {
    const bonus = simulatedBonuses[curr.id] || 0;
    return sum + curr.earningsGenerated + bonus;
  }, 0);

  const totalMembersCount = patrocinados.length;
  const activeMembersCount = patrocinados.filter(p => p.status === 'active').length;
  const pendingMembersCount = patrocinados.filter(p => p.status === 'pending').length;

  return (
    <div className="bg-white rounded-3xl border border-pink-100 shadow-sm p-6 sm:p-8 space-y-8 relative overflow-hidden" id="patrocinados-section" style={{ backgroundImage: 'linear-gradient(to bottom, #fffdfd 0%, #ffffff 100%)' }}>
      
      {/* Floating Sparkles Commissions Animation list overlay */}
      <AnimatePresence>
        {recentCommissions.map(comm => (
          <motion.div
            key={comm.id}
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], y: -80, scale: [0.8, 1.2, 1.2, 1] }}
            transition={{ duration: 2.2, ease: "easeOut" }}
            onAnimationComplete={() => {
              setRecentCommissions(prev => prev.filter(c => c.id !== comm.id));
            }}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white font-extrabold px-5 py-2.5 rounded-full shadow-lg border border-emerald-400 text-xs flex items-center gap-2 pointer-events-none"
          >
            <img src={comm.avatar} alt="" className="w-5 h-5 rounded-full object-cover shrink-0 border border-white/40" />
            <span>✨</span>
            <span>+{comm.amount.toFixed(2)}€ de {comm.name}</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating System Notification Alert Banner */}
      {notification.show && (
        <div className="p-4 rounded-2xl bg-slate-900 text-left text-white border border-pink-300 flex items-start justify-between gap-3 animate-bounce shadow-lg relative z-30" id="toast-commission-success">
          <div className="flex items-start gap-2.5">
            <span className="text-lg bg-pink-950 p-1 rounded-lg border border-pink-900 shrink-0">💎</span>
            <div>
              <strong className="text-rose-450 font-extrabold text-xs block text-pink-400 uppercase tracking-wider">MÓDULO DE PATROCINIOS</strong>
              <p className="text-[11px] text-slate-200 mt-0.5 font-semibold leading-relaxed">
                {notification.text}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setNotification({ show: false, text: '' })}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer border-0 bg-transparent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header section with Stats & Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-pink-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 justify-center sm:justify-start">
            <span className="p-1.5 bg-pink-100 rounded-xl text-rose-600 shadow-2xs">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-serif font-black text-rose-950 tracking-tight uppercase">Mis Patrocinados</h2>
          </div>
          <p className="text-xs text-rose-800/70 leading-relaxed font-semibold">
            Gestiona la red de inversores y modelos afiliados bajo tu patrocinio oficial. Consigues un 10% de comisión sobre sus premios de pasarela de alta costura.
          </p>
        </div>
      </div>

      {/* UPPER BLOCK & SHARING OPTION SPLIT LAYOUT IN HIGH CONTRAST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMN 1: "Mi Sponsor de Afiliación" Card (z.png layout) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#fffbfb] to-[#fff5f7] border border-pink-250 rounded-3xl p-5 text-left shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1.5 font-mono mb-3">
              <span className="p-1 bg-pink-100 rounded-lg text-rose-500">
                <Users className="w-3.5 h-3.5" />
              </span>
              <span>SPONSOR AFILIACIÓN</span>
            </h3>

            {sponsorModel ? (
              <div className="space-y-4">
                <div 
                  onClick={() => onSelectModel?.(sponsorModel)}
                  className="flex items-center gap-3 p-1 rounded-xl transition hover:bg-rose-50/50 cursor-pointer group"
                >
                  <img
                    src={sponsorModel.avatar}
                    alt={sponsorModel.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border border-pink-150 shadow-3xs transition-transform group-hover:scale-105"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors leading-tight truncate">
                      {sponsorModel.name}
                    </h4>
                    <p className="text-xs text-rose-500 font-mono font-semibold truncate">
                      @{sponsorModel.username}
                    </p>
                  </div>
                </div>
                
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed font-sans">
                  {sponsorModel.bio || "Top 1 Modelo Femenina Global. Creadora oficial registrada, enfocada en conectar inversores con proyectos potentes."}
                </p>

                {/* THE RECUADRO WITH A THIN BLACK BORDER - COMPACT WITH LIKES NEXT TO COLON */}
                <div className="border border-slate-900 rounded-xl px-3 py-1.5 inline-flex items-center gap-2 text-xs bg-white shadow-2xs max-w-max">
                  <span className="text-pink-500 font-bold font-sans">Total Likes:</span>
                  <span className="text-pink-600 font-black flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                    <span>{sponsorModel.totalLikes || 14995}</span>
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-rose-500 font-semibold text-center py-4">No tienes patrocinador asociado.</p>
            )}
          </div>
        </div>

        {/* COLUMN 2: "Tu red de patrocinados" Dashboard Stats */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest font-sans flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Tu red de patrocinados</span>
            </h3>
          </div>



          <div className="space-y-2.5">
            {/* CORE STAT 1: COMISIONES ACUMULADAS */}
            <div className="bg-[#fafbfb] hover:bg-[#f7f8f9] border border-slate-100 rounded-2xl p-3 flex justify-between items-center transition-all duration-200 text-left">
              <div>
                <span className="text-[10px] text-pink-600 font-bold uppercase tracking-wider block font-sans">
                  💰 Comisiones
                </span>
                <span className="text-[9px] text-slate-400 font-sans block">Acumuladas</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[13px] font-sans font-bold text-slate-700 tracking-tight">
                  {totalEarnings.toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-rose-500">€</span>
              </div>
            </div>

            {/* CORE STAT 2: INGRESOS ESTE MES */}
            <div className="bg-[#fafbfb] hover:bg-[#f7f8f9] border border-slate-100 rounded-2xl p-3 flex justify-between items-center transition-all duration-200 text-left">
              <div>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block font-sans">
                  📈 Ingresos
                </span>
                <span className="text-[9px] text-slate-400 font-sans block">Este mes</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[13px] font-sans font-bold text-slate-700 tracking-tight">
                  +{(125.50 + simulatedEarnings).toFixed(2)}
                </span>
                <span className="text-[10px] font-bold text-emerald-600">€</span>
              </div>
            </div>

            {/* CORE STAT 3: PERSONAS EN TU RED */}
            <div className="bg-[#fafbfb] hover:bg-[#f7f8f9] border border-slate-100 rounded-2xl p-3 flex justify-between items-center transition-all duration-200 text-left">
              <div>
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block font-sans">
                  👥 Personas
                </span>
                <span className="text-[9px] text-slate-400 font-sans block">En tu red</span>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[13px] font-sans font-bold text-slate-700 tracking-tight">
                  {totalMembersCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: "+ Invitar nuevo inversor" Sharing Panel */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#fff7f8] via-white to-[#fff0f2] border border-pink-200 rounded-3xl p-5 relative overflow-hidden text-left shadow-md flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="space-y-0.5">
              <span className="text-[9px] font-sans font-black tracking-widest text-rose-500 uppercase block">🎁 PROGRAMA DE REGISTRO PREFERENTE</span>
              <h3 className="text-base font-serif font-black text-rose-950 flex items-center gap-1.5 uppercase tracking-wide">
                <span>+ Invitar nuevo inversor</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                "Comparte tu enlace y gana el 10% de sus premios"
              </p>
            </div>

            {/* Link field container */}
            <div className="bg-white border border-pink-150 p-2 rounded-xl flex items-center justify-between gap-1.5 shadow-inner">
              <input
                type="text"
                readOnly
                value="https://collectives.model/ref?sponsor=user"
                className="bg-transparent text-[10px] font-mono font-bold text-rose-900 select-all flex-1 px-1 py-0.5 min-w-0"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("https://collectives.model/ref?sponsor=user");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2500);
                }}
                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[9px] uppercase tracking-wide rounded-lg transition shrink-0 cursor-pointer flex items-center gap-1 border-0"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            {/* Quick action grid (WhatsApp, Telegram, Instagram) */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent('Sigue mi enlace de Haute Couture en Fashion Finances y gana el 10% de premios: https://collectives.model/ref?sponsor=user'))}
                className="py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white border border-transparent rounded-xl text-[9px] font-extrabold uppercase tracking-wide transition flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span className="text-[10px]">💬</span>
                <span>WhatsApp</span>
              </button>
              
              <button
                type="button"
                onClick={() => window.open('https://t.me/share/url?url=' + encodeURIComponent('https://collectives.model/ref?sponsor=user') + '&text=' + encodeURIComponent('Únete a mi red de patrocinados de Haute Couture en Fashion Finances.'))}
                className="py-2 bg-[#0088cc] hover:bg-[#0077b5] text-white border border-transparent rounded-xl text-[9px] font-extrabold uppercase tracking-wide transition flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <span className="text-[10px]">✈️</span>
                <span>Telegram</span>
              </button>

              <button
                type="button"
                onClick={() => setShowInstagramKit(!showInstagramKit)}
                style={{ backgroundColor: showInstagramKit ? '#b91c1c' : '#e50914', color: '#ffffff' }}
                className={`py-2 text-white border border-transparent rounded-xl text-[9px] font-extrabold uppercase tracking-wide transition flex items-center justify-center gap-1 cursor-pointer shadow-xs active:scale-[0.98] ${
                  showInstagramKit
                    ? '!bg-[#b91c1c] ring-2 ring-red-300'
                    : '!bg-[#e50914] hover:!bg-[#cc0812]'
                }`}
              >
                <span className="text-[10px]">📸</span>
                <span>Instagram</span>
              </button>
            </div>

            {/* Instagram Share Invite Card / Message Kit */}
            {showInstagramKit && (
              <div className="bg-white border border-pink-100 rounded-2xl p-3 space-y-2.5 shadow-2xs animate-fade-in text-left">
                <div className="flex items-center gap-1 text-[9.5px] font-black text-purple-600 uppercase tracking-widest">
                  <span>📸 COMPARTIR EN INSTAGRAM</span>
                </div>

                {/* Elegant fashion and finance visual cover */}
                <div className="relative rounded-xl overflow-hidden h-24 border border-slate-100 shadow-3xs">
                  <img 
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600" 
                    alt="Fashion Finances" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-2">
                    <span className="text-[10px] font-bold text-pink-300 uppercase tracking-wide">Fashion Finances</span>
                    <span className="text-[8px] text-slate-200">Alta Costura & Finanzas Inteligentes</span>
                  </div>
                </div>

                {/* Brief description of the platform */}
                <p className="text-[9.5px] text-slate-500 leading-normal bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <strong>Fashion Finances</strong> es la plataforma exclusiva que unifica la elegancia de la Alta Costura con estrategias avanzadas de patrocinio, permitiendo monetizar portafolios y expandir redes de contactos.
                </p>

                {/* Invitation text area & copy block */}
                <div className="space-y-1">
                  <span className="text-[8px] text-slate-400 font-mono font-bold uppercase block">Mensaje de Invitación:</span>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 relative">
                    <p className="text-[9px] text-slate-600 font-medium select-all leading-relaxed max-h-16 overflow-y-auto pr-1">
                      ✨ ¡Te invito a unirte a Fashion Finances! La primera plataforma que une la elegancia de la Alta Costura con inversiones inteligentes de patrocinio. 💎 Regístrate gratis con mi enlace preferente, descubre el portafolio de modelos top y gana comisiones reales: https://collectives.model/ref?sponsor=user #FashionFinances #ModayFinanzas #HauteCouture
                    </p>
                    
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("✨ ¡Te invito a unirte a Fashion Finances! La primera plataforma que une la elegancia de la Alta Costura con inversiones inteligentes de patrocinio. 💎 Regístrate gratis con mi enlace preferente, descubre el portafolio de modelos top y gana comisiones reales: https://collectives.model/ref?sponsor=user #FashionFinances #ModayFinanzas #HauteCouture");
                        setCopiedInstagramMsg(true);
                        setTimeout(() => setCopiedInstagramMsg(false), 2500);
                      }}
                      className="w-full mt-1.5 py-1 px-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:brightness-105 text-white font-extrabold text-[8.5px] uppercase tracking-wide rounded-lg transition flex items-center justify-center gap-1 cursor-pointer border-0 shadow-3xs"
                    >
                      {copiedInstagramMsg ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedInstagramMsg ? '¡Copiado!' : 'Copiar Invitación para Instagram'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="w-full py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:brightness-105 text-white font-extrabold text-[10.5px] uppercase tracking-wider rounded-xl transition shadow-3xs flex items-center justify-center gap-2 cursor-pointer border-0"
            >
              <span className="w-5 h-5 rounded-full bg-white text-rose-500 flex items-center justify-center shrink-0 shadow-3xs">
                <QrCode className="w-3 h-3" />
              </span>
              <span>MOSTRAR CÓDIGO QR</span>
            </button>
          </div>

          <div className="pt-2 border-t border-pink-100/50 mt-3.5 flex justify-center text-center">
            <button
              type="button"
              onClick={() => onOpenRegisterForm && onOpenRegisterForm()}
              className="text-[9.5px] font-black uppercase text-rose-600 hover:text-rose-700 underline tracking-wide bg-transparent border-0 cursor-pointer"
            >
              ✍️ Registrar referido manual (+)
            </button>
          </div>
        </div>

      </div>

      {/* Form: Add New Patrocinado (Simulates manually registering referrals) */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900/90 text-slate-100 rounded-3xl border border-slate-700/70 p-6 sm:p-8 space-y-4 animate-fade-in text-left max-w-xl mx-auto shadow-md" id="form-add-patrocinado">
          <div className="border-b border-slate-700/60 pb-3">
            <h3 className="text-sm font-bold text-pink-400 font-sans uppercase tracking-widest">Registrar Nuevo Afiliado Manual</h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Simula el registro de inversores o modelos bajo tu enlace y asígnales un estado inicial.</p>
          </div>
          
          {/* Nombre Completo */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Carmen Alvarez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 rounded-xl w-full px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
            />
          </div>

          {/* Nombre de Usuario (Username) */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Nombre de Usuario (Username) *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. carmenval"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 rounded-xl w-full px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
            />
          </div>

          {/* Dirección */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Dirección (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Calle Gran Vía 45, Madrid"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 rounded-xl w-full px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Teléfono (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. +34 612 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 rounded-xl w-full px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
            />
          </div>

          {/* Correo Electrónico (Email) */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Correo Electrónico (Email) (Opcional)
            </label>
            <input
              type="email"
              placeholder="Ej. carmen@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800/80 border border-slate-700 rounded-xl w-full px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
            />
          </div>

          {/* Elige Rol Principal */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Elige Rol Principal *
            </label>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setRole('investor')}
                className={`flex-1 py-2.5 text-xs rounded-xl font-bold border transition duration-200 flex items-center justify-center cursor-pointer ${
                  role === 'investor'
                    ? 'bg-pink-600/20 border-pink-500 text-pink-450 ring-1 ring-pink-500'
                    : 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Inversor
              </button>
              <button
                type="button"
                onClick={() => setRole('model')}
                className={`flex-1 py-2.5 text-xs rounded-xl font-bold border transition duration-200 flex items-center justify-center cursor-pointer ${
                  role === 'model'
                    ? 'bg-pink-600/20 border-pink-500 text-pink-450 ring-1 ring-pink-500'
                    : 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Modelo (Social e influencers)
              </button>
            </div>
          </div>

          {/* Estado inicial */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Estado del Referido *
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus('active')}
                className={`flex-1 py-2 text-xs rounded-xl font-bold border transition duration-200 flex items-center justify-center gap-1 cursor-pointer ${
                  status === 'active'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🟢 Activo</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('pending')}
                className={`flex-1 py-2 text-xs rounded-xl font-bold border transition duration-200 flex items-center justify-center gap-1 cursor-pointer ${
                  status === 'pending'
                    ? 'bg-amber-950 border-amber-500 text-amber-400'
                    : 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>🟡 Pendiente</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('inactive')}
                className={`flex-1 py-2 text-xs rounded-xl font-bold border transition duration-200 flex items-center justify-center gap-1 cursor-pointer ${
                  status === 'inactive'
                    ? 'bg-slate-800 border-slate-600 text-slate-300'
                    : 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>⚪ Inactivo</span>
              </button>
            </div>
          </div>

          {/* Elige tu Sponsor de Afiliación (Modelo Top 50) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Elige tu Sponsor de Afiliación (Modelo Top 50)
            </label>
            
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Escribe para filtrar patrocinador..."
                value={sponsorSelectQuery}
                onChange={(e) => setSponsorSelectQuery(e.target.value)}
                className="bg-slate-800/80 border border-slate-700 rounded-xl w-full px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 transition-all font-sans"
              />
              {sponsorSelectQuery && (
                <button
                  type="button"
                  onClick={() => setSponsorSelectQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer px-1 bg-transparent border-0"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={selectedSponsor}
              onChange={(e) => {
                setSelectedSponsor(e.target.value);
              }}
              className="bg-slate-800/80 border border-slate-700 rounded-xl w-full px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500 transition-colors font-medium cursor-pointer"
            >
              <option value="" className="text-slate-400 font-sans bg-slate-900">-- Elige un Patrocinador --</option>
              {models.length > 0 ? (
                models
                  .filter((m) => {
                    const query = sponsorSelectQuery.trim().toLowerCase();
                    if (!query) return true;
                    return (
                      m.name.toLowerCase().includes(query) ||
                      m.id.toLowerCase().includes(query) ||
                      (m.username && m.username.toLowerCase().includes(query))
                    );
                  })
                  .map((m) => (
                    <option key={m.id} value={m.username} className="bg-slate-900 text-white font-sans text-xs">
                      {m.name} (@{m.username})
                    </option>
                  ))
              ) : (
                <>
                  <option value="adria_v" className="bg-slate-900 text-white font-sans">Adria V. (@adria_v)</option>
                  <option value="bianca_th" className="bg-slate-900 text-white font-sans">Bianca Thorne (@bianca_th)</option>
                  <option value="carlos_g" className="bg-slate-900 text-white font-sans">Carlos Gomez (@carlos_g)</option>
                  <option value="daniela_r" className="bg-slate-900 text-white font-sans">Daniela R. (@daniela_r)</option>
                </>
              )}
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2 text-xs font-bold text-slate-300 bg-transparent hover:bg-slate-800 rounded-xl transition cursor-pointer min-h-[38px] flex items-center justify-center border border-slate-700/50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold text-white bg-[#e11d48] hover:bg-rose-600 rounded-xl transition shadow-sm cursor-pointer min-h-[38px] flex items-center justify-center active:scale-95 border-0"
            >
              Registrar Referido
            </button>
          </div>

        </form>
      )}

      {/* FILTER TABS & SEARCH INPUT (Todos, Inversores, Modelos, Pendientes) */}
      <div className="space-y-4 pt-4 border-t border-pink-50">
        
        {/* Tab Pills Selection Header */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start items-center">
          <button
            type="button"
            onClick={() => { setActiveTab('all'); setVisibleCount(5); }}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-tight uppercase cursor-pointer transition-all ${
              activeTab === 'all'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-rose-700'
            }`}
          >
            Todos ({patrocinados.length})
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('investor'); setVisibleCount(5); }}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-tight uppercase cursor-pointer transition-all ${
              activeTab === 'investor'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-rose-700'
            }`}
          >
            Inversores ({patrocinados.filter(p => p.role === 'investor').length})
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('model'); setVisibleCount(5); }}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-tight uppercase cursor-pointer transition-all ${
              activeTab === 'model'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-rose-700'
            }`}
          >
            Modelos ({patrocinados.filter(p => p.role === 'model').length})
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('pending'); setVisibleCount(5); }}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-tight uppercase cursor-pointer transition-all ${
              activeTab === 'pending'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-pink-50 text-slate-600 hover:text-rose-700'
            }`}
          >
            Pendientes ({patrocinados.filter(p => p.status === 'pending').length})
          </button>
        </div>

        {/* Search Input Filter & Collapse Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-50/80 p-3.5 rounded-2xl border border-pink-50/60 shadow-3xs text-left">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl w-full pl-9 pr-4 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-50"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-[11px] font-semibold font-mono text-slate-500">
              Viendo {Math.min(filteredList.length, visibleCount)} de {patrocinados.length} ({activeTab === 'all' ? 'Todos' : activeTab === 'investor' ? 'Inversores' : activeTab === 'model' ? 'Modelos' : 'Pendientes'})
            </span>
          </div>
        </div>

      </div>

      {/* Main List Display of Sponsored/Referred */}
      {filteredList.length === 0 ? (
        <div className="border border-dashed border-pink-200 rounded-2xl p-8 text-center bg-pink-50/20">
          <AlertCircle className="w-8 h-8 text-rose-300 mx-auto mb-2" />
          <p className="text-rose-900 text-xs font-bold uppercase tracking-wide">No se encontraron patrocinados</p>
          <p className="text-slate-400 text-[10px] mt-0.5">Prueba a pulsar otro tab, escribir un término diferente o invitar a un nuevo inversor.</p>
        </div>
      ) : (
        <div id="patrocinados-table-top" className="overflow-hidden border border-pink-100/50 rounded-2xl bg-white shadow-3xs">
          <div className="grid grid-cols-1 divide-y divide-slate-100">
            {filteredList.slice(0, visibleCount).map((p) => {
              const personalBonus = simulatedBonuses[p.id] || 0;
              const displayEarnings = p.earningsGenerated + personalBonus;
              const currentAvatar = getValidAvatar(p);

              return (
                <div
                  key={p.id}
                  onClick={() => {
                    let matchedModel = models.find(
                      m => m.username?.toLowerCase() === p.username?.toLowerCase() ||
                           m.name?.toLowerCase() === p.name?.toLowerCase() ||
                           m.id === p.id
                    );
                    if (!matchedModel) {
                      matchedModel = {
                        id: p.id || `fallback-profile-${p.username}`,
                        name: p.name,
                        username: p.username,
                        avatar: currentAvatar,
                        bio: `Perfil de ${p.role === 'model' ? 'Modelo Profesional' : 'Inversor Asociado'}: ${p.name}. Colaborador destacado en la ronda de Fashion Finances Inc.`,
                        totalLikes: Math.round((parseFloat(p.id.replace(/\D/g, '') || '5') * 15) % 150) + 40,
                        followersCount: Math.round((parseFloat(p.id.replace(/\D/g, '') || '8') * 132) % 1800) + 400,
                        photos: [
                          currentAvatar,
                          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
                          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600"
                        ],
                        referidosCount: Math.round((parseFloat(p.id.replace(/\D/g, '') || '2') * 3) % 6),
                        socials: {
                          instagram: p.username,
                          tiktok: p.username
                        },
                        isOnline: true,
                        isCastingLive: false
                      };
                    }
                    if (onSelectModel) {
                      onSelectModel(matchedModel);
                    }
                  }}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-rose-50/45 cursor-pointer border-b border-pink-50 last:border-0 transition-colors text-left group"
                  title={`Ver perfil de ${p.name}`}
                >
                  {/* Profile info & name */}
                  {(() => {
                    let matchedModel = models.find(
                      m => m.username?.toLowerCase() === p.username?.toLowerCase() ||
                           m.name?.toLowerCase() === p.name?.toLowerCase() ||
                           m.id === p.id
                    );

                    // If it's a model but not found in preloaded models database, build a fallback profile automatically
                    if (!matchedModel && p.role === 'model') {
                      matchedModel = {
                        id: p.id || `fallback-model-${p.username}`,
                        name: p.name,
                        username: p.username,
                        avatar: currentAvatar,
                        bio: `Perfil de Modelo Profesional Referido: ${p.name}. Colaboradora destacada en la ronda de Fashion Finances Inc.`,
                        totalLikes: Math.round((parseFloat(p.id.replace(/\D/g, '') || '5') * 15) % 150) + 40,
                        followersCount: Math.round((parseFloat(p.id.replace(/\D/g, '') || '8') * 132) % 1800) + 400,
                        photos: [
                          currentAvatar,
                          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
                          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600"
                        ],
                        referidosCount: Math.round((parseFloat(p.id.replace(/\D/g, '') || '2') * 3) % 6),
                        socials: {
                          instagram: p.username,
                          tiktok: p.username
                        },
                        isOnline: true,
                        isCastingLive: false
                      };
                    }

                    return (
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img
                            src={currentAvatar}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150';
                            }}
                            onClick={() => {
                              if (matchedModel && onSelectModel) {
                                onSelectModel(matchedModel);
                              }
                            }}
                            referrerPolicy="no-referrer"
                            className={`w-12 h-12 rounded-xl object-cover border border-slate-200/80 shadow-3xs transition-transform ${
                              matchedModel ? 'cursor-pointer hover:scale-105 hover:border-pink-400 hover:ring-2 hover:ring-pink-100' : ''
                            }`}
                            title={matchedModel ? `Ver perfil privado de ${p.name}` : undefined}
                          />
                          {/* STATUS DOT: 🟢 Activo, 🟡 Pendiente, ⚪ Inactivo */}
                          <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            p.status === 'active' 
                              ? 'bg-emerald-500 animate-pulse' 
                              : p.status === 'pending'
                                ? 'bg-amber-500 shadow-xs'
                                : 'bg-slate-300'
                          }`} title={`Estado: ${p.status === 'active' ? 'Activo' : p.status === 'pending' ? 'Pendiente' : 'Inactivo'}`} />
                        </div>

                        <div className="flex flex-col text-left">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4
                              onClick={() => {
                                if (matchedModel && onSelectModel) {
                                  onSelectModel(matchedModel);
                                }
                              }}
                              className={`font-bold text-slate-750 text-xs sm:text-sm capitalize transition-colors ${
                                matchedModel ? 'cursor-pointer text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1' : 'text-slate-700 group-hover:text-rose-700'
                              }`}
                              title={matchedModel ? `Ver perfil privado de ${p.name}` : undefined}
                            >
                              <span>{p.name}</span>
                              {matchedModel && <span className="text-[9px] text-rose-500 font-normal no-underline">(Ver Perfil ↗)</span>}
                            </h4>
                            
                            {/* Role Badge */}
                            <span 
                              onClick={() => {
                                if (matchedModel && onSelectModel) {
                                  onSelectModel(matchedModel);
                                }
                              }}
                              className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold tracking-wider uppercase inline-flex items-center gap-0.5 ${
                                p.role === 'model'
                                  ? 'bg-rose-50 text-rose-600 border border-rose-150 cursor-pointer hover:bg-rose-100 transition'
                                  : 'bg-indigo-50 text-indigo-600 border border-indigo-150'
                              }`}
                            >
                              {p.role === 'model' ? <Heart className="w-2.5 h-2.5 fill-current" /> : <ShieldCheck className="w-2.5 h-2.5" />}
                              <span>{p.role === 'model' ? 'Modelo' : 'Inversor'}</span>
                            </span>

                            {/* New Status Badge built with 🟢, 🟡, ⚪ as requested */}
                            <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold inline-flex items-center gap-1 border ${
                              p.status === 'active' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                : p.status === 'pending'
                                  ? 'bg-amber-50 text-amber-700 border-amber-100'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                              <span>{p.status === 'active' ? '🟢 Activo' : p.status === 'pending' ? '🟡 Pendiente' : '⚪ Inactivo'}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-450 font-mono">@{p.username}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Referred info & dates */}
                  <div className="flex flex-col sm:items-end text-left sm:text-right gap-0.5 font-sans">
                    {/* Calendar view showcasing refer date cleanly */}
                    <div className="flex items-center gap-1 text-slate-500 text-[11px] font-medium" title="Fecha desde que fue referido">
                      <Calendar className="w-3.5 h-3.5 text-rose-400" />
                      <span>Referido desde: <strong className="text-slate-600 font-sans font-semibold">{p.registeredAt}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                      {/* Generative Prizes with dynamic highlight block of high contrast */}
                      <div className="flex items-center text-xs text-slate-600 bg-pink-50/50 px-2 py-0.5 rounded-lg border border-pink-100/40" title="Premio acumulado por afiliación">
                        <DollarSign className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>Premio generado: <strong className="text-rose-600 font-mono text-[12px] font-bold">{displayEarnings.toFixed(2)}€</strong></span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}

            {/* Bottom action controls: Expand more or Collapse users */}
            {filteredList.length > visibleCount ? (
              <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 transition-colors">
                <button
                  type="button"
                  onClick={() => setVisibleCount(prev => prev + 5)}
                  className="px-5 py-2 bg-white border border-pink-200 hover:bg-pink-50/40 text-xs font-bold text-rose-600 hover:text-rose-700 transition rounded-xl flex items-center justify-center gap-1.5 cursor-pointer select-none shadow-3xs"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Desplegar más usuarios</span>
                  <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full font-mono">
                    +{filteredList.length - visibleCount}
                  </span>
                </button>
                {visibleCount > 5 && (
                  <button
                    type="button"
                    onClick={() => {
                      setVisibleCount(5);
                      const el = document.getElementById('patrocinados-table-top');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }}
                    className="px-4 py-2 bg-white border border-slate-200/90 hover:bg-slate-50 text-xs font-bold text-slate-600 hover:text-slate-800 transition rounded-xl flex items-center justify-center gap-1.5 cursor-pointer select-none shadow-3xs"
                  >
                    <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                    <span>Contraer usuarios</span>
                  </button>
                )}
              </div>
            ) : filteredList.length > 5 && (
              <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 transition-colors">
                <button
                  type="button"
                  onClick={() => {
                    setVisibleCount(5);
                    const el = document.getElementById('patrocinados-table-top');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }}
                  className="px-4 py-2 bg-white border border-slate-200/90 hover:bg-slate-50 text-xs font-bold text-slate-600 hover:text-slate-800 transition rounded-xl flex items-center justify-center gap-1.5 cursor-pointer select-none shadow-3xs"
                >
                  <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                  <span>Contraer usuarios</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Code Overlay Modal */}
      {showQrModal && <QrCodeModal />}

    </div>
  );

  function QrCodeModal() {
    return (
      <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="qr_code-modal-overlay">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-pink-200 shadow-2xl relative text-center space-y-6">
          <button 
            type="button" 
            onClick={() => setShowQrModal(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-pink-50 text-slate-400 hover:text-slate-600 cursor-pointer transition border-0 bg-transparent"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="space-y-1 text-center">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block font-mono">👑 COUTURES OFICIAL CLUB</span>
            <h3 className="text-lg font-serif font-black text-rose-950 uppercase">Tu Invitación Runway QR</h3>
            <p className="text-xs text-slate-500 font-medium">Escanea este código de alta definición para referir directamente a tus patrocinados.</p>
          </div>
          
          {/* Visual QR Code Card */}
          <div className="bg-gradient-to-b from-rose-50/60 to-white p-5 rounded-2xl border border-pink-100 flex flex-col items-center justify-center relative shadow-inner">
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-mono font-black text-emerald-600 block uppercase">Link Activo</span>
            </div>
            
            {/* Crisp vector SVG QR Code */}
            <div className="w-44 h-44 bg-white p-2.5 rounded-xl shadow-xs border border-pink-100/70 flex items-center justify-center relative">
              <svg className="w-full h-full text-rose-950" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer border markers */}
                <rect x="5" y="5" width="25" height="25" rx="3" fill="currentColor" />
                <rect x="9" y="9" width="17" height="17" rx="1" fill="white" />
                <rect x="13" y="13" width="9" height="9" fill="currentColor" />
                
                <rect x="70" y="5" width="25" height="25" rx="3" fill="currentColor" />
                <rect x="74" y="9" width="17" height="17" rx="1" fill="white" />
                <rect x="78" y="13" width="9" height="9" fill="currentColor" />
                
                <rect x="5" y="70" width="25" height="25" rx="3" fill="currentColor" />
                <rect x="9" y="74" width="17" height="17" rx="1" fill="white" />
                <rect x="13" y="78" width="9" height="9" fill="currentColor" />
                
                {/* Custom vector block configurations mimicking a professional code */}
                <rect x="35" y="5" width="6" height="6" fill="currentColor" />
                <rect x="45" y="5" width="12" height="6" fill="currentColor" />
                <rect x="62" y="5" width="5" height="6" fill="currentColor" />
                
                <rect x="35" y="15" width="12" height="6" fill="currentColor" />
                <rect x="50" y="15" width="6" height="6" fill="currentColor" />
                <rect x="60" y="15" width="7" height="8" fill="currentColor" />
                
                <rect x="35" y="25" width="6" height="12" fill="currentColor" />
                <rect x="45" y="25" width="12" height="6" fill="currentColor" />
                <rect x="60" y="25" width="6" height="6" fill="currentColor" />
                <rect x="70" y="33" width="12" height="6" fill="currentColor" />
                
                <rect x="5" y="35" width="12" height="6" fill="currentColor" />
                <rect x="22" y="35" width="6" height="12" fill="currentColor" />
                <rect x="32" y="40" width="18" height="6" fill="currentColor" />
                <rect x="54" y="35" width="12" height="6" fill="currentColor" />
                <rect x="70" y="42" width="6" height="18" fill="currentColor" />
                <rect x="80" y="42" width="14" height="6" fill="currentColor" />
                
                <rect x="5" y="50" width="18" height="6" fill="currentColor" />
                <rect x="28" y="50" width="6" height="12" fill="currentColor" />
                <rect x="38" y="50" width="14" height="6" fill="currentColor" />
                <rect x="55" y="45" width="10" height="10" fill="currentColor" />
                <rect x="80" y="52" width="6" height="12" fill="currentColor" />
                
                <rect x="35" y="65" width="12" height="6" fill="currentColor" />
                <rect x="50" y="60" width="6" height="12" fill="currentColor" />
                <rect x="60" y="65" width="12" height="6" fill="currentColor" />
                <rect x="75" y="68" width="18" height="6" fill="currentColor" />
                
                <rect x="35" y="75" width="6" height="18" fill="currentColor" />
                <rect x="45" y="75" width="18" height="6" fill="currentColor" />
                <rect x="68" y="78" width="12" height="12" fill="currentColor" />
                <rect x="84" y="78" width="10" height="6" fill="currentColor" />
                
                <rect x="45" y="85" width="12" height="8" fill="currentColor" />
                <rect x="62" y="92" width="18" height="4" fill="currentColor" />
                <rect x="84" y="88" width="10" height="8" fill="currentColor" />
                
                {/* Soft pink heart center */}
                <rect x="45" y="45" width="10" height="10" rx="2" fill="white" />
                <path d="M47.5 49 C46.5 48, 45 49, 45 50.5 C45 52, 47 54, 50 55 C53 54, 55 52, 55 50.5 C55 49, 53.5 48, 52.5 49 C51.5 50, 48.5 50, 47.5 49 Z" fill="#e11d48" />
              </svg>
            </div>
            
            <span className="text-[9.5px] text-pink-700 font-mono font-black mt-3 block">SPONSOR REF: USER-AFILIADO</span>
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText("https://collectives.model/ref?sponsor=user");
                alert("📋 ¡Enlace copiado!");
              }}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wide rounded-xl transition shadow-3xs cursor-pointer border-0"
            >
              Copiar Link
            </button>
            <button
              type="button"
              onClick={() => {
                alert("📥 Descargando credenciales QR en alta resolución...");
              }}
              className="px-4 py-2.5 bg-slate-905 bg-slate-900 text-white font-bold text-xs rounded-xl transition cursor-pointer border-0"
            >
              Descargar
            </button>
          </div>
        </div>
      </div>
    );
  }
}
