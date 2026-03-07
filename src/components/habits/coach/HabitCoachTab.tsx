"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Habit, HabitLog } from "@/types";
import { FadeIn } from "@/components/ui/FadeIn";

interface HabitCoachTabProps {
  habits: Habit[];
  logs: HabitLog[];
}

export function HabitCoachTab({ habits, logs }: HabitCoachTabProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis() {
    if (habits.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/habits/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habits: habits.map((h) => ({
            name: h.name,
            category: h.category,
            difficulty: h.difficulty,
            frequency_per_week: h.frequency_per_week,
          })),
          logs: logs.slice(0, 500).map((l) => ({
            habit_id: l.habit_id,
            date: l.date,
            completed: l.completed,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to get analysis");
      }

      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (e) {
      setError("Could not generate analysis. Make sure OPENAI_API_KEY is configured.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">
                AI Habit Coach
              </p>
              <p className="font-body text-xs text-white/40">
                Get personalized insights and recommendations based on your habit patterns.
              </p>
            </div>
            <button
              onClick={runAnalysis}
              disabled={loading || habits.length === 0}
              className="glass-card px-5 py-2 rounded-xl text-sm font-body text-blue-400 hover:bg-blue-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing..." : "Analyze Habits"}
            </button>
          </div>

          {habits.length === 0 && (
            <p className="font-body text-sm text-white/20 text-center py-8">
              Add some habits and log completions first to get AI-powered insights.
            </p>
          )}

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
              <p className="font-body text-sm text-red-400">{error}</p>
            </div>
          )}

          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-invert prose-sm max-w-none"
            >
              <div className="rounded-xl bg-white/3 p-4 font-body text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                {analysis}
              </div>
            </motion.div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
