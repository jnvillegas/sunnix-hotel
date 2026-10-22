'use client';

import { useState, useEffect, useTransition, useMemo } from 'react';
import type { HabitacionCardData, MetodoPago, TarifaConfig, ConsumoDetallado } from '@/types';
import { checkOutAction, type CheckOutPaymentItem } from '@/actions/estadias';
import { getConsumosEstadiaAction } from '@/actions/bar';
import { calculateStay } from '@/lib/tariffs/calculateStay';
import {
  CreditCard,
  DollarSign,
  Plus,
  QrCode,
  Receipt,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';

interface CheckOutModalProps {
  room: HabitacionCardData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const mockTarifaStandard: TarifaConfig = {
  id: 'tar-std',
  categoria_id: 'c-std',
  dia_semana: 1,
  hora_desde: '00:00:00',
  hora_hasta: '23:59:59',
  duracion_turno_minutos: 120,
  precio_turno_base: 15000,
  precio_hora_extra: 5000,
  precio_pernocte: 35000,
  hora_inicio_pernocte: '22:00:00',
  hora_fin_pernocte: '12:00:00',
  tolerancia_minutos: 15,
  created_at: new Date().toISOString(),
};

export function CheckOutModal({ room, isOpen, onClose, onSuccess }: CheckOutModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [consumos, setConsumos] = useState<ConsumoDetallado[]>([]);
  const [isPending, startTransition] = useTransition();

  // Cargar consumos reales imputados a la estadía
  useEffect(() => {
    if (!isOpen) return;

    if (room.estadia_activa?.id) {
      getConsumosEstadiaAction(room.estadia_activa.id).then((items) => {
        setConsumos(items);
      });
    } else {
      setConsumos([]);
    }
  }, [isOpen, room]);

  const montoConsumosBar = useMemo(() => {
    return consumos.reduce((sum, c) => sum + c.subtotal, 0);
  }, [consumos]);

  // Cálculo en vivo de la liquidación de tiempo
  const calculo = useMemo(() => {
    const fechaIngreso = room.estadia_activa?.fecha_ingreso
      ? new Date(room.estadia_activa.fecha_ingreso)
      : new Date(Date.now() - 130 * 60 * 1000);
    const fechaSalida = new Date();

    return calculateStay({
      fechaIngreso,
      fechaSalida,
      tarifaConfig: mockTarifaStandard,
      esPernocte: !!room.estadia_activa?.es_pernocte,
      personasAdicionales: 0,
    });
  }, [room]);

  const totalLiquidacion = calculo.subtotalTiempo + montoConsumosBar;

  // Estado de medios de pago asignados (por defecto: pago total en Efectivo)
  const [pagos, setPagos] = useState<CheckOutPaymentItem[]>([
    { metodo: 'EFECTIVO', monto: totalLiquidacion },
  ]);

  // Sincronizar monto si cambia el total de liquidación
  useEffect(() => {
    setPagos([{ metodo: 'EFECTIVO', monto: totalLiquidacion }]);
  }, [totalLiquidacion]);

  if (!isOpen) return null;

  const totalAsignado = pagos.reduce((sum, p) => sum + (Number(p.monto) || 0), 0);
  const saldoPendiente = Math.max(0, totalLiquidacion - totalAsignado);
  const vuelto = Math.max(0, totalAsignado - totalLiquidacion);

  const handleSetSinglePayment = (metodo: MetodoPago) => {
    setPagos([{ metodo, monto: totalLiquidacion }]);
  };

  const handleAddPaymentRow = () => {
    setPagos((prev) => [
      ...prev,
      { metodo: 'MERCADO_PAGO_QR', monto: saldoPendiente > 0 ? saldoPendiente : 0 },
    ]);
  };

  const handleRemovePaymentRow = (index: number) => {
    if (pagos.length <= 1) return;
    setPagos((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePaymentChange = (
    index: number,
    field: keyof CheckOutPaymentItem,
    value: string | number
  ) => {
    setPagos((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (totalAsignado < totalLiquidacion) {
      setError(
        `Cobro incompleto: resta abonar $${saldoPendiente.toLocaleString()} para liquidar el 100% de la estadía.`
      );
      return;
    }

    startTransition(async () => {
      const res = await checkOutAction({
        estadiaId: room.estadia_activa?.id || 'demo-estadia',
        habitacionId: room.id,
        pagos,
        montoFinalTiempo: calculo.subtotalTiempo,
        montoConsumos: montoConsumosBar,
      });

      if (res.error) {
        setError(res.error);
      } else {
        onSuccess?.();
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121217] border border-[#27272a] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#27272a] flex items-center justify-between bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-tight">
                Check-Out & Liquidación: Hab. {room.numero}
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                {room.categoria.nombre} • {room.estado_actual}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Desglose de Liquidación */}
          <div className="bg-zinc-950/70 border border-[#27272a] rounded-lg p-3.5 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-zinc-400">
              <span>Tiempo computado:</span>
              <span className="text-white font-semibold">{calculo.minutosTotales} minutos</span>
            </div>

            <div className="flex justify-between items-center text-zinc-400">
              <span>Tarifa Base ({room.estadia_activa?.es_pernocte ? 'Pernocte' : 'Turno Base'}):</span>
              <span className="text-white">${calculo.montoBase.toLocaleString()}</span>
            </div>

            {calculo.bloquesExtras > 0 && (
              <div className="flex justify-between items-center text-red-400">
                <span>
                  Horas Extras ({calculo.bloquesExtras} bloque(s) x $5.000):
                </span>
                <span className="font-bold">+${calculo.montoExtras.toLocaleString()}</span>
              </div>
            )}

            {consumos.length > 0 && (
              <div className="pt-1.5 pb-1 border-t border-zinc-800/60 space-y-1">
                <div className="flex justify-between items-center text-amber-300 font-semibold">
                  <span className="flex items-center gap-1">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Consumos de Bar / Frigobar ({consumos.length}):</span>
                  </span>
                  <span>+${montoConsumosBar.toLocaleString()}</span>
                </div>
                <div className="space-y-0.5 pl-4 text-[11px] text-zinc-400">
                  {consumos.map((c) => (
                    <div key={c.id} className="flex justify-between">
                      <span>
                        {c.cantidad}x {c.nombre_producto}
                      </span>
                      <span className="text-zinc-300 font-mono">
                        ${c.subtotal.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-sm font-bold text-white uppercase">Total a Liquidar:</span>
              <span className="text-lg font-bold text-emerald-400">
                ${totalLiquidacion.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Atajos de Pago Rápido */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                Medios de Pago
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSetSinglePayment('EFECTIVO')}
                  className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-300 cursor-pointer"
                >
                  Todo Efectivo
                </button>
                <button
                  type="button"
                  onClick={() => handleSetSinglePayment('MERCADO_PAGO_QR')}
                  className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-zinc-300 cursor-pointer"
                >
                  Todo QR
                </button>
              </div>
            </div>

            {/* Lista Multimedio de Pagos */}
            <div className="space-y-2">
              {pagos.map((pago, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={pago.metodo}
                    onChange={(e) =>
                      handlePaymentChange(idx, 'metodo', e.target.value as MetodoPago)
                    }
                    className="bg-[#09090b] border border-[#27272a] rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-zinc-500 w-44"
                  >
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="MERCADO_PAGO_QR">Mercado Pago QR</option>
                    <option value="TARJETA_DEBITO">Tarjeta Débito</option>
                    <option value="TARJETA_CREDITO">Tarjeta Crédito</option>
                    <option value="TRANSFERENCIA">Transferencia</option>
                  </select>

                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono">
                      $
                    </span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={pago.monto || ''}
                      onChange={(e) =>
                        handlePaymentChange(idx, 'monto', Number(e.target.value))
                      }
                      placeholder="0"
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-lg pl-6 pr-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  {pagos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePaymentRow(idx)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddPaymentRow}
                className="w-full py-1.5 rounded-lg border border-dashed border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-mono flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Dividir con otro medio de pago</span>
              </button>
            </div>
          </div>

          {/* Estado de Cobro */}
          <div className="p-3 rounded-lg bg-zinc-950/80 border border-[#27272a] flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-zinc-500 text-[10px] block uppercase">Total Declarado</span>
              <span className="font-bold text-white">${totalAsignado.toLocaleString()}</span>
            </div>

            {saldoPendiente > 0 ? (
              <div className="text-right">
                <span className="text-red-400 text-[10px] block uppercase font-bold">
                  Saldo Restante
                </span>
                <span className="font-bold text-red-400">
                  -${saldoPendiente.toLocaleString()}
                </span>
              </div>
            ) : (
              <div className="text-right">
                <span className="text-emerald-400 text-[10px] block uppercase font-bold">
                  {vuelto > 0 ? 'Vuelto a Entregar' : '100% Cubierto'}
                </span>
                <span className="font-bold text-emerald-400">
                  {vuelto > 0 ? `$${vuelto.toLocaleString()}` : 'Listo para Checkout'}
                </span>
              </div>
            )}
          </div>

          {/* Botón de Confirmación */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 py-2.5 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || saldoPendiente > 0}
              className="flex-1 py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/20"
            >
              {isPending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cobrar & Enviar a Limpieza</span>
                </>
              )}
            </button>
          </div>

          <p className="text-[10px] text-zinc-500 text-center font-mono pt-1">
            * Protocolo antifraude: Al cobrar, la habitación pasa obligatoriamente a LIMPIEZA.
          </p>
        </form>
      </div>
    </div>
  );
}
