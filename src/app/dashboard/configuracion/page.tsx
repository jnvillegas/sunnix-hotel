import { getEstadoSesionOperativa } from '@/actions/caja';
import { getConfiguracionAction } from '@/actions/configuracion';
import { redirect } from 'next/navigation';
import { ConfiguracionView } from '@/components/configuracion/ConfiguracionView';

export default async function ConfiguracionPage() {
  const session = await getEstadoSesionOperativa();

  if (!session) {
    redirect('/login');
  }

  const initialConfig = await getConfiguracionAction();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <ConfiguracionView initialConfig={initialConfig} />
    </div>
  );
}
