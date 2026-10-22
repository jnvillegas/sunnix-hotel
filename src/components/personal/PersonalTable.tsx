'use client';

import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { EmpleadoAsistenciaItem } from '@/types';

interface PersonalTableProps {
  empleados: EmpleadoAsistenciaItem[];
  selectedEmpleadoId?: string;
  onSelectEmpleado: (emp: EmpleadoAsistenciaItem) => void;
}

export function PersonalTable({
  empleados,
  selectedEmpleadoId,
  onSelectEmpleado,
}: PersonalTableProps) {
  return (
    <div className="rounded-2xl border border-[#1e293b] bg-[#0c142b] overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#111a38] text-zinc-400 font-semibold uppercase text-[10px] tracking-wider border-b border-[#1e293b]">
            <tr>
              <th className="py-3.5 px-4">Empleado</th>
              <th className="py-3.5 px-4">Cargo</th>
              <th className="py-3.5 px-4">Turno</th>
              <th className="py-3.5 px-4">Horario programado</th>
              <th className="py-3.5 px-4">Ingreso</th>
              <th className="py-3.5 px-4">Salida</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]">
            {empleados.map((emp) => {
              const isSelected = selectedEmpleadoId === emp.id;
              const isPresente = emp.estado === 'PRESENTE';
              const isTarde = emp.estado === 'TARDE';
              const isAusente = emp.estado === 'AUSENTE';

              return (
                <tr
                  key={emp.id}
                  onClick={() => onSelectEmpleado(emp)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-950/40 border-l-2 border-l-blue-500'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Empleado con Avatar y Nombre */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                        <img
                          src={emp.avatarUrl}
                          alt={emp.nombreCompleto}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-semibold text-white">
                        {emp.nombreCompleto}
                      </span>
                    </div>
                  </td>

                  {/* Cargo */}
                  <td className="py-3 px-4 text-zinc-300">{emp.cargo}</td>

                  {/* Turno */}
                  <td className="py-3 px-4 text-zinc-400">{emp.turno}</td>

                  {/* Horario programado */}
                  <td className="py-3 px-4 font-mono text-zinc-300">
                    {emp.horarioProgramado}
                  </td>

                  {/* Ingreso real */}
                  <td className="py-3 px-4 font-mono font-medium text-white">
                    {emp.ingreso || '—'}
                  </td>

                  {/* Salida real */}
                  <td className="py-3 px-4 font-mono text-zinc-400">
                    {emp.salida || '—'}
                  </td>

                  {/* Estado Badge */}
                  <td className="py-3 px-4">
                    {isPresente && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        Presente
                      </span>
                    )}
                    {isTarde && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        Tarde
                      </span>
                    )}
                    {isAusente && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-pink-500/15 text-pink-300 border border-pink-500/30">
                        Ausente
                      </span>
                    )}
                    {emp.estado === 'DESCANSO' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        En descanso
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEmpleado(emp);
                      }}
                      className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
