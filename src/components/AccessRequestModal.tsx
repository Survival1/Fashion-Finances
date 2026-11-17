import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, X } from 'lucide-react';

export interface MediaPermissionPreferences {
  camera: boolean;
  microphone: boolean;
}

const STORAGE_KEY_PERMS = 'ff_media_permissions';
const STORAGE_KEY_CONFIGURED = 'ff_media_permissions_configured';

export function getStoredMediaPermissions(): MediaPermissionPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PERMS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        camera: parsed?.camera !== false,
        microphone: parsed?.microphone !== false,
      };
    }
  } catch {
    // ignore storage errors
  }
  return { camera: true, microphone: true };
}

export function hasConfiguredMediaPermissions(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_CONFIGURED) === 'true';
  } catch {
    return false;
  }
}

export function saveMediaPermissions(prefs: MediaPermissionPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY_PERMS, JSON.stringify(prefs));
    localStorage.setItem(STORAGE_KEY_CONFIGURED, 'true');
  } catch {
    // ignore storage errors
  }
}

interface AccessRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCamera?: boolean;
  initialMicrophone?: boolean;
  isApplying?: boolean;
  onApply: (permissions: MediaPermissionPreferences) => void | Promise<void>;
}

export const AccessRequestModal: React.FC<AccessRequestModalProps> = ({
  isOpen,
  onClose,
  initialCamera,
  initialMicrophone,
  isApplying = false,
  onApply,
}) => {
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    const stored = getStoredMediaPermissions();
    setCameraEnabled(initialCamera !== undefined ? initialCamera : stored.camera);
    setMicrophoneEnabled(
      initialMicrophone !== undefined ? initialMicrophone : stored.microphone
    );
  }, [isOpen, initialCamera, initialMicrophone]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting && !isApplying) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, submitting, isApplying, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleConfirmApply = async () => {
    if (submitting || isApplying) return;
    const nextPrefs: MediaPermissionPreferences = {
      camera: cameraEnabled,
      microphone: microphoneEnabled,
    };
    saveMediaPermissions(nextPrefs);
    setSubmitting(true);
    try {
      await onApply(nextPrefs);
    } finally {
      setSubmitting(false);
    }
  };

  const busy = submitting || isApplying;

  const modalNode = (
    <div
      className="fixed inset-0 z-[3200] flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-sm animate-fade-in select-none"
      onClick={() => {
        if (!busy) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="access-request-title"
    >
      {/* Outer wrapper allowing the faceted pink diamond to overlap the top border */}
      <div
        className="relative w-full max-w-[540px] pt-8 sm:pt-9"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Center Overhanging Faceted Pink Diamond */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center"
          aria-hidden="true"
        >
          <img
            src="/assets/aistudio/pink_diamond_brilliant.png"
            alt=""
            className="w-[74px] sm:w-[86px] h-auto object-contain drop-shadow-[0_8px_16px_rgba(218,36,108,0.34)]"
          />
          <div
            className="w-20 h-3 -mt-2 rounded-full blur-[5px]"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(236,72,153,0.42) 0%, rgba(236,72,153,0) 75%)',
            }}
          />
        </div>

        {/* Main Pearlescent Pink-Silk & Gold Card */}
        <div
          className="relative overflow-hidden rounded-[26px] sm:rounded-[30px] border-[1.5px] border-[#DFB66C] shadow-[0_24px_64px_rgba(92,16,46,0.28),0_4px_18px_rgba(204,158,76,0.18),inset_0_1.5px_2px_rgba(255,255,255,0.95)]"
          style={{
            background:
              'radial-gradient(circle at 50% 42%, #FFFFFF 0%, #FFF9FB 46%, #FCEAF2 82%, #F8DCE8 100%)',
          }}
        >
          {/* Decorative Corner Silk Waves & Gold Trim SVG */}
          <svg
            viewBox="0 0 600 440"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="arTopLeftSilk" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F5A8C7" stopOpacity="0.58" />
                <stop offset="55%" stopColor="#FAD3E4" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="arBottomSilkMain" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#C41454" stopOpacity="0.92" />
                <stop offset="42%" stopColor="#E1467F" stopOpacity="0.72" />
                <stop offset="78%" stopColor="#F7BDD5" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="arGoldRibbon" x1="0" y1="0" x2="1" y2="0.4">
                <stop offset="0%" stopColor="#AF7E2A" />
                <stop offset="35%" stopColor="#F4DC9A" />
                <stop offset="68%" stopColor="#C89741" />
                <stop offset="100%" stopColor="#F6E5AF" />
              </linearGradient>
              <linearGradient id="arSoftSilkFold" x1="0" y1="0" x2="1" y2="0.5">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#F9CDE0" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Top-left delicate pink silk drape */}
            <path
              d="M0,0 L240,0 C175,38 92,72 0,136 Z"
              fill="url(#arTopLeftSilk)"
            />
            <path
              d="M0,74 C76,58 148,24 218,0"
              fill="none"
              stroke="url(#arSoftSilkFold)"
              strokeWidth="2.5"
            />
            <path
              d="M0,104 C56,78 104,42 156,0"
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.6"
              strokeWidth="1.4"
            />

            {/* Bottom-left rose & crimson silk drape with metallic gold ribbon */}
            <path
              d="M0,334 C66,382 146,416 266,440 L0,440 Z"
              fill="url(#arBottomSilkMain)"
            />
            <path
              d="M0,318 C78,370 176,408 320,440 L256,440 C138,412 58,378 0,342 Z"
              fill="url(#arGoldRibbon)"
              fillOpacity="0.88"
            />
            <path
              d="M0,308 C88,366 196,404 358,438"
              fill="none"
              stroke="#FFFFFF"
              strokeOpacity="0.75"
              strokeWidth="1.8"
            />
          </svg>

          {/* Top-Right Circular Gold-Rimmed Close Button */}
          <button
            type="button"
            onClick={() => {
              if (!busy) onClose();
            }}
            aria-label="Close access request"
            className="custom-bg absolute top-4 right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-[1.5px] border-[#D8AC59] bg-gradient-to-b from-[#FFFFFF] via-[#FFF8FA] to-[#F7E5EC] hover:from-[#FFF0F6] hover:to-[#F3D3E0] text-[#1A1316] flex items-center justify-center shadow-[0_3px_10px_rgba(140,92,45,0.16),inset_0_1px_1px_rgba(255,255,255,0.95)] transition cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2]" />
          </button>

          {/* Card Content */}
          <div className="relative z-10 px-6 sm:px-9 pt-10 sm:pt-11 pb-7 sm:pb-8 text-center">
            {/* Editorial Serif Heading */}
            <h2
              id="access-request-title"
              className="font-serif text-[32px] sm:text-[41px] font-normal text-[#151013] leading-[1.1] tracking-tight"
            >
              Access request
            </h2>

            {/* Thin Gold Underline Accent */}
            <div
              className="w-32 sm:w-36 h-[1.5px] mx-auto mt-2 mb-3.5"
              style={{
                background:
                  'linear-gradient(90deg, rgba(207,160,76,0) 0%, #CFA04C 20%, #E7CA88 50%, #CFA04C 80%, rgba(207,160,76,0) 100%)',
              }}
            />

            {/* Subtitle */}
            <p className="text-[14px] sm:text-[15.5px] text-[#282024] font-normal leading-snug mb-6">
              The app requests access to the following permissions:
            </p>

            {/* Permission Controls List */}
            <div className="space-y-3.5">
              {/* Row 1: Camera */}
              <div className="rounded-full border-[1.5px] border-[#D7AB5A] bg-gradient-to-b from-[#FFFFFF] via-[#FFFDFD] to-[#FDF1F6] shadow-[0_4px_14px_rgba(165,115,65,0.09),inset_0_1px_1.5px_rgba(255,255,255,0.98)] px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center min-w-0">
                  {/* Gold-Rimmed Camera Lens Medallion SVG */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full shrink-0 shadow-[0_2px_8px_rgba(145,98,38,0.28)]">
                    <svg
                      viewBox="0 0 64 64"
                      className="w-full h-full"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="camGoldBezel" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#F8E7B4" />
                          <stop offset="35%" stopColor="#D3A24C" />
                          <stop offset="70%" stopColor="#9A6D22" />
                          <stop offset="100%" stopColor="#E9CC87" />
                        </linearGradient>
                        <radialGradient id="camLensCore" cx="42%" cy="38%" r="58%">
                          <stop offset="0%" stopColor="#8F4C7C" />
                          <stop offset="32%" stopColor="#3B1D39" />
                          <stop offset="68%" stopColor="#120E18" />
                          <stop offset="100%" stopColor="#050408" />
                        </radialGradient>
                      </defs>
                      <circle cx="32" cy="32" r="30.5" fill="url(#camGoldBezel)" />
                      <circle cx="32" cy="32" r="27" fill="#1C1922" />
                      <circle
                        cx="32"
                        cy="32"
                        r="24"
                        fill="none"
                        stroke="#443E4E"
                        strokeWidth="1.2"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="20.5"
                        fill="none"
                        stroke="#2B2635"
                        strokeWidth="1.8"
                      />
                      <circle cx="32" cy="32" r="16.5" fill="url(#camLensCore)" />
                      <circle
                        cx="32"
                        cy="32"
                        r="8.5"
                        fill="#0A0810"
                        stroke="#6C3B64"
                        strokeOpacity="0.65"
                        strokeWidth="1"
                      />
                      <ellipse
                        cx="26"
                        cy="24"
                        rx="4.2"
                        ry="2.2"
                        transform="rotate(-28 26 24)"
                        fill="#FFFFFF"
                        fillOpacity="0.72"
                      />
                      <circle cx="37" cy="37" r="2.2" fill="#E880B8" fillOpacity="0.55" />
                    </svg>
                  </div>

                  {/* Vertical Gold Divider */}
                  <div className="w-[1px] h-7 bg-[#CFA24F]/75 mx-3.5 shrink-0" />

                  <span className="font-serif text-[19px] sm:text-[22px] text-[#1A1417] tracking-tight truncate">
                    Camera
                  </span>
                </div>

                {/* Crimson/Rose Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={cameraEnabled}
                  aria-label="Toggle Camera permission"
                  onClick={() => setCameraEnabled((prev) => !prev)}
                  className={`custom-bg relative w-[60px] h-[32px] rounded-full p-[3px] transition-all duration-200 cursor-pointer shrink-0 flex items-center ${
                    cameraEnabled
                      ? 'bg-gradient-to-r from-[#E41F66] via-[#C30D50] to-[#98063B] shadow-[0_3px_12px_rgba(195,13,80,0.38),inset_0_1px_2px_rgba(255,180,210,0.45)] border border-[#D42366]/65'
                      : 'bg-gradient-to-r from-[#E4D5DC] to-[#CDBAC3] shadow-inner border border-[#C6B1BC]'
                  }`}
                >
                  <span
                    className={`w-[24px] h-[24px] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.22)] transition-transform duration-200 ${
                      cameraEnabled ? 'translate-x-[28px]' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Row 2: Microphone */}
              <div className="rounded-full border-[1.5px] border-[#D7AB5A] bg-gradient-to-b from-[#FFFFFF] via-[#FFFDFD] to-[#FDF1F6] shadow-[0_4px_14px_rgba(165,115,65,0.09),inset_0_1px_1.5px_rgba(255,255,255,0.98)] px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center min-w-0">
                  {/* Gold-Rimmed Vintage Studio Microphone Medallion SVG */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full shrink-0 shadow-[0_2px_8px_rgba(145,98,38,0.26)]">
                    <svg
                      viewBox="0 0 64 64"
                      className="w-full h-full"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="micGoldRing" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#F9E8B7" />
                          <stop offset="40%" stopColor="#D4A34D" />
                          <stop offset="75%" stopColor="#9A6D22" />
                          <stop offset="100%" stopColor="#E9CD89" />
                        </linearGradient>
                        <radialGradient id="micPearlBg" cx="45%" cy="40%" r="60%">
                          <stop offset="0%" stopColor="#FFFDF9" />
                          <stop offset="65%" stopColor="#F6E8D8" />
                          <stop offset="100%" stopColor="#DFC6A6" />
                        </radialGradient>
                        <linearGradient id="micMetal" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6D5E52" />
                          <stop offset="35%" stopColor="#D7CCB8" />
                          <stop offset="65%" stopColor="#8B7B6B" />
                          <stop offset="100%" stopColor="#4B3E35" />
                        </linearGradient>
                      </defs>
                      <circle cx="32" cy="32" r="30.5" fill="url(#micGoldRing)" />
                      <circle cx="32" cy="32" r="27" fill="url(#micPearlBg)" />
                      {/* Capsule body */}
                      <rect
                        x="25.5"
                        y="14"
                        width="13"
                        height="20"
                        rx="6.5"
                        fill="url(#micMetal)"
                        stroke="#493B31"
                        strokeWidth="1.1"
                      />
                      {/* Grille ribs */}
                      <line x1="27.5" y1="19" x2="36.5" y2="19" stroke="#3F332B" strokeWidth="1" />
                      <line x1="27.5" y1="22.5" x2="36.5" y2="22.5" stroke="#3F332B" strokeWidth="1" />
                      <line x1="27.5" y1="26" x2="36.5" y2="26" stroke="#3F332B" strokeWidth="1" />
                      {/* U-Bracket */}
                      <path
                        d="M21,28 C21,36.5 26,41 32,41 C38,41 43,36.5 43,28"
                        fill="none"
                        stroke="#4D3E33"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                      />
                      {/* Stand & base */}
                      <line
                        x1="32"
                        y1="41"
                        x2="32"
                        y2="49"
                        stroke="#4D3E33"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      />
                      <line
                        x1="24.5"
                        y1="49"
                        x2="39.5"
                        y2="49"
                        stroke="#4D3E33"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Vertical Gold Divider */}
                  <div className="w-[1px] h-7 bg-[#CFA24F]/75 mx-3.5 shrink-0" />

                  <span className="font-serif text-[19px] sm:text-[22px] text-[#1A1417] tracking-tight truncate">
                    Microphone
                  </span>
                </div>

                {/* Crimson/Rose Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={microphoneEnabled}
                  aria-label="Toggle Microphone permission"
                  onClick={() => setMicrophoneEnabled((prev) => !prev)}
                  className={`custom-bg relative w-[60px] h-[32px] rounded-full p-[3px] transition-all duration-200 cursor-pointer shrink-0 flex items-center ${
                    microphoneEnabled
                      ? 'bg-gradient-to-r from-[#E41F66] via-[#C30D50] to-[#98063B] shadow-[0_3px_12px_rgba(195,13,80,0.38),inset_0_1px_2px_rgba(255,180,210,0.45)] border border-[#D42366]/65'
                      : 'bg-gradient-to-r from-[#E4D5DC] to-[#CDBAC3] shadow-inner border border-[#C6B1BC]'
                  }`}
                >
                  <span
                    className={`w-[24px] h-[24px] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.22)] transition-transform duration-200 ${
                      microphoneEnabled ? 'translate-x-[28px]' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Bottom Hairline Divider Centered on Champagne Diamond */}
            <div className="flex items-center gap-3 mt-6 mb-5 px-2" aria-hidden="true">
              <div
                className="flex-1 h-[1px]"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(207,162,80,0) 0%, rgba(207,162,80,0.85) 100%)',
                }}
              />
              <svg viewBox="0 0 28 24" className="w-5 h-4.5 shrink-0 drop-shadow-xs">
                <defs>
                  <linearGradient id="champagneGem" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFF5DF" />
                    <stop offset="45%" stopColor="#DFB170" />
                    <stop offset="100%" stopColor="#9E6C32" />
                  </linearGradient>
                </defs>
                <polygon
                  points="6,2 22,2 27,8 14,22 1,8"
                  fill="url(#champagneGem)"
                  stroke="#9C6B30"
                  strokeWidth="0.9"
                />
                <polygon
                  points="6,2 22,2 19,8 9,8"
                  fill="#FFF9EB"
                  fillOpacity="0.65"
                />
                <polyline
                  points="1,8 27,8"
                  fill="none"
                  stroke="#9C6B30"
                  strokeWidth="0.7"
                />
                <polyline
                  points="9,8 14,22 19,8"
                  fill="none"
                  stroke="#9C6B30"
                  strokeWidth="0.7"
                />
              </svg>
              <div
                className="flex-1 h-[1px]"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(207,162,80,0.85) 0%, rgba(207,162,80,0) 100%)',
                }}
              />
            </div>

            {/* Bottom-Right Primary Glossy Magenta CTA Button */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                disabled={busy}
                onClick={handleConfirmApply}
                className="custom-bg inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-full font-serif text-[19px] sm:text-[21px] leading-none text-white bg-gradient-to-b from-[#EB2A72] via-[#C60E53] to-[#94053B] hover:from-[#F2377D] hover:via-[#D1135A] hover:to-[#A10942] border border-[#F5B2CA]/75 shadow-[0_6px_18px_rgba(176,12,75,0.42),inset_0_1.5px_1.5px_rgba(255,255,255,0.58)] transition cursor-pointer active:scale-[0.98] disabled:opacity-60"
              >
                <span>{busy ? 'Applying...' : 'Apply'}</span>
                <ChevronRight className="w-4.5 h-4.5 stroke-[2.2]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};

export default AccessRequestModal;
