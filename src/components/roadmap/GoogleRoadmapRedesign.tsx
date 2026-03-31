"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import {
  Play, ChevronRight, ChevronDown, Check, Target, Flame, Brain,
  Calendar, Clock, Zap, Trophy, BookOpen, Code2, Users, Rocket,
  TrendingUp, Star, Lock, Unlock, ArrowRight, ExternalLink,
  CheckCircle2, Circle, Sparkles, BarChart3, Timer
} from "lucide-react";
import {
  PROBLEM_BANK,
  type GooglePrepState,
  DEFAULT_GOOGLE_PREP_STATE,
  getBlind75Problems,
  getGrind169Problems,
  getGoogleFrequentProblems,
  calculateReadinessScore,
} from "@/lib/google-prep-data";

// ============================================================================
// PHASE DATA
// ============================================================================

interface Phase {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  weeks: number;
  goal: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  topics: string[];
  achievements: string[];
  milestones: string[];
  problemCount: number;
}

const PHASES: Phase[] = [
  {
    id: 1,
    title: "Python Mastery",
    subtitle: "Language Fluency",
    duration: "Mar 14 – Apr 27",
    weeks: 6,
    goal: "Become fluent in Python without docs",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500",
    borderColor: "border-emerald-500/30",
    icon: "🐍",
    topics: ["Variables", "Data Types", "Loops", "Functions", "OOP", "Decorators", "Generators", "List Comprehensions", "Lambda", "Collections", "itertools", "Exception Handling"],
    achievements: ["Write Python fast", "Solve 50+ problems", "Build logic confidence"],
    milestones: ["50 problems solved", "No Google while coding", "Implement DS from scratch"],
    problemCount: 50,
  },
  {
    id: 2,
    title: "Data Structures",
    subtitle: "Deep Dive",
    duration: "Apr 28 – Jun 15",
    weeks: 7,
    goal: "Implement every core data structure",
    color: "text-blue-400",
    bgColor: "bg-blue-500",
    borderColor: "border-blue-500/30",
    icon: "🏗️",
    topics: ["Arrays", "Linked Lists", "Stacks", "Queues", "Hash Tables", "Trees", "BST", "Heaps", "Tries", "Graphs", "Union-Find", "Segment Trees"],
    achievements: ["150+ problems done", "Explain all Big-O", "Implement in <20 min"],
    milestones: ["150 total problems", "All DS mastered", "Build LRU Cache"],
    problemCount: 100,
  },
  {
    id: 3,
    title: "Core Algorithms",
    subtitle: "Pattern Mastery",
    duration: "Jun 16 – Jul 27",
    weeks: 6,
    goal: "Master patterns used in 80% of interviews",
    color: "text-violet-400",
    bgColor: "bg-violet-500",
    borderColor: "border-violet-500/30",
    icon: "⚡",
    topics: ["Sorting", "Binary Search", "Two Pointers", "Sliding Window", "Recursion", "Backtracking", "Greedy", "Divide & Conquer", "Bit Manipulation"],
    achievements: ["250+ problems done", "Pattern recognition <2min", "Solve mediums in <25min"],
    milestones: ["250 total problems", "All patterns covered", "Speed increased 2x"],
    problemCount: 100,
  },
  {
    id: 4,
    title: "Dynamic Programming",
    subtitle: "The Boss Level",
    duration: "Jul 28 – Aug 24",
    weeks: 4,
    goal: "Conquer DP — most common hard category",
    color: "text-fuchsia-400",
    bgColor: "bg-fuchsia-500",
    borderColor: "border-fuchsia-500/30",
    icon: "🧠",
    topics: ["1D DP", "2D DP", "Knapsack", "LIS", "LCS", "Edit Distance", "State Machine", "Bitmask DP", "DP on Trees", "Interval DP"],
    achievements: ["320+ problems done", "DP mediums in <20min", "Derive recurrences fast"],
    milestones: ["320 total problems", "All DP patterns", "Can explain any DP"],
    problemCount: 70,
  },
  {
    id: 5,
    title: "Graph Algorithms",
    subtitle: "Google Staple",
    duration: "Aug 25 – Sep 14",
    weeks: 3,
    goal: "Master graph algorithms",
    color: "text-orange-400",
    bgColor: "bg-orange-500",
    borderColor: "border-orange-500/30",
    icon: "🕸️",
    topics: ["BFS", "DFS", "Dijkstra", "Bellman-Ford", "Topological Sort", "MST", "Union-Find", "SCC", "Bipartite"],
    achievements: ["350+ problems done", "Implement from memory", "Graph modeling expert"],
    milestones: ["350 total problems", "All graph algos", "Complex graph problems"],
    problemCount: 30,
  },
  {
    id: 6,
    title: "System Design",
    subtitle: "Think Big",
    duration: "Sep 15 – Oct 12",
    weeks: 4,
    goal: "Build strong system design fundamentals",
    color: "text-amber-400",
    bgColor: "bg-amber-500",
    borderColor: "border-amber-500/30",
    icon: "📐",
    topics: ["Scalability", "CAP Theorem", "Load Balancing", "Caching", "Sharding", "Databases", "Message Queues", "Microservices"],
    achievements: ["20+ designs done", "Structure 45-min discussion", "Trade-off expert"],
    milestones: ["20 system designs", "Design any system", "Whiteboard confident"],
    problemCount: 20,
  },
  {
    id: 7,
    title: "Google Prep",
    subtitle: "Company Specific",
    duration: "Oct 13 – Nov 2",
    weeks: 3,
    goal: "Prepare specifically for Google's process",
    color: "text-rose-400",
    bgColor: "bg-rose-500",
    borderColor: "border-rose-500/30",
    icon: "🎯",
    topics: ["Hiring Process", "Googleyness", "STAR Method", "Leadership Stories", "Project Deep Dives", "Google Designs"],
    achievements: ["15+ mock interviews", "5 STAR stories ready", "Confident presenter"],
    milestones: ["15 mocks done", "Stories polished", "Resume optimized"],
    problemCount: 30,
  },
  {
    id: 8,
    title: "Final Sprint",
    subtitle: "Go Time",
    duration: "Nov 3 – Nov 17",
    weeks: 2,
    goal: "Final review and intense mock practice",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500",
    borderColor: "border-cyan-500/30",
    icon: "🚀",
    topics: ["Blind 75 Review", "Hard Problem Sprint", "Full Mock Loops", "Weak Area Review", "Application Submission"],
    achievements: ["400+ problems done", "25+ mock interviews", "Interview ready"],
    milestones: ["400 total problems", "25 mocks completed", "Applications sent"],
    problemCount: 50,
  },
];

const WEEKLY_SCHEDULE = [
  { day: "Mon", focus: "Arrays + Strings", color: "bg-emerald-500/20 text-emerald-400" },
  { day: "Tue", focus: "Trees + Linked Lists", color: "bg-blue-500/20 text-blue-400" },
  { day: "Wed", focus: "Graphs", color: "bg-violet-500/20 text-violet-400" },
  { day: "Thu", focus: "Dynamic Programming", color: "bg-fuchsia-500/20 text-fuchsia-400" },
  { day: "Fri", focus: "System Design", color: "bg-amber-500/20 text-amber-400" },
  { day: "Sat", focus: "Mock + Projects", color: "bg-rose-500/20 text-rose-400" },
  { day: "Sun", focus: "Review + Chill", color: "bg-cyan-500/20 text-cyan-400" },
];

const DAILY_SCHEDULE = [
  { activity: "LeetCode Problems", hours: 3, color: "bg-gradient-to-r from-emerald-500 to-emerald-400" },
  { activity: "DSA Theory", hours: 2, color: "bg-gradient-to-r from-blue-500 to-blue-400" },
  { activity: "System Design", hours: 1, color: "bg-gradient-to-r from-violet-500 to-violet-400" },
  { activity: "Projects", hours: 1, color: "bg-gradient-to-r from-amber-500 to-amber-400" },
  { activity: "Review", hours: 1, color: "bg-gradient-to-r from-rose-500 to-rose-400" },
];

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection({ onStart, readinessScore }: { onStart: () => void; readinessScore: number }) {
  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.07] via-transparent to-violet-500/[0.07]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      {/* Glow orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[128px]" />

      <div className="relative px-6 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-xs text-white/50">Mar 14 → Nov 17, 2026</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-extrabold text-5xl md:text-7xl text-white mb-6 leading-tight"
          >
            From Zero to{" "}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Google SDE
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-body text-xl md:text-2xl text-white/40 mb-12"
          >
            400 Problems. 8 Phases. 8 Months. <span className="text-white/60">One Shot.</span>
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {[
              { icon: Calendar, label: "8 Months", value: "Duration" },
              { icon: Code2, label: "400+", value: "Problems" },
              { icon: Brain, label: "185+", value: "Topics" },
              { icon: Clock, label: "8 hrs", value: "Daily" },
              { icon: Target, label: `${readinessScore}%`, value: "Ready" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm"
              >
                <stat.icon className="w-5 h-5 text-white/30" />
                <div className="text-left">
                  <p className="font-display font-bold text-lg text-white leading-none">{stat.label}</p>
                  <p className="font-mono text-[10px] text-white/30 uppercase">{stat.value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={onStart}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-display font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.02]"
            >
              <Play className="w-5 h-5" />
              Start Roadmap
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white/60 font-display font-bold text-lg hover:bg-white/[0.06] hover:text-white transition-all">
              <BookOpen className="w-5 h-5" />
              View Full Plan
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TIMELINE SECTION
// ============================================================================

function TimelineSection({ selectedPhase, onSelectPhase }: { selectedPhase: number | null; onSelectPhase: (id: number) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-16">
      <div className="text-center mb-8">
        <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em] mb-2">Timeline Overview</p>
        <h2 className="font-display font-bold text-2xl text-white">Click a phase to explore</h2>
      </div>

      {/* Timeline scroll */}
      <div ref={scrollRef} className="relative overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
        <div className="flex items-center gap-3 px-6 min-w-max mx-auto justify-center">
          {PHASES.map((phase, i) => (
            <motion.button
              key={phase.id}
              onClick={() => onSelectPhase(phase.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
              className={cn(
                "relative flex flex-col items-center p-4 rounded-2xl border transition-all min-w-[100px]",
                selectedPhase === phase.id
                  ? `${phase.borderColor} bg-white/[0.04] ring-1 ${phase.borderColor}`
                  : "border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04]"
              )}
            >
              {/* Connector line */}
              {i < PHASES.length - 1 && (
                <div className="absolute top-1/2 -right-3 w-3 h-[2px] bg-white/[0.08]" />
              )}

              <span className="text-2xl mb-2">{phase.icon}</span>
              <span className={cn("font-mono text-xs font-bold", selectedPhase === phase.id ? phase.color : "text-white/50")}>
                {phase.weeks}w
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PHASE ACCORDION
// ============================================================================

function PhaseAccordion({ selectedPhase, onSelectPhase, state }: { selectedPhase: number | null; onSelectPhase: (id: number) => void; state: GooglePrepState }) {
  return (
    <section className="py-8 px-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {PHASES.map((phase, i) => {
          const isExpanded = selectedPhase === phase.id;
          const solvedInPhase = state.solvedProblems.filter(id => {
            const p = PROBLEM_BANK.find(prob => prob.id === id);
            return p && p.phase === phase.id;
          }).length;
          const progress = Math.min(100, Math.round((solvedInPhase / Math.max(1, phase.problemCount)) * 100));

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={cn(
                "rounded-3xl border overflow-hidden transition-all",
                isExpanded ? `${phase.borderColor} bg-white/[0.03]` : "border-white/[0.05] bg-white/[0.015]"
              )}
            >
              {/* Header */}
              <button
                onClick={() => onSelectPhase(isExpanded ? 0 : phase.id)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border", phase.borderColor, `${phase.bgColor}/10`)}>
                  {phase.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={cn("font-display font-bold text-lg", isExpanded ? phase.color : "text-white")}>
                      {phase.title}
                    </h3>
                    <span className="font-mono text-[10px] text-white/20 uppercase">{phase.subtitle}</span>
                  </div>
                  <p className="font-body text-sm text-white/40">{phase.goal}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <p className="font-mono text-xs text-white/30">{phase.duration}</p>
                    <p className={cn("font-display font-bold text-lg", phase.color)}>{progress}%</p>
                  </div>
                  <ChevronDown className={cn("w-5 h-5 text-white/30 transition-transform", isExpanded && "rotate-180")} />
                </div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 space-y-6">
                      {/* Progress bar */}
                      <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={cn("h-full rounded-full", phase.bgColor)}
                        />
                      </div>

                      {/* Topics as chips */}
                      <div>
                        <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-3">Topics</p>
                        <div className="flex flex-wrap gap-2">
                          {phase.topics.map((topic) => (
                            <span
                              key={topic}
                              className={cn("px-3 py-1.5 rounded-xl text-xs font-mono border", phase.borderColor, `${phase.bgColor}/10`, phase.color)}
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Achievements & Milestones */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4">
                          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-3">What You&apos;ll Achieve</p>
                          <ul className="space-y-2">
                            {phase.achievements.map((achievement) => (
                              <li key={achievement} className="flex items-center gap-2">
                                <Sparkles className={cn("w-4 h-4", phase.color)} />
                                <span className="font-body text-sm text-white/60">{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-4">
                          <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-3">Milestones</p>
                          <ul className="space-y-2">
                            {phase.milestones.map((milestone) => (
                              <li key={milestone} className="flex items-center gap-2">
                                <CheckCircle2 className={cn("w-4 h-4", phase.color)} />
                                <span className="font-body text-sm text-white/60">{milestone}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================================
// WEEKLY & DAILY PLAN
// ============================================================================

function ScheduleSection() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Plan */}
          <div className="rounded-3xl border border-white/[0.05] bg-white/[0.015] p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-blue-400" />
              <h3 className="font-display font-bold text-lg text-white">Weekly Schedule</h3>
            </div>
            <div className="space-y-2">
              {WEEKLY_SCHEDULE.map((day) => (
                <div key={day.day} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-white/30 w-10">{day.day}</span>
                  <div className={cn("flex-1 px-4 py-2.5 rounded-xl font-mono text-sm", day.color)}>
                    {day.focus}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Plan */}
          <div className="rounded-3xl border border-white/[0.05] bg-white/[0.015] p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-violet-400" />
                <h3 className="font-display font-bold text-lg text-white">Daily Plan</h3>
              </div>
              <span className="font-mono text-sm text-violet-400 font-bold">8 hrs</span>
            </div>
            <div className="space-y-4">
              {DAILY_SCHEDULE.map((item) => (
                <div key={item.activity} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-white/60">{item.activity}</span>
                    <span className="font-mono text-xs text-white/30">{item.hours}h</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(item.hours / 8) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={cn("h-full rounded-full", item.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// PROBLEM BANK (GAMIFIED)
// ============================================================================

function ProblemBankSection({ state, onNavigate }: { state: GooglePrepState; onNavigate: () => void }) {
  const blind75 = getBlind75Problems();
  const grind169 = getGrind169Problems();
  const googleTop = getGoogleFrequentProblems();

  const blind75Progress = state.solvedProblems.filter(id => blind75.some(p => p.id === id)).length;
  const grind169Progress = state.solvedProblems.filter(id => grind169.some(p => p.id === id)).length;
  const googleProgress = state.solvedProblems.filter(id => googleTop.some(p => p.id === id)).length;

  const problemLists = [
    {
      title: "Blind 75",
      description: "The essential interview problems",
      icon: "🔥",
      color: "from-orange-500 to-red-500",
      borderColor: "border-orange-500/30",
      progress: blind75Progress,
      total: blind75.length,
      difficulty: "Warm Up",
    },
    {
      title: "Grind 169",
      description: "Extended problem set for mastery",
      icon: "⚔️",
      color: "from-blue-500 to-violet-500",
      borderColor: "border-blue-500/30",
      progress: grind169Progress,
      total: grind169.length,
      difficulty: "Standard",
    },
    {
      title: "Google Top Questions",
      description: "Most frequently asked at Google",
      icon: "🧠",
      color: "from-emerald-500 to-cyan-500",
      borderColor: "border-emerald-500/30",
      progress: googleProgress,
      total: googleTop.length,
      difficulty: "Hard Mode",
    },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em] mb-2">Problem Bank</p>
          <h2 className="font-display font-bold text-3xl text-white">Choose Your Challenge</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problemLists.map((list, i) => (
            <motion.button
              key={list.title}
              onClick={onNavigate}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
              className={cn(
                "group relative rounded-3xl border p-6 text-left overflow-hidden transition-all",
                list.borderColor, "bg-white/[0.02] hover:bg-white/[0.04]"
              )}
            >
              {/* Background gradient */}
              <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br", list.color)} />

              <div className="relative">
                <span className="text-4xl mb-4 block">{list.icon}</span>
                <h3 className="font-display font-bold text-xl text-white mb-1">{list.title}</h3>
                <p className="font-body text-sm text-white/40 mb-4">{list.description}</p>

                {/* Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-white/30">{list.progress}/{list.total}</span>
                    <span className="font-mono text-xs text-white/20">{Math.round((list.progress / list.total) * 100)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className={cn("h-full rounded-full bg-gradient-to-r", list.color)}
                      style={{ width: `${(list.progress / list.total) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-white/20 uppercase">{list.difficulty}</span>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// DASHBOARD PREVIEW
// ============================================================================

function DashboardPreview({ state }: { state: GooglePrepState }) {
  const readiness = calculateReadinessScore(state);
  const streak = state.currentDailyStreak;
  const solved = state.solvedProblems.length;

  // Generate heatmap data
  const heatmapData = useMemo(() => {
    const data: { date: string; count: number }[] = [];
    const today = new Date();
    for (let i = 41; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      data.push({ date: dateStr, count: state.analytics.dailyActivity[dateStr] || 0 });
    }
    return data;
  }, [state.analytics.dailyActivity]);

  const maxCount = Math.max(1, ...heatmapData.map(d => d.count));

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em] mb-2">Your Progress</p>
          <h2 className="font-display font-bold text-3xl text-white">Dashboard Preview</h2>
        </div>

        <div className="rounded-3xl border border-white/[0.06] bg-gradient-to-br from-blue-500/[0.03] via-transparent to-violet-500/[0.03] p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {/* Readiness Score */}
            <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <div className="relative w-24 h-24 mb-3">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="url(#readiness)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }}
                    whileInView={{ strokeDashoffset: 251.2 - (readiness / 100) * 251.2 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="readiness" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display font-extrabold text-2xl text-white">{readiness}%</span>
                </div>
              </div>
              <p className="font-mono text-[10px] text-white/30 uppercase">Readiness</p>
            </div>

            {/* Stats */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <Flame className="w-8 h-8 text-orange-400 mb-2" />
              <span className="font-display font-extrabold text-3xl text-white">{streak}</span>
              <p className="font-mono text-[10px] text-white/30 uppercase">Day Streak</p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <Target className="w-8 h-8 text-emerald-400 mb-2" />
              <span className="font-display font-extrabold text-3xl text-white">{solved}</span>
              <p className="font-mono text-[10px] text-white/30 uppercase">Solved</p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
              <Brain className="w-8 h-8 text-violet-400 mb-2" />
              <span className="font-display font-extrabold text-3xl text-white">
                {Object.keys(state.analytics.problemsByPattern).length}
              </span>
              <p className="font-mono text-[10px] text-white/30 uppercase">Patterns</p>
            </div>
          </div>

          {/* Heatmap */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5">
            <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest mb-4">Activity (6 weeks)</p>
            <div className="flex gap-1 justify-center">
              {Array.from({ length: 6 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {heatmapData.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day) => (
                    <div
                      key={day.date}
                      title={`${day.date}: ${day.count} problems`}
                      className={cn(
                        "w-4 h-4 rounded-sm transition-all",
                        day.count === 0
                          ? "bg-white/[0.03]"
                          : day.count <= maxCount * 0.25
                          ? "bg-emerald-500/30"
                          : day.count <= maxCount * 0.5
                          ? "bg-emerald-500/50"
                          : day.count <= maxCount * 0.75
                          ? "bg-emerald-500/70"
                          : "bg-emerald-500"
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FINAL GOAL SECTION
// ============================================================================

function FinalGoalSection() {
  const goals = [
    { icon: Code2, text: "400 Problems Solved", color: "text-emerald-400" },
    { icon: Users, text: "25 Mock Interviews", color: "text-blue-400" },
    { icon: BarChart3, text: "20 System Designs", color: "text-violet-400" },
    { icon: Rocket, text: "3 Strong Projects", color: "text-amber-400" },
  ];

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/[0.05] via-transparent to-transparent" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-mono text-[10px] text-blue-400 uppercase tracking-[0.3em] mb-4">By November 17, 2026</p>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white mb-8">
            Ready to walk into Google
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              with confidence
            </span>
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {goals.map((goal, i) => (
            <motion.div
              key={goal.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
            >
              <CheckCircle2 className={cn("w-5 h-5", goal.color)} />
              <span className="font-body text-sm text-white/70">{goal.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-display font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.02]"
        >
          <Rocket className="w-5 h-5" />
          Start Today
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function GoogleRoadmapRedesign() {
  const [state] = useLocalStorage<GooglePrepState>("pj-google-prep-state", DEFAULT_GOOGLE_PREP_STATE);
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const phaseRef = useRef<HTMLDivElement>(null);

  const readinessScore = useMemo(() => calculateReadinessScore(state), [state]);

  const handleStart = () => {
    setSelectedPhase(1);
    setTimeout(() => phaseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleSelectPhase = (id: number) => {
    setSelectedPhase(id === selectedPhase ? null : id);
    if (id !== selectedPhase) {
      setTimeout(() => phaseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  };

  const handleNavigateToProblemBank = () => {
    // This would typically navigate to the Advanced Training tab
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <HeroSection onStart={handleStart} readinessScore={readinessScore} />
      <TimelineSection selectedPhase={selectedPhase} onSelectPhase={handleSelectPhase} />
      <div ref={phaseRef}>
        <PhaseAccordion selectedPhase={selectedPhase} onSelectPhase={handleSelectPhase} state={state} />
      </div>
      <ScheduleSection />
      <ProblemBankSection state={state} onNavigate={handleNavigateToProblemBank} />
      <DashboardPreview state={state} />
      <FinalGoalSection />
    </div>
  );
}
