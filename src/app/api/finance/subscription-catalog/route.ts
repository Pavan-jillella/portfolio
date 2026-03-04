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

  if (servicesRes.error) {
    return NextResponse.json({ error: servicesRes.error.message }, { status: 500 });
  }
  if (plansRes.error) {
    return NextResponse.json({ error: plansRes.error.message }, { status: 500 });
  }

  return NextResponse.json({
    services: servicesRes.data,
    plans: plansRes.data,
  });
}
