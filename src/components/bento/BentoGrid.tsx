"use client";
import { ReactNode } from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const bentoItem = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function BentoGrid({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="bento-grid"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}
