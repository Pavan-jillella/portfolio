import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 1) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await yahooFinance.search(query, { quotesCount: 8, newsCount: 0 }) as Record<string, unknown>;
    const quotes = (data?.quotes || []) as Record<string, unknown>[];

    const ALLOWED_TYPES = new Set([
      "EQUITY", "ETF", "INDEX", "CURRENCY", "COMMODITY", "CRYPTOCURRENCY",
      "MUTUALFUND", "FUTURE",
    ]);

    const results: SearchResult[] = quotes
      .filter((q) => q.quoteType && ALLOWED_TYPES.has(q.quoteType as string))
      .map((q) => ({
        symbol: (q.symbol as string) || "",
        name: (q.shortname as string) || (q.longname as string) || (q.symbol as string) || "",
        type: ((q.quoteType as string) || "").toLowerCase(),
        exchange: (q.exchDisp as string) || (q.exchange as string) || "",
      }));

    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
    );
  } catch {
    return NextResponse.json({ results: [] });
  }
}
