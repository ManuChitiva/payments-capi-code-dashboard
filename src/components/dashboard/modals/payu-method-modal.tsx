"use client";

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

  return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
              <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0d1320] p-0 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
                <div className="mb-4 flex items-start justify-between">
                  <div className="w-full rounded-t-3xl border-b border-white/10 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 px-6 py-5">
                    <h3 className="text-2xl font-semibold">
                      {mode === "edit" ? "Editar PayU" : "Crear PayU"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-300">
                      Configura credenciales del gateway y su estado operativo.
                    </p>
                  </div>
                </div>
                <div className="space-y-4 px-6 pb-6">
                  {mode === "edit" ? (
                    <p className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-100/95">
                      El servidor no devuelve credenciales en listados ni al
                      guardar. Para rotar API Key, API Login o llave publica,
                      escribe los valores nuevos; deja esos campos vacios para no
                      cambiarlos.
                    </p>
                  ) : null}
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className="text-xs text-slate-400">Nombre</span>
                      <input
                        value={values.name}
                        onChange={(event) =>
                          onChange({ name: event.target.value })
                        }
                        className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-xs text-slate-400">Merchant ID</span>
                      <input
                        value={values.merchantId}
                        onChange={(event) =>
                          onChange({ merchantId: event.target.value })
                        }
                        className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-1.5">
                      <span className="text-xs text-slate-400">Account ID</span>
                      <input
                        value={values.accountId}
                        onChange={(event) =>
                          onChange({ accountId: event.target.value })
                        }
                        className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </label>
                    <label className="space-y-1.5">
                      <span className="text-xs text-slate-400">API Login</span>
                      <input
                        value={values.apiLogin}
                        onChange={(event) =>
                          onChange({ apiLogin: event.target.value })
                        }
                        className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </label>
                  </div>
                  <label className="space-y-1.5">
                    <span className="text-xs text-slate-400">API Key</span>
                    <input
                      value={values.apiKey}
                      onChange={(event) =>
                        onChange({ apiKey: event.target.value })
                      }
                      className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs text-slate-400">
                      Llave publica (public key)
                    </span>
                    <input
                      value={values.keyPublic}
                      onChange={(event) =>
                        onChange({ keyPublic: event.target.value })
                      }
                      placeholder="PK en checkout / Web Checkout"
                      className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex items-center justify-between rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
                      <span>Sandbox</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={values.sandbox}
                        onClick={() => onChange({ sandbox: !values.sandbox })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          values.sandbox ? "bg-emerald-500/80" : "bg-slate-600/70"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                            values.sandbox ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </label>
                    <label className="flex items-center justify-between rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
                      <span>Activo</span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={values.active}
                        onClick={() => onChange({ active: !values.active })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          values.active ? "bg-emerald-500/80" : "bg-slate-600/70"
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
                <div className="mt-1 flex justify-end gap-2 border-t border-white/10 px-6 py-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={onSave}
                    disabled={saving}
                    className="rounded-2xl border border-emerald-300/40 bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-500/30 disabled:opacity-60"
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
