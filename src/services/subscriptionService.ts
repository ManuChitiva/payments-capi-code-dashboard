import { buildAuthRequestHeaders } from "@/lib/api-headers";
import { publicApiBaseUrl } from "@/lib/public-api";

export type MySubscription = {
  planCode: string;
  planName: string;
  planDescription: string | null;
  planPrice: number;
  currency: string;
  maxStores: number | null;
  maxProducts: number | null;
  canUpgradeToPro: boolean;
  status: string;
  startedAt: string;
  expiresAt: string | null;
  currentStoreCount: number;
  canCreateMoreStores: boolean;
};

export type SubscriptionPaymentItem = {
  id: number;
  planName: string;
  amount: number;
  currency: string;
  status: string;
  referenceCode: string;
  createdAt: string;
  paidAt: string | null;
};

export type PayuWebCheckoutFields = {
  merchantId: string;
  accountId: string;
  description: string;
  referenceCode: string;
  amount: string;
  tax: string;
  taxReturnBase: string;
  currency: string;
  signature: string;
  test: number;
  buyerEmail: string;
  buyerFullName: string;
  telephone: string;
  responseUrl: string;
  confirmationUrl: string;
  algorithmSignature: string;
  keyPublic: string;
};

export type PayuPaymentStartResponse = {
  actionUrl: string;
  fields: PayuWebCheckoutFields;
};

export async function fetchMySubscription(token: string): Promise<MySubscription> {
  const response = await fetch(`${publicApiBaseUrl}/me/subscription`, {
    headers: buildAuthRequestHeaders({ token }),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("fetch_my_subscription_error");
  }
  return (await response.json()) as MySubscription;
}

export async function fetchMySubscriptionPayments(
  token: string,
): Promise<SubscriptionPaymentItem[]> {
  const response = await fetch(`${publicApiBaseUrl}/me/subscription/payments`, {
    headers: buildAuthRequestHeaders({ token }),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("fetch_my_subscription_payments_error");
  }
  return (await response.json()) as SubscriptionPaymentItem[];
}

export async function startProSubscriptionCheckout(
  token: string,
): Promise<PayuPaymentStartResponse> {
  const response = await fetch(`${publicApiBaseUrl}/me/subscription/checkout/pro`, {
    method: "POST",
    headers: buildAuthRequestHeaders({ token }),
  });
  if (!response.ok) {
    let message = "No se pudo iniciar el pago del plan PRO.";
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return (await response.json()) as PayuPaymentStartResponse;
}
