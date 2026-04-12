import type { AuthLoginResponse, AuthRegisterPayload } from "@/lib/auth-types";
import { publicApiBaseUrl } from "@/lib/public-api";

export async function parseFailedResponseMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = (await response.json()) as Record<string, unknown>;
    const msg =
      (typeof body.message === "string" && body.message) ||
      (typeof body.detail === "string" && body.detail) ||
      (typeof body.error === "string" && body.error);
    if (msg) return msg;
  } catch {
    /* cuerpo no JSON */
  }
  return fallback;
}

export async function postAuthLogin(
  email: string,
  password: string,
): Promise<{ ok: true; data: AuthLoginResponse } | { ok: false; message: string }> {
  const response = await fetch(`${publicApiBaseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    let fallback = "No se pudo iniciar sesión. Intenta de nuevo.";
    if (response.status === 401) fallback = "Correo o contraseña incorrectos.";
    else if (response.status >= 500)
      fallback = "El servicio no está disponible. Intenta más tarde.";
    const message = await parseFailedResponseMessage(response, fallback);
    return { ok: false, message };
  }
  const data = (await response.json()) as AuthLoginResponse;
  return { ok: true, data };
}

export async function postAuthRegister(
  payload: AuthRegisterPayload,
): Promise<{ ok: true; data: AuthLoginResponse } | { ok: false; message: string }> {
  const body: Record<string, string> = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    storeName: payload.storeName,
    registrationCode: payload.registrationCode.trim(),
  };
  if (payload.storeLabel?.trim()) body.storeLabel = payload.storeLabel.trim();
  if (payload.storeSlug?.trim()) body.storeSlug = payload.storeSlug.trim();

  const response = await fetch(`${publicApiBaseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let fallback = "No se pudo crear la cuenta. Intenta de nuevo.";
    if (response.status === 403) {
      fallback =
        "Código de registro inválido o ya utilizado. Solicita un código nuevo.";
    } else if (response.status === 409) {
      fallback = "El correo o el identificador de tienda ya están en uso.";
    } else if (response.status >= 500) {
      fallback = "El servicio no está disponible. Intenta más tarde.";
    }
    const message = await parseFailedResponseMessage(response, fallback);
    return { ok: false, message };
  }
  const data = (await response.json()) as AuthLoginResponse;
  return { ok: true, data };
}
