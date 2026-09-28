/**
 * roundsDatabase.ts
 * Gestor de Base de Datos Independiente para cada Ronda.
 * 
 * Reglas de negocio:
 * 1. Cada Ronda cuenta con su PROPIA base de datos independiente (almacenada individualmente en `ronda_db_${id}`).
 * 2. Conforme se van celebrando rondas se van enumerando desde el 0 en adelante (roundIndex: 0, 1, 2, ...).
 * 3. La primera ronda celebrada de una categoría se denomina "REF: 1", la segunda "REF: 2", la tercera "REF: 3", etc.
 * 4. Toda la información de participantes, votos, comentarios y resultados queda archivada de forma única para esa ronda.
 */

import { safeGetItem, safeSetItem } from './safeStorage';
import type { RoundCategoryKey, RoundDatabaseRecord, RoundParticipant, RoundComment, RoundResults } from '../types';

export const ROUND_CATEGORIES: Record<RoundCategoryKey, {
  key: RoundCategoryKey;
  title: string;
  category: string;
  brand: string;
  entryFee: number;
  poolMultiplier: number;
}> = {
  streetwear: {
    key: 'streetwear',
    title: 'Round STREETWEAR & URBAN',
    category: 'Round STREETWEAR & URBAN',
    brand: 'Estilo moderno, sneakers, denim y cultura street.',
    entryFee: 10,
    poolMultiplier: 10
  },
  casual: {
    key: 'casual',
    title: 'Round CASUAL & LIFESTYLE',
    category: 'Round CASUAL & LIFESTYLE',
    brand: 'Estilo ropa cotidiana, lifestyle, marcas comerciales y e-commerce.',
    entryFee: 100,
    poolMultiplier: 10
  },
  glamour: {
    key: 'glamour',
    title: 'Ronda Glamour ✨',
    category: 'Ronda Glamour ✨',
    brand: 'vestidos, belleza, eventos, alfombra roja y looks impactantes.',
    entryFee: 1000,
    poolMultiplier: 10
  },
  elegant: {
    key: 'elegant',
    title: 'Ronda Elegant & Classic 🤍',
    category: 'Ronda Elegant & Classic 🤍',
    brand: 'sofisticado, clásico, atemporal y refinado.',
    entryFee: 10000,
    poolMultiplier: 10
  },
  highfashion_100k: {
    key: 'highfashion_100k',
    title: 'Ronda High Fashion 👠',
    category: 'Ronda High Fashion 👠',
    brand: 'alta moda, diseñadores, pasarela y tendencias.',
    entryFee: 100000,
    poolMultiplier: 10
  },
  highfashion_1m: {
    key: 'highfashion_1m',
    title: 'Ronda High Fashion 👠',
    category: 'Ronda High Fashion 👠',
    brand: 'alta moda, diseñadores, pasarela y tendencias.',
    entryFee: 1000000,
    poolMultiplier: 10
  }
};

// Base participants pools
const DEFAULT_PARTICIPANTS_POOLS: Record<RoundCategoryKey, RoundParticipant[]> = {
  streetwear: [
    { id: 'trab-1', name: 'Lucas Torres', username: 'lucas_torres_design', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=650', role: 'Diseñador Gráfico', projectTitle: 'Urban Streetwear Collection', votesReceived: 3 },
    { id: 'trab-2', name: 'Clara Vega', username: 'clara_patronaje', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650', role: 'Patronista Textil', projectTitle: 'Eco-Denim Revolution', votesReceived: 2 },
    { id: 'trab-3', name: 'Mateo Ruiz', username: 'mateo_fotografo', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=650', role: 'Fotógrafo de Moda', projectTitle: 'Neon Lookbook 2026', votesReceived: 2 },
    { id: 'trab-4', name: 'Paula Gómez', username: 'paula_estilista', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650', role: 'Estilista Senior', projectTitle: 'Futuristic Streetwear', votesReceived: 1 },
    { id: 'trab-5', name: 'Hugo Silva', username: 'hugo_luces', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650', role: 'Técnico Iluminación', projectTitle: 'Light & Shadow Runway', votesReceived: 0 },
    { id: 'trab-6', name: 'Natalia Cruz', username: 'natalia_costura', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650', role: 'Costurera Alta Costura', projectTitle: 'Atelier Pop-Up', votesReceived: 1 },
    { id: 'trab-7', name: 'Álvaro Díaz', username: 'alvaro_makeup', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=650', role: 'Maquillador Profesional', projectTitle: 'Cyberpunk Glow', votesReceived: 0 },
    { id: 'trab-8', name: 'Lucía Navarro', username: 'lucia_produccion', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Asistente Producción', projectTitle: 'Runway Logistics Hub', votesReceived: 0 },
    { id: 'trab-9', name: 'Daniel Morales', username: 'daniel_3d_moda', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=650', role: 'Modelista Digital', projectTitle: 'Metaverse Sneakers 3D', votesReceived: 1 },
    { id: 'trab-10', name: 'Marina Serrano', username: 'marina_serrano_mod', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Patronista Sostenible', projectTitle: 'Zero-Waste Patterning', votesReceived: 0 }
  ],
  casual: [
    { id: 'f-1', name: 'Alessia Vance', username: 'alessia_vance_w1', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=650', role: 'Modelo Directora', projectTitle: 'Casual Chic Essentials', votesReceived: 3 },
    { id: 'f-2', name: 'Gisele Bündchen', username: 'gisele_invest', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Inversora Principal', projectTitle: 'Eco Cotton Wardrobe', votesReceived: 2 },
    { id: 'f-3', name: 'Marcus Vance', username: 'marcus_v_capital', avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=650', role: 'Asesor Fintech', projectTitle: 'Smart Fabric Apparel', votesReceived: 1 },
    { id: 'f-4', name: 'Sienna Cole', username: 'sienna_cole', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650', role: 'Modelo Patrocinada', projectTitle: 'Lifestyle Activewear', votesReceived: 2 },
    { id: 'f-5', name: 'Liam Cooper', username: 'liam_c_invest', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650', role: 'Socio Inversor', projectTitle: 'Minimalist Daily Line', votesReceived: 1 },
    { id: 'f-6', name: 'Elena Rostova', username: 'elena_r_finanzas', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650', role: 'Gestora de Cuentas', projectTitle: 'Sustainable Loungewear', votesReceived: 0 },
    { id: 'f-7', name: 'David K.', username: 'david_growth_ff', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=650', role: 'Patrocinador Premium', projectTitle: 'Urban Commuter Kit', votesReceived: 0 },
    { id: 'f-8', name: 'Sofia Martinez', username: 'sofia_m_wealth', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=650', role: 'Planificadora Financiera', projectTitle: 'Breathable Knitwear', votesReceived: 1 },
    { id: 'f-9', name: 'Yasmin Santos', username: 'yasmin_model_ff', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650', role: 'Líder de Colectiva', projectTitle: 'Summer Breeze Casual', votesReceived: 0 },
    { id: 'f-10', name: 'Carlos Slim', username: 'carlos_slim_jr', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=650', role: 'Presidente de Honor', projectTitle: 'Executive Casual Line', votesReceived: 0 }
  ],
  glamour: [
    { id: 'emp-1', name: 'Alexander Wright', username: 'alex_wright_ceo', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=650', role: 'CEO Haute Couture', projectTitle: 'Red Carpet Silk Gowns', votesReceived: 4 },
    { id: 'emp-2', name: 'Victoria Sterling', username: 'victoria_sterling', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Dir. Expansión Global', projectTitle: 'Monaco Gala Capsule', votesReceived: 2 },
    { id: 'emp-3', name: 'Bruno Rossi', username: 'bruno_rossi_milan', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650', role: 'Presidente Textil Milano', projectTitle: 'Milano Crystal Corset', votesReceived: 2 },
    { id: 'emp-4', name: 'Isabella Fontana', username: 'isabella_creative', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Directora Creativa', projectTitle: 'Velvet Evening Collection', votesReceived: 1 },
    { id: 'emp-5', name: 'Maximilian Weber', username: 'max_weber_ops', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=650', role: 'Dir. Operaciones', projectTitle: 'Diamond Dust Fabrics', votesReceived: 0 },
    { id: 'emp-6', name: 'Claudia Mendez', username: 'claudia_tech', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650', role: 'Fundadora FashionTech', projectTitle: 'Smart Sparkle Textiles', votesReceived: 1 },
    { id: 'emp-7', name: 'Roberto Conti', username: 'roberto_consejero', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=650', role: 'Consejero Delegado', projectTitle: 'Venice Golden Mask Line', votesReceived: 0 },
    { id: 'emp-8', name: 'Valerie Dupont', username: 'valerie_dupont_paris', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650', role: 'Dir. Franquicias', projectTitle: 'Parisian Midnight Elegance', votesReceived: 0 },
    { id: 'emp-9', name: 'Fernando Alarcón', username: 'fernando_corp', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=650', role: 'Inversor Corporativo', projectTitle: 'Satin Luxury Blazers', votesReceived: 0 },
    { id: 'emp-10', name: 'Olivia Bennett', username: 'olivia_strategy', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650', role: 'Consultora Estratégica', projectTitle: 'Hollywood Glamour Archival', votesReceived: 0 }
  ],
  elegant: [
    { id: 'tm-1', name: 'Kendall Jenner', username: 'kendall_jenner_vip', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Top Model Internacional', projectTitle: 'Atelier Minimal Classic', votesReceived: 4 },
    { id: 'tm-2', name: 'Gigi Hadid', username: 'gigi_hadid_official', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650', role: 'Embajadora Global', projectTitle: 'Cashmere Monogram Wrap', votesReceived: 2 },
    { id: 'tm-3', name: 'Bella Hadid', username: 'bella_hadid_runway', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Icono Pasarela', projectTitle: 'Vintage Parisian Silhouette', votesReceived: 2 },
    { id: 'tm-4', name: 'Naomi Campbell', username: 'naomi_campbell_mentor', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650', role: 'Supermodelo & Mentora', projectTitle: 'Timeless Power Tailoring', votesReceived: 1 },
    { id: 'tm-5', name: 'Cara Delevingne', username: 'cara_delevingne_live', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650', role: 'Actriz & Top Model', projectTitle: 'Rebel Elegance Tuxedo', votesReceived: 1 },
    { id: 'tm-6', name: 'Irina Shayk', username: 'irina_shayk_couture', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=650', role: 'Alta Costura Model', projectTitle: 'Sculpted Silhouette Dress', votesReceived: 0 },
    { id: 'tm-7', name: 'Candice Swanepoel', username: 'candice_swim', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=650', role: 'Directora de Marca', projectTitle: 'Pure White Silk Cape', votesReceived: 0 },
    { id: 'tm-8', name: 'Karlie Kloss', username: 'karlie_kloss_tech', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=650', role: 'Empresaria & Modelo', projectTitle: 'Smart Tailoring Line', votesReceived: 0 },
    { id: 'tm-9', name: 'Joan Smalls', username: 'joan_smalls_runway', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=650', role: 'Líder de Pasarelas', projectTitle: 'Architectural Trench', votesReceived: 0 },
    { id: 'tm-10', name: 'Alessandra Ambrosio', username: 'alessandra_ambrosio', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650', role: 'Top Model Ejecutiva', projectTitle: 'Sunset Classic Glam', votesReceived: 0 }
  ],
  highfashion_100k: [
    { id: 'inv-1', name: 'Warren Buffett', username: 'warren_berkshire', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=650', role: 'Pres. Fondo Berkshire', projectTitle: 'Value Heritage Couture', votesReceived: 4 },
    { id: 'inv-2', name: 'Bernard Arnault', username: 'bernard_lvmh_group', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650', role: 'Presidente LVMH', projectTitle: 'Luxe Global Dynasty', votesReceived: 2 },
    { id: 'inv-3', name: 'François Pinault', username: 'francois_kering', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=650', role: 'Grupo Kering Inversión', projectTitle: 'Avant-Garde Paris Atelier', votesReceived: 2 },
    { id: 'inv-4', name: 'Amancio Ortega', username: 'amancio_inditex_cap', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=650', role: 'Fundador Inditex Capital', projectTitle: 'High-Speed Luxury Supply', votesReceived: 1 },
    { id: 'inv-5', name: 'Alice Walton', username: 'alice_walton_vc', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Venture Capital Global', projectTitle: 'Artistic Textiles Fund', votesReceived: 1 },
    { id: 'inv-6', name: 'Ray Dalio', username: 'ray_dalio_bridgewater', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=650', role: 'Macro Hedge Fund', projectTitle: 'All-Weather Fashion Index', votesReceived: 0 },
    { id: 'inv-7', name: 'Abigail Johnson', username: 'abigail_fidelity', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650', role: 'Presidenta Fidelity', projectTitle: 'Fintech Couture Vault', votesReceived: 0 },
    { id: 'inv-8', name: 'Tadashi Yanai', username: 'tadashi_fast_retailing', avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=650', role: 'Presidente Fast Retailing', projectTitle: 'Precision High Fashion', votesReceived: 0 },
    { id: 'inv-9', name: 'Alain Wertheimer', username: 'alain_chanel_owner', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=650', role: 'Propietario Chanel', projectTitle: 'Rue Cambon Heritage Revival', votesReceived: 0 },
    { id: 'inv-10', name: 'Gérard Wertheimer', username: 'gerard_chanel_cfo', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650', role: 'Dir. Financiero Chanel', projectTitle: 'Timepiece & Gem Couture', votesReceived: 0 }
  ],
  highfashion_1m: [
    { id: 'mil-1', name: 'Carlos Slim', username: 'carlos_slim_jr', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=650', role: 'Presidente de Honor', projectTitle: 'Latin American Mega-Atelier', votesReceived: 4 },
    { id: 'mil-2', name: 'Elon Musk', username: 'elon_x_angels', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=650', role: 'Director Tecnológico & Angel', projectTitle: 'Space-Age Nanofiber Couture', votesReceived: 3 },
    { id: 'mil-3', name: 'Jeff Bezos', username: 'jeff_bezos_exp', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650', role: 'Fondo Expansión Global', projectTitle: 'Global Drone-Delivered Haute Couture', votesReceived: 1 },
    { id: 'mil-4', name: 'Mark Zuckerberg', username: 'mark_zuck_meta', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=650', role: 'Meta Inversiones XR', projectTitle: 'Holographic Runway Platform', votesReceived: 1 },
    { id: 'mil-5', name: 'Larry Ellison', username: 'larry_oracle_cap', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=650', role: 'Consejero Estratégico', projectTitle: 'Island Resort Exclusive Silk Line', votesReceived: 1 },
    { id: 'mil-6', name: 'Bill Gates', username: 'bill_gates_venture', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=650', role: 'Filantropía & Semilla', projectTitle: 'Carbon-Negative Synthetic Silk', votesReceived: 0 },
    { id: 'mil-7', name: 'Steve Ballmer', username: 'steve_ballmer_invest', avatar: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=650', role: 'Inversor Privado', projectTitle: 'Arena High-Fashion Sports', votesReceived: 0 },
    { id: 'mil-8', name: 'Mukesh Ambani', username: 'mukesh_reliance_luxe', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=650', role: 'Comercial de Lujo', projectTitle: 'Imperial Royal Embroidery', votesReceived: 0 },
    { id: 'mil-9', name: 'Françoise Bettencourt', username: 'francoise_loreal_luxe', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650', role: 'Heredera L\'Oréal Luxe', projectTitle: 'Biological Skin-Glow Fashion', votesReceived: 0 },
    { id: 'mil-10', name: 'Gautam Adani', username: 'adani_infra_fashion', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650', role: 'Grupo Infraestructura', projectTitle: 'Solar Port Textile Corridor', votesReceived: 0 }
  ]
};

// Initial comments for newly opened rounds
const INITIAL_COMMENTS_TEMPLATE: RoundComment[] = [
  { id: 'rc-1', userName: 'Lucas Torres', userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200', text: '¡Increíble propuesta para esta ronda! Votando ya 🔥', timeAgo: 'hace 2 min', likes: 14, userLiked: false },
  { id: 'rc-2', userName: 'Clara Vega', userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', text: 'Diseño innovador y acabados impecables 👏', timeAgo: 'hace 1 min', likes: 8, userLiked: true },
  { id: 'rc-3', userName: 'Mateo Ruiz', userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', text: 'Mi voto definitivo va para este proyecto 🚀💯', timeAgo: 'hace unos momentos', likes: 5, userLiked: false },
  { id: 'rc-4', userName: 'Paula Gómez', userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200', text: '¡Mucho éxito a todos los 10 participantes! ✨', timeAgo: 'hace unos momentos', likes: 12, userLiked: false }
];

/**
 * Storage keys
 */
const REGISTRY_STORAGE_KEY = 'rondas_master_registry_v2';
const CATEGORY_COUNTER_PREFIX = 'ronda_category_counter_v2_';
const ROUND_DB_PREFIX = 'ronda_db_';

/**
 * Helper to resolve the category key from session, fee, or category string
 */
export function resolveCategoryKey(input?: any): RoundCategoryKey {
  if (!input) return 'streetwear';
  
  if (typeof input === 'string') {
    const s = input.toLowerCase();
    if (s === 'streetwear' || s === 'casual' || s === 'glamour' || s === 'elegant' || s === 'highfashion_100k' || s === 'highfashion_1m') {
      return s as RoundCategoryKey;
    }
    if (s.includes('streetwear') || s.includes('trabajadores') || s.includes('10€')) return 'streetwear';
    if (s.includes('casual') || s.includes('lifestyle') || s.includes('emprendedor') || s.includes('100€')) return 'casual';
    if (s.includes('glamour') || s.includes('empresarios') || s.includes('1000') || s.includes('1.000')) return 'glamour';
    if (s.includes('elegant') || s.includes('classic') || s.includes('topmodels') || s.includes('10000') || s.includes('10.000')) return 'elegant';
    if (s.includes('1000000') || s.includes('1.000.000') || s.includes('millonar')) return 'highfashion_1m';
    if (s.includes('100000') || s.includes('100.000') || s.includes('invers')) return 'highfashion_100k';
    return 'streetwear';
  }

  const fee = typeof input.entryFee === 'number' ? input.entryFee : undefined;
  const cat = (input.category || input.title || input.id || '').toUpperCase();

  if (fee === 10 || cat.includes('STREETWEAR') || cat.includes('TRABAJADORES') || input.id === 'sess-trabajadores-1') return 'streetwear';
  if (fee === 100 || cat.includes('CASUAL') || cat.includes('EMPRENDEDOR') || cat.includes('LIFESTYLE') || input.id === 'sess-emprendedores-1') return 'casual';
  if (fee === 1000 || cat.includes('GLAMOUR') || cat.includes('EMPRESARIOS') || input.id === 'sess-empresarios-1') return 'glamour';
  if (fee === 10000 || cat.includes('ELEGANT') || cat.includes('CLASSIC') || cat.includes('TOPMODELS') || input.id === 'sess-topmodels-1') return 'elegant';
  if (fee === 1000000 || cat.includes('MILLONAR') || input.id === 'sess-millonarios-1') return 'highfashion_1m';
  if (fee === 100000 || cat.includes('HIGH FASHION') || cat.includes('INVERSI') || input.id === 'sess-inversores-1') return 'highfashion_100k';

  return 'streetwear';
}

/**
 * Format reference string strictly as "REF: 1", "REF: 2", etc.
 */
export function formatRoundRef(num: number): string {
  const safeNum = Math.max(1, Math.floor(num));
  return `REF: ${safeNum}`;
}

/**
 * Get the current celebrated count for a category (starts at 0)
 */
export function getCategoryCelebratedCount(categoryKey: RoundCategoryKey): number {
  try {
    const raw = safeGetItem(`${CATEGORY_COUNTER_PREFIX}${categoryKey}`);
    if (raw !== null) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
  } catch (e) {}
  return 0;
}

/**
 * Set celebrated count for a category
 */
export function setCategoryCelebratedCount(categoryKey: RoundCategoryKey, count: number): void {
  try {
    safeSetItem(`${CATEGORY_COUNTER_PREFIX}${categoryKey}`, String(Math.max(0, count)));
  } catch (e) {}
}

/**
 * Get individual database record for a round ID
 */
export function getRoundDatabase(roundId: string): RoundDatabaseRecord | null {
  if (!roundId) return null;
  try {
    const raw = safeGetItem(`${ROUND_DB_PREFIX}${roundId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id) return parsed as RoundDatabaseRecord;
    }
  } catch (e) {}
  return null;
}

/**
 * Save individual database record for a round ID
 */
export function saveRoundDatabase(record: RoundDatabaseRecord): void {
  if (!record || !record.id) return;
  try {
    safeSetItem(`${ROUND_DB_PREFIX}${record.id}`, JSON.stringify(record));
    updateRegistryEntry(record);
  } catch (e) {
    console.error(`[roundsDatabase] Error saving database for round ${record.id}:`, e);
  }
}

/**
 * Read the master registry of all rounds
 */
export function getRoundsRegistry(): Array<{
  id: string;
  categoryKey: RoundCategoryKey;
  roundIndex: number;
  reference: string;
  title: string;
  entryFee: number;
  status: 'active' | 'voting' | 'completed';
  createdAt: string;
  celebratedAt?: string;
  winnerName?: string;
}> {
  try {
    const raw = safeGetItem(REGISTRY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

/**
 * Internal: update or insert a round into the master registry
 */
function updateRegistryEntry(record: RoundDatabaseRecord): void {
  try {
    const registry = getRoundsRegistry();
    const existingIdx = registry.findIndex(r => r.id === record.id);
    const winnerName = record.results?.winners?.[0]?.name;

    const entry = {
      id: record.id,
      categoryKey: record.categoryKey,
      roundIndex: record.roundIndex,
      reference: record.reference,
      title: record.title,
      entryFee: record.entryFee,
      status: record.status,
      createdAt: record.createdAt,
      celebratedAt: record.celebratedAt,
      winnerName
    };

    if (existingIdx !== -1) {
      registry[existingIdx] = entry;
    } else {
      registry.push(entry);
    }

    safeSetItem(REGISTRY_STORAGE_KEY, JSON.stringify(registry));
  } catch (e) {}
}

/**
 * Create a fresh round database record for a category and index
 */
export function createNewRoundRecord(
  categoryKey: RoundCategoryKey,
  roundIndex: number,
  customId?: string
): RoundDatabaseRecord {
  const config = ROUND_CATEGORIES[categoryKey];
  const reference = formatRoundRef(roundIndex + 1);
  const id = customId || `ronda_${categoryKey}_idx${roundIndex}_${Date.now()}`;
  const participants = JSON.parse(JSON.stringify(DEFAULT_PARTICIPANTS_POOLS[categoryKey]));
  const presenter = participants[0] || {
    id: `pres-${categoryKey}`,
    name: 'Presentador Oficial',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
    role: 'Director de Ronda'
  };

  const initialVotes: Record<string, number> = {};
  participants.forEach((p: RoundParticipant) => {
    initialVotes[p.id] = p.votesReceived || 0;
  });

  const record: RoundDatabaseRecord = {
    id,
    categoryKey,
    roundIndex, // 0, 1, 2...
    reference, // REF: 1, REF: 2...
    roundNumber: roundIndex + 1,
    title: config.title,
    brand: config.brand,
    category: config.category,
    entryFee: config.entryFee,
    totalParticipants: 10,
    status: 'active',
    createdAt: new Date().toISOString(),
    presenter: {
      id: presenter.id,
      name: presenter.name,
      avatar: presenter.avatar,
      role: presenter.role
    },
    participants,
    votes: initialVotes,
    voters: {},
    comments: JSON.parse(JSON.stringify(INITIAL_COMMENTS_TEMPLATE))
  };

  saveRoundDatabase(record);
  return record;
}

/**
 * Initialize / Bootstrap databases for all 6 round categories
 */
export function initRoundsDatabase(): Record<RoundCategoryKey, RoundDatabaseRecord> {
  const activeRecords: Partial<Record<RoundCategoryKey, RoundDatabaseRecord>> = {};
  const categories: RoundCategoryKey[] = ['streetwear', 'casual', 'glamour', 'elegant', 'highfashion_100k', 'highfashion_1m'];

  // Known legacy default IDs to link seamlessly with existing component views
  const legacyDefaultIds: Record<RoundCategoryKey, string> = {
    streetwear: 'sess-trabajadores-1',
    casual: 'sess-emprendedores-1',
    glamour: 'sess-empresarios-1',
    elegant: 'sess-topmodels-1',
    highfashion_100k: 'sess-inversores-1',
    highfashion_1m: 'sess-millonarios-1'
  };

  for (const catKey of categories) {
    const celebratedCount = getCategoryCelebratedCount(catKey);
    // Look for an existing active round for this category
    const registry = getRoundsRegistry();
    const activeEntry = registry.find(r => r.categoryKey === catKey && r.status !== 'completed');

    if (activeEntry) {
      const db = getRoundDatabase(activeEntry.id);
      if (db) {
        activeRecords[catKey] = db;
        continue;
      }
    }

    // Check if legacy ID has a database
    const legacyId = legacyDefaultIds[catKey];
    const existingLegacyDb = getRoundDatabase(legacyId);
    if (existingLegacyDb && existingLegacyDb.status !== 'completed') {
      activeRecords[catKey] = existingLegacyDb;
      continue;
    }

    // Otherwise, create initial round with roundIndex = celebratedCount
    // If celebratedCount === 0: roundIndex = 0, reference = "REF: 1"
    const newRecord = createNewRoundRecord(catKey, celebratedCount, legacyId);
    activeRecords[catKey] = newRecord;
  }

  return activeRecords as Record<RoundCategoryKey, RoundDatabaseRecord>;
}

/**
 * Get the currently active round record for a category
 */
export function getActiveRoundForCategory(categoryKey: RoundCategoryKey): RoundDatabaseRecord {
  const registry = getRoundsRegistry();
  const activeEntry = registry.find(r => r.categoryKey === categoryKey && r.status !== 'completed');
  if (activeEntry) {
    const db = getRoundDatabase(activeEntry.id);
    if (db) return db;
  }

  const legacyDefaultIds: Record<RoundCategoryKey, string> = {
    streetwear: 'sess-trabajadores-1',
    casual: 'sess-emprendedores-1',
    glamour: 'sess-empresarios-1',
    elegant: 'sess-topmodels-1',
    highfashion_100k: 'sess-inversores-1',
    highfashion_1m: 'sess-millonarios-1'
  };
  const legacyId = legacyDefaultIds[categoryKey];
  const existingLegacyDb = getRoundDatabase(legacyId);
  if (existingLegacyDb && existingLegacyDb.status !== 'completed') {
    return existingLegacyDb;
  }

  const count = getCategoryCelebratedCount(categoryKey);
  return createNewRoundRecord(categoryKey, count, legacyId);
}

/**
 * Returns formatted round reference (e.g. "REF: 1", "REF: 2") for any session object
 */
export function getRoundReference(session?: any, fallbackIndex?: number): string {
  if (!session) {
    if (typeof fallbackIndex === 'number' && fallbackIndex >= 0) {
      return formatRoundRef(fallbackIndex + 1);
    }
    return 'REF: 1';
  }

  // If session already has a valid normalized reference
  if (typeof session.reference === 'string' && session.reference.trim()) {
    const refStr = session.reference.trim();
    // Normalize format to REF: X
    const match = refStr.match(/ref[:\s]*(\d+)/i);
    if (match) {
      return formatRoundRef(parseInt(match[1], 10));
    }
    return refStr;
  }

  // Look up in individual round database
  if (session.id) {
    const db = getRoundDatabase(session.id);
    if (db?.reference) {
      return db.reference;
    }
  }

  // Check category counter / index
  const catKey = resolveCategoryKey(session);
  const activeRound = getActiveRoundForCategory(catKey);
  if (activeRound?.reference) {
    return activeRound.reference;
  }

  if (typeof session.roundNumber === 'number' && session.roundNumber > 0) {
    return formatRoundRef(session.roundNumber);
  }

  if (typeof session.roundIndex === 'number' && session.roundIndex >= 0) {
    return formatRoundRef(session.roundIndex + 1);
  }

  if (typeof fallbackIndex === 'number' && fallbackIndex >= 0) {
    return formatRoundRef(fallbackIndex + 1);
  }

  return 'REF: 1';
}

/**
 * Celebrate current round:
 * 1. Archives this round's database as 'completed' with its results, winner, votes.
 * 2. Increments the category counter (from 0 to 1, or 1 to 2, etc.).
 * 3. Creates the NEXT round with index = newCount, reference = REF: ${newCount + 1}.
 * 4. Saves the new round with its own dedicated database!
 * 5. Fires event so UI updates instantly.
 */
export function celebrateRoundDatabase(
  roundIdOrSession: string | any,
  results?: Partial<RoundResults>
): { completedRound: RoundDatabaseRecord; nextRound: RoundDatabaseRecord } {
  let targetId = typeof roundIdOrSession === 'string' ? roundIdOrSession : roundIdOrSession?.id;
  let catKey: RoundCategoryKey = 'streetwear';

  let currentDb: RoundDatabaseRecord | null = null;
  if (targetId) {
    currentDb = getRoundDatabase(targetId);
  }

  if (!currentDb && typeof roundIdOrSession === 'object') {
    catKey = resolveCategoryKey(roundIdOrSession);
    currentDb = getActiveRoundForCategory(catKey);
  } else if (currentDb) {
    catKey = currentDb.categoryKey;
  }

  if (!currentDb) {
    currentDb = getActiveRoundForCategory(catKey);
  }

  const celebratedCount = getCategoryCelebratedCount(catKey);
  const now = new Date().toISOString();

  // 1. Finalize the current round and save its permanent database record
  const poolMultiplier = ROUND_CATEGORIES[catKey].poolMultiplier;
  const poolTotal = results?.poolTotal ?? (currentDb.entryFee * poolMultiplier);

  // Determine winners
  let winners = results?.winners;
  if (!winners || winners.length === 0) {
    // Sort participants by votes
    const sorted = [...currentDb.participants].sort((a, b) => (b.votesReceived || 0) - (a.votesReceived || 0));
    const topVotes = sorted[0]?.votesReceived || 0;
    const topTied = sorted.filter(p => (p.votesReceived || 0) === topVotes && topVotes > 0);
    const effectiveWinners = topTied.length > 0 ? topTied : [sorted[0] || currentDb.participants[0]];
    const prizeShare = Math.round((poolTotal * 0.9) / effectiveWinners.length);

    winners = effectiveWinners.map(w => ({
      id: w.id,
      name: w.name,
      avatar: w.avatar,
      votes: w.votesReceived || 0,
      prize: prizeShare,
      role: w.role
    }));
  }

  currentDb.status = 'completed';
  currentDb.celebratedAt = now;
  currentDb.results = {
    poolTotal,
    winners,
    sponsorShare: Math.round(poolTotal * 0.1),
    celebratedDate: now,
    isTie: (winners.length > 1),
    ...results
  };

  // Save completed round database permanently
  saveRoundDatabase(currentDb);

  // 2. Increment category count (starts from 0 -> now 1, 2, etc.)
  const newCelebratedCount = celebratedCount + 1;
  setCategoryCelebratedCount(catKey, newCelebratedCount);

  // 3. Create NEXT round with index = newCelebratedCount and REF: (newCelebratedCount + 1)
  // For example: 1st round celebrated (index 0, REF: 1) -> next is (index 1, REF: 2)!
  const nextRound = createNewRoundRecord(catKey, newCelebratedCount);

  // 4. Notify app listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('round-celebrated', {
      detail: {
        categoryKey: catKey,
        completedRound: currentDb,
        nextRound
      }
    }));
    window.dispatchEvent(new CustomEvent('rounds-database-updated', {
      detail: {
        categoryKey: catKey,
        activeRound: nextRound
      }
    }));
  }

  return { completedRound: currentDb, nextRound };
}

/**
 * Get all rounds (active + completed) stored in the database
 */
export function getAllRoundDatabases(): RoundDatabaseRecord[] {
  const registry = getRoundsRegistry();
  const records: RoundDatabaseRecord[] = [];
  
  for (const entry of registry) {
    const db = getRoundDatabase(entry.id);
    if (db) {
      records.push(db);
    }
  }

  // Sort by category, then by roundIndex
  records.sort((a, b) => {
    if (a.categoryKey !== b.categoryKey) {
      return a.categoryKey.localeCompare(b.categoryKey);
    }
    return a.roundIndex - b.roundIndex;
  });

  return records;
}

/**
 * Get all completed/celebrated rounds
 */
export function getCelebratedRounds(categoryKey?: RoundCategoryKey): RoundDatabaseRecord[] {
  const all = getAllRoundDatabases();
  return all.filter(r => r.status === 'completed' && (!categoryKey || r.categoryKey === categoryKey));
}

/**
 * Export a round database record as formatted JSON
 */
export function exportRoundDatabaseJSON(record: RoundDatabaseRecord): string {
  return JSON.stringify(record, null, 2);
}

/**
 * Reset all rounds databases to pristine initial state (for testing / restart)
 */
export function resetAllRoundsDatabase(): void {
  try {
    const categories: RoundCategoryKey[] = ['streetwear', 'casual', 'glamour', 'elegant', 'highfashion_100k', 'highfashion_1m'];
    for (const c of categories) {
      setCategoryCelebratedCount(c, 0);
    }
    const registry = getRoundsRegistry();
    for (const item of registry) {
      try {
        localStorage.removeItem(`${ROUND_DB_PREFIX}${item.id}`);
      } catch (e) {}
    }
    try {
      localStorage.removeItem(REGISTRY_STORAGE_KEY);
      localStorage.removeItem('open_finanzas_sessions_list_v43');
    } catch (e) {}
    
    // Re-bootstrap
    initRoundsDatabase();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('rounds-database-updated'));
    }
  } catch (e) {}
}

// Auto-run bootstrap when imported
if (typeof window !== 'undefined') {
  initRoundsDatabase();
}
