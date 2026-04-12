/**
 * Base URL for requests from the browser (Next `/api` proxy by default).
 * Set `NEXT_PUBLIC_API_BASE_URL` in `.env` or Vercel when you need another origin or path.
 */
function resolvePublicApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (raw == null) return "/api";
  const trimmed = raw.trim();
  if (trimmed === "") return "/api";
  return trimmed.replace(/\/+$/, "");
}

export const publicApiBaseUrl = resolvePublicApiBase();
