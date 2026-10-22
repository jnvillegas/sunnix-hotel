import type { Database } from './database';

export * from './database';

// Enums del Sistema
export type RolUsuario = Database['public']['Enums']['rol_usuario'];
export type EstadoHabitacion = Database['public']['Enums']['estado_habitacion'];
export type EstadoEstadia = Database['public']['Enums']['estado_estadia'];
export type MetodoPago = Database['public']['Enums']['metodo_pago'];
export type CategoriaProducto = Database['public']['Enums']['categoria_producto'];
export type EstadoCaja = Database['public']['Enums']['estado_caja'];

// Entidades Fuertemente Tipadas (Row)
export type Perfil = Database['public']['Tables']['perfiles']['Row'];
export type CajaSesion = Database['public']['Tables']['cajas_sesion']['Row'];
export type CategoriaHabitacion = Database['public']['Tables']['categorias_habitacion']['Row'];
export type Habitacion = Database['public']['Tables']['habitaciones']['Row'];
export type TarifaConfig = Database['public']['Tables']['tarifas_config']['Row'];
export type Estadia = Database['public']['Tables']['estadias']['Row'];
export type Producto = Database['public']['Tables']['productos']['Row'];
export type ConsumoEstadia = Database['public']['Tables']['consumos_estadia']['Row'];
export type PagoEstadia = Database['public']['Tables']['pagos_estadia']['Row'];
export type LogAuditoria = Database['public']['Tables']['logs_auditoria']['Row'];

// Tipos de Inserción (Insert)
export type InsertPerfil = Database['public']['Tables']['perfiles']['Insert'];
export type InsertCajaSesion = Database['public']['Tables']['cajas_sesion']['Insert'];
export type InsertCategoriaHabitacion = Database['public']['Tables']['categorias_habitacion']['Insert'];
export type InsertHabitacion = Database['public']['Tables']['habitaciones']['Insert'];
export type InsertTarifaConfig = Database['public']['Tables']['tarifas_config']['Insert'];
export type InsertEstadia = Database['public']['Tables']['estadias']['Insert'];
export type InsertProducto = Database['public']['Tables']['productos']['Insert'];
export type InsertConsumoEstadia = Database['public']['Tables']['consumos_estadia']['Insert'];
export type InsertPagoEstadia = Database['public']['Tables']['pagos_estadia']['Insert'];
export type InsertLogAuditoria = Database['public']['Tables']['logs_auditoria']['Insert'];

// Tipos de Actualización (Update)
export type UpdatePerfil = Database['public']['Tables']['perfiles']['Update'];
export type UpdateCajaSesion = Database['public']['Tables']['cajas_sesion']['Update'];
export type UpdateCategoriaHabitacion = Database['public']['Tables']['categorias_habitacion']['Update'];
export type UpdateHabitacion = Database['public']['Tables']['habitaciones']['Update'];
export type UpdateTarifaConfig = Database['public']['Tables']['tarifas_config']['Update'];
export type UpdateEstadia = Database['public']['Tables']['estadias']['Update'];
export type UpdateProducto = Database['public']['Tables']['productos']['Update'];
export type UpdateConsumoEstadia = Database['public']['Tables']['consumos_estadia']['Update'];
export type UpdatePagoEstadia = Database['public']['Tables']['pagos_estadia']['Update'];
export type UpdateLogAuditoria = Database['public']['Tables']['logs_auditoria']['Update'];

// Tipos Compuestos para la UI del Rack
export type HabitacionConCategoria = Habitacion & {
  categoria: CategoriaHabitacion;
  estadia_activa?: Estadia | null;
};

// DTOs de Autenticación y Caja (Fase 2)
export interface AbrirCajaInput {
  monto_inicial: number;
  observaciones?: string;
}

export interface EstadoSesionOperativa {
  usuario: Perfil;
  caja_activa: CajaSesion | null;
  bloqueado_por_caja: boolean;
}

// DTOs de Rack en Tiempo Real (Fase 3 - SPEC-003)
export interface HabitacionCardData {
  id: string;
  numero: string;
  estado_actual: EstadoHabitacion;
  categoria: {
    id: string;
    nombre: string;
  };
  estadia_activa: {
    id: string;
    fecha_ingreso: string;
    fecha_vencimiento_estimada: string;
    es_pernocte: boolean;
    patente_vehiculo: string | null;
    monto_consumos?: number;
  } | null;
}

export interface RackKPIs {
  total: number;
  libres: number;
  ocupadas: number;
  por_vencer: number;
  limpieza: number;
  mantenimiento: number;
  porcentaje_ocupacion: number;
}

// DTOs de Bar y Room Service (Fase 5 - SPEC-005)
export interface ItemComandaInput {
  productoId: string;
  cantidad: number;
}

export interface CargarComandaInput {
  estadiaId: string;
  habitacionId: string;
  items: ItemComandaInput[];
}

export interface AnularConsumoInput {
  consumoId: string;
  estadiaId: string;
  productoId: string;
  cantidad: number;
  subtotal: number;
  motivo: string;
}

export interface ConsumoDetallado {
  id: string;
  estadia_id: string;
  producto_id: string;
  nombre_producto: string;
  categoria: CategoriaProducto;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  created_at: string;
}

// DTOs de Arqueo Ciego y Auditoría (Fase 6 - SPEC-006)
export interface ConteoDenominacion {
  denominacion: number; // Ej: 20000, 10000, 2000, 1000, 500, 200, 100
  cantidad: number;
}

export interface CierreCajaInput {
  cajaSesionId: string;
  billetes: ConteoDenominacion[];
  totalVouchersTarjetas: number;
  totalVouchersQR: number;
  observaciones?: string;
}

export interface ResultadoCierreCaja {
  success?: boolean;
  cajaSesionId?: string;
  montoDeclaradoEfectivo?: number;
  montoSistemaEfectivo?: number;
  diferenciaEfectivo?: number;
  error?: string;
}

export interface CierreCajaAuditoriaRow {
  id: string;
  usuario_id: string;
  cajero_nombre: string;
  monto_inicial: number;
  monto_declarado_efectivo: number | null;
  monto_sistema_efectivo: number | null;
  diferencia_efectivo: number | null;
  estado: EstadoCaja;
  fecha_apertura: string;
  fecha_cierre: string | null;
  observaciones: string | null;
}

// DTOs de Reportes Gerenciales y BI (Fase 8 - SPEC-007)
export interface ReporteFiltroInput {
  fechaDesde: string;
  fechaHasta: string;
  turno?: 'TODOS' | 'TURNO_1' | 'TURNO_2' | 'TURNO_3';
}

export interface MetricaVariacion {
  valor: number;
  variacionPorcentaje: number;
  esPositiva: boolean;
}

export interface ReporteKPIs {
  ingresos: MetricaVariacion;
  egresos: MetricaVariacion;
  ocupacionPromedio: MetricaVariacion;
  personalActivo: number;
}

export interface PuntoOcupacionDiaria {
  dia: string;
  porcentaje: number;
}

export interface IngresoPorTurno {
  turnoNombre: string;
  horario: string;
  monto: number;
  color: string;
}

export interface IngresoPorConceptoItem {
  concepto: string;
  monto: number;
  porcentaje: number;
  color: string;
}

export interface TiempoLimpiezaCategoria {
  categoria: string;
  minutos: number;
}

export interface MetodoPagoItem {
  metodo: string;
  monto: number;
  porcentaje: number;
}

export interface DetalleHabitacionItem {
  habitacionId: string;
  numero: string;
  categoria: string;
  cantidadEstadias: number;
  tiempoPromedioStr: string;
  ingresoTotal: number;
  porcentajeOcupacion: number;
}

export interface ResumenPeriodoItem {
  indicador: string;
  actualStr: string;
  mesAnteriorStr: string;
  variacionStr: string;
  esAumento: boolean;
}

export interface ReportesGerencialesResponse {
  kpis: ReporteKPIs;
  ocupacionDiaria: PuntoOcupacionDiaria[];
  ingresosPorTurno: IngresoPorTurno[];
  ingresosPorConcepto: IngresoPorConceptoItem[];
  tiempoPromedioLimpieza: {
    promedioMinutos: number;
    variacionPorcentaje: number;
    porCategoria: TiempoLimpiezaCategoria[];
  };
  asistenciaPersonal: {
    total: number;
    presentes: number;
    desglose: { puesto: string; presentes: number; total: number }[];
  };
  metodosPago: MetodoPagoItem[];
  detalleHabitaciones: DetalleHabitacionItem[];
  resumenComparativo: ResumenPeriodoItem[];
}

// DTOs de Housekeeping y Control de Limpieza (Fase 9 - SPEC-008)
export interface LimpiezaKPIData {
  total: number;
  disponibles: number;
  ocupadas: number;
  enLimpieza: number;
  mantenimiento: number;
}

export interface HabitacionLimpiezaCardData {
  id: string;
  numero: string;
  categoria: string;
  estado: 'DISPONIBLE' | 'OCUPADA' | 'LIMPIEZA' | 'MANTENIMIENTO';
  fotoUrl: string;
  tarifaStr: string;
  salidaHuesped?: string;
  inicioLimpieza?: string;
  personalNombre?: string;
  personalId?: string;
  porcentajeAvance?: number;
  tiempoEstimadoMinutos?: number;
  tiempoTranscurridoMinutos?: number;
  observaciones?: string;
}

export interface TareaLimpiezaItem {
  id: string;
  habitacionId: string;
  numero: string;
  categoria: string;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'FINALIZADA';
  horaSalidaHuesped: string;
  horaInicioLimpieza?: string;
  tiempoEstimadoMinutos: number;
  tiempoTranscurridoMinutos: number;
  personalAsignadoId?: string;
  personalAsignadoNombre?: string;
  porcentajeAvance: number;
  observaciones?: string;
}

export interface PersonalMucamaItem {
  id: string;
  nombre: string;
  puesto: string;
  disponible: boolean;
  habitacionesAsignadas: number;
}

export interface ControlLimpiezaData {
  kpis: LimpiezaKPIData;
  habitaciones: HabitacionLimpiezaCardData[];
  tareas: TareaLimpiezaItem[];
  personalMucamas: PersonalMucamaItem[];
}

export interface IniciarLimpiezaInput {
  habitacionId: string;
  personalId: string;
  tiempoEstimadoMinutos?: number;
  observaciones?: string;
}

export interface FinalizarLimpiezaInput {
  habitacionId: string;
  observaciones?: string;
}

export interface ReasignarLimpiezaInput {
  habitacionId: string;
  personalId: string;
  motivo?: string;
}

// DTOs de Personal y Control de Asistencia (Fase 10 - SPEC-009)
export type RolColaborador =
  | 'Encargada'
  | 'Recepción / Caja'
  | 'Mucama'
  | 'Limpieza'
  | 'Mantenimiento'
  | 'Otros';

export type EstadoAsistencia = 'PRESENTE' | 'TARDE' | 'AUSENTE' | 'DESCANSO';

export interface PersonalKPIData {
  total: number;
  presentes: number;
  ausentes: number;
  llegadaTarde: number;
  enDescanso: number;
}

export interface RegistroHistoricoItem {
  fecha: string;
  ingreso: string;
  salida: string;
  estado: EstadoAsistencia;
}

export interface EmpleadoAsistenciaItem {
  id: string;
  nombreCompleto: string;
  avatarUrl: string;
  dni: string;
  cargo: RolColaborador;
  turno: 'Turno 1' | 'Turno 2' | 'Turno 3';
  horarioProgramado: string;
  ingreso?: string;
  salida?: string;
  estado: EstadoAsistencia;
  historialSemanal: RegistroHistoricoItem[];
}

export interface PersonalPorCargoItem {
  cargo: string;
  cantidad: number;
  porcentaje: number;
  color: string;
}

export interface PresentesPorTurnoItem {
  turnoNombre: string;
  presentes: number;
  total: number;
  color: string;
}

export interface NovedadDiaItem {
  id: string;
  hora: string;
  empleado: string;
  evento: string;
  tipo: 'TARDE' | 'SALIDA_TEMPORAL' | 'LIMPIEZA' | 'AUSENTE' | 'INFO';
}

export interface AsistenciaPersonalData {
  kpis: PersonalKPIData;
  empleados: EmpleadoAsistenciaItem[];
  personalPorCargo: PersonalPorCargoItem[];
  presentesPorTurno: PresentesPorTurnoItem[];
  novedades: NovedadDiaItem[];
}

export interface RegistrarMarcacionInput {
  empleadoId: string;
  tipo: 'INGRESO' | 'SALIDA' | 'DESCANSO_INICIO' | 'DESCANSO_FIN';
  observaciones?: string;
}

// DTOs de Caja por Turno y Movimientos (Fase 11 - SPEC-010)
export interface TurnoInfo {
  id: 'TURNO_1' | 'TURNO_2' | 'TURNO_3';
  nombre: string;
  horario: string;
  estado: 'CERRADO' | 'ABIERTO' | 'PENDIENTE';
  responsable: string;
}

export interface MovimientoCajaItem {
  id: string;
  horaStr: string;
  tipo: 'INGRESO' | 'EGRESO';
  concepto: string;
  habitacionNumero?: string;
  medioPago: 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Otros';
  importe: number;
  usuarioNombre: string;
}

export interface MedioPagoResumenItem {
  medio: string;
  porcentaje: number;
  monto: number;
  color: string;
}

export interface ConceptoResumenItem {
  concepto: string;
  porcentaje: number;
  monto: number;
  color: string;
}

export interface CajaPorTurnoData {
  turnos: TurnoInfo[];
  turnoActivoId: string;
  aperturaHora: string;
  responsableNombre: string;
  observaciones: string;
  saldoInicial: number;
  totalIngresos: number;
  totalEgresos: number;
  saldoActual: number;
  habitacionesStats: {
    ingresos: number;
    extensiones: number;
    salidas: number;
  };
  movimientos: MovimientoCajaItem[];
  resumenMediosPago: MedioPagoResumenItem[];
  resumenConceptos: ConceptoResumenItem[];
}

export interface RegistrarMovimientoManualInput {
  tipo: 'INGRESO' | 'EGRESO';
  concepto: string;
  habitacionNumero?: string;
  medioPago: 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Otros';
  importe: number;
  observaciones?: string;
}

// DTOs de Turnos y Reservas
export interface ReservaTurnoItem {
  id: string;
  habitacionId: string;
  habitacionNumero: string;
  categoria: string;
  fotoUrl: string;
  huespedNombre: string;
  telefono: string;
  patenteVehiculo?: string;
  tipoTurno: 'TURNO_2H' | 'TURNO_3H' | 'PERNOCTE';
  fecha: string;
  horarioInicio: string;
  horarioFin: string;
  montoTotal: number;
  montoSena: number;
  estado: 'CONFIRMADA' | 'EN_CURSO' | 'COMPLETADA' | 'CANCELADA';
  observaciones?: string;
}

export interface TurnosKPIData {
  reservasHoy: number;
  pernoctesActivos: number;
  enEspera: number;
  disponibilidadPorcentaje: number;
}

export interface TurnosPageData {
  kpis: TurnosKPIData;
  reservas: ReservaTurnoItem[];
}

export interface NuevaReservaInput {
  habitacionId: string;
  huespedNombre: string;
  telefono: string;
  patenteVehiculo?: string;
  tipoTurno: 'TURNO_2H' | 'TURNO_3H' | 'PERNOCTE';
  fecha: string;
  horarioInicio: string;
  horarioFin: string;
  montoTotal: number;
  montoSena: number;
  observaciones?: string;
}

// DTOs de Ingresos y Egresos (Tesorería)
export interface MovimientoFinancieroItem {
  id: string;
  fechaStr: string;
  horaStr: string;
  tipo: 'INGRESO' | 'EGRESO';
  categoria: 'ESTADIAS' | 'BAR_ROOM_SERVICE' | 'INSUMOS' | 'SERVICIOS' | 'MANTENIMIENTO' | 'RETIRO_CAJA' | 'OTROS';
  categoriaNombre: string;
  concepto: string;
  habitacionNumero?: string;
  medioPago: 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Otros';
  comprobanteNumero?: string;
  monto: number;
  usuarioNombre: string;
}

export interface IngresosEgresosKPIData {
  totalIngresos: number;
  totalEgresos: number;
  balanceNeto: number;
  margenOperativo: number;
}

export interface IngresosEgresosPageData {
  kpis: IngresosEgresosKPIData;
  movimientos: MovimientoFinancieroItem[];
}

// DTOs de Configuración del Hotel
export interface HotelGeneralConfig {
  nombreHotel: string;
  razonSocial: string;
  direccion: string;
  telefono: string;
  email: string;
  cuit: string;
  moneda: string;
  capacidadSuites: number;
}

export interface OperacionTiemposConfig {
  toleranciaGraciaMinutos: number;
  alertaVencimientoMinutos: number;
  turnoBaseMinutos: number;
  turnoExtendidoMinutos: number;
  bloqueExtraMinutos: number;
  horarioInicioPernocte: string;
  horarioFinPernocte: string;
  maxPersonasSinRecargo: number;
  recargoPersonaAdicional: number;
}

export interface TarifaCategoriaConfig {
  id: string;
  categoria: string;
  turno2h: number;
  turno3h: number;
  pernocte: number;
  horaExtra: number;
}

export interface SeguridadCajaConfig {
  modoArqueoCiego: boolean;
  bloqueoSesionSinCaja: boolean;
  margenToleranciaDesvio: number;
  anonimatoHuespedEstricto: boolean;
  solicitarPatenteOpcional: boolean;
  auditoriaModificacionesObligatoria: boolean;
}

export interface DomoticaConfig {
  habilitado: boolean;
  ipControlador: string;
  puertoMqtt: number;
  corteAutomaticoLimpieza: boolean;
  delayCorteMinutos: number;
  autoEnergizacionCheckIn: boolean;
}

export interface HotelConfiguracionData {
  general: HotelGeneralConfig;
  operacion: OperacionTiemposConfig;
  tarifas: TarifaCategoriaConfig[];
  seguridad: SeguridadCajaConfig;
  domotica: DomoticaConfig;
}
