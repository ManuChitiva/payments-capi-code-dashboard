"use client";

import type { ReactNode } from "react";

export function LoginPhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[min(100%,20.5rem)] sm:max-w-[21.5rem]">
      <div
        className="relative rounded-[3rem] bg-linear-to-b from-[var(--login-phone-bezel-from)] via-[var(--login-phone-bezel-via)] to-[var(--login-phone-bezel-to)] p-[11px] shadow-[var(--login-phone-bezel-shadow)] transition-transform duration-500 hover:-translate-y-1"
        role="presentation"
      >
        {/* Botones laterales */}
        <span
          aria-hidden
          className="absolute top-[28%] -left-[2px] h-14 w-[3px] rounded-l-sm bg-[var(--login-phone-button)]"
        />
        <span
          aria-hidden
          className="absolute top-[38%] -left-[2px] h-9 w-[3px] rounded-l-sm bg-[var(--login-phone-button)]"
        />
        <span
          aria-hidden
          className="absolute top-[32%] -right-[2px] h-16 w-[3px] rounded-r-sm bg-[var(--login-phone-button)]"
        />

        {/* Pantalla — color vía variable CSS ligada a html.light / html.dark */}
        <div
          className="relative flex min-h-[40rem] flex-col overflow-hidden rounded-[2.35rem] bg-[var(--login-phone-screen)] ring-1 ring-[var(--login-phone-screen-ring)] sm:min-h-[44rem]"
        >
          {/* Barra superior tipo iPhone */}
          <div className="relative z-10 flex h-12 shrink-0 items-center justify-center pt-2.5">
            <div
              className="h-[1.6rem] w-[5.25rem] rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
              aria-hidden
            />
          </div>

          <div className="flex shrink-0 items-center justify-between px-6 pb-2 text-[10px] font-medium text-[var(--login-phone-status)]">
            <span>9:41</span>
            <span className="flex items-center gap-1" aria-hidden>
              <span className="h-2 w-2 rounded-full bg-[var(--login-phone-status-icon)] opacity-85" />
              <span className="h-2 w-2.5 rounded-sm border border-[var(--login-phone-status-icon)] opacity-55" />
              <span className="h-2.5 w-4 rounded-[2px] border border-[var(--login-phone-status-icon)] opacity-55" />
            </span>
          </div>

          {/* Contenido */}
          <div className="flex flex-1 flex-col justify-center px-5 py-8 sm:px-6 sm:py-12">
            {children}
          </div>

          {/* Indicador inicio */}
          <div className="flex shrink-0 justify-center pb-6 pt-4">
            <span
              className="h-1 w-[7rem] rounded-full bg-[var(--login-phone-home-bar)]"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}
