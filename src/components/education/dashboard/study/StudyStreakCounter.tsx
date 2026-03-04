"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { StudySession } from "@/types";
import { getStudyHeatmap } from "@/lib/education-utils";

interface StudyStreakCounterProps {
  streak: number;
  sessions: StudySession[];
  dailyGoalMinutes?: number;
}

const MILESTONES = [
  { days: 7, label: "1 Week" },
  { days: 14, label: "2 Weeks" },
  { days: 30, label: "1 Month" },
  { days: 60, label: "2 Months" },
  { days: 100, label: "100 Days" },
];

function getIntensity(minutes: number, goal: number): number {
  if (minutes === 0) return 0;
  if (minutes < goal * 0.25) return 1;
  if (minutes < goal * 0.5) return 2;
  if (minutes < goal) return 3;
  return 4;
}

const INTENSITY_COLORS = [
  "bg-white/[0.03]",
  "bg-blue-500/20",
  "bg-blue-500/40",
  "bg-blue-500/60",
  "bg-blue-500/80",
];

export function StudyStreakCounter({ streak, sessions, dailyGoalMinutes = 60 }: StudyStreakCounterProps) {
  const heatmap = useMemo(() => getStudyHeatmap(sessions, 28), [sessions]);

  const nextMilestone = MILESTONES.find((m) => m.days > streak);
  const achievedMilestones = MILESTONES.filter((m) => m.days <= streak);

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      {/* Streak header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-body text-xs text-white/40 mb-1">Current Streak</p>
          <p className="font-display font-bold text-3xl text-white">
            <AnimatedCounter target={streak} suffix=" days" duration={1500} />
          </p>
        </div>
        {nextMilestone && (
          <div className="text-right">
            <p className="font-body text-[10px] text-white/30">Next milestone</p>
            <p className="font-mono text-xs text-blue-400">
              {nextMilestone.label} ({nextMilestone.days - streak} to go)
            </p>
          </div>
        )}
      </div>

      {/* Milestone badges */}
      {achievedMilestones.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {achievedMilestones.map((m) => (
            <span
              key={m.days}
              className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono"
            >
              {m.label}
            </span>
          ))}
        </div>
      )}

      {/* 28-day heatmap calendar */}
      <div>
        <p className="font-body text-[10px] text-white/30 mb-2 uppercase tracking-wider">Last 28 Days</p>
        <div className="grid grid-cols-7 gap-1">
          {heatmap.map((day) => {
            const intensity = getIntensity(day.minutes, dailyGoalMinutes);
            const dayLabel = new Date(day.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "narrow" });
            return (
              <motion.div
                key={day.date}
                className={`aspect-square rounded-sm ${INTENSITY_COLORS[intensity]} relative group`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.01 }}
                title={`${day.date}: ${day.minutes}min`}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white/20 font-mono">
                  {dayLabel}
                </span>
              </motion.div>
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-1 mt-2">
          <span className="font-mono text-[8px] text-white/20">Less</span>
          {INTENSITY_COLORS.map((color, i) => (
            <span key={i} className={`w-2.5 h-2.5 rounded-sm ${color}`} />
          ))}
          <span className="font-mono text-[8px] text-white/20">More</span>
        </div>
      </div>
    </div>
  );
}
