# SPEC-005: Bar, Room Service y Gestión de Stock
**Estado:** IMPLEMENTADO
**Fase Roadmap:** Fase 5 - Módulo de Bar (Comandas)
**Procesos Vinculados:** `BAR-01`, `BAR-02`, `BAR-03`
**Módulos Afectados:** Bar/Room Service, Stock, Rack Modal

---

## 1. Objetivo y Alcance
Permitir la carga ágil de pedidos del cliente por interfono imputándolos directamente a la cuenta de su habitación activa:
- **Catálogo Rápido (POS Táctil):** Grilla visual de productos clasificados por categoría (Bebidas, Kiosco, Sex Shop, Amenities, Cocina).
- **Comanda Express a Habitación (`[BAR-01]`):** Asignación inmediata de productos a la estadía activa con descuento atómico de stock.
- **Anulación Auditada (`[BAR-02]`):** Reversión de pedidos erróneos con motivo obligatorio y registro en `logs_auditoria`.

---

## 2. Contrato de Datos (Inputs / Outputs)

### 2.1 Server Action: `cargarComandaAction`
- **Archivo:** `src/app/actions/bar.ts`
- **Input:**
  ```typescript
  export interface ItemComandaInput {
    productoId: string;
    cantidad: number;
  }

  export interface CargarComandaInput {
    estadiaId: string;
    items: ItemComandaInput[];
  }
  ```
- **Transacción en Base de Datos:**
  - Verifica stock disponible para cada producto.
  - Inserta registros en `consumos_estadia`.
  - Decrementa `stock_actual` en la tabla `productos`.
  - Incrementa `monto_consumos` en `estadias`.

---

## 3. UI y Componentes
1. `RoomServiceModal.tsx`: Accesible desde la tarjeta de la habitación en el Rack mediante un botón rápido con icono de copa/café.
2. Buscador de productos en tiempo real por texto o código de barra.
3. Carrito lateral con subtotal acumulado y botón de confirmación `[ Cargar a Habitación ]`.

---

## 4. Criterios de Aceptación (Definition of Done)
- [x] Se puede cargar una comanda en menos de 3 clicks desde el Rack.
- [x] El stock del producto se descuenta inmediatamente tras la confirmación.
- [x] El subtotal de consumos se refleja en tiempo real en la tarjeta de la habitación y en el Check-out modal.
- [x] No es posible cargar consumos a habitaciones que no estén en estado `OCUPADA` o `POR_VENCER`.
- [x] Operaciones de anulación quedan registradas en `logs_auditoria`.