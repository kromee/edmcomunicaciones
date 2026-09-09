'use client';

import { useEffect, useState } from 'react';
import { generateQuotePDF, type QuotePDFData } from '@/lib/pdf-generator';

type PdfPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Se invoca al abrir el modal para armar los datos actuales del formulario/cotización. */
  getQuoteData: () => QuotePDFData;
  fileName?: string;
  title?: string;
};

export function PdfPreviewModal({
  isOpen,
  onClose,
  getQuoteData,
  fileName = 'cotizacion-vista-previa.pdf',
  title = 'Vista previa del PDF',
}: PdfPreviewModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setError(null);
      setLoading(false);
      return;
    }

    let objectUrl: string | null = null;
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = getQuoteData();
        const pdf = await generateQuotePDF(data);
        const blob = pdf.output('blob');
        objectUrl = URL.createObjectURL(blob);
        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        setPdfUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return objectUrl;
        });
      } catch (err) {
        console.error('Error generando vista previa PDF:', err);
        if (!cancelled) {
          setError('No se pudo generar la vista previa del PDF.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
    // Solo regenerar al abrir; getQuoteData se lee en ese momento.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pdf-preview-title"
        className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-elevated border border-gray-100 flex flex-col overflow-hidden animate-slide-up"
      >
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-brand to-brand-light">
          <div>
            <h2 id="pdf-preview-title" className="text-lg font-semibold text-white">
              {title}
            </h2>
            <p className="text-sm text-white/70">Revisa el documento antes de guardar o descargar</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Cerrar vista previa"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 bg-surface-secondary min-h-0 relative">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted">
              <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Generando vista previa…</p>
            </div>
          )}

          {error && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900">{error}</p>
            </div>
          )}

          {pdfUrl && !loading && !error && (
            <iframe
              title="Vista previa PDF"
              src={pdfUrl}
              className="w-full h-full border-0"
            />
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 bg-white">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!pdfUrl || loading}
            className="btn-accent disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
