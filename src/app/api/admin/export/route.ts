import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const EXPORT_TABLES = [
  "transactions",
  "budgets",
  "savings_goals",
  "investments",
  "subscriptions",
  "net_worth_entries",
  "study_sessions",
  "edu_notes",
  "courses",
  "edu_projects",
  "employers",
  "pay_stubs",
  "part_time_jobs",
  "part_time_hours",
  "work_schedules",
  "enhanced_work_schedules",
];

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function getCurrentUserId(): Promise<string | null> {
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

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user.id;
}

/**
 * GET /api/admin/export — User data snapshot.
 * Returns all table data for the authenticated user as JSON.
 */
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const snapshot: Record<string, unknown[]> = {};
  const errors: string[] = [];

  for (const table of EXPORT_TABLES) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq("user_id", userId);
      if (error) {
        errors.push(`${table}: ${error.message}`);
        snapshot[table] = [];
      } else {
        snapshot[table] = data || [];
      }
    } catch {
      errors.push(`${table}: fetch failed`);
      snapshot[table] = [];
    }
  }

  const exportData = {
    version: 1,
    exported_at: new Date().toISOString(),
    tables: snapshot,
    errors: errors.length > 0 ? errors : undefined,
    stats: Object.fromEntries(
      Object.entries(snapshot).map(([name, rows]) => [name, rows.length])
    ),
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="portfolio-backup-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
