"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchMySubscription,
  type MySubscription,
} from "@/services/subscriptionService";
import { formatCopCurrency } from "@/lib/dashboard/format";
import {
  brandCtaMd,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
  subscriptionBannerEnterprise,
  subscriptionBannerFree,
  subscriptionBannerPro,
  subscriptionEnterpriseCta,
} from "@/lib/brand-theme";

export function SubscriptionPlanBanner() {
  const [subscription, setSubscription] = useState<MySubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    void fetchMySubscription(token)
      .then((data) => {
        if (!cancelled) setSubscription(data);
      })
      .catch(() => {
        if (!cancelled) setSubscription(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !subscription) {
    return null;
  }

  const isPro = subscription.planCode === "PRO";
  const isEnterprise = subscription.planCode === "ENTERPRISE";
  const storeLimit =
    subscription.maxStores == null
      ? "tiendas ilimitadas"
      : subscription.maxStores === 1
        ? "1 tienda"
        : `hasta ${subscription.maxStores} tiendas`;

  const bannerClass = isEnterprise
    ? subscriptionBannerEnterprise
    : isPro
      ? subscriptionBannerPro
      : subscriptionBannerFree;

  return (
    <article
      className={`mb-6 rounded-2xl border p-5 backdrop-blur sm:p-6 ${bannerClass}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={`text-xs font-semibold tracking-wide uppercase ${brandTextTertiary}`}>
            Tu plan
          </p>
          <h2
            className={`font-(family-name:--font-rajdhani) mt-1 text-xl font-bold ${brandTextPrimary}`}
          >
            {subscription.planName}
          </h2>
          <p className={`mt-1 text-sm ${brandTextSecondary}`}>
            {storeLimit}
            {subscription.planPrice > 0
              ? ` · ${formatCopCurrency(subscription.planPrice)}/mes`
              : " · sin costo mensual"}
          </p>
          {subscription.planDescription ? (
            <p className={`mt-2 max-w-xl text-sm ${brandTextTertiary}`}>
              {subscription.planDescription}
            </p>
          ) : null}
        </div>
        {subscription.canUpgradeToPro ? (
          <Link
            href="/subscription/pro/checkout"
            className={`shrink-0 px-5 py-3 text-center ${brandCtaMd}`}
          >
            Pasar a PRO
          </Link>
        ) : isPro ? (
          <Link href="mailto:soporte@capicode.com?subject=Plan%20Empresarial%20CapiCode" className={subscriptionEnterpriseCta}>
            Subir a Empresarial
          </Link>
        ) : isEnterprise ? (
          <span className="shrink-0 rounded-full border border-brand-separator bg-brand-hover px-4 py-2 text-xs font-semibold tracking-wide text-brand-secondary uppercase">
            Activo
          </span>
        ) : null}
      </div>
    </article>
  );
}
