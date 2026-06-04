"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchSubscriptionPlans } from "@/services/subscriptionPlanService";
import { hasAuthSession } from "@/lib/auth-session";
import { PlatformBenefitsShowcase } from "@/components/platform-benefits-showcase";
import {
  PLATFORM_BENEFITS,
  formatPlanPriceHeading,
  formatStoreLimit,
  mergePlanWithMarketing,
  type SubscriptionPlan,
} from "@/lib/subscription-plans";
import {
  brandCtaMd,
  brandEyebrow,
  brandGridOverlaySoftClass,
  brandPageBg,
  brandRadialAccent,
  brandSecondaryButton,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
  planBadgeEnterprise,
  planBadgeFree,
  planBadgePro,
  planBodyText,
  planCheckFree,
  planFootnoteText,
  planMetaText,
  planTaglineFree,
  planCardDefault,
  planCardEnterprise,
  planCardPro,
  planCheckEnterprise,
  planCheckPro,
  planCtaDefault,
  planCtaEnterprise,
  planCtaPro,
  planTaglineEnterprise,
  planTaglinePro,
  plansCtaStrip,
  plansHeroGlow,
} from "@/lib/brand-theme";

const FALLBACK_PLANS: SubscriptionPlan[] = [
  {
    id: 1,
    code: "FREE",
    name: "Gratis",
    description: "Ideal para lanzar tu primer negocio online sin costo.",
    price: 0,
    currency: "COP",
    maxProducts: null,
    maxStores: 1,
  },
  {
    id: 2,
    code: "PRO",
    name: "Profesional",
    description: "Escala tu operación con varios negocios y más capacidad.",
    price: 99000,
    currency: "COP",
    maxProducts: null,
    maxStores: 5,
  },
  {
    id: 3,
    code: "ENTERPRISE",
    name: "Empresarial",
    description:
      "Negocios ilimitados con agente de IA y bots en WhatsApp y Telegram.",
    price: 249000,
    currency: "COP",
    maxProducts: null,
    maxStores: null,
  },
];

function resolvePlanCardClass(planCode: string, highlighted: boolean) {
  if (planCode === "ENTERPRISE") return planCardEnterprise;
  if (highlighted) return planCardPro;
  return planCardDefault;
}

function resolvePlanBadgeClass(
  planCode: string,
  highlighted: boolean,
  isEnterprise: boolean,
) {
  if (isEnterprise) return planBadgeEnterprise;
  if (highlighted) return planBadgePro;
  if (planCode === "FREE") return planBadgeFree;
  return planBadgePro;
}

function resolvePlanTaglineClass(
  planCode: string,
  highlighted: boolean,
  isEnterprise: boolean,
) {
  if (isEnterprise) return planTaglineEnterprise;
  if (highlighted) return planTaglinePro;
  if (planCode === "FREE") return planTaglineFree;
  return planTaglinePro;
}

function resolvePlanCheckClass(
  planCode: string,
  highlighted: boolean,
  isEnterprise: boolean,
) {
  if (isEnterprise) return planCheckEnterprise;
  if (highlighted) return planCheckPro;
  if (planCode === "FREE") return planCheckFree;
  return planCheckPro;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(FALLBACK_PLANS);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(hasAuthSession());
  }, []);

  useEffect(() => {
    let cancelled = false;
    void fetchSubscriptionPlans()
      .then((data) => {
        if (!cancelled && data.length > 0) setPlans(data);
      })
      .catch(() => {
        /* fallback estático */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = plans.map(mergePlanWithMarketing);

  const resolveCtaHref = (planCode: string, href: string) => {
    if (planCode === "PRO" && !loggedIn) return "/register?plan=pro";
    if (planCode === "PRO" && loggedIn) return "/subscription/pro/checkout";
    return href;
  };

  return (
    <main
      className={`relative flex min-h-0 flex-1 flex-col overflow-x-hidden ${brandPageBg}`}
    >
      <div className={brandGridOverlaySoftClass} />
      <div className={plansHeroGlow} />
      <div className={brandRadialAccent} />

      <section className="relative mx-auto w-full max-w-6xl px-5 pt-14 pb-10 text-center sm:px-8 sm:pt-20">
        <p className={brandEyebrow}>Planes CapiCode</p>
        <h1
          className={`mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem] ${brandTextPrimary}`}
        >
          Vende online desde hoy.
          <span className={`mt-2 block ${brandTextSecondary}`}>
            Crece cuando tu negocio lo pida.
          </span>
        </h1>
        <p
          className={`mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg ${brandTextSecondary}`}
        >
          Registro gratuito con tu primer negocio incluido. Catálogo con variantes,
          pagos PayU, pedidos y panel administrativo — sin código de invitación.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/register" className={`px-6 py-3.5 ${brandCtaMd}`}>
            Empezar gratis
          </Link>
          <Link href="/" className={brandSecondaryButton}>
            Ya tengo cuenta
          </Link>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
        {loading ? (
          <p className={`text-center text-sm ${brandTextTertiary}`}>
            Cargando planes…
          </p>
        ) : null}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {cards.map(({ plan, marketing }) => {
            const isHighlighted = marketing.highlighted === true;
            const isEnterprise = plan.code === "ENTERPRISE";
            const cardClass = resolvePlanCardClass(plan.code, isHighlighted);
            const badgeClass = resolvePlanBadgeClass(
              plan.code,
              isHighlighted,
              isEnterprise,
            );
            const taglineClass = resolvePlanTaglineClass(
              plan.code,
              isHighlighted,
              isEnterprise,
            );
            const checkClass = resolvePlanCheckClass(
              plan.code,
              isHighlighted,
              isEnterprise,
            );
            const ctaClass = isEnterprise
              ? planCtaEnterprise
              : isHighlighted
                ? planCtaPro
                : planCtaDefault;

            return (
              <article key={plan.code} className={cardClass}>
                {marketing.badge ? (
                  <span
                    className={`absolute top-6 right-6 rounded-full border px-3 py-1 text-[10px] font-semibold tracking-wide uppercase ${badgeClass}`}
                  >
                    {marketing.badge}
                  </span>
                ) : null}
                <div className="mb-6">
                  <h2
                    className={`font-(family-name:--font-rajdhani) text-2xl font-bold ${brandTextPrimary}`}
                  >
                    {plan.name}
                  </h2>
                  <p className={`mt-1 text-sm ${taglineClass}`}>
                    {marketing.tagline}
                  </p>
                </div>
                <div className="mb-2 flex items-baseline gap-2">
                  <span
                    className={`font-(family-name:--font-rajdhani) text-4xl font-bold ${brandTextPrimary}`}
                  >
                    {formatPlanPriceHeading(plan.price, plan.currency)}
                  </span>
                  {plan.price > 0 ? (
                    <span className={`text-sm ${planBodyText}`}>/ mes</span>
                  ) : (
                    <span className={`text-sm ${planBodyText}`}>
                      / siempre
                    </span>
                  )}
                </div>
                <p className={`mb-6 text-sm font-medium ${planMetaText}`}>
                  {formatStoreLimit(plan.maxStores)}
                  {plan.maxProducts != null
                    ? ` · hasta ${plan.maxProducts} productos/negocio`
                    : " · catálogo flexible"}
                </p>
                {plan.description ? (
                  <p className={`mb-6 text-sm leading-relaxed ${planBodyText}`}>
                    {plan.description}
                  </p>
                ) : null}
                <ul className="mb-8 flex-1 space-y-3.5">
                  {marketing.features.map((feature) => (
                    <li
                      key={feature}
                      className={`flex gap-3 text-sm ${brandTextPrimary}`}
                    >
                      <span
                        className={`mt-0.5 shrink-0 ${checkClass}`}
                        aria-hidden
                      >
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {marketing.footnote ? (
                  <p className={`mb-5 text-xs leading-relaxed ${planFootnoteText}`}>
                    {marketing.footnote}
                  </p>
                ) : null}
                <Link
                  href={resolveCtaHref(plan.code, marketing.ctaHref)}
                  className={`block w-full rounded-xl py-3.5 text-center text-sm font-semibold transition ${ctaClass}`}
                >
                  {marketing.ctaLabel}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <PlatformBenefitsShowcase benefits={PLATFORM_BENEFITS} />

      <section className="relative mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className={plansCtaStrip}>
          <h2
            className={`font-(family-name:--font-rajdhani) text-2xl font-bold sm:text-3xl ${brandTextPrimary}`}
          >
            Tu primer negocio, en minutos
          </h2>
          <p className={`mx-auto mt-3 max-w-xl text-sm sm:text-base ${brandTextSecondary}`}>
            Crea tu cuenta, define el nombre del negocio y entra al panel. El
            plan Gratis incluye un negocio activo desde el registro.
          </p>
          <Link href="/register" className={`mt-8 inline-block px-8 ${brandCtaMd}`}>
            Crear cuenta gratis
          </Link>
        </div>
      </section>
    </main>
  );
}
