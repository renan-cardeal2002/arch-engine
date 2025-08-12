import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_COOKIE_NAME = process.env.TOKEN_COOKIE_NAME || "token";

export async function _get_token() {
  const cookieStore = cookies();
  return (await cookieStore).get(TOKEN_COOKIE_NAME)?.value;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = await _get_token();
    const response = await fetch(`${API_URL}/service/${body.id}/step`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.detail || "Erro ao criar a etapa");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na rota /service/:id/step:", error);
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
    const response = await fetch(`${API_URL}/service/${params.id}/steps`, {
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
      throw new Error(`Erro ao buscar etapas: ${text}`);
    }

    if (!response.ok) {
      console.error("Erro da API:", data);
      throw new Error(
        data?.detail || `Erro ${response.status} ao buscar etapas`
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na rota /service/:id/steps:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erro desconhecido" },
      { status: 500 }
    );
  }
}
