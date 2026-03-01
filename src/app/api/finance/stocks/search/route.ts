import { NextResponse } from "next/server";

export const revalidate = 3600; // 1-hour cache

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
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await res.json();
    const quotes = data?.quotes || [];

    const ALLOWED_TYPES = new Set([
      "EQUITY", "ETF", "INDEX", "CURRENCY", "COMMODITY", "CRYPTOCURRENCY",
      "MUTUALFUND", "FUTURE",
    ]);

    const results: SearchResult[] = quotes
      .filter((q: { quoteType?: string }) => q.quoteType && ALLOWED_TYPES.has(q.quoteType))
      .map((q: { symbol?: string; shortname?: string; longname?: string; quoteType?: string; exchange?: string; exchDisp?: string }) => ({
        symbol: q.symbol || "",
        name: q.shortname || q.longname || q.symbol || "",
        type: (q.quoteType || "").toLowerCase(),
        exchange: q.exchDisp || q.exchange || "",
      }));

    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
    );
  } catch {
    return NextResponse.json({ results: [] });
  }
}
