"use client";
import { useState, useEffect, useCallback } from "react";
import { Investment, InvestmentType } from "@/types";
import { INVESTMENT_TYPES } from "@/lib/constants";
import { generateId, formatCurrency } from "@/lib/finance-utils";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
import { motion, AnimatePresence } from "framer-motion";

interface InvestmentTrackerProps {
  investments: Investment[];
  onAdd: (investment: Investment) => void;
  onUpdate: (id: string, updates: Partial<Investment>) => void;
  onDelete: (id: string) => void;
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

  const investmentTypes = Array.from(new Set(investments.map((i) => i.type))).sort();

  const filteredInvestments = filterType === "all"
    ? investments
    : investments.filter((i) => i.type === filterType);

  const totalValue = investments.reduce((s, i) => s + i.current_value, 0);
  const totalCost = investments.reduce((s, i) => s + i.purchase_price, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  const refreshPrices = useCallback(async () => {
    const tickerInvestments = investments.filter((i) => i.ticker && (i.type === "stock" || i.type === "crypto"));
    if (tickerInvestments.length === 0) return;

    setLoading(true);
    try {
      const symbols = tickerInvestments.map((i) => i.ticker).join(",");
      const res = await fetch(`/api/finance/stocks?symbols=${encodeURIComponent(symbols)}`);
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

  useEffect(() => {
    refreshPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !purchasePrice) return;

    const cv = currentValue ? parseFloat(currentValue) : parseFloat(purchasePrice);
    onAdd({
      id: generateId(),
      name: name.trim(),
      type,
      ticker: ticker.trim() || undefined,
      quantity: quantity ? parseFloat(quantity) : undefined,
      purchase_price: parseFloat(purchasePrice),
      current_value: cv,
      currency: "USD",
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
    setName("");
    setTicker("");
    setQuantity("");
    setPurchasePrice("");
    setCurrentValue("");
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Portfolio Value", value: formatCurrency(totalValue), color: "text-white" },
          { label: "Total Cost", value: formatCurrency(totalCost), color: "text-white/60" },
          {
            label: "Total Gain/Loss",
            value: `${totalGain >= 0 ? "+" : ""}${formatCurrency(totalGain)}`,
            color: totalGain >= 0 ? "text-emerald-400" : "text-red-400",
          },
          {
            label: "Return",
            value: `${totalGainPct >= 0 ? "+" : ""}${totalGainPct.toFixed(1)}%`,
            color: totalGainPct >= 0 ? "text-emerald-400" : "text-red-400",
          },
        ].map((card) => (
          <div key={card.label} className="glass-card rounded-2xl p-4 text-center">
            <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">{card.label}</p>
            <p className={`font-mono text-xl font-semibold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Refresh button */}
      <div className="flex justify-end">
        <button
          onClick={refreshPrices}
          disabled={loading}
          className="glass-card px-4 py-2 rounded-xl text-xs font-body text-white/40 hover:text-white transition-all disabled:opacity-30"
        >
          {loading ? "Refreshing..." : "Refresh Prices"}
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
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          inv.type === "stock" ? "bg-blue-500" :
                          inv.type === "crypto" ? "bg-amber-500" :
                          inv.type === "real-estate" ? "bg-purple-500" : "bg-gray-500"
                        }`} />
                        <div>
                          <span className="font-body text-sm text-white">{inv.name}</span>
                          {inv.ticker && (
                            <span className="ml-2 font-mono text-xs text-white/30">{inv.ticker}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-mono text-sm text-white">{formatCurrency(inv.current_value)}</p>
                          <p className={`font-mono text-xs ${gain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {gain >= 0 ? "+" : ""}{formatCurrency(gain)} ({gainPct.toFixed(1)}%)
                          </p>
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
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            inv.type === "stock" ? "bg-blue-500" :
                            inv.type === "crypto" ? "bg-amber-500" :
                            inv.type === "real-estate" ? "bg-purple-500" : "bg-gray-500"
                          }`} />
                          <span className="font-body text-sm text-white font-medium">{inv.name}</span>
                        </div>
                        <span className="font-body text-[10px] text-white/20 uppercase capitalize">{inv.type}</span>
                      </div>
                      {inv.ticker && (
                        <p className="font-mono text-xs text-white/30 mb-2">{inv.ticker}{inv.quantity ? ` · ${inv.quantity} units` : ""}</p>
                      )}
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div>
                          <p className="font-mono text-[10px] text-white/25 uppercase">Value</p>
                          <p className="font-mono text-lg text-white">{formatCurrency(inv.current_value)}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[10px] text-white/25 uppercase">Cost</p>
                          <p className="font-mono text-lg text-white/50">{formatCurrency(inv.purchase_price)}</p>
                        </div>
                      </div>
                      <p className={`font-mono text-xs ${gain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {gain >= 0 ? "+" : ""}{formatCurrency(gain)} ({gainPct.toFixed(1)}%)
                      </p>
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
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvestments.map((inv) => {
                      const gain = inv.current_value - inv.purchase_price;
                      const gainPct = inv.purchase_price > 0 ? (gain / inv.purchase_price) * 100 : 0;
                      return (
                        <tr key={inv.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-2.5">
                            <span className="font-body text-xs text-white/70">{inv.name}</span>
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
                            <span className="font-mono text-xs text-white/50">{formatCurrency(inv.purchase_price)}</span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <span className="font-mono text-xs text-white">{formatCurrency(inv.current_value)}</span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <span className={`font-mono text-xs ${gain >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {gain >= 0 ? "+" : ""}{formatCurrency(gain)} ({gainPct.toFixed(1)}%)
                            </span>
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
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Ticker</label>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="AAPL"
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            />
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
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Purchase Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="1500"
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Current Value</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              placeholder="Auto from ticker"
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
        </div>
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
