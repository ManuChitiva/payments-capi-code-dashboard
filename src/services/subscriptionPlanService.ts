import type { SubscriptionPlan } from "@/lib/subscription-plans";
import { publicApiBaseUrl } from "@/lib/public-api";

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const response = await fetch(`${publicApiBaseUrl}/subscription-plans`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("failed_to_load_plans");
  }
  return (await response.json()) as SubscriptionPlan[];
}
