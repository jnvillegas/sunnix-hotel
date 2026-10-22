'use client';

import React from 'react';
import {
  BedDouble,
  Clock,
  Receipt,
  Sparkles,
  Users,
  CreditCard,
  FileSpreadsheet,
  TrendingDown,
  ChevronDown,
} from 'lucide-react';
import type { ReportesGerencialesResponse } from '@/types';

interface ReportWidgetsGridProps {
  data: ReportesGerencialesResponse;
}

export function ReportWidgetsGrid({ data }: ReportWidgetsGridProps) {
  const {
    ocupacionDiaria,
    ingresosPorTurno,
    ingresosPorConcepto,
    tiempoPromedioLimpieza,
    asistenciaPersonal,
    metodosPago,
    detalleHabitaciones,
    resumenComparativo,
  } = data;

  // Cálculos para gráfico de línea SVG de Ocupación
  // Ancho: 500, Alto: 120
  const maxPerc = 100;
  const points = ocupacionDiaria.map((p, index) => {
    const x = 30 + (index * (460 / (ocupacionDiaria.length - 1)));
    const y = 110 - (p.porcentaje / maxPerc) * 85;
    return { x, y, ...p };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} 115 L ${points[0].x} 115 Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Widget 1: Ocupación de habitaciones (Curva de línea) */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Ocupación de habitaciones
            </h3>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 px-2 py-1 rounded-lg bg-[#1e293b] border border-slate-700">
            <span>Por día</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </div>
        </div>

        {/* Line Chart SVG */}
        <div className="pt-4">
          <div className="relative w-full h-36">
            <svg viewBox="0 0 500 130" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="ocupacionAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="25" x2="490" y2="25" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="30" y1="55" x2="490" y2="55" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="30" y1="85" x2="490" y2="85" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="30" y1="115" x2="490" y2="115" stroke="#1e293b" />

              {/* Y Axis Labels */}
              <text x="5" y="28" fill="#64748b" fontSize="9" fontFamily="monospace">100%</text>
              <text x="5" y="58" fill="#64748b" fontSize="9" fontFamily="monospace">75%</text>
              <text x="5" y="88" fill="#64748b" fontSize="9" fontFamily="monospace">50%</text>
              <text x="5" y="118" fill="#64748b" fontSize="9" fontFamily="monospace">0%</text>

              {/* Filled Area */}
              <path d={areaD} fill="url(#ocupacionAreaGrad)" />

              {/* Line Curve */}
              <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

              {/* Points */}
              {points.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                  <text x={p.x} y="128" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">
                    {p.dia}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Widget 2: Ingresos por turno (Barras verticales) */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Ingresos por turno
            </h3>
          </div>
        </div>

        <div className="pt-6 grid grid-cols-3 gap-4 text-center items-end h-40">
          {ingresosPorTurno.map((t) => {
            const maxMonto = 3500000;
            const barHeightPct = Math.round((t.monto / maxMonto) * 100);

            return (
              <div key={t.turnoNombre} className="flex flex-col items-center justify-end h-full">
                <span className="text-xs font-bold font-mono text-white mb-2">
                  $ {(t.monto / 1000000).toFixed(3).replace('.', '.')}
                </span>
                <div className="w-full max-w-[64px] bg-slate-800 rounded-xl overflow-hidden h-28 flex items-end">
                  <div
                    className="w-full rounded-xl transition-all duration-500"
                    style={{
                      height: `${barHeightPct}%`,
                      backgroundColor: t.color,
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-white mt-2 block">
                  {t.turnoNombre}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono block">
                  {t.horario}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Widget 3: Ingresos por concepto (Donut Chart) */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Ingresos por concepto
            </h3>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Donut SVG */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#1e293b" strokeWidth="14" />
              {/* Segments */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#2563eb" strokeWidth="14" strokeDasharray="162 238" strokeDashoffset="0" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="14" strokeDasharray="43 238" strokeDashoffset="-162" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#8b5cf6" strokeWidth="14" strokeDasharray="19 238" strokeDashoffset="-205" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#ec4899" strokeWidth="14" strokeDasharray="10 238" strokeDashoffset="-224" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="14" strokeDasharray="5 238" strokeDashoffset="-234" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold font-mono text-white leading-tight">
                $ 8.450.000
              </span>
              <span className="text-[10px] text-zinc-500 uppercase">Total</span>
            </div>
          </div>

          {/* Legend Items */}
          <div className="space-y-1.5 flex-1 w-full text-xs font-sans">
            {ingresosPorConcepto.map((item) => (
              <div key={item.concepto} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-300 text-xs">{item.concepto}</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-zinc-500">{item.porcentaje}%</span>
                  <span className="font-semibold text-white">$ {item.monto.toLocaleString('es-AR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Widget 4: Tiempo promedio de limpieza */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Tiempo promedio de limpieza
            </h3>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Main Stat */}
          <div className="space-y-1">
            <p className="text-3xl font-black font-mono text-white">
              {tiempoPromedioLimpieza.promedioMinutos} min
            </p>
            <p className="text-xs text-zinc-400">Promedio general</p>
            <p className="text-[11px] font-mono font-medium text-emerald-400 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>{tiempoPromedioLimpieza.variacionPorcentaje}% vs. mes anterior</span>
            </p>
          </div>

          {/* Category Bars */}
          <div className="grid grid-cols-4 gap-3 flex-1 text-center items-end h-28">
            {tiempoPromedioLimpieza.porCategoria.map((cat) => (
              <div key={cat.categoria} className="flex flex-col items-center justify-end h-full">
                <span className="text-xs font-bold font-mono text-white mb-1.5">
                  {cat.minutos} min
                </span>
                <div className="w-full max-w-[42px] bg-slate-800 rounded-lg overflow-hidden h-20 flex items-end">
                  <div
                    className="w-full bg-[#38bdf8] rounded-lg transition-all"
                    style={{ height: `${(cat.minutos / 20) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-zinc-400 mt-2 truncate w-full">
                  {cat.categoria}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Widget 5: Asistencia del personal */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Asistencia del personal
            </h3>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 px-2 py-1 rounded-lg bg-[#1e293b] border border-slate-700">
            <span>Por puesto</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Donut Presentes */}
          <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#1e293b" strokeWidth="12" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="212 238" strokeDashoffset="0" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#ec4899" strokeWidth="12" strokeDasharray="26 238" strokeDashoffset="-212" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-sm font-bold font-mono text-white">
                {asistenciaPersonal.presentes}/{asistenciaPersonal.total}
              </span>
              <span className="text-[10px] text-zinc-400">Presentes</span>
            </div>
          </div>

          {/* Breakdown por puesto */}
          <div className="space-y-1.5 flex-1 w-full text-xs">
            {asistenciaPersonal.desglose.map((p, i) => {
              const colors = ['#2563eb', '#10b981', '#ec4899', '#f59e0b', '#8b5cf6', '#64748b'];
              return (
                <div key={p.puesto} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                    <span className="text-zinc-300 text-xs">{p.puesto}</span>
                  </div>
                  <span className="font-mono text-zinc-400 text-xs font-semibold">
                    {p.presentes}/{p.total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Widget 6: Métodos de pago (Barras de progreso horizontal) */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Métodos de pago
            </h3>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          {metodosPago.map((m, idx) => {
            const barColors = ['bg-[#2563eb]', 'bg-[#10b981]', 'bg-[#8b5cf6]', 'bg-[#f59e0b]'];
            return (
              <div key={m.metodo} className="space-y-1 text-xs font-sans">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300 text-xs">{m.metodo}</span>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-zinc-500">{m.porcentaje}%</span>
                    <span className="font-semibold text-white">$ {m.monto.toLocaleString('es-AR')}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColors[idx % barColors.length]}`} style={{ width: `${m.porcentaje}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Widget 7: Detalle de ingresos por habitación (Tabla) */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Detalle de ingresos por habitación
            </h3>
          </div>
          <span className="text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer">
            Ver todas
          </span>
        </div>

        <div className="overflow-x-auto pt-3">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="text-[11px] text-zinc-500 border-b border-slate-800">
                <th className="pb-2 font-medium">Habitación</th>
                <th className="pb-2 font-medium">Categoría</th>
                <th className="pb-2 font-medium text-center">Cantidad</th>
                <th className="pb-2 font-medium">Tiempo prom.</th>
                <th className="pb-2 font-medium text-right">Ingreso total</th>
                <th className="pb-2 font-medium text-right">% Ocupación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-zinc-300">
              {detalleHabitaciones.map((h) => (
                <tr key={h.numero} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 font-bold text-white">{h.numero}</td>
                  <td className="py-2.5 text-zinc-400 font-sans">{h.categoria}</td>
                  <td className="py-2.5 text-center text-zinc-300">{h.cantidadEstadias}</td>
                  <td className="py-2.5 text-zinc-400">{h.tiempoPromedioStr}</td>
                  <td className="py-2.5 text-right font-semibold text-emerald-400">
                    $ {h.ingresoTotal.toLocaleString('es-AR')}
                  </td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[11px] font-bold text-white">{h.porcentajeOcupacion}%</span>
                      <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#2563eb] h-full rounded-full" style={{ width: `${h.porcentajeOcupacion}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Widget 8: Resumen del período (Tabla Comparativa) */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Resumen del período
            </h3>
          </div>
          <span className="text-xs font-semibold text-blue-400 hover:text-blue-300 cursor-pointer">
            Comparar períodos
          </span>
        </div>

        <div className="overflow-x-auto pt-3">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="text-[11px] text-zinc-500 border-b border-slate-800">
                <th className="pb-2 font-medium">Indicador</th>
                <th className="pb-2 font-medium text-right">Actual</th>
                <th className="pb-2 font-medium text-right">Mes anterior</th>
                <th className="pb-2 font-medium text-right">Variación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-zinc-300">
              {resumenComparativo.map((r) => (
                <tr key={r.indicador} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 font-medium font-sans text-white">{r.indicador}</td>
                  <td className="py-2.5 text-right font-semibold text-zinc-100">{r.actualStr}</td>
                  <td className="py-2.5 text-right text-zinc-400">{r.mesAnteriorStr}</td>
                  <td className="py-2.5 text-right">
                    <span className="font-bold text-emerald-400">{r.variacionStr}</span>
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
