"use client";

import { SubscriptionCheckoutFlow } from "@/components/subscription/subscription-checkout-flow";

export default function EnterpriseSubscriptionCheckoutPage() {
  return (
    <SubscriptionCheckoutFlow
      planCode="ENTERPRISE"
      planTitle="Plan Empresarial"
      registerPlanQuery="enterprise"
    />
  );
}
