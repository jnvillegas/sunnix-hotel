'use client';

import React from 'react';
import { Building2, Clock, DollarSign, ShieldCheck, Cpu } from 'lucide-react';

export type TabKey = 'general' | 'operacion' | 'tarifas' | 'seguridad' | 'domotica';

interface ConfiguracionTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function ConfiguracionTabs({ activeTab, onTabChange }: ConfiguracionTabsProps) {
  const tabs = [
    { id: 'general' as TabKey, label: 'General & Hotel', icon: Building2 },
    { id: 'operacion' as TabKey, label: 'Operación & Tiempos', icon: Clock },
    { id: 'tarifas' as TabKey, label: 'Motor de Tarifas', icon: DollarSign },
    { id: 'seguridad' as TabKey, label: 'Caja & Seguridad', icon: ShieldCheck },
    { id: 'domotica' as TabKey, label: 'Domótica & Relés IoT', icon: Cpu },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-[#1e293b] pb-2 overflow-x-auto scrollbar-none">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeTab === t.id;

        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onTabChange(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              isActive
                ? 'bg-[#2563eb] text-white border-blue-500 shadow-md shadow-blue-900/20'
                : 'bg-[#0c142b] text-zinc-400 border-[#1e293b] hover:text-white hover:bg-slate-800'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
