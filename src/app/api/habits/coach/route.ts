import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import OpenAI from "openai";

async function getAuthUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI API key not configured" }, { status: 503 });
  }

  let body: { habits: unknown[]; logs: unknown[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : undefined,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a personal habit coach. Analyze the user's habit tracking data and provide actionable insights. Focus on:
1. Patterns in completion (which days, which habits are most/least consistent)
2. Streak analysis and motivation
3. Specific recommendations to improve consistency
4. Category balance (health vs learning vs productivity vs personal)
5. Suggested schedule optimizations

Be concise, direct, and encouraging. Use bullet points and short paragraphs. Avoid generic advice — be specific to their data.`,
        },
        {
          role: "user",
          content: `Here is my habit tracking data:\n\nHabits:\n${JSON.stringify(body.habits, null, 2)}\n\nRecent logs (last 500):\n${JSON.stringify(body.logs, null, 2)}\n\nPlease analyze my patterns and give me specific, actionable recommendations.`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const analysis = response.choices[0]?.message?.content || "No analysis generated.";
    return NextResponse.json({ analysis });
  } catch (e) {
    return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 });
  }
}
