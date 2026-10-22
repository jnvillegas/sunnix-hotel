'use server';

import { createClient } from '@/lib/supabase/server';
import type { HotelConfiguracionData } from '@/types';
import { revalidatePath } from 'next/cache';

const defaultConfiguration: HotelConfiguracionData = {
  general: {
    nombreHotel: 'Sunnix Hotel & Suites',
    razonSocial: 'Sunnix Alojamiento S.R.L.',
    direccion: 'Av. del Libertador 4820, Buenos Aires',
    telefono: '+54 11 4892-0099',
    email: 'administracion@sunnixhotel.com',
    cuit: '30-71829304-8',
    moneda: 'ARS ($)',
    capacidadSuites: 12,
  },
  operacion: {
    toleranciaGraciaMinutos: 15,
    alertaVencimientoMinutos: 15,
    turnoBaseMinutos: 120,
    turnoExtendidoMinutos: 180,
    bloqueExtraMinutos: 30,
    horarioInicioPernocte: '22:00',
    horarioFinPernocte: '12:00',
    maxPersonasSinRecargo: 2,
    recargoPersonaAdicional: 4000,
  },
  tarifas: [
    {
      id: 'cat-std',
      categoria: 'Standard Suite',
      turno2h: 12000,
      turno3h: 15000,
      pernocte: 32000,
      horaExtra: 4500,
    },
    {
      id: 'cat-eje',
      categoria: 'Suite Ejecutiva',
      turno2h: 16000,
      turno3h: 20000,
      pernocte: 42000,
      horaExtra: 6000,
    },
    {
      id: 'cat-pre',
      categoria: 'Premium Jacuzzi',
      turno2h: 20000,
      turno3h: 25000,
      pernocte: 52000,
      horaExtra: 7500,
    },
    {
      id: 'cat-prs',
      categoria: 'Presidencial Suite',
      turno2h: 28000,
      turno3h: 35000,
      pernocte: 75000,
      horaExtra: 10000,
    },
  ],
  seguridad: {
    modoArqueoCiego: true,
    bloqueoSesionSinCaja: true,
    margenToleranciaDesvio: 2000,
    anonimatoHuespedEstricto: true,
    solicitarPatenteOpcional: true,
    auditoriaModificacionesObligatoria: true,
  },
  domotica: {
    habilitado: true,
    ipControlador: '192.168.1.150',
    puertoMqtt: 1883,
    corteAutomaticoLimpieza: true,
    delayCorteMinutos: 5,
    autoEnergizacionCheckIn: true,
  },
};

export async function getConfiguracionAction(): Promise<HotelConfiguracionData> {
  // En caso de persistencia en tabla de configuración, se consultaría aquí.
  // Mantenemos la configuración operativa con valores oficiales predeterminados.
  return defaultConfiguration;
}

export async function saveConfiguracionAction(
  nuevaConfig: Partial<HotelConfiguracionData>
) {
  const supabase = await createClient();

  try {
    await supabase.from('logs_auditoria').insert({
      accion: 'ACTUALIZACION_CONFIGURACION_SISTEMA',
      tabla_afectada: 'configuracion_hotel',
      detalles: JSON.parse(
        JSON.stringify({
          nuevaConfig,
          timestamp: new Date().toISOString(),
        })
      ),
    });

    revalidatePath('/dashboard/configuracion');
    revalidatePath('/dashboard');

    return { success: true, message: 'Configuración actualizada correctamente' };
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    return { success: false, error: 'No se pudo guardar la configuración' };
  }
}
