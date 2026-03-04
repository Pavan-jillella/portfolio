import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const REQUIRED_TABLES = [
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
];

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const results: Record<string, boolean> = {};

  for (const table of REQUIRED_TABLES) {
    try {
      const { error } = await supabase.from(table).select("id").limit(0);
      results[table] = !error;
    } catch {
      results[table] = false;
    }
  }

  const allExist = Object.values(results).every(Boolean);
  const missingTables = Object.entries(results)
    .filter(([, exists]) => !exists)
    .map(([name]) => name);

  // Read migration SQL files
  let migrationSql = "";
  let rlsSql = "";
  try {
    const tablesPath = path.join(process.cwd(), "supabase/migrations/20240302_finance_education_tables.sql");
    migrationSql = fs.readFileSync(tablesPath, "utf-8");
  } catch {
    migrationSql = "-- Could not read table migration file";
  }
  try {
    const rlsPath = path.join(process.cwd(), "supabase/migrations/20240303_tighten_rls_policies.sql");
    rlsSql = fs.readFileSync(rlsPath, "utf-8");
  } catch {
    rlsSql = "-- Could not read RLS migration file";
  }

  const combinedSql = allExist
    ? rlsSql
    : migrationSql + "\n\n" + rlsSql;

  // Extract project ID from Supabase URL for dashboard link
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const projectId = supabaseUrl.replace("https://", "").split(".")[0];

  return NextResponse.json({
    tables: results,
    allExist,
    missingTables,
    migrationSql: combinedSql,
    rlsSql,
    supabaseDashboardUrl: `https://supabase.com/dashboard/project/${projectId}/sql/new`,
  });
}
