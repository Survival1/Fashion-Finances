/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';

interface ContactFormProps {
  models?: { id: string; name: string }[];
  currentSponsorId?: string;
  onSponsorChangedRequested?: (reason: string, targetSponsorId: string) => void;
  onRegisterClick?: () => void;
  onLoginClick?: () => void;
}

export default function ContactForm({ models, currentSponsorId, onSponsorChangedRequested, onRegisterClick, onLoginClick }: ContactFormProps) {
  const [notification, setNotification] = useState<string | null>(null);

  const handleRegister = () => {
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      displayActionNotification("✨ ¡Bienvenida a Fashion Finances! Tu registro de inversora y mecenas está listo.");
      window.dispatchEvent(new CustomEvent('open-register-modal'));
    }
  };

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      displayActionNotification("🤝 ¡Sesión activa! Conectada con tu balance y perfil de inversión.");
      window.dispatchEvent(new CustomEvent('open-login-modal'));
    }
  };

  const displayActionNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto" id="aspirations-section">
      {/* Banner Master Container matching Aspiraciones de lujo y glamour 1.png */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-pink-300/80 ring-1 ring-pink-200/60 bg-[#fce7f3] group select-none">
        
        {/* Crisp Banner Image without any duplicate overlay text */}
        <div className="relative w-full aspect-[1965/800] overflow-hidden">
          <img
            src="/assets/aistudio/Aspiraciones_de_lujo_y_glamour_609a3563.png"
            alt="¿Preparado para transformar tus aspiraciones? - Aspiraciones de Lujo y Glamour"
            className="w-full h-full object-cover object-center block"
          />

          {/* Interactive Clickable Hotspots mapped directly over the image buttons */}
          {/* Button 1: REGÍSTRATE Y EMPIEZA */}
          <button
            type="button"
            onClick={handleRegister}
            className="absolute left-[36.5%] top-[77.5%] w-[32.5%] h-[15%] rounded-full cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-white/80 hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] active:scale-95 focus:outline-none"
            title="Regístrate y empieza"
            aria-label="Regístrate y empieza"
          >
            <span className="sr-only">Regístrate y empieza</span>
          </button>

          {/* Button 2: YA TENGO CUENTA */}
          <button
            type="button"
            onClick={handleLogin}
            className="absolute left-[70.8%] top-[77.5%] w-[25.8%] h-[15%] rounded-full cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-pink-400 hover:shadow-[0_0_25px_rgba(244,114,182,0.6)] active:scale-95 focus:outline-none"
            title="Ya tengo cuenta"
            aria-label="Ya tengo cuenta"
          >
            <span className="sr-only">Ya tengo cuenta</span>
          </button>
        </div>
      </div>

      {/* Mobile companion buttons (only visible on small screens where banner tap targets are tiny) */}
      <div className="sm:hidden flex flex-col gap-2.5 pt-2 px-2">
        <button
          type="button"
          onClick={handleRegister}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#d9006c] via-[#e60076] to-[#f43f8e] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-pink-500/35 border-2 border-white/90 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">👤</span>
          <span>REGÍSTRATE Y EMPIEZA</span>
          <span className="text-sm font-bold">›</span>
        </button>
        <button
          type="button"
          onClick={handleLogin}
          className="w-full py-3.5 px-6 rounded-full bg-white text-[#be185d] font-black text-xs uppercase tracking-wider shadow-md shadow-pink-200/60 border-2 border-[#f472b6] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <span className="text-sm">👁️</span>
          <span>YA TENGO CUENTA</span>
          <span className="text-sm font-bold">›</span>
        </button>
      </div>

      {/* Action feedback notification toast */}
      {notification && (
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl px-5 py-3 shadow-xl border border-pink-300 animate-fade-in max-w-lg mx-auto text-xs sm:text-sm font-bold">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Legal Footer */}
      <div className="text-[10px] text-slate-500 text-center leading-relaxed font-sans max-w-lg mx-auto pt-2 select-none">
        © 2026 Fashion Finances Platform. Licencia Pública de Distribución Tecnológica. Una incubadora creativa internacional de alta costura y mecenazgo.
      </div>
    </div>
  );
}
