# SPEC-009: Control de Asistencia y Turnos de Personal
**Estado:** IMPLEMENTADO
**Fase Roadmap:** Fase 10 - Asistencia del Personal y Turnos
**Procesos Vinculados:** `RRHH-01`, `RRHH-02`
**Módulos Afectados:** Personal (`/dashboard/personal`), Recursos Humanos

---

## 1. Objetivo y Alcance
Controlar en tiempo real la dotación activa, turnos programados y novedades de guardia según la maqueta oficial (Imagen 1):
- **Hero Header:** Título *"Asistencia del personal"*, subtítulo y botón principal `[ + Registrar asistencia ]`.
- **Fila de KPIs Superiores (5 Tarjetas):** Personal total (18), Presentes (16), Ausente (1), Llegada tarde (1), En descanso (0).
- **Filtros Operativos:** Fecha, Turno (`Turno 1`, `Turno 2`, `Turno 3`), Cargo (`Encargada`, `Recepción / Caja`, `Mucama`, `Limpieza`), Estado (`Presente`, `Tarde`, `Ausente`) y Buscador de empleado.
- **Tabla de Asistencia:** Columnas Empleado (avatar + nombre), Cargo, Turno, Horario programado, Ingreso, Salida, Estado (Pill verde/amarillo/rojo) y Acciones (`...`).
- **Drawer Lateral de Detalle del Empleado:** Foto de perfil, DNI, turno actual, timestamps de ingreso/salida, historial de hoy y últimos registros biométricos de los días anteriores.
- **Widgets Inferiores de Analítica:**
  - *Personal por cargo:* Donut chart con distribución porcentual.
  - *Presentes por turno:* Gráfico de barras de dotación activa por turno (4/4, 3/4, 3/4).
  - *Novedades del día:* Feed de eventos y avisos en vivo (llegadas tarde, relevos, limpiezas completadas).

---

## 2. Contrato de Datos (Inputs / Outputs)

```typescript
export type RolColaborador = 'ENCARGADA' | 'RECEPCION_CAJA' | 'MUCAMA' | 'LIMPIEZA' | 'MANTENIMIENTO';
export type EstadoAsistencia = 'PRESENTE' | 'TARDE' | 'AUSENTE' | 'DESCANSO';

export interface EmpleadoAsistenciaItem {
  id: string;
  nombreCompleto: string;
  avatarUrl?: string;
  dni: string;
  cargo: RolColaborador;
  turnoNombre: string; // "Turno 1 (06:00 - 14:00)"
  horarioProgramado: string;
  ingresoReal?: string;
  salidaReal?: string;
  estado: EstadoAsistencia;
  historialSemanal: { fecha: string; ingreso: string; salida: string; estado: EstadoAsistencia }[];
}

export interface RegistrarMarcacionInput {
  empleadoId: string;
  tipo: 'INGRESO' | 'SALIDA' | 'DESCANSO_INICIO' | 'DESCANSO_FIN';
  observaciones?: string;
}
```

---

## 3. Criterios de Aceptación (Definition of Done)
- [x] La UI replica con fidelidad la maqueta de Asistencia del Personal (Imagen 1).
- [x] El Drawer lateral permite inspeccionar la ficha completa del colaborador y su historial reciente.
- [x] Los contadores de KPIs y widgets inferiores se actualizan dinámicamente con los filtros de fecha y turno.
- [x] Tipado estricto sin uso de `any`.
