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
  brandInsetBox,
  brandMetricHint,
  brandTextPrimary,
  brandTextSecondary,
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
        <article className={`min-w-0 p-5 xl:col-span-2 ${brandDashboardPanel}`}>
          <h3 className={`text-sm ${brandTextSecondary}`}>
            Actividad de clientes por dia
          </h3>
          <p className={`mt-1 text-2xl font-semibold ${brandTextPrimary}`}>
            {analytics?.totalEvents ?? 0}
          </p>
          <p className={brandMetricHint}>
            Mide como los clientes interactuan con tus productos.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className={brandInsetBox}>
              Visualizaciones: {analytics?.productViews ?? 0}
            </div>
            <div className={brandInsetBox}>
              Clics en producto: {analytics?.productClicks ?? 0}
            </div>
            <div className={brandInsetBox}>
              Agregados al carrito: {analytics?.addToCart ?? 0}
            </div>
            <div className={brandInsetBox}>
              Interes de compra: {analytics?.purchaseIntents ?? 0}
            </div>
          </div>
          <div className={brandChartArea}>
            <AnalyticsLineChart
              series={buildDailySeries(analytics?.dailyMetrics ?? [])}
            />
          </div>
        </article>
        <article className={`flex min-h-0 flex-col p-5 sm:p-6 ${brandDashboardPanel}`}>
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
