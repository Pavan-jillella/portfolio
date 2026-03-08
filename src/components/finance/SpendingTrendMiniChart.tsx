"use client";
import { useMemo } from "react";
import { Transaction, Budget } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";

interface SpendingTrendMiniChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function SpendingTrendMiniChart({ transactions, budgets }: SpendingTrendMiniChartProps) {
  const { data, budgetLine } = useMemo(() => {
    const now = new Date();
    const months: { month: string; spending: number; budgetTotal: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toISOString().slice(0, 7);
      const spending = transactions
        .filter((t) => t.type === "expense" && t.date.startsWith(key))
        .reduce((s, t) => s + t.amount, 0);
      const budgetTotal = budgets
        .filter((b) => b.month === key)
        .reduce((s, b) => s + b.monthly_limit, 0);
      months.push({ month: key, spending, budgetTotal });
    }

    const hasBudget = months.some((m) => m.budgetTotal > 0);
    return { data: months, budgetLine: hasBudget };
  }, [transactions, budgets]);

  const hasSpending = data.some((d) => d.spending > 0);

  if (!hasSpending) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Spending Trend (6 Months)</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No spending data available</p>
      </div>
    );
  }

  const chartWidth = 500;
  const chartHeight = 180;
  const pt = 20, pb = 30, pl = 50, pr = 15;
  const dw = chartWidth - pl - pr;
  const dh = chartHeight - pt - pb;

  const allValues = data.flatMap((d) => [d.spending, d.budgetTotal]);
  const maxValue = Math.max(...allValues, 1);

  const scaleX = (i: number) => {
    if (data.length <= 1) return pl + dw / 2;
    return pl + (i / (data.length - 1)) * dw;
  };
  const scaleY = (v: number) => pt + dh - (v / maxValue) * dh;

  const spendingPoints = data.map((d, i) => `${scaleX(i)},${scaleY(d.spending)}`).join(" ");
  const baseY = pt + dh;
  const areaPath = [
    `M ${scaleX(0)},${baseY}`,
    ...data.map((d, i) => `L ${scaleX(i)},${scaleY(d.spending)}`),
    `L ${scaleX(data.length - 1)},${baseY}`,
    "Z",
  ].join(" ");

  const budgetPoints = budgetLine
    ? data.map((d, i) => `${scaleX(i)},${scaleY(d.budgetTotal)}`).join(" ")
    : "";

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Spending Trend (6 Months)</h4>
      <Chart3DWrapper tiltX={6} tiltY={-3}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
            </linearGradient>
            <filter id="spendGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
            <line key={frac} x1={pl} y1={scaleY(frac * maxValue)} x2={chartWidth - pr} y2={scaleY(frac * maxValue)} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
          ))}

          {/* Y-axis */}
          {[0, 0.5, 1].map((frac) => (
            <text key={`y-${frac}`} x={pl - 6} y={scaleY(frac * maxValue) + 3} textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="10" className="font-mono">
              {formatCurrency(frac * maxValue)}
            </text>
          ))}

          {/* Area fill */}
          <motion.path d={areaPath} fill="url(#spendGradient)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />

          {/* Spending line */}
          <motion.polyline
            points={spendingPoints} fill="none" stroke="#f97316"
            strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
            filter="url(#spendGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Budget line (dashed) */}
          {budgetLine && budgetPoints && (
            <motion.polyline
              points={budgetPoints} fill="none" stroke="#3b82f6"
              strokeWidth={1.5} strokeDasharray="6 4"
              strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
          )}

          {/* Data points + labels */}
          {data.map((d, i) => (
            <g key={d.month}>
              <motion.circle
                cx={scaleX(i)} cy={scaleY(d.spending)} r={3}
                fill="#f97316"
                initial={{ opacity: 0, r: 0 }}
                animate={{ opacity: 1, r: 3 }}
                transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
              />
              {d.spending > 0 && (
                <text x={scaleX(i)} y={scaleY(d.spending) - 8} textAnchor="middle" fill="rgba(249,115,22,0.7)" fontSize="11" className="font-mono">
                  {formatCurrency(d.spending)}
                </text>
              )}
              <text x={scaleX(i)} y={chartHeight - 6} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10" className="font-mono">
                {SHORT_MONTHS[parseInt(d.month.split("-")[1]) - 1]}
              </text>
            </g>
          ))}
        </svg>
      </Chart3DWrapper>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="font-mono text-[10px] text-white/40">Spending</span>
        </div>
        {budgetLine && (
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0 border-t-2 border-dashed border-blue-500" />
            <span className="font-mono text-[10px] text-white/40">Budget</span>
          </div>
        )}
      </div>
    </div>
  );
}
