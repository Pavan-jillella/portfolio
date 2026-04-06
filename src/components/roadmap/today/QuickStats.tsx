"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RoadmapProgressV2 } from "@/types";
import { TodaysPlan } from "../data/useTodaysPlan";
import { XPBar, StreakFlame, ProgressRing } from "../shared";
import { getLevelFromXP } from "../data/useRoadmapProgress";
import { Calendar, Target, TrendingUp, Zap } from "lucide-react";

interface QuickStatsProps {
  progress: RoadmapProgressV2;
  todaysPlan: TodaysPlan | null;
  className?: string;
}

export function QuickStats({ progress, todaysPlan, className }: QuickStatsProps) {
  const level = getLevelFromXP(progress.totalXP);
  
  const stats = [
    {
      id: "day",
      label: "Day",
      value: todaysPlan?.curriculumDay || 1,
      suffix: `of 240`,
      icon: <Calendar className="w-4 h-4" />,
      color: "text-blue-400",
    },
    {
      id: "problems",
      label: "Solved",
      value: progress.problemStats.total,
      suffix: "problems",
      icon: <Target className="w-4 h-4" />,
      color: "text-emerald-400",
    },
    {
      id: "phase",
      label: "Phase",
      value: todaysPlan?.currentPhase.id || 1,
      suffix: "of 8",
      icon: <TrendingUp className="w-4 h-4" />,
      color: "text-violet-400",
    },
    {
      id: "quests",
      label: "Quests",
      value: progress.completedQuests,
      suffix: "done",
      icon: <Zap className="w-4 h-4" />,
      color: "text-amber-400",
    },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* XP Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-white/5 border border-white/10"
      >
        <XPBar totalXP={progress.totalXP} />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className={cn("flex items-center gap-2 mb-2", stat.color)}>
              {stat.icon}
              <span className="text-xs uppercase tracking-wider text-white/40">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-white/40">{stat.suffix}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Phase Progress */}
      {todaysPlan && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className={cn("font-semibold", todaysPlan.currentPhase.color)}>
                Phase {todaysPlan.currentPhase.id}: {todaysPlan.currentPhase.title}
              </h4>
              <p className="text-sm text-white/50 mt-0.5">
                {todaysPlan.daysRemainingInPhase} days remaining
              </p>
            </div>
            <ProgressRing
              progress={todaysPlan.phaseProgress}
              size={56}
              strokeWidth={5}
              color={`stroke-current ${todaysPlan.currentPhase.color}`}
            >
              <span className="text-sm font-bold text-white">
                {Math.round(todaysPlan.phaseProgress)}%
              </span>
            </ProgressRing>
          </div>

          {/* Topics preview */}
          <div className="space-y-2">
            <span className="text-xs text-white/40">Today&apos;s Topics:</span>
            <div className="flex flex-wrap gap-2">
              {todaysPlan.todaysTopics.slice(0, 3).map(topic => (
                <span
                  key={topic.id}
                  className={cn(
                    "px-2 py-1 rounded-md text-xs border",
                    todaysPlan.currentPhase.bgColor + "/20",
                    todaysPlan.currentPhase.borderColor,
                    todaysPlan.currentPhase.color
                  )}
                >
                  {topic.label.split("(")[0].trim()}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Achievements preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-xl bg-white/5 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">Achievements</span>
          <span className="text-sm">
            <span className="text-amber-400 font-bold">{progress.unlockedAchievements.length}</span>
            <span className="text-white/40">/{progress.achievements.length}</span>
          </span>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {progress.achievements
            .filter(a => progress.unlockedAchievements.includes(a.id))
            .slice(0, 6)
            .map(achievement => (
              <div
                key={achievement.id}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center"
                title={achievement.title}
              >
                <span className="text-lg">{achievement.icon}</span>
              </div>
            ))}
          {progress.unlockedAchievements.length === 0 && (
            <span className="text-sm text-white/40">Complete quests to unlock achievements!</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default QuickStats;
