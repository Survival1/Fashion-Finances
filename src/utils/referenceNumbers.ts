/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const REF_SEQ_KEY = 'ff_user_ref_seq';
const REF_MAP_KEY = 'ff_user_ref_map';
const INITIAL_DYNAMIC_REF = 100201;

const FIXED_SEEDED_REFS: Record<string, string> = {
  'usr-admin-001': '100000',
  admin: '100000',
  'user-investor': '100101',
  adrianalima: '100101',
  ernesto: '100102',
  ernestovs: '100102',
  'pat-marcus': '100052',
  marcussterling_m2: '100052',
  'pat-0': '100103',
  pedro: '100103',
  'pat-1': '100104',
  sofia_mtz: '100104',
  'pat-2': '100105',
  carlos_mendu: '100105',
  'pat-3': '100106',
  lu_olivera: '100106',
  'pat-4': '100107',
  ale_ortiz: '100107',
  'pat-5': '100108',
  val_russo: '100108',
};

function readRefMap(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(REF_MAP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {}
  return {};
}

function writeRefMap(map: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REF_MAP_KEY, JSON.stringify(map));
  } catch {}
}

function getSeededModelRef(normalizedKey: string): string | null {
  if (FIXED_SEEDED_REFS[normalizedKey]) {
    return FIXED_SEEDED_REFS[normalizedKey];
  }
  const femaleMatch = /^topf-(\d+)$/.exec(normalizedKey);
  if (femaleMatch) {
    const idx = parseInt(femaleMatch[1], 10);
    if (!isNaN(idx) && idx >= 1) {
      return String(100000 + idx);
    }
  }
  const maleMatch = /^topm-(\d+)$/.exec(normalizedKey);
  if (maleMatch) {
    const idx = parseInt(maleMatch[1], 10);
    if (!isNaN(idx) && idx >= 1) {
      return String(100050 + idx);
    }
  }
  return null;
}

export function generateNextReferenceNumber(primaryKey?: string, secondaryKey?: string): string {
  const map = readRefMap();
  const usedValues = new Set<string>(Object.values(map));
  let seq = INITIAL_DYNAMIC_REF;

  if (typeof window !== 'undefined') {
    try {
      const stored = parseInt(localStorage.getItem(REF_SEQ_KEY) || String(INITIAL_DYNAMIC_REF), 10);
      if (!isNaN(stored) && stored >= INITIAL_DYNAMIC_REF) {
        seq = stored;
      }
    } catch {}
  }

  while (usedValues.has(String(seq))) {
    seq += 1;
  }

  const refStr = String(seq);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(REF_SEQ_KEY, String(seq + 1));
    } catch {}
  }

  if (primaryKey) {
    const norm = primaryKey.trim().toLowerCase().replace(/^@/, '');
    if (norm) map[norm] = refStr;
  }
  if (secondaryKey) {
    const norm2 = secondaryKey.trim().toLowerCase().replace(/^@/, '');
    if (norm2) map[norm2] = refStr;
  }
  if (primaryKey || secondaryKey) {
    writeRefMap(map);
  }

  return refStr;
}

export function getOrAssignReferenceNumber(
  primaryKey?: string | null,
  secondaryKey?: string | null,
  preferredExisting?: string | null
): string {
  const normPrimary = (primaryKey || '').trim().toLowerCase().replace(/^@/, '');
  const normSecondary = (secondaryKey || '').trim().toLowerCase().replace(/^@/, '');

  if (preferredExisting && preferredExisting.trim()) {
    const existing = preferredExisting.trim();
    const map = readRefMap();
    let changed = false;
    if (normPrimary && map[normPrimary] !== existing) {
      map[normPrimary] = existing;
      changed = true;
    }
    if (normSecondary && map[normSecondary] !== existing) {
      map[normSecondary] = existing;
      changed = true;
    }
    if (changed) writeRefMap(map);
    return existing;
  }

  const map = readRefMap();
  if (normPrimary && map[normPrimary]) return map[normPrimary];
  if (normSecondary && map[normSecondary]) return map[normSecondary];

  const seeded =
    (normPrimary ? getSeededModelRef(normPrimary) : null) ||
    (normSecondary ? getSeededModelRef(normSecondary) : null);

  if (seeded) {
    if (normPrimary) map[normPrimary] = seeded;
    if (normSecondary) map[normSecondary] = seeded;
    writeRefMap(map);
    return seeded;
  }

  return generateNextReferenceNumber(normPrimary || undefined, normSecondary || undefined);
}

export function buildFashionFinancesReferralUrl(referenceNumber?: string | null): string {
  const cleanRef = (referenceNumber || '').trim();
  if (!cleanRef) {
    return 'https://fashion.finances/ref?sponsor=100101';
  }
  return `https://fashion.finances/ref?sponsor=${encodeURIComponent(cleanRef)}`;
}
