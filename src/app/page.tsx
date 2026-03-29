import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import { Reveal } from '@/components/Reveal';

function NetworkBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 hex-pattern opacity-100" />
      <div className="absolute inset-0 grid-pattern" />
      
      <svg className="absolute w-full h-full opacity-[0.07]" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="1" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <line x1="0" y1="150" x2="1200" y2="150" stroke="url(#lineGradient)" strokeWidth="1" className="animate-data-flow" />
        <line x1="0" y1="300" x2="1200" y2="300" stroke="url(#lineGradient)" strokeWidth="1" style={{ animationDelay: '0.5s' }} />
        <line x1="0" y1="450" x2="1200" y2="450" stroke="url(#lineGradient)" strokeWidth="1" style={{ animationDelay: '1s' }} />
        
        <line x1="200" y1="0" x2="200" y2="600" stroke="url(#lineGradient)" strokeWidth="1" style={{ animationDelay: '0.3s' }} />
        <line x1="600" y1="0" x2="600" y2="600" stroke="url(#lineGradient)" strokeWidth="1" style={{ animationDelay: '0.8s' }} />
        <line x1="1000" y1="0" x2="1000" y2="600" stroke="url(#lineGradient)" strokeWidth="1" style={{ animationDelay: '1.3s' }} />
      </svg>
      
      <div className="absolute top-20 left-[10%] w-3 h-3 bg-accent rounded-full animate-pulse-dot" />
      <div className="absolute top-40 left-[25%] w-2 h-2 bg-brand rounded-full animate-pulse-dot delay-200" />
      <div className="absolute top-60 left-[45%] w-4 h-4 bg-accent/50 rounded-full animate-pulse-dot delay-300" />
      <div className="absolute bottom-40 right-[15%] w-3 h-3 bg-brand/70 rounded-full animate-pulse-dot delay-400" />
      <div className="absolute top-32 right-[30%] w-2 h-2 bg-accent rounded-full animate-pulse-dot delay-500" />
      <div className="absolute bottom-60 right-[45%] w-3 h-3 bg-brand/50 rounded-full animate-pulse-dot delay-100" />
      
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-accent/10 rounded-full animate-spin-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 border border-brand/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
    </div>
  );
}

function NodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="4" r="1.5" />
      <circle cx="12" cy="20" r="1.5" />
      <circle cx="4" cy="12" r="1.5" />
      <circle cx="20" cy="12" r="1.5" />
      <line x1="12" y1="7" x2="12" y2="9" />
      <line x1="12" y1="15" x2="12" y2="17" />
      <line x1="7" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="17" y2="12" />
    </svg>
  );
}

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

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
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
        <div className="nexus-bg min-h-screen">
          <NetworkBackground />
          
          {/* Hero Section */}
          <section className="relative pt-20 pb-32 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 items-center min-h-[70vh]">
                <div className="relative z-10">
                  <Reveal>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <span className="text-sm font-medium text-accent">Soluciones Tecnológicas Integrales</span>
                    </div>
                  </Reveal>
                  
                  <Reveal delay={0.08}>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight">
                      <span className="text-gradient-brand">Conectando</span>
                      <br />
                      <span className="text-brand">Futuros,</span>
                      <br />
                      <span className="text-gradient-accent">Protegiendo</span>
                      <br />
                      <span className="text-brand">Negocios</span>
                    </h1>
                  </Reveal>
                  
                  <Reveal delay={0.16}>
                    <p className="mt-8 text-xl text-gray-600 leading-relaxed max-w-xl">
                      Infraestructura tecnológica de clase empresarial: 
                      <span className="text-brand font-semibold"> cableado estructurado, videovigilancia, 
                      control biométrico y desarrollo de software</span> que impulsa tu negocio hacia el futuro.
                    </p>
                  </Reveal>
                  
                  <Reveal delay={0.24}>
                    <p className="mt-4 text-lg text-gray-500 max-w-xl">
                      Más de una década transformando la manera en que las empresas se comunican, 
                      se protegen y operan con tecnología de vanguardia.
                    </p>
                  </Reveal>
                  
                  <Reveal delay={0.32}>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                      <a
                        href="https://wa.me/+525550317183?text=Hola%20EDM%20Comunicaciones,%20quisiera%20solicitar%20una%20cotizaci%C3%B3n%20para%20..."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-nexus-primary inline-flex items-center justify-center gap-3 group"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
                          <path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/>
                          <path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38z"/>
                        </svg>
                        Solicitar Cotización
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                      <a
                        href="mailto:edm_comunicaciones@hotmail.com?subject=Contacto&body=Hola%20EDM%20Comunicaciones,%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios."
                        className="btn-nexus-secondary inline-flex items-center justify-center gap-3 group"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Escríbenos
                      </a>
                    </div>
                  </Reveal>
                </div>
                
                <Reveal delay={0.2}>
                  <div className="relative">
                    <div className="relative aspect-square max-w-lg mx-auto">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-brand/20 rounded-3xl blur-3xl animate-pulse-glow" />
                      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-nexus-lg border border-accent/10">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-3 aspect-video bg-gradient-to-br from-brand to-brand/80 rounded-2xl p-6 flex items-center justify-center">
                            <div className="text-center">
                              <NodeIcon className="w-16 h-16 text-white/90 mx-auto mb-3" />
                              <p className="text-white font-bold text-lg">Redes</p>
                              <p className="text-white/70 text-sm">Infraestructura</p>
                            </div>
                          </div>
                          <div className="aspect-square bg-gradient-to-br from-accent to-accent/80 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <SecurityIcon className="w-10 h-10 text-white mb-2" />
                            <p className="text-white font-semibold text-xs text-center">CCTV</p>
                          </div>
                          <div className="aspect-square bg-gradient-to-br from-brand to-brand/80 rounded-2xl p-4 flex flex-col items-center justify-center">
                            <SoftwareIcon className="w-10 h-10 text-white mb-2" />
                            <p className="text-white font-semibold text-xs text-center">Software</p>
                          </div>
                          <div className="aspect-square bg-gradient-to-br from-accent/80 to-accent rounded-2xl p-4 flex flex-col items-center justify-center">
                            <PhoneIcon className="w-10 h-10 text-white mb-2" />
                            <p className="text-white font-semibold text-xs text-center">VoIP</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-sm font-medium text-gray-600">Sistema en línea</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
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
                    Nuestras Capacidades
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                    <span className="text-gradient-brand">Soluciones</span> que{' '}
                    <span className="text-brand">transforman</span>
                  </h2>
                  <p className="mt-6 text-xl text-gray-600">
                    Ofrecemos un ecosistema completo de servicios tecnológicos diseñados 
                    para impulsar la productividad y seguridad de tu empresa.
                  </p>
                </div>
              </Reveal>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <Reveal>
                  <div className="card-nexus rounded-2xl p-8 group cursor-pointer">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center shadow-lg shadow-accent/20">
                        <CableIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-brand mb-3">Cableado Estructurado</h3>
                    <p className="text-gray-600 mb-4">
                      Diseño e instalación de redes de cableado categoría 5e, 6 y 6A con certificación profesional.
                    </p>
                    <div className="flex items-center text-accent font-semibold text-sm">
                      <span>Ver más</span>
                      <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <div className="card-nexus rounded-2xl p-8 group cursor-pointer">
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
                  </div>
                </Reveal>

                <Reveal delay={0.2}>
                  <div className="card-nexus rounded-2xl p-8 group cursor-pointer">
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
                    <h3 className="text-xl font-bold text-brand mb-3">Control Biométrico</h3>
                    <p className="text-gray-600 mb-4">
                      Checadores de asistencia con huella digital, facial y tarjeta para control eficiente.
                    </p>
                    <div className="flex items-center text-accent font-semibold text-sm">
                      <span>Ver más</span>
                      <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.3}>
                  <div className="card-nexus rounded-2xl p-8 group cursor-pointer">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-brand/90 to-brand flex items-center justify-center shadow-lg shadow-brand/20">
                        <SoftwareIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-brand mb-3">Desarrollo de Software</h3>
                    <p className="text-gray-600 mb-4">
                      Sistemas a medida, apps móviles, ERP/CRM personalizados que se adaptan a tu negocio.
                    </p>
                    <div className="flex items-center text-accent font-semibold text-sm">
                      <span>Ver más</span>
                      <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
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
                    href="https://wa.me/+525550317183?text=Hola%20EDM%20Comunicaciones,%20quisiera%20solicitar%20una%20cotizaci%C3%B3n%20para%20..."
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
                    Formulario de Contacto
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
                      src="/partners/silicatos.png" 
                      alt="Silicatos" 
                      width={140} 
                      height={48} 
                      className="relative h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110 grayscale hover:grayscale-0" 
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
