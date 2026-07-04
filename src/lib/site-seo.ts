import type { Metadata } from "next";

export const SITE_NAME = "CapiCode";
export const SITE_TAGLINE = "Gestión de negocios online";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://capicode.com";

export const DEFAULT_DESCRIPTION =
  "CapiCode es el panel para gestionar catálogo, inventario, pedidos y métricas de tu negocio online. Operaciones de retail en tiempo real con acceso seguro.";

const SITE_KEYWORDS = [
  "CapiCode",
  "gestión de negocios online",
  "panel administrativo ecommerce",
  "catálogo de productos",
  "inventario retail",
  "administración de negocio virtual",
];

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    alternateLocale: ["es_ES", "es"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "business",
};

type PageMetadataOptions = {
  title: string | { absolute: string };
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function createPageMetadata(options: PageMetadataOptions): Metadata {
  const canonicalPath = options.path ?? "/";
  const canonicalUrl = `${SITE_URL}${canonicalPath === "/" ? "" : canonicalPath}`;
  const titleString =
    typeof options.title === "string" ? options.title : options.title.absolute;

  return {
    title: options.title,
    description: options.description,
    keywords: options.keywords ?? SITE_KEYWORDS,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: titleString.includes(SITE_NAME)
        ? titleString
        : `${titleString} | ${SITE_NAME}`,
      description: options.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "es_CO",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: titleString.includes(SITE_NAME)
        ? titleString
        : `${titleString} | ${SITE_NAME}`,
      description: options.description,
    },
    robots: options.noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : undefined,
  };
}

export const homePageMetadata = createPageMetadata({
  title: {
    absolute: `${SITE_NAME} — Panel de ${SITE_TAGLINE.toLowerCase()}`,
  },
  description:
    "Inicia sesión en CapiCode y administra catálogo, stock, pedidos y analítica de tu negocio desde un panel seguro. Plataforma de gestión comercial para equipos de retail.",
  path: "/",
  keywords: [
    ...SITE_KEYWORDS,
    "iniciar sesión CapiCode",
    "login panel negocio",
    "software gestión comercial",
  ],
});

export const registerPageMetadata = createPageMetadata({
  title: "Crear cuenta",
  description:
    "Regístrate en CapiCode y configura tu negocio online: catálogo, variantes, inventario y panel administrativo para tu equipo de retail.",
  path: "/register",
  keywords: [
    ...SITE_KEYWORDS,
    "registro CapiCode",
    "crear negocio online",
    "alta panel administrativo",
  ],
});

export const plansPageMetadata = createPageMetadata({
  title: "Planes y precios",
  description:
    "Conoce los planes CapiCode: Free, Pro y Enterprise. Funciones de catálogo, analítica, pagos y soporte para escalar tu operación comercial.",
  path: "/plans",
  keywords: [
    ...SITE_KEYWORDS,
    "planes CapiCode",
    "precios ecommerce",
    "suscripción negocio online",
  ],
});

export const dashboardPageMetadata = createPageMetadata({
  title: "Panel administrativo",
  description: "Área privada de gestión de tu negocio en CapiCode.",
  path: "/dashboard",
  noIndex: true,
});

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_TAGLINE,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "es",
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "soporte@capicode.com",
      availableLanguage: ["Spanish"],
    },
  };
}

export function buildSoftwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "COP",
      description: "Plan Free disponible en capicode.com/plans",
    },
    featureList: [
      "Catálogo centralizado con variantes",
      "Inventario y operaciones en tiempo real",
      "Analítica de interacciones de clientes",
      "Acceso seguro por cuenta de administrador",
    ],
  };
}

export const PUBLIC_SITEMAP_PATHS = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/register", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/plans", changeFrequency: "weekly" as const, priority: 0.9 },
];
