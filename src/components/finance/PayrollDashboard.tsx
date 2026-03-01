"use client";
import { useState, useMemo } from "react";
import { PayStub, Employer, EnhancedWorkSchedule, IncomeGoal } from "@/types";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { getPayrollDashboardStats } from "@/lib/payroll-utils";
import { formatCurrency, getCurrentMonth } from "@/lib/finance-utils";
import { PayrollPieChart } from "./PayrollPieChart";
import { PayrollWeeklyTrend } from "./PayrollWeeklyTrend";
import { PayrollMonthlyTrend } from "./PayrollMonthlyTrend";
import { IncomeGoalTracker } from "./IncomeGoalTracker";
import { IncomeForecast } from "./IncomeForecast";
import { motion } from "framer-motion";

interface PayrollDashboardProps {
  payStubs: PayStub[];
  employers: Employer[];
  enhancedSchedules: EnhancedWorkSchedule[];
  incomeGoals: IncomeGoal[];
}

function formatMonthDisplay(month: string): string {
  const [year, m] = month.split("-");
  const date = new Date(parseInt(year), parseInt(m) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function shiftMonth(month: string, delta: number): string {
  const [year, m] = month.split("-");
  const date = new Date(parseInt(year), parseInt(m) - 1 + delta);
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${mo}`;
}

export function PayrollDashboard({
  payStubs,
  employers,
  enhancedSchedules,
  incomeGoals,
}: PayrollDashboardProps) {
  // Default to latest month with data, or current month if no data
  const latestMonth = useMemo(() => {
    if (payStubs.length === 0) return getCurrentMonth();
    const dates = payStubs.map((s) => s.pay_date).filter(Boolean).sort();
    const latest = dates[dates.length - 1];
    return latest ? latest.slice(0, 7) : getCurrentMonth();
  }, [payStubs]);

  const [selectedMonth, setSelectedMonth] = useState(latestMonth);

  const stats = useMemo(
    () => getPayrollDashboardStats(enhancedSchedules, payStubs, employers, selectedMonth),
    [enhancedSchedules, payStubs, employers, selectedMonth]
  );

  const statCards = [
    {
      label: "Hours",
      value: stats.total_hours_month,
      suffix: "h",
      prefix: "",
      color: "text-white",
      decimals: 1,
    },
    {
      label: "Gross",
      value: stats.gross_month,
      suffix: "",
      prefix: "$",
      color: "text-white",
      decimals: 0,
    },
    {
      label: "Net",
      value: stats.net_month,
      suffix: "",
      prefix: "$",
      color: "text-emerald-400",
      decimals: 0,
    },
    {
      label: "Effective Rate",
      value: stats.effective_hourly_rate,
      suffix: "/hr",
      prefix: "$",
      color: "text-blue-400",
      decimals: 2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Month selector */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setSelectedMonth((prev) => shiftMonth(prev, -1))}
          className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-white/60 hover:text-white"
          aria-label="Previous month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 12L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h3 className="font-display font-semibold text-lg text-white min-w-[180px] text-center">
          {formatMonthDisplay(selectedMonth)}
        </h3>
        <button
          onClick={() => setSelectedMonth((prev) => shiftMonth(prev, 1))}
          className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-white/60 hover:text-white"
          aria-label="Next month"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="glass-card rounded-2xl p-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
          >
            <p className="font-mono text-[10px] text-white/25 uppercase tracking-wider mb-1">
              {card.label}
            </p>
            <p className={`font-mono text-2xl font-semibold ${card.color}`}>
              <AnimatedCounter
                target={card.value}
                prefix={card.prefix}
                suffix={card.suffix}
                duration={1200}
                decimals={card.decimals}
              />
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts row: Pie + Weekly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PayrollPieChart data={stats.income_by_employer} />
        <PayrollWeeklyTrend data={stats.weekly_trend} />
      </div>

      {/* Monthly trend full width */}
      <PayrollMonthlyTrend data={stats.monthly_trend} />

      {/* Income Goal + Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IncomeGoalTracker goals={incomeGoals} payStubs={payStubs} />
        <IncomeForecast
          employers={employers}
          payStubs={payStubs}
          enhancedSchedules={enhancedSchedules}
        />
      </div>
    </div>
  );
}
