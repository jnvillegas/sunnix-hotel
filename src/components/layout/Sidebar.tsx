'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BedDouble,
  Calendar,
  Wallet,
  ArrowUpDown,
  Sparkles,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { SunnixLogo } from './SunnixLogo';
import { logoutAction } from '@/actions/auth';
import { useTransition } from 'react';

export function Sidebar() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      label: 'Habitaciones',
      href: '/dashboard/habitaciones',
      icon: BedDouble,
      active: pathname.startsWith('/dashboard/habitaciones'),
    },
    {
      label: 'Turnos y reservas',
      href: '/dashboard/turnos',
      icon: Calendar,
      active: pathname.startsWith('/dashboard/turnos'),
    },
    {
      label: 'Caja por turno',
      href: '/dashboard/caja',
      icon: Wallet,
      active: pathname.startsWith('/dashboard/caja') || pathname.startsWith('/caja'),
    },
    {
      label: 'Ingresos y egresos',
      href: '/dashboard/ingresos-egresos',
      icon: ArrowUpDown,
      active: pathname.startsWith('/dashboard/ingresos-egresos'),
    },
    {
      label: 'Limpieza',
      href: '/dashboard/limpieza',
      icon: Sparkles,
      active: pathname.startsWith('/dashboard/limpieza'),
    },
    {
      label: 'Personal',
      href: '/dashboard/personal',
      icon: Users,
      active: pathname.startsWith('/dashboard/personal'),
    },
    {
      label: 'Reportes',
      href: '/dashboard/reportes',
      icon: BarChart3,
      active: pathname.startsWith('/dashboard/reportes'),
    },
    {
      label: 'Configuración',
      href: '/dashboard/configuracion',
      icon: Settings,
      active: pathname.startsWith('/dashboard/configuracion'),
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#0b1329] text-zinc-300 h-screen sticky top-0 flex flex-col justify-between p-5 border-r border-[#172242] z-40 select-none">
      {/* Top: Logo & Nav List */}
      <div className="space-y-7">
        {/* Brand Header */}
        <Link href="/dashboard" className="block px-1">
          <SunnixLogo size="md" />
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-1.5 font-sans">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1d4ed8] text-white font-semibold shadow-lg shadow-blue-900/30'
                    : 'text-zinc-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Logout Button */}
      <div className="pt-4 border-t border-[#172242]">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-red-300 hover:bg-red-950/20 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-zinc-400 group-hover:text-red-400" />
          <span>{isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}</span>
        </button>
      </div>
    </aside>
  );
}
