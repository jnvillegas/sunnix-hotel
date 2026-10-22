'use client';

import React from 'react';
import { History } from 'lucide-react';
import Link from 'next/link';

export function CajaTurnoHeroHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Cierres de caja por turno
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Controlá los ingresos, egresos y cierres de cada turno. Toda la información clara y segura.
        </p>
      </div>

      <Link
        href="/dashboard/auditoria"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0c142b] border border-[#1e293b] hover:bg-slate-800 text-zinc-300 hover:text-white font-semibold text-xs sm:text-sm transition-all shadow-sm cursor-pointer self-start sm:self-auto"
      >
        <History className="w-4 h-4 text-zinc-400" />
        <span>Historial de cierres</span>
      </Link>
    </div>
  );
}
