"use client";
import { MonthlySpending, Budget } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { CATEGORY_COLORS, CATEGORY_TEXT_COLORS } from "@/lib/constants";
import { motion } from "framer-motion";

interface CategoryBreakdownProps {
  breakdown: MonthlySpending[];
  budgets: Budget[];
  selectedMonth: string;
}

export function CategoryBreakdown({ breakdown, budgets, selectedMonth }: CategoryBreakdownProps) {
  if (breakdown.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center">
        <p className="font-body text-sm text-white/30">No expenses this month</p>
      </div>
    );
  }

  const maxAmount = Math.max(...breakdown.map((b) => b.total));

  return (
    <div className="glass-card rounded-3xl p-8">
      <h3 className="font-display font-semibold text-lg text-white mb-6">Spending by Category</h3>
      <div className="space-y-4">
        {breakdown.map((item, i) => {
          const budget = budgets.find((b) => b.category === item.category && b.month === selectedMonth);
          const pct = maxAmount > 0 ? (item.total / maxAmount) * 100 : 0;
          const budgetPct = budget ? (item.total / budget.monthly_limit) * 100 : 0;

          return (
            <motion.div
              key={item.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`font-body text-sm ${CATEGORY_TEXT_COLORS[item.category]}`}>
                  {item.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-white">{formatCurrency(item.total)}</span>
                  {budget && (
                    <span
                      className={`tag-badge px-1.5 py-0.5 rounded-full border text-xs ${
                        budgetPct >= 100
                          ? "border-red-500/30 bg-red-500/10 text-red-400"
                          : budgetPct >= 80
                          ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                          : "border-white/8 bg-white/4 text-white/30"
                      }`}
                    >
                      {Math.round(budgetPct)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                  className={`h-full rounded-full ${CATEGORY_COLORS[item.category]}`}
                />
                {budget && (
                  <div
                    className="absolute top-0 h-full w-0.5 bg-white/40"
                    style={{ left: `${Math.min((budget.monthly_limit / maxAmount) * 100, 100)}%` }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
