'use client';

import React from 'react';
import type { OperacionTiemposConfig } from '@/types';
import { Clock, Bell, Moon, Users, Timer } from 'lucide-react';

interface OperacionConfigTabProps {
  config: OperacionTiemposConfig;
  onChange: (updated: Partial<OperacionTiemposConfig>) => void;
}

export function OperacionConfigTab({ config, onChange }: OperacionConfigTabProps) {
  return (
    <div className="bg-[#0b1329] border border-[#1e293b] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="border-b border-[#1e293b] pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          <span>Reglas operativas de tiempo y temporizadores</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Parámetros para el motor de tarifación automática, tolerancias de gracia y avisos preventivos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Tolerancia de Gracia */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <Timer className="w-4 h-4" />
            <span>Tolerancia de gracia (Grace Period)</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Minutos adicionales sin cobro tras el vencimiento del turno.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="60"
              value={config.toleranciaGraciaMinutos}
              onChange={(e) =>
                onChange({ toleranciaGraciaMinutos: parseInt(e.target.value, 10) || 0 })
              }
              className="w-24 bg-[#0b1329] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold text-center focus:outline-none focus:border-blue-500"
            />
            <span className="text-xs text-zinc-300 font-semibold">minutos</span>
          </div>
        </div>

        {/* Alerta por Vencer */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <Bell className="w-4 h-4" />
            <span>Preaviso por vencer (Alerta visual)</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Anticipación para que el rack cambie a estado &quot;Por Vencer&quot;.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="5"
              max="60"
              value={config.alertaVencimientoMinutos}
              onChange={(e) =>
                onChange({ alertaVencimientoMinutos: parseInt(e.target.value, 10) || 5 })
              }
              className="w-24 bg-[#0b1329] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold text-center focus:outline-none focus:border-blue-500"
            />
            <span className="text-xs text-zinc-300 font-semibold">minutos antes</span>
          </div>
        </div>

        {/* Fracción de Hora Extra */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] space-y-2">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold">
            <Clock className="w-4 h-4" />
            <span>Bloque de fracción extra</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Duración mínima computada por cada fracción de tiempo extra.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="15"
              step="15"
              value={config.bloqueExtraMinutos}
              onChange={(e) =>
                onChange({ bloqueExtraMinutos: parseInt(e.target.value, 10) || 30 })
              }
              className="w-24 bg-[#0b1329] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold text-center focus:outline-none focus:border-blue-500"
            />
            <span className="text-xs text-zinc-300 font-semibold">minutos</span>
          </div>
        </div>

        {/* Inicio Pernocte */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] space-y-2">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
            <Moon className="w-4 h-4" />
            <span>Horario habilitado Pernocte</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            A partir de qué hora nocturna aplica la tarifa plana de noche.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={config.horarioInicioPernocte}
              onChange={(e) => onChange({ horarioInicioPernocte: e.target.value })}
              className="bg-[#0b1329] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-blue-500"
            />
            <span className="text-xs text-zinc-400">hs</span>
          </div>
        </div>

        {/* Salida Límite Pernocte */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] space-y-2">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
            <Moon className="w-4 h-4" />
            <span>Check-out límite Pernocte</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Hora tope del día siguiente para la desocupación de la suite.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={config.horarioFinPernocte}
              onChange={(e) => onChange({ horarioFinPernocte: e.target.value })}
              className="bg-[#0b1329] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-blue-500"
            />
            <span className="text-xs text-zinc-400">hs del mediodía</span>
          </div>
        </div>

        {/* Personas Adicionales */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
            <Users className="w-4 h-4" />
            <span>Personas extras / Tripletas</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Capacidad base (2 pax) y recargo por cada huésped extra.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">$</span>
            <input
              type="number"
              min="0"
              step="500"
              value={config.recargoPersonaAdicional}
              onChange={(e) =>
                onChange({ recargoPersonaAdicional: parseFloat(e.target.value) || 0 })
              }
              className="w-28 bg-[#0b1329] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-blue-500"
            />
            <span className="text-[11px] text-zinc-400">/ persona</span>
          </div>
        </div>
      </div>
    </div>
  );
}
