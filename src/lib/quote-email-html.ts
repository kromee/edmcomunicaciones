function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type QuoteEmailHtmlInput = {
  client_name: string;
  quote_number: string;
  total_formatted: string;
  download_url: string;
};

/**
 * HTML compatible con Outlook / Hotmail (tablas, sin gradientes).
 * En EmailJS el cuerpo de la plantilla debe ser solo: {{{html_body}}}
 */
export function buildQuoteEmailHtml(input: QuoteEmailHtmlInput): string {
  const name = escapeHtml(input.client_name);
  const number = escapeHtml(input.quote_number);
  const total = escapeHtml(input.total_formatted);
  const url = escapeHtml(input.download_url);

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Cotización ${number}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f1f5f9;">
<tr>
<td align="center" style="padding:24px 12px;">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;width:100%;background-color:#ffffff;">
<tr>
<td align="center" style="padding:24px 24px;background-color:#0284c7;">
<p style="margin:0;font-size:20px;font-weight:bold;color:#ffffff;">EDM Comunicaciones</p>
<p style="margin:8px 0 0;font-size:13px;color:#e0f2fe;">Su empresa de tecnología que sí cumple</p>
</td>
</tr>
<tr>
<td style="padding:28px 24px 20px;color:#0f172a;font-size:15px;line-height:1.5;">
<p style="margin:0 0 12px;">Hola <strong>${name}</strong>,</p>
<p style="margin:0 0 20px;color:#475569;">Gracias por tu interés. Tu cotización está lista; descarga el PDF con el botón de abajo.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;">
<tr>
<td style="padding:16px 20px;">
<p style="margin:0 0 4px;font-size:11px;color:#64748b;font-weight:bold;text-transform:uppercase;">Número de cotización</p>
<p style="margin:0 0 12px;font-size:17px;font-weight:bold;color:#0284c7;">${number}</p>
<p style="margin:0 0 4px;font-size:11px;color:#64748b;font-weight:bold;text-transform:uppercase;">Total</p>
<p style="margin:0;font-size:20px;font-weight:bold;color:#0f172a;">${total}</p>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td align="center" style="padding:0 24px 24px;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0">
<tr>
<td align="center" bgcolor="#0ea5e9" style="background-color:#0ea5e9;border-radius:6px;">
<a href="${url}" target="_blank" style="display:inline-block;padding:12px 28px;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;">Descargar cotización (PDF)</a>
</td>
</tr>
</table>
<p style="margin:16px 0 8px;font-size:13px;color:#64748b;text-align:center;">El enlace es válido unos días por seguridad.</p>
<p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;line-height:1.5;">Si el botón no funciona, abre este enlace:<br /><a href="${url}" style="color:#0284c7;word-break:break-all;">${url}</a></p>
</td>
</tr>
<tr>
<td style="padding:20px 24px 28px;border-top:1px solid #f1f5f9;color:#0f172a;font-size:14px;">
<p style="margin:0 0 6px;">Saludos cordiales,</p>
<p style="margin:0;font-weight:bold;color:#0284c7;">Equipo EDM Comunicaciones</p>
<p style="margin:12px 0 0;font-size:12px;color:#94a3b8;">Vigencia y condiciones: consulta el PDF descargado.</p>
</td>
</tr>
</table>
<p style="margin:12px 0 0;font-size:11px;color:#94a3b8;text-align:center;">© EDM Comunicaciones</p>
</td>
</tr>
</table>
</body>
</html>`;
}

export function buildQuoteEmailPlainText(input: QuoteEmailHtmlInput): string {
  return `Hola ${input.client_name},

Tu cotización ${input.quote_number} está lista (total: ${input.total_formatted}).

Descarga el PDF: ${input.download_url}

Saludos,
Equipo EDM Comunicaciones`;
}
