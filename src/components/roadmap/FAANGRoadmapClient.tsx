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
    title: "Python Programming Mastery",
    subtitle: "Mar 14 – Apr 27",
    duration: "Mar 14 – Apr 27 (6 weeks)",
    icon: "01",
    color: "text-emerald-400",
    gradient: "from-emerald-500/20 to-emerald-500/0",
    borderColor: "border-emerald-500/20",
    goal: "Master Python as your primary interview language.",
    topics: [
      "Variables & Data Types (int, float, str, bool)",
      "Type Casting & Type Checking",
      "Operators (arithmetic, comparison, logical, bitwise)",
      "String Formatting (f-strings, .format)",
      "Conditionals (if / elif / else)",
      "For Loops, While Loops, Break / Continue / Pass",
      "List / Dict / Set Comprehensions",
      "Lists (slicing, methods, copying)",
      "Tuples & Named Tuples",
      "Sets & Frozen Sets",
      "Dictionaries (methods, defaultdict, Counter)",
      "String Methods & Manipulation",
      "Functions (params, return, default args)",
      "*args, **kwargs & Unpacking",
      "Lambda Functions & map / filter / reduce",
      "Closures & Decorators",
      "Generators & Iterators (yield)",
      "Classes & Objects",
      "Inheritance & Polymorphism",
      "Encapsulation & Abstraction",
      "Dunder Methods (__init__, __str__, __eq__)",
      "Dataclasses & @property",
      "Exception Handling (try/except/finally)",
      "Collections Module (deque, OrderedDict)",
      "itertools (permutations, combinations, product)",
      "functools (lru_cache, partial, reduce)",
      "Regular Expressions (re module)",
      "Custom Sorting (key, cmp_to_key)",
      "bisect & heapq Modules",
    ],
    practice: "Solve 10-15 easy coding problems daily on HackerRank/LeetCode.",
    milestones: ["Write clean Pythonic code", "Solve 80+ beginner problems", "Comfortable with all built-in data structures"],
    platforms: ["HackerRank", "LeetCode (Easy)", "Codewars", "Python.org Docs"],
  },
  {
    id: 2,
    title: "Data Structures Deep Dive",
    subtitle: "Apr 28 – Jun 15",
    duration: "Apr 28 – Jun 15 (7 weeks)",
    icon: "02",
    color: "text-blue-400",
    gradient: "from-blue-500/20 to-blue-500/0",
    borderColor: "border-blue-500/20",
    goal: "Master every data structure asked in Google interviews.",
    topics: [
      "Arrays: Static vs Dynamic, Memory Layout",
      "2D Arrays / Matrices & Traversal Patterns",
      "Prefix Sums & Difference Arrays",
      "Strings: Immutability, Encoding (ASCII, UTF-8)",
      "Anagram, Palindrome & Substring Problems",
      "Singly & Doubly Linked Lists (insert, delete, reverse)",
      "LL Patterns: Fast/Slow Pointer, Merge, Cycle Detection",
      "LRU Cache (HashMap + Doubly Linked List)",
      "Stack: Implementation & Monotonic Stack",
      "Stack Apps: Parentheses, Calculator, Decode String",
      "Queue, Deque & Monotonic Deque",
      "Hash Tables: Hash Functions, Collision Handling",
      "Design HashMap from Scratch",
      "Binary Tree: Traversals (Inorder, Pre, Post, Level)",
      "BST: Insert, Delete, Search, Validate",
      "Balanced Trees: AVL, Red-Black (concepts)",
      "Tree Patterns: LCA, Diameter, Path Sum, Serialize",
      "Heap: Min/Max, Heapify, Heap Sort",
      "Heap Apps: Top K, Median Finder, Merge K Sorted",
      "Trie: Insert, Search, Autocomplete, Word Break",
      "Graph: Adjacency List vs Matrix, Directed/Undirected",
      "Weighted Graphs, In-degree, Out-degree",
      "Union-Find (Path Compression, Union by Rank)",
      "Segment Tree & Binary Indexed Tree (Fenwick)",
    ],
    practice: "Solve 5-8 LeetCode problems daily (Easy + Medium mix).",
    milestones: ["Master Big-O for all operations", "Implement each DS from scratch", "Solve 200 problems total"],
  },
  {
    id: 3,
    title: "Core Algorithms & Patterns",
    subtitle: "Jun 16 – Jul 27",
    duration: "Jun 16 – Jul 27 (6 weeks)",
    icon: "03",
    color: "text-violet-400",
    gradient: "from-violet-500/20 to-violet-500/0",
    borderColor: "border-violet-500/20",
    goal: "Master the 15 essential coding interview patterns.",
    topics: [
      "Sorting: Bubble, Selection, Insertion, Merge, Quick",
      "Non-Comparison Sorts: Counting, Radix, Bucket",
      "Binary Search: Standard, Lower/Upper Bound",
      "Binary Search on Answer, Rotated Array, Matrix",
      "Two Pointers: Opposite (3Sum, Container with Water)",
      "Two Pointers: Same Direction, Dutch National Flag",
      "Sliding Window: Fixed & Variable Size",
      "Sliding Window + Hash Map Patterns",
      "Recursion: Base Cases, Recursive Tree, Call Stack",
      "Backtracking: Subsets, Permutations, Combinations",
      "Backtracking: N-Queens, Sudoku, Word Search",
      "Greedy: Interval Scheduling, Merge Intervals",
      "Greedy: Jump Game, Gas Station, Task Scheduler",
      "Divide & Conquer: Merge Sort, Quick Select",
      "Bit Manipulation: AND, OR, XOR, Shifts",
      "Bit Tricks: Power of 2, Count Bits, Single Number",
      "Bitmask: Subset Generation & State Encoding",
      "Math: GCD, LCM, Sieve of Eratosthenes",
      "Modular Arithmetic & Combinatorics (nCr)",
    ],
    practice: "Focus on medium problems. Target: Easy 120 | Medium 200 | Hard 80 = 400 total.",
    milestones: ["Master all 15 key patterns", "Solve medium problems in < 25 min"],
  },
  {
    id: 4,
    title: "Dynamic Programming Mastery",
    subtitle: "Jul 28 – Aug 24",
    duration: "Jul 28 – Aug 24 (4 weeks)",
    icon: "04",
    color: "text-fuchsia-400",
    gradient: "from-fuchsia-500/20 to-fuchsia-500/0",
    borderColor: "border-fuchsia-500/20",
    goal: "Master DP — Google's most-asked algorithm category.",
    topics: [
      "DP Foundations: Memoization vs Tabulation",
      "1D DP: Fibonacci, Climbing Stairs, House Robber",
      "1D DP: Jump Game, Decode Ways, Word Break",
      "Longest Increasing Subsequence (LIS)",
      "2D DP: Unique Paths, Grid Min Path",
      "Longest Common Subsequence / Substring (LCS)",
      "Edit Distance (Levenshtein Distance)",
      "0/1 Knapsack: Subset Sum, Partition Equal Subset",
      "Unbounded Knapsack: Coin Change, Rod Cutting",
      "Interval DP: Burst Balloons, Matrix Chain",
      "Palindrome DP: Longest Palindromic Subsequence",
      "State Machine DP: Buy & Sell Stock (all variants)",
      "Bitmask DP: TSP, Assign Tasks",
      "DP on Trees: House Robber III, Binary Tree Cameras",
      "Digit DP & String DP (Regex, Wildcard)",
      "Space Optimization: Rolling Array Technique",
    ],
    practice: "Complete DP Study Plan on LeetCode. 3-5 DP problems daily.",
    milestones: ["Solve 80+ DP problems", "Identify DP patterns within 5 min", "Optimize space for all solutions"],
  },
  {
    id: 5,
    title: "Graph Algorithms",
    subtitle: "Aug 25 – Sep 14",
    duration: "Aug 25 – Sep 14 (3 weeks)",
    icon: "05",
    color: "text-orange-400",
    gradient: "from-orange-500/20 to-orange-500/0",
    borderColor: "border-orange-500/20",
    goal: "Master graph algorithms — frequent in Google interviews.",
    topics: [
      "BFS: Level Order, Shortest Path (Unweighted)",
      "DFS: Connected Components, Cycle Detection",
      "Multi-Source BFS (Rotting Oranges, 01 Matrix)",
      "Bidirectional BFS (Word Ladder)",
      "Dijkstra's Algorithm (Weighted Shortest Path)",
      "Bellman-Ford & Floyd-Warshall",
      "Topological Sort: Kahn's (BFS) & DFS-based",
      "Applications: Course Schedule, Alien Dictionary",
      "MST: Kruskal's & Prim's Algorithm",
      "Tarjan's SCC & Articulation Points",
      "Bipartite Check (Graph Coloring)",
      "Union-Find Apps: Accounts Merge, Redundant Edge",
      "Euler Path / Circuit",
      "KMP, Rabin-Karp (String Pattern Matching)",
      "Manacher's Algorithm (Palindromic Substring)",
    ],
    practice: "Complete Graph Study Plan on LeetCode. Focus on Google-tagged graph problems.",
    milestones: ["Solve 60+ graph problems", "Master BFS/DFS variations", "Handle weighted graph problems"],
    platforms: ["LeetCode (Graph Tag)", "NeetCode Graphs Section"],
  },
  {
    id: 6,
    title: "System Design",
    subtitle: "Sep 15 – Oct 12",
    duration: "Sep 15 – Oct 12 (4 weeks)",
    icon: "06",
    color: "text-amber-400",
    gradient: "from-amber-500/20 to-amber-500/0",
    borderColor: "border-amber-500/20",
    goal: "Design scalable systems — required for Google L4+.",
    topics: [
      "Scalability: Vertical vs Horizontal",
      "CAP Theorem, PACELC & Consistency Models",
      "TCP/UDP, HTTP, REST vs gRPC vs GraphQL",
      "WebSockets, DNS, CDN",
      "SQL: Indexing, Transactions, ACID",
      "NoSQL: Key-Value, Document, Column, Graph DBs",
      "Sharding, Replication & Partitioning",
      "Caching: Redis, LRU/LFU, Write-Through/Back/Aside",
      "Load Balancing: Round Robin, Consistent Hashing",
      "Message Queues: Kafka, Pub/Sub",
      "Rate Limiting: Token Bucket, Sliding Window",
      "Microservices: API Gateway, Circuit Breaker, Saga",
      "Blob Storage, Distributed File Systems",
      "Design: URL Shortener, Twitter, Instagram",
      "Design: WhatsApp, YouTube, Uber",
      "Design: Netflix, Google Drive, Google Maps",
      "Design: Web Crawler, Notification System",
      "Design: Distributed Rate Limiter",
    ],
    practice: "Practice 2-3 system designs per week. Draw architecture diagrams.",
    milestones: [
      "Design 15+ systems end-to-end",
      "Master trade-offs articulation",
      "Handle back-of-envelope estimation",
    ],
    platforms: ["System Design Primer", "Designing Data-Intensive Apps", "ByteByteGo"],
  },
  {
    id: 7,
    title: "Google-Specific & Behavioral",
    subtitle: "Oct 13 – Nov 2",
    duration: "Oct 13 – Nov 2 (3 weeks)",
    icon: "07",
    color: "text-rose-400",
    gradient: "from-rose-500/20 to-rose-500/0",
    borderColor: "border-rose-500/20",
    goal: "Prepare for Google's unique process & culture fit.",
    topics: [
      "Google Hiring: Phone Screen → Onsite → HC → Team Match",
      "Google Levels: L3 (SDE I), L4 (SDE II), L5 (Senior)",
      "What Interviewers Look For: Signals & Rubrics",
      "Googleyness: Collaboration, Intellectual Humility",
      "Navigating Ambiguity & Clarifying Questions",
      "STAR Method (Situation, Task, Action, Result)",
      "Leadership & Conflict Resolution Stories",
      "Failure & Learning Stories",
      "Past Project Deep Dives (2-3 projects)",
      "Design: Google Docs, Gmail, Calendar",
      "Design: YouTube Recommendations (ML Pipeline)",
      "Portfolio Projects (3 strong projects)",
      "Resume: Quantified Impact, Google-Friendly Format",
    ],
    practice: "Record yourself answering behavioral questions. Practice with peers.",
    milestones: [
      "15+ behavioral stories prepared",
      "3 portfolio projects deployed",
      "Resume reviewed by 2+ people",
    ],
    platforms: ["Pramp", "Interviewing.io", "Exponent"],
  },
  {
    id: 8,
    title: "Final Sprint & Mock Interviews",
    subtitle: "Nov 3 – Nov 17",
    duration: "Nov 3 – Nov 17 (2 weeks)",
    icon: "08",
    color: "text-cyan-400",
    gradient: "from-cyan-500/20 to-cyan-500/0",
    borderColor: "border-cyan-500/20",
    goal: "Peak performance — simulate real Google interview conditions.",
    topics: [
      "Blind 75 — all reviewed & solved",
      "NeetCode 150 — all reviewed & solved",
      "LeetCode Google-Tagged Top 50 problems",
      "Hard Problem Sprint: 2-3 hards per day",
      "Timed Practice: 2 mediums in 45 min",
      "Mock Coding Interviews (7+ sessions)",
      "Mock System Design Interviews (3+ sessions)",
      "Mock Behavioral Interview",
      "Full Mock Loop: 4 Rounds Back-to-Back",
      "Review Weak Areas: DP, Graphs, System Design",
      "Secure Referral(s) from Google employees",
      "Submit Google Application",
      "Submit Backup Apps (Meta, Amazon, Microsoft)",
    ],
    practice: "Full mock interviews every other day. Review ALL mistakes.",
    milestones: [
      "25+ mock interviews completed",
      "400+ LeetCode problems solved",
      "Confident in all interview formats",
    ],
    platforms: ["Pramp", "Interviewing.io", "Exponent", "LeetCode Contest"],
  },
];

const weeklyPlan = [
  { day: "Monday", focus: "DSA: Arrays, Strings, Hashing + LeetCode", color: "bg-emerald-500/20 text-emerald-400" },
  { day: "Tuesday", focus: "DSA: Trees, Linked Lists + LeetCode", color: "bg-blue-500/20 text-blue-400" },
  { day: "Wednesday", focus: "DSA: Graphs, BFS/DFS + LeetCode", color: "bg-violet-500/20 text-violet-400" },
  { day: "Thursday", focus: "Dynamic Programming + LeetCode", color: "bg-fuchsia-500/20 text-fuchsia-400" },
  { day: "Friday", focus: "System Design + Design Practice", color: "bg-amber-500/20 text-amber-400" },
  { day: "Saturday", focus: "Project Work + Mock Interview", color: "bg-rose-500/20 text-rose-400" },
  { day: "Sunday", focus: "Review Weak Areas + Behavioral Prep", color: "bg-cyan-500/20 text-cyan-400" },
];

const targets = [
  { label: "LeetCode Problems", target: "400+", icon: "code" },
  { label: "Portfolio Projects", target: "3", icon: "folder" },
  { label: "Mock Interviews", target: "25+", icon: "mic" },
  { label: "System Designs", target: "20+", icon: "layout" },
];

const dailyCommitment = [
  { activity: "LeetCode problems (med/hard)", hours: 3 },
  { activity: "Data structures & algorithms theory", hours: 2 },
  { activity: "System design study", hours: 1 },
  { activity: "Project work / open source", hours: 1 },
  { activity: "Review & behavioral prep", hours: 1 },
];

const resources = [
  { category: "Algorithms", name: "NeetCode Roadmap & Videos", url: "https://neetcode.io/roadmap" },
  { category: "Practice", name: "LeetCode (Google Tag)", url: "https://leetcode.com/company/google" },
  { category: "Practice", name: "Blind 75 Problem List", url: "https://neetcode.io/practice" },
  { category: "System Design", name: "System Design Primer (GitHub)", url: "https://github.com/donnemartin/system-design-primer" },
  { category: "System Design", name: "ByteByteGo (Alex Xu)", url: "https://bytebytego.com" },
  { category: "Behavioral", name: "Exponent Mock Interviews", url: "https://www.tryexponent.com" },
  { category: "CS Fundamentals", name: "MIT OpenCourseWare 6.006", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020" },
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
                Beginner → Google SDE
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
            <ProgressBar label="Python Programming Mastery" value={0} color="text-emerald-400" />
            <ProgressBar label="Data Structures Deep Dive" value={0} color="text-blue-400" />
            <ProgressBar label="Core Algorithms & Patterns" value={0} color="text-violet-400" />
            <ProgressBar label="Dynamic Programming Mastery" value={0} color="text-fuchsia-400" />
            <ProgressBar label="Graph Algorithms" value={0} color="text-orange-400" />
            <ProgressBar label="System Design" value={0} color="text-amber-400" />
            <ProgressBar label="Google-Specific & Behavioral" value={0} color="text-rose-400" />
            <ProgressBar label="Final Sprint & Mock Interviews" value={0} color="text-cyan-400" />
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
              8-Phase Roadmap
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
              "Python mastery for interviews",
              "400+ coding problems solved",
              "3 portfolio projects deployed",
              "20+ system designs mastered",
              "25+ mock interviews completed",
              "Google interview-ready",
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
