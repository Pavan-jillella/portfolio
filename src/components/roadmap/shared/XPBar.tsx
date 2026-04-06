"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getLevelFromXP, getXPProgress } from "../data/useRoadmapProgress";

interface XPBarProps {
  totalXP: number;
  className?: string;
  showLevel?: boolean;
  compact?: boolean;
}

export function XPBar({ totalXP, className, showLevel = true, compact = false }: XPBarProps) {
  const level = getLevelFromXP(totalXP);
  const xpProgress = getXPProgress(totalXP);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
          <span className="text-amber-400 text-sm font-bold">Lv.{level.level}</span>
        </div>
        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden min-w-[60px]">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-400"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress.percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <span className="text-xs text-white/60 font-mono">
          {totalXP.toLocaleString()} XP
        </span>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {showLevel && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30">
              <span className="text-lg">⭐</span>
              <span className="text-amber-400 font-bold">Level {level.level}</span>
            </div>
            <span className="text-white/80 font-medium">{level.title}</span>
          </div>
          <span className="text-sm text-white/60">
            {totalXP.toLocaleString()} XP
          </span>
        </div>
      )}
      
      <div className="relative">
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 relative"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress.percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
          </motion.div>
        </div>
        
        {/* XP to next level */}
        <div className="flex justify-between mt-1 text-xs text-white/50">
          <span>{xpProgress.current.toLocaleString()} / {xpProgress.required.toLocaleString()} XP</span>
          <span>Next: Level {level.level + 1}</span>
        </div>
      </div>
    </div>
  );
}

export default XPBar;
