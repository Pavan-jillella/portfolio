"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { bentoItem } from "./BentoGrid";

const testimonials = [
  {
    quote: "Pavan is one of the most driven developers I've worked with. His ability to ship full-stack products end-to-end is impressive.",
    name: "Prof. Johnson",
    role: "CS Faculty Advisor",
  },
  {
    quote: "Incredibly detail-oriented and always eager to learn. Pavan brings both technical depth and a builder's mindset to every project.",
    name: "Sarah Kim",
    role: "Engineering Manager",
  },
  {
    quote: "Working with Pavan on our capstone was a great experience. He took ownership of the architecture and delivered ahead of schedule.",
    name: "Alex Martinez",
    role: "Team Lead, Capstone Project",
  },
];

export function BentoTestimonialsCell() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[index];

  return (
    <motion.div
      variants={bentoItem}
      className="bento-card bento-card-violet bento-card-shine md:col-span-2 flex flex-col justify-between"
    >
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <span className="font-mono text-xs text-white/40 uppercase tracking-wider">Testimonials</span>
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-[120px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-body text-sm text-white/50 leading-relaxed mb-4 italic">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div>
              <p className="font-body text-sm font-medium text-white/70">{t.name}</p>
              <p className="font-mono text-[10px] text-white/30">{t.role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots indicator */}
      <div className="flex items-center gap-1.5 mt-4">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "bg-violet-400 w-4" : "bg-white/15 hover:bg-white/25"
            }`}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
