import { useQuery } from "@tanstack/react-query";

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

async function fetchStockQuotes(symbols: string[]): Promise<StockQuote[]> {
  if (symbols.length === 0) return [];
  const res = await fetch(`/api/finance/stocks?symbols=${symbols.join(",")}`);
  if (!res.ok) throw new Error("Failed to fetch stock quotes");
  const json = await res.json();
  return json.quotes || [];
}

export function useStockQuotes(symbols: string[]) {
  return useQuery({
    queryKey: ["stock-quotes", symbols.sort().join(",")],
    queryFn: () => fetchStockQuotes(symbols),
    staleTime: 15 * 60 * 1000,
    enabled: symbols.length > 0,
  });
}
