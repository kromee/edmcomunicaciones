import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rejectUntrustedContactOrigin } from '@/lib/api-security';
import { checkRateLimit, getClientIpFromHeaders } from '@/lib/rate-limit';

/** Máximo de envíos por IP en la ventana (formulario público). */
const CONTACT_LIMIT_PER_IP = 5;
const CONTACT_WINDOW_MS = 60 * 60 * 1000;

/** Mismo correo no puede registrar más de N veces por ventana. */
const CONTACT_LIMIT_PER_EMAIL = 3;

export async function POST(request: NextRequest) {
  try {
    const originBlock = rejectUntrustedContactOrigin(request);
    if (originBlock) return originBlock;

    const ip = getClientIpFromHeaders(request.headers);
    const ipLimit = checkRateLimit(
      `contact:ip:${ip}`,
      CONTACT_LIMIT_PER_IP,
      CONTACT_WINDOW_MS
    );
    if (!ipLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Demasiados envíos desde tu conexión. Espera un momento e inténtalo de nuevo.',
          retryAfterSec: ipLimit.retryAfterSec,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(ipLimit.retryAfterSec) },
        }
      );
    }

    const body = await request.json();
    const { name, email, phone, company, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    const emailNorm = String(email).trim().toLowerCase();
    const emailLimit = checkRateLimit(
      `contact:email:${emailNorm}`,
      CONTACT_LIMIT_PER_EMAIL,
      CONTACT_WINDOW_MS
    );
    if (!emailLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Ya recibimos varios mensajes con este correo. Intenta más tarde o escríbenos por teléfono.',
          retryAfterSec: emailLimit.retryAfterSec,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(emailLimit.retryAfterSec) },
        }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('contacts')
      .insert({
        name,
        email,
        phone: phone || null,
        company: company || null,
        service: service || null,
        message,
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      return NextResponse.json(
        { success: false, error: 'Error al guardar contacto' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, contact: data });
  } catch (error) {
    console.error('Error in create contact:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}
