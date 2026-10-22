'use client';

import { useState, useEffect, useTransition, useMemo } from 'react';
import type { HabitacionCardData, Producto, CategoriaProducto, ConsumoDetallado } from '@/types';
import {
  getProductosAction,
  getConsumosEstadiaAction,
  cargarComandaAction,
  anularConsumoAction,
} from '@/actions/bar';
import {
  Coffee,
  Minus,
  Plus,
  Receipt,
  Search,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Trash2,
  Wine,
  X,
  PackageOpen,
} from 'lucide-react';

interface RoomServiceModalProps {
  room: HabitacionCardData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface CartItem {
  producto: Producto;
  cantidad: number;
}

const CATEGORIAS: Array<{ key: string; label: string }> = [
  { key: 'TODAS', label: 'Todas' },
  { key: 'BEBIDA', label: 'Bebidas' },
  { key: 'KIOSCO', label: 'Kiosco' },
  { key: 'SEX_SHOP', label: 'Sex Shop' },
  { key: 'AMENITY', label: 'Amenities' },
  { key: 'COCINA', label: 'Cocina' },
];

export function RoomServiceModal({ room, isOpen, onClose, onSuccess }: RoomServiceModalProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [consumosPrevios, setConsumosPrevios] = useState<ConsumoDetallado[]>([]);
  const [activeTab, setActiveTab] = useState<'NUEVO_PEDIDO' | 'HISTORIAL'>('NUEVO_PEDIDO');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Modal para anulación con motivo
  const [anulandoConsumo, setAnulandoConsumo] = useState<ConsumoDetallado | null>(null);
  const [motivoAnulacion, setMotivoAnulacion] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    getProductosAction().then(setProductos);

    if (room.estadia_activa?.id) {
      getConsumosEstadiaAction(room.estadia_activa.id).then(setConsumosPrevios);
    }
  }, [isOpen, room]);

  const estadiaId = room.estadia_activa?.id || 'demo-estadia';

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    return productos.filter((p) => {
      if (categoriaFiltro !== 'TODAS' && p.categoria !== categoriaFiltro) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q);
      }
      return true;
    });
  }, [productos, categoriaFiltro, searchQuery]);

  // Manejo del carrito
  const addToCart = (prod: Producto) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.producto.id === prod.id);
      if (existing) {
        if (existing.cantidad >= prod.stock_actual) {
          setError(`No hay más stock disponible para ${prod.nombre}.`);
          return prev;
        }
        return prev.map((item) =>
          item.producto.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { producto: prod, cantidad: 1 }];
    });
    setError(null);
  };

  const updateQuantity = (prodId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.producto.id === prodId) {
            const nextCant = item.cantidad + delta;
            if (nextCant > item.producto.stock_actual) {
              setError(`Stock máximo alcanzado para ${item.producto.nombre}.`);
              return item;
            }
            return { ...item, cantidad: nextCant };
          }
          return item;
        })
        .filter((item) => item.cantidad > 0)
    );
  };

  const removeFromCart = (prodId: string) => {
    setCart((prev) => prev.filter((item) => item.producto.id !== prodId));
  };

  const totalCarrito = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);
  }, [cart]);

  const totalHistorico = useMemo(() => {
    return consumosPrevios.reduce((sum, item) => sum + item.subtotal, 0);
  }, [consumosPrevios]);

  // Enviar comanda
  const handleConfirmarPedido = () => {
    if (cart.length === 0) return;
    setError(null);
    setSuccessMsg(null);

    startTransition(async () => {
      const res = await cargarComandaAction({
        estadiaId,
        habitacionId: room.id,
        items: cart.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
        })),
      });

      if (res.error) {
        setError(res.error);
      } else {
        setCart([]);
        setSuccessMsg(`Comanda de $${(res.totalCargado || totalCarrito).toLocaleString()} imputada con éxito.`);
        // Refrescar consumos previos
        const updated = await getConsumosEstadiaAction(estadiaId);
        setConsumosPrevios(updated);
        onSuccess?.();
      }
    });
  };

  // Anulación auditada
  const handleConfirmarAnulacion = () => {
    if (!anulandoConsumo || !motivoAnulacion.trim()) return;

    startTransition(async () => {
      const res = await anularConsumoAction({
        consumoId: anulandoConsumo.id,
        estadiaId,
        productoId: anulandoConsumo.producto_id,
        cantidad: anulandoConsumo.cantidad,
        subtotal: anulandoConsumo.subtotal,
        motivo: motivoAnulacion,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setAnulandoConsumo(null);
        setMotivoAnulacion('');
        const updated = await getConsumosEstadiaAction(estadiaId);
        setConsumosPrevios(updated);
        setSuccessMsg('Consumo anulado y stock restituido.');
        onSuccess?.();
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-[#121217] border border-[#27272a] rounded-xl shadow-2xl max-w-4xl w-full h-[90vh] max-h-[700px] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 border-b border-[#27272a] bg-zinc-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold font-mono text-white uppercase tracking-tight">
                  Bar & Room Service: Habitación {room.numero}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {room.categoria.nombre}
                </span>
              </div>
              <p className="text-xs font-mono text-zinc-400">
                Imputación directa a estadía • Total consumido:{' '}
                <span className="text-emerald-400 font-bold">${totalHistorico.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex rounded-lg bg-zinc-900 border border-zinc-800 p-0.5 font-mono text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('NUEVO_PEDIDO')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'NUEVO_PEDIDO'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Catálogo ({cart.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('HISTORIAL')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'HISTORIAL'
                    ? 'bg-zinc-800 text-white font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Cargados ({consumosPrevios.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback banners */}
        {error && (
          <div className="mx-5 mt-3 p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 font-mono">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-5 mt-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Content Area */}
        {activeTab === 'NUEVO_PEDIDO' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Column: Product Catalog Grid */}
            <div className="flex-1 flex flex-col border-r border-[#27272a] overflow-hidden p-4">
              {/* Filter controls */}
              <div className="space-y-3 mb-3 shrink-0">
                {/* Search input */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar producto por nombre o categoría..."
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                  />
                </div>

                {/* Categories Tabs */}
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  {CATEGORIAS.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setCategoriaFiltro(cat.key)}
                      className={`px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                        categoriaFiltro === cat.key
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Tiles Grid */}
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {filteredProducts.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => addToCart(prod)}
                    disabled={prod.stock_actual <= 0}
                    className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all select-none cursor-pointer ${
                      prod.stock_actual > 0
                        ? 'bg-[#16161d] border-zinc-800 hover:border-amber-500/50 hover:bg-[#1a1a24] active:scale-[0.98]'
                        : 'bg-zinc-900/40 border-zinc-900 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1">
                        <span className="uppercase">{prod.categoria}</span>
                        <span
                          className={
                            prod.stock_actual <= 5 ? 'text-red-400 font-bold' : 'text-zinc-400'
                          }
                        >
                          Stock: {prod.stock_actual}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white leading-snug line-clamp-2">
                        {prod.nombre}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold font-mono text-amber-400">
                        ${prod.precio.toLocaleString()}
                      </span>
                      <span className="p-1 rounded bg-zinc-800 text-zinc-300 group-hover:bg-amber-500 group-hover:text-black">
                        <Plus className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Order Cart Panel */}
            <div className="w-full md:w-80 bg-zinc-950/60 flex flex-col p-4 shrink-0 overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272a] font-mono text-xs text-zinc-300 font-bold uppercase tracking-wider">
                <span>Comanda Actual</span>
                <span className="text-amber-400">{cart.length} item(s)</span>
              </div>

              {/* Cart items list */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <Coffee className="w-8 h-8 text-zinc-600 mb-2" />
                    <p className="text-xs font-mono text-zinc-500">
                      Seleccione productos del catálogo para agregar a la comanda.
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.producto.id}
                      className="p-2.5 rounded-lg bg-[#121217] border border-zinc-800 flex items-center justify-between gap-2 text-xs font-mono"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{item.producto.nombre}</p>
                        <p className="text-[11px] text-zinc-400">
                          ${item.producto.precio.toLocaleString()} c/u
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.producto.id, -1)}
                          className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-bold text-white">
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.producto.id, 1)}
                          className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.producto.id)}
                          className="p-1 text-zinc-500 hover:text-red-400 ml-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer Summary & Submit */}
              <div className="pt-3 border-t border-[#27272a] space-y-3 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 uppercase">Subtotal Comanda:</span>
                  <span className="text-base font-bold text-emerald-400">
                    ${totalCarrito.toLocaleString()}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmarPedido}
                  disabled={cart.length === 0 || isPending}
                  className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-zinc-950 font-bold text-xs tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
                >
                  {isPending ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <span>Imputando comanda...</span>
                    </>
                  ) : (
                    <>
                      <Receipt className="w-4 h-4" />
                      <span>Cargar a Habitación {room.numero}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* View 2: Historial de Consumos Ya Imputados */
          <div className="flex-1 p-5 overflow-y-auto space-y-3 font-mono">
            <div className="flex justify-between items-center text-xs text-zinc-400 pb-2 border-b border-zinc-800">
              <span>Listado de productos ya consumidos en la estadía activa</span>
              <span className="font-bold text-white">
                Total Acumulado: ${totalHistorico.toLocaleString()}
              </span>
            </div>

            {consumosPrevios.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 text-xs">
                No hay consumos previos registrados en esta estadía.
              </div>
            ) : (
              <div className="space-y-2">
                {consumosPrevios.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{item.nombre_producto}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 uppercase">
                          {item.categoria}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {item.cantidad} unidad(es) x ${item.precio_unitario.toLocaleString()} ={' '}
                        <span className="text-emerald-400 font-bold">
                          ${item.subtotal.toLocaleString()}
                        </span>
                        <span className="text-zinc-600 ml-2">
                          {new Date(item.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAnulandoConsumo(item)}
                      className="px-2.5 py-1 rounded bg-red-950/40 border border-red-500/30 hover:border-red-500 text-red-300 text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                      <span>Anular</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Diálogo Modal de Anulación Auditada [BAR-02] */}
        {anulandoConsumo && (
          <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-[#121217] border border-red-500/40 rounded-xl p-5 max-w-sm w-full font-mono text-xs space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>Protocolo de Anulación Auditada [BAR-02]</span>
              </div>
              <p className="text-zinc-300">
                Está por anular: <span className="font-bold text-white">{anulandoConsumo.nombre_producto}</span> (${anulandoConsumo.subtotal.toLocaleString()}).
              </p>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                  Motivo obligatorio de anulación *
                </label>
                <textarea
                  value={motivoAnulacion}
                  onChange={(e) => setMotivoAnulacion(e.target.value)}
                  placeholder="Ej: Producto devuelto intacto al pasamanos / Error de tipeo"
                  rows={2}
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAnulandoConsumo(null);
                    setMotivoAnulacion('');
                  }}
                  className="flex-1 py-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmarAnulacion}
                  disabled={motivoAnulacion.trim().length < 5 || isPending}
                  className="flex-1 py-2 rounded bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-bold cursor-pointer"
                >
                  Confirmar Anulación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
