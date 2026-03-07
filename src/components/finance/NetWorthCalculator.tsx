"use client";
import { useState } from "react";
import { NetWorthEntry, NetWorthEntryType } from "@/types";
import { NET_WORTH_ASSET_CATEGORIES, NET_WORTH_LIABILITY_CATEGORIES } from "@/lib/constants";
import { generateId, formatCurrency, calculateNetWorth } from "@/lib/finance-utils";
import { motion, AnimatePresence } from "framer-motion";

interface NetWorthCalculatorProps {
  entries: NetWorthEntry[];
  onAdd: (entry: NetWorthEntry) => void;
  onDelete: (id: string) => void;
}

export function NetWorthCalculator({ entries, onAdd, onDelete }: NetWorthCalculatorProps) {
  const [entryType, setEntryType] = useState<NetWorthEntryType>("asset");
  const [name, setName] = useState("");
  const [category, setCategory] = useState(NET_WORTH_ASSET_CATEGORIES[0]);
  const [value, setValue] = useState("");

  const { assets, liabilities, netWorth } = calculateNetWorth(entries);
  const assetEntries = entries.filter((e) => e.type === "asset");
  const liabilityEntries = entries.filter((e) => e.type === "liability");
  const ratio = assets > 0 ? (assets / (assets + liabilities)) * 100 : 50;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !value || parseFloat(value) <= 0) return;
    onAdd({
      id: generateId(),
      name: name.trim(),
      type: entryType,
      category,
      value: parseFloat(value),
      currency: "USD",
      created_at: new Date().toISOString(),
    });
    setName("");
    setValue("");
  }

  const categories = entryType === "asset" ? NET_WORTH_ASSET_CATEGORIES : NET_WORTH_LIABILITY_CATEGORIES;

  return (
    <div className="space-y-6">
      {/* Net Worth Summary */}
      <div className="glass-card rounded-3xl p-6 text-center">
        <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Net Worth</p>
        <p className={`font-mono text-3xl font-bold ${netWorth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          {netWorth >= 0 ? "" : "-"}{formatCurrency(Math.abs(netWorth))}
        </p>
        {/* Ratio bar */}
        <div className="mt-4 h-3 rounded-full bg-white/5 overflow-hidden flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${ratio}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-emerald-500/60 rounded-l-full bar-3d-horizontal"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${100 - ratio}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-red-500/60 rounded-r-full bar-3d-horizontal"
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-mono text-xs text-emerald-400">Assets: {formatCurrency(assets)}</span>
          <span className="font-mono text-xs text-red-400">Liabilities: {formatCurrency(liabilities)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-lg text-emerald-400">Assets</h3>
          {assetEntries.length === 0 ? (
            <p className="font-body text-xs text-white/20">No assets added yet</p>
          ) : (
            <AnimatePresence>
              {assetEntries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.02 }}
                  className="glass-card rounded-xl p-3 flex items-center justify-between group"
                >
                  <div>
                    <p className="font-body text-sm text-white">{entry.name}</p>
                    <p className="font-body text-xs text-white/30">{entry.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-emerald-400">{formatCurrency(entry.value)}</span>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Liabilities */}
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-lg text-red-400">Liabilities</h3>
          {liabilityEntries.length === 0 ? (
            <p className="font-body text-xs text-white/20">No liabilities added yet</p>
          ) : (
            <AnimatePresence>
              {liabilityEntries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.02 }}
                  className="glass-card rounded-xl p-3 flex items-center justify-between group"
                >
                  <div>
                    <p className="font-body text-sm text-white">{entry.name}</p>
                    <p className="font-body text-xs text-white/30">{entry.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-red-400">{formatCurrency(entry.value)}</span>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Add Entry Form */}
      <form onSubmit={handleAdd} className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex gap-2 mb-2">
          {(["asset", "liability"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setEntryType(t);
                setCategory(t === "asset" ? NET_WORTH_ASSET_CATEGORIES[0] : NET_WORTH_LIABILITY_CATEGORIES[0]);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-body transition-all ${
                entryType === t ? "glass-card text-blue-400" : "text-white/30 hover:text-white"
              }`}
            >
              {t === "asset" ? "Asset" : "Liability"}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Savings Account"
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all appearance-none"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#0a0c12]">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Value</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="10000"
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!name.trim() || !value}
          className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          + Add {entryType === "asset" ? "Asset" : "Liability"}
        </button>
      </form>
    </div>
  );
}
