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

/** HTML del correo de cotización (se inyecta vía {{{html_body}}} en EmailJS). */
export function buildQuoteEmailHtml(input: QuoteEmailHtmlInput): string {
  const name = escapeHtml(input.client_name);
  const number = escapeHtml(input.quote_number);
  const total = escapeHtml(input.total_formatted);
  const url = escapeHtml(input.download_url);

  return `<div style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%);padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">EDM Comunicaciones</p>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.9);">Su empresa de tecnología que sí cumple</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#0f172a;">
                Hola <strong>${name}</strong>,
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#475569;">
                Gracias por tu interés. Tu cotización está lista; puedes descargarla en PDF con el botón de abajo.
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;font-weight:600;">Número de cotización</p>
                    <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#0ea5e9;">${number}</p>
                    <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;font-weight:600;">Total</p>
                    <p style="margin:0;font-size:22px;font-weight:700;color:#0f172a;">${total}</p>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 auto 20px;">
                <tr>
                  <td style="border-radius:8px;background:#0ea5e9;">
                    <a href="${url}" target="_blank" rel="noopener" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                      Descargar cotización (PDF)
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#64748b;text-align:center;">
                El enlace es válido unos días por seguridad.
              </p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#94a3b8;word-break:break-all;text-align:center;">
                Si el botón no abre, copia y pega en el navegador:<br />${url}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;border-top:1px solid #f1f5f9;">
              <p style="margin:24px 0 8px;font-size:15px;color:#0f172a;">Saludos cordiales,</p>
              <p style="margin:0;font-size:15px;font-weight:600;color:#0ea5e9;">Equipo EDM Comunicaciones</p>
              <p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#94a3b8;">
                Vigencia y condiciones comerciales: consulta el PDF descargado.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#94a3b8;text-align:center;">© EDM Comunicaciones</p>
      </td>
    </tr>
  </table>
</div>`;
}

export function buildQuoteEmailPlainText(input: QuoteEmailHtmlInput): string {
  return `Hola ${input.client_name},

Tu cotización ${input.quote_number} está lista (total: ${input.total_formatted}).

Descarga el PDF: ${input.download_url}

Saludos,
Equipo EDM Comunicaciones`;
}
