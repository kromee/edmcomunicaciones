import { getWhatsAppLink, getEmailLink } from '@/lib/config';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import { Reveal } from '@/components/Reveal';
import Link from 'next/link';

function CableIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
      <circle cx="8" cy="6" r="1" fill="currentColor" />
      <circle cx="16" cy="12" r="1" fill="currentColor" />
      <circle cx="8" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function SecurityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L4 6v6c0 5.25 3.4 10.15 8 11.25 4.6-1.1 8-6 8-11.25V6l-8-4z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SoftwareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h4" strokeLinecap="round" />
    </svg>
  );
}

function ConnectionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <path d="M8 6h8M8 18h8M6 8v8M18 8v8" strokeDasharray="2 2" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <div className="min-h-screen bg-white">
          
          <section className="relative bg-slate-50/80 border-b border-slate-200 py-10 sm:py-14 lg:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-2 lg:gap-14 items-center">
              <div>
                <p className="text-sm font-semibold text-sky-800 mb-5">Tecnología para comercios, empresas y hogares</p>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.12] tracking-tight text-brand">
                  CCTV y redes.<br />
                  Software a medida.<br />
                  <span className="text-sky-700">Soluciones para ti.</span>
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-slate-600 max-w-xl">
                  Instalamos cámaras de seguridad, conectamos tus espacios y desarrollamos software para los procesos de tu negocio.
                </p>
                <div className="mt-7 flex flex-col sm:flex-row flex-wrap gap-3">
                  <a href={getWhatsAppLink('Hola EDM Comunicaciones, me gustaría cotizar un proyecto.')} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3.5 text-white font-semibold hover:bg-sky-900 transition-colors">
                    Cotizar por WhatsApp <span aria-hidden="true" className="ml-3">→</span>
                  </a>
                  <Link href="/proyectos" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-brand font-semibold hover:bg-slate-100 transition-colors">
                    Ver proyectos
                  </Link>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-slate-600 max-w-md">
                  Instalaciones en CDMX, Estado de México, Puebla y Veracruz.
                </p>
              </div>
              <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative aspect-[4/3]">
                  <Image src="/proyectos/estructurado_2.JPG" alt="Racks y cableado organizado de una instalación de red de EDM Comunicaciones" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[center_42%]" />
                </div>
                <figcaption className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-sky-800 mb-1">Nuestro trabajo</p>
                    <p className="font-semibold text-brand">Infraestructura de red y cableado</p>
                  </div>
                  <Link href="/galeria" aria-label="Ver galería de proyectos" className="shrink-0 rounded-full border border-slate-300 h-11 w-11 inline-flex items-center justify-center text-brand hover:bg-slate-100"><span aria-hidden="true">↗</span></Link>
                </figcaption>
              </figure>
            </div>
          </section>

          {/* Stats Section */}
          <section className="relative py-16 border-y border-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <Reveal>
                  <div className="text-center">
                    <div className="stat-number">12+</div>
                    <p className="mt-2 text-gray-600 font-medium">Años de experiencia</p>
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <div className="text-center">
                    <div className="stat-number">150+</div>
                    <p className="mt-2 text-gray-600 font-medium">Proyectos completados</p>
                  </div>
                </Reveal>
                <Reveal delay={0.2}>
                  <div className="text-center">
                    <div className="stat-number">50+</div>
                    <p className="mt-2 text-gray-600 font-medium">Clientes satisfechos</p>
                  </div>
                </Reveal>
                <Reveal delay={0.3}>
                  <div className="text-center">
                    <div className="stat-number">24/7</div>
                    <p className="mt-2 text-gray-600 font-medium">Soporte disponible</p>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Capabilities Section */}
          <section className="py-24 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/5 border border-brand/10 text-brand font-semibold text-sm mb-6">
                    <ConnectionIcon className="w-4 h-4" />
                    Nuestras capacidades
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                    <span className="text-gradient-brand">Soluciones</span> que{' '}
                    <span className="text-brand">transforman</span>
                  </h2>
                  <p className="mt-6 text-xl text-gray-600">
                    Conoce nuestros servicios principales y encuentra el que responde a tu necesidad.
                  </p>
                </div>
              </Reveal>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <Reveal>
                  <Link href="/servicios/redes-y-cableado" className="card-nexus block rounded-2xl p-8 group">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center shadow-lg shadow-accent/20">
                        <CableIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-brand mb-3">Redes y cableado estructurado</h3>
                    <p className="text-gray-600 mb-4">
                      Diseño e instalación de redes de cableado categoría 5e, 6 y 6A con certificación profesional.
                    </p>
                    <div className="flex items-center text-accent font-semibold text-sm">
                      <span>Ver más</span>
                      <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </Link>
                </Reveal>

                <Reveal delay={0.1}>
                  <Link href="/servicios/cctv" className="card-nexus block rounded-2xl p-8 group">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-brand/80 flex items-center justify-center shadow-lg shadow-brand/20">
                        <SecurityIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-brand mb-3">Videovigilancia CCTV</h3>
                    <p className="text-gray-600 mb-4">
                      Sistemas de cámaras IP, analítica de video y monitoreo remoto 24/7 para tu tranquilidad.
                    </p>
                    <div className="flex items-center text-accent font-semibold text-sm">
                      <span>Ver más</span>
                      <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </Link>
                </Reveal>

                <Reveal delay={0.2}>
                  <Link href="/servicios#instalacion" className="card-nexus block rounded-2xl p-8 group">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/80 to-accent flex items-center justify-center shadow-lg shadow-accent/20">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="16" r="1" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-brand mb-3">Control biométrico</h3>
                    <p className="text-gray-600 mb-4">
                      Checadores de asistencia con huella digital, facial y tarjeta para control eficiente.
                    </p>
                    <div className="flex items-center text-accent font-semibold text-sm">
                      <span>Ver más</span>
                      <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </Link>
                </Reveal>

                <Reveal delay={0.3}>
                  <Link href="/servicios/desarrollo-software-a-medida" className="card-nexus block rounded-2xl p-8 group">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-brand/90 to-brand flex items-center justify-center shadow-lg shadow-brand/20">
                        <SoftwareIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-brand mb-3">Desarrollo de software a medida</h3>
                    <p className="text-gray-600 mb-4">
                      Sistemas a medida, apps móviles, ERP/CRM personalizados que se adaptan a tu negocio.
                    </p>
                    <div className="flex items-center text-accent font-semibold text-sm">
                      <span>Ver más</span>
                      <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </Link>
                </Reveal>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand/95 to-brand/90" />
            <div className="absolute inset-0 hex-pattern opacity-10" />
            
            <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/90 text-sm font-medium">Respuesta en menos de 24 horas</span>
                </div>
              </Reveal>
              
              <Reveal delay={0.1}>
                <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                  ¿Listo para conectar tu negocio con el futuro?
                </h2>
              </Reveal>
              
              <Reveal delay={0.2}>
                <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
                  Agenda una consulta gratuita y descubre cómo podemos transformar 
                  tu infraestructura tecnológica con soluciones a la medida.
                </p>
              </Reveal>
              
              <Reveal delay={0.3}>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={getWhatsAppLink('Hola EDM Comunicaciones, quisiera solicitar una cotización para ...')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-brand font-bold rounded-xl hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
                      <path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/>
                      <path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38z"/>
                    </svg>
                    Contactar por WhatsApp
                  </a>
                  <a
                    href="/contacto"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Formulario de contacto
                  </a>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Partners Section */}
          <section className="py-20 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <div className="text-center mb-12">
                  <h3 className="text-2xl font-bold text-brand">Empresas que confían en nosotros</h3>
                  <p className="mt-2 text-gray-600">Más de 50 organizaciones nos respaldan</p>
                </div>
              </Reveal>
              
              <Reveal delay={0.1}>
                <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-brand/5 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Image 
                      src="/partners/netra.png" 
                      alt="Netra" 
                      width={140} 
                      height={48} 
                      className="relative h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110 grayscale hover:grayscale-0" 
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-brand/5 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Image 
                      src="/partners/novaprint.png" 
                      alt="Novaprint" 
                      width={140} 
                      height={48} 
                      className="relative h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110 grayscale hover:grayscale-0" 
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-brand/5 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Image 
                      src="/partners/ballotini-panamericana.png" 
                      alt="Ballotini Panamericana (Potters)" 
                      width={180} 
                      height={48} 
                      className="relative h-12 w-auto max-w-44 object-contain opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110 grayscale hover:grayscale-0" 
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-brand/5 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Image 
                      src="/partners/silicatos.png" 
                      alt="Silicatos y Derivados S.A. de C.V." 
                      width={220} 
                      height={48} 
                      className="relative h-12 w-auto max-w-56 object-contain opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110 grayscale hover:grayscale-0" 
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-brand/5 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Image 
                      src="/partners/kenworth.png" 
                      alt="Kenworth" 
                      width={140} 
                      height={48} 
                      className="relative h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110 grayscale hover:grayscale-0" 
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
