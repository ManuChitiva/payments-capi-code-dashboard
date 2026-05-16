/** Límites alineados con {@code ProductCreateRequest} del backend. */
export const PRODUCT_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  descriptionMax: 4000,
  imageUrlMax: 512,
  priceMin: 0.01,
  priceMax: 99_999_999.99,
  stockMin: 0,
  stockMax: 999_999,
} as const;

export type ProductFormValues = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  availableQuantity: string;
  active: boolean;
};

export type ProductFormField =
  | "name"
  | "description"
  | "price"
  | "availableQuantity"
  | "imageUrl";

export type ProductFormErrors = Partial<Record<ProductFormField, string>>;

export function validateProductForm(
  values: ProductFormValues,
  resolvedImageUrl: string,
): ProductFormErrors {
  const errors: ProductFormErrors = {};

  const name = values.name.trim();
  if (!name) {
    errors.name = "El nombre es obligatorio.";
  } else if (name.length < PRODUCT_LIMITS.nameMin) {
    errors.name = `Mínimo ${PRODUCT_LIMITS.nameMin} caracteres.`;
  } else if (name.length > PRODUCT_LIMITS.nameMax) {
    errors.name = `Máximo ${PRODUCT_LIMITS.nameMax} caracteres.`;
  }

  const description = values.description;
  if (description.length > PRODUCT_LIMITS.descriptionMax) {
    errors.description = `Máximo ${PRODUCT_LIMITS.descriptionMax} caracteres.`;
  }

  const priceRaw = values.price.trim();
  if (!priceRaw) {
    errors.price = "El precio es obligatorio.";
  } else {
    const price = Number(priceRaw);
    if (!Number.isFinite(price)) {
      errors.price = "Ingresa un precio válido.";
    } else if (price < PRODUCT_LIMITS.priceMin) {
      errors.price = `El precio debe ser al menos ${PRODUCT_LIMITS.priceMin}.`;
    } else if (price > PRODUCT_LIMITS.priceMax) {
      errors.price = `El precio no puede superar ${PRODUCT_LIMITS.priceMax.toLocaleString("es-CO")}.`;
    } else if (!/^\d+(\.\d{1,2})?$/.test(priceRaw)) {
      errors.price = "Usa hasta 2 decimales (ej: 19.99).";
    }
  }

  const stockRaw = values.availableQuantity.trim();
  if (!stockRaw) {
    errors.availableQuantity = "El stock es obligatorio.";
  } else {
    const stock = Number(stockRaw);
    if (!Number.isInteger(stock)) {
      errors.availableQuantity = "El stock debe ser un número entero.";
    } else if (stock < PRODUCT_LIMITS.stockMin) {
      errors.availableQuantity = "El stock no puede ser negativo.";
    } else if (stock > PRODUCT_LIMITS.stockMax) {
      errors.availableQuantity = `Máximo ${PRODUCT_LIMITS.stockMax.toLocaleString("es-CO")} unidades.`;
    }
  }

  const imageUrl = resolvedImageUrl.trim();
  if (!imageUrl) {
    errors.imageUrl = "Sube una imagen del producto.";
  } else if (imageUrl.length > PRODUCT_LIMITS.imageUrlMax) {
    errors.imageUrl = "La URL de la imagen es demasiado larga; vuelve a subir el archivo.";
  }

  return errors;
}

export function productFormHasErrors(errors: ProductFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function productFieldClass(hasError: boolean): string {
  return [
    "w-full rounded-xl border bg-white/[0.04] px-3.5 py-2.5 text-sm text-slate-100 outline-none transition",
    hasError
      ? "border-rose-500/70 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/25"
      : "border-white/10 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15",
  ].join(" ");
}
