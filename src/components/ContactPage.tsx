import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowLeft,
  MessageSquare,
  AlertCircle,
  User,
  Briefcase,
  Phone,
  Headphones,
  MessageSquareMore,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { UserSessionProfile } from '../types';
import FashionsFinanceLogo from './FashionsFinanceLogo';

export interface ContactSubmission {
  id: string;
  referenceCode: string;
  name: string;
  email: string;
  handleOrPhone?: string;
  department: string;
  subject: string;
  message: string;
  userId?: string;
  createdAt: string;
}

interface ContactPageProps {
  userProfile?: UserSessionProfile | null;
  onBack?: () => void;
}

const STORAGE_KEY = 'ff_contact_messages';

const DEPARTMENTS = [
  'Soporte General y Cuenta',
  'Inversiones, Rondas y Cartera',
  'Patrocinios y Modelos',
  'Founders Package (The First 100)',
  'Prensa, Marcas y Alianzas',
  'Facturación y Retiros',
];

const PinkFacetedDiamond = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg
    viewBox="0 0 64 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M14 4H50L61 20L32 52L3 20L14 4Z"
      stroke="#e11d74"
      strokeWidth="3.2"
      strokeLinejoin="round"
    />
    <path d="M3 20H61" stroke="#e11d74" strokeWidth="2.8" strokeLinecap="round" />
    <path
      d="M14 4L21 20L32 52L43 20L50 4"
      stroke="#e11d74"
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
    <path d="M21 20L32 4L43 20" stroke="#e11d74" strokeWidth="2.6" strokeLinejoin="round" />
  </svg>
);

export default function ContactPage({ userProfile, onBack }: ContactPageProps) {
  const [name, setName] = useState(
    userProfile?.name
      ? `${userProfile.name}${userProfile.lastName ? ` ${userProfile.lastName}` : ''}`.trim()
      : ''
  );
  const [email, setEmail] = useState(userProfile?.email || '');
  const [handleOrPhone, setHandleOrPhone] = useState(
    userProfile?.username ? `@${userProfile.username}` : userProfile?.telefono || ''
  );
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<ContactSubmission | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [recentMessages, setRecentMessages] = useState<ContactSubmission[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const raf = requestAnimationFrame(() => {
        document.getElementById('contact-page-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, []);

  useEffect(() => {
    if (userProfile) {
      setName((prev) =>
        prev ||
        `${userProfile.name || ''}${userProfile.lastName ? ` ${userProfile.lastName}` : ''}`.trim()
      );
      setEmail((prev) => prev || userProfile.email || '');
      setHandleOrPhone((prev) =>
        prev || (userProfile.username ? `@${userProfile.username}` : userProfile.telefono || '')
      );
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setErrorMsg('Por favor, introduce tu nombre completo.');
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMsg('Por favor, introduce un correo electrónico válido.');
      return;
    }
    if (!trimmedSubject) {
      setErrorMsg('Por favor, indica el asunto de tu consulta.');
      return;
    }
    if (trimmedMessage.length < 10) {
      setErrorMsg('Por favor, escribe un mensaje de al menos 10 caracteres para poder ayudarte mejor.');
      return;
    }

    setIsSubmitting(true);

    const referenceCode = `FF-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRecord: ContactSubmission = {
      id: `contact-${Date.now()}`,
      referenceCode,
      name: trimmedName,
      email: trimmedEmail,
      handleOrPhone: handleOrPhone.trim() || undefined,
      department,
      subject: trimmedSubject,
      message: trimmedMessage,
      userId: userProfile?.id,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });
      if (!res.ok) {
        console.warn('[ContactPage] Server returned non-OK, keeping local copy');
      }
    } catch {
      // Fallback gracefully to local persistence if offline or server unreachable
    }

    const updatedHistory = [newRecord, ...recentMessages].slice(0, 10);
    setRecentMessages(updatedHistory);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch {
      // ignore storage quota errors
    }

    setIsSubmitting(false);
    setSubmittedRecord(newRecord);
    setSubject('');
    setMessage('');
  };

  const handleWriteAnother = () => {
    setSubmittedRecord(null);
    setErrorMsg(null);
  };

  return (
    <div
      id="contact-page-container"
      className="w-full max-w-4xl mx-auto rounded-[32px] overflow-hidden relative bg-gradient-to-b from-[#fff7fa] via-[#ffffff] to-[#ffe6f0] border border-pink-100/90 shadow-[0_20px_60px_-20px_rgba(219,22,108,0.14)] animate-fade-in mb-10"
    >
      {/* Decorative soft silk rose glows */}
      <div
        className="pointer-events-none absolute -top-16 -right-12 w-96 h-96 rounded-full opacity-55 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(255,182,217,0.6) 0%, rgba(255,255,255,0) 70%)' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 inset-x-0 h-32 opacity-75"
        style={{
          background:
            'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(255,196,225,0.55) 0%, rgba(255,255,255,0) 75%)',
        }}
      />

      {/* TOP LUXURY HERO HEADER */}
      <div className="relative px-5 sm:px-9 pt-5 sm:pt-7 pb-6 sm:pb-8 overflow-hidden">
        {/* Background Fashion Model Portrait anchored right */}
        <div className="hidden sm:block pointer-events-none select-none absolute top-0 right-16 md:right-24 h-full max-h-[260px] z-0">
          <img
            src="/assets/aistudio/contact_header_male_model.webp"
            alt="Atención al Cliente Fashion Finances"
            referrerPolicy="no-referrer"
            className="h-full w-auto object-contain object-top opacity-95"
          />
        </div>

        {/* Top navigation row: Volver + Soporte Activo */}
        <div className="relative z-10 flex items-start justify-between gap-3 mb-4 sm:mb-5">
          <div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-sm font-serif font-bold text-slate-900 hover:text-[#db166c] transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>
            )}
          </div>

          <div className="flex flex-col items-end text-right shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#e9faef] border border-[#b4e8c7] text-[#15803d] text-[11px] font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span>Soporte Activo</span>
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="relative z-10 max-w-md sm:max-w-[56%] space-y-4">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#fff0f6]/90 border border-pink-300/75 flex items-center justify-center text-[#e11d74] shrink-0 shadow-2xs">
              <Mail className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
            </div>
            <div>
              <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.16em] text-[#db166c]">
                Fashion Finances · Atención Directa
              </p>
              <h1 className="font-serif font-black text-3xl sm:text-[44px] text-slate-950 tracking-tight leading-[1.02] mt-0.5">
                Contacto
              </h1>
              <div className="h-[2px] w-20 bg-gradient-to-r from-[#d4a853] to-[#f0d590] rounded-full mt-2" />
            </div>
          </div>

          <p className="text-xs sm:text-[13.5px] text-slate-800 leading-relaxed font-normal max-w-[410px]">
            ¿Tienes alguna consulta sobre inversiones, rondas, patrocinios o tu cuenta? Escríbenos a través del formulario y nuestro equipo especializado te responderá a la mayor brevedad.
          </p>
        </div>
      </div>

      {/* CENTRAL ELEVATED WHITE FORM CARD */}
      <div className="relative z-10 px-4 sm:px-8">
        <div className="bg-white/95 backdrop-blur-md border border-pink-200/80 rounded-[26px] p-5 sm:p-8 shadow-[0_14px_45px_-12px_rgba(225,29,116,0.14)]">
          {submittedRecord ? (
            <div className="py-6 text-center space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <span className="inline-block px-3.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-[#db166c] text-[11px] font-black tracking-wider uppercase">
                  Ticket {submittedRecord.referenceCode}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-black text-slate-950">
                  ¡Mensaje enviado correctamente!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Gracias por escribirnos, <span className="font-bold text-slate-900">{submittedRecord.name}</span>. Hemos recibido tu consulta en{' '}
                  <span className="font-semibold text-[#db166c]">{submittedRecord.department}</span> y te responderemos a{' '}
                  <span className="font-semibold text-slate-900">{submittedRecord.email}</span>.
                </p>
              </div>

              <div className="bg-pink-50/40 border border-pink-100 rounded-2xl p-4 text-left max-w-lg mx-auto space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Resumen de tu consulta
                </p>
                <p className="text-xs font-bold text-slate-900">{submittedRecord.subject}</p>
                <p className="text-xs text-slate-600 whitespace-pre-line line-clamp-4">
                  {submittedRecord.message}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleWriteAnother}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#ff2e88] via-[#e91e78] to-[#cf1164] hover:from-[#ff4093] hover:to-[#b80e58] text-white text-xs font-bold tracking-wide transition-all shadow-[0_8px_20px_-4px_rgba(233,30,120,0.45)] cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enviar otro mensaje</span>
                </button>
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-pink-200 hover:border-pink-300 text-slate-800 text-xs font-bold tracking-wide transition-all cursor-pointer"
                  >
                    <span>Volver a la plataforma</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
              {/* Card Title Row with gold hairline & pink diamond */}
              <div className="flex items-start justify-between gap-4 pb-1">
                <div>
                  <h2 className="font-serif font-black text-2xl sm:text-[28px] text-slate-950 tracking-tight leading-tight">
                    Envíanos un mensaje
                  </h2>
                  <div className="h-[2px] w-16 bg-gradient-to-r from-[#d4a853] to-[#f0d590] rounded-full mt-1" />
                  <p className="text-xs text-slate-600 mt-1.5">
                    Los campos marcados con * son obligatorios.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-1">
                  <div className="hidden sm:block w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4a853]/70 to-[#d4a853]" />
                  <PinkFacetedDiamond className="w-8 h-7 sm:w-9 sm:h-8" />
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-name"
                    className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-900"
                  >
                    <User className="w-3.5 h-3.5 text-[#e11d74] shrink-0" />
                    <span>Nombre completo *</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Adriana Lima"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200/90 focus:border-[#e11d74] focus:ring-2 focus:ring-pink-500/15 outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all shadow-2xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-email"
                    className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-900"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#e11d74] shrink-0" />
                    <span>Correo electrónico *</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200/90 focus:border-[#e11d74] focus:ring-2 focus:ring-pink-500/15 outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-department"
                    className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-900"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-[#e11d74] shrink-0" />
                    <span>Departamento *</span>
                  </label>
                  <select
                    id="contact-department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200/90 focus:border-[#e11d74] focus:ring-2 focus:ring-pink-500/15 outline-none text-xs sm:text-sm text-slate-900 font-medium transition-all shadow-2xs cursor-pointer"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-handle"
                    className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-900"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#e11d74] shrink-0" />
                    <span>Usuario o teléfono (opcional)</span>
                  </label>
                  <input
                    id="contact-handle"
                    type="text"
                    value={handleOrPhone}
                    onChange={(e) => setHandleOrPhone(e.target.value)}
                    placeholder="@usuario o +34 600 000 000"
                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200/90 focus:border-[#e11d74] focus:ring-2 focus:ring-pink-500/15 outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="space-y-1.5">
                <label
                  htmlFor="contact-subject"
                  className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-900"
                >
                  <Headphones className="w-3.5 h-3.5 text-[#e11d74] shrink-0" />
                  <span>Asunto *</span>
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  maxLength={140}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Resumen breve de tu consulta"
                  className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-200/90 focus:border-[#e11d74] focus:ring-2 focus:ring-pink-500/15 outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all shadow-2xs"
                />
              </div>

              {/* Row 4 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="contact-message"
                    className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-900"
                  >
                    <MessageSquareMore className="w-3.5 h-3.5 text-[#e11d74] shrink-0" />
                    <span>Mensaje *</span>
                  </label>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {message.length} / 2000
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  maxLength={2000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Cuéntanos en detalle cómo podemos ayudarte..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200/90 focus:border-[#e11d74] focus:ring-2 focus:ring-pink-500/15 outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all resize-y min-h-[115px] shadow-2xs"
                />
              </div>

              {/* Centered Pink Pill Submit Button */}
              <div className="pt-2 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="btn-submit-contact-form"
                  className="inline-flex items-center justify-center gap-2.5 px-10 py-3.5 rounded-full bg-gradient-to-r from-[#ff2e88] via-[#e91e78] to-[#cf1164] hover:from-[#ff4093] hover:to-[#b80e58] disabled:opacity-60 text-white text-sm font-bold tracking-wide transition-all shadow-[0_12px_28px_-6px_rgba(233,30,120,0.48)] hover:shadow-[0_14px_30px_-5px_rgba(233,30,120,0.58)] active:scale-[0.98] cursor-pointer"
                >
                  <Send className="w-4 h-4 fill-white/15" />
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar mensaje'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* BOTTOM TRUST HIGHLIGHTS + GOLD DIAMOND DIVIDER */}
      <div className="relative z-10 px-6 sm:px-10 pt-7 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-0 sm:divide-x sm:divide-[#d4a853]/45">
          <div className="flex items-center justify-start sm:justify-center gap-3 sm:px-4">
            <ShieldCheck className="w-8 h-8 text-[#e11d74] stroke-[1.8] shrink-0" />
            <div className="text-left">
              <p className="font-serif font-bold text-sm text-slate-950 leading-tight">
                Privacidad
              </p>
              <p className="text-[11.5px] text-slate-700 mt-0.5">
                Tus datos están protegidos.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-start sm:justify-center gap-3 sm:px-4">
            <Clock className="w-8 h-8 text-[#e11d74] stroke-[1.8] shrink-0" />
            <div className="text-left">
              <p className="font-serif font-bold text-sm text-slate-950 leading-tight">
                Respuesta rápida
              </p>
              <p className="text-[11.5px] text-slate-700 mt-0.5">
                Atención ágil y prioritaria.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-start sm:justify-center gap-3 sm:px-4">
            <Headphones className="w-8 h-8 text-[#e11d74] stroke-[1.8] shrink-0" />
            <div className="text-left">
              <p className="font-serif font-bold text-sm text-slate-950 leading-tight">
                Atención directa
              </p>
              <p className="text-[11.5px] text-slate-700 mt-0.5">
                Equipo especializado.
              </p>
            </div>
          </div>
        </div>

        {/* Center Diamond + Gold Lines Divider */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-[1px] flex-1 max-w-[220px] bg-gradient-to-r from-transparent to-[#d4a853]/75" />
          <PinkFacetedDiamond className="w-6 h-5 shrink-0" />
          <div className="h-[1px] flex-1 max-w-[220px] bg-gradient-to-l from-transparent to-[#d4a853]/75" />
        </div>

        {/* Optional collapsible recent inquiries badge so sent messages stay accessible cleanly */}
        {recentMessages.length > 0 && (
          <div className="mt-4 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-pink-200/80 text-[11px] font-bold text-slate-700 hover:text-[#db166c] transition cursor-pointer shadow-2xs"
            >
              <span>Consultas enviadas ({recentMessages.length})</span>
              {showHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showHistory && (
              <div className="mt-3 w-full max-w-2xl bg-white/90 border border-pink-100 rounded-2xl p-4 space-y-2 shadow-sm">
                {recentMessages.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-pink-50/40 border border-pink-100/80 text-left"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-[#db166c] uppercase tracking-wider">
                          {item.referenceCode}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate">{item.department}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 truncate">{item.subject}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(item.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Brand Footer Lockup matching image.png */}
        <footer className="mt-6 pt-5 border-t border-pink-200/60 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 select-none px-4 py-2 rounded-2xl bg-white/85 backdrop-blur-xs border border-pink-100/80 shadow-2xs">
            <FashionsFinanceLogo
              mode="light"
              className="w-10 h-10 sm:w-11 sm:h-11 bg-white !border-slate-800/80 shadow-2xs"
            />
            <div className="leading-none text-left">
              <span className="font-display font-semibold text-base sm:text-lg text-slate-950 leading-tight block">
                Fashion Finances
              </span>
              <p className="text-[9px] sm:text-[10px] text-slate-400 tracking-widest uppercase mt-0.5">
                Casting Live &amp; Fashion Models
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
