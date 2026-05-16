"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  DashboardSidebar,
  type DashboardSection,
} from "@/components/dashboard/dashboard-sidebar";
import type {
  ClientDetail,
  DashboardSectionMeta,
  StoreSummary,
} from "@/types/dashboard";

type DashboardShellProps = {
  client: ClientDetail;
  activeStore: StoreSummary | undefined;
  activeSection: DashboardSection;
  sectionMeta: DashboardSectionMeta;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  error: string;
  actionMessage: string;
  onStoreChange: (storeId: number) => void;
  onNewStore: () => void;
  onSection: (section: DashboardSection) => void;
  onLogout: () => void;
  children: ReactNode;
};

export function DashboardShell({
  client,
  activeStore,
  activeSection,
  sectionMeta,
  mobileNavOpen,
  setMobileNavOpen,
  error,
  actionMessage,
  onStoreChange,
  onNewStore,
  onSection,
  onLogout,
  children,
}: DashboardShellProps) {
  const sidebarProps = {
    clientName: client.name,
    clientEmail: client.email,
    stores: client.stores.map((s) => ({ id: s.id, name: s.name })),
    activeStoreId: activeStore?.id,
    activeSection,
    onStoreChange,
    onNewStore,
    onSection,
    onLogout,
  };

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-[#06080c] text-slate-100">
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[17.5rem] shrink-0 flex-col border-r border-white/[0.08] bg-[#040608]/95 p-5 backdrop-blur-xl lg:flex xl:w-72 xl:p-6">
          <DashboardSidebar {...sidebarProps} />
        </aside>

        {mobileNavOpen ? (
          <MobileNavDrawer
            sidebarProps={sidebarProps}
            onClose={() => setMobileNavOpen(false)}
          />
        ) : null}

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-white/[0.08] bg-[#06080c]/85 px-4 py-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 lg:hidden"
                aria-label="Abrir menú"
              >
                ☰
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="font-(family-name:--font-rajdhani) truncate text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {sectionMeta.title}
                </h1>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {activeStore ? (
                    <>
                      <span className="text-slate-400">{activeStore.name}</span>
                      <span className="mx-1.5 text-slate-600">·</span>
                      <span className="font-mono text-xs text-slate-600">
                        /{activeStore.slug}
                      </span>
                    </>
                  ) : (
                    sectionMeta.description
                  )}
                </p>
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
            {error ? (
              <p className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm text-rose-200 backdrop-blur">
                {error}
              </p>
            ) : null}
            {actionMessage ? (
              <p className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 backdrop-blur">
                {actionMessage}
              </p>
            ) : null}
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}

function MobileNavDrawer({
  sidebarProps,
  onClose,
}: {
  sidebarProps: ComponentProps<typeof DashboardSidebar>;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        aria-label="Cerrar menú"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] flex-col border-r border-white/10 bg-[#06080c] p-5 shadow-2xl">
        <DashboardSidebar {...sidebarProps} onClose={onClose} />
      </div>
    </div>
  );
}
