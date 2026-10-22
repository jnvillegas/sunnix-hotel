import type { TarifaConfig } from '@/types';

export interface TarifaInput {
  fechaIngreso: Date;
  fechaSalida: Date;
  tarifaConfig: TarifaConfig;
  esPernocte: boolean;
  personasAdicionales: number;
}

export interface CalculoEstadiaResult {
  montoBase: number;
  minutosTotales: number;
  minutosGracia: number;
  minutosExcedidos: number;
  bloquesExtras: number; // Cantidad de bloques de horas extras computadas
  montoExtras: number;
  montoPersonasAdicionales: number;
  subtotalTiempo: number;
}

/**
 * Algoritmo de tarifación pura y determinista para estadías de hotel alojamiento.
 * Regla de Oro:
 * - Si el tiempo transcurrido es menor o igual a (duración_base + tolerancia), no se cobra recargo.
 * - Una vez superada la tolerancia (por 1 solo segundo), se computa el bloque extra completo.
 */
export function calculateStay(input: TarifaInput): CalculoEstadiaResult {
  const { fechaIngreso, fechaSalida, tarifaConfig, esPernocte, personasAdicionales } = input;

  const msIngreso = fechaIngreso.getTime();
  const msSalida = Math.max(msIngreso, fechaSalida.getTime());
  const minutosTotales = Math.floor((msSalida - msIngreso) / (1000 * 60));

  const personasExtra = Math.max(0, personasAdicionales || 0);
  const minutosGracia = tarifaConfig.tolerancia_minutos || 15;

  // 1. Modalidad Pernocte
  if (esPernocte) {
    const montoBase = tarifaConfig.precio_pernocte;
    const duracionPernocteMinutos = tarifaConfig.duracion_turno_minutos > 360
      ? tarifaConfig.duracion_turno_minutos
      : 720; // 12 horas por defecto si no especifica horario fijo

    const tiempoPermitido = duracionPernocteMinutos + minutosGracia;

    let minutosExcedidos = 0;
    let bloquesExtras = 0;
    let montoExtras = 0;

    if (minutosTotales > tiempoPermitido) {
      minutosExcedidos = minutosTotales - duracionPernocteMinutos;
      bloquesExtras = Math.ceil(minutosExcedidos / 60);
      montoExtras = bloquesExtras * tarifaConfig.precio_hora_extra;
    }

    const montoPersonasAdicionales = personasExtra * (montoBase * 0.5);
    const subtotalTiempo = montoBase + montoExtras + montoPersonasAdicionales;

    return {
      montoBase,
      minutosTotales,
      minutosGracia,
      minutosExcedidos,
      bloquesExtras,
      montoExtras,
      montoPersonasAdicionales,
      subtotalTiempo,
    };
  }

  // 2. Modalidad Turno Base Normal
  const montoBase = tarifaConfig.precio_turno_base;
  const duracionBase = tarifaConfig.duracion_turno_minutos || 120; // 2 horas base
  const tiempoConTolerancia = duracionBase + minutosGracia;

  let minutosExcedidos = 0;
  let bloquesExtras = 0;
  let montoExtras = 0;

  if (minutosTotales > tiempoConTolerancia) {
    // Regla estricta: Superada la tolerancia, los minutos excedidos se computan
    // desde la finalización del turno base y se redondea hacia arriba al bloque completo.
    minutosExcedidos = minutosTotales - duracionBase;
    bloquesExtras = Math.ceil(minutosExcedidos / 60);
    montoExtras = bloquesExtras * tarifaConfig.precio_hora_extra;
  }

  // Recargo por personas extra (50% de la tarifa base por persona adicional)
  const montoPersonasAdicionales = personasExtra * (montoBase * 0.5);
  const subtotalTiempo = montoBase + montoExtras + montoPersonasAdicionales;

  return {
    montoBase,
    minutosTotales,
    minutosGracia,
    minutosExcedidos,
    bloquesExtras,
    montoExtras,
    montoPersonasAdicionales,
    subtotalTiempo,
  };
}
