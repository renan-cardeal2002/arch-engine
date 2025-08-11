import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

const TOKEN_COOKIE_NAME = process.env.TOKEN_COOKIE_NAME || "token";

// Ajuste esse matcher para o que você quiser proteger
export const config = {
  matcher: ["/(protected)/(.*)"], // ex: tudo dentro de app/(protected)
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    const login = new URL("/login", req.url);
    login.searchParams.set(
      "callbackUrl",
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(login);
  }

  try {
    const payload = decodeJwt(token);
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp <= now) {
      const login = new URL("/login", req.url);
      login.searchParams.set(
        "callbackUrl",
        req.nextUrl.pathname + req.nextUrl.search
      );
      return NextResponse.redirect(login);
    }
  } catch {
    const login = new URL("/login", req.url);
    login.searchParams.set(
      "callbackUrl",
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}
