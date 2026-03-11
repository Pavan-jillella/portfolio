"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { BlogPost } from "@/types";
import { CommentSection } from "@/components/blog/CommentSection";
import { FadeIn } from "@/components/ui/FadeIn";

const remarkPlugins = [remarkGfm];

function isSafeHref(href: string | undefined): boolean {
  if (!href) return false;
  return href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://") || href.startsWith("#");
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface BlogPostPageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  const router = useRouter();
  const [posts, setPosts] = useSupabaseRealtimeSync<BlogPost>("pj-blog-posts", "blog_posts", []);
  const [ready, setReady] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // After a short delay, consider data loaded
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Mark ready immediately if we have posts
  useEffect(() => {
    if (posts.length > 0) setReady(true);
  }, [posts.length]);

  // Load likes from localStorage
  useEffect(() => {
    const storedLikes = localStorage.getItem(`blog-likes-${slug}`);
    const hasLiked = localStorage.getItem(`blog-liked-${slug}`);
    if (storedLikes) setLikes(parseInt(storedLikes, 10));
    if (hasLiked === "true") setLiked(true);
  }, [slug]);

  // Reading progress bar
  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setReadProgress(Math.min(100, (scrollTop / docHeight) * 100));
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const post = posts.find((p) => p.slug === slug);

  const handleLike = useCallback(() => {
    if (liked) {
      const newCount = Math.max(0, likes - 1);
      setLikes(newCount);
      setLiked(false);
      localStorage.setItem(`blog-likes-${slug}`, newCount.toString());
      localStorage.removeItem(`blog-liked-${slug}`);
    } else {
      const newCount = likes + 1;
      setLikes(newCount);
      setLiked(true);
      localStorage.setItem(`blog-likes-${slug}`, newCount.toString());
      localStorage.setItem(`blog-liked-${slug}`, "true");
    }
  }, [liked, likes, slug]);

  const handleDelete = useCallback(() => {
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
    router.push("/blog");
  }, [setPosts, slug, router]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  }, []);

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
          &larr; Back to blog
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
          style={{ width: `${readProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <article className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <Link
                href="/blog"
                className="inline-block font-body text-sm text-white/30 hover:text-white transition-colors"
              >
                &larr; Back to blog
              </Link>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/blog/write?edit=${post.slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] font-body text-xs text-white/40 hover:text-white/70 hover:border-white/15 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] font-body text-xs text-white/40 hover:text-red-400 hover:border-red-500/20 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>

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
                <span className="font-mono text-xs text-white/20">{formatDate(post.created_at)}</span>
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
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </FadeIn>

          {/* Like + Share bar */}
          <FadeIn delay={0.12}>
            <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
              {/* Like button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
                  liked
                    ? "border-red-500/30 bg-red-500/[0.08] text-red-400"
                    : "border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-red-400 hover:border-red-500/20"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={liked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                <span className="font-body text-sm">{likes > 0 ? likes : "Like"}</span>
              </button>

              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                    copied
                      ? "border-green-500/30 bg-green-500/[0.08] text-green-400"
                      : "border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/70 hover:border-white/15"
                  }`}
                >
                  {copied ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-4.122a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L7.44 8.088" />
                    </svg>
                  )}
                  <span className="font-body text-xs">{copied ? "Copied!" : "Copy link"}</span>
                </button>

                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/70 hover:border-white/15 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="font-body text-xs">Share</span>
                </a>
              </div>
            </div>
          </FadeIn>

          {/* Comments */}
          <FadeIn delay={0.15}>
            <CommentSection slug={slug} />
          </FadeIn>
        </div>
      </article>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative glass-card rounded-2xl p-6 max-w-sm w-full border border-white/10"
            >
              <h3 className="font-display font-semibold text-lg text-white mb-2">Delete post?</h3>
              <p className="font-body text-sm text-white/40 mb-6">
                This will permanently delete &ldquo;{post.title}&rdquo;. This action cannot be undone.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] font-body text-sm text-white/50 hover:text-white/70 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/[0.12] font-body text-sm text-red-400 hover:bg-red-500/[0.2] transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
