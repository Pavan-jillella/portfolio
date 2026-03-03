import { NextResponse } from "next/server";

export async function GET() {
  // Blog posts are now per-user in Supabase — search data is fetched client-side
  return NextResponse.json(
    { posts: [] },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
  );
}
