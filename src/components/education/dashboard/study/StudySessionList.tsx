"use client";
import { StudySession } from "@/types";
import { SUBJECT_COLORS } from "@/lib/constants";
import { formatDuration } from "@/lib/education-utils";
import { motion, AnimatePresence } from "framer-motion";

interface StudySessionListProps {
  sessions: StudySession[];
  onEdit: (session: StudySession) => void;
  onDelete: (id: string) => void;
}

export function StudySessionList({ sessions, onEdit, onDelete }: StudySessionListProps) {
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display font-semibold text-lg text-white mb-4">Study Sessions</h3>
        <p className="font-body text-sm text-white/20 text-center py-8">
          No study sessions logged yet. Start by adding your first session.
        </p>
      </div>
    );
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-lg text-white mb-4">Study Sessions</h3>
      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {sorted.map((session) => (
            <motion.div
              key={session.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="group flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/[0.03] transition-colors"
            >
              {/* Date */}
              <span className="font-mono text-xs text-white/30 w-24 shrink-0">
                {formatDate(session.date)}
              </span>

              {/* Subject with colored dot */}
              <div className="flex items-center gap-2 w-32 shrink-0">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: SUBJECT_COLORS[session.subject] || "#6b7280" }}
                />
                <span className="font-body text-sm text-white/70 truncate">{session.subject}</span>
              </div>

              {/* Duration */}
              <span className="font-mono text-sm text-white/50 w-16 shrink-0">
                {formatDuration(session.duration_minutes)}
              </span>

              {/* Notes */}
              <span className="font-body text-xs text-white/20 truncate flex-1 min-w-0">
                {session.notes || "\u2014"}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => onEdit(session)}
                  className="glass-card px-3 py-1.5 rounded-lg text-xs font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(session.id)}
                  className="glass-card px-3 py-1.5 rounded-lg text-xs font-body text-red-400/60 hover:text-red-400 transition-all hover:border-red-500/30"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
