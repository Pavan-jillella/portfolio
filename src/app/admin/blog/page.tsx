import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { FadeIn } from "@/components/ui/FadeIn";

export default function AdminBlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-4xl">
      <FadeIn>
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl text-white mb-2">Blog Posts</h1>
            <p className="font-body text-white/40">{posts.length} published posts</p>
          </div>
          <Link
            href="/admin/blog/new"
            className="glass-card px-5 py-2.5 rounded-full text-sm font-body text-white/80 hover:text-white transition-all hover:border-blue-500/30"
          >
            New post →
          </Link>
        </div>
      </FadeIn>

      <div className="space-y-3">
        {posts.map((post, i) => (
          <FadeIn key={post.slug} delay={i * 0.03}>
            <div className="glass-card rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-body font-medium text-sm text-white truncate">{post.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-xs text-white/25">{post.date}</span>
                  <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30">
                    {post.category}
                  </span>
                </div>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="font-body text-xs text-white/30 hover:text-blue-400 transition-colors shrink-0"
              >
                View →
              </Link>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
