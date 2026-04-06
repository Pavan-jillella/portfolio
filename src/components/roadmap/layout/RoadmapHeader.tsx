"use client";

import { cn } from "@/lib/utils";
import { XPBar, StreakFlame } from "../shared";
import { RoadmapProgressV2 } from "@/types";
import { getLevelFromXP } from "../data/useRoadmapProgress";

interface RoadmapHeaderProps {
  progress: RoadmapProgressV2 | null;
  className?: string;
}

export function RoadmapHeader({ progress, className }: RoadmapHeaderProps) {
  const level = progress ? getLevelFromXP(progress.totalXP) : null;

  return (
    <header className={cn("space-y-4", className)}>
      {/* Title Row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            Google Roadmap
          </h1>
          <p className="text-white/60 text-sm mt-1">Your path to Google SDE</p>
        </div>
        
        {/* Quick Stats - Desktop */}
        <div className="hidden md:flex items-center gap-4">
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
            </>
          )}
        </div>
      </div>

      {/* XP Bar - Full width */}
      {progress && (
        <div className="md:hidden">
          <XPBar totalXP={progress.totalXP} compact />
        </div>
      )}
      
      {/* Mobile Quick Stats */}
      <div className="flex md:hidden items-center justify-between gap-4 pt-2">
        {progress && (
          <>
            <StreakFlame streak={progress.currentStreak} size="sm" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-emerald-400 font-bold">{progress.problemStats.total}</span>
              <span className="text-white/60">problems</span>
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
