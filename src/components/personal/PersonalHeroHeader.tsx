'use client';

import React from 'react';
import { Clock } from 'lucide-react';

interface PersonalHeroHeaderProps {
  onOpenRegistrarModal: () => void;
}

export function PersonalHeroHeader({ onOpenRegistrarModal }: PersonalHeroHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Asistencia del personal
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Control en tiempo real de los ingresos, salidas y turnos del personal.
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenRegistrarModal}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-blue-900/30 cursor-pointer self-start sm:self-auto"
      >
        <Clock className="w-4 h-4" />
        <span>Registrar asistencia</span>
      </button>
    </div>
  );
}
