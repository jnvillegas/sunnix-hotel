# 02. Modelo de Datos y Seguridad (Supabase / PostgreSQL)

## Enums y Extensiones
- `uuid-ossp`
- Enums: `rol_usuario`, `estado_habitacion`, `estado_estadia`, `metodo_pago`, `categoria_producto`, `estado_caja`.

## Tablas Principales
1. `perfiles`: Perfil vinculado a `auth.users` (roles: ADMIN, RECEPCIONISTA, MUCAMA, SUPERVISOR).
2. `categorias_habitacion`: Standard, Suite, Jacuzzi, etc.
3. `habitaciones`: Número, categoría, estado actual, identificador de relé.
4. `tarifas_config`: Matriz de precios por día de semana (0-6), rango horario, turno base, hora extra, pernocte y tolerancia.
5. `cajas_sesion`: Aperturas, cierres ciegos y diferencias de caja.
6. `estadias`: Núcleo transaccional de ocupación (fechas, tiempos, montos calculados, usuario responsable).
7. `productos` y `consumos_estadia`: Venta de bar/room service imputada directo a la habitación.
8. `pagos_estadia`: Cobros parciales o totales multimedio (Efectivo, QR, Tarjeta).
9. `logs_auditoria`: Bitácora inmutable de cambios y cancelaciones.

## Supabase Realtime
Tablas con replicación activa:
- `habitaciones`
- `estadias`

## Políticas RLS Clave
- Habitaciones: Lectura pública autenticada; mutación restringida a Admin y Recepción.
- Cajas: Cada recepcionista solo manipula su propia caja abierta.
- Logs Auditoría: Solo lectura para ADMIN; PROHIBIDO update/delete para cualquier rol.