import { NextResponse } from "next/server";

export const revalidate = 60; // 1-minute cache

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols");

  if (!symbols) {
    return NextResponse.json({ error: "symbols parameter required" }, { status: 400 });
  }

  const symbolList = symbols.split(",").map((s) => s.trim().toUpperCase());
  const quotes: StockQuote[] = [];

  try {
    for (const symbol of symbolList) {
      try {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`,
          {
            headers: { "User-Agent": "Mozilla/5.0" },
            next: { revalidate: 60 },
          }
        );

        if (!res.ok) continue;

        const data = await res.json();
        const meta = data?.chart?.result?.[0]?.meta;
        if (!meta) continue;

        const price = meta.regularMarketPrice || 0;
        const prevClose = meta.previousClose || meta.chartPreviousClose || price;
        const change = price - prevClose;
        const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;

        quotes.push({
          symbol,
          price: Math.round(price * 100) / 100,
          change: Math.round(change * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
        });
      } catch {
        // Skip symbols that fail
      }
    }

    return NextResponse.json({ quotes }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}
