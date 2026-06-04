"use client";

import type { Dispatch, SetStateAction } from "react";
import { SectionHeader } from "@/components/dashboard/section-header";
import {
  brandActionButtonSolid,
  brandDashboardPanel,
  brandInputClass,
  dashboardNoticeWarn,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
} from "@/lib/brand-theme";
import type { PayuPaymentMethodSummary } from "@/services/payuPaymentMethodService";
import type { PagedPaymentsResponse } from "@/services/storePaymentsService";

export type DashboardPaymentsSectionProps = {
  title: string;
  description: string;
  payuMethods: PayuPaymentMethodSummary[];
  payuLoading: boolean;
  hasActivePayuConfig: boolean;
  openCreatePayuModal: () => void;
  openEditPayuModal: (method: PayuPaymentMethodSummary) => void;
  handleDeletePayu: (paymentMethodId: number) => void | Promise<void>;
  payuPaymentsData: PagedPaymentsResponse | null;
  payuPaymentsLoading: boolean;
  payuPaymentStatusDraft: string;
  setPayuPaymentStatusDraft: Dispatch<SetStateAction<string>>;
  setPayuPaymentStatusQuery: Dispatch<SetStateAction<string>>;
  setPayuPaymentsPage: Dispatch<SetStateAction<number>>;
  setPayuPaymentsListTick: Dispatch<SetStateAction<number>>;
  payuPaymentsPage: number;
};

export function DashboardPaymentsSection({
  title,
  description,
  payuMethods,
  payuLoading,
  hasActivePayuConfig,
  openCreatePayuModal,
  openEditPayuModal,
  handleDeletePayu,
  payuPaymentsData,
  payuPaymentsLoading,
  payuPaymentStatusDraft,
  setPayuPaymentStatusDraft,
  setPayuPaymentStatusQuery,
  setPayuPaymentsPage,
  setPayuPaymentsListTick,
  payuPaymentsPage,
}: DashboardPaymentsSectionProps) {
  return (
    <>
      <SectionHeader title={title} description={description} />
      <section className={brandDashboardPanel}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className={`text-base font-semibold ${brandTextPrimary}`}>
              Configuracion medio de pago PayU
            </h3>
            <p className="text-xs text-brand-secondary">
              CRUD del medio de pago con token y filtros del usuario
              autenticado.
            </p>
            {hasActivePayuConfig ? (
              <p className="mt-2 text-xs text-brand-secondary">
                Ya hay una configuracion PayU activa en esta tienda.
                Desactivala o eliminala para poder crear otra.
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={openCreatePayuModal}
            disabled={hasActivePayuConfig || payuLoading}
            title={
              hasActivePayuConfig
                ? "No puedes crear otra configuracion mientras exista una activa"
                : undefined
            }
            className={`${brandActionButtonSolid} disabled:cursor-not-allowed disabled:opacity-45`}
          >
            Nuevo PayU
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-separator text-brand-secondary">
                <th className="px-3 py-3 font-medium">Nombre</th>
                <th className="px-3 py-3 font-medium">Merchant ID</th>
                <th className="px-3 py-3 font-medium">Account ID</th>
                <th className="px-3 py-3 font-medium">Entorno</th>
                <th className="px-3 py-3 font-medium">Estado</th>
                <th className="px-3 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {payuLoading ? (
                <tr>
                  <td className="px-3 py-3 text-brand-secondary" colSpan={6}>
                    Cargando configuracion de PayU...
                  </td>
                </tr>
              ) : null}
              {!payuLoading && payuMethods.length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-brand-tertiary" colSpan={6}>
                    Aun no hay configuraciones de PayU para esta store.
                  </td>
                </tr>
              ) : null}
              {payuMethods.map((method) => (
                <tr
                  key={method.id}
                  className="border-b border-brand-separator hover:bg-brand-hover"
                >
                  <td className="px-3 py-3">{method.name}</td>
                  <td className="px-3 py-3 text-brand-secondary">
                    {method.merchantId}
                  </td>
                  <td className="px-3 py-3 text-brand-secondary">
                    {method.accountId}
                  </td>
                  <td className="px-3 py-3 text-brand-secondary">
                    {method.sandbox ? "Sandbox" : "Produccion"}
                  </td>
                  <td className="px-3 py-3 text-brand-secondary">
                    {method.active ? "Activo" : "Inactivo"}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => openEditPayuModal(method)}
                      className="rounded-lg border border-brand-separator bg-brand-hover px-3 py-1.5 text-xs hover:bg-brand-hover"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePayu(method.id)}
                      className="ml-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200 hover:bg-rose-500/20"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-brand-separator bg-brand-surface/90 p-4 backdrop-blur sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div>
            <h3 className={`text-base font-semibold ${brandTextPrimary}`}>
              Pagos PayU registrados
            </h3>
            <p className="text-xs text-brand-secondary">
              Cobros asociados a pedidos (callback PayU). Orden descendente por
              fecha.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={payuPaymentStatusDraft}
              onChange={(e) => setPayuPaymentStatusDraft(e.target.value)}
              placeholder="Filtrar por estado (ej. APPROVED)"
              className={`min-w-[12rem] py-2 text-sm ${brandInputClass} px-3`}
            />
            <button
              type="button"
              onClick={() => {
                setPayuPaymentStatusQuery(payuPaymentStatusDraft.trim());
                setPayuPaymentsPage(0);
                setPayuPaymentsListTick((t) => t + 1);
              }}
              className="rounded-xl border border-brand-separator bg-brand-hover px-3 py-2 text-sm hover:bg-brand-hover"
            >
              Filtrar
            </button>
            <button
              type="button"
              onClick={() => setPayuPaymentsListTick((t) => t + 1)}
              disabled={payuPaymentsLoading}
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
                <th className="px-3 py-3 font-medium">ID pago</th>
                <th className="px-3 py-3 font-medium">Pedido</th>
                <th className="px-3 py-3 font-medium">Cliente</th>
                <th className="px-3 py-3 font-medium">Monto</th>
                <th className="px-3 py-3 font-medium">Estado</th>
                <th className="px-3 py-3 font-medium">Transaccion</th>
                <th className="px-3 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {payuPaymentsLoading ? (
                <tr>
                  <td className="px-3 py-3 text-brand-secondary" colSpan={7}>
                    Cargando pagos...
                  </td>
                </tr>
              ) : null}
              {!payuPaymentsLoading &&
              payuPaymentsData &&
              payuPaymentsData.content.length === 0 ? (
                <tr>
                  <td className="px-3 py-3 text-brand-tertiary" colSpan={7}>
                    No hay pagos PayU registrados para esta tienda.
                  </td>
                </tr>
              ) : null}
              {!payuPaymentsLoading && payuPaymentsData
                ? payuPaymentsData.content.map((row) => (
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
                        ${Number(row.amount).toFixed(2)}
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-full border border-brand-separator bg-brand-hover px-2 py-0.5 text-xs uppercase text-brand-primary">
                          {row.status}
                        </span>
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
                  ))
                : null}
            </tbody>
          </table>
        </div>

        {payuPaymentsData && payuPaymentsData.totalPages > 1 ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-brand-separator pt-4 text-xs text-brand-secondary">
            <span>
              Pagina {payuPaymentsData.page + 1} de {payuPaymentsData.totalPages}{" "}
              ({payuPaymentsData.totalElements} pagos)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={payuPaymentsPage <= 0 || payuPaymentsLoading}
                onClick={() => setPayuPaymentsPage((p) => Math.max(0, p - 1))}
                className="rounded-lg border border-brand-separator bg-brand-hover px-3 py-1.5 text-sm hover:bg-brand-hover disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={
                  payuPaymentsPage >= payuPaymentsData.totalPages - 1 ||
                  payuPaymentsLoading
                }
                onClick={() =>
                  setPayuPaymentsPage((p) =>
                    Math.min(payuPaymentsData.totalPages - 1, p + 1),
                  )
                }
                className="rounded-lg border border-brand-separator bg-brand-hover px-3 py-1.5 text-sm hover:bg-brand-hover disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
