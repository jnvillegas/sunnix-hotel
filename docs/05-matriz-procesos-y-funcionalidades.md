# 05. Matriz Maestra de Procesos y Funcionalidades (Workflow Engine)

Este documento detalla exhaustivamente todos los procesos operativos del hotel. Cada especificación técnica (`specs/SPEC-XXX.md`) debe derivar directamente de los códigos de proceso definidos aquí.

---

## MACRO-PROCESO 1: Ciclo de Vida de la Estancia (Ocupación y Salida)

### [EST-01] Check-in Express y Despacho
- **Actor:** Recepcionista.
- **Trigger:** Cliente se detiene en barrera/ventanilla o ingresa a cochera privada.
- **Entradas:** Categoría o Nro. de habitación libre, Tipo de turno (Base o Pernocte), Patente vehicular (opcional).
- **Flujo:**
  1. El sistema valida que el recepcionista tenga una `caja_sesion` activa (`ABIERTA`). Si no, bloquea la acción.
  2. Recepcionista selecciona la habitación en estado `LIBRE`.
  3. Sistema aplica automáticamente la tarifa vigente según día de la semana y hora actual.
  4. Se crea el registro `estadias` (estado `ACTIVA`) con timestamp de ingreso y cálculo de vencimiento proyectado.
  5. La habitación cambia de estado a `OCUPADA`.
  6. Se dispara la señal al relé para habilitar la energía eléctrica y se abre el portón/barrera de acceso.
- **Casos Borde / Reglas:**
  - *Cambio inmediato por disconformidad:* Si el cliente pide cambio dentro de los primeros 5 minutos, la estadía original se anula como `REASIGNADA` sin cobro y se traslada a otra habitación sin computar limpieza a la primera.
- **Auditoría Anti-Fraude:** Prohibido check-in manual sin registro en base de datos. Disparo de relé condicionado 100% a la inserción en `estadias`.

### [EST-02] Monitoreo y Alerta de Vencimiento
- **Actor:** Sistema (Automático) / Recepcionista.
- **Trigger:** Reloj del sistema alcanza `(fecha_vencimiento_estimada - 15 minutos)`.
- **Flujo:**
  1. La habitación transiciona visualmente a estado `POR_VENCER`.
  2. La UI emite alerta acústica discreta y parpadeo perimetral en la tarjeta del Rack.
  3. Recepcionista contacta al cliente vía interfono interno (o espera solicitud de adición).
- **Casos Borde:**
  - Si el cliente no contesta y el tiempo llega a 00:00, el sistema pasa a contabilizar tiempo extra automáticamente con recargo.

### [EST-03] Extensión de Turno y Cambio de Modalidad
- **Actor:** Recepcionista / Cliente.
- **Trigger:** Cliente solicita más tiempo o no desocupa la habitación tras vencer el turno base.
- **Flujo:**
  1. Si solicita un **turno completo extra**: Se actualiza `fecha_vencimiento_estimada` sumando la duración base y se añade el valor al `monto_tiempo`.
  2. Si solicita **pasar a Pernocte**: El sistema evalúa si la hora actual está dentro de la ventana de pernocte permitida. De ser así, recalcula la tarifa a valor Pernocte y fija el vencimiento a la hora límite de la mañana siguiente (ej. 12:00 PM).
  3. Si no hay aviso: El sistema ingresa en modo **Tiempo Fraccionado** (calcula bloques de 30 o 60 min una vez superada la tolerancia).

### [EST-04] Pre-Checkout y Bloqueo Operativo
- **Actor:** Cliente / Recepcionista.
- **Trigger:** Cliente avisa por interfono que se retira.
- **Flujo:**
  1. Habitación cambia de `OCUPADA` / `POR_VENCER` a `EN_COBRO`.
  2. Se detiene el taxímetro de tiempo extra.
  3. Se consolidan en pantalla: `Monto Tiempo` + `Monto Consumos Bar` + `Recargo Personas Extra`.
  4. Se dispara una notificación instantánea al módulo de Housekeeping (Mucamas): *"Habitación X en salida"*.

### [EST-05] Checkout, Liquidación y Despacho
- **Actor:** Recepcionista.
- **Trigger:** Cobro efectivo y liberación de la suite.
- **Entradas:** Medio(s) de pago (Efectivo, Tarjeta, QR, Mixto).
- **Flujo:**
  1. Recepcionista confirma el cobro contra los comprobantes emitidos.
  2. Se insertan los registros en `pagos_estadia`.
  3. La estadía pasa a estado `FINALIZADA` con `fecha_salida = NOW()`.
  4. La habitación pasa automáticamente a estado `LIMPIEZA`.
  5. Se dispara el corte del relé de energía eléctrica (o se activa luz de cortesía temporal para mucama).
  6. Se habilita la apertura de la barrera/portón de egreso.
- **Auditoría Anti-Fraude:** No se puede abrir la barrera de salida sin registrar al menos un pago que cubra el 100% de la estadía.

---

## MACRO-PROCESO 2: Housekeeping (Limpieza y Rotación)

### [HK-01] Notificación y Cola de Espera
- **Actor:** Sistema.
- **Trigger:** Habitación pasa a estado `LIMPIEZA` tras el Checkout.
- **Flujo:**
  1. Aparece en el tablero de Mucamas (ordenada por prioridad: mayor tiempo de espera o categoría más demandada).
  2. El timer de rotación de limpieza se inicia en 00:00.

### [HK-02] Toma de Habitación
- **Actor:** Mucama.
- **Trigger:** Personal ingresa a la habitación.
- **Flujo:**
  1. Mucama marca "Iniciar Limpieza" (vía pantalla táctil de pasillo, interfono o tablet).
  2. Se asocia su `usuario_id` a la tarea de limpieza.
  3. Se enciende una luz de servicio temporal (ej. 20 min).

### [HK-03] Reporte Crítico Express de Faltantes/Roturas
- **Actor:** Mucama.
- **Trigger:** Detección de daños, faltantes de toallas, frigobar abierto sin declarar o roturas dentro de los primeros 3 minutos.
- **Flujo:**
  1. Mucama pulsa "Alerta Retención" en su terminal o interfono.
  2. En el Rack de Recepción salta una alarma roja intermitente bloqueando el portón de salida del cliente si aún no se retiró.
  3. Se imputa el cargo extraordinario a la cuenta antes de liberar el vehículo.

### [HK-04] Finalización de Limpieza y Alta Operativa
- **Actor:** Mucama / Gobernanta.
- **Trigger:** Habitación sanitizada, amenities repuestos, frigobar inventariado.
- **Flujo:**
  1. Mucama presiona "Habitación Lista".
  2. Sistema valida tiempo transcurrido (alerta si la limpieza duró menos del mínimo admisible, ej. menos de 8 minutos, indicando posible limpieza deficiente).
  3. La habitación transiciona automáticamente a `LIBRE`.
  4. Se apaga la luz de servicio. Queda disponible en el Rack para asignación inmediata.

### [HK-05] Derivación a Mantenimiento
- **Actor:** Mucama / Supervisor.
- **Trigger:** Falla técnica (ej. jacuzzi desbordado, aire acondicionado averiado).
- **Flujo:**
  1. Se marca la habitación como `MANTENIMIENTO` o `BLOQUEADA` con un motivo obligatorio (texto).
  2. Queda excluida del motor de asignación de Check-in.
  3. Solo un usuario con rol `ADMIN` o `SUPERVISOR` puede devolverla a `LIBRE`.

---

## MACRO-PROCESO 3: Bar & Room Service (Comandas)

### [BAR-01] Toma de Pedido e Imputación
- **Actor:** Recepcionista o Cocinero / Barman.
- **Trigger:** Cliente solicita productos por interfono interno.
- **Entradas:** Nro de habitación, Producto(s), Cantidad.
- **Flujo:**
  1. Operador busca habitación activa en el modal de Bar.
  2. Selecciona productos mediante grilla rápida (teclas de acceso rápido o touch).
  3. Al confirmar:
     - Se inserta en `consumos_estadia`.
     - Se actualiza `monto_consumos` en `estadias`.
     - Se descuenta automáticamente el `stock_actual` en `productos`.
     - Si hay impresora de comanda / pantalla en cocina, se emite el ticket de preparación.

### [BAR-02] Anulación o Devolución Auditada
- **Actor:** Recepcionista / Supervisor.
- **Trigger:** Error de carga o rechazo de producto en el pasamanos.
- **Flujo:**
  1. Requiere seleccionar motivo (ej: "Error de tipeo", "Producto devuelto intacto", "Vencido").
  2. Se revierte el subtotal de la estadía.
  3. Se reintegra el stock (si el producto está intacto).
  4. Queda grabado un registro inalterable en `logs_auditoria`.

---

## MACRO-PROCESO 4: Gestión de Turnos y Caja (Cero Fraude)

### [CAJA-01] Apertura de Turno Obligatoria
- **Actor:** Recepcionista entrante.
- **Trigger:** Inicio de jornada laboral / cambio de guardia.
- **Flujo:**
  1. Recepcionista inicia sesión.
  2. Si no tiene una caja `ABIERTA`, la interfaz bloquea el Rack y redirige a "Apertura de Caja".
  3. Ingresa el `monto_inicial` (fondo de cambio recibido del turno saliente).
  4. Se crea el registro `cajas_sesion` con timestamp exacto.
  5. Se desbloquea la operatividad del Rack.

### [CAJA-02] Movimientos Extraordinarios (Caja Chica)
- **Actor:** Recepcionista.
- **Trigger:** Pago a proveedores de urgencia o retiro autorizado de efectivo.
- **Flujo:**
  1. Registro de egreso con concepto obligatorio y comprobante adjunto o número de recibo.
  2. El monto disminuye el efectivo esperado en el sistema.

### [CAJA-03] Arqueo Ciego y Cierre de Turno
- **Actor:** Recepcionista saliente.
- **Trigger:** Fin de jornada laboral.
- **Flujo:**
  1. Recepcionista pulsa "Cerrar Caja".
  2. **El sistema NO muestra el saldo que debería haber.**
  3. La pantalla le exige declarar el conteo físico desglose:
     - Cantidad de billetes por denominación ($20.000, $10.000, $2.000, etc.).
     - Lotes de cupones de tarjeta de crédito/débito.
     - Comprobantes de transferencias / QR confirmados.
  4. Recepcionista confirma la declaración.
  5. El sistema ejecuta el cálculo en backend:
     `diferencia = monto_declarado - monto_sistema`.
  6. La caja pasa a estado `CERRADA`. Se bloquea la sesión del usuario.
  7. Se envía un reporte/alerta automática al Administrador si la `diferencia != 0`.

---

## MACRO-PROCESO 5: Motor de Tarifas Dinámicas

### [TAR-01] Liquidación Automática Multi-Regla
- **Actor:** Motor del Sistema (`calculateStay.ts`).
- **Lógica de evaluación en Cascada:**
  1. **Tarifa Base:** Determinada por `categoria_id`, `dia_semana` y `hora_ingreso`.
  2. **Tolerancia:** Si `tiempo_transcurrido <= duracion_turno + tolerancia_minutos`, no aplica recargo.
  3. **Fraccionamiento:** Superada la tolerancia, cada bloque comenzado de 30 o 60 minutos se calcula a la tarifa vigente en ese instante horario (computa tarifas nocturnas si el turno cruzó la medianoche).
  4. **Pase a Pernocte:** Si la estancia inició o fue cambiada a Pernocte, el cálculo ignora fracciones horarias y congela el precio hasta el mediodía siguiente.

---

## MACRO-PROCESO 6: Domótica y Contingencias

### [DOM-01] Sincronización de Energía por Relés
- **Lógica de accionamiento:**
  - `estadia = ACTIVA` $\longrightarrow$ Relé = **ON** (Luz completa).
  - `estadia = FINALIZADA` y `habitacion = LIMPIEZA` $\longrightarrow$ Relé = **SERVICE** (Solo luz de limpieza por 20 min).
  - `habitacion = LIBRE` o `BLOQUEADA` $\longrightarrow$ Relé = **OFF** (Corte total de energía).

### [DOM-02] Contingencia Offline / Falla de Hardware
- **Bypass Manual:** Si falla la placa de relés o la conexión, existe una llave física en tablero central.
- **Protocolo de Seguridad:** El recepcionista debe pulsar "Activar Modo Manual" en el software indicando la contingencia. Toda habitación encendida manualmente sin estadía asociada dispara una alerta crítica de auditoría a la gerencia.

---

## MACRO-PROCESO 7: Recursos Humanos y Asistencia de Personal

### [RRHH-01] Registro y Control de Asistencia en Tiempo Real
- **Actor:** Encargada / Supervisor / Colaborador.
- **Trigger:** Ingreso o egreso del colaborador en su turno laboral asignado (Turno 1: 06:00-14:00, Turno 2: 14:00-22:00, Turno 3: 22:00-06:00).
- **Flujo:**
  1. El sistema valida el horario programado contra el timestamp real de marcación.
  2. Determina el estado: `Presente`, `Llegada tarde` (si supera tolerancia de inicio), o `Ausente`.
  3. Actualiza el panel general de asistencia y el contador de presentes por turno.
  4. Queda asentada la novedad en la bitácora del día (ej. salida temporal a almuerzo, relevo).

### [RRHH-02] Ficha y Rendimiento del Colaborador
- **Actor:** Administrador / Encargada.
- **Flujo:**
  1. Al hacer click sobre un empleado, se despliega el Drawer lateral con DNI, puesto, turno y estado.
  2. Exhibe el historial de marcaciones de los últimos 5 días y tareas cumplidas (habitaciones limpiadas en el caso de mucamas).

---

## MACRO-PROCESO 8: Business Intelligence y Reportes Gerenciales

### [REP-01] Consolidación Financiera y Balance Mensual
- **Actor:** Administrador / Propietario.
- **Trigger:** Consulta de balance mensual o comparativa intermensual.
- **Flujo:**
  1. Agregación atómica de ingresos por estadías, recargos de tiempo extra y consumos de bar/room service.
  2. Deducción de egresos operativos (caja chica, compras de insumos).
  3. Cálculo de resultado neto del período, ticket promedio por estadía y porcentaje de variación respecto al mes anterior.

### [REP-02] Desglose de Recaudación y Métodos de Pago
- **Actor:** Administrador / Contador.
- **Flujo:**
  1. Conciliación exacta del dinero ingresado por Efectivo, Tarjeta, Transferencia / QR y otros medios.
  2. Provisión de porcentajes de participación y montos consolidados.

### [REP-03] Análisis de Productividad y Ocupación por Suite
- **Actor:** Administrador.
- **Flujo:**
  1. Medición de la rotación diaria de suites (cantidad de turnos por suite y horas ocupadas).
  2. Ranking de rentabilidad por categoría (Suite, Premium, Estándar).
  3. Análisis de tiempos promedio de rotación y limpieza.
  4. Exportación formal de balance a formato CSV / Planilla contable.