"use client";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card rounded-3xl p-12 text-center"
    >
      <h3 className="font-display font-semibold text-xl text-white mb-3">{title}</h3>
      <p className="font-body text-sm text-white/40 max-w-md mx-auto">{description}</p>
    </motion.div>
  );
}
