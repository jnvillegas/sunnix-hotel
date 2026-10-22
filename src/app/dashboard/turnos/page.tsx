import { getEstadoSesionOperativa } from '@/actions/caja';
import { getTurnosReservasAction } from '@/actions/turnos';
import { redirect } from 'next/navigation';
import { TurnosView } from '@/components/turnos/TurnosView';

export default async function TurnosDashboardPage() {
  const session = await getEstadoSesionOperativa();

  if (!session) {
    redirect('/login');
  }

  const initialData = await getTurnosReservasAction();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <TurnosView initialData={initialData} />
    </div>
  );
}
