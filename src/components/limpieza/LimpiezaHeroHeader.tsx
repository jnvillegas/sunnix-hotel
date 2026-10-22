'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface LimpiezaHeroHeaderProps {
  onOpenAsignarModal: () => void;
}

export function LimpiezaHeroHeader({ onOpenAsignarModal }: LimpiezaHeroHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Control de limpieza
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Organizá y hacé seguimiento de la limpieza de habitaciones en tiempo real.
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenAsignarModal}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-blue-900/30 cursor-pointer self-start sm:self-auto"
      >
        <Plus className="w-4 h-4" />
        <span>Asignar limpieza</span>
      </button>
    </div>
  );
}
