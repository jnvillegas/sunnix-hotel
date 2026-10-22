'use client';

import React, { useState } from 'react';
import {
  LayoutGrid,
  List,
  MoreVertical,
  Clock,
  User,
  BedDouble,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import type { HabitacionLimpiezaCardData } from '@/types';

interface LimpiezaRoomsGridProps {
  habitaciones: HabitacionLimpiezaCardData[];
  selectedHabitacionId?: string;
  onSelectHabitacion: (hab: HabitacionLimpiezaCardData) => void;
}

export function LimpiezaRoomsGrid({
  habitaciones,
  selectedHabitacionId,
  onSelectHabitacion,
}: LimpiezaRoomsGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-3.5">
      {/* Header and View Mode Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
          Estado de habitaciones
        </h2>

        <div className="flex items-center gap-1 bg-[#0c142b] border border-[#1e293b] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#2563eb] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Vista cuadrícula</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#2563eb] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Vista lista</span>
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {habitaciones.map((hab) => {
            const isSelected = selectedHabitacionId === hab.id;
            const isEnLimpieza = hab.estado === 'LIMPIEZA';
            const isOcupada = hab.estado === 'OCUPADA';
            const isDisponible = hab.estado === 'DISPONIBLE';

            return (
              <div
                key={hab.id}
                onClick={() => onSelectHabitacion(hab)}
                className={`group rounded-2xl bg-[#0c142b] border transition-all duration-200 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-0.5 ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-blue-900/20 shadow-lg'
                    : isEnLimpieza
                    ? 'border-amber-500/40 hover:border-amber-500'
                    : 'border-[#1e293b] hover:border-slate-700'
                }`}
              >
                {/* Photo with status badge */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${hab.fotoUrl}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c142b] via-transparent to-black/30 pointer-events-none" />

                  {/* Status Badge floating on top right */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    {isDisponible && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/90 text-white shadow-md backdrop-blur-sm">
                        Disponible
                      </span>
                    )}
                    {isEnLimpieza && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/95 text-white shadow-md backdrop-blur-sm flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>En limpieza</span>
                      </span>
                    )}
                    {isOcupada && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-600/90 text-white shadow-md backdrop-blur-sm">
                        Ocupada
                      </span>
                    )}
                    {hab.estado === 'MANTENIMIENTO' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-pink-600/90 text-white shadow-md backdrop-blur-sm">
                        Mantenimiento
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-extrabold text-white">
                        {hab.numero}
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">
                        {hab.categoria}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectHabitacion(hab);
                      }}
                      className="text-zinc-500 hover:text-white p-1 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Cleaning progress details */}
                  {isEnLimpieza && (
                    <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-[11px] text-zinc-300">
                        <span className="flex items-center gap-1 text-zinc-400">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Inicio {hab.inicioLimpieza || '11:47'}</span>
                        </span>
                        <span className="text-zinc-400 truncate max-w-[100px]">
                          {hab.personalNombre || 'María López'}
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${hab.porcentajeAvance || 60}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-blue-400">
                          {hab.porcentajeAvance || 60}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Occupied room departure time */}
                  {isOcupada && (
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 pt-1 border-t border-slate-800/80">
                      <BedDouble className="w-3.5 h-3.5 text-blue-400" />
                      <span>Salida {hab.salidaHuesped || '17:30'}</span>
                    </div>
                  )}

                  {/* Available room */}
                  {isDisponible && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400/90 pt-1 border-t border-slate-800/80">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Lista para asignación</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl border border-[#1e293b] bg-[#0c142b] overflow-hidden">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#111a38] text-zinc-400 font-semibold uppercase text-[10px] tracking-wider border-b border-[#1e293b]">
              <tr>
                <th className="py-3 px-4">Habitación</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Tarifa base</th>
                <th className="py-3 px-4">Personal / Horario</th>
                <th className="py-3 px-4">Avance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {habitaciones.map((hab) => (
                <tr
                  key={hab.id}
                  onClick={() => onSelectHabitacion(hab)}
                  className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-white">{hab.numero}</td>
                  <td className="py-3 px-4">{hab.categoria}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        hab.estado === 'DISPONIBLE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : hab.estado === 'LIMPIEZA'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {hab.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-400">{hab.tarifaStr}</td>
                  <td className="py-3 px-4 text-zinc-300">
                    {hab.personalNombre || hab.salidaHuesped || '—'}
                  </td>
                  <td className="py-3 px-4">
                    {hab.porcentajeAvance ? `${hab.porcentajeAvance}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
