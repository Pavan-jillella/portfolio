"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { RoadmapView, TrackedProblem } from "@/types";

// Layout
import { RoadmapNav, RoadmapHeader } from "./layout";

// Data hooks
import { useRoadmapProgress, useTodaysPlan } from "./data";

// Views
import { TodayView } from "./today";
import { JourneyView } from "./journey";
import { PracticeView } from "./practice";
import { ResourcesView } from "./resources";

// Shared
import { XPBar } from "./shared";

interface RoadmapClientV2Props {
  className?: string;
}

export function RoadmapClientV2({ className }: RoadmapClientV2Props) {
  const [currentView, setCurrentView] = useState<RoadmapView>("today");
  
  const {
    progress,
    isLoaded,
    solveProblem,
    toggleBookmark,
    toggleTopic,
    addXP,
  } = useRoadmapProgress();
  
  const todaysPlan = useTodaysPlan(progress);

  // Handle solving a problem
  const handleSolveProblem = useCallback((problem: {
    id: string;
    title: string;
    number: number;
    difficulty: "easy" | "medium" | "hard";
    url: string;
    topicId: string;
  }) => {
    solveProblem({
      id: problem.id,
      leetcodeNumber: problem.number,
      title: problem.title,
      difficulty: problem.difficulty,
      url: problem.url,
      topicId: problem.topicId,
      phaseId: todaysPlan?.currentPhase.id || 1,
      tags: [],
    });
  }, [solveProblem, todaysPlan]);

  // Handle solving from practice view
  const handlePracticeSolve = useCallback((problem: TrackedProblem) => {
    solveProblem({
      id: problem.id,
      leetcodeNumber: problem.leetcodeNumber,
      title: problem.title,
      difficulty: problem.difficulty,
      url: problem.url,
      topicId: problem.topicId,
      phaseId: problem.phaseId,
      tags: problem.tags,
    });
  }, [solveProblem]);

  // Handle marking theory as read
  const handleTheoryRead = useCallback(() => {
    addXP("theory_read");
  }, [addXP]);

  // Loading state
  if (!isLoaded || !progress) {
    return (
      <div className={cn("min-h-[600px] flex items-center justify-center", className)}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <RoadmapHeader progress={progress} />
      
      {/* Desktop XP Bar */}
      <div className="hidden md:block">
        <XPBar totalXP={progress.totalXP} />
      </div>

      {/* Navigation */}
      <RoadmapNav currentView={currentView} onViewChange={setCurrentView} />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentView === "today" && (
            <TodayView
              progress={progress}
              todaysPlan={todaysPlan}
              onSolveProblem={handleSolveProblem}
              onBookmarkProblem={toggleBookmark}
              onMarkTheoryRead={handleTheoryRead}
            />
          )}

          {currentView === "journey" && (
            <JourneyView progress={progress} onToggleTopic={toggleTopic} />
          )}

          {currentView === "practice" && (
            <PracticeView
              progress={progress}
              onSolveProblem={handlePracticeSolve}
              onBookmark={toggleBookmark}
            />
          )}

          {currentView === "resources" && (
            <ResourcesView />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default RoadmapClientV2;
