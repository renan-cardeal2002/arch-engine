import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_COOKIE_NAME = process.env.TOKEN_COOKIE_NAME || "token";

export async function _get_token() {
  const cookieStore = cookies();
  return (await cookieStore).get(TOKEN_COOKIE_NAME)?.value;
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const token = await _get_token();

    const response = await fetch(`${API_URL}/agent/skill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.detail || "Erro ao vincular habilidade ao agente");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na rota /agent/[id]/skill:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erro desconhecido" },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await _get_token();
    const response = await fetch(`${API_URL}/agent/${params.id}/skill`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const rawText = await response.text();

    try {
      const data = JSON.parse(rawText);
      return NextResponse.json(data);
    } catch (jsonError) {
      console.error("Erro ao parsear JSON:", jsonError);
      return NextResponse.json(
        { error: "Resposta da API não é JSON válido", conteudo: rawText },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro na rota /agent/[id]/skill:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erro desconhecido" },
      { status: 500 }
    );
  }
}
