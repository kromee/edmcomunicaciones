"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SessionUser } from "@/types/session";
import { Sidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import {
  QUOTE_ITEM_UNIT_OPTIONS,
  normalizeQuoteItemUnit,
  getQuoteItemUnitLabel,
} from "@/lib/quote-item-units";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/Modal";

type CatalogItem = {
  id: string;
  title: string;
  description: string;
  default_quantity: number;
  unit: string;
  default_unit_price: number;
  default_percentage: number;
  category: string | null;
  is_active: boolean;
  sort_order: number;
};

const emptyForm = {
  title: "",
  description: "",
  default_quantity: "1",
  unit: "PZA",
  default_unit_price: "0",
  default_percentage: "0",
  category: "",
  is_active: true,
  sort_order: "0",
};

export default function ConceptosClient({
  items,
  user,
}: {
  items: CatalogItem[];
  user: SessionUser;
}) {
  const router = useRouter();
  const { modal, hideModal, showSuccess, showError, showConfirm } = useModal();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CatalogItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const filtered = items.filter((item) => {
    if (!search.trim()) return true;
    const t = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(t) ||
      item.description.toLowerCase().includes(t) ||
      (item.category && item.category.toLowerCase().includes(t))
    );
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item: CatalogItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      default_quantity: String(item.default_quantity),
      unit: normalizeQuoteItemUnit(item.unit),
      default_unit_price: String(item.default_unit_price),
      default_percentage: String(item.default_percentage),
      category: item.category || "",
      is_active: item.is_active,
      sort_order: String(item.sort_order),
    });
    setShowForm(true);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showError("Error", "El título es obligatorio");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        default_quantity: parseInt(form.default_quantity, 10) || 1,
        default_unit_price: parseFloat(form.default_unit_price) || 0,
        default_percentage: parseFloat(form.default_percentage) || 0,
        sort_order: parseInt(form.sort_order, 10) || 0,
        category: form.category.trim() || null,
      };
      const url = editing ? "/api/catalog/update" : "/api/catalog/create";
      const method = editing ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
      });
      const data = await response.json();
      if (data.success) {
        showSuccess("Guardado", editing ? "Concepto actualizado" : "Concepto creado");
        setShowForm(false);
        router.refresh();
      } else {
        showError("Error", data.error || "No se pudo guardar");
      }
    } catch {
      showError("Error", "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const remove = (item: CatalogItem) => {
    showConfirm(
      "Eliminar concepto",
      `¿Eliminar "${item.title}" del catálogo?`,
      async () => {
        const response = await fetch("/api/catalog/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id }),
        });
        const data = await response.json();
        if (data.success) {
          showSuccess("Eliminado", "Concepto quitado del catálogo");
          router.refresh();
        } else {
          showError("Error", data.error || "No se pudo eliminar");
        }
      },
      "Eliminar",
      "Cancelar"
    );
  };

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="min-h-screen bg-surface-secondary">
      <Sidebar defaultCollapsed onCollapsedChange={setSidebarCollapsed} />
      <DashboardHeader user={user} onLogout={handleLogout} sidebarCollapsed={sidebarCollapsed} />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Conceptos</h1>
              <p className="text-muted mt-1">Partidas reutilizables en el cotizador</p>
            </div>
            <button type="button" onClick={openCreate} className="btn-primary">
              Nuevo concepto
            </button>
          </div>

          <div className="mb-4">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar concepto..."
              className="input max-w-md"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-gray-100 bg-white p-10 text-center text-muted">
              {items.length === 0
                ? "Aún no hay conceptos. Crea el primero para usarlo al cotizar."
                : "Sin resultados para la búsqueda."}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-surface-secondary/60 text-[11px] uppercase tracking-wider text-muted">
                  <tr>
                    <th className="text-left font-semibold px-4 py-2">Concepto</th>
                    <th className="text-left font-semibold px-3 py-2 w-24">Cant.</th>
                    <th className="text-left font-semibold px-3 py-2 w-28">Precio</th>
                    <th className="text-left font-semibold px-3 py-2 w-24">Estado</th>
                    <th className="px-2 py-2 w-28 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="px-4 py-3 align-top">
                        <p className="font-medium text-gray-900">{item.title}</p>
                        {item.description ? (
                          <p className="text-xs text-muted line-clamp-2 mt-0.5">{item.description}</p>
                        ) : null}
                        {item.category ? (
                          <p className="text-[10px] text-purple-700 mt-1">{item.category}</p>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-muted">
                        {item.default_quantity} {getQuoteItemUnitLabel(item.unit)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap font-medium text-brand">
                        {formatMoney(Number(item.default_unit_price))}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            item.is_active ? "bg-success/10 text-success-dark" : "bg-gray-100 text-muted"
                          }`}
                        >
                          {item.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-right space-x-1">
                        <button type="button" onClick={() => openEdit(item)} className="text-xs text-accent font-medium hover:underline">
                          Editar
                        </button>
                        <button type="button" onClick={() => remove(item)} className="text-xs text-danger font-medium hover:underline">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <form
            onSubmit={save}
            className="bg-white rounded-2xl w-full max-w-md shadow-elevated max-h-[90vh] overflow-y-auto"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold">{editing ? "Editar concepto" : "Nuevo concepto"}</h3>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Título *</label>
                <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción (en cotización)</label>
                <textarea className="input h-20 resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Cantidad</label>
                  <input type="number" min={0} className="input" value={form.default_quantity} onChange={(e) => setForm({ ...form, default_quantity: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unidad</label>
                  <select className="input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                    {QUOTE_ITEM_UNIT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Precio unitario</label>
                  <input type="number" min={0} step="0.01" className="input" value={form.default_unit_price} onChange={(e) => setForm({ ...form, default_unit_price: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">% markup</label>
                  <input type="number" step="0.1" className="input" value={form.default_percentage} onChange={(e) => setForm({ ...form, default_percentage: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Categoría (opcional)</label>
                <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="CCTV, cableado…" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                Activo en catálogo
              </label>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button type="button" className="flex-1 btn-secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="flex-1 btn-accent disabled:opacity-60">
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}

      <Modal isOpen={modal.isOpen} onClose={hideModal} title={modal.title} message={modal.message} type={modal.type} onConfirm={modal.onConfirm} confirmText={modal.confirmText} cancelText={modal.cancelText} />
    </div>
  );
}
