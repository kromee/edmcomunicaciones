"use client";

import { useEffect, useState } from "react";
import {
  getQuoteItemUnitLabel,
  type QuoteItemUnit,
} from "@/lib/quote-item-units";

export type CatalogItemRecord = {
  id: string;
  title: string;
  description: string;
  default_quantity: number;
  unit: QuoteItemUnit | string;
  default_unit_price: number;
  default_percentage: number;
  category: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (item: CatalogItemRecord) => void;
};

export function CatalogPickerModal({ open, onClose, onSelect }: Props) {
  const [items, setItems] = useState<CatalogItemRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/catalog/list?active=1");
        const data = await res.json();
        if (data.success) {
          setItems(data.items || []);
        } else {
          setError(data.error || "No se pudo cargar el catálogo");
        }
      } catch {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open]);

  if (!open) return null;

  const term = search.trim().toLowerCase();
  const filtered = term
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          (item.category && item.category.toLowerCase().includes(term))
      )
    : items;

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-elevated max-h-[85vh] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Catálogo de conceptos</h3>
            <p className="text-sm text-muted">Elige una partida para agregar a la cotización</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-md hover:bg-surface-secondary text-muted" aria-label="Cerrar">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar concepto..."
            className="input"
          />
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {loading ? (
            <p className="p-6 text-center text-muted text-sm">Cargando…</p>
          ) : error ? (
            <p className="p-6 text-center text-sm text-red-600">{error}</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-center text-muted text-sm">
              {items.length === 0
                ? "No hay conceptos en el catálogo. Créalos en Conceptos del menú."
                : "Sin resultados"}
            </p>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="w-full text-left px-5 py-3 hover:bg-accent/[0.06] transition-colors"
              >
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{item.title}</p>
                    {item.description ? (
                      <p className="text-xs text-muted line-clamp-2 mt-0.5">{item.description}</p>
                    ) : null}
                    <p className="text-[11px] text-muted mt-1">
                      {item.default_quantity} {getQuoteItemUnitLabel(String(item.unit))}
                      {item.category ? ` · ${item.category}` : ""}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-brand shrink-0">
                    {formatMoney(Number(item.default_unit_price))}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
