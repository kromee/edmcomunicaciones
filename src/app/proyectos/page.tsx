"use client";
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import Image from 'next/image';
import { useState } from 'react';

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

interface Project {
  id: string;
  title: string;
  client: string;
  year: string;
  category: string;
  description: string;
  features: string[];
  images: { src: string; alt: string }[];
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

const projects: Project[] = [
  {
    id: 'kenworth',
    title: 'Centro de Capacitación — Voz y Datos',
    client: 'Kenworth Mexicana',
    year: '2024',
    category: 'Cableado Estructurado',
    description: 'Implementación integral de infraestructura de telecomunicaciones para el nuevo centro de capacitación técnica. Incluye cableado Cat 6A, red Wi-Fi mesh y backbone de fibra óptica OM4.',
    features: [
      '30 puntos de datos certificados Cat 6A',
      '8 access points Ubiquiti UniFi mesh',
      'Fibra óptica OM4 backbone',
      'Certificación Fluke y garantía 25 años'
    ],
    images: [
      { src: '/vozydatos.png', alt: 'Kenworth - Voz y datos' },
      { src: '/vozydatoswifi.png', alt: 'Kenworth - WiFi' },
      { src: '/switches.png', alt: 'Kenworth - Switches' }
    ],
    color: 'border-l-blue-500',
    bgColor: 'from-blue-500 to-blue-600',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'novaprint',
    title: 'Control de Acceso Biométrico Corporativo',
    client: 'Novaprint',
    year: '2025',
    category: 'Biometría',
    description: 'Sistema integral de control de asistencia y acceso biométrico en 5 entradas corporativas con terminales dual (huella + facial), integración con RRHH y respaldo en nube.',
    features: [
      '5 terminales biométricas dual ZKTeco',
      'Integración con plataforma RRHH',
      'Control anti-passback',
      'Respaldo en nube y logs con foto'
    ],
    images: [
      { src: '/biometrico.png', alt: 'Novaprint - Biométrico' },
      { src: '/sistemabiometrico.png', alt: 'Novaprint - Sistema' },
      { src: '/biometricohorarios.png', alt: 'Novaprint - Horarios' }
    ],
    color: 'border-l-green-500',
    bgColor: 'from-green-500 to-green-600',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'cliniks',
    title: 'Clinik\'s — Sistema Hospitalario Integral',
    client: 'Clínica Santa Teresa',
    year: '2025',
    category: 'Software',
    description: 'Sistema clínico hospitalario a medida para gestión de consultas, expedientes electrónicos, inventario médico y expedición de recetas digitales con firma electrónica.',
    features: [
      'Expediente clínico electrónico completo',
      'Control de inventario médico',
      'Recetas digitales con firma electrónica',
      'Plataforma en nube Azure'
    ],
    images: [
      { src: '/cliniks.png', alt: 'Cliniks - Dashboard' },
      { src: '/cliniks_pacientes.png', alt: 'Cliniks - Pacientes' },
      { src: '/cliniks_reservaciones.png', alt: 'Cliniks - Reservaciones' }
    ],
    color: 'border-l-purple-500',
    bgColor: 'from-purple-500 to-purple-600',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'decotuhome',
    title: 'Sistema POS y Control de Inventarios',
    client: 'DecoraTuHome',
    year: '2024',
    category: 'Software',
    description: 'Sistema de punto de venta integral con lector de código de barras, terminal bancaria Verifone y dashboard ejecutivo. Multi-sucursal con arquitectura offline-first.',
    features: [
      'POS completo con terminal Verifone',
      'Control de inventarios en tiempo real',
      'Dashboard ejecutivo con gráficas',
      'Multi-sucursal offline-first'
    ],
    images: [
      { src: '/proyectos/decotuhome_panel.jpeg', alt: 'DecoraTuHome - Panel' },
      { src: '/proyectos/decotuhome_venta.jpeg', alt: 'DecoraTuHome - Venta' },
      { src: '/proyectos/decotuhome_reportes.jpeg', alt: 'DecoraTuHome - Reportes' }
    ],
    color: 'border-l-orange-500',
    bgColor: 'from-orange-500 to-orange-600',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'app-mercancia',
    title: 'App Móvil Control de Entradas/Salidas',
    client: 'Almacén Logístico',
    year: '2023',
    category: 'Desarrollo Móvil',
    description: 'Aplicación móvil nativa para validación en tiempo real de entradas y salidas de mercancía mediante lectura de código de barras con modo offline-first.',
    features: [
      'Lector de código de barras 1D/2D',
      'Validación automática vs factura',
      'Modo offline-first',
      'Panel web administrativo'
    ],
    images: [
      { src: '/inventario_login.png', alt: 'App - Login' },
      { src: '/inventario_captura.png', alt: 'App - Captura' },
      { src: '/inventario_reporte.png', alt: 'App - Reporte' }
    ],
    color: 'border-l-indigo-500',
    bgColor: 'from-indigo-500 to-indigo-600',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 15h4m-4 4h4m-4-8h4m-4 4h4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'ballotini',
    title: 'Sistema de Videovigilancia Integral',
    client: 'Ballotini Panamericana',
    year: '2025',
    category: 'CCTV',
    description: 'Implementación completa de videovigilancia IP con 24 cámaras 4K/8MP, NVR empresarial RAID 6, analítica inteligente y acceso remoto multiplataforma.',
    features: [
      '24 cámaras IP 4K/8MP con IR',
      'NVR RAID 6 y respaldo en nube',
      'Analítica inteligente de video',
      'Acceso remoto 24/7'
    ],
    images: [
      { src: '/cctv_instalacion.png', alt: 'CCTV - Instalación' },
      { src: '/cctv_monitoreo.png', alt: 'CCTV - Monitoreo' },
      { src: '/cctv_analitica.png', alt: 'CCTV - Analítica' }
    ],
    color: 'border-l-red-500',
    bgColor: 'from-red-500 to-red-600',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )
  }
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  return (
    <div className="group">
      <Reveal delay={index * 0.1}>
        <div className={`card-nexus rounded-3xl overflow-hidden border-l-4 ${project.color} transition-all duration-500 hover:shadow-nexus`}>
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.bgColor} flex items-center justify-center text-white shadow-lg`}>
                  {project.icon}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${project.bgColor} text-white`}>
                  {project.category}
                </span>
              </div>
              
              <div className="flex items-baseline gap-3 mb-2">
                <h3 className="text-2xl font-black text-brand leading-tight">{project.title}</h3>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">{project.year}</span>
              </div>
              
              <p className="text-lg font-medium text-accent mb-4">{project.client}</p>
              
              <p className="text-gray-600 leading-relaxed mb-6">{project.description}</p>
              
              <div className="space-y-3">
                {project.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                      <svg className="w-3 h-3 text-accent group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
              <div className="grid grid-cols-3 gap-3 h-full">
                {project.images.map((img, i) => (
                  <div 
                    key={i}
                    className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${i === 0 ? 'col-span-3 aspect-video' : 'aspect-square'}`}
                    onClick={() => setSelectedImage(img.src)}
                  >
                    <Image 
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
      
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative aspect-video">
                <Image
                  src={selectedImage}
                  alt="Imagen del proyecto"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProyectosPage() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <div className="nexus-bg">
          <NetworkBackground />
          
          <section className="relative pt-24 pb-16 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <div className="text-center max-w-4xl mx-auto">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold text-sm mb-6">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Casos de Éxito
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                    <span className="text-gradient-brand">Proyectos</span>
                    <br />
                    <span className="text-brand">que Generan</span>
                    <br />
                    <span className="text-gradient-accent">Valor Real</span>
                  </h1>
                  <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Ejecutados con excelencia técnica, entrega puntual y resultados medibles 
                    para empresas líderes en su sector.
                  </p>
                </div>
              </Reveal>
              
              <Reveal delay={0.2}>
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  <div className="text-center p-4">
                    <div className="stat-number">6</div>
                    <p className="mt-1 text-sm text-gray-600 font-medium">Proyectos</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="stat-number">50+</div>
                    <p className="mt-1 text-sm text-gray-600 font-medium">Clientes</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="stat-number">100%</div>
                    <p className="mt-1 text-sm text-gray-600 font-medium">Satisfacción</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="stat-number">12+</div>
                    <p className="mt-1 text-sm text-gray-600 font-medium">Años</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          <section className="py-12 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="space-y-8">
                {projects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
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
                  <span className="text-white/90 text-sm font-medium">Transformamos desafíos en soluciones</span>
                </div>
              </Reveal>
              
              <Reveal delay={0.1}>
                <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                  ¿Listo para ser nuestro próximo caso de éxito?
                </h2>
              </Reveal>
              
              <Reveal delay={0.2}>
                <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
                  Iniciemos juntos un proyecto que impulse la competitividad y crecimiento de tu empresa.
                </p>
              </Reveal>
              
              <Reveal delay={0.3}>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://wa.me/+525550317183?text=Hola%20EDM%20Comunicaciones,%20quiero%20iniciar%20un%20proyecto%20..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-brand font-bold rounded-xl hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
                      <path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/>
                      <path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38z"/>
                    </svg>
                    Iniciar Mi Proyecto
                  </a>
                  <a
                    href="mailto:edm_comunicaciones@hotmail.com?subject=Consulta%20sobre%20proyectos&body=Hola,%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20proyectos."
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Más Información
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
