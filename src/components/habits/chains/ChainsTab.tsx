"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Habit, HabitLog, HabitChain, HabitChainTimeOfDay } from "@/types";
import { getChainWithHabits, isHabitCompletedToday } from "@/lib/habit-utils";
import { FadeIn } from "@/components/ui/FadeIn";

interface ChainsTabProps {
  habits: Habit[];
  logs: HabitLog[];
  chains: HabitChain[];
  onAddChain: (chain: HabitChain) => void;
  onDeleteChain: (id: string) => void;
  onToggle: (habitId: string, date: string) => void;
}

export function ChainsTab({ habits, logs, chains, onAddChain, onDeleteChain, onToggle }: ChainsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [timeOfDay, setTimeOfDay] = useState<HabitChainTimeOfDay>("morning");
  const [bonusXP, setBonusXP] = useState(25);

  const today = new Date().toISOString().slice(0, 10);

  const chainsWithHabits = useMemo(
    () => chains.map((c) => getChainWithHabits(c, habits, logs)),
    [chains, habits, logs]
  );

  function handleAddChain(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    onAddChain({
      id: crypto.randomUUID(),
      name: name.trim(),
      description: "",
      time_of_day: timeOfDay,
      bonus_xp: bonusXP,
      created_at: new Date().toISOString(),
    });
    setName("");
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
            Routines
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="glass-card px-4 py-1.5 rounded-lg text-xs font-body text-white/40 hover:text-white transition-all"
          >
            + New Routine
          </button>
        </div>
      </FadeIn>

      {/* Add form */}
      {showForm && (
        <FadeIn>
          <motion.form
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-4"
            onSubmit={handleAddChain}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Routine name..."
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-body text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/30"
                autoFocus
              />
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as HabitChainTimeOfDay)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-body text-white focus:outline-none focus:border-blue-500/30"
              >
                <option value="morning" className="bg-gray-900">Morning</option>
                <option value="afternoon" className="bg-gray-900">Afternoon</option>
                <option value="evening" className="bg-gray-900">Evening</option>
                <option value="anytime" className="bg-gray-900">Anytime</option>
              </select>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={bonusXP}
                  onChange={(e) => setBonusXP(Number(e.target.value))}
                  placeholder="Bonus XP"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-body text-white focus:outline-none focus:border-blue-500/30"
                />
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="px-4 py-2 rounded-lg text-sm bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 disabled:opacity-30"
                >
                  Add
                </button>
              </div>
            </div>
            <p className="font-body text-[10px] text-white/20 mt-2">
              Assign habits to this routine using the &quot;Routine&quot; field when editing a habit.
            </p>
          </motion.form>
        </FadeIn>
      )}

      {/* Chains list */}
      {chainsWithHabits.length === 0 && !showForm ? (
        <FadeIn>
          <div className="glass-card rounded-2xl p-12 text-center">
            <p className="font-body text-sm text-white/40">
              Create routines to group related habits (e.g. morning routine).
              Completing all habits in a routine earns bonus XP.
            </p>
          </div>
        </FadeIn>
      ) : (
        chainsWithHabits.map((chain, idx) => (
          <FadeIn key={chain.id} delay={idx * 0.05}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card rounded-xl p-5 ${
                chain.all_completed_today ? "border-emerald-500/20" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-body text-sm font-medium text-white">{chain.name}</h4>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30">
                    {chain.time_of_day}
                  </span>
                  {chain.all_completed_today && (
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                      +{chain.bonus_xp} XP Bonus
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onDeleteChain(chain.id)}
                  aria-label={`Delete ${chain.name} routine`}
                  className="p-1 rounded text-white/20 hover:text-red-400 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {chain.habits.length === 0 ? (
                <p className="font-body text-xs text-white/20">
                  No habits assigned. Edit a habit and select this routine.
                </p>
              ) : (
                <div className="space-y-1">
                  {chain.habits.map((habit) => {
                    const completed = isHabitCompletedToday(logs, habit.id);
                    return (
                      <div key={habit.id} className="flex items-center gap-3 py-1.5">
                        <button
                          onClick={() => onToggle(habit.id, today)}
                          role="checkbox"
                          aria-checked={completed}
                          aria-label={`Mark ${habit.name} as ${completed ? "incomplete" : "complete"}`}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            completed
                              ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                              : "border-white/10 hover:border-white/30"
                          }`}
                        >
                          {completed && (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <span className={`font-body text-sm ${completed ? "text-white/40 line-through" : "text-white/70"}`}>
                          {habit.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </FadeIn>
        ))
      )}
    </div>
  );
}
