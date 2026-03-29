"use client";
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';

function NetworkBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 hex-pattern opacity-100" />
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-20 left-[5%] w-40 h-40 border border-accent/10 rounded-full animate-spin-slow" />
      <div className="absolute bottom-1/4 right-[10%] w-32 h-32 border border-brand/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
      <div className="absolute top-1/3 right-[15%] w-3 h-3 bg-accent/50 rounded-full animate-pulse-dot" />
      <div className="absolute bottom-1/3 left-[25%] w-2 h-2 bg-brand/50 rounded-full animate-pulse-dot delay-300" />
    </div>
  );
}

interface Value {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  accent: string;
}

const values: Value[] = [
  {
    title: 'Responsabilidad',
    description: 'Tomamos cada proyecto muy en serio. Lo que prometemos, lo cumplimos. Su confianza es lo más importante para nosotros.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    gradient: 'from-blue-500 to-blue-600',
    accent: 'text-blue-600'
  },
  {
    title: 'Innovación',
    description: 'El mundo tecnológico cambia rápido. Nosotros nos adaptamos para que siempre tenga la mejor solución.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    gradient: 'from-emerald-500 to-emerald-600',
    accent: 'text-emerald-600'
  },
  {
    title: 'Compromiso',
    description: 'No buscamos solo instalar; buscamos que nuestras soluciones le den resultados reales y duraderos.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    gradient: 'from-purple-500 to-purple-600',
    accent: 'text-purple-600'
  },
  {
    title: 'Profesionalismo',
    description: 'Entregamos trabajo de calidad con certificación profesional y documentación completa.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    gradient: 'from-orange-500 to-orange-600',
    accent: 'text-orange-600'
  }
];

interface Pillar {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const pillars: Pillar[] = [
  {
    title: 'Instalamos la "columna vertebral"',
    description: 'Cableado estructurado y redes sin caídas',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'text-blue-500'
  },
  {
    title: 'Nos ocupamos de su seguridad',
    description: 'CCTV para tranquilidad total en su negocio',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'text-green-500'
  },
  {
    title: 'Aseguramos su conectividad',
    description: 'Equipos y configuración para comunicación fluida',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'text-purple-500'
  },
  {
    title: 'Desarrollamos software a tu medida',
    description: 'Desde el análisis hasta la implementación',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: 'text-orange-500'
  }
];

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <div className="nexus-bg">
          <NetworkBackground />
          
          {/* Hero Section */}
          <section className="relative pt-24 pb-20 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-4xl mx-auto">
                <Reveal>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold text-sm mb-6">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Sobre Nosotros
                  </span>
                </Reveal>
                <Reveal delay={0.08}>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                    <span className="text-gradient-brand">Quiénes</span>
                    <br />
                    <span className="text-brand">Somos</span>
                  </h1>
                </Reveal>
                <Reveal delay={0.16}>
                  <p className="mt-8 text-2xl sm:text-3xl font-semibold">
                    <span className="text-gradient-accent">Su Empresa de Tecnología que</span>
                    <br />
                    <span className="text-brand">Sí Cumple</span>
                  </p>
                </Reveal>
                <Reveal delay={0.24}>
                  <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Somos una empresa joven, sí, pero estamos respaldados por más de{' '}
                    <span className="font-bold text-brand">12 años de experiencia</span> resolviendo problemas de tecnología y telecomunicaciones.
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Historia Section */}
          <section className="py-20 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <Reveal>
                  <div>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/5 border border-brand/10 text-brand font-semibold text-sm mb-6">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Nuestra Historia
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                      <span className="text-gradient-brand">Más Energía</span>
                      <br />
                      <span className="text-brand">para Innovar</span>
                    </h2>
                    <p className="mt-6 text-lg text-gray-600 leading-relaxed">
                      Todo empezó con un emprendedor que notó algo simple: muchas empresas necesitan que su tecnología{' '}
                      <span className="font-semibold text-accent">simplemente funcione</span>.
                    </p>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                      Por eso, nos dedicamos a entregar soluciones completas que conectan, protegen y potencian negocios.
                    </p>
                  </div>
                </Reveal>
                
                <Reveal delay={0.1}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-brand/20 rounded-3xl blur-3xl" />
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-nexus-lg border border-gray-100">
                      <div className="grid grid-cols-2 gap-4">
                        {pillars.map((pillar, index) => (
                          <div key={index} className="bg-gray-50 rounded-2xl p-5 hover:bg-accent/5 transition-colors group">
                            <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform ${pillar.color}`}>
                              {pillar.icon}
                            </div>
                            <h3 className="text-sm font-bold text-brand mb-1">{pillar.title}</h3>
                            <p className="text-xs text-gray-600">{pillar.description}</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-gradient-to-r from-brand to-accent rounded-xl text-white">
                        <p className="text-center font-semibold text-sm">Tecnología que funciona, relaciones que perduran</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Valores Section */}
          <section className="py-20 relative bg-gradient-to-b from-gray-50/50 to-transparent">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/5 border border-brand/10 text-brand font-semibold text-sm mb-6">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Nuestros Valores
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                    <span className="text-gradient-brand">La Base de</span>
                    <br />
                    <span className="text-brand">Nuestro Trabajo</span>
                  </h2>
                  <p className="mt-6 text-xl text-gray-600">
                    Los principios que nos permiten dormir tranquilos y que nos guían en cada proyecto
                  </p>
                </div>
              </Reveal>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {values.map((value, index) => (
                  <Reveal key={value.title} delay={index * 0.1}>
                    <div className="card-nexus rounded-2xl p-6 h-full hover:shadow-nexus transition-all duration-500 group">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {value.icon}
                      </div>
                      <h3 className={`text-xl font-bold ${value.accent} mb-3`}>{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Estadísticas Section */}
          <section className="py-20 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-brand via-brand/95 to-brand/90 rounded-3xl p-10 lg:p-16 relative overflow-hidden">
                <div className="absolute inset-0 hex-pattern opacity-10" />
                <div className="relative">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <Reveal>
                      <div className="text-center">
                        <div className="text-5xl lg:text-6xl font-black text-white mb-2">12+</div>
                        <p className="text-white/70 font-medium">Años de experiencia</p>
                      </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                      <div className="text-center">
                        <div className="text-5xl lg:text-6xl font-black text-white mb-2">150+</div>
                        <p className="text-white/70 font-medium">Proyectos completados</p>
                      </div>
                    </Reveal>
                    <Reveal delay={0.2}>
                      <div className="text-center">
                        <div className="text-5xl lg:text-6xl font-black text-white mb-2">50+</div>
                        <p className="text-white/70 font-medium">Clientes satisfechos</p>
                      </div>
                    </Reveal>
                    <Reveal delay={0.3}>
                      <div className="text-center">
                        <div className="text-5xl lg:text-6xl font-black text-white mb-2">24/7</div>
                        <p className="text-white/70 font-medium">Soporte disponible</p>
                      </div>
                    </Reveal>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Promesa Section */}
          <section className="py-20 relative">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <div className="card-nexus rounded-3xl p-10 lg:p-16 text-center hover:shadow-nexus transition-all duration-500">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold text-sm mb-8">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Nuestra Promesa
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-6">
                    <span className="text-gradient-brand">No Hablamos</span>
                    <br />
                    <span className="text-brand">en Códigos</span>
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                    Le ofrecemos un servicio cercano, claro y confiable. Queremos que la tecnología no le cause dolores de cabeza, sino que sea{' '}
                    <span className="font-semibold text-accent">la herramienta que lo impulse a crecer</span>.
                  </p>
                  <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="https://wa.me/+525550317183?text=Hola%20EDM%20Comunicaciones,%20quisiera%20conocer%20m%C3%A1s%20sobre%20sus%20servicios"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-nexus-primary inline-flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
                        <path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/>
                        <path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38z"/>
                      </svg>
                      Conoce más sobre nosotros
                    </a>
                    <a
                      href="mailto:edm_comunicaciones@hotmail.com?subject=Informaci%C3%B3n%20sobre%20EDM%20Comunicaciones&body=Hola,%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20servicios."
                      className="btn-nexus-secondary inline-flex items-center justify-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Escríbenos
                    </a>
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
