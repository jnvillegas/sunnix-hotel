import { getEstadoSesionOperativa } from '@/actions/caja';
import { redirect } from 'next/navigation';
import { AperturaCajaForm } from './form';
import { CircleAlert, ShieldCheck } from 'lucide-react';

export default async function AperturaCajaPage() {
  const session = await getEstadoSesionOperativa();

  // Si no está autenticado, redirigir a login
  if (!session) {
    redirect('/login');
  }

  // Si ya tiene una caja abierta, no hace falta abrir otra: ir directo a dashboard
  if (session.caja_activa) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex items-center justify-center p-4">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="w-full max-w-lg z-10">
        {/* Security Alert Header */}
        <div className="mb-4 p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 flex items-start gap-3 backdrop-blur-sm">
          <CircleAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <div className="text-xs">
            <p className="font-semibold uppercase tracking-wider font-mono">
              Bloqueo Operativo Preventivo [CAJA-01]
            </p>
            <p className="text-amber-300/80 mt-0.5">
              El Rack de habitaciones y los despachos se encuentran bloqueados hasta que declare el fondo de caja inicial.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#121217] border border-[#27272a] rounded-xl shadow-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#27272a]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white font-mono uppercase tracking-tight">
                  Apertura de Turno
                </h1>
                <p className="text-xs text-zinc-400">
                  Registro de Fondo Inicial en Efectivo
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300 uppercase">
                {session.usuario.rol}
              </span>
              <p className="text-[11px] text-zinc-500 font-mono mt-1">
                {session.usuario.nombre_completo}
              </p>
            </div>
          </div>

          <AperturaCajaForm />
        </div>
      </div>
    </div>
  );
}
