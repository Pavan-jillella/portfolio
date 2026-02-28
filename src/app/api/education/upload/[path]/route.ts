import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  const { path } = await params;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const supabase = createClient(url, key);
  const { error } = await supabase.storage
    .from("education-files")
    .remove([decodeURIComponent(path)]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
