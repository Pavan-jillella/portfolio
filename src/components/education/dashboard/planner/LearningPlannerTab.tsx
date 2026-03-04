"use client";
import { useState, useMemo } from "react";
import { LearningPlan, PlanWeek, StudySession, Course } from "@/types";
import { generateId } from "@/lib/finance-utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STUDY_SUBJECTS } from "@/lib/constants";
import { PlanWeekCard } from "./PlanWeekCard";
import { motion, AnimatePresence } from "framer-motion";

interface LearningPlannerTabProps {
  sessions: StudySession[];
  courses: Course[];
}

const DURATION_OPTIONS = [
  { value: 2, label: "2 Weeks" },
  { value: 4, label: "4 Weeks" },
  { value: 8, label: "8 Weeks" },
  { value: 12, label: "12 Weeks" },
];

const LEVEL_OPTIONS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export function LearningPlannerTab({ sessions, courses }: LearningPlannerTabProps) {
  const [plans, setPlans] = useLocalStorage<LearningPlan[]>("pj-learning-plans", []);
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState(4);
  const [level, setLevel] = useState("beginner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  // Derive current study subjects from sessions
  const studySubjects = useMemo(() => {
    const subjects = new Set(sessions.map((s) => s.subject));
    return Array.from(subjects);
  }, [sessions]);

  // Derive current courses info
  const currentCourses = useMemo(() => {
    return courses
      .filter((c) => c.status === "in-progress" || c.status === "completed")
      .map((c) => `${c.name} (${c.category}, ${c.status})`);
  }, [courses]);

  async function handleGeneratePlan() {
    if (!goal.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/education/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "planner",
          data: JSON.stringify({
            goal: goal.trim(),
            duration: `${duration} weeks`,
            level,
            current_courses: currentCourses,
            study_subjects: studySubjects.length > 0 ? studySubjects : STUDY_SUBJECTS.slice(0, 5),
          }),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate plan");
      }

      const data = await res.json();
      const weeks: PlanWeek[] = (Array.isArray(data.result) ? data.result : []).map(
        (w: { week: number; topic: string; tasks: string[] }) => ({
          week: w.week,
          topic: w.topic,
          tasks: w.tasks || [],
          completed: false,
        })
      );

      if (weeks.length === 0) {
        throw new Error("AI did not return a valid plan. Try again.");
      }

      const newPlan: LearningPlan = {
        id: generateId(),
        goal: goal.trim(),
        duration_weeks: duration,
        level,
        weeks,
        created_at: new Date().toISOString(),
      };

      setPlans((prev) => [newPlan, ...prev]);
      setGoal("");
      setExpandedPlanId(newPlan.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleDeletePlan(planId: string) {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
    if (expandedPlanId === planId) {
      setExpandedPlanId(null);
    }
  }

  function handleToggleWeekComplete(planId: string, weekIndex: number) {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        const updatedWeeks = plan.weeks.map((w, i) =>
          i === weekIndex ? { ...w, completed: !w.completed } : w
        );
        return { ...plan, weeks: updatedWeeks };
      })
    );
  }

  function getPlanCompletionPercent(plan: LearningPlan): number {
    if (plan.weeks.length === 0) return 0;
    const completed = plan.weeks.filter((w) => w.completed).length;
    return Math.round((completed / plan.weeks.length) * 100);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <h2 className="font-display font-semibold text-xl text-white">AI Learning Planner</h2>

      {/* Plan generation form */}
      <motion.div
        className="glass-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-display font-medium text-sm text-white/60 mb-4">
          Generate a Study Plan
        </h3>

        <div className="flex flex-col gap-4">
          {/* Goal input */}
          <div>
            <label className="font-body text-xs text-white/40 block mb-1.5">
              Learning Goal
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Master React and Next.js for full-stack development"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-body text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/30 transition-colors"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Duration dropdown */}
            <div>
              <label className="font-body text-xs text-white/40 block mb-1.5">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-body text-sm text-white focus:outline-none focus:border-blue-500/30 transition-colors appearance-none cursor-pointer"
                disabled={loading}
              >
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-gray-900">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Level dropdown */}
            <div>
              <label className="font-body text-xs text-white/40 block mb-1.5">
                Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-body text-sm text-white focus:outline-none focus:border-blue-500/30 transition-colors appearance-none cursor-pointer"
                disabled={loading}
              >
                {LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-gray-900">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGeneratePlan}
            disabled={loading || !goal.trim()}
            className="glass-card px-6 py-3 rounded-xl font-body text-sm text-white/80 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Generating...
              </>
            ) : (
              "Generate Plan"
            )}
          </button>

          {error && (
            <p className="font-body text-xs text-red-400">{error}</p>
          )}
        </div>
      </motion.div>

      {/* Plans list */}
      {plans.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center">
          <p className="font-body text-sm text-white/30">
            No learning plans yet. Generate your first AI-powered plan above.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {plans.map((plan) => {
            const isExpanded = expandedPlanId === plan.id;
            const completionPercent = getPlanCompletionPercent(plan);
            const createdDate = new Date(plan.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <motion.div
                key={plan.id}
                className="glass-card rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                {/* Plan header (click to expand/collapse) */}
                <button
                  onClick={() =>
                    setExpandedPlanId(isExpanded ? null : plan.id)
                  }
                  className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-semibold text-sm text-white truncate">
                      {plan.goal}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="font-mono text-[10px] text-white/30">
                        {plan.duration_weeks} weeks
                      </span>
                      <span className="font-mono text-[10px] text-white/30 capitalize">
                        {plan.level}
                      </span>
                      <span className="font-mono text-[10px] text-white/20">
                        {createdDate}
                      </span>
                    </div>

                    {/* Completion bar */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500/60 transition-all duration-500"
                          style={{ width: `${completionPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-white/40">
                        {completionPercent}%
                      </span>
                    </div>
                  </div>

                  <svg
                    className={`w-4 h-4 text-white/30 flex-shrink-0 mt-1 transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-white/5">
                        {/* Weekly cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                          {plan.weeks.map((week, idx) => (
                            <PlanWeekCard
                              key={idx}
                              week={week}
                              onToggleComplete={() =>
                                handleToggleWeekComplete(plan.id, idx)
                              }
                            />
                          ))}
                        </div>

                        {/* Delete button */}
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => handleDeletePlan(plan.id)}
                            className="font-body text-xs text-red-400/50 hover:text-red-400 transition-colors px-3 py-1.5"
                          >
                            Delete Plan
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
