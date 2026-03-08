"use client";
import { useState } from "react";
import { MonthlySummary } from "@/types";
import { getMonthLabel } from "@/lib/finance-utils";
import { motion } from "framer-motion";

interface MonthlyTrendProps {
  trend: MonthlySummary[];
}

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function MonthlyTrend({ trend }: MonthlyTrendProps) {
  const [tooltip, setTooltip] = useState<{
    month: string;
    type: string;
    amount: number;
    x: number;
    y: number;
  } | null>(null);

  const maxValue = Math.max(...trend.flatMap((t) => [t.income, t.expenses]), 1);

  const width = 520;
  const height = 220;
  const baseY = 180;
  const barArea = 140;
  const groupW = width / trend.length;
  const barW = Math.min(groupW * 0.3, 18);
  const barGap = 4;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-lg text-white mb-6">Monthly Comparison</h3>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-h-[240px]">
          <defs>
            <linearGradient id="mtIncome" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="mtExpense" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
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
          {trend.map((month, i) => {
            const totalW = barW * 2 + barGap;
            const startX = i * groupW + (groupW - totalW) / 2;
            const ix = startX;
            const ex = startX + barW + barGap;
            const incH = (month.income / maxValue) * barArea;
            const expH = (month.expenses / maxValue) * barArea;
            const idx = parseInt(month.month.split("-")[1]) - 1;
            const shortLabel = SHORT_MONTHS[idx];

            return (
              <g key={month.month}>
                {/* Income bar */}
                {month.income > 0 && (
                  <>
                    <motion.rect
                      x={ix} width={barW} rx="4"
                      initial={{ height: 0, y: baseY }}
                      animate={{ height: incH, y: baseY - incH }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                      fill="url(#mtIncome)"
                      style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.25))", cursor: "pointer" }}
                      onMouseEnter={() => setTooltip({ month: shortLabel, type: "Income", amount: month.income, x: ix, y: baseY - incH })}
                      onMouseLeave={() => setTooltip(null)}
                    />
                    <text x={ix + barW / 2} y={baseY - incH - 6} textAnchor="middle" fontSize="9" fill="#d1d5db">
                      ${Math.round(month.income)}
                    </text>
                  </>
                )}

                {/* Expense bar */}
                {month.expenses > 0 && (
                  <>
                    <motion.rect
                      x={ex} width={barW} rx="4"
                      initial={{ height: 0, y: baseY }}
                      animate={{ height: expH, y: baseY - expH }}
                      transition={{ duration: 0.6, delay: i * 0.08 + 0.05 }}
                      fill="url(#mtExpense)"
                      style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.25))", cursor: "pointer" }}
                      onMouseEnter={() => setTooltip({ month: shortLabel, type: "Expenses", amount: month.expenses, x: ex, y: baseY - expH })}
                      onMouseLeave={() => setTooltip(null)}
                    />
                    <text x={ex + barW / 2} y={baseY - expH - 6} textAnchor="middle" fontSize="9" fill="#d1d5db">
                      ${Math.round(month.expenses)}
                    </text>
                  </>
                )}

                {/* Month label */}
                <text x={i * groupW + groupW / 2} y={200} textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="500">
                  {shortLabel}
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
            <div className="font-semibold text-white">{tooltip.month}</div>
            <div className="text-gray-300">{tooltip.type}: ${tooltip.amount}</div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 justify-center">
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <svg width="12" height="8"><rect width="12" height="8" rx="3" fill="#34d399" /></svg>
          Income
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <svg width="12" height="8"><rect width="12" height="8" rx="3" fill="#f87171" /></svg>
          Expenses
        </div>
      </div>
    </div>
  );
}
