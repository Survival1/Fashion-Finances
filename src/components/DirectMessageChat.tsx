import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ModelProfile } from '../types';
import { 
  Send, 
  Image, 
  MessageCircle, 
  ShieldAlert, 
  Sparkles, 
  AlertCircle, 
  Search, 
  Plus, 
  Users, 
  CheckCheck, 
  Check,
  UserCheck, 
  TrendingUp, 
  UserPlus2,
  Gift,
  X
} from 'lucide-react';

const EXTRA_GIFTS = [
  { name: 'Certificado prof.', icon: '📜', cost: 500 },
  { name: 'Una estrella', icon: '⭐', cost: 50 },
  { name: 'Varias estrellas', icon: '✨', cost: 100 },
  { name: 'Billetes dólares', icon: '💵', cost: 300 },
  { name: 'Reloj de oro', icon: '⌚', cost: 5000 },
  { name: 'Pulsera', icon: '📿', cost: 800 },
  { name: 'Token', icon: '🪙', cost: 1000 },
  { name: 'Rosa roja', icon: '🌹', cost: 10 },
  { name: 'Beso', icon: '💋', cost: 5 },
  { name: 'Besos', icon: '😘', cost: 15 },
  { name: 'Te adoro', icon: '🥰', cost: 5 },
  { name: 'Osito', icon: '🧸', cost: 1 },
  { name: 'Corazón con lazo', icon: '💝', cost: 5 },
  { name: 'Rosa blanca', icon: '💮', cost: 10 },
  { name: 'Café', icon: '☕', cost: 20 },
  { name: 'Bolso', icon: '👜', cost: 3000 },
  { name: 'Te amo', icon: '💖', cost: 2 },
  { name: 'Te adoro', icon: '😍', cost: 1 },
  { name: 'Corazón blanco', icon: '🤍', cost: 3 },
  { name: 'Perfume', icon: '🧴', cost: 200 },
  { name: 'Collar diamantes', icon: '💎', cost: 2500 },
  { name: 'Collar de oro 18k', icon: '📿', cost: 1800 },
  { name: 'Un viaje', icon: '✈️', cost: 5000 },
  { name: 'Un coche', icon: '🚗', cost: 50000 },
  { name: 'Una casa', icon: '🏠', cost: 100000 },
  { name: 'Una copa', icon: '🏆', cost: 5 },
  { name: 'Anillo diamantes', icon: '💍', cost: 3500 },
  { name: 'Gafas de moda', icon: '🕶️', cost: 400 },
  { name: 'Vestido de moda', icon: '👗', cost: 100 },
  { name: 'Un avión', icon: '🛩️', cost: 1000000 },
  { name: 'Dos Alas de ángel', icon: '👼', cost: 2 },
  { name: 'Ala de ángel VS', icon: '🪽', cost: 1 },
  { name: 'Collar de oro', icon: '🟡', cost: 100 },
  { name: 'Collar de perlas', icon: '⚪', cost: 80 },
  { name: 'Vestido de gala', icon: '🥻', cost: 3000 },
  { name: 'Zapatos costura', icon: '👠', cost: 800 },
  { name: 'Ramo de rosas', icon: '💐', cost: 20 },
  { name: 'Bolígrafo de oro', icon: '🖊️', cost: 10 },
  { name: 'Reloj', icon: '⌚', cost: 100000 },
  { name: 'Una moneda de oro', icon: '🪙', cost: 2 },
  { name: 'Varias monedas de oro', icon: '🪙✨', cost: 5 },
  { name: 'Tesoro de monedas', icon: '💰', cost: 10 },
  { name: 'Cena de lujo', icon: '🍽️', cost: 250 },
  { name: 'Manos juntas', icon: '🫶', cost: 1 },
  { name: 'Café', icon: '☕', cost: 2 }
];

export interface Patrocinado {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: 'model' | 'investor';
  registeredAt: string;
  earningsGenerated: number;
  status: 'active' | 'pending' | 'inactive';
}

interface DirectMessageChatProps {
  models: ModelProfile[];
  patrocinados?: Patrocinado[];
  initialMessages: ChatMessage[];
  currentUserId: string;
  currentUserRole?: string;
  onSendMessage: (msg: ChatMessage) => void;
  selectedContactId?: string;
  onSelectModel?: (model: ModelProfile) => void;
  onPatrocinateClick?: (modelId: string) => void;
  onGiftTransaction?: (giftCostInCoins: number, recipientName: string, recipientIdOrUsername: string) => void;
  onBack?: () => void;
  sharedDraftImage?: string | null;
  onClearSharedDraftImage?: () => void;
}

interface MessageTarget {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: 'model' | 'investor' | 'admin' | 'user';
  status: 'active' | 'inactive' | 'offline' | 'online';
}

export default function DirectMessageChat({
  models,
  patrocinados = [],
  initialMessages,
  currentUserId,
  currentUserRole,
  onSendMessage,
  selectedContactId,
  onSelectModel,
  onPatrocinateClick,
  onGiftTransaction,
  onBack,
  sharedDraftImage = null,
  onClearSharedDraftImage
}: DirectMessageChatProps) {
  // Built-in list of other standard users/contacts on the platform to represent more "other users"
  const defaultStandardContacts: MessageTarget[] = [
    {
      id: 'topf-1',
      name: 'Adriana Lima',
      username: 'adrianalima_w1',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      role: 'investor',
      status: 'online'
    },
    {
      id: 'topf-2',
      name: 'Alessandra Ambrosio',
      username: 'alessandraambrosio_w2',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150',
      role: 'investor',
      status: 'online'
    },
    {
      id: 'topf-3',
      name: 'Candice Swanepoel',
      username: 'candiceswanepoel_w3',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
      role: 'investor',
      status: 'online'
    },
    {
      id: 'topf-4',
      name: 'Jasmine Tookes',
      username: 'jasminetookes_w4',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150',
      role: 'investor',
      status: 'online'
    },
    {
      id: 'topm-1',
      name: 'Alexander Vance',
      username: 'alexandervance_m1',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      role: 'investor',
      status: 'online'
    },
    {
      id: 'topm-2',
      name: 'Marcus Sterling',
      username: 'marcussterling_m2',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
      role: 'investor',
      status: 'online'
    },
    {
      id: 'usr-1',
      name: 'Elena Rostova',
      username: 'elena_r',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
      role: 'user',
      status: 'online'
    }
  ];

  // Compile active targets
  const getCombinedContacts = (): MessageTarget[] => {
    const list: MessageTarget[] = [];
    
    // 1. Add models
    models.forEach(m => {
      list.push({
        id: m.id,
        name: m.name,
        username: m.username,
        avatar: m.avatar,
        role: 'model',
        status: m.totalLikes > 100 ? 'online' : 'offline'
      });
    });

    // 2. Add patrocinados (avoid duplicates)
    patrocinados.forEach(p => {
      if (!list.some(item => item.username === p.username)) {
        list.push({
          id: p.id,
          name: p.name,
          username: p.username,
          avatar: p.avatar,
          role: p.role,
          status: p.status === 'active' ? 'online' : 'offline'
        });
      }
    });

    // 3. Add standard contacts (avoid duplicates)
    defaultStandardContacts.forEach(c => {
      if (!list.some(item => item.username === c.username)) {
        list.push(c);
      }
    });

    return list;
  };

  const [allContacts, setAllContacts] = useState<MessageTarget[]>(getCombinedContacts());
  const [activeContactId, setActiveContactId] = useState<string>('');
  const [unfoldedContactIds, setUnfoldedContactIds] = useState<{[contactId: string]: boolean}>({});
  const [deletedContactIds, setDeletedContactIds] = useState<string[]>(() => {
    const cached = localStorage.getItem('deleted_chat_contacts');
    return cached ? JSON.parse(cached) : [];
  });
  const [inputText, setInputText] = useState('');
  const [selectedAttachmentImage, setSelectedAttachmentImage] = useState<string | null>(sharedDraftImage);

  useEffect(() => {
    if (sharedDraftImage) {
      setSelectedAttachmentImage(sharedDraftImage);
    }
  }, [sharedDraftImage]);
  const [showGiftsHoverMenu, setShowGiftsHoverMenu] = useState(false);
  const [liveUserCoins, setLiveUserCoins] = useState(() => {
    const cached = localStorage.getItem('casting_live_coins_qty');
    return cached ? parseInt(cached, 10) : 2788;
  });
  const [fallingEmojis, setFallingEmojis] = useState<Array<{ id: number; char: string; x: number; delay: number; duration: number; size: number }>>([]);

  useEffect(() => {
    localStorage.setItem('casting_live_coins_qty', liveUserCoins.toString());
  }, [liveUserCoins]);

  useEffect(() => {
    const handleStorageChange = () => {
      const cached = localStorage.getItem('casting_live_coins_qty');
      if (cached) {
        const val = parseInt(cached, 10);
        if (!isNaN(val)) {
          setLiveUserCoins(val);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'models' | 'referred' | 'others'>('all');
  
  // Custom dialog to add messaging directly to any custom username
  const [showCustomContactModal, setShowCustomContactModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customUsername, setCustomUsername] = useState('');
  const [customRole, setCustomRole] = useState<'model' | 'investor'>('model');

  const [isBlocked, setIsBlocked] = useState(false);
  const [isReported, setIsReported] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // Sync contacts if models or patrocinados list gets modified
  useEffect(() => {
    setAllContacts(getCombinedContacts());
  }, [models, patrocinados]);

  // Set default active contact on load
  useEffect(() => {
    const combined = getCombinedContacts();
    if (selectedContactId) {
      const targetLower = selectedContactId.toLowerCase();
      const match = combined.find(c =>
        c.id === selectedContactId ||
        c.username.toLowerCase() === targetLower ||
        c.id.toLowerCase() === targetLower
      );
      if (match) {
        setActiveContactId(match.id);
        setUnfoldedContactIds(prev => ({ ...prev, [match.id]: true }));
        if (deletedContactIds.includes(match.id)) {
          const nextDeleted = deletedContactIds.filter(id => id !== match.id);
          setDeletedContactIds(nextDeleted);
          localStorage.setItem('deleted_chat_contacts', JSON.stringify(nextDeleted));
        }
      } else if (combined.length > 0) {
        const cleanName = selectedContactId.replace(/_/g, ' ').replace(/[0-9]/g, '');
        const formattedName = cleanName ? (cleanName.charAt(0).toUpperCase() + cleanName.slice(1)).trim() : selectedContactId;
        const newContact: MessageTarget = {
          id: selectedContactId,
          name: formattedName,
          username: selectedContactId,
          avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150',
          role: 'model',
          status: 'online'
        };
        setAllContacts(prev => [newContact, ...prev.filter(c => c.id !== selectedContactId)]);
        setActiveContactId(selectedContactId);
      }
    } else if (combined.length > 0 && !activeContactId) {
      const visible = combined.filter(c => !deletedContactIds.includes(c.id));
      if (visible.length > 0) {
        setActiveContactId(visible[0].id);
      }
    }
  }, [selectedContactId, deletedContactIds]);

  // Scroll viewport down
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [initialMessages, activeContactId]);

  const activeContact = allContacts.find(c => c.id === activeContactId);

  // Filter messages exchanged with selected contact
  const currentChatHistory = initialMessages.filter(
    (msg) =>
      (msg.senderId === currentUserId && msg.receiverId === activeContactId) ||
      (msg.senderId === activeContactId && msg.receiverId === currentUserId)
  );

  const handleSend = (e: React.FormEvent, customImg?: string) => {
    e.preventDefault();
    const finalImg = customImg || selectedAttachmentImage || undefined;
    if (!inputText.trim() && !finalImg) return;
    if (!activeContactId) return;
    if (isBlocked) {
      alert('Has bloqueado a este usuario. Desbloquéalo antes de enviar mensajes.');
      return;
    }

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      receiverId: activeContactId,
      text: inputText,
      timestamp: new Date().toISOString(),
      imageUrl: finalImg
    };

    onSendMessage(newMsg);
    setInputText('');
    setSelectedAttachmentImage(null);
    if (onClearSharedDraftImage) {
      onClearSharedDraftImage();
    }

    // Trigger highly realistic reply based on recipient role
    const recipient = activeContact;
    setTimeout(() => {
      let answers = [
        '¡Mensaje privado recibido! Me pondré en contacto contigo más tarde.',
        'De acuerdo, revisaré tu propuesta en mi bandeja de entrada privada hoy mismo.',
        'Perfecto, mantengamos la comunicación por esta de mensajes privados.',
        'Muchas gracias por el mensaje. ¿Tienes alguna pregunta sobre el sistema coordinado?'
      ];

      if (recipient) {
        if (recipient.role === 'model') {
          answers = [
            '¡Hola! Gracias de verdad por tu mensaje de apoyo. ¿Has visto mis últimas fotos en el Muro?',
            'Me encanta que me escribas por privado. Estaba revisando mi posición de Likes del Ranking general.',
            'Perfecto. Recuerda dejar tu like oficial en mi perfil para votar en el ranking semanal.',
            '¡Mil gracias por el mensaje! Es un gusto hablar contigo por este canal privado.'
          ];
        } else if (recipient.role === 'investor' || patrocinados.some(p => p.id === recipient.id)) {
          answers = [
            '¡Qué tal! Gracias por escribirme. El patrocinio que nos ofreces es fantástico.',
            'De acuerdo con las finanzas. Me parece que el 10% de comisión automática me viene excelente.',
            'Hecho. Cuéntame si hay más marcas patrocinadoras ingresando hoy.',
            '¡Buenas! Sí, ya completé el registro desde tu enlace único de patrocinado.'
          ];
        }
      }

      const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
      
      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        senderId: activeContactId,
        receiverId: currentUserId,
        text: randomAnswer,
        timestamp: new Date().toISOString()
      };
      
      onSendMessage(replyMsg);
    }, 1200);
  };

  const handleCreateCustomContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customUsername.trim()) return;

    const cleanUsername = customUsername.trim().toLowerCase().replace(/\s+/g, '').replace('@', '');
    
    // Check if we already have a contact with this username that was deleted, and un-delete it
    const existing = allContacts.find(c => c.username.toLowerCase() === cleanUsername);
    if (existing) {
      if (deletedContactIds.includes(existing.id)) {
        const nextDeleted = deletedContactIds.filter(id => id !== existing.id);
        setDeletedContactIds(nextDeleted);
        localStorage.setItem('deleted_chat_contacts', JSON.stringify(nextDeleted));
      }
      setActiveContactId(existing.id);
    } else {
      const newTarget: MessageTarget = {
        id: `custom-usr-${Date.now()}`,
        name: customName.trim(),
        username: cleanUsername,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?auto=format&fit=crop&q=80&w=150`,
        role: customRole,
        status: 'online'
      };

      setAllContacts(prev => [newTarget, ...prev]);
      setActiveContactId(newTarget.id);
    }
    
    // Clear form
    setCustomName('');
    setCustomUsername('');
    setShowCustomContactModal(false);
    alert(`🎉 Chat privado iniciado con @${cleanUsername}`);
  };

  const attachImage = () => {
    const samples = [
      'https://images.unsplash.com/photo-1512484776495-a09d92e87c3b?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    handleSend({ preventDefault: () => {} } as any, picked);
  };

  // Filter contacts by selection & text search
  const filteredContacts = allContacts.filter(c => {
    // 0. Filter out deleted conversations
    if (deletedContactIds.includes(c.id)) return false;

    // 1. Text Search Filter
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.username.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // 2. Tab Category Filter
    if (selectedFilter === 'models') return c.role === 'model';
    if (selectedFilter === 'referred') return patrocinados.some(p => p.username === c.username);
    if (selectedFilter === 'others') return c.role !== 'model' && !patrocinados.some(p => p.username === c.username);
    
    return true;
  });

  const handleDeleteConversation = (e: React.MouseEvent, contactId: string) => {
    e.stopPropagation();
    const nextDeleted = [...deletedContactIds, contactId];
    setDeletedContactIds(nextDeleted);
    localStorage.setItem('deleted_chat_contacts', JSON.stringify(nextDeleted));
    
    // Select another contact if active was deleted
    if (activeContactId === contactId) {
      const remaining = filteredContacts.filter(c => c.id !== contactId);
      if (remaining.length > 0) {
        setActiveContactId(remaining[0].id);
      } else {
        setActiveContactId('');
      }
    }
  };

  return (
    <div className="bg-white border border-slate-150 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row h-[620px]" id="private-messages-viewport">
      
      {/* LEFT PANE: CONTACT LIST WITH FILTERS & SEARCH */}
      <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col bg-white ${activeContactId ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Header containing name and Add user option */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-slate-700 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition cursor-pointer shadow-3xs"
                  title="Volver"
                >
                  <span>← Volver</span>
                </button>
              )}
              <span className="p-1.5 bg-zinc-100 text-zinc-650 rounded-lg">
                <MessageCircle className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">Mensajes</h3>
            </div>
            
            {/* Quick action to message any custom user */}
            <button
              onClick={() => setShowCustomContactModal(true)}
              className="tab-trigger p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-650 rounded-lg transition"
              title="Escribir a un nuevo usuario..."
              id="btn-add-custom-contact"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search Contacts input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por alias, nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-100 border-none text-[11px] rounded-xl w-full pl-8 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-zinc-300 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Filter Categories Tabs */}
        <div className="flex border-b border-slate-100 bg-white p-1 gap-1 text-[10px] font-bold">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`tab-trigger flex-1 py-1.5 rounded-lg text-center transition ${selectedFilter === 'all' ? 'bg-zinc-900 text-white border border-zinc-900' : 'text-zinc-500 hover:bg-zinc-100 border border-transparent'}`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedFilter('models')}
            className={`tab-trigger flex-1 py-1.5 rounded-lg text-center transition ${selectedFilter === 'models' ? 'bg-zinc-900 text-white border border-zinc-900' : 'text-zinc-500 hover:bg-zinc-100 border border-transparent'}`}
          >
            Sponsores
          </button>
          <button
            onClick={() => setSelectedFilter('referred')}
            className={`tab-trigger flex-1 py-1.5 rounded-lg text-center transition ${selectedFilter === 'referred' ? 'bg-zinc-900 text-white border border-zinc-900' : 'text-zinc-500 hover:bg-zinc-100 border border-transparent'}`}
          >
            Referidos
          </button>
          <button
            onClick={() => setSelectedFilter('others')}
            className={`tab-trigger flex-1 py-1.5 rounded-lg text-center transition ${selectedFilter === 'others' ? 'bg-zinc-900 text-white border border-zinc-900' : 'text-zinc-500 hover:bg-zinc-100 border border-transparent'}`}
          >
            Otros
          </button>
        </div>

        {/* List scroll container */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-white">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-[11px] space-y-1">
              <Users className="w-6 h-6 mx-auto text-slate-300" />
              <p>Ningún contacto coincide.</p>
              <button 
                onClick={() => setShowCustomContactModal(true)} 
                className="tab-trigger text-zinc-600 font-semibold underline text-[10px] border-0 bg-transparent"
              >
                Escribir a @usuario personalizado
              </button>
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const isActive = contact.id === activeContactId;
              // Check last message Preview
              const lastMsg = initialMessages
                .filter(m => (m.senderId === currentUserId && m.receiverId === contact.id) || (m.senderId === contact.id && m.receiverId === currentUserId))
                .slice(-1)[0];

              return (
                <div key={contact.id} className="relative group">
                  <button
                    onClick={() => {
                      setActiveContactId(contact.id);
                      setIsBlocked(false);
                      setIsReported(false);
                      setUnfoldedContactIds(prev => ({ ...prev, [contact.id]: true }));
                    }}
                    className={`tab-trigger w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition border ${
                      isActive
                        ? 'bg-zinc-100 border-zinc-200 shadow-xs text-zinc-900 font-bold'
                        : 'hover:bg-zinc-50/80 border-transparent text-zinc-600'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        contact.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'
                      }`} />
                    </div>

                    <div className="truncate flex-1 min-w-0 pr-6">
                      <div className="flex justify-between items-baseline">
                        <p className="text-xs font-bold text-slate-800 truncate">{contact.name}</p>
                        
                        {/* Label Category badge */}
                        <span className="text-[8px] font-mono tracking-wider text-slate-400 capitalize bg-slate-100 px-1 py-0.2 rounded font-semibold shrink-0">
                          {contact.role === 'model' ? 'Sponsor' : 'User'}
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-slate-400 font-mono truncate">@{contact.username}</p>
                      
                      {lastMsg ? (
                        <p className="text-[10px] text-slate-500 truncate mt-0.5 max-w-[150px]">
                          {lastMsg.senderId === currentUserId ? 'Tú: ' : ''}{lastMsg.text || '📍 Imagen enviada'}
                        </p>
                      ) : (
                        <p className="text-[9px] text-zinc-500/80 italic mt-0.5 truncate">¡Escríbele un privado!</p>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={(e) => handleDeleteConversation(e, contact.id)}
                    className="tab-trigger absolute right-2 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 md:opacity-0 group-hover:opacity-100 focus:opacity-100 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 p-1 rounded-md transition-all duration-150 cursor-pointer z-10 shadow-3xs"
                    title="Eliminar conversación"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANE: ACTIVE MESSAGE CHAT GRID viewport */}
      <div className={`flex-1 flex flex-col bg-slate-50/50 relative ${activeContactId ? 'flex' : 'hidden md:flex'}`}>
        {activeContact ? (
          <>
            {/* Header chat detail bar */}
            <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between z-10 shadow-3xs">
              <div className="flex items-center gap-3 max-w-[65%]">
                {/* Back to Contacts List button on Mobile */}
                <button
                  type="button"
                  onClick={() => setActiveContactId('')}
                  className="md:hidden flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-slate-700 hover:text-slate-950 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition cursor-pointer shadow-3xs shrink-0"
                  title="Volver a contactos"
                >
                  <span>← Contactos</span>
                </button>
                {(() => {
                  const matchedModel = models.find(m => m.id === activeContact.id || m.username.toLowerCase() === activeContact.username.toLowerCase());
                  return (
                    <>
                      <img
                        src={activeContact.avatar}
                        alt={activeContact.name}
                        onClick={() => {
                          if (matchedModel && onSelectModel) {
                            onSelectModel(matchedModel);
                          }
                        }}
                        referrerPolicy="no-referrer"
                        className={`w-9 h-9 rounded-xl object-cover border border-slate-150 transition-transform ${
                          matchedModel ? 'cursor-pointer hover:scale-105 hover:border-indigo-400' : ''
                        }`}
                        title={matchedModel ? `Ver perfil completo de ${activeContact.name}` : undefined}
                      />
                      <div className="truncate">
                        <h4 
                          onClick={() => {
                            if (matchedModel && onSelectModel) {
                              onSelectModel(matchedModel);
                            }
                          }}
                          className={`text-xs sm:text-sm font-bold truncate text-slate-850 flex items-center gap-1.5 ${
                            matchedModel ? 'cursor-pointer hover:text-indigo-600 hover:underline' : ''
                          }`}
                          title={matchedModel ? `Ver perfil completo de ${activeContact.name}` : undefined}
                        >
                          <span>{activeContact.name}</span>
                          <span className={`w-2 h-2 rounded-full inline-block ${activeContact.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono">@{activeContact.username}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Private messaging safety utilities */}
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setIsBlocked(!isBlocked)}
                  className={`tab-trigger px-2.5 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-wider transition ${
                    isBlocked 
                      ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {isBlocked ? 'Bloqueado' : 'Bloquear'}
                </button>

                <button
                  onClick={() => {
                    setIsReported(true);
                    alert(`Has reportado esta conversación privada con @${activeContact.username}. Revisaremos el histórico de abuso.`);
                  }}
                  disabled={isReported}
                  className="tab-trigger p-1.5 text-zinc-400 hover:text-rose-600 bg-zinc-100 hover:bg-rose-50 rounded-xl transition"
                  title="Reportar mensaje"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-zinc-500" />
                </button>
              </div>
            </div>

            {(() => {
              const matchedModel = models.find(m => m.id === activeContact.id || m.username.toLowerCase() === activeContact.username.toLowerCase());
              const isUnfolded = !matchedModel || unfoldedContactIds[activeContact.id] || currentUserRole === 'model';

              if (matchedModel && !isUnfolded) {
                return (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white border border-slate-100/50 rounded-2xl m-4 shadow-3xs space-y-6 overflow-y-auto">
                    {/* Model Avatar Details */}
                    <div className="relative inline-block mt-4 select-none">
                      <img
                        src={activeContact.avatar}
                        alt={activeContact.name}
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-indigo-50 shadow-md mx-auto"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border-2 border-white uppercase">
                        {activeContact.status === 'online' ? 'Online' : 'Offline'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display flex items-center justify-center gap-1.5">
                        <span>{activeContact.name}</span>
                        <span className="bg-indigo-100 text-indigo-700 text-[9px] font-black px-1.5 py-0.5 rounded animate-pulse">SPONSOR</span>
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">@{activeContact.username}</p>
                    </div>

                    {/* Custom personalized description by model */}
                    <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-5 text-slate-600 text-xs sm:text-sm leading-relaxed italic max-w-md mx-auto relative shadow-3xs">
                      <span className="absolute -top-3 left-6 text-2xl text-indigo-200 font-serif select-none">“</span>
                      <p className="font-sans font-medium text-slate-700 md:max-w-xs xl:max-w-md mx-auto leading-relaxed">
                        {matchedModel.bio || "Mecanismo de afiliación activo. ¡Apóyame en las mesas de inversión y sé uno de mis recomendados!"}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 font-mono not-italic uppercase tracking-wider font-bold">
                        — Descripción personalizada por la modelo
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full max-w-sm mx-auto pt-2 select-none pb-4">
                      {currentUserRole === 'visitor' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onPatrocinateClick) {
                              onPatrocinateClick(matchedModel.id);
                            }
                          }}
                          className="w-full sm:flex-1 py-3 px-5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20 active:translate-y-px cursor-pointer"
                        >
                          Patrocíname
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setUnfoldedContactIds(prev => ({ ...prev, [activeContact.id]: true }));
                        }}
                        className="w-full sm:flex-1 py-3 px-5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-md hover:shadow-lg active:translate-y-px cursor-pointer border border-slate-700/50"
                      >
                        Chatea conmigo
                      </button>
                    </div>

                    {currentUserRole === 'visitor' && (
                      <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto pb-4">
                        Al patrocinar a <strong>{activeContact.name}</strong>, serás redirigido al formulario de registro patrocinado por la modelo. El 10% de tus premios apoyará estratégicamente su red.
                      </p>
                    )}
                  </div>
                );
              }

              return (
                <>
                  {/* Falling Emoji Rain Container */}
                  {fallingEmojis.length > 0 && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[9999]">
                      <style dangerouslySetInnerHTML={{__html: `
                        @keyframes fall-down {
                          0% {
                            transform: translateY(-50px) rotate(0deg);
                            opacity: 0;
                          }
                          10% {
                            opacity: 1;
                          }
                          90% {
                            opacity: 1;
                          }
                          100% {
                            transform: translateY(100vh) rotate(360deg);
                            opacity: 0;
                          }
                        }
                      `}} />
                      {fallingEmojis.map(emoji => (
                        <div
                          key={emoji.id}
                          className="absolute text-3xl select-none"
                          style={{
                            left: `${emoji.x}%`,
                            top: `-10%`,
                            fontSize: `${emoji.size}px`,
                            animation: `fall-down ${emoji.duration}s linear ${emoji.delay}s forwards`,
                          }}
                        >
                          {emoji.char}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* MESSAGE STREAMS VIEWER */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                    
                    {/* Info Notification indicating secure connection */}
                    <div className="mx-auto max-w-xs text-center py-2 px-3 bg-indigo-50/50 border border-indigo-100/50 text-indigo-750 rounded-xl text-[9px] font-semibold flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span>Conversación de canal privado cifrada punto-a-punto</span>
                    </div>

                    {/* 🎁 PROACTIVE GIFT SENDING OFFER BOX FOR USERS */}
                    <div className="mx-auto max-w-sm bg-gradient-to-tr from-rose-50 to-amber-50 border border-pink-100/80 rounded-2xl p-3.5 text-center space-y-1.5 shadow-3xs animate-fade-in relative z-10">
                      <div className="flex items-center justify-center gap-1.5 text-[10.5px] font-extrabold text-pink-700 leading-none">
                        <Gift className="w-3.5 h-3.5 text-pink-500 animate-bounce" />
                        <span className="uppercase tracking-wider">¿QUIERES IMPRESIONAR A {activeContact.name.toUpperCase()}?</span>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-relaxed max-w-[280px] mx-auto">
                        Ofrécele un <strong>Regalo Extra del Canal</strong> de la barra inferior para captar su atención preferente, acelerar tu rango de sponsor y desbloquear sorpresas.
                      </p>
                    </div>

                    {isBlocked && (
                      <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs p-3 rounded-2xl flex gap-2 items-start max-w-md mx-auto">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block">Destinatario Bloqueado</span>
                          <span className="text-[10px] leading-relaxed block text-rose-500">
                            Has bloqueado a @{activeContact.username}. Puedes leer vuestro historial pero no le llegarán mensajes tuyos hasta que no lo desbloquees.
                          </span>
                        </div>
                      </div>
                    )}

                    {currentChatHistory.length === 0 && (
                      <div className="text-center py-16 text-slate-400 text-xs space-y-1 bg-white/40 border border-dashed border-slate-200 rounded-2xl p-6 max-w-sm mx-auto">
                        <MessageCircle className="w-8 h-8 text-indigo-400/80 mx-auto mb-1 animate-pulse" />
                        <p className="font-bold text-slate-700">Sin Mensajes Previos</p>
                        <p className="text-[10px] text-slate-450 leading-relaxed">
                          Escribe un mensaje privado seguro para iniciar la conversación con @{activeContact.username}.
                        </p>
                      </div>
                    )}

                    {currentChatHistory.map((msg) => {
                      const isMine = msg.senderId === currentUserId;
                      const isGiftMsg = msg.text?.includes('Regalo Extra');
                      return (
                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                          <div className={`max-w-[75%] rounded-2xl p-3.5 space-y-1 ${
                            isMine
                              ? isGiftMsg
                                ? 'bg-amber-50 text-amber-900 rounded-tr-none shadow-3xs border border-amber-200'
                                : 'bg-zinc-900 text-white rounded-tr-none shadow-3xs'
                              : 'bg-zinc-100 text-zinc-900 rounded-tl-none border border-zinc-200/60 shadow-3xs'
                          }`}>
                            {msg.text && <p className="text-xs sm:text-xs font-medium whitespace-pre-wrap leading-relaxed">{msg.text}</p>}
                            {msg.imageUrl && (
                               <div className="rounded-xl overflow-hidden border border-slate-150/50 mt-1 max-w-[180px]">
                                <img src={msg.imageUrl} alt="attachment" referrerPolicy="no-referrer" className="w-[180px] h-auto object-cover" />
                              </div>
                            )}
                            
                            <div className="flex items-center justify-end gap-1 text-[9px] mt-1 shrink-0 select-none">
                              <span className={isMine ? isGiftMsg ? 'text-amber-600 font-mono' : 'text-zinc-400 font-mono' : 'text-zinc-500 font-mono'}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isMine && (
                                <CheckCheck className="w-3 h-3 text-emerald-600" title="Mensaje Leído por destinatario" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>

                  {/* SEND INPUT CONTAINER - HOLDS PREMIUM EMOJI-LIKE GIFTS SELECTOR ON HOVER */}
                  <form onSubmit={(e) => handleSend(e)} className="p-3 border-t border-slate-110 bg-white flex gap-2 items-center shadow-3xs relative overflow-visible">
                    
                    {selectedAttachmentImage && (
                      <div className="absolute bottom-full left-0 right-0 bg-white/95 backdrop-blur-xs border-t border-b border-pink-100 p-2.5 px-4 flex items-center justify-between gap-3 animate-fade-in z-40 shadow-md">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-pink-250 bg-white shrink-0 shadow-xs">
                            <img src={selectedAttachmentImage || undefined} alt="Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left">
                            <div className="text-[10px] font-black text-pink-600 uppercase tracking-wider leading-none flex items-center gap-1">
                              <span>📷</span> Imagen para compartir en mensaje
                            </div>
                            <div className="text-[9px] text-slate-500 mt-1 font-medium leading-none">
                              Se enviará junto con tu mensaje privado
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAttachmentImage(null);
                            if (onClearSharedDraftImage) {
                              onClearSharedDraftImage();
                            }
                          }}
                          className="p-1.5 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 transition cursor-pointer border-none flex items-center justify-center shrink-0"
                          title="Quitar imagen"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* 📷 PORTRAIT PHOTO ATTACHMENT BUTTON (MATCHING CAPTURE IMAGE.PNG) */}
                    <button
                      type="button"
                      onClick={attachImage}
                      className="tab-trigger w-[42px] h-[42px] rounded-2xl flex items-center justify-center shrink-0 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 shadow-xs hover:scale-105 active:scale-95 duration-150 transition cursor-pointer"
                      title="Adjuntar Imagen para el destinatario"
                    >
                      <Image className="w-4 h-4 text-zinc-500" />
                    </button>

                    {/* 🎁 DETALLES / EXTRA GIFTS HOVER POPUP SELECTOR (ELEGANT EMOJI PICKER STYLE) */}
                    <div 
                      className="relative z-50"
                      onMouseEnter={() => setShowGiftsHoverMenu(true)}
                      onMouseLeave={() => setShowGiftsHoverMenu(false)}
                    >
                      {/* FIRST GIFT REPRESENTING THE SELECTABLE EMOJI TRIGGER */}
                      <button
                        type="button"
                        className="tab-trigger w-[42px] h-[42px] rounded-2xl flex items-center justify-center shrink-0 border border-amber-300 bg-gradient-to-tr from-amber-50 to-orange-100/90 hover:from-amber-100 hover:to-orange-200/90 shadow-xs transition-all duration-150 cursor-pointer text-xl relative group"
                        title="Enviar Regalo Extra (Pasa el ratón para ver más)"
                      >
                        <span className="animate-pulse">{EXTRA_GIFTS[0].icon}</span>
                        <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white font-mono text-[7px] px-1 rounded-full font-black scale-90">
                          {EXTRA_GIFTS[0].cost}
                        </span>
                      </button>

                      {/* POPUP CONTAINER THAT REVEALS ON HOVER LIKE A FLOATING EMOJI BOARD */}
                      {showGiftsHoverMenu && (
                        <div className="absolute bottom-12 -left-12 sm:-left-36 w-[360px] sm:w-[380px] bg-[#FFFDFC]/98 backdrop-blur-md border border-amber-200 rounded-2xl shadow-2xl p-4 z-[9999] animate-bounce-in text-left">
                          <div className="flex items-center justify-between pb-2 border-b border-rose-50 mb-3">
                            <span className="text-[11px] font-black uppercase text-amber-800 tracking-wider">
                              🎁 Elige un Regalo (Sponsor)
                            </span>
                            <div className="bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg text-amber-700 text-[10px] font-black font-mono tracking-wide">
                              Saldo: 🪙 {liveUserCoins}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 max-h-[340px] overflow-y-auto pr-0.5 scrollbar-thin">
                            {EXTRA_GIFTS.map((gift, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  if (isBlocked) {
                                    alert('No puedes enviar regalos a un usuario bloqueado.');
                                    return;
                                  }

                                  if (liveUserCoins < gift.cost) {
                                    alert(`⚠️ No tienes suficientes monedas para enviar ${gift.name} (necesitas 🪙 ${gift.cost}, tienes 🪙 ${liveUserCoins}).`);
                                    return;
                                  }

                                  // Deduct from balance
                                  setLiveUserCoins(prev => prev - gift.cost);

                                  if (onGiftTransaction) {
                                    onGiftTransaction(gift.cost, activeContact?.name || '', activeContact?.id || activeContact?.username || '');
                                  }

                                  // Trigger falling emojis rain effect!
                                  const rain: Array<{ id: number; char: string; x: number; delay: number; duration: number; size: number }> = [];
                                  for (let i = 0; i < 40; i++) {
                                    rain.push({
                                      id: Date.now() + i + Math.random(),
                                      char: gift.icon,
                                      x: Math.random() * 100, // percentage of container width
                                      delay: Math.random() * 2, // staggered delay in seconds
                                      duration: 1.5 + Math.random() * 2, // animation duration in seconds
                                      size: 16 + Math.random() * 32 // size in pixels
                                    });
                                  }
                                  setFallingEmojis(rain);
                                  
                                  // Clean up rain after animation finishes
                                  setTimeout(() => {
                                    setFallingEmojis([]);
                                  }, 4500);
                                  
                                  // Play audio synth chime
                                  try {
                                    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                                    const osc1 = audioCtx.createOscillator();
                                    const osc2 = audioCtx.createOscillator();
                                    const gain = audioCtx.createGain();
                                    
                                    osc1.type = 'sine';
                                    osc2.type = 'triangle';
                                    
                                    osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
                                    osc2.frequency.setValueAtTime(987.77, audioCtx.currentTime); // B5
                                    
                                    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
                                    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.55);
                                    
                                    osc1.connect(gain);
                                    osc2.connect(gain);
                                    gain.connect(audioCtx.destination);
                                    
                                    osc1.start();
                                    osc2.start();
                                    osc1.stop(audioCtx.currentTime + 0.55);
                                    osc2.stop(audioCtx.currentTime + 0.55);
                                  } catch (_) {}

                                  // Send message
                                  const newMsgStr = `🎁 ¡He enviado un Regalo Extra del Canal: ${gift.icon} ${gift.name}! (🪙 ${gift.cost} monedas)`;
                                  const newMsg: ChatMessage = {
                                    id: `msg-${Date.now()}`,
                                    senderId: currentUserId,
                                    receiverId: activeContactId,
                                    text: newMsgStr,
                                    timestamp: new Date().toISOString()
                                  };
                                  onSendMessage(newMsg);

                                  // Sweet simulated reaction
                                  setTimeout(() => {
                                    let replyStr = `🎁 ¡Ooooohhh! Un detalle precioso, mil gracias por el regalo de ${gift.icon} ${gift.name}. ¡Me encanta hablar contigo! 🥰`;
                                    if (activeContact?.role === 'model') {
                                      replyStr = `💖 ¡Muchísimas gracias por enviarme ${gift.icon} ${gift.name} de los Regalos Extra! Tu patrocinio me ayuda muchísimo a subir en el Ranking Semanal. ¡Eres un sol! 🥰✨`;
                                    }
                                    const replyMsg: ChatMessage = {
                                      id: `msg-reply-${Date.now()}`,
                                      senderId: activeContactId,
                                      receiverId: currentUserId,
                                      text: replyStr,
                                      timestamp: new Date().toISOString()
                                    };
                                    onSendMessage(replyMsg);
                                  }, 1300);

                                  // Close menu
                                  setShowGiftsHoverMenu(false);
                                }}
                                className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-orange-50/50 border border-slate-100 hover:border-orange-200/40 bg-[#FFFDF9] transition duration-150 cursor-pointer text-center relative group shadow-3xs hover:shadow"
                                title={`${gift.name} (🪙 ${gift.cost})`}
                              >
                                <span className="text-3xl select-none mb-1 text-center transform transition-all group-hover:scale-110 active:scale-90 duration-200">{gift.icon}</span>
                                <span className="text-[10px] text-slate-700 font-bold leading-tight truncate w-full text-center" title={gift.name}>
                                  {gift.name}
                                </span>
                                <span className="text-[10px] text-amber-500 font-extrabold font-mono mt-0.5 whitespace-nowrap leading-none flex items-center justify-center gap-0.5">
                                  🪙 {gift.cost}
                                </span>
                              </button>
                            ))}
                          </div>

                          <div className="text-[9px] text-slate-400 mt-3 text-center border-t border-slate-100 pt-2.5 leading-none">
                            Presiona para enviar instantáneamente · Tu saldo: <span className="font-mono text-amber-500 font-bold">🪙 {liveUserCoins}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={`Escribe un mensaje privado a @${activeContact?.username || 'user'}...`}
                      className="flex-1 bg-slate-50 border border-slate-150 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-100 placeholder-slate-400"
                    />

                    <button
                      type="submit"
                      className="tab-trigger bg-zinc-900 hover:bg-zinc-800 text-white p-2.5 rounded-xl transition flex items-center justify-center cursor-pointer active:scale-95 shadow-3xs border-none"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              );
            })()}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs px-6 py-20 text-center bg-white/40 border-r border-slate-100">
            <Users className="w-10 h-10 text-slate-300 mb-2" />
            <p className="font-bold text-slate-600">Selecciona o busca un destinatario</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-xs">
              Usa la barra izquierda para elegir modelos sponsors, referidos de tu red, o escribe su alias directamente para enviarles mensajes privados de forma libre.
            </p>
          </div>
        )}
      </div>

      {/* DIALOG POPUP: START PRIVATE CHAT BY ENTERING ANY USERNAME */}
      {showCustomContactModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-[99999] p-4">
          <div className="bg-white rounded-3xl border border-slate-150 max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fade-in" id="modal-new-contact">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-800">
                <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                  <UserPlus2 className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm">Escribir a un @usuario nuevo</h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Sumoriza o escribe un alias para inicializar la bandeja de mensajes directos.
              </p>
            </div>

            <form onSubmit={handleCreateCustomContact} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Lorena Gómez"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl w-full px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Nombre de usuario (Alias):</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">@</span>
                  <input
                    type="text"
                    required
                    placeholder="lorenagomez"
                    value={customUsername}
                    onChange={(e) => setCustomUsername(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl w-full pl-7 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Rol que desempeña:</label>
                <div className="flex gap-2">
                  {(['model', 'investor'] as const).map(roleOpt => (
                    <button
                      key={roleOpt}
                      type="button"
                      onClick={() => setCustomRole(roleOpt)}
                      className={`flex-1 py-2 text-[11px] font-bold capitalize rounded-lg border transition ${
                        customRole === roleOpt 
                          ? 'bg-slate-900 border-slate-900 text-white' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {roleOpt === 'model' ? 'Modelo' : 'Inversor'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomContactModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-750 rounded-xl transition shadow-3xs"
                >
                  Abrir Bandeja Privada
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
