"use client";
import { useMemo } from "react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";

interface CategoryTrendChartProps {
  transactions: Transaction[];
}

const COLORS = [
  { base: "#3b82f6", light: "#93c5fd" },
  { base: "#8b5cf6", light: "#c4b5fd" },
  { base: "#f97316", light: "#fdba74" },
  { base: "#10b981", light: "#6ee7b7" },
  { base: "#eab308", light: "#fde047" },
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

    const matrix = monthKeys.map((month) => {
      const monthTx = transactions.filter((t) => t.type === "expense" && t.date.startsWith(month));
      const values = topCats.map((cat) => ({
        category: cat,
        amount: monthTx.filter((t) => t.category === cat).reduce((s, t) => s + t.amount, 0),
      }));
      return { month, values };
    });

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

  const W = 360, H = 160;
  const pt = 10, pb = 18, pl = 6, pr = 6;
  const dw = W - pl - pr;
  const dh = H - pt - pb;
  const groupW = dw / months.length;
  const catCount = categories.length;
  const barW = Math.min((groupW * 0.7) / catCount, 10);
  const totalBarsW = barW * catCount;
  const groupPad = (groupW - totalBarsW) / 2;
  const rx = Math.min(barW / 2, 3);
  const baseY = pt + dh;

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Category Trends (6 Months)</h4>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
        <defs>
          {COLORS.map((c, idx) => (
            <linearGradient key={idx} id={`ctPill${idx}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c.light} stopOpacity={0.85} />
              <stop offset="100%" stopColor={c.base} stopOpacity={0.65} />
            </linearGradient>
          ))}
        </defs>

        {[0.5, 1].map((f) => (
          <line key={f} x1={pl} y1={baseY - f * dh} x2={W - pr} y2={baseY - f * dh} stroke="rgba(255,255,255,0.05)" strokeWidth={0.3} />
        ))}

        {data.map((monthData, mi) =>
          monthData.values.map((v, ci) => {
            if (v.amount === 0) return null;
            const x = pl + mi * groupW + groupPad + ci * barW;
            const h = Math.max((v.amount / maxValue) * dh, 2);
            const y = baseY - h;
            return (
              <motion.rect key={`${mi}-${ci}`} x={x} y={y} width={barW} height={h} rx={rx}
                fill={`url(#ctPill${ci})`}
                initial={{ height: 0, y: baseY }} animate={{ height: h, y }}
                transition={{ duration: 0.4, delay: mi * 0.04 + ci * 0.01 }} />
            );
          })
        )}

        {/* Show value on last month's bars only */}
        {data[data.length - 1]?.values.map((v, ci) => {
          if (v.amount === 0) return null;
          const mi = data.length - 1;
          const x = pl + mi * groupW + groupPad + ci * barW + barW / 2;
          const h = (v.amount / maxValue) * dh;
          return (
            <text key={`lbl-${ci}`} x={x} y={baseY - h - 3} textAnchor="middle" fill={COLORS[ci % 5].light} fontSize="6.5" fontWeight="600" className="font-mono">
              ${Math.round(v.amount)}
            </text>
          );
        })}

        {months.map((m, i) => (
          <text key={m} x={pl + i * groupW + groupW / 2} y={H - 4} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" className="font-mono">
            {SHORT_MONTHS[parseInt(m.split("-")[1]) - 1]}
          </text>
        ))}
      </svg>

      <div className="flex flex-wrap items-center gap-3 mt-3 justify-center">
        {categories.map((cat, i) => (
          <div key={cat} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % 5].base }} />
            <span className="font-mono text-[9px] text-white/50">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
