import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as Sentry from "@sentry/nextjs";

interface EmbeddingRow {
  id: string;
  entity_type: string;
  entity_id: string;
  content_summary: string;
  tags: string[];
  embedding: number[];
}

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

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function sharedTagCount(a: string[], b: string[]): number {
  const setB = new Set(b);
  return a.filter((t) => setB.has(t)).length;
}

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Service not configured" }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: embeddings, error } = await supabase
      .from("embeddings")
      .select("id, entity_type, entity_id, content_summary, tags, embedding")
      .limit(200);

    if (error) {
      Sentry.captureException(error);
      return NextResponse.json({ error: "Failed to fetch graph data" }, { status: 500 });
    }

    const rows = (embeddings || []) as EmbeddingRow[];

    const nodes: GraphNode[] = rows.map((r) => ({
      id: r.id,
      entityType: r.entity_type,
      entityId: r.entity_id,
      label: r.content_summary.slice(0, 60),
      tags: r.tags || [],
    }));

    const edges: GraphEdge[] = [];
    const edgeSet = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      for (let j = i + 1; j < rows.length; j++) {
        const key = `${rows[i].id}-${rows[j].id}`;
        if (edgeSet.has(key)) continue;

        // Check shared tags
        const shared = sharedTagCount(rows[i].tags || [], rows[j].tags || []);
        if (shared >= 2) {
          edges.push({ source: rows[i].id, target: rows[j].id, weight: shared / 5, reason: "tags" });
          edgeSet.add(key);
          continue;
        }

        // Check cosine similarity (only if embeddings are present)
        if (rows[i].embedding && rows[j].embedding) {
          const sim = cosineSimilarity(rows[i].embedding, rows[j].embedding);
          if (sim > 0.8) {
            edges.push({ source: rows[i].id, target: rows[j].id, weight: sim, reason: "similarity" });
            edgeSet.add(key);
          }
        }
      }
    }

    return NextResponse.json(
      { nodes, edges },
      { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200" } }
    );
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Failed to build graph" }, { status: 500 });
  }
}
