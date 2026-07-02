"use client";

import type { ComponentProps, ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DashboardSidebar,
  type DashboardSection,
} from "@/components/dashboard/dashboard-sidebar";
import { AlertModal, type AlertTone } from "@/components/dashboard/alert-modal";
import {
  brandNavIconButton,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
} from "@/lib/brand-theme";
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
  clearMessages: () => void;
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
  clearMessages,
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

  // Priorizar error sobre success si ambos están seteados
  const alertOpen = Boolean(error || actionMessage);
  const alertTone: AlertTone = error ? "error" : "success";
  const alertTitle = error || actionMessage;

  return (
    <main className="flex min-h-dvh flex-col bg-brand-bg text-brand-primary">
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[17.5rem] shrink-0 flex-col overflow-hidden border-r border-brand-separator bg-brand-bg p-4 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:h-dvh lg:max-h-dvh xl:w-72 xl:p-5">
          <DashboardSidebar {...sidebarProps} />
        </aside>

        {mobileNavOpen ? (
          <MobileNavDrawer
            sidebarProps={sidebarProps}
            onClose={() => setMobileNavOpen(false)}
          />
        ) : null}

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-brand-separator bg-brand-nav/80 px-4 py-4 backdrop-blur-2xl backdrop-saturate-150 sm:px-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-1 items-start gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className={`${brandNavIconButton} lg:hidden`}
                aria-label="Abrir menú"
              >
                ☰
              </button>
              <div className="min-w-0 flex-1">
                <h1
                  className={`font-(family-name:--font-rajdhani) truncate text-xl font-semibold tracking-tight sm:text-2xl ${brandTextPrimary}`}
                >
                  {sectionMeta.title}
                </h1>
                <p className={`mt-1 line-clamp-2 text-sm ${brandTextTertiary}`}>
                  {activeStore ? (
                    <>
                      <span className={brandTextSecondary}>{activeStore.name}</span>
                      <span className={`mx-1.5 ${brandTextTertiary}`}>·</span>
                      <span className={`font-mono text-xs ${brandTextTertiary}`}>
                        /{activeStore.slug}
                      </span>
                    </>
                  ) : (
                    sectionMeta.description
                  )}
                </p>
              </div>
              </div>
              <ThemeToggle className="shrink-0" />
            </div>
          </header>

          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </div>
        </section>
      </div>

      <AlertModal
        open={alertOpen}
        tone={alertTone}
        title={alertTitle}
        onClose={clearMessages}
      />
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
        className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/75"
        aria-label="Cerrar menú"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 left-0 flex h-full w-[min(18rem,88vw)] flex-col overflow-hidden border-r border-brand-separator bg-brand-bg p-4 shadow-2xl">
        <DashboardSidebar {...sidebarProps} onClose={onClose} />
      </div>
    </div>
  );
}
