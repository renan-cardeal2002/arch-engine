import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TEMP_TOKEN = process.env.TEMP_TOKEN || "";

async function _force_login() {
  const cookieStore = cookies();
  (await cookieStore).set("token", TEMP_TOKEN, {
    httpOnly: false,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await _force_login();
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;
    console.log(params.id);

    const response = await fetch(`${API_URL}/agent/${params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const rawText = await response.text();
    console.log("Resposta bruta:", rawText);

    try {
      const data = JSON.parse(rawText); // força o JSON pra ver o erro real
      return NextResponse.json(data);
    } catch (jsonError) {
      console.error("Erro ao parsear JSON:", jsonError);
      return NextResponse.json(
        { error: "Resposta da API não é JSON válido", conteudo: rawText },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro na rota /agent/[id]:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erro desconhecido" },
      { status: 500 }
    );
  }
}
