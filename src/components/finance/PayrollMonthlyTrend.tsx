"use client";
import { MonthlyTrendEntry } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";

interface PayrollMonthlyTrendProps {
  data: MonthlyTrendEntry[];
}

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthLabel(month: string): string {
  const parts = month.split("-");
  if (parts.length < 2) return month;
  const idx = parseInt(parts[1], 10) - 1;
  return SHORT_MONTHS[idx] || month;
}

export function PayrollMonthlyTrend({ data }: PayrollMonthlyTrendProps) {
  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Monthly Trend</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No monthly data available</p>
      </div>
    );
  }

  const chartWidth = 600;
  const chartHeight = 200;
  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 50;
  const paddingRight = 20;
  const drawableWidth = chartWidth - paddingLeft - paddingRight;
  const drawableHeight = chartHeight - paddingTop - paddingBottom;

  const maxValue = Math.max(...data.map((d) => Math.max(d.gross, d.net)), 1);

  const scaleX = (i: number) => {
    if (data.length <= 1) return paddingLeft + drawableWidth / 2;
    return paddingLeft + (i / (data.length - 1)) * drawableWidth;
  };

  const scaleY = (value: number) => {
    return paddingTop + drawableHeight - (value / maxValue) * drawableHeight;
  };

  // Build polyline points
  const grossPoints = data.map((d, i) => `${scaleX(i)},${scaleY(d.gross)}`).join(" ");
  const netPoints = data.map((d, i) => `${scaleX(i)},${scaleY(d.net)}`).join(" ");

  // Gradient fill path for gross (area under line)
  const baseY = paddingTop + drawableHeight;
  const grossAreaPath = [
    `M ${scaleX(0)},${baseY}`,
    ...data.map((d, i) => `L ${scaleX(i)},${scaleY(d.gross)}`),
    `L ${scaleX(data.length - 1)},${baseY}`,
    "Z",
  ].join(" ");

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Monthly Trend</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-mono text-[10px] text-white/40">Gross</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-[10px] text-white/40">Net</span>
          </div>
        </div>
      </div>

      <Chart3DWrapper tiltX={8} tiltY={-4}>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
        <defs>
          <linearGradient id="grossGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
          </linearGradient>
          <filter id="payrollTrendGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
          const y = scaleY(frac * maxValue);
          return (
            <line
              key={frac}
              x1={paddingLeft}
              y1={y}
              x2={chartWidth - paddingRight}
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={0.5}
            />
          );
        })}

        {/* Y-axis labels */}
        {[0, 0.5, 1].map((frac) => (
          <text
            key={`y-${frac}`}
            x={paddingLeft - 6}
            y={scaleY(frac * maxValue) + 3}
            textAnchor="end"
            fill="rgba(255,255,255,0.2)"
            fontSize="8"
            className="font-mono"
          >
            {formatCurrency(frac * maxValue)}
          </text>
        ))}

        {/* Gradient fill under gross line */}
        <motion.path
          d={grossAreaPath}
          fill="url(#grossGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        {/* Gross line */}
        <motion.polyline
          points={grossPoints}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#payrollTrendGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />

        {/* Net line */}
        <motion.polyline
          points={netPoints}
          fill="none"
          stroke="#10b981"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#payrollTrendGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        />

        {/* Data points and labels */}
        {data.map((d, i) => (
          <g key={d.month}>
            {/* Gross dot */}
            <motion.circle
              cx={scaleX(i)}
              cy={scaleY(d.gross)}
              r={3}
              fill="#3b82f6"
              style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))" }}
              initial={{ opacity: 0, r: 0 }}
              animate={{ opacity: 1, r: 3 }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.1 }}
            />

            {/* Net dot */}
            <motion.circle
              cx={scaleX(i)}
              cy={scaleY(d.net)}
              r={3}
              fill="#10b981"
              style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))" }}
              initial={{ opacity: 0, r: 0 }}
              animate={{ opacity: 1, r: 3 }}
              transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
            />

            {/* Gross value label */}
            {d.gross > 0 && (
              <text
                x={scaleX(i)}
                y={scaleY(d.gross) - 8}
                textAnchor="middle"
                fill="rgba(59,130,246,0.7)"
                fontSize="9"
                className="font-mono"
              >
                {formatCurrency(d.gross)}
              </text>
            )}

            {/* Net value label */}
            {d.net > 0 && (
              <text
                x={scaleX(i)}
                y={scaleY(d.net) + 14}
                textAnchor="middle"
                fill="rgba(16,185,129,0.7)"
                fontSize="9"
                className="font-mono"
              >
                {formatCurrency(d.net)}
              </text>
            )}

            {/* Month label */}
            <text
              x={scaleX(i)}
              y={chartHeight - 6}
              textAnchor="middle"
              fill="rgba(255,255,255,0.35)"
              fontSize="9"
              className="font-mono"
            >
              {monthLabel(d.month)}
            </text>
          </g>
        ))}
      </svg>
      </Chart3DWrapper>
    </div>
  );
}
