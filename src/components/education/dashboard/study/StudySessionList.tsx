"use client";
import { useState } from "react";
import { StudySession } from "@/types";
import { SUBJECT_COLORS } from "@/lib/constants";
import { formatDuration } from "@/lib/education-utils";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";
import { motion, AnimatePresence } from "framer-motion";

interface StudySessionListProps {
  sessions: StudySession[];
  onEdit: (session: StudySession) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function StudySessionList({ sessions, onEdit, onDelete }: StudySessionListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterSubject, setFilterSubject] = useState("all");

  const subjects = Array.from(new Set(sessions.map((s) => s.subject))).sort();

  const filtered = filterSubject === "all"
    ? sessions
    : sessions.filter((s) => s.subject === filterSubject);
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  if (sessions.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display font-semibold text-lg text-white mb-4">Study Sessions</h3>
        <p className="font-body text-sm text-white/20 text-center py-8">
          No study sessions logged yet. Start by adding your first session.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      {/* Header with view toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-white">
          Study Sessions
          <span className="ml-2 font-mono text-xs text-white/30">({sorted.length})</span>
        </h3>
        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
      </div>

      {/* Subject filter */}
      {subjects.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            onClick={() => setFilterSubject("all")}
            className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all ${
              filterSubject === "all"
                ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                : "border-white/8 bg-white/4 text-white/40 hover:border-white/15"
            }`}
          >
            All
          </button>
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setFilterSubject(subject)}
              className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all flex items-center gap-1.5 ${
                filterSubject === subject
                  ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                  : "border-white/8 bg-white/4 text-white/40 hover:border-white/15"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: SUBJECT_COLORS[subject] || "#6b7280" }}
              />
              {subject}
            </button>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
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
                <span className="font-mono text-xs text-white/30 w-24 shrink-0">
                  {formatDate(session.date)}
                </span>
                <div className="flex items-center gap-2 w-32 shrink-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: SUBJECT_COLORS[session.subject] || "#6b7280" }}
                  />
                  <span className="font-body text-sm text-white/70 truncate">{session.subject}</span>
                </div>
                <span className="font-mono text-sm text-white/50 w-16 shrink-0">
                  {formatDuration(session.duration_minutes)}
                </span>
                <span className="font-body text-xs text-white/20 truncate flex-1 min-w-0">
                  {session.notes || "\u2014"}
                </span>
                <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => onEdit(session)}
                    className="glass-card px-3 py-1.5 rounded-lg text-xs font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
                  >
                    Edit
                  </button>
                  <ConfirmDelete onConfirm={() => onDelete(session.id)} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((session, i) => (
            <motion.div
              key={session.id}
              className="glass-card rounded-2xl p-5 flex flex-col justify-between group"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: SUBJECT_COLORS[session.subject] || "#6b7280" }}
                    />
                    <span className="font-body text-sm text-white font-medium">{session.subject}</span>
                  </div>
                  <span className="font-mono text-lg text-white/70">{formatDuration(session.duration_minutes)}</span>
                </div>
                <p className="font-body text-xs text-white/30 mb-2 line-clamp-2">{session.notes || "\u2014"}</p>
                <p className="font-mono text-[10px] text-white/20">{formatDate(session.date)}</p>
              </div>
              <div className="flex items-center gap-1 pt-3 border-t border-white/5 mt-3 sm:opacity-0 sm:group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(session)}
                  className="px-2 py-1 rounded-lg text-[10px] font-body text-white/30 hover:text-blue-400 hover:bg-white/5 transition-all"
                >
                  Edit
                </button>
                <ConfirmDelete onConfirm={() => onDelete(session.id)} className="ml-auto" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="glass-card rounded-2xl overflow-hidden -mx-6 -mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Subject</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Duration</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Notes</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((session) => (
                  <tr key={session.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-white/40">{formatDate(session.date)}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: SUBJECT_COLORS[session.subject] || "#6b7280" }}
                        />
                        <span className="font-body text-xs text-white/70">{session.subject}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-mono text-xs text-white/50">{formatDuration(session.duration_minutes)}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-body text-xs text-white/30 truncate max-w-[200px] block">{session.notes || "\u2014"}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(session)}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono text-white/25 hover:text-blue-400 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(session.id)}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono text-white/25 hover:text-red-400 transition-colors"
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
