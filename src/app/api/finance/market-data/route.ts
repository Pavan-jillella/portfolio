import { NextResponse } from "next/server";

export const revalidate = 60;

interface AssetPrice {
  price: number;
  change24h: number;
  approximate?: boolean;
}

interface MarketDataResponse {
  gold: AssetPrice;
  silver: AssetPrice;
  bitcoin: AssetPrice;
  ethereum: AssetPrice;
  solana: AssetPrice;
  fetchedAt: string;
}

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true";

const METALS_API_URL =
  "https://api.metalpriceapi.com/v1/latest?api_key=demo&base=USD&currencies=XAU,XAG";

// Reasonable fallback prices when the metals API is unavailable
const FALLBACK_GOLD_PRICE = 2340;
const FALLBACK_SILVER_PRICE = 29.5;

async function fetchCryptoPrices(): Promise<{
  bitcoin: AssetPrice;
  ethereum: AssetPrice;
  solana: AssetPrice;
}> {
  const res = await fetch(COINGECKO_URL, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`CoinGecko API returned ${res.status}`);
  }

  const data = await res.json();

  return {
    bitcoin: {
      price: data.bitcoin?.usd ?? 0,
      change24h: data.bitcoin?.usd_24h_change ?? 0,
    },
    ethereum: {
      price: data.ethereum?.usd ?? 0,
      change24h: data.ethereum?.usd_24h_change ?? 0,
    },
    solana: {
      price: data.solana?.usd ?? 0,
      change24h: data.solana?.usd_24h_change ?? 0,
    },
  };
}

async function fetchMetalPrices(): Promise<{
  gold: AssetPrice;
  silver: AssetPrice;
}> {
  const res = await fetch(METALS_API_URL, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Metals API returned ${res.status}`);
  }

  const data = await res.json();

  if (!data.success || !data.rates?.XAU || !data.rates?.XAG) {
    throw new Error("Metals API returned invalid data");
  }

  // The API returns rates as 1/price (e.g., XAU rate = 1/gold_price_per_oz)
  const goldPrice = 1 / data.rates.XAU;
  const silverPrice = 1 / data.rates.XAG;

  return {
    gold: {
      price: Math.round(goldPrice * 100) / 100,
      change24h: 0,
    },
    silver: {
      price: Math.round(silverPrice * 100) / 100,
      change24h: 0,
    },
  };
}

export async function GET() {
  try {
    const [cryptoResult, metalsResult] = await Promise.allSettled([
      fetchCryptoPrices(),
      fetchMetalPrices(),
    ]);

    // Crypto prices
    const cryptoData =
      cryptoResult.status === "fulfilled"
        ? cryptoResult.value
        : {
            bitcoin: { price: 0, change24h: 0 },
            ethereum: { price: 0, change24h: 0 },
            solana: { price: 0, change24h: 0 },
          };

    // Metal prices — use fallback if the API fails
    const metalsData =
      metalsResult.status === "fulfilled"
        ? metalsResult.value
        : {
            gold: {
              price: FALLBACK_GOLD_PRICE,
              change24h: 0,
              approximate: true,
            },
            silver: {
              price: FALLBACK_SILVER_PRICE,
              change24h: 0,
              approximate: true,
            },
          };

    const response: MarketDataResponse = {
      gold: metalsData.gold,
      silver: metalsData.silver,
      bitcoin: cryptoData.bitcoin,
      ethereum: cryptoData.ethereum,
      solana: cryptoData.solana,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Market data API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
