"use client";
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { config, getWhatsAppLink, getPhoneLink, getEmailLink } from '@/lib/config';

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

interface ContactInfoProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  link?: string;
  linkText: string;
  linkColor: string;
  linkBg?: string;
}

function ContactInfo({ icon, title, value, link, linkText, linkColor, linkBg }: ContactInfoProps) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/10 to-brand/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-brand">{title}</h3>
        <p className="text-gray-600">{value}</p>
        {link && (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 ${linkBg || 'bg-gray-100 hover:bg-gray-200'} ${linkColor}`}
          >
            {linkText}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { serviceId, templateId, publicKey } = config.emailjs;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration is missing.');
      }

      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          name: formData.name,
          email: formData.email,
          title: formData.service || 'Consulta general',
          phone: formData.phone,
          company: formData.company,
          service: formData.service,
          message: formData.message,
          to_email: config.contact.email,
          reply_to: formData.email
        },
        publicKey
      );

      if (result.status === 200) {
        try {
          await fetch('/api/contacts/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
        } catch (dbError) {
          console.error('Error saving to database:', dbError);
        }

        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contáctanos
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                    <span className="text-gradient-brand">Hablemos de</span>
                    <br />
                    <span className="text-brand">Tu Proyecto</span>
                  </h1>
                  <p className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto">
                    Cuéntanos sobre tu proyecto y te ayudaremos a encontrar la solución tecnológica perfecta
                  </p>
                </Reveal>
              </div>
            </div>
          </section>

          <section className="py-12 relative">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2">
                <Reveal>
                  <div className="card-nexus rounded-3xl p-8 lg:p-10 hover:shadow-nexus transition-all duration-500">
                    <h2 className="text-2xl font-black text-brand mb-6">
                      Envíanos un mensaje
                    </h2>
                    
                    {submitStatus === 'success' && (
                      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-green-800 font-semibold">¡Mensaje enviado exitosamente!</p>
                            <p className="text-green-700 text-sm">Te contactaremos pronto para discutir tu proyecto.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-red-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-red-800 font-semibold">Error al enviar el mensaje</p>
                            <p className="text-red-700 text-sm">Por favor, intenta nuevamente o contáctanos directamente.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="relative">
                          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre completo *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all outline-none"
                            placeholder="Tu nombre completo"
                            style={{ position: 'relative', zIndex: 1 }}
                          />
                        </div>
                        <div className="relative">
                          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Correo electrónico *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all outline-none"
                            placeholder="tu@empresa.com"
                            style={{ position: 'relative', zIndex: 1 }}
                          />
                        </div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="relative">
                          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all outline-none"
                            placeholder="+52 55 1234 5678"
                            style={{ position: 'relative', zIndex: 1 }}
                          />
                        </div>
                        <div className="relative">
                          <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                            Empresa
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all outline-none"
                            placeholder="Nombre de tu empresa"
                            style={{ position: 'relative', zIndex: 1 }}
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">
                          Servicio de interés
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all outline-none cursor-pointer"
                          style={{ position: 'relative', zIndex: 1 }}
                        >
                          <option value="">Selecciona un servicio</option>
                          <option value="cctv">CCTV y Videovigilancia</option>
                          <option value="cableado">Cableado Estructurado</option>
                          <option value="mantenimiento">Mantenimiento de Equipos</option>
                          <option value="instalacion">Venta e Instalación</option>
                          <option value="software">Desarrollo de Software</option>
                          <option value="consultoria">Consultoría Técnica</option>
                          <option value="otro">Otro</option>
                        </select>
                      </div>

                      <div className="relative">
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                          Mensaje *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3.5 focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none outline-none"
                          placeholder="Cuéntanos sobre tu proyecto, necesidades específicas, presupuesto aproximado, etc."
                          style={{ position: 'relative', zIndex: 1 }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-nexus-primary disabled:opacity-50 disabled:cursor-not-allowed py-4 text-lg font-bold"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Enviando...
                          </div>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Enviar mensaje
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-black text-brand mb-2">
                        Información de contacto
                      </h2>
                      <p className="text-gray-600">
                        Estamos aquí para ayudarte. Contáctanos por cualquiera de estos medios.
                      </p>
                    </div>

                    <div className="card-nexus rounded-3xl p-8 hover:shadow-nexus transition-all duration-500 space-y-6 relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/10 to-brand/10 flex items-center justify-center">
                          <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div className="relative z-10">
                          <h3 className="font-bold text-brand">Teléfono</h3>
                          <p className="text-gray-600">{config.contact.phone}</p>
                          <a 
                            href="tel:+525530358478"
                            className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-accent hover:bg-accent/90 transition-all hover:scale-105 relative z-20"
                          >
                            Llamar ahora
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/10 to-brand/10 flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-500" viewBox="0 0 32 32" fill="currentColor">
                            <path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/>
                            <path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38z"/>
                          </svg>
                        </div>
                        <div className="relative z-10">
                          <h3 className="font-bold text-brand">WhatsApp</h3>
                          <p className="text-gray-600">{config.contact.whatsapp}</p>
                          <a 
                            href="https://wa.me/525530358478?text=Hola%2C%20quisiera%20información%20sobre%20sus%20servicios%20de%20telecomunicaciones."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-green-500 hover:bg-green-600 transition-all hover:scale-105 relative z-20"
                          >
                            Chatear ahora
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/10 to-brand/10 flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="relative z-10">
                          <h3 className="font-bold text-brand">Correo electrónico</h3>
                          <p className="text-gray-600">{config.contact.email}</p>
                          <a 
                            href="mailto:edm_comunicaciones@hotmail.com?subject=Consulta%20sobre%20servicios&body=Hola%2C%20me%20interesa%20conocer%20más%20sobre%20sus%20servicios."
                            className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-purple-500 hover:bg-purple-600 transition-all hover:scale-105 relative z-20"
                          >
                            Enviar correo
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/10 to-brand/10 flex items-center justify-center">
                          <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-brand">Horario de atención</h3>
                          <p className="text-gray-600">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-brand to-accent rounded-3xl p-8 text-white relative overflow-hidden">
                      <div className="absolute inset-0 hex-pattern opacity-10" />
                      <div className="relative">
                        <h3 className="text-xl font-bold mb-2">¿Necesitas una cotización rápida?</h3>
                        <p className="text-white/80 text-sm mb-4">
                          Para proyectos urgentes o cotizaciones inmediatas, contáctanos directamente por WhatsApp.
                        </p>
                        <a
                          href={getWhatsAppLink('Hola, necesito una cotización urgente para servicios de telecomunicaciones.')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-white text-brand px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all hover:scale-105"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
                            <path d="M19.11 17.23c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.9 1.13-.17.19-.33.22-.62.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.33.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.15.19 2 3.06 4.86 4.29.68.29 1.21.46 1.62.58.68.22 1.31.19 1.8.11.55-.08 1.7-.7 1.94-1.38.24-.68.24-1.26.17-1.38-.08-.11-.26-.18-.55-.33z"/>
                            <path d="M26.68 5.32C23.9 2.54 20.2 1 16.3 1 8.46 1 2.1 7.37 2.1 15.2c0 2.61.68 5.16 1.98 7.41L2 31l8.55-2.24c2.19 1.2 4.67 1.84 7.2 1.84 7.84 0 14.2-6.37 14.2-14.2 0-3.9-1.54-7.6-4.32-10.38z"/>
                          </svg>
                          Cotización rápida
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
