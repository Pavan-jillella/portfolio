"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { bentoItem } from "./BentoGrid";

interface PublicBlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  read_time: string;
  created_at: string;
  view_count?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Technology: "text-section-blog bg-section-blog/10",
  Finance: "text-section-finance bg-section-finance/10",
  Education: "text-section-education bg-section-education/10",
};

export function BentoLatestBlogCell() {
  const { data } = useQuery({
    queryKey: ["public-homepage"],
    queryFn: async () => {
      const res = await fetch("/api/public");
      if (!res.ok) return { posts: [], projects: [] };
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const latest: PublicBlogPost | undefined = data?.posts?.[0];

  return (
    <motion.div
      variants={bentoItem}
      className="bento-card bento-card-amber bento-card-shine flex flex-col justify-between"
    >
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-warm" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <span className="font-mono text-xs text-white/40 uppercase tracking-wider">Latest Post</span>
      </div>

      {latest ? (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono mb-3 ${CATEGORY_COLORS[latest.category] || "text-white/40 bg-white/5"}`}>
              {latest.category}
            </span>
            <h3 className="font-display font-semibold text-base text-white leading-snug mb-2 line-clamp-2">
              {latest.title}
            </h3>
            <p className="font-body text-sm text-white/30 line-clamp-2">
              {latest.description}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="font-mono text-[10px] text-white/20">{latest.read_time}</span>
            {latest.view_count ? (
              <span className="font-mono text-[10px] text-white/20 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                {latest.view_count >= 1000 ? `${(latest.view_count / 1000).toFixed(1)}k` : latest.view_count}
              </span>
            ) : null}
            <Link
              href={`/blog/${latest.slug}`}
              className="inline-flex items-center gap-1 font-body text-sm text-warm hover:text-warm-light transition-colors ml-auto group"
            >
              Read{" "}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center">
          <p className="font-body text-sm text-white/30 mb-1">No posts yet</p>
          <Link href="/blog" className="font-body text-sm text-warm hover:text-warm-light transition-colors">
            Visit blog →
          </Link>
        </div>
      )}
    </motion.div>
  );
}
