/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FounderPositionStatus = 'AVAILABLE' | 'RESERVED' | 'CONFIRMED';

export type FounderPaymentStatus =
  | 'unpaid'
  | 'pending_provider_confirmation'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export interface FounderPosition {
  number: number; // 1..100
  code: string; // '001'..'100'
  status: FounderPositionStatus;
  reservationId?: string;
  userId?: string;
  username?: string;
  professionalName?: string;
  avatar?: string;
  allowPublicDisplay?: boolean;
  reservedAt?: string;
  expiresAt?: string;
  confirmedAt?: string;
  joinDate?: string;
  paymentProvider?: 'stripe' | 'bank_transfer' | 'pending_gateway';
  paymentStatus?: FounderPaymentStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  badgeActive?: boolean;
  completionPercent?: number;
  completedTasksCount?: number;
  totalTasksCount?: number;
  completedTaskIds?: string[];
  lastProgressUpdatedAt?: string;
}

export interface FounderPaymentIncident {
  id: string;
  reservationId?: string;
  positionCode?: string;
  userId?: string;
  username?: string;
  type: 'payment_pending' | 'gateway_not_configured' | 'payment_failed' | 'refund_request' | 'cancellation' | 'manual_review';
  status: 'open' | 'resolved' | 'dismissed';
  description: string;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface FoundersProgramConfig {
  openingDate: string; // ISO date
  launchDate: string; // ISO date (default openingDate + 90 days)
  programClosed: boolean;
  closedReason?: string;
  packagePriceEur: number;
  currency: 'EUR';
}

export interface FoundersConversionStats {
  pageViews: number;
  reserveStarts: number;
  reservedCount: number;
  confirmedCount: number;
  availableCount: number;
  cancelledOrRefundedCount: number;
  totalConfirmedRevenueEur: number;
  conversionRatePercent: number;
}

export interface FoundersPublicResponse {
  config: FoundersProgramConfig;
  stripeConfigured: boolean;
  positions: FounderPosition[]; // Privacy-filtered for public consumption
  stats: FoundersConversionStats;
  myPosition: FounderPosition | null;
}

export interface FoundersAdminResponse extends FoundersPublicResponse {
  incidents: FounderPaymentIncident[];
  allReservationsHistory: Array<{
    reservationId: string;
    userId: string;
    username: string;
    professionalName: string;
    positionCode: string;
    status: FounderPositionStatus;
    paymentStatus: FounderPaymentStatus;
    paymentProvider?: string;
    amountEur: number;
    createdAt: string;
    updatedAt: string;
    stripeSessionId?: string;
  }>;
}
