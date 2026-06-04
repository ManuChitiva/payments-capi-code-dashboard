import type { Metadata } from "next";
import { registerPageMetadata } from "@/lib/site-seo";

export const metadata: Metadata = registerPageMetadata;

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
