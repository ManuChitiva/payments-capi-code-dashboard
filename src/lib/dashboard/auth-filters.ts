import type { AuthFilters } from "@/services/payuPaymentMethodService";
import type { ClientDetail } from "@/types/dashboard";

export function buildAuthFilters(
  client: ClientDetail,
  storeId: number | null | undefined,
): AuthFilters {
  return {
    userId: client.id,
    clientId: client.id,
    storeId: storeId ?? undefined,
  };
}
