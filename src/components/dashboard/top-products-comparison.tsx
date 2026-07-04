"use client";

import {
  formatCompactCopCurrency,
  formatCompactNumber,
} from "@/lib/dashboard/format";

/**
 * Comparativa "Más vendidos vs más vistos".
 * Une los rankings por {@code productId} y muestra, para cada producto,
 * una barra por cada métrica con un mismo eje horizontal (normalizado
 * al máximo del par). Las barras usan la misma paleta que el resto de
 * charts del dashboard ({@code brand-accent} para comprado, amber para
 * interés).
 */
export type TopProductsComparisonProps = {
  topSold: ReadonlyArray<{
    productId: number;
    productName: string | null;
    unitsSold: number;
    totalRevenue: number;
  }>;
  topInterest: ReadonlyArray<{
    productId: number;
    productName: string | null;
    count: number;
  }>;
};

type Row = {
  productId: number;
  productName: string;
  unitsSold: number;
  totalRevenue: number;
  count: number;
};

export function TopProductsComparison({
  topSold,
  topInterest,
}: TopProductsComparisonProps) {
  const rows = mergeRows(topSold, topInterest);
  const hasData = rows.some((r) => r.unitsSold > 0 || r.count > 0);

  return (
    <article className="rounded-2xl border border-brand-separator/80 bg-brand-surface/90 p-4 shadow-[0_4px_14px_-6px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur sm:p-6 dark:border-brand-separator dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_18px_-4px_rgba(0,0,0,0.55)]">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-brand-primary">
            Más vistos vs más comprados
          </h3>
          <p className="mt-1 text-xs text-brand-tertiary">
            Cuando un producto genera mucho interés pero se vende poco, hay
            algo en precio, descripción o checkout para revisar.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <Legend
            color="var(--brand-accent)"
            label="Comprado"
            dotClass="bg-brand-accent dark:bg-brand-accent-soft"
          />
          <Legend
            color="var(--brand-chart-4)"
            label="Interés"
            dotClass="bg-amber-500"
          />
        </div>
      </header>

      {!hasData ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {rows.slice(0, 10).map((row) => (
            <ComparisonRow key={row.productId} row={row} />
          ))}
        </ul>
      )}
    </article>
  );
}

function mergeRows(
  topSold: TopProductsComparisonProps["topSold"],
  topInterest: TopProductsComparisonProps["topInterest"],
): Row[] {
  const map = new Map<number, Row>();
  for (const sold of topSold) {
    map.set(sold.productId, {
      productId: sold.productId,
      productName: sold.productName || `Producto #${sold.productId}`,
      unitsSold: sold.unitsSold,
      totalRevenue: sold.totalRevenue,
      count: 0,
    });
  }
  for (const interest of topInterest) {
    const existing = map.get(interest.productId);
    if (existing) {
      existing.count = interest.count;
    } else {
      map.set(interest.productId, {
        productId: interest.productId,
        productName: interest.productName || `Producto #${interest.productId}`,
        unitsSold: 0,
        totalRevenue: 0,
        count: interest.count,
      });
    }
  }
  // Orden: por unidades vendidas desc, fallback por interés desc.
  return Array.from(map.values()).sort((a, b) => {
    if (b.unitsSold !== a.unitsSold) return b.unitsSold - a.unitsSold;
    return b.count - a.count;
  });
}

function ComparisonRow({ row }: { row: Row }) {
  const max = Math.max(row.unitsSold, row.count, 1);
  const soldPct = Math.max(0, Math.round((row.unitsSold / max) * 100));
  const countPct = Math.max(0, Math.round((row.count / max) * 100));
  const gap = row.unitsSold > 0 && row.count > 0 ? row.count - row.unitsSold : 0;
  const ratio =
    row.unitsSold > 0 && row.count > 0
      ? Math.round((row.unitsSold / row.count) * 100)
      : null;

  return (
    <li className="rounded-xl border border-brand-separator/60 bg-brand-hover/30 px-3.5 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="truncate text-sm font-medium text-brand-primary">
          {row.productName}
        </p>
        <div className="flex shrink-0 items-baseline gap-3 text-[11px] tabular-nums">
          <span className="text-brand-tertiary">
            {formatCompactCopCurrency(row.totalRevenue)}
          </span>
          {ratio != null ? (
            <span className="rounded-full bg-brand-accent/10 px-1.5 py-0.5 font-semibold text-brand-accent dark:bg-brand-accent-soft/15 dark:text-brand-accent-soft">
              {ratio}% conv
            </span>
          ) : null}
        </div>
      </div>
      <div className="mt-2 space-y-1.5">
        <BarRow
          label={`${formatCompactNumber(row.unitsSold)} uds`}
          pct={soldPct}
          color="var(--brand-accent)"
        />
        <BarRow
          label={`${formatCompactNumber(row.count)} interacciones`}
          pct={countPct}
          color="var(--brand-chart-4)"
        />
      </div>
      {row.unitsSold > 0 && row.count > 0 && gap > 0 ? (
        <p className="mt-2 text-[10px] text-brand-tertiary">
          {formatCompactNumber(gap)}{" "}
          {gap === 1 ? "interacción generó" : "interacciones generaron"} interés
          sin convertirse en venta.
        </p>
      ) : null}
    </li>
  );
}

function BarRow({
  label,
  pct,
  color,
}: {
  label: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand-hover">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${Math.max(2, pct)}%`, background: color }}
        />
      </div>
      <span className="w-24 shrink-0 text-right text-[10px] tabular-nums text-brand-tertiary">
        {label}
      </span>
    </div>
  );
}

function Legend({
  color,
  label,
  dotClass,
}: {
  color: string;
  label: string;
  dotClass: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-brand-tertiary">
      <span
        aria-hidden
        className={`h-2 w-2 rounded-full ${dotClass}`}
        style={{ background: color }}
      />
      {label}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-brand-input-border bg-brand-hover/40 px-4 py-10 text-center">
      <p className="text-sm font-medium text-brand-secondary">
        Sin datos en este periodo
      </p>
      <p className="mt-1 text-xs text-brand-tertiary">
        Cuando haya productos con interés y ventas, verás aquí la comparación.
      </p>
    </div>
  );
}
