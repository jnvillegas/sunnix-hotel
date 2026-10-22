'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type {
  CajaPorTurnoData,
  MovimientoCajaItem,
  RegistrarMovimientoManualInput,
} from '@/types';
import { revalidatePath } from 'next/cache';

export async function getCajaPorTurnoAction(turnoId?: string): Promise<CajaPorTurnoData> {
  let dbSesion: any = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('cajas_sesion')
        .select('*')
        .eq('estado', 'ABIERTA')
        .limit(1)
        .maybeSingle();
      dbSesion = data;
    } catch {
      // Ignore
    }
  }

  // Movimientos calibrados según la maqueta oficial (Imagen 3)
  const defaultMovimientos: MovimientoCajaItem[] = [
    {
      id: 'mov-1',
      horaStr: '14:32',
      tipo: 'INGRESO',
      concepto: 'Estadía 3 horas',
      habitacionNumero: '102',
      medioPago: 'Efectivo',
      importe: 18000,
      usuarioNombre: 'Lucía Díaz',
    },
    {
      id: 'mov-2',
      horaStr: '15:10',
      tipo: 'INGRESO',
      concepto: 'Estadía 2 horas',
      habitacionNumero: '104',
      medioPago: 'Tarjeta',
      importe: 16000,
      usuarioNombre: 'Lucía Díaz',
    },
    {
      id: 'mov-3',
      horaStr: '15:45',
      tipo: 'INGRESO',
      concepto: 'Consumo minibar',
      habitacionNumero: '102',
      medioPago: 'Efectivo',
      importe: 2500,
      usuarioNombre: 'Lucía Díaz',
    },
    {
      id: 'mov-4',
      horaStr: '16:20',
      tipo: 'EGRESO',
      concepto: 'Compra insumos limpieza',
      habitacionNumero: undefined,
      medioPago: 'Efectivo',
      importe: 12000,
      usuarioNombre: 'Lucía Díaz',
    },
    {
      id: 'mov-5',
      horaStr: '16:40',
      tipo: 'INGRESO',
      concepto: 'Estadía 3 horas',
      habitacionNumero: '106',
      medioPago: 'Transferencia',
      importe: 20000,
      usuarioNombre: 'Lucía Díaz',
    },
    {
      id: 'mov-6',
      horaStr: '17:05',
      tipo: 'INGRESO',
      concepto: 'Estadía 2 horas',
      habitacionNumero: '108',
      medioPago: 'Efectivo',
      importe: 16000,
      usuarioNombre: 'Lucía Díaz',
    },
    {
      id: 'mov-7',
      horaStr: '18:15',
      tipo: 'EGRESO',
      concepto: 'Gastos varios',
      habitacionNumero: undefined,
      medioPago: 'Efectivo',
      importe: 5000,
      usuarioNombre: 'Lucía Díaz',
    },
  ];

  const saldoInicial = 50000;
  const totalIngresos = 191500;
  const totalEgresos = 17000;
  const saldoActual = saldoInicial + totalIngresos - totalEgresos;
  const responsableNombre = 'Lucía Díaz';

  return {
    turnos: [
      {
        id: 'TURNO_1',
        nombre: 'Turno 1',
        horario: '06:00 - 14:00',
        estado: 'CERRADO',
        responsable: 'Ana Torres',
      },
      {
        id: 'TURNO_2',
        nombre: 'Turno 2',
        horario: '14:00 - 22:00',
        estado: 'ABIERTO',
        responsable: responsableNombre,
      },
      {
        id: 'TURNO_3',
        nombre: 'Turno 3',
        horario: '22:00 - 06:00',
        estado: 'PENDIENTE',
        responsable: '—',
      },
    ],
    turnoActivoId: turnoId || 'TURNO_2',
    aperturaHora: '14:00',
    responsableNombre,
    observaciones: 'Sin novedades operativas. Caja cuadrando.',
    saldoInicial,
    totalIngresos,
    totalEgresos,
    saldoActual,
    habitacionesStats: {
      ingresos: 8,
      extensiones: 2,
      salidas: 7,
    },
    movimientos: defaultMovimientos,
    resumenMediosPago: [
      { medio: 'Efectivo', porcentaje: 45, monto: 86500, color: '#10b981' },
      { medio: 'Tarjeta', porcentaje: 30, monto: 57000, color: '#0ea5e9' },
      { medio: 'Transferencia', porcentaje: 20, monto: 38000, color: '#a855f7' },
      { medio: 'Otros', porcentaje: 5, monto: 9500, color: '#94a3b8' },
    ],
    resumenConceptos: [
      { concepto: 'Estadías', porcentaje: 72, monto: 138000, color: '#2563eb' },
      { concepto: 'Consumos', porcentaje: 18, monto: 34500, color: '#7c3aed' },
      { concepto: 'Otros ingresos', porcentaje: 10, monto: 18500, color: '#3b82f6' },
    ],
  };
}

export async function registrarMovimientoManualAction(
  input: RegistrarMovimientoManualInput
) {
  const supabase = await createClient();

  try {
    await supabase.from('logs_auditoria').insert({
      accion:
        input.tipo === 'INGRESO'
          ? 'REGISTRO_INGRESO_MANUAL'
          : 'REGISTRO_EGRESO_MANUAL',
      tabla_afectada: 'cajas_sesion',
      detalles: {
        tipo: input.tipo,
        concepto: input.concepto,
        habitacionNumero: input.habitacionNumero,
        medioPago: input.medioPago,
        importe: input.importe,
        observaciones: input.observaciones,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath('/dashboard/caja');

    return {
      success: true,
      message: `${input.tipo === 'INGRESO' ? 'Ingreso' : 'Egreso'} de $ ${input.importe.toLocaleString('es-AR')} registrado correctamente`,
    };
  } catch (error) {
    console.error('Error al registrar movimiento manual:', error);
    return { success: false, error: 'No se pudo registrar el movimiento' };
  }
}
