import { buildAuthRequestHeaders } from "@/lib/api-headers";
import { publicApiBaseUrl as API_URL } from "@/lib/public-api";
import type {
  AnalyticsDashboard,
  TopProductsInterestPage,
  TopSoldProduct,
} from "@/types/dashboard";

export async function loadAnalytics(
  token: string,
  storeSlug: string,
): Promise<AnalyticsDashboard> {
  const response = await fetch(
    `${API_URL}/stores/${storeSlug}/analytics/dashboard?days=30`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("analytics_error");
  }

  return (await response.json()) as AnalyticsDashboard;
}

export async function loadTopProductsInterestPage(
  token: string,
  storeSlug: string,
  page: number,
  size: number,
): Promise<TopProductsInterestPage> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const response = await fetch(
    `${API_URL}/stores/${storeSlug}/analytics/top-products?${params}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("top_products_error");
  }

  return (await response.json()) as TopProductsInterestPage;
}

/**
 * Top productos vendidos (PAID) del negocio activo.
 * Usa `X-Store-Id` (admin) en lugar de slug, replicando el patrón de `orderService.ts`.
 */
export async function loadTopSoldProducts(
  token: string,
  storeId: number,
  days = 30,
): Promise<TopSoldProduct[]> {
  const params = new URLSearchParams({ days: String(days) });
  const response = await fetch(
    `${API_URL}/me/orders/top-products?${params}`,
    {
      headers: buildAuthRequestHeaders({
        token,
        storeId,
        requireStore: true,
      }),
    },
  );
  if (!response.ok) {
    throw new Error("top_sold_products_error");
  }
  return (await response.json()) as TopSoldProduct[];
}

export function buildDailySeries(
  dailyMetrics: AnalyticsDashboard["dailyMetrics"],
): Array<{
  label: string;
  PRODUCT_VIEW: number;
  PRODUCT_CLICK: number;
  ADD_TO_CART: number;
  PURCHASE_INTENT: number;
}> {
  const perDate = new Map<
    string,
    {
      PRODUCT_VIEW: number;
      PRODUCT_CLICK: number;
      ADD_TO_CART: number;
      PURCHASE_INTENT: number;
    }
  >();

  for (const metric of dailyMetrics) {
    const current = perDate.get(metric.date) ?? {
      PRODUCT_VIEW: 0,
      PRODUCT_CLICK: 0,
      ADD_TO_CART: 0,
      PURCHASE_INTENT: 0,
    };
    current[metric.eventType] += metric.count;
    perDate.set(metric.date, current);
  }

  const sortedDates = [...perDate.keys()].sort((a, b) => a.localeCompare(b));
  const endDate = sortedDates.length
    ? new Date(`${sortedDates[sortedDates.length - 1]}T00:00:00`)
    : new Date();

  const windowDays = 7;
  const range: Array<{
    date: string;
    PRODUCT_VIEW: number;
    PRODUCT_CLICK: number;
    ADD_TO_CART: number;
    PURCHASE_INTENT: number;
  }> = [];
  for (let i = windowDays - 1; i >= 0; i -= 1) {
    const current = new Date(endDate);
    current.setDate(endDate.getDate() - i);
    const key = current.toISOString().slice(0, 10);
    const values = perDate.get(key) ?? {
      PRODUCT_VIEW: 0,
      PRODUCT_CLICK: 0,
      ADD_TO_CART: 0,
      PURCHASE_INTENT: 0,
    };
    range.push({ date: key, ...values });
  }

  return range.map((item) => ({
    label: item.date,
    PRODUCT_VIEW: item.PRODUCT_VIEW,
    PRODUCT_CLICK: item.PRODUCT_CLICK,
    ADD_TO_CART: item.ADD_TO_CART,
    PURCHASE_INTENT: item.PURCHASE_INTENT,
  }));
}
