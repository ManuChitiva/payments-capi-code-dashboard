import { buildAuthRequestHeaders } from "@/lib/api-headers";
import { publicApiBaseUrl as API_URL } from "@/lib/public-api";

export type PickupPoint = {
  id: number;
  address: string | null;
  status: boolean;
};

function storeHeaders(token: string, storeId: number): HeadersInit {
  return buildAuthRequestHeaders({ token, storeId });
}

function jsonStoreHeaders(token: string, storeId: number): HeadersInit {
  return buildAuthRequestHeaders({
    token,
    storeId,
    contentType: "application/json",
  });
}

export async function listMyPickups(
  token: string,
  storeId: number,
): Promise<PickupPoint[]> {
  const response = await fetch(`${API_URL}/me/store/pickups`, {
    headers: storeHeaders(token, storeId),
  });
  if (!response.ok) {
    throw new Error("pickups_list_error");
  }
  return (await response.json()) as PickupPoint[];
}

export async function createPickup(
  token: string,
  storeId: number,
  payload: { address: string; status?: boolean },
): Promise<PickupPoint> {
  const response = await fetch(`${API_URL}/me/store/pickups`, {
    method: "POST",
    headers: jsonStoreHeaders(token, storeId),
    body: JSON.stringify({
      address: payload.address.trim(),
      status: payload.status ?? true,
    }),
  });
  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message ?? "pickups_create_error");
  }
  return (await response.json()) as PickupPoint;
}

export async function updatePickup(
  token: string,
  storeId: number,
  pickupId: number,
  payload: { address?: string; status?: boolean },
): Promise<PickupPoint> {
  const body: Record<string, string | boolean> = {};
  if (payload.address !== undefined) body.address = payload.address;
  if (payload.status !== undefined) body.status = payload.status;

  const response = await fetch(`${API_URL}/me/store/pickups/${pickupId}`, {
    method: "PATCH",
    headers: jsonStoreHeaders(token, storeId),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message ?? "pickups_update_error");
  }
  return (await response.json()) as PickupPoint;
}

export async function deletePickup(
  token: string,
  storeId: number,
  pickupId: number,
): Promise<void> {
  const response = await fetch(`${API_URL}/me/store/pickups/${pickupId}`, {
    method: "DELETE",
    headers: storeHeaders(token, storeId),
  });
  if (!response.ok) {
    const message = await readErrorMessage(response);
    throw new Error(message ?? "pickups_delete_error");
  }
}

async function readErrorMessage(response: Response): Promise<string | null> {
  try {
    const data = (await response.json()) as {
      message?: string;
      detail?: string;
    };
    return data.message ?? data.detail ?? null;
  } catch {
    return null;
  }
}
