"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Course, CourseStatus } from "@/types";

interface CourseRoadmapProps {
  courses: Course[];
}

interface CourseNode {
  course: Course;
  x: number;
  y: number;
  column: number;
}

const STATUS_CONFIG: Record<
  CourseStatus,
  { label: string; color: string; bgFill: string; strokeColor: string; textColor: string; columnIndex: number }
> = {
  completed: {
    label: "Completed",
    color: "#10b981",
    bgFill: "rgba(16, 185, 129, 0.08)",
    strokeColor: "rgba(16, 185, 129, 0.3)",
    textColor: "#6ee7b7",
    columnIndex: 0,
  },
  "in-progress": {
    label: "In Progress",
    color: "#3b82f6",
    bgFill: "rgba(59, 130, 246, 0.08)",
    strokeColor: "rgba(59, 130, 246, 0.3)",
    textColor: "#93c5fd",
    columnIndex: 1,
  },
  planned: {
    label: "Planned",
    color: "#6b7280",
    bgFill: "rgba(107, 114, 128, 0.06)",
    strokeColor: "rgba(107, 114, 128, 0.2)",
    textColor: "#9ca3af",
    columnIndex: 2,
  },
};

const NODE_WIDTH = 200;
const NODE_HEIGHT = 72;
const COL_GAP = 260;
const ROW_GAP = 100;
const PADDING_X = 40;
const PADDING_TOP = 60;
const HEADER_GAP = 40;

export function CourseRoadmap({ courses }: CourseRoadmapProps) {
  const { nodes, edges, svgWidth, svgHeight } = useMemo(() => {
    const grouped: Record<CourseStatus, Course[]> = {
      completed: [],
      "in-progress": [],
      planned: [],
    };

    courses.forEach((c) => {
      if (grouped[c.status]) {
        grouped[c.status].push(c);
      }
    });

    const allNodes: CourseNode[] = [];
    const statuses: CourseStatus[] = ["completed", "in-progress", "planned"];

    statuses.forEach((status) => {
      const col = STATUS_CONFIG[status].columnIndex;
      grouped[status].forEach((course, rowIdx) => {
        allNodes.push({
          course,
          x: PADDING_X + col * COL_GAP,
          y: PADDING_TOP + HEADER_GAP + rowIdx * ROW_GAP,
          column: col,
        });
      });
    });

    // Build edges: connect courses in the same category across statuses
    const allEdges: { from: CourseNode; to: CourseNode }[] = [];
    for (let i = 0; i < allNodes.length; i++) {
      for (let j = i + 1; j < allNodes.length; j++) {
        if (
          allNodes[i].course.category === allNodes[j].course.category &&
          allNodes[i].column !== allNodes[j].column
        ) {
          const [from, to] =
            allNodes[i].column < allNodes[j].column
              ? [allNodes[i], allNodes[j]]
              : [allNodes[j], allNodes[i]];
          allEdges.push({ from, to });
        }
      }
    }

    const maxRows = Math.max(
      grouped.completed.length,
      grouped["in-progress"].length,
      grouped.planned.length,
      1
    );

    return {
      nodes: allNodes,
      edges: allEdges,
      svgWidth: PADDING_X * 2 + COL_GAP * 2 + NODE_WIDTH,
      svgHeight: PADDING_TOP + HEADER_GAP + maxRows * ROW_GAP + 20,
    };
  }, [courses]);

  if (courses.length === 0) {
    return (
      <motion.div
        className="glass-card rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="font-display font-semibold text-lg text-white mb-4">
          Course Roadmap
        </h3>
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-white/10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
          <p className="font-body text-sm text-white/20">
            No courses yet. Add courses to see your learning roadmap.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="font-display font-semibold text-lg text-white mb-4">
        Course Roadmap
      </h3>
      <div className="overflow-x-auto -mx-2 px-2">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="mx-auto"
        >
          {/* Column headers */}
          {(["completed", "in-progress", "planned"] as CourseStatus[]).map((status) => {
            const cfg = STATUS_CONFIG[status];
            const x = PADDING_X + cfg.columnIndex * COL_GAP + NODE_WIDTH / 2;
            return (
              <g key={status}>
                <text
                  x={x}
                  y={PADDING_TOP - 10}
                  textAnchor="middle"
                  fill={cfg.textColor}
                  fontSize={12}
                  fontFamily="var(--font-display), system-ui"
                  fontWeight={600}
                >
                  {cfg.label}
                </text>
                <line
                  x1={PADDING_X + cfg.columnIndex * COL_GAP - 10}
                  y1={PADDING_TOP + 8}
                  x2={PADDING_X + cfg.columnIndex * COL_GAP + NODE_WIDTH + 10}
                  y2={PADDING_TOP + 8}
                  stroke={cfg.strokeColor}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}

          {/* Edges */}
          {edges.map((edge, i) => {
            const x1 = edge.from.x + NODE_WIDTH;
            const y1 = edge.from.y + NODE_HEIGHT / 2;
            const x2 = edge.to.x;
            const y2 = edge.to.y + NODE_HEIGHT / 2;
            const midX = (x1 + x2) / 2;

            return (
              <motion.path
                key={`edge-${i}`}
                d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1.5}
                strokeDasharray="6 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => {
            const cfg = STATUS_CONFIG[node.course.status];
            const progress = node.course.progress;
            const isCompleted = node.course.status === "completed";
            const isInProgress = node.course.status === "in-progress";

            // Progress ring params
            const ringSize = 20;
            const ringStroke = 2.5;
            const ringRadius = (ringSize - ringStroke) / 2;
            const ringCircumference = 2 * Math.PI * ringRadius;
            const ringOffset =
              ringCircumference - (Math.min(progress, 100) / 100) * ringCircumference;

            return (
              <motion.g
                key={node.course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
              >
                {/* Node background */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  rx={12}
                  fill={cfg.bgFill}
                  stroke={cfg.strokeColor}
                  strokeWidth={1}
                />

                {/* Progress bar background */}
                <rect
                  x={node.x}
                  y={node.y + NODE_HEIGHT - 4}
                  width={NODE_WIDTH}
                  height={4}
                  rx={2}
                  fill="rgba(255,255,255,0.03)"
                />

                {/* Progress bar fill */}
                <motion.rect
                  x={node.x}
                  y={node.y + NODE_HEIGHT - 4}
                  width={NODE_WIDTH}
                  height={4}
                  rx={2}
                  fill={cfg.color}
                  initial={{ width: 0 }}
                  animate={{ width: (progress / 100) * NODE_WIDTH }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.06 }}
                  style={{ opacity: 0.6 }}
                />

                {/* Status indicator (left side) */}
                {isCompleted && (
                  <g transform={`translate(${node.x + 14}, ${node.y + NODE_HEIGHT / 2})`}>
                    <circle r={10} fill="rgba(16, 185, 129, 0.15)" />
                    <motion.path
                      d="M -4 0 L -1 3 L 4 -3"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.06 }}
                    />
                  </g>
                )}

                {isInProgress && (
                  <g transform={`translate(${node.x + 14}, ${node.y + NODE_HEIGHT / 2})`}>
                    <circle
                      r={ringRadius}
                      fill="none"
                      stroke="rgba(59, 130, 246, 0.15)"
                      strokeWidth={ringStroke}
                    />
                    <motion.circle
                      r={ringRadius}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth={ringStroke}
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      transform="rotate(-90)"
                      initial={{ strokeDashoffset: ringCircumference }}
                      animate={{ strokeDashoffset: ringOffset }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.06 }}
                    />
                  </g>
                )}

                {!isCompleted && !isInProgress && (
                  <circle
                    cx={node.x + 14}
                    cy={node.y + NODE_HEIGHT / 2}
                    r={4}
                    fill="rgba(107, 114, 128, 0.3)"
                  />
                )}

                {/* Course name */}
                <text
                  x={node.x + 30}
                  y={node.y + 26}
                  fill={cfg.textColor}
                  fontSize={11}
                  fontFamily="var(--font-display), system-ui"
                  fontWeight={600}
                >
                  {node.course.name.length > 22
                    ? node.course.name.slice(0, 22) + "..."
                    : node.course.name}
                </text>

                {/* Progress percentage */}
                <text
                  x={node.x + 30}
                  y={node.y + 42}
                  fill="rgba(255,255,255,0.3)"
                  fontSize={10}
                  fontFamily="var(--font-mono), monospace"
                >
                  {progress}% complete
                </text>

                {/* Category tag */}
                <rect
                  x={node.x + 30}
                  y={node.y + 48}
                  width={Math.min(node.course.category.length * 6 + 12, NODE_WIDTH - 40)}
                  height={16}
                  rx={8}
                  fill="rgba(255,255,255,0.04)"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={0.5}
                />
                <text
                  x={node.x + 36}
                  y={node.y + 59}
                  fill="rgba(255,255,255,0.35)"
                  fontSize={8}
                  fontFamily="var(--font-mono), monospace"
                >
                  {node.course.category}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/[0.04]">
        {(["completed", "in-progress", "planned"] as CourseStatus[]).map((status) => {
          const cfg = STATUS_CONFIG[status];
          const count = courses.filter((c) => c.status === status).length;
          return (
            <div key={status} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cfg.color, opacity: 0.7 }}
              />
              <span className="font-body text-[10px] text-white/30">
                {cfg.label} ({count})
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
