"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PayuCheckoutForm } from "@/components/payu-checkout-form";
import {
  startSubscriptionCheckout,
  type PayuPaymentStartResponse,
  type PurchasablePlanCode,
} from "@/services/subscriptionService";
import { brandCtaMd, brandPageBg } from "@/lib/brand-theme";

type SubscriptionCheckoutFlowProps = {
  planCode: PurchasablePlanCode;
  planTitle: string;
  registerPlanQuery: "pro" | "enterprise";
};

export function SubscriptionCheckoutFlow({
  planCode,
  planTitle,
  registerPlanQuery,
}: SubscriptionCheckoutFlowProps) {
  const router = useRouter();
  const [checkout, setCheckout] = useState<PayuPaymentStartResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token) {
      router.replace(`/register?plan=${registerPlanQuery}`);
      return;
    }

    let cancelled = false;
    void startSubscriptionCheckout(token, { planCode })
      .then((data) => {
        if (!cancelled) setCheckout(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo conectar con PayU.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [router, planCode, registerPlanQuery]);

  return (
    <main
      className={`relative flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-20 ${brandPageBg}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,113,227,0.08),transparent_55%)]" />

      <div className="relative max-w-md text-center">
        {checkout ? (
          <>
            <p className="text-xs font-semibold tracking-[0.22em] text-brand-tertiary uppercase">
              Redirigiendo a PayU
            </p>
            <h1 className="font-(family-name:--font-rajdhani) mt-4 text-2xl font-bold text-brand-primary">
              {planTitle}
            </h1>
            <p className="mt-3 text-sm text-brand-secondary">
              Te estamos llevando al checkout seguro para completar tu suscripción…
            </p>
            <PayuCheckoutForm checkout={checkout} />
          </>
        ) : error ? (
          <>
            <h1 className="font-(family-name:--font-rajdhani) text-2xl font-bold text-brand-primary">
              No pudimos iniciar el pago
            </h1>
            <p className="mt-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/plans" className={brandCtaMd}>
                Volver a planes
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl border border-brand-separator px-5 py-2.5 text-sm text-brand-secondary hover:bg-brand-hover"
              >
                Ir al panel
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand-accent/30 border-t-brand-accent" />
            <p className="mt-6 text-sm text-brand-secondary">
              Preparando checkout…
            </p>
          </>
        )}
      </div>
    </main>
  );
}
