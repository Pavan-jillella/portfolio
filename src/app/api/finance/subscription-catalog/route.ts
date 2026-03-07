import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const [servicesRes, plansRes] = await Promise.all([
    supabase.from("subscription_services").select("*").order("name"),
    supabase.from("subscription_plans").select("*").order("price"),
  ]);

  // Return empty arrays if tables don't exist yet
  return NextResponse.json({
    services: servicesRes.data ?? [],
    plans: plansRes.data ?? [],
  });
}
