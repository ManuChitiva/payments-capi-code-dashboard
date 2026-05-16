"use client";

export function DashboardStatCard({
  title,
  value,
  fullValue,
  tone = "emerald",
  icon,
}: {
  title: string;
  value: string;
  fullValue?: string;
  tone?: "emerald" | "cyan" | "violet" | "amber";
  icon: string;
}) {
  const toneStyles: Record<
    typeof tone,
    { line: string; badge: string; glow: string }
  > = {
    emerald: {
      line: "from-emerald-300 to-emerald-500",
      badge: "bg-emerald-400/20 text-emerald-100 border-emerald-300/40",
      glow: "shadow-[0_0_18px_rgba(16,185,129,0.25)]",
    },
    cyan: {
      line: "from-cyan-300 to-cyan-500",
      badge: "bg-cyan-400/20 text-cyan-100 border-cyan-300/40",
      glow: "shadow-[0_0_18px_rgba(34,211,238,0.25)]",
    },
    violet: {
      line: "from-violet-300 to-violet-500",
      badge: "bg-violet-400/20 text-violet-100 border-violet-300/40",
      glow: "shadow-[0_0_18px_rgba(168,85,247,0.25)]",
    },
    amber: {
      line: "from-amber-300 to-amber-500",
      badge: "bg-amber-400/20 text-amber-100 border-amber-300/40",
      glow: "shadow-[0_0_18px_rgba(245,158,11,0.25)]",
    },
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/6 to-transparent opacity-0 transition-all duration-500 group-hover:translate-x-full group-hover:opacity-100" />
      <span
        className={`absolute inset-y-3 left-0 w-1 rounded-r-full bg-gradient-to-b ${toneStyles[tone].line}`}
      />
      <div className="relative z-10 flex items-start justify-between pl-2">
        <div className="min-w-0 flex-1 pr-2">
          <p className="text-xs text-slate-400">{title}</p>
          <p
            className="mt-1 truncate text-[clamp(1.15rem,2.6vw,1.85rem)] font-semibold leading-none transition-transform duration-300 group-hover:translate-x-0.5"
            title={fullValue ?? value}
          >
            {value}
          </p>
        </div>
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border text-sm transition-transform duration-300 group-hover:scale-105 ${toneStyles[tone].badge} ${toneStyles[tone].glow}`}
        >
          {icon}
        </span>
      </div>
    </article>
  );
}
