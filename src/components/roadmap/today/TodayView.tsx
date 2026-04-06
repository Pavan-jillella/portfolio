"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { RoadmapProgressV2 } from "@/types";
import { TodaysPlan } from "../data/useTodaysPlan";
import { DailyQuestCard } from "./DailyQuestCard";
import { TodayProblems } from "./TodayProblems";
import { TheoryBite } from "./TheoryBite";
import { QuickStats } from "./QuickStats";
import { useRoadmapProgress } from "../data/useRoadmapProgress";

interface TodayViewProps {
  progress: RoadmapProgressV2;
  todaysPlan: TodaysPlan | null;
  onSolveProblem?: (problem: Parameters<typeof TodayProblems>[0]["problems"][0]) => void;
  onBookmarkProblem?: (problemId: string) => void;
  onMarkTheoryRead?: () => void;
  className?: string;
}

export function TodayView({ 
  progress, 
  todaysPlan, 
  onSolveProblem,
  onBookmarkProblem,
  onMarkTheoryRead,
  className 
}: TodayViewProps) {
  if (!todaysPlan) {
    return (
      <div className={cn("flex items-center justify-center min-h-[400px]", className)}>
        <div className="text-center">
          <div className="text-4xl mb-4">🚀</div>
          <p className="text-white/60">Loading your daily plan...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("space-y-6 pb-24 md:pb-8", className)}
    >
      {/* Hero: Daily Quest Card */}
      <DailyQuestCard quest={todaysPlan.dailyQuest} />

      {/* Two column layout on desktop */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Main content - Problems & Theory */}
        <div className="lg:col-span-3 space-y-6">
          {/* Today's Problems */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-xl bg-white/5 border border-white/10"
          >
            <TodayProblems
              problems={todaysPlan.recommendedProblems}
              solvedProblems={progress.problemsSolved}
              bookmarkedIds={progress.bookmarkedProblems}
              onSolve={onSolveProblem}
              onBookmark={onBookmarkProblem}
            />
          </motion.div>

          {/* Theory Bite */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TheoryBite
              theory={todaysPlan.theoryBite}
              onMarkRead={onMarkTheoryRead}
            />
          </motion.div>

          {/* Learning Tips (if available) */}
          {todaysPlan.curriculumContent?.learningTips && todaysPlan.curriculumContent.learningTips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-5 rounded-xl bg-white/5 border border-white/10"
            >
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <span>💡</span>
                Learning Tips
              </h3>
              <div className="space-y-3">
                {todaysPlan.curriculumContent.learningTips.slice(0, 3).map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/5"
                  >
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      tip.category === "shortcut" && "bg-blue-500/20 text-blue-400",
                      tip.category === "pattern" && "bg-violet-500/20 text-violet-400",
                      tip.category === "trick" && "bg-amber-500/20 text-amber-400",
                      tip.category === "mindset" && "bg-emerald-500/20 text-emerald-400",
                      tip.category === "optimization" && "bg-orange-500/20 text-orange-400",
                    )}>
                      {tip.category}
                    </span>
                    <p className="text-sm text-white/70 flex-1">{tip.tip}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar - Quick Stats */}
        <div className="lg:col-span-2">
          <QuickStats progress={progress} todaysPlan={todaysPlan} />
        </div>
      </div>

      {/* Tomorrow Preview */}
      {todaysPlan.curriculumContent?.tomorrowPreview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-xl bg-gradient-to-r from-charcoal-800/50 to-charcoal-900/50 border border-white/10"
        >
          <h3 className="text-sm uppercase tracking-wider text-white/40 mb-2">
            Tomorrow&apos;s Preview
          </h3>
          <p className="text-white/70">{todaysPlan.curriculumContent.tomorrowPreview}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default TodayView;
