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
    <div className="bg-[#11080b] border border-pink-950/30 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between" id="aspirations-section">
      {/* Subtle background visual glows */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8 z-10">
        
        {/* Main Serif Display Title */}
        <h2 className="text-2xl sm:text-4xl font-display font-medium text-white tracking-tight leading-tight select-none">
          ¿Preparado para transformar tus aspiraciones?
        </h2>

        {/* Coral/Rose Description Paragraph */}
        <p className="text-rose-400 font-sans text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-medium select-none">
          Consigue patrocinadores reales para tus obras o genera comisiones estables apoyando colectivamente alternativas exclusivas inspiradas en la economía digital.
        </p>

        {/* Action Buttons styled like zdzd.png */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => displayActionNotification("✨ Tu registro de inversora ya está activo y verificado en la plataforma.")}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-white to-pink-400 hover:brightness-110 active:scale-95 transition-all text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-pink-500/10 cursor-pointer select-none border-0 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            REGÍSTRATE Y EMPIEZA
          </button>

          <button
            type="button"
            onClick={() => displayActionNotification("🤝 ¡Sesión activa de inversora! Estás navegando con tu balance actual.")}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-white to-pink-400 hover:brightness-110 active:scale-95 transition-all text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-pink-500/10 cursor-pointer select-none border-0 flex items-center justify-center gap-1.5"
          >
            YA TENGO CUENTA
          </button>
        </div>

        {/* Action feedback message */}
        {notification && (
          <div className="flex items-center justify-center gap-2 bg-pink-950/30 border border-pink-500/20 rounded-xl px-4 py-2 mt-4 text-xs font-semibold text-rose-300 animate-fade-in max-w-md mx-auto">
            <CheckCircle className="w-4 h-4 text-pink-400 shrink-0" />
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
