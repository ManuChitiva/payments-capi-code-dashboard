export const THEME_STORAGE_KEY = "capicode-theme";

export type ThemeMode = "light" | "dark";

export function getStoredTheme(): ThemeMode | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

export function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function resolveInitialTheme(): ThemeMode {
  return getStoredTheme() ?? "dark";
}
