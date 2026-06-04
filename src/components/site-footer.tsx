import Link from "next/link";
import {
  brandLinkHover,
  brandPageBg,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
  brandWordmarkClass,
  brandWordmarkSubClass,
} from "@/lib/brand-theme";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className={`relative z-10 shrink-0 border-t border-brand-separator ${brandPageBg}`}
    >
      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-14">
          <div className="lg:col-span-5">
            <div>
              <p className={brandWordmarkClass}>CapiCode</p>
              <p className={brandWordmarkSubClass}>Gestión de negocios online</p>
            </div>
            <p className={`mt-6 max-w-md text-sm leading-relaxed ${brandTextTertiary}`}>
              Plataforma administrativa para catálogo, inventario y operaciones
              comerciales. Registro gratuito con tu primer negocio incluido.
            </p>
          </div>

          <nav
            aria-label="Enlaces de acceso"
            className="lg:col-span-3 lg:justify-self-end"
          >
            <h2
              className={`text-xs font-medium tracking-wide uppercase ${brandTextPrimary}`}
            >
              Acceso
            </h2>
            <ul className="mt-5 space-y-3.5 text-sm">
              <li>
                <Link href="/" className={`${brandTextSecondary} ${brandLinkHover}`}>
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link href="/plans" className={`${brandTextSecondary} ${brandLinkHover}`}>
                  Planes y precios
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className={`${brandTextSecondary} ${brandLinkHover}`}
                >
                  Crear cuenta
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className={`${brandTextSecondary} ${brandLinkHover}`}
                >
                  Ir al panel
                </Link>
              </li>
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2
              className={`text-xs font-medium tracking-wide uppercase ${brandTextPrimary}`}
            >
              Cumplimiento
            </h2>
            <ul className={`mt-5 space-y-3.5 text-sm ${brandTextTertiary}`}>
              <li>Protección de datos según políticas de tu organización</li>
              <li>Uso interno con credencial única por administrador</li>
              <li>Plan Gratis: 1 negocio · upgrade disponible</li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2
              className={`text-xs font-medium tracking-wide uppercase ${brandTextPrimary}`}
            >
              Soporte
            </h2>
            <p className={`mt-5 text-sm leading-relaxed ${brandTextTertiary}`}>
              Para altas, permisos o incidencias, coordina con el administrador de
              tu empresa o con tu contacto comercial CapiCode.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-brand-separator pt-10 lg:flex-row lg:items-center lg:justify-between">
          <p className={`text-xs ${brandTextTertiary}`}>
            © {year} CapiCode. Todos los derechos reservados.
          </p>
          <p className={`text-xs ${brandTextTertiary}`}>
            Diseñado con claridad y precisión.
          </p>
        </div>
      </div>
    </footer>
  );
}
