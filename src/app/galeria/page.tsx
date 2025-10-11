"use client";

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useState, useEffect } from 'react';
import Image from 'next/image';

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
        description: 'Instalación completa de sistema CCTV con cámaras IP de alta resolución, grabación en la nube y acceso remoto 24/7. Incluye análisis de video con detección de movimiento y alertas en tiempo real.',
        client: 'Empresa Corporativa',
        date: '2024'
      },
      { 
        src: '/proyectos/cctv/ccvt_1.JPG', 
        alt: 'Sistema de monitoreo',
        title: 'Centro de Monitoreo Inteligente',
        description: 'Implementación de centro de monitoreo centralizado con múltiples pantallas, sistema de gestión de eventos y respaldo de energía. Capacidad para monitorear hasta 50 cámaras simultáneamente.',
        client: 'Centro Comercial',
        date: '2024'
      },
      { 
        src: '/cctv_analitica.png', 
        alt: 'Análisis de video',
        title: 'Sistema con Analítica Avanzada',
        description: 'Solución de videovigilancia con inteligencia artificial para reconocimiento facial, conteo de personas y análisis de comportamiento. Ideal para retail y espacios públicos.',
        client: 'Tienda Retail',
        date: '2023'
      },
      { 
        src: '/ccvt.png', 
        alt: 'Cámaras de seguridad',
        title: 'Red de Cámaras Perimetrales',
        description: 'Despliegue de cámaras de seguridad perimetral con visión nocturna, resistentes a intemperie y con capacidad PTZ (Pan-Tilt-Zoom) para cobertura de 360 grados.',
        client: 'Complejo Industrial',
        date: '2023'
      },
      { 
        src: '/proyectos/cctv/ccvt_1.JPG', 
        alt: 'Servicio CCTV',
        title: 'Mantenimiento Preventivo y Correctivo',
        description: 'Servicio integral de mantenimiento, actualización de firmware, limpieza de equipos y ajuste de cámaras. Incluye contrato de soporte técnico con tiempo de respuesta garantizado.',
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
        description: 'Diseño e implementación de cableado estructurado categoría 6A con certificación, racks organizados, paneles de patcheo y etiquetado profesional. Capacidad para 1000 Mbps con garantía de 25 años.',
        client: 'Oficinas Corporativas',
        date: '2024'
      },
      { 
        src: '/proyectos/estructurado_3.jpg', 
        alt: 'Servicio de cableado',
        title: 'Cableado en Data Center',
        description: 'Instalación de cableado de fibra óptica y cobre en data center con organización vertical y horizontal, sistema de gestión de cables y documentación detallada de la topología de red.',
        client: 'Centro de Datos',
        date: '2024'
      },
      { 
        src: '/proyectos/estructurado_4.jpg', 
        alt: 'Switches de red',
        title: 'Implementación de Switches Empresariales',
        description: 'Configuración e instalación de switches gestionables con VLANs, QoS, redundancia y alta disponibilidad. Incluye documentación de configuración y respaldo de configuraciones.',
        client: 'Empresa Tecnológica',
        date: '2023'
      },
      { 
        src: '/proyectos/estructurado_5.jpg', 
        alt: 'Voz y datos',
        title: 'Sistema de Voz y Datos Unificado',
        description: 'Despliegue de infraestructura convergente para voz y datos con telefonía IP, switches PoE y servidor de comunicaciones unificadas. Incluye integración con sistema existente.',
        client: 'Call Center',
        date: '2023'
      },
      { 
        src: '/proyectos/estructurado_4.jpg', 
        alt: 'WiFi y comunicaciones',
        title: 'Red WiFi Empresarial',
        description: 'Instalación de red inalámbrica de alto rendimiento con múltiples access points, controlador centralizado, autenticación segura y cobertura total del edificio.',
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
        description: 'Plataforma web completa para administración de clínicas médicas con módulos de expedientes electrónicos, agendamiento de citas, facturación, inventario de medicamentos y reportes estadísticos.',
        client: 'Clínica Médica',
        date: '2024'
      },
      { 
        src: '/proyectos/clinicas_2.png', 
        alt: 'Decora Tu Home',
        title: 'E-commerce Decora Tu Home',
        description: 'Tienda en línea para venta de artículos de decoración con catálogo de productos, carrito de compras, pasarela de pagos, gestión de inventario y panel administrativo completo.',
        client: 'Tienda de Decoración',
        date: '2024'
      },
      { 
        src: '/proyectos/clinicas_3.png', 
        alt: 'Sistema de inventario',
        title: 'Sistema de Control de Inventarios',
        description: 'Aplicación web para gestión de inventarios multi-almacén con control de entradas y salidas, reportes en tiempo real, alertas de stock mínimo y trazabilidad completa de productos.',
        client: 'Empresa Distribuidora',
        date: '2023'
      },
      { 
        src: '/proyectos/clinicas_4.png', 
        alt: 'App de inventarios',
        title: 'App Móvil de Inventarios',
        description: 'Aplicación móvil para Android e iOS que permite realizar inventarios físicos, escaneo de códigos de barras, sincronización en línea y generación de reportes desde dispositivos móviles.',
        client: 'Retail',
        date: '2023'
      },
      { 
        src: '/proyectos/clinicas_5.png', 
        alt: 'Desarrollo de software',
        title: 'Sistema de Recursos Humanos',
        description: 'Plataforma integral de gestión de recursos humanos con módulos de nómina, control de asistencia, evaluaciones de desempeño, gestión de vacaciones y portal del empleado.',
        client: 'Empresa Manufacturera',
        date: '2024'
      },
      { 
        src: '/proyectos/clinicas_6.png', 
        alt: 'App para E/S de Mercancía',
        title: 'App para E/S Mercancía con Escáner QR',
        description: 'Aplicación móvil para empresas de logística y transporte que permite registrar y validar la recepción y entrega de mercancía mediante escaneo de códigos QR. Incluye validaciones en tiempo real contra facturas, trazabilidad completa del proceso, firmas digitales, captura de evidencias fotográficas y notificaciones automáticas. Sistema diseñado para optimizar el control de mercancía en tránsito.',
        client: 'Empresa de Logística',
        date: '2024'
      },
    ],
  },
};

export default function GaleriaPage() {
  const [activeSection, setActiveSection] = useState<GallerySection>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectImage | null>(null);

  // Cerrar modal con tecla ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedProject]);

  // Prevenir scroll cuando el modal está abierto
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
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Galería de Proyectos</h1>
            <p className="mt-3 text-lg text-gray-600">Explora nuestros trabajos realizados en diferentes áreas</p>
          </div>

          {/* Category Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
            {/* CCTV Section Button */}
            <button
              onClick={() => setActiveSection(activeSection === 'cctv' ? null : 'cctv')}
              className={`group relative overflow-hidden rounded-2xl p-6 sm:p-8 text-left transition-all duration-300 ${
                activeSection === 'cctv'
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl scale-105'
                  : 'bg-white hover:shadow-lg hover:scale-[1.02] shadow-md'
              }`}
            >
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full mb-4 ${
                  activeSection === 'cctv' ? 'bg-white/20' : 'bg-blue-100'
                }`}>
                  <svg className={`w-6 h-6 sm:w-7 sm:h-7 ${activeSection === 'cctv' ? 'text-white' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${activeSection === 'cctv' ? 'text-white' : 'text-gray-900'}`}>
                  CCTV
                </h3>
                <p className={`text-sm ${activeSection === 'cctv' ? 'text-blue-100' : 'text-gray-600'}`}>
                  Sistemas de videovigilancia
                </p>
                <div className={`mt-4 text-sm font-medium ${activeSection === 'cctv' ? 'text-white' : 'text-blue-600'}`}>
                  {activeSection === 'cctv' ? '✓ Ver menos' : '→ Ver proyectos'}
                </div>
              </div>
            </button>

            {/* Cableado Estructurado Section Button */}
            <button
              onClick={() => setActiveSection(activeSection === 'cableado' ? null : 'cableado')}
              className={`group relative overflow-hidden rounded-2xl p-6 sm:p-8 text-left transition-all duration-300 ${
                activeSection === 'cableado'
                  ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-xl scale-105'
                  : 'bg-white hover:shadow-lg hover:scale-[1.02] shadow-md'
              }`}
            >
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full mb-4 ${
                  activeSection === 'cableado' ? 'bg-white/20' : 'bg-emerald-100'
                }`}>
                  <svg className={`w-6 h-6 sm:w-7 sm:h-7 ${activeSection === 'cableado' ? 'text-white' : 'text-emerald-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${activeSection === 'cableado' ? 'text-white' : 'text-gray-900'}`}>
                  Cableado Estructurado
                </h3>
                <p className={`text-sm ${activeSection === 'cableado' ? 'text-emerald-100' : 'text-gray-600'}`}>
                  Infraestructura de redes
                </p>
                <div className={`mt-4 text-sm font-medium ${activeSection === 'cableado' ? 'text-white' : 'text-emerald-600'}`}>
                  {activeSection === 'cableado' ? '✓ Ver menos' : '→ Ver proyectos'}
                </div>
              </div>
            </button>

            {/* Software Section Button */}
            <button
              onClick={() => setActiveSection(activeSection === 'software' ? null : 'software')}
              className={`group relative overflow-hidden rounded-2xl p-6 sm:p-8 text-left transition-all duration-300 ${
                activeSection === 'software'
                  ? 'bg-gradient-to-br from-purple-600 to-purple-700 shadow-xl scale-105'
                  : 'bg-white hover:shadow-lg hover:scale-[1.02] shadow-md'
              }`}
            >
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full mb-4 ${
                  activeSection === 'software' ? 'bg-white/20' : 'bg-purple-100'
                }`}>
                  <svg className={`w-6 h-6 sm:w-7 sm:h-7 ${activeSection === 'software' ? 'text-white' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${activeSection === 'software' ? 'text-white' : 'text-gray-900'}`}>
                  Software
                </h3>
                <p className={`text-sm ${activeSection === 'software' ? 'text-purple-100' : 'text-gray-600'}`}>
                  Desarrollo a la medida
                </p>
                <div className={`mt-4 text-sm font-medium ${activeSection === 'software' ? 'text-white' : 'text-purple-600'}`}>
                  {activeSection === 'software' ? '✓ Ver menos' : '→ Ver proyectos'}
                </div>
              </div>
            </button>
          </div>

          {/* Gallery Display */}
          {activeSection && (
            <div className="animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {galleryData[activeSection].title}
                </h2>
                <p className="text-gray-600 mb-8">
                  {galleryData[activeSection].description}
                </p>

                {/* Image Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {galleryData[activeSection].images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedProject(image)}
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
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
                          <p className="text-white/90 text-xs">Click para ver detalles →</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!activeSection && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-200 mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Selecciona una categoría
              </h3>
              <p className="text-gray-600">
                Haz clic en una de las categorías de arriba para ver los proyectos
              </p>
            </div>
          )}
        </div>

        {/* Modal de Detalles del Proyecto */}
        {selectedProject && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
            onClick={() => setSelectedProject(null)}
          >
            <div 
              className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón Cerrar */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Cerrar modal"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Imagen del Proyecto */}
              <div className="relative aspect-video bg-gray-100 rounded-t-2xl overflow-hidden">
                <Image
                  src={selectedProject.src}
                  alt={selectedProject.alt}
                  fill
                  className="object-contain p-8"
                />
              </div>

              {/* Contenido del Modal */}
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {selectedProject.title}
                  </h2>
                  <div className="flex flex-wrap gap-3 text-sm">
                    {selectedProject.client && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{selectedProject.client}</span>
                      </div>
                    )}
                    {selectedProject.date && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{selectedProject.date}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Descripción */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción del Proyecto</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                {/* Botón de Contacto */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/+525550317183?text=Hola%20EDM%20Comunicaciones,%20me%20interesa%20un%20proyecto%20similar..."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-center text-white shadow-md transition hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/>
                      <path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38zM17.75 27.1c-2.22 0-4.39-.6-6.28-1.73l-.45-.27-5.07 1.33 1.35-4.94-.3-.51c-1.21-2.02-1.85-4.34-1.85-6.77 0-7.31 5.95-13.26 13.26-13.26 3.54 0 6.86 1.38 9.36 3.89 2.49 2.5 3.87 5.82 3.87 9.36 0 7.31-5.95 13.26-13.26 13.26z"/>
                    </svg>
                    Solicitar Proyecto Similar
                  </a>
                  <a
                    href="mailto:edm_comunicaciones@hotmail.com?subject=Consulta sobre proyecto&body=Hola, me interesa obtener más información sobre sus proyectos."
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-white border-2 border-gray-300 px-6 py-3 text-center text-gray-700 shadow-md transition hover:shadow-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400/50 active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    Enviar Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

