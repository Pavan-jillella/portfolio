"use client";
import { useState } from "react";
import { StudyGoal } from "@/types";
import { STUDY_SUBJECTS, SUBJECT_COLORS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

interface StudyGoalsTrackerProps {
  goals: StudyGoal[];
  progress: { subject: string; currentHours: number; targetHours: number }[];
  onAddGoal: (goal: Omit<StudyGoal, "id" | "created_at">) => void;
  onDeleteGoal: (id: string) => void;
}

export function StudyGoalsTracker({ goals, progress, onAddGoal, onDeleteGoal }: StudyGoalsTrackerProps) {
  const [newSubject, setNewSubject] = useState(STUDY_SUBJECTS[0]);
  const [newHours, setNewHours] = useState("");

  // Filter out subjects that already have a goal
  const existingSubjects = new Set(goals.map((g) => g.subject));
  const availableSubjects = STUDY_SUBJECTS.filter((s) => !existingSubjects.has(s));

  function handleAdd() {
    const target = parseFloat(newHours);
    if (!target || target <= 0) return;
    onAddGoal({ subject: newSubject, target_hours_per_week: target });
    setNewHours("");
    if (availableSubjects.length > 1) {
      const next = availableSubjects.find((s) => s !== newSubject);
      if (next) setNewSubject(next);
    }
  }

  const inputClass =
    "bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all";
  const selectClass =
    "bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all appearance-none";

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-lg text-white mb-4">Weekly Goals</h3>

      {progress.length === 0 && (
        <p className="font-body text-sm text-white/20 text-center py-4 mb-4">
          No goals set yet. Add a weekly study goal below.
        </p>
      )}

      {/* Goals list */}
      <div className="flex flex-col gap-3 mb-6">
        <AnimatePresence mode="popLayout">
          {progress.map((p) => {
            const goal = goals.find((g) => g.subject === p.subject);
            const percentage = p.targetHours > 0 ? Math.min((p.currentHours / p.targetHours) * 100, 100) : 0;
            const color = SUBJECT_COLORS[p.subject] || "#6b7280";

            return (
              <motion.div
                key={p.subject}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="font-body text-sm text-white/70">{p.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-white/40">
                      {p.currentHours.toFixed(1)} / {p.targetHours}h
                    </span>
                    <span className="font-mono text-xs text-white/60 w-10 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                    {goal && (
                      <button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400/50 hover:text-red-400 ml-1"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add goal inline form */}
      {availableSubjects.length > 0 && (
        <div className="flex items-center gap-3">
          <select
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className={`${selectClass} flex-1`}
          >
            {availableSubjects.map((s) => (
              <option key={s} value={s} className="bg-[#0a0c12]">
                {s}
              </option>
            ))}
          </select>
          <div className="relative">
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={newHours}
              onChange={(e) => setNewHours(e.target.value)}
              className={`${inputClass} w-28`}
              placeholder="hrs/wk"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!newHours || parseFloat(newHours) <= 0}
            className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30 shrink-0"
          >
            Add Goal
          </button>
        </div>
      )}
    </div>
  );
}
