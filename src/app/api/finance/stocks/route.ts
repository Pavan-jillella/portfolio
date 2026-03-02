import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

export const dynamic = "force-dynamic";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

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
          const quote = await yf.quote(sym);
          const price = quote.regularMarketPrice;
          if (!price) return null;
          const prevClose = quote.regularMarketPreviousClose || price;
          const change = price - prevClose;
          const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
          return {
            symbol: quote.symbol,
            price: Math.round(price * 100) / 100,
            change: Math.round(change * 100) / 100,
            changePercent: Math.round(changePercent * 100) / 100,
            exchange: quote.fullExchangeName || quote.exchange || "",
            name: quote.longName || quote.shortName || "",
            currency: quote.currency || "USD",
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
