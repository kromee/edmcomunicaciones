import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import { Reveal } from '@/components/Reveal';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <p className="text-sm font-semibold text-brand">Plataforma digital</p>
                <Reveal>
                  <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight">Conectividad, Seguridad y Control a tu Alcance</h1>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="mt-4 text-lg text-gray-600">Impulsamos tu negocio con soluciones tecnológicas en cableado estructurado, videovigilancia, control de asistencia y redes inteligentes.</p>
                </Reveal>
                <Reveal delay={0.16}>
                  <p className="mt-3 text-gray-600">Diseñamos, instalamos y configuramos la tecnología que tu empresa necesita para crecer y mantenerse siempre conectada, segura y competitiva.</p>
                </Reveal>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a
                    href="https://wa.me/525530358478?text=Hola%20EDM%20Comunicaciones,%20quisiera%20solicitar%20una%20cotizaci%C3%B3n%20para%20..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-center text-white shadow-md transition hover:shadow-lg hover:from-sky-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400/50 active:scale-95"
                  >
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 32 32" fill="currentColor"><path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/><path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38zM17.75 27.1c-2.22 0-4.39-.6-6.28-1.73l-.45-.27-5.07 1.33 1.35-4.94-.3-.51c-1.21-2.02-1.85-4.34-1.85-6.77 0-7.31 5.95-13.26 13.26-13.26 3.54 0 6.86 1.38 9.36 3.89 2.49 2.5 3.87 5.82 3.87 9.36 0 7.31-5.95 13.26-13.26 13.26z"/></svg>
                    Solicita una cotización
                  </a>
                  <a
                    href="mailto:ventas@edmcomunicaciones.com?subject=Contacto&body=Hola%20EDM%20Comunicaciones,%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios."
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-center text-[#0f1e48] shadow-md transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand/50"
                  >
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    Escribenos
                  </a>
                </div>
              </div>
              <Reveal delay={0.24}>
                <div className="relative aspect-[4/3] sm:aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="/home_edm1.png"
                    alt="EDM Comunicaciones — imagen principal"
                    fill
                    className="w-full h-full object-contain object-center"
                    priority
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
        {/* Sección: Nuestras capacidades tecnológicas */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight">NUESTRAS CAPACIDADES TECNOLÓGICAS</h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-3 text-center text-lg text-gray-700">Conectividad, Seguridad y Automatización para tu Empresa</p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 text-gray-600 max-w-3xl mx-auto text-center">
              Impulsa tu operación con soluciones tecnológicas diseñadas a la medida.
              Somos especialistas en:
              </p>
            </Reveal>
            <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Reveal>
                <div className="group rounded-xl border bg-white overflow-hidden shadow-sm transition duration-300 hover:shadow-xl hover:-translate-y-0.5">
                  <div className="bg-[rgb(255_255_255)] flex items-center justify-center">
                    <Image
                      src="/redes-home.png"
                      alt="Redes confiables y rápidas"
                      width={320}
                      height={200}
                      priority={false}
                      className="w-full h-auto max-h-36 sm:max-h-40 object-contain mx-auto p-4 sm:p-5"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✔</span>
                      <div>
                        <p className="font-semibold">Redes confiables y rápidas</p>
                        <p className="text-sm text-gray-600">Cableado estructurado de alto rendimiento.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <div className="group rounded-xl border bg-white overflow-hidden shadow-sm transition duration-300 hover:shadow-xl hover:-translate-y-0.5">
                  <div className="bg-[rgb(255_255_255)] flex items-center justify-center">
                    <Image
                      src="/seguridad-home.png"
                      alt="Seguridad 24/7"
                      width={320}
                      height={200}
                      className="w-full h-auto max-h-36 sm:max-h-40 object-contain mx-auto p-4 sm:p-5"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✔</span>
                      <div>
                        <p className="font-semibold">Seguridad 24/7</p>
                        <p className="text-sm text-gray-600">Cámaras de vigilancia y sistemas de CCTV.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="group rounded-xl border bg-white overflow-hidden shadow-sm transition duration-300 hover:shadow-xl hover:-translate-y-0.5">
                  <div className="bg-[rgb(255_255_255)] flex items-center justify-center">
                    <Image
                      src="/control-home.png"
                      alt="Control inteligente"
                      width={320}
                      height={200}
                      className="w-full h-auto max-h-36 sm:max-h-40 object-contain mx-auto p-4 sm:p-5"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✔</span>
                      <div>
                        <p className="font-semibold">Control inteligente</p>
                        <p className="text-sm text-gray-600">Checadores biométricos para asistencia.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
          
              {/* <Reveal delay={0.1}>
                <div className="group rounded-xl border bg-white overflow-hidden shadow-sm transition duration-300 hover:shadow-xl hover:-translate-y-0.5">
                  <div className="bg-[rgb(255_255_255)] flex items-center justify-center">
                    <Image
                      src="/soporte-home.png"
                      alt="Soporte experto"
                      width={320}
                      height={200}
                      className="w-full h-auto max-h-36 sm:max-h-40 object-contain mx-auto p-4 sm:p-5"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✔</span>
                      <div>
                        <p className="font-semibold">Soporte experto</p>
                        <p className="text-sm text-gray-600">Configuración y mantenimiento de redes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal> */}
           
              <Reveal delay={0.1}>
                <div className="group rounded-xl border bg-white overflow-hidden shadow-sm transition duration-300 hover:shadow-xl hover:-translate-y-0.5">
                  <div className="bg-[rgb(255_255_255)] flex items-center justify-center">
                    <Image
                      src="/software-home.png"
                      alt="Software a la medida"
                      width={320}
                      height={200}
                      className="w-full h-auto max-h-36 sm:max-h-40 object-contain mx-auto p-4 sm:p-5"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✔</span>
                      <div>
                        <p className="font-semibold">Software</p>
                        <p className="text-sm text-gray-600">Desarrollo de software a la medida</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        
          </div>
        </section>


        {/* Sección: Quiénes nos respaldan */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-center text-xl sm:text-2xl font-semibold tracking-tight">Quiénes nos respaldan</h2>
            <p className="mt-2 text-center text-gray-600">Empresas que confían en nuestras soluciones</p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 items-center">
              <Reveal>
                <Image src="/partners/tony.webp" alt="Partner 1" width={140} height={48} className="mx-auto h-10 w-auto object-contain opacity-80 hover:opacity-100 transition duration-300 ease-out hover:scale-[1.03]" />
              </Reveal>
              <Reveal delay={0.05}>
                <Image src="/partners/repsol.png" alt="Partner 2" width={140} height={48} className="mx-auto h-10 w-auto object-contain opacity-80 hover:opacity-100 transition duration-300 ease-out hover:scale-[1.03]" />
              </Reveal>
              <Reveal delay={0.1}>
                <Image src="/partners/logo1.png" alt="Partner 3" width={140} height={48} className="mx-auto h-10 w-auto object-contain opacity-80 hover:opacity-100 transition duration-300 ease-out hover:scale-[1.03]" />
              </Reveal>
              <Reveal delay={0.15}>
                <Image src="/partners/logo2.jpg" alt="Partner 4" width={140} height={48} className="mx-auto h-10 w-auto object-contain opacity-80 hover:opacity-100 transition duration-300 ease-out hover:scale-[1.03]" />
              </Reveal>
              <Reveal delay={0.2}>
                <Image src="/partners/logo3.jpg" alt="Partner 5" width={140} height={48} className="mx-auto h-10 w-auto object-contain opacity-80 hover:opacity-100 transition duration-300 ease-out hover:scale-[1.03]" />
              </Reveal>
              <Reveal delay={0.25}>
                <Image src="/partners/logo4.png" alt="Partner 6" width={140} height={48} className="mx-auto h-10 w-auto object-contain opacity-80 hover:opacity-100 transition duration-300 ease-out hover:scale-[1.03]" />
              </Reveal>
            </div>
          </div>
        </section>


      </main>
      <Footer />
    </>
  );
}


