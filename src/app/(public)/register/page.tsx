"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postAuthRegister } from "@/lib/auth-api";
import { persistAuthSession } from "@/lib/auth-session";

const PHASES = [
  { id: 0, title: "Invitación", hint: "Valida tu código de acceso" },
  { id: 1, title: "Tu cuenta", hint: "Datos del administrador" },
  { id: 2, title: "Tu tienda", hint: "Nombre y URL opcional" },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [phase, setPhase] = useState(0);
  const [registrationCode, setRegistrationCode] = useState("");
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("registrationCode") ?? params.get("code");
    if (q) {
      setRegistrationCode(q);
    }
  }, []);

  const validatePhase = (p: number): string | null => {
    if (p === 0) {
      if (!registrationCode.trim()) {
        return "Indica el código de registro que te facilitó tu contacto.";
      }
      return null;
    }
    if (p === 1) {
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
    if (p === 2) {
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
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedStore = storeName.trim();
    const trimmedCode = registrationCode.trim();

    setLoading(true);
    try {
      const result = await postAuthRegister({
        name: trimmedName,
        email: trimmedEmail,
        password,
        storeName: trimmedStore,
        registrationCode: trimmedCode,
        storeLabel: storeLabel.trim() || undefined,
        storeSlug: storeSlug.trim() || undefined,
      });
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (phase < 2) {
      const msg = validatePhase(phase);
      if (msg) {
        setError(msg);
        return;
      }
      setPhase((p) => p + 1);
      return;
    }

    const msg = validatePhase(0) ?? validatePhase(1) ?? validatePhase(2);
    if (msg) {
      setError(msg);
      return;
    }

    await submitRegister();
  };

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden bg-[#06080c] text-slate-100">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(45,212,191,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45,212,191,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.12),transparent_55%)]" />

      <section className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:gap-16 lg:py-16">
        <div className="flex flex-1 flex-col justify-center space-y-6 lg:max-w-lg">
          <div className="space-y-4">
            <p className="font-(family-name:--font-rajdhani) text-xs font-semibold tracking-[0.22em] text-teal-300/95 uppercase">
              CapiCode · Alta de cuenta
            </p>
            <h1 className="font-(family-name:--font-rajdhani) text-3xl leading-[1.12] font-bold tracking-tight text-white sm:text-4xl sm:text-[2.35rem]">
              Crea tu espacio en tres pasos
            </h1>
            <p className="text-base leading-relaxed text-slate-400">
              Registro con código de invitación: flujo breve para validar acceso,
              tu perfil de administrador y los datos de la tienda.
            </p>
          </div>
          <ul className="hidden space-y-3 border-l border-teal-500/25 pl-5 text-sm text-slate-400 sm:block">
            <li className="relative before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-teal-400/90">
              Código único por cliente (no reutilizable)
            </li>
            <li className="relative before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-amber-400/85">
              Slug opcional; se puede generar automáticamente
            </li>
            <li className="relative before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-teal-400/90">
              Acceso al panel al finalizar
            </li>
          </ul>
        </div>

        <div className="flex w-full flex-1 flex-col justify-center lg:max-w-lg">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/80 p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-10">
            <div
              aria-hidden
              className="absolute top-0 right-0 left-0 h-0.5 bg-linear-to-r from-transparent via-amber-400/60 to-teal-400/80"
            />

            <nav aria-label="Progreso del registro" className="mb-8">
              <ol className="flex w-full list-none items-center gap-0 p-0">
                {PHASES.map((step, index) => {
                  const done = index < phase;
                  const current = index === phase;
                  return (
                    <li
                      key={step.id}
                      className="flex min-w-0 flex-1 items-center last:flex-none"
                    >
                      <div className="flex shrink-0 flex-col items-center gap-1.5">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold transition ${
                            current
                              ? "border-teal-400/70 bg-teal-500/15 text-teal-200 shadow-[0_0_16px_-4px_rgba(45,212,191,0.5)]"
                              : done
                                ? "border-teal-500/35 bg-teal-500/10 text-teal-300"
                                : "border-slate-600/80 bg-slate-950/50 text-slate-500"
                          }`}
                          aria-current={current ? "step" : undefined}
                        >
                          {done ? "✓" : index + 1}
                        </span>
                        <span
                          className={`hidden max-w-22 truncate text-center text-[10px] font-medium tracking-wide uppercase sm:block ${
                            current ? "text-teal-200/95" : "text-slate-500"
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>
                      {index < PHASES.length - 1 ? (
                        <div
                          aria-hidden
                          className={`mx-2 h-px min-w-3 flex-1 sm:mx-3 ${
                            index < phase
                              ? "bg-teal-500/40"
                              : "bg-slate-700/60"
                          }`}
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ol>
              <p className="mt-4 text-sm text-slate-400">
                <span className="font-medium text-slate-200">
                  {PHASES[phase].title}
                </span>
                <span className="text-slate-500"> · </span>
                {PHASES[phase].hint}
              </p>
            </nav>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {phase === 0 ? (
                <label className="block space-y-2 text-sm">
                  <span className="font-medium text-slate-300">
                    Código de registro
                  </span>
                  <input
                    type="text"
                    name="registrationCode"
                    autoComplete="off"
                    spellCheck={false}
                    value={registrationCode}
                    onChange={(event) =>
                      setRegistrationCode(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700/90 bg-slate-950/85 px-4 py-3.5 font-mono text-sm tracking-wide text-slate-100 outline-none ring-teal-500/25 transition placeholder:text-slate-600 focus:border-teal-500/55 focus:ring-2 sm:text-base"
                    placeholder="Ej. CLIENTE-2026-A1"
                    disabled={loading}
                  />
                  <span className="text-xs text-slate-500">
                    Te lo envía quien te da de alta. Mayúsculas y minúsculas dan
                    igual.
                  </span>
                </label>
              ) : null}

              {phase === 1 ? (
                <>
                  <label className="block space-y-2 text-sm">
                    <span className="font-medium text-slate-300">
                      Nombre y apellido
                    </span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full rounded-xl border border-slate-700/90 bg-slate-950/85 px-4 py-3.5 text-base text-slate-100 outline-none ring-teal-500/25 transition placeholder:text-slate-600 focus:border-teal-500/55 focus:ring-2"
                      placeholder="María García"
                      disabled={loading}
                    />
                  </label>

                  <label className="block space-y-2 text-sm">
                    <span className="font-medium text-slate-300">
                      Correo electrónico
                    </span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-xl border border-slate-700/90 bg-slate-950/85 px-4 py-3.5 text-base text-slate-100 outline-none ring-teal-500/25 transition placeholder:text-slate-600 focus:border-teal-500/55 focus:ring-2"
                      placeholder="tu@empresa.com"
                      disabled={loading}
                    />
                  </label>

                  <label className="block space-y-2 text-sm">
                    <span className="font-medium text-slate-300">
                      Contraseña
                    </span>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full rounded-xl border border-slate-700/90 bg-slate-950/85 px-4 py-3.5 pr-29 text-base text-slate-100 outline-none ring-teal-500/25 transition focus:border-teal-500/55 focus:ring-2 sm:pr-32"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg px-3.5 py-2 text-sm font-medium text-amber-200/80 transition hover:bg-slate-800/90 hover:text-amber-100"
                      >
                        {showPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                  </label>

                  <label className="block space-y-2 text-sm">
                    <span className="font-medium text-slate-300">
                      Confirmar contraseña
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700/90 bg-slate-950/85 px-4 py-3.5 text-base text-slate-100 outline-none ring-teal-500/25 transition focus:border-teal-500/55 focus:ring-2"
                      disabled={loading}
                    />
                  </label>
                </>
              ) : null}

              {phase === 2 ? (
                <>
                  <label className="block space-y-2 text-sm">
                    <span className="font-medium text-slate-300">
                      Nombre de la tienda
                    </span>
                    <input
                      type="text"
                      name="storeName"
                      value={storeName}
                      onChange={(event) => setStoreName(event.target.value)}
                      className="w-full rounded-xl border border-slate-700/90 bg-slate-950/85 px-4 py-3.5 text-base text-slate-100 outline-none ring-teal-500/25 transition placeholder:text-slate-600 focus:border-teal-500/55 focus:ring-2"
                      placeholder="Mi comercio"
                      disabled={loading}
                    />
                  </label>

                  <label className="block space-y-2 text-sm">
                    <span className="font-medium text-slate-300">
                      Etiqueta visible{" "}
                      <span className="font-normal text-slate-500">
                        (opcional)
                      </span>
                    </span>
                    <input
                      type="text"
                      name="storeLabel"
                      value={storeLabel}
                      onChange={(event) => setStoreLabel(event.target.value)}
                      className="w-full rounded-xl border border-slate-700/90 bg-slate-950/85 px-4 py-3.5 text-base text-slate-100 outline-none ring-teal-500/25 transition placeholder:text-slate-600 focus:border-teal-500/55 focus:ring-2"
                      placeholder="Texto corto para la cabecera"
                      disabled={loading}
                    />
                  </label>

                  <label className="block space-y-2 text-sm">
                    <span className="font-medium text-slate-300">
                      Slug en URL{" "}
                      <span className="font-normal text-slate-500">
                        (opcional)
                      </span>
                    </span>
                    <input
                      type="text"
                      name="storeSlug"
                      value={storeSlug}
                      onChange={(event) => setStoreSlug(event.target.value)}
                      className="w-full rounded-xl border border-slate-700/90 bg-slate-950/85 px-4 py-3.5 text-base text-slate-100 outline-none ring-teal-500/25 transition placeholder:text-slate-600 focus:border-teal-500/55 focus:ring-2"
                      placeholder="mi-comercio (se genera si lo dejas vacío)"
                      disabled={loading}
                    />
                  </label>
                </>
              ) : null}

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-500/40 bg-rose-950/45 px-4 py-3.5 text-sm text-rose-100"
                >
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:justify-end">
                {phase > 0 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={loading}
                    className="order-2 w-full rounded-xl border border-slate-600/80 bg-slate-950/50 px-4 py-3.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900/80 disabled:opacity-50 sm:order-1 sm:mr-auto sm:w-auto"
                  >
                    Atrás
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                  className="order-1 w-full rounded-xl bg-linear-to-r from-teal-400 to-cyan-500 px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_0_24px_-4px_rgba(45,212,191,0.4)] transition hover:from-teal-300 hover:to-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 disabled:cursor-not-allowed disabled:opacity-60 sm:order-2 sm:w-auto sm:min-w-[200px]"
                >
                  {loading
                    ? "Creando cuenta…"
                    : phase < 2
                      ? "Continuar"
                      : "Crear cuenta y entrar"}
                </button>
              </div>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/"
              className="font-medium text-teal-300 underline-offset-4 hover:text-amber-300 hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
