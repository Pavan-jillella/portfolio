"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const quickLinks = [
  { label: "Home", href: "/", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Projects", href: "/projects", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { label: "Blog", href: "/blog", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
  { label: "Contact", href: "/contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
];

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="text-center max-w-lg"
      >
        {/* Large 404 with gradient */}
        <motion.div variants={item} className="mb-8">
          <span className="font-display font-bold text-[120px] sm:text-[160px] leading-none bg-gradient-to-br from-white/10 via-white/5 to-transparent bg-clip-text text-transparent select-none">
            404
          </span>
        </motion.div>

        <motion.h1 variants={item} className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
          Lost in the void
        </motion.h1>

        <motion.p variants={item} className="font-body text-white/40 mb-10 max-w-sm mx-auto">
          This page doesn&apos;t exist or has been moved. Here are some places you can go instead.
        </motion.p>

        {/* Quick links grid */}
        <motion.div variants={item} className="grid grid-cols-2 gap-3 mb-8">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bento-card bento-card-blue rounded-xl p-4 flex flex-col items-center gap-2 group"
            >
              <svg className="w-5 h-5 text-white/30 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
              </svg>
              <span className="font-body text-sm text-white/50 group-hover:text-white/80 transition-colors">
                {link.label}
              </span>
            </Link>
          ))}
        </motion.div>

        <motion.div variants={item}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-body font-medium text-white bg-gradient-to-r from-blue-500/20 to-blue-500/10 border border-blue-500/30 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 group"
          >
            <span className="transition-transform group-hover:-translate-x-1">&larr;</span>
            Back to home
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
