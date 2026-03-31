"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target, Trophy, Zap, BookOpen, Clock, Play, Pause, RotateCcw,
  CheckCircle2, XCircle, Brain, TrendingUp, Award, Star,
  Bookmark, BookmarkCheck, ExternalLink, ChevronRight, ChevronDown,
  BarChart3, PieChart, Calendar, Flame, Lightbulb, HelpCircle,
  Timer, Users, Gift, Share2, Download, AlertCircle, Sparkles,
  ListChecks, Filter, Search, Volume2, VolumeX, Flag, ArrowRight,
  RefreshCw, Eye, EyeOff, Copy, Check, Shuffle, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  PROBLEM_BANK,
  ACHIEVEMENTS,
  PATTERN_DESCRIPTIONS,
  type Problem,
  type GooglePrepState,
  type MockInterview,
  type Achievement,
  DEFAULT_GOOGLE_PREP_STATE,
  getProblemById,
  getBlind75Problems,
  getGrind169Problems,
  getGoogleFrequentProblems,
  calculateReadinessScore,
  getDailyChallenge,
  updateAchievements,
  markProblemSolved,
  addBookmark,
  removeBookmark,
  startMockInterview,
  completeMockInterview,
} from "@/lib/google-prep-data";

// ============================================================================
// TAB NAVIGATION
// ============================================================================

type FeatureTab = "mock" | "trainer" | "analytics" | "achievements" | "blind75" | "daily" | "bookmarks";

const FEATURE_TABS: { id: FeatureTab; label: string; icon: typeof Target; color: string }[] = [
  { id: "mock", label: "Mock Interview", icon: Users, color: "text-rose-400" },
  { id: "trainer", label: "Pattern Trainer", icon: Brain, color: "text-violet-400" },
  { id: "analytics", label: "Analytics", icon: BarChart3, color: "text-blue-400" },
  { id: "achievements", label: "Achievements", icon: Trophy, color: "text-amber-400" },
  { id: "blind75", label: "Blind 75", icon: ListChecks, color: "text-emerald-400" },
  { id: "daily", label: "Daily Challenge", icon: Flame, color: "text-orange-400" },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark, color: "text-pink-400" },
];

// ============================================================================
// MOCK INTERVIEW SIMULATOR
// ============================================================================

function MockInterviewPanel({
  state,
  setState,
}: {
  state: GooglePrepState;
  setState: (s: GooglePrepState | ((p: GooglePrepState) => GooglePrepState)) => void;
}) {
  const [isActive, setIsActive] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [timer, setTimer] = useState(45 * 60); // 45 minutes in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState<Problem[]>([]);
  const [showSetup, setShowSetup] = useState(true);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const [problemCount, setProblemCount] = useState(2);
  const [showHint, setShowHint] = useState(false);
  const [approach, setApproach] = useState("");
  const [code, setCode] = useState("");
  const [ratings, setRatings] = useState({ overall: 3, coding: 3, communication: 3, problemSolving: 3 });
  const [notes, setNotes] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [solvedInSession, setSolvedInSession] = useState<string[]>([]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && !isPaused && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const selectRandomProblems = () => {
    let pool = PROBLEM_BANK.filter((p) => !state.solvedProblems.includes(p.id));
    if (difficulty !== "mixed") {
      pool = pool.filter((p) => p.difficulty === difficulty);
    }
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, problemCount);
  };

  const startInterview = () => {
    const problems = selectRandomProblems();
    if (problems.length < problemCount) {
      alert("Not enough unsolved problems in the selected difficulty!");
      return;
    }
    setSelectedProblems(problems);
    setIsActive(true);
    setShowSetup(false);
    setTimer(45 * 60);
    setCurrentProblemIndex(0);
    setSolvedInSession([]);
    setState((prev) => startMockInterview(prev, problems.map((p) => p.id)));
  };

  const markSolved = () => {
    const problem = selectedProblems[currentProblemIndex];
    if (problem && !solvedInSession.includes(problem.id)) {
      setSolvedInSession((prev) => [...prev, problem.id]);
      setState((prev) => markProblemSolved(prev, problem.id, Math.floor((45 * 60 - timer) / problemCount)));
    }
  };

  const endInterview = () => {
    setIsActive(false);
    setShowResults(true);
  };

  const submitResults = () => {
    setState((prev) => completeMockInterview(prev, ratings, notes));
    setShowResults(false);
    setShowSetup(true);
    setSelectedProblems([]);
    setSolvedInSession([]);
    setApproach("");
    setCode("");
    setNotes("");
  };

  const completedMocks = state.mockInterviews.filter((m) => m.status === "completed");
  const avgRating = completedMocks.length > 0
    ? (completedMocks.reduce((sum, m) => sum + m.overallRating, 0) / completedMocks.length).toFixed(1)
    : "N/A";

  if (showResults) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/[0.05] to-violet-500/[0.05] p-6">
          <h3 className="font-display font-bold text-xl text-white mb-2">Mock Interview Complete!</h3>
          <p className="font-body text-sm text-white/40">
            Time: {formatTime(45 * 60 - timer)} | Solved: {solvedInSession.length}/{problemCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5 space-y-4">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Rate Your Performance</p>

          {[
            { key: "overall", label: "Overall Performance" },
            { key: "coding", label: "Coding Skills" },
            { key: "communication", label: "Communication" },
            { key: "problemSolving", label: "Problem Solving Approach" },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-white/60">{label}</span>
                <span className="font-mono text-sm text-white/40">{ratings[key as keyof typeof ratings]}/5</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRatings((r) => ({ ...r, [key]: n }))}
                    className={cn(
                      "flex-1 h-2 rounded-full transition-all",
                      n <= ratings[key as keyof typeof ratings] ? "bg-rose-500" : "bg-white/[0.05]"
                    )}
                  />
                ))}
              </div>
            </div>
          ))}

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes for improvement..."
            rows={3}
            className="w-full mt-4 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none resize-none"
          />

          <button
            onClick={submitResults}
            className="w-full py-3 rounded-xl bg-rose-500/20 text-rose-400 font-mono text-sm hover:bg-rose-500/30 transition-colors"
          >
            Save Results
          </button>
        </div>
      </motion.div>
    );
  }

  if (showSetup) {
    return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4 text-center">
            <Users className="w-5 h-5 mx-auto mb-2 text-rose-400" />
            <p className="font-display font-bold text-2xl text-white">{completedMocks.length}</p>
            <p className="font-mono text-[9px] text-white/25 uppercase">Mocks Done</p>
          </div>
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4 text-center">
            <Star className="w-5 h-5 mx-auto mb-2 text-amber-400" />
            <p className="font-display font-bold text-2xl text-white">{avgRating}</p>
            <p className="font-mono text-[9px] text-white/25 uppercase">Avg Rating</p>
          </div>
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4 text-center">
            <Target className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
            <p className="font-display font-bold text-2xl text-white">{calculateReadinessScore(state)}%</p>
            <p className="font-mono text-[9px] text-white/25 uppercase">Readiness</p>
          </div>
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4 text-center">
            <Clock className="w-5 h-5 mx-auto mb-2 text-blue-400" />
            <p className="font-display font-bold text-2xl text-white">45m</p>
            <p className="font-mono text-[9px] text-white/25 uppercase">Duration</p>
          </div>
        </div>

        {/* Setup */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.02] p-6 space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-rose-400" />
            <span className="font-display font-bold text-white">Start Mock Interview</span>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Difficulty</p>
            <div className="grid grid-cols-4 gap-2">
              {(["easy", "medium", "hard", "mixed"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "py-2.5 rounded-xl font-mono text-xs capitalize transition-all border",
                    difficulty === d
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                      : "bg-white/[0.02] text-white/40 border-white/[0.05] hover:text-white/60"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Number of Problems</p>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setProblemCount(n)}
                  className={cn(
                    "py-2.5 rounded-xl font-mono text-xs transition-all border",
                    problemCount === n
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                      : "bg-white/[0.02] text-white/40 border-white/[0.05] hover:text-white/60"
                  )}
                >
                  {n} Problem{n > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startInterview}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500/30 to-violet-500/30 text-white font-display font-bold flex items-center justify-center gap-2 hover:from-rose-500/40 hover:to-violet-500/40 transition-all"
          >
            <Play className="w-5 h-5" />
            Start Interview
          </button>
        </div>

        {/* Past Interviews */}
        {completedMocks.length > 0 && (
          <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
            <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-4">Past Interviews</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {completedMocks.slice().reverse().slice(0, 5).map((mock) => (
                <div key={mock.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02]">
                  <div>
                    <span className="font-body text-sm text-white/60">
                      {new Date(mock.completedAt || "").toLocaleDateString()}
                    </span>
                    <span className="ml-2 font-mono text-[10px] text-white/25">
                      {formatTime(mock.duration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={cn("w-3 h-3", n <= mock.overallRating ? "text-amber-400 fill-amber-400" : "text-white/10")}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Interview
  const currentProblem = selectedProblems[currentProblemIndex];

  return (
    <div className="space-y-6">
      {/* Timer Bar */}
      <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-r from-rose-500/[0.05] to-violet-500/[0.05] p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={cn("text-3xl font-mono font-bold", timer < 300 ? "text-red-400" : "text-white")}>
              {formatTime(timer)}
            </div>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-lg bg-white/[0.05] text-white/40 hover:text-white/60"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-white/40">
              Problem {currentProblemIndex + 1} / {problemCount}
            </span>
            <button
              onClick={endInterview}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 font-mono text-xs hover:bg-red-500/30"
            >
              End
            </button>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", timer < 300 ? "bg-red-500" : "bg-rose-500")}
            style={{ width: `${(timer / (45 * 60)) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Problem */}
      {currentProblem && (
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display font-bold text-lg text-white">{currentProblem.title}</h3>
                {solvedInSession.includes(currentProblem.id) && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-mono border",
                    currentProblem.difficulty === "easy"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                      : currentProblem.difficulty === "medium"
                      ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                      : "bg-red-500/15 text-red-400 border-red-500/25"
                  )}
                >
                  {currentProblem.difficulty}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] text-white/30">
                  {currentProblem.pattern}
                </span>
              </div>
            </div>
            <a
              href={currentProblem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/[0.05] text-white/40 hover:text-white/60"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Hint Toggle */}
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 text-sm text-white/30 hover:text-white/50"
          >
            {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showHint ? "Hide Pattern Hint" : "Show Pattern Hint"}
          </button>

          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl bg-violet-500/[0.05] border border-violet-500/20 p-4"
              >
                <p className="font-mono text-[10px] text-violet-400 uppercase mb-1">Pattern: {currentProblem.pattern}</p>
                <p className="font-body text-sm text-white/50">
                  {PATTERN_DESCRIPTIONS[currentProblem.pattern] || "Think about the optimal approach..."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Approach Notes */}
          <div className="space-y-2">
            <label className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Your Approach</label>
            <textarea
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              placeholder="Explain your thinking out loud... (practice communication)"
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={markSolved}
              disabled={solvedInSession.includes(currentProblem.id)}
              className={cn(
                "flex-1 py-3 rounded-xl font-mono text-sm flex items-center justify-center gap-2 transition-all",
                solvedInSession.includes(currentProblem.id)
                  ? "bg-emerald-500/20 text-emerald-400 cursor-not-allowed"
                  : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              {solvedInSession.includes(currentProblem.id) ? "Solved" : "Mark Solved"}
            </button>
            {currentProblemIndex < problemCount - 1 && (
              <button
                onClick={() => setCurrentProblemIndex((i) => i + 1)}
                className="flex-1 py-3 rounded-xl bg-white/[0.05] text-white/60 font-mono text-sm flex items-center justify-center gap-2 hover:bg-white/[0.08]"
              >
                Next Problem
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Problem Navigation */}
      <div className="flex gap-2">
        {selectedProblems.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setCurrentProblemIndex(i)}
            className={cn(
              "flex-1 py-2 rounded-xl font-mono text-xs transition-all border",
              currentProblemIndex === i
                ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                : solvedInSession.includes(p.id)
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-white/[0.02] text-white/40 border-white/[0.05]"
            )}
          >
            {i + 1}. {p.title.slice(0, 15)}...
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// PATTERN RECOGNITION TRAINER
// ============================================================================

function PatternTrainerPanel({
  state,
  setState,
}: {
  state: GooglePrepState;
  setState: (s: GooglePrepState | ((p: GooglePrepState) => GooglePrepState)) => void;
}) {
  const [isTraining, setIsTraining] = useState(false);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);

  const patterns = Array.from(new Set(PROBLEM_BANK.map((p) => p.pattern)));

  const getRandomProblem = () => {
    const shuffled = [...PROBLEM_BANK].sort(() => Math.random() - 0.5);
    return shuffled[0];
  };

  const startTraining = () => {
    setIsTraining(true);
    setScore(0);
    setTotal(0);
    setStreak(0);
    nextProblem();
  };

  const nextProblem = () => {
    setCurrentProblem(getRandomProblem());
    setSelectedPattern(null);
    setShowAnswer(false);
  };

  const checkAnswer = (pattern: string) => {
    setSelectedPattern(pattern);
    setShowAnswer(true);
    setTotal((t) => t + 1);

    if (pattern === currentProblem?.pattern) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }

    // Update pattern quiz scores in state
    setState((prev) => ({
      ...prev,
      patternQuizScores: {
        ...prev.patternQuizScores,
        [currentProblem?.pattern || ""]: [
          ...(prev.patternQuizScores[currentProblem?.pattern || ""] || []),
          pattern === currentProblem?.pattern ? 1 : 0,
        ],
      },
      lastUpdated: new Date().toISOString(),
    }));
  };

  const patternStats = useMemo(() => {
    const stats: Record<string, { correct: number; total: number }> = {};
    Object.entries(state.patternQuizScores).forEach(([pattern, scores]) => {
      stats[pattern] = {
        correct: scores.filter((s) => s === 1).length,
        total: scores.length,
      };
    });
    return stats;
  }, [state.patternQuizScores]);

  if (!isTraining) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.05] to-purple-500/[0.05] p-6">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-violet-400" />
            <h3 className="font-display font-bold text-lg text-white">Pattern Recognition Trainer</h3>
          </div>
          <p className="font-body text-sm text-white/40">
            Quickly identify the right pattern for each problem description.
            In interviews, recognizing patterns fast is crucial!
          </p>
        </div>

        {/* Pattern Stats */}
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-4">Pattern Accuracy</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {patterns.slice(0, 12).map((pattern) => {
              const stats = patternStats[pattern];
              const accuracy = stats ? Math.round((stats.correct / stats.total) * 100) : 0;
              return (
                <div key={pattern} className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3">
                  <p className="font-body text-xs text-white/60 truncate mb-1">{pattern}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] mr-2 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", accuracy >= 70 ? "bg-emerald-500" : accuracy >= 40 ? "bg-amber-500" : "bg-red-500")}
                        style={{ width: `${accuracy || 5}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-white/30">{stats?.total || 0}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={startTraining}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500/30 to-purple-500/30 text-white font-display font-bold flex items-center justify-center gap-2 hover:from-violet-500/40 hover:to-purple-500/40 transition-all"
        >
          <Zap className="w-5 h-5" />
          Start Training
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-sm text-white/60">{score}/{total}</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="font-mono text-sm text-white/60">Streak: {streak}</span>
          </div>
        </div>
        <button
          onClick={() => setIsTraining(false)}
          className="px-3 py-1.5 rounded-lg bg-white/[0.05] text-white/40 font-mono text-xs hover:text-white/60"
        >
          Exit
        </button>
      </div>

      {/* Problem Card */}
      {currentProblem && (
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-6">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-3">What pattern fits?</p>
          <h3 className="font-display font-bold text-xl text-white mb-2">{currentProblem.title}</h3>
          <div className="flex items-center gap-2 mb-4">
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-mono border",
                currentProblem.difficulty === "easy"
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                  : currentProblem.difficulty === "medium"
                  ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                  : "bg-red-500/15 text-red-400 border-red-500/25"
              )}
            >
              {currentProblem.difficulty}
            </span>
            <span className="text-[10px] text-white/20">•</span>
            <span className="text-xs text-white/30">{currentProblem.topics.join(", ")}</span>
          </div>

          {/* Pattern Options */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-6">
            {patterns.slice(0, 12).map((pattern) => {
              const isCorrect = pattern === currentProblem.pattern;
              const isSelected = selectedPattern === pattern;

              return (
                <button
                  key={pattern}
                  onClick={() => !showAnswer && checkAnswer(pattern)}
                  disabled={showAnswer}
                  className={cn(
                    "py-3 px-3 rounded-xl font-mono text-xs transition-all border text-left",
                    showAnswer
                      ? isCorrect
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : isSelected
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-white/[0.02] text-white/20 border-white/[0.05]"
                      : "bg-white/[0.02] text-white/50 border-white/[0.05] hover:bg-white/[0.04] hover:text-white/70"
                  )}
                >
                  {pattern}
                </button>
              );
            })}
          </div>

          {/* Answer Explanation */}
          <AnimatePresence>
            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <div
                  className={cn(
                    "rounded-xl p-4 border",
                    selectedPattern === currentProblem.pattern
                      ? "bg-emerald-500/[0.05] border-emerald-500/20"
                      : "bg-red-500/[0.05] border-red-500/20"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {selectedPattern === currentProblem.pattern ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="font-display font-bold text-white">
                      {selectedPattern === currentProblem.pattern ? "Correct!" : "Not quite..."}
                    </span>
                  </div>
                  <p className="font-body text-sm text-white/50">
                    <strong className="text-white/70">{currentProblem.pattern}:</strong>{" "}
                    {PATTERN_DESCRIPTIONS[currentProblem.pattern]}
                  </p>
                </div>
                <button
                  onClick={nextProblem}
                  className="w-full mt-4 py-3 rounded-xl bg-violet-500/20 text-violet-400 font-mono text-sm hover:bg-violet-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  Next Problem
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ANALYTICS DASHBOARD
// ============================================================================

function AnalyticsPanel({ state }: { state: GooglePrepState }) {
  const solvedProblems = state.solvedProblems.map((id) => getProblemById(id)).filter(Boolean) as Problem[];

  const difficultyBreakdown = useMemo(() => {
    const counts = { easy: 0, medium: 0, hard: 0 };
    solvedProblems.forEach((p) => counts[p.difficulty]++);
    return counts;
  }, [solvedProblems]);

  const patternBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    solvedProblems.forEach((p) => {
      counts[p.pattern] = (counts[p.pattern] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [solvedProblems]);

  const dailyActivity = useMemo(() => {
    const last30Days: { date: string; count: number }[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      last30Days.push({
        date: dateStr,
        count: state.analytics.dailyActivity[dateStr] || 0,
      });
    }
    return last30Days;
  }, [state.analytics.dailyActivity]);

  const maxDaily = Math.max(...dailyActivity.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Readiness Score */}
      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.05] to-cyan-500/[0.05] p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-1">Google Interview Readiness</p>
            <p className="font-display font-extrabold text-5xl text-white">{calculateReadinessScore(state)}%</p>
          </div>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90">
              <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="url(#readiness-gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(calculateReadinessScore(state) / 100) * 251.2} 251.2`}
              />
              <defs>
                <linearGradient id="readiness-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4 text-center">
          <Target className="w-5 h-5 mx-auto mb-2 text-emerald-400" />
          <p className="font-display font-bold text-2xl text-white">{state.solvedProblems.length}</p>
          <p className="font-mono text-[9px] text-white/25 uppercase">Solved</p>
        </div>
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4 text-center">
          <Clock className="w-5 h-5 mx-auto mb-2 text-blue-400" />
          <p className="font-display font-bold text-2xl text-white">{Math.round(state.analytics.totalStudyTime / 60)}h</p>
          <p className="font-mono text-[9px] text-white/25 uppercase">Study Time</p>
        </div>
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4 text-center">
          <Flame className="w-5 h-5 mx-auto mb-2 text-orange-400" />
          <p className="font-display font-bold text-2xl text-white">{state.currentDailyStreak}</p>
          <p className="font-mono text-[9px] text-white/25 uppercase">Current Streak</p>
        </div>
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4 text-center">
          <Brain className="w-5 h-5 mx-auto mb-2 text-violet-400" />
          <p className="font-display font-bold text-2xl text-white">{patternBreakdown.length}</p>
          <p className="font-mono text-[9px] text-white/25 uppercase">Patterns</p>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
        <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-4">30-Day Activity</p>
        <div className="grid grid-cols-15 gap-1">
          {dailyActivity.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.count} problems`}
              className={cn(
                "w-full aspect-square rounded-sm transition-all",
                day.count === 0
                  ? "bg-white/[0.03]"
                  : day.count <= maxDaily * 0.25
                  ? "bg-emerald-500/30"
                  : day.count <= maxDaily * 0.5
                  ? "bg-emerald-500/50"
                  : day.count <= maxDaily * 0.75
                  ? "bg-emerald-500/70"
                  : "bg-emerald-500"
              )}
            />
          ))}
        </div>
      </div>

      {/* Difficulty & Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty */}
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-4">By Difficulty</p>
          <div className="space-y-3">
            {(["easy", "medium", "hard"] as const).map((diff) => {
              const count = difficultyBreakdown[diff];
              const total = PROBLEM_BANK.filter((p) => p.difficulty === diff).length;
              return (
                <div key={diff} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={cn("font-body text-sm capitalize", diff === "easy" ? "text-emerald-400" : diff === "medium" ? "text-amber-400" : "text-red-400")}>
                      {diff}
                    </span>
                    <span className="font-mono text-xs text-white/30">{count}/{total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", diff === "easy" ? "bg-emerald-500" : diff === "medium" ? "bg-amber-500" : "bg-red-500")}
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Patterns */}
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-4">Top Patterns</p>
          <div className="space-y-2">
            {patternBreakdown.slice(0, 6).map(([pattern, count]) => (
              <div key={pattern} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02]">
                <span className="font-body text-sm text-white/60">{pattern}</span>
                <span className="font-mono text-xs text-blue-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ACHIEVEMENTS PANEL
// ============================================================================

function AchievementsPanel({ state }: { state: GooglePrepState }) {
  const unlockedCount = state.achievements.filter((a) => a.unlocked).length;
  const categories = ["problems", "streak", "patterns", "mock", "special"] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.05] to-orange-500/[0.05] p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="font-display font-bold text-white">Achievements</span>
            </div>
            <p className="font-body text-sm text-white/40">
              {unlockedCount}/{state.achievements.length} unlocked
            </p>
          </div>
          <div className="text-4xl font-display font-extrabold text-amber-400">{unlockedCount}</div>
        </div>
      </div>

      {/* By Category */}
      {categories.map((category) => {
        const achievements = state.achievements.filter((a) => a.category === category);
        return (
          <div key={category} className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
            <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-4 capitalize">{category}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={cn(
                    "rounded-xl p-4 border transition-all",
                    achievement.unlocked
                      ? "bg-amber-500/[0.05] border-amber-500/20"
                      : "bg-white/[0.01] border-white/[0.04] opacity-60"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className={cn("font-display font-bold text-sm", achievement.unlocked ? "text-white" : "text-white/50")}>
                        {achievement.title}
                      </h4>
                      <p className="font-body text-xs text-white/30 mb-2">{achievement.description}</p>
                      {!achievement.unlocked && (
                        <div className="space-y-1">
                          <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                            <div
                              className="h-full rounded-full bg-amber-500/50"
                              style={{ width: `${Math.min((achievement.progress / achievement.requirement) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="font-mono text-[9px] text-white/20">
                            {achievement.progress}/{achievement.requirement}
                          </span>
                        </div>
                      )}
                      {achievement.unlocked && achievement.unlockedAt && (
                        <span className="font-mono text-[9px] text-amber-400">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// BLIND 75 / GRIND 169 TRACKER
// ============================================================================

function Blind75Panel({
  state,
  setState,
}: {
  state: GooglePrepState;
  setState: (s: GooglePrepState | ((p: GooglePrepState) => GooglePrepState)) => void;
}) {
  const [activeList, setActiveList] = useState<"blind75" | "grind169" | "google">("blind75");
  const [filter, setFilter] = useState<"all" | "solved" | "unsolved">("all");
  const [patternFilter, setPatternFilter] = useState<string>("all");

  const problems = useMemo(() => {
    let list: Problem[];
    if (activeList === "blind75") list = getBlind75Problems();
    else if (activeList === "grind169") list = getGrind169Problems();
    else list = getGoogleFrequentProblems();

    if (filter === "solved") list = list.filter((p) => state.solvedProblems.includes(p.id));
    if (filter === "unsolved") list = list.filter((p) => !state.solvedProblems.includes(p.id));
    if (patternFilter !== "all") list = list.filter((p) => p.pattern === patternFilter);

    return list;
  }, [activeList, filter, patternFilter, state.solvedProblems]);

  const patterns = Array.from(new Set(PROBLEM_BANK.map((p) => p.pattern)));

  const stats = useMemo(() => {
    const blind75 = getBlind75Problems();
    const grind169 = getGrind169Problems();
    const google = getGoogleFrequentProblems();

    return {
      blind75: { solved: blind75.filter((p) => state.solvedProblems.includes(p.id)).length, total: blind75.length },
      grind169: { solved: grind169.filter((p) => state.solvedProblems.includes(p.id)).length, total: grind169.length },
      google: { solved: google.filter((p) => state.solvedProblems.includes(p.id)).length, total: google.length },
    };
  }, [state.solvedProblems]);

  const handleToggle = (problemId: string) => {
    if (state.solvedProblems.includes(problemId)) {
      setState((prev) => ({
        ...prev,
        solvedProblems: prev.solvedProblems.filter((id) => id !== problemId),
        lastUpdated: new Date().toISOString(),
      }));
    } else {
      setState((prev) => markProblemSolved(prev, problemId));
    }
  };

  const handleBookmark = (problemId: string) => {
    if (state.bookmarks.some((b) => b.problemId === problemId)) {
      setState((prev) => removeBookmark(prev, problemId));
    } else {
      setState((prev) => addBookmark(prev, problemId));
    }
  };

  return (
    <div className="space-y-6">
      {/* List Selector */}
      <div className="grid grid-cols-3 gap-3">
        {([
          { id: "blind75", label: "Blind 75", color: "emerald" },
          { id: "grind169", label: "Grind 169", color: "blue" },
          { id: "google", label: "Google Freq", color: "rose" },
        ] as const).map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => setActiveList(id)}
            className={cn(
              "py-4 rounded-xl border transition-all",
              activeList === id
                ? `bg-${color}-500/20 border-${color}-500/30`
                : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]"
            )}
          >
            <p className={cn("font-display font-bold text-2xl", activeList === id ? `text-${color}-400` : "text-white")}>
              {stats[id].solved}/{stats[id].total}
            </p>
            <p className="font-mono text-[10px] text-white/30 uppercase">{label}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex gap-2">
          {(["all", "unsolved", "solved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl font-mono text-xs capitalize transition-all border",
                filter === f
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-white/[0.02] text-white/40 border-white/[0.05] hover:text-white/60"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <select
          value={patternFilter}
          onChange={(e) => setPatternFilter(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white outline-none"
        >
          <option value="all">All Patterns</option>
          {patterns.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Problem List */}
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4">
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {problems.map((problem) => {
            const isSolved = state.solvedProblems.includes(problem.id);
            const isBookmarked = state.bookmarks.some((b) => b.problemId === problem.id);

            return (
              <div
                key={problem.id}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isSolved ? "bg-emerald-500/[0.05]" : "bg-white/[0.02] hover:bg-white/[0.04]"
                )}
              >
                <button
                  onClick={() => handleToggle(problem.id)}
                  className={cn(
                    "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                    isSolved ? "bg-emerald-500 border-emerald-400" : "border-white/20 hover:border-white/40"
                  )}
                >
                  {isSolved && <Check className="w-3 h-3 text-white" />}
                </button>

                <div className="flex-1 min-w-0">
                  <a
                    href={problem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("font-body text-sm hover:underline truncate block", isSolved ? "text-white/60" : "text-white/80")}
                  >
                    {problem.title}
                  </a>
                </div>

                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-mono border flex-shrink-0",
                    problem.difficulty === "easy"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                      : problem.difficulty === "medium"
                      ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                      : "bg-red-500/15 text-red-400 border-red-500/25"
                  )}
                >
                  {problem.difficulty}
                </span>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] text-white/30 flex-shrink-0 hidden md:block">
                  {problem.pattern}
                </span>

                <button onClick={() => handleBookmark(problem.id)} className="p-1.5 rounded text-white/20 hover:text-pink-400 transition-colors">
                  {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-pink-400" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DAILY CHALLENGE
// ============================================================================

function DailyChallengePanel({
  state,
  setState,
}: {
  state: GooglePrepState;
  setState: (s: GooglePrepState | ((p: GooglePrepState) => GooglePrepState)) => void;
}) {
  const today = new Date().toISOString().split("T")[0];
  const dailyProblem = getDailyChallenge(state);
  const todayChallenge = state.dailyChallenges.find((c) => c.date === today);
  const isCompleted = todayChallenge?.completed || false;

  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && !isCompleted) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const completeDailyChallenge = () => {
    const newChallenge = {
      date: today,
      problemId: dailyProblem.id,
      completed: true,
      completedAt: new Date().toISOString(),
      timeSpent: timer,
    };

    setState((prev) => {
      const filteredChallenges = prev.dailyChallenges.filter((c) => c.date !== today);
      const newState = {
        ...prev,
        dailyChallenges: [...filteredChallenges, newChallenge],
        currentDailyStreak: prev.currentDailyStreak + 1,
        longestDailyStreak: Math.max(prev.longestDailyStreak, prev.currentDailyStreak + 1),
        lastUpdated: new Date().toISOString(),
      };

      // Also mark as solved
      if (!prev.solvedProblems.includes(dailyProblem.id)) {
        return markProblemSolved(newState, dailyProblem.id, timer);
      }
      return { ...newState, achievements: updateAchievements(newState) };
    });

    setIsActive(false);
  };

  const recentChallenges = state.dailyChallenges.slice(-7).reverse();
  const weeklyProgress = recentChallenges.filter((c) => c.completed).length;

  return (
    <div className="space-y-6">
      {/* Streak Banner */}
      <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/[0.05] to-amber-500/[0.05] p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="font-display font-bold text-white">Daily Challenge Streak</span>
            </div>
            <p className="font-body text-sm text-white/40">
              {weeklyProgress}/7 this week • Best: {state.longestDailyStreak} days
            </p>
          </div>
          <div className="text-4xl font-display font-extrabold text-orange-400">{state.currentDailyStreak}</div>
        </div>
      </div>

      {/* Today's Challenge */}
      <div className={cn("rounded-2xl border p-6", isCompleted ? "border-emerald-500/20 bg-emerald-500/[0.02]" : "border-white/[0.05] bg-white/[0.015]")}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Today&apos;s Challenge</span>
          </div>
          {isCompleted && (
            <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">
              Completed!
            </span>
          )}
        </div>

        <h3 className="font-display font-bold text-xl text-white mb-2">{dailyProblem.title}</h3>
        <div className="flex items-center gap-2 mb-4">
          <span
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-mono border",
              dailyProblem.difficulty === "easy"
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                : dailyProblem.difficulty === "medium"
                ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                : "bg-red-500/15 text-red-400 border-red-500/25"
            )}
          >
            {dailyProblem.difficulty}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] text-white/30">{dailyProblem.pattern}</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-500/10 text-orange-400">
            ~{dailyProblem.timeEstimate}min
          </span>
        </div>

        {!isCompleted && (
          <div className="space-y-4">
            {/* Timer */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-orange-400" />
                <span className="font-mono text-2xl text-white">{formatTime(timer)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isActive ? "bg-orange-500/20 text-orange-400" : "bg-white/[0.05] text-white/40"
                  )}
                >
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button onClick={() => setTimer(0)} className="p-2 rounded-lg bg-white/[0.05] text-white/40 hover:text-white/60">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <a
                href={dailyProblem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl bg-white/[0.05] text-white/60 font-mono text-sm flex items-center justify-center gap-2 hover:bg-white/[0.08]"
              >
                <ExternalLink className="w-4 h-4" />
                Open Problem
              </a>
              <button
                onClick={completeDailyChallenge}
                className="flex-1 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 font-mono text-sm flex items-center justify-center gap-2 hover:bg-emerald-500/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark Complete
              </button>
            </div>
          </div>
        )}

        {isCompleted && todayChallenge && (
          <div className="flex items-center gap-4 text-sm text-white/40">
            <span>Completed in {formatTime(todayChallenge.timeSpent || 0)}</span>
          </div>
        )}
      </div>

      {/* Recent History */}
      <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-5">
        <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-4">This Week</p>
        <div className="flex gap-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const dateStr = date.toISOString().split("T")[0];
            const challenge = state.dailyChallenges.find((c) => c.date === dateStr);
            const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

            return (
              <div key={i} className="flex-1 text-center">
                <div
                  className={cn(
                    "w-full aspect-square rounded-xl mb-1 flex items-center justify-center",
                    challenge?.completed
                      ? "bg-emerald-500/20"
                      : dateStr === today
                      ? "bg-orange-500/20 border border-orange-500/30"
                      : "bg-white/[0.03]"
                  )}
                >
                  {challenge?.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : dateStr === today ? (
                    <Flame className="w-4 h-4 text-orange-400" />
                  ) : null}
                </div>
                <span className="font-mono text-[9px] text-white/25">{dayName}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BOOKMARKS PANEL
// ============================================================================

function BookmarksPanel({
  state,
  setState,
}: {
  state: GooglePrepState;
  setState: (s: GooglePrepState | ((p: GooglePrepState) => GooglePrepState)) => void;
}) {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "low" | "medium" | "high">("all");

  const bookmarkedProblems = useMemo(() => {
    let bookmarks = state.bookmarks.map((b) => ({
      ...b,
      problem: getProblemById(b.problemId),
    })).filter((b) => b.problem);

    if (search) {
      bookmarks = bookmarks.filter((b) => b.problem?.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (priorityFilter !== "all") {
      bookmarks = bookmarks.filter((b) => b.priority === priorityFilter);
    }

    return bookmarks;
  }, [state.bookmarks, search, priorityFilter]);

  const handleRemove = (problemId: string) => {
    setState((prev) => removeBookmark(prev, problemId));
  };

  const handlePriorityChange = (problemId: string, priority: "low" | "medium" | "high") => {
    setState((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.map((b) => (b.problemId === problemId ? { ...b, priority } : b)),
      lastUpdated: new Date().toISOString(),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/[0.05] to-rose-500/[0.05] p-6">
        <div className="flex items-center gap-2 mb-1">
          <Bookmark className="w-5 h-5 text-pink-400" />
          <span className="font-display font-bold text-white">Bookmarked Problems</span>
        </div>
        <p className="font-body text-sm text-white/40">{state.bookmarks.length} problems saved for later</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bookmarks..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none focus:border-pink-500/30"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "high", "medium", "low"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={cn(
                "px-4 py-2 rounded-xl font-mono text-xs capitalize transition-all border",
                priorityFilter === p
                  ? "bg-pink-500/20 text-pink-400 border-pink-500/30"
                  : "bg-white/[0.02] text-white/40 border-white/[0.05] hover:text-white/60"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmarks List */}
      {bookmarkedProblems.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.05] bg-white/[0.015] p-8 text-center">
          <Bookmark className="w-8 h-8 text-white/10 mx-auto mb-3" />
          <p className="font-body text-sm text-white/30">No bookmarks yet. Star problems to save them here!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarkedProblems.map(({ problemId, problem, priority, addedAt }) => {
            if (!problem) return null;
            const isSolved = state.solvedProblems.includes(problemId);

            return (
              <div
                key={problemId}
                className={cn(
                  "rounded-xl border p-4 transition-all",
                  isSolved ? "bg-emerald-500/[0.03] border-emerald-500/15" : "bg-white/[0.015] border-white/[0.05]"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {isSolved && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-display font-bold text-sm text-white hover:text-pink-400 transition-colors truncate"
                      >
                        {problem.title}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono border",
                          problem.difficulty === "easy"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                            : problem.difficulty === "medium"
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                            : "bg-red-500/15 text-red-400 border-red-500/25"
                        )}
                      >
                        {problem.difficulty}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.03] text-white/30">{problem.pattern}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Priority Selector */}
                    <select
                      value={priority}
                      onChange={(e) => handlePriorityChange(problemId, e.target.value as "low" | "medium" | "high")}
                      className={cn(
                        "px-2 py-1 rounded-lg text-[10px] font-mono outline-none cursor-pointer",
                        priority === "high"
                          ? "bg-red-500/20 text-red-400"
                          : priority === "medium"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-white/[0.05] text-white/40"
                      )}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>

                    <button onClick={() => handleRemove(problemId)} className="p-1.5 rounded text-white/20 hover:text-red-400 transition-colors">
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export default function AdvancedFeatures() {
  const [activeTab, setActiveTab] = useState<FeatureTab>("mock");
  const [state, setState] = useLocalStorage<GooglePrepState>("pj-google-prep-state", DEFAULT_GOOGLE_PREP_STATE);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {FEATURE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-sm transition-all whitespace-nowrap border",
              activeTab === tab.id
                ? `bg-${tab.color.replace("text-", "")}/20 ${tab.color} border-${tab.color.replace("text-", "")}/30`
                : "text-white/40 hover:text-white/60 bg-white/[0.02] border-white/[0.05]"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {activeTab === "mock" && <MockInterviewPanel state={state} setState={setState} />}
          {activeTab === "trainer" && <PatternTrainerPanel state={state} setState={setState} />}
          {activeTab === "analytics" && <AnalyticsPanel state={state} />}
          {activeTab === "achievements" && <AchievementsPanel state={state} />}
          {activeTab === "blind75" && <Blind75Panel state={state} setState={setState} />}
          {activeTab === "daily" && <DailyChallengePanel state={state} setState={setState} />}
          {activeTab === "bookmarks" && <BookmarksPanel state={state} setState={setState} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
