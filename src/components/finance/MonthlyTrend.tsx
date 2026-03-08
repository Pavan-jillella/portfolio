"use client";
import { MonthlySummary } from "@/types";
import { formatCurrency, getMonthLabel } from "@/lib/finance-utils";
import { motion } from "framer-motion";

interface MonthlyTrendProps {
  trend: MonthlySummary[];
}

export function MonthlyTrend({ trend }: MonthlyTrendProps) {
  const maxValue = Math.max(...trend.flatMap((t) => [t.income, t.expenses]), 1);

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-lg text-white mb-6">Monthly Comparison</h3>
      <div className="flex items-end gap-3 h-48">
        {trend.map((month, i) => {
          const incomeH = (month.income / maxValue) * 100;
          const expenseH = (month.expenses / maxValue) * 100;
          const label = month.month.split("-")[1];
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const shortLabel = monthNames[parseInt(label) - 1];

          return (
            <div key={month.month} className="flex-1 flex flex-col items-center gap-1 group" title={getMonthLabel(month.month)}>
              <div className="w-full flex items-end gap-0.5 h-40 relative">
                <div className="flex-1 flex flex-col items-center">
                  {month.income > 0 && (
                    <span className="font-mono text-[10px] text-green-400 mb-0.5">
                      {formatCurrency(month.income)}
                    </span>
                  )}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${incomeH}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="w-full bg-green-500/60 rounded-t-md min-h-[2px] bar-3d"
                  />
                </div>
                <div className="flex-1 flex flex-col items-center">
                  {month.expenses > 0 && (
                    <span className="font-mono text-[10px] text-red-400 mb-0.5">
                      {formatCurrency(month.expenses)}
                    </span>
                  )}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${expenseH}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 + 0.05 }}
                    className="w-full bg-red-500/60 rounded-t-md min-h-[2px] bar-3d"
                  />
                </div>
              </div>
              <span className="font-mono text-xs text-white/40">{shortLabel}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-green-500/60" />
          <span className="font-mono text-xs text-white/30">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-red-500/60" />
          <span className="font-mono text-xs text-white/30">Expenses</span>
        </div>
      </div>
    </div>
  );
}
