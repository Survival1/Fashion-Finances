import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ModelProfile } from '../types';
import { 
  Sparkles, 
  Crown, 
  Trophy, 
  Heart, 
  X, 
  Star, 
  Globe, 
  Users, 
  HeartHandshake, 
  Award, 
  ShieldCheck, 
  Gift, 
  Calendar, 
  TrendingUp, 
  Medal, 
  Zap, 
  ArrowRight,
  Volume2,
  VolumeX,
  Radio,
  ShoppingBag,
  Gem,
  Home,
  Video,
  Tag,
  Check,
  Eye,
  Clock,
  Flame,
  Send,
  Plus,
  Search,
  MessageCircle,
  Inbox,
  ArrowUpRight,
  CheckCircle2,
  Share2,
  Sparkle,
  BadgeCheck,
  Download,
  History,
  Building2,
  Lock,
  Shield,
  SlidersHorizontal,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause
} from 'lucide-react';
import FashionsFinanceLogo from './FashionsFinanceLogo';
import { BALMAIN_LOGO_DATA_URL, COUTURE_ELITE_LOGO_DATA_URL } from '../utils/brandLogos';
import RoyalMaleCrown from './RoyalMaleCrown';
import RoyalFemaleCrown from './RoyalFemaleCrown';

export interface BoutiqueCatalogItem {
  id: string;
  name: string;
  category: 'alas' | 'lenceria' | 'joyeria' | 'perfumes';
  tag: string;
  boutiqueHouse: string;
  boutiqueCity: string;
  description: string;
  image: string;
  priceCoins: number;
  priceEur: number;
  endorsedBy: string;
  rating?: number;
  isExclusive?: boolean;
}

export interface BoutiqueStoreMeta {
  id: string;
  name: string;
  username: string;
  style: string;
  rating: string;
  city: string;
}

export const BOUTIQUE_STORES_INFO: BoutiqueStoreMeta[] = [
  {
    id: 'balmain_paris_paloma',
    name: 'Balmain Paris Paloma Elsesser',
    username: 'palomaelsesser_w44',
    style: 'Calzado de Pasarela y Lujo 👠',
    rating: '4.8',
    city: 'París, Francia'
  },
  {
    id: 'victorias_secret_spain',
    name: "Victoria's Secret Spain",
    username: 'victoriassecret_es',
    style: 'Pódium Logo Oficial & Gala Verano 🌸',
    rating: '4.9',
    city: 'Madrid, España'
  },
  {
    id: 'loreal_group',
    name: "L'Oréal Group",
    username: 'loreal_es',
    style: 'Casting Live Product Ads - Maquillaje 💄',
    rating: '4.8',
    city: 'Madrid, España'
  },
  {
    id: 'carolina_herrera_spain',
    name: 'Carolina Herrera España',
    username: 'carolinaherrera_es',
    style: 'Sponsor de Pasarela de Alta Costura 👑',
    rating: '5.0',
    city: 'Madrid, España'
  },
  {
    id: 'richemont_boutique',
    name: 'Richemont',
    username: 'richemont_es',
    style: 'Relojería de Lujo 🇨🇭',
    rating: '5.0',
    city: 'Barcelona, España'
  },
  {
    id: 'gucci',
    name: 'Gucci Boutique Pasarela',
    username: 'gucci_official',
    style: 'Sponsor Oficial Alta Costura Italiana 🇮🇹',
    rating: '5.0',
    city: 'Florencia, Italia'
  },
  {
    id: 'versace',
    name: 'Versace Milano Haute Couture',
    username: 'versace_official',
    style: 'Sponsor Oficial Pasarela Medusa & Glamour 👑',
    rating: '5.0',
    city: 'Milán, Italia'
  },
  {
    id: 'balenciaga',
    name: 'Balenciaga Runway Exclusive',
    username: 'balenciaga_official',
    style: 'Sponsor Vanguardia & Moda Urbana de Lujo 🖤',
    rating: '4.9',
    city: 'París, Francia'
  },
  {
    id: 'louis_vuitton',
    name: 'Louis Vuitton Maison Paris',
    username: 'louisvuitton_es',
    style: 'Sponsor Oficial Marroquinería y Monograma 🇫🇷',
    rating: '5.0',
    city: 'París, Francia'
  },
  {
    id: 'ysl',
    name: 'Yves Saint Laurent Haute Couture',
    username: 'ysl_official',
    style: 'Sponsor Oficial Elegancia Nocturna y Fragancias 🖤',
    rating: '5.0',
    city: 'París, Francia'
  },
  {
    id: 'hermes',
    name: 'Hermès Paris Luxury',
    username: 'hermes_official',
    style: 'Sponsor Oficial Cuero Artesanal & Carrés de Seda 🐎',
    rating: '5.0',
    city: 'París, Francia'
  },
  {
    id: 'couture_elite',
    name: 'Couture Elite Boutique',
    username: 'adrianalima_w1',
    style: 'Pódium Pasarela VIP & Alas de Oro 💎',
    rating: '4.6',
    city: 'Milán, Italia'
  }
];

export const renderBoutiqueEmblem = (storeName: string, sizeClass = 'w-4.5 h-4.5') => {
  const n = (storeName || '').toLowerCase();
  
  if (n.includes('balmain')) {
    return (
      <div className={`${sizeClass} rounded-full bg-white border border-slate-300 flex items-center justify-center shrink-0 p-0.5 overflow-hidden shadow-2xs`}>
        <img src={BALMAIN_LOGO_DATA_URL} alt="Balmain" className="w-full h-full object-contain rounded-full" />
      </div>
    );
  }
  if (n.includes("victoria's secret") || n.includes('victorias secret')) {
    return (
      <div className={`${sizeClass} rounded-full bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-400 flex items-center justify-center text-white font-serif font-black shrink-0 text-[9px] shadow-2xs border border-pink-300/40`}>
        VS
      </div>
    );
  }
  if (n.includes("l'oréal") || n.includes('loreal')) {
    return (
      <div className={`${sizeClass} rounded-full bg-neutral-950 border border-amber-500/80 flex items-center justify-center text-[#f3ca52] font-serif font-black shrink-0 text-[8px] shadow-2xs`}>
        L'O
      </div>
    );
  }
  if (n.includes('carolina herrera')) {
    return (
      <div className={`${sizeClass} rounded-full bg-[#faf9f6] border border-slate-200 flex items-center justify-center text-neutral-900 font-serif font-black shrink-0 text-[8.5px] shadow-2xs`}>
        CH
      </div>
    );
  }
  if (n.includes('richemont')) {
    return (
      <div className={`${sizeClass} rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-white font-sans font-black shrink-0 text-[7px] shadow-2xs`}>
        RICH
      </div>
    );
  }
  if (n.includes('gucci')) {
    return (
      <div className={`${sizeClass} rounded-full bg-neutral-900 border border-[#156d41] flex items-center justify-center text-[#e5c158] font-serif font-black shrink-0 text-[8.5px] shadow-2xs relative overflow-hidden`}>
        <div className="absolute inset-y-0 left-1/3 right-1/3 bg-[#b5262c] opacity-30" />
        <span className="relative">GG</span>
      </div>
    );
  }
  if (n.includes('versace')) {
    return (
      <div className={`${sizeClass} rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-500 border border-amber-300/40 flex items-center justify-center text-white font-serif font-black shrink-0 text-[9.5px] shadow-2xs`}>
        V
      </div>
    );
  }
  if (n.includes('balenciaga')) {
    return (
      <div className={`${sizeClass} rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white font-mono font-black shrink-0 text-[8px] shadow-2xs`}>
        BB
      </div>
    );
  }
  if (n.includes('louis vuitton') || n.includes('vuitton')) {
    return (
      <div className={`${sizeClass} rounded-full bg-[#4a3b32] border border-[#c29c5a]/70 flex items-center justify-center text-[#e3be85] font-serif font-black shrink-0 text-[8.5px] shadow-2xs`}>
        LV
      </div>
    );
  }
  if (n.includes('saint laurent') || n.includes('ysl')) {
    return (
      <div className={`${sizeClass} rounded-full bg-neutral-950 border border-amber-400/30 flex items-center justify-center text-[#d5af66] font-serif font-black shrink-0 text-[7.5px] shadow-2xs`}>
        YSL
      </div>
    );
  }
  if (n.includes('hermès') || n.includes('hermes')) {
    return (
      <div className={`${sizeClass} rounded-full bg-[#f37021] flex items-center justify-center text-white font-serif font-black shrink-0 text-[9.5px] shadow-2xs border border-orange-400/30`}>
        H
      </div>
    );
  }
  if (n.includes('couture elite') || n.includes('couture')) {
    return (
      <div className={`${sizeClass} rounded-full bg-slate-900 border border-amber-500/40 flex items-center justify-center shrink-0 p-0.5 overflow-hidden shadow-2xs`}>
        <img src={COUTURE_ELITE_LOGO_DATA_URL} alt="Couture Elite" className="w-full h-full object-cover rounded-full" />
      </div>
    );
  }

  return (
    <div className={`${sizeClass} rounded-full bg-pink-100 text-pink-700 flex items-center justify-center text-[10px] font-black shrink-0`}>
      🏛️
    </div>
  );
};

export const BOUTIQUE_CATALOG_ITEMS: BoutiqueCatalogItem[] = [
  // 1. Balmain Paris Paloma Elsesser
  {
    id: 'boutique-balmain-1',
    name: "Tacones de Pasarela 'Balmain B-Glamour'",
    category: 'alas',
    tag: 'Calzado de Pasarela y Lujo 👠',
    boutiqueHouse: 'Balmain Paris Paloma Elsesser',
    boutiqueCity: 'París, Francia',
    description: 'Tacones joya con monograma PB de Balmain Paris y cristales Swarovski para apertura de desfile.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80',
    priceCoins: 85000,
    priceEur: 850,
    endorsedBy: 'Paloma Elsesser',
    rating: 4.8,
    isExclusive: true,
  },
  // 2. Victoria's Secret Spain
  {
    id: 'boutique-vs-1',
    name: "Bikini 'Pink Paradise' & Alas de Gala",
    category: 'alas',
    tag: 'Pódium Logo Oficial & Gala Verano 🌸',
    boutiqueHouse: "Victoria's Secret Spain",
    boutiqueCity: 'Madrid, España',
    description: 'Sponsor oficial de lencería de gala y pasarela de verano con acabados en seda y microfibra rosada.',
    image: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=600&q=80',
    priceCoins: 89900,
    priceEur: 899,
    endorsedBy: "Victoria's Secret Angels",
    rating: 4.9,
    isExclusive: true,
  },
  // 3. L'Oréal Group
  {
    id: 'boutique-loreal-1',
    name: "Pintalabios Color Riche Gold Edition",
    category: 'perfumes',
    tag: 'Casting Live Product Ads - Maquillaje 💄',
    boutiqueHouse: "L'Oréal Group",
    boutiqueCity: 'Madrid, España',
    description: 'Pintalabios hidratante de larga duración y pigmento intenso para directos y transmisiones VIP.',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
    priceCoins: 19900,
    priceEur: 199,
    endorsedBy: "L'Oréal Paris",
    rating: 4.8,
  },
  // 4. Carolina Herrera España
  {
    id: 'boutique-ch-1',
    name: "Vestido de Noche 'Good Girl' Imperial",
    category: 'lenceria',
    tag: 'Sponsor de Pasarela de Alta Costura 👑',
    boutiqueHouse: 'Carolina Herrera España',
    boutiqueCity: 'Madrid, España',
    description: 'Impresionante vestido de gala en rojo imperial Carolina Herrera con escote estructurado y drapeado de seda.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    priceCoins: 49900,
    priceEur: 499,
    endorsedBy: 'Carolina Herrera',
    rating: 5.0,
    isExclusive: true,
  },
  // 5. Richemont
  {
    id: 'boutique-richemont-1',
    name: "Reloj 'Grand Chrono' Oro Rosa 18K",
    category: 'joyeria',
    tag: 'Relojería de Lujo 🇨🇭',
    boutiqueHouse: 'Richemont',
    boutiqueCity: 'Barcelona, España',
    description: 'Exclusivo reloj suizo de alta precisión con caja de oro rosa, cristal de zafiro y correa de piel de caimán.',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=600&q=80',
    priceCoins: 85000,
    priceEur: 850,
    endorsedBy: 'Richemont Haute Horlogerie',
    rating: 5.0,
    isExclusive: true,
  },
  // 6. Gucci Boutique Pasarela
  {
    id: 'boutique-gucci-1',
    name: "Bolso 'Jackie 1961' en Piel Aterciopelada",
    category: 'joyeria',
    tag: 'Sponsor Oficial Alta Costura Italiana 🇮🇹',
    boutiqueHouse: 'Gucci Boutique Pasarela',
    boutiqueCity: 'Florencia, Italia',
    description: 'Bolso estructurado de mano con cierre de pistón dorado y acabados en piel italiana genuina.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    priceCoins: 240000,
    priceEur: 2400,
    endorsedBy: 'Gucci Runway',
    rating: 5.0,
    isExclusive: true,
  },
  // 7. Versace Milano Haute Couture
  {
    id: 'boutique-versace-1',
    name: "Vestido de Pasarela 'Safety Pin Medusa'",
    category: 'lenceria',
    tag: 'Sponsor Oficial Pasarela Medusa & Glamour 👑',
    boutiqueHouse: 'Versace Milano Haute Couture',
    boutiqueCity: 'Milán, Italia',
    description: 'Vestido negro entallado de seda con aberturas laterales unidas por imperdibles dorados Medusa.',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    priceCoins: 320000,
    priceEur: 3200,
    endorsedBy: 'Versace Milano',
    rating: 5.0,
    isExclusive: true,
  },
  // 8. Balenciaga Runway Exclusive
  {
    id: 'boutique-balen-1',
    name: "Bolso 'Hourglass' en Piel Box con B Metálica",
    category: 'joyeria',
    tag: 'Sponsor Vanguardia & Moda Urbana de Lujo 🖤',
    boutiqueHouse: 'Balenciaga Runway Exclusive',
    boutiqueCity: 'París, Francia',
    description: 'Icónica silueta curvilínea con cierre magnético en forma de B metálica en tono plateado pulido.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    priceCoins: 215000,
    priceEur: 2150,
    endorsedBy: 'Balenciaga Runway',
    rating: 4.9,
    isExclusive: true,
  },
  // 9. Louis Vuitton Maison Paris
  {
    id: 'boutique-lv-1',
    name: "Bolso 'Speedy Bandoulière 25' Monogram",
    category: 'joyeria',
    tag: 'Sponsor Oficial Marroquinería y Monograma 🇫🇷',
    boutiqueHouse: 'Louis Vuitton Maison Paris',
    boutiqueCity: 'París, Francia',
    description: 'Lona Monogram clásica con ribetes de piel de vaca natural y candado dorado grabado con firma LV.',
    image: 'https://images.unsplash.com/photo-1513094735237-8f2714d57c13?auto=format&fit=crop&w=600&q=80',
    priceCoins: 155000,
    priceEur: 1550,
    endorsedBy: 'Louis Vuitton Paris',
    rating: 5.0,
    isExclusive: true,
  },
  // 10. Yves Saint Laurent Haute Couture
  {
    id: 'boutique-ysl-1',
    name: "Chaqueta Smoking 'Le Smoking' de Gala",
    category: 'lenceria',
    tag: 'Sponsor Oficial Elegancia Nocturna y Fragancias 🖤',
    boutiqueHouse: 'Yves Saint Laurent Haute Couture',
    boutiqueCity: 'París, Francia',
    description: 'Sastrería clásica en grano de pólvora de lana con solapas en satén de seda brillante para noche.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    priceCoins: 289000,
    priceEur: 2890,
    endorsedBy: 'Yves Saint Laurent',
    rating: 5.0,
    isExclusive: true,
  },
  // 11. Hermès Paris Luxury
  {
    id: 'boutique-hermes-1',
    name: "Pañuelo 'Carré 90' Seda Pura Estampada",
    category: 'lenceria',
    tag: 'Sponsor Oficial Cuero Artesanal & Carrés de Seda 🐎',
    boutiqueHouse: 'Hermès Paris Luxury',
    boutiqueCity: 'París, Francia',
    description: 'Seda 100% hilada y estampada a mano por los artesanos de Lyon con motivos ecuestres icónicos.',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80',
    priceCoins: 49500,
    priceEur: 495,
    endorsedBy: 'Hermès Paris',
    rating: 5.0,
    isExclusive: true,
  },
  // 12. Couture Elite Boutique
  {
    id: 'boutique-ce-1',
    name: 'Alas "Victoria Golden Wings 24K"',
    category: 'alas',
    tag: 'Pódium Pasarela VIP & Alas de Oro 💎',
    boutiqueHouse: 'Couture Elite Boutique',
    boutiqueCity: 'Milán, Italia',
    description: 'Alas bañadas en pan de oro de 24K con plumas artesanales de seda, portadas en el desfile estelar de pasarela.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    priceCoins: 100000,
    priceEur: 1000,
    endorsedBy: 'Adriana Lima',
    rating: 4.6,
    isExclusive: true,
  },
];

export interface ChannelGiftItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  category?: 'basico' | 'intermedio' | 'lujo' | 'alta_costura';
  isExclusive?: boolean;
}

export interface UserGiftItem {
  id: string;
  senderName: string;
  senderUsername: string;
  senderAvatar: string;
  receiverName: string;
  receiverUsername: string;
  receiverAvatar: string;
  giftName: string;
  giftIcon: string;
  price: number;
  euroCost: number;
  message: string;
  dateFormatted: string;
  timestamp: number;
  status: 'confirmed' | 'delivered';
  isExclusive?: boolean;
  category?: 'basico' | 'intermedio' | 'lujo' | 'alta_costura';
}

const RECEIVED_GIFTS_STORAGE_KEY = 'ff_received_gifts_v3';
const SENT_GIFTS_STORAGE_KEY = 'ff_sent_gifts_v3';

const INITIAL_RECEIVED_GIFTS: UserGiftItem[] = [
  // --- ACTUALES (Última semana: ≤ 7 días) ---
  {
    id: 'rec-1',
    senderName: 'Adriana Lima',
    senderUsername: 'adrianalima_w1',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Reloj de oro 18K',
    giftIcon: '⌚',
    price: 5000,
    euroCost: 5000,
    message: '¡Para mi mecenas de honor en Fashion Finances! Gracias por impulsar la pasarela de alta costura y mis castings de París. ✨👑',
    dateFormatted: 'Hoy • 14:30',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // Hace 2 horas
    status: 'confirmed',
    isExclusive: true,
    category: 'lujo'
  },
  {
    id: 'rec-2',
    senderName: 'Candice Swanepoel',
    senderUsername: 'candice_vs',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Collar diamantes',
    giftIcon: '💎',
    price: 2500,
    euroCost: 2500,
    message: 'Un detalle brillante para un seguidor excepcional. ¡Nos vemos en el próximo desfile de Milán! 💖',
    dateFormatted: 'Ayer • 19:15',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // Hace 1 día
    status: 'confirmed',
    isExclusive: true,
    category: 'lujo'
  },
  {
    id: 'rec-3',
    senderName: "Victoria's Secret Spain",
    senderUsername: 'victoriassecret_spain',
    senderAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Certificado prof.',
    giftIcon: '📜',
    price: 500,
    euroCost: 500,
    message: 'Certificación oficial de Membresía VIP otorgada por el Comité de Dirección de Pasarela Fashion Finances.',
    dateFormatted: 'Hace 2 días • 11:00',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // Hace 2 días
    status: 'confirmed',
    category: 'intermedio'
  },
  {
    id: 'rec-4',
    senderName: 'Alessandra Ambrosio',
    senderUsername: 'alessandra_ambrosio',
    senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Ramo de rosas',
    giftIcon: '💐',
    price: 20,
    euroCost: 20,
    message: '¡Muchísimas gracias por tus votos en el ranking de hoy! Besos desde Milán 🌹✨',
    dateFormatted: 'Hace 3 días • 18:40',
    timestamp: Date.now() - 1000 * 60 * 60 * 72, // Hace 3 días
    status: 'confirmed',
    category: 'basico'
  },
  {
    id: 'rec-5',
    senderName: 'Gisele Bündchen',
    senderUsername: 'gisele_official',
    senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Cena de lujo',
    giftIcon: '🍽️',
    price: 250,
    euroCost: 250,
    message: 'Invitación VIP a la mesa privada de patrocinadores tras el desfile internacional. 🥂',
    dateFormatted: 'Hace 4 días • 21:00',
    timestamp: Date.now() - 1000 * 60 * 60 * 96, // Hace 4 días
    status: 'confirmed',
    category: 'intermedio'
  },
  {
    id: 'rec-6',
    senderName: 'Investor Fund Global',
    senderUsername: 'investor_fund',
    senderAvatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Billetes dólares',
    giftIcon: '💵',
    price: 300,
    euroCost: 300,
    message: 'Bonificación institucional por alta fidelidad e interacción en transmisiones en vivo de la temporada.',
    dateFormatted: 'Hace 5 días • 16:20',
    timestamp: Date.now() - 1000 * 60 * 60 * 120, // Hace 5 días
    status: 'confirmed',
    category: 'intermedio'
  },
  {
    id: 'rec-6b',
    senderName: 'Gigi Hadid',
    senderUsername: 'gigihadid',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Corona Reina Runway',
    giftIcon: '👑',
    price: 4500,
    euroCost: 4500,
    message: 'Una tiara de alta joyería para conmemorar tu patrocinio histórico en Nueva York. ¡Inolvidable! 💫',
    dateFormatted: 'Hace 5 días • 19:45',
    timestamp: Date.now() - 1000 * 60 * 60 * 130, // Hace 5.4 días
    status: 'confirmed',
    isExclusive: true,
    category: 'lujo'
  },
  {
    id: 'rec-6c',
    senderName: 'Karlie Kloss',
    senderUsername: 'karliekloss',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Gafas de Sol VIP Gold',
    giftIcon: '🕶️',
    price: 350,
    euroCost: 350,
    message: 'Edición limitada Runway Fashion. Gracias por seguir de cerca mis proyectos de innovación y moda.',
    dateFormatted: 'Hace 6 días • 13:10',
    timestamp: Date.now() - 1000 * 60 * 60 * 144, // Hace 6 días
    status: 'confirmed',
    category: 'intermedio'
  },

  // --- RECIENTES (Último mes: 8 a 30 días) ---
  {
    id: 'rec-7',
    senderName: 'Stella Maxwell',
    senderUsername: 'stellamaxwell',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Bolso Haute Couture',
    giftIcon: '👜',
    price: 3000,
    euroCost: 3000,
    message: 'Un bolso de pasarela exclusivo para ti por acompañarme en el shooting de Londres.',
    dateFormatted: '05 ago 2026 • 16:45',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 12, // Hace 12 días
    status: 'confirmed',
    isExclusive: true,
    category: 'lujo'
  },
  {
    id: 'rec-8',
    senderName: 'Sara Sampaio',
    senderUsername: 'sarasampaio',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Perfume Floral Rose',
    giftIcon: '🧴',
    price: 200,
    euroCost: 200,
    message: 'Edición limitada de perfume con esencia de rosas. ¡Muchas gracias por tu constante apoyo!',
    dateFormatted: '31 jul 2026 • 19:10',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 17, // Hace 17 días
    status: 'confirmed',
    category: 'intermedio'
  },
  {
    id: 'rec-9',
    senderName: 'Taylor Hill',
    senderUsername: 'taylor_hill',
    senderAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Token de Oro Especial',
    giftIcon: '🪙',
    price: 1000,
    euroCost: 1000,
    message: 'Token especial de agradecimiento por votar en la gala de verano Fashion Week.',
    dateFormatted: '25 jul 2026 • 20:30',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 23, // Hace 23 días
    status: 'confirmed',
    category: 'intermedio'
  },
  {
    id: 'rec-9b',
    senderName: 'Irina Shayk',
    senderUsername: 'irinashayk',
    senderAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Anillo Esmeralda Imperial',
    giftIcon: '💍',
    price: 3800,
    euroCost: 3800,
    message: 'Esmeralda de talla brillante para un mecenas con verdadero gusto refinado.',
    dateFormatted: '20 jul 2026 • 18:00',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 27, // Hace 27 días
    status: 'confirmed',
    isExclusive: true,
    category: 'lujo'
  },
  {
    id: 'rec-9c',
    senderName: 'Elsa Hosk',
    senderUsername: 'elsahosk',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Zapatillas Diamante',
    giftIcon: '👠',
    price: 1500,
    euroCost: 1500,
    message: 'Calzado joya de alta costura escandinava directo de la semana de la moda en Estocolmo.',
    dateFormatted: '18 jul 2026 • 15:30',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 29, // Hace 29 días
    status: 'confirmed',
    category: 'lujo'
  },

  // --- ANTIGUOS (Más de un mes: > 30 días) ---
  {
    id: 'rec-10',
    senderName: 'Adriana Lima',
    senderUsername: 'adrianalima_w1',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Collar de oro 18k',
    giftIcon: '👑',
    price: 1800,
    euroCost: 1800,
    message: 'De mi primera gala anual en el podio. Siempre en el recuerdo como mecenas histórico.',
    dateFormatted: '01 jul 2026 • 15:00',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 47, // Hace 47 días
    status: 'confirmed',
    isExclusive: true,
    category: 'lujo'
  },
  {
    id: 'rec-11',
    senderName: "Victoria's Secret Global",
    senderUsername: 'victoriassecret',
    senderAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Dos Alas de ángel',
    giftIcon: '🪽',
    price: 2,
    euroCost: 2,
    message: 'Insignia de bienvenida a la plataforma oficial de ángeles Fashion Finances.',
    dateFormatted: '15 jun 2026 • 10:00',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 63, // Hace 63 días
    status: 'confirmed',
    category: 'basico'
  },
  {
    id: 'rec-12',
    senderName: 'Romee Strijd',
    senderUsername: 'romeestrijd',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Pulsera',
    giftIcon: '💫',
    price: 800,
    euroCost: 800,
    message: 'Detalle de la inauguración de primavera en el casting de Ámsterdam.',
    dateFormatted: '18 may 2026 • 12:30',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 91, // Hace 91 días
    status: 'confirmed',
    category: 'intermedio'
  },
  {
    id: 'rec-13',
    senderName: 'Heidi Klum',
    senderUsername: 'heidiklum',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Trofeo Golden Angel',
    giftIcon: '🏆',
    price: 2000,
    euroCost: 2000,
    message: 'Galardón honorífico por el apoyo continuo a las nuevas generaciones de modelos.',
    dateFormatted: '02 may 2026 • 19:20',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 105, // Hace 105 días
    status: 'confirmed',
    category: 'lujo'
  },
  {
    id: 'rec-14',
    senderName: 'Bella Hadid',
    senderUsername: 'bellahadid',
    senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Champagne Vintage 1996',
    giftIcon: '🍾',
    price: 600,
    euroCost: 600,
    message: 'Para celebrar tus aportes en la apertura de la temporada de alta costura.',
    dateFormatted: '20 abr 2026 • 22:00',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 118, // Hace 118 días
    status: 'confirmed',
    category: 'intermedio'
  },
  {
    id: 'rec-15',
    senderName: 'Barbara Palvin',
    senderUsername: 'barbarapalvin',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Pañuelo de Seda Hermès',
    giftIcon: '🧣',
    price: 400,
    euroCost: 400,
    message: 'Con cariño desde Budapest y la semana de moda de Milán. ¡Muchas gracias por todo!',
    dateFormatted: '10 abr 2026 • 17:15',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 128, // Hace 128 días
    status: 'confirmed',
    category: 'intermedio'
  },
  {
    id: 'rec-16',
    senderName: 'Miranda Kerr',
    senderUsername: 'mirandakerr',
    senderAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Kit Cosmética Real',
    giftIcon: '💄',
    price: 180,
    euroCost: 180,
    message: 'Edición orgánica exclusiva para nuestros ángeles y mecenas oficiales.',
    dateFormatted: '28 mar 2026 • 14:00',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 141, // Hace 141 días
    status: 'confirmed',
    category: 'basico'
  },
  {
    id: 'rec-17',
    senderName: 'Jasmine Tookes',
    senderUsername: 'jastookes',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    receiverName: 'Ernesto vs',
    receiverUsername: 'ernestovs',
    receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Broche de Zafiro',
    giftIcon: '🧷',
    price: 1200,
    euroCost: 1200,
    message: 'Broche histórico lucido en la gala Fantasy Bra. Una joya para la bóveda.',
    dateFormatted: '15 mar 2026 • 11:30',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 154, // Hace 154 días
    status: 'confirmed',
    isExclusive: true,
    category: 'lujo'
  }
];

const INITIAL_SENT_GIFTS: UserGiftItem[] = [
  // --- ACTUALES (Última semana: ≤ 7 días) ---
  {
    id: 'sent-1',
    senderName: 'Ernesto vs',
    senderUsername: 'ernestovs',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Adriana Lima',
    receiverUsername: 'adrianalima_w1',
    receiverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
    giftName: 'Reloj de oro',
    giftIcon: '⌚',
    price: 5000,
    euroCost: 5000,
    message: '¡Para la mejor modelo y embajadora de la pasarela internacional! Disfruta de este reloj de oro exclusivo. ✨👑',
    dateFormatted: '16 ago 2026 • 10:15',
    timestamp: Date.now() - 1000 * 60 * 60 * 4, // Hace 4 horas
    status: 'delivered',
    isExclusive: true,
    category: 'lujo'
  },
  {
    id: 'sent-2',
    senderName: 'Ernesto vs',
    senderUsername: 'ernestovs',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Candice Swanepoel',
    receiverUsername: 'candice_vs',
    receiverAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    giftName: 'Vestido de gala',
    giftIcon: '👘',
    price: 3000,
    euroCost: 3000,
    message: 'Un diseño sensacional digno de la Reina de la Pasarela. ¡Mucho éxito en el casting internacional! 🌟',
    dateFormatted: '15 ago 2026 • 17:45',
    timestamp: Date.now() - 1000 * 60 * 60 * 22, // Hace 1 día
    status: 'delivered',
    category: 'lujo'
  },
  {
    id: 'sent-3',
    senderName: 'Ernesto vs',
    senderUsername: 'ernestovs',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Alessandra Ambrosio',
    receiverUsername: 'alessandra_ambrosio',
    receiverAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Collar de oro 18k',
    giftIcon: '👑',
    price: 1800,
    euroCost: 1800,
    message: 'Para que brilles aún más en el podio de honor de Fashion Finances. 👑',
    dateFormatted: '14 ago 2026 • 20:10',
    timestamp: Date.now() - 1000 * 60 * 60 * 45, // Hace 2 días
    status: 'delivered',
    isExclusive: true,
    category: 'lujo'
  },
  {
    id: 'sent-4',
    senderName: 'Ernesto vs',
    senderUsername: 'ernestovs',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Barbara Palvin',
    receiverUsername: 'barbarapalvin',
    receiverAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=150',
    giftName: 'Ramo de rosas',
    giftIcon: '💐',
    price: 20,
    euroCost: 20,
    message: 'Felicidades por tu posición en el ranking mensual, ¡gran pasarela! 💐',
    dateFormatted: '13 ago 2026 • 15:30',
    timestamp: Date.now() - 1000 * 60 * 60 * 70, // Hace 3 días
    status: 'delivered',
    category: 'basico'
  },
  {
    id: 'sent-5',
    senderName: 'Ernesto vs',
    senderUsername: 'ernestovs',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Jasmine Tookes',
    receiverUsername: 'jastookes',
    receiverAvatar: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=150',
    giftName: 'Varias estrellas',
    giftIcon: '🌟',
    price: 100,
    euroCost: 100,
    message: 'Voto estrella para tu desfile de hoy en directo. ⭐',
    dateFormatted: '12 ago 2026 • 12:00',
    timestamp: Date.now() - 1000 * 60 * 60 * 95, // Hace 4 días
    status: 'delivered',
    category: 'basico'
  },

  // --- RECIENTES (Último mes: 8 a 30 días) ---
  {
    id: 'sent-6',
    senderName: 'Ernesto vs',
    senderUsername: 'ernestovs',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Sara Sampaio',
    receiverUsername: 'sarasampaio',
    receiverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    giftName: 'Perfume',
    giftIcon: '🧴',
    price: 200,
    euroCost: 200,
    message: 'Un perfume para celebrar tu sesión de fotos en Lisboa. ¡Enhorabuena!',
    dateFormatted: '06 ago 2026 • 18:20',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 11, // Hace 11 días
    status: 'delivered',
    category: 'intermedio'
  },
  {
    id: 'sent-7',
    senderName: 'Ernesto vs',
    senderUsername: 'ernestovs',
    receiverName: 'Taylor Hill',
    receiverUsername: 'taylor_hill',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    receiverAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150',
    giftName: 'Token',
    giftIcon: '🪙',
    price: 1000,
    euroCost: 1000,
    message: 'Token especial para apoyar tu candidatura en el top 5 global.',
    dateFormatted: '01 ago 2026 • 21:00',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 16, // Hace 16 días
    status: 'delivered',
    category: 'intermedio'
  },
  {
    id: 'sent-8',
    senderName: 'Ernesto vs',
    senderUsername: 'ernestovs',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Elsa Hosk',
    receiverUsername: 'hoskelsa',
    receiverAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
    giftName: 'Un viaje',
    giftIcon: '✈️',
    price: 5000,
    euroCost: 5000,
    message: '¡Patrocinio oficial para tu vuelo a la semana de la moda en Nueva York! ✈️✨',
    dateFormatted: '27 jul 2026 • 13:40',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 21, // Hace 21 días
    status: 'delivered',
    isExclusive: true,
    category: 'lujo'
  },

  // --- ANTIGUOS (Más de un mes: > 30 días) ---
  {
    id: 'sent-9',
    senderName: 'Ernesto vs',
    senderUsername: 'ernestovs',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Adriana Lima',
    receiverUsername: 'adrianalima_w1',
    receiverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
    giftName: 'Un coche',
    giftIcon: '🏎️',
    price: 50000,
    euroCost: 50000,
    message: 'Gran regalo de temporada por tu coronación como número 1 en el ranking.',
    dateFormatted: '02 jul 2026 • 19:30',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 46, // Hace 46 días
    status: 'delivered',
    isExclusive: true,
    category: 'lujo'
  },
  {
    id: 'sent-10',
    senderName: 'Ernesto vs',
    senderUsername: 'ernestovs',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    receiverName: 'Alessandra Ambrosio',
    receiverUsername: 'alessandra_ambrosio',
    receiverAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    giftName: 'Dos Alas de ángel',
    giftIcon: '🪽',
    price: 2,
    euroCost: 2,
    message: 'Alas honoríficas en el inicio de la temporada de desfiles.',
    dateFormatted: '10 jun 2026 • 11:15',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 68, // Hace 68 días
    status: 'delivered',
    category: 'basico'
  }
];

const CHANNEL_EXTRA_GIFTS: ChannelGiftItem[] = [
  { id: 'g-1', name: 'Certificado prof.', price: 500, icon: '📜', category: 'intermedio' },
  { id: 'g-2', name: 'Una estrella', price: 50, icon: '⭐', category: 'basico' },
  { id: 'g-3', name: 'Varias estrellas', price: 100, icon: '🌟', category: 'basico' },
  { id: 'g-4', name: 'Billetes dólares', price: 300, icon: '💵', category: 'intermedio' },
  { id: 'g-5', name: 'Reloj de oro', price: 5000, icon: '⌚', category: 'lujo', isExclusive: true },
  { id: 'g-6', name: 'Pulsera', price: 800, icon: '💫', category: 'intermedio' },
  { id: 'g-7', name: 'Token', price: 1000, icon: '🪙', category: 'intermedio' },
  { id: 'g-8', name: 'Rosa roja', price: 10, icon: '🌹', category: 'basico' },
  { id: 'g-9', name: 'Beso', price: 5, icon: '💋', category: 'basico' },
  { id: 'g-10', name: 'Besos', price: 15, icon: '😘', category: 'basico' },
  { id: 'g-11', name: 'Te adoro', price: 5, icon: '🥰', category: 'basico' },
  { id: 'g-12', name: 'Osito', price: 1, icon: '🧸', category: 'basico' },
  { id: 'g-13', name: 'Corazón con lazo', price: 5, icon: '💝', category: 'basico' },
  { id: 'g-14', name: 'Rosa blanca', price: 10, icon: '🤍', category: 'basico' },
  { id: 'g-15', name: 'Café', price: 20, icon: '☕', category: 'basico' },
  { id: 'g-16', name: 'Bolso', price: 3000, icon: '👜', category: 'lujo' },
  { id: 'g-17', name: 'Te amo', price: 2, icon: '❤️', category: 'basico' },
  { id: 'g-18', name: 'Te adoro', price: 1, icon: '💖', category: 'basico' },
  { id: 'g-19', name: 'Corazón blanco', price: 3, icon: '🤍', category: 'basico' },
  { id: 'g-20', name: 'Perfume', price: 200, icon: '🧴', category: 'intermedio' },
  { id: 'g-21', name: 'Collar diamantes', price: 2500, icon: '💎', category: 'lujo' },
  { id: 'g-22', name: 'Collar de oro 18k', price: 1800, icon: '👑', category: 'lujo' },
  { id: 'g-23', name: 'Un viaje', price: 5000, icon: '✈️', category: 'lujo' },
  { id: 'g-24', name: 'Un coche', price: 50000, icon: '🏎️', category: 'alta_costura' },
  { id: 'g-25', name: 'Una casa', price: 100000, icon: '🏰', category: 'alta_costura' },
  { id: 'g-26', name: 'Una copa', price: 5, icon: '🍸', category: 'basico' },
  { id: 'g-27', name: 'Anillo diamantes', price: 3500, icon: '💍', category: 'lujo' },
  { id: 'g-28', name: 'Gafas de moda', price: 400, icon: '🕶️', category: 'intermedio' },
  { id: 'g-29', name: 'Vestido de moda', price: 100, icon: '👗', category: 'intermedio' },
  { id: 'g-30', name: 'Un avión', price: 1000000, icon: '🚀', category: 'alta_costura' },
  { id: 'g-31', name: 'Dos Alas de ángel', price: 2, icon: '🪽', category: 'basico' },
  { id: 'g-32', name: 'Ala de ángel VS', price: 1, icon: '🪽', category: 'basico' },
  { id: 'g-33', name: 'Collar de oro', price: 100, icon: '🟡', category: 'intermedio' },
  { id: 'g-34', name: 'Collar de perlas', price: 80, icon: '🦪', category: 'intermedio' },
  { id: 'g-35', name: 'Vestido de gala', price: 3000, icon: '👘', category: 'lujo' },
  { id: 'g-36', name: 'Zapatos costura', price: 800, icon: '👠', category: 'intermedio' },
  { id: 'g-37', name: 'Ramo de rosas', price: 20, icon: '💐', category: 'basico' },
  { id: 'g-38', name: 'Bolígrafo de oro', price: 10, icon: '✒️', category: 'basico' },
  { id: 'g-39', name: 'Reloj', price: 100000, icon: '⏱️', category: 'alta_costura' },
  { id: 'g-40', name: 'Una moneda de oro', price: 2, icon: '🪙', category: 'basico' },
  { id: 'g-41', name: 'Varias monedas de oro', price: 5, icon: '💰', category: 'basico' },
  { id: 'g-42', name: 'Tesoro de monedas', price: 10, icon: '💎', category: 'basico' },
  { id: 'g-43', name: 'Cena de lujo', price: 250, icon: '🍽️', category: 'intermedio' },
  { id: 'g-44', name: 'Manos juntas', price: 1, icon: '🙏', category: 'basico' },
  { id: 'g-45', name: 'Café', price: 2, icon: '☕', category: 'basico' },
];

const PRESET_FEMALE_VIDEOS = [
  'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-posing-with-a-red-light-40486-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-a-red-light-40158-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-rainy-night-40539-large.mp4'
];

const PRESET_MALE_VIDEOS = [
  'https://assets.mixkit.co/videos/preview/mixkit-man-posing-in-trendy-fashion-clothes-40491-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-man-with-neon-makeup-posing-with-red-light-40490-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-black-and-posing-40495-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-man-with-sunglasses-posing-in-creative-light-40496-large.mp4'
];

interface PodiumModelMediaProps {
  model: ModelProfile;
  place: 1 | 2 | 3;
  widthClass: string;
  heightClass: string;
  borderColorClass: string;
  defaultVideoIndex: number;
  roundedClass?: string;
  hideBadges?: boolean;
}

function PodiumModelMedia({
  model,
  place,
  widthClass,
  heightClass,
  borderColorClass,
  defaultVideoIndex,
  roundedClass = "rounded-[24px]",
  hideBadges = false
}: PodiumModelMediaProps) {
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isMale = (model as any)?.gender === 'male';

  // Sync with custom video uploaded in settings drawer
  const [customVideo, setCustomVideo] = useState<string>(() => {
    try {
      const modelKey = model?.id ? localStorage.getItem(`custom_model_video_${model.id}`) : null;
      const userKey = model?.username ? localStorage.getItem(`custom_model_video_${model.username.toLowerCase()}`) : null;
      const isAdriana = !isMale && (model?.name?.toLowerCase().includes('adriana') || model?.username?.toLowerCase().includes('adriana'));
      const adrianaKey = isAdriana ? localStorage.getItem('custom_model_video_adrianalima') : null;
      const globalKey = place === 1 
        ? (isMale 
            ? localStorage.getItem('coll_custom_ranking_video_male') 
            : (localStorage.getItem('coll_custom_ranking_video_female') || localStorage.getItem('coll_custom_ranking_video')))
        : null;
      let candidate = modelKey || userKey || adrianaKey || globalKey || '';
      if (isMale) {
        const femaleGlobal = localStorage.getItem('coll_custom_ranking_video');
        const femaleAdriana = localStorage.getItem('custom_model_video_adrianalima');
        if (candidate && (
          (femaleGlobal && candidate === femaleGlobal) ||
          (femaleAdriana && candidate === femaleAdriana) ||
          candidate.toLowerCase().includes('adrianalima')
        )) {
          return '';
        }
      }
      return candidate;
    } catch (e) {
      return '';
    }
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const modelKey = model?.id ? localStorage.getItem(`custom_model_video_${model.id}`) : null;
        const userKey = model?.username ? localStorage.getItem(`custom_model_video_${model.username.toLowerCase()}`) : null;
        const isAdriana = !isMale && (model?.name?.toLowerCase().includes('adriana') || model?.username?.toLowerCase().includes('adriana'));
        const adrianaKey = isAdriana ? localStorage.getItem('custom_model_video_adrianalima') : null;
        const globalKey = place === 1 
          ? (isMale 
              ? localStorage.getItem('coll_custom_ranking_video_male') 
              : (localStorage.getItem('coll_custom_ranking_video_female') || localStorage.getItem('coll_custom_ranking_video')))
          : null;
        let nextVid = modelKey || userKey || adrianaKey || globalKey || '';
        if (isMale) {
          const femaleGlobal = localStorage.getItem('coll_custom_ranking_video');
          const femaleAdriana = localStorage.getItem('custom_model_video_adrianalima');
          if (nextVid && (
            (femaleGlobal && nextVid === femaleGlobal) ||
            (femaleAdriana && nextVid === femaleAdriana) ||
            nextVid.toLowerCase().includes('adrianalima')
          )) {
            nextVid = '';
          }
        }
        setCustomVideo(nextVid);
        setVideoError(false);
      } catch (e) {}
    };

    window.addEventListener('ranking_videos_updated', handleSync);
    window.addEventListener('ranking_video_changed', handleSync);
    return () => {
      window.removeEventListener('ranking_videos_updated', handleSync);
      window.removeEventListener('ranking_video_changed', handleSync);
    };
  }, [model?.id, model?.username, model?.videoUrl, model?.name, place, isMale]);

  let safeModelVideoUrl = model?.videoUrl;
  if (isMale && safeModelVideoUrl) {
    const femaleGlobal = typeof window !== 'undefined' ? localStorage.getItem('coll_custom_ranking_video') : null;
    const femaleAdriana = typeof window !== 'undefined' ? localStorage.getItem('custom_model_video_adrianalima') : null;
    if (
      (femaleGlobal && safeModelVideoUrl === femaleGlobal) ||
      (femaleAdriana && safeModelVideoUrl === femaleAdriana) ||
      safeModelVideoUrl.toLowerCase().includes('adrianalima')
    ) {
      safeModelVideoUrl = undefined;
    }
  }

  const videoSrc = customVideo || safeModelVideoUrl || (isMale 
    ? PRESET_MALE_VIDEOS[defaultVideoIndex % PRESET_MALE_VIDEOS.length] 
    : PRESET_FEMALE_VIDEOS[defaultVideoIndex % PRESET_FEMALE_VIDEOS.length]);

  useEffect(() => {
    setVideoError(false);
  }, [videoSrc]);

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={`${widthClass} ${heightClass} ${roundedClass} overflow-hidden border-[1px] ${borderColorClass} shadow-xl bg-slate-950 p-0 relative z-10 group/podium-media`}>
      <div className={`w-full h-full ${roundedClass} overflow-hidden relative bg-slate-900`}>
        {!videoError ? (
          <video
            ref={videoRef}
            key={videoSrc}
            src={videoSrc}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover group-hover/podium-media:scale-105 transition-transform duration-500"
          />
        ) : (
          <img
            src={model?.avatar}
            alt={model?.name || 'Modelo'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover/podium-media:scale-105 transition-transform duration-500"
          />
        )}

        {/* 🟢 EN LÍNEA badge overlay top center */}
        {!hideBadges && (
          <div className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 z-25 pointer-events-none">
            <span className="bg-emerald-600/95 text-white font-sans font-black text-[7.5px] sm:text-[8.5px] px-2.5 py-0.5 rounded-md tracking-wider animate-pulse shadow-md border border-white/40 backdrop-blur-xs flex items-center gap-1 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              EN LÍNEA
            </span>
          </div>
        )}

        {/* Highlight glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Audio control toggle on hover */}
        <div className="absolute bottom-6 left-2.5 z-30 opacity-0 group-hover/podium-media:opacity-100 transition-opacity duration-200 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="bg-black/80 hover:bg-black text-white p-1.5 rounded-full border border-white/30 shadow-lg cursor-pointer flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            title={isMuted ? "Activar audio" : "Silenciar"}
          >
            {isMuted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
          </button>
        </div>
      </div>
    </div>
  );
}

interface VictoriaSecretRankingProps {
  isOpen: boolean;
  onClose: () => void;
  models: ModelProfile[];
  onSelectModel?: (model: ModelProfile) => void;
  onNavigateToStore?: (storeId: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export default function VictoriaSecretRanking({
  isOpen,
  onClose,
  models,
  onSelectModel,
  onNavigateToStore,
  onNavigateToTab,
}: VictoriaSecretRankingProps) {
  const [activeTab, setActiveTab] = useState<'ranking' | 'premios' | 'hall_of_fame' | 'regalos'>('ranking');
  const [rankingSearchQuery, setRankingSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [sponsorCount, setSponsorCount] = useState<1 | 2 | 3>(3);

  // Gifts view state & tabs
  const [giftsSubTab, setGiftsSubTab] = useState<'received' | 'sent' | 'catalog'>('received');
  const [userGiftBalance, setUserGiftBalance] = useState<number>(2473);
  const [giftCategoryFilter, setGiftCategoryFilter] = useState<'all' | 'basico' | 'intermedio' | 'lujo' | 'alta_costura'>('all');
  const [giftSearchQuery, setGiftSearchQuery] = useState<string>('');
  
  // Received & Sent gifts state with localStorage persistence
  const [receivedGifts, setReceivedGifts] = useState<UserGiftItem[]>(() => {
    try {
      const stored = localStorage.getItem(RECEIVED_GIFTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge to ensure all vault gifts from different users are available
          const existingIds = new Set(parsed.map((g: any) => g.id));
          const missing = INITIAL_RECEIVED_GIFTS.filter(g => !existingIds.has(g.id));
          return [...parsed, ...missing];
        }
      }
    } catch (e) {
      console.error("Error loading received gifts:", e);
    }
    return INITIAL_RECEIVED_GIFTS;
  });

  const [sentGifts, setSentGifts] = useState<UserGiftItem[]>(() => {
    try {
      const stored = localStorage.getItem(SENT_GIFTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error loading sent gifts:", e);
    }
    return INITIAL_SENT_GIFTS;
  });

  const [receivedSearchQuery, setReceivedSearchQuery] = useState<string>('');
  const [receivedCategoryFilter, setReceivedCategoryFilter] = useState<'all' | 'basico' | 'intermedio' | 'lujo'>('all');
  
  const [sentSearchQuery, setSentSearchQuery] = useState<string>('');
  const [sentCategoryFilter, setSentCategoryFilter] = useState<'all' | 'basico' | 'intermedio' | 'lujo'>('all');

  // Vault specific states (Slider/Grid/Dense view, Inspector toggle, Sort order)
  const [vaultViewMode, setVaultViewMode] = useState<'slider' | 'grid' | 'dense'>('slider');
  const [showVaultInspector, setShowVaultInspector] = useState<boolean>(false);
  const [vaultSortOrder, setVaultSortOrder] = useState<'recent' | 'value_desc' | 'value_asc' | 'donor'>('recent');

  // Slider controls & ref
  const giftSliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  // Mouse drag support for slider
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleSliderMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    if (giftSliderRef.current) {
      startXRef.current = e.pageX - giftSliderRef.current.offsetLeft;
      scrollLeftRef.current = giftSliderRef.current.scrollLeft;
    }
  };

  const handleSliderMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleSliderMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !giftSliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - giftSliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    giftSliderRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const scrollGiftSlider = (direction: 'left' | 'right') => {
    if (giftSliderRef.current) {
      const scrollOffset = giftSliderRef.current.clientWidth * 0.75;
      giftSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollOffset : scrollOffset,
        behavior: 'smooth'
      });
    }
  };

  const handleSliderScroll = () => {
    if (giftSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = giftSliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Time filter: all (Bóveda completa), Actuales (≤ 7 days), Recientes (8 to 30 days), Antiguos (> 30 days)
  const [giftTimeFilter, setGiftTimeFilter] = useState<'all' | 'actuales' | 'recientes' | 'antiguos'>('all');

  // Recalculate slider boundaries whenever filter/data changes
  useEffect(() => {
    if (vaultViewMode === 'slider' && giftSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = giftSliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, [vaultViewMode, giftTimeFilter, receivedCategoryFilter, receivedSearchQuery, vaultSortOrder, receivedGifts.length]);

  const isGiftInTimePeriod = (timestamp: number, filter: 'all' | 'actuales' | 'recientes' | 'antiguos') => {
    if (filter === 'all') return true;
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
    const age = Date.now() - timestamp;
    if (filter === 'actuales') {
      return age <= ONE_WEEK_MS; // Regalos de la última semana (≤ 7 días)
    }
    if (filter === 'recientes') {
      return age > ONE_WEEK_MS && age <= ONE_MONTH_MS; // Regalos del último mes (8 a 30 días)
    }
    if (filter === 'antiguos') {
      return age > ONE_MONTH_MS; // Regalos de más de un mes (> 30 días)
    }
    return true;
  };

  const handleSimulateIncomingGift = () => {
    const simulationPool = [
      {
        senderName: 'Naomi Campbell',
        senderUsername: 'naomicampbell',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        giftName: 'Corona Imperial 18K',
        giftIcon: '👑',
        price: 6000,
        euroCost: 6000,
        message: 'Un reconocimiento a tu elegancia y patrocinio exclusivo en la pasarela internacional. Custódialo con honor. ✨',
        category: 'lujo' as const,
        isExclusive: true
      },
      {
        senderName: 'Kendall Jenner',
        senderUsername: 'kendalljenner',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
        giftName: 'Gafas de Sol VIP Gold',
        giftIcon: '🕶️',
        price: 850,
        euroCost: 850,
        message: '¡Gracias por apoyar mis transmisiones en vivo y el backstage! Nos vemos en NY Fashion Week.',
        category: 'intermedio' as const
      },
      {
        senderName: 'Doutzen Kroes',
        senderUsername: 'doutzen',
        senderAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
        giftName: 'Gargantilla Perlas del Mar',
        giftIcon: '🦪',
        price: 2200,
        euroCost: 2200,
        message: 'Una pieza única de orfebrería para guardar en la bóveda de honor. ¡Eres un mecenas inolvidable! 💎',
        category: 'lujo' as const,
        isExclusive: true
      },
      {
        senderName: 'Bella Hadid',
        senderUsername: 'bellahadid',
        senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
        giftName: 'Champagne Vintage 1996',
        giftIcon: '🍾',
        price: 750,
        euroCost: 750,
        message: 'Para brindar por todos los éxitos compartidos en Fashion Finances. ¡Salud y estilo de pasarela! 🥂',
        category: 'intermedio' as const
      },
      {
        senderName: 'Cindy Crawford',
        senderUsername: 'cindycrawford',
        senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
        giftName: 'Trofeo Leyenda Runway',
        giftIcon: '🏆',
        price: 5000,
        euroCost: 5000,
        message: 'Distinción honorífica directa a la bóveda por tu incondicional apoyo a la alta costura. 💫',
        category: 'lujo' as const,
        isExclusive: true
      }
    ];

    const pick = simulationPool[Math.floor(Math.random() * simulationPool.length)];
    const newGift: UserGiftItem = {
      id: `rec-sim-${Date.now()}`,
      senderName: pick.senderName,
      senderUsername: pick.senderUsername,
      senderAvatar: pick.senderAvatar,
      receiverName: 'Ernesto vs',
      receiverUsername: 'ernestovs',
      receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      giftName: pick.giftName,
      giftIcon: pick.giftIcon,
      price: pick.price,
      euroCost: pick.euroCost,
      message: pick.message,
      dateFormatted: 'Hoy • Hace un instante',
      timestamp: Date.now(),
      status: 'confirmed',
      isExclusive: pick.isExclusive,
      category: pick.category
    };

    setReceivedGifts(prev => [newGift, ...prev]);
    setSelectedShowcaseGiftId(newGift.id);
    setSentGiftToast({
      name: newGift.giftName,
      icon: newGift.giftIcon,
      price: newGift.price,
      recipientName: `Bóveda (de ${newGift.senderName})`
    });
    window.dispatchEvent(new CustomEvent('trigger-heart-rain', { detail: { icon: newGift.giftIcon } }));
  };

  const [sentGiftToast, setSentGiftToast] = useState<{ name: string; icon: string; price: number; recipientName?: string } | null>(null);
  const [thankYouToast, setThankYouToast] = useState<{ senderName: string; giftName: string } | null>(null);
  const [showLuxuryWatchModal, setShowLuxuryWatchModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [showGenericGiftModal, setShowGenericGiftModal] = useState<boolean>(false);
  const [selectedGenericModalGift, setSelectedGenericModalGift] = useState<any>(null);
  const [selectedShowcaseGiftId, setSelectedShowcaseGiftId] = useState<string>('g-1');
  const [activeModalGift, setActiveModalGift] = useState<UserGiftItem | null>(null);
  const [watchTickAngle, setWatchTickAngle] = useState<number>(0);

  // Modal for composing a personalized gift dedication
  const [selectedGiftToDedicate, setSelectedGiftToDedicate] = useState<ChannelGiftItem | null>(null);
  const [customDedicationMsg, setCustomDedicationMsg] = useState<string>('');
  const [recipientModelId, setRecipientModelId] = useState<string>('topf-1');
  const [recipientSearchQuery, setRecipientSearchQuery] = useState<string>('');
  const [showRecipientDropdown, setShowRecipientDropdown] = useState<boolean>(false);
  const recipientDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close recipient search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutsideRecipient(event: MouseEvent) {
      if (recipientDropdownRef.current && !recipientDropdownRef.current.contains(event.target as Node)) {
        setShowRecipientDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutsideRecipient);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideRecipient);
    };
  }, []);

  // Watch ticking animation effect for inspection
  useEffect(() => {
    const timer = setInterval(() => {
      setWatchTickAngle(prev => (prev + 6) % 360);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(RECEIVED_GIFTS_STORAGE_KEY, JSON.stringify(receivedGifts));
    } catch (e) {
      console.error(e);
    }
  }, [receivedGifts]);

  // Sync external updates (such as opening luxury watch animation from profile)
  useEffect(() => {
    const handleGiftsUpdate = (e: any) => {
      try {
        const stored = localStorage.getItem(RECEIVED_GIFTS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReceivedGifts(parsed);
          }
        } else if (e?.detail && Array.isArray(e.detail)) {
          setReceivedGifts(e.detail);
        }
      } catch (err) {
        console.error("Error updating received gifts from event:", err);
      }
    };

    window.addEventListener('ff-received-gifts-updated', handleGiftsUpdate);
    window.addEventListener('luxury-watch-opened', handleGiftsUpdate);
    window.addEventListener('storage', handleGiftsUpdate);

    return () => {
      window.removeEventListener('ff-received-gifts-updated', handleGiftsUpdate);
      window.removeEventListener('luxury-watch-opened', handleGiftsUpdate);
      window.removeEventListener('storage', handleGiftsUpdate);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SENT_GIFTS_STORAGE_KEY, JSON.stringify(sentGifts));
    } catch (e) {
      console.error(e);
    }
  }, [sentGifts]);

  // Resolve current active featured showcase gift data
  const currentFeaturedGift = (() => {
    // 1. Check if selectedShowcaseGiftId matches an extra channel gift by ID or name
    const catalogItem = CHANNEL_EXTRA_GIFTS.find(g => 
      g.id === selectedShowcaseGiftId || 
      g.name.toLowerCase() === selectedShowcaseGiftId.toLowerCase()
    );

    if (catalogItem) {
      const isCertificate = catalogItem.name.toLowerCase().includes('certificado');
      const isWatch = catalogItem.name.toLowerCase().includes('reloj');
      const isBills = catalogItem.name.toLowerCase().includes('billetes') || catalogItem.name.toLowerCase().includes('dólares');
      const isDiamonds = catalogItem.name.toLowerCase().includes('collar') || catalogItem.name.toLowerCase().includes('diamantes') || catalogItem.name.toLowerCase().includes('anillo');
      const isStar = catalogItem.name.toLowerCase().includes('estrella');

      return {
        id: catalogItem.id,
        name: catalogItem.name,
        icon: catalogItem.icon,
        price: catalogItem.price,
        euroCost: catalogItem.price,
        isExclusive: catalogItem.isExclusive || isCertificate || isWatch,
        category: catalogItem.category || (isCertificate ? 'intermedio' : 'lujo'),
        isCertificate,
        isWatch,
        isBills,
        isDiamonds,
        isStar,
        senderName: 'Ernesto vs',
        senderUsername: 'ernestovs',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        receiverName: models.find(m => m.id === recipientModelId)?.name || 'Adriana Lima',
        receiverUsername: models.find(m => m.id === recipientModelId)?.username || 'adrianalima_w1',
        receiverAvatar: models.find(m => m.id === recipientModelId)?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
        badgeText: isCertificate ? '18K SEAL • 500€' : isWatch ? '18K GOLD • 5.000€' : isBills ? 'CASH PATRON • 300€' : `${catalogItem.price}€ OFICIAL VIP`,
        message: isCertificate 
          ? '¡Certificado profesional oficial de Alta Costura y Pasarela Internacional otorgado por el Comité de Dirección de Fashion Finances! Disfruta de esta acreditación de honor. 📜✨'
          : isWatch 
          ? '¡Para la mejor modelo y embajadora de la pasarela internacional! Disfruta de este reloj de oro exclusivo. ✨👑'
          : isBills 
          ? '¡Fondo de patrocinio y liquidez para producciones de casting y sesiones exclusivas de pasarela! 💵✨'
          : `¡Regalo exclusivo de ${catalogItem.name} para impulsar tu pasarela en Fashion Finances! 💖✨`,
        dateFormatted: '16 ago 2026'
      };
    }

    // 2. Check in received gifts
    const recItem = receivedGifts.find(g => 
      g.id === selectedShowcaseGiftId || 
      g.giftName.toLowerCase() === selectedShowcaseGiftId.toLowerCase()
    );

    if (recItem) {
      const isCertificate = recItem.giftName.toLowerCase().includes('certificado');
      const isWatch = recItem.giftName.toLowerCase().includes('reloj');
      const isBills = recItem.giftName.toLowerCase().includes('billetes') || recItem.giftName.toLowerCase().includes('dólares');
      const isDiamonds = recItem.giftName.toLowerCase().includes('collar') || recItem.giftName.toLowerCase().includes('diamantes');
      const isStar = recItem.giftName.toLowerCase().includes('estrella');

      return {
        id: recItem.id,
        name: recItem.giftName,
        icon: recItem.giftIcon,
        price: recItem.price,
        euroCost: recItem.euroCost,
        isExclusive: recItem.isExclusive || isCertificate || isWatch,
        category: recItem.category || 'lujo',
        isCertificate,
        isWatch,
        isBills,
        isDiamonds,
        isStar,
        senderName: recItem.senderName,
        senderUsername: recItem.senderUsername,
        senderAvatar: recItem.senderAvatar,
        receiverName: recItem.receiverName,
        receiverUsername: recItem.receiverUsername,
        receiverAvatar: recItem.receiverAvatar,
        badgeText: isCertificate ? '18K SEAL • 500€' : isWatch ? '18K GOLD • 5.000€' : `${recItem.euroCost}€ OFICIAL VIP`,
        message: recItem.message,
        dateFormatted: recItem.dateFormatted
      };
    }

    // 3. Fallback: Certificado profesional
    return {
      id: 'g-1',
      name: 'Certificado prof.',
      icon: '📜',
      price: 500,
      euroCost: 500,
      isExclusive: true,
      category: 'intermedio',
      isCertificate: true,
      isWatch: false,
      isBills: false,
      isDiamonds: false,
      isStar: false,
      senderName: 'Ernesto vs',
      senderUsername: 'ernestovs',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      receiverName: 'Adriana Lima',
      receiverUsername: 'adrianalima_w1',
      receiverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
      badgeText: '18K SEAL • 500€',
      message: '¡Certificado profesional oficial de Alta Costura y Pasarela Internacional otorgado por el Comité de Dirección de Fashion Finances! Disfruta de esta acreditación de honor. 📜✨',
      dateFormatted: '16 ago 2026'
    };
  })();

  const handleSendGift = (gift: ChannelGiftItem, customMessage?: string, targetModel?: ModelProfile) => {
    if (userGiftBalance < gift.price) {
      alert(`⚠️ Saldo insuficiente (${userGiftBalance} monedas). Necesitas ${gift.price} monedas para enviar "${gift.name}". Puedes recargar monedas abajo.`);
      return;
    }

    const recipient = targetModel || models.find(m => m.id === recipientModelId) || models[0] || {
      id: 'topf-1',
      name: 'Adriana Lima',
      username: 'adrianalima_w1',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650'
    };

    const newSentItem: UserGiftItem = {
      id: `sent-${Date.now()}`,
      senderName: 'Ernesto vs',
      senderUsername: 'ernestovs',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      receiverName: recipient.name,
      receiverUsername: recipient.username || recipient.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      receiverAvatar: recipient.avatar,
      giftName: gift.name,
      giftIcon: gift.icon,
      price: gift.price,
      euroCost: gift.price,
      message: customMessage || `¡Para ${recipient.name}! Disfruta de este detalle especial en la pasarela Fashion Finances. ✨`,
      dateFormatted: 'Ahora mismo',
      timestamp: Date.now(),
      status: 'delivered',
      isExclusive: gift.isExclusive,
      category: gift.category
    };

    const newReceivedItem: UserGiftItem = {
      id: `rec-gift-${Date.now()}`,
      senderName: 'Ernesto vs',
      senderUsername: 'ernestovs',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      receiverName: recipient.name,
      receiverUsername: recipient.username || recipient.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
      receiverAvatar: recipient.avatar,
      giftName: gift.name,
      giftIcon: gift.icon,
      price: gift.price,
      euroCost: gift.price,
      message: customMessage || `¡Regalo especial "${gift.name}" recibido! 🎉💖`,
      dateFormatted: 'Ahora mismo',
      timestamp: Date.now(),
      status: 'delivered',
      isExclusive: gift.isExclusive,
      category: gift.category
    };

    setUserGiftBalance(prev => prev - gift.price);
    setSentGifts(prev => [newSentItem, ...prev]);
    setReceivedGifts(prev => [newReceivedItem, ...prev]);
    setSentGiftToast({ name: gift.name, icon: gift.icon, price: gift.price, recipientName: recipient.name });

    // Deduct from Back Office (coll_userProfile) and register financial movement
    try {
      const rawUser = localStorage.getItem('coll_userProfile');
      if (rawUser) {
        const user = JSON.parse(rawUser);
        user.balance = Math.max(0, Number(((user.balance || 0) - gift.price).toFixed(2)));
        user.totalInvested = Number(((user.totalInvested || 0) + gift.price).toFixed(2));
        localStorage.setItem('coll_userProfile', JSON.stringify(user));
        window.dispatchEvent(new CustomEvent('user-profile-updated', { detail: user }));
        window.dispatchEvent(new CustomEvent('wallet-updated', { detail: { newBalance: user.balance } }));
      }

      const rawMovements = localStorage.getItem('coll_movements');
      const movements = rawMovements ? JSON.parse(rawMovements) : [];
      movements.unshift({
        id: `mov-gift-${Date.now()}`,
        userId: 'user-investor',
        type: 'investment',
        amount: -gift.price,
        date: new Date().toISOString(),
        description: `Regalo "${gift.name}" enviado a ${recipient.name} (Victoria's Secret Channel)`
      });
      localStorage.setItem('coll_movements', JSON.stringify(movements));
      window.dispatchEvent(new CustomEvent('movements-updated', { detail: movements }));

      // Update received gifts storage
      const rawReceivedGifts = localStorage.getItem(RECEIVED_GIFTS_STORAGE_KEY);
      const allReceived = rawReceivedGifts ? JSON.parse(rawReceivedGifts) : [];
      allReceived.unshift(newReceivedItem);
      localStorage.setItem(RECEIVED_GIFTS_STORAGE_KEY, JSON.stringify(allReceived));
      window.dispatchEvent(new CustomEvent('ff-received-gifts-updated', { detail: allReceived }));

      // Update model profile and notifications
      const rawModels = localStorage.getItem('coll_models');
      if (rawModels) {
        const modelsList = JSON.parse(rawModels);
        if (Array.isArray(modelsList)) {
          const mIdx = modelsList.findIndex((m: any) => m.id === recipient.id || m.name === recipient.name);
          if (mIdx !== -1) {
            modelsList[mIdx].totalEarnings = Number(((modelsList[mIdx].totalEarnings || 0) + gift.price).toFixed(2));
            modelsList[mIdx].earnings = Number(((modelsList[mIdx].earnings || 0) + gift.price).toFixed(2));
            modelsList[mIdx].donationsReceived = (modelsList[mIdx].donationsReceived || 0) + 1;
            localStorage.setItem('coll_models', JSON.stringify(modelsList));
            window.dispatchEvent(new CustomEvent('models-updated'));
          }
        }
      }

      const rawNotifs = localStorage.getItem('coll_notifications');
      const notifs = rawNotifs ? JSON.parse(rawNotifs) : [];
      notifs.unshift({
        id: `notif-${Date.now()}`,
        type: 'gift',
        title: `¡Has recibido un regalo de Ernesto vs!`,
        message: `Ernesto vs te ha enviado "${gift.name}" (${gift.price}€). ${customMessage ? `Mensaje: "${customMessage}"` : ''}`,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        timestamp: Date.now(),
        read: false,
        data: { gift, amount: gift.price }
      });
      localStorage.setItem('coll_notifications', JSON.stringify(notifs));
    } catch (e) {
      console.error(e);
    }

    // Trigger visual celebration banner & particle rain
    window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
      detail: {
        icon: gift.icon || '🎁',
        name: gift.name,
        cost: gift.price,
        recipientName: recipient.name,
        senderName: 'Ernesto vs'
      }
    }));

    setTimeout(() => {
      setSentGiftToast(null);
    }, 4000);
  };

  const handleThankSender = (gift: UserGiftItem) => {
    setThankYouToast({ senderName: gift.senderName, giftName: gift.giftName });
    window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
      detail: { icon: '💖' }
    }));
    setTimeout(() => {
      setThankYouToast(null);
    }, 3500);
  };

  const handleViewCertificateLarge = () => {
    // 1. Abrir el modal en grande del certificado
    setShowCertificateModal(true);

    // 2. Establecer el filtro de período en "Actuales" para que quede seleccionado
    setGiftTimeFilter('actuales');

    // 3. Almacenar/actualizar el certificado en la lista de regalos recibidos con fecha actual (período Actuales ≤ 7 días)
    const now = Date.now();
    const certificateGiftItem: UserGiftItem = {
      id: 'rec-3',
      senderName: "Victoria's Secret Spain",
      senderUsername: 'victoriassecret_spain',
      senderAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150',
      receiverName: 'Ernesto vs',
      receiverUsername: 'ernestovs',
      receiverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      giftName: 'Certificado prof.',
      giftIcon: '📜',
      price: 500,
      euroCost: 500,
      message: 'Certificación oficial de Membresía VIP otorgada por el Comité de Dirección de Pasarela Fashion Finances.',
      dateFormatted: '18 ago 2026 • 10:00',
      timestamp: now,
      status: 'confirmed',
      category: 'intermedio'
    };

    setReceivedGifts(prev => {
      const filtered = prev.filter(g => g.id !== 'rec-3' && !g.giftName.toLowerCase().includes('certificado'));
      const updated = [certificateGiftItem, ...filtered];
      try {
        localStorage.setItem(RECEIVED_GIFTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    // 4. Notificación visual de confirmación de guardado en "Actuales"
    setSentGiftToast({
      name: 'Certificado prof.',
      icon: '📜',
      price: 500,
      recipientName: 'Guardado en período "Actuales"'
    });

    setTimeout(() => {
      setSentGiftToast(null);
    }, 3500);

    // 5. Animación de celebración
    window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
      detail: { icon: '📜' }
    }));
  };

  // Retrieve and sort top 3 models by likes/popularity descending
  const sortedModels = [...models]
    .sort((a, b) => (b.totalLikes || 0) - (a.totalLikes || 0))
    .slice(0, 3);

  // Map them into standard podium positions: [2nd, 1st, 3rd]
  const secondPlace = sortedModels[1] || sortedModels[0];
  const firstPlace = sortedModels[0];
  const thirdPlace = sortedModels[2] || sortedModels[1] || sortedModels[0];

  // Pick a legendary model: search for Adriana Lima (who is #1) or fallback to first place
  const legendModel = models.find(m => m.name.toLowerCase().includes('lima')) || firstPlace;

  // Estado para elevar la tarjeta del podio (Candice Swanepoel o Alessandra Ambrosio) por encima de Adriana Lima al hacer clic o hover
  const [elevatedPodiumPlace, setElevatedPodiumPlace] = useState<number | null>(null);

  // Master sorted list of exactly 100 items (Hooks declared at the top before any early return)
  const masterSortedRanking = React.useMemo(() => {
    const list = [...models].sort((a, b) => (b.totalLikes || 0) - (a.totalLikes || 0));
    
    // If we have less than 100, fill it up to exactly 100
    while (list.length < 100) {
      const i = list.length;
      const isFemale = i % 2 === 0;
      const id = `extra-model-${i}`;
      const name = isFemale 
        ? [`Lucía Fernández`, `Martina Silva`, `Sofía Martínez`, `Elena Gómez`, `Valeria Vega`, `Carla Ruiz`, `Julia Díaz`, `Natalia Sanz`, `Alba Castro`, `Paula Gil`][i % 10] + ` ${i}`
        : [`Diego Torres`, `Mateo Ruiz`, `Lucas Castro`, `Tomás Ortiz`, `Bruno Silva`, `Leo Navarro`, `Hugo Ramos`, `Marcos Sanz`, `Álvaro Cruz`, `Mario León`][i % 10] + ` ${i}`;
      const username = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const likes = Math.max(100, Math.floor((list[list.length - 1]?.totalLikes || 500) * 0.985) - (i % 5));
      list.push({
        id,
        name,
        username,
        avatar: `https://images.unsplash.com/photo-${[
          '1534528741775-53994a69daeb', '1507003211169-0a1dd7228f2d', '1494790108377-be9c29b29330', 
          '1506794778202-cad84cf45f1d', '1517841905240-472988babdf9', '1539571696357-5a69c17a67c6',
          '1524504388940-b1c1722653e1', '1488161628813-04466f872be2', '1501196354995-cbb51c65aaea',
          '1529139574466-a303027c1d8b'
        ][i % 10]}?auto=format&fit=crop&q=80&w=150`,
        bio: 'Creador/a de contenido y entusiasta de la moda de alta costura.',
        totalLikes: likes,
        followersCount: likes * 3,
        referidosCount: Math.floor(likes / 50),
        socials: { instagram: `@${username}` },
        isOnline: i % 4 === 0,
        photos: [],
        gender: isFemale ? 'female' : 'male'
      } as any);
    }

    // Keep it fully sorted
    return list.sort((a, b) => (b.totalLikes || 0) - (a.totalLikes || 0));
  }, [models]);

  // Set of female names for precise gender filtering
  const FEMALE_NAMES = React.useMemo(() => new Set([
    'Adriana Lima', 'Alessandra Ambrosio', 'Candice Swanepoel', 'Jasmine Tookes', 'Miranda Kerr',
    'Gisele Bündchen', 'Behati Prinsloo', 'Lily Aldridge', 'Elsa Hosk', 'Romee Strijd',
    'Sara Sampaio', 'Taylor Hill', 'Josephine Skriver', 'Lais Ribeiro', 'Stella Maxwell',
    'Martha Hunt', 'Barbara Palvin', 'Grace Elizabeth', 'Leomie Anderson', 'Alexina Graham',
    'Tyra Banks', 'Heidi Klum', 'Karolína Kurková', 'Doutzen Kroes', 'Marisa Miller',
    'Rosie Huntington-Whiteley', 'Izabel Goulart', 'Selita Ebanks', 'Daniela Peštová', 'Helena Christensen',
    'Laetitia Casta', 'Karen Mulder', 'Stephanie Seymour', 'Inés Rivero', 'Chanel Iman',
    'Erin Heatherton', 'Lindsay Ellingson', 'Jac Jagaciak', 'Kate Grigorieva', 'Bella Hadid',
    'Gigi Hadid', 'Joan Smalls', 'Anok Yai', 'Paloma Elsesser', 'Alex Consani',
    'Yumi Nu', 'Irina Shayk', 'Sui He', 'Toni Garrn', 'Constance Jablonski'
  ]), []);

  // Filtered list based on search and gender
  const filteredRankings = React.useMemo(() => {
    return masterSortedRanking.filter(model => {
      // 1. Search Query
      const matchesSearch = 
        model.name.toLowerCase().includes(rankingSearchQuery.toLowerCase()) ||
        model.username.toLowerCase().includes(rankingSearchQuery.toLowerCase()) ||
        (model.alias && model.alias.toLowerCase().includes(rankingSearchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // 2. Gender Filter
      if (genderFilter === 'all') return true;
      
      const isFemale = 
        (model as any).gender === 'female' || 
        model.id.startsWith('topf-') || 
        FEMALE_NAMES.has(model.name) || 
        (model.id.startsWith('extra-model-') && (parseInt(model.id.split('-')[2]) % 2 === 0));
      
      if (genderFilter === 'female') {
        return isFemale;
      } else {
        return !isFemale;
      }
    });
  }, [masterSortedRanking, rankingSearchQuery, genderFilter, FEMALE_NAMES]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#fdf2f8]/80 backdrop-blur-xl overflow-y-auto p-2 sm:p-4 md:p-6 animate-fade-in font-sans">
      
      {/* Glamorous Luxury Backdrop with soft pink satin ribbons and lighting matching image.png */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fff7f9] via-[#fff0f4] to-white pointer-events-none" />
      
      {/* Decorative diagonal silk ribbon overlays matching image.png */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-pink-300/40 via-rose-300/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gradient-to-tl from-pink-300/40 via-rose-300/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Diagonal satin ribbons as seen in image.png */}
      <div className="absolute top-1/4 -left-20 w-[600px] h-32 bg-gradient-to-r from-pink-400/20 via-pink-300/40 to-transparent rotate-[-25deg] pointer-events-none blur-sm" />
      <div className="absolute top-1/3 -right-20 w-[600px] h-32 bg-gradient-to-l from-pink-400/20 via-pink-300/40 to-transparent rotate-[-25deg] pointer-events-none blur-sm" />

      {/* Main Container */}
      <div className="bg-white/95 border border-pink-100/80 rounded-[36px] w-full max-w-[1280px] overflow-hidden shadow-[0_25px_80px_rgba(219,39,119,0.18)] relative text-slate-800 my-auto flex flex-col max-h-[96vh] animate-scale-up">
        
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-white/80 hover:bg-pink-100 border border-pink-200 text-slate-600 hover:text-pink-600 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
          title="Cerrar ranking"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable container */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto no-scrollbar relative z-10">
          
          {activeTab !== 'ranking' && (
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <button
                onClick={() => setActiveTab('ranking')}
                className="bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-600 font-extrabold text-xs px-4 py-2 rounded-full border border-pink-200 shadow-xs cursor-pointer inline-flex items-center gap-1.5 transition"
              >
                <span>‹</span> VOLVER AL RANKING
              </button>
            </div>
          )}

          {activeTab === 'ranking' && (
            <>
              {/* 🌟 1. TOP HEADER: FASHION FINANCES (LEFT) & BEAUTY CREATES OPPORTUNITIES (RIGHT) */}
              <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pt-2 pb-6 sm:pb-8 px-2 select-none">
                {/* Left Brand: FASHION FINANCES with 3D Golden Diamond */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="flex items-center gap-1.5 text-amber-500 mb-0.5">
                    <svg className="w-10 h-8 drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]" viewBox="0 0 40 32" fill="none">
                      <path d="M12 2L2 12L20 30L38 12L28 2H12Z" fill="url(#goldHeaderDia)" stroke="#d97706" strokeWidth="1.2" strokeLinejoin="round" />
                      <path d="M12 2L20 12L28 2" stroke="#fef08a" strokeWidth="1.2" />
                      <path d="M2 12H38" stroke="#fef08a" strokeWidth="1.2" />
                      <path d="M20 12L20 30" stroke="#fef08a" strokeWidth="1.2" />
                      <path d="M12 2L20 30L28 2" stroke="#b45309" strokeWidth="0.8" opacity="0.6" />
                      <defs>
                        <linearGradient id="goldHeaderDia" x1="0" y1="0" x2="40" y2="32" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#fef08a" />
                          <stop offset="0.4" stopColor="#f59e0b" />
                          <stop offset="1" stopColor="#92400e" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-[0.22em] text-slate-900 uppercase leading-none">
                    FASHION
                  </h1>
                  <div className="flex items-center gap-2 my-1.5 w-full max-w-[210px]">
                    <span className="h-[1px] flex-1 bg-slate-300" />
                    <span className="text-[11px] sm:text-xs font-serif font-bold tracking-[0.35em] text-slate-800 uppercase">
                      FINANCES
                    </span>
                    <span className="h-[1px] flex-1 bg-slate-300" />
                  </div>
                  <span className="text-[9px] font-sans font-bold tracking-[0.3em] text-[#b45309] uppercase">
                    MODELS × FASHION × FINANCE
                  </span>
                </div>

                {/* Right Slogan: BEAUTY CREATES OPPORTUNITIES */}
                <div className="flex flex-col items-center sm:items-end text-center sm:text-right pt-0.5">
                  <span className="font-serif italic text-4xl sm:text-5xl font-bold text-[#e11d48] tracking-tight leading-none drop-shadow-xs">
                    Beauty
                  </span>
                  <span className="text-[9.5px] font-sans font-black tracking-[0.3em] text-slate-900 uppercase leading-tight mt-1">
                    CREATES
                  </span>
                  <div className="relative inline-block mt-0.5">
                    <span className="text-base sm:text-lg font-sans font-bold tracking-[0.18em] text-[#e11d48] uppercase leading-none block">
                      OPPORTUNITIES
                    </span>
                    <div className="w-36 sm:w-40 h-[1.5px] bg-gradient-to-r from-transparent via-[#d97706] to-[#b45309] mt-1 ml-auto rounded-full" />
                  </div>
                </div>
              </div>

              {/* 🏆 THE COUTURE PODIUM (Exact Match to image.png with generous breathing room) */}
              {firstPlace && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 items-end max-w-5xl mx-auto pt-28 sm:pt-40 md:pt-48 pb-4 px-2 mt-6 sm:mt-10">
                  
                  {/* RANKING #2 : ALESSANDRA AMBROSIO (LEFT) */}
                  {secondPlace && (
                    <div 
                      onClick={() => setElevatedPodiumPlace(prev => prev === 2 ? null : 2)}
                      onMouseEnter={() => setElevatedPodiumPlace(2)}
                      onMouseLeave={() => setElevatedPodiumPlace(prev => prev === 2 ? null : prev)}
                      className={`flex flex-col items-center order-2 md:order-1 group transition-all duration-300 relative cursor-pointer ${
                        elevatedPodiumPlace === 2 ? 'z-50' : 'z-10 hover:z-50'
                      }`}
                    >
                      
                      {/* Photo / Video Card Container */}
                      <div 
                        className={`w-64 sm:w-72 h-[350px] sm:h-[380px] rounded-[30px] overflow-hidden border-2 shadow-xl bg-slate-950 relative group/card transition-all duration-300 ${
                          elevatedPodiumPlace === 2 
                            ? 'z-50 scale-105 border-pink-400 shadow-[0_25px_60px_rgba(219,39,119,0.5)] translate-x-3 sm:translate-x-5' 
                            : 'z-10 hover:z-50 hover:scale-105 hover:border-pink-400 hover:shadow-[0_25px_60px_rgba(219,39,119,0.5)] hover:translate-x-3 sm:hover:translate-x-5 border-white/90'
                        }`}
                      >
                        {/* Top-left pill: EN LÍNEA */}
                        <div className="absolute top-3 left-3 z-30 bg-[#e11d48] text-white font-bold text-[9px] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs" />
                          <span>EN LÍNEA</span>
                        </div>

                        {/* Top-right heart button */}
                        <button 
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-3 right-3 z-30 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 border border-white/40 shadow-md backdrop-blur-md transition cursor-pointer"
                          title="Me gusta"
                        >
                          <Heart className="w-4 h-4 fill-white/20 stroke-white" />
                        </button>

                        {/* Media component */}
                        <PodiumModelMedia
                          model={secondPlace}
                          place={2}
                          widthClass="w-full"
                          heightClass="h-full"
                          borderColorClass="border-transparent"
                          defaultVideoIndex={1}
                          roundedClass="rounded-[30px]"
                          hideBadges={true}
                        />

                        {/* Bottom overlay over photo */}
                        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-12 pb-4 px-4 text-left">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-serif font-bold text-base leading-tight">
                                Alessandra
                              </h4>
                              <h4 className="text-white font-serif font-bold text-base leading-tight">
                                Ambrosio
                              </h4>
                            </div>
                            <span className="text-white/80 text-xl font-light">☆</span>
                          </div>
                          <div className="text-white/90 font-medium text-[11px] sm:text-xs flex items-center gap-1 mt-1">
                            <span className="text-[#ec4899]">💖</span> 14.682 votos
                          </div>
                        </div>
                      </div>

                      {/* White Pedestal Column 2 */}
                      <div className="w-full max-w-[270px] bg-white border border-pink-100 rounded-[26px] shadow-lg p-5 flex flex-col items-center justify-center text-center mt-3.5">
                        <span className="text-[#b45309] font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 font-sans mb-1">
                          👑 MODELO ORO
                        </span>
                        <span className="font-serif text-5xl sm:text-6xl font-black text-slate-900 my-0.5 leading-none">
                          2
                        </span>
                        <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-medium tracking-[0.2em] uppercase my-1 font-sans">
                          <span className="w-6 h-[1px] bg-slate-300" />
                          <span>ANGEL ELITE</span>
                          <span className="w-6 h-[1px] bg-slate-300" />
                        </div>
                        <button
                          onClick={() => onSelectModel && onSelectModel(secondPlace)}
                          className="border border-[#f472b6] hover:border-pink-500 text-slate-800 rounded-full py-2 px-7 text-xs font-bold uppercase tracking-wider hover:bg-pink-50/70 transition-all shadow-xs mt-3 cursor-pointer inline-flex items-center gap-1.5"
                        >
                          VER FICHA <span>›</span>
                        </button>
                      </div>

                    </div>
                  )}

                  {/* RANKING #1 : ADRIANA LIMA (CENTER - DIAMOND CHAMPION) */}
                  {firstPlace && (
                    <div 
                      onClick={() => setElevatedPodiumPlace(1)}
                      className={`flex flex-col items-center order-1 md:order-2 group transition-all duration-300 hover:-translate-y-2 relative ${
                        elevatedPodiumPlace === 3 || elevatedPodiumPlace === 2 ? 'z-20' : 'z-30'
                      }`}
                    >
                      
                      {/* Photo / Video Card Container with Golden Frame & Royal Tiara from z.png */}
                      <div className="relative mb-2 flex flex-col items-center">
                        
                        {/* Corona Real Femenina de Diamantes y Rubíes (Separada con espacio flotante del marco amarillo) */}
                        <div 
                          style={{ bottom: 'calc(100% + 22px)' }}
                          className="absolute left-1/2 -translate-x-1/2 z-40 transition duration-500 group-hover:scale-105 pointer-events-none drop-shadow-[0_12px_28px_rgba(225,29,72,0.35)]"
                        >
                          <RoyalFemaleCrown 
                            imgClassName="w-36 sm:w-44 md:w-48 h-auto"
                          />
                        </div>

                        {/* Golden Metallic Double-Frame Container */}
                        <div className="w-72 sm:w-80 md:w-[310px] h-[390px] sm:h-[430px] rounded-[34px] p-1 bg-gradient-to-b from-[#fef08a] via-[#f59e0b] to-[#b45309] shadow-[0_0_40px_rgba(245,158,11,0.55)] relative z-30">
                          <div className="w-full h-full rounded-[30px] overflow-hidden bg-black relative border-2 border-amber-300 flex flex-col justify-between">
                            
                            {/* Top-left pill: EN LÍNEA */}
                            <div className="absolute top-3 left-3 z-30 bg-[#e11d48] text-white font-bold text-[9px] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md uppercase tracking-wider">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs" />
                              <span>EN LÍNEA</span>
                            </div>

                            {/* Top-right heart button */}
                            <button 
                              type="button"
                              onClick={(e) => e.stopPropagation()}
                              className="absolute top-3 right-3 z-30 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 border border-white/40 shadow-md backdrop-blur-md transition cursor-pointer"
                              title="Me gusta"
                            >
                              <Heart className="w-4 h-4 fill-white/20 stroke-white" />
                            </button>

                            {/* Media component */}
                            <PodiumModelMedia
                              model={firstPlace}
                              place={1}
                              widthClass="w-full"
                              heightClass="h-full"
                              borderColorClass="border-transparent"
                              defaultVideoIndex={0}
                              roundedClass="rounded-[30px]"
                              hideBadges={true}
                            />

                            {/* Bottom overlay inside card: Contoured arched banner with pink diamond at apex */}
                            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center pb-3 pt-8 bg-gradient-to-t from-black via-black/85 to-transparent">
                              {/* Pink diamond apex badge */}
                              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#ec4899] via-[#f43f5e] to-[#ec4899] border border-white p-1 flex items-center justify-center shadow-lg -mb-3 z-30">
                                <span className="text-[12px] leading-none text-white">💎</span>
                              </div>

                              {/* Curved banner */}
                              <div className="w-[92%] bg-gradient-to-b from-[#181512]/90 to-black/95 rounded-t-2xl pt-4 pb-2 px-4 border-t border-pink-400/50 text-center">
                                <div className="text-white font-serif font-bold text-base sm:text-lg flex items-center justify-center gap-1.5">
                                  <span>Adriana Lima</span>
                                  <span className="text-amber-400 text-sm">★</span>
                                </div>
                                <div className="text-white/95 font-medium text-xs flex items-center justify-center gap-1.5 mt-1">
                                  <span className="text-[#ec4899]">💖</span> 99.999 votos
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>

                      </div>

                      {/* Pedestal Column 1: Rounded card with golden metallic border */}
                      <div className="w-full max-w-[310px] bg-gradient-to-b from-[#181512] via-[#111113] to-black border-2 border-amber-400 rounded-[28px] p-5 flex flex-col items-center justify-center text-center shadow-2xl ring-1 ring-amber-300/40 relative mt-3.5 z-20 overflow-hidden box-border">
                        <div className="flex items-center justify-center gap-2 text-amber-300 font-sans font-bold text-[10.5px] uppercase tracking-[0.25em] drop-shadow-sm mb-1">
                          <span className="w-5 h-[1px] bg-amber-400/60" />
                          <span>MODELO DIAMANTE</span>
                          <span className="w-5 h-[1px] bg-amber-400/60" />
                        </div>

                        {/* Laurel Wreath & Number 1 flanked with diamonds */}
                        <div className="flex items-center justify-center my-1 relative">
                          <span className="text-sm text-amber-300 absolute left-8 top-3">💎</span>
                          
                          {/* Left Laurel */}
                          <svg className="w-9 h-14 sm:w-11 sm:h-16 text-[#dfb152] drop-shadow-[0_2px_6px_rgba(223,177,82,0.4)]" viewBox="0 0 45 75" fill="currentColor">
                            <path d="M38 70 C24 60, 14 42, 16 12 C18 22, 26 30, 32 34 C22 36, 16 44, 20 54 C26 58, 32 60, 38 70 Z" opacity="0.35" />
                            <path d="M 36,65 C 28,56 20,44 20,28 C 20,18 25,10 32,3 C 27,8 14,20 16,34 C 17,46 25,57 36,65 Z" />
                            <path d="M26,18 C18,15 11,20 9,27 C14,29 23,25 26,18 Z" />
                            <path d="M22,32 C14,31 8,37 7,44 C13,45 21,40 22,32 Z" />
                            <path d="M25,48 C18,49 13,56 13,62 C19,62 25,56 25,48 Z" />
                            <path d="M31,9 C25,5 18,7 15,13 C20,15 28,13 31,9 Z" />
                          </svg>

                          <span className="font-serif font-black text-6xl text-amber-200 leading-none px-2 relative z-10 drop-shadow-[0_2px_15px_rgba(251,191,36,0.6)]">
                            1
                          </span>

                          {/* Right Laurel */}
                          <svg className="w-9 h-14 sm:w-11 sm:h-16 text-[#dfb152] drop-shadow-[0_2px_6px_rgba(223,177,82,0.4)] -scale-x-100" viewBox="0 0 45 75" fill="currentColor">
                            <path d="M38 70 C24 60, 14 42, 16 12 C18 22, 26 30, 32 34 C22 36, 16 44, 20 54 C26 58, 32 60, 38 70 Z" opacity="0.35" />
                            <path d="M 36,65 C 28,56 20,44 20,28 C 20,18 25,10 32,3 C 27,8 14,20 16,34 C 17,46 25,57 36,65 Z" />
                            <path d="M26,18 C18,15 11,20 9,27 C14,29 23,25 26,18 Z" />
                            <path d="M22,32 C14,31 8,37 7,44 C13,45 21,40 22,32 Z" />
                            <path d="M25,48 C18,49 13,56 13,62 C19,62 25,56 25,48 Z" />
                            <path d="M31,9 C25,5 18,7 15,13 C20,15 28,13 31,9 Z" />
                          </svg>

                          <span className="text-sm text-amber-300 absolute right-8 top-3">💎</span>
                        </div>

                        <div className="text-amber-100/90 font-mono text-[10px] uppercase tracking-[0.28em] font-bold my-1">
                          DIAMOND ANGEL
                        </div>

                        {/* Hot Pink / Magenta Pill Button: SUPERESTRELLA > (perfectamente centrado y dentro del marco) */}
                        <div className="w-full flex justify-center mt-3.5">
                          <button
                            onClick={() => onSelectModel && onSelectModel(firstPlace)}
                            className="w-full max-w-[220px] bg-gradient-to-r from-[#d946ef] via-[#e11d48] to-[#f43f5e] hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 rounded-full shadow-lg shadow-pink-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-white/30"
                          >
                            <span>SUPERESTRELLA</span>
                            <span className="text-sm leading-none font-bold">›</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* RANKING #3 : CANDICE SWANEPOEL (RIGHT) */}
                  {thirdPlace && (
                    <div 
                      onClick={() => setElevatedPodiumPlace(prev => prev === 3 ? null : 3)}
                      onMouseEnter={() => setElevatedPodiumPlace(3)}
                      onMouseLeave={() => setElevatedPodiumPlace(prev => prev === 3 ? null : prev)}
                      className={`flex flex-col items-center order-3 group transition-all duration-300 relative cursor-pointer ${
                        elevatedPodiumPlace === 3 ? 'z-50' : 'z-10 hover:z-50'
                      }`}
                    >
                      
                      {/* Photo / Video Card Container */}
                      <div 
                        className={`w-64 sm:w-72 h-[350px] sm:h-[380px] rounded-[30px] overflow-hidden border-2 shadow-xl bg-slate-950 relative group/card transition-all duration-300 ${
                          elevatedPodiumPlace === 3 
                            ? 'z-50 scale-105 border-pink-400 shadow-[0_25px_60px_rgba(219,39,119,0.5)] -translate-x-3 sm:-translate-x-5' 
                            : 'z-10 hover:z-50 hover:scale-105 hover:border-pink-400 hover:shadow-[0_25px_60px_rgba(219,39,119,0.5)] hover:-translate-x-3 sm:hover:-translate-x-5 border-white/90'
                        }`}
                      >
                        {/* Top-left pill: EN LÍNEA */}
                        <div className="absolute top-3 left-3 z-30 bg-[#e11d48] text-white font-bold text-[9px] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md uppercase tracking-wider">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs" />
                          <span>EN LÍNEA</span>
                        </div>

                        {/* Top-right heart button */}
                        <button 
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-3 right-3 z-30 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 border border-white/40 shadow-md backdrop-blur-md transition cursor-pointer"
                          title="Me gusta"
                        >
                          <Heart className="w-4 h-4 fill-white/20 stroke-white" />
                        </button>

                        {/* Media component */}
                        <PodiumModelMedia
                          model={thirdPlace}
                          place={3}
                          widthClass="w-full"
                          heightClass="h-full"
                          borderColorClass="border-transparent"
                          defaultVideoIndex={2}
                          roundedClass="rounded-[30px]"
                          hideBadges={true}
                        />

                        {/* Bottom overlay over photo */}
                        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/75 to-transparent pt-12 pb-4 px-4 text-left">
                          <div className="flex items-center justify-between">
                            <h4 className="text-white font-serif font-bold text-base leading-tight">
                              Candice Swanepoel
                            </h4>
                            <span className="text-white/80 text-xl font-light">☆</span>
                          </div>
                          <div className="text-white/90 font-medium text-[11px] sm:text-xs flex items-center gap-1 mt-1">
                            <span className="text-[#ec4899]">💖</span> 14.406 votos
                          </div>
                        </div>
                      </div>

                      {/* White Pedestal Column 3 */}
                      <div className="w-full max-w-[270px] bg-white border border-pink-100 rounded-[26px] shadow-lg p-5 flex flex-col items-center justify-center text-center mt-3.5">
                        <span className="text-[#e11d48] font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 font-sans mb-1">
                          👑 MODELO PLATINO
                        </span>
                        <span className="font-serif text-5xl sm:text-6xl font-black text-slate-900 my-0.5 leading-none">
                          3
                        </span>
                        <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-medium tracking-[0.2em] uppercase my-1 font-sans">
                          <span className="w-6 h-[1px] bg-slate-300" />
                          <span>RUNWAY QUEEN</span>
                          <span className="w-6 h-[1px] bg-slate-300" />
                        </div>
                        <button
                          onClick={() => onSelectModel && onSelectModel(thirdPlace)}
                          className="border border-[#f472b6] hover:border-pink-500 text-slate-800 rounded-full py-2 px-7 text-xs font-bold uppercase tracking-wider hover:bg-pink-50/70 transition-all shadow-xs mt-3 cursor-pointer inline-flex items-center gap-1.5"
                        >
                          VER FICHA <span>›</span>
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              )}



              {/* 👑 RECUADRO APARTE - MODELO LEYENDA (Laurel design with exact stats from mockup image) */}
              <div 
                onClick={() => onSelectModel && onSelectModel(legendModel)}
                className="max-w-xl mx-auto border-2 border-pink-200/50 bg-gradient-to-r from-pink-50/70 via-white to-pink-50/60 rounded-[28px] p-5 relative overflow-hidden transition-all duration-300 shadow-sm flex flex-col sm:flex-row items-center gap-6 text-left cursor-pointer hover:border-pink-400 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] group/legend"
                title={`Haga click para ver el escaparate de la tienda de ${legendModel?.name || 'Adriana Lima'}`}
              >
                
                {/* Soft ambient glow behind portrait */}
                <div className="absolute left-6 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

                {/* Left Circular Frame with Golden Halo and Wings */}
                {legendModel && (
                  <div className="relative shrink-0 select-none">
                    {/* Double Golden concentric border halo */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 via-pink-300 to-amber-500 rounded-full animate-spin" style={{ animationDuration: '24s' }} />
                    <div className="absolute inset-[3px] bg-white rounded-full" />
                    
                    {/* Image element */}
                    <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-pink-200 m-1">
                      <img
                        src={legendModel.avatar}
                        alt={legendModel.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {/* Rose gloss layer */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-transparent" />
                    </div>

                    {/* Golden star badge overlay */}
                    <div className="absolute bottom-0 right-1 bg-amber-400 border border-white p-1.5 rounded-full shadow-md z-20">
                      <Star className="w-3.5 h-3.5 fill-slate-900 text-slate-900" />
                    </div>
                  </div>
                )}

                {/* Right details corresponding to "VICTORIA ICON" layout representing "FASHION FINANCES ICON" */}
                <div className="flex-1 space-y-2.5 text-center sm:text-left z-10 w-full">
                  
                  <div className="flex items-center justify-center sm:justify-start gap-1 pb-1">
                    <span className="text-slate-300 font-bold text-[9px] tracking-widest block font-mono">✦ ✦ ✦</span>
                    <span className="text-pink-600 font-black text-xs uppercase tracking-[0.25em] font-serif px-1.5">
                      FASHION FINANCES ICON
                    </span>
                    <span className="text-slate-300 font-bold text-[9px] tracking-widest block font-mono">✦ ✦ ✦</span>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                      MAYOR TIEMPO DE PERMANENCIA EN EL PUESTO #1
                    </p>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <h3 className="text-xl font-serif font-black text-rose-950 group-hover/legend:text-pink-600 transition-colors leading-none">
                        {legendModel?.name || 'Adriana Lima'}
                      </h3>
                    </div>
                    <p className="text-[11px] text-pink-500 font-bold font-mono">
                      @{legendModel?.username || 'adrianalima_w1'}
                    </p>
                  </div>

                  {/* Récord gold-brown chic pill button */}
                  <div className="inline-flex items-center gap-1.5 bg-[linear-gradient(45deg,#d97706,#b45309)] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xs">
                    🏆 RÉCORD HISTÓRICO
                  </div>

                  {/* Huge Stats Frame: "38 DÍAS EN EL PUESTO #1" styled exactly as the image layout */}
                  <div className="flex items-center justify-center sm:justify-start gap-3.5 pt-1.5 border-t border-pink-100/50">
                    <span className="text-4xl md:text-5xl font-serif font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600 leading-none">
                      38
                    </span>
                    <div className="flex flex-col text-[10px] text-pink-850 font-bold uppercase tracking-wider leading-tight">
                      <span>DÍAS</span>
                      <span>EN EL PUESTO #1</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* 🥈🥉 RECUADRO DE DETALLES DEL SEGUNDO Y TERCER CLASIFICADO */}
              <div className="max-w-xl mx-auto border border-pink-100 bg-white rounded-[24px] p-5 shadow-xs space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-pink-50 pb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-pink-600" />
                    <span className="text-pink-950 font-black text-[10px] uppercase tracking-[0.15em] font-serif">
                      PODIO DE HONOR: CLASIFICACIÓN ESTELAR
                    </span>
                  </div>
                  <span className="bg-pink-50 text-pink-600 text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-pink-100">
                    Modelos de Élite
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* SEGUNDO CLASIFICADO (Plata / Oro) */}
                  {secondPlace && (
                    <div 
                      onClick={() => onSelectModel && onSelectModel(secondPlace)}
                      className="group/second border border-slate-100 hover:border-pink-300 bg-slate-50/55 hover:bg-slate-50 rounded-2xl p-4 transition-all duration-300 cursor-pointer shadow-3xs flex flex-col justify-between space-y-3"
                      title={`Ver escaparate de ${secondPlace.name}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0 select-none">
                          {/* Concentric silver-pink border halo */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-slate-300 via-pink-200 to-slate-400 rounded-full group-hover/second:animate-pulse" />
                          <div className="absolute inset-[2px] bg-white rounded-full" />
                          
                          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 m-0.5">
                            <img
                              src={secondPlace.avatar}
                              alt={secondPlace.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover/second:scale-110 transition-transform duration-500"
                            />
                          </div>

                          {/* Silver medal badge */}
                          <div className="absolute -bottom-1 -right-1 bg-slate-100 border border-slate-300 w-5 h-5 rounded-full flex items-center justify-center shadow-xs z-10">
                            <span className="text-[10px] font-serif font-black text-slate-700">2</span>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <span className="text-[8px] font-black uppercase text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
                            MODELO ORO
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 group-hover/second:text-pink-600 transition-colors truncate mt-1 leading-tight">
                            {secondPlace.name}
                          </h4>
                          <span className="text-[9.5px] text-slate-400 block font-mono">
                            @{secondPlace.username}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-200/60 pt-2.5 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[8px] text-slate-400 font-bold uppercase block font-mono">VOTOS ACUMULADOS</span>
                          <span className="text-xs font-serif font-black text-rose-950">
                            {(secondPlace.totalLikes || 14717).toLocaleString()}
                          </span>
                          <span className="text-[9px] text-pink-500 ml-0.5">♥</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TERCER CLASIFICADO (Platino / Cobre) */}
                  {thirdPlace && (
                    <div 
                      onClick={() => onSelectModel && onSelectModel(thirdPlace)}
                      className="group/third border border-slate-100 hover:border-pink-300 bg-slate-50/55 hover:bg-slate-50 rounded-2xl p-4 transition-all duration-300 cursor-pointer shadow-3xs flex flex-col justify-between space-y-3"
                      title={`Ver escaparate de ${thirdPlace.name}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative shrink-0 select-none">
                          {/* Concentric platinum border halo */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-pink-300 via-slate-200 to-pink-400 rounded-full group-hover/third:animate-pulse" />
                          <div className="absolute inset-[2px] bg-white rounded-full" />
                          
                          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-200 m-0.5">
                            <img
                              src={thirdPlace.avatar}
                              alt={thirdPlace.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover/third:scale-110 transition-transform duration-500"
                            />
                          </div>

                          {/* Bronze/Platinum medal badge */}
                          <div className="absolute -bottom-1 -right-1 bg-pink-50 border border-pink-200 w-5 h-5 rounded-full flex items-center justify-center shadow-xs z-10">
                            <span className="text-[10px] font-serif font-black text-pink-700">3</span>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <span className="text-[8px] font-black uppercase text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100">
                            MODELO PLATINO
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 group-hover/third:text-pink-600 transition-colors truncate mt-1 leading-tight">
                            {thirdPlace.name}
                          </h4>
                          <span className="text-[9.5px] text-slate-400 block font-mono">
                            @{thirdPlace.username}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-slate-200/60 pt-2.5 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[8px] text-slate-400 font-bold uppercase block font-mono">VOTOS ACUMULADOS</span>
                          <span className="text-xs font-serif font-black text-rose-950">
                            {(thirdPlace.totalLikes || 14441).toLocaleString()}
                          </span>
                          <span className="text-[9px] text-pink-500 ml-0.5">♥</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 📋 CLASIFICACIÓN COMPLETA DE LOS 100 MODELOS DE ÉLITE */}
              <div className="max-w-3xl mx-auto bg-white border-2 border-pink-100 rounded-3xl p-5 shadow-sm space-y-4 text-slate-800">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-50 pb-3">
                  <div className="space-y-0.5 text-left">
                    <h3 className="text-sm font-black uppercase text-pink-950 tracking-wider flex items-center gap-1.5 font-display">
                      <Trophy className="w-4 h-4 text-amber-500 fill-amber-400" />
                      Clasificación de los 100 Modelos de Élite
                    </h3>
                    <p className="text-[10px] text-slate-450 font-bold uppercase tracking-widest font-mono">
                      Ordenados por el total de "Me Gusta" acumulados en las imágenes de su perfil
                    </p>
                  </div>
                  
                  {/* Filters */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 p-1 rounded-full shrink-0">
                    <button
                      type="button"
                      onClick={() => setGenderFilter('all')}
                      className={`px-3 py-1 text-[9.5px] font-extrabold rounded-full transition-all uppercase tracking-wider cursor-pointer border-0 bg-transparent ${genderFilter === 'all' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Todos
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenderFilter('female')}
                      className={`px-3 py-1 text-[9.5px] font-extrabold rounded-full transition-all uppercase tracking-wider cursor-pointer border-0 bg-transparent ${genderFilter === 'female' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Femenino
                    </button>
                    <button
                      type="button"
                      onClick={() => setGenderFilter('male')}
                      className={`px-3 py-1 text-[9.5px] font-extrabold rounded-full transition-all uppercase tracking-wider cursor-pointer border-0 bg-transparent ${genderFilter === 'male' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      Masculino
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar modelo por nombre, usuario o alias..."
                    value={rankingSearchQuery}
                    onChange={(e) => setRankingSearchQuery(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-800 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-pink-100 hover:border-pink-200 focus:border-pink-400 p-2.5 pl-9 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100 transition"
                  />
                  <div className="absolute left-3.5 top-3 text-slate-400">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  {rankingSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setRankingSearchQuery('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 font-extrabold text-xs cursor-pointer border-0 bg-transparent"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Scrollable List container */}
                <div className="border border-pink-50 rounded-2xl overflow-hidden bg-slate-50/20 max-h-[440px] overflow-y-auto scrollbar-thin divide-y divide-pink-50/50 text-slate-800">
                  {/* Header Row */}
                  <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-pink-55/30 text-[8.5px] font-black uppercase text-slate-400 tracking-widest sticky top-0 z-20 backdrop-blur-xs border-b border-pink-50">
                    <div className="col-span-2 text-center">PUESTO</div>
                    <div className="col-span-6 text-left">CREADOR/A / CREATOR</div>
                    <div className="col-span-2 text-center">VOTOS</div>
                    <div className="col-span-2 text-center">ACCIÓN</div>
                  </div>

                  {/* Body rows */}
                  {filteredRankings.length > 0 ? (
                    filteredRankings.map((model) => {
                      // Find actual rank in the master list
                      const actualRank = masterSortedRanking.findIndex(m => m.id === model.id) + 1;
                      
                      return (
                        <div 
                          key={model.id}
                          className="grid grid-cols-12 gap-2 px-4 py-3 items-center text-left hover:bg-pink-50/15 transition-all group/row border-b border-pink-50/30"
                        >
                          {/* Rank column */}
                          <div className="col-span-2 flex items-center justify-center">
                            {actualRank === 1 ? (
                              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-black text-xs border border-amber-300 relative shadow-xs" title="1º Puesto: Ángel Supremo">
                                👑
                                <span className="absolute -bottom-1 text-[7px] bg-amber-600 text-white px-1 rounded-full scale-90 font-mono">1</span>
                              </span>
                            ) : actualRank === 2 ? (
                              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-black text-xs border border-slate-300 relative shadow-xs" title="2º Puesto: Elite Oro">
                                ⭐
                                <span className="absolute -bottom-1 text-[7px] bg-slate-500 text-white px-1 rounded-full scale-90 font-mono">2</span>
                              </span>
                            ) : actualRank === 3 ? (
                              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-100 text-rose-800 font-black text-xs border border-rose-200 relative shadow-xs" title="3º Puesto: Runway Queen">
                                ✨
                                <span className="absolute -bottom-1 text-[7px] bg-rose-600 text-white px-1 rounded-full scale-90 font-mono">3</span>
                              </span>
                            ) : (
                              <span className="font-mono font-extrabold text-xs text-slate-400 bg-slate-100/60 px-2 py-0.5 rounded-md min-w-[24px] text-center">
                                #{actualRank}
                              </span>
                            )}
                          </div>

                          {/* Profile Column */}
                          <div className="col-span-6 flex items-center gap-2.5">
                            <div className="relative shrink-0">
                              <div className="w-9 h-9 rounded-full overflow-hidden border border-pink-100 bg-white">
                                <img
                                  src={model.avatar}
                                  alt={model.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover/row:scale-110 transition duration-300"
                                />
                              </div>
                              {model.isCastingLive && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-ping" />
                              )}
                              {model.isOnline && !model.isCastingLive && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                              )}
                            </div>
                            <div className="truncate text-left leading-tight">
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="font-bold text-xs text-slate-800 truncate hover:text-pink-600 transition">
                                  {model.name}
                                </span>
                                {actualRank <= 10 && (
                                  <span className="text-[7.5px] font-black tracking-wider bg-pink-50 text-[#E12A75] border border-pink-200 px-1 py-0.2 rounded-sm select-none uppercase shrink-0 scale-90">
                                    TOP 10
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium font-mono block truncate">
                                @{model.username}
                              </span>
                            </div>
                          </div>

                          {/* Votes Column */}
                          <div className="col-span-2 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <span className="font-mono font-bold text-xs text-pink-600 flex items-center gap-0.5">
                                <span className="scale-90 text-pink-500">♥</span>
                                {(model.totalLikes || 0).toLocaleString()}
                              </span>
                              <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider font-mono">Votos</span>
                            </div>
                          </div>

                          {/* Action Column */}
                          <div className="col-span-2 flex justify-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onSelectModel) {
                                  onSelectModel(model);
                                  onClose();
                                }
                              }}
                              className="text-[10px] font-black text-pink-600 bg-pink-50 hover:bg-pink-600 hover:text-white px-2.5 py-1.5 rounded-lg transition duration-200 cursor-pointer border-0 select-none uppercase tracking-wider text-center"
                            >
                              Ver
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No se encontraron modelos con los filtros seleccionados.
                    </div>
                  )}
                </div>

                {/* Footer status line inside list */}
                <div className="text-[9px] text-slate-400 font-mono uppercase tracking-widest text-center pt-1 flex items-center justify-center gap-1.5">
                  <span>Visualizando {filteredRankings.length} de {masterSortedRanking.length} modelos de la pasarela</span>
                </div>
              </div>

              {/* 📊 TRIPLE STATS DECORATIVE CAPSULE AT THE BOTTOM (Exactly from mockup) */}
              <div className="max-w-3xl mx-auto bg-gradient-to-r from-pink-50/80 via-white to-pink-50/80 border border-pink-100/60 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-pink-100">
                
                <div className="flex items-center justify-center gap-3.5 px-3 py-2 md:py-1">
                  <div className="bg-pink-100 p-2.5 rounded-full text-pink-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] md:text-xs font-black text-pink-950 block uppercase tracking-wide font-display">
                      TOP 0.1% MUNDIAL
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block leading-none">
                      De las modelos más admiradas
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3.5 px-3 pt-4 md:pt-1 pb-2 md:pb-1">
                  <div className="bg-pink-100 p-2.5 rounded-full text-pink-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] md:text-xs font-black text-pink-950 block uppercase tracking-wide font-display">
                      +2.4M VOTOS
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block leading-none">
                      Registrados este mes
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3.5 px-3 pt-4 md:pt-1 pb-2 md:pb-1">
                  <div className="bg-pink-100 p-2.5 rounded-full text-pink-600">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] md:text-xs font-black text-pink-950 block uppercase tracking-wide font-display">
                      100 MODELOS
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block leading-none">
                      Compitiendo en tiempo real
                    </span>
                  </div>
                </div>

              </div>
            </>
          )}

          {activeTab === 'premios' && (
            <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
              
              {/* Header section */}
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-1">
                  <Gift className="w-8 h-8 text-pink-600" />
                </div>
                <h1 className="text-3xl font-serif font-black tracking-wider text-pink-905 uppercase">
                  PREMIOS FASHION FINANCES
                </h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                  🎁 Recompensas de la Pasarela Elite de Alta Costura 🎁
                </p>
                <div className="w-16 h-0.5 mx-auto bg-pink-300 rounded-full" />
              </div>

              {/* Informative introductory callout */}
              <div className="bg-gradient-to-r from-pink-50 to-amber-50 border border-pink-200/50 rounded-2xl p-5 text-slate-705 text-xs sm:text-sm text-center max-w-2xl mx-auto">
                <p>
                  Nuestros mecenas, patrocinadores de marca y socios de fondos corporativos premian a las 100 creadoras de Fashion Finances con base en sus niveles de interacción global. ¡La excelencia estética tiene valores financieros reales!
                </p>
              </div>

              {/* Award Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                
                {/* 1st Tier */}
                <div className="bg-white border-2 border-pink-200 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 bg-pink-100 text-pink-700 text-[10px] font-black tracking-widest px-3 py-1 rounded-bl-xl font-mono">
                    NIVEL DIAMANTE
                  </div>
                  <div className="space-y-4 pt-2">
                    <span className="text-xs font-extrabold text-pink-600 font-mono tracking-widest block">1º PUESTO</span>
                    <h3 className="text-pink-903 font-serif font-extrabold text-2xl">
                      Campaña Global Premium
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      El modelo número 1 recibe un patrocinio directo del fondo de Fashion Finances S.A. para financiar sus proyectos creativos y una portada exclusiva.
                    </p>
                    <ul className="text-slate-700 text-xs space-y-2 border-t border-slate-100 pt-3">
                      <li className="flex items-center gap-2 font-medium">✨ <strong>€100.000</strong> en fondos directos</li>
                      <li className="flex items-center gap-2">📸 Reportaje de Portada Internacional</li>
                      <li className="flex items-center gap-2">⭐️ 100% prioridad en castings en vivo</li>
                    </ul>
                  </div>
                </div>

                {/* 2nd Tier */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-[10px] font-black tracking-widest px-3 py-1 rounded-bl-xl font-mono">
                    NIVEL ORO
                  </div>
                  <div className="space-y-4 pt-2">
                    <span className="text-xs font-extrabold text-slate-500 font-mono tracking-widest block">2º PUESTO</span>
                    <h3 className="text-slate-900 font-serif font-extrabold text-xl">
                      Mecenazgo Coporativo
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Ofrecemos un impulso estelar impulsando su portafolio a los inversores más confiables y recomendando su canal para castings express.
                    </p>
                    <ul className="text-slate-700 text-xs space-y-2 border-t border-slate-100 pt-3">
                      <li className="flex items-center gap-2 font-medium">✨ <strong>€50.000</strong> en fondos directos</li>
                      <li className="flex items-center gap-2">🎬 Sesión fotográfica en Milán o París</li>
                      <li className="flex items-center gap-2">⭐️ Insignia verificada "Elite Oro"</li>
                    </ul>
                  </div>
                </div>

                {/* 3rd Tier */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 bg-indigo-50 text-indigo-700 text-[10px] font-black tracking-widest px-3 py-1 rounded-bl-xl font-mono">
                    NIVEL PLATINO
                  </div>
                  <div className="space-y-4 pt-2">
                    <span className="text-xs font-extrabold text-slate-500 font-mono tracking-widest block">3º PUESTO</span>
                    <h3 className="text-slate-900 font-serif font-extrabold text-xl">
                      Runway Queen Elite
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      La tercera corona destaca las interacciones dinámicas de los seguidores, promoviendo el acceso directo de los directores creativos VIP de la plataforma.
                    </p>
                    <ul className="text-slate-700 text-xs space-y-2 border-t border-slate-100 pt-3">
                      <li className="flex items-center gap-2 font-medium">✨ <strong>€25.000</strong> de capital semilla</li>
                      <li className="flex items-center gap-2">💌 Prioridad de emparejamiento con ángeles</li>
                      <li className="flex items-center gap-2">⭐️ Insignia verificada "Runway Choice"</li>
                    </ul>
                  </div>
                </div>

              </div>

              {/* Rules and guidelines of rewards */}
              <div className="bg-white border border-pink-100 rounded-2xl p-6 space-y-4">
                <h4 className="text-xs font-black uppercase text-pink-650 tracking-wider flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-4 h-4" /> Cómo se otorgan y desbloquean
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed text-left">
                  <p>
                    <strong>1. Verificación del Jurado de Moda:</strong> Al final de cada ciclo mensual, los likes combinados (tanto de perfil como de vídeos) son auditados y se anuncia públicamente la asignación del fondo de patrocinio.
                  </p>
                  <p>
                    <strong>2. Relación de Socios Inversores:</strong> Las comisiones ganadas de patrocinadores por castings son 15% más elevadas para todos los creadores que mantengan su estatus dentro de los top 10 del mes.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setActiveTab('ranking')}
                  className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs px-6 py-3 rounded-full shadow transition-all duration-300 transform hover:scale-102"
                >
                  <span>Ver Clasificación Actual de Creadores</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {activeTab === 'hall_of_fame' && (
            <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
              
              {/* Header section */}
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-1">
                  <Trophy className="w-8 h-8 text-amber-500" />
                </div>
                <h1 className="text-3xl font-serif font-black tracking-wider text-pink-905 uppercase">
                  HALL OF FAME
                </h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                  🏆 Creadores Legendarios con Mayor Historial de Éxitos 🏆
                </p>
                <div className="w-16 h-0.5 mx-auto bg-amber-400 rounded-full" />
              </div>

              {/* Informative introductory callout */}
              <div className="bg-gradient-to-r from-pink-50 to-amber-50/60 border border-pink-200/50 rounded-2xl p-5 text-slate-705 text-xs sm:text-sm text-center max-w-2xl mx-auto">
                <p>
                  El prestigioso Hall de la Fama de <strong>Fashion Finances</strong> celebra a los creadores de contenido que no solo alcanzaron el número 1, sino que establecieron récords históricos y redefinieron lo que significa el glamour digital de alta costura.
                </p>
              </div>

              {/* Elegant List of Hall of Famers */}
              <div className="space-y-4">
                
                {/* Legend 1 */}
                <div className="bg-white border-2 border-amber-300 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-5 relative hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-black tracking-widest px-3 py-1 rounded-bl-xl font-mono">
                    👑 GRAN REINA VIGENTE
                  </div>

                  {legendModel ? (
                    <>
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
                        <img 
                          src={legendModel.avatar} 
                          alt={legendModel.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 text-center md:text-left space-y-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-1.5">
                          <h3 className="text-lg font-serif font-black text-rose-950">
                            {legendModel.name}
                          </h3>
                          <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-block max-w-max mx-auto md:mx-0">
                            38 días en el puesto #1
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Consistencia excepcional, acumulando un récord global de votos simultáneos de inversores y con la mayor tasa de patrocinio de toda la plataforma.
                        </p>
                      </div>
                      <div className="text-center shrink-0 min-w-[120px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-mono">VOTOS MÁXIMOS</span>
                        <span className="text-lg font-bold font-mono text-pink-600">{(legendModel.totalLikes || 14926).toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-slate-400 px-3">{legendModel?.name || 'Adriana Lima'} - Estrella Suprema de Alta Costura</p>
                  )}
                </div>

                {/* Legend 2 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-5 relative hover:shadow-sm transition-all">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80" 
                      alt="Alessandra Ambrosio" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-1.5">
                      <h3 className="text-lg font-serif font-black text-slate-800">
                        Alessandra Ambrosio
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-pink-600 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full inline-block max-w-max mx-auto md:mx-0">
                        Precursora Runway Oro
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Reconocida internacionalmente por la calidad de las interacciones en sus fotos de alta costura y videos vanguardistas.
                    </p>
                  </div>
                  <div className="text-center shrink-0 min-w-[120px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-mono">VOTOS REGISTRADOS</span>
                    <span className="text-lg font-bold font-mono text-pink-600">14.717</span>
                  </div>
                </div>

                {/* Legend 3 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-5 relative hover:shadow-sm transition-all">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80" 
                      alt="Candice Swanepoel" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left space-y-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-1.5">
                      <h3 className="text-lg font-serif font-black text-slate-800">
                        Candice Swanepoel
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full inline-block max-w-max mx-auto md:mx-0">
                        Favorita del Público
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Inspirada por el mecenazgo estético, Candice Swanepoel ha sido coronada consecutivamente como "Runway Queen" de la sección Casting Live.
                    </p>
                  </div>
                  <div className="text-center shrink-0 min-w-[120px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-mono">VOTOS REGISTRADOS</span>
                    <span className="text-lg font-bold font-mono text-pink-600">14.415</span>
                  </div>
                </div>

              </div>

              {/* Slogan details */}
              <div className="text-center pt-2">
                <button
                  onClick={() => setActiveTab('ranking')}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-3 rounded-full shadow transition-all duration-300"
                >
                  <span>Volver al Ranking Activo</span>
                </button>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* 🎁 REGALOS TAB (RECIBIDOS, ENVIADOS & CATÁLOGO LIVE)      */}
          {/* ======================================================== */}
          {activeTab === 'regalos' && (
            <div className="space-y-6 animate-fade-in" id="regalos-extras-channel-container">
              
              {/* EN VIVO Header Bar with Sub-Tabs Navigation */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 text-white p-5 sm:p-6 border border-pink-500/30 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 w-full lg:w-auto">
                  <div className="relative shrink-0">
                    <div className="w-13 h-13 rounded-full ring-2 ring-red-500 p-0.5 overflow-hidden shadow-lg">
                      <img 
                        src={legendModel.avatar} 
                        alt="Adriana Lima" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full" 
                      />
                    </div>
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border border-white"></span>
                    </span>
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-red-600 text-white font-mono font-black text-[9px] uppercase rounded-sm tracking-wider animate-pulse flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        EN VIVO
                      </span>
                      <h2 className="text-base sm:text-lg font-serif font-black text-white flex items-center gap-1.5 truncate">
                        <span className="text-red-500">🔴</span> Centro de Regalos · Fashion Finances
                      </h2>
                    </div>
                    <p className="text-xs text-pink-200/90 font-light truncate">
                      Historial de Regalos Recibidos, Enviados y Tienda Extra del Canal
                    </p>
                  </div>
                </div>

                {/* Right controls: User Balance & Close */}
                <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
                  <div className="bg-black/60 border border-amber-400/40 px-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-inner">
                    <span className="text-xs text-slate-300 font-medium font-mono">Tu saldo:</span>
                    <span className="text-base font-black font-mono text-amber-400 flex items-center gap-1 tracking-tight">
                      🪙 {userGiftBalance.toLocaleString()}
                    </span>
                    <button
                      onClick={() => {
                        setUserGiftBalance(prev => prev + 5000);
                        window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                          detail: { icon: '🪙' }
                        }));
                      }}
                      className="ml-1 w-6 h-6 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs transition cursor-pointer"
                      title="Recargar 5000 monedas"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveTab('ranking')}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all border border-white/20 hover:scale-105 cursor-pointer shadow-sm shrink-0"
                    title="Cerrar y volver al Ranking"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Sub-Navigation Selector for Gifts */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md p-2 rounded-2xl border border-pink-100 shadow-sm">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                  {/* Tab 1: Regalos Recibidos (Gifts given to me) */}
                  <button
                    onClick={() => setGiftsSubTab('received')}
                    className={`px-4 py-2.5 rounded-xl font-serif text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                      giftsSubTab === 'received'
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/25 scale-[1.02]'
                        : 'bg-slate-50 hover:bg-pink-50 text-slate-700 hover:text-pink-600 border border-slate-200/80'
                    }`}
                  >
                    <Inbox className="w-4 h-4" />
                    <span>Regalos Recibidos</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                      giftsSubTab === 'received' ? 'bg-white text-pink-600' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {receivedGifts.length}
                    </span>
                  </button>

                  {/* Tab 2: Regalos Enviados (Gifts I sent) */}
                  <button
                    onClick={() => setGiftsSubTab('sent')}
                    className={`px-4 py-2.5 rounded-xl font-serif text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                      giftsSubTab === 'sent'
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/25 scale-[1.02]'
                        : 'bg-slate-50 hover:bg-pink-50 text-slate-700 hover:text-pink-600 border border-slate-200/80'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    <span>Regalos Enviados</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                      giftsSubTab === 'sent' ? 'bg-white text-pink-600' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {sentGifts.length}
                    </span>
                  </button>

                  {/* Tab 3: Catálogo Extra Live */}
                  <button
                    onClick={() => setGiftsSubTab('catalog')}
                    className={`px-4 py-2.5 rounded-xl font-serif text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                      giftsSubTab === 'catalog'
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/25 scale-[1.02]'
                        : 'bg-slate-50 hover:bg-pink-50 text-slate-700 hover:text-pink-600 border border-slate-200/80'
                    }`}
                  >
                    <Gift className="w-4 h-4" />
                    <span>Catálogo de Regalos</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                      giftsSubTab === 'catalog' ? 'bg-white text-pink-600' : 'bg-amber-100 text-amber-800'
                    }`}>
                      45
                    </span>
                  </button>
                </div>

                <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <BadgeCheck className="w-4 h-4 text-emerald-500" />
                  <span>Usuario autenticado: <strong className="text-slate-800">Ernesto vs</strong></span>
                </div>
              </div>

              {/* ⏱️ FILTRO TEMPORAL: ACTUALES (ÚLTIMA SEMANA) | RECIENTES (ÚLTIMO MES) | ANTIGUOS (> 1 MES) */}
              <div className="bg-white p-3.5 rounded-2xl border border-pink-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-serif font-bold text-slate-700">
                  <Clock className="w-4 h-4 text-pink-600 shrink-0" />
                  <span>Filtrar período:</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto">
                  {/* Botón 0: Todos (Bóveda Completa) */}
                  <button
                    type="button"
                    onClick={() => setGiftTimeFilter('all')}
                    className={`px-3 py-2 rounded-xl font-serif text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none ${
                      giftTimeFilter === 'all'
                        ? 'bg-gradient-to-r from-amber-600 via-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/30 ring-2 ring-pink-500 scale-[1.03]'
                        : 'bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-600 border border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <Lock className={`w-3.5 h-3.5 ${giftTimeFilter === 'all' ? 'text-white' : 'text-amber-500'}`} />
                    <span>Todos</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
                      giftTimeFilter === 'all' ? 'bg-white text-pink-600 shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {giftsSubTab === 'received' ? receivedGifts.length : sentGifts.length}
                    </span>
                  </button>

                  {/* Botón 1: Actuales (última semana) */}
                  <button
                    type="button"
                    onClick={() => setGiftTimeFilter('actuales')}
                    className={`px-3 py-2 rounded-xl font-serif text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none ${
                      giftTimeFilter === 'actuales'
                        ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white shadow-md shadow-pink-500/30 ring-2 ring-pink-500 scale-[1.03]'
                        : 'bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-600 border border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <Flame className={`w-3.5 h-3.5 ${giftTimeFilter === 'actuales' ? 'text-white' : 'text-slate-400'}`} />
                    <span>Actuales</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
                      giftTimeFilter === 'actuales' ? 'bg-white text-pink-600 shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {giftsSubTab === 'received' 
                        ? receivedGifts.filter(g => isGiftInTimePeriod(g.timestamp, 'actuales')).length
                        : giftsSubTab === 'sent'
                        ? sentGifts.filter(g => isGiftInTimePeriod(g.timestamp, 'actuales')).length
                        : receivedGifts.filter(g => isGiftInTimePeriod(g.timestamp, 'actuales')).length}
                    </span>
                  </button>

                  {/* Botón 2: Recientes (último mes) */}
                  <button
                    type="button"
                    onClick={() => setGiftTimeFilter('recientes')}
                    className={`px-3 py-2 rounded-xl font-serif text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none ${
                      giftTimeFilter === 'recientes'
                        ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white shadow-md shadow-pink-500/30 ring-2 ring-pink-500 scale-[1.03]'
                        : 'bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-600 border border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <Calendar className={`w-3.5 h-3.5 ${giftTimeFilter === 'recientes' ? 'text-white' : 'text-slate-400'}`} />
                    <span>Recientes</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
                      giftTimeFilter === 'recientes' ? 'bg-white text-pink-600 shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {giftsSubTab === 'received' 
                        ? receivedGifts.filter(g => isGiftInTimePeriod(g.timestamp, 'recientes')).length
                        : giftsSubTab === 'sent'
                        ? sentGifts.filter(g => isGiftInTimePeriod(g.timestamp, 'recientes')).length
                        : receivedGifts.filter(g => isGiftInTimePeriod(g.timestamp, 'recientes')).length}
                    </span>
                  </button>

                  {/* Botón 3: Antiguos (más de 1 mes) */}
                  <button
                    type="button"
                    onClick={() => setGiftTimeFilter('antiguos')}
                    className={`px-3 py-2 rounded-xl font-serif text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none ${
                      giftTimeFilter === 'antiguos'
                        ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white shadow-md shadow-pink-500/30 ring-2 ring-pink-500 scale-[1.03]'
                        : 'bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-600 border border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <History className={`w-3.5 h-3.5 ${giftTimeFilter === 'antiguos' ? 'text-white' : 'text-slate-400'}`} />
                    <span>Antiguos</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-black ${
                      giftTimeFilter === 'antiguos' ? 'bg-white text-pink-600 shadow-xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {giftsSubTab === 'received' 
                        ? receivedGifts.filter(g => isGiftInTimePeriod(g.timestamp, 'antiguos')).length
                        : giftsSubTab === 'sent'
                        ? sentGifts.filter(g => isGiftInTimePeriod(g.timestamp, 'antiguos')).length
                        : receivedGifts.filter(g => isGiftInTimePeriod(g.timestamp, 'antiguos')).length}
                    </span>
                  </button>
                </div>

                <div className="text-[11px] font-mono text-slate-500 hidden lg:flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                  {giftTimeFilter === 'all' && <span>Período seleccionado: <strong>Bóveda Completa (Historial Total)</strong></span>}
                  {giftTimeFilter === 'actuales' && <span>Período seleccionado: <strong>Actuales (≤ 7 días)</strong></span>}
                  {giftTimeFilter === 'recientes' && <span>Período seleccionado: <strong>Recientes (8 a 30 días)</strong></span>}
                  {giftTimeFilter === 'antiguos' && <span>Período seleccionado: <strong>Antiguos (&gt; 1 mes)</strong></span>}
                </div>
              </div>

              {/* Toast confirmation for sent gift */}
              {sentGiftToast && (
                <div className="p-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-lg border border-emerald-400/40 flex items-center justify-between animate-bounce">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{sentGiftToast.icon}</span>
                    <div>
                      <span className="font-extrabold text-sm block">¡Regalo enviado con éxito! 🎁</span>
                      <span className="text-xs text-emerald-100">
                        Has enviado <strong>"{sentGiftToast.name}"</strong> por 🪙 {sentGiftToast.price.toLocaleString()} {sentGiftToast.recipientName ? `a ${sentGiftToast.recipientName}` : 'en DIRECTO'}.
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setGiftsSubTab('sent')}
                    className="text-xs font-mono bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1 transition cursor-pointer"
                  >
                    <span>Ver en Enviados</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Toast confirmation for thank you message */}
              {thankYouToast && (
                <div className="p-3.5 bg-gradient-to-r from-pink-600 to-rose-700 text-white rounded-2xl shadow-lg border border-pink-400/40 flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">💖</span>
                    <div>
                      <span className="font-extrabold text-sm block">¡Agradecimiento enviado! ✨</span>
                      <span className="text-xs text-pink-100">
                        Has enviado un mensaje de agradecimiento y cariño a <strong>{thankYouToast.senderName}</strong> por su regalo <strong>"{thankYouToast.giftName}"</strong>.
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-black/30 px-2.5 py-1 rounded-lg">💌 Notificado</span>
                </div>
              )}

              {/* ======================================================== */}
              {/* SUB-VIEW 1: 🎁 REGALOS RECIBIDOS (GIFTS GIVEN TO ME)       */}
              {/* ======================================================== */}
              {/* ======================================================== */}
              {/* SUB-VIEW 1: 🏛️ BÓVEDA DE REGALOS RECIBIDOS (GIFT VAULT)  */}
              {/* ======================================================== */}
              {giftsSubTab === 'received' && (
                <div className="space-y-4 animate-fade-in" id="boveda-regalos-container">
                  
                  {/* 🏛️ VAULT MASTER HEADER & REPUTATION BANNER (BLANCO ROSADO PERLA) */}
                  <div className="bg-gradient-to-br from-[#fff9fb] via-[#fff0f5] to-[#fdf2f7] border-2 border-pink-200/90 rounded-3xl p-4 sm:p-6 text-slate-800 shadow-[0_10px_35px_rgba(251,113,133,0.08),_0_2px_10px_rgba(244,114,182,0.05)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-rose-200/20 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
                      {/* Left side: Emblem, Title, Badges, Description */}
                      <div className="flex items-start gap-3.5 max-w-xl">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 via-rose-50 to-amber-100 border-2 border-pink-300/80 flex items-center justify-center text-2xl shadow-xs shrink-0">
                          🏛️
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base sm:text-xl font-serif font-black text-slate-900 tracking-wide flex items-center gap-1.5">
                              BÓVEDA DE REGALOS CUSTODIADOS
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                              <Shield className="w-2.5 h-2.5 text-emerald-600" />
                              Custodia Activa
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                              <Lock className="w-2.5 h-2.5 text-amber-600" />
                              18K Seal
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-mono mt-1 leading-relaxed">
                            Caja fuerte oficial donde se custodian todos los regalos, certificados y distinciones recibidos de múltiples usuarios y mecenas.
                          </p>
                        </div>
                      </div>

                      {/* Right side: Vault Action Buttons */}
                      {/* "+ Recibir Regalo" a la izquierda, y a su derecha los botones en columna vertical con el mismo tamaño y fondo blanco rosado perla */}
                      <div className="flex items-stretch gap-2.5 shrink-0 self-start lg:self-center">
                        {/* Botón Principal: + Recibir Regalo */}
                        <button
                          type="button"
                          onClick={handleSimulateIncomingGift}
                          className="w-32 sm:w-36 min-h-[142px] bg-gradient-to-br from-pink-600 via-rose-600 to-pink-700 hover:from-pink-500 hover:to-rose-500 text-white rounded-2xl p-3 font-serif font-black flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md transition cursor-pointer transform hover:scale-[1.02] active:scale-[0.98] shrink-0 text-center border border-pink-400/40"
                          title="Simular recepción de un nuevo regalo de otra modelo o patrocinador"
                        >
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                            <Plus className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="text-xs sm:text-sm font-black block leading-tight">
                              + Recibir<br />Regalo
                            </span>
                            <span className="text-[9px] font-mono opacity-85 mt-1 block">
                              Simular donante
                            </span>
                          </div>
                        </button>

                        {/* Columna vertical de botones a la derecha de Recibir Regalo (todos con el mismo tamaño exacto y fondo blanco rosado perla) */}
                        <div className="flex flex-col gap-1.5 shrink-0 justify-between">
                          {/* Botón 1: Previsualizar / Ocultar Vitrina */}
                          <button
                            type="button"
                            onClick={() => setShowVaultInspector(!showVaultInspector)}
                            className={`w-44 sm:w-48 h-[32px] rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border shadow-2xs ${
                              showVaultInspector
                                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 border-amber-500 font-black shadow-xs'
                                : 'bg-[#fff8fa] hover:bg-pink-100/60 text-slate-800 hover:text-pink-700 border-pink-200/90'
                            }`}
                            title={showVaultInspector ? "Ocultar vitrina de inspección" : "Abrir vitrina de inspección de regalos"}
                          >
                            <Eye className="w-3.5 h-3.5 text-pink-600" />
                            <span>{showVaultInspector ? 'Ocultar Vitrina' : 'Previsualizar'}</span>
                          </button>

                          {/* Botón 2: Vista Slider */}
                          <button
                            type="button"
                            onClick={() => setVaultViewMode('slider')}
                            className={`w-44 sm:w-48 h-[32px] rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border shadow-2xs ${
                              vaultViewMode === 'slider'
                                ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white border-pink-600 font-black shadow-xs'
                                : 'bg-[#fff8fa] hover:bg-pink-100/60 text-slate-800 hover:text-pink-700 border-pink-200/90'
                            }`}
                            title="Ver regalos en slider deslizante continuo"
                          >
                            <span>🎠</span>
                            <span>Vista Slider</span>
                          </button>

                          {/* Botón 3: Vista Cuadrícula */}
                          <button
                            type="button"
                            onClick={() => setVaultViewMode('grid')}
                            className={`w-44 sm:w-48 h-[32px] rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border shadow-2xs ${
                              vaultViewMode === 'grid'
                                ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white border-pink-600 font-black shadow-xs'
                                : 'bg-[#fff8fa] hover:bg-pink-100/60 text-slate-800 hover:text-pink-700 border-pink-200/90'
                            }`}
                            title="Ver regalos en cuadrícula completa"
                          >
                            <Grid className="w-3.5 h-3.5 text-pink-600" />
                            <span>Vista Cuadrícula</span>
                          </button>

                          {/* Botón 4: Vista Lista */}
                          <button
                            type="button"
                            onClick={() => setVaultViewMode('dense')}
                            className={`w-44 sm:w-48 h-[32px] rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border shadow-2xs ${
                              vaultViewMode === 'dense'
                                ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white border-pink-600 font-black shadow-xs'
                                : 'bg-[#fff8fa] hover:bg-pink-100/60 text-slate-800 hover:text-pink-700 border-pink-200/90'
                            }`}
                            title="Ver libro de registro y custodia"
                          >
                            <List className="w-3.5 h-3.5 text-pink-600" />
                            <span>Vista Lista</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Vault Summary Metrics Grid (Blanco Rosado Perla glassmorphism) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-pink-200/70 relative z-10">
                      <div className="bg-white/90 backdrop-blur-xs p-2.5 sm:p-3 rounded-2xl border border-pink-100 shadow-2xs hover:shadow-xs transition">
                        <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block tracking-wider">
                          🏛️ Regalos Custodiados
                        </span>
                        <span className="text-xl sm:text-2xl font-black font-serif text-slate-900 block mt-0.5">
                          {receivedGifts.length}
                        </span>
                        <span className="text-[10px] text-pink-600 font-mono font-bold">En depósito seguro</span>
                      </div>

                      <div className="bg-white/90 backdrop-blur-xs p-2.5 sm:p-3 rounded-2xl border border-pink-100 shadow-2xs hover:shadow-xs transition">
                        <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block tracking-wider">
                          👥 Donantes Únicos
                        </span>
                        <span className="text-xl sm:text-2xl font-black font-serif text-pink-600 block mt-0.5">
                          {new Set(receivedGifts.map(g => g.senderUsername || g.senderName)).size}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">De usuarios diferentes</span>
                      </div>

                      <div className="bg-white/90 backdrop-blur-xs p-2.5 sm:p-3 rounded-2xl border border-pink-100 shadow-2xs hover:shadow-xs transition">
                        <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block tracking-wider">
                          🪙 Valor en Bóveda
                        </span>
                        <span className="text-xl sm:text-2xl font-black font-mono text-amber-600 block mt-0.5">
                          🪙 {receivedGifts.reduce((acc, g) => acc + g.price, 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold font-mono">
                          ≈ {receivedGifts.reduce((acc, g) => acc + g.euroCost, 0).toLocaleString()}€
                        </span>
                      </div>

                      <div className="bg-white/90 backdrop-blur-xs p-2.5 sm:p-3 rounded-2xl border border-pink-100 shadow-2xs hover:shadow-xs transition">
                        <span className="text-[9px] font-mono font-bold uppercase text-slate-500 block tracking-wider">
                          👑 Donante Principal
                        </span>
                        <span className="text-sm font-black font-serif text-slate-900 truncate block mt-0.5 flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          Adriana Lima
                        </span>
                        <span className="text-[10px] text-amber-700 font-mono font-semibold">5.000€ Reloj de Oro</span>
                      </div>
                    </div>
                  </div>

                  {/* 🔍 COMPACT VAULT INSPECTOR / VITRINA (Blanco Rosado Perla) */}
                  {showVaultInspector && (
                    <div className="bg-gradient-to-br from-[#fff9fb] via-[#fff0f5] to-[#fdf2f7] border-2 border-pink-200/90 rounded-2xl p-3.5 sm:p-4 text-slate-900 shadow-md animate-fade-in relative overflow-hidden">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                        
                        {/* Mini display thumbnail */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <div 
                            onClick={() => {
                              if (currentFeaturedGift.isCertificate) handleViewCertificateLarge();
                              else if (currentFeaturedGift.isWatch) {
                                setActiveModalGift(receivedGifts.find(g => g.giftName.toLowerCase().includes('reloj')) || null);
                                setShowLuxuryWatchModal(true);
                              } else {
                                setSelectedGenericModalGift(currentFeaturedGift);
                                setShowGenericGiftModal(true);
                              }
                            }}
                            className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-100 via-rose-50 to-amber-100 border border-pink-300/80 flex items-center justify-center text-3xl shadow-inner cursor-pointer hover:scale-105 transition shrink-0"
                            title="Toca para ver en grande"
                          >
                            {currentFeaturedGift.icon}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-mono font-bold uppercase text-pink-700 tracking-wider">
                                🔍 INSPECCIONANDO:
                              </span>
                              <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-black font-mono">
                                {currentFeaturedGift.badgeText}
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-serif font-black text-slate-900 truncate flex items-center gap-1">
                              {currentFeaturedGift.name} <span>{currentFeaturedGift.icon}</span>
                            </h4>
                            <div className="flex items-center gap-2 text-xs font-mono">
                              <span className="text-pink-700">De: <strong>{currentFeaturedGift.senderName}</strong> (@{currentFeaturedGift.senderUsername})</span>
                              <span className="text-amber-700 font-bold">🪙 {currentFeaturedGift.price.toLocaleString()} ({currentFeaturedGift.euroCost}€)</span>
                            </div>
                          </div>
                        </div>

                        {/* Middle: Short message quote */}
                        <div className="hidden lg:block max-w-md bg-white/80 px-3 py-1.5 rounded-xl border border-pink-100 text-[11px] italic font-serif text-slate-700 truncate shadow-2xs">
                          "{currentFeaturedGift.message}"
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                          {currentFeaturedGift.isCertificate ? (
                            <button
                              type="button"
                              onClick={handleViewCertificateLarge}
                              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1 font-mono uppercase"
                            >
                              <Sparkles className="w-3 h-3 text-slate-950" />
                              <span>Ver Diploma</span>
                            </button>
                          ) : currentFeaturedGift.isWatch ? (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveModalGift(receivedGifts.find(g => g.giftName.toLowerCase().includes('reloj')) || null);
                                setShowLuxuryWatchModal(true);
                              }}
                              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1 font-mono uppercase"
                            >
                              <Sparkles className="w-3 h-3 text-slate-950" />
                              <span>Ver Reloj 3D</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedGenericModalGift(currentFeaturedGift);
                                setShowGenericGiftModal(true);
                              }}
                              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1 font-mono uppercase"
                            >
                              <Sparkles className="w-3 h-3 text-slate-950" />
                              <span>Ver en Grande</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setShowVaultInspector(false)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-pink-100/60 transition cursor-pointer"
                            title="Ocultar vitrina"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* 🛠️ BÓVEDA CONTROLS: CATEGORY FILTERS, SEARCH & SORT */}
                  <div className="bg-white p-3 rounded-2xl border border-pink-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                    
                    {/* Category Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-[11px] font-bold uppercase tracking-wider">
                      {[
                        { id: 'all', label: `Todos (${receivedGifts.length})`, icon: Gift },
                        { id: 'lujo', label: `👑 Lujo (${receivedGifts.filter(g => g.category === 'lujo').length})`, icon: Crown },
                        { id: 'intermedio', label: `💎 Joyas (${receivedGifts.filter(g => g.category === 'intermedio').length})`, icon: Gem },
                        { id: 'basico', label: `⭐ Esenciales (${receivedGifts.filter(g => g.category === 'basico').length})`, icon: Star },
                      ].map(cat => {
                        const isActive = receivedCategoryFilter === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setReceivedCategoryFilter(cat.id as any)}
                            className={`px-3 py-1.5 rounded-xl border transition-all duration-200 shrink-0 flex items-center gap-1 cursor-pointer select-none text-xs ${
                              isActive 
                                ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-600 shadow-xs' 
                                : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:border-pink-300 hover:text-pink-600'
                            }`}
                          >
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Search & Sort Container */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-64">
                        <input
                          type="text"
                          value={receivedSearchQuery}
                          onChange={(e) => setReceivedSearchQuery(e.target.value)}
                          placeholder="Buscar por donante, regalo o mensaje..."
                          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500 transition shadow-2xs"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      {/* Sort Order Selector */}
                      <select
                        value={vaultSortOrder}
                        onChange={(e) => setVaultSortOrder(e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono font-medium rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-pink-500 cursor-pointer shadow-2xs"
                        title="Ordenar regalos de la bóveda"
                      >
                        <option value="recent">⏱️ Recientes</option>
                        <option value="value_desc">🪙 Mayor Valor</option>
                        <option value="value_asc">🪙 Menor Valor</option>
                        <option value="donor">👤 Por Donante</option>
                      </select>
                    </div>

                  </div>

                  {/* 🎁 BÓVEDA GIFTS COLLECTION - TAMAÑO MÁS CHICO & COMPACTO */}
                  {(() => {
                    let filteredReceived = receivedGifts.filter(g => {
                      if (!isGiftInTimePeriod(g.timestamp, giftTimeFilter)) return false;
                      if (receivedCategoryFilter !== 'all' && g.category !== receivedCategoryFilter) return false;
                      if (receivedSearchQuery) {
                        const q = receivedSearchQuery.toLowerCase();
                        return (
                          g.giftName.toLowerCase().includes(q) ||
                          g.senderName.toLowerCase().includes(q) ||
                          (g.senderUsername && g.senderUsername.toLowerCase().includes(q)) ||
                          (g.message && g.message.toLowerCase().includes(q))
                        );
                      }
                      return true;
                    });

                    // Sort according to vaultSortOrder
                    if (vaultSortOrder === 'value_desc') {
                      filteredReceived = [...filteredReceived].sort((a, b) => b.price - a.price);
                    } else if (vaultSortOrder === 'value_asc') {
                      filteredReceived = [...filteredReceived].sort((a, b) => a.price - b.price);
                    } else if (vaultSortOrder === 'donor') {
                      filteredReceived = [...filteredReceived].sort((a, b) => a.senderName.localeCompare(b.senderName));
                    } else {
                      filteredReceived = [...filteredReceived].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                    }

                    if (filteredReceived.length === 0) {
                      return (
                        <div className="bg-white rounded-2xl border border-dashed border-pink-200 p-8 text-center space-y-2 shadow-2xs">
                          <Lock className="w-8 h-8 text-pink-400 mx-auto" />
                          <h4 className="font-serif font-bold text-slate-800 text-sm">
                            No se encontraron regalos en la bóveda con el filtro actual
                          </h4>
                          <p className="text-xs text-slate-400 font-mono">
                            Prueba seleccionando "Todos" en el período o limpiando la búsqueda.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setGiftTimeFilter('all');
                              setReceivedCategoryFilter('all');
                              setReceivedSearchQuery('');
                            }}
                            className="mt-2 px-4 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold font-mono transition cursor-pointer"
                          >
                            Mostrar todos los regalos
                          </button>
                        </div>
                      );
                    }

                    {/* VISTA 1: 🎠 SLIDER DE REGALOS (CARRUSEL DESLIZANTE CON NAVEGACIÓN) */}
                    if (vaultViewMode === 'slider') {
                      return (
                        <div className="space-y-3 relative group/slider">
                          
                          {/* Slider Track Wrapper with Floating Navigation Arrows */}
                          <div className="relative">
                            
                            {/* Left Chevron Button */}
                            <button
                              type="button"
                              onClick={() => scrollGiftSlider('left')}
                              disabled={!canScrollLeft}
                              className={`absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950/90 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border-2 border-amber-400/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
                                !canScrollLeft ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'hover:scale-110 active:scale-95'
                              }`}
                              title="Deslizar regalos a la izquierda"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Right Chevron Button */}
                            <button
                              type="button"
                              onClick={() => scrollGiftSlider('right')}
                              disabled={!canScrollRight}
                              className={`absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950/90 text-amber-300 hover:bg-amber-500 hover:text-slate-950 border-2 border-amber-400/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
                                !canScrollRight ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'hover:scale-110 active:scale-95'
                              }`}
                              title="Deslizar regalos a la derecha"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Horizontal Slider Scroll Rail with Touch & Mouse Drag */}
                            <div
                              ref={giftSliderRef}
                              onScroll={handleSliderScroll}
                              onMouseDown={handleSliderMouseDown}
                              onMouseLeave={handleSliderMouseUpOrLeave}
                              onMouseUp={handleSliderMouseUpOrLeave}
                              onMouseMove={handleSliderMouseMove}
                              className="flex gap-2.5 sm:gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-1 scrollbar-none cursor-grab active:cursor-grabbing select-none"
                              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                              {filteredReceived.map((gift) => {
                                const isCert = gift.giftName.toLowerCase().includes('certificado');
                                const isWatch = gift.giftName.toLowerCase().includes('reloj');
                                const isSelected = selectedShowcaseGiftId === gift.id;

                                return (
                                  <div
                                    key={gift.id}
                                    onClick={() => setSelectedShowcaseGiftId(gift.id)}
                                    className={`w-[210px] sm:w-[230px] md:w-[245px] shrink-0 snap-start rounded-xl border p-2 sm:p-2.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-1.5 relative group cursor-pointer text-left ${
                                      isSelected 
                                        ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/70 shadow-xs' 
                                        : 'bg-white border-slate-200/90 hover:border-pink-300 hover:bg-pink-50/20'
                                    }`}
                                  >
                                    {/* Active Indicator Dot */}
                                    {isSelected && (
                                      <span className="absolute -top-1.5 right-1.5 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-black text-[7.5px] rounded-full uppercase tracking-wider font-mono shadow-xs">
                                        ★ ACTIVO
                                      </span>
                                    )}

                                    {/* Card Header: Sender Mini-Avatar & Info + Price */}
                                    <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-slate-100">
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <img
                                          src={gift.senderAvatar}
                                          alt={gift.senderName}
                                          className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-pink-400/60 ring-1 ring-pink-500/20 shrink-0"
                                        />
                                        <div className="min-w-0">
                                          <h5 className="text-[10px] font-bold text-slate-900 truncate font-serif leading-tight">
                                            {gift.senderName}
                                          </h5>
                                          <span className="text-[8px] text-pink-600 font-mono truncate block leading-none">
                                            @{gift.senderUsername}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="text-right shrink-0">
                                        <span className="text-[10px] font-black font-mono text-amber-600 block leading-tight">
                                          🪙 {gift.price >= 1000 ? `${(gift.price / 1000).toFixed(gift.price % 1000 === 0 ? 0 : 1)}k` : gift.price}
                                        </span>
                                        <span className="text-[8px] text-emerald-600 font-mono font-bold leading-none block">
                                          ({gift.euroCost}€)
                                        </span>
                                      </div>
                                    </div>

                                    {/* Card Body: Icon & Compact Title */}
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-50 to-pink-50 border border-amber-200/60 flex items-center justify-center text-base sm:text-lg shrink-0 group-hover:scale-110 transition-transform shadow-2xs">
                                        {gift.giftIcon}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <h4 className="text-[11px] font-black text-slate-900 truncate font-serif leading-tight">
                                          {gift.giftName}
                                        </h4>
                                        <span className="text-[7px] font-mono uppercase font-bold text-amber-800 bg-amber-100/70 px-1 py-0.2 rounded inline-block leading-none mt-0.5">
                                          {gift.category === 'lujo' ? '👑 Lujo' : gift.category === 'intermedio' ? '💎 Joya' : '⭐ Esencial'}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Compact 1-line quotation */}
                                    <div className="text-[8.5px] italic text-slate-500 truncate font-serif bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100" title={gift.message}>
                                      "{gift.message}"
                                    </div>

                                    {/* Card Footer: Date & Quick Action Buttons */}
                                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[8px] font-mono text-slate-400">
                                      <span className="truncate max-w-[65px]">{gift.dateFormatted.split('•')[0]}</span>

                                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedShowcaseGiftId(gift.id);
                                            if (isCert) {
                                              setShowCertificateModal(true);
                                            } else if (isWatch) {
                                              setActiveModalGift(gift);
                                              setShowLuxuryWatchModal(true);
                                            } else {
                                              setSelectedGenericModalGift({
                                                name: gift.giftName,
                                                icon: gift.giftIcon,
                                                price: gift.price,
                                                euroCost: gift.euroCost,
                                                senderName: gift.senderName,
                                                senderUsername: gift.senderUsername,
                                                senderAvatar: gift.senderAvatar,
                                                message: gift.message,
                                                dateFormatted: gift.dateFormatted,
                                                badgeText: `${gift.euroCost}€ OFICIAL VIP`
                                              });
                                              setShowGenericGiftModal(true);
                                            }
                                          }}
                                          className="px-1.5 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[8px] uppercase transition cursor-pointer flex items-center gap-0.5 shadow-2xs"
                                          title="Inspeccionar en grande"
                                        >
                                          <Sparkles className="w-2 h-2" />
                                          <span>{isCert ? '📜 Ver' : 'Ver'}</span>
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleThankSender(gift)}
                                          className="p-1 bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white border border-pink-200 rounded transition cursor-pointer"
                                          title={`Agradecer a ${gift.senderName}`}
                                        >
                                          <Heart className="w-2.5 h-2.5" />
                                        </button>
                                      </div>
                                    </div>

                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    {/* VISTA 2: GRID COMPACTO (CELDAS DE BÓVEDA - TAMAÑO CHICO) */}
                    if (vaultViewMode === 'grid') {
                      return (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5">
                          {filteredReceived.map((gift) => {
                            const isCert = gift.giftName.toLowerCase().includes('certificado');
                            const isWatch = gift.giftName.toLowerCase().includes('reloj');
                            const isSelected = selectedShowcaseGiftId === gift.id;

                            return (
                              <div
                                key={gift.id}
                                onClick={() => {
                                  setSelectedShowcaseGiftId(gift.id);
                                }}
                                className={`rounded-xl border p-2 sm:p-2.5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-1.5 relative group cursor-pointer text-left ${
                                  isSelected 
                                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/70 shadow-xs' 
                                    : 'bg-white border-slate-200/90 hover:border-pink-300 hover:bg-pink-50/20'
                                }`}
                              >
                                {/* Active Indicator Dot */}
                                {isSelected && (
                                  <span className="absolute -top-1.5 right-1.5 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-black text-[7.5px] rounded-full uppercase tracking-wider font-mono shadow-xs">
                                    ★ ACTIVO
                                  </span>
                                )}

                                {/* Card Header: Sender Mini-Avatar & Info + Price */}
                                <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-slate-100">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <img
                                      src={gift.senderAvatar}
                                      alt={gift.senderName}
                                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-pink-400/60 ring-1 ring-pink-500/20 shrink-0"
                                    />
                                    <div className="min-w-0">
                                      <h5 className="text-[10px] font-bold text-slate-900 truncate font-serif leading-tight">
                                        {gift.senderName}
                                      </h5>
                                      <span className="text-[8px] text-pink-600 font-mono truncate block leading-none">
                                        @{gift.senderUsername}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="text-right shrink-0">
                                    <span className="text-[10px] font-black font-mono text-amber-600 block leading-tight">
                                      🪙 {gift.price >= 1000 ? `${(gift.price / 1000).toFixed(gift.price % 1000 === 0 ? 0 : 1)}k` : gift.price}
                                    </span>
                                    <span className="text-[8px] text-emerald-600 font-mono font-bold leading-none block">
                                      ({gift.euroCost}€)
                                    </span>
                                  </div>
                                </div>

                                {/* Card Body: Icon & Compact Title */}
                                <div className="flex items-center gap-1.5">
                                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-50 to-pink-50 border border-amber-200/60 flex items-center justify-center text-base sm:text-lg shrink-0 group-hover:scale-110 transition-transform shadow-2xs">
                                    {gift.giftIcon}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-[11px] font-black text-slate-900 truncate font-serif leading-tight">
                                      {gift.giftName}
                                    </h4>
                                    <span className="text-[7px] font-mono uppercase font-bold text-amber-800 bg-amber-100/70 px-1 py-0.2 rounded inline-block leading-none mt-0.5">
                                      {gift.category === 'lujo' ? '👑 Lujo' : gift.category === 'intermedio' ? '💎 Joya' : '⭐ Esencial'}
                                    </span>
                                  </div>
                                </div>

                                {/* Compact 1-line quotation */}
                                <div className="text-[8.5px] italic text-slate-500 truncate font-serif bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100" title={gift.message}>
                                  "{gift.message}"
                                </div>

                                {/* Card Footer: Date & Quick Action Buttons */}
                                <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[8px] font-mono text-slate-400">
                                  <span className="truncate max-w-[65px]">{gift.dateFormatted.split('•')[0]}</span>

                                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedShowcaseGiftId(gift.id);
                                        if (isCert) {
                                          setShowCertificateModal(true);
                                        } else if (isWatch) {
                                          setActiveModalGift(gift);
                                          setShowLuxuryWatchModal(true);
                                        } else {
                                          setSelectedGenericModalGift({
                                            name: gift.giftName,
                                            icon: gift.giftIcon,
                                            price: gift.price,
                                            euroCost: gift.euroCost,
                                            senderName: gift.senderName,
                                            senderUsername: gift.senderUsername,
                                            senderAvatar: gift.senderAvatar,
                                            message: gift.message,
                                            dateFormatted: gift.dateFormatted,
                                            badgeText: `${gift.euroCost}€ OFICIAL VIP`
                                          });
                                          setShowGenericGiftModal(true);
                                        }
                                      }}
                                      className="px-1.5 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[8px] uppercase transition cursor-pointer flex items-center gap-0.5 shadow-2xs"
                                      title="Inspeccionar en grande"
                                    >
                                      <Sparkles className="w-2 h-2" />
                                      <span>{isCert ? '📜 Ver' : 'Ver'}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleThankSender(gift)}
                                      className="p-1 bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white border border-pink-200 rounded transition cursor-pointer"
                                      title={`Agradecer a ${gift.senderName}`}
                                    >
                                      <Heart className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      );
                    }

                    {/* VISTA 2: LIBRO DE CUSTODIA (TABLA DENSA PARA CIENTOS DE REGALOS) */}
                    return (
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-slate-900 text-amber-300 text-[10px] font-black uppercase tracking-wider border-b border-amber-500/20">
                              <tr>
                                <th className="px-3 py-2.5">Regalo / Pieza</th>
                                <th className="px-3 py-2.5">Donante (@usuario)</th>
                                <th className="px-3 py-2.5">Categoría</th>
                                <th className="px-3 py-2.5">Valor Custodiado</th>
                                <th className="px-3 py-2.5">Fecha</th>
                                <th className="px-3 py-2.5 text-right">Acciones</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              {filteredReceived.map((gift) => {
                                const isCert = gift.giftName.toLowerCase().includes('certificado');
                                const isWatch = gift.giftName.toLowerCase().includes('reloj');

                                return (
                                  <tr 
                                    key={gift.id}
                                    onClick={() => setSelectedShowcaseGiftId(gift.id)}
                                    className={`hover:bg-amber-50/40 transition cursor-pointer ${
                                      selectedShowcaseGiftId === gift.id ? 'bg-amber-50/80 font-bold' : ''
                                    }`}
                                  >
                                    <td className="px-3 py-2 flex items-center gap-2">
                                      <span className="text-base">{gift.giftIcon}</span>
                                      <span className="font-serif font-bold text-slate-900 text-xs truncate max-w-[140px] sm:max-w-xs">
                                        {gift.giftName}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2">
                                      <div className="flex items-center gap-1.5">
                                        <img src={gift.senderAvatar} alt={gift.senderName} className="w-5 h-5 rounded-full object-cover shrink-0" />
                                        <span className="truncate max-w-[120px] font-serif font-bold text-slate-800">{gift.senderName}</span>
                                        <span className="text-[9px] text-pink-600">@{gift.senderUsername}</span>
                                      </div>
                                    </td>
                                    <td className="px-3 py-2">
                                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase bg-amber-100 text-amber-900">
                                        {gift.category || 'lujo'}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2">
                                      <span className="font-bold text-amber-600 font-mono">🪙 {gift.price.toLocaleString()}</span>
                                      <span className="text-[9px] text-emerald-600 ml-1">({gift.euroCost}€)</span>
                                    </td>
                                    <td className="px-3 py-2 text-[10px] text-slate-400">
                                      {gift.dateFormatted}
                                    </td>
                                    <td className="px-3 py-2 text-right">
                                      <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedShowcaseGiftId(gift.id);
                                            if (isCert) {
                                              setShowCertificateModal(true);
                                            } else if (isWatch) {
                                              setActiveModalGift(gift);
                                              setShowLuxuryWatchModal(true);
                                            } else {
                                              setSelectedGenericModalGift({
                                                name: gift.giftName,
                                                icon: gift.giftIcon,
                                                price: gift.price,
                                                euroCost: gift.euroCost,
                                                senderName: gift.senderName,
                                                senderUsername: gift.senderUsername,
                                                senderAvatar: gift.senderAvatar,
                                                message: gift.message,
                                                dateFormatted: gift.dateFormatted,
                                                badgeText: `${gift.euroCost}€ OFICIAL VIP`
                                              });
                                              setShowGenericGiftModal(true);
                                            }
                                          }}
                                          className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-[9px] font-bold uppercase transition"
                                        >
                                          {isCert ? '📜 Ver' : 'Ver'}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleThankSender(gift)}
                                          className="px-2 py-1 bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white border border-pink-200 rounded text-[9px] font-bold transition"
                                        >
                                          ❤️ Agradecer
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}

                </div>
              )}

              {/* ======================================================== */}
              {/* SUB-VIEW 2: 🚀 REGALOS ENVIADOS (GIFTS I HAVE SENT)        */}
              {/* ======================================================== */}
              {giftsSubTab === 'sent' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Summary Metric Stats Banner for Sent Gifts */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50/60 p-4 rounded-2xl border border-pink-200/70 shadow-2xs">
                      <span className="text-[10px] font-mono font-black uppercase text-pink-600 block tracking-wider">Regalos Enviados</span>
                      <span className="text-2xl font-black font-serif text-slate-900 mt-1 block">{sentGifts.length}</span>
                      <span className="text-[11px] text-slate-500 font-medium">Entregados con éxito en directo</span>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50/60 p-4 rounded-2xl border border-amber-200/70 shadow-2xs">
                      <span className="text-[10px] font-mono font-black uppercase text-amber-700 block tracking-wider">Monedas Invertidas</span>
                      <span className="text-2xl font-black font-mono text-amber-600 mt-1 block">
                        🪙 {sentGifts.reduce((acc, g) => acc + g.price, 0).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-bold font-mono">
                        ≈ {sentGifts.reduce((acc, g) => acc + g.euroCost, 0).toLocaleString()}€ patrocinados
                      </span>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50/60 p-4 rounded-2xl border border-purple-200/70 shadow-2xs">
                      <span className="text-[10px] font-mono font-black uppercase text-purple-700 block tracking-wider">Modelo Favorita</span>
                      <span className="text-base font-extrabold font-serif text-slate-900 mt-1 truncate block flex items-center gap-1">
                        <Heart className="w-4 h-4 text-pink-500 fill-pink-500 shrink-0" />
                        Adriana Lima
                      </span>
                      <span className="text-[11px] text-purple-600 font-semibold font-mono">Destinataria Principal</span>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 p-4 rounded-2xl border border-emerald-200/70 shadow-2xs">
                      <span className="text-[10px] font-mono font-black uppercase text-emerald-700 block tracking-wider">Puntos de Mecenas</span>
                      <span className="text-2xl font-black font-mono text-emerald-600 mt-1 block">
                        +{sentGifts.reduce((acc, g) => acc + Math.floor(g.price / 10), 0)} pts
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">Nivel Mecenas Platino VIP</span>
                    </div>
                  </div>

                  {/* Filter & Search Bar for Sent Gifts */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none text-[11px] font-bold uppercase tracking-wider">
                      {[
                        { id: 'all', label: `Todos los Envíos (${sentGifts.length})`, icon: Gift },
                      ].map(cat => {
                        const Icon = cat.icon;
                        const isActive = sentCategoryFilter === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setSentCategoryFilter(cat.id as any)}
                            className={`px-3 py-1.5 rounded-full border transition-all duration-200 shrink-0 flex items-center gap-1 cursor-pointer select-none ${
                              isActive 
                                ? 'bg-pink-600 text-white border-pink-600 shadow-xs' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-pink-300 hover:text-pink-600'
                            }`}
                          >
                            <Icon className="w-3 h-3" />
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative w-full sm:w-72">
                        <input
                          type="text"
                          value={sentSearchQuery}
                          onChange={(e) => setSentSearchQuery(e.target.value)}
                          placeholder="Buscar por destinataria, regalo o mensaje..."
                          className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500 transition shadow-2xs"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>

                      <button
                        onClick={() => setGiftsSubTab('catalog')}
                        className="px-3.5 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-serif font-black flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Nuevo Regalo</span>
                      </button>
                    </div>
                  </div>

                  {/* Sent Gifts Grid - Tamaño más chico y compacto */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                    {(() => {
                      const filteredSent = sentGifts.filter(g => {
                        if (!isGiftInTimePeriod(g.timestamp, giftTimeFilter)) return false;
                        if (sentCategoryFilter !== 'all' && g.category !== sentCategoryFilter) return false;
                        if (sentSearchQuery) {
                          const q = sentSearchQuery.toLowerCase();
                          return (
                            g.giftName.toLowerCase().includes(q) ||
                            g.receiverName.toLowerCase().includes(q) ||
                            g.receiverUsername.toLowerCase().includes(q) ||
                            g.message.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      });

                      if (filteredSent.length === 0) {
                        return (
                          <div className="col-span-full bg-white rounded-2xl border border-dashed border-pink-200 p-6 text-center space-y-2">
                            <Clock className="w-7 h-7 text-pink-400 mx-auto" />
                            <h4 className="font-serif font-bold text-slate-800 text-xs sm:text-sm">
                              No hay regalos enviados en el período: {giftTimeFilter === 'actuales' ? 'Actuales (Última semana)' : giftTimeFilter === 'recientes' ? 'Recientes (Último mes)' : 'Antiguos (> 1 mes)'}
                            </h4>
                            <p className="text-[11px] text-slate-400 font-mono">
                              Selecciona otro período en los botones superiores para explorar más envíos o envía un nuevo regalo desde el catálogo.
                            </p>
                          </div>
                        );
                      }

                      return filteredSent.map((gift) => (
                        <div
                          key={gift.id}
                          className="bg-white rounded-xl border border-pink-100 p-2.5 sm:p-3 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-2 relative group text-left"
                        >
                          {/* Top row: Recipient Avatar & Details + Price */}
                          <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-100">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={gift.receiverAvatar}
                                alt={gift.receiverName}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-amber-400/60 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="text-[7.5px] uppercase font-mono font-bold text-amber-600 block tracking-wider leading-none">
                                  ENVIADO PARA:
                                </span>
                                <h4 className="text-[11px] font-bold text-slate-900 truncate font-serif flex items-center gap-1 leading-tight mt-0.5">
                                  {gift.receiverName}
                                </h4>
                                <span className="text-[9px] text-slate-400 font-mono truncate block leading-none">@{gift.receiverUsername}</span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-[11px] font-black font-mono text-amber-600 block leading-tight">🪙 {gift.price.toLocaleString()}</span>
                              <span className="text-[9px] text-emerald-600 font-mono font-bold leading-tight">({gift.euroCost}€)</span>
                            </div>
                          </div>

                          {/* Gift Badge & Name */}
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-sm shrink-0">
                              {gift.giftIcon}
                            </div>
                            <div className="min-w-0">
                              <span className="text-[11px] font-extrabold text-slate-800 block truncate font-serif leading-tight">
                                {gift.giftName}
                              </span>
                              <span className="text-[7.5px] uppercase font-mono font-bold px-1 py-0.2 rounded bg-amber-50 text-amber-800 inline-block leading-tight">
                                {gift.isExclusive ? '👑 Lujo VIP' : '✨ Detalle Especial'}
                              </span>
                            </div>
                          </div>

                          {/* Dedication Message */}
                          <div className="bg-amber-50/40 rounded-lg p-1.5 sm:p-2 border border-amber-100/60 text-[10px] italic text-slate-700 font-serif leading-snug line-clamp-2">
                            "{gift.message}"
                          </div>

                          {/* Bottom Row Actions */}
                          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-500">
                            <span className="flex items-center gap-1 text-emerald-600 font-bold text-[8.5px]">
                              <Check className="w-2.5 h-2.5" />
                              <span className="truncate max-w-[80px] sm:max-w-none">{gift.dateFormatted}</span>
                            </span>

                            <div className="flex items-center gap-1">
                              {gift.isExclusive && (
                                <button
                                  onClick={() => {
                                    setActiveModalGift(gift);
                                    setShowLuxuryWatchModal(true);
                                  }}
                                  className="px-1.5 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[8px] uppercase transition cursor-pointer flex items-center gap-0.5"
                                  title="Ver Animación de Lujo"
                                >
                                  <Sparkles className="w-2 h-2" />
                                  <span>3D</span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setRecipientModelId(models.find(m => m.name === gift.receiverName)?.id || 'topf-1');
                                  setGiftsSubTab('catalog');
                                }}
                                className="px-2 py-0.5 bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white border border-pink-200 rounded font-bold text-[8.5px] transition cursor-pointer flex items-center gap-0.5"
                              >
                                <Send className="w-2.5 h-2.5" />
                                <span>Enviar otro</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* SUB-VIEW 3: ✨ CATÁLOGO DE REGALOS & ENVIAR EN DIRECTO   */}
              {/* ======================================================== */}
              {giftsSubTab === 'catalog' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Bottom Notice & Saldo Bar */}
                  <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
                      <p className="text-xs text-slate-600 font-medium">
                        <strong className="text-slate-800">Catálogo de regalos</strong> · Tu saldo disponible: <span className="font-mono font-black text-pink-600 text-sm">🪙 {userGiftBalance.toLocaleString()}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setUserGiftBalance(prev => prev + 2500);
                          window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                            detail: { icon: '🪙' }
                          }));
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Recargar Monedas</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('ranking')}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition cursor-pointer"
                      >
                        Volver al Ranking
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* Luxury Fullscreen Animation Modal for "Reloj de Oro" / Exclusive Gifts */}
              {showLuxuryWatchModal && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
                  <div className="bg-gradient-to-b from-[#1c1917] via-[#121113] to-[#0a0a0b] rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.5)] space-y-6 text-white text-center relative overflow-hidden">
                    <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl" />
                    
                    <button
                      onClick={() => {
                        setShowLuxuryWatchModal(false);
                        setActiveModalGift(null);
                      }}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
                    >
                      ✕
                    </button>

                    <div className="space-y-1">
                      <span className="text-xs font-mono font-black uppercase text-amber-400 tracking-widest block">
                        👑 ALTA JOYERÍA EN DIRECTO 👑
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif font-black text-amber-100">
                        {activeModalGift?.giftName || 'Reloj de Oro 18K'} {activeModalGift?.giftIcon || '⌚'} Pasarela
                      </h3>
                      <p className="text-xs text-amber-200/80 font-mono">
                        Certificado Oficial Casting Live VIP Fashion Finances
                      </p>
                    </div>

                    {/* Animated 3D Shimmer Watch Dial */}
                    <div className="relative py-4 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-700 p-2 shadow-[0_0_40px_rgba(245,158,11,0.6)] animate-pulse relative">
                        <div className="w-full h-full bg-[#0a090b] rounded-full border-2 border-amber-400/60 flex flex-col items-center justify-center relative overflow-hidden">
                          <span className="text-[9px] font-mono font-black tracking-widest text-amber-300 uppercase mt-4">
                            CASTING LIVE
                          </span>
                          <span className="text-[6px] text-amber-500 font-mono tracking-wider uppercase">
                            GENEVA • 18K SOLID GOLD
                          </span>
                          
                          {/* Center Ticking Hands */}
                          <div className="w-3 h-3 rounded-full bg-amber-400 z-20 my-2 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-black" />
                          </div>

                          <div 
                            className="absolute w-1 h-12 bg-amber-300 rounded-full origin-bottom -translate-y-6" 
                            style={{ transform: 'rotate(290deg)' }}
                          />
                          <div 
                            className="absolute w-0.5 h-16 bg-amber-100 rounded-full origin-bottom -translate-y-8" 
                            style={{ transform: 'rotate(70deg)' }}
                          />
                          <div 
                            className="absolute w-[1.5px] h-18 bg-red-500 rounded-full origin-bottom -translate-y-9" 
                            style={{ transform: `rotate(${watchTickAngle}deg)` }}
                          />

                          <span className="text-[8px] font-mono text-emerald-400 font-bold mt-auto mb-3">
                            EDICIÓN 01 / 10
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#242228]/80 p-4 rounded-2xl border border-amber-500/20 text-left space-y-2 text-xs">
                      <div className="flex justify-between items-center text-amber-300 font-mono">
                        <span>Regalado por: <strong>{activeModalGift?.senderName || 'Ernesto vs'}</strong></span>
                        <span>Destinataria: <strong>{activeModalGift?.receiverName || 'Adriana Lima'}</strong></span>
                      </div>
                      <p className="text-slate-300 italic font-serif">
                        "{activeModalGift?.message || '¡Para la mejor modelo y embajadora de la pasarela internacional! Disfruta de este reloj de oro exclusivo. ✨👑'}"
                      </p>
                      <div className="pt-2 border-t border-white/10 flex justify-between items-center text-emerald-400 font-mono text-[11px]">
                        <span>✅ Entrega autenticada y registrada</span>
                        <span>Valor: 🪙 {(activeModalGift?.price || 5000).toLocaleString()} ({(activeModalGift?.euroCost || 5000).toLocaleString()}€)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleSendGift(CHANNEL_EXTRA_GIFTS.find(g => g.name === 'Reloj de oro') || CHANNEL_EXTRA_GIFTS[4]);
                        setShowLuxuryWatchModal(false);
                      }}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm py-3.5 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Enviar "Reloj de oro" a Adriana Lima</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 📜 CERTIFICADO PROFESIONAL FULLSCREEN MODAL (High-Resolution Official Diploma) */}
              {showCertificateModal && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto">
                  <div className="relative max-w-2xl w-full my-auto">
                    
                    {/* Close Button */}
                    <button
                      onClick={() => setShowCertificateModal(false)}
                      className="absolute -top-3 -right-3 z-30 bg-slate-900 text-white hover:bg-pink-600 w-9 h-9 rounded-full border-2 border-amber-400 shadow-xl flex items-center justify-center transition cursor-pointer font-bold"
                    >
                      ✕
                    </button>

                    {/* Outer Gold Framed Certificate Card */}
                    <div className="bg-gradient-to-b from-[#fdfbf7] via-[#f7f2e5] to-[#ece1c5] rounded-3xl p-6 sm:p-10 border-4 border-amber-600 shadow-[0_0_60px_rgba(245,158,11,0.6)] text-slate-900 relative overflow-hidden">
                      
                      {/* Classical Ornate Double Border */}
                      <div className="absolute inset-3 sm:inset-4 border-2 border-amber-700/40 rounded-2xl pointer-events-none" />
                      <div className="absolute inset-4 sm:inset-5 border border-dashed border-amber-600/30 rounded-xl pointer-events-none" />
                      
                      {/* Corner Flourishes */}
                      <span className="absolute top-5 left-5 text-amber-800 text-base pointer-events-none select-none">⚜️</span>
                      <span className="absolute top-5 right-5 text-amber-800 text-base pointer-events-none select-none">⚜️</span>
                      <span className="absolute bottom-5 left-5 text-amber-800 text-base pointer-events-none select-none">⚜️</span>
                      <span className="absolute bottom-5 right-5 text-amber-800 text-base pointer-events-none select-none">⚜️</span>

                      {/* Watermark */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                        <div className="text-center font-serif text-8xl font-black tracking-widest text-amber-950">
                          VS RUNWAY
                        </div>
                      </div>

                      {/* Top Crest */}
                      <div className="text-center space-y-1 relative z-10">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 text-white shadow-md border-2 border-amber-200 mb-1">
                          <span className="text-2xl">👑</span>
                        </div>
                        <p className="text-[10px] sm:text-xs font-mono font-black tracking-[0.25em] text-amber-900 uppercase">
                          VICTORIA'S SECRET • FASHION FINANCES RUNWAY
                        </p>
                        <p className="text-[9px] font-mono text-amber-800/80 uppercase tracking-wider">
                          CONSEJO INTERNACIONAL DE ALTA COSTURA & CASTING LIVE
                        </p>
                        <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto my-2" />
                      </div>

                      {/* Big Title */}
                      <div className="text-center my-4 sm:my-5 relative z-10">
                        <span className="px-3 py-1 bg-amber-200/80 border border-amber-500/40 rounded-full text-[10px] font-mono font-extrabold tracking-widest uppercase text-amber-950">
                          ★ DIPLOMA DE EXCELENCIA & HOMOLOGACIÓN ★
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-serif font-black text-amber-950 tracking-wide mt-2">
                          CERTIFICADO PROFESIONAL
                        </h2>
                        <p className="text-xs sm:text-sm font-serif italic text-amber-900/90 mt-1">
                          Especialidad en Pasarela de Moda, Presencia Escénica y Estilismo VIP
                        </p>
                      </div>

                      {/* Certificate Text & Recipient */}
                      <div className="text-center space-y-3 relative z-10 px-2 sm:px-6">
                        <p className="text-xs sm:text-sm text-slate-700 font-serif">
                          Por la presente se certifica con plena validez oficial que:
                        </p>
                        
                        <div className="py-2.5 px-6 bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 border-2 border-amber-500/60 rounded-2xl shadow-inner inline-block max-w-full">
                          <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-950 uppercase tracking-wider">
                            Ernesto vs
                          </h3>
                          <span className="text-[10px] font-mono text-amber-900 font-bold block">
                            Titular Registrado & Mecenas Oficial Runway #VS-0884
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 font-serif leading-relaxed max-w-lg mx-auto">
                          Ha completado y superado las evaluaciones oficiales del certamen de alta costura <strong>Fashion Finances París 2026</strong>, acreditando su excelencia profesional con condecoración de honor.
                        </p>
                      </div>

                      {/* Valuation, Seal & Signatures Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center mt-6 pt-5 border-t border-amber-700/20 relative z-10 text-center sm:text-left">
                        
                        {/* Signatures */}
                        <div className="space-y-1">
                          <div className="border-b border-amber-900/40 pb-1 text-center">
                            <span className="font-serif italic text-base text-amber-950 font-bold">Adriana Lima</span>
                          </div>
                          <span className="text-[9px] font-mono text-slate-600 block text-center uppercase">
                            Directora de Pasarela
                          </span>
                        </div>

                        {/* Wax Seal */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-800 via-red-600 to-red-900 border-2 border-amber-300 shadow-xl flex flex-col items-center justify-center text-amber-200 relative transform hover:scale-105 transition">
                            <span className="text-lg leading-none">👑</span>
                            <span className="text-[6px] font-mono font-black uppercase tracking-tighter mt-0.5">OFICIAL</span>
                            <div className="absolute inset-1 rounded-full border border-dashed border-amber-200/40 pointer-events-none" />
                          </div>
                          <span className="text-[8px] font-mono font-extrabold text-amber-950 mt-1 uppercase">
                            SELLO AUTÉNTICO 2026
                          </span>
                        </div>

                        {/* Valuation & Registration */}
                        <div className="space-y-1 text-center sm:text-right font-mono">
                          <span className="text-[10px] text-amber-900 font-bold block">
                            REG-ID: #VS-CERT-2026-0884
                          </span>
                          <span className="text-xs font-black text-slate-900 bg-amber-200/80 px-2 py-0.5 rounded border border-amber-400 inline-block">
                            🪙 500 Monedas (500.00€)
                          </span>
                          <span className="text-[9px] text-slate-500 block">
                            Emisión: 16 Ago 2026
                          </span>
                        </div>
                      </div>

                      {/* Modal Action Buttons */}
                      <div className="mt-6 pt-4 border-t border-amber-700/20 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
                        <button
                          onClick={() => {
                            window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                              detail: { icon: '📜' }
                            }));
                            alert('📜 ¡Certificado Oficial descargado con éxito en formato de alta resolución!');
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-mono font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Descargar Diploma Oficial (PDF)</span>
                        </button>

                        <button
                          onClick={() => {
                            const certGift = CHANNEL_EXTRA_GIFTS.find(g => g.name.toLowerCase().includes('certificado')) || {
                              id: 'g-1',
                              name: 'Certificado prof.',
                              price: 500,
                              icon: '📜',
                              category: 'basico'
                            };
                            handleSendGift(certGift as any);
                            setShowCertificateModal(false);
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar a {models.find(m => m.id === recipientModelId)?.name || 'Adriana Lima'} (🪙 500)</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* 🎁 GENERIC GIFT FULLSCREEN INSPECTION MODAL */}
              {showGenericGiftModal && selectedGenericModalGift && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
                  <div className="bg-gradient-to-b from-[#1c1917] via-[#121113] to-[#0a0a0b] rounded-3xl p-6 sm:p-8 max-w-lg w-full border-2 border-amber-400/80 shadow-[0_0_50px_rgba(245,158,11,0.4)] space-y-6 text-white text-center relative overflow-hidden">
                    <div className="absolute -top-16 -left-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl" />
                    
                    <button
                      onClick={() => {
                        setShowGenericGiftModal(false);
                        setSelectedGenericModalGift(null);
                      }}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
                    >
                      ✕
                    </button>

                    <div className="space-y-1">
                      <span className="text-xs font-mono font-black uppercase text-amber-400 tracking-widest block">
                        🎁 REGALO OFICIAL EN DIRECTO 🎁
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
                        {selectedGenericModalGift.name} <span className="text-2xl">{selectedGenericModalGift.icon}</span>
                      </h3>
                      <p className="text-xs text-amber-200/80 font-mono">
                        {selectedGenericModalGift.badgeText || 'Colección Fashion Finances Runway 2026'}
                      </p>
                    </div>

                    {/* Animated Icon Container */}
                    <div className="py-4 flex items-center justify-center">
                      <div className="w-36 h-36 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-pink-500/20 to-purple-500/20 border-2 border-amber-400/60 p-4 shadow-[0_0_35px_rgba(245,158,11,0.35)] flex items-center justify-center text-6xl animate-pulse">
                        <span>{selectedGenericModalGift.icon}</span>
                      </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-[#242228]/80 p-4 rounded-2xl border border-amber-500/20 text-left space-y-2 text-xs">
                      <div className="flex justify-between items-center text-amber-300 font-mono">
                        <span>Remitente: <strong>{selectedGenericModalGift.senderName}</strong></span>
                        <span>Destinataria: <strong>{models.find(m => m.id === recipientModelId)?.name || 'Adriana Lima'}</strong></span>
                      </div>
                      <p className="text-slate-300 italic font-serif">
                        "{selectedGenericModalGift.message}"
                      </p>
                      <div className="pt-2 border-t border-white/10 flex justify-between items-center text-emerald-400 font-mono text-[11px]">
                        <span>✅ Entrega autenticada y registrada</span>
                        <span>Valor: 🪙 {selectedGenericModalGift.price.toLocaleString()} ({selectedGenericModalGift.euroCost.toLocaleString()}€)</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => {
                        const giftObj = CHANNEL_EXTRA_GIFTS.find(g => g.name === selectedGenericModalGift.name) || {
                          id: 'g-custom',
                          name: selectedGenericModalGift.name,
                          price: selectedGenericModalGift.price,
                          icon: selectedGenericModalGift.icon,
                          category: 'basico'
                        };
                        handleSendGift(giftObj as any);
                        setShowGenericGiftModal(false);
                      }}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm py-3.5 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Enviar "{selectedGenericModalGift.name}" a {models.find(m => m.id === recipientModelId)?.name || 'Adriana Lima'} (🪙 {selectedGenericModalGift.price.toLocaleString()})</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Slogan details line */}
          <div className="text-center text-[10px] text-slate-400 font-mono tracking-[0.3em] pt-4 border-t border-pink-100/30 flex items-center justify-center gap-1.5">
            <span>UN SUEÑO. UNA PASARELA. ERES TÚ.</span>
            <span>💖</span>
            <span className="font-bold text-pink-600 uppercase">FASHIONS FINANCE</span>
          </div>

        </div>

        {/* Footer lockup bar */}
        <div className="bg-white/95 p-4 text-center border-t border-pink-100/50 text-[10px] tracking-wider text-slate-400 uppercase font-mono z-10 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="font-bold text-pink-600">💖 Promocionado oficialmente por Fashion Finances Runway S.A.</span>
          <span>Actualizado hace unos instantes</span>
        </div>

      </div>
    </div>
  );
}
