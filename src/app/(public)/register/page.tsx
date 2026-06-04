"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { postAuthRegister } from "@/lib/auth-api";
import { persistAuthSession } from "@/lib/auth-session";
import {
  brandAlertError,
  brandCardTopLine,
  brandCtaMd,
  brandEyebrow,
  brandFeatureItem,
  brandFeatureItemMuted,
  brandFeatureList,
  brandFormLabel,
  brandFormLabelHint,
  brandGridOverlaySoftClass,
  brandHeroTitle,
  brandHighlightAccent,
  brandHighlightPro,
  brandInputClass,
  brandLinkAccent,
  brandPageBg,
  brandPasswordToggle,
  brandRadialAccent,
  brandSecondaryButton,
  brandSurfaceElevated,
  brandTextSecondary,
  registerConnectorDone,
  registerConnectorPending,
  registerPhaseMeta,
  registerPhaseTitle,
  registerProBanner,
  registerStepCurrent,
  registerStepDone,
  registerStepPending,
  registerStepTitleCurrent,
  registerStepTitleIdle,
} from "@/lib/brand-theme";

const PHASES = [
  { id: 0, title: "Tu cuenta", hint: "Datos del administrador" },
  { id: 1, title: "Tu tienda", hint: "Nombre y URL opcional" },
] as const;

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wantsPro = searchParams.get("plan") === "pro";
  const [phase, setPhase] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeLabel, setStoreLabel] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const validatePhase = (p: number): string | null => {
    if (p === 0) {
      if (!name.trim() || !email.trim() || !password) {
        return "Completa nombre, correo y contraseña.";
      }
      if (password !== confirmPassword) {
        return "Las contraseñas no coinciden.";
      }
      if (password.length < 8) {
        return "La contraseña debe tener al menos 8 caracteres.";
      }
      return null;
    }
    if (p === 1) {
      if (!storeName.trim()) {
        return "Indica el nombre de la tienda.";
      }
      return null;
    }
    return null;
  };

  const goBack = () => {
    setError("");
    setPhase((prev) => Math.max(0, prev - 1));
  };

  const submitRegister = async () => {
    setLoading(true);
    try {
      const result = await postAuthRegister({
        name: name.trim(),
        email: email.trim(),
        password,
        storeName: storeName.trim(),
        storeLabel: storeLabel.trim() || undefined,
        storeSlug: storeSlug.trim() || undefined,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      persistAuthSession(result.data);
      router.push(wantsPro ? "/subscription/pro/checkout" : "/dashboard");
    } catch {
      setError(
        "No hay conexión con el servidor. Comprueba tu red o inténtalo más tarde.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (phase < 1) {
      const msg = validatePhase(phase);
      if (msg) {
        setError(msg);
        return;
      }
      setPhase((p) => p + 1);
      return;
    }

    const msg = validatePhase(0) ?? validatePhase(1);
    if (msg) {
      setError(msg);
      return;
    }

    await submitRegister();
  };

  return (
    <main
      className={`relative flex min-h-0 flex-1 flex-col overflow-x-hidden ${brandPageBg}`}
    >
      <div className={brandGridOverlaySoftClass} />
      <div className={brandRadialAccent} />

      <section className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:gap-16 lg:py-16">
        <div className="flex flex-1 flex-col justify-center space-y-6 lg:max-w-lg">
          <div className="space-y-4">
            <p className={brandEyebrow}>
              {wantsPro ? "Alta con plan Profesional" : "Alta gratuita"}
            </p>
            <h1 className={brandHeroTitle}>
              {wantsPro
                ? "Crea tu cuenta y pasa a PRO"
                : "Tu tienda online en dos pasos"}
            </h1>
            <p className={`text-base leading-relaxed ${brandTextSecondary}`}>
              {wantsPro ? (
                <>
                  Registro gratuito con tu primera tienda. Al terminar te llevamos
                  al pago seguro del plan{" "}
                  <span className={brandHighlightPro}>Profesional</span>.
                </>
              ) : (
                <>
                  Sin código de invitación. Al registrarte activamos el plan{" "}
                  <span className={brandHighlightAccent}>Gratis</span> con tu
                  primera tienda incluida.
                </>
              )}
            </p>
          </div>
          <ul className={brandFeatureList}>
            <li className={brandFeatureItem}>
              1 tienda incluida en el plan Gratis
            </li>
            <li className={brandFeatureItemMuted}>
              Catálogo, variantes, PayU y panel administrativo
            </li>
            <li className={brandFeatureItem}>
              Más tiendas con el plan Profesional —{" "}
              <Link href="/plans" className={brandLinkAccent}>
                ver planes
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex w-full flex-1 flex-col justify-center lg:max-w-lg">
          <div className={`${brandSurfaceElevated} p-8 sm:p-10`}>
            <div aria-hidden className={brandCardTopLine} />

            {wantsPro ? (
              <p className={registerProBanner}>
                <span className="font-semibold">Plan Profesional</span> — tras
                crear la cuenta irás al checkout PayU ($ 99.000 / mes).
              </p>
            ) : null}

            <nav aria-label="Progreso del registro" className="mb-8">
              <ol className="flex w-full list-none items-center gap-0 p-0">
                {PHASES.map((step, index) => {
                  const done = index < phase;
                  const current = index === phase;
                  const stepCircleClass = current
                    ? registerStepCurrent
                    : done
                      ? registerStepDone
                      : registerStepPending;
                  const stepTitleClass = current
                    ? registerStepTitleCurrent
                    : registerStepTitleIdle;
                  return (
                    <li
                      key={step.id}
                      className="flex min-w-0 flex-1 items-center last:flex-none"
                    >
                      <div className="flex shrink-0 flex-col items-center gap-1.5">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold transition ${stepCircleClass}`}
                          aria-current={current ? "step" : undefined}
                        >
                          {done ? "✓" : index + 1}
                        </span>
                        <span className={stepTitleClass}>{step.title}</span>
                      </div>
                      {index < PHASES.length - 1 ? (
                        <div
                          aria-hidden
                          className={`mx-2 h-px min-w-3 flex-1 sm:mx-3 ${
                            index < phase
                              ? registerConnectorDone
                              : registerConnectorPending
                          }`}
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ol>
              <p className={registerPhaseMeta}>
                <span className={registerPhaseTitle}>
                  {PHASES[phase].title}
                </span>
                <span className="text-brand-tertiary"> · </span>
                {PHASES[phase].hint}
              </p>
            </nav>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {phase === 0 ? (
                <>
                  <label className="block space-y-2 text-sm">
                    <span className={brandFormLabel}>Nombre y apellido</span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className={`${brandInputClass} px-4`}
                      placeholder="María García"
                      disabled={loading}
                    />
                  </label>

                  <label className="block space-y-2 text-sm">
                    <span className={brandFormLabel}>Correo electrónico</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className={`${brandInputClass} px-4`}
                      placeholder="tu@empresa.com"
                      disabled={loading}
                    />
                  </label>

                  <label className="block space-y-2 text-sm">
                    <span className={brandFormLabel}>Contraseña</span>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className={`${brandInputClass} px-4 pr-29 sm:pr-32`}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className={brandPasswordToggle}
                      >
                        {showPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                  </label>

                  <label className="block space-y-2 text-sm">
                    <span className={brandFormLabel}>Confirmar contraseña</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      className={`${brandInputClass} px-4`}
                      disabled={loading}
                    />
                  </label>
                </>
              ) : null}

              {phase === 1 ? (
                <>
                  <label className="block space-y-2 text-sm">
                    <span className={brandFormLabel}>Nombre de la tienda</span>
                    <input
                      type="text"
                      name="storeName"
                      value={storeName}
                      onChange={(event) => setStoreName(event.target.value)}
                      className={`${brandInputClass} px-4`}
                      placeholder="Mi comercio"
                      disabled={loading}
                    />
                  </label>

                  <label className="block space-y-2 text-sm">
                    <span className={brandFormLabel}>
                      Etiqueta visible{" "}
                      <span className={brandFormLabelHint}>(opcional)</span>
                    </span>
                    <input
                      type="text"
                      name="storeLabel"
                      value={storeLabel}
                      onChange={(event) => setStoreLabel(event.target.value)}
                      className={`${brandInputClass} px-4`}
                      placeholder="Texto corto para la cabecera"
                      disabled={loading}
                    />
                  </label>

                  <label className="block space-y-2 text-sm">
                    <span className={brandFormLabel}>
                      Slug en URL{" "}
                      <span className={brandFormLabelHint}>(opcional)</span>
                    </span>
                    <input
                      type="text"
                      name="storeSlug"
                      value={storeSlug}
                      onChange={(event) => setStoreSlug(event.target.value)}
                      className={`${brandInputClass} px-4`}
                      placeholder="mi-comercio (se genera si lo dejas vacío)"
                      disabled={loading}
                    />
                  </label>
                </>
              ) : null}

              {error ? (
                <p role="alert" className={brandAlertError}>
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:justify-end">
                {phase > 0 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={loading}
                    className={`order-2 w-full px-4 py-3.5 sm:order-1 sm:mr-auto sm:w-auto ${brandSecondaryButton} disabled:opacity-50`}
                  >
                    Atrás
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className={`order-1 w-full sm:order-2 sm:w-auto sm:min-w-[200px] ${brandCtaMd}`}
                >
                  {loading
                    ? "Creando cuenta…"
                    : phase < 1
                      ? "Continuar"
                      : wantsPro
                        ? "Crear cuenta y pagar PRO"
                        : "Crear cuenta y entrar"}
                </button>
              </div>
            </form>
          </div>

          <p className={`mt-6 text-center text-sm ${brandTextSecondary}`}>
            ¿Ya tienes cuenta?{" "}
            <Link href="/" className={brandLinkAccent}>
              Iniciar sesión
            </Link>
            {" · "}
            <Link href="/plans" className={brandLinkAccent}>
              Ver planes
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <main
          className={`flex flex-1 items-center justify-center ${brandPageBg} ${brandTextSecondary}`}
        >
          Cargando…
        </main>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
