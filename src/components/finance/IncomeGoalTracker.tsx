"use client";
import { IncomeGoal, PayStub } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { motion } from "framer-motion";

interface IncomeGoalTrackerProps {
  goals: IncomeGoal[];
  payStubs: PayStub[];
}

export function IncomeGoalTracker({ goals, payStubs }: IncomeGoalTrackerProps) {
  const currentYear = new Date().getFullYear();
  const yearGoal = goals.find((g) => g.year === currentYear);

  if (!yearGoal) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-2">Income Goal</h4>
        <p className="font-body text-sm text-white/30">No income goal set for {currentYear}. Add one in Settings.</p>
      </div>
    );
  }

  const yearStart = `${currentYear}-01-01`;
  const ytdGross = payStubs
    .filter((s) => s.pay_date >= yearStart)
    .reduce((sum, s) => sum + s.gross_pay, 0);

  const progress = yearGoal.target_amount > 0
    ? Math.min((ytdGross / yearGoal.target_amount) * 100, 100)
    : 0;

  const remaining = Math.max(yearGoal.target_amount - ytdGross, 0);
  const monthsLeft = 12 - new Date().getMonth();
  const neededPerMonth = monthsLeft > 0 ? remaining / monthsLeft : 0;

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-display font-semibold text-sm text-white">Income Goal {currentYear}</h4>
        <p className="font-mono text-xs text-white/30">
          {formatCurrency(ytdGross)} / {formatCurrency(yearGoal.target_amount)}
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bar-3d-horizontal"
          style={{
            background: progress >= 100
              ? "linear-gradient(90deg, #10b981, #34d399)"
              : "linear-gradient(90deg, #3b82f6, #60a5fa)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-white/40">
          {progress.toFixed(1)}% complete
        </p>
        {remaining > 0 && (
          <p className="font-mono text-xs text-white/30">
            Need {formatCurrency(neededPerMonth)}/mo to reach goal
          </p>
        )}
        {remaining <= 0 && (
          <p className="font-mono text-xs text-emerald-400">Goal reached!</p>
        )}
      </div>
    </div>
  );
}
