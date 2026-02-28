"use client";
import { ShiftConflict } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ShiftConflictAlertProps {
  conflicts: ShiftConflict[];
}

export function ShiftConflictAlert({ conflicts }: ShiftConflictAlertProps) {
  if (conflicts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="glass-card rounded-2xl p-5 border-yellow-500/20 space-y-3"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h4 className="font-display font-semibold text-sm text-yellow-400">
            Shift Conflicts ({conflicts.length})
          </h4>
        </div>

        <div className="space-y-2">
          {conflicts.slice(0, 5).map((conflict, i) => (
            <div key={i} className="flex items-center justify-between bg-yellow-500/5 rounded-xl px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="font-body text-xs text-white/60">{conflict.employer_a}</span>
                <span className="font-mono text-[10px] text-white/20">vs</span>
                <span className="font-body text-xs text-white/60">{conflict.employer_b}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-white/30">
                  {conflict.shift_a.date || conflict.shift_a.day}
                </span>
                <span className="font-mono text-xs text-yellow-400/70">
                  {conflict.overlap_minutes}min overlap
                </span>
              </div>
            </div>
          ))}
          {conflicts.length > 5 && (
            <p className="font-mono text-xs text-white/25 text-center">
              +{conflicts.length - 5} more conflicts
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
