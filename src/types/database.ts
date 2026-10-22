export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type RolUsuario = 'ADMIN' | 'RECEPCIONISTA' | 'MUCAMA' | 'SUPERVISOR';

export type EstadoHabitacion =
  | 'LIBRE'
  | 'OCUPADA'
  | 'POR_VENCER'
  | 'EN_COBRO'
  | 'LIMPIEZA'
  | 'MANTENIMIENTO'
  | 'BLOQUEADA';

export type EstadoEstadia = 'ACTIVA' | 'FINALIZADA' | 'CANCELADA';

export type MetodoPago =
  | 'EFECTIVO'
  | 'MERCADO_PAGO_QR'
  | 'TARJETA_DEBITO'
  | 'TARJETA_CREDITO'
  | 'TRANSFERENCIA';

export type CategoriaProducto =
  | 'BEBIDA'
  | 'KIOSCO'
  | 'SEX_SHOP'
  | 'AMENITY'
  | 'COCINA';

export type EstadoCaja = 'ABIERTA' | 'CERRADA';

export type TipoTurno = 'TURNO_BASE' | 'PERNOCTE' | 'FRACCION';

export interface Database {
  public: {
    Tables: {
      perfiles: {
        Row: {
          id: string;
          nombre_completo: string;
          rol: RolUsuario;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nombre_completo: string;
          rol?: RolUsuario;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre_completo?: string;
          rol?: RolUsuario;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categorias_habitacion: {
        Row: {
          id: string;
          nombre: string;
          descripcion: string | null;
          precio_base_defecto: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          descripcion?: string | null;
          precio_base_defecto?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          descripcion?: string | null;
          precio_base_defecto?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      habitaciones: {
        Row: {
          id: string;
          numero: string;
          categoria_id: string;
          estado: EstadoHabitacion;
          identificador_rele: string | null;
          motivo_bloqueo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          numero: string;
          categoria_id: string;
          estado?: EstadoHabitacion;
          identificador_rele?: string | null;
          motivo_bloqueo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          numero?: string;
          categoria_id?: string;
          estado?: EstadoHabitacion;
          identificador_rele?: string | null;
          motivo_bloqueo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "habitaciones_categoria_id_fkey";
            columns: ["categoria_id"];
            isOneToOne: false;
            referencedRelation: "categorias_habitacion";
            referencedColumns: ["id"];
          }
        ];
      };
      tarifas_config: {
        Row: {
          id: string;
          categoria_id: string;
          dia_semana: number;
          hora_desde: string;
          hora_hasta: string;
          duracion_turno_minutos: number;
          precio_turno_base: number;
          precio_hora_extra: number;
          precio_pernocte: number;
          hora_inicio_pernocte: string | null;
          hora_fin_pernocte: string | null;
          tolerancia_minutos: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          categoria_id: string;
          dia_semana: number;
          hora_desde: string;
          hora_hasta: string;
          duracion_turno_minutos?: number;
          precio_turno_base: number;
          precio_hora_extra: number;
          precio_pernocte: number;
          hora_inicio_pernocte?: string | null;
          hora_fin_pernocte?: string | null;
          tolerancia_minutos?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          categoria_id?: string;
          dia_semana?: number;
          hora_desde?: string;
          hora_hasta?: string;
          duracion_turno_minutos?: number;
          precio_turno_base?: number;
          precio_hora_extra?: number;
          precio_pernocte?: number;
          hora_inicio_pernocte?: string | null;
          hora_fin_pernocte?: string | null;
          tolerancia_minutos?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tarifas_config_categoria_id_fkey";
            columns: ["categoria_id"];
            isOneToOne: false;
            referencedRelation: "categorias_habitacion";
            referencedColumns: ["id"];
          }
        ];
      };
      cajas_sesion: {
        Row: {
          id: string;
          usuario_id: string;
          monto_inicial: number;
          monto_declarado_efectivo: number | null;
          monto_sistema_efectivo: number | null;
          diferencia_efectivo: number | null;
          estado: EstadoCaja;
          fecha_apertura: string;
          fecha_cierre: string | null;
          observaciones: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          usuario_id: string;
          monto_inicial: number;
          monto_declarado_efectivo?: number | null;
          monto_sistema_efectivo?: number | null;
          diferencia_efectivo?: number | null;
          estado?: EstadoCaja;
          fecha_apertura?: string;
          fecha_cierre?: string | null;
          observaciones?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string;
          monto_inicial?: number;
          monto_declarado_efectivo?: number | null;
          monto_sistema_efectivo?: number | null;
          diferencia_efectivo?: number | null;
          estado?: EstadoCaja;
          fecha_apertura?: string;
          fecha_cierre?: string | null;
          observaciones?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cajas_sesion_usuario_id_fkey";
            columns: ["usuario_id"];
            isOneToOne: false;
            referencedRelation: "perfiles";
            referencedColumns: ["id"];
          }
        ];
      };
      estadias: {
        Row: {
          id: string;
          habitacion_id: string;
          caja_sesion_id: string;
          usuario_id: string;
          estado: EstadoEstadia;
          fecha_ingreso: string;
          fecha_vencimiento_estimada: string;
          fecha_salida: string | null;
          tipo_turno: TipoTurno;
          patente_vehiculo: string | null;
          monto_tiempo: number;
          monto_consumos: number;
          monto_total: number;
          observaciones: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          habitacion_id: string;
          caja_sesion_id: string;
          usuario_id: string;
          estado?: EstadoEstadia;
          fecha_ingreso?: string;
          fecha_vencimiento_estimada: string;
          fecha_salida?: string | null;
          tipo_turno?: TipoTurno;
          patente_vehiculo?: string | null;
          monto_tiempo?: number;
          monto_consumos?: number;
          monto_total?: number;
          observaciones?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          habitacion_id?: string;
          caja_sesion_id?: string;
          usuario_id?: string;
          estado?: EstadoEstadia;
          fecha_ingreso?: string;
          fecha_vencimiento_estimada?: string;
          fecha_salida?: string | null;
          tipo_turno?: TipoTurno;
          patente_vehiculo?: string | null;
          monto_tiempo?: number;
          monto_consumos?: number;
          monto_total?: number;
          observaciones?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "estadias_habitacion_id_fkey";
            columns: ["habitacion_id"];
            isOneToOne: false;
            referencedRelation: "habitaciones";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "estadias_caja_sesion_id_fkey";
            columns: ["caja_sesion_id"];
            isOneToOne: false;
            referencedRelation: "cajas_sesion";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "estadias_usuario_id_fkey";
            columns: ["usuario_id"];
            isOneToOne: false;
            referencedRelation: "perfiles";
            referencedColumns: ["id"];
          }
        ];
      };
      productos: {
        Row: {
          id: string;
          nombre: string;
          categoria: CategoriaProducto;
          precio: number;
          stock_actual: number;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          categoria: CategoriaProducto;
          precio: number;
          stock_actual?: number;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          categoria?: CategoriaProducto;
          precio?: number;
          stock_actual?: number;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      consumos_estadia: {
        Row: {
          id: string;
          estadia_id: string;
          producto_id: string;
          usuario_id: string;
          cantidad: number;
          precio_unitario: number;
          subtotal: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          estadia_id: string;
          producto_id: string;
          usuario_id: string;
          cantidad?: number;
          precio_unitario: number;
          subtotal: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          estadia_id?: string;
          producto_id?: string;
          usuario_id?: string;
          cantidad?: number;
          precio_unitario?: number;
          subtotal?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "consumos_estadia_estadia_id_fkey";
            columns: ["estadia_id"];
            isOneToOne: false;
            referencedRelation: "estadias";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "consumos_estadia_producto_id_fkey";
            columns: ["producto_id"];
            isOneToOne: false;
            referencedRelation: "productos";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "consumos_estadia_usuario_id_fkey";
            columns: ["usuario_id"];
            isOneToOne: false;
            referencedRelation: "perfiles";
            referencedColumns: ["id"];
          }
        ];
      };
      pagos_estadia: {
        Row: {
          id: string;
          estadia_id: string;
          caja_sesion_id: string;
          usuario_id: string;
          monto: number;
          metodo_pago: MetodoPago;
          comprobante_nro: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          estadia_id: string;
          caja_sesion_id: string;
          usuario_id: string;
          monto: number;
          metodo_pago: MetodoPago;
          comprobante_nro?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          estadia_id?: string;
          caja_sesion_id?: string;
          usuario_id?: string;
          monto?: number;
          metodo_pago?: MetodoPago;
          comprobante_nro?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pagos_estadia_estadia_id_fkey";
            columns: ["estadia_id"];
            isOneToOne: false;
            referencedRelation: "estadias";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pagos_estadia_caja_sesion_id_fkey";
            columns: ["caja_sesion_id"];
            isOneToOne: false;
            referencedRelation: "cajas_sesion";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "pagos_estadia_usuario_id_fkey";
            columns: ["usuario_id"];
            isOneToOne: false;
            referencedRelation: "perfiles";
            referencedColumns: ["id"];
          }
        ];
      };
      logs_auditoria: {
        Row: {
          id: string;
          usuario_id: string | null;
          accion: string;
          tabla_afectada: string;
          registro_id: string | null;
          detalles: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          usuario_id?: string | null;
          accion: string;
          tabla_afectada: string;
          registro_id?: string | null;
          detalles?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          usuario_id?: string | null;
          accion?: string;
          tabla_afectada?: string;
          registro_id?: string | null;
          detalles?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "logs_auditoria_usuario_id_fkey";
            columns: ["usuario_id"];
            isOneToOne: false;
            referencedRelation: "perfiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      rol_usuario: RolUsuario;
      estado_habitacion: EstadoHabitacion;
      estado_estadia: EstadoEstadia;
      metodo_pago: MetodoPago;
      categoria_producto: CategoriaProducto;
      estado_caja: EstadoCaja;
    };
    CompositeTypes: Record<string, never>;
  };
}
