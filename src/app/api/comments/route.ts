import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "@/lib/rate-limit";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("blog_slug", slug)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json([]);
  }

  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed } = rateLimit(ip, 10, 60000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
    }

    const body = await req.json();
    const { blog_slug, author_name, content } = body;

    if (!blog_slug || !author_name || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (content.length > 2000 || author_name.length > 100) {
      return NextResponse.json({ error: "Content too long" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Comments unavailable" }, { status: 503 });
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({ blog_slug, author_name, content })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
