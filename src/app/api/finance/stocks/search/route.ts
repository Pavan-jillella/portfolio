import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

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
    const data = await yf.search(query, { quotesCount: 8, newsCount: 0 });
    const quotes = data?.quotes || [];

    const ALLOWED_TYPES = new Set([
      "EQUITY", "ETF", "INDEX", "CURRENCY", "COMMODITY", "CRYPTOCURRENCY",
      "MUTUALFUND", "FUTURE",
    ]);

    const results: SearchResult[] = quotes
      .filter((q) => q.quoteType && ALLOWED_TYPES.has(String(q.quoteType)))
      .map((q) => ({
        symbol: String(q.symbol || ""),
        name: String(q.shortname || q.longname || q.symbol || ""),
        type: String(q.quoteType || "").toLowerCase(),
        exchange: String(q.exchDisp || q.exchange || ""),
      }));

    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
    );
  } catch {
    return NextResponse.json({ results: [] });
  }
}
