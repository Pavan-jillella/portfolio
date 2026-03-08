"use client";
import { useMemo, useState } from "react";
import { Transaction } from "@/types";
import { motion } from "framer-motion";

interface DailySpendingChartProps {
  transactions: Transaction[];
  selectedMonth: string;
}

export function DailySpendingChart({ transactions, selectedMonth }: DailySpendingChartProps) {
  const [tooltip, setTooltip] = useState<{
    day: number;
    amount: number;
    x: number;
    y: number;
  } | null>(null);

  const dailySpending = useMemo(() => {
    const filtered = transactions.filter(
      (t) => t.type === "expense" && t.date.startsWith(selectedMonth)
    );
    const days = new Map<number, number>();
    filtered.forEach((t) => {
      const day = parseInt(t.date.split("-")[2]);
      days.set(day, (days.get(day) || 0) + t.amount);
    });
    const [y, m] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(y, m, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      amount: days.get(i + 1) || 0,
    }));
  }, [transactions, selectedMonth]);

  const maxValue = Math.max(...dailySpending.map((d) => d.amount), 1);
  const hasData = dailySpending.some((d) => d.amount > 0);

  if (!hasData) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Daily Spending</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No expenses this month</p>
      </div>
    );
  }

  const width = 520;
  const height = 220;
  const baseY = 180;
  const barArea = 140;
  const groupW = width / dailySpending.length;
  const barW = Math.min(groupW * 0.7, 14);

  const top5 = new Set(
    [...dailySpending].sort((a, b) => b.amount - a.amount).slice(0, 5).map((d) => d.day)
  );

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Daily Spending</h4>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-h-[240px]">
          <defs>
            <linearGradient id="dsPill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {[0, 25, 50, 75, 100].map((g, i) => {
            const y = baseY - (g / 100) * barArea;
            return (
              <line key={i} x1="0" x2={width} y1={y} y2={y} stroke="#1f2937" strokeWidth="0.6" opacity="0.4" />
            );
          })}

          {/* Bars */}
          {dailySpending.map((d, i) => {
            if (d.amount === 0) return null;
            const x = i * groupW + (groupW - barW) / 2;
            const barHeight = (d.amount / maxValue) * barArea;

            return (
              <g key={d.day}>
                <motion.rect
                  x={x}
                  width={barW}
                  rx="4"
                  initial={{ height: 0, y: baseY }}
                  animate={{ height: barHeight, y: baseY - barHeight }}
                  transition={{ duration: 0.5, delay: i * 0.015 }}
                  fill="url(#dsPill)"
                  style={{
                    filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.25))",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() =>
                    setTooltip({ day: d.day, amount: d.amount, x, y: baseY - barHeight })
                  }
                  onMouseLeave={() => setTooltip(null)}
                />
                {top5.has(d.day) && (
                  <text x={x + barW / 2} y={baseY - barHeight - 6} textAnchor="middle" fontSize="9" fill="#d1d5db">
                    ${Math.round(d.amount)}
                  </text>
                )}
              </g>
            );
          })}

          {/* Day labels */}
          {dailySpending.map((d, i) => {
            if (d.day % 5 !== 0 && d.day !== 1) return null;
            return (
              <text key={`l-${d.day}`} x={i * groupW + groupW / 2} y={200} textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="500">
                {d.day}
              </text>
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute text-xs bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 shadow-lg pointer-events-none z-10"
            style={{
              left: `${(tooltip.x / width) * 100}%`,
              top: `${(tooltip.y / height) * 100}%`,
              transform: "translate(10px, -100%)",
            }}
          >
            <div className="font-semibold text-white">Day {tooltip.day}</div>
            <div className="text-gray-300">${tooltip.amount}</div>
          </div>
        )}
      </div>
    </div>
  );
}
