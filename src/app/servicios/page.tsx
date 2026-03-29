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
          {/* Top accent line */}
          <div className={`h-1 w-full bg-gradient-to-r ${color}`} />
          
          {/* Content */}
          <div className="p-7">
            {/* Header with number and icon */}
            <div className="flex items-start justify-between mb-5">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br ${color.replace('from-', 'from-').replace('to-', 'to-')} shadow-lg transform group-hover:scale-105 transition-transform duration-500`}>
                <div className="text-white">
                  {icon}
                </div>
              </div>
              <span className="text-4xl font-black text-gray-100 opacity-50">{number}</span>
            </div>
            
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand transition-colors">
              {title}
            </h3>
            
            {/* Divider */}
            <div className="w-12 h-0.5 bg-gradient-to-r from-accent to-transparent mb-4 transform origin-left group-hover:w-20 transition-all duration-500" />
            
            {/* Description */}
            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              {description}
            </p>
            
            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Ver más detalles
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${color.replace('from-', 'from-').replace('to-', 'to-')} transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300`}>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Hover overlay effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${color.replace('from-', 'from-').replace('to-', 'to-')} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
        </div>
      </a>
    </Reveal>
  );
}

function FeatureItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 group">
      <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
        <svg className="w-3.5 h-3.5 text-accent group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-gray-700">{children}</span>
    </div>
  );
}

function TestimonialCard({ name, role, company, text, delay }: { name: string; role: string; company: string; text: string; delay?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const colors = ['bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600', 'bg-orange-100 text-orange-600', 'bg-indigo-100 text-indigo-600', 'bg-teal-100 text-teal-600'];
  const colorIndex = name.length % colors.length;
  
  return (
    <Reveal delay={delay}>
      <div className="card-nexus rounded-2xl p-8 h-full hover:shadow-nexus transition-all duration-500">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
          ))}
        </div>
        <p className="text-gray-700 mb-6 leading-relaxed">"{text}"</p>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colors[colorIndex]}`}>
            <span className="font-bold text-sm">{initials}</span>
          </div>
          <div>
            <p className="font-bold text-brand">{name}</p>
            <p className="text-sm text-gray-600">{role}, {company}</p>
          </div>
        </div>
      </div>
    </Reveal>
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
                    Servicios Integrales
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                    <span className="text-gradient-brand">Infraestructura</span>
                    <br />
                    <span className="text-brand">Tecnológica de</span>
                    <br />
                    <span className="text-gradient-accent">Clase Empresarial</span>
                  </h1>
                  <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Diseñamos, implementamos y certificamos soluciones de red, seguridad y software 
                    que impulsan la productividad y competitividad de tu empresa.
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
                  title="CCTV"
                  description="Sistemas de videovigilancia IP con analítica de video, monitoreo 24/7 y respaldo en nube."
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
                  title="Cableado"
                  description="Infraestructura Cat 6A/7 y fibra óptica certificada con garantía de 25 años."
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
                  description="Preventivo y correctivo de PCs, servidores, HVAC y hardware con SLA garantizado."
                  color="from-amber-500 to-orange-600"
                  number="03"
                  delay={0.1}
                />
                <ServiceCard
                  icon={
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  title="Instalación"
                  description="Biométricos, Wi-Fi empresarial, enlaces punto a punto y configuración llave en mano."
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
                  description="ERP/CRM, apps móviles, integración con hardware y APIs REST personalizadas."
                  color="from-indigo-500 to-blue-600"
                  number="05"
                  delay={0.2}
                />
              </div>
            </div>
          </section>

          <section id="cctv" className="py-24 relative scroll-mt-20">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div>
                  <Reveal>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 font-semibold text-sm mb-6">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Videovigilancia
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                      <span className="text-gradient-brand">Circuito Cerrado</span>
                      <br />
                      <span className="text-brand">de Televisión</span>
                    </h2>
                    <p className="mt-4 text-lg text-accent font-medium">Protección inteligente 24/7</p>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="mt-6 text-gray-600 leading-relaxed">
                      Implementamos sistemas de videovigilancia de última generación con cámaras IP, 
                      analítica de video e integración con plataformas de gestión centralizada (VMS).
                    </p>
                  </Reveal>
                  <Reveal delay={0.15}>
                    <div className="mt-8 space-y-4">
                      <FeatureItem><strong className="text-brand">Cámaras IP 4K/8MP:</strong> Resolución ultra nítida, visión nocturna IR hasta 50m, WDR real y reducción de ruido 3DNR.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Analítica de video:</strong> Detección facial, conteo de personas, reconocimiento de placas (LPR) y mapas de calor.</FeatureItem>
                      <FeatureItem><strong className="text-brand">NVR empresarial:</strong> Almacenamiento RAID, respaldo en nube híbrido y capacidad hasta 256 canales.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Integración total:</strong> Sincronización con control de acceso, alarmas y biométricos.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Monitoreo 24/7:</strong> Acceso remoto multiplataforma, alertas push y playback inteligente.</FeatureItem>
                    </div>
                  </Reveal>
                </div>
                <Reveal delay={0.2}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-accent/20 rounded-3xl blur-3xl" />
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-nexus-lg border border-gray-100">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                        <Image src="/ccvt.png" alt="Sistema CCTV" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between text-white text-sm">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                              <span>En vivo - 24 canales</span>
                            </div>
                            <div className="flex gap-2">
                              <span className="px-2 py-1 bg-white/20 rounded">HD</span>
                              <span className="px-2 py-1 bg-white/20 rounded">4K</span>
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
                          <div className="text-xs text-gray-600">Resolución</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-blue-500">30</div>
                          <div className="text-xs text-gray-600">Días</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          <section id="cableado" className="py-24 relative scroll-mt-20 bg-gradient-to-b from-gray-50/50 to-transparent">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <Reveal>
                  <div className="relative order-2 lg:order-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-accent/20 rounded-3xl blur-3xl" />
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-nexus-lg border border-gray-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                          <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <div className="text-3xl font-black">10G</div>
                          <div className="text-sm opacity-80">Cat 6A / 100m</div>
                        </div>
                        <div className="bg-gradient-to-br from-accent to-blue-500 rounded-2xl p-6 text-white">
                          <svg className="w-10 h-10 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <div className="text-3xl font-black">100G</div>
                          <div className="text-sm opacity-80">Fibra OM4</div>
                        </div>
                        <div className="col-span-2 bg-gradient-to-r from-brand to-brand/80 rounded-2xl p-6 text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-4xl font-black">25</div>
                              <div className="text-sm opacity-80">Años de garantía</div>
                            </div>
                            <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 relative aspect-[4/3] rounded-2xl overflow-hidden">
                        <Image src="/cable_estructurado.png" alt="Cableado estructurado" fill className="object-cover" />
                      </div>
                    </div>
                  </div>
                </Reveal>
                <div className="order-1 lg:order-2">
                  <Reveal>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 font-semibold text-sm mb-6">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                      </svg>
                      Infraestructura de Red
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                      <span className="text-gradient-brand">Cableado</span>
                      <br />
                      <span className="text-brand">Estructurado</span>
                    </h2>
                    <p className="mt-4 text-lg text-accent font-medium">Certificación profesional garantizada</p>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="mt-6 text-gray-600 leading-relaxed">
                      Diseñamos e instalamos cableado estructurado Cat 6A/Cat 7 y fibra óptica con 
                      certificación de fábrica. Cumplimos estándares TIA/EIA-568, ISO/IEC 11801.
                    </p>
                  </Reveal>
                  <Reveal delay={0.15}>
                    <div className="mt-8 space-y-4">
                      <FeatureItem><strong className="text-brand">Cableado Horizontal:</strong> UTP/FTP Cat 6A hasta 10GBase-T/100m con canalización Panduit.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Cableado Vertical:</strong> Fibra OM3/OM4 (40G/100G) y OS2 hasta 80km con fusión certificada.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Sites y Cuartos:</strong> Racks 42U/45U, PDUs administrables, tierras físicas y HVAC.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Certificación:</strong> Pruebas con Fluke DTX/DSX-5000 y reportes con garantía de 25 años.</FeatureItem>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>

          <section id="mantenimiento" className="py-24 relative scroll-mt-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div>
                  <Reveal>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 font-semibold text-sm mb-6">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Soporte Técnico
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                      <span className="text-gradient-brand">Mantenimiento</span>
                      <br />
                      <span className="text-brand">Integral</span>
                    </h2>
                    <p className="mt-4 text-lg text-accent font-medium">Máxima disponibilidad operativa</p>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="mt-6 text-gray-600 leading-relaxed">
                      Maximice la vida útil de su infraestructura con programas de mantenimiento 
                      preventivo y correctivo especializados. Reducimos tiempos de inactividad.
                    </p>
                  </Reveal>
                  <Reveal delay={0.15}>
                    <div className="mt-8 space-y-4">
                      <FeatureItem><strong className="text-brand">PCs y servidores:</strong> Limpieza, actualización de firmware, diagnóstico y optimización del SO.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Aire acondicionado:</strong> Servicio preventivo HVAC para data centers con calibración.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Hardware de oficina:</strong> Impresoras, escáneres, proyectores, UPS y reguladores.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Contratos de soporte:</strong> Planes mensuales/anuales con SLA personalizado.</FeatureItem>
                    </div>
                  </Reveal>
                </div>
                <Reveal delay={0.2}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-accent/20 rounded-3xl blur-3xl" />
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
                              <span className="font-semibold">SLA Garantizado</span>
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

          <section id="instalacion" className="py-24 relative scroll-mt-20 bg-gradient-to-b from-gray-50/50 to-transparent">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <Reveal>
                  <div className="relative order-2 lg:order-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-accent/20 rounded-3xl blur-3xl" />
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
                <div className="order-1 lg:order-2">
                  <Reveal>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 font-semibold text-sm mb-6">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Equipamiento
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                      <span className="text-gradient-brand">Venta e</span>
                      <br />
                      <span className="text-brand">Instalación</span>
                    </h2>
                    <p className="mt-4 text-lg text-accent font-medium">Llave en mano</p>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="mt-6 text-gray-600 leading-relaxed">
                      Proveemos, instalamos y configuramos equipos de última generación con 
                      servicio integral. Desde la cotización hasta la capacitación.
                    </p>
                  </Reveal>
                  <Reveal delay={0.15}>
                    <div className="mt-8 space-y-4">
                      <FeatureItem><strong className="text-brand">Checadores biométricos:</strong> Huella, facial y palma con integración a software de RRHH.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Wi-Fi empresarial:</strong> Access points mesh, site survey RF, autenticación 802.1X.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Enlaces punto a punto:</strong> Radio enlace para edificios remotos con throughput garantizado.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Configuración:</strong> VLANs, QoS, firewall, VPN site-to-site y balanceo de carga.</FeatureItem>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>

          <section id="software" className="py-24 relative scroll-mt-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div>
                  <Reveal>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 font-semibold text-sm mb-6">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Desarrollo
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                      <span className="text-gradient-brand">Software</span>
                      <br />
                      <span className="text-brand">a Medida</span>
                    </h2>
                    <p className="mt-4 text-lg text-accent font-medium">Soluciones personalizadas</p>
                  </Reveal>
                  <Reveal delay={0.1}>
                    <p className="mt-6 text-gray-600 leading-relaxed">
                      Transformamos procesos de negocio en aplicaciones escalables con integración 
                      nativa a hardware especializado, APIs REST y arquitectura en la nube.
                    </p>
                  </Reveal>
                  <Reveal delay={0.15}>
                    <div className="mt-8 space-y-4">
                      <FeatureItem><strong className="text-brand">ERP/CRM:</strong> Inventarios, facturación CFDI 4.0, ventas, compras y reportería en tiempo real.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Hardware:</strong> Terminales bancarias, biométricos, lectores de código y dispensadores RFID.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Apps móviles:</strong> Flutter, React Native con sincronización offline y geolocalización.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Dashboards:</strong> React/Next.js con gráficas en vivo y autenticación multi-factor.</FeatureItem>
                      <FeatureItem><strong className="text-brand">Integraciones:</strong> Webhooks, SSO (SAML, OAuth2) y microservicios Docker/Kubernetes.</FeatureItem>
                    </div>
                  </Reveal>
                </div>
                <Reveal delay={0.2}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-accent/20 rounded-3xl blur-3xl" />
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-nexus-lg border border-gray-100">
                      <div className="relative aspect-[4/3]">
                        <Image src="/software-service.png" alt="Desarrollo de software" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                            </div>
                            <p className="font-bold">Código a tu medida</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          <section className="py-24 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/5 border border-brand/10 text-brand font-semibold text-sm mb-6">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Testimonios
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                    <span className="text-gradient-brand">Lo Que Dicen</span>
                    <br />
                    <span className="text-brand">Nuestros Clientes</span>
                  </h2>
                  <p className="mt-6 text-xl text-gray-600">
                    Empresas que han transformado su infraestructura tecnológica con nosotros
                  </p>
                </div>
              </Reveal>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <TestimonialCard
                  name="María Rodríguez"
                  role="Gerente General"
                  company="Ballotini Panamericana"
                  text="Excelente servicio en la instalación de nuestro sistema CCTV. El equipo fue muy profesional y la calidad del trabajo superó nuestras expectativas."
                  delay={0}
                />
                <TestimonialCard
                  name="Carlos López"
                  role="Director de IT"
                  company="Kenworth"
                  text="El cableado estructurado que instalaron en nuestro centro de capacitación ha sido impecable. Redes rápidas, sin interrupciones y con certificación completa."
                  delay={0.1}
                />
                <TestimonialCard
                  name="Ana García"
                  role="RRHH"
                  company="Novaprint"
                  text="El sistema biométrico que implementaron ha mejorado significativamente nuestro control de asistencia. La integración fue perfecta."
                  delay={0.2}
                />
                <TestimonialCard
                  name="Dr. Miguel Díaz"
                  role="Director Médico"
                  company="Clínica Santa Teresa"
                  text="El software Clinik's que desarrollaron ha revolucionado nuestra gestión. Expedientes electrónicos, control de inventarios y recetas digitales."
                  delay={0.3}
                />
                <TestimonialCard
                  name="Laura Sánchez"
                  role="Gerente de Operaciones"
                  company="DecoraTuHome"
                  text="El sistema de punto de venta y control de inventarios ha optimizado completamente nuestras operaciones. Ventas más rápidas y control total."
                  delay={0.4}
                />
                <TestimonialCard
                  name="Roberto Jiménez"
                  role="Supervisor de Almacén"
                  company="Independiente"
                  text="La app móvil para control de inventarios ha sido un cambio total. Validamos mercancías contra facturas en tiempo real, sin errores."
                  delay={0.5}
                />
              </div>
            </div>
          </section>

          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand/95 to-brand/90" />
            <div className="absolute inset-0 hex-pattern opacity-10" />
            
            <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-white/90 text-sm font-medium">Auditoría técnica gratuita</span>
                </div>
              </Reveal>
              
              <Reveal delay={0.1}>
                <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                  ¿Listo para transformar tu infraestructura?
                </h2>
              </Reveal>
              
              <Reveal delay={0.2}>
                <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
                  Solicita una auditoría técnica gratuita y cotización sin compromiso. 
                  Respuesta en menos de 24 horas.
                </p>
              </Reveal>
              
              <Reveal delay={0.3}>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://wa.me/+525550317183?text=Hola%20EDM%20Comunicaciones,%20quisiera%20solicitar%20una%20auditor%C3%ADa%20t%C3%A9cnica%20..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-brand font-bold rounded-xl hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
                      <path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/>
                      <path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38z"/>
                    </svg>
                    Solicitar Auditoría
                  </a>
                  <a
                    href="mailto:edm_comunicaciones@hotmail.com?subject=Solicitud%20de%20informaci%C3%B3n&body=Hola,%20requiero%20informaci%C3%B3n%20sobre%20sus%20servicios."
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
