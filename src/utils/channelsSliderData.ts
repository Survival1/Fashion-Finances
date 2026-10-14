export interface ChannelCategory {
  id: string;
  label: string;
  image: string;
  count: string;
  description?: string;
}

export interface LiveStreamChannel {
  id: string;
  modelId: string;
  name: string;
  username: string;
  avatar: string;
  title: string;
  category: string;
  categoryLabel: string;
  viewers: number;
  likes: number;
  videoUrl: string;
  tags: string[];
  isVerified: boolean;
}

export const CHANNELS_SLIDER_CATEGORIES: ChannelCategory[] = [
  {
    id: 'todos',
    label: 'Todos en Directo',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=400',
    count: '16 Canales',
    description: 'Ver todas las emisiones de moda y casting en vivo'
  },
  {
    id: 'atelier',
    label: 'Atelier',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=400',
    count: '',
    description: 'Taller de corte, patronaje artesanal y confección exclusiva'
  },
  {
    id: 'haute_couture',
    label: 'Haute Couture',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=400',
    count: '4 en Vivo',
    description: 'Alta costura internacional y creaciones vanguardistas'
  },
  {
    id: 'streetwear',
    label: 'Streetwear & Urban',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=400',
    count: '2 en Vivo',
    description: 'Sneakers, denim premium y cultura urbana de pasarela'
  },
  {
    id: 'fashion_model',
    label: 'Fashion Model',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    count: '5 en Vivo',
    description: 'Modelos de alta moda, editoriales de revista y sesiones de fotos'
  },
  {
    id: 'runway_model',
    label: 'Runway Model',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=400',
    count: '4 en Vivo',
    description: 'Desfiles en pasarela, catwalk en directo y semanas de la moda'
  },
  {
    id: 'catalog_model',
    label: 'Catalog Model',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=400',
    count: '2 en Vivo',
    description: 'Lookbooks, catálogos comerciales y colecciones de temporada'
  },
  {
    id: 'commercial_model',
    label: 'Commercial Model',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
    count: '3 en Vivo',
    description: 'Publicidad global, spots de televisión y marcas internacionales'
  },
  {
    id: 'plus_size_model',
    label: 'Plus-size Model',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    count: '2 en Vivo',
    description: 'Modelaje curvy, empoderamiento y pasarelas inclusivas'
  },
  {
    id: 'petite_model',
    label: 'Petite Model',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    count: '2 en Vivo',
    description: 'Siluetas petite, moda especializada y sesiones vanguardistas'
  },
  {
    id: 'lingerie_model',
    label: 'Lingerie Model',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400',
    count: '3 en Vivo',
    description: 'Lencería de lujo, seda y sesiones de estética cuidada'
  },
  {
    id: 'swimsuit_model',
    label: 'Swimsuit Model',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400',
    count: '3 en Vivo',
    description: 'Moda de baño, desfiles resort y sesiones en locaciones icónicas'
  },
  {
    id: 'fitness_model',
    label: 'Fitness Model',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=400',
    count: '2 en Vivo',
    description: 'Fitness, preparación física y entrenamiento de alto rendimiento'
  },
  {
    id: 'parts_model',
    label: 'Parts Model',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400',
    count: '2 en Vivo',
    description: 'Alta joyería, relojería de precisión y primeros planos de belleza'
  },
  {
    id: 'mature_model',
    label: 'Mature Model',
    image: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=400',
    count: '2 en Vivo',
    description: 'Elegancia atemporal, experiencia en pasarela y estilo consolidado'
  },
  {
    id: 'real_people_models',
    label: 'Real People Models',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
    count: '3 en Vivo',
    description: 'Casting de personas reales, autenticidad y diversidad global'
  }
];

export const LIVE_STREAM_CHANNELS_DATA: LiveStreamChannel[] = [
  // 1. Haute Couture
  {
    id: 'live-adriana',
    modelId: 'topf-1',
    name: 'Adriana Lima',
    username: 'adrianalima',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    title: "🌟 Pasarela Internacional Victoria's Secret & Alta Costura 2026",
    category: 'haute_couture',
    categoryLabel: 'Haute Couture',
    viewers: 3420,
    likes: 28400,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4',
    tags: ['#HauteCouture', '#VictoriaSecret', '#AltaCostura'],
    isVerified: true
  },
  // 2. Runway Model
  {
    id: 'live-candice-runway',
    modelId: 'topf-3',
    name: 'Candice Swanepoel',
    username: 'candiceswanepoel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    title: '✨ Desfile Catwalk Oficial en París Fashion Week LIVE',
    category: 'runway_model',
    categoryLabel: 'Runway Model',
    viewers: 3120,
    likes: 24500,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-in-a-studio-with-flashing-lights-40485-large.mp4',
    tags: ['#RunwayModel', '#Catwalk', '#PFW2026'],
    isVerified: true
  },
  // 3. Atelier
  {
    id: 'live-isabella-atelier',
    modelId: 'topf-6',
    name: 'Isabella Dubois',
    username: 'isabelladubois',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=200',
    title: '✂️ Taller de Patronaje, Corte y Confección Artesanal en Vivo',
    category: 'atelier',
    categoryLabel: 'Atelier',
    viewers: 1890,
    likes: 14200,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-talking-in-a-studio-interview-41720-large.mp4',
    tags: ['#Atelier', '#Confección', '#Artesanal'],
    isVerified: true
  },
  {
    id: 'live-elena-atelier',
    modelId: 'topf-11',
    name: 'Elena Rostova',
    username: 'elenarostova',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    title: '🧵 Ajustes Finales de Vestidos Exclusivos en el Atelier',
    category: 'atelier',
    categoryLabel: 'Atelier',
    viewers: 1420,
    likes: 11800,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-a-red-light-40158-large.mp4',
    tags: ['#Atelier', '#PruebasDeVestuario', '#Taller'],
    isVerified: true
  },
  {
    id: 'live-chloe-atelier',
    modelId: 'topf-4',
    name: 'Chloe Laurent',
    username: 'chloelaurent_couture',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200',
    title: '👗 Confección de Vestidos de Gala y Costura de Precisión en Vivo',
    category: 'atelier',
    categoryLabel: 'Atelier',
    viewers: 1680,
    likes: 12900,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-dancing-under-studio-light-40157-large.mp4',
    tags: ['#Atelier', '#AltaCostura', '#DiseñoDeModa'],
    isVerified: true
  },
  // 4. Streetwear & Urban
  {
    id: 'live-jon-streetwear',
    modelId: 'topm-1',
    name: 'Jon Kortajarena',
    username: 'jonkortajarena',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    title: '⚡ Vanguardia Urbana & Streetwear en Milán Fashion District',
    category: 'streetwear',
    categoryLabel: 'Streetwear & Urban',
    viewers: 2240,
    likes: 18900,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stylish-young-man-walking-in-a-urban-setting-41712-large.mp4',
    tags: ['#Streetwear', '#UrbanFashion', '#Milán'],
    isVerified: true
  },
  // 5. FashionModel
  {
    id: 'live-gisele-fashion',
    modelId: 'topf-2',
    name: 'Gisele Bündchen',
    username: 'gisele',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    title: '💄 Sesión de Portada Editorial de Alta Moda & Estudio Glamour',
    category: 'fashion_model',
    categoryLabel: 'Fashion Model',
    viewers: 2890,
    likes: 22100,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-rainy-night-40539-large.mp4',
    tags: ['#FashionModel', '#Editorial', '#Glamour'],
    isVerified: true
  },
  // 6. Catalog Model
  {
    id: 'live-taylor-catalog',
    modelId: 'topf-7',
    name: 'Taylor Hill',
    username: 'taylorhill',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    title: '📸 Grabación de Lookbook & Catálogo Internacional de Temporada',
    category: 'catalog_model',
    categoryLabel: 'Catalog Model',
    viewers: 1760,
    likes: 13400,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-dancing-under-studio-light-40157-large.mp4',
    tags: ['#CatalogModel', '#Lookbook', '#Temporada'],
    isVerified: true
  },
  // 7. Commercial Model
  {
    id: 'live-alessandra-commercial',
    modelId: 'topf-4',
    name: 'Alessandra Ambrosio',
    username: 'alessandraambrosio',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=200',
    title: '🎬 Rodaje en Directo para Campaña Global Comercial & TV Spot',
    category: 'commercial_model',
    categoryLabel: 'Commercial Model',
    viewers: 2150,
    likes: 16900,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-makeup-posing-under-neon-light-40478-large.mp4',
    tags: ['#CommercialModel', '#AdCampaign', '#Lifestyle'],
    isVerified: true
  },
  // 8. Plus-size Model
  {
    id: 'live-ashley-plus',
    modelId: 'topf-8',
    name: 'Ashley Graham',
    username: 'ashleygraham',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    title: '👑 Empoderamiento Curvy en la Pasarela de Nueva York LIVE',
    category: 'plus_size_model',
    categoryLabel: 'Plus-size Model',
    viewers: 2640,
    likes: 21500,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-in-a-studio-with-flashing-lights-40485-large.mp4',
    tags: ['#PlusSizeModel', '#CurvyRunway', '#BodyPositivity'],
    isVerified: true
  },
  // 9. Petite Model
  {
    id: 'live-lily-petite',
    modelId: 'topf-9',
    name: 'Lily-Rose Depp',
    username: 'lilyrosedepp',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
    title: '✨ Vanguardia & Silueta Petite en Presentación Exclusiva',
    category: 'petite_model',
    categoryLabel: 'Petite Model',
    viewers: 1980,
    likes: 15700,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-in-a-rainy-night-40539-large.mp4',
    tags: ['#PetiteModel', '#HauteFashion', '#Silueta'],
    isVerified: true
  },
  // 10. Lingerie Model
  {
    id: 'live-adriana-lingerie',
    modelId: 'topf-1',
    name: 'Adriana Lima',
    username: 'adrianalima',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    title: '💖 Sesión Especial Lingerie & Seda de Lujo en Backstage',
    category: 'lingerie_model',
    categoryLabel: 'Lingerie Model',
    viewers: 3890,
    likes: 31200,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4',
    tags: ['#LingerieModel', '#SedaDeLujo', '#AngelsLive'],
    isVerified: true
  },
  // 11. Swimsuit Model
  {
    id: 'live-sara-swimsuit',
    modelId: 'topf-5',
    name: 'Sara Sampaio',
    username: 'sarasampaio',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200',
    title: '☀️ Desfile Resort & Baño de Lujo en Costa Mediterránea',
    category: 'swimsuit_model',
    categoryLabel: 'Swimsuit Model',
    viewers: 2480,
    likes: 19800,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-with-luxury-jewelry-posing-in-a-studio-41718-large.mp4',
    tags: ['#SwimsuitModel', '#ResortFashion', '#MiamiSwim'],
    isVerified: true
  },
  // 12. Fitness Model
  {
    id: 'live-taylor-fitness',
    modelId: 'topf-7',
    name: 'Taylor Hill',
    username: 'taylorhill',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    title: '🏃‍♀️ Rutina de Calentamiento, Tonificación & Fitness Pre-Desfile',
    category: 'fitness_model',
    categoryLabel: 'Fitness Model',
    viewers: 1650,
    likes: 12800,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-warm-up-exercises-in-a-gym-42999-large.mp4',
    tags: ['#FitnessModel', '#Workout', '#ModelFitness'],
    isVerified: true
  },
  // 13. Parts Model
  {
    id: 'live-sara-parts',
    modelId: 'topf-5',
    name: 'Sara Sampaio',
    username: 'sarasampaio',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200',
    title: '💎 Exposición de Manos, Alta Relojería Suiza y Diamantes VIP',
    category: 'parts_model',
    categoryLabel: 'Parts Model',
    viewers: 2210,
    likes: 17600,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-with-luxury-jewelry-posing-in-a-studio-41718-large.mp4',
    tags: ['#PartsModel', '#JoyeríaFina', '#AltaRelojería'],
    isVerified: true
  },
  // 14. Mature Model
  {
    id: 'live-maye-mature',
    modelId: 'topf-10',
    name: 'Maye Musk',
    username: 'mayemusk',
    avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&q=80&w=200',
    title: '💎 Pasarela Silver & Sofisticación Atemporal en Alta Costura',
    category: 'mature_model',
    categoryLabel: 'Mature Model',
    viewers: 2790,
    likes: 22400,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40483-large.mp4',
    tags: ['#MatureModel', '#SilverGlamour', '#Atemporal'],
    isVerified: true
  },
  // 15. Real People Models
  {
    id: 'live-street-real',
    modelId: 'topf-12',
    name: 'Street Casting Project',
    username: 'realpeoplecast',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200',
    title: '🌍 Diversidad Auténtica & Modelos Reales en Fashion Week',
    category: 'real_people_models',
    categoryLabel: 'Real People Models',
    viewers: 1840,
    likes: 14700,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-makeup-posing-under-neon-light-40478-large.mp4',
    tags: ['#RealPeopleModels', '#Diversidad', '#Autenticidad'],
    isVerified: true
  }
];
