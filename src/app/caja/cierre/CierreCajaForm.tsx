'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Banknote,
  Calculator,
  CircleAlert,
  CreditCard,
  QrCode,
  ShieldAlert,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Minus,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { cerrarCajaCiegaAction } from '@/actions/caja';
import type { ConteoDenominacion } from '@/types';

interface CierreCajaFormProps {
  cajaSesionId: string;
  cajeroNombre: string;
  rol: string;
  fechaApertura: string;
}

const DENOMINACIONES = [20000, 10000, 2000, 1000, 500, 200, 100];

export function CierreCajaForm({
  cajaSesionId,
  cajeroNombre,
  rol,
  fechaApertura,
}: CierreCajaFormProps) {
  const router = useRouter();

  // Estado de conteo por denominación
  const [cantidades, setCantidades] = useState<Record<number, number>>({
    20000: 0,
    10000: 0,
    2000: 0,
    1000: 0,
    500: 0,
    200: 0,
    100: 0,
  });

  // Comprobantes digitales y no efectivos
  const [vouchersTarjetas, setVouchersTarjetas] = useState<number>(0);
  const [vouchersQR, setVouchersQR] = useState<number>(0);
  const [observaciones, setObservaciones] = useState<string>('');

  // Estados de confirmación y feedback
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modificar cantidad de una denominación
  const updateCantidad = (denom: number, delta: number) => {
    setCantidades((prev) => {
      const current = prev[denom] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [denom]: next };
    });
  };

  const setCantidadDirecta = (denom: number, val: string) => {
    const parsed = parseInt(val, 10);
    setCantidades((prev) => ({
      ...prev,
      [denom]: isNaN(parsed) || parsed < 0 ? 0 : parsed,
    }));
  };

  // Cálculos automáticos de subtotales
  const totalBilletesDeclarado = DENOMINACIONES.reduce(
    (acc, denom) => acc + (cantidades[denom] || 0) * denom,
    0
  );

  const totalConsolidado = totalBilletesDeclarado + vouchersTarjetas + vouchersQR;

  const fechaFormateada = new Date(fechaApertura).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Ejecución definitiva del cierre ciego
  const handleConfirmarCierre = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const billetesArray: ConteoDenominacion[] = DENOMINACIONES.map((denom) => ({
      denominacion: denom,
      cantidad: cantidades[denom] || 0,
    }));

    try {
      const result = await cerrarCajaCiegaAction({
        cajaSesionId,
        billetes: billetesArray,
        totalVouchersTarjetas: vouchersTarjetas,
        totalVouchersQR: vouchersQR,
        observaciones: observaciones.trim() || undefined,
      });

      if (result.error) {
        setErrorMessage(result.error);
        setIsSubmitting(false);
        setIsConfirmModalOpen(false);
        return;
      }

      // Deslogueo completado por backend: redirigir a login
      window.location.href = '/login?cierre=exitoso';
    } catch (err) {
      console.error('Error al sellar caja:', err);
      setErrorMessage('Ocurrió un error inesperado al procesar el cierre. Por favor reintente.');
      setIsSubmitting(false);
      setIsConfirmModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Alert Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#27272a]">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Volver al Rack"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-950/40 border border-red-500/40 text-red-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold font-mono uppercase tracking-wide text-white">
                  Arqueo Ciego y Cierre de Turno
                </h1>
                <p className="text-xs text-zinc-400 font-mono">
                  PROTOCOLO FINANCIERO [CAJA-03] / [CAJA-05]
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-right">
          <div className="text-right">
            <p className="text-xs font-mono text-zinc-300">{cajeroNombre}</p>
            <p className="text-[11px] font-mono text-zinc-500">
              Turno iniciado a las {fechaFormateada} hs
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-amber-400 font-mono text-xs uppercase">
            {rol}
          </span>
        </div>
      </div>

      {/* Regla Crítica Antifraude */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-300 flex items-start gap-3 backdrop-blur-sm">
        <CircleAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
        <div className="text-xs space-y-1">
          <p className="font-semibold uppercase tracking-wider font-mono">
            Auditoría Ciega Estricta (Anti-Fraude)
          </p>
          <p className="text-amber-200/80 leading-relaxed">
            Por normativa de seguridad financiera, el sistema <strong>no exhibe el saldo teórico esperado</strong> bajo ninguna circunstancia. Declare el recuento físico exacto de billetes y comprobantes. La validación matemática de diferencias se procesará de forma atómica en el backend al sellar el turno.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-mono flex items-center gap-2">
          <CircleAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid: Planilla de Billetes (Izquierda) + Comprobantes y Totales (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Planilla de Conteo Físico por Denominación */}
        <div className="lg:col-span-7 bg-[#121217] border border-[#27272a] rounded-xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
            <div className="flex items-center gap-2 text-zinc-200 font-mono text-sm font-semibold">
              <Banknote className="w-4 h-4 text-emerald-400" />
              <span>DESGLOSE FÍSICO DE BILLETES</span>
            </div>
            <span className="text-xs font-mono text-zinc-500">Moneda: ARS ($)</span>
          </div>

          <div className="space-y-3">
            {DENOMINACIONES.map((denom) => {
              const cantidad = cantidades[denom] || 0;
              const subtotal = cantidad * denom;

              return (
                <div
                  key={denom}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  {/* Denominación Badge */}
                  <div className="w-32 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-emerald-400 font-mono font-bold text-sm">
                      ${denom.toLocaleString('es-AR')}
                    </span>
                  </div>

                  {/* Controles de Cantidad */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateCantidad(denom, -10)}
                      className="px-2 py-1 text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition-colors"
                      title="Restar 10"
                    >
                      -10
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCantidad(denom, -1)}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition-colors"
                      title="Restar 1"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>

                    <input
                      type="number"
                      min="0"
                      value={cantidad === 0 ? '' : cantidad}
                      placeholder="0"
                      onChange={(e) => setCantidadDirecta(denom, e.target.value)}
                      className="w-20 px-2 py-1.5 text-center font-mono font-bold text-base bg-zinc-950 border border-zinc-700 rounded text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />

                    <button
                      type="button"
                      onClick={() => updateCantidad(denom, 1)}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition-colors"
                      title="Sumar 1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateCantidad(denom, 10)}
                      className="px-2 py-1 text-xs font-mono bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition-colors"
                      title="Sumar 10"
                    >
                      +10
                    </button>
                  </div>

                  {/* Subtotal Denominación */}
                  <div className="sm:w-32 text-right">
                    <span className="text-[11px] font-mono text-zinc-500 block sm:hidden">
                      Subtotal:
                    </span>
                    <span className="font-mono text-sm font-semibold text-zinc-200">
                      ${subtotal.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtotal Efectivo Bar */}
          <div className="mt-5 p-4 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wide">
              Subtotal Efectivo Físico:
            </span>
            <span className="text-xl font-mono font-bold text-emerald-400">
              ${totalBilletesDeclarado.toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Right Column: Vouchers, Observaciones & Gran Total */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Comprobantes Digitales */}
          <div className="bg-[#121217] border border-[#27272a] rounded-xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-zinc-200 font-mono text-sm font-semibold pb-3 border-b border-zinc-800/80">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>COMPROBANTES NO EFECTIVO</span>
            </div>

            {/* Vouchers Tarjetas */}
            <div>
              <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 mb-1.5">
                <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                <span>Total Lote Tarjetas (Débito / Crédito):</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-mono text-sm text-zinc-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={vouchersTarjetas === 0 ? '' : vouchersTarjetas}
                  placeholder="0"
                  onChange={(e) => setVouchersTarjetas(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full pl-8 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
              <p className="text-[11px] font-mono text-zinc-500 mt-1">
                Suma total de cupones de posnet físico impresos en el turno.
              </p>
            </div>

            {/* Vouchers QR / Transferencias */}
            <div>
              <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 mb-1.5">
                <QrCode className="w-3.5 h-3.5 text-purple-400" />
                <span>Total QR / Transferencias Confirmadas:</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-mono text-sm text-zinc-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={vouchersQR === 0 ? '' : vouchersQR}
                  placeholder="0"
                  onChange={(e) => setVouchersQR(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full pl-8 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <p className="text-[11px] font-mono text-zinc-500 mt-1">
                Suma de comprobantes bancarios y pagos MercadoPago QR validados.
              </p>
            </div>

            {/* Observaciones de Cierre */}
            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                <span>Observaciones del Turno (Opcional):</span>
              </label>
              <textarea
                rows={3}
                value={observaciones}
                placeholder="Indique cualquier incidente, cambio entregado de más o aclaración..."
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-xs text-white focus:outline-none focus:border-zinc-600 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Card Consolidado & Acción */}
          <div className="bg-[#121217] border border-[#27272a] rounded-xl p-5 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Resumen Declarado de Turno
            </h3>

            <div className="space-y-2 text-xs font-mono border-y border-zinc-800 py-3">
              <div className="flex justify-between text-zinc-300">
                <span>Efectivo Físico:</span>
                <span className="font-semibold text-emerald-400">
                  ${totalBilletesDeclarado.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Vouchers Tarjetas:</span>
                <span className="font-semibold text-cyan-400">
                  ${vouchersTarjetas.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Comprobantes QR:</span>
                <span className="font-semibold text-purple-400">
                  ${vouchersQR.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-sm font-mono font-bold uppercase text-zinc-300">
                Total Declarado:
              </span>
              <span className="text-2xl font-mono font-black text-white">
                ${totalConsolidado.toLocaleString('es-AR')}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsConfirmModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-xl font-mono font-bold text-sm uppercase tracking-wide bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-950/40 border border-red-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Sellar Caja y Finalizar Turno</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación Irreversible */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#121217] border border-red-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 rounded-xl bg-red-950/50 border border-red-500/40">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-mono font-bold text-base text-white uppercase tracking-tight">
                  Confirmación Irreversible
                </h3>
                <p className="text-xs font-mono text-zinc-400">
                  Sellado Inmutable de Turno
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-400">Efectivo declarado:</span>
                <span className="text-emerald-400 font-bold">
                  ${totalBilletesDeclarado.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tarjetas declaradas:</span>
                <span className="text-cyan-400 font-bold">
                  ${vouchersTarjetas.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">QR / Transferencias:</span>
                <span className="text-purple-400 font-bold">
                  ${vouchersQR.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="border-t border-zinc-800 pt-2 flex justify-between font-bold text-sm">
                <span className="text-white uppercase">Gran Total:</span>
                <span className="text-white">
                  ${totalConsolidado.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 text-red-300 text-xs font-mono leading-relaxed">
              <strong>ADVERTENCIA:</strong> Esta acción no se puede deshacer. Una vez confirmado el arqueo, la caja pasará a estado <strong>CERRADA</strong>, se registrará el evento en la auditoría inalterable y su sesión de operador se cerrará de forma automática.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 font-mono text-xs hover:bg-zinc-700 transition-colors"
              >
                Cancelar y Revisar
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmarCierre}
                className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sellando Caja...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Sellado</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
