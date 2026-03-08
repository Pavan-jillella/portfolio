"use client";
import { useMemo, useState } from "react";
import { Budget, Transaction } from "@/types";
import { motion } from "framer-motion";

interface MonthlyBudgetComparisonChartProps {
  budgets: Budget[];
  transactions: Transaction[];
  selectedMonth: string;
}

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function MonthlyBudgetComparisonChart({ budgets, transactions, selectedMonth }: MonthlyBudgetComparisonChartProps) {
  const [tooltip, setTooltip] = useState<{
    label: string;
    type: string;
    amount: number;
    x: number;
    y: number;
  } | null>(null);

  const data = useMemo(() => {
    const monthBudgets = budgets.filter((b) => b.month === selectedMonth);
    if (monthBudgets.length === 0) return [];

    const expenses = transactions.filter(
      (t) => t.type === "expense" && t.date.startsWith(selectedMonth)
    );
    const spendMap = new Map<string, number>();
    expenses.forEach((t) => {
      spendMap.set(t.category, (spendMap.get(t.category) || 0) + t.amount);
    });

    return monthBudgets.map((b) => ({
      category: b.category,
      budget: b.monthly_limit,
      actual: spendMap.get(b.category) || 0,
    }));
  }, [budgets, transactions, selectedMonth]);

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-4">Budget vs Actual</h4>
        <p className="font-body text-sm text-white/30 py-8 text-center">No budgets set for this month</p>
      </div>
    );
  }

  const width = 520;
  const height = 220;
  const baseY = 180;
  const barArea = 140;
  const maxValue = Math.max(...data.flatMap((d) => [d.budget, d.actual]), 1);
  const groupW = width / data.length;
  const barW = Math.min(groupW * 0.28, 18);
  const barGap = 4;

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Budget vs Actual</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <svg width="12" height="8"><rect width="12" height="8" rx="3" fill="#60a5fa" /></svg>
            Budget
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <svg width="12" height="8"><rect width="12" height="8" rx="3" fill="#fb923c" /></svg>
            Actual
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-h-[240px]">
          <defs>
            <linearGradient id="mbcBudget" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="mbcActual" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="mbcOver" x1="0" x2="0" y1="0" y2="1">
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
          {data.map((d, i) => {
            const totalW = barW * 2 + barGap;
            const startX = i * groupW + (groupW - totalW) / 2;
            const bx = startX;
            const ax = startX + barW + barGap;
            const bH = (d.budget / maxValue) * barArea;
            const aH = (d.actual / maxValue) * barArea;
            const isOver = d.actual > d.budget;
            const catLabel = d.category.length > 8 ? d.category.slice(0, 7) + "…" : d.category;

            return (
              <g key={d.category}>
                {/* Budget bar */}
                <motion.rect
                  x={bx} width={barW} rx="4"
                  initial={{ height: 0, y: baseY }}
                  animate={{ height: bH, y: baseY - bH }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  fill="url(#mbcBudget)"
                  style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.25))", cursor: "pointer" }}
                  onMouseEnter={() => setTooltip({ label: d.category, type: "Budget", amount: d.budget, x: bx, y: baseY - bH })}
                  onMouseLeave={() => setTooltip(null)}
                />
                <text x={bx + barW / 2} y={baseY - bH - 6} textAnchor="middle" fontSize="9" fill="#d1d5db">
                  ${Math.round(d.budget)}
                </text>

                {/* Actual bar */}
                <motion.rect
                  x={ax} width={barW} rx="4"
                  initial={{ height: 0, y: baseY }}
                  animate={{ height: aH, y: baseY - aH }}
                  transition={{ duration: 0.6, delay: i * 0.08 + 0.05 }}
                  fill={isOver ? "url(#mbcOver)" : "url(#mbcActual)"}
                  stroke={isOver ? "#ffffff30" : "none"}
                  strokeWidth={isOver ? 0.7 : 0}
                  style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.25))", cursor: "pointer" }}
                  onMouseEnter={() => setTooltip({ label: d.category, type: "Actual", amount: d.actual, x: ax, y: baseY - aH })}
                  onMouseLeave={() => setTooltip(null)}
                />
                <text x={ax + barW / 2} y={baseY - aH - 6} textAnchor="middle" fontSize="9" fill={isOver ? "#fca5a5" : "#d1d5db"}>
                  ${Math.round(d.actual)}
                </text>

                {/* Category label */}
                <text x={i * groupW + groupW / 2} y={200} textAnchor="middle" fontSize="9" fill="#9ca3af" fontWeight="500">
                  {catLabel}
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
