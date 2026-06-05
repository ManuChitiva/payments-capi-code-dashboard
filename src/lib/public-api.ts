/**
 * Base URL for all browser `fetch` calls.
 *
 * - `NEXT_PUBLIC_API_BASE_URL` definida: se usa tal cual (sin barra final).
 * - Sin definir en `next dev`: `/api` (proxy Next → backend, sin CORS).
 * - Sin definir en build de producción: `/api` (Next reenvía con `BACKEND_API_URL` en el servidor).
 * - Producción directa al API: en Vercel por ejemplo
 *   `NEXT_PUBLIC_API_BASE_URL=https://api.tudominio.com/store` (CORS en el backend).
 */
function resolvePublicApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (raw) {
    const normalized = raw.replace(/\/+$/, "");
    // En dev, si el API es otro origen (ej. https://localhost:8094), usar proxy Next → sin CORS
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      try {
        const apiOrigin = new URL(normalized).origin;
        if (apiOrigin !== window.location.origin) {
          return "/api";
        }
      } catch {
        /* URL inválida: se usa tal cual */
      }
    }
    return normalized;
  }
  if (process.env.NODE_ENV === "development") {
    return "/api";
  }
  return "/api";
}

export const publicApiBaseUrl = resolvePublicApiBase();
