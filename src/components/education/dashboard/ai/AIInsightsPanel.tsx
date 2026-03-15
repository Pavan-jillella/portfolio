"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StudySession, Course, Note, DashboardProject } from "@/types";
import { getCached, setCache } from "@/lib/ai-cache";

interface AIInsightsData {
  best_time: string;
  velocity: string;
  estimated_completion: string;
  tips: string[];
}

interface AIInsightsPanelProps {
  sessions: StudySession[];
  courses: Course[];
  notes: Note[];
  projects: DashboardProject[];
}

const INSIGHT_CARDS = [
  { key: "best_time" as const, label: "Best Study Time", icon: "clock" },
  { key: "velocity" as const, label: "Learning Velocity", icon: "zap" },
  { key: "estimated_completion" as const, label: "Estimated Completion", icon: "target" },
] as const;

export function AIInsightsPanel({ sessions, courses, notes, projects }: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsightsData | null>(null);
  const [mentorAdvice, setMentorAdvice] = useState<string>("");
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingMentor, setLoadingMentor] = useState(false);
  const [error, setError] = useState<string>("");

  // Load cached insights on mount
  useEffect(() => {
    const cached = getCached<AIInsightsData>("pj-ai-insights");
    if (cached) setInsights(cached);
  }, []);

  const buildSessionsSummary = useCallback(() => {
    const totalMinutes = sessions.reduce((s, x) => s + x.duration_minutes, 0);
    const subjects = Array.from(new Set(sessions.map((s) => s.subject)));
    const recentSessions = sessions.slice(0, 10).map((s) => ({
      subject: s.subject,
      duration: s.duration_minutes,
      date: s.date,
    }));
    return {
      total_sessions: sessions.length,
      total_minutes: totalMinutes,
      subjects,
      recent: recentSessions,
    };
  }, [sessions]);

  const buildCoursesList = useCallback(() => {
    return courses.map((c) => ({
      name: c.name,
      status: c.status,
      progress: c.progress,
      category: c.category,
      platform: c.platform,
    }));
  }, [courses]);

  async function generateInsights() {
    setLoadingInsights(true);
    setError("");
    try {
      const res = await fetch("/api/education/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "insights",
          data: JSON.stringify({
            sessions_summary: buildSessionsSummary(),
            courses_list: buildCoursesList(),
          }),
        }),
      });
      if (!res.ok) throw new Error("Failed to generate insights");
      const json = await res.json();
      const parsed: AIInsightsData =
        typeof json.result === "string" ? JSON.parse(json.result) : json.result;
      setInsights(parsed);
      setCache("pj-ai-insights", parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoadingInsights(false);
    }
  }

  async function askMentor() {
    setLoadingMentor(true);
    setError("");
    try {
      const context = {
        sessions_summary: buildSessionsSummary(),
        courses_list: buildCoursesList(),
        notes_count: notes.length,
        projects: projects.map((p) => ({ name: p.name, status: p.status })),
      };
      const res = await fetch("/api/education/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "mentor",
          data: JSON.stringify(context),
        }),
      });
      if (!res.ok) throw new Error("Failed to get mentor advice");
      const json = await res.json();
      setMentorAdvice(typeof json.result === "string" ? json.result : JSON.stringify(json.result));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoadingMentor(false);
    }
  }

  const iconMap: Record<string, JSX.Element> = {
    clock: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    zap: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    target: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-lg text-white">AI Insights</h3>
        <div className="flex gap-2">
          <button
            onClick={generateInsights}
            disabled={loadingInsights}
            className="glass-card px-4 py-2 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loadingInsights ? "Generating..." : "Generate AI Insights"}
          </button>
          <button
            onClick={askMentor}
            disabled={loadingMentor}
            className="glass-card px-4 py-2 rounded-xl text-sm font-body text-purple-400/80 hover:text-purple-300 transition-all hover:border-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loadingMentor ? "Thinking..." : "Ask AI Mentor"}
          </button>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-body text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading skeleton */}
      {loadingInsights && !insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="glass-card rounded-xl p-4"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15 }}
            >
              <div className="h-4 w-24 bg-white/10 rounded mb-3" />
              <div className="h-6 w-32 bg-white/5 rounded mb-2" />
              <div className="h-3 w-full bg-white/[0.03] rounded" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Insight cards */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {INSIGHT_CARDS.map((card, i) => (
            <motion.div
              key={card.key}
              className="glass-card rounded-xl p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-400">{iconMap[card.icon]}</span>
                <p className="font-body text-xs text-white/40">{card.label}</p>
              </div>
              <p className="font-display font-semibold text-sm text-white">
                {insights[card.key]}
              </p>
            </motion.div>
          ))}

          {/* Tips card */}
          <motion.div
            className="glass-card rounded-xl p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </span>
              <p className="font-body text-xs text-white/40">Tips</p>
            </div>
            <ul className="space-y-1.5">
              {(insights.tips || []).map((tip, idx) => (
                <li key={idx} className="font-body text-xs text-white/60 flex items-start gap-2">
                  <span className="text-emerald-400/60 mt-0.5 shrink-0">&#8226;</span>
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}

      {/* Mentor advice */}
      <AnimatePresence>
        {loadingMentor && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-purple-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                </svg>
              </span>
              <p className="font-body text-xs text-white/40">AI Mentor</p>
            </div>
            <motion.div
              className="flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-purple-400/60"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mentorAdvice && !loadingMentor && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-purple-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                </svg>
              </span>
              <p className="font-body text-xs text-white/40">AI Mentor Advice</p>
            </div>
            <p className="font-body text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
              {mentorAdvice}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!insights && !loadingInsights && !mentorAdvice && !loadingMentor && (
        <div className="text-center py-8">
          <p className="font-body text-sm text-white/20">
            Click &ldquo;Generate AI Insights&rdquo; to analyze your study patterns
          </p>
        </div>
      )}
    </motion.div>
  );
}
