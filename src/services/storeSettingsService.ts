import { buildAuthRequestHeaders } from "@/lib/api-headers";
import { normalizeStorePrimaryColor } from "@/lib/brand-store-defaults";
import { normalizeStoreCategory, type StoreCategoryCode } from "@/lib/store-categories";
import { publicApiBaseUrl as API_URL } from "@/lib/public-api";

export type PickupRow = {
  id: number;
  address: string | null;
  status: boolean;
};

export type MyStoreDetail = {
  id: number;
  ownerUserId: number;
  name: string;
  label: string | null;
  slug: string;
  phone: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  coverImageUrl: string | null;
  whatsapp: string | null;
  cellPhone: string | null;
  address: string | null;
  category: string;
  createdAt: string;
  pickups: PickupRow[];
};

export type MyStoreFormPayload = {
  name: string;
  label: string;
  phone: string;
  logoUrl: string;
  primaryColor: string;
  coverImageUrl: string;
  whatsapp: string;
  cellPhone: string;
  address: string;
  category: StoreCategoryCode;
};

export async function getMyStore(
  token: string,
  storeId: number,
): Promise<MyStoreDetail> {
  const response = await fetch(`${API_URL}/me/store`, {
    headers: buildAuthRequestHeaders({ token, storeId }),
  });
  if (!response.ok) {
    throw new Error("my_store_error");
  }
  return (await response.json()) as MyStoreDetail;
}

export async function updateMyStore(
  token: string,
  storeId: number,
  payload: MyStoreFormPayload,
): Promise<MyStoreDetail> {
  const response = await fetch(`${API_URL}/me/store`, {
    method: "PATCH",
    headers: buildAuthRequestHeaders({
      token,
      storeId,
      contentType: "application/json",
    }),
    body: JSON.stringify({
      name: payload.name.trim(),
      label: payload.label.trim(),
      phone: payload.phone.trim(),
      logoUrl: payload.logoUrl.trim(),
      primaryColor: normalizeStorePrimaryColor(payload.primaryColor),
      coverImageUrl: payload.coverImageUrl.trim(),
      whatsapp: payload.whatsapp.trim(),
      cellPhone: payload.cellPhone.trim(),
      address: payload.address.trim(),
      category: payload.category,
    }),
  });
  if (!response.ok) {
    let message = "No se pudo guardar el negocio.";
    try {
      const body = (await response.json()) as {
        message?: string;
        detail?: string;
      };
      if (body.message) message = body.message;
      else if (body.detail) message = body.detail;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return (await response.json()) as MyStoreDetail;
}
