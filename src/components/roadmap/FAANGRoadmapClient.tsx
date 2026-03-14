"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";
import { isOwner } from "@/lib/roles";
import {
  buildRoadmapMindMap,
  PHASE_COLORS,
  PHASE_CLUSTERS,
  type RoadmapMindMapNode,
  type RoadmapMindMapEdge,
} from "@/lib/roadmap-mindmap-utils";

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
      "Strings (methods, slicing, regex basics)",
      "Functions (args, kwargs, return values)",
      "Lambda, Map, Filter, Reduce",
      "Recursion & Memoization",
      "Decorators & Closures",
      "Classes & OOP (init, methods, inheritance, polymorphism)",
      "Magic Methods (__str__, __repr__, __eq__, __hash__)",
      "Error Handling (try/except/finally, custom exceptions)",
      "File I/O & Context Managers",
      "Iterators & Generators (yield, next)",
      "Collections Module (deque, OrderedDict, defaultdict, Counter)",
      "Sorting (sorted, key functions, custom comparators)",
      "Binary Search (bisect module)",
      "Time & Space Complexity Analysis",
      "Built-in Functions Mastery (enumerate, zip, any, all)",
      "Virtual Environments & pip basics",
      "heapq module",
    ],
    practice: "Solve 3–5 easy LeetCode problems daily in Python. Focus on clean syntax.",
    milestones: [
      "Comfortable writing Python without docs",
      "50+ easy problems solved",
      "Can implement basic data structures from scratch",
    ],
    platforms: ["LeetCode", "HackerRank", "Python.org Docs"],
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
    goal: "Implement and deeply understand every core data structure.",
    topics: [
      "Arrays & Dynamic Arrays (operations, resizing)",
      "Array Manipulation (prefix sums, kadane's, sliding window)",
      "Strings (pattern matching, anagram detection, palindromes)",
      "Linked Lists (singly, doubly, circular)",
      "Linked List Operations (reverse, merge, cycle detection)",
      "Stacks (implementation, applications, monotonic stack)",
      "Queues (implementation, circular queue, priority queue)",
      "Hash Tables / Hash Maps (collision handling, load factor)",
      "Hash Sets & Hash-based problem solving",
      "Binary Trees (traversals: in/pre/post/level order)",
      "Binary Search Trees (insert, delete, search, balance)",
      "AVL Trees & Red-Black Trees (concepts)",
      "Heaps / Priority Queues (min-heap, max-heap, heapify)",
      "Heap Applications (top-K, median finding, merge K lists)",
      "Tries (prefix trees, autocomplete, word search)",
      "Graphs: Adjacency List vs Matrix representation",
      "Graph Traversals (BFS, DFS iterative & recursive)",
      "Union-Find / Disjoint Set Union (DSU)",
      "Segment Trees (range queries, lazy propagation basics)",
      "Binary Indexed Trees / Fenwick Trees",
      "Bloom Filters & Skip Lists (concepts)",
      "Matrix operations & 2D array patterns",
      "Deques & Double-ended operations",
      "Bit manipulation & bitwise data structures",
    ],
    practice: "5+ medium problems daily. Implement each structure from scratch at least once.",
    milestones: [
      "150+ total problems (50 medium+)",
      "Can explain time complexity of all operations",
      "Implement any structure in <20 minutes",
    ],
    platforms: ["LeetCode", "NeetCode.io", "Visualgo.net"],
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
    goal: "Master algorithm design patterns used in 80% of interview problems.",
    topics: [
      "Sorting: Bubble, Selection, Insertion, Merge, Quick, Counting, Radix",
      "Efficient Sorting (TimSort concepts, when to use what)",
      "Binary Search Variations (rotated array, first/last position, sqrt)",
      "Two Pointers (same direction, opposite direction, fast/slow)",
      "Sliding Window (fixed size, variable size, with hash map)",
      "Prefix Sum & Difference Array",
      "Greedy Algorithms (interval scheduling, activity selection)",
      "Greedy: Jump Game, Gas Station, Huffman-like patterns",
      "Backtracking (permutations, combinations, subsets, N-Queens)",
      "Backtracking with pruning & constraint satisfaction",
      "Divide and Conquer (merge sort analysis, closest pair)",
      "Recursion patterns & tail recursion",
      "Interval Problems (merge, insert, overlap detection)",
      "Cyclic Sort pattern",
      "Top-K Pattern (heap-based, quickselect)",
      "Modified Binary Search patterns",
      "Mathematical algorithms (GCD, primes, modular arithmetic)",
      "Math: Permutations, combinations, probability basics",
      "Bit Manipulation algorithms (XOR tricks, counting bits)",
    ],
    practice: "5 medium + 1 hard problem daily. Time yourself: 20min/medium, 40min/hard.",
    milestones: [
      "250+ total problems",
      "Recognize patterns within 2 minutes",
      "Solve most mediums in <25 minutes",
    ],
    platforms: ["LeetCode", "NeetCode Roadmap", "Codeforces (Div 2A-B)"],
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
    goal: "Conquer DP — the most common hard-problem category at Google.",
    topics: [
      "DP Fundamentals (overlapping subproblems, optimal substructure)",
      "DP Identification (when to use DP vs greedy vs backtracking)",
      "1D DP (climbing stairs, house robber, fibonacci variations)",
      "1D String DP (decode ways, word break, palindrome partitioning)",
      "2D DP (unique paths, minimum path sum, edit distance)",
      "0/1 Knapsack & Variations (subset sum, partition equal subset)",
      "Unbounded Knapsack (coin change, rod cutting)",
      "Longest Common Subsequence (LCS) & variants",
      "Longest Increasing Subsequence (LIS) & patience sorting",
      "Matrix Chain Multiplication pattern",
      "DP on Trees (diameter, max path sum, house robber III)",
      "DP on Strings (regex matching, wildcard matching, interleaving)",
      "Bitmask DP (TSP, assignment problem)",
      "State Machine DP (buy/sell stock series)",
      "Digit DP basics",
      "DP Optimization (space optimization, rolling arrays)",
    ],
    practice: "3 DP problems daily (mix medium+hard). Always write recurrence before coding.",
    milestones: [
      "320+ total problems",
      "Solve DP mediums in <20 minutes",
      "Can derive recurrence relations confidently",
    ],
    platforms: ["LeetCode DP Study Plan", "AtCoder DP Contest", "CSES Problem Set"],
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
    goal: "Master graph algorithms — a Google interview staple.",
    topics: [
      "BFS Applications (shortest path unweighted, multi-source BFS)",
      "DFS Applications (connected components, cycle detection, topological sort)",
      "Topological Sort (Kahn's BFS, DFS-based)",
      "Dijkstra's Algorithm (priority queue implementation)",
      "Bellman-Ford Algorithm (negative weights, negative cycle detection)",
      "Floyd-Warshall (all pairs shortest paths)",
      "Minimum Spanning Tree (Kruskal's, Prim's)",
      "Union-Find advanced (path compression, union by rank)",
      "Network Flow basics (Ford-Fulkerson concept)",
      "Bipartite Graph checking",
      "Strongly Connected Components (Tarjan's, Kosaraju's)",
      "Articulation Points & Bridges",
      "Eulerian Path/Circuit",
      "String Algorithms: KMP Pattern Matching",
      "Rabin-Karp Rolling Hash",
      "Trie-based string algorithms",
      "Suffix Array basics",
      "Z-Algorithm",
      "Aho-Corasick basics",
      "Advanced: A* Search (concept + heuristic design)",
      "Johnson's Algorithm (concept)",
      "Manacher's Algorithm for palindromes",
    ],
    practice: "3–4 graph + string problems daily. Draw out examples before coding.",
    milestones: [
      "350+ total problems",
      "Can implement Dijkstra & BFS from memory",
      "Comfortable with graph modeling for real-world problems",
    ],
    platforms: ["LeetCode Graph Tag", "CSES Graph Problems", "CP-Algorithms.com"],
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
    goal: "Build strong system design fundamentals for Google's design rounds.",
    topics: [
      "Scalability Concepts (vertical vs horizontal scaling)",
      "Latency vs Throughput trade-offs",
      "CAP Theorem & consistency models",
      "Load Balancing (round-robin, least connections, consistent hashing)",
      "Caching Strategies (CDN, Redis, cache invalidation, write policies)",
      "Database Design (SQL vs NoSQL, indexing, sharding, replication)",
      "Database Sharding strategies & consistent hashing",
      "Message Queues (Kafka, RabbitMQ concepts, pub/sub)",
      "Microservices vs Monolith trade-offs",
      "API Design (REST, GraphQL, gRPC)",
      "Rate Limiting & Throttling",
      "Design: URL Shortener (like TinyURL)",
      "Design: Twitter / News Feed",
      "Design: Web Crawler",
      "Design: Chat System (WhatsApp-like)",
      "Design: Video Streaming (YouTube-like)",
      "Design: Distributed File Storage (Google Drive-like)",
      "Design: Rate Limiter",
    ],
    practice: "1 full system design per day. Present designs out loud to practice communication.",
    milestones: [
      "20+ system designs completed",
      "Can structure a 45-minute design discussion",
      "Comfortable with trade-off discussions",
    ],
    platforms: ["ByteByteGo", "SystemDesign.one", "Exponent"],
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
    goal: "Prepare specifically for Google's interview process and culture.",
    topics: [
      "Google Interview Process (phone screen, onsite, team match)",
      "Google Levels (L3-L5) & what's expected at each level",
      "Googleyness & Leadership: what Google looks for",
      "STAR Method for behavioral answers",
      "Common behavioral questions & prepared stories",
      "Technical Communication (thinking out loud, structured approach)",
      "Code Quality (clean code, naming, edge cases in interviews)",
      "Google's coding style preferences",
      "How to handle hints and collaborate with interviewer",
      "Time management during interviews",
      "Handling unknown problems (breaking down, partial solutions)",
      "Whiteboarding best practices",
      "Resume optimization for Google",
    ],
    practice: "Mock interviews 3x/week. Record yourself solving problems.",
    milestones: [
      "15+ mock interviews completed",
      "5 prepared STAR stories ready",
      "Confident in structured problem-solving approach",
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
    goal: "Final review and intense mock interview practice.",
    topics: [
      "Blind 75 Complete Review",
      "NeetCode 150 Complete Review",
      "Google Tagged Problems (recent 6 months)",
      "Timed Practice: 2 problems in 45 minutes",
      "System Design Mock Interviews",
      "Behavioral Mock Interviews",
      "Full Interview Simulation (4-5 rounds back to back)",
      "Weak Area Review: DP + Graphs focus",
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

/* ─── Mind Map SVG Rendering ─────────────────────────────── */

function MindMapEdge({
  edge,
  nodes,
  index,
}: {
  edge: RoadmapMindMapEdge;
  nodes: RoadmapMindMapNode[];
  index: number;
}) {
  const source = nodes.find((n) => n.id === edge.source);
  const target = nodes.find((n) => n.id === edge.target);
  if (!source || !target) return null;

  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2;
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;

  // Perpendicular offset for curve
  const curvature = edge.type === "phase-dependency" ? 0.15 : 0.1;
  const offsetX = (-dy / len) * len * curvature;
  const offsetY = (dx / len) * len * curvature;

  const isDependency = edge.type === "phase-dependency";
  const isCluster = edge.type === "phase-cluster";

  const color = isDependency
    ? "rgba(255,255,255,0.08)"
    : isCluster
    ? source.strokeColor || "rgba(255,255,255,0.1)"
    : source.strokeColor || "rgba(59,130,246,0.3)";

  return (
    <motion.path
      d={`M ${source.x} ${source.y} Q ${midX + offsetX} ${midY + offsetY}, ${target.x} ${target.y}`}
      fill="none"
      stroke={color}
      strokeWidth={isDependency ? 1 : isCluster ? 1.2 : 1.8}
      strokeDasharray={isDependency ? "6 4" : "none"}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 + index * 0.03, ease: "easeOut" }}
    />
  );
}

function MindMapNodeSVG({
  node,
  index,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onLeave,
}: {
  node: RoadmapMindMapNode;
  index: number;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  const isHub = node.type === "hub";
  const isPhase = node.type === "phase";

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: isHub ? 0.1 : 0.4 + index * 0.05,
      }}
      style={{ cursor: isPhase ? "pointer" : "default", transformOrigin: `${node.x}px ${node.y}px` }}
      onClick={isPhase ? onSelect : undefined}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Glow effect on hover/select */}
      {(isHovered || isSelected) && (
        <motion.circle
          cx={node.x}
          cy={node.y}
          r={node.radius + (isHub ? 14 : 10)}
          fill="none"
          stroke={node.color}
          strokeWidth={2}
          opacity={0.25}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.25 }}
        />
      )}

      {/* Hub pulsing glow */}
      {isHub && (
        <motion.circle
          cx={node.x}
          cy={node.y}
          r={node.radius + 20}
          fill="none"
          stroke="rgba(59,130,246,0.15)"
          strokeWidth={1.5}
          animate={{ r: [node.radius + 16, node.radius + 24, node.radius + 16] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Node circle */}
      <circle
        cx={node.x}
        cy={node.y}
        r={node.radius}
        fill={node.bgFill}
        stroke={isSelected ? node.color : node.strokeColor}
        strokeWidth={isSelected ? 2.5 : isHub ? 2 : 1.5}
      />

      {/* Hub text */}
      {isHub && (
        <>
          <text
            x={node.x}
            y={node.y - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#3b82f6"
            fontSize={11}
            fontWeight={700}
            fontFamily="var(--font-display), system-ui"
          >
            Google SDE
          </text>
          <text
            x={node.x}
            y={node.y + 10}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(59,130,246,0.6)"
            fontSize={9}
            fontFamily="var(--font-body), system-ui"
          >
            Preparation
          </text>
        </>
      )}

      {/* Phase icon + label */}
      {isPhase && (
        <>
          <text
            x={node.x}
            y={node.y - 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={node.color}
            fontSize={14}
            fontWeight={800}
            fontFamily="var(--font-mono), monospace"
          >
            {node.icon}
          </text>
          <text
            x={node.x}
            y={node.y + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize={7}
            fontFamily="var(--font-mono), monospace"
          >
            Phase
          </text>
        </>
      )}

      {/* Cluster label */}
      {node.type === "cluster" && (
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={node.color}
          fontSize={7}
          fontWeight={600}
          fontFamily="var(--font-body), system-ui"
        >
          {node.label.length > 16 ? node.label.slice(0, 14) + "…" : node.label}
        </text>
      )}
    </motion.g>
  );
}

function MindMapTooltip({
  node,
  phase,
  containerRef,
  svgWidth,
  svgHeight,
  scale,
  pan,
}: {
  node: RoadmapMindMapNode;
  phase: Phase | undefined;
  containerRef: React.RefObject<HTMLDivElement | null>;
  svgWidth: number;
  svgHeight: number;
  scale: number;
  pan: { x: number; y: number };
}) {
  if (!phase) return null;

  const container = containerRef.current;
  if (!container) return null;

  const rect = container.getBoundingClientRect();
  const svgDisplayW = rect.width;
  const svgDisplayH = rect.height;

  // Map SVG coordinates to screen coordinates
  const scaleX = svgDisplayW / svgWidth;
  const scaleY = svgDisplayH / svgHeight;
  const baseScale = Math.min(scaleX, scaleY);

  const screenX = node.x * baseScale * scale + pan.x;
  const screenY = node.y * baseScale * scale + pan.y;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.15 }}
      className="absolute pointer-events-none z-50"
      style={{
        left: screenX,
        top: screenY - node.radius * baseScale * scale - 12,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="glass-card rounded-xl px-4 py-3 border border-white/10 max-w-[240px] shadow-2xl">
        <p className="font-display font-bold text-sm text-white">{phase.title}</p>
        <p className="font-mono text-[10px] text-white/40 mt-0.5">{phase.duration}</p>
        <p className="font-body text-xs text-white/50 mt-1.5">{phase.goal}</p>
        <p className="font-mono text-[10px] text-white/25 mt-2">{phase.topics.length} topics • Click to view</p>
      </div>
    </motion.div>
  );
}

/* ─── Mind Map Container ─────────────────────────────────── */

function RoadmapMindMap({
  selectedPhaseId,
  onSelectPhase,
}: {
  selectedPhaseId: number | null;
  onSelectPhase: (id: number) => void;
}) {
  const mapData = useMemo(() => buildRoadmapMindMap(8), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("g[style*='pointer']")) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const zoomIn = () => setScale((s) => Math.min(s + 0.15, 2));
  const zoomOut = () => setScale((s) => Math.max(s - 0.15, 0.3));
  const resetView = () => { setScale(1); setPan({ x: 0, y: 0 }); };

  const hoveredPhaseNode = hoveredNode
    ? mapData.nodes.find((n) => n.id === hoveredNode && n.type === "phase")
    : null;
  const hoveredPhase = hoveredPhaseNode?.phaseId
    ? phases.find((p) => p.id === hoveredPhaseNode.phaseId)
    : undefined;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
          Interactive Mind Map
        </p>
        <div className="flex items-center gap-1.5">
          <button onClick={zoomOut} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:border-white/20 transition-all text-sm font-bold">−</button>
          <button onClick={resetView} className="px-2 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white/60 hover:border-white/20 transition-all font-mono text-[10px]">{Math.round(scale * 100)}%</button>
          <button onClick={zoomIn} className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/70 hover:border-white/20 transition-all text-sm font-bold">+</button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl bg-black/20 border border-white/5"
        style={{ height: "min(70vh, 600px)", cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox={`0 0 ${mapData.width} ${mapData.height}`}
          className="w-full h-full"
          style={{
            transform: `scale(${scale}) translate(${pan.x / scale}px, ${pan.y / scale}px)`,
            transformOrigin: "center center",
          }}
        >
          {/* Edges */}
          {mapData.edges.map((edge, i) => (
            <MindMapEdge key={`${edge.source}-${edge.target}`} edge={edge} nodes={mapData.nodes} index={i} />
          ))}

          {/* Nodes */}
          {mapData.nodes.map((node, i) => (
            <MindMapNodeSVG
              key={node.id}
              node={node}
              index={i}
              isSelected={node.phaseId === selectedPhaseId}
              isHovered={hoveredNode === node.id}
              onSelect={() => node.phaseId && onSelectPhase(node.phaseId)}
              onHover={() => setHoveredNode(node.id)}
              onLeave={() => setHoveredNode(null)}
            />
          ))}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredPhaseNode && hoveredPhase && (
            <MindMapTooltip
              key={hoveredPhaseNode.id}
              node={hoveredPhaseNode}
              phase={hoveredPhase}
              containerRef={containerRef}
              svgWidth={mapData.width}
              svgHeight={mapData.height}
              scale={scale}
              pan={pan}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4">
        {phases.map((p) => {
          const colors = PHASE_COLORS[p.id];
          return (
            <button
              key={p.id}
              onClick={() => onSelectPhase(p.id)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all text-left",
                selectedPhaseId === p.id
                  ? "bg-white/10 border border-white/15"
                  : "hover:bg-white/5"
              )}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.color }} />
              <span className="font-mono text-[10px] text-white/40">{p.title.length > 18 ? p.title.slice(0, 16) + "…" : p.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Phase Detail Panel ─────────────────────────────────── */

function PhaseDetailPanel({ phase }: { phase: Phase }) {
  const clusters = PHASE_CLUSTERS[phase.id] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn("glass-card rounded-2xl p-6 border", phase.borderColor)}
    >
      <div className="flex items-center gap-4 mb-5">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center font-mono text-sm font-bold border",
            `bg-gradient-to-br ${phase.gradient} ${phase.color} ${phase.borderColor}`
          )}
        >
          {phase.icon}
        </div>
        <div>
          <h3 className={cn("font-display font-bold text-lg", phase.color)}>
            {phase.title}
          </h3>
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-wider">
            {phase.duration}
          </p>
        </div>
      </div>

      <p className="font-body text-sm text-white/50 mb-5">{phase.goal}</p>

      {/* Topic Clusters */}
      <div className="mb-5">
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">
          Topics ({phase.topics.length})
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {clusters.map((cluster) => (
            <div key={cluster} className="glass-card rounded-xl p-3 border border-white/5">
              <p className={cn("font-mono text-[10px] uppercase tracking-wider mb-2", phase.color)}>
                {cluster}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {phase.topics
                  .filter((_, ti) => {
                    const perCluster = Math.ceil(phase.topics.length / clusters.length);
                    const clusterIdx = clusters.indexOf(cluster);
                    return ti >= clusterIdx * perCluster && ti < (clusterIdx + 1) * perCluster;
                  })
                  .map((topic) => (
                    <span
                      key={topic}
                      className={cn(
                        "px-2 py-0.5 rounded-md font-mono text-[10px] border",
                        phase.borderColor,
                        `bg-gradient-to-r ${phase.gradient}`
                      )}
                    >
                      <span className={cn("opacity-80", phase.color)}>{topic}</span>
                    </span>
                  ))}
              </div>
            </div>
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
    </motion.div>
  );
}

/* ─── main component ──────────────────────────────────────── */

export function FAANGRoadmapClient() {
  const { user, loading } = useAuth();
  const [selectedPhaseId, setSelectedPhaseId] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const handleSelectPhase = useCallback((id: number) => {
    setSelectedPhaseId((prev) => (prev === id ? null : id));
    // Scroll to detail after a tick
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }, []);

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

  const selectedPhase = selectedPhaseId ? phases.find((p) => p.id === selectedPhaseId) : null;
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

      {/* ── Mind Map ─────────────────────────────────── */}
      <FadeIn delay={0.15}>
        <RoadmapMindMap
          selectedPhaseId={selectedPhaseId}
          onSelectPhase={handleSelectPhase}
        />
      </FadeIn>

      {/* ── Phase Detail Panel ───────────────────────── */}
      <div ref={detailRef}>
        <AnimatePresence mode="wait">
          {selectedPhase && (
            <PhaseDetailPanel key={selectedPhase.id} phase={selectedPhase} />
          )}
        </AnimatePresence>
      </div>

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
