"use client";
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import Image from 'next/image';

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
  challenge?: string[];
  solution?: string;
  results?: string[];
  technicalScope?: string[];
  impact?: string;
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
    description: 'Diseñamos e implementamos la infraestructura de red para que el centro de capacitación operara sin problemas. Internet rápido, Wi-Fi sin zonas muertas y cables organizados para los próximos 25 años.',
    challenge: [
      'Señal Wi-Fi inestable en algunas áreas',
      'Lentitud en la red al conectar varios equipos',
      'Cableado desordenado y sin estructura definida'
    ],
    solution: 'Se rediseñó la red desde cero, implementando una infraestructura organizada y adecuada al número de usuarios y dispositivos del sitio.',
    results: [
      '30 puntos de red instalados y probados',
      'Cobertura Wi-Fi optimizada en aulas y áreas comunes',
      'Segmentación de red para mejor desempeño',
      'Reducción de interferencias y caídas de conexión',
      'Cableado etiquetado y documentado para mantenimiento'
    ],
    technicalScope: [
      'Cableado estructurado categoría 6A',
      'Access points para cobertura interna',
      'Enlaces de fibra óptica entre áreas',
      'Organización en rack con patch panel'
    ],
    impact: 'La red permite operar clases, sistemas y acceso a internet de forma estable, incluso con múltiples usuarios conectados al mismo tiempo.',
    features: [
      '30 puntos de red certificados para máxima velocidad',
      'Wi-Fi mesh que cubre todo el edificio',
      'Fibra óptica para conexión ultrarrápida',
      'Garantía de 25 años en instalación'
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
    title: 'Acceso y Asistencia Corporativa',
    client: 'Novaprint',
    year: '2025',
    category: 'Biometría',
    description: 'Implementamos un sistema para saber exactamente quién entra y sale, con registros confiables para RRHH. Ya no más hojas de asistencia ni errores en los checadores.',
    challenge: [
      'Registro manual generaba errores y poca visibilidad sobre horarios',
      'Necesidad de restringir accesos a ciertas áreas',
      'Requerían un registro confiable de eventos'
    ],
    solution: 'Se implementó un sistema de control de acceso y asistencia mediante dispositivos biométricos, conectados a una plataforma central con respaldo en la nube.',
    results: [
      '5 puntos de acceso controlados con biometría',
      'Registro automático de entradas y salidas del personal',
      'Reducción de errores en el control de asistencia',
      'Acceso restringido por áreas autorizadas',
      'Historial de accesos con registro de eventos'
    ],
    technicalScope: [
      'Terminales biométricas (huella y reconocimiento facial)',
      'Configuración de accesos por usuario y horarios',
      'Integración con sistema de control de asistencia',
      'Respaldo de información en la nube',
      'Registro de eventos con evidencia (fotografía)'
    ],
    impact: 'Ahora la empresa tiene control claro sobre la asistencia del personal y acceso a sus instalaciones, con información confiable y fácil de consultar.',
    features: [
      '5 puntos de acceso con huella y reconocimiento facial',
      'Reportes automáticos para nómina',
      'Anti-passback: nadie entra con credencial de otro',
      'Acceso desde cualquier lugar vía nube'
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
    title: 'Sistema Hospitalario Integral',
    client: 'Clínica Santa Teresa',
    year: '2025',
    category: 'Software',
    description: 'Creamos un sistema a medida para que la clínica tuviera todo digitalizado: pacientes, citas, expedientes, inventarios y recetas. Menos papel, más tiempo para atender.',
    challenge: [
      'Control manual de pacientes, consultas e inventario en distintos sistemas',
      'Duplicidad de información y pérdida de tiempo en registros',
      'Dificultad para consultar historiales clínicos',
      'Poco control sobre medicamentos'
    ],
    solution: 'Se desarrolló un sistema integral a la medida que centraliza la información clínica, administrativa y operativa en una sola plataforma accesible en línea.',
    results: [
      'Centralización de información de pacientes en un solo sistema',
      'Consulta rápida de expedientes clínicos',
      'Mejor control de inventario de medicamentos',
      'Reducción de errores en recetas y registros',
      'Acceso al sistema desde distintas áreas de la clínica'
    ],
    technicalScope: [
      'Módulo de expediente clínico electrónico',
      'Gestión de consultas y pacientes',
      'Control de inventario médico',
      'Generación de recetas digitales',
      'Sistema alojado en la nube para acceso remoto'
    ],
    impact: 'La clínica ahora cuenta con un sistema organizado y confiable que mejora la atención a pacientes y facilita el trabajo del personal médico y administrativo.',
    features: [
      'Expediente electrónico accesible desde cualquier área',
      'Control de inventario de medicamentos',
      'Recetas digitales con firma electrónica',
      'Agenda de citas en línea para pacientes'
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
    description: 'Desarrollamos un sistema de ventas e inventarios para que supieran exactamente qué tenían, qué se vendía y cuánto ganaban. En varias sucursales, todo conectado.',
    challenge: [
      'Sin visibilidad clara de inventario en tiempo real',
      'Dificultad para controlar ventas entre sucursales',
      'Procesos manuales que consumían tiempo del personal',
      'Necesidad de reportes para tomar decisiones'
    ],
    solution: 'Se desarrolló un sistema integral de punto de venta con control de inventario, conectado entre todas las sucursales para tener información unificada y decisiones basadas en datos reales.',
    results: [
      'Inventario actualizado en tiempo real por sucursal',
      'Ventas registradas al instante desde cualquier punto de venta',
      'Reportes de ventas y métricas por sucursal y global',
      'Reducción de errores en conteo de mercancía',
      'Decisiones basadas en datos reales yactualizados'
    ],
    technicalScope: [
      'Punto de venta con terminal bancaria integrada',
      'Lector de código de barras para ágil registro',
      'Dashboard ejecutivo con gráficas y métricas',
      'Arquitectura multi-sucursal con sincronización',
      'Funciona offline y se sincroniza cuando hay conexión'
    ],
    impact: 'El negocio ahora tiene control total de ventas e inventario, con información clara para tomar mejores decisiones y operaciones más eficientes en todas las sucursales.',
    features: [
      'Punto de venta rápido con terminal bancaria',
      'Inventario actualizado en tiempo real',
      'Reportes de ventas por sucursal',
      'Funciona offline, se sincroniza después'
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
    title: 'App Móvil Control de Entradas y Salidas',
    client: 'Almacén Logístico',
    year: '2023',
    category: 'Desarrollo Móvil',
    description: 'Creamos una app para que los operadores recibieran mercancía escaneando códigos de barras. Sin errores, sin papel y con validación automática contra las facturas.',
    challenge: [
      'Recepción manual de mercancía con errores frecuentes',
      'Sin forma de validar rapidamente contra órdenes de compra',
      'Operadores sin internet en áreas de almacén',
      'Necesidad de reportes inmediatos de entradas y salidas'
    ],
    solution: 'Se desarrolló una aplicación móvil que permite escanear códigos de barras para validar mercancía, funcionando sin conexión a internet y sincronizando datos automáticamente.',
    results: [
      'Reducción de errores en recepción de mercancía',
      'Validación automática contra órdenes de compra',
      'Funcionamiento offline en áreas sin cobertura',
      'Reportes de entradas y salidas en tiempo real',
      'Sincronización automática cuando hay conexión'
    ],
    technicalScope: [
      'Lector de códigos de barras 1D y 2D integrado',
      'Validación automática contra base de datos',
      'Modo offline-first con sincronización en segundo plano',
      'Panel web administrativo para reportes',
      'Notificaciones push para alertas de validación'
    ],
    impact: 'El almacén ahora recibe mercancía de forma ágil y sin errores, con trazabilidad completa de entradas y salidas desde cualquier dispositivo.',
    features: [
      'Escaneo rápido de códigos de barras 1D y 2D',
      'Validación automática contra orden de compra',
      'Funciona sin internet y se sincroniza después',
      'Reportes en tiempo real desde cualquier lugar'
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
    title: 'Monitoreo y Seguridad Integral',
    client: 'Ballotini Panamericana',
    year: '2025',
    category: 'CCTV',
    description: 'Instalamos 24 cámaras para que el negocio estuviera protegido las 24 horas. Imagen clara, acceso desde el celular y respaldo seguro. Tranquilidad real.',
    challenge: [
      'Sin visibilidad completa de todas las áreas',
      'Sin sistema centralizado de monitoreo',
      'Necesidad de evidencia ante incidentes',
      'Requieren acceso remoto para supervisar desde cualquier lugar'
    ],
    solution: 'Se implementó un sistema de videovigilancia IP que permite monitorear en tiempo real diferentes áreas, con grabación continua y acceso remoto.',
    results: [
      '24 cámaras instaladas en áreas clave (interior y exterior)',
      'Cobertura completa de zonas operativas y accesos',
      'Monitoreo centralizado desde un solo punto',
      'Grabación continua para consulta de eventos',
      'Acceso remoto desde celular y computadora'
    ],
    technicalScope: [
      'Cámaras IP con visión nocturna',
      'Grabador (NVR) para almacenamiento local',
      'Organización de grabación por eventos y horarios',
      'Acceso remoto seguro desde cualquier dispositivo',
      'Respaldo de información para consulta posterior'
    ],
    impact: 'Ahora la empresa puede supervisar sus instalaciones en todo momento, contar con evidencia ante incidentes y mejorar el control interno.',
    features: [
      '24 cámaras con visión nocturna',
      'Monitoreo desde celular en tiempo real',
      'Respaldo automático para consulta posterior',
      'Hasta 30 días de historial de video'
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
  return (
    <div className="group">
      <Reveal delay={index * 0.1}>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-accent to-purple-500 rounded-full" />
          
          <div className="pl-8 lg:pl-12 py-8 lg:py-12">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              <div className="lg:col-span-3 space-y-6">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${project.bgColor} text-white`}>
                    {project.category}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{project.year}</span>
                </div>
                
                <div>
                  <p className="text-sm text-accent font-medium mb-1">{project.client}</p>
                  <h3 className="text-3xl lg:text-4xl font-black text-brand leading-tight">{project.title}</h3>
                </div>
                
                <p className="text-gray-600 leading-relaxed text-lg">{project.description}</p>
                
                {project.challenge && project.challenge.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-0.5 bg-gradient-to-r ${project.bgColor}`} />
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">El reto</span>
                    </div>
                    <ul className="space-y-2 pl-4 border-l-2 border-gray-200">
                      {project.challenge.map((item, i) => (
                        <li key={i} className="text-gray-700 text-sm leading-relaxed">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {project.solution && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-0.5 bg-gradient-to-r ${project.bgColor}`} />
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">La solución</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed pl-4 border-l-2 border-gray-200">{project.solution}</p>
                  </div>
                )}
                
                {project.results && project.results.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-0.5 bg-gradient-to-r ${project.bgColor}`} />
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Resultados</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {project.results.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${project.bgColor} mt-1.5 flex-shrink-0`} />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {project.technicalScope && project.technicalScope.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-0.5 bg-gradient-to-r ${project.bgColor}`} />
                      <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Especificaciones</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technicalScope.map((item, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {project.impact && (
                  <div className="p-5 bg-gradient-to-r from-brand/5 to-transparent rounded-r-xl border-l-4 border-brand">
                    <p className="text-gray-700 text-sm leading-relaxed italic">
                      "{project.impact}"
                    </p>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 gap-3">
                  {project.images.map((img, i) => (
                    <div 
                      key={i}
                      className={`relative rounded-xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:scale-[1.02] ${i === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
                    >
                      <Image 
                        src={img.src}
                        alt={img.alt}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Casos de Éxito
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                    <span className="text-gradient-brand">Proyectos que</span>
                    <br />
                    <span className="text-brand">ayudan a crecer negocios</span>
                  </h1>
                  <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Cada proyecto que realizamos está enfocado en resolver problemas reales 
                    y generar resultados visibles para nuestros clientes.
                  </p>
                </div>
              </Reveal>
              
              <Reveal delay={0.15}>
                <div className="mt-12 p-8 bg-gradient-to-br from-brand/5 via-accent/5 to-brand/5 rounded-3xl border border-brand/10 max-w-4xl mx-auto">
                  <h3 className="text-lg font-bold text-brand mb-6 text-center">📈 Resultados que nos respaldan</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="text-3xl font-black text-brand">+50</div>
                      <p className="mt-1 text-sm text-gray-600">clientes atendidos</p>
                    </div>
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-3xl font-black text-brand">6</div>
                      <p className="mt-1 text-sm text-gray-600">proyectos recientes</p>
                    </div>
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-3xl font-black text-brand">100%</div>
                      <p className="mt-1 text-sm text-gray-600">clientes satisfechos</p>
                    </div>
                    <div className="text-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-3xl font-black text-brand">12+</div>
                      <p className="mt-1 text-sm text-gray-600">años de experiencia</p>
                    </div>
                  </div>
                </div>
              </Reveal>
              
              <Reveal delay={0.25}>
                <div className="mt-10 p-6 bg-gradient-to-r from-brand/10 via-accent/10 to-brand/10 rounded-2xl border border-brand/20 max-w-3xl mx-auto">
                  <p className="text-center text-lg md:text-xl text-brand font-medium leading-relaxed">
                    <span className="text-2xl md:text-3xl font-black text-accent">"</span>
                    Nos enfocamos en soluciones prácticas que realmente impactan en el día a día de cada negocio.
                    <span className="text-2xl md:text-3xl font-black text-accent">"</span>
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          <section className="py-12 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="space-y-0">
                {projects.map((project, index) => (
                  <div key={project.id}>
                    <ProjectCard project={project} index={index} />
                    {index < projects.length - 1 && (
                      <div className="my-12 border-t border-dashed border-gray-200" />
                    )}
                  </div>
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
                  <span className="text-white/90 text-sm font-medium">Tu proyecto puede ser el siguiente</span>
                </div>
              </Reveal>
              
              <Reveal delay={0.1}>
                <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                  ¿Listo para ser nuestro<br />próximo caso de éxito?
                </h2>
              </Reveal>
              
              <Reveal delay={0.2}>
                <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
                  Cuéntanos tu problema o necesidad. Te ayudamos a encontrar la mejor solución para hacer crecer tu negocio.
                </p>
              </Reveal>
              
              <Reveal delay={0.3}>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://wa.me/+525550317183?text=Hola%20EDM%20Comunicaciones,%20quiero%20hablar%20de%20un%20proyecto%20para%20mi%20negocio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-brand font-bold rounded-xl hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="currentColor">
                      <path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/>
                      <path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38z"/>
                    </svg>
                    Hablemos de Mi Proyecto
                  </a>
                  <a
                    href="mailto:edm_comunicaciones@hotmail.com?subject=Hablemos%20de%20mi%20proyecto&body=Hola,%20me%20gustaría%20conocer%20más%20sobre%20cómo%20ustedes%20pueden%20ayudar%20a%20mi%20negocio."
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
