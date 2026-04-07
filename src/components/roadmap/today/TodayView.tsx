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
  onSaveProblemNotes?: (problemId: string, solution: string, explanation: string) => void;
  onMarkTheoryRead?: () => void;
  className?: string;
}

export function TodayView({ 
  progress, 
  todaysPlan, 
  onSolveProblem,
  onBookmarkProblem,
  onSaveProblemNotes,
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
            className="p-5 rounded-xl bg-glass-white border border-glass-border"
          >
            <TodayProblems
              problems={todaysPlan.recommendedProblems}
              solvedProblems={progress.problemsSolved}
              bookmarkedIds={progress.bookmarkedProblems}
              onSolve={onSolveProblem}
              onBookmark={onBookmarkProblem}
              onSaveNotes={onSaveProblemNotes}
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
              className="p-5 rounded-xl bg-glass-white border border-glass-border"
            >
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <span>💡</span>
                Learning Tips
              </h3>
              <div className="space-y-3">
                {todaysPlan.curriculumContent.learningTips.slice(0, 3).map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-charcoal-950"
                  >
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      tip.category === "shortcut" && "bg-gold/20 text-gold-dark",
                      tip.category === "pattern" && "bg-taupe/20 text-taupe",
                      tip.category === "trick" && "bg-gold/20 text-gold-dark",
                      tip.category === "mindset" && "bg-sage/20 text-sage-dark",
                      tip.category === "optimization" && "bg-gold/20 text-gold-dark",
                    )}>
                      {tip.category}
                    </span>
                    <p className="text-sm text-muted-foreground flex-1">{tip.tip}</p>
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
          className="p-5 rounded-xl bg-gradient-to-r from-cream-warm to-cream border border-glass-border"
        >
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
            Tomorrow&apos;s Preview
          </h3>
          <p className="text-foreground">{todaysPlan.curriculumContent.tomorrowPreview}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default TodayView;
