"use client";
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import Image from 'next/image';
import { useState } from 'react';

export default function ProyectosPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h1 className="text-center text-3xl sm:text-4xl font-bold tracking-tight">Casos de Éxito</h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-4 text-center text-lg text-gray-600 max-w-3xl mx-auto">
                Proyectos ejecutados con excelencia técnica, entrega puntual y resultados medibles para empresas líderes en su sector.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Proyecto 1: Kenworth */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="border-l-4 border-blue-600 pl-6 mb-8">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-3xl font-bold text-gray-900">Centro de Capacitación — Voz y Datos</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">2024</span>
                </div>
                <p className="mt-2 text-lg text-gray-600">Kenworth Mexicana</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700">
                  Implementación integral de infraestructura de telecomunicaciones para el nuevo centro de capacitación técnica de Kenworth Mexicana. 
                  El proyecto incluyó el diseño, instalación y certificación de cableado estructurado Cat 6A para 30 estaciones de trabajo en aulas interactivas,
                  despliegue de red Wi-Fi empresarial mesh con roaming automático en comedores, áreas de cursos y pasillos, y configuración de VLANs segmentadas
                  por tipo de usuario (instructores, alumnos, administrativos).
                </p>
                <p className="mt-4 text-gray-700">
                  Se instalaron 8 access points Ubiquiti UniFi de última generación con controller en nube, garantizando cobertura total y throughput de 300 Mbps
                  en todas las zonas. El cableado backbone incluye fibra óptica OM4 entre el site principal y los racks distribuidos, con switches administrables
                  Cisco Catalyst para garantizar QoS y gestión centralizada. Se entregó documentación completa de topología, certificados Fluke y garantía extendida de 25 años.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>30 puntos de datos certificados Cat 6A</strong> para estaciones de trabajo en 3 aulas de capacitación.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Red Wi-Fi empresarial mesh</strong> con 8 APs, SSID por perfil y autenticación WPA3-Enterprise.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Backbone de fibra óptica OM4</strong> con switches administrables y segmentación por VLANs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Certificación Fluke</strong> de todos los enlaces y garantía de 25 años en instalación.</span>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage("/vozydatos.png")}
                >
                  <Image 
                    src="/vozydatos.png" 
                    alt="Kenworth proyecto 1" 
                    width={400}
                    height={300}
                    className="object-contain max-w-full max-h-full p-4"
                  />
                </div>
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage("/vozydatoswifi.png")}
                >
                  <Image 
                    src="/vozydatoswifi.png" 
                    alt="Kenworth proyecto 2" 
                    width={400}
                    height={300}
                    className="object-contain max-w-full max-h-full p-4"
                  />
                </div>
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage("/switches.png")}
                >
                  <Image 
                    src="/switches.png" 
                    alt="Kenworth proyecto 3" 
                    width={400}
                    height={300}
                    className="object-contain max-w-full max-h-full p-4"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Proyecto 2: Novaprint */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="border-l-4 border-green-600 pl-6 mb-8">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-3xl font-bold text-gray-900">Control de Acceso Biométrico Corporativo</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">2025</span>
                </div>
                <p className="mt-2 text-lg text-gray-600">Novaprint</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700">
                  Instalación y configuración de sistema integral de control de asistencia y acceso biométrico en las 5 entradas del corporativo Novaprint.
                  Se implementaron terminales de huella dactilar y reconocimiento facial de última generación (ZKTeco) con lector dual para máxima precisión,
                  integrados a plataforma centralizada de RRHH para reportería en tiempo real, cálculo automático de horas extra, retardos y gestión de incidencias.
                </p>
                <p className="mt-4 text-gray-700">
                  El sistema permite control de acceso diferenciado por horarios y perfiles de empleado, sincronización automática con Active Directory,
                  backup en nube y notificaciones push a supervisores. Se configuró control anti-passback para evitar registros duplicados, logs de auditoría
                  con foto capturada en cada evento y exportación a sistemas de nómina (edm comuniciones biométrico). Capacitación al personal de RRHH y manuales de operación incluidos.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>5 terminales biométricas dual</strong> (huella + facial) en entradas corporativas con lector de proximidad RFID.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Integración con RRHH:</strong> sincronización de plantilla, reportes automáticos y exportación a nómina.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Control anti-passback</strong> y perfiles horarios diferenciados por departamento con alertas en tiempo real.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Respaldo en nube</strong> y logs de auditoría con captura fotográfica en cada registro de acceso.</span>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage("/biometrico.png")}
                >
                  <Image 
                    src="/biometrico.png" 
                    alt="Novaprint proyecto 1" 
                    width={400}
                    height={300}
                    className="object-contain max-w-full max-h-full p-4"
                  />
                </div>
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage("/sistemabiometrico.png")}
                >
                  <Image 
                    src="/sistemabiometrico.png" 
                    alt="Novaprint proyecto 2" 
                    width={400}
                    height={300}
                    className="object-contain max-w-full max-h-full p-4"
                  />
                </div>
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage("/biometricohorarios.png")}
                >
                  <Image 
                    src="/biometricohorarios.png" 
                    alt="Novaprint proyecto 3" 
                    width={400}
                    height={300}
                    className="object-contain max-w-full max-h-full p-4"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Proyecto 3: Clinik's */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="border-l-4 border-purple-600 pl-6 mb-8">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-3xl font-bold text-gray-900">Clinik's — Sistema Hospitalario Integral</h2>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">2025</span>
                </div>
                <p className="mt-2 text-lg text-gray-600">Clínica Santa Teresa</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700">
                  Desarrollo e implementación de sistema clínico hospitalario a la medida (Clinik's) para gestión integral de consultas, expedientes electrónicos,
                  inventario de medicamentos e insumos médicos, y expedición de recetas digitales con firma electrónica. La plataforma web responsiva permite acceso
                  simultáneo desde consultorios, farmacia interna, admisión y laboratorio, con roles granulares por perfil de usuario (médicos, enfermeras, administrativos).
                </p>
                <p className="mt-4 text-gray-700">
                  Incluye módulo de expediente clínico electrónico (ECE) con historial médico completo, alergias, antecedentes heredofamiliares, signos vitales y notas
                  de evolución con anexos multimedia (estudios radiológicos, laboratorios). El control de inventarios cuenta con alertas de stock mínimo, caducidades próximas,
                  trazabilidad de lotes y reportes de consumo por departamento. La expedición de recetas genera PDF con código QR de validación y firma digital del médico tratante.
                  Sistema 100% en nube (Azure), con respaldos automáticos diarios, cifrado AES-256 y cumplimiento de NOM-024-SSA3 (expediente clínico).
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Expediente clínico electrónico completo:</strong> historial, signos vitales, alergias, notas de evolución y anexos multimedia.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Control de inventario médico:</strong> alertas de stock/caducidad, trazabilidad de lotes y reportes de consumo.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Recetas digitales con firma electrónica</strong> y código QR de validación, cumplimiento NOM-024-SSA3.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Plataforma en nube Azure</strong> con respaldos automáticos, cifrado AES-256 y acceso multiplataforma.</span>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage("/cliniks.png")}
                >
                  <Image 
                    src="/cliniks.png" 
                    alt="Cliniks proyecto 1" 
                    width={400}
                    height={300}
                    className="object-contain max-w-full max-h-full p-4"
                  />
                </div>
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage("/cliniks_pacientes.png")}
                >
                  <Image 
                    src="/cliniks_pacientes.png" 
                    alt="Cliniks proyecto 2" 
                    width={400}
                    height={300}
                    className="object-contain max-w-full max-h-full p-4"
                  />
                </div>
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage("/cliniks_reservaciones.png")}
                >
                  <Image 
                    src="/cliniks_reservaciones.png" 
                    alt="Cliniks proyecto 3" 
                    width={400}
                    height={300}
                    className="object-contain max-w-full max-h-full p-4"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Proyecto 4: DecoraTuHome */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="border-l-4 border-orange-600 pl-6 mb-8">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-3xl font-bold text-gray-900">Sistema de Punto de Venta y Control de Inventarios</h2>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">2024</span>
                </div>
                <p className="mt-2 text-lg text-gray-600">DecoraTuHome</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700">
                  Sistema de punto de venta (POS) integral desarrollado para DecoraTuHome, retail especializado en artículos de decoración y hogar. La solución incluye
                  módulo de ventas con lector de código de barras, integración con terminales bancarias Verifone para cobro con tarjeta (EMV, contactless), impresión
                  térmica de tickets fiscales y no fiscales, y gestión de descuentos por promoción o mayoreo.
                </p>
                <p className="mt-4 text-gray-700">
                  El control de mercancías cuenta con entrada por compra (validación vs. orden de compra), salida por venta automática, ajustes de inventario con autorización
                  por supervisor, trazabilidad de movimientos y alertas de reorden. Dashboard ejecutivo en tiempo real con gráficas de ventas por categoría, productos más vendidos,
                  margen de utilidad y análisis de rotación. Reportes visuales exportables (PDF/Excel): corte de caja, ventas por cajero, inventario valorizado y análisis ABC.
                  Sistema multi-sucursal con sincronización centralizada y arquitectura offline-first (funciona sin internet y sincroniza al reconectar).
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>POS completo:</strong> lector de código de barras, integración con terminal Verifone e impresora térmica de tickets.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Control de inventarios:</strong> entradas/salidas, ajustes autorizados, alertas de reorden y trazabilidad completa.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Dashboard ejecutivo</strong> con gráficas de ventas, margen de utilidad y análisis de rotación en tiempo real.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Multi-sucursal offline-first:</strong> funciona sin internet y sincroniza automáticamente al reconectar.</span>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => setSelectedImage("/proyectos/decotuhome_panel.jpeg")}
                >
                  <Image 
                    src="/proyectos/decotuhome_panel.jpeg" 
                    alt="DecoraTuHome proyecto 1" 
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => setSelectedImage("/proyectos/decotuhome_venta.jpeg")}
                >
                  <Image 
                    src="/proyectos/decotuhome_venta.jpeg" 
                    alt="DecoraTuHome proyecto 2" 
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
                  onClick={() => setSelectedImage("/proyectos/decotuhome_reportes.jpeg")}
                >
                  <Image 
                    src="/proyectos/decotuhome_reportes.jpeg" 
                    alt="DecoraTuHome proyecto 3" 
                    width={400}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Proyecto 5: App Móvil Control de Mercancías */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="border-l-4 border-indigo-600 pl-6 mb-8">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-3xl font-bold text-gray-900">App Móvil para Control de Entradas/Salidas de Mercancías</h2>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">2023</span>
                </div>
                <p className="mt-2 text-lg text-gray-600">Almacén Logístico</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700">
                  Aplicación móvil nativa (Android/iOS) para validación en tiempo real de entradas y salidas de mercancía en almacén mediante lectura de código de barras.
                  La app permite al personal de recepción y embarques escanear productos, comparar automáticamente vs. factura digital (XML) o remisión, detectar discrepancias
                  (cantidad, SKU, lote) y generar reportes de incidencias con captura fotográfica y geolocalización del evento.
                </p>
                <p className="mt-4 text-gray-700">
                  Incluye modo offline para operar en zonas sin cobertura (almacenes cerrados, contenedores), sincronización automática al reconectar, firma digital del transportista
                  en pantalla y generación de acuse de recibo con sello de tiempo. Integración nativa con cámara del dispositivo para lector de código de barras 1D/2D (EAN-13, Code 128, QR),
                  notificaciones push ante discrepancias críticas y panel web administrativo con dashboard de movimientos, histórico de validaciones y reportes descargables.
                  Stack: React Native + Node.js + PostgreSQL + AWS S3 (almacenamiento de evidencias fotográficas).
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Lector de código de barras integrado:</strong> escaneo rápido 1D/2D (EAN-13, Code 128, QR) desde cámara del móvil.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Validación automática vs. factura/remisión:</strong> detección de discrepancias en cantidad, SKU o lote con alertas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Modo offline-first:</strong> funciona sin internet en almacenes, sincroniza automáticamente y guarda evidencias fotográficas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Panel web administrativo:</strong> dashboard de movimientos, histórico de validaciones y reportes exportables PDF/Excel.</span>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage("/inventario_login.png")}
                >
                  <Image 
                    src="/inventario_login.png" 
                    alt="App Mercancia proyecto 1" 
                    width={400}
                    height={300}
                    className="object-contain max-w-full max-h-full p-4"
                  />
                </div>
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage("/inventario_captura.png")}
                >
                  <Image 
                    src="/inventario_captura.png" 
                    alt="App Mercancia proyecto 2" 
                    width={400}
                    height={300}
                    className="object-contain max-w-full max-h-full p-4"
                  />
                </div>
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage("/inventario_reporte.png")}
                >
                  <Image 
                    src="/inventario_reporte.png" 
                    alt="App Mercancia proyecto 3" 
                    width={400}
                    height={300}
                    className="object-contain max-w-full max-h-full p-4"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Proyecto 6: Ballotini Panamericana - CCTV */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="border-l-4 border-red-600 pl-6 mb-8">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-3xl font-bold text-gray-900">Sistema de Videovigilancia Integral</h2>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">2025</span>
                </div>
                <p className="mt-2 text-lg text-gray-600">Ballotini Panamericana</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700">
                  Implementación completa de sistema de videovigilancia IP para las instalaciones de Ballotini Panamericana, 
                  incluyendo planta de producción, almacenes, oficinas administrativas y áreas perimetrales. Se instalaron 
                  24 cámaras IP de alta resolución (4K/8MP) con tecnología de visión nocturna IR, detección de movimiento 
                  inteligente y analítica de video avanzada para monitoreo 24/7 de la operación industrial.
                </p>
                <p className="mt-4 text-gray-700">
                  El sistema incluye NVR empresarial con almacenamiento RAID 6 para redundancia, respaldo en nube híbrido 
                  y acceso remoto multiplataforma. Se configuraron zonas de detección personalizadas, alertas automáticas 
                  por email/SMS, mapas de calor para análisis de tráfico y integración con sistema de control de acceso 
                  existente. Incluye mantenimiento preventivo trimestral, actualización de firmware y soporte técnico 24/7.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>24 cámaras IP 4K/8MP:</strong> cobertura total de planta, almacenes, oficinas y perímetro con visión nocturna IR hasta 50m.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>NVR empresarial:</strong> almacenamiento RAID 6, 30 días de grabación continua y respaldo automático en nube.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Analítica inteligente:</strong> detección de intrusión, conteo de personas, mapas de calor y alertas automáticas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Acceso remoto:</strong> monitoreo desde web, iOS y Android con notificaciones push en tiempo real.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold">✓</span>
                    <span className="text-gray-700"><strong>Mantenimiento integral:</strong> servicio preventivo trimestral, actualizaciones y soporte técnico 24/7 incluido.</span>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage("/cctv_instalacion.png")}
                >
                  <Image 
                    src="/cctv_instalacion.png" 
                    alt="CCTV instalación" 
                    width={400}
                    height={300}
                    className="object-contain max-w-full max-h-full p-4"
                  />
                </div>
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage("/cctv_monitoreo.png")}
                >
                  <Image 
                    src="/cctv_monitoreo.png" 
                    alt="CCTV monitoreo" 
                    width={400}
                    height={300}
                    className="object-contain max-w-full max-h-full p-4"
                  />
                </div>
                <div 
                  className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage("/cctv_analitica.png")}
                >
                  <Image 
                    src="/cctv_analitica.png" 
                    alt="CCTV analítica" 
                    width={400}
                    height={300}
                    className="object-contain max-w-full max-h-full p-4"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-sky-500 to-blue-600">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">¿Listo para ser nuestro próximo caso de éxito?</h2>
              <p className="mt-4 text-lg text-white/90">Transformamos desafíos técnicos en soluciones que generan valor real para tu negocio.</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/525530358478?text=Hola,%20quiero%20iniciar%20un%20proyecto%20con%20EDM%20Comunicaciones"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-sky-600 shadow-lg transition hover:shadow-xl active:scale-95 font-semibold"
                >
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 32 32" fill="currentColor"><path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/><path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38zM17.75 27.1c-2.22 0-4.39-.6-6.28-1.73l-.45-.27-5.07 1.33 1.35-4.94-.3-.51c-1.21-2.02-1.85-4.34-1.85-6.77 0-7.31 5.95-13.26 13.26-13.26 3.54 0 6.86 1.38 9.36 3.89 2.49 2.5 3.87 5.82 3.87 9.36 0 7.31-5.95 13.26-13.26 13.26z"/></svg>
                  Iniciar mi proyecto
                </a>
                <a
                  href="mailto:edm_comunicaciones@hotmail.com?subject=Consulta%20sobre%20proyectos&body=Hola,%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20proyectos."
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-3 text-white transition hover:bg-white/10 font-semibold"
                >
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  Más información
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />

      {/* Modal de imagen */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] mx-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Cerrar imagen"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={selectedImage}
                alt="Imagen del proyecto"
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}