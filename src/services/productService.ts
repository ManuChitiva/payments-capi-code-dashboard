import { buildAuthRequestHeaders } from "@/lib/api-headers";
import { publicApiBaseUrl as API_URL } from "@/lib/public-api";
import type { CatalogProduct, ProductStatus } from "@/components/dashboard/products-table";

type ProductApiRow = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  active: boolean;
  availableQuantity: number;
  createdAt: string;
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

function mapProductRow(item: ProductApiRow): CatalogProduct {
  const status: ProductStatus = item.active
    ? item.availableQuantity > 0
      ? "activo"
      : "agotado"
    : "inactivo";

  return {
    id: item.id,
    sku: `PRD-${item.id}`,
    name: item.name,
    description: item.description ?? "",
    category: "General",
    price: Number(item.price),
    imageUrl: item.imageUrl ?? "",
    stock: item.availableQuantity,
    status,
    active: item.active,
    updatedAt: new Date(item.createdAt).toISOString().slice(0, 10),
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
