import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  if (token !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getAdminSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const results: Record<string, { exists: boolean; count?: number; columns?: string[]; id_type?: string; error?: string; test_upsert?: string }> = {};

  for (const table of PAYROLL_TABLES) {
    try {
      // Check if table exists and get row count
      const { data, error, count } = await supabase
        .from(table)
        .select("*", { count: "exact", head: false })
        .limit(1);

      if (error) {
        results[table] = { exists: false, error: error.message };
        continue;
      }

      const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

      // Try a test upsert with a dummy row then delete it
      const testId = `__diag_test_${Date.now()}`;
      const { error: upsertErr } = await supabase
        .from(table)
        .upsert([{ id: testId }], { onConflict: "id" });

      let testResult = "ok";
      if (upsertErr) {
        testResult = upsertErr.message;
      } else {
        // Clean up test row
        await supabase.from(table).delete().eq("id", testId);
      }

      results[table] = {
        exists: true,
        count: count ?? 0,
        columns,
        test_upsert: testResult,
      };
    } catch (err) {
      results[table] = { exists: false, error: String(err) };
    }
  }

  return NextResponse.json({ tables: results });
}
