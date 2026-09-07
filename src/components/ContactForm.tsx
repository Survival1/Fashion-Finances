/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';

interface ContactFormProps {
  models: { id: string; name: string }[];
  currentSponsorId?: string;
  onSponsorChangedRequested?: (reason: string, targetSponsorId: string) => void;
}

export default function ContactForm({ models, currentSponsorId, onSponsorChangedRequested }: ContactFormProps) {
  const [notification, setNotification] = useState<string | null>(null);

  const displayActionNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-14 text-slate-900 relative overflow-hidden shadow-xl flex flex-col justify-between" id="aspirations-section">
      {/* Subtle background visual glows */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-slate-100 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-pink-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8 z-10">
        
        {/* Main Serif Display Title */}
        <h2 className="text-2xl sm:text-4xl font-display font-medium text-slate-950 tracking-tight leading-tight select-none">
          ¿Preparado para transformar tus aspiraciones?
        </h2>

        {/* Description Paragraph */}
        <p className="text-slate-600 font-sans text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-normal select-none">
          Consigue patrocinadores reales para tus obras o genera comisiones estables apoyando colectivamente alternativas exclusivas inspiradas en la economía digital.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => displayActionNotification("✨ Tu registro de inversora ya está activo y verificado en la plataforma.")}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-950 hover:bg-slate-800 active:scale-95 transition-all text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-slate-900/15 cursor-pointer select-none border-0 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            REGÍSTRATE Y EMPIEZA
          </button>

          <button
            type="button"
            onClick={() => displayActionNotification("🤝 ¡Sesión activa de inversora! Estás navegando con tu balance actual.")}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 active:scale-95 transition-all text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-xs cursor-pointer select-none flex items-center justify-center gap-1.5"
          >
            YA TENGO CUENTA
          </button>
        </div>

        {/* Action feedback message */}
        {notification && (
          <div className="flex items-center justify-center gap-2 bg-pink-50 border border-pink-200 rounded-xl px-4 py-2 mt-4 text-xs font-semibold text-rose-700 animate-fade-in max-w-md mx-auto">
            <CheckCircle className="w-4 h-4 text-pink-500 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Decorative divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-pink-950/40 to-transparent my-4" />

        {/* Legal/Tech Footer */}
        <div className="text-[9.5px] text-rose-500/60 leading-relaxed font-sans max-w-lg mx-auto pt-4 select-none">
          © 2026 Fashion Finances Platform. Licencia Pública de Distribución Tecnológica. Una incubadora creativa internacional.
        </div>
      </div>
    </div>
  );
}
