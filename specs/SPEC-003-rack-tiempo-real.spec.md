# SPEC-003: Rack Operativo en Tiempo Real (Bento Grid y Timers)
**Estado:** IMPLEMENTADO
**Fase Roadmap:** Fase 3 - Rack Operativo en Tiempo Real (Core UI)
**Procesos Vinculados:** `EST-01`, `EST-02`, `HK-01`, `HK-04`
**Módulos Afectados:** Rack, Supabase Realtime, UI Components

---

## 1. Objetivo y Alcance
Construir el panel táctico principal del recepcionista (Command Center):
- **Bento Grid de Habitaciones:** Grilla de alta densidad que renderiza todas las habitaciones con su categoría y estado visual inequívoco.
- **Sincronización WebSocket (Supabase Realtime):** Actualización instantánea en pantalla ante cambios en la tabla `habitaciones` o `estadias` sin recargar la página.
- **Temporizadores Descentralizados:** Contador regresivo en tiempo real para habitaciones en estado `OCUPADA` y `POR_VENCER`.
- **Alerta de Vencimiento (`[EST-02]`):** Transición visual automática a `POR_VENCER` (ámbar pulsante) y disparo de alerta sonora configurable cuando resten 15 minutos o menos.
- **Barra de KPIs Operativos:** Resumen superior con contadores en vivo: Total Libres, Ocupadas, Por Vencer, En Limpieza y Porcentaje de Ocupación.

*Fuera de alcance:* Modales de Check-in y cobro Checkout (se conectan en SPEC-004).

---

## 2. Contrato de Datos (Inputs / Outputs)

### 2.1 Tipo Extendido para la UI del Rack
```typescript
export interface HabitacionCardData {
  id: string;
  numero: string;
  estado_actual: EstadoHabitacion;
  categoria: {
    id: string;
    nombre: string;
  };
  estadia_activa: {
    id: string;
    fecha_ingreso: string;
    fecha_vencimiento_estimada: string;
    es_pernocte: boolean;
    patente_vehiculo: string | null;
  } | null;
}

export interface RackKPIs {
  total: number;
  libres: number;
  ocupadas: number;
  por_vencer: number;
  limpieza: number;
  mantenimiento: number;
  porcentaje_ocupacion: number;
}
```

### 2.2 Eventos Realtime (Supabase Channel)
- Canal: `rack-realtime-channel`
- Escucha: `postgres_changes` sobre schema `public`, tablas `habitaciones` y `estadias`.

---

## 3. Arquitectura de Componentes
Estructurar en `src/components/rack/`:
1. `RackView.tsx`: Contenedor principal (Client Component) que consume el hook Realtime y gestiona filtros/KPIs.
2. `RackKPIBar.tsx`: Barra superior con contadores de estado y porcentaje de ocupación.
3. `RoomGrid.tsx`: Grilla responsiva (Bento Grid con auto-fill y gap táctil optimizado).
4. `RoomCard.tsx`: Tarjeta individual de habitación con borde perimetral iluminado según estado.
5. `RoomTimer.tsx`: Reloj regresivo desacoplado basado en `requestAnimationFrame` o intervalo eficiente para evitar re-renders masivos del grid.
6. `src/hooks/useRackRealtime.ts`: Hook que inicializa el estado con Server Component data y suscribe a Supabase Realtime.
7. `src/lib/audio/alertSound.ts`: Generador web audio API / sintetizador para beep discreto sin dependencias de MP3 externos.

---

## 4. UI / UX Spec (Reglas Visuales Estrictas)
1. **Fondo de Interfaz:** `#09090b` (Dark ultra profundo).
2. **Tarjeta de Habitación (`RoomCard`):**
   - Número de habitación: Tipografía monoespaciada grande, destacada y legible a distancia.
   - Categoría: Subtítulo tenue en mayúsculas (ej: "SUITE JACUZZI").
   - Badge de Estado y Borde activo:
     - `LIBRE`: Borde sutil `#10b981` (Esmeralda).
     - `OCUPADA`: Borde sutil `#ef4444` (Rojo).
     - `POR_VENCER`: Borde animado parpadeante `#f59e0b` (Ámbar `animate-pulse`).
     - `EN_COBRO`: Fondo sutil `#8b5cf6` (Púrpura).
     - `LIMPIEZA`: Borde `#06b6d4` (Cyan) con icono de escoba/limpieza.
     - `MANTENIMIENTO`: Opacidad reducida `#6b7280` (Gris).
3. **Temporizador (`RoomTimer`):**
   - Formato: `HH:mm:ss`.
   - Si el tiempo llega a `00:00:00` y sigue ocupada, el contador pasa a rojo y cuenta hacia arriba en positivo (`+00:05:12`) para indicar **Tiempo Extra Excedido**.

---

## 5. Criterios de Aceptación (Definition of Done)
- [x] La página `/dashboard` renderiza todas las habitaciones cargadas en base de datos.
- [x] La barra superior muestra KPIs correctos calculados en tiempo real.
- [x] Si se actualiza una fila en la tabla `habitaciones` de Supabase (ej. desde el Table Editor), la tarjeta en la pantalla cambia de estado/color en menos de 500ms sin recargar la página.
- [x] Las habitaciones ocupadas muestran la cuenta regresiva sincronizada con `fecha_vencimiento_estimada`.
- [x] Al restar 15 minutos o menos, la tarjeta pasa visualmente a estado de alerta y emite el sonido configurado.
- [x] Al expirar el tiempo, el temporizador cambia a modo "Tiempo Extra" (`+MM:SS`).
- [x] No hay fugas de memoria por subscripciones Realtime huérfanas (cleanup en `useEffect`).