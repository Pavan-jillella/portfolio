"use client";
import { motion } from "framer-motion";
import { bentoItem } from "./BentoGrid";

const stack = [
  { name: "TypeScript", color: "border-blue-500/30 text-blue-500", bg: "hover:bg-blue-500/[0.08]" },
  { name: "Python", color: "border-yellow-500/30 text-yellow-500", bg: "hover:bg-yellow-500/[0.08]" },
  { name: "React", color: "border-cyan-500/30 text-cyan-500", bg: "hover:bg-cyan-500/[0.08]" },
  { name: "Next.js", color: "border-white/20 text-white/70", bg: "hover:bg-white/[0.06]" },
  { name: "Node.js", color: "border-green-500/30 text-green-500", bg: "hover:bg-green-500/[0.08]" },
  { name: "PostgreSQL", color: "border-indigo-500/30 text-indigo-500", bg: "hover:bg-indigo-500/[0.08]" },
  { name: "AWS", color: "border-orange-500/30 text-orange-500", bg: "hover:bg-orange-500/[0.08]" },
  { name: "Docker", color: "border-sky-500/30 text-sky-500", bg: "hover:bg-sky-500/[0.08]" },
  { name: "Tailwind", color: "border-teal-500/30 text-teal-500", bg: "hover:bg-teal-500/[0.08]" },
  { name: "Go", color: "border-cyan-500/30 text-cyan-500", bg: "hover:bg-cyan-500/[0.08]" },
];

const pillContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
};

const pill = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export function BentoTechStackCell() {
  return (
    <motion.div
      variants={bentoItem}
      className="bento-card bento-card-blue bento-card-shine flex flex-col"
    >
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-neon-blue" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
        <span className="font-mono text-xs text-white/40 uppercase tracking-wider">Tech Stack</span>
      </div>

      <motion.div className="flex flex-wrap gap-2 flex-1 content-start" variants={pillContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
        {stack.map((tech) => (
          <motion.span
            key={tech.name}
            variants={pill}
            whileHover={{ scale: 1.08, y: -2 }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono ${tech.color} ${tech.bg} bg-white/[0.02] transition-colors cursor-default`}
          >
            {tech.name}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}
