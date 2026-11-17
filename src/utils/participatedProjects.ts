import { useEffect, useMemo, useState } from 'react';

export interface ParticipatedProjectItem {
  name: string;
  amount: number;
  pct: number;
  color: string;
}

export function readStoredTotalInvested(): number | null {
  try {
    const rawUser = localStorage.getItem('coll_userProfile');
    if (!rawUser) return null;
    const parsed = JSON.parse(rawUser);
    if (parsed && typeof parsed.totalInvested === 'number' && !isNaN(parsed.totalInvested)) {
      return parsed.totalInvested;
    }
  } catch {
    // ignore storage errors
  }
  return null;
}

export function computeParticipatedProjects(totalInvested: number): {
  projects: ParticipatedProjectItem[];
  total: number;
} {
  const safeInvested = typeof totalInvested === 'number' && !isNaN(totalInvested) ? totalInvested : 0;
  const projects: ParticipatedProjectItem[] = [
    { name: 'Eco-Fashion Runway', amount: safeInvested > 0 ? safeInvested : 120, pct: 55, color: 'bg-pink-600' },
    { name: 'Elite Jewelry Drop', amount: 80, pct: 25, color: 'bg-rose-500' },
    { name: 'Retro Resort Denim', amount: 45, pct: 15, color: 'bg-amber-500' },
    { name: 'Sunset Breeze Swim', amount: 15, pct: 5, color: 'bg-sky-500' },
  ];
  const total = projects.reduce((sum, p) => sum + p.amount, 0);
  return { projects, total };
}

export function useSyncedParticipatedProjects(
  propTotalInvested?: number,
  isVisitor = false
) {
  const initialVal =
    typeof propTotalInvested === 'number' && !isNaN(propTotalInvested)
      ? propTotalInvested
      : (readStoredTotalInvested() ?? 0);

  const [syncedTotalInvested, setSyncedTotalInvested] = useState<number>(initialVal);

  useEffect(() => {
    if (typeof propTotalInvested === 'number' && !isNaN(propTotalInvested)) {
      setSyncedTotalInvested(propTotalInvested);
    }
  }, [propTotalInvested]);

  useEffect(() => {
    const handleSync = (e?: Event) => {
      const customEvt = e as CustomEvent | undefined;
      if (
        customEvt?.detail &&
        typeof customEvt.detail.totalInvested === 'number' &&
        !isNaN(customEvt.detail.totalInvested)
      ) {
        setSyncedTotalInvested(customEvt.detail.totalInvested);
        return;
      }
      const stored = readStoredTotalInvested();
      if (typeof stored === 'number') {
        setSyncedTotalInvested(stored);
      }
    };

    window.addEventListener('user-profile-updated', handleSync);
    window.addEventListener('wallet-updated', handleSync);
    window.addEventListener('storage', handleSync);
    window.addEventListener('participated-projects-sync', handleSync);
    return () => {
      window.removeEventListener('user-profile-updated', handleSync);
      window.removeEventListener('wallet-updated', handleSync);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('participated-projects-sync', handleSync);
    };
  }, []);

  const effectiveTotalInvested = isVisitor ? 0 : syncedTotalInvested;

  const { projects, total } = useMemo(
    () => computeParticipatedProjects(effectiveTotalInvested),
    [effectiveTotalInvested]
  );

  return {
    effectiveTotalInvested,
    participatedProjects: projects,
    participatedProjectsTotal: total,
  };
}
