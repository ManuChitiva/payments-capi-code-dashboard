const TOKEN_KEY = "stores_admin_token";
const ACTIVE_STORE_KEY = "stores_admin_active_store_id";

export const ACTIVE_STORE_HEADER = "x-store-id";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredActiveStoreId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ACTIVE_STORE_KEY);
  if (!raw) return null;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

export type AuthRequestHeadersOptions = {
  token?: string;
  storeId?: number | null;
  contentType?: string;
  requireStore?: boolean;
};

/** Headers para rutas autenticadas; incluye {@code x-store-id} cuando hay negocio activo. */
export function buildAuthRequestHeaders(
  options: AuthRequestHeadersOptions = {},
): Record<string, string> {
  const token = options.token ?? getStoredToken();
  if (!token) {
    throw new Error("missing_auth_token");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (options.contentType) {
    headers["Content-Type"] = options.contentType;
  }

  const storeId = options.storeId ?? getStoredActiveStoreId();
  if (storeId != null) {
    headers[ACTIVE_STORE_HEADER] = String(storeId);
  } else if (options.requireStore) {
    throw new Error("missing_active_store");
  }

  return headers;
}
