import { publicApiBaseUrl } from "@/lib/public-api";
import {
  FALLBACK_STORE_CATEGORIES,
  type StoreCategoryOption,
} from "@/lib/store-categories";

export async function fetchStoreCategories(): Promise<StoreCategoryOption[]> {
  const response = await fetch(`${publicApiBaseUrl}/store-categories`, {
    cache: "force-cache",
  });
  if (!response.ok) {
    return FALLBACK_STORE_CATEGORIES;
  }
  return (await response.json()) as StoreCategoryOption[];
}
