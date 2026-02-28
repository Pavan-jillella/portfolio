"use client";
import { Employer, PayStub, EnhancedWorkSchedule } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { forecastIncome } from "@/lib/payroll-utils";
import { motion } from "framer-motion";

interface IncomeForecastProps {
  employers: Employer[];
  payStubs: PayStub[];
  enhancedSchedules: EnhancedWorkSchedule[];
}

export function IncomeForecast({ employers, payStubs, enhancedSchedules }: IncomeForecastProps) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const yearStart = `${currentYear}-01-01`;

  // Calculate average weekly hours per employer
  const ytdSchedules = enhancedSchedules.filter(
    (s) => s.start_date >= yearStart || s.created_at >= yearStart
  );

  const weeksSoFar = Math.max(
    1,
    Math.ceil((now.getTime() - new Date(yearStart).getTime()) / (7 * 24 * 60 * 60 * 1000))
  );

  const weeksRemaining = Math.max(0, 52 - weeksSoFar);

  // Current YTD gross
  const ytdGross = payStubs
    .filter((s) => s.pay_date >= yearStart)
    .reduce((sum, s) => sum + s.gross_pay, 0);

  // Calculate forecasts per employer
  const forecasts = employers.filter((e) => e.active).map((employer) => {
    const empSchedules = ytdSchedules.filter((s) => s.employer_id === employer.id);
    const totalHours = empSchedules.reduce((sum, s) => sum + s.total_hours, 0);
    const avgWeeklyHours = weeksSoFar > 0 ? totalHours / weeksSoFar : 0;
    const projected = forecastIncome(avgWeeklyHours, employer, weeksRemaining);
    return { employer, avgWeeklyHours, projected };
  });

  const totalProjected = forecasts.reduce((sum, f) => sum + f.projected, 0);
  const projectedYearEnd = ytdGross + totalProjected;

  if (forecasts.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-2">Income Forecast</h4>
        <p className="font-body text-sm text-white/30">Add employers and import schedules to see income projections.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="glass-card rounded-2xl p-5 space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h4 className="font-display font-semibold text-sm text-white">Income Forecast</h4>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/[0.03] rounded-xl p-3 text-center">
          <p className="font-mono text-[10px] text-white/25 uppercase">YTD Earned</p>
          <p className="font-mono text-lg text-white">{formatCurrency(ytdGross)}</p>
        </div>
        <div className="bg-white/[0.03] rounded-xl p-3 text-center">
          <p className="font-mono text-[10px] text-white/25 uppercase">Projected Year-End</p>
          <p className="font-mono text-lg text-emerald-400">{formatCurrency(projectedYearEnd)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-mono text-[10px] text-white/25 uppercase">By Employer ({weeksRemaining} weeks remaining)</p>
        {forecasts.map(({ employer, avgWeeklyHours, projected }) => (
          <div key={employer.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: employer.color }}
              />
              <span className="font-body text-xs text-white/60">{employer.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-white/30">
                ~{avgWeeklyHours.toFixed(1)}h/wk
              </span>
              <span className="font-mono text-xs text-white/60">
                +{formatCurrency(projected)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
