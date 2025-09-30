import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import Image from 'next/image';

export default function ServiciosPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h1 className="text-center text-3xl sm:text-4xl font-bold tracking-tight">Soluciones Integrales en Infraestructura de Telecomunicaciones</h1>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-4 text-center text-lg text-gray-600 max-w-3xl mx-auto">
                Diseñamos, implementamos y certificamos infraestructura de red y seguridad de clase empresarial con estándares internacionales.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Cards intro */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              <Reveal>
                <a href="#cctv" className="block rounded-xl border-t-4 border-gray-500 bg-white p-6 shadow-sm hover:shadow-md transition cursor-pointer">
                  <h3 className="text-xl font-bold text-gray-900">CCTV</h3>
                  <p className="mt-2 text-sm text-gray-600">Sistemas de videovigilancia IP con analítica de video, monitoreo 24/7 y respaldo en nube.</p>
                </a>
              </Reveal>
              <Reveal delay={0.05}>
                <a href="#cableado" className="block rounded-xl border-t-4 border-blue-500 bg-white p-6 shadow-sm hover:shadow-md transition cursor-pointer">
                  <h3 className="text-xl font-bold text-gray-900">Cableado Estructurado</h3>
                  <p className="mt-2 text-sm text-gray-600">Infraestructura de red Cat 6A/7 y fibra óptica certificada con garantía extendida de 25 años.</p>
                </a>
              </Reveal>
              <Reveal delay={0.1}>
                <a href="#mantenimiento" className="block rounded-xl border-t-4 border-green-500 bg-white p-6 shadow-sm hover:shadow-md transition cursor-pointer">
                  <h3 className="text-xl font-bold text-gray-900">Mantenimiento</h3>
                  <p className="mt-2 text-sm text-gray-600">Servicio preventivo y correctivo de PCs, servidores, HVAC y hardware de oficina con SLA garantizado.</p>
                </a>
              </Reveal>
              <Reveal delay={0.15}>
                <a href="#instalacion" className="block rounded-xl border-t-4 border-purple-500 bg-white p-6 shadow-sm hover:shadow-md transition cursor-pointer">
                  <h3 className="text-xl font-bold text-gray-900">Venta e Instalación</h3>
                  <p className="mt-2 text-sm text-gray-600">Biométricos, antenas Wi-Fi empresarial, enlaces punto a punto y configuración avanzada llave en mano.</p>
                </a>
              </Reveal>
              <Reveal delay={0.2}>
                <a href="#software" className="block rounded-xl border-t-4 border-indigo-500 bg-white p-6 shadow-sm hover:shadow-md transition cursor-pointer">
                  <h3 className="text-xl font-bold text-gray-900">Software a Medida</h3>
                  <p className="mt-2 text-sm text-gray-600">Desarrollo de ERP/CRM, apps móviles, integración con hardware (TPVs, biométricos) y APIs REST.</p>
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CCTV */}
        <section id="cctv" className="py-16 bg-gray-50 scroll-mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-3xl font-bold text-gray-900">Circuito Cerrado de Televisión (CCTV)</h2>
              <p className="mt-3 text-lg text-gray-700">Vigilancia inteligente y protección perimetral 24/7</p>
            </Reveal>
            <div className="mt-10 grid gap-8 lg:grid-cols-2 items-start">
              <Reveal delay={0.1}>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Implementamos sistemas de videovigilancia de última generación con cámaras IP, analítica de video e integración con plataformas de gestión centralizada (VMS).
                    Proteja su patrimonio con tecnología de punta y monitoreo remoto desde cualquier dispositivo.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Cámaras IP 4K/8MP:</strong> Resolución ultra nítida, visión nocturna IR hasta 50m, WDR real y reducción de ruido 3DNR para capturas precisas en cualquier condición.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Analítica de video inteligente:</strong> Detección facial, conteo de personas, reconocimiento de placas (LPR/ANPR), línea virtual de intrusión y mapas de calor.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>NVR/DVR empresarial:</strong> Almacenamiento redundante RAID, respaldo en nube híbrido, hot-swap y capacidad escalable hasta 256 canales.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Integración total:</strong> Sincronización con control de acceso, alarmas y checadores biométricos. Gestión unificada de eventos de seguridad.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Monitoreo 24/7:</strong> Acceso remoto multiplataforma (web, iOS, Android), alertas push en tiempo real y playback con línea de tiempo inteligente.</span>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                  <Image src="/ccvt.png" alt="Sistema CCTV" fill className="object-cover" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Cableado Estructurado */}
        <section id="cableado" className="py-16 scroll-mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-3xl font-bold text-gray-900">Cableado Estructurado</h2>
              <p className="mt-3 text-lg text-gray-700">Infraestructura de red certificada para máximo rendimiento y escalabilidad</p>
            </Reveal>
            <div className="mt-10 grid gap-8 lg:grid-cols-2 items-start">
              <Reveal delay={0.1}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                  <Image src="/cable_estructurado.png" alt="Cableado estructurado" fill className="object-cover" />
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="space-y-6">
                  <p className="text-gray-700">
                    Diseñamos e instalamos cableado estructurado Cat 6A/Cat 7 y fibra óptica con certificación de fábrica y garantía extendida. 
                    Cumplimos estándares TIA/EIA-568, ISO/IEC 11801 y ANSI/TIA-942 para data centers de misión crítica.
                  </p>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Cableado Horizontal</h3>
                    <ul className="mt-3 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">✓</span>
                        <span className="text-gray-700">Tendido de cobre UTP/FTP Cat 6A (10GBase-T hasta 100m).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">✓</span>
                        <span className="text-gray-700">Puntos de consolidación y salidas certificadas.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">✓</span>
                        <span className="text-gray-700">Canalización con charolas metálicas Panduit/HellermannTyton.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Cableado Vertical (Backbone)</h3>
                    <ul className="mt-3 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">✓</span>
                        <span className="text-gray-700">Fibra óptica OM3/OM4 (40G/100G) y OS2 (hasta 80km).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">✓</span>
                        <span className="text-gray-700">Fusión y empalme con certificación OTDR (pérdida menor 0.3dB).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">✓</span>
                        <span className="text-gray-700">Enlaces troncales entre edificios campus.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Sites y Cuartos de Telecomunicaciones</h3>
                    <ul className="mt-3 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">✓</span>
                        <span className="text-gray-700">Racks 42U/45U con organizadores verticales y PDUs administrables.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">✓</span>
                        <span className="text-gray-700">Patch panels modulares, ODF, distribuidores de fibra.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">✓</span>
                        <span className="text-gray-700">Sistemas de tierras físicas y control ambiental (HVAC).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">✓</span>
                        <span className="text-gray-700">Jumpers certificados, gabinetes, charolas y etiquetado industrial.</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Pruebas y Certificación</h3>
                    <p className="mt-2 text-gray-700">
                      Medición de parámetros con Fluke DTX/DSX-5000: NEXT, FEXT, Return Loss, atenuación y mapeo de cables. 
                      Reportes firmados con garantía de 25 años.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Mantenimiento */}
        <section id="mantenimiento" className="py-16 bg-gray-50 scroll-mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-3xl font-bold text-gray-900">Mantenimiento Integral de Equipos</h2>
              <p className="mt-3 text-lg text-gray-700">Preventivo y correctivo para máxima disponibilidad operativa</p>
            </Reveal>
            <div className="mt-10 grid gap-8 lg:grid-cols-2 items-start">
              <Reveal delay={0.1}>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Maximice la vida útil de su infraestructura tecnológica con programas de mantenimiento preventivo y correctivo especializados. 
                    Reducimos tiempos de inactividad y optimizamos el rendimiento de sus activos críticos.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Mantenimiento de PCs y servidores:</strong> Limpieza interna, actualización de firmware/BIOS, diagnóstico de hardware, reemplazo de componentes y optimización del SO.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Aire acondicionado de precisión:</strong> Servicio preventivo de equipos HVAC para cuartos de telecomunicaciones/data centers: limpieza de condensadores, recarga de refrigerante, calibración de termostatos.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Hardware de oficina:</strong> Impresoras multifunción, escáneres, proyectores, UPS y reguladores. Reparación, actualización de drivers y mantenimiento predictivo.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Mantenimiento correctivo:</strong> Diagnóstico remoto/presencial, reparaciones urgentes 24/7, respaldo y recuperación de datos, reemplazo express de piezas.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Contratos de soporte:</strong> Planes mensuales/anuales con visitas programadas, monitoreo remoto, inventario de refacciones y SLA personalizado.</span>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                  <Image src="/mantenimiento-service.png" alt="Mantenimiento de equipos" fill className="object-cover" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Venta e Instalación */}
        <section id="instalacion" className="py-16 scroll-mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-3xl font-bold text-gray-900">Venta, Instalación y Configuración</h2>
              <p className="mt-3 text-lg text-gray-700">Equipamiento y puesta en marcha llave en mano</p>
            </Reveal>
            <div className="mt-10 grid gap-8 lg:grid-cols-2 items-start">
              <Reveal delay={0.1}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                  <Image src="/instalacion-service.png" alt="Instalación de equipos" fill className="object-cover" />
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Proveemos, instalamos y configuramos equipos de última generación con servicio integral. 
                    Desde la cotización hasta la capacitación de usuarios, garantizamos una implementación sin contratiempos.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Checadores biométricos:</strong> Venta e instalación de terminales de huella, facial y palma. Integración con software de RRHH, reportería en tiempo real y acceso controlado por roles.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Antenas y redes Wi-Fi empresariales:</strong> Access points mesh/controller-based (Ubiquiti, Aruba, Cisco), site survey RF, VLAN por SSID, autenticación 802.1X y roaming sin interrupciones.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Enlaces punto a punto:</strong> Radio enlace para edificios remotos, antenas direccionales y omnidireccionales, cálculo de línea de vista y throughput garantizado.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Configuración avanzada:</strong> VLANs, QoS, firewall, port forwarding, VPN site-to-site y balanceo de carga. Documentación de topología y credenciales.</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Desarrollo de Software */}
        <section id="software" className="py-16 bg-gray-50 scroll-mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-3xl font-bold text-gray-900">Desarrollo de Software a la Medida</h2>
              <p className="mt-3 text-lg text-gray-700">Soluciones personalizadas e integración con hardware especializado</p>
            </Reveal>
            <div className="mt-10 grid gap-8 lg:grid-cols-2 items-start">
              <Reveal delay={0.1}>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Transformamos procesos de negocio en aplicaciones escalables y robustas. Desarrollamos sistemas multiplataforma con integración nativa a hardware (TPVs, lectores, terminales), APIs REST/GraphQL y arquitectura en la nube.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Sistemas de gestión (ERP/CRM):</strong> Inventarios, facturación electrónica (CFDI 4.0), módulos de ventas, compras, contabilidad y reportería ejecutiva en tiempo real.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Integración con hardware:</strong> Terminales bancarias (Verifone, Ingenico), checadores biométricos (ZKTeco, Suprema), lectores de código de barras, básculas y dispensadores RFID.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Apps móviles nativas/híbridas:</strong> Flutter, React Native, Swift/Kotlin. Sincronización offline-first, geolocalización, push notifications y deep linking.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Paneles web responsivos:</strong> React/Next.js, dashboards con gráficas en vivo (Chart.js, D3), autenticación multi-factor (MFA) y roles granulares.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">✓</span>
                      <span className="text-gray-700"><strong>Integraciones y APIs:</strong> Conexión con sistemas legacy, webhooks, colas de mensajes (RabbitMQ, Redis), SSO (SAML, OAuth2) y microservicios Docker/Kubernetes.</span>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                  <Image src="/software-service.png" alt="Desarrollo de software" fill className="object-cover" />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Sección de Comentarios */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Lo Que Dicen Nuestros Clientes
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Testimonios reales de empresas que han transformado su infraestructura tecnológica con nosotros
                </p>
              </div>
            </Reveal>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Reveal>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "Excelente servicio en la instalación de nuestro sistema CCTV. El equipo fue muy profesional y la calidad del trabajo superó nuestras expectativas. Ahora tenemos total tranquilidad en nuestras instalaciones."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold text-sm">MR</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">María Rodríguez</p>
                      <p className="text-sm text-gray-600">Gerente General, Ballotini Panamericana</p>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "El cableado estructurado que instalaron en nuestro centro de capacitación ha sido impecable. Redes rápidas, sin interrupciones y con certificación completa. Definitivamente los recomendamos."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-semibold text-sm">CL</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Carlos López</p>
                      <p className="text-sm text-gray-600">Director de IT, Kenworth</p>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "El sistema biométrico que implementaron ha mejorado significativamente nuestro control de asistencia. La integración con nuestro sistema de nómina fue perfecta y el soporte técnico es excepcional."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-purple-600 font-semibold text-sm">AG</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Ana García</p>
                      <p className="text-sm text-gray-600">RRHH, Novaprint</p>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "El software Clinik's que desarrollaron para nuestra clínica ha revolucionado nuestra gestión. Expedientes electrónicos, control de inventarios y recetas digitales. Todo funciona perfectamente."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-orange-600 font-semibold text-sm">DM</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Dr. Miguel Díaz</p>
                      <p className="text-sm text-gray-600">Director Médico, Clínica Santa Teresa</p>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.4}>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "El sistema de punto de venta y control de inventarios que crearon para DecoraTuHome ha optimizado completamente nuestras operaciones. Ventas más rápidas y control total de mercancía."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-indigo-600 font-semibold text-sm">LS</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Laura Sánchez</p>
                      <p className="text-sm text-gray-600">Gerente de Operaciones, DecoraTuHome</p>
                    </div>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.5}>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "La app móvil para control de inventarios ha sido un cambio total. Ahora podemos validar mercancías contra facturas en tiempo real, sin errores. La sincronización offline es perfecta."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-teal-600 font-semibold text-sm">RJ</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Roberto Jiménez</p>
                      <p className="text-sm text-gray-600">Supervisor de Almacén</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-sky-500 to-blue-600">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">¿Listo para transformar tu infraestructura?</h2>
              <p className="mt-4 text-lg text-white/90">Solicita una auditoría técnica gratuita y cotización sin compromiso.</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/525530358478?text=Hola,%20necesito%20una%20cotizaci%C3%B3n%20para%20servicios%20de%20infraestructura"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-3 text-sky-600 shadow-lg transition hover:shadow-xl active:scale-95 font-semibold"
                >
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 32 32" fill="currentColor"><path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/><path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38zM17.75 27.1c-2.22 0-4.39-.6-6.28-1.73l-.45-.27-5.07 1.33 1.35-4.94-.3-.51c-1.21-2.02-1.85-4.34-1.85-6.77 0-7.31 5.95-13.26 13.26-13.26 3.54 0 6.86 1.38 9.36 3.89 2.49 2.5 3.87 5.82 3.87 9.36 0 7.31-5.95 13.26-13.26 13.26z"/></svg>
                  Solicitar auditoría
                </a>
                <a
                  href="mailto:edm_comunicaciones@hotmail.com?subject=Solicitud%20de%20informaci%C3%B3n&body=Hola,%20requiero%20informaci%C3%B3n%20sobre%20sus%20servicios."
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-3 text-white transition hover:bg-white/10 font-semibold"
                >
                  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  Enviar correo
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


