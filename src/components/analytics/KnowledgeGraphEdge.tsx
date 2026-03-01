"use client";

interface KnowledgeGraphEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  weight: number;
}

export function KnowledgeGraphEdge({ x1, y1, x2, y2, weight }: KnowledgeGraphEdgeProps) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="currentColor"
      strokeWidth={Math.max(0.5, weight * 2)}
      opacity={Math.min(0.3, weight * 0.4)}
    />
  );
}
