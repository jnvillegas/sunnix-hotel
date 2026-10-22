'use client';

import { useActionState, useEffect, useState } from 'react';
import { loginAction, loginDemoAction, type AuthActionResult } from '@/actions/auth';
import { Lock, Mail, ShieldAlert, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [cierreExitoso, setCierreExitoso] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('cierre=')) {
      setCierreExitoso(true);
    }
  }, []);

  const [state, formAction, isPending] = useActionState<AuthActionResult, FormData>(
    async (_prevState, formData) => {
      const result = await loginAction(formData);
      return result || {};
    },
    {}
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center p-4">
      {/* Background grid accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Header badge */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#121217] border border-[#27272a] text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>COMMAND CENTER v1.0</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#121217] border border-[#27272a] rounded-xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#27272a]">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white font-mono">
                SUNNIX PMS
              </h1>
              <p className="text-xs text-zinc-400">
                Puesto de Recepción & Control Operativo
              </p>
            </div>
          </div>

          {cierreExitoso && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Turno sellado exitosamente. Sesión de caja cerrada y deslogueada [CAJA-05].</span>
            </div>
          )}

          {state?.error && (
            <div className="mb-5 p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5 font-mono"
              >
                Usuario / Correo
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="operador@sunnix.local"
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium uppercase tracking-wider text-zinc-300 mb-1.5 font-mono"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-semibold tracking-wide transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <span className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
                  <span>Validando credenciales...</span>
                </>
              ) : (
                <span>Ingresar al Sistema</span>
              )}
            </button>

            <button
              type="button"
              onClick={async () => {
                await loginDemoAction();
              }}
              className="w-full py-2 px-4 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 text-xs font-mono tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acceso Rápido Preview (Command Center)</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#27272a] text-center">
            <p className="text-[11px] text-zinc-500 font-mono">
              Acceso restringido y auditado. Protocolo anti-fraude activo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
