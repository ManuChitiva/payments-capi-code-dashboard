import type { AuthLoginResponse } from "@/lib/auth-types";

export function persistAuthSession(data: AuthLoginResponse): void {
  window.localStorage.setItem("stores_admin_token", data.token);
  window.localStorage.setItem(
    "stores_admin_client",
    JSON.stringify(data.client),
  );
  if (data.client.activeStoreId) {
    window.localStorage.setItem(
      "stores_admin_active_store_id",
      String(data.client.activeStoreId),
    );
  } else {
    window.localStorage.removeItem("stores_admin_active_store_id");
  }
}
