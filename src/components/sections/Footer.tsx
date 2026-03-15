"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NewsletterForm } from "@/components/ui/NewsletterForm";

const socials = [
  { label: "GitHub", href: "https://github.com/pavanjillella" },
  { label: "LinkedIn", href: "https://linkedin.com/in/pavanjillella" },
  { label: "LeetCode", href: "https://leetcode.com/pavanjillella" },
  { label: "YouTube", href: "https://youtube.com/@pavanjillella" },
];

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  const router = useRouter();

  return (
    <footer className="py-20 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-10 text-center">
        {/* Currently working on spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06]"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="font-body text-sm text-white/50">
            Currently working on{" "}
            <span className="text-white/70">Google SDE Prep</span>
          </span>
        </motion.div>

        {/* Logo — double-click to access login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display font-bold text-2xl text-white cursor-default select-none"
          onDoubleClick={() => router.push("/login")}
        >
          PJ<span className="text-warm">.</span>
        </motion.div>

        {/* Site navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-sm text-white/40 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </motion.nav>

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

        {/* Copyright + Legal */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[10px] text-white/20 hover:text-white/40 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="font-mono text-xs text-white/20">
            © {new Date().getFullYear()} Pavan Jillella
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
