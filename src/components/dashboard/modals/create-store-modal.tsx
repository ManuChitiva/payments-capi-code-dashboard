"use client";

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
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
              <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-white/15 bg-[#0d1320] shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:rounded-3xl">
                <div className="border-b border-white/10 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-violet-500/10 px-6 py-5">
                  <h3 className="text-xl font-semibold">Nueva tienda</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Añade otra tienda a tu cuenta. Podrás cambiar entre ellas desde
                    el selector superior.
                  </p>
                </div>
                <div className="space-y-4 px-6 py-5">
                  <label className="block space-y-1.5 text-sm">
                    <span className="text-slate-300">Nombre de la tienda</span>
                    <input
                      type="text"
                      value={values.storeName}
                      onChange={(e) =>
                        onChange({ storeName: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-slate-100 outline-none focus:border-emerald-400"
                      placeholder="Mi segunda tienda"
                      disabled={creating}
                    />
                  </label>
                  <label className="block space-y-1.5 text-sm">
                    <span className="text-slate-300">
                      Etiqueta visible{" "}
                      <span className="text-slate-500">(opcional)</span>
                    </span>
                    <input
                      type="text"
                      value={values.storeLabel}
                      onChange={(e) =>
                        onChange({ storeLabel: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-slate-100 outline-none focus:border-emerald-400"
                      disabled={creating}
                    />
                  </label>
                  <label className="block space-y-1.5 text-sm">
                    <span className="text-slate-300">
                      Slug en URL <span className="text-slate-500">(opcional)</span>
                    </span>
                    <input
                      type="text"
                      value={values.storeSlug}
                      onChange={(e) =>
                        onChange({ storeSlug: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-slate-100 outline-none focus:border-emerald-400"
                      placeholder="mi-segunda-tienda"
                      disabled={creating}
                    />
                  </label>
                </div>
                <div className="flex justify-end gap-2 border-t border-white/10 px-6 py-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={creating}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10 disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={onCreate}
                    disabled={creating}
                    className="rounded-xl border border-emerald-300/40 bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-100 hover:bg-emerald-500/30 disabled:opacity-60"
                  >
                    {creating ? "Creando…" : "Crear tienda"}
                  </button>
                </div>
              </div>
            </div>
  );
}
