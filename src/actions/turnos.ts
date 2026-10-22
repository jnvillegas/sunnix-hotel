'use server';

import { createClient } from '@/lib/supabase/server';
import type {
  TurnosPageData,
  ReservaTurnoItem,
  NuevaReservaInput,
} from '@/types';
import { revalidatePath } from 'next/cache';

const SUITE_PHOTOS = {
  suite1: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  suite2: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  premium1: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
  premium2: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
  standard1: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
};

export async function getTurnosReservasAction(): Promise<TurnosPageData> {
  const defaultReservas: ReservaTurnoItem[] = [
    {
      id: 'res-102',
      habitacionId: 'hab-102',
      habitacionNumero: '102',
      categoria: 'Suite',
      fotoUrl: SUITE_PHOTOS.suite1,
      huespedNombre: 'Sofía Martínez',
      telefono: '+54 9 11 4521-8900',
      patenteVehiculo: 'AA-123-BB',
      tipoTurno: 'TURNO_3H',
      fecha: '2026-10-22',
      horarioInicio: '15:00',
      horarioFin: '18:00',
      montoTotal: 18000,
      montoSena: 9000,
      estado: 'CONFIRMADA',
      observaciones: 'Decoración con pétalos y espumante en cubitera.',
    },
    {
      id: 'res-106',
      habitacionId: 'hab-106',
      habitacionNumero: '106',
      categoria: 'Premium',
      fotoUrl: SUITE_PHOTOS.premium1,
      huespedNombre: 'Lucas Gómez',
      telefono: '+54 9 11 6398-1245',
      patenteVehiculo: 'AF-456-CC',
      tipoTurno: 'PERNOCTE',
      fecha: '2026-10-22',
      horarioInicio: '22:00',
      horarioFin: '12:00',
      montoTotal: 35000,
      montoSena: 35000,
      estado: 'CONFIRMADA',
      observaciones: 'Pernocte completo. Ingreso nocturno discreto.',
    },
    {
      id: 'res-104',
      habitacionId: 'hab-104',
      habitacionNumero: '104',
      categoria: 'Suite',
      fotoUrl: SUITE_PHOTOS.suite2,
      huespedNombre: 'Camila Benítez',
      telefono: '+54 9 11 5567-9012',
      patenteVehiculo: 'AE-789-DD',
      tipoTurno: 'TURNO_2H',
      fecha: '2026-10-22',
      horarioInicio: '18:30',
      horarioFin: '20:30',
      montoTotal: 15000,
      montoSena: 5000,
      estado: 'CONFIRMADA',
    },
    {
      id: 'res-110',
      habitacionId: 'hab-110',
      habitacionNumero: '110',
      categoria: 'Suite',
      fotoUrl: SUITE_PHOTOS.suite1,
      huespedNombre: 'Juan Pablo Navarro',
      telefono: '+54 9 11 7890-3412',
      patenteVehiculo: 'AB-654-GG',
      tipoTurno: 'TURNO_3H',
      fecha: '2026-10-22',
      horarioInicio: '20:00',
      horarioFin: '23:00',
      montoTotal: 18000,
      montoSena: 18000,
      estado: 'EN_CURSO',
    },
    {
      id: 'res-108',
      habitacionId: 'hab-108',
      habitacionNumero: '108',
      categoria: 'Premium',
      fotoUrl: SUITE_PHOTOS.premium2,
      huespedNombre: 'Valeria Castro',
      telefono: '+54 9 11 3412-8877',
      patenteVehiculo: 'AC-987-FF',
      tipoTurno: 'PERNOCTE',
      fecha: '2026-10-22',
      horarioInicio: '23:00',
      horarioFin: '11:00',
      montoTotal: 32000,
      montoSena: 15000,
      estado: 'CONFIRMADA',
    },
    {
      id: 'res-101',
      habitacionId: 'hab-101',
      habitacionNumero: '101',
      categoria: 'Estándar',
      fotoUrl: SUITE_PHOTOS.standard1,
      huespedNombre: 'Martín Rossi',
      telefono: '+54 9 11 9988-2211',
      patenteVehiculo: 'AD-321-EE',
      tipoTurno: 'TURNO_2H',
      fecha: '2026-10-22',
      horarioInicio: '12:00',
      horarioFin: '14:00',
      montoTotal: 12000,
      montoSena: 12000,
      estado: 'COMPLETADA',
    },
  ];

  return {
    kpis: {
      reservasHoy: 6,
      pernoctesActivos: 3,
      enEspera: 2,
      disponibilidadPorcentaje: 85,
    },
    reservas: defaultReservas,
  };
}

export async function crearReservaAction(input: NuevaReservaInput) {
  const supabase = await createClient();

  try {
    await supabase.from('logs_auditoria').insert({
      accion: 'CREACION_RESERVA_TURNO',
      tabla_afectada: 'habitaciones',
      registro_id: input.habitacionId,
      detalles: {
        ...input,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath('/dashboard/turnos');
    revalidatePath('/dashboard');

    return { success: true, message: 'Reserva registrada exitosamente' };
  } catch (error) {
    console.error('Error al crear reserva:', error);
    return { success: false, error: 'No se pudo guardar la reserva' };
  }
}

export async function cancelarReservaAction(reservaId: string, motivo: string) {
  const supabase = await createClient();

  try {
    await supabase.from('logs_auditoria').insert({
      accion: 'CANCELACION_RESERVA',
      tabla_afectada: 'habitaciones',
      registro_id: reservaId,
      detalles: {
        reservaId,
        motivo,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath('/dashboard/turnos');

    return { success: true, message: 'Reserva cancelada' };
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    return { success: false, error: 'No se pudo cancelar la reserva' };
  }
}
