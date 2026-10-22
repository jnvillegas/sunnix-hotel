'use client';

import React from 'react';
import { Plus, Download } from 'lucide-react';

interface IngresosEgresosHeroHeaderProps {
  onOpenNuevoMovimiento: () => void;
  onExportCSV: () => void;
}

export function IngresosEgresosHeroHeader({
  onOpenNuevoMovimiento,
  onExportCSV,
}: IngresosEgresosHeroHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Ingresos y egresos
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Control financiero integral, flujo de caja y libro mayor de tesorería en tiempo real.
        </p>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        <button
          type="button"
          onClick={onExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0c142b] border border-[#1e293b] hover:border-slate-600 text-zinc-300 hover:text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-zinc-400" />
          <span>Exportar libro</span>
        </button>

        <button
          type="button"
          onClick={onOpenNuevoMovimiento}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-blue-900/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar movimiento</span>
        </button>
      </div>
    </div>
  );
}
