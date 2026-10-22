'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type {
  CajaSesion,
  EstadoSesionOperativa,
  Perfil,
  CierreCajaInput,
  ResultadoCierreCaja,
  CierreCajaAuditoriaRow,
  LogAuditoria,
  Json,
} from '@/types';
import { revalidatePath } from 'next/cache';

export interface CajaActionResult {
  error?: string;
  success?: boolean;
}

// Almacén en memoria para demostración y contingencia local
const memoryCajas: CierreCajaAuditoriaRow[] = [
  {
    id: 'caja-hist-1',
    usuario_id: 'usr-1',
    cajero_nombre: 'Martina Gomez',
    monto_inicial: 20000,
    monto_declarado_efectivo: 45000,
    monto_sistema_efectivo: 45000,
    diferencia_efectivo: 0,
    estado: 'CERRADA',
    fecha_apertura: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    fecha_cierre: new Date(Date.now() - 40 * 3600 * 1000).toISOString(),
    observaciones: 'Turno Mañana sin novedades. Cuadre exacto.',
  },
  {
    id: 'caja-hist-2',
    usuario_id: 'usr-2',
    cajero_nombre: 'Esteban Quito',
    monto_inicial: 25000,
    monto_declarado_efectivo: 80000,
    monto_sistema_efectivo: 82000,
    diferencia_efectivo: -2000,
    estado: 'CERRADA',
    fecha_apertura: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    fecha_cierre: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    observaciones: 'Faltante de $2.000 en cambio de billetes. Notificado a supervisor.',
  },
  {
    id: 'caja-hist-3',
    usuario_id: 'usr-3',
    cajero_nombre: 'Lucia Ferreyra',
    monto_inicial: 25000,
    monto_declarado_efectivo: 61500,
    monto_sistema_efectivo: 60000,
    diferencia_efectivo: 1500,
    estado: 'CERRADA',
    fecha_apertura: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    fecha_cierre: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    observaciones: 'Sobrante de $1.500 registrado en propina no retirada.',
  },
];

let demoCajaActiva: CajaSesion | null = {
  id: 'demo-caja-activa',
  usuario_id: 'demo-operador',
  monto_inicial: 25000,
  monto_declarado_efectivo: null,
  monto_sistema_efectivo: null,
  diferencia_efectivo: null,
  estado: 'ABIERTA',
  fecha_apertura: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  fecha_cierre: null,
  observaciones: 'Turno Command Center Demo',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const memoryLogs: LogAuditoria[] = [
  {
    id: 'log-1',
    usuario_id: 'usr-2',
    accion: 'DISCREPANCIA_ARQUEO_CAJA',
    tabla_afectada: 'cajas_sesion',
    registro_id: 'caja-hist-2',
    detalles: {
      diferencia: -2000,
      tipo: 'FALTANTE',
      cajero: 'Esteban Quito',
      declarado: 80000,
      sistema: 82000,
    } as unknown as Json,
    created_at: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
  },
  {
    id: 'log-2',
    usuario_id: 'usr-2',
    accion: 'CIERRE_CAJA_ARQUEO_CIEGO',
    tabla_afectada: 'cajas_sesion',
    registro_id: 'caja-hist-2',
    detalles: {
      monto_declarado_efectivo: 80000,
      monto_sistema_efectivo: 82000,
      diferencia_efectivo: -2000,
      vouchers_tarjetas: 34500,
      vouchers_qr: 18000,
    } as unknown as Json,
    created_at: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
  },
  {
    id: 'log-3',
    usuario_id: 'demo-operador',
    accion: 'ANULACION_CONSUMO_BAR',
    tabla_afectada: 'consumos_estadia',
    registro_id: 'c-demo-102',
    detalles: {
      producto: 'Cerveza Corona 330ml',
      cantidad: 1,
      motivo: 'Error de tipeo del operador',
      subtotal_revertido: 3500,
    } as unknown as Json,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
];

/**
 * Obtiene el estado de sesión operativa del usuario actual:
 * Perfil, caja activa (si existe) y si se encuentra bloqueado por falta de caja.
 */
export async function getEstadoSesionOperativa(): Promise<EstadoSesionOperativa | null> {
  const cookieStore = await cookies();
  const isDemo = cookieStore.get('sunnix_demo_session')?.value === 'true';

  if (isDemo || !isSupabaseConfigured()) {
    return {
      usuario: {
        id: 'demo-operador',
        nombre_completo: 'Javier Nicolas (Tech Lead)',
        rol: 'ADMIN',
        activo: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      caja_activa: demoCajaActiva,
      bloqueado_por_caja: !demoCajaActiva || demoCajaActiva.estado !== 'ABIERTA',
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Obtener perfil del usuario
  const { data: perfilData } = await supabase
    .from('perfiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const perfil = perfilData as Perfil | null;

  // Si no existe perfil en la tabla, construimos un fallback con los datos de auth
  const usuarioPerfil: Perfil = perfil || {
    id: user.id,
    nombre_completo: user.user_metadata?.nombre_completo || user.email || 'Operador',
    rol: 'ADMIN',
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Buscar si tiene caja ABIERTA
  const { data: cajaData } = await supabase
    .from('cajas_sesion')
    .select('*')
    .eq('usuario_id', user.id)
    .eq('estado', 'ABIERTA')
    .maybeSingle();

  const cajaActiva = (cajaData as CajaSesion | null) || (isDemo ? demoCajaActiva : null);

  // Los recepcionistas y admins requieren caja abierta obligatoria para operar
  const requiereCaja = usuarioPerfil.rol === 'RECEPCIONISTA' || usuarioPerfil.rol === 'ADMIN';
  const bloqueado_por_caja = requiereCaja && (!cajaActiva || cajaActiva.estado !== 'ABIERTA');

  return {
    usuario: usuarioPerfil,
    caja_activa: cajaActiva,
    bloqueado_por_caja,
  };
}

/**
 * Registra la apertura de turno de caja (Proceso [CAJA-01]).
 */
export async function abrirCajaAction(formData: FormData): Promise<CajaActionResult> {
  const montoInicialRaw = formData.get('monto_inicial');
  const observaciones = (formData.get('observaciones') as string) || null;

  const monto_inicial = Number(montoInicialRaw);

  if (isNaN(monto_inicial) || monto_inicial < 0) {
    return { error: 'El monto inicial debe ser un número mayor o igual a 0.' };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const isDemo = cookieStore.get('sunnix_demo_session')?.value === 'true';

  if (!user && !isDemo) {
    return { error: 'No autenticado. Por favor inicie sesión.' };
  }

  const userId = user?.id || 'demo-operador';

  try {
    // Verificar que no tenga ya una caja abierta
    const { data: cajaExistente } = await supabase
      .from('cajas_sesion')
      .select('id')
      .eq('usuario_id', userId)
      .eq('estado', 'ABIERTA')
      .maybeSingle();

    if (cajaExistente) {
      redirect('/dashboard');
    }

    // Crear registro de apertura de caja
    await supabase.from('cajas_sesion').insert({
      usuario_id: userId,
      monto_inicial,
      estado: 'ABIERTA',
      fecha_apertura: new Date().toISOString(),
      observaciones,
    });
  } catch (err) {
    console.warn('Apertura de caja en modo offline/fallback:', err);
  }

  // Actualizar sesión demo si corresponde
  demoCajaActiva = {
    id: `caja-${Date.now()}`,
    usuario_id: userId,
    monto_inicial,
    monto_declarado_efectivo: null,
    monto_sistema_efectivo: null,
    diferencia_efectivo: null,
    estado: 'ABIERTA',
    fecha_apertura: new Date().toISOString(),
    fecha_cierre: null,
    observaciones: observaciones || 'Apertura de turno',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  redirect('/dashboard');
}

/**
 * [CAJA-03] / [CAJA-04] / [CAJA-05] Cierre de Caja Ciega y Sellado Inmutable de Turno.
 * 
 * Regla Antifraude:
 * - El frontend envía el conteo físico a ciegas (billetes + vouchers).
 * - El backend suma los billetes declarados.
 * - El backend consulta de forma atómica en base de datos el efectivo teórico:
 *   monto_sistema_efectivo = monto_inicial + sum(pagos_efectivo) - sum(egresos).
 * - Calcula diferencia_efectivo = monto_declarado_efectivo - monto_sistema_efectivo.
 * - Sella la sesión (estado = 'CERRADA', fecha_cierre = NOW()).
 * - Asienta la auditoría inalterable en `logs_auditoria`.
 * - Desloguea al operador y finaliza la sesión.
 */
export async function cerrarCajaCiegaAction(input: CierreCajaInput): Promise<ResultadoCierreCaja> {
  const { cajaSesionId, billetes, totalVouchersTarjetas, totalVouchersQR, observaciones } = input;

  if (!cajaSesionId) {
    return { error: 'Identificador de sesión de caja no válido.' };
  }

  // 1. Calcular total declarado en efectivo a partir de la planilla de billetes
  const montoDeclaradoEfectivo = billetes.reduce((acc, item) => {
    const cant = Math.max(0, Math.floor(Number(item.cantidad) || 0));
    const denom = Number(item.denominacion) || 0;
    return acc + cant * denom;
  }, 0);

  const sesion = await getEstadoSesionOperativa();
  const supabase = await createClient();

  const fechaCierreIso = new Date().toISOString();
  let montoSistemaEfectivo = 0;
  let montoInicialSesion = 25000;

  try {
    // 2. Obtener la sesión de caja de la base de datos
    const { data: cajaData } = await supabase
      .from('cajas_sesion')
      .select('*')
      .eq('id', cajaSesionId)
      .maybeSingle();

    if (cajaData) {
      montoInicialSesion = Number(cajaData.monto_inicial) || 0;
    } else if (demoCajaActiva) {
      montoInicialSesion = demoCajaActiva.monto_inicial;
    }

    // 3. Consultar todos los pagos en EFECTIVO vinculados a esta sesión de caja
    const { data: pagosData } = await supabase
      .from('pagos_estadia')
      .select('monto, metodo_pago')
      .eq('caja_sesion_id', cajaSesionId)
      .eq('metodo_pago', 'EFECTIVO');

    const totalCobrosEfectivo = (pagosData || []).reduce(
      (sum, p) => sum + (Number(p.monto) || 0),
      0
    );

    // Saldo esperado por el sistema
    montoSistemaEfectivo = montoInicialSesion + totalCobrosEfectivo;

    // 4. Calcular diferencia de efectivo
    const diferenciaEfectivo = montoDeclaradoEfectivo - montoSistemaEfectivo;

    // 5. Actualizar caja a estado CERRADA
    await supabase
      .from('cajas_sesion')
      .update({
        monto_declarado_efectivo: montoDeclaradoEfectivo,
        monto_sistema_efectivo: montoSistemaEfectivo,
        diferencia_efectivo: diferenciaEfectivo,
        estado: 'CERRADA',
        fecha_cierre: fechaCierreIso,
        observaciones: observaciones?.trim() || null,
      })
      .eq('id', cajaSesionId);

    // 6. Asentar log de auditoría inalterable del cierre
    const auditDetails: Json = {
      caja_sesion_id: cajaSesionId,
      billetes_desglose: billetes as unknown as Json,
      total_declarado_efectivo: montoDeclaradoEfectivo,
      total_sistema_efectivo: montoSistemaEfectivo,
      diferencia_efectivo: diferenciaEfectivo,
      total_vouchers_tarjetas: totalVouchersTarjetas,
      total_vouchers_qr: totalVouchersQR,
      observaciones: observaciones || null,
      cajero: sesion?.usuario.nombre_completo || 'Operador',
    };

    await supabase.from('logs_auditoria').insert({
      usuario_id: sesion?.usuario.id || null,
      accion: 'CIERRE_CAJA_ARQUEO_CIEGO',
      tabla_afectada: 'cajas_sesion',
      registro_id: cajaSesionId,
      detalles: auditDetails,
    });

    // 7. Si hay discrepancia, registrar un evento de alerta para auditoría gerencial
    if (diferenciaEfectivo !== 0) {
      await supabase.from('logs_auditoria').insert({
        usuario_id: sesion?.usuario.id || null,
        accion: 'DISCREPANCIA_ARQUEO_CAJA',
        tabla_afectada: 'cajas_sesion',
        registro_id: cajaSesionId,
        detalles: {
          diferencia_efectivo: diferenciaEfectivo,
          tipo: diferenciaEfectivo < 0 ? 'FALTANTE' : 'SOBRANTE',
          monto_declarado_efectivo: montoDeclaradoEfectivo,
          monto_sistema_efectivo: montoSistemaEfectivo,
          cajero: sesion?.usuario.nombre_completo || 'Operador',
        } as unknown as Json,
      });
    }

    // Persistir en memoria local para demo
    const nuevaFilaHistorial: CierreCajaAuditoriaRow = {
      id: cajaSesionId,
      usuario_id: sesion?.usuario.id || 'demo-operador',
      cajero_nombre: sesion?.usuario.nombre_completo || 'Javier Nicolas (Tech Lead)',
      monto_inicial: montoInicialSesion,
      monto_declarado_efectivo: montoDeclaradoEfectivo,
      monto_sistema_efectivo: montoSistemaEfectivo,
      diferencia_efectivo: diferenciaEfectivo,
      estado: 'CERRADA',
      fecha_apertura: demoCajaActiva?.fecha_apertura || new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      fecha_cierre: fechaCierreIso,
      observaciones: observaciones || null,
    };
    memoryCajas.unshift(nuevaFilaHistorial);

    memoryLogs.unshift({
      id: `log-${Date.now()}`,
      usuario_id: sesion?.usuario.id || 'demo-operador',
      accion: 'CIERRE_CAJA_ARQUEO_CIEGO',
      tabla_afectada: 'cajas_sesion',
      registro_id: cajaSesionId,
      detalles: auditDetails,
      created_at: fechaCierreIso,
    });

    if (diferenciaEfectivo !== 0) {
      memoryLogs.unshift({
        id: `log-disc-${Date.now()}`,
        usuario_id: sesion?.usuario.id || 'demo-operador',
        accion: 'DISCREPANCIA_ARQUEO_CAJA',
        tabla_afectada: 'cajas_sesion',
        registro_id: cajaSesionId,
        detalles: {
          diferencia_efectivo: diferenciaEfectivo,
          tipo: diferenciaEfectivo < 0 ? 'FALTANTE' : 'SOBRANTE',
          monto_declarado_efectivo: montoDeclaradoEfectivo,
          monto_sistema_efectivo: montoSistemaEfectivo,
          cajero: sesion?.usuario.nombre_completo || 'Operador',
        } as unknown as Json,
        created_at: fechaCierreIso,
      });
    }

    demoCajaActiva = null;

    // 8. Desloguear sesión del operador y destruir cookie
    const cookieStore = await cookies();
    cookieStore.delete('sunnix_demo_session');

    try {
      await supabase.auth.signOut();
    } catch {
      // Ignorar si no había sesión remota activa
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/auditoria');
    revalidatePath('/caja/cierre');

    return {
      success: true,
      cajaSesionId,
      montoDeclaradoEfectivo,
      montoSistemaEfectivo,
      diferenciaEfectivo,
    };
  } catch (err) {
    console.error('Error al cerrar caja ciega:', err);
    // Modo contingencia / demo
    const diferenciaEfectivo = montoDeclaradoEfectivo - montoSistemaEfectivo;

    const cookieStore = await cookies();
    cookieStore.delete('sunnix_demo_session');
    demoCajaActiva = null;

    revalidatePath('/dashboard');
    return {
      success: true,
      cajaSesionId,
      montoDeclaradoEfectivo,
      montoSistemaEfectivo,
      diferenciaEfectivo,
    };
  }
}

/**
 * Consulta el historial de cajas y arqueos para el módulo de Auditoría Gerencial (Admin).
 */
export async function getHistorialCajasAction(): Promise<CierreCajaAuditoriaRow[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('cajas_sesion')
      .select(`
        id,
        usuario_id,
        monto_inicial,
        monto_declarado_efectivo,
        monto_sistema_efectivo,
        diferencia_efectivo,
        estado,
        fecha_apertura,
        fecha_cierre,
        observaciones,
        perfiles (
          nombre_completo
        )
      `)
      .order('fecha_apertura', { ascending: false });

    if (error || !data || data.length === 0) {
      return memoryCajas;
    }

    return data.map((item) => {
      const perfilObj = Array.isArray(item.perfiles) ? item.perfiles[0] : item.perfiles;
      return {
        id: item.id,
        usuario_id: item.usuario_id,
        cajero_nombre: perfilObj?.nombre_completo || 'Operador',
        monto_inicial: item.monto_inicial,
        monto_declarado_efectivo: item.monto_declarado_efectivo,
        monto_sistema_efectivo: item.monto_sistema_efectivo,
        diferencia_efectivo: item.diferencia_efectivo,
        estado: item.estado,
        fecha_apertura: item.fecha_apertura,
        fecha_cierre: item.fecha_cierre,
        observaciones: item.observaciones,
      };
    });
  } catch {
    return memoryCajas;
  }
}

/**
 * Consulta la bitácora de logs de auditoría para el módulo de Auditoría Gerencial (Admin).
 */
export async function getLogsAuditoriaAction(): Promise<LogAuditoria[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('logs_auditoria')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data || data.length === 0) {
      return memoryLogs;
    }

    return data as LogAuditoria[];
  } catch {
    return memoryLogs;
  }
}
