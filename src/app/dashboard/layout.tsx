import type { Metadata } from "next";
import { dashboardPageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = dashboardPageMetadata;

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
