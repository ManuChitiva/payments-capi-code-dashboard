import type { DashboardSection, DashboardSectionMeta } from "@/types/dashboard";

export const SECTION_META: Record<DashboardSection, DashboardSectionMeta> = {
  resumen: {
    title: "Analítica",
    description:
      "Métricas, interacciones y productos con mayor interés en tu negocio activo.",
  },
  productos: {
    title: "Productos",
    description: "Administra catálogo, precios, stock y estado de publicación.",
  },
  pedidos: {
    title: "Pedidos y pagos",
    description:
      "Consulta pedidos del checkout y el historial de pagos cobrados en tu negocio.",
  },
  tienda: {
    title: "Mi negocio",
    description:
      "Personaliza la identidad de tu marca, datos de contacto y puntos de atención.",
  },
  pagos: {
    title: "Pagos PayU",
    description: "Configura medios de pago y revisa transacciones.",
  },
  personal: {
    title: "Personal",
    description:
      "Gestiona el equipo del negocio: foto, nombre, teléfono y WhatsApp de cada empleado.",
  },
  suscripcion: {
    title: "Mi suscripción",
    description:
      "Consulta tu plan, límites de negocios y opciones para mejorar o comprar un plan.",
  },
};

import { brandActionButtonSolid } from "@/lib/brand-theme";

export const primaryButtonClass = brandActionButtonSolid;
