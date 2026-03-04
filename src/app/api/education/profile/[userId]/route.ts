import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * GET /api/education/profile/[userId]
 * Public endpoint - returns aggregated learning stats for a user.
 * Does not expose private content (note bodies, session details).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  if (!userId || !UUID_REGEX.test(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  // Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { allowed } = rateLimit(`profile:${ip}`, 30, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  // Fetch user display info
  const { data: authData } = await supabase.auth.admin.getUserById(userId);
  if (!authData?.user) {
    // Intentionally vague to prevent user ID enumeration
    return NextResponse.json({ error: "Profile not available" }, { status: 404 });
  }

  const user = authData.user;
  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    "Learner";
  const avatarUrl = user.user_metadata?.avatar_url || null;

  // Fetch education data in parallel
  const [sessionsRes, coursesRes, projectsRes, notesRes] = await Promise.all([
    supabase
      .from("study_sessions")
      .select("subject, duration_minutes, date")
      .eq("user_id", userId)
      .order("date", { ascending: false }),
    supabase
      .from("courses")
      .select("name, category, platform, status, progress")
      .eq("user_id", userId),
    supabase
      .from("edu_projects")
      .select("name, status, tech_stack")
      .eq("user_id", userId),
    supabase
      .from("edu_notes")
      .select("id")
      .eq("user_id", userId),
  ]);

  const sessions = sessionsRes.data || [];
  const courses = coursesRes.data || [];
  const projects = projectsRes.data || [];
  const notes = notesRes.data || [];

  // Aggregate stats
  const totalMinutes = sessions.reduce((sum: number, s: { duration_minutes: number }) => sum + s.duration_minutes, 0);
  const subjectMap = new Map<string, number>();
  for (const s of sessions) {
    subjectMap.set(s.subject, (subjectMap.get(s.subject) || 0) + s.duration_minutes);
  }
  const subjects = Array.from(subjectMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, minutes]) => ({ name, hours: parseFloat((minutes / 60).toFixed(1)) }));

  // Calculate streak
  let streak = 0;
  if (sessions.length > 0) {
    const dates = Array.from(new Set(sessions.map((s: { date: string }) => s.date))).sort().reverse();
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (dates[0] === today || dates[0] === yesterday) {
      streak = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1] as string);
        const curr = new Date(dates[i] as string);
        const diff = (prev.getTime() - curr.getTime()) / 86400000;
        if (diff === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  const profile = {
    displayName,
    avatarUrl,
    stats: {
      totalStudyHours: parseFloat((totalMinutes / 60).toFixed(1)),
      totalSessions: sessions.length,
      streak,
      coursesTotal: courses.length,
      coursesCompleted: courses.filter((c: { status: string }) => c.status === "completed").length,
      coursesInProgress: courses.filter((c: { status: string }) => c.status === "in-progress").length,
      projectsTotal: projects.length,
      projectsCompleted: projects.filter((p: { status: string }) => p.status === "completed").length,
      notesCount: notes.length,
    },
    subjects,
    courses: courses.map((c: { name: string; category: string; platform: string; status: string; progress: number }) => ({
      name: c.name,
      category: c.category,
      platform: c.platform,
      status: c.status,
      progress: c.progress,
    })),
    projects: projects.map((p: { name: string; status: string; tech_stack: string[] }) => ({
      name: p.name,
      status: p.status,
      techStack: p.tech_stack || [],
    })),
  };

  return NextResponse.json(profile, {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
