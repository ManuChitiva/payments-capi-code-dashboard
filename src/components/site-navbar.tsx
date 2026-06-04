"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  clearAuthSession,
  getStoredClientName,
  hasAuthSession,
} from "@/lib/auth-session";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  brandCtaSm,
  brandNavHeader,
  brandNavIconButton,
  brandNavLinkClass,
  brandNavMobileMenu,
  brandTextSecondary,
  brandWordmarkClass,
  brandWordmarkSubClass,
} from "@/lib/brand-theme";

export function SiteNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [clientName, setClientName] = useState<string | null>(null);

  useEffect(() => {
    setLoggedIn(hasAuthSession());
    setClientName(getStoredClientName());
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    clearAuthSession();
    closeMenu();
    router.push("/");
  };

  const isLogin = pathname === "/";
  const isRegister = pathname === "/register";
  const isPlans = pathname === "/plans";

  return (
    <header className={brandNavHeader}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-brand-separator"
      />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 sm:h-[4.25rem] sm:gap-4 sm:px-8">
        <Link
          href={loggedIn ? "/dashboard" : "/"}
          className="min-w-0 transition opacity-90 hover:opacity-100"
          onClick={closeMenu}
        >
          <span className={brandWordmarkClass}>CapiCode</span>
          <span className={brandWordmarkSubClass}>Gestión de negocios online</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden md:flex" />
          <nav
            aria-label="Principal"
            className="hidden items-center gap-2 md:flex"
          >
          {loggedIn ? (
            <>
              {clientName ? (
                <span
                  className={`max-w-[10rem] truncate px-2 text-sm ${brandTextSecondary}`}
                >
                  {clientName}
                </span>
              ) : null}
              <Link href="/dashboard" className={brandCtaSm}>
                Mi panel
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={brandNavLinkClass}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/plans" className={brandNavLinkClass}>
                Planes
              </Link>
              {isLogin ? (
                <Link href="/register" className={brandCtaSm}>
                  Crear cuenta
                </Link>
              ) : null}
              {isRegister || isPlans ? (
                <Link href="/" className={brandCtaSm}>
                  Iniciar sesión
                </Link>
              ) : null}
              {!isLogin && !isRegister && !isPlans ? (
                <Link href="/register" className={brandCtaSm}>
                  Crear cuenta
                </Link>
              ) : null}
            </>
          )}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className={brandNavIconButton}
          aria-expanded={menuOpen}
          aria-controls="site-mobile-nav"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuOpen((open) => !open)}
        >
            {menuOpen ? (
              <span className="text-lg leading-none">✕</span>
            ) : (
              <span className="text-lg leading-none">☰</span>
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          id="site-mobile-nav"
          aria-label="Menú móvil"
          className={brandNavMobileMenu}
        >
          <ul className="flex flex-col gap-1">
            {loggedIn ? (
              <>
                {clientName ? (
                  <li className={`px-3 py-2 text-sm ${brandTextSecondary}`}>
                    {clientName}
                  </li>
                ) : null}
                <li>
                  <Link
                    href="/dashboard"
                    className={`block text-center ${brandCtaSm}`}
                    onClick={closeMenu}
                  >
                    Mi panel
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`w-full text-left ${brandNavLinkClass}`}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <div className="mb-2 flex justify-center">
                    <ThemeToggle />
                  </div>
                </li>
                <li>
                  <Link
                    href="/plans"
                    className={`mb-1 block text-center ${brandNavLinkClass}`}
                    onClick={closeMenu}
                  >
                    Planes
                  </Link>
                </li>
                {isLogin ? (
                  <li>
                    <Link
                      href="/register"
                      className={`block text-center ${brandCtaSm}`}
                      onClick={closeMenu}
                    >
                      Crear cuenta
                    </Link>
                  </li>
                ) : null}
                {isRegister || isPlans ? (
                  <li>
                    <Link
                      href="/"
                      className={`block text-center ${brandCtaSm}`}
                      onClick={closeMenu}
                    >
                      Iniciar sesión
                    </Link>
                  </li>
                ) : null}
                {!isLogin && !isRegister && !isPlans ? (
                  <li>
                    <Link
                      href="/register"
                      className={`block text-center ${brandCtaSm}`}
                      onClick={closeMenu}
                    >
                      Crear cuenta
                    </Link>
                  </li>
                ) : null}
              </>
            )}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
