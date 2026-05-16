"use client";

type StoreOption = {
  id: number;
  name: string;
};

export type DashboardSection = "resumen" | "productos" | "tienda" | "pagos";

const NAV_ITEMS: {
  id: DashboardSection;
  label: string;
  icon: string;
}[] = [
  { id: "resumen", label: "Resumen", icon: "◈" },
  { id: "productos", label: "Productos", icon: "◉" },
  { id: "tienda", label: "Mi tienda", icon: "⌂" },
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
        <p className="font-(family-name:--font-rajdhani) text-lg font-semibold tracking-wide text-teal-100">
          CapiCode
        </p>
        <p className="mt-0.5 text-xs text-slate-500">Panel administrativo</p>
      </div>

      {stores.length > 0 ? (
        <div className="rounded-2xl border border-teal-500/15 bg-teal-500/[0.06] p-3">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-teal-300/90 uppercase">
            Tienda activa
          </p>
          <div className="relative mt-2">
            <select
              value={activeStoreId ?? ""}
              onChange={(e) => onStoreChange(Number(e.target.value))}
              className="w-full appearance-none rounded-xl border border-white/10 bg-black/50 py-2.5 pr-9 pl-3 text-sm text-slate-100 outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30"
            >
              {stores.map((store) => (
                <option
                  key={store.id}
                  value={store.id}
                  className="bg-slate-950"
                >
                  {store.name}
                </option>
              ))}
            </select>
            <span
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[10px] text-slate-500"
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
            className="mt-2.5 w-full rounded-lg border border-dashed border-teal-500/25 py-2 text-xs font-medium text-teal-300/90 transition hover:border-teal-400/40 hover:bg-teal-500/10 hover:text-teal-200"
          >
            + Añadir tienda
          </button>
        </div>
      ) : null}

      <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Secciones">
        <p className="mb-2 px-1 text-[10px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
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

      <div className="mt-6 border-t border-white/10 pt-4">
        <p className="truncate text-sm font-medium text-slate-200">
          {clientName}
        </p>
        <p className="truncate text-xs text-slate-500">{clientEmail}</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-slate-100"
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
          ? "border border-teal-500/30 bg-teal-500/10 text-teal-100 shadow-[inset_3px_0_0_0_rgba(45,212,191,0.7)]"
          : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-100"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs ${
          active ? "bg-teal-500/20 text-teal-200" : "bg-white/5 text-slate-500"
        }`}
      >
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
