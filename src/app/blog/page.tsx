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

      {/* Floating Write button */}
      <Link
        href="/blog/write"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 px-5 py-3 rounded-full font-body text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_32px_rgba(59,130,246,0.3)] group"
        style={{
          background: "linear-gradient(135deg, rgba(59,130,246,0.8), rgba(6,182,212,0.6))",
          boxShadow: "0 4px 24px rgba(59,130,246,0.2), 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      >
        <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-[-8deg]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
        Write
      </Link>
    </>
  );
}
