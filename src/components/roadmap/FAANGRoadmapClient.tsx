"use client";

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSupabaseStorage } from "@/hooks/useSupabaseStorage";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";
import { isOwner } from "@/lib/roles";
import {
  ROADMAP_PHASES,
  WEEKLY_PLAN,
  TARGETS,
  DAILY_COMMITMENT,
  RESOURCES,
  DEFAULT_ROADMAP_PROGRESS,
  getPhaseProgress,
  isTopicCompleted,
  toggleTopicProgress,
  migrateProgress,
  type RoadmapPhase,
} from "@/lib/roadmap-data";
import {
  buildRoadmapMindMap,
  PHASE_COLORS,
  PHASE_CLUSTERS,
  type RoadmapMindMapNode,
  type RoadmapMindMapEdge,
} from "@/lib/roadmap-mindmap-utils";
import { DailyStudyTracker } from "./DailyStudyTracker";
import type { RoadmapProgress, UploadedFile } from "@/types";

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
  progressPct,
  onSelect,
  onHover,
  onLeave,
}: {
  node: RoadmapMindMapNode;
  index: number;
  isSelected: boolean;
  isHovered: boolean;
  progressPct?: number;
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

      {/* Progress arc for phase nodes */}
      {isPhase && progressPct !== undefined && progressPct > 0 && (
        <circle
          cx={node.x}
          cy={node.y}
          r={node.radius + 4}
          fill="none"
          stroke={node.color}
          strokeWidth={3}
          strokeDasharray={`${(progressPct / 100) * 2 * Math.PI * (node.radius + 4)} ${2 * Math.PI * (node.radius + 4)}`}
          strokeDashoffset={0}
          transform={`rotate(-90, ${node.x}, ${node.y})`}
          opacity={0.6}
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
          <text x={node.x} y={node.y - 8} textAnchor="middle" dominantBaseline="middle" fill="#3b82f6" fontSize={11} fontWeight={700} fontFamily="var(--font-display), system-ui">Google SDE</text>
          <text x={node.x} y={node.y + 10} textAnchor="middle" dominantBaseline="middle" fill="rgba(59,130,246,0.6)" fontSize={9} fontFamily="var(--font-body), system-ui">Preparation</text>
        </>
      )}

      {/* Phase icon + label */}
      {isPhase && (
        <>
          <text x={node.x} y={node.y - 6} textAnchor="middle" dominantBaseline="middle" fill={node.color} fontSize={14} fontWeight={800} fontFamily="var(--font-mono), monospace">{node.icon}</text>
          <text x={node.x} y={node.y + 12} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.5)" fontSize={7} fontFamily="var(--font-mono), monospace">Phase</text>
        </>
      )}

      {/* Cluster label */}
      {node.type === "cluster" && (
        <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="middle" fill={node.color} fontSize={7} fontWeight={600} fontFamily="var(--font-body), system-ui">
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
  phase: RoadmapPhase | undefined;
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
  const scaleX = rect.width / svgWidth;
  const scaleY = rect.height / svgHeight;
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
      style={{ left: screenX, top: screenY - node.radius * baseScale * scale - 12, transform: "translate(-50%, -100%)" }}
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
  progress,
}: {
  selectedPhaseId: number | null;
  onSelectPhase: (id: number) => void;
  progress: RoadmapProgress;
}) {
  const mapData = useMemo(() => buildRoadmapMindMap(8), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const phaseProgressMap = useMemo(() => {
    const map: Record<number, number> = {};
    ROADMAP_PHASES.forEach((p) => { map[p.id] = getPhaseProgress(progress, p.id); });
    return map;
  }, [progress]);

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

  const hoveredPhaseNode = hoveredNode ? mapData.nodes.find((n) => n.id === hoveredNode && n.type === "phase") : null;
  const hoveredPhase = hoveredPhaseNode?.phaseId ? ROADMAP_PHASES.find((p) => p.id === hoveredPhaseNode.phaseId) : undefined;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Interactive Mind Map</p>
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
          style={{ transform: `scale(${scale}) translate(${pan.x / scale}px, ${pan.y / scale}px)`, transformOrigin: "center center" }}
        >
          {mapData.edges.map((edge, i) => (
            <MindMapEdge key={`${edge.source}-${edge.target}`} edge={edge} nodes={mapData.nodes} index={i} />
          ))}
          {mapData.nodes.map((node, i) => (
            <MindMapNodeSVG
              key={node.id}
              node={node}
              index={i}
              isSelected={node.phaseId === selectedPhaseId}
              isHovered={hoveredNode === node.id}
              progressPct={node.phaseId ? phaseProgressMap[node.phaseId] : undefined}
              onSelect={() => node.phaseId && onSelectPhase(node.phaseId)}
              onHover={() => setHoveredNode(node.id)}
              onLeave={() => setHoveredNode(null)}
            />
          ))}
        </svg>

        <AnimatePresence>
          {hoveredPhaseNode && hoveredPhase && (
            <MindMapTooltip key={hoveredPhaseNode.id} node={hoveredPhaseNode} phase={hoveredPhase} containerRef={containerRef} svgWidth={mapData.width} svgHeight={mapData.height} scale={scale} pan={pan} />
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4">
        {ROADMAP_PHASES.map((p) => {
          const colors = PHASE_COLORS[p.id];
          return (
            <button
              key={p.id}
              onClick={() => onSelectPhase(p.id)}
              className={cn("flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all text-left", selectedPhaseId === p.id ? "bg-white/10 border border-white/15" : "hover:bg-white/5")}
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

/* ─── Phase Detail Panel (with checkboxes) ───────────────── */

function PhaseDetailPanel({
  phase,
  progress,
  onToggleTopic,
}: {
  phase: RoadmapPhase;
  progress: RoadmapProgress;
  onToggleTopic: (phaseId: number, topicId: string) => void;
}) {
  const clusters = PHASE_CLUSTERS[phase.id] || [];
  const completedCount = phase.topics.filter((t) => isTopicCompleted(progress, phase.id, t.id)).length;
  const phasePct = getPhaseProgress(progress, phase.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn("glass-card rounded-2xl p-6 border", phase.borderColor)}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-mono text-sm font-bold border", `bg-gradient-to-br ${phase.gradient} ${phase.color} ${phase.borderColor}`)}>
          {phase.icon}
        </div>
        <div className="flex-1">
          <h3 className={cn("font-display font-bold text-lg", phase.color)}>{phase.title}</h3>
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-wider">{phase.duration}</p>
        </div>
        <div className="text-right">
          <span className={cn("font-mono text-sm font-bold", phase.color)}>{completedCount}/{phase.topics.length}</span>
          <p className="font-mono text-[10px] text-white/25">{phasePct}%</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-5">
        <motion.div animate={{ width: `${phasePct}%` }} transition={{ duration: 0.6 }} className={cn("h-full rounded-full", phase.bgColor + "/50")} />
      </div>

      <p className="font-body text-sm text-white/50 mb-5">{phase.goal}</p>

      {/* Topic Clusters with Checkboxes */}
      <div className="mb-5">
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-3">Topics ({phase.topics.length})</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {clusters.map((cluster, clusterIdx) => {
            const perCluster = Math.ceil(phase.topics.length / clusters.length);
            const clusterTopics = phase.topics.slice(clusterIdx * perCluster, (clusterIdx + 1) * perCluster);
            return (
              <div key={cluster} className="glass-card rounded-xl p-3 border border-white/5">
                <p className={cn("font-mono text-[10px] uppercase tracking-wider mb-2", phase.color)}>{cluster}</p>
                <div className="space-y-1">
                  {clusterTopics.map((topic) => {
                    const done = isTopicCompleted(progress, phase.id, topic.id);
                    return (
                      <label key={topic.id} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors cursor-pointer group", done ? "bg-white/[0.03]" : "hover:bg-white/[0.02]")}>
                        <div className="relative flex-shrink-0">
                          <input type="checkbox" checked={done} onChange={() => onToggleTopic(phase.id, topic.id)} className="sr-only" />
                          <div className={cn("w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all", done ? `${phase.bgColor}/30 ${phase.borderColor}` : "border-white/10 group-hover:border-white/20")}>
                            {done && (
                              <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className={cn("w-2.5 h-2.5", phase.color)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </motion.svg>
                            )}
                          </div>
                        </div>
                        <span className={cn("font-body text-xs transition-colors", done ? "text-white/40 line-through" : "text-white/70")}>{topic.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Practice */}
      <div className="mb-4">
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">Practice</p>
        <p className="font-body text-sm text-white/60">{phase.practice}</p>
      </div>

      {/* Platforms */}
      {phase.platforms && (
        <div className="mb-4">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">Platforms</p>
          <div className="flex flex-wrap gap-2">
            {phase.platforms.map((p) => (
              <span key={p} className="px-2.5 py-1 rounded-lg font-mono text-xs bg-white/5 text-white/50 border border-white/10">{p}</span>
            ))}
          </div>
        </div>
      )}

      {/* Milestones */}
      <div>
        <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-2">Milestones</p>
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
  const [progress, setProgress] = useLocalStorage<RoadmapProgress>("pj-faang-roadmap", DEFAULT_ROADMAP_PROGRESS);
  const [solutionFiles, setSolutionFiles] = useLocalStorage<UploadedFile[]>("pj-roadmap-solutions", []);
  const { upload: uploadFile } = useSupabaseStorage();
  const [selectedPhaseId, setSelectedPhaseId] = useState<number | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // Migrate stored progress to match current ROADMAP_PHASES (handles old data)
  useEffect(() => {
    const migrated = migrateProgress(progress);
    const needsMigration = ROADMAP_PHASES.some((phase) => {
      const stored = progress.phases.find((p) => p.phaseId === phase.id);
      return !stored || stored.topicProgress.length !== phase.topics.length;
    });
    if (needsMigration) {
      setProgress(migrated);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectPhase = useCallback((id: number) => {
    setSelectedPhaseId((prev) => (prev === id ? null : id));
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }, []);

  const handleToggleTopic = useCallback((phaseId: number, topicId: string) => {
    setProgress((prev) => toggleTopicProgress(prev, phaseId, topicId));
  }, [setProgress]);

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

  const selectedPhase = selectedPhaseId ? ROADMAP_PHASES.find((p) => p.id === selectedPhaseId) : null;
  const totalHours = DAILY_COMMITMENT.reduce((sum, d) => sum + d.hours, 0);

  return (
    <div className="space-y-12">
      {/* ── Deadline Banner ─────────────────────────── */}
      <FadeIn>
        <div className="glass-card rounded-2xl p-6 border border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-violet-500/5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-1">Mission</p>
              <h2 className="font-display font-bold text-xl text-white">Beginner → Google SDE</h2>
              <p className="font-body text-sm text-white/40 mt-1">Transform through consistent learning and daily practice.</p>
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

      {/* ── Daily Study Tracker ─────────────────────── */}
      <FadeIn delay={0.03}>
        <DailyStudyTracker
          progress={progress}
          onUpdateProgress={setProgress}
          files={solutionFiles}
          onUploadFile={(file) => uploadFile(file, `roadmap-solutions/${Date.now()}-${file.name}`)}
          onFileAdded={(file) => setSolutionFiles((prev) => [...prev, { ...file, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, created_at: new Date().toISOString() }])}
          compact
        />
      </FadeIn>

      {/* ── Progress Overview ───────────────────────── */}
      <FadeIn delay={0.05}>
        <div className="glass-card rounded-2xl p-6">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-5">Progress Overview</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {ROADMAP_PHASES.map((p) => (
              <ProgressBar key={p.id} label={p.title} value={getPhaseProgress(progress, p.id)} color={p.color} />
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Targets Grid ────────────────────────────── */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TARGETS.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="glass-card rounded-xl p-4 text-center border border-white/5 hover:border-blue-500/20 transition-colors"
            >
              <p className="font-display font-bold text-2xl text-white">{t.target}</p>
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mt-1">{t.label}</p>
            </motion.div>
          ))}
        </div>
      </FadeIn>

      {/* ── Mind Map ─────────────────────────────────── */}
      <FadeIn delay={0.15}>
        <RoadmapMindMap selectedPhaseId={selectedPhaseId} onSelectPhase={handleSelectPhase} progress={progress} />
      </FadeIn>

      {/* ── Phase Detail Panel ───────────────────────── */}
      <div ref={detailRef}>
        <AnimatePresence mode="wait">
          {selectedPhase && (
            <PhaseDetailPanel key={selectedPhase.id} phase={selectedPhase} progress={progress} onToggleTopic={handleToggleTopic} />
          )}
        </AnimatePresence>
      </div>

      {/* ── Weekly Study Plan ───────────────────────── */}
      <FadeIn delay={0.2}>
        <div className="glass-card rounded-2xl p-6">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-5">Weekly Study Plan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {WEEKLY_PLAN.map((w, i) => (
              <motion.div key={w.day} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.04 }} className="glass-card rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors text-center">
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-wider mb-2">{w.day}</p>
                <span className={cn("inline-block px-2 py-1 rounded-lg font-mono text-[11px]", w.color)}>{w.focus}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── Daily Commitment ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FadeIn delay={0.25}>
          <div className="glass-card rounded-2xl p-6 h-full">
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-5">Daily Study Commitment</p>
            <div className="space-y-3">
              {DAILY_COMMITMENT.map((d) => (
                <div key={d.activity} className="flex items-center justify-between">
                  <span className="font-body text-sm text-white/60">{d.activity}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${(d.hours / totalHours) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} className="h-full rounded-full bg-blue-500/40" />
                    </div>
                    <span className="font-mono text-xs text-blue-400 w-10 text-right">{d.hours}h</span>
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
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-5">Learning Resources</p>
            <div className="space-y-3">
              {RESOURCES.map((r) => (
                <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group px-3 py-2 -mx-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div>
                    <p className="font-body text-sm text-white/70 group-hover:text-white transition-colors">{r.name}</p>
                    <p className="font-mono text-[10px] text-white/30 uppercase tracking-wider">{r.category}</p>
                  </div>
                  <svg className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <p className="font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-4">Final Goal — By November 17</p>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {["Python mastery for interviews", "400+ coding problems solved", "3 portfolio projects deployed", "20+ system designs mastered", "25+ mock interviews completed", "Google interview-ready"].map((goal, i) => (
              <motion.div key={goal} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
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
