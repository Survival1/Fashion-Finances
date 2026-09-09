/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ModelProfile {
  id: string;
  name: string;
  username: string;
  alias?: string; // Custom nickname / alias
  avatar: string;
  banner?: string; // Optional custom background banner image
  bio: string;
  totalLikes?: number;
  followersCount?: number;
  photos?: string[]; // URLs of photos uploaded by the model
  selectedWinnerPhotos?: string[]; // Custom photo selection for winner results (za.png)
  referidosCount?: number;
  role?: string;
  rating?: number;
  verified?: boolean;
  socials?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    instagramFollowers?: number;
    tiktokFollowers?: number;
  };
  isOnline?: boolean;
  isCastingLive?: boolean;
  videoUrl?: string;
  fashionAgency?: string; // e.g. "Ford Models", "Victoria's Secret"
  gender?: 'female' | 'male';
}

export type UserRole = 'model' | 'investor' | 'visitor';

export interface UserSessionProfile {
  id: string;
  name: string;
  lastName?: string; // Last name
  username: string;
  role: UserRole;
  patrocinadorId: string; // Every user must be sponsored by a model
  balance: number;
  totalEarnings: number;
  totalInvested: number;
  totalCommissions: number;
  avatar: string;
  banner?: string; // Optional custom background banner image
  bio?: string;
  fashionAgency?: string; // e.g. "Ford Models", "Victoria's Secret"
  direccion?: string;
  ciudad?: string;
  contrasena?: string;
  codigoPostal?: string;
  pais?: string;
  telefono?: string;
  email?: string;
  instagram?: string;
  tiktok?: string;
  shareDireccion?: boolean;
  shareTelefono?: boolean;
  shareEmail?: boolean;
  verified: boolean;
  bankInfoProvided: boolean;
  registeredAt: string;
  gender?: 'female' | 'male';
}

export interface ProjectTeamMember {
  name: string;
  role: string;
  experience: string;
  avatar?: string;
  profileLink?: string; // social link or portfolio
  bio?: string;
}

export interface ProjectData {
  id: string;
  userId: string;
  title: string;
  category: string;
  descriptionShort: string;
  descriptionLong: string;
  budget: number;
  objective: string;
  fundUsage: string;
  timeline: string;
  team: ProjectTeamMember[];
  termsAccepted: boolean;
  images: string[];
  status: 'draft' | 'submitted' | 'active' | 'completed';
  
  // Richer project details requested by user
  fundingGoal?: number;
  budgetBreakdown?: string;
  videos?: string[];
  contactEmail?: string;
  contactPhone?: string;
  documentationName?: string;
  documentationUrl?: string;
}

export interface ParticipantState {
  userId: string;
  name: string;
  avatar: string;
  projectId?: string;
  votesReceived: number;
  votedFor?: string; // ID of targeted participant
  hasVoted: boolean;
}

export interface InvestmentSession {
  id: string;
  title: string;
  entryFee: number;
  status: 'filling' | 'voting' | 'completed';
  participants: ParticipantState[];
  timeLeft: number; // in seconds, simulates 20 minutes (1200s), but we can speed it up or give step control!
  createdAt: string;
  winners?: string[]; // userIds of winners
  patrocinadoresPaid?: string[]; // names/IDs of sponsors that received 10%
  poolTotal: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  imageUrl?: string;
}

export interface FinancialMovement {
  id: string;
  userId: string;
  type: 'investment' | 'prize' | 'commission' | 'deposit' | 'withdrawal';
  amount: number;
  date: string;
  description: string;
  projectName?: string;
}

export interface HistoryWonRecord {
  id: string;
  title: string;
  prize: number;
  date: string;
  projectId?: string;
  projectName?: string;
  votesReceived?: number;
  coWinnersCount?: number;
  coWinnersNames?: string[];
  totalWinnersCount?: number;
}
