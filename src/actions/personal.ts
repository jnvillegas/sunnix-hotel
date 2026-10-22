'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type {
  AsistenciaPersonalData,
  EmpleadoAsistenciaItem,
  PersonalKPIData,
  PersonalPorCargoItem,
  PresentesPorTurnoItem,
  NovedadDiaItem,
  RegistrarMarcacionInput,
} from '@/types';
import { revalidatePath } from 'next/cache';

const AVATARS = {
  maria: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  carlos: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  ana: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  lucia: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
  sofia: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  martin: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  valentina: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  daniela: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  federico: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  camila: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
};

export async function getAsistenciaPersonalAction(): Promise<AsistenciaPersonalData> {
  let dbUsers: any = null;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('usuarios')
        .select('id, nombre_completo, rol, activo')
        .order('nombre_completo', { ascending: true });
      dbUsers = data;
    } catch {
      // Ignore
    }
  }

  const defaultHistorial = [
    { fecha: '25/09', ingreso: '06:02', salida: '14:00', estado: 'PRESENTE' as const },
    { fecha: '24/09', ingreso: '06:00', salida: '14:00', estado: 'PRESENTE' as const },
    { fecha: '23/09', ingreso: '06:15', salida: '14:00', estado: 'PRESENTE' as const },
    { fecha: '22/09', ingreso: '06:00', salida: '14:00', estado: 'PRESENTE' as const },
  ];

  // Dotación completa de 10 colaboradores principales de la maqueta oficial (Imagen 1)
  const empleados: EmpleadoAsistenciaItem[] = [
    {
      id: 'emp-01',
      nombreCompleto: 'María López',
      avatarUrl: AVATARS.maria,
      dni: '32.456.789',
      cargo: 'Encargada',
      turno: 'Turno 1',
      horarioProgramado: '06:00 - 14:00',
      ingreso: '06:00',
      salida: undefined,
      estado: 'PRESENTE',
      historialSemanal: defaultHistorial,
    },
    {
      id: 'emp-02',
      nombreCompleto: 'Carlos Pérez',
      avatarUrl: AVATARS.carlos,
      dni: '35.123.889',
      cargo: 'Recepción / Caja',
      turno: 'Turno 1',
      horarioProgramado: '06:00 - 14:00',
      ingreso: '06:05',
      salida: undefined,
      estado: 'PRESENTE',
      historialSemanal: defaultHistorial,
    },
    {
      id: 'emp-03',
      nombreCompleto: 'Ana Torres',
      avatarUrl: AVATARS.ana,
      dni: '38.990.112',
      cargo: 'Mucama',
      turno: 'Turno 1',
      horarioProgramado: '06:00 - 14:00',
      ingreso: '06:12',
      salida: undefined,
      estado: 'PRESENTE',
      historialSemanal: defaultHistorial,
    },
    {
      id: 'emp-04',
      nombreCompleto: 'Lucía Díaz',
      avatarUrl: AVATARS.lucia,
      dni: '40.231.554',
      cargo: 'Limpieza',
      turno: 'Turno 1',
      horarioProgramado: '06:00 - 14:00',
      ingreso: '06:00',
      salida: undefined,
      estado: 'PRESENTE',
      historialSemanal: defaultHistorial,
    },
    {
      id: 'emp-05',
      nombreCompleto: 'Sofía Rojas',
      avatarUrl: AVATARS.sofia,
      dni: '36.789.012',
      cargo: 'Mucama',
      turno: 'Turno 2',
      horarioProgramado: '14:00 - 22:00',
      ingreso: '14:08',
      salida: undefined,
      estado: 'PRESENTE',
      historialSemanal: defaultHistorial,
    },
    {
      id: 'emp-06',
      nombreCompleto: 'Martín Ruiz',
      avatarUrl: AVATARS.martin,
      dni: '34.567.890',
      cargo: 'Recepción / Caja',
      turno: 'Turno 2',
      horarioProgramado: '14:00 - 22:00',
      ingreso: '14:00',
      salida: undefined,
      estado: 'PRESENTE',
      historialSemanal: defaultHistorial,
    },
    {
      id: 'emp-07',
      nombreCompleto: 'Valentina Gómez',
      avatarUrl: AVATARS.valentina,
      dni: '31.987.654',
      cargo: 'Encargada',
      turno: 'Turno 2',
      horarioProgramado: '14:00 - 22:00',
      ingreso: '14:20',
      salida: undefined,
      estado: 'TARDE',
      historialSemanal: [
        { fecha: '25/09', ingreso: '14:05', salida: '22:00', estado: 'PRESENTE' },
        { fecha: '24/09', ingreso: '14:00', salida: '22:00', estado: 'PRESENTE' },
        { fecha: '23/09', ingreso: '14:22', salida: '22:00', estado: 'TARDE' },
        { fecha: '22/09', ingreso: '14:00', salida: '22:00', estado: 'PRESENTE' },
      ],
    },
    {
      id: 'emp-08',
      nombreCompleto: 'Daniela Herrera',
      avatarUrl: AVATARS.daniela,
      dni: '39.456.123',
      cargo: 'Limpieza',
      turno: 'Turno 2',
      horarioProgramado: '14:00 - 22:00',
      ingreso: undefined,
      salida: undefined,
      estado: 'AUSENTE',
      historialSemanal: [
        { fecha: '25/09', ingreso: '14:00', salida: '22:00', estado: 'PRESENTE' },
        { fecha: '24/09', ingreso: '14:00', salida: '22:00', estado: 'PRESENTE' },
        { fecha: '23/09', ingreso: '-', salida: '-', estado: 'AUSENTE' },
        { fecha: '22/09', ingreso: '14:00', salida: '22:00', estado: 'PRESENTE' },
      ],
    },
    {
      id: 'emp-09',
      nombreCompleto: 'Federico Luna',
      avatarUrl: AVATARS.federico,
      dni: '42.111.222',
      cargo: 'Mucama',
      turno: 'Turno 3',
      horarioProgramado: '22:00 - 06:00',
      ingreso: '22:05',
      salida: undefined,
      estado: 'PRESENTE',
      historialSemanal: defaultHistorial,
    },
    {
      id: 'emp-10',
      nombreCompleto: 'Camila Sosa',
      avatarUrl: AVATARS.camila,
      dni: '41.333.444',
      cargo: 'Recepción / Caja',
      turno: 'Turno 3',
      horarioProgramado: '22:00 - 06:00',
      ingreso: '22:00',
      salida: undefined,
      estado: 'PRESENTE',
      historialSemanal: defaultHistorial,
    },
  ];

  const kpis: PersonalKPIData = {
    total: 18,
    presentes: 16,
    ausentes: 1,
    llegadaTarde: 1,
    enDescanso: 0,
  };

  const personalPorCargo: PersonalPorCargoItem[] = [
    { cargo: 'Encargadas', cantidad: 2, porcentaje: 11, color: '#2563eb' },
    { cargo: 'Recepción / Caja', cantidad: 4, porcentaje: 22, color: '#10b981' },
    { cargo: 'Mucamas', cantidad: 6, porcentaje: 33, color: '#ec4899' },
    { cargo: 'Limpieza', cantidad: 4, porcentaje: 22, color: '#8b5cf6' },
    { cargo: 'Otros', cantidad: 2, porcentaje: 11, color: '#94a3b8' },
  ];

  const presentesPorTurno: PresentesPorTurnoItem[] = [
    { turnoNombre: 'Turno 1', presentes: 4, total: 4, color: '#10b981' },
    { turnoNombre: 'Turno 2', presentes: 3, total: 4, color: '#2563eb' },
    { turnoNombre: 'Turno 3', presentes: 3, total: 4, color: '#a855f7' },
  ];

  const novedades: NovedadDiaItem[] = [
    {
      id: 'nov-01',
      hora: '14:20',
      empleado: 'Valentina Gómez',
      evento: 'Llegada tarde (Turno 2)',
      tipo: 'TARDE',
    },
    {
      id: 'nov-02',
      hora: '12:30',
      empleado: 'Ana Torres',
      evento: 'Salida temporal (almuerzo)',
      tipo: 'SALIDA_TEMPORAL',
    },
    {
      id: 'nov-03',
      hora: '10:15',
      empleado: 'Habitación 103',
      evento: 'Limpieza finalizada (Sofía Rojas)',
      tipo: 'LIMPIEZA',
    },
    {
      id: 'nov-04',
      hora: '08:45',
      empleado: 'Daniela Herrera',
      evento: 'Ausente (Turno 2)',
      tipo: 'AUSENTE',
    },
  ];

  return {
    kpis,
    empleados,
    personalPorCargo,
    presentesPorTurno,
    novedades,
  };
}

export async function registrarMarcacionAction(input: RegistrarMarcacionInput) {
  const supabase = await createClient();

  try {
    await supabase.from('logs_auditoria').insert({
      accion: 'MARCACION_ASISTENCIA',
      tabla_afectada: 'usuarios',
      registro_id: input.empleadoId,
      detalles: {
        empleadoId: input.empleadoId,
        tipo: input.tipo,
        observaciones: input.observaciones || 'Marcación biométrica registrada',
        timestamp: new Date().toISOString(),
      },
    });

    revalidatePath('/dashboard/personal');

    return {
      success: true,
      message: `Marcación de ${input.tipo} registrada con éxito`,
    };
  } catch (error) {
    console.error('Error al registrar marcación:', error);
    return { success: false, error: 'No se pudo asentar la marcación' };
  }
}
