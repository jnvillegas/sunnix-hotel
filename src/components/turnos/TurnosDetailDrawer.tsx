'use client';

import React from 'react';
import {
  X,
  Phone,
  Car,
  Clock,
  Calendar,
  DollarSign,
  Play,
  Trash2,
  Moon,
} from 'lucide-react';
import type { ReservaTurnoItem } from '@/types';
import Link from 'next/link';

interface TurnosDetailDrawerProps {
  reserva: ReservaTurnoItem | null;
  onClose: () => void;
  onCancelarReserva: (id: string) => Promise<void>;
}

export function TurnosDetailDrawer({
  reserva,
  onClose,
  onCancelarReserva,
}: TurnosDetailDrawerProps) {
  if (!reserva) {
    return (
      <div className="rounded-2xl border border-[#1e293b] bg-[#0c142b] p-6 text-center text-zinc-500 text-xs">
        Hacé click en una reserva de la lista para ver su detalle y gestionar el ingreso.
      </div>
    );
  }

  const saldoPendiente = Math.max(0, reserva.montoTotal - reserva.montoSena);

  return (
    <div className="rounded-2xl border border-[#1e293b] bg-[#0c142b] p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Reserva {reserva.habitacionNumero} - {reserva.categoria}
          </h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            {reserva.tipoTurno}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Photo */}
      <div className="relative rounded-xl overflow-hidden h-36 bg-slate-900 border border-[#1e293b]">
        <img
          src={reserva.fotoUrl}
          alt={reserva.habitacionNumero}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-2.5 left-3">
          <span className="text-white font-extrabold text-base">
            Suite {reserva.habitacionNumero}
          </span>
          <span className="text-zinc-300 text-xs block">
            {reserva.categoria}
          </span>
        </div>
      </div>

      {/* Huésped Details */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
          <span className="text-zinc-400">Huésped:</span>
          <span className="font-semibold text-white">{reserva.huespedNombre}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-zinc-500" />
            <span>Contacto:</span>
          </span>
          <span className="font-mono text-zinc-300">{reserva.telefono}</span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-zinc-500" />
            <span>Vehículo:</span>
          </span>
          <span className="font-mono font-bold text-white">
            {reserva.patenteVehiculo || 'Sin vehículo'}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Horario programado:</span>
          </span>
          <span className="font-mono font-bold text-white">
            {reserva.horarioInicio} a {reserva.horarioFin}
          </span>
        </div>
      </div>

      {/* Financials Box */}
      <div className="p-3.5 rounded-xl bg-[#111a38] border border-[#1e293b] space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Monto total:</span>
          <span className="font-mono font-bold text-white">
            $ {reserva.montoTotal.toLocaleString('es-AR')}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-zinc-400">Seña abonada:</span>
          <span className="font-mono text-emerald-400 font-semibold">
            $ {reserva.montoSena.toLocaleString('es-AR')}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-800">
          <span className="text-amber-400 font-semibold">Saldo a cobrar:</span>
          <span className="font-mono font-bold text-amber-400">
            $ {saldoPendiente.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      {/* Observaciones */}
      {reserva.observaciones && (
        <div className="p-3 rounded-xl bg-[#111a38]/60 border border-slate-800 text-xs text-zinc-300 italic">
          "{reserva.observaciones}"
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2 pt-2">
        <Link
          href="/dashboard"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-950/40"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Iniciar Check-in express</span>
        </Link>

        <button
          type="button"
          onClick={() => onCancelarReserva(reserva.id)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-950/40 font-semibold text-xs transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Cancelar reserva</span>
        </button>
      </div>
    </div>
  );
}
