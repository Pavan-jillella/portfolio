"use client";
import { useMemo } from "react";
import { Budget, MonthlySpending } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { darkenColor } from "@/lib/chart-3d-utils";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";
import { CATEGORY_HEX_COLORS } from "@/lib/constants";
import { motion } from "framer-motion";

interface BudgetOverviewDonutProps {
  budgets: Budget[];
  spending: MonthlySpending[];
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

export function BudgetOverviewDonut({ budgets, spending, selectedMonth }: BudgetOverviewDonutProps) {
  const segments = useMemo(() => {
    const monthBudgets = budgets.filter((b) => b.month === selectedMonth);
    if (monthBudgets.length === 0) return [];

    const totalBudget = monthBudgets.reduce((s, b) => s + b.monthly_limit, 0);
    if (totalBudget === 0) return [];

    let cumulativeAngle = 0;
    return monthBudgets.map((b) => {
      const angle = (b.monthly_limit / totalBudget) * 360;
      const startAngle = cumulativeAngle;
      cumulativeAngle += angle;
      const percentage = (b.monthly_limit / totalBudget) * 100;
      return {
        category: b.category,
        amount: b.monthly_limit,
        startAngle,
        endAngle: startAngle + angle,
        percentage,
      };
    });
  }, [budgets, selectedMonth]);

  const totalBudget = useMemo(() => {
    return budgets
      .filter((b) => b.month === selectedMonth)
      .reduce((s, b) => s + b.monthly_limit, 0);
  }, [budgets, selectedMonth]);

  if (segments.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Budget Overview</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No budgets set for this month</p>
      </div>
    );
  }

  const cx = 120, cy = 120, r = 80, strokeW = 24;
  const depthOffset = 5;

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Budget Overview</h4>
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
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              );
            })}

            {/* Center text */}
            <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="18" className="font-mono font-bold">
              {formatCurrency(totalBudget)}
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" className="font-mono">
              Total Budget
            </text>
          </svg>
        </Chart3DWrapper>

        {/* Legend */}
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
