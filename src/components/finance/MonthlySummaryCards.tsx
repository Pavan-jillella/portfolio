"use client";
import { formatCurrency } from "@/lib/finance-utils";
import { Budget, MonthlySpending } from "@/types";
import { motion } from "framer-motion";

interface MonthlySummaryCardsProps {
  income: number;
  expenses: number;
  budgets?: Budget[];
  spending?: MonthlySpending[];
  selectedMonth?: string;
}

export function MonthlySummaryCards({ income, expenses, budgets, spending, selectedMonth }: MonthlySummaryCardsProps) {
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;

  // Budget utilization for the selected month
  const monthBudgets = budgets?.filter((b) => b.month === selectedMonth) || [];
  const totalBudgeted = monthBudgets.reduce((s, b) => s + b.monthly_limit, 0);
  const totalBudgetSpent = monthBudgets.reduce((s, b) => {
    const spent = spending?.find((sp) => sp.category === b.category)?.total || 0;
    return s + spent;
  }, 0);
  const budgetPct = totalBudgeted > 0 ? (totalBudgetSpent / totalBudgeted) * 100 : 0;

  const cards = [
    { label: "Total Income", value: formatCurrency(income), color: "text-green-400" },
    { label: "Total Expenses", value: formatCurrency(expenses), color: "text-red-400" },
    { label: "Savings", value: `${savings >= 0 ? "+" : ""}${formatCurrency(savings)}`, color: savings >= 0 ? "text-blue-400" : "text-red-400" },
    ...(totalBudgeted > 0
      ? [{
          label: "Budget Used",
          value: `${Math.round(budgetPct)}%`,
          color: budgetPct >= 100 ? "text-red-400" : budgetPct >= 80 ? "text-yellow-400" : "text-emerald-400",
        }]
      : [{
          label: "Net Profit",
          value: `${savings >= 0 ? "+" : ""}${formatCurrency(savings)}`,
          color: savings >= 0 ? "text-emerald-400" : "text-red-400",
        }]),
    { label: "Savings Rate", value: `${savingsRate.toFixed(1)}%`, color: savingsRate >= 20 ? "text-emerald-400" : savingsRate >= 0 ? "text-yellow-400" : "text-red-400" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-2xl p-5"
        >
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">{card.label}</p>
          <p className={`font-display font-bold text-xl ${card.color}`}>{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
