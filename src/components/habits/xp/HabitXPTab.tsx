"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Habit, HabitLog } from "@/types";
import { getHabitLevel, getEarnedBadges, calculateLongestStreak } from "@/lib/habit-utils";
import { HABIT_CATEGORY_COLORS, HABIT_DIFFICULTY_LABELS } from "@/lib/constants";
import { FadeIn } from "@/components/ui/FadeIn";

interface HabitXPTabProps {
  habits: Habit[];
  logs: HabitLog[];
}

export function HabitXPTab({ habits, logs }: HabitXPTabProps) {
  const totalXP = useMemo(() => logs.reduce((s, l) => s + l.xp_earned, 0), [logs]);
  const overallLevel = useMemo(() => getHabitLevel(totalXP), [totalXP]);

  const habitsWithXP = useMemo(() => {
    return habits
      .map((h) => {
        const habitLogs = logs.filter((l) => l.habit_id === h.id);
        const xp = habitLogs.reduce((s, l) => s + l.xp_earned, 0);
        const level = getHabitLevel(xp);
        const longestStreak = calculateLongestStreak(logs, h.id);
        const badges = getEarnedBadges(longestStreak);
        return { habit: h, xp, level, badges, longestStreak };
      })
      .sort((a, b) => b.xp - a.xp);
  }, [habits, logs]);

  const totalBadges = useMemo(() => {
    return habitsWithXP.reduce((s, h) => s + h.badges.length, 0);
  }, [habitsWithXP]);

  if (habits.length === 0) {
    return (
      <FadeIn>
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="font-body text-sm text-white/40">Add habits and complete them to earn XP.</p>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall stats */}
      <FadeIn>
        <div className="glass-card rounded-2xl p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Total XP</p>
              <p className="font-display text-2xl font-bold text-amber-400">{totalXP.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Level</p>
              <p className="font-display text-2xl font-bold text-blue-400">{overallLevel.level}</p>
              <p className="font-mono text-[9px] text-white/20">{overallLevel.label}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Badges</p>
              <p className="font-display text-2xl font-bold text-white">{totalBadges}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Next Level</p>
              {overallLevel.maxXp > 0 ? (
                <>
                  <p className="font-mono text-sm text-white/60">
                    {overallLevel.xp}/{overallLevel.maxXp} XP
                  </p>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${(overallLevel.xp / overallLevel.maxXp) * 100}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="font-mono text-sm text-emerald-400">Max Level</p>
              )}
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Per-habit XP */}
      <FadeIn delay={0.05}>
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
          Per-Habit Progress
        </p>
        <div className="space-y-3">
          {habitsWithXP.map(({ habit, xp, level, badges }, idx) => {
            const color = HABIT_CATEGORY_COLORS[habit.category] || "#8b5cf6";

            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="glass-card rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="font-body text-sm text-white">{habit.name}</span>
                    <span className="font-mono text-[9px] text-white/20">
                      {HABIT_DIFFICULTY_LABELS[habit.difficulty]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {badges.map((b) => (
                      <span
                        key={b.type}
                        className="w-5 h-5 rounded-full inline-flex items-center justify-center text-[8px] font-bold"
                        style={{ backgroundColor: `${b.color}30`, color: b.color }}
                        title={b.label}
                      >
                        {b.type === "bronze" ? "B" : b.type === "silver" ? "S" : "G"}
                      </span>
                    ))}
                    <span className="font-mono text-xs text-blue-400">Lv.{level.level}</span>
                    <span className="font-mono text-xs text-amber-400">{xp} XP</span>
                  </div>
                </div>

                {level.maxXp > 0 && (
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(level.xp / level.maxXp) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-[9px] text-white/15">{level.label}</span>
                  {level.maxXp > 0 && (
                    <span className="font-mono text-[9px] text-white/15">
                      {level.xp}/{level.maxXp} to next level
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </FadeIn>
    </div>
  );
}
