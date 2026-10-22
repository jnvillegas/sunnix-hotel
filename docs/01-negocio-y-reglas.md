# 01. Reglas de Negocio y Procesos - PMS Hotel Alojamiento (Telo)

## 1. Filosofía Central
- **Anonimato Absoluto:** No se exige DNI ni nombres reales de huéspedes. Cliente predeterminado: "Consumidor Final". Patente vehicular es opcional (solo garajes privados).
- **Operación por Tiempo:** La unidad de venta base no es el día/noche tradicional, sino:
  - Turnos base (ej. 2 o 3 horas según categoría y horario).
  - Fracciones (media hora / hora extra).
  - Pernocte (tarifa plana con horario de salida fijo, ej. 12:00 PM).
  - Tolerancia de gracia (ej. 10-15 min configurables antes de computar tiempo extra).

## 2. Máquina de Estados de la Habitación (Estricta)
Las transiciones son deterministas para evitar fraude en efectivo:
1. `LIBRE`: Disponible para ingreso. Relé apagado.
2. `OCUPADA`: Estación activa. Relé energizado. Temporizador corriendo.
3. `POR_VENCER`: Alerta visual/sonora cuando faltan 15 min para el límite del turno.
4. `EN_COBRO`: Cliente solicitó salida. Se bloquea la habitación, se genera la pre-cuenta (tiempo + bar).
5. `LIMPIEZA`: Habitación desocupada. Requiere confirmación de mucama para volver a `LIBRE`.
6. `MANTENIMIENTO` / `BLOQUEADA`: Fuera de servicio por desperfecto o desinfección profunda.

*Regla antifraude:* Ninguna habitación puede pasar de `OCUPADA` a `LIBRE` sin pasar obligatoriamente por `LIMPIEZA`.

## 3. Protocolo de Caja: Arqueo Ciego
- El recepcionista debe abrir turno con un fondo inicial (`monto_inicial`).
- Al cerrar el turno, **no ve el total del sistema**. Debe contar y declarar billetes/comprobantes físicos (`monto_declarado_efectivo`).
- El sistema calcula la `diferencia_efectivo` automáticamente y bloquea la sesión.

## 4. Hardware / Domótica (Preparación)
- El encendido del relé depende estrictamente de que exista un registro `ACTIVO` en la tabla `estadias`.