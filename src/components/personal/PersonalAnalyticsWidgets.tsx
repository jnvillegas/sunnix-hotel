'use client';

import React from 'react';
import { Clock, Pause, CheckCircle2, XCircle, Info } from 'lucide-react';
import type {
  PersonalPorCargoItem,
  PresentesPorTurnoItem,
  NovedadDiaItem,
} from '@/types';

interface PersonalAnalyticsWidgetsProps {
  personalPorCargo: PersonalPorCargoItem[];
  presentesPorTurno: PresentesPorTurnoItem[];
  novedades: NovedadDiaItem[];
}

export function PersonalAnalyticsWidgets({
  personalPorCargo,
  presentesPorTurno,
  novedades,
}: PersonalAnalyticsWidgetsProps) {
  // Donut SVG calculations
  const totalPersonal = personalPorCargo.reduce((acc, c) => acc + c.cantidad, 0);
  let accumulatedAngle = 0;

  const donutSlices = personalPorCargo.map((item) => {
    const angle = (item.cantidad / totalPersonal) * 360;
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Personal por cargo */}
      <div className="rounded-2xl border border-[#1e293b] bg-[#0c142b] p-5 shadow-xl flex flex-col justify-between">
        <h4 className="text-sm font-bold text-white tracking-tight">
          Personal por cargo
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
              <span className="text-base font-extrabold text-white">
                {totalPersonal}
              </span>
              <span className="text-[9px] uppercase font-semibold text-zinc-400">
                TOTAL
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 flex-1 text-xs">
            {personalPorCargo.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-zinc-300 truncate max-w-[110px]">
                    {item.cargo}
                  </span>
                </div>
                <span className="font-mono text-zinc-400 font-medium">
                  {item.cantidad} ({item.porcentaje}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Presentes por turno */}
      <div className="rounded-2xl border border-[#1e293b] bg-[#0c142b] p-5 shadow-xl flex flex-col justify-between">
        <h4 className="text-sm font-bold text-white tracking-tight">
          Presentes por turno
        </h4>

        <div className="flex items-end justify-around gap-4 h-36 pt-4 pb-2">
          {presentesPorTurno.map((turno, idx) => {
            const heightPercent = Math.round((turno.presentes / turno.total) * 100);

            return (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                <span className="font-mono text-xs font-bold text-white">
                  {turno.presentes}/{turno.total}
                </span>

                <div className="w-12 sm:w-14 h-24 bg-slate-800/80 rounded-xl overflow-hidden flex flex-col justify-end p-1">
                  <div
                    className="w-full rounded-lg transition-all duration-500"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: turno.color,
                    }}
                  />
                </div>

                <span className="text-xs font-medium text-zinc-400">
                  {turno.turnoNombre}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Novedades del día */}
      <div className="rounded-2xl border border-[#1e293b] bg-[#0c142b] p-5 shadow-xl flex flex-col justify-between">
        <h4 className="text-sm font-bold text-white tracking-tight">
          Novedades del día
        </h4>

        <div className="space-y-3 pt-2 text-xs">
          {novedades.map((nov) => {
            let Icon = Info;
            let iconColor = 'text-blue-400';
            let bgIcon = 'bg-blue-500/15 border-blue-500/30';

            if (nov.tipo === 'TARDE') {
              Icon = Clock;
              iconColor = 'text-amber-400';
              bgIcon = 'bg-amber-500/15 border-amber-500/30';
            } else if (nov.tipo === 'SALIDA_TEMPORAL') {
              Icon = Pause;
              iconColor = 'text-emerald-400';
              bgIcon = 'bg-emerald-500/15 border-emerald-500/30';
            } else if (nov.tipo === 'LIMPIEZA') {
              Icon = CheckCircle2;
              iconColor = 'text-emerald-400';
              bgIcon = 'bg-emerald-500/15 border-emerald-500/30';
            } else if (nov.tipo === 'AUSENTE') {
              Icon = XCircle;
              iconColor = 'text-pink-400';
              bgIcon = 'bg-pink-500/15 border-pink-500/30';
            }

            return (
              <div key={nov.id} className="flex items-center gap-3">
                <span className="font-mono text-zinc-400 font-medium shrink-0">
                  {nov.hora}
                </span>
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${bgIcon} ${iconColor}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate flex-1">
                  <span className="font-semibold text-white mr-1.5">
                    {nov.empleado}
                  </span>
                  <span className="text-zinc-400">{nov.evento}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
