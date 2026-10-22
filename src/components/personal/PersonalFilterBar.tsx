'use client';

import React from 'react';
import { Calendar, ChevronDown, Search } from 'lucide-react';

interface PersonalFilterBarProps {
  fecha: string;
  onFechaChange: (f: string) => void;
  filtroTurno: string;
  onTurnoChange: (t: string) => void;
  filtroCargo: string;
  onCargoChange: (c: string) => void;
  filtroEstado: string;
  onEstadoChange: (e: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function PersonalFilterBar({
  fecha,
  onFechaChange,
  filtroTurno,
  onTurnoChange,
  filtroCargo,
  onCargoChange,
  filtroEstado,
  onEstadoChange,
  searchQuery,
  onSearchChange,
}: PersonalFilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
      {/* Left Dropdown Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Fecha */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Fecha</span>
          <div className="relative">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0c142b] border border-[#1e293b] text-xs font-mono text-white cursor-pointer">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{fecha}</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </div>
          </div>
        </div>

        {/* Turno */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Turno</span>
          <div className="relative">
            <select
              value={filtroTurno}
              onChange={(e) => onTurnoChange(e.target.value)}
              className="appearance-none bg-[#0c142b] border border-[#1e293b] rounded-xl pl-3 pr-8 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="TODOS">Todos los turnos</option>
              <option value="Turno 1">Turno 1 (06:00 - 14:00)</option>
              <option value="Turno 2">Turno 2 (14:00 - 22:00)</option>
              <option value="Turno 3">Turno 3 (22:00 - 06:00)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Cargo */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Cargo</span>
          <div className="relative">
            <select
              value={filtroCargo}
              onChange={(e) => onCargoChange(e.target.value)}
              className="appearance-none bg-[#0c142b] border border-[#1e293b] rounded-xl pl-3 pr-8 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="TODOS">Todos</option>
              <option value="Encargada">Encargada</option>
              <option value="Recepción / Caja">Recepción / Caja</option>
              <option value="Mucama">Mucama</option>
              <option value="Limpieza">Limpieza</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Estado */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Estado</span>
          <div className="relative">
            <select
              value={filtroEstado}
              onChange={(e) => onEstadoChange(e.target.value)}
              className="appearance-none bg-[#0c142b] border border-[#1e293b] rounded-xl pl-3 pr-8 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="TODOS">Todos</option>
              <option value="PRESENTE">Presente</option>
              <option value="TARDE">Llegada tarde</option>
              <option value="AUSENTE">Ausente</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Right Search Input */}
      <div className="relative w-full sm:w-64">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar empleado..."
          className="w-full bg-[#0c142b] border border-[#1e293b] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>
    </div>
  );
}
