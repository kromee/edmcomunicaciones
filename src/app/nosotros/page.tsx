"use client";
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Reveal>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                  Quiénes Somos
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 text-xl sm:text-2xl text-sky-600 font-semibold">
                  Su Empresa de Tecnología que <span className="text-blue-600">Sí Cumple</span>
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                  En EDM Comunicaciones, somos una empresa joven, sí, pero estamos respaldados por más de 
                  <span className="font-semibold text-blue-600"> 10 años de experiencia</span> resolviendo problemas de tecnología y telecomunicaciones.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Nuestra Historia */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <Reveal>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                    Nuestra Historia
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p className="text-lg">
                      Para nosotros, la juventud solo significa <span className="font-semibold text-blue-600">más energía para innovar</span>.
                    </p>
                    <p>
                      Todo empezó con un emprendedor que notó algo simple: muchas empresas necesitan que su tecnología 
                      <span className="font-semibold text-green-600"> simplemente funcione</span>. Por eso, nos dedicamos a entregar soluciones completas:
                    </p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-sky-500 rounded-2xl transform rotate-3"></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-xl">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Instalamos la "columna vertebral"</h3>
                          <p className="text-gray-600">Cableado estructurado y redes sin caídas</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Nos ocupamos de su seguridad</h3>
                          <p className="text-gray-600">CCTV para tranquilidad total en su negocio</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Aseguramos su conectividad</h3>
                          <p className="text-gray-600">Equipos y configuración para comunicación fluida</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Desarrollamos software a tu medida</h3>
                          <p className="text-gray-600">Desde el análisis hasta la implementación</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Nuestros Valores */}
        <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Nuestra Base Son Los Valores
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Los principios que nos permiten dormir tranquilos y que nos guían en cada proyecto
                </p>
              </div>
            </Reveal>
            <div className="grid gap-8 md:grid-cols-3">
              <Reveal>
                <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-sky-500/5 rounded-2xl"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Responsabilidad</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Tomamos cada proyecto muy en serio. Lo que prometemos, lo cumplimos. 
                      <span className="font-semibold text-blue-600"> Su confianza es lo más importante</span>.
                    </p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-2xl"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Innovación</h3>
                    <p className="text-gray-600 leading-relaxed">
                      El mundo tecnológico cambia rápido. Nosotros nos adaptamos por usted para que siempre tenga 
                      <span className="font-semibold text-green-600"> la mejor solución</span>.
                    </p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 rounded-2xl"></div>
                  <div className="relative">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Compromiso</h3>
                    <p className="text-gray-600 leading-relaxed">
                      No buscamos solo instalar; buscamos que nuestras soluciones le den 
                      <span className="font-semibold text-purple-600"> resultados reales y duraderos</span>.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Nuestra Promesa */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Reveal>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
                  Nuestra Promesa
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="max-w-4xl mx-auto">
                  <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-3xl p-8 md:p-12 border border-blue-100">
                    <div className="space-y-6 text-lg text-gray-700">
                      <p>
                        En EDM Comunicaciones, <span className="font-semibold text-blue-600">no hablamos en códigos</span>. 
                        Le ofrecemos un servicio cercano, claro y confiable.
                      </p>
                      <p>
                        Queremos que la tecnología no le cause dolores de cabeza, sino que sea 
                        <span className="font-semibold text-green-600"> la herramienta que lo impulse a crecer</span>.
                      </p>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href="https://wa.me/525530358478?text=Hola,%20quisiera%20conocer%20m%C3%A1s%20sobre%20EDM%20Comunicaciones"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-3 text-white shadow-lg transition hover:shadow-xl active:scale-95 font-semibold"
                      >
                        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
                          <path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/>
                          <path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38zM17.75 27.1c-2.22 0-4.39-.6-6.28-1.73l-.45-.27-5.07 1.33 1.35-4.94-.3-.51c-1.21-2.02-1.85-4.34-1.85-6.77 0-7.31 5.95-13.26 13.26-13.26 3.54 0 6.86 1.38 9.36 3.89 2.49 2.5 3.87 5.82 3.87 9.36 0 7.31-5.95 13.26-13.26 13.26z"/>
                        </svg>
                        Conoce más sobre nosotros
                      </a>
                      <a
                        href="mailto:edm_comunicaciones@hotmail.com?subject=Informaci%C3%B3n%20sobre%20EDM%20Comunicaciones&body=Hola,%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20servicios."
                        className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-blue-600 px-8 py-3 text-blue-600 transition hover:bg-blue-600 hover:text-white font-semibold"
                      >
                        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        Escríbenos
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
