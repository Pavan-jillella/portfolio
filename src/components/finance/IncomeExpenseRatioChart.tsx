"use client";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";
import { darkenColor } from "@/lib/chart-3d-utils";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";

interface IncomeExpenseRatioChartProps {
  income: number;
  expenses: number;
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

export function IncomeExpenseRatioChart({ income, expenses }: IncomeExpenseRatioChartProps) {
  const total = income + expenses;
  const net = income - expenses;

  if (total === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Income vs Expenses</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No data available</p>
      </div>
    );
  }

  const incomeAngle = (income / total) * 360;
  const cx = 120, cy = 120, r = 80, strokeW = 24;
  const depthOffset = 6;

  const segments = [
    { label: "Income", value: income, color: "#22c55e", start: 0, end: incomeAngle },
    { label: "Expenses", value: expenses, color: "#ef4444", start: incomeAngle, end: 360 },
  ].filter((s) => s.value > 0);

  return (
    <div className="glass-card rounded-2xl p-5">
      <h4 className="font-display font-semibold text-sm text-white mb-4">Income vs Expenses</h4>
      <Chart3DWrapper tiltX={10} tiltY={-3}>
        <svg viewBox="0 0 240 240" className="w-full max-w-[240px] mx-auto h-auto">
          {/* Depth ring */}
          {segments.map((seg, i) => (
            <path
              key={`depth-${i}`}
              d={describeArc(cx, cy + depthOffset, r, seg.start, seg.end - 0.5)}
              fill="none"
              stroke={darkenColor(seg.color, 0.4)}
              strokeWidth={strokeW}
              strokeLinecap="round"
            />
          ))}

          {/* Main ring */}
          {segments.map((seg, i) => (
            <motion.path
              key={`ring-${i}`}
              d={describeArc(cx, cy, r, seg.start, seg.end - 0.5)}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeW}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            />
          ))}

          {/* Center text */}
          <text x={cx} y={cy - 8} textAnchor="middle" fill={net >= 0 ? "#22c55e" : "#ef4444"} fontSize="16" className="font-mono font-bold">
            {formatCurrency(Math.abs(net))}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" className="font-mono">
            {net >= 0 ? "Net Savings" : "Net Deficit"}
          </text>
        </svg>
      </Chart3DWrapper>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="font-mono text-[10px] text-white/40">
              {seg.label}: {formatCurrency(seg.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
