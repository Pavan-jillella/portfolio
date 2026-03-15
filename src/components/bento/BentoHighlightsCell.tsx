"use client";
import { motion } from "framer-motion";
import { bentoItem } from "./BentoGrid";
import { AnimatedCounter } from "./AnimatedCounter";

const highlights = [
  { value: 500, suffix: "+", label: "LeetCode Problems", color: "text-amber-400" },
  { value: 10, suffix: "+", label: "Projects Built", color: "text-violet-400" },
  { value: 4, suffix: "+", label: "Years Coding", color: "text-emerald-400" },
  { value: 15, suffix: "+", label: "Blog Posts", color: "text-blue-400" },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function BentoHighlightsCell() {
  return (
    <motion.div
      variants={bentoItem}
      className="bento-card bento-card-violet bento-card-shine md:col-span-2"
    >
      <div className="flex items-center gap-2 mb-5">
        <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="font-mono text-xs text-white/40 uppercase tracking-wider">Highlights</span>
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {highlights.map((h) => (
          <motion.div
            key={h.label}
            variants={fadeUp}
            className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]"
          >
            <p className={`font-display font-bold text-2xl ${h.color}`}>
              <AnimatedCounter target={h.value} />{h.suffix}
            </p>
            <p className="font-mono text-[10px] text-white/30 mt-1">{h.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
