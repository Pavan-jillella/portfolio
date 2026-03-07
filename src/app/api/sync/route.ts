import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const ALLOWED_TABLES = new Set([
  "transactions",
  "budgets",
  "savings_goals",
  "investments",
  "subscriptions",
  "user_subscriptions",
  "net_worth_entries",
  "study_sessions",
  "edu_notes",
  "courses",
  "edu_projects",
  "pay_stubs",
  "part_time_jobs",
  "part_time_hours",
  "employers",
  "work_schedules",
  "enhanced_work_schedules",
  "vlogs",
  "blog_posts",
  "user_projects",
  "habits",
  "habit_logs",
  "habit_chains",
]);

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
      setAll() {
        // Read-only in this context
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

/**
 * POST /api/sync — Authenticated write proxy.
 * Accepts upserts and deletes for allowed tables.
 * Injects user_id from session into all records.
 * Uses service role key (bypasses RLS).
 */
export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  let body: { table: string; upsert?: unknown[]; delete?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { table, upsert, delete: toDelete } = body;

  if (!table || !ALLOWED_TABLES.has(table)) {
    return NextResponse.json({ error: "Invalid table" }, { status: 400 });
  }

  const errors: string[] = [];

  if (upsert && Array.isArray(upsert) && upsert.length > 0) {
    // Inject user_id into all records
    let dataWithUserId: Record<string, unknown>[] = (upsert as Record<string, unknown>[]).map((record) => ({
      ...record,
      user_id: userId,
    }));

    // Strip fields that may not exist in DB yet (pending migration)
    if (table === "investments") {
      dataWithUserId = dataWithUserId.map(({ exchange: _e, market: _m, ...rest }) => rest);
    }
    if (table === "subscriptions") {
      dataWithUserId = dataWithUserId.map(({ website: _w, logo_url: _l, card_last4: _c, notes: _n, service_id: _s, ...rest }) => rest);
    }
    if (table === "user_subscriptions") {
      // Strip enriched fields (service/plan objects) that come from client-side JOINs
      dataWithUserId = dataWithUserId.map(({ service: _svc, plan: _plan, ...rest }) => rest);
    }

    const { error } = await supabase.from(table).upsert(dataWithUserId, { onConflict: "id" });
    if (error) {
      // Skip "relation does not exist" errors — table migration may not have run yet
      if (error.code === "42P01" || (error.message?.includes("relation") && error.message?.includes("does not exist"))) {
        console.warn(`[sync] Table "${table}" does not exist yet — skipping`);
      } else {
        errors.push(`upsert: ${error.message}`);
      }
    }
  }

  if (toDelete && Array.isArray(toDelete) && toDelete.length > 0) {
    // Only delete records belonging to this user
    const { error } = await supabase
      .from(table)
      .delete()
      .in("id", toDelete)
      .eq("user_id", userId);
    if (error) {
      if (error.code === "42P01" || (error.message?.includes("relation") && error.message?.includes("does not exist"))) {
        console.warn(`[sync] Table "${table}" does not exist yet — skipping delete`);
      } else {
        errors.push(`delete: ${error.message}`);
      }
    }
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
