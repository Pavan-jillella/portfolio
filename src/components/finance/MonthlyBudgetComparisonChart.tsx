"use client";
import { useMemo } from "react";
import { Budget, Transaction } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";

interface MonthlyBudgetComparisonChartProps {
  budgets: Budget[];
  transactions: Transaction[];
  selectedMonth: string;
}

export function MonthlyBudgetComparisonChart({ budgets, transactions, selectedMonth }: MonthlyBudgetComparisonChartProps) {
  const data = useMemo(() => {
    const monthBudgets = budgets.filter((b) => b.month === selectedMonth);
    if (monthBudgets.length === 0) return [];

    const expenses = transactions.filter(
      (t) => t.type === "expense" && t.date.startsWith(selectedMonth)
    );
    const spendMap = new Map<string, number>();
    expenses.forEach((t) => {
      spendMap.set(t.category, (spendMap.get(t.category) || 0) + t.amount);
    });

    return monthBudgets.map((b) => ({
      category: b.category,
      budget: b.monthly_limit,
      actual: spendMap.get(b.category) || 0,
    }));
  }, [budgets, transactions, selectedMonth]);

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Budget vs Actual</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No budgets set for this month</p>
      </div>
    );
  }

  const chartWidth = 600;
  const chartHeight = 250;
  const pt = 28, pb = 40, pl = 10, pr = 10;
  const dw = chartWidth - pl - pr;
  const dh = chartHeight - pt - pb;

  const maxValue = Math.max(...data.flatMap((d) => [d.budget, d.actual]), 1);
  const groupW = dw / data.length;
  const barW = groupW * 0.3;
  const barGap = groupW * 0.05;
  const pillRx = barW / 2;
  const baseYLine = pt + dh;

  const budgetColor = "#3b82f6";
  const actualColor = "#f97316";
  const overBudgetColor = "#ef4444";

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Budget vs Actual</h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: budgetColor }} />
            <span className="font-mono text-[10px] text-white/50">Budget</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: actualColor }} />
            <span className="font-mono text-[10px] text-white/50">Actual</span>
          </div>
        </div>
      </div>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
        <defs>
          <linearGradient id="pillGrad-mbc-budget" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="pillGrad-mbc-actual" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb923c" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#ea580c" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="pillGrad-mbc-over" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f87171" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#dc2626" stopOpacity={0.7} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <line
            key={frac}
            x1={pl} y1={pt + dh - frac * dh}
            x2={chartWidth - pr} y2={pt + dh - frac * dh}
            stroke="rgba(255,255,255,0.04)" strokeWidth={0.5}
          />
        ))}

        {/* Grouped bars */}
        {data.map((d, i) => {
          const groupX = pl + i * groupW;
          const budgetX = groupX + (groupW - barW * 2 - barGap) / 2;
          const actualX = budgetX + barW + barGap;

          const budgetH = (d.budget / maxValue) * dh;
          const budgetY = baseYLine - budgetH;
          const actualH = (d.actual / maxValue) * dh;
          const actualY = baseYLine - actualH;

          const isOver = d.actual > d.budget;
          const categoryLabel = d.category.length > 8 ? d.category.slice(0, 8) + "\u2026" : d.category;

          return (
            <g key={d.category}>
              {/* Background tracks */}
              <rect x={budgetX} y={pt} width={barW} height={dh} rx={pillRx} fill="rgba(255,255,255,0.02)" />
              <rect x={actualX} y={pt} width={barW} height={dh} rx={pillRx} fill="rgba(255,255,255,0.02)" />

              {/* Budget pill bar */}
              <motion.rect
                x={budgetX} y={budgetY} width={barW} height={budgetH}
                rx={pillRx} fill="url(#pillGrad-mbc-budget)"
                initial={{ height: 0, y: baseYLine }}
                animate={{ height: budgetH, y: budgetY }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              />

              {/* Actual pill bar */}
              <motion.rect
                x={actualX} y={actualY} width={barW} height={actualH}
                rx={pillRx} fill={isOver ? "url(#pillGrad-mbc-over)" : "url(#pillGrad-mbc-actual)"}
                initial={{ height: 0, y: baseYLine }}
                animate={{ height: actualH, y: actualY }}
                transition={{ duration: 0.5, delay: i * 0.08 + 0.1 }}
              />

              {/* Value labels */}
              <text
                x={budgetX + barW / 2} y={budgetY - 5}
                textAnchor="middle" fill="rgba(96,165,250,0.9)"
                fontSize="12" fontWeight="600" className="font-mono"
              >
                {formatCurrency(d.budget)}
              </text>
              <text
                x={actualX + barW / 2} y={actualY - 5}
                textAnchor="middle" fill={isOver ? "rgba(248,113,113,0.9)" : "rgba(251,146,60,0.9)"}
                fontSize="12" fontWeight="600" className="font-mono"
              >
                {formatCurrency(d.actual)}
              </text>

              {/* Category label */}
              <text
                x={groupX + groupW / 2} y={chartHeight - pb + 18}
                textAnchor="middle" fill="rgba(255,255,255,0.45)"
                fontSize="9" className="font-mono"
              >
                {categoryLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
