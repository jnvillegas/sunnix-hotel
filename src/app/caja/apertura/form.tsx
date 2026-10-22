'use client';

import { useActionState } from 'react';
import { abrirCajaAction, type CajaActionResult } from '@/actions/caja';
import { DollarSign, FileText, LockOpen, ShieldAlert } from 'lucide-react';

export function AperturaCajaForm() {
  const [state, formAction, isPending] = useActionState<CajaActionResult, FormData>(
    async (_prevState, formData) => {
      const result = await abrirCajaAction(formData);
      return result || {};
    },
    {}
  );

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="monto_inicial"
          className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5 font-mono"
        >
          Fondo Inicial en Efectivo ($ ARS) *
        </label>
        <div className="relative">
          <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            id="monto_inicial"
            name="monto_inicial"
            type="number"
            step="0.01"
            min="0"
            required
            autoFocus
            placeholder="0.00"
            className="w-full bg-[#09090b] border border-[#27272a] rounded-lg pl-9 pr-3 py-2.5 text-base font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
          />
        </div>
        <p className="text-[11px] text-zinc-500 mt-1 font-mono">
          Declare la suma exacta de billetes físicos recibidos del turno saliente.
        </p>
      </div>

      <div>
        <label
          htmlFor="observaciones"
          className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5 font-mono"
        >
          Novedades / Observaciones de Relevo (Opcional)
        </label>
        <div className="relative">
          <FileText className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
          <textarea
            id="observaciones"
            name="observaciones"
            rows={2}
            placeholder="Ej: Se reciben $15.000 en cambio chico y 2 llaves maestras..."
            className="w-full bg-[#09090b] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
      >
        {isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
            <span>Inicializando sesión de caja...</span>
          </>
        ) : (
          <>
            <LockOpen className="w-4 h-4" />
            <span>Habilitar Turno y Desbloquear Rack</span>
          </>
        )}
      </button>
    </form>
  );
}
