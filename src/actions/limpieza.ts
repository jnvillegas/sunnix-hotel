'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type {
  ControlLimpiezaData,
  HabitacionLimpiezaCardData,
  TareaLimpiezaItem,
  PersonalMucamaItem,
  IniciarLimpiezaInput,
  FinalizarLimpiezaInput,
  ReasignarLimpiezaInput,
} from '@/types';
import { revalidatePath } from 'next/cache';

const MOCK_PHOTOS = {
  suite1: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
  suite2: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
  premium1: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
  premium2: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
  standard1: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
  standard2: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
};

export async function getControlLimpiezaAction(): Promise<ControlLimpiezaData> {
  let dbRooms: any = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('habitaciones')
        .select('id, numero, estado, categorias_habitacion ( nombre, tarifa_base_bloque, duracion_bloque_minutos )')
        .order('numero', { ascending: true });
      dbRooms = data;
    } catch {
      // Ignore
    }
  }

  // Lista de personal de mucamas activo
  const personalMucamas: PersonalMucamaItem[] = [
    { id: 'usr-mucama-1', nombre: 'María López', puesto: 'Mucama Senior', disponible: false, habitacionesAsignadas: 1 },
    { id: 'usr-mucama-2', nombre: 'Carlos Pérez', puesto: 'Mucama', disponible: false, habitacionesAsignadas: 1 },
    { id: 'usr-mucama-3', nombre: 'Juana Fernández', puesto: 'Mucama', disponible: true, habitacionesAsignadas: 0 },
    { id: 'usr-mucama-4', nombre: 'Romina Sánchez', puesto: 'Gobernanta / Supervisora', disponible: true, habitacionesAsignadas: 0 },
  ];

  // Datos calibrados correspondientes a la maqueta oficial (Imagen 4)
  const defaultHabitaciones: HabitacionLimpiezaCardData[] = [
    {
      id: 'hab-101',
      numero: '101',
      categoria: 'Estándar',
      estado: 'DISPONIBLE',
      fotoUrl: MOCK_PHOTOS.standard1,
      tarifaStr: '$ 12.000 / 2 horas',
    },
    {
      id: 'hab-102',
      numero: '102',
      categoria: 'Suite',
      estado: 'LIMPIEZA',
      fotoUrl: MOCK_PHOTOS.suite1,
      tarifaStr: '$ 18.000 / 3 horas',
      salidaHuesped: '11:40',
      inicioLimpieza: '11:47',
      personalNombre: 'María López',
      personalId: 'usr-mucama-1',
      porcentajeAvance: 60,
      tiempoEstimadoMinutos: 20,
      tiempoTranscurridoMinutos: 12,
      observaciones: 'Revisar minibar y reponer toallas.',
    },
    {
      id: 'hab-103',
      numero: '103',
      categoria: 'Estándar',
      estado: 'OCUPADA',
      fotoUrl: MOCK_PHOTOS.standard2,
      tarifaStr: '$ 12.000 / 2 horas',
      salidaHuesped: '17:30',
    },
    {
      id: 'hab-104',
      numero: '104',
      categoria: 'Suite',
      estado: 'DISPONIBLE',
      fotoUrl: MOCK_PHOTOS.suite2,
      tarifaStr: '$ 18.000 / 3 horas',
    },
    {
      id: 'hab-105',
      numero: '105',
      categoria: 'Estándar',
      estado: 'OCUPADA',
      fotoUrl: MOCK_PHOTOS.standard1,
      tarifaStr: '$ 12.000 / 2 horas',
      salidaHuesped: '18:10',
    },
    {
      id: 'hab-106',
      numero: '106',
      categoria: 'Premium',
      estado: 'LIMPIEZA',
      fotoUrl: MOCK_PHOTOS.premium1,
      tarifaStr: '$ 15.000 / 2 horas',
      salidaHuesped: '12:00',
      inicioLimpieza: '12:05',
      personalNombre: 'Carlos Pérez',
      personalId: 'usr-mucama-2',
      porcentajeAvance: 20,
      tiempoEstimadoMinutos: 25,
      tiempoTranscurridoMinutos: 5,
      observaciones: 'Sanitizar jacuzzi y cambiar sábanas de seda.',
    },
    {
      id: 'hab-107',
      numero: '107',
      categoria: 'Estándar',
      estado: 'DISPONIBLE',
      fotoUrl: MOCK_PHOTOS.standard2,
      tarifaStr: '$ 12.000 / 2 horas',
    },
    {
      id: 'hab-108',
      numero: '108',
      categoria: 'Premium',
      estado: 'OCUPADA',
      fotoUrl: MOCK_PHOTOS.premium2,
      tarifaStr: '$ 15.000 / 2 horas',
      salidaHuesped: '19:20',
    },
    {
      id: 'hab-109',
      numero: '109',
      categoria: 'Estándar',
      estado: 'DISPONIBLE',
      fotoUrl: MOCK_PHOTOS.standard1,
      tarifaStr: '$ 12.000 / 2 horas',
    },
    {
      id: 'hab-110',
      numero: '110',
      categoria: 'Suite',
      estado: 'OCUPADA',
      fotoUrl: MOCK_PHOTOS.suite1,
      tarifaStr: '$ 18.000 / 3 horas',
      salidaHuesped: '20:00',
    },
    {
      id: 'hab-111',
      numero: '111',
      categoria: 'Premium',
      estado: 'OCUPADA',
      fotoUrl: MOCK_PHOTOS.premium1,
      tarifaStr: '$ 15.000 / 2 horas',
      salidaHuesped: '21:15',
    },
    {
      id: 'hab-112',
      numero: '112',
      categoria: 'Suite',
      estado: 'OCUPADA',
      fotoUrl: MOCK_PHOTOS.suite2,
      tarifaStr: '$ 18.000 / 3 horas',
      salidaHuesped: '15:40',
    },
  ];

  // Si hay datos en la BD, enriquecemos o respetamos estados
  let habitaciones = defaultHabitaciones;
  if (dbRooms && dbRooms.length > 0) {
    habitaciones = defaultHabitaciones.map((dh) => {
      const match = dbRooms.find((r: { numero: string; id: string; estado: string }) => r.numero === dh.numero);
      if (match) {
        return {
          ...dh,
          id: match.id,
          estado:
            match.estado === 'LIBRE'
              ? 'DISPONIBLE'
              : match.estado === 'OCUPADA'
              ? 'OCUPADA'
              : match.estado === 'LIMPIEZA'
              ? 'LIMPIEZA'
              : 'MANTENIMIENTO',
        };
      }
      return dh;
    });
  }

  // Tareas de limpieza (pendientes y en proceso)
  const tareas: TareaLimpiezaItem[] = [
    {
      id: 'tsk-102',
      habitacionId: 'hab-102',
      numero: '102',
      categoria: 'Suite',
      estado: 'EN_PROCESO',
      horaSalidaHuesped: '11:40',
      horaInicioLimpieza: '11:47',
      tiempoEstimadoMinutos: 20,
      tiempoTranscurridoMinutos: 12,
      personalAsignadoId: 'usr-mucama-1',
      personalAsignadoNombre: 'María López',
      porcentajeAvance: 60,
      observaciones: 'Revisar minibar y reponer toallas.',
    },
    {
      id: 'tsk-106',
      habitacionId: 'hab-106',
      numero: '106',
      categoria: 'Premium',
      estado: 'EN_PROCESO',
      horaSalidaHuesped: '12:00',
      horaInicioLimpieza: '12:05',
      tiempoEstimadoMinutos: 25,
      tiempoTranscurridoMinutos: 5,
      personalAsignadoId: 'usr-mucama-2',
      personalAsignadoNombre: 'Carlos Pérez',
      porcentajeAvance: 20,
      observaciones: 'Sanitizar jacuzzi y cambiar sábanas de seda.',
    },
    {
      id: 'tsk-109',
      habitacionId: 'hab-109',
      numero: '109',
      categoria: 'Estándar',
      estado: 'PENDIENTE',
      horaSalidaHuesped: '13:15',
      horaInicioLimpieza: undefined,
      tiempoEstimadoMinutos: 20,
      tiempoTranscurridoMinutos: 0,
      personalAsignadoId: undefined,
      personalAsignadoNombre: undefined,
      porcentajeAvance: 0,
    },
    {
      id: 'tsk-112',
      habitacionId: 'hab-112',
      numero: '112',
      categoria: 'Suite',
      estado: 'PENDIENTE',
      horaSalidaHuesped: '15:40',
      horaInicioLimpieza: undefined,
      tiempoEstimadoMinutos: 25,
      tiempoTranscurridoMinutos: 0,
      personalAsignadoId: undefined,
      personalAsignadoNombre: undefined,
      porcentajeAvance: 0,
    },
  ];

  // Cálculo de KPIs
  const disponibles = habitaciones.filter((h) => h.estado === 'DISPONIBLE').length;
  const ocupadas = habitaciones.filter((h) => h.estado === 'OCUPADA').length;
  const enLimpieza = habitaciones.filter((h) => h.estado === 'LIMPIEZA').length;
  const mantenimiento = habitaciones.filter((h) => h.estado === 'MANTENIMIENTO').length;

  return {
    kpis: {
      total: habitaciones.length,
      disponibles,
      ocupadas,
      enLimpieza,
      mantenimiento,
    },
    habitaciones,
    tareas,
    personalMucamas,
  };
}

export async function finalizarLimpiezaAction(input: FinalizarLimpiezaInput) {
  const supabase = await createClient();

  try {
    // Si la habitación existe en la base de datos, la actualizamos a LIBRE
    if (!input.habitacionId.startsWith('hab-')) {
      await supabase
        .from('habitaciones')
        .update({ estado: 'LIBRE', updated_at: new Date().toISOString() })
        .eq('id', input.habitacionId);
    } else {
      // Buscar por número
      const numero = input.habitacionId.replace('hab-', '');
      await supabase
        .from('habitaciones')
        .update({ estado: 'LIBRE', updated_at: new Date().toISOString() })
        .eq('numero', numero);
    }

    // Registro de auditoría
    await supabase.from('logs_auditoria').insert({
      accion: 'FINALIZACION_LIMPIEZA',
      tabla_afectada: 'habitaciones',
      registro_id: input.habitacionId,
      detalles: {
        habitacionId: input.habitacionId,
        observaciones: input.observaciones || 'Limpieza finalizada correctamente',
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath('/dashboard/limpieza');
    revalidatePath('/dashboard');

    return { success: true, message: 'Habitación higienizada y habilitada como DISPONIBLE' };
  } catch (error) {
    console.error('Error al finalizar limpieza:', error);
    return { success: false, error: 'No se pudo registrar la finalización de limpieza' };
  }
}

export async function iniciarLimpiezaAction(input: IniciarLimpiezaInput) {
  const supabase = await createClient();

  try {
    if (!input.habitacionId.startsWith('hab-')) {
      await supabase
        .from('habitaciones')
        .update({ estado: 'LIMPIEZA', updated_at: new Date().toISOString() })
        .eq('id', input.habitacionId);
    } else {
      const numero = input.habitacionId.replace('hab-', '');
      await supabase
        .from('habitaciones')
        .update({ estado: 'LIMPIEZA', updated_at: new Date().toISOString() })
        .eq('numero', numero);
    }

    await supabase.from('logs_auditoria').insert({
      accion: 'INICIO_LIMPIEZA',
      tabla_afectada: 'habitaciones',
      registro_id: input.habitacionId,
      detalles: {
        habitacionId: input.habitacionId,
        personalId: input.personalId,
        tiempoEstimadoMinutos: input.tiempoEstimadoMinutos || 20,
        observaciones: input.observaciones,
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath('/dashboard/limpieza');
    revalidatePath('/dashboard');

    return { success: true, message: 'Limpieza iniciada con éxito' };
  } catch (error) {
    console.error('Error al iniciar limpieza:', error);
    return { success: false, error: 'No se pudo iniciar la limpieza' };
  }
}

export async function reasignarLimpiezaAction(input: ReasignarLimpiezaInput) {
  const supabase = await createClient();

  try {
    await supabase.from('logs_auditoria').insert({
      accion: 'REASIGNACION_LIMPIEZA',
      tabla_afectada: 'habitaciones',
      registro_id: input.habitacionId,
      detalles: {
        habitacionId: input.habitacionId,
        nuevoPersonalId: input.personalId,
        motivo: input.motivo || 'Reasignación de turno/rotación',
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath('/dashboard/limpieza');

    return { success: true, message: 'Personal reasignado con éxito' };
  } catch (error) {
    console.error('Error al reasignar limpieza:', error);
    return { success: false, error: 'No se pudo reasignar el personal' };
  }
}
