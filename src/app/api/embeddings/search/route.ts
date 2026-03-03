import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/supabase/server";
import * as Sentry from "@sentry/nextjs";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const threshold = parseFloat(searchParams.get("threshold") || "0.7");

    if (!query) {
      return NextResponse.json({ error: "Query parameter required" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!apiKey || !supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Service not configured" }, { status: 503 });
    }

    const openai = new OpenAI({ apiKey });
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate query embedding
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Search using cosine similarity via RPC
    const { data, error } = await supabase.rpc("match_embeddings", {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
    });

    if (error) {
      Sentry.captureException(error);
      return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }

    return NextResponse.json({ results: data || [] });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
