'use client';

import React from 'react';
import { DollarSign, TrendingUp, BedDouble, Users, ArrowUp, Minus } from 'lucide-react';
import type { ReporteKPIs } from '@/types';

interface ReportKPICardsProps {
  kpis: ReporteKPIs;
}

export function ReportKPICards({ kpis }: ReportKPICardsProps) {
  const cards = [
    {
      title: 'Ingresos del período',
      value: `$ ${kpis.ingresos.valor.toLocaleString('es-AR')}`,
      variation: `↑ ${kpis.ingresos.variacionPorcentaje}% vs. mes anterior`,
      isPositive: true,
      icon: DollarSign,
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-400',
      numberColor: 'text-white',
    },
    {
      title: 'Egresos del período',
      value: `$ ${kpis.egresos.valor.toLocaleString('es-AR')}`,
      variation: `↑ ${kpis.egresos.variacionPorcentaje}% vs. mes anterior`,
      isPositive: false,
      icon: TrendingUp,
      iconBg: 'bg-pink-500/10 border-pink-500/20',
      iconColor: 'text-pink-400',
      numberColor: 'text-white',
    },
    {
      title: 'Ocupación promedio',
      value: `${kpis.ocupacionPromedio.valor}%`,
      variation: `↑ ${kpis.ocupacionPromedio.variacionPorcentaje}% vs. mes anterior`,
      isPositive: true,
      icon: BedDouble,
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      iconColor: 'text-blue-400',
      numberColor: 'text-white',
    },
    {
      title: 'Personal activo',
      value: `${kpis.personalActivo}`,
      variation: '— Sin cambios',
      isNeutral: true,
      icon: Users,
      iconBg: 'bg-purple-500/10 border-purple-500/20',
      iconColor: 'text-purple-400',
      numberColor: 'text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;

        return (
          <div
            key={c.title}
            className="p-4 rounded-2xl bg-[#0f172a] border border-[#1e293b] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-1">
              <p className="text-2xl font-bold font-mono tracking-tight text-white">
                {c.value}
              </p>
              <p className="text-xs text-zinc-400 font-medium">{c.title}</p>
              <p
                className={`text-[11px] font-mono font-medium flex items-center gap-1 ${
                  c.isNeutral
                    ? 'text-zinc-500'
                    : c.isPositive
                    ? 'text-emerald-400'
                    : 'text-pink-400'
                }`}
              >
                {c.variation}
              </p>
            </div>

            <div className={`p-3 rounded-2xl border ${c.iconBg} ${c.iconColor}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
