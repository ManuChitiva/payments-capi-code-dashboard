"use client";

import {
  brandActionButtonSolid,
  brandFormLabel,
  brandFormLabelHint,
  brandInputClass,
  brandModalCancelBtn,
  brandModalDesc,
  brandModalFooter,
  brandModalHeader,
  brandModalOverlay,
  brandModalPanelMd,
  brandModalTitle,
} from "@/lib/brand-theme";

export type NewStoreFormValues = {
  storeName: string;
  storeLabel: string;
  storeSlug: string;
};

type CreateStoreModalProps = {
  open: boolean;
  values: NewStoreFormValues;
  creating: boolean;
  onClose: () => void;
  onCreate: () => void;
  onChange: (patch: Partial<NewStoreFormValues>) => void;
};

export function CreateStoreModal({
  open,
  values,
  creating,
  onClose,
  onCreate,
  onChange,
}: CreateStoreModalProps) {
  if (!open) return null;

  return (
    <div className={brandModalOverlay} onClick={onClose}>
      <div className={brandModalPanelMd} onClick={(e) => e.stopPropagation()}>
        <div className={brandModalHeader}>
          <h3 className={brandModalTitle}>Nueva tienda</h3>
          <p className={brandModalDesc}>
            Añade otra tienda a tu cuenta. Podrás cambiar entre ellas desde el
            selector superior.
          </p>
        </div>
        <div className="space-y-4 px-6 py-5">
          <label className="block space-y-1.5 text-sm">
            <span className={brandFormLabel}>Nombre de la tienda</span>
            <input
              type="text"
              value={values.storeName}
              onChange={(e) => onChange({ storeName: e.target.value })}
              className={`${brandInputClass} px-3 py-2.5 text-sm`}
              placeholder="Mi segunda tienda"
              disabled={creating}
            />
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className={brandFormLabel}>
              Etiqueta visible <span className={brandFormLabelHint}>(opcional)</span>
            </span>
            <input
              type="text"
              value={values.storeLabel}
              onChange={(e) => onChange({ storeLabel: e.target.value })}
              className={`${brandInputClass} px-3 py-2.5 text-sm`}
              disabled={creating}
            />
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className={brandFormLabel}>
              Slug en URL <span className={brandFormLabelHint}>(opcional)</span>
            </span>
            <input
              type="text"
              value={values.storeSlug}
              onChange={(e) => onChange({ storeSlug: e.target.value })}
              className={`${brandInputClass} px-3 py-2.5 text-sm`}
              placeholder="mi-segunda-tienda"
              disabled={creating}
            />
          </label>
        </div>
        <div className={brandModalFooter}>
          <button
            type="button"
            onClick={onClose}
            disabled={creating}
            className={brandModalCancelBtn}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onCreate}
            disabled={creating}
            className={`${brandActionButtonSolid} disabled:opacity-60`}
          >
            {creating ? "Creando…" : "Crear tienda"}
          </button>
        </div>
      </div>
    </div>
  );
}
