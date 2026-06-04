"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoginAmbientBackground } from "@/components/login-ambient-background";
import { LoginPhoneShell } from "@/components/login-phone-shell";
import { postAuthLogin } from "@/lib/auth-api";
import { persistAuthSession } from "@/lib/auth-session";
import {
  brandAlertError,
  brandCtaMd,
  brandEyebrow,
  brandInputClass,
  brandLoginFeatureCard,
  brandLoginFeatureIcon,
  brandLinkHover,
  brandPageBg,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
} from "@/lib/brand-theme";

const FEATURES = [
  {
    title: "Catálogo centralizado",
    description: "Productos, variantes e inventario desde un solo panel.",
    icon: CatalogIcon,
  },
  {
    title: "Operaciones en tiempo real",
    description: "Stock, pedidos y métricas actualizadas al instante.",
    icon: PulseIcon,
  },
  {
    title: "Acceso seguro",
    description: "Sesiones cifradas y control por cuenta de administrador.",
    icon: ShieldIcon,
  },
] as const;

function CatalogIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 7h16M4 12h16M4 17h10"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 17v4M16 19h4"
      />
    </svg>
  );
}

function PulseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 12h4l2-7 4 14 2-7h6"
      />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3l8 4v6c0 5-3.5 7.5-8 8-4.5-.5-8-3-8-8V7l8-4z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4"
      />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 11V8a5 5 0 0110 0v3M6 11h12v10H6V11z"
      />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
      />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18M10.5 10.7A3 3 0 0012 15a3 3 0 002.3-4.3M7.2 7.2C8.6 6.3 10.2 5.8 12 5.8c6.5 0 10 6.2 10 6.2a17.8 17.8 0 01-3.4 4.2M6.1 6.1C4.2 7.4 2.7 9.1 2 12s3.5 7 10 7c1.5 0 2.9-.3 4.1-.8"
      />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? ""}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Completa el correo y la contraseña.");
      return;
    }

    setLoading(true);

    try {
      const result = await postAuthLogin(trimmedEmail, password);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      persistAuthSession(result.data);
      router.push("/dashboard");
    } catch {
      setError(
        "No hay conexión con el servidor. Comprueba tu red o inténtalo más tarde.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`relative flex min-h-0 flex-1 flex-col overflow-x-hidden ${brandPageBg}`}
    >
      <LoginAmbientBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:gap-16 lg:py-16 xl:max-w-7xl xl:gap-20">
        <section
          className="flex flex-1 flex-col justify-center space-y-8 lg:max-w-lg"
          aria-labelledby="login-hero-heading"
        >
          <header className="space-y-4">
            <p className={brandEyebrow}>CapiCode · Gestión comercial integrada</p>
            <h1
              id="login-hero-heading"
              className={`text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl sm:text-[2.35rem] ${brandTextPrimary}`}
            >
              Operaciones comerciales bajo control con CapiCode
            </h1>
            <p className={`text-base leading-relaxed ${brandTextSecondary}`}>
              Gestiona catálogo, inventario, pedidos y configuración de tu negocio
              online desde un panel administrativo diseñado para equipos de retail.
            </p>
          </header>

          <ul
            className="hidden space-y-4 sm:block"
            aria-label="Beneficios del panel CapiCode"
          >
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <li
                  key={feature.title}
                  className={`flex gap-4 px-4 py-3.5 ${brandLoginFeatureCard}`}
                >
                  <span className={brandLoginFeatureIcon}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h2 className={`text-sm font-medium ${brandTextPrimary}`}>
                      {feature.title}
                    </h2>
                    <p className={`mt-0.5 text-sm leading-relaxed ${brandTextSecondary}`}>
                      {feature.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className={`hidden text-xs sm:block ${brandTextTertiary}`}>
            Uso exclusivo para cuentas autorizadas por tu organización.
          </p>
        </section>

        <section
          className="flex w-full flex-1 flex-col items-center justify-center lg:max-w-md"
          aria-labelledby="login-form-heading"
        >
          <h2 id="login-form-heading" className="sr-only">
            Iniciar sesión en CapiCode
          </h2>
          <LoginPhoneShell>
            <form
              className="relative space-y-6"
              onSubmit={handleSubmit}
              noValidate
              aria-label="Formulario de acceso al panel"
            >
              <label className="block space-y-2 text-sm">
                <span className={`text-xs font-medium ${brandTextSecondary}`}>
                  Correo electrónico
                </span>
                <div className="relative">
                  <span className={`pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 ${brandTextTertiary}`}>
                    <MailIcon className="h-5 w-5" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={`${brandInputClass} rounded-2xl py-3.5 pl-11 pr-4 text-sm`}
                    placeholder="tu@empresa.com"
                    disabled={loading}
                    aria-invalid={Boolean(error)}
                  />
                </div>
              </label>

              <label className="block space-y-2 text-sm">
                <span className={`text-xs font-medium ${brandTextSecondary}`}>Contraseña</span>
                <div className="relative">
                  <span className={`pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 ${brandTextTertiary}`}>
                    <LockIcon className="h-5 w-5" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`${brandInputClass} rounded-2xl py-3.5 pl-11 pr-12 text-sm`}
                    placeholder="••••••••"
                    disabled={loading}
                    aria-invalid={Boolean(error)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-2 text-brand-secondary transition hover:bg-brand-hover hover:text-brand-primary"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </label>

              {error ? (
                <div role="alert" className={`flex gap-2.5 rounded-2xl px-3.5 py-3 text-xs ${brandAlertError}`}>
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-xs font-bold text-rose-600 dark:bg-rose-500/20 dark:text-rose-300"
                    aria-hidden
                  >
                    !
                  </span>
                  <p className="leading-relaxed">{error}</p>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className={`flex w-full items-center justify-center gap-2.5 ${brandCtaMd}`}
              >
                {loading ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Verificando credenciales…
                  </>
                ) : (
                  "Acceder al panel"
                )}
              </button>
            </form>

            <div className="relative mt-10 space-y-3 border-t border-brand-separator pt-8">
              <p className={`text-center text-sm leading-relaxed ${brandTextSecondary}`}>
                ¿Primera vez?{" "}
                <Link
                  href="/register"
                  className={`font-semibold text-brand-accent hover:underline dark:text-brand-accent-soft ${brandLinkHover}`}
                >
                  Crear cuenta
                </Link>
              </p>
              <p className={`text-center text-sm leading-relaxed ${brandTextTertiary}`}>
                ¿Olvidaste tu acceso? Contacta al administrador de tu
                organización.
              </p>
            </div>
          </LoginPhoneShell>

          <p className={`mt-8 flex items-center justify-center gap-2 text-center text-[11px] sm:hidden ${brandTextTertiary}`}>
            <ShieldIcon className={`h-3.5 w-3.5 shrink-0 ${brandTextSecondary}`} />
            Conexión cifrada · Solo cuentas autorizadas
          </p>
        </section>
      </div>
    </main>
  );
}
