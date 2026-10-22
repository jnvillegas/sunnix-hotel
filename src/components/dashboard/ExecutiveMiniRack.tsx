'use client';

import React from 'react';
import Link from 'next/link';
import { BedDouble, ArrowRight, Clock, User } from 'lucide-react';
import type { HabitacionCardData } from '@/types';

interface ExecutiveMiniRackProps {
  rooms: HabitacionCardData[];
}

export function ExecutiveMiniRack({ rooms }: ExecutiveMiniRackProps) {
  const getBadgeStyle = (estado: string) => {
    switch (estado) {
      case 'LIBRE':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'OCUPADA':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'POR_VENCER':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse';
      case 'EN_COBRO':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'LIMPIEZA':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      case 'MANTENIMIENTO':
        return 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30';
      default:
        return 'bg-slate-500/15 text-zinc-400 border-slate-500/30';
    }
  };

  const getLabel = (estado: string) => {
    switch (estado) {
      case 'LIBRE': return 'Disponible';
      case 'OCUPADA': return 'Ocupada';
      case 'POR_VENCER': return 'Por Vencer';
      case 'EN_COBRO': return 'En Cobro';
      case 'LIMPIEZA': return 'En Limpieza';
      case 'MANTENIMIENTO': return 'Mantenimiento';
      default: return estado;
    }
  };

  return (
    <div className="bg-[#0b1329] border border-[#1e293b] rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div className="flex items-center gap-2">
          <BedDouble className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white tracking-tight">
            Estado táctico de suites (Mini-Rack)
          </h2>
        </div>

        <Link
          href="/dashboard/habitaciones"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>Ir al Rack Completo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {rooms.map((room) => {
          const isOcupada = room.estado_actual === 'OCUPADA' || room.estado_actual === 'POR_VENCER' || room.estado_actual === 'EN_COBRO';
          const badgeClass = getBadgeStyle(room.estado_actual);
          const label = getLabel(room.estado_actual);

          return (
            <Link
              key={room.id}
              href="/dashboard/habitaciones"
              className="p-3 rounded-xl bg-[#080d1d] border border-[#1e293b] hover:border-slate-600 transition-all hover:scale-[1.02] flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-black text-white group-hover:text-blue-400 transition-colors">
                  {room.numero}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}
                >
                  {label}
                </span>
              </div>

              <div className="mt-2 text-[11px] text-zinc-400 truncate">
                {room.categoria.nombre}
              </div>

              <div className="mt-2 pt-2 border-t border-[#1e293b]/60 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                {isOcupada ? (
                  <span className="text-zinc-300 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-blue-400" />
                    Turno activo
                  </span>
                ) : (
                  <span>Lista para asignar</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
