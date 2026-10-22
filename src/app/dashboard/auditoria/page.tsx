import { getEstadoSesionOperativa, getHistorialCajasAction, getLogsAuditoriaAction } from '@/actions/caja';
import { redirect } from 'next/navigation';
import { AuditoriaView } from './AuditoriaView';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function AuditoriaPage() {
  const session = await getEstadoSesionOperativa();

  if (!session) {
    redirect('/login');
  }

  // Verificación estricta de rol ADMIN
  if (session.usuario.rol !== 'ADMIN') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#121217] border border-red-500/40 rounded-2xl p-6 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-xl bg-red-950/50 border border-red-500/40 text-red-400 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-base text-white uppercase tracking-wider">
              Acceso Restringido (403)
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-1 leading-relaxed">
              El módulo de Auditoría Gerencial y Control Financiero está restringido exclusivamente a usuarios con rol <strong className="text-amber-400">ADMIN</strong>.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al Rack Operativo</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const [cajas, logs] = await Promise.all([
    getHistorialCajasAction(),
    getLogsAuditoriaAction(),
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <AuditoriaView
        cajas={cajas}
        logs={logs}
        adminNombre={session.usuario.nombre_completo}
      />
    </div>
  );
}
