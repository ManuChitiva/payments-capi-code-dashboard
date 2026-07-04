import type { Metadata } from "next";
import { plansPageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = plansPageMetadata;

export default function PlansLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
