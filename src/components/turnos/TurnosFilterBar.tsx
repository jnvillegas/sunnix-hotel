'use client';

import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface TurnosFilterBarProps {
  filtroTipo: string;
  onFiltroTipoChange: (val: string) => void;
  filtroEstado: string;
  onFiltroEstadoChange: (val: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export function TurnosFilterBar({
  filtroTipo,
  onFiltroTipoChange,
  filtroEstado,
  onFiltroEstadoChange,
  searchQuery,
  onSearchChange,
}: TurnosFilterBarProps) {
  const pills = [
    { id: 'TODAS', label: 'Todas las reservas' },
    { id: 'PERNOCTE', label: 'Pernoctes' },
    { id: 'TURNOS', label: 'Turnos express' },
    { id: 'CONFIRMADA', label: 'Confirmadas' },
    { id: 'EN_CURSO', label: 'En curso' },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
      {/* Date Switcher + Filter Pills */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date Switcher */}
        <div className="flex items-center gap-1 bg-[#0c142b] border border-[#1e293b] p-1 rounded-xl">
          <button
            type="button"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 px-2 text-xs font-mono font-semibold text-white">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Hoy, 22 de Octubre</span>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {pills.map((p) => {
            const isActive =
              (p.id === 'TODAS' && filtroTipo === 'TODAS' && filtroEstado === 'TODAS') ||
              p.id === filtroTipo ||
              p.id === filtroEstado;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  if (p.id === 'TODAS') {
                    onFiltroTipoChange('TODAS');
                    onFiltroEstadoChange('TODAS');
                  } else if (p.id === 'PERNOCTE' || p.id === 'TURNOS') {
                    onFiltroTipoChange(p.id);
                  } else {
                    onFiltroEstadoChange(p.id);
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2563eb] text-white border-blue-500 shadow-sm'
                    : 'bg-[#0c142b] text-zinc-400 border-[#1e293b] hover:text-white hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full sm:w-64">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por huésped, suite o patente..."
          className="w-full bg-[#0c142b] border border-[#1e293b] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>
    </div>
  );
}
