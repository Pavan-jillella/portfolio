import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { BLOG_POSTS } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { FadeIn } from "@/components/ui/FadeIn";

export const metadata = {
  title: "Blog | Pavan Jillella",
  description: "Thoughts on technology, education, and finance — written by Pavan Jillella.",
};

export default function BlogPage() {
  const mdxPosts = getAllPosts();
  const posts = mdxPosts.length > 0
    ? mdxPosts.map((p, i) => ({
        id: String(i + 1),
        title: p.title,
        date: p.date,
        description: p.description,
        category: p.category,
        readTime: p.readTime,
        slug: p.slug,
      }))
    : BLOG_POSTS;

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

  return (
    <>
      <PageHeader
        label="Blog"
        title="Writing & thinking."
        description="Thoughts on technology, education, and finance. Written to clarify my own thinking."
      />

      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Category tags */}
          <FadeIn>
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-4 py-2 rounded-full border border-white/8 bg-white/4 font-body text-xs text-white/50 cursor-default"
                >
                  {cat}
                </span>
              ))}
            </div>
          </FadeIn>

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post, i) => (
              <FadeIn key={post.slug} delay={i * 0.03}>
                <Link href={`/blog/${post.slug}`} className="block group">
                  <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.02] hover:border-white/15">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="font-display font-semibold text-lg text-white group-hover:text-blue-300 transition-colors mb-2">
                          {post.title}
                        </h2>
                        <p className="font-body text-sm text-white/40 line-clamp-2 mb-3">
                          {post.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-white/25">{post.date}</span>
                          <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-xs">
                            {post.category}
                          </span>
                          <span className="font-mono text-xs text-white/20">{post.readTime}</span>
                        </div>
                      </div>
                      <span className="font-body text-sm text-white/20 group-hover:text-blue-400 transition-colors shrink-0 mt-1">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
