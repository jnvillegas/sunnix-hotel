'use client';

import React, { useState } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, Check, DollarSign } from 'lucide-react';
import type { RegistrarMovimientoManualInput } from '@/types';

interface RegistrarMovimientoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipoDefault: 'INGRESO' | 'EGRESO';
  onConfirm: (input: RegistrarMovimientoManualInput) => Promise<void>;
}

export function RegistrarMovimientoModal({
  isOpen,
  onClose,
  tipoDefault,
  onConfirm,
}: RegistrarMovimientoModalProps) {
  const [tipo, setTipo] = useState<'INGRESO' | 'EGRESO'>(tipoDefault);
  const [concepto, setConcepto] = useState('');
  const [habitacionNumero, setHabitacionNumero] = useState('');
  const [medioPago, setMedioPago] =
    useState<RegistrarMovimientoManualInput['medioPago']>('Efectivo');
  const [importe, setImporte] = useState<number>(0);
  const [observaciones, setObservaciones] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concepto.trim() || importe <= 0) return;

    setIsSubmitting(true);
    try {
      await onConfirm({
        tipo,
        concepto: concepto.trim(),
        habitacionNumero: habitacionNumero.trim() || undefined,
        medioPago,
        importe,
        observaciones: observaciones.trim() || undefined,
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
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                tipo === 'INGRESO'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-pink-500/15 border-pink-500/30 text-pink-400'
              }`}
            >
              {tipo === 'INGRESO' ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownLeft className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Registrar {tipo === 'INGRESO' ? 'Ingreso' : 'Egreso'} de Caja
              </h3>
              <p className="text-xs text-zinc-400">
                Movimiento directo en el turno activo.
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
          {/* Tipo Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTipo('INGRESO')}
              className={`py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                tipo === 'INGRESO'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : 'bg-[#111a38] text-zinc-400 border-[#1e293b] hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Ingreso</span>
            </button>
            <button
              type="button"
              onClick={() => setTipo('EGRESO')}
              className={`py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                tipo === 'EGRESO'
                  ? 'bg-pink-600 text-white border-pink-500 shadow-sm'
                  : 'bg-[#111a38] text-zinc-400 border-[#1e293b] hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Egreso</span>
            </button>
          </div>

          {/* Concepto */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Concepto / Motivo
            </label>
            <input
              type="text"
              required
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej: Compra artículos limpieza, Consumo minibar..."
              className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Importe */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Importe ($ ARS)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-mono">
                $
              </span>
              <input
                type="number"
                required
                min={1}
                step={50}
                value={importe || ''}
                onChange={(e) => setImporte(Number(e.target.value))}
                placeholder="0"
                className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl pl-8 pr-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Medio de pago */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Medio de pago
              </label>
              <select
                value={medioPago}
                onChange={(e) =>
                  setMedioPago(
                    e.target.value as RegistrarMovimientoManualInput['medioPago']
                  )
                }
                className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            {/* Habitación (opcional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Habitación (opcional)
              </label>
              <input
                type="text"
                value={habitacionNumero}
                onChange={(e) => setHabitacionNumero(e.target.value)}
                placeholder="Ej: 102"
                className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Observaciones / Comprobante
            </label>
            <input
              type="text"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Número de ticket o factura..."
              className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Actions */}
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
              disabled={isSubmitting || importe <= 0 || !concepto.trim()}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50 text-white ${
                tipo === 'INGRESO'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/30'
                  : 'bg-pink-600 hover:bg-pink-500 shadow-pink-950/30'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Guardando...' : 'Confirmar movimiento'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
