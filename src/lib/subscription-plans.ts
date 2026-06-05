export type SubscriptionPlan = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  maxProducts: number | null;
  maxStores: number | null;
  /** true para PRO y ENTERPRISE (pago PayU en línea). */
  purchasable: boolean;
};

export type PlanMarketing = {
  tagline: string;
  badge?: string;
  highlighted?: boolean;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  footnote?: string;
};

export const PLAN_MARKETING: Record<string, PlanMarketing> = {
  FREE: {
    tagline: "1 negocio · hasta 15 productos",
    badge: "Incluido al registrarte",
    features: [
      "1 negocio (1 tienda) por cuenta",
      "Hasta 15 productos en ese negocio",
      "Catálogo con variantes e imágenes",
      "Checkout y pagos PayU configurables",
      "Panel de pedidos y analytics básicos",
      "Puntos de atención y personalización de marca",
      "Soporte por correo en horario laboral",
    ],
    ctaLabel: "Crear cuenta gratis",
    ctaHref: "/register",
    footnote: "Sin código de invitación. Tu primer negocio queda activo al registrarte.",
  },
  PRO: {
    tagline: "Para quienes venden en serio",
    badge: "Más popular",
    highlighted: true,
    features: [
      "Hasta 10 negocios bajo una misma cuenta",
      "Hasta 150 productos por cada negocio",
      "Todo lo del plan Gratis en cada negocio",
      "Múltiples métodos PayU y reportes ampliados",
      "Prioridad en nuevas funciones del panel",
      "Acompañamiento en migración de catálogo",
    ],
    ctaLabel: "Comprar plan PRO",
    ctaHref: "/subscription/pro/checkout",
    footnote: "Pago seguro con PayU. Tras aprobarse, tu cuenta pasa a PRO al instante.",
  },
  ENTERPRISE: {
    tagline: "Automatiza ventas con IA",
    badge: "Hasta 200 negocios",
    features: [
      "Hasta 200 negocios bajo una sola cuenta",
      "Hasta 500 productos por cada negocio",
      "Agente de IA para atención, ventas y seguimiento 24/7",
      "Bot de WhatsApp conectado a tu catálogo y pedidos",
      "Bot de Telegram para consultas, carrito y notificaciones",
      "Todo lo del plan Profesional en cada negocio",
      "Onboarding dedicado y soporte prioritario",
    ],
    ctaLabel: "Comprar plan Empresarial",
    ctaHref: "/subscription/enterprise/checkout",
    footnote: "Pago seguro con PayU. Tras aprobarse, tu cuenta pasa a Empresarial al instante.",
  },
};

export type PlatformBenefitVisual =
  | "brand"
  | "payments"
  | "operations"
  | "ai"
  | "scale";

export type PlatformBenefit = {
  label: string;
  headline: string;
  description: string;
  visual: PlatformBenefitVisual;
};

export const PLATFORM_BENEFITS: PlatformBenefit[] = [
  {
    label: "Marca",
    headline: "Tu negocio, con identidad propia.",
    description:
      "Logo, colores, slug propio y catálogo con variantes e imágenes por SKU. Todo desde un panel claro.",
    visual: "brand",
  },
  {
    label: "Pagos",
    headline: "Cobra en línea con PayU.",
    description:
      "Integración de checkout y webhooks para confirmar pagos. Sandbox para probar antes de producción.",
    visual: "payments",
  },
  {
    label: "Operación",
    headline: "Pedidos y métricas en un solo lugar.",
    description:
      "Pedidos, ingresos, puntos de atención y analytics por negocio. Cambia de contexto con un selector cuando crezcas.",
    visual: "operations",
  },
  {
    label: "Automatización",
    headline: "IA y bots que venden por ti.",
    description:
      "Con el plan Empresarial despliega un agente de IA y bots en WhatsApp y Telegram para vender y atender clientes sin fricción.",
    visual: "ai",
  },
  {
    label: "Escala",
    headline: "Crece cuando tu negocio lo pida.",
    description:
      "Empieza gratis con un negocio. Escala a Profesional o Empresarial cuando necesites más negocios, IA o automatización.",
    visual: "scale",
  },
];

/** Precio destacado en tarjeta (evita repetir el nombre del plan cuando es $0). */
export function formatPlanPriceHeading(price: number, currency: string): string {
  if (price <= 0) return "Sin costo";
  return formatPlanPrice(price, currency);
}

export function formatPlanPrice(price: number, currency: string): string {
  if (price <= 0) return "Gratis";
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${price} ${currency}`;
  }
}

export function formatStoreLimit(maxStores: number | null): string {
  if (maxStores == null) return "Negocios ilimitados";
  if (maxStores === 1) return "1 negocio";
  return `Hasta ${maxStores} negocios`;
}

/** Resumen corto de límites para tarjetas y panel (datos del API). */
export function formatPlanLimitsSummary(
  maxStores: number | null,
  maxProducts: number | null,
): string {
  const stores = formatStoreLimit(maxStores);
  if (maxProducts == null) return stores;
  if (maxStores === 1) {
    return `${stores} · hasta ${maxProducts} productos`;
  }
  return `${stores} · hasta ${maxProducts} productos por negocio`;
}

export function mergePlanWithMarketing(plan: SubscriptionPlan) {
  const marketing = PLAN_MARKETING[plan.code] ?? {
    tagline: plan.description ?? plan.name,
    features: [
      formatStoreLimit(plan.maxStores),
      plan.maxProducts != null
        ? `Hasta ${plan.maxProducts} productos por negocio`
        : "Productos sin límite fijo",
    ],
    ctaLabel: plan.code === "FREE" ? "Crear cuenta" : "Más información",
    ctaHref: plan.code === "FREE" ? "/register" : "/register",
  };
  return { plan, marketing };
}
