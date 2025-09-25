import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold">Ingresar</h1>
        <form className="mt-6 grid gap-4">
          <input className="w-full rounded-md border px-4 py-2" placeholder="Email" type="email" />
          <input className="w-full rounded-md border px-4 py-2" placeholder="Contraseña" type="password" />
          <button className="rounded-md bg-brand px-6 py-3 text-white hover:bg-brand-dark w-fit">Entrar</button>
        </form>
      </main>
      <Footer />
    </>
  );
}


