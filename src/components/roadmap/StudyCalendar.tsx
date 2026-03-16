"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ROADMAP_PHASES, isTopicCompleted } from "@/lib/roadmap-data";
import type { RoadmapProgress, UploadedFile } from "@/types";

/* ─── helpers ──────────────────────────────────────────────── */

function getMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay(); // 0=Sun
  const totalDays = last.getDate();
  return { startDay, totalDays };
}

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/* ─── types ────────────────────────────────────────────────── */

interface DayData {
  topicsCompleted: { label: string; phaseTitle: string }[];
  leetcodeCount: number;
  filesCount: number;
  cheatSheetsCount: number;
  notes: string[];
}

interface StudyCalendarProps {
  progress: RoadmapProgress;
  files: UploadedFile[];
}

/* ─── component ────────────────────────────────────────────── */

export function StudyCalendar({ progress, files }: StudyCalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Build per-day data map from progress + files
  const dayMap = useMemo(() => {
    const map: Record<string, DayData> = {};

    const ensure = (key: string): DayData => {
      if (!map[key]) map[key] = { topicsCompleted: [], leetcodeCount: 0, filesCount: 0, cheatSheetsCount: 0, notes: [] };
      return map[key];
    };

    // Topics completed (from phase progress)
    for (const phase of ROADMAP_PHASES) {
      const pp = progress.phases.find((p) => p.phaseId === phase.id);
      if (!pp) continue;
      for (const tp of pp.topicProgress) {
        if (tp.completed && tp.completedAt) {
          const key = tp.completedAt.split("T")[0];
          const topic = phase.topics.find((t) => t.id === tp.topicId);
          if (topic) {
            const d = ensure(key);
            d.topicsCompleted.push({ label: topic.label, phaseTitle: phase.title });
          }
        }
      }
    }

    // Daily entries (LeetCode + notes)
    for (const entry of progress.dailyEntries ?? []) {
      const d = ensure(entry.date);
      d.leetcodeCount += entry.leetcodeProblems.filter((p) => p.completed).length;
      if (entry.notes?.trim()) d.notes.push(entry.notes);
    }

    // Files by created_at date
    for (const f of files) {
      const key = f.created_at.split("T")[0];
      const d = ensure(key);
      if (f.linked_entity_type === "cheat-sheet") d.cheatSheetsCount++;
      else d.filesCount++;
    }

    return map;
  }, [progress, files]);

  const { startDay, totalDays } = getMonthDays(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
    setSelectedDate(null);
  };

  const selectedData = selectedDate ? dayMap[selectedDate] : null;
  const todayISO = today.toISOString().split("T")[0];

  return (
    <div className="glass-card rounded-2xl border border-white/5">
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between p-5 pb-3">
        <div>
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">Study Calendar</p>
          <h3 className="font-display font-bold text-lg text-white">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h3>
        </div>
        <div className="flex gap-1.5">
          <button onClick={prevMonth} className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/20 hover:text-white/50 transition-colors">
            &#8592;
          </button>
          <button onClick={nextMonth} className="w-8 h-8 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/20 hover:text-white/50 transition-colors">
            &#8594;
          </button>
        </div>
      </div>

      {/* ── Day headers ─────────────────────────────────── */}
      <div className="grid grid-cols-7 px-5 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center font-mono text-[9px] text-white/20 uppercase py-1">
            {d}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ───────────────────────────────── */}
      <div className="grid grid-cols-7 gap-[1px] px-5 pb-4">
        {/* Empty cells for offset */}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {/* Day cells */}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const iso = toISO(viewYear, viewMonth, day);
          const data = dayMap[iso];
          const isToday = iso === todayISO;
          const isSelected = iso === selectedDate;
          const hasActivity = !!data;
          const intensity = data
            ? Math.min(4, data.topicsCompleted.length + data.leetcodeCount)
            : 0;

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSelected ? null : iso)}
              className={cn(
                "aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all relative",
                isSelected
                  ? "ring-1 ring-blue-400/50 bg-blue-500/10"
                  : isToday
                  ? "bg-blue-500/[0.06] border border-blue-500/20"
                  : hasActivity
                  ? "bg-white/[0.02] hover:bg-white/[0.04]"
                  : "hover:bg-white/[0.02]"
              )}
            >
              <span className={cn(
                "font-mono text-[11px] tabular-nums",
                isToday ? "text-blue-400 font-bold" : hasActivity ? "text-white/60" : "text-white/20"
              )}>
                {day}
              </span>
              {/* Activity indicators */}
              {hasActivity && (
                <div className="flex gap-[2px]">
                  {data.topicsCompleted.length > 0 && (
                    <div className={cn(
                      "w-[4px] h-[4px] rounded-full",
                      intensity >= 3 ? "bg-emerald-400" : intensity >= 2 ? "bg-emerald-400/70" : "bg-emerald-400/40"
                    )} />
                  )}
                  {data.leetcodeCount > 0 && <div className="w-[4px] h-[4px] rounded-full bg-blue-400/60" />}
                  {(data.filesCount > 0 || data.cheatSheetsCount > 0) && <div className="w-[4px] h-[4px] rounded-full bg-violet-400/60" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Legend ───────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-5 pb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-[6px] h-[6px] rounded-full bg-emerald-400/60" />
          <span className="font-mono text-[9px] text-white/20">Topics</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-[6px] h-[6px] rounded-full bg-blue-400/60" />
          <span className="font-mono text-[9px] text-white/20">LeetCode</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-[6px] h-[6px] rounded-full bg-violet-400/60" />
          <span className="font-mono text-[9px] text-white/20">Files</span>
        </div>
      </div>

      {/* ── Selected day detail ─────────────────────────── */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-white/5">
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
                {selectedDate}
              </p>
              {!selectedData ? (
                <p className="font-body text-sm text-white/25">No activity on this day.</p>
              ) : (
                <div className="space-y-3">
                  {/* Topics */}
                  {selectedData.topicsCompleted.length > 0 && (
                    <div>
                      <p className="font-mono text-[9px] text-emerald-400/60 uppercase tracking-widest mb-1.5">
                        Topics Completed ({selectedData.topicsCompleted.length})
                      </p>
                      <div className="space-y-1">
                        {selectedData.topicsCompleted.map((t, i) => (
                          <div key={i} className="flex items-center gap-2 px-2 py-1 rounded-lg bg-emerald-500/[0.04]">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                            <span className="font-body text-xs text-white/50">{t.label}</span>
                            <span className="font-mono text-[8px] text-white/15 ml-auto">{t.phaseTitle}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LeetCode */}
                  {selectedData.leetcodeCount > 0 && (
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-blue-500/[0.04]">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400/60" />
                      <span className="font-body text-xs text-white/50">
                        {selectedData.leetcodeCount} LeetCode problem{selectedData.leetcodeCount !== 1 ? "s" : ""} solved
                      </span>
                    </div>
                  )}

                  {/* Files */}
                  {selectedData.filesCount > 0 && (
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-violet-500/[0.04]">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-400/60" />
                      <span className="font-body text-xs text-white/50">
                        {selectedData.filesCount} solution file{selectedData.filesCount !== 1 ? "s" : ""} uploaded
                      </span>
                    </div>
                  )}

                  {/* Cheat sheets */}
                  {selectedData.cheatSheetsCount > 0 && (
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-amber-500/[0.04]">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                      <span className="font-body text-xs text-white/50">
                        {selectedData.cheatSheetsCount} cheat sheet{selectedData.cheatSheetsCount !== 1 ? "s" : ""} uploaded
                      </span>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedData.notes.length > 0 && (
                    <div>
                      <p className="font-mono text-[9px] text-white/25 uppercase tracking-widest mb-1.5">Notes</p>
                      {selectedData.notes.map((n, i) => (
                        <p key={i} className="font-body text-xs text-white/40 bg-white/[0.02] rounded-lg px-3 py-2 mb-1">
                          {n}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
