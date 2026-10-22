'use client';

import React, { useState } from 'react';
import type {
  CajaPorTurnoData,
  MovimientoCajaItem,
  RegistrarMovimientoManualInput,
} from '@/types';
import { CajaTurnoHeroHeader } from './CajaTurnoHeroHeader';
import { TurnoSelectorCards } from './TurnoSelectorCards';
import { MovimientosTable } from './MovimientosTable';
import { EstadoCajaPanel } from './EstadoCajaPanel';
import { CajaAnalyticsWidgets } from './CajaAnalyticsWidgets';
import { RegistrarMovimientoModal } from './RegistrarMovimientoModal';
import { registrarMovimientoManualAction } from '@/actions/cajaTurno';

interface CajaTurnoViewProps {
  initialData: CajaPorTurnoData;
}

export function CajaTurnoView({ initialData }: CajaTurnoViewProps) {
  const [data, setData] = useState<CajaPorTurnoData>(initialData);
  const [selectedTurnoId, setSelectedTurnoId] = useState<string>(
    initialData.turnoActivoId
  );
  const [observaciones, setObservaciones] = useState(initialData.observaciones);

  const [modalMode, setModalMode] = useState<'NONE' | 'INGRESO' | 'EGRESO'>('NONE');

  const selectedTurno =
    data.turnos.find((t) => t.id === selectedTurnoId) || data.turnos[1];

  const handleConfirmMovimiento = async (input: RegistrarMovimientoManualInput) => {
    await registrarMovimientoManualAction(input);

    const nowStr = new Date().toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const nuevoMovimiento: MovimientoCajaItem = {
      id: `mov-${Date.now()}`,
      horaStr: nowStr,
      tipo: input.tipo,
      concepto: input.concepto,
      habitacionNumero: input.habitacionNumero,
      medioPago: input.medioPago,
      importe: input.importe,
      usuarioNombre: data.responsableNombre,
    };

    setData((prev) => {
      const isIngreso = input.tipo === 'INGRESO';
      const newIngresos = isIngreso
        ? prev.totalIngresos + input.importe
        : prev.totalIngresos;
      const newEgresos = !isIngreso
        ? prev.totalEgresos + input.importe
        : prev.totalEgresos;
      const newSaldo = prev.saldoInicial + newIngresos - newEgresos;

      return {
        ...prev,
        totalIngresos: newIngresos,
        totalEgresos: newEgresos,
        saldoActual: newSaldo,
        movimientos: [nuevoMovimiento, ...prev.movimientos],
      };
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header with Navigation to History */}
      <CajaTurnoHeroHeader />

      {/* 3 Shifts Selector Cards matching Image 3 */}
      <TurnoSelectorCards
        turnos={data.turnos}
        selectedTurnoId={selectedTurnoId}
        onSelectTurno={(id) => setSelectedTurnoId(id)}
      />

      {/* Master 2-Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (8 cols): Movements Table & Analytics Widgets */}
        <div className="lg:col-span-8 space-y-5">
          <MovimientosTable
            movimientos={data.movimientos}
            aperturaHora={data.aperturaHora}
            responsableNombre={data.responsableNombre}
            observaciones={observaciones}
            turnoNombre={selectedTurno.nombre}
            onOpenIngresoModal={() => setModalMode('INGRESO')}
            onOpenEgresoModal={() => setModalMode('EGRESO')}
          />

          <CajaAnalyticsWidgets
            resumenMediosPago={data.resumenMediosPago}
            resumenConceptos={data.resumenConceptos}
          />
        </div>

        {/* Right Column (4 cols): Shift Cash Balance & Final Close CTA */}
        <div className="lg:col-span-4 sticky top-20">
          <EstadoCajaPanel
            turnoNombre={selectedTurno.nombre}
            saldoInicial={data.saldoInicial}
            totalIngresos={data.totalIngresos}
            totalEgresos={data.totalEgresos}
            saldoActual={data.saldoActual}
            habitacionesStats={data.habitacionesStats}
            observaciones={observaciones}
            onObservacionesChange={setObservaciones}
            onPrintResumen={handlePrint}
            onGuardarObservaciones={() => {}}
          />
        </div>
      </div>

      {/* Manual Movement Modal */}
      <RegistrarMovimientoModal
        isOpen={modalMode !== 'NONE'}
        onClose={() => setModalMode('NONE')}
        tipoDefault={modalMode === 'EGRESO' ? 'EGRESO' : 'INGRESO'}
        onConfirm={handleConfirmMovimiento}
      />
    </div>
  );
}
