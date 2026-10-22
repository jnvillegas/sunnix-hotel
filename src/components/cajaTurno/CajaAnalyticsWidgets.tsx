'use client';

import React from 'react';
import type { MedioPagoResumenItem, ConceptoResumenItem } from '@/types';

interface CajaAnalyticsWidgetsProps {
  resumenMediosPago: MedioPagoResumenItem[];
  resumenConceptos: ConceptoResumenItem[];
}

export function CajaAnalyticsWidgets({
  resumenMediosPago,
  resumenConceptos,
}: CajaAnalyticsWidgetsProps) {
  // SVG Donut calculation
  const totalMedios = resumenMediosPago.reduce((acc, m) => acc + m.monto, 0);
  let accumulatedAngle = 0;

  const donutSlices = resumenMediosPago.map((item) => {
    const angle = (item.monto / totalMedios) * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (startAngle + angle - 90) * (Math.PI / 180);

    const x1 = 60 + 44 * Math.cos(startRad);
    const y1 = 60 + 44 * Math.sin(startRad);
    const x2 = 60 + 44 * Math.cos(endRad);
    const y2 = 60 + 44 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;
    const d = `M ${x1} ${y1} A 44 44 0 ${largeArc} 1 ${x2} ${y2}`;

    return {
      d,
      color: item.color,
      item,
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Resumen por medio de pago (ingresos) */}
      <div className="rounded-2xl border border-[#1e293b] bg-[#0c142b] p-5 shadow-xl flex flex-col justify-between">
        <h4 className="text-sm font-bold text-white tracking-tight">
          Resumen por medio de pago (ingresos)
        </h4>

        <div className="flex items-center justify-between gap-4 py-3">
          {/* SVG Donut */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
              {donutSlices.map((slice, i) => (
                <path
                  key={i}
                  d={slice.d}
                  fill="none"
                  stroke={slice.color}
                  strokeWidth="16"
                  strokeLinecap="butt"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-mono font-bold text-white">
                100%
              </span>
              <span className="text-[9px] uppercase font-semibold text-zinc-400">
                INGRESOS
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 flex-1 text-xs">
            {resumenMediosPago.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-zinc-300">{item.medio}</span>
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-zinc-400">{item.porcentaje}%</span>
                  <span className="font-semibold text-white">
                    $ {item.monto.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Ingresos por concepto */}
      <div className="rounded-2xl border border-[#1e293b] bg-[#0c142b] p-5 shadow-xl flex flex-col justify-between">
        <h4 className="text-sm font-bold text-white tracking-tight">
          Ingresos por concepto
        </h4>

        <div className="space-y-3.5 py-2 text-xs">
          {resumenConceptos.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-zinc-300 font-medium">{item.concepto}</span>
                <div className="flex items-center gap-2.5 font-mono">
                  <span className="text-zinc-400">{item.porcentaje}%</span>
                  <span className="font-bold text-white">
                    $ {item.monto.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.porcentaje}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
