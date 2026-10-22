'use client';

import React, { useState, useTransition } from 'react';
import type { HotelConfiguracionData } from '@/types';
import { ConfiguracionHeroHeader } from './ConfiguracionHeroHeader';
import { ConfiguracionTabs, TabKey } from './ConfiguracionTabs';
import { GeneralConfigTab } from './GeneralConfigTab';
import { OperacionConfigTab } from './OperacionConfigTab';
import { TarifasConfigTab } from './TarifasConfigTab';
import { SeguridadConfigTab } from './SeguridadConfigTab';
import { DomoticaConfigTab } from './DomoticaConfigTab';
import { saveConfiguracionAction } from '@/actions/configuracion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ConfiguracionViewProps {
  initialConfig: HotelConfiguracionData;
}

export function ConfiguracionView({ initialConfig }: ConfiguracionViewProps) {
  const [config, setConfig] = useState<HotelConfiguracionData>(initialConfig);
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const handleUpdateGeneral = (updated: Partial<HotelConfiguracionData['general']>) => {
    setConfig((prev) => ({
      ...prev,
      general: { ...prev.general, ...updated },
    }));
    setHasChanges(true);
  };

  const handleUpdateOperacion = (updated: Partial<HotelConfiguracionData['operacion']>) => {
    setConfig((prev) => ({
      ...prev,
      operacion: { ...prev.operacion, ...updated },
    }));
    setHasChanges(true);
  };

  const handleUpdateTarifas = (updated: HotelConfiguracionData['tarifas']) => {
    setConfig((prev) => ({
      ...prev,
      tarifas: updated,
    }));
    setHasChanges(true);
  };

  const handleUpdateSeguridad = (updated: Partial<HotelConfiguracionData['seguridad']>) => {
    setConfig((prev) => ({
      ...prev,
      seguridad: { ...prev.seguridad, ...updated },
    }));
    setHasChanges(true);
  };

  const handleUpdateDomotica = (updated: Partial<HotelConfiguracionData['domotica']>) => {
    setConfig((prev) => ({
      ...prev,
      domotica: { ...prev.domotica, ...updated },
    }));
    setHasChanges(true);
  };

  const handleReset = () => {
    setConfig(initialConfig);
    setHasChanges(false);
    setFeedbackMsg(null);
  };

  const handleSave = () => {
    setFeedbackMsg(null);
    startTransition(async () => {
      const res = await saveConfiguracionAction(config);
      if (res.success) {
        setFeedbackMsg({
          type: 'success',
          text: 'Configuración guardada y sincronizada correctamente en el sistema.',
        });
        setHasChanges(false);
        setTimeout(() => setFeedbackMsg(null), 4000);
      } else {
        setFeedbackMsg({
          type: 'error',
          text: res.error || 'Ocurrió un error al guardar la configuración.',
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <ConfiguracionHeroHeader
        onSave={handleSave}
        onReset={handleReset}
        isSaving={isPending}
        hasChanges={hasChanges}
      />

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-semibold">{feedbackMsg.text}</span>
        </div>
      )}

      {/* Tabs Selector */}
      <ConfiguracionTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Panels */}
      {activeTab === 'general' && (
        <GeneralConfigTab config={config.general} onChange={handleUpdateGeneral} />
      )}

      {activeTab === 'operacion' && (
        <OperacionConfigTab config={config.operacion} onChange={handleUpdateOperacion} />
      )}

      {activeTab === 'tarifas' && (
        <TarifasConfigTab tarifas={config.tarifas} onChange={handleUpdateTarifas} />
      )}

      {activeTab === 'seguridad' && (
        <SeguridadConfigTab config={config.seguridad} onChange={handleUpdateSeguridad} />
      )}

      {activeTab === 'domotica' && (
        <DomoticaConfigTab config={config.domotica} onChange={handleUpdateDomotica} />
      )}
    </div>
  );
}
