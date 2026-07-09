
import { buildAuthRequestHeaders } from "@/lib/api-headers";
import { publicApiBaseUrl as API_URL } from "@/lib/public-api";

/** Empleado del negocio activo. */
export type PersonalMember = {
  id: number;
  name: string;
  phone: string | null;
  whatsapp: string | null;
  photoUrl: string | null;
  active: boolean;
  sortOrder: number;
};

export type PersonalCreatePayload = {
  name: string;
  phone: string | null;
  whatsapp: string | null;
  photoUrl: string | null;
  active: boolean;
  sortOrder: number;
};

export type PersonalUpdatePayload = {
  name?: string;
  phone?: string | null;
  whatsapp?: string | null;
  photoUrl?: string | null;
  active?: boolean;
  sortOrder?: number;
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

/** Sube una foto de perfil y devuelve la URL final. */
export async function uploadPersonalPhoto(
  token: string,
  storeId: number,
  file: File,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${API_URL}/me/media/upload`, {
    method: "POST",
    headers: buildAuthRequestHeaders({
      token,
      storeId,
      requireStore: true,
    }),
    body: formData,
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response) ?? "personal_photo_upload_error");
  }
  const payload = (await response.json()) as { fileUrl?: string };
  const url = typeof payload?.fileUrl === "string" ? payload.fileUrl.trim() : "";
  if (url.length === 0) {
    throw new Error("El servidor no devolvio la URL de la imagen.");
  }
  return url;
}

/** GET /me/personal — lista del personal del negocio activo. */
export async function listMyPersonal(
  token: string,
  storeId: number,
): Promise<PersonalMember[]> {
  const response = await fetch(`${API_URL}/me/personal`, {
    headers: storeHeaders(token, storeId),
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response) ?? "personal_list_error");
  }
  return (await response.json()) as PersonalMember[];
}

/**
 * Crea varios empleados en una sola llamada. La foto se sube antes y se
 * envía la URL resultante en el payload — evita multipart mezclado y
 * permite reusar el endpoint si más adelante agregamos edición por lote.
 */
export async function createMyPersonalBatch(
  token: string,
  storeId: number,
  payload: PersonalCreatePayload[],
): Promise<PersonalMember[]> {
  const response = await fetch(`${API_URL}/me/personal/batch`, {
    method: "POST",
    headers: jsonStoreHeaders(token, storeId),
    body: JSON.stringify({ items: payload }),
  });
  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response) ?? "personal_create_error",
    );
  }
  return (await response.json()) as PersonalMember[];
}

export async function updateMyPersonal(
  token: string,
  storeId: number,
  personalId: number,
  payload: PersonalUpdatePayload,
): Promise<PersonalMember> {
  const response = await fetch(`${API_URL}/me/personal/${personalId}`, {
    method: "PATCH",
    headers: jsonStoreHeaders(token, storeId),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response) ?? "personal_update_error",
    );
  }
  return (await response.json()) as PersonalMember;
}

export async function deleteMyPersonal(
  token: string,
  storeId: number,
  personalId: number,
): Promise<void> {
  const response = await fetch(`${API_URL}/me/personal/${personalId}`, {
    method: "DELETE",
    headers: storeHeaders(token, storeId),
  });
  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response) ?? "personal_delete_error",
    );
  }
}