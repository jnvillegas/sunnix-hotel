'use server';

import { createClient } from '@/lib/supabase/server';
import type {
  IngresosEgresosPageData,
  MovimientoFinancieroItem,
} from '@/types';
import { revalidatePath } from 'next/cache';

export async function getIngresosEgresosAction(): Promise<IngresosEgresosPageData> {
  const movimientos: MovimientoFinancieroItem[] = [
    {
      id: 'mov-fin-1',
      fechaStr: '22/10/2026',
      horaStr: '18:15',
      tipo: 'EGRESO',
      categoria: 'INSUMOS',
      categoriaNombre: 'Insumos & Limpieza',
      concepto: 'Compra de productos de sanitización y toallas',
      habitacionNumero: undefined,
      medioPago: 'Efectivo',
      comprobanteNumero: 'REC-4891',
      monto: 12000,
      usuarioNombre: 'Lucía Díaz',
    },
    {
      id: 'mov-fin-2',
      fechaStr: '22/10/2026',
      horaStr: '17:05',
      tipo: 'INGRESO',
      categoria: 'ESTADIAS',
      categoriaNombre: 'Estadías',
      concepto: 'Cobro de estadía 2 horas Suite',
      habitacionNumero: '108',
      medioPago: 'Efectivo',
      comprobanteNumero: 'TKT-9912',
      monto: 16000,
      usuarioNombre: 'Lucía Díaz',
    },
    {
      id: 'mov-fin-3',
      fechaStr: '22/10/2026',
      horaStr: '16:40',
      tipo: 'INGRESO',
      categoria: 'ESTADIAS',
      categoriaNombre: 'Estadías',
      concepto: 'Cobro de estadía 3 horas Premium Jacuzzi',
      habitacionNumero: '106',
      medioPago: 'Transferencia',
      comprobanteNumero: 'TKT-9911',
      monto: 20000,
      usuarioNombre: 'Lucía Díaz',
    },
    {
      id: 'mov-fin-4',
      fechaStr: '22/10/2026',
      horaStr: '15:45',
      tipo: 'INGRESO',
      categoria: 'BAR_ROOM_SERVICE',
      categoriaNombre: 'Bar & Room Service',
      concepto: 'Consumos de frigobar y aperitivos',
      habitacionNumero: '102',
      medioPago: 'Efectivo',
      comprobanteNumero: 'COM-102',
      monto: 2500,
      usuarioNombre: 'Lucía Díaz',
    },
    {
      id: 'mov-fin-5',
      fechaStr: '22/10/2026',
      horaStr: '15:10',
      tipo: 'INGRESO',
      categoria: 'ESTADIAS',
      categoriaNombre: 'Estadías',
      concepto: 'Cobro de estadía 2 horas',
      habitacionNumero: '104',
      medioPago: 'Tarjeta',
      comprobanteNumero: 'TKT-9910',
      monto: 16000,
      usuarioNombre: 'Lucía Díaz',
    },
    {
      id: 'mov-fin-6',
      fechaStr: '22/10/2026',
      horaStr: '14:32',
      tipo: 'INGRESO',
      categoria: 'ESTADIAS',
      categoriaNombre: 'Estadías',
      concepto: 'Cobro de estadía 3 horas',
      habitacionNumero: '102',
      medioPago: 'Efectivo',
      comprobanteNumero: 'TKT-9909',
      monto: 18000,
      usuarioNombre: 'Lucía Díaz',
    },
    {
      id: 'mov-fin-7',
      fechaStr: '22/10/2026',
      horaStr: '12:40',
      tipo: 'EGRESO',
      categoria: 'MANTENIMIENTO',
      categoriaNombre: 'Mantenimiento & Obras',
      concepto: 'Reparación de condensador y recarga de gas A/A',
      habitacionNumero: '105',
      medioPago: 'Transferencia',
      comprobanteNumero: 'FACT-B-331',
      monto: 45000,
      usuarioNombre: 'Javier Nicolas',
    },
    {
      id: 'mov-fin-8',
      fechaStr: '22/10/2026',
      horaStr: '11:20',
      tipo: 'EGRESO',
      categoria: 'INSUMOS',
      categoriaNombre: 'Compras Proveedores',
      concepto: 'Reposición mayorista de bebidas y snacks',
      habitacionNumero: undefined,
      medioPago: 'Transferencia',
      comprobanteNumero: 'FACT-A-8821',
      monto: 85000,
      usuarioNombre: 'Javier Nicolas',
    },
    {
      id: 'mov-fin-9',
      fechaStr: '22/10/2026',
      horaStr: '09:15',
      tipo: 'EGRESO',
      categoria: 'RETIRO_CAJA',
      categoriaNombre: 'Retiros & Remesas',
      concepto: 'Retiro de caudales para depósito bancario de tesorería',
      habitacionNumero: undefined,
      medioPago: 'Efectivo',
      comprobanteNumero: 'COMP-0091',
      monto: 300000,
      usuarioNombre: 'Javier Nicolas',
    },
  ];

  return {
    kpis: {
      totalIngresos: 8450000,
      totalEgresos: 2180000,
      balanceNeto: 6270000,
      margenOperativo: 74.2,
    },
    movimientos,
  };
}

export async function registrarMovimientoExtraordinarioAction(input: {
  tipo: 'INGRESO' | 'EGRESO';
  categoria: string;
  concepto: string;
  monto: number;
  medioPago: 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Otros';
  comprobanteNumero?: string;
  habitacionNumero?: string;
}) {
  const supabase = await createClient();

  try {
    await supabase.from('logs_auditoria').insert({
      accion:
        input.tipo === 'INGRESO'
          ? 'REGISTRO_INGRESO_TESORERIA'
          : 'REGISTRO_EGRESO_TESORERIA',
      tabla_afectada: 'cajas_sesion',
      detalles: {
        ...input,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath('/dashboard/ingresos-egresos');
    revalidatePath('/dashboard/caja');

    return { success: true, message: 'Movimiento registrado con éxito' };
  } catch (error) {
    console.error('Error al registrar movimiento extraordinario:', error);
    return { success: false, error: 'No se pudo guardar el movimiento' };
  }
}
