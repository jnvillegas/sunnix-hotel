import { getEstadoSesionOperativa } from '@/actions/caja';
import { getHabitacionesRack } from '@/actions/rack';
import { ExecutiveDashboardView } from '@/components/dashboard/ExecutiveDashboardView';
import { redirect } from 'next/navigation';

export default async function DashboardGeneralPage() {
  const session = await getEstadoSesionOperativa();

  if (!session) {
    redirect('/login');
  }

  const initialRooms = await getHabitacionesRack();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <ExecutiveDashboardView initialRooms={initialRooms} />
    </div>
  );
}
