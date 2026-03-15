"use client";
import { PageHeader } from "@/components/ui/PageHeader";
import { LifeIndexDashboard } from "@/components/dashboard/LifeIndexDashboard";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { BlogPost } from "@/types";

export default function LifeIndexPage() {
  const [posts] = useSupabaseRealtimeSync<BlogPost>("pj-blog-posts", "blog_posts", []);
  const publishedCount = posts.filter((p) => p.published).length;

  return (
    <>
      <PageHeader
        compact
        label="Life Index"
        title="Life Index"
        description="A single composite score across finance, learning, coding, and personal growth."
      />
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <LifeIndexDashboard blogCount={publishedCount} />
        </div>
      </section>
    </>
  );
}
