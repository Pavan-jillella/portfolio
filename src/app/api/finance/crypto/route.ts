import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// CoinGecko ID mapping for common crypto symbols
const SYMBOL_TO_COINGECKO: Record<string, string> = {
  "BTC-USD": "bitcoin",
  "ETH-USD": "ethereum",
  "BNB-USD": "binancecoin",
  "SOL-USD": "solana",
  "XRP-USD": "ripple",
  "ADA-USD": "cardano",
  "DOGE-USD": "dogecoin",
  "DOT-USD": "polkadot",
  "MATIC-USD": "matic-network",
  "AVAX-USD": "avalanche-2",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbols = searchParams.get("symbols");

  if (!symbols) {
    return NextResponse.json({ error: "symbols parameter required" }, { status: 400 });
  }

  const symbolList = symbols.split(",").map((s) => s.trim().toUpperCase());
  const coingeckoIds = symbolList
    .map((s) => SYMBOL_TO_COINGECKO[s])
    .filter(Boolean);

  if (coingeckoIds.length === 0) {
    return NextResponse.json({ quotes: [] });
  }

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoIds.join(",")}&vs_currencies=usd,inr&include_24hr_change=true`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "CoinGecko API error" }, { status: 502 });
    }

    const data = await res.json();

    const quotes = symbolList
      .map((sym) => {
        const cgId = SYMBOL_TO_COINGECKO[sym];
        if (!cgId || !data[cgId]) return null;
        const info = data[cgId];
        return {
          symbol: sym,
          price: info.usd || 0,
          priceINR: info.inr || 0,
          change: 0,
          changePercent: info.usd_24h_change || 0,
          exchange: "CoinGecko",
          name: cgId.charAt(0).toUpperCase() + cgId.slice(1).replace(/-/g, " "),
          currency: "USD",
        };
      })
      .filter(Boolean);

    return NextResponse.json(
      { quotes },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } }
    );
  } catch {
    return NextResponse.json({ error: "Failed to fetch crypto data" }, { status: 500 });
  }
}
