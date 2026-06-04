"use client";

import {
  DashboardStatIcon,
  type DashboardStatIconName,
} from "@/components/dashboard/dashboard-stat-icons";
import { dashboardStatBadgeLight, dashboardStatCardClass } from "@/lib/brand-theme";

const toneDarkLine: Record<
  "emerald" | "blue" | "cyan" | "violet" | "amber",
  string
> = {
  emerald: "from-emerald-400 to-emerald-600",
  blue: "from-brand-accent to-brand-accent-soft",
  cyan: "from-brand-accent to-brand-accent-soft",
  violet: "from-[#5e5ce6] to-[#4240a8]",
  amber: "from-amber-400 to-amber-600",
};

const toneDarkBadge: Record<
  "emerald" | "blue" | "cyan" | "violet" | "amber",
  string
> = {
  emerald:
    "dark:border-emerald-300/40 dark:bg-emerald-400/20 dark:text-emerald-100",
  blue: "dark:border-brand-accent-soft/35 dark:bg-brand-accent-soft/15 dark:text-brand-accent-soft",
  cyan: "dark:border-brand-accent-soft/35 dark:bg-brand-accent-soft/15 dark:text-brand-accent-soft",
  violet:
    "dark:border-violet-300/40 dark:bg-violet-400/20 dark:text-violet-100",
  amber:
    "dark:border-amber-300/40 dark:bg-amber-400/20 dark:text-amber-100",
};

export function DashboardStatCard({
  title,
  value,
  fullValue,
  tone = "blue",
  icon,
}: {
  title: string;
  value: string;
  fullValue?: string;
  tone?: "emerald" | "blue" | "cyan" | "violet" | "amber";
  icon: DashboardStatIconName;
}) {
  return (
    <article className={dashboardStatCardClass}>
      <span
        className={`absolute inset-y-3 left-0 hidden w-1 rounded-r-full bg-gradient-to-b dark:block ${toneDarkLine[tone]}`}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3 md:dark:pl-2">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium tracking-wide text-brand-secondary uppercase">
            {title}
          </p>
          <p
            className="mt-1.5 truncate text-[clamp(1.15rem,2.6vw,1.85rem)] font-semibold leading-none tracking-tight text-brand-primary"
            title={fullValue ?? value}
          >
            {value}
          </p>
        </div>
        <span
          className={`${dashboardStatBadgeLight} ${toneDarkBadge[tone]}`}
          aria-hidden
        >
          <DashboardStatIcon name={icon} />
        </span>
      </div>
    </article>
  );
}
