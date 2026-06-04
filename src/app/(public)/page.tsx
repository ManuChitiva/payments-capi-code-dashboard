import { JsonLd } from "@/components/json-ld";
import { LoginPage } from "@/components/login-page";
import {
  buildOrganizationJsonLd,
  buildSoftwareApplicationJsonLd,
  buildWebSiteJsonLd,
  homePageMetadata,
} from "@/lib/site-seo";

export const metadata = homePageMetadata;

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebSiteJsonLd(),
          buildOrganizationJsonLd(),
          buildSoftwareApplicationJsonLd(),
        ]}
      />
      <LoginPage />
    </>
  );
}
