"use client";

import { ContactRowMenu } from "@/components/ContactRowMenu";
import { isFollowUpDue } from "@/lib/contact-follow-up";

export type ContactListItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  message: string;
  status: "new" | "contacted" | "closed";
  notes: string | null;
  client_id: string | null;
  follow_up_date: string | null;
  next_action: string | null;
  created_at: string;
};

type StatusFilter = "all" | "new" | "contacted" | "closed";

const statusConfig: Record<
  Exclude<StatusFilter, "all">,
  { label: string; bg: string; text: string }
> = {
  new: { label: "Nuevo", bg: "bg-accent/10", text: "text-accent-dark" },
  contacted: { label: "Contactado", bg: "bg-warning/10", text: "text-warning-dark" },
  closed: { label: "Cerrado", bg: "bg-gray-100", text: "text-gray-600" },
};

type Props = {
  contacts: ContactListItem[];
  actionsOpen: string | null;
  setActionsOpen: (id: string | null) => void;
  convertingId: string | null;
  onViewMessage: (contact: ContactListItem) => void;
  onCotizar: (contact: ContactListItem) => void;
  onRegisterClient: (contact: ContactListItem) => void;
  onFollowUp: (contact: ContactListItem) => void;
  onStatusChange: (contactId: string, status: ContactListItem["status"]) => void;
  formatDate: (date: string) => string;
};

function StatusBadge({ status }: { status: ContactListItem["status"] }) {
  const style = statusConfig[status];
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}

export function ContactosList({
  contacts,
  actionsOpen,
  setActionsOpen,
  convertingId,
  onViewMessage,
  onCotizar,
  onRegisterClient,
  onFollowUp,
  onStatusChange,
  formatDate,
}: Props) {
  const menuProps = (contact: ContactListItem, index: number, total: number) => ({
    open: actionsOpen === contact.id,
    openUpward: index >= total - 3,
    onToggle: () => setActionsOpen(actionsOpen === contact.id ? null : contact.id),
    status: contact.status,
    hasClient: !!contact.client_id,
    hasPhone: !!contact.phone,
    email: contact.email,
    phone: contact.phone,
    onViewMessage: () => {
      setActionsOpen(null);
      onViewMessage(contact);
    },
    onCotizar: () => {
      setActionsOpen(null);
      onCotizar(contact);
    },
    onRegisterClient: () => {
      setActionsOpen(null);
      onRegisterClient(contact);
    },
    onFollowUp: () => {
      setActionsOpen(null);
      onFollowUp(contact);
    },
    onStatusChange: (status: ContactListItem["status"]) => {
      setActionsOpen(null);
      onStatusChange(contact.id, status);
    },
  });

  return (
    <>
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="w-full table-fixed text-sm">
          <thead className="border-b border-gray-100 bg-surface-secondary/60 text-[11px] uppercase tracking-wider text-muted">
            <tr>
              <th className="text-left font-semibold px-4 py-2 w-[22%]">Contacto</th>
              <th className="text-left font-semibold px-3 py-2 w-[10%]">Estado</th>
              <th className="text-left font-semibold px-3 py-2">Mensaje</th>
              <th className="text-left font-semibold px-3 py-2 w-[12%]">Recibido</th>
              <th className="px-2 py-2 w-[14%] text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr
                key={contact.id}
                onClick={() => onViewMessage(contact)}
                className="cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors hover:bg-accent/[0.04]"
              >
                <td className="px-4 py-3 align-top overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand">
                      {contact.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{contact.name}</p>
                      <p className="text-xs text-muted truncate">{contact.email}</p>
                      {contact.service ? (
                        <p className="text-[11px] text-purple-700 truncate mt-0.5">{contact.service}</p>
                      ) : null}
                      {contact.client_id ? (
                        <p className="text-[10px] text-brand mt-0.5">Cliente vinculado</p>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 align-top">
                  <div className="flex flex-col gap-1 items-start">
                    <StatusBadge status={contact.status} />
                    {contact.follow_up_date && contact.status !== "closed" ? (
                      <span
                        className={`text-[10px] font-medium ${
                          isFollowUpDue(contact) ? "text-red-600" : "text-muted"
                        }`}
                      >
                        Seg.{" "}
                        {new Date(`${contact.follow_up_date}T12:00:00`).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-3 py-3 align-top overflow-hidden">
                  <p className="text-gray-700 line-clamp-2 text-xs leading-relaxed">{contact.message}</p>
                  {contact.next_action ? (
                    <p className="text-[10px] text-muted mt-1 truncate">→ {contact.next_action}</p>
                  ) : null}
                </td>
                <td className="px-3 py-3 align-top whitespace-nowrap text-xs text-muted">
                  {formatDate(contact.created_at)}
                </td>
                <td className="px-2 py-3 align-top text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      disabled={convertingId === contact.id}
                      onClick={() => onCotizar(contact)}
                      className="btn-primary text-xs px-2.5 py-1.5 rounded-md disabled:opacity-60"
                    >
                      {convertingId === contact.id ? "…" : "Cotizar"}
                    </button>
                    <ContactRowMenu {...menuProps(contact, index, contacts.length)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-100">
        {contacts.map((contact, index) => (
          <div
            key={contact.id}
            className="px-3 py-3 active:bg-accent/[0.04]"
            onClick={() => onViewMessage(contact)}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand">
                {contact.name.charAt(0).toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{contact.name}</p>
                  <StatusBadge status={contact.status} />
                </div>
                <p className="text-xs text-muted truncate">{contact.email}</p>
                <p className="mt-1 text-xs text-gray-700 line-clamp-2">{contact.message}</p>
                <p className="text-[11px] text-muted mt-1">{formatDate(contact.created_at)}</p>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <ContactRowMenu {...menuProps(contact, index, contacts.length)} />
              </div>
            </div>
            <div className="mt-2 flex gap-2 pl-12" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                disabled={convertingId === contact.id}
                onClick={() => onCotizar(contact)}
                className="flex-1 btn-primary text-xs py-2 rounded-md disabled:opacity-60"
              >
                Cotizar
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
