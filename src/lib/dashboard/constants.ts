import type { DashboardSection, DashboardSectionMeta } from "@/types/dashboard";

export const SECTION_META: Record<DashboardSection, DashboardSectionMeta> = {
  resumen: {
    title: "Resumen",
    description:
      "Métricas, interacciones y productos con mayor interés en tu tienda activa.",
  },
  productos: {
    title: "Productos",
    description: "Administra catálogo, precios, stock y estado de publicación.",
  },
  tienda: {
    title: "Mi tienda",
    description:
      "Personaliza la identidad de tu marca, datos de contacto y puntos de recogida.",
  },
  pagos: {
    title: "Pagos PayU",
    description: "Configura medios de pago y revisa transacciones.",
  },
};

export const primaryButtonClass =
  "rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-4 py-2.5 text-sm font-medium text-emerald-100 transition hover:bg-emerald-500/25";
