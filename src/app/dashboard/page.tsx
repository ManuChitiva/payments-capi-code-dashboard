"use client";

import { ProductFormModal } from "@/components/dashboard/product-form-modal";
import { StoreSettingsPanel } from "@/components/dashboard/store-settings-panel";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SectionHeader } from "@/components/dashboard/section-header";
import { CreateStoreModal } from "@/components/dashboard/modals/create-store-modal";
import { PayuMethodModal } from "@/components/dashboard/modals/payu-method-modal";
import { DashboardSummarySection } from "@/components/dashboard/sections/dashboard-summary-section";
import { DashboardProductsSection } from "@/components/dashboard/sections/dashboard-products-section";
import { DashboardOrdersSection } from "@/components/dashboard/sections/dashboard-orders-section";
import { DashboardPaymentsSection } from "@/components/dashboard/sections/dashboard-payments-section";
import { OrderDetailModal } from "@/components/dashboard/modals/order-detail-modal";
import { useDashboardPage } from "@/hooks/use-dashboard-page";
import { brandPageBg, brandTextSecondary } from "@/lib/brand-theme";

export default function DashboardPage() {
  const d = useDashboardPage();

  if (d.loading) {
    return (
      <main className={`flex min-h-0 flex-1 items-center justify-center ${brandPageBg}`}>
        <p className={`text-sm ${brandTextSecondary}`}>Cargando panel…</p>
      </main>
    );
  }

  if (!d.client) {
    return null;
  }

  return (
    <DashboardShell
      client={d.client}
      activeStore={d.activeStore ?? undefined}
      activeSection={d.activeSection}
      sectionMeta={d.sectionMeta}
      mobileNavOpen={d.mobileNavOpen}
      setMobileNavOpen={d.setMobileNavOpen}
      error={d.error}
      actionMessage={d.actionMessage}
      onStoreChange={d.handleStoreChange}
      onNewStore={() => {
        d.setError("");
        d.setNewStoreModalOpen(true);
      }}
      onSection={d.goToSection}
      onLogout={d.logout}
    >
      {d.activeSection === "resumen" ? (
        <DashboardSummarySection
          title={d.sectionMeta.title}
          description={d.sectionMeta.description}
          productCount={d.products.length}
          analytics={d.analytics}
          revenueSummary={d.revenueSummary}
          topInterestItems={d.topInterestItems}
          topInterestLoading={d.topInterestLoading}
          topInterestLast={d.topInterestLast}
          topInterestScrollRef={d.topInterestScrollRef}
          topInterestSentinelRef={d.topInterestSentinelRef}
        />
      ) : null}

      {d.activeSection === "productos" ? (
        <DashboardProductsSection
          title={d.sectionMeta.title}
          description={d.sectionMeta.description}
          products={d.products}
          catalogStats={d.catalogStats}
          query={d.query}
          statusFilter={d.statusFilter}
          onQueryChange={d.setQuery}
          onStatusFilterChange={d.setStatusFilter}
          onEdit={d.openEditModal}
          onToggleActive={d.handleToggleProductActive}
          onCreate={d.openCreateModal}
        />
      ) : null}

      {d.activeSection === "pedidos" ? (
        <DashboardOrdersSection
          title={d.sectionMeta.title}
          description={d.sectionMeta.description}
          activeTab={d.salesTab}
          onTabChange={d.setSalesTab}
          revenueSummary={d.salesRevenueSummary}
          ordersData={d.ordersData}
          ordersLoading={d.ordersLoading}
          ordersPage={d.ordersPage}
          setOrdersPage={d.setOrdersPage}
          orderStatusDraft={d.orderStatusDraft}
          setOrderStatusDraft={d.setOrderStatusDraft}
          setOrderStatusQuery={d.setOrderStatusQuery}
          setOrdersListTick={d.setOrdersListTick}
          paymentsData={d.salesPaymentsData}
          paymentsLoading={d.salesPaymentsLoading}
          paymentsPage={d.salesPaymentsPage}
          setPaymentsPage={d.setSalesPaymentsPage}
          paymentStatusDraft={d.salesPaymentStatusDraft}
          setPaymentStatusDraft={d.setSalesPaymentStatusDraft}
          setPaymentStatusQuery={d.setSalesPaymentStatusQuery}
          setPaymentsListTick={d.setSalesPaymentsListTick}
          onOpenOrder={(id) => void d.openOrderDetail(id)}
        />
      ) : null}

      {d.activeSection === "tienda" ? (
        <section className="rounded-2xl border border-brand-separator bg-brand-surface/90 p-4 backdrop-blur sm:p-6">
          <SectionHeader
            title={d.sectionMeta.title}
            description={d.sectionMeta.description}
          />
          <StoreSettingsPanel
            activeStore={
              d.activeStore
                ? {
                    slug: d.activeStore.slug,
                    primaryColor: d.activeStore.primaryColor,
                    coverImageUrl: d.activeStore.coverImageUrl,
                  }
                : null
            }
            form={d.storeSettingsForm}
            onFormChange={d.setStoreSettingsForm}
            loading={d.myStoreLoading}
            saving={d.myStoreSaving}
            uploadingLogo={d.uploadingStoreLogo}
            uploadingCover={d.uploadingStoreCover}
            onSave={() => void d.handleSaveStoreSettings()}
            onLogoUpload={(file) => void d.handleStoreLogoUpload(file)}
            onCoverUpload={(file) => void d.handleStoreCoverUpload(file)}
            pickups={d.pickupsList}
            pickupsLoading={d.pickupsLoading}
            pickupActionLoading={d.pickupActionLoading}
            newPickupAddress={d.newPickupAddress}
            onNewPickupAddressChange={d.setNewPickupAddress}
            newPickupActive={d.newPickupActive}
            onNewPickupActiveChange={d.setNewPickupActive}
            onAddPickup={() => void d.handleAddPickup()}
            editingPickupId={d.editingPickupId}
            editPickupDraft={d.editPickupDraft}
            onEditPickupDraftChange={d.setEditPickupDraft}
            onStartEditPickup={(p) => {
              d.setEditingPickupId(p.id);
              d.setEditPickupDraft({
                address: p.address ?? "",
                status: p.status,
              });
            }}
            onCancelEditPickup={() => d.setEditingPickupId(null)}
            onSavePickupEdit={() => void d.handleSavePickupEdit()}
            onTogglePickupStatus={(p) => void d.handleTogglePickupStatus(p)}
            onDeletePickup={(id) => void d.handleDeletePickup(id)}
          />
        </section>
      ) : null}

      {d.activeSection === "pagos" ? (
        <DashboardPaymentsSection
          title={d.sectionMeta.title}
          description={d.sectionMeta.description}
          payuMethods={d.payuMethods}
          payuLoading={d.payuLoading}
          hasActivePayuConfig={d.hasActivePayuConfig}
          openCreatePayuModal={d.openCreatePayuModal}
          openEditPayuModal={d.openEditPayuModal}
          handleDeletePayu={d.handleDeletePayu}
          payuPaymentsData={d.payuPaymentsData}
          payuPaymentsLoading={d.payuPaymentsLoading}
          payuPaymentStatusDraft={d.payuPaymentStatusDraft}
          setPayuPaymentStatusDraft={d.setPayuPaymentStatusDraft}
          setPayuPaymentStatusQuery={d.setPayuPaymentStatusQuery}
          setPayuPaymentsPage={d.setPayuPaymentsPage}
          setPayuPaymentsListTick={d.setPayuPaymentsListTick}
          payuPaymentsPage={d.payuPaymentsPage}
        />
      ) : null}

      <ProductFormModal
        open={d.productModalOpen}
        mode={d.productModalMode}
        values={d.newProduct}
        errors={d.productFormErrors}
        showErrors={d.productFormShowErrors}
        saving={d.savingProduct}
        uploadingMedia={d.uploadingMedia}
        imagePreviewUrl={d.resolvedProductImageUrl}
        formError={d.productModalOpen ? d.error : undefined}
        onClose={() => {
          d.setProductFormErrors({});
          d.setProductFormShowErrors(false);
          d.setProductModalOpen(false);
        }}
        onSave={d.handleSaveProduct}
        onChange={(patch) => {
          const next = { ...d.newProduct, ...patch };
          d.setNewProduct(next);
          if (d.productFormShowErrors) {
            d.refreshProductFormValidation(next);
          }
        }}
        onBlurValidate={() => {
          if (d.productFormShowErrors) {
            d.refreshProductFormValidation();
          }
        }}
        onImageSelect={(file) => {
          void d.handleMediaUpload(file);
        }}
        uploadingVariantId={d.uploadingVariantId}
        onVariantImageSelect={(localId, file) => {
          void d.handleVariantMediaUpload(localId, file);
        }}
      />

      <PayuMethodModal
        open={d.payuModalOpen}
        mode={d.payuModalMode}
        values={d.payuForm}
        saving={d.payuSaving}
        onClose={() => d.setPayuModalOpen(false)}
        onSave={d.handleSavePayu}
        onChange={(patch) => d.setPayuForm((prev) => ({ ...prev, ...patch }))}
      />

      <OrderDetailModal
        open={d.orderDetailOpen}
        loading={d.orderDetailLoading}
        order={d.orderDetail}
        onClose={() => {
          d.setOrderDetailOpen(false);
        }}
      />

      <CreateStoreModal
        open={d.newStoreModalOpen}
        values={d.newStoreForm}
        creating={d.creatingStore}
        onClose={() => d.setNewStoreModalOpen(false)}
        onCreate={() => void d.handleCreateStore()}
        onChange={(patch) => d.setNewStoreForm((f) => ({ ...f, ...patch }))}
      />
    </DashboardShell>
  );
}
