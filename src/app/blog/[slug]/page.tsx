"use client";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { BlogPost } from "@/types";
import { CommentSection } from "@/components/blog/CommentSection";
import { FadeIn } from "@/components/ui/FadeIn";

const remarkPlugins = [remarkGfm];

function isSafeHref(href: string | undefined): boolean {
  if (!href) return false;
  return href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://") || href.startsWith("#");
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = use(params);
  const [posts] = useSupabaseRealtimeSync<BlogPost>("pj-blog-posts", "blog_posts", []);
  const [ready, setReady] = useState(false);

  // After a short delay, consider data loaded (handles both empty and populated states)
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Mark ready immediately if we have posts
  useEffect(() => {
    if (posts.length > 0) setReady(true);
  }, [posts.length]);

  const post = posts.find((p) => p.slug === slug);

  if (!ready) {
    return (
      <div className="pt-32 pb-20 px-6 text-center">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto" />
        <p className="font-body text-sm text-white/30 mt-4">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-32 pb-20 px-6 text-center">
        <h1 className="font-display font-bold text-2xl text-white mb-4">Post not found</h1>
        <Link href="/blog" className="font-body text-sm text-blue-400 hover:text-blue-300 transition-colors">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <article className="pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <FadeIn>
          <Link
            href="/blog"
            className="inline-block font-body text-sm text-white/30 hover:text-white transition-colors mb-8"
          >
            ← Back to blog
          </Link>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="tag-badge px-3 py-1 rounded-full border border-white/8 bg-white/4 text-white/40 text-xs">
                {post.category}
              </span>
              <span className="font-mono text-xs text-white/25">{post.read_time}</span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
              {post.title}
            </h1>
            <p className="font-body text-white/40">{post.description}</p>
            <div className="flex items-center gap-3 mt-4">
              <span className="font-mono text-xs text-white/20">{post.created_at}</span>
              {post.tags?.length > 0 && (
                <div className="flex gap-2">
                  {post.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full border border-white/5 bg-white/[0.02] font-mono text-xs text-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Content */}
        <FadeIn delay={0.1}>
          <div className="prose-custom">
            <ReactMarkdown
              remarkPlugins={remarkPlugins}
              components={{
                h1: ({ children }) => (
                  <h1 className="font-display font-bold text-3xl text-white mt-8 mb-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="font-display font-semibold text-2xl text-white mt-8 mb-3">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="font-display font-semibold text-xl text-white mt-6 mb-2">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="font-body text-sm text-white/60 leading-relaxed mb-4">{children}</p>
                ),
                a: ({ children, href }) => (
                  <a href={isSafeHref(href) ? href : "#"} rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
                    {children}
                  </a>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 mb-4 text-white/60 font-body text-sm">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-1 mb-4 text-white/60 font-body text-sm">{children}</ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-blue-500/40 pl-4 italic text-white/40 font-body text-sm mb-4">
                    {children}
                  </blockquote>
                ),
                code: ({ className, children }) => {
                  const isBlock = className?.includes("language-");
                  return isBlock ? (
                    <pre className="glass-card rounded-xl p-4 mb-4 overflow-x-auto">
                      <code className="font-mono text-sm text-white/70">{children}</code>
                    </pre>
                  ) : (
                    <code className="px-1.5 py-0.5 rounded-md bg-white/[0.06] font-mono text-xs text-blue-300">
                      {children}
                    </code>
                  );
                },
                hr: () => <hr className="border-white/[0.06] my-8" />,
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse text-sm">{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-white/[0.08] px-3 py-2 text-left font-body text-white/60 bg-white/[0.03]">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-white/[0.08] px-3 py-2 font-body text-white/40">{children}</td>
                ),
              }}
            />
          </div>
        </FadeIn>

        {/* Comments */}
        <FadeIn delay={0.15}>
          <CommentSection slug={slug} />
        </FadeIn>
      </div>
    </article>
  );
}
