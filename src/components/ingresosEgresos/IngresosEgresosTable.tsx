'use client';

import React from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Banknote,
  Building2,
  FileText,
  User,
  BedDouble,
} from 'lucide-react';
import type { MovimientoFinancieroItem } from '@/types';

interface IngresosEgresosTableProps {
  movimientos: MovimientoFinancieroItem[];
}

export function IngresosEgresosTable({ movimientos }: IngresosEgresosTableProps) {
  const formatMonto = (val: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getMedioPagoIcon = (medio: string) => {
    switch (medio) {
      case 'Efectivo':
        return <Banknote className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Tarjeta':
        return <CreditCard className="w-3.5 h-3.5 text-blue-400" />;
      case 'Transferencia':
        return <Building2 className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Banknote className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  const getCategoriaBadge = (cat: string, label: string) => {
    switch (cat) {
      case 'ESTADIAS':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {label}
          </span>
        );
      case 'BAR_ROOM_SERVICE':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {label}
          </span>
        );
      case 'INSUMOS':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {label}
          </span>
        );
      case 'MANTENIMIENTO':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
            {label}
          </span>
        );
      case 'RETIRO_CAJA':
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            {label}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
            {label}
          </span>
        );
    }
  };

  if (movimientos.length === 0) {
    return (
      <div className="bg-[#0b1329] border border-[#1e293b] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-zinc-400 mb-3">
          <FileText className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-white">
          No se encontraron movimientos
        </h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm">
          No hay registros que coincidan con los filtros seleccionados o el término de búsqueda ingresado.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1329] border border-[#1e293b] rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#080d1d] text-zinc-400 border-b border-[#1e293b] text-[11px] font-semibold uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-4 py-3">Fecha / Hora</th>
              <th scope="col" className="px-4 py-3">Tipo</th>
              <th scope="col" className="px-4 py-3">Categoría</th>
              <th scope="col" className="px-4 py-3">Concepto & Vinculación</th>
              <th scope="col" className="px-4 py-3">Comprobante</th>
              <th scope="col" className="px-4 py-3">Medio de Pago</th>
              <th scope="col" className="px-4 py-3">Operador</th>
              <th scope="col" className="px-4 py-3 text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]/60 font-sans">
            {movimientos.map((m) => {
              const isIngreso = m.tipo === 'INGRESO';

              return (
                <tr
                  key={m.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  {/* Fecha y hora */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-mono text-white text-xs font-medium">
                      {m.fechaStr}
                    </div>
                    <div className="text-[11px] text-zinc-500 font-mono">
                      {m.horaStr} hs
                    </div>
                  </td>

                  {/* Tipo */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {isIngreso ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ArrowDownLeft className="w-3 h-3" />
                        INGRESO
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <ArrowUpRight className="w-3 h-3" />
                        EGRESO
                      </span>
                    )}
                  </td>

                  {/* Categoría */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    {getCategoriaBadge(m.categoria, m.categoriaNombre)}
                  </td>

                  {/* Concepto y Suite */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">
                        {m.concepto}
                      </span>
                      {m.habitacionNumero && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] font-bold shrink-0">
                          <BedDouble className="w-2.5 h-2.5" />
                          Suite {m.habitacionNumero}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Comprobante */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-[11px] text-zinc-300 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
                      {m.comprobanteNumero || 'S/C'}
                    </span>
                  </td>

                  {/* Medio de pago */}
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                      {getMedioPagoIcon(m.medioPago)}
                      <span>{m.medioPago}</span>
                    </div>
                  </td>

                  {/* Operador */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-zinc-500" />
                      <span>{m.usuarioNombre}</span>
                    </div>
                  </td>

                  {/* Monto */}
                  <td className="px-4 py-3.5 whitespace-nowrap text-right">
                    <span
                      className={`text-sm font-extrabold font-mono tracking-tight ${
                        isIngreso ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isIngreso ? '+ ' : '- '}
                      {formatMonto(m.monto)}
                    </span>
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
