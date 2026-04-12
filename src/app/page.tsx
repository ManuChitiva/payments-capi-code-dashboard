"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postAuthLogin } from "@/lib/auth-api";
import { persistAuthSession } from "@/lib/auth-session";

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
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.12),transparent)]" />
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-12 px-5 py-14 sm:px-8 lg:flex-row lg:items-stretch lg:gap-16 lg:py-16">
        <div className="flex flex-1 flex-col justify-center space-y-8 lg:max-w-lg">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400/90">
              Panel administrativo
            </p>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Gestión centralizada de tu catálogo
            </h1>
            <p className="text-lg leading-relaxed text-slate-400">
              Inicia sesión para administrar productos, stock y tiendas desde un
              único lugar, con acceso seguro para tu equipo.
            </p>
          </div>
          <ul className="space-y-3 border-l border-slate-800 pl-5 text-sm text-slate-400">
            <li className="relative before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-cyan-500/80">
              Catálogo e inventario en tiempo real
            </li>
            <li className="relative before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-cyan-500/80">
              Cambios auditables y flujo claro de trabajo
            </li>
            <li className="relative before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-cyan-500/80">
              Conexión cifrada (HTTPS) en producción
            </li>
          </ul>
        </div>

        <div className="flex w-full flex-1 flex-col justify-center lg:max-w-md">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-xl shadow-black/40 backdrop-blur-sm sm:p-9">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Iniciar sesión
              </h2>
              <p className="text-sm text-slate-500">
                Usa las credenciales de tu cuenta de administrador.
              </p>
            </div>

            <form
              className="mt-8 space-y-5"
              onSubmit={handleSubmit}
              noValidate
            >
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-slate-300">Correo electrónico</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-cyan-500/30 transition placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-2"
                  placeholder="tu@empresa.com"
                  disabled={loading}
                  aria-invalid={Boolean(error)}
                />
              </label>

              <label className="block space-y-2 text-sm">
                <span className="font-medium text-slate-300">Contraseña</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 pr-28 text-slate-100 outline-none ring-cyan-500/30 transition focus:border-cyan-500/60 focus:ring-2"
                    disabled={loading}
                    aria-invalid={Boolean(error)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </label>

              {error ? (
                <p
                  role="alert"
                  className="rounded-lg border border-rose-500/35 bg-rose-950/40 px-4 py-3 text-sm text-rose-100"
                >
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="w-full rounded-lg bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Iniciando sesión…" : "Continuar"}
              </button>

              <p className="pt-1 text-center text-sm text-slate-400">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/register"
                  className="font-medium text-cyan-400 underline-offset-4 hover:text-cyan-300 hover:underline"
                >
                  Crear cuenta
                </Link>
              </p>
            </form>
          </div>
          <p className="mt-4 max-w-sm text-center text-xs leading-relaxed text-slate-600 lg:mx-auto">
            Si olvidaste tu acceso, contacta a tu administrador.
          </p>
        </div>
      </section>
    </main>
  );
}
