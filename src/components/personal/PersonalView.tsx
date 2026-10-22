'use client';

import React, { useState } from 'react';
import type {
  AsistenciaPersonalData,
  EmpleadoAsistenciaItem,
  RegistrarMarcacionInput,
} from '@/types';
import { PersonalHeroHeader } from './PersonalHeroHeader';
import { PersonalKPICards } from './PersonalKPICards';
import { PersonalFilterBar } from './PersonalFilterBar';
import { PersonalTable } from './PersonalTable';
import { PersonalDetailDrawer } from './PersonalDetailDrawer';
import { PersonalAnalyticsWidgets } from './PersonalAnalyticsWidgets';
import { RegistrarAsistenciaModal } from './RegistrarAsistenciaModal';
import { registrarMarcacionAction } from '@/actions/personal';

interface PersonalViewProps {
  initialData: AsistenciaPersonalData;
}

export function PersonalView({ initialData }: PersonalViewProps) {
  const [data, setData] = useState<AsistenciaPersonalData>(initialData);
  const [fecha, setFecha] = useState('26/09/2024');
  const [filtroTurno, setFiltroTurno] = useState('TODOS');
  const [filtroCargo, setFiltroCargo] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [searchQuery, setSearchQuery] = useState('');

  // Empleado seleccionado para el panel derecho (por defecto el primero como en la maqueta)
  const [selectedEmpleado, setSelectedEmpleado] = useState<EmpleadoAsistenciaItem | null>(
    initialData.empleados[0] || null
  );

  const [isRegistrarModalOpen, setIsRegistrarModalOpen] = useState(false);

  // Filtrado reactivo de empleados
  const filteredEmpleados = data.empleados.filter((emp) => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = emp.nombreCompleto.toLowerCase().includes(q);
      const matchDni = emp.dni.includes(q);
      if (!matchName && !matchDni) return false;
    }

    if (filtroTurno !== 'TODOS' && emp.turno !== filtroTurno) {
      return false;
    }

    if (filtroCargo !== 'TODOS' && emp.cargo !== filtroCargo) {
      return false;
    }

    if (filtroEstado !== 'TODOS' && emp.estado !== filtroEstado) {
      return false;
    }

    return true;
  });

  const handleConfirmMarcacion = async (input: RegistrarMarcacionInput) => {
    await registrarMarcacionAction(input);

    const nowStr = new Date().toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setData((prev) => {
      const updatedEmpleados = prev.empleados.map((emp) => {
        if (emp.id === input.empleadoId) {
          return {
            ...emp,
            ingreso: input.tipo === 'INGRESO' ? nowStr : emp.ingreso,
            salida: input.tipo === 'SALIDA' ? nowStr : emp.salida,
            estado:
              input.tipo === 'INGRESO'
                ? ('PRESENTE' as const)
                : input.tipo === 'DESCANSO_INICIO'
                ? ('DESCANSO' as const)
                : emp.estado,
          };
        }
        return emp;
      });

      const targetEmp = updatedEmpleados.find((e) => e.id === input.empleadoId);

      const nuevaNovedad = {
        id: `nov-${Date.now()}`,
        hora: nowStr,
        empleado: targetEmp?.nombreCompleto || 'Colaborador',
        evento: `Marcación: ${input.tipo}`,
        tipo: 'INFO' as const,
      };

      return {
        ...prev,
        empleados: updatedEmpleados,
        novedades: [nuevaNovedad, ...prev.novedades],
      };
    });

    if (selectedEmpleado && selectedEmpleado.id === input.empleadoId) {
      setSelectedEmpleado((prev) =>
        prev
          ? {
              ...prev,
              ingreso: input.tipo === 'INGRESO' ? nowStr : prev.ingreso,
              salida: input.tipo === 'SALIDA' ? nowStr : prev.salida,
            }
          : null
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <PersonalHeroHeader
        onOpenRegistrarModal={() => setIsRegistrarModalOpen(true)}
      />

      {/* 5 KPI Cards */}
      <PersonalKPICards kpis={data.kpis} />

      {/* Filters Bar */}
      <PersonalFilterBar
        fecha={fecha}
        onFechaChange={setFecha}
        filtroTurno={filtroTurno}
        onTurnoChange={setFiltroTurno}
        filtroCargo={filtroCargo}
        onCargoChange={setFiltroCargo}
        filtroEstado={filtroEstado}
        onEstadoChange={setFiltroEstado}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Master 2-column Layout: Central Table + Right Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Attendance Grid (8 cols) */}
        <div className="lg:col-span-8">
          <PersonalTable
            empleados={filteredEmpleados}
            selectedEmpleadoId={selectedEmpleado?.id}
            onSelectEmpleado={(emp) => setSelectedEmpleado(emp)}
          />
        </div>

        {/* Right Column: Employee Detail Drawer (4 cols) */}
        <div className="lg:col-span-4 sticky top-20">
          <PersonalDetailDrawer
            empleado={selectedEmpleado}
            onOpenEditarModal={() => setIsRegistrarModalOpen(true)}
          />
        </div>
      </div>

      {/* Bottom 3 Bento Analytics Widgets */}
      <PersonalAnalyticsWidgets
        personalPorCargo={data.personalPorCargo}
        presentesPorTurno={data.presentesPorTurno}
        novedades={data.novedades}
      />

      {/* Clocking Modal */}
      <RegistrarAsistenciaModal
        isOpen={isRegistrarModalOpen}
        onClose={() => setIsRegistrarModalOpen(false)}
        empleados={data.empleados}
        preSelectedEmpleadoId={selectedEmpleado?.id}
        onConfirmMarcacion={handleConfirmMarcacion}
      />
    </div>
  );
}
