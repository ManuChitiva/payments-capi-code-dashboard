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
  whatsapp: string | null;
  cellPhone: string | null;
  address: string | null;
  createdAt: string;
  pickups: PickupRow[];
};

export type MyStoreFormPayload = {
  name: string;
  label: string;
  phone: string;
  logoUrl: string;
  whatsapp: string;
  cellPhone: string;
  address: string;
};

export async function getMyStore(
  token: string,
  storeId: number,
): Promise<MyStoreDetail> {
  const response = await fetch(`${API_URL}/me/store`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-store-id": String(storeId),
    },
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
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "x-store-id": String(storeId),
    },
    body: JSON.stringify({
      name: payload.name.trim(),
      label: payload.label.trim(),
      phone: payload.phone.trim(),
      logoUrl: payload.logoUrl.trim(),
      whatsapp: payload.whatsapp.trim(),
      cellPhone: payload.cellPhone.trim(),
      address: payload.address.trim(),
    }),
  });
  if (!response.ok) {
    let message = "No se pudo guardar la tienda.";
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
