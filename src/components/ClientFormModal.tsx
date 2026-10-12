"use client";

import { useEffect } from 'react';

export type ClientFormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  tax_id: string;
  notes: string;
  status: 'active' | 'inactive' | 'prospect';
};

const clientStatuses: Array<{ value: ClientFormValues['status']; label: string }> = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'prospect', label: 'Prospecto' },
];

function Field({
  label,
  htmlFor,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </label>
      {children}
    </div>
  );
}

export function ClientFormModal({
  open,
  title,
  subtitle,
  submitLabel,
  values,
  onChange,
  onClose,
  onSubmit,
}: {
  open: boolean;
  title: string;
  subtitle: string;
  submitLabel: string;
  values: ClientFormValues;
  onChange: (values: ClientFormValues) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const setField = <K extends keyof ClientFormValues>(key: K, value: ClientFormValues[K]) => {
    onChange({ ...values, [key]: value });
  };

  const initial = (values.name.trim().charAt(0) || 'C').toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-brand/40"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-form-title"
        className="relative flex max-h-[min(90vh,820px)] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-elevated"
      >
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <h3 id="client-form-title" className="text-base font-semibold text-gray-900">{title}</h3>
            <p className="truncate text-sm text-muted">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-muted transition-colors hover:bg-surface-secondary hover:text-gray-900"
            aria-label="Cerrar"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
            <section>
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Contacto</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Nombre" htmlFor="client-name" required>
                  <input
                    id="client-name"
                    type="text"
                    required
                    value={values.name}
                    onChange={(event) => setField('name', event.target.value)}
                    className="input"
                    placeholder="Nombre completo"
                  />
                </Field>
                <Field label="Correo" htmlFor="client-email" required>
                  <input
                    id="client-email"
                    type="email"
                    required
                    value={values.email}
                    onChange={(event) => setField('email', event.target.value)}
                    className="input"
                    placeholder="cliente@empresa.com"
                  />
                </Field>
                <Field label="Teléfono" htmlFor="client-phone">
                  <input
                    id="client-phone"
                    type="tel"
                    value={values.phone}
                    onChange={(event) => setField('phone', event.target.value)}
                    className="input"
                    placeholder="+52 55 1234 5678"
                  />
                </Field>
                <Field label="Empresa" htmlFor="client-company">
                  <input
                    id="client-company"
                    type="text"
                    value={values.company}
                    onChange={(event) => setField('company', event.target.value)}
                    className="input"
                    placeholder="Nombre de la empresa"
                  />
                </Field>
              </div>
            </section>

            <section className="border-t border-gray-100 pt-5">
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Ubicación</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Dirección" htmlFor="client-address" className="sm:col-span-2">
                  <input
                    id="client-address"
                    type="text"
                    value={values.address}
                    onChange={(event) => setField('address', event.target.value)}
                    className="input"
                    placeholder="Calle, número, colonia"
                  />
                </Field>
                <Field label="Ciudad" htmlFor="client-city">
                  <input
                    id="client-city"
                    type="text"
                    value={values.city}
                    onChange={(event) => setField('city', event.target.value)}
                    className="input"
                    placeholder="Ciudad"
                  />
                </Field>
                <Field label="Estado" htmlFor="client-state">
                  <input
                    id="client-state"
                    type="text"
                    value={values.state}
                    onChange={(event) => setField('state', event.target.value)}
                    className="input"
                    placeholder="Estado"
                  />
                </Field>
                <Field label="Código postal" htmlFor="client-postal-code">
                  <input
                    id="client-postal-code"
                    type="text"
                    value={values.postal_code}
                    onChange={(event) => setField('postal_code', event.target.value)}
                    className="input"
                    placeholder="CP"
                  />
                </Field>
                <Field label="País" htmlFor="client-country">
                  <input
                    id="client-country"
                    type="text"
                    value={values.country}
                    onChange={(event) => setField('country', event.target.value)}
                    className="input"
                    placeholder="México"
                  />
                </Field>
              </div>
            </section>

            <section className="border-t border-gray-100 pt-5">
              <h4 className="mb-3 text-sm font-semibold text-gray-900">Fiscal y seguimiento</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="RFC" htmlFor="client-tax-id">
                  <input
                    id="client-tax-id"
                    type="text"
                    value={values.tax_id}
                    onChange={(event) => setField('tax_id', event.target.value.toUpperCase())}
                    className="input uppercase"
                    placeholder="RFC"
                  />
                </Field>
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">Estatus</p>
                  <div className="grid grid-cols-3 gap-1 rounded-md bg-surface-secondary p-1">
                    {clientStatuses.map((status) => {
                      const selected = values.status === status.value;
                      return (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() => setField('status', status.value)}
                          className={`rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                            selected ? 'bg-white text-brand shadow-sm' : 'text-muted hover:text-gray-900'
                          }`}
                          aria-pressed={selected}
                        >
                          {status.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <Field label="Notas" htmlFor="client-notes" className="sm:col-span-2">
                  <textarea
                    id="client-notes"
                    value={values.notes}
                    onChange={(event) => setField('notes', event.target.value)}
                    rows={3}
                    className="input resize-none"
                    placeholder="Notas internas del cliente"
                  />
                </Field>
              </div>
            </section>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-surface-secondary/60 px-5 py-3">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-accent">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
