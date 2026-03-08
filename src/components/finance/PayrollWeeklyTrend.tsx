"use client";
import { WeeklyTrendEntry } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";
import { bar3DPaths, darkenColor, lightenColor } from "@/lib/chart-3d-utils";

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
  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 10;
  const paddingRight = 10;
  const drawableHeight = chartHeight - paddingTop - paddingBottom;
  const drawableWidth = chartWidth - paddingLeft - paddingRight;

  const maxValue = Math.max(...data.map((d) => Math.max(d.gross, d.net)), 1);

  // Spacing for side-by-side bars
  const groupWidth = drawableWidth / data.length;
  const barWidth = groupWidth * 0.3;
  const barGap = groupWidth * 0.05;

  const scaleY = (value: number) => {
    return paddingTop + drawableHeight - (value / maxValue) * drawableHeight;
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Weekly Trend</h4>
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

      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
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
            x={paddingLeft + 2}
            y={scaleY(frac * maxValue) - 4}
            fill="rgba(255,255,255,0.2)"
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
              {/* 3D extrusion faces for gross bar */}
              {(() => {
                const { rightFace, topFace } = bar3DPaths(groupX, baseY - grossHeight, barWidth, grossHeight, 6, -6);
                return (
                  <>
                    <path d={rightFace} fill={darkenColor("#3b82f6", 0.6)} />
                    <path d={topFace} fill={lightenColor("#3b82f6", 0.2)} />
                  </>
                );
              })()}
              {/* Gross bar */}
              <motion.rect
                x={groupX}
                y={baseY - grossHeight}
                width={barWidth}
                height={grossHeight}
                rx={2}
                fill="#3b82f6"
                fillOpacity={0.8}
                initial={{ height: 0, y: baseY }}
                animate={{ height: grossHeight, y: baseY - grossHeight }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              />

              {/* 3D extrusion faces for net bar */}
              {(() => {
                const { rightFace, topFace } = bar3DPaths(groupX + barWidth + barGap, baseY - netHeight, barWidth, netHeight, 6, -6);
                return (
                  <>
                    <path d={rightFace} fill={darkenColor("#10b981", 0.6)} />
                    <path d={topFace} fill={lightenColor("#10b981", 0.2)} />
                  </>
                );
              })()}
              {/* Net bar */}
              <motion.rect
                x={groupX + barWidth + barGap}
                y={baseY - netHeight}
                width={barWidth}
                height={netHeight}
                rx={2}
                fill="#10b981"
                fillOpacity={0.8}
                initial={{ height: 0, y: baseY }}
                animate={{ height: netHeight, y: baseY - netHeight }}
                transition={{ duration: 0.6, delay: i * 0.08 + 0.1, ease: "easeOut" }}
              />

              {/* Gross value label */}
              {entry.gross > 0 && (
                <text
                  x={groupX + barWidth / 2}
                  y={baseY - grossHeight - 4}
                  textAnchor="middle"
                  fill="rgba(59,130,246,0.7)"
                  fontSize="11"
                  className="font-mono"
                >
                  {formatCurrency(entry.gross)}
                </text>
              )}

              {/* Net value label */}
              {entry.net > 0 && (
                <text
                  x={groupX + barWidth + barGap + barWidth / 2}
                  y={baseY - netHeight - 4}
                  textAnchor="middle"
                  fill="rgba(16,185,129,0.7)"
                  fontSize="11"
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
                fill="rgba(255,255,255,0.35)"
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
