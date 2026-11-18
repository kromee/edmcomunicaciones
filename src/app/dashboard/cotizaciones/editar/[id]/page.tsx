import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

export default async function EditarCotizacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  redirect(`/cotizador?quoteId=${encodeURIComponent(id)}`);
}
