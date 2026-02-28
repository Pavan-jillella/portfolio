import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/mdx";

export async function GET() {
  try {
    const posts = getAllPosts();
    const simplified = posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      category: p.category,
      tags: p.tags || [],
    }));
    return NextResponse.json(
      { posts: simplified },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
    );
  } catch {
    return NextResponse.json({ posts: [] });
  }
}
