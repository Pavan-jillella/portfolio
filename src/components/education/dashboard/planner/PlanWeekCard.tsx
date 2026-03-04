"use client";
import { PlanWeek } from "@/types";
import { motion } from "framer-motion";

interface PlanWeekCardProps {
  week: PlanWeek;
  onToggleComplete: () => void;
}

export function PlanWeekCard({ week, onToggleComplete }: PlanWeekCardProps) {
  return (
    <motion.div
      className={`glass-card rounded-xl p-5 relative overflow-hidden transition-all ${
        week.completed ? "border-emerald-500/20" : ""
      }`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: week.week * 0.05 }}
    >
      {/* Green overlay for completed weeks */}
      {week.completed && (
        <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
      )}

      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Week number badge */}
          <span
            className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-mono text-sm font-bold ${
              week.completed
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-blue-500/20 text-blue-400"
            }`}
          >
            {week.week}
          </span>

          <div className="min-w-0">
            <h4 className="font-display font-semibold text-sm text-white truncate">
              {week.topic}
            </h4>
          </div>
        </div>

        {/* Week completion toggle */}
        <button
          onClick={onToggleComplete}
          className={`flex-shrink-0 w-6 h-6 rounded-md border transition-all flex items-center justify-center ${
            week.completed
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
              : "border-white/10 hover:border-white/20 text-transparent hover:text-white/20"
          }`}
          title={week.completed ? "Mark incomplete" : "Mark complete"}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
      </div>

      {/* Task list */}
      <ul className="mt-3 space-y-1.5 relative z-10">
        {week.tasks.map((task, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span
              className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                week.completed ? "bg-emerald-400/60" : "bg-white/20"
              }`}
            />
            <span
              className={`font-body text-xs leading-relaxed ${
                week.completed ? "text-white/40 line-through" : "text-white/60"
              }`}
            >
              {task}
            </span>
          </li>
        ))}
      </ul>

      {/* Completed checkmark overlay */}
      {week.completed && (
        <div className="absolute top-3 right-12 text-emerald-400/10">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}
