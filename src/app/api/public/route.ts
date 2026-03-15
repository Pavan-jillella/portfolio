import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 300; // cache for 5 minutes

export async function GET() {
  try {
    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json({ posts: [], projects: [] });
    }

    const [postsRes, projectsRes] = await Promise.all([
      supabase
        .from("blog_posts")
        .select("id, title, slug, description, category, read_time, tags, created_at, view_count")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("user_projects")
        .select("id, name, description, language, url, stars, forks, topics, created_at")
        .order("stars", { ascending: false })
        .limit(6),
    ]);

    return NextResponse.json(
      {
        posts: postsRes.data ?? [],
        projects: projectsRes.data ?? [],
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch {
    return NextResponse.json({ posts: [], projects: [] });
  }
}
