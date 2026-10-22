'use client';

import React from 'react';
import { Plus, Check, ChevronDown } from 'lucide-react';
import type { LimpiezaKPIData, PersonalMucamaItem } from '@/types';

interface LimpiezaFilterBarProps {
  kpis: LimpiezaKPIData;
  filtroEstado: string;
  onFiltroEstadoChange: (estado: string) => void;
  filtroCategoria: string;
  onFiltroCategoriaChange: (cat: string) => void;
  filtroPersonal: string;
  onFiltroPersonalChange: (pers: string) => void;
  filtroEstadoTarea: string;
  onFiltroEstadoTareaChange: (est: string) => void;
  personalMucamas: PersonalMucamaItem[];
}

export function LimpiezaFilterBar({
  kpis,
  filtroEstado,
  onFiltroEstadoChange,
  filtroCategoria,
  onFiltroCategoriaChange,
  filtroPersonal,
  onFiltroPersonalChange,
  filtroEstadoTarea,
  onFiltroEstadoTareaChange,
  personalMucamas,
}: LimpiezaFilterBarProps) {
  const pills = [
    {
      id: 'TODAS',
      label: `Todas (${kpis.total})`,
      icon: Plus,
      activeStyle: 'bg-[#2563eb] text-white border-blue-500 shadow-md shadow-blue-900/30',
      inactiveStyle: 'bg-[#0f172a] text-zinc-300 border-[#1e293b] hover:bg-slate-800',
    },
    {
      id: 'DISPONIBLE',
      label: `Disponibles (${kpis.disponibles})`,
      icon: Check,
      activeStyle: 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-900/30',
      inactiveStyle: 'bg-[#0e2124] text-emerald-300 border-[#163a3d] hover:bg-emerald-950/40',
    },
    {
      id: 'OCUPADA',
      label: `Ocupadas (${kpis.ocupadas})`,
      icon: Check,
      activeStyle: 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/30',
      inactiveStyle: 'bg-[#101c38] text-blue-300 border-[#1d3161] hover:bg-blue-950/40',
    },
    {
      id: 'LIMPIEZA',
      label: `En limpieza (${kpis.enLimpieza})`,
      icon: Check,
      activeStyle: 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-900/30',
      inactiveStyle: 'bg-[#231b15] text-amber-300 border-[#442f1f] hover:bg-amber-950/40',
    },
    {
      id: 'MANTENIMIENTO',
      label: `Mantenimiento (${kpis.mantenimiento})`,
      icon: Check,
      activeStyle: 'bg-pink-600 text-white border-pink-500 shadow-md shadow-pink-900/30',
      inactiveStyle: 'bg-[#26151f] text-pink-300 border-[#491f34] hover:bg-pink-950/40',
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
      {/* Left Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {pills.map((pill) => {
          const Icon = pill.icon;
          const isActive = filtroEstado === pill.id;

          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => onFiltroEstadoChange(pill.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                isActive ? pill.activeStyle : pill.inactiveStyle
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Dropdown Selectors */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Categoría */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Categoría</span>
          <div className="relative">
            <select
              value={filtroCategoria}
              onChange={(e) => onFiltroCategoriaChange(e.target.value)}
              className="appearance-none bg-[#0c142b] border border-[#1e293b] rounded-xl pl-3 pr-8 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="TODAS">Todas</option>
              <option value="Suite">Suite</option>
              <option value="Premium">Premium</option>
              <option value="Estándar">Estándar</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Personal */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Personal</span>
          <div className="relative">
            <select
              value={filtroPersonal}
              onChange={(e) => onFiltroPersonalChange(e.target.value)}
              className="appearance-none bg-[#0c142b] border border-[#1e293b] rounded-xl pl-3 pr-8 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="TODOS">Todos</option>
              {personalMucamas.map((p) => (
                <option key={p.id} value={p.nombre}>
                  {p.nombre}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Estado */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Estado</span>
          <div className="relative">
            <select
              value={filtroEstadoTarea}
              onChange={(e) => onFiltroEstadoTareaChange(e.target.value)}
              className="appearance-none bg-[#0c142b] border border-[#1e293b] rounded-xl pl-3 pr-8 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="TODOS">Todos</option>
              <option value="EN_PROCESO">En proceso</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="FINALIZADA">Finalizada</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
