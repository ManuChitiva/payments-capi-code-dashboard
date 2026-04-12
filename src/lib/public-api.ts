/**
 * Base URL for all browser `fetch` calls.
 *
 * - `NEXT_PUBLIC_API_BASE_URL` definida: se usa tal cual (sin barra final).
 * - Sin definir en `next dev`: `http://localhost:8094`.
 * - Sin definir en build de producción: `/api` (Next reenvía con `BACKEND_API_URL` en el servidor).
 * - Producción directa al API: en Vercel por ejemplo
 *   `NEXT_PUBLIC_API_BASE_URL=https://api.tudominio.com/store` (CORS en el backend).
 */
function resolvePublicApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (raw != null) {
    const trimmed = raw.trim();
    if (trimmed !== "") return trimmed.replace(/\/+$/, "");
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:8094/store";
  }
  return "/api";
}

export const publicApiBaseUrl = resolvePublicApiBase();
