import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const TOKEN_COOKIE_NAME = process.env.TOKEN_COOKIE_NAME || "token";

export async function POST() {
  (await cookies()).delete(TOKEN_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
