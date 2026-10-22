# SPEC-008: Control de Limpieza y Rotación de Mucamas
**Estado:** IMPLEMENTADO
**Fase Roadmap:** Fase 9 - Control de Limpieza y Terminal de Mucamas
**Procesos Vinculados:** `HK-01`, `HK-02`, `HK-03`, `HK-04`, `HK-05`
**Módulos Afectados:** Limpieza (`/dashboard/limpieza`), Housekeeping

---

## 1. Objetivo y Alcance
Digitalizar el flujo de trabajo del personal de mucamas y gobernanta con seguimiento en tiempo real según la maqueta oficial (Imagen 4):
- **Hero Header:** Título *"Control de limpieza"*, subtítulo explicativo y botón principal `[ + Asignar limpieza ]`.
- **Fila de KPIs Superiores (5 Tarjetas):** Total habitaciones (12), Disponibles (4), Ocupadas (6), En limpieza (2), Mantenimiento (0).
- **Filtros de Píldoras:** `Todas (12)`, `Disponibles (4)`, `Ocupadas (6)`, `En limpieza (2)`, `Mantenimiento (0)` + Selectores de Categoría, Personal y Estado + Alternador Cuadrícula / Lista.
- **Grilla de Habitaciones con Avance:** Tarjetas con foto de la suite, indicador de inicio de limpieza, mucama asignada y barra de progreso porcentual (ej. 60%, 20%).
- **Tabla de Tareas de Limpieza Pendientes y en Proceso:** Columnas Habitación, Categoría, Estado (`En proceso`, `Pendiente`), Salida huésped, Inicio limpieza, Tiempo estimado, Personal asignado, Barra de progreso y Acciones de reproducción/inspección.
- **Drawer Lateral de Habitación en Limpieza:** Carrusel de fotos, cronómetro con tiempo transcurrido en rojo (ej. 12 min), tiempo restante (8 min), personal asignado, observaciones y botones `[ Marcar como finalizada ]` y `[ Reasignar ]`.

---

## 2. Contrato de Datos (Inputs / Outputs)

```typescript
export interface TareaLimpiezaItem {
  id: string;
  habitacionId: string;
  numero: string;
  categoria: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'FINALIZADA';
  horaSalidaHuesped: string;
  horaInicioLimpieza?: string;
  tiempoEstimadoMinutos: number;
  tiempoTranscurridoMinutos: number;
  personalAsignadoId?: string;
  personalAsignadoNombre?: string;
  porcentajeAvance: number;
  observaciones?: string;
}

export interface IniciarLimpiezaInput {
  habitacionId: string;
  personalId: string;
}

export interface FinalizarLimpiezaInput {
  habitacionId: string;
  observaciones?: string;
}
```

---

## 3. Criterios de Aceptación (Definition of Done)
- [x] La UI replica con fidelidad la maqueta de Control de Limpieza (Imagen 4).
- [x] Al marcar una limpieza como finalizada, la habitación pasa automáticamente a `LIBRE` en el Rack.
- [x] La barra de porcentaje y el tiempo transcurrido alertan en rojo si se supera el tiempo estimado.
- [x] Tipado estricto sin uso de `any`.
