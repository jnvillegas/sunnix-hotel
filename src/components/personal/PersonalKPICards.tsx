'use client';

import React from 'react';
import { UserCheck, Users, UserX, Clock, Coffee } from 'lucide-react';
import type { PersonalKPIData } from '@/types';

interface PersonalKPICardsProps {
  kpis: PersonalKPIData;
}

export function PersonalKPICards({ kpis }: PersonalKPICardsProps) {
  const cards = [
    {
      title: 'Personal total',
      value: kpis.total,
      icon: Users,
      cardBg: 'bg-[#0e2124] border-[#163a3d]',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      valueColor: 'text-white',
    },
    {
      title: 'Presentes',
      value: kpis.presentes,
      icon: UserCheck,
      cardBg: 'bg-[#0e2124] border-[#163a3d]',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      valueColor: 'text-white',
    },
    {
      title: 'Ausente',
      value: kpis.ausentes,
      icon: UserX,
      cardBg: 'bg-[#26151f] border-[#491f34]',
      iconBg: 'bg-pink-500/15 border-pink-500/30 text-pink-400',
      valueColor: 'text-white',
    },
    {
      title: 'Llegada tarde',
      value: kpis.llegadaTarde,
      icon: Clock,
      cardBg: 'bg-[#231b15] border-[#442f1f]',
      iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      valueColor: 'text-white',
    },
    {
      title: 'En descanso',
      value: kpis.enDescanso,
      icon: Coffee,
      cardBg: 'bg-[#1b1328] border-[#3b1d5c]',
      iconBg: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
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
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${c.iconBg}`}
            >
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
