import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Public endpoint to fetch all published blog posts (no auth required)
export async function GET() {
  try {
    const supabase = createServiceClient();
    
    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
      return NextResponse.json({ posts: [] });
    }

    return NextResponse.json(
      { posts: posts || [] },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (error) {
    console.error("Blog API error:", error);
    return NextResponse.json({ posts: [] });
  }
}
