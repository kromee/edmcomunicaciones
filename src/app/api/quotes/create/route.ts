import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSession } from '@/lib/session';
import { generateQuotePDF } from '@/lib/pdf-generator';
import emailjs from '@emailjs/browser';
import { config } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      client_name,
      client_email,
      client_phone,
      client_company,
      service_type,
      description,
      valid_until,
      notes,
      items,
      subtotal,
      tax,
      total_amount
    } = body;

    const supabase = await createClient();

    console.log('Creating quote for user:', session.id);
    console.log('Request body:', { client_name, client_email, service_type });

    // Verificar si el cliente existe, si no, crearlo
    if (client_email) {
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('email', client_email)
        .single();

      if (!existingClient) {
        console.log('Client not found, creating new client...');
        const { error: clientError } = await supabase
          .from('clients')
          .insert({
            name: client_name,
            email: client_email,
            phone: client_phone || null,
            company: client_company || null,
            country: 'México',
            status: 'active',
            created_by: session.id
          });

        if (clientError) {
          console.error('Error creating client:', clientError);
          // Continuar aunque falle la creación del cliente
        } else {
          console.log('New client created successfully');
        }
      } else {
        console.log('Client already exists:', existingClient.id);
      }
    }

    // Generar número de cotización simple
    const now = new Date();
    const yearMonth = now.toISOString().slice(0, 7).replace('-', '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const quote_number = `COT-${yearMonth}-${random}`;

    console.log('Generated quote number:', quote_number);

    // Crear cotización
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        quote_number,
        client_name,
        client_email,
        client_phone: client_phone || null,
        client_company: client_company || null,
        service_type,
        description: description || null,
        subtotal: Number(subtotal),
        tax: Number(tax),
        total_amount: Number(total_amount),
        valid_until: valid_until || null,
        notes: notes || null,
        status: 'pending',
        created_by: session.id
      })
      .select()
      .single();

    if (quoteError) {
      console.error('Error creating quote:', quoteError);
      return NextResponse.json(
        { success: false, error: `Error al crear cotización: ${quoteError.message}` },
        { status: 500 }
      );
    }

    console.log('Quote created successfully:', quote.id);

    // Crear items de cotización
    const quoteItems = items.map((item: any) => ({
      quote_id: quote.id,
      item_name: item.description, // Usar description como item_name
      description: item.description,
      quantity: parseInt(item.quantity) || 0,
      unit: item.unit,
      unit_price: parseFloat(item.unit_price) || 0,
      total: parseFloat(item.total) || 0
    }));

    console.log('Quote items to insert:', quoteItems);

    const { error: itemsError } = await supabase
      .from('quote_items')
      .insert(quoteItems);

    if (itemsError) {
      console.error('Error creating quote items:', itemsError);
      // Eliminar cotización si falla la creación de items
      await supabase.from('quotes').delete().eq('id', quote.id);
      return NextResponse.json(
        { success: false, error: 'Error al crear items de cotización' },
        { status: 500 }
      );
    }

    // Generar PDF
    const pdf = generateQuotePDF({
      ...quote,
      items
    });

    // Convertir PDF a base64 para enviar por email
    const pdfBase64 = pdf.output('datauristring').split(',')[1];

    // Enviar cotización por email
    try {
      const { serviceId, templateId, publicKey } = config.emailjs;

      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          'template_cotizacion', // Crear este template en EmailJS
          {
            to_email: client_email,
            client_name,
            quote_number,
            total_amount: `$${total_amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            pdf_attachment: pdfBase64
          },
          publicKey
        );

        // Actualizar estado de la cotización
        await supabase
          .from('quotes')
          .update({ status: 'sent' })
          .eq('id', quote.id);
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // No falla la creación de la cotización si el email falla
    }

    return NextResponse.json({
      success: true,
      quote: {
        id: quote.id,
        quote_number: quote.quote_number
      }
    });
  } catch (error) {
    console.error('Error in create quote:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error details:', errorMessage);
    return NextResponse.json(
      { success: false, error: `Error del servidor: ${errorMessage}` },
      { status: 500 }
    );
  }
}
