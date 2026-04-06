"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RoadmapProgressV2 } from "@/types";
import { ROADMAP_PHASES } from "@/lib/roadmap-data";
import { ProgressRing, AchievementBadge } from "../shared";
import { ChevronRight, CheckCircle2, Circle, Calendar, Target, Trophy, TrendingUp } from "lucide-react";
import { useState } from "react";

interface JourneyViewProps {
  progress: RoadmapProgressV2;
  onToggleTopic?: (phaseId: number, topicId: string) => void;
  className?: string;
}

export function JourneyView({ progress, onToggleTopic, className }: JourneyViewProps) {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  // Calculate overall stats
  const totalTopics = ROADMAP_PHASES.reduce((sum, p) => sum + p.topics.length, 0);
  const completedTopics = progress.phases.reduce(
    (sum, p) => sum + p.topicProgress.filter(t => t.completed).length, 
    0
  );
  const overallProgress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  // Get current phase
  const today = new Date();
  let currentPhaseId = 1;
  for (const phase of ROADMAP_PHASES) {
    const start = new Date(phase.dateStart);
    const end = new Date(phase.dateEnd);
    if (today >= start && today <= end) {
      currentPhaseId = phase.id;
      break;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("space-y-8 pb-24 md:pb-8", className)}
    >
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4"
        >
          <ProgressRing progress={overallProgress} size={64} strokeWidth={5}>
            <span className="text-sm font-bold text-white">{Math.round(overallProgress)}%</span>
          </ProgressRing>
          <div>
            <p className="text-white/50 text-sm">Overall</p>
            <p className="text-xl font-bold text-white">{completedTopics}/{totalTopics}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-5 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-sm text-white/50">Problems</span>
          </div>
          <p className="text-2xl font-bold text-white">{progress.problemStats.total}</p>
          <p className="text-xs text-white/40 mt-1">
            E: {progress.problemStats.easy} M: {progress.problemStats.medium} H: {progress.problemStats.hard}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm text-white/50">Streak</span>
          </div>
          <p className="text-2xl font-bold text-white">{progress.currentStreak} 🔥</p>
          <p className="text-xs text-white/40 mt-1">Best: {progress.longestStreak} days</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-5 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Trophy className="w-5 h-5" />
            <span className="text-sm text-white/50">Achievements</span>
          </div>
          <p className="text-2xl font-bold text-white">{progress.unlockedAchievements.length}</p>
          <p className="text-xs text-white/40 mt-1">of {progress.achievements.length} unlocked</p>
        </motion.div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🗺️</span> Your Journey
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />

          <div className="space-y-4">
            {ROADMAP_PHASES.map((phase, index) => {
              const phaseProgress = progress.phases.find(p => p.phaseId === phase.id);
              const completed = phaseProgress?.topicProgress.filter(t => t.completed).length || 0;
              const total = phase.topics.length;
              const percentage = total > 0 ? (completed / total) * 100 : 0;
              const isCurrent = phase.id === currentPhaseId;
              const isPast = phase.id < currentPhaseId;
              const isExpanded = expandedPhase === phase.id;

              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Phase card */}
                  <button type="button"
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                    className={cn(
                      "w-full text-left p-4 pl-16 rounded-xl border transition-all relative",
                      isCurrent 
                        ? "bg-gradient-to-r " + phase.gradient + " border-l-4 " + phase.borderColor
                        : isPast
                        ? "bg-white/5 border-white/10 opacity-70"
                        : "bg-white/5 border-white/10"
                    )}
                  >
                    {/* Phase indicator */}
                    <div className={cn(
                      "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center",
                      isCurrent ? phase.bgColor : isPast ? "bg-emerald-500" : "bg-white/20"
                    )}>
                      {isPast ? (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      ) : (
                        <span className="text-xs font-bold text-white">{phase.id}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className={cn("font-semibold", isCurrent ? phase.color : "text-white")}>
                          {phase.title}
                        </h3>
                        <p className="text-sm text-white/50">{phase.duration}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-white">{completed}/{total}</p>
                          <p className="text-xs text-white/40">{Math.round(percentage)}%</p>
                        </div>
                        <ChevronRight className={cn(
                          "w-5 h-5 text-white/40 transition-transform",
                          isExpanded && "rotate-90"
                        )} />
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={cn("h-full", phase.bgColor)}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-16 mt-2 p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <p className="text-sm text-white/70 mb-4">{phase.goal}</p>
                      
                      <div className="grid sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                        {phase.topics.map(topic => {
                          const isCompleted = phaseProgress?.topicProgress.find(
                            t => t.topicId === topic.id
                          )?.completed;
                          
                          return (
                            <button
                              type="button"
                              key={topic.id}
                              onClick={() => onToggleTopic?.(phase.id, topic.id)}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded-lg text-sm text-left transition-all",
                                "hover:bg-white/10 cursor-pointer",
                                isCompleted ? "bg-emerald-500/10 text-emerald-400" : "text-white/60 hover:text-white/80"
                              )}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 flex-shrink-0" />
                              )}
                              <span className="truncate">{topic.label.split("(")[0].trim()}</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🏆</span> Achievements
        </h2>
        
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {progress.achievements.map(achievement => (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              unlocked={progress.unlockedAchievements.includes(achievement.id)}
              size="md"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default JourneyView;
