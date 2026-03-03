import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const PAYROLL_TABLES = [
  "pay_stubs",
  "part_time_jobs",
  "part_time_hours",
  "employers",
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

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const results: Record<string, { exists: boolean; count?: number; columns?: string[]; error?: string }> = {};

  for (const table of PAYROLL_TABLES) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select("*", { count: "exact", head: false })
        .eq("user_id", userId)
        .limit(1);

      if (error) {
        results[table] = { exists: false, error: error.message };
        continue;
      }

      const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

      results[table] = {
        exists: true,
        count: count ?? 0,
        columns,
      };
    } catch (err) {
      results[table] = { exists: false, error: String(err) };
    }
  }

  return NextResponse.json({ tables: results });
}
