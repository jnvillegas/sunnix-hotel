'use client';

import React from 'react';
import {
  CreditCard,
  Calendar,
  Clock,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Circle,
  X,
  Edit2,
} from 'lucide-react';
import type { EmpleadoAsistenciaItem } from '@/types';

interface PersonalDetailDrawerProps {
  empleado: EmpleadoAsistenciaItem | null;
  onClose?: () => void;
  onOpenEditarModal?: (emp: EmpleadoAsistenciaItem) => void;
}

export function PersonalDetailDrawer({
  empleado,
  onClose,
  onOpenEditarModal,
}: PersonalDetailDrawerProps) {
  if (!empleado) {
    return (
      <div className="rounded-2xl border border-[#1e293b] bg-[#0c142b] p-6 text-center text-zinc-500 text-xs">
        Seleccioná un empleado de la tabla para ver su ficha y registros.
      </div>
    );
  }

  const isPresente = empleado.estado === 'PRESENTE';

  return (
    <div className="rounded-2xl border border-[#1e293b] bg-[#0c142b] p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Detalle del empleado
        </h3>

        <div className="flex items-center gap-2">
          {onOpenEditarModal && (
            <button
              type="button"
              onClick={() => onOpenEditarModal(empleado)}
              className="px-2.5 py-1 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-950/40 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Editar</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Avatar & Profile */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
          <img
            src={empleado.avatarUrl}
            alt={empleado.nombreCompleto}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-white">
            {empleado.nombreCompleto}
          </h4>
          <span className="text-xs text-zinc-400 font-medium">
            {empleado.cargo}
          </span>
        </div>
      </div>

      {/* Detailed Meta list matching Image 1 */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2.5 text-zinc-300">
          <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-400">DNI:</span>
          <span className="font-mono text-white font-medium">{empleado.dni}</span>
        </div>

        <div className="flex items-center gap-2.5 text-zinc-300">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-zinc-400">Turno actual:</span>
          <span className="text-white font-medium">
            {empleado.turno} ({empleado.horarioProgramado})
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-zinc-300">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-zinc-400">Ingreso:</span>
          <span className="font-mono font-medium text-white">
            {empleado.ingreso || '—'}
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-zinc-300">
          <LogOut className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-400">Salida:</span>
          <span className="font-mono text-zinc-400">{empleado.salida || '—'}</span>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-zinc-400">Estado:</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              isPresente
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : empleado.estado === 'TARDE'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
            }`}
          >
            {empleado.estado === 'PRESENTE' ? 'Presente' : empleado.estado}
          </span>
        </div>
      </div>

      {/* Historial de hoy Timeline */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
        <h5 className="text-xs font-bold text-white tracking-tight">
          Historial de hoy
        </h5>

        <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          <div className="relative">
            <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>
            <div className="text-xs">
              <span className="font-mono font-bold text-white">
                {empleado.ingreso || '06:00'}
              </span>{' '}
              <span className="text-zinc-400">Ingreso registrado</span>
            </div>
          </div>

          <div className="relative">
            <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            </span>
            <div className="text-xs">
              <span className="font-mono text-zinc-500">
                {empleado.salida || '—'}
              </span>{' '}
              <span className="text-zinc-500">Salida pendiente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Últimos registros Table */}
      <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
        <h5 className="text-xs font-bold text-white tracking-tight">
          Últimos registros
        </h5>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] text-zinc-300">
            <tbody className="divide-y divide-slate-800/80">
              {empleado.historialSemanal.map((reg, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-1.5 font-mono text-zinc-400">{reg.fecha}</td>
                  <td className="py-1.5 font-mono text-white">{reg.ingreso}</td>
                  <td className="py-1.5 font-mono text-zinc-400">{reg.salida}</td>
                  <td className="py-1.5 text-right">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {reg.estado === 'PRESENTE' ? 'Presente' : reg.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
