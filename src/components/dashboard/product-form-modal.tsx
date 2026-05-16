"use client";

import { useId, useRef, type ReactNode } from "react";
import {
  PRODUCT_LIMITS,
  productFieldClass,
  type ProductFormErrors,
} from "@/lib/product-form-validation";

export type ProductFormValues = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  availableQuantity: string;
  active: boolean;
};

type ProductFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  values: ProductFormValues;
  errors: ProductFormErrors;
  showErrors: boolean;
  saving: boolean;
  uploadingMedia: boolean;
  imagePreviewUrl: string;
  formError?: string;
  onClose: () => void;
  onSave: () => void;
  onChange: (patch: Partial<ProductFormValues>) => void;
  onBlurValidate: () => void;
  onImageSelect: (file: File) => void;
};

export function ProductFormModal({
  open,
  mode,
  values,
  errors,
  showErrors,
  saving,
  uploadingMedia,
  imagePreviewUrl,
  formError,
  onClose,
  onSave,
  onChange,
  onBlurValidate,
  onImageSelect,
}: ProductFormModalProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const isEdit = mode === "edit";
  const hasImage = Boolean(imagePreviewUrl.trim());

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-form-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#04060a]/80 backdrop-blur-md"
        aria-label="Cerrar"
        onClick={onClose}
      />

      <div className="relative flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[#0a0e14] shadow-2xl shadow-black/50 sm:rounded-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/8 px-5 py-4 sm:px-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-emerald-400/90">
              Catalogo
            </p>
            <h2
              id="product-form-title"
              className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl"
            >
              {isEdit ? "Editar producto" : "Nuevo producto"}
            </h2>
            <p className="mt-1 max-w-md text-sm text-slate-400">
              {isEdit
                ? "Actualiza la ficha que ven tus clientes en la tienda."
                : "Completa la informacion y publica el articulo en tu tienda."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Cerrar formulario"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-5 lg:gap-8">
            {/* Form */}
            <div className="space-y-6 lg:col-span-3">
              <section>
                <SectionTitle>Informacion general</SectionTitle>
                <div className="space-y-4">
                  <Field
                    label="Nombre"
                    required
                    error={showErrors ? errors.name : undefined}
                    counter={
                      <CharCounter
                        current={values.name.length}
                        max={PRODUCT_LIMITS.nameMax}
                      />
                    }
                  >
                    <input
                      value={values.name}
                      maxLength={PRODUCT_LIMITS.nameMax}
                      onChange={(e) =>
                        onChange({
                          name: e.target.value.slice(0, PRODUCT_LIMITS.nameMax),
                        })
                      }
                      onBlur={onBlurValidate}
                      placeholder="Ej. Camiseta oversize negra"
                      aria-invalid={Boolean(showErrors && errors.name)}
                      className={productFieldClass(Boolean(showErrors && errors.name))}
                    />
                  </Field>

                  <Field
                    label="Descripcion"
                    error={showErrors ? errors.description : undefined}
                    counter={
                      <CharCounter
                        current={values.description.length}
                        max={PRODUCT_LIMITS.descriptionMax}
                      />
                    }
                  >
                    <textarea
                      value={values.description}
                      maxLength={PRODUCT_LIMITS.descriptionMax}
                      onChange={(e) =>
                        onChange({
                          description: e.target.value.slice(
                            0,
                            PRODUCT_LIMITS.descriptionMax,
                          ),
                        })
                      }
                      onBlur={onBlurValidate}
                      placeholder="Material, tallas, cuidados o detalles que ayuden a vender..."
                      rows={4}
                      aria-invalid={Boolean(showErrors && errors.description)}
                      className={`${productFieldClass(Boolean(showErrors && errors.description))} resize-none`}
                    />
                  </Field>
                </div>
              </section>

              <section>
                <SectionTitle>Precio e inventario</SectionTitle>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Precio de venta"
                    required
                    error={showErrors ? errors.price : undefined}
                  >
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                        $
                      </span>
                      <input
                        type="number"
                        min={PRODUCT_LIMITS.priceMin}
                        max={PRODUCT_LIMITS.priceMax}
                        step="0.01"
                        value={values.price}
                        onChange={(e) => onChange({ price: e.target.value })}
                        onBlur={onBlurValidate}
                        placeholder="0.00"
                        aria-invalid={Boolean(showErrors && errors.price)}
                        className={`${productFieldClass(Boolean(showErrors && errors.price))} pl-8`}
                      />
                    </div>
                  </Field>

                  <Field
                    label="Unidades en stock"
                    required
                    error={showErrors ? errors.availableQuantity : undefined}
                  >
                    <input
                      type="number"
                      min={PRODUCT_LIMITS.stockMin}
                      max={PRODUCT_LIMITS.stockMax}
                      step="1"
                      value={values.availableQuantity}
                      onChange={(e) => {
                        const raw = e.target.value;
                        onChange({
                          availableQuantity:
                            raw === "" || Number(raw) < 0
                              ? raw
                              : raw.replace(/\./g, ""),
                        });
                      }}
                      onBlur={onBlurValidate}
                      placeholder="0"
                      aria-invalid={Boolean(
                        showErrors && errors.availableQuantity,
                      )}
                      className={productFieldClass(
                        Boolean(showErrors && errors.availableQuantity),
                      )}
                    />
                  </Field>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      Visible en la tienda
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {values.active
                        ? "Los clientes pueden ver y comprar este producto."
                        : "Queda oculto hasta que lo actives."}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={values.active}
                    onClick={() => onChange({ active: !values.active })}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                      values.active ? "bg-emerald-500" : "bg-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        values.active ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </section>
            </div>

            {/* Image panel */}
            <div className="lg:col-span-2">
              <section
                className={`flex h-full flex-col rounded-xl border p-4 ${
                  showErrors && errors.imageUrl
                    ? "border-rose-500/50 bg-rose-500/[0.04]"
                    : "border-white/8 bg-white/[0.02]"
                }`}
              >
                <SectionTitle>Imagen del producto</SectionTitle>
                <p className="-mt-2 mb-4 text-xs text-slate-500">
                  Recomendado: cuadrada, min. 800×800 px. JPG, PNG o WEBP.
                </p>

                <div
                  className={`relative mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border border-dashed ${
                    hasImage
                      ? "border-white/10 bg-black/40"
                      : "border-white/15 bg-black/25"
                  }`}
                >
                  {hasImage && !uploadingMedia ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Vista previa"
                      className="h-full w-full object-cover"
                    />
                  ) : uploadingMedia ? (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-400/30 border-t-emerald-400" />
                      <span className="text-xs">Subiendo imagen...</span>
                    </div>
                  ) : (
                    <div className="px-4 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-slate-500">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-slate-400">Sin imagen</p>
                      <p className="mt-1 text-xs text-slate-600">
                        Sube la foto principal del producto
                      </p>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  id={fileInputId}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  disabled={uploadingMedia}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImageSelect(file);
                    e.target.value = "";
                  }}
                />

                <label
                  htmlFor={fileInputId}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                    uploadingMedia
                      ? "pointer-events-none border-white/10 bg-white/5 text-slate-500"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20"
                  }`}
                >
                  {hasImage ? "Cambiar imagen" : "Subir imagen"}
                </label>

                {hasImage && !uploadingMedia ? (
                  <p className="mt-3 flex items-center gap-2 text-xs text-emerald-300/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Imagen lista para guardar
                  </p>
                ) : null}

                <FieldError show={showErrors} message={errors.imageUrl} />
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col gap-3 border-t border-white/8 bg-[#080b10]/90 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
          {formError ? (
            <p
              className="text-sm text-rose-300 sm:mr-auto"
              role="alert"
            >
              {formError}
            </p>
          ) : (
            <p className="hidden text-xs text-slate-500 sm:mr-auto sm:block">
              Los campos con <span className="text-rose-400">*</span> son
              obligatorios.
            </p>
          )}
          <div className="flex gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={saving || uploadingMedia}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-50 sm:flex-none"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving || uploadingMedia}
              className="flex-1 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-50 sm:flex-none"
            >
              {saving
                ? isEdit
                  ? "Guardando..."
                  : "Creando..."
                : isEdit
                  ? "Guardar cambios"
                  : "Publicar producto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
      {children}
    </h3>
  );
}

function Field({
  label,
  required,
  error,
  counter,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  counter?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-sm font-medium ${error ? "text-rose-300" : "text-slate-300"}`}
        >
          {label}
          {required ? <span className="ml-0.5 text-rose-400">*</span> : null}
        </span>
        {counter}
      </div>
      {children}
      <FieldError show={Boolean(error)} message={error} />
    </label>
  );
}

function FieldError({
  show,
  message,
}: {
  show: boolean;
  message?: string;
}) {
  if (!show || !message) return null;
  return (
    <p className="text-xs text-rose-300" role="alert">
      {message}
    </p>
  );
}

function CharCounter({ current, max }: { current: number; max: number }) {
  const warn = current / max >= 0.9;
  return (
    <span
      className={`text-[11px] tabular-nums ${warn ? "text-amber-400" : "text-slate-600"}`}
    >
      {current}/{max}
    </span>
  );
}
