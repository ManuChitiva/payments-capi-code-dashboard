"use client";

import { ProductsTable } from "@/components/dashboard/products-table";
import { SectionHeader } from "@/components/dashboard/section-header";
import { primaryButtonClass } from "@/lib/dashboard/constants";
import type { DashboardProduct } from "@/types/dashboard";
import type { ProductStatus } from "@/components/dashboard/products-table";

export type DashboardProductsSectionProps = {
  title: string;
  description: string;
  products: DashboardProduct[];
  catalogStats: DashboardProduct[];
  query: string;
  statusFilter: "todos" | ProductStatus;
  onQueryChange: (value: string) => void;
  onStatusFilterChange: (value: "todos" | ProductStatus) => void;
  onEdit: (product: DashboardProduct) => void;
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
    <section className="rounded-2xl border border-brand-separator bg-brand-surface/90 p-4 backdrop-blur sm:p-6">
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
