import { getEstadoSesionOperativa } from '@/actions/caja';
import { getHabitacionesRack } from '@/actions/rack';
import { RackView } from '@/components/rack/RackView';
import { redirect } from 'next/navigation';
import { Radio } from 'lucide-react';

export default async function HabitacionesPage() {
  const session = await getEstadoSesionOperativa();

  if (!session) {
    redirect('/login');
  }

  const initialRooms = await getHabitacionesRack();

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Rack Command Center Header Bar */}
      <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight font-mono">
              RACK OPERATIVO EN TIEMPO REAL
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              DISPATCH BENTO GRID
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Monitoreo táctico de ocupación, timers de turnos y sincronización WebSocket.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Supabase Realtime: Conectado</span>
          </div>
        </div>
      </div>

      {/* Main Rack View */}
      <RackView initialRooms={initialRooms} />
    </div>
  );
}
