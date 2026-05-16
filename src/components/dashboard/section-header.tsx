type SectionHeaderProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function SectionHeader({
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-(family-name:--font-rajdhani) text-2xl font-semibold tracking-tight text-white sm:text-[1.65rem]">
          {title}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
