'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { HabitacionCardData, RackKPIs, EstadoHabitacion, Estadia, Habitacion } from '@/types';
import { alertSound } from '@/lib/audio/alertSound';

export function useRackRealtime(initialRooms: HabitacionCardData[]) {
  const [rooms, setRooms] = useState<HabitacionCardData[]>(initialRooms);
  const [lastEventTime, setLastEventTime] = useState<string>('');

  useEffect(() => {
    setLastEventTime(new Date().toLocaleTimeString());
  }, []);

  // Sincronizar si cambian los props iniciales
  useEffect(() => {
    setRooms(initialRooms);
  }, [initialRooms]);

  // Manejador de alerta de vencimiento
  const handleRoomWarning = useCallback((room: HabitacionCardData) => {
    alertSound.playWarningBeep();

    // Actualizar visualmente a POR_VENCER si estaba en OCUPADA
    setRooms((prev) =>
      prev.map((r) =>
        r.id === room.id && r.estado_actual === 'OCUPADA'
          ? { ...r, estado_actual: 'POR_VENCER' }
          : r
      )
    );
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = createClient();

    // Crear canal WebSocket exclusivo para el rack
    const channel = supabase
      .channel('rack-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'habitaciones' },
        (payload) => {
          setLastEventTime(new Date().toLocaleTimeString());

          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Habitacion;
            setRooms((prev) =>
              prev.map((room) =>
                room.id === updated.id
                  ? {
                      ...room,
                      numero: updated.numero,
                      estado_actual: updated.estado,
                    }
                  : room
              )
            );

            if (updated.estado === 'POR_VENCER') {
              alertSound.playWarningBeep();
            }
          } else if (payload.eventType === 'INSERT') {
            const inserted = payload.new as Habitacion;
            setRooms((prev) => {
              if (prev.some((r) => r.id === inserted.id)) return prev;
              return [
                ...prev,
                {
                  id: inserted.id,
                  numero: inserted.numero,
                  estado_actual: inserted.estado,
                  categoria: { id: inserted.categoria_id, nombre: 'Habitación' },
                  estadia_activa: null,
                },
              ];
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'estadias' },
        (payload) => {
          setLastEventTime(new Date().toLocaleTimeString());

          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const stay = payload.new as Estadia;

            setRooms((prev) =>
              prev.map((room) => {
                if (room.id !== stay.habitacion_id) return room;

                if (stay.estado === 'ACTIVA') {
                  return {
                    ...room,
                    estadia_activa: {
                      id: stay.id,
                      fecha_ingreso: stay.fecha_ingreso,
                      fecha_vencimiento_estimada: stay.fecha_vencimiento_estimada,
                      es_pernocte: stay.tipo_turno === 'PERNOCTE',
                      patente_vehiculo: stay.patente_vehiculo,
                    },
                  };
                } else if (stay.estado === 'FINALIZADA' || stay.estado === 'CANCELADA') {
                  return {
                    ...room,
                    estadia_activa: null,
                  };
                }

                return room;
              })
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Cálculo memoizado de KPIs
  const kpis: RackKPIs = useMemo(() => {
    const total = rooms.length;
    let libres = 0;
    let ocupadas = 0;
    let por_vencer = 0;
    let limpieza = 0;
    let mantenimiento = 0;

    for (const r of rooms) {
      switch (r.estado_actual) {
        case 'LIBRE':
          libres++;
          break;
        case 'OCUPADA':
          ocupadas++;
          break;
        case 'POR_VENCER':
          por_vencer++;
          break;
        case 'LIMPIEZA':
          limpieza++;
          break;
        case 'MANTENIMIENTO':
        case 'BLOQUEADA':
          mantenimiento++;
          break;
        default:
          break;
      }
    }

    const porcentaje_ocupacion =
      total > 0 ? Math.round(((ocupadas + por_vencer) / total) * 100) : 0;

    return {
      total,
      libres,
      ocupadas,
      por_vencer,
      limpieza,
      mantenimiento,
      porcentaje_ocupacion,
    };
  }, [rooms]);

  return {
    rooms,
    kpis,
    lastEventTime,
    handleRoomWarning,
  };
}
