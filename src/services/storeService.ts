import type { AuthClientDetail, AuthStoreSummary } from "@/lib/auth-types";
import { publicApiBaseUrl as API_URL } from "@/lib/public-api";

export type CreateMyStorePayload = {
  storeName: string;
  storeLabel?: string;
  storeSlug?: string;
};

async function parseErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = (await response.json()) as {
      message?: string;
      detail?: string;
    };
    if (body.message) return body.message;
    if (body.detail) return body.detail;
  } catch {
    /* ignore */
  }
  return fallback;
}

export async function fetchClientMe(token: string): Promise<AuthClientDetail> {
  const response = await fetch(`${API_URL}/clients/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error("No se pudo cargar tu perfil.");
  }
  return (await response.json()) as AuthClientDetail;
}

export async function createMyStore(
  token: string,
  payload: CreateMyStorePayload,
): Promise<AuthStoreSummary> {
  const body: Record<string, string> = {
    storeName: payload.storeName.trim(),
  };
  if (payload.storeLabel?.trim()) {
    body.storeLabel = payload.storeLabel.trim();
  }
  if (payload.storeSlug?.trim()) {
    body.storeSlug = payload.storeSlug.trim();
  }

  const response = await fetch(`${API_URL}/me/stores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(
      await parseErrorMessage(response, "No se pudo crear la tienda."),
    );
  }

  return (await response.json()) as AuthStoreSummary;
}

export async function validateActiveStore(
  token: string,
  storeId: number,
): Promise<number> {
  const response = await fetch(`${API_URL}/clients/me/active-store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ storeId }),
  });
  if (!response.ok) {
    throw new Error("No se pudo activar la tienda seleccionada.");
  }
  const data = (await response.json()) as { storeId: number };
  return data.storeId;
}
