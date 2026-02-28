"use client";
import { useQuery } from "@tanstack/react-query";

interface GraphNode {
  id: string;
  entityType: string;
  entityId: string;
  label: string;
  tags: string[];
}

interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  reason: "tags" | "similarity";
}

interface KnowledgeGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

async function fetchKnowledgeGraph(): Promise<KnowledgeGraphData> {
  const res = await fetch("/api/knowledge-graph");
  if (!res.ok) throw new Error("Failed to fetch knowledge graph");
  return res.json();
}

export function useKnowledgeGraph() {
  return useQuery<KnowledgeGraphData>({
    queryKey: ["knowledge-graph"],
    queryFn: fetchKnowledgeGraph,
    staleTime: 10 * 60 * 1000,
  });
}
