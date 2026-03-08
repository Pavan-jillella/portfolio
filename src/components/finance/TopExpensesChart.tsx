"use client";
import { useMemo } from "react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";
import { CATEGORY_HEX_COLORS } from "@/lib/constants";

interface TopExpensesChartProps {
  transactions: Transaction[];
  selectedMonth: string;
}

export function TopExpensesChart({ transactions, selectedMonth }: TopExpensesChartProps) {
  const topExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(selectedMonth))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);
  }, [transactions, selectedMonth]);

  if (topExpenses.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Top Expenses</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No expenses this month</p>
      </div>
    );
  }

  const W = 320;
  const rowH = 26;
  const pt = 4, pb = 4, pl = 90, pr = 50;
  const H = pt + topExpenses.length * rowH + pb;
  const barMaxW = W - pl - pr;
  const maxAmount = topExpenses[0].amount;

  const uniqueColors = Array.from(new Set(topExpenses.map(t => CATEGORY_HEX_COLORS[t.category] || "#6b7280")));

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Top Expenses</h4>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: Math.min(topExpenses.length * 32 + 16, 260) }}>
        <defs>
          {uniqueColors.map((color) => (
            <linearGradient key={color} id={`tePill-${color.replace("#", "")}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={color} stopOpacity={0.45} />
            </linearGradient>
          ))}
        </defs>

        {topExpenses.map((t, i) => {
          const y = pt + i * rowH;
          const barH = rowH * 0.5;
          const barY = y + (rowH - barH) / 2;
          const barW = (t.amount / maxAmount) * barMaxW;
          const rx = barH / 2;
          const color = CATEGORY_HEX_COLORS[t.category] || "#6b7280";
          const label = t.description.length > 12 ? t.description.slice(0, 11) + "…" : t.description;

          return (
            <g key={`${t.id}-${i}`}>
              <text x={pl - 5} y={y + rowH / 2 + 2.5} textAnchor="end" fill="rgba(255,255,255,0.5)" fontSize="6.5" className="font-mono">
                {label}
              </text>
              <rect x={pl} y={barY} width={barMaxW} height={barH} rx={rx} fill="rgba(255,255,255,0.03)" />
              <motion.rect x={pl} y={barY} width={barW} height={barH} rx={rx}
                fill={`url(#tePill-${color.replace("#", "")})`}
                initial={{ width: 0 }} animate={{ width: barW }}
                transition={{ duration: 0.5, delay: i * 0.04 }} />
              <text x={pl + barMaxW + 5} y={y + rowH / 2 + 3} textAnchor="start" fill={color} fillOpacity={0.8} fontSize="7.5" fontWeight="600" className="font-mono">
                ${Math.round(t.amount)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
