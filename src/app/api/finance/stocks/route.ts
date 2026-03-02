import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols");

  if (!symbols) {
    return NextResponse.json({ error: "symbols parameter required" }, { status: 400 });
  }

  const symbolList = symbols.split(",").map((s) => s.trim().toUpperCase());

  try {
    const results = await Promise.all(
      symbolList.map(async (sym) => {
        try {
          const quote = await yahooFinance.quote(sym) as Record<string, unknown>;
          const price = quote.regularMarketPrice as number | undefined;
          if (!price) return null;
          const prevClose = (quote.regularMarketPreviousClose as number) || price;
          const change = price - prevClose;
          const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
          return {
            symbol: (quote.symbol as string) || sym,
            price: Math.round(price * 100) / 100,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100,
            exchange: (quote.fullExchangeName as string) || (quote.exchange as string) || "",
            name: (quote.longName as string) || (quote.shortName as string) || "",
            currency: (quote.currency as string) || "USD",
          };
        } catch {
          return null;
        }
      })
    );

    const quotes = results.filter(Boolean);
    return NextResponse.json(
      { quotes, fetched: quotes.length, requested: symbolList.length },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } }
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch stock data" }, { status: 500 });
  }
}
