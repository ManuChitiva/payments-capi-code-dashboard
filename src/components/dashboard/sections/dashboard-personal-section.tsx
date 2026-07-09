"use client";

import { SectionHeader } from "@/components/dashboard/section-header";
import { primaryButtonClass } from "@/lib/dashboard/constants";
import {
  brandSurfaceCard,
  brandTextPrimary,
  brandTextSecondary,
  brandTextTertiary,
} from "@/lib/brand-theme";
import type { PersonalMember } from "@/services/personalService";

export type DashboardPersonalSectionProps = {
  title: string;
  description: string;
  personal: PersonalMember[];
  loading: boolean;
  onAdd: () => void;
  onDelete: (member: PersonalMember) => void;
};

export function DashboardPersonalSection({
  title,
  description,
  personal,
  loading,
  onAdd,
  onDelete,
}: DashboardPersonalSectionProps) {
  return (
    <section className="rounded-2xl border border-brand-separator bg-brand-surface/90 p-4 shadow-[0_10px_28px_-10px_rgba(0,0,0,0.14),0_2px_8px_-2px_rgba(0,0,0,0.06)] backdrop-blur sm:p-6 dark:border-brand-separator dark:shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_18px_48px_-12px_rgba(0,0,0,0.6),0_6px_20px_-6px_rgba(41,151,255,0.16)]">
      <SectionHeader
        title={title}
        description={description}
        action={
          <button type="button" onClick={onAdd} className={primaryButtonClass}>
            + Agregar personal
          </button>
        }
      />

      {loading ? (
        <p className={`text-sm ${brandTextSecondary}`}>Cargando personal…</p>
      ) : personal.length === 0 ? (
        <EmptyState onAdd={onAdd} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {personal.map((member) => (
            <PersonalCard
              key={member.id}
              member={member}
              onDelete={() => onDelete(member)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-separator bg-brand-hover px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-brand-separator bg-brand-surface text-2xl text-brand-tertiary">
        ☻
      </div>
      <p className={`text-sm font-medium ${brandTextPrimary}`}>
        Aún no has agregado personal
      </p>
      <p className={`mt-1 max-w-sm text-xs ${brandTextTertiary}`}>
        Crea fichas con foto, nombre, teléfono y WhatsApp para que tus clientes
        puedan contactarlos directamente.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className={`${primaryButtonClass} mt-5`}
      >
        + Agregar el primero
      </button>
    </div>
  );
}

function PersonalCard({
  member,
  onDelete,
}: {
  member: PersonalMember;
  onDelete: () => void;
}) {
  const whatsappDigits = (member.whatsapp ?? "").replace(/\D/g, "");
  const whatsappHref = whatsappDigits.length > 0
    ? `https://wa.me/${whatsappDigits}`
    : null;
  const phoneDigits = (member.phone ?? "").trim();
  const phoneHref = phoneDigits.length > 0
    ? `tel:${phoneDigits.replace(/\s+/g, "")}`
    : null;

  return (
    <article className={`${brandSurfaceCard} overflow-hidden p-0`}>
      <div className="flex items-start gap-4 p-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-separator bg-brand-surface text-2xl text-brand-tertiary">
          {member.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={member.photoUrl}
              alt={member.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span aria-hidden>{member.name.slice(0, 1).toUpperCase() || "☻"}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className={`truncate text-sm font-semibold ${brandTextPrimary}`}>
            {member.name}
          </p>
          <div className="mt-1.5 space-y-1 text-xs">
            {phoneHref ? (
              <a
                href={phoneHref}
                className={`flex items-center gap-1.5 ${brandTextSecondary} hover:text-brand-accent-soft`}
              >
                <span aria-hidden>☎</span>
                <span className="truncate">{member.phone}</span>
              </a>
            ) : (
              <p className={brandTextTertiary}>Sin teléfono</p>
            )}
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-300/90 dark:hover:text-emerald-200"
              >
                <span aria-hidden>✆</span>
                <span className="truncate">
                  {member.whatsapp}
                </span>
              </a>
            ) : (
              <p className={brandTextTertiary}>Sin WhatsApp</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-brand-separator/70 bg-brand-hover px-4 py-2 dark:border-brand-separator dark:bg-white/[0.03]">
        <span className={`text-[10px] font-medium uppercase tracking-wide ${brandTextTertiary}`}>
          {member.active ? "Activo" : "Inactivo"}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-lg px-2 py-1 text-[11px] font-medium text-brand-secondary transition hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-500/15 dark:hover:text-rose-300"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
