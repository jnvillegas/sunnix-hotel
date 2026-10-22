'use client';

import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Minus,
  MoreHorizontal,
  Calendar,
  User,
  FileText,
  CreditCard,
  Banknote,
  Send,
} from 'lucide-react';
import type { MovimientoCajaItem } from '@/types';

interface MovimientosTableProps {
  movimientos: MovimientoCajaItem[];
  aperturaHora: string;
  responsableNombre: string;
  observaciones: string;
  turnoNombre: string;
  onOpenIngresoModal: () => void;
  onOpenEgresoModal: () => void;
}

export function MovimientosTable({
  movimientos,
  aperturaHora,
  responsableNombre,
  observaciones,
  turnoNombre,
  onOpenIngresoModal,
  onOpenEgresoModal,
}: MovimientosTableProps) {
  return (
    <div className="rounded-2xl border border-[#1e293b] bg-[#0c142b] p-5 shadow-xl space-y-4">
      {/* Header and Quick Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-bold text-white tracking-tight">
            Detalle del {turnoNombre.toLowerCase()}
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <ArrowDownLeft className="w-3 h-3" />
            <span>Caja abierta</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenIngresoModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar ingreso</span>
          </button>

          <button
            type="button"
            onClick={onOpenEgresoModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/15 border border-pink-500/30 hover:bg-pink-500/25 text-pink-300 text-xs font-semibold transition-all cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>Registrar egreso</span>
          </button>

          <button
            type="button"
            className="p-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-zinc-400 hover:text-white transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Strip */}
      <div className="flex flex-wrap items-center gap-6 py-2 px-3.5 rounded-xl bg-[#111a38] border border-[#1e293b] text-xs text-zinc-300">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-zinc-400">Apertura:</span>
          <span className="font-mono text-white font-medium">{aperturaHora}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-zinc-400">Responsable:</span>
          <span className="text-white font-medium">{responsableNombre}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-400">Observaciones:</span>
          <span className="text-zinc-300 italic">{observaciones || '—'}</span>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#111a38] text-zinc-400 font-semibold uppercase text-[10px] tracking-wider border-b border-[#1e293b]">
            <tr>
              <th className="py-3 px-3.5">Hora</th>
              <th className="py-3 px-3.5">Tipo</th>
              <th className="py-3 px-3.5">Concepto</th>
              <th className="py-3 px-3.5">Habitación</th>
              <th className="py-3 px-3.5">Medio de pago</th>
              <th className="py-3 px-3.5 text-right">Importe</th>
              <th className="py-3 px-3.5">Usuario</th>
              <th className="py-3 px-3.5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]">
            {movimientos.map((mov) => {
              const isIngreso = mov.tipo === 'INGRESO';

              return (
                <tr
                  key={mov.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-3.5 font-mono text-zinc-400">
                    {mov.horaStr}
                  </td>

                  {/* Tipo */}
                  <td className="py-3 px-3.5">
                    {isIngreso ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Ingreso</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-pink-400 font-semibold">
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                        <span>Egreso</span>
                      </span>
                    )}
                  </td>

                  {/* Concepto */}
                  <td className="py-3 px-3.5 font-medium text-white">
                    {mov.concepto}
                  </td>

                  {/* Habitación */}
                  <td className="py-3 px-3.5 font-mono">
                    {mov.habitacionNumero || '—'}
                  </td>

                  {/* Medio de pago */}
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      {mov.medioPago === 'Efectivo' && (
                        <Banknote className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {mov.medioPago === 'Tarjeta' && (
                        <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                      )}
                      {mov.medioPago === 'Transferencia' && (
                        <Send className="w-3.5 h-3.5 text-purple-400" />
                      )}
                      <span>{mov.medioPago}</span>
                    </div>
                  </td>

                  {/* Importe */}
                  <td
                    className={`py-3 px-3.5 font-mono font-bold text-right ${
                      isIngreso ? 'text-white' : 'text-pink-400'
                    }`}
                  >
                    $ {mov.importe.toLocaleString('es-AR')}
                  </td>

                  {/* Usuario */}
                  <td className="py-3 px-3.5 text-zinc-400">
                    {mov.usuarioNombre}
                  </td>

                  {/* Acciones */}
                  <td className="py-3 px-3.5 text-center">
                    <button
                      type="button"
                      className="p-1 rounded-lg text-zinc-500 hover:text-white transition-colors"
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
