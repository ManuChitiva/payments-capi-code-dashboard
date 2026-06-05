"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SectionHeader } from "@/components/dashboard/section-header";
import { formatCopCurrency } from "@/lib/dashboard/format";
import {
  PLAN_MARKETING,
  formatPlanPrice,
  formatStoreLimit,
  type SubscriptionPlan,
} from "@/lib/subscription-plans";
import {
  brandAlertErrorInline,
  brandCtaMd,
  brandDashboardPanel,
  brandInsetBox,
  brandLinkAccent,
  brandSecondaryButton,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
  dashboardNotice,
  dashboardStatusBadge,
  planCardPro,
  planCheckFree,
  planCheckPro,
  planTaglinePro,
  subscriptionBannerEnterprise,
  subscriptionBannerFree,
  subscriptionBannerPro,
  subscriptionEnterpriseCta,
} from "@/lib/brand-theme";
import { fetchSubscriptionPlans } from "@/services/subscriptionPlanService";
import {
  fetchMySubscription,
  fetchMySubscriptionPayments,
  type MySubscription,
  type SubscriptionPaymentItem,
} from "@/services/subscriptionService";

type DashboardSubscriptionSectionProps = {
  title: string;
  description: string;
};

function formatSubscriptionDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function paymentStatusLabel(status: string): string {
  switch (status) {
    case "APPROVED":
      return "Aprobado";
    case "PENDING":
      return "Pendiente";
    case "REJECTED":
      return "Rechazado";
    case "FAILED":
      return "Fallido";
    default:
      return status;
  }
}

function ProUpgradeHero({
  proPlan,
}: {
  proPlan: SubscriptionPlan | undefined;
}) {
  const marketing = PLAN_MARKETING.PRO;
  const priceLabel = proPlan
    ? `${formatPlanPrice(proPlan.price, proPlan.currency)}/mes`
    : `${formatPlanPrice(99000, "COP")}/mes`;

  return (
    <article className={`mb-6 p-6 sm:p-8 ${planCardPro}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-semibold tracking-wide uppercase ${planTaglinePro}`}>
            {marketing.badge ?? "Recomendado"}
          </p>
          <h3
            className={`font-(family-name:--font-rajdhani) mt-2 text-2xl font-bold sm:text-3xl ${brandTextPrimary}`}
          >
            Escala con plan Profesional
          </h3>
          <p className={`mt-2 max-w-xl text-sm ${brandTextSecondary}`}>
            {marketing.tagline}. Pago seguro con PayU; al aprobarse tu cuenta pasa a PRO al
            instante.
          </p>
          <p className={`mt-3 text-lg font-semibold ${brandTextPrimary}`}>{priceLabel}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {marketing.features.slice(0, 4).map((feature) => (
              <li key={feature} className={`flex gap-2 text-sm ${brandTextSecondary}`}>
                <span className={planCheckPro} aria-hidden>
                  ✓
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:min-w-[12rem]">
          <Link href="/subscription/pro/checkout" className={`px-6 py-3.5 text-center ${brandCtaMd}`}>
            Comprar plan PRO
          </Link>
          <Link href="/plans" className={`text-center text-sm ${brandLinkAccent}`}>
            Comparar con Empresarial
          </Link>
        </div>
      </div>
    </article>
  );
}

export function DashboardSubscriptionSection({
  title,
  description,
}: DashboardSubscriptionSectionProps) {
  const [subscription, setSubscription] = useState<MySubscription | null>(null);
  const [catalogPlans, setCatalogPlans] = useState<SubscriptionPlan[]>([]);
  const [payments, setPayments] = useState<SubscriptionPaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token) {
      setLoading(false);
      setError("Inicia sesión para ver tu suscripción.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const [sub, plans] = await Promise.all([
        fetchMySubscription(token),
        fetchSubscriptionPlans().catch(() => [] as SubscriptionPlan[]),
      ]);
      setSubscription(sub);
      setCatalogPlans(plans);
      try {
        const history = await fetchMySubscriptionPayments(token);
        setPayments(history);
      } catch {
        setPayments([]);
      }
    } catch {
      setSubscription(null);
      setPayments([]);
      setError("No se pudo cargar tu suscripción. Reintenta en unos segundos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <>
        <SectionHeader title={title} description={description} />
        <p className={`text-sm ${brandTextSecondary}`}>Cargando suscripción…</p>
      </>
    );
  }

  if (!subscription) {
    return (
      <>
        <SectionHeader title={title} description={description} />
        <article className={`p-6 sm:p-8 ${brandDashboardPanel}`}>
          <p className={brandAlertErrorInline}>
            {error || "No se pudo cargar la información del plan."}
          </p>
          <button type="button" onClick={() => void load()} className={`mt-4 ${brandCtaMd}`}>
            Reintentar
          </button>
        </article>
      </>
    );
  }

  const isPro = subscription.planCode === "PRO";
  const isEnterprise = subscription.planCode === "ENTERPRISE";
  const isFree = subscription.planCode === "FREE";
  const proCatalogPlan = catalogPlans.find((p) => p.code === "PRO");
  const marketing = PLAN_MARKETING[subscription.planCode];
  const bannerClass = isEnterprise
    ? subscriptionBannerEnterprise
    : isPro
      ? subscriptionBannerPro
      : subscriptionBannerFree;
  const checkClass = isEnterprise ? planCheckPro : isPro ? planCheckPro : planCheckFree;
  const storeLimitLabel = formatStoreLimit(subscription.maxStores);
  const usageLabel =
    subscription.maxStores == null
      ? `${subscription.currentStoreCount} negocios · sin límite fijo`
      : `${subscription.currentStoreCount} de ${subscription.maxStores} negocios`;

  return (
    <>
      <SectionHeader title={title} description={description} />

      {isFree ? <ProUpgradeHero proPlan={proCatalogPlan} /> : null}

      {isPro ? (
        <article className={`mb-6 p-6 sm:p-8 ${brandDashboardPanel}`}>
          <p className={`text-xs font-semibold uppercase ${brandTextTertiary}`}>
            Siguiente nivel
          </p>
          <h3 className={`mt-1 text-lg font-semibold ${brandTextPrimary}`}>
            Plan Empresarial
          </h3>
          <p className={`mt-2 text-sm ${brandTextSecondary}`}>
            {PLAN_MARKETING.ENTERPRISE.tagline}. Negocios ilimitados, IA y bots en WhatsApp y
            Telegram.
          </p>
          <Link
            href="mailto:soporte@capicode.com?subject=Plan%20Empresarial%20CapiCode"
            className={`mt-4 inline-block ${subscriptionEnterpriseCta}`}
          >
            Hablar con ventas
          </Link>
        </article>
      ) : null}

      <article
        className={`mb-6 rounded-2xl border p-5 backdrop-blur sm:p-6 ${bannerClass}`}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className={`text-xs font-semibold tracking-wide uppercase ${brandTextTertiary}`}>
              Tu plan actual · {subscription.status}
            </p>
            <h3
              className={`font-(family-name:--font-rajdhani) mt-1 text-2xl font-bold ${brandTextPrimary}`}
            >
              {subscription.planName}
            </h3>
            <p className={`mt-1 text-sm ${brandTextSecondary}`}>
              {storeLimitLabel}
              {subscription.planPrice > 0
                ? ` · ${formatCopCurrency(subscription.planPrice)}/mes`
                : " · incluido al registrarte, sin costo mensual"}
            </p>
            {subscription.planDescription ? (
              <p className={`mt-2 max-w-2xl text-sm ${brandTextTertiary}`}>
                {subscription.planDescription}
              </p>
            ) : null}
            <p className={`mt-3 text-xs ${brandTextTertiary}`}>
              Activo desde {formatSubscriptionDate(subscription.startedAt)}
              {subscription.expiresAt
                ? ` · vence ${formatSubscriptionDate(subscription.expiresAt)}`
                : ""}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            {subscription.canUpgradeToPro ? (
              <Link
                href="/subscription/pro/checkout"
                className={`px-5 py-3 text-center ${brandCtaMd}`}
              >
                Comprar plan PRO
              </Link>
            ) : isEnterprise ? (
              <span className={dashboardStatusBadge}>Plan máximo activo</span>
            ) : null}
          </div>
        </div>
      </article>

      <section className="mb-6 grid gap-4 sm:grid-cols-2">
        <article className={`p-5 ${brandDashboardPanel}`}>
          <h4 className={`text-sm font-medium ${brandTextSecondary}`}>Uso de negocios</h4>
          <p className={`mt-2 text-xl font-semibold ${brandTextPrimary}`}>{usageLabel}</p>
          {!subscription.canCreateMoreStores && subscription.maxStores != null ? (
            <p className={`mt-2 text-xs ${brandTextTertiary}`}>
              Alcanzaste el límite de tu plan.{" "}
              <Link href="/subscription/pro/checkout" className={brandLinkAccent}>
                Pasa a PRO
              </Link>{" "}
              para añadir más negocios.
            </p>
          ) : (
            <p className={`mt-2 text-xs ${brandTextTertiary}`}>
              Puedes crear más negocios desde el menú lateral.
            </p>
          )}
        </article>
        <article className={`p-5 ${brandDashboardPanel}`}>
          <h4 className={`text-sm font-medium ${brandTextSecondary}`}>Productos por negocio</h4>
          <p className={`mt-2 text-xl font-semibold ${brandTextPrimary}`}>
            {subscription.maxProducts == null
              ? "Sin límite fijo"
              : `Hasta ${subscription.maxProducts}`}
          </p>
        </article>
      </section>

      {marketing ? (
        <article className={`mb-6 p-5 sm:p-6 ${brandDashboardPanel}`}>
          <h4 className={`text-sm font-medium ${brandTextSecondary}`}>
            Incluido en tu plan
          </h4>
          <p className={`mt-1 text-sm ${brandTextTertiary}`}>{marketing.tagline}</p>
          <ul className="mt-4 space-y-2 text-sm">
            {marketing.features.map((feature) => (
              <li key={feature} className={`flex gap-2 ${brandTextSecondary}`}>
                <span className={checkClass} aria-hidden>
                  ✓
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </article>
      ) : null}

      {isFree ? (
        <section className="mb-6">
          <h4 className={`mb-3 text-sm font-medium ${brandTextSecondary}`}>
            También disponible
          </h4>
          <article className={`p-5 ${brandDashboardPanel}`}>
            <p className={`text-xs font-semibold uppercase ${brandTextTertiary}`}>
              {PLAN_MARKETING.ENTERPRISE.badge}
            </p>
            <h5 className={`mt-1 text-lg font-semibold ${brandTextPrimary}`}>Empresarial</h5>
            <p className={`mt-1 text-sm ${brandTextSecondary}`}>
              {PLAN_MARKETING.ENTERPRISE.tagline}
            </p>
            <Link
              href={PLAN_MARKETING.ENTERPRISE.ctaHref}
              className={`mt-4 inline-block ${brandSecondaryButton}`}
            >
              {PLAN_MARKETING.ENTERPRISE.ctaLabel}
            </Link>
          </article>
        </section>
      ) : null}

      <article className={`p-5 sm:p-6 ${brandDashboardPanel}`}>
        <h4 className={`text-sm font-medium ${brandTextSecondary}`}>
          Historial de pagos del plan
        </h4>
        <p className={`mt-1 text-xs ${brandTextTertiary}`}>
          Intentos de pago para suscripción de plataforma (PayU).
        </p>
        {payments.length === 0 ? (
          <p className={`mt-4 text-sm ${brandTextTertiary}`}>
            {isFree
              ? "Sin pagos en el plan gratuito."
              : "Aún no hay pagos registrados."}
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {payments.map((payment) => (
              <li key={payment.id} className={brandInsetBox}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className={`font-medium ${brandTextPrimary}`}>{payment.planName}</p>
                    <p className={`text-xs ${brandTextTertiary}`}>
                      {payment.referenceCode} ·{" "}
                      {formatSubscriptionDate(payment.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${brandTextPrimary}`}>
                      {formatPlanPrice(payment.amount, payment.currency)}
                    </p>
                    <span className={dashboardStatusBadge}>
                      {paymentStatusLabel(payment.status)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {isFree ? (
          <p className={`mt-4 ${dashboardNotice}`}>
            ¿Vendes en serio?{" "}
            <Link href="/subscription/pro/checkout" className={brandLinkAccent}>
              Comprar plan PRO ahora
            </Link>
            .
          </p>
        ) : null}
      </article>
    </>
  );
}
