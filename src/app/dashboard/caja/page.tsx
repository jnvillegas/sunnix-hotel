import { getEstadoSesionOperativa } from '@/actions/caja';
import { getCajaPorTurnoAction } from '@/actions/cajaTurno';
import { redirect } from 'next/navigation';
import { CajaTurnoView } from '@/components/cajaTurno/CajaTurnoView';

export default async function CajaDashboardPage() {
  const session = await getEstadoSesionOperativa();

  if (!session) {
    redirect('/login');
  }

  const initialData = await getCajaPorTurnoAction();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <CajaTurnoView initialData={initialData} />
    </div>
  );
}
