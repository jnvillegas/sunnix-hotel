'use client';

import { useEffect, useState, useRef } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface RoomTimerProps {
  fechaVencimiento: string;
  onWarning?: () => void;
  className?: string;
}

export function RoomTimer({ fechaVencimiento, onWarning, className = '' }: RoomTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    diffMs: number;
    formatted: string;
    isOvertime: boolean;
    isWarning: boolean;
  }>(() => calculateTime(fechaVencimiento));

  const hasFiredWarning = useRef<boolean>(false);

  useEffect(() => {
    // Cálculo inicial
    const initial = calculateTime(fechaVencimiento);
    setTimeLeft(initial);

    if (initial.isWarning && !hasFiredWarning.current) {
      hasFiredWarning.current = true;
      onWarning?.();
    }

    const interval = setInterval(() => {
      const current = calculateTime(fechaVencimiento);
      setTimeLeft(current);

      if (current.isWarning && !hasFiredWarning.current) {
        hasFiredWarning.current = true;
        onWarning?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fechaVencimiento, onWarning]);

  if (timeLeft.isOvertime) {
    return (
      <div
        className={`flex items-center gap-1 text-xs font-mono font-bold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/40 animate-pulse ${className}`}
      >
        <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
        <span>+{timeLeft.formatted}</span>
      </div>
    );
  }

  if (timeLeft.isWarning) {
    return (
      <div
        className={`flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/40 animate-pulse ${className}`}
      >
        <Clock className="w-3 h-3 text-amber-400 shrink-0" />
        <span>{timeLeft.formatted}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 text-xs font-mono font-medium text-zinc-300 bg-zinc-900/60 px-2 py-0.5 rounded border border-zinc-800 ${className}`}
    >
      <Clock className="w-3 h-3 text-zinc-500 shrink-0" />
      <span>{timeLeft.formatted}</span>
    </div>
  );
}

function calculateTime(targetDateIso: string) {
  const target = new Date(targetDateIso).getTime();
  const now = Date.now();
  const diffMs = target - now;

  if (diffMs <= 0) {
    // Tiempo extra (conteo positivo)
    const overdueMs = Math.abs(diffMs);
    const totalSecs = Math.floor(overdueMs / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    const formatted = `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}${String(
      minutes
    ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return {
      diffMs,
      formatted,
      isOvertime: true,
      isWarning: false,
    };
  }

  // Cuenta regresiva estándar
  const totalSecs = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(seconds).padStart(2, '0')}`;

  // Alerta cuando falten 15 minutos (900 segundos) o menos
  const isWarning = totalSecs <= 900;

  return {
    diffMs,
    formatted,
    isOvertime: false,
    isWarning,
  };
}
