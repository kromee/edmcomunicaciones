import type { Metadata } from 'next';
import { ServiceLanding } from '@/components/ServiceLanding';

export const metadata: Metadata = {
  title: 'Instalación de CCTV y cámaras de seguridad | EDM Comunicaciones',
  description: 'Instalación de cámaras de seguridad y videovigilancia para comercios, empresas y hogares en CDMX, Estado de México, Puebla y Veracruz.',
  openGraph: { title: 'Instalación de CCTV y cámaras de seguridad | EDM Comunicaciones', description: 'Videovigilancia para comercios, empresas y hogares en CDMX, Estado de México, Puebla y Veracruz.' },
};

export default function CctvPage() {
  return <ServiceLanding
    eyebrow="Videovigilancia para negocios y hogares"
    title="Instalación de CCTV y cámaras de seguridad"
    introduction="Diseñamos e instalamos sistemas de videovigilancia según el espacio que necesitas proteger. Te ayudamos a elegir la ubicación de las cámaras, la forma de consultar las imágenes y la capacidad de grabación que requiere tu proyecto."
    audience="Atendemos comercios, empresas y clientes residenciales."
    benefits={[
      { title: 'Cobertura de áreas importantes', description: 'Revisamos accesos, zonas de atención, almacenes y otros puntos relevantes para definir dónde conviene colocar cada cámara.' },
      { title: 'Consulta remota', description: 'Configuramos el acceso a las imágenes desde los dispositivos compatibles con el sistema instalado.' },
      { title: 'Instalación y puesta en marcha', description: 'Entregamos el sistema configurado y explicamos cómo consultar las cámaras y grabaciones.' },
    ]}
    process={[
      'Escuchamos qué espacios quieres vigilar y revisamos las condiciones del lugar.',
      'Definimos equipos, ubicaciones y alcance de la instalación.',
      'Instalamos, configuramos y comprobamos el funcionamiento del sistema.',
    ]}
    project={{ title: 'Videovigilancia para una empresa', description: 'Entre los proyectos presentados por EDM hay una instalación de 24 cámaras para supervisar áreas interiores y exteriores.' }}
    whatsappMessage="Hola EDM Comunicaciones, me interesa una instalación de CCTV. ¿Podemos hablar de mi proyecto?"
  />;
}
