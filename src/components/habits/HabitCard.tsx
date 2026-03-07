"use client";
import { motion } from "framer-motion";
import { Habit, HabitLog } from "@/types";
import { HABIT_CATEGORY_COLORS, HABIT_DIFFICULTY_LABELS, HABIT_DIFFICULTY_XP } from "@/lib/constants";
import { calculateStreak, getEarnedBadges, getCompletionRate, isHabitCompletedToday, getHabitLevel } from "@/lib/habit-utils";

interface HabitCardProps {
  habit: Habit;
  logs: HabitLog[];
  onToggle: (habitId: string, date: string) => void;
  onEdit?: (habit: Habit) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export function HabitCard({ habit, logs, onToggle, onEdit, onDelete, compact }: HabitCardProps) {
  const today = new Date().toISOString().slice(0, 10);
  const completed = isHabitCompletedToday(logs, habit.id);
  const streak = calculateStreak(logs, habit.id);
  const completionRate = getCompletionRate(logs, habit.id, 30);
  const totalXP = logs.filter((l) => l.habit_id === habit.id).reduce((s, l) => s + l.xp_earned, 0);
  const levelInfo = getHabitLevel(totalXP);
  const badges = getEarnedBadges(streak);
  const categoryColor = HABIT_CATEGORY_COLORS[habit.category] || "#8b5cf6";

  if (compact) {
    return (
      <div className="flex items-center gap-3 py-2">
        <button
          onClick={() => onToggle(habit.id, today)}
          role="checkbox"
          aria-checked={completed}
          aria-label={`Mark ${habit.name} as ${completed ? "incomplete" : "complete"}`}
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
            completed
              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
              : "border-white/10 hover:border-white/30"
          }`}
        >
          {completed && (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <span className={`font-body text-sm ${completed ? "text-white/40 line-through" : "text-white"}`}>
          {habit.name}
        </span>
        {streak > 0 && (
          <span className="font-mono text-[10px] text-orange-400">{streak}d</span>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-4 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Toggle */}
          <button
            onClick={() => onToggle(habit.id, today)}
            role="checkbox"
            aria-checked={completed}
            aria-label={`Mark ${habit.name} as ${completed ? "incomplete" : "complete"}`}
            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 ${
              completed
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                : "border-white/10 hover:border-white/30"
            }`}
          >
            {completed && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={`font-body text-sm font-medium ${completed ? "text-white/40 line-through" : "text-white"}`}>
                {habit.name}
              </h4>
              <span
                className="font-mono text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
              >
                {habit.category}
              </span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30">
                {HABIT_DIFFICULTY_LABELS[habit.difficulty]} (+{HABIT_DIFFICULTY_XP[habit.difficulty]} XP)
              </span>
            </div>

            {habit.description && (
              <p className="font-body text-xs text-white/30 mt-0.5 truncate">{habit.description}</p>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-2">
              {streak > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-orange-400 text-xs">&#128293;</span>
                  <span className="font-mono text-[10px] text-orange-400">{streak}d streak</span>
                </div>
              )}
              <span className="font-mono text-[10px] text-white/20">{completionRate}% (30d)</span>
              <span className="font-mono text-[10px] text-blue-400">Lv.{levelInfo.level}</span>
              <span className="font-mono text-[10px] text-white/20">{totalXP} XP</span>
              {badges.map((b) => (
                <span
                  key={b.type}
                  className="font-mono text-[9px] px-1 py-0.5 rounded"
                  style={{ backgroundColor: `${b.color}20`, color: b.color }}
                >
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={() => onEdit(habit)}
                aria-label={`Edit ${habit.name}`}
                className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(habit.id)}
                aria-label={`Delete ${habit.name}`}
                className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
