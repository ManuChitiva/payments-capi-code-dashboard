"use client";

import { ProductsTable } from "@/components/dashboard/products-table";
import { SectionHeader } from "@/components/dashboard/section-header";
import { primaryButtonClass } from "@/lib/dashboard/constants";
import type { CatalogProduct } from "@/components/dashboard/products-table";
import type { ProductStatus } from "@/components/dashboard/products-table";

export type DashboardProductsSectionProps = {
  title: string;
  description: string;
  products: CatalogProduct[];
  catalogStats: CatalogProduct[];
  query: string;
  statusFilter: "todos" | ProductStatus;
  onQueryChange: (value: string) => void;
  onStatusFilterChange: (value: "todos" | ProductStatus) => void;
  onEdit: (product: CatalogProduct) => void;
  onToggleActive: (productId: number, active: boolean) => void;
  onCreate: () => void;
};

export function DashboardProductsSection({
  title,
  description,
  products,
  catalogStats,
  query,
  statusFilter,
  onQueryChange,
  onStatusFilterChange,
  onEdit,
  onToggleActive,
  onCreate,
}: DashboardProductsSectionProps) {
  return (
    <section className="rounded-2xl border border-brand-separator bg-brand-surface/90 p-4 shadow-[0_10px_28px_-10px_rgba(0,0,0,0.14),0_2px_8px_-2px_rgba(0,0,0,0.06)] backdrop-blur sm:p-6 dark:border-brand-separator dark:shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_18px_48px_-12px_rgba(0,0,0,0.6),0_6px_20px_-6px_rgba(41,151,255,0.16)]">
      <SectionHeader
        title={title}
        description={description}
        action={
          <button type="button" onClick={onCreate} className={primaryButtonClass}>
            + Nuevo producto
          </button>
        }
      />
      <ProductsTable
        products={products}
        statsProducts={catalogStats}
        query={query}
        statusFilter={statusFilter}
        onQueryChange={onQueryChange}
        onStatusFilterChange={onStatusFilterChange}
        onEdit={onEdit}
        onToggleActive={onToggleActive}
        onCreate={onCreate}
      />
    </section>
  );
}
