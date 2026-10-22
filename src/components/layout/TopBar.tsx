'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, Bell, ChevronDown } from 'lucide-react';

interface TopBarProps {
  usuarioNombre?: string;
  usuarioRol?: string;
  searchPlaceholder?: string;
}

export function TopBar({
  usuarioNombre = 'María Gómez',
  usuarioRol = 'Administradora',
  searchPlaceholder = 'Buscar habitación...',
}: TopBarProps) {
  const [currentDateTime, setCurrentDateTime] = useState({
    fecha: '',
    hora: '',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Formato: Jueves 26 de septiembre
      const diaSemana = now.toLocaleDateString('es-AR', { weekday: 'long' });
      const diaNum = now.getDate();
      const mes = now.toLocaleDateString('es-AR', { month: 'long' });
      const fechaCap = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

      // Formato: 16:45
      const horaStr = now.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      setCurrentDateTime({
        fecha: `${fechaCap} ${diaNum} de ${mes}`,
        hora: horaStr,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const inicialAvatar = usuarioNombre ? usuarioNombre.charAt(0).toUpperCase() : 'M';

  return (
    <header className="h-16 bg-[#0c142b]/95 backdrop-blur-md border-b border-[#172242] px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Omnibox Search Bar */}
      <div className="relative w-72 sm:w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full bg-[#131d3d] border border-[#202f5c] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Right Controls: Date, Clock, Notifications & User Capsule */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Date & Time Capsule */}
        <div className="hidden md:flex items-center gap-3 text-xs font-mono text-zinc-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131d3d] border border-[#202f5c]">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span className="capitalize">{currentDateTime.fecha || 'Hoy'}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131d3d] border border-[#202f5c]">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-bold text-white">{currentDateTime.hora || '--:--'}</span>
          </div>
        </div>

        {/* Notifications Bell */}
        <button
          type="button"
          className="relative p-2 rounded-xl bg-[#131d3d] border border-[#202f5c] text-zinc-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Notificaciones del hotel"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5 ring-2 ring-[#0c142b]" />
        </button>

        {/* User Capsule */}
        <div className="flex items-center gap-3 pl-2 border-l border-[#1f2b52]">
          <div className="w-9 h-9 rounded-full bg-[#1d4ed8] text-white font-bold flex items-center justify-center text-sm shadow-md">
            {inicialAvatar}
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-xs font-bold text-white tracking-tight">{usuarioNombre}</p>
            <p className="text-[11px] text-zinc-400 font-mono">{usuarioRol}</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
