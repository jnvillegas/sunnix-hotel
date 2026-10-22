'use client';

import React, { useState } from 'react';
import type { ReportesGerencialesResponse } from '@/types';
import { ReportsHeroBanner } from './ReportsHeroBanner';
import { ReportKPICards } from './ReportKPICards';
import { ReportTabs } from './ReportTabs';
import { ReportWidgetsGrid } from './ReportWidgetsGrid';

interface ReportsViewProps {
  initialData: ReportesGerencialesResponse;
}

export function ReportsView({ initialData }: ReportsViewProps) {
  const [activeTab, setActiveTab] = useState<string>('resumen');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [turnoFiltro, setTurnoFiltro] = useState<string>('all');
  const [fechaRango] = useState<string>('01/09/2024 - 30/09/2024');

  const handleExportCSV = () => {
    const { kpis, ingresosPorTurno, ingresosPorConcepto, detalleHabitaciones, resumenComparativo } =
      initialData;

    const lines: string[] = [];

    // Header
    lines.push('SUNNIX HOTEL - REPORTE GERENCIAL Y BALANCE MENSUAL');
    lines.push(`Período:;${fechaRango}`);
    lines.push(`Fecha de Emisión:;${new Date().toLocaleDateString('es-AR')}`);
    lines.push('');

    // KPIs
    lines.push('MÉTRICAS CLAVE (KPIS)');
    lines.push(`Ingresos del período:;$ ${kpis.ingresos.valor.toLocaleString('es-AR')};+${kpis.ingresos.variacionPorcentaje}% vs mes anterior`);
    lines.push(`Egresos del período:;$ ${kpis.egresos.valor.toLocaleString('es-AR')};+${kpis.egresos.variacionPorcentaje}% vs mes anterior`);
    lines.push(`Ocupación promedio:;${kpis.ocupacionPromedio.valor}%;+${kpis.ocupacionPromedio.variacionPorcentaje}% vs mes anterior`);
    lines.push(`Personal activo:;${kpis.personalActivo}`);
    lines.push('');

    // Ingresos por Turno
    lines.push('DISTRIBUCIÓN DE INGRESOS POR TURNO');
    lines.push('Turno;Horario;Recaudación');
    ingresosPorTurno.forEach((t) => {
      lines.push(`${t.turnoNombre};${t.horario};$ ${t.monto.toLocaleString('es-AR')}`);
    });
    lines.push('');

    // Ingresos por Concepto
    lines.push('INGRESOS POR CONCEPTO');
    lines.push('Concepto;Monto;Participación');
    ingresosPorConcepto.forEach((c) => {
      lines.push(`${c.concepto};$ ${c.monto.toLocaleString('es-AR')};${c.porcentaje}%`);
    });
    lines.push('');

    // Detalle por Habitación
    lines.push('RENDIMIENTO POR HABITACIÓN');
    lines.push('Habitación;Categoría;Estadías;Tiempo Promedio;Facturación;Ocupación');
    detalleHabitaciones.forEach((h) => {
      lines.push(
        `${h.numero};${h.categoria};${h.cantidadEstadias};${h.tiempoPromedioStr};$ ${h.ingresoTotal.toLocaleString('es-AR')};${h.porcentajeOcupacion}%`
      );
    });
    lines.push('');

    // Resumen Comparativo
    lines.push('RESUMEN COMPARATIVO DEL PERÍODO');
    lines.push('Indicador;Mes Actual;Mes Anterior;Variación');
    resumenComparativo.forEach((r) => {
      lines.push(`${r.indicador};${r.actualStr};${r.mesAnteriorStr};${r.variacionStr}`);
    });

    const csvContent = '\uFEFF' + lines.join('\n'); // Add BOM for Excel UTF-8 compatibility
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sunnix_reporte_gerencial_${fechaRango.replace(/\s+/g, '_').replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner with Suite Photo, Search, Filters & CSV Export */}
      <ReportsHeroBanner
        fechaRango={fechaRango}
        onExport={handleExportCSV}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        turnoFiltro={turnoFiltro}
        onTurnoChange={setTurnoFiltro}
      />

      {/* 4 Top KPI Cards */}
      <ReportKPICards kpis={initialData.kpis} />

      {/* Sub-navigation Tabs */}
      <ReportTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Bento Grid Analytical Widgets */}
      <ReportWidgetsGrid data={initialData} />
    </div>
  );
}
