export type StoreCategoryCode =
  | "NUEVO"
  | "RESTAURANTES"
  | "BARES"
  | "CAFETERIAS"
  | "COMIDA_RAPIDA"
  | "PANADERIA"
  | "LLANTAS"
  | "TECNOLOGIA"
  | "MODA"
  | "BELLEZA"
  | "FARMACIA"
  | "SUPERMERCADO"
  | "FERRETERIA"
  | "AUTOMOTRIZ"
  | "MASCOTAS"
  | "HOGAR"
  | "DEPORTES"
  | "JOYERIA"
  | "LIBRERIA"
  | "SERVICIOS"
  | "OTROS";

export type StoreCategoryOption = {
  code: StoreCategoryCode;
  label: string;
};

export const DEFAULT_STORE_CATEGORY: StoreCategoryCode = "NUEVO";

/** Respaldo si el API no responde (sincronizado con StoreCategory del backend). */
export const FALLBACK_STORE_CATEGORIES: StoreCategoryOption[] = [
  { code: "NUEVO", label: "Nuevo" },
  { code: "RESTAURANTES", label: "Restaurantes" },
  { code: "BARES", label: "Bares" },
  { code: "CAFETERIAS", label: "Cafeterías" },
  { code: "COMIDA_RAPIDA", label: "Comida rápida" },
  { code: "PANADERIA", label: "Panadería y repostería" },
  { code: "LLANTAS", label: "Empresa de llantas y ruedas" },
  { code: "TECNOLOGIA", label: "Tecnología" },
  { code: "MODA", label: "Moda y accesorios" },
  { code: "BELLEZA", label: "Belleza y estética" },
  { code: "FARMACIA", label: "Farmacia y droguería" },
  { code: "SUPERMERCADO", label: "Supermercado y tienda de barrio" },
  { code: "FERRETERIA", label: "Ferretería y construcción" },
  { code: "AUTOMOTRIZ", label: "Automotriz y repuestos" },
  { code: "MASCOTAS", label: "Mascotas y veterinaria" },
  { code: "HOGAR", label: "Hogar y decoración" },
  { code: "DEPORTES", label: "Deportes" },
  { code: "JOYERIA", label: "Joyería y relojería" },
  { code: "LIBRERIA", label: "Librería y papelería" },
  { code: "SERVICIOS", label: "Servicios profesionales" },
  { code: "OTROS", label: "Otros" },
];

const LEGACY_CATEGORY_LABELS: Record<string, string> = {
  ALIMENTOS: "Alimentos y bebidas",
  SALUD: "Salud y farmacia",
  NINOS: "Juguetes y bebés",
  ARTESANIAS: "Artesanías y manualidades",
};

export function isStoreCategoryCode(value: string): value is StoreCategoryCode {
  return FALLBACK_STORE_CATEGORIES.some((c) => c.code === value);
}

export function normalizeStoreCategory(value: string | null | undefined): StoreCategoryCode {
  if (value && isStoreCategoryCode(value)) {
    return value;
  }
  return DEFAULT_STORE_CATEGORY;
}

export function storeCategoryLabel(
  code: string,
  options: StoreCategoryOption[] = FALLBACK_STORE_CATEGORIES,
): string {
  const found = options.find((c) => c.code === code);
  if (found) return found.label;
  if (code && LEGACY_CATEGORY_LABELS[code]) {
    return LEGACY_CATEGORY_LABELS[code];
  }
  return code;
}
