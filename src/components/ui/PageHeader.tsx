"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  label: string;
  title: string;
  description: string;
  compact?: boolean;
}

export function PageHeader({ label, title, description, compact = false }: PageHeaderProps) {
  return (
    <div className={cn("px-6", compact ? "pt-6 pb-6" : "pt-32 pb-16")}>
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="section-label font-mono text-xs text-blue-400 uppercase tracking-widest mb-4"
        >
          {label}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "font-display font-bold text-white mb-4",
            compact ? "text-2xl md:text-3xl" : "text-4xl md:text-5xl"
          )}
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-body text-lg text-white/40 max-w-2xl"
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
}
