/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award } from 'lucide-react';

interface FoundingModelBadgeProps {
  founderNumber: string; // e.g. '001'
  variant?: 'inline' | 'card' | 'seal';
  className?: string;
}

export default function FoundingModelBadge({
  founderNumber,
  variant = 'inline',
  className = ''
}: FoundingModelBadgeProps) {
  const padded = founderNumber.padStart(3, '0');

  if (variant === 'card') {
    return (
      <div
        className={`relative overflow-hidden border border-[#f9a8d4] bg-gradient-to-br from-white via-[#fdf2f8] to-[#fce7f3] px-5 py-4 shadow-xs text-left select-none ${className}`}
        title={`Miembro Fundador Oficial #${padded} · Los Primeros 100`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-white border border-[#f472b6] flex items-center justify-center shrink-0 shadow-2xs">
              <Award className="w-5 h-5 text-[#e11d48] stroke-[1.75]" />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9d174d]">
                FASHION FINANCES
              </div>
              <div className="font-serif text-base font-bold tracking-wider text-slate-900 leading-tight mt-0.5">
                MODELO FUNDADOR
              </div>
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600 mt-0.5">
                LOS PRIMEROS 100
              </div>
            </div>
          </div>

          <div className="text-right shrink-0 border-l border-[#f9a8d4]/70 pl-4">
            <span className="block text-[9px] uppercase tracking-[0.2em] text-[#9d174d] font-semibold">
              Posición Oficial
            </span>
            <span className="font-serif text-2xl font-bold text-slate-900 tabular-nums leading-none">
              #{padded}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'seal') {
    return (
      <div
        className={`inline-flex flex-col items-center justify-center border border-[#f472b6] bg-gradient-to-b from-white via-[#fdf2f8] to-[#fce7f3] px-4 py-3 text-center select-none ${className}`}
      >
        <span className="text-[8.5px] font-semibold uppercase tracking-[0.26em] text-[#9d174d]">
          FASHION FINANCES
        </span>
        <div className="flex items-center gap-1.5 my-1">
          <Award className="w-3.5 h-3.5 text-[#e11d48] stroke-[2]" />
          <span className="font-serif text-xs font-bold tracking-[0.14em] text-slate-900">
            MODELO FUNDADOR
          </span>
        </div>
        <span className="text-[8.5px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          LOS PRIMEROS 100 · <span className="tabular-nums text-[#831843]">#{padded}</span>
        </span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-[#f472b6]/90 bg-gradient-to-r from-[#fff1f5] via-[#fce7f3] to-white text-[#831843] text-[10px] font-semibold tracking-wider select-none whitespace-nowrap ${className}`}
      title={`FASHION FINANCES · MODELO FUNDADOR · LOS PRIMEROS 100 (#${padded})`}
    >
      <Award className="w-3 h-3 text-[#e11d48] stroke-[2] shrink-0" />
      <span className="uppercase tracking-[0.12em] font-bold">MODELO FUNDADOR</span>
      <span className="text-[#f472b6]" aria-hidden="true">·</span>
      <span className="tabular-nums font-bold text-slate-900">#{padded}</span>
    </span>
  );
}
