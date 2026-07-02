"use client";

import { useMemo, useRef, useState } from "react";
import { brandChipOff, brandChipOn, brandTextTertiary } from "@/lib/brand-theme";

type SeriesKey = "PRODUCT_VIEW" | "PRODUCT_CLICK" | "ADD_TO_CART" | "PURCHASE_INTENT";

type SeriesPoint = {
  label: string;
  PRODUCT_VIEW: number;
  PRODUCT_CLICK: number;
  ADD_TO_CART: number;
  PURCHASE_INTENT: number;
};

export function AnalyticsLineChart({
  series,
}: {
  series: SeriesPoint[];
}) {
  const [enabledTypes, setEnabledTypes] = useState<Record<SeriesKey, boolean>>({
    PRODUCT_VIEW: true,
    PRODUCT_CLICK: true,
    ADD_TO_CART: true,
    PURCHASE_INTENT: true,
  });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 760;
  const height = 220;
  const paddingX = 44;
  const paddingTop = 24;
  const paddingBottom = 36;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  const typeMeta: Array<{
    key: SeriesKey;
    label: string;
    color: string;
    glow: string;
    fillStart: string;
  }> = [
    {
      key: "PRODUCT_VIEW",
      label: "Visualizaciones",
      color: "var(--brand-chart-1)",
      glow: "rgba(0, 113, 227, 0.18)",
      fillStart: "rgba(0, 113, 227, 0.28)",
    },
    {
      key: "PRODUCT_CLICK",
      label: "Clics",
      color: "var(--brand-chart-2)",
      glow: "rgba(52, 211, 153, 0.18)",
      fillStart: "rgba(52, 211, 153, 0.22)",
    },
    {
      key: "ADD_TO_CART",
      label: "Carrito",
      color: "var(--brand-chart-3)",
      glow: "rgba(167, 139, 250, 0.18)",
      fillStart: "rgba(167, 139, 250, 0.22)",
    },
    {
      key: "PURCHASE_INTENT",
      label: "Interés",
      color: "var(--brand-chart-4)",
      glow: "rgba(251, 191, 36, 0.22)",
      fillStart: "rgba(251, 191, 36, 0.3)",
    },
  ];

  const visibleTypes = typeMeta.filter((type) => enabledTypes[type.key]);

  if (!series.length) {
    return (
      <div
        className={`flex min-h-40 items-center justify-center px-1 text-center text-sm sm:min-h-[220px] ${brandTextTertiary}`}
      >
        Sin datos de actividad en el periodo.
      </div>
    );
  }

  const maxCount = Math.max(
    ...series.flatMap((d) => visibleTypes.map((type) => d[type.key])),
    1,
  );
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    value: Math.round(maxCount * ratio),
    y: paddingTop + chartHeight - ratio * chartHeight,
  }));

  const xForIndex = (index: number) => {
    if (series.length === 1) return paddingX + chartWidth / 2;
    return paddingX + (index / (series.length - 1)) * chartWidth;
  };

  const buildPoints = (key: SeriesKey) =>
    series.map((entry, index) => ({
      ...entry,
      x: xForIndex(index),
      y: paddingTop + chartHeight - (entry[key] / maxCount) * chartHeight,
      value: entry[key],
    }));

  const buildPath = (key: SeriesKey) => {
    const points = buildPoints(key);
    return points
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`,
      )
      .join(" ");
  };

  const buildAreaPath = (key: SeriesKey) => {
    const points = buildPoints(key);
    const baseline = paddingTop + chartHeight;
    let d = "";
    points.forEach((point, i) => {
      d += `${i === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)} `;
    });
    d += `L ${points[points.length - 1].x.toFixed(2)} ${baseline} `;
    d += `L ${points[0].x.toFixed(2)} ${baseline} Z`;
    return d;
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = width / rect.width;
    const xInSvg = (e.clientX - rect.left) * scale;
    const ratio = Math.max(
      0,
      Math.min(1, (xInSvg - paddingX) / chartWidth),
    );
    const index = Math.round(ratio * (series.length - 1));
    setHoverIndex(index);
  };

  const handlePointerLeave = () => setHoverIndex(null);

  const hoveredEntry =
    hoverIndex != null ? series[Math.max(0, Math.min(series.length - 1, hoverIndex))] : null;
  const hoveredX = hoverIndex != null ? xForIndex(hoverIndex) : 0;

  const formatShortDate = (label: string) => {
    const d = new Date(label);
    if (Number.isNaN(d.getTime())) return label;
    return d.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
    });
  };

  const formatWeekday = (label: string) => {
    const d = new Date(label);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("es-CO", { weekday: "short" }).replace(".", "");
  };

  const labelStride = Math.max(1, Math.ceil(series.length / 7));

  // Tooltip positioning: keep inside chart bounds
  const tooltipWidth = 168;
  const tooltipX = useMemo(() => {
    if (hoverIndex == null) return 0;
    const x = xForIndex(hoverIndex);
    const half = tooltipWidth / 2;
    return Math.max(paddingX + 4, Math.min(width - paddingX - 4 - tooltipWidth, x - half));
  }, [hoverIndex, series.length]);

  return (
    <div className="w-full min-w-0 space-y-3">
      <div className="flex flex-wrap gap-2 text-[11px]">
        {typeMeta.map((type) => (
          <button
            key={type.key}
            type="button"
            onClick={() =>
              setEnabledTypes((prev) => ({
                ...prev,
                [type.key]: !prev[type.key],
              }))
            }
            className={enabledTypes[type.key] ? brandChipOn : brandChipOff}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: type.color,
                boxShadow: enabledTypes[type.key]
                  ? `0 0 6px ${type.glow}`
                  : "none",
              }}
            />
            {type.label}
          </button>
        ))}
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="block aspect-760/220 h-auto w-full max-w-full touch-none"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <defs>
          {typeMeta.map((type) => (
            <linearGradient
              key={`grad-${type.key}`}
              id={`grad-fill-${type.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={type.color} stopOpacity="0.32" />
              <stop offset="100%" stopColor={type.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {yTicks.map((tick, index) => (
          <g key={`y-tick-${index}`}>
            <line
              x1={paddingX}
              x2={width - paddingX}
              y1={tick.y}
              y2={tick.y}
              stroke="var(--brand-chart-grid)"
              strokeWidth="1"
              strokeDasharray={index === 0 ? undefined : "2 4"}
            />
            <text
              x={paddingX - 10}
              y={tick.y + 3}
              textAnchor="end"
              fontSize="10"
              fill="var(--brand-chart-axis)"
            >
              {tick.value}
            </text>
          </g>
        ))}

        {visibleTypes.map((type) => (
          <g key={`area-${type.key}`} style={{ opacity: 0.85 }}>
            <path
              d={buildAreaPath(type.key)}
              fill={`url(#grad-fill-${type.key})`}
            />
          </g>
        ))}

        {visibleTypes.map((type) => (
          <g key={`line-${type.key}`}>
            <path
              d={buildPath(type.key)}
              fill="none"
              stroke={type.color}
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.95"
            />
          </g>
        ))}

        {visibleTypes.map((type) =>
          buildPoints(type.key).map((point) => (
            <circle
              key={`${type.key}-${point.label}`}
              cx={point.x}
              cy={point.y}
              r="2.5"
              fill={type.color}
            >
              <title>{`${type.label} - ${formatShortDate(point.label)}: ${point.value}`}</title>
            </circle>
          )),
        )}

        {!visibleTypes.length ? (
          <text
            x={width / 2}
            y={height / 2}
            textAnchor="middle"
            fontSize="12"
            fill="rgb(148 163 184)"
          >
            Activa al menos un tipo de evento para visualizar la grafica.
          </text>
        ) : null}

        {/* Hover crosshair + highlight dots */}
        {hoverIndex != null && visibleTypes.length > 0 ? (
          <g pointerEvents="none">
            <line
              x1={hoveredX}
              x2={hoveredX}
              y1={paddingTop}
              y2={paddingTop + chartHeight}
              stroke="var(--brand-chart-axis)"
              strokeOpacity="0.45"
              strokeDasharray="3 3"
              strokeWidth="1"
            />
            {visibleTypes.map((type) => {
              const point = buildPoints(type.key)[hoverIndex];
              return (
                <g key={`hover-${type.key}`}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="8"
                    fill={type.color}
                    opacity="0.18"
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="var(--brand-bg)"
                    stroke={type.color}
                    strokeWidth="2.25"
                  />
                </g>
              );
            })}
          </g>
        ) : null}

        {/* X-axis labels */}
        {series.map((entry, index) => {
          const showLabel = index % labelStride === 0 || index === series.length - 1;
          if (!showLabel) return null;
          return (
            <g key={`x-${entry.label}-${index}`}>
              <text
                x={xForIndex(index)}
                y={height - 18}
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="500"
                fill="var(--brand-chart-axis)"
                opacity="0.7"
              >
                {formatWeekday(entry.label)}
              </text>
              <text
                x={xForIndex(index)}
                y={height - 6}
                textAnchor="middle"
                fontSize="9"
                fill="var(--brand-chart-axis)"
                opacity="0.5"
              >
                {formatShortDate(entry.label)}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {hoveredEntry && visibleTypes.length > 0 ? (
          <g pointerEvents="none">
            <foreignObject
              x={tooltipX}
              y={paddingTop - 4}
              width={tooltipWidth}
              height={120}
            >
              <div className="rounded-lg border border-brand-separator/70 bg-brand-surface/95 px-3 py-2 text-[10px] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.25)] backdrop-blur-xl dark:border-brand-separator dark:bg-[#1c1c1e]/95 dark:shadow-[0_12px_32px_-10px_rgba(0,0,0,0.6)]">
                <p className="text-[10px] font-semibold text-brand-secondary uppercase tracking-wide">
                  {formatShortDate(hoveredEntry.label)}
                </p>
                <div className="mt-1.5 space-y-1">
                  {visibleTypes.map((type) => (
                    <div
                      key={`tt-${type.key}`}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className="inline-block h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: type.color }}
                        />
                        <span className="text-brand-secondary">{type.label}</span>
                      </span>
                      <span className="font-semibold tabular-nums text-brand-primary">
                        {hoveredEntry[type.key]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </foreignObject>
          </g>
        ) : null}
      </svg>
    </div>
  );
}