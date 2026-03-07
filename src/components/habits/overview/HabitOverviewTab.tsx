"use client";
import { useMemo } from "react";
import { Habit, HabitLog } from "@/types";
import { FadeIn } from "@/components/ui/FadeIn";
import { HabitCard } from "../HabitCard";
import { HabitSummaryCards } from "./HabitSummaryCards";
import { TopStreaks } from "./TopStreaks";
import { getWeeklyScore } from "@/lib/habit-utils";

interface HabitOverviewTabProps {
  habits: Habit[];
  logs: HabitLog[];
  onToggle: (habitId: string, date: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export function HabitOverviewTab({ habits, logs, onToggle, onEdit, onDelete }: HabitOverviewTabProps) {
  const weeklyScore = useMemo(() => getWeeklyScore(habits, logs), [habits, logs]);

  if (habits.length === 0) {
    return (
      <FadeIn>
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-2">No Habits Yet</p>
          <p className="font-body text-sm text-white/40">
            Click &quot;+ Add Habit&quot; to start tracking your daily habits.
          </p>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary cards */}
      <FadeIn>
        <HabitSummaryCards habits={habits} logs={logs} />
      </FadeIn>

      {/* Today's habits */}
      <FadeIn delay={0.05}>
        <div>
          <h3 className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
            Today&apos;s Habits
          </h3>
          <div className="space-y-3">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                logs={logs}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Weekly score + Streaks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FadeIn delay={0.1}>
          <div className="glass-card rounded-2xl p-6">
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">Weekly Score</p>
            <div className="flex items-end gap-3">
              <span className="font-display text-4xl font-bold text-white">{weeklyScore}</span>
              <span className="font-body text-sm text-white/30 mb-1">/ 100</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${weeklyScore}%` }}
              />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <TopStreaks habits={habits} logs={logs} />
        </FadeIn>
      </div>
    </div>
  );
}
