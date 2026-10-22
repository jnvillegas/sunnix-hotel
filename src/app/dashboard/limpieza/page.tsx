import { getEstadoSesionOperativa } from '@/actions/caja';
import { getControlLimpiezaAction } from '@/actions/limpieza';
import { redirect } from 'next/navigation';
import { LimpiezaView } from '@/components/limpieza/LimpiezaView';

export default async function LimpiezaPage() {
  const session = await getEstadoSesionOperativa();

  if (!session) {
    redirect('/login');
  }

  const initialData = await getControlLimpiezaAction();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <LimpiezaView initialData={initialData} />
    </div>
  );
}
