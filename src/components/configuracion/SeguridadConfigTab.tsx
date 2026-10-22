'use client';

import React from 'react';
import type { SeguridadCajaConfig } from '@/types';
import { ShieldCheck, Lock, EyeOff, FileText, AlertTriangle, Car } from 'lucide-react';

interface SeguridadConfigTabProps {
  config: SeguridadCajaConfig;
  onChange: (updated: Partial<SeguridadCajaConfig>) => void;
}

export function SeguridadConfigTab({ config, onChange }: SeguridadConfigTabProps) {
  return (
    <div className="bg-[#0b1329] border border-[#1e293b] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="border-b border-[#1e293b] pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <span>Políticas de caja, seguridad y anonimato</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Reglas antifraude, validación ciega de tesorería y garantías de privacidad para huéspedes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Arqueo Ciego */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Modo Arqueo Ciego estricto</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Oculta el saldo teórico del sistema al recepcionista durante el cierre de caja. El usuario debe contar físicamente los billetes y declarar el total sin saber la diferencia previa.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ modoArqueoCiego: !config.modoArqueoCiego })}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
              config.modoArqueoCiego ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                config.modoArqueoCiego ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Bloqueo Sin Caja */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Bloqueo operativo sin caja abierta</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Impide realizar Check-ins, ventas de bar o cobros si el operador no inició previamente su turno con el fondo de caja inicial.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ bloqueoSesionSinCaja: !config.bloqueoSesionSinCaja })}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
              config.bloqueoSesionSinCaja ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                config.bloqueoSesionSinCaja ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Anonimato Estricto */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <EyeOff className="w-4 h-4 text-purple-400" />
              <span>Anonimato estricto de huéspedes</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              No solicita DNI ni identidad personal al registrar Check-in. Asigna automáticamente la categoría legal de &quot;Consumidor Final&quot;.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ anonimatoHuespedEstricto: !config.anonimatoHuespedEstricto })}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
              config.anonimatoHuespedEstricto ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                config.anonimatoHuespedEstricto ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Patente Opcional */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Car className="w-4 h-4 text-blue-400" />
              <span>Captura vehicular opcional</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Permite registrar la patente sólo para control interno de cocheras privadas, sin obligatoriedad operativa.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ solicitarPatenteOpcional: !config.solicitarPatenteOpcional })}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
              config.solicitarPatenteOpcional ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                config.solicitarPatenteOpcional ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Auditoría Obligatoria */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Registro de auditoría inmutable</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Guarda en la base de datos cada cancelación, anulación de comanda o descuento manual con huella del usuario y timestamp.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({
                auditoriaModificacionesObligatoria: !config.auditoriaModificacionesObligatoria,
              })
            }
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
              config.auditoriaModificacionesObligatoria ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                config.auditoriaModificacionesObligatoria ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Margen Tolerancia Desvío */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] space-y-2">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Tolerancia de desvío de caja ($ ARS)</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Diferencia máxima permitida entre efectivo contado y teórico sin disparar alerta crítica a gerencia.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono">$</span>
            <input
              type="number"
              min="0"
              step="500"
              value={config.margenToleranciaDesvio}
              onChange={(e) =>
                onChange({ margenToleranciaDesvio: parseFloat(e.target.value) || 0 })
              }
              className="w-32 bg-[#0b1329] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
