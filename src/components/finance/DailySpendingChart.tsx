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

  const W = 320, H = 140;
  const pt = 8, pb = 16, pl = 4, pr = 4;
  const dw = W - pl - pr;
  const dh = H - pt - pb;
  const step = dw / dailySpending.length;
  const barW = Math.max(step * 0.65, 3);
  const rx = Math.min(barW / 2, 3);
  const baseY = pt + dh;

  const top3 = new Set(
    [...dailySpending].sort((a, b) => b.amount - a.amount).slice(0, 3).map((d) => d.day)
  );

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Daily Spending</h4>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 180 }}>
        <defs>
          <linearGradient id="dsPill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f87171" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#dc2626" stopOpacity={0.65} />
          </linearGradient>
        </defs>

        {[0.5, 1].map((f) => (
          <line key={f} x1={pl} y1={baseY - f * dh} x2={W - pr} y2={baseY - f * dh} stroke="rgba(255,255,255,0.05)" strokeWidth={0.3} />
        ))}

        {dailySpending.map((d, i) => {
          if (d.amount === 0) return null;
          const x = pl + i * step + (step - barW) / 2;
          const h = Math.max((d.amount / maxValue) * dh, 1.5);
          const y = baseY - h;
          return (
            <g key={d.day}>
              <motion.rect x={x} y={y} width={barW} height={h} rx={rx} fill="url(#dsPill)"
                initial={{ height: 0, y: baseY }} animate={{ height: h, y }}
                transition={{ duration: 0.4, delay: i * 0.01 }} />
              {top3.has(d.day) && (
                <text x={x + barW / 2} y={y - 3} textAnchor="middle" fill="rgba(248,113,113,0.85)" fontSize="7" fontWeight="600" className="font-mono">
                  ${Math.round(d.amount)}
                </text>
              )}
            </g>
          );
        })}

        {dailySpending.map((d, i) => {
          if (d.day % 5 !== 0 && d.day !== 1) return null;
          return (
            <text key={`l-${d.day}`} x={pl + i * step + step / 2} y={H - 3} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="6" className="font-mono">
              {d.day}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
