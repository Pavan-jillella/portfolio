"use client";
import { useMemo } from "react";
import { StudySession, Course } from "@/types";
import {
  getStudyVelocity,
  getStudyHeatmap,
  getCompletionRate,
  getSubjectBreakdown,
} from "@/lib/education-utils";
import { SUBJECT_COLORS } from "@/lib/constants";
import { motion } from "framer-motion";

interface LearningAnalyticsPanelProps {
  sessions: StudySession[];
  courses: Course[];
}

export function LearningAnalyticsPanel({ sessions, courses }: LearningAnalyticsPanelProps) {
  // Study velocity: unique subjects per week (last 8 weeks)
  const velocity = useMemo(() => getStudyVelocity(sessions, 8), [sessions]);
  const maxVelocity = useMemo(
    () => Math.max(1, ...velocity.map((v) => v.subjects)),
    [velocity]
  );

  // Study heatmap: 28 days
  const heatmap = useMemo(() => getStudyHeatmap(sessions, 28), [sessions]);
  const maxHeatMinutes = useMemo(
    () => Math.max(1, ...heatmap.map((d) => d.minutes)),
    [heatmap]
  );

  // Completion rate
  const completion = useMemo(() => getCompletionRate(courses), [courses]);

  // Subject breakdown
  const subjectData = useMemo(() => getSubjectBreakdown(sessions), [sessions]);
  const maxSubjectMinutes = useMemo(
    () => Math.max(1, ...subjectData.map((s) => s.minutes)),
    [subjectData]
  );

  function getHeatmapColor(minutes: number): string {
    if (minutes === 0) return "bg-white/5";
    const ratio = minutes / maxHeatMinutes;
    if (ratio <= 0.25) return "bg-blue-500/20";
    if (ratio <= 0.5) return "bg-blue-500/40";
    if (ratio <= 0.75) return "bg-blue-500/60";
    return "bg-blue-500/80";
  }

  function getHeatmapDayLabel(dateStr: string): string {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "narrow" });
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display font-semibold text-xl text-white">
        Learning Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Velocity Chart */}
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <h3 className="font-display font-medium text-sm text-white/60 mb-4">
            Study Velocity
          </h3>
          <p className="font-body text-[10px] text-white/30 mb-3">
            Unique subjects per week (last 8 weeks)
          </p>

          <div className="flex items-end gap-2 h-40">
            {velocity.map((v, idx) => {
              const height = (v.subjects / maxVelocity) * 100;
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center justify-end gap-1"
                >
                  <span className="font-mono text-[10px] text-white/40">
                    {v.subjects}
                  </span>
                  <motion.div
                    className="w-full rounded-t-md bg-blue-500/40"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 4)}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  />
                  <span className="font-mono text-[8px] text-white/20 truncate w-full text-center">
                    {v.weekLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Study Heatmap */}
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <h3 className="font-display font-medium text-sm text-white/60 mb-4">
            Study Heatmap
          </h3>
          <p className="font-body text-[10px] text-white/30 mb-3">
            Daily study activity (last 28 days)
          </p>

          <div className="grid grid-cols-7 gap-1.5">
            {heatmap.map((day, idx) => (
              <div
                key={idx}
                className={`aspect-square rounded-sm ${getHeatmapColor(day.minutes)} transition-colors relative group`}
                title={`${day.date}: ${day.minutes}m`}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                  <div className="bg-gray-900 border border-white/10 rounded-md px-2 py-1 whitespace-nowrap">
                    <p className="font-mono text-[9px] text-white/60">{day.date}</p>
                    <p className="font-mono text-[9px] text-white">{day.minutes}m</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Day labels for bottom row */}
          <div className="grid grid-cols-7 gap-1.5 mt-1">
            {heatmap.slice(-7).map((day, idx) => (
              <span
                key={idx}
                className="font-mono text-[8px] text-white/20 text-center"
              >
                {getHeatmapDayLabel(day.date)}
              </span>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4">
            <span className="font-body text-[9px] text-white/30">Less</span>
            <div className="w-3 h-3 rounded-sm bg-white/5" />
            <div className="w-3 h-3 rounded-sm bg-blue-500/20" />
            <div className="w-3 h-3 rounded-sm bg-blue-500/40" />
            <div className="w-3 h-3 rounded-sm bg-blue-500/60" />
            <div className="w-3 h-3 rounded-sm bg-blue-500/80" />
            <span className="font-body text-[9px] text-white/30">More</span>
          </div>
        </motion.div>

        {/* Completion Rate */}
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="font-display font-medium text-sm text-white/60 mb-4">
            Course Completion Rate
          </h3>

          <div className="flex items-center gap-6">
            {/* Circular progress */}
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgb(16,185,129)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 42 * (1 - completion.rate / 100),
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-bold text-2xl text-white">
                  {completion.rate}%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div>
                <p className="font-body text-xs text-white/40">Completed</p>
                <p className="font-mono text-lg text-emerald-400">
                  {completion.completed}
                </p>
              </div>
              <div>
                <p className="font-body text-xs text-white/40">Total Courses</p>
                <p className="font-mono text-lg text-white">
                  {completion.total}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subject Distribution */}
        <motion.div
          className="glass-card rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="font-display font-medium text-sm text-white/60 mb-4">
            Subject Distribution
          </h3>
          <p className="font-body text-[10px] text-white/30 mb-3">
            Hours per subject
          </p>

          {subjectData.length === 0 ? (
            <p className="font-body text-xs text-white/20 py-4 text-center">
              No study sessions recorded yet
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {subjectData.slice(0, 8).map((item) => {
                const hours = (item.minutes / 60).toFixed(1);
                const widthPercent = (item.minutes / maxSubjectMinutes) * 100;
                const color =
                  SUBJECT_COLORS[item.subject] || SUBJECT_COLORS.Other;

                return (
                  <div key={item.subject} className="flex items-center gap-3">
                    <span className="font-body text-xs text-white/60 w-24 truncate text-right">
                      {item.subject}
                    </span>
                    <div className="flex-1 h-4 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(widthPercent, 2)}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-white/40 w-10 text-right">
                      {hours}h
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
