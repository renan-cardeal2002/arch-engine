import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TEMP_TOKEN = process.env.TEMP_TOKEN || "";

export async function _force_login() {
  const cookieStore = cookies();

  (await cookieStore).set("token", TEMP_TOKEN, {
    httpOnly: false,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ success: true });
}

export async function POST(request: NextRequest) {
  try {
    await _force_login();
    const body = await request.json();

    // Busca o token JWT do cookie
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    const response = await fetch(`${API_URL}/agent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.detail || "Erro ao criar a agente");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na rota /agent:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erro desconhecido" },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    await _force_login();
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    const response = await fetch(`${API_URL}/agent`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let data;

    try {
      data = await response.json();
    } catch (jsonError) {
      const text = await response.text();
      console.error("Resposta não é JSON. Conteúdo bruto:", text);
      throw new Error(`Erro ao buscar agentes: ${text}`);
    }

    if (!response.ok) {
      console.error("Erro da API:", data);
      throw new Error(
        data?.detail || `Erro ${response.status} ao buscar agentes`
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na rota /agent:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erro desconhecido" },
      { status: 500 }
    );
  }
}
