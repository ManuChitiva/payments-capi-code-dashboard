const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  FAILED: "Fallido",
};

export function formatOrderStatus(status: string): string {
  const key = status?.trim().toUpperCase() ?? "";
  return ORDER_STATUS_LABELS[key] ?? status;
}

export function orderStatusBadgeClass(status: string): string {
  const key = status?.trim().toUpperCase() ?? "";
  switch (key) {
    case "PAID":
      return "border-brand-accent/25 bg-brand-accent/10 text-brand-accent dark:border-brand-accent-soft/35 dark:bg-brand-accent/15 dark:text-brand-accent-soft";
    case "FAILED":
      return "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300";
    default:
      return "border-brand-separator bg-brand-hover text-brand-secondary";
  }
}

export function paymentStatusBadgeClass(status: string): string {
  const key = status?.trim().toUpperCase() ?? "";
  if (key === "APPROVED" || key === "PAID" || key === "4") {
    return "border-brand-accent/25 bg-brand-accent/10 text-brand-accent dark:border-brand-accent-soft/35 dark:bg-brand-accent/15 dark:text-brand-accent-soft";
  }
  if (key === "DECLINED" || key === "REJECTED" || key === "FAILED") {
    return "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300";
  }
  return "border-brand-separator bg-brand-hover text-brand-primary";
}
