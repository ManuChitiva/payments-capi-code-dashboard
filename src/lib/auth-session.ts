import type { AuthLoginResponse } from "@/lib/auth-types";

const TOKEN_KEY = "stores_admin_token";
const CLIENT_KEY = "stores_admin_client";
const ACTIVE_STORE_KEY = "stores_admin_active_store_id";

export function hasAuthSession(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(window.localStorage.getItem(TOKEN_KEY));
}

export function getStoredClientName(): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CLIENT_KEY);
  if (!raw) return null;
  try {
    const client = JSON.parse(raw) as { name?: string };
    return client.name?.trim() || null;
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(CLIENT_KEY);
  window.localStorage.removeItem(ACTIVE_STORE_KEY);
}

export function persistAuthSession(data: AuthLoginResponse): void {
  window.localStorage.setItem(TOKEN_KEY, data.token);
  window.localStorage.setItem(CLIENT_KEY, JSON.stringify(data.client));
  if (data.client.activeStoreId) {
    window.localStorage.setItem(
      ACTIVE_STORE_KEY,
      String(data.client.activeStoreId),
    );
  } else {
    window.localStorage.removeItem(ACTIVE_STORE_KEY);
  }
}
