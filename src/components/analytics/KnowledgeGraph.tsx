"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useKnowledgeGraph } from "@/hooks/queries/useKnowledgeGraph";
import { KnowledgeGraphNode } from "./KnowledgeGraphNode";
import { KnowledgeGraphEdge } from "./KnowledgeGraphEdge";

interface NodePosition {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  entityType: string;
  entityId: string;
  label: string;
  tags: string[];
}

const ENTITY_TYPES = [
  { type: "course", color: "#06b6d4", label: "Courses" },
  { type: "note", color: "#a855f7", label: "Notes" },
  { type: "project", color: "#10b981", label: "Projects" },
  { type: "blog", color: "#3b82f6", label: "Blogs" },
];

export function KnowledgeGraph() {
  const { data, isLoading, error } = useKnowledgeGraph();
  const [positions, setPositions] = useState<NodePosition[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set());
  const animRef = useRef<number>(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const WIDTH = 800;
  const HEIGHT = 500;

  // Filter nodes and edges by visible types
  const filteredNodeIds = useMemo(() => {
    if (!data?.nodes) return new Set<string>();
    return new Set(
      data.nodes.filter((n) => !hiddenTypes.has(n.entityType)).map((n) => n.id)
    );
  }, [data, hiddenTypes]);

  const filteredEdges = useMemo(() => {
    if (!data?.edges) return [];
    return data.edges.filter(
      (e) => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
    );
  }, [data, filteredNodeIds]);

  function toggleType(type: string) {
    setHiddenTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }

  function handleNodeClick(entityType: string, entityId: string) {
    const routes: Record<string, string> = {
      course: "/education/dashboard",
      note: "/education/dashboard",
      project: "/education/dashboard",
      blog: "/blog",
    };
    const route = routes[entityType] || "/education/dashboard";
    window.location.href = route;
  }

  // Initialize positions randomly
  useEffect(() => {
    if (!data?.nodes?.length) return;

    const initial = data.nodes.map((node) => ({
      id: node.id,
      x: WIDTH / 4 + Math.random() * WIDTH / 2,
      y: HEIGHT / 4 + Math.random() * HEIGHT / 2,
      vx: 0,
      vy: 0,
      entityType: node.entityType,
      entityId: node.entityId,
      label: node.label,
      tags: node.tags,
    }));
    setPositions(initial);
  }, [data]);

  // Force-directed simulation
  const simulate = useCallback(() => {
    if (!data?.edges || positions.length === 0) return;

    setPositions((prev) => {
      const next = prev.map((n) => ({ ...n }));
      const posMap = new Map(next.map((n) => [n.id, n]));

      // Repulsion between all nodes
      for (let i = 0; i < next.length; i++) {
        for (let j = i + 1; j < next.length; j++) {
          const dx = next[j].x - next[i].x;
          const dy = next[j].y - next[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 500 / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          next[i].vx -= fx;
          next[i].vy -= fy;
          next[j].vx += fx;
          next[j].vy += fy;
        }
      }

      // Attraction along edges
      for (const edge of data.edges) {
        const source = posMap.get(edge.source);
        const target = posMap.get(edge.target);
        if (!source || !target) continue;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - 80) * 0.01 * edge.weight;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        source.vx += fx;
        source.vy += fy;
        target.vx -= fx;
        target.vy -= fy;
      }

      // Center gravity
      for (const node of next) {
        node.vx += (WIDTH / 2 - node.x) * 0.001;
        node.vy += (HEIGHT / 2 - node.y) * 0.001;
      }

      // Apply velocity with damping
      for (const node of next) {
        node.vx *= 0.9;
        node.vy *= 0.9;
        node.x += node.vx;
        node.y += node.vy;
        // Clamp
        node.x = Math.max(20, Math.min(WIDTH - 20, node.x));
        node.y = Math.max(20, Math.min(HEIGHT - 20, node.y));
      }

      return next;
    });

    animRef.current = requestAnimationFrame(simulate);
  }, [data, positions.length]);

  useEffect(() => {
    if (positions.length > 0) {
      animRef.current = requestAnimationFrame(simulate);
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [positions.length, simulate]);

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="h-[500px] flex items-center justify-center">
          <p className="font-mono text-xs text-white/20">Loading knowledge graph...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.nodes?.length) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="font-body text-sm text-white/30">No knowledge graph data yet</p>
            <p className="font-mono text-[10px] text-white/15 mt-1">
              Add notes, courses, or projects to build your graph
            </p>
          </div>
        </div>
      </div>
    );
  }

  const posMap = new Map(positions.map((p) => [p.id, p]));
  const visiblePositions = positions.filter((p) => filteredNodeIds.has(p.id));

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-sm text-white">Knowledge Graph</h3>
          <p className="font-mono text-[10px] text-white/20 mt-0.5">
            {visiblePositions.length} nodes, {filteredEdges.length} connections
          </p>
        </div>
        <div className="flex gap-3">
          {ENTITY_TYPES.map((item) => {
            const isHidden = hiddenTypes.has(item.type);
            return (
              <button
                key={item.type}
                onClick={() => toggleType(item.type)}
                className={`flex items-center gap-1.5 transition-opacity ${isHidden ? "opacity-30" : "opacity-100"}`}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-mono text-[9px] text-white/30">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        style={{ maxHeight: "500px" }}
      >
        {/* Edges */}
        {filteredEdges.map((edge, i) => {
          const source = posMap.get(edge.source);
          const target = posMap.get(edge.target);
          if (!source || !target) return null;
          return (
            <KnowledgeGraphEdge
              key={i}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              weight={edge.weight}
            />
          );
        })}

        {/* Nodes */}
        {visiblePositions.map((node) => (
          <KnowledgeGraphNode
            key={node.id}
            x={node.x}
            y={node.y}
            label={node.label}
            entityType={node.entityType}
            isHovered={hoveredNode === node.id}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick(node.entityType, node.entityId)}
          />
        ))}
      </svg>
    </div>
  );
}
