'use client';

import React from 'react';
import Link from 'next/link';
import { BedDouble, Wallet, Sparkles, Plus, Calendar } from 'lucide-react';

export function ExecutiveHeroHeader() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Centro de control general
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            VISIÓN 360°
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Supervisión integral en tiempo real: ocupación, recaudación de turno, alertas operativas y personal.
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
        <Link
          href="/dashboard/habitaciones"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-blue-900/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar estadía</span>
        </Link>

        <Link
          href="/dashboard/turnos"
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0c142b] border border-[#1e293b] hover:border-slate-600 text-zinc-300 hover:text-white font-medium text-xs sm:text-sm transition-all cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>Reservas</span>
        </Link>

        <Link
          href="/dashboard/caja"
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0c142b] border border-[#1e293b] hover:border-slate-600 text-zinc-300 hover:text-white font-medium text-xs sm:text-sm transition-all cursor-pointer"
        >
          <Wallet className="w-4 h-4 text-emerald-400" />
          <span>Caja turno</span>
        </Link>

        <Link
          href="/dashboard/limpieza"
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0c142b] border border-[#1e293b] hover:border-slate-600 text-zinc-300 hover:text-white font-medium text-xs sm:text-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Limpieza</span>
        </Link>
      </div>
    </div>
  );
}
