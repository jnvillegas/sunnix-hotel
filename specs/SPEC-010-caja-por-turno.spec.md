# SPEC-010: Cierres de Caja por Turno y Libro de Movimientos
**Estado:** IMPLEMENTADO
**Fase Roadmap:** Fase 11 - Caja por Turno y Libro de Ingresos / Egresos
**Procesos Vinculados:** `CAJA-01`, `CAJA-02`, `CAJA-03`, `CAJA-04`, `CAJA-05`
**Módulos Afectados:** Caja por turno (`/dashboard/caja`), Finanzas

---

## 1. Objetivo y Alcance
Proveer la interfaz operativa diaria para el seguimiento en vivo de la caja, el libro de ingresos/egresos y el cierre final de turno según la maqueta oficial (Imagen 3):
- **Hero Header:** Título *"Cierres de caja por turno"*, subtítulo y botón `[ Historial de cierres ]`.
- **Selector Superior de Turnos (3 Tarjetas):**
  - *Turno 1:* 06:00 - 14:00 | Responsable: Ana Torres | Badge `Cerrado` (icono sol amarillo).
  - *Turno 2:* 14:00 - 22:00 | Responsable: Lucía Díaz | Badge `Abierto` (borde verde, icono sol verde).
  - *Turno 3:* 22:00 - 06:00 | Responsable: - | Badge `Pendiente` (icono luna violeta).
- **Libro Diario de Movimientos (Detalle del Turno Activo):**
  - Botones de acción: `[ + Registrar ingreso ]`, `[ - Registrar egreso ]`, `[...]`.
  - Tabla de movimientos: Hora, Tipo (Ingreso flecha verde, Egreso flecha roja), Concepto (Estadía, Consumo minibar, Compra insumos...), Habitación, Medio de pago (Efectivo, Tarjeta, Transferencia), Importe y Usuario.
- **Panel Lateral de Resumen de Caja (`Estado de caja - Turno`):**
  - Badge `Abierta`.
  - Saldo inicial con botón `[ Editar ]`.
  - Total ingresos con botón `[ Ver detalle ]`.
  - Total egresos con botón `[ Ver detalle ]`.
  - **Saldo actual:** Cifra consolidada en tipografía destacada.
  - Estadísticas rápidas del turno: Ingresos (8), Extensiones (2), Salidas (7).
  - Campo de observaciones del cierre.
  - Botones: `[ Imprimir resumen ]`, `[ Guardar ]`.
  - Botón principal de cierre definitivo: `[ Finalizar y cerrar turno ]` (que dispara el arqueo ciego inmutable de la SPEC-006).
- **Widgets Inferiores de Conciliación:**
  - *Resumen por medio de pago:* Donut chart interactivo (Efectivo 45%, Tarjeta 30%, Transferencia 20%, Otros 5%).
  - *Ingresos por concepto:* Barras horizontales (Estadías 72%, Consumos 18%, Otros ingresos 10%).

---

## 2. Contrato de Datos (Inputs / Outputs)

```typescript
export interface MovimientoCajaItem {
  id: string;
  cajaSesionId: string;
  horaStr: string; // "14:32"
  tipo: 'INGRESO' | 'EGRESO';
  concepto: string;
  habitacionNumero?: string;
  medioPago: MetodoPago;
  importe: number;
  usuarioNombre: string;
  created_at: string;
}

export interface ResumenTurnoCaja {
  turnoNombre: string;
  responsableNombre: string;
  horaApertura: string;
  saldoInicial: number;
  totalIngresos: number;
  totalEgresos: number;
  saldoActual: number;
  habitacionesIngresos: number;
  habitacionesExtensiones: number;
  habitacionesSalidas: number;
  movimientos: MovimientoCajaItem[];
}
```

---

## 3. Criterios de Aceptación (Definition of Done)
- [x] La UI replica con fidelidad la maqueta de Caja por Turno (Imagen 3).
- [x] La suma de ingresos y egresos actualiza el saldo actual en tiempo real sin recargar la página.
- [x] El botón `[ Finalizar y cerrar turno ]` conecta con el flujo de Arqueo Ciego inmutable ([SPEC-006]).
- [x] Tipado estricto sin uso de `any`.
