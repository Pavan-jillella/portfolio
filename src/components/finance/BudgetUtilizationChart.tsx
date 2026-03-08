"use client";
import { useMemo, useState } from "react";
import { Budget, MonthlySpending } from "@/types";
import { motion } from "framer-motion";

interface BudgetUtilizationChartProps {
  budgets: Budget[];
  spending: MonthlySpending[];
  selectedMonth: string;
}

export function BudgetUtilizationChart({ budgets, spending, selectedMonth }: BudgetUtilizationChartProps) {
  const [tooltip, setTooltip] = useState<{
    category: string;
    pct: number;
    spent: number;
    limit: number;
    x: number;
    y: number;
  } | null>(null);

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

  const width = 520;
  const rowH = 36;
  const pt = 10, pb = 10, pl = 130, pr = 80;
  const chartHeight = pt + rows.length * rowH + pb;
  const barMaxW = width - pl - pr;

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Budget Utilization</h4>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${chartHeight}`} className="w-full max-h-[280px]">
          <defs>
            <linearGradient id="buGreen" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="buYellow" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="buRed" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* 100% line */}
          <line x1={pl + barMaxW} y1={pt} x2={pl + barMaxW} y2={pt + rows.length * rowH} stroke="#374151" strokeWidth="1" strokeDasharray="4 3" />
          <text x={pl + barMaxW} y={pt - 3} textAnchor="middle" fill="#6b7280" fontSize="8">100%</text>

          {rows.map((row, i) => {
            const y = pt + i * rowH;
            const barH = rowH * 0.45;
            const barY = y + (rowH - barH) / 2;
            const clampedPct = Math.min(row.pct, 120);
            const barW = (clampedPct / 120) * barMaxW;
            const rx = barH / 2;
            const gradId = row.pct >= 90 ? "buRed" : row.pct >= 70 ? "buYellow" : "buGreen";
            const labelColor = row.pct >= 90 ? "#f87171" : row.pct >= 70 ? "#facc15" : "#34d399";

            return (
              <g key={row.category}>
                {/* Category label */}
                <text x={pl - 8} y={y + rowH / 2 + 3} textAnchor="end" fill="#9ca3af" fontSize="9">
                  {row.category.length > 14 ? row.category.slice(0, 13) + "…" : row.category}
                </text>

                {/* Track */}
                <rect x={pl} y={barY} width={barMaxW} height={barH} rx={rx} fill="#1f2937" opacity="0.5" />

                {/* Bar */}
                <motion.rect
                  x={pl} y={barY} width={barW} height={barH} rx={rx}
                  fill={`url(#${gradId})`}
                  initial={{ width: 0 }} animate={{ width: barW }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.25))", cursor: "pointer" }}
                  onMouseEnter={() => setTooltip({ category: row.category, pct: row.pct, spent: row.spent, limit: row.limit, x: pl + barW, y: barY })}
                  onMouseLeave={() => setTooltip(null)}
                />

                {/* Percentage */}
                <text x={pl + barMaxW + 8} y={y + rowH / 2 + 1} textAnchor="start" fill={labelColor} fontSize="10" fontWeight="600">
                  {Math.round(row.pct)}%
                </text>
                <text x={pl + barMaxW + 8} y={y + rowH / 2 + 12} textAnchor="start" fill="#6b7280" fontSize="8">
                  ${Math.round(row.spent)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute text-xs bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 shadow-lg pointer-events-none z-10"
            style={{
              left: `${(tooltip.x / width) * 100}%`,
              top: `${(tooltip.y / chartHeight) * 100}%`,
              transform: "translate(10px, -100%)",
            }}
          >
            <div className="font-semibold text-white">{tooltip.category}</div>
            <div className="text-gray-300">${tooltip.spent} / ${tooltip.limit}</div>
            <div className="text-gray-500">{Math.round(tooltip.pct)}% used</div>
          </div>
        )}
      </div>
    </div>
  );
}
