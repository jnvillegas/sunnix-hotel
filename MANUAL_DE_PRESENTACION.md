# 🏨 SUNNIX HOTEL & SUITES PMS
## Guía Oficial de Demostración y Manual de Usuario para Presentaciones

Bienvenido a la guía ejecutiva de presentación de **Sunnix Hotel PMS**, la plataforma de gestión operativa y financiera diseñada específicamente para hoteles de alta rotación, suites por hora y alojamientos ejecutivos.

---

## 🔑 1. Credenciales de Acceso para la Demostración

Para realizar la presentación podés utilizar cualquiera de estas dos vías:

### Vía A: Acceso Rápido Demo (1 Clic)
1. Ingresá a la pantalla de login (`/login`).
2. Hacé clic en el botón destacado: **"Acceso Rápido Demo (Sin contraseña)"**.
3. Ingresarás inmediatamente al Command Center con rol de Administrador.

### Vía B: Cuenta Real Supabase Auth (Producción / Vercel)
* **Email:** `admin@sunnix.com`
* **Contraseña:** `Sunnix2026!Demo`
* **Rol:** Administrador General (`ADMIN`)

---

## 🧭 2. Mapa de Estados del Command Center (Rack de Habitaciones)

El corazón operativo del sistema es el **Rack en Tiempo Real**, diseñado para que el recepcionista entienda el estado del hotel en menos de 2 segundos:

| Color / Badge | Estado | Significado Operativo | Acción Recomendada |
| :--- | :--- | :--- | :--- |
| 🟢 **Verde Esmeralda** | `LIBRE` | Habitación limpia, sanitizada y lista para ocupar. | Clic en **Check-in** para nuevo ingreso. |
| 🔴 **Rojo Carmesí** | `OCUPADA` | Huésped en la suite con cronómetro regresivo activo. | Ver consumos o agregar comandas del Bar. |
| 🟡 **Ámbar / Naranja** | `POR_VENCER` | Faltan menos de 15 minutos para que expire el turno. | Llamar a la suite o preparar prórroga. |
| 🟣 **Violeta Neón** | `EN_COBRO` | Tiempo cumplido. Esperando liquidación y salida. | Iniciar cobro y pase a limpieza. |
| 🔵 **Azul Cian** | `LIMPIEZA` | Mucama asignada preparando la suite. | Controlar tiempo de higienización. |
| ⚫ **Gris Grafito** | `MANTENIMIENTO`| Fuera de servicio por reparaciones técnicas. | Reabrir tras revisión del supervisor. |

---

## 🎬 3. Guion de Demostración Paso a Paso (Pitch Script)

Seguí este recorrido durante la presentación para mostrar el valor del software de manera fluida y contundente:

### Acto 1: Seguridad Financiera (El Candado de Caja `[CAJA-01]`)
* **Qué mostrar:** Menú lateral > **Caja de Turno**.
* **El Problema del Cliente:** En muchos hoteles, los recepcionistas dan ingreso a vehículos "por izquierda" sin registrar el dinero.
* **La Solución Sunnix:** El sistema cuenta con el **Candado Operativo `[CAJA-01]`**. Es imposible hacer un Check-in si no hay una sesión de caja abierta con un monto inicial declarado.
* **Dato para la demo:** En la base ya dejamos una caja abierta con **$50.000** de fondo de cambio iniciada por el turno tarde.

---

### Acto 2: Monitoreo en Vivo (El Command Center)
* **Qué mostrar:** Menú lateral > **Habitaciones** (o `/dashboard`).
* **Puntos clave a resaltar:**
  1. **Habitación 102 (Standard):** Mostrá que está `OCUPADA`, con patente registrada (`AF-382-LK`), tiempo restante claro y consumo acumulado.
  2. **Habitación 103 (Suite Especial):** Mostrá el estado `POR_VENCER` parpadeando en ámbar (le quedan menos de 10 minutos).
  3. **Habitación 104 (Jacuzzi VIP):** Mostrá el estado `EN_COBRO` (turno excedido esperando facturación).
  4. **Habitación 201 (Presidencial):** Mostrá el modo `PERNOCTE` (estancia nocturna extendida).
  5. **Habitación 105:** Mostrá el estado `LIMPIEZA` con cronómetro de rotación.

---

### Acto 3: Check-in Express (Ingreso de Vehículo en 5 Segundos)
* **Qué hacer en vivo:**
  1. Buscá una habitación libre (ej. **Habitación 101** o **106**).
  2. Hacé clic en el botón **"Check-in"**.
  3. En el modal:
     * Seleccioná el tipo: **Turno Base (2h)** o **Pernocte**.
     * Ingresá una patente (ej: `AA-123-BB`) — *destacá que permite control vehicular sin pedir datos personales para máxima discreción*.
     * Confirmá el ingreso.
  4. **Impacto:** La habitación pasa instantáneamente a rojo `OCUPADA`, el cronómetro regresivo empieza a correr en tiempo real y la barrera/recorrido queda habilitada.

---

### Acto 4: Room Service & Bar (Carga de Comandas a la Habitación)
* **Qué hacer en vivo:**
  1. Hacé clic en la tarjeta de la **Habitación 102** (o entrá a **Bar / Frigobar** en el menú).
  2. Hacé clic en **"Cargar Consumo"**.
  3. Mostrá el catálogo con precios reales: Fernet con Coca, Champagne Chandon, Cervezas, Snacks y artículos de Sex Shop.
  4. Agregá un producto (ej. *Cerveza Corona* o *Papas Pringles*) y confirmá.
  5. **Impacto:** El saldo de la suite se actualiza automáticamente sumando el consumo al tiempo de estadía. El stock del bar se descuenta en tiempo real.

---

### Acto 5: Check-out y Liquidación Multimedio
* **Qué hacer en vivo:**
  1. En el Rack, hacé clic en la **Habitación 104** (que está en cobro) o en **"Check-out"**.
  2. El sistema muestra la liquidación desglosada:
     * **Tiempo de estadía:** $20.000
     * **Consumos del Bar:** $9.500
     * **Total a Cobrar:** $29.500
  3. Seleccioná el método de pago:
     * **Efectivo** (para registrar ingreso al cajón).
     * **Mercado Pago QR** (para cobros digitales sin contacto).
     * **Tarjeta Débito / Crédito**.
  4. Confirmá el cobro.
  5. **Impacto:** La habitación se libera de la estadía y **pasa automáticamente a estado LIMPIEZA (Azul)** para avisarle a las mucamas.

---

### Acto 6: Módulo de Mucamas y Control de Rotación
* **Qué mostrar:** Menú lateral > **Limpieza**.
* **El Problema del Cliente:** En hoteles de alta rotación, una suite parada 45 minutos para limpiarse es pérdida directa de dinero.
* **La Solución Sunnix:**
  * Las mucamas ven qué suites están sucias en su tablet o celular.
  * Toman la suite (inicia cronómetro de limpieza).
  * Al finalizar, hacen clic en **"Finalizar Limpieza"** y la suite vuelve instantáneamente a **`LIBRE` (Verde)** en la pantalla de recepción.

---

### Acto 7: Cierre de Turno y Arqueo Ciego
* **Qué mostrar:** Menú lateral > **Caja de Turno** > **Cerrar Turno**.
* **Ventaja competitiva:** El sistema cuenta con **Arqueo Ciego**:
  * El recepcionista debe contar el dinero físico e ingresar cuánto efectivo tiene en mano.
  * Recién al confirmar, el sistema compara contra los cobros reales registrados y emite el informe con sobrantes o faltantes exactos, eliminando manipulaciones.

---

## 💡 4. Argumentos Clave de Venta (Para Preguntas Frecuentes)

* **¿Se puede usar en celulares o tablets?**
  * *Sí. La interfaz está construida con tecnología responsive de última generación, permitiendo que recepción opere en PC y las mucamas o supervisores en teléfonos o tablets.*
* **¿Qué pasa con la privacidad de los clientes?**
  * *No se solicitan nombres ni DNI obligatorios para turnos cortos. Todo el rastreo se realiza por suite y patente vehicular, garantizando discreción total.*
* **¿Cómo evita fugas de dinero?**
  * *Por tres candados: (1) Sin caja abierta no hay check-in, (2) Todas las habitaciones ocupadas tienen cronómetro y auditoría inmutable, (3) Los cierres de turno son a ciegas.*
* **¿Qué tecnología utiliza?**
  * *Next.js 15, React 19, Supabase (PostgreSQL con replicación Realtime) y Tailwind CSS. Preparado para escalar a múltiples sucursales.*

---
*Documento preparado para presentaciones comerciales y capacitaciones operativas.*
