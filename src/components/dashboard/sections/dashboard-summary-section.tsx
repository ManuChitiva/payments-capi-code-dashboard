"use client";

import type { RefObject } from "react";
import { AnalyticsLineChart } from "@/components/dashboard/analytics-stat-card";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { SubscriptionPlanBanner } from "@/components/dashboard/subscription-plan-banner";
import { buildDailySeries } from "@/lib/dashboard/analytics-api";
import {
  formatCompactCopCurrency,
  formatCompactNumber,
  formatCopCurrency,
} from "@/lib/dashboard/format";
import {
  brandChartArea,
  brandCountAccent,
  brandDashboardPanel,
  brandInsetBox,
  brandListRow,
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
  topInterestScrollRef,
  topInterestSentinelRef,
}: DashboardSummarySectionProps) {
  return (
    <>
      <SectionHeader title={title} description={description} />
      <SubscriptionPlanBanner />
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
        <article className={`p-5 ${brandDashboardPanel}`}>
          <h3 className={`text-sm ${brandTextSecondary}`}>
            Productos con mayor interes
          </h3>
          <p className={`mt-1 text-xs ${brandTextTertiary}`}>
            Ordenados por cantidad total de interacciones (todas las trazas con
            producto).
          </p>
          <div
            ref={topInterestScrollRef}
            className="mt-4 max-h-[min(52vh,420px)] overflow-y-auto overscroll-contain pr-1"
          >
            <ul className="space-y-2 text-sm">
              {topInterestItems.map((item) => {
                const label =
                  item.productName?.trim() || `Producto #${item.productId}`;
                return (
                  <li
                    key={item.productId}
                    className={`flex items-start justify-between gap-3 ${brandListRow}`}
                  >
                    <span
                      className={`min-w-0 flex-1 font-medium leading-snug ${brandTextPrimary}`}
                      title={label}
                    >
                      {label}
                    </span>
                    <span className={brandCountAccent}>{item.count}</span>
                  </li>
                );
              })}
              {topInterestItems.length === 0 && !topInterestLoading ? (
                <li className={`px-3 py-3 ${brandListRow} ${brandTextTertiary}`}>
                  Sin eventos registrados aun.
                </li>
              ) : null}
            </ul>
            {topInterestLoading && topInterestItems.length > 0 ? (
              <p className={`py-3 text-center text-xs ${brandTextSecondary}`}>
                Cargando mas...
              </p>
            ) : null}
            {topInterestLast &&
            topInterestItems.length > 0 &&
            !topInterestLoading ? (
              <p className={`pt-1 pb-2 text-center text-[11px] ${brandTextTertiary}`}>
                Fin de la lista
              </p>
            ) : null}
            <div
              ref={topInterestSentinelRef}
              className="h-3 w-full shrink-0"
              aria-hidden
            />
          </div>
        </article>
      </section>
    </>
  );
}
