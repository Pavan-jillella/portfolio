"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { bentoItem } from "./BentoGrid";

const timeline = [
  { year: "2021", label: "First Lines of Code", active: false },
  { year: "2022", label: "Web Development", active: false },
  { year: "2023", label: "Full-Stack Projects", active: false },
  { year: "2024", label: "Full-Stack Developer", active: false },
  { year: "2026", label: "Google SDE Prep", active: true },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const slideIn = {
  hidden: { opacity: 0, x: -15 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export function BentoAboutCell() {
  return (
    <motion.div
      variants={bentoItem}
      className="bento-card bento-card-blue bento-card-shine lg:col-span-2 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-neon-blue" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-mono text-xs text-white/40 uppercase tracking-wider">About</span>
        </div>
        <p className="font-body text-sm text-white/50 leading-relaxed mb-4">
          Developer focused on building tools that compound knowledge. Currently
          preparing for Google SDE roles while creating open-source projects.
        </p>
      </div>

      {/* Mini timeline with staggered variants */}
      <motion.div className="space-y-2.5 mb-4" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}>
        {timeline.map((item) => (
          <motion.div key={item.year} variants={slideIn} className="flex items-center gap-3">
            <span className={`font-mono text-[10px] w-8 ${item.active ? "text-blue-400" : "text-blue-400/40"}`}>
              {item.year}
            </span>
            <div className="relative">
              <div className={`w-2 h-2 rounded-full ${item.active ? "bg-blue-400" : "bg-blue-400/30"}`} />
              {item.active && (
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-blue-400 animate-ping opacity-40" />
              )}
            </div>
            <span className={`font-body text-xs ${item.active ? "text-white/60" : "text-white/30"}`}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <Link
        href="/about"
        className="inline-flex items-center gap-1 font-body text-sm text-neon-blue hover:text-blue-300 transition-colors group"
      >
        More about me{" "}
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </motion.div>
  );
}
