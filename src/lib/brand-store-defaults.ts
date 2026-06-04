/** Acento de negocio por defecto — azul Apple */
export const DEFAULT_STORE_PRIMARY_COLOR = "#0071e3";

const HEX_COLOR = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export function normalizeStorePrimaryColor(
  value: string | null | undefined,
): string {
  const trimmed = value?.trim() ?? "";
  if (HEX_COLOR.test(trimmed)) {
    return expandShortHex(trimmed);
  }
  return DEFAULT_STORE_PRIMARY_COLOR;
}

function expandShortHex(hex: string): string {
  if (hex.length === 7) return hex.toLowerCase();
  const r = hex[1];
  const g = hex[2];
  const b = hex[3];
  return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
}

export function isValidStorePrimaryColor(value: string): boolean {
  return HEX_COLOR.test(value.trim());
}
