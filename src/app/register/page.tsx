"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postAuthRegister } from "@/lib/auth-api";
import { persistAuthSession } from "@/lib/auth-session";

export default function RegisterPage() {
  const router = useRouter();
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedStore = storeName.trim();
    const trimmedCode = registrationCode.trim();
    if (!trimmedCode) {
      setError("Indica el código de registro que te facilitó tu contacto.");
      return;
    }
    if (!trimmedName || !trimmedEmail || !password || !trimmedStore) {
      setError("Completa nombre, correo, contraseña y nombre de la tienda.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.12),transparent)]" />
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-12 px-5 py-14 sm:px-8 lg:flex-row lg:items-stretch lg:gap-16 lg:py-16">
        <div className="flex flex-1 flex-col justify-center space-y-8 lg:max-w-lg">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400/90">
              Alta de cuenta
            </p>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
              Crea tu espacio y tu primera tienda
            </h1>
            <p className="text-lg leading-relaxed text-slate-400">
              El alta es solo con código de invitación: tu organización recibe un
              código de un solo uso; tras usarlo no podrá registrarse otra
              persona con el mismo.
            </p>
          </div>
          <ul className="space-y-3 border-l border-slate-800 pl-5 text-sm text-slate-400">
            <li className="relative before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-cyan-500/80">
              Código único por cliente (no reutilizable)
            </li>
            <li className="relative before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-cyan-500/80">
              Slug único para la URL pública de la tienda
            </li>
            <li className="relative before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-cyan-500/80">
              Acceso al panel en el mismo paso
            </li>
          </ul>
        </div>

        <div className="flex w-full flex-1 flex-col justify-center lg:max-w-md">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-xl shadow-black/40 backdrop-blur-sm sm:p-9">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Crear cuenta
              </h2>
              <p className="text-sm text-slate-500">
                Código de invitación, datos del administrador y de la tienda.
              </p>
            </div>

            <form
              className="mt-8 space-y-4"
              onSubmit={handleSubmit}
              noValidate
            >
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
                  onChange={(event) => setRegistrationCode(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 font-mono text-sm tracking-wide text-slate-100 outline-none ring-cyan-500/30 transition placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-2"
                  placeholder="Ej. CLIENTE-2026-A1"
                  disabled={loading}
                />
                <span className="text-xs text-slate-500">
                  Te lo envía quien te da de alta. Mayúsculas y minúsculas dan
                  igual.
                </span>
              </label>

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
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-cyan-500/30 transition placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-2"
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
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-cyan-500/30 transition placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-2"
                  placeholder="tu@empresa.com"
                  disabled={loading}
                />
              </label>

              <label className="block space-y-2 text-sm">
                <span className="font-medium text-slate-300">
                  Nombre de la tienda
                </span>
                <input
                  type="text"
                  name="storeName"
                  value={storeName}
                  onChange={(event) => setStoreName(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-cyan-500/30 transition placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-2"
                  placeholder="Mi comercio"
                  disabled={loading}
                />
              </label>

              <label className="block space-y-2 text-sm">
                <span className="font-medium text-slate-300">
                  Etiqueta visible{" "}
                  <span className="font-normal text-slate-500">(opcional)</span>
                </span>
                <input
                  type="text"
                  name="storeLabel"
                  value={storeLabel}
                  onChange={(event) => setStoreLabel(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-cyan-500/30 transition placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-2"
                  placeholder="Texto corto para la cabecera"
                  disabled={loading}
                />
              </label>

              <label className="block space-y-2 text-sm">
                <span className="font-medium text-slate-300">
                  Slug en URL{" "}
                  <span className="font-normal text-slate-500">(opcional)</span>
                </span>
                <input
                  type="text"
                  name="storeSlug"
                  value={storeSlug}
                  onChange={(event) => setStoreSlug(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-cyan-500/30 transition placeholder:text-slate-600 focus:border-cyan-500/60 focus:ring-2"
                  placeholder="mi-comercio (se genera si lo dejas vacío)"
                  disabled={loading}
                />
              </label>

              <label className="block space-y-2 text-sm">
                <span className="font-medium text-slate-300">Contraseña</span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 pr-28 text-slate-100 outline-none ring-cyan-500/30 transition focus:border-cyan-500/60 focus:ring-2"
                    disabled={loading}
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

              <label className="block space-y-2 text-sm">
                <span className="font-medium text-slate-300">
                  Confirmar contraseña
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none ring-cyan-500/30 transition focus:border-cyan-500/60 focus:ring-2"
                  disabled={loading}
                />
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
                className="mt-2 w-full rounded-lg bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creando cuenta…" : "Crear cuenta y entrar"}
              </button>
            </form>
          </div>
          <p className="mt-6 text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/"
              className="font-medium text-cyan-400 hover:text-cyan-300"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
