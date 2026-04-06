"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DailyQuest } from "@/types";
import { ProgressRing } from "../shared";
import { CheckCircle2, Circle, Sparkles, ChevronRight } from "lucide-react";

interface DailyQuestCardProps {
  quest: DailyQuest;
  onStartQuest?: () => void;
  className?: string;
}

export function DailyQuestCard({ quest, onStartQuest, className }: DailyQuestCardProps) {
  const mainObjective = quest.objectives[0];
  const completedMain = mainObjective?.completed || false;
  const mainProgress = mainObjective 
    ? Math.min(100, (mainObjective.current / mainObjective.target) * 100)
    : 0;
  
  const completedBonuses = quest.bonusObjectives.filter(o => o.completed).length;
  const totalBonuses = quest.bonusObjectives.length;
  
  const overallProgress = quest.completed 
    ? 100 
    : (mainProgress * 0.7) + ((completedBonuses / totalBonuses) * 30);

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-charcoal-800/80 to-charcoal-900/80",
        "border border-white/10 backdrop-blur-xl",
        "p-6",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      {/* Quest badge */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              Daily Quest
            </span>
            {quest.completed && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Complete!
              </span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">{quest.title}</h2>
          <p className="text-white/60 text-sm mt-1">{quest.description}</p>
        </div>
        
        <ProgressRing 
          progress={overallProgress} 
          size={80}
          strokeWidth={6}
          color={quest.completed ? "stroke-amber-400" : "stroke-emerald-400"}
        >
          <span className="text-lg font-bold text-white">{Math.round(overallProgress)}%</span>
        </ProgressRing>
      </div>

      {/* Main Objective */}
      <div className="space-y-3 mb-6">
        <h3 className="text-xs uppercase tracking-wider text-white/40 font-medium">Main Objective</h3>
        <div 
          className={cn(
            "flex items-center gap-3 p-4 rounded-xl border transition-all",
            completedMain
              ? "bg-emerald-500/10 border-emerald-500/30"
              : "bg-white/5 border-white/10"
          )}
        >
          {completedMain ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          ) : (
            <Circle className="w-6 h-6 text-white/40 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className={cn("font-medium", completedMain ? "text-emerald-400" : "text-white")}>
              {mainObjective?.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${mainProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs text-white/60">
                {mainObjective?.current || 0}/{mainObjective?.target || 0}
              </span>
            </div>
          </div>
          <span className="text-amber-400 text-sm font-medium">+{mainObjective?.xpReward} XP</span>
        </div>
      </div>

      {/* Bonus Objectives */}
      <div className="space-y-3 mb-6">
        <h3 className="text-xs uppercase tracking-wider text-white/40 font-medium">
          Bonus Objectives ({completedBonuses}/{totalBonuses})
        </h3>
        <div className="grid gap-2">
          {quest.bonusObjectives.map((bonus) => (
            <div 
              key={bonus.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all",
                bonus.completed
                  ? "bg-amber-500/10 border-amber-500/20"
                  : "bg-white/5 border-white/5"
              )}
            >
              {bonus.completed ? (
                <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-white/30 flex-shrink-0" />
              )}
              <span className={cn(
                "flex-1 text-sm",
                bonus.completed ? "text-amber-400" : "text-white/60"
              )}>
                {bonus.description}
              </span>
              <span className="text-amber-400/60 text-xs font-medium">+{bonus.xpReward}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/60">
          Total Reward: <span className="text-amber-400 font-bold">{quest.totalXP} XP</span>
        </div>
        
        {!quest.completed && (
          <motion.button
            type="button"
            onClick={onStartQuest}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-medium transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue Quest
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default DailyQuestCard;
