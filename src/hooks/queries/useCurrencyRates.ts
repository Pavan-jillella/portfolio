import { useQuery } from "@tanstack/react-query";

interface CurrencyRates {
  rates: Record<string, number>;
  base: string;
  updated: string;
  fetchedAt?: string;
}

async function fetchCurrencyRates(): Promise<CurrencyRates> {
  const res = await fetch("/api/finance/currency");
  if (!res.ok) throw new Error("Failed to fetch currency rates");
  return res.json();
}

export function useCurrencyRates(refetchIntervalMs?: number) {
  return useQuery({
    queryKey: ["currency-rates"],
    queryFn: fetchCurrencyRates,
    staleTime: 60 * 1000,
    refetchInterval: refetchIntervalMs || false,
  });
}
