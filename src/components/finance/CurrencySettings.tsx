"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";
import { useCurrencyRates } from "@/hooks/queries/useCurrencyRates";
import { motion, AnimatePresence } from "framer-motion";

interface CurrencySettingsProps {
  displayCurrency: string;
  onCurrencyChange: (code: string) => void;
}

interface MarketData {
  gold: { price: number; change24h: number };
  silver: { price: number; change24h: number };
  bitcoin: { price: number; change24h: number };
  ethereum: { price: number; change24h: number };
  solana: { price: number; change24h: number };
  fetchedAt: string;
}

const FETCH_INTERVALS = [
  { label: "Manual", value: 0 },
  { label: "1 min", value: 1 },
  { label: "2 min", value: 2 },
  { label: "3 min", value: 3 },
  { label: "5 min", value: 5 },
];

const COUNTRY_FLAGS: Record<string, string> = {
  USD: "\u{1F1FA}\u{1F1F8}",
  EUR: "\u{1F1EA}\u{1F1FA}",
  GBP: "\u{1F1EC}\u{1F1E7}",
  JPY: "\u{1F1EF}\u{1F1F5}",
  CAD: "\u{1F1E8}\u{1F1E6}",
  AUD: "\u{1F1E6}\u{1F1FA}",
  INR: "\u{1F1EE}\u{1F1F3}",
  CNY: "\u{1F1E8}\u{1F1F3}",
  CHF: "\u{1F1E8}\u{1F1ED}",
  SGD: "\u{1F1F8}\u{1F1EC}",
};

function formatPrice(value: number, decimals = 2): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  return `$${value.toFixed(decimals)}`;
}

function ChangeIndicator({ change }: { change: number | null }) {
  if (change === null) return null;
  const isUp = change >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 font-mono text-[11px] font-semibold ${isUp ? "text-green-400" : "text-red-400"}`}>
      <svg width="10" height="10" viewBox="0 0 10 10" className={isUp ? "" : "rotate-180"}>
        <path d="M5 2L8 7H2L5 2Z" fill="currentColor" />
      </svg>
      {isUp ? "+" : ""}{change.toFixed(2)}%
    </span>
  );
}

export function CurrencySettings({ displayCurrency, onCurrencyChange }: CurrencySettingsProps) {
  const [fetchInterval, setFetchInterval] = useState(0);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState("");
  const [rateHistory, setRateHistory] = useState<Record<string, { time: number; rate: number }[]>>({});
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const [comparisonCurrency, setComparisonCurrency] = useState<string | null>(null);
  const [converterFrom, setConverterFrom] = useState("USD");
  const [converterTo, setConverterTo] = useState("INR");
  const [converterAmount, setConverterAmount] = useState<string>("100");
  const prevRatesRef = useRef<Record<string, number>>({});

  const intervalMs = fetchInterval > 0 ? fetchInterval * 60 * 1000 : undefined;
  const { data, isLoading, refetch, dataUpdatedAt } = useCurrencyRates(intervalMs);
  const rates = data?.rates || {};

  const { data: marketData } = useQuery<MarketData>({
    queryKey: ["market-data"],
    queryFn: async () => {
      const res = await fetch("/api/finance/market-data");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    staleTime: 60 * 1000,
    refetchInterval: intervalMs || false,
  });

  // Track when data updates
  useEffect(() => {
    if (dataUpdatedAt > 0) {
      setLastFetchedAt(new Date(dataUpdatedAt));
      if (Object.keys(rates).length > 0) {
        setRateHistory((prev) => {
          const next = { ...prev };
          SUPPORTED_CURRENCIES.filter((c) => c.code !== "USD").forEach((c) => {
            const rate = rates[c.code];
            if (rate) {
              const entries = next[c.code] || [];
              if (entries.length === 0 || entries[entries.length - 1].rate !== rate) {
                next[c.code] = [...entries.slice(-29), { time: Date.now(), rate }];
              }
            }
          });
          return next;
        });
        prevRatesRef.current = { ...rates };
      }
    }
  }, [dataUpdatedAt, rates]);

  // Countdown timer
  useEffect(() => {
    if (fetchInterval === 0 || !lastFetchedAt) {
      setCountdown("");
      return;
    }
    const timer = setInterval(() => {
      const nextFetch = new Date(lastFetchedAt.getTime() + fetchInterval * 60 * 1000);
      const diff = nextFetch.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown("Refreshing...");
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setCountdown(`${m}:${s.toString().padStart(2, "0")}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchInterval, lastFetchedAt]);

  // Mini sparkline SVG for a currency
  const renderSparkline = useCallback(
    (code: string, width: number, height: number) => {
      const history = rateHistory[code] || [];
      if (history.length < 2) return null;
      const values = history.map((h) => h.rate);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const range = max - min || 0.0001;
      const points = values
        .map((v, i) => {
          const x = (i / (values.length - 1)) * width;
          const y = height - ((v - min) / range) * (height - 4) - 2;
          return `${x},${y}`;
        })
        .join(" ");
      const isUp = values[values.length - 1] >= values[0];
      return (
        <svg width={width} height={height} className="opacity-60">
          <polyline
            points={points}
            fill="none"
            stroke={isUp ? "#22c55e" : "#ef4444"}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    },
    [rateHistory]
  );

  // Calculate change for rate
  const getChange = (code: string) => {
    const history = rateHistory[code] || [];
    if (history.length < 2) return null;
    const first = history[0].rate;
    const last = history[history.length - 1].rate;
    const pct = ((last - first) / first) * 100;
    return pct;
  };

  const selectedCurrencyInfo = comparisonCurrency
    ? SUPPORTED_CURRENCIES.find((c) => c.code === comparisonCurrency)
    : null;

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        {/* Gradient Heading */}
        <div className="mb-1">
          <h4 className="font-display font-bold text-xl bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            Live Exchange Rates
          </h4>
          <p className="font-body text-xs text-white/50 mt-1">
            Real-time financial market data
          </p>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 mt-3 mb-4">
          <span
            className={`w-2 h-2 rounded-full ${
              Object.keys(rates).length > 0
                ? "bg-green-500 animate-pulse"
                : "bg-white/20"
            }`}
          />
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">
            {Object.keys(rates).length > 0 ? "Connected" : "Offline"}
          </span>
          <div className="flex-1" />
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="glass-card px-3 py-1.5 rounded-lg text-xs font-mono text-white/40 hover:text-white transition-all hover:border-blue-500/30"
          >
            {isLoading ? "..." : "Refresh"}
          </button>
        </div>

        {/* Timestamps */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-4">
            {lastFetchedAt && (
              <p className="font-mono text-[11px] text-white/30">
                Last:{" "}
                <span className="text-white/50">
                  {lastFetchedAt.toLocaleTimeString()}
                </span>
              </p>
            )}
            {fetchInterval > 0 && countdown && (
              <p className="font-mono text-[11px] text-white/30">
                Next: <span className="text-blue-400/70">{countdown}</span>
              </p>
            )}
          </div>
          {data?.updated && (
            <p className="font-mono text-[10px] text-white/20">
              API date: {data.updated}
            </p>
          )}
        </div>

        {/* Fetch Interval Selector */}
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1 mb-6">
          {FETCH_INTERVALS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFetchInterval(opt.value)}
              className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-mono transition-all ${
                fetchInterval === opt.value
                  ? "bg-blue-500/20 text-blue-400 shadow-sm"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Live Currency Converter */}
        {Object.keys(rates).length > 0 && (
          <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 border border-white/[0.06] p-5">
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">
              Currency Converter
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* From side */}
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="number"
                  value={converterAmount}
                  onChange={(e) => setConverterAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 font-mono text-lg focus:border-blue-500/50 transition-all outline-none"
                  placeholder="Amount"
                  min="0"
                  step="any"
                />
                <select
                  value={converterFrom}
                  onChange={(e) => setConverterFrom(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-3 font-mono text-sm focus:border-blue-500/50 transition-all outline-none appearance-none cursor-pointer min-w-[80px]"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-gray-900 text-white">{COUNTRY_FLAGS[c.code]} {c.code}</option>
                  ))}
                </select>
              </div>

              {/* Swap button */}
              <button
                onClick={() => {
                  const tmp = converterFrom;
                  setConverterFrom(converterTo);
                  setConverterTo(tmp);
                }}
                className="self-center glass-card p-2 rounded-xl hover:border-blue-500/30 transition-all group"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/40 group-hover:text-blue-400 transition-colors">
                  <path d="M6 4L2 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 16L18 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="3" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="3" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {/* To side */}
              <div className="flex-1 flex items-center gap-2">
                <div className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
                  <p className="font-mono text-lg text-white font-bold">
                    {(() => {
                      const amt = parseFloat(converterAmount) || 0;
                      if (amt === 0) return "0.00";
                      const fromRate = converterFrom === "USD" ? 1 : (rates[converterFrom] || 1);
                      const toRate = converterTo === "USD" ? 1 : (rates[converterTo] || 1);
                      const result = (amt / fromRate) * toRate;
                      return result < 1 ? result.toFixed(6) : result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    })()}
                  </p>
                </div>
                <select
                  value={converterTo}
                  onChange={(e) => setConverterTo(e.target.value)}
                  className="bg-white/5 border border-white/10 text-white rounded-xl px-3 py-3 font-mono text-sm focus:border-blue-500/50 transition-all outline-none appearance-none cursor-pointer min-w-[80px]"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code} className="bg-gray-900 text-white">{COUNTRY_FLAGS[c.code]} {c.code}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Quick conversion note */}
            <p className="font-mono text-[10px] text-white/20 mt-3 text-center">
              {converterFrom !== converterTo && rates[converterFrom !== "USD" ? converterFrom : converterTo] ? (
                <>1 {converterFrom} = {(() => {
                  const fromRate = converterFrom === "USD" ? 1 : (rates[converterFrom] || 1);
                  const toRate = converterTo === "USD" ? 1 : (rates[converterTo] || 1);
                  return ((1 / fromRate) * toRate).toFixed(4);
                })()} {converterTo}</>
              ) : "Select different currencies to convert"}
            </p>
          </div>
        )}

        {/* USA vs Selected Country Comparison Panel */}
        <AnimatePresence mode="wait">
          {comparisonCurrency && rates[comparisonCurrency] && selectedCurrencyInfo && (
            <motion.div
              key={comparisonCurrency}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mb-6 rounded-xl bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-emerald-500/10 border border-white/[0.06] p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                  Currency Comparison
                </p>
                <button
                  onClick={() => setComparisonCurrency(null)}
                  className="text-white/20 hover:text-white/60 transition-colors text-xs"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* USD to Selected */}
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{COUNTRY_FLAGS["USD"]}</span>
                  <div>
                    <p className="font-mono text-[10px] text-white/30 mb-0.5">
                      USD to {comparisonCurrency}
                    </p>
                    <p className="font-mono text-2xl font-bold text-white">
                      1{" "}
                      <span className="text-white/40 text-base">USD</span>{" "}
                      ={" "}
                      <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        {rates[comparisonCurrency].toFixed(4)}
                      </span>{" "}
                      <span className="text-white/40 text-base">
                        {comparisonCurrency}
                      </span>
                    </p>
                  </div>
                </div>
                {/* Selected to USD */}
                <div className="flex items-center gap-4">
                  <span className="text-2xl">
                    {COUNTRY_FLAGS[comparisonCurrency] || ""}
                  </span>
                  <div>
                    <p className="font-mono text-[10px] text-white/30 mb-0.5">
                      {comparisonCurrency} to USD
                    </p>
                    <p className="font-mono text-2xl font-bold text-white">
                      1{" "}
                      <span className="text-white/40 text-base">
                        {comparisonCurrency}
                      </span>{" "}
                      ={" "}
                      <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                        {(1 / rates[comparisonCurrency]).toFixed(6)}
                      </span>{" "}
                      <span className="text-white/40 text-base">USD</span>
                    </p>
                  </div>
                </div>
              </div>
              {/* Sparkline in comparison */}
              {(rateHistory[comparisonCurrency]?.length || 0) >= 2 && (
                <div className="mt-3 pt-3 border-t border-white/[0.04]">
                  <p className="font-mono text-[10px] text-white/20 mb-1">
                    Session trend
                  </p>
                  {renderSparkline(comparisonCurrency, 200, 24)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section: Exchange Rates (vs USD) */}
        <div className="mb-6">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
            Exchange Rates vs USD
          </p>
          {Object.keys(rates).length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {SUPPORTED_CURRENCIES.filter((c) => c.code !== "USD").map(
                (c) => {
                  const change = getChange(c.code);
                  const isSelected = selectedRate === c.code;
                  const isComparison = comparisonCurrency === c.code;
                  return (
                    <motion.button
                      key={c.code}
                      onClick={() => {
                        setSelectedRate(isSelected ? null : c.code);
                        setComparisonCurrency(
                          isComparison ? null : c.code
                        );
                      }}
                      className={`relative rounded-xl p-3 text-left transition-all bg-blue-500/5 border border-white/[0.04] hover:border-white/[0.08] ${
                        isComparison
                          ? "border-blue-500/30 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/20"
                          : ""
                      } ${
                        displayCurrency === c.code
                          ? "ring-1 ring-blue-500/30"
                          : ""
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">
                            {COUNTRY_FLAGS[c.code] || ""}
                          </span>
                          <span className="font-mono text-xs font-bold text-white/70">
                            {c.code}
                          </span>
                        </div>
                        <ChangeIndicator change={change} />
                      </div>
                      <p className="font-mono text-lg font-bold text-white mb-1">
                        {rates[c.code]
                          ? rates[c.code].toFixed(4)
                          : "\u2014"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-body text-[10px] text-white/25">
                          {c.name}
                        </span>
                      </div>
                      {/* Mini sparkline */}
                      <div className="mt-2 h-5">
                        {renderSparkline(c.code, 80, 20)}
                      </div>
                    </motion.button>
                  );
                }
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="font-body text-sm text-white/20">
                {isLoading
                  ? "Loading exchange rates..."
                  : "Unable to load exchange rates"}
              </p>
            </div>
          )}
        </div>

        {/* Section: Precious Metals */}
        <div className="mb-6">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
            Precious Metals
          </p>
          <div className="grid grid-cols-2 gap-3">
            {/* Gold */}
            <div className="rounded-xl p-4 bg-amber-500/10 border border-amber-500/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">Au</span>
                  <span className="font-mono text-xs font-bold text-amber-300/80">
                    XAU
                  </span>
                </div>
                {marketData?.gold && (
                  <ChangeIndicator change={marketData.gold.change24h} />
                )}
              </div>
              <p className="font-mono text-xl font-bold text-white">
                {marketData?.gold
                  ? formatPrice(marketData.gold.price)
                  : "\u2014"}
              </p>
              <p className="font-body text-[10px] text-white/25 mt-1">
                Gold / oz
              </p>
            </div>

            {/* Silver */}
            <div className="rounded-xl p-4 bg-gray-400/10 border border-gray-400/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">Ag</span>
                  <span className="font-mono text-xs font-bold text-gray-300/80">
                    XAG
                  </span>
                </div>
                {marketData?.silver && (
                  <ChangeIndicator change={marketData.silver.change24h} />
                )}
              </div>
              <p className="font-mono text-xl font-bold text-white">
                {marketData?.silver
                  ? formatPrice(marketData.silver.price)
                  : "\u2014"}
              </p>
              <p className="font-body text-[10px] text-white/25 mt-1">
                Silver / oz
              </p>
            </div>
          </div>
        </div>

        {/* Section: Cryptocurrency */}
        <div className="mb-6">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
            Cryptocurrency
          </p>
          <div className="grid grid-cols-3 gap-3">
            {/* Bitcoin */}
            <div className="rounded-xl p-4 bg-orange-500/10 border border-orange-500/10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-orange-300/80">
                  BTC
                </span>
                {marketData?.bitcoin && (
                  <ChangeIndicator change={marketData.bitcoin.change24h} />
                )}
              </div>
              <p className="font-mono text-lg font-bold text-white">
                {marketData?.bitcoin
                  ? formatPrice(marketData.bitcoin.price)
                  : "\u2014"}
              </p>
              <p className="font-body text-[10px] text-white/25 mt-1">
                Bitcoin
              </p>
            </div>

            {/* Ethereum */}
            <div className="rounded-xl p-4 bg-purple-500/10 border border-purple-500/10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-purple-300/80">
                  ETH
                </span>
                {marketData?.ethereum && (
                  <ChangeIndicator change={marketData.ethereum.change24h} />
                )}
              </div>
              <p className="font-mono text-lg font-bold text-white">
                {marketData?.ethereum
                  ? formatPrice(marketData.ethereum.price)
                  : "\u2014"}
              </p>
              <p className="font-body text-[10px] text-white/25 mt-1">
                Ethereum
              </p>
            </div>

            {/* Solana */}
            <div className="rounded-xl p-4 bg-emerald-500/10 border border-emerald-500/10">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-emerald-300/80">
                  SOL
                </span>
                {marketData?.solana && (
                  <ChangeIndicator change={marketData.solana.change24h} />
                )}
              </div>
              <p className="font-mono text-lg font-bold text-white">
                {marketData?.solana
                  ? formatPrice(marketData.solana.price)
                  : "\u2014"}
              </p>
              <p className="font-body text-[10px] text-white/25 mt-1">
                Solana
              </p>
            </div>
          </div>
        </div>

        {/* Expanded rate chart */}
        <AnimatePresence>
          {selectedRate &&
            (rateHistory[selectedRate]?.length || 0) >= 2 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-xs text-white/50">
                    {selectedRate}/USD Session History
                  </p>
                  <p className="font-mono text-[10px] text-white/25">
                    {rateHistory[selectedRate]?.length || 0} data points
                  </p>
                </div>
                <svg viewBox="0 0 400 100" className="w-full h-auto">
                  {(() => {
                    const history = rateHistory[selectedRate] || [];
                    const values = history.map((h) => h.rate);
                    const min = Math.min(...values);
                    const max = Math.max(...values);
                    const range = max - min || 0.0001;
                    const isUp =
                      values[values.length - 1] >= values[0];
                    const color = isUp ? "#22c55e" : "#ef4444";

                    const points = values.map((v, i) => {
                      const x =
                        10 + (i / (values.length - 1)) * 380;
                      const y =
                        90 - ((v - min) / range) * 80;
                      return `${x},${y}`;
                    });

                    const areaPath = [
                      `M 10,90`,
                      ...values.map((v, i) => {
                        const x =
                          10 + (i / (values.length - 1)) * 380;
                        const y =
                          90 - ((v - min) / range) * 80;
                        return `L ${x},${y}`;
                      }),
                      `L ${10 + 380},90 Z`,
                    ].join(" ");

                    return (
                      <>
                        <defs>
                          <linearGradient
                            id="rateGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={color}
                              stopOpacity={0.2}
                            />
                            <stop
                              offset="100%"
                              stopColor={color}
                              stopOpacity={0.02}
                            />
                          </linearGradient>
                        </defs>
                        {[0, 0.5, 1].map((frac) => (
                          <line
                            key={frac}
                            x1="10"
                            y1={90 - frac * 80}
                            x2="390"
                            y2={90 - frac * 80}
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth={0.5}
                          />
                        ))}
                        {[0, 0.5, 1].map((frac) => (
                          <text
                            key={`l-${frac}`}
                            x="6"
                            y={90 - frac * 80 + 3}
                            textAnchor="end"
                            fill="rgba(255,255,255,0.2)"
                            fontSize="8"
                            className="font-mono"
                          >
                            {(min + frac * range).toFixed(4)}
                          </text>
                        ))}
                        <path
                          d={areaPath}
                          fill="url(#rateGrad)"
                        />
                        <polyline
                          points={points.join(" ")}
                          fill="none"
                          stroke={color}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {values.map((v, i) => (
                          <circle
                            key={i}
                            cx={
                              10 +
                              (i / (values.length - 1)) * 380
                            }
                            cy={
                              90 -
                              ((v - min) / range) * 80
                            }
                            r={2.5}
                            fill={color}
                          />
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
