"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { publicApiBaseUrl } from "@/lib/public-api";
const DEMO_EMAIL = "admin@stores.local";
const DEMO_PASSWORD = "Admin123*";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("stores_admin_token");
    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    fetch(`${publicApiBaseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("auth_error");
        }

        const data = (await response.json()) as {
          token: string;
          client: {
            id: number;
            name: string;
            email: string;
            activeStoreId: number | null;
            stores: Array<{ id: number; slug: string; name: string }>;
          };
        };

        window.localStorage.setItem("stores_admin_token", data.token);
        window.localStorage.setItem(
          "stores_admin_client",
          JSON.stringify(data.client),
        );
        if (data.client.activeStoreId) {
          window.localStorage.setItem(
            "stores_admin_active_store_id",
            String(data.client.activeStoreId),
          );
        }
        router.push("/dashboard");
      })
      .catch(() => {
        setError(
          "No se pudo iniciar sesion. Verifica backend, correo y clave.",
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center gap-10 px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-20">
        <div className="max-w-xl space-y-6">
          <span className="inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-1 text-sm text-cyan-200">
            Stores Admin Dashboard
          </span>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Gestion de productos con una experiencia moderna y profesional
          </h1>
          <p className="text-base text-slate-300 sm:text-lg">
            Accede al panel para revisar catalogo, controlar stock y monitorear
            estados de productos. Este flujo es temporal y simula autenticacion.
          </p>
          <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-300">
            <p className="font-medium text-slate-100">Acceso demo</p>
            <p>Usuario: {DEMO_EMAIL}</p>
            <p>Clave: {DEMO_PASSWORD}</p>
          </div>
        </div>

        <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/80 p-7 shadow-2xl shadow-cyan-950/30">
          <h2 className="text-2xl font-semibold">Iniciar sesion</h2>
          <p className="mt-2 text-sm text-slate-400">
            Bienvenido de vuelta. Ingresa para continuar al dashboard.
          </p>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2 text-sm">
              <span className="text-slate-300">Correo</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
                placeholder="admin@stores.local"
                required
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="text-slate-300">Contrasena</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-24 outline-none transition focus:border-cyan-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </label>

            {error ? (
              <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-cyan-700"
            >
              {loading ? "Validando..." : "Entrar al dashboard"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
