# 04. Roadmap de Desarrollo por Fases

- [x] **Fase 1: Setup y Tipado Base**
  - Inicializar proyecto Next.js con Tailwind y shadcn/ui.
  - Configurar clientes Supabase (`server.ts`, `client.ts`).
  - Generar tipos TypeScript a partir del esquema SQL (`types/database.ts`).

- [x] **Fase 2: Auth y Control de Caja (Bloqueo Operativo)**
  - Flujo de Login con Supabase Auth.
  - Pantalla obligatoria de Apertura de Caja si no hay una activa.
  - Layout del Dashboard con estado de turno en el Header.

- [x] **Fase 3: Rack Operativo en Tiempo Real (Core UI)**
  - Implementación de `RoomGrid` y `RoomCard` con diseño Command Center oscuro.
  - Sincronización en tiempo real vía `useRackRealtime`.
  - Componente de temporizador con cuenta regresiva regresiva por habitación.

- [x] **Fase 4: Motor de Tarifas y Check-in/Check-out**
  - Algoritmo de cálculo dinámico (Turno base vs Horas extras vs Tolerancia).
  - Modal de Check-in express y apertura de estadía.
  - Modal de Check-out con liquidación unificada.

- [x] **Fase 5: Módulo de Bar (Comandas)**
  - Carga rápida de consumos por número de habitación.
  - Descuento de stock en tiempo real.

- [x] **Fase 6: Arqueo Ciego y Auditoría**
  - Pantalla de cierre de caja con conteo de billetes y validación ciega.
  - Registro de auditoría ante cancelaciones o modificaciones.

---

### Nuevas Fases de Alineación con el Design System Oficial:

- [x] **Fase 7: Rediseño del Master Layout (Design System Oficial SUNNIX HOTEL)**
  - Sidebar izquierdo (`w-64`) Dark Navy con isotipo neón oficial y los 9 módulos de navegación.
  - Top Bar global con buscador contextual, reloj digital en vivo y perfil de usuario (`María Gómez`).
  - Drawer lateral deslizable multipropósito para habitaciones y colaboradores.
  - Actualización de `RoomPhotoCard` con fotografía de suite, badges flotantes y barra de KPIs superior.

- [x] **Fase 8: Reportes Gerenciales y Balance Mensual (SPEC-007)**
  - Banner hero con imagen de suite de lujo y KPIs ejecutivos de facturación y ocupación.
  - Sub-navegación por pestañas (Resumen general, Habitaciones, Caja, Limpieza, Personal, Insumos, Rentabilidad).
  - Gráficos analíticos: ingresos por turno (1, 2, 3), donut de conceptos y barras de medios de pago.
  - Tabla de rendimiento suite por suite y tabla comparativa del período vs mes anterior.
  - Exportación contable en CSV.

- [x] **Fase 9: Control de Limpieza y Terminal de Mucamas (SPEC-008 - [HK-01..05])**
  - Vista especializada de limpieza con filtros por estado, categoría y personal.
  - Grilla de habitaciones con barra de avance % y tiempo transcurrido en rojo.
  - Tabla de tareas pendientes y en proceso con estimaciones de tiempo.
  - Drawer lateral de habitación con botón directo `[ Marcar como finalizada ]` y `[ Reasignar ]`.

- [x] **Fase 10: Asistencia del Personal y Turnos (SPEC-009 - [RRHH-01..03])**
  - Panel en tiempo real de ingresos, salidas y turnos del personal.
  - Fila de KPIs de asistencia (Total, Presentes, Ausentes, Llegada tarde, En descanso).
  - Planilla con horarios programados, ingresos reales y estado (`Presente`, `Tarde`, `Ausente`).
  - Drawer lateral con detalle del empleado, historial de registros y timeline de novedades.

- [x] **Fase 11: Caja por Turno y Libro de Ingresos / Egresos (SPEC-010 - [CAJA-01..05])**
  - Selector superior de turnos (Turno 1, Turno 2, Turno 3 con estado Abierto/Cerrado/Pendiente).
  - Libro de movimientos en tiempo real (ingresos de estadías/bar vs egresos de compras/insumos).
  - Panel lateral de resumen de turno con saldo inicial, ingresos, egresos y saldo actual.
  - Acceso directo a `[ Finalizar y cerrar turno ]` con arqueo ciego inmutable.