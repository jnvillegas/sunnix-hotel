# SPEC-001: Setup Base, Clientes Supabase y Tipado Fuerte de Dominio
**Estado:** IMPLEMENTADO
**Fase Roadmap:** Fase 1: Setup y Tipado Base
**Módulos Afectados:** Infraestructura transversal / Core

---

## 1. Objetivo y Alcance
Establecer los cimientos técnicos del sistema:
- Configuración de clientes Supabase desacoplados (Server, Client y Middleware) usando `@supabase/ssr`.
- Mapeo tipado 100% estricto de la base de datos PostgreSQL (`types/database.ts`) y tipos derivados del dominio (`types/index.ts`).
- Configuración del tema base en Tailwind CSS para la estética **Dark Mode Command Center** (paleta de alta densidad, colores de estados de habitación inequívocos).
- Archivo de variables de entorno de ejemplo (`.env.example`).

*Fuera de alcance:* Creación de vistas visuales complejas o endpoints de cálculo (se abordan en SPEC-002 en adelante).

---

## 2. Contratos de Datos y Tipos Requeridos

### 2.1 Enums del Sistema (TypeScript)
Deben coincidir de forma idéntica con los ENUMs creados en PostgreSQL (`docs/02-base-de-datos.md`):
- `RolUsuario`: `'ADMIN' | 'RECEPCIONISTA' | 'MUCAMA' | 'SUPERVISOR'`
- `EstadoHabitacion`: `'LIBRE' | 'OCUPADA' | 'POR_VENCER' | 'EN_COBRO' | 'LIMPIEZA' | 'MANTENIMIENTO' | 'BLOQUEADA'`
- `EstadoEstadia`: `'ACTIVA' | 'FINALIZADA' | 'CANCELADA'`
- `MetodoPago`: `'EFECTIVO' | 'MERCADO_PAGO_QR' | 'TARJETA_DEBITO' | 'TARJETA_CREDITO' | 'TRANSFERENCIA'`
- `CategoriaProducto`: `'BEBIDA' | 'KIOSCO' | 'SEX_SHOP' | 'AMENITY' | 'COCINA'`
- `EstadoCaja`: `'ABIERTA' | 'CERRADA'`

### 2.2 Entidades Fuertemente Tipadas
Se deben exportar los tipos para todas las tablas:
- `Perfil`
- `CajaSesion`
- `CategoriaHabitacion`
- `Habitacion`
- `TarifaConfig`
- `Estadia`
- `Producto`
- `ConsumoEstadia`
- `PagoEstadia`
- `LogAuditoria`

### 2.3 Tipos Compuestos para la UI del Rack
Para optimizar las consultas con `JOIN` en Supabase y evitar el uso de `any`:
```typescript
export type HabitacionConCategoria = Habitacion & {
  categoria: CategoriaHabitacion;
  estadia_activa?: Estadia | null;
};
```

---

## 3. Infraestructura de Clientes Supabase (@supabase/ssr)

Se requiere estructurar en `src/lib/supabase/`:
1. `client.ts`: `createBrowserClient` para componentes cliente (interactividad, timers y realtime).
2. `server.ts`: `createServerClient` configurado con manejo de cookies para Server Components, Server Actions y Route Handlers.
3. `middleware.ts`: Verificación de tokens de sesión y actualización de cookies en el borde (Next.js Middleware).

---

## 4. UI / Tokens de Diseño (Estética Command Center)

Configurar en `tailwind.config.ts` o variables de `globals.css` los tokens de estado para uso directo en componentes:
- `status-libre`: `#10b981` (Emerald 500)
- `status-ocupada`: `#ef4444` (Red 500)
- `status-por-vencer`: `#f59e0b` (Amber 500 con animación pulse)
- `status-en-cobro`: `#8b5cf6` (Violet 500)
- `status-limpieza`: `#06b6d4` (Cyan 500)
- `status-mantenimiento`: `#6b7280` (Gray 500)
- `bg-command-bg`: `#09090b` (Dark ultra profundo)
- `bg-command-card`: `#121217` (Contraste para tarjetas bento)

---

## 5. Criterios de Aceptación (Definition of Done)

- [x] Las dependencias `@supabase/supabase-js` y `@supabase/ssr` están instaladas.
- [x] Existe el archivo `.env.example` con las variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [x] Los 3 clientes de Supabase (`client.ts`, `server.ts`, `middleware.ts`) compilan sin errores de tipado.
- [x] El archivo `src/types/database.ts` cubre la totalidad del esquema SQL de `docs/02-base-de-datos.md`.
- [x] No existe ningún uso de `any` en las definiciones de tipos.
- [x] La paleta de estados de habitaciones está disponible como clases de utilidad de Tailwind.