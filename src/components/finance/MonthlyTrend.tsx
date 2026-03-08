"use client";
import { MonthlySummary } from "@/types";
import { formatCurrency, getMonthLabel } from "@/lib/finance-utils";
import { motion } from "framer-motion";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";

interface MonthlyTrendProps {
  trend: MonthlySummary[];
}

export function MonthlyTrend({ trend }: MonthlyTrendProps) {
  const maxValue = Math.max(...trend.flatMap((t) => [t.income, t.expenses]), 1);

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-lg text-white mb-6">Monthly Comparison</h3>
      <Chart3DWrapper tiltX={6} tiltY={-3}>
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
                    <span className="font-mono text-[11px] text-green-400 mb-0.5">
                      {formatCurrency(month.income)}
                    </span>
                  )}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${incomeH}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="w-full rounded-t-lg min-h-[2px] bar-3d relative overflow-hidden"
                    style={{ background: "linear-gradient(to top, rgba(34,197,94,0.4), rgba(34,197,94,0.7))", boxShadow: "0 0 8px rgba(34,197,94,0.3), inset 1px 0 0 rgba(255,255,255,0.15)" }}
                  >
                    <div className="absolute left-0 top-0 w-[2px] h-full bg-green-300/40 rounded-full" />
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 w-1.5 h-1.5 rounded-full bg-green-300/60" />
                  </motion.div>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  {month.expenses > 0 && (
                    <span className="font-mono text-[11px] text-red-400 mb-0.5">
                      {formatCurrency(month.expenses)}
                    </span>
                  )}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${expenseH}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 + 0.05 }}
                    className="w-full rounded-t-lg min-h-[2px] bar-3d relative overflow-hidden"
                    style={{ background: "linear-gradient(to top, rgba(239,68,68,0.4), rgba(239,68,68,0.7))", boxShadow: "0 0 8px rgba(239,68,68,0.3), inset 1px 0 0 rgba(255,255,255,0.15)" }}
                  >
                    <div className="absolute left-0 top-0 w-[2px] h-full bg-red-300/40 rounded-full" />
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 w-1.5 h-1.5 rounded-full bg-red-300/60" />
                  </motion.div>
                </div>
              </div>
              <span className="font-mono text-xs text-white/40">{shortLabel}</span>
            </div>
          );
        })}
      </div>
      </Chart3DWrapper>
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
