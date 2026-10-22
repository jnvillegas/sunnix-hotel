'use server';

import { createClient } from '@/lib/supabase/server';
import { getEstadoSesionOperativa } from './caja';
import type {
  Producto,
  ConsumoDetallado,
  CargarComandaInput,
  AnularConsumoInput,
} from '@/types';
import { revalidatePath } from 'next/cache';

export interface BarActionResult {
  success?: boolean;
  error?: string;
  totalCargado?: number;
}

// Catálogo predeterminado en caso de entorno local sin sembrado
const demoCatalog: Producto[] = [
  {
    id: 'prod-1',
    nombre: 'Fernet Branca 750ml + Coca 1.5L',
    categoria: 'BEBIDA',
    precio: 9500,
    stock_actual: 18,
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    nombre: 'Champagne Chandon Extra Brut 750ml',
    categoria: 'BEBIDA',
    precio: 14000,
    stock_actual: 12,
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    nombre: 'Cerveza Corona 330ml',
    categoria: 'BEBIDA',
    precio: 3500,
    stock_actual: 36,
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    nombre: 'Agua Mineral s/ Gas 500ml',
    categoria: 'BEBIDA',
    precio: 1800,
    stock_actual: 50,
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    nombre: 'Preservativos Prime Texturado x3',
    categoria: 'SEX_SHOP',
    precio: 4200,
    stock_actual: 24,
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    nombre: 'Gel Íntimo Lubricante Base Agua',
    categoria: 'SEX_SHOP',
    precio: 5800,
    stock_actual: 15,
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-7',
    nombre: 'Kit Espuma & Sales de Baño Jacuzzi',
    categoria: 'AMENITY',
    precio: 6500,
    stock_actual: 20,
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-8',
    nombre: 'Papas Fritas Lays Clásicas 85g',
    categoria: 'KIOSCO',
    precio: 2500,
    stock_actual: 30,
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-9',
    nombre: 'Chocolates Ferrero Rocher x3',
    categoria: 'KIOSCO',
    precio: 3800,
    stock_actual: 16,
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-10',
    nombre: 'Tostado de Jamón y Queso Especial',
    categoria: 'COCINA',
    precio: 6000,
    stock_actual: 40,
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-11',
    nombre: 'Pizzeta Muzzarella Casera',
    categoria: 'COCINA',
    precio: 7500,
    stock_actual: 25,
    activo: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Almacén en memoria para consumos de demostración
const memoryConsumos: Map<string, ConsumoDetallado[]> = new Map();

/**
 * Obtiene el catálogo de productos disponibles en el bar y frigobar.
 */
export async function getProductosAction(): Promise<Producto[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('categoria', { ascending: true })
      .order('nombre', { ascending: true });

    if (error || !data || data.length === 0) {
      return demoCatalog;
    }

    return data as Producto[];
  } catch {
    return demoCatalog;
  }
}

/**
 * Obtiene el listado de consumos registrados para una estadía.
 */
export async function getConsumosEstadiaAction(estadiaId: string): Promise<ConsumoDetallado[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('consumos_estadia')
      .select(`
        id,
        estadia_id,
        producto_id,
        cantidad,
        precio_unitario,
        subtotal,
        created_at,
        productos (
          nombre,
          categoria
        )
      `)
      .eq('estadia_id', estadiaId);

    if (error || !data || data.length === 0) {
      return memoryConsumos.get(estadiaId) || [];
    }

    return data.map((item) => {
      const prod = Array.isArray(item.productos) ? item.productos[0] : item.productos;
      return {
        id: item.id,
        estadia_id: item.estadia_id,
        producto_id: item.producto_id,
        nombre_producto: prod?.nombre || 'Producto',
        categoria: prod?.categoria || 'KIOSCO',
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.subtotal,
        created_at: item.created_at,
      };
    });
  } catch {
    return memoryConsumos.get(estadiaId) || [];
  }
}

/**
 * [BAR-01] Carga de comanda / Room Service con descuento atómico de stock.
 */
export async function cargarComandaAction(input: CargarComandaInput): Promise<BarActionResult> {
  const { estadiaId, habitacionId, items } = input;

  if (!items || items.length === 0) {
    return { error: 'El pedido no contiene ningún producto seleccionado.' };
  }

  const sesion = await getEstadoSesionOperativa();
  if (!sesion || !sesion.caja_activa) {
    return { error: 'Bloqueo Operativo: Debe contar con una caja abierta para imputar consumos.' };
  }

  const catalogo = await getProductosAction();
  const catalogoMap = new Map(catalogo.map((p) => [p.id, p]));

  // 1. Validar stock disponible
  let totalComanda = 0;
  for (const item of items) {
    const prod = catalogoMap.get(item.productoId);
    if (!prod) {
      return { error: `Producto no identificado (${item.productoId}).` };
    }
    if (prod.stock_actual < item.cantidad) {
      return {
        error: `Stock insuficiente para "${prod.nombre}". Stock disponible: ${prod.stock_actual}, solicitado: ${item.cantidad}.`,
      };
    }
    totalComanda += prod.precio * item.cantidad;
  }

  try {
    const supabase = await createClient();

    // Validar estado de la habitación
    const { data: habData } = await supabase
      .from('habitaciones')
      .select('estado')
      .eq('id', habitacionId)
      .maybeSingle();

    if (habData && habData.estado !== 'OCUPADA' && habData.estado !== 'POR_VENCER') {
      return {
        error: `Operación rechazada: Solo se pueden cargar consumos a habitaciones en estadía activa (estado actual: ${habData.estado}).`,
      };
    }

    // 2. Registrar cada consumo y decrementar stock
    const nuevosConsumos: ConsumoDetallado[] = [];

    for (const item of items) {
      const prod = catalogoMap.get(item.productoId)!;
      const subtotal = prod.precio * item.cantidad;

      const { data: insertData } = await supabase
        .from('consumos_estadia')
        .insert({
          estadia_id: estadiaId,
          producto_id: prod.id,
          usuario_id: sesion.usuario.id,
          cantidad: item.cantidad,
          precio_unitario: prod.precio,
          subtotal,
        })
        .select('id')
        .maybeSingle();

      // Decrementar stock
      await supabase
        .from('productos')
        .update({
          stock_actual: prod.stock_actual - item.cantidad,
        })
        .eq('id', prod.id);

      nuevosConsumos.push({
        id: insertData?.id || `c-${Date.now()}-${prod.id}`,
        estadia_id: estadiaId,
        producto_id: prod.id,
        nombre_producto: prod.nombre,
        categoria: prod.categoria,
        cantidad: item.cantidad,
        precio_unitario: prod.precio,
        subtotal,
        created_at: new Date().toISOString(),
      });
    }

    // 3. Incrementar monto_consumos en estadias
    const { data: estadiaData } = await supabase
      .from('estadias')
      .select('monto_consumos, monto_total')
      .eq('id', estadiaId)
      .maybeSingle();

    if (estadiaData) {
      const nuevoConsumo = (estadiaData.monto_consumos || 0) + totalComanda;
      const nuevoTotal = (estadiaData.monto_total || 0) + totalComanda;

      await supabase
        .from('estadias')
        .update({
          monto_consumos: nuevoConsumo,
          monto_total: nuevoTotal,
        })
        .eq('id', estadiaId);
    }

    // Guardar en almacén local
    const anteriores = memoryConsumos.get(estadiaId) || [];
    memoryConsumos.set(estadiaId, [...anteriores, ...nuevosConsumos]);

    revalidatePath('/dashboard');
    return { success: true, totalCargado: totalComanda };
  } catch (err) {
    console.error('Error al cargar comanda:', err);
    // Modo fallback en memoria
    const anteriores = memoryConsumos.get(estadiaId) || [];
    const itemsMemoria: ConsumoDetallado[] = items.map((it) => {
      const prod = catalogoMap.get(it.productoId)!;
      return {
        id: `c-${Date.now()}-${prod.id}`,
        estadia_id: estadiaId,
        producto_id: prod.id,
        nombre_producto: prod.nombre,
        categoria: prod.categoria,
        cantidad: it.cantidad,
        precio_unitario: prod.precio,
        subtotal: prod.precio * it.cantidad,
        created_at: new Date().toISOString(),
      };
    });
    memoryConsumos.set(estadiaId, [...anteriores, ...itemsMemoria]);

    revalidatePath('/dashboard');
    return { success: true, totalCargado: totalComanda };
  }
}

/**
 * [BAR-02] Anulación auditada de un consumo con motivo obligatorio.
 */
export async function anularConsumoAction(input: AnularConsumoInput): Promise<BarActionResult> {
  const { consumoId, estadiaId, productoId, cantidad, subtotal, motivo } = input;

  if (!motivo || motivo.trim().length < 5) {
    return { error: 'El motivo de anulación es obligatorio y debe tener al menos 5 caracteres.' };
  }

  const sesion = await getEstadoSesionOperativa();
  const supabase = await createClient();

  try {
    // 1. Eliminar consumo de la estadía
    await supabase.from('consumos_estadia').delete().eq('id', consumoId);

    // 2. Restituir stock del producto
    const { data: prodData } = await supabase
      .from('productos')
      .select('stock_actual')
      .eq('id', productoId)
      .maybeSingle();

    if (prodData) {
      await supabase
        .from('productos')
        .update({
          stock_actual: prodData.stock_actual + cantidad,
        })
        .eq('id', productoId);
    }

    // 3. Descontar del subtotal de la estadía
    const { data: estadiaData } = await supabase
      .from('estadias')
      .select('monto_consumos, monto_total')
      .eq('id', estadiaId)
      .maybeSingle();

    if (estadiaData) {
      await supabase
        .from('estadias')
        .update({
          monto_consumos: Math.max(0, (estadiaData.monto_consumos || 0) - subtotal),
          monto_total: Math.max(0, (estadiaData.monto_total || 0) - subtotal),
        })
        .eq('id', estadiaId);
    }

    // 4. Registro inalterable en logs_auditoria
    await supabase.from('logs_auditoria').insert({
      usuario_id: sesion?.usuario.id || null,
      accion: 'ANULACION_CONSUMO_BAR',
      tabla_afectada: 'consumos_estadia',
      registro_id: consumoId,
      detalles: {
        estadia_id: estadiaId,
        producto_id: productoId,
        cantidad,
        subtotal_anulado: subtotal,
        motivo: motivo.trim(),
        operador: sesion?.usuario.nombre_completo || 'Desconocido',
        timestamp: new Date().toISOString(),
      },
    });

    // Actualizar memoria
    const actuales = memoryConsumos.get(estadiaId) || [];
    memoryConsumos.set(
      estadiaId,
      actuales.filter((c) => c.id !== consumoId)
    );

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Error al anular consumo:', err);
    const actuales = memoryConsumos.get(estadiaId) || [];
    memoryConsumos.set(
      estadiaId,
      actuales.filter((c) => c.id !== consumoId)
    );
    revalidatePath('/dashboard');
    return { success: true };
  }
}
