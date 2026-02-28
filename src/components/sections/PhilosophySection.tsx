"use client";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/FadeIn";

const lines = [
  "I believe the most valuable work happens at intersections.",
  "Where finance meets technology, compounding returns meet compounding knowledge.",
  "Where documenting is not just capturing — it's thinking out loud.",
  "Every line of code, every written word, every tracked dollar",
  "is a small vote for the person I'm becoming.",
];

export function PhilosophySection() {
  return (
    <section className="py-40 px-6">
      <div className="max-w-3xl mx-auto">
        <FadeIn className="mb-16">
          <span className="section-label block mb-4">Philosophy</span>
        </FadeIn>

        <div className="space-y-6">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`font-display text-xl md:text-2xl leading-relaxed ${
                i < 2 ? "text-white/80" : i === 2 ? "text-white/60" : "text-white/35"
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ originX: 0 }}
          className="mt-16 h-px bg-gradient-to-r from-blue-500/40 via-blue-500/10 to-transparent"
        />
      </div>
    </section>
  );
}
