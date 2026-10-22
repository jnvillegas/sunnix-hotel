'use client';

import React from 'react';
import Link from 'next/link';
import { Wallet, ArrowDownLeft, ArrowUpRight, Scale, ArrowRight } from 'lucide-react';

export function ExecutiveTurnoFinanceSummary() {
  const conceptos = [
    { label: 'Estadías y horas extra', percent: 72, monto: '$ 138.000', color: 'bg-blue-500' },
    { label: 'Bar y Room Service', percent: 18, monto: '$ 34.500', color: 'bg-purple-500' },
    { label: 'Otros ingresos y señas', percent: 10, monto: '$ 18.500', color: 'bg-emerald-500' },
  ];

  const mediosPago = [
    { label: 'Efectivo en caja', percent: 45, monto: '$ 86.500', color: 'bg-emerald-500' },
    { label: 'Tarjetas Débito/Crédito', percent: 30, monto: '$ 57.000', color: 'bg-blue-500' },
    { label: 'Transferencias QR/Bancarias', percent: 20, monto: '$ 38.000', color: 'bg-purple-500' },
    { label: 'Otros medios', percent: 5, monto: '$ 9.500', color: 'bg-amber-500' },
  ];

  return (
    <div className="bg-[#0b1329] border border-[#1e293b] rounded-2xl p-5 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white tracking-tight">
            Resumen financiero del turno actual
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Turno 2 (Tarde)
          </span>
        </div>

        <Link
          href="/dashboard/caja"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>Ir a Caja por Turno</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric Boxes */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-400">Saldo inicial turno</div>
            <div className="text-xl font-bold font-mono text-white mt-1">$ 50.000</div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <ArrowDownLeft className="w-3.5 h-3.5" /> +$ 191.500
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <ArrowUpRight className="w-3.5 h-3.5" /> -$ 17.000
            </span>
          </div>
        </div>

        {/* Facturación por Concepto */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] space-y-2.5">
          <div className="text-xs font-semibold text-white">Ingresos por concepto</div>
          <div className="space-y-2">
            {conceptos.map((c, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">{c.label}</span>
                  <span className="font-mono text-zinc-200 font-bold">{c.monto}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${c.color} rounded-full`}
                    style={{ width: `${c.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medios de Pago */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] space-y-2.5">
          <div className="text-xs font-semibold text-white">Medios de recaudación</div>
          <div className="space-y-2">
            {mediosPago.map((m, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">{m.label}</span>
                  <span className="font-mono text-zinc-200 font-bold">{m.monto}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${m.color} rounded-full`}
                    style={{ width: `${m.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
