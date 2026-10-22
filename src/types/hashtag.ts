export interface Hashtag {
  id: string;
  tag: string; // normalizado sin #, ej: 'runway', 'finanzas'
  displayName: string; // ej: '#Runway', '#finanzas'
  theme: string; // ej: 'Pasarela · Moda · Modelos'
  category: string; // ej: 'Moda & Pasarela', 'Finanzas & Inversión', etc.
  description: string;
  region: string; // 'Global' | 'España' | 'México' | 'Italia' | 'Francia' | 'EE.UU.'
  status: 'trending' | 'active' | 'rising';
  createdAt: string;
  icon?: string;
  bannerImage?: string;
}

export interface VideoHashtag {
  id: string;
  videoId: string;
  hashtagId: string;
  tag: string;
  relevanceScore: number;
  watchTimeSeconds: number;
  completionRate: number;
  addedAt: string;
}

export interface HashtagMetrics {
  hashtagId: string;
  tag: string;
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  engagementRate: number; // Porcentaje
  averageWatchTimeSec: number;
  lastUpdated: string;
}

export interface HashtagTrendPoint {
  date: string;
  views: number;
  posts: number;
  score: number;
}

export interface HashtagTrend {
  hashtagId: string;
  tag: string;
  period: '7d' | '30d' | '90d';
  trendScore: number; // 0 a 100
  growthPercentage: number; // ej: +42.8%
  rank: number;
  history: HashtagTrendPoint[];
  regionalDistribution: Record<string, number>; // ej: { 'España': 38, 'México': 26, 'Italia': 18, 'Global': 18 }
}

export interface UserHashtag {
  userId: string;
  hashtagId: string;
  tag: string;
  followedAt: string;
  interestScore: number;
}
