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
      <div className="flex items-end gap-2 h-40">
        {trend.map((month, i) => {
          const incomeH = (month.income / maxValue) * 100;
          const expenseH = (month.expenses / maxValue) * 100;
          const label = month.month.split("-")[1];
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const shortLabel = monthNames[parseInt(label) - 1];

          return (
            <div key={month.month} className="flex-1 flex flex-col items-center gap-1 min-w-0" title={getMonthLabel(month.month)}>
              <div className="w-full flex items-end gap-0.5 h-28 relative">
                <div className="flex-1 flex flex-col items-center min-w-0">
                  {month.income > 0 && (
                    <span className="font-mono text-[9px] text-green-400/80 font-semibold mb-0.5 truncate w-full text-center">
                      ${Math.round(month.income)}
                    </span>
                  )}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${incomeH}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="w-full rounded-full min-h-[3px]"
                    style={{ background: "linear-gradient(to top, rgba(22,163,74,0.65), rgba(74,222,128,0.9))" }}
                  />
                </div>
                <div className="flex-1 flex flex-col items-center min-w-0">
                  {month.expenses > 0 && (
                    <span className="font-mono text-[9px] text-red-400/80 font-semibold mb-0.5 truncate w-full text-center">
                      ${Math.round(month.expenses)}
                    </span>
                  )}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${expenseH}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 + 0.05 }}
                    className="w-full rounded-full min-h-[3px]"
                    style={{ background: "linear-gradient(to top, rgba(220,38,38,0.65), rgba(248,113,113,0.9))" }}
                  />
                </div>
              </div>
              <span className="font-mono text-[10px] text-white/40">{shortLabel}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500/80" />
          <span className="font-mono text-[10px] text-white/40">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/80" />
          <span className="font-mono text-[10px] text-white/40">Expenses</span>
        </div>
      </div>
    </div>
  );
}
