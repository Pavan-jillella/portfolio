"use client";
import { LifeIndexDashboard } from "@/components/dashboard/LifeIndexDashboard";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { BlogPost } from "@/types";

export default function LifeIndexPage() {
  const [posts] = useSupabaseRealtimeSync<BlogPost>("pj-blog-posts", "blog_posts", []);
  const publishedCount = posts.filter((p) => p.published).length;

  return (
    <section className="min-h-screen py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="font-mono text-xs text-white/30 tracking-widest uppercase mb-2">
            Unified Metrics
          </p>
          <h1 className="font-display text-3xl font-bold text-white">Life Index</h1>
          <p className="font-body text-sm text-white/40 mt-2">
            A single composite score across finance, learning, coding, and personal growth.
          </p>
        </div>
        <LifeIndexDashboard blogCount={publishedCount} />
      </div>
    </section>
  );
}
