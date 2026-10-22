'use client';

import React from 'react';
import type { HabitacionCardData } from '@/types';
import { User, Clock, MoreVertical, DollarSign } from 'lucide-react';

interface RoomPhotoCardProps {
  room: HabitacionCardData;
  isSelected?: boolean;
  onSelect: (room: HabitacionCardData) => void;
  onOpenActions?: (room: HabitacionCardData) => void;
}

// Catálogo de fotografías de suites
const SUITE_COVERS: Record<string, string> = {
  '101': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
  '102': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
  '103': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80',
  '104': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80',
  '105': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80',
  '106': 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=600&q=80',
  '107': 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=600&q=80',
  '108': 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
};

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80';

export function RoomPhotoCard({
  room,
  isSelected = false,
  onSelect,
  onOpenActions,
}: RoomPhotoCardProps) {
  const coverUrl = SUITE_COVERS[room.numero] || DEFAULT_COVER;

  // Estado y Badges
  const statusBadges: Record<string, { label: string; bg: string; text: string; border: string }> = {
    LIBRE: {
      label: 'Disponible',
      bg: 'bg-emerald-950/70',
      text: 'text-emerald-300',
      border: 'border-emerald-500/50',
    },
    OCUPADA: {
      label: 'Ocupada',
      bg: 'bg-blue-950/70',
      text: 'text-cyan-300',
      border: 'border-blue-500/50',
    },
    POR_VENCER: {
      label: 'Por Vencer',
      bg: 'bg-amber-950/70',
      text: 'text-amber-300',
      border: 'border-amber-500/50',
    },
    EN_COBRO: {
      label: 'En Cobro',
      bg: 'bg-purple-950/70',
      text: 'text-purple-300',
      border: 'border-purple-500/50',
    },
    LIMPIEZA: {
      label: 'En limpieza',
      bg: 'bg-amber-950/70',
      text: 'text-amber-300',
      border: 'border-amber-500/50',
    },
    MANTENIMIENTO: {
      label: 'Mantenimiento',
      bg: 'bg-zinc-900/80',
      text: 'text-zinc-400',
      border: 'border-zinc-700',
    },
  };

  const badge = statusBadges[room.estado_actual] || {
    label: room.estado_actual,
    bg: 'bg-zinc-800',
    text: 'text-zinc-200',
    border: 'border-zinc-700',
  };

  const isOcupada = room.estado_actual === 'OCUPADA' || room.estado_actual === 'POR_VENCER';
  const isLimpieza = room.estado_actual === 'LIMPIEZA';

  // Horarios de estadía deterministas
  const formatTime = (iso?: string | null, fallback = '14:30') => {
    if (!iso) return `${fallback} hs`;
    const d = new Date(iso);
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${h}:${m} hs`;
  };

  const horaIngreso = formatTime(room.estadia_activa?.fecha_ingreso, '14:30');
  const horaSalida = formatTime(room.estadia_activa?.fecha_vencimiento_estimada, '17:30');

  const precioStr = isOcupada ? '$ 18.000 (3 horas)' : '$ 8.000 / hora';

  return (
    <div
      onClick={() => onSelect(room)}
      className={`group relative rounded-2xl overflow-hidden bg-[#0f172a] border transition-all duration-200 cursor-pointer shadow-lg hover:shadow-2xl flex flex-col ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-blue-950/40'
          : 'border-[#1e293b] hover:border-slate-700'
      }`}
    >
      {/* Photo Container */}
      <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-slate-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt={`Habitación ${room.numero}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-black/30" />

        {/* Floating Status Badge (Top Right) */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md border shadow-sm ${badge.bg} ${badge.text} ${badge.border}`}
          >
            {badge.label}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
        {/* Row 1: Room Number & Category */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight leading-none">
              {room.numero}
            </h3>
            <p className="text-[11px] text-zinc-400 font-medium mt-1">
              {room.categoria.nombre}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenActions?.(room);
            }}
            className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Row 2: Occupants */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <User className="w-3.5 h-3.5 text-zinc-500" />
          <span>{isOcupada ? 'Pareja' : '-'}</span>
        </div>

        {/* Row 3: Timers */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-300">
          <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          {isOcupada ? (
            <span className="font-mono text-[11px]">
              Ingreso {horaIngreso} | Salida {horaSalida}
            </span>
          ) : isLimpieza ? (
            <span className="font-mono text-[11px] text-amber-300">
              Salida 16:10 (En rotación)
            </span>
          ) : (
            <span className="text-[11px] text-emerald-400 font-medium">
              Lista para despachar
            </span>
          )}
        </div>

        {/* Row 4: Price Tag */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 font-mono font-semibold text-zinc-200">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>{precioStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
