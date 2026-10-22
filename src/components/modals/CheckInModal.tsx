'use client';

import { useState, useTransition } from 'react';
import type { HabitacionCardData } from '@/types';
import { checkInAction } from '@/actions/estadias';
import { Car, Clock, Moon, ShieldAlert, Sparkles, UserPlus, X, Zap } from 'lucide-react';

interface CheckInModalProps {
  room: HabitacionCardData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CheckInModal({ room, isOpen, onClose, onSuccess }: CheckInModalProps) {
  const [esPernocte, setEsPernocte] = useState<boolean>(false);
  const [patente, setPatente] = useState<string>('');
  const [personasExtra, setPersonasExtra] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const precioBase = esPernocte ? 35000 : 15000;
  const precioPersonas = personasExtra * (precioBase * 0.5);
  const totalEstimado = precioBase + precioPersonas;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await checkInAction({
        habitacionId: room.id,
        esPernocte,
        patenteVehiculo: patente,
        personasAdicionales: personasExtra,
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
      <div className="bg-[#121217] border border-[#27272a] rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#27272a] flex items-center justify-between bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono uppercase tracking-tight">
                Check-In Express: Hab. {room.numero}
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                {room.categoria.nombre} • Estado Libre
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Modalidad de Turno */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
              Modalidad de Estadía
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEsPernocte(false)}
                className={`p-3 rounded-lg border text-left font-mono transition-all cursor-pointer ${
                  !esPernocte
                    ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-950/30'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Turno Normal</span>
                </div>
                <p className="text-[11px] text-zinc-400">2 horas base</p>
                <p className="text-sm font-bold text-white mt-1">$15.000</p>
              </button>

              <button
                type="button"
                onClick={() => setEsPernocte(true)}
                className={`p-3 rounded-lg border text-left font-mono transition-all cursor-pointer ${
                  esPernocte
                    ? 'bg-indigo-950/50 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-950/30'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold mb-1">
                  <Moon className="w-3.5 h-3.5" />
                  <span>Pernocte</span>
                </div>
                <p className="text-[11px] text-zinc-400">Hasta 12:00 PM</p>
                <p className="text-sm font-bold text-white mt-1">$35.000</p>
              </button>
            </div>
          </div>

          {/* Patente Vehicular (Opcional) */}
          <div>
            <label
              htmlFor="patente"
              className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5"
            >
              Patente Vehículo (Opcional)
            </label>
            <div className="relative">
              <Car className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                id="patente"
                type="text"
                value={patente}
                onChange={(e) => setPatente(e.target.value.toUpperCase())}
                placeholder="Ej: AB 123 CD"
                maxLength={9}
                className="w-full bg-[#09090b] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 uppercase tracking-widest"
              />
            </div>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">
              Anonimato garantizado. Solo requerida para garajes cerrados.
            </p>
          </div>

          {/* Personas Adicionales */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
              Personas Adicionales (Base: 2 personas)
            </label>
            <div className="flex items-center gap-3 bg-[#09090b] border border-[#27272a] rounded-lg p-2">
              <UserPlus className="w-4 h-4 text-zinc-500 ml-1" />
              <span className="text-xs font-mono text-zinc-300 flex-1">
                {personasExtra === 0 ? 'Sin adicionales' : `+${personasExtra} persona(s) extra`}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPersonasExtra(Math.max(0, personasExtra - 1))}
                  className="w-7 h-7 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-mono font-bold text-white">
                  {personasExtra}
                </span>
                <button
                  type="button"
                  onClick={() => setPersonasExtra(personasExtra + 1)}
                  className="w-7 h-7 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-3 rounded-lg bg-zinc-950/80 border border-[#27272a] flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase">
                Importe Inicial Proyectado
              </span>
              <span className="text-base font-bold text-emerald-400">
                ${totalEstimado.toLocaleString()}
              </span>
            </div>
            <div className="text-right text-[11px] text-zinc-400">
              <span>{esPernocte ? 'Venc: Mañana 12:00' : 'Venc: 2 horas'}</span>
            </div>
          </div>

          {/* Actions */}
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
              disabled={isPending}
              className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Activando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Confirmar Check-In</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
