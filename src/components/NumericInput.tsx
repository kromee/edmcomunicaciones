'use client';

import { useState } from 'react';

type NumericInputProps = {
  value: number;
  onChange: (value: number) => void;
  step?: number | string;
  min?: number;
  className?: string;
  center?: boolean;
};

/** Input numérico: permite borrar el 0, selecciona todo al enfocar (clic o tab). */
export function NumericInput({
  value,
  onChange,
  step,
  min,
  className = '',
  center = false,
}: NumericInputProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft !== null ? draft : String(value);

  const commit = (raw: string) => {
    const fallback = min !== undefined && min > 0 ? min : 0;
    if (raw === '' || raw === '-' || raw === '.') {
      onChange(fallback);
      return;
    }
    const n = parseFloat(raw);
    if (Number.isNaN(n)) {
      onChange(fallback);
      return;
    }
    if (min !== undefined && n < min) {
      onChange(min);
      return;
    }
    onChange(n);
  };

  const selectAll = (el: HTMLInputElement) => {
    requestAnimationFrame(() => el.select());
  };

  return (
    <input
      type="number"
      step={step}
      min={min}
      value={shown}
      onFocus={(e) => {
        setDraft(String(value));
        selectAll(e.currentTarget);
      }}
      onClick={(e) => selectAll(e.currentTarget)}
      onChange={(e) => {
        const v = e.target.value;
        setDraft(v);
        if (v === '' || v === '-') return;
        const n = parseFloat(v);
        if (!Number.isNaN(n)) onChange(n);
      }}
      onBlur={() => {
        if (draft !== null) commit(draft);
        setDraft(null);
      }}
      className={`${className}${center ? ' text-center' : ''}`}
    />
  );
}
