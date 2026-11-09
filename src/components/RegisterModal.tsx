import React from 'react';
import { Sparkles, UserPlus2, X, Check, Search, ShieldCheck } from 'lucide-react';
import { ModelProfile } from '../types';

interface RegisterModalProps {
  show: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  onSubmit: (e: React.FormEvent) => void;
  models: ModelProfile[];
  regName: string;
  setRegName: (v: string) => void;
  regLastName: string;
  setRegLastName: (v: string) => void;
  regUsername: string;
  setRegUsername: (v: string) => void;
  regInstagram: string;
  setRegInstagram: (v: string) => void;
  regTikTok: string;
  setRegTikTok: (v: string) => void;
  regDireccion: string;
  setRegDireccion: (v: string) => void;
  regCiudad: string;
  setRegCiudad: (v: string) => void;
  regCodigoPostal: string;
  setRegCodigoPostal: (v: string) => void;
  regPais: string;
  setRegPais: (v: string) => void;
  regTelefono: string;
  setRegTelefono: (v: string) => void;
  regEmail: string;
  setRegEmail: (v: string) => void;
  regPassword: string;
  setRegPassword: (v: string) => void;
  regRole: 'investor' | 'model';
  setRegRole: (v: 'investor' | 'model') => void;
  regGender: 'female' | 'male';
  setRegGender: (v: 'female' | 'male') => void;
  regSponsorId: string;
  setRegSponsorId: (v: string) => void;
  sponsorSearchQuery: string;
  setSponsorSearchQuery: (v: string) => void;
}

export default function RegisterModal({
  show,
  onClose,
  onOpenLogin,
  onSubmit,
  models,
  regName,
  setRegName,
  regLastName,
  setRegLastName,
  regUsername,
  setRegUsername,
  regInstagram,
  setRegInstagram,
  regTikTok,
  setRegTikTok,
  regDireccion,
  setRegDireccion,
  regCiudad,
  setRegCiudad,
  regCodigoPostal,
  setRegCodigoPostal,
  regPais,
  setRegPais,
  regTelefono,
  setRegTelefono,
  regEmail,
  setRegEmail,
  regPassword,
  setRegPassword,
  regRole,
  setRegRole,
  regGender,
  setRegGender,
  regSponsorId,
  setRegSponsorId,
  sponsorSearchQuery,
  setSponsorSearchQuery
}: RegisterModalProps) {
  if (!show) return null;

  const matchedModel = regSponsorId 
    ? models.find(m => m.id.toLowerCase() === regSponsorId.toLowerCase().trim())
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl bg-white border-2 border-pink-300/80 rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 text-slate-900 space-y-6 shadow-[0_25px_70px_rgba(244,114,182,0.35)] max-h-[92vh] overflow-y-auto my-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        
        {/* Subtle Pearl Pink Ambient Light at Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-24 bg-gradient-to-b from-[#fce7f3] via-[#fff1f6] to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

        {/* Modal Header */}
        <div className="flex justify-between items-start pb-3 border-b border-pink-100">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200/80 border border-pink-300 flex items-center justify-center text-pink-600 shadow-xs shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-[#d9006c]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-serif font-black text-slate-950 tracking-tight leading-snug flex items-center gap-1.5 flex-wrap">
                <span>Crear Cuenta en</span>
                <span className="text-[#d9006c]">Fashion Finances</span>
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">
                Regístrate eligiendo a uno de los 50 modelos del ranking o a tu patrocinador personal.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 hover:text-pink-800 border border-pink-200/80 flex items-center justify-center transition cursor-pointer shrink-0 shadow-2xs"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="space-y-5 text-xs">
          
          {/* SECTION 1: Datos Personales (2 Columnas) */}
          <div className="bg-[#fff8fa] p-4 rounded-2xl border border-pink-200/70 space-y-3.5">
            <div className="flex items-center gap-1.5 text-[#be185d] font-bold text-[11px] uppercase tracking-wider font-mono">
              <UserPlus2 className="w-3.5 h-3.5" />
              <span>1. Identidad & Perfil</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-800 font-bold text-xs mb-1.5">
                  Nombre <span className="text-[#d9006c]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Carmen"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-white border border-pink-200/90 rounded-xl py-2.5 px-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-3 focus:ring-pink-200/50 transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold text-xs mb-1.5">
                  Apellidos <span className="text-[#d9006c]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Alvarez"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  className="w-full bg-white border border-pink-200/90 rounded-xl py-2.5 px-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-3 focus:ring-pink-200/50 transition shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-bold text-xs mb-1.5">
                Nombre de Usuario (Username) <span className="text-[#d9006c]">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-500 font-bold">@</span>
                <input
                  type="text"
                  required
                  placeholder="carmenval"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full bg-white border border-pink-200/90 rounded-xl py-2.5 pl-8 pr-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-3 focus:ring-pink-200/50 transition shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Redes Sociales (Instagram & Tik Tok en 2 Columnas) */}
          <div className="bg-[#fff8fa] p-4 rounded-2xl border border-pink-200/70 space-y-3.5">
            <div className="flex items-center gap-1.5 text-[#be185d] font-bold text-[11px] uppercase tracking-wider font-mono">
              <span>📱</span>
              <span>2. Presencia en Redes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-800 font-bold text-xs mb-1.5">
                  Instagram (@usuario) <span className="text-[#d9006c]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. @carmen_diseno"
                  value={regInstagram}
                  onChange={(e) => setRegInstagram(e.target.value)}
                  className="w-full bg-white border border-pink-200/90 rounded-xl py-2.5 px-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-3 focus:ring-pink-200/50 transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold text-xs mb-1.5">
                  Tik Tok (@usuario) <span className="text-[#d9006c]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. @carmen_tok"
                  value={regTikTok}
                  onChange={(e) => setRegTikTok(e.target.value)}
                  className="w-full bg-white border border-pink-200/90 rounded-xl py-2.5 px-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-3 focus:ring-pink-200/50 transition shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Ubicación & Domicilio */}
          <div className="bg-[#fff8fa] p-4 rounded-2xl border border-pink-200/70 space-y-3.5">
            <div className="flex items-center gap-1.5 text-[#be185d] font-bold text-[11px] uppercase tracking-wider font-mono">
              <span>📍</span>
              <span>3. Ubicación & Domicilio</span>
            </div>

            <div>
              <label className="block text-slate-800 font-bold text-xs mb-1.5">
                Dirección <span className="text-[#d9006c]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Calle Gran Vía 45, Madrid"
                value={regDireccion}
                onChange={(e) => setRegDireccion(e.target.value)}
                className="w-full bg-white border border-pink-200/90 rounded-xl py-2.5 px-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-3 focus:ring-pink-200/50 transition shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-800 font-bold text-xs mb-1.5">
                  Ciudad <span className="text-[#d9006c]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Madrid"
                  value={regCiudad}
                  onChange={(e) => setRegCiudad(e.target.value)}
                  className="w-full bg-white border border-pink-200/90 rounded-xl py-2.5 px-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-3 focus:ring-pink-200/50 transition shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-800 font-bold text-xs mb-1.5">
                  Código Postal <span className="text-[#d9006c]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 28013"
                  value={regCodigoPostal}
                  onChange={(e) => setRegCodigoPostal(e.target.value)}
                  className="w-full bg-white border border-pink-200/90 rounded-xl py-2.5 px-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-3 focus:ring-pink-200/50 transition shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-bold text-xs mb-1.5">
                País <span className="text-[#d9006c]">*</span>
              </label>
              <select
                required
                value={regPais}
                onChange={(e) => setRegPais(e.target.value)}
                className="w-full bg-white border border-pink-200/90 rounded-xl py-2.5 px-3.5 text-slate-950 focus:outline-none focus:border-[#ec4899] focus:ring-3 focus:ring-pink-200/50 transition shadow-2xs cursor-pointer font-medium"
              >
                <option value="">-- Selecciona tu País --</option>
                <option value="España">España</option>
                <option value="México">México</option>
                <option value="Colombia">Colombia</option>
                <option value="Argentina">Argentina</option>
                <option value="Chile">Chile</option>
                <option value="Perú">Perú</option>
                <option value="Venezuela">Venezuela</option>
                <option value="Ecuador">Ecuador</option>
                <option value="Bolivia">Bolivia</option>
                <option value="Uruguay">Uruguay</option>
                <option value="Paraguay">Paraguay</option>
                <option value="Costa Rica">Costa Rica</option>
                <option value="Panamá">Panamá</option>
                <option value="República Dominicana">República Dominicana</option>
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="Francia">Francia</option>
                <option value="Italia">Italia</option>
                <option value="Reino Unido">Reino Unido</option>
                <option value="Alemania">Alemania</option>
                <option value="Portugal">Portugal</option>
                <option value="Brasil">Brasil</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>

          {/* SECTION 4: Contacto & Seguridad */}
          <div className="bg-[#fff8fa] p-4 rounded-2xl border border-pink-200/70 space-y-3.5">
            <div className="flex items-center gap-1.5 text-[#be185d] font-bold text-[11px] uppercase tracking-wider font-mono">
              <span>🔒</span>
              <span>4. Contacto & Credenciales</span>
            </div>

            <div>
              <label className="block text-slate-800 font-bold text-xs mb-1.5">
                Teléfono <span className="text-[#d9006c]">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Ej. +34 612 345 678"
                value={regTelefono}
                onChange={(e) => setRegTelefono(e.target.value)}
                className="w-full bg-white border border-pink-200/90 rounded-xl py-2.5 px-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-3 focus:ring-pink-200/50 transition shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-bold text-xs mb-1.5">
                Correo Electrónico (Email) <span className="text-[#d9006c]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="Ej. usuario@gmail.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full bg-white border border-pink-200/90 rounded-xl py-2.5 px-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-3 focus:ring-pink-200/50 transition shadow-2xs"
              />
              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-pink-700 font-semibold bg-pink-100/60 p-2 rounded-lg border border-pink-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d9006c] shrink-0" />
                <span>Solo cuentas @gmail.com (letras, números, puntos y signo más) por seguridad.</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-800 font-bold text-xs mb-1.5">
                Contraseña <span className="text-[#d9006c]">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Crea una contraseña segura"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="w-full bg-white border border-pink-200/90 rounded-xl py-2.5 px-3.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-3 focus:ring-pink-200/50 transition shadow-2xs"
              />
            </div>
          </div>

          {/* SECTION 5: Elección de Rol */}
          <div className="bg-[#fff8fa] p-4 rounded-2xl border border-pink-200/70 space-y-3">
            <label className="block text-slate-800 font-bold text-xs">
              Elige tu Rol Principal <span className="text-[#d9006c]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRegRole('investor')}
                className={`p-3 rounded-2xl border-2 text-xs font-bold text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  regRole === 'investor'
                    ? 'bg-gradient-to-r from-[#d9006c] to-[#ec4899] border-[#d9006c] text-white shadow-md shadow-pink-500/25'
                    : 'bg-white border-pink-200 text-slate-700 hover:border-pink-400 hover:bg-pink-50/50'
                }`}
              >
                <span>💼</span>
                <span>Registro de Inversor</span>
              </button>
              <button
                type="button"
                onClick={() => setRegRole('model')}
                className={`p-3 rounded-2xl border-2 text-xs font-bold text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  regRole === 'model'
                    ? 'bg-gradient-to-r from-[#d9006c] to-[#ec4899] border-[#d9006c] text-white shadow-md shadow-pink-500/25'
                    : 'bg-white border-pink-200 text-slate-700 hover:border-pink-400 hover:bg-pink-50/50'
                }`}
              >
                <span>✨</span>
                <span>Soy Modelo</span>
              </button>
            </div>

            {regRole === 'model' && (
              <div className="bg-white p-3.5 rounded-xl border border-pink-200 space-y-2 animate-fade-in mt-2">
                <span className="block text-slate-800 font-bold text-xs">Selecciona tu Género *</span>
                <p className="text-[10px] text-pink-700">Para asignarte al ranking correspondiente de alta costura.</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setRegGender('female')}
                    className={`py-2 px-3 rounded-xl border-2 text-xs font-bold text-center transition cursor-pointer ${
                      regGender === 'female'
                        ? 'bg-[#d9006c] border-[#d9006c] text-white shadow-xs'
                        : 'bg-pink-50/60 border-pink-200 text-[#d9006c] hover:bg-pink-100'
                    }`}
                  >
                    👩 Mujer / Femenino
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegGender('male')}
                    className={`py-2 px-3 rounded-xl border-2 text-xs font-bold text-center transition cursor-pointer ${
                      regGender === 'male'
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    👨 Hombre / Masculino
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 6: Patrocinador (Sponsor) Obligatorio */}
          <div className="bg-gradient-to-br from-[#fff2f7] via-[#fff7fa] to-white p-4 sm:p-5 rounded-2xl border-2 border-pink-200 space-y-3">
            <div className="space-y-1">
              <label className="block text-slate-900 font-serif font-black text-xs sm:text-sm flex items-center gap-1.5">
                <span className="text-[#d9006c]">👑</span>
                <span>Patrocinador (Sponsor) Oficial</span>
                <span className="text-[#d9006c]">*</span>
              </label>
              <p className="text-[10.5px] text-slate-600 leading-normal">
                Elige un patrocinador del ranking o introduce directamente su ID único de afiliación.
              </p>
            </div>
            
            <div className="space-y-3 pt-1">
              {/* Opción A: Buscador y desplegable */}
              <div>
                <span className="text-[10px] text-pink-900 font-mono font-bold block mb-1">
                  Opción A: Elige un Patrocinador del Ranking
                </span>
                
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="🔍 Buscar por nombre o ID de modelo..."
                    value={sponsorSearchQuery}
                    onChange={(e) => setSponsorSearchQuery(e.target.value)}
                    className="w-full bg-white border border-pink-200 rounded-xl py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-2 focus:ring-pink-200 font-sans shadow-2xs"
                  />
                  <Search className="w-3.5 h-3.5 text-pink-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  {sponsorSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setSponsorSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1 cursor-pointer bg-transparent border-0"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <select
                  value={regSponsorId}
                  onChange={(e) => setRegSponsorId(e.target.value)}
                  className="w-full bg-white border border-pink-200 rounded-xl p-2.5 text-slate-800 text-xs focus:outline-none focus:border-[#ec4899] focus:ring-2 focus:ring-pink-200 cursor-pointer shadow-2xs font-medium"
                >
                  <option value="">-- Elige un Patrocinador del Ranking --</option>
                  {models
                    .filter((model) => {
                      const query = sponsorSearchQuery.trim().toLowerCase();
                      if (!query) return true;
                      return (
                        model.name.toLowerCase().includes(query) ||
                        model.id.toLowerCase().includes(query) ||
                        (model.username && model.username.toLowerCase().includes(query))
                      );
                    })
                    .map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} (ID: {model.id} - {model.totalLikes} Likes)
                      </option>
                    ))}
                </select>
              </div>

              {/* Opción B: ID Directo */}
              <div>
                <span className="text-[10px] text-pink-900 font-mono font-bold block mb-1">
                  Opción B: Introduce el ID de tu Sponsor Directamente
                </span>
                <input
                  type="text"
                  required
                  placeholder="Introduce el ID de tu sponsor (ej: topf-1, model-1)"
                  value={regSponsorId}
                  onChange={(e) => setRegSponsorId(e.target.value.trim())}
                  className="w-full bg-white border border-pink-200 rounded-xl p-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#ec4899] focus:ring-2 focus:ring-pink-200 font-mono text-xs shadow-2xs"
                />
              </div>

              {/* Verificación Dinámica */}
              {regSponsorId ? (
                matchedModel ? (
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs animate-fade-in shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
                    <span className="truncate">¡Sponsor Válido! <strong>{matchedModel.name}</strong></span>
                    {matchedModel.avatar && (
                      <div className="relative ml-auto shrink-0 mr-1">
                        <img
                          src={matchedModel.avatar}
                          alt={matchedModel.name}
                          className="w-7 h-7 rounded-full object-cover border-2 border-emerald-400"
                        />
                        <button
                          type="button"
                          onClick={() => setRegSponsorId('')}
                          className="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black border border-white cursor-pointer select-none transition-colors"
                          title="Eliminar patrocinador"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono animate-fade-in">
                    <span>⚠️</span>
                    <span className="truncate">ID verificado como referencia directa: <strong>{regSponsorId}</strong></span>
                  </div>
                )
              ) : null}
            </div>
            
            <p className="text-[10px] text-pink-800/80 leading-normal font-sans">
              ✨ En Fashion Finances todos los nuevos inversores y modelos se registran bajo un referidor calificado.
            </p>
          </div>

          {/* SECTION 7: Botones de Acción */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/3 bg-white hover:bg-pink-50 text-slate-700 hover:text-[#d9006c] font-bold text-xs py-3.5 px-4 rounded-2xl border-2 border-pink-200 hover:border-pink-300 transition cursor-pointer text-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-2/3 bg-gradient-to-r from-[#d9006c] via-[#ec4899] to-[#f43f8e] hover:from-[#c2005f] hover:to-[#d9006c] text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-pink-500/30 border-2 border-white/80 transition-all duration-200 hover:scale-[1.01] active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Registrarse y Empezar</span>
            </button>
          </div>

          {/* Footer Link to Direct Login */}
          <div className="text-center pt-2 border-t border-pink-100">
            <p className="text-xs text-slate-600 font-medium">
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="text-[#d9006c] font-black hover:underline hover:text-pink-700 cursor-pointer bg-transparent border-0 p-0 inline font-sans transition-colors"
              >
                Inicia sesión directamente ›
              </button>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
