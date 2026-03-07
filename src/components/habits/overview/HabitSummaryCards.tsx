"use client";
import { useMemo } from "react";
import { Habit, HabitLog } from "@/types";
import { getWeeklyScore, getOverallHabitScore, getHabitLevel } from "@/lib/habit-utils";

interface HabitSummaryCardsProps {
  habits: Habit[];
  logs: HabitLog[];
}

export function HabitSummaryCards({ habits, logs }: HabitSummaryCardsProps) {
  const stats = useMemo(() => {
    const totalXP = logs.reduce((s, l) => s + l.xp_earned, 0);
    const level = getHabitLevel(totalXP);
    const weeklyScore = getWeeklyScore(habits, logs);
    const completionRate = getOverallHabitScore(habits, logs);

    // Count today's completions
    const today = new Date().toISOString().slice(0, 10);
    const todayCompleted = new Set(
      logs.filter((l) => l.date === today && l.completed).map((l) => l.habit_id)
    ).size;

    return { totalXP, level, weeklyScore, completionRate, todayCompleted, totalHabits: habits.length };
  }, [habits, logs]);

  const cards = [
    { label: "Active Habits", value: String(stats.totalHabits), color: "text-white" },
    { label: "Today", value: `${stats.todayCompleted}/${stats.totalHabits}`, color: "text-blue-400" },
    { label: "30d Avg", value: `${stats.completionRate}%`, color: "text-emerald-400" },
    { label: "Total XP", value: stats.totalXP.toLocaleString(), color: "text-amber-400" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="glass-card rounded-xl p-3 text-center">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">{c.label}</p>
          <p className={`font-mono text-sm ${c.color}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}
