import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getWhatsAppLink } from '@/lib/config';

type ServiceLandingProps = {
  eyebrow: string;
  title: string;
  introduction: string;
  audience: string;
  benefits: { title: string; description: string }[];
  process: string[];
  project: { title: string; description: string; href: string };
  whatsappMessage: string;
  cta: string;
  quoteDetails: string[];
  faqs: { question: string; answer: string }[];
  coverage?: boolean;
};

export function ServiceLanding({
  eyebrow,
  title,
  introduction,
  audience,
  benefits,
  process,
  project,
  whatsappMessage,
  cta,
  quoteDetails,
  faqs,
  coverage = true,
}: ServiceLandingProps) {
  return (
    <>
      <Navbar />
      <main className="bg-white text-gray-800">
        <section className="bg-gradient-to-br from-sky-50 via-white to-blue-50 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="mb-5 text-sm font-bold uppercase tracking-widest text-accent">{eyebrow}</p>
            <h1 className="max-w-4xl text-4xl font-black leading-tight text-brand sm:text-6xl">{title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-gray-700">{introduction}</p>
            <p className="mt-4 max-w-3xl text-gray-600">{audience}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a className="btn-nexus-primary inline-flex items-center justify-center" href={getWhatsAppLink(whatsappMessage)} target="_blank" rel="noopener noreferrer">
                {cta}
              </a>
              <Link className="btn-nexus-secondary inline-flex items-center justify-center" href="/contacto">Ver otras formas de contacto</Link>
            </div>
            {coverage && <p className="mt-6 text-sm text-gray-600">Atención en CDMX, Estado de México, Puebla y Veracruz.</p>}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-brand">¿Qué necesitamos para tu cotización?</h2>
          <p className="mt-4 text-gray-600">Cuéntanos lo que sepas; podemos ayudarte a definir los detalles restantes.</p>
          <ul className="mt-6 list-disc space-y-3 pl-6 text-gray-700">
            {quoteDetails.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
          <h2 className="mt-16 text-3xl font-black text-brand">Preguntas frecuentes</h2>
          <div className="mt-6 space-y-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-xl border border-gray-200 bg-white p-5">
                <summary className="cursor-pointer font-semibold text-brand">{faq.question}</summary>
                <p className="mt-3 leading-relaxed text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-brand sm:text-4xl">¿En qué podemos ayudarte?</h2>
          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="rounded-2xl border border-gray-100 bg-white p-7 shadow-soft">
                <h3 className="text-xl font-bold text-brand">{benefit.title}</h3>
                <p className="mt-3 leading-relaxed text-gray-600">{benefit.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-brand sm:text-4xl">Cómo trabajamos</h2>
            <ol className="mt-8 grid gap-5 md:grid-cols-3">
              {process.map((step, index) => (
                <li key={step} className="rounded-2xl bg-white p-7 shadow-soft">
                  <span className="text-sm font-bold text-accent">0{index + 1}</span>
                  <p className="mt-3 text-gray-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-brand sm:text-4xl">Experiencia en proyectos reales</h2>
          <div className="mt-7 rounded-2xl border border-sky-100 bg-sky-50 p-8">
            <h3 className="text-xl font-bold text-brand">{project.title}</h3>
            <p className="mt-3 max-w-3xl leading-relaxed text-gray-700">{project.description}</p>
            <a className="mt-5 inline-block font-semibold text-accent underline underline-offset-4" href={project.href}>Ver este proyecto</a>
          </div>
          <div className="mt-12 rounded-2xl bg-brand p-8 text-white sm:p-10">
            <h2 className="text-2xl font-bold">Hablemos de lo que necesitas</h2>
            <p className="mt-3 max-w-2xl text-white/85">Cuéntanos el espacio, los equipos o el proceso que quieres resolver. Te ayudaremos a definir el siguiente paso.</p>
            <a className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 font-bold text-brand" href={getWhatsAppLink(whatsappMessage)} target="_blank" rel="noopener noreferrer">{cta}</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
