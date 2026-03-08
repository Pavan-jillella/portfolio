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

  const W = 320, H = 160;
  const pt = 14, pb = 22, pl = 6, pr = 6;
  const dw = W - pl - pr;
  const dh = H - pt - pb;
  const maxValue = Math.max(...data.flatMap((d) => [d.budget, d.actual]), 1);
  const groupW = dw / data.length;
  const barW = Math.min(groupW * 0.28, 18);
  const barGap = Math.max(barW * 0.2, 2);
  const rx = Math.min(barW / 2, 4);
  const baseY = pt + dh;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Budget vs Actual</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-mono text-[9px] text-white/40">Budget</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="font-mono text-[9px] text-white/40">Actual</span>
          </div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
        <defs>
          <linearGradient id="mbcBudget" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="mbcActual" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdba74" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#ea580c" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="mbcOver" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fca5a5" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#dc2626" stopOpacity={0.6} />
          </linearGradient>
        </defs>

        {[0.5, 1].map((f) => (
          <line key={f} x1={pl} y1={baseY - f * dh} x2={W - pr} y2={baseY - f * dh} stroke="rgba(255,255,255,0.05)" strokeWidth={0.3} />
        ))}

        {data.map((d, i) => {
          const cx = pl + i * groupW + groupW / 2;
          const bx = cx - barW - barGap / 2;
          const ax = cx + barGap / 2;
          const bH = (d.budget / maxValue) * dh;
          const aH = (d.actual / maxValue) * dh;
          const isOver = d.actual > d.budget;
          const catLabel = d.category.length > 7 ? d.category.slice(0, 6) + "…" : d.category;

          return (
            <g key={d.category}>
              <motion.rect x={bx} y={baseY - bH} width={barW} height={bH} rx={rx}
                fill="url(#mbcBudget)"
                initial={{ height: 0, y: baseY }} animate={{ height: bH, y: baseY - bH }}
                transition={{ duration: 0.4, delay: i * 0.06 }} />
              <motion.rect x={ax} y={baseY - aH} width={barW} height={aH} rx={rx}
                fill={isOver ? "url(#mbcOver)" : "url(#mbcActual)"}
                initial={{ height: 0, y: baseY }} animate={{ height: aH, y: baseY - aH }}
                transition={{ duration: 0.4, delay: i * 0.06 + 0.05 }} />

              <text x={bx + barW / 2} y={baseY - bH - 3} textAnchor="middle" fill="rgba(147,197,253,0.85)" fontSize="6.5" fontWeight="600" className="font-mono">
                ${Math.round(d.budget)}
              </text>
              <text x={ax + barW / 2} y={baseY - aH - 3} textAnchor="middle" fill={isOver ? "rgba(252,165,165,0.85)" : "rgba(253,186,116,0.85)"} fontSize="6.5" fontWeight="600" className="font-mono">
                ${Math.round(d.actual)}
              </text>

              <text x={cx} y={H - 6} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6.5" className="font-mono">
                {catLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
