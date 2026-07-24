'use client';

type CommercialTermsEditorProps = {
  terms: string[];
  onChange: (terms: string[]) => void;
};

export function CommercialTermsEditor({ terms, onChange }: CommercialTermsEditorProps) {
  const updateTerm = (index: number, value: string) => {
    onChange(terms.map((term, i) => (i === index ? value : term)));
  };

  const addTerm = () => {
    onChange([...terms, '']);
  };

  const removeTerm = (index: number) => {
    if (terms.length <= 1) {
      onChange(['']);
      return;
    }
    onChange(terms.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Condiciones que aparecerán en el PDF. Puedes editarlas, agregar o quitar líneas.
      </p>
      <ul className="space-y-2">
        {terms.map((term, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-2.5 text-muted select-none" aria-hidden>
              •
            </span>
            <input
              type="text"
              value={term}
              onChange={(e) => updateTerm(index, e.target.value)}
              className="input flex-1"
              placeholder={`Condición ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => removeTerm(index)}
              className="mt-1 p-2 rounded-lg text-muted hover:text-danger hover:bg-danger/5 transition-colors"
              title="Quitar condición"
              aria-label={`Quitar condición ${index + 1}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={addTerm}
        className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Agregar condición
      </button>
    </div>
  );
}
