"use client";
import { useMemo } from "react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";
import { lightenColor } from "@/lib/chart-3d-utils";
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
      .slice(0, 10);
  }, [transactions, selectedMonth]);

  if (topExpenses.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Top Expenses</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No expenses this month</p>
      </div>
    );
  }

  const chartWidth = 500;
  const rowHeight = 34;
  const pt = 10, pb = 10, pl = 140, pr = 80;
  const chartHeight = pt + topExpenses.length * rowHeight + pb;
  const barMaxW = chartWidth - pl - pr;
  const maxAmount = topExpenses[0].amount;

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Top Expenses</h4>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
        {topExpenses.map((t, i) => {
          const y = pt + i * rowHeight;
          const barH = rowHeight * 0.55;
          const barY = y + (rowHeight - barH) / 2;
          const barW = (t.amount / maxAmount) * barMaxW;
          const color = CATEGORY_HEX_COLORS[t.category] || "#6b7280";
          const label = t.description.length > 16 ? t.description.slice(0, 16) + "\u2026" : t.description;

          return (
            <g key={`${t.id}-${i}`}>
              {/* Description label on the left */}
              <text
                x={pl - 8} y={y + rowHeight / 2 + 3}
                textAnchor="end" fill="rgba(255,255,255,0.5)"
                fontSize="9" className="font-mono"
              >
                {label}
              </text>

              {/* Background track */}
              <rect
                x={pl} y={barY} width={barMaxW} height={barH}
                rx={3} fill="rgba(255,255,255,0.04)"
              />

              {/* Top edge highlight for subtle 3D */}
              <rect
                x={pl} y={barY} width={barW} height={2}
                rx={1} fill={lightenColor(color, 0.3)}
              />

              {/* Animated bar */}
              <motion.rect
                x={pl} y={barY + 2} width={barW} height={barH - 2}
                rx={2} fill={color} fillOpacity={0.7}
                initial={{ width: 0 }}
                animate={{ width: barW }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              />

              {/* Amount on the right */}
              <text
                x={pl + barMaxW + 8} y={y + rowHeight / 2 + 3}
                textAnchor="start" fill={color}
                fontSize="11" className="font-mono"
              >
                {formatCurrency(t.amount)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
