"use client";
import { motion } from "framer-motion";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

const socials = [
  { label: "GitHub", href: "https://github.com/pavanjillella", icon: "GH" },
  { label: "LinkedIn", href: "https://linkedin.com/in/pavanjillella", icon: "LI" },
  { label: "LeetCode", href: "https://leetcode.com/pavanjillella", icon: "LC" },
  { label: "YouTube", href: "https://youtube.com/@pavanjillella", icon: "YT" },
];

export function Footer() {
  return (
    <footer className="py-20 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-10 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display font-bold text-2xl text-white"
        >
          PJ<span className="text-blue-400">.</span>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-2"
        >
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card px-5 py-2.5 rounded-full font-mono text-xs text-white/40 hover:text-white transition-all duration-200 hover:border-white/15"
            >
              {s.label}
            </a>
          ))}
        </motion.div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="font-body text-sm text-white/30">Stay in the loop</p>
          <NewsletterForm />
        </motion.div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-mono text-xs text-white/20"
        >
          © {new Date().getFullYear()} Pavan Jillella. Built with Next.js & Framer Motion.
        </motion.p>
      </div>
    </footer>
  );
}
