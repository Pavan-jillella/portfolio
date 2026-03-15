import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const TABLES_TO_CLEAR = [
  "transactions", "budgets", "savings_goals", "investments", "subscriptions",
  "user_subscriptions", "net_worth_entries", "study_sessions", "edu_notes",
  "courses", "edu_projects", "pay_stubs", "part_time_jobs", "part_time_hours",
  "employers", "work_schedules", "enhanced_work_schedules", "vlogs",
  "blog_posts", "user_projects", "habits", "habit_logs", "habit_chains",
];

export async function DELETE() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey || !serviceKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  // Get the current user from the session
  const cookieStore = await cookies();
  const supabaseAuth = createServerClient(url, anonKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  });

  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use service role to delete all user data across tables
  const admin = createClient(url, serviceKey);

  for (const table of TABLES_TO_CLEAR) {
    await admin.from(table).delete().eq("user_id", user.id);
  }

  // Delete the auth user
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteError) {
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
