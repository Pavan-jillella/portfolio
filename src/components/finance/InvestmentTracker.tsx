"use client";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Investment, InvestmentType } from "@/types";
import {
  INVESTMENT_TYPES,
  LIVE_PRICE_TYPES,
  INVESTMENT_TYPE_COLORS,
  TICKER_SUGGESTIONS,
  DEFAULT_REFRESH_INTERVAL_MINUTES,
} from "@/lib/constants";
import { generateId, formatCurrencyWithCode, convertCurrency } from "@/lib/finance-utils";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { useCurrencyRates } from "@/hooks/queries/useCurrencyRates";
import { PriceSparkline } from "./Sparkline";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

interface InvestmentTrackerProps {
  investments: Investment[];
  onAdd: (investment: Investment) => void;
  onUpdate: (id: string, updates: Partial<Investment>) => void;
  onDelete: (id: string) => void;
}

const TICKER_PLACEHOLDERS: Partial<Record<InvestmentType, string>> = {
  stock: "AAPL, RELIANCE.NS, TCS.BO",
  crypto: "BTC-USD, ETH-USD",
  commodity: "GC=F, CL=F",
  index: "^GSPC, SPY, ^NSEI",
  forex: "EURUSD=X, USDINR=X",
};

function detectCurrency(symbol: string): string {
  const upper = symbol.toUpperCase();
  if (upper.endsWith(".NS") || upper.endsWith(".BO")) return "INR";
  if (upper.endsWith(".L")) return "GBP";
  if (upper.endsWith(".TO") || upper.endsWith(".V")) return "CAD";
  if (upper.endsWith(".AX")) return "AUD";
  if (upper.endsWith(".SS") || upper.endsWith(".SZ")) return "CNY";
  return "USD";
}

export function InvestmentTracker({ investments, onAdd, onUpdate, onDelete }: InvestmentTrackerProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<InvestmentType>("stock");
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterType, setFilterType] = useState("all");
  const [currency, setCurrency] = useState("USD");

  // Exchange rates for currency conversion
  const { data: ratesData } = useCurrencyRates();
  const rates = ratesData?.rates || {};

  // Ticker search state
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [priceFetching, setPriceFetching] = useState(false);
  const [priceError, setPriceError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tickerInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced ticker search
  const searchTicker = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 1) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/finance/stocks/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
          setShowDropdown(true);
          setHighlightIndex(-1);
        }
      } catch {
        // Silently fail
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  }, []);

  // Fetch live price for a ticker (always per-unit)
  const fetchLivePrice = useCallback(async (symbol: string) => {
    setPriceFetching(true);
    setPriceError("");
    try {
      const res = await fetch(`/api/finance/stocks?symbols=${encodeURIComponent(symbol)}&_t=${Date.now()}`);
      if (!res.ok) {
        setPriceError("Failed to fetch price");
        return;
      }
      const data = await res.json();
      const quote = (data.quotes || [])[0];
      if (quote && quote.price > 0) {
        setPurchasePrice(String(quote.price));
        setCurrentValue(String(quote.price));
      } else {
        setPriceError("Price unavailable — enter manually");
      }
    } catch {
      setPriceError("Network error — enter price manually");
    } finally {
      setPriceFetching(false);
    }
  }, []);

  // Select a ticker from search results
  const selectTicker = useCallback((result: SearchResult) => {
    setTicker(result.symbol);
    if (!name) setName(result.name);
    setCurrency(detectCurrency(result.symbol));
    setShowDropdown(false);
    setSearchResults([]);
    fetchLivePrice(result.symbol);
  }, [name, fetchLivePrice]);

  // Select a ticker from suggestion chips
  const selectSuggestion = useCallback((symbol: string, suggestionName: string) => {
    setTicker(symbol);
    if (!name) setName(suggestionName);
    setCurrency(detectCurrency(symbol));
    fetchLivePrice(symbol);
  }, [name, fetchLivePrice]);

  // Handle keyboard navigation in dropdown
  const handleTickerKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || searchResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      selectTicker(searchResults[highlightIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  const investmentTypes = Array.from(new Set(investments.map((i) => i.type))).sort();

  const filteredInvestments = filterType === "all"
    ? investments
    : investments.filter((i) => i.type === filterType);

  // Convert all values to USD for unified portfolio totals
  const totalValueUSD = useMemo(() =>
    investments.reduce((s, i) => s + convertCurrency(i.current_value, i.currency, "USD", rates), 0),
    [investments, rates]
  );
  const totalCostUSD = useMemo(() =>
    investments.reduce((s, i) => s + convertCurrency(i.purchase_price, i.currency, "USD", rates), 0),
    [investments, rates]
  );
  const totalGainUSD = totalValueUSD - totalCostUSD;
  const totalGainPct = totalCostUSD > 0 ? (totalGainUSD / totalCostUSD) * 100 : 0;

  // Also show INR equivalent if there are any non-USD holdings
  const hasMultiCurrency = investments.some((i) => i.currency !== "USD");
  const totalValueINR = useMemo(() =>
    hasMultiCurrency ? convertCurrency(totalValueUSD, "USD", "INR", rates) : 0,
    [totalValueUSD, hasMultiCurrency, rates]
  );

  // Helper: format converted amount in alternate currency
  const fmtAlt = useCallback((amount: number, curr: string) => {
    if (!rates || Object.keys(rates).length === 0) return "";
    const altCurr = curr === "USD" ? "INR" : "USD";
    const converted = convertCurrency(amount, curr, altCurr, rates);
    return formatCurrencyWithCode(Math.round(converted * 100) / 100, altCurr);
  }, [rates]);

  const refreshPrices = useCallback(async () => {
    const tickerInvestments = investments.filter((i) => i.ticker && LIVE_PRICE_TYPES.includes(i.type));
    if (tickerInvestments.length === 0) return;

    setLoading(true);
    try {
      const symbols = tickerInvestments.map((i) => i.ticker).join(",");
      const res = await fetch(`/api/finance/stocks?symbols=${encodeURIComponent(symbols)}&_t=${Date.now()}`);
      if (!res.ok) return;

      const data = await res.json();
      const quotes: { symbol: string; price: number }[] = data.quotes || [];

      quotes.forEach((q) => {
        const inv = tickerInvestments.find(
          (i) => i.ticker?.toUpperCase() === q.symbol.toUpperCase()
        );
        if (inv && q.price > 0) {
          const newValue = (inv.quantity || 1) * q.price;
          onUpdate(inv.id, {
            current_value: Math.round(newValue * 100) / 100,
            last_updated: new Date().toISOString(),
          });
        }
      });
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [investments, onUpdate]);

  const hasLivePrices = investments.some((i) => i.ticker && LIVE_PRICE_TYPES.includes(i.type));

  const {
    secondsRemaining,
    isRefreshing,
    refresh,
    intervalMinutes,
    setIntervalMinutes,
  } = useAutoRefresh(refreshPrices, DEFAULT_REFRESH_INTERVAL_MINUTES, hasLivePrices);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !purchasePrice) return;

    const qty = quantity ? parseFloat(quantity) : 1;
    const unitPrice = parseFloat(purchasePrice);
    const unitCurrent = currentValue ? parseFloat(currentValue) : unitPrice;
    onAdd({
      id: generateId(),
      name: name.trim(),
      type,
      ticker: ticker.trim() || undefined,
      quantity: quantity ? parseFloat(quantity) : undefined,
      purchase_price: Math.round(qty * unitPrice * 100) / 100,
      current_value: Math.round(qty * unitCurrent * 100) / 100,
      currency,
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
    setName("");
    setTicker("");
    setQuantity("");
    setPurchasePrice("");
    setCurrentValue("");
    setCurrency("USD");
    setPriceError("");
    setSearchResults([]);
    setShowDropdown(false);
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Portfolio Value</p>
          <p className="font-mono text-xl font-semibold text-white">{formatCurrencyWithCode(totalValueUSD, "USD")}</p>
          {hasMultiCurrency && <p className="font-mono text-xs text-white/30 mt-0.5">{formatCurrencyWithCode(totalValueINR, "INR")}</p>}
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Total Cost</p>
          <p className="font-mono text-xl font-semibold text-white/60">{formatCurrencyWithCode(totalCostUSD, "USD")}</p>
          {hasMultiCurrency && <p className="font-mono text-xs text-white/20 mt-0.5">{formatCurrencyWithCode(convertCurrency(totalCostUSD, "USD", "INR", rates), "INR")}</p>}
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Total Gain/Loss</p>
          <p className={`font-mono text-xl font-semibold ${totalGainUSD >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {totalGainUSD >= 0 ? "+" : ""}{formatCurrencyWithCode(totalGainUSD, "USD")}
          </p>
          {hasMultiCurrency && (
            <p className={`font-mono text-xs mt-0.5 ${totalGainUSD >= 0 ? "text-emerald-400/50" : "text-red-400/50"}`}>
              {totalGainUSD >= 0 ? "+" : ""}{formatCurrencyWithCode(convertCurrency(totalGainUSD, "USD", "INR", rates), "INR")}
            </p>
          )}
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Return</p>
          <p className={`font-mono text-xl font-semibold ${totalGainPct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {totalGainPct >= 0 ? "+" : ""}{totalGainPct.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Auto-refresh controls */}
      <div className="flex items-center justify-end gap-3">
        <select
          value={intervalMinutes}
          onChange={(e) => setIntervalMinutes(Number(e.target.value))}
          className="bg-white/4 border border-white/8 rounded-lg px-2 py-1.5 font-mono text-[10px] text-white/40 focus:outline-none appearance-none"
        >
          {[1, 2, 5, 10, 15].map((m) => (
            <option key={m} value={m} className="bg-[#0a0c12]">{m} min</option>
          ))}
        </select>
        <button
          onClick={refresh}
          disabled={loading || isRefreshing}
          className="glass-card px-4 py-2 rounded-xl text-xs font-body text-white/40 hover:text-white transition-all disabled:opacity-30 flex items-center gap-2"
        >
          {loading || isRefreshing ? (
            "Refreshing..."
          ) : (
            <>
              <span>Refresh</span>
              <span className="font-mono text-[10px] text-white/20">
                {Math.floor(secondsRemaining / 60)}:{String(secondsRemaining % 60).padStart(2, "0")}
              </span>
            </>
          )}
        </button>
      </div>

      {/* Investment List */}
      {investments.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="font-body text-sm text-white/30">No investments tracked yet</p>
          <p className="font-body text-xs text-white/15 mt-1">Add your first investment below</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header with view toggle */}
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg text-white">
              Holdings
              <span className="ml-2 font-mono text-xs text-white/30">({filteredInvestments.length})</span>
            </h3>
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
          </div>

          {/* Type filters */}
          {investmentTypes.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all ${
                  filterType === "all"
                    ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                    : "border-white/8 bg-white/4 text-white/40 hover:border-white/15"
                }`}
              >
                All
              </button>
              {investmentTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all capitalize ${
                    filterType === t
                      ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                      : "border-white/8 bg-white/4 text-white/40 hover:border-white/15"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <AnimatePresence>
              {filteredInvestments.map((inv, i) => {
                const gain = inv.current_value - inv.purchase_price;
                const gainPct = inv.purchase_price > 0 ? (gain / inv.purchase_price) * 100 : 0;
                const c = inv.currency || "USD";
                return (
                  <motion.div
                    key={inv.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.03 }}
                    className="glass-card rounded-2xl p-4 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${INVESTMENT_TYPE_COLORS[inv.type] || "bg-gray-500"}`} />
                        <div>
                          <span className="font-body text-sm text-white">{inv.name}</span>
                          {inv.ticker && (
                            <span className="ml-2 font-mono text-xs text-white/30">{inv.ticker}</span>
                          )}
                          {c !== "USD" && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-500/10 font-mono text-[9px] text-amber-400/70">{c}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {inv.ticker && LIVE_PRICE_TYPES.includes(inv.type) && (
                          <PriceSparkline symbol={inv.ticker} />
                        )}
                        <div className="text-right">
                          <p className="font-mono text-sm text-white">{formatCurrencyWithCode(inv.current_value, c)}</p>
                          {c !== "USD" && <p className="font-mono text-[10px] text-white/25">{fmtAlt(inv.current_value, c)}</p>}
                          <p className={`font-mono text-xs ${gain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {gain >= 0 ? "+" : ""}{formatCurrencyWithCode(gain, c)} ({gainPct.toFixed(1)}%)
                          </p>
                          {c !== "USD" && (
                            <p className={`font-mono text-[10px] ${gain >= 0 ? "text-emerald-400/40" : "text-red-400/40"}`}>
                              {gain >= 0 ? "+" : ""}{fmtAlt(gain, c)}
                            </p>
                          )}
                        </div>
                        <span className="font-body text-xs text-white/20 capitalize">{inv.type}</span>
                        {inv.quantity && (
                          <span className="font-mono text-xs text-white/20">{inv.quantity} units</span>
                        )}
                        <button
                          onClick={() => onDelete(inv.id)}
                          className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInvestments.map((inv, i) => {
                const gain = inv.current_value - inv.purchase_price;
                const gainPct = inv.purchase_price > 0 ? (gain / inv.purchase_price) * 100 : 0;
                const c = inv.currency || "USD";
                return (
                  <motion.div
                    key={inv.id}
                    className="glass-card rounded-2xl p-5 flex flex-col justify-between group"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${INVESTMENT_TYPE_COLORS[inv.type] || "bg-gray-500"}`} />
                          <span className="font-body text-sm text-white font-medium">{inv.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {c !== "USD" && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 font-mono text-[9px] text-amber-400/70">{c}</span>
                          )}
                          <span className="font-body text-[10px] text-white/20 uppercase capitalize">{inv.type}</span>
                        </div>
                      </div>
                      {inv.ticker && (
                        <p className="font-mono text-xs text-white/30 mb-2">{inv.ticker}{inv.quantity ? ` · ${inv.quantity} units` : ""}</p>
                      )}
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div>
                          <p className="font-mono text-[10px] text-white/25 uppercase">Value</p>
                          <p className="font-mono text-lg text-white">{formatCurrencyWithCode(inv.current_value, c)}</p>
                          {c !== "USD" && <p className="font-mono text-[10px] text-white/20">{fmtAlt(inv.current_value, c)}</p>}
                        </div>
                        <div>
                          <p className="font-mono text-[10px] text-white/25 uppercase">Cost</p>
                          <p className="font-mono text-lg text-white/50">{formatCurrencyWithCode(inv.purchase_price, c)}</p>
                          {c !== "USD" && <p className="font-mono text-[10px] text-white/15">{fmtAlt(inv.purchase_price, c)}</p>}
                        </div>
                      </div>
                      <p className={`font-mono text-xs ${gain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {gain >= 0 ? "+" : ""}{formatCurrencyWithCode(gain, c)} ({gainPct.toFixed(1)}%)
                      </p>
                      {c !== "USD" && (
                        <p className={`font-mono text-[10px] ${gain >= 0 ? "text-emerald-400/40" : "text-red-400/40"}`}>
                          {gain >= 0 ? "+" : ""}{fmtAlt(gain, c)}
                        </p>
                      )}
                      {inv.ticker && LIVE_PRICE_TYPES.includes(inv.type) && (
                        <div className="mt-2">
                          <PriceSparkline symbol={inv.ticker} />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center pt-3 border-t border-white/5 mt-3">
                      <button
                        onClick={() => onDelete(inv.id)}
                        className="px-2 py-1 rounded-lg text-[10px] font-body text-white/30 hover:text-red-400 hover:bg-white/5 transition-all ml-auto opacity-0 group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Table View */}
          {viewMode === "table" && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Ticker</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Qty</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Cost</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Value</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Gain/Loss</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider hidden lg:table-cell">Chart</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvestments.map((inv) => {
                      const gain = inv.current_value - inv.purchase_price;
                      const gainPct = inv.purchase_price > 0 ? (gain / inv.purchase_price) * 100 : 0;
                      const c = inv.currency || "USD";
                      return (
                        <tr key={inv.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-body text-xs text-white/70">{inv.name}</span>
                              {c !== "USD" && (
                                <span className="px-1 py-0.5 rounded bg-amber-500/10 font-mono text-[8px] text-amber-400/70">{c}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="font-body text-xs text-white/40 capitalize">{inv.type}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="font-mono text-xs text-white/30">{inv.ticker || "—"}</span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <span className="font-mono text-xs text-white/40">{inv.quantity || "—"}</span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <span className="font-mono text-xs text-white/50">{formatCurrencyWithCode(inv.purchase_price, c)}</span>
                            {c !== "USD" && <p className="font-mono text-[9px] text-white/20">{fmtAlt(inv.purchase_price, c)}</p>}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <span className="font-mono text-xs text-white">{formatCurrencyWithCode(inv.current_value, c)}</span>
                            {c !== "USD" && <p className="font-mono text-[9px] text-white/20">{fmtAlt(inv.current_value, c)}</p>}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <span className={`font-mono text-xs ${gain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {gain >= 0 ? "+" : ""}{formatCurrencyWithCode(gain, c)} ({gainPct.toFixed(1)}%)
                            </span>
                            {c !== "USD" && (
                              <p className={`font-mono text-[9px] ${gain >= 0 ? "text-emerald-400/40" : "text-red-400/40"}`}>
                                {gain >= 0 ? "+" : ""}{fmtAlt(gain, c)}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-2.5 hidden lg:table-cell">
                            {inv.ticker && LIVE_PRICE_TYPES.includes(inv.type) ? (
                              <PriceSparkline symbol={inv.ticker} />
                            ) : (
                              <span className="font-mono text-xs text-white/10">--</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <button
                              onClick={() => onDelete(inv.id)}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono text-white/25 hover:text-red-400 transition-colors"
                            >
                              Del
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Investment Form */}
      <form onSubmit={handleAdd} className="glass-card rounded-2xl p-5 space-y-4">
        <h4 className="font-display font-semibold text-sm text-white">Add Investment</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Apple Inc."
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as InvestmentType)}
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all appearance-none"
            >
              {INVESTMENT_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-[#0a0c12]">{t.label}</option>
              ))}
            </select>
          </div>
          <div ref={dropdownRef} className="relative">
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Ticker</label>
            <div className="relative">
              <input
                ref={tickerInputRef}
                type="text"
                value={ticker}
                onChange={(e) => {
                  setTicker(e.target.value);
                  searchTicker(e.target.value);
                }}
                onKeyDown={handleTickerKeyDown}
                onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                placeholder={TICKER_PLACEHOLDERS[type] || "Search ticker..."}
                className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
                autoComplete="off"
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-blue-400 rounded-full animate-spin" />
                </div>
              )}
            </div>
            {/* Search dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-[#0d0f17] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                {searchResults.map((r, i) => (
                  <button
                    key={r.symbol}
                    type="button"
                    onClick={() => selectTicker(r)}
                    onMouseEnter={() => setHighlightIndex(i)}
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                      i === highlightIndex ? "bg-white/8" : "hover:bg-white/4"
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="font-mono text-sm text-white font-medium">{r.symbol}</span>
                      <span className="ml-2 font-body text-xs text-white/40 truncate">{r.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-white/20 ml-2 shrink-0">{r.exchange}</span>
                  </button>
                ))}
              </div>
            )}
            {/* Suggestion chips */}
            {TICKER_SUGGESTIONS[type] && (
              <div className="flex flex-wrap gap-1 mt-1">
                {TICKER_SUGGESTIONS[type]!.map((s) => (
                  <button
                    key={s.symbol}
                    type="button"
                    onClick={() => selectSuggestion(s.symbol, s.name)}
                    className="px-2 py-0.5 rounded-full bg-white/4 border border-white/6 text-[10px] font-mono text-white/30 hover:text-white/60 hover:border-white/15 transition-all"
                  >
                    {s.symbol}
                  </button>
                ))}
              </div>
            )}
            {priceError && (
              <p className="font-mono text-[10px] text-amber-400/80 mt-1">{priceError}</p>
            )}
          </div>
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Quantity</label>
            <input
              type="number"
              step="any"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="10"
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">
              Price / Unit
              {currency !== "USD" && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-500/10 text-[9px] text-amber-400/70 normal-case">{currency}</span>}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder={priceFetching ? "Fetching..." : "1500"}
                className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
              />
              {priceFetching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-emerald-400 rounded-full animate-spin" />
                </div>
              )}
            </div>
            {currency !== "USD" && purchasePrice && (
              <p className="font-mono text-[10px] text-white/20 mt-0.5">{fmtAlt(parseFloat(purchasePrice), currency)}</p>
            )}
          </div>
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">
              Current Price
              {currency !== "USD" && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-500/10 text-[9px] text-amber-400/70 normal-case">{currency}</span>}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                placeholder={priceFetching ? "Fetching..." : "Auto from ticker"}
                className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
              />
              {priceFetching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-emerald-400 rounded-full animate-spin" />
                </div>
              )}
            </div>
            {currency !== "USD" && currentValue && (
              <p className="font-mono text-[10px] text-white/20 mt-0.5">{fmtAlt(parseFloat(currentValue), currency)}</p>
            )}
          </div>
        </div>
        {/* Total preview when quantity and price are set */}
        {quantity && purchasePrice && (
          <div className="flex items-center gap-4 px-1">
            <p className="font-mono text-xs text-white/30">
              Total: <span className="text-white/50">{formatCurrencyWithCode(Math.round(parseFloat(quantity) * parseFloat(purchasePrice) * 100) / 100, currency)}</span>
              {currency !== "USD" && (
                <span className="text-white/20 ml-1.5">({fmtAlt(parseFloat(quantity) * parseFloat(purchasePrice), currency)})</span>
              )}
            </p>
          </div>
        )}
        <button
          type="submit"
          disabled={!name.trim() || !purchasePrice}
          className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          + Add Investment
        </button>
      </form>
    </div>
  );
}
