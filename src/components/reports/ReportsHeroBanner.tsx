'use client';

import React from 'react';
import { Search, Calendar, ChevronDown, Download } from 'lucide-react';

interface ReportsHeroBannerProps {
  fechaRango: string;
  onExport: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  turnoFiltro: string;
  onTurnoChange: (val: string) => void;
}

export function ReportsHeroBanner({
  fechaRango,
  onExport,
  searchQuery,
  onSearchChange,
  turnoFiltro,
  onTurnoChange,
}: ReportsHeroBannerProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#0c142b] border border-[#1e293b] p-6 shadow-xl flex flex-col justify-between min-h-[140px]">
      {/* Background Suite Photo on the right with dark gradient blending */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-2/5 bg-cover bg-center pointer-events-none opacity-40 mix-blend-luminosity"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c142b] via-[#0c142b]/95 to-transparent pointer-events-none" />

      {/* Top Filter Controls Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        {/* Search */}
        <div className="relative w-64 sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar reporte..."
            className="w-full bg-[#131d3d] border border-[#202f5c] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Date Picker, Turn Selector & Export Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131d3d] border border-[#202f5c] text-xs font-mono text-zinc-200">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>{fechaRango}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          </div>

          {/* Turn Filter */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131d3d] border border-[#202f5c] text-xs font-mono text-zinc-200">
            <select
              value={turnoFiltro}
              onChange={(e) => onTurnoChange(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="TODOS" className="bg-[#0f172a]">Todos los turnos</option>
              <option value="TURNO_1" className="bg-[#0f172a]">Turno 1 (06:00 - 14:00)</option>
              <option value="TURNO_2" className="bg-[#0f172a]">Turno 2 (14:00 - 22:00)</option>
              <option value="TURNO_3" className="bg-[#0f172a]">Turno 3 (22:00 - 06:00)</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-[#0c142b] font-bold text-xs font-sans shadow-md transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#0c142b]" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="relative z-10 pt-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Reportes gerenciales
        </h1>
        <p className="text-xs text-zinc-300 mt-1 max-w-xl">
          Toda la información de tu hotel en un solo lugar para tomar mejores decisiones.
        </p>
      </div>
    </div>
  );
}
