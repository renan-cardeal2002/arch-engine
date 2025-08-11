import { cookies } from "next/headers";
import { decodeJwt } from "jose";

const TOKEN_COOKIE_NAME = process.env.TOKEN_COOKIE_NAME || "token";

export async function getTokenFromCookies() {
  const c = await cookies();
  return c.get(TOKEN_COOKIE_NAME)?.value || null;
}

export function isTokenExpired(token: string) {
  try {
    const payload = decodeJwt(token);
    if (!payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now;
  } catch {
    return true;
  }
}
