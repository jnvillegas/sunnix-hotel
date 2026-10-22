'use client';

import { useState } from 'react';
import type { HabitacionCardData } from '@/types';
import { useRackRealtime } from '@/hooks/useRackRealtime';
import { HabitacionesKPICards } from './HabitacionesKPICards';
import { RoomPhotoCard } from './RoomPhotoCard';
import { RoomDetailDrawer } from './RoomDetailDrawer';
import { CheckInModal } from '@/components/modals/CheckInModal';
import { CheckOutModal } from '@/components/modals/CheckOutModal';
import { RoomServiceModal } from '@/components/modals/RoomServiceModal';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Sparkles,
  X,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';

interface RackViewProps {
  initialRooms: HabitacionCardData[];
}

export function RackView({ initialRooms }: RackViewProps) {
  const { rooms, kpis, lastEventTime, handleRoomWarning } = useRackRealtime(initialRooms);

  // Filtros
  const [filterEstado, setFilterEstado] = useState<string>('TODOS');
  const [filterCategoria, setFilterCategoria] = useState<string>('TODAS');
  const [filterTurno, setFilterTurno] = useState<string>('TODOS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Drawer de Detalle (por defecto abierto en habitación 102 si existe, como en la maqueta)
  const [drawerRoom, setDrawerRoom] = useState<HabitacionCardData | null>(
    () => rooms.find((r) => r.numero === '102') || rooms[0] || null
  );

  // Estados de modales interactivos
  const [checkInRoom, setCheckInRoom] = useState<HabitacionCardData | null>(null);
  const [checkOutRoom, setCheckOutRoom] = useState<HabitacionCardData | null>(null);
  const [roomServiceRoom, setRoomServiceRoom] = useState<HabitacionCardData | null>(null);
  const [limpiezaRoom, setLimpiezaRoom] = useState<HabitacionCardData | null>(null);

  // Filtrado reactivo de habitaciones
  const filteredRooms = rooms.filter((room) => {
    // Filtro por Estado
    if (filterEstado !== 'TODOS') {
      if (filterEstado === 'LIBRE' && room.estado_actual !== 'LIBRE') return false;
      if (
        filterEstado === 'OCUPADA' &&
        room.estado_actual !== 'OCUPADA' &&
        room.estado_actual !== 'POR_VENCER' &&
        room.estado_actual !== 'EN_COBRO'
      )
        return false;
      if (filterEstado === 'LIMPIEZA' && room.estado_actual !== 'LIMPIEZA') return false;
      if (filterEstado === 'MANTENIMIENTO' && room.estado_actual !== 'MANTENIMIENTO')
        return false;
    }

    // Filtro por Categoría
    if (filterCategoria !== 'TODAS') {
      if (room.categoria.nombre.toUpperCase() !== filterCategoria.toUpperCase()) return false;
    }

    // Búsqueda por texto (número, categoría, patente)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNumero = room.numero.toLowerCase().includes(q);
      const matchCat = room.categoria.nombre.toLowerCase().includes(q);
      const matchPatente =
        room.estadia_activa?.patente_vehiculo?.toLowerCase().includes(q) || false;
      if (!matchNumero && !matchCat && !matchPatente) return false;
    }

    return true;
  });

  const handleSelectRoom = (room: HabitacionCardData) => {
    setDrawerRoom(room);
  };

  const handleQuickRegister = () => {
    // Buscar la primera habitación libre disponible
    const libre = rooms.find((r) => r.estado_actual === 'LIBRE');
    if (libre) {
      setCheckInRoom(libre);
    } else {
      setCheckInRoom(rooms[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Hero Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Gestión de habitaciones
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Controlá en tiempo real la ocupación y el estado de cada habitación.
          </p>
        </div>

        <button
          type="button"
          onClick={handleQuickRegister}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar estadía</span>
        </button>
      </div>

      {/* 2. Top 5 KPI Cards Row */}
      <HabitacionesKPICards
        kpis={kpis}
        activeFilter={filterEstado}
        onSelectFilter={(f) => setFilterEstado(f)}
      />

      {/* 3. Filter Controls Row */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0f172a] border border-[#1e293b]">
        {/* Dropdowns Filters */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 text-[11px]">Estado:</span>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="TODOS">Todos</option>
              <option value="LIBRE">Disponible</option>
              <option value="OCUPADA">Ocupada</option>
              <option value="LIMPIEZA">En limpieza</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 text-[11px]">Categoría:</span>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="TODAS">Todas</option>
              <option value="ESTANDAR">Estándar</option>
              <option value="SUITE">Suite</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 text-[11px]">Turno:</span>
            <select
              value={filterTurno}
              onChange={(e) => setFilterTurno(e.target.value)}
              className="bg-[#1e293b] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="TODOS">Todos</option>
              <option value="TURNO_1">Turno 1 (06:00 - 14:00)</option>
              <option value="TURNO_2">Turno 2 (14:00 - 22:00)</option>
              <option value="TURNO_3">Turno 3 (22:00 - 06:00)</option>
            </select>
          </div>
        </div>

        {/* Search & View Switcher */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar habitación..."
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-[#1e293b] border border-slate-700 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-[#2563eb] text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vista cuadrícula</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-[#2563eb] text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Vista lista</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main Content: Grid + Side Drawer */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Rooms Grid */}
        <div className="flex-1 min-w-0 w-full">
          {filteredRooms.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0f172a] border border-[#1e293b] text-zinc-500 font-mono text-xs">
              No hay habitaciones coincidentes con los filtros seleccionados.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRooms.map((room) => (
                <RoomPhotoCard
                  key={room.id}
                  room={room}
                  isSelected={drawerRoom?.id === room.id}
                  onSelect={handleSelectRoom}
                  onOpenActions={(r) => {
                    if (r.estado_actual === 'LIBRE') setCheckInRoom(r);
                    else setCheckOutRoom(r);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Detail Drawer */}
        {drawerRoom && (
          <div className="shrink-0 w-full lg:w-96 sticky top-20">
            <RoomDetailDrawer
              room={drawerRoom}
              onClose={() => setDrawerRoom(null)}
              onCheckIn={(r) => setCheckInRoom(r)}
              onCheckOut={(r) => setCheckOutRoom(r)}
              onRoomService={(r) => setRoomServiceRoom(r)}
              onFinishCleaning={(r) => {
                r.estado_actual = 'LIBRE';
                setDrawerRoom({ ...r });
              }}
            />
          </div>
        )}
      </div>

      {/* Modal 1: Check-in Express */}
      {checkInRoom && (
        <CheckInModal
          room={checkInRoom}
          isOpen={!!checkInRoom}
          onClose={() => setCheckInRoom(null)}
          onSuccess={() => {
            checkInRoom.estado_actual = 'OCUPADA';
            checkInRoom.estadia_activa = {
              id: 'temp-estadia',
              fecha_ingreso: new Date().toISOString(),
              fecha_vencimiento_estimada: new Date(Date.now() + 120 * 60 * 1000).toISOString(),
              es_pernocte: false,
              patente_vehiculo: null,
            };
            setDrawerRoom({ ...checkInRoom });
          }}
        />
      )}

      {/* Modal 2: Check-out y Liquidación Multimedio */}
      {checkOutRoom && (
        <CheckOutModal
          room={checkOutRoom}
          isOpen={!!checkOutRoom}
          onClose={() => setCheckOutRoom(null)}
          onSuccess={() => {
            checkOutRoom.estado_actual = 'LIMPIEZA';
            checkOutRoom.estadia_activa = null;
            setDrawerRoom({ ...checkOutRoom });
          }}
        />
      )}

      {/* Modal 3: Bar & Room Service */}
      {roomServiceRoom && (
        <RoomServiceModal
          room={roomServiceRoom}
          isOpen={!!roomServiceRoom}
          onClose={() => setRoomServiceRoom(null)}
          onSuccess={() => {
            if (roomServiceRoom.estadia_activa) {
              roomServiceRoom.estadia_activa.monto_consumos =
                (roomServiceRoom.estadia_activa.monto_consumos || 0) + 3500;
              setDrawerRoom({ ...roomServiceRoom });
            }
          }}
        />
      )}
    </div>
  );
}
