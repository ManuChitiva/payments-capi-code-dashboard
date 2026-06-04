"use client";

import {
  brandInputClass,
  brandNavLinkClass,
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
  | "pagos";

const NAV_ITEMS: {
  id: DashboardSection;
  label: string;
  icon: string;
}[] = [
  { id: "resumen", label: "Resumen", icon: "◈" },
  { id: "productos", label: "Productos", icon: "◉" },
  { id: "pedidos", label: "Pedidos y pagos", icon: "◎" },
  { id: "tienda", label: "Mi negocio", icon: "⌂" },
  { id: "pagos", label: "Pagos PayU", icon: "💳" },
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
  const pickSection = (section: DashboardSection) => {
    onSection(section);
    onClose?.();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6">
        <p className={brandWordmarkClass}>CapiCode</p>
        <p className={brandWordmarkSubClass}>Gestión de negocios</p>
      </div>

      {stores.length > 0 ? (
        <div className="rounded-2xl border border-brand-separator bg-brand-surface p-3">
          <p className="text-[10px] font-medium tracking-[0.14em] text-brand-secondary uppercase">
            Negocio activo
          </p>
          <div className="relative mt-2">
            <select
              value={activeStoreId ?? ""}
              onChange={(e) => onStoreChange(Number(e.target.value))}
              className={`${brandInputClass} py-2.5 pr-9 pl-3 text-sm`}
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
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[10px] text-brand-tertiary"
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
            className="mt-2.5 w-full rounded-lg border border-dashed border-brand-input-border py-2 text-xs font-medium text-brand-secondary transition hover:border-brand-accent-soft hover:bg-brand-hover hover:text-brand-accent-soft"
          >
            + Añadir negocio
          </button>
        </div>
      ) : null}

      <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Secciones">
        <p className="mb-2 px-1 text-[10px] font-semibold tracking-[0.18em] text-brand-tertiary uppercase">
          Menú
        </p>
        {NAV_ITEMS.map((item) => (
          <SidebarNavButton
            key={item.id}
            label={item.label}
            icon={item.icon}
            active={activeSection === item.id}
            onClick={() => pickSection(item.id)}
          />
        ))}
      </nav>

      <div className="mt-6 border-t border-brand-separator pt-4">
        <p className={`truncate text-sm font-medium ${brandTextPrimary}`}>
          {clientName}
        </p>
        <p className={`truncate text-xs ${brandTextTertiary}`}>{clientEmail}</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 w-full rounded-xl border border-brand-separator bg-brand-hover px-3 py-2 text-sm text-brand-secondary transition hover:bg-brand-surface-hover hover:text-brand-primary"
        >
          Cerrar sesión
        </button>
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
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
        active
          ? "border border-brand-separator bg-brand-hover text-brand-primary shadow-[inset_3px_0_0_0_var(--brand-accent)] dark:border-brand-accent-soft/35 dark:bg-brand-accent-soft/10 dark:shadow-[inset_3px_0_0_0_var(--brand-accent-soft)]"
          : "border border-transparent text-brand-secondary hover:bg-brand-hover hover:text-brand-primary"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs ${
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
