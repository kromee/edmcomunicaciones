"use client";
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { useState, useEffect } from 'react';
import Image from 'next/image';

function NetworkBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 hex-pattern opacity-100" />
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-20 left-[5%] w-40 h-40 border border-accent/10 rounded-full animate-spin-slow" />
      <div className="absolute bottom-1/4 right-[10%] w-32 h-32 border border-brand/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
    </div>
  );
}

type GallerySection = 'cctv' | 'cableado' | 'software' | null;

interface ProjectImage {
  src: string;
  alt: string;
  title: string;
  description: string;
  client?: string;
  date?: string;
}

const galleryData = {
  cctv: {
    title: 'Proyectos CCTV',
    description: 'Sistemas de videovigilancia y seguridad implementados',
    images: [
      { 
        src: '/proyectos/cctv/ccvt_1.JPG', 
        alt: 'Instalación de CCTV',
        title: 'Sistema de Videovigilancia Empresarial',
        description: 'Instalación completa de sistema CCTV con cámaras IP de alta resolución, grabación en la nube y acceso remoto 24/7.',
        client: 'Empresa Corporativa',
        date: '2024'
      },
      { 
        src: '/proyectos/cctv/ccvt_1.JPG', 
        alt: 'Sistema de monitoreo',
        title: 'Centro de Monitoreo Inteligente',
        description: 'Centro de monitoreo centralizado con múltiples pantallas y capacidad para monitorear hasta 50 cámaras.',
        client: 'Centro Comercial',
        date: '2024'
      },
      { 
        src: '/cctv_analitica.png', 
        alt: 'Análisis de video',
        title: 'Sistema con Analítica Avanzada',
        description: 'Videovigilancia con IA para reconocimiento facial, conteo de personas y análisis de comportamiento.',
        client: 'Tienda Retail',
        date: '2023'
      },
      { 
        src: '/ccvt.png', 
        alt: 'Cámaras de seguridad',
        title: 'Red de Cámaras Perimetrales',
        description: 'Cámaras perimetrales con visión nocturna, resistentes a intemperie y capacidad PTZ.',
        client: 'Complejo Industrial',
        date: '2023'
      },
      { 
        src: '/proyectos/cctv/ccvt_1.JPG', 
        alt: 'Servicio CCTV',
        title: 'Mantenimiento Preventivo y Correctivo',
        description: 'Servicio integral de mantenimiento con contrato de soporte técnico y tiempo de respuesta garantizado.',
        client: 'Múltiples Clientes',
        date: '2024'
      },
    ],
  },
  cableado: {
    title: 'Proyectos Cableado Estructurado',
    description: 'Infraestructura de red y comunicaciones',
    images: [
      { 
        src: '/proyectos/estructurado_2.JPG', 
        alt: 'Cableado estructurado',
        title: 'Infraestructura de Red Empresarial',
        description: 'Cableado estructurado categoría 6A con certificación, racks organizados y garantía de 25 años.',
        client: 'Oficinas Corporativas',
        date: '2024'
      },
      { 
        src: '/proyectos/estructurado_3.jpg', 
        alt: 'Servicio de cableado',
        title: 'Cableado en Data Center',
        description: 'Instalación de fibra óptica y cobre en data center con organización y documentación completa.',
        client: 'Centro de Datos',
        date: '2024'
      },
      { 
        src: '/proyectos/estructurado_4.jpg', 
        alt: 'Switches de red',
        title: 'Switches Empresariales',
        description: 'Configuración de switches gestionables con VLANs, QoS y alta disponibilidad.',
        client: 'Empresa Tecnológica',
        date: '2023'
      },
      { 
        src: '/proyectos/estructurado_5.jpg', 
        alt: 'Voz y datos',
        title: 'Sistema de Voz y Datos',
        description: 'Infraestructura convergente con telefonía IP y servidor de comunicaciones unificadas.',
        client: 'Call Center',
        date: '2023'
      },
      { 
        src: '/proyectos/estructurado_4.jpg', 
        alt: 'WiFi y comunicaciones',
        title: 'Red WiFi Empresarial',
        description: 'Red inalámbrica de alto rendimiento con múltiples access points y cobertura total.',
        client: 'Hotel Boutique',
        date: '2024'
      },
    ],
  },
  software: {
    title: 'Proyectos Software',
    description: 'Desarrollo de aplicaciones web, móviles y sistemas a medida',
    images: [
      { 
        src: '/proyectos/clinicas_1.png', 
        alt: 'Sistema Cliniks',
        title: 'Sistema de Gestión Clínica - Cliniks',
        description: 'Plataforma web completa para administración de clínicas con expedientes electrónicos, agendamiento y recetas digitales.',
        client: 'Clínica Médica',
        date: '2024'
      },
      { 
        src: '/proyectos/decotuhome_panel.jpeg', 
        alt: 'DecoraTuHome',
        title: 'Sistema POS DecoraTuHome',
        description: 'Sistema administrativo y punto de venta con catálogo de productos, reportes y panel de control.',
        client: 'Tienda de Decoración',
        date: '2024'
      },
      { 
        src: '/proyectos/clinikas_pv.png', 
        alt: 'Sistema POS Farmacias',
        title: 'Sistema de Punto de Venta',
        description: 'POS configurable para farmacias y retail con gestión multi-almacén y facturación electrónica.',
        client: 'Farmacia / Retail',
        date: '2024'
      },
      { 
        src: '/proyectos/clinicas_3.png', 
        alt: 'Sistema de inventario',
        title: 'Control de Inventarios',
        description: 'Gestión de inventarios multi-almacén con reportes en tiempo real y alertas de stock.',
        client: 'Empresa Distribuidora',
        date: '2023'
      },
      { 
        src: '/proyectos/clinicas_4.png', 
        alt: 'App de inventarios',
        title: 'App Móvil de Inventarios',
        description: 'Aplicación móvil para inventarios físicos con escaneo de códigos de barras y sincronización.',
        client: 'Retail',
        date: '2023'
      },
      { 
        src: '/proyectos/clinicas_5.png', 
        alt: 'Recursos Humanos',
        title: 'Sistema de Recursos Humanos',
        description: 'Plataforma integral con módulos de nómina, control de asistencia y portal del empleado.',
        client: 'Empresa Manufacturera',
        date: '2024'
      },
      { 
        src: '/proyectos/clinicas_6.png', 
        alt: 'App logística',
        title: 'App E/S Mercancía QR',
        description: 'App móvil para logística con escaneo QR, validaciones en tiempo real y firmas digitales.',
        client: 'Empresa de Logística',
        date: '2024'
      },
    ],
  },
};

interface CategoryCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  activeGradient: string;
  isActive: boolean;
  onClick: () => void;
}

function CategoryCard({ title, subtitle, icon, gradient, activeGradient, isActive, onClick }: CategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl p-6 sm:p-8 text-left transition-all duration-500 ${
        isActive
          ? `bg-gradient-to-br ${activeGradient} shadow-nexus-lg scale-[1.02]`
          : 'bg-white hover:shadow-nexus hover:scale-[1.02] shadow-card'
      }`}
    >
      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 transition-all duration-300 ${
          isActive ? 'bg-white/20' : `bg-gradient-to-br ${gradient}`
        }`}>
          <div className={isActive ? 'text-white' : ''}>{icon}</div>
        </div>
        <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${isActive ? 'text-white' : 'text-brand'}`}>
          {title}
        </h3>
        <p className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-600'}`}>
          {subtitle}
        </p>
        <div className={`mt-4 flex items-center text-sm font-semibold transition-all duration-300 ${
          isActive ? 'text-white' : 'text-accent'
        }`}>
          <span>{isActive ? '✓ Ver menos' : '→ Ver proyectos'}</span>
          <svg className={`w-4 h-4 ml-2 transition-transform ${isActive ? '' : 'group-hover:translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </button>
  );
}

export default function GaleriaPage() {
  const [activeSection, setActiveSection] = useState<GallerySection>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectImage | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <>
      <Navbar />
      <main className="relative">
        <div className="nexus-bg min-h-screen">
          <NetworkBackground />
          
          <section className="relative pt-24 pb-16 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-4xl mx-auto">
                <Reveal>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-semibold text-sm mb-6">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Portafolio
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                    <span className="text-gradient-brand">Galería de</span>
                    <br />
                    <span className="text-brand">Proyectos</span>
                  </h1>
                  <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto">
                    Explora nuestro trabajo realizado en diferentes áreas de infraestructura tecnológica
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          <section className="py-12 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-6 md:grid-cols-3">
                <CategoryCard
                  title="CCTV"
                  subtitle="Videovigilancia y seguridad"
                  icon={
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  gradient="from-red-500 to-red-600"
                  activeGradient="from-red-500 to-red-600"
                  isActive={activeSection === 'cctv'}
                  onClick={() => setActiveSection(activeSection === 'cctv' ? null : 'cctv')}
                />
                <CategoryCard
                  title="Cableado"
                  subtitle="Infraestructura de redes"
                  icon={
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  gradient="from-blue-500 to-blue-600"
                  activeGradient="from-blue-500 to-blue-600"
                  isActive={activeSection === 'cableado'}
                  onClick={() => setActiveSection(activeSection === 'cableado' ? null : 'cableado')}
                />
                <CategoryCard
                  title="Software"
                  subtitle="Desarrollo a la medida"
                  icon={
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                  gradient="from-purple-500 to-purple-600"
                  activeGradient="from-purple-500 to-purple-600"
                  isActive={activeSection === 'software'}
                  onClick={() => setActiveSection(activeSection === 'software' ? null : 'software')}
                />
              </div>

              {activeSection && (
                <div className="mt-12">
                  <Reveal>
                    <div className="card-nexus rounded-3xl p-8 hover:shadow-nexus transition-all duration-500">
                      <div className="mb-8">
                        <h2 className="text-3xl font-black text-brand mb-2">
                          {galleryData[activeSection].title}
                        </h2>
                        <p className="text-gray-600">
                          {galleryData[activeSection].description}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {galleryData[activeSection].images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedProject(image)}
                            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-50 cursor-pointer hover:shadow-lg transition-all duration-300"
                          >
                            <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <p className="text-white font-semibold text-sm mb-1">{image.title}</p>
                                <p className="text-white/80 text-xs flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  Ver detalles
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                </div>
              )}

              {!activeSection && (
                <Reveal>
                  <div className="text-center py-20 card-nexus rounded-3xl">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
                      <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-brand mb-2">
                      Selecciona una categoría
                    </h3>
                    <p className="text-gray-600">
                      Haz clic en una de las categorías de arriba para ver los proyectos
                    </p>
                  </div>
                </Reveal>
              )}
            </div>
          </section>
        </div>
      </main>

      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative aspect-video bg-gray-50 rounded-t-3xl overflow-hidden">
              <Image
                src={selectedProject.src}
                alt={selectedProject.alt}
                fill
                className="object-contain p-8"
              />
            </div>

            <div className="p-8">
              <h2 className="text-2xl sm:text-3xl font-black text-brand mb-4">
                {selectedProject.title}
              </h2>
              
              <div className="flex flex-wrap gap-3 mb-6">
                {selectedProject.client && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {selectedProject.client}
                  </div>
                )}
                {selectedProject.date && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {selectedProject.date}
                  </div>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">
                {selectedProject.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wa.me/+525550317183?text=Hola%20EDM%20Comunicaciones,%20me%20interesa%20un%20proyecto%20similar..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-nexus-primary flex-1 text-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/>
                    <path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38z"/>
                  </svg>
                  Solicitar Proyecto Similar
                </a>
                <a
                  href="mailto:edm_comunicaciones@hotmail.com?subject=Consulta sobre proyecto&body=Hola, me interesa obtener más información sobre sus proyectos."
                  className="btn-nexus-secondary flex-1 text-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Enviar Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
