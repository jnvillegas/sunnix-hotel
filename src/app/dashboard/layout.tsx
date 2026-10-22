import { getEstadoSesionOperativa } from '@/actions/caja';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getEstadoSesionOperativa();

  if (!session) {
    redirect('/login');
  }

  if (session.bloqueado_por_caja) {
    redirect('/caja/apertura');
  }

  const rolLabel =
    session.usuario.rol === 'ADMIN' ? 'Administradora' : 'Recepcionista';

  return (
    <div className="min-h-screen bg-[#0a0f1d] text-[#f4f4f5] flex font-sans">
      {/* 1. Left Sidebar Oficial (9 Módulos + Logo Neon) */}
      <Sidebar />

      {/* 2. Main Workspace (TopBar + Content) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* TopBar Global con Fecha/Hora viva, buscador y perfil */}
        <TopBar
          usuarioNombre={session.usuario.nombre_completo}
          usuarioRol={rolLabel}
        />

        {/* Workspace Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
