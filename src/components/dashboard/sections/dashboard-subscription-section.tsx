"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SectionHeader } from "@/components/dashboard/section-header";
import { formatCopCurrency } from "@/lib/dashboard/format";
import {
  PLAN_MARKETING,
  formatPlanLimitsSummary,
  formatPlanPrice,
  type PlanMarketing,
  type SubscriptionPlan,
} from "@/lib/subscription-plans";
import {
  brandAlertErrorInline,
  brandCtaMd,
  brandDashboardPanel,
  brandSecondaryButton,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
  dashboardStatusBadge,
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

type PlanCode = "FREE" | "PRO" | "ENTERPRISE";

const PLAN_ACCENT: Record<
  PlanCode,
  {
    pill: string;
    ring: string;
    glow: string;
    badge: string;
  }
> = {
  FREE: {
    pill: "border-brand-separator bg-brand-hover text-brand-secondary",
    ring: "ring-brand-separator",
    glow: "",
    badge: "bg-brand-hover text-brand-secondary",
  },
  PRO: {
    pill: "border-[#0071e3]/30 bg-[#0071e3]/10 text-[#004a99] dark:border-[#2997ff]/35 dark:bg-[#2997ff]/15 dark:text-[#7ec8ff]",
    ring: "ring-[#0071e3]/30 dark:ring-[#2997ff]/35",
    glow: "shadow-[0_18px_48px_-12px_rgba(0,113,227,0.22)] dark:shadow-[0_0_0_1px_rgba(41,151,255,0.18),0_22px_56px_-14px_rgba(0,0,0,0.65)]",
    badge: "bg-[#0071e3] text-white dark:bg-[#0071e3]",
  },
  ENTERPRISE: {
    pill: "border-[#5e5ce6]/30 bg-[#5e5ce6]/10 text-[#4240a8] dark:border-[#a8a6f0]/40 dark:bg-[#5e5ce6]/20 dark:text-[#a8a6f0]",
    ring: "ring-[#5e5ce6]/30 dark:ring-[#a8a6f0]/30",
    glow: "shadow-[0_18px_48px_-12px_rgba(94,92,230,0.24)] dark:shadow-[0_0_0_1px_rgba(167,139,250,0.2),0_22px_56px_-14px_rgba(0,0,0,0.65)]",
    badge: "bg-[#5e5ce6] text-white",
  },
};

function formatSubscriptionDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(
      new Date(iso),
    );
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

function paymentStatusTone(status: string): string {
  switch (status) {
    case "APPROVED":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-500/15 dark:text-emerald-200";
    case "PENDING":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-400/35 dark:bg-amber-500/15 dark:text-amber-200";
    case "REJECTED":
    case "FAILED":
      return "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:border-rose-400/35 dark:bg-rose-500/15 dark:text-rose-200";
    default:
      return dashboardStatusBadge;
  }
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
  const [historyOpen, setHistoryOpen] = useState(false);

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

  const planCode = (subscription.planCode ?? "FREE") as PlanCode;
  const accent = PLAN_ACCENT[planCode];
  const marketing = PLAN_MARKETING[planCode];
  const storeLimitLabel = formatPlanLimitsSummary(
    subscription.maxStores,
    subscription.maxProducts,
  );
  const usageLabel =
    subscription.maxStores == null
      ? `${subscription.currentStoreCount} negocios · sin límite fijo`
      : `${subscription.currentStoreCount} de ${subscription.maxStores} negocios`;

  const proPlan = catalogPlans.find((p) => p.code === "PRO");
  const enterprisePlan = catalogPlans.find((p) => p.code === "ENTERPRISE");
  const priceLabel =
    planCode === "FREE"
      ? "Incluido al registrarte"
      : `${formatCopCurrency(subscription.planPrice)}/mes`;

  return (
    <>
      <SectionHeader title={title} description={description} />

      {/* 1. Hero: tu plan actual */}
      <CurrentPlanHero
        planCode={planCode}
        planName={subscription.planName}
        status={subscription.status}
        priceLabel={priceLabel}
        storeLimitLabel={storeLimitLabel}
        marketing={marketing}
        accent={accent}
        startedAt={subscription.startedAt}
        expiresAt={subscription.expiresAt}
        canUpgradeToPro={subscription.canUpgradeToPro}
        canUpgradeToEnterprise={subscription.canUpgradeToEnterprise}
        usageLabel={usageLabel}
        maxStores={subscription.maxStores}
        maxProducts={subscription.maxProducts}
        currentStoreCount={subscription.currentStoreCount}
      />

      {/* 2. Selector de plan — comparación clara */}
      <div className="mb-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h3 className={`text-sm font-semibold ${brandTextPrimary}`}>
              Cambia de plan cuando lo necesites
            </h3>
            <p className={`mt-1 text-xs ${brandTextTertiary}`}>
              Compara opciones y muévete al que se ajuste a tu negocio.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <PlanOptionCard
            planCode="FREE"
            isCurrent={planCode === "FREE"}
            catalogPlan={catalogPlans.find((p) => p.code === "FREE")}
          />
          <PlanOptionCard
            planCode="PRO"
            isCurrent={planCode === "PRO"}
            catalogPlan={proPlan}
          />
          <PlanOptionCard
            planCode="ENTERPRISE"
            isCurrent={planCode === "ENTERPRISE"}
            catalogPlan={enterprisePlan}
          />
        </div>
      </div>

      {/* 3. Historial de pagos (compacto/colapsable) */}
      <article className={`${brandDashboardPanel}`}>
        <button
          type="button"
          onClick={() => setHistoryOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left sm:px-6"
          aria-expanded={historyOpen}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-brand-separator/70 bg-brand-hover/70 text-brand-accent dark:text-brand-accent-soft`}
              aria-hidden
            >
              <ReceiptIcon />
            </span>
            <div>
              <p className={`text-sm font-semibold ${brandTextPrimary}`}>
                Historial de pagos
              </p>
              <p className={`mt-0.5 text-xs ${brandTextTertiary}`}>
                {payments.length === 0
                  ? "Aún no hay pagos registrados"
                  : `${payments.length} pago${payments.length === 1 ? "" : "s"} en tu cuenta`}
              </p>
            </div>
          </div>
          <ChevronIcon open={historyOpen} />
        </button>
        {historyOpen ? (
          <div className="border-t border-brand-separator/70 px-5 py-4 sm:px-6">
            {payments.length === 0 ? (
              <p className={`text-sm ${brandTextTertiary}`}>
                {planCode === "FREE"
                  ? "Sin pagos en el plan gratuito — solo se generan al pasar a PRO o Empresarial."
                  : "Aún no hay pagos registrados para tu suscripción."}
              </p>
            ) : (
              <ul className="space-y-2">
                {payments.slice(0, 8).map((payment) => (
                  <li
                    key={payment.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-separator/70 bg-brand-hover/60 px-3 py-2.5 text-sm transition hover:border-brand-input-border hover:bg-brand-hover"
                  >
                    <div className="min-w-0">
                      <p className={`font-medium ${brandTextPrimary}`}>
                        {payment.planName}
                      </p>
                      <p className={`text-xs ${brandTextTertiary}`}>
                        {payment.referenceCode} ·{" "}
                        {formatSubscriptionDate(payment.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold tabular-nums text-brand-primary">
                        {formatPlanPrice(payment.amount, payment.currency)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${paymentStatusTone(payment.status)}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {paymentStatusLabel(payment.status)}
                      </span>
                    </div>
                  </li>
                ))}
                {payments.length > 8 ? (
                  <p className={`pt-1 text-center text-xs ${brandTextTertiary}`}>
                    Mostrando los 8 más recientes de {payments.length}.
                  </p>
                ) : null}
              </ul>
            )}
          </div>
        ) : null}
      </article>
    </>
  );
}

/* -------------------- Hero card: tu plan actual -------------------- */

function CurrentPlanHero({
  planCode,
  planName,
  status,
  priceLabel,
  storeLimitLabel,
  marketing,
  accent,
  startedAt,
  expiresAt,
  canUpgradeToPro,
  canUpgradeToEnterprise,
  usageLabel,
  maxStores,
  maxProducts,
  currentStoreCount,
}: {
  planCode: PlanCode;
  planName: string;
  status: string;
  priceLabel: string;
  storeLimitLabel: string;
  marketing: PlanMarketing | undefined;
  accent: (typeof PLAN_ACCENT)[PlanCode];
  startedAt: string;
  expiresAt: string | null;
  canUpgradeToPro: boolean;
  canUpgradeToEnterprise: boolean;
  usageLabel: string;
  maxStores: number | null;
  maxProducts: number | null;
  currentStoreCount: number;
}) {
  const storesPct =
    maxStores && maxStores > 0
      ? Math.min(100, Math.round((currentStoreCount / maxStores) * 100))
      : 0;

  const primaryCtaHref =
    planCode === "FREE"
      ? "/subscription/pro/checkout"
      : planCode === "PRO"
        ? "/subscription/enterprise/checkout"
        : null;
  const primaryCtaLabel =
    planCode === "FREE"
      ? "Subir a PRO"
      : planCode === "PRO"
        ? "Subir a Empresarial"
        : null;

  return (
    <article
      className={`relative mb-6 overflow-hidden rounded-3xl border border-brand-separator/70 bg-brand-surface p-5 ring-1 sm:p-7 ${accent.ring} ${accent.glow}`}
    >
      {/* Decorative orb */}
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full opacity-25 blur-3xl"
        style={{
          background:
            planCode === "PRO"
              ? "radial-gradient(circle, rgba(0,113,227,0.55), transparent 70%)"
              : planCode === "ENTERPRISE"
                ? "radial-gradient(circle, rgba(94,92,230,0.55), transparent 70%)"
                : "radial-gradient(circle, rgba(110,110,115,0.4), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${accent.pill}`}
              >
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className={`absolute inset-0 rounded-full bg-current opacity-60 animate-ping`} />
                  <span className={`relative h-1.5 w-1.5 rounded-full bg-current`} />
                </span>
                {status}
              </span>
            </div>
            <h2
              className={`font-(family-name:--font-rajdhani) mt-3 text-3xl font-bold leading-tight tracking-tight break-words sm:text-[2.1rem] ${brandTextPrimary}`}
            >
              {planName}
            </h2>
            <p
              className={`font-(family-name:--font-rajdhani) mt-1 text-xl font-semibold break-words ${brandTextSecondary}`}
            >
              {priceLabel}
            </p>
            <p className={`mt-3 text-sm break-words ${brandTextSecondary}`}>
              {storeLimitLabel}
            </p>
          </div>

          {primaryCtaHref && primaryCtaLabel ? (
            <Link
              href={primaryCtaHref}
              className={`shrink-0 px-6 py-3 ${brandCtaMd}`}
            >
              {primaryCtaLabel}
            </Link>
          ) : (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border border-brand-separator bg-brand-hover px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase ${brandTextTertiary}`}
            >
              <CheckIcon />
              Plan máximo
            </span>
          )}
        </div>

        {/* Uso del plan + período */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <UsagePanel
            label="Negocios"
            usageLabel={usageLabel}
            pct={storesPct}
            tint="brand-accent"
          />
          <UsagePanel
            label="Productos por negocio"
            usageLabel={
              maxProducts == null
                ? "Sin límite fijo"
                : `Hasta ${maxProducts}`
            }
            pct={null}
            tint="indigo"
          />
        </div>

        {marketing ? (
          <div className="mt-6 border-t border-brand-separator/70 pt-5">
            <p className={`text-[11px] font-medium tracking-wide uppercase ${brandTextTertiary}`}>
              Qué incluye tu plan
            </p>
            <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {marketing.features.slice(0, 6).map((feature) => (
                <li
                  key={feature}
                  className={`flex items-start gap-2 text-sm ${brandTextSecondary}`}
                >
                  <CheckBullet planCode={planCode} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={`mt-5 text-xs ${brandTextTertiary}`}>
          Activo desde {formatSubscriptionDate(startedAt)}
          {expiresAt
            ? ` · vence ${formatSubscriptionDate(expiresAt)}`
            : planCode !== "FREE"
              ? " · renovación mensual"
              : ""}
        </div>
      </div>
    </article>
  );
}

function UsagePanel({
  label,
  usageLabel,
  pct,
  tint,
}: {
  label: string;
  usageLabel: string;
  pct: number | null;
  tint: "brand-accent" | "indigo";
}) {
  const barColor =
    tint === "brand-accent"
      ? "bg-brand-accent dark:bg-brand-accent-soft"
      : "bg-[#5e5ce6] dark:bg-[#a8a6f0]";
  return (
    <div className="rounded-xl border border-brand-separator/70 bg-brand-hover/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className={`text-[11px] font-medium tracking-wide uppercase ${brandTextTertiary}`}>
          {label}
        </p>
        {pct != null ? (
          <span className={`text-[11px] font-semibold tabular-nums ${brandTextSecondary}`}>
            {pct}%
          </span>
        ) : null}
      </div>
      <p className={`mt-1.5 text-base font-semibold ${brandTextPrimary}`}>
        {usageLabel}
      </p>
      {pct != null ? (
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-brand-separator/80 dark:bg-white/10">
          <div
            className={`h-full rounded-full ${barColor} transition-[width] duration-500 ease-out`}
            style={{ width: `${pct}%` }}
          />
        </div>
      ) : null}
    </div>
  );
}

function CheckBullet({ planCode }: { planCode: PlanCode }) {
  const color =
    planCode === "ENTERPRISE"
      ? "text-[#5e5ce6] dark:text-[#a8a6f0]"
      : planCode === "PRO"
        ? "text-brand-accent dark:text-brand-accent-soft"
        : "text-brand-secondary";
  return (
    <span
      className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-current/10 text-[10px] font-bold ${color}`}
      aria-hidden
    >
      ✓
    </span>
  );
}

/* -------------------- Plan comparison cards -------------------- */

function PlanOptionCard({
  planCode,
  isCurrent,
  catalogPlan,
}: {
  planCode: PlanCode;
  isCurrent: boolean;
  catalogPlan: SubscriptionPlan | undefined;
}) {
  const marketing = PLAN_MARKETING[planCode];
  const accent = PLAN_ACCENT[planCode];

  const price =
    catalogPlan && catalogPlan.price > 0
      ? `${formatPlanPrice(catalogPlan.price, catalogPlan.currency)}/mes`
      : "Sin costo";

  const ctaLabel = isCurrent
    ? planCode === "FREE"
      ? "Tu plan actual"
      : "Plan activo"
    : marketing.ctaLabel;

  const ctaClass = isCurrent
    ? `${brandSecondaryButton} cursor-default opacity-80`
    : brandCtaMd;

  const stores = catalogPlan?.maxStores;
  const products = catalogPlan?.maxProducts;
  const storesLine =
    stores == null
      ? "Negocios ilimitados"
      : stores === 1
        ? "1 negocio"
        : `Hasta ${stores} negocios`;
  const productsLine =
    products == null
      ? "Catálogo flexible"
      : `${products} productos/negocio`;

  const href = !isCurrent
    ? planCode === "FREE"
      ? "/plans"
      : `/subscription/${planCode === "PRO" ? "pro" : "enterprise"}/checkout`
    : undefined;

  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-brand-surface p-4 sm:p-5 transition-shadow ${
        isCurrent
          ? `border-[#0071e3]/40 shadow-[0_18px_44px_-14px_rgba(0,113,227,0.22)] dark:border-[#2997ff]/45`
          : "border-brand-separator/70 shadow-[0_4px_14px_-6px_rgba(0,0,0,0.08)] hover:border-brand-input-border hover:shadow-[0_8px_22px_-8px_rgba(0,0,0,0.14)]"
      }`}
    >
      {/* Top accent stripe for current plan */}
      {isCurrent ? (
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{
            background:
              planCode === "PRO"
                ? "linear-gradient(90deg, transparent, #0071e3, transparent)"
                : planCode === "ENTERPRISE"
                  ? "linear-gradient(90deg, transparent, #5e5ce6, transparent)"
                  : "linear-gradient(90deg, transparent, #6e6e73, transparent)",
          }}
          aria-hidden
        />
      ) : null}

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border ${
              planCode === "FREE"
                ? "border-brand-separator bg-brand-hover text-brand-secondary"
                : planCode === "PRO"
                  ? "border-[#0071e3]/30 bg-[#0071e3]/10 text-brand-accent dark:border-[#2997ff]/40 dark:bg-[#2997ff]/15 dark:text-brand-accent-soft"
                  : "border-[#5e5ce6]/30 bg-[#5e5ce6]/10 text-[#5e5ce6] dark:border-[#a8a6f0]/40 dark:bg-[#5e5ce6]/20 dark:text-[#a8a6f0]"
            }`}
            aria-hidden
          >
            <PlanIcon planCode={planCode} />
          </span>
          <p
            className={`text-[11px] font-semibold tracking-wide uppercase ${brandTextTertiary}`}
          >
            {marketing.badge ?? planCode}
          </p>
          {isCurrent ? (
            <span
              className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${accent.badge}`}
            >
              <CheckTinyIcon />
              Actual
            </span>
          ) : null}
        </div>
        <h4
          className={`font-(family-name:--font-rajdhani) mt-3 text-lg font-bold leading-tight break-words ${brandTextPrimary}`}
        >
          {planCode === "FREE" ? "Gratis" : planCode === "PRO" ? "Profesional" : "Empresarial"}
        </h4>
        <p
          className={`font-(family-name:--font-rajdhani) mt-1 break-words text-xl font-bold leading-tight ${brandTextPrimary}`}
        >
          {price}
        </p>
      </div>

      <ul className="mt-4 space-y-1.5 text-sm">
        <li className={`flex items-start gap-2 ${brandTextSecondary}`}>
          <span className="mt-0.5 shrink-0">
            <CheckBullet planCode={planCode} />
          </span>
          <span className="break-words">{storesLine}</span>
        </li>
        <li className={`flex items-start gap-2 ${brandTextSecondary}`}>
          <span className="mt-0.5 shrink-0">
            <CheckBullet planCode={planCode} />
          </span>
          <span className="break-words">{productsLine}</span>
        </li>
      </ul>

      <div className="mt-5 pt-1">
        {href ? (
          <Link href={href} className={`block w-full text-center ${ctaClass}`}>
            {ctaLabel}
          </Link>
        ) : (
          <span className={`block w-full text-center ${ctaClass}`}>
            {ctaLabel}
          </span>
        )}
      </div>
    </article>
  );
}

function PlanIcon({ planCode }: { planCode: PlanCode }) {
  if (planCode === "FREE") {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72L4.5 3.345M15.75 3.345l1.621 4.72a3.004 3.004 0 0 1-.621 4.72" />
      </svg>
    );
  }
  if (planCode === "PRO") {
    return (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""} ${brandTextTertiary}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function CheckTinyIcon() {
  return (
    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}