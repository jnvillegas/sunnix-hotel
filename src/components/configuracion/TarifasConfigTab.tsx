'use client';

import React from 'react';
import type { TarifaCategoriaConfig } from '@/types';
import { DollarSign, BedDouble } from 'lucide-react';

interface TarifasConfigTabProps {
  tarifas: TarifaCategoriaConfig[];
  onChange: (updated: TarifaCategoriaConfig[]) => void;
}

export function TarifasConfigTab({ tarifas, onChange }: TarifasConfigTabProps) {
  const handleUpdate = (
    index: number,
    field: keyof Omit<TarifaCategoriaConfig, 'id' | 'categoria'>,
    val: number
  ) => {
    const updated = [...tarifas];
    updated[index] = {
      ...updated[index],
      [field]: val,
    };
    onChange(updated);
  };

  return (
    <div className="bg-[#0b1329] border border-[#1e293b] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="border-b border-[#1e293b] pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-blue-400" />
          <span>Matriz de tarifas por categoría de suite</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Valores base para turnos express (2h y 3h), tarifa nocturna plana y horas adicionales.
        </p>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-[#080d1d] text-zinc-400 border-b border-[#1e293b] text-[11px] font-semibold uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-4 py-3">Categoría de Suite</th>
              <th scope="col" className="px-4 py-3">Turno 2 Horas</th>
              <th scope="col" className="px-4 py-3">Turno 3 Horas</th>
              <th scope="col" className="px-4 py-3">Pernocte Completo</th>
              <th scope="col" className="px-4 py-3">Hora Extra</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]/60">
            {tarifas.map((t, idx) => (
              <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                {/* Categoría */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                      <BedDouble className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">{t.categoria}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{t.id}</div>
                    </div>
                  </div>
                </td>

                {/* Turno 2h */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-400 font-mono text-xs">$</span>
                    <input
                      type="number"
                      step="500"
                      min="0"
                      value={t.turno2h}
                      onChange={(e) =>
                        handleUpdate(idx, 'turno2h', parseFloat(e.target.value) || 0)
                      }
                      className="w-28 bg-[#080d1d] border border-[#1e293b] rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </td>

                {/* Turno 3h */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-400 font-mono text-xs">$</span>
                    <input
                      type="number"
                      step="500"
                      min="0"
                      value={t.turno3h}
                      onChange={(e) =>
                        handleUpdate(idx, 'turno3h', parseFloat(e.target.value) || 0)
                      }
                      className="w-28 bg-[#080d1d] border border-[#1e293b] rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </td>

                {/* Pernocte */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-400 font-mono text-xs">$</span>
                    <input
                      type="number"
                      step="1000"
                      min="0"
                      value={t.pernocte}
                      onChange={(e) =>
                        handleUpdate(idx, 'pernocte', parseFloat(e.target.value) || 0)
                      }
                      className="w-28 bg-[#080d1d] border border-[#1e293b] rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </td>

                {/* Hora Extra */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-400 font-mono text-xs">$</span>
                    <input
                      type="number"
                      step="500"
                      min="0"
                      value={t.horaExtra}
                      onChange={(e) =>
                        handleUpdate(idx, 'horaExtra', parseFloat(e.target.value) || 0)
                      }
                      className="w-28 bg-[#080d1d] border border-[#1e293b] rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
