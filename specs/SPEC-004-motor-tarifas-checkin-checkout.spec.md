# SPEC-004: Motor de Tarifas Dinámicas y Flujo Check-In / Check-Out
**Estado:** IMPLEMENTADO
**Fase Roadmap:** Fase 4 - Motor de Tarifas y Transiciones Operativas
**Procesos Vinculados:** `EST-01`, `EST-03`, `EST-04`, `EST-05`, `TAR-01`
**Módulos Afectados:** Rack, Motor de Tarifas, Modal Check-in, Modal Check-out

---

## 1. Objetivo y Alcance
Implementar el núcleo transaccional del negocio:
- **Algoritmo de Tarifación (`calculateStay.ts`):** Función pura y determinista que calcula el costo de una estadía según fecha/hora de ingreso, hora actual, categoría de habitación, tolerancia de gracia y pernoctes.
- **Modal Check-In Express (`[EST-01]`):** Asignación rápida de habitación libre, selección de modalidad (Turno Normal vs Pernocte), registro opcional de patente vehicular y creación de `estadias` en BD.
- **Modal Check-Out y Liquidación (`[EST-04]`, `[EST-05]`):** Desglose unificado de la cuenta (`Tiempo Transcurrido` + `Consumos de Bar` + `Personas Extra`), cobro con múltiples medios de pago (`pagos_estadia`), pase automático a estado `LIMPIEZA` y liberación de cochera.

---

## 2. Contrato de Datos (Inputs / Outputs)

### 2.1 Algoritmo de Tarifación (`src/lib/tariffs/calculateStay.ts`)
```typescript
export interface TarifaInput {
  fechaIngreso: Date;
  fechaSalida: Date;
  tarifaConfig: TarifaConfig;
  esPernocte: boolean;
  personasAdicionales: number;
}

export interface CalculoEstadiaResult {
  montoBase: number;
  minutosTotales: number;
  minutosGracia: number;
  minutosExcedidos: number;
  bloquesExtras: number; // Cantidad de medias horas u horas extras computadas
  montoExtras: number;
  montoPersonasAdicionales: number;
  subtotalTiempo: number;
}
```

### 2.2 Server Actions
1. `checkInAction(habitacionId, esPernocte, patenteVehiculo, personasAdicionales)`
2. `checkOutAction(estadiaId, pagos: Array<{ metodo: MetodoPago; monto: number }>)`

---

## 3. Reglas de Negocio Estrictas
1. **Regla de Tolerancia (Grace Period):** Si el cliente se retira dentro de la ventana de tolerancia (ej. 15 min después del vencimiento), **no se cobra recargo**. Superada la tolerancia por 1 solo segundo, se cobra el bloque extra completo.
2. **Transición a Limpieza Obligatoria:** Al completarse el Check-out, la habitación cambia inmediatamente a `LIMPIEZA`. El sistema rechaza cualquier intento de devolverla a `LIBRE` de forma directa.
3. **Validación de Pago Completo:** La sumatoria de `pagos_estadia` debe ser exactamente igual o superior a `monto_total`. No se permite finalizar checkout con saldo pendiente.

---

## 4. Criterios de Aceptación (Definition of Done)
- [x] Tests unitarios para `calculateStay.ts` cubriendo: turno exacto, salida en tolerancia, horas extras fraccionadas y pernoctes.
- [x] Click en tarjeta `LIBRE` abre modal de Check-In express.
- [x] Al confirmar Check-In, la habitación pasa a `OCUPADA` y el temporizador se activa en tiempo real.
- [x] Click en tarjeta `OCUPADA` / `POR_VENCER` permite abrir modal de Check-Out con pre-cuenta calculada en vivo.
- [x] El cobro soporta pagos divididos (ej. mitad Efectivo y mitad QR).
- [x] Al finalizar el cobro, la habitación pasa a `LIMPIEZA` y la estadía a `FINALIZADA`.