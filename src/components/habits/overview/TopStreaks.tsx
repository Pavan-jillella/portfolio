"use client";
import { useMemo } from "react";
import { Habit, HabitLog } from "@/types";
import { calculateStreak, getEarnedBadges } from "@/lib/habit-utils";

interface TopStreaksProps {
  habits: Habit[];
  logs: HabitLog[];
}

export function TopStreaks({ habits, logs }: TopStreaksProps) {
  const streaks = useMemo(() => {
    return habits
      .map((h) => ({
        habit: h,
        streak: calculateStreak(logs, h.id),
        badges: getEarnedBadges(calculateStreak(logs, h.id)),
      }))
      .filter((s) => s.streak > 0)
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 5);
  }, [habits, logs]);

  return (
    <div className="glass-card rounded-2xl p-6">
      <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
        Active Streaks
      </p>
      {streaks.length === 0 ? (
        <p className="font-body text-xs text-white/20">Complete habits to start streaks.</p>
      ) : (
        <div className="space-y-3">
          {streaks.map(({ habit, streak, badges }) => (
            <div key={habit.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-orange-400 text-sm">&#128293;</span>
                <span className="font-body text-sm text-white">{habit.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {badges.map((b) => (
                  <span
                    key={b.type}
                    className="w-4 h-4 rounded-full inline-block"
                    style={{ backgroundColor: b.color }}
                    title={b.label}
                  />
                ))}
                <span className="font-mono text-sm text-orange-400">{streak}d</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
