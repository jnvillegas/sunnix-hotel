'use client';

import type { HabitacionCardData, EstadoHabitacion } from '@/types';
import { RoomTimer } from './RoomTimer';
import {
  Car,
  CheckCircle2,
  Clock,
  Moon,
  Receipt,
  Sparkles,
  Users,
  Wrench,
  AlertTriangle,
} from 'lucide-react';

interface RoomCardProps {
  room: HabitacionCardData;
  onSelect?: (room: HabitacionCardData) => void;
  onWarningAlert?: (room: HabitacionCardData) => void;
  onRoomService?: (room: HabitacionCardData) => void;
}

export function RoomCard({ room, onSelect, onWarningAlert, onRoomService }: RoomCardProps) {
  const { estado_actual, numero, categoria, estadia_activa } = room;

  const config = getStatusVisualConfig(estado_actual);

  return (
    <div
      onClick={() => onSelect?.(room)}
      className={`group relative flex flex-col justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none ${config.cardStyles}`}
    >
      {/* Top Header: Room Number & Status Badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white group-hover:text-zinc-100">
            {numero}
          </span>
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mt-0.5 truncate max-w-[110px]">
            {categoria.nombre}
          </p>
        </div>

        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider border ${config.badgeStyles}`}
        >
          {config.icon}
          <span>{config.label}</span>
        </div>
      </div>

      {/* Middle/Bottom: Active Stay Info or Status Details */}
      <div className="mt-3 pt-2.5 border-t border-[#27272a]/60 flex flex-col gap-1.5">
        {estadia_activa ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-1">
              <RoomTimer
                fechaVencimiento={estadia_activa.fecha_vencimiento_estimada}
                onWarning={() => onWarningAlert?.(room)}
              />

              {estadia_activa.es_pernocte && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono bg-indigo-950/50 text-indigo-300 border border-indigo-500/30">
                  <Moon className="w-2.5 h-2.5" />
                  <span>PERNOCTE</span>
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-1 text-[11px] font-mono text-zinc-400">
              {estadia_activa.patente_vehiculo ? (
                <div className="flex items-center gap-1">
                  <Car className="w-3 h-3 text-zinc-500 shrink-0" />
                  <span className="tracking-wider bg-zinc-900/80 px-1 rounded text-zinc-300">
                    {estadia_activa.patente_vehiculo}
                  </span>
                </div>
              ) : (
                <span />
              )}

              {/* Botón rápido de Room Service */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRoomService?.(room);
                }}
                title="Cargar Room Service / Bar"
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-800/80 hover:bg-amber-500 hover:text-black border border-zinc-700/60 text-amber-300 text-[10px] font-mono transition-colors cursor-pointer"
              >
                <span>Bar</span>
                {estadia_activa.monto_consumos ? (
                  <span className="font-bold text-white group-hover:text-black">
                    (${Math.round(estadia_activa.monto_consumos / 1000)}k)
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 py-0.5">
            <span className="text-[10px] uppercase tracking-wide">
              {config.hint}
            </span>
            <span className="text-[9px] opacity-60">Fondo libre</span>
          </div>
        )}
      </div>

      {/* Pulsing indicator dot on top right corner */}
      <div className="absolute top-2 right-2 flex h-2 w-2">
        {estado_actual === 'POR_VENCER' && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${config.dotColor}`}
        />
      </div>
    </div>
  );
}

function getStatusVisualConfig(estado: EstadoHabitacion) {
  switch (estado) {
    case 'LIBRE':
      return {
        label: 'Libre',
        hint: 'Disponible',
        icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
        dotColor: 'bg-emerald-500',
        badgeStyles: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400',
        cardStyles:
          'bg-[#121217] border-emerald-500/20 hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-950/20',
      };
    case 'OCUPADA':
      return {
        label: 'Ocupada',
        hint: 'En Estadía',
        icon: <Users className="w-3 h-3 text-red-400" />,
        dotColor: 'bg-red-500',
        badgeStyles: 'bg-red-950/40 border-red-500/30 text-red-400',
        cardStyles:
          'bg-[#121217] border-red-500/30 hover:border-red-500/60 hover:shadow-lg hover:shadow-red-950/20',
      };
    case 'POR_VENCER':
      return {
        label: 'Por Vencer',
        hint: 'Límite Turno',
        icon: <AlertTriangle className="w-3 h-3 text-amber-400" />,
        dotColor: 'bg-amber-400',
        badgeStyles:
          'bg-amber-950/60 border-amber-500/60 text-amber-300 animate-pulse',
        cardStyles:
          'bg-[#14120f] border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50 animate-pulse',
      };
    case 'EN_COBRO':
      return {
        label: 'En Cobro',
        hint: 'Salida Pedida',
        icon: <Receipt className="w-3 h-3 text-purple-400" />,
        dotColor: 'bg-purple-500',
        badgeStyles: 'bg-purple-950/40 border-purple-500/30 text-purple-300',
        cardStyles:
          'bg-[#14111c] border-purple-500/40 hover:border-purple-500/70 hover:shadow-lg hover:shadow-purple-950/20',
      };
    case 'LIMPIEZA':
      return {
        label: 'Limpieza',
        hint: 'Mucama',
        icon: <Sparkles className="w-3 h-3 text-cyan-400" />,
        dotColor: 'bg-cyan-500',
        badgeStyles: 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300',
        cardStyles:
          'bg-[#0f1418] border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-950/20',
      };
    case 'MANTENIMIENTO':
    case 'BLOQUEADA':
    default:
      return {
        label: estado === 'BLOQUEADA' ? 'Bloqueada' : 'Mantenim.',
        hint: 'Fuera Servicio',
        icon: <Wrench className="w-3 h-3 text-zinc-400" />,
        dotColor: 'bg-zinc-500',
        badgeStyles: 'bg-zinc-900 border-zinc-700 text-zinc-400',
        cardStyles:
          'bg-[#121217]/50 border-zinc-800 opacity-70 hover:opacity-100 hover:border-zinc-700',
      };
  }
}
