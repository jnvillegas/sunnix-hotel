'use client';

import React from 'react';
import { Eye, CheckCircle2, Play, MoreHorizontal } from 'lucide-react';
import type { TareaLimpiezaItem } from '@/types';

interface LimpiezaTasksTableProps {
  tareas: TareaLimpiezaItem[];
  onSelectTarea: (tarea: TareaLimpiezaItem) => void;
  onFinalizarDirecto?: (habitacionId: string) => void;
}

export function LimpiezaTasksTable({
  tareas,
  onSelectTarea,
  onFinalizarDirecto,
}: LimpiezaTasksTableProps) {
  return (
    <div className="rounded-2xl border border-[#1e293b] bg-[#0c142b] p-5 shadow-xl space-y-4">
      <div>
        <h3 className="text-base font-bold text-white tracking-tight">
          Tareas de limpieza pendientes y en proceso
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#111a38] text-zinc-400 font-semibold uppercase text-[10px] tracking-wider border-b border-[#1e293b]">
            <tr>
              <th className="py-3 px-4">Habitación</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4">Salida huésped</th>
              <th className="py-3 px-4">Inicio limpieza</th>
              <th className="py-3 px-4">Tiempo estimado</th>
              <th className="py-3 px-4">Personal asignado</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]">
            {tareas.map((t) => {
              const isEnProceso = t.estado === 'EN_PROCESO';

              return (
                <tr
                  key={t.id}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  onClick={() => onSelectTarea(t)}
                >
                  <td className="py-3 px-4 font-bold text-white">{t.numero}</td>
                  <td className="py-3 px-4">{t.categoria}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        isEnProceso
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                      }`}
                    >
                      {isEnProceso ? 'En proceso' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{t.horaSalidaHuesped}</td>
                  <td className="py-3 px-4 font-mono text-zinc-400">
                    {t.horaInicioLimpieza || '—'}
                  </td>
                  <td className="py-3 px-4">{t.tiempoEstimadoMinutos} min</td>
                  <td className="py-3 px-4 font-medium text-white">
                    {t.personalAsignadoNombre || '—'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-3">
                      {/* Mini progress bar */}
                      <div className="flex items-center gap-1.5 w-24">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${t.porcentajeAvance}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 w-6 text-right">
                          {t.porcentajeAvance}%
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onSelectTarea(t)}
                          title="Ver detalle"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {isEnProceso && onFinalizarDirecto ? (
                          <button
                            type="button"
                            onClick={() => onFinalizarDirecto(t.habitacionId)}
                            title="Marcar como finalizada"
                            className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-600 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSelectTarea(t)}
                            title="Iniciar o asignar"
                            className="p-1.5 rounded-lg text-blue-400 hover:text-white hover:bg-blue-600 transition-colors"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
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
