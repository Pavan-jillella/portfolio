"use client";
import { useState } from "react";
import { TransactionType } from "@/types";

interface TransactionFiltersProps {
  categories: string[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  type: TransactionType | "all";
  category: string;
  dateFrom: string;
  dateTo: string;
}

export function TransactionFilters({ categories, onFilterChange }: TransactionFiltersProps) {
  const [type, setType] = useState<TransactionType | "all">("all");
  const [category, setCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  function update(patch: Partial<FilterState>) {
    const next = {
      type: patch.type ?? type,
      category: patch.category ?? category,
      dateFrom: patch.dateFrom ?? dateFrom,
      dateTo: patch.dateTo ?? dateTo,
    };
    if (patch.type !== undefined) setType(next.type);
    if (patch.category !== undefined) setCategory(next.category);
    if (patch.dateFrom !== undefined) setDateFrom(next.dateFrom);
    if (patch.dateTo !== undefined) setDateTo(next.dateTo);
    onFilterChange(next);
  }

  function clearFilters() {
    setType("all");
    setCategory("all");
    setDateFrom("");
    setDateTo("");
    onFilterChange({ type: "all", category: "all", dateFrom: "", dateTo: "" });
  }

  const hasFilters = type !== "all" || category !== "all" || dateFrom || dateTo;

  return (
    <div className="glass-card rounded-2xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Type filter */}
        <div className="flex gap-1">
          {(["all", "income", "expense"] as const).map((t) => (
            <button
              key={t}
              onClick={() => update({ type: t })}
              className={`px-3 py-1.5 rounded-lg text-xs font-body transition-all ${
                type === t ? "glass-card text-blue-400" : "text-white/30 hover:text-white"
              }`}
            >
              {t === "all" ? "All" : t === "income" ? "Income" : "Expense"}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-white/8" />

        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => update({ category: e.target.value })}
          className="bg-white/5 border border-white/10 text-white rounded-lg px-3 py-1.5 text-xs font-body focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="w-px h-6 bg-white/8" />

        {/* Date range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => update({ dateFrom: e.target.value })}
            className="bg-white/5 border border-white/10 text-white rounded-lg px-2 py-1.5 text-xs font-body focus:outline-none focus:border-blue-500/50 transition-all"
            placeholder="From"
          />
          <span className="text-white/20 text-xs">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => update({ dateTo: e.target.value })}
            className="bg-white/5 border border-white/10 text-white rounded-lg px-2 py-1.5 text-xs font-body focus:outline-none focus:border-blue-500/50 transition-all"
            placeholder="To"
          />
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-body text-white/30 hover:text-white transition-colors ml-auto"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
