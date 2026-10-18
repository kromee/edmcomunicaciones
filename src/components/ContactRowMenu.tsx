"use client";

import { useEffect, useRef, useState } from "react";

type ContactStatus = "new" | "contacted" | "closed";

type Props = {
  open: boolean;
  openUpward: boolean;
  onToggle: () => void;
  status: ContactStatus;
  hasClient: boolean;
  hasPhone: boolean;
  email: string;
  phone: string | null;
  onViewMessage: () => void;
  onCotizar: () => void;
  onRegisterClient: () => void;
  onFollowUp: () => void;
  onStatusChange: (status: ContactStatus) => void;
};

const statusLabels: Record<ContactStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  closed: "Cerrado",
};

export function ContactRowMenu({
  open,
  openUpward,
  onToggle,
  status,
  hasClient,
  hasPhone,
  email,
  phone,
  onViewMessage,
  onCotizar,
  onRegisterClient,
  onFollowUp,
  onStatusChange,
}: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    upward: boolean;
  } | null>(null);

  useEffect(() => {
    if (!open || !buttonRef.current) {
      setCoords(null);
      return;
    }

    const place = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const upward = openUpward || rect.bottom + 320 > window.innerHeight;
      setCoords({
        top: upward ? rect.top - 4 : rect.bottom + 4,
        left: rect.right,
        upward,
      });
    };

    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open, openUpward]);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        className="p-1.5 rounded-md hover:bg-surface-secondary transition-colors text-muted hover:text-gray-900"
        aria-label="Más acciones"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {open && coords && (
        <div
          className="fixed z-50 w-52 bg-white rounded-md shadow-elevated border border-gray-100 py-1.5 max-h-[70vh] overflow-y-auto"
          style={{
            top: coords.top,
            left: coords.left,
            transform: coords.upward ? "translate(-100%, -100%)" : "translateX(-100%)",
          }}
        >
          <button type="button" onClick={onViewMessage} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-surface-secondary">
            Ver mensaje
          </button>
          <button type="button" onClick={onCotizar} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-surface-secondary">
            Cotizar
          </button>
          <button type="button" onClick={onRegisterClient} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-surface-secondary">
            {hasClient ? "Ver cliente" : "Registrar como cliente"}
          </button>
          <button type="button" onClick={onFollowUp} className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-surface-secondary">
            Seguimiento y notas
          </button>
          <a href={`mailto:${email}`} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-surface-secondary">
            Email
          </a>
          {hasPhone && phone ? (
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-surface-secondary"
            >
              WhatsApp
            </a>
          ) : null}
          <div className="my-1 border-t border-gray-100" />
          <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-light">Estado</p>
          {(["new", "contacted", "closed"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onStatusChange(s)}
              className={`flex w-full items-center px-4 py-2 text-sm hover:bg-surface-secondary ${
                status === s ? "font-medium text-gray-900" : "text-gray-700"
              }`}
            >
              {statusLabels[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
