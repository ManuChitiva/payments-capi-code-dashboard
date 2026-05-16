"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postAuthLogin } from "@/lib/auth-api";
import { persistAuthSession } from "@/lib/auth-session";

const LOGO_URL =
  "https://static.wixstatic.com/media/5dd8a0_d965965b0850412f90639a9c9081723b~mv2.jpg";

/** Fondo del asset JPG del logo; alinear el contenedor evita el “recorte” visible */
const LOGO_MATTE_BG = "#0a0c0f";

export default function LoginPage() {
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
    <main className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden bg-[#06080c] text-slate-100">
      {/* Ambient layers */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(45,212,191,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45,212,191,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-15%,rgba(45,212,191,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_50%,rgba(245,158,11,0.06),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_0%_80%,rgba(34,211,238,0.05),transparent_55%)]" />

      <section className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-12 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:gap-16 xl:gap-24 lg:py-16">
        {/* Brand column */}
        <div className="flex flex-1 flex-col items-center text-center lg:max-w-lg lg:items-start lg:text-left">
          <div className="relative mb-8 w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none lg:mb-10">
            <div
              aria-hidden
              className="absolute -inset-3 rounded-[28px] bg-linear-to-br from-teal-400/25 via-cyan-500/10 to-amber-400/15 blur-2xl"
            />
            <div
              className="relative overflow-hidden rounded-2xl border border-teal-400/35 p-6 shadow-[0_0_0_1px_rgba(45,212,191,0.08)_inset,0_25px_50px_-12px_rgba(0,0,0,0.65)] ring-1 ring-teal-400/20 sm:p-8"
              style={{ backgroundColor: LOGO_MATTE_BG }}
            >
              <Image
                src={LOGO_URL}
                alt="CapiCode"
                width={640}
                height={360}
                priority
                className="relative z-1 mx-auto h-auto w-full max-w-[260px] object-contain drop-shadow-[0_8px_32px_rgba(45,212,191,0.15)] sm:max-w-[300px]"
                sizes="(max-width: 1024px) 280px, 320px"
              />
            </div>
          </div>

          <p
            className="font-(family-name:--font-rajdhani) text-xs font-semibold tracking-[0.28em] text-teal-300/95 uppercase"
          >
            CapiCode · Panel administrativo
          </p>
          <h1
            className="mt-4 font-(family-name:--font-rajdhani) text-3xl leading-[1.12] font-bold tracking-tight text-white sm:text-4xl sm:text-[2.5rem]"
          >
            Gestión centralizada de tu catálogo
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-400">
            Inicia sesión para administrar productos, stock y tiendas desde un
            único lugar, con acceso seguro para tu equipo.
          </p>

          <ul className="mt-8 hidden max-w-md space-y-3 border-l border-teal-500/25 pl-5 text-left text-sm text-slate-400 sm:block">
            <li className="relative before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-teal-400/90">
              Catálogo e inventario en tiempo real
            </li>
            <li className="relative before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-amber-400/85">
              Cambios auditables y flujo claro de trabajo
            </li>
            <li className="relative before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-teal-400/90">
              Conexión cifrada (HTTPS) en producción
            </li>
          </ul>
        </div>

        {/* Form column */}
        <div className="flex w-full flex-1 flex-col justify-center lg:max-w-xl xl:max-w-2xl">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/75 p-9 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-11 lg:p-12">
            <div
              aria-hidden
              className="absolute top-0 right-0 left-0 h-0.5 bg-linear-to-r from-transparent via-amber-400/70 to-teal-400/80"
            />
            <div className="space-y-2">
              <h2
                className="font-(family-name:--font-rajdhani) text-2xl font-semibold tracking-tight text-white sm:text-[1.65rem]"
              >
                Iniciar sesión
              </h2>
              <p className="text-base text-slate-500">
                Usa las credenciales de tu cuenta de administrador.
              </p>
            </div>

            <form
              className="mt-10 space-y-6"
              onSubmit={handleSubmit}
              noValidate
            >
              <label className="block space-y-2.5 text-base">
                <span className="font-medium text-slate-300">
                  Correo electrónico
                </span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-700/90 bg-slate-950/85 px-4 py-3.5 text-base text-slate-100 outline-none ring-teal-500/25 transition placeholder:text-slate-600 focus:border-teal-500/55 focus:ring-2 sm:px-5 sm:py-4"
                  placeholder="tu@empresa.com"
                  disabled={loading}
                  aria-invalid={Boolean(error)}
                />
              </label>

              <label className="block space-y-2.5 text-base">
                <span className="font-medium text-slate-300">Contraseña</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-slate-700/90 bg-slate-950/85 px-4 py-3.5 pr-29 text-base text-slate-100 outline-none ring-teal-500/25 transition focus:border-teal-500/55 focus:ring-2 sm:px-5 sm:py-4 sm:pr-32"
                    disabled={loading}
                    aria-invalid={Boolean(error)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg px-3.5 py-2 text-sm font-medium text-amber-200/80 transition hover:bg-slate-800/90 hover:text-amber-100"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </label>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-500/40 bg-rose-950/45 px-4 py-3.5 text-base text-rose-100"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="w-full rounded-xl bg-linear-to-r from-teal-400 to-cyan-500 px-4 py-4 text-base font-semibold text-slate-950 shadow-[0_0_24px_-4px_rgba(45,212,191,0.45)] transition hover:from-teal-300 hover:to-cyan-400 hover:shadow-[0_0_28px_-4px_rgba(45,212,191,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 disabled:cursor-not-allowed disabled:opacity-60 sm:py-4.5"
              >
                {loading ? "Iniciando sesión…" : "Continuar"}
              </button>

              <p className="pt-2 text-center text-base text-slate-400">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/register"
                  className="font-medium text-teal-300 underline-offset-4 hover:text-amber-300 hover:underline"
                >
                  Crear cuenta
                </Link>
              </p>
            </form>
          </div>
          <p className="mt-5 max-w-md text-center text-sm leading-relaxed text-slate-600 lg:mx-auto">
            Si olvidaste tu acceso, contacta a tu administrador.
          </p>
        </div>
      </section>
    </main>
  );
}
