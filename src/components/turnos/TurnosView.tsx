'use client';

import React, { useState } from 'react';
import type {
  TurnosPageData,
  ReservaTurnoItem,
  NuevaReservaInput,
} from '@/types';
import { TurnosHeroHeader } from './TurnosHeroHeader';
import { TurnosKPICards } from './TurnosKPICards';
import { TurnosFilterBar } from './TurnosFilterBar';
import { TurnosReservasTable } from './TurnosReservasTable';
import { TurnosDetailDrawer } from './TurnosDetailDrawer';
import { NuevaReservaModal } from './NuevaReservaModal';
import { crearReservaAction, cancelarReservaAction } from '@/actions/turnos';

interface TurnosViewProps {
  initialData: TurnosPageData;
}

export function TurnosView({ initialData }: TurnosViewProps) {
  const [data, setData] = useState<TurnosPageData>(initialData);
  const [filtroTipo, setFiltroTipo] = useState('TODAS');
  const [filtroEstado, setFiltroEstado] = useState('TODAS');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedReserva, setSelectedReserva] = useState<ReservaTurnoItem | null>(
    initialData.reservas[0] || null
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrado
  const filteredReservas = data.reservas.filter((res) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = res.huespedNombre.toLowerCase().includes(q);
      const matchHab = res.habitacionNumero.includes(q);
      const matchPatente = res.patenteVehiculo?.toLowerCase().includes(q);
      if (!matchName && !matchHab && !matchPatente) return false;
    }

    if (filtroTipo === 'PERNOCTE' && res.tipoTurno !== 'PERNOCTE') {
      return false;
    }
    if (filtroTipo === 'TURNOS' && res.tipoTurno === 'PERNOCTE') {
      return false;
    }

    if (filtroEstado !== 'TODAS' && res.estado !== filtroEstado) {
      return false;
    }

    return true;
  });

  const handleConfirmNuevaReserva = async (input: NuevaReservaInput) => {
    await crearReservaAction(input);

    const nueva: ReservaTurnoItem = {
      id: `res-${Date.now()}`,
      habitacionId: input.habitacionId,
      habitacionNumero: input.habitacionId.replace('hab-', ''),
      categoria: input.habitacionId === 'hab-102' ? 'Suite' : 'Premium',
      fotoUrl:
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      huespedNombre: input.huespedNombre,
      telefono: input.telefono,
      patenteVehiculo: input.patenteVehiculo,
      tipoTurno: input.tipoTurno,
      fecha: input.fecha,
      horarioInicio: input.horarioInicio,
      horarioFin: input.horarioFin,
      montoTotal: input.montoTotal,
      montoSena: input.montoSena,
      estado: 'CONFIRMADA',
      observaciones: input.observaciones,
    };

    setData((prev) => ({
      ...prev,
      kpis: {
        ...prev.kpis,
        reservasHoy: prev.kpis.reservasHoy + 1,
        pernoctesActivos:
          input.tipoTurno === 'PERNOCTE'
            ? prev.kpis.pernoctesActivos + 1
            : prev.kpis.pernoctesActivos,
      },
      reservas: [nueva, ...prev.reservas],
    }));

    setSelectedReserva(nueva);
  };

  const handleCancelarReserva = async (id: string) => {
    await cancelarReservaAction(id, 'Cancelación a pedido del huésped');

    setData((prev) => ({
      ...prev,
      reservas: prev.reservas.map((r) =>
        r.id === id ? { ...r, estado: 'CANCELADA' as const } : r
      ),
    }));

    if (selectedReserva && selectedReserva.id === id) {
      setSelectedReserva((prev) =>
        prev ? { ...prev, estado: 'CANCELADA' as const } : null
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <TurnosHeroHeader onOpenNuevaReserva={() => setIsModalOpen(true)} />

      {/* 4 KPI Cards */}
      <TurnosKPICards kpis={data.kpis} />

      {/* Filter Bar */}
      <TurnosFilterBar
        filtroTipo={filtroTipo}
        onFiltroTipoChange={setFiltroTipo}
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2-Columns Grid: Table + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8">
          <TurnosReservasTable
            reservas={filteredReservas}
            selectedReservaId={selectedReserva?.id}
            onSelectReserva={(r) => setSelectedReserva(r)}
          />
        </div>

        <div className="lg:col-span-4 sticky top-20">
          <TurnosDetailDrawer
            reserva={selectedReserva}
            onClose={() => setSelectedReserva(null)}
            onCancelarReserva={handleCancelarReserva}
          />
        </div>
      </div>

      {/* Modal */}
      <NuevaReservaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmNuevaReserva}
      />
    </div>
  );
}
