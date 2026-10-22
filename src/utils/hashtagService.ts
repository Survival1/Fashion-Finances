import { Hashtag, HashtagMetrics, HashtagTrend, UserHashtag, HashtagTrendPoint } from '../types/hashtag';

export const INITIAL_HASHTAGS: Record<string, Hashtag> = {
  fashion: {
    id: 'tag-fashion',
    tag: 'fashion',
    displayName: '#fashion',
    theme: 'Tendencias · Desfiles y Alta Costura Internacional',
    category: 'Moda & Pasarela',
    description: 'La etiqueta reina de la industria: tendencias globales, estilismo de alta gama, diseñadores de renombre y las producciones más exclusivas del mundo del modelaje.',
    region: 'Global',
    status: 'trending',
    createdAt: '2025-01-01',
    icon: '👗',
    bannerImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200'
  },
  runway: {
    id: 'tag-runway',
    tag: 'runway',
    displayName: '#Runway',
    theme: 'Pasarela · Moda · Modelos',
    category: 'Moda & Pasarela',
    description: 'El pulso de las mejores pasarelas internacionales de Milán, París y Nueva York. Desfiles estelares, técnica de pasarela y alta costura en movimiento.',
    region: 'Global',
    status: 'trending',
    createdAt: '2025-01-15',
    icon: '👠',
    bannerImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200'
  },
  finanzas: {
    id: 'tag-finanzas',
    tag: 'finanzas',
    displayName: '#finanzas',
    theme: 'Finanzas para Creadores · Inversión · ROI',
    category: 'Finanzas & Negocios',
    description: 'Estrategias de rentabilidad para modelos y creadores: cómo optimizar ganancias de patrocinio, distribuir beneficios en rondas colectivas y reinvertir el ROI con seguridad.',
    region: 'España',
    status: 'trending',
    createdAt: '2025-02-01',
    icon: '📈',
    bannerImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200'
  },
  highfashion: {
    id: 'tag-highfashion',
    tag: 'highfashion',
    displayName: '#highfashion',
    theme: 'Alta Costura · Vanguardia · Desfiles',
    category: 'Moda & Pasarela',
    description: 'Diseño vanguardista, piezas exclusivas confeccionadas a medida y estética futurista para los escenarios más prestigiosos del mundo.',
    region: 'Francia',
    status: 'trending',
    createdAt: '2025-01-10',
    icon: '✨',
    bannerImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200'
  },
  fashioninvest: {
    id: 'tag-fashioninvest',
    tag: 'fashioninvest',
    displayName: '#fashioninvest',
    theme: 'Inversión en Moda · Financiación Colectiva',
    category: 'Finanzas & Negocios',
    description: 'El punto de encuentro entre inversores ángeles y las supermodelos con mayor tracción. Participa en rondas de financiación colectiva y rentabiliza talentos en ascenso.',
    region: 'Global',
    status: 'trending',
    createdAt: '2025-02-12',
    icon: '💰',
    bannerImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1200'
  },
  modamexicana: {
    id: 'tag-modamexicana',
    tag: 'modamexicana',
    displayName: '#modamexicana',
    theme: 'Diseño Mexicano · Moda Internacional · Identidad',
    category: 'Cultura & Diseño',
    description: 'Textiles tradicionales fusionados con líneas contemporáneas de alta costura, proyectando el talento latinoamericano hacia los showrooms de Europa.',
    region: 'México',
    status: 'active',
    createdAt: '2025-03-05',
    icon: '🇲🇽',
    bannerImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200'
  },
  futuristic: {
    id: 'tag-futuristic',
    tag: 'futuristic',
    displayName: '#futuristic',
    theme: 'Estética Futurista · Cyberpunk · Neón',
    category: 'Vanguardia & Tendencias',
    description: 'Maquillaje glitter metálico, siluetas biomecánicas, luces de neón y moda espacial que desafía las convenciones textiles tradicionales.',
    region: 'Global',
    status: 'rising',
    createdAt: '2025-03-18',
    icon: '⚡',
    bannerImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200'
  },
  growth: {
    id: 'tag-growth',
    tag: 'growth',
    displayName: '#growth',
    theme: 'Escalabilidad · Audiencia · Monetización',
    category: 'Finanzas & Negocios',
    description: 'Tácticas de engagement, crecimiento orgánico de seguidores y maximización de conversiones publicitarias para portfolios digitales.',
    region: 'España',
    status: 'active',
    createdAt: '2025-02-20',
    icon: '🚀',
    bannerImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=85&w=1600'
  },
  atelier: {
    id: 'tag-atelier',
    tag: 'atelier',
    displayName: '#atelier',
    theme: 'Patronaje Artesanal · Confección Exclusiva',
    category: 'Moda & Pasarela',
    description: 'El arte detrás de las costuras: patronaje en vivo, selección de telas de seda italiana y creación de prendas exclusivas para desfiles VIP.',
    region: 'Italia',
    status: 'active',
    createdAt: '2025-01-28',
    icon: '✂️',
    bannerImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200'
  },
  confeccion: {
    id: 'tag-confeccion',
    tag: 'confeccion',
    displayName: '#confeccion',
    theme: 'Corte y Confección en Directo · Técnica Textil',
    category: 'Moda & Pasarela',
    description: 'Demostraciones técnicas de sastrería fina, confección a mano y bordados de pedrería fina para modelos de alta costura.',
    region: 'España',
    status: 'active',
    createdAt: '2025-02-14',
    icon: '🧵',
    bannerImage: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?auto=format&fit=crop&q=80&w=1200'
  },
  altacostura: {
    id: 'tag-altacostura',
    tag: 'altacostura',
    displayName: '#altacostura',
    theme: 'Haute Couture · Pasarelas de París · Lujo',
    category: 'Moda & Pasarela',
    description: 'La máxima expresión del lujo: vestidos confeccionados con cientos de horas de trabajo artesanal para las grandes casas de moda.',
    region: 'Francia',
    status: 'trending',
    createdAt: '2025-01-05',
    icon: '👑',
    bannerImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200'
  },
  streetstyle: {
    id: 'tag-streetstyle',
    tag: 'streetstyle',
    displayName: '#streetstyle',
    theme: 'Moda Urbana · Casual y Pasarela · Tendencias de Calle',
    category: 'Streetwear',
    description: 'Estilo cotidiano elevado a nivel editorial. Capturas en las calles de Madrid, Milán y Londres que marcan lo que se usará la próxima temporada.',
    region: 'España',
    status: 'trending',
    createdAt: '2025-02-18',
    icon: '🛹',
    bannerImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1200'
  },
  castinglive: {
    id: 'tag-castinglive',
    tag: 'castinglive',
    displayName: '#castinglive',
    theme: 'Audiciones en Vivo · Descubrimiento de Nuevos Talentos',
    category: 'Casting & Talento',
    description: 'Sesiones de casting interactivo donde la comunidad vota, patrocina e impulsa a las modelos hacia contratos de representación internacional.',
    region: 'Global',
    status: 'trending',
    createdAt: '2025-01-01',
    icon: '🎥',
    bannerImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200'
  },
  madridoutfit: {
    id: 'tag-madridoutfit',
    tag: 'madridoutfit',
    displayName: '#madridoutfit',
    theme: 'Tendencias Madrileñas · Gran Vía · Outfits Urbanos',
    category: 'Streetwear',
    description: 'El estilo madrileño capturado al atardecer en Gran Vía, Malasaña y Salamanca con combinaciones chic y cosmopolitas.',
    region: 'España',
    status: 'active',
    createdAt: '2025-03-01',
    icon: '🌆',
    bannerImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200'
  },
  luxury: {
    id: 'tag-luxury',
    tag: 'luxury',
    displayName: '#luxury',
    theme: 'Alta Joyería · Relojería Suiza y Gala',
    category: 'Joyería & Lujo',
    description: 'Cronómetros de alta precisión, diamantes certificados y piezas de colección para las veladas y galas más exclusivas.',
    region: 'Italia',
    status: 'trending',
    createdAt: '2025-01-20',
    icon: '💎',
    bannerImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200'
  }
};

export const normalizeTag = (rawTag: string): string => {
  if (!rawTag) return '';
  return rawTag.trim().toLowerCase().replace(/^#+/, '').replace(/[^a-z0-9_]/g, '');
};

export const getHashtag = (rawTag: string): Hashtag => {
  const norm = normalizeTag(rawTag);
  if (INITIAL_HASHTAGS[norm]) {
    return INITIAL_HASHTAGS[norm];
  }

  // Generación dinámica si no está en el catálogo base
  const cleanDisplay = `#${norm.charAt(0).toUpperCase() + norm.slice(1)}`;
  return {
    id: `tag-${norm}`,
    tag: norm,
    displayName: cleanDisplay,
    theme: 'Moda · Tendencias · Contenido Digital',
    category: norm.includes('finanz') || norm.includes('invest') ? 'Finanzas & Negocios' : 'Moda & Pasarela',
    description: `Descubre todo el contenido, vídeos virales y perfiles destacados que están utilizando la etiqueta ${cleanDisplay} en Fashion Finances.`,
    region: 'Global',
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0],
    icon: '🏷️',
    bannerImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200'
  };
};

export const getAllHashtags = (): Hashtag[] => {
  return Object.values(INITIAL_HASHTAGS);
};

// Algoritmo de recomendación y ranking ponderado
// Como pide el usuario: "el hashtag por sí solo no debería determinar qué vídeo se muestra primero.
// el tiempo de visualización y otros factores también influyen en sus recomendaciones."
export const scoreVideoRecommendation = (video: any, hashtag: string): number => {
  if (!video) return 0;
  const likes = Number(video.likes || 0);
  const shares = Number(video.shares || 0);
  const comments = Array.isArray(video.comments) ? video.comments.length : 0;
  
  // Estimación de tiempo de visualización y completion rate
  const watchTimeSeconds = video.watchTimeSeconds || Math.max(15, Math.min(60, Math.floor(likes * 0.4)));
  const completionRate = video.completionRate || Math.min(0.95, 0.45 + (likes % 50) / 100);

  // Bonificación por coincidencia exacta en descripción
  const desc = (video.description || '').toLowerCase();
  const norm = normalizeTag(hashtag);
  const tagBonus = desc.includes(`#${norm}`) ? 40 : 15;

  // Recency bonus: vídeos más nuevos tienen impulso
  const idStr = String(video.id || '');
  const isRecentUpload = idStr.includes('uploaded-') ? 35 : 10;

  // Fórmula ponderada
  const recommendationScore = 
    (likes * 1.5) +
    (shares * 3.0) +
    (comments * 2.0) +
    (watchTimeSeconds * 0.8) +
    (completionRate * 50) +
    tagBonus +
    isRecentUpload;

  return Math.round(recommendationScore);
};

// Colección rica de vídeos y creadores localizados por mercado internacional
const REGIONAL_MARKET_DATA: Record<string, {
  cities: string[];
  flag: string;
  models: { username: string; name: string; avatar: string; category: string }[];
  templates: { desc: (tag: string, city: string) => string; music: (city: string) => string; videoUrl: string; likes: number; shares: number }[];
}> = {
  españa: {
    cities: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Ibiza'],
    flag: '🇪🇸',
    models: [
      { username: 'clara_vega', name: 'Clara Vega', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', category: 'Pasarela' },
      { username: 'mateo_glow', name: 'Mateo Glow', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', category: 'Backstage' },
      { username: 'sofia_sensations', name: 'Sofía Sensations', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', category: 'Fashion' },
      { username: 'carlos_fit_coach', name: 'Carlos Fit', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', category: 'Finanzas' }
    ],
    templates: [
      {
        desc: (t, c) => `Estrategias de #${t} en Pasarela ${c} y Gran Vía: Acuerdos de patrocinio y monetización con firmas ibéricas 🇪🇸 #${t} #${c.toLowerCase()} #fashionfinances`,
        music: (c) => `Madrid Sunset Vibes - Beats de Pasarela`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4',
        likes: 3120,
        shares: 94
      },
      {
        desc: (t, c) => `Detrás de escena en el camerino de Pasarela ${c}. Últimos retoques de peinado y purpurina antes de salir a desfilar 🎬🇪🇸 #${t} #backstage #${c.toLowerCase()}`,
        music: (c) => `Spanish Catwalk Beats - Fashion DJ ${c}`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-40018-large.mp4',
        likes: 2430,
        shares: 63
      },
      {
        desc: (t, c) => `Sesión de alta costura futurista en ${c} Fashion Week. Presentando nueva colección con glitter ✨🇪🇸 #${t} #${c.toLowerCase()}`,
        music: (c) => `Electronic Flamenco Chillout - Lounge ${c}`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-posing-with-a-red-light-40486-large.mp4',
        likes: 1240,
        shares: 48
      },
      {
        desc: (t, c) => `CapCut - Edición viral para creadores en ${c} bajo las luces nocturnas 🎬⚡ #${t} #madridoutfit`,
        music: (c) => `Retro Neon Beats - Studio ${c}`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-rainy-night-40539-large.mp4',
        likes: 1890,
        shares: 52
      }
    ]
  },
  méxico: {
    cities: ['Ciudad de México', 'Guadalajara', 'Monterrey', 'Cancún', 'Puebla'],
    flag: '🇲🇽',
    models: [
      { username: 'ximena_navarrete', name: 'Ximena Navarrete', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', category: 'Moda' },
      { username: 'valentina_skin', name: 'Valentina Skin', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200', category: 'Casting' },
      { username: 'diego_couture', name: 'Diego Couture', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200', category: 'Finanzas' },
      { username: 'lucia_textiles', name: 'Lucía Textiles', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', category: 'Pasarela' }
    ],
    templates: [
      {
        desc: (t, c) => `Sesión estelar en Mercedes-Benz Fashion Week ${c}: Crecimiento de audiencia e identidad textil mexicana 🇲🇽✨ #${t} #modamexicana`,
        music: (c) => `Cumbia Electrónica - Pasarela Polanco`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-a-red-light-40158-large.mp4',
        likes: 4250,
        shares: 138
      },
      {
        desc: (t, c) => `Backstage en Polanco y desfiles en ${c}: Proyección internacional y contratos para modelos latinas 🇲🇽👠 #${t} #mexico`,
        music: (c) => `Ritmo Urbano CDMX - Sonido Original`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4',
        likes: 3100,
        shares: 89
      },
      {
        desc: (t, c) => `Finanzas y monetización para creadores en ${c}: Cómo optimizar patrocinios y reinvertir el ROI 🇲🇽📈 #${t} #finanzas`,
        music: (c) => `Mariachi Deep House Mix - Monterrey Studio`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-in-a-studio-with-flashing-lights-40485-large.mp4',
        likes: 2780,
        shares: 72
      },
      {
        desc: (t, c) => `Tendencias urbanas y streetstyle en Reforma y Condesa (${c}). Golden hour y siluetas contemporáneas 🇲🇽📸 #${t}`,
        music: (c) => `Guadalajara Nights - Latin Beat`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-40018-large.mp4',
        likes: 1950,
        shares: 45
      }
    ]
  },
  francia: {
    cities: ['París', 'Cannes', 'Niza', 'Lyon', 'Burdeos'],
    flag: '🇫🇷',
    models: [
      { username: 'camille_paris', name: 'Camille Laurent', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', category: 'Haute Couture' },
      { username: 'lucas_perfum', name: 'Lucas Perfum', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', category: 'Lujo' },
      { username: 'chloe_glam', name: 'Chloé Glam', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', category: 'Fashion' },
      { username: 'julie_couture', name: 'Julie Couture', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', category: 'Pasarela' }
    ],
    templates: [
      {
        desc: (t, c) => `Paris Fashion Week Haute Couture en ${c}: Posicionamiento editorial y viralidad en pasarelas de élite 🇫🇷✨ #${t} #parisfashion`,
        music: (c) => `Champs-Élysées Runway Vibes - Paris DJ`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4',
        likes: 5820,
        shares: 210
      },
      {
        desc: (t, c) => `Backstage en los salones de alta costura de Place Vendôme (${c}). Siluetas exclusivas confeccionadas a mano 🇫🇷👑 #${t} #altacostura`,
        music: (c) => `French Accordion Lo-Fi - Studio Paris`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-posing-with-a-red-light-40486-large.mp4',
        likes: 4310,
        shares: 140
      },
      {
        desc: (t, c) => `Sesión editorial en Pont Alexandre III (${c}): Tácticas de contenido de moda y alianzas con casas de lujo 🇫🇷📸 #${t}`,
        music: (c) => `French House Club Mix - Cannes VIP`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-rainy-night-40539-large.mp4',
        likes: 3190,
        shares: 88
      },
      {
        desc: (t, c) => `Financiación de colecciones y rondas colectivas de inversión para modelos en ${c} 🇫🇷📈 #${t} #fashioninvest`,
        music: (c) => `Parisian Chic Minimalist Beats`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-40018-large.mp4',
        likes: 2650,
        shares: 76
      }
    ]
  },
  italia: {
    cities: ['Milano', 'Roma', 'Florencia', 'Venecia', 'Nápoles'],
    flag: '🇮🇹',
    models: [
      { username: 'bruno_rossi_milan', name: 'Bruno Rossi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', category: 'Milano Fashion' },
      { username: 'isabella_creative', name: 'Isabella Fontana', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', category: 'Atelier' },
      { username: 'chiara_venezia', name: 'Chiara Venezia', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200', category: 'Joyería' },
      { username: 'alessio_luxe', name: 'Alessio Luxe', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', category: 'Pasarela' }
    ],
    templates: [
      {
        desc: (t, c) => `Milano Fashion Week (${c}): Estrategias de #${t} en Via Montenapoleone y desfiles en el Duomo 🇮🇹✨ #${t} #milanofashion`,
        music: (c) => `Italian Disco Runway - Milano DJ`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4',
        likes: 4940,
        shares: 165
      },
      {
        desc: (t, c) => `Atelier de patronaje y sastrería en ${c}: Confección en seda pura y alcance digital internacional 🇮🇹✂️ #${t} #atelier`,
        music: (c) => `Tuscan Sunlight Lounge - Florence Beat`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-a-red-light-40158-large.mp4',
        likes: 3820,
        shares: 112
      },
      {
        desc: (t, c) => `Gala de alta joyería en ${c}: Modelos de pasarela exhibiendo piezas de diamantes y oro 🇮🇹💎 #${t} #luxury`,
        music: (c) => `Venice Red Carpet Symphony`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-posing-with-a-red-light-40486-large.mp4',
        likes: 2980,
        shares: 85
      },
      {
        desc: (t, c) => `Sesión fotográfica en las plazas de ${c}: Estilo contemporáneo y engagement publicitario 🇮🇹📸 #${t}`,
        music: (c) => `Milano Street Beats - Haute Couture`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-40018-large.mp4',
        likes: 2410,
        shares: 64
      }
    ]
  },
  "estados unidos": {
    cities: ['New York', 'Los Angeles', 'Miami', 'Chicago', 'Las Vegas'],
    flag: '🇺🇸',
    models: [
      { username: 'kendall_jenner_vip', name: 'Kendall Jenner', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', category: 'Supermodel' },
      { username: 'bella_hadid_runway', name: 'Bella Hadid', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', category: 'Runway' },
      { username: 'alex_wright_ceo', name: 'Alexander Wright', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', category: 'Finanzas' },
      { username: 'zoe_vlogs_reels', name: 'Zoe Vlogs', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', category: 'Influencer' }
    ],
    templates: [
      {
        desc: (t, c) => `New York Fashion Week (${c}): Scale & #${t} for fashion creators in Manhattan 🇺🇸🗽 #${t} #nyfw #fashiongrowth`,
        music: (c) => `NYC Runway House Beats - Soho DJ`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4',
        likes: 6410,
        shares: 240
      },
      {
        desc: (t, c) => `Miami Catwalk & Ocean Drive in ${c}: High-performing digital portfolios and commercial contracts 🇺🇸🌴 #${t}`,
        music: (c) => `Miami Vice Beats - Club Remix`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-posing-with-a-red-light-40486-large.mp4',
        likes: 4780,
        shares: 175
      },
      {
        desc: (t, c) => `Hollywood fashion studio in ${c}: Top sponsorships and investor network partnerships 🇺🇸✨ #${t} #fashioninvest`,
        music: (c) => `Los Angeles Sunset Synthwave`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-rainy-night-40539-large.mp4',
        likes: 3950,
        shares: 130
      },
      {
        desc: (t, c) => `Editorial streetstyle in Brooklyn (${c}): Neon night aesthetics and viral content 🇺🇸📸 #${t}`,
        music: (c) => `Brooklyn Urban Groove - Streetwear DJ`,
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-40018-large.mp4',
        likes: 3120,
        shares: 95
      }
    ]
  }
};

const getDynamicRegionalVideos = (rawTag: string, countryName: string): any[] => {
  const norm = normalizeTag(rawTag);
  const matchedCountry = AVAILABLE_MARKET_COUNTRIES.find(
    c => c.name.toLowerCase() === countryName.toLowerCase() || c.code.toLowerCase() === countryName.toLowerCase()
  ) || { name: countryName, flag: '🌐', code: 'INT', region: 'Global' };

  const flag = matchedCountry.flag;
  const cName = matchedCountry.name;

  return [
    {
      id: `vid-${cName.toLowerCase()}-1`,
      username: `model_${cName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      name: `Top Model ${cName}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4',
      likes: 3840,
      shares: 110,
      comments: [],
      favorites: 420,
      description: `Pasarela y tendencias de #${norm} en ${cName}: Gran alcance de audiencia e impacto comercial ${flag} #${norm} #${cName.toLowerCase().replace(/\s+/g, '')}`,
      music: `Fashion Beats International - ${cName} Edit`,
      category: 'Fashion',
      videoCategory: 'Fashion',
      region: cName,
      locationName: `${cName} ${flag}`,
      countryFlag: flag
    },
    {
      id: `vid-${cName.toLowerCase()}-2`,
      username: `couture_${cName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      name: `Couture ${cName}`,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-posing-with-a-red-light-40486-large.mp4',
      likes: 2910,
      shares: 84,
      comments: [],
      favorites: 310,
      description: `Sesión de alta moda y #${norm} en el circuito de ${cName}: Siluetas contemporáneas y brillo ${flag} #${norm}`,
      music: `Catwalk Soundscapes - ${cName}`,
      category: 'Backstage',
      videoCategory: 'Backstage',
      region: cName,
      locationName: `${cName} ${flag}`,
      countryFlag: flag
    },
    {
      id: `vid-${cName.toLowerCase()}-3`,
      username: `creator_${cName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      name: `Creadora ${cName}`,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-rainy-night-40539-large.mp4',
      likes: 2150,
      shares: 62,
      comments: [],
      favorites: 240,
      description: `Estrategias de contenido y monetización para marcas bajo #${norm} en ${cName} ${flag} #${norm} #finanzas`,
      music: `Deep House Studio - ${cName}`,
      category: 'Finanzas',
      videoCategory: 'Finanzas',
      region: cName,
      locationName: `${cName} ${flag}`,
      countryFlag: flag
    },
    {
      id: `vid-${cName.toLowerCase()}-4`,
      username: `street_${cName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      name: `Streetwear ${cName}`,
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-40018-large.mp4',
      likes: 1840,
      shares: 49,
      comments: [],
      favorites: 190,
      description: `Editorial urbano y tendencias en calles de ${cName}: Golden hour y estilo chic ${flag} #${norm}`,
      music: `Urban Beats - ${cName} DJ`,
      category: 'Streetwear',
      videoCategory: 'Streetwear',
      region: cName,
      locationName: `${cName} ${flag}`,
      countryFlag: flag
    }
  ];
};

export const getHashtagVideos = (rawTag: string, allVideos: any[], regionFilter?: string): any[] => {
  const norm = normalizeTag(rawTag);
  if (!norm) return [];

  // 1. Si hay un filtro regional específico (no 'Todas' ni 'Global')
  if (regionFilter && regionFilter !== 'Todas' && regionFilter !== 'Global') {
    const regKey = regionFilter.toLowerCase().trim();
    const regionalPreset = REGIONAL_MARKET_DATA[regKey];

    if (regionalPreset) {
      const regionVideos = regionalPreset.templates.map((tpl, idx) => {
        const model = regionalPreset.models[idx % regionalPreset.models.length];
        const city = regionalPreset.cities[idx % regionalPreset.cities.length];
        return {
          id: `vid-${regKey}-${norm}-${idx}`,
          username: model.username,
          name: model.name,
          avatar: model.avatar,
          videoUrl: tpl.videoUrl,
          likes: tpl.likes,
          shares: tpl.shares,
          comments: [],
          favorites: Math.floor(tpl.likes * 0.15),
          description: tpl.desc(norm, city),
          music: tpl.music(city),
          category: model.category,
          videoCategory: model.category,
          region: regionFilter,
          locationName: `${city}, ${regionFilter}`,
          countryFlag: regionalPreset.flag,
          watchTimeSeconds: 42,
          completionRate: 0.88
        };
      });

      // Incluir también cualquier vídeo del usuario que coincida con esta región
      const uploadedInRegion = Array.isArray(allVideos) ? allVideos.filter(v => {
        if (!v) return false;
        const desc = (v.description || '').toLowerCase();
        const loc = (v.region || v.location || '').toLowerCase();
        return loc.includes(regKey) || desc.includes(regKey);
      }) : [];

      return [...uploadedInRegion, ...regionVideos];
    } else {
      // Generador dinámico para cualquier otro país (Colombia, Reino Unido, Alemania, etc.)
      const dynamicList = getDynamicRegionalVideos(norm, regionFilter);
      return dynamicList;
    }
  }

  // 2. Si es 'Todas' o 'Global': Mezcla completa global
  if (!Array.isArray(allVideos)) return [];

  const matchingVideos = allVideos.filter(v => {
    if (!v) return false;
    const desc = (v.description || '').toLowerCase();
    const cat = (v.videoCategory || v.category || '').toLowerCase();

    const hasTagInDesc = desc.includes(`#${norm}`) || desc.includes(norm);
    const hasCategoryMatch = (norm === 'runway' && (cat.includes('modelos') || cat.includes('runway'))) ||
      (norm === 'finanzas' && cat.includes('finanz')) ||
      (norm === 'luxury' && (cat.includes('jewel') || cat.includes('luxur'))) ||
      (norm === 'streetstyle' && cat.includes('street')) ||
      (norm === 'atelier' && (cat.includes('atelier') || desc.includes('taller')));

    return hasTagInDesc || hasCategoryMatch;
  });

  let enrichedList = [...matchingVideos];
  if (enrichedList.length < 4 && allVideos.length > 0) {
    const remaining = allVideos.filter(v => !enrichedList.some(e => e.id === v.id));
    enrichedList.push(...remaining.slice(0, 4 - enrichedList.length));
  }

  // Marcar cada vídeo global con bandera/región si le falta
  const formattedGlobal = enrichedList.map((v, i) => {
    const defaultRegions = ['España', 'Francia', 'México', 'Italia', 'Estados Unidos'];
    const assignedRegion = v.region || defaultRegions[i % defaultRegions.length];
    return {
      ...v,
      region: assignedRegion,
      countryFlag: v.countryFlag || getCountryFlag(assignedRegion),
      locationName: v.locationName || `${assignedRegion}`
    };
  });

  return formattedGlobal.sort((a, b) => scoreVideoRecommendation(b, norm) - scoreVideoRecommendation(a, norm));
};

export const getHashtagMetrics = (rawTag: string, videos: any[]): HashtagMetrics => {
  const norm = normalizeTag(rawTag);
  const relatedVideos = getHashtagVideos(norm, videos);

  let totalLikes = 0;
  let totalShares = 0;
  let totalComments = 0;
  let estimatedViews = 0;

  relatedVideos.forEach(v => {
    const l = Number(v.likes || 120);
    const s = Number(v.shares || 15);
    const c = Array.isArray(v.comments) ? v.comments.length : 10;
    totalLikes += l;
    totalShares += s;
    totalComments += c;
    estimatedViews += l * Math.floor(Math.random() * 8 + 12);
  });

  // Factores base mínimos realistas por temática
  const baseMultipliers: Record<string, { posts: number; views: number }> = {
    fashion: { posts: 7420, views: 2890000 },
    runway: { posts: 4820, views: 1840000 },
    finanzas: { posts: 3290, views: 1250000 },
    highfashion: { posts: 2750, views: 980000 },
    fashioninvest: { posts: 1940, views: 820000 },
    modamexicana: { posts: 1420, views: 650000 },
    futuristic: { posts: 1890, views: 790000 },
    growth: { posts: 1150, views: 490000 },
    atelier: { posts: 1680, views: 720000 },
    altacostura: { posts: 3100, views: 1490000 },
    streetstyle: { posts: 4200, views: 1670000 },
    castinglive: { posts: 5600, views: 2400000 },
    luxury: { posts: 2450, views: 1180000 }
  };

  const base = baseMultipliers[norm] || { posts: 890, views: 320000 };
  const calculatedPosts = base.posts + relatedVideos.length * 12;
  const calculatedViews = base.views + estimatedViews;
  const calculatedLikes = totalLikes + Math.floor(calculatedViews * 0.08);
  const calculatedShares = totalShares + Math.floor(calculatedViews * 0.015);
  const calculatedComments = totalComments + Math.floor(calculatedViews * 0.02);

  const engagement = Number(((calculatedLikes + calculatedShares + calculatedComments) / (calculatedViews || 1) * 100).toFixed(1));

  return {
    hashtagId: `tag-${norm}`,
    tag: norm,
    totalPosts: calculatedPosts,
    totalViews: calculatedViews,
    totalLikes: calculatedLikes,
    totalShares: calculatedShares,
    totalComments: calculatedComments,
    engagementRate: Math.max(4.2, Math.min(18.5, engagement)),
    averageWatchTimeSec: Math.floor(Math.random() * 8) + 26,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};

export const getHashtagTrend = (rawTag: string, period: '7d' | '30d' | '90d' = '7d'): HashtagTrend => {
  const norm = normalizeTag(rawTag);
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;

  const history: HashtagTrendPoint[] = [];
  const now = new Date();

  // Generar curva temporal realista
  let currentViews = period === '7d' ? 45000 : period === '30d' ? 22000 : 12000;
  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    const factor = 1 + (Math.sin(i * 0.8) * 0.15) + ((days - i) / days) * 0.35;
    const views = Math.round(currentViews * factor + Math.random() * 2500);
    const posts = Math.round((views / 450) + Math.random() * 15);
    const score = Math.min(100, Math.max(30, Math.round((views / 80000) * 100)));
    history.push({ date: dateStr, views, posts, score });
  }

  const growthValues: Record<string, number> = {
    runway: 38.4,
    finanzas: 45.2,
    highfashion: 28.7,
    fashioninvest: 52.1,
    modamexicana: 19.8,
    futuristic: 41.5,
    growth: 33.2,
    altacostura: 29.4,
    streetstyle: 36.1,
    castinglive: 64.8,
    luxury: 24.3
  };

  const growth = growthValues[norm] || 22.5;

  return {
    hashtagId: `tag-${norm}`,
    tag: norm,
    period,
    trendScore: Math.min(99, Math.round(75 + (growth * 0.4))),
    growthPercentage: growth,
    rank: norm === 'castinglive' ? 1 : norm === 'runway' ? 2 : norm === 'finanzas' ? 3 : 5,
    history,
    regionalDistribution: {
      'España': 38,
      'México': 26,
      'Italia': 18,
      'Francia': 10,
      'Otros': 8
    }
  };
};

export const getRelatedCreators = (rawTag: string, videos: any[], models: any[]): any[] => {
  const norm = normalizeTag(rawTag);
  const relatedVideos = getHashtagVideos(norm, videos);

  const creatorsMap = new Map<string, any>();

  // Creadores directos que tienen vídeos con este hashtag
  relatedVideos.forEach(v => {
    const username = v.username || 'adrianalima';
    const foundModel = models.find(m => m.username?.toLowerCase() === username.toLowerCase() || m.id === v.modelId);
    if (foundModel && !creatorsMap.has(foundModel.id)) {
      creatorsMap.set(foundModel.id, {
        ...foundModel,
        recentVideoTitle: v.title || v.description,
        recentVideoUrl: v.videoUrl,
        postCountWithTag: Math.floor(Math.random() * 5 + 3)
      });
    }
  });

  // Completar con modelos destacados si hay menos de 5
  if (creatorsMap.size < 5 && Array.isArray(models)) {
    models.slice(0, 8).forEach(m => {
      if (!creatorsMap.has(m.id) && creatorsMap.size < 6) {
        creatorsMap.set(m.id, {
          ...m,
          recentVideoTitle: `Colección en tendencia #${norm}`,
          recentVideoUrl: m.videoUrl,
          postCountWithTag: Math.floor(Math.random() * 4 + 1)
        });
      }
    });
  }

  return Array.from(creatorsMap.values());
};

export const getRelatedProjects = (rawTag: string, projects: any[]): any[] => {
  const norm = normalizeTag(rawTag);
  if (!Array.isArray(projects)) return [];

  // Filtrar proyectos relacionados por tema o descripción
  return projects.filter(p => {
    if (!p) return false;
    const t = (p.title || '').toLowerCase();
    const d = (p.description || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    return t.includes(norm) || d.includes(norm) || cat.includes(norm) ||
      (norm === 'finanzas' && (t.includes('financ') || t.includes('inver') || cat.includes('financ'))) ||
      (norm === 'runway' && (t.includes('pasarela') || t.includes('desfile') || cat.includes('moda')));
  }).slice(0, 4);
};

// Seguimiento del hashtag (UserHashtag)
export const isUserFollowingHashtag = (userId: string, rawTag: string): boolean => {
  const norm = normalizeTag(rawTag);
  try {
    const raw = localStorage.getItem(`user_hashtags_${userId}`);
    if (!raw) return false;
    const arr: UserHashtag[] = JSON.parse(raw);
    return Array.isArray(arr) && arr.some(item => item.tag === norm);
  } catch (e) {
    return false;
  }
};

export const toggleFollowHashtag = (userId: string, rawTag: string): boolean => {
  const norm = normalizeTag(rawTag);
  try {
    const key = `user_hashtags_${userId}`;
    const raw = localStorage.getItem(key);
    let arr: UserHashtag[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) arr = [];

    const exists = arr.some(item => item.tag === norm);
    let next: UserHashtag[];
    let isNowFollowing = false;

    if (exists) {
      next = arr.filter(item => item.tag !== norm);
      isNowFollowing = false;
    } else {
      next = [...arr, {
        userId,
        hashtagId: `tag-${norm}`,
        tag: norm,
        followedAt: new Date().toISOString(),
        interestScore: 100
      }];
      isNowFollowing = true;
    }

    localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('user_hashtags_updated', { detail: { tag: norm, isFollowing: isNowFollowing } }));
    return isNowFollowing;
  } catch (e) {
    console.error('Error toggling hashtag follow', e);
    return false;
  }
};

export interface MarketCountry {
  name: string;
  flag: string;
  code: string;
  region: string;
}

export const AVAILABLE_MARKET_COUNTRIES: MarketCountry[] = [
  { name: 'España', flag: '🇪🇸', code: 'ES', region: 'Europa' },
  { name: 'México', flag: '🇲🇽', code: 'MX', region: 'Latinoamérica' },
  { name: 'Francia', flag: '🇫🇷', code: 'FR', region: 'Europa' },
  { name: 'Italia', flag: '🇮🇹', code: 'IT', region: 'Europa' },
  { name: 'Estados Unidos', flag: '🇺🇸', code: 'US', region: 'Norteamérica' },
  { name: 'Reino Unido', flag: '🇬🇧', code: 'GB', region: 'Europa' },
  { name: 'Alemania', flag: '🇩🇪', code: 'DE', region: 'Europa' },
  { name: 'Colombia', flag: '🇨🇴', code: 'CO', region: 'Latinoamérica' },
  { name: 'Argentina', flag: '🇦🇷', code: 'AR', region: 'Latinoamérica' },
  { name: 'Brasil', flag: '🇧🇷', code: 'BR', region: 'Latinoamérica' },
  { name: 'Japón', flag: '🇯🇵', code: 'JP', region: 'Asia' },
  { name: 'Portugal', flag: '🇵🇹', code: 'PT', region: 'Europa' },
  { name: 'Chile', flag: '🇨🇱', code: 'CL', region: 'Latinoamérica' },
  { name: 'Perú', flag: '🇵🇪', code: 'PE', region: 'Latinoamérica' },
  { name: 'Suiza', flag: '🇨🇭', code: 'CH', region: 'Europa' },
  { name: 'Canadá', flag: '🇨🇦', code: 'CA', region: 'Norteamérica' },
  { name: 'Países Bajos', flag: '🇳🇱', code: 'NL', region: 'Europa' },
  { name: 'Australia', flag: '🇦🇺', code: 'AU', region: 'Oceanía' },
  { name: 'República Dominicana', flag: '🇩🇴', code: 'DO', region: 'Caribe' },
  { name: 'Corea del Sur', flag: '🇰🇷', code: 'KR', region: 'Asia' },
  { name: 'Emiratos Árabes', flag: '🇦🇪', code: 'AE', region: 'Medio Oriente' },
  { name: 'Suecia', flag: '🇸🇪', code: 'SE', region: 'Europa' },
  { name: 'Bélgica', flag: '🇧🇪', code: 'BE', region: 'Europa' },
  { name: 'Turquía', flag: '🇹🇷', code: 'TR', region: 'Europa/Asia' },
  { name: 'Venezuela', flag: '🇻🇪', code: 'VE', region: 'Latinoamérica' },
  { name: 'Uruguay', flag: '🇺🇾', code: 'UY', region: 'Latinoamérica' },
  { name: 'Ecuador', flag: '🇪🇨', code: 'EC', region: 'Latinoamérica' },
  { name: 'Panamá', flag: '🇵🇦', code: 'PA', region: 'Centroamérica' },
  { name: 'Costa Rica', flag: '🇨🇷', code: 'CR', region: 'Centroamérica' },
  { name: 'Marruecos', flag: '🇲🇦', code: 'MA', region: 'África' },
  { name: 'Sudáfrica', flag: '🇿🇦', code: 'ZA', region: 'África' }
];

export const getCountryFlag = (countryName: string): string => {
  const match = AVAILABLE_MARKET_COUNTRIES.find(
    c => c.name.toLowerCase() === countryName.toLowerCase() || c.code.toLowerCase() === countryName.toLowerCase()
  );
  if (match) return match.flag;
  if (countryName.toLowerCase() === 'global' || countryName.toLowerCase() === 'todas') return '🌍';
  return '🌐';
};
