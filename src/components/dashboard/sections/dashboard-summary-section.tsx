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
      <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <DashboardStatCard
          title="Productos"
          value={formatCompactNumber(productCount)}
          fullValue={String(productCount)}
          tone="cyan"
          icon="$"
        />
        <DashboardStatCard
          title="Interacciones totales"
          value={formatCompactNumber(analytics?.totalEvents ?? 0)}
          fullValue={String(analytics?.totalEvents ?? 0)}
          tone="emerald"
          icon="◉"
        />
        <DashboardStatCard
          title="Visualizaciones"
          value={formatCompactNumber(analytics?.productViews ?? 0)}
          fullValue={String(analytics?.productViews ?? 0)}
          tone="violet"
          icon="▣"
        />
        <DashboardStatCard
          title="Interes de compra"
          value={formatCompactNumber(analytics?.purchaseIntents ?? 0)}
          fullValue={String(analytics?.purchaseIntents ?? 0)}
          tone="amber"
          icon="◎"
        />
        <DashboardStatCard
          title="Ganancias pagadas"
          value={formatCompactCopCurrency(revenueSummary?.totalPaidAmount ?? 0)}
          fullValue={formatCopCurrency(revenueSummary?.totalPaidAmount ?? 0)}
          tone="emerald"
          icon="💰"
        />
      </section>

      <section className="mb-6 grid gap-4 xl:grid-cols-3">
        <article className="min-w-0 rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur xl:col-span-2">
          <h3 className="text-sm text-slate-400">Actividad de clientes por dia</h3>
          <p className="mt-1 text-2xl font-semibold">
            {analytics?.totalEvents ?? 0}
          </p>
          <p className="mt-2 text-sm text-emerald-300">
            Mide como los clientes interactuan con tus productos.
          </p>
          <div className="mt-3 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              Visualizaciones: {analytics?.productViews ?? 0}
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              Clics en producto: {analytics?.productClicks ?? 0}
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              Agregados al carrito: {analytics?.addToCart ?? 0}
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              Interes de compra: {analytics?.purchaseIntents ?? 0}
            </div>
          </div>
          <div className="mt-5 min-w-0 rounded-2xl border border-white/10 bg-[#081225]/70 p-3 sm:p-4">
            <AnalyticsLineChart
              series={buildDailySeries(analytics?.dailyMetrics ?? [])}
            />
          </div>
        </article>
        <article className="rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur">
          <h3 className="text-sm text-slate-400">Productos con mayor interes</h3>
          <p className="mt-1 text-xs text-slate-500">
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
                    className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5"
                  >
                    <span
                      className="min-w-0 flex-1 font-medium leading-snug text-slate-200"
                      title={label}
                    >
                      {label}
                    </span>
                    <span className="shrink-0 tabular-nums font-semibold text-emerald-200">
                      {item.count}
                    </span>
                  </li>
                );
              })}
              {topInterestItems.length === 0 && !topInterestLoading ? (
                <li className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-slate-500">
                  Sin eventos registrados aun.
                </li>
              ) : null}
            </ul>
            {topInterestLoading && topInterestItems.length > 0 ? (
              <p className="py-3 text-center text-xs text-slate-400">
                Cargando mas...
              </p>
            ) : null}
            {topInterestLast &&
            topInterestItems.length > 0 &&
            !topInterestLoading ? (
              <p className="pb-2 pt-1 text-center text-[11px] text-slate-500">
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
