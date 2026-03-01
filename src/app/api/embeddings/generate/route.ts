import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "@/lib/rate-limit";
import * as Sentry from "@sentry/nextjs";

// Daily embedding cap to prevent OpenAI cost spikes
const DAILY_EMBEDDING_LIMIT = 100;
let dailyCount = 0;
let dailyResetAt = Date.now() + 86400000; // 24 hours from now

function checkDailyLimit(): boolean {
  if (Date.now() > dailyResetAt) {
    dailyCount = 0;
    dailyResetAt = Date.now() + 86400000;
  }
  if (dailyCount >= DAILY_EMBEDDING_LIMIT) return false;
  dailyCount++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed } = rateLimit(ip, 10, 60000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    if (!checkDailyLimit()) {
      return NextResponse.json({ error: "Daily embedding limit reached (100/day)" }, { status: 429 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!apiKey || !supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Service not configured" }, { status: 503 });
    }

    const { entityType, entityId, content, tags } = await req.json();
    if (!entityType || !entityId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate embedding
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: content.slice(0, 8000),
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Upsert into embeddings table
    const { error } = await supabase
      .from("embeddings")
      .upsert(
        {
          entity_type: entityType,
          entity_id: entityId,
          content_summary: content.slice(0, 500),
          embedding,
          tags: tags || [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: "entity_type,entity_id" }
      );

    if (error) {
      Sentry.captureException(error);
      return NextResponse.json({ error: "Failed to store embedding" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Embedding generation failed" }, { status: 500 });
  }
}
