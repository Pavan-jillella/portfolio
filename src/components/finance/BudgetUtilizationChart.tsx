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

  const chartWidth = 500;
  const rowHeight = 32;
  const pt = 10, pb = 10, pl = 120, pr = 70;
  const chartHeight = pt + rows.length * rowHeight + pb;
  const barMaxW = chartWidth - pl - pr;

  const getColor = (pct: number) => {
    if (pct >= 90) return "#ef4444";
    if (pct >= 70) return "#eab308";
    return "#22c55e";
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Budget Utilization</h4>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
        {/* 100% line */}
        <line
          x1={pl + barMaxW} y1={pt}
          x2={pl + barMaxW} y2={pt + rows.length * rowHeight}
          stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="4 3"
        />
        <text
          x={pl + barMaxW} y={pt - 2}
          textAnchor="middle" fill="rgba(255,255,255,0.25)"
          fontSize="7" className="font-mono"
        >
          100%
        </text>

        {rows.map((row, i) => {
          const y = pt + i * rowHeight;
          const barH = rowHeight * 0.55;
          const barY = y + (rowHeight - barH) / 2;
          const clampedPct = Math.min(row.pct, 120);
          const barW = (clampedPct / 120) * barMaxW;
          const color = getColor(row.pct);

          return (
            <g key={row.category}>
              {/* Category label */}
              <text
                x={pl - 8} y={y + rowHeight / 2 + 3}
                textAnchor="end" fill="rgba(255,255,255,0.5)"
                fontSize="9" className="font-mono"
              >
                {row.category.length > 14 ? row.category.slice(0, 14) + "…" : row.category}
              </text>

              {/* Background track */}
              <rect
                x={pl} y={barY} width={barMaxW} height={barH}
                rx={3} fill="rgba(255,255,255,0.04)"
              />

              {/* Bar */}
              <motion.rect
                x={pl} y={barY} width={barW} height={barH}
                rx={3} fill={color} fillOpacity={0.7}
                initial={{ width: 0 }}
                animate={{ width: barW }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              />

              {/* Percentage + amount */}
              <text
                x={pl + barMaxW + 6} y={y + rowHeight / 2 + 3}
                textAnchor="start" fill={color}
                fontSize="8" className="font-mono"
              >
                {Math.round(row.pct)}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
