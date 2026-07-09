"use client";

import { useEffect, useState } from "react";
import {
  brandInputClass,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
  brandWordmarkClass,
  brandWordmarkSubClass,
} from "@/lib/brand-theme";

type StoreOption = {
  id: number;
  name: string;
};

export type DashboardSection =
  | "resumen"
  | "productos"
  | "pedidos"
  | "tienda"
  | "personal"
  | "pagos"
  | "suscripcion";

/** Catálogo plano: lookup de label/icon por sección. */
const NAV_ITEMS: Record<DashboardSection, { label: string; icon: string }> = {
  resumen: { label: "Analítica", icon: "◈" },
  productos: { label: "Productos", icon: "◉" },
  pedidos: { label: "Pedidos y pagos", icon: "◎" },
  tienda: { label: "Mi negocio", icon: "⌂" },
  personal: { label: "Personal", icon: "☻" },
  pagos: { label: "Pagos PayU", icon: "💳" },
  suscripcion: { label: "Mi suscripción", icon: "◇" },
};

/**
 * Grupos del menú lateral. Un grupo sin {@code label} se renderiza como
 * item suelto (sin header plegable) — se usa para "Resumen" que siempre
 * queda visible. Los grupos con varias secciones se pliegan/despliegan.
 */
const NAV_GROUPS: {
  id: string;
  label?: string;
  items: DashboardSection[];
}[] = [
  { id: "resumen", items: ["resumen"] },
  {
    id: "gestion",
    label: "Gestión",
    items: ["productos", "personal", "tienda"],
  },
  {
    id: "ventas",
    label: "Ventas",
    items: ["pedidos", "pagos"],
  },
  {
    id: "cuenta",
    label: "Mi cuenta",
    items: ["suscripcion"],
  },
];

type DashboardSidebarProps = {
  clientName: string;
  clientEmail: string;
  stores: StoreOption[];
  activeStoreId: number | undefined;
  activeSection: DashboardSection;
  onStoreChange: (storeId: number) => void;
  onNewStore: () => void;
  onSection: (section: DashboardSection) => void;
  onLogout: () => void;
  onClose?: () => void;
};

export function DashboardSidebar({
  clientName,
  clientEmail,
  stores,
  activeStoreId,
  activeSection,
  onStoreChange,
  onNewStore,
  onSection,
  onLogout,
  onClose,
}: DashboardSidebarProps) {
  // Por defecto todos los grupos están abiertos; el efecto de abajo se
  // asegura de que el grupo con la sección activa nunca quede cerrado.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const g of NAV_GROUPS) initial[g.id] = true;
    return initial;
  });

  useEffect(() => {
    const activeGroup = NAV_GROUPS.find((g) => g.items.includes(activeSection));
    if (!activeGroup) return;
    setOpenGroups((prev) =>
      prev[activeGroup.id] ? prev : { ...prev, [activeGroup.id]: true },
    );
  }, [activeSection]);

  const pickSection = (section: DashboardSection) => {
    onSection(section);
    onClose?.();
  };

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 shrink-0">
        <p className={brandWordmarkClass}>CapiCode</p>
        <p className={brandWordmarkSubClass}>Gestión de negocios</p>
      </div>

      {stores.length > 0 ? (
        <div className="shrink-0 rounded-xl border border-brand-separator bg-brand-surface px-2.5 py-2">
          <p className="text-[10px] font-medium tracking-[0.12em] text-brand-secondary uppercase">
            Negocio activo
          </p>
          <div className="relative mt-1.5">
            <select
              value={activeStoreId ?? ""}
              onChange={(e) => onStoreChange(Number(e.target.value))}
              className={`${brandInputClass} py-2 pr-8 pl-2.5 text-sm`}
            >
              {stores.map((store) => (
                <option
                  key={store.id}
                  value={store.id}
                  className="bg-brand-surface"
                >
                  {store.name}
                </option>
              ))}
            </select>
            <span
              className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[10px] text-brand-tertiary"
              aria-hidden
            >
              ▼
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onNewStore();
              onClose?.();
            }}
            className="mt-1.5 w-full rounded-lg border border-dashed border-brand-input-border py-1.5 text-[11px] font-medium text-brand-secondary transition hover:border-brand-accent-soft hover:bg-brand-hover hover:text-brand-accent-soft"
          >
            + Añadir negocio
          </button>
        </div>
      ) : null}

      <nav
        className="mt-4 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain"
        aria-label="Secciones"
      >
        <p className="shrink-0 px-1 text-[10px] font-semibold tracking-[0.18em] text-brand-tertiary uppercase">
          Menú
        </p>
        {NAV_GROUPS.map((group) => {
          const open = openGroups[group.id] ?? true;
          if (!group.label) {
            // Grupo sin header: render plano (ej. Resumen).
            const section = group.items[0];
            return (
              <SidebarNavButton
                key={group.id}
                label={NAV_ITEMS[section].label}
                icon={NAV_ITEMS[section].icon}
                active={activeSection === section}
                onClick={() => pickSection(section)}
              />
            );
          }
          return (
            <SidebarGroup
              key={group.id}
              label={group.label}
              open={open}
              onToggle={() => toggleGroup(group.id)}
            >
              {group.items.map((section) => (
                <SidebarNavButton
                  key={section}
                  label={NAV_ITEMS[section].label}
                  icon={NAV_ITEMS[section].icon}
                  active={activeSection === section}
                  onClick={() => pickSection(section)}
                />
              ))}
            </SidebarGroup>
          );
        })}
      </nav>

      <div className="mt-auto shrink-0 border-t border-brand-separator bg-brand-bg pt-3">
        <p className={`truncate text-sm font-medium ${brandTextPrimary}`}>
          {clientName}
        </p>
        <p className={`truncate text-xs ${brandTextTertiary}`}>{clientEmail}</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-2 w-full rounded-lg border border-brand-separator bg-brand-hover px-3 py-1.5 text-sm text-brand-secondary transition hover:bg-brand-surface-hover hover:text-brand-primary"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

function SidebarGroup({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex shrink-0 items-center justify-between rounded-md px-1 py-1 text-[10px] font-semibold tracking-[0.16em] text-brand-tertiary uppercase transition hover:text-brand-secondary"
      >
        <span>{label}</span>
        <svg
          className={`h-3 w-3 shrink-0 transition-transform duration-200 ${
            open ? "rotate-0" : "-rotate-90"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m6 9 6 6 6-6"
          />
        </svg>
      </button>
      {/* Truco grid-rows: 0fr cerrado, 1fr abierto — anima sin medir alto. */}
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-0.5 pt-1 pl-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

function SidebarNavButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition ${
        active
          ? "border border-brand-separator bg-brand-hover text-brand-primary shadow-[inset_3px_0_0_0_var(--brand-accent)] dark:border-brand-accent-soft/35 dark:bg-brand-accent-soft/10 dark:shadow-[inset_3px_0_0_0_var(--brand-accent-soft)]"
          : "border border-transparent text-brand-secondary hover:bg-brand-hover hover:text-brand-primary"
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs ${
          active
            ? "bg-brand-primary text-white dark:bg-brand-accent-soft/20 dark:text-brand-accent-soft"
            : "bg-brand-hover text-brand-tertiary"
        }`}
      >
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
