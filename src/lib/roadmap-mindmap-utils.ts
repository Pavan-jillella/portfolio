/* ─── Roadmap Mind Map Layout Utilities ─────────────────────────── */

export interface RoadmapMindMapNode {
  id: string;
  type: "hub" | "phase" | "cluster";
  label: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  bgFill: string;
  strokeColor: string;
  phaseId?: number;
  icon?: string;
  subtitle?: string;
}

export interface RoadmapMindMapEdge {
  source: string;
  target: string;
  type: "hub-phase" | "phase-cluster" | "phase-dependency";
}

export interface RoadmapMindMapData {
  nodes: RoadmapMindMapNode[];
  edges: RoadmapMindMapEdge[];
  width: number;
  height: number;
}

/* ─── Phase Colors ─────────────────────────────────────────────── */

export const PHASE_COLORS: Record<
  number,
  { color: string; bgFill: string; strokeColor: string; tailwind: string }
> = {
  1: { color: "#10b981", bgFill: "rgba(16,185,129,0.12)", strokeColor: "rgba(16,185,129,0.4)", tailwind: "emerald" },
  2: { color: "#3b82f6", bgFill: "rgba(59,130,246,0.12)", strokeColor: "rgba(59,130,246,0.4)", tailwind: "blue" },
  3: { color: "#8b5cf6", bgFill: "rgba(139,92,246,0.12)", strokeColor: "rgba(139,92,246,0.4)", tailwind: "violet" },
  4: { color: "#d946ef", bgFill: "rgba(217,70,239,0.12)", strokeColor: "rgba(217,70,239,0.4)", tailwind: "fuchsia" },
  5: { color: "#f97316", bgFill: "rgba(249,115,22,0.12)", strokeColor: "rgba(249,115,22,0.4)", tailwind: "orange" },
  6: { color: "#f59e0b", bgFill: "rgba(245,158,11,0.12)", strokeColor: "rgba(245,158,11,0.4)", tailwind: "amber" },
  7: { color: "#f43f5e", bgFill: "rgba(244,63,94,0.12)", strokeColor: "rgba(244,63,94,0.4)", tailwind: "rose" },
  8: { color: "#06b6d4", bgFill: "rgba(6,182,212,0.12)", strokeColor: "rgba(6,182,212,0.4)", tailwind: "cyan" },
};

/* ─── Topic Clusters (3-4 per phase) ───────────────────────────── */

export const PHASE_CLUSTERS: Record<number, string[]> = {
  1: ["Core Python", "Data Types & Collections", "Functions & OOP", "Algorithms & Practice"],
  2: ["Arrays & Strings", "Trees & Graphs", "Linked Lists & Stacks", "Advanced Structures"],
  3: ["Sorting & Searching", "Two Pointers & Sliding Window", "Backtracking & Recursion", "Math & Greedy"],
  4: ["1D DP Patterns", "2D DP & Knapsack", "String & Tree DP", "Optimization Techniques"],
  5: ["BFS & DFS", "Shortest Paths", "Advanced Graph Algorithms", "String Algorithms"],
  6: ["Scalability Basics", "Storage & Databases", "Distributed Systems", "Design Practice"],
  7: ["Google Process", "Behavioral Prep", "Culture & Communication"],
  8: ["Problem Grinding", "Mock Interviews", "Final Review"],
};

/* ─── Phase Dependencies (sequential + cross-cutting) ──────────── */

export const PHASE_DEPENDENCIES: [number, number][] = [
  [1, 2], // Python → DS
  [2, 3], // DS → Algorithms
  [3, 4], // Algorithms → DP
  [3, 5], // Algorithms → Graphs
  [2, 6], // DS → System Design
  [4, 8], // DP → Final Sprint
  [5, 8], // Graphs → Final Sprint
  [6, 7], // System Design → Google-Specific
  [7, 8], // Google-Specific → Final Sprint
];

/* ─── Layout Builder ───────────────────────────────────────────── */

const CX = 500;
const CY = 420;
const PHASE_RADIUS = 280;
const CLUSTER_RADIUS = 120;

export function buildRoadmapMindMap(phaseCount: number = 8): RoadmapMindMapData {
  const nodes: RoadmapMindMapNode[] = [];
  const edges: RoadmapMindMapEdge[] = [];

  // Hub node
  nodes.push({
    id: "hub",
    type: "hub",
    label: "Google SDE\nPreparation",
    x: CX,
    y: CY,
    radius: 52,
    color: "#3b82f6",
    bgFill: "rgba(59,130,246,0.15)",
    strokeColor: "rgba(59,130,246,0.5)",
  });

  // Phase nodes in a circle
  for (let i = 0; i < phaseCount; i++) {
    const angle = (2 * Math.PI * i) / phaseCount - Math.PI / 2; // start from top
    const x = CX + PHASE_RADIUS * Math.cos(angle);
    const y = CY + PHASE_RADIUS * Math.sin(angle);
    const phaseId = i + 1;
    const colors = PHASE_COLORS[phaseId];

    nodes.push({
      id: `phase-${phaseId}`,
      type: "phase",
      label: `Phase ${phaseId}`,
      x,
      y,
      radius: 36,
      color: colors.color,
      bgFill: colors.bgFill,
      strokeColor: colors.strokeColor,
      phaseId,
      icon: String(phaseId).padStart(2, "0"),
    });

    // Hub → Phase edge
    edges.push({
      source: "hub",
      target: `phase-${phaseId}`,
      type: "hub-phase",
    });

    // Cluster nodes branching from phase
    const clusters = PHASE_CLUSTERS[phaseId] || [];
    const clusterSpread = Math.PI * 0.6; // 108° spread for clusters
    const startAngle = angle - clusterSpread / 2;

    clusters.forEach((cluster, ci) => {
      const clusterAngle = clusters.length === 1
        ? angle
        : startAngle + (clusterSpread * ci) / (clusters.length - 1);
      const cx = x + CLUSTER_RADIUS * Math.cos(clusterAngle);
      const cy = y + CLUSTER_RADIUS * Math.sin(clusterAngle);

      const clusterId = `cluster-${phaseId}-${ci}`;
      nodes.push({
        id: clusterId,
        type: "cluster",
        label: cluster,
        x: cx,
        y: cy,
        radius: 22,
        color: colors.color,
        bgFill: colors.bgFill.replace("0.12", "0.06"),
        strokeColor: colors.strokeColor.replace("0.4", "0.2"),
        phaseId,
      });

      edges.push({
        source: `phase-${phaseId}`,
        target: clusterId,
        type: "phase-cluster",
      });
    });
  }

  // Dependency edges between phases
  PHASE_DEPENDENCIES.forEach(([from, to]) => {
    edges.push({
      source: `phase-${from}`,
      target: `phase-${to}`,
      type: "phase-dependency",
    });
  });

  // Compute bounding box
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.x - n.radius - 60);
    minY = Math.min(minY, n.y - n.radius - 60);
    maxX = Math.max(maxX, n.x + n.radius + 60);
    maxY = Math.max(maxY, n.y + n.radius + 60);
  }

  const padding = 80;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  // Offset all nodes so min coordinate is at padding
  const offsetX = -minX + padding;
  const offsetY = -minY + padding;
  for (const n of nodes) {
    n.x += offsetX;
    n.y += offsetY;
  }

  return { nodes, edges, width, height };
}
