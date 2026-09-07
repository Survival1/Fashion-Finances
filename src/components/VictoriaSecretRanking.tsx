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
  Building2
} from 'lucide-react';
import FashionsFinanceLogo from './FashionsFinanceLogo';
import { BALMAIN_LOGO_DATA_URL, COUTURE_ELITE_LOGO_DATA_URL } from '../utils/brandLogos';
import RoyalMaleCrown from './RoyalMaleCrown';

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
    giftName: 'Reloj de oro',
    giftIcon: '⌚',
    price: 5000,
    euroCost: 5000,
    message: '¡Para mi mecenas de honor en Fashion Finances! Gracias por impulsar la pasarela de alta costura y mis castings de París. ✨👑',
    dateFormatted: '16 ago 2026 • 14:30',
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
    dateFormatted: '15 ago 2026 • 19:15',
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
    dateFormatted: '14 ago 2026 • 11:00',
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
    dateFormatted: '13 ago 2026 • 18:40',
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
    dateFormatted: '12 ago 2026 • 21:00',
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
    dateFormatted: '11 ago 2026 • 16:20',
    timestamp: Date.now() - 1000 * 60 * 60 * 130, // Hace 5 días
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
}

function PodiumModelMedia({
  model,
  place,
  widthClass,
  heightClass,
  borderColorClass,
  defaultVideoIndex
}: PodiumModelMediaProps) {
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isMale = (model as any).gender === 'male';
  const videoSrc = model?.videoUrl || (isMale 
    ? PRESET_MALE_VIDEOS[defaultVideoIndex % PRESET_MALE_VIDEOS.length] 
    : PRESET_FEMALE_VIDEOS[defaultVideoIndex % PRESET_FEMALE_VIDEOS.length]);

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
    <div className={`${widthClass} ${heightClass} rounded-t-full overflow-hidden border-[1px] ${borderColorClass} shadow-xl bg-slate-950 p-0 relative z-10 group/podium-media`}>
      <div className="w-full h-full rounded-t-full overflow-hidden relative bg-slate-900">
        {!videoError ? (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={model?.avatar}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover group-hover/podium-media:scale-108 transition-transform duration-500"
          />
        ) : (
          <img
            src={model?.avatar}
            alt={model?.name || 'Modelo'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover/podium-media:scale-108 transition-transform duration-500"
          />
        )}

        {/* 🟢 EN LÍNEA badge overlay top center (centered on the arch) */}
        <div className="absolute top-2.5 sm:top-3 left-1/2 -translate-x-1/2 z-25 pointer-events-none">
          <span className="bg-emerald-600/95 text-white font-sans font-black text-[7.5px] sm:text-[8.5px] px-2.5 py-0.5 rounded-md tracking-wider animate-pulse shadow-md border border-white/40 backdrop-blur-xs flex items-center gap-1 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            EN LÍNEA
          </span>
        </div>

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
}

export default function VictoriaSecretRanking({
  isOpen,
  onClose,
  models,
  onSelectModel,
  onNavigateToStore,
}: VictoriaSecretRankingProps) {
  const [activeTab, setActiveTab] = useState<'ranking' | 'premios' | 'hall_of_fame' | 'boutique' | 'regalos'>('ranking');
  const [rankingSearchQuery, setRankingSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [sponsorCount, setSponsorCount] = useState<1 | 2 | 3>(3);
  const [boutiqueCategory, setBoutiqueCategory] = useState<'all' | 'alas' | 'lenceria' | 'joyeria' | 'perfumes'>('all');
  const [boutiqueSearchQuery, setBoutiqueSearchQuery] = useState<string>('');
  const [selectedBoutiqueHouseFilter, setSelectedBoutiqueHouseFilter] = useState<string>('all');
  const [boutiqueGiftModelSearch, setBoutiqueGiftModelSearch] = useState<string>('');
  const [boutiqueCustomGiftMessage, setBoutiqueCustomGiftMessage] = useState<string>('');
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [selectedBoutiqueItemForGift, setSelectedBoutiqueItemForGift] = useState<BoutiqueCatalogItem | null>(null);

  // Boutique dynamic filters
  const boutiqueHousesList = useMemo(() => {
    // Return all 12 boutiques from BOUTIQUE_STORES_INFO in exact order matching z.png
    return BOUTIQUE_STORES_INFO.map(s => s.name);
  }, []);

  const filteredBoutiqueCatalog = useMemo(() => {
    return BOUTIQUE_CATALOG_ITEMS.filter(item => {
      if (boutiqueCategory !== 'all' && item.category !== boutiqueCategory) {
        return false;
      }
      if (selectedBoutiqueHouseFilter !== 'all' && item.boutiqueHouse !== selectedBoutiqueHouseFilter) {
        return false;
      }
      if (boutiqueSearchQuery.trim() !== '') {
        const q = boutiqueSearchQuery.toLowerCase().trim();
        const storeMeta = BOUTIQUE_STORES_INFO.find(s => s.name.toLowerCase() === item.boutiqueHouse.toLowerCase());
        const matchesHandle = storeMeta ? storeMeta.username.toLowerCase().includes(q) : false;
        const matchesStoreStyle = storeMeta ? storeMeta.style.toLowerCase().includes(q) : false;
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesHouse = item.boutiqueHouse.toLowerCase().includes(q);
        const matchesCity = item.boutiqueCity.toLowerCase().includes(q);
        const matchesEndorsed = item.endorsedBy.toLowerCase().includes(q);
        const matchesTag = item.tag.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        return matchesName || matchesHouse || matchesCity || matchesEndorsed || matchesTag || matchesDesc || matchesCat || matchesHandle || matchesStoreStyle;
      }
      return true;
    });
  }, [boutiqueCategory, selectedBoutiqueHouseFilter, boutiqueSearchQuery]);

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
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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

  // Time filter: Actuales (≤ 7 days), Recientes (8 to 30 days), Antiguos (> 30 days)
  const [giftTimeFilter, setGiftTimeFilter] = useState<'actuales' | 'recientes' | 'antiguos'>('actuales');

  const isGiftInTimePeriod = (timestamp: number, filter: 'actuales' | 'recientes' | 'antiguos') => {
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

  if (!isOpen) return null;

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

  // Master sorted list of exactly 100 items
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

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center bg-[#fdf2f8]/70 backdrop-blur-xl overflow-y-auto p-0 sm:px-2 md:px-4 pt-0 animate-fade-in font-sans">
      
      {/* Glamorous High-Fashion Backdrop Simulation with Soft Pink Curtains and Spotlight */}
      <div className="absolute inset-0 bg-radial-gradient(circle_at_center,rgba(253,242,248,0.73)_0%,rgba(252,231,243,0.92)_100%) pointer-events-none" />
      
      {/* Decorative vertical theater drapery columns on sides - matching zx.png perfectly */}
      <div className="absolute top-0 bottom-0 left-0 w-3 sm:w-8 md:w-12 lg:w-16 bg-gradient-to-r from-[#880e4f] via-[#ec4899] to-[#fbcfe8] border-r-2 border-[#f472b6] opacity-95 shadow-[8px_0_20px_rgba(0,0,0,0.18)] pointer-events-none z-0">
        <div className="w-full h-full opacity-30 bg-[linear-gradient(90deg,transparent_40%,rgba(255,255,255,0.3)_50%,transparent_60%)] bg-[size:16px_100%] animate-pulse" style={{ animationDuration: '8s' }} />
      </div>
      <div className="absolute top-0 bottom-0 right-0 w-3 sm:w-8 md:w-12 lg:w-16 bg-gradient-to-l from-[#880e4f] via-[#ec4899] to-[#fbcfe8] border-l-2 border-[#f472b6] opacity-95 shadow-[-8px_0_20px_rgba(0,0,0,0.18)] pointer-events-none z-0">
        <div className="w-full h-full opacity-30 bg-[linear-gradient(90deg,transparent_40%,rgba(255,255,255,0.3)_50%,transparent_60%)] bg-[size:16px_100%] animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      {/* Main Glassmorphic Panel (Extremely Clear, Premium, Glossy and Clean Design) */}
      <div className="bg-white/95 border border-white/60 rounded-t-none rounded-b-[32px] w-full max-w-[1400px] overflow-hidden shadow-[0_20px_60px_rgba(219,39,119,0.15)] relative text-slate-800 mt-0 mb-4 md:mb-8 flex flex-col max-h-none md:max-h-[100vh] animate-scale-up">
        
        {/* Soft luxury top runway light stripe */}
        <div className="h-1.5 bg-gradient-to-r from-pink-300 via-rose-400 to-pink-350 w-full" />

        {/* 🎀 TOP HEADER IN THE EXACT LAYOUT FROM THE ATTACHED DESIGN MOCKUP */}
        <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center bg-white/70 border-b border-pink-100/50 relative z-10 gap-4 sm:gap-2">
          
          {/* Brand Logo Replacement: Fashion Finances instead of Victoria's Secret */}
          <div className="flex items-center gap-2 select-none hover:opacity-90 transition">
            <FashionsFinanceLogo className="w-8 h-8" mode="light" withText={true} inlineText={true} textClassName="text-pink-900" subTextClassName="text-pink-500" />
          </div>

          {/* Middle Navigation options exactly as listed in the mockup with Boutique button added */}
          <div className="flex items-center gap-2 sm:gap-4 text-[10px] md:text-xs font-bold uppercase tracking-[0.18em] text-slate-500 flex-wrap justify-center">
            <button 
              onClick={() => setActiveTab('ranking')}
              className={`px-3 py-1.5 border transition-all duration-300 cursor-pointer ${
                activeTab === 'ranking' 
                  ? 'border-pink-600 bg-pink-50 text-pink-600 font-black shadow-xs' 
                  : 'border-slate-300 hover:border-pink-400 hover:text-pink-600 text-slate-700 bg-white/60'
              }`}
              id="tab-ranking-nav"
            >
              RANKING
            </button>
            <button 
              onClick={() => setActiveTab('premios')}
              className={`px-3 py-1.5 border transition-all duration-300 cursor-pointer ${
                activeTab === 'premios' 
                  ? 'border-pink-600 bg-pink-50 text-pink-600 font-black shadow-xs' 
                  : 'border-slate-300 hover:border-pink-400 hover:text-pink-600 text-slate-700 bg-white/60'
              }`}
              id="tab-premios-nav"
            >
              PREMIOS
            </button>
            <button 
              onClick={() => setActiveTab('hall_of_fame')}
              className={`px-3 py-1.5 border transition-all duration-300 cursor-pointer ${
                activeTab === 'hall_of_fame' 
                  ? 'border-pink-600 bg-pink-50 text-pink-600 font-black shadow-xs' 
                  : 'border-slate-300 hover:border-pink-400 hover:text-pink-600 text-slate-700 bg-white/60'
              }`}
              id="tab-hall-nav"
            >
              HALL OF FAME
            </button>
            <button 
              onClick={() => setActiveTab('boutique')}
              className={`px-3 py-1.5 border transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'boutique' 
                  ? 'border-pink-600 bg-pink-50 text-pink-600 font-black shadow-xs' 
                  : 'border-slate-300 hover:border-pink-400 hover:text-pink-600 text-slate-700 bg-white/60'
              }`}
              id="tab-boutique-nav"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              BOUTIQUE
            </button>
            <button 
              onClick={() => setActiveTab('regalos')}
              className={`px-3 py-1.5 border transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'regalos' 
                  ? 'border-pink-600 bg-pink-50 text-pink-600 font-black shadow-xs' 
                  : 'border-slate-300 hover:border-pink-400 hover:text-pink-600 text-slate-700 bg-white/60'
              }`}
              id="tab-regalos-nav"
            >
              <Gift className="w-3.5 h-3.5" />
              REGALOS
            </button>
          </div>

          {/* Classic luxury Back pill button on the right */}
          <button
            onClick={onClose}
            className="bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-600 font-extrabold text-[10px] md:text-xs px-5 py-2.5 rounded-full transition-all duration-300 border border-pink-100 shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>‹</span> VOLVER
          </button>
        </div>

        {/* Scrollable Center Runway Container */}
        <div className="p-4 sm:p-8 md:p-10 space-y-8 relative z-10 overflow-y-auto">
          
          {/* Render Active Tab Content */}

          {activeTab === 'ranking' && (
            <>
              {/* ✨ MAIN PRESTIGE TITLE CONTAINER WITH HIGH-FASHION TYPOGRAPHY */}
              <div className="text-center space-y-2 relative">
                
                {/* Crown Motif ontop of the title - Serious and Elegant High-Fashion Vector Crown */}
                <div className="flex justify-center mb-1">
                  <svg 
                    className="w-10 h-7 text-amber-500 fill-amber-400 drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)]" 
                    viewBox="0 0 100 50" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M15,40 L20,16 L42,26 L50,9 L58,26 L80,16 L85,40 Z" 
                      stroke="#B45309" 
                      strokeWidth="1.8" 
                      strokeLinejoin="round" 
                      fill="currentColor"
                      fillOpacity="0.85"
                    />
                    <rect x="12" y="40" width="76" height="3" fill="#B45309" rx="1" />
                    <circle cx="20" cy="16" r="2.2" fill="#FFF" />
                    <circle cx="50" cy="9" r="2.2" fill="#FFF" />
                    <circle cx="80" cy="16" r="2.2" fill="#FFF" />
                  </svg>
                </div>

                <h2 className="text-2xl font-light tracking-[0.35em] text-pink-900/90 uppercase font-serif">
                  THE ANGELS
                </h2>
                <h1 className="text-4xl md:text-5xl font-black tracking-widest uppercase leading-none text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-amber-700 font-serif filter drop-shadow-xs">
                  RANKING
                </h1>
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.32em] font-mono">
                  LAS MODELOS MÁS ADMIRADAS EN TIEMPO REAL
                </p>
                
                {/* Little pink updated badge */}
                <div className="inline-block mt-3 bg-pink-100/60 border border-pink-200/40 text-[9px] font-bold text-pink-600 uppercase tracking-widest px-3 py-1 rounded-full">
                  ✨ ACTUALIZADO CADA 60 SEGUNDOS
                </div>
              </div>

              {/* 📢 PRESTIGE CONTEST RULES EXPLANATION */}
              <div className="bg-gradient-to-r from-pink-50/80 to-amber-50/40 border-2 border-pink-100/60 rounded-2xl p-4 sm:p-5 text-slate-700 text-xs md:text-sm leading-relaxed shadow-xs max-w-5xl mx-auto flex items-start gap-3.5 text-left">
                <div className="bg-pink-100 p-2.5 rounded-xl shrink-0 text-pink-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <strong className="text-pink-950 font-black block text-xs md:text-sm uppercase tracking-wider font-display">💡 ¿En qué consiste este prestigioso concurso?</strong>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    El modelo que más <strong>Likes</strong> acumule en las fotos de su perfil y en sus vídeos será coronado como la número 1. Si logras posicionarte entre las 100 afortunadas de esta pasarela estelar, podrás <strong>ganar el patrocinio de un gran grupo de inversores</strong> en nuestras mesas.
                  </p>
                </div>
              </div>

              {/* 🏆 THE COUTURE PODIUM GRID (Exact 2, 1, 3 visual architecture from mockup) */}
              {firstPlace ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 items-end max-w-5xl mx-auto pt-6 px-2">
                  
                  {/* RANKING #2 : MODELO ORO (ELITE ORO) - LEFT BAR */}
                  {secondPlace && (
                    <div className="flex flex-col items-center order-2 md:order-1 group transition-transform duration-500 hover:-translate-y-1 relative">
                      
                      {/* Decorative Arch Portrait representation */}
                      <div className="relative mb-4 flex flex-col items-center">
                        
                        {/* Smooth pink studio semicircles peeking from behind the arch */}
                        <div className="absolute w-36 sm:w-44 h-22 sm:h-26 -left-3 top-[28%] bg-[#FD7CBB]/75 rounded-full pointer-events-none z-0 shadow-sm" />
                        <div className="absolute w-36 sm:w-44 h-22 sm:h-26 -right-3 top-[28%] bg-[#FD7CBB]/75 rounded-full pointer-events-none z-0 shadow-sm" />

                        {/* Highly Polished Arched Frame Overlay with 1px border and live video */}
                        <PodiumModelMedia
                          model={secondPlace}
                          place={2}
                          widthClass="w-32 sm:w-36 md:w-40"
                          heightClass="h-44 sm:h-50 md:h-54"
                          borderColorClass="border-[#FBBFCE]"
                          defaultVideoIndex={1}
                        />

                        {/* White Name badge overlaying bottom boundary exactly as in zx.png */}
                        <div className="absolute bottom-1 z-20 bg-white border border-slate-200 rounded-md px-3.5 py-1.5 shadow-md text-center min-w-[75%]">
                          <span className="text-[10px] font-mono font-black text-slate-800 tracking-widest uppercase block leading-none">
                            {secondPlace.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Votos and Name block */}
                      <div className="text-center space-y-0.5 w-full z-15 pt-0.5 px-1 mb-2">
                        <h4 className="text-[12px] sm:text-sm font-bold text-slate-900 tracking-wide truncate">
                          {secondPlace.name}
                        </h4>
                        <div className="inline-flex items-center gap-0.5 text-[#E12A75] text-[11px] font-bold">
                          <strong>♥ {(secondPlace.totalLikes || 14717).toLocaleString()} votos</strong>
                        </div>
                      </div>

                      {/* White Pedestal Column 2 - matching zx.png perfectly */}
                      <div className="w-full bg-white border border-pink-100 rounded-xl shadow-xs p-4 flex flex-col items-center justify-center relative min-h-[140px]">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-400 to-rose-450 rounded-t-xl" />
                        
                        {/* Upper label of Pedestal */}
                        <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#B93259] mb-1 font-sans">
                          MODELO ORO
                        </span>
                        
                        <span className="font-serif font-bold text-4xl text-[#E12A75] my-1 leading-none">
                          2
                        </span>
                        
                        <div className="text-[9px] text-[#E12A75] font-semibold uppercase tracking-[0.14em] mt-1.5">
                          ✦ ANGEL ELITE ✦
                        </div>

                        <button
                          onClick={() => onSelectModel && onSelectModel(secondPlace)}
                          className="text-[10px] text-[#E12A75] hover:text-pink-800 font-bold underline bg-transparent cursor-pointer border-0 mt-3.5 z-20"
                        >
                          Ver Ficha
                        </button>
                      </div>

                      {/* Brand Sponsors Row for 2nd place */}
                      <div className="mt-3 w-full bg-gradient-to-tr from-stone-50/50 to-white/95 border border-pink-100/60 rounded-2xl p-2.5 shadow-xs space-y-1.5 text-center">
                        <span className="text-[8px] font-black tracking-[0.16em] uppercase text-pink-700/90 block">
                          💎 SPONSORS DE ÉLITE 💎
                        </span>
                        <div className="flex items-center justify-around gap-1.5 pt-1.5 border-t border-pink-100/50">
                          {/* Gucci */}
                          <div 
                            onClick={() => onNavigateToStore && onNavigateToStore('gucci')}
                            className="flex flex-col items-center justify-center group/brand hover:scale-110 active:scale-95 transition-all cursor-pointer"
                            title="Ir a boutique de Gucci"
                          >
                            <div className="w-7 h-7 rounded-full bg-[#1b3c22] border border-[#811f26] flex items-center justify-center text-[#d5af66] font-semibold text-[8px] shadow-xs group-hover/brand:shadow-md">
                              GG
                            </div>
                            <span className="text-[7.5px] font-sans font-bold tracking-[0.12em] text-slate-700 mt-1 uppercase group-hover/brand:text-emerald-700">Gucci</span>
                          </div>
                          {/* Versace */}
                          <div 
                            onClick={() => onNavigateToStore && onNavigateToStore('versace')}
                            className="flex flex-col items-center justify-center group/brand hover:scale-110 active:scale-95 transition-all cursor-pointer"
                            title="Ir a boutique de Versace"
                          >
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-500 p-0.5 shadow-xs group-hover/brand:shadow-md">
                              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-[#d5af66] font-serif text-[7.5px] font-bold">
                                V
                              </div>
                            </div>
                            <span className="text-[7.5px] font-serif font-bold tracking-wider text-slate-700 mt-1 uppercase group-hover/brand:text-amber-600">Versace</span>
                          </div>
                          {/* Balenciaga */}
                          <div 
                            onClick={() => onNavigateToStore && onNavigateToStore('balenciaga')}
                            className="flex flex-col items-center justify-center group/brand hover:scale-110 active:scale-95 transition-all cursor-pointer"
                            title="Ir a boutique de Balenciaga"
                          >
                            <div className="w-7 h-7 bg-zinc-900 border border-slate-750 flex items-center justify-center text-white font-sans font-black text-[7.5px] tracking-wide rounded shadow-xs group-hover/brand:shadow-md">
                              BB
                            </div>
                            <span className="text-[7.5px] font-mono font-bold tracking-wider text-slate-700 mt-1 uppercase group-hover/brand:text-slate-900">Balen</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* RANKING #1 : MODELO DIAMANTE (DIAMOND ANGEL) - TALL CENTER COLUMN */}
                  {firstPlace && (
                    <div className="flex flex-col items-center order-1 md:order-2 group z-20 transition-transform duration-500 hover:-translate-y-2 relative">
                      
                      {/* Glowing halo behind champion */}
                      <div className="absolute inset-0 -top-12 bg-pink-300/10 rounded-full blur-3xl scale-125 animate-pulse" />

                      {/* Decorative Arch Portrait representation */}
                      <div className="relative mb-4 flex flex-col items-center">
                        
                        {/* Elegant Crown hovered closely above image frame without touching */}
                        <div className="absolute -top-11 sm:-top-13 z-30 transition duration-500 group-hover:scale-105 pointer-events-none">
                          {(firstPlace as any)?.gender === 'male' ? (
                            <RoyalMaleCrown 
                              imgClassName="w-26 sm:w-30 h-auto"
                              showSparkles={true}
                            />
                          ) : (
                            <img 
                              src="https://gallery.yopriceville.com/var/albums/Free-Clipart-Pictures/Crowns-PNG/Diamond_Tiara_with_Rubies_PNG_Clipart.png" 
                              alt="Corona de Diamantes y Rubíes" 
                              referrerPolicy="no-referrer"
                              className="w-24 sm:w-28 h-auto object-contain drop-shadow-[0_4px_14px_rgba(239,68,68,0.5)]"
                            />
                          )}
                        </div>

                        {/* Large pink butterfly studio wings peeking from behind the arch */}
                        <div className="absolute w-44 sm:w-56 h-26 sm:h-32 -left-4 top-[24%] bg-[#FD4CA2]/85 rounded-full pointer-events-none z-0 shadow-md animate-pulse" style={{ animationDuration: '4s' }} />
                        <div className="absolute w-44 sm:w-56 h-26 sm:h-32 -right-4 top-[24%] bg-[#FD4CA2]/85 rounded-full pointer-events-none z-0 shadow-md animate-pulse" style={{ animationDuration: '4s' }} />

                        {/* Highly Polished Arched Frame Overlay with 1px border and live video */}
                        <PodiumModelMedia
                          model={firstPlace}
                          place={1}
                          widthClass="w-36 sm:w-44 md:w-48"
                          heightClass="h-48 sm:h-58 md:h-64"
                          borderColorClass="border-[#3c1d1a]"
                          defaultVideoIndex={0}
                        />

                        {/* Golden yellow name tag badge exactly as in zx.png */}
                        <div className="absolute bottom-1 z-20 bg-[#FCB115] border border-amber-500 rounded-md px-5 py-2 shadow-md text-center min-w-[75%]">
                          <span className="text-[11px] font-mono font-black text-slate-950 tracking-wider uppercase block leading-none">
                            {firstPlace.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Votos and Name block */}
                      <div className="text-center space-y-0.5 w-full z-15 pt-0.5 px-1 mb-2">
                        <div className="flex justify-center items-center gap-1">
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-wide">
                            {firstPlace.name}
                          </h4>
                          <span className="text-base leading-none text-amber-500">★</span>
                        </div>
                        <div className="inline-flex items-center gap-0.5 text-[#E12A75] text-[11px] font-mono font-bold">
                          <strong>♥ {(firstPlace.totalLikes || 14926).toLocaleString()} votos</strong>
                        </div>
                      </div>

                      {/* Luxury Dark & Gold Pedestal Column 1 (Matching image.png) */}
                      <div className="w-full bg-[#181512] border border-[#d4af37]/70 rounded-2xl shadow-[0_6px_30px_rgba(0,0,0,0.65)] p-5 flex flex-col items-center justify-center relative min-h-[175px] transition-all hover:border-[#f3d078]">
                        {/* Subtle inner golden glow */}
                        <div className="absolute inset-0 bg-radial from-[#d4af37]/10 via-transparent to-transparent rounded-2xl pointer-events-none" />

                        {/* Upper label of Pedestal */}
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e5c583] mb-1 font-sans drop-shadow-sm">
                          MODELO DIAMANTE
                        </span>
                        
                        {/* Laurel Wreath & Number 1 */}
                        <div className="relative flex items-center justify-center my-0.5 py-0.5">
                          {/* Left Laurel Branch */}
                          <svg className="w-9 h-14 sm:w-11 sm:h-16 text-[#dfb152] drop-shadow-[0_2px_6px_rgba(223,177,82,0.4)]" viewBox="0 0 45 75" fill="currentColor">
                            <path d="M38 70 C24 60, 14 42, 16 12 C18 22, 26 30, 32 34 C22 36, 16 44, 20 54 C26 58, 32 60, 38 70 Z" opacity="0.35" />
                            {/* Leaves */}
                            <path d="M 36,65 C 28,56 20,44 20,28 C 20,18 25,10 32,3 C 27,8 14,20 16,34 C 17,46 25,57 36,65 Z" />
                            <path d="M26,18 C18,15 11,20 9,27 C14,29 23,25 26,18 Z" />
                            <path d="M22,32 C14,31 8,37 7,44 C13,45 21,40 22,32 Z" />
                            <path d="M25,48 C18,49 13,56 13,62 C19,62 25,56 25,48 Z" />
                            <path d="M31,9 C25,5 18,7 15,13 C20,15 28,13 31,9 Z" />
                          </svg>
                          
                          <span className="font-serif font-black text-5xl sm:text-6xl text-[#ff3888] leading-none px-1 relative z-10 drop-shadow-[0_2px_14px_rgba(255,56,136,0.4)]">
                            1
                          </span>

                          {/* Right Laurel Branch (Mirrored) */}
                          <svg className="w-9 h-14 sm:w-11 sm:h-16 text-[#dfb152] drop-shadow-[0_2px_6px_rgba(223,177,82,0.4)] -scale-x-100" viewBox="0 0 45 75" fill="currentColor">
                            <path d="M38 70 C24 60, 14 42, 16 12 C18 22, 26 30, 32 34 C22 36, 16 44, 20 54 C26 58, 32 60, 38 70 Z" opacity="0.35" />
                            {/* Leaves */}
                            <path d="M 36,65 C 28,56 20,44 20,28 C 20,18 25,10 32,3 C 27,8 14,20 16,34 C 17,46 25,57 36,65 Z" />
                            <path d="M26,18 C18,15 11,20 9,27 C14,29 23,25 26,18 Z" />
                            <path d="M22,32 C14,31 8,37 7,44 C13,45 21,40 22,32 Z" />
                            <path d="M25,48 C18,49 13,56 13,62 C19,62 25,56 25,48 Z" />
                            <path d="M31,9 C25,5 18,7 15,13 C20,15 28,13 31,9 Z" />
                          </svg>
                        </div>
                        
                        <div className="text-[10px] text-[#ff3888] font-bold uppercase tracking-[0.2em] my-1 flex items-center justify-center gap-1.5">
                          <span className="text-xs">✦</span> DIAMOND ANGEL <span className="text-xs">✦</span>
                        </div>

                        <button
                          onClick={() => onSelectModel && onSelectModel(firstPlace)}
                          className="w-full max-w-[190px] text-[11px] sm:text-[12px] text-[#1a140b] bg-gradient-to-b from-[#f7d988] via-[#e5bc5c] to-[#c8942b] hover:from-[#fae09c] hover:to-[#d6a237] font-black uppercase tracking-wider py-2.5 px-5 rounded-xl cursor-pointer border border-[#fce7a8]/60 mt-3 transition-all hover:scale-105 shadow-[0_4px_16px_rgba(212,175,55,0.45)] active:scale-95"
                        >
                          SUPERESTRELLA
                        </button>
                      </div>

                      {/* Brand Sponsors Row for 1st place */}
                      <div className="mt-3 w-full bg-gradient-to-tr from-amber-50/40 via-white to-pink-50/30 border border-amber-200/70 rounded-2xl p-2.5 shadow-md space-y-1.5 text-center relative overflow-hidden">
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-amber-400/20 rounded-full blur-md" />
                        <span className="text-[8px] font-black tracking-[0.16em] uppercase text-amber-850 block">
                          👑 SPONSORS DE ÉLITE 👑
                        </span>
                        <div className="flex items-center justify-around gap-1.5 pt-1.5 border-t border-amber-200/50">
                          {/* Victoria's Secret Spain */}
                          <div 
                            onClick={() => onNavigateToStore && onNavigateToStore('victorias_secret_spain')}
                            className="flex flex-col items-center justify-center group/brand hover:scale-110 active:scale-95 transition-all cursor-pointer"
                            title="Ir a boutique de Victoria's Secret Spain"
                          >
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 border border-pink-300 flex items-center justify-center text-white font-black text-[8px] tracking-tighter shadow-xs group-hover/brand:shadow-md">
                              VS
                            </div>
                            <span className="text-[7.5px] font-sans font-bold tracking-tight text-slate-700 mt-1 uppercase group-hover/brand:text-pink-600">Victoria's</span>
                          </div>
                          {/* L'Oréal Group */}
                          <div 
                            onClick={() => onNavigateToStore && onNavigateToStore('loreal_group')}
                            className="flex flex-col items-center justify-center group/brand hover:scale-110 active:scale-95 transition-all cursor-pointer"
                            title="Ir a boutique de L'Oréal Group"
                          >
                            <div className="w-7 h-7 rounded-full bg-slate-950 border border-purple-400/50 flex items-center justify-center text-rose-300 font-serif italic text-[8.5px] font-black shadow-sm group-hover/brand:shadow-md">
                              L'O
                            </div>
                            <span className="text-[7.5px] font-sans font-bold text-slate-700 mt-1 uppercase group-hover/brand:text-purple-600">L'Oréal</span>
                          </div>
                          {/* Carolina Herrera España */}
                          <div 
                            onClick={() => onNavigateToStore && onNavigateToStore('carolina_herrera_spain')}
                            className="flex flex-col items-center justify-center group/brand hover:scale-110 active:scale-95 transition-all cursor-pointer"
                            title="Ir a boutique de Carolina Herrera España"
                          >
                            <div className="w-7 h-7 bg-slate-900 flex items-center justify-center text-amber-300 font-serif font-black text-[8px] tracking-widest shadow-xs relative rounded-full border border-amber-400/50 group-hover/brand:shadow-md">
                              CH
                            </div>
                            <span className="text-[7.5px] font-sans font-bold tracking-tight text-slate-700 mt-1 uppercase group-hover/brand:text-amber-600">C. Herrera</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* RANKING #3 : MODELO PLATINO (RUNWAY QUEEN) - RIGHT BAR */}
                  {thirdPlace && (
                    <div className="flex flex-col items-center order-3 group transition-transform duration-500 hover:-translate-y-1 relative">
                       
                      {/* Decorative Arch Portrait representation */}
                      <div className="relative mb-4 flex flex-col items-center">
                        
                        {/* Soft gray-pink smooth studio semicircles peeking from behind the arch */}
                        <div className="absolute w-34 sm:w-40 h-20 sm:h-24 -left-2.5 top-[28%] bg-[#C3C2C7]/80 rounded-full pointer-events-none z-0 shadow-sm" />
                        <div className="absolute w-34 sm:w-40 h-20 sm:h-24 -right-2.5 top-[28%] bg-[#C3C2C7]/80 rounded-full pointer-events-none z-0 shadow-sm" />

                        {/* Highly Polished Arched Frame Overlay with 1px border and live video */}
                        <PodiumModelMedia
                          model={thirdPlace}
                          place={3}
                          widthClass="w-30 sm:w-34 md:w-38"
                          heightClass="h-42 sm:h-48 md:h-50"
                          borderColorClass="border-[#B93259]"
                          defaultVideoIndex={2}
                        />

                        {/* White Name badge overlaying bottom boundary exactly as in zx.png */}
                        <div className="absolute bottom-1 z-20 bg-white border border-slate-200 rounded-md px-3.5 py-1.5 shadow-md text-center min-w-[75%]">
                          <span className="text-[10px] font-mono font-black text-slate-800 tracking-widest uppercase block leading-none">
                            {thirdPlace.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Votos and Name block */}
                      <div className="text-center space-y-0.5 w-full z-15 pt-0.5 px-1 mb-2">
                        <h4 className="text-[12px] sm:text-sm font-bold text-slate-900 tracking-wide truncate">
                          {thirdPlace.name}
                        </h4>
                        <div className="inline-flex items-center gap-0.5 text-[#E12A75] text-[11px] font-bold">
                          <strong>♥ {(thirdPlace.totalLikes || 14415).toLocaleString()} votos</strong>
                        </div>
                      </div>

                      {/* White Pedestal Column 3 */}
                      <div className="w-full bg-white border border-pink-100 rounded-xl shadow-xs p-4 flex flex-col items-center justify-center relative min-h-[140px]">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-400 to-rose-400 rounded-t-xl" />
                        
                        {/* Upper label of Pedestal */}
                        <span className="text-[9.5px] font-bold uppercase tracking-widest text-[#B93259] mb-1 font-sans">
                          MODELO PLATINO
                        </span>
                        
                        <span className="font-serif font-bold text-4xl text-[#E12A75] my-1 leading-none">
                          3
                        </span>
                        
                        <div className="text-[9px] text-[#E12A75] font-semibold uppercase tracking-[0.14em] mt-1.5">
                          ✦ RUNWAY QUEEN ✦
                        </div>

                        <button
                          onClick={() => onSelectModel && onSelectModel(thirdPlace)}
                          className="text-[10px] text-[#E12A75] hover:text-pink-800 font-bold underline bg-transparent cursor-pointer border-0 mt-3.5 z-20"
                        >
                          Ver Ficha
                        </button>
                      </div>

                      {/* Brand Sponsors Row for 3rd place */}
                      <div className="mt-3 w-full bg-gradient-to-tr from-stone-50/50 to-white/95 border border-pink-100/60 rounded-2xl p-2.5 shadow-xs space-y-1.5 text-center">
                        <span className="text-[8px] font-black tracking-[0.16em] uppercase text-pink-700/90 block">
                          ⭐ SPONSORS DE ÉLITE ⭐
                        </span>
                        <div className="flex items-center justify-around gap-1.5 pt-1.5 border-t border-pink-100/50">
                          {/* Louis Vuitton */}
                          <div 
                            onClick={() => onNavigateToStore && onNavigateToStore('louis_vuitton')}
                            className="flex flex-col items-center justify-center group/brand hover:scale-110 active:scale-95 transition-all cursor-pointer"
                            title="Ir a boutique de Louis Vuitton"
                          >
                            <div className="w-7 h-7 rounded-full bg-[#3e2723] border border-[#a1887f]/50 flex items-center justify-center text-[#d7ccc8] font-bold text-[8px] shadow-xs group-hover/brand:shadow-md">
                              LV
                            </div>
                            <span className="text-[7.5px] font-sans font-bold tracking-widest text-slate-700 mt-1 uppercase group-hover/brand:text-amber-800">L.V.</span>
                          </div>
                          {/* YSL */}
                          <div 
                            onClick={() => onNavigateToStore && onNavigateToStore('ysl')}
                            className="flex flex-col items-center justify-center group/brand hover:scale-110 active:scale-95 transition-all cursor-pointer"
                            title="Ir a boutique de Yves Saint Laurent"
                          >
                            <div className="w-7 h-7 bg-zinc-900 flex items-center justify-center text-[#d5af66] font-serif font-semibold text-[8px] tracking-tighter leading-none rounded-full shadow-xs group-hover/brand:shadow-md">
                              YSL
                            </div>
                            <span className="text-[7.5px] font-sans font-bold tracking-wider text-slate-700 mt-1 uppercase group-hover/brand:text-yellow-600">YSL</span>
                          </div>
                          {/* Hermès */}
                          <div 
                            onClick={() => onNavigateToStore && onNavigateToStore('hermes')}
                            className="flex flex-col items-center justify-center group/brand hover:scale-110 active:scale-95 transition-all cursor-pointer"
                            title="Ir a boutique de Hermès Paris"
                          >
                            <div className="w-7 h-7 bg-[#f4511e] rounded flex items-center justify-center text-white font-serif font-bold text-[9px] shadow-xs border border-amber-600/10 group-hover/brand:shadow-md">
                              H
                            </div>
                            <span className="text-[7.5px] font-serif font-bold tracking-widest text-slate-700 mt-1 uppercase group-hover/brand:text-orange-600">Hermès</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              ) : (
                <p className="text-center text-slate-450">No hay modelos registradas disponibles para el ranking.</p>
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
                      <span className="text-[9px] font-black uppercase text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100 opacity-80 group-hover/legend:opacity-100 transition-all">
                        Ver Tienda ↗
                      </span>
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
                        
                        <span className="text-[8.5px] font-black uppercase text-pink-600 bg-pink-50 px-2 py-1 rounded-lg border border-pink-100/70 opacity-80 group-hover/second:opacity-100 transition-all">
                          Ver Tienda ↗
                        </span>
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
                        
                        <span className="text-[8.5px] font-black uppercase text-pink-600 bg-pink-50 px-2 py-1 rounded-lg border border-pink-100/70 opacity-80 group-hover/third:opacity-100 transition-all">
                          Ver Tienda ↗
                        </span>
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
                      Clasificación de los 100 Modelos de Élite (Hombres y Mujeres)
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
          {/* 💎 BOUTIQUE EXCLUSIVA DE ALTA COSTURA                    */}
          {/* ======================================================== */}
          {activeTab === 'boutique' && (
            <div className="space-y-6 animate-fade-in pb-4">
              
              {/* Luxury Banner */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-rose-950 to-neutral-900 text-white p-6 sm:p-8 border border-pink-500/20 shadow-xl">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/30 text-pink-300 text-[10px] font-mono uppercase tracking-widest">
                      <Sparkles className="w-3 h-3 text-pink-400" />
                      <span>Colección Oficial 2026</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
                      BOUTIQUE DE ALTA COSTURA
                    </h2>
                    <p className="text-xs sm:text-sm text-pink-150 text-slate-300 font-light leading-relaxed">
                      Prendas icónicas, alas de ángel oficiales de pasarela, lencería de gala y accesorios de edición limitada de las modelos estrella de Fashion Finances.
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg text-white font-black text-xl">
                      👑
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-pink-300 block font-mono">CLUB VIP EXCLUSIVO</span>
                      <span className="text-sm font-extrabold text-white">Envío Gratis & Gifting Directo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔍 BUSCADOR DE BOUTIQUE & CASAS DE MODA */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-pink-100 shadow-sm space-y-3.5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-600">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={boutiqueSearchQuery}
                      onChange={(e) => setBoutiqueSearchQuery(e.target.value)}
                      placeholder="Buscar boutique, marca, producto o modelo (ej. Balmain, Victoria's Secret, L'Oréal, Gucci, Versace, Louis Vuitton...)"
                      className="w-full pl-10 pr-10 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm rounded-2xl border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all outline-none"
                    />
                    {boutiqueSearchQuery && (
                      <button
                        onClick={() => setBoutiqueSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                        title="Limpiar búsqueda"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Badges & Reset */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                    <span className="px-3.5 py-2 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                      <ShoppingBag className="w-3.5 h-3.5 text-pink-600" />
                      <span>{filteredBoutiqueCatalog.length} {filteredBoutiqueCatalog.length === 1 ? 'artículo' : 'artículos'}</span>
                    </span>

                    {(boutiqueSearchQuery || boutiqueCategory !== 'all' || selectedBoutiqueHouseFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setBoutiqueSearchQuery('');
                          setBoutiqueCategory('all');
                          setSelectedBoutiqueHouseFilter('all');
                        }}
                        className="text-xs font-mono font-bold text-slate-500 hover:text-pink-600 underline cursor-pointer px-2 py-1"
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick filter pills for Boutiques / Maisons */}
                <div className="pt-1 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none text-xs">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 shrink-0 pr-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-pink-500" />
                    <span>Boutique:</span>
                  </span>

                  <button
                    onClick={() => setSelectedBoutiqueHouseFilter('all')}
                    className={`px-3 py-1.5 rounded-xl font-medium text-xs shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedBoutiqueHouseFilter === 'all'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>Todas las Boutiques</span>
                  </button>

                  {boutiqueHousesList.map(house => {
                    const isSelected = selectedBoutiqueHouseFilter === house;
                    const storeMeta = BOUTIQUE_STORES_INFO.find(s => s.name === house);
                    return (
                      <button
                        key={house}
                        onClick={() => setSelectedBoutiqueHouseFilter(prev => prev === house ? 'all' : house)}
                        className={`px-3 py-1.5 rounded-xl font-medium text-xs shrink-0 transition-all cursor-pointer flex items-center gap-2 border ${
                          isSelected
                            ? 'bg-pink-600 text-white font-bold border-pink-600 shadow-xs'
                            : 'bg-white hover:bg-pink-50/70 hover:text-pink-700 text-slate-700 border-slate-200 hover:border-pink-300'
                        }`}
                      >
                        {renderBoutiqueEmblem(house, 'w-4 h-4')}
                        <span className="truncate">{house}</span>
                        {storeMeta && (
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            ⭐ {storeMeta.rating}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold uppercase tracking-wider">
                {[
                  { id: 'all', label: 'Todos los Artículos', icon: ShoppingBag },
                  { id: 'alas', label: 'Alas & Pasarela', icon: Sparkles },
                  { id: 'lenceria', label: 'Lencería de Gala', icon: Heart },
                  { id: 'joyeria', label: 'Joyería & Relojes', icon: Gem },
                  { id: 'perfumes', label: 'Perfumes & Belleza', icon: Crown },
                ].map(cat => {
                  const Icon = cat.icon;
                  const isActive = boutiqueCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setBoutiqueCategory(cat.id as any)}
                      className={`px-4 py-2 rounded-full border transition-all duration-200 shrink-0 flex items-center gap-1.5 cursor-pointer ${
                        isActive 
                          ? 'bg-pink-600 text-white border-pink-600 shadow-sm' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-pink-300 hover:text-pink-600'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Boutique Catalog Grid */}
              {filteredBoutiqueCatalog.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                  <div className="w-16 h-16 rounded-full bg-pink-50 text-pink-500 mx-auto flex items-center justify-center text-2xl">
                    <Search className="w-8 h-8 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-slate-800 text-base">No se encontraron artículos ni boutiques</h3>
                    <p className="text-slate-500 text-xs mt-1 max-w-md mx-auto">
                      Prueba a buscar con otro término, limpiar los filtros o explorar todas las boutiques de alta costura.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setBoutiqueSearchQuery('');
                      setBoutiqueCategory('all');
                      setSelectedBoutiqueHouseFilter('all');
                    }}
                    className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-xs transition cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Ver todo el Catálogo</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredBoutiqueCatalog.map((item) => {
                    const isBought = purchasedItems.includes(item.id);
                    return (
                      <div 
                        key={item.id}
                        className="bg-white rounded-2xl border border-pink-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group"
                      >
                        {/* Image frame */}
                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                          
                          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                            <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-md bg-black/70 text-pink-300 backdrop-blur-xs border border-white/20">
                              {item.tag}
                            </span>
                          </div>

                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px]">
                            <span className="font-medium drop-shadow-sm flex items-center gap-1 text-yellow-200">
                              <Sparkles className="w-3 h-3 text-yellow-300" />
                              {item.endorsedBy}
                            </span>
                            <span className="text-[10px] text-white/80 font-mono">
                              {item.boutiqueCity}
                            </span>
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-pink-700 uppercase tracking-wider mb-1 font-mono">
                              {renderBoutiqueEmblem(item.boutiqueHouse, 'w-3.5 h-3.5')}
                              <span className="truncate">{item.boutiqueHouse}</span>
                            </div>
                            <h3 className="font-serif font-black text-slate-800 text-sm leading-tight group-hover:text-pink-600 transition-colors">
                              {item.name}
                            </h3>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">PRECIO EXCLUSIVO</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-black font-mono text-pink-600">🪙 {item.priceCoins.toLocaleString()}</span>
                                <span className="text-[11px] text-slate-400">({item.priceEur} €)</span>
                              </div>
                            </div>

                            {isBought && (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3" /> Adquirido
                              </span>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => {
                                setPurchasedItems(prev => prev.includes(item.id) ? prev : [...prev, item.id]);
                                window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                                  detail: { icon: '🛍️' }
                                }));
                                alert(`🛍️ ¡Compra completada con éxito! Has adquirido "${item.name}" de "${item.boutiqueHouse}" por ${item.priceCoins.toLocaleString()} monedas.`);
                              }}
                              className="w-full bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-extrabold text-[11px] py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Comprar</span>
                            </button>

                            <button
                              onClick={() => {
                                setBoutiqueGiftModelSearch('');
                                setBoutiqueCustomGiftMessage('');
                                setSelectedBoutiqueItemForGift(item);
                              }}
                              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-[11px] py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Gift className="w-3 h-3 text-pink-400" />
                              <span>Regalar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Gift Modal for Boutique item */}
              {selectedBoutiqueItemForGift && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-pink-100 space-y-4 animate-scale-up">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Gift className="w-5 h-5 text-pink-600" />
                        <h3 className="font-serif font-black text-slate-800 text-base">Enviar Regalo de Boutique</h3>
                      </div>
                      <button 
                        onClick={() => setSelectedBoutiqueItemForGift(null)}
                        className="text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-2xl border border-pink-100">
                      <img src={selectedBoutiqueItemForGift.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {renderBoutiqueEmblem(selectedBoutiqueItemForGift.boutiqueHouse, 'w-3.5 h-3.5')}
                          <span className="text-[10px] font-mono font-bold text-pink-600 uppercase block truncate">{selectedBoutiqueItemForGift.boutiqueHouse}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-xs truncate">{selectedBoutiqueItemForGift.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-pink-600 font-mono font-bold">🪙 {selectedBoutiqueItemForGift.priceCoins.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({selectedBoutiqueItemForGift.priceEur} €)</span>
                        </div>
                      </div>
                    </div>

                    {/* Model Search & Selection */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] uppercase font-bold text-slate-500 font-mono block">Buscar y Seleccionar Destinataria:</label>
                        <span className="text-[10px] text-pink-600 font-mono font-bold">Saldo: 🪙 {userGiftBalance.toLocaleString()}</span>
                      </div>

                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={boutiqueGiftModelSearch}
                          onChange={(e) => setBoutiqueGiftModelSearch(e.target.value)}
                          placeholder="Buscar modelo destinataria..."
                          className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                        {models
                          .filter(mod => mod.name.toLowerCase().includes(boutiqueGiftModelSearch.toLowerCase()))
                          .slice(0, 12)
                          .map((mod) => (
                            <button
                              key={mod.id}
                              onClick={() => {
                                // Add to sent gifts
                                const newSentGift: UserGiftItem = {
                                  id: `sent-boutique-${Date.now()}`,
                                  senderName: 'Tú',
                                  senderUsername: '@vip_user',
                                  senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150',
                                  receiverName: mod.name,
                                  receiverUsername: `@${mod.name.toLowerCase().replace(/\s+/g, '_')}`,
                                  receiverAvatar: mod.avatar,
                                  giftName: selectedBoutiqueItemForGift.name,
                                  giftIcon: '🛍️',
                                  price: selectedBoutiqueItemForGift.priceCoins,
                                  euroCost: selectedBoutiqueItemForGift.priceEur,
                                  category: 'alta_costura',
                                  isExclusive: true,
                                  timestamp: Date.now(),
                                  dateFormatted: 'Ahora mismo',
                                  message: boutiqueCustomGiftMessage || `Exclusivo de ${selectedBoutiqueItemForGift.boutiqueHouse}`,
                                  status: 'delivered',
                                };

                                setSentGifts(prev => {
                                  const updated = [newSentGift, ...prev];
                                  try {
                                    localStorage.setItem(SENT_GIFTS_STORAGE_KEY, JSON.stringify(updated));
                                  } catch (e) {
                                    console.error(e);
                                  }
                                  return updated;
                                });

                                window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                                  detail: { icon: '🎁' }
                                }));
                                alert(`🎁 ¡Regalo de Boutique enviado con éxito! Has regalado "${selectedBoutiqueItemForGift.name}" de "${selectedBoutiqueItemForGift.boutiqueHouse}" a @${mod.name}. Ha quedado registrado en tus Regalos Enviados.`);
                                setSelectedBoutiqueItemForGift(null);
                              }}
                              className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-pink-500 hover:bg-pink-50 text-left transition cursor-pointer group"
                            >
                              <img src={mod.avatar} alt="" className="w-8 h-8 rounded-full object-cover group-hover:ring-2 group-hover:ring-pink-400" />
                              <div className="truncate flex-1">
                                <span className="text-xs font-bold text-slate-800 block truncate group-hover:text-pink-700">{mod.name}</span>
                                <span className="text-[10px] text-pink-600 font-mono">{(mod.totalLikes || 1000).toLocaleString()} votos</span>
                              </div>
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Optional custom message */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Mensaje o dedicatoria VIP (opcional):</label>
                      <input
                        type="text"
                        value={boutiqueCustomGiftMessage}
                        onChange={(e) => setBoutiqueCustomGiftMessage(e.target.value)}
                        placeholder={`Un regalo especial de ${selectedBoutiqueItemForGift.boutiqueHouse} para ti...`}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom return to ranking button */}
              <div className="text-center pt-2">
                <button
                  onClick={() => setActiveTab('ranking')}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-3 rounded-full shadow transition-all duration-300 cursor-pointer"
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

                <div className="grid grid-cols-3 gap-2.5 w-full sm:w-auto">
                  {/* Botón 1: Actuales (última semana) */}
                  <button
                    type="button"
                    onClick={() => setGiftTimeFilter('actuales')}
                    className={`px-4 py-2.5 rounded-xl font-serif text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
                      giftTimeFilter === 'actuales'
                        ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white shadow-md shadow-pink-500/30 ring-2 ring-pink-500 scale-[1.03]'
                        : 'bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-600 border border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <Flame className={`w-3.5 h-3.5 ${giftTimeFilter === 'actuales' ? 'text-white' : 'text-slate-400'}`} />
                    <span>Actuales</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
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
                    className={`px-4 py-2.5 rounded-xl font-serif text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
                      giftTimeFilter === 'recientes'
                        ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white shadow-md shadow-pink-500/30 ring-2 ring-pink-500 scale-[1.03]'
                        : 'bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-600 border border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <Calendar className={`w-3.5 h-3.5 ${giftTimeFilter === 'recientes' ? 'text-white' : 'text-slate-400'}`} />
                    <span>Recientes</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
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
                    className={`px-4 py-2.5 rounded-xl font-serif text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
                      giftTimeFilter === 'antiguos'
                        ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white shadow-md shadow-pink-500/30 ring-2 ring-pink-500 scale-[1.03]'
                        : 'bg-white hover:bg-pink-50 text-slate-700 hover:text-pink-600 border border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <History className={`w-3.5 h-3.5 ${giftTimeFilter === 'antiguos' ? 'text-white' : 'text-slate-400'}`} />
                    <span>Antiguos</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
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
              {giftsSubTab === 'received' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Summary Metric Stats Banner */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50/60 p-4 rounded-2xl border border-pink-200/70 shadow-2xs">
                      <span className="text-[10px] font-mono font-black uppercase text-pink-600 block tracking-wider">Regalos Recibidos</span>
                      <span className="text-2xl font-black font-serif text-slate-900 mt-1 block">{receivedGifts.length}</span>
                      <span className="text-[11px] text-slate-500 font-medium">De modelos y patrocinadores</span>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50/60 p-4 rounded-2xl border border-amber-200/70 shadow-2xs">
                      <span className="text-[10px] font-mono font-black uppercase text-amber-700 block tracking-wider">Valor Acumulado</span>
                      <span className="text-2xl font-black font-mono text-amber-600 mt-1 block">
                        🪙 {receivedGifts.reduce((acc, g) => acc + g.price, 0).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-bold font-mono">
                        ≈ {receivedGifts.reduce((acc, g) => acc + g.euroCost, 0).toLocaleString()}€ en premios
                      </span>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50/60 p-4 rounded-2xl border border-purple-200/70 shadow-2xs">
                      <span className="text-[10px] font-mono font-black uppercase text-purple-700 block tracking-wider">Donante Top</span>
                      <span className="text-base font-extrabold font-serif text-slate-900 mt-1 truncate block flex items-center gap-1">
                        <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                        Adriana Lima
                      </span>
                      <span className="text-[11px] text-purple-600 font-semibold font-mono">Mecenas de Honor</span>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 p-4 rounded-2xl border border-emerald-200/70 shadow-2xs">
                      <span className="text-[10px] font-mono font-black uppercase text-emerald-700 block tracking-wider">Regalo Más Valioso</span>
                      <span className="text-base font-extrabold font-serif text-slate-900 mt-1 truncate block">
                        Reloj de oro 18K ⌚
                      </span>
                      <span className="text-[11px] text-emerald-600 font-mono font-bold">5.000€ Oficial VIP</span>
                    </div>
                  </div>

                  {/* 🌟 DYNAMIC FEATURED SHOWCASE CARD (Certificado Profesional / Reloj de Oro / etc.) */}
                  <div className="bg-gradient-to-b from-[#1e1b18] via-[#141215] to-[#100f12] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Top bar header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-500/20">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 text-lg shadow-inner">
                          {currentFeaturedGift.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1 font-mono">
                              🎁 REGALO RECIBIDO EXCLUSIVO
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black tracking-wide font-mono">
                              {currentFeaturedGift.badgeText}
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-serif font-black text-white flex items-center gap-1.5">
                            {currentFeaturedGift.name} <span className="text-base text-amber-400">{currentFeaturedGift.icon}</span>
                          </h3>
                        </div>
                      </div>

                      {currentFeaturedGift.isCertificate ? (
                        <button
                          onClick={handleViewCertificateLarge}
                          className="self-start sm:self-auto bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 tracking-wider font-mono uppercase"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                          <span>+ VER CERTIFICADO EN GRANDE</span>
                        </button>
                      ) : currentFeaturedGift.isWatch ? (
                        <button
                          onClick={() => {
                            setActiveModalGift(receivedGifts.find(g => g.giftName.toLowerCase().includes('reloj')) || null);
                            setShowLuxuryWatchModal(true);
                          }}
                          className="self-start sm:self-auto bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 tracking-wider font-mono uppercase"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                          <span>+ VER ANIMACIÓN DE LUJO</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedGenericModalGift(currentFeaturedGift);
                            setShowGenericGiftModal(true);
                          }}
                          className="self-start sm:self-auto bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 tracking-wider font-mono uppercase"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                          <span>+ VER EN GRANDE</span>
                        </button>
                      )}
                    </div>

                    {/* 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-5 items-stretch">
                      
                      {/* Left Column: Interactive Display Preview */}
                      {currentFeaturedGift.isCertificate ? (
                        /* Parchment Certificate Card */
                        <div 
                          onClick={handleViewCertificateLarge}
                          className="md:col-span-4 bg-gradient-to-b from-[#fbf8f1] via-[#f7f2e5] to-[#ebe1c7] border-2 border-amber-600/60 rounded-2xl p-4 flex flex-col items-center justify-between relative group hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all cursor-pointer shadow-inner overflow-hidden min-h-[220px]"
                        >
                          {/* Inner gold dashed border */}
                          <div className="absolute inset-2 border border-dashed border-amber-700/30 rounded-xl pointer-events-none" />
                          
                          <div className="flex items-center justify-between w-full z-10 px-1">
                            <span className="text-[10px] text-amber-800 font-serif">⚜️</span>
                            <span className="text-[8px] font-mono font-black uppercase text-amber-900 tracking-widest">
                              ACREDITACIÓN OFICIAL
                            </span>
                            <span className="text-[10px] text-amber-800 font-serif">⚜️</span>
                          </div>

                          {/* Certificate Layout */}
                          <div className="text-center z-10 my-2 select-none">
                            <div className="text-3xl mb-1 group-hover:scale-115 transition-transform duration-300">📜</div>
                            <h4 className="text-xs font-serif font-black uppercase text-amber-950 tracking-wider">
                              CERTIFICADO PROFESIONAL
                            </h4>
                            <span className="text-[8.5px] font-serif italic text-amber-900/80 block">
                              Alta Costura & Pasarela VIP
                            </span>
                            <div className="my-1.5 py-0.5 px-2.5 bg-amber-200/70 border border-amber-400/50 rounded-md inline-block">
                              <span className="text-[11px] font-serif font-black text-slate-950">
                                {currentFeaturedGift.senderName}
                              </span>
                            </div>
                          </div>

                          {/* Bottom Seal & Serial */}
                          <div className="w-full flex items-center justify-between z-10 pt-1 border-t border-amber-700/20 px-1">
                            <div className="flex items-center gap-1">
                              <div className="w-5 h-5 rounded-full bg-red-700 text-amber-200 flex items-center justify-center text-[10px] border border-amber-300 shadow-xs">
                                👑
                              </div>
                              <span className="text-[8px] font-mono font-bold text-amber-950">#VS-CERT-2026</span>
                            </div>
                            <span className="text-[8px] font-mono font-extrabold text-amber-800 bg-amber-200/90 px-1.5 py-0.5 rounded">
                              🪙 500€
                            </span>
                          </div>

                          <div className="mt-2 text-center z-10">
                            <span className="text-[9.5px] font-mono font-black uppercase text-amber-900 tracking-wider flex items-center justify-center gap-1 group-hover:text-amber-950">
                              ✦ TOCA PARA AMPLIAR DIPLOMA ✦
                            </span>
                          </div>
                        </div>
                      ) : currentFeaturedGift.isWatch ? (
                        /* Realistic Gold Watch Dial */
                        <div 
                          onClick={() => {
                            setActiveModalGift(receivedGifts.find(g => g.giftName.toLowerCase().includes('reloj')) || null);
                            setShowLuxuryWatchModal(true);
                          }}
                          className="md:col-span-4 bg-[#0d0c0e]/90 border border-amber-500/30 rounded-2xl p-5 flex flex-col items-center justify-center relative group hover:border-amber-400/60 transition-all cursor-pointer shadow-inner overflow-hidden"
                        >
                          <div className="absolute top-2 right-2 text-amber-400 animate-pulse text-xs">✨</div>
                          <div className="absolute bottom-2 left-2 text-amber-500/70 text-xs">⭐</div>

                          <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 p-1.5 shadow-[0_0_25px_rgba(245,158,11,0.3)] relative group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-t-sm border border-amber-300/40" />
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-14 h-4 bg-gradient-to-t from-amber-400 to-amber-600 rounded-b-sm border border-amber-300/40" />
                            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-2 h-4 bg-amber-400 rounded-r-xs border border-amber-600" />

                            <div className="w-full h-full bg-[#0a090b] rounded-full border-2 border-amber-400/40 relative flex items-center justify-center overflow-hidden">
                              <div className="absolute inset-1 rounded-full border border-dashed border-amber-500/20" />
                              <span className="absolute top-1.5 text-[7px] font-mono text-amber-400 font-bold">12</span>
                              <span className="absolute bottom-1.5 text-[7px] font-mono text-amber-400 font-bold">6</span>
                              <span className="absolute left-2 text-[7px] font-mono text-amber-400 font-bold">9</span>
                              <span className="absolute right-2 text-[7px] font-mono text-amber-400 font-bold">3</span>

                              <div className="text-center z-10 -mt-5 select-none">
                                <span className="text-[7.5px] font-mono font-black tracking-widest text-amber-200 block uppercase">CASTING LIVE</span>
                                <span className="text-[5px] text-amber-500 font-mono tracking-tighter block">18K GOLD • CHRONOMETER</span>
                              </div>

                              <div className="absolute bottom-4 w-7 h-7 rounded-full border border-amber-500/40 bg-black/60 flex items-center justify-center">
                                <div 
                                  className="w-0.5 h-2.5 bg-amber-400 origin-bottom" 
                                  style={{ transform: `rotate(${watchTickAngle * 2}deg)` }}
                                />
                              </div>

                              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 z-20 shadow-xs flex items-center justify-center">
                                <div className="w-1 h-1 rounded-full bg-black" />
                              </div>
                              <div 
                                className="absolute w-1 h-8 bg-amber-300 rounded-full origin-bottom shadow-xs -translate-y-4" 
                                style={{ transform: 'rotate(290deg)' }}
                              />
                              <div 
                                className="absolute w-0.5 h-11 bg-amber-200 rounded-full origin-bottom shadow-xs -translate-y-5.5" 
                                style={{ transform: 'rotate(70deg)' }}
                              />
                              <div 
                                className="absolute w-[1px] h-12 bg-rose-500 rounded-full origin-bottom shadow-xs -translate-y-6" 
                                style={{ transform: `rotate(${watchTickAngle}deg)` }}
                              />
                            </div>
                          </div>

                          <div className="mt-4 text-center">
                            <span className="text-[10px] font-mono font-black uppercase text-amber-400 tracking-widest flex items-center justify-center gap-1 group-hover:text-yellow-300">
                              ✦ TOCA PARA INSPECCIONAR ✦
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Dynamic 3D Display for Other Gifts */
                        <div 
                          onClick={() => {
                            setSelectedGenericModalGift(currentFeaturedGift);
                            setShowGenericGiftModal(true);
                          }}
                          className="md:col-span-4 bg-[#0d0c0e]/90 border border-amber-500/30 rounded-2xl p-5 flex flex-col items-center justify-center relative group hover:border-amber-400/60 transition-all cursor-pointer shadow-inner overflow-hidden min-h-[220px]"
                        >
                          <div className="absolute top-2 right-2 text-amber-400 animate-pulse text-xs">✨</div>
                          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-amber-500/20 via-pink-500/20 to-purple-500/20 border-2 border-amber-400/50 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(245,158,11,0.25)] group-hover:scale-110 transition-transform duration-300">
                            {currentFeaturedGift.icon}
                          </div>
                          <span className="text-xs font-serif font-black text-amber-200 mt-3 block text-center">
                            {currentFeaturedGift.name}
                          </span>
                          <span className="text-[10px] font-mono font-black uppercase text-amber-400 mt-2 tracking-wider">
                            ✦ TOCA PARA INSPECCIONAR ✦
                          </span>
                        </div>
                      )}

                      {/* Right Column: Gift Info & Message Box */}
                      <div className="md:col-span-8 flex flex-col justify-between space-y-3">
                        
                        {/* Top sub-box: Sender & Valuation */}
                        <div className="bg-[#242228]/90 rounded-2xl p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full ring-2 ring-pink-500/80 p-0.5 overflow-hidden bg-slate-800 shrink-0">
                              <img 
                                src={currentFeaturedGift.senderAvatar || legendModel.avatar} 
                                alt={currentFeaturedGift.senderName} 
                                className="w-full h-full object-cover rounded-full"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block tracking-wider">
                                REGALADO POR:
                              </span>
                              <span className="text-base font-extrabold text-white font-serif flex items-center gap-1.5">
                                {currentFeaturedGift.senderName}
                                <Crown className="w-3.5 h-3.5 text-amber-400" />
                              </span>
                              <span className="text-[11px] text-pink-300 font-mono">@{currentFeaturedGift.senderUsername}</span>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider">
                              Valoración
                            </span>
                            <div className="flex items-center sm:justify-end gap-1.5">
                              <span className="text-lg font-black font-mono text-amber-400">🪙 {currentFeaturedGift.price.toLocaleString()} monedas</span>
                            </div>
                            <span className="text-xs text-cyan-400 font-mono font-medium block">
                              ({currentFeaturedGift.euroCost.toFixed(2)}€)
                            </span>
                          </div>
                        </div>

                        {/* Middle quote box */}
                        <div className="bg-[#242228]/90 rounded-2xl p-4 border border-white/5 shadow-md">
                          <p className="text-sm font-serif italic text-amber-200/95 leading-relaxed">
                            <span className="text-amber-400 font-black text-lg mr-1">“</span>
                            {currentFeaturedGift.message}
                            <span className="text-amber-400 font-black text-lg ml-1">”</span>
                          </p>
                        </div>

                        {/* Bottom actions & status row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 px-1 text-xs font-mono">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                            <Check className="w-4 h-4" />
                            <span>Entrega confirmada en perfil</span>
                            <span className="text-slate-400 font-normal">· {currentFeaturedGift.dateFormatted}</span>
                          </div>

                          <button
                            onClick={() => handleThankSender({
                              senderName: currentFeaturedGift.senderName,
                              giftName: currentFeaturedGift.name
                            } as any)}
                            className="px-3 py-1.5 rounded-xl bg-pink-600/80 hover:bg-pink-600 text-white font-serif font-black text-xs flex items-center gap-1.5 transition cursor-pointer border border-pink-400/30"
                          >
                            <Heart className="w-3.5 h-3.5 fill-current" />
                            <span>Agradecer a {currentFeaturedGift.senderName.split(' ')[0]}</span>
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>

                  {/* Filter & Search Bar for Received Gifts */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none text-[11px] font-bold uppercase tracking-wider">
                      {[
                        { id: 'all', label: `Todos (${receivedGifts.length})`, icon: Gift },
                        { id: 'lujo', label: '👑 Lujo VIP', icon: Crown },
                        { id: 'intermedio', label: '💎 Joyería & Certificados', icon: Gem },
                        { id: 'basico', label: '⭐ Esenciales', icon: Star },
                      ].map(cat => {
                        const Icon = cat.icon;
                        const isActive = receivedCategoryFilter === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setReceivedCategoryFilter(cat.id as any)}
                            className={`px-3.5 py-1.5 rounded-full border transition-all duration-200 shrink-0 flex items-center gap-1 cursor-pointer select-none ${
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

                    <div className="relative w-full sm:w-72">
                      <input
                        type="text"
                        value={receivedSearchQuery}
                        onChange={(e) => setReceivedSearchQuery(e.target.value)}
                        placeholder="Buscar por donante, regalo o mensaje..."
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-500 transition shadow-2xs"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Received Gifts Grid / Cards List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(() => {
                      const filteredReceived = receivedGifts.filter(g => {
                        if (!isGiftInTimePeriod(g.timestamp, giftTimeFilter)) return false;
                        if (receivedCategoryFilter !== 'all' && g.category !== receivedCategoryFilter) return false;
                        if (receivedSearchQuery) {
                          const q = receivedSearchQuery.toLowerCase();
                          return (
                            g.giftName.toLowerCase().includes(q) ||
                            g.senderName.toLowerCase().includes(q) ||
                            g.senderUsername.toLowerCase().includes(q) ||
                            g.message.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      });

                      if (filteredReceived.length === 0) {
                        return (
                          <div className="col-span-full bg-white rounded-2xl border border-dashed border-pink-200 p-8 text-center space-y-2">
                            <Clock className="w-8 h-8 text-pink-400 mx-auto" />
                            <h4 className="font-serif font-bold text-slate-800 text-sm">
                              No hay regalos recibidos en el período: {giftTimeFilter === 'actuales' ? 'Actuales (Última semana)' : giftTimeFilter === 'recientes' ? 'Recientes (Último mes)' : 'Antiguos (> 1 mes)'}
                            </h4>
                            <p className="text-xs text-slate-400 font-mono">
                              Selecciona otro período en los botones superiores para explorar más registros.
                            </p>
                          </div>
                        );
                      }

                      return filteredReceived.map((gift) => {
                        const isCert = gift.giftName.toLowerCase().includes('certificado');
                        const isWatch = gift.giftName.toLowerCase().includes('reloj');
                        const isSelected = selectedShowcaseGiftId === gift.id || (isCert && selectedShowcaseGiftId === 'g-1') || (isWatch && selectedShowcaseGiftId === 'g-5');

                        return (
                          <div
                            key={gift.id}
                            onClick={() => setSelectedShowcaseGiftId(gift.id)}
                            className={`rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative group cursor-pointer ${
                              isSelected 
                                ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/80 shadow-md' 
                                : 'bg-white border-pink-100 hover:border-pink-300 hover:bg-pink-50/30'
                            }`}
                          >
                            {/* Selected Active Badge */}
                            {isSelected && (
                              <span className="absolute -top-2.5 right-4 px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[9px] rounded-full uppercase tracking-wider font-mono shadow-xs">
                                👁️ EN GRANDE
                              </span>
                            )}

                            {/* Top row: Sender Avatar & Details + Valuation */}
                            <div className="flex items-start justify-between gap-2.5 pb-2.5 border-b border-slate-100">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={gift.senderAvatar}
                                  alt={gift.senderName}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-pink-400/60 shrink-0"
                                />
                                <div className="min-w-0">
                                  <span className="text-[9px] uppercase font-mono font-bold text-pink-600 block tracking-wider">
                                    REGALADO POR:
                                  </span>
                                  <h4 className="text-xs font-bold text-slate-900 truncate font-serif flex items-center gap-1">
                                    {gift.senderName}
                                    {gift.isExclusive && <Crown className="w-3 h-3 text-amber-500 shrink-0" />}
                                  </h4>
                                  <span className="text-[10px] text-slate-400 font-mono truncate block">@{gift.senderUsername}</span>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-xs font-black font-mono text-amber-600 block">🪙 {gift.price.toLocaleString()}</span>
                                <span className="text-[10px] text-emerald-600 font-mono font-bold">({gift.euroCost}€)</span>
                              </div>
                            </div>

                            {/* Gift Badge & Name */}
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                                {gift.giftIcon}
                              </div>
                              <div className="min-w-0">
                                <span className="text-xs font-extrabold text-slate-800 block truncate font-serif">
                                  {gift.giftName}
                                </span>
                                <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600 inline-block">
                                  {gift.category === 'lujo' ? '👑 Lujo VIP' : gift.category === 'intermedio' ? '💎 Joyería' : '⭐ Esencial'}
                                </span>
                              </div>
                            </div>

                            {/* Message Quotation */}
                            <div className="bg-slate-50/80 rounded-xl p-2.5 border border-slate-100 text-[11px] italic text-slate-700 font-serif leading-relaxed line-clamp-3">
                              "{gift.message}"
                            </div>

                            {/* Bottom Row Actions */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                                <CheckCircle2 className="w-3 h-3" />
                                {gift.dateFormatted}
                              </span>

                              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                <button
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
                                  className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[9px] uppercase transition cursor-pointer flex items-center gap-0.5"
                                  title="Ver en Grande"
                                >
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>{isCert ? '📜 Ver' : 'Ver'}</span>
                                </button>

                                <button
                                  onClick={() => handleThankSender(gift)}
                                  className="px-2.5 py-1 bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white border border-pink-200 rounded-lg font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
                                >
                                  <Heart className="w-3 h-3" />
                                  <span>Agradecer</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>

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
                        { id: 'lujo', label: '👑 Lujo VIP', icon: Crown },
                        { id: 'intermedio', label: '💎 Moda & Joyería', icon: Gem },
                        { id: 'basico', label: '⭐ Esenciales', icon: Star },
                      ].map(cat => {
                        const Icon = cat.icon;
                        const isActive = sentCategoryFilter === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setSentCategoryFilter(cat.id as any)}
                            className={`px-3.5 py-1.5 rounded-full border transition-all duration-200 shrink-0 flex items-center gap-1 cursor-pointer select-none ${
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

                  {/* Sent Gifts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                          <div className="col-span-full bg-white rounded-2xl border border-dashed border-pink-200 p-8 text-center space-y-2">
                            <Clock className="w-8 h-8 text-pink-400 mx-auto" />
                            <h4 className="font-serif font-bold text-slate-800 text-sm">
                              No hay regalos enviados en el período: {giftTimeFilter === 'actuales' ? 'Actuales (Última semana)' : giftTimeFilter === 'recientes' ? 'Recientes (Último mes)' : 'Antiguos (> 1 mes)'}
                            </h4>
                            <p className="text-xs text-slate-400 font-mono">
                              Selecciona otro período en los botones superiores para explorar más envíos o envía un nuevo regalo desde el catálogo.
                            </p>
                          </div>
                        );
                      }

                      return filteredSent.map((gift) => (
                        <div
                          key={gift.id}
                          className="bg-white rounded-2xl border border-pink-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative group"
                        >
                          {/* Top row: Recipient Avatar & Details + Price */}
                          <div className="flex items-start justify-between gap-2.5 pb-2.5 border-b border-slate-100">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={gift.receiverAvatar}
                                alt={gift.receiverName}
                                className="w-10 h-10 rounded-full object-cover border-2 border-amber-400/60 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="text-[9px] uppercase font-mono font-bold text-amber-600 block tracking-wider">
                                  ENVIADO PARA:
                                </span>
                                <h4 className="text-xs font-bold text-slate-900 truncate font-serif flex items-center gap-1">
                                  {gift.receiverName}
                                </h4>
                                <span className="text-[10px] text-slate-400 font-mono truncate block">@{gift.receiverUsername}</span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-xs font-black font-mono text-amber-600 block">🪙 {gift.price.toLocaleString()}</span>
                              <span className="text-[10px] text-emerald-600 font-mono font-bold">({gift.euroCost}€)</span>
                            </div>
                          </div>

                          {/* Gift Badge & Name */}
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-lg shrink-0">
                              {gift.giftIcon}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-extrabold text-slate-800 block truncate font-serif">
                                {gift.giftName}
                              </span>
                              <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-800 inline-block">
                                {gift.isExclusive ? '👑 Lujo VIP' : '✨ Detalle Especial'}
                              </span>
                            </div>
                          </div>

                          {/* Dedication Message */}
                          <div className="bg-amber-50/40 rounded-xl p-2.5 border border-amber-100/60 text-[11px] italic text-slate-700 font-serif leading-relaxed line-clamp-3">
                            "{gift.message}"
                          </div>

                          {/* Bottom Row Actions */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                            <span className="flex items-center gap-1 text-emerald-600 font-bold">
                              <Check className="w-3 h-3" />
                              {gift.dateFormatted}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {gift.isExclusive && (
                                <button
                                  onClick={() => {
                                    setActiveModalGift(gift);
                                    setShowLuxuryWatchModal(true);
                                  }}
                                  className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[9px] uppercase transition cursor-pointer flex items-center gap-0.5"
                                  title="Ver Animación de Lujo"
                                >
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>3D</span>
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setRecipientModelId(models.find(m => m.name === gift.receiverName)?.id || 'topf-1');
                                  setGiftsSubTab('catalog');
                                }}
                                className="px-2.5 py-1 bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white border border-pink-200 rounded-lg font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
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
