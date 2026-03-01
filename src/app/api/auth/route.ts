import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { pin } = await request.json();
  const correctPin = process.env.AUTH_PIN;

  if (!correctPin) {
    return NextResponse.json({ error: "Auth not configured" }, { status: 500 });
  }

  if (pin !== correctPin) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("auth-token", "authenticated", {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "lax",
  });
  return response;
}
