'use client';

import React from 'react';
import {
  MoreHorizontal,
  Clock,
  Car,
  Phone,
  CheckCircle2,
  Play,
  Moon,
  Sparkles,
} from 'lucide-react';
import type { ReservaTurnoItem } from '@/types';
import Link from 'next/link';

interface TurnosReservasTableProps {
  reservas: ReservaTurnoItem[];
  selectedReservaId?: string;
  onSelectReserva: (r: ReservaTurnoItem) => void;
}

export function TurnosReservasTable({
  reservas,
  selectedReservaId,
  onSelectReserva,
}: TurnosReservasTableProps) {
  return (
    <div className="rounded-2xl border border-[#1e293b] bg-[#0c142b] overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#111a38] text-zinc-400 font-semibold uppercase text-[10px] tracking-wider border-b border-[#1e293b]">
            <tr>
              <th className="py-3.5 px-4">Suite</th>
              <th className="py-3.5 px-4">Huésped & Contacto</th>
              <th className="py-3.5 px-4">Tipo de Turno</th>
              <th className="py-3.5 px-4">Horario</th>
              <th className="py-3.5 px-4">Vehículo</th>
              <th className="py-3.5 px-4 text-right">Tarifa / Seña</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]">
            {reservas.map((res) => {
              const isSelected = selectedReservaId === res.id;
              const isPernocte = res.tipoTurno === 'PERNOCTE';
              const isConfirmada = res.estado === 'CONFIRMADA';
              const isEnCurso = res.estado === 'EN_CURSO';

              return (
                <tr
                  key={res.id}
                  onClick={() => onSelectReserva(res)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-950/40 border-l-2 border-l-blue-500'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Suite */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                        <img
                          src={res.fotoUrl}
                          alt={res.habitacionNumero}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-extrabold text-white text-sm">
                          {res.habitacionNumero}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {res.categoria}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Huésped */}
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">
                      {res.huespedNombre}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                      <Phone className="w-3 h-3 text-zinc-500" />
                      <span>{res.telefono}</span>
                    </div>
                  </td>

                  {/* Tipo de Turno */}
                  <td className="py-3 px-4">
                    {isPernocte ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                        <Moon className="w-3 h-3 text-purple-400" />
                        <span>Pernocte</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                        <Clock className="w-3 h-3 text-blue-400" />
                        <span>
                          {res.tipoTurno === 'TURNO_3H' ? 'Turno 3 hs' : 'Turno 2 hs'}
                        </span>
                      </span>
                    )}
                  </td>

                  {/* Horario */}
                  <td className="py-3 px-4 font-mono font-medium text-white">
                    {res.horarioInicio} - {res.horarioFin}
                  </td>

                  {/* Vehículo */}
                  <td className="py-3 px-4">
                    {res.patenteVehiculo ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-slate-800 text-zinc-300 border border-slate-700">
                        <Car className="w-3 h-3 text-zinc-400" />
                        <span>{res.patenteVehiculo}</span>
                      </span>
                    ) : (
                      <span className="text-zinc-500 font-mono">—</span>
                    )}
                  </td>

                  {/* Tarifa / Seña */}
                  <td className="py-3 px-4 text-right">
                    <div className="font-mono font-bold text-white">
                      $ {res.montoTotal.toLocaleString('es-AR')}
                    </div>
                    <div className="text-[11px] font-mono text-emerald-400">
                      Seña: $ {res.montoSena.toLocaleString('es-AR')}
                    </div>
                  </td>

                  {/* Estado */}
                  <td className="py-3 px-4">
                    {isConfirmada && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        Confirmada
                      </span>
                    )}
                    {isEnCurso && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                        En curso
                      </span>
                    )}
                    {res.estado === 'COMPLETADA' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-zinc-400 border border-slate-700">
                        Completada
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {isConfirmada && (
                        <Link
                          href="/dashboard"
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <Play className="w-3 h-3" />
                          <span>Check-in</span>
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => onSelectReserva(res)}
                        className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
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
