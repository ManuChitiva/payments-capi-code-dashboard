import {
  brandSectionDesc,
  brandSectionTitle,
} from "@/lib/brand-theme";

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
        <h2 className={brandSectionTitle}>{title}</h2>
        <p className={brandSectionDesc}>{description}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
