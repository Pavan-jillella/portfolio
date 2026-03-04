"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Course, StudySession, CourseRecommendation } from "@/types";

interface CachedData<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 86400000; // 24 hours

function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed: CachedData<T> = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    const entry: CachedData<T> = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable
  }
}

interface CourseRecommendationsProps {
  courses: Course[];
  sessions: StudySession[];
  onAddCourse: (course: Omit<Course, "id" | "created_at">) => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  intermediate: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  advanced: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  expert: "text-red-400 bg-red-400/10 border-red-400/20",
};

function getDifficultyStyle(difficulty: string): string {
  const key = difficulty.toLowerCase();
  return DIFFICULTY_COLORS[key] ?? "text-white/40 bg-white/5 border-white/10";
}

export function CourseRecommendations({
  courses,
  sessions,
  onAddCourse,
}: CourseRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addedNames, setAddedNames] = useState<Set<string>>(new Set());

  // Load cached recommendations on mount
  useEffect(() => {
    const cached = getCached<CourseRecommendation[]>("pj-ai-recommendations");
    if (cached) setRecommendations(cached);
  }, []);

  async function getRecommendations() {
    setLoading(true);
    setError("");
    try {
      const completedCourses = courses
        .filter((c) => c.status === "completed")
        .map((c) => ({ name: c.name, category: c.category, platform: c.platform }));
      const studySubjects = Array.from(new Set(sessions.map((s) => s.subject)));

      const res = await fetch("/api/education/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "recommendations",
          data: JSON.stringify({
            completed_courses: completedCourses,
            study_subjects: studySubjects,
          }),
        }),
      });
      if (!res.ok) throw new Error("Failed to get recommendations");
      const json = await res.json();
      const parsed: CourseRecommendation[] =
        typeof json.result === "string" ? JSON.parse(json.result) : json.result;
      setRecommendations(parsed);
      setCache("pj-ai-recommendations", parsed);
      setAddedNames(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleAddCourse(rec: CourseRecommendation) {
    onAddCourse({
      name: rec.name,
      platform: "Other",
      url: "",
      progress: 0,
      status: "planned",
      category: (rec.category as Course["category"]) || "Other",
      total_hours: 0,
    });
    setAddedNames((prev) => new Set(prev).add(rec.name));
  }

  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-semibold text-lg text-white">
          Course Recommendations
        </h3>
        <button
          onClick={getRecommendations}
          disabled={loading}
          className="glass-card px-4 py-2 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing..." : "Get AI Recommendations"}
        </button>
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
      {loading && recommendations.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="glass-card rounded-xl p-4"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15 }}
            >
              <div className="h-5 w-40 bg-white/10 rounded mb-3" />
              <div className="h-3 w-full bg-white/5 rounded mb-2" />
              <div className="h-3 w-2/3 bg-white/[0.03] rounded mb-3" />
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-white/5 rounded-full" />
                <div className="h-5 w-20 bg-white/5 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recommendation cards */}
      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, i) => {
            const isAdded = addedNames.has(rec.name);
            return (
              <motion.div
                key={`${rec.name}-${i}`}
                className="glass-card rounded-xl p-4 flex flex-col"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <h4 className="font-display font-semibold text-sm text-white mb-2">
                  {rec.name}
                </h4>
                <p className="font-body text-xs text-white/50 mb-3 flex-1 leading-relaxed">
                  {rec.reason}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${getDifficultyStyle(rec.difficulty)}`}
                  >
                    {rec.difficulty}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 font-mono">
                    {rec.category}
                  </span>
                </div>
                <button
                  onClick={() => handleAddCourse(rec)}
                  disabled={isAdded}
                  className={`w-full py-2 rounded-lg text-xs font-body transition-all ${
                    isAdded
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
                      : "glass-card text-white/60 hover:text-white hover:border-blue-500/30"
                  }`}
                >
                  {isAdded ? "Added to Courses" : "Add to Courses"}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {recommendations.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="font-body text-sm text-white/20">
            Click &ldquo;Get AI Recommendations&rdquo; to discover your next courses
          </p>
        </div>
      )}
    </motion.div>
  );
}
