import {
  SupportedLanguage,
  LANGUAGE_OPTIONS,
  EXACT_PHRASES,
  PATTERN_RULES,
  PHRASE_REPLACEMENTS,
} from './translationDictionary';

export type { SupportedLanguage };
export { LANGUAGE_OPTIONS };

const STORAGE_KEY = 'ff_app_language';
export const LANGUAGE_CHANGE_EVENT = 'ff-language-change';

const originalTextMap = new WeakMap<Text, string>();
const lastTranslatedTextMap = new WeakMap<Text, string>();

const originalAttrMap = new WeakMap<Element, Record<string, string>>();
const lastTranslatedAttrMap = new WeakMap<Element, Record<string, string>>();

const TRANSLATED_ATTRS = ['placeholder', 'title', 'aria-label'] as const;

export function getStoredLanguage(): SupportedLanguage {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'es' || saved === 'fr' || saved === 'de') {
      return saved;
    }
  } catch (e) {}
  return 'es';
}

export function setStoredLanguage(lang: SupportedLanguage): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {}
}

export function notifyLanguageChange(lang: SupportedLanguage): void {
  setStoredLanguage(lang);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: { lang } }));
  }
}

function preserveCase(source: string, translated: string): string {
  const lettersOnly = source.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g, '');
  if (!lettersOnly) return translated;
  if (lettersOnly === lettersOnly.toUpperCase() && lettersOnly.length > 1) {
    return translated.toUpperCase();
  }
  return translated;
}

function shouldSkipText(trimmed: string): boolean {
  if (!trimmed || trimmed.length < 2) return true;
  // Skip handles, hashtags, emails, URLs, pure numeric/currency values
  if (/^[@#]/.test(trimmed)) return true;
  if (/^https?:\/\//i.test(trimmed)) return true;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return true;
  if (/^[+-]?[\d\s.,€$%/:•·|()-]+$/.test(trimmed)) return true;
  if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(trimmed)) return true;
  return false;
}

function shouldSkipElement(el: Element | null): boolean {
  if (!el) return true;
  if (typeof SVGElement !== 'undefined' && el instanceof SVGElement) return true;
  const tag = el.tagName.toUpperCase();
  if (
    tag === 'SCRIPT' ||
    tag === 'STYLE' ||
    tag === 'NOSCRIPT' ||
    tag === 'CODE' ||
    tag === 'PRE' ||
    tag === 'TEXTAREA' ||
    tag === 'SVG'
  ) {
    return true;
  }
  if (el.closest('[data-no-translate="true"]')) return true;
  return false;
}

export function translateText(raw: string, lang: SupportedLanguage): string {
  if (lang === 'es') return raw;
  const match = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match) return raw;
  const [, leading, core, trailing] = match;
  if (shouldSkipText(core)) return raw;

  const langIdx = lang === 'en' ? 0 : lang === 'fr' ? 1 : 2;
  const norm = core.replace(/\s+/g, ' ').trim().toLowerCase();

  // 1. Exact phrase lookup (preserving uppercase styling if original was all-caps)
  const exact = EXACT_PHRASES[norm];
  if (exact) {
    return `${leading}${preserveCase(core, exact[langIdx])}${trailing}`;
  }

  // 2. Dynamic / parameterized patterns
  for (const rule of PATTERN_RULES) {
    const m = core.trim().match(rule.regex);
    if (m) {
      return `${leading}${preserveCase(core, rule.translate(m, lang))}${trailing}`;
    }
  }

  // 3. Phrase & word fallback for remaining Spanish sentences
  let updated = core;
  let changed = false;
  for (const [regex, tuple] of PHRASE_REPLACEMENTS) {
    if (regex.test(updated)) {
      updated = updated.replace(regex, (found) => {
        changed = true;
        const rep = tuple[langIdx];
        if (found === found.toUpperCase() && found.length > 1) return rep.toUpperCase();
        if (found[0] === found[0].toUpperCase()) return rep[0].toUpperCase() + rep.slice(1);
        return rep;
      });
    }
  }

  return changed ? `${leading}${updated}${trailing}` : raw;
}

function processTextNode(node: Text, lang: SupportedLanguage): void {
  const parent = node.parentElement;
  if (shouldSkipElement(parent)) return;

  const currentVal = node.nodeValue ?? '';
  let original = originalTextMap.get(node);
  const lastTranslated = lastTranslatedTextMap.get(node);

  // If React updated this node's text underneath us, treat currentVal as the new source string
  if (original === undefined || (lastTranslated !== undefined && currentVal !== lastTranslated && currentVal !== original)) {
    original = currentVal;
    originalTextMap.set(node, original);
  }

  if (lang === 'es') {
    if (currentVal !== original) {
      lastTranslatedTextMap.set(node, original);
      node.nodeValue = original;
    }
    return;
  }

  const next = translateText(original, lang);
  if (currentVal !== next) {
    lastTranslatedTextMap.set(node, next);
    node.nodeValue = next;
  } else {
    lastTranslatedTextMap.set(node, next);
  }
}

function processElementAttributes(el: Element, lang: SupportedLanguage): void {
  if (shouldSkipElement(el)) return;

  let origRecord = originalAttrMap.get(el);
  if (!origRecord) {
    origRecord = {};
    originalAttrMap.set(el, origRecord);
  }
  let lastRecord = lastTranslatedAttrMap.get(el);
  if (!lastRecord) {
    lastRecord = {};
    lastTranslatedAttrMap.set(el, lastRecord);
  }

  for (const attr of TRANSLATED_ATTRS) {
    if (!el.hasAttribute(attr)) continue;
    const currentAttr = el.getAttribute(attr) ?? '';
    if (
      origRecord[attr] === undefined ||
      (lastRecord[attr] !== undefined && currentAttr !== lastRecord[attr] && currentAttr !== origRecord[attr])
    ) {
      origRecord[attr] = currentAttr;
    }

    const source = origRecord[attr];
    if (lang === 'es') {
      if (currentAttr !== source) {
        lastRecord[attr] = source;
        el.setAttribute(attr, source);
      }
      continue;
    }

    const translated = translateText(source, lang);
    if (currentAttr !== translated) {
      lastRecord[attr] = translated;
      el.setAttribute(attr, translated);
    } else {
      lastRecord[attr] = translated;
    }
  }
}

export function applyPageTranslation(lang: SupportedLanguage, root: HTMLElement = document.body): void {
  if (typeof document === 'undefined' || !root) return;
  document.documentElement.lang = lang;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let node: Node | null = walker.currentNode;
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      processTextNode(node as Text, lang);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      processElementAttributes(node as Element, lang);
    }
    node = walker.nextNode();
  }
}

export function startPageTranslationObserver(getLang: () => SupportedLanguage): () => void {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
    return () => {};
  }

  let scheduled = false;
  let isApplying = false;

  const runPass = () => {
    scheduled = false;
    if (isApplying) return;
    const lang = getLang();
    if (lang === 'es') return;
    isApplying = true;
    try {
      applyPageTranslation(lang, document.body);
    } finally {
      isApplying = false;
    }
  };

  const schedulePass = () => {
    if (scheduled || isApplying) return;
    if (getLang() === 'es') return;
    scheduled = true;
    requestAnimationFrame(runPass);
  };

  const observer = new MutationObserver((mutations) => {
    if (isApplying || getLang() === 'es') return;
    for (const m of mutations) {
      if (m.type === 'childList' && (m.addedNodes.length > 0)) {
        schedulePass();
        return;
      }
      if (m.type === 'characterData') {
        const textNode = m.target as Text;
        const last = lastTranslatedTextMap.get(textNode);
        if (textNode.nodeValue !== last) {
          schedulePass();
          return;
        }
      }
      if (m.type === 'attributes' && m.attributeName) {
        const el = m.target as Element;
        const lastRec = lastTranslatedAttrMap.get(el);
        const cur = el.getAttribute(m.attributeName);
        if (!lastRec || cur !== lastRec[m.attributeName]) {
          schedulePass();
          return;
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['placeholder', 'title', 'aria-label'],
  });

  return () => observer.disconnect();
}
