"use client";
import { useMemo, useState } from "react";
import { Transaction } from "@/types";
import { motion } from "framer-motion";
import { CATEGORY_HEX_COLORS } from "@/lib/constants";

interface TopExpensesChartProps {
  transactions: Transaction[];
  selectedMonth: string;
}

export function TopExpensesChart({ transactions, selectedMonth }: TopExpensesChartProps) {
  const [tooltip, setTooltip] = useState<{
    desc: string;
    category: string;
    amount: number;
    x: number;
    y: number;
  } | null>(null);

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

  const width = 520;
  const rowH = 34;
  const pt = 6, pb = 6, pl = 140, pr = 70;
  const chartHeight = pt + topExpenses.length * rowH + pb;
  const barMaxW = width - pl - pr;
  const maxAmount = topExpenses[0].amount;

  const uniqueColors = Array.from(new Set(topExpenses.map(t => CATEGORY_HEX_COLORS[t.category] || "#6b7280")));

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Top Expenses</h4>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${chartHeight}`} className="w-full max-h-[300px]">
          <defs>
            {uniqueColors.map((color) => (
              <linearGradient key={color} id={`tePill-${color.replace("#", "")}`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor={color} stopOpacity="0.5" />
              </linearGradient>
            ))}
          </defs>

          {topExpenses.map((t, i) => {
            const y = pt + i * rowH;
            const barH = rowH * 0.45;
            const barY = y + (rowH - barH) / 2;
            const barW = (t.amount / maxAmount) * barMaxW;
            const rx = barH / 2;
            const color = CATEGORY_HEX_COLORS[t.category] || "#6b7280";
            const label = t.description.length > 16 ? t.description.slice(0, 15) + "…" : t.description;

            return (
              <g key={`${t.id}-${i}`}>
                {/* Description label */}
                <text x={pl - 8} y={y + rowH / 2 + 3} textAnchor="end" fill="#9ca3af" fontSize="9">
                  {label}
                </text>

                {/* Track */}
                <rect x={pl} y={barY} width={barMaxW} height={barH} rx={rx} fill="#1f2937" opacity="0.5" />

                {/* Bar */}
                <motion.rect
                  x={pl} y={barY} width={barW} height={barH} rx={rx}
                  fill={`url(#tePill-${color.replace("#", "")})`}
                  initial={{ width: 0 }} animate={{ width: barW }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.25))", cursor: "pointer" }}
                  onMouseEnter={() => setTooltip({ desc: t.description, category: t.category, amount: t.amount, x: pl + barW, y: barY })}
                  onMouseLeave={() => setTooltip(null)}
                />

                {/* Amount */}
                <text x={pl + barMaxW + 8} y={y + rowH / 2 + 3} textAnchor="start" fill={color} fontSize="10" fontWeight="600">
                  ${Math.round(t.amount)}
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
            <div className="font-semibold text-white">{tooltip.desc}</div>
            <div className="text-gray-300">${tooltip.amount}</div>
            <div className="text-gray-500">{tooltip.category}</div>
          </div>
        )}
      </div>
    </div>
  );
}
