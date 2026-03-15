"use client";
import { motion } from "framer-motion";
import { bentoItem } from "./BentoGrid";

export function BentoStatusCell() {
  return (
    <motion.div
      variants={bentoItem}
      className="bento-card bento-card-emerald bento-card-shine flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-section-finance" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="font-mono text-xs text-white/40 uppercase tracking-wider">Status</span>
        </div>

        {/* Availability indicator */}
        <div className="flex items-center gap-3 mb-5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
          </span>
          <span className="font-body text-sm text-white/70">Available for opportunities</span>
        </div>

        {/* Current focus — linkable */}
        <div className="space-y-3">
          <a
            href="https://github.com/pavanjillella"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 group"
          >
            <span className="font-mono text-[10px] text-emerald-400/60 mt-0.5 shrink-0">NOW</span>
            <p className="font-body text-xs text-white/40 group-hover:text-emerald-400 transition-colors">
              Google SDE Interview Prep
              <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
            </p>
          </a>
          <a
            href="https://github.com/pavanjillella"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 group"
          >
            <span className="font-mono text-[10px] text-white/20 mt-0.5 shrink-0">NEXT</span>
            <p className="font-body text-xs text-white/30 group-hover:text-white/50 transition-colors">
              Open-source contributions
              <span className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
            </p>
          </a>
        </div>
      </div>

      {/* Interests tags */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {["SDE Roles", "Full-Stack", "Systems Design"].map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-400/60 border border-emerald-400/15 bg-emerald-400/[0.04]"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
