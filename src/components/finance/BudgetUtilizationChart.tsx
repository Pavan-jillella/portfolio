"use client";
import { useMemo } from "react";
import { Budget, MonthlySpending } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";

interface BudgetUtilizationChartProps {
  budgets: Budget[];
  spending: MonthlySpending[];
  selectedMonth: string;
}

export function BudgetUtilizationChart({ budgets, spending, selectedMonth }: BudgetUtilizationChartProps) {
  const rows = useMemo(() => {
    const monthBudgets = budgets.filter((b) => b.month === selectedMonth);
    const spendMap = new Map(spending.map((s) => [s.category, s.total]));

    return monthBudgets
      .map((b) => {
        const spent = spendMap.get(b.category) || 0;
        const pct = b.monthly_limit > 0 ? (spent / b.monthly_limit) * 100 : 0;
        return { category: b.category, spent, limit: b.monthly_limit, pct };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [budgets, spending, selectedMonth]);

  if (rows.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Budget Utilization</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No budgets set for this month</p>
      </div>
    );
  }

  const W = 320;
  const rowH = 28;
  const pt = 6, pb = 4, pl = 80, pr = 50;
  const H = pt + rows.length * rowH + pb;
  const barMaxW = W - pl - pr;

  const getColor = (pct: number) => {
    if (pct >= 90) return { grad: "buRed", label: "rgba(252,165,165,0.85)" };
    if (pct >= 70) return { grad: "buYellow", label: "rgba(253,224,71,0.85)" };
    return { grad: "buGreen", label: "rgba(110,231,183,0.85)" };
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Budget Utilization</h4>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: Math.min(rows.length * 36 + 20, 220) }}>
        <defs>
          <linearGradient id="buGreen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#16a34a" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="buYellow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fde047" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#d97706" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="buRed" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fca5a5" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#dc2626" stopOpacity={0.6} />
          </linearGradient>
        </defs>

        {rows.map((row, i) => {
          const y = pt + i * rowH;
          const barH = rowH * 0.5;
          const barY = y + (rowH - barH) / 2;
          const clampedPct = Math.min(row.pct, 120);
          const barW = (clampedPct / 120) * barMaxW;
          const rx = barH / 2;
          const color = getColor(row.pct);

          return (
            <g key={row.category}>
              <text x={pl - 5} y={y + rowH / 2 + 3} textAnchor="end" fill="rgba(255,255,255,0.5)" fontSize="7" className="font-mono">
                {row.category.length > 11 ? row.category.slice(0, 10) + "…" : row.category}
              </text>
              <rect x={pl} y={barY} width={barMaxW} height={barH} rx={rx} fill="rgba(255,255,255,0.03)" />
              <motion.rect x={pl} y={barY} width={barW} height={barH} rx={rx}
                fill={`url(#${color.grad})`}
                initial={{ width: 0 }} animate={{ width: barW }}
                transition={{ duration: 0.5, delay: i * 0.04 }} />
              <text x={pl + barMaxW + 4} y={y + rowH / 2 + 1} textAnchor="start" fill={color.label} fontSize="7.5" fontWeight="600" className="font-mono">
                {Math.round(row.pct)}%
              </text>
              <text x={pl + barMaxW + 4} y={y + rowH / 2 + 9} textAnchor="start" fill="rgba(255,255,255,0.3)" fontSize="6" className="font-mono">
                ${Math.round(row.spent)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
