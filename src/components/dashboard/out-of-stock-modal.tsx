"use client";

import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/components/dashboard/products-table";
import type { ProductStockChange } from "@/services/productService";
import {
  brandActionButtonSolid,
  brandModalCancelBtn,
  brandModalDesc,
  brandModalFooter,
  brandModalHeader,
  brandModalOverlay,
  brandModalTitle,
} from "@/lib/brand-theme";

const outOfStockModalPanel =
  "flex max-h-[92dvh] w-full max-w-2xl min-w-0 flex-col overflow-hidden rounded-t-3xl border border-brand-separator bg-brand-surface shadow-brand-elevated sm:rounded-3xl";

export type OutOfStockModalProps = {
  open: boolean;
  products: CatalogProduct[];
  saving?: boolean;
  onClose: () => void;
  onSubmit: (changes: ProductStockChange[]) => void;
};

/** Cantidad a sumar al stock actual por fila de producto/variante. */
type RowDraft = {
  parentAdd: number;
  variantAdds: Record<number, number>;
};

function emptyRow(): RowDraft {
  return { parentAdd: 0, variantAdds: {} };
}

function clampNonNegative(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.floor(value);
}

export function OutOfStockModal({
  open,
  products,
  saving = false,
  onClose,
  onSubmit,
}: OutOfStockModalProps) {
  const [drafts, setDrafts] = useState<Record<number, RowDraft>>({});

  const totalAdds = useMemo(() => {
    let total = 0;
    for (const draft of Object.values(drafts)) {
      total += clampNonNegative(draft.parentAdd);
      for (const add of Object.values(draft.variantAdds)) {
        total += clampNonNegative(add);
      }
    }
    return total;
  }, [drafts]);

  if (!open) return null;

  const handleReset = () => setDrafts({});
  const handleClose = () => {
    if (saving) return;
    setDrafts({});
    onClose();
  };

  const handleSubmit = () => {
    const changes: ProductStockChange[] = [];
    for (const product of products) {
      const draft = drafts[product.id];
      if (!draft) continue;
      if (product.hasVariants) {
        const variantDeltas: Record<number, number> = {};
        for (const [variantId, add] of Object.entries(draft.variantAdds)) {
          const qty = clampNonNegative(add);
          if (qty > 0) {
            variantDeltas[Number(variantId)] = qty;
          }
        }
        if (Object.keys(variantDeltas).length > 0) {
          changes.push({
            productId: product.id,
            variantDeltas,
          });
        }
      } else {
        const add = clampNonNegative(draft.parentAdd);
        if (add > 0) {
          changes.push({
            productId: product.id,
            newParentQuantity: product.parentAvailableQuantity + add,
          });
        }
      }
    }
    if (changes.length === 0) {
      onClose();
      return;
    }
    onSubmit(changes);
  };

  const hasAnyDraft = totalAdds > 0;

  return (
    <div
      className={brandModalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="out-of-stock-modal-title"
      onClick={handleClose}
    >
      <div
        className={outOfStockModalPanel}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={brandModalHeader}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                id="out-of-stock-modal-title"
                className={brandModalTitle}
              >
                Reponer productos agotados
              </h3>
              <p className={brandModalDesc}>
                Define cuántas unidades añadir al stock de cada producto. Los
                cambios se aplican al guardar.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-rose-300 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/15 dark:text-rose-200">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 dark:bg-rose-400" />
              {products.length} agotado{products.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {products.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-3">
              {products.map((product) => (
                <OutOfStockRow
                  key={product.id}
                  product={product}
                  draft={drafts[product.id] ?? emptyRow()}
                  disabled={saving}
                  onChange={(next) =>
                    setDrafts((prev) => ({ ...prev, [product.id]: next }))
                  }
                />
              ))}
            </ul>
          )}
        </div>

        <div className={brandModalFooter}>
          <div className="flex w-full items-center justify-between gap-3">
            <p className="text-xs text-brand-tertiary">
              {hasAnyDraft ? (
                <>
                  Vas a reponer{" "}
                  <span className="font-semibold text-brand-primary tabular-nums">
                    {totalAdds}
                  </span>{" "}
                  unidad{totalAdds === 1 ? "" : "es"} en total.
                </>
              ) : (
                "No has añadido unidades todavía."
              )}
            </p>
            <div className="flex items-center gap-2">
              {hasAnyDraft ? (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={saving}
                  className="rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-brand-tertiary transition hover:text-brand-primary disabled:opacity-50"
                >
                  Limpiar
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleClose}
                disabled={saving}
                className={brandModalCancelBtn}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || !hasAnyDraft}
                className={`${brandActionButtonSolid} ${saving ? "opacity-60" : ""}`.trim()}
              >
                {saving ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutOfStockRow({
  product,
  draft,
  disabled,
  onChange,
}: {
  product: CatalogProduct;
  draft: RowDraft;
  disabled?: boolean;
  onChange: (next: RowDraft) => void;
}) {
  const setParentAdd = (next: number) =>
    onChange({ ...draft, parentAdd: clampNonNegative(next) });
  const setVariantAdd = (variantId: number, next: number) =>
    onChange({
      ...draft,
      variantAdds: {
        ...draft.variantAdds,
        [variantId]: clampNonNegative(next),
      },
    });

  return (
    <li className="rounded-2xl border border-brand-separator/70 bg-brand-surface/60 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_2px_10px_-4px_rgba(0,0,0,0.08)] sm:p-4 dark:border-brand-separator dark:bg-white/[0.04] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_14px_-6px_rgba(0,0,0,0.55)]">
      <div className="flex items-start gap-3">
        <ProductThumb product={product} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-brand-primary">
                {product.name}
              </p>
              <p className="mt-0.5 truncate font-mono text-[11px] text-brand-tertiary">
                {product.sku}
                {product.variantCount > 0
                  ? ` · ${product.variantCount} variantes`
                  : ""}
              </p>
            </div>
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
              aria-label={`Stock actual: ${product.stock} unidades`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 dark:bg-rose-400" />
              {product.stock} uds
            </span>
          </div>

          {product.hasVariants ? (
            <div className="mt-3 space-y-2">
              {product.variants.map((variant) => (
                <VariantStockRow
                  key={variant.id}
                  title={variant.title || variant.sku || "Variante"}
                  currentStock={variant.availableQuantity}
                  value={draft.variantAdds[variant.id] ?? 0}
                  disabled={disabled}
                  onChange={(next) => setVariantAdd(variant.id, next)}
                />
              ))}
            </div>
          ) : (
            <div className="mt-3">
              <QuantityStepper
                value={draft.parentAdd}
                disabled={disabled}
                onChange={setParentAdd}
              />
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function VariantStockRow({
  title,
  currentStock,
  value,
  disabled,
  onChange,
}: {
  title: string;
  currentStock: number;
  value: number;
  disabled?: boolean;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-separator/60 bg-brand-hover px-3 py-2 dark:bg-white/[0.04]">
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-brand-primary">
          {title}
        </p>
        <p className="mt-0.5 text-[10px] tracking-wide text-brand-tertiary uppercase tabular-nums">
          Stock actual: {currentStock}
        </p>
      </div>
      <QuantityStepper value={value} disabled={disabled} onChange={onChange} />
    </div>
  );
}

function QuantityStepper({
  value,
  disabled,
  onChange,
}: {
  value: number;
  disabled?: boolean;
  onChange: (next: number) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-brand-separator bg-brand-surface p-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:border-brand-separator dark:bg-white/[0.05]">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={disabled || value <= 0}
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-brand-secondary transition hover:bg-brand-hover hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/10"
        aria-label="Quitar una unidad"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(clampNonNegative(Number(e.target.value)))}
        disabled={disabled}
        className="w-14 bg-transparent text-center text-sm font-medium tabular-nums text-brand-primary outline-none disabled:cursor-not-allowed"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={disabled}
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-brand-secondary transition hover:bg-brand-hover hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-white/10"
        aria-label="Añadir una unidad"
      >
        +
      </button>
    </div>
  );
}

function ProductThumb({ product }: { product: CatalogProduct }) {
  if (product.imageUrl) {
    return (
      <img
        src={product.imageUrl}
        alt=""
        className="h-14 w-14 shrink-0 rounded-xl border border-brand-separator object-cover"
      />
    );
  }
  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-brand-separator bg-brand-hover text-brand-tertiary"
      aria-hidden
    >
      <span className="text-lg font-semibold tabular-nums text-brand-tertiary">
        {product.name.slice(0, 1).toUpperCase()}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-separator bg-brand-hover px-6 py-10 text-center">
      <p className="text-sm font-medium text-brand-primary">
        ¡Sin productos agotados!
      </p>
      <p className="mt-1 max-w-sm text-xs text-brand-tertiary">
        Todos tus productos activos tienen stock. Cuando un producto llegue a
        cero, aparecerá aquí para que puedas reponerlo fácilmente.
      </p>
    </div>
  );
}
