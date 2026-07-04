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
  canUpgradeToEnterprise: boolean;
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

export type PurchasablePlanCode = "PRO" | "ENTERPRISE";

export type StartSubscriptionCheckoutInput =
  | { planCode: PurchasablePlanCode }
  | { planId: number };

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

export async function startSubscriptionCheckout(
  token: string,
  input: StartSubscriptionCheckoutInput,
): Promise<PayuPaymentStartResponse> {
  const body =
    "planCode" in input ? { planCode: input.planCode } : { planId: input.planId };
  const planCode = "planCode" in input ? input.planCode : undefined;
  const response = await fetch(`${publicApiBaseUrl}/me/subscription/checkout`, {
    method: "POST",
    headers: {
      ...buildAuthRequestHeaders({ token }),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const defaultMessage =
      planCode === "ENTERPRISE"
        ? "No se pudo iniciar el pago del plan Empresarial."
        : planCode === "PRO"
          ? "No se pudo iniciar el pago del plan PRO."
          : "No se pudo iniciar el pago de la suscripción.";
    let message = defaultMessage;
    try {
      const payload = (await response.json()) as { message?: string };
      if (payload.message) message = payload.message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return (await response.json()) as PayuPaymentStartResponse;
}

/** @deprecated Usa {@link startSubscriptionCheckout} con `{ planCode: "PRO" }`. */
export async function startProSubscriptionCheckout(
  token: string,
): Promise<PayuPaymentStartResponse> {
  return startSubscriptionCheckout(token, { planCode: "PRO" });
}

/** @deprecated Usa {@link startSubscriptionCheckout} con `{ planCode: "ENTERPRISE" }`. */
export async function startEnterpriseSubscriptionCheckout(
  token: string,
): Promise<PayuPaymentStartResponse> {
  return startSubscriptionCheckout(token, { planCode: "ENTERPRISE" });
}
