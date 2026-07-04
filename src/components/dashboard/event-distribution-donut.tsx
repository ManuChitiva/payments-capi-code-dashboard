"use client";

import { formatCompactNumber } from "@/lib/dashboard/format";

/**
 * Distribución de eventos por tipo (donut SVG + leyenda).
 * Mismo dato que el {@link MetricGrid} del bloque de actividad, pero en
 * forma circular para comparar visualmente el share de cada etapa.
 */
export type EventDistributionDonutProps = {
  views: number;
  clicks: number;
  carts: number;
  intents: number;
  totalEvents: number;
};

type Slice = {
  key: string;
  label: string;
  value: number;
  /** % sobre el total (0–100). */
  pct: number;
  color: string;
};

export function EventDistributionDonut({
  views,
  clicks,
  carts,
  intents,
  totalEvents,
}: EventDistributionDonutProps) {
  const slices: Slice[] = [
    {
      key: "views",
      label: "Visualizaciones",
      value: views,
      pct: totalEvents > 0 ? (views / totalEvents) * 100 : 0,
      color: "var(--brand-chart-1)",
    },
    {
      key: "clicks",
      label: "Clics",
      value: clicks,
      pct: totalEvents > 0 ? (clicks / totalEvents) * 100 : 0,
      color: "var(--brand-chart-2)",
    },
    {
      key: "carts",
      label: "Carrito",
      value: carts,
      pct: totalEvents > 0 ? (carts / totalEvents) * 100 : 0,
      color: "var(--brand-chart-3)",
    },
    {
      key: "intents",
      label: "Interés de compra",
      value: intents,
      pct: totalEvents > 0 ? (intents / totalEvents) * 100 : 0,
      color: "var(--brand-chart-4)",
    },
  ];

  return (
    <article className="rounded-2xl border border-brand-separator/80 bg-brand-surface/90 p-4 shadow-[0_4px_14px_-6px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur sm:p-6 dark:border-brand-separator dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_18px_-4px_rgba(0,0,0,0.55)]">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-brand-primary">
            Distribución por tipo de evento
          </h3>
          <p className="mt-1 text-xs text-brand-tertiary">
            Share de cada interacción sobre el total registrado.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-brand-separator bg-brand-hover px-2.5 py-1 text-[10px] font-medium text-brand-tertiary">
          30 días
        </span>
      </header>

      {totalEvents === 0 ? (
        <EmptyDonutState />
      ) : (
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
          <DonutSvg slices={slices} totalEvents={totalEvents} />
          <ul className="flex-1 space-y-2 self-stretch">
            {slices.map((slice) => (
              <LegendRow key={slice.key} slice={slice} />
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function DonutSvg({
  slices,
  totalEvents,
}: {
  slices: Slice[];
  totalEvents: number;
}) {
  const cx = 60;
  const cy = 60;
  const radiusOuter = 50;
  const radiusInner = 32;

  let cursor = -90; // arrancamos arriba (12 o'clock)
  const segments = slices.map((slice) => {
    // Si es 0%, no dibujamos segmento pero avanzamos nada (no se renderiza).
    if (slice.value <= 0 || totalEvents <= 0) return null;
    const angle = (slice.value / totalEvents) * 360;
    const startAngle = cursor;
    const endAngle = cursor + angle;
    cursor = endAngle;
    const largeArc = angle > 180 ? 1 : 0;
    const startRad = (Math.PI / 180) * startAngle;
    const endRad = (Math.PI / 180) * endAngle;

    const outerStart = {
      x: cx + radiusOuter * Math.cos(startRad),
      y: cy + radiusOuter * Math.sin(startRad),
    };
    const outerEnd = {
      x: cx + radiusOuter * Math.cos(endRad),
      y: cy + radiusOuter * Math.sin(endRad),
    };
    const innerStart = {
      x: cx + radiusInner * Math.cos(endRad),
      y: cy + radiusInner * Math.sin(endRad),
    };
    const innerEnd = {
      x: cx + radiusInner * Math.cos(startRad),
      y: cy + radiusInner * Math.sin(startRad),
    };

    const d = [
      `M ${outerStart.x.toFixed(3)} ${outerStart.y.toFixed(3)}`,
      `A ${radiusOuter} ${radiusOuter} 0 ${largeArc} 1 ${outerEnd.x.toFixed(3)} ${outerEnd.y.toFixed(3)}`,
      `L ${innerStart.x.toFixed(3)} ${innerStart.y.toFixed(3)}`,
      `A ${radiusInner} ${radiusInner} 0 ${largeArc} 0 ${innerEnd.x.toFixed(3)} ${innerEnd.y.toFixed(3)}`,
      "Z",
    ].join(" ");

    return (
      <path
        key={slice.key}
        d={d}
        fill={slice.color}
        stroke="var(--brand-surface, white)"
        strokeWidth={1.5}
      >
        <title>
          {slice.label}: {formatCompactNumber(slice.value)} ({slice.pct.toFixed(1)}%)
        </title>
      </path>
    );
  });

  return (
    <div className="relative shrink-0">
      <svg
        viewBox="0 0 120 120"
        className="h-40 w-40 sm:h-44 sm:w-44"
        role="img"
        aria-label="Donut de distribución por tipo de evento"
      >
        {totalEvents > 0 ? (
          segments
        ) : (
          <circle
            cx={cx}
            cy={cy}
            r={radiusOuter}
            fill="var(--brand-hover, rgba(0,0,0,0.05))"
          />
        )}
        {/* Centro con el total */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          className="fill-brand-primary font-semibold"
          fontSize="16"
          fontFamily="var(--font-rajdhani)"
        >
          {formatCompactNumber(totalEvents)}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          className="fill-brand-tertiary"
          fontSize="8"
        >
          eventos
        </text>
      </svg>
    </div>
  );
}

function LegendRow({ slice }: { slice: Slice }) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-brand-separator/60 bg-brand-hover/30 px-3 py-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ background: slice.color }}
        />
        <span className="truncate text-xs text-brand-secondary">
          {slice.label}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-(family-name:--font-rajdhani) text-sm font-semibold tabular-nums text-brand-primary">
          {formatCompactNumber(slice.value)}
        </span>
        <span className="w-10 text-right text-[10px] tabular-nums text-brand-tertiary">
          {slice.pct.toFixed(0)}%
        </span>
      </div>
    </li>
  );
}

function EmptyDonutState() {
  return (
    <div className="rounded-xl border border-dashed border-brand-input-border bg-brand-hover/40 px-4 py-8 text-center">
      <p className="text-sm font-medium text-brand-secondary">
        Sin eventos aún
      </p>
      <p className="mt-1 text-xs text-brand-tertiary">
        Cuando se registren interacciones verás el share de cada tipo.
      </p>
    </div>
  );
}
