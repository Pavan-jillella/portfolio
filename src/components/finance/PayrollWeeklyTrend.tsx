"use client";
import { WeeklyTrendEntry } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";

interface PayrollWeeklyTrendProps {
  data: WeeklyTrendEntry[];
}

export function PayrollWeeklyTrend({ data }: PayrollWeeklyTrendProps) {
  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Weekly Trend</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No weekly data available</p>
      </div>
    );
  }

  const chartWidth = 400;
  const chartHeight = 200;
  const paddingTop = 24;
  const paddingBottom = 30;
  const paddingLeft = 10;
  const paddingRight = 10;
  const drawableHeight = chartHeight - paddingTop - paddingBottom;
  const drawableWidth = chartWidth - paddingLeft - paddingRight;

  const maxValue = Math.max(...data.map((d) => Math.max(d.gross, d.net)), 1);

  const groupWidth = drawableWidth / data.length;
  const barWidth = groupWidth * 0.3;
  const barGap = groupWidth * 0.05;
  const pillRx = barWidth / 2;

  const scaleY = (value: number) => {
    return paddingTop + drawableHeight - (value / maxValue) * drawableHeight;
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Weekly Trend</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="font-mono text-[10px] text-white/50">Gross</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="font-mono text-[10px] text-white/50">Net</span>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
        <defs>
          <linearGradient id="pillGrad-pwt-gross" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.7} />
          </linearGradient>
          <linearGradient id="pillGrad-pwt-net" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity={0.95} />
            <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <line
            key={frac}
            x1={paddingLeft} y1={scaleY(frac * maxValue)}
            x2={chartWidth - paddingRight} y2={scaleY(frac * maxValue)}
            stroke="rgba(255,255,255,0.04)" strokeWidth={0.5}
          />
        ))}

        {/* Y-axis labels */}
        {[0, 0.5, 1].map((frac) => (
          <text
            key={`y-${frac}`}
            x={paddingLeft + 2}
            y={scaleY(frac * maxValue) - 4}
            fill="rgba(255,255,255,0.25)"
            fontSize="10"
            className="font-mono"
          >
            {formatCurrency(frac * maxValue)}
          </text>
        ))}

        {/* Bars */}
        {data.map((entry, i) => {
          const groupX = paddingLeft + i * groupWidth + groupWidth * 0.15;
          const grossHeight = (entry.gross / maxValue) * drawableHeight;
          const netHeight = (entry.net / maxValue) * drawableHeight;
          const baseY = paddingTop + drawableHeight;

          return (
            <g key={entry.week_label}>
              {/* Background tracks */}
              <rect x={groupX} y={paddingTop} width={barWidth} height={drawableHeight} rx={pillRx} fill="rgba(255,255,255,0.02)" />
              <rect x={groupX + barWidth + barGap} y={paddingTop} width={barWidth} height={drawableHeight} rx={pillRx} fill="rgba(255,255,255,0.02)" />

              {/* Gross pill bar */}
              <motion.rect
                x={groupX}
                y={baseY - grossHeight}
                width={barWidth}
                height={grossHeight}
                rx={pillRx}
                fill="url(#pillGrad-pwt-gross)"
                initial={{ height: 0, y: baseY }}
                animate={{ height: grossHeight, y: baseY - grossHeight }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              />

              {/* Net pill bar */}
              <motion.rect
                x={groupX + barWidth + barGap}
                y={baseY - netHeight}
                width={barWidth}
                height={netHeight}
                rx={pillRx}
                fill="url(#pillGrad-pwt-net)"
                initial={{ height: 0, y: baseY }}
                animate={{ height: netHeight, y: baseY - netHeight }}
                transition={{ duration: 0.6, delay: i * 0.08 + 0.1, ease: "easeOut" }}
              />

              {/* Gross value label */}
              {entry.gross > 0 && (
                <text
                  x={groupX + barWidth / 2}
                  y={baseY - grossHeight - 5}
                  textAnchor="middle"
                  fill="rgba(96,165,250,0.9)"
                  fontSize="12" fontWeight="600"
                  className="font-mono"
                >
                  {formatCurrency(entry.gross)}
                </text>
              )}

              {/* Net value label */}
              {entry.net > 0 && (
                <text
                  x={groupX + barWidth + barGap + barWidth / 2}
                  y={baseY - netHeight - 5}
                  textAnchor="middle"
                  fill="rgba(52,211,153,0.9)"
                  fontSize="12" fontWeight="600"
                  className="font-mono"
                >
                  {formatCurrency(entry.net)}
                </text>
              )}

              {/* Week label */}
              <text
                x={groupX + barWidth + barGap / 2}
                y={chartHeight - 6}
                textAnchor="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize="10"
                className="font-mono"
              >
                {entry.week_label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
