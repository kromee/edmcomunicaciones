"use client";
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useState } from 'react';
import { validateContactForm, type ContactFormData } from '@/lib/validation';

export default function ContactoPage() {
  const [form, setForm] = useState<ContactFormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = validateContactForm(form);
    setErrors(res.errors);
    if (res.valid) {
      setSent(true);
    }
  }
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold">Contacto</h1>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 max-w-xl">
          <div>
            <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-md border px-4 py-2" placeholder="Nombre" />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          <div>
            <input name="email" value={form.email} onChange={handleChange} className="w-full rounded-md border px-4 py-2" placeholder="Email" type="email" />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <textarea name="message" value={form.message} onChange={handleChange} className="w-full rounded-md border px-4 py-2" placeholder="Mensaje" rows={5} />
            {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
          </div>
          <button type="submit" className="rounded-md bg-brand px-6 py-3 text-white hover:bg-brand-dark w-fit">Enviar</button>
          {sent && <p className="text-sm text-green-700">Gracias, hemos recibido tu mensaje.</p>}
        </form>
      </main>
      <Footer />
    </>
  );
}


