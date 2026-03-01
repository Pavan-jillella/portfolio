import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
  "schedules",
  "shifts",
  "paystubs",
];

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

/**
 * GET /api/admin/export — Full data snapshot.
 * Returns all table data as JSON for backup purposes.
 */
export async function GET(req: NextRequest) {
  // Verify auth cookie
  const token = req.cookies.get("auth-token")?.value;
  if (token !== "authenticated") {
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
      const { data, error } = await supabase.from(table).select("*");
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

  // Also export localStorage keys present on the client
  // (those are sent separately by the client if needed)

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
