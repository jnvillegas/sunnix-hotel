'use client';

import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import type { HabitacionLimpiezaCardData, PersonalMucamaItem } from '@/types';

interface LimpiezaDrawerProps {
  habitacion: HabitacionLimpiezaCardData | null;
  onClose: () => void;
  onMarcarFinalizada: (habitacionId: string, observaciones?: string) => Promise<void>;
  onOpenReasignarModal: (hab: HabitacionLimpiezaCardData) => void;
  isSubmitting?: boolean;
}

export function LimpiezaDrawer({
  habitacion,
  onClose,
  onMarcarFinalizada,
  onOpenReasignarModal,
  isSubmitting = false,
}: LimpiezaDrawerProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [observaciones, setObservaciones] = useState(habitacion?.observaciones || '');

  if (!habitacion) return null;

  // Lista de fotos para el carrusel
  const photos = [
    habitacion.fotoUrl,
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80',
  ];

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const isEnLimpieza = habitacion.estado === 'LIMPIEZA';
  const tiempoEstimado = habitacion.tiempoEstimadoMinutos || 20;
  const tiempoTranscurrido = habitacion.tiempoTranscurridoMinutos || 12;
  const tiempoRestante = Math.max(0, tiempoEstimado - tiempoTranscurrido);

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0c142b] border-l border-[#1e293b] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-5 border-b border-[#1e293b] flex items-center justify-between sticky top-0 bg-[#0c142b]/95 backdrop-blur-md z-10">
        <div className="flex items-center gap-2.5">
          <h3 className="text-base font-extrabold text-white tracking-tight">
            Habitación {habitacion.numero} - {habitacion.categoria}
          </h3>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
              isEnLimpieza
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : habitacion.estado === 'DISPONIBLE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}
          >
            {isEnLimpieza ? 'En limpieza' : habitacion.estado}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-5 flex-1">
        {/* Photo Carousel */}
        <div className="relative rounded-2xl overflow-hidden h-48 bg-slate-900 group">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-300"
            style={{ backgroundImage: `url('${photos[currentPhotoIndex]}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrevPhoto}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextPhoto}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentPhotoIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Categoría y Tarifa */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#111a38] border border-[#1e293b]">
          <div>
            <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
              Categoría
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              {habitacion.categoria}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
              Tarifa
            </span>
            <span className="text-sm font-bold font-mono text-emerald-400 mt-0.5 block">
              {habitacion.tarifaStr}
            </span>
          </div>
        </div>

        {/* Timeline Details matching Image 4 */}
        <div className="space-y-2.5 text-xs">
          {/* Salida del huésped */}
          <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
            <span className="flex items-center gap-2 text-zinc-400">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              <span>Salida del huésped</span>
            </span>
            <span className="font-mono font-medium text-white">
              {habitacion.salidaHuesped || '11:40'}
            </span>
          </div>

          {/* Inicio de limpieza */}
          <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
            <span className="flex items-center gap-2 text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Inicio de limpieza</span>
            </span>
            <span className="font-mono font-medium text-white">
              {habitacion.inicioLimpieza || '11:47'}
            </span>
          </div>

          {/* Tiempo estimado */}
          <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
            <span className="flex items-center gap-2 text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Tiempo estimado</span>
            </span>
            <span className="font-mono font-medium text-white">
              {tiempoEstimado} min
            </span>
          </div>

          {/* Tiempo transcurrido (EN ROJO como en la maqueta) */}
          <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
            <span className="flex items-center gap-2 text-zinc-400">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>Tiempo transcurrido</span>
            </span>
            <span className="font-mono font-bold text-red-400">
              {tiempoTranscurrido} min
            </span>
          </div>

          {/* Tiempo restante */}
          <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
            <span className="flex items-center gap-2 text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Tiempo restante</span>
            </span>
            <span className="font-mono font-medium text-white">
              {tiempoRestante} min
            </span>
          </div>

          {/* Personal asignado */}
          <div className="flex items-center justify-between py-1.5 border-b border-slate-800/80">
            <span className="flex items-center gap-2 text-zinc-400">
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Personal asignado</span>
            </span>
            <span className="font-medium text-white">
              {habitacion.personalNombre || 'María López'}
            </span>
          </div>

          {/* Estado */}
          <div className="flex items-center justify-between py-1.5">
            <span className="flex items-center gap-2 text-zinc-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Estado</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {isEnLimpieza ? 'En proceso' : habitacion.estado}
            </span>
          </div>
        </div>

        {/* Observaciones */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">
            Observaciones
          </label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={3}
            placeholder="Anotar detalles de reposición o requerimientos..."
            className="w-full bg-[#111a38] border border-[#1e293b] rounded-xl p-3 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="p-5 border-t border-[#1e293b] bg-[#0c142b]/95 backdrop-blur-md flex items-center gap-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onMarcarFinalizada(habitacion.id, observaciones)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
        >
          <CheckCircle className="w-4 h-4" />
          <span>{isSubmitting ? 'Finalizando...' : 'Marcar como finalizada'}</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenReasignarModal(habitacion)}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-blue-500/40 text-blue-400 hover:bg-blue-950/40 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
        >
          <User className="w-4 h-4" />
          <span>Reasignar</span>
        </button>
      </div>
    </div>
  );
}
