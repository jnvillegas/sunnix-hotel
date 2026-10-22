'use client';

import React from 'react';
import type { HotelGeneralConfig } from '@/types';
import { Building2, Mail, Phone, MapPin, Receipt, Coins, BedDouble } from 'lucide-react';

interface GeneralConfigTabProps {
  config: HotelGeneralConfig;
  onChange: (updated: Partial<HotelGeneralConfig>) => void;
}

export function GeneralConfigTab({ config, onChange }: GeneralConfigTabProps) {
  return (
    <div className="bg-[#0b1329] border border-[#1e293b] rounded-2xl p-6 shadow-xl space-y-6">
      <div className="border-b border-[#1e293b] pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-400" />
          <span>Información general y fiscal del establecimiento</span>
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Datos de cabecera utilizados en tickets de caja, comandas de bar y reportes oficiales.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Nombre Comercial */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Nombre comercial del hotel
          </label>
          <div className="relative">
            <input
              type="text"
              value={config.nombreHotel}
              onChange={(e) => onChange({ nombreHotel: e.target.value })}
              className="w-full bg-[#080d1d] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Razón Social */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Razón social (Sociedad / Titular)
          </label>
          <input
            type="text"
            value={config.razonSocial}
            onChange={(e) => onChange({ razonSocial: e.target.value })}
            className="w-full bg-[#080d1d] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* CUIT / Identificación Fiscal */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5 text-zinc-400" />
            <span>CUIT / Identificación fiscal</span>
          </label>
          <input
            type="text"
            value={config.cuit}
            onChange={(e) => onChange({ cuit: e.target.value })}
            className="w-full bg-[#080d1d] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            <span>Dirección física</span>
          </label>
          <input
            type="text"
            value={config.direccion}
            onChange={(e) => onChange({ direccion: e.target.value })}
            className="w-full bg-[#080d1d] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Teléfono / WhatsApp */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-zinc-400" />
            <span>Teléfono / Centralita de recepción</span>
          </label>
          <input
            type="text"
            value={config.telefono}
            onChange={(e) => onChange({ telefono: e.target.value })}
            className="w-full bg-[#080d1d] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Email Administración */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            <span>Email administrativo</span>
          </label>
          <input
            type="email"
            value={config.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="w-full bg-[#080d1d] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Moneda */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-zinc-400" />
            <span>Moneda de facturación</span>
          </label>
          <input
            type="text"
            value={config.moneda}
            onChange={(e) => onChange({ moneda: e.target.value })}
            className="w-full bg-[#080d1d] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Capacidad Suites */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
            <BedDouble className="w-3.5 h-3.5 text-zinc-400" />
            <span>Capacidad total de suites operativas</span>
          </label>
          <input
            type="number"
            min="1"
            value={config.capacidadSuites}
            onChange={(e) => onChange({ capacidadSuites: parseInt(e.target.value, 10) || 1 })}
            className="w-full bg-[#080d1d] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
