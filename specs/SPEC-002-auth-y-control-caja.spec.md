# SPEC-002: Autenticación, Bloqueo Operativo y Apertura de Caja
**Estado:** IMPLEMENTADO
**Fase Roadmap:** Fase 2 - Auth y Control de Caja (Bloqueo Operativo)
**Módulos Afectados:** Auth, Caja, Layout Dashboard

---

## 1. Objetivo y Alcance
Implementar el perímetro de seguridad y el primer candado operativo del sistema:
- Autenticación de operadores mediante Supabase Auth (Email y Contraseña) en `/login`.
- **Bloqueo Operativo (Anti-Fraude):** Si un recepcionista no posee una sesión de caja `ABIERTA` en `cajas_sesion`, el sistema bloquea el acceso al Rack operativo y lo fuerza a `/caja/apertura`.
- **Apertura de Turno (`[CAJA-01]`):** Formulario para declarar el `monto_inicial` recibido e inicializar la sesión de caja con timestamp exacto.
- **Header del Command Center:** Layout persistente para `/dashboard` que exhibe el operador en turno, rol, badge de caja activa con monto inicial y control de logout.

*Fuera de alcance:* Arqueo ciego y cierre de caja (Fase 6), Grilla de habitaciones (Fase 3).

---

## 2. Contrato de Datos (Inputs / Outputs)
- **Tablas involucradas:** `perfiles`, `cajas_sesion`.
- **Tipos / DTOs:**
  ```typescript
  export interface AbrirCajaInput {
    monto_inicial: number;
    observaciones?: string;
  }

  export interface EstadoSesionOperativa {
    usuario: Perfil;
    caja_activa: CajaSesion | null;
    bloqueado_por_caja: boolean;
  }
  ```

---

## 3. Arquitectura de Rutas y Componentes
1. `src/app/login/page.tsx`: Formulario de login Command Center (alta densidad, fondo oscuro `#09090b`).
2. `src/app/caja/apertura/page.tsx`: Pantalla de bloqueo / apertura con ingreso numérico de fondo de cambio.
3. `src/app/dashboard/layout.tsx`: Layout envolvente con Header que muestra estado del operador y de la caja.
4. `src/actions/auth.ts`: Server Actions para `login` y `logout`.
5. `src/actions/caja.ts`: Server Action para `abrirCajaSession(monto_inicial)`.
6. `src/middleware.ts`: Verificación de sesión Supabase y redirección inteligente (no autenticado $\rightarrow$ `/login`; autenticado sin caja $\rightarrow$ `/caja/apertura`).

---

## 4. Criterios de Aceptación (Definition of Done)
- [x] Operador puede iniciar sesión en `/login` y cerrar sesión desde el Header.
- [x] Si el operador no tiene una caja `ABIERTA`, el acceso a `/dashboard` se bloquea y redirige a `/caja/apertura`.
- [x] Al registrar la apertura con `monto_inicial`, se crea el registro en `cajas_sesion` y se desbloquea el acceso a `/dashboard`.
- [x] El Header del Dashboard muestra: nombre del operador, rol, estado de la caja (`ACTIVA`), monto inicial y hora de apertura.
- [x] No existen usos de `any` y el build de Next.js compila sin errores.
