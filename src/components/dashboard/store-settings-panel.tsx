"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { MyStoreFormPayload } from "@/services/storeSettingsService";
import type { PickupPoint } from "@/services/storePickupsService";
import {
  DEFAULT_STORE_PRIMARY_COLOR,
  normalizeStorePrimaryColor,
} from "@/lib/brand-store-defaults";
import {
  FALLBACK_STORE_CATEGORIES,
  normalizeStoreCategory,
  storeCategoryLabel,
  type StoreCategoryOption,
} from "@/lib/store-categories";
import { fetchStoreCategories } from "@/services/storeCategoryService";
import {
  brandActionButtonSolid,
  brandCtaSm,
  brandInputClass,
  brandStoreHero,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
} from "@/lib/brand-theme";

type ActiveStorePreview = {
  slug: string;
  primaryColor: string | null;
  coverImageUrl?: string | null;
};

export type StoreSettingsPanelProps = {
  activeStore: ActiveStorePreview | null;
  form: MyStoreFormPayload;
  onFormChange: (
    updater: (prev: MyStoreFormPayload) => MyStoreFormPayload,
  ) => void;
  loading: boolean;
  saving: boolean;
  uploadingLogo: boolean;
  uploadingCover: boolean;
  onSave: () => void;
  onLogoUpload: (file: File) => void;
  onCoverUpload: (file: File) => void;
  pickups: PickupPoint[];
  pickupsLoading: boolean;
  pickupActionLoading: boolean;
  newPickupAddress: string;
  onNewPickupAddressChange: (value: string) => void;
  newPickupActive: boolean;
  onNewPickupActiveChange: (value: boolean) => void;
  onAddPickup: () => void;
  editingPickupId: number | null;
  editPickupDraft: { address: string; status: boolean };
  onEditPickupDraftChange: (draft: {
    address: string;
    status: boolean;
  }) => void;
  onStartEditPickup: (pickup: PickupPoint) => void;
  onCancelEditPickup: () => void;
  onSavePickupEdit: () => void;
  onTogglePickupStatus: (pickup: PickupPoint) => void;
  onDeletePickup: (pickupId: number) => void;
};

const inputClass = `${brandInputClass} px-4 text-sm`;

export function StoreSettingsPanel({
  activeStore,
  form,
  onFormChange,
  loading,
  saving,
  uploadingLogo,
  uploadingCover,
  onSave,
  onLogoUpload,
  onCoverUpload,
  pickups,
  pickupsLoading,
  pickupActionLoading,
  newPickupAddress,
  onNewPickupAddressChange,
  newPickupActive,
  onNewPickupActiveChange,
  onAddPickup,
  editingPickupId,
  editPickupDraft,
  onEditPickupDraftChange,
  onStartEditPickup,
  onCancelEditPickup,
  onSavePickupEdit,
  onTogglePickupStatus,
  onDeletePickup,
}: StoreSettingsPanelProps) {
  const accent = normalizeStorePrimaryColor(form.primaryColor);
  const displayName = form.name.trim() || "Tu negocio";
  const [categoryOptions, setCategoryOptions] = useState<StoreCategoryOption[]>(
    FALLBACK_STORE_CATEGORIES,
  );
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setCategoriesLoading(true);
    void fetchStoreCategories()
      .then((options) => {
        if (!cancelled) setCategoryOptions(options);
      })
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayLabel = form.label.trim();
  const categoryName = storeCategoryLabel(form.category, categoryOptions);
  const selectCategoryOptions = useMemo(() => {
    if (
      form.category &&
      !categoryOptions.some((c) => c.code === form.category)
    ) {
      return [
        {
          code: form.category,
          label: storeCategoryLabel(form.category, categoryOptions),
        },
        ...categoryOptions,
      ];
    }
    return categoryOptions;
  }, [form.category, categoryOptions]);
  const slugPath = activeStore ? `/stores/${activeStore.slug}` : null;
  const logoPreview = form.logoUrl.trim();
  const coverPreview = form.coverImageUrl.trim();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-44 animate-pulse rounded-2xl bg-brand-surface-hover" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-2xl bg-brand-hover" />
          <div className="h-64 animate-pulse rounded-2xl bg-brand-hover" />
        </div>
        <div className="h-48 animate-pulse rounded-2xl bg-brand-hover" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Vista previa / hero */}
      <div className={`${brandStoreHero} overflow-hidden`}>
        {coverPreview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverPreview}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-brand-surface via-brand-surface/85 to-brand-surface/20" />
          </>
        ) : (
          <>
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-25 blur-3xl"
              style={{ backgroundColor: accent }}
            />
            <div className="pointer-events-none absolute -bottom-16 left-1/4 h-40 w-40 rounded-full bg-brand-accent/10 blur-3xl" />
          </>
        )}
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />

        <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-5">
            <div
              className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-brand-separator bg-brand-input shadow-lg sm:h-24 sm:w-24"
              style={{
                boxShadow: `0 0 0 1px ${accent}33, 0 12px 40px -12px ${accent}44`,
              }}
            >
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoPreview}
                  alt=""
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <span
                  className="font-(family-name:--font-rajdhani) text-3xl font-bold text-brand-primary/90"
                  style={{ color: accent }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-brand-secondary">
                Vista previa
              </p>
              <h3 className="font-(family-name:--font-rajdhani) truncate text-2xl font-semibold tracking-tight text-brand-primary sm:text-3xl">
                {displayName}
              </h3>
              {displayLabel ? (
                <p className="mt-0.5 truncate text-sm text-brand-secondary">
                  {displayLabel}
                </p>
              ) : null}
              <p className="mt-2 inline-flex max-w-full items-center rounded-full border border-brand-separator bg-brand-hover/80 px-2.5 py-0.5 text-xs font-medium text-brand-secondary">
                {categoryName}
              </p>
              {slugPath ? (
                <p className="mt-2 inline-flex max-w-full items-center gap-2 rounded-lg border border-brand-separator bg-brand-input/30 px-2.5 py-1 font-mono text-xs text-brand-secondary">
                  <LinkIcon className="h-3.5 w-3.5 shrink-0 text-brand-tertiary" />
                  <span className="truncate">{slugPath}</span>
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
            <div className="rounded-xl border border-brand-separator bg-brand-surface/80 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] font-medium uppercase tracking-wider text-brand-tertiary">
                Color de marca
              </p>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="color"
                  value={accent}
                  onChange={(e) =>
                    onFormChange((p) => ({
                      ...p,
                      primaryColor: e.target.value,
                    }))
                  }
                  className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-brand-separator bg-transparent p-0.5"
                  aria-label="Elegir color de marca"
                />
                <input
                  type="text"
                  value={form.primaryColor}
                  onChange={(e) =>
                    onFormChange((p) => ({
                      ...p,
                      primaryColor: e.target.value,
                    }))
                  }
                  placeholder={DEFAULT_STORE_PRIMARY_COLOR}
                  className={`${inputClass} max-w-[8.5rem] py-2 font-mono text-xs`}
                  spellCheck={false}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={onSave}
              disabled={saving || uploadingLogo || uploadingCover}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 disabled:cursor-not-allowed disabled:opacity-50 ${brandActionButtonSolid}`}
            >
              {saving ? (
                <>
                  <SpinnerIcon className="h-4 w-4" />
                  Guardando…
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SettingsCard
          icon={<StorefrontIcon />}
          title="Identidad pública"
          description="Cómo te verán los clientes en el catálogo y enlaces."
        >
          <FormField label="Nombre del negocio" required>
            <input
              value={form.name}
              onChange={(e) =>
                onFormChange((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="Ej. Moda Urbana"
              className={inputClass}
              disabled={loading}
            />
          </FormField>
          <FormField
            label="Categoría del negocio"
            hint="Al crear tu cuenta el negocio queda como Nuevo; elige el rubro que mejor describe tu actividad."
          >
            <div className="relative">
              <select
                value={form.category}
                onChange={(e) =>
                  onFormChange((p) => ({
                    ...p,
                    category: normalizeStoreCategory(e.target.value),
                  }))
                }
                disabled={loading || categoriesLoading}
                className={`${inputClass} appearance-none pr-10`}
                aria-busy={categoriesLoading}
              >
                {selectCategoryOptions.map((option) => (
                  <option
                    key={option.code}
                    value={option.code}
                    className="bg-brand-surface text-brand-primary"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <span
                className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[10px] text-brand-tertiary"
                aria-hidden
              >
                ▼
              </span>
            </div>
          </FormField>
          <FormField
            label="Etiqueta visible"
            hint="Subtítulo opcional bajo el nombre en el negocio."
          >
            <input
              value={form.label}
              onChange={(e) =>
                onFormChange((p) => ({ ...p, label: e.target.value }))
              }
              placeholder="Ej. Envíos a todo el país"
              className={inputClass}
            />
          </FormField>
          <ReadonlyField
            label="URL pública"
            value={slugPath ?? "—"}
            hint="Se define al crear el negocio para no romper enlaces compartidos."
          />
        </SettingsCard>

        <SettingsCard
          icon={<PhoneIcon />}
          title="Contacto"
          description="Canales donde tus clientes pueden escribirte o llamarte."
        >
          <FormField label="Teléfono fijo">
            <input
              value={form.phone}
              onChange={(e) =>
                onFormChange((p) => ({ ...p, phone: e.target.value }))
              }
              placeholder="+57 601 123 4567"
              className={inputClass}
            />
          </FormField>
          <FormField label="WhatsApp">
            <input
              value={form.whatsapp}
              onChange={(e) =>
                onFormChange((p) => ({ ...p, whatsapp: e.target.value }))
              }
              placeholder="+57 300 123 4567"
              className={inputClass}
            />
          </FormField>
          <FormField label="Celular">
            <input
              value={form.cellPhone}
              onChange={(e) =>
                onFormChange((p) => ({ ...p, cellPhone: e.target.value }))
              }
              placeholder="+57 310 987 6543"
              className={inputClass}
            />
          </FormField>
          <FormField label="Dirección">
            <input
              value={form.address}
              onChange={(e) =>
                onFormChange((p) => ({ ...p, address: e.target.value }))
              }
              placeholder="Calle, ciudad, referencia"
              className={inputClass}
            />
          </FormField>
        </SettingsCard>
      </div>

      <SettingsCard
        icon={<PaletteIcon />}
        title="Marca visual"
        description="Sube dos imágenes distintas: un banner ancho (portada) y un icono cuadrado (logo)."
        className="lg:col-span-2"
      >
        <BrandVisualGuide accent={accent} />

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <section className="overflow-hidden rounded-2xl border-2 border-brand-accent/30 bg-brand-accent/[0.04]">
            <BrandAssetHeader
              badge="Portada"
              badgeClass="border-brand-accent/30 bg-brand-accent/10 text-brand-accent dark:text-brand-accent-soft"
              icon={<CoverBannerIcon className="h-5 w-5 text-brand-accent dark:text-brand-accent-soft" />}
              title="Foto de portada"
              subtitle="Imagen ancha de fondo en el catálogo (banner 3:1). No uses el mismo archivo que el logo."
              aspectHint="Formato horizontal · ~1200×400 px"
            />
            <div className="space-y-4 p-4 pt-0 sm:p-5 sm:pt-0">
              <CoverDropzone
                uploading={uploadingCover}
                hasCover={Boolean(coverPreview)}
                onFile={onCoverUpload}
                onClear={() => onFormChange((p) => ({ ...p, coverImageUrl: "" }))}
              />
              <div className="relative aspect-3/1 overflow-hidden rounded-xl border border-dashed border-brand-accent/25 bg-brand-input/25">
                {coverPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverPreview}
                    alt="Vista previa de portada"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center px-4 text-center">
                    <CoverBannerIcon className="h-10 w-10 text-brand-accent/50" />
                    <p className="mt-2 text-xs font-medium text-brand-secondary">
                      Previsualización del banner
                    </p>
                  </div>
                )}
                <span className="absolute left-2 top-2 rounded-md bg-brand-accent/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Portada
                </span>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border-2 border-brand-separator bg-brand-hover/50">
            <BrandAssetHeader
              badge="Logo"
              badgeClass="border-brand-separator bg-brand-surface text-brand-primary"
              icon={<LogoMarkIcon className="h-5 w-5 text-brand-primary" />}
              title="Logo del negocio"
              subtitle="Icono cuadrado que aparece sobre la portada, a la izquierda del nombre."
              aspectHint="Formato cuadrado · PNG transparente recomendado"
            />
            <div className="space-y-4 p-4 pt-0 sm:p-5 sm:pt-0">
              <LogoDropzone
                uploading={uploadingLogo}
                hasLogo={Boolean(logoPreview)}
                onFile={onLogoUpload}
                onClear={() => onFormChange((p) => ({ ...p, logoUrl: "" }))}
              />
              <div className="relative mx-auto flex aspect-square w-full max-w-[11rem] flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-brand-separator bg-brand-input/25 p-4 sm:max-w-[12.5rem]">
                {logoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoPreview}
                    alt="Vista previa del logo"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <LogoMarkIcon className="mx-auto h-10 w-10 text-brand-tertiary" />
                    <p className="mt-2 text-xs font-medium text-brand-secondary">
                      Previsualización del logo
                    </p>
                  </div>
                )}
                <span className="absolute left-2 top-2 rounded-md border border-brand-separator bg-brand-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-primary shadow-sm">
                  Logo
                </span>
              </div>
              <p className="text-center text-[11px] leading-relaxed text-brand-tertiary">
                Tras subir portada o logo, pulsa{" "}
                <span className="text-brand-secondary">Guardar cambios</span> arriba.
              </p>
            </div>
          </section>
        </div>
      </SettingsCard>

      <SettingsCard
        icon={<MapPinIcon />}
        title="Puntos de atención"
        description="Direcciones donde atiendes a tus clientes o entregas pedidos. Actívalos o desactívalos sin borrarlos."
      >
        <div className="rounded-xl border border-brand-separator bg-brand-hover p-4 sm:p-5">
          <p className="text-xs font-medium text-brand-primary">
            Añadir punto de atención
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="min-w-0 flex-1 space-y-1.5">
              <span className="text-xs text-brand-secondary">Dirección</span>
              <input
                value={newPickupAddress}
                onChange={(e) => onNewPickupAddressChange(e.target.value)}
                placeholder="Calle 10 # 20-30, local 2"
                className={inputClass}
              />
            </label>
            <TogglePill
              checked={newPickupActive}
              onChange={onNewPickupActiveChange}
              label="Activo al crear"
            />
            <button
              type="button"
              onClick={onAddPickup}
              disabled={pickupActionLoading || !newPickupAddress.trim()}
              className={`inline-flex shrink-0 items-center justify-center gap-2 px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50 ${brandCtaSm}`}
            >
              <PlusIcon className="h-4 w-4" />
              Añadir
            </button>
          </div>
        </div>

        {pickupsLoading ? (
          <p className="mt-6 text-sm text-brand-tertiary">Cargando puntos de atención…</p>
        ) : pickups.length === 0 ? (
          <EmptyPickups />
        ) : (
          <PickupsList
            pickups={pickups}
            editingPickupId={editingPickupId}
            editPickupDraft={editPickupDraft}
            pickupActionLoading={pickupActionLoading}
            onEditPickupDraftChange={onEditPickupDraftChange}
            onStartEditPickup={onStartEditPickup}
            onCancelEditPickup={onCancelEditPickup}
            onSavePickupEdit={onSavePickupEdit}
            onTogglePickupStatus={onTogglePickupStatus}
            onDeletePickup={onDeletePickup}
          />
        )}
      </SettingsCard>

      <div className="flex justify-end border-t border-brand-separator pt-6">
        <button
          type="button"
          onClick={onSave}
          disabled={saving || uploadingLogo}
          className="inline-flex items-center gap-2 rounded-xl border border-brand-separator bg-brand-hover px-5 py-2.5 text-sm font-medium text-brand-primary transition hover:bg-brand-hover disabled:opacity-50 lg:hidden"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

function SettingsCard({
  icon,
  title,
  description,
  children,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-brand-separator/80 bg-brand-surface p-5 shadow-[var(--brand-shadow-card)] sm:p-6 ${className}`.trim()}
    >
      <div className="mb-5 flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-separator bg-brand-hover text-brand-accent dark:text-brand-accent-soft">
          {icon}
        </div>
        <div>
          <h3 className="font-(family-name:--font-rajdhani) text-lg font-semibold text-brand-primary">
            {title}
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-brand-tertiary">
            {description}
          </p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function FormField({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-brand-primary">
        {label}
        {required ? (
          <span className="ml-1 text-rose-400/90">*</span>
        ) : null}
      </span>
      {children}
      {hint ? <p className="text-[11px] text-brand-tertiary">{hint}</p> : null}
    </label>
  );
}

function ReadonlyField({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium text-brand-primary">{label}</span>
      <div className="rounded-xl border border-brand-separator bg-brand-hover px-4 py-3 font-mono text-sm text-brand-secondary">
        {value}
      </div>
      {hint ? <p className="text-[11px] text-brand-tertiary">{hint}</p> : null}
    </div>
  );
}

function BrandVisualGuide({ accent }: { accent: string }) {
  return (
    <div className="rounded-xl border border-brand-separator bg-brand-hover/80 p-4 sm:p-5">
      <p className="text-sm font-medium text-brand-primary">
        ¿Cuál es cuál?
      </p>
      <p className="mt-1 text-xs text-brand-secondary">
        En tu tienda pública la <strong className="font-medium text-brand-primary">portada</strong> ocupa todo el ancho arriba; el{" "}
        <strong className="font-medium text-brand-primary">logo</strong> es el cuadrado que va encima, a la izquierda.
      </p>
      <div
        className="relative mt-4 overflow-hidden rounded-xl border border-brand-separator"
        aria-hidden
      >
        <div
          className="flex h-[4.5rem] items-center justify-center sm:h-20"
          style={{
            background: `linear-gradient(135deg, ${accent}33, ${accent}18 40%, transparent)`,
          }}
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-tertiary/80">
            Zona de portada (banner)
          </span>
        </div>
        <div
          className="absolute bottom-2 left-3 flex h-11 w-11 items-center justify-center rounded-lg border-2 border-brand-surface bg-brand-surface text-[9px] font-bold uppercase tracking-wide text-brand-accent shadow-md sm:h-12 sm:w-12"
          style={{ boxShadow: `0 4px 14px ${accent}33` }}
        >
          Logo
        </div>
      </div>
    </div>
  );
}

function BrandAssetHeader({
  badge,
  badgeClass,
  icon,
  title,
  subtitle,
  aspectHint,
}: {
  badge: string;
  badgeClass: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  aspectHint: string;
}) {
  return (
    <div className="flex gap-3 border-b border-brand-separator/80 p-4 sm:p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-separator bg-brand-surface">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}
          >
            {badge}
          </span>
          <h4 className="text-sm font-semibold text-brand-primary">{title}</h4>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-brand-secondary">
          {subtitle}
        </p>
        <p className="mt-1.5 text-[11px] text-brand-tertiary">{aspectHint}</p>
      </div>
    </div>
  );
}

function CoverDropzone({
  uploading,
  hasCover,
  onFile,
  onClear,
}: {
  uploading: boolean;
  hasCover: boolean;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  return (
    <div className="relative aspect-3/1 min-h-[7.5rem] rounded-xl border-2 border-dashed border-brand-accent/35 bg-brand-input/30 transition hover:border-brand-accent/55 hover:bg-brand-surface-hover sm:min-h-[8.5rem]">
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
        className="absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        aria-label="Subir foto de portada (banner horizontal)"
      />
      <div className="pointer-events-none flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-brand-accent/30 bg-brand-accent/10">
          {uploading ? (
            <SpinnerIcon className="h-6 w-6 text-brand-accent" />
          ) : (
            <CoverBannerIcon className="h-7 w-7 text-brand-accent dark:text-brand-accent-soft" />
          )}
        </div>
        <p className="mt-3 text-sm font-medium text-brand-primary">
          {uploading
            ? "Subiendo portada…"
            : hasCover
              ? "Clic para cambiar el banner"
              : "Subir banner de portada"}
        </p>
        <p className="mt-0.5 text-xs text-brand-tertiary">
          Imagen horizontal · no es el logo
        </p>
      </div>
      {hasCover ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="absolute bottom-2 left-2 right-2 z-20 rounded-lg border border-brand-separator bg-brand-surface/95 py-1.5 text-xs text-brand-secondary backdrop-blur-sm transition hover:bg-brand-hover"
        >
          Quitar portada
        </button>
      ) : null}
    </div>
  );
}

function LogoDropzone({
  uploading,
  hasLogo,
  onFile,
  onClear,
}: {
  uploading: boolean;
  hasLogo: boolean;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[11rem] rounded-2xl border-2 border-dashed border-brand-separator bg-brand-input/30 transition hover:border-brand-input-border hover:bg-brand-surface-hover sm:max-w-[12.5rem]">
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
        className="absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        aria-label="Subir logo (imagen cuadrada)"
      />
      <div className="pointer-events-none flex h-full flex-col items-center justify-center px-3 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-brand-separator bg-brand-surface shadow-sm">
          {uploading ? (
            <SpinnerIcon className="h-6 w-6 text-brand-accent" />
          ) : (
            <LogoMarkIcon className="h-7 w-7 text-brand-primary" />
          )}
        </div>
        <p className="mt-3 text-sm font-medium text-brand-primary">
          {uploading
            ? "Subiendo logo…"
            : hasLogo
              ? "Clic para cambiar el logo"
              : "Subir logo cuadrado"}
        </p>
        <p className="mt-0.5 text-xs text-brand-tertiary">
          Icono · no es la portada
        </p>
      </div>
      {hasLogo ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="absolute bottom-2 left-2 right-2 z-20 rounded-lg border border-brand-separator bg-brand-surface/95 py-1.5 text-xs text-brand-secondary backdrop-blur-sm transition hover:bg-brand-hover"
        >
          Quitar logo
        </button>
      ) : null}
    </div>
  );
}

const PICKUPS_PER_PAGE = 3;

type PickupsListProps = {
  pickups: PickupPoint[];
  editingPickupId: number | null;
  editPickupDraft: { address: string; status: boolean };
  pickupActionLoading: boolean;
  onEditPickupDraftChange: (draft: { address: string; status: boolean }) => void;
  onStartEditPickup: (pickup: PickupPoint) => void;
  onCancelEditPickup: () => void;
  onSavePickupEdit: () => void;
  onTogglePickupStatus: (pickup: PickupPoint) => void;
  onDeletePickup: (pickupId: number) => void;
};

function PickupsList({
  pickups,
  editingPickupId,
  editPickupDraft,
  pickupActionLoading,
  onEditPickupDraftChange,
  onStartEditPickup,
  onCancelEditPickup,
  onSavePickupEdit,
  onTogglePickupStatus,
  onDeletePickup,
}: PickupsListProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(pickups.length / PICKUPS_PER_PAGE));

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages - 1));
  }, [pickups.length, totalPages]);

  const visiblePickups = useMemo(
    () =>
      pickups.slice(
        page * PICKUPS_PER_PAGE,
        page * PICKUPS_PER_PAGE + PICKUPS_PER_PAGE,
      ),
    [pickups, page],
  );

  return (
    <div className="mt-6">
      <ul className="space-y-3">
        {visiblePickups.map((p) => (
          <li key={p.id}>
            <PickupCard
              pickup={p}
              isEditing={editingPickupId === p.id}
              draft={editPickupDraft}
              onDraftChange={onEditPickupDraftChange}
              loading={pickupActionLoading}
              onStartEdit={() => onStartEditPickup(p)}
              onCancelEdit={onCancelEditPickup}
              onSaveEdit={onSavePickupEdit}
              onToggleStatus={() => onTogglePickupStatus(p)}
              onDelete={() => onDeletePickup(p.id)}
            />
          </li>
        ))}
      </ul>

      {pickups.length > PICKUPS_PER_PAGE ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-brand-separator pt-4 text-xs text-brand-secondary">
          <span>
            Página {page + 1} de {totalPages} ({pickups.length} puntos de atención)
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="rounded-lg border border-brand-separator bg-brand-hover px-3 py-1.5 text-sm text-brand-primary transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() =>
                setPage((p) => Math.min(totalPages - 1, p + 1))
              }
              className="rounded-lg border border-brand-separator bg-brand-hover px-3 py-1.5 text-sm text-brand-primary transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PickupCard({
  pickup,
  isEditing,
  draft,
  onDraftChange,
  loading,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggleStatus,
  onDelete,
}: {
  pickup: PickupPoint;
  isEditing: boolean;
  draft: { address: string; status: boolean };
  onDraftChange: (d: { address: string; status: boolean }) => void;
  loading: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}) {
  if (isEditing) {
    return (
      <div className="rounded-xl border border-brand-separator bg-brand-hover p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1 space-y-1.5">
            <span className="text-xs text-brand-secondary">Dirección</span>
            <input
              value={draft.address}
              onChange={(e) =>
                onDraftChange({ ...draft, address: e.target.value })
              }
              className={inputClass}
            />
          </label>
          <TogglePill
            checked={draft.status}
            onChange={(v) => onDraftChange({ ...draft, status: v })}
            label="Activo"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onSaveEdit}
              disabled={loading}
              className="rounded-lg bg-brand-accent px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-lg border border-brand-separator px-4 py-2 text-xs text-brand-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-brand-separator bg-brand-input/30 p-4 transition hover:border-brand-separator hover:bg-brand-input/40 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-separator bg-brand-hover text-brand-secondary">
          <MapPinIcon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-brand-primary">
            {pickup.address?.trim() || "Sin dirección"}
          </p>
          <span
            className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
              pickup.status
                ? "border-brand-accent/25 bg-brand-accent/10 text-brand-accent dark:border-brand-accent-soft/35 dark:bg-brand-accent/15 dark:text-brand-accent-soft"
                : "border-brand-separator bg-brand-hover text-brand-secondary"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${pickup.status ? "bg-brand-accent dark:bg-brand-accent-soft" : "bg-brand-tertiary"}`}
            />
            {pickup.status ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 sm:opacity-90 sm:transition group-hover:opacity-100">
        <button
          type="button"
          onClick={onToggleStatus}
          disabled={loading}
          className="rounded-lg border border-brand-separator bg-brand-hover px-3 py-1.5 text-xs text-brand-primary hover:bg-brand-hover disabled:opacity-50"
        >
          {pickup.status ? "Desactivar" : "Activar"}
        </button>
        <button
          type="button"
          onClick={onStartEdit}
          disabled={loading}
          className="rounded-lg border border-brand-separator px-3 py-1.5 text-xs text-brand-secondary hover:bg-brand-hover disabled:opacity-50"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={loading}
          className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 disabled:opacity-50 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

function TogglePill({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-brand-separator bg-brand-input/30 px-4 py-3 text-sm text-brand-secondary">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-brand-input-border bg-brand-input text-brand-accent focus:ring-brand-accent/25"
      />
      {label}
    </label>
  );
}

function EmptyPickups() {
  return (
    <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-brand-separator/12 bg-brand-input/20 px-6 py-10 text-center">
      <MapPinIcon className="h-8 w-8 text-brand-tertiary" />
      <p className="mt-3 text-sm font-medium text-brand-secondary">
        Sin puntos de atención
      </p>
      <p className="mt-1 max-w-xs text-xs text-brand-tertiary">
        Añade la primera dirección arriba para que tus clientes sepan dónde
        encontrarte.
      </p>
    </div>
  );
}

/* Icons */
function StorefrontIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72L4.5 3.345M15.75 3.345l1.621 4.72a3.004 3.004 0 0 1-.621 4.72" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 6.75Z" />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
    </svg>
  );
}

function MapPinIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  );
}

function LinkIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
  );
}

function UploadIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
  );
}

function ImageIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
    </svg>
  );
}

/** Icono de banner horizontal (portada). */
function CoverBannerIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <rect x="2" y="7" width="20" height="10" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 11h4M14 11h4M6 14h8" />
    </svg>
  );
}

/** Icono de logo cuadrado. */
function LogoMarkIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <rect x="5" y="5" width="14" height="14" rx="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 16.5c1-1.5 2.5-2 3.5-2s2.5.5 3.5 2" />
    </svg>
  );
}

function PlusIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function SpinnerIcon({ className = "h-4 w-4 animate-spin" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
