import { calculateStay } from './calculateStay';
import type { TarifaConfig } from '@/types';

const mockTarifa: TarifaConfig = {
  id: 'tar-standard',
  categoria_id: 'cat-std',
  dia_semana: 1,
  hora_desde: '00:00:00',
  hora_hasta: '23:59:59',
  duracion_turno_minutos: 120, // 2 horas
  precio_turno_base: 15000,
  precio_hora_extra: 5000,
  precio_pernocte: 35000,
  hora_inicio_pernocte: '22:00:00',
  hora_fin_pernocte: '12:00:00',
  tolerancia_minutos: 15,
  created_at: new Date().toISOString(),
};

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
  console.log(`✓ PASS: ${message}`);
}

export function runTariffTests() {
  console.log('\n--- EJECUTANDO TESTS UNITARIOS DE MOTOR DE TARIFAS ---');

  const baseDate = new Date('2026-10-21T10:00:00Z');

  // Test 1: Turno Exacto (120 minutos)
  {
    const salida = new Date(baseDate.getTime() + 120 * 60 * 1000);
    const res = calculateStay({
      fechaIngreso: baseDate,
      fechaSalida: salida,
      tarifaConfig: mockTarifa,
      esPernocte: false,
      personasAdicionales: 0,
    });

    assert(res.minutosTotales === 120, 'Minutos totales 120');
    assert(res.bloquesExtras === 0, 'Cero bloques extras en turno exacto');
    assert(res.montoExtras === 0, 'Cero recargo en turno exacto');
    assert(res.subtotalTiempo === 15000, 'Subtotal igual a tarifa base ($15.000)');
  }

  // Test 2: Salida dentro de la Tolerancia de Gracia (134 minutos con 15 min de gracia)
  {
    const salida = new Date(baseDate.getTime() + 134 * 60 * 1000);
    const res = calculateStay({
      fechaIngreso: baseDate,
      fechaSalida: salida,
      tarifaConfig: mockTarifa,
      esPernocte: false,
      personasAdicionales: 0,
    });

    assert(res.minutosTotales === 134, 'Minutos totales 134');
    assert(res.bloquesExtras === 0, 'Cero bloques extras dentro de tolerancia');
    assert(res.montoExtras === 0, 'Cero recargo dentro de tolerancia');
    assert(res.subtotalTiempo === 15000, 'Subtotal sin recargo ($15.000)');
  }

  // Test 3: Salida superando la Tolerancia (136 minutos -> 1 bloque extra)
  {
    const salida = new Date(baseDate.getTime() + 136 * 60 * 1000);
    const res = calculateStay({
      fechaIngreso: baseDate,
      fechaSalida: salida,
      tarifaConfig: mockTarifa,
      esPernocte: false,
      personasAdicionales: 0,
    });

    assert(res.minutosTotales === 136, 'Minutos totales 136');
    assert(res.minutosExcedidos === 16, 'Minutos excedidos desde fin de turno base = 16');
    assert(res.bloquesExtras === 1, '1 bloque extra computado al superar tolerancia');
    assert(res.montoExtras === 5000, 'Recargo de 1 hora extra ($5.000)');
    assert(res.subtotalTiempo === 20000, 'Subtotal $20.000 ($15.000 base + $5.000 extra)');
  }

  // Test 4: Múltiples Bloques Extras (250 minutos -> 130 min extras -> 3 bloques de 60m)
  {
    const salida = new Date(baseDate.getTime() + 250 * 60 * 1000);
    const res = calculateStay({
      fechaIngreso: baseDate,
      fechaSalida: salida,
      tarifaConfig: mockTarifa,
      esPernocte: false,
      personasAdicionales: 0,
    });

    assert(res.bloquesExtras === 3, '3 bloques extras computados (130 min extras)');
    assert(res.montoExtras === 15000, 'Recargo $15.000 (3 * $5.000)');
    assert(res.subtotalTiempo === 30000, 'Subtotal $30.000');
  }

  // Test 5: Modalidad Pernocte
  {
    const salida = new Date(baseDate.getTime() + 600 * 60 * 1000); // 10 horas
    const res = calculateStay({
      fechaIngreso: baseDate,
      fechaSalida: salida,
      tarifaConfig: mockTarifa,
      esPernocte: true,
      personasAdicionales: 0,
    });

    assert(res.montoBase === 35000, 'Monto base corresponde a pernocte ($35.000)');
    assert(res.bloquesExtras === 0, 'Cero extras en pernocte dentro del rango');
    assert(res.subtotalTiempo === 35000, 'Subtotal Pernocte $35.000');
  }

  // Test 6: Recargo por Personas Adicionales
  {
    const salida = new Date(baseDate.getTime() + 120 * 60 * 1000);
    const res = calculateStay({
      fechaIngreso: baseDate,
      fechaSalida: salida,
      tarifaConfig: mockTarifa,
      esPernocte: false,
      personasAdicionales: 2, // 2 adicionales (50% de 15.000 = 7.500 c/u -> 15.000)
    });

    assert(res.montoPersonasAdicionales === 15000, 'Recargo por 2 personas extra = $15.000');
    assert(res.subtotalTiempo === 30000, 'Subtotal con personas adicionales = $30.000');
  }

  console.log('--- TODOS LOS TESTS UNITARIOS PASARON CON ÉXITO ---\n');
}

// Ejecución si se llama directamente
if (require.main === module || process.argv[1]?.includes('verifyTariffs')) {
  runTariffTests();
}
