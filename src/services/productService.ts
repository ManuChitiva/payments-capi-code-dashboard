import { buildAuthRequestHeaders } from "@/lib/api-headers";
import { publicApiBaseUrl as API_URL } from "@/lib/public-api";
import {
  minVariantPrice,
  totalVariantStock,
  type ProductVariantApi,
} from "@/lib/product-variants";
import type { CatalogProduct, ProductStatus } from "@/components/dashboard/products-table";

type ProductApiRow = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  discount: number | null;
  imageUrl: string | null;
  active: boolean;
  availableQuantity: number;
  createdAt: string;
  variants?: ProductVariantApi[];
};

export type CatalogFilter = "todos" | ProductStatus;

/** Mapea filtro UI a query {@code active} del backend. */
export function catalogFilterToActiveParam(
  filter: CatalogFilter,
): boolean | undefined {
  if (filter === "inactivo") return false;
  if (filter === "activo" || filter === "agotado") return true;
  return undefined;
}

function resolveCatalogStock(
  item: ProductApiRow,
  variants: ProductVariantApi[],
): number {
  if (variants.length > 0) {
    return variants
      .filter((v) => v.active)
      .reduce((sum, v) => sum + Math.max(0, v.availableQuantity), 0);
  }
  return item.availableQuantity;
}

function resolveCatalogPrice(
  item: ProductApiRow,
  variants: ProductVariantApi[],
): { price: number; priceLabel?: string } {
  if (variants.length === 0) {
    return { price: Number(item.price), priceLabel: undefined };
  }
  const activePrices = variants
    .filter((v) => v.active)
    .map((v) => Number(v.price))
    .filter((p) => Number.isFinite(p));
  if (activePrices.length === 0) {
    return { price: Number(item.price), priceLabel: "base" };
  }
  const min = Math.min(...activePrices);
  const max = Math.max(...activePrices);
  if (min === max) {
    return { price: min };
  }
  return { price: min, priceLabel: "desde" };
}

function mapProductRow(item: ProductApiRow): CatalogProduct {
  const variants = item.variants ?? [];
  const hasVariants = variants.length > 0;
  const stock = resolveCatalogStock(item, variants);
  const { price, priceLabel } = resolveCatalogPrice(item, variants);

  const status: ProductStatus = item.active
    ? stock > 0
      ? "activo"
      : "agotado"
    : "inactivo";

  const basePrice = Number(item.price);
  const discount = item.discount != null && Number.isFinite(item.discount) && item.discount > 0
    ? item.discount
    : null;
  const discountedPrice = discount != null ? Math.max(0, basePrice - discount) : null;
  const discountPercent =
    discount != null && basePrice > 0
      ? Math.round((discount / basePrice) * 100)
      : null;

  return {
    id: item.id,
    sku: `PRD-${item.id}`,
    name: item.name,
    description: item.description ?? "",
    category: "General",
    price,
    basePrice,
    priceLabel,
    discount,
    discountedPrice,
    discountPercent,
    imageUrl: item.imageUrl ?? "",
    stock,
    status,
    active: item.active,
    updatedAt: new Date(item.createdAt).toISOString().slice(0, 10),
    hasVariants,
    variantCount: variants.length,
    variants,
  };
}

/**
 * Listado del panel: GET /me/products con X-Store-Id.
 * {@code active}: true activos, false inactivos, omitido todos.
 */
export async function listMyProducts(
  token: string,
  storeId: number,
  filter: CatalogFilter = "todos",
): Promise<CatalogProduct[]> {
  const active = catalogFilterToActiveParam(filter);
  const params = active === undefined ? "" : `?active=${active}`;
  const response = await fetch(`${API_URL}/me/products${params}`, {
    headers: buildAuthRequestHeaders({ token, storeId, requireStore: true }),
  });
  if (!response.ok) {
    throw new Error("products_error");
  }
  const payload = (await response.json()) as ProductApiRow[];
  const mapped = payload.map(mapProductRow);
  if (filter === "activo") {
    return mapped.filter((p) => p.status === "activo");
  }
  if (filter === "agotado") {
    return mapped.filter((p) => p.status === "agotado");
  }
  return mapped;
}

export type ProductUpsertBody = {
  name: string;
  description: string;
  price: number;
  discount: number | null;
  imageUrl: string | null;
  availableQuantity: number;
  active: boolean;
  variants: Array<{
    id: number | null;
    sku: string | null;
    title: string;
    imageUrl: string;
    price: number;
    availableQuantity: number;
    active: boolean;
    sortOrder: number;
  }>;
};

export async function upsertMyProduct(
  token: string,
  storeId: number,
  body: ProductUpsertBody,
  productId?: number,
): Promise<void> {
  const isEdit = productId != null;
  const response = await fetch(
    isEdit ? `${API_URL}/me/products/${productId}` : `${API_URL}/me/products`,
    {
      method: isEdit ? "PUT" : "POST",
      headers: buildAuthRequestHeaders({
        token,
        storeId,
        contentType: "application/json",
        requireStore: true,
      }),
      body: JSON.stringify(body),
    },
  );
  if (!response.ok) {
    throw new Error(isEdit ? "update_product_error" : "create_product_error");
  }
}

/** Baja o alta lógica: DELETE /me/products/{id}?active=true|false */
export async function setMyProductActive(
  token: string,
  storeId: number,
  productId: number,
  active: boolean,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/me/products/${productId}?active=${active}`,
    {
      method: "DELETE",
      headers: buildAuthRequestHeaders({ token, storeId, requireStore: true }),
    },
  );
  if (!response.ok) {
    throw new Error("set_product_active_error");
  }
}

const copFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

/** Exportado para que componentes (p. ej. catálogo) compongan montos con estilos distintos. */
export const formatCop = (amount: number): string => copFormatter.format(amount);

/** Etiqueta compacta del precio "visible" (con tachado si hay descuento). */
export function formatCatalogPrice(product: CatalogProduct): string {
  const cop = copFormatter.format(product.price);
  if (product.priceLabel === "desde") return `Desde ${cop}`;
  return cop;
}

/**
 * Desglose de precio para renderizar tachado + precio final + % off.
 * Siempre devuelve el precio original formateado; si hay descuento,
 * expone también `final` y `percentOff` (entero) para componer la UI.
 */
export function formatCatalogPriceBreakdown(product: CatalogProduct): {
  original: string;
  final: string;
  percentOff?: number;
  finalWithPercent: string;
} {
  const original = copFormatter.format(product.basePrice ?? product.price);
  if (product.discountedPrice == null || product.discount == null) {
    return { original, final: original, finalWithPercent: original };
  }
  const final = copFormatter.format(product.discountedPrice);
  return {
    original,
    final,
    percentOff: product.discountPercent ?? undefined,
    finalWithPercent: final,
  };
}

export { totalVariantStock, minVariantPrice };
