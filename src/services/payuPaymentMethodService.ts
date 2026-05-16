import { buildAuthRequestHeaders } from "@/lib/api-headers";
import { publicApiBaseUrl as API_URL } from "@/lib/public-api";

export type AuthFilters = {
  userId?: number;
  clientId?: number;
  storeId?: number;
};

/** Respuesta de GET / POST / PUT: sin credenciales. */
export type PayuPaymentMethodSummary = {
  id: number;
  name: string;
  merchantId: string;
  accountId: string;
  sandbox: boolean;
  active: boolean;
};

export type PayuPaymentMethodCreatePayload = {
  name: string;
  merchantId: string;
  accountId: string;
  apiKey: string;
  apiLogin: string;
  keyPublic: string;
  sandbox: boolean;
  active: boolean;
};

/** PUT: omite apiKey / apiLogin / keyPublic o enviarlos vacios para no cambiarlos en servidor. */
export type PayuPaymentMethodUpdatePayload = {
  name: string;
  merchantId: string;
  accountId: string;
  sandbox: boolean;
  active: boolean;
  apiKey?: string;
  apiLogin?: string;
  keyPublic?: string;
};

function buildQuery(filters: AuthFilters) {
  const params = new URLSearchParams();
  if (filters.userId) params.set("userId", String(filters.userId));
  if (filters.clientId) params.set("clientId", String(filters.clientId));
  if (filters.storeId) params.set("storeId", String(filters.storeId));
  const query = params.toString();
  return query ? `?${query}` : "";
}

function buildHeaders(token: string, filters: AuthFilters) {
  return buildAuthRequestHeaders({
    token,
    storeId: filters.storeId,
    contentType: "application/json",
    requireStore: true,
  });
}

function authHeaders(token: string, filters: AuthFilters) {
  return buildAuthRequestHeaders({
    token,
    storeId: filters.storeId,
    requireStore: true,
  });
}

export async function listPayuPaymentMethods(
  token: string,
  filters: AuthFilters,
): Promise<PayuPaymentMethodSummary[]> {
  const response = await fetch(
    `${API_URL}/me/payment-methods/payu${buildQuery(filters)}`,
    {
      headers: authHeaders(token, filters),
    },
  );
  if (!response.ok) {
    throw new Error("list_payu_payment_methods_error");
  }
  return (await response.json()) as PayuPaymentMethodSummary[];
}

export async function createPayuPaymentMethod(
  token: string,
  filters: AuthFilters,
  payload: PayuPaymentMethodCreatePayload,
): Promise<PayuPaymentMethodSummary> {
  const response = await fetch(
    `${API_URL}/me/payment-methods/payu${buildQuery(filters)}`,
    {
      method: "POST",
      headers: buildHeaders(token, filters),
      body: JSON.stringify(payload),
    },
  );
  if (!response.ok) {
    throw new Error("create_payu_payment_method_error");
  }
  return (await response.json()) as PayuPaymentMethodSummary;
}

export async function updatePayuPaymentMethod(
  token: string,
  filters: AuthFilters,
  paymentMethodId: number,
  payload: PayuPaymentMethodUpdatePayload,
): Promise<PayuPaymentMethodSummary> {
  const response = await fetch(
    `${API_URL}/me/payment-methods/payu/${paymentMethodId}${buildQuery(filters)}`,
    {
      method: "PUT",
      headers: buildHeaders(token, filters),
      body: JSON.stringify(payload),
    },
  );
  if (!response.ok) {
    throw new Error("update_payu_payment_method_error");
  }
  return (await response.json()) as PayuPaymentMethodSummary;
}

export async function deletePayuPaymentMethod(
  token: string,
  filters: AuthFilters,
  paymentMethodId: number,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/me/payment-methods/payu/${paymentMethodId}${buildQuery(filters)}`,
    {
      method: "DELETE",
      headers: authHeaders(token, filters),
    },
  );
  if (!response.ok) {
    throw new Error("delete_payu_payment_method_error");
  }
}
