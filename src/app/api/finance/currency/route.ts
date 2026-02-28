import { NextResponse } from "next/server";

export const revalidate = 3600; // 1-hour cache

export async function GET() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch exchange rates" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ rates: data.rates, base: "USD", updated: data.date }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch exchange rates" }, { status: 500 });
  }
}
