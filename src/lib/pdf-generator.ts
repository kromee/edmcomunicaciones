import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Función para cargar el logo como base64 desde URL pública
async function loadLogoAsBase64(): Promise<string> {
  try {
    const response = await fetch('/logo.png');
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error loading logo:', error);
    return '';
  }
}

type QuoteData = {
  quote_number: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_company: string;
  service_type: string;
  description: string;
  valid_until: string;
  custom_commercial_terms?: string | null;
  show_valid_until?: boolean | null;
  items: Array<{
    item_name: string;
    description: string;
    quantity: number;
    unit: 'PZA' | 'SERV';
    unit_price: number;
    percentage: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total_amount: number;
  created_at: string;
};

export async function generateQuotePDF(quote: QuoteData): Promise<jsPDF> {
  const doc = new jsPDF();
  
  // Configuración de colores EDM
  const primaryColor: [number, number, number] = [14, 165, 233]; // Sky blue
  const darkColor: [number, number, number] = [15, 23, 42]; // Slate 900
  const grayColor: [number, number, number] = [107, 114, 128]; // Gray 500

  // Header - Logo y título
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 30, 'F');
  
  // Logo de la empresa
  const logo = await loadLogoAsBase64();
  if (logo) {
    try {
      // Agregar logo (8mm de altura, ancho más amplio)
      doc.addImage(logo, 'PNG', 20, 12, 35, 16);
      
      // Texto "Comunicaciones" al lado del logo
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Comunicaciones', 55, 22);
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
      // Fallback si falla agregar el logo
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont('helvetica', 'bold');
      doc.text('EDM', 20, 20);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Comunicaciones', 20, 28);
    }
  } else {
    // Fallback si no se puede cargar el logo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('EDM', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Comunicaciones', 20, 28);
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
  doc.text('edm_comunicaciones@hotmail.com', 20,35);
  doc.text(process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '55 5031 7183', 20, 40);

  // Información del cliente
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Cliente:', 20, 50);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  let yPos =55;
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
  doc.text(`Fecha: ${fechaEmision}`, 140,50);
  
  // Mostrar fecha de vencimiento solo si show_valid_until es true (por defecto true si no se especifica)
  if (quote.valid_until && (quote.show_valid_until !== false)) {
    const fechaVencimiento = new Date(quote.valid_until).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Válida hasta: ${fechaVencimiento}`, 140, 55);
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
  const tableStartY = Math.max(yPos + 3, 60);
  
  autoTable(doc, {
    startY: tableStartY,
    head: [['#', 'Cant', 'Unid', 'Descripción', 'Precio U', 'Total(MN)']],
    body: (quote.items || []).map((item, index) => {
      const quantity = item.quantity || 0;
      const unitPrice = item.unit_price || 0;
      const percentage = item.percentage || 0;
      // Aplicar porcentaje al precio unitario
      const priceWithPercentage = unitPrice * (1 + percentage / 100);
      const total = quantity * priceWithPercentage;
      
      return [
        index + 1,
        quantity,
        item.unit || 'PZA',
        item.description || '-',
        `$${priceWithPercentage.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
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
      0: { cellWidth: 7, halign: 'center' },  // #
      1: { cellWidth: 14, halign: 'center' },  // Cantidad (más pequeña)
      2: { cellWidth: 14, halign: 'center' },  // Unidad (más pequeña)
      3: { cellWidth: 90 },                     // Descripción (ajustada para dar más espacio a Precio U y Total)
      4: { cellWidth: 25, halign: 'right' },    // P. Unitario - aumentado para valores grandes
      5: { cellWidth: 28, halign: 'right' }     // Total(MN) - aumentado para valores grandes
    },
    margin: { left: 20, right: 20 }
  });

  // se modifican las columnas para que se ajusten a los valores grandes
  // SUBTOTAL
  const finalY = ((doc as any).lastAutoTable?.finalY || tableStartY + 100) + 1;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // SUBTOTAL
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(170, finalY + 6, 194, finalY + 6);
  
  doc.text('SUBTOTAL:', 165, finalY + 12, { align: 'right' });
  doc.setTextColor(...primaryColor);
  doc.text(`$${(quote.total_amount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 194, finalY + 12, { align: 'right' });

  // Términos y condiciones
  doc.setTextColor(...darkColor);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('CONDICIONES COMERCIALES:', 20, finalY + 20);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  
  let termsY = finalY + 25;
  
  // Si hay condiciones comerciales personalizadas, usarlas; si no, usar las por defecto
  if (quote.custom_commercial_terms && quote.custom_commercial_terms.trim()) {
    // Usar condiciones personalizadas
    const customTermsLines = quote.custom_commercial_terms.split('\n');
    customTermsLines.forEach(line => {
      if (line.trim()) {
        const splitLine = doc.splitTextToSize(line, 170);
        splitLine.forEach((textLine: string) => {
          doc.text(textLine, 20, termsY);
          termsY += 4;
        });
      } else {
        termsY += 2; // Espaciado para líneas vacías
      }
    });
  } else {
    // Usar condiciones por defecto
    const terms = [
      `• Esta cotización tiene validez hasta el ${new Date(quote.valid_until).toLocaleDateString('es-MX', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}.`,
      '• Los precios están expresados en pesos mexicanos (MXN) y no incluyen IVA.',
      '• Forma de pago: 50% anticipo, 50% al finalizar la instalación.',
    ];
    
    terms.forEach(term => {
      doc.text(term, 20, termsY);
      termsY += 4;
    });
  }

  // Footer
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 277, 210, 20, 'F');
  
  doc.setTextColor(...grayColor);
  doc.setFontSize(8);
  doc.text('EDM Comunicaciones - Soluciones Integrales en Telecomunicaciones', 105, 285, { align: 'center' });
  doc.text(`edm_comunicaciones@hotmail.com | ${process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || '55 5031 7183'}`, 105, 290, { align: 'center' });

  return doc;
}
