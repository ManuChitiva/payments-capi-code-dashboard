"use client";

import type { RefObject } from "react";
import { AnalyticsLineChart } from "@/components/dashboard/analytics-stat-card";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { buildDailySeries } from "@/lib/dashboard/analytics-api";
import {
  formatCompactCopCurrency,
  formatCompactNumber,
  formatCopCurrency,
} from "@/lib/dashboard/format";
import { TopProductsInterestPanel } from "@/components/dashboard/top-products-interest-panel";
import {
  brandChartArea,
  brandDashboardPanel,
  brandMetricHint,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
} from "@/lib/brand-theme";
import type {
  AnalyticsDashboard,
  TopProductInterest,
} from "@/types/dashboard";
import type { PaymentRevenueSummary } from "@/services/storePaymentsService";

export type DashboardSummarySectionProps = {
  title: string;
  description: string;
  productCount: number;
  analytics: AnalyticsDashboard | null;
  revenueSummary: PaymentRevenueSummary | null;
  topInterestItems: TopProductInterest[];
  topInterestLoading: boolean;
  topInterestLast: boolean;
  topInterestTotal: number;
  onLoadMoreTopInterest: () => void;
  topInterestScrollRef: RefObject<HTMLDivElement | null>;
  topInterestSentinelRef: RefObject<HTMLDivElement | null>;
};

export function DashboardSummarySection({
  title,
  description,
  productCount,
  analytics,
  revenueSummary,
  topInterestItems,
  topInterestLoading,
  topInterestLast,
  topInterestTotal,
  onLoadMoreTopInterest,
  topInterestScrollRef,
  topInterestSentinelRef,
}: DashboardSummarySectionProps) {
  const totalEvents = analytics?.totalEvents ?? 0;
  const dailySeries = buildDailySeries(analytics?.dailyMetrics ?? []);
  const daysWithData = dailySeries.filter(
    (d) =>
      d.PRODUCT_VIEW > 0 ||
      d.PRODUCT_CLICK > 0 ||
      d.ADD_TO_CART > 0 ||
      d.PURCHASE_INTENT > 0,
  ).length;
  const dailyAvg =
    daysWithData > 0 ? Math.round(totalEvents / daysWithData) : 0;
  const daysSpan = dailySeries.length;

  return (
    <>
      <SectionHeader title={title} description={description} />
      <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <DashboardStatCard
          title="Productos"
          value={formatCompactNumber(productCount)}
          fullValue={String(productCount)}
          tone="blue"
          icon="products"
        />
        <DashboardStatCard
          title="Interacciones totales"
          value={formatCompactNumber(analytics?.totalEvents ?? 0)}
          fullValue={String(analytics?.totalEvents ?? 0)}
          tone="blue"
          icon="interactions"
        />
        <DashboardStatCard
          title="Visualizaciones"
          value={formatCompactNumber(analytics?.productViews ?? 0)}
          fullValue={String(analytics?.productViews ?? 0)}
          tone="blue"
          icon="views"
        />
        <DashboardStatCard
          title="Interes de compra"
          value={formatCompactNumber(analytics?.purchaseIntents ?? 0)}
          fullValue={String(analytics?.purchaseIntents ?? 0)}
          tone="blue"
          icon="purchase-intent"
        />
        <DashboardStatCard
          title="Ganancias pagadas"
          value={formatCompactCopCurrency(revenueSummary?.totalPaidAmount ?? 0)}
          fullValue={formatCopCurrency(revenueSummary?.totalPaidAmount ?? 0)}
          tone="blue"
          icon="revenue"
        />
      </section>

      <section className="mb-6 grid gap-4 xl:grid-cols-3">
        <article
          className={`min-w-0 p-5 sm:p-6 xl:col-span-2 ${brandDashboardPanel}`}
        >
          <ActivityHeader
            totalEvents={totalEvents}
            dailyAvg={dailyAvg}
            daysSpan={daysSpan}
          />
          <MetricGrid
            views={analytics?.productViews ?? 0}
            clicks={analytics?.productClicks ?? 0}
            carts={analytics?.addToCart ?? 0}
            intents={analytics?.purchaseIntents ?? 0}
            total={totalEvents}
          />
          <div className={brandChartArea}>
            <AnalyticsLineChart series={dailySeries} />
          </div>
        </article>
        <article
          className={`flex min-h-0 flex-col p-5 sm:p-6 ${brandDashboardPanel}`}
        >
          <TopProductsInterestPanel
            items={topInterestItems}
            loading={topInterestLoading}
            last={topInterestLast}
            totalElements={topInterestTotal}
            onLoadMore={onLoadMoreTopInterest}
            scrollRef={topInterestScrollRef}
            sentinelRef={topInterestSentinelRef}
          />
        </article>
      </section>
    </>
  );
}

function ActivityHeader({
  totalEvents,
  dailyAvg,
  daysSpan,
}: {
  totalEvents: number;
  dailyAvg: number;
  daysSpan: number;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-accent/25 bg-brand-accent/10 text-brand-accent shadow-[0_2px_8px_-2px_rgba(0,113,227,0.3)] dark:border-brand-accent-soft/35 dark:bg-brand-accent-soft/12 dark:text-brand-accent-soft dark:shadow-[0_2px_10px_-2px_rgba(41,151,255,0.5),0_0_0_1px_rgba(41,151,255,0.2)]"
          aria-hidden
        >
          <ActivityIcon />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`text-sm font-medium ${brandTextPrimary}`}>
              Actividad de clientes
            </h3>
            <span
              className={`inline-flex items-center gap-1 rounded-full border border-brand-separator bg-brand-hover px-2 py-0.5 text-[10px] font-medium ${brandTextTertiary}`}
            >
              <CalendarIcon className="h-3 w-3" />
              Últimos {daysSpan || 30} días
            </span>
          </div>
          <p className={`mt-1 ${brandMetricHint}`}>
            Cómo interactúan los clientes con tu catálogo.
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-(family-name:--font-rajdhani) text-3xl font-bold leading-none tracking-tight ${brandTextPrimary}`}
        >
          {formatCompactNumber(totalEvents)}
        </p>
        <p className={`mt-1 text-[11px] ${brandTextTertiary}`}>
          eventos ·{" "}
          <span className={`font-semibold ${brandTextSecondary}`}>
            {formatCompactNumber(dailyAvg)}
          </span>{" "}
          / día
        </p>
      </div>
    </div>
  );
}

function MetricGrid({
  views,
  clicks,
  carts,
  intents,
  total,
}: {
  views: number;
  clicks: number;
  carts: number;
  intents: number;
  total: number;
}) {
  const pct = (n: number) =>
    total > 0 ? Math.max(0, Math.round((n / total) * 100)) : 0;

  const items = [
    {
      key: "views",
      label: "Visualizaciones",
      value: views,
      pct: pct(views),
      color: "var(--brand-chart-1)",
      tintClass:
        "border-brand-accent/25 bg-brand-accent/8 text-brand-accent dark:border-brand-accent-soft/35 dark:bg-brand-accent-soft/12 dark:text-brand-accent-soft",
      icon: <EyeIcon />,
    },
    {
      key: "clicks",
      label: "Clics en producto",
      value: clicks,
      pct: pct(clicks),
      color: "var(--brand-chart-2)",
      tintClass:
        "border-emerald-500/25 bg-emerald-500/8 text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/12 dark:text-emerald-200",
      icon: <CursorIcon />,
    },
    {
      key: "carts",
      label: "Agregados al carrito",
      value: carts,
      pct: pct(carts),
      color: "var(--brand-chart-3)",
      tintClass:
        "border-violet-500/25 bg-violet-500/8 text-violet-700 dark:border-violet-400/35 dark:bg-violet-500/12 dark:text-violet-200",
      icon: <CartIcon />,
    },
    {
      key: "intents",
      label: "Interés de compra",
      value: intents,
      pct: pct(intents),
      color: "var(--brand-chart-4)",
      tintClass:
        "border-amber-500/30 bg-amber-500/8 text-amber-700 dark:border-amber-400/35 dark:bg-amber-500/12 dark:text-amber-200",
      icon: <SparkIcon />,
    },
  ];

  return (
    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.key}
          className={`group relative overflow-hidden rounded-xl border ${item.tintClass} px-3 py-3 transition-shadow hover:shadow-[0_6px_18px_-8px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_8px_22px_-6px_rgba(0,0,0,0.6)]`}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/60 backdrop-blur-sm dark:bg-black/20">
              {item.icon}
            </span>
            <p className="text-[11px] font-medium opacity-80">{item.label}</p>
          </div>
          <p className="mt-2 text-xl font-semibold tabular-nums leading-none tracking-tight">
            {formatCompactNumber(item.value)}
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-current/15">
              <div
                className="h-full rounded-full bg-current transition-[width] duration-500 ease-out"
                style={{ width: `${item.pct}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold tabular-nums opacity-80">
              {item.pct}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
      />
    </svg>
  );
}

function CalendarIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

function CursorIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.042 21.671 16.724 13.328a1.125 1.125 0 1 0-2.197-.573l-1.682 8.343M15.042 21.671a1.125 1.125 0 0 1-1.694-.418L9.563 13.314a1.125 1.125 0 0 1 .342-1.39l1.638-1.169a1.125 1.125 0 0 1 1.196-.043l5.286 3.16m-11.483 1.65 1.638 4.85"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
      />
    </svg>
  );
}