'use client';

import React from 'react';
import { Bed, BedDouble, Sparkles, Wrench } from 'lucide-react';
import type { RackKPIs } from '@/types';

interface HabitacionesKPICardsProps {
  kpis: RackKPIs;
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

export function HabitacionesKPICards({
  kpis,
  activeFilter,
  onSelectFilter,
}: HabitacionesKPICardsProps) {
  const cards = [
    {
      id: 'TODOS',
      label: 'Total habitaciones',
      count: kpis.total,
      icon: BedDouble,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10 border-purple-500/20',
      borderActive: 'border-purple-500',
    },
    {
      id: 'LIBRE',
      label: 'Disponibles',
      count: kpis.libres,
      icon: Bed,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      borderActive: 'border-emerald-500',
    },
    {
      id: 'OCUPADA',
      label: 'Ocupadas',
      count: kpis.ocupadas + kpis.por_vencer,
      icon: BedDouble,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      borderActive: 'border-blue-500',
    },
    {
      id: 'LIMPIEZA',
      label: 'En limpieza',
      count: kpis.limpieza,
      icon: Sparkles,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      borderActive: 'border-amber-500',
    },
    {
      id: 'MANTENIMIENTO',
      label: 'Mantenimiento',
      count: kpis.mantenimiento,
      icon: Wrench,
      iconColor: 'text-pink-400',
      iconBg: 'bg-pink-500/10 border-pink-500/20',
      borderActive: 'border-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((c) => {
        const Icon = c.icon;
        const isActive = activeFilter === c.id;

        return (
          <div
            key={c.id}
            onClick={() => onSelectFilter(c.id)}
            className={`p-3.5 rounded-2xl bg-[#0f172a] border transition-all duration-200 cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md ${
              isActive
                ? `${c.borderActive} ring-1 ${c.borderActive}`
                : 'border-[#1e293b] hover:border-slate-700'
            }`}
          >
            <div>
              <p className="text-xl font-bold font-mono text-white leading-tight">
                {c.count}
              </p>
              <p className="text-[11px] font-medium text-zinc-400 mt-0.5">
                {c.label}
              </p>
            </div>
            <div className={`p-2.5 rounded-xl border ${c.iconBg} ${c.iconColor}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
