"use client";
import { motion } from "framer-motion";
import { GITHUB_PROFILE_URL } from "@/lib/constants";

const words = ["Building.", "Thinking.", "Documenting."];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
      {/* Central ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[400px] rounded-full bg-blue-500/5 blur-[140px] animate-pulse-glow" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-500/60" />
          <span className="section-label">Personal brand</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-500/60" />
        </motion.div>

        {/* Main headline */}
        <div className="overflow-hidden mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="font-display font-bold text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[0.95] text-white"
          >
            {words.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`block ${i === 2 ? "neon-text" : ""}`}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="font-body text-lg md:text-xl text-white/40 max-w-xl mx-auto leading-relaxed mb-14"
        >
          At the intersection of{" "}
          <span className="text-white/70">education</span>,{" "}
          <span className="text-white/70">finance</span>, and{" "}
          <span className="text-white/70">technology</span>. I build systems,
          invest in knowledge, and document everything.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="/projects"
            className="glass-card px-8 py-4 rounded-full text-sm font-body font-medium text-white hover:text-blue-300 transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] group"
          >
            Explore work{" "}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full text-sm font-body font-medium text-white/40 hover:text-white/70 transition-colors duration-200"
          >
            GitHub ↗
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pb-8"
        >
          <span className="section-label text-white/20">scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}
