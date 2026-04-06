"use client";

import { cn } from "@/lib/utils";
import { Achievement } from "@/types";
import { motion } from "framer-motion";

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

const tierColors = {
  bronze: {
    bg: "bg-amber-700/20",
    border: "border-amber-700/40",
    text: "text-amber-600",
    glow: "shadow-amber-700/20",
  },
  silver: {
    bg: "bg-slate-400/20",
    border: "border-slate-400/40",
    text: "text-slate-300",
    glow: "shadow-slate-400/20",
  },
  gold: {
    bg: "bg-yellow-500/20",
    border: "border-yellow-500/40",
    text: "text-yellow-400",
    glow: "shadow-yellow-500/30",
  },
  platinum: {
    bg: "bg-cyan-400/20",
    border: "border-cyan-400/40",
    text: "text-cyan-300",
    glow: "shadow-cyan-400/30",
  },
};

export function AchievementBadge({ 
  achievement, 
  unlocked = false, 
  className, 
  size = "md",
  showTooltip = true 
}: AchievementBadgeProps) {
  const colors = tierColors[achievement.tier];
  
  const sizeClasses = {
    sm: "w-10 h-10 text-lg",
    md: "w-14 h-14 text-2xl",
    lg: "w-20 h-20 text-4xl",
  };

  return (
    <div className={cn("relative group", className)}>
      <motion.div
        className={cn(
          "rounded-full flex items-center justify-center border-2 transition-all duration-300",
          sizeClasses[size],
          unlocked 
            ? cn(colors.bg, colors.border, "shadow-lg", colors.glow)
            : "bg-white/5 border-white/10 grayscale opacity-40"
        )}
        whileHover={unlocked ? { scale: 1.1 } : {}}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <span className={!unlocked ? "grayscale" : ""}>{achievement.icon}</span>
      </motion.div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="bg-charcoal-900/95 backdrop-blur-sm rounded-lg p-3 border border-white/10 shadow-xl min-w-[180px]">
            <p className={cn("font-bold text-sm", unlocked ? colors.text : "text-white/60")}>
              {achievement.title}
            </p>
            <p className="text-xs text-white/60 mt-1">{achievement.description}</p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
              <span className={cn("text-xs capitalize", colors.text)}>{achievement.tier}</span>
              <span className="text-xs text-amber-400">+{achievement.xpReward} XP</span>
            </div>
          </div>
          <div className="w-2 h-2 bg-charcoal-900/95 border-r border-b border-white/10 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  );
}

export default AchievementBadge;
