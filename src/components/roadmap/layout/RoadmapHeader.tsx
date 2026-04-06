"use client";

import { cn } from "@/lib/utils";
import { XPBar, StreakFlame } from "../shared";
import { RoadmapProgressV2 } from "@/types";
import { getLevelFromXP } from "../data/useRoadmapProgress";
import { Calendar, Target } from "lucide-react";

interface RoadmapHeaderProps {
  progress: RoadmapProgressV2 | null;
  className?: string;
}

// Calculate days until target date (Nov 17, 2026)
function getDaysCountdown(): { daysRemaining: number; totalDays: number; daysPassed: number } {
  const today = new Date();
  const startDate = new Date("2026-04-06"); // Today's start
  const targetDate = new Date("2026-11-17"); // Target: Nov 17, 2026
  
  const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.ceil((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = totalDays - daysRemaining;
  
  return { daysRemaining: Math.max(0, daysRemaining), totalDays, daysPassed: Math.max(0, daysPassed) };
}

export function RoadmapHeader({ progress, className }: RoadmapHeaderProps) {
  const level = progress ? getLevelFromXP(progress.totalXP) : null;
  const { daysRemaining, totalDays, daysPassed } = getDaysCountdown();
  const progressPercent = totalDays > 0 ? (daysPassed / totalDays) * 100 : 0;

  return (
    <header className={cn("space-y-4 pt-4", className)}>
      {/* Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            Google Roadmap
          </h1>
          <p className="text-white/60 text-sm mt-1">Your path to Google SDE</p>
        </div>
        
        {/* Days Countdown - All screens */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20">
          <Calendar className="w-5 h-5 text-blue-400" />
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-400">{daysRemaining}</span>
              <span className="text-sm text-white/60">days left</span>
            </div>
            <div className="text-xs text-white/40">
              Day {daysPassed} of {totalDays} • Target: Nov 17
            </div>
            {/* Mini progress bar */}
            <div className="mt-1.5 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row - Desktop */}
      <div className="hidden md:flex items-center gap-4 flex-wrap">
        {progress && (
          <>
            <StreakFlame streak={progress.currentStreak} size="md" />
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                <span className="text-emerald-400 font-bold">{progress.problemStats.total}</span>
                <span className="text-white/60 text-sm ml-1">solved</span>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-bold">Lv.{level?.level}</span>
              <span className="text-white/40 text-sm">{level?.title}</span>
            </div>
          </>
        )}
      </div>

      {/* XP Bar - Full width */}
      {progress && (
        <div className="md:hidden">
          <XPBar totalXP={progress.totalXP} compact />
        </div>
      )}
      
      {/* Mobile Quick Stats */}
      <div className="flex md:hidden items-center justify-between gap-4">
        {progress && (
          <>
            <StreakFlame streak={progress.currentStreak} size="sm" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-emerald-400 font-bold">{progress.problemStats.total}</span>
              <span className="text-white/60">solved</span>
            </div>
            <div className="text-sm">
              <span className="text-amber-400 font-bold">Lv.{level?.level}</span>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default RoadmapHeader;
