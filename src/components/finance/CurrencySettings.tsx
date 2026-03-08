"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";
import { useCurrencyRates } from "@/hooks/queries/useCurrencyRates";
import { motion } from "framer-motion";

interface CurrencySettingsProps {
  displayCurrency: string;
  onCurrencyChange: (code: string) => void;
}

const FETCH_INTERVALS = [
  { label: "Manual", value: 0 },
  { label: "1 min", value: 1 },
  { label: "2 min", value: 2 },
  { label: "3 min", value: 3 },
  { label: "5 min", value: 5 },
];

export function CurrencySettings({ displayCurrency, onCurrencyChange }: CurrencySettingsProps) {
  const [fetchInterval, setFetchInterval] = useState(0);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState("");
  const [rateHistory, setRateHistory] = useState<Record<string, { time: number; rate: number }[]>>({});
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const prevRatesRef = useRef<Record<string, number>>({});

  const intervalMs = fetchInterval > 0 ? fetchInterval * 60 * 1000 : undefined;
  const { data, isLoading, refetch, dataUpdatedAt } = useCurrencyRates(intervalMs);
  const rates = data?.rates || {};

  // Track when data updates
  useEffect(() => {
    if (dataUpdatedAt > 0) {
      setLastFetchedAt(new Date(dataUpdatedAt));
      // Add to rate history
      if (Object.keys(rates).length > 0) {
        setRateHistory((prev) => {
          const next = { ...prev };
          SUPPORTED_CURRENCIES.filter((c) => c.code !== "USD").forEach((c) => {
            const rate = rates[c.code];
            if (rate) {
              const entries = next[c.code] || [];
              // Only add if rate changed or first entry
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
  const renderSparkline = useCallback((code: string, width: number, height: number) => {
    const history = rateHistory[code] || [];
    if (history.length < 2) return null;
    const values = history.map((h) => h.rate);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 0.0001;
    const points = values.map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    }).join(" ");
    const isUp = values[values.length - 1] >= values[0];
    return (
      <svg width={width} height={height} className="opacity-60">
        <polyline points={points} fill="none" stroke={isUp ? "#22c55e" : "#ef4444"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }, [rateHistory]);

  // Calculate change for rate
  const getChange = (code: string) => {
    const history = rateHistory[code] || [];
    if (history.length < 2) return null;
    const first = history[0].rate;
    const last = history[history.length - 1].rate;
    const pct = ((last - first) / first) * 100;
    return pct;
  };

  return (
    <div className="space-y-6">
      {/* Display Currency Selector */}
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-3">Display Currency</h4>
        <p className="font-body text-xs text-white/30 mb-4">
          Select your preferred currency for display.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SUPPORTED_CURRENCIES.map((c) => (
            <button
              key={c.code}
              onClick={() => onCurrencyChange(c.code)}
              className={`px-3 py-2.5 rounded-xl text-xs font-body transition-all ${
                displayCurrency === c.code
                  ? "glass-card text-blue-400 border-blue-500/30 shadow-lg shadow-blue-500/10"
                  : "text-white/30 hover:text-white border border-transparent hover:border-white/10"
              }`}
            >
              <span className="block font-mono text-sm font-bold">{c.symbol}</span>
              <span className="block mt-0.5">{c.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Exchange Rates Panel */}
      <div className="glass-card rounded-2xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h4 className="font-display font-semibold text-sm text-white">Live Exchange Rates</h4>
            <span className={`w-2 h-2 rounded-full ${Object.keys(rates).length > 0 ? "bg-green-500 animate-pulse" : "bg-white/20"}`} />
          </div>
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
                Last: <span className="text-white/50">{lastFetchedAt.toLocaleTimeString()}</span>
              </p>
            )}
            {fetchInterval > 0 && countdown && (
              <p className="font-mono text-[11px] text-white/30">
                Next: <span className="text-blue-400/70">{countdown}</span>
              </p>
            )}
          </div>
          {data?.updated && (
            <p className="font-mono text-[10px] text-white/20">API date: {data.updated}</p>
          )}
        </div>

        {/* Fetch Interval Selector */}
        <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1 mb-5">
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

        {/* Rate Cards */}
        {Object.keys(rates).length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            {SUPPORTED_CURRENCIES.filter((c) => c.code !== "USD").map((c) => {
              const change = getChange(c.code);
              const isSelected = selectedRate === c.code;
              return (
                <motion.button
                  key={c.code}
                  onClick={() => setSelectedRate(isSelected ? null : c.code)}
                  className={`glass-card rounded-xl p-3 text-left transition-all ${
                    isSelected ? "border-blue-500/30 shadow-lg shadow-blue-500/5" : ""
                  } ${displayCurrency === c.code ? "ring-1 ring-blue-500/30" : ""}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-white/70">{c.code}</span>
                    {change !== null && (
                      <span className={`font-mono text-[10px] ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-lg font-bold text-white mb-1">
                    {rates[c.code] ? rates[c.code].toFixed(4) : "—"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-[10px] text-white/25">{c.name}</span>
                  </div>
                  {/* Mini sparkline */}
                  <div className="mt-2 h-5">
                    {renderSparkline(c.code, 80, 20)}
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="font-body text-sm text-white/20">
              {isLoading ? "Loading exchange rates..." : "Unable to load exchange rates"}
            </p>
          </div>
        )}

        {/* Expanded rate chart */}
        {selectedRate && (rateHistory[selectedRate]?.length || 0) >= 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 glass-card rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-xs text-white/50">{selectedRate}/USD Session History</p>
              <p className="font-mono text-[10px] text-white/25">{rateHistory[selectedRate]?.length || 0} data points</p>
            </div>
            <svg viewBox="0 0 400 100" className="w-full h-auto">
              {(() => {
                const history = rateHistory[selectedRate] || [];
                const values = history.map((h) => h.rate);
                const min = Math.min(...values);
                const max = Math.max(...values);
                const range = max - min || 0.0001;
                const isUp = values[values.length - 1] >= values[0];
                const color = isUp ? "#22c55e" : "#ef4444";

                const points = values.map((v, i) => {
                  const x = 10 + (i / (values.length - 1)) * 380;
                  const y = 90 - ((v - min) / range) * 80;
                  return `${x},${y}`;
                });

                const areaPath = [
                  `M 10,90`,
                  ...values.map((v, i) => {
                    const x = 10 + (i / (values.length - 1)) * 380;
                    const y = 90 - ((v - min) / range) * 80;
                    return `L ${x},${y}`;
                  }),
                  `L ${10 + 380},90 Z`,
                ].join(" ");

                return (
                  <>
                    <defs>
                      <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    {[0, 0.5, 1].map((frac) => (
                      <line key={frac} x1="10" y1={90 - frac * 80} x2="390" y2={90 - frac * 80} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
                    ))}
                    {[0, 0.5, 1].map((frac) => (
                      <text key={`l-${frac}`} x="6" y={90 - frac * 80 + 3} textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="8" className="font-mono">
                        {(min + frac * range).toFixed(4)}
                      </text>
                    ))}
                    <path d={areaPath} fill="url(#rateGrad)" />
                    <polyline points={points.join(" ")} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    {values.map((v, i) => (
                      <circle key={i} cx={10 + (i / (values.length - 1)) * 380} cy={90 - ((v - min) / range) * 80} r={2.5} fill={color} />
                    ))}
                  </>
                );
              })()}
            </svg>
          </motion.div>
        )}
      </div>
    </div>
  );
}
