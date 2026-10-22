'use client';

import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Scale, TrendingUp } from 'lucide-react';
import type { IngresosEgresosKPIData } from '@/types';

interface IngresosEgresosKPICardsProps {
  kpis: IngresosEgresosKPIData;
}

export function IngresosEgresosKPICards({ kpis }: IngresosEgresosKPICardsProps) {
  const formatMonto = (val: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cards = [
    {
      title: 'Total Ingresos',
      value: formatMonto(kpis.totalIngresos),
      badge: '+18.4% vs mes ant.',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: ArrowDownLeft,
      cardBg: 'bg-[#0b221d] border-[#13493b]',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    },
    {
      title: 'Total Egresos',
      value: formatMonto(kpis.totalEgresos),
      badge: '-4.2% controlado',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      icon: ArrowUpRight,
      cardBg: 'bg-[#291319] border-[#531f2d]',
      iconBg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
    },
    {
      title: 'Balance Neto',
      value: formatMonto(kpis.balanceNeto),
      badge: 'Superávit operativo',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      icon: Scale,
      cardBg: 'bg-[#101c38] border-[#1d3161]',
      iconBg: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
    },
    {
      title: 'Margen Operativo',
      value: `${kpis.margenOperativo.toFixed(1)}%`,
      badge: 'Objetivo > 65%',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      icon: TrendingUp,
      cardBg: 'bg-[#1b1328] border-[#3b1d5c]',
      iconBg: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`p-4 rounded-2xl border ${c.cardBg} flex flex-col justify-between transition-all hover:scale-[1.01] shadow-lg`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-zinc-300">
                {c.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${c.iconBg}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-extrabold tracking-tight text-white font-mono">
                {c.value}
              </div>
              <div className="mt-2 flex items-center">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.badgeColor}`}
                >
                  {c.badge}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
