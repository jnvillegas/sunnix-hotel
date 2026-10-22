# SPEC-006: Arqueo Ciego de Caja, Auditoría y Cierre de Turno
**Estado:** IMPLEMENTADO
**Fase Roadmap:** Fase 6 - Arqueo Ciego y Auditoría
**Procesos Vinculados:** `CAJA-02`, `CAJA-03`, `CAJA-04`, `CAJA-05`
**Módulos Afectados:** Caja, Auditoría, Seguridad

---

## 1. Objetivo y Alcance
Cerrar el circuito antifraude garantizando que el dinero recaudado en efectivo coincida con la operación real sin que el cajero conozca el saldo teórico de antemano:
- **Pantalla de Arqueo Ciego (`[CAJA-03]`):** Formulario donde el recepcionista saliente desglosa el efectivo físico por denominación de billetes y comprobantes digitales.
- **Cierre Inmutable de Turno (`[CAJA-05]`):** Cálculo automático de sobrante/faltante (`diferencia_efectivo`), sellado de la sesión de caja y deslogueo automático.
- **Visor de Auditoría (Admin):** Módulo reservado para Administradores que exhibe logs inalterables de cancelaciones, aperturas manuales y diferencias de caja.

---

## 2. Contrato de Datos (Inputs / Outputs)

### 2.1 Desglose de Arqueo Físico
```typescript
export interface ConteoDenominacion {
  denominacion: number; // Ej: 20000, 10000, 2000, 1000
  cantidad: number;
}

export interface CierreCajaInput {
  cajaSesionId: string;
  billetes: ConteoDenominacion[];
  totalVouchersTarjetas: number;
  totalVouchersQR: number;
  observaciones?: string;
}
```

### 2.2 Server Action: `cerrarCajaCiegaAction`
- Suma el dinero físico declarado: `monto_declarado_efectivo`.
- Consulta en BD el dinero real que debió ingresar:
  `monto_sistema_efectivo = monto_inicial + sum(pagos_efectivo) - sum(egresos_caja_chica)`.
- Calcula: `diferencia_efectivo = monto_declarado_efectivo - monto_sistema_efectivo`.
- Actualiza `cajas_sesion` pasando el estado a `'CERRADA'` y `fecha_cierre = NOW()`.

---

## 3. UI y Seguridad Anti-Fraude
1. **Regla de Ocultamiento:** La interfaz **NO exhibe** bajo ningún concepto el `monto_sistema_efectivo` mientras el cajero completa el arqueo.
2. **Confirmación Definitiva:** Un modal de advertencia solicita confirmación al cajero indicando que una vez enviado el arqueo, no podrá corregirse.
3. Tras confirmar, el sistema cierra la sesión del operador y redirige a `/login`.

---

## 4. Criterios de Aceptación (Definition of Done)
- [x] La pantalla de arqueo ciego calcula subtotales por denominación de billetes automáticamente.
- [x] La Server Action de cierre calcula la diferencia contra el sistema de forma atómica en backend.
- [x] La sesión de caja pasa a estado `CERRADA` impidiendo nuevas operaciones bajo ese turno.
- [x] Si hay discrepancia (`diferencia_efectivo != 0`), queda asentada en la base de datos para revisión de gerencia.
- [x] Los usuarios con rol `ADMIN` pueden ver el historial completo de cajas con sus diferencias en `/dashboard/auditoria`.