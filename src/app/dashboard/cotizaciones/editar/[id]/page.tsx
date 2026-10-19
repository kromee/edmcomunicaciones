import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

export default async function EditarCotizacionPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  redirect(`/cotizador?quoteId=${encodeURIComponent(params.id)}`);
}
