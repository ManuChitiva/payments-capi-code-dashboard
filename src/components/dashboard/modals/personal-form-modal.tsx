"use client";

import { useEffect, useId, useRef } from "react";
import {
  brandActionButtonSolid,
  brandAssetDropzoneIdle,
  brandAssetDropzoneLoaded,
  brandAssetReadyPill,
  brandAssetRemoveBtn,
  brandFormLabel,
  brandInputClass,
  brandModalFooter,
  brandModalHeader,
  brandModalPanelLg,
  brandModalTitle,
} from "@/lib/brand-theme";

/** Fila de empleado dentro del modal (estado controlado). */
export type PersonalFormRow = {
  /** id local para reconciliar re-renders; el backend asigna el id final. */
  localId: string;
  name: string;
  phone: string;
  whatsapp: string;
  /** Archivo de imagen pendiente de subir; se envía al backend al guardar. */
  photoFile: File | null;
  /** URL de previsualización (object URL del archivo seleccionado). */
  photoPreviewUrl: string;
};

export const emptyPersonalRow = (): PersonalFormRow => ({
  localId: cryptoRandomId(),
  name: "",
  phone: "",
  whatsapp: "",
  photoFile: null,
  photoPreviewUrl: "",
});

const emptyRows = (): PersonalFormRow[] => [emptyPersonalRow()];

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `row_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

type PersonalFormModalProps = {
  open: boolean;
  rows: PersonalFormRow[];
  saving: boolean;
  formError?: string;
  onClose: () => void;
  onSave: () => void;
  onRowsChange: (rows: PersonalFormRow[]) => void;
};

export function PersonalFormModal({
  open,
  rows,
  saving,
  formError,
  onClose,
  onSave,
  onRowsChange,
}: PersonalFormModalProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = bodyRef.current;
    if (el) el.scrollTop = 0;
  }, [open]);

  // Liberar object URLs al desmontar para no filtrar memoria del navegador.
  useEffect(() => {
    return () => {
      for (const row of rows) {
        if (row.photoPreviewUrl) URL.revokeObjectURL(row.photoPreviewUrl);
      }
    };
    // Solo queremos limpiar al desmontar; las altas/bajas de filas se manejan
    // dentro de los handlers con revokeObjectURL explícito.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!open) return null;

  const updateRow = (
    localId: string,
    patch: Partial<PersonalFormRow>,
  ) => {
    onRowsChange(
      rows.map((r) => (r.localId === localId ? { ...r, ...patch } : r)),
    );
  };

  const addRow = () => {
    onRowsChange([...rows, emptyPersonalRow()]);
  };

  const removeRow = (localId: string) => {
    const next = rows.filter((r) => {
      if (r.localId === localId && r.photoPreviewUrl) {
        URL.revokeObjectURL(r.photoPreviewUrl);
      }
      return r.localId !== localId;
    });
    onRowsChange(next.length > 0 ? next : emptyRows());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:p-6 dark:bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="personal-form-title"
    >
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Cerrar"
        onClick={onClose}
      />

      <div
        className={`relative flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-brand-separator bg-brand-surface shadow-brand-elevated`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={brandModalHeader}>
          <h2
            id="personal-form-title"
            className={brandModalTitle}
          >
            Agregar personal
          </h2>
          <p className="mt-1 text-sm text-brand-secondary">
            Añade uno o varios empleados con su foto, nombre, teléfono y
            WhatsApp. Puedes agregar más filas antes de guardar.
          </p>
        </div>

        <div ref={bodyRef} className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            {rows.map((row, index) => (
              <PersonalRowCard
                key={row.localId}
                row={row}
                index={index}
                canRemove={rows.length > 1}
                disabled={saving}
                uploading={saving && row.photoFile != null}
                onChange={(patch) => updateRow(row.localId, patch)}
                onRemove={() => removeRow(row.localId)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            disabled={saving}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-input-border bg-brand-surface px-4 py-3 text-sm font-medium text-brand-secondary transition hover:border-brand-accent-soft hover:bg-brand-hover hover:text-brand-accent-soft disabled:opacity-50"
          >
            <span aria-hidden className="text-base leading-none">+</span>
            Agregar otro empleado
          </button>
        </div>

        <div className={brandModalFooter}>
          {formError ? (
            <p
              className="mr-auto text-sm text-rose-700 dark:text-rose-300"
              role="alert"
            >
              {formError}
            </p>
          ) : (
            <p className="mr-auto hidden text-xs text-brand-tertiary sm:block">
              Las fotos y datos se guardarán al pulsar Guardar.
            </p>
          )}
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-brand-separator bg-brand-hover px-4 py-2 text-sm font-medium text-brand-primary transition hover:bg-brand-surface-hover disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className={`${brandActionButtonSolid} disabled:opacity-60`}
          >
            {saving ? "Guardando..." : "Guardar personal"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PersonalRowCard({
  row,
  index,
  canRemove,
  disabled,
  uploading,
  onChange,
  onRemove,
}: {
  row: PersonalFormRow;
  index: number;
  canRemove: boolean;
  disabled: boolean;
  uploading: boolean;
  onChange: (patch: Partial<PersonalFormRow>) => void;
  onRemove: () => void;
}) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (row.photoPreviewUrl) {
      URL.revokeObjectURL(row.photoPreviewUrl);
    }
    if (!file) {
      onChange({ photoFile: null, photoPreviewUrl: "" });
      return;
    }
    onChange({ photoFile: file, photoPreviewUrl: URL.createObjectURL(file) });
  };

  const clearPhoto = () => {
    if (row.photoPreviewUrl) {
      URL.revokeObjectURL(row.photoPreviewUrl);
    }
    onChange({ photoFile: null, photoPreviewUrl: "" });
  };

  const hasPhoto = Boolean(row.photoPreviewUrl);
  const showSpinner = uploading && hasPhoto;

  return (
    <div className="rounded-2xl border border-brand-separator/80 bg-brand-surface-hover p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-brand-separator dark:bg-white/[0.03]">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-secondary">
          Empleado {index + 1}
        </p>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="rounded-lg border border-brand-separator bg-brand-surface px-2.5 py-1 text-[11px] font-medium text-brand-secondary transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50 dark:border-brand-separator dark:hover:border-rose-500/40 dark:hover:bg-rose-500/15 dark:hover:text-rose-300"
            aria-label={`Quitar empleado ${index + 1}`}
          >
            Quitar
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
        <section
          className={`flex w-36 shrink-0 flex-col rounded-xl p-2.5 sm:w-40 ${
            hasPhoto
              ? "border-brand-separator/70 bg-brand-hover"
              : "border-brand-separator/70 bg-brand-hover"
          }`}
        >
          <div
            className={`relative mb-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl ${
              hasPhoto ? brandAssetDropzoneLoaded : brandAssetDropzoneIdle
            }`}
          >
            {hasPhoto && !showSpinner ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={row.photoPreviewUrl}
                alt={`Foto de ${row.name || "empleado"}`}
                className="h-full w-full object-cover"
              />
            ) : showSpinner ? (
              <div className="flex flex-col items-center gap-1.5 text-brand-secondary">
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-brand-accent/30 border-t-brand-accent" />
                <span className="text-[11px]">Subiendo…</span>
              </div>
            ) : (
              <div className="px-3 text-center">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-brand-hover text-brand-tertiary">
                  <svg
                    className="h-4 w-4"
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
                <p className="text-[11px] text-brand-secondary">Sin foto</p>
                <p className="mt-0.5 text-[10px] text-brand-tertiary">
                  JPG, PNG o WEBP
                </p>
              </div>
            )}

            {hasPhoto && !showSpinner ? (
              <button
                type="button"
                onClick={clearPhoto}
                disabled={disabled}
                aria-label="Quitar foto"
                className={`${brandAssetRemoveBtn} absolute right-1.5 top-1.5`}
              >
                Quitar
              </button>
            ) : null}
          </div>

          <input
            ref={fileInputRef}
            id={fileInputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={disabled}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              handleFile(file);
              e.target.value = "";
            }}
          />
          <label
            htmlFor={fileInputId}
            className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-medium transition ${
              disabled
                ? "pointer-events-none border-brand-separator bg-brand-hover text-brand-tertiary"
                : "border-brand-accent/30 bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/15"
            }`}
          >
            {hasPhoto ? "Cambiar foto" : "Subir foto"}
          </label>

          {hasPhoto && !showSpinner ? (
            <span className={`${brandAssetReadyPill} mt-2 self-center`}>
              Lista para guardar
            </span>
          ) : null}
        </section>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block space-y-1.5 sm:col-span-3">
            <span className={`text-sm ${brandFormLabel}`}>Nombre</span>
            <input
              type="text"
              value={row.name}
              onChange={(e) => onChange({ name: e.target.value })}
              disabled={disabled}
              placeholder="Ej. Camila Rodríguez"
              className={`${brandInputClass} px-3 py-2.5 text-sm`}
            />
          </label>
          <label className="block space-y-1.5">
            <span className={`text-sm ${brandFormLabel}`}>Teléfono</span>
            <input
              type="tel"
              value={row.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              disabled={disabled}
              placeholder="+57 300 000 0000"
              className={`${brandInputClass} px-3 py-2.5 text-sm`}
            />
          </label>
          <label className="block space-y-1.5 sm:col-span-2">
            <span className={`text-sm ${brandFormLabel}`}>WhatsApp</span>
            <input
              type="tel"
              value={row.whatsapp}
              onChange={(e) => onChange({ whatsapp: e.target.value })}
              disabled={disabled}
              placeholder="+57 300 000 0000"
              className={`${brandInputClass} px-3 py-2.5 text-sm`}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export { emptyRows as emptyPersonalRows };
