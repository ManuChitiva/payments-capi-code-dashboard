"use client";

import { useState } from "react";
import { brandChipOff, brandChipOn, brandTextTertiary } from "@/lib/brand-theme";

export function AnalyticsLineChart({
  series,
}: {
  series: Array<{
    label: string;
    PRODUCT_VIEW: number;
    PRODUCT_CLICK: number;
    ADD_TO_CART: number;
    PURCHASE_INTENT: number;
  }>;
}) {
  const [enabledTypes, setEnabledTypes] = useState<{
    PRODUCT_VIEW: boolean;
    PRODUCT_CLICK: boolean;
    ADD_TO_CART: boolean;
    PURCHASE_INTENT: boolean;
  }>({
    PRODUCT_VIEW: true,
    PRODUCT_CLICK: true,
    ADD_TO_CART: true,
    PURCHASE_INTENT: true,
  });

  const width = 760;
  const height = 210;
  const paddingX = 42;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  if (!series.length) {
    return (
      <div
        className={`flex min-h-40 items-center justify-center px-1 text-center text-sm sm:min-h-[210px] ${brandTextTertiary}`}
      >
        Sin datos de actividad en el periodo.
      </div>
    );
  }

  const typeMeta: Array<{
    key: "PRODUCT_VIEW" | "PRODUCT_CLICK" | "ADD_TO_CART" | "PURCHASE_INTENT";
    label: string;
    color: string;
  }> = [
    { key: "PRODUCT_VIEW", label: "Visualizaciones", color: "var(--brand-chart-1)" },
    { key: "PRODUCT_CLICK", label: "Clics", color: "var(--brand-chart-2)" },
    { key: "ADD_TO_CART", label: "Carrito", color: "var(--brand-chart-3)" },
    { key: "PURCHASE_INTENT", label: "Interes", color: "var(--brand-chart-4)" },
  ];

  const visibleTypes = typeMeta.filter((type) => enabledTypes[type.key]);

  const maxCount = Math.max(
    ...series.flatMap((d) => visibleTypes.map((type) => d[type.key])),
    1,
  );
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    value: Math.round(maxCount * ratio),
    y: paddingTop + chartHeight - ratio * chartHeight,
  }));

  const buildPoints = (key: (typeof typeMeta)[number]["key"]) =>
    series.map((entry, index) => {
      const x =
        series.length === 1
          ? paddingX + chartWidth / 2
          : paddingX + (index / (series.length - 1)) * chartWidth;
      const y =
        paddingTop + chartHeight - (entry[key] / maxCount) * chartHeight;
      return { ...entry, x, y, value: entry[key] };
    });

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
            className={
              enabledTypes[type.key] ? brandChipOn : brandChipOff
            }
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: type.color }}
            />
            {type.label}
          </button>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="block aspect-760/210 h-auto w-full max-w-full"
      >
        {yTicks.map((tick, index) => (
          <g key={`y-tick-${index}`}>
            <line
              x1={paddingX}
              x2={width - paddingX}
              y1={tick.y}
              y2={tick.y}
              stroke="var(--brand-chart-grid)"
              strokeWidth="1"
            />
            <text
              x={paddingX - 8}
              y={tick.y + 3}
              textAnchor="end"
              fontSize="10"
              fill="var(--brand-chart-axis)"
            >
              {tick.value}
            </text>
          </g>
        ))}
        <line
          x1={paddingX}
          x2={width - paddingX}
          y1={paddingTop + chartHeight}
          y2={paddingTop + chartHeight}
          stroke="var(--brand-chart-grid)"
          strokeWidth="1"
        />

        {visibleTypes.map((type) => {
          const points = buildPoints(type.key);
          const path = points
            .map(
              (point, index) =>
                `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
            )
            .join(" ");

          return (
            <g key={type.key}>
              <path
                d={path}
                fill="none"
                stroke={type.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.92"
              />
              {points.map((point) => (
                <circle
                  key={`${type.key}-${point.label}`}
                  cx={point.x}
                  cy={point.y}
                  r="2.5"
                  fill={type.color}
                >
                  <title>{`${type.label} - ${point.label}: ${point.value}`}</title>
                </circle>
              ))}
            </g>
          );
        })}

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

        {series.map((entry, index) => {
          const x =
            series.length === 1
              ? paddingX + chartWidth / 2
              : paddingX + (index / (series.length - 1)) * chartWidth;
          return (
            <text
              key={entry.label}
              x={x}
              y={height - 8}
              textAnchor="middle"
              fontSize="10"
              fill="var(--brand-chart-axis)"
            >
              {new Date(entry.label).toLocaleDateString("es-CO", {
                day: "numeric",
                month: "short",
              })}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

