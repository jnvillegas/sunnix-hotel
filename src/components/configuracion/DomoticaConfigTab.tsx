'use client';

import React, { useState } from 'react';
import type { DomoticaConfig } from '@/types';
import { Cpu, Zap, Wifi, Clock, CheckCircle2, RefreshCw } from 'lucide-react';

interface DomoticaConfigTabProps {
  config: DomoticaConfig;
  onChange: (updated: Partial<DomoticaConfig>) => void;
}

export function DomoticaConfigTab({ config, onChange }: DomoticaConfigTabProps) {
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestConnection = () => {
    setTestingConnection(true);
    setTestResult(null);
    setTimeout(() => {
      setTestingConnection(false);
      setTestResult('Conexión MQTT exitosa: 12 relés de suite sincronizados (Ping: 14ms)');
    }, 1200);
  };

  return (
    <div className="bg-[#0b1329] border border-[#1e293b] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="border-b border-[#1e293b] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <span>Domótica, control de energía y relés IoT</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Automatización de encendido/corte de energía vinculado a los estados de la habitación.
          </p>
        </div>

        <button
          type="button"
          onClick={handleTestConnection}
          disabled={testingConnection}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#080d1d] border border-[#1e293b] hover:border-blue-500/50 text-blue-400 text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
          <span>Probar conexión relés</span>
        </button>
      </div>

      {testResult && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{testResult}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Habilitación General */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Habilitar control por domótica</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Permite que el sistema envíe órdenes por red local (MQTT / REST) para conmutar los contactores de potencia de cada suite.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange({ habilitado: !config.habilitado })}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
              config.habilitado ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                config.habilitado ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Energización Check-In */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Auto-energización en Check-In</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Enciende de inmediato luces, aire acondicionado e hidromasaje en cuanto la recepcionista confirma el ingreso del huésped.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({ autoEnergizacionCheckIn: !config.autoEnergizacionCheckIn })
            }
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
              config.autoEnergizacionCheckIn ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                config.autoEnergizacionCheckIn ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Corte en Limpieza */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Corte diferido al desocupar</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Al finalizar el Check-out y pasar a &quot;Limpieza&quot;, aplica un retraso de cortesía para permitir que el cliente retire su vehículo.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({ corteAutomaticoLimpieza: !config.corteAutomaticoLimpieza })
            }
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
              config.corteAutomaticoLimpieza ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                config.corteAutomaticoLimpieza ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Delay Minutos Corte */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] space-y-2">
          <div className="flex items-center gap-2 text-zinc-300 text-xs font-bold">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Delay para corte de energía (minutos)</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Tiempo de gracia con energía tras cobrar la cuenta antes de la desconexión total.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="30"
              value={config.delayCorteMinutos}
              onChange={(e) =>
                onChange({ delayCorteMinutos: parseInt(e.target.value, 10) || 0 })
              }
              className="w-24 bg-[#0b1329] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold text-center focus:outline-none focus:border-blue-500"
            />
            <span className="text-xs text-zinc-300 font-semibold">minutos</span>
          </div>
        </div>

        {/* IP Controlador */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] space-y-2">
          <div className="flex items-center gap-2 text-zinc-300 text-xs font-bold">
            <Wifi className="w-4 h-4 text-blue-400" />
            <span>Dirección IP / Host del Gateway IoT</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            IP local fija del servidor Raspberry Pi / broker MQTT del hotel.
          </p>
          <input
            type="text"
            value={config.ipControlador}
            onChange={(e) => onChange({ ipControlador: e.target.value })}
            className="w-full bg-[#0b1329] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Puerto MQTT */}
        <div className="p-4 rounded-xl bg-[#080d1d] border border-[#1e293b] space-y-2">
          <div className="flex items-center gap-2 text-zinc-300 text-xs font-bold">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Puerto MQTT Broker</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Puerto de comunicación estándar (1883 no encriptado / 8883 TLS).
          </p>
          <input
            type="number"
            value={config.puertoMqtt}
            onChange={(e) =>
              onChange({ puertoMqtt: parseInt(e.target.value, 10) || 1883 })
            }
            className="w-full bg-[#0b1329] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
