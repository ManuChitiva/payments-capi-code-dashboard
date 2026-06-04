"use client";

import {
  brandModalCancelBtn,
  brandModalFooter,
  brandModalHeader,
  brandModalOverlay,
  brandModalPanelLg,
  brandModalTitle,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
} from "@/lib/brand-theme";
import { formatCopCurrency } from "@/lib/dashboard/format";
import {
  formatOrderStatus,
  orderStatusBadgeClass,
} from "@/lib/dashboard/order-labels";
import type { OrderDetail } from "@/services/orderService";

type OrderDetailModalProps = {
  open: boolean;
  loading: boolean;
  order: OrderDetail | null;
  onClose: () => void;
};

export function OrderDetailModal({
  open,
  loading,
  order,
  onClose,
}: OrderDetailModalProps) {
  if (!open) return null;

  return (
    <div className={brandModalOverlay} onClick={onClose}>
      <div
        className={brandModalPanelLg}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={brandModalHeader}>
          <h3 className={brandModalTitle}>
            {order ? `Pedido #${order.id}` : "Detalle del pedido"}
          </h3>
          {order ? (
            <p className={`text-sm ${brandTextSecondary}`}>
              {new Date(order.createdAt).toLocaleString("es-CO")}
            </p>
          ) : null}
        </div>

        <div className="max-h-[min(60vh,520px)] overflow-auto px-6 py-5">
          {loading ? (
            <p className={`text-sm ${brandTextSecondary}`}>Cargando pedido…</p>
          ) : null}
          {!loading && !order ? (
            <p className={`text-sm ${brandTextTertiary}`}>
              No se pudo cargar el pedido.
            </p>
          ) : null}
          {!loading && order ? (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${orderStatusBadgeClass(order.status)}`}
                >
                  {formatOrderStatus(order.status)}
                </span>
                <span className={`text-lg font-semibold tabular-nums ${brandTextPrimary}`}>
                  {formatCopCurrency(Number(order.total))}
                </span>
              </div>

              <div className="rounded-xl border border-brand-separator bg-brand-hover p-4 text-sm">
                <p className={`font-medium ${brandTextPrimary}`}>
                  {order.customerName}
                </p>
                <p className={brandTextSecondary}>{order.customerEmail}</p>
                {order.customerPhone ? (
                  <p className={brandTextTertiary}>{order.customerPhone}</p>
                ) : null}
              </div>

              <div>
                <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${brandTextTertiary}`}>
                  Líneas ({order.items.length})
                </p>
                <ul className="space-y-2">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-brand-separator bg-brand-surface px-3 py-2.5 text-sm"
                    >
                      <div>
                        <p className={brandTextPrimary}>{item.productName}</p>
                        <p className={`text-xs ${brandTextTertiary}`}>
                          Producto #{item.productId}
                          {item.productVariantId != null
                            ? ` · variante #${item.productVariantId}`
                            : ""}
                        </p>
                      </div>
                      <div className="text-right tabular-nums">
                        <p className={brandTextPrimary}>
                          {item.quantity} × {formatCopCurrency(Number(item.price))}
                        </p>
                        <p className={`text-xs ${brandTextSecondary}`}>
                          {formatCopCurrency(
                            Number(item.price) * item.quantity,
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        <div className={brandModalFooter}>
          <button type="button" onClick={onClose} className={brandModalCancelBtn}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
