"use client";
import { useMemo } from "react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";

interface CategoryTrendChartProps {
  transactions: Transaction[];
}

const COLORS = [
  { base: "#3b82f6", light: "#60a5fa", label: "rgba(96,165,250,0.9)" },
  { base: "#8b5cf6", light: "#a78bfa", label: "rgba(167,139,250,0.9)" },
  { base: "#f97316", light: "#fb923c", label: "rgba(251,146,60,0.9)" },
  { base: "#10b981", light: "#34d399", label: "rgba(52,211,153,0.9)" },
  { base: "#eab308", light: "#facc15", label: "rgba(250,204,21,0.9)" },
];

export function CategoryTrendChart({ transactions }: CategoryTrendChartProps) {
  const { months, categories, data } = useMemo(() => {
    const now = new Date();
    const monthKeys: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthKeys.push(d.toISOString().slice(0, 7));
    }

    const catTotals = new Map<string, number>();
    transactions.filter((t) => t.type === "expense").forEach((t) => {
      catTotals.set(t.category, (catTotals.get(t.category) || 0) + t.amount);
    });
    const topCats = Array.from(catTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat]) => cat);

    const matrix: { month: string; values: { category: string; amount: number }[] }[] = monthKeys.map(
      (month) => {
        const monthTx = transactions.filter(
          (t) => t.type === "expense" && t.date.startsWith(month)
        );
        const values = topCats.map((cat) => ({
          category: cat,
          amount: monthTx.filter((t) => t.category === cat).reduce((s, t) => s + t.amount, 0),
        }));
        return { month, values };
      }
    );

    return { months: monthKeys, categories: topCats, data: matrix };
  }, [transactions]);

  const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const maxValue = Math.max(...data.flatMap((m) => m.values.map((v) => v.amount)), 1);

  if (categories.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Category Trends (6 Months)</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No expense data available</p>
      </div>
    );
  }

  const chartWidth = 700;
  const chartHeight = 280;
  const pt = 30, pb = 32, pl = 12, pr = 12;
  const dw = chartWidth - pl - pr;
  const dh = chartHeight - pt - pb;
  const groupW = dw / months.length;
  const catCount = categories.length;
  const barW = Math.max((groupW * 0.75) / catCount, 8);
  const groupPad = (groupW - barW * catCount) / 2;
  const pillRx = Math.min(barW / 2, 6);

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Category Trends (6 Months)</h4>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto" style={{ overflow: "visible" }}>
        <defs>
          {COLORS.map((c, idx) => (
            <linearGradient key={idx} id={`pillGrad-cat-${idx}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.light} stopOpacity={0.95} />
              <stop offset="100%" stopColor={c.base} stopOpacity={0.7} />
            </linearGradient>
          ))}
        </defs>

        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <line key={frac} x1={pl} y1={pt + dh - frac * dh} x2={chartWidth - pr} y2={pt + dh - frac * dh} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
        ))}

        {/* Bars */}
        {data.map((monthData, mi) =>
          monthData.values.map((v, ci) => {
            if (v.amount === 0) return null;
            const x = pl + mi * groupW + groupPad + ci * barW;
            const h = Math.max((v.amount / maxValue) * dh, 3);
            const y = pt + dh - h;

            return (
              <g key={`${mi}-${ci}`}>
                {/* Pill bar */}
                <motion.rect
                  x={x} y={y} width={barW} height={h}
                  rx={pillRx} fill={`url(#pillGrad-cat-${ci})`}
                  initial={{ height: 0, y: pt + dh }}
                  animate={{ height: h, y }}
                  transition={{ duration: 0.5, delay: mi * 0.06 + ci * 0.02 }}
                />
                {v.amount > 0 && (
                  <text x={x + barW / 2} y={y - 6} textAnchor="middle" fill={COLORS[ci % COLORS.length].label} fontSize="11" fontWeight="700" className="font-mono">
                    ${Math.round(v.amount)}
                  </text>
                )}
              </g>
            );
          })
        )}

        {/* Month labels */}
        {months.map((m, i) => {
          const idx = parseInt(m.split("-")[1]) - 1;
          return (
            <text
              key={m}
              x={pl + i * groupW + groupW / 2}
              y={chartHeight - 6}
              textAnchor="middle" fill="rgba(255,255,255,0.5)"
              fontSize="11" fontWeight="500" className="font-mono"
            >
              {SHORT_MONTHS[idx]}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 justify-center">
        {categories.map((cat, i) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length].base }} />
            <span className="font-mono text-[11px] text-white/60">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
