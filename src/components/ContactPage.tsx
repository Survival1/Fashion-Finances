import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { UserSessionProfile } from '../types';

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
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in" id="contact-page-container">
      {/* Editorial Header */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-pink-100/60 via-rose-50/30 to-transparent rounded-bl-full pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-pink-600 transition-colors mb-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver</span>
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600 shadow-2xs">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-pink-600">
                  Fashion Finances · Atención Directa
                </p>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  Contacto
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed pt-1">
              ¿Tienes alguna consulta sobre inversiones, rondas, patrocinios o tu cuenta? Escríbenos a través del formulario y nuestro equipo especializado te responderá a la mayor brevedad.
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-end text-right shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Soporte Activo</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium mt-1.5">
              Respuesta habitual &lt; 24 h
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Card */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
          {submittedRecord ? (
            <div className="py-6 text-center space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <span className="inline-block px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-[11px] font-black tracking-wider uppercase">
                  Ticket {submittedRecord.referenceCode}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                  ¡Mensaje enviado correctamente!
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Gracias por escribirnos, <span className="font-bold text-slate-900">{submittedRecord.name}</span>. Hemos recibido tu consulta en el departamento de{' '}
                  <span className="font-semibold text-pink-600">{submittedRecord.department}</span> y te responderemos en{' '}
                  <span className="font-semibold text-slate-900">{submittedRecord.email}</span>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left max-w-lg mx-auto space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Resumen de tu mensaje
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
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-950 hover:bg-pink-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enviar otro mensaje</span>
                </button>
                {onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <span>Volver a la plataforma</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-950">
                    Envíanos un mensaje
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Los campos marcados con * son obligatorios.
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-pink-500 shrink-0" />
              </div>

              {errorMsg && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                    Nombre completo *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Laura Gómez"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/15 outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                    Correo electrónico *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/15 outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-department" className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                    Departamento *
                  </label>
                  <select
                    id="contact-department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/15 outline-none text-xs sm:text-sm text-slate-900 font-medium transition-all"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-handle" className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                    Usuario o teléfono (opcional)
                  </label>
                  <input
                    id="contact-handle"
                    type="text"
                    value={handleOrPhone}
                    onChange={(e) => setHandleOrPhone(e.target.value)}
                    placeholder="@usuario o +34 600 000 000"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/15 outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                  Asunto *
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  maxLength={140}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Resumen breve de tu consulta"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/15 outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="contact-message" className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                    Mensaje *
                  </label>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {message.length} / 2000
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  maxLength={2000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Cuéntanos en detalle cómo podemos ayudarte..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-200 focus:bg-white focus:border-pink-500 focus:ring-2 focus:ring-pink-500/15 outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all resize-y min-h-[130px]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tus datos se tratan de forma confidencial.</span>
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="btn-submit-contact-form"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-950 hover:bg-pink-600 disabled:opacity-60 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-pink-500/20 active:scale-[0.99] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Side Info & Recent Inquiries */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-pink-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">
              Canales de Atención
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900">Correo Oficial</p>
                  <p className="text-xs text-slate-600 break-all">contacto@fashionfinances.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900">Horario de Respuesta</p>
                  <p className="text-xs text-slate-600">Lunes a Viernes · 09:00 – 20:00 CET</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900">Sedes Internacionales</p>
                  <p className="text-xs text-slate-600">Madrid · París · Milán · Nueva York</p>
                </div>
              </div>
            </div>
          </div>

          {recentMessages.length > 0 && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">
                  Tus Consultas Enviadas
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100">
                  {recentMessages.length}
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {recentMessages.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black text-pink-600 uppercase tracking-wider">
                        {item.referenceCode}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate">{item.subject}</p>
                    <p className="text-[11px] text-slate-500 truncate">{item.department}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
