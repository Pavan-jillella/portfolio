"use client";
import { useState } from "react";
import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
import { BlogPost } from "@/types";

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function BlogFilters({ posts }: { posts: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];

  const filtered = activeCategory === "All"
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Category filter chips + View toggle + Write button */}
      <FadeIn>
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full border font-body text-xs transition-all duration-200 ${
                activeCategory === cat
                  ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                  : "border-white/8 bg-white/4 text-white/50 hover:border-white/15 hover:text-white/70"
              }`}
            >
              {cat}
              {cat !== "All" && (
                <span className="ml-1.5 font-mono text-[10px] opacity-60">
                  {posts.filter((p) => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
          <div className="flex items-center gap-3 ml-auto">
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
            <Link
              href="/blog/write"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/[0.08] font-body text-xs text-blue-400 hover:bg-blue-500/[0.14] hover:border-blue-500/30 transition-all duration-300"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Write
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Filtered posts — List view */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {filtered.map((post, i) => (
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
                        <span className="font-mono text-xs text-white/25">{formatDate(post.created_at)}</span>
                        <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-xs">
                          {post.category}
                        </span>
                        <span className="font-mono text-xs text-white/20">{post.read_time}</span>
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
      )}

      {/* Filtered posts — Grid view */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 0.03}>
              <Link href={`/blog/${post.slug}`} className="block group h-full">
                <div className="glass-card rounded-2xl p-5 h-full flex flex-col hover:bg-white/[0.02] hover:border-white/15 transition-all duration-300">
                  <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-xs w-fit mb-3">
                    {post.category}
                  </span>
                  <h2 className="font-display font-semibold text-white group-hover:text-blue-300 transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="font-body text-sm text-white/40 line-clamp-3 mb-auto">{post.description}</p>
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5">
                    <span className="font-mono text-xs text-white/25">{formatDate(post.created_at)}</span>
                    <span className="font-mono text-xs text-white/20">{post.read_time}</span>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      )}

      {/* Filtered posts — Table view */}
      {viewMode === "table" && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Read Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.slug} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-2.5">
                      <Link href={`/blog/${post.slug}`} className="font-body text-xs text-white/70 hover:text-blue-300 transition-colors">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-white/30 text-xs">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-white/30">{formatDate(post.created_at)}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-mono text-xs text-white/20">{post.read_time}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state — shown for all view modes */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="font-body text-sm text-white/30">No posts yet.</p>
          <Link
            href="/blog/write"
            className="mt-3 inline-block font-body text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Write your first post
          </Link>
        </div>
      )}
    </>
  );
}
