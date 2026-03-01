import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ALLOWED_TABLES = new Set([
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
]);

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * POST /api/sync — Authenticated write proxy.
 * Accepts upserts and deletes for allowed tables.
 * Uses service role key (bypasses RLS) so anon key never needs write access.
 */
export async function POST(req: NextRequest) {
  // Verify auth cookie
  const token = req.cookies.get("auth-token")?.value;
  if (token !== "authenticated") {
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
    const { error } = await supabase.from(table).upsert(upsert, { onConflict: "id" });
    if (error) errors.push(`upsert: ${error.message}`);
  }

  if (toDelete && Array.isArray(toDelete) && toDelete.length > 0) {
    const { error } = await supabase.from(table).delete().in("id", toDelete);
    if (error) errors.push(`delete: ${error.message}`);
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
