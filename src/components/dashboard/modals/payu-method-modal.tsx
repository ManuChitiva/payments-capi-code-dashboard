"use client";

import {
  brandActionButtonSolid,
  brandFormLabel,
  brandInputClass,
  brandModalCancelBtn,
  brandModalDesc,
  brandModalFooter,
  brandModalHeader,
  brandModalOverlay,
  brandModalPanelLg,
  brandModalTitle,
  dashboardNoticeWarn,
} from "@/lib/brand-theme";
import type { PayuFormState } from "@/types/dashboard";

export type { PayuFormState };

type PayuMethodModalProps = {
  open: boolean;
  mode: "create" | "edit";
  values: PayuFormState;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
  onChange: (patch: Partial<PayuFormState>) => void;
};

export function PayuMethodModal({
  open,
  mode,
  values,
  saving,
  onClose,
  onSave,
  onChange,
}: PayuMethodModalProps) {
  if (!open) return null;

  const inputClass = `${brandInputClass} rounded-2xl px-4 py-3 text-sm`;

  return (
    <div className={brandModalOverlay} onClick={onClose}>
      <div
        className={`${brandModalPanelLg} p-0`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${brandModalHeader} rounded-t-3xl`}>
          <h3 className={`${brandModalTitle} text-2xl`}>
            {mode === "edit" ? "Editar PayU" : "Crear PayU"}
          </h3>
          <p className={brandModalDesc}>
            Configura credenciales del gateway y su estado operativo.
          </p>
        </div>
                <div className="space-y-4 px-6 pb-6">
                  {mode === "edit" ? (
                    <p className={dashboardNoticeWarn}>
                      El servidor no devuelve credenciales en listados ni al
                      guardar. Para rotar API Key, API Login o llave publica,
                      escribe los valores nuevos; deja esos campos vacios para no
                      cambiarlos.
                    </p>
                  ) : null}
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className={`text-xs ${brandFormLabel}`}>Nombre</span>
                      <input
                        value={values.name}
                        onChange={(event) =>
                          onChange({ name: event.target.value })
                        }
                        className={inputClass}
                      />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-xs text-brand-secondary">Merchant ID</span>
                      <input
                        value={values.merchantId}
                        onChange={(event) =>
                          onChange({ merchantId: event.target.value })
                        }
                        className={inputClass}
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className="text-xs text-brand-secondary">Account ID</span>
                      <input
                        value={values.accountId}
                        onChange={(event) =>
                          onChange({ accountId: event.target.value })
                        }
                        className={inputClass}
                      />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-xs text-brand-secondary">API Login</span>
                      <input
                        value={values.apiLogin}
                        onChange={(event) =>
                          onChange({ apiLogin: event.target.value })
                        }
                        className={inputClass}
                      />
                    </label>
                  </div>
                  <label className="space-y-1.5">
                    <span className="text-xs text-brand-secondary">API Key</span>
                    <input
                      value={values.apiKey}
                      onChange={(event) =>
                        onChange({ apiKey: event.target.value })
                      }
                      className={inputClass}
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs text-brand-secondary">
                      Llave publica (public key)
                    </span>
                    <input
                      value={values.keyPublic}
                      onChange={(event) =>
                        onChange({ keyPublic: event.target.value })
                      }
                      placeholder="PK en checkout / Web Checkout"
                      className={inputClass}
                    />
                  </label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex items-center justify-between rounded-2xl border border-brand-input-border bg-brand-input px-4 py-3 text-sm text-brand-primary">
                      <span>Sandbox</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={values.sandbox}
                        onClick={() => onChange({ sandbox: !values.sandbox })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          values.sandbox ? "bg-brand-accent" : "bg-brand-tertiary"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                            values.sandbox ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </label>
                    <label className="flex items-center justify-between rounded-2xl border border-brand-input-border bg-brand-input px-4 py-3 text-sm text-brand-primary">
                      <span>Activo</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={values.active}
                        onClick={() => onChange({ active: !values.active })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          values.active ? "bg-brand-accent" : "bg-brand-tertiary"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                            values.active ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </label>
                  </div>
                </div>
                <div className={brandModalFooter}>
                  <button
                    type="button"
                    onClick={onClose}
                    className={brandModalCancelBtn}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={onSave}
                    disabled={saving}
                    className={`${brandActionButtonSolid} disabled:opacity-60`}
                  >
                    {saving
                      ? mode === "edit"
                        ? "Guardando..."
                        : "Creando..."
                      : mode === "edit"
                        ? "Guardar cambios"
                        : "Crear PayU"}
                  </button>
                </div>
              </div>
            </div>
  );
}
