'use client';

import React from 'react';
import { Calendar, Moon, Clock, BedDouble } from 'lucide-react';
import type { TurnosKPIData } from '@/types';

interface TurnosKPICardsProps {
  kpis: TurnosKPIData;
}

export function TurnosKPICards({ kpis }: TurnosKPICardsProps) {
  const cards = [
    {
      title: 'Reservas del día',
      value: kpis.reservasHoy,
      icon: Calendar,
      cardBg: 'bg-[#101c38] border-[#1d3161]',
      iconBg: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
    },
    {
      title: 'Pernoctes activos',
      value: kpis.pernoctesActivos,
      icon: Moon,
      cardBg: 'bg-[#1b1328] border-[#3b1d5c]',
      iconBg: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
    },
    {
      title: 'En espera / Check-in',
      value: kpis.enEspera,
      icon: Clock,
      cardBg: 'bg-[#231b15] border-[#442f1f]',
      iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    },
    {
      title: 'Disponibilidad estimada',
      value: `${kpis.disponibilidadPorcentaje}%`,
      icon: BedDouble,
      cardBg: 'bg-[#0e2124] border-[#163a3d]',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`p-4 rounded-2xl border ${c.cardBg} flex items-center gap-3.5 transition-all hover:scale-[1.01] shadow-lg`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${c.iconBg}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold tracking-tight text-white">
                {c.value}
              </div>
              <div className="text-[11px] font-medium text-zinc-400 mt-0.5">
                {c.title}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
