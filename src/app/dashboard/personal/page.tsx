import { getEstadoSesionOperativa } from '@/actions/caja';
import { getAsistenciaPersonalAction } from '@/actions/personal';
import { redirect } from 'next/navigation';
import { PersonalView } from '@/components/personal/PersonalView';

export default async function PersonalPage() {
  const session = await getEstadoSesionOperativa();

  if (!session) {
    redirect('/login');
  }

  const initialData = await getAsistenciaPersonalAction();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PersonalView initialData={initialData} />
    </div>
  );
}
