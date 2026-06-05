"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PlatformBenefit, PlatformBenefitVisual } from "@/lib/subscription-plans";

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

function BenefitVisual({ variant }: { variant: PlatformBenefitVisual }) {
  switch (variant) {
    case "brand":
      return (
        <div
          className="absolute inset-0 flex items-end justify-center overflow-hidden"
          aria-hidden
        >
          <div className="absolute inset-0 bg-linear-to-t from-[#0071e3]/25 via-transparent to-transparent" />
          <div className="relative mb-6 w-[78%] overflow-hidden rounded-2xl border border-white/10 bg-[#2c2c2e] shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#ff375f]" />
              <span className="h-2 w-2 rounded-full bg-[#ffd60a]" />
              <span className="h-2 w-2 rounded-full bg-[#30d158]" />
            </div>
            <div className="space-y-2 p-3">
              <div className="h-16 rounded-lg bg-linear-to-br from-[#0071e3] to-[#5e5ce6]" />
              <div className="grid grid-cols-3 gap-1.5">
                <div className="h-10 rounded-md bg-white/10" />
                <div className="h-10 rounded-md bg-white/10" />
                <div className="h-10 rounded-md bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      );
    case "payments":
      return (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
          <div className="relative h-36 w-[72%] rounded-2xl border border-white/15 bg-linear-to-br from-[#1a3a5c] to-[#0d1f33] p-4 shadow-xl">
            <div className="text-[10px] font-medium tracking-wider text-white/50 uppercase">
              Checkout
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-tight">$ 99.000</div>
            <div className="mt-4 h-8 rounded-full bg-[#0071e3] text-center text-xs leading-8 font-medium">
              Pagar con PayU
            </div>
          </div>
        </div>
      );
    case "operations":
      return (
        <div className="absolute inset-0 flex items-end justify-center pb-8" aria-hidden>
          <div className="grid w-[80%] grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-[10px] text-white/45">Pedidos</div>
              <div className="mt-1 text-lg font-semibold">128</div>
              <div className="mt-2 flex h-8 items-end gap-0.5">
                {[40, 65, 45, 80, 55, 90].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-sm bg-[#30d158]/80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-[10px] text-white/45">Ingresos</div>
              <div className="mt-1 text-lg font-semibold">$ 4.2M</div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-[#0071e3]" />
              </div>
            </div>
          </div>
        </div>
      );
    case "ai":
      return (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
          <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl border border-white/15 bg-linear-to-br from-[#5e5ce6]/40 to-[#0071e3]/30 shadow-[0_0_60px_rgba(94,92,230,0.35)]">
            <span className="text-4xl font-semibold tracking-tight text-white/90">IA</span>
            <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#30d158] text-xs font-bold">
              24
            </span>
          </div>
          <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
            <span className="rounded-full bg-[#25d366]/90 px-2.5 py-1 text-[10px] font-medium">
              WhatsApp
            </span>
            <span className="rounded-full bg-[#0088cc]/90 px-2.5 py-1 text-[10px] font-medium">
              Telegram
            </span>
          </div>
        </div>
      );
    case "scale":
      return (
        <div className="absolute inset-0 flex items-end justify-center" aria-hidden>
          <div className="mb-8 flex items-end gap-2">
            {["1 negocio", "10 negocios", "200"].map((label, i) => (
              <div
                key={label}
                className="flex flex-col items-center justify-end rounded-xl border border-white/10 bg-white/5 px-3 pb-2 text-center"
                style={{ height: `${4.5 + i * 2.5}rem`, width: "4.5rem" }}
              >
                <span className="mb-2 text-[9px] font-medium text-white/55">{label}</span>
                <span
                  className={`w-full rounded-md ${i === 2 ? "bg-[#5e5ce6]" : "bg-[#0071e3]/70"}`}
                  style={{ height: `${1.2 + i * 0.8}rem` }}
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
    <section className="relative overflow-visible border-t border-brand-separator bg-brand-bg py-14 sm:py-20">
      <div className="mx-auto max-w-[1068px] px-5 sm:px-8">
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-brand-primary sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          Lo que obtienes con CapiCode
        </h2>
        <p className="mt-3 max-w-xl text-base text-brand-secondary sm:text-lg">
          Una plataforma pensada para dueños de negocio, no solo para desarrolladores.
        </p>
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
          <div className="inline-block min-w-full py-8">
        <ul className="flex w-max items-stretch gap-4 px-5 sm:gap-5 sm:px-8 lg:px-[max(1.25rem,calc((100vw-1068px)/2+2rem))]">
          {benefits.map((item, index) => (
            <li key={item.label} className="flex shrink-0 px-2 py-3">
              <article className="group relative flex h-[26.5rem] w-[17.5rem] origin-center flex-col overflow-hidden rounded-[1.75rem] bg-[#1d1d1f] text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:scale-[1.02] motion-safe:hover:shadow-[0_28px_64px_-18px_rgba(0,0,0,0.5)] sm:h-[28.5rem] sm:w-[18.75rem] lg:h-[30rem] lg:w-[20rem]">
                <div className="relative z-10 flex flex-col gap-1.5 px-6 pt-7 sm:px-7">
                  <p className="text-xs font-medium text-white/55">{item.label}</p>
                  <h3 className="text-xl font-semibold leading-snug tracking-tight text-balance sm:text-[1.35rem]">
                    {item.headline}
                  </h3>
                </div>

                <div className="relative mt-auto min-h-[58%] flex-1">
                  <BenefitVisual variant={item.visual} />
                </div>

                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="absolute right-5 bottom-5 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-[#1d1d1f] shadow-md transition hover:bg-[#f5f5f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white select-auto"
                  aria-label={`Más información: ${item.headline}`}
                >
                  <PlusIcon />
                </button>
              </article>
            </li>
          ))}
        </ul>
          </div>
        </div>
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-4 backdrop-blur-sm sm:items-center"
          role="presentation"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="benefit-dialog-title"
            className="w-full max-w-md rounded-2xl border border-brand-separator bg-brand-surface p-6 shadow-brand-elevated sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-medium tracking-wide text-brand-secondary uppercase">
              {active.label}
            </p>
            <h3
              id="benefit-dialog-title"
              className="mt-2 text-xl font-semibold tracking-tight text-brand-primary sm:text-2xl"
            >
              {active.headline}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-brand-secondary sm:text-base">
              {active.description}
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-6 w-full rounded-full bg-brand-accent py-3 text-sm font-medium text-white transition hover:bg-brand-accent-hover"
            >
              Entendido
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
