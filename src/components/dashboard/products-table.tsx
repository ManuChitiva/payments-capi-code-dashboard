"use client";

import { useMemo, useState } from "react";
import { ConfirmActionModal } from "@/components/dashboard/modals/confirm-action-modal";
import {
  brandActionButtonSolid,
  brandInputClass,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
  dashboardFilterActive,
  dashboardFilterIdle,
  dashboardInputFocus,
  dashboardStatusBadge,
} from "@/lib/brand-theme";

const PAGE_SIZE = 5;

export type ProductStatus = "activo" | "inactivo" | "agotado";

import type { ProductVariantApi } from "@/lib/product-variants";
import { formatCatalogPrice } from "@/services/productService";

export type CatalogProduct = {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  /** Precio del producto padre en API (referencia / base) */
  basePrice: number;
  /** "desde" cuando hay variantes con precios distintos */
  priceLabel?: string;
  imageUrl: string;
  stock: number;
  status: ProductStatus;
  active: boolean;
  updatedAt: string;
  hasVariants: boolean;
  variantCount: number;
  variants: ProductVariantApi[];
};

type ProductsTableProps = {
  products: CatalogProduct[];
  /** Totales del catálogo (todos los estados); si no se pasa, usa {@link products}. */
  statsProducts?: CatalogProduct[];
  query: string;
  statusFilter: "todos" | ProductStatus;
  onQueryChange: (value: string) => void;
  onStatusFilterChange: (value: "todos" | ProductStatus) => void;
  onEdit: (product: CatalogProduct) => void;
  onToggleActive: (productId: number, active: boolean) => void;
  onCreate: () => void;
};

const STATUS_FILTERS: Array<{ id: "todos" | ProductStatus; label: string }> = [
  { id: "todos", label: "Todos" },
  { id: "activo", label: "Activos" },
  { id: "agotado", label: "Agotados" },
  { id: "inactivo", label: "Inactivos" },
];

const statusConfig: Record<
  ProductStatus,
  { label: string; dot: string; badge: string }
> = {
  activo: {
    label: "Activo",
    dot: "bg-brand-accent dark:bg-emerald-400",
    badge: `${dashboardStatusBadge} dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200`,
  },
  inactivo: {
    label: "Inactivo",
    dot: "bg-brand-tertiary",
    badge: dashboardStatusBadge,
  },
  agotado: {
    label: "Agotado",
    dot: "bg-brand-tertiary dark:bg-rose-400",
    badge: `${dashboardStatusBadge} dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200`,
  },
};

export function ProductsTable({
  products,
  statsProducts,
  query,
  statusFilter,
  onQueryChange,
  onStatusFilterChange,
  onEdit,
  onToggleActive,
  onCreate,
}: ProductsTableProps) {
  const paginationKey = useMemo(
    () => `${query}\0${statusFilter}\0${products.length}`,
    [query, statusFilter, products.length],
  );
  const [pagesByFilter, setPagesByFilter] = useState<Record<string, number>>(
    {},
  );
  const [pendingToggle, setPendingToggle] = useState<{
    product: CatalogProduct;
    willActivate: boolean;
  } | null>(null);

  const handleConfirmToggle = () => {
    if (!pendingToggle) return;
    onToggleActive(pendingToggle.product.id, pendingToggle.willActivate);
    setPendingToggle(null);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "todos" || product.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [products, query, statusFilter]);

  const statsSource = statsProducts ?? products;

  const stats = useMemo(() => {
    return {
      total: statsSource.length,
      activo: statsSource.filter((p) => p.status === "activo").length,
      agotado: statsSource.filter((p) => p.status === "agotado").length,
      inactivo: statsSource.filter((p) => p.status === "inactivo").length,
    };
  }, [statsSource]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = pagesByFilter[paginationKey] ?? 0;
  const safePage = Math.min(page, totalPages - 1);

  const setPage = (next: number | ((prev: number) => number)) => {
    setPagesByFilter((prev) => {
      const current = prev[paginationKey] ?? 0;
      const resolved = typeof next === "function" ? next(current) : next;
      return { ...prev, [paginationKey]: resolved };
    });
  };

  const paginated = useMemo(() => {
    const start = safePage * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const rangeStart = filtered.length === 0 ? 0 : safePage * PAGE_SIZE + 1;
  const rangeEnd = Math.min(filtered.length, (safePage + 1) * PAGE_SIZE);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Activos" value={stats.activo} />
        <StatCard label="Agotados" value={stats.agotado} />
        <StatCard label="Inactivos" value={stats.inactivo} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-md">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-tertiary" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar por nombre o SKU..."
            className={`w-full rounded-xl border border-brand-separator bg-brand-surface py-2.5 pl-10 pr-4 text-sm text-brand-primary outline-none transition placeholder:text-brand-tertiary ${dashboardInputFocus}`}
          />
        </div>
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-brand-separator bg-brand-hover p-1">
          {STATUS_FILTERS.map((filter) => {
            const active = statusFilter === filter.id;
            const count =
              filter.id === "todos"
                ? stats.total
                : stats[filter.id as ProductStatus];
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onStatusFilterChange(filter.id)}
                className={active ? dashboardFilterActive : dashboardFilterIdle}
              >
                {filter.label}
                <span
                  className={`ml-1.5 tabular-nums ${active ? "text-white/80" : "text-brand-tertiary"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table / empty */}
      {filtered.length === 0 ? (
        <EmptyState
          hasProducts={products.length > 0}
          onCreate={onCreate}
          onClearFilters={() => {
            onQueryChange("");
            onStatusFilterChange("todos");
          }}
        />
      ) : (
        <>
          <p className="text-xs text-brand-tertiary">
            Mostrando{" "}
            <span className="font-medium text-brand-secondary">
              {rangeStart}–{rangeEnd}
            </span>{" "}
            de{" "}
            <span className="font-medium text-brand-secondary">
              {filtered.length}
            </span>
            {filtered.length !== products.length ? (
              <> (catálogo: {products.length})</>
            ) : null}
          </p>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-brand-separator md:block">
            <table className="w-full table-fixed text-left text-sm">
              <colgroup>
                <col className="w-[32%] sm:w-[28%]" />
                <col className="w-[14%]" />
                <col className="w-[10%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
                <col className="w-[16%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-brand-separator bg-brand-hover text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-tertiary">
                  <th className="px-4 py-3.5">Producto</th>
                  <th className="px-4 py-3.5 text-right">Precio</th>
                  <th className="px-4 py-3.5 text-center">Stock</th>
                  <th className="px-4 py-3.5">Estado</th>
                  <th className="hidden px-4 py-3.5 lg:table-cell">
                    Actualizado
                  </th>
                  <th className="px-4 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {paginated.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    layout="table"
                    onEdit={onEdit}
                    onRequestToggleActive={setPendingToggle}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {paginated.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                layout="card"
                onEdit={onEdit}
                onRequestToggleActive={setPendingToggle}
              />
            ))}
          </div>

          {totalPages > 1 ? (
            <ProductsPagination
              page={safePage}
              totalPages={totalPages}
              totalItems={filtered.length}
              onPageChange={setPage}
            />
          ) : null}
        </>
      )}

      <ConfirmActionModal
        open={pendingToggle !== null}
        title={
          pendingToggle?.willActivate
            ? "¿Activar producto?"
            : "¿Desactivar producto?"
        }
        description={
          pendingToggle ? (
            <>
              <span
                className="font-medium text-brand-primary wrap-anywhere"
                title={pendingToggle.product.name}
              >
                &ldquo;{pendingToggle.product.name}&rdquo;
              </span>{" "}
              {pendingToggle.willActivate
                ? "volverá a mostrarse en tu negocio. ¿Estás seguro de que quieres activarlo?"
                : "dejará de mostrarse en tu negocio. ¿Estás seguro de que quieres desactivarlo?"}
            </>
          ) : null
        }
        confirmLabel={
          pendingToggle?.willActivate ? "Sí, activar" : "Sí, desactivar"
        }
        variant={pendingToggle?.willActivate ? "success" : "danger"}
        onClose={() => setPendingToggle(null)}
        onConfirm={handleConfirmToggle}
      />
    </div>
  );
}

function ProductRow({
  product,
  layout,
  onEdit,
  onRequestToggleActive,
}: {
  product: CatalogProduct;
  layout: "table" | "card";
  onEdit: (product: CatalogProduct) => void;
  onRequestToggleActive: (pending: {
    product: CatalogProduct;
    willActivate: boolean;
  }) => void;
}) {
  const status = statusConfig[product.status];
  const stockLevel = stockIndicator(product.stock);
  const willActivate = !product.active;

  const handleToggleActive = () => {
    onRequestToggleActive({ product, willActivate });
  };

  if (layout === "card") {
    return (
      <article className="rounded-xl border border-brand-separator bg-brand-hover p-4">
        <div className="flex gap-3">
          <ProductThumb product={product} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <ProductName
                  name={product.name}
                  className="max-w-[200px] sm:max-w-none"
                />
                <p className="mt-0.5 font-mono text-[11px] text-brand-tertiary">
                  {product.sku}
                  {product.variantCount > 0
                    ? ` · ${product.variantCount} variantes`
                    : ""}
                </p>
              </div>
              <StatusBadge status={product.status} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className={`font-semibold ${brandTextPrimary}`}>
                {formatCatalogPrice(product)}
              </span>
              <span className={stockLevel.className}>
                {product.stock} uds · {stockLevel.label}
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <ActionButton variant="edit" onClick={() => onEdit(product)} />
              <ActionButton
                variant={willActivate ? "activate" : "deactivate"}
                onClick={handleToggleActive}
              />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <tr className="group transition hover:bg-brand-hover">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <ProductThumb product={product} size="md" />
          <div className="min-w-0 flex-1 overflow-hidden">
            <ProductName name={product.name} />
            <p className="mt-0.5 truncate font-mono text-[11px] text-brand-tertiary">
              {product.sku}
              {product.variantCount > 0
                ? ` · ${product.variantCount} var.`
                : ""}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-right font-medium tabular-nums text-brand-primary">
        {formatCatalogPrice(product)}
      </td>
      <td className="px-4 py-3 text-center">
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium tabular-nums ${stockLevel.chipClass}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${stockLevel.dotClass}`} />
          {product.stock}
        </span>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={product.status} />
      </td>
      <td className="hidden px-4 py-3 text-brand-tertiary lg:table-cell">
        {formatDate(product.updatedAt)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1 opacity-90 transition group-hover:opacity-100">
          <ActionButton variant="edit" onClick={() => onEdit(product)} />
          <ActionButton
            variant={willActivate ? "activate" : "deactivate"}
            onClick={handleToggleActive}
          />
        </div>
      </td>
    </tr>
  );
}

function ProductsPagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-brand-separator pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-brand-tertiary">
        Página <span className="font-medium text-brand-secondary">{page + 1}</span> de{" "}
        <span className="font-medium text-brand-secondary">{totalPages}</span>
        <span className="text-brand-tertiary"> · {totalItems} productos</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 0}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-brand-separator bg-brand-hover px-3 py-1.5 text-sm text-brand-primary transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>
        <div className="hidden items-center gap-1 sm:flex">
          {Array.from({ length: totalPages }, (_, i) => {
            const show =
              i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1;
            if (!show) {
              if (i === page - 2 || i === page + 2) {
                return (
                  <span key={i} className="px-1 text-brand-tertiary">
                    …
                  </span>
                );
              }
              return null;
            }
            return (
              <button
                key={i}
                type="button"
                onClick={() => onPageChange(i)}
                className={`min-w-8 rounded-lg px-2 py-1.5 text-xs font-medium tabular-nums transition ${
                  i === page
                    ? "bg-brand-primary text-white"
                    : "text-brand-secondary hover:bg-brand-hover hover:text-brand-primary"
                }`}
                aria-current={i === page ? "page" : undefined}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-brand-separator bg-brand-hover px-3 py-1.5 text-sm text-brand-primary transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

/** Nombre acotado: máx. 2 líneas; el texto completo va en el tooltip nativo. */
function ProductName({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <p
      title={name}
      className={`line-clamp-2 text-sm font-medium leading-snug text-brand-primary ${className}`.trim()}
    >
      {name}
    </p>
  );
}

function ProductThumb({
  product,
  size,
}: {
  product: CatalogProduct;
  size: "md" | "lg";
}) {
  const dim = size === "lg" ? "h-16 w-16" : "h-12 w-12";
  if (product.imageUrl) {
    return (
      <img
        src={product.imageUrl}
        alt=""
        className={`${dim} shrink-0 rounded-lg border border-brand-separator bg-brand-surface-hover object-cover`}
      />
    );
  }
  return (
    <div
      className={`${dim} flex shrink-0 items-center justify-center rounded-lg border border-dashed border-brand-separator bg-brand-hover text-brand-tertiary`}
      aria-hidden
    >
      <ImagePlaceholderIcon className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} />
    </div>
  );
}

function StatusBadge({ status }: { status: ProductStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function ActionButton({
  variant,
  onClick,
}: {
  variant: "edit" | "deactivate" | "activate";
  onClick: () => void;
}) {
  const isEdit = variant === "edit";
  const isActivate = variant === "activate";
  const label = isEdit ? "Editar" : isActivate ? "Activar" : "Desactivar";
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="inline-flex items-center gap-1.5 rounded-lg border border-brand-separator bg-brand-surface px-2.5 py-1.5 text-xs font-medium text-brand-secondary transition hover:bg-brand-hover hover:text-brand-primary dark:bg-brand-hover"
    >
      {isEdit ? (
        <>
          <PencilIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Editar</span>
        </>
      ) : isActivate ? (
        <>
          <CheckCircleIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Activar</span>
        </>
      ) : (
        <>
          <ArchiveIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Desactivar</span>
        </>
      )}
    </button>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-brand-separator/80 bg-[var(--brand-surface-glass)] px-4 py-3 shadow-[var(--brand-shadow-card)] backdrop-blur-xl">
      <p className="text-[11px] font-medium tracking-wide text-brand-tertiary uppercase">
        {label}
      </p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums text-brand-primary">
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  hasProducts,
  onCreate,
  onClearFilters,
}: {
  hasProducts: boolean;
  onCreate: () => void;
  onClearFilters: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-brand-separator bg-brand-hover px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-hover text-brand-tertiary">
        <ImagePlaceholderIcon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-medium text-brand-primary">
        {hasProducts ? "Sin resultados" : "Aún no hay productos"}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-brand-tertiary">
        {hasProducts
          ? "Prueba otro término de búsqueda o cambia el filtro de estado."
          : "Publica tu primer producto para que aparezca en el negocio y en este listado."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {hasProducts ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-xl border border-brand-separator bg-brand-hover px-4 py-2 text-sm text-brand-primary hover:bg-brand-hover"
          >
            Limpiar filtros
          </button>
        ) : null}
        <button
          type="button"
          onClick={onCreate}
          className={brandActionButtonSolid}
        >
          {hasProducts ? "Nuevo producto" : "Crear primer producto"}
        </button>
      </div>
    </div>
  );
}

function stockIndicator(stock: number) {
  if (stock <= 0) {
    return {
      label: "Sin stock",
      className: "text-brand-secondary",
      chipClass: dashboardStatusBadge,
      dotClass: "bg-brand-tertiary dark:bg-rose-400",
    };
  }
  if (stock <= 5) {
    return {
      label: "Stock bajo",
      className: "text-brand-secondary",
      chipClass: dashboardStatusBadge,
      dotClass: "bg-brand-tertiary dark:bg-amber-400",
    };
  }
  return {
    label: "Disponible",
    className: "text-brand-secondary",
    chipClass: dashboardStatusBadge,
    dotClass: "bg-brand-accent dark:bg-emerald-400",
  };
}

function formatCop(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function formatDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
      />
    </svg>
  );
}

function ArchiveIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
      />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

function ImagePlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}
