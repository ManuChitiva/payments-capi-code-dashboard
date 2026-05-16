import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteNavbar />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <SiteFooter />
    </>
  );
}
