import { NextRequest, NextResponse } from "next/server";

const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL;

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const response = await fetch(`${AGENT_URL}/tasks/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in /tasks/create route", error);
    return NextResponse.json(
      { error: "Failed to create tasks" },
      { status: 500 }
    );
  }
}
