'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import type { TurnoInfo } from '@/types';

interface TurnoSelectorCardsProps {
  turnos: TurnoInfo[];
  selectedTurnoId: string;
  onSelectTurno: (id: string) => void;
}

export function TurnoSelectorCards({
  turnos,
  selectedTurnoId,
  onSelectTurno,
}: TurnoSelectorCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {turnos.map((turno) => {
        const isSelected = selectedTurnoId === turno.id;
        const isAbierto = turno.estado === 'ABIERTO';
        const isCerrado = turno.estado === 'CERRADO';

        return (
          <div
            key={turno.id}
            onClick={() => onSelectTurno(turno.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 shadow-lg ${
              isAbierto
                ? 'bg-[#0e2124] border-emerald-500/50 ring-2 ring-emerald-500/20'
                : isSelected
                ? 'bg-[#101c38] border-blue-500'
                : 'bg-[#0c142b] border-[#1e293b] hover:border-slate-700'
            }`}
          >
            {/* Left: Icon + Info */}
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                  turno.id === 'TURNO_1'
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    : turno.id === 'TURNO_2'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                }`}
              >
                {turno.id === 'TURNO_3' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-white">
                    {turno.nombre}
                  </h3>
                </div>
                <div className="text-xs font-mono text-zinc-400 mt-0.5">
                  {turno.horario}
                </div>
                <div className="mt-1.5">
                  {isAbierto && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-sm">
                      Abierto
                    </span>
                  )}
                  {isCerrado && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-zinc-400 border border-slate-700">
                      Cerrado
                    </span>
                  )}
                  {turno.estado === 'PENDIENTE' && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">
                      Pendiente
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Responsable */}
            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                Responsable
              </span>
              <span className="text-xs font-semibold text-zinc-200 mt-0.5 block truncate max-w-[110px]">
                {turno.responsable}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
