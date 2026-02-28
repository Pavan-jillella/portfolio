"use client";
import { useState } from "react";
import { Budget, MonthlySpending } from "@/types";
import { formatCurrency, generateId } from "@/lib/finance-utils";
import { DEFAULT_EXPENSE_CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";
import { motion } from "framer-motion";

interface BudgetManagerProps {
  budgets: Budget[];
  spending: MonthlySpending[];
  selectedMonth: string;
  onAddBudget: (budget: Budget) => void;
  onDeleteBudget: (id: string) => void;
}

export function BudgetManager({ budgets, spending, selectedMonth, onAddBudget, onDeleteBudget }: BudgetManagerProps) {
  const [newCategory, setNewCategory] = useState("Rent");
  const [newLimit, setNewLimit] = useState("");

  const monthBudgets = budgets.filter((b) => b.month === selectedMonth);
  const expenseCategories = DEFAULT_EXPENSE_CATEGORIES;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newLimit || parseFloat(newLimit) <= 0) return;
    onAddBudget({
      id: generateId(),
      category: newCategory,
      monthly_limit: parseFloat(newLimit),
      month: selectedMonth,
    });
    setNewLimit("");
  }

  return (
    <div className="space-y-5">
      {monthBudgets.length === 0 && (
        <div className="glass-card rounded-3xl p-8 text-center">
          <p className="font-body text-sm text-white/30">No budgets set for this month</p>
          <p className="font-body text-xs text-white/15 mt-1">Add category budgets below</p>
        </div>
      )}

      {monthBudgets.map((budget, i) => {
        const spent = spending.find((s) => s.category === budget.category)?.total || 0;
        const pct = Math.min((spent / budget.monthly_limit) * 100, 100);
        const overPct = spent > budget.monthly_limit ? ((spent - budget.monthly_limit) / budget.monthly_limit) * 100 : 0;

        return (
          <motion.div
            key={budget.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass-card rounded-2xl p-5 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${CATEGORY_COLORS[budget.category]}`} />
                <span className="font-body text-sm text-white">{budget.category}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-white/40">
                  {formatCurrency(spent)} / {formatCurrency(budget.monthly_limit)}
                </span>
                {spent > budget.monthly_limit && (
                  <span className="tag-badge px-1.5 py-0.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs">
                    Over
                  </span>
                )}
                <button
                  onClick={() => onDeleteBudget(budget.id)}
                  className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6 }}
                className={`h-full rounded-full ${
                  pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-yellow-500" : "bg-blue-500"
                }`}
              />
            </div>
          </motion.div>
        );
      })}

      {/* Add budget form */}
      <form onSubmit={handleAdd} className="glass-card rounded-2xl p-5 flex items-end gap-3 flex-wrap">
        <div className="flex-1 min-w-[140px]">
          <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Category</label>
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all appearance-none"
          >
            {expenseCategories.map((c) => (
              <option key={c} value={c} className="bg-[#0a0c12] text-white">{c}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Limit</label>
          <input
            type="number"
            min="0"
            step="1"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
            placeholder="500"
            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
          />
        </div>
        <button
          type="submit"
          className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
        >
          + Add
        </button>
      </form>
    </div>
  );
}
