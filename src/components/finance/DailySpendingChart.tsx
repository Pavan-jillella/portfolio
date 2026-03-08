"use client";
import { useMemo } from "react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";

interface DailySpendingChartProps {
  transactions: Transaction[];
  selectedMonth: string;
}

export function DailySpendingChart({ transactions, selectedMonth }: DailySpendingChartProps) {
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

  const chartWidth = 700;
  const chartHeight = 240;
  const pt = 30, pb = 28, pl = 8, pr = 8;
  const dw = chartWidth - pl - pr;
  const dh = chartHeight - pt - pb;
  const step = dw / dailySpending.length;
  const barW = Math.max(step * 0.7, 6);
  const pillRx = Math.min(barW / 2, 5);

  // Top 7 spending days for labels
  const topDays = new Set(
    [...dailySpending].sort((a, b) => b.amount - a.amount).slice(0, 7).map((d) => d.day)
  );

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Daily Spending</h4>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="pillGrad-daily" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f87171" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#dc2626" stopOpacity={0.7} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = pt + dh - (frac * dh);
          return (
            <line
              key={frac}
              x1={pl} y1={y}
              x2={chartWidth - pr} y2={y}
              stroke="rgba(255,255,255,0.04)" strokeWidth={0.5}
            />
          );
        })}

        {/* Bars */}
        {dailySpending.map((d, i) => {
          if (d.amount === 0) return null;
          const x = pl + i * step + (step - barW) / 2;
          const h = Math.max((d.amount / maxValue) * dh, 2);
          const y = pt + dh - h;

          return (
            <g key={d.day}>
              {/* Pill bar */}
              <motion.rect
                x={x} y={y} width={barW} height={h}
                rx={pillRx} fill="url(#pillGrad-daily)"
                initial={{ height: 0, y: pt + dh }}
                animate={{ height: h, y }}
                transition={{ duration: 0.5, delay: i * 0.015 }}
              />
              {topDays.has(d.day) && (
                <text
                  x={x + barW / 2} y={y - 6}
                  textAnchor="middle" fill="rgba(248,113,113,0.95)"
                  fontSize="11" fontWeight="700" className="font-mono"
                >
                  {formatCurrency(d.amount)}
                </text>
              )}
            </g>
          );
        })}

        {/* X-axis day labels - every 3rd day for readability */}
        {dailySpending.map((d, i) => {
          if (d.day % 3 !== 1 && d.day !== 1) return null;
          return (
            <text
              key={`x-${d.day}`}
              x={pl + i * step + step / 2}
              y={chartHeight - 6}
              textAnchor="middle" fill="rgba(255,255,255,0.45)"
              fontSize="10" className="font-mono"
            >
              {d.day}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
