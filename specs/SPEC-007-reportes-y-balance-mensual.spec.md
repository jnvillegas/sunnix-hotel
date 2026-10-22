# SPEC-007: Reportes Gerenciales, BI y Balance Mensual
**Estado:** IMPLEMENTADO
**Fase Roadmap:** Fase 8 - Reportes Gerenciales y Balance Mensual
**Procesos Vinculados:** `REP-01`, `REP-02`, `REP-03`
**Módulos Afectados:** Reportes (`/dashboard/reportes`), Contabilidad, BI

---

## 1. Objetivo y Alcance
Proveer al propietario y a la administración de un centro de inteligencia de negocios visual de alto impacto (Command Center BI) idéntico a las maquetas oficiales de **SUNNIX HOTEL**:
- **Hero Header con Banner de Suite:** Título, descripción operativa, selector de rango de fechas (`01/09/2024 - 30/09/2024`), filtro por turnos y botón `[ Exportar ]`.
- **4 KPIs Ejecutivos de Período:** Ingresos del período con variación (+12%), Egresos del período (+8%), Ocupación promedio (75%) y Personal activo (18).
- **Sub-navegación por Pestañas:** `Resumen general`, `Habitaciones`, `Caja y recaudación`, `Limpieza`, `Personal`, `Insumos`, `Rentabilidad`.
- **8 Widgets Analíticos en Grilla Bento:**
  1. *Ocupación de Habitaciones:* Gráfico de línea con curva diaria a lo largo del mes.
  2. *Ingresos por Turno:* Barras comparativas de Turno 1 (06:00-14:00), Turno 2 (14:00-22:00) y Turno 3 (22:00-06:00).
  3. *Ingresos por Concepto:* Donut chart con distribución de Estadías (68%), Horas adicionales (18%), Consumos (8%), Otros servicios (4%) y Descuentos (2%).
  4. *Tiempo Promedio de Limpieza:* Promedio general (12 min, -18% vs mes anterior) y barras por categoría (Suite 18 min, Premium 14 min, Estándar 10 min, Económica 8 min).
  5. *Asistencia del Personal:* Donut chart de presentes (16/18) con desglose por puesto (Encargadas, Recepción, Mucamas, etc.).
  6. *Métodos de Pago:* Barras de recaudación y participación: Efectivo (45%), Tarjeta (32%), Transferencia (18%), Otros (5%).
  7. *Detalle de Ingresos por Habitación:* Tabla con columnas Habitación, Categoría, Cantidad de estadías, Tiempo promedio, Ingreso total y barra visual de % de ocupación.
  8. *Resumen del Período:* Tabla formal comparativa de métricas: Actual vs Mes anterior vs Variación (Ingresos, Egresos, Resultado Neto, Ocupación, Cantidad de estadías, Ingreso promedio por estadía).

---

## 2. Contrato de Datos (Inputs / Outputs)

### 2.1 Server Action: `getReportesGerencialesAction`
- **Archivo:** `src/actions/reportes.ts` (re-export en `src/app/actions/reportes.ts`)
- **Input:**
  ```typescript
  export interface ReporteFiltroInput {
    fechaDesde: string; // YYYY-MM-DD
    fechaHasta: string; // YYYY-MM-DD
    turno?: 'TODOS' | 'TURNO_1' | 'TURNO_2' | 'TURNO_3';
  }
  ```
- **Output:**
  ```typescript
  export interface MetricaVariacion {
    valor: number;
    variacionPorcentaje: number;
    esPositiva: boolean;
  }

  export interface ReporteKPIs {
    ingresos: MetricaVariacion;
    egresos: MetricaVariacion;
    ocupacionPromedio: MetricaVariacion;
    personalActivo: number;
  }

  export interface PuntoOcupacionDiaria {
    dia: string; // "01/09", "05/09", etc.
    porcentaje: number; // 0 - 100
  }

  export interface IngresoPorTurno {
    turnoNombre: string; // "Turno 1", "Turno 2", "Turno 3"
    horario: string; // "06:00 - 14:00"
    monto: number;
    color: string;
  }

  export interface IngresoPorConceptoItem {
    concepto: string; // "Estadías", "Horas adicionales", "Consumos", "Otros servicios", "Descuentos"
    monto: number;
    porcentaje: number;
    color: string;
  }

  export interface TiempoLimpiezaCategoria {
    categoria: string; // "Suite", "Premium", "Estándar", "Económica"
    minutos: number;
  }

  export interface MetodoPagoItem {
    metodo: string; // "Efectivo", "Tarjeta", "Transferencia", "Otros"
    monto: number;
    porcentaje: number;
  }

  export interface DetalleHabitacionItem {
    habitacionId: string;
    numero: string;
    categoria: string;
    cantidadEstadias: number;
    tiempoPromedioStr: string; // "2 h 10 min"
    ingresoTotal: number;
    porcentajeOcupacion: number;
  }

  export interface ResumenPeriodoItem {
    indicador: string; // "Ingresos", "Egresos", "Resultado", "Ocupación promedio", "Cantidad de estadías", "Ingreso promedio por estadía"
    actualStr: string;
    mesAnteriorStr: string;
    variacionStr: string;
    esAumento: boolean;
  }

  export interface ReportesGerencialesResponse {
    kpis: ReporteKPIs;
    ocupacionDiaria: PuntoOcupacionDiaria[];
    ingresosPorTurno: IngresoPorTurno[];
    ingresosPorConcepto: IngresoPorConceptoItem[];
    tiempoPromedioLimpieza: {
      promedioMinutos: number;
      variacionPorcentaje: number;
      porCategoria: TiempoLimpiezaCategoria[];
    };
    asistenciaPersonal: {
      total: number;
      presentes: number;
      desglose: { puesto: string; presentes: number; total: number }[];
    };
    metodosPago: MetodoPagoItem[];
    detalleHabitaciones: DetalleHabitacionItem[];
    resumenComparativo: ResumenPeriodoItem[];
  }
  ```

---

## 3. UI y Componentes Requeridos
1. `src/app/dashboard/reportes/page.tsx`: Server component protegido para rol `ADMIN`.
2. `src/components/reports/ReportsView.tsx`: Contenedor principal con tabs y visualizaciones.
3. `src/components/reports/ReportsHeroBanner.tsx`: Cabecera con fondo fotográfico y selectores.
4. `src/components/reports/PeriodSummaryCards.tsx`: Las 4 tarjetas superiores de KPIs con variación.
5. `src/components/reports/ChartsGrid.tsx`: Malla Bento con gráficos SVG de ocupación, barras de turnos y donut de conceptos.
6. `src/components/reports/RoomRevenueTable.tsx`: Tabla de ingresos suite por suite con barras de ocupación.
7. `src/components/reports/ComparativePeriodTable.tsx`: Tabla financiera comparativa vs mes anterior.

---

## 4. Criterios de Aceptación (Definition of Done)
- [x] La interfaz refleja con exactitud la estética, paleta de colores y componentes de la maqueta oficial (Imagen 5).
- [x] La Server Action consolida datos de `estadias`, `pagos_estadia`, `consumos_estadia` y turnos.
- [x] Los filtros de período y turnos recalculan la vista de manera fluida.
- [x] El botón `[ Exportar ]` descarga una planilla CSV con los datos del período.
- [x] Tipado TypeScript estricto, 0 `any`, compilación limpia en `npm run build`.
