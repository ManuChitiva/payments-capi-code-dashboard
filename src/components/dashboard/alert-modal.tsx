"use client";

import { useEffect, useState } from "react";
import {
  brandTextPrimary,
  brandTextSecondary,
} from "@/lib/brand-theme";

export type AlertTone = "success" | "error" | "info";

export type AlertModalProps = {
  open: boolean;
  tone?: AlertTone;
  title: string;
  description?: string;
  /** Tiempo en ms antes de auto-cerrar (solo success/info). 0 = sin auto-close. */
  autoCloseMs?: number;
  onClose: () => void;
};

const toneIcon: Record<AlertTone, string> = {
  success:
    "border-emerald-400/50 bg-emerald-500/15 text-emerald-700 shadow-[0_4px_14px_-2px_rgba(16,185,129,0.35)] dark:border-emerald-400/40 dark:bg-emerald-500/20 dark:text-emerald-200 dark:shadow-[0_4px_16px_-2px_rgba(16,185,129,0.5),0_0_0_1px_rgba(16,185,129,0.2)]",
  error:
    "border-rose-400/50 bg-rose-500/15 text-rose-700 shadow-[0_4px_14px_-2px_rgba(244,63,94,0.35)] dark:border-rose-400/40 dark:bg-rose-500/20 dark:text-rose-200 dark:shadow-[0_4px_16px_-2px_rgba(244,63,94,0.5),0_0_0_1px_rgba(244,63,94,0.2)]",
  info:
    "border-brand-accent/40 bg-brand-accent/12 text-brand-accent shadow-[0_4px_14px_-2px_rgba(0,113,227,0.35)] dark:border-brand-accent-soft/40 dark:bg-brand-accent-soft/15 dark:text-brand-accent-soft dark:shadow-[0_4px_16px_-2px_rgba(41,151,255,0.5),0_0_0_1px_rgba(41,151,255,0.2)]",
};

const toneProgress: Record<AlertTone, string> = {
  success: "bg-emerald-500 dark:bg-emerald-400",
  error: "bg-rose-500 dark:bg-rose-400",
  info: "bg-brand-accent dark:bg-brand-accent-soft",
};

const AUTO_CLOSE_DEFAULT = 4500;

export function AlertModal({
  open,
  tone = "success",
  title,
  description,
  autoCloseMs = AUTO_CLOSE_DEFAULT,
  onClose,
}: AlertModalProps) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Auto-close: pausa cuando el cursor está encima del banner
  useEffect(() => {
    if (!open) return;
    if (hovered) return;
    if (autoCloseMs <= 0 || tone === "error") return;
    const timer = window.setTimeout(onClose, autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [open, hovered, tone, autoCloseMs, onClose]);

  // Reset hover cuando cambia el mensaje
  useEffect(() => {
    setHovered(false);
  }, [title, tone]);

  if (!open) return null;

  const showProgress = autoCloseMs > 0 && tone !== "error";

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-3 z-[60] flex justify-center px-3 sm:bottom-5 sm:px-6"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className="pointer-events-auto relative w-full max-w-[34rem] overflow-hidden rounded-2xl border border-white/40 bg-white/70 shadow-[0_18px_48px_-12px_rgba(0,0,0,0.28),0_4px_14px_-4px_rgba(0,0,0,0.12)] backdrop-blur-2xl backdrop-saturate-150 animate-[alert-banner-in_320ms_cubic-bezier(0.22,1,0.36,1)] dark:border-white/10 dark:bg-[#1c1c1e]/55 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_22px_56px_-12px_rgba(0,0,0,0.7),0_8px_24px_-6px_rgba(0,0,0,0.5)]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex items-start gap-3 px-4 py-3 sm:gap-3.5 sm:px-5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${toneIcon[tone]}`}
            aria-hidden
          >
            <AlertIcon tone={tone} />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p
              className={`text-sm leading-snug font-semibold tracking-tight ${brandTextPrimary}`}
            >
              {title}
            </p>
            {description ? (
              <p
                className={`mt-0.5 text-xs leading-snug ${brandTextSecondary}`}
              >
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar notificación"
            className="shrink-0 rounded-lg p-1.5 text-brand-tertiary transition hover:bg-brand-hover hover:text-brand-primary dark:hover:bg-white/10"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {showProgress ? (
          <div className="absolute top-0 right-0 left-0 h-[2px] overflow-hidden bg-black/5 dark:bg-white/10">
            <div
              key={`${title}-${tone}`}
              className={`h-full ${toneProgress[tone]}`}
              style={{
                animation: `alert-progress ${autoCloseMs}ms linear forwards`,
                transformOrigin: "left",
                width: "100%",
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AlertIcon({ tone }: { tone: AlertTone }) {
  const cls = "h-5 w-5";
  if (tone === "success") {
    return (
      <svg
        className={cls}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 12.75 6 6 9-13.5"
        />
      </svg>
    );
  }
  if (tone === "error") {
    return (
      <svg
        className={cls}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
        />
      </svg>
    );
  }
  return (
    <svg
      className={cls}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
      />
    </svg>
  );
}