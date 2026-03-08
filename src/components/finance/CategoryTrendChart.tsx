"use client";
import { useMemo } from "react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";
import { bar3DPaths, darkenColor, lightenColor } from "@/lib/chart-3d-utils";

interface CategoryTrendChartProps {
  transactions: Transaction[];
}

const COLORS = ["#3b82f6", "#8b5cf6", "#f97316", "#10b981", "#eab308"];

export function CategoryTrendChart({ transactions }: CategoryTrendChartProps) {
  const { months, categories, data } = useMemo(() => {
    const now = new Date();
    const monthKeys: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthKeys.push(d.toISOString().slice(0, 7));
    }

    // Get top 5 expense categories across all time
    const catTotals = new Map<string, number>();
    transactions.filter((t) => t.type === "expense").forEach((t) => {
      catTotals.set(t.category, (catTotals.get(t.category) || 0) + t.amount);
    });
    const topCats = Array.from(catTotals.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat]) => cat);

    // Build month x category matrix
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

  const chartWidth = 600;
  const chartHeight = 220;
  const pt = 15, pb = 40, pl = 10, pr = 10;
  const dw = chartWidth - pl - pr;
  const dh = chartHeight - pt - pb;
  const groupW = dw / months.length;
  const catCount = categories.length;
  const barW = (groupW * 0.7) / catCount;
  const groupPad = groupW * 0.15;

  const scaleY = (v: number) => pt + dh - (v / maxValue) * dh;

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Category Trends (6 Months)</h4>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <line key={frac} x1={pl} y1={scaleY(frac * maxValue)} x2={chartWidth - pr} y2={scaleY(frac * maxValue)} stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
        ))}

        {/* Bars */}
        {data.map((monthData, mi) =>
          monthData.values.map((v, ci) => {
            if (v.amount === 0) return null;
            const x = pl + mi * groupW + groupPad + ci * barW;
            const h = (v.amount / maxValue) * dh;
            const y = pt + dh - h;
            const color = COLORS[ci % COLORS.length];
            const { rightFace, topFace } = bar3DPaths(x, y, barW, h, 6, -6);

            return (
              <g key={`${mi}-${ci}`}>
                <path d={rightFace} fill={darkenColor(color, 0.6)} />
                <path d={topFace} fill={lightenColor(color, 0.2)} />
                <motion.rect
                  x={x} y={y} width={barW} height={h}
                  rx={1} fill={color} fillOpacity={0.8}
                  initial={{ height: 0, y: pt + dh }}
                  animate={{ height: h, y }}
                  transition={{ duration: 0.5, delay: mi * 0.06 + ci * 0.02 }}
                />
                {(mi === 0 || mi === data.length - 1) && v.amount > 0 && (
                <text x={x + barW / 2} y={y - 3} textAnchor="middle" fill={`${color}cc`} fontSize="9" className="font-mono">
                  {formatCurrency(v.amount)}
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
              y={chartHeight - pb + 14}
              textAnchor="middle" fill="rgba(255,255,255,0.4)"
              fontSize="10" className="font-mono"
            >
              {SHORT_MONTHS[idx]}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 mt-3 justify-center">
        {categories.map((cat, i) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="font-mono text-[10px] text-white/40">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
