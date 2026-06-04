/** Variantes embebidas en POST/PUT /me/products (precio absoluto en API). */

export type VariantPricingMode = "absolute" | "addon";

export type ProductVariantApi = {
  id: number;
  productId: number;
  sku: string | null;
  title: string;
  imageUrl: string;
  price: number;
  availableQuantity: number;
  active: boolean;
  sortOrder: number;
  createdAt?: string;
};

export type ProductVariantUpsertPayload = {
  id: number | null;
  sku: string | null;
  title: string;
  imageUrl: string;
  price: number;
  availableQuantity: number;
  active: boolean;
  sortOrder: number;
};

export type ProductVariantFormRow = {
  localId: string;
  id?: number;
  sku: string;
  title: string;
  imageUrl: string;
  /** Valor mostrado: precio total o monto adicional según pricingMode */
  price: string;
  pricingMode: VariantPricingMode;
  availableQuantity: string;
  active: boolean;
};

let variantRowSeq = 0;

export function newVariantLocalId(): string {
  variantRowSeq += 1;
  return `variant-${variantRowSeq}-${Date.now()}`;
}

export function createEmptyVariantRow(): ProductVariantFormRow {
  return {
    localId: newVariantLocalId(),
    sku: "",
    title: "",
    imageUrl: "",
    price: "",
    pricingMode: "absolute",
    availableQuantity: "0",
    active: true,
  };
}

export function parseBasePrice(price: string): number {
  const n = Number(price.trim());
  return Number.isFinite(n) ? n : 0;
}

/** Precio unitario que exige el backend (siempre absoluto). */
export function resolveVariantApiPrice(
  basePrice: number,
  row: ProductVariantFormRow,
): number {
  const raw = Number(row.price.trim());
  if (!Number.isFinite(raw) || raw < 0) return NaN;
  if (row.pricingMode === "addon") {
    return Math.round((basePrice + raw) * 100) / 100;
  }
  return Math.round(raw * 100) / 100;
}

export function variantRowFromApi(variant: ProductVariantApi): ProductVariantFormRow {
  return {
    localId: newVariantLocalId(),
    id: variant.id,
    sku: variant.sku ?? "",
    title: variant.title,
    imageUrl: variant.imageUrl,
    price: String(variant.price),
    pricingMode: "absolute",
    availableQuantity: String(variant.availableQuantity),
    active: variant.active,
  };
}

export function toVariantUpsertPayload(
  rows: ProductVariantFormRow[],
  basePrice: number,
): ProductVariantUpsertPayload[] {
  return rows.map((row, index) => ({
    id: row.id ?? null,
    sku: row.sku.trim() || null,
    title: row.title.trim(),
    imageUrl: row.imageUrl.trim(),
    price: resolveVariantApiPrice(basePrice, row),
    availableQuantity: Math.max(0, Math.floor(Number(row.availableQuantity) || 0)),
    active: row.active,
    sortOrder: index,
  }));
}

export function totalVariantStock(rows: ProductVariantFormRow[]): number {
  return rows.reduce((sum, row) => {
    if (!row.active) return sum;
    const q = Number(row.availableQuantity);
    return sum + (Number.isFinite(q) && q > 0 ? Math.floor(q) : 0);
  }, 0);
}

export function minVariantPrice(
  rows: ProductVariantFormRow[],
  basePrice: number,
): number | null {
  const prices = rows
    .filter((r) => r.active)
    .map((r) => resolveVariantApiPrice(basePrice, r))
    .filter((p) => Number.isFinite(p));
  if (prices.length === 0) return null;
  return Math.min(...prices);
}
