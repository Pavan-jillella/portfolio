"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { bentoItem } from "./BentoGrid";

const heroInner = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const scaleIn = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function BentoHeroCell() {
  return (
    <motion.div
      variants={bentoItem}
      className="bento-card bento-card-shine col-span-1 md:col-span-2 lg:row-span-2 flex flex-col justify-center p-8 md:p-12 min-h-[340px]"
    >
      {/* Ambient glow inside hero */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-warm/[0.04] blur-[100px] pointer-events-none" />

      <motion.div variants={heroInner} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <motion.div variants={fadeUp} className="mb-5">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.12)]">
            <Image
              src="/profile-photo.jpg"
              alt="Pavan Jillella"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>

        <motion.p variants={fadeLeft} className="font-mono text-xs text-warm uppercase tracking-widest mb-5">
          Personal Brand
        </motion.p>

        <motion.h1 variants={fadeUp} className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-[1.1] mb-3">
          Hi, I&apos;m{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-white via-white to-warm-light bg-clip-text text-transparent">
              Pavan
            </span>
            <motion.span
              variants={scaleIn}
              className="absolute bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-warm to-warm-light rounded-full origin-left"
            />
          </span>
          .
        </motion.h1>

        <motion.div variants={fadeUp}>
          <p className="font-display font-semibold text-xl sm:text-2xl text-white/60 mb-4">
            Data Analyst @ Morgan Stanley
          </p>
          <p className="font-body text-base text-white/40 max-w-md leading-relaxed mb-8">
            I turn complex data into actionable insights. M.S. in Data Analytics
            from George Mason. Google Cloud &amp; AWS ML certified.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
          <Link
            href="/projects"
            className="relative px-6 py-3 rounded-full text-sm font-body font-medium text-white bg-gradient-to-r from-section-projects/20 to-section-projects/10 border border-section-projects/30 hover:border-section-projects/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-300 group"
          >
            View Projects{" "}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <a
            href="/contact"
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-body font-medium text-white/60 hover:text-white border border-white/10 hover:border-warm/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Get in Touch
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
