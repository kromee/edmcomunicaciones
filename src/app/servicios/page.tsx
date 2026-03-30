import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import Image from 'next/image';

function NetworkBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 hex-pattern opacity-100" />
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-20 left-[15%] w-32 h-32 border border-accent/10 rounded-full animate-spin-slow" />
      <div className="absolute bottom-1/4 right-[10%] w-40 h-40 border border-brand/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
      <div className="absolute top-1/3 right-[20%] w-3 h-3 bg-accent/50 rounded-full animate-pulse-dot" />
      <div className="absolute bottom-1/3 left-[30%] w-2 h-2 bg-brand/50 rounded-full animate-pulse-dot delay-300" />
    </div>
  );
}

function ServiceCard({ icon, title, description, color, number, delay }: { icon: React.ReactNode; title: string; description: string; color: string; number: string; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <a href={`#${title.toLowerCase().replace(/\s+/g, '-').replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')}`} className="group block h-full">
        <div className="relative h-full bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-1">
          <div className={`h-1 w-full bg-gradient-to-r ${color}`} />
          <div className="p-7">
            <div className="flex items-start justify-between mb-5">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg transform group-hover:scale-105 transition-transform duration-500`}>
                <div className="text-white">{icon}</div>
              </div>
              <span className="text-4xl font-black text-gray-100 opacity-50">{number}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand transition-colors">{title}</h3>
            <div className="w-12 h-0.5 bg-gradient-to-r from-accent to-transparent mb-4 transform origin-left group-hover:w-20 transition-all duration-500" />
            <p className="text-gray-600 text-sm leading-relaxed mb-5">{description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Ver más detalles</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${color} transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300`}>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
          <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
        </div>
      </a>
    </Reveal>
  );
}

function BenefitItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="flex-shrink-0 mt-1 w-12 h-12 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function CTAButton({ href, children, primary = true }: { href: string; children: React.ReactNode; primary?: boolean }) {
  if (primary) {
    return (
      <a href={href} className="btn-nexus-primary inline-flex items-center justify-center gap-2">
        {children}
      </a>
    );
  }
  return (
    <a href={href} className="btn-nexus-secondary inline-flex items-center justify-center gap-2">
      {children}
    </a>
  );
}

export default function ServiciosPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <div className="nexus-bg">
          <NetworkBackground />
          
          <section className="relative pt-24 pb-20 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <div className="text-center max-w-4xl mx-auto">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold text-sm mb-6">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Soluciones para tu Negocio
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                    <span className="text-gradient-brand">Tecnología que</span>
                    <br />
                    <span className="text-brand">Funciona Para Ti</span>
                  </h1>
                  <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Más de 12 años ayudando a empresas a crecer con tecnología simple, confiable y efectiva.
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          <section className="py-16 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
                <ServiceCard
                  icon={
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                    </svg>
                  }
                  title="Videovigilancia"
                  description="Protege lo que más te importa con cámaras modernas que puedes ver desde tu celular."
                  color="from-red-500 to-rose-600"
                  number="01"
                  delay={0}
                />
                <ServiceCard
                  icon={
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6 6h.01M6 12h.01M6 18h.01" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  }
                  title="Redes y Cableado"
                  description="Internet rápido y sin cortes. La base de cualquier negocio moderno."
                  color="from-blue-500 to-cyan-600"
                  number="02"
                  delay={0.05}
                />
                <ServiceCard
                  icon={
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  title="Mantenimiento"
                  description="Tu tecnología siempre funcionando. Prevén problemas antes de que ocurran."
                  color="from-amber-500 to-orange-600"
                  number="03"
                  delay={0.1}
                />
                <ServiceCard
                  icon={
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  title="Control de Acceso"
                  description="Saber quién entra y sale. Control de asistencia sin complicaciones."
                  color="from-purple-500 to-violet-600"
                  number="04"
                  delay={0.15}
                />
                <ServiceCard
                  icon={
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  title="Software"
                  description="Sistemas que se adaptan a tu negocio, no al revés. Hechos a tu medida."
                  color="from-indigo-500 to-blue-600"
                  number="05"
                  delay={0.2}
                />
              </div>
            </div>
          </section>

          {/* CCTV Section */}
          <section id="cctv" className="py-24 relative scroll-mt-20">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div>
                  <Reveal>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 font-semibold text-sm mb-6">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Videovigilancia
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                      <span className="text-gradient-brand">Tranquilidad</span>
                      <br />
                      <span className="text-brand">para tu Negocio</span>
                    </h2>
                    <p className="mt-4 text-lg text-accent font-medium">Las 24 horas, los 365 días</p>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="mt-6 text-gray-600 leading-relaxed text-lg">
                      Protege tu negocio, empleados y mercancía con sistemas de videovigilancia modernos que puedes revisar en cualquier momento desde tu celular.
                    </p>
                  </Reveal>
                  <Reveal delay={0.15}>
                    <div className="mt-8 space-y-6">
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                        title="Cámaras con imagen clara"
                        description="De día y de noche. Para que no pierdas ningún detalle importante."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                        title="Ves todo desde tu celular"
                        description="Estés donde estés, puedes ver tus cámaras en tiempo real."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
                        title="Alertas en tu teléfono"
                        description="Recibe notificaciones cuando haya movimiento sospechoso."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>}
                        title="Videos guardados"
                        description="Tus grabaciones quedan almacenadas para cuando las necesites."
                      />
                    </div>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                      <CTAButton href="https://wa.me/+525550317183?text=Hola,%20me%20interesa%20un%20sistema%20de%20cámaras%20para%20mi%20negocio">
                        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor"><path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/><path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38z"/></svg>
                        Solicitar Instalación
                      </CTAButton>
                      <CTAButton href="mailto:edm_comunicaciones@hotmail.com?subject=Información%20sobre%20cámaras" primary={false}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Solicitar Información
                      </CTAButton>
                    </div>
                  </Reveal>
                </div>
                <Reveal delay={0.2}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-accent/20 rounded-3xl blur-3xl" />
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-nexus-lg border border-gray-100">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                        <Image src="/ccvt.png" alt="Sistema de videovigilancia" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between text-white text-sm">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                              <span>Monitoreo activo</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="px-2 py-1 bg-white/20 rounded text-xs">HD</span>
                              <span className="px-2 py-1 bg-white/20 rounded text-xs">4K</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-red-500">16</div>
                          <div className="text-xs text-gray-600">Cámaras</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-green-500">4K</div>
                          <div className="text-xs text-gray-600">Calidad</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-blue-500">30</div>
                          <div className="text-xs text-gray-600">Días de respaldo</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Cableado Section */}
          <section id="cableado" className="py-24 relative scroll-mt-20 bg-gradient-to-b from-gray-50/50 to-transparent">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div>
                  <Reveal>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 font-semibold text-sm mb-6">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Cableado Estructurado
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                      <span className="text-gradient-brand">Conexión rápida,</span>
                      <br />
                      <span className="text-brand">estable y lista para crecer</span>
                    </h2>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="mt-6 text-gray-600 leading-relaxed text-lg">
                      Diseñamos e instalamos redes de cableado para que tu internet, sistemas y equipos funcionen sin fallas, de forma rápida y segura.
                    </p>
                  </Reveal>
                  <Reveal delay={0.15}>
                    <div className="mt-8 space-y-5">
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        title="Instalación profesional"
                        description="Organizamos todo el cableado de tu negocio para que sea seguro, limpio y fácil de mantener."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}
                        title="Red rápida y estable"
                        description="Preparamos tu infraestructura para soportar alta velocidad, evitando caídas y lentitud."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                        title="Preparado para crecer"
                        description="Tu red quedará lista para agregar más equipos, cámaras o sistemas sin problemas."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                        title="Conexiones seguras"
                        description="Reducimos interferencias y fallas para que tu operación no se detenga."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                        title="Pruebas y garantía"
                        description="Verificamos que todo funcione correctamente y te entregamos respaldo de calidad."
                      />
                    </div>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <div className="mt-8 p-5 bg-gradient-to-r from-blue-500/10 to-accent/10 rounded-xl border border-blue-500/20">
                      <h4 className="font-bold text-gray-900 mb-2">¿Para quién es ideal?</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Oficinas</span>
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Negocios en crecimiento</span>
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Empresas con muchos equipos</span>
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Lugares con cámaras</span>
                      </div>
                    </div>
                  </Reveal>
                  <Reveal delay={0.25}>
                    <div className="mt-6 p-5 bg-green-50 rounded-xl border border-green-200">
                      <h4 className="font-bold text-gray-900 mb-3">Beneficios reales</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Internet más rápido y estable
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Menos fallas y desconexiones
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Mejor rendimiento de sistemas
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Instalación ordenada y profesional
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Inversión a largo plazo
                        </li>
                      </ul>
                    </div>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                      <CTAButton href="https://wa.me/+525550317183?text=Hola,%20me%20interesa%20instalar%20cableado%20estructurado%20en%20mi%20negocio">
                        Solicitar Instalación
                      </CTAButton>
                      <CTAButton href="mailto:edm_comunicaciones@hotmail.com?subject=Información%20cableado%20estructurado" primary={false}>
                        Solicitar Información
                      </CTAButton>
                    </div>
                  </Reveal>
                </div>
                <Reveal delay={0.2}>
                  <div className="relative order-2 lg:order-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-accent/20 rounded-3xl blur-3xl" />
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-nexus-lg border border-gray-100">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                          <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <div className="text-3xl font-black">Rápida</div>
                          <div className="text-sm opacity-80">Sin esperas</div>
                        </div>
                        <div className="bg-gradient-to-br from-accent to-blue-500 rounded-2xl p-6 text-white">
                          <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-3xl font-black">24/7</div>
                          <div className="text-sm opacity-80">Siempre activa</div>
                        </div>
                        <div className="col-span-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-4xl font-black">25 Años</div>
                              <div className="text-sm opacity-80">de garantía en instalación</div>
                            </div>
                            <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                        <Image src="/cable_estructurado.png" alt="Cableado estructurado" fill className="object-cover" />
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Mantenimiento Section */}
          <section id="mantenimiento" className="py-24 relative scroll-mt-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div>
                  <Reveal>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 font-semibold text-sm mb-6">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Soporte Técnico
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                      <span className="text-gradient-brand">Mantén tu negocio</span>
                      <br />
                      <span className="text-brand">funcionando sin interrupciones</span>
                    </h2>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="mt-6 text-gray-600 leading-relaxed text-lg">
                      Nos encargamos del mantenimiento y soporte de tus equipos para evitar fallas, mejorar su rendimiento y asegurar que tu operación nunca se detenga.
                    </p>
                  </Reveal>
                  <Reveal delay={0.15}>
                    <div className="mt-8 space-y-5">
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                        title="Mantenimiento de computadoras y servidores"
                        description="Revisamos, limpiamos y optimizamos tus equipos para que trabajen más rápido y sin problemas."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M9.17 4.21a5.5 5.5 0 017.78 7.78L12 16.9l-4.81-4.81a5.5 5.5 0 01-7.78-7.78L5 7.12l4.17-2.91z" /><path d="M12 20.5l-7-7 1.41-1.41L12 17.67l5.59-5.58L19 11l-7 9.5z" /></svg>}
                        title="Revisión de aire acondicionado"
                        description="Mantenemos en buen estado los equipos que protegen tus sistemas, evitando sobrecalentamientos."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>}
                        title="Soporte a equipos de oficina"
                        description="Atendemos impresoras, escáneres, proyectores y otros dispositivos que usas día a día."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        title="Respaldo eléctrico"
                        description="Revisamos UPS y reguladores para proteger tus equipos ante fallas de energía."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        title="Planes de mantenimiento"
                        description="Ofrecemos soporte continuo para que no tengas que preocuparte por fallas inesperadas."
                      />
                    </div>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <div className="mt-8 p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
                      <h4 className="font-bold text-gray-900 mb-2">¿Para quién es ideal?</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Oficinas</span>
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Negocios con sistemas</span>
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Empresas sin pausas</span>
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Soporte confiable</span>
                      </div>
                    </div>
                  </Reveal>
                  <Reveal delay={0.25}>
                    <div className="mt-6 p-5 bg-green-50 rounded-xl border border-green-200">
                      <h4 className="font-bold text-gray-900 mb-3">Beneficios reales</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Evita fallas inesperadas
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Equipos más rápidos y eficientes
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Menos interrupciones en tu negocio
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Ahorro en reparaciones costosas
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Soporte confiable cuando lo necesitas
                        </li>
                      </ul>
                    </div>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                      <CTAButton href="https://wa.me/+525550317183?text=Hola,%20me%20interesa%20soporte%20técnico%20para%20mi%20negocio">
                        Solicitar Soporte
                      </CTAButton>
                      <CTAButton href="mailto:edm_comunicaciones@hotmail.com?subject=Información%20soporte%20técnico" primary={false}>
                        Solicitar Información
                      </CTAButton>
                    </div>
                  </Reveal>
                </div>
                <Reveal delay={0.2}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-3xl blur-3xl" />
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-nexus-lg border border-gray-100">
                      <div className="relative aspect-[4/3]">
                        <Image src="/mantenimiento-service.png" alt="Mantenimiento de equipos" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="flex items-center gap-4 text-white">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="font-semibold">Sin interrupciones</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <span className="font-semibold">24/7 Disponible</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Instalación Section */}
          <section id="instalacion" className="py-24 relative scroll-mt-20 bg-gradient-to-b from-gray-50/50 to-transparent">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div>
                  <Reveal>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 font-semibold text-sm mb-6">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Equipamiento
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                      <span className="text-gradient-brand">Te entregamos</span>
                      <br />
                      <span className="text-brand">todo listo para funcionar</span>
                    </h2>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="mt-6 text-gray-600 leading-relaxed text-lg">
                      Te ayudamos a elegir, instalar y configurar todo el equipo que tu negocio necesita, dejándolo listo para usarse desde el primer día.
                    </p>
                  </Reveal>
                  <Reveal delay={0.15}>
                    <div className="mt-8 space-y-5">
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                        title="Venta de equipos confiables"
                        description="Te recomendamos y proporcionamos equipos de calidad según las necesidades de tu negocio."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        title="Instalación completa"
                        description="Nos encargamos de dejar todo funcionando correctamente, sin que tengas que preocuparte por configuraciones."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>}
                        title="Wi-Fi empresarial"
                        description="Instalamos redes inalámbricas rápidas y estables para cubrir todo tu negocio sin zonas sin señal."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                        title="Control de asistencia"
                        description="Implementamos checadores biométricos (huella o reconocimiento facial) para controlar entradas y salidas de personal."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}
                        title="Conexión entre sucursales"
                        description="Conectamos diferentes ubicaciones de tu negocio para que trabajen como si estuvieran en el mismo lugar."
                      />
                    </div>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <div className="mt-8 p-5 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl border border-purple-500/20">
                      <h4 className="font-bold text-gray-900 mb-2">¿Para quién es ideal?</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Oficinas</span>
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Empresas con sucursales</span>
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Negocios en crecimiento</span>
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Modernización</span>
                      </div>
                    </div>
                  </Reveal>
                  <Reveal delay={0.25}>
                    <div className="mt-6 p-5 bg-green-50 rounded-xl border border-green-200">
                      <h4 className="font-bold text-gray-900 mb-3">Beneficios reales</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Todo funcionando desde el primer día
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Ahorro de tiempo y complicaciones
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Equipos adecuados para tu negocio
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Red estable y segura
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Soporte y acompañamiento
                        </li>
                      </ul>
                    </div>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                      <CTAButton href="https://wa.me/+525550317183?text=Hola,%20me%20interesa%20una%20cotización%20para%20equipamiento">
                        Solicitar Cotización
                      </CTAButton>
                      <CTAButton href="mailto:edm_comunicaciones@hotmail.com?subject=Información%20equipamiento" primary={false}>
                        Solicitar Información
                      </CTAButton>
                    </div>
                  </Reveal>
                </div>
                <Reveal delay={0.2}>
                  <div className="relative order-2 lg:order-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-3xl blur-3xl" />
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-nexus-lg border border-gray-100">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                        <Image src="/instalacion-service.png" alt="Instalación de equipos" fill className="object-cover" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-purple-50 rounded-xl p-3 text-center">
                          <svg className="w-6 h-6 text-purple-500 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <div className="text-xs text-gray-600">Biométricos</div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-3 text-center">
                          <svg className="w-6 h-6 text-blue-500 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                          </svg>
                          <div className="text-xs text-gray-600">Wi-Fi</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-3 text-center">
                          <svg className="w-6 h-6 text-green-500 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <div className="text-xs text-gray-600">Enlaces</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Software Section */}
          <section id="software" className="py-24 relative scroll-mt-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div>
                  <Reveal>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 font-semibold text-sm mb-6">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Desarrollo a Medida
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                      <span className="text-gradient-brand">Sistemas hechos</span>
                      <br />
                      <span className="text-brand">exactamente para tu negocio</span>
                    </h2>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="mt-6 text-gray-600 leading-relaxed text-lg">
                      Creamos sistemas y aplicaciones personalizadas que se adaptan a tu forma de trabajar, ayudándote a automatizar procesos, ahorrar tiempo y tener mayor control de tu negocio.
                    </p>
                  </Reveal>
                  <Reveal delay={0.15}>
                    <div className="mt-8 space-y-5">
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                        title="Sistemas administrativos"
                        description="Desarrollamos sistemas para controlar ventas, inventarios, clientes y operaciones desde un solo lugar."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                        title="Aplicaciones móviles"
                        description="Creamos apps para que puedas operar tu negocio o recibir pedidos desde el celular."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
                        title="Integración con equipos y sistemas"
                        description="Conectamos tu software con dispositivos como lectores, biométricos o terminales, así como con otros sistemas que ya uses."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                        title="Reportes y control en tiempo real"
                        description="Visualiza información importante de tu negocio al instante para tomar mejores decisiones."
                      />
                      <BenefitItem
                        icon={<svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>}
                        title="Acceso desde cualquier lugar"
                        description="Tus sistemas estarán disponibles en línea para que puedas acceder cuando lo necesites."
                      />
                    </div>
                  </Reveal>
                  <Reveal delay={0.2}>
                    <div className="mt-8 p-5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                      <h4 className="font-bold text-gray-900 mb-2">¿Para quién es ideal?</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Digitalización</span>
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Excel o procesos manuales</span>
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Ventas e inventario</span>
                        <span className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm">Soluciones específicas</span>
                      </div>
                    </div>
                  </Reveal>
                  <Reveal delay={0.25}>
                    <div className="mt-6 p-5 bg-green-50 rounded-xl border border-green-200">
                      <h4 className="font-bold text-gray-900 mb-3">Beneficios reales</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Automatiza procesos y ahorra tiempo
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Reduce errores manuales
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Control total de tu negocio
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Información en tiempo real
                        </li>
                        <li className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Soluciones hechas a tu medida
                        </li>
                      </ul>
                    </div>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <div className="mt-10">
                      <p className="text-lg font-semibold text-brand mb-4">Lleva tu negocio al siguiente nivel</p>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <CTAButton href="https://wa.me/+525550317183?text=Hola,%20me%20interesa%20desarrollar%20un%20sistema%20para%20mi%20negocio">
                          Solicitar Desarrollo
                        </CTAButton>
                        <CTAButton href="mailto:edm_comunicaciones@hotmail.com?subject=Información%20desarrollo%20de%20software" primary={false}>
                          Solicitar Información
                        </CTAButton>
                      </div>
                    </div>
                  </Reveal>
                </div>
                <Reveal delay={0.2}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-nexus-lg border border-gray-100">
                      <div className="relative aspect-[4/3]">
                        <Image src="/software-service.png" alt="Desarrollo de software" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            </div>
                            <p className="font-bold">Control total de tu negocio</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                  ¿Hablamos de tu proyecto?
                </h2>
              </Reveal>
              
              <Reveal delay={0.1}>
                <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
                  Cuéntanos qué necesitas y te ayudamos a encontrar la mejor solución para tu negocio.
                </p>
              </Reveal>
              
              <Reveal delay={0.2}>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://wa.me/+525550317183?text=Hola%20EDM%20Comunicaciones,%20me%20gustaría%20hablar%20de%20un%20proyecto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-brand font-bold rounded-xl hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
                      <path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/>
                      <path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38z"/>
                    </svg>
                    Chatear por WhatsApp
                  </a>
                  <a
                    href="mailto:edm_comunicaciones@hotmail.com?subject=Hablemos%20de%20mi%20proyecto"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Enviar Correo
                  </a>
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
