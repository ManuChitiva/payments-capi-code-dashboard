import { buildAuthRequestHeaders } from "@/lib/api-headers";
import { publicApiBaseUrl as API_URL } from "@/lib/public-api";
import type { AuthFilters } from "@/services/payuPaymentMethodService";

export type AdminOrderListItem = {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  total: number;
  status: string;
  createdAt: string;
  itemCount: number;
};

export type PagedOrdersResponse = {
  content: AdminOrderListItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
};

export type OrderItemDetail = {
  id: number;
  productId: number;
  productVariantId: number | null;
  productName: string;
  price: number;
  quantity: number;
};

export type OrderDetail = {
  id: number;
  storeId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItemDetail[];
};

export type MyOrdersQuery = AuthFilters & {
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

export async function listMyOrders(
  token: string,
  query: MyOrdersQuery,
): Promise<PagedOrdersResponse> {
  const params = buildAuthQuery({
    userId: query.userId,
    clientId: query.clientId,
    storeId: query.storeId,
  });
  if (query.status?.trim()) params.set("status", query.status.trim());
  if (query.page != null) params.set("page", String(query.page));
  if (query.size != null) params.set("size", String(query.size));
  const qs = params.toString();

  const response = await fetch(`${API_URL}/me/orders${qs ? `?${qs}` : ""}`, {
    headers: buildAuthRequestHeaders({
      token,
      storeId: query.storeId,
      requireStore: true,
    }),
  });
  if (!response.ok) {
    throw new Error("list_my_orders_error");
  }
  return (await response.json()) as PagedOrdersResponse;
}

export async function getMyOrder(
  token: string,
  storeId: number,
  orderId: number,
  filters: AuthFilters,
): Promise<OrderDetail> {
  const params = buildAuthQuery(filters);
  const qs = params.toString();

  const response = await fetch(
    `${API_URL}/me/orders/${orderId}${qs ? `?${qs}` : ""}`,
    {
      headers: buildAuthRequestHeaders({
        token,
        storeId,
        requireStore: true,
      }),
    },
  );
  if (!response.ok) {
    throw new Error("get_my_order_error");
  }
  return (await response.json()) as OrderDetail;
}
