"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Habit, HabitLog } from "@/types";
import { HABIT_CATEGORY_COLORS } from "@/lib/constants";
import { getWeeklyCompletions } from "@/lib/habit-utils";
import { FadeIn } from "@/components/ui/FadeIn";

interface WeeklyGoalsTabProps {
  habits: Habit[];
  logs: HabitLog[];
}

export function WeeklyGoalsTab({ habits, logs }: WeeklyGoalsTabProps) {
  const goals = useMemo(() => {
    return habits.map((h) => ({
      habit: h,
      completed: getWeeklyCompletions(logs, h.id),
      target: h.frequency_per_week,
    }));
  }, [habits, logs]);

  if (habits.length === 0) {
    return (
      <FadeIn>
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="font-body text-sm text-white/40">Add habits to track weekly goals.</p>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="space-y-4">
        {goals.map(({ habit, completed, target }, idx) => {
          const pct = Math.min(Math.round((completed / target) * 100), 100);
          const isComplete = completed >= target;
          const color = HABIT_CATEGORY_COLORS[habit.category] || "#8b5cf6";

          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-body text-sm text-white">{habit.name}</span>
                  {isComplete && (
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      Complete
                    </span>
                  )}
                </div>
                <span className={`font-mono text-sm ${isComplete ? "text-emerald-400" : "text-white/60"}`}>
                  {completed}/{target}
                </span>
              </div>

              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: isComplete ? "#10b981" : color }}
                />
              </div>

              <div className="flex items-center justify-between mt-1.5">
                <span className="font-mono text-[9px] text-white/20">
                  {habit.frequency_per_week}x per week
                </span>
                <span className="font-mono text-[9px] text-white/20">{pct}%</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </FadeIn>
  );
}
