"use client";

import type { ReactNode } from "react";
import {
  brandModalCancelBtn,
  brandModalDesc,
  brandModalFooter,
  brandModalHeader,
  brandModalOverlay,
  brandModalPanelMd,
  brandModalTitle,
} from "@/lib/brand-theme";

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
    "rounded-xl border border-brand-separator bg-brand-hover px-4 py-2 text-sm font-medium text-brand-primary hover:bg-brand-surface-hover",
  danger:
    "rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-800 hover:bg-rose-100 dark:border-rose-400/40 dark:bg-rose-500/20 dark:text-rose-100 dark:hover:bg-rose-500/30",
  success:
    "rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100 dark:border-emerald-300/40 dark:bg-emerald-500/20 dark:text-emerald-100 dark:hover:bg-emerald-500/30",
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

  const headerTint =
    variant === "danger"
      ? "bg-rose-50 dark:bg-rose-500/10"
      : variant === "success"
        ? "bg-brand-accent/8 dark:bg-brand-accent/10"
        : "bg-brand-surface-hover";

  return (
    <div
      className={brandModalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-action-title"
      onClick={onClose}
    >
      <div className={brandModalPanelMd} onClick={(e) => e.stopPropagation()}>
        <div className={`${brandModalHeader} ${headerTint}`}>
          <h3 id="confirm-action-title" className={brandModalTitle}>
            {title}
          </h3>
          <p className={brandModalDesc}>{description}</p>
        </div>
        <div className={brandModalFooter}>
          <button
            type="button"
            onClick={onClose}
            disabled={confirming}
            className={brandModalCancelBtn}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirming}
            className={`disabled:opacity-60 ${confirmButtonStyles[variant]}`}
          >
            {confirming ? "Procesando…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
