import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

async function getAuthUserId(): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Read-only in route handler
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user.id;
}

const SYSTEM_PROMPTS: Record<string, string> = {
  insights: `You are a learning analytics AI. Analyze the student's study data and provide insights.
Return a JSON object with this exact structure:
{
  "best_time": "description of when they study best",
  "velocity": "description of learning speed",
  "estimated_completion": "estimation for current courses",
  "tips": ["tip1", "tip2", "tip3"]
}
Be concise and data-driven. Only return valid JSON.`,

  recommendations: `You are a course recommendation AI. Based on the student's completed courses and study history, suggest 3-5 next courses.
Return a JSON array with this structure:
[{"name": "Course Name", "reason": "Why this course", "category": "Category", "difficulty": "Beginner|Intermediate|Advanced"}]
Only return valid JSON array.`,

  quiz: `You are a quiz generator AI. Generate exactly 5 multiple-choice questions based on the provided content.
Return a JSON array with this structure:
[{"question": "Q?", "options": ["A", "B", "C", "D"], "correct_index": 0, "explanation": "Why A is correct"}]
Make questions educational and varied in difficulty. Only return valid JSON array.`,

  summarize: `You are a study assistant AI. Summarize the provided notes and extract key learning points.
Return a JSON object with this structure:
{
  "summary": "2-3 sentence summary",
  "flashcards": [{"question": "Q?", "answer": "A"}],
  "key_concepts": [{"term": "Term", "definition": "Definition"}]
}
Generate 3-5 flashcards and 3-5 key concepts. Only return valid JSON.`,

  planner: `You are a learning curriculum designer AI. Create a week-by-week study plan.
Return a JSON array with this structure:
[{"week": 1, "topic": "Topic Name", "tasks": ["Task 1", "Task 2", "Task 3"]}]
Create practical, actionable weekly plans. Only return valid JSON array.`,

  mentor: `You are a personal AI learning mentor. Analyze the student's complete education data and provide personalized advice.
Consider their study patterns, completed courses, skills, and projects.
Give specific, actionable recommendations about:
1. What to study next and why
2. How to improve their learning efficiency
3. Skills gaps to address
Keep response under 300 words. Be encouraging but honest.`,
};

const MAX_TOKENS: Record<string, number> = {
  insights: 600,
  recommendations: 400,
  quiz: 800,
  summarize: 600,
  planner: 800,
  mentor: 600,
};

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit by user ID (not spoofable IP)
    const { allowed } = rateLimit(userId, 10, 60000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI features not available" }, { status: 503 });
    }

    // Safe JSON parse
    let body: { type?: string; data?: unknown; prompt?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { type, data, prompt } = body;

    if (!type || typeof type !== "string" || !SYSTEM_PROMPTS[type]) {
      return NextResponse.json({ error: "Invalid AI request type" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });

    const userMessage = prompt || (typeof data === "string" ? data : JSON.stringify(data));
    if (!userMessage) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS[type] },
        { role: "user", content: String(userMessage).slice(0, 8000) },
      ],
      max_tokens: MAX_TOKENS[type] || 600,
      temperature: type === "quiz" ? 0.8 : 0.7,
    });

    const content = completion.choices[0]?.message?.content || "";

    // For structured types, try to parse JSON
    if (type !== "mentor") {
      try {
        const jsonMatch = content.match(/[\[{][\s\S]*?[\]}](?=[^}\]]*$)/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({ result: parsed, raw: content });
        }
      } catch {
        // Fall through to return raw content
      }
    }

    return NextResponse.json({ result: content, raw: content });
  } catch (error) {
    console.error("Education AI error:", error);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
