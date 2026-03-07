"use client";
import { useState, useMemo } from "react";
import { Transaction, Budget } from "@/types";
import { DEFAULT_EXPENSE_CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";
import { formatCurrency, getMonthlyTransactions, getCategoryBreakdown } from "@/lib/finance-utils";
import { motion } from "framer-motion";

interface BudgetPlannerProps {
  transactions: Transaction[];
  budgets: Budget[];
  selectedMonth: string;
  payrollIncome?: number;
  partTimeIncome?: number;
}

const TEMPLATES: { name: string; allocations: Record<string, number> }[] = [
  {
    name: "50/30/20 Rule",
    allocations: {
      Needs: 50,
      Wants: 30,
      Savings: 20,
    },
  },
  {
    name: "70/20/10 Rule",
    allocations: {
      Living: 70,
      Savings: 20,
      Giving: 10,
    },
  },
];

const NEEDS_CATEGORIES = ["Rent", "Groceries", "Utilities", "Health", "Education"];
const WANTS_CATEGORIES = ["Dining", "Travel", "Subscriptions", "Shopping", "Entertainment"];

export function BudgetPlanner({ transactions, budgets, selectedMonth, payrollIncome = 0, partTimeIncome = 0 }: BudgetPlannerProps) {
  const [incomeTarget, setIncomeTarget] = useState("");

  const monthlyTx = useMemo(() => getMonthlyTransactions(transactions, selectedMonth), [transactions, selectedMonth]);
  const txIncome = monthlyTx.filter((t) => t.type === "income" && !t.description?.startsWith("Payroll:")).reduce((s, t) => s + t.amount, 0);
  const actualIncome = txIncome + payrollIncome + partTimeIncome;
  const actualExpenses = monthlyTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const breakdown = useMemo(() => getCategoryBreakdown(monthlyTx), [monthlyTx]);

  const target = incomeTarget ? parseFloat(incomeTarget) : actualIncome;

  const needsSpent = breakdown
    .filter((b) => NEEDS_CATEGORIES.includes(b.category))
    .reduce((s, b) => s + b.total, 0);
  const wantsSpent = breakdown
    .filter((b) => WANTS_CATEGORIES.includes(b.category))
    .reduce((s, b) => s + b.total, 0);
  const savingsActual = actualIncome - actualExpenses;

  const needsPct = target > 0 ? (needsSpent / target) * 100 : 0;
  const wantsPct = target > 0 ? (wantsSpent / target) * 100 : 0;
  const savingsPct = target > 0 ? (savingsActual / target) * 100 : 0;

  const monthBudgets = useMemo(() => budgets.filter((b) => b.month === selectedMonth), [budgets, selectedMonth]);

  return (
    <div className="space-y-6">
      {/* Income Target */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Monthly Income Target</p>
            <p className="font-mono text-xl text-white">
              {target > 0 ? formatCurrency(target) : "Set a target below"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              step="100"
              value={incomeTarget}
              onChange={(e) => setIncomeTarget(e.target.value)}
              placeholder={actualIncome > 0 ? `Actual: ${formatCurrency(actualIncome)}` : "5000"}
              className="bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all w-48"
            />
          </div>
        </div>
      </div>

      {/* 50/30/20 Breakdown */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <h4 className="font-display font-semibold text-sm text-white">Budget Allocation (50/30/20)</h4>
        <div className="space-y-3">
          {[
            { label: "Needs (50%)", target: 50, actual: needsPct, spent: needsSpent, color: "bg-blue-500" },
            { label: "Wants (30%)", target: 30, actual: wantsPct, spent: wantsSpent, color: "bg-purple-500" },
            { label: "Savings (20%)", target: 20, actual: savingsPct, spent: savingsActual, color: "bg-emerald-500" },
          ].map((item) => {
            const overBudget = item.actual > item.target;
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body text-xs text-white/60">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-white/40">
                      {formatCurrency(item.spent)} / {formatCurrency(target * item.target / 100)}
                    </span>
                    {overBudget && (
                      <span className="text-xs text-red-400 font-mono">{Math.round(item.actual)}%</span>
                    )}
                  </div>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden relative">
                  {/* Target marker */}
                  <div
                    className="absolute h-full w-px bg-white/30 z-10"
                    style={{ left: `${item.target}%` }}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(item.actual, 100)}%` }}
                    transition={{ duration: 0.6 }}
                    className={`h-full rounded-full ${overBudget ? "bg-red-500" : item.color}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Templates */}
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-3">Budget Templates</h4>
        <div className="flex flex-wrap gap-3">
          {TEMPLATES.map((tpl) => (
            <div key={tpl.name} className="glass-card rounded-xl p-4 flex-1 min-w-[200px]">
              <p className="font-body text-sm text-white mb-2">{tpl.name}</p>
              <div className="space-y-1">
                {Object.entries(tpl.allocations).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="font-body text-xs text-white/40">{k}</span>
                    <span className="font-mono text-xs text-white/60">
                      {v}% — {target > 0 ? formatCurrency(target * v / 100) : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category vs Budget Comparison */}
      {monthBudgets.length > 0 && (
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <h4 className="font-display font-semibold text-sm text-white">Planned vs Actual</h4>
          {monthBudgets.map((budget, i) => {
            const spent = breakdown.find((b) => b.category === budget.category)?.total || 0;
            const pct = Math.min((spent / budget.monthly_limit) * 100, 100);
            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[budget.category] || "bg-gray-500"}`} />
                    <span className="font-body text-xs text-white/60">{budget.category}</span>
                  </div>
                  <span className="font-mono text-xs text-white/40">
                    {formatCurrency(spent)} / {formatCurrency(budget.monthly_limit)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${
                      pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-yellow-500" : "bg-blue-500"
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
