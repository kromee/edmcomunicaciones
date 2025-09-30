// Configuración centralizada de la aplicación
export const config = {
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'edm_comunicaciones@hotmail.com',
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+52 55 3035 8478',
    whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '+52 55 3035 8478',
    emailCC: process.env.NEXT_PUBLIC_CONTACT_EMAIL_CC || 'renixedu@gmail.com',
  },
  emailjs: {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
  },
  company: {
    name: 'EDM Comunicaciones',
    tagline: 'Su Empresa de Tecnología que Sí Cumple',
  }
};

// Función helper para generar enlaces de WhatsApp
export const getWhatsAppLink = (message: string) => {
  const phoneNumber = config.contact.whatsapp.replace(/[^0-9]/g, '');
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
};

// Función helper para generar enlaces de teléfono
export const getPhoneLink = () => {
  return `tel:${config.contact.phone.replace(/[^0-9+]/g, '')}`;
};

// Función helper para generar enlaces de email
export const getEmailLink = (subject: string, body: string) => {
  return `mailto:${config.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};
