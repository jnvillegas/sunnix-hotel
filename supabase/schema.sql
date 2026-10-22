-- ==============================================================================
-- SCHEMA INICIAL - SUNNIX HOTEL & SUITES PMS
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE rol_usuario AS ENUM ('ADMIN', 'RECEPCIONISTA', 'MUCAMA', 'SUPERVISOR');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE estado_habitacion AS ENUM (
    'LIBRE', 'OCUPADA', 'POR_VENCER', 'EN_COBRO', 'LIMPIEZA', 'MANTENIMIENTO', 'BLOQUEADA'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE estado_estadia AS ENUM ('ACTIVA', 'FINALIZADA', 'CANCELADA');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE metodo_pago AS ENUM (
    'EFECTIVO', 'MERCADO_PAGO_QR', 'TARJETA_DEBITO', 'TARJETA_CREDITO', 'TRANSFERENCIA'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE categoria_producto AS ENUM (
    'BEBIDA', 'KIOSCO', 'SEX_SHOP', 'AMENITY', 'COCINA'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE estado_caja AS ENUM ('ABIERTA', 'CERRADA');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE tipo_turno AS ENUM ('TURNO_BASE', 'PERNOCTE', 'FRACCION');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. TABLAS PRINCIPALES

-- Perfiles de usuario (vinculados a auth.users de Supabase)
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo TEXT NOT NULL,
  rol rol_usuario NOT NULL DEFAULT 'RECEPCIONISTA',
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categorías de Habitación
CREATE TABLE IF NOT EXISTS categorias_habitacion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL UNIQUE,
  tarifa_base_bloque NUMERIC(10,2) NOT NULL,
  duracion_bloque_minutos INTEGER NOT NULL DEFAULT 120,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habitaciones
CREATE TABLE IF NOT EXISTS habitaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero TEXT NOT NULL UNIQUE,
  categoria_id UUID NOT NULL REFERENCES categorias_habitacion(id),
  estado estado_habitacion NOT NULL DEFAULT 'LIBRE',
  rele_recorrido_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tarifas Dinámicas
CREATE TABLE IF NOT EXISTS tarifas_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  categoria_id UUID NOT NULL REFERENCES categorias_habitacion(id),
  dia_semana INTEGER NOT NULL, -- 0 domingo a 6 sábado
  hora_desde TIME NOT NULL,
  hora_hasta TIME NOT NULL,
  precio_turno_base NUMERIC(10,2) NOT NULL,
  precio_hora_extra NUMERIC(10,2) NOT NULL,
  precio_pernocte NUMERIC(10,2) NOT NULL,
  minutos_tolerancia INTEGER NOT NULL DEFAULT 15,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cajas y Turnos
CREATE TABLE IF NOT EXISTS cajas_sesion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID NOT NULL REFERENCES perfiles(id),
  fecha_apertura TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_cierre TIMESTAMPTZ,
  monto_inicial NUMERIC(10,2) NOT NULL,
  monto_declarado_efectivo NUMERIC(10,2),
  total_sistema_efectivo NUMERIC(10,2),
  diferencia_efectivo NUMERIC(10,2),
  estado estado_caja NOT NULL DEFAULT 'ABIERTA',
  observaciones TEXT
);

-- Estadías (Ocupación)
CREATE TABLE IF NOT EXISTS estadias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habitacion_id UUID NOT NULL REFERENCES habitaciones(id),
  caja_sesion_id UUID REFERENCES cajas_sesion(id),
  usuario_id UUID NOT NULL REFERENCES perfiles(id),
  fecha_ingreso TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_salida TIMESTAMPTZ,
  fecha_vencimiento_estimada TIMESTAMPTZ NOT NULL,
  tipo_turno tipo_turno NOT NULL DEFAULT 'TURNO_BASE',
  patente_vehiculo TEXT,
  monto_tiempo NUMERIC(10,2) NOT NULL DEFAULT 0,
  monto_consumos NUMERIC(10,2) NOT NULL DEFAULT 0,
  monto_total NUMERIC(10,2) NOT NULL DEFAULT 0,
  estado estado_estadia NOT NULL DEFAULT 'ACTIVA',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Productos Bar / Room Service
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  categoria categoria_producto NOT NULL,
  precio NUMERIC(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Consumos por Estadía
CREATE TABLE IF NOT EXISTS consumos_estadia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estadia_id UUID NOT NULL REFERENCES estadias(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES productos(id),
  cantidad INTEGER NOT NULL DEFAULT 1,
  precio_unitario NUMERIC(10,2) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pagos de Estadía
CREATE TABLE IF NOT EXISTS pagos_estadia (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estadia_id UUID NOT NULL REFERENCES estadias(id) ON DELETE CASCADE,
  caja_sesion_id UUID REFERENCES cajas_sesion(id),
  metodo metodo_pago NOT NULL,
  monto NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Logs de Auditoría Inmutables
CREATE TABLE IF NOT EXISTS logs_auditoria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES perfiles(id),
  accion TEXT NOT NULL,
  tabla_afectada TEXT NOT NULL,
  registro_id UUID,
  detalles JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. REALTIME REPLICATION (Habilitar para Rack)
ALTER PUBLICATION supabase_realtime ADD TABLE habitaciones;
ALTER PUBLICATION supabase_realtime ADD TABLE estadias;

-- 5. SEMBRADO DE DATOS BASE (Categorías y Suites)
INSERT INTO categorias_habitacion (id, nombre, tarifa_base_bloque, duracion_bloque_minutos)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Standard', 12000, 120),
  ('c0000000-0000-0000-0000-000000000002', 'Suite Especial', 16000, 120),
  ('c0000000-0000-0000-0000-000000000003', 'Suite Jacuzzi VIP', 20000, 120),
  ('c0000000-0000-0000-0000-000000000004', 'Presidencial Suite', 28000, 120)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO habitaciones (numero, categoria_id, estado)
VALUES
  ('101', 'c0000000-0000-0000-0000-000000000001', 'LIBRE'),
  ('102', 'c0000000-0000-0000-0000-000000000001', 'OCUPADA'),
  ('103', 'c0000000-0000-0000-0000-000000000002', 'POR_VENCER'),
  ('104', 'c0000000-0000-0000-0000-000000000003', 'EN_COBRO'),
  ('105', 'c0000000-0000-0000-0000-000000000001', 'LIMPIEZA'),
  ('106', 'c0000000-0000-0000-0000-000000000001', 'LIBRE'),
  ('107', 'c0000000-0000-0000-0000-000000000001', 'LIBRE'),
  ('108', 'c0000000-0000-0000-0000-000000000003', 'LIBRE'),
  ('201', 'c0000000-0000-0000-0000-000000000003', 'OCUPADA'),
  ('202', 'c0000000-0000-0000-0000-000000000002', 'MANTENIMIENTO'),
  ('203', 'c0000000-0000-0000-0000-000000000001', 'LIBRE'),
  ('204', 'c0000000-0000-0000-0000-000000000003', 'LIBRE')
ON CONFLICT (numero) DO NOTHING;
