import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import {
  SupportedLanguage,
  LANGUAGE_OPTIONS,
  LANGUAGE_CHANGE_EVENT,
  getStoredLanguage,
  notifyLanguageChange,
} from '../utils/pageTranslator';

interface LanguageTranslatorDropdownProps {
  compact?: boolean;
}

export default function LanguageTranslatorDropdown({ compact = false }: LanguageTranslatorDropdownProps) {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => getStoredLanguage());
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSync = (e: Event) => {
      const detailLang = (e as CustomEvent<{ lang?: SupportedLanguage }>).detail?.lang;
      if (detailLang) {
        setCurrentLang(detailLang);
      } else {
        setCurrentLang(getStoredLanguage());
      }
    };
    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleSync);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleSync);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const activeOption = LANGUAGE_OPTIONS.find((opt) => opt.code === currentLang) || LANGUAGE_OPTIONS[1];

  const handleSelect = (code: SupportedLanguage) => {
    setCurrentLang(code);
    setIsOpen(false);
    notifyLanguageChange(code);
  };

  return (
    <div ref={containerRef} className="relative shrink-0" data-no-translate="true">
      <button
        type="button"
        id="btn-header-language-translator"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`bg-white hover:bg-pink-50/60 border border-slate-200/90 hover:border-pink-300 text-slate-700 hover:text-pink-600 rounded-xl transition-all cursor-pointer shadow-3xs flex items-center justify-center gap-1.5 shrink-0 active:scale-95 ${
          compact ? 'px-2 py-1.5 text-[11px]' : 'px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Language"
        title="Inglés / Español / Francés / Alemán"
      >
        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-500 shrink-0" />
        <span className="text-sm leading-none select-none">{activeOption.flag}</span>
        <span className="font-mono font-bold text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-800">
          {activeOption.shortCode}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180 text-pink-500' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Languages"
          className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-pink-200/80 shadow-xl shadow-pink-500/10 py-1.5 z-[250] animate-fade-in overflow-hidden"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Idioma / Language
            </span>
          </div>
          <div className="py-1">
            {LANGUAGE_OPTIONS.map((opt) => {
              const isSelected = opt.code === currentLang;
              return (
                <button
                  key={opt.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt.code)}
                  className={`w-full px-3 py-2 flex items-center justify-between gap-2 text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-pink-50 text-pink-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base leading-none select-none">{opt.flag}</span>
                    <span className="flex flex-col leading-tight">
                      <span className="text-xs">{opt.nativeName}</span>
                      <span className="text-[9.5px] text-slate-400 font-normal">{opt.label}</span>
                    </span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-pink-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
