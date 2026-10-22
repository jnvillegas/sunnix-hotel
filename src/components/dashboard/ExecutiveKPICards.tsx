'use client';

import React from 'react';
import { BedDouble, Wallet, AlertTriangle, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function ExecutiveKPICards() {
  const cards = [
    {
      title: 'Ocupación en vivo',
      value: '67%',
      detail: '8 ocupadas · 4 libres',
      badge: 'Alta rotación',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: BedDouble,
      cardBg: 'bg-[#0e2124] border-[#163a3d]',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      link: '/dashboard/habitaciones',
    },
    {
      title: 'Caja Turno 2 (Tarde)',
      value: '$ 224.500',
      detail: 'Saldo actual en tiempo real',
      badge: 'Turno abierto',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      icon: Wallet,
      cardBg: 'bg-[#101c38] border-[#1d3161]',
      iconBg: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
      link: '/dashboard/caja',
    },
    {
      title: 'Suites con atención',
      value: '2 Suites',
      detail: 'Suite 103 (12m) · Suite 104 (Cobro)',
      badge: 'Prioridad alta',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      icon: AlertTriangle,
      cardBg: 'bg-[#261c14] border-[#4c311c]',
      iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      link: '/dashboard/habitaciones',
    },
    {
      title: 'Housekeeping activo',
      value: '4 Mucamas',
      detail: '2 en limpieza · 2 disponibles',
      badge: 'Promedio 12 min',
      badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      icon: Sparkles,
      cardBg: 'bg-[#1b1328] border-[#3b1d5c]',
      iconBg: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
      link: '/dashboard/limpieza',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <Link
            key={i}
            href={c.link}
            className={`p-4 rounded-2xl border ${c.cardBg} flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-slate-500/50 shadow-lg cursor-pointer group`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
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
              <div className="text-[11px] text-zinc-400 mt-1 font-medium">
                {c.detail}
              </div>
              <div className="mt-2.5 flex items-center">
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.badgeColor}`}
                >
                  {c.badge}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
