import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const { path, referrer } = await req.json();

    const supabase = getAdminClient();
    if (!supabase) return NextResponse.json({ success: true });

    await supabase
      .from("page_views")
      .insert({ path, referrer: referrer || null });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}

export async function GET() {
  const supabase = getAdminClient();
  if (!supabase) {
    return NextResponse.json({ views: [], total: 0 });
  }

  try {
    const { data, count } = await supabase
      .from("page_views")
      .select("*", { count: "exact" })
      .order("visited_at", { ascending: false })
      .limit(100);

    return NextResponse.json({ views: data || [], total: count || 0 });
  } catch {
    return NextResponse.json({ views: [], total: 0 });
  }
}
