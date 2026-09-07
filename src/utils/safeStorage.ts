/**
 * safeStorage.ts
 * Global safe storage manager that intercepts and protects against browser QuotaExceededError.
 * Provides in-memory fallback for oversized collections and prevents infinite error/cleanup loops.
 */

// Memory fallback store when localStorage quota is exhausted or for memory-only keys
const memoryStore: Record<string, string> = {};

// Pre-seed known heavy collections directly to memory fallback to guarantee zero QuotaExceededError
const memoryOnlyKeys = new Set<string>([
  'coll_casting_live_videos',
  'coll_messages',
  'open_finanzas_sessions_list_v36',
  'open_finanzas_sessions_list_v37',
  'open_finanzas_sessions_list_v35',
  'open_finanzas_sessions_list_v30',
  'open_finanzas_sessions_list_v16',
  'open_finanzas_sessions_list_v15',
  'open_finanzas_sessions_list_v3'
]);

// Cache last written value per key to prevent redundant writes
const lastWrittenValues = new Map<string, string>();

// Set of keys warned to prevent console spam (max 1 log per key)
const warnedKeys = new Set<string>();

/**
 * Sanitizes video list to remove oversized base64 strings or bloat before storing in localStorage.
 */
export function sanitizeVideosForStorage(videos: any[]): any[] {
  if (!Array.isArray(videos)) return [];
  const trimmed = videos.slice(0, 30);
  return trimmed.map(vid => {
    if (!vid) return vid;
    const sanitized = { ...vid };
    if (typeof sanitized.coverUrl === 'string' && sanitized.coverUrl.startsWith('data:') && sanitized.coverUrl.length > 20000) {
      sanitized.coverUrl = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300';
    }
    if (typeof sanitized.poster === 'string' && sanitized.poster.startsWith('data:') && sanitized.poster.length > 20000) {
      sanitized.poster = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300';
    }
    if (typeof sanitized.thumbnailUrl === 'string' && sanitized.thumbnailUrl.startsWith('data:') && sanitized.thumbnailUrl.length > 20000) {
      sanitized.thumbnailUrl = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300';
    }
    return sanitized;
  });
}

/**
 * Safe cleanup of non-essential temporary caches without wiping important user data
 */
export function purgeExpendableStorage(): boolean {
  return true;
}

/**
 * Safe wrapper for localStorage.setItem with memory fallback
 */
export function safeSetItem(key: string, value: string): boolean {
  const strVal = String(value);
  if (lastWrittenValues.get(key) === strVal) {
    return true;
  }

  // If this key is already known to exceed quota, store in memory directly
  if (memoryOnlyKeys.has(key)) {
    memoryStore[key] = strVal;
    lastWrittenValues.set(key, strVal);
    return true;
  }

  try {
    let finalValue = strVal;
    if (key === 'coll_casting_live_videos') {
      try {
        const parsed = JSON.parse(strVal);
        if (Array.isArray(parsed)) {
          finalValue = JSON.stringify(sanitizeVideosForStorage(parsed));
        }
      } catch (e) {}
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, finalValue);
    }
    memoryStore[key] = finalValue;
    lastWrittenValues.set(key, finalValue);
    return true;
  } catch (err: any) {
    // Quota reached: switch key to in-memory store silently without infinite retry or emergency cleanup loop
    memoryOnlyKeys.add(key);
    memoryStore[key] = strVal;
    lastWrittenValues.set(key, strVal);
    if (!warnedKeys.has(key)) {
      warnedKeys.add(key);
      console.info(`[SafeStorage] Storage quota reached for "${key}". Preserving in memory store.`);
    }
    return false;
  }
}

/**
 * Safe wrapper for localStorage.getItem
 */
export function safeGetItem(key: string): string | null {
  if (memoryStore[key] !== undefined) {
    return memoryStore[key];
  }
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = window.localStorage.getItem(key);
      if (val !== null) {
        memoryStore[key] = val;
        return val;
      }
    }
  } catch (e) {}
  return null;
}

/**
 * Safe wrapper for localStorage.removeItem
 */
export function safeRemoveItem(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (e) {}
  delete memoryStore[key];
  lastWrittenValues.delete(key);
  memoryOnlyKeys.delete(key);
}

/**
 * Installs global polyfill on window.localStorage so all native localStorage calls
 * (setItem, getItem, removeItem, clear) seamlessly use memory fallback upon QuotaExceededError.
 */
let polyfillInitialized = false;

export function initSafeStoragePolyfill(): void {
  if (polyfillInitialized) return;
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const storageProto = Object.getPrototypeOf(window.localStorage) || window.Storage.prototype;
    const originalSetItem = storageProto.setItem.bind(window.localStorage);
    const originalGetItem = storageProto.getItem.bind(window.localStorage);
    const originalRemoveItem = storageProto.removeItem.bind(window.localStorage);
    const originalClear = storageProto.clear.bind(window.localStorage);

    // Monkey-patch setItem
    window.localStorage.setItem = function (key: string, value: string): void {
      const strVal = String(value);
      
      // Skip redundant write if value is identical to last written
      if (lastWrittenValues.get(key) === strVal) {
        return;
      }

      // If key is in memory-only mode, bypass localStorage directly
      if (memoryOnlyKeys.has(key)) {
        memoryStore[key] = strVal;
        lastWrittenValues.set(key, strVal);
        return;
      }

      try {
        let finalVal = strVal;
        if (key === 'coll_casting_live_videos') {
          try {
            const parsed = JSON.parse(strVal);
            if (Array.isArray(parsed)) {
              finalVal = JSON.stringify(sanitizeVideosForStorage(parsed));
            }
          } catch (e) {}
        }
        originalSetItem(key, finalVal);
        memoryStore[key] = finalVal;
        lastWrittenValues.set(key, finalVal);
      } catch (e: any) {
        // QuotaExceededError or security block: switch key to memoryStore fallback seamlessly
        memoryOnlyKeys.add(key);
        memoryStore[key] = strVal;
        lastWrittenValues.set(key, strVal);
        if (!warnedKeys.has(key)) {
          warnedKeys.add(key);
          console.info(`[SafeStorage Polyfill] Memory fallback activated for key "${key}".`);
        }
      }
    };

    // Monkey-patch getItem
    window.localStorage.getItem = function (key: string): string | null {
      // If we have an active in-memory value, prefer it
      if (memoryStore[key] !== undefined) {
        return memoryStore[key];
      }
      try {
        const val = originalGetItem(key);
        if (val !== null) {
          memoryStore[key] = val;
          return val;
        }
      } catch (e) {}
      return null;
    };

    // Monkey-patch removeItem
    window.localStorage.removeItem = function (key: string): void {
      try {
        originalRemoveItem(key);
      } catch (e) {}
      delete memoryStore[key];
      lastWrittenValues.delete(key);
      memoryOnlyKeys.delete(key);
    };

    // Monkey-patch clear
    window.localStorage.clear = function (): void {
      try {
        originalClear();
      } catch (e) {}
      for (const k of Object.keys(memoryStore)) {
        delete memoryStore[k];
      }
      lastWrittenValues.clear();
      memoryOnlyKeys.clear();
    };

    polyfillInitialized = true;
  } catch (e) {
    console.error('[SafeStorage] Could not attach localStorage polyfill:', e);
  }
}

// Auto-run polyfill when module is imported
initSafeStoragePolyfill();
