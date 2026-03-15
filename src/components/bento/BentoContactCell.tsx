"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { bentoItem } from "./BentoGrid";

const socials = [
  { label: "GitHub", href: "https://github.com/pavanjillella", abbr: "GH" },
  { label: "LinkedIn", href: "https://linkedin.com/in/pavanjillella", abbr: "LI" },
  { label: "LeetCode", href: "https://leetcode.com/pavanjillella", abbr: "LC" },
  { label: "YouTube", href: "https://youtube.com/@pavanjillella", abbr: "YT" },
];

const socialItem = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

const socialContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

export function BentoContactCell() {
  return (
    <motion.div
      variants={bentoItem}
      className="bento-card bento-card-amber bento-card-shine md:col-span-2 lg:col-span-4"
    >
      <div className="flex items-center gap-2 mb-5">
        <svg className="w-4 h-4 text-warm" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span className="font-mono text-xs text-white/40 uppercase tracking-wider">Connect</span>
      </div>

      {/* Three-column layout on full-width card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Left: Social links */}
        <div className="flex flex-col justify-between">
          <motion.div className="flex flex-wrap gap-2 mb-4" variants={socialContainer} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={socialItem}
                whileHover={{ scale: 1.1, y: -2 }}
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-warm/30 text-white/40 hover:text-warm font-mono text-xs transition-colors"
                title={s.label}
              >
                {s.abbr}
              </motion.a>
            ))}
          </motion.div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-1 font-body text-sm text-warm hover:text-warm-light transition-colors group"
          >
            Say hello{" "}
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Center: Newsletter */}
        <div className="flex flex-col justify-between">
          <p className="font-body text-xs text-white/30 mb-3">Stay in the loop</p>
          <NewsletterForm compact />
        </div>

        {/* Right: Resume + Email */}
        <div className="flex flex-col justify-between">
          <p className="font-body text-xs text-white/30 mb-3">Quick access</p>
          <div className="flex flex-col gap-2">
            <a
              href="/resume.pdf"
              download
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-warm/30 text-white/40 hover:text-warm font-body text-xs transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </a>
            <a
              href="mailto:pavan@pavanjillella.com"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-warm/30 text-white/40 hover:text-warm font-body text-xs transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email me
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
