'use client';

import React, { useState } from 'react';
import type {
  ControlLimpiezaData,
  HabitacionLimpiezaCardData,
  TareaLimpiezaItem,
} from '@/types';
import { LimpiezaHeroHeader } from './LimpiezaHeroHeader';
import { LimpiezaKPICards } from './LimpiezaKPICards';
import { LimpiezaFilterBar } from './LimpiezaFilterBar';
import { LimpiezaRoomsGrid } from './LimpiezaRoomsGrid';
import { LimpiezaTasksTable } from './LimpiezaTasksTable';
import { LimpiezaDrawer } from './LimpiezaDrawer';
import { AsignarLimpiezaModal } from './AsignarLimpiezaModal';
import {
  finalizarLimpiezaAction,
  iniciarLimpiezaAction,
  reasignarLimpiezaAction,
} from '@/actions/limpieza';

interface LimpiezaViewProps {
  initialData: ControlLimpiezaData;
}

export function LimpiezaView({ initialData }: LimpiezaViewProps) {
  const [data, setData] = useState<ControlLimpiezaData>(initialData);
  const [filtroEstado, setFiltroEstado] = useState<string>('TODAS');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('TODAS');
  const [filtroPersonal, setFiltroPersonal] = useState<string>('TODOS');
  const [filtroEstadoTarea, setFiltroEstadoTarea] = useState<string>('TODOS');

  // Selected room for side drawer
  const [selectedHabitacion, setSelectedHabitacion] =
    useState<HabitacionLimpiezaCardData | null>(null);

  // Modals state
  const [isAsignarModalOpen, setIsAsignarModalOpen] = useState(false);
  const [isReasignarModalOpen, setIsReasignarModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrado de habitaciones
  const filteredHabitaciones = data.habitaciones.filter((hab) => {
    // Filtro por estado principal (pills)
    if (filtroEstado !== 'TODAS' && hab.estado !== filtroEstado) {
      return false;
    }
    // Filtro por categoría
    if (filtroCategoria !== 'TODAS' && hab.categoria !== filtroCategoria) {
      return false;
    }
    // Filtro por personal
    if (
      filtroPersonal !== 'TODOS' &&
      hab.personalNombre?.toLowerCase() !== filtroPersonal.toLowerCase()
    ) {
      return false;
    }
    return true;
  });

  // Filtrado de tareas
  const filteredTareas = data.tareas.filter((t) => {
    if (filtroEstadoTarea !== 'TODOS' && t.estado !== filtroEstadoTarea) {
      return false;
    }
    if (filtroCategoria !== 'TODAS' && t.categoria !== filtroCategoria) {
      return false;
    }
    if (
      filtroPersonal !== 'TODOS' &&
      t.personalAsignadoNombre?.toLowerCase() !== filtroPersonal.toLowerCase()
    ) {
      return false;
    }
    return true;
  });

  // Marcar como finalizada
  const handleMarcarFinalizada = async (
    habitacionId: string,
    observaciones?: string
  ) => {
    setIsSubmitting(true);
    try {
      await finalizarLimpiezaAction({ habitacionId, observaciones });

      // Actualización optimista del estado
      setData((prev) => {
        const updatedHabitaciones = prev.habitaciones.map((h) => {
          if (h.id === habitacionId) {
            return {
              ...h,
              estado: 'DISPONIBLE' as const,
              inicioLimpieza: undefined,
              personalNombre: undefined,
              personalId: undefined,
              porcentajeAvance: undefined,
              tiempoEstimadoMinutos: undefined,
              tiempoTranscurridoMinutos: undefined,
              observaciones,
            };
          }
          return h;
        });

        const updatedTareas = prev.tareas.filter(
          (t) => t.habitacionId !== habitacionId
        );

        const disponibles = updatedHabitaciones.filter(
          (h) => h.estado === 'DISPONIBLE'
        ).length;
        const enLimpieza = updatedHabitaciones.filter(
          (h) => h.estado === 'LIMPIEZA'
        ).length;

        return {
          ...prev,
          kpis: {
            ...prev.kpis,
            disponibles,
            enLimpieza,
          },
          habitaciones: updatedHabitaciones,
          tareas: updatedTareas,
        };
      });

      setSelectedHabitacion(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmar asignación desde el modal
  const handleConfirmAsignacion = async (input: {
    habitacionId: string;
    personalId: string;
    tiempoEstimadoMinutos: number;
    observaciones: string;
  }) => {
    await iniciarLimpiezaAction(input);

    const personalMatch = data.personalMucamas.find(
      (p) => p.id === input.personalId
    );

    setData((prev) => {
      const nowStr = new Date().toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const updatedHabitaciones = prev.habitaciones.map((h) => {
        if (h.id === input.habitacionId) {
          return {
            ...h,
            estado: 'LIMPIEZA' as const,
            inicioLimpieza: nowStr,
            personalId: input.personalId,
            personalNombre: personalMatch?.nombre || 'Mucama asignada',
            porcentajeAvance: 10,
            tiempoEstimadoMinutos: input.tiempoEstimadoMinutos,
            tiempoTranscurridoMinutos: 1,
            observaciones: input.observaciones,
          };
        }
        return h;
      });

      const habitacionTarget = updatedHabitaciones.find(
        (h) => h.id === input.habitacionId
      );

      const nuevaTarea: TareaLimpiezaItem = {
        id: `tsk-${Date.now()}`,
        habitacionId: input.habitacionId,
        numero: habitacionTarget?.numero || '100',
        categoria: habitacionTarget?.categoria || 'Estándar',
        estado: 'EN_PROCESO',
        horaSalidaHuesped: habitacionTarget?.salidaHuesped || nowStr,
        horaInicioLimpieza: nowStr,
        tiempoEstimadoMinutos: input.tiempoEstimadoMinutos,
        tiempoTranscurridoMinutos: 1,
        personalAsignadoId: input.personalId,
        personalAsignadoNombre: personalMatch?.nombre || 'Mucama asignada',
        porcentajeAvance: 10,
        observaciones: input.observaciones,
      };

      const disponibles = updatedHabitaciones.filter(
        (h) => h.estado === 'DISPONIBLE'
      ).length;
      const enLimpieza = updatedHabitaciones.filter(
        (h) => h.estado === 'LIMPIEZA'
      ).length;

      return {
        ...prev,
        kpis: {
          ...prev.kpis,
          disponibles,
          enLimpieza,
        },
        habitaciones: updatedHabitaciones,
        tareas: [
          nuevaTarea,
          ...prev.tareas.filter((t) => t.habitacionId !== input.habitacionId),
        ],
      };
    });
  };

  // Reasignar personal
  const handleConfirmReasignacion = async (input: {
    habitacionId: string;
    personalId: string;
    tiempoEstimadoMinutos: number;
    observaciones: string;
  }) => {
    await reasignarLimpiezaAction({
      habitacionId: input.habitacionId,
      personalId: input.personalId,
      motivo: input.observaciones,
    });

    const personalMatch = data.personalMucamas.find(
      (p) => p.id === input.personalId
    );

    setData((prev) => {
      const updatedHabitaciones = prev.habitaciones.map((h) => {
        if (h.id === input.habitacionId) {
          return {
            ...h,
            personalId: input.personalId,
            personalNombre: personalMatch?.nombre || 'Mucama',
          };
        }
        return h;
      });

      const updatedTareas = prev.tareas.map((t) => {
        if (t.habitacionId === input.habitacionId) {
          return {
            ...t,
            personalAsignadoId: input.personalId,
            personalAsignadoNombre: personalMatch?.nombre || 'Mucama',
          };
        }
        return t;
      });

      return {
        ...prev,
        habitaciones: updatedHabitaciones,
        tareas: updatedTareas,
      };
    });

    if (selectedHabitacion && selectedHabitacion.id === input.habitacionId) {
      setSelectedHabitacion((prev) =>
        prev
          ? {
              ...prev,
              personalId: input.personalId,
              personalNombre: personalMatch?.nombre || 'Mucama',
            }
          : null
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <LimpiezaHeroHeader
        onOpenAsignarModal={() => setIsAsignarModalOpen(true)}
      />

      {/* 5 KPI Cards */}
      <LimpiezaKPICards kpis={data.kpis} />

      {/* Filter Bar */}
      <LimpiezaFilterBar
        kpis={data.kpis}
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
        filtroCategoria={filtroCategoria}
        onFiltroCategoriaChange={setFiltroCategoria}
        filtroPersonal={filtroPersonal}
        onFiltroPersonalChange={setFiltroPersonal}
        filtroEstadoTarea={filtroEstadoTarea}
        onFiltroEstadoTareaChange={setFiltroEstadoTarea}
        personalMucamas={data.personalMucamas}
      />

      {/* Room Grid / List View */}
      <LimpiezaRoomsGrid
        habitaciones={filteredHabitaciones}
        selectedHabitacionId={selectedHabitacion?.id}
        onSelectHabitacion={(hab) => setSelectedHabitacion(hab)}
      />

      {/* Housekeeping Tasks Table */}
      <LimpiezaTasksTable
        tareas={filteredTareas}
        onSelectTarea={(tarea) => {
          const matchHab = data.habitaciones.find(
            (h) => h.id === tarea.habitacionId
          );
          if (matchHab) setSelectedHabitacion(matchHab);
        }}
        onFinalizarDirecto={(habitacionId) =>
          handleMarcarFinalizada(habitacionId)
        }
      />

      {/* Slide Drawer */}
      <LimpiezaDrawer
        habitacion={selectedHabitacion}
        onClose={() => setSelectedHabitacion(null)}
        onMarcarFinalizada={handleMarcarFinalizada}
        onOpenReasignarModal={(hab) => {
          setIsReasignarModalOpen(true);
        }}
        isSubmitting={isSubmitting}
      />

      {/* Asignar Limpieza Modal */}
      <AsignarLimpiezaModal
        isOpen={isAsignarModalOpen}
        onClose={() => setIsAsignarModalOpen(false)}
        habitaciones={data.habitaciones}
        personalMucamas={data.personalMucamas}
        onConfirmAsignacion={handleConfirmAsignacion}
      />

      {/* Reasignar Personal Modal */}
      {selectedHabitacion && (
        <AsignarLimpiezaModal
          isOpen={isReasignarModalOpen}
          onClose={() => setIsReasignarModalOpen(false)}
          habitaciones={data.habitaciones}
          personalMucamas={data.personalMucamas}
          preSelectedHabitacionId={selectedHabitacion.id}
          onConfirmAsignacion={handleConfirmReasignacion}
          isReasignar={true}
        />
      )}
    </div>
  );
}
