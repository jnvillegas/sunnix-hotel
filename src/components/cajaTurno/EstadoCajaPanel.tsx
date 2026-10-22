'use client';

import React, { useState } from 'react';
import {
  Wallet,
  ArrowUp,
  ArrowDown,
  Coins,
  BedDouble,
  Printer,
  Save,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface EstadoCajaPanelProps {
  turnoNombre: string;
  saldoInicial: number;
  totalIngresos: number;
  totalEgresos: number;
  saldoActual: number;
  habitacionesStats: {
    ingresos: number;
    extensiones: number;
    salidas: number;
  };
  observaciones: string;
  onObservacionesChange: (val: string) => void;
  onPrintResumen: () => void;
  onGuardarObservaciones: () => void;
}

export function EstadoCajaPanel({
  turnoNombre,
  saldoInicial,
  totalIngresos,
  totalEgresos,
  saldoActual,
  habitacionesStats,
  observaciones,
  onObservacionesChange,
  onPrintResumen,
  onGuardarObservaciones,
}: EstadoCajaPanelProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onGuardarObservaciones();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-[#1e293b] bg-[#0c142b] p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Estado de caja – {turnoNombre}
        </h3>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          ↑ Abierta
        </span>
      </div>

      {/* 4 Financial Balances Cards */}
      <div className="space-y-2.5">
        {/* 1. Saldo Inicial */}
        <div className="p-3 rounded-xl bg-[#111a38] border border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Coins className="w-4 h-4 text-zinc-400" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-zinc-400">
                Saldo inicial
              </div>
              <div className="text-sm font-bold font-mono text-white mt-0.5">
                $ {saldoInicial.toLocaleString('es-AR')}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="px-2.5 py-1 rounded-lg border border-slate-700 text-zinc-300 hover:text-white text-[11px] font-medium transition-colors"
          >
            Editar
          </button>
        </div>

        {/* 2. Total Ingresos */}
        <div className="p-3 rounded-xl bg-[#0e2124] border border-[#163a3d] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ArrowUp className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-emerald-300">
                Total ingresos
              </div>
              <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                ↑ $ {totalIngresos.toLocaleString('es-AR')}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="px-2.5 py-1 rounded-lg border border-emerald-500/30 text-emerald-300 hover:text-white text-[11px] font-medium transition-colors"
          >
            Ver detalle
          </button>
        </div>

        {/* 3. Total Egresos */}
        <div className="p-3 rounded-xl bg-[#26151f] border border-[#491f34] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ArrowDown className="w-4 h-4 text-pink-400" />
            <div>
              <div className="text-[10px] uppercase font-semibold text-pink-300">
                Total egresos
              </div>
              <div className="text-sm font-bold font-mono text-pink-400 mt-0.5">
                ↓ $ {totalEgresos.toLocaleString('es-AR')}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="px-2.5 py-1 rounded-lg border border-pink-500/30 text-pink-300 hover:text-white text-[11px] font-medium transition-colors"
          >
            Ver detalle
          </button>
        </div>

        {/* 4. Saldo Actual (Highlighted) */}
        <div className="p-3.5 rounded-xl bg-[#111d42] border border-blue-500/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-blue-300">
              Saldo actual
            </div>
            <div className="text-lg font-extrabold font-mono text-white mt-0.5">
              $ {saldoActual.toLocaleString('es-AR')}
            </div>
          </div>
        </div>
      </div>

      {/* Habitaciones del Turno */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-bold text-white">
          <BedDouble className="w-3.5 h-3.5 text-blue-400" />
          <span>Habitaciones del turno</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-[#0e2124] border border-[#163a3d]">
            <div className="text-base font-extrabold text-emerald-400">
              {habitacionesStats.ingresos}
            </div>
            <div className="text-[10px] font-medium text-emerald-300 mt-0.5">
              Ingresos
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#101c38] border border-[#1d3161]">
            <div className="text-base font-extrabold text-blue-400">
              {habitacionesStats.extensiones}
            </div>
            <div className="text-[10px] font-medium text-blue-300 mt-0.5">
              Extensiones
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#26151f] border border-[#491f34]">
            <div className="text-base font-extrabold text-pink-400">
              {habitacionesStats.salidas}
            </div>
            <div className="text-[10px] font-medium text-pink-300 mt-0.5">
              Salidas
            </div>
          </div>
        </div>
      </div>

      {/* Observaciones del Cierre */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
        <label className="text-xs font-bold text-white">
          Observaciones del cierre
        </label>
        <textarea
          value={observaciones}
          onChange={(e) => onObservacionesChange(e.target.value)}
          rows={3}
          placeholder="Agregá observaciones..."
          className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onPrintResumen}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#111a38] border border-[#1e293b] hover:bg-slate-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir resumen</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-blue-500/30 text-blue-400 hover:bg-blue-950/40 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaved ? '¡Guardado!' : 'Guardar'}</span>
          </button>
        </div>

        {/* Primary Closing Button */}
        <Link
          href="/caja/cierre"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2563eb] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-blue-900/30 cursor-pointer"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Finalizar y cerrar turno</span>
        </Link>
      </div>
    </div>
  );
}
