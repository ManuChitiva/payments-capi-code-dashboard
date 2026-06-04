"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PayuCheckoutForm } from "@/components/payu-checkout-form";
import {
  startProSubscriptionCheckout,
  type PayuPaymentStartResponse,
} from "@/services/subscriptionService";
import { brandCtaMd, brandPageBg } from "@/lib/brand-theme";

export default function ProSubscriptionCheckoutPage() {
  const router = useRouter();
  const [checkout, setCheckout] = useState<PayuPaymentStartResponse | null>(
    null,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (!token) {
      router.replace("/register?plan=pro");
      return;
    }

    let cancelled = false;
    void startProSubscriptionCheckout(token)
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
  }, [router]);

  return (
    <main
      className={`relative flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-20 text-slate-100 ${brandPageBg}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.05),transparent_55%)]" />

      <div className="relative max-w-md text-center">
        {checkout ? (
          <>
            <p className="text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase">
              Redirigiendo a PayU
            </p>
            <h1 className="font-(family-name:--font-rajdhani) mt-4 text-2xl font-bold text-white">
              Plan Profesional
            </h1>
            <p className="mt-3 text-sm text-slate-400">
              Te estamos llevando al checkout seguro para completar tu suscripción…
            </p>
            <PayuCheckoutForm checkout={checkout} />
          </>
        ) : error ? (
          <>
            <h1 className="font-(family-name:--font-rajdhani) text-2xl font-bold text-white">
              No pudimos iniciar el pago
            </h1>
            <p className="mt-4 rounded-xl border border-rose-500/40 bg-rose-950/45 px-4 py-3 text-sm text-rose-100">
              {error}
            </p>
            <p className="mt-4 text-xs text-slate-500">
              Si eres administrador de la plataforma, configura{" "}
              <code className="text-slate-400">platform_payu_config</code> o las
              variables <code className="text-slate-400">PLATFORM_PAYU_*</code>.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/plans"
                className="rounded-xl border border-slate-600/80 px-5 py-2.5 text-sm text-slate-200 hover:bg-slate-900/80"
              >
                Volver a planes
              </Link>
              <Link
                href="/dashboard"
                className={`px-5 py-2.5 ${brandCtaMd}`}
              >
                Ir al panel
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#2997ff]/30 border-t-blue-500" />
            <p className="mt-6 text-sm text-slate-400">
              Preparando checkout del plan PRO…
            </p>
          </>
        )}
      </div>
    </main>
  );
}
