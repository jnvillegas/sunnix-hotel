'use client';

import React from 'react';
import { Save, CheckCircle2, Loader2, RotateCcw } from 'lucide-react';

interface ConfiguracionHeroHeaderProps {
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
  hasChanges: boolean;
}

export function ConfiguracionHeroHeader({
  onSave,
  onReset,
  isSaving,
  hasChanges,
}: ConfiguracionHeroHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Configuración del sistema
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Parámetros globales del establecimiento, motor de tarifas, reglas operativas y domótica.
        </p>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        {hasChanges && (
          <button
            type="button"
            onClick={onReset}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0c142b] border border-[#1e293b] hover:border-slate-600 text-zinc-400 hover:text-white font-medium text-xs sm:text-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-blue-900/30 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Guardar configuración</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
