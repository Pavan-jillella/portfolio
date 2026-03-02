import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Never cache this route on the edge

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

// Try multiple Yahoo Finance endpoints for resilience
async function fetchYahooPrice(symbol: string): Promise<StockQuote | null> {
  const endpoints = [
    // Primary: chart API
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`,
    // Fallback: query2 host
    `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        cache: "no-store", // Always fetch fresh - no server Data Cache
      });

      if (!res.ok) continue;

      const data = await res.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (!meta || !meta.regularMarketPrice) continue;

      const price = meta.regularMarketPrice;
      const prevClose = meta.previousClose || meta.chartPreviousClose || price;
      const change = price - prevClose;
      const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;

      return {
        symbol,
        price: Math.round(price * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
      };
    } catch {
      continue;
    }
  }
  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols");

  if (!symbols) {
    return NextResponse.json({ error: "symbols parameter required" }, { status: 400 });
  }

  const symbolList = symbols.split(",").map((s) => s.trim().toUpperCase());

  try {
    // Fetch all symbols in parallel for speed
    const results = await Promise.all(symbolList.map(fetchYahooPrice));
    const quotes = results.filter((q): q is StockQuote => q !== null);

    return NextResponse.json(
      { quotes, fetched: quotes.length, requested: symbolList.length },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } }
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}
