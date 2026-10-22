'use client';

import { useState } from 'react';
import type { RackKPIs } from '@/types';
import { alertSound } from '@/lib/audio/alertSound';
import {
  AlertTriangle,
  BedDouble,
  CheckCircle2,
  Sparkles,
  Users,
  Volume2,
  VolumeX,
  Wrench,
} from 'lucide-react';

interface RackKPIBarProps {
  kpis: RackKPIs;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export function RackKPIBar({ kpis, activeFilter = 'TODOS', onFilterChange }: RackKPIBarProps) {
  const [muted, setMuted] = useState<boolean>(alertSound.getMuted());

  const toggleSound = () => {
    const next = !muted;
    alertSound.setMuted(next);
    setMuted(next);
  };

  return (
    <div className="bg-[#121217] border border-[#27272a] rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Counters Grid */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Total */}
        <button
          onClick={() => onFilterChange?.('TODOS')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
            activeFilter === 'TODOS'
              ? 'bg-zinc-800 border-zinc-600 text-white'
              : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <BedDouble className="w-3.5 h-3.5 text-zinc-400" />
          <span>Total:</span>
          <span className="font-bold text-white">{kpis.total}</span>
        </button>

        {/* Libres */}
        <button
          onClick={() => onFilterChange?.('LIBRE')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
            activeFilter === 'LIBRE'
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Libres:</span>
          <span className="font-bold">{kpis.libres}</span>
        </button>

        {/* Ocupadas */}
        <button
          onClick={() => onFilterChange?.('OCUPADA')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
            activeFilter === 'OCUPADA'
              ? 'bg-red-950/80 border-red-500 text-red-300'
              : 'bg-red-950/30 border-red-500/30 text-red-400 hover:border-red-500/60'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Ocupadas:</span>
          <span className="font-bold">{kpis.ocupadas}</span>
        </button>

        {/* Por Vencer */}
        {kpis.por_vencer > 0 && (
          <button
            onClick={() => onFilterChange?.('POR_VENCER')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer animate-pulse ${
              activeFilter === 'POR_VENCER'
                ? 'bg-amber-950/80 border-amber-500 text-amber-200'
                : 'bg-amber-950/50 border-amber-500/60 text-amber-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Por Vencer:</span>
            <span className="font-bold">{kpis.por_vencer}</span>
          </button>
        )}

        {/* Limpieza */}
        <button
          onClick={() => onFilterChange?.('LIMPIEZA')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
            activeFilter === 'LIMPIEZA'
              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200'
              : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300 hover:border-cyan-500/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Limpieza:</span>
          <span className="font-bold">{kpis.limpieza}</span>
        </button>

        {/* Mantenimiento */}
        {kpis.mantenimiento > 0 && (
          <button
            onClick={() => onFilterChange?.('MANTENIMIENTO')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
              activeFilter === 'MANTENIMIENTO'
                ? 'bg-zinc-800 border-zinc-600 text-zinc-200'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Mantenim.:</span>
            <span className="font-bold">{kpis.mantenimiento}</span>
          </button>
        )}
      </div>

      {/* Right: Occupancy Rate and Sound Toggle */}
      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
        {/* Occupancy bar */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block leading-none">
              Ocupación
            </span>
            <span className="text-sm font-bold font-mono text-white leading-tight">
              {kpis.porcentaje_ocupacion}%
            </span>
          </div>
          <div className="w-20 sm:w-24 h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 transition-all duration-500"
              style={{ width: `${kpis.porcentaje_ocupacion}%` }}
            />
          </div>
        </div>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          title={muted ? 'Activar alertas de sonido' : 'Silenciar alertas'}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            muted
              ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
              : 'bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800'
          }`}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
