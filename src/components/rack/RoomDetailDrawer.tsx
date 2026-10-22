'use client';

import { useState } from 'react';
import type { HabitacionCardData } from '@/types';
import {
  X,
  Clock,
  User,
  Coffee,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

interface RoomDetailDrawerProps {
  room: HabitacionCardData | null;
  onClose: () => void;
  onCheckIn: (room: HabitacionCardData) => void;
  onCheckOut: (room: HabitacionCardData) => void;
  onRoomService: (room: HabitacionCardData) => void;
  onFinishCleaning?: (room: HabitacionCardData) => void;
}

// Catálogo de fotografías reales de suites según número
const SUITE_PHOTOS: Record<string, string[]> = {
  '101': [
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
  ],
  '102': [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
  ],
  '103': [
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
  ],
  '104': [
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  ],
  '105': [
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  ],
  '106': [
    'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
  ],
  '107': [
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
  ],
  '108': [
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  ],
};

const DEFAULT_PHOTOS = [
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
];

export function RoomDetailDrawer({
  room,
  onClose,
  onCheckIn,
  onCheckOut,
  onRoomService,
  onFinishCleaning,
}: RoomDetailDrawerProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [observaciones, setObservaciones] = useState('');

  if (!room) return null;

  const photos = SUITE_PHOTOS[room.numero] || DEFAULT_PHOTOS;

  const nextPhoto = () => setPhotoIndex((prev) => (prev + 1) % photos.length);
  const prevPhoto = () => setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);

  const isOcupada = room.estado_actual === 'OCUPADA' || room.estado_actual === 'POR_VENCER';
  const isLibre = room.estado_actual === 'LIBRE';
  const isLimpieza = room.estado_actual === 'LIMPIEZA';

  // Badge styles
  const statusStyles: Record<string, { label: string; bg: string; text: string }> = {
    LIBRE: { label: 'Disponible', bg: 'bg-emerald-500/10 border-emerald-500/30', text: 'text-emerald-400' },
    OCUPADA: { label: 'Ocupada', bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-400' },
    POR_VENCER: { label: 'Por Vencer', bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400' },
    EN_COBRO: { label: 'En Cobro', bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-400' },
    LIMPIEZA: { label: 'En limpieza', bg: 'bg-amber-500/10 border-amber-500/30', text: 'text-amber-400' },
    MANTENIMIENTO: { label: 'Mantenimiento', bg: 'bg-pink-500/10 border-pink-500/30', text: 'text-pink-400' },
  };

  const status = statusStyles[room.estado_actual] || {
    label: room.estado_actual,
    bg: 'bg-zinc-800 border-zinc-700',
    text: 'text-zinc-300',
  };

  // Cálculos de horarios si está ocupada
  const formatTime = (iso?: string | null, fallback = '14:30') => {
    if (!iso) return fallback;
    const d = new Date(iso);
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  };

  const horaIngreso = formatTime(room.estadia_activa?.fecha_ingreso, '14:30');
  const horaSalidaPrevista = formatTime(room.estadia_activa?.fecha_vencimiento_estimada, '17:30');

  const consumosMonto = room.estadia_activa?.monto_consumos || 0;

  return (
    <div className="w-full lg:w-96 bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-2xl flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-white tracking-tight">
            Habitación {room.numero}
          </h2>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${status.bg} ${status.text}`}
          >
            {status.label}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Image Carousel */}
      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[photoIndex]}
          alt={`Suite ${room.numero}`}
          className="w-full h-full object-cover"
        />

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* Carousel indicators */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {photos.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                i === photoIndex ? 'bg-white w-3' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl">
        <div>
          <span className="text-[11px] text-zinc-400 block">Categoría</span>
          <span className="font-semibold text-white">{room.categoria.nombre}</span>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-zinc-400 block">Tarifa Base</span>
          <span className="font-semibold text-emerald-400">$ 6.000 / hora</span>
        </div>
      </div>

      {/* Stay Details if Occupied */}
      {isOcupada && (
        <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <User className="w-3.5 h-3.5 text-blue-400" /> Huéspedes:
            </span>
            <span className="font-medium text-white">Pareja</span>
          </div>

          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Ingreso:
            </span>
            <span className="font-mono text-zinc-200">{horaIngreso} hs</span>
          </div>

          <div className="flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Calendar className="w-3.5 h-3.5 text-blue-400" /> Salida prevista:
            </span>
            <span className="font-mono text-zinc-200">{horaSalidaPrevista} hs</span>
          </div>

          <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-red-950/20 border border-red-500/20">
            <span className="text-red-400 font-medium">Tiempo transcurrido:</span>
            <span className="font-mono font-bold text-red-400">2 h 15 min</span>
          </div>

          <div className="flex items-center justify-between text-zinc-300">
            <span className="text-zinc-400">Tiempo restante:</span>
            <span className="font-mono text-zinc-200">1 h 15 min</span>
          </div>

          <div className="flex items-center justify-between text-zinc-300 pt-1">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Coffee className="w-3.5 h-3.5 text-purple-400" /> Consumos Bar:
            </span>
            <span className="font-mono font-bold text-purple-400">
              ${consumosMonto.toLocaleString('es-AR')}
            </span>
          </div>
        </div>
      )}

      {/* Observations */}
      <div>
        <label className="text-[11px] font-medium text-zinc-400 block mb-1">
          Observaciones
        </label>
        <textarea
          rows={2}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Sin observaciones registradas..."
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        {isLibre && (
          <button
            type="button"
            onClick={() => onCheckIn(room)}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wide bg-[#2563eb] hover:bg-blue-600 text-white shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Estadía (Check-in)</span>
          </button>
        )}

        {isOcupada && (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onRoomService(room)}
              className="py-2.5 px-3 rounded-xl font-semibold text-xs bg-[#1e293b] hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Coffee className="w-3.5 h-3.5 text-purple-400" />
              <span>Cargar Bar</span>
            </button>

            <button
              type="button"
              onClick={() => onCheckOut(room)}
              className="py-2.5 px-3 rounded-xl font-semibold text-xs bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Finalizar y cerrar</span>
            </button>
          </div>
        )}

        {isLimpieza && onFinishCleaning && (
          <button
            type="button"
            onClick={() => onFinishCleaning(room)}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wide bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Marcar como finalizada (Liberar)</span>
          </button>
        )}
      </div>
    </div>
  );
}
