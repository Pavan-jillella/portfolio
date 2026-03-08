"use client";
import { useMemo } from "react";
import { Budget, Transaction } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";
import { bar3DPaths, darkenColor, lightenColor } from "@/lib/chart-3d-utils";

interface MonthlyBudgetComparisonChartProps {
  budgets: Budget[];
  transactions: Transaction[];
  selectedMonth: string;
}

export function MonthlyBudgetComparisonChart({ budgets, transactions, selectedMonth }: MonthlyBudgetComparisonChartProps) {
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

  const chartWidth = 600;
  const chartHeight = 250;
  const pt = 28, pb = 40, pl = 10, pr = 10;
  const dw = chartWidth - pl - pr;
  const dh = chartHeight - pt - pb;

  const maxValue = Math.max(...data.flatMap((d) => [d.budget, d.actual]), 1);
  const groupW = dw / data.length;
  const barW = groupW * 0.3;
  const barGap = groupW * 0.05;

  const scaleY = (v: number) => pt + dh - (v / maxValue) * dh;
  const budgetColor = "#3b82f6";
  const actualColor = "#f97316";
  const overBudgetColor = "#ef4444";

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Budget vs Actual</h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: budgetColor }} />
            <span className="font-mono text-[10px] text-white/40">Budget</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: actualColor }} />
            <span className="font-mono text-[10px] text-white/40">Actual</span>
          </div>
        </div>
      </div>
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
        {/* Gradient defs + glow filter */}
        <defs>
          <linearGradient id="barGrad-mbc-budget" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lightenColor("#3b82f6", 0.3)} />
            <stop offset="100%" stopColor={darkenColor("#3b82f6", 0.2)} />
          </linearGradient>
          <linearGradient id="barGrad-mbc-actual" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lightenColor("#f97316", 0.3)} />
            <stop offset="100%" stopColor={darkenColor("#f97316", 0.2)} />
          </linearGradient>
          <linearGradient id="barGrad-mbc-over" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lightenColor("#ef4444", 0.3)} />
            <stop offset="100%" stopColor={darkenColor("#ef4444", 0.2)} />
          </linearGradient>
          <filter id="barGlow-mbc">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac) => (
          <line
            key={frac}
            x1={pl} y1={scaleY(frac * maxValue)}
            x2={chartWidth - pr} y2={scaleY(frac * maxValue)}
            stroke="rgba(255,255,255,0.05)" strokeWidth={0.5}
          />
        ))}

        {/* Grouped bars */}
        {data.map((d, i) => {
          const groupX = pl + i * groupW;
          const budgetX = groupX + (groupW - barW * 2 - barGap) / 2;
          const actualX = budgetX + barW + barGap;

          const budgetH = (d.budget / maxValue) * dh;
          const budgetY = pt + dh - budgetH;
          const actualH = (d.actual / maxValue) * dh;
          const actualY = pt + dh - actualH;

          const isOver = d.actual > d.budget;
          const currentActualColor = isOver ? overBudgetColor : actualColor;

          const budgetPaths = bar3DPaths(budgetX, budgetY, barW, budgetH, 8, -8);
          const actualPaths = bar3DPaths(actualX, actualY, barW, actualH, 8, -8);

          const categoryLabel = d.category.length > 8 ? d.category.slice(0, 8) + "\u2026" : d.category;

          return (
            <g key={d.category}>
              {/* Budget bar 3D */}
              <path d={budgetPaths.rightFace} fill={darkenColor(budgetColor, 0.5)} />
              <path d={budgetPaths.topFace} fill={lightenColor(budgetColor, 0.2)} />
              <motion.rect
                x={budgetX} y={budgetY} width={barW} height={budgetH}
                rx={6} fill="url(#barGrad-mbc-budget)" fillOpacity={0.9}
                stroke={budgetColor} strokeWidth={0.5} strokeOpacity={0.4}
                filter="url(#barGlow-mbc)"
                initial={{ height: 0, y: pt + dh }}
                animate={{ height: budgetH, y: budgetY }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              />
              {/* Inner highlight stripe */}
              <rect x={budgetX} y={budgetY} width={2} height={budgetH} rx={1} fill={lightenColor(budgetColor, 0.5)} fillOpacity={0.4} />
              {/* Dot cap */}
              <circle cx={budgetX + barW / 2} cy={budgetY} r={2.5} fill={lightenColor(budgetColor, 0.4)} />

              {/* Actual bar 3D */}
              <path d={actualPaths.rightFace} fill={darkenColor(currentActualColor, 0.5)} />
              <path d={actualPaths.topFace} fill={lightenColor(currentActualColor, 0.2)} />
              <motion.rect
                x={actualX} y={actualY} width={barW} height={actualH}
                rx={6} fill={isOver ? "url(#barGrad-mbc-over)" : "url(#barGrad-mbc-actual)"} fillOpacity={0.9}
                stroke={currentActualColor} strokeWidth={0.5} strokeOpacity={0.4}
                filter="url(#barGlow-mbc)"
                initial={{ height: 0, y: pt + dh }}
                animate={{ height: actualH, y: actualY }}
                transition={{ duration: 0.5, delay: i * 0.08 + 0.1 }}
              />
              {/* Inner highlight stripe */}
              <rect x={actualX} y={actualY} width={2} height={actualH} rx={1} fill={lightenColor(currentActualColor, 0.5)} fillOpacity={0.4} />
              {/* Dot cap */}
              <circle cx={actualX + barW / 2} cy={actualY} r={2.5} fill={lightenColor(currentActualColor, 0.4)} />

              {/* Value labels above bars */}
              <text
                x={budgetX + barW / 2} y={budgetY - 6}
                textAnchor="middle" fill="rgba(59,130,246,0.8)"
                fontSize="11" className="font-mono"
              >
                {formatCurrency(d.budget)}
              </text>
              <text
                x={actualX + barW / 2} y={actualY - 6}
                textAnchor="middle" fill={isOver ? "rgba(239,68,68,0.8)" : "rgba(249,115,22,0.8)"}
                fontSize="11" className="font-mono"
              >
                {formatCurrency(d.actual)}
              </text>

              {/* Category label on x-axis */}
              <text
                x={groupX + groupW / 2} y={chartHeight - pb + 18}
                textAnchor="middle" fill="rgba(255,255,255,0.4)"
                fontSize="9" className="font-mono"
              >
                {categoryLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
