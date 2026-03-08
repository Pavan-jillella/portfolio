import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch exchange rates" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({
      rates: data.rates,
      base: "USD",
      updated: data.date,
      fetchedAt: new Date().toISOString(),
    }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch exchange rates" }, { status: 500 });
  }
}
