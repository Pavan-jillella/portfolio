"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Habit, HabitLog } from "@/types";
import { HABIT_CATEGORY_COLORS } from "@/lib/constants";
import { FadeIn } from "@/components/ui/FadeIn";

interface DailyTrackerTabProps {
  habits: Habit[];
  logs: HabitLog[];
  onToggle: (habitId: string, date: string) => void;
}

function getWeekDates(): { date: string; label: string; isToday: boolean }[] {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    return { date: dateStr, label, isToday: dateStr === today.toISOString().slice(0, 10) };
  });
}

export function DailyTrackerTab({ habits, logs, onToggle }: DailyTrackerTabProps) {
  const weekDates = useMemo(() => getWeekDates(), []);

  const completionMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    logs.forEach((l) => {
      if (!l.completed) return;
      const key = `${l.habit_id}-${l.date}`;
      if (!map.has(l.habit_id)) map.set(l.habit_id, new Set());
      map.get(l.habit_id)!.add(l.date);
    });
    return map;
  }, [logs]);

  if (habits.length === 0) {
    return (
      <FadeIn>
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="font-body text-sm text-white/40">Add habits to see the weekly grid.</p>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="glass-card rounded-2xl p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left font-mono text-[10px] text-white/30 uppercase tracking-widest pb-3 pr-4 min-w-[120px]">
                Habit
              </th>
              {weekDates.map((d) => (
                <th
                  key={d.date}
                  className={`text-center font-mono text-[10px] uppercase tracking-widest pb-3 w-16 ${
                    d.isToday ? "text-blue-400" : "text-white/30"
                  }`}
                >
                  {d.label}
                  <div className="text-[8px] text-white/15 mt-0.5">{d.date.slice(5)}</div>
                </th>
              ))}
              <th className="text-center font-mono text-[10px] text-white/30 uppercase tracking-widest pb-3 w-16">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, idx) => {
              const completed = completionMap.get(habit.id) || new Set<string>();
              const weekCompleted = weekDates.filter((d) => completed.has(d.date)).length;
              const weekPct = Math.round((weekCompleted / habit.frequency_per_week) * 100);

              return (
                <motion.tr
                  key={habit.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border-t border-white/5"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: HABIT_CATEGORY_COLORS[habit.category] }}
                      />
                      <span className="font-body text-sm text-white truncate">{habit.name}</span>
                    </div>
                  </td>
                  {weekDates.map((d) => {
                    const isCompleted = completed.has(d.date);
                    return (
                      <td key={d.date} className="py-3 text-center">
                        <button
                          onClick={() => onToggle(habit.id, d.date)}
                          role="checkbox"
                          aria-checked={isCompleted}
                          aria-label={`${habit.name} on ${d.date}: ${isCompleted ? "completed" : "not completed"}`}
                          className={`w-8 h-8 rounded-lg border-2 inline-flex items-center justify-center transition-all ${
                            isCompleted
                              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                              : d.isToday
                              ? "border-blue-500/30 hover:border-blue-500/50"
                              : "border-white/5 hover:border-white/15"
                          }`}
                        >
                          {isCompleted && (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-3 text-center">
                    <span className={`font-mono text-xs ${weekPct >= 100 ? "text-emerald-400" : weekPct >= 50 ? "text-amber-400" : "text-white/30"}`}>
                      {weekCompleted}/{habit.frequency_per_week}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </FadeIn>
  );
}
