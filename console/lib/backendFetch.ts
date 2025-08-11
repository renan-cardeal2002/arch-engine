import { NextResponse } from "next/server";
import { getTokenFromCookies, isTokenExpired } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function backendFetch(path: string, init: RequestInit = {}) {
  const token = await getTokenFromCookies();

  if (!token || isTokenExpired(token)) {
    // Sem sessão: devolve 401 “local” pra quem chamou lidar com redirect
    return new Response("Unauthorized", { status: 401 });
  }

  const headers = new Headers(init.headers || {});
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");

  const resp = await fetch(`${API_URL}${path}`, { ...init, headers });

  // Se o backend respondeu 401, sessão inválida: opcionalmente limpar cookie via /api/auth/logout
  if (resp.status === 401) {
    // não dá pra chamar cookies().delete aqui, mas podemos sinalizar
    return new Response("Unauthorized", { status: 401 });
  }

  return resp;
}
