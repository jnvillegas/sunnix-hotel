-- ==============================================================================
-- SEED DATA PARA DEMO REALISTA - SUNNIX HOTEL & SUITES PMS
-- ==============================================================================

-- 1. USUARIO Y PERFIL DE ADMINISTRACIÓN
-- Usuario creado en Supabase Auth: admin@sunnix.com
INSERT INTO perfiles (id, nombre_completo, rol, activo)
VALUES (
  '2ec300eb-4811-4e7d-832f-186eaed9f56a',
  'Javier Nicolas (Tech Lead / Admin)',
  'ADMIN',
  true
)
ON CONFLICT (id) DO UPDATE SET
  nombre_completo = EXCLUDED.nombre_completo,
  rol = EXCLUDED.rol;

-- 2. SESIÓN DE CAJA OPERATIVA ACTIVA (TURNO ABIERTO)
INSERT INTO cajas_sesion (id, usuario_id, monto_inicial, estado, fecha_apertura, observaciones)
VALUES (
  'ca1a0000-0000-0000-0000-000000000001',
  '2ec300eb-4811-4e7d-832f-186eaed9f56a',
  50000.00,
  'ABIERTA',
  NOW() - INTERVAL '4 hours',
  'Turno tarde operativo - Fondo de cambio verificado en cajón'
)
ON CONFLICT (id) DO NOTHING;

-- 3. CATÁLOGO COMPLETO DE PRODUCTOS (BAR, ROOM SERVICE, KIOSCO, SEX SHOP)
INSERT INTO productos (id, nombre, categoria, precio, stock, activo)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Fernet Branca 750ml + Coca 1.5L', 'BEBIDA', 9500.00, 24, true),
  ('b0000000-0000-0000-0000-000000000002', 'Champagne Chandon Extra Brut 750ml', 'BEBIDA', 14000.00, 15, true),
  ('b0000000-0000-0000-0000-000000000003', 'Cerveza Corona 330ml', 'BEBIDA', 3500.00, 48, true),
  ('b0000000-0000-0000-0000-000000000004', 'Cerveza Heineken 473ml', 'BEBIDA', 3800.00, 36, true),
  ('b0000000-0000-0000-0000-000000000005', 'Agua Mineral s/ Gas 500ml', 'BEBIDA', 1800.00, 60, true),
  ('b0000000-0000-0000-0000-000000000006', 'Gaseosa Coca Cola 500ml', 'BEBIDA', 2200.00, 50, true),
  ('b0000000-0000-0000-0000-000000000007', 'Red Bull Energy Drink 250ml', 'BEBIDA', 3200.00, 30, true),
  ('b0000000-0000-0000-0000-000000000008', 'Whisky Johnnie Walker Black Label', 'BEBIDA', 18500.00, 10, true),
  ('b0000000-0000-0000-0000-000000000009', 'Preservativos Prime Skyn x3', 'SEX_SHOP', 4200.00, 40, true),
  ('b0000000-0000-0000-0000-000000000010', 'Gel Lubricante Prime Hot 50g', 'SEX_SHOP', 5000.00, 25, true),
  ('b0000000-0000-0000-0000-000000000011', 'Tostados Jamón y Queso Gourmet', 'COCINA', 5500.00, 20, true),
  ('b0000000-0000-0000-0000-000000000012', 'Papas Fritas Pringles Original', 'KIOSCO', 4800.00, 30, true),
  ('b0000000-0000-0000-0000-000000000013', 'Bombones Ferrero Rocher x8', 'KIOSCO', 6500.00, 18, true)
ON CONFLICT (id) DO UPDATE SET
  precio = EXCLUDED.precio,
  stock = EXCLUDED.stock;

-- 4. MATRIZ DE TARIFAS VIGENTES
INSERT INTO tarifas_config (categoria_id, dia_semana, hora_desde, hora_hasta, precio_turno_base, precio_hora_extra, precio_pernocte, minutos_tolerancia)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 1, '00:00:00', '23:59:59', 12000.00, 4000.00, 32000.00, 15),
  ('c0000000-0000-0000-0000-000000000002', 1, '00:00:00', '23:59:59', 16000.00, 5500.00, 42000.00, 15),
  ('c0000000-0000-0000-0000-000000000003', 1, '00:00:00', '23:59:59', 20000.00, 7000.00, 52000.00, 15),
  ('c0000000-0000-0000-0000-000000000004', 1, '00:00:00', '23:59:59', 28000.00, 9000.00, 75000.00, 15)
ON CONFLICT DO NOTHING;

-- 5. ESTADÍAS ACTIVAS CON ESTADOS REALISTAS DE RACK
-- Habitación 102 (Standard - OCUPADA, resta 1h 10m)
INSERT INTO estadias (id, habitacion_id, caja_sesion_id, usuario_id, fecha_ingreso, fecha_vencimiento_estimada, tipo_turno, patente_vehiculo, monto_tiempo, monto_consumos, monto_total, estado)
SELECT
  'e0000000-0000-0000-0000-000000000001',
  id,
  'ca1a0000-0000-0000-0000-000000000001',
  '2ec300eb-4811-4e7d-832f-186eaed9f56a',
  NOW() - INTERVAL '50 minutes',
  NOW() + INTERVAL '70 minutes',
  'TURNO_BASE',
  'AF-382-LK',
  12000.00,
  13000.00,
  25000.00,
  'ACTIVA'
FROM habitaciones WHERE numero = '102'
ON CONFLICT (id) DO NOTHING;

-- Habitación 103 (Suite Especial - POR_VENCER, restan 8 minutos)
INSERT INTO estadias (id, habitacion_id, caja_sesion_id, usuario_id, fecha_ingreso, fecha_vencimiento_estimada, tipo_turno, patente_vehiculo, monto_tiempo, monto_consumos, monto_total, estado)
SELECT
  'e0000000-0000-0000-0000-000000000002',
  id,
  'ca1a0000-0000-0000-0000-000000000001',
  '2ec300eb-4811-4e7d-832f-186eaed9f56a',
  NOW() - INTERVAL '112 minutes',
  NOW() + INTERVAL '8 minutes',
  'TURNO_BASE',
  'AE-910-OP',
  16000.00,
  3500.00,
  19500.00,
  'ACTIVA'
FROM habitaciones WHERE numero = '103'
ON CONFLICT (id) DO NOTHING;

-- Habitación 104 (Suite Jacuzzi - EN_COBRO, vencida hace 10 minutos)
INSERT INTO estadias (id, habitacion_id, caja_sesion_id, usuario_id, fecha_ingreso, fecha_vencimiento_estimada, tipo_turno, patente_vehiculo, monto_tiempo, monto_consumos, monto_total, estado)
SELECT
  'e0000000-0000-0000-0000-000000000003',
  id,
  'ca1a0000-0000-0000-0000-000000000001',
  '2ec300eb-4811-4e7d-832f-186eaed9f56a',
  NOW() - INTERVAL '130 minutes',
  NOW() - INTERVAL '10 minutes',
  'TURNO_BASE',
  'AD-541-ZZ',
  20000.00,
  9500.00,
  29500.00,
  'ACTIVA'
FROM habitaciones WHERE numero = '104'
ON CONFLICT (id) DO NOTHING;

-- Habitación 201 (Presidencial Suite - OCUPADA, Pernocte nocturno)
INSERT INTO estadias (id, habitacion_id, caja_sesion_id, usuario_id, fecha_ingreso, fecha_vencimiento_estimada, tipo_turno, patente_vehiculo, monto_tiempo, monto_consumos, monto_total, estado)
SELECT
  'e0000000-0000-0000-0000-000000000004',
  id,
  'ca1a0000-0000-0000-0000-000000000001',
  '2ec300eb-4811-4e7d-832f-186eaed9f56a',
  NOW() - INTERVAL '180 minutes',
  NOW() + INTERVAL '8 hours',
  'PERNOCTE',
  'AC-778-MN',
  75000.00,
  23500.00,
  98500.00,
  'ACTIVA'
FROM habitaciones WHERE numero = '201'
ON CONFLICT (id) DO NOTHING;

-- 6. CONSUMOS ASOCIADOS A ESTADÍAS ACTIVAS
INSERT INTO consumos_estadia (estadia_id, producto_id, cantidad, precio_unitario, subtotal)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 1, 9500.00, 9500.00),
  ('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 1, 3500.00, 3500.00),
  ('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 1, 3500.00, 3500.00),
  ('e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 1, 9500.00, 9500.00),
  ('e0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 1, 14000.00, 14000.00),
  ('e0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000009', 1, 4200.00, 4200.00),
  ('e0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000011', 1, 5300.00, 5300.00)
ON CONFLICT DO NOTHING;
