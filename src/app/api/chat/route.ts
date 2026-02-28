import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getAllPosts } from "@/lib/mdx";
import { rateLimit } from "@/lib/rate-limit";
import * as Sentry from "@sentry/nextjs";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed } = rateLimit(ip, 5, 60000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Chat not available" }, { status: 503 });
    }

    const { messages, context } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });

    // Build context from blog posts
    const posts = getAllPosts();
    const blogContext = posts
      .map((p) => `Title: ${p.title}\nCategory: ${p.category}\nDescription: ${p.description}`)
      .join("\n\n");

    const systemPrompt = `You are Pavan Jillella's personal AI assistant on his portfolio website. You help visitors learn about his work in education, finance, and technology.

You have knowledge of his blog posts:
${blogContext}
${context ? `\nYou also have access to his personal dashboard data:\n${context}` : ""}

Be concise, helpful, and professional. If asked about something you don't know, say so honestly. Keep responses under 200 words.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages.slice(-10)],
      max_tokens: 500,
      temperature: 0.7,
    });

    return NextResponse.json({
      message: completion.choices[0].message,
    });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Chat unavailable" }, { status: 500 });
  }
}
