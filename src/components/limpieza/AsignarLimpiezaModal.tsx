'use client';

import React, { useState } from 'react';
import { X, Sparkles, User, Clock, Check } from 'lucide-react';
import type { HabitacionLimpiezaCardData, PersonalMucamaItem } from '@/types';

interface AsignarLimpiezaModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitaciones: HabitacionLimpiezaCardData[];
  personalMucamas: PersonalMucamaItem[];
  preSelectedHabitacionId?: string;
  onConfirmAsignacion: (data: {
    habitacionId: string;
    personalId: string;
    tiempoEstimadoMinutos: number;
    observaciones: string;
  }) => Promise<void>;
  isReasignar?: boolean;
}

export function AsignarLimpiezaModal({
  isOpen,
  onClose,
  habitaciones,
  personalMucamas,
  preSelectedHabitacionId,
  onConfirmAsignacion,
  isReasignar = false,
}: AsignarLimpiezaModalProps) {
  const [habitacionId, setHabitacionId] = useState(
    preSelectedHabitacionId || habitaciones[0]?.id || ''
  );
  const [personalId, setPersonalId] = useState(personalMucamas[0]?.id || '');
  const [tiempoMinutos, setTiempoMinutos] = useState(20);
  const [observaciones, setObservaciones] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmAsignacion({
        habitacionId,
        personalId,
        tiempoEstimadoMinutos: tiempoMinutos,
        observaciones,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0c142b] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {isReasignar ? 'Reasignar personal de limpieza' : 'Asignar nueva limpieza'}
              </h3>
              <p className="text-xs text-zinc-400">
                Seleccioná la habitación y la mucama responsable.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Habitación selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Habitación
            </label>
            <select
              value={habitacionId}
              onChange={(e) => setHabitacionId(e.target.value)}
              className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {habitaciones.map((h) => (
                <option key={h.id} value={h.id}>
                  Habitación {h.numero} ({h.categoria}) - {h.estado}
                </option>
              ))}
            </select>
          </div>

          {/* Personal Mucama */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Personal asignado
            </label>
            <select
              value={personalId}
              onChange={(e) => setPersonalId(e.target.value)}
              className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {personalMucamas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} ({p.puesto}) - {p.habitacionesAsignadas} asignadas
                </option>
              ))}
            </select>
          </div>

          {/* Tiempo estimado */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Tiempo estimado (minutos)
            </label>
            <div className="flex items-center gap-2">
              {[15, 20, 25, 30].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setTiempoMinutos(mins)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer ${
                    tiempoMinutos === mins
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-[#111a38] text-zinc-400 border-[#1e293b] hover:text-white'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Instrucciones / Observaciones especiales
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              placeholder="Ej: Reponer toallones extra, revisar frigobar..."
              className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 resize-none transition-colors"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1e293b]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md shadow-blue-900/30 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Guardando...' : 'Confirmar asignación'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
