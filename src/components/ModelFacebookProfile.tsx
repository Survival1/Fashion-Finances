/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserSessionProfile, ModelProfile, ChatMessage } from '../types';
import ModelBookingSystem from './ModelBookingSystem';
import UserUploadedVideos from './UserUploadedVideos';
import { compressAndResizeImage } from '../utils/imageCompressor';
import { 
  Heart, 
  Trash2,
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Gift,
  Globe, 
  Camera, 
  Link, 
  Sparkles, 
  FileText, 
  Send, 
  Edit, 
  Check, 
  ExternalLink, 
  Instagram, 
  MoreHorizontal, 
  Award,
  Users,
  Search,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  X,
  UserCheck,
  UserPlus,
  Calendar,
  Film,
  Settings,
  Plus,
  Lock,
  Star,
  Ban,
  Clock,
  Bell,
  Bookmark,
  SquareUser,
  ShieldAlert,
  EyeOff,
  Type,
  Play,
  ChevronLeft,
  ChevronRight,
  Volume1,
  Volume2,
  VolumeX,
  Briefcase,
  MapPin,
  Mail,
  Upload,
  User
} from 'lucide-react';

interface FBComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  date: string;
  replies?: FBComment[];
}

interface FBPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorUsername: string;
  content: string;
  image?: string;
  linkUrl?: string;
  linkTitle?: string;
  likes: number;
  hasLiked: boolean;
  comments: FBComment[];
  createdAt: string;
}

interface PhotoInteraction {
  likes: { [userId: string]: boolean };
  reactions?: { [userId: string]: string };
  likeCount: number;
  comments: FBComment[];
}

interface PhotoInteractionsMap {
  [photoUrl: string]: PhotoInteraction;
}

const DEFAULT_PHOTO_COMMENTS = [
  "¡Espectacular toma! 😍 El ángulo y la iluminación son perfectos.",
  "¡Wow! Increíble look, de verdad tienes un talento natural para modelar 💖✨",
  "¡Qué gran patrocinadora de proyectos financieros! Admirable",
  "¡Increíble outfit! ¿De qué marca de moda es? 👗🔥",
  "La mejor modelo de todo el top 50, ¡ya te di mi like! 👍🚀",
  "Estilazo espectacular. Sigo apoyándote en las mesas de inversión."
];

const DEFAULT_COMMENT_AUTHORS = [
  { name: "Andrés Mendoza", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },
  { name: "Lucía Pérez", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
  { name: "Carlos Slim", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150" },
  { name: "Sofía Martínez", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150" }
];

interface ModelFacebookProfileProps {
  userProfile: UserSessionProfile;
  models: ModelProfile[];
  onUpdateProfile: (nextProfile: UserSessionProfile) => void;
  onUpdateModels: (nextModels: ModelProfile[]) => void;
  onSendMessage?: (newMsg: ChatMessage) => void;
  realLoggedInUser?: UserSessionProfile;
  onOpenRanking?: () => void;
  onNavigateToTab?: (tab: 'home' | 'finance' | 'sessions' | 'create_project' | 'chat' | 'profile' | 'patrocinados' | 'saved_projects' | 'casting_live', targetStoreId?: string) => void;
  onLaunchChat?: (modelId: string, draftImg?: string) => void;
  onGoToModelProfile?: (modelId: string, modelObj?: any) => void;
  initialSocialModal?: 'followers' | 'following' | 'friends' | null;
  onSocialModalChange?: (modal: 'followers' | 'following' | 'friends' | null) => void;
}

export default function ModelFacebookProfile({
  userProfile,
  models,
  onUpdateProfile,
  onUpdateModels,
  onSendMessage,
  realLoggedInUser,
  onOpenRanking,
  onNavigateToTab,
  onLaunchChat,
  onGoToModelProfile,
  initialSocialModal,
  onSocialModalChange
}: ModelFacebookProfileProps) {
  const isOwnProfile = !realLoggedInUser || realLoggedInUser.id === userProfile.id;
  
  // Find current model's profile info
  const currentModel = models.find(m => m.id === userProfile.id);

  // States
  const [activeProfileOrWallTab, setActiveProfileOrWallTab] = useState<'perfil' | 'muro'>('perfil');
  const [showBookingSystem, setShowBookingSystem] = useState(false);
  const [showUploadedVideos, setShowUploadedVideos] = useState(false);
  const [signedAgreements, setSignedAgreements] = useState<Record<string, { company: string, amount: string, campaign: string }>>(() => {
    const saved = localStorage.getItem('coll_signed_agreements');
    return saved ? JSON.parse(saved) : {};
  });
  const [showAgreementForm, setShowAgreementForm] = useState(false);
  const [agreementCompany, setAgreementCompany] = useState('Empresa Inversora Asociada S.L.');
  const [agreementAmount, setAgreementAmount] = useState('25000');
  const [agreementCampaign, setAgreementCampaign] = useState('Colección Cápsula Internacional - Verano');
  const [bioText, setBioText] = useState(currentModel?.bio || userProfile.bio || 'Mecanismo de afiliación activo. ¡Apóyame en las mesas de inversión!');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState(userProfile.avatar);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);

  // Commercial Profile states
  const [profEmail, setProfEmail] = useState(() => {
    return localStorage.getItem(`prof_email_${userProfile.id}`) || `partnerships@${userProfile.username || 'tudominio'}.com`;
  });
  const [profCity, setProfCity] = useState(() => {
    return localStorage.getItem(`prof_city_${userProfile.id}`) || (userProfile.username === 'ernestovs' || userProfile.name.toLowerCase().includes('ernesto') ? 'Madrid, España' : 'París / Milán / Madrid');
  });
  const [isEditingCommercial, setIsEditingCommercial] = useState(false);
  const [showContractsModal, setShowContractsModal] = useState(false);
  const [contractSearchQuery, setContractSearchQuery] = useState('');
  const [tempProfEmail, setTempProfEmail] = useState(profEmail);
  const [tempProfCity, setTempProfCity] = useState(profCity);

  // Service Hiring states
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [hiringCompany, setHiringCompany] = useState('Inversores Asociados S.A.');
  const [hiringBudget, setHiringBudget] = useState('15000');
  const [hiringDetails, setHiringDetails] = useState('');
  const [hiringSuccessMessage, setHiringSuccessMessage] = useState<string | null>(null);

  // New structured fields for automated Stripe B2B legal flows
  const [hiringRepresentative, setHiringRepresentative] = useState('Carlos Mendoza / Director de Marca');
  const [hiringCorpEmail, setHiringCorpEmail] = useState('carlos.mendoza@inversoresasociados.com');
  const [hiringDate, setHiringDate] = useState('2026-07-15');
  const [deliverablePodium, setDeliverablePodium] = useState(true);
  const [deliverableSocialMedia, setDeliverableSocialMedia] = useState(false);
  const [deliverablePostImages, setDeliverablePostImages] = useState(false);
  const [requestExclusive, setRequestExclusive] = useState(false);
  const [uploadedLogoName, setUploadedLogoName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Advanced professional runway contract specifications
  const [runwayShowName, setRunwayShowName] = useState('Colección Runway Primavera/Verano');
  const [footwearSize, setFootwearSize] = useState('39');
  const [rehearsalSessions, setRehearsalSessions] = useState('1 Sesión de Ensayo (Día anterior)');
  const [runwayDuration, setRunwayDuration] = useState('2 Pases de Colección + Cierre de Carrusel');
  const [makeupInclusion, setMakeupInclusion] = useState('Incluido (Estilistas y Makeup del Evento)');
  const [cateringInclusion, setCateringInclusion] = useState('Catering VIP Completo Incluido en Camerino');
  const [travelCoverage, setTravelCoverage] = useState('Alojamiento 5 estrellas y Vuelos Cubiertos por la Marca');
  const [liabilityInsurance, setLiabilityInsurance] = useState(true);

  // States for 'Apariciones en los resultados finales' multi-economic bids
  const [offerGold, setOfferGold] = useState('50000');
  const [offerSilver, setOfferSilver] = useState('25000');
  const [offerBronze, setOfferBronze] = useState('12000');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setUploadedLogoName(file.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedLogoName(e.target.files[0].name);
    }
  };

  const [investorPhotos, setInvestorPhotos] = useState<string[]>(() => {
    const saved = localStorage.getItem(`investor_photos_${userProfile.id}`);
    return saved ? JSON.parse(saved) : [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=650',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=650',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=650',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=650',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=650'
    ];
  });
  const [historyWonLog, setHistoryWonLog] = useState<any[]>(() => {
    const saved = localStorage.getItem('coll_history_won');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Sync states if the active userProfile changes
  useEffect(() => {
    const activeBio = currentModel?.bio || userProfile.bio || 'Mecanismo de afiliación activo. ¡Apóyame en las mesas de inversión!';
    const activeAgency = currentModel ? (currentModel.fashionAgency || '') : (userProfile.fashionAgency || '');
    setBioText(activeBio);
    setFashionAgency(activeAgency);
    setEditingFashionAgency(activeAgency);
    setTempAvatarUrl(userProfile.avatar);
    setEditingName(userProfile.name);
    setEditingUsername(userProfile.username);
    setEditingBio(activeBio);
    setEditingAvatar(userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150');

    const emailKey = `prof_email_${userProfile.id}`;
    const cityKey = `prof_city_${userProfile.id}`;
    const savedEmail = localStorage.getItem(emailKey) || `partnerships@${userProfile.username || 'tudominio'}.com`;
    const savedCity = localStorage.getItem(cityKey) || (userProfile.username === 'ernestovs' || userProfile.name.toLowerCase().includes('ernesto') ? 'Madrid, España' : 'París / Milán / Madrid');
    setProfEmail(savedEmail);
    setProfCity(savedCity);
    setTempProfEmail(savedEmail);
    setTempProfCity(savedCity);
    setIsEditingCommercial(false);

    const savedBlocked = localStorage.getItem(`blocked_users_${userProfile.id}`);
    setBlockedUserIds(savedBlocked ? JSON.parse(savedBlocked) : []);
    setBlockedSearchQuery('');

    const savedWon = localStorage.getItem('coll_history_won');
    if (savedWon) setHistoryWonLog(JSON.parse(savedWon));
    const savedAgreements = localStorage.getItem('coll_signed_agreements');
    if (savedAgreements) {
      setSignedAgreements(JSON.parse(savedAgreements));
    } else {
      setSignedAgreements({});
    }
    setShowAgreementForm(false);
  }, [userProfile.id, userProfile.name, userProfile.username, currentModel?.bio, userProfile.avatar, userProfile.bio]);

  useEffect(() => {
    const saved = localStorage.getItem(`investor_photos_${userProfile.id}`);
    if (saved) {
      setInvestorPhotos(JSON.parse(saved));
    } else {
      setInvestorPhotos([
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=650',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=650',
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=650'
      ]);
    }
  }, [userProfile.id]);

  useEffect(() => {
    const saved = localStorage.getItem(`highlights_${userProfile.id}`);
    if (saved) {
      setHighlights(JSON.parse(saved));
    } else {
      setHighlights([
        { id: 'h1', title: 'lovelehee', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300' },
        { id: 'h2', title: 'marii2121', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300' },
        { id: 'h3', title: 'ann_______', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300' },
        { id: 'h4', title: 'salamakss', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=300' },
        { id: 'h5', title: 'plievazz', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' },
        { id: 'h6', title: 'laviniader', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400' },
        { id: 'h7', title: 'milano.fw', image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=300' },
        { id: 'h8', title: 'editorial', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300' }
      ]);
    }
  }, [userProfile.id]);
  
  // Post Creator States
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [newPostLink, setNewPostLink] = useState('');
  const [newPostLinkTitle, setNewPostLinkTitle] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [newDirectPhotoUrl, setNewDirectPhotoUrl] = useState('');
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('profile');
  const [editingName, setEditingName] = useState(userProfile.name);
  const [editingUsername, setEditingUsername] = useState(userProfile.username);
  const [editingBio, setEditingBio] = useState(bioText);
  const [editingAvatar, setEditingAvatar] = useState(userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150');
  const [fashionAgency, setFashionAgency] = useState(userProfile.fashionAgency || currentModel?.fashionAgency || '');
  const [editingFashionAgency, setEditingFashionAgency] = useState(userProfile.fashionAgency || currentModel?.fashionAgency || '');
  const [isAccountPrivate, setIsAccountPrivate] = useState(false);
  const [activeGalleryTab, setActiveGalleryTab] = useState<'grid' | 'saved' | 'reposts' | 'tagged' | 'saved_videos'>('grid');
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`blocked_users_${userProfile.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [blockedSearchQuery, setBlockedSearchQuery] = useState('');

  // Tracking user-uploaded photos for explicit, contextual photo deletion
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>(() => {
    const saved = localStorage.getItem(`uploaded_photo_urls_${userProfile.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const trackUploadedPhoto = (url: string) => {
    if (!url) return;
    setUploadedPhotoUrls(prev => {
      if (prev.includes(url)) return prev;
      const next = [url, ...prev];
      localStorage.setItem(`uploaded_photo_urls_${userProfile.id}`, JSON.stringify(next));
      return next;
    });
  };

  const handleBlockUser = (id: string) => {
    setBlockedUserIds(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(`blocked_users_${userProfile.id}`, JSON.stringify(next));
      return next;
    });
  };

  const handleUnblockUser = (id: string) => {
    setBlockedUserIds(prev => {
      const next = prev.filter(item => item !== id);
      localStorage.setItem(`blocked_users_${userProfile.id}`, JSON.stringify(next));
      return next;
    });
  };

  // --- RANKING VIDEO UPLOAD FORM STATES ---
  const [rankingFormVideoUrl, setRankingFormVideoUrl] = useState<string>(() => {
    const cachedRankingsRaw = localStorage.getItem('coll_top_100_ranking');
    if (cachedRankingsRaw) {
      try {
        const rankingsData = JSON.parse(cachedRankingsRaw);
        const userId = userProfile?.id || 'admin';
        const matchedModelInProps = models?.find(m => m.id === userId || (m.username && m.username.toLowerCase() === userProfile?.username?.toLowerCase()));
        const userGender = (matchedModelInProps as any)?.gender || (userProfile as any)?.gender || 'female';
        const targetKey = userGender === 'female' ? 'females' : 'males';
        const found = rankingsData[targetKey]?.find((m: any) => m.id === userId || m.username === userProfile?.username);
        if (found?.videoUrl) return found.videoUrl;
      } catch (e) {}
    }
    return 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-posing-with-a-red-light-40486-large.mp4';
  });
  const [rankingFormDescription, setRankingFormDescription] = useState<string>(() => {
    const cachedRankingsRaw = localStorage.getItem('coll_top_100_ranking');
    if (cachedRankingsRaw) {
      try {
        const rankingsData = JSON.parse(cachedRankingsRaw);
        const userId = userProfile?.id || 'admin';
        const matchedModelInProps = models?.find(m => m.id === userId || (m.username && m.username.toLowerCase() === userProfile?.username?.toLowerCase()));
        const userGender = (matchedModelInProps as any)?.gender || (userProfile as any)?.gender || 'female';
        const targetKey = userGender === 'female' ? 'females' : 'males';
        const found = rankingsData[targetKey]?.find((m: any) => m.id === userId || m.username === userProfile?.username);
        if (found?.bio) return found.bio;
      } catch (e) {}
    }
    return '';
  });
  const [userRankingVideos, setUserRankingVideos] = useState<{label: string, url: string, isCustom?: boolean}[]>(() => {
    const raw = localStorage.getItem('user_ranking_videos');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({ ...item, isCustom: true }));
        }
      } catch (e) {}
    }
    return [
      {
        label: 'NUCLEO.MP4',
        url: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-posing-with-a-red-light-40486-large.mp4',
        isCustom: true
      }
    ];
  });
  const [newCustomVideoUrl, setNewCustomVideoUrl] = useState<string>('');
  const [newCustomVideoLabel, setNewCustomVideoLabel] = useState<string>('');
  const [rankingFormConfirmCloseup, setRankingFormConfirmCloseup] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('user_ranking_videos', JSON.stringify(userRankingVideos));
  }, [userRankingVideos]);

  // Custom stories/highlights state
  const [highlights, setHighlights] = useState<{ id: string; title: string; image: string }[]>(() => {
    const saved = localStorage.getItem(`highlights_${userProfile.id}`);
    if (saved) return JSON.parse(saved);
    return [
      { id: 'h1', title: 'lovelehee', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300' },
      { id: 'h2', title: 'marii2121', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300' },
      { id: 'h3', title: 'ann_______', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300' },
      { id: 'h4', title: 'salamakss', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=300' },
      { id: 'h5', title: 'plievazz', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' },
      { id: 'h6', title: 'laviniader', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400' },
      { id: 'h7', title: 'milano.fw', image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=300' },
      { id: 'h8', title: 'editorial', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300' }
    ];
  });
  const [selectedStoryForPreview, setSelectedStoryForPreview] = useState<{ id: string; title: string; image: string; isVideo?: boolean } | null>(null);
  const [profileStorySubIndex, setProfileStorySubIndex] = useState<number>(0);
  const [profileStoryMuted, setProfileStoryMuted] = useState<boolean>(() => {
    return localStorage.getItem('profile_story_muted') === 'true';
  });
  const [profileVideoVolume, setProfileVideoVolume] = useState<number>(() => {
    const saved = localStorage.getItem('profile_video_volume');
    return saved ? parseFloat(saved) : 0.8;
  });
  const [isProfileVideoMuted, setIsProfileVideoMuted] = useState<boolean>(() => {
    return localStorage.getItem('profile_video_muted') === 'true';
  });

  // Synchronize volume and mute states to saved video elements
  React.useEffect(() => {
    const videos = document.querySelectorAll('.saved-video-element');
    videos.forEach(v => {
      const video = v as HTMLVideoElement;
      video.muted = isProfileVideoMuted;
      video.volume = profileVideoVolume;
    });
  }, [profileVideoVolume, isProfileVideoMuted]);
  const [floatingParticles, setFloatingParticles] = useState<{ id: string; emoji: string; left: number; bottom: number; size: number; delay: number; duration: number }[]>([]);

  function spawnEmojiParticles(emoji: string) {
    const newParticles = Array.from({ length: 24 }).map((_, i) => ({
      id: `part-${Date.now()}-${i}-${Math.random()}`,
      emoji: emoji,
      left: 10 + Math.random() * 80,
      bottom: 12 + Math.random() * 10,
      size: 20 + Math.random() * 24,
      delay: Math.random() * 0.4,
      duration: 1.5 + Math.random() * 1.5
    }));
    setFloatingParticles(prev => [...prev, ...newParticles]);
  }

  React.useEffect(() => {
    if (floatingParticles.length > 0) {
      const timer = setTimeout(() => {
        setFloatingParticles(p => p.filter(item => Date.now() - parseFloat(item.id.split('-')[1]) < 3000));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [floatingParticles]);

  // Archive and active stories state
  const [storyArchiveEnabled, setStoryArchiveEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(`story_archive_enabled_${userProfile.id}`);
    return saved ? JSON.parse(saved) : true;
  });

  const [activeStoriesList, setActiveStoriesList] = useState<any[]>(() => {
    const raw = localStorage.getItem('active_stories');
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return parsed.filter((s: any) => s.expiresAt > Date.now());
    } catch (e) {
      return [];
    }
  });

  const profileActiveStories = activeStoriesList.filter(
    (s: any) => s.userId === userProfile.id && s.expiresAt > Date.now()
  );

  const [archivedStories, setArchivedStories] = useState<any[]>(() => {
    const saved = localStorage.getItem(`archived_stories_${userProfile.id}`);
    if (saved) return JSON.parse(saved);
    const defaultArchived = [
      {
        id: 'archived-story-1',
        userId: userProfile.id,
        username: userProfile.username,
        name: userProfile.name,
        avatar: userProfile.avatar,
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600',
        title: 'Runway París de archivo',
        createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
        expiresAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
        isVideo: false
      },
      {
        id: 'archived-story-2',
        userId: userProfile.id,
        username: userProfile.username,
        name: userProfile.name,
        avatar: userProfile.avatar,
        image: 'https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?auto=format&fit=crop&q=80&w=600',
        title: 'Milán Backstage histórico',
        createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
        expiresAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
        isVideo: false
      },
      {
        id: 'archived-story-3',
        userId: userProfile.id,
        username: userProfile.username,
        name: userProfile.name,
        avatar: userProfile.avatar,
        image: 'https://images.unsplash.com/photo-1549439602-43faec43ae8a?auto=format&fit=crop&q=80&w=600',
        title: 'Vogue Editorial Look de archivo',
        createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
        expiresAt: Date.now() - 9 * 24 * 60 * 60 * 1000,
        isVideo: false
      }
    ];
    localStorage.setItem(`archived_stories_${userProfile.id}`, JSON.stringify(defaultArchived));
    return defaultArchived;
  });

  const migrateSavedVideos = (videos: any[], userId: string) => {
    if (!videos || !Array.isArray(videos)) return [];
    let modified = false;
    const migrated = videos.map((vid, idx) => {
      if (!vid) return null;
      if (!vid.videoCategory) {
        modified = true;
        const desc = (vid.description || '').toLowerCase();
        const title = (vid.title || '').toLowerCase();
        const name = (vid.name || '').toLowerCase();
        
        if (desc.includes('catwalk') || desc.includes('pasarela') || desc.includes('runway') || desc.includes('desfile') || title.includes('catwalk') || title.includes('pasarela')) {
          return { ...vid, videoCategory: 'Catwalk' };
        } else if (desc.includes('modelo') || desc.includes('modelos') || desc.includes('poses') || title.includes('modelo') || title.includes('modelos') || desc.includes('modelaje') || title.includes('modelaje')) {
          return { ...vid, videoCategory: 'Modelos' };
        } else if (desc.includes('finanzas') || desc.includes('invers') || title.includes('finanzas')) {
          return { ...vid, videoCategory: 'Finanzas' };
        } else if (desc.includes('reels') || desc.includes('short') || title.includes('reels')) {
          return { ...vid, videoCategory: 'Reels' };
        } else if (name.includes('adriana')) {
          return { ...vid, videoCategory: 'Fashion' };
        } else {
          // Fallback if we cannot decide by keywords but it is a user uploaded video, alternate to make them both visible
          if (vid.id && String(vid.id).includes('uploaded')) {
            return { ...vid, videoCategory: idx % 2 === 0 ? 'Catwalk' : 'Modelos' };
          }
          return { ...vid, videoCategory: 'Fashion' };
        }
      }
      return vid;
    }).filter(Boolean);
    if (modified) {
      try {
        localStorage.setItem(`saved_videos_${userId}`, JSON.stringify(migrated));
      } catch (e) {
        console.error('Error saving migrated videos', e);
      }
    }
    return migrated;
  };

  const [savedVideos, setSavedVideos] = useState<any[]>(() => {
    let baseList = [];
    const userId = userProfile?.id || 'anonymous';
    const saved = localStorage.getItem(`saved_videos_${userId}`);
    if (saved) {
      try {
        baseList = migrateSavedVideos(JSON.parse(saved), userId);
      } catch (e) {
        console.error(e);
      }
    } else {
      baseList = [
        {
          id: 'sv-uploaded-adriana',
          title: 'FLorem Ipsum es simplemente el tex...',
          description: 'FLorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha...',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-posing-with-a-red-light-40486-large.mp4',
          music: 'Música original - Fashion Finances Studio',
          likes: 852,
          views: '1.2K',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          name: 'adrianalima_w1',
          videoCategory: 'Fashion'
        },
        {
          id: 'sv-1',
          title: 'Urban Silhouette Walk',
          description: 'Cinta de pasarela urbana en retroiluminación carmín.',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-a-red-light-40158-large.mp4',
          music: 'Chic Urban Lofi Beats',
          likes: 423,
          views: '11.4K',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          name: 'Lovelehee',
          videoCategory: 'Catwalk'
        },
        {
          id: 'sv-2',
          title: 'Neon Studio Dance',
          description: 'Práctica de pose fluida para la campaña internacional de primavera.',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-dancing-under-studio-light-40157-large.mp4',
          music: 'Neon Synthwave Chic',
          likes: 852,
          views: '24.9K',
          avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722553e1?auto=format&fit=crop&q=80&w=150',
          name: 'Marii2121',
          videoCategory: 'Modelos'
        },
        {
          id: 'sv-3',
          title: 'Editorial Silhouette Vogue',
          description: 'Sesión artística monocromática de movimiento continuo.',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-modeling-40156-large.mp4',
          music: 'Alternative Deep Vogue',
          likes: 297,
          views: '8.3K',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
          name: 'Ann_______',
          videoCategory: 'Fashion'
        }
      ];
    }

    // Now merge uploaded videos from coll_casting_live_videos matching this model
    const castingLiveVideosStr = localStorage.getItem('coll_casting_live_videos');
    if (castingLiveVideosStr) {
      try {
        const parsedLive = JSON.parse(castingLiveVideosStr);
        if (Array.isArray(parsedLive)) {
          const viewedUsername = (userProfile?.username || '').toLowerCase().trim();
          const uploadedSaved = parsedLive
            .filter((v: any) => {
              if (!v || !v.id) return false;
              const isUploaded = String(v.id).includes('uploaded') || String(v.id).includes('sv-');
              if (!isUploaded) return false;
              // Match if associated with the viewed profile in any way
              const matchModelId = userProfile?.id ? v.modelId === userProfile.id : false;
              const matchUploaderId = userProfile?.id ? v.uploaderId === userProfile.id : false;
              const matchUsername = v.username && (v.username.toLowerCase().trim() === viewedUsername);
              return matchModelId || matchUploaderId || matchUsername;
            })
            .map((v: any) => ({
              id: v.id,
              title: v.description ? (v.description.length > 35 ? v.description.substring(0, 32) + '...' : v.description) : '¡Nueva sesión de modelaje subida!',
              description: v.description || '¡Nueva sesión de modelaje subida a Fashion Finances! 📸🌟 #trend #fashionista',
              videoUrl: v.videoUrl,
              music: v.music || 'Música original - Fashion Finances Studio',
              likes: v.likes || 12,
              views: '1.2K',
              avatar: v.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
              name: v.username || 'Anonymous',
              videoCategory: v.videoCategory || 'Fashion',
              isLiked: v.isLiked || false,
              isFavorited: v.isFavorited || false,
              isFollowing: v.isFollowing || false
            }));

          const combined: any[] = [];
          const seenIds = new Set<string>();
          const seenKeys = new Set<string>();

          const getKey = (item: any) => {
            if (!item) return '';
            const url = (item.videoUrl || '').trim();
            if (url) return url;
            return item.id || '';
          };

          for (const uploadItem of uploadedSaved) {
            if (!uploadItem || !uploadItem.id) continue;
            const key = getKey(uploadItem);
            if (!seenIds.has(uploadItem.id) && (!key || !seenKeys.has(key))) {
              combined.push(uploadItem);
              seenIds.add(uploadItem.id);
              if (key) seenKeys.add(key);
            }
          }
          for (const item of baseList) {
            if (!item || !item.id) continue;
            const key = getKey(item);
            if (!seenIds.has(item.id) && (!key || !seenKeys.has(key))) {
              combined.push(item);
              seenIds.add(item.id);
              if (key) seenKeys.add(key);
            }
          }
          return combined;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return baseList;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      let baseList = [];
      const userId = userProfile?.id || 'anonymous';
      const saved = localStorage.getItem(`saved_videos_${userId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          baseList = migrateSavedVideos(parsed, userId);
        } catch (e) {
          console.error(e);
        }
      } else {
        baseList = [
          {
            id: 'sv-uploaded-adriana',
            title: 'FLorem Ipsum es simplemente el tex...',
            description: 'FLorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha...',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-posing-with-a-red-light-40486-large.mp4',
            music: 'Música original - Fashion Finances Studio',
            likes: 852,
            views: '1.2K',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
            name: 'adrianalima_w1',
            videoCategory: 'Fashion'
          },
          {
            id: 'sv-1',
            title: 'Urban Silhouette Walk',
            description: 'Cinta de pasarela urbana en retroiluminación carmín.',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-a-red-light-40158-large.mp4',
            music: 'Chic Urban Lofi Beats',
            likes: 423,
            views: '11.4K',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
            name: 'Lovelehee',
            videoCategory: 'Catwalk'
          },
          {
            id: 'sv-2',
            title: 'Neon Studio Dance',
            description: 'Práctica de pose fluida para la campaña internacional de primavera.',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-dancing-under-studio-light-40157-large.mp4',
            music: 'Neon Synthwave Chic',
            likes: 852,
            views: '24.9K',
            avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722553e1?auto=format&fit=crop&q=80&w=150',
            name: 'Marii2121',
            videoCategory: 'Modelos'
          },
          {
            id: 'sv-3',
            title: 'Editorial Silhouette Vogue',
            description: 'Sesión artística monocromática de movimiento continuo.',
            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-modeling-40156-large.mp4',
            music: 'Alternative Deep Vogue',
            likes: 297,
            views: '8.3K',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
            name: 'Ann_______',
            videoCategory: 'Fashion'
          }
        ];
      }

      const castingLiveVideosStr = localStorage.getItem('coll_casting_live_videos');
      if (castingLiveVideosStr) {
        try {
          const parsedLive = JSON.parse(castingLiveVideosStr);
          if (Array.isArray(parsedLive)) {
            const viewedUsername = (userProfile?.username || '').toLowerCase().trim();
            const uploadedSaved = parsedLive
              .filter((v: any) => {
                if (!v || !v.id) return false;
                const isUploaded = String(v.id).includes('uploaded') || String(v.id).includes('sv-');
                if (!isUploaded) return false;
                // Match if associated with the viewed profile in any way
                const matchModelId = userProfile?.id ? v.modelId === userProfile.id : false;
                const matchUploaderId = userProfile?.id ? v.uploaderId === userProfile.id : false;
                const matchUsername = v.username && (v.username.toLowerCase().trim() === viewedUsername);
                return matchModelId || matchUploaderId || matchUsername;
              })
              .map((v: any) => ({
                id: v.id,
                title: v.description ? (v.description.length > 35 ? v.description.substring(0, 32) + '...' : v.description) : '¡Nueva sesión de modelaje subida!',
                description: v.description || '¡Nueva sesión de modelaje subida a Fashion Finances! 📸🌟 #trend #fashionista',
                videoUrl: v.videoUrl,
                music: v.music || 'Música original - Fashion Finances Studio',
                likes: v.likes || 12,
                views: '1.2K',
                avatar: v.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
                name: v.username || 'Anonymous',
                videoCategory: v.videoCategory || 'Fashion',
                isLiked: v.isLiked || false,
                isFavorited: v.isFavorited || false,
                isFollowing: v.isFollowing || false
              }));

            const combined: any[] = [];
            const seenIds = new Set<string>();
            const seenKeys = new Set<string>();

            const getKey = (item: any) => {
              if (!item) return '';
              const url = (item.videoUrl || '').trim();
              if (url) return url;
              return item.id || '';
            };

            for (const uploadItem of uploadedSaved) {
              if (!uploadItem || !uploadItem.id) continue;
              const key = getKey(uploadItem);
              if (!seenIds.has(uploadItem.id) && (!key || !seenKeys.has(key))) {
                combined.push(uploadItem);
                seenIds.add(uploadItem.id);
                if (key) seenKeys.add(key);
              }
            }
            for (const item of baseList) {
              if (!item || !item.id) continue;
              const key = getKey(item);
              if (!seenIds.has(item.id) && (!key || !seenKeys.has(key))) {
                combined.push(item);
                seenIds.add(item.id);
                if (key) seenKeys.add(key);
              }
            }
            setSavedVideos(combined);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      setSavedVideos(baseList);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('saved_videos_updated', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('saved_videos_updated', handleStorageChange);
      clearInterval(interval);
    };
  }, [userProfile?.id]);

  const handleDeleteVideo = (videoId: string) => {
    const next = savedVideos.filter((v: any) => v.id !== videoId);
    setSavedVideos(next);
    const userId = userProfile?.id || 'anonymous';
    localStorage.setItem(`saved_videos_${userId}`, JSON.stringify(next));
    
    // Also remove from public feed/library (coll_casting_live_videos)
    try {
      const cached = localStorage.getItem('coll_casting_live_videos');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((v: any) => v.id !== videoId);
          localStorage.setItem('coll_casting_live_videos', JSON.stringify(filtered));
        }
      }
    } catch (e) {
      console.error(e);
    }

    window.dispatchEvent(new Event('saved_videos_updated'));
    window.dispatchEvent(new Event('storage'));
  };

  const [hiddenTaggedPhotos, setHiddenTaggedPhotos] = useState<string[]>(() => {
    const userId = userProfile?.id || 'anonymous';
    const saved = localStorage.getItem(`hidden_tagged_photos_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const handleRemoveTaggedPhoto = (ph: string) => {
    const next = [...hiddenTaggedPhotos, ph];
    setHiddenTaggedPhotos(next);
    localStorage.setItem(`hidden_tagged_photos_${userProfile.id}`, JSON.stringify(next));
  };

  // Profile Saved Videos Premium Interactions
  const [savedVideoCategoryFilter, setSavedVideoCategoryFilter] = useState<'Todos' | 'Reels' | 'Fashion' | 'Finanzas' | 'Modelos' | 'BackStage' | 'Investors' | 'Tiendas' | 'Catwalk'>('Todos');
  const [savedCategoryFilter, setSavedCategoryFilter] = useState<'Todos' | 'Reels' | 'Fashion' | 'Finanzas' | 'Modelos' | 'BackStage' | 'Investors' | 'Tiendas' | 'Catwalk'>('Todos');
  const [giftExplosions, setGiftExplosions] = useState<Record<string, { show: boolean; emoji: string }>>({});
  const [copiedVideoId, setCopiedVideoId] = useState<string | null>(null);
  const [openCommentsVideoId, setOpenCommentsVideoId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [customComments, setCustomComments] = useState<Record<string, Array<{ user: string; text: string; time: string }>>>({});
  const [bellNotifications, setBellNotifications] = useState<Record<string, boolean>>({});

  const mockCommentsMap: Record<string, Array<{ user: string; text: string; time: string }>> = {
    'sv-1': [
      { user: 'KylieJenner', text: 'Amazing strut! Absolutely killing it! 🔥', time: '1m ago' },
      { user: 'SofiaLoren', text: 'The red lighting is super dramatic. Brilliant concept!', time: '1h ago' },
      { user: 'AlexVance', text: 'Stunning visual quality. Best walker ever.', time: '3h ago' },
    ],
    'sv-2': [
      { user: 'ValRossi', text: 'The neon colors are out of this world! 💖', time: '5m ago' },
      { user: 'IsabellaD', text: 'This looks so professional, love the movement.', time: '2h ago' },
      { user: 'ElenaRost', text: 'Super modern and fresh vibes! 🚀', time: '5h ago' },
    ],
    'sv-3': [
      { user: 'SponsorHub', text: 'We would love to sponsor your next runway walk! DM us.', time: '10m ago' },
      { user: 'ParisAtelier', text: 'Perfect posture and expression. Splendid.', time: '4h ago' },
      { user: 'ModelScout', text: 'Impressive editorial portfolio! 📸🌟', time: '8h ago' },
    ]
  };

  const handleToggleLikeSavedVideo = (videoId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const next = savedVideos.map((v: any) => {
      if (v.id === videoId) {
        const isLiked = !v.isLiked;
        return {
          ...v,
          isLiked,
          likes: isLiked ? (v.likes || 423) + 1 : Math.max(0, (v.likes || 423) - 1)
        };
      }
      return v;
    });
    setSavedVideos(next);
    localStorage.setItem(`saved_videos_${userProfile.id}`, JSON.stringify(next));
  };

  const handleToggleFavoriteSavedVideo = (videoId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const next = savedVideos.map((v: any) => {
      if (v.id === videoId) {
        const isFavorited = !v.isFavorited;
        return {
          ...v,
          isFavorited,
          favoritesCount: isFavorited ? (v.favoritesCount || 78) + 1 : Math.max(0, (v.favoritesCount || 78) - 1)
        };
      }
      return v;
    });
    setSavedVideos(next);
    localStorage.setItem(`saved_videos_${userProfile.id}`, JSON.stringify(next));
  };

  const handleToggleFollowSavedVideo = (videoId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const next = savedVideos.map((v: any) => {
      if (v.id === videoId) {
        return {
          ...v,
          isFollowing: !v.isFollowing
        };
      }
      return v;
    });
    setSavedVideos(next);
    localStorage.setItem(`saved_videos_${userProfile.id}`, JSON.stringify(next));
  };

  const handleShareSavedVideo = (videoId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCopiedVideoId(videoId);
    setTimeout(() => setCopiedVideoId(null), 2000);
    navigator.clipboard?.writeText?.(window.location.href);
  };

  const triggerGiftExplosion = (videoId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const gifts = ['🎁', '💖', '⭐', '👑', '🔥', '💎', '🎉'];
    const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
    setGiftExplosions(prev => ({
      ...prev,
      [videoId]: { show: true, emoji: randomGift }
    }));
    setTimeout(() => {
      setGiftExplosions(prev => ({
        ...prev,
        [videoId]: { show: false, emoji: '' }
      }));
    }, 2000);
  };

  const triggerBellNotification = (videoId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBellNotifications(prev => ({ ...prev, [videoId]: true }));
    setTimeout(() => {
      setBellNotifications(prev => ({ ...prev, [videoId]: false }));
    }, 2500);
  };

  const handleVideoAddComment = (videoId: string) => {
    if (!newCommentText.trim()) return;
    const newComment = {
      user: 'Tú',
      text: newCommentText,
      time: 'Justo ahora'
    };
    setCustomComments(prev => ({
      ...prev,
      [videoId]: [newComment, ...(prev[videoId] || [])]
    }));
    setNewCommentText('');
  };

  const [isSelectingCoverVideo, setIsSelectingCoverVideo] = useState(false);
  const [customCoverVideoUrl, setCustomCoverVideoUrl] = useState('');
  
  const [coverVideoSlots, setCoverVideoSlots] = useState<Array<{ id: string; name: string; url: string; filename?: string }>>(() => {
    const saved = localStorage.getItem(`cover_video_slots_${userProfile.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: '1', name: 'Vídeo Principal (Captar Referidos 🔥)', url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-a-red-light-40158-large.mp4', filename: 'mixkit-woman-posing-with-a-red-light-40158-large.mp4' },
      { id: '2', name: 'Vídeo Alternativo (Pasarela de Atelier 👗)', url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-dancing-under-studio-light-40157-large.mp4', filename: 'mixkit-fashion-model-dancing-under-studio-light-40157-large.mp4' },
      { id: '3', name: 'Presentación de Rostro (Close-up 📸)', url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-modeling-40156-large.mp4', filename: 'mixkit-girl-in-neon-sign-modeling-40156-large.mp4' }
    ];
  });

  const [activeSlotId, setActiveSlotId] = useState<string>(() => {
    return localStorage.getItem(`active_cover_slot_id_${userProfile.id}`) || '1';
  });

  useEffect(() => {
    const handleOpenSettings = (e: Event) => {
      setShowSettingsDrawer(true);
      setActiveSettingsTab('profile');
    };
    window.addEventListener('open_settings_edit_profile', handleOpenSettings);
    return () => {
      window.removeEventListener('open_settings_edit_profile', handleOpenSettings);
    };
  }, []);

  const [modelSponsors, setModelSponsors] = useState<Array<{
    id: string;
    name: string;
    amount: number;
    logoUrl?: string | null;
    logoInitials: string;
    logoStyle: string;
    sector: string;
    isSelectedForResults: boolean;
    hiredDate: string;
    startDate?: string;
    endDate?: string;
    proposalDescription?: string;
    hasExclusivity?: boolean;
  }>>(() => {
    const saved = localStorage.getItem(`model_sponsors_${userProfile.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    return [
      {
        id: 's-1',
        name: 'Kering Group',
        amount: 50000,
        logoInitials: 'KER',
        logoStyle: 'bg-[#1e2c1e] text-[#e3ded4] font-bold border border-[#e3ded4]/20',
        sector: 'Costura Suprema 🇮🇹',
        isSelectedForResults: true,
        hiredDate: `${currentYear}-06-18`,
        startDate: `${currentYear}-06-18`,
        endDate: `${currentYear + 1}-06-18`,
        proposalDescription: 'Acuerdo preferencial para la visualización de logotipo oficial en la gala final y desfiles.'
      },
      {
        id: 's-2',
        name: 'LVMH Group',
        amount: 45000,
        logoInitials: 'LVMH',
        logoStyle: 'bg-[#2a1b18] text-amber-200 border border-amber-400',
        sector: 'Alta Costura Élite 🇫🇷',
        isSelectedForResults: true,
        hiredDate: `${currentYear}-06-19`,
        startDate: `${currentYear}-06-19`,
        endDate: `${currentYear + 1}-06-19`,
        proposalDescription: 'Patrocinio premium para sesiones de fotos, pasarelas de alta costura e integración de branding digital.'
      },
      {
        id: 's-3',
        name: 'Richemont',
        amount: 35000,
        logoInitials: 'RICH',
        logoStyle: 'bg-zinc-900 text-white border border-zinc-800',
        sector: 'Relojería de Lujo 🇨🇭',
        isSelectedForResults: true,
        hiredDate: `${currentYear}-06-20`,
        startDate: `${currentYear}-06-20`,
        endDate: `${currentYear + 1}-06-20`,
        proposalDescription: 'Sponsor oficial de alta joyería y cronómetros de precisión de lujo para los desfiles estelares.'
      },
      {
        id: 's-4',
        name: 'Balenciaga Inc',
        amount: 25000,
        logoInitials: 'BB',
        logoStyle: 'bg-zinc-950 text-white border border-black',
        sector: 'Streetwear Élite 👟',
        isSelectedForResults: false,
        hiredDate: `${nextYear}-01-10`,
        startDate: `${nextYear}-01-10`,
        endDate: `${nextYear + 1}-01-10`,
        proposalDescription: 'Patrocinio estratégico para la difusión de calzado deportivo y streetwear de alta costura.'
      },
      {
        id: 's-5',
        name: 'Gucci SPA',
        amount: 15000,
        logoInitials: 'GG',
        logoStyle: 'bg-[#1b3c22] text-[#d5af66] border border-[#811f26]',
        sector: 'Moda Glamour 💄',
        isSelectedForResults: false,
        hiredDate: `${nextYear}-03-15`,
        startDate: `${nextYear}-03-15`,
        endDate: `${nextYear + 1}-03-15`,
        proposalDescription: 'Alianza comercial estándar para el patrocinio de vestidos de gala y bolsos icónicos de la marca.'
      },
      {
        id: 's-past-1',
        name: 'Prada España',
        amount: 18000,
        logoInitials: 'PRD',
        logoStyle: 'bg-[#0f0f0f] text-white border border-stone-800 font-sans font-extrabold tracking-widest',
        sector: 'Alta Costura Élite 🇮🇹',
        isSelectedForResults: false,
        hiredDate: `${currentYear - 1}-01-15`,
        startDate: `${currentYear - 1}-01-15`,
        endDate: `${currentYear - 1}-07-15`,
        proposalDescription: 'Alianza de patrocinio exclusiva para desfile de gala primavera-verano de la temporada.'
      },
      {
        id: 's-past-2',
        name: 'Versace Paris',
        amount: 24000,
        logoInitials: 'V',
        logoStyle: 'bg-slate-950 text-[#d5af66] border border-orange-500/20 font-serif font-black',
        sector: 'Moda Glamour 💄',
        isSelectedForResults: false,
        hiredDate: `${currentYear - 1}-08-01`,
        startDate: `${currentYear - 1}-08-01`,
        endDate: `${currentYear - 1}-12-01`,
        proposalDescription: 'Contrato promocional para calzado y accesorios de gala en las pasarelas estacionales de París.'
      }
    ];
  });

  const [newSponsorName, setNewSponsorName] = useState('');
  const [newSponsorSector, setNewSponsorSector] = useState('');
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);

  const getBrandLogoInfo = (brandName: string) => {
    const nameLower = (brandName || '').toLowerCase();
    if (nameLower.includes("victoria's secret") || nameLower.includes("victorias secret")) {
      return { initials: 'VS', style: 'bg-gradient-to-tr from-pink-600 to-pink-400 text-white border border-pink-300/40 font-serif font-black shadow-inner' };
    }
    if (nameLower.includes("l'oréal") || nameLower.includes("loreal")) {
      return { initials: "L'O", style: 'bg-neutral-950 text-[#f3ca52] border border-amber-500 font-serif font-black shadow-md' };
    }
    if (nameLower.includes("carolina herrera")) {
      return { initials: 'CH', style: 'bg-[#faf9f6] text-neutral-900 border border-slate-200 font-serif font-black shadow-sm' };
    }
    if (nameLower.includes("richemont")) {
      return { initials: 'RICH', style: 'bg-neutral-950 text-white border border-neutral-800 font-sans font-extrabold shadow-md' };
    }
    if (nameLower.includes("chanel")) {
      return { initials: 'CC', style: 'bg-black text-white border border-stone-800 font-serif font-black shadow-md' };
    }
    if (nameLower.includes("gucci")) {
      return { initials: 'GG', style: 'bg-neutral-900 text-[#e5c158] border border-[#156d41] font-serif font-black shadow-md' };
    }
    if (nameLower.includes("dior")) {
      return { initials: 'CD', style: 'bg-[#fcfcfc] text-slate-900 border border-slate-300 font-serif font-bold shadow-xs' };
    }
    if (nameLower.includes("prada")) {
      return { initials: 'PRDA', style: 'bg-neutral-950 text-white border border-neutral-800 font-mono font-black shadow-md' };
    }
    if (nameLower.includes("versace")) {
      return { initials: 'V', style: 'bg-gradient-to-tr from-amber-600 to-amber-500 text-white border border-amber-300/40 font-serif font-black shadow-md' };
    }
    if (nameLower.includes("louis vuitton") || nameLower.includes("vuitton")) {
      return { initials: 'LV', style: 'bg-[#4a3b32] text-[#e3be85] border border-[#c29c5a] font-serif font-black shadow-md' };
    }
    if (nameLower.includes("hermès") || nameLower.includes("hermes")) {
      return { initials: 'H', style: 'bg-[#f37021] text-white border border-orange-400 font-serif font-black shadow-md' };
    }
    if (nameLower.includes("saint laurent") || nameLower.includes("ysl")) {
      return { initials: 'YSL', style: 'bg-neutral-950 text-white border border-neutral-800 font-serif font-black shadow-md' };
    }
    if (nameLower.includes("armani")) {
      return { initials: 'GA', style: 'bg-slate-900 text-white border border-slate-800 font-serif font-medium shadow-md' };
    }
    if (nameLower.includes("givenchy")) {
      return { initials: 'G', style: 'bg-[#111111] text-white border border-neutral-800 font-serif font-semibold shadow-md' };
    }
    if (nameLower.includes("burberry")) {
      return { initials: 'B', style: 'bg-[#dec9ab] text-[#a18a68] border border-[#a18a68] font-serif font-black shadow-md' };
    }
    if (nameLower.includes("dolce")) {
      return { initials: 'DG', style: 'bg-black text-white border border-stone-800 font-serif font-black shadow-md' };
    }
    if (nameLower.includes("fendi")) {
      return { initials: 'F', style: 'bg-[#febb11] text-black border border-yellow-600 font-serif font-black shadow-md' };
    }
    if (nameLower.includes("cartier")) {
      return { initials: 'C', style: 'bg-[#8b0000] text-[#faf9f6] border border-red-950 font-serif font-medium shadow-md' };
    }
    if (nameLower.includes("zara")) {
      return { initials: 'ZARA', style: 'bg-black text-white border border-stone-800 font-sans font-black shadow-md' };
    }
    if (nameLower.includes("mango")) {
      return { initials: 'MNG', style: 'bg-[#1a1a1a] text-[#eaeaea] font-sans font-black shadow-md' };
    }
    if (nameLower.includes("h&m") || nameLower.includes("hm")) {
      return { initials: 'HM', style: 'bg-[#e01a22] text-white font-sans font-black italic shadow-md' };
    }

    const words = (brandName || '').split(' ');
    const initials = words.map(w => w ? w[0] : '').join('').substring(0, 3).toUpperCase();
    return {
      initials: initials || 'AT',
      style: 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white border border-rose-200 font-sans font-black shadow-md'
    };
  };

  const customStoresList = [
    { name: "Victoria's Secret Spain", sector: "Pódium Logo & Gala Verano 🌸" },
    { name: "L'Oréal Group", sector: "Maquillaje & Ads de Pasarela 💄" },
    { name: "Carolina Herrera España", sector: "Sponsor de Alta Costura 👑" },
    { name: "Richemont", sector: "Relojería de Lujo 🇨🇭" }
  ];

  const modelStoresList = (models || []).map((model, idx) => {
    const brandNames = [
      'Chanel Couture', 'Gucci Atelier', 'Dior Paris', 'Prada Milano', 'Versace Collection',
      'Valentino Garavani', 'Balenciaga Studio', 'Hermès Paris', 'Saint Laurent Rive', 'Louis Vuitton Maison',
      'Armani Privé', 'Givenchy Paris', 'Burberry London', 'Dolce & Gabbana', 'Fendi Roma',
      'Cartier High Fashion', 'Rolex Special Edition', 'Tiffany & Co. Style', 'Zara Atelier', 'Mango Premium',
      'H&M Studio', 'Ralph Lauren Collection', 'Calvin Klein Luxury', 'Hugo Boss Couture', 'Lacoste Sport Chic',
      'Tommy Hilfiger Runway', 'Michael Kors Collection', 'Balmain Paris', 'Celine Studio'
    ];
    const styles = [
      'Alta Costura, Vestidos de Gala 👗',
      'Moda Casual, Ropa de Calle 👕',
      'Calzado de Pasarela y Lujo 👠',
      'Accesorios y Joyería de Diseño 💎',
      'Estilo Ejecutivo y Trajes Premium 👔',
      'Sastrería Unisex Contemporánea 👑'
    ];
    const selectedBrandName = brandNames[idx % brandNames.length];
    return {
      name: `${selectedBrandName} ${model.name}`,
      sector: styles[idx % styles.length]
    };
  });

  const allAvailableStores = [...customStoresList, ...modelStoresList];

  const filteredStores = allAvailableStores.filter(st =>
    st.name.toLowerCase().includes(newSponsorName.toLowerCase().trim())
  );
  const [newSponsorBudget, setNewSponsorBudget] = useState('15000');
  const [newSponsorLogoUrl, setNewSponsorLogoUrl] = useState<string | null>(null);
  const [newSponsorLogoFilename, setNewSponsorLogoFilename] = useState<string | null>(null);
  const [newSponsorStartDate, setNewSponsorStartDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [newSponsorEndDate, setNewSponsorEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split('T')[0];
  });
  const [newSponsorProposalText, setNewSponsorProposalText] = useState(
    'Alianza estratégica B2B para visualización preferente de logotipo en la gala de resultados finales, pasarelas de alta costura e integración de branding digital multisensorial de alto impacto en todas nuestras redes sociales asociadas.'
  );
  const [selectedContractDetail, setSelectedContractDetail] = useState<any | null>(null);
  const [newSponsorExclusivity, setNewSponsorExclusivity] = useState(false);

  const [repostedPhotos, setRepostedPhotos] = useState<{[key: string]: boolean}>(() => {
    const key = `reposted_photos_${userProfile.id}`;
    const saved = localStorage.getItem(key) || localStorage.getItem('reposted_photos');
    return saved ? JSON.parse(saved) : {};
  });

  const [bookmarkedPhotos, setBookmarkedPhotos] = useState<{[key: string]: boolean}>(() => {
    const key = `bookmarked_photos_${userProfile.id}`;
    const saved = localStorage.getItem(key) || localStorage.getItem('bookmarked_photos');
    return saved ? JSON.parse(saved) : {};
  });

  const [repostCounts, setRepostCounts] = useState<{[key: string]: number}>(() => {
    const saved = localStorage.getItem('repost_counts');
    return saved ? JSON.parse(saved) : {};
  });

  // Keep state in sync when switching profiles
  useEffect(() => {
    const keyRep = `reposted_photos_${userProfile.id}`;
    const savedRep = localStorage.getItem(keyRep) || localStorage.getItem('reposted_photos');
    setRepostedPhotos(savedRep ? JSON.parse(savedRep) : {});

    const keyBook = `bookmarked_photos_${userProfile.id}`;
    const savedBook = localStorage.getItem(keyBook) || localStorage.getItem('bookmarked_photos');
    setBookmarkedPhotos(savedBook ? JSON.parse(savedBook) : {});
  }, [userProfile.id]);

  const handleToggleRepost = (photoUrl: string) => {
    const isReposted = !!repostedPhotos[photoUrl];
    const loggedInUser = realLoggedInUser || userProfile;

    // Toggle for the logged-in user's profile
    const myRepostsKey = `reposted_photos_${loggedInUser.id}`;
    const myRepostsSaved = localStorage.getItem(myRepostsKey) || localStorage.getItem('reposted_photos');
    const myReposts = myRepostsSaved ? JSON.parse(myRepostsSaved) : {};
    
    const newMyReposts = { ...myReposts, [photoUrl]: !isReposted };
    localStorage.setItem(myRepostsKey, JSON.stringify(newMyReposts));
    localStorage.setItem('reposted_photos', JSON.stringify(newMyReposts)); // keep general fallback sync
    
    // Also toggle in current view's local state immediately for instant response
    setRepostedPhotos(prev => ({ ...prev, [photoUrl]: !isReposted }));

    const currentCount = repostCounts[photoUrl] || Math.floor((photoUrl.length % 7) + 2);
    const newCount = isReposted ? Math.max(0, currentCount - 1) : currentCount + 1;
    const newCounts = { ...repostCounts, [photoUrl]: newCount };
    setRepostCounts(newCounts);
    localStorage.setItem('repost_counts', JSON.stringify(newCounts));

    // Update posts feed so that the image/post is displayed on the logged-in user's wall (muro)
    const storageKey = `fb_posts_v3_${loggedInUser.id}`;
    
    // Load logged-in user's posts to modify
    const mySavedPostsRaw = localStorage.getItem(storageKey);
    let myPostsList: FBPost[] = mySavedPostsRaw ? JSON.parse(mySavedPostsRaw) : [];

    if (!isReposted) {
      // Find image if photoUrl is a postId
      let imgUrl = photoUrl;
      let textContent = isOwnProfile
        ? "Compartido en mi muro desde mis fotos oficiales ✨"
        : `Compartido en mi muro desde el perfil de ${userProfile.name} ✨`;
        
      const isDirectImage = photoUrl.startsWith('http') || photoUrl.startsWith('/') || photoUrl.includes('.') || photoUrl.startsWith('data:');
      
      if (!isDirectImage) {
        // Find in current viewed page's posts state
        const foundPost = posts.find(p => p.id === photoUrl);
        if (foundPost) {
          imgUrl = foundPost.image || '';
          textContent = `🔄 Reposteado: ${foundPost.content}`;
        }
      }

      // Create new timeline post representing the repost
      const newPost: FBPost = {
        id: `repost-${photoUrl}-${Date.now()}`,
        authorName: loggedInUser.name,
        authorAvatar: loggedInUser.avatar,
        authorUsername: loggedInUser.username,
        content: textContent,
        image: imgUrl || undefined,
        likes: Math.floor((photoUrl.length % 5) + 3),
        hasLiked: false,
        createdAt: 'Hace un momento',
        comments: []
      };
      
      myPostsList = [newPost, ...myPostsList];
    } else {
      // Remove any reposts associated with this photoUrl / postId from the logged-in user's posts list
      myPostsList = myPostsList.filter(p => p.id !== `repost-${photoUrl}` && !p.id.startsWith(`repost-${photoUrl}-`) && p.image !== photoUrl);
    }

    // Save back to the logged-in user's posts
    localStorage.setItem(storageKey, JSON.stringify(myPostsList));

    // If we are currently viewing our own profile, also update the active posts state so it shows up immediately
    if (isOwnProfile) {
      setPosts(myPostsList);
    }

    alert(isReposted 
      ? '🔄 ¡Has eliminado el repost de tu feed principal!'
      : '🔄 ¡Foto compartida de forma cruzada en tu feed principal de patrocinio con éxito!'
    );
  };

  const handleToggleBookmark = (photoUrl: string) => {
    const isBookmarked = !!bookmarkedPhotos[photoUrl];
    const loggedInUser = realLoggedInUser || userProfile;

    const myBookmarksKey = `bookmarked_photos_${loggedInUser.id}`;
    const myBookmarksSaved = localStorage.getItem(myBookmarksKey) || localStorage.getItem('bookmarked_photos');
    const myBookmarks = myBookmarksSaved ? JSON.parse(myBookmarksSaved) : {};
    
    const newMyBookmarks = { ...myBookmarks, [photoUrl]: !isBookmarked };
    localStorage.setItem(myBookmarksKey, JSON.stringify(newMyBookmarks));
    localStorage.setItem('bookmarked_photos', JSON.stringify(newMyBookmarks)); // keep fallback sync
    
    setBookmarkedPhotos(prev => ({ ...prev, [photoUrl]: !isBookmarked }));

    alert(isBookmarked 
      ? '💾 ¡Foto eliminada de tus colecciones de favoritos!'
      : '💾 ¡Foto agregada y guardada en tus colecciones de favoritos!'
    );
  };

  useEffect(() => {
    const handleStoriesUpdated = () => {
      const raw = localStorage.getItem('active_stories');
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setActiveStoriesList(parsed.filter((s: any) => s.expiresAt > Date.now()));
        } catch (e) {}
      }
      const savedArchived = localStorage.getItem(`archived_stories_${userProfile.id}`);
      if (savedArchived) {
        try {
          setArchivedStories(JSON.parse(savedArchived));
        } catch (e) {}
      }
    };
    window.addEventListener('stories-updated', handleStoriesUpdated);
    handleStoriesUpdated();
    return () => window.removeEventListener('stories-updated', handleStoriesUpdated);
  }, [userProfile.id]);

  // Comments & Posts List State
  const [posts, setPosts] = useState<FBPost[]>([]);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [activePostMenuId, setActivePostMenuId] = useState<string | null>(null);
  const [newCommentInput, setNewCommentInput] = useState<{[key: string]: string}>({});
  const [activeSocialModal, setActiveSocialModal] = useState<'followers' | 'following' | 'friends' | null>(initialSocialModal || null);

  useEffect(() => {
    if (initialSocialModal !== undefined) {
      setActiveSocialModal(initialSocialModal);
    }
  }, [initialSocialModal]);

  const handleSetSocialModal = (modal: 'followers' | 'following' | 'friends' | null) => {
    setActiveSocialModal(modal);
    if (onSocialModalChange) {
      onSocialModalChange(modal);
    }
  };

  // Photo Lightbox Interactive States
  const [selectedPhotoForLightbox, setSelectedPhotoForLightbox] = useState<string | null>(null);
  const [hoveredPhotoUrl, setHoveredPhotoUrl] = useState<string | null>(null);
  const [hoveredPhotoUrlLightbox, setHoveredPhotoUrlLightbox] = useState<boolean>(false);
  const [lightboxCommentText, setLightboxCommentText] = useState('');
  const [photoInteractions, setPhotoInteractions] = useState<PhotoInteractionsMap>(() => {
    const saved = localStorage.getItem('coll_photo_interactions');
    return saved ? JSON.parse(saved) : {};
  });

  // Synced User Coins (Ages from 'casting_live_coins_qty' just like CastingLiveSection)
  const [liveUserCoins, setLiveUserCoins] = useState(() => {
    const cached = localStorage.getItem('casting_live_coins_qty');
    return cached ? parseInt(cached, 10) : 2788;
  });

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

  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveEmojiPicker(null);
      setActiveShareMenuPostId(null);
    };
    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  // Active photo being gifted with Extra Canal Gifts centered modal
  const [activeGiftingPhotoUrl, setActiveGiftingPhotoUrl] = useState<string | null>(null);
  const [hoveredHeartAndGiftPhotoUrl, setHoveredHeartAndGiftPhotoUrl] = useState<string | null>(null);

  // Confirmation states for customized gift with optional text message
  const [selectedGiftForConfirm, setSelectedGiftForConfirm] = useState<{ name: string, icon: string, cost: number } | null>(null);
  const [giftConfirmPhotoUrl, setGiftConfirmPhotoUrl] = useState<string | null>(null);
  const [giftCustomMessage, setGiftCustomMessage] = useState<string>('');
  const [activeShareMenuPostId, setActiveShareMenuPostId] = useState<string | null>(null);

  // States for comment replies (responder en los comentarios)
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyInputText, setReplyInputText] = useState<string>('');
  const [activeEmojiPicker, setActiveEmojiPicker] = useState<{ type: 'post' | 'reply' | 'photo'; id: string } | null>(null);
  const POPULAR_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🔥', '👏', '💖', '🙌', '💵', '🎉', '💯', '🥳', '😍', '💬', '💪', '✨', '👑', '💄', '👗', '👠', '🌹', '🥂'];
  const emojiPickerTimeoutRef = React.useRef<any>(null);
  const highlightsSliderRef = React.useRef<HTMLDivElement>(null);

  const handleEmojiPickerMouseEnter = (type: 'post' | 'reply' | 'photo', id: string) => {
    if (emojiPickerTimeoutRef.current) {
      clearTimeout(emojiPickerTimeoutRef.current);
      emojiPickerTimeoutRef.current = null;
    }
    setActiveEmojiPicker({ type, id });
  };

  const handleEmojiPickerMouseLeave = () => {
    if (emojiPickerTimeoutRef.current) {
      clearTimeout(emojiPickerTimeoutRef.current);
    }
    emojiPickerTimeoutRef.current = setTimeout(() => {
      setActiveEmojiPicker(null);
    }, 800); // 800ms safety window
  };

  // Custom timeout to keep gifts popover visible when moving cursor from trigger to popover
  const giftHoverTimeoutRef = React.useRef<any>(null);

  const [hoveredStickersPostId, setHoveredStickersPostId] = useState<string | null>(null);
  const stickersHoverTimeoutRef = React.useRef<any>(null);

  const [screenRainParticles, setScreenRainParticles] = useState<{ id: string; emoji: string; left: number; top: number; size: number; delay: number; duration: number }[]>([]);

  const handleStickersMouseEnter = (postId: string) => {
    if (stickersHoverTimeoutRef.current) {
      clearTimeout(stickersHoverTimeoutRef.current);
      stickersHoverTimeoutRef.current = null;
    }
    setHoveredStickersPostId(postId);
  };

  const handleStickersMouseLeave = () => {
    if (stickersHoverTimeoutRef.current) {
      clearTimeout(stickersHoverTimeoutRef.current);
    }
    stickersHoverTimeoutRef.current = setTimeout(() => {
      setHoveredStickersPostId(null);
    }, 800); // 800ms safety window
  };

  // Cute WhatsApp-style love/good-morning emojis/stickers from com.emoji.stickers.wasticker...
  // Represented beautifully with individual emojis for stacked overlays and gorgeous screen rain!
  const STICKER_PACK = [
    { emojis: ['🥰', '🌹'], label: 'Con rosa' },
    { emojis: ['😍'], label: 'Me encanta' },
    { emojis: ['😘'], label: 'Beso amor' },
    { emojis: ['🥰', '❤️'], label: 'Abrazo' },
    { emojis: ['🧸', '💖'], label: 'Osito' },
    { emojis: ['💐'], label: 'Ramo' },
    { emojis: ['☕'], label: 'Café' },
    { emojis: ['😴'], label: 'Descanso' },
    { emojis: ['💖'], label: 'Te quiero' },
    { emojis: ['🥺'], label: 'Te extraño' },
    { emojis: ['👋'], label: 'Hola' },
    { emojis: ['😔'], label: 'Lo siento' }
  ];

  const STICKER_PILLS = [
    { emoji: '💖', label: 'TE QUIERO' },
    { emoji: '🥺', label: 'TE EXTRAÑO' },
    { emoji: '👋', label: 'HOLA' },
    { emoji: '😔', label: 'LO SIENTO' }
  ];

  const spawnScreenRain = (emojiString: string) => {
    // Correctly splits surrogate pair emojis into individual strings
    const emojis = Array.from(emojiString.trim().split(' ')[0] || emojiString.trim());
    if (emojis.length === 0) return;

    const newRain = Array.from({ length: 65 }).map((_, i) => {
      const chosenEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      return {
        id: `rain-${Date.now()}-${i}-${Math.random()}`,
        emoji: chosenEmoji,
        left: Math.random() * 100, // percentage of viewport width
        top: -15 - Math.random() * 20, // starts above top edge
        size: 24 + Math.random() * 28, // nice large size
        delay: Math.random() * 1.8, // staggered entrance for full shower effect
        duration: 3.0 + Math.random() * 2.5 // fall speed
      };
    });
    setScreenRainParticles(prev => [...prev, ...newRain]);
  };

  React.useEffect(() => {
    if (screenRainParticles.length > 0) {
      const timer = setTimeout(() => {
        setScreenRainParticles(prev => prev.filter(item => {
          const timestamp = parseFloat(item.id.split('-')[1]);
          return Date.now() - timestamp < 7000;
        }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [screenRainParticles]);

  const handleStickerReactToPost = (postId: string, stickerEmoji: string, e?: React.MouseEvent) => {
    const cleanEmoji = stickerEmoji.split(' ')[0] || stickerEmoji;
    spawnEmojiParticles(cleanEmoji);
    spawnScreenRain(stickerEmoji);

    const updated = posts.map(p => {
      if (p.id === postId) {
        const nextHasLiked = true;
        const nextLikes = p.hasLiked ? p.likes : p.likes + 1;
        
        const stickerComment: FBComment = {
          id: `comm-sticker-${Date.now()}`,
          authorName: userProfile.name,
          authorAvatar: userProfile.avatar,
          text: `Reaccionó con el sticker: ${stickerEmoji}`,
          date: 'Hace un momento'
        };

        return {
          ...p,
          likes: nextLikes,
          hasLiked: nextHasLiked,
          comments: [...p.comments, stickerComment]
        };
      }
      return p;
    });

    setPosts(updated);
    localStorage.setItem(`fb_posts_v3_${userProfile.id}`, JSON.stringify(updated));

    if (currentModel) {
      const alreadyLiked = posts.find(p => p.id === postId)?.hasLiked;
      const updatedModels = models.map(m => {
        if (m.id === currentModel.id) {
          return {
            ...m,
            totalLikes: alreadyLiked ? m.totalLikes : m.totalLikes + 1
          };
        }
        return m;
      });
      onUpdateModels(updatedModels);
      localStorage.setItem('casting_models_data', JSON.stringify(updatedModels));
    }
  };

  const handleStickerReactToPhoto = (photoUrl: string, stickerEmoji: string, e?: React.MouseEvent) => {
    const cleanEmoji = stickerEmoji.split(' ')[0] || stickerEmoji;
    spawnEmojiParticles(cleanEmoji);
    spawnScreenRain(stickerEmoji);

    const current = photoInteractions[photoUrl] || getPhotoInteraction(photoUrl);
    const hasLiked = !!current.likes[userProfile.id];
    
    const nextLikes = { ...current.likes };
    const nextReactions = current.reactions ? { ...current.reactions } : {};
    let nextLikeCount = current.likeCount;

    nextReactions[userProfile.id] = cleanEmoji;
    
    if (!hasLiked) {
      nextLikes[userProfile.id] = true;
      nextLikeCount += 1;
    }

    const stickerComment = {
      id: `comm-sticker-${Date.now()}`,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      text: `Reaccionó con el sticker: ${stickerEmoji}`,
      date: 'Hace un momento'
    };

    const updatedInteractions = {
      ...photoInteractions,
      [photoUrl]: {
        ...current,
        likes: nextLikes,
        reactions: nextReactions,
        likeCount: nextLikeCount,
        comments: [...(current.comments || []), stickerComment]
      }
    };

    setPhotoInteractions(updatedInteractions);
    localStorage.setItem('coll_photo_interactions', JSON.stringify(updatedInteractions));
  };

  const handleGiftMouseEnter = (photoUrl: string) => {
    if (giftHoverTimeoutRef.current) {
      clearTimeout(giftHoverTimeoutRef.current);
      giftHoverTimeoutRef.current = null;
    }
    setHoveredHeartAndGiftPhotoUrl(photoUrl);
  };

  const handleGiftMouseLeave = () => {
    if (giftHoverTimeoutRef.current) {
      clearTimeout(giftHoverTimeoutRef.current);
    }
    giftHoverTimeoutRef.current = setTimeout(() => {
      setHoveredHeartAndGiftPhotoUrl(null);
    }, 800); // 800ms safety window to smoothly bridge distance between trigger details and popover
  };

  // Extra gifts list exactly matching image.png with complete custom list requested by user
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
    { name: 'Collar de oro 18k', icon: '⛓️', cost: 1800 },
    { name: 'Un viaje', icon: '✈️', cost: 5000 },
    { name: 'Un coche', icon: '🚗', cost: 50000 },
    { name: 'Una casa', icon: '🏡', cost: 100000 },
    { name: 'Una copa', icon: '🍷', cost: 5 },
    { name: 'Anillo diamantes', icon: '💍', cost: 3500 },
    { name: 'Gafas de moda', icon: '🕶️', cost: 400 },
    { name: 'Vestido de moda', icon: '👗', cost: 100 },
    { name: 'Un avión', icon: '🛩️', cost: 1000000 },
    { name: 'Dos Alas de ángel', icon: '🪽', cost: 2 },
    { name: 'Ala de ángel VS', icon: '🪽', cost: 1 },
    { name: 'Collar de oro', icon: '🎗️', cost: 100 },
    { name: 'Collar de perlas', icon: '📿', cost: 80 },
    { name: 'Vestido de gala', icon: '💃', cost: 3000 },
    { name: 'Zapatos costura', icon: '👠', cost: 800 },
    { name: 'Ramo de rosas', icon: '💐', cost: 20 },
    { name: 'Bolígrafo de oro', icon: '✒️', cost: 10 },
    { name: 'Reloj', icon: '⏰', cost: 100000 },
    { name: 'Una moneda de oro', icon: '🪙', cost: 2 },
    { name: 'Varias monedas de oro', icon: '💰', cost: 5 },
    { name: 'Tesoro de monedas', icon: '🪙', cost: 10 },
    { name: 'Cena de lujo', icon: '🍽️', cost: 250 },
    { name: 'Manos juntas', icon: '🙏', cost: 1 },
    { name: 'Café', icon: '☕', cost: 2 }
  ];

  // Gift transaction handler
  const handleGiftPhoto = (photoUrl: string, gift: { name: string, icon: string, cost: number }, customMessage?: string): boolean => {
    const senderProfile = realLoggedInUser || userProfile;
    if (!senderProfile) return false;

    // 1 Coin = 1.00€ as requested (800 coins = 800€)
    const euroCost = Number((gift.cost * 1.0).toFixed(2));

    if (liveUserCoins < gift.cost) {
      // Spawn particles effect shower of the same icon chosen
      spawnEmojiParticles(gift.icon);
      alert(`⚠️ No tienes saldo suficiente para comprar este regalo.\n\nEl regalo "${gift.name}" cuesta 🪙 ${gift.cost} monedas, pero tu saldo actual es de 🪙 ${liveUserCoins} monedas.`);
      return false;
    }

    if (senderProfile.balance < euroCost) {
      spawnEmojiParticles(gift.icon);
      alert(`⚠️ No tienes saldo suficiente en tu portafolio para comprar este regalo.\n\nCuesta ${euroCost.toFixed(2)}€, pero tu saldo es de ${senderProfile.balance.toFixed(2)}€.`);
      return false;
    }
    
    const nextCoins = liveUserCoins - gift.cost;
    setLiveUserCoins(nextCoins);
    localStorage.setItem('casting_live_coins_qty', nextCoins.toString());

    // Deduct Euro equivalent from the user's main backoffice balance
    const updatedSender = {
      ...senderProfile,
      balance: Number((senderProfile.balance - euroCost).toFixed(2)),
      totalInvested: Number((senderProfile.totalInvested + euroCost).toFixed(2))
    };
    if (onUpdateProfile) {
      onUpdateProfile(updatedSender);
    }

    // Close the popover and active modal immediately upon selecting/sending a gift successfully
    setHoveredHeartAndGiftPhotoUrl(null);
    setActiveGiftingPhotoUrl(null);

    // Update photo interaction object in active state and localStorage
    const current = photoInteractions[photoUrl] || getPhotoInteraction(photoUrl);
    const nextLikes = { ...current.likes };
    const nextReactions = current.reactions ? { ...current.reactions } : {};
    let nextLikeCount = current.likeCount + 1;
    
    nextLikes[senderProfile.id] = true;
    nextReactions[senderProfile.id] = gift.icon;

    // Push automatic comment in the photo
    const newGiftComment = {
      id: `photo-comm-gift-${Date.now()}`,
      authorName: senderProfile.name,
      authorAvatar: senderProfile.avatar,
      text: `🎁 Enviado Regalo Extra: ¡${gift.name}! (${gift.icon})${customMessage ? ` - Mensaje: "${customMessage}"` : ''}`,
      date: 'Hace un momento'
    };

    const updatedInteractions = {
      ...photoInteractions,
      [photoUrl]: {
        ...current,
        likes: nextLikes,
        reactions: nextReactions,
        likeCount: nextLikeCount,
        comments: [...current.comments, newGiftComment]
      }
    };

    setPhotoInteractions(updatedInteractions);
    localStorage.setItem('coll_photo_interactions', JSON.stringify(updatedInteractions));

    // Dispatch floating heart rain with gift icon!
    window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
      detail: { icon: gift.icon, x: window.innerWidth / 2, y: window.innerHeight / 2 }
    }));

    // Send direct message to the model so they receive a real record
    if (onSendMessage) {
      onSendMessage({
        id: `msg-gift-${Date.now()}`,
        senderId: senderProfile.id,
        receiverId: userProfile.id,
        text: `🎁 ¡Te he enviado un regalo extra! **${gift.name}** ${gift.icon} (Cantidad: 🪙 ${gift.cost} monedas / ${euroCost.toFixed(2)}€).${customMessage ? `\n\nMensaje adjunto:\n"${customMessage}"` : '\n\nEnviado sin mensaje adjunto.'}`,
        timestamp: new Date().toISOString()
      });
    }

    alert(`🎁 ¡Regalo "${gift.name}" ${gift.icon} enviado con éxito! -${gift.cost} monedas and -${euroCost.toFixed(2)}€ de tu portafolio de inversión.\n\nEl Modelo recibirá un aviso de que en el botón mensajes tiene el mensaje del usuario que le hizo el regalo con el tipo de regalo y la cantidad (🪙 ${gift.cost} monedas).`);
    return true;
  };

  // Reply handler for comment replies (responder en los comentarios)
  const handleSendReply = (commentId: string, parentId: string | null, isPhotoComment: boolean) => {
    if (!parentId || !replyInputText.trim()) return;

    const sender = realLoggedInUser || userProfile;
    const newReply: FBComment = {
      id: `reply-${Date.now()}`,
      authorName: sender.name,
      authorAvatar: sender.avatar,
      text: replyInputText.trim(),
      date: 'Hace un momento'
    };

    if (isPhotoComment) {
      // Photo Lightbox Comment
      const current = photoInteractions[parentId] || getPhotoInteraction(parentId);
      const updatedComments = current.comments.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply]
          };
        }
        return c;
      });

      const updatedInteractions = {
        ...photoInteractions,
        [parentId]: {
          ...current,
          comments: updatedComments
        }
      };
      setPhotoInteractions(updatedInteractions);
      localStorage.setItem('coll_photo_interactions', JSON.stringify(updatedInteractions));
    } else {
      // Post Comment
      const updated = posts.map(p => {
        if (p.id === parentId) {
          const updatedComments = p.comments.map(c => {
            if (c.id === commentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newReply]
              };
            }
            return c;
          });
          return {
            ...p,
            comments: updatedComments
          };
        }
        return p;
      });
      setPosts(updated);
      localStorage.setItem(`fb_posts_v3_${userProfile.id}`, JSON.stringify(updated));
    }

    // Reset state
    setReplyInputText('');
    setReplyingToCommentId(null);
    setActiveEmojiPicker(null);
  };

  // Unified Action Row mimicking image.png exactly
  const renderHighFidelityActionRow = (
    id: string,
    likesCount: number,
    commentsCount: number,
    repostsCount: number,
    isLiked: boolean,
    isBookmarked: boolean,
    isReposted: boolean,
    onLikeClick: (e: React.MouseEvent) => void,
    onGiftClick: (e: React.MouseEvent) => void,
    onCommentClick: (e: React.MouseEvent) => void,
    onRepostClick: (e: React.MouseEvent) => void,
    onShareClick: (e: React.MouseEvent) => void,
    onBookmarkClick: (e: React.MouseEvent) => void,
    hoverKey?: string
  ) => {
    const hasImageContext = id.startsWith('http') || id.startsWith('/') || id.includes('.') || !!hoverKey;

    return (
      <div className="relative py-2.5 px-3 flex items-center justify-between bg-white select-none border-t border-slate-100 rounded-b-2xl shadow-xs shrink-0">
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          
          {/* Cash reaction + gift area */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="relative">
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  onLikeClick(e);
                }}
                onMouseEnter={() => {
                  if (id) {
                    handleStickersMouseEnter(id);
                  }
                }}
                onMouseLeave={() => {
                  if (id) {
                    handleStickersMouseLeave();
                  }
                }}
                className="flex items-center gap-1.5 bg-[#ffeef2] hover:bg-[#ffd5df] active:scale-95 px-3 py-1.5 rounded-full cursor-pointer transition-all border border-pink-100/50"
              >
                <span className="text-xs select-none">💵</span>
                <span className="text-[12px] font-extrabold text-slate-800 leading-none">{likesCount}</span>
              </div>

              {/* STICKERS HOVER POPUP */}
              {hoveredStickersPostId === id && !hasImageContext && (
                <div 
                  onMouseEnter={() => {
                    if (id) handleStickersMouseEnter(id);
                  }}
                  onMouseLeave={() => {
                    if (id) handleStickersMouseLeave();
                  }}
                  className="absolute bottom-full left-0 mb-2.5 bg-[#12151e]/98 backdrop-blur-md border border-zinc-700/60 shadow-2xl rounded-2xl p-3.5 z-[250] w-72 text-left animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-[10px] text-pink-400 font-extrabold uppercase tracking-widest mb-3.5 font-sans flex items-center gap-1.5">
                    💝 STICKERS EXCLUSIVOS DE AMOR
                  </div>
                  
                  {/* Grid of cute stickers matching screenshots exactly */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {STICKER_PACK.map((sticker, sIdx) => {
                      const fullEmojiStr = sticker.emojis.join('');
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const isPhoto = id.startsWith('http') || id.startsWith('/') || id.includes('.');
                            if (isPhoto) {
                              handleStickerReactToPhoto(id, fullEmojiStr, e);
                            } else {
                              handleStickerReactToPost(id, fullEmojiStr, e);
                            }
                            setHoveredStickersPostId(null);
                          }}
                          className="flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg bg-white hover:bg-rose-50/30 hover:border-rose-200 active:scale-95 transition border border-zinc-200/60 cursor-pointer w-full aspect-square shadow-[0_2px_4px_rgba(0,0,0,0.03)]"
                        >
                          <div className="relative flex flex-col items-center justify-center h-8 sm:h-10 w-full">
                            {sticker.emojis.length > 1 ? (
                              <div className="relative h-9 w-9 flex items-center justify-center">
                                <span className="text-2xl absolute top-0 left-0.5 transform -rotate-12 select-none z-10">
                                  {sticker.emojis[0]}
                                </span>
                                <span className="text-2xl absolute bottom-0 right-0.5 transform rotate-12 select-none z-20">
                                  {sticker.emojis[1]}
                                </span>
                              </div>
                            ) : (
                              <span className="text-2xl select-none">
                                {sticker.emojis[0]}
                              </span>
                            )}
                          </div>
                          <span className="text-[8.5px] font-extrabold text-zinc-400 tracking-tight leading-none mt-1 truncate max-w-full text-center uppercase">
                            {sticker.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Text buttons list at bottom for zazas.png text-only / phrase badges in 2x2 grid */}
                  <div className="mt-3 pt-3 border-t border-zinc-800/80 grid grid-cols-2 gap-2">
                    {STICKER_PILLS.map((sticker, sIdx) => (
                      <button
                        key={`text-st-${sIdx}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          const isPhoto = id.startsWith('http') || id.startsWith('/') || id.includes('.');
                          if (isPhoto) {
                            handleStickerReactToPhoto(id, `${sticker.emoji} ${sticker.label}`, e);
                          } else {
                            handleStickerReactToPost(id, `${sticker.emoji} ${sticker.label}`, e);
                          }
                          setHoveredStickersPostId(null);
                        }}
                        className="px-2.5 py-1.5 rounded-full text-[9px] font-black tracking-wider bg-[#1a1f2e] hover:bg-[#252c41] text-zinc-100 border border-zinc-700/50 cursor-pointer shadow-md hover:scale-105 active:scale-95 transition flex items-center justify-center gap-1.5 select-none font-sans uppercase"
                      >
                        <span className="text-sm select-none">{sticker.emoji}</span>
                        <span className="leading-none">{sticker.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Subtitle */}
                  <div className="text-[7.5px] text-zinc-400 text-center font-mono mt-3.5 leading-none uppercase tracking-wide">
                    Presiona un sticker para enviar al instante
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onGiftClick(e);
                }}
                onMouseEnter={() => {
                  handleGiftMouseEnter(hoverKey || id);
                }}
                onMouseLeave={() => {
                  handleGiftMouseLeave();
                }}
                className="text-pink-500 hover:text-pink-600 hover:scale-110 active:scale-90 transition p-1 cursor-pointer flex items-center justify-center shrink-0"
                title="Regalos Extra del Canal"
              >
                <Gift className="w-5 h-5 text-pink-500 stroke-[1.8]" />
              </button>

              {/* GIFTS HOVER POPUP */}
              {hoveredHeartAndGiftPhotoUrl === (hoverKey || id) && !hasImageContext && (
                <div 
                  onMouseEnter={() => {
                    handleGiftMouseEnter(hoverKey || id);
                  }}
                  onMouseLeave={() => {
                    handleGiftMouseLeave();
                  }}
                  className="absolute bottom-full left-[-40px] mb-2.5 bg-[#12151e]/98 backdrop-blur-md border border-zinc-700/60 shadow-2xl rounded-2xl p-3.5 z-[250] w-72 text-left animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/80 shrink-0">
                    <span className="text-yellow-400 font-extrabold text-[10px] tracking-wider uppercase flex items-center gap-1.5 select-none font-sans">
                      🎁 REGALOS EXTRA DEL CANAL
                    </span>
                    <span className="text-[9px] bg-zinc-800 text-yellow-350 font-black px-1.5 py-0.5 rounded font-mono">
                      🪙 {liveUserCoins}
                    </span>
                  </div>

                  {/* Grid matching image.png exactly with white rounded gift cards */}
                  <div className="grid grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                    {EXTRA_GIFTS.map((gift, gIdx) => (
                      <button
                        key={gIdx}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedGiftForConfirm(gift);
                          setGiftConfirmPhotoUrl(hoverKey || id);
                          setActiveGiftingPhotoUrl(hoverKey || id);
                          setGiftCustomMessage('');
                        }}
                        className="group/gift relative flex flex-col items-center justify-center bg-white hover:bg-rose-50 border border-slate-200 hover:border-pink-500 p-2 rounded-lg aspect-square w-full h-auto transition duration-150 text-center cursor-pointer select-none shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
                      >
                        <span className="text-2xl filter drop-shadow hover:scale-115 transition transform duration-150">
                          {gift.icon}
                        </span>
                        <span className="text-[8.5px] font-black text-slate-800 mt-1.5 truncate w-full px-0.5 leading-tight select-none uppercase">
                          {gift.name.length > 10 ? `${gift.name.substring(0, 9).toUpperCase()}...` : gift.name.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-0.5 mt-1 select-none shrink-0 leading-none">
                          <span className="text-[8px] font-extrabold text-amber-600 font-mono">
                            🪙 {gift.cost}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="text-[8.5px] text-zinc-400 text-center mt-2.5 leading-none uppercase tracking-wide shrink-0 pt-2.5 border-t border-zinc-800/80 font-mono">
                    Presiona para enviar instantáneamente · Tu saldo: 🪙 {liveUserCoins}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comment Bubble trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCommentClick(e);
            }}
            className="flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer text-slate-800 group shrink-0"
            title="Ver comentarios"
          >
            <MessageSquare className="w-5 h-5 text-slate-800 group-hover:text-pink-500 transition-colors stroke-[1.8]" />
            <span className="text-[12px] font-extrabold text-pink-600 leading-none">{commentsCount}</span>
          </button>

          {/* Repost loops trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRepostClick(e);
            }}
            className={`flex items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer group shrink-0 ${
              isReposted ? 'text-pink-600 font-bold bg-rose-50/20' : 'text-slate-800'
            }`}
            title="Compartir en mi muro"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5 text-slate-800 group-hover:text-pink-500 transition-colors">
              <path d="M17 1l4 4-4 4" />
              <path d="M3 11V9a4 4 0 014-4h14" />
              <path d="M7 23l-4-4 4-4" />
              <path d="M21 13v2a4 4 0 01-4 4H3" />
            </svg>
          </button>

          {/* Paper Plane Send trigger with floating options menu */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShareClick(e);
              }}
              className={`hover:scale-110 active:scale-90 transition p-1.5 rounded-full cursor-pointer flex items-center justify-center shrink-0 ${
                activeShareMenuPostId === id ? 'text-pink-600 bg-pink-50' : 'text-slate-800'
              }`}
              title="Enviar por mensaje privado"
            >
              <Send className="w-5 h-5 -rotate-12 hover:text-pink-500 transition-colors stroke-[1.8]" />
            </button>
          </div>

          {/* Three Pink Dots indicator */}
          <div className="flex gap-1 items-center px-1 select-none shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: '200ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-pink-300 animate-pulse" style={{ animationDelay: '400ms' }} />
          </div>

        </div>

        {/* Bookmark Ribbon on far right */}
        <div className="shrink-0 mr-1.5 sm:mr-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkClick(e);
            }}
            className={`hover:scale-110 active:scale-90 p-1.5 rounded-full transition-all cursor-pointer ${
              isBookmarked ? 'text-pink-600' : 'text-slate-800 hover:text-pink-500'
            }`}
            title="Guardar"
          >
            <Bookmark className="w-5 h-5 stroke-[1.8]" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    );
  };

  // Renderer helper for beautiful interactive stickers popover on hover matching z.png perfectly
  const renderStickersPopover = (id: string, contextUrl: string, isLightbox = false) => {
    return (
      <div 
        className={`absolute inset-0 bg-[#12151e]/98 backdrop-blur-md p-3.5 sm:p-4 shadow-2xl z-[150] flex flex-col justify-between select-none text-left animate-fade-in border border-zinc-700/60 ${
          isLightbox ? 'rounded-none' : 'rounded-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => {
          if (id) handleStickersMouseEnter(id);
        }}
        onMouseLeave={() => {
          if (id) handleStickersMouseLeave();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/80 shrink-0">
          <span className="text-pink-400 font-extrabold text-[10px] tracking-wider uppercase flex items-center gap-1.5 select-none font-sans">
            💝 STICKERS EXCLUSIVOS DE AMOR
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setHoveredStickersPostId(null);
            }}
            className="w-5 h-5 rounded-full bg-zinc-850 hover:bg-zinc-750 text-zinc-300 hover:text-white flex items-center justify-center transition cursor-pointer text-[10px] font-bold border border-zinc-800"
            title="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Grid of cute stickers matching screenshots exactly with identical shapes and sizes */}
        <div className="grid grid-cols-4 gap-2.5 grow overflow-y-auto pr-1 scrollbar-thin my-1.5">
          {STICKER_PACK.map((sticker, sIdx) => {
            const fullEmojiStr = sticker.emojis.join('');
            return (
              <button
                key={sIdx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const isPhoto = id.startsWith('http') || id.startsWith('/') || id.includes('.');
                  if (isPhoto) {
                    handleStickerReactToPhoto(id, fullEmojiStr, e);
                  } else {
                    handleStickerReactToPost(id, fullEmojiStr, e);
                  }
                  setHoveredStickersPostId(null);
                }}
                className="flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-lg bg-white hover:bg-rose-50/30 hover:border-rose-200 active:scale-95 transition border border-zinc-200/60 cursor-pointer w-full aspect-square shadow-[0_2px_4px_rgba(0,0,0,0.03)]"
              >
                <div className="relative flex items-center justify-center h-6 sm:h-8 w-full">
                  {sticker.emojis.length > 1 ? (
                    <div className="relative h-8 w-8 flex items-center justify-center">
                      <span className="text-xl sm:text-2xl absolute top-0 left-0.5 select-none z-10">
                        {sticker.emojis[0]}
                      </span>
                      <span className="text-xl sm:text-2xl absolute bottom-0 right-0.5 select-none z-20">
                        {sticker.emojis[1]}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl sm:text-2xl select-none">
                      {sticker.emojis[0]}
                    </span>
                  )}
                </div>
                <span className="text-[7.5px] sm:text-[8.5px] font-extrabold text-zinc-400 tracking-tight leading-none mt-1 truncate max-w-full text-center uppercase">
                  {sticker.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Text buttons list at bottom for zazas.png text-only / phrase badges in 2x2 grid */}
        <div className="mt-2.5 pt-2.5 border-t border-zinc-800/80 grid grid-cols-2 gap-2 shrink-0">
          {STICKER_PILLS.map((sticker, sIdx) => (
            <button
              key={`text-st-${sIdx}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                const isPhoto = id.startsWith('http') || id.startsWith('/') || id.includes('.');
                if (isPhoto) {
                  handleStickerReactToPhoto(id, `${sticker.emoji} ${sticker.label}`, e);
                } else {
                  handleStickerReactToPost(id, `${sticker.emoji} ${sticker.label}`, e);
                }
                setHoveredStickersPostId(null);
              }}
              className="px-2.5 py-1.5 rounded-full text-[9px] font-black tracking-wider bg-[#1a1f2e] hover:bg-[#252c41] text-zinc-100 border border-zinc-700/50 cursor-pointer shadow-md hover:scale-105 active:scale-95 transition flex items-center justify-center gap-1.5 select-none font-sans uppercase"
            >
              <span className="text-sm select-none">{sticker.emoji}</span>
              <span className="leading-none">{sticker.label}</span>
            </button>
          ))}
        </div>

        {/* Subtitle */}
        <div className="text-[7.5px] text-zinc-400 text-center font-mono mt-2.5 leading-none uppercase tracking-wide shrink-0">
          Presiona un sticker para enviar al instante
        </div>
      </div>
    );
  };

  // Renderer helper for beautiful full-size share overlay matching the size of the background image card container
  const renderShareOverlay = (postId: string, imageUrl: string) => {
    return (
      <div 
        className="absolute inset-0 bg-white/95 rounded-t-2xl z-[100] flex flex-col justify-between p-4 sm:p-5 select-none animate-fade-in text-left border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Block */}
        <div className="pb-2 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="text-left">
            <h4 className="text-xs font-black text-pink-600 uppercase tracking-wider flex items-center gap-1.5 leading-none">
              <span>📤</span> COMPARTIR PUBLICACIÓN
            </h4>
            <span className="text-[9px] text-slate-400 font-mono mt-1.5 block leading-none">
              Selecciona una red para enviar
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveShareMenuPostId(null);
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer border-none flex items-center justify-center shrink-0"
            title="Cerrar compartir"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Buttons List */}
        <div className="flex-1 flex flex-col justify-center py-2 space-y-1.5 max-h-[220px] overflow-y-auto scrollbar-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onLaunchChat) {
                onLaunchChat(userProfile.id, imageUrl);
              } else {
                alert('💬 Abriendo chat privado para compartir...');
              }
              setActiveShareMenuPostId(null);
            }}
            className="w-full text-left py-1.5 px-2.5 hover:bg-pink-50 text-slate-800 hover:text-pink-600 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-100 bg-white shadow-3xs"
          >
            <span className="text-base font-emoji">✉️</span>
            <span>Compartir en mensajes</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://t.me/share/url?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent('¡Mira esta increíble publicación!')}`, '_blank');
              setActiveShareMenuPostId(null);
            }}
            className="w-full text-left py-1.5 px-2.5 hover:bg-sky-50 text-slate-800 hover:text-sky-600 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-100 bg-white shadow-3xs"
          >
            <span className="text-base font-emoji">✈️</span>
            <span>Compartir por Telegram</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`, '_blank');
              setActiveShareMenuPostId(null);
            }}
            className="w-full text-left py-1.5 px-2.5 hover:bg-blue-50 text-slate-800 hover:text-blue-600 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-100 bg-white shadow-3xs"
          >
            <span className="text-base font-emoji">👥</span>
            <span>Compartir por Facebook</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent('¡Mira esta foto oficial de ' + userProfile.name + '! ' + imageUrl)}`, '_blank');
              setActiveShareMenuPostId(null);
            }}
            className="w-full text-left py-1.5 px-2.5 hover:bg-emerald-50 text-slate-800 hover:text-emerald-600 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-100 bg-white shadow-3xs"
          >
            <span className="text-base font-emoji">💬</span>
            <span>Compartir por WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.clipboard) {
                navigator.clipboard.writeText(imageUrl);
                alert('📋 ¡Enlace copiado al portapapeles!');
              } else {
                alert('📋 Enlace de la publicación: ' + imageUrl);
              }
              setActiveShareMenuPostId(null);
            }}
            className="w-full text-left py-1.5 px-2.5 hover:bg-slate-50 text-slate-800 hover:text-slate-900 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-100 bg-white shadow-3xs"
          >
            <span className="text-base font-emoji">🔗</span>
            <span>Copiar Enlace de Foto</span>
          </button>
        </div>
      </div>
    );
  };

  // Renderer helper for beautiful interactive gifts popover on hover matching image.png perfectly
  const renderGiftsPopover = (photoUrl: string, isLightbox = false) => {
    return (
      <div 
        className={`absolute inset-0 bg-[#12151e]/98 backdrop-blur-md p-3.5 sm:p-4 shadow-2xl z-[150] flex flex-col justify-between select-none text-left animate-fade-in border border-zinc-700/60 ${
          isLightbox ? 'rounded-none' : 'rounded-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => handleGiftMouseEnter(photoUrl)}
        onMouseLeave={handleGiftMouseLeave}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/80 shrink-0">
          <span className="text-yellow-400 font-extrabold text-[10px] tracking-wider uppercase flex items-center gap-1.5 select-none font-sans">
            🎁 REGALOS EXTRA DEL CANAL
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] bg-zinc-800 text-yellow-350 font-black px-1.5 py-0.5 rounded font-mono">
              🪙 {liveUserCoins}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setActiveGiftingPhotoUrl(null);
                setHoveredHeartAndGiftPhotoUrl(null);
              }}
              className="w-5 h-5 rounded-full bg-zinc-850 hover:bg-zinc-750 text-zinc-300 hover:text-white flex items-center justify-center transition cursor-pointer text-[10px] font-bold border border-zinc-800"
              title="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Grid matching image.png exactly with white rounded gift cards */}
        <div className="grid grid-cols-3 gap-2 overflow-y-auto pr-1 scrollbar-thin grow h-0">
          {EXTRA_GIFTS.map((gift, gIdx) => (
            <button
              key={gIdx}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedGiftForConfirm(gift);
                setGiftConfirmPhotoUrl(photoUrl);
                setGiftCustomMessage('');
              }}
              className="group/gift relative flex flex-col items-center justify-center bg-white hover:bg-rose-50 border border-slate-200 hover:border-pink-500 p-2 rounded-[18px] transition duration-150 text-center cursor-pointer select-none shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
            >
              <span className="text-2xl filter drop-shadow hover:scale-115 transition transform duration-150">
                {gift.icon}
              </span>
              <span className="text-[8.5px] font-black text-slate-800 mt-1.5 truncate w-full px-0.5 leading-tight select-none uppercase">
                {gift.name.length > 10 ? `${gift.name.substring(0, 9).toUpperCase()}...` : gift.name.toUpperCase()}
              </span>
              <div className="flex items-center gap-0.5 mt-1 select-none shrink-0 leading-none">
                <span className="text-[8px] font-extrabold text-amber-600 font-mono">
                  🪙 {gift.cost}
                </span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="text-[8.5px] text-zinc-400 text-center mt-2.5 leading-none uppercase tracking-wide shrink-0 pt-2.5 border-t border-zinc-800/80 font-mono">
          Presiona para enviar instantáneamente · Tu saldo: 🪙 {liveUserCoins}
        </div>
      </div>
    );
  };

  // Renderer helper for beautiful interactive gifts modal centered in the screen mimicking image.png perfectly
  const renderGiftsModal = () => {
    if (!activeGiftingPhotoUrl) return null;
    
    // Check if we are currently confirming a gift for this specific modal instance:
    const showConfirm = selectedGiftForConfirm && giftConfirmPhotoUrl === activeGiftingPhotoUrl;

    return (
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-fade-in"
        onClick={() => {
          setActiveGiftingPhotoUrl(null);
          setSelectedGiftForConfirm(null);
          setGiftConfirmPhotoUrl(null);
        }}
      >
        <div 
          className="bg-[#12151e]/98 border border-zinc-700/60 rounded-2xl p-4 sm:p-5 shadow-2xl relative w-full max-w-[340px] select-none text-left transform scale-100 transition-all duration-300 animate-fade-in flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
          style={{
            boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.7)',
          }}
        >
          {showConfirm ? (
            /* Beautiful gift confirmation screen inside the dark modal */
            <div className="flex flex-col h-full justify-between gap-3 text-xs text-left text-zinc-100 relative min-h-[300px]">
              {/* Close button */}
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedGiftForConfirm(null);
                  setGiftConfirmPhotoUrl(null);
                  setGiftCustomMessage('');
                }}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition cursor-pointer text-xs font-bold border-none z-50 shadow-xs"
                title="Volver"
              >
                ✕
              </button>

              {/* Header */}
              <div className="text-center mt-1 shrink-0">
                <div className="inline-flex items-center gap-1 bg-pink-500/10 px-2.5 py-0.5 rounded-full border border-pink-500/20">
                  <span className="text-[8.5px] font-black text-pink-400 uppercase tracking-wider font-sans">
                    💝 ENVIAR REGALO PERSONALIZADO
                  </span>
                </div>
                <h4 className="text-[11.5px] font-black text-white mt-1.5 leading-tight font-sans">
                  ¿Deseas regalar a {userProfile.name}?
                </h4>
              </div>

              {/* Gift Card Representation */}
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-2.5 flex flex-col items-center justify-center text-center shadow-inner my-1 shrink-0">
                <span className="text-4xl filter drop-shadow-md animate-bounce select-none mb-1" style={{ animationDuration: '3.5s' }}>
                  {selectedGiftForConfirm.icon}
                </span>
                <span className="text-[11px] font-black text-white leading-tight">
                  {selectedGiftForConfirm.name}
                </span>
                <div className="flex items-center gap-1.5 mt-1 select-none leading-none">
                  <span className="text-[10px] font-extrabold text-amber-500 font-mono">
                    🪙 {selectedGiftForConfirm.cost} <span className="text-[8.5px] font-bold text-amber-500 font-sans">monedas</span>
                  </span>
                  <span className="text-[9px] text-pink-400 font-bold font-sans">
                    ({(selectedGiftForConfirm.cost * 1.0).toFixed(2)}€)
                  </span>
                </div>
              </div>

              {/* Message Textarea Input */}
              <div className="flex-1 flex flex-col min-h-0">
                <label className="block text-[8px] font-black text-pink-400 uppercase tracking-wider mb-1 flex items-center gap-1 shrink-0 font-sans">
                  📝 MENSAJE DEDICADO (OPCIONAL):
                </label>
                <textarea
                  value={giftCustomMessage}
                  onChange={(e) => setGiftCustomMessage(e.target.value)}
                  placeholder="Escribe algo bonito para acompañar tu regalo... (O déjalo en blanco para enviarlo sin mensaje)"
                  maxLength={250}
                  className="w-full flex-1 bg-zinc-900/80 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-[10.5px] text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/20 placeholder-zinc-600 font-sans resize-none min-h-[50px] leading-snug"
                />
                <div className="flex justify-between items-center mt-1 text-[8px] text-zinc-500 font-semibold px-0.5 shrink-0 font-sans">
                  <span>Se enviará solo el regalo si está vacío.</span>
                  <span className="text-pink-400 font-mono">{giftCustomMessage.length}/250</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-1.5 mt-1.5 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    const success = handleGiftPhoto(activeGiftingPhotoUrl, selectedGiftForConfirm, giftCustomMessage);
                    if (success) {
                      setSelectedGiftForConfirm(null);
                      setGiftConfirmPhotoUrl(null);
                      setGiftCustomMessage('');
                      setActiveGiftingPhotoUrl(null);
                    }
                  }}
                  className="w-full py-2 rounded-lg text-[10px] font-black tracking-wider bg-gradient-to-r from-pink-500 via-pink-500 to-rose-500 hover:brightness-[1.04] text-white shadow-md active:scale-[0.99] transition duration-150 flex items-center justify-center gap-1 cursor-pointer select-none border-none uppercase text-center font-sans"
                >
                  <span>🎁 CONFIRMAR Y ENVIAR REGALO</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setSelectedGiftForConfirm(null);
                    setGiftConfirmPhotoUrl(null);
                    setGiftCustomMessage('');
                  }}
                  className="w-full py-1.5 rounded-lg text-[9px] font-black text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 shadow-2xs active:scale-[0.99] transition cursor-pointer text-center select-none uppercase font-sans"
                >
                  VOLVER A REGALOS
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-zinc-850">
                <span className="text-yellow-400 font-extrabold text-[10px] sm:text-xs tracking-wider uppercase flex items-center gap-1.5 select-none font-sans">
                  🎁 REGALOS EXTRA DEL CANAL
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] sm:text-[10px] bg-zinc-800/80 text-yellow-350 font-black px-2 py-0.5 rounded font-mono">
                    Saldo: 🪙 {liveUserCoins}
                  </span>
                  <button 
                    type="button"
                    onClick={() => setActiveGiftingPhotoUrl(null)}
                    className="w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white flex items-center justify-center transition cursor-pointer text-xs font-bold"
                    title="Cerrar ventana"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Grid matching image.png exactly with elegant items layout */}
              <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                {EXTRA_GIFTS.map((gift, gIdx) => (
                  <button
                    key={gIdx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGiftForConfirm(gift);
                      setGiftConfirmPhotoUrl(activeGiftingPhotoUrl);
                      setGiftCustomMessage('');
                    }}
                    className="group/gift relative flex flex-col items-center justify-center bg-white hover:bg-rose-50 border border-slate-200 hover:border-pink-500 p-2 rounded-lg aspect-square w-full h-auto transition-all duration-150 text-center cursor-pointer select-none shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                  >
                    <span className="text-2xl filter drop-shadow-md transition transform group-hover/gift:scale-110">
                      {gift.icon}
                    </span>
                    <span className="text-[8.5px] font-black text-slate-800 mt-1 truncate w-full px-0.5 select-none uppercase leading-tight">
                      {gift.name.length > 9 ? `${gift.name.substring(0, 8).toUpperCase()}...` : gift.name.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-0.5 mt-0.5 select-none shrink-0">
                      <span className="text-[8px] font-extrabold text-amber-600 font-mono">
                        🪙 {gift.cost}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="text-[9px] text-zinc-400 text-center mt-3 pt-2.5 border-t border-zinc-800/80 italic leading-tight select-none uppercase font-mono tracking-wider">
                Presiona para enviar instantáneamente · Tu saldo: 🪙 {liveUserCoins}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // Renderer helper for the beautiful confirm/message overlay fitting inside the photo card exactly
  const renderConfirmGiftOverlay = (photoUrl: string, isLightbox = false) => {
    if (!selectedGiftForConfirm || giftConfirmPhotoUrl !== photoUrl) return null;
    
    // 1 Coin = 1.00€
    const euroCost = Number((selectedGiftForConfirm.cost * 1.0).toFixed(2));
    
    return (
      <div 
        className={`absolute inset-0 bg-white/98 z-[200] flex flex-col justify-between p-3.5 select-none animate-fade-in text-slate-800 border border-pink-200/80 shadow-2xl overflow-y-auto ${
          isLightbox ? 'rounded-none' : 'rounded-2xl'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {/* Close button */}
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setSelectedGiftForConfirm(null);
            setGiftConfirmPhotoUrl(null);
            setGiftCustomMessage('');
          }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-700 flex items-center justify-center transition cursor-pointer text-xs font-bold border-none z-50 shadow-xs"
          title="Cancelar"
        >
          ✕
        </button>

        {/* Content Container */}
        <div className="flex flex-col h-full justify-between gap-2 text-xs text-left">
          {/* Header */}
          <div className="text-center mt-1 shrink-0">
            <div className="inline-flex items-center gap-1 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100/40">
              <span className="text-[8.5px] font-black text-[#db2777] uppercase tracking-wider font-sans">
                💝 ENVIAR REGALO PERSONALIZADO
              </span>
            </div>
            <h4 className="text-[11.5px] font-black text-slate-900 mt-1.5 leading-tight font-sans">
              ¿Deseas regalar a {userProfile.name}?
            </h4>
          </div>

          {/* Gift Card Representation */}
          <div className="bg-gradient-to-b from-rose-50/50 to-pink-50/10 border border-rose-100/60 rounded-xl p-2 sm:p-2.5 flex flex-col items-center justify-center text-center shadow-inner my-1 shrink-0">
            <span className="text-3.5xl filter drop-shadow-md animate-bounce select-none mb-0.5" style={{ animationDuration: '3.5s' }}>
              {selectedGiftForConfirm.icon}
            </span>
            <span className="text-[11px] font-black text-slate-900 leading-tight">
              {selectedGiftForConfirm.name}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5 select-none leading-none">
              <span className="text-[10px] font-extrabold text-amber-600 font-mono">
                🪙 {selectedGiftForConfirm.cost} <span className="text-[8.5px] font-bold text-amber-600 font-sans">monedas</span>
              </span>
              <span className="text-[9px] text-pink-500 font-bold font-sans">
                ({euroCost.toFixed(2)}€)
              </span>
            </div>
          </div>

          {/* Message Textarea Input */}
          <div className="flex-1 flex flex-col min-h-0">
            <label className="block text-[8px] font-black text-[#db2777] uppercase tracking-wider mb-1 flex items-center gap-1 shrink-0 font-sans">
              📝 MENSAJE DEDICADO (OPCIONAL):
            </label>
            <textarea
              value={giftCustomMessage}
              onChange={(e) => setGiftCustomMessage(e.target.value)}
              placeholder="Escribe algo bonito para acompañar tu regalo... (O déjalo en blanco para enviarlo sin mensaje)"
              maxLength={250}
              className="w-full flex-1 bg-slate-50 border border-pink-100 rounded-xl px-2.5 py-1.5 text-[10.5px] text-slate-800 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-100 placeholder-pink-300 font-sans resize-none min-h-[40px] leading-snug"
            />
            <div className="flex justify-between items-center mt-1 text-[8px] text-slate-400 font-semibold px-0.5 shrink-0 font-sans">
              <span>Se enviará solo el regalo si está vacío.</span>
              <span className="text-pink-500 font-mono">{giftCustomMessage.length}/250</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-1 mt-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                const success = handleGiftPhoto(giftConfirmPhotoUrl!, selectedGiftForConfirm!, giftCustomMessage);
                if (success) {
                  setSelectedGiftForConfirm(null);
                  setGiftConfirmPhotoUrl(null);
                  setGiftCustomMessage('');
                }
              }}
              className="w-full py-2 rounded-lg text-[10px] font-black tracking-wider bg-gradient-to-r from-pink-500 via-pink-500 to-rose-500 hover:brightness-[1.04] text-white shadow-md active:scale-[0.99] transition duration-150 flex items-center justify-center gap-1 cursor-pointer select-none border-none uppercase text-center font-sans"
            >
              <span>🎁 CONFIRMAR Y ENVIAR REGALO</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setSelectedGiftForConfirm(null);
                setGiftConfirmPhotoUrl(null);
                setGiftCustomMessage('');
              }}
              className="w-full py-1.5 rounded-lg text-[9px] font-black text-pink-600 bg-white hover:bg-pink-50/20 border border-pink-150 shadow-2xs active:scale-[0.99] transition cursor-pointer text-center select-none uppercase font-sans"
            >
              CANCELAR
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Helper to dynamically get or seed photo interactions
  const getPhotoInteraction = (photoUrl: string): PhotoInteraction => {
    if (photoInteractions[photoUrl]) {
      return photoInteractions[photoUrl];
    }

    // Seed dynamically based on URL length to remain stable per photos
    let hash = 0;
    for (let c = 0; c < photoUrl.length; c++) {
      hash = photoUrl.charCodeAt(c) + ((hash << 5) - hash);
    }
    const seedLikesCount = Math.abs(hash % 80) + 15;
    const numComments = Math.abs(hash % 3) + 2; // 2 to 4 comments
    
    const seededComments = Array.from({ length: numComments }).map((_, i) => {
      const author = DEFAULT_COMMENT_AUTHORS[(Math.abs(hash) + i) % DEFAULT_COMMENT_AUTHORS.length];
      const commentText = DEFAULT_PHOTO_COMMENTS[(Math.abs(hash) * (i + 1)) % DEFAULT_PHOTO_COMMENTS.length];
      const hoursAgo = i + 1;
      return {
        id: `photo-comm-${Math.abs(hash)}-${i}-${Date.now()}`,
        authorName: author.name,
        authorAvatar: author.avatar,
        text: commentText,
        date: `Hace ${hoursAgo}h`
      };
    });

    return {
      likes: {},
      reactions: {},
      likeCount: seedLikesCount,
      comments: seededComments
    };
  };

  const handleToggleWinnerPhoto = (phUrl: string) => {
    if (!currentModel) return;
    const alreadySelected = currentModel.selectedWinnerPhotos || [];
    let nextSelected: string[];
    if (alreadySelected.includes(phUrl)) {
      nextSelected = alreadySelected.filter(url => url !== phUrl);
    } else {
      if (alreadySelected.length >= 6) {
        alert("⚠️ No puedes elegir más de 6 fotos para que salgan en los resultados finales. Por favor, desmarca alguna si deseas elegir esta.");
        return;
      }
      nextSelected = [...alreadySelected, phUrl];
    }

    const updatedModels = models.map((m) => {
      if (m.id === currentModel.id) {
        return {
          ...m,
          selectedWinnerPhotos: nextSelected
        };
      }
      return m;
    });

    onUpdateModels(updatedModels);
  };

  const handleLikePhoto = (photoUrl: string, e?: React.MouseEvent) => {
    const current = photoInteractions[photoUrl] || getPhotoInteraction(photoUrl);
    const hasLiked = !!current.likes[userProfile.id];
    
    const nextLikes = { ...current.likes };
    const nextReactions = current.reactions ? { ...current.reactions } : {};
    let nextLikeCount = current.likeCount;

    if (hasLiked) {
      delete nextLikes[userProfile.id];
      if (nextReactions) delete nextReactions[userProfile.id];
      nextLikeCount = Math.max(0, nextLikeCount - 1);
    } else {
      nextLikes[userProfile.id] = true;
      nextReactions[userProfile.id] = '❤️'; // Default reaction
      nextLikeCount += 1;
      // Trigger visual heart rain effect with click coordinates!
      window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
        detail: { x: e?.clientX, y: e?.clientY }
      }));
    }

    const updatedInteractions = {
      ...photoInteractions,
      [photoUrl]: {
        ...current,
        likes: nextLikes,
        reactions: nextReactions,
        likeCount: nextLikeCount
      }
    };

    setPhotoInteractions(updatedInteractions);
    localStorage.setItem('coll_photo_interactions', JSON.stringify(updatedInteractions));
  };

  const handleReactToPhoto = (photoUrl: string, reactionSymbol: string, e?: React.MouseEvent) => {
    const current = photoInteractions[photoUrl] || getPhotoInteraction(photoUrl);
    const hasLiked = !!current.likes[userProfile.id];
    
    const nextLikes = { ...current.likes };
    const nextReactions = current.reactions ? { ...current.reactions } : {};
    let nextLikeCount = current.likeCount;

    // Set/overwrite reaction
    nextReactions[userProfile.id] = reactionSymbol;
    
    // If they hadn't liked/reacted yet, increment count and mark as liked
    if (!hasLiked) {
      nextLikes[userProfile.id] = true;
      nextLikeCount += 1;
    }

    // Trigger visual reaction rain effect with click coordinates!
    window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
      detail: { icon: reactionSymbol, x: e?.clientX, y: e?.clientY }
    }));

    const updatedInteractions = {
      ...photoInteractions,
      [photoUrl]: {
        ...current,
        likes: nextLikes,
        reactions: nextReactions,
        likeCount: nextLikeCount
      }
    };

    setPhotoInteractions(updatedInteractions);
    localStorage.setItem('coll_photo_interactions', JSON.stringify(updatedInteractions));
  };

  const handleAddNewHighlight = () => {
    const title = prompt('✍️ Escribe el título o tema para tu nueva Historia (ej. "Milano FW", "Beach Shoot"):');
    if (!title) return;
    const defaultSuggestions = [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400',
      'https://images.unsplash.com/photo-1481824429379-07aa5e5b0739?auto=format&fit=crop&w=400',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400',
      'https://images.unsplash.com/photo-1549439602-43faec43ae8a?auto=format&fit=crop&w=400',
      'https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?auto=format&fit=crop&w=400'
    ];
    const defaultSuggestion = defaultSuggestions[highlights.length % defaultSuggestions.length];
    const url = prompt('🔗 Introduce el URL de la imagen de tu Historia (deja vacío para usar una aleatoria hermosa de moda):', defaultSuggestion);
    
    const finalUrl = url?.trim() || defaultSuggestion;
    trackUploadedPhoto(finalUrl); // Track photo as user-uploaded
    const newHighlight = {
      id: `h-user-${Date.now()}`,
      title: title.trim().substring(0, 15),
      image: finalUrl
    };

    const nextHighlights = [newHighlight, ...highlights];
    setHighlights(nextHighlights);
    localStorage.setItem(`highlights_${userProfile.id}`, JSON.stringify(nextHighlights));
    
    // Also add to model's photos array so they can see and use it in general grids!
    if (currentModel) {
      const updatedModels = models.map(m => {
        if (m.id === currentModel.id) {
          const exists = m.photos.includes(finalUrl);
          return {
            ...m,
            photos: exists ? m.photos : [finalUrl, ...m.photos]
          };
        }
        return m;
      });
      onUpdateModels(updatedModels);
    } else {
      const exists = investorPhotos.includes(finalUrl);
      if (!exists) {
        const nextPhotos = [finalUrl, ...investorPhotos];
        setInvestorPhotos(nextPhotos);
        localStorage.setItem(`investor_photos_${userProfile.id}`, JSON.stringify(nextPhotos));
      }
    }
    
    alert('✨ ¡Historia creada y añadida con éxito!');
  };

  const handleDeletePhoto = (photoUrl: string) => {
    // 0. Remove from tracked user-uploaded photos
    setUploadedPhotoUrls(prev => {
      const next = prev.filter(url => url !== photoUrl);
      localStorage.setItem(`uploaded_photo_urls_${userProfile.id}`, JSON.stringify(next));
      return next;
    });

    // 1. Remove from dynamic highlights
    const nextHighlights = highlights.filter(h => h.image !== photoUrl);
    setHighlights(nextHighlights);
    localStorage.setItem(`highlights_${userProfile.id}`, JSON.stringify(nextHighlights));

    // 2. Remove from active photos
    if (currentModel) {
      const updatedModels = models.map(m => {
        if (m.id === currentModel.id) {
          const nextPhotos = (m.photos || []).filter(url => url !== photoUrl);
          // Also remove from selected winner list if selected
          const nextWinners = (m.selectedWinnerPhotos || []).filter(url => url !== photoUrl);
          return {
            ...m,
            photos: nextPhotos,
            selectedWinnerPhotos: nextWinners
          };
        }
        return m;
      });
      onUpdateModels(updatedModels);
    } else {
      const nextPhotos = investorPhotos.filter(url => url !== photoUrl);
      setInvestorPhotos(nextPhotos);
      localStorage.setItem(`investor_photos_${userProfile.id}`, JSON.stringify(nextPhotos));
    }

    alert('🗑️ Imagen eliminada con éxito.');
  };

  const handleAddPhotoComment = (photoUrl: string) => {
    if (!lightboxCommentText.trim()) return;
    const current = photoInteractions[photoUrl] || getPhotoInteraction(photoUrl);
    
    const sender = realLoggedInUser || userProfile;

    const newComment = {
      id: `photo-comm-user-${Date.now()}`,
      authorName: sender.name,
      authorAvatar: sender.avatar,
      text: lightboxCommentText.trim(),
      date: 'Hace un momento'
    };

    const updatedInteractions = {
      ...photoInteractions,
      [photoUrl]: {
        ...current,
        comments: [...current.comments, newComment]
      }
    };

    setPhotoInteractions(updatedInteractions);
    localStorage.setItem('coll_photo_interactions', JSON.stringify(updatedInteractions));
    setLightboxCommentText('');
    setActiveEmojiPicker(null);
  };

  // Fetch or Seed Facebook timeline posts for this model
  useEffect(() => {
    const storageKey = `fb_posts_v3_${userProfile.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      // Seed initial posts for classic FB profile feel
      const seedPosts: FBPost[] = [
        {
          id: 'fb-seed-1',
          authorName: userProfile.name,
          authorAvatar: userProfile.avatar,
          authorUsername: userProfile.username,
          content: '✨ ¡Bienvenidos a mi perfil oficial en Fashion Finances! He abierto una nueva mesa de inversión de 10€. Suban sus proyectos creativos y participen. ¡Recuerden que el 10% de las ganancias se destina a potenciar mi carrera de modelaje como su patrocinadora directa! 🚀💖',
          linkUrl: '#sessions',
          linkTitle: 'Unirse a Mesas de Inversión En Curso',
          likes: 42,
          hasLiked: false,
          createdAt: 'Hace 2 horas',
          comments: [
            {
              id: 'c-1',
              authorName: 'Marcos Inversor',
              authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
              text: '¡Excelente! Acabo de registrar mi proyecto de marca de ropa y me uní bajo tu patrocinio. ¡Vamos con todo! 💪',
              date: 'Hace 1 hora'
            },
            {
              id: 'c-2',
              authorName: 'Clara Domínguez',
              authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
              text: '¡Qué gran iniciativa! Estaré votando tus fotos para mantenerte en el Top 10 del ranking nacional.',
              date: 'Hace 45 minutos'
            }
          ]
        },
        {
          id: 'fb-seed-2',
          authorName: userProfile.name,
          authorAvatar: userProfile.avatar,
          authorUsername: userProfile.username,
          content: 'Colección de temporada Primavera/Verano. ¡Agradezco enormemente a todos mis patrocinados por el apoyo en la última ronda del simulador financiero, logramos maximizar comisiones! 👗🌸📸',
          image: currentModel?.photos[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
          likes: 89,
          hasLiked: true,
          createdAt: 'Ayer a las 15:40',
          comments: [
            {
              id: 'c-3',
              authorName: 'Ernesto vs',
              authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
              text: '¡Te ves increíble! Ya eres mi patrocinadora principal. ¡Ese look de pasarela es oro puro!',
              date: 'Ayer a las 18:00'
            }
          ]
        },
        {
          id: 'fb-seed-3',
          authorName: userProfile.name,
          authorAvatar: userProfile.avatar,
          authorUsername: userProfile.username,
          content: '📸 Detrás de escena en el último shooting en Milán. Gracias a las comisiones del 10% de mis patrocinadores, hemos podido cofinanciar los billetes y la producción. ¡Es un honor trabajar con mentes tan brillantes de la inversión digital! 🇮🇹🧥🕶️',
          image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=600',
          likes: 142,
          hasLiked: false,
          createdAt: 'Hace 3 días',
          comments: [
            {
              id: 'c-4',
              authorName: 'Clara Domínguez',
              authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
              text: '¡Espectacular! Sigue triunfando en Milán ✨',
              date: 'Hace 2 días'
            },
            {
              id: 'c-5',
              authorName: 'Marcos Inversor',
              authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
              text: 'Inversión muy bien aprovechada. El retorno de marca es innegable.',
              date: 'Hace 2 días'
            }
          ]
        },
        {
          id: 'fb-seed-4',
          authorName: userProfile.name,
          authorAvatar: userProfile.avatar,
          authorUsername: userProfile.username,
          content: '💡 ¡Próxima Mesa Especial de Alta Costura! Estoy preparando un proyecto exclusivo para la pasarela de París. El objetivo de financiación colectiva es de 200€ ficticios. Todos mis patrocinados actuales tendrán acceso anticipado y un bono del +5% de retorno estimado. ¡Estén atentos al lanzamiento! 🕊️🇫🇷👗',
          likes: 215,
          hasLiked: false,
          createdAt: 'Hace 5 días',
          comments: [
            {
              id: 'c-6',
              authorName: 'Ernesto vs',
              authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
              text: 'Me apunto de cabeza 🚀',
              date: 'Hace 4 días'
            }
          ]
        },
        {
          id: 'fb-seed-5',
          authorName: userProfile.name,
          authorAvatar: userProfile.avatar,
          authorUsername: userProfile.username,
          content: '📈 Informe de Rendimiento Semanal: ¡Hemos superado todas las expectativas! El volumen de operaciones en nuestras mesas de crowdfunding asociadas ha crecido un 34% esta semana. Esto se traduce en más recompensas distribuidas directamente a las carteras de nuestros inversores de confianza. ¡Gracias por confiar en mí como su patrocinadora preferida! 📊💰',
          likes: 156,
          hasLiked: false,
          createdAt: 'Hace 1 semana',
          comments: [
            {
              id: 'c-7',
              authorName: 'Marcos Inversor',
              authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
              text: 'Las estadísticas hablan por sí solas. La mejor patrocinadora.',
              date: 'Hace 6 días'
            }
          ]
        }
      ];
      setPosts(seedPosts);
      localStorage.setItem(storageKey, JSON.stringify(seedPosts));
    }
  }, [userProfile.id]);

  // Synchronize bio back to modelProfile structure
  const handleBioSave = () => {
    setIsEditingBio(false);
    
    // Update user profile
    const nextProfile = {
      ...userProfile,
      bio: bioText
    };
    onUpdateProfile(nextProfile);
    
    // Update local profile list
    const nextModels = models.map(m => {
      if (m.id === userProfile.id) {
        return {
          ...m,
          bio: bioText
        };
      }
      return m;
    });
    
    onUpdateModels(nextModels);
  };

  // Synchronize avatar back to userProfile and modelProfile
  const handleAvatarSave = () => {
    if (!tempAvatarUrl.trim()) {
      alert('La URL de la imagen de perfil no puede estar vacía.');
      return;
    }
    
    setIsEditingAvatar(false);
    
    // Update user profile with new avatar
    const nextProfile = {
      ...userProfile,
      avatar: tempAvatarUrl.trim()
    };
    onUpdateProfile(nextProfile);
    
    // Update local profile list
    const nextModels = models.map(m => {
      if (m.id === userProfile.id) {
        return {
          ...m,
          avatar: tempAvatarUrl.trim()
        };
      }
      return m;
    });
    
    onUpdateModels(nextModels);
  };

  // Publish dynamic Facebook Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !newPostImage.trim()) return;

    const newPost: FBPost = {
      id: `fb-post-${Date.now()}`,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      authorUsername: userProfile.username,
      content: newPostText,
      image: newPostImage.trim() ? newPostImage : undefined,
      linkUrl: newPostLink.trim() ? newPostLink : undefined,
      linkTitle: newPostLinkTitle.trim() && newPostLink.trim() ? newPostLinkTitle : (newPostLink.trim() ? 'Enlace Directo' : undefined),
      likes: 0,
      hasLiked: false,
      createdAt: 'Justo ahora',
      comments: []
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem(`fb_posts_v3_${userProfile.id}`, JSON.stringify(updatedPosts));

    // Also push image into Model photos if any image is attached, to show it globally
    if (newPostImage.trim()) {
      trackUploadedPhoto(newPostImage.trim()); // Track post image as user-uploaded
      if (currentModel) {
        const updatedModels = models.map(m => {
          if (m.id === currentModel.id) {
            return {
              ...m,
              photos: [newPostImage, ...m.photos],
              totalLikes: m.totalLikes + 5 // bonus likes inside simulated server
            };
          }
          return m;
        });
        onUpdateModels(updatedModels);
      } else {
        const nextPhotos = [newPostImage, ...investorPhotos];
        setInvestorPhotos(nextPhotos);
        localStorage.setItem(`investor_photos_${userProfile.id}`, JSON.stringify(nextPhotos));
      }
    }

    // Reset Form
    setNewPostText('');
    setNewPostImage('');
    setNewPostLink('');
    setNewPostLinkTitle('');
    setShowImageInput(false);
    setShowLinkInput(false);
  };

  // Toggle Post Like simulator (Simulates fb reaction)
  const handleLikePost = (postId: string, e?: React.MouseEvent) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const nextHasLiked = !p.hasLiked;
        if (nextHasLiked) {
          // Trigger visual heart rain effect with click coordinates!
          window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
            detail: { x: e?.clientX, y: e?.clientY }
          }));
        }
        return {
          ...p,
          likes: nextHasLiked ? p.likes + 1 : p.likes - 1,
          hasLiked: nextHasLiked
        };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem(`fb_posts_v3_${userProfile.id}`, JSON.stringify(updated));

    // Also synchronize overall model profile ranking likes score!
    if (currentModel) {
      const isLiking = !posts.find(p => p.id === postId)?.hasLiked;
      const updatedModels = models.map(m => {
        if (m.id === currentModel.id) {
          return {
            ...m,
            totalLikes: isLiking ? m.totalLikes + 1 : Math.max(0, m.totalLikes - 1)
          };
        }
        return m;
      });
      onUpdateModels(updatedModels);
    }
  };

  // Add Comment simulator inside individual Facebook Post card
  const handleAddComment = (postId: string) => {
    const commentText = newCommentInput[postId];
    if (!commentText || !commentText.trim()) return;

    const sender = realLoggedInUser || userProfile;

    const newComment: FBComment = {
      id: `comm-${Date.now()}`,
      authorName: sender.name,
      authorAvatar: sender.avatar,
      text: commentText,
      date: 'Hace un momento'
    };

    const updated = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    });

    setPosts(updated);
    localStorage.setItem(`fb_posts_v3_${userProfile.id}`, JSON.stringify(updated));

    // Reset comment field
    setNewCommentInput({
      ...newCommentInput,
      [postId]: ''
    });
    setActiveEmojiPicker(null);
  };

  const renderMuroFeed = () => {
    return (
      <div className="space-y-6">
        {/* CREATE POST CARD (Facebook-style) */}
        {isOwnProfile && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
            <div className="flex gap-3">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name} 
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-slate-100" 
              />
              <form onSubmit={handleCreatePost} className="flex-1 space-y-3">
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder={userProfile.role === 'model'
                    ? `¿Qué hay de nuevo en tu modelaje, ${userProfile.name.split(' ')[0]}? Escribe comentarios o publica consejos de atracción...`
                    : `¿Qué estás pensando, ${userProfile.name.split(' ')[0]}? Comparte una idea, consejo de inversión o actualiza tu estado...`
                  }
                  className="w-full bg-slate-100 hover:bg-slate-150/70 focus:bg-white border-0 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3 text-xs text-slate-800 focus:outline-none transition-all placeholder-slate-400 resize-none min-h-[70px]"
                />

                {/* Optional inputs */}
                {showImageInput && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2 animate-fade-in text-[10px]">
                    <label className="block font-bold text-slate-500 uppercase">Cargar Foto desde tu Ordenador:</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              const compressed = await compressAndResizeImage(file);
                              setNewPostImage(compressed);
                            } catch (err) {
                              console.error('Error compressing post image:', err);
                            }
                          }
                        }}
                        className="hidden"
                        id="post-image-upload-desktop"
                      />
                      <label
                        htmlFor="post-image-upload-desktop"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Seleccionar archivo</span>
                      </label>
                      {newPostImage ? (
                        <div className="flex items-center gap-1.5">
                          <img src={newPostImage || undefined} alt="Post attachment preview" className="w-8 h-8 rounded object-cover border" />
                          <button
                            type="button"
                            onClick={() => setNewPostImage('')}
                            className="text-rose-600 hover:text-rose-800 font-bold"
                          >
                            Eliminar
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">Ningún archivo cargado</span>
                      )}
                    </div>
                  </div>
                )}

                {showLinkInput && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2 animate-fade-in text-[10px]">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-500 uppercase">Texto Descriptivo del Enlace:</label>
                      <input
                        type="text"
                        placeholder="Ej. ¡Únete a mí aquí!"
                        value={newPostLinkTitle}
                        onChange={(e) => setNewPostLinkTitle(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-500 uppercase">Enlace URL (Pestaña o campaña de afiliación):</label>
                      <input
                        type="text"
                        placeholder="Ej. #sessions"
                        value={newPostLink}
                        onChange={(e) => setNewPostLink(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none text-slate-850"
                      />
                    </div>
                  </div>
                )}

                {/* Form actions bar */}
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 flex-wrap gap-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setShowImageInput(!showImageInput); setShowLinkInput(false); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        showImageInput ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                      title="Insertar foto de pasarela"
                    >
                      <ImageIcon className="w-4 h-4 text-emerald-500" />
                      <span className="hidden sm:inline">Foto</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setShowLinkInput(!showLinkInput); setShowImageInput(false); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                        showLinkInput ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                      title="Insertar enlace de captación"
                    >
                      <Link className="w-4 h-4 text-indigo-500" />
                      <span className="hidden sm:inline">Enlace</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-rose-500 to-[#fe2c55] hover:brightness-[1.04] text-white font-black uppercase text-[11px] rounded-xl px-5 py-2.5 transition cursor-pointer border-0 shadow-md active:scale-98"
                  >
                    PUBLICAR ACTUALIZACIÓN
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Muro corporativo invitation text */}
        <div className="bg-gradient-to-r from-rose-50 to-indigo-50/45 p-4 rounded-2xl border border-rose-100 text-center shadow-xs">
          <p className="text-xs sm:text-sm font-serif italic text-rose-950 tracking-wide font-bold">
            Tu muro corporativo, aprovéchalo para exponer tus ofertas.
          </p>
        </div>

        {/* DYNAMIC TIMELINE FEED OF INDIVIDUAL POSTS */}
        <div className="space-y-4 font-sans">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-xs text-left">
              
              {/* Post Header with small avatar and verify icons */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <img 
                    src={post.authorUsername === userProfile.username ? userProfile.avatar : post.authorAvatar} 
                    alt={post.authorName} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-100" 
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <strong className="text-slate-900 text-sm font-semibold">{post.authorName}</strong>
                      <span className="bg-indigo-100 text-indigo-600 border border-indigo-200/50 text-[8px] font-bold px-1 rounded-sm">
                        Model ✓
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
                      <span>@{post.authorUsername}</span>
                      <span>•</span>
                      <span>{post.createdAt}</span>
                      <span>•</span>
                      <Globe className="w-3 h-3 text-slate-400" />
                    </p>
                  </div>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setActivePostMenuId(activePostMenuId === post.id ? null : post.id)}
                    className="w-8 h-8 rounded-lg bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-650 flex items-center justify-center transition cursor-pointer shadow-2xs"
                    title="Opciones de publicación"
                  >
                    <MoreHorizontal className="w-4 h-4 font-black" />
                  </button>

                  {activePostMenuId === post.id && (
                    <div className="absolute right-0 top-9 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-40 animate-fade-in text-xs font-semibold text-slate-800">
                      <button
                        onClick={() => {
                          setActivePostMenuId(null);
                          navigator.clipboard.writeText(`https://fashionfinances.platform/post/${post.id}`);
                          alert('🔗 ¡Vínculo de la publicación copiado al portapapeles!');
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                      >
                        <span>🔗 Copiar enlace de publicación</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePostMenuId(null);
                          const nextText = prompt('📝 Editar contenido de la publicación:', post.content);
                          if (nextText !== null) {
                            const updated = posts.map(p => p.id === post.id ? { ...p, content: nextText } : p);
                            setPosts(updated);
                            localStorage.setItem(`fb_posts_v3_${userProfile.id}`, JSON.stringify(updated));
                            alert('✨ ¡Publicación editada con éxito!');
                          }
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                      >
                        <span>📝 Editar texto</span>
                      </button>

                      <button
                        onClick={() => {
                          setActivePostMenuId(null);
                          if (confirm('¿Estás segura de que deseas eliminar esta publicación de tu muro?')) {
                            const updated = posts.filter(p => p.id !== post.id);
                            setPosts(updated);
                            localStorage.setItem(`fb_posts_v3_${userProfile.id}`, JSON.stringify(updated));
                            alert('🗑️ Publicación eliminada.');
                          }
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-red-600 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                      >
                        <span>🗑️ Eliminar publicación</span>
                      </button>

                      <hr className="border-slate-100 my-1" />

                      <button
                        onClick={() => {
                          setActivePostMenuId(null);
                          alert('🚩 ¡Muchas gracias por tu reporte! La plataforma revisará este contenido por si infringe alguna política.');
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-500 flex items-center gap-2 border-none bg-transparent cursor-pointer"
                      >
                        <span>🚩 Reportar publicación</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Text content description */}
              <div className="text-slate-755 text-xs sm:text-sm leading-relaxed whitespace-pre-line text-left">
                {post.content}
              </div>

              {/* Attached image if any */}
              {post.image && (
                <div 
                  className="rounded-2xl overflow-hidden bg-slate-900/5 border border-slate-150 cursor-pointer group/postimg max-h-96 relative"
                  title="Ampliar foto"
                >
                  <img 
                    src={post.image} 
                    alt="post attachment" 
                    referrerPolicy="no-referrer"
                    className="w-full max-h-96 object-cover hover:scale-[1.01] transition-transform duration-300 rounded-t-2xl"
                    onClick={() => setSelectedPhotoForLightbox(post.image)}
                  />
                  
                  {/* 🎁 Renders Extra Channel Gifts list overlay covering the image exactly */}
                  {!selectedPhotoForLightbox && hoveredHeartAndGiftPhotoUrl === post.image && renderGiftsPopover(post.image)}

                  {/* 💝 Renders Stickers list overlay covering the image exactly */}
                  {!selectedPhotoForLightbox && hoveredStickersPostId === post.id && renderStickersPopover(post.id, post.image)}

                  {!selectedPhotoForLightbox && giftConfirmPhotoUrl === post.image && renderConfirmGiftOverlay(post.image)}

                  {/* 📤 Renders the custom Full-Size Share Overlay covering the image exactly */}
                  {!selectedPhotoForLightbox && activeShareMenuPostId === post.id && renderShareOverlay(post.id, post.image)}
                </div>
              )}

              {/* Attached call to action links (Recruitment buttons) */}
              {post.linkUrl && (
                <div className="bg-slate-50 hover:bg-slate-100 border border-slate-180 rounded-xl p-3 flex justify-between items-center transition">
                  <div className="space-y-0.5 max-w-[80%] text-left">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-500 block font-mono">Enlace para Captar Mecenas</span>
                    <span className="text-xs font-semibold text-slate-800 block truncate">{post.linkTitle || 'Ver detalles'}</span>
                  </div>
                  <a
                    href={post.linkUrl}
                    onClick={() => alert(`Sponsor redirect simulador: El mecenas ha sido guiado a la pestaña para registrar sponsors.`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-2 text-xs transition shrink-0"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Action Row styled exactly like image.png */}
              {renderHighFidelityActionRow(
                post.id,
                post.likes,
                post.comments.length,
                repostCounts[post.id] ?? Math.floor((post.id.charCodeAt(post.id.length - 1) % 6) + 3),
                !!post.hasLiked,
                !!bookmarkedPhotos[post.id],
                !!repostedPhotos[post.id],
                (e) => {
                  e.stopPropagation();
                  handleLikePost(post.id, e);
                },
                (e) => {
                  e.stopPropagation();
                  setActiveGiftingPhotoUrl(post.image || post.id);
                },
                () => setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id),
                () => handleToggleRepost(post.id),
                (e) => {
                  e.stopPropagation();
                  setActiveShareMenuPostId(activeShareMenuPostId === post.id ? null : post.id);
                },
                () => handleToggleBookmark(post.id),
                post.image
              )}

              {/* Facebook Comments section wrapper if toggled or default */}
              {activeCommentsPostId === post.id && (
                <div className="pt-3 border-t border-slate-100 space-y-3 animate-fade-in text-left">
                  
                  {/* Add reply input */}
                  <div className="flex gap-2">
                    <img 
                      src={userProfile.avatar} 
                      alt={userProfile.name} 
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover shrink-0 border" 
                    />
                    <div className="flex-1 flex gap-1 bg-slate-50 rounded-xl px-3 py-1.5 border border-slate-200 relative">
                      <input
                        type="text"
                        placeholder="Escribe una respuesta para tus simpatizantes..."
                        value={newCommentInput[post.id] || ''}
                        onChange={(e) => setNewCommentInput({
                          ...newCommentInput,
                          [post.id]: e.target.value
                        })}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                        className="w-full bg-transparent text-xs focus:outline-none text-slate-800"
                      />
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (activeEmojiPicker?.type === 'post' && activeEmojiPicker?.id === post.id) {
                            setActiveEmojiPicker(null);
                          } else {
                            setActiveEmojiPicker({ type: 'post', id: post.id });
                          }
                        }}
                        onMouseEnter={() => handleEmojiPickerMouseEnter('post', post.id)}
                        onMouseLeave={handleEmojiPickerMouseLeave}
                        className="text-slate-400 hover:text-slate-600 transition p-0.5 text-xs select-none cursor-pointer"
                      >
                        😊
                      </button>

                      {activeEmojiPicker?.type === 'post' && activeEmojiPicker?.id === post.id && (
                        <div 
                          className="absolute bottom-full right-0 mb-2 bg-white border border-slate-200 shadow-xl rounded-xl p-2.5 z-[260] w-60"
                          onClick={(e) => e.stopPropagation()}
                          onMouseEnter={() => handleEmojiPickerMouseEnter('post', post.id)}
                          onMouseLeave={handleEmojiPickerMouseLeave}
                        >
                          <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-2 font-sans text-left">
                            Reacciones Rápidas
                          </div>
                          <div className="grid grid-cols-6 gap-1.5">
                            {POPULAR_EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const currentVal = newCommentInput[post.id] || '';
                                  setNewCommentInput({
                                    ...newCommentInput,
                                    [post.id]: currentVal + emoji
                                  });
                                }}
                                className="text-lg hover:scale-125 hover:bg-slate-50 rounded p-1 transition-transform cursor-pointer flex items-center justify-center"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <button 
                        onClick={() => handleAddComment(post.id)}
                        className="text-indigo-600 hover:text-indigo-700 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Pre-seeded list of replies */}
                  {post.comments.length > 0 && (
                    <div className="space-y-3.5 pl-3 pt-1 border-l-2 border-slate-100">
                      {post.comments.map((comm) => (
                        <div key={comm.id} className="flex flex-col gap-1 text-xs">
                          <div className="flex gap-2">
                            <img 
                              src={comm.authorName === userProfile.name ? userProfile.avatar : comm.authorAvatar} 
                              alt={comm.authorName} 
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-full object-cover shrink-0 border" 
                            />
                            <div className="bg-slate-50 text-slate-800 p-2.5 rounded-xl flex-1 space-y-0.5">
                              <div className="flex justify-between items-baseline">
                                <span className="font-semibold text-slate-900">{comm.authorName}</span>
                                <span className="text-[9px] text-slate-400 font-mono">{comm.date}</span>
                              </div>
                              <p className="text-slate-755 font-medium leading-relaxed">{comm.text}</p>
                            </div>
                          </div>

                          {/* Reply action bar under comment bubble */}
                          <div className="pl-9 flex items-center gap-3 text-[10px] text-slate-500 font-bold select-none">
                            <button
                              type="button"
                              onClick={() => {
                                if (replyingToCommentId === comm.id) {
                                  setReplyingToCommentId(null);
                                  setReplyInputText('');
                                } else {
                                  setReplyingToCommentId(comm.id);
                                  setReplyInputText('');
                                }
                              }}
                              className="hover:text-indigo-600 hover:underline transition cursor-pointer border-none bg-transparent font-bold flex items-center gap-1 text-left"
                            >
                              <MessageSquare className="w-2.5 h-2.5" />
                              <span>Responder</span>
                            </button>
                          </div>

                          {/* Nested replies list */}
                          {comm.replies && comm.replies.length > 0 && (
                            <div className="pl-9 space-y-2 mt-1 border-l border-slate-100/80">
                              {comm.replies.map((reply) => (
                                <div key={reply.id} className="flex gap-2 text-[11px] items-start">
                                  <img 
                                    src={reply.authorName === userProfile.name ? userProfile.avatar : reply.authorAvatar} 
                                    alt={reply.authorName} 
                                    referrerPolicy="no-referrer"
                                    className="w-6 h-6 rounded-full object-cover shrink-0 border" 
                                  />
                                  <div className="bg-slate-50/70 p-2 rounded-xl flex-1 space-y-0.5">
                                    <div className="flex justify-between items-baseline">
                                      <span className="font-bold text-slate-950">{reply.authorName}</span>
                                      <span className="text-[8px] text-slate-400 font-mono">{reply.date}</span>
                                    </div>
                                    <p className="text-slate-600 font-medium leading-snug">{reply.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply typing input */}
                          {replyingToCommentId === comm.id && (
                            <div className="pl-9 mt-1.5 flex gap-2 items-center">
                              <img 
                                src={(realLoggedInUser || userProfile).avatar} 
                                alt={(realLoggedInUser || userProfile).name} 
                                referrerPolicy="no-referrer"
                                className="w-6 h-6 rounded-full object-cover border shrink-0" 
                              />
                              <div className="flex-1 flex gap-1 items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 relative">
                                <input 
                                  type="text"
                                  value={replyInputText}
                                  onChange={(e) => setReplyInputText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleSendReply(comm.id, post.id, false);
                                    }
                                  }}
                                  placeholder="Escribe una respuesta..."
                                  className="w-full bg-transparent text-[11px] focus:outline-none font-sans text-slate-800"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (activeEmojiPicker?.type === 'reply' && activeEmojiPicker?.id === comm.id) {
                                      setActiveEmojiPicker(null);
                                    } else {
                                      setActiveEmojiPicker({ type: 'reply', id: comm.id });
                                    }
                                  }}
                                  onMouseEnter={() => handleEmojiPickerMouseEnter('reply', comm.id)}
                                  onMouseLeave={handleEmojiPickerMouseLeave}
                                  className="text-slate-400 hover:text-slate-600 transition p-0.5 text-xs select-none cursor-pointer"
                                >
                                  😊
                                </button>
                                {activeEmojiPicker?.type === 'reply' && activeEmojiPicker?.id === comm.id && (
                                  <div 
                                    className="absolute bottom-full right-0 mb-2 bg-white border border-slate-200 shadow-xl rounded-xl p-2.5 z-[260] w-60"
                                    onClick={(e) => e.stopPropagation()}
                                    onMouseEnter={() => handleEmojiPickerMouseEnter('reply', comm.id)}
                                    onMouseLeave={handleEmojiPickerMouseLeave}
                                  >
                                    <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-2 font-sans text-left">
                                      Reacciones Rápidas
                                    </div>
                                    <div className="grid grid-cols-6 gap-1.5">
                                      {POPULAR_EMOJIS.map((emoji) => (
                                        <button
                                          key={emoji}
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setReplyInputText(prev => prev + emoji);
                                          }}
                                          className="text-lg hover:scale-125 hover:bg-slate-50 rounded p-1 transition-transform cursor-pointer flex items-center justify-center"
                                        >
                                          {emoji}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSendReply(comm.id, post.id, false)}
                                className="px-3 py-1 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black cursor-pointer border-none transition shrink-0 uppercase"
                              >
                                Enviar
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Close Comments action ribbon */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveCommentsPostId(null)}
                      className="text-[10px] font-bold text-indigo-650 hover:text-slate-800 flex items-center gap-1 bg-indigo-50/60 hover:bg-indigo-100/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      title="Contraer los comentarios de esta publicación"
                    >
                      <ChevronUp className="w-3 h-3" />
                      <span>Contraer comentarios</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden" id="facebook-profile-view">
      {/* 📘 FACEBOOK BLUE BRAND BAR INFO BOX */}
      <div className="bg-indigo-620/10 text-indigo-700 p-4 rounded-2xl flex items-center gap-3 border border-indigo-200">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
        <div className="text-xs">
          <h4 className="font-bold">
            {userProfile.role === 'model' 
              ? "Muro de Trabajo y Atracción del Modelo" 
              : "Muro Social y Actividad de la Red"}
          </h4>
          <p className="text-slate-600 mt-0.5">
            {userProfile.role === 'model'
              ? "Aquí tienes tu página de perfil con formato Facebook Social Feed para subir tus fotos, captar mecenas a través de enlaces directos, comentarios de pasarela, y construir tu comunidad, junto con el listado oficial de nuestros modelos patrocinadores."
              : "Inspírate y conéctate con la industria de la moda. Sube tus ideas de inversión, añade fotos, publica en tu muro, y supervisa tus estadísticas dinámicas de mecenazgo y patrocinio."}
          </p>
        </div>
      </div>

      {/* 🚀 FACEBOOK PROFILE HEADER CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {/* Cover Photo */}
        <div className="h-44 sm:h-56 bg-slate-250 relative overflow-hidden">
          <img 
            src={userProfile.banner || currentModel?.banner || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200"} 
            alt="Facebook Cover" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          
          {isOwnProfile && (
            <>
              <input
                type="file"
                accept="image/*"
                id="model-cover-photo-upload"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const dataUrl = await compressAndResizeImage(file);
                      // Update current user cover banner
                      const nextProfile = {
                        ...userProfile,
                        banner: dataUrl
                      };
                      onUpdateProfile(nextProfile);

                      // Update this model's cover banner in globals
                      const nextModels = models.map(m => {
                        if (m.id === userProfile.id) {
                          return {
                            ...m,
                            banner: dataUrl
                          };
                        }
                        return m;
                      });
                      onUpdateModels(nextModels);
                      alert('✨ ¡Tu foto de portada de Modelo ha sido actualizada con éxito!');
                    } catch (err) {
                      console.error('Error compressing cover photo:', err);
                      alert('⚠️ Error al procesar la imagen.');
                    }
                  }
                }}
              />
              <div className="absolute top-4 right-4 flex flex-wrap gap-2 z-10 select-none">
                <label 
                  htmlFor="model-cover-photo-upload"
                  className="bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer border border-white/20 shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Editar foto de portada</span>
                </label>


              </div>
            </>
          )}
        </div>

        {/* Profile Details Overlap Panel */}
        <div className="px-6 pt-5 pb-6 relative">

          {/* Ajustes de Privacidad Gear Button - Aligned to the far right on the same level as the name */}
          <div className="absolute top-2.5 right-6 z-30 group">
            <button
              type="button"
              onClick={() => setShowSettingsDrawer(true)}
              className="w-10 h-10 rounded-xl bg-white hover:bg-slate-50 text-[#443a3c] transition cursor-pointer flex items-center justify-center shadow-md hover:scale-105 active:scale-95 duration-200 border border-slate-200"
              title="Ajustes de Privacidad"
              id="settings-gear-button"
            >
              <Settings className="w-5 h-5 shrink-0 hover:rotate-45 duration-300 ease-in-out text-slate-700" />
            </button>
            <div className="absolute right-0 top-full mt-2 bg-slate-900 border border-slate-800 text-white text-[10px] font-black tracking-wide py-1.5 px-3 rounded-xl shadow-xl opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap z-50 flex items-center gap-1.5 font-sans">
              <span>⚙️</span> Ajustes de privacidad
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 mb-4 select-none">
            {/* Avatar overlay */}
            <div 
              onClick={() => {
                if (profileActiveStories.length > 0) {
                  setSelectedStoryForPreview({
                    id: profileActiveStories[0].id,
                    title: profileActiveStories[0].title,
                    image: profileActiveStories[0].image,
                    isVideo: profileActiveStories[0].isVideo
                  });
                  setProfileStorySubIndex(0);
                } else if (isOwnProfile) {
                  setTempAvatarUrl(userProfile.avatar);
                  setIsEditingAvatar(true);
                }
              }}
              className={`w-32 h-32 rounded-full overflow-hidden shadow-md relative bg-slate-100 z-15 group -mt-16 sm:-mt-20 shrink-0 transition-all duration-300 ${
                profileActiveStories.length > 0 
                  ? 'p-[4px] bg-gradient-to-tr from-yellow-400 via-[#fe2c55] to-purple-600 ring-4 ring-offset-2 ring-[#fe2c55]/80 cursor-pointer animate-pulse-subtle' 
                  : 'border-4 border-white'
              }`}
            >
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name} 
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover rounded-full ${profileActiveStories.length > 0 ? 'border border-white p-[1px]' : ''}`} 
              />
              {isOwnProfile && profileActiveStories.length === 0 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setTempAvatarUrl(userProfile.avatar);
                    setIsEditingAvatar(true);
                  }}
                  className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer text-[10px] font-bold rounded-full"
                  title="Cambiar foto de perfil"
                >
                  <Camera className="w-5 h-5 mb-1 text-white" />
                  <span>Editar foto</span>
                </button>
              )}
              {profileActiveStories.length > 0 && (
                <div className="absolute bottom-1 right-1 bg-red-650 text-white font-black text-[7px] px-1.5 py-0.5 rounded-full border border-white z-20 uppercase tracking-tighter">
                  Ver 24h
                </div>
              )}
            </div>
            
            {/* Wrapper for details on the left, action buttons on the far right margin */}
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
              {/* Text description details */}
              <div className="text-center sm:text-left space-y-1 z-10">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 leading-tight whitespace-nowrap">
                    {userProfile.name}
                  </h2>
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                    Verificado ✓
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 shrink-0 ${
                    userProfile.role === 'model' 
                      ? 'bg-amber-100 text-amber-700' 
                      : userProfile.role === 'investor'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {userProfile.role === 'model' 
                      ? 'Top 10 Modelo' 
                      : userProfile.role === 'investor'
                      ? 'Inversor Principal'
                      : 'Visitante Autorizado'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">@{userProfile.username}</p>
                {fashionAgency && (
                  <div className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-slate-700 bg-pink-50/60 border border-pink-100/80 px-3 py-1 rounded-full shadow-3xs animate-fade-in select-none">
                    <span className="text-pink-500 font-extrabold animate-pulse">✦</span>
                    <span>Agencia / Firma: <strong className="text-pink-600 font-bold">{fashionAgency}</strong></span>
                  </div>
                )}
              </div>

              {/* Quick action buttons - PUSHED ALL THE WAY TO THE RIGHT MARGIN & SHIFTED 1 CM DOWN */}
              <div className="flex flex-wrap gap-2.5 items-center justify-center sm:justify-end shrink-0 sm:ml-auto z-10 pr-0 translate-y-7 sm:translate-y-9">
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToTab) {
                      onNavigateToTab('sessions');
                    } else {
                      alert('Navegando a Sesiones...');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition cursor-pointer select-none bg-gradient-to-r from-pink-500 to-rose-600 border border-pink-650 text-white hover:brightness-[1.04] shadow-md hover:scale-102 active:scale-98 duration-100"
                >
                  <span>🎬 Ir a Sesiones</span>
                </button>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 my-4" />

          {/* Model Statistics Metrics Box */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
            {userProfile.role === 'model' ? (
              <>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Referidos Activos</span>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <strong className="text-slate-800 text-sm font-mono">{currentModel?.referidosCount ?? 0}</strong>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Likes Totales</span>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                    <strong className="text-slate-800 text-sm font-mono">{currentModel?.totalLikes ?? 0}</strong>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Comisiones Ganadas</span>
                  <strong className="text-emerald-600 text-sm font-mono block mt-0.5">+{userProfile.totalCommissions.toFixed(2)}€</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Miembros Afiliados</span>
                  <strong className="text-indigo-600 text-sm font-mono block mt-0.5">Activado</strong>
                </div>
              </>
            ) : (
              <>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Mi Balance</span>
                  <strong className="text-indigo-600 text-sm font-mono block mt-0.5">{userProfile.balance.toFixed(2)}€</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Inversión Total</span>
                  <strong className="text-emerald-600 text-sm font-mono block mt-0.5">{userProfile.totalInvested.toFixed(2)}€</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Ganancias Totales</span>
                  <strong className="text-slate-800 text-sm font-mono block mt-0.5">{userProfile.totalEarnings.toFixed(2)}€</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Comisiones Recibidas</span>
                  <strong className="text-rose-600 text-sm font-mono block mt-0.5">+{userProfile.totalCommissions.toFixed(2)}€</strong>
                </div>
              </>
            )}
          </div>

          {/* AMIGOS, SEGUIDORES & SEGUIDOS BUTTONS (HORIZONTAL & COMPACT) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleSetSocialModal('friends')}
              className="flex items-center justify-between px-3 py-2 rounded-xl border border-pink-200 bg-gradient-to-r from-white to-pink-50/40 hover:from-pink-50 hover:to-pink-100/40 transition duration-150 cursor-pointer text-left select-none"
            >
              <div className="flex items-center gap-2 min-w-0">
                <UserPlus className="w-4 h-4 text-pink-550 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[8.5px] uppercase font-bold text-pink-500 tracking-wider font-mono block truncate">Amigos</span>
                  <span className="text-xs font-black text-slate-800 font-mono">
                    {userProfile.role === 'model' ? '142' : '5'}
                  </span>
                </div>
              </div>
              <span className="text-[9.5px] font-bold text-pink-600 flex items-center gap-0.5 shrink-0">Ver todos <span className="text-[7.5px]">→</span></span>
            </button>

            <button
              onClick={() => handleSetSocialModal('followers')}
              className="flex items-center justify-between px-3 py-2 rounded-xl border border-pink-200 bg-gradient-to-r from-white to-pink-50/40 hover:from-pink-50 hover:to-pink-100/40 transition duration-150 cursor-pointer text-left select-none"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Users className="w-4 h-4 text-pink-550 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[8.5px] uppercase font-bold text-pink-500 tracking-wider font-mono block truncate">Seguidores</span>
                  <span className="text-xs font-black text-slate-800 font-mono">
                    {userProfile.role === 'model'
                      ? (currentModel?.followersCount || 1420).toLocaleString()
                      : "8"
                    }
                  </span>
                </div>
              </div>
              <span className="text-[9.5px] font-bold text-pink-600 flex items-center gap-0.5 shrink-0">Ver todos <span className="text-[7.5px]">→</span></span>
            </button>

            <button
              onClick={() => handleSetSocialModal('following')}
              className="flex items-center justify-between px-3 py-2 rounded-xl border border-pink-200 bg-gradient-to-r from-white to-pink-50/40 hover:from-pink-50 hover:to-pink-100/40 transition duration-150 cursor-pointer text-left select-none"
            >
              <div className="flex items-center gap-2 min-w-0">
                <UserCheck className="w-4 h-4 text-pink-550 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[8.5px] uppercase font-bold text-pink-500 tracking-wider font-mono block truncate">Seguidos</span>
                  <span className="text-xs font-black text-slate-800 font-mono">
                    {userProfile.role === 'model'
                      ? Math.floor((currentModel?.followersCount || 1420) / 10 + 12).toLocaleString()
                      : "14"
                    }
                  </span>
                </div>
              </div>
              <span className="text-[9.5px] font-bold text-pink-600 flex items-center gap-0.5 shrink-0">Ver todos <span className="text-[7.5px]">→</span></span>
            </button>
          </div>
        </div>
      </div>

      {/* 📅 DYNAMIC CALENDAR BOOKING SYSTEM POPUP MODAL (CONECTADA A GOOGLE CALENDAR) */}
      {showBookingSystem && (() => {
        const targetModelForCalendar = userProfile.role === 'model' 
          ? (currentModel || models[0]) 
          : (models.find(m => m.id === userProfile.patrocinadorId) || models[0]);

        if (targetModelForCalendar) {
          return (
            <div className="fixed inset-0 z-[110] flex items-start sm:items-center justify-center bg-slate-950/80 p-2 sm:p-4 animate-fade-in font-sans backdrop-blur-md overflow-y-auto">
              <div className="bg-white border border-indigo-200 rounded-3xl w-full max-w-4xl text-slate-900 shadow-2xl relative my-auto overflow-hidden">
                
                {/* Header connected notice */}
                <div className="bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#FBBC05] p-0.5" />
                <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                      <Calendar className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-500 text-white text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                          ● GOOGLE CALENDAR ACTIVO
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Días y horas oficiales</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-black uppercase tracking-wide font-display mt-0.5 text-white">
                        Agenda Oficial de @{targetModelForCalendar.username}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-slate-300 font-medium hidden md:inline">
                      Disponibilidad Sincronizada
                    </span>
                    <button
                      onClick={() => setShowBookingSystem(false)}
                      className="px-4 py-1.5 bg-rose-600/90 hover:bg-rose-700 text-white hover:text-white font-bold text-xs rounded-lg transition cursor-pointer border-0"
                    >
                      Ocultar Agenda
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6 bg-slate-50 max-h-[82vh] overflow-y-auto text-left">
                  <ModelBookingSystem
                    model={targetModelForCalendar}
                    viewerUser={userProfile}
                    onSendMessage={onSendMessage}
                  />
                </div>

              </div>
            </div>
          );
        }
        return null;
      })()}

      {/* 🤝 ACUERDO DE PATROCINIO SECCIÓN */}
      {(showAgreementForm || signedAgreements[userProfile.id]) && (
        <div className="mb-6 animate-fade-in">
          {signedAgreements[userProfile.id] ? (
            <div className="bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border-2 border-amber-500/40 rounded-2xl p-5 space-y-3 text-left relative overflow-hidden bg-white shadow-xs">
              <div className="absolute top-2 right-4 rotate-12 text-amber-500/15 font-black text-3xl uppercase select-none pointer-events-none">
                FIRMADO
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-black text-amber-600 uppercase tracking-widest block font-mono">
                  🤝 Acuerdo Contractual Sellado de Patrocinio
                </span>
              </div>
              <p className="text-slate-700 text-xs leading-normal font-medium">
                ¡Enhorabuena! Se ha establecido y sellado formalmente una alianza de patrocinio y co-branding con <strong>{userProfile.name}</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs font-mono text-slate-800">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Empresa / Patrocinador</span>
                  <strong className="text-slate-800 font-bold">{signedAgreements[userProfile.id].company}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Monto del Acuerdo</span>
                  <strong className="text-emerald-600 font-black">{Number(signedAgreements[userProfile.id].amount).toLocaleString()} €</strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Campaña Elegida</span>
                  <strong className="text-indigo-600 font-medium">{signedAgreements[userProfile.id].campaign}</strong>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold pl-1">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Firma Digital Sincronizada y Activa en Blockchain</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const updated = { ...signedAgreements };
                    delete updated[userProfile.id];
                    setSignedAgreements(updated);
                    localStorage.setItem('coll_signed_agreements', JSON.stringify(updated));
                  }}
                  className="text-[10px] text-red-600 hover:underline font-bold bg-transparent border-0 cursor-pointer p-1"
                >
                  Regenerar / Cancelar Acuerdo
                </button>
              </div>
            </div>
          ) : showAgreementForm ? (
            <div className="bg-slate-50 border-2 border-indigo-500/30 rounded-2xl p-5 space-y-4 text-left shadow-xs">
              <div className="border-b border-slate-150 pb-2">
                <strong className="text-sm font-bold text-slate-800 block font-display">📝 Registrar Acuerdo de Patrocinio Oficial</strong>
                <span className="text-[10px] text-slate-500 font-medium block">
                  Crea una propuesta vinculante para asociar y patrocinar de manera oficial las marcas y colecciones con {userProfile.name}.
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold">Nombre de la Empresa o Marca para el Acuerdo:</label>
                  <input 
                    type="text"
                    value={agreementCompany}
                    onChange={(e) => setAgreementCompany(e.target.value)}
                    placeholder="Ej. Eco Builders, Creative Media, o tu marca"
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold">Bolsa de Patrocinio Propuesta (€):</label>
                  <select 
                    value={agreementAmount}
                    onChange={(e) => setAgreementAmount(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="5000">5.000 €</option>
                    <option value="15000">15.000 €</option>
                    <option value="25000">25.000 €</option>
                    <option value="50000">50.000 €</option>
                    <option value="100000">100.000 €</option>
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="block text-slate-700 font-bold">Campaña / Línea de Diseño Promocional Asociada:</label>
                  <input 
                    type="text"
                    value={agreementCampaign}
                    onChange={(e) => setAgreementCampaign(e.target.value)}
                    placeholder="Ej. Colección Cápsula Internacional - Verano"
                    className="w-full bg-white border border-slate-250 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    if (!agreementCompany.trim()) {
                      alert('⚠️ Por favor escribe el nombre de la Empresa o Marca interesada.');
                      return;
                    }
                    const updated = {
                      ...signedAgreements,
                      [userProfile.id]: {
                        company: agreementCompany,
                        amount: agreementAmount,
                        campaign: agreementCampaign
                      }
                    };
                    setSignedAgreements(updated);
                    localStorage.setItem('coll_signed_agreements', JSON.stringify(updated));
                    setShowAgreementForm(false);
                  }}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center transition cursor-pointer"
                >
                  ✍️ Firmar Acuerdo de Patrocinio Oficial
                </button>
                <button
                  type="button"
                  onClick={() => setShowAgreementForm(false)}
                  className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-center transition cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* 📹 HISTORIAL DE VÍDEOS SUBIDOS PARA MODELOS Y INVERSORES */}
      {showUploadedVideos && (
        <div className="mb-6 animate-fade-in">
          <UserUploadedVideos userProfile={userProfile} />
        </div>
      )}

      {/* 👥 FACEBOOK TWO-COLUMN PAGE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Facebook Intro Information and Photos */}
        <aside className="lg:col-span-12 space-y-6">
          
          {activeProfileOrWallTab === 'perfil' && (
            <>
              {/* Intro Information Cards (FB Intro style) */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-xs">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1">
                <span>Información / Intro</span>
              </h3>
            </div>

            {/* Custom user-editable presentation/intro text */}
            <div className="space-y-2 text-left">
              <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/50 border border-slate-100 p-3.5 rounded-xl whitespace-pre-line">
                {bioText || 'Mecanismo de afiliación activo. ¡Apóyame en las mesas de inversión!'}
              </p>
            </div>

              <hr className="border-slate-100" />

              {/* Status details indicators */}
              <div className="text-xs space-y-2 text-slate-700">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-sky-500 font-bold" />
                  <span>Espacio de Trabajo: <strong>España / Remoto</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-fuchsia-500 font-bold" />
                  <span>Sígueme en Instagram: <strong className="text-indigo-650">@{userProfile.username}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500 font-bold" />
                  <span>Sponsoring: <strong className="text-emerald-600">Comisión 10% activa</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500 font-bold" />
                  <span>Mis amigos: <strong className="text-indigo-650">{userProfile.role === 'model' ? 142 : 5} amigos</strong></span>
                </div>
              </div>
            </div>

          {/* 🤝 EMPRESAS QUE PATROCINO */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-xs text-left">
            <div>
              <h3 className="text-xs font-bold text-slate-850 uppercase tracking-widest flex items-center gap-1.5">
                <span>🤝</span>
                <span>Empresas que Patrocino</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">Sponsors con quienes tengo un acuerdo verificado en Casting Live e intermediación.</p>
            </div>
            
            <div className="space-y-3">
              {/* If there are any signed agreements, we can show them, plus default premium brands! */}
              {Object.keys(signedAgreements).length > 0 ? (
                (Object.values(signedAgreements) as any[]).map((ag, idx) => {
                  if (!ag || typeof ag !== 'object') return null;
                  const companyName = ag.company || 'Empresa';
                  const campaignName = ag.campaign || 'Campaña';
                  const amountValue = ag.amount || '0';
                  return (
                    <div key={idx} className="bg-gradient-to-r from-rose-50/20 to-pink-50/10 border border-rose-100/50 rounded-xl p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold uppercase shrink-0">
                        {String(companyName).substring(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-850 truncate">{companyName}</p>
                        <p className="text-[10px] text-rose-500 font-medium truncate">{campaignName}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-black px-1.5 py-0.5 rounded-full">
                          {String(amountValue).includes('/') ? amountValue : `${Number(amountValue).toLocaleString()}€`}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : null}

              {/* Default Premium Brand partnerships to keep it populated! */}
              <div 
                onClick={() => {
                  if (onNavigateToTab) {
                    onNavigateToTab('casting_live', 'victorias_secret_spain');
                  }
                }}
                className="bg-gradient-to-r from-pink-50/20 to-slate-50/20 border border-slate-100 hover:border-pink-200 hover:shadow-xs active:scale-[0.99] transition-all duration-150 rounded-xl p-3 flex items-center gap-3 cursor-pointer"
              >
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=100" 
                  alt="VS" 
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-850">Victoria's Secret Spain</p>
                  <p className="text-[10px] text-pink-600 font-semibold font-sans">Pódium Logo Oficial & Gala Verano</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-1.5 py-0.5 rounded-full font-mono">15.000€</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50/25 to-slate-50/20 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=100" 
                  alt="Loreal" 
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-850 font-sans">L'Oréal Group</p>
                  <p className="text-[10px] text-purple-600 font-semibold font-sans font-sans">Casting Live Product Ads - Maquillaje</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-1.5 py-0.5 rounded-full font-mono">32.000€</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50/15 to-slate-50/15 border border-slate-100 rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] shrink-0 font-bold text-slate-550">
                  CH
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-850 font-sans">Carolina Herrera España</p>
                  <p className="text-[10px] text-indigo-500 font-semibold font-sans">Sponsor de Pasarela de Alta Costura</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-1.5 py-0.5 rounded-full font-mono">25.000€</span>
                </div>
              </div>
            </div>
          </div>

          {/* 💼 SECCIÓN DE CONTRATACIÓN (Solo visible para perfiles de MODELOS) / PORTAL PREMIUM DE RANKINGS para perfiles de INVERSORES */}
          {userProfile.role === 'model' ? (
            <div className="bg-gradient-to-br from-[#ffffff] to-[#fffafb] border-2 border-pink-100 text-slate-900 rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden select-none">
              {/* Ambient elegant light rose overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/40 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-pink-100/70 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-1.5 bg-rose-500/10 rounded-lg text-rose-600 border border-rose-500/20 text-[10px] font-mono font-black uppercase tracking-wider">
                    B2B
                  </span>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-mono">
                    Contratación de modelo y partnerships
                  </h3>
                </div>
              </div>

              {isEditingCommercial ? (
                <div className="space-y-4 text-xs bg-[#fffbff] border border-[#ffebf0] p-4 rounded-xl shadow-3xs">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block font-mono">Email Profesional:</label>
                    <input
                      type="email"
                      value={tempProfEmail}
                      onChange={(e) => setTempProfEmail(e.target.value)}
                      className="w-full bg-white border border-pink-150 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block font-mono">Ciudad / Base:</label>
                    <input
                      type="text"
                      value={tempProfCity}
                      onChange={(e) => setTempProfCity(e.target.value)}
                      className="w-full bg-white border border-pink-150 rounded-lg p-2 text-xs text-slate-850 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setProfEmail(tempProfEmail);
                      setProfCity(tempProfCity);
                      localStorage.setItem(`prof_email_${userProfile.id}`, tempProfEmail);
                      localStorage.setItem(`prof_city_${userProfile.id}`, tempProfCity);
                      setIsEditingCommercial(false);
                      alert('✨ ¡Información de perfil comercial guardada correctamente!');
                    }}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition cursor-pointer border-0 shadow-sm"
                  >
                    Guardar Perfil Comercial
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 text-xs text-slate-755">
                  <h4 className="text-[11px] font-black font-display text-rose-600 tracking-wide uppercase text-left">
                    Colaboraciones / Business inquiries
                  </h4>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white border border-pink-150/65 p-4 rounded-xl shadow-3xs">
                    {/* Left side: Professional Email and City Base */}
                    <div className="space-y-3.5 text-left">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-slate-400 shrink-0 border border-rose-100">
                          <Mail className="w-4 h-4 text-rose-500 font-bold" />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono leading-tight">Email Profesional</span>
                          <a href={`mailto:${profEmail}`} className="text-slate-855 hover:text-rose-600 font-extrabold transition cursor-pointer break-all font-mono">
                            {profEmail}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-slate-400 shrink-0 border border-emerald-100">
                          <MapPin className="w-4 h-4 text-emerald-500 font-bold" />
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono leading-tight">Ciudad / Base</span>
                          <span className="text-slate-800 font-bold font-sans">
                            {profCity}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Luxurious golden crown Ranking button */}
                    <div className="shrink-0 flex items-center justify-start md:justify-end">
                      <button
                        onClick={() => {
                          if (onOpenRanking) {
                            onOpenRanking();
                          } else {
                            const btn = document.getElementById('btn-victoria-secret-ranking') || document.getElementById('btn-victoria-secret-ranking-banner');
                            if (btn) btn.click();
                          }
                        }}
                        className="bg-[#FDFBF7] hover:bg-[#F9F5EC] text-slate-950 rounded-2xl border-2 border-[#D3B470] shadow-[0_4px_15px_-4px_rgba(211,180,112,0.3)] hover:shadow-[0_8px_25px_-4px_rgba(211,180,112,0.4)] transition-all duration-300 flex items-center justify-center py-2 px-5 gap-0 shrink-0 cursor-pointer group active:scale-[0.98] select-none h-fit"
                        title="Explorar el Podio de Modelos TOP 100"
                      >
                        {/* Beautiful Elegant Crown SVG on the left */}
                        <div className="flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                          <svg className="w-9 h-7 text-[#B4975A] fill-current" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22,48 L78,48 L75,44 L25,44 Z" fill="#B4975A" />
                            <rect x="20" y="49" width="60" height="3.5" fill="#8E7238" rx="1" />
                            <path 
                              d="M 21.5 43 
                                 C 11 31, 23 23, 27 26 
                                 C 33 20, 36 32, 40 35 
                                 C 43.5 10, 50 13, 50 13 
                                 C 50 13, 56.5 10, 60 35 
                                 C 64 32, 67 20, 73 26 
                                 C 77 23, 89 31, 78.5 43 
                                 Z" 
                              fill="#B4975A" 
                            />
                            <path 
                              d="M 50 13 
                                 C 44 24, 44 36, 50 43 
                                 C 56 36, 56 24, 50 13 
                                 Z" 
                              fill="#8E7238" 
                            />
                            <path d="M46.5,21 C43,24 40,21 38,18 C42,19 47,25 48.5,31 Z M53.5,21 C57,24 60,21 62,18 C58,19 53,25 51.5,31 Z" fill="#B4975A" />
                            <path d="M50,11.5 C48,20 43,28 43,34 C43,43 57,43 57,34 C57,28 52,20 50,11.5 Z" fill="#B4975A" stroke="#705625" strokeWidth="0.5" />
                            <circle cx="17.5" cy="28.5" r="2" fill="#FFF" stroke="#B4975A" strokeWidth="1" />
                            <circle cx="28.5" cy="20.5" r="1.8" fill="#FFF" stroke="#B4975A" strokeWidth="1" />
                            <circle cx="50" cy="9.5" r="2.5" fill="#FFF" stroke="#B4975A" strokeWidth="1.2" />
                            <circle cx="71.5" cy="20.5" r="1.8" fill="#FFF" stroke="#B4975A" strokeWidth="1" />
                            <circle cx="82.5" cy="28.5" r="2" fill="#FFF" stroke="#B4975A" strokeWidth="1" />
                            <polygon points="30,46.5 32,44.5 30,42.5 28,44.5" fill="#FFF" />
                            <polygon points="40,46.5 42,44.5 40,42.5 38,44.5" fill="#FFF" />
                            <polygon points="50,46.5 52,44.5 50,42.5 48,44.5" fill="#FFF" />
                            <polygon points="60,46.5 62,44.5 60,42.5 58,44.5" fill="#FFF" />
                            <polygon points="70,46.5 72,44.5 70,42.5 68,44.5" fill="#FFF" />
                          </svg>
                        </div>
                        <div className="h-5 w-[1px] bg-[#D3B470]/60 mx-3" />
                        <span className="font-serif text-xs font-bold text-[#B4975A] tracking-[0.15em] select-none">
                          RANKING
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3.5 border-t border-pink-100 text-left">
                  <div className="flex flex-col gap-1 mb-3.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono block">
                      ¿Qué ofreces? / Contrata directamente
                    </span>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Accede al catálogo interactivo y consulta los 15 tipos de contratos regulados estándar de la industria.
                    </p>
                  </div>
                  
                  {/* Premium visual banner and wide pulse button to open contract page modal */}
                  <div className="bg-rose-50/40 border border-pink-100 rounded-2xl p-4 text-center space-y-3 shadow-3xs mb-3">
                    <div className="inline-flex p-2 bg-rose-500/10 text-[#fe2c55] rounded-xl border border-rose-500/10">
                      <Briefcase className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-wide">Catálogo de Modalidades de Contratación</h4>
                      <p className="text-[11px] text-slate-500 max-w-md mx-auto leading-normal">
                        Consulta y selecciona entre 15 tipos de servicios profesionales, contratos de imagen y representación con pasarela y catálogo.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowContractsModal(true)}
                      className="w-full py-3 bg-gradient-to-r from-rose-500 via-[#fe2c55] to-pink-600 hover:brightness-[1.04] text-white font-extrabold text-xs tracking-wider rounded-xl transition duration-155 cursor-pointer border-0 shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <span>📋</span>
                      <span>ABRIR OPCIONES DE CONTRATACIÓN (15 MODALIDADES)</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-1">
                    {/* Agende una cita */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowBookingSystem(!showBookingSystem);
                        if (!showBookingSystem) {
                          setShowAgreementForm(false);
                          setShowUploadedVideos(false);
                        }
                      }}
                      className={`flex-1 flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer shadow-3xs group ${
                        showBookingSystem 
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-900 font-extrabold ring-1 ring-indigo-500 hover:scale-[1.01]' 
                          : 'bg-gradient-to-r from-pink-50 via-pink-100/60 to-pink-50 border border-pink-100/60 hover:scale-[1.01]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Calendar className="w-3.5 h-3.5 shrink-0 text-pink-500 group-hover:text-[#fe2c55] transition-colors" />
                        <span className="font-semibold text-[11px] text-slate-750 group-hover:text-slate-900 transition-colors truncate uppercase tracking-wide">Agende una cita</span>
                      </div>
                      <span className="text-[8px] uppercase font-black font-mono text-rose-500 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-md group-hover:bg-rose-100/50 transition shrink-0 ml-1">
                        {showBookingSystem ? 'Ocultar' : 'Reservar'}
                      </span>
                    </button>

                    {/* Casting Live */}
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.setItem('casting_live_default_category_filter', 'Finanzas');
                        if (onNavigateToTab) {
                          onNavigateToTab('casting_live');
                        } else {
                          alert(`Navegando al canal de Finanzas de Casting Live...`);
                        }
                      }}
                      className="flex-1 flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-50 via-pink-100/70 to-[#fe2c55]/85 border border-pink-200/50 hover:scale-[1.01] transition-all duration-200 cursor-pointer shadow-3xs group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#fe2c55] shrink-0 shadow-xs animate-pulse" />
                        <span className="font-extrabold text-[11px] text-slate-900 group-hover:text-black transition-colors truncate uppercase tracking-wide">Casting Live</span>
                      </div>
                      <span className="text-[8px] uppercase font-black font-mono text-rose-600 bg-white border border-rose-100 px-1.5 py-0.5 rounded-md group-hover:bg-rose-50 transition shrink-0 ml-1">Ver Directo</span>
                    </button>
                  </div>
                </div>

                {/* 📋 LUXURIOUS PORTAL DE OPCIONES DE CONTRATACIÓN OVERLAY PAGE */}
                {showContractsModal && (() => {
                  const contractServicesList = [
                    { label: '📸 Sesión de fotos', contract: 'Contrato de prestación de servicios + cesión/licencia de imagen', counterparty: 'Marca/Fotógrafo ↔ Modelo' },
                    { label: '📺 Publicidad', contract: 'Contrato de modelo/actor para campaña publicitaria.', counterparty: 'Marca/Agencia publicitaria ↔ Modelo' },
                    { label: '👗 Desfile', contract: 'Contrato de participación en desfile', counterparty: 'Diseñador/Organizador ↔ Modelo' },
                    { label: '📱 Redes sociales', contract: 'Contrato de influencer/creador de contenido', counterparty: 'Marca ↔ Modelo' },
                    { label: '🎬 Vídeo / Reel / TikTok', contract: 'Contrato de creación de contenido', counterparty: 'Marca ↔ Modelo' },
                    { label: '🏪 Embajador de marca', contract: 'Contrato de embajador/Brand Ambassador', counterparty: 'Marca ↔ Modelo' },
                    { label: '🎤 Evento', contract: 'Contrato de actuación o aparición', counterparty: 'Organizador ↔ Modelo' },
                    { label: '🎥 Videoclip', contract: 'Contrato de participación artística', counterparty: 'Productora ↔ Modelo' },
                    { label: '🎬 Cine/TV', contract: 'Contrato artístico o de interpretación', counterparty: 'Productora ↔ Modelo' },
                    { label: '🛍️ E-commerce', contract: 'Contrato de modelo para catálogo', counterparty: 'Marca/Tienda ↔ Modelo' },
                    { label: '📸 Catálogo', contract: 'Contrato de sesión fotográfica + derechos de imagen', counterparty: 'Marca ↔ Modelo' },
                    { label: '🌍 Campaña internacional', contract: 'Contrato de campaña + derechos de uso internacional', counterparty: 'Marca ↔ Modelo' },
                    { label: '🤝 Exclusividad', contract: 'Contrato de exclusividad', counterparty: 'Marca ↔ Modelo' },
                    { label: '🏢 Representación', contract: 'Contrato de representación de modelo', counterparty: 'Agencia ↔ Modelo' },
                    { label: '🔎 Casting', contract: 'Acuerdo de participación en casting', counterparty: 'Agencia/Productora ↔ Modelo' }
                  ];

                  const filteredContracts = contractServicesList.filter(item => {
                    const query = contractSearchQuery.toLowerCase();
                    return item.label.toLowerCase().includes(query) || 
                           item.contract.toLowerCase().includes(query) || 
                           item.counterparty.toLowerCase().includes(query);
                  });

                  return (
                    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-5 animate-fade-in text-slate-900 select-none">
                      <div className="bg-white border border-pink-100 rounded-3xl w-full max-w-4xl p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl relative max-h-[94vh] flex flex-col my-auto" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Close Button top-right */}
                        <button 
                          onClick={() => {
                            setShowContractsModal(false);
                            setContractSearchQuery('');
                          }}
                          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition cursor-pointer border-0 shadow-3xs z-10"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        {/* Title and Header Banner */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-100/80 pb-4.5 shrink-0">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#fe2c55] to-rose-600 flex items-center justify-center text-white shadow-sm shrink-0">
                              <Briefcase className="w-5.5 h-5.5 text-white" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-base sm:text-lg font-black text-slate-950 leading-tight uppercase font-display tracking-wide">
                                Opciones de Contratación Corporativa
                              </h3>
                              <p className="text-[10.5px] sm:text-[11px] text-rose-550 font-mono font-bold uppercase tracking-wider block leading-none mt-1">
                                💼 PORTAL DE ACUERDOS REGULADOS & SESIÓN B2B
                              </p>
                            </div>
                          </div>
                          
                          {/* Search Input inside Header */}
                          <div className="relative w-full sm:w-64">
                            <input
                              type="text"
                              value={contractSearchQuery}
                              onChange={(e) => setContractSearchQuery(e.target.value)}
                              placeholder="Buscar servicio o contrato..."
                              className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:bg-white rounded-xl py-1.5 pl-3 pr-8 text-xs focus:outline-none transition-all font-medium text-slate-800"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                              🔍
                            </span>
                          </div>
                        </div>

                        {/* Table / Grid Body */}
                        <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-slate-50/30">
                            <table className="w-full text-left border-collapse min-w-[640px]">
                              <thead>
                                <tr className="bg-slate-100/85 border-b border-slate-200/80 text-slate-700 font-mono text-[9.5px] sm:text-[10px] uppercase font-black tracking-wider">
                                  <th className="py-3 px-4 w-[28%]">Servicio</th>
                                  <th className="py-3 px-4 w-[42%]">Contrato habitual</th>
                                  <th className="py-3 px-4 w-[20%]">¿Quién contrata?</th>
                                  <th className="py-3 px-4 w-[10%] text-center">Acción</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-800 text-[11px] sm:text-xs">
                                {filteredContracts.length === 0 ? (
                                  <tr>
                                    <td colSpan={4} className="py-8 text-center text-slate-400 font-medium font-mono text-xs">
                                      Ningún servicio coincide con "{contractSearchQuery}"
                                    </td>
                                  </tr>
                                ) : (
                                  filteredContracts.map((item, index) => (
                                    <tr 
                                      key={index} 
                                      className="hover:bg-rose-50/20 transition duration-150 group/row"
                                    >
                                      {/* Servicio Column */}
                                      <td className="py-3 px-4 font-extrabold text-slate-900 flex items-center gap-1.5">
                                        <span className="text-slate-950">{item.label}</span>
                                      </td>
                                      
                                      {/* Contrato habitual Column */}
                                      <td className="py-3 px-4 font-medium text-slate-600 group-hover/row:text-slate-800 transition-colors">
                                        {item.contract}
                                      </td>
                                      
                                      {/* Quien contrata Column */}
                                      <td className="py-3 px-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 border border-slate-200/40 text-slate-600">
                                          {item.counterparty}
                                        </span>
                                      </td>

                                      {/* Acción Column */}
                                      <td className="py-3 px-4 text-center">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            // Trigger contract creation flow!
                                            setSelectedService(item.label);
                                            setShowContractsModal(false);
                                            setHiringSuccessMessage(null);
                                          }}
                                          className="bg-rose-600 hover:bg-[#fe2c55] text-white px-3 py-1 rounded-lg text-[10px] font-extrabold transition cursor-pointer border-0 active:scale-95 shadow-3xs"
                                        >
                                          Contratar
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Modal Footer with disclaimer */}
                        <div className="border-t border-slate-100 pt-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-left text-[10px] sm:text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            🔒 Los flujos financieros y depósito de garantía (escrow) se procesan con saldo seguro de Backoffice.
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setShowContractsModal(false);
                              setContractSearchQuery('');
                            }}
                            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer border-0 active:scale-95 shadow-3xs w-full sm:w-auto text-center"
                          >
                            Cerrar Catálogo
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })()}

                {!isOwnProfile && (
                  <button
                    onClick={() => {
                      setSelectedService("Contratación General B2B / Partnerships");
                      setHiringSuccessMessage(null);
                    }}
                    className="w-full mt-2.5 py-2.5 bg-gradient-to-r from-rose-500 to-[#fe2c55] hover:brightness-[1.04] text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition duration-155 cursor-pointer border-0 shadow-sm flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-white" />
                    <span>Hacer Propuesta Comercial General</span>
                  </button>
                )}
                </>
              )}
            </div>
          ) : (
            /* 🏆 PORTAL DE RANKING & PODIO ELITE (mockup de zzz(2).png para perfiles de inversionistas) */
            <div className="relative overflow-hidden select-none rounded-3xl bg-gradient-to-br from-[#12030a] via-[#1a0712] to-[#250d1bb2] border-2 border-[#D3B470]/60 p-6 sm:p-8 text-white shadow-[0_12px_35px_-4px_rgba(211,180,112,0.18)]">
              {/* Elegant glow decoration */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-b from-[#d3b470]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-pink-900/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
                {/* Left Area: Display Titles and text from zzz(2).png */}
                <div className="space-y-3.5 text-left flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-[#D3B470]/20 text-[#E2C78A] border border-[#D3B470]/40 text-[9px] font-mono font-black uppercase tracking-[0.16em] px-3 py-1 rounded-full shadow-2xs">
                      🏆 SALA DE LA FAMA
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-rose-950/40 text-rose-300 border border-rose-500/15 text-[9px] font-mono font-bold uppercase tracking-[0.16em] px-3 py-1 rounded-full shadow-2xs">
                      GLOBAL ELITE
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-white tracking-wide leading-tight antialiased">
                      Podio de Modelos <span className="text-[#fe2c55] antialiased drop-shadow-[0_2px_8px_rgba(254,44,85,0.4)] font-mono font-black uppercase text-2.5xl tracking-normal ml-1">TOP 100</span>
                    </h3>
                    <p className="text-[11.5px] text-slate-300 leading-relaxed max-w-lg">
                      Visualiza la élite internacional de creadores registrados en Fashion Finances. Desliza horizontalmente para explorar el ranking de 50 mujeres y 50 hombres que lideran las tendencias mundiales.
                    </p>
                  </div>
                </div>

                {/* Right Area: Stat + Ranking Crown button stacked vertically on desktop */}
                <div className="flex flex-row md:flex-col items-center md:items-end gap-3.5 shrink-0 justify-between md:justify-center border-t border-white/5 pt-4 md:border-t-0 md:pt-0">
                  {/* Total model badge */}
                  <div className="bg-black/45 border border-[#D3B470]/20 rounded-2xl p-3 px-4 text-left md:text-right shadow-3xs min-w-[130px] select-none backdrop-blur-xs">
                    <span className="text-[#fe2c55] text-[9.5px] uppercase font-black tracking-widest font-mono block leading-none pb-1.5">
                      TOTAL MODELOS
                    </span>
                    <span className="text-sm font-mono font-extrabold text-[#FFF] block">
                      100 Creadores
                    </span>
                  </div>

                  {/* Golden crown button */}
                  <button
                    onClick={() => {
                      if (onOpenRanking) {
                        onOpenRanking();
                      } else {
                        const btn = document.getElementById('btn-victoria-secret-ranking') || document.getElementById('btn-victoria-secret-ranking-banner');
                        if (btn) btn.click();
                      }
                    }}
                    className="bg-[#FDFBF7] hover:bg-[#F9F5EC] text-slate-950 rounded-2xl border-2 border-[#D3B470] shadow-[0_4px_15px_-4px_rgba(211,180,112,0.3)] hover:shadow-[0_8px_25px_-4px_rgba(211,180,112,0.4)] transition-all duration-300 flex items-center justify-center py-2 px-5 gap-0 shrink-0 cursor-pointer group active:scale-[0.98] select-none h-fit"
                    title="Explorar el Podio de Modelos TOP 100"
                  >
                    <div className="flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                      <svg className="w-9 h-7 text-[#B4975A] fill-current" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22,48 L78,48 L75,44 L25,44 Z" fill="#B4975A" />
                        <rect x="20" y="49" width="60" height="3.5" fill="#8E7238" rx="1" />
                        <path 
                          d="M 21.5 43 
                             C 11 31, 23 23, 27 26 
                             C 33 20, 36 32, 40 35 
                             C 43.5 10, 50 13, 50 13 
                             C 50 13, 56.5 10, 60 35 
                             C 64 32, 67 20, 73 26 
                             C 77 23, 89 31, 78.5 43 
                             Z" 
                          fill="#B4975A" 
                        />
                        <path 
                          d="M 50 13 
                             C 44 24, 44 36, 50 43 
                             C 56 36, 56 24, 50 13 
                             Z" 
                          fill="#8E7238" 
                        />
                        <path d="M46.5,21 C43,24 40,21 38,18 C42,19 47,25 48.5,31 Z M53.5,21 C57,24 60,21 62,18 C58,19 53,25 51.5,31 Z" fill="#B4975A" />
                        <path d="M50,11.5 C48,20 43,28 43,34 C43,43 57,43 57,34 C57,28 52,20 50,11.5 Z" fill="#B4975A" stroke="#705625" strokeWidth="0.5" />
                        <circle cx="17.5" cy="28.5" r="2" fill="#FFF" stroke="#B4975A" strokeWidth="1" />
                        <circle cx="28.5" cy="20.5" r="1.8" fill="#FFF" stroke="#B4975A" strokeWidth="1" />
                        <circle cx="50" cy="9.5" r="2.5" fill="#FFF" stroke="#B4975A" strokeWidth="1.2" />
                        <circle cx="71.5" cy="20.5" r="1.8" fill="#FFF" stroke="#B4975A" strokeWidth="1" />
                        <circle cx="82.5" cy="28.5" r="2" fill="#FFF" stroke="#B4975A" strokeWidth="1" />
                        <polygon points="30,46.5 32,44.5 30,42.5 28,44.5" fill="#FFF" />
                        <polygon points="40,46.5 42,44.5 40,42.5 38,44.5" fill="#FFF" />
                        <polygon points="50,46.5 52,44.5 50,42.5 48,44.5" fill="#FFF" />
                        <polygon points="60,46.5 62,44.5 60,42.5 58,44.5" fill="#FFF" />
                        <polygon points="70,46.5 72,44.5 70,42.5 68,44.5" fill="#FFF" />
                      </svg>
                    </div>
                    <div className="h-5 w-[1px] bg-[#D3B470]/60 mx-3" />
                    <span className="font-serif text-xs font-bold text-[#B4975A] tracking-[0.15em] select-none">
                      RANKING
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

            {/* 💎 HIGHLY POLISHED SERVICES HIRING MODAL */}
            {selectedService === "Apariciones en los resultados finales" && (
              <div className="fixed inset-0 z-[150] flex items-start sm:items-center justify-center bg-slate-950/80 p-2 sm:p-4 animate-fade-in font-sans backdrop-blur-xs overflow-y-auto">
                <div className="bg-white border border-pink-100 rounded-3xl w-full max-w-4xl p-5 sm:p-8 text-slate-900 space-y-6 shadow-2xl relative my-auto max-h-[92vh] sm:max-h-[94vh] overflow-y-auto">
                  
                  {/* Close button */}
                  <button 
                    onClick={() => {
                      setSelectedService(null);
                      setNewSponsorName('');
                      setNewSponsorSector('');
                      setNewSponsorLogoUrl(null);
                      setNewSponsorLogoFilename(null);
                    }}
                    className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition cursor-pointer border-0 shadow-3xs"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Header */}
                  <div className="text-center space-y-2 border-b border-pink-100 pb-5">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-2xl text-white shadow-md">
                      <Award className="w-6 h-6 animate-pulse" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-950 leading-tight uppercase font-display tracking-wide">
                      Sponsors en Resultados Finales 👑
                    </h3>
                    <p className="text-xs text-rose-550 font-mono font-bold uppercase tracking-widest block font-extrabold">
                      Model Sponsorship Management & Podium Assignment
                    </p>
                    <p className="text-xs text-slate-500 max-w-xl mx-auto leading-relaxed pt-1">
                      Las empresas patrocinan tu carrera aportando fondos. Puedes configurar qué marca aparecerá en la gala de resultados finales de entre tus acuerdos comerciales firmados.
                    </p>
                    <div className="max-w-md mx-auto mt-3 text-left">
                      <div className="bg-gradient-to-r from-rose-50/50 to-pink-50/30 border border-pink-100 rounded-xl p-3.5 text-[11px] leading-relaxed shadow-4xs">
                        <span className="font-extrabold text-rose-800 flex items-center gap-1 mb-1">
                          <span>🏆</span> MARCA PATROCINADORA DE LA SESIÓN
                        </span>
                        Para que aparezca un logotipo en el pódium y gala de resultados finales de la sesión, selecciona una única marca habilitada de tus contratos en vigor. Puedes cambiar la marca activa en cualquier momento.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    
                    {/* COL 1: CONTRATACIÓN CORPORATIVA */}
                    <div className="space-y-4 bg-slate-50/70 border border-slate-100/80 p-5 rounded-2xl shadow-3xs">
                      <div className="border-b border-pink-100/50 pb-2">
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest font-mono">
                          SECCIÓN EMPRESAS
                        </span>
                        <h4 className="text-sm font-black text-slate-900">
                          Firmar Nuevo Contrato de Patrocinio
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Las marcas interesadas pueden contratarte cargando sus fondos simulados y su logotipo oficial.
                        </p>
                      </div>

                        <div className="space-y-4 text-left">
                          {/* Nombre Empresa */}
                          <div className="space-y-1 relative">
                            <label className="text-[10px] uppercase font-bold text-[#fe2c55] block font-mono">Busca tu empresa:</label>
                            <div className="relative">
                              <input
                                type="text"
                                value={newSponsorName}
                                onChange={(e) => {
                                  const term = e.target.value;
                                  setNewSponsorName(term);
                                  setShowStoreDropdown(true);
                                  
                                  const exactMatch = allAvailableStores.find(st => st.name.toLowerCase() === term.toLowerCase().trim());
                                  if (exactMatch) {
                                    setNewSponsorSector(exactMatch.sector);
                                  }
                                }}
                                onFocus={() => setShowStoreDropdown(true)}
                                onBlur={() => setShowStoreDropdown(false)}
                                placeholder="Busca tu empresa"
                                className="w-full bg-white border border-rose-400 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-400/50 font-semibold"
                              />
                              {showStoreDropdown && (
                                <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-y-auto divide-y divide-slate-100">
                                  {filteredStores.length === 0 ? (
                                    <div className="p-3 text-center text-xs text-slate-400">
                                      No se encontraron empresas. ¡Puedes escribir un nombre libre para crearla!
                                    </div>
                                  ) : (
                                    filteredStores.map((store, sIdx) => {
                                      const logoInfo = getBrandLogoInfo(store.name);
                                      return (
                                        <button
                                          key={sIdx}
                                          type="button"
                                          onMouseDown={(e) => {
                                            e.preventDefault(); // Prevents input from losing focus immediately before select
                                            setNewSponsorName(store.name);
                                            setNewSponsorSector(store.sector);
                                            setShowStoreDropdown(false);
                                          }}
                                          className="w-full text-left px-3 py-2.5 hover:bg-rose-50/40 flex items-center gap-3 transition cursor-pointer border-0 bg-transparent focus:outline-none"
                                        >
                                          <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[8.5px] uppercase tracking-wider font-extrabold shadow-4xs ${logoInfo.style}`}>
                                            {logoInfo.initials}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-slate-900 truncate">{store.name}</p>
                                            <p className="text-[10px] text-slate-400 truncate">{store.sector}</p>
                                          </div>
                                        </button>
                                      );
                                    })
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Sector / Categoría */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-600 block font-mono">Sector o Categoría de Moda:</label>
                            <input
                              type="text"
                              value={newSponsorSector}
                              onChange={(e) => setNewSponsorSector(e.target.value)}
                              className="w-full bg-white border border-slate-200 focus:border-rose-450 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none font-medium"
                              placeholder="Ej: Costura Suprema 🇮🇹"
                            />
                          </div>

                          {/* Oferta económica */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-600 block font-mono">Presupuesto de Contratación (€):</label>
                            <select
                              value={newSponsorBudget}
                              onChange={(e) => setNewSponsorBudget(e.target.value)}
                              className="w-full bg-white border border-slate-200 focus:border-rose-450 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none cursor-pointer font-medium"
                            >
                              <option value="15000">15.000 € (Patrocinio Plata Estándar)</option>
                              <option value="25050">25.000 € (Patrocinio Oro Preferencial)</option>
                              <option value="35000">35.000 € (Sponsorship Diamante Platino)</option>
                              <option value="50000">50.000 € (Sponsorship Titán Máximo)</option>
                              <option value="75000">75.000 € (Alianza Global de Lujo)</option>
                            </select>
                          </div>

                          {/* Fechas de vigencia del patrocinio */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-600 block font-mono">Fecha de Inicio:</label>
                              <input
                                type="date"
                                value={newSponsorStartDate}
                                onChange={(e) => setNewSponsorStartDate(e.target.value)}
                                className="w-full bg-white border border-slate-200 focus:border-rose-400 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-600 block font-mono">Fecha de Vencimiento:</label>
                              <input
                                type="date"
                                value={newSponsorEndDate}
                                onChange={(e) => setNewSponsorEndDate(e.target.value)}
                                className="w-full bg-white border border-rose-400 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Bloque de Propuesta de Patrocinio */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-600 block font-mono">Propuesta de Patrocinio & Visión Comercial:</label>
                            <textarea
                              value={newSponsorProposalText}
                              onChange={(e) => setNewSponsorProposalText(e.target.value)}
                              rows={3}
                              className="w-full bg-white border border-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none transition-all resize-none"
                              placeholder="Ej: Visibilidad優先, desfile otoño-invierno, etc."
                            />
                          </div>

                          {/* Logo upload dropzone */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-600 block font-mono">Subir Logotipo Oficial de la Marca:</label>
                            <div
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                  const file = e.dataTransfer.files[0];
                                  const reader = new FileReader();
                                  reader.onload = (ev) => {
                                    setNewSponsorLogoUrl(ev.target?.result as string);
                                    setNewSponsorLogoFilename(file.name);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition relative flex flex-col justify-center items-center gap-1.5 ${
                                isDragging ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 hover:border-slate-350 bg-white'
                              }`}
                              onClick={() => {
                                document.getElementById('hidden-sponsor-logo-input')?.click();
                              }}
                            >
                              <input
                                type="file"
                                id="hidden-sponsor-logo-input"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    const file = e.target.files[0];
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                      setNewSponsorLogoUrl(ev.target?.result as string);
                                      setNewSponsorLogoFilename(file.name);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                              {newSponsorLogoUrl ? (
                                <div className="space-y-1.5 flex flex-col items-center">
                                  <div className="relative">
                                    <img src={newSponsorLogoUrl || undefined} alt="Logo Preview" className="w-14 h-14 rounded-full object-cover shadow-xs border border-pink-100" />
                                    <span className="text-[9px] font-mono text-[#fe2c55] mt-1 block max-w-[120px] truncate">{newSponsorLogoFilename || 'logo_cargado.png'}</span>
                                  </div>
                                  <span className="text-[8.5px] uppercase font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">Click para Cambiar</span>
                                </div>
                              ) : (
                                <>
                                  <Upload className="w-6 h-6 text-slate-400" />
                                  <div className="text-[10px] text-slate-600">
                                    <span className="font-extrabold text-[#fe2c55]">Arrastra tu logotipo</span> o haz click para buscar
                                  </div>
                                  <span className="text-[8px] text-slate-400 block">Formatos recomendados: PNG transparente o SVG</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Exclusivity Toggle */}
                          <div className="flex items-start gap-2 p-3 bg-amber-50/40 border border-amber-200/40 rounded-xl">
                            <input
                              type="checkbox"
                              id="sponsor-exclusivity-checkbox"
                              checked={newSponsorExclusivity}
                              onChange={(e) => setNewSponsorExclusivity(e.target.checked)}
                              className="w-4 h-4 mt-0.5 rounded text-amber-500 focus:ring-amber-400 border-slate-300 accent-amber-500 cursor-pointer"
                            />
                            <label htmlFor="sponsor-exclusivity-checkbox" className="text-[11px] text-slate-700 font-extrabold cursor-pointer select-none">
                              🌟 Contrato en Exclusividad Comercial
                              <span className="block text-[9px] font-medium text-slate-500 mt-0.5 leading-normal font-sans">
                                Si firmas este contrato en exclusividad, esta marca representará tu único sponsor en el pódium de resultados de la gala, cancelando la visualización del resto.
                              </span>
                            </label>
                          </div>

                          {/* Submit sponsor button */}
                          <button
                            onClick={() => {
                              if (!newSponsorName.trim()) {
                                alert('Por favor, indica el nombre de la empresa contratante.');
                                return;
                              }
                              if (!newSponsorSector.trim()) {
                                alert('Por favor, indica el sector o categoría de la firma.');
                                return;
                              }

                              const logoInfo = getBrandLogoInfo(newSponsorName);

                              // Automatically deselect all other sponsors since only one can be active at a time
                              const nextSponsorsList = modelSponsors.map(s => {
                                return { ...s, isSelectedForResults: false, hasExclusivity: false };
                              });

                              const newSpon = {
                                id: 's-' + Date.now(),
                                name: newSponsorName,
                                amount: Number(newSponsorBudget),
                                logoUrl: newSponsorLogoUrl,
                                logoInitials: logoInfo.initials,
                                logoStyle: logoInfo.style,
                                sector: newSponsorSector,
                                isSelectedForResults: true, // Auto selected as the only one
                                hasExclusivity: true, // Mark as exclusive so the results podium renders with a premium border
                                hiredDate: new Date().toISOString().split('T')[0],
                                startDate: newSponsorStartDate,
                                endDate: newSponsorEndDate,
                                proposalDescription: newSponsorProposalText || 'Propuesta estándar de patrocinio para visualización de marca en resultados.'
                              };

                              const nextList = [...nextSponsorsList, newSpon];
                              setModelSponsors(nextList);
                              localStorage.setItem(`model_sponsors_${userProfile.id}`, JSON.stringify(nextList));

                              alert(`¡Contrato de patrocinio firmado con éxito! ${newSponsorName} se ha unido formalmente a sus representantes oficiales con un presupuesto de ${Number(newSponsorBudget).toLocaleString()} €. ¡Se ha establecido como la marca patrocinadora activa de la sesión!`);

                              setNewSponsorName('');
                              setNewSponsorSector('');
                              setNewSponsorLogoUrl(null);
                              setNewSponsorLogoFilename(null);
                              setNewSponsorExclusivity(false);
                              setNewSponsorStartDate(new Date().toISOString().split('T')[0]);
                              const df = new Date();
                              df.setMonth(df.getMonth() + 6);
                              setNewSponsorEndDate(df.toISOString().split('T')[0]);
                              setNewSponsorProposalText('Alianza estratégica B2B para visualización preferente de logotipo en la gala de resultados finales, pasarelas de alta costura e integración de branding digital multisensorial de alto impacto en todas nuestras redes sociales asociadas.');

                              if (onUpdateProfile) {
                                onUpdateProfile({
                                  ...userProfile,
                                  bio: bioText
                                });
                              }
                            }}
                            className="w-full py-3 bg-gradient-to-r from-rose-500 to-[#fe2c55] hover:brightness-[1.04] text-white font-black text-xs rounded-xl transition cursor-pointer border-0 shadow-md active:scale-98"
                          >
                            Firmar Contrato de Patrocinio Seguro B2B
                          </button>
                        </div>
                    </div>

                    {/* COL 2: GESTIÓN DE PATROCINADORES Y RESULTADOS FINALES */}
                    <div className="space-y-4">
                      <div className="border-b border-pink-100 pb-2">
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest font-mono font-bold">
                          PANEL DEL MODELO (GUSTOS DE MARCA)
                        </span>
                        <h4 className="text-sm font-black text-slate-900">
                          Gestión de Patrocinadores Oficiales
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Elige qué marcas aparecerán en los resultados finales del pódium de gala. Si marcas un contrato con <strong>exclusividad</strong>, solo aparecerá esa marca única.
                        </p>
                      </div>

                      {/* Counter progress */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono font-bold">Marcas en Red</span>
                        <span className="text-sm font-mono font-black text-slate-800 block mt-0.5">
                          {modelSponsors.length} Patrocinadores
                        </span>
                      </div>

                    {/* List of active sponsors */}
                      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                        {modelSponsors.length === 0 ? (
                          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
                            No tienes patrocinadores actualmente. Completa la firma de un contrato B2B en el panel de la izquierda para comenzar.
                          </div>
                        ) : (
                          modelSponsors.map((sponsor) => {
                            const isExclusive = !!sponsor.hasExclusivity;
                            const isSelected = !!sponsor.isSelectedForResults;
                            
                            return (
                              <div 
                                key={sponsor.id} 
                                className={`rounded-xl border p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 ${
                                  isExclusive
                                    ? "border-amber-300 bg-amber-50/20 hover:bg-amber-50/30 shadow-xs ring-1 ring-amber-250/30"
                                    : isSelected 
                                      ? "border-emerald-200 bg-emerald-50/10 hover:bg-emerald-50/20 shadow-4xs ring-1 ring-emerald-100/50" 
                                      : "border-slate-100 bg-white hover:border-slate-200 shadow-4xs"
                                }`}
                              >
                                  {/* Left: Logo + Brand Info */}
                                  <div className="flex items-center gap-3 min-w-0 flex-1 max-w-full">
                                    {sponsor.logoUrl ? (
                                      <img 
                                        src={sponsor.logoUrl} 
                                        className={`w-11 h-11 rounded-full object-cover border shadow-3xs cursor-pointer hover:ring-2 transition-all shrink-0 aspect-square ${
                                          isExclusive ? "border-amber-400 hover:ring-amber-400" : "border-slate-200 hover:ring-rose-450"
                                        }`} 
                                        onClick={() => setSelectedContractDetail(sponsor)}
                                        title="Ver Detalle de Patrocinio"
                                      />
                                    ) : (
                                      <div 
                                        className={`w-11 h-11 rounded-full flex items-center justify-center text-center text-[10px] uppercase tracking-wider font-extrabold shadow-4xs cursor-pointer hover:ring-2 transition-all shrink-0 aspect-square ${
                                          isExclusive 
                                            ? "bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 border-2 border-amber-300 hover:ring-amber-400"
                                            : sponsor.logoStyle || "bg-rose-50 text-rose-600 border border-pink-100 hover:ring-rose-450"
                                        }`}
                                        onClick={() => setSelectedContractDetail(sponsor)}
                                        title="Ver Detalle de Patrocinio"
                                      >
                                        {sponsor.logoInitials || sponsor.name.substring(0, 3)}
                                      </div>
                                    )}
                                    <div className="min-w-0 text-left flex-1">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <h5 
                                          className="font-extrabold text-[12.5px] text-slate-900 truncate cursor-pointer hover:text-rose-600 transition"
                                          onClick={() => setSelectedContractDetail(sponsor)}
                                          title="Ver Detalle de Patrocinio"
                                        >
                                          {sponsor.name}
                                        </h5>
                                        {isSelected ? (
                                          <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase rounded-md tracking-wider shadow-4xs flex items-center gap-0.5 whitespace-nowrap shrink-0">
                                            ✓ Activo
                                          </span>
                                        ) : null}
                                      </div>
                                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className="text-[9.5px] text-slate-400 block truncate uppercase font-semibold leading-none">{sponsor.sector}</span>
                                        <span className="text-[8.5px] text-rose-500 font-mono font-bold bg-rose-50 px-1.5 rounded hover:bg-rose-100 transition cursor-pointer whitespace-nowrap shrink-0" onClick={() => setSelectedContractDetail(sponsor)}>📄 Contrato</span>
                                      </div>
                                      <span className="text-[10.5px] text-slate-700 font-extrabold font-mono inline-block block leading-tight mt-1.5">
                                        € {Number(sponsor.amount).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Right: Actions */}
                                <div className="flex items-center gap-2 shrink-0 justify-end w-full sm:w-auto mt-2 sm:mt-0 flex-wrap">

                                  {/* Active Session Selector */}
                                  <button 
                                    onClick={() => {
                                      const willBeSelected = !sponsor.isSelectedForResults;
                                      
                                      if (willBeSelected) {
                                        // Enforce SINGLE brand selection: make this the ONLY enabled/exclusive brand!
                                        const next = modelSponsors.map(s => {
                                          const match = s.id === sponsor.id;
                                          return {
                                            ...s,
                                            isSelectedForResults: match,
                                            hasExclusivity: match // Both selected and exclusive so it is highlighted in the final results!
                                          };
                                        });
                                        
                                        setModelSponsors(next);
                                        localStorage.setItem(`model_sponsors_${userProfile.id}`, JSON.stringify(next));
                                      } else {
                                        // Deselecting brand
                                        const next = modelSponsors.map(s => {
                                          if (s.id === sponsor.id) {
                                            return {
                                              ...s,
                                              isSelectedForResults: false,
                                              hasExclusivity: false
                                            };
                                          }
                                          return s;
                                        });
                                        
                                        setModelSponsors(next);
                                        localStorage.setItem(`model_sponsors_${userProfile.id}`, JSON.stringify(next));
                                      }

                                      if (onUpdateProfile) {
                                        onUpdateProfile({
                                          ...userProfile,
                                          bio: bioText
                                        });
                                      }
                                    }}
                                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase transition cursor-pointer border flex items-center gap-1.5 focus:outline-none whitespace-nowrap shrink-0 ${
                                      isSelected 
                                        ? 'bg-rose-50 border-rose-200 text-[#fe2c55] hover:bg-rose-100 shadow-3xs ring-1 ring-rose-200' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-4xs'
                                    }`}
                                    title="Habilitar esta marca como el Sponsor Oficial para la gala de resultados finales"
                                  >
                                    {isSelected ? (
                                      <>
                                        <Check className="w-3 h-3 text-[#fe2c55] stroke-[3] shrink-0" />
                                        <span className="whitespace-nowrap">Sponsor Activo</span>
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="w-3 h-3 shrink-0" />
                                        <span className="whitespace-nowrap">Activar</span>
                                      </>
                                    )}
                                  </button>

<button
                                    onClick={() => {
                                      if (window.confirm(`¿Seguro que deseas rescindir el contrato y eliminar el patrocinio comercial de ${sponsor.name}?`)) {
                                        const next = modelSponsors.filter(s => s.id !== sponsor.id);
                                        setModelSponsors(next);
                                        localStorage.setItem(`model_sponsors_${userProfile.id}`, JSON.stringify(next));

                                        if (onUpdateProfile) {
                                          onUpdateProfile({
                                            ...userProfile,
                                            bio: bioText
                                          });
                                        }
                                      }
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer border-0 shrink-0"
                                    title="Rescindir Patrocinio Comercial"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                  </div>

                  {isOwnProfile && (() => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    
                    // 1. Presentes (Activos hoy): start <= today <= end
                    const presentSponsors = modelSponsors.filter(s => {
                      const start = s.startDate || s.hiredDate || '2026-01-01';
                      const end = s.endDate || '2029-12-31';
                      return start <= todayStr && todayStr <= end;
                    });

                    // 2. Vigentes (Firmados pero para vigencia futura): start > today
                    const upcomingSponsors = modelSponsors.filter(s => {
                      const start = s.startDate || s.hiredDate || '2026-01-01';
                      return start > todayStr;
                    });

                    // 3. Pasados y Expirados (Finalizados): end < today
                    const pastSponsors = modelSponsors.filter(s => {
                      const end = s.endDate;
                      return end && todayStr > end;
                    });

                    const totalAccumulatedEarnings = modelSponsors.reduce((acc, curr) => acc + curr.amount, 0);

                    return (
                      <div className="border-t border-slate-200 pt-6 mt-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100 pb-3">
                          <div className="text-left">
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                              <span className="inline-block w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                              HISTORIAL PRIVADO DE ACUERDOS DE PATROCINIO (VISTA DEL MODELO)
                            </span>
                            <h4 className="text-sm font-black text-slate-900 mt-1 flex items-center gap-1.5">
                              📄 Acuerdos Firmados por Bloques de Vigencia
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Historial confidencial segmentado. Solo tú como modelo titular puedes visualizar este registro y tus ganancias estimadas por acuerdo.
                            </p>
                          </div>
                          <div className="bg-rose-50 border border-rose-100 rounded-2xl px-3.5 py-2 text-right shrink-0">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Total Acumulado</span>
                            <span className="text-sm font-mono font-black text-[#fe2c55] block mt-0.5">
                              € {totalAccumulatedEarnings.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                          
                          {/* BLOCK 1: PRESENT AGREEMENTS (PRESENTES) */}
                          <div className="space-y-3 bg-rose-50/20 p-3 rounded-2xl border border-rose-100/40">
                            <div className="flex items-center justify-between border-b border-rose-100 pb-1.5">
                              <span className="text-[11px] font-extrabold text-[#fe2c55] uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#fe2c55] animate-ping" /> Presentes hoy ({presentSponsors.length})
                              </span>
                              <span className="text-[9px] font-mono font-black text-[#fe2c55] bg-rose-100 px-1.5 py-0.2 rounded-full">PRESENTE</span>
                            </div>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                              {presentSponsors.length === 0 ? (
                                <div className="text-center py-8 text-xs text-slate-450 bg-white rounded-xl border border-dashed border-slate-200">
                                  No hay acuerdos activos en el día de hoy.
                                </div>
                              ) : (
                                presentSponsors.map(sponsor => {
                                  const start = sponsor.startDate || sponsor.hiredDate || '2026-06-18';
                                  const end = sponsor.endDate || '2027-06-18';
                                  return (
                                    <div key={sponsor.id} className="bg-white border-2 border-[#fe2c55]/20 rounded-xl p-3 hover:border-[#fe2c55]/50 hover:shadow-4xs transition-all text-left relative overflow-hidden group">
                                      <div className="absolute top-0 right-0 bg-[#fe2c55] text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-bl-lg tracking-wider">
                                        Activo
                                      </div>
                                      <div className="flex items-center justify-between gap-3 pt-1">
                                        <div className="flex items-center gap-2">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${sponsor.logoStyle || 'bg-slate-100'}`}>
                                            {sponsor.logoInitials}
                                          </div>
                                          <div className="min-w-0">
                                            <h5 className="font-extrabold text-[12px] text-slate-900 leading-tight truncate">{sponsor.name}</h5>
                                            <span className="text-[8.5px] text-slate-400 uppercase font-semibold block mt-0.5">{sponsor.sector}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-2 text-left">
                                        <span className="text-[12px] font-mono font-black text-[#fe2c55]">€ {sponsor.amount.toLocaleString()}</span>
                                      </div>
                                      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-0.5 text-[9px] font-mono text-slate-500">
                                        <span>Fecha Inicio: <strong className="text-slate-700 font-extrabold">{start}</strong></span>
                                        <span>Vencimiento: <strong className="text-slate-700 font-extrabold">{end}</strong></span>
                                      </div>
                                      <p className="text-[10px] text-slate-600 bg-slate-50 border border-slate-100 rounded-lg p-2 mt-2 leading-relaxed font-sans italic">
                                        &ldquo;{sponsor.proposalDescription || 'Acuerdo estándar de patrocinio comercial.'}&rdquo;
                                      </p>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>

                          {/* BLOCK 2: FUTURE AGREEMENTS (VIGENTES) */}
                          <div className="space-y-3 bg-emerald-50/20 p-3 rounded-2xl border border-emerald-100/40">
                            <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
                              <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Vigentes Futuros ({upcomingSponsors.length})
                              </span>
                              <span className="text-[9px] font-mono font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">FIRMADO</span>
                            </div>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                              {upcomingSponsors.length === 0 ? (
                                <div className="text-center py-8 text-xs text-slate-450 bg-white rounded-xl border border-dashed border-slate-200">
                                  No hay acuerdos futuros firmados.
                                </div>
                              ) : (
                                upcomingSponsors.map(sponsor => {
                                  const start = sponsor.startDate || sponsor.hiredDate || '2026-12-01';
                                  const end = sponsor.endDate || '2027-12-01';
                                  return (
                                    <div key={sponsor.id} className="bg-white border border-emerald-100 rounded-xl p-3 hover:border-emerald-300 hover:shadow-4xs transition-all text-left relative overflow-hidden">
                                      <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-bl-lg tracking-wider">
                                        Vigente Próximo
                                      </div>
                                      <div className="flex items-center justify-between gap-3 pt-1">
                                        <div className="flex items-center gap-2">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${sponsor.logoStyle || 'bg-slate-100'}`}>
                                            {sponsor.logoInitials}
                                          </div>
                                          <div className="min-w-0">
                                            <h5 className="font-extrabold text-[12px] text-slate-900 leading-tight truncate">{sponsor.name}</h5>
                                            <span className="text-[8.5px] text-slate-400 uppercase font-semibold block mt-0.5">{sponsor.sector}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-2 text-left">
                                        <span className="text-[12px] font-mono font-black text-emerald-700">€ {sponsor.amount.toLocaleString()}</span>
                                      </div>
                                      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-0.5 text-[9px] font-mono text-slate-500">
                                        <span>Fecha Inicio: <strong className="text-slate-700 font-extrabold">{start}</strong></span>
                                        <span>Vencimiento: <strong className="text-slate-700 font-extrabold">{end}</strong></span>
                                      </div>
                                      <p className="text-[10px] text-slate-600 bg-slate-50 border border-slate-100 rounded-lg p-2 mt-2 leading-relaxed font-sans italic">
                                        &ldquo;{sponsor.proposalDescription || 'Acuerdo de patrocinio comercial firmado para vigencia futura.'}&rdquo;
                                      </p>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>

                          {/* BLOCK 3: PAST AGREEMENTS (FINALIZADOS) */}
                          <div className="space-y-3 bg-slate-50/40 p-3 rounded-2xl border border-slate-200/50">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Finalizados Pasados ({pastSponsors.length})
                              </span>
                              <span className="text-[9px] font-mono font-black text-slate-600 bg-slate-200 px-1.5 py-0.2 rounded-full">CONCLUIDO</span>
                            </div>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                              {pastSponsors.length === 0 ? (
                                <div className="text-center py-8 text-xs text-slate-450 bg-white rounded-xl border border-dashed border-slate-200">
                                  No hay acuerdos históricos finalizados.
                                </div>
                              ) : (
                                pastSponsors.map(sponsor => {
                                  const start = sponsor.startDate || sponsor.hiredDate || '2025-01-01';
                                  const end = sponsor.endDate || '2025-12-31';
                                  return (
                                    <div key={sponsor.id} className="bg-white/60 border border-slate-200 rounded-xl p-3 hover:border-slate-300 transition-all text-left relative overflow-hidden opacity-85 hover:opacity-100">
                                      <div className="absolute top-0 right-0 bg-slate-500 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-bl-lg tracking-wider">
                                        Expirado
                                      </div>
                                      <div className="flex items-center justify-between gap-3 pt-1">
                                        <div className="flex items-center gap-2">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 bg-slate-100 text-slate-400 border border-slate-200`}>
                                            {sponsor.logoInitials}
                                          </div>
                                          <div className="min-w-0">
                                            <h5 className="font-extrabold text-[12px] text-slate-500 leading-tight truncate line-through">{sponsor.name}</h5>
                                            <span className="text-[8.5px] text-slate-400 uppercase font-semibold block mt-0.5">{sponsor.sector}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-2 text-left">
                                        <span className="text-[12px] font-mono font-bold text-slate-450 block">€ {sponsor.amount.toLocaleString()}</span>
                                      </div>
                                      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-0.5 text-[9px] font-mono text-slate-400">
                                        <span>Fecha Inicio: <span>{start}</span></span>
                                        <span>Vencimiento: <span>{end}</span></span>
                                      </div>
                                      <p className="text-[10px] text-slate-500 bg-slate-50/50 border border-slate-200/40 rounded-lg p-2 mt-2 leading-relaxed font-sans italic">
                                        &ldquo;{sponsor.proposalDescription || 'Acuerdo de patrocinio histórico completado con éxito.'}&rdquo;
                                      </p>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })()}

                  {/* Footer Actions */}
                  <div className="flex justify-end gap-3 border-t border-pink-100 pt-5 mt-2">
                    <button
                      onClick={() => {
                        setSelectedService(null);
                      }}
                      className="px-6 py-2.5 bg-slate-150 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition cursor-pointer border-0 shadow-3xs hover:scale-[1.01] active:scale-98"
                    >
                      Cerrar y Ver Resultados
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* 📜 B2B SPONSORSHIP CONTRACT DETAIL MODAL */}
            {selectedContractDetail && (
              <div className="fixed inset-0 z-[155] flex items-start sm:items-center justify-center bg-slate-950/90 p-2 sm:p-4 animate-fade-in font-sans backdrop-blur-md overflow-y-auto">
                <div className="bg-white border-2 border-emerald-300 rounded-3xl w-full max-w-lg p-6 sm:p-8 text-slate-900 space-y-6 shadow-2xl relative my-auto transform scale-100 transition duration-300">
                  
                  {/* Absolute close button */}
                  <button 
                    onClick={() => setSelectedContractDetail(null)}
                    className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition cursor-pointer border-0 shadow-3xs"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Header & Logo */}
                  <div className="text-center space-y-3 pb-4 border-b border-dashed border-slate-200">
                    {selectedContractDetail.logoUrl ? (
                      <img 
                        src={selectedContractDetail.logoUrl} 
                        alt={selectedContractDetail.name} 
                        className="w-20 h-20 rounded-full object-cover border-2 border-emerald-400 shadow-lg mx-auto" 
                      />
                    ) : (
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-xl uppercase tracking-widest font-black shadow-lg mx-auto ${selectedContractDetail.logoStyle || 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
                        {selectedContractDetail.logoInitials || selectedContractDetail.name.substring(0, 3)}
                      </div>
                    )}
                    
                    <div>
                      <span className="bg-emerald-100 text-emerald-850 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full inline-block">
                        ✓ Contrato B2B Homologado
                      </span>
                      <h4 className="text-xl font-black text-slate-950 mt-1.5 uppercase font-display tracking-tight">
                        {selectedContractDetail.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium italic mt-0.5">
                        {selectedContractDetail.sector || 'Patrocinio Comercial'}
                      </p>
                    </div>
                  </div>

                  {/* Contract Specific Details */}
                  <div className="space-y-4 text-xs">
                    
                    {/* Presupuesto */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 p-4 rounded-2xl border border-emerald-150 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">FONDOS COMPROMETIDOS</span>
                        <span className="text-lg font-black text-emerald-850 mt-0.5 block font-mono">
                          € {Number(selectedContractDetail.amount).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">RANGO DE FIRMA</span>
                        <span className="text-xs font-bold text-slate-700 mt-0.5 block">
                          Sponsor {selectedContractDetail.amount >= 50000 ? 'Titán Élite' : selectedContractDetail.amount >= 35000 ? 'Platino' : 'Corporativo'}
                        </span>
                      </div>
                    </div>

                    {/* Fechas de Alianza B2B */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">FECHA DE INICIO</span>
                        <span className="text-xs font-black text-slate-800 block mt-0.5 font-mono">
                          {selectedContractDetail.startDate || selectedContractDetail.hiredDate || '2026-06-21'}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">FIN DE ACTIVACIÓN</span>
                        <span className="text-xs font-black text-slate-800 block mt-0.5 font-mono">
                          {selectedContractDetail.endDate || '2026-12-31'}
                        </span>
                      </div>
                    </div>

                    {/* Descripción de la Propuesta (Bloque de texto) */}
                    <div className="space-y-1.5 text-left font-sans">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">DESCRIPCIÓN DE LA PROPUESTA (DEAL TERMS)</span>
                      <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100 text-slate-700 italic leading-relaxed text-xs relative">
                        <span className="absolute -top-3 left-3 bg-amber-200 text-amber-950 text-[8px] px-1.5 py-0.5 rounded font-black font-mono">PROPUESTA OFICIAL</span>
                        "{selectedContractDetail.proposalDescription || 'Alianza de branding estratégico para el impulso de marcas del sector en los resultados finales del certamen de alta costura, garantizando visibilidad en podium y materiales interactivos.'}"
                      </div>
                    </div>

                    {/* Terminos legales adicionales */}
                    <div className="text-[9.5px] text-slate-400 text-center leading-relaxed pt-2 border-t border-slate-100 font-mono">
                      Este documento certifica legalmente la contratación simulada bajo los términos oficiales del concurso. Alianza revocable en el Panel de Control del modelo por rescisión voluntaria unilateral de servicios.
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setSelectedContractDetail(null)}
                      className="px-8 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer border-0 hover:scale-[1.01]"
                    >
                      Entendido y Cerrar Acuerdo
                    </button>
                  </div>

                </div>
              </div>
            )}

            {selectedService && selectedService !== "Apariciones en los resultados finales" && (
              <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/70 p-2 sm:p-4 animate-fade-in font-sans">
                <div className="bg-white border border-pink-100 rounded-3xl w-full max-w-lg p-5 sm:p-7 text-slate-900 shadow-2xl relative my-auto max-h-[90vh] flex flex-col">
                  
                  {/* Absolute close button */}
                  <button 
                    onClick={() => {
                      setSelectedService(null);
                      setHiringSuccessMessage(null);
                    }}
                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition cursor-pointer border-0 z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Decorative luxury logo header - remains pinned at top */}
                  <div className="text-center space-y-1 shrink-0 pb-3 border-b border-slate-100">
                    <div className="inline-flex items-center justify-center w-11 h-11 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 mb-0.5">
                      <Briefcase className="w-5.5 h-5.5 animate-pulse" />
                    </div>
                    <h3 className="text-sm font-black text-slate-950 leading-tight uppercase font-display">
                      CONTRATACIÓN DE SERVICIO
                    </h3>
                    <p className="text-[10.5px] text-rose-500 font-mono font-bold uppercase tracking-wider block">
                      {selectedService}
                    </p>
                    <p className="text-[10.5px] text-slate-500 max-w-sm mx-auto pt-0.5 leading-normal">
                      Inicia una propuesta de contrato comercial seguro con <span className="font-extrabold text-slate-800">@{userProfile.username}</span> para este servicio exclusivo.
                    </p>
                  </div>

                  {/* Scrollable Modal Body */}
                  <div className="overflow-y-auto space-y-4 text-left pr-1 scrollbar-none flex-1 my-3">
                    {hiringSuccessMessage ? (
                      <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 text-center space-y-3 animate-scale-up">
                        <div className="inline-flex p-1.5 bg-emerald-100 text-emerald-600 rounded-full">
                          <Check className="w-5 h-5 stroke-[3px]" />
                        </div>
                        <h4 className="font-bold text-emerald-950 text-xs font-display uppercase tracking-wide">¡Propuesta de Contrato Emitida!</h4>
                        
                        <div className="text-[11px] text-emerald-850 space-y-2.5 text-left bg-white border border-emerald-100/50 p-4 rounded-xl shadow-3xs leading-relaxed max-w-md mx-auto">
                          <p className="font-medium text-slate-700">{hiringSuccessMessage}</p>
                          <hr className="border-emerald-100/40" />
                          
                          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[9.5px] font-mono">
                            <div><span className="text-emerald-600 block uppercase font-bold text-[8.5px]">Empresa / Marca</span> {hiringCompany}</div>
                            <div><span className="text-emerald-600 block uppercase font-bold text-[8.5px]">Representante</span> {hiringRepresentative}</div>
                            <div><span className="text-emerald-600 block uppercase font-bold text-[8.5px]">Email Corp</span> {hiringCorpEmail}</div>
                            <div><span className="text-emerald-600 block uppercase font-bold text-[8.5px]">Fecha del Evento</span> {hiringDate}</div>
                            <div className="col-span-2 border-t border-slate-50 pt-1.5"><span className="text-emerald-600 block uppercase font-bold text-[8.5px]">Colección / Desfile</span> {runwayShowName}</div>
                            <div><span className="text-emerald-600 block uppercase font-bold text-[8.5px]">Talla Calzado</span> {footwearSize}</div>
                            <div><span className="text-emerald-600 block uppercase font-bold text-[8.5px]">Sesión Ensayos</span> {rehearsalSessions}</div>
                            <div><span className="text-emerald-600 block uppercase font-bold text-[8.5px]">Duración / Pases</span> {runwayDuration}</div>
                            <div><span className="text-emerald-600 block uppercase font-bold text-[8.5px]">Estilistas (MUA)</span> {makeupInclusion}</div>
                            <div><span className="text-emerald-600 block uppercase font-bold text-[8.5px]">Catering / Camerino</span> {cateringInclusion}</div>
                            <div className="col-span-2"><span className="text-emerald-600 block uppercase font-bold text-[8.5px]">Alojamiento y Desplazamientos</span> {travelCoverage}</div>
                            <div className="col-span-2 border-t border-slate-50 pt-1.5"><span className="text-emerald-600 block uppercase font-bold text-[8.5px]">Garantía de Saldo</span> Escrow Activo (Backoffice Retenido)</div>
                          </div>
                        </div>

                        <div className="pt-1.5">
                          <button
                            onClick={() => {
                              setSelectedService(null);
                              setHiringSuccessMessage(null);
                            }}
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer border-0 shadow-sm"
                          >
                            Entendido y Cerrar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        
                        {/* BLOQUE 1: IDENTIFICACIÓN */}
                        <div className="space-y-2.5 bg-slate-50/50 border border-pink-100/30 p-3.5 rounded-2xl">
                          <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-pink-100/30 pb-1.5">
                            <span>01.</span> Identificación Corporativa
                          </h4>
                          
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Nombre de la Empresa / Marca:</label>
                            <input
                              type="text"
                              required
                              value={hiringCompany}
                              onChange={(e) => setHiringCompany(e.target.value)}
                              className="w-full bg-white border border-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20 rounded-xl p-2 text-xs text-slate-900 focus:outline-hidden transition-all"
                              placeholder="Ej: Versace España, Zara S.A."
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Nombre Representante / Cargo:</label>
                              <input
                                type="text"
                                required
                                value={hiringRepresentative}
                                onChange={(e) => setHiringRepresentative(e.target.value)}
                                className="w-full bg-white border border-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20 rounded-xl p-2 text-xs text-slate-900 focus:outline-hidden transition-all"
                                placeholder="Ej: Sofía Alarcón / CMO"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Correo Electrónico Corporativo:</label>
                              <input
                                type="email"
                                required
                                value={hiringCorpEmail}
                                onChange={(e) => setHiringCorpEmail(e.target.value)}
                                className="w-full bg-white border border-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20 rounded-xl p-2 text-xs text-slate-900 focus:outline-hidden transition-all font-mono"
                                placeholder="Ej: s.alarcon@marca.com"
                              />
                            </div>
                          </div>
                        </div>

                        {/* BLOQUE 2: PROPUESTA ECONÓMICA & EXCLUSIVIDAD */}
                        <div className="space-y-2.5 bg-slate-50/50 border border-pink-100/30 p-3.5 rounded-2xl">
                          <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-pink-100/30 pb-1.5">
                            <span>02.</span> Propuesta Económica & Limitación/Exclusividad
                          </h4>

                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Bolsa de Contratación Propuesta (Garantía de Saldo Backoffice):</label>
                            <select
                              value={hiringBudget}
                              onChange={(e) => setHiringBudget(e.target.value)}
                              className="w-full bg-white border border-slate-200 focus:border-rose-400 rounded-xl p-2 text-xs text-slate-900 focus:outline-hidden transition-all cursor-pointer font-medium"
                            >
                              <option value="5000">5.000 € (Propuesta estándar eventos locales)</option>
                              <option value="10000">10.000 € (Propuesta de desfile ganador estándar)</option>
                              <option value="15000">15.000 € (Propuesta de desfile ganador premium)</option>
                              <option value="20000">20.000 € (Propuesta de Gala exclusiva de pasarela)</option>
                              <option value="35000">35.000 € (Campaña internacional completa de desfile)</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <div className="p-2.5 bg-rose-50/40 rounded-xl border border-pink-100/40 space-y-1.5">
                              <p className="text-[9.5px] text-slate-650 leading-normal">
                                📌 <span className="font-bold text-slate-800">Normativa de Cupos Sponsoring:</span> Cada modelo tiene un límite regulado y solo puede patrocinar a un máximo de <strong className="text-rose-600 font-extrabold">10 marcas simultáneamente</strong> en la plataforma, para salvaguardar la exclusividad editorial.
                              </p>
                              
                              <hr className="border-pink-100/30" />

                              <label className="flex items-start gap-2 text-xs text-slate-700 hover:text-slate-950 cursor-pointer select-none py-0.5">
                                <input
                                  type="checkbox"
                                  checked={requestExclusive}
                                  onChange={(e) => setRequestExclusive(e.target.checked)}
                                  className="w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-400 mt-0.5 shrink-0 accent-rose-550"
                                />
                                <div>
                                  <span className="font-bold text-rose-600 block text-[10.5px]">Solicitar Contrato de Exclusividad Comercial</span>
                                  <span className="text-[9px] text-slate-500 block leading-tight">Omite el límite de 10 marcas y reserva la imagen de este/a modelo de forma absoluta durante la vigencia de este patrocinio.</span>
                                </div>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* BLOQUE 3: ESPECIFICACIONES DE PASARELA (RUNWAY) */}
                        <div className="space-y-2.5 bg-slate-50/55 border border-pink-100/35 p-3.5 rounded-2xl">
                          <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-pink-100/30 pb-1.5">
                            <span>03.</span> Especificaciones de Pasarela (Runway)
                          </h4>

                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Nombre de la Colección o Desfile:</label>
                            <input
                              type="text"
                              value={runwayShowName}
                              onChange={(e) => setRunwayShowName(e.target.value)}
                              className="w-full bg-white border border-slate-200 focus:border-rose-450 focus:ring-1 focus:ring-rose-400/20 rounded-xl p-2 text-xs text-slate-900 focus:outline-hidden transition-all"
                              placeholder="Ej: Colección Primavera-Verano, Gala de Estrellas"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Talla de Calzado requerida:</label>
                              <select
                                value={footwearSize}
                                onChange={(e) => setFootwearSize(e.target.value)}
                                className="w-full bg-white border border-slate-200 focus:border-rose-400 rounded-xl p-2 text-xs text-slate-900 focus:outline-hidden transition-all font-mono"
                              >
                                <option value="36">Talla 36 EU</option>
                                <option value="37">Talla 37 EU</option>
                                <option value="38">Talla 38 EU</option>
                                <option value="39">Talla 39 EU</option>
                                <option value="40">Talla 40 EU</option>
                                <option value="41">Talla 41 EU</option>
                                <option value="42">Talla 42 EU</option>
                                <option value="43">Talla 43 EU</option>
                                <option value="44">Talla 44 EU</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Sesiones de Ensayo requeridas:</label>
                              <select
                                value={rehearsalSessions}
                                onChange={(e) => setRehearsalSessions(e.target.value)}
                                className="w-full bg-white border border-slate-200 focus:border-rose-400 rounded-xl p-2 text-xs text-slate-900 focus:outline-hidden transition-all"
                              >
                                <option value="1 Sesión (Día anterior)">1 Sesión de Ensayo (Día anterior)</option>
                                <option value="2 Sesiones (Fitting + Pasarela)">2 Sesiones (Fitting + Pasarela)</option>
                                <option value="Ensayos el mismo día del desfile">Ensayos el mismo día del desfile</option>
                                <option value="Sin ensayos (Modelo Senior certificado)">Sin ensayos (Modelo Senior)</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Duración Estimada y Pases de Pasarela:</label>
                            <select
                              value={runwayDuration}
                              onChange={(e) => setRunwayDuration(e.target.value)}
                              className="w-full bg-white border border-slate-200 focus:border-rose-400 rounded-xl p-2 text-xs text-slate-900 focus:outline-hidden transition-all"
                            >
                              <option value="1 Pase de Colección">1 Pase de Colección Único</option>
                              <option value="2 Pases (Apertura y Cierre)">2 Pases (Apertura y Cierre de Show)</option>
                              <option value="2 Pases de Colección + Cierre de Carrusel">2 Pases de Colección + Carrusel Final</option>
                              <option value="3 Pases de Diseñador + Cierre de Carrusel">3 Pases de Diseñador + Cierre Estelar</option>
                              <option value="Show Continuo / Performance de Gala">Show Continuo / Performance de Gala (60 min)</option>
                            </select>
                          </div>
                        </div>

                        {/* BLOQUE 4: LOGÍSTICA, SERVICIOS & IDENTIDAD */}
                        <div className="space-y-2.5 bg-slate-50/50 border border-pink-100/30 p-3.5 rounded-2xl">
                          <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-pink-100/30 pb-1.5">
                            <span>04.</span> Logística, Servicios & Identidad de Marca
                          </h4>

                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-rose-500 block font-mono font-bold">Fecha del Evento o Desfile (Obligatorio):</label>
                            <input
                              type="date"
                              required
                              value={hiringDate}
                              onChange={(e) => setHiringDate(e.target.value)}
                              className="w-full bg-white border border-slate-200 focus:border-rose-450 rounded-xl p-2 text-xs text-slate-900 focus:outline-hidden transition-all font-mono"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Maquillaje & Peluquería:</label>
                              <select
                                value={makeupInclusion}
                                onChange={(e) => setMakeupInclusion(e.target.value)}
                                className="w-full bg-white border border-slate-200 focus:border-rose-450 rounded-xl p-2 text-xs text-slate-900 focus:outline-hidden transition-all"
                              >
                                <option value="Incluido (Estilistas y Makeup del Evento)">Incluido (A cargo del Evento)</option>
                                <option value="A cargo del propio modelo">A cargo del propio modelo (Bajo guía de marca)</option>
                                <option value="Estilistas patrocinados compartidos">Estilistas compartidos oficiales</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Catering & Camerino:</label>
                              <select
                                value={cateringInclusion}
                                onChange={(e) => setCateringInclusion(e.target.value)}
                                className="w-full bg-white border border-slate-200 focus:border-rose-450 rounded-xl p-2 text-xs text-slate-900 focus:outline-hidden transition-all"
                              >
                                <option value="Catering VIP Completo Incluido en Camerino">Catering VIP Completo en Camerino</option>
                                <option value="Acceso a Catering general de modelos">Catering general de modelos</option>
                                <option value="Dietas compensadas en factura (+150€)">Dietas compensadas (+150€)</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Traslados & Alojamiento:</label>
                            <select
                              value={travelCoverage}
                              onChange={(e) => setTravelCoverage(e.target.value)}
                              className="w-full bg-white border border-slate-200 focus:border-rose-450 rounded-xl p-2 text-xs text-slate-900 focus:outline-hidden transition-all"
                            >
                              <option value="Alojamiento 5 estrellas y Vuelos Cubiertos por la Marca">Hotel 5★ y Vuelos cubiertos por Marca</option>
                              <option value="Modelo residente / No requiere traslado">Modelo residente / No requiere traslado</option>
                              <option value="Compensación de kilometraje estándar (+0.25€/km)">Compensación de viaje (+0.25€/km)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Subir Logotipo o Identidad de Marca (PNG / SVG):</label>
                            
                            <div
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                              className={`border-2 border-dashed rounded-xl p-3.5 text-center transition-all cursor-pointer select-none relative ${
                                isDragging 
                                  ? 'border-rose-500 bg-rose-50/40' 
                                  : 'border-pink-200 hover:border-rose-400 bg-white'
                              }`}
                            >
                              <input
                                type="file"
                                accept=".png,.svg,.jpg,.jpeg"
                                id="logo-upload"
                                className="hidden"
                                onChange={handleFileSelect}
                              />
                              <label htmlFor="logo-upload" className="cursor-pointer block space-y-1 mb-0 pb-0">
                                <div className="mx-auto w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                                  <Upload className="w-4.5 h-4.5" />
                                </div>
                                <p className="text-xs font-semibold text-slate-800">
                                  {uploadedLogoName ? '✓ Logotipo cargado con éxito' : 'Suelte su logotipo aquí o examine archivos'}
                                </p>
                                <p className="text-[9.5px] text-slate-500">
                                  {uploadedLogoName ? (
                                    <span className="font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100/50 block max-w-[220px] mx-auto truncate mt-1">
                                      {uploadedLogoName}
                                    </span>
                                  ) : (
                                    'Soporta archivos PNG, SVG o JPEG para el pódium/redes.'
                                  )}
                                </p>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* BLOQUE 5: BRIEFING */}
                        <div className="space-y-2.5 bg-slate-50/50 border border-pink-100/30 p-3.5 rounded-2xl">
                          <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest font-mono flex items-center gap-1.5 border-b border-pink-100/30 pb-1.5">
                            <span>05.</span> Especificaciones de Vestuario, Briefing & Notas
                          </h4>
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-bold text-slate-500 block font-mono">Briefing del servicio & Notas Claves:</label>
                            <textarea
                              value={hiringDetails}
                              onChange={(e) => setHiringDetails(e.target.value)}
                              rows={3}
                              className="w-full bg-white border border-slate-200 focus:border-rose-450 focus:ring-1 focus:ring-rose-400/20 rounded-xl p-2 text-xs text-slate-900 focus:outline-hidden transition-all resize-none"
                              placeholder="Indique detalles adicionales de vestuario, catering, traslados o estipulaciones contractuales..."
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {!hiringSuccessMessage && (
                        <>
                          {/* AVISO LEGAL PROFESIONAL (ESTRUCTURADO SALDO BACKOFFICE DE CONFIANZA) */}
                          <div className="bg-[#fff9f4] border border-[#ffecd1] rounded-2xl p-4 text-left shadow-2xs space-y-1">
                        <span className="text-[10px] font-black text-orange-850 block font-sans tracking-wide uppercase leading-tight">
                          ⚖️ Aviso de Oferta Vinculante:
                        </span>
                        <p className="text-[10.5px] text-amber-900 leading-normal font-medium">
                          Al enviar esta propuesta, usted emite una oferta comercial en firme sujeta a los Términos de Patrocinio de Fashion Finances. De ser aceptada por el/la modelo, los fondos serán retenidos en garantía (<span className="font-extrabold text-[#5433ff] font-sans">Garantía Escrow de Saldo Backoffice</span>) hasta el cumplimiento de los plazos clave declarados.
                        </p>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => {
                            setSelectedService(null);
                            setHiringSuccessMessage(null);
                          }}
                          className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer border-0 active:scale-98"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => {
                            if (!hiringCompany.trim()) {
                              alert('Por favor, indique el nombre de la Empresa / Marca.');
                              return;
                            }
                            if (!hiringRepresentative.trim()) {
                              alert('Por favor, indique el nombre y cargo del Representante.');
                              return;
                            }
                            if (!hiringCorpEmail.includes('@')) {
                              alert('Por favor, indique un correo electrónico corporativo válido.');
                              return;
                            }
                            if (!hiringDate) {
                              alert('La fecha de la campaña/evento es obligatoria.');
                              return;
                            }

                            const val = Number(hiringBudget);
                            const exclusiveText = requestExclusive 
                              ? 'con términos de EXCLUSIVIDAD ABSOLUTA COMERCIAL (bloqueo integral de competencia)' 
                              : 'bajo términos de patrocinio estándar (Sujeto a Cupos Limitados de 10 marcas)';

                            const customBidsText = selectedService === "Apariciones en los resultados finales"
                              ? `bajo una oferta competitiva multi-puja de (Oro: ${Number(offerGold || 50000).toLocaleString()} €, Plata: ${Number(offerSilver || 25000).toLocaleString()} €, Bronce: ${Number(offerBronze || 12000).toLocaleString()} €)`
                              : `por un valor de ${val.toLocaleString()} €`;

                            setHiringSuccessMessage(`Tu oferta para el servicio de "${selectedService}" ha sido enviada oficialmente a ${userProfile.name} ${customBidsText} en nombre de ${hiringCompany}, bajo la supervisión de ${hiringRepresentative} (correo: ${hiringCorpEmail}) ${exclusiveText}. La fecha clave asignada para activar el escrow es el ${hiringDate}. El sistema de contratos ha pre-registrado este flujo y procesará los pagos mediante el saldo de su Backoffice de forma segura.`);
                            
                            // Save this proposal in local storage compiled logs
                            const savedAgreements = localStorage.getItem('coll_signed_agreements') || '{}';
                            const currentAgreements = JSON.parse(savedAgreements);
                            currentAgreements[userProfile.id] = {
                              company: hiringCompany,
                              amount: selectedService === "Apariciones en los resultados finales" ? `${offerGold}/${offerSilver}/${offerBronze}` : hiringBudget,
                              campaign: `${selectedService} - Contratación B2B (${hiringDate})`,
                              representative: hiringRepresentative,
                              email: hiringCorpEmail,
                              exclusive: requestExclusive ? 'Sí' : 'No',
                              uploadedLogo: uploadedLogoName || 'Ninguno',
                              bids: selectedService === "Apariciones en los resultados finales" ? { gold: offerGold, silver: offerSilver, bronze: offerBronze } : null
                            };
                            localStorage.setItem('coll_signed_agreements', JSON.stringify(currentAgreements));

                            // Synchronize and write into coll_tiktok_shop_leads so that it shows up in CastingLiveSection's direct offers box!
                            const cachedLeadsStr = localStorage.getItem('coll_tiktok_shop_leads');
                            let leadsArr = [];
                            try {
                              leadsArr = cachedLeadsStr ? JSON.parse(cachedLeadsStr) : [];
                            } catch (e) {
                              leadsArr = [];
                            }

                            const isOtras = selectedService === "Contratación General B2B / Partnerships" || selectedService === "Contratación General B2B";
                            let newLeadType: 'Compra' | 'Sponsor' | 'Alquiler' | 'Venta' | 'Marca' | 'CastingLive' | 'Otras' = 'Sponsor';
                            if (isOtras) {
                              newLeadType = 'Otras';
                            } else if (selectedService === 'Apariciones en los resultados finales') {
                              newLeadType = 'Marca';
                            } else if (selectedService === 'Pasarela (Runway)') {
                              newLeadType = 'Sponsor';
                            } else if (selectedService === 'Apariciones en eventos') {
                              newLeadType = 'CastingLive';
                            } else if (selectedService === 'Integración de logos') {
                              newLeadType = 'Marca';
                            }

                            leadsArr.unshift({
                              id: `lead-auto-${Date.now()}`,
                              itemId: isOtras ? 'general-b2b' : 'shop-1',
                              itemName: selectedService || 'Propuesta Comercial General',
                              buyerName: hiringCompany,
                              buyerRole: `${hiringRepresentative} (B2B)`,
                              buyerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
                              offerType: newLeadType,
                              offeredAmount: selectedService === "Apariciones en los resultados finales" ? 50000 : Number(hiringBudget || 15000),
                              message: hiringDetails || `Propuesta enviada formalmente en nombre de ${hiringCompany}. Representante: ${hiringRepresentative}. Correo corporativo: ${hiringCorpEmail}.`,
                              status: 'pendiente',
                              date: 'Hace un momento',
                              isDirectProfileOffer: true
                            });
                            localStorage.setItem('coll_tiktok_shop_leads', JSON.stringify(leadsArr));

                            if (onUpdateProfile) {
                              onUpdateProfile({
                                 ...userProfile,
                                 bio: bioText // trigger state refresh
                              });
                            }
                          }}
                          className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-[#fe2c55] hover:brightness-[1.04] text-white font-black text-xs rounded-xl transition cursor-pointer border-0 shadow-md active:scale-98"
                        >
                          Emitir con Saldo de Backoffice
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            </>
          )}

          {/* Model Gallery Component (My Photos showcase) */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-xs">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                Mis Fotos publicadas
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {(currentModel ? currentModel.photos.length : investorPhotos.length)} fotos
              </span>
            </div>

            {/* Direct Upload Form inside Gallery (Desktop uploads) */}
            <div className="space-y-1.5">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const fileName = file.name || '';
                    const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
                    if (fileExt !== 'jpg' && fileExt !== 'jpeg' && fileExt !== 'png') {
                      alert(`⚠️ Tipo de archivo no permitido.\n\nHas intentado subir un archivo con extensión .${fileExt.toUpperCase() || 'desconocida'}.\nPor favor, selecciona una imagen con extensión JPG o PNG.`);
                      e.target.value = '';
                      return;
                    }
                    try {
                      const dataUrl = await compressAndResizeImage(file);
                      trackUploadedPhoto(dataUrl); // Track as user uploaded
                      if (currentModel) {
                        const updatedModels = models.map(m => {
                          if (m.id === currentModel.id) {
                            return {
                              ...m,
                              photos: [dataUrl, ...m.photos],
                              totalLikes: m.totalLikes + 10 // Give bonus likes for uploading new content!
                            };
                          }
                          return m;
                        });
                        onUpdateModels(updatedModels);
                        alert('📸 ¡Nueva foto subida con éxito desde tu ordenador! Tu exposición ha aumentado y ganaste 10 likes adicionales en el ranking.');
                      } else {
                        const nextPhotos = [dataUrl, ...investorPhotos];
                        setInvestorPhotos(nextPhotos);
                        try {
                          localStorage.setItem(`investor_photos_${userProfile.id}`, JSON.stringify(nextPhotos));
                        } catch (err) {
                          console.warn('Storage quota exceeded:', err);
                        }
                        alert('📸 ¡Nueva foto subida con éxito a tu galería social!');
                      }
                    } catch (err) {
                      console.error('Error uploading/compressing photo:', err);
                      alert('⚠️ Error al procesar la imagen.');
                    }
                    e.target.value = '';
                  }
                }}
                className="hidden"
                id="gallery-photo-upload-facebook"
              />
              <label
                htmlFor="gallery-photo-upload-facebook"
                className="w-full bg-slate-50 hover:bg-rose-50/70 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Camera className="w-4 h-4 text-slate-400" />
                <span>Subir imagen</span>
              </label>
            </div>

            {/* Tab selection buttons: Perfil and Muro */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => setActiveProfileOrWallTab('perfil')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  activeProfileOrWallTab === 'perfil'
                    ? 'bg-rose-50 border-rose-200 text-[#fe2c55] shadow-xs font-black'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-650'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Perfil</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveProfileOrWallTab('muro')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                  activeProfileOrWallTab === 'muro'
                    ? 'bg-rose-50 border-rose-200 text-[#fe2c55] shadow-xs font-black'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-650'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 font-bold" />
                <span>Muro</span>
              </button>
            </div>

            {activeProfileOrWallTab === 'perfil' ? (
              <>
            {(() => {
              const defaultFillPhotos = [
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=650',
                'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=650',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=650',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=650',
                'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=650',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=650',
                'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=650',
                'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=650',
                'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=650',
                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=650'
              ];
              const rawPhotos = (currentModel ? currentModel.photos : investorPhotos) as string[];
              const uniquePhotos: string[] = Array.from(new Set(rawPhotos));
              while (uniquePhotos.length < 10) {
                const nextUrl = defaultFillPhotos[uniquePhotos.length % defaultFillPhotos.length];
                if (!uniquePhotos.includes(nextUrl)) {
                  uniquePhotos.push(nextUrl);
                } else {
                  uniquePhotos.push(`${nextUrl}&sig=${uniquePhotos.length}`);
                }
              }
              const profilePhotos = uniquePhotos.slice(0, 10);

              return (
                <div className="space-y-4">
                  {/* Circular Highlights Section (za.png format) with navigation arrows */}
                  <div className="relative group/stories-slider w-full border-b border-slate-100">
                    {/* Left Slider Arrow */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (highlightsSliderRef.current) {
                          highlightsSliderRef.current.scrollBy({ left: -220, behavior: 'smooth' });
                        }
                      }}
                      className="absolute left-2 top-[44px] -translate-y-1/2 w-8 h-8 rounded-full bg-white hover:bg-slate-50 text-slate-800 shadow-md border border-slate-200 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-90 z-20"
                      title="Historias anteriores"
                    >
                      <ChevronLeft className="w-4.5 h-4.5 text-slate-700 stroke-[2.5px]" />
                    </button>

                    {/* Right Slider Arrow */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (highlightsSliderRef.current) {
                          highlightsSliderRef.current.scrollBy({ left: 220, behavior: 'smooth' });
                        }
                      }}
                      className="absolute right-2 top-[44px] -translate-y-1/2 w-8 h-8 rounded-full bg-white hover:bg-slate-50 text-slate-800 shadow-md border border-slate-200 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-90 z-20"
                      title="Historias siguientes"
                    >
                      <ChevronRight className="w-4.5 h-4.5 text-slate-700 stroke-[2.5px]" />
                    </button>

                    <div 
                      ref={highlightsSliderRef}
                      className="py-4.5 flex items-center gap-5 overflow-x-auto scrollbar-none select-none w-full scroll-smooth px-10"
                    >
                      
                      {/* Array of active stories from highlights state */}
                      <div className="flex items-center gap-4 flex-1">
                      {/* USER ACTIVE STORIES */}
                      {profileActiveStories.length > 0 && (
                        <div className="flex flex-col items-center gap-1 shrink-0 group/story relative">
                          <div 
                            onClick={() => {
                              setSelectedStoryForPreview({
                                id: profileActiveStories[0].id,
                                title: profileActiveStories[0].title,
                                image: profileActiveStories[0].image,
                                isVideo: profileActiveStories[0].isVideo
                              });
                              setProfileStorySubIndex(0);
                            }}
                            className="relative w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-green-400 via-emerald-500 to-indigo-600 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center shrink-0 animate-pulse-subtle"
                          >
                            <div className="w-full h-full rounded-full bg-white p-[2px] flex items-center justify-center">
                              <div className="w-full h-full rounded-full overflow-hidden relative border border-slate-150">
                                {profileActiveStories[0].isVideo ? (
                                  <video src={profileActiveStories[0].image} className="w-full h-full object-cover" muted />
                                ) : (
                                  <img 
                                    src={profileActiveStories[0].image} 
                                    className="w-full h-full object-cover transition duration-300 group-hover/story:scale-110" 
                                    alt="mi historia"
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <div className="absolute inset-0 bg-black/10 group-hover/story:bg-transparent transition duration-200" />
                                <span className="absolute bottom-1.5 right-1.5 bg-green-500 w-3 h-3 rounded-full border border-white" />
                              </div>
                            </div>
                          </div>
                          
                          <span className="text-[11px] font-extrabold text-emerald-800 tracking-tight block max-w-[80px] truncate lowercase mt-1 text-center">
                            mi historia
                          </span>
                        </div>
                      )}

                      {highlights.map((hi) => (
                        <div 
                          key={hi.id} 
                          className="flex flex-col items-center gap-1 shrink-0 group/story relative"
                        >
                          {/* Story circle card (za.png) */}
                          <div 
                            onClick={() => {
                              setSelectedStoryForPreview(hi);
                              setProfileStorySubIndex(0);
                            }}
                            className="relative w-20 h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center shrink-0"
                          >
                            <div className="w-full h-full rounded-full bg-white p-[2px] flex items-center justify-center">
                              <div className="w-full h-full rounded-full overflow-hidden relative border border-slate-100">
                                <img 
                                  src={hi.image} 
                                  className="w-full h-full object-cover transition duration-300 group-hover/story:scale-110" 
                                  alt={hi.title}
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150';
                                  }} 
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover/story:bg-transparent transition duration-200" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Lowercase Space-Grotesk style Labels */}
                          <span className="text-[11px] font-medium text-slate-700 tracking-tight block max-w-[80px] truncate lowercase mt-1 text-center">
                            {hi.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                  {/* Navigation Tabs supporting saved videos, and private stories archive */}
                  <div className={`grid ${isOwnProfile ? 'grid-cols-6' : 'grid-cols-5'} py-2.5 text-center select-none gap-2 px-1`}>
                    <button
                      type="button"
                      onClick={() => setActiveGalleryTab('grid')}
                      className={`tab-trigger py-2.5 px-1.5 flex justify-center items-center gap-2 transition-all duration-150 cursor-pointer rounded-xl ${
                        activeGalleryTab === 'grid' 
                          ? 'bg-pink-50 text-pink-600 font-extrabold border border-pink-200/40 shadow-3xs scale-102' 
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                      }`}
                      title="Cuadrícula de fotos"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 shrink-0">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveGalleryTab('saved')}
                      className={`tab-trigger py-2.5 px-1.5 flex justify-center items-center gap-2 transition-all duration-150 cursor-pointer rounded-xl ${
                        activeGalleryTab === 'saved' 
                          ? 'bg-pink-50 text-pink-600 font-extrabold border border-pink-200/40 shadow-3xs scale-102' 
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                      }`}
                      title="Guardado"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 shrink-0">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                      </svg>
                    </button>

                    {/* Interactive Saved Videos Tab Icon (zaq.png request) */}
                    <button
                      type="button"
                      onClick={() => setActiveGalleryTab('saved_videos')}
                      className={`tab-trigger py-2.5 px-1.5 flex justify-center items-center gap-2 transition-all duration-150 cursor-pointer rounded-xl ${
                        activeGalleryTab === 'saved_videos' 
                          ? 'bg-pink-50 text-pink-600 font-extrabold border border-pink-200/40 shadow-3xs scale-102' 
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                      }`}
                      title="Vídeos Guardados"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 shrink-0">
                        <path d="M23 7l-7 5 7 5V7z" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                        <polygon points="6 9 11 12 6 15 6 9" fill="currentColor" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveGalleryTab('reposts')}
                      className={`tab-trigger py-2.5 px-1.5 flex justify-center items-center gap-2 transition-all duration-150 cursor-pointer rounded-xl ${
                        activeGalleryTab === 'reposts' 
                          ? 'bg-pink-50 text-pink-600 font-extrabold border border-pink-200/40 shadow-3xs scale-102' 
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                      }`}
                      title="Reposts"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 shrink-0">
                        <path d="M17 1l4 4-4 4" />
                        <path d="M3 11V9a4 4 0 014-4h14" />
                        <path d="M7 23l-4-4 4-4" />
                        <path d="M21 13v2a4 4 0 01-4 4H3" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveGalleryTab('tagged')}
                      className={`tab-trigger py-2.5 px-1.5 flex justify-center items-center gap-2 transition-all duration-150 cursor-pointer rounded-xl ${
                        activeGalleryTab === 'tagged' 
                          ? 'bg-pink-50 text-pink-600 font-extrabold border border-pink-200/40 shadow-3xs scale-102' 
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                      }`}
                      title="Etiquetado"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 shrink-0">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </button>

                    {isOwnProfile && (
                      <button
                        type="button"
                        onClick={() => setActiveGalleryTab('stories_archive' as any)}
                        className={`tab-trigger py-2.5 px-1.5 flex justify-center items-center gap-2 transition-all duration-150 cursor-pointer rounded-xl ${
                          activeGalleryTab === ('stories_archive' as any) 
                            ? 'bg-pink-50 text-pink-600 font-extrabold border border-pink-200/40 shadow-3xs scale-102' 
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                        }`}
                        title="Archivo Privado de Historias"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 shrink-0">
                          <polyline points="21 8 21 21 3 21 3 8" />
                          <rect x="1" y="3" width="22" height="5" />
                          <line x1="10" y1="12" x2="14" y2="12" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Filtered Active Tab Display */}
                  {(() => {
                    if (activeGalleryTab === ('stories_archive' as any)) {
                      return (
                        <div className="space-y-4 text-left">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900/5 p-4 rounded-xl border border-slate-200 gap-3">
                            <div>
                              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">📦 Archivo de Historias Privado</h4>
                              <p className="text-[10px] text-slate-500 leading-normal">
                                Las historias que subes se guardan de forma indefinida de manera totalmente privada aquí para ti.
                              </p>
                            </div>
                            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs shrink-0 self-start sm:self-center">
                              <span className="text-[10px] text-slate-705 font-bold">Activar Archivo:</span>
                              <input 
                                type="checkbox" 
                                checked={storyArchiveEnabled} 
                                onChange={(e) => {
                                  setStoryArchiveEnabled(e.target.checked);
                                  localStorage.setItem(`story_archive_enabled_${userProfile.id}`, JSON.stringify(e.target.checked));
                                }}
                                className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                              />
                            </div>
                          </div>

                          {archivedStories.length === 0 ? (
                            <div className="py-12 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                              <svg className="w-8 h-8 mx-auto mb-2 opacity-50 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="21 8 21 21 3 21 3 8" />
                                <rect x="1" y="3" width="22" height="5" />
                                <line x1="10" y1="12" x2="14" y2="12" strokeWidth="3" />
                              </svg>
                              <span className="text-xs font-bold block text-slate-705">No hay ninguna historia en tu archivo</span>
                              <span className="text-[10px] text-slate-500">Sube una historia de 24h con el archivo activado para verla aquí.</span>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-1.5">
                              {archivedStories.map((s: any) => (
                                <div 
                                  key={s.id}
                                  onClick={() => {
                                    setSelectedStoryForPreview({
                                      id: s.id,
                                      title: s.title,
                                      image: s.image,
                                      isVideo: s.isVideo
                                    });
                                    const idx = archivedStories.findIndex((a: any) => a.id === s.id);
                                    if (idx !== -1) {
                                      setProfileStorySubIndex(idx);
                                    } else {
                                      setProfileStorySubIndex(0);
                                    }
                                  }}
                                  className="relative aspect-[9/16] bg-slate-950 rounded-xl overflow-hidden group shadow-xs border border-slate-200 animate-scale-up cursor-pointer hover:border-indigo-500 hover:scale-[1.02] hover:shadow-md transition-all duration-300"
                                >
                                  {s.isVideo ? (
                                    <video src={s.image} className="w-full h-full object-cover" muted playsInline />
                                  ) : (
                                    <img src={s.image} className="w-full h-full object-cover" alt={s.title} referrerPolicy="no-referrer" />
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                                  
                                  {/* Quick Actions overlay */}
                                  <div className="absolute inset-x-2 top-2 flex justify-between z-10">
                                    <span className="text-[8px] bg-slate-950/80 text-white px-2 py-0.5 rounded-full font-mono font-bold tracking-tight">
                                      {new Date(s.createdAt).toLocaleDateString()}
                                    </span>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const next = archivedStories.filter((a: any) => a.id !== s.id);
                                        setArchivedStories(next);
                                        localStorage.setItem(`archived_stories_${userProfile.id}`, JSON.stringify(next));
                                        window.dispatchEvent(new Event('stories-updated'));
                                      }}
                                      className="w-5.5 h-5.5 rounded-full bg-black/50 text-white flex items-center justify-center transition shadow-sm cursor-pointer hover:bg-rose-600 hover:scale-110 active:scale-95"
                                      title="Eliminar del archivo"
                                    >
                                      <X className="w-3.5 h-3.5 stroke-[3.5]" />
                                    </button>
                                  </div>

                                  <div className="absolute inset-x-2.5 bottom-2.5 text-white space-y-1 text-left z-10">
                                    <p className="text-[11px] font-black truncate drop-shadow-sm">{s.title}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (activeGalleryTab === 'saved_videos') {
                      const rawFiltered = savedVideos.filter((vid: any) => {
                        if (savedVideoCategoryFilter === 'Todos') return true;
                        const isUploaded = vid.id && (String(vid.id).includes('uploaded') || String(vid.id).includes('sv-'));
                        const matchesCategory = vid.videoCategory === savedVideoCategoryFilter ||
                                                (savedVideoCategoryFilter === 'Modelos' && isUploaded);
                        return matchesCategory;
                      });

                      const filteredSavedVideos: any[] = [];
                      const seenVidUrls = new Set<string>();
                      const seenVidIds = new Set<string>();
                      for (const item of rawFiltered) {
                        if (!item || !item.id) continue;
                        const urlKey = (item.videoUrl || '').trim();
                        if (seenVidIds.has(item.id)) continue;
                        if (urlKey && seenVidUrls.has(urlKey)) continue;
                        seenVidIds.add(item.id);
                        if (urlKey) seenVidUrls.add(urlKey);
                        filteredSavedVideos.push(item);
                      }

                      return (
                        <div className="space-y-6 w-full text-left">
                          {/* Category Selector Bar matching exact requested categories */}
                          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 flex flex-wrap items-center justify-center gap-1.5 shadow-2xs">
                            {[
                              { id: 'Todos', label: 'Todos 🪐', color: 'bg-slate-100 hover:bg-slate-200 text-slate-800' },
                              { id: 'Reels', label: 'Reels 🎥', color: 'bg-rose-50 hover:bg-rose-100 text-rose-700' },
                              { id: 'Fashion', label: 'Fashion ✨', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700' },
                              { id: 'Finanzas', label: 'Finanzas 📈', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700' },
                              { id: 'Modelos', label: 'Modelos 👑', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700' },
                              { id: 'BackStage', label: 'BackStage 🎬', color: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700' },
                              { id: 'Investors', label: 'Investors 💼', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
                              { id: 'Tiendas', label: 'Tiendas 🛍️', color: 'bg-sky-50 hover:bg-sky-100 text-sky-700' },
                              { id: 'Catwalk', label: 'Catwalks 👠', color: 'bg-violet-50 hover:bg-violet-100 text-violet-700' }
                            ].map(cat => {
                              const isActive = savedVideoCategoryFilter === cat.id;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => setSavedVideoCategoryFilter(cat.id as any)}
                                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black tracking-wide border cursor-pointer transition-all duration-200 active:scale-95 ${
                                    isActive 
                                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm scale-105' 
                                      : `${cat.color} border-transparent`
                                  }`}
                                >
                                  {cat.label}
                                </button>
                              );
                            })}
                          </div>

                          {filteredSavedVideos.length === 0 ? (
                            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 w-full">
                              <span className="text-4xl block mb-2">📂</span>
                              <p className="text-xs font-black text-slate-600">No hay vídeos guardados en la categoría {savedVideoCategoryFilter === 'Catwalk' ? 'Catwalks' : savedVideoCategoryFilter}</p>
                              <p className="text-[10px] text-slate-400 mt-1">Guarda vídeos desde Casting Live asignando esta categoría para que se muestren aquí.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                              {filteredSavedVideos.map((vid) => (
                                <div 
                                  key={vid.id}
                                  className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group relative flex flex-col justify-between aspect-[9/16] transition-all duration-300 hover:shadow-md cursor-pointer"
                                  onMouseEnter={(e) => {
                                    const video = e.currentTarget.querySelector('video');
                                    if (video) {
                                      video.muted = isProfileVideoMuted;
                                      video.volume = profileVideoVolume;
                                      video.play().catch((err) => console.log('Error playing video:', err));
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    const video = e.currentTarget.querySelector('video');
                                    if (video) {
                                      video.pause();
                                    }
                                  }}
                                >
                                  {/* Video Delete Button */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteVideo(vid.id);
                                    }}
                                    className="absolute top-2.5 right-2.5 z-45 w-8 h-8 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/70 flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-110 cursor-pointer opacity-0 group-hover:opacity-100"
                                    title="Eliminar video guardado"
                                  >
                                    <X className="w-5.5 h-5.5 stroke-[2.5] drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]" />
                                  </button>

                                  <video 
                                    src={vid.videoUrl} 
                                    className="absolute inset-0 w-full h-full object-cover saved-video-element" 
                                    loop 
                                    muted={isProfileVideoMuted} 
                                    playsInline 
                                    ref={(el) => {
                                      if (el) {
                                        el.volume = profileVideoVolume;
                                        el.muted = isProfileVideoMuted;
                                      }
                                    }}
                                  />

                                  {/* 🔊 Volume Bar Zone on the left margin, appears on hover */}
                                  <div 
                                    className="absolute left-0 top-0 bottom-0 w-[54px] sm:w-[60px] z-30 flex flex-col items-center justify-center pointer-events-auto group/volume-hover-zone"
                                    onClick={(e) => e.stopPropagation()} // Prevent card click
                                  >
                                    {/* Mute/Volume icon visible on left edge when inactive */}
                                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-100 group-hover/volume-hover-zone:opacity-0 transition-opacity duration-300 pointer-events-none z-20">
                                      {isProfileVideoMuted ? (
                                        <VolumeX className="w-4.5 h-4.5 text-rose-500 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]" />
                                      ) : profileVideoVolume < 0.45 ? (
                                        <Volume1 className="w-4.5 h-4.5 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]" />
                                      ) : (
                                        <Volume2 className="w-4.5 h-4.5 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]" />
                                      )}
                                      <span className="text-[6.5px] text-slate-300 font-black tracking-widest uppercase [writing-mode:vertical-lr] select-none rotate-180 opacity-80 mt-1">
                                        SONIDO
                                      </span>
                                    </div>

                                    {/* The actual slider panel that appears smoothly on hover */}
                                    <div className="w-12 h-[220px] bg-black/75 backdrop-blur-xs py-3 px-1 rounded-l-2xl border-r border-white/10 flex flex-col items-center justify-between select-none shadow-2xl transition-all duration-300 ease-out opacity-0 -translate-x-4 pointer-events-none group-hover/volume-hover-zone:opacity-100 group-hover/volume-hover-zone:translate-x-0 group-hover/volume-hover-zone:pointer-events-auto">
                                      {/* Mute Button Toggle */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const nextMute = !isProfileVideoMuted;
                                          setIsProfileVideoMuted(nextMute);
                                          localStorage.setItem('profile_video_muted', String(nextMute));
                                        }}
                                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition cursor-pointer border-0 p-0"
                                        title={isProfileVideoMuted ? "Activar sonido" : "Silenciar"}
                                      >
                                        {isProfileVideoMuted ? (
                                          <VolumeX className="w-4.5 h-4.5 text-rose-500" />
                                        ) : profileVideoVolume < 0.45 ? (
                                          <Volume1 className="w-4.5 h-4.5 text-white" />
                                        ) : (
                                          <Volume2 className="w-4.5 h-4.5 text-white" />
                                        )}
                                      </button>

                                      {/* Vertical Slider Track */}
                                      <div 
                                        className="relative h-28 w-2 bg-white/15 hover:bg-white/20 rounded-full cursor-ns-resize transition-colors flex flex-col justify-end overflow-visible group/vol-track"
                                        onMouseDown={(e) => {
                                          e.stopPropagation();
                                          const rect = e.currentTarget.getBoundingClientRect();
                                          const updateVolume = (mouseY: number) => {
                                            const relativeY = rect.bottom - mouseY;
                                            const percentage = Math.max(0, Math.min(1, relativeY / rect.height));
                                            setProfileVideoVolume(percentage);
                                            setIsProfileVideoMuted(false);
                                            localStorage.setItem('profile_video_volume', String(percentage));
                                            localStorage.setItem('profile_video_muted', 'false');
                                          };

                                          updateVolume(e.clientY);

                                          const handleMouseMove = (moveEvent: MouseEvent) => {
                                            updateVolume(moveEvent.clientY);
                                          };

                                          const handleMouseUp = () => {
                                            window.removeEventListener('mousemove', handleMouseMove);
                                            window.removeEventListener('mouseup', handleMouseUp);
                                          };

                                          window.addEventListener('mousemove', handleMouseMove);
                                          window.addEventListener('mouseup', handleMouseUp);
                                        }}
                                      >
                                        {/* Filled level indicator */}
                                        <div 
                                          className="bg-rose-500 rounded-full transition-all duration-75 pointer-events-none"
                                          style={{ height: `${isProfileVideoMuted ? 0 : profileVideoVolume * 100}%` }}
                                        />
                                        
                                        {/* Handle node */}
                                        <div 
                                          className="absolute w-3.5 h-3.5 rounded-full bg-white shadow-md border border-rose-400 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-75"
                                          style={{ bottom: `calc(${isProfileVideoMuted ? 0 : profileVideoVolume * 100}% - 7px)` }}
                                        />
                                      </div>

                                      {/* Numeric Volume indicator percentage */}
                                      <span className="text-[9px] font-mono font-black text-slate-350 tracking-tight">
                                        {isProfileVideoMuted ? '0%' : `${Math.round(profileVideoVolume * 100)}%`}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/35 z-10 animate-fade-in" />

                                  {/* Centered TikTok-style Play Button */}
                                  <div className="absolute inset-0 flex items-center justify-center z-25 pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedStoryForPreview({ id: vid.id, title: vid.title, image: vid.videoUrl, isVideo: true })}
                                      className="pointer-events-auto w-14 h-14 rounded-full bg-black/60 hover:bg-[#fe2c55] text-white border border-white/20 hover:border-transparent flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-115 active:scale-95 cursor-pointer backdrop-blur-xs group/play"
                                      title="Reproducir Vídeo"
                                    >
                                      <Play className="w-5.5 h-5.5 text-white fill-current translate-x-0.5 transition-transform duration-300 group-hover/play:scale-110" />
                                    </button>
                                  </div>

                                  <div className="p-3.5 z-20 flex items-center justify-between text-white relative">
                                    <span className="text-[10px] font-mono text-slate-200 bg-black/40 px-2 py-0.5 rounded-full flex items-center gap-1 select-none">
                                      👁️ {vid.views}
                                    </span>
                                    <div />
                                  </div>

                                  <div className="p-4 z-20 text-white space-y-1.5 relative mt-auto text-left select-none pr-[58px]">
                                    <div className="flex items-center gap-1.5">
                                      <img 
                                        src={vid.avatar} 
                                        className="w-4.5 h-4.5 rounded-full object-cover border border-white/20" 
                                        alt={vid.name || 'Anonymous'} 
                                      />
                                      <span className="text-[10px] font-bold">@{(vid.name || 'Anonymous').toLowerCase()}</span>
                                    </div>
                                    <h4 className="text-xs font-black leading-snug line-clamp-1">{vid.title}</h4>
                                    <p className="text-[9.5px] text-slate-300 leading-normal line-clamp-2">{vid.description}</p>
                                    <div className="text-[9px] font-bold text-slate-350 flex items-center gap-1 pt-0.5">
                                      <span>🎵 {vid.music}</span>
                                    </div>


                                  </div>

                              {/* 💖 High-fidelity Sidebar INSIDE the video container, running top-to-bottom and flush with the right edge on hover */}
                              <div className="absolute right-0 top-0 bottom-0 w-[54px] sm:w-[60px] z-30 flex flex-col items-stretch pointer-events-auto group/sidebar-hover-zone" id={`saved-vid-right-sidebar-${vid.id}`}>

                                {/* Subtle visual handle on the right edge of the video container when sidebar is hidden */}
                                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-100 group-hover/sidebar-hover-zone:opacity-0 transition-opacity duration-300 pointer-events-none z-20" id="sidebar-glow-handle">
                                  <div className="w-1 h-14 rounded-full bg-gradient-to-b from-transparent via-[#fe2c55]/85 to-transparent animate-pulse shadow-[0_0_8px_rgba(254,44,85,0.6)]" />
                                  <span className="text-[6.5px] text-pink-400 font-black tracking-widest uppercase [writing-mode:vertical-lr] select-none rotate-180 opacity-80 mt-1">
                                    OPCIONES
                                  </span>
                                </div>

                                {/* The actual sidebar that matches premium platform layouts (appears smoothly only when mouse is in the right margin zone) */}
                                <div className="w-full h-full bg-black/75 backdrop-blur-xs py-2 sm:py-3.5 px-0.5 sm:px-1 rounded-r-2xl border-l border-white/10 flex flex-col items-center justify-between select-none shadow-2xl transition-all duration-300 ease-out opacity-0 translate-x-4 pointer-events-none group-hover/sidebar-hover-zone:opacity-100 group-hover/sidebar-hover-zone:translate-x-0 group-hover/sidebar-hover-zone:pointer-events-auto" id="video-right-sidebar-panel">
                                  
                                  <div /> {/* Spacer replacing the removed avatar block to maintain balance */}

                                  {/* Heart Button Area */}
                                  <div className="flex flex-col items-center shrink-0">
                                    <button
                                      onClick={(e) => handleToggleLikeSavedVideo(vid.id, e)}
                                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/10 flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-75 cursor-pointer"
                                      title="Me gusta"
                                    >
                                      <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${vid.isLiked ? 'text-red-550 fill-red-550 scale-110 animate-[bounce_1s_infinite]' : 'text-rose-500'}`} />
                                    </button>
                                    <span className="text-[8.5px] sm:text-[9.5px] font-black text-pink-100 mt-0.5 tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                                      {vid.likes || 423}
                                    </span>
                                  </div>

                                  {/* Comment Button Area */}
                                  <div className="flex flex-col items-center shrink-0">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenCommentsVideoId(openCommentsVideoId === vid.id ? null : vid.id);
                                      }}
                                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 flex items-center justify-center shadow-md transition hover:scale-110 active:scale-90 cursor-pointer ${
                                        openCommentsVideoId === vid.id 
                                          ? 'bg-[#fe2c55] border-[#fe2c55] text-white animate-pulse' 
                                          : 'bg-white/10 hover:bg-white text-white hover:text-slate-900'
                                      }`}
                                      title="Comentarios"
                                    >
                                      <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <span className="text-[8.5px] sm:text-[9.5px] font-black text-pink-100 mt-0.5 tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                                      {(customComments[vid.id]?.length || 0) + (mockCommentsMap[vid.id]?.length || 3)}
                                    </span>
                                  </div>

                                  {/* Favorite Folder Button Area */}
                                  <div className="flex flex-col items-center shrink-0">
                                    <button
                                      onClick={(e) => handleToggleFavoriteSavedVideo(vid.id, e)}
                                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/10 flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-75 cursor-pointer"
                                      title="Añadir a favoritos"
                                    >
                                      <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${vid.isFavorited ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                                    </button>
                                    <span className="text-[8.5px] sm:text-[9.5px] font-black text-pink-100 mt-0.5 tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                                      {vid.favoritesCount || 78}
                                    </span>
                                  </div>

                                  {/* 🔔 FLOATING ACTIVITY LOGGER BUTTON AREA */}
                                  <div className="flex flex-col items-center shrink-0">
                                    <button
                                      onClick={(e) => triggerBellNotification(vid.id, e)}
                                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 flex items-center justify-center shadow-md transition hover:scale-110 active:scale-90 cursor-pointer ${
                                        bellNotifications[vid.id]
                                          ? 'bg-[#fe2c55] border-[#fe2c55] text-white' 
                                          : 'bg-white/10 hover:bg-white text-white hover:text-slate-900'
                                      }`}
                                      title="Actividad Reciente"
                                    >
                                      <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <span className="text-[7px] sm:text-[8px] font-black text-pink-100 mt-0.5 uppercase tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                                      Actividad
                                    </span>
                                  </div>

                                  {/* Share button Area */}
                                  <div className="flex flex-col items-center shrink-0 relative">
                                    <button
                                      onClick={(e) => handleShareSavedVideo(vid.id, e)}
                                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 flex items-center justify-center shadow-md transition hover:scale-110 active:scale-90 cursor-pointer ${
                                        copiedVideoId === vid.id
                                          ? 'bg-emerald-550 border-emerald-500 text-white' 
                                          : 'bg-white/10 hover:bg-white text-white hover:text-slate-900'
                                      }`}
                                      title="Compartir"
                                    >
                                      <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </button>
                                    <span className="text-[8.5px] sm:text-[9.5px] font-black text-pink-100 mt-0.5 tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                                      {vid.shares || 34}
                                    </span>
                                  </div>

                                  {/* Virtual Gift Button */}
                                  <div className="flex flex-col items-center shrink-0">
                                    <button
                                      onClick={(e) => triggerGiftExplosion(vid.id, e)}
                                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 flex items-center justify-center shadow-md transition hover:scale-110 active:scale-90 cursor-pointer ${
                                        giftExplosions[vid.id]?.show
                                          ? 'bg-amber-500 border-amber-500 text-white animate-bounce' 
                                          : 'bg-white/10 hover:bg-white text-white hover:text-slate-900'
                                      }`}
                                      title="Enviar Regalos Virtuales"
                                    >
                                      <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                                    </button>
                                    <span className="text-[8px] sm:text-[9px] font-black text-pink-100 mt-0.5 tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
                                      Regalo
                                    </span>
                                  </div>

                                  {/* Spinning vinyl record record art with matching border halo */}
                                  <div className="relative mt-0.5 animate-spin duration-[1800ms] linear shrink-0">
                                    <div className="w-5.5 h-5.5 sm:w-7 sm:h-7 rounded-full bg-slate-950 p-[1px] border border-slate-300/40 flex items-center justify-center relative overflow-hidden shadow-md">
                                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 border border-white/30 z-10" />
                                      <img
                                        src={vid.avatar}
                                        alt="Vinyl label animate"
                                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                  </div>

                                </div>
                              </div>

                              {/* 🎁 VIRTUAL GIFT EXPLOSION OVERLAY */}
                              {giftExplosions[vid.id]?.show && (
                                <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none bg-black/45 animate-fade-in rounded-2xl">
                                  <div className="text-center space-y-2 animate-bounce">
                                    <div className="text-5xl drop-shadow-[0_4px_12px_rgba(251,191,36,0.8)] animate-pulse">
                                      {giftExplosions[vid.id].emoji}
                                    </div>
                                    <div className="bg-amber-500 text-black text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-lg border border-white/25">
                                      ¡REGALO ENVIADO!
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* 🔔 BELL NOTIFICATION / CHANNEL ACTIVITY OVERLAY */}
                              {bellNotifications[vid.id] && (
                                <div className="absolute top-12 inset-x-2 z-40 bg-slate-950/95 border border-indigo-500/40 text-white rounded-xl p-2.5 shadow-xl animate-scale-up text-left">
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                                    <span className="text-[8px] font-black uppercase text-indigo-400 tracking-wider">Actividad del Canal</span>
                                  </div>
                                  <p className="text-[9.5px] font-semibold text-slate-200 mt-1 leading-normal">
                                    🔔 @{(vid.name || 'Anonymous').toLowerCase()} ha subido nuevo material hoy. ¡Suscríbete para apoyarla!
                                  </p>
                                </div>
                              )}

                              {/* 🌐 SHARE COPIED TOAST OVERLAY */}
                              {copiedVideoId === vid.id && (
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-emerald-550 text-white px-2.5 py-1 rounded-full text-[9px] font-extrabold flex items-center gap-1 shadow-lg animate-scale-up">
                                  <span>✅</span>
                                  <span>¡Enlace copiado!</span>
                                </div>
                              )}

                              {/* 💬 INTERACTIVE COMMENTS OVERLAY (MOBILE COM-PANEL STYLE) */}
                              {openCommentsVideoId === vid.id && (
                                <div className="absolute inset-0 bg-black/60 z-35 flex flex-col justify-end rounded-2xl overflow-hidden animate-fade-in">
                                  <div 
                                    className="absolute inset-0 -z-10 cursor-pointer" 
                                    onClick={() => setOpenCommentsVideoId(null)} 
                                  />
                                  <div className="bg-white text-slate-900 rounded-t-2xl p-2.5 h-[70%] flex flex-col space-y-2 animate-slide-up relative">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">
                                        Comentarios ({(customComments[vid.id]?.length || 0) + (mockCommentsMap[vid.id]?.length || 3)})
                                      </span>
                                      <button 
                                        onClick={() => setOpenCommentsVideoId(null)}
                                        className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {/* Comment List */}
                                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                                      {/* Custom comments added by the user */}
                                      {(customComments[vid.id] || []).map((comm, cIdx) => (
                                        <div key={`custom-${cIdx}`} className="text-left space-y-0.5">
                                          <div className="flex items-center gap-1">
                                            <span className="text-[9px] font-extrabold text-indigo-600">@{comm.user}</span>
                                            <span className="text-[7.5px] text-slate-400">{comm.time}</span>
                                          </div>
                                          <p className="text-[10px] text-slate-700 leading-normal">{comm.text}</p>
                                        </div>
                                      ))}
                                      {/* Predefined mock comments */}
                                      {(mockCommentsMap[vid.id] || []).map((comm, cIdx) => (
                                        <div key={`mock-${cIdx}`} className="text-left space-y-0.5">
                                          <div className="flex items-center gap-1">
                                            <span className="text-[9px] font-extrabold text-slate-700">@{comm.user}</span>
                                            <span className="text-[7.5px] text-slate-400">{comm.time}</span>
                                          </div>
                                          <p className="text-[10px] text-slate-600 leading-normal">{comm.text}</p>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Input zone */}
                                    <div className="border-t border-slate-100 pt-1.5 flex gap-1 items-center">
                                      <input 
                                        type="text" 
                                        value={newCommentText}
                                        onChange={(e) => setNewCommentText(e.target.value)}
                                        placeholder="Escribe algo..."
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            handleVideoAddComment(vid.id);
                                          }
                                        }}
                                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] focus:outline-hidden focus:ring-1 focus:ring-[#fe2c55] text-slate-900"
                                      />
                                      <button
                                        onClick={() => handleVideoAddComment(vid.id)}
                                        className="p-1 bg-[#fe2c55] hover:bg-rose-600 text-white rounded-lg transition active:scale-95 cursor-pointer"
                                        title="Enviar"
                                      >
                                        <Send className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}

                            </div>
                          ))}
                        </div>
                      )}
                      </div>
                      );
                    }

                    let displayedPhotos = profilePhotos;
                    if (activeGalleryTab === 'saved') {
                      const savedKeys = Object.keys(bookmarkedPhotos).filter(k => bookmarkedPhotos[k]);
                      if (savedKeys.length > 0) {
                        displayedPhotos = savedKeys;
                      } else {
                        displayedPhotos = [profilePhotos[0], profilePhotos[3], profilePhotos[5]]
                          .filter(Boolean)
                          .filter(ph => bookmarkedPhotos[ph] !== false);
                      }
                    }
                    if (activeGalleryTab === 'reposts') {
                      const repostedKeys = Object.keys(repostedPhotos).filter(k => repostedPhotos[k]);
                      if (repostedKeys.length > 0) {
                        displayedPhotos = repostedKeys;
                      } else {
                        displayedPhotos = [profilePhotos[2], profilePhotos[4], profilePhotos[7]]
                          .filter(Boolean)
                          .filter(ph => repostedPhotos[ph] !== false);
                      }
                    }
                    if (activeGalleryTab === 'tagged') {
                      displayedPhotos = [profilePhotos[1], profilePhotos[6], profilePhotos[8]]
                        .filter(Boolean)
                        .filter(ph => !hiddenTaggedPhotos.includes(ph));
                    }

                    return (
                      <div className="space-y-5 w-full text-left">
                        {/* Categories Bar matching image.png & z.png request */}
                        {activeGalleryTab === 'saved' && (
                          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 flex flex-wrap items-center justify-center gap-1.5 shadow-2xs w-full">
                            {[
                              { id: 'Todos', label: 'TODOS 🪐', color: 'bg-slate-100 hover:bg-slate-200 text-slate-800' },
                              { id: 'Reels', label: 'REELS 🎥', color: 'bg-rose-50 hover:bg-rose-100 text-rose-700' },
                              { id: 'Fashion', label: 'FASHION ✨', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700' },
                              { id: 'Finanzas', label: 'FINANZAS 📈', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700' },
                              { id: 'Modelos', label: 'MODELOS 👑', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700' },
                              { id: 'BackStage', label: 'BACKSTAGE 🎬', color: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700' },
                              { id: 'Investors', label: 'INVESTORS 💼', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
                              { id: 'Tiendas', label: 'TIENDAS 🛍️', color: 'bg-sky-50 hover:bg-sky-100 text-sky-700' },
                              { id: 'Catwalk', label: 'CATWALKS 👠', color: 'bg-violet-50 hover:bg-violet-100 text-violet-700' }
                            ].map(cat => {
                              const isActive = savedCategoryFilter === cat.id;
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => setSavedCategoryFilter(cat.id as any)}
                                  className={`px-3.5 py-1.5 rounded-xl text-[11px] font-black tracking-wide border cursor-pointer transition-all duration-200 active:scale-95 uppercase ${
                                    isActive 
                                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm scale-105' 
                                      : `${cat.color} border-transparent`
                                  }`}
                                >
                                  {cat.label}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {displayedPhotos.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {displayedPhotos.map((ph, idx) => {
                          const interaction = getPhotoInteraction(ph);
                          const hasLiked = !!interaction.likes[userProfile.id];
                          const userReaction = interaction.reactions?.[userProfile.id] || (hasLiked ? '❤️' : null);
                          const isSelectedForWinner = currentModel?.selectedWinnerPhotos?.includes(ph);

                          return (
                            <div
                              key={idx}
                              onMouseEnter={() => setHoveredPhotoUrl(ph)}
                              onMouseLeave={() => {
                                setHoveredPhotoUrl(null);
                                setHoveredHeartAndGiftPhotoUrl(null);
                              }}
                              className="flex flex-col bg-white rounded-2xl overflow-visible border border-slate-200 group transition duration-300 hover:shadow-md relative"
                            >

                              {/* Interactive Image box */}
                              <div 
                                onClick={() => setSelectedPhotoForLightbox(ph)}
                                className="aspect-square w-full rounded-t-2xl overflow-hidden bg-slate-100 relative cursor-pointer"
                                title="Haz clic para ampliar la foto"
                              >
                                <img 
                                  src={ph} 
                                  alt={`fashion ${idx}`} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />

                                {/* Deletion button in top-right of the image */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (activeGalleryTab === 'saved') {
                                      handleToggleBookmark(ph);
                                    } else if (activeGalleryTab === 'reposts') {
                                      handleToggleRepost(ph);
                                    } else if (activeGalleryTab === 'tagged') {
                                      handleRemoveTaggedPhoto(ph);
                                    } else {
                                      handleDeletePhoto(ph);
                                    }
                                  }}
                                  className="absolute top-2.5 right-2.5 z-30 w-8 h-8 rounded-full bg-black/45 text-white hover:text-white hover:bg-rose-600 flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-115 cursor-pointer shadow-md"
                                  title={
                                    activeGalleryTab === 'saved' ? "Eliminar de guardados" :
                                    activeGalleryTab === 'reposts' ? "Eliminar repost" :
                                    activeGalleryTab === 'tagged' ? "Quitar etiqueta" :
                                    "Eliminar esta foto"
                                  }
                                >
                                  <X className="w-4.5 h-4.5 stroke-[3] drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" />
                                </button>

                                {/* 🎁 Renders Extra Channel Gifts list overlay covering the image exactly */}
                                {!selectedPhotoForLightbox && hoveredHeartAndGiftPhotoUrl === ph && renderGiftsPopover(ph)}

                                {/* 💝 Renders Stickers list overlay covering the image exactly */}
                                {!selectedPhotoForLightbox && hoveredStickersPostId === ph && renderStickersPopover(ph, ph)}

                                {/* 📤 Renders the custom Full-Size Share Overlay covering the image exactly */}
                                {!selectedPhotoForLightbox && activeShareMenuPostId === ph && renderShareOverlay(ph, ph)}
                              </div>
 
                              {/* Action Row styled exactly like image.png */}
                              {renderHighFidelityActionRow(
                                ph,
                                interaction.likeCount,
                                interaction.comments.length,
                                repostCounts[ph] ?? Math.floor((ph.length % 7) + 2),
                                hasLiked,
                                !!bookmarkedPhotos[ph],
                                !!repostedPhotos[ph],
                                (e) => {
                                  e.stopPropagation();
                                  handleLikePhoto(ph, e);
                                },
                                (e) => {
                                  e.stopPropagation();
                                  setActiveGiftingPhotoUrl(ph);
                                },
                                () => setSelectedPhotoForLightbox(ph),
                                () => handleToggleRepost(ph),
                                (e) => {
                                  e.stopPropagation();
                                  setActiveShareMenuPostId(activeShareMenuPostId === ph ? null : ph);
                                },
                                () => handleToggleBookmark(ph),
                                ph
                              )}
                              
                              {!selectedPhotoForLightbox && giftConfirmPhotoUrl === ph && renderConfirmGiftOverlay(ph)}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-6 text-center">No hay fotos en esta sección.</p>
                    )}
                  </div>
                );
                  })()}
                </div>
              );
            })()}
              </>
            ) : (
              renderMuroFeed()
            )}

            {/* Legacy block disabled */}
            {false && (() => {
              const profilePhotos = currentModel ? currentModel.photos : investorPhotos;
              return profilePhotos && profilePhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2.5">
                  {profilePhotos.map((ph, idx) => {
                    const interaction = getPhotoInteraction(ph);
                    const hasLiked = !!interaction.likes[userProfile.id];
                    return (
                      <div 
                        key={idx} 
                        className="flex flex-col bg-slate-50 rounded-xl overflow-hidden border border-slate-200 group transition duration-200 hover:shadow-xs relative"
                      >
                      {/* Interactive Image box */}
                      <div 
                        onClick={() => setSelectedPhotoForLightbox(ph)}
                        className="aspect-square w-full overflow-hidden bg-slate-200 relative cursor-pointer"
                        title="Haz clic para ampliar la foto"
                      >
                        <img 
                          src={ph} 
                          alt={`fashion ${idx}`} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>

                      {/* Photo Selection check row to choose photos for final slider */}
                      {currentModel && (
                        <div className="bg-white border-t border-slate-150 py-1.5 px-1.5 flex items-center justify-between shrink-0 select-none">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleWinnerPhoto(ph);
                            }}
                            className={`w-full py-1 px-1.5 rounded-md text-[9px] font-extrabold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                              currentModel.selectedWinnerPhotos?.includes(ph)
                                ? 'bg-amber-500/15 text-amber-700 border-amber-500/40 shadow-xs'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-500/5 hover:text-amber-700 hover:border-amber-300'
                            }`}
                            title="Selecciona esta foto para que sea mostrada en el slider de patrocinador za.png en las votaciones finales"
                          >
                            <span className="truncate flex items-center gap-1">
                              {currentModel.selectedWinnerPhotos?.includes(ph)
                                ? '🏆 Elegida para Finales'
                                : 'Elegir para Votaciones'}
                            </span>
                          </button>
                        </div>
                      )}

                      {/* Info & Action Bar Directly Below */}
                      <div className="p-1 flex items-center justify-between bg-white border-t border-slate-150 text-[10px] font-semibold text-slate-500 gap-0.5 shrink-0">
                        {/* Interactive Like action */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikePhoto(ph);
                          }}
                          className={`flex items-center gap-0.5 justify-center hover:bg-slate-100 rounded-md p-1 transition cursor-pointer grow shrink-0 min-w-0 ${
                            hasLiked ? 'text-rose-600' : 'text-slate-500 hover:text-slate-800'
                          }`}
                          title={hasLiked ? 'Quitar Me gusta' : 'Me gusta'}
                        >
                          <Heart className={`w-3 h-3 shrink-0 ${hasLiked ? 'fill-current text-rose-500' : ''}`} />
                          <span className="font-mono text-[9px] truncate">{interaction.likeCount}</span>
                        </button>

                        {/* Interactive Comments preview to open lightbox */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPhotoForLightbox(ph);
                          }}
                          className="flex items-center gap-0.5 justify-center hover:bg-slate-100 rounded-md p-1 text-slate-500 hover:text-slate-800 transition cursor-pointer grow shrink-0 min-w-0"
                          title="Comentar"
                        >
                          <MessageSquare className="w-3" />
                          <span className="font-mono text-[9px] truncate">{interaction.comments.length}</span>
                        </button>

                        {/* Share photo url connection */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleRepost(ph);
                          }}
                          className={`rounded-md p-1 transition cursor-pointer shrink-0 ${
                            repostedPhotos[ph]
                              ? 'bg-rose-50/40 text-pink-500 hover:bg-rose-100/40'
                              : 'hover:bg-slate-100 text-slate-400 hover:text-indigo-600'
                          }`}
                          title="Compartir en mi muro"
                        >
                          <Share2 className={`w-3 ${repostedPhotos[ph] ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No tienes fotos en tu colección.</p>
            );
            })()}
          </div>
        </aside>
      </div>

      {/* 📸 UPDATE AVATAR URL MODAL DIALOG */}
      {isEditingAvatar && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-150 animate-fade-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-indigo-600 animate-pulse" />
                <span>Actualizar Imagen de Perfil</span>
              </h3>
              <button 
                onClick={() => { setIsEditingAvatar(false); setTempAvatarUrl(userProfile.avatar); }}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-500">
                Carga un archivo de imagen desde tu ordenador para actualizar tu foto de perfil.
              </p>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Seleccionar Foto desde tu ordenador (Escritorio):</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const dataUrl = await compressAndResizeImage(file);
                          setTempAvatarUrl(dataUrl);
                          // Immediately apply and save the uploaded profile picture
                          const nextProfile = {
                            ...userProfile,
                            avatar: dataUrl
                          };
                          onUpdateProfile(nextProfile);
                          
                          const nextModels = models.map(m => {
                            if (m.id === userProfile.id) {
                              return { ...m, avatar: dataUrl };
                            }
                            return m;
                          });
                          onUpdateModels(nextModels);
                          setIsEditingAvatar(false);
                        } catch (err) {
                          console.error('Error compressing avatar:', err);
                        }
                      }
                    }}
                    className="hidden"
                    id="avatar-photo-upload-desktop"
                  />
                  <label
                    htmlFor="avatar-photo-upload-desktop"
                    className="bg-indigo-650 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5"
                  >
                    <Camera className="w-4 h-4 text-white" />
                    <span>Seleccionar Foto</span>
                  </label>
                </div>
              </div>

              {tempAvatarUrl.trim() && (
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase">Vista Previa:</span>
                  <div className="flex justify-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-500/30 p-0.5">
                      <img 
                        src={tempAvatarUrl.trim() || undefined} 
                        alt="Preview Avatar" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full rounded-full object-cover" 
                        onError={(e) => { 
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setIsEditingAvatar(false); setTempAvatarUrl(userProfile.avatar); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAvatarSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1 transition"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar nueva foto</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📹 SELECT COVER VIDEO MODAL DIALOG */}
      {isSelectingCoverVideo && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-xl border border-slate-150 animate-fade-in text-left overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center pb-2.5 border-b border-rose-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 font-display uppercase tracking-wide">
                <Film className="w-4 h-4 text-[#fe2c55] animate-pulse" />
                <span>Gestión de Vídeos de Portada (Landing Page)</span>
              </h3>
              <button 
                onClick={() => setIsSelectingCoverVideo(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base bg-transparent border-0 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Crucial Instructions Banner */}
            <div className="bg-gradient-to-br from-pink-50 to-indigo-50/70 p-4 rounded-xl border border-pink-100 space-y-3 shadow-xs">
              <div>
                <p className="text-xs font-black text-rose-750 uppercase tracking-wide">📢 Información Oficial para Modelos Patrocinadoras</p>
                <div className="text-xs text-slate-700 font-semibold leading-relaxed mt-1">
                  Sube aquí el vídeo que se verá en el ranking de la página de inicio. ¡Este vídeo es tu carta de presentación inmediata ante marcas, inversores y patrocinadores!
                </div>
              </div>
              <div className="border-t border-white/60 pt-2">
                <p className="text-[11px] font-bold text-indigo-750 flex items-center gap-1">
                  📸 REQUISITO DE GRABACIÓN EN PRIMER PLANO:
                </p>
                <p className="text-xs text-slate-600 leading-normal pl-4 mt-0.5">
                  El vídeo debe grabarse obligatoria y exclusivamente en <strong className="text-slate-800">primer plano (con zoom en rostro y hombros, en formato selfie/vertical)</strong> para que se vea claro y profesional.
                </p>
              </div>
            </div>

            {/* Content Examples Section */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black tracking-widest text-[#cf1946] uppercase">💡 Ejemplos de Contenido que debes Expresar en el Vídeo:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px]">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                  <strong className="text-slate-850 block">🔥 Captación de Referidos</strong>
                  <p className="text-slate-600 leading-relaxed">
                    "Unete a mi equipo de inversores. Con nuestro sistema ganas un 50% de comisiones pasivas de todos los afiliados. ¡Apóyame para conseguir mejores ganancias!"
                  </p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                  <strong className="text-slate-850 block">👗 Pasarela y Atelier</strong>
                  <p className="text-slate-600 leading-relaxed">
                    "Consigue acceso a mis fotos exclusivas de pasarela y apadrina mis eventos de moda comprando mis vestidos digitales en el catálogo del Atelier."
                  </p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                  <strong className="text-slate-850 block">✨ Mensaje de Bienvenida</strong>
                  <p className="text-slate-600 leading-relaxed">
                    "Hola, soy tu modelo favorita. Patrocina mi próximo desfile VIP de Milán y obtén recompensas exclusivas que te enviaré directamente."
                  </p>
                </div>
              </div>
            </div>

            {/* Video Slot Management (Upto 3 slots) */}
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Tus 3 Vídeos Guardados de Portada:
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Guarda hasta 3 vídeos y elige cuál sale activo</span>
              </div>
              
              <div className="space-y-3">
                {coverVideoSlots.map((slot, sIdx) => {
                  const isActive = activeSlotId === slot.id;
                  return (
                    <div 
                      key={slot.id}
                      className={`p-3.5 rounded-xl border-2 transition duration-200 ${
                        isActive 
                          ? 'border-indigo-600 bg-indigo-50/20' 
                          : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                            isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                          }`}>
                            {sIdx + 1}
                          </span>
                          <input 
                            type="text"
                            value={slot.name}
                            onChange={(e) => {
                              const nextSlots = coverVideoSlots.map(s => s.id === slot.id ? { ...s, name: e.target.value } : s);
                              setCoverVideoSlots(nextSlots);
                              localStorage.setItem(`cover_video_slots_${userProfile.id}`, JSON.stringify(nextSlots));
                            }}
                            className="bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 font-bold text-slate-800 text-xs focus:ring-0 outline-none p-0.5 w-[220px]"
                            placeholder="Nombre del vídeo"
                            title="Haz clic para renombrar el vídeo"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveSlotId(slot.id);
                            localStorage.setItem(`active_cover_slot_id_${userProfile.id}`, slot.id);
                            localStorage.setItem('landing_page_cover_video_url', slot.url);
                          }}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border-0 cursor-pointer transition ${
                            isActive 
                              ? 'bg-indigo-600 text-white font-sans' 
                              : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-xs font-sans'
                          }`}
                        >
                          {isActive ? '✓ Seleccionado' : 'Elegir para Inicio'}
                        </button>
                      </div>

                      {/* 16:9 Video Upload and Preview Container */}
                      <div className="mt-3.5">
                        <div className="aspect-video w-full bg-slate-950 rounded-xl overflow-hidden relative border border-slate-200 flex flex-col items-center justify-center text-center p-4">
                          {slot.url ? (
                            <>
                              <video 
                                src={slot.url} 
                                className="absolute inset-0 w-full h-full object-cover" 
                                controls 
                                muted 
                                loop 
                                playsInline
                              />
                              <div className="absolute top-2 right-2 flex gap-1.5 z-30">
                                <label className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg text-[10px] font-bold cursor-pointer transition flex items-center gap-1 border border-white/20 select-none">
                                  <span>🔄 Cambiar</span>
                                  <input 
                                    type="file" 
                                    accept="video/*" 
                                    className="hidden" 
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const fileUrl = URL.createObjectURL(file);
                                        const nextSlots = coverVideoSlots.map(s => s.id === slot.id ? { ...s, url: fileUrl, filename: file.name } : s);
                                        setCoverVideoSlots(nextSlots);
                                        localStorage.setItem(`cover_video_slots_${userProfile.id}`, JSON.stringify(nextSlots.map(s => ({ id: s.id, name: s.name, url: s.url.startsWith('blob:') ? '' : s.url, filename: s.filename }))));
                                        if (isActive) {
                                          localStorage.setItem('landing_page_cover_video_url', fileUrl);
                                        }
                                        alert(`🎉 Vídeo "${file.name}" cargado con éxito en esta ranura.`);
                                      }
                                    }}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextSlots = coverVideoSlots.map(s => s.id === slot.id ? { ...s, url: '', filename: '' } : s);
                                    setCoverVideoSlots(nextSlots);
                                    localStorage.setItem(`cover_video_slots_${userProfile.id}`, JSON.stringify(nextSlots.map(s => ({ id: s.id, name: s.name, url: '', filename: '' }))));
                                    if (isActive) {
                                      localStorage.removeItem('landing_page_cover_video_url');
                                    }
                                  }}
                                  className="bg-red-650 hover:bg-red-700 text-white p-2 rounded-lg text-[10px] font-bold cursor-pointer transition border border-red-500 flex items-center justify-center"
                                >
                                  Quitar
                                </button>
                              </div>
                              {isActive && (
                                <div className="absolute top-2 left-2 bg-[#db2777] text-white text-[9px] font-black tracking-wide px-2 py-1 rounded-md z-30">
                                  ACTIVO EN PORTADA
                                </div>
                              )}
                              {slot.filename && (
                                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded-md backdrop-blur-xs max-w-[80%] truncate z-30">
                                  📄 {slot.filename}
                                </div>
                              )}
                            </>
                          ) : (
                            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-6 hover:bg-slate-900/[0.04] transition group">
                              <Film className="w-10 h-10 text-red-600 animate-pulse mb-2 group-hover:scale-110 duration-200" />
                              <span className="text-xs font-black text-slate-800 uppercase tracking-wide">Cargar vídeo de escritorio</span>
                              <span className="text-[10px] text-slate-500 mt-1">Soporta formato MP4, WebM (Grabación selfie vertical o landscape)</span>
                              <span className="text-[9px] text-[#db2777] font-bold mt-2.5 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100 font-mono">
                                Relación de aspecto: 16:9 (Recomendado: 1920 x 1080 píxeles)
                              </span>
                              <input 
                                type="file" 
                                accept="video/*" 
                                className="hidden" 
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const fileUrl = URL.createObjectURL(file);
                                    const nextSlots = coverVideoSlots.map(s => s.id === slot.id ? { ...s, url: fileUrl, filename: file.name } : s);
                                    setCoverVideoSlots(nextSlots);
                                    localStorage.setItem(`cover_video_slots_${userProfile.id}`, JSON.stringify(nextSlots.map(s => ({ id: s.id, name: s.name, url: s.url.startsWith('blob:') ? '' : s.url, filename: s.filename }))));
                                    if (isActive) {
                                      localStorage.setItem('landing_page_cover_video_url', fileUrl);
                                    }
                                    alert(`🎉 Vídeo "${file.name}" cargado con éxito en esta ranura.`);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-150">
              <button
                type="button"
                onClick={() => setIsSelectingCoverVideo(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition animate-fade-in"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  const activeSlot = coverVideoSlots.find(s => s.id === activeSlotId);
                  if (activeSlot && activeSlot.url) {
                    localStorage.setItem('landing_page_cover_video_url', activeSlot.url);
                    alert(`✨ ¡El vídeo "${activeSlot.name}" ha sido asignado y activado para la Landing Page!`);
                  } else {
                    localStorage.removeItem('landing_page_cover_video_url');
                    alert('✨ Se ha restablecido el fondo animado por defecto para la Landing Page.');
                  }
                  setIsSelectingCoverVideo(false);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition animate-fade-in flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5 text-[#db2777]" />
                <span>Aplicar a Portada de Inicio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ INTERACTIVE PHOTO LIGHTBOX MODEL WITH LIKES AND COMMENTS */}
      {selectedPhotoForLightbox && (() => {
        const activeInteraction = getPhotoInteraction(selectedPhotoForLightbox);
        const hasLiked = !!activeInteraction.likes[userProfile.id];
        const closeLightbox = () => {
          setSelectedPhotoForLightbox(null);
          setLightboxCommentText('');
          setActiveGiftingPhotoUrl(null);
          setHoveredStickersPostId(null);
        };

        return (
          <div className="fixed inset-0 z-[120] bg-black/10 flex items-center justify-center p-2 sm:p-4 animate-fade-in duration-300">
            {/* Click backdrop to close */}
            <div 
              className="absolute inset-0 cursor-zoom-out" 
              onClick={closeLightbox} 
            />

            {/* Lightbox Container */}
            <div className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] md:max-h-[85vh] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-100/10 relative z-10 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-150 transition-all duration-300">
              
              {/* Close Button on Mobile */}
              <button 
                onClick={closeLightbox}
                className="absolute top-4 right-4 md:hidden z-30 bg-slate-950/70 hover:bg-slate-950 text-white w-8 h-8 rounded-full flex items-center justify-center transition duration-150 shadow-md cursor-pointer"
                title="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>

              {/* LEFT: Image Stage */}
              <div className="md:w-[55%] bg-[#0d0f14] flex items-center justify-center p-0 relative min-h-[220px] sm:min-h-[300px] md:h-[450px] lg:h-[550px] overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none group/stage">
                {/* Ambient Blur Glow Background */}
                <img 
                  src={selectedPhotoForLightbox} 
                  alt=""
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-25 scale-110 pointer-events-none select-none"
                />

                <img 
                  src={selectedPhotoForLightbox} 
                  alt="Muestra de moda en grande"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain max-h-[35vh] sm:max-h-[40vh] md:max-h-[75vh] relative z-10 transition-all duration-300 group-hover/stage:scale-[1.015]"
                />

                {/* 🎁 Renders Extra Channel Gifts list overlay covering the image exactly */}
                {hoveredHeartAndGiftPhotoUrl === selectedPhotoForLightbox && renderGiftsPopover(selectedPhotoForLightbox, true)}

                {/* 💝 Renders Stickers list overlay covering the image exactly */}
                {hoveredStickersPostId === selectedPhotoForLightbox && renderStickersPopover(selectedPhotoForLightbox, selectedPhotoForLightbox, true)}

                {giftConfirmPhotoUrl === selectedPhotoForLightbox && renderConfirmGiftOverlay(selectedPhotoForLightbox, true)}
              </div>

              {/* RIGHT: Feed panel with Likes and comments */}
              <div className="md:w-[45%] flex flex-col h-[480px] md:h-[450px] lg:h-[550px] justify-between bg-white relative">
                
                {/* Header (Model profile card link) */}
                <div className="p-4 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={userProfile.avatar} 
                      alt={userProfile.name} 
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                    />
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800 text-xs block leading-none">{userProfile.name}</span>
                        <div className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center shrink-0" title="Verificado">
                          <Check className="w-2 text-white stroke-[4px]" />
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">@{userProfile.username}</span>
                    </div>
                  </div>

                  {/* Desktop close button */}
                  <button 
                    onClick={closeLightbox}
                    className="hidden md:flex text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-100 rounded-full transition duration-150 cursor-pointer"
                    title="Cerrar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Scrollable Comments Thread */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/20 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                  {activeInteraction.comments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                      <MessageSquare className="w-8 h-8 text-slate-300 stroke-[1.5] mb-2" />
                      <p className="text-[11px] font-bold text-slate-500">No hay comentarios en esta foto.</p>
                      <p className="text-[9.5px] text-slate-400">¡Sé el primero en redactar tu opinión!</p>
                    </div>
                  ) : (
                    activeInteraction.comments.map((comm) => (
                      <div key={comm.id} className="flex flex-col gap-1 text-xs text-left">
                        <div className="flex gap-2.5 items-start group/comm">
                          <img 
                            src={comm.authorAvatar} 
                            alt={comm.authorName} 
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover border border-slate-250/60 shrink-0 shadow-3xs"
                          />
                          <div className="flex-1 min-w-0 bg-slate-50/80 hover:bg-slate-50 border border-slate-100 p-2.5 rounded-2xl transition duration-150">
                            <div className="flex justify-between items-baseline mb-0.5">
                              <span className="font-bold text-slate-800 text-[11px] truncate">{comm.authorName}</span>
                              <span className="text-[8.5px] text-slate-400 font-mono shrink-0 ml-1">{comm.date}</span>
                            </div>
                            <p className="text-slate-600 text-[11px] leading-relaxed break-words font-medium">{comm.text}</p>
                          </div>
                        </div>

                        {/* Reply / Responder action link under comment bubble */}
                        <div className="pl-10.5 flex items-center gap-3 text-[10px] text-slate-500 font-bold select-none shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              if (replyingToCommentId === comm.id) {
                                setReplyingToCommentId(null);
                                setReplyInputText('');
                              } else {
                                setReplyingToCommentId(comm.id);
                                setReplyInputText('');
                              }
                            }}
                            className="hover:text-indigo-650 hover:underline transition cursor-pointer border-none bg-transparent font-bold flex items-center gap-1 text-left"
                          >
                            <MessageSquare className="w-2.5 h-2.5" />
                            <span>Responder</span>
                          </button>
                        </div>

                        {/* Render Replies list under comment if any */}
                        {comm.replies && comm.replies.length > 0 && (
                          <div className="pl-10.5 space-y-2.5 mt-1 border-l border-slate-100/80">
                            {comm.replies.map((reply) => (
                              <div key={reply.id} className="flex gap-2.5 text-[11px] items-start">
                                <img 
                                  src={reply.authorAvatar} 
                                  alt={reply.authorName} 
                                  referrerPolicy="no-referrer"
                                  className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-250/40" 
                                />
                                <div className="bg-slate-50/70 p-2 rounded-xl flex-1 min-w-0">
                                  <div className="flex justify-between items-baseline">
                                    <span className="font-bold text-slate-800 text-[10.5px]">{reply.authorName}</span>
                                    <span className="text-[8px] text-slate-400 font-mono">{reply.date}</span>
                                  </div>
                                  <p className="text-slate-600 font-medium leading-normal break-words">{reply.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply Input Box */}
                        {replyingToCommentId === comm.id && (
                          <div className="pl-10.5 mt-1.5 flex gap-2 items-center">
                            <img 
                              src={(realLoggedInUser || userProfile).avatar} 
                              alt={(realLoggedInUser || userProfile).name} 
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-full object-cover border shrink-0" 
                            />
                            <div className="flex-1 flex gap-1 items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 relative">
                              <input 
                                type="text"
                                value={replyInputText}
                                onChange={(e) => setReplyInputText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSendReply(comm.id, selectedPhotoForLightbox, true);
                                  }
                                }}
                                placeholder="Escribe una respuesta..."
                                className="w-full bg-transparent text-[11px] focus:outline-none font-sans text-slate-800"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (activeEmojiPicker?.type === 'reply' && activeEmojiPicker?.id === comm.id) {
                                    setActiveEmojiPicker(null);
                                  } else {
                                    setActiveEmojiPicker({ type: 'reply', id: comm.id });
                                  }
                                }}
                                onMouseEnter={() => handleEmojiPickerMouseEnter('reply', comm.id)}
                                onMouseLeave={handleEmojiPickerMouseLeave}
                                className="text-slate-400 hover:text-slate-600 transition p-0.5 text-xs select-none cursor-pointer"
                              >
                                😊
                              </button>
                              {activeEmojiPicker?.type === 'reply' && activeEmojiPicker?.id === comm.id && (
                                <div 
                                  className="absolute bottom-full right-0 mb-2 bg-white border border-slate-200 shadow-xl rounded-xl p-2.5 z-[260] w-60"
                                  onClick={(e) => e.stopPropagation()}
                                  onMouseEnter={() => handleEmojiPickerMouseEnter('reply', comm.id)}
                                  onMouseLeave={handleEmojiPickerMouseLeave}
                                >
                                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-2 font-sans text-left">
                                    Reacciones Rápidas
                                  </div>
                                  <div className="grid grid-cols-6 gap-1.5">
                                    {POPULAR_EMOJIS.map((emoji) => (
                                      <button
                                        key={emoji}
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setReplyInputText(prev => prev + emoji);
                                        }}
                                        className="text-lg hover:scale-125 hover:bg-slate-50 rounded p-1 transition-transform cursor-pointer flex items-center justify-center"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSendReply(comm.id, selectedPhotoForLightbox, true)}
                              className="px-3 py-1 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black cursor-pointer border-none transition shrink-0 uppercase"
                            >
                              Enviar
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Interactive Actions bar with dynamic gifts modal support */}
                <div className="px-4 py-2.5 border-t border-slate-150 bg-white flex items-center justify-between text-xs shrink-0 relative overflow-visible">
                  <div 
                    className="relative flex items-center"
                    id="gifts-hover-target-lightbox"
                  >
                    <button 
                      onClick={(e) => handleLikePhoto(selectedPhotoForLightbox, e)}
                      onMouseEnter={() => {
                        if (selectedPhotoForLightbox) {
                          handleStickersMouseEnter(selectedPhotoForLightbox);
                        }
                      }}
                      onMouseLeave={() => {
                        if (selectedPhotoForLightbox) {
                          handleStickersMouseLeave();
                        }
                      }}
                      className={`py-1.5 px-3 rounded-lg flex items-center gap-1.5 font-bold transition cursor-pointer hover:bg-slate-50 ${
                        hasLiked ? 'text-rose-600 bg-rose-50/30' : 'text-slate-700 hover:text-rose-600'
                      }`}
                      title={hasLiked ? "Quitar Me gusta" : "Dar Me gusta"}
                    >
                      <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current text-rose-500 animate-pulse' : 'text-slate-400'}`} />
                      <span>{activeInteraction.likeCount} Me gusta</span>
                    </button>

                    {/* Simple bouncing Gift icon as indicator */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedPhotoForLightbox) {
                          setActiveGiftingPhotoUrl(selectedPhotoForLightbox);
                        }
                      }}
                      onMouseEnter={() => {
                        if (selectedPhotoForLightbox) {
                          handleGiftMouseEnter(selectedPhotoForLightbox);
                        }
                      }}
                      onMouseLeave={() => {
                        if (selectedPhotoForLightbox) {
                          handleGiftMouseLeave();
                        }
                      }}
                      className="text-pink-500 hover:text-rose-600 transition cursor-pointer flex items-center justify-center p-1.5 rounded-full animate-bounce shrink-0" 
                      style={{ animationDuration: '3.5s' }} 
                      title="Ver Regalos Extra"
                    >
                      <Gift className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      if (selectedPhotoForLightbox) {
                        handleToggleRepost(selectedPhotoForLightbox);
                      }
                    }}
                    className={`py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 font-bold transition cursor-pointer ${
                      selectedPhotoForLightbox && repostedPhotos[selectedPhotoForLightbox]
                        ? 'text-pink-600 bg-rose-50/25 hover:bg-rose-100/40'
                        : 'text-slate-650 hover:text-indigo-600 hover:bg-indigo-50/50'
                    }`}
                    title="Compartir en mi muro"
                  >
                    <Share2 className={`w-3.5 h-3.5 ${selectedPhotoForLightbox && repostedPhotos[selectedPhotoForLightbox] ? 'text-pink-500 fill-current' : ''}`} />
                    <span>{selectedPhotoForLightbox && repostedPhotos[selectedPhotoForLightbox] ? 'Compartido' : 'Compartir'}</span>
                  </button>
                </div>

                {/* Add Comment Input */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-150 flex items-center gap-2 shrink-0">
                  <img 
                    src={(realLoggedInUser || userProfile).avatar} 
                    alt={(realLoggedInUser || userProfile).name} 
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 flex gap-1 items-center shadow-2xs focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all relative">
                    <input
                      type="text"
                      placeholder="Escribe un comentario..."
                      value={lightboxCommentText}
                      onChange={(e) => setLightboxCommentText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddPhotoComment(selectedPhotoForLightbox); }}
                      className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 font-medium"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeEmojiPicker?.type === 'photo' && activeEmojiPicker?.id === selectedPhotoForLightbox) {
                          setActiveEmojiPicker(null);
                        } else {
                          setActiveEmojiPicker({ type: 'photo', id: selectedPhotoForLightbox });
                        }
                      }}
                      onMouseEnter={() => handleEmojiPickerMouseEnter('photo', selectedPhotoForLightbox)}
                      onMouseLeave={handleEmojiPickerMouseLeave}
                      className="text-slate-400 hover:text-slate-600 transition p-0.5 text-xs select-none cursor-pointer"
                    >
                      😊
                    </button>
                    {activeEmojiPicker?.type === 'photo' && activeEmojiPicker?.id === selectedPhotoForLightbox && (
                      <div 
                        className="absolute bottom-full right-0 mb-2 bg-white border border-slate-200 shadow-xl rounded-xl p-2.5 z-[260] w-60"
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={() => handleEmojiPickerMouseEnter('photo', selectedPhotoForLightbox)}
                        onMouseLeave={handleEmojiPickerMouseLeave}
                      >
                        <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-2 font-sans text-left">
                          Reacciones Rápidas
                        </div>
                        <div className="grid grid-cols-6 gap-1.5">
                          {POPULAR_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLightboxCommentText(prev => prev + emoji);
                              }}
                              className="text-lg hover:scale-125 hover:bg-slate-50 rounded p-1 transition-transform cursor-pointer flex items-center justify-center"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <button 
                      onClick={() => handleAddPhotoComment(selectedPhotoForLightbox)}
                      className="text-indigo-600 hover:text-indigo-700 disabled:opacity-30 disabled:pointer-events-none p-0.5 cursor-pointer"
                      disabled={!lightboxCommentText.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* 👥 PÁGINA COMPLETA DE SEGUIDORES / SEGUIDOS / AMIGOS */}
      {activeSocialModal && (
        <div className="fixed inset-0 bg-[#FDFBF7] z-[120] flex flex-col text-slate-900 animate-fade-in overflow-hidden">
          {/* Header Bar */}
          <div className="bg-white border-b border-slate-150 px-4 py-4 sm:px-6 flex items-center justify-between shadow-xs shrink-0">
            <button
              onClick={() => handleSetSocialModal(null)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-50 border border-slate-200 rounded-xl transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Volver al Perfil</span>
            </button>
            
            <div className="text-center">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Página Social de Cuenta</span>
              <h3 className="text-sm sm:text-base font-black text-slate-950 font-display flex items-center gap-1.5 justify-center">
                {activeSocialModal === 'friends' ? 'Mis Amigos Recíprocos' :
                 activeSocialModal === 'followers' ? 'Mis Seguidores' : 
                 'Mis Perfiles Seguidos'}
              </h3>
            </div>

            <div className="w-24 hidden sm:block text-right">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Usuario</span>
              <span className="text-xs font-bold text-slate-850 truncate block max-w-[100px]">{userProfile.name}</span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto bg-slate-50/50">
            <div className="max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-6">
              {/* Cover Info Box */}
              <div className="bg-white p-6 rounded-2xl border border-slate-150/80 shadow-3xs flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left justify-between">
                <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shrink-0 ${
                    activeSocialModal === 'friends' ? 'bg-pink-50 border-pink-100 text-pink-600' :
                    activeSocialModal === 'followers' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 
                    'bg-emerald-50 border-emerald-100 text-emerald-600'
                  }`}>
                    {activeSocialModal === 'friends' ? <UserPlus className="w-7 h-7" /> :
                     activeSocialModal === 'followers' ? <Users className="w-7 h-7" /> : 
                     <UserCheck className="w-7 h-7" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 leading-tight">
                      {activeSocialModal === 'friends' ? 'Mis Amigos (Círculo Íntimo)' :
                       activeSocialModal === 'followers' ? 'Seguidores de mi Canal' : 
                       'Perfiles del ecosistema que sigo'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Gestiona tu círculo social, inicia conversaciones premium o apoya a tus colegas de Fashion Finances de forma directa.
                    </p>
                  </div>
                </div>
              </div>

              {/* Search input inside full page */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Buscar por nombre, usuario o rol de ${
                    activeSocialModal === 'friends' ? 'amigo' :
                    activeSocialModal === 'followers' ? 'seguidor' : 
                    'seguido'
                  }...`}
                  className="w-full bg-white border border-slate-200 shadow-3xs rounded-2xl px-5 py-3.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-500 text-slate-800 placeholder-slate-400 font-medium transition"
                  onChange={(e) => {
                    const val = e.target.value.toLowerCase();
                    const els = document.querySelectorAll('.social-item-row');
                    els.forEach((el: any) => {
                      const txt = el.innerText.toLowerCase();
                      if (txt.includes(val)) {
                        el.style.display = 'flex';
                      } else {
                        el.style.display = 'none';
                      }
                    });
                  }}
                />
              </div>

              {/* Friends/Followers Rows Container */}
              <div className="bg-white rounded-2xl border border-slate-150 shadow-sm divide-y divide-slate-100 overflow-hidden">
                {(() => {
                  const otherModels = models.filter(m => m.id !== userProfile.id);
                  const mockFriendsList = [
                    { id: 'topf-1', name: 'Adriana Lima', username: 'adrianalima_w1', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', bio: 'Model and best friend. High fashion enthusiast.' },
                    { id: 'topf-3', name: 'Candice Swanepoel', username: 'candiceswanepoel_w3', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', bio: 'Promotora oficial de marcas sustentables y nuevos talentos colectivos' },
                    ...otherModels.slice(1, 6).map((m) => ({
                      id: m.id,
                      name: m.name,
                      username: m.username,
                      avatar: m.avatar,
                      bio: m.bio || 'Colega de modelaje y amiga de Casting Live'
                    }))
                  ];

                  const mockFollowersList = [
                    { id: 'user-investor', name: 'Ernesto vs', username: 'ernestovs', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200', bio: 'Fintech enthusiast, angel investor in green luxury fashion' },
                    { id: 'topf-3', name: 'Sophia Loren', username: 'sophialoren_w3', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', bio: 'Promotora oficial de marcas sustentables y nuevos talentos colectivos' },
                    { id: 'usr-3', name: 'Carmen de la Cruz', username: 'carmen_moda', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', bio: 'Amante de la costura prêt-à-porter y la financiación ética' },
                    ...otherModels.slice(0, 5).map((m) => ({
                      id: m.id,
                      name: m.name,
                      username: m.username,
                      avatar: m.avatar,
                      bio: m.bio || 'Modelo profesional y sponsor financiero'
                    }))
                  ];

                  const mockFollowingList = [
                    ...otherModels.slice(0, 8).map(m => ({
                      id: m.id,
                      name: m.name,
                      username: m.username,
                      avatar: m.avatar,
                      bio: m.bio || 'Explorando nuevas pasarelas en la alta costura'
                    })),
                    { id: 'topf-3', name: 'Sophia Loren', username: 'sophialoren_w3', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', bio: 'Promotora oficial de marcas sustentables y nuevos talentos colectivos' }
                  ];

                  const rawList = 
                    activeSocialModal === 'friends' ? mockFriendsList :
                    activeSocialModal === 'followers' ? mockFollowersList : 
                    mockFollowingList;

                  const seenIds = new Set<string>();
                  const currentList = rawList.filter(item => {
                    if (seenIds.has(item.id)) return false;
                    seenIds.add(item.id);
                    return true;
                  });

                  const getModelStatus = (item: any) => {
                    const modelRef = models.find(m => m.id === item.id || m.username === item.username);
                    if (modelRef) {
                      return {
                        isOnline: !!modelRef.isOnline,
                        isCastingLive: !!modelRef.isCastingLive
                      };
                    }
                    // Intelligent fallback to match the screenshots & show live/online states elegantly
                    const isOnline = item.id === 'topf-1' || item.id === 'user-investor' || item.username?.includes('w1') || item.username?.includes('w4');
                    const isCastingLive = item.id === 'topf-3' || item.username?.includes('w3') || item.username?.includes('m2');
                    return { isOnline, isCastingLive };
                  };

                  if (currentList.length === 0) {
                    return (
                      <div className="p-12 text-center text-slate-400 font-medium">
                        No hay perfiles en esta lista todavía.
                      </div>
                    );
                  }

                  return currentList.map(item => {
                    const { isOnline, isCastingLive } = getModelStatus(item);
                    return (
                      <div key={item.id} className="social-item-row flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-slate-50/50 transition text-left">
                        <div className="flex items-center gap-4 min-w-0">
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-slate-150 shrink-0 bg-slate-50"
                          />
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate leading-tight">{item.name}</h4>
                              
                              {/* Online / Casting Live indicators replacing mock roles */}
                              {isCastingLive ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-rose-500 text-white animate-pulse tracking-wide shadow-3xs shrink-0">
                                  <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                                  🎥 Casting Live
                                </span>
                              ) : isOnline ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-600 border border-emerald-150 tracking-wide shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  Online
                                </span>
                              ) : null}
                            </div>
                            <p className="text-[11px] text-slate-400 font-semibold font-mono">@{item.username}</p>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-snug line-clamp-2 pr-4">{item.bio}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              const isModel = models.some(m => m.id === item.id);
                              if (isModel && onLaunchChat) {
                                onLaunchChat(item.id);
                              } else if (onSendMessage) {
                                onSendMessage({
                                  id: `msg-${Date.now()}`,
                                  senderId: userProfile.id,
                                  receiverId: item.id,
                                  text: `¡Hola, ${item.name}! Vi tu perfil en mis conexiones social.`,
                                  timestamp: new Date().toISOString()
                                });
                                if (onNavigateToTab) onNavigateToTab('chat');
                              } else {
                                alert(`Iniciaste contacto con @${item.username}. Un asesor agilizará el chat pronto.`);
                              }
                              // Do not close the modal here, so that when they click "Volver" the modal remains open!
                            }}
                            className="flex-1 sm:flex-none px-4 py-2 border border-pink-100 text-[#fe2c55] bg-pink-50/10 hover:bg-[#fe2c55]/5 rounded-xl text-xs font-bold transition duration-150 cursor-pointer"
                          >
                            Mensaje
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const isModel = models.some(m => m.id === item.id);
                              if (isModel && onGoToModelProfile) {
                                onGoToModelProfile(item.id);
                              } else {
                                alert(`El perfil de inversor de @${item.username} es privado por políticas de confidencialidad de fondos.`);
                              }
                              handleSetSocialModal(null);
                            }}
                            className="flex-1 sm:flex-none px-4 py-2 bg-slate-900 hover:bg-[#fe2c55] text-white rounded-xl text-xs font-extrabold transition duration-150 cursor-pointer text-center"
                          >
                            Ver perfil
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⚙️ AJUSTES Y PRIVACIDAD DIALOG MODAL (yz.png) */}
      {showSettingsDrawer && (
        <div className="fixed inset-0 z-[110] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fade-in text-slate-800">
          <div className="bg-white rounded-[24px] border border-slate-100 w-full max-w-4xl h-[85vh] sm:h-[75vh] shadow-2xl flex flex-col overflow-hidden relative">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-150 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Edit className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-black font-display text-slate-950 leading-tight">Ajustes y Privacidad</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Configura tu perfil @{userProfile.username}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSettingsDrawer(false)}
                className="text-slate-400 hover:text-slate-700 font-bold hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition text-sm cursor-pointer"
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Main content body (Splits in left menu and right detail content) */}
            <div className="flex-1 flex overflow-hidden divide-x divide-slate-150">
              
              {/* LEFT SIDEBAR: vertical list of items from yz.png */}
              <div className="w-[42%] sm:w-[35%] bg-slate-50/30 overflow-y-auto p-3 text-left space-y-4">
                
                {/* Section header */}
                <div className="space-y-1">
                  <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-2">
                    Cómo usas la aplicación
                  </span>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => setActiveSettingsTab('profile')}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                        activeSettingsTab === 'profile'
                          ? 'bg-indigo-50 text-indigo-700 shadow-3xs border-l-2 border-indigo-600 pl-3'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                      }`}
                    >
                      <Camera className="w-4 h-4 text-indigo-550 shrink-0" />
                      <span className="truncate">Editar perfil</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSettingsTab('notifications')}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                        activeSettingsTab === 'notifications'
                          ? 'bg-indigo-50 text-indigo-700 shadow-3xs border-l-2 border-indigo-600 pl-3'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                      }`}
                    >
                      <Bell className="w-4 h-4 text-amber-550 shrink-0" />
                      <span className="truncate">Notificaciones</span>
                    </button>
                  </div>
                </div>

                {/* Section 2: yz.png "Quién puede ver tu contenido" */}
                <div className="space-y-1">
                  <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-2 block">
                    Quién puede ver tu contenido
                  </span>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => setActiveSettingsTab('privacy')}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                        activeSettingsTab === 'privacy'
                          ? 'bg-indigo-50 text-indigo-700 shadow-3xs border-l-2 border-indigo-600 pl-3'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                      }`}
                    >
                      <Lock className="w-4 h-4 text-teal-650 shrink-0" />
                      <span className="truncate">Privacidad de la cuenta</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSettingsTab('friends')}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                        activeSettingsTab === 'friends'
                          ? 'bg-indigo-50 text-indigo-700 shadow-3xs border-l-2 border-indigo-600 pl-3'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                      }`}
                    >
                      <Star className="w-4 h-4 text-yellow-550 shrink-0" />
                      <span className="truncate">Mejores amigos</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSettingsTab('blocked')}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                        activeSettingsTab === 'blocked'
                          ? 'bg-indigo-50 text-indigo-700 shadow-3xs border-l-2 border-indigo-600 pl-3'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                      }`}
                    >
                      <Ban className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="truncate">Cuentas bloqueadas</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSettingsTab('history')}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                        activeSettingsTab === 'history'
                          ? 'bg-indigo-50 text-indigo-700 shadow-3xs border-l-2 border-indigo-600 pl-3'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                      }`}
                    >
                      <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                      <span className="truncate">Historia y ubicación</span>
                    </button>
                  </div>
                </div>

                {/* Section 3: yz.png "Cómo pueden interactuar contigo..." */}
                <div className="space-y-1">
                  <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase px-2 block">
                    Cómo pueden interactuar contigo
                  </span>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => setActiveSettingsTab('messages')}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                        activeSettingsTab === 'messages'
                          ? 'bg-indigo-50 text-indigo-700 shadow-3xs border-l-2 border-indigo-600 pl-3'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                      }`}
                    >
                      <Send className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="truncate">Mensajes e historias</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSettingsTab('tags')}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                        activeSettingsTab === 'tags'
                          ? 'bg-indigo-50 text-indigo-700 shadow-3xs border-l-2 border-indigo-600 pl-3'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                      }`}
                    >
                      <Type className="w-4 h-4 text-purple-650 shrink-0" />
                      <span className="truncate">Etiquetas y menciones</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSettingsTab('comments')}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                        activeSettingsTab === 'comments'
                          ? 'bg-indigo-50 text-indigo-700 shadow-3xs border-l-2 border-indigo-600 pl-3'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="truncate">Comentarios</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSettingsTab('sharing')}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                        activeSettingsTab === 'sharing'
                          ? 'bg-indigo-50 text-indigo-700 shadow-3xs border-l-2 border-indigo-600 pl-3'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                      }`}
                    >
                      <Share2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">Compartiendo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSettingsTab('restricted')}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                        activeSettingsTab === 'restricted'
                          ? 'bg-indigo-50 text-indigo-700 shadow-3xs border-l-2 border-indigo-600 pl-3'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4 text-orange-550 shrink-0" />
                      <span className="truncate">Cuentas restringidas</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveSettingsTab('filters')}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all cursor-pointer ${
                        activeSettingsTab === 'filters'
                          ? 'bg-indigo-50 text-indigo-700 shadow-3xs border-l-2 border-indigo-600 pl-3'
                          : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-800'
                      }`}
                    >
                      <EyeOff className="w-4 h-4 text-pink-650 shrink-0" />
                      <span className="truncate">Palabras filtradas</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* RIGHT DETAIL CONTENT VIEW */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-7 text-left space-y-6">
                
                {activeSettingsTab === 'profile' && (
                  <div className="space-y-4 animate-fade-in text-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-black text-slate-850">Editarperfil</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Actualiza tus detalles públicos y de contacto.</p>
                    </div>

                    <div className="space-y-3">
                      {/* Imagen de Perfil con Uploader */}
                      <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl mb-4">
                        <div className="relative group shrink-0">
                          <img
                            src={editingAvatar || undefined}
                            alt="Avatar de Edición"
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md bg-slate-200"
                          />
                          <label className="absolute inset-0 bg-black/40 hover:bg-black/50 rounded-full flex items-center justify-center text-white text-[9px] font-bold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>Cambiar</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const compressed = await compressAndResizeImage(file);
                                    setEditingAvatar(compressed);
                                  } catch (err) {
                                    console.error('Error compressing avatar:', err);
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                        <div className="space-y-1">
                          <span className="block text-xs font-bold text-slate-800">Foto de Perfil</span>
                          <span className="block text-[9px] text-slate-400 leading-tight">Sube una foto JPG, PNG o GIF. El tamaño se ajustará automáticamente.</span>
                          
                          <label className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-lg text-[10px] font-bold border border-slate-200 cursor-pointer shadow-3xs transition active:scale-95 mt-1 select-none">
                            <Upload className="w-3 h-3 text-indigo-500" />
                            <span>Seleccionar archivo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  try {
                                    const compressed = await compressAndResizeImage(file);
                                    setEditingAvatar(compressed);
                                  } catch (err) {
                                    console.error('Error compressing avatar:', err);
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">Nombre Completo:</label>
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 font-medium text-slate-850"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">Nombre de Usuario (Slug):</label>
                        <div className="relative">
                          <span className="absolute left-4 top-2 text-slate-400 font-mono">@</span>
                          <input
                            type="text"
                            value={editingUsername}
                            onChange={(e) => setEditingUsername(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 font-mono text-indigo-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">Firma de moda / Agencia:</label>
                        <input
                          type="text"
                          value={editingFashionAgency}
                          onChange={(e) => setEditingFashionAgency(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 font-medium text-slate-850"
                          placeholder="Por ejemplo: Ford Models, Victoria's Secret, Elite, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">Biografía del Perfil:</label>
                        <textarea
                          rows={4}
                          value={editingBio}
                          onChange={(e) => setEditingBio(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 font-medium text-slate-800 leading-relaxed"
                          placeholder="Escribe tu biografía comercial para patrocinadores..."
                        />
                      </div>

                      {/* 🎥 SUBIR VÍDEO PARA EL RANKING DE LA LANDING PAGE */}
                      <div className="border-t border-slate-100 pt-5 mt-5 space-y-4">
                        <div className="flex items-center gap-2 text-rose-600">
                          <Sparkles className="w-4 h-4 text-rose-500 animate-pulse shrink-0" />
                          <span className="text-[11px] font-black uppercase tracking-wider font-mono">Vídeo de competencia en el Ranking de la Landing Page</span>
                        </div>
                        
                        <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-4 flex gap-4 items-start text-left shadow-2xs">
                          <span className="text-xl select-none leading-none shrink-0">📸</span>
                          <div className="space-y-1">
                            <h5 className="text-[10px] font-black uppercase tracking-wider text-rose-800 flex items-center gap-2 font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                              RECORDATORIO IMPRESCINDIBLE PARA EL MODELO
                            </h5>
                            <p className="text-[10.5px] leading-relaxed text-slate-650 font-medium">
                              Esta sección está diseñada <strong className="text-rose-700 uppercase font-black">exclusivamente</strong> para que subas tu vídeo de competencia al Ranking de la Landing Page. Es un requisito obligatorio elegir o subir un vídeo grabado en <strong className="text-slate-900 border-b-2 border-rose-300 pb-0.5 font-bold">PRIMERÍSIMO PRIMER PLANO</strong> (zoom extremo facial a tu rostro o mirada destacable). Los vídeos que no cumplan con esta directriz no se calificarán para recibir patrocinio de los inversores.
                            </p>
                          </div>
                        </div>

                        {/* Combined Grid of Presets and Custom Uploaded Videos */}
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">1. Seleccionar Vídeo para el Ranking</label>
                          <div className="grid grid-cols-2 gap-2 font-sans">
                            {userRankingVideos.map((preset, pIdx) => {
                              const isSelected = rankingFormVideoUrl === preset.url;
                              
                              return (
                                <div key={pIdx} className="relative group">
                                  <button
                                    type="button"
                                    onClick={() => setRankingFormVideoUrl(preset.url)}
                                    className={`w-full p-2.5 cursor-pointer border rounded-xl text-left transition-all duration-200 flex flex-col justify-center ${
                                      isSelected 
                                        ? 'border-rose-500 bg-rose-50/30 text-rose-900 shadow-xs shadow-rose-100/50 font-bold ring-1 ring-rose-500/30' 
                                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50/50'
                                    }`}
                                  >
                                    <p className="text-xs font-extrabold uppercase truncate pr-5">{preset.label}</p>
                                    <span className="text-[9px] text-slate-400 font-medium mt-0.5">
                                      Vídeo Guardado
                                    </span>
                                  </button>
                                  
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const updated = userRankingVideos.filter(v => v.url !== preset.url);
                                      setUserRankingVideos(updated);
                                      if (rankingFormVideoUrl === preset.url) {
                                        setRankingFormVideoUrl(updated[0]?.url || '');
                                      }
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 flex items-center justify-center transition-all cursor-pointer z-20 border border-rose-200 shadow-2xs"
                                    title="Eliminar este vídeo permanentemente"
                                  >
                                    <span className="text-[9px] font-black leading-none">✕</span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Interactive Premium Video Player */}
                        {rankingFormVideoUrl && (
                          <div className="p-1.5 bg-slate-950 rounded-2xl border border-slate-800 shadow-lg overflow-hidden relative">
                            <span className="absolute top-3 left-3 bg-rose-600 text-[8px] text-white font-mono font-black uppercase px-2 py-0.5 rounded z-10">
                              REPRODUCTOR DEMO
                            </span>
                            <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
                              <video
                                key={rankingFormVideoUrl}
                                src={rankingFormVideoUrl || undefined}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover rounded-md object-center scale-[1.25] transition-transform duration-700"
                              />
                            </div>
                          </div>
                        )}

                        {/* Interactive upload panel / direct links */}
                        <div className="p-4 bg-slate-50 border border-slate-200/85 rounded-2xl space-y-3">
                          <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1 font-mono">
                            <span>➕</span> Vincular Enlace o Subir Archivo
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Pegar enlace de vídeo vertical (.mp4)"
                              className="flex-1 bg-white border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none transition-all placeholder:text-slate-400"
                              value={newCustomVideoUrl}
                              onChange={(e) => setNewCustomVideoUrl(e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Alias"
                              className="w-20 bg-white border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 rounded-xl px-2 py-2 text-xs font-bold focus:outline-none text-center"
                              value={newCustomVideoLabel}
                              onChange={(e) => setNewCustomVideoLabel(e.target.value)}
                            />
                          </div>

                          <div className="flex gap-2">
                            <label className="flex-1 cursor-pointer bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-black py-2 rounded-xl text-center uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-3xs">
                              <span>📁 Subir local</span>
                              <input
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const objectUrl = URL.createObjectURL(file);
                                    setNewCustomVideoUrl(objectUrl);
                                    setNewCustomVideoLabel(file.name.substring(0, 10));
                                    setRankingFormConfirmCloseup(true);
                                    alert(`📹 Vídeo "${file.name}" cargado localmente con éxito.`);
                                  }
                                }}
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => {
                                if (!newCustomVideoUrl.trim()) {
                                  alert("Por favor ingresa una URL de vídeo o sube un archivo.");
                                  return;
                                }
                                const label = newCustomVideoLabel.trim() || `Vídeo ${userRankingVideos.length + 1}`;
                                if (userRankingVideos.some(v => v.url === newCustomVideoUrl)) {
                                  alert("Este vídeo ya está en tu colección.");
                                  return;
                                }
                                const updated = [...userRankingVideos, { label, url: newCustomVideoUrl, isCustom: true }];
                                setUserRankingVideos(updated);
                                setRankingFormVideoUrl(newCustomVideoUrl);
                                setNewCustomVideoUrl('');
                                setNewCustomVideoLabel('');
                              }}
                              className="flex-1 bg-slate-900 hover:bg-slate-950 text-white text-[11px] font-black py-2 rounded-xl text-center uppercase tracking-wider transition cursor-pointer"
                            >
                              Guardar en Colección
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Hashtags o Descripción del Vídeo</label>
                          <input
                            type="text"
                            value={rankingFormDescription}
                            onChange={(e) => setRankingFormDescription(e.target.value)}
                            placeholder="Añade hashtags como #Gucci #Estrella..."
                            className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none placeholder:text-slate-400"
                          />
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (!rankingFormVideoUrl) {
                                alert("Por favor selecciona un vídeo o introduce una URL.");
                                return;
                              }
                              // Parse rankings data to perform updates
                              const cachedRankingsRaw = localStorage.getItem('coll_top_100_ranking');
                              let rankingsData: any = null;
                              if (cachedRankingsRaw) {
                                try {
                                  rankingsData = JSON.parse(cachedRankingsRaw);
                                } catch (err) {}
                              }
                              if (!rankingsData) {
                                rankingsData = { females: [], males: [] };
                              }
                              
                              const userId = userProfile?.id || 'admin';
                              const matchedModelInProps = models?.find(m => m.id === userId || (m.username && m.username.toLowerCase() === userProfile?.username?.toLowerCase()));
                              
                              let userGender = 'female';
                              if (currentModel && (currentModel as any).gender) {
                                userGender = (currentModel as any).gender;
                              } else if (matchedModelInProps && (matchedModelInProps as any).gender) {
                                userGender = (matchedModelInProps as any).gender;
                              } else if ((userProfile as any)?.gender) {
                                userGender = (userProfile as any).gender;
                              } else if (userId.startsWith('topm-')) {
                                userGender = 'male';
                              } else {
                                const nameLower = (userProfile?.name || '').toLowerCase();
                                const usernameLower = (userProfile?.username || '').toLowerCase();
                                if (
                                  nameLower.includes('carlos') || 
                                  nameLower.includes('lucas') || 
                                  nameLower.includes('marcus') || 
                                  nameLower.includes('alexander') || 
                                  nameLower.includes('nicholas') || 
                                  nameLower.includes('julian') || 
                                  nameLower.includes('male') ||
                                  usernameLower.includes('_m') ||
                                  usernameLower.includes('male')
                                ) {
                                  userGender = 'male';
                                }
                              }
                              
                              const targetKey = userGender === 'female' ? 'females' : 'males';
                              const otherKey = userGender === 'female' ? 'males' : 'females';
                              
                              if (!rankingsData[targetKey]) {
                                rankingsData[targetKey] = [];
                              }
                              if (rankingsData[otherKey]) {
                                rankingsData[otherKey] = rankingsData[otherKey].filter((m: any) => m.id !== userId && m.username !== userProfile?.username);
                              }
                              
                              let updatedModelId = userId;
                              let updatedModelName = userProfile?.name || 'Mi Perfil de Modelo';
                              
                              const foundIdx = rankingsData[targetKey].findIndex((m: any) => m.id === userId || m.username === userProfile?.username);
                              if (foundIdx !== -1) {
                                const existingModel = rankingsData[targetKey][foundIdx];
                                const updatedModel = {
                                  ...existingModel,
                                  videoUrl: rankingFormVideoUrl,
                                  gender: userGender,
                                  isOnline: true,
                                  bio: rankingFormDescription.trim() || existingModel.bio || `Estrella de Fashion Finances.`
                                };
                                // Move to the very front of the ranking array so this model becomes the #1 spotlight card
                                rankingsData[targetKey].splice(foundIdx, 1);
                                rankingsData[targetKey].unshift(updatedModel);
                                updatedModelName = updatedModel.name;
                                updatedModelId = updatedModel.id;
                              } else {
                                const freshModel = {
                                  id: userId,
                                  name: userProfile?.name || 'Mi Perfil de Modelo',
                                  username: userProfile?.username || 'mi_usuario',
                                  avatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
                                  bio: rankingFormDescription.trim() || `Estrella del ranking de ${userGender === 'female' ? 'Mujeres' : 'Hombres'} de Fashion Finances.`,
                                  totalLikes: 14500 + Math.floor(Math.random() * 500),
                                  followersCount: 1200 + Math.floor(Math.random() * 300),
                                  referidosCount: 5,
                                  photos: [
                                    userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
                                  ],
                                  socials: {
                                    instagram: '@' + (userProfile?.username || 'modelo'),
                                    tiktok: '@' + (userProfile?.username || 'modelo') + '_tok'
                                  },
                                  gender: userGender,
                                  isOnline: true,
                                  videoUrl: rankingFormVideoUrl
                                };
                                rankingsData[targetKey].unshift(freshModel);
                              }
                              
                              localStorage.setItem('coll_top_100_ranking', JSON.stringify(rankingsData));
                              
                              const rawModels = localStorage.getItem('coll_models');
                              if (rawModels) {
                                try {
                                  const decodedModels = JSON.parse(rawModels);
                                  let wasUpdated = false;
                                  const updatedDecoded = decodedModels.map((m: any) => {
                                    if (m.id === userId || m.username === userProfile?.username) {
                                      wasUpdated = true;
                                      return { ...m, videoUrl: rankingFormVideoUrl, gender: userGender };
                                    }
                                    return m;
                                  });
                                  if (!wasUpdated) {
                                    updatedDecoded.push({
                                      id: userId,
                                      name: updatedModelName,
                                      username: userProfile?.username || 'mi_usuario',
                                      avatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
                                      bio: rankingFormDescription.trim() || `Estrella del ranking de ${userGender === 'female' ? 'Mujeres' : 'Hombres'} de Fashion Finances.`,
                                      gender: userGender,
                                      videoUrl: rankingFormVideoUrl,
                                      totalLikes: 14500,
                                      followersCount: 1200,
                                      referidosCount: 5,
                                      socials: {
                                        instagram: '@' + (userProfile?.username || 'modelo'),
                                        tiktok: '@' + (userProfile?.username || 'modelo') + '_tok'
                                      }
                                    });
                                  }
                                  localStorage.setItem('coll_models', JSON.stringify(updatedDecoded));
                                  if (onUpdateModels) {
                                    onUpdateModels(updatedDecoded);
                                  }
                                } catch (err) {}
                              }
                              
                              // Sync to coverVideoSlots
                              const nextSlots = [...coverVideoSlots];
                              let targetIdx = nextSlots.findIndex(s => !s.url);
                              if (targetIdx === -1) {
                                targetIdx = nextSlots.findIndex(s => s.url.includes('mixkit-'));
                              }
                              if (targetIdx === -1) {
                                targetIdx = 0;
                              }
                              nextSlots[targetIdx] = {
                                ...nextSlots[targetIdx],
                                name: "Vídeo del Ranking",
                                url: rankingFormVideoUrl,
                                filename: 'ranking_video.mp4'
                              };
                              setCoverVideoSlots(nextSlots);
                              localStorage.setItem(`cover_video_slots_${userId}`, JSON.stringify(nextSlots.map(s => ({
                                id: s.id,
                                name: s.name,
                                url: s.url.startsWith('blob:') ? '' : s.url,
                                filename: s.filename
                              }))));
                              localStorage.setItem('landing_page_cover_video_url', rankingFormVideoUrl);
                              
                              window.dispatchEvent(new Event('ranking_videos_updated'));
                              alert(`🎬 ¡Vídeo publicado con éxito en el Ranking! Saldrá automáticamente en la Landing Page con tu perfil de modelo.`);
                            }}
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-sm border-0 cursor-pointer text-center"
                          >
                            🚀 Publicar en el Ranking de la Landing Page
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowSettingsDrawer(false)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-650 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setBioText(editingBio);
                          setFashionAgency(editingFashionAgency);
                          if (currentModel) {
                            const updatedModels = models.map(m => {
                              if (m.id === currentModel.id) {
                                return {
                                  ...m,
                                  name: editingName,
                                  username: editingUsername,
                                  bio: editingBio,
                                  avatar: editingAvatar,
                                  fashionAgency: editingFashionAgency
                                };
                              }
                              return m;
                            });
                            onUpdateModels(updatedModels);
                          }
                          // Also write directly back into parent profile state
                          userProfile.name = editingName;
                          userProfile.username = editingUsername;
                          userProfile.bio = editingBio;
                          userProfile.avatar = editingAvatar;
                          userProfile.fashionAgency = editingFashionAgency;

                          const nextProfile = {
                            ...userProfile,
                            name: editingName,
                            username: editingUsername,
                            bio: editingBio,
                            avatar: editingAvatar,
                            fashionAgency: editingFashionAgency
                          };
                          onUpdateProfile(nextProfile);

                          alert('✅ ¡Tus cambios en el perfil han sido guardados con éxito en la base de datos!');
                          setShowSettingsDrawer(false);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition shadow-3xs"
                      >
                        Guardar cambios
                      </button>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'notifications' && (
                  <div className="space-y-4 animate-fade-in text-xs text-slate-700">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-black text-slate-850">Filtros de Notificaciones</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Controla las alertas generadas por tu actividad.</p>
                    </div>

                    <div className="divide-y divide-slate-100">
                      <div className="py-3 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-800 block">Notificaciones push activas</span>
                          <span className="text-[10px] text-slate-400">Recibe notificaciones inmediatas al vender boletas.</span>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
                      </div>

                      <div className="py-3 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-800 block">Correos electrónicos de patrocinios</span>
                          <span className="text-[10px] text-slate-400">Recibe una notificación cuando se libere el pago de una sesión.</span>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
                      </div>

                      <div className="py-3 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-800 block">Mensajes internos instantáneos</span>
                          <span className="text-[10px] text-slate-400">Alertas de nuevos comentarios y debates en tus fotos públicas.</span>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <button 
                        onClick={() => {
                          alert('🔔 ¡Preferencia de Notificaciones guardada!');
                          setShowSettingsDrawer(false);
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold cursor-pointer hover:bg-indigo-700 transition"
                      >
                        Confirmar Ajustes
                      </button>
                    </div>

                  </div>
                )}

                {activeSettingsTab === 'privacy' && (
                  <div className="space-y-4 animate-fade-in text-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-black text-slate-850">Privacidad de la cuenta</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Decide quién puede ver tu portafolio de modelaje.</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex items-center justify-between">
                      <div className="text-left space-y-1">
                        <span className="font-bold text-slate-800 block">Cuenta Privada de Sponsor</span>
                        <p className="text-[10px] text-slate-500 leading-relaxed max-w-md">
                          Cuando tu cuenta es privada, sólo las personas que apruebes puedan ver tus fotos, reservas históricas y portafolio final.
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          setIsAccountPrivate(!isAccountPrivate);
                          alert(`🔒 Cuenta configurada como ${!isAccountPrivate ? 'PRIVADA' : 'PÚBLICA'}`);
                        }}
                        className={`px-4 py-2 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                          isAccountPrivate ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {isAccountPrivate ? 'Establecida Privada' : 'Establecida Pública'}
                      </button>
                    </div>

                    <div className="py-2 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Privacidad adicional:</span>
                      <div className="flex justify-between items-center text-xs py-1.5">
                        <span className="text-slate-700 font-semibold">Ocultar mi edad y ubicación en busquedas</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
                      </div>
                      <div className="flex justify-between items-center text-xs py-1.5">
                        <span className="text-slate-700 font-semibold">Sólo permitir ofertas comerciales verificadas</span>
                        <input type="checkbox" className="w-4 h-4 accent-indigo-600" />
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'friends' && (
                  <div className="space-y-4 animate-fade-in text-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-black text-slate-850">Mejores amigos de Patrocinio</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Contactos VIP que reciben ofertas y fotos exclusivas.</p>
                    </div>
                    <p className="text-slate-500 leading-relaxed">
                      Elige a tus patrocinadores principales para agregarlos a tu lista de mejores amigos. Ellos verán una estrella verde junto a tu nombre y tendrán prioridad en reservas.
                    </p>
                    <div className="space-y-2">
                      {models.slice(0, 4).map((m) => (
                        <div key={m.id} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-150">
                          <div className="flex items-center gap-2">
                            <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                            <div className="text-left">
                              <span className="font-bold text-slate-805 block leading-tight">{m.name}</span>
                              <span className="text-[9px] font-mono text-slate-400">@{m.username}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => alert(`⭐ ${m.name} agregado a tus Consejeros VIP`)}
                            className="text-[10px] px-2.5 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold rounded-lg border border-yellow-200"
                          >
                            Agregar VIP
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'blocked' && (
                  <div className="space-y-5 animate-fade-in text-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-black text-slate-850">Cuentas Bloqueadas</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Perfiles restringidos que no podrán acceder a tus reservas, enviarte mensajes directos ni dejar comentarios en tu muro.</p>
                    </div>

                    {/* Buscador de cuentas para bloquear (Buscador "ze.png") */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Buscar usuarios para bloquear:</label>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
                        <input
                          type="text"
                          placeholder="Escribe el nombre o @usuario para bloquear..."
                          value={blockedSearchQuery}
                          onChange={(e) => setBlockedSearchQuery(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-red-500 font-medium text-slate-800"
                        />
                      </div>

                      {/* Resultados de búsqueda */}
                      {blockedSearchQuery.trim() !== '' && (() => {
                        const filtered = models.filter(m => 
                          m.id !== userProfile.id &&
                          !blockedUserIds.includes(m.id) &&
                          (m.name.toLowerCase().includes(blockedSearchQuery.toLowerCase()) ||
                           m.username.toLowerCase().includes(blockedSearchQuery.toLowerCase()))
                        ).slice(0, 5);

                        return (
                          <div className="bg-white border border-slate-150 rounded-xl divide-y divide-slate-100 overflow-hidden shadow-2xs max-h-60 overflow-y-auto">
                            <div className="bg-slate-50/70 px-3 py-1.5 text-[9px] uppercase font-bold text-slate-400">
                              Resultados de la búsqueda ({filtered.length})
                            </div>
                            {filtered.length === 0 ? (
                              <div className="p-3 text-center text-slate-400 italic">
                                No se encontraron cuentas que coincidan.
                              </div>
                            ) : (
                              filtered.map(m => (
                                <div key={m.id} className="flex justify-between items-center p-2.5 hover:bg-slate-50/50 transition">
                                  <div className="flex items-center gap-2">
                                    <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                                    <div className="text-left">
                                      <span className="font-bold text-slate-800 block leading-none mb-0.5">{m.name}</span>
                                      <span className="text-[9px] font-mono text-slate-400">@{m.username}</span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      handleBlockUser(m.id);
                                      setBlockedSearchQuery('');
                                      alert(`🚫 Has bloqueado a ${m.name}. Ya no tiene acceso a tus contenidos.`);
                                    }}
                                    className="text-[10px] px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-150 flex items-center gap-1 transition"
                                  >
                                    <Ban className="w-3 h-3" />
                                    <span>Bloquear</span>
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Lista de Cuentas Bloqueadas */}
                    <div className="space-y-2">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase">Cuentas que has bloqueado:</span>
                      {blockedUserIds.length === 0 ? (
                        <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-150 text-slate-400 italic select-none">
                          No has bloqueado a ningún patrocinador ni modelo hasta la fecha.
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {blockedUserIds.map(id => {
                            const m = models.find(item => item.id === id);
                            if (!m) return null;
                            return (
                              <div key={id} className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-150 transition">
                                <div className="flex items-center gap-2">
                                  <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                                  <div className="text-left">
                                    <span className="font-bold text-slate-800 block leading-tight">{m.name}</span>
                                    <span className="text-[9px] font-mono text-slate-400">@{m.username}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    handleUnblockUser(id);
                                    alert(`✅ Has desbloqueado a ${m.name}. Ahora puede volver a interactuar con tu perfil.`);
                                  }}
                                  className="text-[10px] px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg border border-slate-300 transition"
                                >
                                  Desbloquear
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Opciones familiares de otras plataformas (Seguridad Avanzada) */}
                    <div className="border-t border-slate-100 pt-3.5 space-y-3">
                      <h5 className="text-xs font-bold text-slate-850 flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-slate-500">
                        <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Seguridad y Privacidad Avanzada</span>
                      </h5>

                      <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl space-y-3">
                        {/* Control de Comentarios */}
                        <div className="flex flex-col gap-1 text-left">
                          <label className="font-bold text-slate-800 text-xs">Permitir Comentarios de:</label>
                          <select 
                            className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
                            defaultValue="all"
                            onChange={(e) => alert(`💬 Control de comentarios establecido a: ${e.target.value === 'all' ? 'Todos' : e.target.value === 'sponsors' ? 'Solo Patrocinadores VIP' : 'Nadie'}`)}
                          >
                            <option value="all">Cualquier usuario de la plataforma (Todos)</option>
                            <option value="sponsors">Únicamente patrocinadores registrados</option>
                            <option value="none">Desactivar comentarios por completo</option>
                          </select>
                        </div>

                        {/* Filtro Automático de Spam */}
                        <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/60">
                          <div>
                            <span className="font-bold text-slate-800 block">Filtro automático de spam / ofensas</span>
                            <span className="text-[10px] text-slate-400">Oculta automáticamente comentarios duplicados o con palabras no deseadas.</span>
                          </div>
                          <input 
                            type="checkbox" 
                            defaultChecked 
                            onChange={(e) => alert(`⚙️ Filtro automático de spam ${e.target.checked ? 'ACTIVADO' : 'DESACTIVADO'}`)}
                            className="w-4 h-4 accent-indigo-600 cursor-pointer" 
                          />
                        </div>

                        {/* Modo Sigilo */}
                        <div className="flex justify-between items-center pt-1.5 border-t border-slate-200/60">
                          <div>
                            <span className="font-bold text-slate-800 block">Modo Sigilo (Incógnito)</span>
                            <span className="text-[10px] text-slate-400">No mostrar mi estado "En línea" ni el punto verde en la plataforma.</span>
                          </div>
                          <input 
                            type="checkbox" 
                            onChange={(e) => alert(`⚙️ Modo Sigilo ${e.target.checked ? 'ACTIVADO (Ya no mostrarás indicador activo)' : 'DESACTIVADO'}`)}
                            className="w-4 h-4 accent-indigo-600 cursor-pointer" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'history' && (
                  <div className="space-y-4 animate-fade-in text-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-black text-slate-850">Historia y Ubicación</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Políticas de caducidad de historias temporales de modelaje.</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <span className="font-bold text-slate-800 block">Guardar historias en el archivo histórico</span>
                          <span className="text-[10px] text-slate-400">Guarda automáticamente las historias para que no se pierdan tras las 24 horas.</span>
                        </div>
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <div>
                          <span className="font-bold text-slate-800 block">Compartir tu ubicación de desfile en directo</span>
                          <span className="text-[10px] text-slate-400">Permite a los patrocinadores ver si estás en la ciudad del showroom.</span>
                        </div>
                        <input type="checkbox" className="w-4 h-4 accent-indigo-600" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Simulated fallback view for other tabs and integrations */}
                {!['profile', 'notifications', 'privacy', 'friends', 'blocked', 'history'].includes(activeSettingsTab) && (
                  <div className="space-y-4 animate-fade-in text-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-black text-slate-850 uppercase">Configuración de {activeSettingsTab}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Controla cómo interactúas con los demás en el portal.</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                      <Sparkles className="w-8 h-8 text-indigo-500 mx-auto animate-pulse" />
                      <p className="font-bold text-slate-700">Ajuste de {activeSettingsTab} habilitado</p>
                      <p className="text-slate-500 max-w-sm mx-auto text-[11px]">
                        Esta opción de interacción cumple con la captura <strong>yz.png</strong> y está pre-configurada de forma segura para evitar spammers.
                      </p>
                      <button 
                        onClick={() => alert(`⚙️ Configuración ${activeSettingsTab} aplicada de forma corporativa.`)}
                        className="mt-2 text-[10px] font-bold px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer"
                      >
                        Validar Estado Activo
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

      {renderGiftsModal()}

      {/* 🌧️ STICKER RAIN EFFECT OVERLAY */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes rainFallAnimation {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.6);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(115vh) rotate(420deg) scale(1.1);
            opacity: 0;
          }
        }
        .animate-sticker-rain {
          animation-name: rainFallAnimation;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      ` }} />

      {screenRainParticles.length > 0 && (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden select-none">
          {screenRainParticles.map((pt) => (
            <div
              key={pt.id}
              className="absolute font-sans select-none animate-sticker-rain"
              style={{
                left: `${pt.left}%`,
                top: `${pt.top}vh`,
                fontSize: `${pt.size}px`,
                animationDuration: `${pt.duration}s`,
                animationDelay: `${pt.delay}s`,
              }}
            >
              {pt.emoji}
            </div>
          ))}
        </div>
      )}

      {selectedStoryForPreview && (
        <ModelStoryLightbox
          selectedStoryForPreview={selectedStoryForPreview}
          setSelectedStoryForPreview={setSelectedStoryForPreview}
          profileActiveStories={profileActiveStories}
          highlights={highlights}
          archivedStories={archivedStories}
          profileStorySubIndex={profileStorySubIndex}
          setProfileStorySubIndex={setProfileStorySubIndex}
          profileStoryMuted={profileStoryMuted}
          setProfileStoryMuted={setProfileStoryMuted}
          floatingParticles={floatingParticles}
          setFloatingParticles={setFloatingParticles}
          userProfile={userProfile}
          liveUserCoins={liveUserCoins}
          setLiveUserCoins={setLiveUserCoins}
          onGoToModelProfile={onGoToModelProfile}
          models={models}
          realLoggedInUser={realLoggedInUser}
        />
      )}
    </div>
  );
}


interface ModelStoryLightboxProps {
  selectedStoryForPreview: any;
  setSelectedStoryForPreview: (s: any) => void;
  profileActiveStories: any[];
  highlights: any[];
  archivedStories?: any[];
  profileStorySubIndex: number;
  setProfileStorySubIndex: React.Dispatch<React.SetStateAction<number>>;
  profileStoryMuted: boolean;
  setProfileStoryMuted: (m: boolean) => void;
  floatingParticles: any[];
  setFloatingParticles: React.Dispatch<React.SetStateAction<any[]>>;
  userProfile: any;
  liveUserCoins: number;
  setLiveUserCoins: React.Dispatch<React.SetStateAction<number>>;
  onGoToModelProfile?: (modelId: string, modelObj?: any) => void;
  models: any[];
  realLoggedInUser?: any;
}

function ModelStoryLightbox({
  selectedStoryForPreview,
  setSelectedStoryForPreview,
  profileActiveStories,
  highlights,
  archivedStories = [],
  profileStorySubIndex,
  setProfileStorySubIndex,
  setProfileStoryMuted,
  profileStoryMuted,
  floatingParticles,
  setFloatingParticles,
  userProfile,
  liveUserCoins,
  setLiveUserCoins,
  onGoToModelProfile,
  models,
  realLoggedInUser
}: ModelStoryLightboxProps) {

  // Check if user is Online
  const isOnlineUser = (username: string) => {
    const onlineUsernames = [
      'valentinarossi_w1', 'isabelladubois_w2', 'sophialoren_w3', 'miakincaid_w4'
    ];
    return onlineUsernames.some(u => username && username.toLowerCase().includes(u.toLowerCase())) || username === userProfile?.username;
  };

  // Construct master combined list of profile stories/highlights
  const combinedList: any[] = [];
  
  if (profileActiveStories && profileActiveStories.length > 0) {
    profileActiveStories.forEach((s: any, idx: number) => {
      combinedList.push({
        id: s.id,
        title: s.title || 'mi historia',
        image: s.image,
        isVideo: s.isVideo || false,
        username: userProfile.username,
        name: userProfile.name,
        avatar: userProfile.avatar,
        isOwnProfileActive: true,
        time: `${idx + 2}h`
      });
    });
  }
  
  const mappedHighlights = highlights.map((hi) => {
    const username = hi.title.toLowerCase().replace(/\s+/g, '');
    
    // Give them mock times/or special indicators like in ZW.PNG or imagen.PNG
    let time = '12h';
    if (username.includes('ann')) time = '13h';
    if (username.includes('yascherie')) time = '15h';
    if (username.includes('harley')) time = 'Publicidad';
    if (username.includes('emma')) time = '1h';
    if (username.includes('alnahyan')) time = '1h';
    if (username.includes('lovelehee')) time = '4h';
    if (username.includes('marii')) time = '6h';
    if (username.includes('salamakss')) time = '8h';
    if (username.includes('plievazz')) time = '9h';
    if (username.includes('laviniader')) time = '11h';
    if (username.includes('milano')) time = '18h';

    return {
      id: hi.id,
      title: hi.title,
      image: hi.image,
      isVideo: hi.isVideo || false,
      username: username,
      name: hi.title,
      avatar: hi.image || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150',
      isHighlight: true,
      time: time
    };
  });
  combinedList.push(...mappedHighlights);

  const mappedArchived = (archivedStories || []).map((s: any) => ({
    id: s.id,
    title: s.title || 'Historia archivada',
    image: s.image,
    isVideo: s.isVideo || false,
    username: userProfile.username,
    name: userProfile.name,
    avatar: userProfile.avatar,
    isArchivedStory: true,
    time: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'Archivo'
  }));
  combinedList.push(...mappedArchived);

  const isOwnActiveViewing = profileActiveStories.some((as: any) => as.id === selectedStoryForPreview.id);
  const isArchivedViewing = (archivedStories || []).some((as: any) => as.id === selectedStoryForPreview.id);
  const pubStories = isOwnActiveViewing 
    ? profileActiveStories 
    : isArchivedViewing 
      ? archivedStories 
      : [selectedStoryForPreview];
  const safeSubIndex = Math.min(Math.max(0, profileStorySubIndex), pubStories.length - 1);
  const currentActiveSubStory = pubStories[safeSubIndex];

  // Custom timer for story progression
  React.useEffect(() => {
    const duration = 6000; // 6 seconds per story
    const timer = setTimeout(() => {
      if (safeSubIndex < pubStories.length - 1) {
        setProfileStorySubIndex(prev => prev + 1);
      } else {
        handleNextItem();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [selectedStoryForPreview, safeSubIndex, pubStories.length]);

  const handleNextItem = () => {
    const currentIdx = combinedList.findIndex(s => s.id === selectedStoryForPreview.id);
    if (isOwnActiveViewing) {
      if (mappedHighlights.length > 0) {
        setSelectedStoryForPreview(mappedHighlights[0]);
        setProfileStorySubIndex(0);
      } else {
        setSelectedStoryForPreview(null);
      }
    } else if (isArchivedViewing) {
      if (profileStorySubIndex < archivedStories.length - 1) {
        setProfileStorySubIndex(prev => prev + 1);
      } else {
        setSelectedStoryForPreview(null);
      }
    } else {
      if (currentIdx !== -1 && currentIdx < combinedList.length - 1) {
        setSelectedStoryForPreview(combinedList[currentIdx + 1]);
        setProfileStorySubIndex(0);
      } else {
        setSelectedStoryForPreview(null);
      }
    }
  };

  const handlePrevItem = () => {
    if (isOwnActiveViewing) {
      if (safeSubIndex > 0) {
        setProfileStorySubIndex(safeSubIndex - 1);
      }
    } else if (isArchivedViewing) {
      if (profileStorySubIndex > 0) {
        setProfileStorySubIndex(prev => prev - 1);
      }
    } else {
      const currentIdx = combinedList.findIndex(s => s.id === selectedStoryForPreview.id);
      if (currentIdx > 0) {
        const prevItem = combinedList[currentIdx - 1];
        if (prevItem.isOwnProfileActive) {
          setSelectedStoryForPreview(prevItem);
          setProfileStorySubIndex(profileActiveStories.length - 1);
        } else {
          setSelectedStoryForPreview(prevItem);
          setProfileStorySubIndex(0);
        }
      }
    }
  };

  const currentIdx = combinedList.findIndex(s => s.id === selectedStoryForPreview.id);

  React.useEffect(() => {
    if (floatingParticles.length > 0) {
      const timer = setTimeout(() => {
        setFloatingParticles(p => p.filter(item => Date.now() - parseFloat(item.id.split('-')[1]) < 3000));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [floatingParticles]);

  function spawnEmojiParticles(emoji: string) {
    const newParticles = Array.from({ length: 24 }).map((_, i) => ({
      id: `part-${Date.now()}-${i}-${Math.random()}`,
      emoji: emoji,
      left: 10 + Math.random() * 80,
      bottom: 12 + Math.random() * 10,
      size: 20 + Math.random() * 24,
      delay: Math.random() * 0.4,
      duration: 1.5 + Math.random() * 1.5
    }));
    setFloatingParticles(prev => [...prev, ...newParticles]);
  }

  const [showGiftsPopup, setShowGiftsPopup] = React.useState(false);
  const giftsHoverTimeoutRef = React.useRef<any>(null);

  const handleGiftsMouseEnter = () => {
    if (giftsHoverTimeoutRef.current) {
      clearTimeout(giftsHoverTimeoutRef.current);
      giftsHoverTimeoutRef.current = null;
    }
    setShowGiftsPopup(true);
  };

  const handleGiftsMouseLeave = () => {
    if (giftsHoverTimeoutRef.current) {
      clearTimeout(giftsHoverTimeoutRef.current);
    }
    giftsHoverTimeoutRef.current = setTimeout(() => {
      setShowGiftsPopup(false);
    }, 1500);
  };

  const EXTRA_GIFTS_STORY = [
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
    { name: 'Collar de oro 18k', icon: '⛓️', cost: 1800 },
    { name: 'Un viaje', icon: '✈️', cost: 5000 },
    { name: 'Un coche', icon: '🚗', cost: 50000 },
    { name: 'Una casa', icon: '🏡', cost: 100000 },
    { name: 'Una copa', icon: '🍷', cost: 5 },
    { name: 'Anillo diamantes', icon: '💍', cost: 3500 },
    { name: 'Gafas de moda', icon: '🕶️', cost: 400 },
    { name: 'Vestido de moda', icon: '👗', cost: 100 },
    { name: 'Un avión', icon: '🛩️', cost: 1000000 },
    { name: 'Dos Alas de ángel', icon: '🪽', cost: 2 },
    { name: 'Ala de ángel VS', icon: '🪽', cost: 1 },
    { name: 'Collar de oro', icon: '🎗️', cost: 100 },
    { name: 'Collar de perlas', icon: '📿', cost: 80 },
    { name: 'Vestido de gala', icon: '💃', cost: 3000 },
    { name: 'Zapatos costura', icon: '👠', cost: 800 },
    { name: 'Ramo de rosas', icon: '💐', cost: 20 },
    { name: 'Bolígrafo de oro', icon: '✒️', cost: 10 },
    { name: 'Reloj', icon: '⏰', cost: 100000 },
    { name: 'Una moneda de oro', icon: '🪙', cost: 2 },
    { name: 'Varias monedas de oro', icon: '💰', cost: 5 },
    { name: 'Tesoro de monedas', icon: '🪙', cost: 10 },
    { name: 'Cena de lujo', icon: '🍽️', cost: 250 },
    { name: 'Manos juntas', icon: '🙏', cost: 1 },
    { name: 'Café', icon: '☕', cost: 2 }
  ];

  const handleStoryGiftClick = (gift: { name: string, icon: string, cost: number }) => {
    const euroCost = Number((gift.cost * 1.0).toFixed(2));
    const senderProfile = realLoggedInUser || userProfile;
    const portfolioBalance = senderProfile?.balance || 0;

    if (liveUserCoins < gift.cost) {
      spawnEmojiParticles(gift.icon);
      alert(`⚠️ No tienes saldo suficiente para comprar este regalo.\n\nEl regalo cuesta 🪙 ${gift.cost} monedas, pero tu saldo actual es de 🪙 ${liveUserCoins} monedas.`);
      return;
    }
    if (portfolioBalance < euroCost) {
      spawnEmojiParticles(gift.icon);
      alert(`⚠️ No tienes saldo suficiente en tu portafolio para comprar este regalo.\n\nCuesta ${euroCost.toFixed(2)}€, pero tu saldo es de ${portfolioBalance.toFixed(2)}€.`);
      return;
    }
    
    // Deduct coins
    const nextCoins = liveUserCoins - gift.cost;
    setLiveUserCoins(nextCoins);
    localStorage.setItem('casting_live_coins_qty', nextCoins.toString());

    // Trigger visual heart rain of the gift icon!
    spawnEmojiParticles(gift.icon);

    alert(`🎁 ¡Regalo "${gift.name}" ${gift.icon} enviado con éxito en la historia! -${gift.cost} monedas.`);
    setShowGiftsPopup(false);
  };

  const handleStoryUserRedirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    const targetUsername = currentActiveSubStory.username || userProfile.username;
    const targetUserId = currentActiveSubStory.userId || userProfile.id;
    let matched = models.find(m => 
      m.id === targetUserId || 
      (m.username && m.username.toLowerCase() === targetUsername?.toLowerCase())
    );

    if (!matched && targetUsername) {
      const lower = targetUsername.toLowerCase();
      let fallbackId = 'topf-2'; // Alessandra Ambrosio as default
      if (lower.includes('milano')) {
        fallbackId = 'topm-1'; // Alexander Vance
      } else if (lower.includes('laviniader')) {
        fallbackId = 'topf-6'; // Camila Barbosa
      } else if (lower.includes('editorial')) {
        fallbackId = 'topm-2'; // Marcus Sterling
      } else if (lower.includes('lovelehee')) {
        fallbackId = 'topf-2'; // Alessandra Ambrosio
      } else if (lower.includes('marii')) {
        fallbackId = 'topf-3'; // Candice Swanepoel
      } else if (lower.includes('ann')) {
        fallbackId = 'topf-4'; // Mia Kincaid
      } else if (lower.includes('salamakss')) {
        fallbackId = 'topf-5'; // Elena Rostova
      } else if (lower.includes('plievazz')) {
        fallbackId = 'topf-8'; // Freja Beha
      }
      matched = models.find(m => m.id === fallbackId);
    }

    if (matched && onGoToModelProfile) {
      onGoToModelProfile(matched.id);
      setSelectedStoryForPreview(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-white text-slate-900 select-none animate-fade-in font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flyUpAnimationProfile {
          0% {
            transform: translateY(0) scale(0.4) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
            transform: translateY(-20px) scale(1.2) rotate(-8deg);
          }
          40% {
            transform: translateY(-160px) scale(1.1) rotate(15deg);
          }
          100% {
            transform: translateY(-440px) scale(0.6) rotate(-20deg);
            opacity: 0;
          }
        }
        .animate-profile-progress {
          animation: profileProgBar 6s linear forwards;
        }
        @keyframes profileProgBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      ` }} />

      {/* Dynamic blurred background to match active story visual palette */}
      <div 
        className="absolute inset-0 bg-cover bg-center blur-3xl opacity-15 pointer-events-none" 
        style={{ backgroundImage: `url(${currentActiveSubStory?.image})` }}
      />
      <div className="absolute inset-0 bg-white/95 pointer-events-none" />

      {/* 1. DESKTOP VIEW LAYOUT (hidden md:flex) - Matching imagen.PNG exactly */}
      <div className="hidden md:flex flex-col items-center justify-center w-full h-full relative z-10 p-6">
        
        {/* Large clean close button at top right */}
        <button 
          onClick={() => setSelectedStoryForPreview(null)}
          className="absolute top-6 right-8 text-slate-600 hover:text-slate-950 transition duration-150 text-2xl font-light cursor-pointer z-50 p-1"
          title="Cerrar historias"
        >
          ✕
        </button>

        <div className="flex items-center justify-center gap-7 w-full max-w-6xl">
          
          {/* Preceding Story Previews (Left column) */}
          <div className="flex items-center gap-4 shrink-0 select-none">
            {/* Outermost Preceding card (Idx - 2) */}
            {currentIdx - 2 >= 0 ? (
              <div 
                onClick={() => {
                  setSelectedStoryForPreview(combinedList[currentIdx - 2]);
                  setProfileStorySubIndex(0);
                }}
                className="w-[125px] h-[220px] rounded-2xl overflow-hidden relative opacity-25 hover:opacity-50 transition-all duration-300 cursor-pointer shadow-xl border border-slate-200 shrink-0"
              >
                <img src={combinedList[currentIdx - 2].image} alt="" className="absolute inset-0 w-full h-full object-cover blur-[2px]" />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2.5 text-center">
                  <div className="w-[50px] h-[50px] rounded-full p-[2px] bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 shadow-md">
                    <img src={combinedList[currentIdx - 2].avatar} alt="" className="w-full h-full rounded-full object-cover border-2 border-[#121214]" />
                  </div>
                  <span className="text-white text-[10.5px] font-bold truncate w-full mt-2.5 drop-shadow leading-tight">
                    {combinedList[currentIdx - 2].username}
                  </span>
                  <span className="text-white/60 text-[8.5px] mt-1 font-mono">{combinedList[currentIdx - 2].time}</span>
                </div>
              </div>
            ) : (
              <div className="w-[125px]" />
            )}

            {/* Closer Preceding card (Idx - 1) */}
            {currentIdx - 1 >= 0 ? (
              <div 
                onClick={() => {
                  setSelectedStoryForPreview(combinedList[currentIdx - 1]);
                  setProfileStorySubIndex(0);
                }}
                className="w-[145px] h-[255px] rounded-2xl overflow-hidden relative opacity-45 hover:opacity-80 transition-all duration-300 cursor-pointer shadow-2xl border border-slate-200 shrink-0"
              >
                <img src={combinedList[currentIdx - 1].image} alt="" className="absolute inset-0 w-full h-full object-cover blur-[1px]" />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-[58px] h-[58px] rounded-full p-[2px] bg-white shadow-md">
                    <img src={combinedList[currentIdx - 1].avatar} alt="" className="w-full h-full rounded-full object-cover border-2 border-[#121214]" />
                  </div>
                  <span className="text-white text-[11px] font-extrabold truncate w-full mt-3 drop-shadow leading-tight">
                    {combinedList[currentIdx - 1].username}
                  </span>
                  <span className="text-white/70 text-[9px] mt-1 font-mono">{combinedList[currentIdx - 1].time}</span>
                </div>
              </div>
            ) : (
              <div className="w-[145px]" />
            )}
          </div>

          {/* Left Arrow button */}
          {(isArchivedViewing ? profileStorySubIndex > 0 : currentIdx > 0) ? (
            <button 
              onClick={handlePrevItem}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all duration-150 shadow-md flex items-center justify-center shrink-0 cursor-pointer border border-slate-200 active:scale-90"
              title="Anterior"
            >
              <ChevronLeft className="w-5 h-5 stroke-[3px]" />
            </button>
          ) : (
            <div className="w-10 h-10" />
          )}

          {/* ACTIVE CENTER CARD */}
          <div className="relative w-[365px] h-[640px] bg-[#1a1a1c] rounded-[24px] overflow-hidden shadow-2xl flex flex-col border border-zinc-800 shrink-0 select-none">
            
            {/* Top progress indicator bar inside card */}
            <div className="absolute top-3 inset-x-3.5 z-30 flex gap-1 select-none">
              {pubStories.map((subSrc: any, idx: number) => {
                let fillStyle: React.CSSProperties = { width: '0%', backgroundColor: '#ffffff' };
                if (idx < safeSubIndex) {
                  fillStyle = { width: '100%', backgroundColor: '#ffffff' };
                }
                return (
                  <div key={subSrc.id || idx} className="h-[2px] flex-1 bg-white/30 rounded-full overflow-hidden relative">
                    {idx === safeSubIndex ? (
                      <div 
                        key={`animate-desktop-sub-${subSrc.id}-${safeSubIndex}`}
                        className="absolute inset-y-0 left-0 bg-white animate-profile-progress" 
                      />
                    ) : (
                      <div 
                        className="absolute inset-y-0 left-0 h-full" 
                        style={fillStyle}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Profile User header row inside card */}
            <div className="absolute top-5 inset-x-3 z-30 flex items-center justify-between select-none bg-gradient-to-b from-black/80 via-black/40 to-transparent p-3 rounded-2xl">
              <div 
                className="flex items-center gap-2.5 text-white cursor-pointer hover:opacity-90 group transition-all"
                onClick={handleStoryUserRedirect}
                title={`Ver perfil de ${currentActiveSubStory.username || userProfile.username}`}
              >
                <img 
                  src={currentActiveSubStory.avatar || userProfile.avatar} 
                  alt="" 
                  referrerPolicy="no-referrer"
                  className="w-8.5 h-8.5 rounded-full object-cover border border-white/20 shadow-md bg-slate-900 group-hover:border-white/45 transition-all"
                />
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="font-extrabold text-white text-[12px] drop-shadow-sm truncate max-w-[130px] group-hover:underline">
                      {currentActiveSubStory.username || userProfile.username}
                    </span>
                    <span className="text-white/60 text-[10px] font-sans font-medium">
                      {currentActiveSubStory.time || '10 h'}
                    </span>
                  </div>
                  {/* Charming song and Online status indicator */}
                  <div className="flex items-center gap-1 mt-0.5 text-white/85 text-[8.5px] font-bold tracking-tight">
                    {isOnlineUser(currentActiveSubStory.username || userProfile.username) ? (
                      <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded-xs bg-red-500/90 text-white font-extrabold text-[7.5px] tracking-wider uppercase leading-none scale-90">
                        🟢 EN DIRECTO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded-xs bg-zinc-700/90 text-white font-extrabold text-[7.5px] tracking-wider uppercase leading-none scale-90">
                        📸 HISTORIA
                      </span>
                    )}
                    <span className="text-rose-500 text-[9px] animate-pulse font-bold">♪</span>
                    <span className="truncate max-w-[90px]" title="Amr Diab • Gamila (feat. Jana Diab)">Amr Diab • Gamila</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Sound control */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileStoryMuted(!profileStoryMuted);
                  }}
                  className="text-white/90 hover:text-white p-1 hover:bg-white/10 rounded transition cursor-pointer"
                  title="Mute"
                >
                  {profileStoryMuted ? <VolumeX className="w-4 h-4 text-white/70" /> : <Volume2 className="w-4 h-4 text-white" />}
                </button>
                
                {/* Pause icon / Emoji reaction popup trigger */}
                <button 
                  type="button"
                  onMouseEnter={handleGiftsMouseEnter}
                  onMouseLeave={handleGiftsMouseLeave}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowGiftsPopup(!showGiftsPopup);
                  }}
                  className="text-white/90 hover:text-white p-1 hover:bg-white/10 rounded transition cursor-pointer"
                  title="Reacciones y Regalos Extra"
                >
                  <Play className="w-3.5 h-3.5 transform rotate-90" />
                </button>

                {/* More options menu */}
                <MoreHorizontal className="w-4.5 h-4.5 text-white/90 cursor-pointer hover:text-white" />
              </div>
            </div>

            {/* Inner frame containing portrait photo */}
            <div 
              className="flex-1 relative bg-neutral-950 flex items-center justify-center cursor-pointer border-0"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                if (clickX < rect.width * 0.35) {
                  if (safeSubIndex > 0) {
                    setProfileStorySubIndex(safeSubIndex - 1);
                  } else {
                    handlePrevItem();
                  }
                } else {
                  if (safeSubIndex < pubStories.length - 1) {
                    setProfileStorySubIndex(safeSubIndex + 1);
                  } else {
                    handleNextItem();
                  }
                }
              }}
            >
              {currentActiveSubStory.isVideo ? (
                <video 
                  src={currentActiveSubStory.image} 
                  className="w-full h-full object-cover"
                  autoPlay
                  muted={profileStoryMuted}
                  loop
                  playsInline
                />
              ) : (
                <img 
                  src={currentActiveSubStory.image} 
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-300"
                />
              )}
              
              {/* Subtle visual watermark under portrait image like @nada_alshiakh */}
              <span 
                onClick={handleStoryUserRedirect}
                className="absolute bottom-3 left-4 text-white/60 text-[10.5px] font-semibold tracking-wide drop-shadow cursor-pointer hover:text-white hover:underline transition-all z-40"
              >
                @{currentActiveSubStory.username || userProfile.username}
              </span>

              {/* Heart rain particles layer */}
              <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl">
                {floatingParticles.map((pt) => (
                  <div
                    key={pt.id}
                    className="absolute font-sans select-none"
                    style={{
                      left: `${pt.left}%`,
                      bottom: `${pt.bottom}%`,
                      fontSize: `${pt.size}px`,
                      animation: `flyUpAnimationProfile ${pt.duration}s ${pt.delay}s ease-out forwards`,
                    }}
                  >
                    {pt.emoji}
                  </div>
                ))}
              </div>

              {/* Extra Gifts Popover matching zx.png exactly, centered on the image */}
              {showGiftsPopup && (
                <div 
                  className="absolute inset-0 z-50 flex items-center justify-center bg-[#0f172a]/20 backdrop-blur-[2px] p-4 cursor-default animate-fade-in"
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={handleGiftsMouseEnter}
                  onMouseLeave={handleGiftsMouseLeave}
                >
                  <div 
                    className="w-[90%] max-w-[320px] bg-[#151821] border border-zinc-800 rounded-[24px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between text-left select-none relative"
                    style={{
                      maxHeight: '85%'
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/80 shrink-0">
                      <span className="text-yellow-400 font-extrabold text-[10.5px] tracking-wider uppercase flex items-center gap-1.5 select-none font-sans">
                        🎁 REGALOS EXTRA DEL CANAL
                      </span>
                      <span className="text-[10px] bg-zinc-800 text-yellow-350 font-black px-2 py-0.5 rounded font-mono">
                        🪙 {liveUserCoins}
                      </span>
                    </div>

                    {/* Grid of items (Top 9 as shown in zx.png) */}
                    <div className="grid grid-cols-3 gap-2 overflow-y-auto pr-1 scrollbar-thin grow h-0">
                      {EXTRA_GIFTS_STORY.map((gift, gIdx) => (
                        <button
                          key={gIdx}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleStoryGiftClick(gift);
                          }}
                          className="group/gift relative flex flex-col items-center justify-center bg-[#fff5f7] hover:bg-[#ffe4e8] border border-rose-250/60 hover:border-pink-400 p-2 rounded-xl transition duration-150 text-center cursor-pointer select-none shadow-[0_1px_2px_rgba(254,205,211,0.25)]"
                        >
                          <span className="text-2xl filter drop-shadow hover:scale-115 transition transform duration-150">
                            {gift.icon}
                          </span>
                          <span className="text-[8.5px] font-bold text-slate-800 mt-1 truncate w-full px-0.5 leading-tight select-none uppercase">
                            {gift.name}
                          </span>
                          <div className="flex items-center gap-0.5 mt-1 select-none shrink-0 leading-none">
                            <span className="text-[8px] font-extrabold text-amber-700 font-mono">
                              🪙 {gift.cost}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Footer */}
                    <div className="text-[8.5px] text-zinc-400 text-center mt-3 italic leading-tight select-none shrink-0 pt-2 border-t border-zinc-800/60">
                      Presiona para enviar instantáneamente · Tu saldo: 🪙 {liveUserCoins}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom reply & reaction bar inside card matching imagen.PNG */}
            <div className="p-3.5 pt-1 pb-4 flex items-center justify-between gap-3 shrink-0">
              <div className="flex-1 bg-transparent border border-white/20 rounded-full py-1.5 px-3.5 flex items-center">
                <input 
                  type="text" 
                  placeholder={`Responder a ${currentActiveSubStory.username || userProfile.username}...`}
                  className="bg-transparent text-white placeholder-white/50 text-[11.5px] focus:outline-none flex-1 border-none font-medium h-4 leading-none" 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const textInput = e.target as HTMLInputElement;
                      alert(`💬 Mensaje enviado con éxito: "${textInput.value}"`);
                      textInput.value = '';
                    }
                  }}
                />
              </div>

              <div className="flex items-center gap-2 select-none shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                      detail: { icon: '❤️' }
                    }));
                    spawnEmojiParticles('❤️');
                  }}
                  className="text-white hover:text-rose-500 active:scale-90 transition p-1 cursor-pointer bg-white/5 rounded-full hover:bg-white/10"
                  title="Reaccionar"
                >
                  <Heart className="w-4.5 h-4.5 fill-current text-white hover:text-rose-500" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    alert('💬 ¡Mensaje enviado con éxito!');
                  }}
                  className="text-white hover:text-indigo-400 active:scale-90 transition p-1 cursor-pointer bg-white/5 rounded-full hover:bg-white/10"
                  title="Compartir"
                >
                  <Send className="w-4 h-4 text-white transform rotate-45 -translate-y-0.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Arrow button */}
          {(isArchivedViewing ? profileStorySubIndex < (archivedStories?.length || 0) - 1 : currentIdx < combinedList.length - 1) ? (
            <button 
              onClick={handleNextItem}
              className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all duration-150 shadow-md flex items-center justify-center shrink-0 cursor-pointer border border-slate-200 active:scale-90"
              title="Siguiente"
            >
              <ChevronRight className="w-5 h-5 stroke-[3px]" />
            </button>
          ) : (
            <div className="w-10 h-10" />
          )}

          {/* Succeeding Story Previews (Right column) */}
          <div className="flex items-center gap-4 shrink-0 select-none">
            {/* Closer Succeeding card (Idx + 1) */}
            {currentIdx + 1 < combinedList.length ? (
              <div 
                onClick={() => {
                  setSelectedStoryForPreview(combinedList[currentIdx + 1]);
                  setProfileStorySubIndex(0);
                }}
                className="w-[145px] h-[255px] rounded-2xl overflow-hidden relative opacity-45 hover:opacity-80 transition-all duration-300 cursor-pointer shadow-2xl border border-slate-200 shrink-0"
              >
                <img src={combinedList[currentIdx + 1].image} alt="" className="absolute inset-0 w-full h-full object-cover blur-[1px]" />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                  <div className="w-[58px] h-[58px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#fe2c55] via-purple-500 to-amber-500 shadow-md">
                    <img src={combinedList[currentIdx + 1].avatar} alt="" className="w-full h-full rounded-full object-cover border-2 border-[#121214]" />
                  </div>
                  <span className="text-white text-[11px] font-extrabold truncate w-full mt-3 drop-shadow leading-tight">
                    {combinedList[currentIdx + 1].username}
                  </span>
                  <span className="text-white/70 text-[9px] mt-1 font-mono">{combinedList[currentIdx + 1].time}</span>
                </div>
              </div>
            ) : (
              <div className="w-[145px]" />
            )}

            {/* Outermost Succeeding card (Idx + 2) */}
            {currentIdx + 2 < combinedList.length ? (
              <div 
                onClick={() => {
                  setSelectedStoryForPreview(combinedList[currentIdx + 2]);
                  setProfileStorySubIndex(0);
                }}
                className="w-[125px] h-[220px] rounded-2xl overflow-hidden relative opacity-25 hover:opacity-50 transition-all duration-300 cursor-pointer shadow-xl border border-slate-200 shrink-0"
              >
                <img src={combinedList[currentIdx + 2].image} alt="" className="absolute inset-0 w-full h-full object-cover blur-[2px]" />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2.5 text-center">
                  <div className="w-[50px] h-[50px] rounded-full p-[2px] bg-gradient-to-tr from-[#fe2c55] via-purple-500 to-amber-500 shadow-md">
                    <img src={combinedList[currentIdx + 2].avatar} alt="" className="w-full h-full rounded-full object-cover border-2 border-[#121214]" />
                  </div>
                  <span className="text-white text-[10.5px] font-bold truncate w-full mt-2.5 drop-shadow leading-tight">
                    {combinedList[currentIdx + 2].username}
                  </span>
                  <span className="text-white/60 text-[8.5px] mt-1 font-mono">{combinedList[currentIdx + 2].time}</span>
                </div>
              </div>
            ) : (
              <div className="w-[125px]" />
            )}
          </div>

        </div>

      </div>

      {/* 2. MOBILE VIEW LAYOUT (flex md:hidden) - Matching iOS WhatsApp full screen style with elegant light mode */}
      <div className="flex md:hidden flex-col justify-between w-full h-full relative z-10 bg-white text-slate-900">
        
        {/* iOS status bar mockup */}
        <div className="h-9 px-4.5 pt-2 flex items-center justify-between text-slate-700 text-[11px] font-semibold select-none z-50">
          {/* Left iOS green call indicator pill */}
          <div className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black flex items-center justify-center tracking-tight leading-none shadow-sm font-mono">
            10:41
          </div>
          
          {/* Right state: signal, cellular type, and battery percent */}
          <div className="flex items-center gap-1.5 font-sans text-[10px] text-slate-700">
            {/* Cellular signal lines */}
            <div className="flex items-end gap-[1.5px] h-2.5">
              <span className="w-[1.5px] h-[3px] bg-slate-600 rounded-2xs" />
              <span className="w-[1.5px] h-[4.5px] bg-slate-600 rounded-2xs" />
              <span className="w-[1.5px] h-[6px] bg-slate-600 rounded-2xs" />
              <span className="w-[1.5px] h-[7.5px] bg-slate-600 rounded-2xs" />
              <span className="w-[1.5px] h-[9px] bg-slate-600 rounded-2xs" />
            </div>
            <span className="font-extrabold leading-none text-[9.5px]">5G</span>
            {/* Battery state indicator */}
            <div className="flex items-center gap-1 leading-none font-bold">
              <span>80%</span>
              <div className="w-5 h-2.5 border border-slate-400 rounded-2xs p-[1.2px] flex items-center">
                <div className="w-[80%] h-full bg-emerald-500 rounded-3xs" />
              </div>
            </div>
          </div>
        </div>

        {/* Stories progress segments */}
        <div className="px-3.5 mt-1 z-40 flex gap-1 select-none">
          {pubStories.map((subSrc: any, idx: number) => {
            let fillStyle: React.CSSProperties = { width: '0%', backgroundColor: '#0f172a' };
            if (idx < safeSubIndex) {
              fillStyle = { width: '100%', backgroundColor: '#0f172a' };
            }
            return (
              <div key={subSrc.id || idx} className="h-[2px] flex-1 bg-slate-200 rounded-full overflow-hidden relative">
                {idx === safeSubIndex ? (
                  <div 
                    key={`animate-mobile-sub-${subSrc.id}-${safeSubIndex}`}
                    className="absolute inset-y-0 left-0 bg-slate-900 animate-profile-progress" 
                  />
                ) : (
                  <div 
                    className="absolute inset-y-0 left-0 h-full" 
                    style={fillStyle}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Header line under segments */}
        <div className="px-4 mt-2.5 z-40 flex items-center justify-between select-none">
          <div 
            className="flex items-center gap-2.5 text-slate-850 cursor-pointer hover:opacity-80 active:opacity-70 transition-all group"
            onClick={handleStoryUserRedirect}
            title={`Ver perfil de ${currentActiveSubStory.username || userProfile.username}`}
          >
            <img 
              src={currentActiveSubStory.avatar || userProfile.avatar} 
              alt="" 
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-slate-100 group-hover:border-slate-400 transition-all"
            />
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-black text-slate-900 text-[12px] tracking-tight group-hover:underline">
                {currentActiveSubStory.username || userProfile.username}
              </span>
              {/* Verified Blue Star badge checkmark icon */}
              <span className="inline-flex items-center justify-center bg-sky-500 text-white rounded-full w-3.5 h-3.5 p-0.5 text-[8.5px] font-black leading-none shadow-xs">
                ✓
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-medium">
                • {currentActiveSubStory.time || '13h'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-700">
            {/* Play/emoji trigger icon for gifts on mobile */}
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowGiftsPopup(!showGiftsPopup);
              }}
              onMouseEnter={handleGiftsMouseEnter}
              onMouseLeave={handleGiftsMouseLeave}
              className="text-slate-600 hover:text-slate-900 p-1 cursor-pointer"
              title="Regalos Extra"
            >
              <Play className="w-4 h-4 transform rotate-90" />
            </button>

            {/* Options list ... */}
            <button className="text-slate-600 hover:text-slate-900 p-1">
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {/* Large close icon */}
            <button 
              onClick={() => setSelectedStoryForPreview(null)}
              className="text-slate-600 hover:text-slate-900 p-1.5 font-bold text-sm cursor-pointer"
              title="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Full screen main media frame */}
        <div 
          className="flex-1 w-full relative flex items-center justify-center cursor-pointer mt-2 bg-slate-50"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if (clickX < rect.width * 0.35) {
              if (safeSubIndex > 0) {
                setProfileStorySubIndex(safeSubIndex - 1);
              } else {
                handlePrevItem();
              }
            } else {
              if (safeSubIndex < pubStories.length - 1) {
                setProfileStorySubIndex(safeSubIndex + 1);
              } else {
                handleNextItem();
              }
            }
          }}
        >
          {currentActiveSubStory.isVideo ? (
            <video 
              src={currentActiveSubStory.image} 
              className="w-full h-full object-cover"
              autoPlay
              muted={profileStoryMuted}
              loop
              playsInline
            />
          ) : (
            <img 
              src={currentActiveSubStory.image} 
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          )}

          {/* Floating particle rain layer on mobile */}
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            {floatingParticles.map((pt) => (
              <div
                key={pt.id}
                className="absolute font-sans select-none"
                style={{
                  left: `${pt.left}%`,
                  bottom: `${pt.bottom}%`,
                  fontSize: `${pt.size}px`,
                  animation: `flyUpAnimationProfile ${pt.duration}s ${pt.delay}s ease-out forwards`,
                }}
              >
                {pt.emoji}
              </div>
            ))}
          </div>

          {/* Centered Extra Gifts Popover on mobile */}
          {showGiftsPopup && (
            <div 
              className="absolute inset-0 z-50 flex items-center justify-center bg-[#0f172a]/20 backdrop-blur-[2px] p-4 cursor-default animate-fade-in"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={handleGiftsMouseEnter}
              onMouseLeave={handleGiftsMouseLeave}
            >
              <div 
                className="w-[90%] max-w-[320px] bg-[#151821] border border-zinc-800 rounded-[24px] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between text-left select-none relative text-white"
                style={{
                  maxHeight: '85%'
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/80 shrink-0">
                  <span className="text-yellow-400 font-extrabold text-[10.5px] tracking-wider uppercase flex items-center gap-1.5 select-none font-sans">
                    🎁 REGALOS EXTRA DEL CANAL
                  </span>
                  <span className="text-[10px] bg-zinc-800 text-yellow-350 font-black px-2 py-0.5 rounded font-mono">
                    🪙 {liveUserCoins}
                  </span>
                </div>

                {/* Grid of items (Top 9 as shown in zx.png) */}
                <div className="grid grid-cols-3 gap-2 overflow-y-auto pr-1 scrollbar-thin grow h-0">
                  {EXTRA_GIFTS_STORY.map((gift, gIdx) => (
                    <button
                      key={gIdx}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleStoryGiftClick(gift);
                      }}
                      className="group/gift relative flex flex-col items-center justify-center bg-[#fff5f7] hover:bg-[#ffe4e8] border border-rose-250/60 hover:border-pink-400 p-2 rounded-xl transition duration-150 text-center cursor-pointer select-none shadow-[0_1px_2px_rgba(254,205,211,0.25)]"
                    >
                      <span className="text-2xl filter drop-shadow hover:scale-115 transition transform duration-150">
                        {gift.icon}
                      </span>
                      <span className="text-[8.5px] font-bold text-slate-800 mt-1 truncate w-full px-0.5 leading-tight select-none uppercase">
                        {gift.name}
                      </span>
                      <div className="flex items-center gap-0.5 mt-1 select-none shrink-0 leading-none">
                        <span className="text-[8px] font-extrabold text-amber-700 font-mono">
                          🪙 {gift.cost}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Footer */}
                <div className="text-[8.5px] text-zinc-400 text-center mt-3 italic leading-tight select-none shrink-0 pt-2 border-t border-zinc-800/60">
                  Presiona para enviar instantáneamente · Tu saldo: 🪙 {liveUserCoins}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile footer with heart/comment icons and home bar mockup */}
        <div className="px-4 pb-5 pt-2 flex flex-col gap-2.5 z-40 bg-white border-t border-slate-100">
          <div className="flex items-center justify-between gap-4">
            
            {/* Input responder box */}
            <div className="flex-1 bg-slate-100 border border-slate-200 rounded-full py-2 px-4 flex items-center">
              <input 
                type="text" 
                placeholder={`Responder a ${currentActiveSubStory.username || userProfile.username}...`}
                className="bg-transparent text-slate-800 placeholder-slate-400 text-[11.5px] focus:outline-none flex-1 border-none font-medium h-4 leading-none" 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const textInput = e.target as HTMLInputElement;
                    alert(`💬 Mensaje enviado con éxito: "${textInput.value}"`);
                    textInput.value = '';
                  }
                }}
              />
            </div>

            {/* Reaction icons: Heart and send/chat message */}
            <div className="flex items-center gap-3.5 shrink-0 select-none">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('trigger-heart-rain', {
                    detail: { icon: '❤️' }
                  }));
                  spawnEmojiParticles('❤️');
                }}
                className="text-slate-700 hover:text-rose-500 active:scale-90 transition p-1 cursor-pointer"
              >
                <Heart className="w-5.5 h-5.5 text-slate-700 hover:text-rose-500" />
              </button>

              <button
                type="button"
                onClick={() => {
                  alert('💬 ¡Mensaje enviado con éxito!');
                }}
                className="text-slate-700 hover:text-indigo-600 active:scale-90 transition p-1 cursor-pointer"
              >
                <Send className="w-5.5 h-5.5 text-slate-700 hover:text-indigo-600 transform rotate-45 -translate-y-0.5" />
              </button>
            </div>

          </div>

          {/* iOS home gesture line indicator pill */}
          <div className="w-28 h-[3.5px] bg-slate-300 mx-auto rounded-full mt-2" />
        </div>

      </div>

    </div>
  );
}
