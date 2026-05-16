"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  clearAuthSession,
  getStoredClientName,
  hasAuthSession,
} from "@/lib/auth-session";

const LOGO_URL =
  "https://static.wixstatic.com/media/5dd8a0_d965965b0850412f90639a9c9081723b~mv2.jpg";

const LOGO_MATTE_BG = "#0a0c0f";

const ctaClass =
  "rounded-lg bg-linear-to-r from-teal-400 to-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_20px_-6px_rgba(45,212,191,0.45)] transition hover:from-teal-300 hover:to-cyan-400";

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

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-teal-500/10 bg-[#06080c]/90 backdrop-blur-xl">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-teal-400/30 to-transparent"
      />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:h-17 sm:px-8">
        <Link
          href={loggedIn ? "/dashboard" : "/"}
          className="flex min-w-0 items-center gap-3 transition opacity-90 hover:opacity-100"
          onClick={closeMenu}
        >
          <span
            className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-teal-500/25"
            style={{ backgroundColor: LOGO_MATTE_BG }}
          >
            <Image
              src={LOGO_URL}
              alt="CapiCode"
              width={80}
              height={80}
              className="h-8 w-8 object-contain"
              priority
            />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="font-(family-name:--font-rajdhani) block truncate text-base font-semibold tracking-wide text-teal-100">
              CapiCode
            </span>
            <span className="block truncate text-[10px] font-medium tracking-[0.18em] text-slate-500 uppercase">
              Panel administrativo
            </span>
          </span>
        </Link>

        <nav
          aria-label="Principal"
          className="hidden items-center gap-2 md:flex"
        >
          {loggedIn ? (
            <>
              {clientName ? (
                <span className="max-w-[10rem] truncate px-2 text-sm text-slate-400">
                  {clientName}
                </span>
              ) : null}
              <Link href="/dashboard" className={ctaClass}>
                Mi panel
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              {isLogin ? (
                <Link href="/register" className={ctaClass}>
                  Crear cuenta
                </Link>
              ) : null}
              {isRegister ? (
                <Link href="/" className={ctaClass}>
                  Iniciar sesión
                </Link>
              ) : null}
            </>
          )}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/80 bg-slate-900/60 text-slate-200 md:hidden"
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

      {menuOpen ? (
        <nav
          id="site-mobile-nav"
          aria-label="Menú móvil"
          className="border-t border-slate-800/80 bg-[#06080c]/98 px-5 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {loggedIn ? (
              <>
                {clientName ? (
                  <li className="px-3 py-2 text-sm text-slate-500">
                    {clientName}
                  </li>
                ) : null}
                <li>
                  <Link
                    href="/dashboard"
                    className={`block text-center ${ctaClass}`}
                    onClick={closeMenu}
                  >
                    Mi panel
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                {isLogin ? (
                  <li>
                    <Link
                      href="/register"
                      className={`block text-center ${ctaClass}`}
                      onClick={closeMenu}
                    >
                      Crear cuenta
                    </Link>
                  </li>
                ) : null}
                {isRegister ? (
                  <li>
                    <Link
                      href="/"
                      className={`block text-center ${ctaClass}`}
                      onClick={closeMenu}
                    >
                      Iniciar sesión
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
