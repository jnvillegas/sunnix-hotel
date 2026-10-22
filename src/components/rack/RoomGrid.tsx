'use client';

import type { HabitacionCardData } from '@/types';
import { RoomCard } from './RoomCard';
import { Search } from 'lucide-react';

interface RoomGridProps {
  rooms: HabitacionCardData[];
  filter: string;
  searchQuery: string;
  onSelectRoom?: (room: HabitacionCardData) => void;
  onWarningAlert?: (room: HabitacionCardData) => void;
  onRoomService?: (room: HabitacionCardData) => void;
}

export function RoomGrid({
  rooms,
  filter,
  searchQuery,
  onSelectRoom,
  onWarningAlert,
  onRoomService,
}: RoomGridProps) {
  const filteredRooms = rooms.filter((room) => {
    // Filtro por estado
    if (filter !== 'TODOS') {
      if (filter === 'MANTENIMIENTO') {
        if (room.estado_actual !== 'MANTENIMIENTO' && room.estado_actual !== 'BLOQUEADA') {
          return false;
        }
      } else if (room.estado_actual !== filter) {
        return false;
      }
    }

    // Filtro por texto de búsqueda (número o categoría)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = room.numero.toLowerCase().includes(q);
      const matchCat = room.categoria.nombre.toLowerCase().includes(q);
      const matchPat = room.estadia_activa?.patente_vehiculo?.toLowerCase().includes(q);
      return matchNum || matchCat || matchPat;
    }

    return true;
  });

  if (filteredRooms.length === 0) {
    return (
      <div className="p-12 rounded-xl bg-[#121217]/50 border border-zinc-800 text-center flex flex-col items-center justify-center">
        <Search className="w-8 h-8 text-zinc-600 mb-2" />
        <p className="text-sm font-mono text-zinc-400">
          No se encontraron habitaciones con el criterio seleccionado.
        </p>
        <span className="text-xs text-zinc-600 mt-1">
          Intente restablecer los filtros o la búsqueda.
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {filteredRooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onSelect={onSelectRoom}
          onWarningAlert={onWarningAlert}
          onRoomService={onRoomService}
        />
      ))}
    </div>
  );
}
