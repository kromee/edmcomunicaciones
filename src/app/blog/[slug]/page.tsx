import Link from 'next/link';

export default function BlogPostPlaceholder({ params }: { params: { slug: string } }) {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <p className="text-sm text-gray-500">Post: {params.slug}</p>
      <h1 className="mt-2 text-3xl font-bold">Título del artículo</h1>
      <p className="mt-4 text-gray-700">Contenido del artículo...</p>
      <section className="mt-12 border-t pt-8">
        <h2 className="text-xl font-semibold">Comentarios</h2>
        <p className="mt-2 text-gray-600">Debes <Link href="/login" className="text-brand">iniciar sesión</Link> para comentar.</p>
      </section>
    </main>
  );
}


