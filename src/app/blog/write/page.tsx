"use client";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { BlogPost } from "@/types";

const remarkPlugins = [remarkGfm];

type EditorView = "split" | "editor" | "preview";
type SaveStatus = "idle" | "saving" | "saved" | "error";

export default function BlogWritePage() {
  const router = useRouter();
  const [posts, setPosts] = useSupabaseRealtimeSync<BlogPost>("pj-blog-posts", "blog_posts", []);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technology");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [view, setView] = useState<EditorView>("split");
  const [showMeta, setShowMeta] = useState(true);

  const slug = useMemo(() => {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (!base) return "";
    const exists = posts.some((p) => p.slug === base);
    return exists ? `${base}-${Date.now().toString(36)}` : base;
  }, [title, posts]);

  const wordCount = useMemo(
    () => content.trim().split(/\s+/).filter(Boolean).length,
    [content]
  );

  const readTime = useMemo(
    () => `${Math.max(1, Math.ceil(wordCount / 200))} min`,
    [wordCount]
  );

  const handlePublish = useCallback(() => {
    if (!title.trim() || !content.trim()) return;
    setStatus("saving");
    setErrorMsg("");

    try {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title: title.trim(),
        slug: slug || "untitled",
        description: description.trim(),
        content: content.trim(),
        category,
        read_time: readTime,
        published: true,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        created_at: new Date().toISOString(),
      };

      setPosts((prev) => [newPost, ...prev]);
      setStatus("saved");
      setTimeout(() => router.push(`/blog/${slug}`), 1000);
    } catch {
      setErrorMsg("Failed to publish");
      setStatus("error");
    }
  }, [title, slug, description, category, content, tags, readTime, router, setPosts]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]"
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors font-body text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Blog
          </Link>
          <div className="w-px h-5 bg-white/[0.06]" />
          <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
            {slug || "new-post"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-white/[0.06] overflow-hidden">
            {(["editor", "split", "preview"] as EditorView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-all ${
                  view === v
                    ? "bg-white/[0.08] text-white/70"
                    : "text-white/25 hover:text-white/40"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Meta toggle */}
          <button
            onClick={() => setShowMeta(!showMeta)}
            className={`p-2 rounded-lg border transition-all ${
              showMeta
                ? "border-blue-500/20 text-blue-400/60 bg-blue-500/[0.06]"
                : "border-white/[0.06] text-white/25 hover:text-white/40"
            }`}
            title="Toggle metadata"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
          </button>

          {/* Word count */}
          <span className="font-mono text-[10px] text-white/20 hidden sm:block">
            {wordCount} words &middot; {readTime}
          </span>

          {/* Publish button */}
          <button
            onClick={handlePublish}
            disabled={status === "saving" || !title.trim() || !content.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-full font-body text-sm font-medium text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
            style={{
              background:
                status === "saved"
                  ? "linear-gradient(135deg, rgba(34,197,94,0.8), rgba(16,185,129,0.6))"
                  : "linear-gradient(135deg, rgba(59,130,246,0.8), rgba(6,182,212,0.6))",
              boxShadow: "0 2px 12px rgba(59,130,246,0.15)",
            }}
          >
            {status === "saving" ? (
              <>
                <motion.div
                  className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                Publishing...
              </>
            ) : status === "saved" ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Published
              </>
            ) : (
              "Publish"
            )}
          </button>
        </div>
      </motion.header>

      {/* Error banner */}
      <AnimatePresence>
        {status === "error" && errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 py-3 bg-red-500/[0.06] border-b border-red-500/10"
          >
            <p className="font-body text-sm text-red-400 text-center">{errorMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title input */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-6 pt-8 pb-2 max-w-5xl mx-auto w-full"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title..."
          className="w-full bg-transparent font-display font-bold text-3xl md:text-4xl text-white placeholder-white/15 focus:outline-none"
        />
      </motion.div>

      {/* Metadata panel */}
      <AnimatePresence>
        {showMeta && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 max-w-5xl mx-auto w-full">
              <div className="flex flex-wrap gap-3 mt-2">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description..."
                  className="flex-1 min-w-[200px] bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/30 transition-all"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-blue-500/30 transition-all"
                >
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                </select>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Tags (comma-separated)..."
                  className="flex-1 min-w-[160px] bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/30 transition-all"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Divider */}
      <div className="mx-6 border-t border-white/[0.04]" />

      {/* Editor area */}
      <div className="flex-1 flex min-h-0">
        {/* Markdown editor */}
        {(view === "editor" || view === "split") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex flex-col min-h-0 ${view === "split" ? "w-1/2 border-r border-white/[0.04]" : "w-full"}`}
          >
            <div className="px-4 py-2 flex items-center gap-2 border-b border-white/[0.04]">
              <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Markdown</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your post in Markdown..."
              className="flex-1 w-full px-6 py-4 bg-transparent font-mono text-sm text-white/80 placeholder-white/15 focus:outline-none resize-none leading-relaxed"
              spellCheck
            />
          </motion.div>
        )}

        {/* Live preview */}
        {(view === "preview" || view === "split") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex flex-col min-h-0 overflow-y-auto ${view === "split" ? "w-1/2" : "w-full"}`}
          >
            <div className="px-4 py-2 flex items-center gap-2 border-b border-white/[0.04]">
              <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Preview</span>
            </div>
            <div className="px-6 py-4 prose-custom flex-1">
              {content ? (
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
                      <a href={href} className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
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
              ) : (
                <p className="font-body text-sm text-white/15 italic">Preview will appear here...</p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="px-6 py-3 border-t border-white/[0.04] flex items-center justify-between">
        <span className="font-mono text-[10px] text-white/15">
          {wordCount} words &middot; {readTime} read
        </span>
        <span className="font-mono text-[10px] text-white/15">
          Markdown supported
        </span>
      </div>
    </div>
  );
}
