import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_AGENT_URL

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ error: data.detail || 'Falha no login' }, { status: res.status })
    }

    const token = data.token
    const response = NextResponse.json({ success: true })
    if (token) {
      response.cookies.set('token', token, { httpOnly: true })
    }
    return response
  } catch {
    return NextResponse.json({ error: 'Erro ao conectar ao servidor' }, { status: 500 })
  }
}
