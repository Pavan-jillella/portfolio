import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || "";
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");
    const filter = req.nextUrl.searchParams.get("filter") || "all";

    const items: ActivityItem[] = [];

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Study sessions
      if (filter === "all" || filter === "study") {
        const { data: sessions } = await supabase
          .from("study_sessions")
          .select("id, subject, duration_minutes, date, created_at")
          .order("created_at", { ascending: false })
          .limit(50);

        sessions?.forEach((s) => {
          items.push({
            id: `study-${s.id}`,
            type: "study",
            title: `Studied ${s.subject}`,
            description: `${s.duration_minutes} minutes of focused study`,
            timestamp: s.created_at || s.date,
            metadata: { subject: s.subject, minutes: s.duration_minutes },
          });
        });
      }

      // Notes
      if (filter === "all" || filter === "note") {
        const { data: notes } = await supabase
          .from("notes")
          .select("id, title, tags, created_at, updated_at")
          .order("updated_at", { ascending: false })
          .limit(50);

        notes?.forEach((n) => {
          items.push({
            id: `note-${n.id}`,
            type: "note",
            title: `Updated note: ${n.title}`,
            description: n.tags?.length ? `Tags: ${n.tags.join(", ")}` : "Knowledge base note",
            timestamp: n.updated_at || n.created_at,
            metadata: { tags: n.tags },
          });
        });
      }

      // Courses
      if (filter === "all" || filter === "course") {
        const { data: courses } = await supabase
          .from("courses")
          .select("id, name, platform, status, progress, created_at")
          .order("created_at", { ascending: false })
          .limit(50);

        courses?.forEach((c) => {
          items.push({
            id: `course-${c.id}`,
            type: "course",
            title: `${c.status === "completed" ? "Completed" : "Started"} ${c.name}`,
            description: `${c.platform} — ${c.progress}% complete`,
            timestamp: c.created_at,
            metadata: { platform: c.platform, progress: c.progress },
          });
        });
      }

      // Projects
      if (filter === "all" || filter === "project") {
        const { data: projects } = await supabase
          .from("dashboard_projects")
          .select("id, name, description, status, created_at")
          .order("created_at", { ascending: false })
          .limit(50);

        projects?.forEach((p) => {
          items.push({
            id: `project-${p.id}`,
            type: "project",
            title: `${p.status === "completed" ? "Completed" : "Working on"} ${p.name}`,
            description: p.description || "Dashboard project",
            timestamp: p.created_at,
            metadata: { status: p.status },
          });
        });
      }
    }

    // Blog posts from Supabase
    if (filter === "all" || filter === "blog") {
      if (supabaseUrl && supabaseKey) {
        try {
          const sb = createClient(supabaseUrl, supabaseKey);
          const { data: posts } = await sb
            .from("blog_posts")
            .select("id, title, slug, description, category, created_at")
            .eq("published", true)
            .order("created_at", { ascending: false })
            .limit(50);

          posts?.forEach((p) => {
            items.push({
              id: `blog-${p.slug}`,
              type: "blog",
              title: `Published: ${p.title}`,
              description: p.description,
              timestamp: p.created_at,
              metadata: { category: p.category, slug: p.slug },
            });
          });
        } catch {
          // Blog posts unavailable
        }
      }
    }

    // GitHub commits
    if (filter === "all" || filter === "code") {
      try {
        const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
        if (process.env.GITHUB_TOKEN) {
          headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
        }
        const res = await fetch(
          "https://api.github.com/users/Pavan-jillella/events?per_page=30",
          { headers, next: { revalidate: 3600 } }
        );
        if (res.ok) {
          const events = await res.json();
          events
            .filter((e: any) => e.type === "PushEvent")
            .slice(0, 20)
            .forEach((e: any) => {
              const commitCount = e.payload?.commits?.length || 0;
              const repo = e.repo?.name?.split("/")[1] || e.repo?.name || "repo";
              items.push({
                id: `code-${e.id}`,
                type: "code",
                title: `Pushed ${commitCount} commit${commitCount !== 1 ? "s" : ""} to ${repo}`,
                description: e.payload?.commits?.[0]?.message || "Code update",
                timestamp: e.created_at,
                metadata: { repo: e.repo?.name, commits: commitCount },
              });
            });
        }
      } catch {
        // GitHub API unavailable
      }
    }

    // Sort by timestamp descending
    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Cursor-based pagination
    let startIndex = 0;
    if (cursor) {
      const cursorIndex = items.findIndex((item) => item.id === cursor);
      if (cursorIndex >= 0) {
        startIndex = cursorIndex + 1;
      }
    }

    const paged = items.slice(startIndex, startIndex + limit);
    const nextCursor = paged.length === limit ? paged[paged.length - 1].id : null;

    return NextResponse.json(
      { items: paged, nextCursor },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ items: [], nextCursor: null });
  }
}
