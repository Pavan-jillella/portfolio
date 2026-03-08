"use client";
import { useMemo, useState } from "react";
import { Transaction } from "@/types";
import { motion } from "framer-motion";

interface CategoryTrendChartProps {
  transactions: Transaction[];
}

const COLORS = [
  { start: "#60a5fa", end: "#3b82f6" },
  { start: "#a78bfa", end: "#8b5cf6" },
  { start: "#fb923c", end: "#f97316" },
  { start: "#34d399", end: "#10b981" },
  { start: "#facc15", end: "#eab308" },
];

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function CategoryTrendChart({ transactions }: CategoryTrendChartProps) {
  const [tooltip, setTooltip] = useState<{
    month: string;
    category: string;
    amount: number;
    x: number;
    y: number;
  } | null>(null);

  const { months, categories, data, maxValue } = useMemo(() => {
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

    const matrix = monthKeys.map((month) => {
      const monthTx = transactions.filter((t) => t.type === "expense" && t.date.startsWith(month));
      const values = topCats.map((cat) => ({
        category: cat,
        amount: monthTx.filter((t) => t.category === cat).reduce((s, t) => s + t.amount, 0),
      }));
      return { month, values };
    });

    const max = Math.max(...matrix.flatMap((m) => m.values.map((v) => v.amount)), 1);

    return { months: monthKeys, categories: topCats, data: matrix, maxValue: max };
  }, [transactions]);

  if (categories.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Category Trends (6 Months)</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No expense data available</p>
      </div>
    );
  }

  const width = 520;
  const height = 220;
  const baseY = 180;
  const barArea = 140;
  const groupW = width / data.length;

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Category Trends (6 Months)</h4>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-h-[240px]">
          <defs>
            {COLORS.map((c, i) => (
              <linearGradient key={i} id={`ctPill${i}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={c.start} />
                <stop offset="100%" stopColor={c.end} />
              </linearGradient>
            ))}
          </defs>

          {/* Grid */}
          {[0, 25, 50, 75, 100].map((g, i) => {
            const y = baseY - (g / 100) * barArea;
            return (
              <line key={i} x1="0" x2={width} y1={y} y2={y} stroke="#1f2937" strokeWidth="0.6" opacity="0.4" />
            );
          })}

          {/* Bars */}
          {data.map((group, monthIndex) => {
            const catCount = group.values.length;
            const barW = Math.min((groupW * 0.55) / catCount, 14);
            const barGap = 3;
            const totalBarsW = catCount * barW + (catCount - 1) * barGap;
            const startX = monthIndex * groupW + (groupW - totalBarsW) / 2;

            return group.values.map((v, catIndex) => {
              if (v.amount === 0) return null;
              const barHeight = (v.amount / maxValue) * barArea;
              const x = startX + catIndex * (barW + barGap);
              const isLastMonth = monthIndex === data.length - 1;

              return (
                <g key={`${monthIndex}-${catIndex}`}>
                  <motion.rect
                    x={x}
                    width={barW}
                    rx="4"
                    initial={{ height: 0, y: baseY }}
                    animate={{ height: barHeight, y: baseY - barHeight }}
                    transition={{ duration: 0.6, delay: monthIndex * 0.08 }}
                    fill={`url(#ctPill${catIndex})`}
                    stroke={isLastMonth ? "#ffffff30" : "none"}
                    strokeWidth={isLastMonth ? 0.7 : 0}
                    style={{
                      filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.25))",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() =>
                      setTooltip({
                        month: group.month,
                        category: v.category,
                        amount: v.amount,
                        x,
                        y: baseY - barHeight,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                  />

                  {isLastMonth && (
                    <text
                      x={x + barW / 2}
                      y={baseY - barHeight - 6}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#d1d5db"
                    >
                      ${Math.round(v.amount)}
                    </text>
                  )}
                </g>
              );
            });
          })}

          {/* Month labels */}
          {data.map((group, i) => {
            const idx = parseInt(group.month.split("-")[1]) - 1;
            return (
              <text
                key={i}
                x={i * groupW + groupW / 2}
                y={200}
                textAnchor="middle"
                fontSize="9"
                fill="#9ca3af"
                fontWeight="500"
              >
                {SHORT_MONTHS[idx]}
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
            <div className="font-semibold text-white">{tooltip.category}</div>
            <div className="text-gray-300">${tooltip.amount}</div>
            <div className="text-gray-500">{SHORT_MONTHS[parseInt(tooltip.month.split("-")[1]) - 1]}</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-2 justify-center">
        {categories.map((cat, i) => (
          <div key={cat} className="flex items-center gap-2 text-xs text-gray-300">
            <svg width="12" height="8">
              <rect width="12" height="8" rx="3" fill={COLORS[i % 5].start} />
            </svg>
            {cat}
          </div>
        ))}
      </div>
    </div>
  );
}
