"use client";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { BlogPost } from "@/types";
import { PageHeader } from "@/components/ui/PageHeader";
import { BlogFilters } from "@/components/blog/BlogFilters";

export default function BlogPage() {
  const [posts] = useSupabaseRealtimeSync<BlogPost>("pj-blog-posts", "blog_posts", []);

  const published = posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <>
      <PageHeader
        label="Blog"
        title="Writing & thinking."
        description="Thoughts on technology, education, and finance. Written to clarify my own thinking."
      />

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <BlogFilters posts={published} />
        </div>
      </section>
    </>
  );
}
