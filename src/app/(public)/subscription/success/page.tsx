"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { brandCtaMd, brandPageBg } from "@/lib/brand-theme";

function SubscriptionSuccessContent() {
  const params = useSearchParams();
  const reference = params.get("referenceCode") ?? params.get("reference_sale");

  return (
    <main
      className={`relative flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-20 text-slate-100 ${brandPageBg}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.06),transparent_55%)]" />

      <div className="relative max-w-lg text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#2997ff]/40 bg-[#2997ff]/15 text-2xl text-[#2997ff]">
          ✓
        </span>
        <h1 className="font-(family-name:--font-rajdhani) mt-6 text-3xl font-bold text-white">
          Pago recibido
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-400">
          PayU procesó tu transacción. Si el pago fue aprobado, tu plan{" "}
          <span className="font-medium text-[#2997ff]">Profesional</span> se
          activará en segundos cuando confirmemos el webhook.
        </p>
        {reference ? (
          <p className="mt-3 font-mono text-xs text-slate-500">
            Referencia: {reference}
          </p>
        ) : null}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/dashboard"
            className={`px-6 py-3 ${brandCtaMd}`}
          >
            Ir al panel
          </Link>
          <Link
            href="/plans"
            className="rounded-xl border border-slate-600/80 px-6 py-3 text-sm text-slate-200 hover:bg-slate-900/80"
          >
            Ver planes
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className={`flex flex-1 items-center justify-center ${brandPageBg} text-slate-400`}>
          Cargando…
        </main>
      }
    >
      <SubscriptionSuccessContent />
    </Suspense>
  );
}
