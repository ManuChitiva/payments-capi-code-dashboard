/** Límites alineados con {@code ProductCreateRequest} del backend. */
import {
  parseBasePrice,
  resolveVariantApiPrice,
  type ProductVariantFormRow,
} from "@/lib/product-variants";

export const PRODUCT_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  descriptionMax: 4000,
  imageUrlMax: 512,
  priceMin: 0.01,
  priceMax: 99_999_999.99,
  stockMin: 0,
  stockMax: 999_999,
  variantTitleMax: 255,
  variantSkuMax: 64,
} as const;

export type ProductFormValues = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  availableQuantity: string;
  active: boolean;
  hasVariants: boolean;
  variants: ProductVariantFormRow[];
};

export type ProductFormField =
  | "name"
  | "description"
  | "price"
  | "availableQuantity"
  | "imageUrl";

export type VariantFormField =
  | "title"
  | "imageUrl"
  | "price"
  | "availableQuantity"
  | "sku";

export type ProductFormErrors = Partial<Record<ProductFormField, string>> & {
  variantsSummary?: string;
  variantErrors?: Record<string, Partial<Record<VariantFormField, string>>>;
};

function validatePriceField(
  priceRaw: string,
  options: { required: boolean; min?: number; label: string },
): string | undefined {
  if (!priceRaw) {
    return options.required ? `${options.label} es obligatorio.` : undefined;
  }
  const price = Number(priceRaw);
  if (!Number.isFinite(price)) {
    return "Ingresa un valor numérico válido.";
  }
  const min = options.min ?? 0;
  if (price < min) {
    return min > 0
      ? `Debe ser al menos ${min}.`
      : "No puede ser negativo.";
  }
  if (price > PRODUCT_LIMITS.priceMax) {
    return `No puede superar ${PRODUCT_LIMITS.priceMax.toLocaleString("es-CO")}.`;
  }
  if (!/^\d+(\.\d{1,2})?$/.test(priceRaw)) {
    return "Usa hasta 2 decimales (ej: 19.99).";
  }
  return undefined;
}

function validateVariantRow(
  row: ProductVariantFormRow,
  basePrice: number,
): Partial<Record<VariantFormField, string>> {
  const rowErrors: Partial<Record<VariantFormField, string>> = {};

  const title = row.title.trim();
  if (!title) {
    rowErrors.title = "Nombre de la variante obligatorio.";
  } else if (title.length > PRODUCT_LIMITS.variantTitleMax) {
    rowErrors.title = `Máximo ${PRODUCT_LIMITS.variantTitleMax} caracteres.`;
  }

  if (row.sku.trim().length > PRODUCT_LIMITS.variantSkuMax) {
    rowErrors.sku = `Máximo ${PRODUCT_LIMITS.variantSkuMax} caracteres.`;
  }

  const imageUrl = row.imageUrl.trim();
  if (!imageUrl) {
    rowErrors.imageUrl = "Sube una imagen para esta variante.";
  } else if (imageUrl.length > PRODUCT_LIMITS.imageUrlMax) {
    rowErrors.imageUrl = "URL de imagen demasiado larga.";
  }

  const priceLabel =
    row.pricingMode === "addon" ? "El adicional" : "El precio";
  const priceErr = validatePriceField(row.price.trim(), {
    required: true,
    min: row.pricingMode === "addon" ? 0 : PRODUCT_LIMITS.priceMin,
    label: priceLabel,
  });
  if (priceErr) {
    rowErrors.price = priceErr;
  } else {
    const resolved = resolveVariantApiPrice(basePrice, row);
    if (!Number.isFinite(resolved) || resolved < PRODUCT_LIMITS.priceMin) {
      rowErrors.price =
        row.pricingMode === "addon"
          ? `Base + adicional debe ser al menos ${PRODUCT_LIMITS.priceMin}.`
          : `El precio debe ser al menos ${PRODUCT_LIMITS.priceMin}.`;
    }
  }

  const stockRaw = row.availableQuantity.trim();
  if (!stockRaw) {
    rowErrors.availableQuantity = "Stock obligatorio.";
  } else {
    const stock = Number(stockRaw);
    if (!Number.isInteger(stock)) {
      rowErrors.availableQuantity = "Debe ser un número entero.";
    } else if (stock < PRODUCT_LIMITS.stockMin) {
      rowErrors.availableQuantity = "No puede ser negativo.";
    } else if (stock > PRODUCT_LIMITS.stockMax) {
      rowErrors.availableQuantity = `Máximo ${PRODUCT_LIMITS.stockMax.toLocaleString("es-CO")} unidades.`;
    }
  }

  return rowErrors;
}

export function validateProductForm(
  values: ProductFormValues,
  resolvedImageUrl: string,
): ProductFormErrors {
  const errors: ProductFormErrors = {};
  const basePrice = parseBasePrice(values.price);

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

  const priceErr = validatePriceField(values.price.trim(), {
    required: true,
    min: PRODUCT_LIMITS.priceMin,
    label: values.hasVariants ? "El precio base" : "El precio",
  });
  if (priceErr) errors.price = priceErr;

  if (!values.hasVariants) {
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
  }

  const imageUrl = resolvedImageUrl.trim();
  if (!imageUrl) {
    errors.imageUrl = "Sube una imagen del producto.";
  } else if (imageUrl.length > PRODUCT_LIMITS.imageUrlMax) {
    errors.imageUrl =
      "La URL de la imagen es demasiado larga; vuelve a subir el archivo.";
  }

  if (values.hasVariants) {
    if (values.variants.length === 0) {
      errors.variantsSummary = "Agrega al menos una variante.";
    } else {
      const variantErrors: ProductFormErrors["variantErrors"] = {};
      for (const row of values.variants) {
        const rowErr = validateVariantRow(row, basePrice);
        if (Object.keys(rowErr).length > 0) {
          variantErrors[row.localId] = rowErr;
        }
      }
      if (Object.keys(variantErrors).length > 0) {
        errors.variantErrors = variantErrors;
      }
    }
  }

  return errors;
}

export function productFormHasErrors(errors: ProductFormErrors): boolean {
  if (errors.variantsSummary) return true;
  if (errors.variantErrors) {
    const hasVariantFieldError = Object.values(errors.variantErrors).some(
      (row) => row && Object.keys(row).length > 0,
    );
    if (hasVariantFieldError) return true;
  }
  const { variantsSummary: _s, variantErrors: _v, ...fieldErrors } = errors;
  return Object.keys(fieldErrors).length > 0;
}

export function productFieldClass(hasError: boolean): string {
  return [
    "w-full rounded-xl border bg-brand-input px-3.5 py-2.5 text-sm text-brand-primary outline-none transition placeholder:text-brand-tertiary",
    hasError
      ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:border-rose-500/70 dark:focus:border-rose-400 dark:focus:ring-rose-500/25"
      : "border-brand-input-border focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 dark:focus:border-brand-accent-soft dark:focus:ring-brand-accent-soft/25",
  ].join(" ");
}
