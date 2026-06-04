import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = createPageMetadata({
  title: "Suscripción",
  description: "Flujo de suscripción y pago de planes CapiCode.",
  path: "/subscription",
  noIndex: true,
});

export default function SubscriptionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
