import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const TOKEN_COOKIE_NAME = process.env.TOKEN_COOKIE_NAME || "token";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const resp = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const err = await resp.text();
    return NextResponse.json(
      { error: err || "Login failed" },
      { status: resp.status }
    );
  }

  const { token } = await resp.json();

  // Opcional: extrair exp do JWT pra setar Max-Age coerente
  const [, payloadB64] = token.split(".");
  const payload = JSON.parse(Buffer.from(payloadB64, "base64").toString());
  const expSeconds: number | undefined = payload?.exp;
  const maxAge = expSeconds
    ? Math.max(0, expSeconds - Math.floor(Date.now() / 1000))
    : 60 * 60 * 24;

  (await cookies()).set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return NextResponse.json({ ok: true });
}
