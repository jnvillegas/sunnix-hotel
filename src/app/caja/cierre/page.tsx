import { getEstadoSesionOperativa } from '@/actions/caja';
import { redirect } from 'next/navigation';
import { CierreCajaForm } from './CierreCajaForm';

export default async function CierreCajaPage() {
  const session = await getEstadoSesionOperativa();

  // Si no está autenticado, redirigir a login
  if (!session) {
    redirect('/login');
  }

  // Si no tiene una caja abierta, no puede cerrar caja: redirigir a apertura
  if (!session.caja_activa || session.caja_activa.estado !== 'ABIERTA') {
    redirect('/caja/apertura');
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] p-4 sm:p-6 lg:p-8">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <CierreCajaForm
          cajaSesionId={session.caja_activa.id}
          cajeroNombre={session.usuario.nombre_completo}
          rol={session.usuario.rol}
          fechaApertura={session.caja_activa.fecha_apertura}
        />
      </div>
    </div>
  );
}
