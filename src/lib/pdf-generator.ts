import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Logo EDM en base64 (se debe reemplazar con el logo real convertido a base64)
const LOGO_BASE64 = 'data:image/png;base64,'; // Placeholder - se llenará con el logo real

type QuoteData = {
  quote_number: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_company: string;
  service_type: string;
  description: string;
  valid_until: string;
  items: Array<{
    item_name: string;
    description: string;
    quantity: number;
    unit: 'PZA' | 'SERV';
    unit_price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total_amount: number;
  created_at: string;
};

export function generateQuotePDF(quote: QuoteData): jsPDF {
  const doc = new jsPDF();
  
  // Configuración de colores EDM
  const primaryColor: [number, number, number] = [14, 165, 233]; // Sky blue
  const darkColor: [number, number, number] = [15, 23, 42]; // Slate 900
  const grayColor: [number, number, number] = [107, 114, 128]; // Gray 500

  // Header - Logo y título
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Logo de la empresa
  // Intentar cargar el logo, si falla usar texto
  if (LOGO_BASE64 && LOGO_BASE64.length > 30) {
    try {
      // Logo EDM - ajustar tamaño y posición (2rem = ~16px)
      doc.addImage(LOGO_BASE64, 'PNG', 20, 12, 16, 16); // x, y, width, height
      
      // Texto "Comunicaciones" al lado del logo
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Comunicaciones', 38, 23);
    } catch (error) {
      console.error('Error al cargar logo en PDF:', error);
      // Fallback: usar texto
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('EDM', 20, 23);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Comunicaciones', 20, 31);
    }
  } else {
    // Fallback: usar texto si no hay logo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('EDM', 20, 23);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Comunicaciones', 20, 31);
  }

  // Número de cotización
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(quote.quote_number, 140, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Cotización', 140, 28);

  // Información de EDM
  doc.setTextColor(...darkColor);
  doc.setFontSize(9);
  doc.text('edm_comunicaciones@hotmail.com', 20, 46);
  doc.text(process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '55 5031 7183', 20, 51);

  // Información del cliente
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Cliente:', 20, 65);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  let yPos = 70;
  doc.text(quote.client_name, 20, yPos);
  if (quote.client_company) {
    yPos += 5;
    doc.text(quote.client_company, 20, yPos);
  }
  yPos += 5;
  doc.text(quote.client_email, 20, yPos);
  if (quote.client_phone) {
    yPos += 5;
    doc.text(quote.client_phone, 20, yPos);
  }

  // Fecha y validez
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  const fechaEmision = new Date(quote.created_at).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Fecha: ${fechaEmision}`, 140, 65);
  
  if (quote.valid_until) {
    const fechaVencimiento = new Date(quote.valid_until).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Válida hasta: ${fechaVencimiento}`, 140, 70);
  }

  // Descripción del servicio
  if (quote.description) {
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.text('Descripción:', 20, yPos + 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const splitDescription = doc.splitTextToSize(quote.description, 170);
    doc.text(splitDescription, 20, yPos + 15);
    yPos += 15 + (splitDescription.length * 5);
  }

  // Tabla de items
  const tableStartY = Math.max(yPos + 3, 100);
  
  autoTable(doc, {
    startY: tableStartY,
    head: [['#', 'Cantidad', 'Unidad', 'Descripción', 'P. Unitario', 'Total(MN)']],
    body: (quote.items || []).map((item, index) => {
      const quantity = item.quantity || 0;
      const unitPrice = item.unit_price || 0;
      const total = quantity * unitPrice;
      
      return [
        index + 1,
        quantity,
        item.unit || 'PZA',
        item.description || '-',
        `$${unitPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
        `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
      ];
    }),
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 9,
      textColor: darkColor
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },  // #
      1: { cellWidth: 17, halign: 'center' },  // Cantidad (más pequeña)
      2: { cellWidth: 17, halign: 'center' },  // Unidad (más pequeña)
      3: { cellWidth: 90 },                     // Descripción (más ancha)
      4: { cellWidth: 25, halign: 'right' },   // P. Unitario
      5: { cellWidth: 25, halign: 'right' }     // Total(MN)
    },
    margin: { left: 20, right: 20 }
  });

  // SUBTOTAL
  const finalY = ((doc as any).lastAutoTable?.finalY || tableStartY + 100) + 1;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // SUBTOTAL
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(165, finalY + 6, 203, finalY + 6);
  
  doc.text('SUBTOTAL:', 165, finalY + 12, { align: 'right' });
  doc.setTextColor(...primaryColor);
  doc.text(`$${(quote.total_amount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 203, finalY + 12, { align: 'right' });

  // Términos y condiciones
  doc.setTextColor(...darkColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CONDICIONES COMERCIALES:', 20, finalY + 25);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const terms = [
    `• Esta cotización tiene validez hasta el ${new Date(quote.valid_until).toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}.`,
    '• Los precios están expresados en pesos mexicanos (MXN) y no incluyen IVA.',
    '• Forma de pago: 50% anticipo, 50% al finalizar la instalación.',
  ];
  
  let termsY = finalY + 30;
  terms.forEach(term => {
    doc.text(term, 20, termsY);
    termsY += 4;
  });

  // Footer
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 277, 210, 20, 'F');
  
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.text('EDM Comunicaciones - Soluciones Integrales en Telecomunicaciones', 105, 285, { align: 'center' });
  doc.text(`edm_comunicaciones@hotmail.com | ${process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '55 5031 7183'}`, 105, 290, { align: 'center' });

  return doc;
}
