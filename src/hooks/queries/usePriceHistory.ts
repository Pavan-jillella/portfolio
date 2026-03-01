import { useQuery } from "@tanstack/react-query";
import { PriceHistoryRange, PriceHistoryPoint } from "@/types";
import { PRICE_HISTORY_CONFIG } from "@/lib/constants";

interface PriceHistoryResult {
  symbol: string;
  points: PriceHistoryPoint[];
}

async function fetchPriceHistory(symbol: string, range: PriceHistoryRange): Promise<PriceHistoryResult> {
  const config = PRICE_HISTORY_CONFIG[range];
  const res = await fetch(
    `/api/finance/stocks/history?symbol=${encodeURIComponent(symbol)}&range=${config.range}&interval=${config.interval}`
  );
  if (!res.ok) throw new Error("Failed to fetch price history");
  return res.json();
}

export function usePriceHistory(symbol: string | undefined, range: PriceHistoryRange) {
  return useQuery({
    queryKey: ["price-history", symbol, range],
    queryFn: () => fetchPriceHistory(symbol!, range),
    staleTime: 5 * 60 * 1000,
    enabled: !!symbol,
  });
}
