"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  PlatformBenefit,
  PlatformBenefitAccent,
  PlatformBenefitVisual,
} from "@/lib/subscription-plans";
import {
  brandPageBg,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
} from "@/lib/brand-theme";

function useDragHorizontalScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollStartRef = useRef(0);

  const maxScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 0;
    return Math.max(0, el.scrollWidth - el.clientWidth);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;
    draggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragScrollStartRef.current = el.scrollLeft;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      const el = scrollRef.current;
      if (!el) return;
      const max = maxScroll();
      el.scrollLeft = Math.min(
        Math.max(0, dragScrollStartRef.current - (e.clientX - dragStartXRef.current)),
        max,
      );
    },
    [maxScroll],
  );

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  return {
    scrollRef,
    zoneRef,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  };
}

const ACCENT_STYLES: Record<
  PlatformBenefitAccent,
  {
    /** Hex principal para el glow/borde */
    hex: string;
    /** Color sólido del glow en light */
    lightGlow: string;
    /** Color sólido del glow en dark */
    darkGlow: string;
    /** Tinte de fondo en light */
    lightTint: string;
    /** Tinte de fondo en dark */
    darkTint: string;
    /** Color del border en light */
    lightBorder: string;
    /** Color del border en dark */
    darkBorder: string;
    /** Color del dot/label en light */
    lightDot: string;
    /** Color del dot/label en dark */
    darkDot: string;
    /** Color del glow del visual mockup */
    visualGlow: string;
  }
> = {
  blue: {
    hex: "#0071e3",
    lightGlow: "rgba(0, 113, 227, 0.16)",
    darkGlow: "rgba(41, 151, 255, 0.32)",
    lightTint: "from-[#0071e3]/8 via-brand-surface to-brand-surface",
    darkTint: "from-[#0071e3]/22 via-brand-surface to-brand-surface",
    lightBorder: "border-[#0071e3]/25",
    darkBorder: "dark:border-[#2997ff]/35",
    lightDot: "bg-[#0071e3]",
    darkDot: "dark:bg-[#2997ff]",
    visualGlow:
      "radial-gradient(ellipse 70% 55% at 50% 80%, rgba(0,113,227,0.22), transparent 70%)",
  },
  emerald: {
    hex: "#10b981",
    lightGlow: "rgba(16, 185, 129, 0.16)",
    darkGlow: "rgba(16, 185, 129, 0.32)",
    lightTint: "from-emerald-500/8 via-brand-surface to-brand-surface",
    darkTint: "from-emerald-500/18 via-brand-surface to-brand-surface",
    lightBorder: "border-emerald-500/30",
    darkBorder: "dark:border-emerald-400/35",
    lightDot: "bg-emerald-500",
    darkDot: "dark:bg-emerald-400",
    visualGlow:
      "radial-gradient(ellipse 70% 55% at 50% 80%, rgba(16,185,129,0.22), transparent 70%)",
  },
  amber: {
    hex: "#f59e0b",
    lightGlow: "rgba(245, 158, 11, 0.16)",
    darkGlow: "rgba(245, 158, 11, 0.32)",
    lightTint: "from-amber-500/8 via-brand-surface to-brand-surface",
    darkTint: "from-amber-500/18 via-brand-surface to-brand-surface",
    lightBorder: "border-amber-500/30",
    darkBorder: "dark:border-amber-400/35",
    lightDot: "bg-amber-500",
    darkDot: "dark:bg-amber-400",
    visualGlow:
      "radial-gradient(ellipse 70% 55% at 50% 80%, rgba(245,158,11,0.22), transparent 70%)",
  },
  violet: {
    hex: "#8b5cf6",
    lightGlow: "rgba(139, 92, 246, 0.18)",
    darkGlow: "rgba(167, 139, 250, 0.32)",
    lightTint: "from-violet-500/8 via-brand-surface to-brand-surface",
    darkTint: "from-violet-500/18 via-brand-surface to-brand-surface",
    lightBorder: "border-violet-500/30",
    darkBorder: "dark:border-violet-400/35",
    lightDot: "bg-violet-500",
    darkDot: "dark:bg-violet-400",
    visualGlow:
      "radial-gradient(ellipse 70% 55% at 50% 80%, rgba(139,92,246,0.22), transparent 70%)",
  },
  indigo: {
    hex: "#6366f1",
    lightGlow: "rgba(99, 102, 241, 0.16)",
    darkGlow: "rgba(129, 140, 248, 0.32)",
    lightTint: "from-indigo-500/8 via-brand-surface to-brand-surface",
    darkTint: "from-indigo-500/18 via-brand-surface to-brand-surface",
    lightBorder: "border-indigo-500/30",
    darkBorder: "dark:border-indigo-400/35",
    lightDot: "bg-indigo-500",
    darkDot: "dark:bg-indigo-400",
    visualGlow:
      "radial-gradient(ellipse 70% 55% at 50% 80%, rgba(99,102,241,0.22), transparent 70%)",
  },
};

function BenefitVisual({
  variant,
  accent,
}: {
  variant: PlatformBenefitVisual;
  accent: PlatformBenefitAccent;
}) {
  const glow = ACCENT_STYLES[accent].visualGlow;
  switch (variant) {
    case "brand":
      return (
        <div
          className="absolute inset-0 flex items-end justify-center overflow-hidden"
          aria-hidden
        >
          <div className="absolute inset-0" style={{ background: glow }} />
          <div className="relative mb-6 w-[78%] overflow-hidden rounded-2xl border border-white/60 bg-white shadow-[0_18px_42px_-12px_rgba(0,0,0,0.22),0_2px_6px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#2c2c2e] dark:shadow-[0_22px_50px_-14px_rgba(0,0,0,0.7),0_2px_8px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-1.5 border-b border-black/10 px-3 py-2 dark:border-white/10">
              <span className="h-2 w-2 rounded-full bg-[#ff375f]" />
              <span className="h-2 w-2 rounded-full bg-[#ffd60a]" />
              <span className="h-2 w-2 rounded-full bg-[#30d158]" />
            </div>
            <div className="space-y-2 p-3">
              <div
                className="h-16 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT_STYLES[accent].hex}, #5e5ce6)`,
                }}
              />
              <div className="grid grid-cols-3 gap-1.5">
                <div className="h-10 rounded-md bg-black/[0.06] dark:bg-white/10" />
                <div className="h-10 rounded-md bg-black/[0.06] dark:bg-white/10" />
                <div className="h-10 rounded-md bg-black/[0.06] dark:bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      );
    case "payments":
      return (
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <div className="absolute inset-0" style={{ background: glow }} />
          <div className="relative h-36 w-[72%] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_42px_-12px_rgba(0,0,0,0.22),0_2px_6px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#1a3a5c] dark:shadow-[0_22px_50px_-14px_rgba(0,0,0,0.7),0_2px_8px_rgba(0,0,0,0.5)]">
            <div className="bg-white/95 p-4 dark:bg-transparent">
              <div className="text-[10px] font-medium tracking-wider text-black/45 uppercase dark:text-white/50">
                Checkout
              </div>
              <div className="mt-3 text-2xl font-semibold tracking-tight text-black dark:text-white">
                $ 99.000
              </div>
              <div
                className="mt-4 h-8 rounded-full text-center text-xs leading-8 font-medium text-white"
                style={{ backgroundColor: ACCENT_STYLES[accent].hex }}
              >
                Pagar con PayU
              </div>
            </div>
          </div>
        </div>
      );
    case "operations":
      return (
        <div
          className="absolute inset-0 flex items-end justify-center pb-8"
          aria-hidden
        >
          <div className="absolute inset-0" style={{ background: glow }} />
          <div className="grid w-[80%] grid-cols-2 gap-2">
            <div className="rounded-xl border border-black/10 bg-white p-3 shadow-[0_8px_22px_-12px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)]">
              <div className="text-[10px] text-black/55 dark:text-white/45">
                Pedidos
              </div>
              <div className="mt-1 text-lg font-semibold text-black dark:text-white">
                128
              </div>
              <div className="mt-2 flex h-8 items-end gap-0.5">
                {[40, 65, 45, 80, 55, 90].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      backgroundColor: ACCENT_STYLES[accent].hex,
                      opacity: 0.85,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-3 shadow-[0_8px_22px_-12px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)]">
              <div className="text-[10px] text-black/55 dark:text-white/45">
                Ingresos
              </div>
              <div className="mt-1 text-lg font-semibold text-black dark:text-white">
                $ 4.2M
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "72%",
                    backgroundColor: ACCENT_STYLES[accent].hex,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    case "ai":
      return (
        <div
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden
        >
          <div className="absolute inset-0" style={{ background: glow }} />
          <div
            className="relative flex h-32 w-32 items-center justify-center rounded-3xl border border-white/15 text-white shadow-[0_0_60px_rgba(139,92,246,0.45)]"
            style={{
              background: `linear-gradient(135deg, ${ACCENT_STYLES[accent].hex}66, #0071e34d)`,
            }}
          >
            <span className="text-4xl font-semibold tracking-tight text-white/95">
              IA
            </span>
            <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#30d158] text-xs font-bold shadow-md">
              24
            </span>
          </div>
          <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
            <span className="rounded-full bg-[#25d366]/95 px-2.5 py-1 text-[10px] font-medium text-white shadow-md">
              WhatsApp
            </span>
            <span className="rounded-full bg-[#0088cc]/95 px-2.5 py-1 text-[10px] font-medium text-white shadow-md">
              Telegram
            </span>
          </div>
        </div>
      );
    case "scale":
      return (
        <div
          className="absolute inset-0 flex items-end justify-center"
          aria-hidden
        >
          <div className="absolute inset-0" style={{ background: glow }} />
          <div className="mb-8 flex items-end gap-2">
            {[
              { label: "1 negocio", h: 4.5, accent: false },
              { label: "10 negocios", h: 7.0, accent: false },
              { label: "200", h: 9.5, accent: true },
            ].map((bar) => (
              <div
                key={bar.label}
                className="flex flex-col items-center justify-end rounded-xl border border-black/10 bg-white px-3 pb-2 text-center shadow-[0_8px_22px_-12px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)]"
                style={{ height: `${bar.h}rem`, width: "4.5rem" }}
              >
                <span className="mb-2 text-[9px] font-medium text-black/60 dark:text-white/55">
                  {bar.label}
                </span>
                <span
                  className="w-full rounded-md"
                  style={{
                    height: `${1.2 + (bar.h - 4.5) * 0.35}rem`,
                    backgroundColor: bar.accent
                      ? ACCENT_STYLES[accent].hex
                      : "#0071e3",
                    opacity: bar.accent ? 1 : 0.65,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      );
  }
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 1v12M1 7h12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
    >
      <path
        d="M2 7h10m0 0L8 3m4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type PlatformBenefitsShowcaseProps = {
  benefits: PlatformBenefit[];
};

export function PlatformBenefitsShowcase({
  benefits,
}: PlatformBenefitsShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex != null ? benefits[activeIndex] : null;
  const {
    scrollRef,
    zoneRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  } = useDragHorizontalScroll();

  const close = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    if (activeIndex == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [activeIndex, close]);

  return (
    <section className="relative overflow-visible border-t border-brand-separator bg-brand-bg py-16 sm:py-24">
      <div className="mx-auto max-w-[1068px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={brandTextTertiary + " text-xs font-medium tracking-wide uppercase"}>
              Funciones clave
            </p>
            <h2
              className={`mt-2 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05] ${brandTextPrimary}`}
            >
              Lo que obtienes con CapiCode
            </h2>
            <p
              className={`mt-3 max-w-xl text-base sm:text-lg ${brandTextSecondary}`}
            >
              Una plataforma pensada para dueños de negocio, no solo para
              desarrolladores.
            </p>
          </div>
          <p className={`text-xs ${brandTextTertiary}`}>
            Arrastra para ver más
          </p>
        </div>
      </div>

      <div
        ref={zoneRef}
        className="mt-10 cursor-grab select-none touch-pan-x py-2 active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        aria-label="Arrastra con clic para ver más beneficios"
      >
        <div
          ref={scrollRef}
          className="benefits-scroll overflow-x-auto overscroll-x-contain"
        >
          <div className="inline-block min-w-full py-6">
            <ul className="flex w-max items-stretch gap-5 px-5 sm:gap-6 sm:px-8 lg:px-[max(1.25rem,calc((100vw-1068px)/2+2rem))]">
              {benefits.map((item, index) => {
                const accentKey: PlatformBenefitAccent =
                  item.accent ?? "blue";
                const accent = ACCENT_STYLES[accentKey];
                return (
                  <li
                    key={item.label}
                    className="flex shrink-0 px-1.5 py-3"
                  >
                    <article
                      className={`group relative flex h-[28rem] w-[18.5rem] origin-center flex-col overflow-hidden rounded-[1.75rem] border bg-gradient-to-b ${accent.lightBorder} ${accent.lightTint} ${accent.darkBorder} ${accent.darkTint} text-brand-primary shadow-[0_18px_44px_-14px_rgba(0,0,0,0.16),0_4px_12px_-4px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.03] backdrop-blur-md transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-14px_rgba(0,0,0,0.24),0_6px_18px_-4px_rgba(0,0,0,0.1)] sm:h-[30rem] sm:w-[19.5rem] lg:h-[31rem] lg:w-[20rem] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_24px_56px_-14px_rgba(0,0,0,0.65),0_6px_18px_-6px_rgba(0,0,0,0.5)] dark:ring-0 dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_34px_72px_-14px_rgba(0,0,0,0.8),0_8px_24px_-4px_rgba(0,0,0,0.6)]`}
                      style={{
                        ["--accent-glow" as string]: accent.lightGlow,
                      }}
                    >
                      {/* Top accent stripe */}
                      <div
                        className="absolute inset-x-0 top-0 h-[3px]"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${accent.hex}, transparent)`,
                        }}
                        aria-hidden
                      />

                      {/* Hover glow ring */}
                      <div
                        className="pointer-events-none absolute inset-0 rounded-[1.75rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          boxShadow: `inset 0 0 0 1px ${accent.hex}40`,
                        }}
                        aria-hidden
                      />

                      {/* Header */}
                      <div className="relative z-10 flex flex-col gap-2 px-6 pt-7 sm:px-7">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${accent.lightDot} ${accent.darkDot} shadow-[0_0_8px_currentColor]`}
                            style={{ color: accent.hex }}
                            aria-hidden
                          />
                          <p
                            className={`text-[11px] font-medium tracking-wide uppercase ${brandTextSecondary}`}
                          >
                            {item.label}
                          </p>
                        </div>
                        <h3
                          className={`text-[1.35rem] font-semibold leading-[1.2] tracking-tight text-balance ${brandTextPrimary}`}
                        >
                          {item.headline}
                        </h3>
                      </div>

                      {/* Visual */}
                      <div className="relative mt-4 min-h-[55%] flex-1">
                        <BenefitVisual
                          variant={item.visual}
                          accent={accentKey}
                        />
                      </div>

                      {/* Footer CTA */}
                      <button
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="relative z-20 mx-6 mb-6 flex select-auto items-center justify-between rounded-full border border-brand-separator/70 bg-brand-surface/85 px-4 py-2.5 text-xs font-medium text-brand-primary backdrop-blur-md transition-[background-color,border-color,color] hover:border-brand-input-border hover:bg-brand-surface-hover sm:mx-7 dark:border-white/10 dark:bg-[#1c1c1e]/70 dark:text-brand-secondary dark:hover:border-white/20 dark:hover:bg-[#2c2c2e]/85 dark:hover:text-brand-primary"
                        aria-label={`Más información: ${item.headline}`}
                      >
                        <span>Ver detalle</span>
                        <ArrowRightIcon />
                      </button>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {active ? (
        <BenefitDialog
          benefit={active}
          accent={active.accent ?? "blue"}
          onClose={close}
        />
      ) : null}
    </section>
  );
}

function BenefitDialog({
  benefit,
  accent: accentKey,
  onClose,
}: {
  benefit: PlatformBenefit;
  accent: PlatformBenefitAccent;
  onClose: () => void;
}) {
  const accent = ACCENT_STYLES[accentKey];
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 backdrop-blur-md animate-[alert-backdrop-in_180ms_ease-out] sm:items-center sm:p-4 dark:bg-black/75"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="benefit-dialog-title"
        className={`relative w-full max-w-md overflow-hidden rounded-t-3xl border bg-brand-surface p-6 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.35)] sm:rounded-3xl sm:p-8 dark:border-brand-separator dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_30px_80px_-12px_rgba(0,0,0,0.75)] ${brandPageBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accent.lightGlow}, transparent 60%)`,
          }}
          aria-hidden
        />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${accent.lightDot} ${accent.darkDot}`}
              style={{ boxShadow: `0 0 8px ${accent.hex}` }}
              aria-hidden
            />
            <p className={`text-xs font-medium tracking-wide uppercase ${brandTextSecondary}`}>
              {benefit.label}
            </p>
          </div>
          <h3
            id="benefit-dialog-title"
            className={`mt-3 text-xl font-semibold tracking-tight sm:text-2xl ${brandTextPrimary}`}
          >
            {benefit.headline}
          </h3>
          <p
            className={`mt-4 text-sm leading-relaxed sm:text-base ${brandTextSecondary}`}
          >
            {benefit.description}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-full bg-brand-accent py-3 text-sm font-medium text-white shadow-[0_6px_20px_-4px_rgba(0,113,227,0.4)] transition hover:bg-brand-accent-hover hover:shadow-[0_10px_28px_-4px_rgba(0,113,227,0.5)] dark:shadow-[0_8px_28px_-4px_rgba(41,151,255,0.6),0_0_0_1px_rgba(41,151,255,0.35)]"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}