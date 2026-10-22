'use client';

import React, { useState } from 'react';
import { X, Clock, Check } from 'lucide-react';
import type { EmpleadoAsistenciaItem, RegistrarMarcacionInput } from '@/types';

interface RegistrarAsistenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  empleados: EmpleadoAsistenciaItem[];
  preSelectedEmpleadoId?: string;
  onConfirmMarcacion: (input: RegistrarMarcacionInput) => Promise<void>;
}

export function RegistrarAsistenciaModal({
  isOpen,
  onClose,
  empleados,
  preSelectedEmpleadoId,
  onConfirmMarcacion,
}: RegistrarAsistenciaModalProps) {
  const [empleadoId, setEmpleadoId] = useState(
    preSelectedEmpleadoId || empleados[0]?.id || ''
  );
  const [tipo, setTipo] = useState<RegistrarMarcacionInput['tipo']>('INGRESO');
  const [observaciones, setObservaciones] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onConfirmMarcacion({
        empleadoId,
        tipo,
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
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Registrar marcación de asistencia
              </h3>
              <p className="text-xs text-zinc-400">
                Asentá ingresos, relevos o descansos del personal.
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
          {/* Empleado Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Colaborador
            </label>
            <select
              value={empleadoId}
              onChange={(e) => setEmpleadoId(e.target.value)}
              className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {empleados.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.nombreCompleto} ({emp.cargo}) - {emp.turno}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Marcación */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Tipo de marcación
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'INGRESO', label: 'Ingreso al turno' },
                { id: 'SALIDA', label: 'Salida de turno' },
                { id: 'DESCANSO_INICIO', label: 'Inicio almuerzo/descanso' },
                { id: 'DESCANSO_FIN', label: 'Fin descanso' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTipo(item.id as RegistrarMarcacionInput['tipo'])}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                    tipo === item.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                      : 'bg-[#111a38] text-zinc-400 border-[#1e293b] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Novedad u observación (opcional)
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              placeholder="Ej: Retraso justificado, relevo de guardia..."
              className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 resize-none transition-colors"
            />
          </div>

          {/* Submit */}
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
              <span>{isSubmitting ? 'Registrando...' : 'Confirmar marcación'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
