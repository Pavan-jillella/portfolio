"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Code,
  Lightbulb,
  ExternalLink,
  CheckCircle2,
  Circle,
  Flame,
  Target,
  Calendar,
  Trophy,
  Sparkles,
  GraduationCap,
  Rocket,
  Zap,
  Brain,
  ArrowRight,
} from "lucide-react";
import {
  DAILY_PLANS,
  getDayPlan,
  getPhaseNames,
  getTotalDays,
  type DailyPlan,
  type DailyQuestionsProgress,
  type DailyProgress,
  DEFAULT_DAILY_PROGRESS,
} from "@/lib/roadmap-daily-questions";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const PHASE_COLORS: Record<number, { bg: string; text: string; border: string; gradient: string }> = {
  1: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30", gradient: "from-emerald-500/20" },
  2: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30", gradient: "from-blue-500/20" },
  3: { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/30", gradient: "from-violet-500/20" },
  4: { bg: "bg-fuchsia-500/20", text: "text-fuchsia-400", border: "border-fuchsia-500/30", gradient: "from-fuchsia-500/20" },
  5: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30", gradient: "from-orange-500/20" },
  6: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30", gradient: "from-amber-500/20" },
  7: { bg: "bg-rose-500/20", text: "text-rose-400", border: "border-rose-500/30", gradient: "from-rose-500/20" },
  8: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30", gradient: "from-cyan-500/20" },
};

const TIP_ICONS: Record<string, typeof Lightbulb> = {
  shortcut: Zap,
  pattern: Brain,
  trick: Sparkles,
  mindset: GraduationCap,
  optimization: Rocket,
};

const DIFFICULTY_COLORS = {
  easy: "bg-green-500/20 text-green-400 border-green-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  hard: "bg-red-500/20 text-red-400 border-red-500/30",
};

const SOURCE_BADGES: Record<string, { bg: string; label: string }> = {
  leetcode: { bg: "bg-orange-500/20 text-orange-300", label: "LeetCode" },
  hackerrank: { bg: "bg-green-500/20 text-green-300", label: "HackerRank" },
  geeksforgeeks: { bg: "bg-emerald-500/20 text-emerald-300", label: "GFG" },
  "python.org": { bg: "bg-blue-500/20 text-blue-300", label: "Python.org" },
  codeforces: { bg: "bg-red-500/20 text-red-300", label: "Codeforces" },
  codewars: { bg: "bg-purple-500/20 text-purple-300", label: "Codewars" },
  neetcode: { bg: "bg-cyan-500/20 text-cyan-300", label: "NeetCode" },
};

export default function DailyQuestionsView() {
  const [progress, setProgress] = useLocalStorage<DailyQuestionsProgress>(
    "pj-daily-questions-progress",
    DEFAULT_DAILY_PROGRESS
  );
  const [currentDay, setCurrentDay] = useState(progress.currentDay || 1);
  const [dayPlan, setDayPlan] = useState<DailyPlan | undefined>(getDayPlan(currentDay));

  useEffect(() => {
    setDayPlan(getDayPlan(currentDay));
  }, [currentDay]);

  const totalDays = getTotalDays();
  const phases = getPhaseNames();

  const getCurrentDayProgress = useCallback((): DailyProgress | undefined => {
    return progress.dailyProgress.find((dp) => dp.day === currentDay);
  }, [progress.dailyProgress, currentDay]);

  const toggleProblemComplete = (problemTitle: string) => {
    setProgress((prev) => {
      const dayProgress = prev.dailyProgress.find((dp) => dp.day === currentDay);
      let newDailyProgress: DailyProgress[];

      if (dayProgress) {
        const isCompleted = dayProgress.problemsCompleted.includes(problemTitle);
        newDailyProgress = prev.dailyProgress.map((dp) =>
          dp.day === currentDay
            ? {
                ...dp,
                problemsCompleted: isCompleted
                  ? dp.problemsCompleted.filter((p) => p !== problemTitle)
                  : [...dp.problemsCompleted, problemTitle],
              }
            : dp
        );
      } else {
        newDailyProgress = [
          ...prev.dailyProgress,
          {
            day: currentDay,
            completed: false,
            problemsCompleted: [problemTitle],
            theoryRead: false,
          },
        ];
      }

      const totalProblemsCompleted = newDailyProgress.reduce(
        (sum, dp) => sum + dp.problemsCompleted.length,
        0
      );

      return {
        ...prev,
        dailyProgress: newDailyProgress,
        totalProblemsCompleted,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const toggleTheoryRead = () => {
    setProgress((prev) => {
      const dayProgress = prev.dailyProgress.find((dp) => dp.day === currentDay);
      let newDailyProgress: DailyProgress[];

      if (dayProgress) {
        newDailyProgress = prev.dailyProgress.map((dp) =>
          dp.day === currentDay ? { ...dp, theoryRead: !dp.theoryRead } : dp
        );
      } else {
        newDailyProgress = [
          ...prev.dailyProgress,
          {
            day: currentDay,
            completed: false,
            problemsCompleted: [],
            theoryRead: true,
          },
        ];
      }

      return {
        ...prev,
        dailyProgress: newDailyProgress,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const markDayComplete = () => {
    if (!dayPlan) return;

    setProgress((prev) => {
      const dayProgress = prev.dailyProgress.find((dp) => dp.day === currentDay);
      let newDailyProgress: DailyProgress[];

      if (dayProgress) {
        newDailyProgress = prev.dailyProgress.map((dp) =>
          dp.day === currentDay
            ? { ...dp, completed: true, completedAt: new Date().toISOString() }
            : dp
        );
      } else {
        newDailyProgress = [
          ...prev.dailyProgress,
          {
            day: currentDay,
            completed: true,
            completedAt: new Date().toISOString(),
            problemsCompleted: dayPlan.problems.map((p) => p.title),
            theoryRead: true,
          },
        ];
      }

      // Update streak
      const today = new Date().toDateString();
      const lastActive = prev.lastActiveDate;
      let newStreak = prev.streak;

      if (lastActive !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        newStreak = lastActive === yesterday ? prev.streak + 1 : 1;
      }

      // Move to next day if available
      const nextDay = currentDay < totalDays ? currentDay + 1 : currentDay;

      return {
        ...prev,
        dailyProgress: newDailyProgress,
        currentDay: nextDay,
        streak: newStreak,
        lastActiveDate: today,
        updatedAt: new Date().toISOString(),
      };
    });

    if (currentDay < totalDays) {
      setCurrentDay(currentDay + 1);
    }
  };

  const currentDayProgress = getCurrentDayProgress();
  const phaseColor = dayPlan ? PHASE_COLORS[dayPlan.phase] : PHASE_COLORS[1];

  const isDayComplete = currentDayProgress?.completed || false;
  const problemsCompleted = currentDayProgress?.problemsCompleted || [];
  const theoryRead = currentDayProgress?.theoryRead || false;

  const allProblemsComplete = dayPlan
    ? dayPlan.problems.every((p) => problemsCompleted.includes(p.title))
    : false;

  if (!dayPlan) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-neutral-400">Day {currentDay} plan not available yet.</p>
        <p className="text-sm text-neutral-500 mt-2">
          Coming soon! We&apos;re adding more days to the roadmap.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/20">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{progress.streak}</p>
            <p className="text-xs text-neutral-400">Day Streak</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20">
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{progress.totalProblemsCompleted}</p>
            <p className="text-xs text-neutral-400">Problems Solved</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {currentDay}/{totalDays}
            </p>
            <p className="text-xs text-neutral-400">Current Day</p>
          </div>
        </div>

        <div className="glass-card p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Trophy className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {progress.dailyProgress.filter((d) => d.completed).length}
            </p>
            <p className="text-xs text-neutral-400">Days Completed</p>
          </div>
        </div>
      </div>

      {/* Day Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
          disabled={currentDay <= 1}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${phaseColor.bg} ${phaseColor.text}`}
            >
              Phase {dayPlan.phase}
            </span>
            {isDayComplete && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                Completed
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold mt-2">Day {currentDay}</h2>
          <p className="text-neutral-400 text-sm">{dayPlan.phaseName}</p>
        </div>

        <button
          onClick={() => setCurrentDay(Math.min(totalDays, currentDay + 1))}
          disabled={currentDay >= totalDays}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Selector Dropdown */}
      <div className="flex justify-center">
        <select
          value={currentDay}
          onChange={(e) => setCurrentDay(Number(e.target.value))}
          className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          {DAILY_PLANS.map((plan) => (
            <option key={plan.day} value={plan.day} className="bg-neutral-900">
              Day {plan.day}: {plan.topic}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDay}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Topic Header */}
          <div
            className={`glass-card p-6 border ${phaseColor.border} bg-gradient-to-r ${phaseColor.gradient} to-transparent`}
          >
            <h3 className={`text-xl font-bold ${phaseColor.text}`}>{dayPlan.topic}</h3>
            <p className="text-neutral-300 mt-2 text-sm leading-relaxed">
              {dayPlan.keyConceptsSummary}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Theory & Tips */}
            <div className="space-y-6">
              {/* Theory to Read */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold">Theory to Read</h4>
                  </div>
                  <button
                    onClick={toggleTheoryRead}
                    className={`p-1.5 rounded-lg transition-colors ${
                      theoryRead
                        ? "bg-green-500/20 text-green-400"
                        : "bg-white/5 text-neutral-400 hover:bg-white/10"
                    }`}
                  >
                    {theoryRead ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  {dayPlan.theoryToRead.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm group-hover:text-blue-400 transition-colors">
                          {resource.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-neutral-500">{resource.source}</span>
                          {resource.estimatedTime && (
                            <>
                              <span className="text-neutral-600">•</span>
                              <span className="text-xs text-neutral-500">
                                {resource.estimatedTime}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Learning Tips */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <h4 className="font-semibold">Learning Tips & Shortcuts</h4>
                </div>

                <div className="space-y-3">
                  {dayPlan.learningTips.map((tip, idx) => {
                    const TipIcon = TIP_ICONS[tip.category] || Lightbulb;
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                      >
                        <div
                          className={`p-1.5 rounded-lg flex-shrink-0 ${
                            tip.category === "shortcut"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : tip.category === "pattern"
                              ? "bg-blue-500/20 text-blue-400"
                              : tip.category === "trick"
                              ? "bg-purple-500/20 text-purple-400"
                              : tip.category === "mindset"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-orange-500/20 text-orange-400"
                          }`}
                        >
                          <TipIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-neutral-300">{tip.tip}</p>
                          <span
                            className={`text-xs mt-1 inline-block px-2 py-0.5 rounded ${
                              tip.category === "shortcut"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : tip.category === "pattern"
                                ? "bg-blue-500/10 text-blue-500"
                                : tip.category === "trick"
                                ? "bg-purple-500/10 text-purple-500"
                                : tip.category === "mindset"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-orange-500/10 text-orange-500"
                            }`}
                          >
                            {tip.category}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column - Problems */}
            <div className="space-y-6">
              {/* Problems to Solve */}
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-semibold">Problems to Solve</h4>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {problemsCompleted.length}/{dayPlan.problems.length} completed
                  </span>
                </div>

                <div className="space-y-3">
                  {dayPlan.problems.map((problem, idx) => {
                    const isComplete = problemsCompleted.includes(problem.title);
                    const sourceBadge = SOURCE_BADGES[problem.source];

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border transition-all ${
                          isComplete
                            ? "bg-green-500/10 border-green-500/30"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleProblemComplete(problem.title)}
                            className={`mt-0.5 flex-shrink-0 transition-colors ${
                              isComplete ? "text-green-400" : "text-neutral-500 hover:text-white"
                            }`}
                          >
                            {isComplete ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <a
                                href={problem.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`font-medium hover:underline ${
                                  isComplete ? "text-green-400" : "text-white"
                                }`}
                              >
                                {problem.number && `${problem.number}. `}
                                {problem.title}
                              </a>
                              <ExternalLink className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                            </div>

                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium border ${
                                  DIFFICULTY_COLORS[problem.difficulty]
                                }`}
                              >
                                {problem.difficulty}
                              </span>

                              {sourceBadge && (
                                <span className={`px-2 py-0.5 rounded text-xs ${sourceBadge.bg}`}>
                                  {sourceBadge.label}
                                </span>
                              )}

                              {problem.tags?.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded text-xs bg-white/5 text-neutral-400"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tomorrow's Preview */}
              <div className="glass-card p-5 border border-dashed border-white/20">
                <div className="flex items-center gap-2 mb-3">
                  <ArrowRight className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-semibold">Tomorrow&apos;s Preview</h4>
                </div>
                <p className="text-sm text-neutral-300">{dayPlan.tomorrowPreview}</p>
              </div>

              {/* Complete Day Button */}
              {!isDayComplete && (
                <button
                  onClick={markDayComplete}
                  disabled={!allProblemsComplete || !theoryRead}
                  className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    allProblemsComplete && theoryRead
                      ? `${phaseColor.bg} ${phaseColor.text} hover:opacity-80`
                      : "bg-white/5 text-neutral-500 cursor-not-allowed"
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {allProblemsComplete && theoryRead
                    ? "Complete Day & Move to Next"
                    : `Complete all tasks first (${problemsCompleted.length}/${dayPlan.problems.length} problems, ${theoryRead ? "theory done" : "read theory"})`}
                </button>
              )}

              {isDayComplete && (
                <div className="text-center py-4 rounded-xl bg-green-500/20 text-green-400">
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2" />
                  <p className="font-semibold">Day {currentDay} Completed!</p>
                  <p className="text-sm text-green-400/70 mt-1">
                    Great work! Keep the momentum going.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
