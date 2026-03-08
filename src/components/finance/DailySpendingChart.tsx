"use client";
import { useMemo } from "react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";
import { bar3DPaths, darkenColor, lightenColor } from "@/lib/chart-3d-utils";

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

  const chartWidth = 600;
  const chartHeight = 200;
  const pt = 28, pb = 28, pl = 10, pr = 10;
  const dw = chartWidth - pl - pr;
  const dh = chartHeight - pt - pb;
  const barW = (dw / dailySpending.length) * 0.7;
  const gap = (dw / dailySpending.length) * 0.3;

  const scaleY = (v: number) => pt + dh - (v / maxValue) * dh;

  // Top 5 spending days for labels
  const topDays = new Set(
    [...dailySpending].sort((a, b) => b.amount - a.amount).slice(0, 5).map((d) => d.day)
  );

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Daily Spending</h4>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
        {/* Gradient defs + glow filter */}
        <defs>
          <linearGradient id="barGrad-daily" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lightenColor("#ef4444", 0.3)} />
            <stop offset="100%" stopColor={darkenColor("#ef4444", 0.2)} />
          </linearGradient>
          <filter id="barGlow-daily">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <line
            key={frac}
            x1={pl} y1={scaleY(frac * maxValue)}
            x2={chartWidth - pr} y2={scaleY(frac * maxValue)}
            stroke="rgba(255,255,255,0.05)" strokeWidth={0.5}
          />
        ))}

        {/* Bars */}
        {dailySpending.map((d, i) => {
          if (d.amount === 0) return null;
          const x = pl + i * (barW + gap);
          const h = (d.amount / maxValue) * dh;
          const y = pt + dh - h;
          const { rightFace, topFace } = bar3DPaths(x, y, barW, h, 8, -8);

          return (
            <g key={d.day}>
              <path d={rightFace} fill={darkenColor("#ef4444", 0.6)} />
              <path d={topFace} fill={lightenColor("#ef4444", 0.2)} />
              <motion.rect
                x={x} y={y} width={barW} height={h}
                rx={6} fill="url(#barGrad-daily)" fillOpacity={0.9}
                stroke="#ef4444" strokeWidth={0.5} strokeOpacity={0.4}
                filter="url(#barGlow-daily)"
                initial={{ height: 0, y: pt + dh }}
                animate={{ height: h, y }}
                transition={{ duration: 0.5, delay: i * 0.02 }}
              />
              {/* Inner highlight stripe */}
              <rect x={x} y={y} width={2} height={h} rx={1} fill={lightenColor("#ef4444", 0.5)} fillOpacity={0.4} />
              {/* Dot cap */}
              <circle cx={x + barW / 2} cy={y} r={2.5} fill={lightenColor("#ef4444", 0.4)} />
              {topDays.has(d.day) && (
                <text
                  x={x + barW / 2} y={y - 4}
                  textAnchor="middle" fill="rgba(239,68,68,0.8)"
                  fontSize="11" className="font-mono"
                >
                  {formatCurrency(d.amount)}
                </text>
              )}
            </g>
          );
        })}

        {/* X-axis day labels */}
        {dailySpending.map((d, i) => {
          if (d.day % 5 !== 0 && d.day !== 1) return null;
          return (
            <text
              key={`x-${d.day}`}
              x={pl + i * (barW + gap) + barW / 2}
              y={chartHeight - 6}
              textAnchor="middle" fill="rgba(255,255,255,0.35)"
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
