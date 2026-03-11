"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";
import { isOwner } from "@/lib/roles";

/* ─── constants ─────────────────────────────────────────────── */

interface Phase {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  icon: string;
  color: string;
  gradient: string;
  borderColor: string;
  goal: string;
  topics: string[];
  practice: string;
  milestones: string[];
  platforms?: string[];
}

const phases: Phase[] = [
  {
    id: 1,
    title: "Programming Foundations",
    subtitle: "Month 1",
    duration: "Month 1",
    icon: "01",
    color: "text-emerald-400",
    gradient: "from-emerald-500/20 to-emerald-500/0",
    borderColor: "border-emerald-500/20",
    goal: "Build basic programming knowledge.",
    topics: [
      "Variables",
      "Conditions",
      "Loops",
      "Functions",
      "Lists / Arrays",
      "Dictionaries / HashMaps",
      "Strings",
      "Recursion",
      "Object Oriented Programming",
    ],
    practice: "Solve 10-15 coding problems daily.",
    milestones: ["Write clean code", "Solve 50+ beginner problems"],
    platforms: ["HackerRank", "LeetCode (Easy)", "Codewars"],
  },
  {
    id: 2,
    title: "Data Structures",
    subtitle: "Months 2-3",
    duration: "Months 2-3",
    icon: "02",
    color: "text-blue-400",
    gradient: "from-blue-500/20 to-blue-500/0",
    borderColor: "border-blue-500/20",
    goal: "Learn core data structures used in interviews.",
    topics: [
      "Arrays",
      "Strings",
      "Linked Lists",
      "Stack",
      "Queue",
      "Hash Tables",
      "Trees",
      "Binary Search Trees",
      "Heap / Priority Queue",
      "Graphs",
    ],
    practice: "Solve 3-5 LeetCode problems daily.",
    milestones: ["Understand time complexity", "Solve 150 problems total"],
  },
  {
    id: 3,
    title: "Algorithms",
    subtitle: "Months 4-5",
    duration: "Months 4-5",
    icon: "03",
    color: "text-violet-400",
    gradient: "from-violet-500/20 to-violet-500/0",
    borderColor: "border-violet-500/20",
    goal: "Master common interview problem patterns.",
    topics: [
      "Binary Search",
      "Sliding Window",
      "Two Pointers",
      "Recursion",
      "Backtracking",
      "Dynamic Programming",
      "Graph Traversal (BFS / DFS)",
    ],
    practice: "Easy: 100 | Medium: 150 | Hard: 50 — Total: 300 problems.",
    milestones: ["Master all key patterns", "300 problems solved"],
  },
  {
    id: 4,
    title: "System Design",
    subtitle: "Month 6",
    duration: "Month 6",
    icon: "04",
    color: "text-amber-400",
    gradient: "from-amber-500/20 to-amber-500/0",
    borderColor: "border-amber-500/20",
    goal: "Learn how large-scale systems work.",
    topics: [
      "Client-Server Architecture",
      "Databases (SQL / NoSQL)",
      "Caching",
      "Load Balancers",
      "Microservices",
      "Message Queues",
      "Rate Limiting",
    ],
    practice:
      "Design Instagram, Uber, WhatsApp, YouTube, Netflix.",
    milestones: [
      "Understand scalable architecture",
      "Practice 10-15 system designs",
    ],
  },
  {
    id: 5,
    title: "Portfolio Projects",
    subtitle: "Month 7",
    duration: "Month 7",
    icon: "05",
    color: "text-rose-400",
    gradient: "from-rose-500/20 to-rose-500/0",
    borderColor: "border-rose-500/20",
    goal: "Build strong projects to showcase skills.",
    topics: [
      "AI Resume Analyzer — NLP, resume parsing, skill matching",
      "Mini Uber Clone — ride matching, location tracking, trip management",
      "LLM Chat App — chat interface, vector DB, RAG",
    ],
    practice: "Build & deploy 3 projects with full documentation.",
    milestones: ["3 strong projects", "GitHub portfolio updated"],
  },
  {
    id: 6,
    title: "Interview Preparation",
    subtitle: "Month 8",
    duration: "Month 8",
    icon: "06",
    color: "text-cyan-400",
    gradient: "from-cyan-500/20 to-cyan-500/0",
    borderColor: "border-cyan-500/20",
    goal: "Prepare for real interviews.",
    topics: [
      "Daily LeetCode practice",
      "System design mock interviews",
      "Behavioral interview preparation",
    ],
    practice: "Complete 20 mock interviews on Pramp, Interviewing.io, Exponent.",
    milestones: [
      "20 mock interviews completed",
      "Resume ready for FAANG applications",
    ],
    platforms: ["Pramp", "Interviewing.io", "Exponent"],
  },
];

const weeklyPlan = [
  { day: "Monday", focus: "Arrays + LeetCode practice", color: "bg-emerald-500/20 text-emerald-400" },
  { day: "Tuesday", focus: "Linked Lists", color: "bg-blue-500/20 text-blue-400" },
  { day: "Wednesday", focus: "Trees", color: "bg-violet-500/20 text-violet-400" },
  { day: "Thursday", focus: "Graphs", color: "bg-amber-500/20 text-amber-400" },
  { day: "Friday", focus: "Dynamic Programming", color: "bg-rose-500/20 text-rose-400" },
  { day: "Saturday", focus: "Project work", color: "bg-cyan-500/20 text-cyan-400" },
  { day: "Sunday", focus: "Mock interviews", color: "bg-indigo-500/20 text-indigo-400" },
];

const targets = [
  { label: "LeetCode Problems", target: "300+", icon: "code" },
  { label: "Projects", target: "3", icon: "folder" },
  { label: "Mock Interviews", target: "20", icon: "mic" },
  { label: "System Designs", target: "15", icon: "layout" },
];

const dailyCommitment = [
  { activity: "Programming practice", hours: 2 },
  { activity: "Data structures", hours: 2 },
  { activity: "LeetCode problems", hours: 2 },
  { activity: "System design / CS concepts", hours: 1 },
  { activity: "Projects", hours: 1 },
];

const resources = [
  { category: "Programming", name: "Harvard CS50", url: "https://cs50.harvard.edu" },
  { category: "Algorithms", name: "NeetCode Roadmap", url: "https://neetcode.io/roadmap" },
  { category: "Practice", name: "LeetCode", url: "https://leetcode.com" },
  { category: "Practice", name: "HackerRank", url: "https://hackerrank.com" },
  { category: "System Design", name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
];

/* ─── sub-components ──────────────────────────────────────── */

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-white/50">{label}</span>
        <span className={cn("font-mono text-xs", color)}>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className={cn("h-full rounded-full", color.replace("text-", "bg-").replace("400", "500/60"))}
        />
      </div>
    </div>
  );
}

function TimelineNode({ phase, index, isExpanded, onToggle }: {
  phase: Phase;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <FadeIn delay={index * 0.08}>
      <div className="relative flex gap-6">
        {/* Timeline line */}
        <div className="flex flex-col items-center">
          <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative z-10 w-12 h-12 rounded-xl flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 cursor-pointer",
              isExpanded
                ? `bg-gradient-to-br ${phase.gradient} ${phase.color} border ${phase.borderColor} shadow-lg`
                : "bg-white/5 text-white/40 border border-white/10 hover:border-white/20"
            )}
          >
            {phase.icon}
          </motion.button>
          {index < phases.length - 1 && (
            <div className={cn(
              "w-px flex-1 min-h-[20px] transition-colors duration-300",
              isExpanded ? phase.borderColor.replace("border-", "bg-") : "bg-white/10"
            )} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pb-8">
          <button
            onClick={onToggle}
            className="w-full text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-1">
              <h3 className={cn(
                "font-display font-bold text-lg transition-colors",
                isExpanded ? phase.color : "text-white/70 group-hover:text-white"
              )}>
                {phase.title}
              </h3>
              <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5">
                {phase.duration}
              </span>
              <motion.svg
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-4 h-4 text-white/30 ml-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </div>
            <p className="font-body text-sm text-white/40">{phase.goal}</p>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className={cn("mt-4 glass-card rounded-xl p-5 border", phase.borderColor)}>
                  {/* Topics */}
                  <div className="mb-4">
                    <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
                      {phase.id === 5 ? "Projects" : "Topics"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {phase.topics.map((topic) => (
                        <span
                          key={topic}
                          className={cn(
                            "px-2.5 py-1 rounded-lg font-mono text-xs border",
                            phase.borderColor,
                            `bg-gradient-to-r ${phase.gradient}`
                          )}
                        >
                          <span className={phase.color}>{topic}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Practice */}
                  <div className="mb-4">
                    <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">
                      Practice
                    </p>
                    <p className="font-body text-sm text-white/60">{phase.practice}</p>
                  </div>

                  {/* Platforms */}
                  {phase.platforms && (
                    <div className="mb-4">
                      <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">
                        Platforms
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {phase.platforms.map((p) => (
                          <span key={p} className="px-2.5 py-1 rounded-lg font-mono text-xs bg-white/5 text-white/50 border border-white/10">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Milestones */}
                  <div>
                    <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">
                      Milestones
                    </p>
                    <div className="space-y-1.5">
                      {phase.milestones.map((m) => (
                        <div key={m} className="flex items-center gap-2">
                          <div className={cn("w-1.5 h-1.5 rounded-full", phase.color.replace("text-", "bg-"))} />
                          <span className="font-body text-sm text-white/60">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </FadeIn>
  );
}

/* ─── main component ──────────────────────────────────────── */

export function FAANGRoadmapClient() {
  const { user, loading } = useAuth();
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([1]));

  const togglePhase = (id: number) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedPhases(new Set(phases.map((p) => p.id)));
  const collapseAll = () => setExpandedPhases(new Set());

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isOwner(user.email)) {
    return (
      <FadeIn>
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v.01M12 12v-4m0 12a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-xl text-white mb-2">Access Restricted</h2>
          <p className="font-body text-sm text-white/40 max-w-md mx-auto">
            This preparation roadmap is private and only accessible to the owner.
          </p>
        </div>
      </FadeIn>
    );
  }

  const totalHours = dailyCommitment.reduce((sum, d) => sum + d.hours, 0);

  return (
    <div className="space-y-12">
      {/* ── Deadline Banner ─────────────────────────── */}
      <FadeIn>
        <div className="glass-card rounded-2xl p-6 border border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-violet-500/5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-1">Mission</p>
              <h2 className="font-display font-bold text-xl text-white">
                Beginner → FAANG Engineer
              </h2>
              <p className="font-body text-sm text-white/40 mt-1">
                Transform through consistent learning and daily practice.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="glass-card rounded-xl px-4 py-3 border border-amber-500/20 text-center">
                <p className="font-mono text-[10px] text-amber-400 uppercase tracking-widest">Deadline</p>
                <p className="font-display font-bold text-lg text-white mt-0.5">Nov 17</p>
              </div>
              <div className="glass-card rounded-xl px-4 py-3 border border-emerald-500/20 text-center">
                <p className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">Duration</p>
                <p className="font-display font-bold text-lg text-white mt-0.5">8 Months</p>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* ── Progress Overview ───────────────────────── */}
      <FadeIn delay={0.05}>
        <div className="glass-card rounded-2xl p-6">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-5">
            Progress Overview
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <ProgressBar label="Programming Foundations" value={0} color="text-emerald-400" />
            <ProgressBar label="Data Structures" value={0} color="text-blue-400" />
            <ProgressBar label="Algorithms" value={0} color="text-violet-400" />
            <ProgressBar label="System Design" value={0} color="text-amber-400" />
            <ProgressBar label="Projects" value={0} color="text-rose-400" />
            <ProgressBar label="Interview Prep" value={0} color="text-cyan-400" />
          </div>
        </div>
      </FadeIn>

      {/* ── Targets Grid ────────────────────────────── */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {targets.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass-card rounded-xl p-4 text-center border border-white/5 hover:border-blue-500/20 transition-colors"
            >
              <p className="font-display font-bold text-2xl text-white">{t.target}</p>
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mt-1">
                {t.label}
              </p>
            </motion.div>
          ))}
        </div>
      </FadeIn>

      {/* ── Timeline Roadmap ────────────────────────── */}
      <FadeIn delay={0.15}>
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
              6-Phase Roadmap
            </p>
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="font-mono text-[10px] text-white/30 hover:text-white/60 px-2 py-1 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all"
              >
                Expand all
              </button>
              <button
                onClick={collapseAll}
                className="font-mono text-[10px] text-white/30 hover:text-white/60 px-2 py-1 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-all"
              >
                Collapse all
              </button>
            </div>
          </div>

          <div>
            {phases.map((phase, index) => (
              <TimelineNode
                key={phase.id}
                phase={phase}
                index={index}
                isExpanded={expandedPhases.has(phase.id)}
                onToggle={() => togglePhase(phase.id)}
              />
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Weekly Study Plan ───────────────────────── */}
      <FadeIn delay={0.2}>
        <div className="glass-card rounded-2xl p-6">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-5">
            Weekly Study Plan
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {weeklyPlan.map((w, i) => (
              <motion.div
                key={w.day}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="glass-card rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors text-center"
              >
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-wider mb-2">
                  {w.day}
                </p>
                <span className={cn("inline-block px-2 py-1 rounded-lg font-mono text-[11px]", w.color)}>
                  {w.focus}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Daily Commitment ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FadeIn delay={0.25}>
          <div className="glass-card rounded-2xl p-6 h-full">
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-5">
              Daily Study Commitment
            </p>
            <div className="space-y-3">
              {dailyCommitment.map((d) => (
                <div key={d.activity} className="flex items-center justify-between">
                  <span className="font-body text-sm text-white/60">{d.activity}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(d.hours / totalHours) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="h-full rounded-full bg-blue-500/40"
                      />
                    </div>
                    <span className="font-mono text-xs text-blue-400 w-10 text-right">
                      {d.hours}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="font-body text-sm text-white/40">Total daily</span>
              <span className="font-mono text-sm text-white font-bold">{totalHours} hours</span>
            </div>
          </div>
        </FadeIn>

        {/* ── Resources ───────────────────────────────── */}
        <FadeIn delay={0.3}>
          <div className="glass-card rounded-2xl p-6 h-full">
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-5">
              Learning Resources
            </p>
            <div className="space-y-3">
              {resources.map((r) => (
                <a
                  key={r.name}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group px-3 py-2 -mx-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div>
                    <p className="font-body text-sm text-white/70 group-hover:text-white transition-colors">
                      {r.name}
                    </p>
                    <p className="font-mono text-[10px] text-white/30 uppercase tracking-wider">
                      {r.category}
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ── Final Goal ──────────────────────────────── */}
      <FadeIn delay={0.35}>
        <div className="glass-card rounded-2xl p-8 border border-blue-500/10 bg-gradient-to-br from-blue-500/5 via-transparent to-violet-500/5 text-center">
          <p className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-4">
            Final Goal — By November 17
          </p>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {[
              "Strong programming skills",
              "300+ coding problems solved",
              "3 portfolio projects",
              "System design knowledge",
              "Interview readiness for FAANG",
            ].map((goal, i) => (
              <motion.div
                key={goal}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="font-body text-sm text-white/70">{goal}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
