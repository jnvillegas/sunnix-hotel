'use client';

import React from 'react';
import {
  BarChart3,
  BedDouble,
  DollarSign,
  Sparkles,
  Users,
  Package,
  TrendingUp,
} from 'lucide-react';

interface ReportTabsProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export function ReportTabs({ activeTab, onSelectTab }: ReportTabsProps) {
  const tabs = [
    { id: 'resumen', label: 'Resumen general', icon: BarChart3 },
    { id: 'habitaciones', label: 'Habitaciones', icon: BedDouble },
    { id: 'caja', label: 'Caja y recaudación', icon: DollarSign },
    { id: 'limpieza', label: 'Limpieza', icon: Sparkles },
    { id: 'personal', label: 'Personal', icon: Users },
    { id: 'insumos', label: 'Insumos', icon: Package },
    { id: 'rentabilidad', label: 'Rentabilidad', icon: TrendingUp },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? 'bg-[#2563eb] text-white shadow-md shadow-blue-900/30'
                : 'bg-[#0f172a] text-zinc-400 hover:text-white hover:bg-slate-800 border border-[#1e293b]'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
