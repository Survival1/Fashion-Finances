/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModelProfile, UserSessionProfile, InvestmentSession, ProjectData, ChatMessage, FinancialMovement } from '../types';

// Diverse collection of high-quality modeling/headshot photos from Unsplash
const FASHION_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1512484776495-a09d92e87c3b?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600'
];

const MODEL_NAMES = [
  'Adriana Lima', 'Alexander Vance', 'Alessandra Ambrosio', 'Marcus Sterling', 'Candice Swanepoel',
  'Lucas Alvarez', 'Jasmine Tookes', 'Nicholas Cruz', 'Miranda Kerr', 'Julian Brooks',
  'Gisele Bündchen', 'Oliver Finch', 'Behati Prinsloo', 'Dante Moretti', 'Lily Aldridge',
  'Kenji Sato', 'Elsa Hosk', 'Gabriel Silva', 'Romee Strijd', 'Sébastien Foucan',
  'Sara Sampaio', 'Liam O\'Connor', 'Taylor Hill', 'Mateo Kovacic', 'Josephine Skriver',
  'Xavier Dupont', 'Lais Ribeiro', 'David Gandy', 'Stella Maxwell', 'Jon Kortajarena',
  'Martha Hunt', 'Sean O\'Pry', 'Barbara Palvin', 'Tyson Beckford', 'Grace Elizabeth',
  'Lucky Blue Smith', 'Leomie Anderson', 'Jordan Barrett', 'Alexina Graham', 'Jon Kortajarena',
  'Tyra Banks', 'Lachlan Watson', 'Heidi Klum', 'Alton Mason', 'Karolína Kurková',
  'Doutzen Kroes', 'Marisa Miller', 'Rosie Huntington-Whiteley', 'Izabel Goulart', 'Selita Ebanks'
];

const BIO_TEMPLATES = [
  'Modelo internacional y apasionado/a del fitness. Enfocado/a en expandir mi red de afiliados.',
  'Creador/a de tendencias y embajador/a de marcas de alta costura.',
  'Enfocado/a en el empoderamiento y nuevos negocios creativos. Miembro fundador de Fashion Finances.',
  'Modelando para agencias en París, Milán y Nueva York. Busco conectar inversores con proyectos potentes.',
  'Estilo de vida, moda urbana e innovación sostenible. Mentor de creadores emergentes.'
];

export interface RankingModel extends ModelProfile {
  gender: 'female' | 'male';
  statusText?: string;
}

export function generateTop100Ranking(): { females: RankingModel[], males: RankingModel[] } {
  const femaleNames = [
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
  ];

  const maleNames = [
    'Alexander Vance', 'Marcus Sterling', 'Lucas Alvarez', 'Nicholas Cruz', 'Julian Brooks',
    'Oliver Finch', 'Dante Moretti', 'Kenji Sato', 'Gabriel Silva', 'Sébastien Foucan',
    'Liam O\'Connor', 'Mateo Kovacic', 'Xavier Dupont', 'David Gandy', 'Jon Kortajarena',
    'Sean O\'Pry', 'Tyson Beckford', 'Lucky Blue Smith', 'Jordan Barrett', 'Alton Mason',
    'Lachlan Watson', 'Marlon Teixeira', 'Francisco Lachowski', 'Arthur Kulkov', 'Zhao Lei',
    'Rob Evans', 'Garrett Neff', 'Noah Mills', 'Evandro Soldati', 'Clement Chabernaud',
    'Baptiste Giabiconi', 'Johannes Huebl', 'Alex Lundqvist', 'Mark Vanderloo', 'Tyson Ballou',
    'Armando Cabral', 'Brad Kroenig', 'Paolo Roldan', 'Hu Bing', 'Will Chalker',
    'Ben Hill', 'David Chiang', 'Tony Ward', 'Janis Ancens', 'Edward Wilding',
    'Simon Nessman', 'Boyd Holbrook', 'Gaspard Ulliel', 'Channing Tatum', 'Chris Hemsworth'
  ];

  const femalePhotoIds = [
    'photo-1534528741775-53994a69daeb', // Adriana Lima
    'photo-1494790108377-be9c29b29330', // Alessandra Ambrosio
    'photo-1517841905240-472988babdf9', // Candice Swanepoel
    'photo-1524504388940-b1c1722653e1', // Jasmine Tookes
    'photo-1529139574466-a303027c1d8b', // Miranda Kerr
    'photo-1531746020798-e6953c6e8e04', // Gisele Bündchen
    'photo-1544005313-94ddf0286df2', // Behati Prinsloo
    'photo-1438761681033-6461ffad8d80', // Lily Aldridge
    'photo-1488426862026-3ee34a7d66df', // Elsa Hosk
    'photo-1506919258185-6078bba55d2a', // Romee Strijd
    'photo-1517841905240-472988babdf9', // Sara Sampaio
    'photo-1508214751196-bcfd4ca60f91', // Taylor Hill
    'photo-1520155707862-5b32817385d0', // Josephine Skriver
    'photo-1514315384763-ba401779410f', // Lais Ribeiro
    'photo-1485462537746-965f33f7f6a7', // Stella Maxwell
    'photo-1484186139897-d5fc6b908812', // Martha Hunt
    'photo-1492106087820-71f1a00d2b11', // Barbara Palvin
    'photo-1516522904-7c4511cd33bb', // Grace Elizabeth
    'photo-1519085360753-af0119f7cbe7', // Leomie Anderson
    'photo-1521572267360-ee0c2909d518', // Alexina Graham
    'photo-1548142813-c348350df52b', // Tyra Banks
    'photo-1554151228-14d9def656e4', // Heidi Klum
    'photo-1567532939604-b6b5b0db2604', // Karolína Kurková
    'photo-1496440737103-cd596325d314', // Doutzen Kroes
    'photo-1512484776495-a09d92e87c3b', // Marisa Miller
    'photo-1508214751196-bcfd4ca60f91', // Rosie Huntington-Whiteley
    'photo-1534751516642-a131fed10495', // Izabel Goulart
    'photo-1501196354995-cbb51c65aaea', // Selita Ebanks
    'photo-1526512340740-9217d0159da9', // Daniela Peštová
    'photo-1525134479668-1bee5c7c684a', // Helena Christensen
    'photo-1515886657613-9f3515b0c78f', // Laetitia Casta
    'photo-1545912443-5ee247a9601e', // Karen Mulder
    'photo-1552374196-1ab2a1c593e8', // Stephanie Seymour
    'photo-1519699047748-de8e457a634e', // Inés Rivero
    'photo-1524250502761-1ac6f2e30d43', // Chanel Iman
    'photo-1502823403499-6ccfcf4fb453', // Erin Heatherton
    'photo-1492562080023-ab3db95bfbce', // Lindsay Ellingson
    'photo-1513956589380-bad6acb9b9d4', // Jac Jagaciak
    'photo-1522075469751-3a6694fb2f61', // Kate Grigorieva
    'photo-1534528741775-53994a69daeb', // Bella Hadid
    'photo-1517841905240-472988babdf9', // Gigi Hadid
    'photo-1524504388940-b1c1722653e1', // Joan Smalls
    'photo-1488426862026-3ee34a7d66df', // Anok Yai
    'photo-1544005313-94ddf0286df2', // Paloma Elsesser
    'photo-1438761681033-6461ffad8d80', // Alex Consani
    'photo-1506919258185-6078bba55d2a', // Yumi Nu
    'photo-1544005313-94ddf0286df2', // Irina Shayk
    'photo-1508214751196-bcfd4ca60f91', // Sui He
    'photo-1520155707862-5b32817385d0', // Toni Garrn
    'photo-1514315384763-ba401779410f'  // Constance Jablonski
  ];

  const malePhotoIds = [
    'photo-1507003211169-0a1dd7228f2d',
    'photo-1506794778202-cad84cf45f1d',
    'photo-1539571696357-5a69c17a67c6',
    'photo-1488161628813-04466f872be2',
    'photo-1501196354995-cbb51c65aaea',
    'photo-1500648767791-00dcc994a43e',
    'photo-1492562080023-ab3db95bfbce',
    'photo-1500048993953-d23a436266cf',
    'photo-1519085360753-af0119f7cbe7',
    'photo-1505378877208-4100dc89025e',
    'photo-1522075469751-3a6694fb2f61',
    'photo-1560250097-0b93528c311a',
    'photo-1519345182560-3f2917c472ef',
    'photo-1489980508314-941910ded1f4',
    'photo-1503185912284-5271ff81b9a8',
    'photo-1508214751196-bcfd4ca60f91',
    'photo-1542909168-82c3e7fdca5c',
    'photo-1531427186611-ecfd6d936c79',
    'photo-1519345182560-3f2917c472ef',
    'photo-1489980508314-941910ded1f4',
    'photo-1500648767791-00dcc994a43e',
    'photo-1506794778202-cad84cf45f1d',
    'photo-1539571696357-5a69c17a67c6',
    'photo-1488161628813-04466f872be2',
    'photo-1501196354995-cbb51c65aaea'
  ];

  const females = femaleNames.map((name, i) => {
    const photoId = femalePhotoIds[i % femalePhotoIds.length];
    const likes = Math.max(1200, 15000 - i * 270 - Math.floor(Math.random() * 80));
    const followers = Math.floor(likes * 3.4 + Math.random() * 200);
    const sponsors = Math.floor(likes * 0.05 + 1);
    const username = name.toLowerCase().replace(/[^a-z]/g, '') + `_w${i + 1}`;
    
    const zoomUrl = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=400&h=540&sig=${i}`;
    const feedPhotos = [
      zoomUrl,
      `https://images.unsplash.com/${femalePhotoIds[(i + 1) % femalePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${femalePhotoIds[(i + 2) % femalePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${femalePhotoIds[(i + 3) % femalePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${femalePhotoIds[(i + 4) % femalePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${femalePhotoIds[(i + 5) % femalePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${femalePhotoIds[(i + 6) % femalePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${femalePhotoIds[(i + 7) % femalePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${femalePhotoIds[(i + 8) % femalePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${femalePhotoIds[(i + 9) % femalePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
    ];
    
    const femaleAgencies = ["Victoria's Secret", 'Ford Models', 'Elite Model Management', 'IMG Models', 'Next Management', 'Wilhelmina Models'];
    const fashionAgency = femaleAgencies[i % femaleAgencies.length];

    return {
      id: `topf-${i + 1}`,
      name,
      username,
      avatar: zoomUrl,
      bio: `Top ${i + 1} Modelo Femenina Global. Creadora oficial registrada, enfocada en conectar inversores con proyectos potentes.`,
      totalLikes: likes,
      followersCount: followers,
      photos: feedPhotos,
      referidosCount: sponsors,
      socials: {
        instagram: `@${username}`,
        twitter: `@${username}_real`,
        tiktok: `@${username}_tok`,
        instagramFollowers: Math.floor(followers * 0.58 + 450),
        tiktokFollowers: Math.floor(followers * 0.72 + 820)
      },
      gender: 'female' as const,
      isOnline: i % 5 === 0 || i === 3 || i === 12,
      statusText: i % 3 === 0 ? 'París FW ✨' : i % 3 === 1 ? 'Milán FW 📸' : 'Shoot en curso ⚡',
      fashionAgency
    };
  });

  const males = maleNames.slice(0, 45).map((name, i) => {
    const photoId = malePhotoIds[i % malePhotoIds.length];
    const likes = Math.max(1100, 14200 - i * 260 - Math.floor(Math.random() * 90));
    const followers = Math.floor(likes * 3.1 + Math.random() * 150);
    const sponsors = Math.floor(likes * 0.04 + 1);
    const username = name.toLowerCase().replace(/[^a-z]/g, '') + `_m${i + 1}`;
    
    const zoomUrl = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=400&h=540&sig=${i + 100}`;
    const feedPhotos = [
      zoomUrl,
      `https://images.unsplash.com/${malePhotoIds[(i + 1) % malePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${malePhotoIds[(i + 2) % malePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${malePhotoIds[(i + 3) % malePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${malePhotoIds[(i + 4) % malePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${malePhotoIds[(i + 5) % malePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${malePhotoIds[(i + 6) % malePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${malePhotoIds[(i + 7) % malePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${malePhotoIds[(i + 8) % malePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
      `https://images.unsplash.com/${malePhotoIds[(i + 9) % malePhotoIds.length]}?auto=format&fit=crop&q=85&w=650`,
    ];
    
    const maleAgencies = ['Ford Models', 'Elite Model Management', 'IMG Models', 'Next Management', 'Wilhelmina Models'];
    const fashionAgency = maleAgencies[i % maleAgencies.length];

    return {
      id: `topm-${i + 1}`,
      name,
      username,
      avatar: zoomUrl,
      bio: `Top ${i + 1} Modelo Masculino Global. Creador oficial registrado, enfocado en optimizar ganancias de patrocinios y reinversión.`,
      totalLikes: likes,
      followersCount: followers,
      photos: feedPhotos,
      referidosCount: sponsors,
      socials: {
        instagram: `@${username}`,
        twitter: `@${username}_real`,
        tiktok: `@${username}_tok`,
        instagramFollowers: Math.floor(followers * 0.58 + 450),
        tiktokFollowers: Math.floor(followers * 0.72 + 820)
      },
      gender: 'male' as const,
      isOnline: i % 4 === 0 || i === 2 || i === 15,
      statusText: i % 3 === 0 ? 'NY Fashion Week 🗽' : i % 3 === 1 ? 'Campaña Gucci 💼' : 'Colección Invierno ❄️',
      fashionAgency
    };
  });

  return { females, males };
}

export function generateInitialModels(): ModelProfile[] {
  const rankingData = generateTop100Ranking();
  const list: ModelProfile[] = [];
  
  // Combine all females and males into a single list of registered models
  rankingData.females.forEach(model => {
    list.push({ ...model });
  });
  
  rankingData.males.forEach(model => {
    list.push({ ...model });
  });
  
  // Sort by totalLikes descending to maintain consistent default sorting
  return list.sort((a, b) => (b.totalLikes || 0) - (a.totalLikes || 0));
}

export function seedInitialData() {
  const initialModels = generateInitialModels();
  
  // Choose model #1 as current default sponsor
  const defaultSponsor = initialModels[0];

  const defaultUser: UserSessionProfile = {
    id: 'user-investor',
    name: 'Ernesto vs',
    username: 'ernestovs',
    role: 'investor',
    patrocinadorId: defaultSponsor.id,
    balance: 1500.0, // Raised to 1,500€ to make testing 10€, 100€ and 1,000€ sessions possible!
    totalEarnings: 0,
    totalInvested: 0,
    totalCommissions: 0,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    direccion: 'Paseo de la Castellana 120, Madrid',
    telefono: '+34 600 123 456',
    email: 'ernesto.vs@investcollect.com',
    shareDireccion: true,
    shareTelefono: true,
    shareEmail: true,
    verified: true,
    bankInfoProvided: false,
    registeredAt: '2026-05-31'
  };

  // Seed standard projects
  const initialProjects: ProjectData[] = [
    {
      id: 'proj-1',
      userId: 'user-investor',
      title: 'Eco-Fashion Runway',
      category: 'Sostenibilidad o impacto ambiental',
      descriptionShort: 'Fusión de materiales orgánicos reciclados y alta costura en un desfile interactivo.',
      descriptionLong: 'Este proyecto busca revolucionar la semana de la moda mediante un desfile sostenible donde cada prenda está hecha 100% de materiales reciclados del océano, combinando tecnología de manufactura holística con estética minimalista de primer nivel.',
      budget: 1000,
      objective: 'Crear un impacto positivo en el medio ambiente a través de la alta costura sostenible.',
      fundUsage: '80% materiales y diseño de vestuario, 15% booking de local climatizado verde, 5% staff técnico.',
      timeline: 'Fase 1: Recolección y refinamiento de textiles. Fase 2: Confección de 12 looks. Fase 3: Pasarela en directo.',
      team: [
        { name: 'Ernesto vs', role: 'Diseñador Principal', experience: '5 años en textiles sustentables' },
        { name: 'Adriana Lima', role: 'Dirección de Arte', experience: 'Modelo internacional y curadora de modas' }
      ],
      termsAccepted: true,
      images: [
        'https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600'
      ],
      status: 'submitted'
    }
  ];

  // Seed initial investment sessions (Workers, Entrepreneurs, Business owners)
  // 1. Sesión de inversión de trabajadores - Monto 10€
  const session1: InvestmentSession = {
    id: 'sess-workers',
    title: 'Sesión de Inversión de Trabajadores',
    entryFee: 10,
    status: 'filling',
    timeLeft: 340, // 5 min 40 s left
    createdAt: '2026-05-31T14:40:00Z',
    poolTotal: 90, // 9 participants * 10€
    participants: [
      { userId: 'part-1', name: 'Adriana Lima', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', votesReceived: 4, hasVoted: false },
      { userId: 'part-2', name: 'Candice Swanepoel', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', votesReceived: 2, hasVoted: true, votedFor: 'part-1' },
      { userId: 'part-3', name: 'Marcus Sterling', avatar: FASHION_PHOTOS[3] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150', votesReceived: 2, hasVoted: true, votedFor: 'part-1' },
      { userId: 'part-4', name: 'Liam Alvarez', avatar: FASHION_PHOTOS[5] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150', votesReceived: 1, hasVoted: true, votedFor: 'part-1' },
      { userId: 'part-5', name: 'Jasmine Tookes', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: true, votedFor: 'part-1' },
      { userId: 'part-6', name: 'Oliver Finch', avatar: FASHION_PHOTOS[11] || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: true, votedFor: 'part-2' },
      { userId: 'part-7', name: 'Sara Sampaio', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', votesReceived: 1, hasVoted: true, votedFor: 'part-2' },
      { userId: 'part-8', name: 'Julian Brooks', avatar: FASHION_PHOTOS[9] || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: true, votedFor: 'part-3' },
      { userId: 'part-9', name: 'Miranda Kerr', avatar: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: true, votedFor: 'part-4' }
    ]
  };

  // 2. Sesión de inversión de emprendedores - Monto 100€
  const session2: InvestmentSession = {
    id: 'sess-entrepreneurs',
    title: 'Sesión de Inversión de Emprendedores',
    entryFee: 100,
    status: 'filling',
    timeLeft: 1200,
    createdAt: '2026-05-31T14:48:00Z',
    poolTotal: 600, // 6 participants * 100€
    participants: [
      { userId: 'part-11', name: 'Candice Swanepoel', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-12', name: 'Jasmine Tookes', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-13', name: 'Oliver Finch', avatar: FASHION_PHOTOS[11] || 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-14', name: 'Sara Sampaio', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-15', name: 'Dante Moretti', avatar: FASHION_PHOTOS[13] || 'https://images.unsplash.com/photo-1514315384763-ba401779410f?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-16', name: 'Kenji Sato', avatar: FASHION_PHOTOS[15] || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false }
    ]
  };

  // 3. Sesión de inversión de empresarios - Monto 1,000€
  const session3: InvestmentSession = {
    id: 'sess-businessmen',
    title: 'Sesión de Inversión de Empresarios',
    entryFee: 1000,
    status: 'filling',
    timeLeft: 1800,
    createdAt: '2026-05-31T14:52:00Z',
    poolTotal: 4000, // 4 participants * 1000€
    participants: [
      { userId: 'part-17', name: 'Marcus Sterling', avatar: FASHION_PHOTOS[3] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-18', name: 'Candice Swanepoel', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-19', name: 'Sara Sampaio', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-20', name: 'Julian Brooks', avatar: FASHION_PHOTOS[9] || 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false }
    ]
  };

  // 4. Sesión de inversión de top models - Monto 10,000€
  const session4: InvestmentSession = {
    id: 'sess-topmodels',
    title: 'Mesa de Top Models',
    entryFee: 10000,
    status: 'filling',
    timeLeft: 2400,
    createdAt: '2026-05-31T14:55:00Z',
    poolTotal: 70000, // 7 participants * 10000€
    participants: [
      { userId: 'part-21', name: 'Elsa Hosk', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-22', name: 'Adriana Lima', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-23', name: 'Lily Aldridge', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-24', name: 'Gisele Bündchen', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-25', name: 'Romee Strijd', avatar: 'https://images.unsplash.com/photo-1506919258185-6078bba55d2a?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-26', name: 'Gigi Hadid', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-27', name: 'Bella Hadid', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false }
    ]
  };

  // 5. Sesión de inversión de inversores - Monto 100,000€
  const session5: InvestmentSession = {
    id: 'sess-investors',
    title: 'Mesa de Inversores',
    entryFee: 100000,
    status: 'filling',
    timeLeft: 3600,
    createdAt: '2026-05-31T14:58:00Z',
    poolTotal: 700000, // 7 participants * 100000€
    participants: [
      { userId: 'part-21', name: 'Elsa Hosk', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-22', name: 'Adriana Lima', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-23', name: 'Lily Aldridge', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-24', name: 'Gisele Bündchen', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-25', name: 'Romee Strijd', avatar: 'https://images.unsplash.com/photo-1506919258185-6078bba55d2a?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-26', name: 'Candice Swanepoel', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-27', name: 'Bella Hadid', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false }
    ]
  };

  // 6. Sesión de inversión de millonarios - Monto 1,000,000€
  const session6: InvestmentSession = {
    id: 'sess-millionaires',
    title: 'Mesa de Millonarios',
    entryFee: 1000000,
    status: 'filling',
    timeLeft: 7200,
    createdAt: '2026-05-31T15:00:00Z',
    poolTotal: 3000000, // 3 participants * 1000000€
    participants: [
      { userId: 'part-41', name: 'Romee Strijd', avatar: 'https://images.unsplash.com/photo-1506919258185-6078bba55d2a?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-42', name: 'Gisele Bündchen', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false },
      { userId: 'part-43', name: 'Marcus Sterling', avatar: FASHION_PHOTOS[3] || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150', votesReceived: 0, hasVoted: false }
    ]
  };

  // Chats seed data
  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-1',
      senderId: 'topf-1',
      receiverId: 'user-investor',
      text: '¡Hola Ernesto! Qué gusto tenerte como patrocinador en mi red de Fashion Finances. He visto tu proyecto Eco-Fashion Runway, ¡tiene una pinta tremenda!',
      timestamp: '2026-05-31T12:30:00Z'
    },
    {
      id: 'msg-2',
      senderId: 'user-investor',
      receiverId: 'topf-1',
      text: '¡Hola Adriana! Muchas gracias. Sí, confío en que podamos ganar la sesión de Alpha hoy para potenciarlo. El 10% irá directo para ti.',
      timestamp: '2026-05-31T12:35:00Z'
    },
    {
      id: 'msg-3',
      senderId: 'topf-1',
      receiverId: 'user-investor',
      text: '¡Genial! Cuenta con todo mi apoyo para promocionarlo entre mis seguidores e inversores. ¡A por todas!',
      timestamp: '2026-05-31T12:38:00Z'
    }
  ];

  // Movements history
  const initialMovements: FinancialMovement[] = [
    {
      id: 'mov-1',
      userId: 'user-investor',
      type: 'deposit',
      amount: 1500.0,
      date: '2026-05-31T10:00:00Z',
      description: 'Depósito inicial mediante cuenta bancaria'
    },
    {
      id: 'mov-2',
      userId: 'user-investor',
      type: 'investment',
      amount: -10.0,
      date: '2026-05-31T14:40:00Z',
      description: 'Entrada reservada para Sesión de Inversión de Trabajadores',
      projectName: 'Eco-Fashion Runway'
    }
  ];

  return {
    models: initialModels,
    userProfile: defaultUser,
    projects: initialProjects,
    sessions: [session1, session2, session3, session4, session5, session6],
    messages: initialMessages,
    movements: initialMovements,
  };
}
