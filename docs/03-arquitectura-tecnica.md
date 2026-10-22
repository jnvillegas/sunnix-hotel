# 03. Arquitectura Técnica y Frontend (Next.js + Supabase)

## 1. Stack Tecnológico
- **Framework:** Next.js (App Router, React Server Components, Server Actions).
- **Backend / DB:** Supabase (PostgreSQL, Supabase Auth, Supabase Realtime con WebSockets nativos).
- **Estilos:** Tailwind CSS con tokens semánticos `@theme`.
- **Iconografía:** Lucide React (vectorial unificada).
- **Sintetizador de Audio:** Web Audio API pura para alertas de cabina en tiempo real.

---

## 2. Design System Oficial "SUNNIX HOTEL"

### 2.1 Identidad Visual y Marca
- **Isotipo:** Doble diamante geométrico en verde neón / cyan (`#00f5d4` / `#10b981`).
- **Logotipo:** `SUNNIX` (bold mono-display) + `HOTEL` (tracking extendido).
- **Paleta de Colores de Fondo:**
  - Sidebar lateral: Dark Navy Command Center (`#0b1120` / `#0f172a` / `#111827`).
  - Fondo de área de trabajo: Neutral Slate / Off-Black (`#09090b` / `#0d1117`).
  - Tarjetas y Contenedores: Deep Navy/Slate con bordes de precisión (`#121217` / `#1e293b` con borde `border-slate-800`).
  - Acentos de Estado:
    - `Disponible / Libre`: Esmeralda / Menta neón (`#10b981`)
    - `Ocupada`: Carmesí / Azul profundo (`#2563eb` o `#ef4444`)
    - `En Limpieza`: Ámbar brillante (`#f59e0b`)
    - `Mantenimiento`: Rosa fucsia / Gris pizarra (`#ec4899` / `#6b7280`)
    - `Acción Principal`: Azul Eléctrico (`#2563eb` / `#0066ff`)

---

## 3. Estructura del Layout Global (Master Frame)

```
+----------------------------------------------------------------------------------------------------+
| SIDEBAR (w-64)            | TOP BAR: [Buscar...] [Jueves 26... 16:45] [Campana] [Avatar María Gómez] |
|---------------------------+------------------------------------------------------------------------|
| [Logo SUNNIX HOTEL]       | HERO HEADER: [Título Pantalla] [Subtítulo]       [+ Botón Acción Princ.]|
|                           |------------------------------------------------------------------------|
| [Módulos de Navegación]:  | FILA DE KPIs (5 Tarjetas con iconos coloreados e indicadores en vivo)  |
| - Dashboard               |------------------------------------------------------------------------|
| - Habitaciones            | FILTROS & BÚSQUEDA: [Estados] [Categorías] [Turnos] [Vista Grid/Lista] |
| - Turnos y reservas       |------------------------------------------------------------------------|
| - Caja por turno          |                                           | DRAWER LATERAL DERECHO     |
| - Ingresos y egresos      | ÁREA PRINCIPAL DE CONTENIDO:              | (Detalle de Habitación /   |
| - Limpieza                | - Grilla de Cards con fotografía real     |  Detalle de Personal)      |
| - Personal                | - O Tablas analíticas con badges          | - Carrusel de fotos        |
| - Reportes                | - O Gráficos interactivos de facturación  | - Tiempos transcurridos    |
| - Configuración           |                                           | - Consumos y liquidación   |
|                           |                                           | - Botones de acción rápida |
| [Pie]: [Cerrar Sesión]    |                                           |                            |
+----------------------------------------------------------------------------------------------------+
```

### 3.1 Componentes Estructurales

1. **Sidebar Izquierdo (`Sidebar.tsx`):**
   - Ancho fijo `w-64`, fondo Dark Navy (`#0b1120`), sticky `h-screen`.
   - Navegación vertical unificada con 9 módulos oficiales.
   - Píldora activa con resaltado azul/cian y tipografía bold.
   - Botón inferior `[ Cerrar sesión ]`.

2. **Top Bar Global (`TopBar.tsx`):**
   - Buscador omnibox contextual (`Buscar habitación...`, `Buscar empleado...`, `Buscar reporte...`).
   - Widget de Fecha y Hora en vivo (`Jueves 26 de septiembre | 16:45`).
   - Campana de notificaciones con badge de alertas pendientes.
   - Perfil de usuario con avatar circular, nombre y rol (`María Gómez - Administradora`).

3. **Drawer Lateral Deslizable de Detalle (`DetailDrawer.tsx`):**
   - Panel lateral deslizante (ancho: `380px - 440px`).
   - Permite inspeccionar una habitación, empleado o comanda sin abandonar la grilla ni perder contexto de pantalla.
   - Para habitaciones: exhibe carrusel de fotos interiores, tarifas, tiempo transcurrido en rojo, consumos y botones `[ Extender estadía ]` y `[ Finalizar y cerrar ]`.

4. **Tarjetas de Habitación con Fotografía (`RoomPhotoCard.tsx`):**
   - Imagen de alta calidad del interior de la suite.
   - Badge flotante en la esquina superior derecha (`Disponible`, `Ocupada`, `En limpieza`, `Mantenimiento`).
   - Nro de suite (`101`, `102`...), categoría (`Estándar`, `Suite`, `Premium`), huella de ocupantes (`Pareja`), horarios de turno y tarifas.

5. **Gráficos y Visualización de Datos:**
   - SVG puro o charts responsivos para Donut charts (desglose de pagos, personal por cargo).
   - Barras verticales comparativas (ingresos por turno, presentes por turno).
   - Barras de progreso de porcentaje para tiempos de limpieza y ocupación.

---

## 4. Directorio de Componentes Frontend

- `src/components/layout/`:
  - `Sidebar.tsx`: Barra de navegación lateral oficial de 9 módulos.
  - `TopBar.tsx`: Cabecera global con reloj, buscador y perfil de operador.
  - `DetailDrawer.tsx`: Drawer lateral deslizable multipropósito.
- `src/components/rack/`:
  - `RoomPhotoCard.tsx`: Tarjeta con fotografía, indicadores lumínicos y badge de estado.
  - `RoomGrid.tsx`: Bento grid responsivo con alternador de vista cuadrícula / lista.
  - `RoomTimer.tsx`: Temporizador desacoplado de alta precisión.
- `src/components/reports/`:
  - `ReportsHero.tsx`: Banner superior con suite de lujo y KPIs ejecutivos.
  - `RevenueByShiftChart.tsx`: Gráfico de barras de ingresos por turno (1, 2, 3).
  - `RevenueByConceptDonut.tsx`: Donut chart de conceptos (estadías, extras, bar).
  - `PaymentMethodsBar.tsx`: Barras de conciliación por medio de pago.
  - `RoomRevenueTable.tsx`: Tabla de rendimiento suite por suite.
- `src/components/housekeeping/`:
  - `CleaningStatusGrid.tsx`: Grilla de limpieza con barras de avance %.
  - `CleaningTasksTable.tsx`: Lista de tareas pendientes y en proceso.
- `src/components/staff/`:
  - `StaffAttendanceTable.tsx`: Planilla de asistencia, turnos y horarios.
  - `StaffDetailDrawer.tsx`: Historial diario y ficha técnica del colaborador.
- `src/components/cash/`:
  - `ShiftCardsBar.tsx`: Selector de Turno 1, 2 y 3 (Cerrado, Abierto, Pendiente).
  - `ShiftLedgerTable.tsx`: Libro diario de ingresos y egresos de caja.
  - `BlindAuditForm.tsx`: Planilla táctil de arqueo ciego sin saldo expuesto.