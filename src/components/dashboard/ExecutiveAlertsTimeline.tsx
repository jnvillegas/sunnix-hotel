'use client';

import React from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CreditCard,
  Sparkles,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Coffee,
  CheckCircle2,
} from 'lucide-react';

export function ExecutiveAlertsTimeline() {
  const alerts = [
    {
      id: 'alt-1',
      suite: '103',
      tipo: 'POR_VENCER',
      title: 'Turno por vencer (12 min restantes)',
      desc: 'Suite Especial. Avisar al huésped por interfono para confirmar extensión o salida.',
      badge: 'Urgente',
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      actionLabel: 'Ver en Rack',
      actionUrl: '/dashboard/habitaciones',
    },
    {
      id: 'alt-2',
      suite: '104',
      tipo: 'EN_COBRO',
      title: 'Salida solicitada · Pre-cuenta lista',
      desc: 'Total $ 20.000 (Estadía $ 16.000 + Consumos frigobar $ 4.000). Cobro pendiente.',
      badge: 'Cobro',
      badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      icon: CreditCard,
      iconColor: 'text-purple-400',
      actionLabel: 'Cobrar ahora',
      actionUrl: '/dashboard/habitaciones',
    },
    {
      id: 'alt-3',
      suite: '105',
      tipo: 'LIMPIEZA',
      title: 'Limpieza prioritaria en espera',
      desc: 'Desocupada hace 14 min. Asignar mucama disponible para volver a dejarla Libre.',
      badge: 'Mucamas',
      badgeColor: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
      icon: Sparkles,
      iconColor: 'text-orange-400',
      actionLabel: 'Asignar',
      actionUrl: '/dashboard/limpieza',
    },
  ];

  const recentEvents = [
    {
      hora: '18:15',
      titulo: 'Egreso de caja por insumos',
      monto: '- $ 12.000',
      tipo: 'EGRESO',
      icono: ArrowUpRight,
      color: 'text-rose-400',
      operador: 'Lucía Díaz',
    },
    {
      hora: '17:05',
      titulo: 'Cobro estadía 2h · Suite 108',
      monto: '+ $ 16.000',
      tipo: 'INGRESO',
      icono: ArrowDownLeft,
      color: 'text-emerald-400',
      operador: 'Lucía Díaz',
    },
    {
      hora: '16:40',
      titulo: 'Cobro estadía 3h Jacuzzi · Suite 106',
      monto: '+ $ 20.000',
      tipo: 'INGRESO',
      icono: ArrowDownLeft,
      color: 'text-emerald-400',
      operador: 'Lucía Díaz',
    },
    {
      hora: '15:45',
      titulo: 'Comanda Bar despachada · Suite 102',
      monto: '+ $ 2.500',
      tipo: 'INGRESO',
      icono: Coffee,
      color: 'text-blue-400',
      operador: 'Lucía Díaz',
    },
    {
      hora: '15:10',
      titulo: 'Check-in express 2h · Suite 104',
      monto: '+ $ 16.000',
      tipo: 'INGRESO',
      icono: CheckCircle2,
      color: 'text-emerald-400',
      operador: 'Lucía Díaz',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Col 1: Alertas y Prioridades Operativas */}
      <div className="bg-[#0b1329] border border-[#1e293b] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">
                Alertas y prioridades del turno
              </h2>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              3 pendientes
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {alerts.map((alt) => {
              const Icon = alt.icon;

              return (
                <div
                  key={alt.id}
                  className="p-3.5 rounded-xl bg-[#080d1d] border border-[#1e293b] flex items-start justify-between gap-3 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                      <Icon className={`w-4 h-4 ${alt.iconColor}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">
                          {alt.title}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${alt.badgeColor}`}
                        >
                          {alt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                        {alt.desc}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={alt.actionUrl}
                    className="shrink-0 px-2.5 py-1.5 rounded-lg bg-[#2563eb]/20 hover:bg-[#2563eb] text-blue-300 hover:text-white border border-blue-500/30 text-[10px] font-semibold transition-all cursor-pointer"
                  >
                    {alt.actionLabel}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-zinc-500">
          <span>Actualizado en tiempo real</span>
          <Link href="/dashboard/habitaciones" className="text-blue-400 hover:underline">
            Gestionar habitaciones →
          </Link>
        </div>
      </div>

      {/* Col 2: Timeline de Actividad Reciente */}
      <div className="bg-[#0b1329] border border-[#1e293b] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white tracking-tight">
                Actividad reciente del turno
              </h2>
            </div>
            <Link
              href="/dashboard/ingresos-egresos"
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              Ver libro mayor →
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {recentEvents.map((evt, idx) => {
              const Icon = evt.icono;

              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#080d1d] border border-[#1e293b] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-zinc-400">
                      {evt.hora} hs
                    </span>
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      <Icon className={`w-3.5 h-3.5 ${evt.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {evt.titulo}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        Operador: {evt.operador}
                      </div>
                    </div>
                  </div>

                  <span className={`font-mono text-xs font-bold ${evt.color}`}>
                    {evt.monto}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between text-[11px] text-zinc-500">
          <span>Turno 2 (14:00 - 22:00)</span>
          <Link href="/dashboard/caja" className="text-blue-400 hover:underline">
            Ver detalle de caja →
          </Link>
        </div>
      </div>
    </div>
  );
}
