"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ROADMAP_PHASES, isTopicCompleted, toggleTopicProgress } from "@/lib/roadmap-data";
import { getTodaysStudyPlan } from "@/lib/roadmap-scheduler";
import { TOPIC_LEETCODE_MAP, type RecommendedProblem } from "@/lib/roadmap-leetcode-problems";
import type { RoadmapProgress, DailyStudyEntry, DailyLeetCodeEntry, UploadedFile } from "@/types";

/* ─── helpers ──────────────────────────────────────────────── */

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

function getDailyEntry(progress: RoadmapProgress, date: string, topicId: string, phaseId: number): DailyStudyEntry {
  const existing = (progress.dailyEntries ?? []).find(
    (e) => e.date === date && e.topicId === topicId
  );
  if (existing) return existing;
  return {
    date,
    topicId,
    phaseId,
    leetcodeProblems: [],
    notes: "",
    solutionFileIds: [],
  };
}

function updateDailyEntry(
  progress: RoadmapProgress,
  entry: DailyStudyEntry
): RoadmapProgress {
  const entries = progress.dailyEntries ?? [];
  const idx = entries.findIndex(
    (e) => e.date === entry.date && e.topicId === entry.topicId
  );
  const updated = idx >= 0
    ? entries.map((e, i) => (i === idx ? entry : e))
    : [...entries, entry];
  return { ...progress, dailyEntries: updated, updatedAt: new Date().toISOString() };
}

/* ─── difficulty badge ─────────────────────────────────────── */

const DIFF_COLORS = {
  easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  hard: "bg-red-500/15 text-red-400 border-red-500/20",
};

/* ─── component ────────────────────────────────────────────── */

interface DailyStudyTrackerProps {
  progress: RoadmapProgress;
  onUpdateProgress: (updater: (prev: RoadmapProgress) => RoadmapProgress) => void;
  files: UploadedFile[];
  onUploadFile?: (file: File) => Promise<{ url: string; path: string } | null>;
  onFileAdded?: (file: Omit<UploadedFile, "id" | "created_at">) => void;
  compact?: boolean;
}

export function DailyStudyTracker({
  progress,
  onUpdateProgress,
  files,
  onUploadFile,
  onFileAdded,
  compact,
}: DailyStudyTrackerProps) {
  const today = getTodayISO();
  const plan = useMemo(() => getTodaysStudyPlan(progress, ROADMAP_PHASES), [progress]);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [addingProblem, setAddingProblem] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleTopic = useCallback(
    (phaseId: number, topicId: string) => {
      onUpdateProgress((prev) => toggleTopicProgress(prev, phaseId, topicId));
    },
    [onUpdateProgress]
  );

  const handleToggleProblem = useCallback(
    (topicId: string, problemId: string, phaseId: number) => {
      onUpdateProgress((prev) => {
        const entry = getDailyEntry(prev, today, topicId, phaseId);
        const existing = entry.leetcodeProblems.find((p) => p.problemId === problemId);
        if (existing) {
          entry.leetcodeProblems = entry.leetcodeProblems.map((p) =>
            p.problemId === problemId
              ? { ...p, completed: !p.completed, completedAt: !p.completed ? new Date().toISOString() : undefined }
              : p
          );
        } else {
          const rec = Object.values(TOPIC_LEETCODE_MAP)
            .flat()
            .find((p) => p.id === problemId);
          if (rec) {
            entry.leetcodeProblems = [
              ...entry.leetcodeProblems,
              { problemId: rec.id, problemTitle: rec.title, problemNumber: rec.number, completed: true, completedAt: new Date().toISOString() },
            ];
          }
        }
        return updateDailyEntry(prev, entry);
      });
    },
    [onUpdateProgress, today]
  );

  const handleAddCustomProblem = useCallback(
    (topicId: string, phaseId: number) => {
      if (!customTitle.trim() || !customNumber.trim()) return;
      const num = parseInt(customNumber);
      if (isNaN(num)) return;
      onUpdateProgress((prev) => {
        const entry = getDailyEntry(prev, today, topicId, phaseId);
        entry.leetcodeProblems = [
          ...entry.leetcodeProblems,
          {
            problemId: `custom-${num}`,
            problemTitle: customTitle.trim(),
            problemNumber: num,
            completed: false,
          },
        ];
        return updateDailyEntry(prev, entry);
      });
      setCustomTitle("");
      setCustomNumber("");
      setAddingProblem(null);
    },
    [onUpdateProgress, today, customTitle, customNumber]
  );

  const handleUpdateNotes = useCallback(
    (topicId: string, phaseId: number, notes: string) => {
      onUpdateProgress((prev) => {
        const entry = getDailyEntry(prev, today, topicId, phaseId);
        entry.notes = notes;
        return updateDailyEntry(prev, entry);
      });
    },
    [onUpdateProgress, today]
  );

  const handleFileUpload = useCallback(
    async (topicId: string, phaseId: number, file: File) => {
      if (!onUploadFile || !onFileAdded) return;
      setUploading(true);
      try {
        const result = await onUploadFile(file);
        const url = result?.url || URL.createObjectURL(file);
        const path = result?.path || "";
        onFileAdded({
          file_name: file.name,
          file_url: url,
          file_type: file.type,
          file_size: file.size,
          storage_path: path,
          linked_entity_type: "roadmap-solution",
          linked_entity_ids: [topicId],
        });
        onUpdateProgress((prev) => {
          const entry = getDailyEntry(prev, today, topicId, phaseId);
          entry.solutionFileIds = [...entry.solutionFileIds, `${Date.now()}`];
          return updateDailyEntry(prev, entry);
        });
      } finally {
        setUploading(false);
      }
    },
    [onUploadFile, onFileAdded, onUpdateProgress, today]
  );

  const handleAIAnalysis = useCallback(
    async (topicId: string, phaseId: number) => {
      setAnalyzing(topicId);
      const entry = getDailyEntry(progress, today, topicId, phaseId);
      const topic = ROADMAP_PHASES.find((p) => p.id === phaseId)?.topics.find((t) => t.id === topicId);
      const problems = entry.leetcodeProblems.map((p) => `${p.problemTitle} (#${p.problemNumber})`).join(", ");

      try {
        const resp = await fetch("/api/education/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "solution-feedback",
            prompt: `Topic: ${topic?.label || topicId}\nProblems attempted: ${problems || "none specified"}\nStudent notes:\n${entry.notes || "(no notes)"}`,
          }),
        });
        if (!resp.ok) throw new Error("AI request failed");
        const data = await resp.json();
        const analysis = typeof data.result === "string" ? data.result : JSON.stringify(data.result, null, 2);
        onUpdateProgress((prev) => {
          const e = getDailyEntry(prev, today, topicId, phaseId);
          e.aiAnalysis = analysis;
          return updateDailyEntry(prev, e);
        });
      } catch {
        onUpdateProgress((prev) => {
          const e = getDailyEntry(prev, today, topicId, phaseId);
          e.aiAnalysis = "AI analysis is currently unavailable. Please try again later.";
          return updateDailyEntry(prev, e);
        });
      } finally {
        setAnalyzing(null);
      }
    },
    [progress, onUpdateProgress, today]
  );

  if (!plan) {
    return (
      <div className="glass-card rounded-2xl p-6 border border-white/5 text-center">
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">Today&apos;s Study Plan</p>
        <p className="font-body text-sm text-white/40">No active phase found for today. The roadmap covers Mar 14 – Nov 17, 2026.</p>
      </div>
    );
  }

  const { currentPhase, todaysTopics, nextTopics, phaseProgress, daysRemaining, isAheadOfSchedule, isBehindSchedule } = plan;

  // Get solution files for today's topics
  const topicFiles = (topicId: string) =>
    files.filter((f) => f.linked_entity_type === "roadmap-solution" && f.linked_entity_ids.includes(topicId));

  return (
    <div className={cn("glass-card rounded-2xl border", currentPhase.borderColor)}>
      {/* ── Header ──────────────────────────────────────── */}
      <div className="p-5 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">
              Today&apos;s Study Plan
            </p>
            <div className="flex items-center gap-3">
              <h3 className={cn("font-display font-bold text-lg", currentPhase.color)}>
                {currentPhase.title}
              </h3>
              <span className={cn(
                "font-mono text-[10px] px-2 py-0.5 rounded-full border",
                isAheadOfSchedule
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : isBehindSchedule
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-blue-500/10 text-blue-400 border-blue-500/20"
              )}>
                {isAheadOfSchedule ? "Ahead" : isBehindSchedule ? "Behind" : "On Track"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="font-mono text-[10px] text-white/25 uppercase">Progress</p>
              <p className={cn("font-display font-bold text-lg", currentPhase.color)}>{phaseProgress}%</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-[10px] text-white/25 uppercase">Days Left</p>
              <p className="font-display font-bold text-lg text-white">{daysRemaining}</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-[10px] text-white/25 uppercase">Date</p>
              <p className="font-mono text-sm text-white/50">{today}</p>
            </div>
          </div>
        </div>

        {/* Phase progress bar */}
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-4">
          <motion.div
            animate={{ width: `${phaseProgress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={cn("h-full rounded-full", currentPhase.bgColor + "/50")}
          />
        </div>
      </div>

      {/* ── Today's Topics ──────────────────────────────── */}
      <div className="px-5 pb-5">
        {todaysTopics.length === 0 ? (
          <div className="text-center py-6">
            <p className={cn("font-display font-bold text-sm", currentPhase.color)}>Phase Complete!</p>
            <p className="font-body text-xs text-white/40 mt-1">All topics in this phase are done.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaysTopics.map((topic) => {
              const done = isTopicCompleted(progress, currentPhase.id, topic.id);
              const isExpanded = expandedTopic === topic.id;
              const problems = TOPIC_LEETCODE_MAP[topic.id] || [];
              const entry = getDailyEntry(progress, today, topic.id, currentPhase.id);
              const tFiles = topicFiles(topic.id);

              return (
                <div key={topic.id} className={cn("rounded-xl border transition-all", done ? "border-white/5 bg-white/[0.02]" : currentPhase.borderColor + " bg-white/[0.02]")}>
                  {/* Topic row */}
                  <div className="flex items-center gap-3 p-3">
                    <label className="flex items-center gap-3 flex-1 cursor-pointer group">
                      <input type="checkbox" checked={done} onChange={() => handleToggleTopic(currentPhase.id, topic.id)} className="sr-only" />
                      <div className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0",
                        done ? `${currentPhase.bgColor}/30 ${currentPhase.borderColor}` : "border-white/15 group-hover:border-white/30"
                      )}>
                        {done && (
                          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className={cn("w-3 h-3", currentPhase.color)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </motion.svg>
                        )}
                      </div>
                      <span className={cn("font-body text-sm", done ? "text-white/40 line-through" : "text-white/80")}>
                        {topic.label}
                      </span>
                    </label>
                    {problems.length > 0 && (
                      <span className="font-mono text-[9px] text-white/25">{problems.length} LC</span>
                    )}
                    <button
                      onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                      className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors"
                    >
                      <motion.svg animate={{ rotate: isExpanded ? 180 : 0 }} className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </button>
                  </div>

                  {/* Expanded: LeetCode + Notes + Upload + AI */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 space-y-3 border-t border-white/5 pt-3">
                          {/* LeetCode Problems */}
                          {(problems.length > 0 || entry.leetcodeProblems.length > 0) && (
                            <div>
                              <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest mb-2">LeetCode Problems</p>
                              <div className="space-y-1.5">
                                {problems.map((p: RecommendedProblem) => {
                                  const pDone = entry.leetcodeProblems.find((e) => e.problemId === p.id)?.completed ?? false;
                                  return (
                                    <div key={p.id} className="flex items-center gap-2">
                                      <button onClick={() => handleToggleProblem(topic.id, p.id, currentPhase.id)} className={cn("w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all", pDone ? `${currentPhase.bgColor}/30 ${currentPhase.borderColor}` : "border-white/15 hover:border-white/30")}>
                                        {pDone && <svg className={cn("w-2.5 h-2.5", currentPhase.color)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                      </button>
                                      <a href={p.url} target="_blank" rel="noopener noreferrer" className={cn("font-mono text-xs hover:underline", pDone ? "text-white/30 line-through" : "text-white/60 hover:text-white")}>
                                        #{p.number} {p.title}
                                      </a>
                                      <span className={cn("font-mono text-[9px] px-1.5 py-0.5 rounded border", DIFF_COLORS[p.difficulty])}>
                                        {p.difficulty}
                                      </span>
                                    </div>
                                  );
                                })}
                                {/* Custom problems */}
                                {entry.leetcodeProblems
                                  .filter((p) => p.problemId.startsWith("custom-"))
                                  .map((p) => (
                                    <div key={p.problemId} className="flex items-center gap-2">
                                      <div className={cn("w-4 h-4 rounded border flex items-center justify-center flex-shrink-0", p.completed ? `${currentPhase.bgColor}/30 ${currentPhase.borderColor}` : "border-white/15")}>
                                        {p.completed && <svg className={cn("w-2.5 h-2.5", currentPhase.color)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                      </div>
                                      <span className="font-mono text-xs text-white/50">#{p.problemNumber} {p.problemTitle}</span>
                                      <span className="font-mono text-[9px] text-white/20 px-1.5 py-0.5 rounded bg-white/5">custom</span>
                                    </div>
                                  ))}
                              </div>
                              {/* Add custom problem */}
                              {addingProblem === topic.id ? (
                                <div className="flex items-center gap-2 mt-2">
                                  <input type="number" placeholder="#" value={customNumber} onChange={(e) => setCustomNumber(e.target.value)} className="w-16 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs outline-none focus:border-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                  <input type="text" placeholder="Problem title" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} className="flex-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs outline-none focus:border-white/20" onKeyDown={(e) => e.key === "Enter" && handleAddCustomProblem(topic.id, currentPhase.id)} />
                                  <button onClick={() => handleAddCustomProblem(topic.id, currentPhase.id)} className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 font-mono text-[10px] border border-blue-500/20 hover:bg-blue-500/30 transition-colors">Add</button>
                                  <button onClick={() => setAddingProblem(null)} className="px-2 py-1 rounded-lg bg-white/5 text-white/30 font-mono text-[10px] border border-white/5 hover:text-white/60 transition-colors">Cancel</button>
                                </div>
                              ) : (
                                <button onClick={() => setAddingProblem(topic.id)} className="font-mono text-[10px] text-white/25 hover:text-white/50 mt-2 transition-colors">
                                  + Add custom problem
                                </button>
                              )}
                            </div>
                          )}

                          {/* Solution Upload */}
                          {onUploadFile && onFileAdded && (
                            <div>
                              <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest mb-2">Solution Files</p>
                              {tFiles.length > 0 && (
                                <div className="space-y-1 mb-2">
                                  {tFiles.map((f) => (
                                    <div key={f.id} className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/[0.03]">
                                      <svg className="w-3.5 h-3.5 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                      <span className="font-mono text-xs text-white/40 truncate">{f.file_name}</span>
                                      <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="font-mono text-[9px] text-blue-400 hover:underline ml-auto">View</a>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <input ref={fileInputRef} type="file" accept=".py,.js,.ts,.java,.cpp,.c,.txt,.pdf,.png,.jpg,.jpeg" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(topic.id, currentPhase.id, f); e.target.value = ""; }} />
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="flex items-center gap-1.5 font-mono text-[10px] text-white/25 hover:text-white/50 transition-colors disabled:opacity-50"
                              >
                                {uploading ? (
                                  <div className="w-3 h-3 border border-white/20 border-t-white/60 rounded-full animate-spin" />
                                ) : (
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                )}
                                Upload solution
                              </button>
                            </div>
                          )}

                          {/* Notes */}
                          <div>
                            <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest mb-2">Notes</p>
                            <textarea
                              value={entry.notes}
                              onChange={(e) => handleUpdateNotes(topic.id, currentPhase.id, e.target.value)}
                              placeholder="Write your notes, approach, complexity analysis..."
                              className="w-full min-h-[60px] px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-white/70 font-body text-xs outline-none resize-y focus:border-white/15 placeholder:text-white/15 transition-colors"
                            />
                          </div>

                          {/* AI Analysis */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAIAnalysis(topic.id, currentPhase.id)}
                              disabled={analyzing === topic.id}
                              className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] border transition-all",
                                analyzing === topic.id
                                  ? "bg-violet-500/10 text-violet-400 border-violet-500/20 opacity-70"
                                  : "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20"
                              )}
                            >
                              {analyzing === topic.id ? (
                                <div className="w-3 h-3 border border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                              )}
                              Analyze with AI
                            </button>
                          </div>

                          {/* AI Result */}
                          {entry.aiAnalysis && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="rounded-lg bg-violet-500/5 border border-violet-500/10 p-3"
                            >
                              <p className="font-mono text-[10px] text-violet-400 uppercase tracking-widest mb-2">AI Feedback</p>
                              <pre className="font-body text-xs text-white/60 whitespace-pre-wrap break-words">{entry.aiAnalysis}</pre>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Up Next ─────────────────────────────────────── */}
        {!compact && nextTopics.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/5">
            <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-2">Up Next</p>
            <div className="flex flex-wrap gap-1.5">
              {nextTopics.map((t) => (
                <span key={t.id} className="px-2 py-0.5 rounded-md font-mono text-[10px] text-white/30 bg-white/[0.03] border border-white/5">
                  {t.label.length > 35 ? t.label.slice(0, 33) + "…" : t.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
