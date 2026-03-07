"use client";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Investment, InvestmentType, MarketRegion } from "@/types";
import {
  INVESTMENT_TYPES,
  LIVE_PRICE_TYPES,
  INVESTMENT_TYPE_COLORS,
  TICKER_SUGGESTIONS,
  DEFAULT_REFRESH_INTERVAL_MINUTES,
  MARKET_GROUPS,
} from "@/lib/constants";
import { generateId, formatCurrencyWithCode, convertCurrency } from "@/lib/finance-utils";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { useCurrencyRates } from "@/hooks/queries/useCurrencyRates";
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
  stock: "Search company... e.g. Reliance, Apple",
  crypto: "BTC-USD, ETH-USD",
  commodity: "GC=F (Gold), SI=F (Silver)",
  index: "^NSEI, SPY, ^BSESN",
  sip: "Search mutual fund...",
  forex: "USDINR=X, EURUSD=X",
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

function detectMarket(exchange: string, type: InvestmentType): MarketRegion {
  const ex = exchange.toUpperCase();
  const indian = ["NSE", "BSE", "NSI", "BOM"];
  if (indian.some((e) => ex.includes(e))) return "indian";
  if (type === "crypto") return "crypto";
  if (type === "commodity") return "commodity";
  const us = ["NASDAQ", "NYSE", "AMEX", "NMS", "NYQ", "PCX"];
  if (us.some((e) => ex.includes(e))) return "us";
  return "other";
}

function detectType(quoteType: string, investmentType: InvestmentType): InvestmentType {
  const qt = quoteType.toLowerCase();
  if (qt === "cryptocurrency") return "crypto";
  if (qt === "index") return "index";
  if (qt === "commodity" || qt === "future") return "commodity";
  if (qt === "currency") return "forex";
  if (qt === "mutualfund") return "sip";
  return investmentType;
}

// Strip ticker suffix for display: SBIN.NS → SBIN, RELIANCE.BO → RELIANCE
function tickerCode(ticker: string): string {
  return ticker.replace(/\.(NS|BO|L|TO|V|AX|SS|SZ)$/i, "").replace(/[-=].*$/, "");
}

export function InvestmentTracker({ investments, onAdd, onUpdate, onDelete }: InvestmentTrackerProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<InvestmentType>("stock");
  const [ticker, setTicker] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [exchange, setExchange] = useState("");
  const [market, setMarket] = useState<MarketRegion>("other");

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState("");
  const [editPrice, setEditPrice] = useState("");

  // Exchange rates for currency conversion
  const { data: ratesData } = useCurrencyRates();
  const rates = useMemo(() => ratesData?.rates || {}, [ratesData]);

  // Ticker search state
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [priceFetching, setPriceFetching] = useState(false);
  const [priceError, setPriceError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Filter state
  const [filterMarket, setFilterMarket] = useState<MarketRegion | "all">("all");
  const [filterType, setFilterType] = useState<InvestmentType | "all">("all");

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
      // Check if crypto — use crypto API
      const isCrypto = symbol.includes("-USD") && !symbol.includes(".");
      const apiUrl = isCrypto
        ? `/api/finance/crypto?symbols=${encodeURIComponent(symbol)}&_t=${Date.now()}`
        : `/api/finance/stocks?symbols=${encodeURIComponent(symbol)}&_t=${Date.now()}`;

      const res = await fetch(apiUrl);
      if (!res.ok) {
        setPriceError("Failed to fetch price");
        return;
      }
      const data = await res.json();
      const quote = (data.quotes || [])[0];
      if (quote && quote.price > 0) {
        setPurchasePrice(String(quote.price));
        setCurrentValue(String(quote.price));
        // Auto-detect exchange and market from API response
        if (quote.exchange) {
          setExchange(quote.exchange);
          setMarket(detectMarket(quote.exchange, type));
        }
        if (quote.name && !name) {
          setName(quote.name);
        }
      } else {
        setPriceError("Price unavailable — enter manually");
      }
    } catch {
      setPriceError("Network error — enter price manually");
    } finally {
      setPriceFetching(false);
    }
  }, [type, name]);

  // Select a ticker from search results
  const selectTicker = useCallback((result: SearchResult) => {
    setTicker(result.symbol);
    if (!name) setName(result.name);
    setCurrency(detectCurrency(result.symbol));
    setExchange(result.exchange);
    setMarket(detectMarket(result.exchange, type));
    setType(detectType(result.type, type));
    setShowDropdown(false);
    setSearchResults([]);
    fetchLivePrice(result.symbol);
  }, [name, type, fetchLivePrice]);

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

  // Group investments by market
  const grouped = useMemo(() => {
    const groups: Record<string, Investment[]> = {};
    for (const inv of investments) {
      const m = inv.market || "other";
      if (!groups[m]) groups[m] = [];
      groups[m].push(inv);
    }
    return groups;
  }, [investments]);

  // Filtered investments
  const filteredInvestments = useMemo(() => {
    let list = investments;
    if (filterMarket !== "all") list = list.filter((i) => (i.market || "other") === filterMarket);
    if (filterType !== "all") list = list.filter((i) => i.type === filterType);
    return list;
  }, [investments, filterMarket, filterType]);

  // Get unique types present
  const presentTypes = useMemo(() => Array.from(new Set(investments.map((i) => i.type))).sort(), [investments]);

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
      // Split crypto and non-crypto
      const cryptoInvs = tickerInvestments.filter((i) => i.type === "crypto");
      const otherInvs = tickerInvestments.filter((i) => i.type !== "crypto");

      const fetches: Promise<void>[] = [];

      if (otherInvs.length > 0) {
        const symbols = otherInvs.map((i) => i.ticker).join(",");
        fetches.push(
          fetch(`/api/finance/stocks?symbols=${encodeURIComponent(symbols)}&_t=${Date.now()}`)
            .then((res) => res.ok ? res.json() : { quotes: [] })
            .then((data) => {
              const quotes: { symbol: string; price: number }[] = data.quotes || [];
              quotes.forEach((q) => {
                const inv = otherInvs.find((i) => i.ticker?.toUpperCase() === q.symbol.toUpperCase());
                if (inv && q.price > 0) {
                  const newValue = (inv.quantity || 1) * q.price;
                  onUpdate(inv.id, {
                    current_value: Math.round(newValue * 100) / 100,
                    last_updated: new Date().toISOString(),
                  });
                }
              });
            })
        );
      }

      if (cryptoInvs.length > 0) {
        const symbols = cryptoInvs.map((i) => i.ticker).join(",");
        fetches.push(
          fetch(`/api/finance/crypto?symbols=${encodeURIComponent(symbols)}&_t=${Date.now()}`)
            .then((res) => res.ok ? res.json() : { quotes: [] })
            .then((data) => {
              const quotes: { symbol: string; price: number }[] = data.quotes || [];
              quotes.forEach((q) => {
                const inv = cryptoInvs.find((i) => i.ticker?.toUpperCase() === q.symbol.toUpperCase());
                if (inv && q.price > 0) {
                  const newValue = (inv.quantity || 1) * q.price;
                  onUpdate(inv.id, {
                    current_value: Math.round(newValue * 100) / 100,
                    last_updated: new Date().toISOString(),
                  });
                }
              });
            })
        );
      }

      await Promise.all(fetches);
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
      exchange: exchange || undefined,
      market: market || detectMarket(exchange, type),
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
    setExchange("");
    setMarket("other");
    setPriceError("");
    setSearchResults([]);
    setShowDropdown(false);
  }

  function startEdit(inv: Investment) {
    setEditId(inv.id);
    setEditQty(inv.quantity ? String(inv.quantity) : "");
    setEditPrice(inv.quantity && inv.quantity > 0 ? String(Math.round((inv.purchase_price / inv.quantity) * 100) / 100) : String(inv.purchase_price));
  }

  function saveEdit(inv: Investment) {
    if (!editId) return;
    const qty = editQty ? parseFloat(editQty) : (inv.quantity || 1);
    const unitPrice = editPrice ? parseFloat(editPrice) : inv.purchase_price;
    const unitCurrent = inv.quantity && inv.quantity > 0 ? inv.current_value / inv.quantity : inv.current_value;
    onUpdate(editId, {
      quantity: qty,
      purchase_price: Math.round(qty * unitPrice * 100) / 100,
      current_value: Math.round(qty * unitCurrent * 100) / 100,
    });
    setEditId(null);
  }

  function cancelEdit() {
    setEditId(null);
  }

  // Render a single investment row
  function renderInvestmentRow(inv: Investment) {
    const c = inv.currency || "USD";
    const qty = inv.quantity || 1;
    const unitCost = qty > 0 ? inv.purchase_price / qty : inv.purchase_price;
    const unitCurrent = qty > 0 ? inv.current_value / qty : inv.current_value;
    const gain = inv.current_value - inv.purchase_price;
    const gainPct = inv.purchase_price > 0 ? (gain / inv.purchase_price) * 100 : 0;
    const isEditing = editId === inv.id;
    const code = inv.ticker ? tickerCode(inv.ticker) : "";

    return (
      <motion.div
        key={inv.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="glass-card rounded-xl p-4 group"
      >
        {isEditing ? (
          /* Edit mode */
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-body text-sm text-white">{inv.name}</span>
              {code && <span className="font-mono text-xs text-white/30">({code})</span>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-[10px] text-white/30 uppercase mb-1">Quantity</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={editQty}
                  onChange={(e) => setEditQty(e.target.value)}
                  className="w-full bg-white/4 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-blue-500/40"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] text-white/30 uppercase mb-1">Bought Price / Unit</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full bg-white/4 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:outline-none focus:border-blue-500/40"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => saveEdit(inv)} className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-mono hover:bg-emerald-500/30 transition-colors">Save</button>
              <button onClick={cancelEdit} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/40 text-xs font-mono hover:bg-white/10 transition-colors">Cancel</button>
            </div>
          </div>
        ) : (
          /* Display mode */
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`w-2 h-2 rounded-full shrink-0 ${INVESTMENT_TYPE_COLORS[inv.type] || "bg-gray-500"}`} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-body text-sm text-white truncate">{inv.name}</span>
                  {code && <span className="font-mono text-xs text-white/30">({code})</span>}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {inv.exchange && (
                    <span className="px-1.5 py-0.5 rounded bg-white/5 font-mono text-[9px] text-white/30">{inv.exchange}</span>
                  )}
                  <span className="font-mono text-[9px] text-white/20 capitalize">{inv.type}</span>
                  {c !== "USD" && (
                    <span className="px-1 py-0.5 rounded bg-amber-500/10 font-mono text-[9px] text-amber-400/60">{c}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Data columns */}
            <div className="flex items-center gap-4 text-right shrink-0">
              <div className="hidden sm:block">
                <p className="font-mono text-[9px] text-white/25 uppercase">Qty</p>
                <p className="font-mono text-xs text-white/50">{qty}</p>
              </div>
              <div className="hidden md:block">
                <p className="font-mono text-[9px] text-white/25 uppercase">Bought</p>
                <p className="font-mono text-xs text-white/40">{formatCurrencyWithCode(unitCost, c)}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] text-white/25 uppercase">Current</p>
                <p className="font-mono text-xs text-white">{formatCurrencyWithCode(unitCurrent, c)}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] text-white/25 uppercase">P/L</p>
                <p className={`font-mono text-xs ${gain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {gain >= 0 ? "+" : ""}{formatCurrencyWithCode(gain, c)}
                </p>
                <p className={`font-mono text-[9px] ${gain >= 0 ? "text-emerald-400/60" : "text-red-400/60"}`}>
                  {gainPct >= 0 ? "+" : ""}{gainPct.toFixed(1)}%
                </p>
                {c !== "USD" && (
                  <p className={`font-mono text-[9px] ${gain >= 0 ? "text-emerald-400/30" : "text-red-400/30"}`}>
                    {gain >= 0 ? "+" : ""}{fmtAlt(gain, c)}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(inv)}
                  className="p-1.5 rounded-lg text-white/20 hover:text-blue-400 hover:bg-white/5 transition-all"
                  title="Edit"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(inv.id)}
                  className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-white/5 transition-all"
                  title="Delete"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
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
      <div className="flex items-center justify-between gap-3">
        {/* Market + Type filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setFilterMarket("all"); setFilterType("all"); }}
            className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all ${
              filterMarket === "all" && filterType === "all"
                ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                : "border-white/8 bg-white/4 text-white/40 hover:border-white/15"
            }`}
          >
            All
          </button>
          {MARKET_GROUPS.filter((g) => grouped[g.key]?.length).map((g) => (
            <button
              key={g.key}
              onClick={() => { setFilterMarket(g.key); setFilterType("all"); }}
              className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all ${
                filterMarket === g.key
                  ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                  : "border-white/8 bg-white/4 text-white/40 hover:border-white/15"
              }`}
            >
              {g.label}
            </button>
          ))}
          {presentTypes.length > 1 && (
            <>
              <span className="w-px h-4 bg-white/10" />
              {presentTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 rounded-full border font-mono text-[10px] transition-all capitalize ${
                    filterType === t
                      ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                      : "border-white/8 bg-white/4 text-white/30 hover:border-white/15"
                  }`}
                >
                  {t}
                </button>
              ))}
            </>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
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
      </div>

      {/* Holdings - Grouped by Market */}
      {investments.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="font-body text-sm text-white/30">No investments tracked yet</p>
          <p className="font-body text-xs text-white/15 mt-1">Add your first investment below</p>
        </div>
      ) : filterMarket === "all" && filterType === "all" ? (
        /* Grouped display */
        <div className="space-y-6">
          {MARKET_GROUPS.filter((g) => grouped[g.key]?.length).map((g) => {
            const groupInvs = grouped[g.key] || [];
            const groupValue = groupInvs.reduce((s, i) => s + convertCurrency(i.current_value, i.currency, "USD", rates), 0);
            const groupCost = groupInvs.reduce((s, i) => s + convertCurrency(i.purchase_price, i.currency, "USD", rates), 0);
            const groupGain = groupValue - groupCost;
            return (
              <div key={g.key}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-semibold text-sm text-white">{g.label}</h3>
                    <span className="font-mono text-[10px] text-white/20">({groupInvs.length})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-white/40">{formatCurrencyWithCode(groupValue, "USD")}</span>
                    <span className={`font-mono text-xs ${groupGain >= 0 ? "text-emerald-400/60" : "text-red-400/60"}`}>
                      {groupGain >= 0 ? "+" : ""}{formatCurrencyWithCode(groupGain, "USD")}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {groupInvs.map((inv) => renderInvestmentRow(inv))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Filtered display (flat list) */
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display font-semibold text-sm text-white">
              Holdings
              <span className="ml-2 font-mono text-xs text-white/30">({filteredInvestments.length})</span>
            </h3>
          </div>
          <AnimatePresence>
            {filteredInvestments.map((inv) => renderInvestmentRow(inv))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Investment Form */}
      <form onSubmit={handleAdd} className="glass-card rounded-2xl p-5 space-y-4">
        <h4 className="font-display font-semibold text-sm text-white">Add Investment</h4>

        {/* Row 1: Search + Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div ref={dropdownRef} className="relative sm:col-span-2">
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Search Company / Asset</label>
            <div className="relative">
              <input
                type="text"
                value={ticker}
                onChange={(e) => {
                  setTicker(e.target.value);
                  searchTicker(e.target.value);
                }}
                onKeyDown={handleTickerKeyDown}
                onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
                placeholder={TICKER_PLACEHOLDERS[type] || "Search..."}
                className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
                autoComplete="off"
              />
              {(searchLoading || priceFetching) && (
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
            {priceError && <p className="font-mono text-[10px] text-amber-400/80 mt-1">{priceError}</p>}
            {/* Auto-filled info */}
            {name && ticker && (
              <p className="font-mono text-[10px] text-white/20 mt-1">
                {name} {exchange && `· ${exchange}`} {currency !== "USD" && `· ${currency}`}
              </p>
            )}
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
        </div>

        {/* Row 2: Quantity + Bought Price + Current (auto) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              Bought Price / Unit
              {currency !== "USD" && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-500/10 text-[9px] text-amber-400/70 normal-case">{currency}</span>}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder={priceFetching ? "Fetching..." : "Price per unit"}
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">
              Current Price
              {currency !== "USD" && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-amber-500/10 text-[9px] text-amber-400/70 normal-case">{currency}</span>}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              placeholder={priceFetching ? "Fetching..." : "Auto from search"}
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
        </div>

        {/* Total preview */}
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
