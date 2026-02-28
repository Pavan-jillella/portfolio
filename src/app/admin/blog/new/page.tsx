"use client";
import { useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";

export default function NewBlogPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technology");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSave() {
    if (!title || !content) return;
    setStatus("saving");

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || generateSlug(title),
          description,
          category,
          content,
        }),
      });

      if (res.ok) {
        setStatus("saved");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="max-w-3xl">
      <FadeIn>
        <h1 className="font-display font-bold text-3xl text-white mb-8">New Blog Post</h1>
      </FadeIn>

      <div className="space-y-6">
        <div>
          <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slug) setSlug(generateSlug(e.target.value));
            }}
            className="w-full bg-white/4 border border-white/8 rounded-2xl px-5 py-3 font-body text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            placeholder="Post title"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-white/4 border border-white/8 rounded-2xl px-5 py-3 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
              placeholder="post-slug"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/4 border border-white/8 rounded-2xl px-5 py-3 font-body text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all"
            >
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white/4 border border-white/8 rounded-2xl px-5 py-3 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            placeholder="Brief description of the post"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Content (MDX)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full bg-white/4 border border-white/8 rounded-2xl px-5 py-4 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all resize-none leading-relaxed"
            placeholder="Write your MDX content here..."
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={status === "saving" || !title || !content}
            className="glass-card px-8 py-3 rounded-2xl text-sm font-body font-medium text-white hover:text-blue-300 transition-all duration-300 hover:border-blue-500/30 disabled:opacity-50"
          >
            {status === "saving" ? "Saving..." : status === "saved" ? "Saved!" : "Save post"}
          </button>
          {status === "error" && (
            <p className="font-body text-sm text-red-400">Failed to save. Blog creation only works in development mode.</p>
          )}
          {status === "saved" && (
            <p className="font-body text-sm text-emerald-400">Post saved to /content/blog/</p>
          )}
        </div>
      </div>
    </div>
  );
}
