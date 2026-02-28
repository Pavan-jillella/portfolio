"use client";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";
import { BLOG_POSTS } from "@/lib/data";
import Link from "next/link";

const categoryColors: Record<string, string> = {
  Finance: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
  Education: "text-blue-400 border-blue-500/20 bg-blue-500/5",
  Technology: "text-orange-400 border-orange-500/20 bg-orange-500/5",
};

export function BlogSection() {
  return (
    <section id="blog" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <FadeIn className="mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <span className="section-label block mb-4">Writing</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight">
              Ideas worth sharing.
            </h2>
          </div>
          <a
            href="/blog"
            className="font-body text-sm text-white/30 hover:text-blue-400 transition-colors shrink-0"
          >
            All posts →
          </a>
        </FadeIn>

        {/* Grid - show first 3 on homepage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BLOG_POSTS.slice(0, 3).map((post, i) => (
            <motion.a
              key={post.id}
              href={`/blog/${post.slug}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="glass-card rounded-3xl p-7 flex flex-col gap-4 group block"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`tag-badge px-2.5 py-1 rounded-full border ${categoryColors[post.category] || "text-white/40 border-white/10"}`}
                >
                  {post.category}
                </span>
                <span className="font-mono text-xs text-white/25">{post.readTime}</span>
              </div>

              <h3 className="font-display font-semibold text-base text-white group-hover:text-blue-300 transition-colors leading-snug flex-1">
                {post.title}
              </h3>

              <p className="font-body text-sm text-white/40 leading-relaxed line-clamp-3">
                {post.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="font-mono text-xs text-white/25">{post.date}</span>
                <span className="text-white/20 group-hover:text-blue-400 transition-colors text-sm">→</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
