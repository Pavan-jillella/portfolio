"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useLeetCodeData } from "@/hooks/queries/useLeetCodeData";
import { cn } from "@/lib/utils";
import type { StudySession, RoadmapProgress } from "@/types";

/* ─── roadmap data ────────────────────────────────────────── */

interface Topic {
  id: string;
  label: string;
}

interface Phase {
  id: number;
  title: string;
  duration: string;
  goal: string;
  color: string;
  bgColor: string;
  borderColor: string;
  topics: Topic[];
}

const PHASES: Phase[] = [
  {
    id: 1,
    title: "Programming Foundations",
    duration: "Month 1",
    goal: "Build basic programming knowledge",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500",
    borderColor: "border-emerald-500/20",
    topics: [
      { id: "p1-variables", label: "Variables" },
      { id: "p1-conditions", label: "Conditions" },
      { id: "p1-loops", label: "Loops" },
      { id: "p1-functions", label: "Functions" },
      { id: "p1-arrays", label: "Lists / Arrays" },
      { id: "p1-hashmaps", label: "Dictionaries / HashMaps" },
      { id: "p1-strings", label: "Strings" },
      { id: "p1-recursion", label: "Recursion" },
      { id: "p1-oop", label: "Object Oriented Programming" },
    ],
  },
  {
    id: 2,
    title: "Data Structures",
    duration: "Months 2-3",
    goal: "Learn core data structures used in interviews",
    color: "text-blue-400",
    bgColor: "bg-blue-500",
    borderColor: "border-blue-500/20",
    topics: [
      { id: "p2-arrays", label: "Arrays" },
      { id: "p2-strings", label: "Strings" },
      { id: "p2-linked-lists", label: "Linked Lists" },
      { id: "p2-stack", label: "Stack" },
      { id: "p2-queue", label: "Queue" },
      { id: "p2-hash-tables", label: "Hash Tables" },
      { id: "p2-trees", label: "Trees" },
      { id: "p2-bst", label: "Binary Search Trees" },
      { id: "p2-heap", label: "Heap / Priority Queue" },
      { id: "p2-graphs", label: "Graphs" },
    ],
  },
  {
    id: 3,
    title: "Algorithms",
    duration: "Months 4-5",
    goal: "Master common interview problem patterns",
    color: "text-violet-400",
    bgColor: "bg-violet-500",
    borderColor: "border-violet-500/20",
    topics: [
      { id: "p3-binary-search", label: "Binary Search" },
      { id: "p3-sliding-window", label: "Sliding Window" },
      { id: "p3-two-pointers", label: "Two Pointers" },
      { id: "p3-recursion", label: "Recursion" },
      { id: "p3-backtracking", label: "Backtracking" },
      { id: "p3-dp", label: "Dynamic Programming" },
      { id: "p3-bfs-dfs", label: "Graph Traversal (BFS / DFS)" },
    ],
  },
  {
    id: 4,
    title: "System Design",
    duration: "Month 6",
    goal: "Learn how large-scale systems work",
    color: "text-amber-400",
    bgColor: "bg-amber-500",
    borderColor: "border-amber-500/20",
    topics: [
      { id: "p4-client-server", label: "Client-Server Architecture" },
      { id: "p4-databases", label: "Databases (SQL / NoSQL)" },
      { id: "p4-caching", label: "Caching" },
      { id: "p4-load-balancers", label: "Load Balancers" },
      { id: "p4-microservices", label: "Microservices" },
      { id: "p4-message-queues", label: "Message Queues" },
      { id: "p4-rate-limiting", label: "Rate Limiting" },
      { id: "p4-design-instagram", label: "Design Instagram" },
      { id: "p4-design-uber", label: "Design Uber" },
      { id: "p4-design-whatsapp", label: "Design WhatsApp" },
      { id: "p4-design-youtube", label: "Design YouTube" },
      { id: "p4-design-netflix", label: "Design Netflix" },
    ],
  },
  {
    id: 5,
    title: "Portfolio Projects",
    duration: "Month 7",
    goal: "Build strong projects to showcase skills",
    color: "text-rose-400",
    bgColor: "bg-rose-500",
    borderColor: "border-rose-500/20",
    topics: [
      { id: "p5-ai-resume", label: "AI Resume Analyzer" },
      { id: "p5-uber-clone", label: "Mini Uber Clone" },
      { id: "p5-llm-chat", label: "LLM Chat Application" },
    ],
  },
  {
    id: 6,
    title: "Interview Preparation",
    duration: "Month 8",
    goal: "Prepare for real interviews",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500",
    borderColor: "border-cyan-500/20",
    topics: [
      { id: "p6-daily-lc", label: "Daily LeetCode Practice" },
      { id: "p6-system-mock", label: "System Design Mocks" },
      { id: "p6-behavioral", label: "Behavioral Prep" },
      { id: "p6-resume", label: "Resume Polished" },
      { id: "p6-applications", label: "FAANG Applications Sent" },
    ],
  },
];

const DEFAULT_PROGRESS: RoadmapProgress = {
  phases: PHASES.map((p) => ({
    phaseId: p.id,
    topicProgress: p.topics.map((t) => ({ topicId: t.id, completed: false })),
    notes: "",
    updatedAt: new Date().toISOString(),
  })),
  problemsSolved: { easy: 0, medium: 0, hard: 0 },
  mockInterviewsDone: 0,
  systemDesignsDone: 0,
  projectsCompleted: [],
  updatedAt: new Date().toISOString(),
};

/* ─── helpers ─────────────────────────────────────────────── */

function getPhaseProgress(progress: RoadmapProgress, phaseId: number): number {
  const phase = progress.phases.find((p) => p.phaseId === phaseId);
  if (!phase || phase.topicProgress.length === 0) return 0;
  const done = phase.topicProgress.filter((t) => t.completed).length;
  return Math.round((done / phase.topicProgress.length) * 100);
}

function isTopicCompleted(progress: RoadmapProgress, phaseId: number, topicId: string): boolean {
  const phase = progress.phases.find((p) => p.phaseId === phaseId);
  return phase?.topicProgress.find((t) => t.topicId === topicId)?.completed ?? false;
}

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
  phase: Phase;
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
              {phase.duration}
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
            <span className="font-display font-bold text-sm text-white">FAANG Preparation</span>
          </div>
        </div>

        {/* Connector from root to phases */}
        <div className="flex justify-center mb-2">
          <div className="w-px h-6 bg-white/10" />
        </div>

        {/* Horizontal line across all phases */}
        <div className="relative mx-12 mb-2">
          <div className="h-px bg-white/10 absolute top-0 left-0 right-0" />
          {/* Drop-down connectors for each phase */}
          <div className="flex justify-between">
            {PHASES.map((phase) => (
              <div key={phase.id} className="flex flex-col items-center" style={{ width: `${100 / PHASES.length}%` }}>
                <div className={cn("w-px h-6", phase.bgColor + "/30")} />
              </div>
            ))}
          </div>
        </div>

        {/* Phase nodes row */}
        <div className="flex justify-between gap-2 mx-4 mb-2">
          {PHASES.map((phase) => {
            const pct = getPhaseProgress(progress, phase.id);
            const isHovered = hoveredPhase === phase.id;
            return (
              <div
                key={phase.id}
                className="flex flex-col items-center flex-1"
                onMouseEnter={() => setHoveredPhase(phase.id)}
                onMouseLeave={() => setHoveredPhase(null)}
              >
                <motion.div
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  className={cn(
                    "w-full rounded-xl px-2 py-2.5 text-center border transition-all cursor-default",
                    pct === 100
                      ? `${phase.bgColor}/20 ${phase.borderColor} ring-1 ${phase.borderColor.replace("border-", "ring-")}`
                      : pct > 0
                      ? `bg-white/[0.03] ${phase.borderColor}`
                      : "bg-white/[0.02] border-white/5"
                  )}
                >
                  <p className={cn("font-mono text-[9px] uppercase tracking-wider mb-0.5", phase.color)}>
                    {phase.duration}
                  </p>
                  <p className={cn("font-display font-bold text-[11px] leading-tight", pct > 0 ? phase.color : "text-white/60")}>
                    {phase.title}
                  </p>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden mt-1.5">
                    <motion.div
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
                      className={cn("h-full rounded-full", phase.bgColor + "/50")}
                    />
                  </div>
                  <p className="font-mono text-[8px] text-white/20 mt-1">{pct}%</p>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Drop-down connectors from phases to topics */}
        <div className="flex justify-between gap-2 mx-4 mb-1">
          {PHASES.map((phase) => (
            <div key={phase.id} className="flex flex-col items-center flex-1">
              <div className={cn("w-px h-4", hoveredPhase === phase.id ? phase.bgColor + "/40" : "bg-white/5")} />
            </div>
          ))}
        </div>

        {/* Topic branches */}
        <div className="flex justify-between gap-2 mx-4">
          {PHASES.map((phase) => {
            const isActive = hoveredPhase === phase.id;
            return (
              <div key={phase.id} className="flex-1 min-w-0">
                <AnimatePresence>
                  <motion.div
                    initial={false}
                    animate={{ opacity: isActive ? 1 : 0.4, height: isActive ? "auto" : 120 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
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
                              done ? phase.bgColor + "/60" : "bg-white/10"
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
                  </motion.div>
                </AnimatePresence>
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
  const [progress, setProgress] = useLocalStorage<RoadmapProgress>("pj-faang-roadmap", DEFAULT_PROGRESS);
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([1]));
  const [leetcodeUsername] = useLocalStorage<string>("pj-leetcode-username", "");
  const { data: leetcodeData } = useLeetCodeData(leetcodeUsername);

  // Compute study hours from education sessions by relevant subjects
  const studyStats = useMemo(() => {
    const subjectMap: Record<string, number> = {};
    const relevantSubjects = ["DSA", "Python", "JavaScript", "TypeScript", "System Design", "React", "Next.js", "Databases"];
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
    const phaseWeights = [1, 1, 1, 1, 1, 1];
    const totalWeight = phaseWeights.reduce((a, b) => a + b, 0);
    let weighted = 0;
    PHASES.forEach((p, i) => {
      weighted += (getPhaseProgress(progress, p.id) / 100) * phaseWeights[i];
    });
    return Math.round((weighted / totalWeight) * 100);
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
    setProgress((prev) => {
      const phases = prev.phases.map((p) => {
        if (p.phaseId !== phaseId) return p;
        return {
          ...p,
          topicProgress: p.topicProgress.map((t) =>
            t.topicId === topicId
              ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
              : t
          ),
          updatedAt: new Date().toISOString(),
        };
      });
      return { ...prev, phases, updatedAt: new Date().toISOString() };
    });
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

  const expandAll = () => setExpandedPhases(new Set(PHASES.map((p) => p.id)));
  const collapseAll = () => setExpandedPhases(new Set());

  return (
    <div className="space-y-8">
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
            <span className="text-xs text-white/20 font-mono ml-1">/ 300</span>
          </p>
          {leetcodeData && (
            <p className="font-mono text-[9px] text-emerald-400 mt-1">Synced from LeetCode</p>
          )}
        </div>

        <div className="glass-card rounded-xl p-4 border border-white/5">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">Mock Interviews</p>
          <p className="font-display font-bold text-2xl text-white">
            {progress.mockInterviewsDone}
            <span className="text-xs text-white/20 font-mono ml-1">/ 20</span>
          </p>
        </div>

        <div className="glass-card rounded-xl p-4 border border-white/5">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-1">System Designs</p>
          <p className="font-display font-bold text-2xl text-white">
            {progress.systemDesignsDone}
            <span className="text-xs text-white/20 font-mono ml-1">/ 15</span>
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
          {PHASES.map((phase) => {
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

        {PHASES.map((phase, i) => (
          <PhaseNode
            key={phase.id}
            phase={phase}
            progress={progress}
            isExpanded={expandedPhases.has(phase.id)}
            onToggle={() => togglePhase(phase.id)}
            onToggleTopic={toggleTopic}
            phasePct={getPhaseProgress(progress, phase.id)}
            isLast={i === PHASES.length - 1}
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
                  <span className="font-mono text-[10px] text-white/30">Total: {lcTotal} / 300</span>
                  <span className="font-mono text-[10px] text-blue-400">{Math.min(100, Math.round((lcTotal / 300) * 100))}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden flex">
                  <div className="h-full bg-emerald-500/50" style={{ width: `${(lcEasy / 300) * 100}%` }} />
                  <div className="h-full bg-amber-500/50" style={{ width: `${(lcMedium / 300) * 100}%` }} />
                  <div className="h-full bg-red-500/50" style={{ width: `${(lcHard / 300) * 100}%` }} />
                </div>
              </div>
              <p className="font-body text-xs text-white/20">Auto-synced from your LeetCode profile ({leetcodeUsername})</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-body text-xs text-white/20 mb-2">
                Link your LeetCode username in the LeetCode tab to auto-sync, or track manually below.
              </p>
              <CounterInput label="Easy" value={progress.problemsSolved.easy} onChange={(v) => updateProblems("easy", v)} color="text-emerald-400" target={100} />
              <CounterInput label="Medium" value={progress.problemsSolved.medium} onChange={(v) => updateProblems("medium", v)} color="text-amber-400" target={150} />
              <CounterInput label="Hard" value={progress.problemsSolved.hard} onChange={(v) => updateProblems("hard", v)} color="text-red-400" target={50} />
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
            target={20}
          />
          <CounterInput
            label="System Designs Practiced"
            value={progress.systemDesignsDone}
            onChange={(v) => updateCounter("systemDesignsDone", v)}
            color="text-amber-400"
            target={15}
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
            <h3 className="font-display font-bold text-lg text-white">FAANG-Ready by Nov 17</h3>
          </div>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "Problems", current: totalProblems, target: 300, color: "border-violet-500/20" },
              { label: "Mocks", current: progress.mockInterviewsDone, target: 20, color: "border-cyan-500/20" },
              { label: "Designs", current: progress.systemDesignsDone, target: 15, color: "border-amber-500/20" },
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
