"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSupabaseStorage } from "@/hooks/useSupabaseStorage";
import { useLeetCodeData } from "@/hooks/queries/useLeetCodeData";
import { cn } from "@/lib/utils";
import {
  ROADMAP_PHASES,
  DEFAULT_ROADMAP_PROGRESS,
  getPhaseProgress,
  isTopicCompleted,
  toggleTopicProgress,
  migrateProgress,
  type RoadmapPhase,
} from "@/lib/roadmap-data";
import { DailyStudyTracker } from "@/components/roadmap/DailyStudyTracker";
import type { StudySession, RoadmapProgress, UploadedFile } from "@/types";

/* ─── sub-components ──────────────────────────────────────── */

function PhaseNode({
  phase,
  progress,
  isExpanded,
  onToggle,
  onToggleTopic,
  phasePct,
  isLast,
}: {
  phase: RoadmapPhase;
  progress: RoadmapProgress;
  isExpanded: boolean;
  onToggle: () => void;
  onToggleTopic: (phaseId: number, topicId: string) => void;
  phasePct: number;
  isLast: boolean;
}) {
  const completedCount = phase.topics.filter((t) =>
    isTopicCompleted(progress, phase.id, t.id)
  ).length;

  return (
    <div className="relative flex gap-4 sm:gap-6">
      {/* Vertical line + node */}
      <div className="flex flex-col items-center flex-shrink-0">
        <button
          onClick={onToggle}
          className={cn(
            "relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer",
            phasePct === 100
              ? `${phase.bgColor}/30 ${phase.color} border ${phase.borderColor} ring-2 ring-offset-2 ring-offset-[#0a0a0f] ${phase.borderColor.replace("border-", "ring-")}`
              : phasePct > 0
              ? `${phase.bgColor}/20 ${phase.color} border ${phase.borderColor}`
              : "bg-white/5 text-white/40 border border-white/10 hover:border-white/20"
          )}
        >
          {phasePct === 100 ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            `0${phase.id}`
          )}
        </button>
        {!isLast && (
          <div className="w-px flex-1 min-h-[20px] relative overflow-hidden bg-white/5">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${phasePct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={cn("w-full absolute top-0", phase.bgColor + "/40")}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <button onClick={onToggle} className="w-full text-left group cursor-pointer">
          <div className="flex items-center gap-3 mb-0.5">
            <h3 className={cn("font-display font-bold text-base sm:text-lg transition-colors", phasePct > 0 ? phase.color : "text-white/70 group-hover:text-white")}>
              {phase.title}
            </h3>
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 hidden sm:inline">
              {phase.subtitle}
            </span>
            <span className={cn("font-mono text-[10px] ml-auto", phase.color)}>
              {completedCount}/{phase.topics.length}
            </span>
            <motion.svg animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </div>
          {/* Mini progress bar */}
          <div className="h-1 rounded-full bg-white/5 overflow-hidden mt-2">
            <motion.div
              animate={{ width: `${phasePct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={cn("h-full rounded-full", phase.bgColor + "/50")}
            />
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className={cn("mt-3 rounded-xl border p-4 bg-white/[0.02]", phase.borderColor)}>
                <p className="font-body text-xs text-white/30 mb-3">{phase.goal}</p>
                <div className="space-y-1">
                  {phase.topics.map((topic) => {
                    const done = isTopicCompleted(progress, phase.id, topic.id);
                    return (
                      <label
                        key={topic.id}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer group",
                          done ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"
                        )}
                      >
                        <div className="relative flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={done}
                            onChange={() => onToggleTopic(phase.id, topic.id)}
                            className="sr-only"
                          />
                          <div
                            className={cn(
                              "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                              done
                                ? `${phase.bgColor}/30 ${phase.borderColor}`
                                : "border-white/10 group-hover:border-white/20"
                            )}
                          >
                            {done && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={cn("w-3 h-3", phase.color)}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </motion.svg>
                            )}
                          </div>
                        </div>
                        <span className={cn("font-body text-sm transition-colors", done ? "text-white/60 line-through" : "text-white/80")}>
                          {topic.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CounterInput({
  label,
  value,
  onChange,
  color,
  target,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
  target?: number;
}) {
  return (
    <div className="glass-card rounded-xl p-4 border border-white/5">
      <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">{label}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/20 flex items-center justify-center transition-all text-sm font-mono"
        >
          -
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="w-16 text-center font-display font-bold text-xl text-white bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onClick={() => onChange(value + 1)}
          className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/20 flex items-center justify-center transition-all text-sm font-mono"
        >
          +
        </button>
      </div>
      {target !== undefined && (
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[9px] text-white/20">{value} / {target}</span>
            <span className={cn("font-mono text-[9px]", color)}>{Math.min(100, Math.round((value / target) * 100))}%</span>
          </div>
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-500", color.replace("text-", "bg-").replace("400", "500/50"))}
              style={{ width: `${Math.min(100, (value / target) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── visual tree diagram ─────────────────────────────────── */

function LearningTreeDiagram({ progress }: { progress: RoadmapProgress }) {
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

  return (
    <div className="glass-card rounded-2xl p-5 overflow-x-auto">
      <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-6">
        Learning Path Tree
      </p>

      <div className="min-w-[800px]">
        {/* Root node */}
        <div className="flex justify-center mb-2">
          <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-500/20">
            <span className="font-display font-bold text-sm text-white">Google SDE Preparation</span>
          </div>
        </div>

        {/* Connector from root to phases */}
        <div className="flex justify-center mb-2">
          <div className="w-px h-6 bg-white/10" />
        </div>

        {/* Horizontal line across all phases */}
        <div className="relative mx-12 mb-2">
          <div className="h-px bg-white/10 absolute top-0 left-0 right-0" />
          <div className="flex justify-between">
            {ROADMAP_PHASES.map((phase) => (
              <div
                key={phase.id}
                className="flex flex-col items-center"
                style={{ width: `${100 / ROADMAP_PHASES.length}%` }}
              >
                <div className={cn("w-px h-6", `${phase.bgColor}/30`)} />
              </div>
            ))}
          </div>
        </div>

        {/* Phase nodes row */}
        <div className="flex justify-between gap-2 mx-4 mb-2">
          {ROADMAP_PHASES.map((phase) => {
            const pct = getPhaseProgress(progress, phase.id);
            const isHovered = hoveredPhase === phase.id;
            const nodeClass = pct === 100
              ? `${phase.bgColor}/20 ${phase.borderColor} ring-1 ${phase.borderColor.replace("border-", "ring-")}`
              : pct > 0
              ? `bg-white/[0.03] ${phase.borderColor}`
              : "bg-white/[0.02] border-white/5";
            return (
              <div
                key={phase.id}
                className="flex flex-col items-center flex-1"
                onMouseEnter={() => setHoveredPhase(phase.id)}
                onMouseLeave={() => setHoveredPhase(null)}
              >
                <div
                  className={cn(
                    "w-full rounded-xl px-2 py-2.5 text-center border transition-all cursor-default",
                    nodeClass,
                    isHovered && "scale-105"
                  )}
                >
                  <p className={cn("font-mono text-[9px] uppercase tracking-wider mb-0.5", phase.color)}>
                    {phase.subtitle}
                  </p>
                  <p className={cn("font-display font-bold text-[11px] leading-tight", pct > 0 ? phase.color : "text-white/60")}>
                    {phase.title}
                  </p>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden mt-1.5">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", `${phase.bgColor}/50`)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="font-mono text-[8px] text-white/20 mt-1">{String(pct)}%</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Drop-down connectors from phases to topics */}
        <div className="flex justify-between gap-2 mx-4 mb-1">
          {ROADMAP_PHASES.map((phase) => (
            <div key={phase.id} className="flex flex-col items-center flex-1">
              <div className={cn("w-px h-4", hoveredPhase === phase.id ? `${phase.bgColor}/40` : "bg-white/5")} />
            </div>
          ))}
        </div>

        {/* Topic branches */}
        <div className="flex justify-between gap-2 mx-4">
          {ROADMAP_PHASES.map((phase) => {
            const isActive = hoveredPhase === phase.id;
            return (
              <div key={phase.id} className="flex-1 min-w-0">
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isActive ? "opacity-100" : "opacity-40 max-h-[120px]"
                  )}
                >
                  <div className={cn("rounded-lg border p-2 space-y-0.5", isActive ? phase.borderColor : "border-white/5")}>
                    {phase.topics.map((topic) => {
                      const done = isTopicCompleted(progress, phase.id, topic.id);
                      return (
                        <div
                          key={topic.id}
                          className="flex items-center gap-1.5 px-1.5 py-1 rounded"
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full flex-shrink-0 transition-colors",
                            done ? `${phase.bgColor}/60` : "bg-white/10"
                          )} />
                          <span className={cn(
                            "font-mono text-[9px] leading-tight truncate transition-colors",
                            done ? `${phase.color} line-through opacity-60` : "text-white/40"
                          )}>
                            {topic.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── main component ──────────────────────────────────────── */

interface RoadmapTabProps {
  sessions: StudySession[];
}

export function RoadmapTab({ sessions }: RoadmapTabProps) {
  const [progress, setProgress] = useLocalStorage<RoadmapProgress>("pj-faang-roadmap", DEFAULT_ROADMAP_PROGRESS);
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([1]));
  const [leetcodeUsername] = useLocalStorage<string>("pj-leetcode-username", "");
  const { data: leetcodeData } = useLeetCodeData(leetcodeUsername);

  // Migrate stored progress to match current ROADMAP_PHASES (handles old/stale data)
  useEffect(() => {
    const needsMigration = ROADMAP_PHASES.some((phase) => {
      const stored = progress.phases.find((p) => p.phaseId === phase.id);
      return !stored || stored.topicProgress.length !== phase.topics.length;
    });
    if (needsMigration) {
      setProgress(migrateProgress(progress));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compute study hours from education sessions by relevant subjects
  const studyStats = useMemo(() => {
    const subjectMap: Record<string, number> = {};
    const relevantSubjects = ["DSA", "Python", "Java", "Algorithms", "Data Structures", "System Design", "LeetCode", "Graphs", "Dynamic Programming", "Trees", "Databases", "OOP", "Coding"];
    sessions.forEach((s) => {
      if (relevantSubjects.some((rs) => s.subject.toLowerCase().includes(rs.toLowerCase()))) {
        subjectMap[s.subject] = (subjectMap[s.subject] || 0) + s.duration_minutes;
      }
    });
    const totalHours = Object.values(subjectMap).reduce((sum, m) => sum + m, 0) / 60;
    return { subjectMap, totalHours };
  }, [sessions]);

  // LeetCode sync stats
  const lcEasy = leetcodeData?.easy ?? 0;
  const lcMedium = leetcodeData?.medium ?? 0;
  const lcHard = leetcodeData?.hard ?? 0;
  const lcTotal = lcEasy + lcMedium + lcHard;

  // Use LC data if available, otherwise fall back to manual counts
  const effectiveProblems = leetcodeData
    ? { easy: lcEasy, medium: lcMedium, hard: lcHard }
    : progress.problemsSolved;
  const totalProblems = effectiveProblems.easy + effectiveProblems.medium + effectiveProblems.hard;

  // Overall progress
  const overallPct = useMemo(() => {
    if (ROADMAP_PHASES.length === 0) return 0;
    let sum = 0;
    ROADMAP_PHASES.forEach((p) => {
      sum += getPhaseProgress(progress, p.id);
    });
    return Math.round(sum / ROADMAP_PHASES.length);
  }, [progress]);

  function togglePhase(id: number) {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleTopic(phaseId: number, topicId: string) {
    setProgress((prev) => toggleTopicProgress(prev, phaseId, topicId));
  }

  function updateProblems(key: "easy" | "medium" | "hard", value: number) {
    setProgress((prev) => ({
      ...prev,
      problemsSolved: { ...prev.problemsSolved, [key]: value },
      updatedAt: new Date().toISOString(),
    }));
  }

  function updateCounter(key: "mockInterviewsDone" | "systemDesignsDone", value: number) {
    setProgress((prev) => ({ ...prev, [key]: value, updatedAt: new Date().toISOString() }));
  }

  // Solution files for daily tracker
  const [solutionFiles, setSolutionFiles] = useLocalStorage<UploadedFile[]>("pj-roadmap-solutions", []);
  const { upload: uploadFile } = useSupabaseStorage();

  const expandAll = () => setExpandedPhases(new Set(ROADMAP_PHASES.map((p) => p.id)));
  const collapseAll = () => setExpandedPhases(new Set());

  return (
    <div className="space-y-8">
      {/* ── Daily Study Tracker ────────────────────────── */}
      <DailyStudyTracker
        progress={progress}
        onUpdateProgress={setProgress}
        files={solutionFiles}
        onUploadFile={(file) => uploadFile(file, `roadmap-solutions/${Date.now()}-${file.name}`)}
        onFileAdded={(file) => setSolutionFiles((prev) => [...prev, { ...file, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, created_at: new Date().toISOString() }])}
      />

      {/* ── Overview Cards ───────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="glass-card rounded-xl p-4 col-span-2 lg:col-span-1 border border-blue-500/10">
          <p className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-1">Overall</p>
          <div className="flex items-end gap-2">
            <span className="font-display font-bold text-3xl text-white">{overallPct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mt-2">
            <motion.div
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500/60 to-violet-500/60"
            />
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 border border-white/5">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">Problems</p>
          <p className="font-display font-bold text-2xl text-white">
            {totalProblems}
            <span className="text-xs text-white/20 font-mono ml-1">/ 400</span>
          </p>
          {leetcodeData && (
            <p className="font-mono text-[9px] text-emerald-400 mt-1">Synced from LeetCode</p>
          )}
        </div>

        <div className="glass-card rounded-xl p-4 border border-white/5">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">Mock Interviews</p>
          <p className="font-display font-bold text-2xl text-white">
            {progress.mockInterviewsDone}
            <span className="text-xs text-white/20 font-mono ml-1">/ 25</span>
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-white/5">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">System Designs</p>
          <p className="font-display font-bold text-2xl text-white">
            {progress.systemDesignsDone}
            <span className="text-xs text-white/20 font-mono ml-1">/ 20</span>
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-white/5">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">Study Hours</p>
          <p className="font-display font-bold text-2xl text-white">
            {studyStats.totalHours.toFixed(0)}
            <span className="text-xs text-white/20 font-mono ml-1">hrs</span>
          </p>
          {sessions.length > 0 && (
            <p className="font-mono text-[9px] text-blue-400 mt-1">From study sessions</p>
          )}
        </div>
      </div>

      {/* ── Phase Progress Summary ───────────────────── */}
      <div className="glass-card rounded-2xl p-5">
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">Phase Progress</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROADMAP_PHASES.map((phase) => {
            const pct = getPhaseProgress(progress, phase.id);
            return (
              <button
                key={phase.id}
                onClick={() => {
                  setExpandedPhases(new Set([phase.id]));
                  document.getElementById("roadmap-tree")?.scrollIntoView({ behavior: "smooth" });
                }}
                className={cn("text-left rounded-xl p-3 border transition-all cursor-pointer hover:bg-white/[0.02]", phase.borderColor)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("font-body text-sm", phase.color)}>{phase.title}</span>
                  <span className="font-mono text-xs text-white/30">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6 }}
                    className={cn("h-full rounded-full", phase.bgColor + "/50")}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Visual Learning Path Tree ────────────── */}
      <LearningTreeDiagram progress={progress} />

      {/* ── Roadmap Tree ─────────────────────────────── */}
      <div id="roadmap-tree" className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Roadmap Tree</p>
            <p className="font-body text-xs text-white/20 mt-0.5">Check off topics as you complete them</p>
          </div>
          <div className="flex gap-2">
            <button onClick={expandAll} className="font-mono text-[10px] text-white/30 hover:text-white/60 px-2 py-1 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all">
              Expand all
            </button>
            <button onClick={collapseAll} className="font-mono text-[10px] text-white/30 hover:text-white/60 px-2 py-1 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all">
              Collapse all
            </button>
          </div>
        </div>

        {ROADMAP_PHASES.map((phase, i) => (
          <PhaseNode
            key={phase.id}
            phase={phase}
            progress={progress}
            isExpanded={expandedPhases.has(phase.id)}
            onToggle={() => togglePhase(phase.id)}
            onToggleTopic={toggleTopic}
            phasePct={getPhaseProgress(progress, phase.id)}
            isLast={i === ROADMAP_PHASES.length - 1}
          />
        ))}
      </div>

      {/* ── Counters & Tracking ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Counters */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Problem Tracker</p>
            {leetcodeData && (
              <span className="font-mono text-[9px] text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                LeetCode synced
              </span>
            )}
          </div>

          {leetcodeData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-emerald-400">{lcEasy}</p>
                  <p className="font-mono text-[10px] text-white/30">Easy</p>
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-amber-400">{lcMedium}</p>
                  <p className="font-mono text-[10px] text-white/30">Medium</p>
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-red-400">{lcHard}</p>
                  <p className="font-mono text-[10px] text-white/30">Hard</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-mono text-[10px] text-white/30">Total: {lcTotal} / 400</span>
                  <span className="font-mono text-[10px] text-blue-400">{Math.min(100, Math.round((lcTotal / 400) * 100))}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden flex">
                  <div className="h-full bg-emerald-500/50" style={{ width: `${(lcEasy / 400) * 100}%` }} />
                  <div className="h-full bg-amber-500/50" style={{ width: `${(lcMedium / 400) * 100}%` }} />
                  <div className="h-full bg-red-500/50" style={{ width: `${(lcHard / 400) * 100}%` }} />
                </div>
              </div>
              <p className="font-body text-xs text-white/20">Auto-synced from your LeetCode profile ({leetcodeUsername})</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-body text-xs text-white/20 mb-2">
                Link your LeetCode username in the LeetCode tab to auto-sync, or track manually below.
              </p>
              <CounterInput label="Easy" value={progress.problemsSolved.easy} onChange={(v) => updateProblems("easy", v)} color="text-emerald-400" target={120} />
              <CounterInput label="Medium" value={progress.problemsSolved.medium} onChange={(v) => updateProblems("medium", v)} color="text-amber-400" target={200} />
              <CounterInput label="Hard" value={progress.problemsSolved.hard} onChange={(v) => updateProblems("hard", v)} color="text-red-400" target={80} />
            </div>
          )}
        </div>

        {/* Activity Counters */}
        <div className="space-y-4">
          <CounterInput
            label="Mock Interviews Completed"
            value={progress.mockInterviewsDone}
            onChange={(v) => updateCounter("mockInterviewsDone", v)}
            color="text-cyan-400"
            target={25}
          />
          <CounterInput
            label="System Designs Practiced"
            value={progress.systemDesignsDone}
            onChange={(v) => updateCounter("systemDesignsDone", v)}
            color="text-amber-400"
            target={20}
          />

          {/* Study hours by subject from education tracker */}
          {Object.keys(studyStats.subjectMap).length > 0 && (
            <div className="glass-card rounded-xl p-4 border border-white/5">
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
                Study Hours (from Education Tracker)
              </p>
              <div className="space-y-2">
                {Object.entries(studyStats.subjectMap)
                  .sort(([, a], [, b]) => b - a)
                  .map(([subject, minutes]) => (
                    <div key={subject} className="flex items-center justify-between">
                      <span className="font-body text-xs text-white/50">{subject}</span>
                      <span className="font-mono text-xs text-blue-400">{(minutes / 60).toFixed(1)}h</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Deadline / Target ────────────────────────── */}
      <div className="glass-card rounded-2xl p-6 border border-blue-500/10 bg-gradient-to-r from-blue-500/5 to-violet-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-1">Target</p>
            <h3 className="font-display font-bold text-lg text-white">Google SDE-Ready by Nov 17</h3>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Problems", current: totalProblems, target: 400, color: "border-violet-500/20" },
              { label: "Mocks", current: progress.mockInterviewsDone, target: 25, color: "border-cyan-500/20" },
              { label: "Designs", current: progress.systemDesignsDone, target: 20, color: "border-amber-500/20" },
            ].map((stat) => (
              <div key={stat.label} className={cn("glass-card rounded-xl px-3 py-2 border text-center min-w-[80px]", stat.color)}>
                <p className="font-display font-bold text-lg text-white">
                  {stat.current}<span className="text-xs text-white/20">/{stat.target}</span>
                </p>
                <p className="font-mono text-[9px] text-white/30 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
