'use client';

import React, { useState, useMemo } from 'react';
import type { IngresosEgresosPageData, MovimientoFinancieroItem } from '@/types';
import { IngresosEgresosHeroHeader } from './IngresosEgresosHeroHeader';
import { IngresosEgresosKPICards } from './IngresosEgresosKPICards';
import { IngresosEgresosFilterBar } from './IngresosEgresosFilterBar';
import { IngresosEgresosTable } from './IngresosEgresosTable';
import { RegistrarMovimientoFinancieroModal } from './RegistrarMovimientoFinancieroModal';

interface IngresosEgresosViewProps {
  initialData: IngresosEgresosPageData;
}

export function IngresosEgresosView({ initialData }: IngresosEgresosViewProps) {
  const [data, setData] = useState<IngresosEgresosPageData>(initialData);
  const [filtroTipo, setFiltroTipo] = useState<string>('ALL');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('ALL');
  const [filtroMedioPago, setFiltroMedioPago] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Filtered movements
  const movimientosFiltrados = useMemo(() => {
    return data.movimientos.filter((m) => {
      // Tipo filter
      if (filtroTipo !== 'ALL' && m.tipo !== filtroTipo) {
        return false;
      }

      // Categoria filter
      if (filtroCategoria !== 'ALL' && m.categoria !== filtroCategoria) {
        return false;
      }

      // Medio pago filter
      if (filtroMedioPago !== 'ALL' && m.medioPago !== filtroMedioPago) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchConcepto = m.concepto.toLowerCase().includes(query);
        const matchComp = (m.comprobanteNumero || '').toLowerCase().includes(query);
        const matchHab = (m.habitacionNumero || '').toLowerCase().includes(query);
        const matchUser = m.usuarioNombre.toLowerCase().includes(query);
        const matchCat = m.categoriaNombre.toLowerCase().includes(query);

        if (!matchConcepto && !matchComp && !matchHab && !matchUser && !matchCat) {
          return false;
        }
      }

      return true;
    });
  }, [data.movimientos, filtroTipo, filtroCategoria, filtroMedioPago, searchQuery]);

  // Handle new movement added optimistically
  const handleSuccessMovimiento = (nuevo: MovimientoFinancieroItem) => {
    setData((prev) => {
      const updatedMovimientos = [nuevo, ...prev.movimientos];

      const nuevoIngresos =
        nuevo.tipo === 'INGRESO'
          ? prev.kpis.totalIngresos + nuevo.monto
          : prev.kpis.totalIngresos;

      const nuevoEgresos =
        nuevo.tipo === 'EGRESO'
          ? prev.kpis.totalEgresos + nuevo.monto
          : prev.kpis.totalEgresos;

      const balanceNeto = nuevoIngresos - nuevoEgresos;
      const margenOperativo =
        nuevoIngresos > 0 ? (balanceNeto / nuevoIngresos) * 100 : 0;

      return {
        kpis: {
          totalIngresos: nuevoIngresos,
          totalEgresos: nuevoEgresos,
          balanceNeto,
          margenOperativo,
        },
        movimientos: updatedMovimientos,
      };
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Fecha',
      'Hora',
      'Tipo',
      'Categoría',
      'Concepto',
      'Habitación',
      'Comprobante',
      'Medio de Pago',
      'Operador',
      'Monto',
    ];

    const rows = movimientosFiltrados.map((m) => [
      m.fechaStr,
      m.horaStr,
      m.tipo,
      `"${m.categoriaNombre}"`,
      `"${m.concepto}"`,
      m.habitacionNumero || '',
      m.comprobanteNumero || '',
      m.medioPago,
      `"${m.usuarioNombre}"`,
      m.tipo === 'INGRESO' ? m.monto : -m.monto,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_ingresos_egresos_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <IngresosEgresosHeroHeader
        onOpenNuevoMovimiento={() => setIsModalOpen(true)}
        onExportCSV={handleExportCSV}
      />

      {/* KPI Cards */}
      <IngresosEgresosKPICards kpis={data.kpis} />

      {/* Filter Bar */}
      <IngresosEgresosFilterBar
        filtroTipo={filtroTipo}
        onFiltroTipoChange={setFiltroTipo}
        filtroCategoria={filtroCategoria}
        onFiltroCategoriaChange={setFiltroCategoria}
        filtroMedioPago={filtroMedioPago}
        onFiltroMedioPagoChange={setFiltroMedioPago}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Table */}
      <IngresosEgresosTable movimientos={movimientosFiltrados} />

      {/* Modal */}
      <RegistrarMovimientoFinancieroModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccessMovimiento}
      />
    </div>
  );
}
