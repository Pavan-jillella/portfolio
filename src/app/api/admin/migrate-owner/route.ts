import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const DATA_TABLES = [
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
  "pay_stubs",
  "part_time_jobs",
  "part_time_hours",
  "employers",
  "work_schedules",
  "enhanced_work_schedules",
];

const OWNER_EMAIL = "pavankalyan171199@gmail.com";

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  // Get current user from session
  const cookieStore = await cookies();
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.email !== OWNER_EMAIL) {
    return NextResponse.json(
      { error: "Only the owner can run this migration", your_email: user.email },
      { status: 403 }
    );
  }

  const adminSupabase = createClient(url, serviceKey);

  const results: Record<string, { updated: number; error?: string }> = {};

  for (const table of DATA_TABLES) {
    try {
      const { data, error } = await adminSupabase
        .from(table)
        .update({ user_id: user.id })
        .is("user_id", null)
        .select("id");

      results[table] = {
        updated: data?.length ?? 0,
        error: error?.message,
      };
    } catch (e) {
      results[table] = { updated: 0, error: String(e) };
    }
  }

  return NextResponse.json({
    success: true,
    owner_id: user.id,
    owner_email: user.email,
    results,
  });
}
