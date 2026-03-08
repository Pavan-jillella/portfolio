"use client";
import { motion } from "framer-motion";
import { getMonthLabel, formatCurrency } from "@/lib/finance-utils";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";

interface SavingsTrendChartProps {
  data: { month: string; savings: number }[];
}

export function SavingsTrendChart({ data }: SavingsTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display font-semibold text-lg text-white mb-4">Savings Trend</h3>
        <p className="font-body text-sm text-white/20 text-center py-8">No data yet</p>
      </div>
    );
  }

  const width = 400;
  const height = 200;
  const paddingX = 40;
  const paddingY = 30;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const values = data.map((d) => d.savings);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal || 1;

  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = paddingY + chartH - ((d.savings - minVal) / range) * chartH;
    return { x, y, ...d };
  });

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = [
    `${points[0].x},${paddingY + chartH}`,
    ...points.map((p) => `${p.x},${p.y}`),
    `${points[points.length - 1].x},${paddingY + chartH}`,
  ].join(" ");

  const zeroY = paddingY + chartH - ((0 - minVal) / range) * chartH;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-lg text-white mb-4">Savings Trend</h3>
      <Chart3DWrapper tiltX={8} tiltY={-4}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <filter id="savingsGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Zero line */}
        {minVal < 0 && (
          <line
            x1={paddingX}
            y1={zeroY}
            x2={paddingX + chartW}
            y2={zeroY}
            stroke="rgba(255,255,255,0.1)"
            strokeDasharray="4 4"
          />
        )}

        {/* Area fill */}
        <motion.polygon
          points={areaPoints}
          fill="url(#savingsGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Line */}
        <motion.polyline
          points={linePoints}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#savingsGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Data points + labels */}
        {points.map((p, i) => {
          const monthLabel = getMonthLabel(p.month).split(" ")[0].slice(0, 3);
          return (
            <g key={p.month}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill={p.savings >= 0 ? "#3b82f6" : "#ef4444"}
                style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              />
              <text
                x={p.x}
                y={paddingY + chartH + 16}
                textAnchor="middle"
                className="fill-white/30"
                fontSize="10"
                fontFamily="monospace"
              >
                {monthLabel}
              </text>
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                className={p.savings >= 0 ? "fill-blue-400" : "fill-red-400"}
                fontSize="11"
                fontFamily="monospace"
              >
                {formatCurrency(p.savings)}
              </text>
            </g>
          );
        })}
      </svg>
      </Chart3DWrapper>
    </div>
  );
}
