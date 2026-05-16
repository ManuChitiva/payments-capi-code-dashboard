"use client";

import type { ReactNode } from "react";

type ConfirmActionModalProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  confirming?: boolean;
  variant?: "default" | "danger" | "success";
  onClose: () => void;
  onConfirm: () => void;
};

const confirmButtonStyles = {
  default:
    "border-white/15 bg-white/10 text-slate-100 hover:bg-white/15",
  danger:
    "border-rose-400/40 bg-rose-500/20 text-rose-100 hover:bg-rose-500/30",
  success:
    "border-emerald-300/40 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30",
};

export function ConfirmActionModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  confirming = false,
  variant = "default",
  onClose,
  onConfirm,
}: ConfirmActionModalProps) {
  if (!open) return null;

  const headerGradient =
    variant === "danger"
      ? "bg-gradient-to-r from-rose-500/10 via-orange-500/5 to-transparent"
      : variant === "success"
        ? "bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent"
        : "bg-gradient-to-r from-slate-500/10 via-white/5 to-transparent";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-action-title"
      onClick={onClose}
    >
      <div
        className="max-h-[92dvh] w-full min-w-0 max-w-md overflow-x-hidden overflow-y-auto rounded-t-3xl border border-white/15 bg-[#0d1320] shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`min-w-0 border-b border-white/10 px-6 py-5 ${headerGradient}`}
        >
          <h3
            id="confirm-action-title"
            className="text-xl font-semibold break-words"
          >
            {title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed wrap-anywhere text-slate-400">
            {description}
          </p>
        </div>
        <div className="flex justify-end gap-2 border-t border-white/10 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={confirming}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming}
            className={`rounded-xl border px-4 py-2 text-sm font-medium disabled:opacity-60 ${confirmButtonStyles[variant]}`}
          >
            {confirming ? "Procesando…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
