"use client";
import { useMemo, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Course, Note, UploadedFile } from "@/types";
import { buildMindMapData, MindMapNode } from "@/lib/mindmap-utils";

interface MindMapTabProps {
  courses: Course[];
  notes: Note[];
  files: UploadedFile[];
  onNavigateToCourse: (courseId: string) => void;
  onNavigateToNote: (noteId: string) => void;
}

const TYPE_LABELS: Record<string, string> = {
  course: "Course",
  note: "Note",
  tag: "Tag",
  file: "File",
};

export function MindMapTab({ courses, notes, files, onNavigateToCourse, onNavigateToNote }: MindMapTabProps) {
  const [hoveredNode, setHoveredNode] = useState<MindMapNode | null>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => buildMindMapData(courses, notes, files), [courses, notes, files]);

  const handleNodeClick = useCallback((node: MindMapNode) => {
    if (node.type === "course" && node.metadata?.courseId) {
      onNavigateToCourse(node.metadata.courseId);
    } else if (node.type === "note" && node.metadata?.noteId) {
      onNavigateToNote(node.metadata.noteId);
    }
  }, [onNavigateToCourse, onNavigateToNote]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-node]")) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: panStart.current.panX + (e.clientX - panStart.current.x),
      y: panStart.current.panY + (e.clientY - panStart.current.y),
    });
  }, [isPanning]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  if (courses.length === 0 && notes.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <svg className="w-12 h-12 text-white/10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
        </svg>
        <p className="font-body text-sm text-white/20">Add courses and notes to see your learning mind map.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl text-white">Mind Map</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.min(2, s + 0.2))}
            className="glass-card px-3 py-1.5 rounded-lg text-xs font-mono text-white/40 hover:text-white/70 transition-all"
          >
            +
          </button>
          <span className="font-mono text-[10px] text-white/20">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((s) => Math.max(0.3, s - 0.2))}
            className="glass-card px-3 py-1.5 rounded-lg text-xs font-mono text-white/40 hover:text-white/70 transition-all"
          >
            -
          </button>
          <button
            onClick={() => { setScale(1); setPan({ x: 0, y: 0 }); }}
            className="glass-card px-3 py-1.5 rounded-lg text-[10px] font-body text-white/40 hover:text-white/70 transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="glass-card rounded-2xl overflow-hidden relative"
        style={{ height: "600px", cursor: isPanning ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${data.width} ${data.height}`}
          style={{
            transform: `scale(${scale}) translate(${pan.x / scale}px, ${pan.y / scale}px)`,
            transformOrigin: "center center",
          }}
        >
          {/* Edges */}
          {data.edges.map((edge, i) => {
            const source = data.nodes.find((n) => n.id === edge.source);
            const target = data.nodes.find((n) => n.id === edge.target);
            if (!source || !target) return null;

            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;
            const offsetX = (target.y - source.y) * 0.15;
            const offsetY = (source.x - target.x) * 0.15;

            return (
              <motion.path
                key={`edge-${i}`}
                d={`M ${source.x} ${source.y} Q ${midX + offsetX} ${midY + offsetY}, ${target.x} ${target.y}`}
                fill="none"
                stroke={
                  edge.type === "course-note" ? "rgba(139,92,246,0.15)" :
                  edge.type === "course-file" ? "rgba(6,182,212,0.12)" :
                  edge.type === "course-tag" ? "rgba(245,158,11,0.1)" :
                  "rgba(255,255,255,0.06)"
                }
                strokeWidth={1.5}
                strokeDasharray={edge.type === "course-tag" ? "4 3" : undefined}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.02 }}
              />
            );
          })}

          {/* Nodes */}
          {data.nodes.map((node, i) => {
            const isHovered = hoveredNode?.id === node.id;
            const isClickable = node.type === "course" || node.type === "note";

            return (
              <motion.g
                key={node.id}
                data-node="true"
                style={{ cursor: isClickable ? "pointer" : "default" }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 + i * 0.02, type: "spring", stiffness: 200 }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => handleNodeClick(node)}
              >
                {/* Glow effect on hover */}
                {isHovered && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius + 8}
                    fill="none"
                    stroke={node.color}
                    strokeWidth={1}
                    opacity={0.3}
                  />
                )}

                {/* Node circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill={node.bgFill}
                  stroke={node.strokeColor}
                  strokeWidth={isHovered ? 2 : 1}
                />

                {/* Progress arc for courses */}
                {node.type === "course" && node.metadata?.progress !== undefined && node.metadata.progress > 0 && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius - 3}
                    fill="none"
                    stroke={node.color}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * (node.radius - 3)}`}
                    strokeDashoffset={`${2 * Math.PI * (node.radius - 3) * (1 - node.metadata.progress / 100)}`}
                    transform={`rotate(-90 ${node.x} ${node.y})`}
                    opacity={0.6}
                  />
                )}

                {/* Type icon */}
                {node.type === "note" && (
                  <text x={node.x} y={node.y - 6} textAnchor="middle" fontSize={12} fill={node.color} opacity={0.7}>
                    {"📝"}
                  </text>
                )}
                {node.type === "file" && (
                  <text x={node.x} y={node.y - 3} textAnchor="middle" fontSize={10} fill={node.color} opacity={0.7}>
                    {"📄"}
                  </text>
                )}

                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + (node.type === "note" ? 10 : node.type === "file" ? 10 : 4)}
                  textAnchor="middle"
                  fill={isHovered ? "#fff" : node.color}
                  fontSize={node.type === "course" ? 10 : node.type === "tag" ? 8 : 9}
                  fontFamily="var(--font-body), system-ui"
                  fontWeight={node.type === "course" ? 600 : 400}
                >
                  {node.label}
                </text>

                {/* Status/platform subtitle for courses */}
                {node.type === "course" && (
                  <text
                    x={node.x}
                    y={node.y + 16}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.25)"
                    fontSize={8}
                    fontFamily="var(--font-mono), monospace"
                  >
                    {node.metadata?.platform} · {node.metadata?.progress}%
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredNode && (
          <div
            className="absolute pointer-events-none z-10 glass-card rounded-xl px-3 py-2 border border-white/10"
            style={{
              left: Math.min(
                (hoveredNode.x * scale + pan.x + (containerRef.current?.getBoundingClientRect().left || 0)) - (containerRef.current?.getBoundingClientRect().left || 0),
                (containerRef.current?.clientWidth || 400) - 180
              ),
              top: Math.max(8, hoveredNode.y * scale + pan.y - hoveredNode.radius * scale - 60),
              maxWidth: 200,
            }}
          >
            <span className="font-mono text-[9px] text-white/30 uppercase">{TYPE_LABELS[hoveredNode.type]}</span>
            <p className="font-body text-xs text-white/70 mt-0.5">{hoveredNode.label}</p>
            {hoveredNode.metadata?.status && (
              <p className="font-mono text-[9px] text-white/30 mt-1">
                {hoveredNode.metadata.status} · {hoveredNode.metadata.category}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 flex-wrap">
        {[
          { label: "Course (Completed)", color: "#10b981" },
          { label: "Course (In Progress)", color: "#3b82f6" },
          { label: "Course (Planned)", color: "#6b7280" },
          { label: "Note", color: "#8b5cf6" },
          { label: "Tag", color: "#f59e0b" },
          { label: "File", color: "#06b6d4" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, opacity: 0.7 }} />
            <span className="font-body text-[10px] text-white/30">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
