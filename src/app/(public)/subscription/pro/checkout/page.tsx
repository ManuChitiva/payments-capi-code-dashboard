"use client";

import { SubscriptionCheckoutFlow } from "@/components/subscription/subscription-checkout-flow";

export default function ProSubscriptionCheckoutPage() {
  return (
    <SubscriptionCheckoutFlow
      planCode="PRO"
      planTitle="Plan Profesional"
      registerPlanQuery="pro"
    />
  );
}
