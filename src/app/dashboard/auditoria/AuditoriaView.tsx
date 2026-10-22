'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  CircleAlert,
  Clock,
  Coins,
  FileSpreadsheet,
  FileText,
  Filter,
  History,
  Lock,
  Search,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import type { CierreCajaAuditoriaRow, LogAuditoria, Json } from '@/types';

interface AuditoriaViewProps {
  cajas: CierreCajaAuditoriaRow[];
  logs: LogAuditoria[];
  adminNombre: string;
}

export function AuditoriaView({ cajas, logs, adminNombre }: AuditoriaViewProps) {
  const [activeTab, setActiveTab] = useState<'cajas' | 'logs'>('cajas');
  const [logFilterAction, setLogFilterAction] = useState<string>('TODAS');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [selectedLogDetail, setSelectedLogDetail] = useState<LogAuditoria | null>(null);

  // KPIs de Cajas
  const totalCierres = cajas.filter((c) => c.estado === 'CERRADA').length;
  const cierresConDiscrepancia = cajas.filter(
    (c) => c.estado === 'CERRADA' && (c.diferencia_efectivo || 0) !== 0
  ).length;

  const sumaDiferencias = cajas.reduce(
    (sum, c) => sum + (c.diferencia_efectivo || 0),
    0
  );

  // Filtrado de logs
  const logsFiltrados = logs.filter((log) => {
    const matchesAction =
      logFilterAction === 'TODAS' || log.accion === logFilterAction;

    const query = logSearchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      log.accion.toLowerCase().includes(query) ||
      log.tabla_afectada.toLowerCase().includes(query) ||
      (log.registro_id && log.registro_id.toLowerCase().includes(query)) ||
      JSON.stringify(log.detalles || {}).toLowerCase().includes(query);

    return matchesAction && matchesSearch;
  });

  const uniqueActions = Array.from(new Set(logs.map((l) => l.accion)));

  return (
    <div className="space-y-6">
      {/* Header Command Center */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Volver al Rack"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h1 className="text-lg font-bold font-mono uppercase tracking-wider text-white">
                Módulo de Auditoría y Seguridad Financiera
              </h1>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Control gerencial de cierres de caja [CAJA-03/05] y bitácora de eventos inmutables
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] font-mono text-zinc-400 block">
              Auditor: {adminNombre}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/40 text-amber-300 font-bold uppercase">
              Acceso Exclusivo ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-zinc-400 uppercase">Total Cierres de Turno</p>
            <p className="text-2xl font-mono font-bold text-white mt-1">{totalCierres}</p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
            <History className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-zinc-400 uppercase">Cierres con Discrepancia</p>
            <p className="text-2xl font-mono font-bold text-amber-400 mt-1">
              {cierresConDiscrepancia}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-400">
            <CircleAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-zinc-400 uppercase">Neto Discrepancias Caja</p>
            <p
              className={`text-2xl font-mono font-bold mt-1 ${
                sumaDiferencias < 0
                  ? 'text-red-400'
                  : sumaDiferencias > 0
                  ? 'text-cyan-400'
                  : 'text-emerald-400'
              }`}
            >
              {sumaDiferencias === 0
                ? '$0'
                : `${sumaDiferencias > 0 ? '+' : ''}$${sumaDiferencias.toLocaleString('es-AR')}`}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
            {sumaDiferencias < 0 ? (
              <TrendingDown className="w-5 h-5 text-red-400" />
            ) : (
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#27272a]">
        <button
          type="button"
          onClick={() => setActiveTab('cajas')}
          className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'cajas'
              ? 'border-amber-500 text-amber-400 bg-amber-500/10'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Historial de Arqueos y Cierres ({cajas.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'logs'
              ? 'border-amber-500 text-amber-400 bg-amber-500/10'
              : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Bitácora de Auditoría Logs ({logs.length})</span>
        </button>
      </div>

      {/* TAB 1: HISTORIAL DE ARQUEOS Y CIERRES DE CAJA */}
      {activeTab === 'cajas' && (
        <div className="bg-[#121217] border border-[#27272a] rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                Detalle Histórico de Turnos y Diferencias de Efectivo
              </h2>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">
              Cálculo en backend: Declarado - Sistema
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Apertura / Cierre</th>
                  <th className="py-3 px-4">Cajero / Operador</th>
                  <th className="py-3 px-4 text-right">Monto Inicial</th>
                  <th className="py-3 px-4 text-right">Efectivo Sistema</th>
                  <th className="py-3 px-4 text-right">Efectivo Declarado</th>
                  <th className="py-3 px-4 text-right">Diferencia</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4">Observaciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {cajas.map((caja) => {
                  const dif = caja.diferencia_efectivo;
                  const tieneDiferencia = dif !== null && dif !== 0;
                  const esFaltante = tieneDiferencia && (dif || 0) < 0;
                  const esSobrante = tieneDiferencia && (dif || 0) > 0;

                  const horaApertura = new Date(caja.fecha_apertura).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  const horaCierre = caja.fecha_cierre
                    ? new Date(caja.fecha_cierre).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'En curso';

                  return (
                    <tr
                      key={caja.id}
                      className={`hover:bg-zinc-900/50 transition-colors ${
                        esFaltante ? 'bg-red-950/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-zinc-200">{horaCierre}</span>
                          <span className="text-[10px] text-zinc-500">
                            Apertura: {horaApertura}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="font-semibold text-zinc-200">
                            {caja.cajero_nombre}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap text-zinc-400">
                        ${caja.monto_inicial.toLocaleString('es-AR')}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap font-medium text-zinc-300">
                        {caja.monto_sistema_efectivo !== null
                          ? `$${caja.monto_sistema_efectivo.toLocaleString('es-AR')}`
                          : '--'}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap font-semibold text-zinc-100">
                        {caja.monto_declarado_efectivo !== null
                          ? `$${caja.monto_declarado_efectivo.toLocaleString('es-AR')}`
                          : '--'}
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {dif === null ? (
                          <span className="text-zinc-600">--</span>
                        ) : dif === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle className="w-3 h-3" />
                            $0 (Exacto)
                          </span>
                        ) : esFaltante ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-red-950/60 text-red-400 border border-red-500/50 shadow-sm shadow-red-950">
                            <TrendingDown className="w-3 h-3" />
                            -${Math.abs(dif).toLocaleString('es-AR')} (FALTANTE)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-cyan-950/40 text-cyan-400 border border-cyan-500/30">
                            <TrendingUp className="w-3 h-3" />
                            +${dif.toLocaleString('es-AR')} (Sobrante)
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                            caja.estado === 'CERRADA'
                              ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                              : 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/40 animate-pulse'
                          }`}
                        >
                          {caja.estado}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-xs text-zinc-400 max-w-xs truncate">
                        {caja.observaciones || '--'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BITÁCORA DE AUDITORÍA (LOGS INMUTABLES) */}
      {activeTab === 'logs' && (
        <div className="bg-[#121217] border border-[#27272a] rounded-xl overflow-hidden shadow-xl space-y-4 p-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2 flex-1 max-w-md bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5">
              <Search className="w-4 h-4 text-zinc-500 shrink-0" />
              <input
                type="text"
                placeholder="Buscar por acción, registro o detalles..."
                value={logSearchQuery}
                onChange={(e) => setLogSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs font-mono text-white focus:outline-none placeholder:text-zinc-600"
              />
              {logSearchQuery && (
                <button
                  type="button"
                  onClick={() => setLogSearchQuery('')}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={logFilterAction}
                onChange={(e) => setLogFilterAction(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-zinc-700"
              >
                <option value="TODAS">Todas las Acciones</option>
                {uniqueActions.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950/80 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Acción Registrada</th>
                  <th className="py-2.5 px-3">Tabla Afectada</th>
                  <th className="py-2.5 px-3">Registro ID</th>
                  <th className="py-2.5 px-3 text-center">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {logsFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      No se encontraron registros de auditoría coincidentes.
                    </td>
                  </tr>
                ) : (
                  logsFiltrados.map((log) => {
                    const timestamp = new Date(log.created_at).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    });

                    const esAlertaCritica =
                      log.accion.includes('DISCREPANCIA') ||
                      log.accion.includes('ANULACION') ||
                      log.accion.includes('CANCELADA');

                    return (
                      <tr key={log.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-2.5 px-3 whitespace-nowrap text-zinc-400">
                          {timestamp}
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              esAlertaCritica
                                ? 'bg-red-950/50 text-red-400 border border-red-500/40'
                                : 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                            }`}
                          >
                            {log.accion}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap text-zinc-400">
                          {log.tabla_afectada}
                        </td>

                        <td className="py-2.5 px-3 whitespace-nowrap text-zinc-500">
                          {log.registro_id || '--'}
                        </td>

                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setSelectedLogDetail(log)}
                            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer text-[11px]"
                          >
                            Inspeccionar JSON
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Visor de JSON de Log */}
      {selectedLogDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#121217] border border-zinc-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <h3 className="font-mono font-bold text-sm text-white uppercase">
                  Detalles del Log: {selectedLogDetail.accion}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLogDetail(null)}
                className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Registro ID:</span>
                <span className="text-zinc-200">{selectedLogDetail.registro_id || '--'}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Timestamp:</span>
                <span className="text-zinc-200">{selectedLogDetail.created_at}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Tabla:</span>
                <span className="text-zinc-200">{selectedLogDetail.tabla_afectada}</span>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-mono text-zinc-400 mb-1">Payload JSON Inmutable:</p>
              <pre className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-emerald-400 text-xs font-mono overflow-x-auto max-h-64">
                {JSON.stringify(selectedLogDetail.detalles, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLogDetail(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs uppercase"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
