"use client";
import { useMemo } from "react";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { darkenColor } from "@/lib/chart-3d-utils";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";
import { CATEGORY_HEX_COLORS } from "@/lib/constants";
import { motion } from "framer-motion";

interface CategoryDonutChartProps {
  transactions: Transaction[];
  selectedMonth: string;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function CategoryDonutChart({ transactions, selectedMonth }: CategoryDonutChartProps) {
  const { segments, totalExpenses } = useMemo(() => {
    const expenses = transactions.filter(
      (t) => t.type === "expense" && t.date.startsWith(selectedMonth)
    );

    const categoryMap = new Map<string, number>();
    expenses.forEach((t) => {
      categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount);
    });

    const sorted = Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((s, [, v]) => s + v, 0);
    if (total === 0) return { segments: [], totalExpenses: 0 };

    // Top 8 categories, rest combined into "Other"
    const top8 = sorted.slice(0, 8);
    const rest = sorted.slice(8);
    const restTotal = rest.reduce((s, [, v]) => s + v, 0);
    const categories = restTotal > 0 ? [...top8, ["Other" as string, restTotal] as [string, number]] : top8;

    let cumulativeAngle = 0;
    const segs = categories.map(([category, amount]) => {
      const angle = (amount / total) * 360;
      const startAngle = cumulativeAngle;
      cumulativeAngle += angle;
      const percentage = (amount / total) * 100;
      return {
        category,
        amount,
        startAngle,
        endAngle: startAngle + angle,
        percentage,
      };
    });

    return { segments: segs, totalExpenses: total };
  }, [transactions, selectedMonth]);

  if (segments.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Category Breakdown</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No expenses this month</p>
      </div>
    );
  }

  const cx = 120, cy = 120, r = 80, strokeW = 24;
  const depthOffset = 5;

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Category Breakdown</h4>
      <div className="flex flex-col items-center gap-6">
        <Chart3DWrapper tiltX={10} tiltY={-3}>
          <svg viewBox="0 0 240 260" className="w-full max-w-[240px] mx-auto h-auto">
            {/* Depth ring */}
            {segments.map((seg, i) => {
              const color = CATEGORY_HEX_COLORS[seg.category] || "#6b7280";
              return (
                <path
                  key={`depth-${i}`}
                  d={describeArc(cx, cy + depthOffset, r, seg.startAngle, seg.endAngle - 0.5)}
                  fill="none"
                  stroke={darkenColor(color, 0.4)}
                  strokeWidth={strokeW}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Main ring */}
            {segments.map((seg, i) => {
              const color = CATEGORY_HEX_COLORS[seg.category] || "#6b7280";
              return (
                <motion.path
                  key={`ring-${i}`}
                  d={describeArc(cx, cy, r, seg.startAngle, seg.endAngle - 0.5)}
                  fill="none"
                  stroke={color}
                  strokeWidth={strokeW}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: i * 0.08 }}
                />
              );
            })}

            {/* Center text */}
            <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="18" className="font-mono font-bold">
              {formatCurrency(totalExpenses)}
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" className="font-mono">
              Expenses
            </text>
          </svg>
        </Chart3DWrapper>

        {/* Legend — 2-column grid */}
        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2">
          {segments.map((seg) => (
            <div key={seg.category} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_HEX_COLORS[seg.category] || "#6b7280" }}
              />
              <span className="font-body text-xs text-white/50 truncate">{seg.category}</span>
              <span className="font-mono text-xs text-white/30 ml-auto">{seg.percentage.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
