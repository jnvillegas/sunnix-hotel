'use client';

import { useTransition } from 'react';
import { logoutAction } from '@/actions/auth';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      title="Cerrar Sesión Operativa"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-[#27272a] hover:border-red-500/50 hover:bg-red-950/20 text-zinc-400 hover:text-red-300 text-xs font-mono transition-colors disabled:opacity-50 cursor-pointer"
    >
      <LogOut className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-400" />
      <span>{isPending ? 'Saliendo...' : 'Salir'}</span>
    </button>
  );
}
