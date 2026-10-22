'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { HabitacionCardData } from '@/types';

/**
 * Obtiene todas las habitaciones con su categoría y estadía activa si existe.
 */
export async function getHabitacionesRack(): Promise<HabitacionCardData[]> {
  if (!isSupabaseConfigured()) {
    return getDemoHabitaciones();
  }

  try {
    const supabase = await createClient();

    // Consultar habitaciones con su categoría
    const { data: habitaciones, error: habError } = await supabase
      .from('habitaciones')
      .select(`
        id,
        numero,
        estado,
        categoria_id,
        categorias_habitacion (
          id,
          nombre
        )
      `)
      .order('numero', { ascending: true });

    if (habError || !habitaciones || habitaciones.length === 0) {
      // Fallback a habitaciones de demostración iniciales para Command Center
      return getDemoHabitaciones();
    }

    // Consultar estadías activas
    const { data: estadiasActivas } = await supabase
      .from('estadias')
      .select('id, habitacion_id, fecha_ingreso, fecha_vencimiento_estimada, tipo_turno, patente_vehiculo')
      .eq('estado', 'ACTIVA');

    const estadiaMap = new Map(
      (estadiasActivas || []).map((e) => [e.habitacion_id, e])
    );

    return habitaciones.map((h) => {
      const categoriaData = Array.isArray(h.categorias_habitacion)
        ? h.categorias_habitacion[0]
        : h.categorias_habitacion;

      const estadia = estadiaMap.get(h.id);

      return {
        id: h.id,
        numero: h.numero,
        estado_actual: h.estado,
        categoria: {
          id: h.categoria_id,
          nombre: categoriaData?.nombre || 'Standard',
        },
        estadia_activa: estadia
          ? {
              id: estadia.id,
              fecha_ingreso: estadia.fecha_ingreso,
              fecha_vencimiento_estimada: estadia.fecha_vencimiento_estimada,
              es_pernocte: estadia.tipo_turno === 'PERNOCTE',
              patente_vehiculo: estadia.patente_vehiculo,
            }
          : null,
      };
    });
  } catch {
    return getDemoHabitaciones();
  }
}

/**
 * Habitaciones mock/demo iniciales para renderizar el Command Center de alta densidad
 * en caso de que la base aún no contenga registros sembrados.
 */
function getDemoHabitaciones(): HabitacionCardData[] {
  const now = Date.now();

  return [
    {
      id: 'demo-101',
      numero: '101',
      estado_actual: 'LIBRE',
      categoria: { id: 'c-std', nombre: 'Standard' },
      estadia_activa: null,
    },
    {
      id: 'demo-102',
      numero: '102',
      estado_actual: 'OCUPADA',
      categoria: { id: 'c-std', nombre: 'Standard' },
      estadia_activa: {
        id: 'est-102',
        fecha_ingreso: new Date(now - 45 * 60 * 1000).toISOString(),
        fecha_vencimiento_estimada: new Date(now + 75 * 60 * 1000).toISOString(),
        es_pernocte: false,
        patente_vehiculo: 'AF 892 PL',
      },
    },
    {
      id: 'demo-103',
      numero: '103',
      estado_actual: 'POR_VENCER',
      categoria: { id: 'c-ste', nombre: 'Suite Especial' },
      estadia_activa: {
        id: 'est-103',
        fecha_ingreso: new Date(now - 108 * 60 * 1000).toISOString(),
        fecha_vencimiento_estimada: new Date(now + 12 * 60 * 1000).toISOString(),
        es_pernocte: false,
        patente_vehiculo: 'AB 123 CD',
      },
    },
    {
      id: 'demo-104',
      numero: '104',
      estado_actual: 'EN_COBRO',
      categoria: { id: 'c-jcz', nombre: 'Suite Jacuzzi' },
      estadia_activa: {
        id: 'est-104',
        fecha_ingreso: new Date(now - 120 * 60 * 1000).toISOString(),
        fecha_vencimiento_estimada: new Date(now - 2 * 60 * 1000).toISOString(),
        es_pernocte: false,
        patente_vehiculo: 'AD 456 EF',
      },
    },
    {
      id: 'demo-105',
      numero: '105',
      estado_actual: 'LIMPIEZA',
      categoria: { id: 'c-std', nombre: 'Standard' },
      estadia_activa: null,
    },
    {
      id: 'demo-106',
      numero: '106',
      estado_actual: 'LIBRE',
      categoria: { id: 'c-std', nombre: 'Standard' },
      estadia_activa: null,
    },
    {
      id: 'demo-201',
      numero: '201',
      estado_actual: 'OCUPADA',
      categoria: { id: 'c-jcz', nombre: 'Suite Jacuzzi VIP' },
      estadia_activa: {
        id: 'est-201',
        fecha_ingreso: new Date(now - 200 * 60 * 1000).toISOString(),
        fecha_vencimiento_estimada: new Date(now + 360 * 60 * 1000).toISOString(),
        es_pernocte: true,
        patente_vehiculo: 'AG 901 ZW',
      },
    },
    {
      id: 'demo-202',
      numero: '202',
      estado_actual: 'MANTENIMIENTO',
      categoria: { id: 'c-ste', nombre: 'Suite Especial' },
      estadia_activa: null,
    },
    {
      id: 'demo-203',
      numero: '203',
      estado_actual: 'LIBRE',
      categoria: { id: 'c-std', nombre: 'Standard' },
      estadia_activa: null,
    },
    {
      id: 'demo-204',
      numero: '204',
      estado_actual: 'LIBRE',
      categoria: { id: 'c-jcz', nombre: 'Suite Jacuzzi' },
      estadia_activa: null,
    },
    {
      id: 'demo-205',
      numero: '205',
      estado_actual: 'OCUPADA',
      categoria: { id: 'c-std', nombre: 'Standard' },
      estadia_activa: {
        id: 'est-205',
        fecha_ingreso: new Date(now - 60 * 60 * 1000).toISOString(),
        fecha_vencimiento_estimada: new Date(now + 60 * 60 * 1000).toISOString(),
        es_pernocte: false,
        patente_vehiculo: null,
      },
    },
    {
      id: 'demo-206',
      numero: '206',
      estado_actual: 'LIMPIEZA',
      categoria: { id: 'c-ste', nombre: 'Suite Especial' },
      estadia_activa: null,
    },
  ];
}
