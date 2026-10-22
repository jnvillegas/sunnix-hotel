'use client';

import React, { useState } from 'react';
import { X, Calendar, Plus, Check } from 'lucide-react';
import type { NuevaReservaInput } from '@/types';

interface NuevaReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (input: NuevaReservaInput) => Promise<void>;
}

export function NuevaReservaModal({
  isOpen,
  onClose,
  onConfirm,
}: NuevaReservaModalProps) {
  const [habitacionId, setHabitacionId] = useState('hab-102');
  const [huespedNombre, setHuespedNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [patenteVehiculo, setPatenteVehiculo] = useState('');
  const [tipoTurno, setTipoTurno] =
    useState<NuevaReservaInput['tipoTurno']>('TURNO_3H');
  const [horarioInicio, setHorarioInicio] = useState('15:00');
  const [horarioFin, setHorarioFin] = useState('18:00');
  const [montoTotal, setMontoTotal] = useState(18000);
  const [montoSena, setMontoSena] = useState(9000);
  const [observaciones, setObservaciones] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!huespedNombre.trim() || !telefono.trim()) return;

    setIsSubmitting(true);
    try {
      await onConfirm({
        habitacionId,
        huespedNombre: huespedNombre.trim(),
        telefono: telefono.trim(),
        patenteVehiculo: patenteVehiculo.trim() || undefined,
        tipoTurno,
        fecha: '2026-10-22',
        horarioInicio,
        horarioFin,
        montoTotal,
        montoSena,
        observaciones: observaciones.trim() || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0c142b] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-[#1e293b] flex items-center justify-between sticky top-0 bg-[#0c142b] z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Nueva reserva anticipada
              </h3>
              <p className="text-xs text-zinc-400">
                Registrá una reserva de turno express o pernocte.
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
          <div className="grid grid-cols-2 gap-3">
            {/* Habitación */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Suite / Habitación
              </label>
              <select
                value={habitacionId}
                onChange={(e) => setHabitacionId(e.target.value)}
                className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="hab-101">101 - Estándar</option>
                <option value="hab-102">102 - Suite con Jacuzzi</option>
                <option value="hab-103">103 - Estándar</option>
                <option value="hab-104">104 - Suite</option>
                <option value="hab-106">106 - Premium</option>
                <option value="hab-108">108 - Premium</option>
                <option value="hab-110">110 - Suite</option>
              </select>
            </div>

            {/* Tipo de Turno */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Modalidad de Turno
              </label>
              <select
                value={tipoTurno}
                onChange={(e) =>
                  setTipoTurno(
                    e.target.value as NuevaReservaInput['tipoTurno']
                  )
                }
                className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="TURNO_2H">Turno Express (2 hs)</option>
                <option value="TURNO_3H">Turno Estándar (3 hs)</option>
                <option value="PERNOCTE">Pernocte completo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Huésped */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Nombre del huésped
              </label>
              <input
                type="text"
                required
                value={huespedNombre}
                onChange={(e) => setHuespedNombre(e.target.value)}
                placeholder="Ej: Sofía Martínez"
                className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Teléfono de contacto
              </label>
              <input
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+54 9 11 ..."
                className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Horario Inicio */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Horario inicio
              </label>
              <input
                type="time"
                value={horarioInicio}
                onChange={(e) => setHorarioInicio(e.target.value)}
                className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Horario Fin */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Horario fin
              </label>
              <input
                type="time"
                value={horarioFin}
                onChange={(e) => setHorarioFin(e.target.value)}
                className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Patente */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Patente vehículo
              </label>
              <input
                type="text"
                value={patenteVehiculo}
                onChange={(e) => setPatenteVehiculo(e.target.value.toUpperCase())}
                placeholder="AA-123-BB"
                className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs font-mono font-bold text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Tarifa total */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Tarifa total ($ ARS)
              </label>
              <input
                type="number"
                min={1000}
                step={500}
                value={montoTotal}
                onChange={(e) => setMontoTotal(Number(e.target.value))}
                className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Seña pagada */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                Seña anticipada ($ ARS)
              </label>
              <input
                type="number"
                min={0}
                step={500}
                value={montoSena}
                onChange={(e) => setMontoSena(Number(e.target.value))}
                className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Peticiones especiales o notas
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              placeholder="Ej: Bebida fría en cubitera, ingreso discreto..."
              className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 resize-none transition-colors"
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
              disabled={isSubmitting || !huespedNombre.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-900/30 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Guardando...' : 'Confirmar reserva'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
