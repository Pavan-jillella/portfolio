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
  /* ── Phase 1: Python Mastery ──────────────────────────────── */
  {
    id: 1,
    title: "Python Programming Mastery",
    duration: "Mar 14 – Apr 27",
    goal: "Master Python as your primary interview language",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500",
    borderColor: "border-emerald-500/20",
    topics: [
      // Basics
      { id: "p1-variables", label: "Variables & Data Types (int, float, str, bool)" },
      { id: "p1-type-casting", label: "Type Casting & Type Checking" },
      { id: "p1-operators", label: "Operators (arithmetic, comparison, logical, bitwise)" },
      { id: "p1-string-formatting", label: "String Formatting (f-strings, .format)" },
      { id: "p1-input-output", label: "Input / Output & File I/O" },
      // Control Flow
      { id: "p1-conditionals", label: "Conditionals (if / elif / else)" },
      { id: "p1-for-loops", label: "For Loops & Range" },
      { id: "p1-while-loops", label: "While Loops & Break / Continue / Pass" },
      { id: "p1-comprehensions", label: "List / Dict / Set Comprehensions" },
      // Data Structures (built-in)
      { id: "p1-lists", label: "Lists (slicing, methods, copying)" },
      { id: "p1-tuples", label: "Tuples & Named Tuples" },
      { id: "p1-sets", label: "Sets & Frozen Sets" },
      { id: "p1-dicts", label: "Dictionaries (methods, defaultdict, Counter)" },
      { id: "p1-strings", label: "String Methods & Manipulation" },
      // Functions
      { id: "p1-functions", label: "Functions (params, return, default args)" },
      { id: "p1-args-kwargs", label: "*args, **kwargs & Unpacking" },
      { id: "p1-lambda", label: "Lambda Functions & map / filter / reduce" },
      { id: "p1-closures", label: "Closures & Decorators" },
      { id: "p1-generators", label: "Generators & Iterators (yield)" },
      // OOP
      { id: "p1-classes", label: "Classes & Objects" },
      { id: "p1-inheritance", label: "Inheritance & Polymorphism" },
      { id: "p1-encapsulation", label: "Encapsulation & Abstraction" },
      { id: "p1-dunder", label: "Dunder Methods (__init__, __str__, __repr__, __eq__)" },
      { id: "p1-dataclasses", label: "Dataclasses & @property" },
      // Advanced Python
      { id: "p1-exceptions", label: "Exception Handling (try/except/finally/raise)" },
      { id: "p1-collections", label: "Collections Module (deque, OrderedDict, ChainMap)" },
      { id: "p1-itertools", label: "itertools (permutations, combinations, product)" },
      { id: "p1-functools", label: "functools (lru_cache, partial, reduce)" },
      { id: "p1-regex", label: "Regular Expressions (re module)" },
      { id: "p1-sorting", label: "Custom Sorting (key, cmp_to_key, lambda)" },
      { id: "p1-bisect", label: "bisect Module (binary search helpers)" },
      { id: "p1-heapq", label: "heapq Module (min-heap operations)" },
    ],
  },
  /* ── Phase 2: Data Structures Deep Dive ───────────────────── */
  {
    id: 2,
    title: "Data Structures Deep Dive",
    duration: "Apr 28 – Jun 15",
    goal: "Master every data structure asked in Google interviews",
    color: "text-blue-400",
    bgColor: "bg-blue-500",
    borderColor: "border-blue-500/20",
    topics: [
      // Arrays
      { id: "p2-arrays-basics", label: "Arrays: Static vs Dynamic, Memory Layout" },
      { id: "p2-arrays-ops", label: "Arrays: Insert, Delete, Search, Rotate" },
      { id: "p2-arrays-2d", label: "2D Arrays / Matrices & Traversal Patterns" },
      { id: "p2-prefix-sum", label: "Prefix Sums & Difference Arrays" },
      // Strings
      { id: "p2-string-ops", label: "Strings: Immutability, StringBuilder Pattern" },
      { id: "p2-string-encoding", label: "String Encoding (ASCII, Unicode, UTF-8)" },
      { id: "p2-anagram", label: "Anagram, Palindrome & Substring Problems" },
      // Linked Lists
      { id: "p2-singly-ll", label: "Singly Linked List (insert, delete, reverse)" },
      { id: "p2-doubly-ll", label: "Doubly Linked List & Circular Linked List" },
      { id: "p2-ll-patterns", label: "LL Patterns: Fast/Slow Pointer, Merge, Cycle Detection" },
      { id: "p2-lru-cache", label: "LRU Cache (HashMap + Doubly Linked List)" },
      // Stacks
      { id: "p2-stack-basics", label: "Stack: Implementation & Operations" },
      { id: "p2-monotonic-stack", label: "Monotonic Stack (Next Greater Element)" },
      { id: "p2-stack-apps", label: "Stack Applications: Parentheses, Calculator, Decode" },
      // Queues
      { id: "p2-queue-basics", label: "Queue: Implementation, Circular Queue" },
      { id: "p2-deque", label: "Deque (Double-Ended Queue)" },
      { id: "p2-monotonic-queue", label: "Monotonic Deque (Sliding Window Maximum)" },
      // Hash Tables
      { id: "p2-hash-basics", label: "Hash Tables: Hash Functions, Collision Handling" },
      { id: "p2-hash-chaining", label: "Open Addressing vs Separate Chaining" },
      { id: "p2-hash-apps", label: "Hash Map Applications: Two Sum, Group Anagrams" },
      { id: "p2-hash-design", label: "Design HashMap from Scratch" },
      // Trees
      { id: "p2-binary-tree", label: "Binary Tree: Traversals (Inorder, Pre, Post, Level)" },
      { id: "p2-bst", label: "Binary Search Tree: Insert, Delete, Search, Validate" },
      { id: "p2-balanced-trees", label: "Balanced Trees: AVL, Red-Black Tree (concepts)" },
      { id: "p2-tree-patterns", label: "Tree Patterns: LCA, Diameter, Path Sum, Serialize" },
      { id: "p2-nary-tree", label: "N-ary Trees & Tree Reconstruction" },
      // Heaps
      { id: "p2-heap-basics", label: "Heap: Min-Heap, Max-Heap, Heapify" },
      { id: "p2-heap-sort", label: "Heap Sort & Priority Queue" },
      { id: "p2-heap-apps", label: "Heap Apps: Top K, Median Finder, Merge K Sorted" },
      // Tries
      { id: "p2-trie-basics", label: "Trie: Insert, Search, StartsWith" },
      { id: "p2-trie-apps", label: "Trie Apps: Autocomplete, Word Search, Word Break" },
      // Graphs
      { id: "p2-graph-basics", label: "Graph: Adjacency List vs Matrix, Directed/Undirected" },
      { id: "p2-graph-weighted", label: "Weighted Graphs & Edge Lists" },
      { id: "p2-graph-representations", label: "Graph: In-degree, Out-degree, Connected Components" },
      // Advanced DS
      { id: "p2-union-find", label: "Disjoint Set / Union-Find (Path Compression, Union by Rank)" },
      { id: "p2-segment-tree", label: "Segment Tree (Range Queries & Updates)" },
      { id: "p2-bit", label: "Binary Indexed Tree / Fenwick Tree" },
    ],
  },
  /* ── Phase 3: Core Algorithms & Patterns ──────────────────── */
  {
    id: 3,
    title: "Core Algorithms & Patterns",
    duration: "Jun 16 – Jul 27",
    goal: "Master the 15 essential coding interview patterns",
    color: "text-violet-400",
    bgColor: "bg-violet-500",
    borderColor: "border-violet-500/20",
    topics: [
      // Sorting
      { id: "p3-sort-basic", label: "Sorting: Bubble, Selection, Insertion" },
      { id: "p3-sort-efficient", label: "Sorting: Merge Sort & Quick Sort (in-depth)" },
      { id: "p3-sort-noncomp", label: "Non-Comparison Sorts: Counting, Radix, Bucket" },
      { id: "p3-sort-custom", label: "Custom Sorting: Comparators, Stability, Timsort" },
      // Searching
      { id: "p3-binary-search", label: "Binary Search: Standard, Lower/Upper Bound" },
      { id: "p3-bs-variants", label: "Binary Search on Answer, Rotated Array, Matrix" },
      { id: "p3-bs-advanced", label: "Binary Search: Kth Element, Peak Finding" },
      // Two Pointers
      { id: "p3-two-ptr-opposite", label: "Two Pointers: Opposite Direction (3Sum, Container)" },
      { id: "p3-two-ptr-same", label: "Two Pointers: Same Direction (Remove Duplicates)" },
      { id: "p3-two-ptr-partition", label: "Two Pointers: Partition, Dutch National Flag" },
      // Sliding Window
      { id: "p3-sw-fixed", label: "Sliding Window: Fixed Size (Max Sum Subarray)" },
      { id: "p3-sw-variable", label: "Sliding Window: Variable Size (Min Window Substring)" },
      { id: "p3-sw-hash", label: "Sliding Window + Hash Map Patterns" },
      // Recursion & Backtracking
      { id: "p3-recursion", label: "Recursion: Base Case, Recursive Tree, Call Stack" },
      { id: "p3-backtrack-subsets", label: "Backtracking: Subsets, Permutations, Combinations" },
      { id: "p3-backtrack-constraints", label: "Backtracking: N-Queens, Sudoku, Word Search" },
      { id: "p3-backtrack-pruning", label: "Pruning & Optimization Techniques" },
      // Greedy
      { id: "p3-greedy-intervals", label: "Greedy: Interval Scheduling, Merge Intervals" },
      { id: "p3-greedy-general", label: "Greedy: Jump Game, Gas Station, Task Scheduler" },
      { id: "p3-greedy-proof", label: "Greedy: When to Use & Proof of Correctness" },
      // Divide & Conquer
      { id: "p3-dnc-merge", label: "Divide & Conquer: Merge Sort, Quick Select" },
      { id: "p3-dnc-closest", label: "Divide & Conquer: Closest Pair, Count Inversions" },
      // Bit Manipulation
      { id: "p3-bit-basics", label: "Bit Manipulation: AND, OR, XOR, NOT, Shifts" },
      { id: "p3-bit-tricks", label: "Bit Tricks: Power of 2, Count Bits, Single Number" },
      { id: "p3-bit-masks", label: "Bitmask: Subset Generation, States" },
      // Math & Number Theory
      { id: "p3-math-gcd", label: "Math: GCD, LCM, Euclidean Algorithm" },
      { id: "p3-math-primes", label: "Math: Sieve of Eratosthenes, Prime Factorization" },
      { id: "p3-math-modular", label: "Modular Arithmetic & Fast Exponentiation" },
      { id: "p3-math-combinatorics", label: "Combinatorics (nCr, Pascal's Triangle)" },
    ],
  },
  /* ── Phase 4: Dynamic Programming Mastery ─────────────────── */
  {
    id: 4,
    title: "Dynamic Programming Mastery",
    duration: "Jul 28 – Aug 24",
    goal: "Master DP — Google's most-asked algorithm category",
    color: "text-fuchsia-400",
    bgColor: "bg-fuchsia-500",
    borderColor: "border-fuchsia-500/20",
    topics: [
      // Foundations
      { id: "p4-dp-intro", label: "DP Foundations: Memoization vs Tabulation" },
      { id: "p4-dp-identify", label: "Identifying DP Problems: Overlapping Subproblems" },
      { id: "p4-dp-state", label: "State Definition & Transition Formulation" },
      // 1D DP
      { id: "p4-dp-fibonacci", label: "1D DP: Fibonacci, Climbing Stairs, House Robber" },
      { id: "p4-dp-jump", label: "1D DP: Jump Game, Decode Ways, Word Break" },
      { id: "p4-dp-lis", label: "Longest Increasing Subsequence (LIS)" },
      // 2D DP
      { id: "p4-dp-grid", label: "2D DP: Unique Paths, Grid Min Path, Matrix Chain" },
      { id: "p4-dp-lcs", label: "Longest Common Subsequence / Substring (LCS)" },
      { id: "p4-dp-edit", label: "Edit Distance (Levenshtein Distance)" },
      // Knapsack
      { id: "p4-dp-01-knapsack", label: "0/1 Knapsack: Subset Sum, Partition Equal Subset" },
      { id: "p4-dp-unbounded", label: "Unbounded Knapsack: Coin Change, Rod Cutting" },
      { id: "p4-dp-bounded", label: "Bounded Knapsack & Variations" },
      // Interval DP
      { id: "p4-dp-interval", label: "Interval DP: Burst Balloons, Matrix Chain Multiply" },
      { id: "p4-dp-palindrome", label: "Palindrome DP: Longest Palindromic Subsequence" },
      // State Machine DP
      { id: "p4-dp-stock", label: "State Machine DP: Buy & Sell Stock (all variants)" },
      { id: "p4-dp-state-machine", label: "State Machine DP: Paint House, Paint Fence" },
      // Advanced DP
      { id: "p4-dp-bitmask", label: "Bitmask DP: TSP, Assign Tasks, Matching" },
      { id: "p4-dp-tree", label: "DP on Trees: House Robber III, Binary Tree Cameras" },
      { id: "p4-dp-digit", label: "Digit DP: Count Numbers with Specific Properties" },
      { id: "p4-dp-string", label: "String DP: Regular Expression, Wildcard Matching" },
      { id: "p4-dp-optimization", label: "Space Optimization: Rolling Array Technique" },
    ],
  },
  /* ── Phase 5: Graph Algorithms ────────────────────────────── */
  {
    id: 5,
    title: "Graph Algorithms",
    duration: "Aug 25 – Sep 14",
    goal: "Master graph algorithms — frequent in Google interviews",
    color: "text-orange-400",
    bgColor: "bg-orange-500",
    borderColor: "border-orange-500/20",
    topics: [
      // Traversals
      { id: "p5-bfs", label: "BFS: Level Order, Shortest Path (Unweighted)" },
      { id: "p5-dfs", label: "DFS: Connected Components, Cycle Detection" },
      { id: "p5-multi-source-bfs", label: "Multi-Source BFS (Rotting Oranges, 01 Matrix)" },
      { id: "p5-bidirectional-bfs", label: "Bidirectional BFS (Word Ladder)" },
      // Shortest Path
      { id: "p5-dijkstra", label: "Dijkstra's Algorithm (Weighted Shortest Path)" },
      { id: "p5-bellman-ford", label: "Bellman-Ford (Negative Weights)" },
      { id: "p5-floyd-warshall", label: "Floyd-Warshall (All-Pairs Shortest Path)" },
      { id: "p5-astar", label: "A* Search (Heuristic Shortest Path)" },
      // Topological Sort
      { id: "p5-topo-kahn", label: "Topological Sort: Kahn's Algorithm (BFS)" },
      { id: "p5-topo-dfs", label: "Topological Sort: DFS-based" },
      { id: "p5-topo-apps", label: "Applications: Course Schedule, Build Order, Alien Dict" },
      // MST
      { id: "p5-kruskal", label: "Minimum Spanning Tree: Kruskal's Algorithm" },
      { id: "p5-prim", label: "Minimum Spanning Tree: Prim's Algorithm" },
      // Connectivity
      { id: "p5-tarjan", label: "Tarjan's SCC (Strongly Connected Components)" },
      { id: "p5-articulation", label: "Articulation Points & Bridges" },
      { id: "p5-bipartite", label: "Bipartite Check (Graph Coloring)" },
      // Advanced
      { id: "p5-union-find-apps", label: "Union-Find Applications: Accounts Merge, Redundant" },
      { id: "p5-euler", label: "Euler Path / Circuit (Reconstruct Itinerary)" },
      { id: "p5-network-flow", label: "Network Flow Basics (Max Flow / Min Cut)" },
      // String Algorithms (Graph-like)
      { id: "p5-kmp", label: "KMP Algorithm (Pattern Matching)" },
      { id: "p5-rabin-karp", label: "Rabin-Karp (Rolling Hash)" },
      { id: "p5-manacher", label: "Manacher's Algorithm (Longest Palindromic Substring)" },
    ],
  },
  /* ── Phase 6: System Design ───────────────────────────────── */
  {
    id: 6,
    title: "System Design",
    duration: "Sep 15 – Oct 12",
    goal: "Learn to design scalable systems — required for Google L4+",
    color: "text-amber-400",
    bgColor: "bg-amber-500",
    borderColor: "border-amber-500/20",
    topics: [
      // Fundamentals
      { id: "p6-scalability", label: "Scalability: Vertical vs Horizontal Scaling" },
      { id: "p6-latency", label: "Latency, Throughput & Availability (SLAs)" },
      { id: "p6-cap-theorem", label: "CAP Theorem & PACELC" },
      { id: "p6-consistency", label: "Consistency Models: Strong, Eventual, Causal" },
      // Networking
      { id: "p6-tcp-udp", label: "TCP vs UDP, HTTP/HTTPS, HTTP/2, HTTP/3" },
      { id: "p6-rest-grpc", label: "REST vs gRPC vs GraphQL" },
      { id: "p6-websockets", label: "WebSockets & Server-Sent Events" },
      { id: "p6-dns-cdn", label: "DNS Resolution & CDN (CloudFront, Akamai)" },
      // Databases
      { id: "p6-sql", label: "SQL Databases: Indexing, Transactions, ACID" },
      { id: "p6-nosql", label: "NoSQL: Key-Value, Document, Column, Graph DBs" },
      { id: "p6-sharding", label: "Sharding Strategies & Partition Keys" },
      { id: "p6-replication", label: "Replication: Leader-Follower, Multi-Leader, Leaderless" },
      // Caching
      { id: "p6-caching", label: "Caching: Redis, Memcached, LRU/LFU Policies" },
      { id: "p6-cache-strategies", label: "Cache Strategies: Write-Through, Write-Back, Aside" },
      { id: "p6-cache-invalidation", label: "Cache Invalidation & Consistency" },
      // Infrastructure
      { id: "p6-load-balancer", label: "Load Balancing: Round Robin, Consistent Hashing" },
      { id: "p6-message-queues", label: "Message Queues: Kafka, RabbitMQ, Pub/Sub" },
      { id: "p6-rate-limiting", label: "Rate Limiting: Token Bucket, Leaky Bucket, Fixed Window" },
      { id: "p6-api-gateway", label: "API Gateway & Service Discovery" },
      { id: "p6-microservices", label: "Microservices: Circuit Breaker, Saga, CQRS" },
      // Storage
      { id: "p6-blob-storage", label: "Blob / Object Storage (S3, GCS)" },
      { id: "p6-file-systems", label: "Distributed File Systems (GFS, HDFS)" },
      // Monitoring
      { id: "p6-logging", label: "Logging, Metrics & Distributed Tracing" },
      // Design Exercises
      { id: "p6-design-url", label: "Design: URL Shortener (TinyURL)" },
      { id: "p6-design-twitter", label: "Design: Twitter / News Feed" },
      { id: "p6-design-instagram", label: "Design: Instagram" },
      { id: "p6-design-whatsapp", label: "Design: WhatsApp / Chat System" },
      { id: "p6-design-youtube", label: "Design: YouTube / Video Streaming" },
      { id: "p6-design-uber", label: "Design: Uber / Ride Sharing" },
      { id: "p6-design-netflix", label: "Design: Netflix / Content Delivery" },
      { id: "p6-design-google-drive", label: "Design: Google Drive / Dropbox" },
      { id: "p6-design-google-maps", label: "Design: Google Maps" },
      { id: "p6-design-search", label: "Design: Web Crawler / Search Engine" },
      { id: "p6-design-notification", label: "Design: Notification System" },
      { id: "p6-design-rate-limiter", label: "Design: Distributed Rate Limiter" },
    ],
  },
  /* ── Phase 7: Google-Specific & Behavioral ────────────────── */
  {
    id: 7,
    title: "Google-Specific & Behavioral",
    duration: "Oct 13 – Nov 2",
    goal: "Prepare for Google's unique interview process & culture fit",
    color: "text-rose-400",
    bgColor: "bg-rose-500",
    borderColor: "border-rose-500/20",
    topics: [
      // Google Process
      { id: "p7-google-process", label: "Google Hiring: Phone Screen → Onsite → HC → Team Match" },
      { id: "p7-google-levels", label: "Google Levels: L3 (SDE I), L4 (SDE II), L5 (Senior)" },
      { id: "p7-google-interviewer", label: "What Interviewers Look For: Signals & Rubrics" },
      // Googleyness
      { id: "p7-googleyness", label: "Googleyness: Collaboration, Intellectual Humility" },
      { id: "p7-ambiguity", label: "Navigating Ambiguity & Asking Clarifying Questions" },
      { id: "p7-pushback", label: "Pushing Back Respectfully & Defending Decisions" },
      // Behavioral (STAR)
      { id: "p7-star-method", label: "STAR Method: Situation, Task, Action, Result" },
      { id: "p7-leadership", label: "Leadership Stories (3-5 prepared)" },
      { id: "p7-conflict", label: "Conflict Resolution Stories (3-5 prepared)" },
      { id: "p7-failure", label: "Failure & Learning Stories (3-5 prepared)" },
      { id: "p7-project-deep-dive", label: "Past Project Deep Dives (2-3 projects)" },
      // Google-Specific Design
      { id: "p7-design-docs", label: "Design: Google Docs (Collaborative Editing)" },
      { id: "p7-design-gmail", label: "Design: Gmail (Email System at Scale)" },
      { id: "p7-design-calendar", label: "Design: Google Calendar" },
      { id: "p7-design-youtube-rec", label: "Design: YouTube Recommendations (ML Pipeline)" },
      // Portfolio Projects
      { id: "p7-project-1", label: "Project 1: Full-Stack App (demonstrate system design)" },
      { id: "p7-project-2", label: "Project 2: Algorithm-Heavy App (demonstrate DSA)" },
      { id: "p7-project-3", label: "Project 3: Open Source Contribution or API Project" },
      { id: "p7-resume", label: "Resume: Quantified Impact, Google-Friendly Format" },
    ],
  },
  /* ── Phase 8: Final Sprint & Mock Interviews ──────────────── */
  {
    id: 8,
    title: "Final Sprint & Mock Interviews",
    duration: "Nov 3 – Nov 17",
    goal: "Peak performance for interview day — simulate real conditions",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500",
    borderColor: "border-cyan-500/20",
    topics: [
      // LeetCode Mastery
      { id: "p8-blind75", label: "Solve Blind 75 (all reviewed)" },
      { id: "p8-neetcode150", label: "Solve NeetCode 150 (all reviewed)" },
      { id: "p8-google-tagged", label: "LeetCode Google-Tagged Problems (Top 50)" },
      { id: "p8-hard-problems", label: "Hard Problem Sprint (2-3 hards per day)" },
      { id: "p8-timed-practice", label: "Timed Practice: 2 mediums in 45 min" },
      // Mock Interviews
      { id: "p8-mock-coding-1", label: "Mock Interview: Coding Round 1" },
      { id: "p8-mock-coding-2", label: "Mock Interview: Coding Round 2" },
      { id: "p8-mock-coding-3", label: "Mock Interview: Coding Round 3" },
      { id: "p8-mock-sd-1", label: "Mock Interview: System Design Round 1" },
      { id: "p8-mock-sd-2", label: "Mock Interview: System Design Round 2" },
      { id: "p8-mock-behavioral", label: "Mock Interview: Behavioral / Googleyness" },
      { id: "p8-mock-full-loop", label: "Full Mock Loop: 4 Rounds Back-to-Back" },
      // Weak Area Review
      { id: "p8-review-dp", label: "Review Weak Area: DP Problems" },
      { id: "p8-review-graphs", label: "Review Weak Area: Graph Problems" },
      { id: "p8-review-sd", label: "Review Weak Area: System Design Gaps" },
      // Applications
      { id: "p8-referral", label: "Secure Referral(s) from Google Employees" },
      { id: "p8-application", label: "Submit Google Application" },
      { id: "p8-other-apps", label: "Submit Backup Applications (Meta, Amazon, Microsoft)" },
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
            {PHASES.map((phase) => (
              <div
                key={phase.id}
                className="flex flex-col items-center"
                style={{ width: `${100 / PHASES.length}%` }}
              >
                <div className={cn("w-px h-6", `${phase.bgColor}/30`)} />
              </div>
            ))}
          </div>
        </div>

        {/* Phase nodes row */}
        <div className="flex justify-between gap-2 mx-4 mb-2">
          {PHASES.map((phase) => {
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
                    {phase.duration}
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
          {PHASES.map((phase) => (
            <div key={phase.id} className="flex flex-col items-center flex-1">
              <div className={cn("w-px h-4", hoveredPhase === phase.id ? `${phase.bgColor}/40` : "bg-white/5")} />
            </div>
          ))}
        </div>

        {/* Topic branches */}
        <div className="flex justify-between gap-2 mx-4">
          {PHASES.map((phase) => {
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
  const [progress, setProgress] = useLocalStorage<RoadmapProgress>("pj-faang-roadmap", DEFAULT_PROGRESS);
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([1]));
  const [leetcodeUsername] = useLocalStorage<string>("pj-leetcode-username", "");
  const { data: leetcodeData } = useLeetCodeData(leetcodeUsername);

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
