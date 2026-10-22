'use client';

import React, { useState, useTransition } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { registrarMovimientoExtraordinarioAction } from '@/actions/ingresosEgresos';
import type { MovimientoFinancieroItem } from '@/types';

interface RegistrarMovimientoFinancieroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (nuevo: MovimientoFinancieroItem) => void;
}

export function RegistrarMovimientoFinancieroModal({
  isOpen,
  onClose,
  onSuccess,
}: RegistrarMovimientoFinancieroModalProps) {
  const [isPending, startTransition] = useTransition();
  const [tipo, setTipo] = useState<'INGRESO' | 'EGRESO'>('EGRESO');
  const [categoria, setCategoria] = useState<string>('INSUMOS');
  const [concepto, setConcepto] = useState<string>('');
  const [monto, setMonto] = useState<string>('');
  const [medioPago, setMedioPago] = useState<'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Otros'>('Efectivo');
  const [comprobanteNumero, setComprobanteNumero] = useState<string>('');
  const [habitacionNumero, setHabitacionNumero] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsedMonto = parseFloat(monto);
    if (!concepto.trim()) {
      setErrorMsg('Por favor especifique el concepto del movimiento.');
      return;
    }
    if (isNaN(parsedMonto) || parsedMonto <= 0) {
      setErrorMsg('Ingrese un monto válido mayor a $ 0.');
      return;
    }

    startTransition(async () => {
      const res = await registrarMovimientoExtraordinarioAction({
        tipo,
        categoria,
        concepto: concepto.trim(),
        monto: parsedMonto,
        medioPago,
        comprobanteNumero: comprobanteNumero.trim() || undefined,
        habitacionNumero: habitacionNumero.trim() || undefined,
      });

      if (res.success) {
        const now = new Date();
        const fechaStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
        const horaStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const getCatNombre = (cat: string) => {
          switch (cat) {
            case 'ESTADIAS': return 'Estadías';
            case 'BAR_ROOM_SERVICE': return 'Bar & Room Service';
            case 'INSUMOS': return 'Insumos & Limpieza';
            case 'MANTENIMIENTO': return 'Mantenimiento & Obras';
            case 'SERVICIOS': return 'Servicios';
            case 'RETIRO_CAJA': return 'Retiro de Tesorería';
            default: return 'Otros';
          }
        };

        const nuevoItem: MovimientoFinancieroItem = {
          id: `mov-${Date.now()}`,
          fechaStr,
          horaStr,
          tipo,
          categoria: categoria as any,
          categoriaNombre: getCatNombre(categoria),
          concepto: concepto.trim(),
          habitacionNumero: habitacionNumero.trim() || undefined,
          medioPago,
          comprobanteNumero: comprobanteNumero.trim() || 'REC-MANUAL',
          monto: parsedMonto,
          usuarioNombre: 'Javier Nicolas',
        };

        onSuccess(nuevoItem);
        onClose();
      } else {
        setErrorMsg(res.error || 'Ocurrió un error al guardar.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b1329] border border-[#1e293b] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e293b] bg-[#080d1d]">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            Registrar movimiento de tesorería
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tipo Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Tipo de movimiento
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setTipo('INGRESO');
                  setCategoria('ESTADIAS');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  tipo === 'INGRESO'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                    : 'bg-[#080d1d] text-zinc-400 border-[#1e293b] hover:text-white'
                }`}
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>INGRESO (+)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipo('EGRESO');
                  setCategoria('INSUMOS');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  tipo === 'EGRESO'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-sm'
                    : 'bg-[#080d1d] text-zinc-400 border-[#1e293b] hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>EGRESO (-)</span>
              </button>
            </div>
          </div>

          {/* Categoría & Medio de Pago */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Categoría
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-[#080d1d] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {tipo === 'INGRESO' ? (
                  <>
                    <option value="ESTADIAS">Estadías</option>
                    <option value="BAR_ROOM_SERVICE">Bar & Room Service</option>
                    <option value="OTROS">Otros Ingresos / Anticipos</option>
                  </>
                ) : (
                  <>
                    <option value="INSUMOS">Insumos & Limpieza</option>
                    <option value="MANTENIMIENTO">Mantenimiento & Obras</option>
                    <option value="SERVICIOS">Servicios Públicos / Impuestos</option>
                    <option value="RETIRO_CAJA">Retiro de Tesorería</option>
                    <option value="OTROS">Otros Egresos</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Medio de pago
              </label>
              <select
                value={medioPago}
                onChange={(e) => setMedioPago(e.target.value as any)}
                className="w-full bg-[#080d1d] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta de Débito/Crédito</option>
                <option value="Transferencia">Transferencia Bancaria</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>

          {/* Concepto */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Concepto / Detalle
            </label>
            <input
              type="text"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej: Pago de reparaciones de plomería suite 105"
              className="w-full bg-[#080d1d] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Monto & Comprobante */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Monto ($ ARS)
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0"
                className="w-full bg-[#080d1d] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white font-mono font-bold placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                N° de Comprobante / Recibo <span className="text-zinc-500 font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={comprobanteNumero}
                onChange={(e) => setComprobanteNumero(e.target.value)}
                placeholder="Ej: FACT-A-9921"
                className="w-full bg-[#080d1d] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Habitación Vinculada */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Habitación / Suite vinculada <span className="text-zinc-500 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={habitacionNumero}
              onChange={(e) => setHabitacionNumero(e.target.value)}
              placeholder="Ej: 102, 105 o dejar vacío si es gasto general"
              className="w-full bg-[#080d1d] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e293b]">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`px-5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                tipo === 'INGRESO'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30'
                  : 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/30'
              }`}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirmar {tipo.toLowerCase()}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
