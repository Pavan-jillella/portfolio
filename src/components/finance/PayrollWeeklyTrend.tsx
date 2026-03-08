"use client";
import { useState } from "react";
import { WeeklyTrendEntry } from "@/types";
import { motion } from "framer-motion";

interface PayrollWeeklyTrendProps {
  data: WeeklyTrendEntry[];
}

export function PayrollWeeklyTrend({ data }: PayrollWeeklyTrendProps) {
  const [tooltip, setTooltip] = useState<{
    label: string;
    type: string;
    amount: number;
    x: number;
    y: number;
  } | null>(null);

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Weekly Trend</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No weekly data available</p>
      </div>
    );
  }

  const width = 520;
  const height = 220;
  const baseY = 180;
  const barArea = 140;
  const maxValue = Math.max(...data.map((d) => Math.max(d.gross, d.net)), 1);
  const groupW = width / data.length;
  const barW = Math.min(groupW * 0.3, 18);
  const barGap = 4;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Weekly Trend</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <svg width="12" height="8"><rect width="12" height="8" rx="3" fill="#60a5fa" /></svg>
            Gross
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <svg width="12" height="8"><rect width="12" height="8" rx="3" fill="#34d399" /></svg>
            Net
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-h-[240px]">
          <defs>
            <linearGradient id="pwtGross" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="pwtNet" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {[0, 25, 50, 75, 100].map((g, i) => {
            const y = baseY - (g / 100) * barArea;
            return (
              <line key={i} x1="0" x2={width} y1={y} y2={y} stroke="#1f2937" strokeWidth="0.6" opacity="0.4" />
            );
          })}

          {/* Bars */}
          {data.map((entry, i) => {
            const totalW = barW * 2 + barGap;
            const startX = i * groupW + (groupW - totalW) / 2;
            const gx = startX;
            const nx = startX + barW + barGap;
            const gH = (entry.gross / maxValue) * barArea;
            const nH = (entry.net / maxValue) * barArea;

            return (
              <g key={entry.week_label}>
                {/* Gross bar */}
                {entry.gross > 0 && (
                  <>
                    <motion.rect
                      x={gx} width={barW} rx="4"
                      initial={{ height: 0, y: baseY }}
                      animate={{ height: gH, y: baseY - gH }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                      fill="url(#pwtGross)"
                      style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.25))", cursor: "pointer" }}
                      onMouseEnter={() => setTooltip({ label: entry.week_label, type: "Gross", amount: entry.gross, x: gx, y: baseY - gH })}
                      onMouseLeave={() => setTooltip(null)}
                    />
                    <text x={gx + barW / 2} y={baseY - gH - 6} textAnchor="middle" fontSize="9" fill="#d1d5db">
                      ${Math.round(entry.gross)}
                    </text>
                  </>
                )}

                {/* Net bar */}
                {entry.net > 0 && (
                  <>
                    <motion.rect
                      x={nx} width={barW} rx="4"
                      initial={{ height: 0, y: baseY }}
                      animate={{ height: nH, y: baseY - nH }}
                      transition={{ duration: 0.6, delay: i * 0.08 + 0.05 }}
                      fill="url(#pwtNet)"
                      style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.25))", cursor: "pointer" }}
                      onMouseEnter={() => setTooltip({ label: entry.week_label, type: "Net", amount: entry.net, x: nx, y: baseY - nH })}
                      onMouseLeave={() => setTooltip(null)}
                    />
                    <text x={nx + barW / 2} y={baseY - nH - 6} textAnchor="middle" fontSize="9" fill="#d1d5db">
                      ${Math.round(entry.net)}
                    </text>
                  </>
                )}

                {/* Week label */}
                <text x={i * groupW + groupW / 2} y={200} textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="500">
                  {entry.week_label}
                </text>
              </g>
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
            <div className="font-semibold text-white">{tooltip.label}</div>
            <div className="text-gray-300">{tooltip.type}: ${tooltip.amount}</div>
          </div>
        )}
      </div>
    </div>
  );
}
