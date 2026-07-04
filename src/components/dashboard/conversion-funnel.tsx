"use client";

import {
  formatCompactCopCurrency,
  formatCompactNumber,
} from "@/lib/dashboard/format";

/**
 * Embudo "intención → compra real".
 * Cinco etapas: VIEW → CLICK → CART → INTENT → PAID.
 * Cada fila muestra su valor absoluto más el % relativo al escalón previo.
 * Al pie, un bloque con la conversión global (intents → pagos aprobados).
 */
export type ConversionFunnelProps = {
  views: number;
  clicks: number;
  carts: number;
  intents: number;
  paidCount: number;
  paidAmount: number;
};

type Row = {
  key: string;
  label: string;
  value: number;
  /** Es el valor de la etapa inmediatamente anterior, para calcular % conversión. */
  previousValue: number;
  color: string;
  tint: string;
  suffix?: string;
};

export function ConversionFunnel({
  views,
  clicks,
  carts,
  intents,
  paidCount,
  paidAmount,
}: ConversionFunnelProps) {
  const rows: Row[] = [
    {
      key: "views",
      label: "Visualizaciones",
      value: views,
      previousValue: views,
      color: "var(--brand-chart-1)",
      tint:
        "border-brand-accent/25 bg-brand-accent/10 text-brand-accent dark:border-brand-accent-soft/35 dark:bg-brand-accent-soft/12 dark:text-brand-accent-soft",
    },
    {
      key: "clicks",
      label: "Clics en producto",
      value: clicks,
      previousValue: views,
      color: "var(--brand-chart-2)",
      tint:
        "border-emerald-500/25 bg-emerald-500/8 text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/12 dark:text-emerald-200",
    },
    {
      key: "carts",
      label: "Carrito",
      value: carts,
      previousValue: clicks,
      color: "var(--brand-chart-3)",
      tint:
        "border-violet-500/25 bg-violet-500/8 text-violet-700 dark:border-violet-400/35 dark:bg-violet-500/12 dark:text-violet-200",
    },
    {
      key: "intents",
      label: "Interés de compra",
      value: intents,
      previousValue: carts,
      color: "var(--brand-chart-4)",
      tint:
        "border-amber-500/30 bg-amber-500/8 text-amber-700 dark:border-amber-400/35 dark:bg-amber-500/12 dark:text-amber-200",
    },
    {
      key: "paid",
      label: "Compra efectiva",
      value: paidCount,
      previousValue: intents,
      color: "var(--brand-accent)",
      tint:
        "border-brand-accent/30 bg-brand-accent/12 text-brand-accent dark:border-brand-accent-soft/40 dark:bg-brand-accent-soft/15 dark:text-brand-accent-soft",
      suffix: formatCompactCopCurrency(paidAmount),
    },
  ];

  const baseValue = Math.max(views, 1);
  const globalRatio =
    intents > 0 ? Math.round((paidCount / intents) * 100) : 0;
  const hasAnyData = views + clicks + carts + intents + paidCount > 0;

  return (
    <article className="rounded-2xl border border-brand-separator/80 bg-brand-surface/90 p-4 shadow-[0_4px_14px_-6px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur sm:p-6 dark:border-brand-separator dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_18px_-4px_rgba(0,0,0,0.55)]">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-brand-primary">
            Embudo de conversión
          </h3>
          <p className="mt-1 text-xs text-brand-tertiary">
            Cómo avanzan los usuarios desde la visita hasta el pago.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-brand-separator bg-brand-hover px-2.5 py-1 text-[10px] font-medium text-brand-tertiary">
          30 días
        </span>
      </header>

      {!hasAnyData ? (
        <EmptyFunnelState />
      ) : (
        <ol className="space-y-2.5">
          {rows.map((row, idx) => (
            <FunnelRow
              key={row.key}
              row={row}
              baseValue={baseValue}
              isFirst={idx === 0}
            />
          ))}
        </ol>
      )}

      {hasAnyData ? (
        <footer className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-brand-separator bg-brand-hover px-4 py-3 text-sm">
          <p className="text-brand-tertiary">
            Conversión global{" "}
            <span className="font-semibold text-brand-primary">
              intención → compra
            </span>
            :
          </p>
          <p className="font-semibold tabular-nums text-brand-accent dark:text-brand-accent-soft">
            {globalRatio}%
          </p>
          <p className="text-xs text-brand-tertiary">
            ({formatCompactNumber(paidCount)} pagos ·{" "}
            {formatCompactCopCurrency(paidAmount)})
          </p>
        </footer>
      ) : null}
    </article>
  );
}

function FunnelRow({
  row,
  baseValue,
  isFirst,
}: {
  row: Row;
  baseValue: number;
  isFirst: boolean;
}) {
  const ratioToPrevious =
    row.previousValue > 0 ? Math.round((row.value / row.previousValue) * 100) : 0;
  const widthPct = Math.max(
    6,
    Math.min(100, Math.round((row.value / baseValue) * 100)),
  );

  return (
    <li className="flex items-center gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${row.tint}`}
        aria-hidden
      >
        <ChevronIcon />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="text-xs font-medium text-brand-secondary">{row.label}</p>
          <div className="flex items-baseline gap-2">
            <p className="font-(family-name:--font-rajdhani) text-xl font-bold tabular-nums leading-none tracking-tight text-brand-primary">
              {formatCompactNumber(row.value)}
            </p>
            {row.suffix ? (
              <p className="text-xs tabular-nums text-brand-tertiary">
                · {row.suffix}
              </p>
            ) : null}
          </div>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-brand-hover">
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{
              width: `${widthPct}%`,
              background: row.color,
            }}
          />
        </div>
        <p className="mt-1 text-[10px] tabular-nums text-brand-tertiary">
          {isFirst
            ? "Total de entradas al embudo"
            : `${ratioToPrevious}% del paso anterior`}
        </p>
      </div>
    </li>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.25}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

function EmptyFunnelState() {
  return (
    <div className="rounded-xl border border-dashed border-brand-input-border bg-brand-hover/40 px-4 py-8 text-center">
      <p className="text-sm font-medium text-brand-secondary">
        Sin eventos aún
      </p>
      <p className="mt-1 text-xs text-brand-tertiary">
        Cuando los clientes interactúen con tu catálogo aparecerá aquí el
        camino desde la visita hasta el pago.
      </p>
    </div>
  );
}
