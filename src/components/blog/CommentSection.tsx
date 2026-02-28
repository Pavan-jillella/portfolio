"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Comment } from "@/types";

interface CommentSectionProps {
  slug: string;
}

export function CommentSection({ slug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blog_slug: slug, author_name: name, content }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [...prev, comment]);
        setContent("");
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch {}
    setSubmitting(false);
  }

  if (error) {
    return (
      <div className="mt-16 pt-8 border-t border-white/5">
        <p className="font-body text-sm text-white/30">Comments are currently unavailable.</p>
      </div>
    );
  }

  return (
    <div className="mt-16 pt-8 border-t border-white/5">
      <h3 className="font-display font-semibold text-xl text-white mb-8">Comments</h3>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="glass-card rounded-2xl p-5 animate-pulse">
              <div className="h-4 w-24 bg-glass-white rounded mb-2" />
              <div className="h-4 w-full bg-glass-white rounded" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="font-body text-sm text-white/30 mb-8">No comments yet. Be the first to share your thoughts.</p>
      ) : (
        <AnimatePresence>
          <div className="space-y-4 mb-8">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-body font-medium text-sm text-white">{comment.author_name}</span>
                  <span className="font-mono text-xs text-white/20">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="font-body text-sm text-white/50 leading-relaxed">{comment.content}</p>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
          className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 font-body text-sm placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all"
        />
        <textarea
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          maxLength={2000}
          rows={3}
          className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 font-body text-sm placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
        />
        <div className="flex items-center justify-between">
          {submitted && (
            <span className="font-body text-sm text-emerald-400">Comment posted!</span>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="ml-auto glass-card px-6 py-2.5 rounded-xl text-sm font-body text-white hover:text-blue-300 transition-all duration-300 hover:border-blue-500/30 disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post comment"}
          </button>
        </div>
      </form>
    </div>
  );
}
