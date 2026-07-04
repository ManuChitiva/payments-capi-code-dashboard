"use client";

import {
  formatCopCurrency,
  formatCompactCopCurrency,
  formatCompactNumber,
} from "@/lib/dashboard/format";

/**
 * Tarjeta "Pedidos sin pagar" — alert card en tono amber para owner del negocio.
 * Muestra:
 *  1. Conteo de pedidos en estado PENDING (totalElements vía /me/orders?status=PENDING)
 *  2. Suma aproximada de los PENDING más recientes (los de la primera página)
 *  3. Lista de los 5 más antiguos para priorizar seguimiento
 */
export type AbandonedCheckoutsCardProps = {
  count: number;
  /** Monto sumado de los pedidos en la primera página (size=5). */
  visibleTotalAmount: number;
  pendingOrders: ReadonlyArray<{
    id: number;
    customerName: string;
    total: number;
    createdAt: string;
    itemCount?: number;
  }>;
  onOpenOrder?: (orderId: number) => void;
};

export function AbandonedCheckoutsCard({
  count,
  visibleTotalAmount,
  pendingOrders,
  onOpenOrder,
}: AbandonedCheckoutsCardProps) {
  return (
    <article className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 shadow-[0_4px_14px_-6px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur sm:p-6 dark:border-amber-400/35 dark:bg-amber-500/10">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/12 text-amber-700 shadow-[0_2px_8px_-2px_rgba(217,119,6,0.3)] dark:border-amber-400/40 dark:bg-amber-500/15 dark:text-amber-200 dark:shadow-[0_2px_10px_-2px_rgba(251,191,36,0.45)]">
            <ClockIcon />
          </span>
          <div>
            <h3 className="text-sm font-medium text-amber-900 dark:text-amber-100">
              Pedidos sin pagar
            </h3>
            <p className="mt-0.5 text-xs text-amber-900/70 dark:text-amber-200/70">
              Estado PENDING · revenue en riesgo
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-(family-name:--font-rajdhani) text-3xl font-bold leading-none tracking-tight text-amber-900 dark:text-amber-100">
            {formatCompactNumber(count)}
          </p>
          <p className="mt-1 text-[11px] text-amber-900/70 dark:text-amber-200/70">
            pendientes
          </p>
        </div>
      </header>

      <div className="mt-5 flex flex-wrap items-baseline gap-2 rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 dark:border-amber-400/30 dark:bg-amber-500/10">
        <p className="text-xs text-amber-900/80 dark:text-amber-200/80">
          Suma visible (top {pendingOrders.length || 5} más recientes):
        </p>
        <p className="font-(family-name:--font-rajdhani) text-base font-bold tabular-nums text-amber-900 dark:text-amber-100">
          {formatCompactCopCurrency(visibleTotalAmount)}
        </p>
      </div>

      {count === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/8 px-4 py-6 text-center dark:border-amber-400/25 dark:bg-amber-500/8">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
            Ninguno por ahora
          </p>
          <p className="mt-1 text-xs text-amber-900/70 dark:text-amber-200/70">
            Cuando un cliente inicia un pedido y no completa el pago, lo verás
            aquí.
          </p>
        </div>
      ) : (
        <ul className="mt-5 space-y-2">
          {pendingOrders.map((order) => (
            <li
              key={order.id}
              className="group flex items-center justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/8 px-3 py-2.5 transition-colors hover:bg-amber-500/12 dark:border-amber-400/25 dark:bg-amber-500/8 dark:hover:bg-amber-500/12"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-amber-900 dark:text-amber-100">
                  {order.customerName || "Cliente sin nombre"}
                </p>
                <p className="text-[11px] text-amber-900/70 dark:text-amber-200/70">
                  Pedido #{order.id} ·{" "}
                  {new Date(order.createdAt).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-(family-name:--font-rajdhani) text-sm font-semibold tabular-nums text-amber-900 dark:text-amber-100">
                  {formatCopCurrency(order.total)}
                </span>
                {onOpenOrder ? (
                  <button
                    type="button"
                    onClick={() => onOpenOrder(order.id)}
                    className="rounded-md border border-amber-500/30 bg-amber-500/12 px-2 py-1 text-[11px] font-medium text-amber-900 transition-colors hover:bg-amber-500/20 dark:border-amber-400/40 dark:text-amber-100 dark:hover:bg-amber-500/20"
                  >
                    Ver
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function ClockIcon() {
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
        d="M12 6v6h4.5m4.5.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}
