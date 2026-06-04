"use client";

import {
  createEmptyVariantRow,
  type ProductVariantFormRow,
  type VariantPricingMode,
} from "@/lib/product-variants";
import type { ProductFormErrors, VariantFormField } from "@/lib/product-form-validation";
import { productFieldClass } from "@/lib/product-form-validation";
import {
  brandCtaSm,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
} from "@/lib/brand-theme";

type ProductVariantsEditorProps = {
  enabled: boolean;
  basePrice: string;
  variants: ProductVariantFormRow[];
  variantErrors?: ProductFormErrors["variantErrors"];
  variantsSummary?: string;
  showErrors: boolean;
  uploadingVariantId: string | null;
  onEnabledChange: (enabled: boolean) => void;
  onVariantsChange: (variants: ProductVariantFormRow[]) => void;
  onVariantPatch: (localId: string, patch: Partial<ProductVariantFormRow>) => void;
  onVariantImageSelect: (localId: string, file: File) => void;
  onBlurValidate: () => void;
};

export function ProductVariantsEditor({
  enabled,
  basePrice,
  variants,
  variantErrors,
  variantsSummary,
  showErrors,
  uploadingVariantId,
  onEnabledChange,
  onVariantsChange,
  onVariantPatch,
  onVariantImageSelect,
  onBlurValidate,
}: ProductVariantsEditorProps) {
  const fieldError = (localId: string, field: VariantFormField) =>
    showErrors ? variantErrors?.[localId]?.[field] : undefined;

  const addVariant = () => {
    onVariantsChange([...variants, createEmptyVariantRow()]);
  };

  const removeVariant = (localId: string) => {
    onVariantsChange(variants.filter((v) => v.localId !== localId));
  };

  return (
    <section className="space-y-4 rounded-xl border border-brand-separator bg-brand-hover/60 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-brand-primary">Variantes</h3>
          <p className="mt-1 text-xs leading-relaxed text-brand-secondary">
            Color, talla o extra (ej. grabado). En checkout se cobra el precio de
            la variante elegida. Usa{" "}
            <span className="font-medium text-brand-primary">adicional</span> si
            suma al precio base, o{" "}
            <span className="font-medium text-brand-primary">precio total</span>{" "}
            si cada opción tiene su propio valor (ej. otro color).
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onEnabledChange(!enabled)}
          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
            enabled ? "bg-brand-accent" : "bg-brand-tertiary"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {enabled ? (
        <>
          {showErrors && variantsSummary ? (
            <p className="text-xs text-rose-600 dark:text-rose-300" role="alert">
              {variantsSummary}
            </p>
          ) : null}

          <p className="text-xs text-brand-tertiary">
            Precio base de referencia:{" "}
            <span className="font-medium text-brand-secondary">
              {basePrice.trim() ? `$ ${basePrice}` : "define el precio base arriba"}
            </span>
          </p>

          <ul className="space-y-4">
            {variants.map((row, index) => (
              <li
                key={row.localId}
                className="rounded-xl border border-brand-separator bg-brand-surface p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-tertiary">
                    Variante {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeVariant(row.localId)}
                    className="text-xs font-medium text-rose-600 transition hover:text-rose-700 dark:text-rose-300"
                  >
                    Quitar
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block space-y-1 sm:col-span-2">
                    <span className="text-xs font-medium text-brand-primary">
                      Nombre <span className="text-rose-500">*</span>
                    </span>
                    <input
                      value={row.title}
                      onChange={(e) =>
                        onVariantPatch(row.localId, { title: e.target.value })
                      }
                      onBlur={onBlurValidate}
                      placeholder="Ej. Rojo, Talla M, Grabado"
                      className={productFieldClass(Boolean(fieldError(row.localId, "title")))}
                    />
                    <FieldHint error={fieldError(row.localId, "title")} />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-xs font-medium text-brand-primary">SKU</span>
                    <input
                      value={row.sku}
                      onChange={(e) =>
                        onVariantPatch(row.localId, { sku: e.target.value })
                      }
                      onBlur={onBlurValidate}
                      placeholder="Opcional"
                      className={productFieldClass(Boolean(fieldError(row.localId, "sku")))}
                    />
                    <FieldHint error={fieldError(row.localId, "sku")} />
                  </label>

                  <label className="block space-y-1">
                    <span className="text-xs font-medium text-brand-primary">Stock</span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={row.availableQuantity}
                      onChange={(e) =>
                        onVariantPatch(row.localId, {
                          availableQuantity: e.target.value,
                        })
                      }
                      onBlur={onBlurValidate}
                      className={productFieldClass(
                        Boolean(fieldError(row.localId, "availableQuantity")),
                      )}
                    />
                    <FieldHint error={fieldError(row.localId, "availableQuantity")} />
                  </label>

                  <div className="space-y-2 sm:col-span-2">
                    <span className="text-xs font-medium text-brand-primary">
                      Tipo de precio
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <PricingModeChip
                        active={row.pricingMode === "absolute"}
                        label="Precio total"
                        onClick={() =>
                          onVariantPatch(row.localId, {
                            pricingMode: "absolute" satisfies VariantPricingMode,
                          })
                        }
                      />
                      <PricingModeChip
                        active={row.pricingMode === "addon"}
                        label="Adicional al base"
                        onClick={() =>
                          onVariantPatch(row.localId, {
                            pricingMode: "addon" satisfies VariantPricingMode,
                          })
                        }
                      />
                    </div>
                  </div>

                  <label className="block space-y-1 sm:col-span-2">
                    <span className="text-xs font-medium text-brand-primary">
                      {row.pricingMode === "addon"
                        ? "Adicional (COP)"
                        : "Precio de venta (COP)"}{" "}
                      <span className="text-rose-500">*</span>
                    </span>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-brand-tertiary">
                        $
                      </span>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={row.price}
                        onChange={(e) =>
                          onVariantPatch(row.localId, { price: e.target.value })
                        }
                        onBlur={onBlurValidate}
                        placeholder={row.pricingMode === "addon" ? "0" : "0.00"}
                        className={`${productFieldClass(Boolean(fieldError(row.localId, "price")))} pl-8`}
                      />
                    </div>
                    <FieldHint error={fieldError(row.localId, "price")} />
                  </label>

                  <div className="space-y-2 sm:col-span-2">
                    <span className="text-xs font-medium text-brand-primary">
                      Imagen <span className="text-rose-500">*</span>
                    </span>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      {row.imageUrl ? (
                        <img
                          src={row.imageUrl}
                          alt=""
                          className="h-20 w-20 shrink-0 rounded-lg border border-brand-separator object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-brand-separator bg-brand-hover text-brand-tertiary">
                          <span className="text-[10px]">Sin foto</span>
                        </div>
                      )}
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="sr-only"
                          disabled={uploadingVariantId === row.localId}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onVariantImageSelect(row.localId, file);
                            e.target.value = "";
                          }}
                        />
                        <span
                          className={`inline-flex cursor-pointer items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition ${
                            uploadingVariantId === row.localId
                              ? "pointer-events-none border-brand-separator bg-brand-hover text-brand-tertiary"
                              : "border-brand-accent/30 bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/15"
                          }`}
                        >
                          {uploadingVariantId === row.localId
                            ? "Subiendo..."
                            : row.imageUrl
                              ? "Cambiar imagen"
                              : "Subir imagen"}
                        </span>
                      </label>
                    </div>
                    <FieldHint error={fieldError(row.localId, "imageUrl")} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-brand-separator bg-brand-hover px-3 py-2 sm:col-span-2">
                    <span className="text-xs text-brand-secondary">Activa en el negocio</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={row.active}
                      onClick={() =>
                        onVariantPatch(row.localId, { active: !row.active })
                      }
                      className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${
                        row.active ? "bg-brand-accent" : "bg-brand-tertiary"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          row.active ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={addVariant}
            className={`w-full justify-center ${brandCtaSm}`}
          >
            + Agregar variante
          </button>
        </>
      ) : null}
    </section>
  );
}

function PricingModeChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-brand-accent bg-brand-accent/10 text-brand-accent"
          : "border-brand-separator bg-brand-surface text-brand-secondary hover:bg-brand-hover"
      }`}
    >
      {label}
    </button>
  );
}

function FieldHint({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="text-xs text-rose-600 dark:text-rose-300" role="alert">
      {error}
    </p>
  );
}
