'use client';

import React from 'react';
import { BedDouble, Sparkles, Wrench, ShieldCheck, DoorOpen } from 'lucide-react';
import type { LimpiezaKPIData } from '@/types';

interface LimpiezaKPICardsProps {
  kpis: LimpiezaKPIData;
}

export function LimpiezaKPICards({ kpis }: LimpiezaKPICardsProps) {
  const cards = [
    {
      title: 'Total habitaciones',
      value: kpis.total,
      icon: BedDouble,
      cardBg: 'bg-[#12162b] border-[#20294e]',
      iconBg: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
      valueColor: 'text-white',
    },
    {
      title: 'Disponibles',
      value: kpis.disponibles,
      icon: DoorOpen,
      cardBg: 'bg-[#0e2124] border-[#163a3d]',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      valueColor: 'text-white',
    },
    {
      title: 'Ocupadas',
      value: kpis.ocupadas,
      icon: BedDouble,
      cardBg: 'bg-[#101c38] border-[#1d3161]',
      iconBg: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
      valueColor: 'text-white',
    },
    {
      title: 'En limpieza',
      value: kpis.enLimpieza,
      icon: Sparkles,
      cardBg: 'bg-[#231b15] border-[#442f1f]',
      iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      valueColor: 'text-white',
    },
    {
      title: 'Mantenimiento',
      value: kpis.mantenimiento,
      icon: Wrench,
      cardBg: 'bg-[#26151f] border-[#491f34]',
      iconBg: 'bg-pink-500/15 border-pink-500/30 text-pink-400',
      valueColor: 'text-white',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`p-4 rounded-2xl border ${c.cardBg} flex items-center gap-3.5 transition-all hover:scale-[1.01] shadow-lg`}
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${c.iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-2xl font-extrabold tracking-tight ${c.valueColor}`}>
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
