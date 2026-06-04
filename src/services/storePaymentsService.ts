import { buildAuthRequestHeaders } from "@/lib/api-headers";
import { publicApiBaseUrl as API_URL } from "@/lib/public-api";
import type { AuthFilters } from "@/services/payuPaymentMethodService";

/** Fila de pago + datos mínimos del pedido (sin cuerpo crudo de PayU). */
export type AdminPaymentListItem = {
  id: number;
  orderId: number;
  gateway: string;
  transactionId: string | null;
  amount: number;
  status: string;
  createdAt: string;
  customerEmail: string;
  customerName: string;
};

export type PagedPaymentsResponse = {
  content: AdminPaymentListItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
};

export type PaymentRevenueSummary = {
  totalPaidAmount: number;
  paidTransactions: number;
};

export type MyPaymentsQuery = AuthFilters & {
  gateway?: string;
  status?: string;
  page?: number;
  size?: number;
};

function buildAuthQuery(filters: AuthFilters) {
  const params = new URLSearchParams();
  if (filters.userId) params.set("userId", String(filters.userId));
  if (filters.clientId) params.set("clientId", String(filters.clientId));
  if (filters.storeId) params.set("storeId", String(filters.storeId));
  return params;
}

/**
 * Todos los pagos del negocio activo (cualquier gateway). Filtros opcionales.
 */
export async function listMyPayments(
  token: string,
  query: MyPaymentsQuery,
): Promise<PagedPaymentsResponse> {
  const params = buildAuthQuery({
    userId: query.userId,
    clientId: query.clientId,
    storeId: query.storeId,
  });
  if (query.gateway?.trim()) params.set("gateway", query.gateway.trim());
  if (query.status?.trim()) params.set("status", query.status.trim());
  if (query.page != null) params.set("page", String(query.page));
  if (query.size != null) params.set("size", String(query.size));
  const qs = params.toString();

  const response = await fetch(`${API_URL}/me/payments${qs ? `?${qs}` : ""}`, {
    headers: buildAuthRequestHeaders({
      token,
      storeId: query.storeId,
      requireStore: true,
    }),
  });
  if (!response.ok) {
    throw new Error("list_my_payments_error");
  }
  return (await response.json()) as PagedPaymentsResponse;
}

/**
 * Solo pagos PayU (`gateway=PAYU` en servidor). Ideal para enlazar con el checkout PayU.
 */
export async function listMyPayuPayments(
  token: string,
  query: Omit<MyPaymentsQuery, "gateway">,
): Promise<PagedPaymentsResponse> {
  const params = buildAuthQuery({
    userId: query.userId,
    clientId: query.clientId,
    storeId: query.storeId,
  });
  if (query.status?.trim()) params.set("status", query.status.trim());
  if (query.page != null) params.set("page", String(query.page));
  if (query.size != null) params.set("size", String(query.size));
  const qs = params.toString();

  const response = await fetch(`${API_URL}/me/payments/payu${qs ? `?${qs}` : ""}`, {
    headers: buildAuthRequestHeaders({
      token,
      storeId: query.storeId,
      requireStore: true,
    }),
  });
  if (!response.ok) {
    throw new Error("list_my_payu_payments_error");
  }
  return (await response.json()) as PagedPaymentsResponse;
}

/**
 * Resumen monetario de pagos pagados para el negocio activo.
 * El backend usa PAYU por defecto.
 */
export async function getMyPaymentsRevenueSummary(
  token: string,
  query: Omit<MyPaymentsQuery, "status" | "page" | "size"> & { gateway?: string },
): Promise<PaymentRevenueSummary> {
  const params = buildAuthQuery({
    userId: query.userId,
    clientId: query.clientId,
    storeId: query.storeId,
  });
  if (query.gateway?.trim()) params.set("gateway", query.gateway.trim());
  const qs = params.toString();

  const response = await fetch(`${API_URL}/me/payments/summary${qs ? `?${qs}` : ""}`, {
    headers: buildAuthRequestHeaders({
      token,
      storeId: query.storeId,
      requireStore: true,
    }),
  });
  if (!response.ok) {
    throw new Error("get_my_payments_revenue_summary_error");
  }
  return (await response.json()) as PaymentRevenueSummary;
}
