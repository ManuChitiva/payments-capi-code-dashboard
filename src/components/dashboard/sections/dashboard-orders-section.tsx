"use client";

import type { Dispatch, SetStateAction } from "react";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import {
  brandDashboardPanel,
  brandInputClass,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
  dashboardStatusBadge,
} from "@/lib/brand-theme";
import { formatCompactNumber, formatCopCurrency } from "@/lib/dashboard/format";
import {
  formatOrderStatus,
  orderStatusBadgeClass,
  paymentStatusBadgeClass,
} from "@/lib/dashboard/order-labels";
import type { PagedOrdersResponse } from "@/services/orderService";
import type {
  AdminPaymentListItem,
  PagedPaymentsResponse,
  PaymentRevenueSummary,
} from "@/services/storePaymentsService";

type SalesTab = "pedidos" | "pagos";

export type DashboardOrdersSectionProps = {
  title: string;
  description: string;
  activeTab: SalesTab;
  onTabChange: (tab: SalesTab) => void;
  revenueSummary: PaymentRevenueSummary | null;
  ordersData: PagedOrdersResponse | null;
  ordersLoading: boolean;
  ordersPage: number;
  setOrdersPage: Dispatch<SetStateAction<number>>;
  orderStatusDraft: string;
  setOrderStatusDraft: Dispatch<SetStateAction<string>>;
  setOrderStatusQuery: Dispatch<SetStateAction<string>>;
  setOrdersListTick: Dispatch<SetStateAction<number>>;
  paymentsData: PagedPaymentsResponse | null;
  paymentsLoading: boolean;
  paymentsPage: number;
  setPaymentsPage: Dispatch<SetStateAction<number>>;
  paymentStatusDraft: string;
  setPaymentStatusDraft: Dispatch<SetStateAction<string>>;
  setPaymentStatusQuery: Dispatch<SetStateAction<string>>;
  setPaymentsListTick: Dispatch<SetStateAction<number>>;
  onOpenOrder: (orderId: number) => void;
};

const ORDER_STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "PENDING", label: "Pendiente" },
  { value: "PAID", label: "Pagado" },
  { value: "FAILED", label: "Fallido" },
];

function PaginationBar({
  page,
  totalPages,
  totalElements,
  label,
  loading,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  totalElements: number;
  label: string;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-brand-separator pt-4 text-xs text-brand-secondary">
      <span>
        Página {page + 1} de {totalPages} ({totalElements} {label})
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 0 || loading}
          onClick={onPrev}
          className="rounded-lg border border-brand-separator bg-brand-hover px-3 py-1.5 text-sm hover:bg-brand-hover disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={page >= totalPages - 1 || loading}
          onClick={onNext}
          className="rounded-lg border border-brand-separator bg-brand-hover px-3 py-1.5 text-sm hover:bg-brand-hover disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

function PaymentsTable({ rows }: { rows: AdminPaymentListItem[] }) {
  return (
    <table className="min-w-full text-left text-sm">
      <thead className="sticky top-0 z-[1] border-b border-brand-separator bg-brand-surface/95 backdrop-blur-md">
        <tr className="text-brand-secondary">
          <th className="px-3 py-3 font-medium">ID pago</th>
          <th className="px-3 py-3 font-medium">Pedido</th>
          <th className="px-3 py-3 font-medium">Cliente</th>
          <th className="px-3 py-3 font-medium">Monto</th>
          <th className="px-3 py-3 font-medium">Estado</th>
          <th className="px-3 py-3 font-medium">Pasarela</th>
          <th className="px-3 py-3 font-medium">Transacción</th>
          <th className="px-3 py-3 font-medium">Fecha</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.id}
            className="border-b border-brand-separator hover:bg-brand-hover"
          >
            <td className="px-3 py-3 tabular-nums text-brand-secondary">
              #{row.id}
            </td>
            <td className="px-3 py-3 tabular-nums">#{row.orderId}</td>
            <td className="px-3 py-3 text-brand-secondary">
              <span className="block font-medium text-brand-primary">
                {row.customerName}
              </span>
              <span className="text-xs text-brand-tertiary">
                {row.customerEmail}
              </span>
            </td>
            <td className="px-3 py-3 tabular-nums">
              {formatCopCurrency(Number(row.amount))}
            </td>
            <td className="px-3 py-3">
              <span
                className={`rounded-full border px-2 py-0.5 text-xs font-medium uppercase ${paymentStatusBadgeClass(row.status)}`}
              >
                {row.status}
              </span>
            </td>
            <td className="px-3 py-3 text-xs text-brand-secondary">
              {row.gateway}
            </td>
            <td
              className="max-w-[140px] truncate px-3 py-3 font-mono text-xs text-brand-secondary"
              title={row.transactionId ?? ""}
            >
              {row.transactionId ?? "—"}
            </td>
            <td className="px-3 py-3 text-brand-secondary">
              {new Date(row.createdAt).toLocaleString("es-CO")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function DashboardOrdersSection({
  title,
  description,
  activeTab,
  onTabChange,
  revenueSummary,
  ordersData,
  ordersLoading,
  ordersPage,
  setOrdersPage,
  orderStatusDraft,
  setOrderStatusDraft,
  setOrderStatusQuery,
  setOrdersListTick,
  paymentsData,
  paymentsLoading,
  paymentsPage,
  setPaymentsPage,
  paymentStatusDraft,
  setPaymentStatusDraft,
  setPaymentStatusQuery,
  setPaymentsListTick,
  onOpenOrder,
}: DashboardOrdersSectionProps) {
  const totalOrders = ordersData?.totalElements ?? 0;
  const paidAmount = revenueSummary?.totalPaidAmount ?? 0;
  const paidCount = revenueSummary?.paidTransactions ?? 0;

  return (
    <>
      <SectionHeader title={title} description={description} />

      <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <DashboardStatCard
          title="Pedidos"
          value={formatCompactNumber(totalOrders)}
          fullValue={String(totalOrders)}
          tone="blue"
          icon="purchase-intent"
        />
        <DashboardStatCard
          title="Pagos cobrados"
          value={formatCompactNumber(paidCount)}
          fullValue={String(paidCount)}
          tone="blue"
          icon="interactions"
        />
        <DashboardStatCard
          title="Ingresos cobrados"
          value={formatCopCurrency(paidAmount)}
          fullValue={formatCopCurrency(paidAmount)}
          tone="blue"
          icon="revenue"
        />
      </section>

      <div className="mb-4 flex flex-wrap gap-1.5 rounded-xl border border-brand-separator bg-brand-hover p-1">
        <button
          type="button"
          onClick={() => onTabChange("pedidos")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === "pedidos"
              ? "bg-brand-surface text-brand-accent shadow-sm"
              : "text-brand-secondary hover:text-brand-primary"
          }`}
        >
          Pedidos
        </button>
        <button
          type="button"
          onClick={() => onTabChange("pagos")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === "pagos"
              ? "bg-brand-surface text-brand-accent shadow-sm"
              : "text-brand-secondary hover:text-brand-primary"
          }`}
        >
          Pagos realizados
        </button>
      </div>

      {activeTab === "pedidos" ? (
        <section className={brandDashboardPanel}>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div>
              <h3 className={`text-base font-semibold ${brandTextPrimary}`}>
                Pedidos del negocio
              </h3>
              <p className="text-xs text-brand-secondary">
                Checkout y estado del pedido (PENDING, PAID, FAILED).
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={orderStatusDraft}
                onChange={(e) => setOrderStatusDraft(e.target.value)}
                className={`min-w-[10rem] py-2 text-sm ${brandInputClass} px-3`}
              >
                {ORDER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value || "all"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  setOrderStatusQuery(orderStatusDraft.trim());
                  setOrdersPage(0);
                  setOrdersListTick((t) => t + 1);
                }}
                className="rounded-xl border border-brand-separator bg-brand-hover px-3 py-2 text-sm hover:bg-brand-hover"
              >
                Filtrar
              </button>
              <button
                type="button"
                onClick={() => setOrdersListTick((t) => t + 1)}
                disabled={ordersLoading}
                className="rounded-xl border border-brand-separator bg-brand-hover px-3 py-2 text-sm hover:bg-brand-hover disabled:opacity-50"
              >
                Refrescar
              </button>
            </div>
          </div>

          <div className="max-h-[min(55vh,480px)] overflow-auto overscroll-contain rounded-xl border border-brand-separator">
            <table className="min-w-full text-left text-sm">
              <thead className="sticky top-0 z-[1] border-b border-brand-separator bg-brand-surface/95 backdrop-blur-md">
                <tr className="text-brand-secondary">
                  <th className="px-3 py-3 font-medium">Pedido</th>
                  <th className="px-3 py-3 font-medium">Cliente</th>
                  <th className="px-3 py-3 font-medium">Total</th>
                  <th className="px-3 py-3 font-medium">Estado</th>
                  <th className="px-3 py-3 font-medium">Líneas</th>
                  <th className="px-3 py-3 font-medium">Fecha</th>
                  <th className="px-3 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {ordersLoading ? (
                  <tr>
                    <td className="px-3 py-3 text-brand-secondary" colSpan={7}>
                      Cargando pedidos…
                    </td>
                  </tr>
                ) : null}
                {!ordersLoading &&
                ordersData &&
                ordersData.content.length === 0 ? (
                  <tr>
                    <td className="px-3 py-3 text-brand-tertiary" colSpan={7}>
                      Aún no hay pedidos para este negocio.
                    </td>
                  </tr>
                ) : null}
                {!ordersLoading && ordersData
                  ? ordersData.content.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-brand-separator hover:bg-brand-hover"
                      >
                        <td className="px-3 py-3 tabular-nums font-medium text-brand-primary">
                          #{row.id}
                        </td>
                        <td className="px-3 py-3 text-brand-secondary">
                          <span className="block font-medium text-brand-primary">
                            {row.customerName}
                          </span>
                          <span className="text-xs text-brand-tertiary">
                            {row.customerEmail}
                          </span>
                        </td>
                        <td className="px-3 py-3 tabular-nums">
                          {formatCopCurrency(Number(row.total))}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${orderStatusBadgeClass(row.status)}`}
                          >
                            {formatOrderStatus(row.status)}
                          </span>
                        </td>
                        <td className="px-3 py-3 tabular-nums text-brand-secondary">
                          {row.itemCount}
                        </td>
                        <td className="px-3 py-3 text-brand-secondary">
                          {new Date(row.createdAt).toLocaleString("es-CO")}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => onOpenOrder(row.id)}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${dashboardStatusBadge} hover:bg-brand-hover`}
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>
          </div>

          {ordersData ? (
            <PaginationBar
              page={ordersData.page}
              totalPages={ordersData.totalPages}
              totalElements={ordersData.totalElements}
              label="pedidos"
              loading={ordersLoading}
              onPrev={() => setOrdersPage((p) => Math.max(0, p - 1))}
              onNext={() =>
                setOrdersPage((p) =>
                  Math.min(ordersData.totalPages - 1, p + 1),
                )
              }
            />
          ) : null}
        </section>
      ) : null}

      {activeTab === "pagos" ? (
        <section className={brandDashboardPanel}>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div>
              <h3 className={`text-base font-semibold ${brandTextPrimary}`}>
                Pagos realizados
              </h3>
              <p className="text-xs text-brand-secondary">
                Transacciones registradas (PayU y otras pasarelas). Los cobrados
                suman en ingresos del resumen.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={paymentStatusDraft}
                onChange={(e) => setPaymentStatusDraft(e.target.value)}
                placeholder="Filtrar por estado (ej. APPROVED)"
                className={`min-w-[12rem] py-2 text-sm ${brandInputClass} px-3`}
              />
              <button
                type="button"
                onClick={() => {
                  setPaymentStatusQuery(paymentStatusDraft.trim());
                  setPaymentsPage(0);
                  setPaymentsListTick((t) => t + 1);
                }}
                className="rounded-xl border border-brand-separator bg-brand-hover px-3 py-2 text-sm hover:bg-brand-hover"
              >
                Filtrar
              </button>
              <button
                type="button"
                onClick={() => setPaymentsListTick((t) => t + 1)}
                disabled={paymentsLoading}
                className="rounded-xl border border-brand-separator bg-brand-hover px-3 py-2 text-sm hover:bg-brand-hover disabled:opacity-50"
              >
                Refrescar
              </button>
            </div>
          </div>

          <div className="max-h-[min(55vh,480px)] overflow-auto overscroll-contain rounded-xl border border-brand-separator">
            {paymentsLoading ? (
              <p className={`px-3 py-6 text-sm ${brandTextSecondary}`}>
                Cargando pagos…
              </p>
            ) : null}
            {!paymentsLoading &&
            paymentsData &&
            paymentsData.content.length === 0 ? (
              <p className={`px-3 py-6 text-sm ${brandTextTertiary}`}>
                No hay pagos registrados para este negocio.
              </p>
            ) : null}
            {!paymentsLoading && paymentsData && paymentsData.content.length > 0 ? (
              <PaymentsTable rows={paymentsData.content} />
            ) : null}
          </div>

          {paymentsData ? (
            <PaginationBar
              page={paymentsData.page}
              totalPages={paymentsData.totalPages}
              totalElements={paymentsData.totalElements}
              label="pagos"
              loading={paymentsLoading}
              onPrev={() => setPaymentsPage((p) => Math.max(0, p - 1))}
              onNext={() =>
                setPaymentsPage((p) =>
                  Math.min(paymentsData.totalPages - 1, p + 1),
                )
              }
            />
          ) : null}
        </section>
      ) : null}
    </>
  );
}
