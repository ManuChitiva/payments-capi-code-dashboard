import type { ProductStatus } from "@/components/dashboard/products-table";
import type { DashboardSection } from "@/components/dashboard/dashboard-sidebar";
import type { PaymentRevenueSummary } from "@/services/storePaymentsService";
import type { PayuPaymentMethodSummary } from "@/services/payuPaymentMethodService";
import type { PagedPaymentsResponse } from "@/services/storePaymentsService";

export type DashboardProduct = {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  stock: number;
  status: ProductStatus;
  active: boolean;
  updatedAt: string;
};

export type StoreSummary = {
  id: number;
  name: string;
  slug: string;
  label: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
};

export type ClientDetail = {
  id: number;
  name: string;
  email: string;
  activeStoreId: number | null;
  stores: StoreSummary[];
};

export type TopProductInterest = {
  productId: number;
  productName: string | null;
  count: number;
};

export type TopProductsInterestPage = {
  content: TopProductInterest[];
  last: boolean;
  number: number;
  size: number;
  totalElements: number;
};

export type AnalyticsDashboard = {
  slug: string;
  totalEvents: number;
  productViews: number;
  productClicks: number;
  addToCart: number;
  purchaseIntents: number;
  dailyMetrics: Array<{
    date: string;
    eventType:
      | "PRODUCT_VIEW"
      | "PRODUCT_CLICK"
      | "ADD_TO_CART"
      | "PURCHASE_INTENT";
    count: number;
  }>;
  topProducts: Array<{
    productId: number;
    productName?: string | null;
    count: number;
  }>;
};

export type DashboardSectionMeta = {
  title: string;
  description: string;
};

export type PayuFormState = {
  name: string;
  merchantId: string;
  accountId: string;
  apiKey: string;
  apiLogin: string;
  keyPublic: string;
  sandbox: boolean;
  active: boolean;
};

export type { DashboardSection, PaymentRevenueSummary, PayuPaymentMethodSummary, PagedPaymentsResponse };
