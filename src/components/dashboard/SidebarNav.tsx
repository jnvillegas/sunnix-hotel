'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, ShieldCheck } from 'lucide-react';

interface SidebarNavProps {
  isAdmin: boolean;
}

export function SidebarNav({ isAdmin }: SidebarNavProps) {
  const pathname = usePathname();

  const isRackActive = pathname === '/dashboard';
  const isAuditoriaActive = pathname.startsWith('/dashboard/auditoria');

  return (
    <nav className="space-y-1.5 font-mono text-xs">
      <Link
        href="/dashboard"
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-semibold transition-all ${
          isRackActive
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-950/20'
            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
        }`}
      >
        <LayoutGrid className="w-4 h-4 shrink-0" />
        <span>Rack Operativo</span>
      </Link>

      {isAdmin && (
        <Link
          href="/dashboard/auditoria"
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-semibold transition-all ${
            isAuditoriaActive
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-950/20'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
          }`}
        >
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Auditoría Gerencial</span>
        </Link>
      )}
    </nav>
  );
}
