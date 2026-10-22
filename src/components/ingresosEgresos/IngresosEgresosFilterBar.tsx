'use client';

import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

interface IngresosEgresosFilterBarProps {
  filtroTipo: string;
  onFiltroTipoChange: (val: string) => void;
  filtroCategoria: string;
  onFiltroCategoriaChange: (val: string) => void;
  filtroMedioPago: string;
  onFiltroMedioPagoChange: (val: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export function IngresosEgresosFilterBar({
  filtroTipo,
  onFiltroTipoChange,
  filtroCategoria,
  onFiltroCategoriaChange,
  filtroMedioPago,
  onFiltroMedioPagoChange,
  searchQuery,
  onSearchChange,
}: IngresosEgresosFilterBarProps) {
  const quickPills = [
    { id: 'TODOS', label: 'Todos', type: 'ALL', cat: 'ALL' },
    { id: 'INGRESO', label: 'Ingresos (+)', type: 'INGRESO', cat: 'ALL' },
    { id: 'EGRESO', label: 'Egresos (-)', type: 'EGRESO', cat: 'ALL' },
    { id: 'ESTADIAS', label: 'Estadías', type: 'INGRESO', cat: 'ESTADIAS' },
    { id: 'BAR_ROOM_SERVICE', label: 'Bar & Room Service', type: 'INGRESO', cat: 'BAR_ROOM_SERVICE' },
    { id: 'INSUMOS', label: 'Insumos', type: 'EGRESO', cat: 'INSUMOS' },
    { id: 'MANTENIMIENTO', label: 'Mantenimiento', type: 'EGRESO', cat: 'MANTENIMIENTO' },
  ];

  return (
    <div className="flex flex-col gap-3 pt-1">
      {/* Upper row: Date switcher, quick pills & payment method */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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
            <span>Octubre 2026</span>
          </div>
          <button
            type="button"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none flex-1">
          {quickPills.map((p) => {
            const isActive =
              (p.id === 'TODOS' && filtroTipo === 'ALL' && filtroCategoria === 'ALL') ||
              (p.type === filtroTipo && p.cat === filtroCategoria);

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onFiltroTipoChange(p.type);
                  onFiltroCategoriaChange(p.cat);
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

        {/* Medio de Pago Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={filtroMedioPago}
              onChange={(e) => onFiltroMedioPagoChange(e.target.value)}
              className="bg-[#0c142b] border border-[#1e293b] rounded-xl px-3 py-1.5 text-xs text-zinc-300 font-medium focus:outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none pr-8"
            >
              <option value="ALL">Todos los medios</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
            </select>
            <Filter className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por concepto, comprobante, suite vinculada o responsable..."
          className="w-full bg-[#0c142b] border border-[#1e293b] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>
    </div>
  );
}
