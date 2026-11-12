import type { Metadata } from 'next';
import { ServiceLanding } from '@/components/ServiceLanding';

export const metadata: Metadata = {
  title: 'Desarrollo de software a medida | EDM Comunicaciones',
  description: 'Desarrollo de sistemas y aplicaciones a medida para procesos de comercios y empresas. Automatización, integración y control de información.',
  openGraph: { title: 'Desarrollo de software a medida | EDM Comunicaciones', description: 'Sistemas y aplicaciones adaptados a los procesos de comercios y empresas.' },
};

export default function DesarrolloSoftwarePage() {
  return <ServiceLanding
    eyebrow="Sistemas para procesos reales"
    title="Desarrollo de software a medida para tu negocio"
    introduction="Creamos sistemas y aplicaciones a partir de la manera en que opera tu negocio. Analizamos el proceso que necesitas mejorar y definimos una solución para organizar información, reducir tareas manuales o conectar herramientas existentes."
    audience="Servicio dirigido a comercios y empresas que necesitan una solución adaptada a sus procesos."
    benefits={[
      { title: 'Procesos más claros', description: 'Organizamos flujos de trabajo e información en un sistema pensado para las tareas del equipo.' },
      { title: 'Menos trabajo manual', description: 'Identificamos actividades repetitivas que pueden automatizarse cuando aportan valor al negocio.' },
      { title: 'Integración de herramientas', description: 'Evaluamos cómo conectar el sistema con dispositivos, datos o aplicaciones que ya utilizas.' },
    ]}
    process={[
      'Conocemos el proceso, sus usuarios y el problema que quieres resolver.',
      'Definimos el alcance y las funciones necesarias antes de desarrollar.',
      'Construimos y revisamos la solución contigo para ponerla en operación.',
    ]}
    project={{ title: 'Sistemas para operación empresarial', description: 'En el portafolio de EDM hay ejemplos de software para gestión hospitalaria y operaciones de negocio.' }}
    whatsappMessage="Hola EDM Comunicaciones, me interesa desarrollar software a medida. ¿Podemos hablar de mi proyecto?"
    coverage={false}
  />;
}
