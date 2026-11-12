import type { Metadata } from 'next';
import { ServiceLanding } from '@/components/ServiceLanding';

export const metadata: Metadata = {
  title: 'Redes y cableado estructurado | EDM Comunicaciones',
  description: 'Diseño e instalación de redes y cableado estructurado para comercios, empresas y hogares en CDMX, Estado de México, Puebla y Veracruz.',
  openGraph: { title: 'Redes y cableado estructurado | EDM Comunicaciones', description: 'Redes y cableado para comercios, empresas y hogares en CDMX, Estado de México, Puebla y Veracruz.' },
};

export default function RedesYCableadoPage() {
  return <ServiceLanding
    eyebrow="Infraestructura de conectividad"
    title="Redes y cableado estructurado para operar con confianza"
    introduction="Diseñamos e instalamos redes de datos y cableado ordenado para conectar equipos, puntos de acceso y sistemas. Partimos de las necesidades del espacio y de los dispositivos que deben funcionar juntos."
    audience="Trabajamos con comercios, empresas y clientes residenciales."
    benefits={[
      { title: 'Red diseñada para tu espacio', description: 'Definimos puntos de red y cobertura según la distribución del lugar y la cantidad de equipos.' },
      { title: 'Cableado organizado', description: 'Instalamos y ordenamos las conexiones para facilitar su uso y mantenimiento.' },
      { title: 'Preparación para crecer', description: 'Consideramos nuevas estaciones, cámaras y otros dispositivos que podrían integrarse a la red.' },
    ]}
    process={[
      'Revisamos el lugar, los equipos existentes y las necesidades de conexión.',
      'Proponemos el alcance de la red, los puntos y el cableado requerido.',
      'Instalamos, identificamos y verificamos las conexiones.',
    ]}
    project={{ title: 'Red para un centro de capacitación', description: 'El portafolio de EDM muestra un proyecto de 30 puntos de red, cobertura Wi-Fi y organización del cableado para un centro de capacitación.' }}
    whatsappMessage="Hola EDM Comunicaciones, necesito una instalación de red o cableado. ¿Podemos hablar de mi proyecto?"
  />;
}
