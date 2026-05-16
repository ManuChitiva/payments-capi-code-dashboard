import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 shrink-0 border-t border-teal-500/10 bg-[#030508] text-slate-400">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(45,212,191,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45,212,191,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-teal-400/35 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-14">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal-500/30 bg-teal-500/10 text-xs font-bold text-teal-300"
              >
                CC
              </span>
              <div>
                <p className="font-(family-name:--font-rajdhani) text-lg font-semibold tracking-[0.06em] text-teal-200">
                  CapiCode
                </p>
                <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">
                  Panel empresarial
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-500">
              Plataforma administrativa para catálogo, inventario y operaciones
              comerciales. Diseñada para equipos que necesitan control, trazabilidad
              y una experiencia coherente de principio a fin.
            </p>
          </div>

          <nav
            aria-label="Enlaces de acceso"
            className="lg:col-span-3 lg:justify-self-end"
          >
            <h2 className="text-xs font-semibold tracking-[0.22em] text-slate-200 uppercase">
              Acceso
            </h2>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 transition hover:text-teal-300"
                >
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-slate-400 transition hover:text-teal-300"
                >
                  Crear cuenta
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-slate-400 transition hover:text-teal-300"
                >
                  Ir al panel
                </Link>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="text-xs font-semibold tracking-[0.22em] text-slate-200 uppercase">
              Cumplimiento
            </h2>
            <ul className="mt-5 space-y-3.5 text-sm text-slate-500">
              <li>Protección de datos según políticas de tu organización</li>
              <li>Uso interno y credencial único por administrador</li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xs font-semibold tracking-[0.22em] text-slate-200 uppercase">
              Soporte
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-slate-500">
              Para altas, permisos o incidencias, coordina con el administrador de
              tu empresa o con tu contacto comercial CapiCode.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-white/[0.06] pt-10 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs text-slate-600">
            © {year} CapiCode. Todos los derechos reservados.
          </p>
          <p className="text-xs text-slate-600">
            Tecnología y operación con estándares empresariales.
          </p>
        </div>
      </div>
    </footer>
  );
}
