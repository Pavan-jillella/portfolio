"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Habit, HabitChain } from "@/types";

/* ─── suggested routines data ──────────────────────────────── */

interface SuggestedHabit {
  name: string;
  description: string;
  category: Habit["category"];
  difficulty: Habit["difficulty"];
  frequency_per_week: number;
  icon: string;
  color: string;
  life_index_domain: Habit["life_index_domain"];
}

interface SuggestedRoutine {
  name: string;
  description: string;
  time_of_day: HabitChain["time_of_day"];
  bonus_xp: number;
  color: string;
  borderColor: string;
  habits: SuggestedHabit[];
}

const SUGGESTED_ROUTINES: SuggestedRoutine[] = [
  {
    name: "Morning Focus",
    description: "Start the day with a coding challenge and review",
    time_of_day: "morning",
    bonus_xp: 30,
    color: "text-amber-400",
    borderColor: "border-amber-500/20",
    habits: [
      {
        name: "Solve 1 LeetCode Problem",
        description: "Start the day by solving one LeetCode problem (easy/medium)",
        category: "Learning",
        difficulty: "medium",
        frequency_per_week: 7,
        icon: "💻",
        color: "#3b82f6",
        life_index_domain: "learning",
      },
      {
        name: "Review Yesterday's Topics",
        description: "Spend 15 min reviewing notes and solutions from yesterday",
        category: "Learning",
        difficulty: "easy",
        frequency_per_week: 7,
        icon: "📝",
        color: "#8b5cf6",
        life_index_domain: "learning",
      },
    ],
  },
  {
    name: "Deep Study Block",
    description: "Focused learning sessions for DSA and system design",
    time_of_day: "afternoon",
    bonus_xp: 40,
    color: "text-blue-400",
    borderColor: "border-blue-500/20",
    habits: [
      {
        name: "2 Hours DSA Theory",
        description: "Deep dive into data structures & algorithms concepts",
        category: "Learning",
        difficulty: "hard",
        frequency_per_week: 6,
        icon: "📚",
        color: "#3b82f6",
        life_index_domain: "learning",
      },
      {
        name: "System Design Reading 30min",
        description: "Read system design resources (Designing Data-Intensive Apps, etc.)",
        category: "Learning",
        difficulty: "medium",
        frequency_per_week: 5,
        icon: "🏗️",
        color: "#06b6d4",
        life_index_domain: "learning",
      },
    ],
  },
  {
    name: "Evening Practice",
    description: "Mock interviews and spaced repetition",
    time_of_day: "evening",
    bonus_xp: 35,
    color: "text-violet-400",
    borderColor: "border-violet-500/20",
    habits: [
      {
        name: "Mock Interview Practice",
        description: "Practice with a partner or on Pramp/Interviewing.io",
        category: "Learning",
        difficulty: "hard",
        frequency_per_week: 3,
        icon: "🎤",
        color: "#ec4899",
        life_index_domain: "learning",
      },
      {
        name: "Spaced Repetition Review",
        description: "Use Anki/flashcards to review patterns & concepts",
        category: "Learning",
        difficulty: "easy",
        frequency_per_week: 7,
        icon: "🔄",
        color: "#8b5cf6",
        life_index_domain: "learning",
      },
    ],
  },
  {
    name: "Daily Essentials",
    description: "Core daily habits for sustained FAANG prep progress",
    time_of_day: "anytime",
    bonus_xp: 25,
    color: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    habits: [
      {
        name: "Log Daily Progress",
        description: "Write down what you learned and track progress in roadmap",
        category: "Learning",
        difficulty: "easy",
        frequency_per_week: 7,
        icon: "📊",
        color: "#10b981",
        life_index_domain: "learning",
      },
      {
        name: "Read 30min Tech Content",
        description: "Engineering blogs, papers, or tech newsletters",
        category: "Learning",
        difficulty: "easy",
        frequency_per_week: 6,
        icon: "📰",
        color: "#f59e0b",
        life_index_domain: "learning",
      },
      {
        name: "8 Hours Focused Study",
        description: "Track total focused study time per day",
        category: "Productivity",
        difficulty: "hard",
        frequency_per_week: 6,
        icon: "⏱️",
        color: "#ef4444",
        life_index_domain: "learning",
      },
    ],
  },
];

/* ─── component ────────────────────────────────────────────── */

interface SDEPrepSuggestionsProps {
  existingHabits: Habit[];
  existingChains: HabitChain[];
  onAddHabit: (habit: Habit) => void;
  onAddChain: (chain: HabitChain) => void;
}

export function SDEPrepSuggestions({
  existingHabits,
  existingChains,
  onAddHabit,
  onAddChain,
}: SDEPrepSuggestionsProps) {
  const [addedRoutines, setAddedRoutines] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  const isHabitExists = (name: string) =>
    existingHabits.some((h) => h.name.toLowerCase() === name.toLowerCase());

  const isChainExists = (name: string) =>
    existingChains.some((c) => c.name.toLowerCase() === name.toLowerCase());

  const handleAddRoutine = (routine: SuggestedRoutine) => {
    // Create chain
    const chainId = crypto.randomUUID();
    if (!isChainExists(routine.name)) {
      onAddChain({
        id: chainId,
        name: routine.name,
        description: routine.description,
        time_of_day: routine.time_of_day,
        bonus_xp: routine.bonus_xp,
        created_at: new Date().toISOString(),
      });
    }

    // Create habits
    for (const h of routine.habits) {
      if (!isHabitExists(h.name)) {
        onAddHabit({
          id: crypto.randomUUID(),
          name: h.name,
          description: h.description,
          category: h.category,
          difficulty: h.difficulty,
          frequency_per_week: h.frequency_per_week,
          chain_id: chainId,
          life_index_domain: h.life_index_domain,
          icon: h.icon,
          color: h.color,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }

    setAddedRoutines((prev) => new Set(prev).add(routine.name));
  };

  const handleAddAll = () => {
    for (const routine of SUGGESTED_ROUTINES) {
      if (!addedRoutines.has(routine.name) && !isChainExists(routine.name)) {
        handleAddRoutine(routine);
      }
    }
  };

  const allAdded = SUGGESTED_ROUTINES.every(
    (r) => addedRoutines.has(r.name) || isChainExists(r.name)
  );

  return (
    <div className="glass-card rounded-2xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono text-[10px] text-blue-400/60 uppercase tracking-widest mb-1">
            SDE Prep Habits
          </p>
          <h3 className="font-display font-bold text-base text-white">
            Suggested Daily Routines
          </h3>
          <p className="font-body text-xs text-white/30 mt-0.5">
            Curated habit chains for FAANG interview preparation
          </p>
        </div>
        {!allAdded && (
          <button
            onClick={handleAddAll}
            className="px-4 py-2 rounded-xl bg-blue-500/15 text-blue-400 font-mono text-xs border border-blue-500/20 hover:bg-blue-500/25 transition-colors"
          >
            Add All Routines
          </button>
        )}
      </div>

      <div className="space-y-3">
        {SUGGESTED_ROUTINES.map((routine) => {
          const alreadyAdded = addedRoutines.has(routine.name) || isChainExists(routine.name);
          const isExpanded = expanded === routine.name;
          const newHabitsCount = routine.habits.filter((h) => !isHabitExists(h.name)).length;

          return (
            <div
              key={routine.name}
              className={cn(
                "rounded-xl border transition-all",
                alreadyAdded
                  ? "border-emerald-500/15 bg-emerald-500/[0.03]"
                  : routine.borderColor + " bg-white/[0.02]"
              )}
            >
              <div className="flex items-center gap-3 p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={cn("font-display font-bold text-sm", alreadyAdded ? "text-emerald-400" : routine.color)}>
                      {routine.name}
                    </span>
                    <span className="font-mono text-[9px] text-white/20 px-1.5 py-0.5 rounded bg-white/[0.03]">
                      {routine.time_of_day}
                    </span>
                    {alreadyAdded && (
                      <span className="font-mono text-[9px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        Added
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-white/30 mt-0.5">{routine.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-white/15">{routine.habits.length} habits</span>
                  {!alreadyAdded && (
                    <button
                      onClick={() => handleAddRoutine(routine)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 font-mono text-[10px] border border-white/10 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      Add
                    </button>
                  )}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : routine.name)}
                    className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
                  >
                    <motion.svg animate={{ rotate: isExpanded ? 180 : 0 }} className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 pt-1 border-t border-white/5 space-y-1.5">
                      {routine.habits.map((h) => {
                        const exists = isHabitExists(h.name);
                        return (
                          <div key={h.name} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-white/[0.02]">
                            <span className="text-sm">{h.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className={cn("font-body text-xs", exists ? "text-white/25 line-through" : "text-white/50")}>
                                {h.name}
                              </p>
                              <p className="font-mono text-[9px] text-white/15">{h.frequency_per_week}x/week &middot; {h.difficulty}</p>
                            </div>
                            {exists && (
                              <span className="font-mono text-[8px] text-emerald-400/60">exists</span>
                            )}
                          </div>
                        );
                      })}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="font-mono text-[9px] text-white/15">Chain bonus:</span>
                        <span className="font-mono text-[9px] text-amber-400/60">+{routine.bonus_xp} XP</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
