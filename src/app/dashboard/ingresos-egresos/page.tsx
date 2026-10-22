import { getEstadoSesionOperativa } from '@/actions/caja';
import { getIngresosEgresosAction } from '@/actions/ingresosEgresos';
import { redirect } from 'next/navigation';
import { IngresosEgresosView } from '@/components/ingresosEgresos/IngresosEgresosView';

export default async function IngresosEgresosPage() {
  const session = await getEstadoSesionOperativa();

  if (!session) {
    redirect('/login');
  }

  const initialData = await getIngresosEgresosAction();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <IngresosEgresosView initialData={initialData} />
    </div>
  );
}
