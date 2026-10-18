import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuthenticatedApi } from '@/lib/api-security';
import {
  sendQuotePdfByEmail,
  quoteSendLogsTableHint,
} from '@/lib/quote-pdf-send';

export async function POST(request: NextRequest) {
  const auth = await requireAuthenticatedApi();
  if (auth instanceof NextResponse) return auth;

  const body = await request.json().catch(() => ({}));
  const quoteId = typeof body.quoteId === 'string' ? body.quoteId : '';
  const recipientEmail =
    typeof body.recipient_email === 'string' ? body.recipient_email.trim() : undefined;

  if (!quoteId) {
    return NextResponse.json(
      { success: false, error: 'Falta quoteId' },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const result = await sendQuotePdfByEmail(
    supabase,
    quoteId,
    auth.session.id,
    recipientEmail
  );

  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
        hint: result.error ? quoteSendLogsTableHint(result.error) : undefined,
        emailStatus: result.emailStatus,
      },
      { status: result.emailStatus === 'failed' ? 502 : 500 }
    );
  }

  return NextResponse.json({
    success: true,
    emailStatus: result.emailStatus,
  });
}
